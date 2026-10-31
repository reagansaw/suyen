#!/usr/bin/env python3
# 内容片①（C0055）：竖拍原片（存档是横的）→ 转正 1080×1920 → 剪段 → 接起来 → 整支 1.1 倍速
# 剪点落在字与字的空隙（ct/C0055_a.json 逐字时间）。输出 remotion/public/suyenc/c55.mp4 + ct/c55_pieces.json
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(os.environ.get('SUYEN_RAW') or os.path.join(H, '..', 'raw'), 'C0055.MP4')
OUT = os.path.join(H, '..', 'remotion', 'public', 'suyenc', 'c55_v1.mp4')   # v1（无删停顿）只留作 retime 的旧时间轴参考
SPEED = 1.1
PIECES = [  # (起, 止, 内容)
    (128.20, 131.75, '只要看到这四个符号，你马上退三步'),          # 钩子：先讲结论
    (25.20, 26.50, '2027 年'),
    (29.40, 34.45, '真假混是代表一整年的关键词'),
    (36.70, 46.05, '我用三只羊来作为代表：有好的羊、有病的羊、还有一只披着羊皮的狼'),
    (47.25, 52.80, '真真假假，有时候我们很考验一个人的判断能力'),
    (66.20, 73.55, '如果你要来找你合作的人，感觉来了就合作，那我想劝你要小心一点'),
    (91.00, 98.00, '那有人来了，你不知道他是狼是羊对不对？如果他是狼，把你吃掉'),
    (99.85, 102.65, '可以用奇门盘，click 一下看一看'),
    (107.30, 110.55, '对方的这个宫位里面，会不会看到'),
    (116.60, 119.20, '你就需要认住这四个符号'),
    (123.95, 128.20, '天蓬、玄武、朱雀，还有腾蛇'),
    (130.25, 131.75, '你马上退三步'),
    (133.15, 134.40, '想三次'),
    (137.65, 138.55, '不要急'),
    (138.60, 141.45, '慢就是快，快就是慢'),
]
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
tmp = []
for i, (a, b, _) in enumerate(PIECES):
    p = f'{H}/_p{i}.mov'
    run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-ss', f'{a}', '-to', f'{b}', '-i', RAW,
         '-vf', 'transpose=1,scale=1080:1920:flags=lanczos,fps=30,setsar=1', '-af', f'afade=t=in:d=0.006,afade=t=out:st={b - a - 0.008:.3f}:d=0.006,aresample=48000,loudnorm=I=-16:TP=-1.5',
         '-c:v', 'libx264', '-crf', '15', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', p])
    tmp.append(p)
lst = f'{H}/_list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in tmp))
run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-f', 'concat', '-safe', '0', '-i', lst,
     '-vf', f'setpts=PTS/{SPEED},fps=30', '-af', f'atempo={SPEED},loudnorm=I=-16:TP=-1.5', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p',
     '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', OUT])
for p in tmp + [lst]: os.remove(p)
t, meta = 0.0, []
for (a, b, txt) in PIECES:
    d = (b - a) / SPEED; meta.append({'a': a, 'b': b, 'start': round(t, 3), 'end': round(t + d, 3), 'text': txt}); t += d
json.dump({'src': 'C0055', 'speed': SPEED, 'dur': round(t, 3), 'pieces': meta}, open(f'{H}/c55_pieces_v1.json', 'w'), ensure_ascii=False, indent=1)
print(f'c55 {t:.2f}s')
