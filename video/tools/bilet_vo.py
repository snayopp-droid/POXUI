"""Сборка озвучки «Билет в один конец»: куски ElevenLabs + паузы, вставка тишин по фразам, тайминги слов."""
import json, re, subprocess, os
SRC = "public/bilet/vo"
OUT = "public/bilet/vo.mp3"
TMP = "/tmp/bilet_vo"
os.makedirs(TMP, exist_ok=True)
CH = json.load(open("tools/bilet_chunks.json"))
# порядок кусков и пауза (сек) перед каждым
ORDER = [("A", 2.6), ("B", 4.2), ("C", 3.2), ("D", 5.4), ("E", 5.6), ("X", 4.2), ("F", 3.2), ("G", 4.2), ("H", 3.6), ("I", 4.2)]
TAIL = 6.0
# дополнительные тишины: (кусок, фраза, сек) — вставляются перед фразой
SPLITS = [("E", "Удар штампа", 2.4), ("G", "И вспоминает", 1.6), ("H", "Утром его будит", 2.6), ("D", "Он ошибается", 1.2)]

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).strip())

def silences(f):
    out = subprocess.run(["ffmpeg", "-i", f, "-af", "silencedetect=noise=-38dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
    sil = []; cur = None
    for line in out.splitlines():
        m = re.search(r"silence_start: ([\d.]+)", line)
        if m: cur = float(m.group(1))
        m = re.search(r"silence_end: ([\d.]+)", line)
        if m and cur is not None: sil.append((cur, float(m.group(1)))); cur = None
    return sil

def sentences(text):
    parts = re.split(r"(?<=[.!?…»])(?:\s+|$)", text.replace("\n", " "))
    return [p.strip() for p in parts if p.strip()]

def align_chunk(f, text, off):
    """слова одного куска: DP по паузам на границах предложений"""
    sil = silences(f); D = dur(f)
    sents = sentences(text); S = len(sents)
    cs = [max(1, len(re.sub(r"[^\w]", "", s))) for s in sents]
    cum = [0]
    for x in cs: cum.append(cum[-1] + x)
    tot = cum[-1]
    first = [b for a, b in sil if a <= 0.05]
    sp0 = first[0] if first else 0.0
    tail = [a for a, b in sil if b >= D - 0.05 and a > sp0 + 0.5]
    sp1 = tail[-1] if tail else D
    L = sp1 - sp0
    cand = [(a, b) for a, b in sil if a > sp0 + 0.2 and b < sp1 - 0.1 and (b - a) >= 0.14]
    K = len(cand); sel = []
    if S > 1 and K >= S - 1:
        INF = 1e18
        dp = [[INF] * K for _ in range(S)]; par = [[-1] * K for _ in range(S)]
        def err(j, k):
            a, b = cand[k]
            return (((a + b) / 2 - sp0) / L - cum[j] / tot) ** 2
        for k in range(K): dp[1][k] = err(1, k)
        for j in range(2, S):
            for k in range(K):
                best = INF; bp = -1
                for kk in range(k):
                    if dp[j - 1][kk] < best: best = dp[j - 1][kk]; bp = kk
                if bp >= 0: dp[j][k] = best + err(j, k); par[j][k] = bp
        k = min(range(K), key=lambda k: dp[S - 1][k])
        for j in range(S - 1, 0, -1): sel.append(cand[k]); k = par[j][k]
        sel = sel[::-1]
    elif S > 1:
        # мало пауз — делим пропорционально
        sel = [(sp0 + L * cum[j] / tot, sp0 + L * cum[j] / tot) for j in range(1, S)]
    segs = []; ss = sp0
    for a, b in sel: segs.append((ss, a)); ss = b
    segs.append((ss, sp1))
    words = []
    for s, (a, b) in zip(sents, segs):
        ws = s.split()
        w = [max(1, len(re.sub(r"[^\w]", "", x))) + (3 if re.search(r"[,:—;]$", x) else 0) for x in ws]
        tw = sum(w); t = a
        for x, wi in zip(ws, w):
            d = (b - a) * wi / tw
            words.append([x, round(t + off, 3), round(t + off + d - 0.03, 3)])
            t += d
    return words

# 1) разрезать куски по фразам SPLITS
pieces = []  # (file, text, gap)
for key, gap in ORDER:
    f = f"{SRC}/{key}.mp3"; text = CH[key]
    sp = [s for s in SPLITS if s[0] == key]
    if not sp:
        pieces.append((f, text, gap)); continue
    _, phrase, extra = sp[0]
    ws = align_chunk(f, text, 0)
    toks = [re.sub(r"[^\wё]", "", w[0].lower()) for w in ws]
    p0 = re.sub(r"[^\wё ]", "", phrase.lower()).split()
    i = next(i for i in range(len(toks)) if toks[i:i + len(p0)] == p0)
    # точка разреза — середина паузы перед фразой
    sil = silences(f)
    near = [(a, b) for a, b in sil if a < ws[i][1] + 0.25 and b > ws[i - 1][2] - 0.25]
    cut = (near[-1][0] + near[-1][1]) / 2 if near else (ws[i - 1][2] + ws[i][1]) / 2
    pos = text.find(phrase)
    t1, t2 = text[:pos].strip(), text[pos:].strip()
    a, b = f"{TMP}/{key}_1.wav", f"{TMP}/{key}_2.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f, "-t", str(cut), "-ar", "44100", "-ac", "1", a], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(cut), "-i", f, "-ar", "44100", "-ac", "1", b], check=True)
    pieces.append((a, t1, gap)); pieces.append((b, t2, extra))
    print(key, "cut at", round(cut, 2), "before", phrase)

# 2) собрать с паузами
inputs = []; filt = []; starts = []; t = 0.0; words = []
for n, (f, text, gap) in enumerate(pieces):
    t += gap
    starts.append(round(t, 3))
    words += align_chunk(f, text, t)
    inputs += ["-i", f]
    filt.append(f"[{n}:a]aresample=44100,aformat=channel_layouts=mono,adelay={int(t * 1000)}|{int(t * 1000)},apad[a{n}]")
    t += dur(f)
total = t + TAIL
mix = ";".join(filt) + ";" + "".join(f"[a{n}]" for n in range(len(pieces))) + f"amix=inputs={len(pieces)}:normalize=0:duration=longest,atrim=0:{total},loudnorm=I=-16:TP=-1.5:LRA=11[o]"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + inputs + ["-filter_complex", mix, "-map", "[o]", "-ar", "44100", "-b:a", "192k", OUT], check=True)
with open("src/wordsB.ts", "w") as fo:
    fo.write("// слова озвучки «Билет в один конец»: [текст, начало, конец] (сек. ролика)\nexport const WORDS: [string, number, number][] = [\n")
    for w in words: fo.write("  %s,\n" % json.dumps(w, ensure_ascii=False))
    fo.write("];\n")
    fo.write(f"export const VO_TOTAL = {round(total, 3)};\n")
print(len(words), "words; total", round(total, 2), "s; vo dur", round(dur(OUT), 2))
