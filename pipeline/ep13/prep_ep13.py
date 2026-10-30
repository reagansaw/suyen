#!/usr/bin/env python3
# 广告第13集（I4 · 生肖牛、鼠 · 第一次创业）：原片剪段 → 接起来 → 整支 1.1 倍速。由 pipeline/eps_plan.py 产生，要改切点就改 eps_plan.py 再重跑
# ⚠ 切点现在是 whisper 分段时间，在 Mac 上逐字转写后要挪到字和字的空隙里（HANDOFF 4.1）
# 只用 C0001–C0048。输出 remotion/public/suyenh/ep13.mp4 + ep13/pieces.json
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('SUYEN_RAW', os.path.expanduser('~/Claude Code/suyen-ads/raw'))   # 原片 C0001–C0048 的资料夹
OUT = os.path.join(H, '..', '..', 'remotion', 'public', 'suyenh', 'ep13.mp4')
SPEED = 1.1
PIECES = [  # (原片, 起, 止, 内容)
    ('C0021', 3.94, 25.50, '八字中有牛和老鼠的人……几十万已经出了'),
    ('C0021', 30.46, 38.78, '从奇门遁甲的角度，你不仅仅有破太岁、害太岁，大耗还有小耗凶星'),
    ('C0021', 39.82, 43.20, '那来到老师的战略大会里呢'),
    ('C0021', 47.30, 55.06, '我会从奇门年盘来解读年度趋势，带你思考起步节奏'),
    ('C0037', 3.65, 16.00, '大家好，我是林舒苑……来自于世界各地'),
    ('C0021', 61.36, 73.00, '那么生肖牛和老鼠的人，你们还怕吗？来参加舒苑老师的奇门遁甲战略大会，来获得先机'),
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
print(f'ep13 {t:.2f}s')
