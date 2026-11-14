#!/bin/bash
# 重做 CTA 声音 remotion/public/suyenc/cta_vo.wav（已经 commit，一般不用跑）——全部是她自己的真声音，1.1 倍
#   C0048 4.30–7.40 + 7.70–11.85「三天完全免费的 2027 年奇门战略大会」
#   C0048 27.62–29.45「那么马上报名」
#   C0006 35.85–37.57「正能量」
# Reagan 10-31：克隆声两次都「不像」「要有能量力量」→ 不用克隆，全用真声
set -eu
H="$(cd "$(dirname "$0")" && pwd)"; RAW="${SUYEN_RAW:-$H/../raw}"; O="$H/../remotion/public/suyenc"; T="${TMPDIR:-/tmp}"
ffmpeg -v error -y -ss 4.30 -to 7.40 -i "$RAW/C0048.MP4" -vn -ac 1 -ar 48000 -af "afade=t=in:d=0.006,afade=t=out:st=3.09:d=0.006" "$T/c1.wav"
ffmpeg -v error -y -ss 7.70 -to 11.85 -i "$RAW/C0048.MP4" -vn -ac 1 -ar 48000 -af "afade=t=in:d=0.006,afade=t=out:st=4.14:d=0.006" "$T/c2.wav"
ffmpeg -v error -y -i "$T/c1.wav" -i "$T/c2.wav" -filter_complex "[0][1]concat=n=2:v=0:a=1,atempo=1.1,loudnorm=I=-16:TP=-1.5" -ar 48000 "$T/real.wav"
ffmpeg -v error -y -ss 1.55 -i "$T/real.wav" -af "afade=t=in:d=0.01" "$T/real2.wav"
ffmpeg -v error -y -ss 27.62 -to 29.45 -i "$RAW/C0048.MP4" -vn -ac 1 -ar 48000 -af "afade=t=in:d=0.01,afade=t=out:st=1.79:d=0.04,atempo=1.1,loudnorm=I=-16:TP=-1.5" "$T/bm.wav"
ffmpeg -v error -y -ss 35.85 -to 37.57 -i "$RAW/C0006.MP4" -vn -ac 1 -ar 48000 -af "afade=t=in:d=0.01,afade=t=out:st=1.66:d=0.06,atempo=1.1,loudnorm=I=-16:TP=-1.5" "$T/zn.wav"
ffmpeg -v error -y -i "$T/real2.wav" -i "$T/bm.wav" -i "$T/zn.wav" -filter_complex "[0]aresample=48000,apad=pad_dur=0.12[a];[1]apad=pad_dur=0.35[b];[a][b][2]concat=n=3:v=0:a=1" -ar 48000 -ac 1 "$O/cta_vo.wav"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$O/cta_vo.wav"
