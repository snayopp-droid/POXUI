import subprocess, numpy as np, wave
SR = 44100; END = 41.6; N = int(END * SR); rng = np.random.default_rng(3)
def load(p, loud=True):
    x = np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","1","-ar",str(SR),"-f","f32le","-"],capture_output=True).stdout, dtype=np.float32).copy()
    if loud: x *= 0.12 / (np.sqrt(np.mean(x**2)) + 1e-9)
    return x
def put(b, x, t, g=1.0):
    i = int(t*SR); e = min(N, i+len(x))
    if i < N: b[i:e] += x[:e-i]*g
tt = lambda d: np.arange(int(d*SR))/SR
def env(n,a,d): t=np.arange(n)/SR; e=np.exp(-t/d); k=max(1,int(a*SR)); e[:k]*=np.linspace(0,1,k); return e
def lp(x, fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0.0
    for i,v in enumerate(x): s=(1-a)*v+a*s; y[i]=s
    return y
def whoosh(d=0.5):
    t=tt(d); n=rng.normal(0,1,len(t)); x=lp(n,3000)-lp(n,400); return x*np.sin(np.pi*np.clip(t/d,0,1))**2*0.7
def thud(): t=tt(0.7); return (np.sin(2*np.pi*55*t*np.exp(-t*2))*env(len(t),.001,.22)*1.1 + lp(rng.normal(0,1,len(t)),1200)*env(len(t),.001,.06)*0.8)
def hit(): t=tt(0.35); return (np.sin(2*np.pi*90*t)*env(len(t),.001,.07) + lp(rng.normal(0,1,len(t)),2000)*env(len(t),.001,.04)*0.7)*0.8
def riser(d): t=tt(d); f=200+1400*(t/d)**2; return np.sin(2*np.pi*np.cumsum(f)/SR)*(t/d)**2*0.15
def heart(): t=tt(0.3); return np.sin(2*np.pi*60*t)*env(len(t),.003,.07)*0.8
vo = np.zeros(N); fx = np.zeros(N)
put(vo, load("public/fight/vo.mp3"), 0.0)
for t in (6.5, 7.6): put(fx, whoosh(0.6), t, 0.5)
put(fx, whoosh(0.4), 9.1, 0.8); put(fx, hit(), 9.6, 0.9)
put(fx, riser(3.0), 12.2, 0.8)
put(fx, whoosh(0.5), 16.2, 1.0); put(fx, thud(), 16.7, 0.9)
for k in range(5): put(fx, hit(), 19.3 + k*0.9, 0.5)
for k in range(8): put(fx, heart(), 26.1 + k*0.8, 0.8)
put(fx, riser(2.0), 30.6, 0.9)
put(fx, thud(), 32.88, 1.8); put(fx, hit(), 32.9, 1.0); put(fx, whoosh(0.7), 33.0, 0.7)
put(fx, thud(), 35.6, 0.7)
# музыка
m = load("public/bunker/music/tense.mp3", loud=False); m = np.tile(m, int(np.ceil(N/len(m))))[:N]; m = m/(np.sqrt(np.mean(m**2))+1e-9)*0.035
m *= np.clip(np.minimum(np.arange(N)/(SR*1.0), (N-np.arange(N))/(SR*1.5)), 0, 1)
mix = np.tanh((vo + fx*0.6 + m)*1.15)/1.15
with wave.open("/tmp/gs/fight.wav","wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg","-y","-v","error","-i","/tmp/gs/fight.wav","-af","loudnorm=I=-14:TP=-1.5:LRA=9,aformat=channel_layouts=stereo","-c:a","aac","-b:a","192k","/tmp/gs/fight.m4a"],check=True)
print("ok")
