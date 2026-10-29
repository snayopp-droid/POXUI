"""Синтез бытовых звуков бункера (без внешних сервисов) -> public/bunker/sfx/*.wav"""
import numpy as np, wave, os
SR = 44100
rng = np.random.default_rng(11)
O = "public/bunker/sfx/"
os.makedirs(O, exist_ok=True)

def save(name, x, norm=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * norm
    with wave.open(O + name + ".wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def lp(x, fc):  # простой ФНЧ (один полюс, 2 прохода)
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
def hp(x, fc): return x - lp(x, fc)
def env(n, a, d):  # быстрая атака, экспоненциальный спад
    t = np.arange(n) / SR; e = np.exp(-t / d); e[: int(a * SR)] *= np.linspace(0, 1, int(a * SR)); return e

def loopfix(x, fade=0.5):
    n = int(fade * SR); y = x.copy(); y[:n] = x[:n] * np.linspace(0, 1, n) + x[-n:] * np.linspace(1, 0, n); return y[:-n]

t = np.arange(int(12 * SR)) / SR
# гул бункера: 50 Гц + гармоники + тихий шум, плавная модуляция
hum = 0.5 * np.sin(2 * np.pi * 50 * t) + 0.25 * np.sin(2 * np.pi * 100 * t + 1) + 0.12 * np.sin(2 * np.pi * 150 * t + 2) + 0.18 * lp(rng.normal(0, 1, t.size), 300)
hum *= 1 + 0.08 * np.sin(2 * np.pi * 0.25 * t)
save("hum", loopfix(hum), 0.7)

# счётчик Гейгера: щелчки с пуассоновским потоком
n = int(10 * SR); g = np.zeros(n)
for k in range(int(60)):
    p = int(rng.uniform(0, 10) * SR)
    if p + 400 < n:
        c = np.sin(2 * np.pi * rng.uniform(2200, 4200) * np.arange(400) / SR) * np.exp(-np.arange(400) / 38.0)
        g[p:p + 400] += c * rng.uniform(0.5, 1.0)
save("geiger", g, 0.8)
# плотный Гейгер
g2 = np.zeros(n)
for k in range(260):
    p = int(rng.uniform(0, 10) * SR)
    if p + 400 < n:
        c = np.sin(2 * np.pi * rng.uniform(2200, 4600) * np.arange(400) / SR) * np.exp(-np.arange(400) / 34.0)
        g2[p:p + 400] += c * rng.uniform(0.4, 1.0)
save("geiger_fast", g2, 0.8)

# статика радио
st = hp(lp(rng.normal(0, 1, 6 * SR), 6000), 400)
st *= 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 3.3 * np.arange(st.size) / SR + 2 * np.sin(np.arange(st.size) / SR * 0.7)))
save("static", loopfix(st), 0.8)

# лязг металла
nn = int(3.0 * SR); tt = np.arange(nn) / SR
cl = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / d) * a for f, d, a in [(180, 0.9, 1), (237, 0.7, 0.8), (412, 0.5, 0.6), (688, 0.35, 0.5), (1310, 0.2, 0.35), (2050, 0.12, 0.25)])
cl += hp(rng.normal(0, 1, nn), 1500) * np.exp(-tt / 0.05) * 0.8
save("clang", cl, 0.9)

