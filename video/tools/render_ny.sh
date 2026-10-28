#!/bin/bash
# рендер «Из Москвы в Нью-Йорк» кусками по 600 кадров в /tmp/ny; повторный запуск пропускает готовые
cd /home/user/POXUI/video
mkdir -p /tmp/ny
TOTAL=7200
STEP=600
for ((a=0; a<TOTAL; a+=STEP)); do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=/tmp/ny/c$(printf %05d $a).mp4
  [ -f $f ] && continue
  npx remotion render src/index.ts NYFilm $f.part.mp4 --frames=$a-$b --gl=swangle --concurrency=4 --crf=16 --pixel-format=yuv420p > /tmp/ny/log_$a.txt 2>&1 && mv $f.part.mp4 $f
done
echo ALLDONE > /tmp/ny/done.txt
