"""Сводит звук 60-секундного «Блэкаута» -> /tmp/bo60/mix.wav (-14 LUFS)"""
import subprocess
S = "public/blackout/sfx/"; V = "public/blackout60/"; B = "public/blackout/sfx/"
TOTAL = 60.0
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
vo = [seg(V + n + ".mp3", t, norm=1) for n, t in [("h0", 0.2), ("l1", 8.0), ("l2", 17.6), ("l3", 22.8), ("l4", 32.0), ("l5", 37.0), ("l6", 45.0)]]
bus(vo, "vo")
sfx = [seg(S + "city.mp3", 0, 9.0, .5, 0.3, 1.5, 1), seg(S + "powerdown.mp3", 2.88, None, .75),
       seg(S + "click.mp3", 10.53, None, .8), seg(S + "tap.mp3", 21.4, None, .4),
       seg(S + "radio.mp3", 21.45, 15.0, .3, 0.6, 2.0, 1), seg(S + "phone.mp3", 48.7, None, .5),
       seg(V + "fridge.mp3", 29.6, 6.6, .45, 0.6, 0.8, 1), seg(V + "knock.mp3", 36.0, None, .7),
       seg(V + "creak.mp3", 38.2, None, .5), seg(V + "riser.mp3", 49.6, None, .3)]
for i in range(6): sfx.append(seg(S + "tap.mp3", 22.53 + i * 1.333, None, .5))
bus(sfx, "sfx")
bed = [seg(B + "music.mp3", 0, 34, .17, 1.0, 4.0), seg(V + "music2.mp3", 30, 30, .17, 4.0, 2.5)]
bus(bed, "bed")
parts.append("[vo]asplit=2[vo1][vo2]")
parts.append("[bed][vo1]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=500[bedd]")
parts.append("[vo2]highpass=f=70,acompressor=threshold=0.1:ratio=3[voc]")
parts.append(f"[voc][sfx][bedd]amix=inputs=3:normalize=0,atrim=duration={TOTAL},loudnorm=I=-14:TP=-1.5:LRA=9[out]")
r = subprocess.run(["ffmpeg", "-y", *ins, "-filter_complex", ";".join(parts), "-map", "[out]", "-ar", "44100", "/tmp/bo60/mix.wav"], capture_output=True, text=True)
print(r.stderr[-200:])
