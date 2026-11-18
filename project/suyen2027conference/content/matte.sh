#!/bin/bash
# 剪好的片 → 抠像 webm（人后层用）+ 脸轨迹 JSON（护脸层 / 小卡跟脸）
# 用法：bash content/matte.sh c57 550 620      （后两个数 = 第 0 秒脸中心大约在 1080×1920 画面的哪里，先看第一帧估）
# 先编好 tools/subjectmatte、tools/facetrack（见 HANDOFF.md 第 3 节）
set -eu
H="$(cd "$(dirname "$0")" && pwd)"; R="$H/.."; id=$1; fx=$2; fy=$3
V="$R/remotion/public/suyenc/$id.mp4"; T="${TMPDIR:-/tmp}/suyen_m_$id.mp4"; mkdir -p "$R/remotion/public/suyenc/pf"
MIN_OVERLAP=0.02 nice -n 10 "$R/tools/subjectmatte" "$V" "$T" >/dev/null && echo "MATTE $id"
nice -n 10 "$R/tools/facetrack" "$V" "$R/remotion/src/suyenc-face-$id.json" "$fx" "$fy" | tail -1
nice -n 10 ffmpeg -v error -y -threads 2 -i "$V" -i "$T" -filter_complex "[1:v]format=gray,erosion,erosion,gblur=sigma=1.3,lutyuv=y='clip((val-28)*1.18,0,255)'[m];[0:v][m]alphamerge,format=yuva420p[v]" \
  -map "[v]" -an -c:v libvpx-vp9 -pix_fmt yuva420p -deadline realtime -cpu-used 8 -b:v 6M -auto-alt-ref 0 "$R/remotion/public/suyenc/pf/$id.webm" && echo "WEBM $id"
rm -f "$T"
