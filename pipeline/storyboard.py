#!/usr/bin/env python3
"""分镜检查图（HANDOFF 4.4）：每 2.5 秒一格，每个大字 / 印章 / B-roll 进场后 +0.15 秒、+0.6 秒各一格 → 拼成有时间标签的总览图
用法（在 repo 根目录，Mac 上）：uvx --with pillow python pipeline/storyboard.py 2
输出 docs/review/第N集-分镜-1.jpg、-2.jpg …（每张 5×5 格）"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
n = int(sys.argv[1]); comp = f'SuyenEp{n}'
src = open(f'{R}/remotion/src/SuyenHooksE.tsx').read()
blk = re.search(rf'/\* ===== EP{n} START.*?/\* ===== EP{n} END', src, re.S).group(0)
dur = json.load(open(f'{R}/remotion/src/suyen-ep{n}.json'))['dur']
ins = sorted({float(x) for x in re.findall(r'(?:at=\{|from=\{|T\()([\d.]+)', blk)})
ts = [round(k * 2.5 + 0.3, 2) for k in range(int(dur / 2.5) + 1)] + [round(a + d, 2) for a in ins for d in (0.15, 0.6)]
ts = sorted(t for t in set(ts) if t < dur + 0.5)
pick = []
for t in ts:
    if not pick or t - pick[-1] >= 0.3: pick.append(t)
shots = [[comp, f'sb{n}_{t:06.2f}', t] for t in pick]
out = f'{R}/remotion/out/stills'
subprocess.run(['nice', '-n', '19', 'node', 'scripts/stills.mjs', json.dumps(shots)], cwd=f'{R}/remotion', check=True)
font = next((ImageFont.truetype(p, 30) for p in ['/System/Library/Fonts/STHeiti Medium.ttc', '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'] if os.path.exists(p)), ImageFont.load_default())
os.makedirs(f'{R}/docs/review', exist_ok=True)
w, h, cols, per = 480, 270, 5, 25
for k in range(0, len(shots), per):
    grp = shots[k:k + per]; rows = (len(grp) + cols - 1) // cols
    sh = Image.new('RGB', (cols * w, rows * (h + 44)), (20, 16, 12)); d = ImageDraw.Draw(sh)
    for i, (_, name, t) in enumerate(grp):
        x, y = (i % cols) * w, (i // cols) * (h + 44)
        sh.paste(Image.open(f'{out}/{name}.jpg').resize((w, h)), (x, y + 44))
        d.text((x + 10, y + 6), f'{int(t // 60)}:{t % 60:05.2f}', fill=(232, 199, 126), font=font)
    p = f'{R}/docs/review/第{n}集-分镜-{k // per + 1}.jpg'; sh.save(p, quality=85); print(p)
for _, name, _ in shots: os.remove(f'{out}/{name}.jpg')
