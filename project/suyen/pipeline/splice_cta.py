"""换了 CTA、前面剪段不变时：只重抠 / 重追新的 CTA 那段，前面沿用旧的遮罩和脸轨迹，接起来（省掉整集重抠）。
用法（repo 根目录）：python3 pipeline/splice_cta.py N <旧遮罩.mp4> <旧脸.json> [CTA 原片=C0048] [CTA 起始脸 x y]
- 先跑 prep_epN.py 产生新的 epN.mp4 / pieces.json，并确认 CTA 前面的剪段跟旧的一样
- 输出：/tmp/m_epN.mp4（整集遮罩）、remotion/public/suyenh/pf/epN.webm、/tmp/face_epN.json、src/suyenh-face/track-epN.json
- C0048 是坐黄椅子的片：MIN_OVERLAP=0.02（椅子整张留着，HANDOFF 2-5）"""
import json, os, subprocess, sys
n, old_m, old_f = int(sys.argv[1]), sys.argv[2], sys.argv[3]
src = sys.argv[4] if len(sys.argv) > 4 else 'C0048'
fx, fy = (sys.argv[5], sys.argv[6]) if len(sys.argv) > 6 else ('1000', '340')
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(R)
V = f'remotion/public/suyenh/ep{n}.mp4'; T = f'/tmp/ep{n}_cta'
P = json.load(open(f'pipeline/ep{n}/pieces.json'))['pieces']
F0 = round(next(p['start'] for p in P if p['src'] == src) * 30)
def run(*c, env=None): subprocess.run(['nice', '-n', '19', *c], check=True, env=env)
ff = lambda *a: run('ffmpeg', '-v', 'error', '-y', '-threads', '2', *a)
# 1. 新 CTA 那段 → 抠像 + 追脸
ff('-i', V, '-vf', f"select='gte(n\\,{F0})',setpts=N/30/TB", '-an', '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', f'{T}.mp4')
run('tools/subjectmatte', f'{T}.mp4', f'{T}_m.mp4', env={**os.environ, 'MIN_OVERLAP': '0.02'} if src == 'C0048' else None)
run('tools/facetrack', f'{T}.mp4', f'{T}_f.json', fx, fy)
# 2. 遮罩：旧的前 F0 格 + 新的
ff('-i', old_m, '-i', f'{T}_m.mp4', '-filter_complex', f"[0:v]trim=end_frame={F0},setpts=PTS-STARTPTS,format=yuv420p[a];[1:v]format=yuv420p,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1[v]",
   '-map', '[v]', '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', '-r', '30', f'/tmp/m_ep{n}.mp4')
ff('-i', V, '-i', f'/tmp/m_ep{n}.mp4', '-filter_complex', "[1:v]format=gray,erosion,erosion,gblur=sigma=1.3,lutyuv=y='clip((val-28)*1.18,0,255)'[m];[0:v][m]alphamerge,format=yuva420p[v]",
   '-map', '[v]', '-an', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-deadline', 'realtime', '-cpu-used', '8', '-b:v', '6M', '-auto-alt-ref', '0', f'remotion/public/suyenh/pf/ep{n}.webm')
# 3. 脸：旧的前 F0 格 + 新的 → 平滑 7 格 → 护脸层 / 圆框（y+150）
of, nf = json.load(open(old_f)), json.load(open(f'{T}_f.json'))
f = {k: of[k][:F0] + nf[k] for k in ('x', 'y')}; json.dump(f, open(f'/tmp/face_ep{n}.json', 'w'))
N = len(f['x']); sm = lambda v: [round(sum(v[max(0, i - 3):i + 4]) / len(v[max(0, i - 3):i + 4]), 1) for i in range(N)]
x, y = sm(f['x']), sm(f['y'])
json.dump({'x': x, 'y': y}, open(f'remotion/src/suyenh-face-ep{n}.json', 'w'))
json.dump({'x': x, 'y': [round(v + 150, 1) for v in y]}, open(f'remotion/src/suyenh-track-ep{n}.json', 'w'))
cnt = lambda p: subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip()
print(f'ep{n}: CTA 从第 {F0} 格起；影片 {cnt(V)} 格、遮罩 {cnt(f"/tmp/m_ep{n}.mp4")} 格、脸 {N} 格')
