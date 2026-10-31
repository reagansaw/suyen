"""遮罩只留她本人：她脸中心（facetrack）左边超过 GATE px 的部分清掉（去掉海报上印着的人等）。
用法：python gate_matte.py <matte.mp4> <face.json> <out_matte.mp4> [GATE=520] [SIDE=left|right] [到第几帧为止，默认整支]"""
import json, subprocess, sys, numpy as np
mp, fj, out = sys.argv[1:4]; gate = float(sys.argv[4]) if len(sys.argv) > 4 else 520
side = sys.argv[5] if len(sys.argv) > 5 else 'left'; upto = int(sys.argv[6]) if len(sys.argv) > 6 else 10**9
W, H = 1920, 1080
fc = json.load(open(fj))
r = subprocess.Popen(['nice', '-n', '19', 'ffmpeg', '-v', 'error', '-threads', '2', '-i', mp, '-vf', 'format=gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
w = subprocess.Popen(['nice', '-n', '19', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                      '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
xs = np.arange(W, dtype=np.float32); i = 0
while True:
    b = r.stdout.read(W * H)
    if len(b) < W * H: break
    a = np.frombuffer(b, np.uint8).reshape(H, W).astype(np.float32)
    cx = fc['x'][min(i, len(fc['x']) - 1)]
    d = (cx - xs) if side == 'left' else (xs - cx)                 # 只切海报那一边
    keep = np.clip(1 - (d - gate) / 80, 0, 1) if i < upto else 1  # 80px 软边
    w.stdin.write((a * (keep[None, :] if i < upto else 1)).astype(np.uint8).tobytes()); i += 1
w.stdin.close(); w.wait(); print('frames', i)
