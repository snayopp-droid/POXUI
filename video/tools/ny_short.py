"""Нарезка 9:16 для Shorts из «Из Москвы в Нью-Йорк»: паспортный контроль + сцена с кофе + финальная плашка"""
import json, re, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
SRC = "films/ny/iz-moskvy-v-nyu-york-ch1.mp4"
OUT = "films/ny/short-9x16.mp4"
SEG = [(98.4, 118.2), (153.4, 185.8)]
CARD = (276.0, 281.0)
cues = json.load(open("src/ny/cues.json"))["vo"]
meta = json.load(open("tools/ny_vo_meta.json"))
lines = {l[0]: re.sub(r"\[[^\]]*\]\s*", "", l[2]) for l in json.load(open("tools/ny_lines.json"))["lines"]}
TR = {"O01": "С какой целью вы приехали?", "E01": "Работа. Я... приехал работать.", "O02": "Добро пожаловать в США.", "B01": "Привет! Что вам предложить?", "E02": "Кофе. Пожалуйста. Просто... кофе.", "B02": "Горячий или со льдом? Размер? Овсяное, миндальное или обычное молоко? Сироп?"}
# карта времени фильма -> время шортса
off, t0s = 0.0, []
for a, b in SEG:
    t0s.append((a, b, off)); off += b - a
def tmap(t):
    for a, b, o in t0s:
        if a - 0.01 <= t <= b + 0.01: return o + (t - a)
    return None
def ts(t):
    return f"{int(t//3600)}:{int(t%3600//60):02}:{t%60:05.2f}"
ev = []
for k, st in cues.items():
    a = tmap(st); 
    if a is None: continue
    b = min(a + meta[k]["dur"] + 0.1, off)
    txt = lines[k].replace("\n", " ")
    if k in TR: txt = "{\\b1}" + txt + "{\\b0}\\N{\\i1\\c&H8ADCF0&}" + TR[k]
    ev.append(f"Dialogue: 0,{ts(a)},{ts(b)},Cap,,0,0,0,,{txt}")
ev.append(f"Dialogue: 0,{ts(0)},{ts(off)},Top,,0,0,0,,ИЗ МОСКВЫ В НЬЮ-ЙОРК  ·  ЧАСТЬ 1")
ass = """[Script Info]
PlayResX: 1080
PlayResY: 1920
ScriptType: v4.00+
WrapStyle: 0

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Cap,Inter,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,5,1,2,70,70,300,1
Style: Top,Inter,34,&H00D8E4F0,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,6,0,1,3,0,8,60,60,470,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
""" + "\n".join(ev) + "\n"
open("/tmp/ny/short.ass", "w").write(ass)

# плашка
W, H = 1080, 1920
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "259", "-i", SRC, "-frames:v", "1", "/tmp/ny/frame.png"], check=True)
bg = Image.open("/tmp/ny/frame.png").convert("RGB").crop((0, 138, 1920, 942)).resize((int(804 * W / 1080 * 1.0 * 1920 / 804 / 1.0), H)) if False else Image.open("/tmp/ny/frame.png").convert("RGB").crop((560, 138, 1360, 942)).resize((W, int(W * 804 / 800)))
bg = bg.resize((W, H)).filter(ImageFilter.GaussianBlur(24))
ov = Image.new("RGB", (W, H), (0, 0, 0)); bg = Image.blend(bg, ov, 0.62)
d = ImageDraw.Draw(bg)
F = lambda s, w="Bold": ImageFont.truetype(f"/usr/share/fonts/opentype/inter/Inter-{w}.otf", s)
def center(txt, y, f, fill):
    w = d.textlength(txt, font=f); d.text(((W - w) / 2, y), txt, font=f, fill=fill)
center("ПРОДОЛЖЕНИЕ", 640, F(104, "Bold"), (255, 255, 255))
center("в полной версии", 770, F(58, "Medium"), (240, 217, 166))
center("«Из Москвы в Нью-Йорк»", 900, F(66, "Bold"), (255, 255, 255))
center("Часть 1 — на моём канале", 990, F(52, "Medium"), (220, 225, 235))
d.rounded_rectangle((170, 1150, 910, 1260), 55, fill=(235, 60, 50))
center("▶  Смотри полностью", 1172, F(54, "Bold"), (255, 255, 255))
center("Подписывайся — скоро часть 2", 1330, F(44, "Medium"), (200, 205, 215))
bg.save("/tmp/ny/card.png")

fc = []
for i, (a, b) in enumerate(SEG):
    fc.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,split=2[v{i}a][v{i}b]")
    fc.append(f"[v{i}a]crop=1920:804:0:138,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:6,eq=brightness=-0.08[bg{i}]")
    fc.append(f"[v{i}b]crop=1072:690:424:138,scale=1080:695[fg{i}]")
    fc.append(f"[bg{i}][fg{i}]overlay=0:575,setsar=1[s{i}]")
    fc.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.12,afade=t=out:st={b-a-0.15}:d=0.15[a{i}]")
fc.append(f"[0:a]atrim={CARD[0]}:{CARD[1]},asetpts=PTS-STARTPTS,afade=t=in:d=0.2,afade=t=out:st=3.8:d=1.2[ac]")
fc.append(f"[1:v]fps=24,format=yuv420p,fade=t=in:d=0.3,setsar=1[cv]")
fc.append("[s0][s1]concat=n=2:v=1:a=0[body]")
fc.append(f"[body]subtitles=/tmp/ny/short.ass:fontsdir=/usr/share/fonts/opentype/inter[bt]")
fc.append("[bt][cv]concat=n=2:v=1:a=0[v]")
fc.append("[a0][a1][ac]concat=n=3:v=0:a=1[a]")
cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", SRC, "-loop", "1", "-t", "5", "-i", "/tmp/ny/card.png", "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT]
subprocess.run(cmd, check=True)
print(round(off + 5, 1), "сек")
