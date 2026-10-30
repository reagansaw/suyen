"""从人像遮罩逐帧算出「半身圆框」要对准的点（头顶往下 300px、头部水平中心），平滑后写成 JSON，让圆框一直跟着人。
用法：python track_pip.py <matte.mp4> <out.json>"""
import json, subprocess, sys, numpy as np
mp, out = sys.argv[1:3]
W, H = 1920, 1080
p = subprocess.Popen(['nice', '-n', '19', 'ffmpeg', '-v', 'error', '-threads', '2', '-i', mp, '-vf', 'scale=480:270,format=gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
xs, ys = [], []
k = W / 480
while True:
    b = p.stdout.read(480 * 270)
    if len(b) < 480 * 270: break
    a = np.frombuffer(b, np.uint8).reshape(270, 480) > 128
    rows = np.where(a.sum(1) > 4)[0]
    if len(rows) == 0:
        xs.append(xs[-1] if xs else W / 2); ys.append(ys[-1] if ys else H / 2); continue
    top = rows[0]; band = a[top:top + 65]           # 头部那一段（约 260px）
    cx = np.where(band)[1].mean() * k
    xs.append(cx); ys.append(top * k + 300)
def smooth(v, n=11):
    v = np.array(v, float); pad = np.pad(v, n // 2, mode='edge')
    return np.convolve(pad, np.ones(n) / n, mode='valid')
json.dump({'x': [round(x, 1) for x in smooth(xs)], 'y': [round(y, 1) for y in smooth(ys)]}, open(out, 'w'))
print(len(xs), 'frames', 'x range', round(min(xs)), round(max(xs)))
