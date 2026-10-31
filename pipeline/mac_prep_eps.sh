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
  (cd remotion && uvx --from fonttools python -c "
from fontTools.ttLib import TTCollection
c=TTCollection('$F')
[f.save('public/ivyga/fonts/LantingheiSC-Heavy.ttf') for f in c.fonts if f['name'].getDebugName(4)=='Lantinghei SC Heavy']")
fi
[ -x tools/subjectmatte ] || (cd tools && swiftc -O subjectmatte.swift -o subjectmatte)
[ -x tools/facetrack ] || (cd tools && swiftc -O facetrack.swift -o facetrack)
# 2. 每集要用的原片 → 逐字转写（pipeline/wt/C00xx.json），切点要照这个对到字和字的空隙
mkdir -p pipeline/wt
PROMPT='以下是简体中文的句子。林舒苑，奇门遁甲战略大会，年盘，宫位，赤马红羊年，2027年。'
command -v uvx >/dev/null || { echo '没有 uvx：先跑 brew install uv'; exit 1; }
for c in $(python3 -c "
import sys; sys.path.insert(0,'pipeline'); import eps_plan as e
s=set()
for n in [int(x) for x in '$EPS'.split()]: s|={p[0] for p in e.plan(n)[1]}
print(' '.join(sorted(s)))"); do
  [ -f pipeline/wt/$c.json ] && continue
  echo "转写 $c …"
  nice -n 19 uvx --from mlx-whisper mlx_whisper "$SUYEN_RAW/$c.MP4" --model mlx-community/whisper-large-v3-turbo \
    --language zh --word-timestamps True --initial-prompt "$PROMPT" --output-format json --output-dir pipeline/wt
done
echo '逐字转写好了：先照 pipeline/wt/*.json 把 pipeline/eps_plan.py 的切点挪到字缝，重跑 python3 pipeline/eps_plan.py，再继续'
[ "${CUT:-0}" = 1 ] || exit 0
# 3. 剪片 + 抠像 + 追踪（CUT=1 才跑）
mkdir -p remotion/public/suyenh/pf
for n in $EPS; do
  nice -n 19 python3 pipeline/ep$n/prep_ep$n.py
  V=remotion/public/suyenh/ep$n.mp4
  nice -n 19 tools/subjectmatte $V /tmp/m_ep$n.mp4
  nice -n 19 ffmpeg -v error -y -threads 2 -i $V -i /tmp/m_ep$n.mp4 -filter_complex "[1:v]format=gray,erosion,erosion,gblur=sigma=1.3,lutyuv=y='clip((val-28)*1.18,0,255)'[m];[0:v][m]alphamerge,format=yuva420p[v]" \
    -map "[v]" -an -c:v libvpx-vp9 -pix_fmt yuva420p -deadline realtime -cpu-used 8 -b:v 6M -auto-alt-ref 0 remotion/public/suyenh/pf/ep$n.webm
  echo "ep$n 剪好、抠好。facetrack 要给起始脸的位置：tools/facetrack $V /tmp/face_ep$n.json <x> <y>"
done
