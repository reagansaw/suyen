"""竖版内容片加「首页 1 帧海报 + 下 banner」（格式见 docs/内容片-首页帧+下banner.md）。
用法（repo 根目录）：python3 pipeline/cover_banner.py <成片.mp4> <海报图> <输出.mp4> [--scale 1.22] [--x 35] [--phone]
- 第 1 帧 = 海报（满屏 1080×1920，没有 banner），第 2 帧起是影片，下面一直有 banner
- 海报是 3:4：放大 --scale 倍、左边起 --x 裁 1080 宽（让左边大字不被切、人脸完整），下面不够的用海报最下面镜像补满（不模糊）
- 下 banner：remotion/public/suyenc/banner_bottom.webp 原图 2000×530，缩成 1080 宽贴底
- --phone：另外出手机版（crf 25、maxrate 6M）"""
import argparse, os, subprocess, tempfile
ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('poster'); ap.add_argument('out')
ap.add_argument('--scale', type=float, default=1.22); ap.add_argument('--x', type=int, default=35)
ap.add_argument('--phone', action='store_true')
a = ap.parse_args()
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
banner = f'{R}/remotion/public/suyenc/banner_bottom.webp'
w, h = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', a.poster],
                      capture_output=True, text=True, check=True).stdout.strip().split(',')
sw = round(1080 * a.scale)
sh = round(int(h) * sw / int(w)); gap = 1920 - sh
assert gap >= 0, '--scale 太大，海报高度超过 1920'
cover = os.path.join(tempfile.mkdtemp(), 'cover.png')
vf = f'scale={sw}:{sh},crop=1080:{sh}:{a.x}:0'
if gap:
    vf += f',split[a][b];[b]crop=1080:{gap}:0:{sh - gap},vflip[c];[a][c]vstack'
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', a.poster, '-vf', vf, cover], check=True)
fc = '[2]scale=1080:-2[b];[0][b]overlay=0:H-h:shortest=1[v1];[v1][1]overlay=0:0:enable=\'lt(n,1)\':shortest=1[v]'
enc = ['-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart']
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', a.src, '-loop', '1', '-i', cover, '-loop', '1', '-i', banner,
                '-filter_complex', fc, '-map', '[v]', '-map', '0:a', *enc, a.out], check=True)
print('done', a.out)
if a.phone:
    ph = a.out.replace('.mp4', '-手机.mp4')
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', a.out, '-c:v', 'libx264', '-crf', '25', '-maxrate', '6M',
                    '-bufsize', '12M', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', ph], check=True)
    print('done', ph)
