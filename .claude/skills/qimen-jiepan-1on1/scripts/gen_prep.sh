#!/bin/zsh
# 换人片拉下来之后：① 画面转成 1080×1920 30fps ② 它自己生成的声音压低 ③ 把声音转成文字核对 ④ 出一张检查图
# 在 suyen repo 根目录跑：zsh gen_prep.sh A B C D E F G H I J
set -e
G=qimen-1on1/swap/gen; P=remotion/public/qm1/gen; mkdir -p $P /tmp/qm1gen
for c in "$@"; do
  nice -n 19 ffmpeg -v error -y -i $G/$c.mp4 -an -vf "fps=30,scale=1080:1920:flags=lanczos" -c:v libx264 -preset veryfast -crf 19 -g 15 -pix_fmt yuv420p -threads 2 $P/$c.mp4
  nice -n 19 ffmpeg -v error -y -i $G/$c.mp4 -vn -af "aresample=48000,asetrate=48000*0.87,aresample=48000,atempo=1.149425287,highpass=f=70,loudnorm=I=-16:TP=-1.5" -ar 48000 -c:a aac -b:a 192k $P/$c.m4a
  nice -n 19 ffmpeg -v error -y -i $G/$c.mp4 -vn -ac 1 -ar 16000 /tmp/qm1gen/$c.wav
  echo "$c $(ffprobe -v error -show_entries format=duration -of csv=p=0 $G/$c.mp4)s: $(nice uvx --offline --from mlx-whisper mlx_whisper /tmp/qm1gen/$c.wav --model mlx-community/whisper-large-v3-turbo --language zh --output-dir /tmp/qm1gen --output-format txt 2>/dev/null | grep -- '-->' | tr '\n' ' ')"
  nice ffmpeg -v error -y -i $G/$c.mp4 -vf "fps=30,select='eq(n,15)+eq(n,45)+eq(n,75)+eq(n,105)',scale=270:480,tile=4x1" -frames:v 1 -q:v 3 /tmp/qm1gen/row_$c.jpg
done
nice uvx --offline --from mlx-whisper python "$(dirname $0)/bounds.py" "$@"     # 印出每段讲话的起止秒 → 抄进 qm1.tsx 的 GEN
echo "检查图：/tmp/qm1gen/row_*.jpg（看脸是不是同一个人）"
