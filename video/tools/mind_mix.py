"""Звук «Что если ты слышишь мысли» -> /tmp/mind/mix.wav (62 c, -14 LUFS)"""
import json, subprocess
P = "public/mind/"
TOTAL = 62.0
cues = json.load(open("src/mind/cues.json"))
ins, parts = [], []
def add(p): ins.extend(["-i", p]); return len(ins) // 2 - 1
def seg(path, start, dur=None, vol=1.0, fi=0, fo=0, loop=0, norm=0):
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
VO = [("v0", 0.3), ("v1", 4.6), ("v2", 11.3), ("v3", 22.2), ("v4", 30.8), ("v5", 36.4), ("v6", 44.6), ("v7", 53.4)]
bus([seg(P + n + ".mp3", t, norm=1) for n, t in VO], "vo")
sfx = [seg(P + "activate.mp3", 2.2, None, .7),
       seg(P + "whispers.mp3", 8.6, 13.6, .16, 1.5, 1.0, 1),
       seg(P + "whispers.mp3", 22.2, 13.4, .3, 1.0, 0.5, 1),
       seg(P + "ring.mp3", 33.0, None, .5),
       seg(P + "whispers.mp3", 40.0, 4.0, .08, 1.0, 1.0, 1)]
for c in cues:
    sfx.append(seg(P + "pop.mp3", c["t0"], None, .45 if c["kind"] != "dark" else .38))
bus(sfx, "sfx")
bus([seg(P + "music.mp3", 0, TOTAL, .17, 1.0, 3.0, 1)], "bed")
parts.append("[vo]asplit=2[vo1][vo2]")
parts.append("[bed][vo1]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=500[bedd]")
parts.append("[vo2]highpass=f=70,acompressor=threshold=0.1:ratio=3[voc]")
parts.append(f"[voc][sfx][bedd]amix=inputs=3:normalize=0,atrim=duration={TOTAL},loudnorm=I=-14:TP=-1.5:LRA=9[out]")
r = subprocess.run(["ffmpeg", "-y", *ins, "-filter_complex", ";".join(parts), "-map", "[out]", "-ar", "44100", "/tmp/mind/mix.wav"], capture_output=True, text=True)
print(r.stderr[-200:])
