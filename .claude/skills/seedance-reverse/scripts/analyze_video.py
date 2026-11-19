#!/usr/bin/env python3
"""把一条参考视频拆成「镜头条」，给 AI 自己看图反推。

只用 Python 标准库 + ffmpeg/ffprobe，不需要任何 API key。

用法:
    python3 analyze_video.py <视频路径> [--out 输出目录] [--scene 0.18] [--min-shot 0.5] [--step 0.25]
    python3 analyze_video.py <视频路径> --out 输出目录 --slow 31.5 36 [--fps 8]   慢拉片: 逐帧看一小段

输出 (在输出目录里):
    storyboard.json          每个镜头的起止时间、镜头条路径、每一格对应的秒数
    shots/shot_01.jpg ...    每个镜头一张「镜头条」: 同一镜头里按时间顺序排开的几格画面
    audio.wav                16k 单声道音轨 (有声音才有)
    transcript.txt           口播逐字稿 (本机装了 whisper 才有, 没有就跳过)
"""
import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys

COLS = 6          # 镜头条每行几格
TILE_W = 300      # 每格宽度 (px)
MAX_TILES = 24    # 一个镜头最多几格 (4 行)
STEP = 0.25       # 镜头条每隔几秒拉一格 (默认每秒 4 格，看得出慢慢移动的运镜)


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, errors="replace")


def need(tool):
    if not shutil.which(tool):
        sys.exit(
            f"找不到 {tool}。请先安装 ffmpeg:\n"
            "  Mac:     brew install ffmpeg\n"
            "  Windows: winget install ffmpeg\n"
            "装好后重开终端再试。"
        )


def probe(video):
    r = run(["ffprobe", "-v", "error", "-print_format", "json",
             "-show_format", "-show_streams", video])
    if r.returncode != 0:
        sys.exit(f"读不到这个视频: {video}\n{r.stderr.strip()}")
    info = json.loads(r.stdout)
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), None)
    if not v:
        sys.exit("这个文件里没有视频画面。")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    num, den = (v.get("r_frame_rate") or "30/1").split("/")
    fps = float(num) / float(den) if float(den) else 30.0
    w, h = int(v["width"]), int(v["height"])
    # 手机视频常带旋转标记
    rot = 0
    for sd in v.get("side_data_list", []) or []:
        if "rotation" in sd:
            rot = abs(int(sd["rotation"]))
    if rot in (90, 270):
        w, h = h, w
    return {
        "duration": float(info["format"]["duration"]),
        "width": w, "height": h, "fps": round(fps, 2),
        "has_audio": a is not None,
    }


def ratio_name(w, h):
    r = w / h
    table = {"9:16": 9 / 16, "16:9": 16 / 9, "1:1": 1.0, "3:4": 3 / 4,
             "4:3": 4 / 3, "21:9": 21 / 9}
    return min(table, key=lambda k: abs(table[k] - r))


def detect_cuts(video, threshold):
    r = run(["ffmpeg", "-hide_banner", "-i", video, "-an",
             "-vf", f"select='gt(scene,{threshold})',showinfo",
             "-f", "null", "-"])
    return [float(x) for x in re.findall(r"pts_time:([0-9.]+)", r.stderr)]


def build_shots(cuts, duration, min_shot):
    edges = [0.0]
    for c in sorted(cuts):
        if c - edges[-1] >= min_shot and duration - c >= min_shot:
            edges.append(c)
    edges.append(duration)
    return [(edges[i], edges[i + 1]) for i in range(len(edges) - 1)]


def tile_times(start, end, step=STEP):
    dur = end - start
    n = max(3, min(MAX_TILES, math.ceil(dur / step) + 1))
    pad = min(0.08, dur / 10)          # 避开剪辑点上的混帧
    a, b = start + pad, end - pad
    return [round(a + (b - a) * i / (n - 1), 2) for i in range(n)]


def make_strip(video, times, out_path, tmp_dir):
    frames = []
    for i, t in enumerate(times):
        f = os.path.join(tmp_dir, f"f_{i:02d}.jpg")
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
             "-ss", f"{t:.2f}", "-i", video, "-frames:v", "1",
             "-vf", f"scale={TILE_W}:-2", "-q:v", "3", f])
        if os.path.exists(f):
            frames.append(f)
    if not frames:
        return False
    rows = math.ceil(len(frames) / COLS)
    cols = min(COLS, len(frames))
    r = run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
             "-framerate", "1", "-i", os.path.join(tmp_dir, "f_%02d.jpg"),
             "-vf", f"tile={cols}x{rows}:padding=6:color=white",
             "-frames:v", "1", "-q:v", "3", out_path])
    for f in frames:
        os.remove(f)
    return r.returncode == 0 and os.path.exists(out_path)


def slow(video, out, tmp_dir, start, end, fps):
    """慢拉片: 把一小段逐帧拉出来, 每张最多 24 格, 每格标的秒数印在终端上。"""
    if end <= start:
        sys.exit("--slow 的止要比起大")
    n = int((end - start) * fps) + 1
    times = [round(start + i / fps, 2) for i in range(n)]
    os.makedirs(os.path.join(out, "slow"), exist_ok=True)
    for k in range(0, len(times), MAX_TILES):
        chunk = times[k:k + MAX_TILES]
        path = os.path.join(out, "slow", f"slow_{chunk[0]:.2f}-{chunk[-1]:.2f}.jpg")
        make_strip(video, chunk, path, tmp_dir)
        print(f"{os.path.relpath(path, out)}  每格秒数 (左到右、上到下，每行 {COLS} 格):")
        for r in range(0, len(chunk), COLS):
            print("   " + "  ".join(f"{x:.2f}" for x in chunk[r:r + COLS]))
    shutil.rmtree(tmp_dir, ignore_errors=True)


