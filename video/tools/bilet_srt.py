"""Субтитры .srt из src/wordsB.ts — та же разбивка, что в Bilet.tsx"""
import json, re, sys
W = [json.loads(l.strip().rstrip(",")) for l in open("src/wordsB.ts") if l.strip().startswith('["')]
out = []; cur = []; a = b = 0
for i, w in enumerate(W):
    if not cur: a = w[1]
    cur.append(w[0]); b = w[2]
    txt = " ".join(cur); nxt = W[i + 1] if i + 1 < len(W) else None
    gap = nxt[1] - w[2] if nxt else 9
    if (re.search(r"[.!?…»]$", w[0]) and len(txt) > 14) or len(txt) > 52 or gap > 0.6 or not nxt or (re.search(r"[,:—]$", w[0]) and len(txt) > 34):
        out.append([txt, a, b]); cur = []
for i, l in enumerate(out):
    na = out[i + 1][1] if i + 1 < len(out) else l[2] + 3
    l[2] = min(max(l[2] + 0.35, l[1] + 1.8), na - 0.05)
ts = lambda s: "%02d:%02d:%02d,%03d" % (s // 3600, s % 3600 // 60, s % 60, round((s % 1) * 1000) % 1000)
with open(sys.argv[1], "w") as f:
    for i, (t, a, b) in enumerate(out, 1):
        f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n")
print(len(out), "lines")
