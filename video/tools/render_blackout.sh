#!/bin/bash
cd /home/user/POXUI/video
mkdir -p /tmp/bo
for a in 0 250 500; do
  b=$((a+249)); [ $b -ge 749 ] && b=749
  f=/tmp/bo/c$a.mp4
  [ -f $f ] && continue
  npx remotion render src/index.ts BlackoutVideo $f.part.mp4 --frames=$a-$b --gl=swangle --concurrency=4 --crf=16 --pixel-format=yuv420p > /tmp/bo/log_$a.txt 2>&1 && mv $f.part.mp4 $f
done
echo ALLDONE > /tmp/bo/done.txt
