#!/usr/bin/env python3
# 广告第6集（P6 · 全家的退路）：原片剪段 → 接起来 → 整支 1.1 倍速。由 pipeline/eps_plan.py 产生，要改切点就改 eps_plan.py 再重跑
# ⚠ 切点现在是 whisper 分段时间，在 Mac 上逐字转写后要挪到字和字的空隙里（HANDOFF 4.1）
# 只用 C0001–C0048。输出 remotion/public/suyenh/ep6.mp4 + ep6/pieces.json
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('SUYEN_RAW', os.path.expanduser('~/Claude Code/suyen-ads/raw'))   # 原片 C0001–C0048 的资料夹
OUT = os.path.join(H, '..', '..', 'remotion', 'public', 'suyenh', 'ep6.mp4')
SPEED = 1.1
PIECES = [  # (原片, 起, 止, 内容)
    ('C0029', 2.18, 30.12, '2027 年你的奇门战略布局……带你提前思考进退'),
    ('C0037', 3.65, 16.00, '大家好，我是林舒苑……来自于世界各地'),
    ('C0037', 16.22, 19.32, '从上市公司大家族到小家庭'),
    ('C0048', 4.30, 7.40, '我为大家准备了三天完全'),
    ('C0048', 7.70, 11.85, '免费的 2027 年奇门战略大会'),
    ('C0048', 13.57, 23.10, '你在 2027 年那么混乱的赤马红羊年的年代，依然抓准趋势，落实你想要的结果'),
    ('C0048', 27.10, 30.95, '那么马上报名，我们到时见'),
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
print(f'ep6 {t:.2f}s')
