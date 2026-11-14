#!/bin/bash
# 下载竖拍访问原片 C0049–C0060（Google Drive，Reagan 分享的链接）到 ../raw/（或 $SUYEN_RAW）
# 用法：bash content/dl_raw.sh            全部 12 支（每支 1–3GB，先看 df -h ~）
#       bash content/dl_raw.sh C0057      只下一支
set -u
H="$(cd "$(dirname "$0")" && pwd)"; OUT="${SUYEN_RAW:-$H/../raw}"; mkdir -p "$OUT"
while read -r id name; do
  [ -z "$id" ] && continue
  [ $# -gt 0 ] && [[ " $* " != *" ${name%.MP4} "* ]] && continue
  [ -s "$OUT/$name" ] && { echo "已有 $name"; continue; }
  u=$(curl -sSL "https://drive.usercontent.google.com/download?id=$id&export=download" | grep -oE 'name="uuid" value="[^"]*"' | sed -E 's/.*value="([^"]*)"/\1/')
  curl -sSL --retry 5 -C - -o "$OUT/$name" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t${u:+&uuid=$u}" && echo "OK $name $(du -h "$OUT/$name" | cut -f1)"
done < "$H/raw-ids.txt"
