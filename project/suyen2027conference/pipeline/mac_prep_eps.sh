#!/bin/bash
# 在 Mac 上跑（第 2–14 集的机械步骤）：环境准备 → 逐字转写 → 剪片 → 抠像 + 追踪。合成（gen_epN.py）和分镜检查图之后照 HANDOFF 4.3–4.4 做。
# 用法：bash pipeline/mac_prep_eps.sh（会自己在 ~/Downloads 找原片；找不到再 export SUYEN_RAW=<路径>）；bash pipeline/mac_prep_eps.sh [集数…]（不给就是 2–14）
# 照 HANDOFF 的机器规矩：nice -n 19、ffmpeg -threads 2、一次只跑一样
set -euo pipefail
cd "$(dirname "$0")/.."; R=$(pwd)
: "${SUYEN_RAW:=}"
# 没设或设错 → 自己去 ~/Downloads 找有 C0001.MP4 的资料夹
if [ ! -f "$SUYEN_RAW/C0001.MP4" ]; then
  SUYEN_RAW=$(find ~/Downloads ~/Desktop ~/Movies -maxdepth 4 -iname 'C0001.MP4' 2>/dev/null | head -1 | xargs -I{} dirname {} || true)
fi
[ -f "$SUYEN_RAW/C0001.MP4" ] || { echo '找不到原片 C0001.MP4：请 export SUYEN_RAW=<真正放原片的资料夹路径>'; exit 1; }
export SUYEN_RAW; echo "原片资料夹：$SUYEN_RAW"
EPS=${*:-"2 3 4 5 6 7 8 9 10 11 12 13 14"}
# 1. 环境（只做一次）
[ -d remotion/node_modules ] || (cd remotion && npm install)
if [ ! -f remotion/public/ivyga/fonts/LantingheiSC-Heavy.ttf ]; then
  F=$(find /System/Library/AssetsV2 -name 'Lantinghei.ttc' 2>/dev/null | head -1 || true)
  [ -n "$F" ] || { echo '找不到 Lantinghei.ttc：先在「字体册」下载「兰亭黑-简」'; exit 1; }
  command -v uvx >/dev/null || { echo '没有 uvx：先跑 brew install uv'; exit 1; }
  mkdir -p remotion/public/ivyga/fonts
  (cd remotion && uvx --from fonttools python -c "
from fontTools.ttLib import TTCollection
c=TTCollection('$F')
[f.save('public/ivyga/fonts/LantingheiSC-Heavy.ttf') for f in c.fonts if f['name'].getDebugName(4)=='Lantinghei SC Heavy']")
fi
[ -s remotion/public/ivyga/fonts/LantingheiSC-Heavy.ttf ] || { echo '字体没导出成功'; exit 1; }
[ -x tools/subjectmatte ] || (cd tools && swiftc -O subjectmatte.swift -o subjectmatte)
[ -x tools/facetrack ] || (cd tools && swiftc -O facetrack.swift -o facetrack)
# 2. 每集要用的原片 → 逐字转写（pipeline/wt/C00xx.json），切点要照这个对到字和字的空隙
mkdir -p pipeline/wt
PROMPT='以下是简体中文的句子。林舒苑，奇门遁甲战略大会，年盘，宫位，赤马红羊年，2027年。'
command -v uvx >/dev/null || { echo '没有 uvx：先跑 brew install uv'; exit 1; }
CLIPS=$(python3 -c "
import sys; sys.path.insert(0,'pipeline'); import eps_plan as e
s=set()
for n in [int(x) for x in '$EPS'.split()]: s|={p[0] for p in e.plan(n)[2]}
print(' '.join(sorted(s)))")
[ -n "$CLIPS" ] || { echo '列不出要转写的原片'; exit 1; }
echo "要转写：$CLIPS"
for c in $CLIPS; do
  [ -f pipeline/wt/$c.json ] && continue
  echo "转写 $c …"
  nice -n 19 uvx --python 3.12 --from mlx-whisper mlx_whisper "$SUYEN_RAW/$c.MP4" --model mlx-community/whisper-large-v3-turbo \
    --language zh --word-timestamps True --initial-prompt "$PROMPT" --output-format json --output-dir pipeline/wt
done
echo '逐字转写好了：先照 pipeline/wt/*.json 把 pipeline/eps_plan.py 的切点挪到字缝，重跑 python3 pipeline/eps_plan.py，再继续'
[ "${CUT:-0}" = 1 ] || exit 0
# 3. 剪片 + 抠像 + 脸部追踪 + 成片转写检查（CUT=1 才跑）。已经做好的那一步会跳过；REDO=1 全部重做
mkdir -p remotion/public/suyenh/pf
for n in $EPS; do
  V=remotion/public/suyenh/ep$n.mp4
  [ -f $V ] && [ -f pipeline/ep$n/pieces.json ] && [ "${REDO:-0}" != 1 ] || nice -n 19 python3 pipeline/ep$n/prep_ep$n.py
  if [ ! -f remotion/public/suyenh/pf/ep$n.webm ] || [ "${REDO:-0}" = 1 ]; then
    nice -n 19 tools/subjectmatte $V /tmp/m_ep$n.mp4
    nice -n 19 ffmpeg -v error -y -threads 2 -i $V -i /tmp/m_ep$n.mp4 -filter_complex "[1:v]format=gray,erosion,erosion,gblur=sigma=1.3,lutyuv=y='clip((val-28)*1.18,0,255)'[m];[0:v][m]alphamerge,format=yuva420p[v]" \
      -map "[v]" -an -c:v libvpx-vp9 -pix_fmt yuva420p -deadline realtime -cpu-used 8 -b:v 6M -auto-alt-ref 0 remotion/public/suyenh/pf/ep$n.webm
    rm -f /tmp/m_ep$n.mp4
  fi
  # 脸部追踪（从画面中间偏上开始找）→ 平滑 7 格 → 护脸层 face / 圆框 track（y+150）
  if [ ! -f remotion/src/suyenh-track-ep$n.json ] || [ "${REDO:-0}" = 1 ]; then
    nice -n 19 tools/facetrack $V /tmp/face_ep$n.json
    python3 - "$n" <<'PY'
import json, sys
n = sys.argv[1]; d = json.load(open(f'/tmp/face_ep{n}.json'))
def sm(v, k=7):
    h = k // 2; return [round(sum(v[max(0, i - h):i + h + 1]) / len(v[max(0, i - h):i + h + 1]), 1) for i in range(len(v))]
x, y = sm(d['x']), sm(d['y'])
json.dump({'x': x, 'y': y}, open(f'remotion/src/suyenh-face-ep{n}.json', 'w'))
json.dump({'x': x, 'y': [round(v + 150, 1) for v in y]}, open(f'remotion/src/suyenh-track-ep{n}.json', 'w'))
print(f'ep{n} 脸：起点 ({x[0]:.0f}, {y[0]:.0f})，x 范围 {min(x):.0f}–{max(x):.0f}，y 范围 {min(y):.0f}–{max(y):.0f}')
PY
  fi
  # 成片再转写一次（HANDOFF 4.1 第 4 步：不能少字、不能多出前一句的尾音）→ pipeline/epN/check.json，推上来给 Claude 比对
  if [ ! -f pipeline/ep$n/check.json ] || [ "${REDO:-0}" = 1 ]; then
    nice -n 19 uvx --python 3.12 --from mlx-whisper mlx_whisper $V --model mlx-community/whisper-large-v3-turbo \
      --language zh --word-timestamps True --initial-prompt "$PROMPT" --output-format json --output-dir /tmp --verbose False
    mv /tmp/ep$n.json pipeline/ep$n/check.json
  fi
  echo "ep$n 好了"
done
echo '全部好了：git add pipeline remotion/src && git commit -m "剪片 + 脸部追踪 + 检查" && git push origin claude/wizardly-ptolemy-9vg3v6'
