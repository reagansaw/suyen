#!/bin/zsh
# 马赛克第 1 步：量脸的位置 + 做低像素副本。在 suyen repo 根目录跑：zsh make_px.sh
# 产出：/tmp/qm1mz/<名字>.txt（脸的位置）和 remotion/public/qm1/**/<名字>_px.mp4（40×72 的小片）
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; P=remotion/public/qm1; W=/tmp/qm1mz; mkdir -p $W
[ -x $W/faces ] || swiftc -O "$HERE/faces.swift" -o $W/faces
for v in client gen/A gen/B gen/C gen/D gen/E gen/F gen/G gen/H gen/I gen/J; do
  [ -f $P/$v.mp4 ] || continue
  nice -n 19 $W/faces $P/$v.mp4 3 > $W/$(basename $v).txt                       # 每 3 格测一次
  nice -n 19 ffmpeg -v error -y -threads 2 -i $P/$v.mp4 -an -vf "scale=40:72:flags=area" -c:v libx264 -crf 8 -preset fast -pix_fmt yuv420p -g 30 $P/${v}_px.mp4
  echo "$v  测了 $(wc -l < $W/$(basename $v).txt) 次  没测到脸 $(awk 'NF==1' $W/$(basename $v).txt | wc -l) 次"
done
echo "下一步：python3 $HERE/faces_to_ts.py $W remotion/src/suyenq/qm1_faces.ts"
