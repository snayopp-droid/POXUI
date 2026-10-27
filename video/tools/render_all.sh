#!/bin/bash
# рендер фильма кусками по 600 кадров; повторный запуск пропускает готовые
cd /home/user/POXUI/video
mkdir -p /tmp/ch
TOTAL=7008
STEP=600
for ((a=0; a<TOTAL; a+=STEP)); do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=/tmp/ch/c$(printf %05d $a).mp4
  [ -f $f ] && continue
  npx remotion render src/index.ts AfterFilm $f.part.mp4 --frames=$a-$b --gl=swangle --concurrency=4 --crf=17 --pixel-format=yuv420p > /tmp/ch/log_$a.txt 2>&1 && mv $f.part.mp4 $f
done
echo ALLDONE > /tmp/ch/done.txt
