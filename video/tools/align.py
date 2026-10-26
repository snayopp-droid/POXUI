"""Тайминги слов озвучки: паузы (silencedetect) + пропорция по символам, DP по границам предложений."""
import json, re, subprocess, sys, math
VO = "public/fura/vo.mp3"
chunks = json.load(open("tools/align_chunks.json"))
starts = json.load(open("public/fura/chunk_starts.json"))
order = list("ABCDEFGHIJK")
out = subprocess.run(["ffmpeg","-i",VO,"-af","silencedetect=noise=-38dB:d=0.12","-f","null","-"],capture_output=True,text=True).stderr
sil=[]; cur=None
for line in out.splitlines():
    m=re.search(r"silence_start: ([\d.]+)",line)
    if m: cur=float(m.group(1))
    m=re.search(r"silence_end: ([\d.]+)",line)
    if m and cur is not None:
        sil.append((cur,float(m.group(1)))); cur=None
dur=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",VO]).strip())
def sentences(text):
    parts=re.split(r"(?<=[.!?…])(?:\s+|$)",text.replace("\n"," "))
    parts=[p.strip() for p in parts if p.strip()]
    # склеить «...» внутри одного предложения: оставляем как есть
    return parts
words_all=[]
for ci,c in enumerate(order):
    t0=starts[c]; t1=starts[order[ci+1]] if ci+1<len(order) else dur
    sents=sentences(chunks[c])
    S=len(sents)
    cs=[len(re.sub(r"[^\w]","",s)) for s in sents]
    cum=[0]
    for x in cs: cum.append(cum[-1]+x)
    tot=cum[-1]
    # кандидаты-паузы внутри куска
    cand=[(a,b) for a,b in sil if a>t0+0.3 and b<t1-0.15 and (b-a)>=0.14]
    # границы речи
    inside=[(a,b) for a,b in sil if a<=t0+0.3 and b>t0]
    sp0=max([b for a,b in sil if a<=t0+0.05 and b>=t0]+[t0]) if False else t0
    # начало речи = конец первой тишины, если она в начале
    first=[b for a,b in sil if a<=t0+0.02 and b>t0]
    sp0=first[0] if first else t0
    tail=[a for a,b in sil if a>=t0+1 and b>=t1-0.05 and a<t1]
    sp1=tail[-1] if tail else t1
    L=sp1-sp0
    # DP: выбрать S-1 пауз
    K=len(cand)
    bounds=[None]*S
    if S>1:
        INF=1e18
        # dp[j][k]: после выбора j границ, последняя - cand k
        dp=[[INF]*K for _ in range(S)]
        par=[[-1]*K for _ in range(S)]
        def err(j,k):
            a,b=cand[k]
            frac_t=((a+b)/2-sp0)/L
            frac_c=cum[j]/tot
            return (frac_t-frac_c)**2
        for k in range(K): dp[1][k]=err(1,k)
        for j in range(2,S):
            for k in range(K):
                best=INF;bp=-1
                for kk in range(k):
                    if dp[j-1][kk]<best: best=dp[j-1][kk];bp=kk
                if bp>=0:
                    dp[j][k]=best+err(j,k);par[j][k]=bp
        kbest=min(range(K),key=lambda k:dp[S-1][k]) if K else None
        sel=[]
        k=kbest
        for j in range(S-1,0,-1):
            sel.append(cand[k]); k=par[j][k]
        sel=sel[::-1]
    else: sel=[]
    segs=[]; ss=sp0
    for (a,b) in sel:
        segs.append((ss,a)); ss=b
    segs.append((ss,sp1))
    for s,(a,b) in zip(sents,segs):
        ws=s.split()
        w=[max(1,len(re.sub(r"[^\w]","",x))) + (3 if re.search(r"[,:—;]$",x) else 0) for x in ws]
        tw=sum(w); t=a
        for x,wi in zip(ws,w):
            d=(b-a)*wi/tw
            words_all.append([x,round(t,3),round(t+d-0.03,3)])
            t+=d
with open("src/wordsF.ts","w") as f:
    f.write("// слова озвучки: [текст, начало, конец] (сек. голосовой дорожки), выровнены по паузам\nexport const WORDS: [string, number, number][] = [\n")
    for w in words_all: f.write("  %s,\n"%json.dumps(w,ensure_ascii=False))
    f.write("];\n")
print(len(words_all),"words; last end",words_all[-1][2],"dur",dur)
