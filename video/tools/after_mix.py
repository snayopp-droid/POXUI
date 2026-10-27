"""Сводит озвучку, эмбиент, фоли и музыку «Жизнь после» в один wav по таймкодам (cues.json + списки ниже)."""
import json, subprocess, os
S = "public/after/sfx/"; V = "public/after/vo/"
cues = json.load(open("src/after/cues.json"))["vo"]
TOTAL = 292.0
# (файл, старт, длительность или None=как есть, громкость, fade_in, fade_out, цикл)
BEDS = [
 ("amb_street", 0, 77, .30, 1.5, 2, 1), ("amb_alley", 76.5, 28, .55, 1.5, 1.5, 1), ("amb_street", 103, 47.6, .28, 1.5, 1, 1),
 ("amb_courtyard", 150, 142, .32, 1.5, 3, 1),
]
MUSIC = [
 ("score_quirky", 1, 64, .20, 2, 3, 1), ("score_tension", 66, 84, .24, 2, 2, 1), ("score_chase", 137, 22, .48, .8, 2, 1),
 ("score_hope", 160, 132, .30, 4, 5, 1),
 ("musicbox", 169.5, 27, .55, .1, 3, 0), ("musicbox", 195.7, 22, .30, 2, 4, 0), ("musicbox", 214, 22, .5, .1, 4, 0),
 ("guitar_far", 232, 28, .35, 2, 3, 1),
]
SFX = [
 ("water_queue", 0, 10, .35), ("heartbeat", 5, 7, .45), ("zneck", 7, None, .4), ("inhale", 7.4, None, .55), ("zgroan1", 8.6, None, .3),
 ("boom", 14.0, None, .55), ("riser", 10.8, None, .35),
 ("zshuffle", 17, 9, .4), ("zgroan2", 19.5, None, .3),
 ("ui_pop", 26.6, None, .5), ("felt_steps", 26.5, 7, .5), ("ui_pop", 33.6, None, .5), ("slip", 35.5, None, .5), ("sleeve_scream", 35.8, None, .6),
 ("ui_pop", 40.6, None, .5), ("silent_laugh", 43.6, None, .5), ("crowd_whisper", 48.5, 5, .3), ("hum_lullaby", 59, 7, .5), ("zcalm", 59, 7, .25),
 ("musicbox_key", 90.8, None, .7),
 ("zhorde", 108.5, 8, .3), ("heartbeat", 113.2, 6, .5), ("dog_bark", 121.0, None, .9), ("zshuffle", 124, 6, .5), ("heartbeat", 123.6, 6, .5),
 ("box_fall", 130.75, None, 1.0), ("boom", 130.75, None, .5), ("zgroan2", 134, None, .4), ("zneck", 134.8, None, .4), ("zhorde", 136.5, 12, .55),
 ("run_steps", 141.6, 6, .8), ("run_steps", 147.5, 6, .8), ("zgroan1", 143, None, .35), ("zgroan2", 147, None, .35), ("zshuffle", 140, 16, .5), ("riser", 145.8, None, .5),
 ("ui_alarm", 150.8, None, .35),
 ("gate_slam", 154.6, None, 1.0), ("gate_shake", 155.2, None, .7), ("gate_shake", 157.2, None, .5),
 ("musicbox_key", 169.0, None, .7), ("zshuffle", 174, 7, .3), ("zcalm", 177, 23, .35), ("zgroan1", 190, None, .22), ("zgroan2", 197, None, .22),
 ("kids_laugh", 214.8, None, .7), ("zcalm", 217, 14, .3),
 ("crowd_laugh", 244, None, .4), ("kids_laugh", 250, None, .5), ("crowd_whisper", 240, 8, .3), ("boom", 265, None, .6), ("riser", 261, None, .35),
]
ins, parts = [], []
def add(path):
    ins.extend(["-i", path]); return len(ins) // 2 - 1
def seg(path, start, dur, vol, fi=0, fo=0, loop=0):
    i = add(path); lab = f"x{len(parts)}"
    f = f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo"
    if loop: f += ",aloop=loop=-1:size=2000000000"
    if dur: f += f",atrim=duration={dur}"
    f += f",volume={vol}"
    if fi: f += f",afade=t=in:d={fi}"
    if fo and dur: f += f",afade=t=out:st={max(0, dur - fo)}:d={fo}"
    f += f",adelay={int(start*1000)}|{int(start*1000)}[{lab}]"
    parts.append(f); return lab
def bus(labs, name):
    parts.append("".join(f"[{l}]" for l in labs) + f"amix=inputs={len(labs)}:normalize=0:duration=longest,apad=whole_dur={TOTAL}[{name}]")
vo = [seg(V + k + ".mp3", st, None, 1.0) for k, st in cues.items()]
bus(vo, "vo")
sf = [seg(S + f + ".mp3", st, d, v) for f, st, d, v in SFX]
bus(sf, "sfx")
bd = [seg(S + f + ".mp3", st, d, v, fi, fo, lp) for f, st, d, v, fi, fo, lp in BEDS + MUSIC]
bus(bd, "bed")
parts.append("[vo]asplit=2[vo1][vo2]")
parts.append("[bed][vo1]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=400[bedd]")
parts.append("[vo2]highpass=f=70,acompressor=threshold=0.1:ratio=3[voc]")
parts.append(f"[voc][sfx][bedd]amix=inputs=3:normalize=0,atrim=duration={TOTAL},loudnorm=I=-14:TP=-1.5:LRA=9[out]")
cmd = ["ffmpeg", "-y", *ins, "-filter_complex", ";".join(parts), "-map", "[out]", "-ar", "44100", "/tmp/ch/mix.wav"]
print(subprocess.run(cmd, capture_output=True, text=True).stderr[-600:])
