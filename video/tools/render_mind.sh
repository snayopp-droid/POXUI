#!/bin/bash
cd /home/user/POXUI/video
mkdir -p /tmp/mind
for a in 0 372 744 1116 1488; do
  b=$((a+371)); [ $b -ge 1859 ] && b=1859
  f=/tmp/mind/c$a.mp4
  [ -f $f ] && continue
  npx remotion render src/index.ts MindVideo $f.part.mp4 --frames=$a-$b --gl=swangle --concurrency=4 --crf=16 --pixel-format=yuv420p > /tmp/mind/log_$a.txt 2>&1 && mv $f.part.mp4 $f
done
echo ALLDONE > /tmp/mind/done.txt
