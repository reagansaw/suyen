#!/bin/zsh
# 1080p 代理片（剪辑和分镜用）
cd "/Users/reagansaw/Claude Code/suyen/remotion/public/qm1"
D=~/Downloads
nice -n 19 ffmpeg -v error -y -i $D/IMG_1787.MOV -vf scale=1080:1920 -r 30 -c:v libx264 -preset veryfast -crf 21 -g 15 -an -threads 2 teacher.mp4
nice -n 19 ffmpeg -v error -y -i $D/IMG_8723.MOV -vf scale=1080:1920 -r 30 -c:v libx264 -preset veryfast -crf 21 -g 15 -an -threads 2 client.mp4
nice -n 19 ffmpeg -v error -y -i $D/RPReplay_Final1794572709.MP4 -vf scale=1334:1920 -r 30 -c:v libx264 -preset veryfast -crf 21 -g 15 -an -threads 2 ipad.mp4
echo done