def transcribe(wav, out_dir):
    """本机有 whisper 就转写, 没有就返回 None (不算失败)。"""
    txt = os.path.join(out_dir, "transcript.txt")
    if shutil.which("whisper-cli"):
        models = []
        for d in (os.environ.get("WHISPER_MODEL_DIR", ""),
                  os.path.expanduser("~/.cache/whisper"),
                  os.path.expanduser("~/whisper-models"),
                  "/opt/homebrew/share/whisper-cpp",
                  "/usr/local/share/whisper-cpp"):
            if d and os.path.isdir(d):
                models += [os.path.join(d, f) for f in sorted(os.listdir(d))
                           if f.startswith("ggml-") and f.endswith(".bin")]
        if models:
            base = os.path.join(out_dir, "transcript")
            r = run(["whisper-cli", "-m", models[-1], "-f", wav,
                     "-l", "auto", "-otxt", "-of", base])
            if r.returncode == 0 and os.path.exists(txt):
                return txt
    if shutil.which("whisper"):
        r = run(["whisper", wav, "--model", "small", "--output_format", "txt",
                 "--output_dir", out_dir])
        cand = os.path.join(out_dir, "audio.txt")
        if r.returncode == 0 and os.path.exists(cand):
            os.replace(cand, txt)
            return txt
    return None


def main():
    ap = argparse.ArgumentParser(description="把参考视频拆成镜头条")
    ap.add_argument("video")
    ap.add_argument("--out", default=None, help="输出目录 (默认: 视频旁边的 <文件名>_反推/)")
    ap.add_argument("--scene", type=float, default=0.18,
                    help="切镜灵敏度 0-1, 越小切得越细 (默认 0.18)")
    ap.add_argument("--min-shot", type=float, default=0.5,
                    help="最短镜头秒数, 比这短的并进前一个镜头 (默认 0.5)")
    ap.add_argument("--step", type=float, default=STEP,
                    help=f"镜头条每隔几秒拉一格 (默认 {STEP}，越小越细)")
    ap.add_argument("--slow", nargs=2, type=float, metavar=("起", "止"),
                    help="慢拉片: 只把这一段秒数逐帧拉出来 (例: --slow 31.5 36)，看清楚运镜怎么走、是切还是一镜到底")
    ap.add_argument("--fps", type=float, default=8, help="--slow 时每秒拉几格 (默认 8)")
    args = ap.parse_args()

    need("ffmpeg")
    need("ffprobe")
    video = os.path.abspath(os.path.expanduser(args.video))
    if not os.path.isfile(video):
        sys.exit(f"找不到视频文件: {video}")

    stem = os.path.splitext(os.path.basename(video))[0]
    out = os.path.abspath(args.out or os.path.join(os.path.dirname(video), stem + "_反推"))
    shots_dir = os.path.join(out, "shots")
    tmp_dir = os.path.join(out, ".tmp")
    os.makedirs(shots_dir, exist_ok=True)
    os.makedirs(tmp_dir, exist_ok=True)

    meta = probe(video)
    if args.slow:
        slow(video, out, tmp_dir, args.slow[0], min(args.slow[1], meta["duration"]), args.fps)
        return
    cuts = detect_cuts(video, args.scene)
    shots = build_shots(cuts, meta["duration"], args.min_shot)

    board = []
    for i, (s, e) in enumerate(shots, 1):
        times = tile_times(s, e, args.step)
        strip = os.path.join(shots_dir, f"shot_{i:02d}.jpg")
        ok = make_strip(video, times, strip, tmp_dir)
        board.append({
            "shot": i,
            "start": round(s, 2), "end": round(e, 2), "duration": round(e - s, 2),
            "strip": os.path.relpath(strip, out) if ok else None,
            "tile_times": times,   # 镜头条从左到右、从上到下, 每一格对应的秒数
        })
    shutil.rmtree(tmp_dir, ignore_errors=True)

    transcript = None
    if meta["has_audio"]:
        wav = os.path.join(out, "audio.wav")
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", video,
             "-vn", "-ac", "1", "-ar", "16000", wav])
        if os.path.exists(wav):
            transcript = transcribe(wav, out)

    result = {
        "source": video,
        "duration": round(meta["duration"], 2),
        "width": meta["width"], "height": meta["height"],
        "aspect_ratio": ratio_name(meta["width"], meta["height"]),
        "fps": meta["fps"],
        "has_audio": meta["has_audio"],
        "transcript": os.path.relpath(transcript, out) if transcript else None,
        "shot_count": len(board),
        "shots": board,
    }
    with open(os.path.join(out, "storyboard.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"输出目录: {out}")
    print(f"总长 {result['duration']}s · {result['aspect_ratio']} · {len(board)} 个镜头")
    for b in board:
        print(f"  镜头{b['shot']:02d}  {b['start']:>6.2f}s - {b['end']:>6.2f}s  "
              f"({b['duration']}s, {len(b['tile_times'])} 格)  {b['strip']}")
    if not meta["has_audio"]:
        print("这条视频没有声音。")
    elif transcript:
        print(f"逐字稿: {transcript}")
    else:
        print("没有逐字稿 (本机没装 whisper)。台词请看画面字幕, 或请用户贴出来。")


if __name__ == "__main__":
    main()