# глухой удар/взрыв вдали
nn = int(4.5 * SR); tt = np.arange(nn) / SR
boom = np.sin(2 * np.pi * (70 * np.exp(-tt * 0.7) + 20) * tt) * np.exp(-tt / 1.3) + lp(rng.normal(0, 1, nn), 160) * np.exp(-tt / 1.6) * 1.4
save("boom", boom, 0.95)
# рокот (толчки)
nn = int(6 * SR); tt = np.arange(nn) / SR
rum = lp(rng.normal(0, 1, nn), 90) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 6 * tt))) * np.minimum(1, tt * 2) * np.exp(-tt / 3.2)
save("rumble", rum, 0.95)
# ветер
nn = int(14 * SR); tt = np.arange(nn) / SR
wind = lp(rng.normal(0, 1, nn), 420) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.17 * tt + 1) ** 2) + 0.4 * lp(rng.normal(0, 1, nn), 1400) * (0.4 + 0.6 * np.sin(2 * np.pi * 0.11 * tt) ** 2)
save("wind", loopfix(wind, 1.0), 0.8)
# вода/ручей
nn = int(10 * SR); tt = np.arange(nn) / SR
wat = hp(lp(rng.normal(0, 1, nn), 3500), 500) * (0.6 + 0.4 * np.sin(2 * np.pi * 1.7 * tt) * np.sin(2 * np.pi * 0.31 * tt))
save("water", loopfix(wat), 0.7)
# вентилятор
nn = int(8 * SR); tt = np.arange(nn) / SR
fan = lp(rng.normal(0, 1, nn), 900) * (0.7 + 0.3 * np.sin(2 * np.pi * 14 * tt)) + 0.3 * np.sin(2 * np.pi * 110 * tt)
save("fan", loopfix(fan), 0.6)
# храповик ручного заводного радио
nn = int(5 * SR); rat = np.zeros(nn)
for k in range(30):
    p = int(k * 0.165 * SR)
    c = (rng.normal(0, 1, 900) * np.exp(-np.arange(900) / 120.0)) + np.sin(2 * np.pi * 1200 * np.arange(900) / SR) * np.exp(-np.arange(900) / 90.0)
    rat[p:p + 900] += c
save("crank", rat, 0.8)
# тревога телефона/системы оповещения (двухтональный сигнал)
nn = int(4 * SR); tt = np.arange(nn) / SR
al = (np.sin(2 * np.pi * 853 * tt) + np.sin(2 * np.pi * 960 * tt)) * (np.floor(tt * 2) % 2 == 0) * np.minimum(1, tt * 20)
save("alert", al, 0.5)
# гудение лампы/мерцание
nn = int(4 * SR); tt = np.arange(nn) / SR
buz = np.sign(np.sin(2 * np.pi * 100 * tt)) * 0.3 + hp(rng.normal(0, 1, nn), 2000) * (np.sin(2 * np.pi * 9 * tt) > 0.2) * 0.6
save("buzz", buz, 0.6)
# глухой стук/падение
nn = int(1.2 * SR); tt = np.arange(nn) / SR
thud = np.sin(2 * np.pi * 90 * tt) * np.exp(-tt / 0.12) + lp(rng.normal(0, 1, nn), 400) * np.exp(-tt / 0.06)
save("thud", thud, 0.9)
# капля
nn = int(0.6 * SR); tt = np.arange(nn) / SR
dr = np.sin(2 * np.pi * (900 - 500 * tt) * tt) * np.exp(-tt / 0.07)
save("drip", dr, 0.6)
# мягкий «динь» для карточек
nn = int(1.6 * SR); tt = np.arange(nn) / SR
dg = (np.sin(2 * np.pi * 660 * tt) + 0.5 * np.sin(2 * np.pi * 990 * tt)) * np.exp(-tt / 0.45)
save("ding", dg, 0.55)
# птицы (чирики) для финала
nn = int(10 * SR); bd = np.zeros(nn)
for k in range(14):
    p = int(rng.uniform(0.3, 9.2) * SR)
    for j in range(rng.integers(3, 6)):
        q = p + int(j * 0.09 * SR); m = int(0.07 * SR)
        if q + m < nn:
            f = rng.uniform(2600, 4200); tt2 = np.arange(m) / SR
            bd[q:q + m] += np.sin(2 * np.pi * (f + 900 * tt2 / 0.07) * tt2) * np.sin(np.pi * tt2 / 0.07) * 0.5
save("birds", bd, 0.5)
print(sorted(os.listdir(O)))
