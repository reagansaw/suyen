#!/usr/bin/env python3
# Suyen 钩子探针：按原片秒数切段 → 接起来 → 9:16 1080×1920 30fps → remotion/public/suyen/<id>.mp4
# 同时把逐字时间（hk/*.json）换算到成片时间 → remotion/src/suyen-hooks.json（字效/字幕钉字用）
import json, glob, os, subprocess, sys

H = os.path.dirname(os.path.abspath(__file__))
HOR = os.environ.get('MODE') == 'h'   # 横版 16:9：横拍不裁，竖拍(C0057)保持 1080×1920 放卡片
REPO = os.path.join(H, '..')
RAWDIR = os.environ.get('SUYEN_RAW', os.path.expanduser('~/Claude Code/suyen-ads/raw'))
OUT = os.path.join(REPO, 'remotion', 'public', 'suyenh' if HOR else 'suyen')
JS = os.path.join(REPO, 'remotion', 'src', 'suyenh-hooks.json' if HOR else 'suyen-hooks.json')
os.makedirs(OUT, exist_ok=True)

# 画面：横拍裁 608 宽（x0 = 左边界，按人脸量的），竖拍（相机转 90 度）用 transpose=1
CROP = {'C0004': 'crop=608:1080:618:0', 'C0019': 'crop=608:1080:690:0', 'C0029': 'crop=608:1080:540:0', 'C0057': 'transpose=1'}

# 每支：[(原片, 起, 止), …]（原片秒；起止都落在字与字的空隙里）
HOOKS = {
    's4': [('C0057', 394.35, 395.95),    # 2024 年 我
           ('C0057', 396.80, 399.75),    # 给大家的关键字叫做 盲
           ('C0057', 401.90, 403.20),    # 盲盒就爆了
           ('C0057', 437.62, 439.55),    # 2025 年 叛逆乱（437.22 有一声 ok，要避开）
           ('C0057', 439.82, 442.35),    # 2026 年 快狠暴
           ('C0057', 481.45, 483.38),    # 那么来到 2027 年
           ('C0057', 483.86, 485.15),    # 真假混
           ('C0057', 485.15, 490.30)],   # 那么这三个关键字你要不要学 / 听 / 了解更多
    'p1': [('C0004', 1.90, 15.95)],      # 七位数八位数……才有机会冲翻倍呢？
    'i2': [('C0019', 2.20, 21.75)],      # 奇门讲究布局破局……一起烧掉
    'p6': [('C0029', 1.95, 18.12)],      # 2027 年……十年的储蓄
}

def words_of(src):
    out = []
    for f in glob.glob(f'{H}/hk/{src}_*.json'):   # hk/ = 钩子那几秒的逐字时间（mlx_whisper word timestamps），新钩子要先转写放这里
        off = float(os.path.basename(f).split('_')[1][:-5])
        for s in json.load(open(f))['segments']:
            for w in s.get('words', []):
                out.append((w['start'] + off, w['end'] + off, w['word'].strip()))
    return sorted(out)

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2000:]); sys.exit(1)

meta = {}
for hid, pieces in HOOKS.items():
    parts, t, words, cuts = [], 0.0, [], []
    for i, (src, a, b) in enumerate(pieces):
        p = f'{OUT}/_{hid}_{i}.mp4'
        vf = (f"{CROP[src]},scale=1080:1920:flags=lanczos,unsharp=5:5:0.6,fps=30,setsar=1" if not HOR or src == 'C0057'
              else "scale=1920:1080:flags=lanczos,fps=30,setsar=1")
        run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-ss', f'{a}', '-to', f'{b}', '-i', f'{RAWDIR}/{src}.MP4',
             '-vf', vf, '-af', f'afade=t=in:d=0.005,afade=t=out:st={b - a - 0.006:.3f}:d=0.005,aresample=48000',
             '-c:v', 'libx264', '-crf', '17', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', p.replace('.mp4', '.mov')])
        parts.append(p.replace('.mp4', '.mov'))
        for (s, e, w) in words_of(src):
            if s >= a - 0.02 and s < b - 0.05:
                words.append({'w': w, 't': round(t + max(0, s - a), 3), 'e': round(t + min(e, b) - a, 3)})
        if i: cuts.append(round(t, 3))
        t += b - a
    lst = f'{OUT}/_{hid}.txt'
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-f', 'concat', '-safe', '0', '-i', lst,
         '-c:v', 'libx264', '-crf', '17', '-preset', 'fast', '-pix_fmt', 'yuv420p',
         '-af', 'loudnorm=I=-16:TP=-1.5', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', f'{OUT}/{hid}.mp4'])
    for p in parts + [lst]: os.remove(p)
    meta[hid] = {'dur': round(t, 3), 'cuts': cuts, 'words': words}
    print(f'{hid}: {t:.2f}s  {len(pieces)} 段  {len(words)} 字')

json.dump(meta, open(JS, 'w'), ensure_ascii=False, indent=1)
