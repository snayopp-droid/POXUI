"""Сводит озвучку и звуки «Блэкаута» -> /tmp/bo/mix.wav (25 c, -14 LUFS)"""
import subprocess
S = "public/blackout/sfx/"; V = "public/blackout/vo/"
TOTAL = 25.0
ins, parts = [], []
def add(p): ins.extend(["-i", p]); return len(ins) // 2 - 1
def seg(path, start, dur=None, vol=1.0, fi=0, fo=0, loop=0, tempo=1.0, norm=0):
    i = add(path); lab = f"x{len(parts)}"
    f = f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo"
    if tempo != 1.0: f += f",atempo={tempo}"
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
vo = [seg(V + "vo1.mp3", 4.0, tempo=1.18, norm=1), seg(V + "vo2.mp3", 9.1, tempo=1.18, norm=1), seg(V + "vo3.mp3", 13.7, norm=1), seg(V + "vo4.mp3", 19.0, norm=1)]
bus(vo, "vo")
sfx = [seg(S + "city.mp3", 0, 4.4, .5, 0.3, 0.8, 1), seg(S + "powerdown.mp3", 1.6, None, .75),
       seg(S + "click.mp3", 6.1, None, .8), seg(S + "tap.mp3", 12.88, None, .4),
       seg(S + "radio.mp3", 12.9, 12.1, .32, 0.6, 1.5, 1), seg(S + "phone.mp3", 21.05, None, .5)]
for i in range(6): sfx.append(seg(S + "tap.mp3", 13.0 + i * 0.95 + 0.7, None, .5))
bus(sfx, "sfx")
bed = [seg(S + "music.mp3", 0, 25, .17, 1.0, 2.5)]
bus(bed, "bed")
parts.append("[vo]asplit=2[vo1][vo2]")
parts.append("[bed][vo1]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=500[bedd]")
parts.append("[vo2]highpass=f=70,acompressor=threshold=0.1:ratio=3[voc]")
parts.append(f"[voc][sfx][bedd]amix=inputs=3:normalize=0,atrim=duration={TOTAL},loudnorm=I=-14:TP=-1.5:LRA=9[out]")
r = subprocess.run(["ffmpeg", "-y", *ins, "-filter_complex", ";".join(parts), "-map", "[out]", "-ar", "44100", "/tmp/bo/mix.wav"], capture_output=True, text=True)
print(r.stderr[-200:])
