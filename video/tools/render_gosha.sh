#!/bin/bash
cd /home/user/POXUI/video
mkdir -p /tmp/gk; rm -f /tmp/gk/done.txt
N=5120; STEP=1280; : > /tmp/gk/list.txt
for a in $(seq 0 $STEP $((N-1))); do
  b=$((a+STEP-1)); [ $b -ge $((N-1)) ] && b=$((N-1))
  f=/tmp/gk/c$a.mp4
  [ -f $f ] || { npx remotion render src/index.ts GoshaEp1 $f.part.mp4 --frames=$a-$b --gl=swangle --concurrency=4 --crf=18 --pixel-format=yuv420p > /tmp/gk/log_$a.txt 2>&1 && mv $f.part.mp4 $f; }
  echo "file '$f'" >> /tmp/gk/list.txt
done
ffmpeg -y -v error -f concat -safe 0 -i /tmp/gk/list.txt -c copy /tmp/gk/silent.mp4
ffmpeg -y -v error -i /tmp/gk/silent.mp4 -i /tmp/gs/mix.m4a -c:v copy -c:a aac -b:a 192k -af apad -shortest /tmp/gk/final.mp4
echo ALLDONE > /tmp/gk/done.txt
