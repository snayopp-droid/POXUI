#!/bin/sh
# «Билет в один конец», серия 1 — сборка одной командой (из папки video/)
set -e
cd "$(dirname "$0")/../.."
python3 tools/bilet_vo.py          # озвучка: куски ElevenLabs → public/bilet/vo.mp3 + src/wordsB.ts
python3 tools/bilet_srt.py films/bilet-ep1/bilet-ep1.srt
npx remotion render BiletEp1 films/bilet-ep1/raw.mp4 --concurrency=4 --crf=20
ffmpeg -y -i films/bilet-ep1/raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k films/bilet-ep1/bilet-ep1.mp4
ffmpeg -y -ss 216 -i films/bilet-ep1/bilet-ep1.mp4 -frames:v 1 -q:v 3 films/bilet-ep1/poster.jpg
