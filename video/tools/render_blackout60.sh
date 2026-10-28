#!/bin/bash
cd /home/user/POXUI/video
mkdir -p /tmp/bo60
for a in 0 300 600 900 1200 1500; do
  b=$((a+299))
  f=/tmp/bo60/c$a.mp4
  [ -f $f ] && continue
  npx remotion render src/index.ts BlackoutVideo60 $f.part.mp4 --frames=$a-$b --gl=swangle --concurrency=4 --crf=16 --pixel-format=yuv420p > /tmp/bo60/log_$a.txt 2>&1 && mv $f.part.mp4 $f
done
echo ALLDONE > /tmp/bo60/done.txt
