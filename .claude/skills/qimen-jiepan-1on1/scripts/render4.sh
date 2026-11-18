#!/bin/zsh
# 渲 4 支。在 suyen/remotion 里跑：zsh render4.sh v6
# 一次只跑一支（8GB 的 Mac）。每一行分开写：zsh 里 `set -- $p` 不会拆字，用循环会 4 支都瞬间失败。
# 不要接 `| tail`，失败的 exit code 会被吃掉。
V=${1:-v1}; O=../qimen-1on1/out; L=/Users/reagansaw/Code/.locks/heavy-run.sh; mkdir -p $O
$L nice -n 19 node scripts/render.mjs SuyenQm1      "$O/奇门解盘-原版-$V.mp4"            || exit 1
$L nice -n 19 node scripts/render.mjs SuyenQm1Gen   "$O/奇门解盘-Seedance版-$V.mp4"      || exit 1
$L nice -n 19 node scripts/render.mjs SuyenQm1Mz    "$O/奇门解盘-原版-马赛克-$V.mp4"       || exit 1
$L nice -n 19 node scripts/render.mjs SuyenQm1GenMz "$O/奇门解盘-Seedance版-马赛克-$V.mp4" || exit 1
echo all done
