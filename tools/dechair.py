"""把人像抠像里混进来的黄色沙发去掉（按色相：黄、够饱和、够亮 → alpha 0），输出新的透明 webm。
用法：python dechair.py <原片.mp4> <抠像.webm> <输出.webm>"""
import subprocess, sys, numpy as np
src, matte, out = sys.argv[1:4]
W, H = 1920, 1080
rd = lambda args: subprocess.Popen(['nice', '-n', '19', 'ffmpeg', '-v', 'error', '-threads', '2'] + args + ['-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
a = rd(['-c:v', 'libvpx-vp9', '-i', matte, '-vf', 'alphaextract,format=gray'])
c = rd(['-i', src, '-pix_fmt', 'rgb24'])
enc = subprocess.Popen(['nice', '-n', '19', 'ffmpeg', '-v', 'error', '-y', '-threads', '2', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', out], stdin=subprocess.PIPE)
n = 0
while True:
    ab = a.stdout.read(W * H); cb = c.stdout.read(W * H * 3)
    if len(ab) < W * H or len(cb) < W * H * 3: break
    al = np.frombuffer(ab, np.uint8).reshape(H, W).astype(np.float32)
    rgb = np.frombuffer(cb, np.uint8).reshape(H, W, 3).astype(np.float32) / 255
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1); d = mx - mn + 1e-6
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    sat = d / (mx + 1e-6)
    # 黄色沙发：色相 38–68°、饱和 ≥0.22、亮度 ≥0.3；边缘用软过渡
    yel = np.clip((sat - 0.18) / 0.1, 0, 1) * np.clip((mx - 0.25) / 0.1, 0, 1) * np.clip(1 - np.abs(hue - 53) / 15, 0, 1) * 2
    yel = np.clip(yel, 0, 1)
    al = al * (1 - yel)
    al = np.clip((al - 70) / (255 - 70) * 255, 0, 255)   # 沙发阴影那种很淡的残留直接切掉
    out_px = np.dstack([rgb * 255, al]).astype(np.uint8)
    enc.stdin.write(out_px.tobytes()); n += 1
enc.stdin.close(); enc.wait()
print('frames', n)
