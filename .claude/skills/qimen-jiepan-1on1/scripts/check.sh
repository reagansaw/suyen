#!/bin/zsh
# 成片检查：长度、黑画面、长时间没声音、响度，再每 6 秒抽一格拼成一张图（看马赛克有没有盖住）。
# 用法：zsh check.sh <成片.mp4> [<成片2.mp4> …]
for f in "$@"; do
  echo "== $f"
  echo "长度 $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f") 秒"
  ffmpeg -v info -threads 2 -i "$f" -vf "blackdetect=d=0.2:pix_th=0.06" -af "silencedetect=n=-45dB:d=1.2,ebur128" -f null - 2>&1 | grep -E "black_start|silence_start|^ +I:" | tail -8
  ffmpeg -v error -y -threads 2 -i "$f" -vf "fps=1/6,scale=216:384,tile=9x2" -frames:v 1 -q:v 3 "${f%.mp4}-检查图.jpg"
done
