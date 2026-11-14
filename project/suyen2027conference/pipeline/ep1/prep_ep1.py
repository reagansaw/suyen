#!/usr/bin/env python3
# 广告第一集：原片剪段 → 接起来 → 整支 1.1 倍速（Reagan：「维持在 1 分钟以内，可以调整 1.1 倍快」）
# 只用 C0001–C0048。剪点都落在字与字的空隙（ep1/*.json 逐字时间）。
# 输出 remotion/public/suyenh/ep1.mp4 + ep1/pieces.json（每段在成片里的起止秒）
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('SUYEN_RAW', os.path.expanduser('~/Claude Code/suyen-ads/raw'))   # 原片 C0001–C0048 的资料夹
OUT = os.path.join(H, '..', '..', 'remotion', 'public', 'suyenh', 'ep1.mp4')
SPEED = 1.1
PIECES = [  # (原片, 起, 止, 内容)
    ('C0004', 1.90, 18.45, '钩子 + 奇门遁甲战略大会'),
    ('C0004', 18.90, 24.45, '我将会用年度的年盘，拆解趋势、格局'),
    ('C0004', 24.92, 28.10, '以及对的宫位、方向、时间点'),
    ('C0004', 28.36, 32.62, '带你找准投入以及防守的重点'),
    ('C0037', 3.65, 16.00, '大家好，我是林舒苑……来自于世界各地'),
    ('C0037', 16.22, 19.32, '从上市公司大家族到小家庭'),
    ('C0048', 4.30, 11.85, '我为大家准备了三天完全免费的 2027 年奇门战略大会'),   # 不切：以前切在「完全」中间会卡顿（Reagan 10-31）
    ('C0048', 13.57, 23.35, '你在 2027 年那么混乱的赤马红羊年的年代，依然抓准趋势，落实你想要的结果'),
    ('C0048', 27.10, 31.55, '那么马上报名，我们到时见'),
]
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
tmp = []
for i, (src, a, b, _) in enumerate(PIECES):
    p = f'{H}/_p{i}.mov'
    run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-ss', f'{a}', '-to', f'{b}', '-i', f'{RAW}/{src}.MP4',
         '-vf', 'scale=1920:1080:flags=lanczos,fps=30,setsar=1', '-af', f'afade=t=in:d=0.006,afade=t=out:st={b - a - 0.008:.3f}:d=0.006,aresample=48000,loudnorm=I=-16:TP=-1.5',
         '-c:v', 'libx264', '-crf', '15', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', p])
    tmp.append(p)
lst = f'{H}/_list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in tmp))
run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-f', 'concat', '-safe', '0', '-i', lst,
     '-vf', f'setpts=PTS/{SPEED},fps=30', '-af', f'atempo={SPEED},loudnorm=I=-16:TP=-1.5', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p',
     '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', OUT])
for p in tmp + [lst]: os.remove(p)
t, meta = 0.0, []
for (src, a, b, txt) in PIECES:
    d = (b - a) / SPEED; meta.append({'src': src, 'a': a, 'b': b, 'start': round(t, 3), 'end': round(t + d, 3), 'text': txt}); t += d
json.dump({'speed': SPEED, 'dur': round(t, 3), 'pieces': meta}, open(f'{H}/pieces.json', 'w'), ensure_ascii=False, indent=1)
print(f'ep1 {t:.2f}s')
