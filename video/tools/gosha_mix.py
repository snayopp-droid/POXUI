"""Сводит звук серии «Гоша» -> /tmp/gs/mix.m4a. Один голос на все реплики."""
import json, subprocess, numpy as np, os
SR = 44100
D = json.load(open("/tmp/gs/beats.json")); beats = D["beats"]; TOTAL = D["total"] + 0.5
N = int(TOTAL * SR)
rng = np.random.default_rng(5)

def load(path, loud=True):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(r, dtype=np.float32).copy()
    if loud:
        rms = np.sqrt(np.mean(x ** 2) + 1e-9); x *= 0.11 / rms; x = np.clip(x, -0.95, 0.95)
    return x
def put(buf, x, t, g=1.0):
    i = int(t * SR); e = min(N, i + len(x))
    if i < N: buf[i:e] += x[: e - i] * g
def env(n, a, d): t = np.arange(n) / SR; e = np.exp(-t / d); k = max(1, int(a * SR)); e[:k] *= np.linspace(0, 1, k); return e
def lp(x, fc):
    from numpy import exp, pi
    a = exp(-2 * pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
tt = lambda d: np.arange(int(d * SR)) / SR

def clink(f=3200):
    t = tt(0.5); return (np.sin(2*np.pi*f*t) + 0.6*np.sin(2*np.pi*f*1.52*t) + 0.4*np.sin(2*np.pi*f*2.1*t)) * env(len(t), 0.002, 0.07) * 0.5
def coin():
    t = tt(0.6); a = np.sin(2*np.pi*1318*t) * env(len(t), .002, .12); b = np.sin(2*np.pi*1760*t) * env(len(t), .002, .25); b[: int(.07*SR)] = 0; b = np.roll(b, int(.07*SR)); return (a + b) * 0.45
def pop():
    t = tt(0.35); f = 500 + 900 * np.exp(-t / 0.05); return np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(t), .002, .08) * 0.6
def whoosh():
    t = tt(0.7); n = rng.normal(0, 1, len(t)); x = lp(n, 2500) - lp(n, 300); e = np.sin(np.pi * np.clip(t / 0.7, 0, 1)) ** 2; return x * e * 0.6
def stamp():
    t = tt(0.6); x = np.sin(2*np.pi*70*t) * env(len(t), .001, .16) + lp(rng.normal(0, 1, len(t)), 900) * env(len(t), .001, .05) * 0.8; return x * 0.9
def trash():
    t = tt(0.5); n = rng.normal(0, 1, len(t)); return (n - lp(n, 1800)) * env(len(t), .003, .09) * 0.5
def step():
    t = tt(0.12); return lp(rng.normal(0, 1, len(t)), 600) * env(len(t), .002, .03) * 0.5
def rev(x): return x[::-1]
def siren(d=6.0):
    t = tt(d); f = 700 + 300 * np.sin(2*np.pi*0.7*t); return np.sin(2*np.pi*np.cumsum(f)/SR) * 0.12 * np.clip(t / 0.5, 0, 1)
def wind(d):
    t = tt(d); n = lp(rng.normal(0, 1, len(t)), 500); return n * (0.6 + 0.4 * np.sin(2*np.pi*0.15*t)) * 0.5

vo = np.zeros(N); sfx = np.zeros(N); duck = np.zeros(N)
for b in beats:
    t0 = b["t0"]
    if b.get("line"):
        x = load(f"public/gosha/vo/{b['line']}.mp3"); put(vo, x, t0 + 0.02)
        i0 = int(t0 * SR); i1 = min(N, i0 + int(b["vd"] * SR)); duck[i0:i1] = 1
    if b.get("stamp"): put(sfx, stamp(), t0 + 0.12, 0.8)
    if b["money"] > b["moneyBefore"]:
        put(sfx, coin(), t0 + (b["d"] * 0.55 if b["id"] in ("2.01", "1.01") else min(1.2, b["d"] * 0.3)), 0.8)
    if b["money"] < b["moneyBefore"]: put(sfx, rev(coin()), t0 + 1.0, 0.7)
    if b["id"] in ("t0b", "6.01", "4.03"):
        for k in range(int(min(b["d"], 4) * 2.6)): put(sfx, step(), t0 + k * 0.38, 0.7)
    if b["id"] in ("2.01", "3.03"): [put(sfx, clink(2800 + 300 * k), t0 + 0.5 + k * 0.45, 0.8) for k in range(3 if b["id"] == "2.01" else 4)]
    if b["id"] == "2.01": put(sfx, trash(), t0 + 0.2, 0.9)
    if b["id"] in ("7.03", "8.01"): [put(sfx, coin(), t0 + 0.6 + k * 0.28, 0.7) for k in range(4)]
    if b["id"] in ("5.03",): put(sfx, stamp(), t0 + 0.5, 0.6)
    if b["id"] == "5.05": [put(sfx, pop(), t0 + 0.5 + k * 1.55, 0.7) for k in range(3)] + [put(sfx, stamp(), t0 + 5.5, 0.7)]
    if b["id"] in ("1.01", "6.01"): put(sfx, clink(), t0 + 0.3, 0.6)
    if b["id"] == "6.05": [put(sfx, clink(2600 + 400 * k), t0 + 0.4 + k * 0.1, 0.6) for k in range(5)]
    first = [x for x in beats if x["sc"] == b["sc"]][0] is b
    if first and b["sc"] > 0: put(sfx, whoosh(), t0 - 0.05, 0.8)
    if b["sc"] == 9 and b.get("line"): put(sfx, siren(b["d"] + 3), t0, 0.7)
    if b["id"] == "t0": put(sfx, wind(b["d"] + 2), t0, 0.6)

# музыка: тихая подложка, прижимается под голос
mus = load("public/bunker/music/warm.mp3", loud=False)
mus = np.tile(mus, int(np.ceil(N / len(mus))))[:N] * 0.0
m = load("public/bunker/music/tense.mp3", loud=False)
m = np.tile(m, int(np.ceil(N / len(m))))[:N]; mus = m / (np.sqrt(np.mean(m ** 2)) + 1e-9) * 0.03
# сглаженное приглушение
k = int(0.25 * SR); sm = np.convolve(duck, np.ones(k) / k, mode="same")
mus *= (1 - 0.45 * sm)
mus *= np.clip(np.minimum(np.arange(N) / (SR * 1.5), (N - np.arange(N)) / (SR * 2.5)), 0, 1)
mixd = vo * 1.0 + sfx * 0.55 + mus
mixd = np.tanh(mixd * 1.2) / 1.2
import wave
with wave.open("/tmp/gs/mix.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mixd, -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "/tmp/gs/mix.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=9,aformat=channel_layouts=stereo", "-c:a", "aac", "-b:a", "192k", "/tmp/gs/mix.m4a"], check=True)
print("ok", TOTAL)
