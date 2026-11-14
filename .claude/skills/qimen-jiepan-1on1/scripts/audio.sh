#!/bin/zsh
# 声音三件事。在 suyen repo 根目录跑：zsh audio.sh <老师原片> <客人原片>
# ① 老师：原声，只做去低频 + 响度 −16。② 客人：整支压低（0.87 倍音高，速度不变）。
# ③ 老师那支麦克风里收到客人插的话（例：那一声「是」）：只把那一小段压低，见最下面 lower_slice。
set -e
T="$1"; C="$2"; P=remotion/public/qm1
LOW="aresample=48000,asetrate=48000*0.87,aresample=48000,atempo=1.149425287"   # 1/0.87 = 1.149425287，所以长度不变
nice -n 19 ffmpeg -v error -y -i "$C" -map 0:a:0 -vn -af "$LOW,highpass=f=70,loudnorm=I=-16:TP=-1.5" -ar 48000 -c:a aac -b:a 192k -threads 2 $P/client_low.m4a
nice -n 19 ffmpeg -v error -y -i "$T" -map 0:a:0 -vn -af "highpass=f=70,loudnorm=I=-16:TP=-1.5" -ar 48000 -c:a aac -b:a 192k -threads 2 $P/teacher.m4a
cp $P/teacher.m4a $P/teacher_raw.m4a      # 留一份没动过的

# 用法：lower_slice <开始秒> <结束秒>   （老师那支的秒数；这支片是 133.32 134.20）
lower_slice() {
  nice -n 19 ffmpeg -v error -y -threads 2 -i $P/teacher_raw.m4a -filter_complex "[0:a]aresample=48000,asplit=3[a][b][c];[a]atrim=0:$1,asetpts=PTS-STARTPTS[a1];[b]atrim=$1:$2,asetpts=PTS-STARTPTS,asetrate=48000*0.87,aresample=48000,atempo=1.149425287[b1];[c]atrim=start=$2,asetpts=PTS-STARTPTS[c1];[a1][b1][c1]concat=n=3:v=0:a=1" -c:a aac -b:a 192k $P/teacher.m4a
}
[ -n "$3" ] && lower_slice "$3" "$4"
echo done
