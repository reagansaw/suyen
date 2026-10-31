#!/usr/bin/env python3
# 广告第14集（I5 · 35 岁以后）：原片剪段 → 接起来 → 整支 1.1 倍速。由 pipeline/eps_plan.py 产生，要改切点就改 eps_plan.py 再重跑
# 切点：起点提示 / 止点提示来自逐字转写，这里量原片的真实静音再吸附（起点 = 字前 0.08 秒、止点 = 字后 0.25 秒），句间 >0.45 秒的停顿剪短；
# 介绍段和 CTA 用第 1 集已经校准过的切法（不吸附）。只用 C0001–C0048。输出 remotion/public/suyenh/ep14.mp4 + ep14/pieces.json
import json, os, re, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('SUYEN_RAW', os.path.expanduser('~/Downloads/raw'))   # 原片 C0001–C0048 的资料夹
OUT = os.path.join(H, '..', '..', 'remotion', 'public', 'suyenh', 'ep14.mp4')
SPEED, GAP, PRE, POST = 1.1, 0.45, 0.08, 0.25
NOISE = os.environ.get('NOISE', '-35dB')   # 静音门槛：吸附不到（印出 0 段静音）就改 -30dB 再跑
PIECES = [  # (原片, 起点提示, 止点提示, 最早起点, 最晚止点, 自动剪停顿?, 内容)
    ('C0025', 2.54, 34.12, 2.46, 38.19, True, '2027 奇门年度布局：35 岁以后……先准备第二条路'),
    ('C0037', 3.65, 16.00, 3.65, 16.00, False, '大家好，我是林舒苑……来自于世界各地'),
    ('C0037', 16.22, 19.32, 16.22, 19.32, False, '从上市公司大家族到小家庭'),
    ('C0048', 4.30, 7.40, 4.30, 7.40, False, '我为大家准备了三天完全'),
    ('C0048', 7.70, 11.85, 7.70, 11.85, False, '免费的 2027 年奇门战略大会'),
    ('C0048', 27.10, 33.30, 27.10, 33.30, False, '那么马上报名，我们到时见（+ 讲完挥手笑 2 秒）'),
]
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
    return r
_sil = {}
def silences(src):
    if src not in _sil:
        r = run(['nice', '-n', '10', 'ffmpeg', '-v', 'info', '-threads', '2', '-i', f'{RAW}/{src}.MP4', '-vn', '-af', f'silencedetect=noise={NOISE}:d=0.12', '-f', 'null', '-'])
        st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stderr)]
        en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stderr)]
        _sil[src] = list(zip(st, en))
        print(f'{src}: {len(_sil[src])} 段静音（{NOISE}）')
    return _sil[src]
def snap(src, a, b, amin, bmax):
    sil = silences(src)
    # 起点：落在静音里、或静音刚结束 → 静音结束前 0.08 秒
    c = [e for s, e in sil if s - 0.02 <= a <= e + 0.3 and e <= a + 0.3 or s <= a <= e]
    a2 = (min(c, key=lambda e: abs(e - a)) if c else a) - PRE
    # 止点：最后一个字后面开始的静音 → 静音开始后 0.25 秒（不超过静音结束）
    c = [(s, e) for s, e in sil if b - 0.3 <= s <= b + 0.4]
    b2 = min(c[0][0] + POST, c[0][1] - 0.02) if c else b + POST
    a2, b2 = max(a2, amin), min(b2, bmax)
    # 段内 >GAP 的停顿剪短
    out, cur = [], a2
    for s, e in sil:
        if s > cur + 0.15 and e < b2 - 0.15 and e - s > GAP:
            out.append((cur, s + POST)); cur = e - PRE
    out.append((cur, b2))
    return [(round(x, 3), round(y, 3)) for x, y in out]
cuts = []
for (src, a, b, amin, bmax, auto, txt) in PIECES:
    for x, y in (snap(src, a, b, amin, bmax) if auto else [(a, b)]):
        cuts.append((src, x, y, txt))
raw = sum(y - x for _, x, y, _ in cuts)
print(f'原片接起来 {raw:.2f} 秒 → 成片 {raw / SPEED:.2f} 秒（{len(cuts)} 刀）')
if raw > 66.0: print('⚠ 超过 66 秒（加速后超过 60 秒）：到 eps_plan.py 把这集 cta 改成 CTA1S，或删一句'); sys.exit(1)
tmp = []
for i, (src, a, b, _) in enumerate(cuts):
    p = f'{H}/_p{i}.mov'
    run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-ss', f'{a}', '-to', f'{b}', '-i', f'{RAW}/{src}.MP4',
         '-vf', 'scale=1920:1080:flags=lanczos,fps=30,setsar=1', '-af', f'afade=t=in:d=0.006,afade=t=out:st={b - a - 0.008:.3f}:d=0.006,aresample=48000,loudnorm=I=-16:TP=-1.5',
         '-c:v', 'libx264', '-crf', '15', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', p])
    tmp.append(p)
lst = f'{H}/_list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in tmp))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-f', 'concat', '-safe', '0', '-i', lst,
     '-vf', f'setpts=PTS/{SPEED},fps=30', '-af', f'atempo={SPEED},loudnorm=I=-16:TP=-1.5', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p',
     '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', OUT])
for p in tmp + [lst]: os.remove(p)
t, meta = 0.0, []
for (src, a, b, txt) in cuts:
    d = (b - a) / SPEED; meta.append({'src': src, 'a': a, 'b': b, 'start': round(t, 3), 'end': round(t + d, 3), 'text': txt}); t += d
json.dump({'speed': SPEED, 'dur': round(t, 3), 'pieces': meta}, open(f'{H}/pieces.json', 'w'), ensure_ascii=False, indent=1)
print(f'ep14 {t:.2f}s')
