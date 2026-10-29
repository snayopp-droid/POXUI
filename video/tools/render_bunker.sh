#!/bin/bash
cd /home/user/POXUI/video
mkdir -p /tmp/bk
N=$(node -e "
const s=require('./src/bunker/script.json'),vo=require('./src/bunker/vo.json');
const C=new Set(['c02','c05','c07','c09','c10','c13','c14','c16','c18','c19','c20','c21']);let t=0;
for(const c of s){if(C.has(c.id))t+=3.5;t+=(vo[c.id]??c.words/2.55+0.6)+1.8;if(c.id==='c01')t+=5}
console.log(Math.ceil((t+6)*30))")
echo "frames $N" > /tmp/bk/info.txt
STEP=4500
i=0
for a in $(seq 0 $STEP $((N-1))); do
  b=$((a+STEP-1)); [ $b -ge $((N-1)) ] && b=$((N-1))
  f=/tmp/bk/c$a.mp4
  [ -f $f ] || { npx remotion render src/index.ts BunkerVideo $f.part.mp4 --frames=$a-$b --gl=swangle --concurrency=4 --crf=17 --pixel-format=yuv420p > /tmp/bk/log_$a.txt 2>&1 && mv $f.part.mp4 $f; }
  echo $a >> /tmp/bk/list_order.txt
done
echo ALLDONE > /tmp/bk/done.txt
