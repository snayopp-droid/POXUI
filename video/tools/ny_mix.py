"""Сводит озвучку, эмбиент, звуки и музыку «Из Москвы в Нью-Йорк» по таймкодам (src/ny/cues.json) -> /tmp/ny/mix.wav"""
import json, subprocess
S = "public/ny/sfx/"; V = "public/ny/vo/"
cues = json.load(open("src/ny/cues.json"))["vo"]
TOTAL = 300.0
# (файл, старт, длительность, громкость, fade_in, fade_out, цикл)
BEDS = [
 ("amb_rooftop", 0, 23, .55, 1.5, 2.5, 1), ("amb_apt", 23.5, 41.5, .5, 2, 2.5, 1), ("amb_moscow", 59, 15.5, .4, 3, 1.5, 1),
 ("amb_airport", 73, 8.5, .5, 1.5, 1.5, 1), ("amb_plane", 80.5, 11.5, .55, 1.5, 1.5, 1), ("amb_jfk", 91, 22, .5, 1.5, 2, 1),
 ("car_interior", 118.5, 9, .45, 1, 2, 1), ("amb_nyc", 124, 14, .55, 3, 2, 1),
 ("amb_brooklyn", 137, 17, .3, 2, 2, 1), ("amb_cafe", 153.4, 33.5, .6, 1, 1.5, 1),
 ("amb_subway", 186, 36, .5, 1, 2, 1), ("car_interior", 190.8, 5.6, .5, .6, .8, 1), ("amb_brooklyn", 219, 24, .5, 2, 2, 1),
 ("amb_apt", 242, 10, .3, 1.5, 2, 1), ("amb_rooftop", 250.5, 49.5, .55, 3, 4, 1),
]
MUSIC = [
 ("score_intro", 0.5, 27, .36, 3, 3, 0), ("score_journey", 26, 93, .2, 3, 3, 1), ("score_wonder", 117.5, 31, .34, 2, 3, 0),
 ("score_comic", 147.5, 39, .24, 2, 2.5, 1), ("score_lonely", 185.5, 60, .3, 2.5, 3, 1), ("score_finale", 250, 50, .42, 3, 5, 0),
]
SFX = [
 ("switch", 33.2, None, .6), ("door_lock", 63.9, None, .8), ("suitcase", 74.5, 9, .5), ("plane_takeoff", 80.3, None, .5), ("chime", 83.5, None, .35),
 ("stamp", 113.5, None, 1.0), ("taxi_horns", 121.0, None, .55), ("subway_arrive", 187.2, None, .85),
 ("phone_ring", 227.2, None, .5), ("phone_ring", 272.6, None, .6),
]
ins, parts = [], []
def add(path):
    ins.extend(["-i", path]); return len(ins) // 2 - 1
def seg(path, start, dur, vol, fi=0, fo=0, loop=0, norm=0):
    i = add(path); lab = f"x{len(parts)}"
    f = f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo"
    if norm: f += ",loudnorm=I=-16:TP=-2:LRA=7,aformat=sample_rates=44100:channel_layouts=stereo"
    if loop: f += ",aloop=loop=-1:size=2000000000"
    if dur: f += f",atrim=duration={dur}"
    f += f",volume={vol}"
    if fi: f += f",afade=t=in:d={fi}"
    if fo and dur: f += f",afade=t=out:st={max(0, dur - fo)}:d={fo}"
    f += f",adelay={int(start*1000)}|{int(start*1000)}[{lab}]"
    parts.append(f); return lab
def bus(labs, name):
    parts.append("".join(f"[{l}]" for l in labs) + f"amix=inputs={len(labs)}:normalize=0:duration=longest,apad=whole_dur={TOTAL}[{name}]")
vo = [seg(V + k + ".mp3", st, None, 1.0, norm=1) for k, st in cues.items()]
bus(vo, "vo")
bus([seg(S + f + ".mp3", st, d, v * 0.7) for f, st, d, v in SFX], "sfx")
bus([seg(S + f + ".mp3", st, d, v, fi, fo, lp) for f, st, d, v, fi, fo, lp in BEDS + MUSIC], "bed")
parts.append("[vo]asplit=2[vo1][vo2]")
parts.append("[bed][vo1]sidechaincompress=threshold=0.035:ratio=5:attack=20:release=500[bedd]")
parts.append("[vo2]highpass=f=70,acompressor=threshold=0.1:ratio=3[voc]")
parts.append(f"[voc][sfx][bedd]amix=inputs=3:normalize=0,atrim=duration={TOTAL},loudnorm=I=-14:TP=-1.5:LRA=9[out]")
r = subprocess.run(["ffmpeg", "-y", *ins, "-filter_complex", ";".join(parts), "-map", "[out]", "-ar", "44100", "/tmp/ny/mix.wav"], capture_output=True, text=True)
print(r.stderr[-300:])
