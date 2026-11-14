#!/usr/bin/env python3
# 内容片剪辑工具：竖拍原片 → 转正 → 按段剪 → 段内长停顿（拖）自动删掉 → 接起来 → 整支加速
# Reagan 10-31：「讲话有点慢」「字跟字中间 gap 有时拖很长……找出这些拖的删了它，节奏快一些」
# 停顿 = 能量低于 SIL_DB 且 ≥ MIN_GAP 秒；删到只留两边各 PAD 秒
# 用法：from cutlib import build; build('C0055', PIECES, 'c55', speed=1.15)
import json, os, subprocess, sys, re
H = os.path.dirname(os.path.abspath(__file__))
RAWDIR = os.environ.get('SUYEN_RAW') or os.path.join(H, '..', 'raw')   # 原片放这里（<编号>.MP4/.mov…，或 export SUYEN_RAW）
PUB = os.path.join(H, '..', 'remotion', 'public', 'suyenc')
SIL_DB, MIN_GAP, PAD = -30, 0.16, 0.06

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
    return r.stderr

def silences(src, a, b):
    err = run(['ffmpeg', '-nostats', '-ss', f'{a}', '-to', f'{b}', '-i', src, '-vn', '-ac', '1', '-ar', '16000', '-af', f'silencedetect=n={SIL_DB}dB:d={MIN_GAP}', '-f', 'null', '-'])
    st = [float(x) + a for x in re.findall(r'silence_start: ([\d.]+)', err)]
    en = [float(x) + a for x in re.findall(r'silence_end: ([\d.]+)', err)]
    while len(en) < len(st): en.append(b)
    return list(zip(st, en))

def split(src, a, b):
    """一段 → 去掉段内长停顿后的小段；头尾的静音也收紧到 PAD"""
    keep, cur = [], a
    for s, e in silences(src, a, b):
        s0, e0 = max(a, s + PAD), min(b, e - PAD)
        if e0 - s0 < 0.05: continue
        if s0 - cur > 0.05: keep.append((cur, s0))
        cur = e0
    if b - cur > 0.05: keep.append((cur, b))
    return [(round(x, 3), round(y, 3)) for x, y in keep]

def find_src(src_id):
    """原片：raw/<编号>.<任何副档名>（MP4 / mov / mp4…）"""
    for f in sorted(os.listdir(RAWDIR)):
        if os.path.splitext(f)[0] == src_id and f.lower().endswith(('.mp4', '.mov', '.m4v', '.mkv')): return os.path.join(RAWDIR, f)
    sys.exit(f'找不到原片 {src_id}.*（放进 {RAWDIR}，或 export SUYEN_RAW=资料夹）')

def src_fps(src):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip()
    n, d = (r.split('/') + ['1'])[:2]
    return float(n) / float(d or 1) if float(n) else 60000 / 1001

def build(src_id, pieces, out_id, speed=1.15, rot=None):
    """rot：1 = 转正（Suyen 相机原片 C00xx：竖拍但存成横的，默认）；0 = 不转（手机竖拍、已经是竖的）。
    不写就看 env CUT_ROT，再不然：档名 C00xx → 1，其他 → 0。画面一律填满 1080×1920（不是 9:16 的会从中间裁）。"""
    src = find_src(src_id)
    if rot is None: rot = int(os.environ.get('CUT_ROT', '1' if re.match(r'C\d{4}$', src_id) else '0'))
    subs = []   # (piece_idx, a, b)
    for i, p in enumerate(pieces):
        if p[2].startswith('【访问员】'): subs.append((i, p[0], p[1]))   # 访问员提问：不删停顿（她在听、画面几乎不动，切碎了就像卡住）
        else:
            for a, b in split(src, p[0], p[1]): subs.append((i, a, b))
    # 每一段：select/aselect 只留没停顿的部分（对齐原片 59.94 格，音画不漂）→ 转正 → 30fps；段跟段再接起来 → 整支加速
    FPS0 = src_fps(src)
    snap = lambda x: round(round(x * FPS0) / FPS0, 4)
    subs = [(i, snap(a), snap(b)) for i, a, b in subs]
    tmp, pdur = [], {}
    for pi in range(len(pieces)):
        rng = [(a, b) for i, a, b in subs if i == pi]
        if not rng: continue
        lo = rng[0][0]; hi = rng[-1][1]
        cond = '+'.join(f'gte(t\\,{a - lo:.4f})*lt(t\\,{b - lo:.4f})' for a, b in rng)
        o = f'{H}/_p{pi}.mov'
        fc = (f"[0:v]select='{cond}',setpts=N/({FPS0:.6f})/TB,{'transpose=1,' if rot else ''}scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,setsar=1,fps=30[v];"
              f"[0:a]aselect='{cond}',asetpts=N/SR/TB,aresample=48000[a]")
        run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-ss', f'{lo}', '-to', f'{hi + 0.05}', '-i', src, '-filter_complex', fc,
             '-map', '[v]', '-map', '[a]', '-ac', '1', '-c:v', 'libx264', '-crf', '15', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-ar', '48000', o])
        tmp.append(o)
        pdur[pi] = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', o], capture_output=True, text=True).stdout.strip())
    lst = f'{H}/_list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in tmp))
    out = os.path.join(PUB, f'{out_id}.mp4')
    run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-f', 'concat', '-safe', '0', '-i', lst,
         '-vf', f'setpts=PTS/{speed},fps=30', '-af', f'atempo={speed},loudnorm=I=-16:TP=-1.5', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p',
         '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', out])
    for p in tmp + [lst]: os.remove(p)
    # 时间表用每段实际的帧长（30fps 取整后）算，特效才对得上
    t, meta = 0.0, []
    for pi in range(len(pieces)):
        rng = [(a, b) for i, a, b in subs if i == pi]
        if not rng: continue
        k = pdur[pi] / sum(b - a for a, b in rng)
        for a, b in rng:
            d = (b - a) * k / speed
            meta.append({'piece': pi, 'a': a, 'b': b, 'start': round(t, 3), 'end': round(t + d, 3)}); t += d
    raw_total = sum(p[1] - p[0] for p in pieces); kept = sum(b - a for _, a, b in subs)
    json.dump({'src': src_id, 'speed': speed, 'dur': round(t, 3), 'pieces': [{'a': p[0], 'b': p[1], 'text': p[2]} for p in pieces], 'subs': meta},
              open(f'{H}/{out_id}_pieces.json', 'w'), ensure_ascii=False, indent=1)
    print(f'{out_id}: raw {raw_total:.1f}s → 删停顿后 {kept:.1f}s（删 {raw_total - kept:.1f}s）→ {speed}× = {t:.2f}s，{len(subs)} 小段')
    return t
