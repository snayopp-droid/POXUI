"""Сводит звук «12 YEARS UNDERGROUND» по таймлайну -> /tmp/bk/mix.wav (-14 LUFS)"""
import json, os, subprocess, sys
V = "public/bunker/vo/"; S = "public/bunker/sfx/"; M = "public/bunker/music/"
script = json.load(open("src/bunker/script.json")); vo = json.load(open("src/bunker/vo.json"))
CARDS = {"c02": 3, "c05": 3, "c07": 3, "c09": 3, "c10": 3, "c13": 3, "c14": 3, "c16": 3, "c18": 3, "c19": 3, "c20": 3, "c21": 3}
AFTER = {"c01": 5}
GAP = 1.0
seg = {}; t = 0.0
for c in script:
    t += CARDS.get(c["id"], 0)
    d = vo.get(c["id"], c["words"] / 2.55 + 0.6)
    seg[c["id"]] = (t, d + GAP); t += d + GAP + AFTER.get(c["id"], 0)
TOTAL = t + 4
print("total", round(TOTAL, 1))

ins, parts = [], []
def add(p): ins.extend(["-i", p]); return len(ins) // 2 - 1
def seg_(path, start, dur=None, vol=1.0, fi=0, fo=0, loop=0, norm=0):
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

# голос
vl = [seg_(V + c["id"] + ".mp3", seg[c["id"]][0], norm=1) for c in script if os.path.exists(V + c["id"] + ".mp3")]
bus(vl or [seg_(S + "hum.wav", 0, 1, 0.0)], "vo")

# события: (чанк, доля, файл, длительность, громкость)
EV = [
 ("c01", .02, "clang", None, .35), ("c01", .59, "alert", 4, .4),
 ("c02", .02, "alert", 3, .4), ("c02", .30, "wind", 12, .25),
 ("c03", .00, "boom", None, .8), ("c03", .24, "rumble", None, .7), ("c03", .50, "geiger", 8, .5), ("c03", .50, "wind", 10, .2),
 ("c04", .40, "clang", None, .3), ("c04", .60, "clang", None, .7),
 ("c05", .00, "rumble", None, .9), ("c05", .03, "boom", None, .6), ("c05", .60, "geiger", 10, .55), ("c05", .45, "wind", 8, .22),
 ("c06", .16, "ding", None, .35), ("c06", .52, "ding", None, .35),
 ("c07", .05, "drip", None, .5), ("c07", .45, "drip", None, .5),
 ("c08", .00, "crank", 5, .6), ("c08", .16, "static", 12, .35), ("c08", .50, "geiger", 14, .5),
 ("c09", .20, "geiger", 8, .35), ("c09", .72, "static", 8, .45),
 ("c10", .20, "ding", None, .3), ("c10", .70, "thud", None, .3),
 ("c11", .00, "water", 30, .22), ("c11", .60, "buzz", 3, .2),
 ("c12", .00, "fan", 30, .22), ("c12", .50, "crank", 5, .5),
 ("c14", .48, "clang", None, .5), ("c14", .62, "wind", 8, .25), ("c14", .66, "geiger", 8, .4),
 ("c15", .17, "static", 8, .4), ("c15", .50, "buzz", 5, .4), ("c15", .67, "water", 12, .2),
 ("c16", .00, "thud", None, .3),
 ("c17", .05, "thud", None, .7), ("c17", .50, "drip", None, .4),
 ("c18", .50, "clang", None, .3), ("c18", .66, "geiger", 6, .4),
 ("c19", .16, "wind", 26, .28), ("c19", .35, "geiger_fast", 8, .5), ("c19", .80, "ding", None, .3),
 ("c20", .00, "geiger", 8, .5), ("c20", .50, "clang", None, .8), ("c20", .70, "wind", 12, .25), ("c20", .78, "birds", 10, .5),
 ("c21", .00, "ding", None, .3), ("c21", .25, "ding", None, .3), ("c21", .50, "ding", None, .3), ("c21", .75, "ding", None, .3),
 ("c22", .00, "ding", None, .3), ("c22", .25, "ding", None, .3), ("c22", .50, "ding", None, .3), ("c22", .75, "ding", None, .3),
 ("c23", .00, "alert", 3, .3), ("c23", .30, "birds", 10, .5),
]
sx = []
for cid, fr, name, dur, vol in EV:
    t0, d = seg[cid]
    ext = ".wav"
    fo = 0.6 if dur else 0
    sx.append(seg_(S + name + ext, t0 + fr * d, dur, vol, 0.3 if dur else 0, fo))
bus(sx, "sfx")

# подложка: гул + музыка
bed = [seg_(S + "hum.wav", 0, TOTAL, .09, 2, 3, 1)]
t14 = seg["c14"][0]
bed.append(seg_(M + "tense.mp3", 0, t14 + 6, .22, 2, 6, 1))
bed.append(seg_(M + "warm.mp3", t14 - 2, TOTAL - t14 + 2, .26, 6, 4, 1))
bus(bed, "bed")
parts.append("[vo]asplit=2[vo1][vo2]")
parts.append("[bed][vo1]sidechaincompress=threshold=0.035:ratio=6:attack=20:release=600[bedd]")
parts.append("[vo2]highpass=f=70,acompressor=threshold=0.1:ratio=3[voc]")
parts.append(f"[voc][sfx][bedd]amix=inputs=3:normalize=0,atrim=duration={TOTAL},loudnorm=I=-14:TP=-1.5:LRA=9[out]")
os.makedirs("/tmp/bk", exist_ok=True)
r = subprocess.run(["ffmpeg", "-y", *ins, "-filter_complex", ";".join(parts), "-map", "[out]", "-ar", "44100", "/tmp/bk/mix.wav"], capture_output=True, text=True)
print(r.stderr[-300:])
