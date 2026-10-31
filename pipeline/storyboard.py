"""第 N 集分镜检查图（HANDOFF 4.4）：每 2.5 秒一格 + 每个大字 / B-roll 入场后 +0.15、+0.6 秒各一格 → 拼成有时间标签的总览图
用法（repo 根目录）：uvx --with pillow python pipeline/storyboard.py N → docs/review/第N集-分镜-<页>.jpg"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
n = int(sys.argv[1]); ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(f'{ROOT}/remotion/src/SuyenEps.tsx').read()
i = src.index(f'export const SuyenEp{n}:'); j = src.find('export const SuyenEp', i + 10); body = src[i:j if j > 0 else None]
dur = json.load(open(f'{ROOT}/pipeline/ep{n}/pieces.json'))['dur']
ats = [float(x) for x in re.findall(r'<(?:Hero|Cutaway|Shot|Seal|NameTag)[^>]*?(?:at|from)=\{([\d.]+)\}', body)]
ts = sorted({round(x, 2) for x in [k * 2.5 for k in range(int(dur / 2.5) + 1)] + [a + d for a in ats for d in (0.15, 0.6)] if 0 <= x < dur})
asis = re.search(r'asisFrom=\{([\d.]+)\}', body)
if asis:   # 后面接 IC2 成片（照原样）：只查钩子 + 接缝前后，成片本身抽 3 格看有没有被叠到东西
    a = float(asis.group(1)); ts = sorted({x for x in ts if x < a} | {round(a - 0.1, 2), round(a + 0.3, 2), round(a + 15, 2), round(dur - 1, 2)})
# 太近的格（<0.3 秒）只留一格
keep = []
for x in ts:
    if not keep or x - keep[-1] >= 0.3: keep.append(x)
shots = [[f'SuyenEp{n}', f'ep{n}_{x:06.2f}', x] for x in keep]
subprocess.run(['nice', '-n', '19', 'node', 'scripts/stills.mjs', json.dumps(shots)], cwd=f'{ROOT}/remotion', check=True)
font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 30)
TW, TH, C = 480, 270, 5; PER = C * 6
os.makedirs(f'{ROOT}/docs/review', exist_ok=True)
for pg in range((len(shots) + PER - 1) // PER):
    part = shots[pg * PER:(pg + 1) * PER]; rows = (len(part) + C - 1) // C
    sheet = Image.new('RGB', (TW * C, (TH + 40) * rows), '#120E0A'); d = ImageDraw.Draw(sheet)
    for k, (_, name, x) in enumerate(part):
        im = Image.open(f'{ROOT}/remotion/out/stills/{name}.jpg').resize((TW, TH))
        X, Y = (k % C) * TW, (k // C) * (TH + 40)
        sheet.paste(im, (X, Y + 40)); d.text((X + 8, Y + 4), f'{int(x // 60)}:{x % 60:05.2f}', fill='#E8C77E', font=font)
    out = f'{ROOT}/docs/review/第{n}集-分镜-{pg + 1}.jpg'; sheet.save(out, quality=86); print(out)
