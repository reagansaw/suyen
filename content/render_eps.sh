#!/bin/bash
# 内容③–⑮ 一集一集：剪片 → 抠像 → 渲染 → 母带 + 手机版（放 ~/Downloads）
# 用法（repo 根目录）：
#   bash content/render_eps.sh c51a            只做一集
#   bash content/render_eps.sh all             全部 13 集（很久，8GB Mac 一次一集慢慢跑）
#   STEP=cut  bash content/render_eps.sh c51a  只剪片 + 抠像（先出分镜检查图给 Reagan 看）
# 原片：bash content/dl_raw.sh C0051 C0053 C0054 C0056 C0057 C0059 C0060（或 export SUYEN_RAW=原片夹）
set -u
H="$(cd "$(dirname "$0")" && pwd)"; R="$H/.."; OUT="${OUT:-$HOME/Downloads}"
ALL="c51a c51b c53a c53b c54 c56 c57a c57c c57d c59a c59b c59c c60"
[ "${1:-}" = all ] && set -- $ALL
for id in "$@"; do
  name=$(python3 -c "import sys; sys.path.insert(0,'$H'); from episodes import EP; print(EP['$id'][1])")
  comp="Suyen$(echo ${id:0:1} | tr a-z A-Z)${id:1}"
  echo "=== $id $name ($comp)"
  if [ ! -s "$R/remotion/public/suyenc/$id.mp4" ] || [ ! -s "$R/remotion/public/suyenc/pf/$id.webm" ]; then
    python3 "$H/episodes.py" "$id" || exit 1
    read fx fy < <(python3 -c "import sys; sys.path.insert(0,'$H'); from episodes import FACE; print(*FACE['$id'])")
    bash "$H/matte.sh" "$id" "$fx" "$fy" || exit 1
  fi
  [ "${STEP:-}" = cut ] && continue
  cd "$R/remotion"
  CONCURRENCY=${CONCURRENCY:-2} nice -n 19 node scripts/render.mjs "$comp" "out/$id-raw.mp4" || exit 1
  M="$OUT/Suyen-$name-竖版-v1.mp4"; P="$OUT/Suyen-$name-竖版-v1-手机.mp4"
  nice -n 19 ffmpeg -v error -y -threads 2 -i "out/$id-raw.mp4" -c:v copy \
    -af "loudnorm=I=-15:TP=-2:LRA=11,aresample=192000,alimiter=limit=0.79:attack=3:release=60:level=false,aresample=48000" \
    -c:a aac -b:a 192k -movflags +faststart "$M"
  nice -n 19 ffmpeg -v error -y -threads 2 -i "$M" -c:v libx264 -crf 25 -maxrate 6M -bufsize 12M -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart "$P"
  # QA：长度 < 60 秒、响度 −15～−16、没有 > 0.4s 冷场
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$M")
  lu=$(ffmpeg -nostats -i "$M" -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +I:|Peak:" | tr -s ' ' | tr '\n' ' ')
  gaps=$(ffmpeg -nostats -i "$M" -af silencedetect=n=-40dB:d=0.4 -f null - 2>&1 | grep -c silence_start)
  echo "$name  ${d}s  $lu  冷场:$gaps  → $P"
  cd "$R"
done
