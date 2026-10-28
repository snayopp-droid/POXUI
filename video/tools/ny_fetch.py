"""Скачивает озвучку «Из Москвы в Нью-Йорк» из tool-results -> public/ny/vo/<id>.mp3, меряет длительность -> tools/ny_vo_meta.json"""
import glob, json, os, subprocess, urllib.request
TR = "/root/.claude/projects/-home-user-POXUI/8aaa914d-622e-5659-b92f-8f4f3f8d4583/tool-results/"
lines = {l[2]: l[0] for l in json.load(open("tools/ny_lines.json"))["lines"]}
got = {}
for f in sorted(glob.glob(TR + "mcp-ElevenLabs-creative_get_flow_run_status-*.txt")):
    if int(f.rsplit("-", 1)[1].split(".")[0]) < 1793157900000: continue
    try: d = json.load(open(f))
    except Exception: continue
    for g in d.get("generations", []):
        k = lines.get(g["prompt"])
        if k and g["status"] == "completed" and "content_url" in g: got[k] = g["content_url"]
for k, u in got.items():
    out = f"public/ny/vo/{k}.mp3"
    if os.path.exists(out) and os.path.getsize(out) > 1000: continue
    urllib.request.urlretrieve(u, out)
meta = {}
for k in lines.values():
    p = f"public/ny/vo/{k}.mp3"
    if not os.path.exists(p): print("missing", k); continue
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode())
    # речь: обрезаем тишину по краям
    s = subprocess.run(["ffmpeg", "-i", p, "-af", "silencedetect=n=-40dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
    st, en = 0.0, dur
    import re
    ss = re.findall(r"silence_start: ([\d.]+)", s); se = re.findall(r"silence_end: ([\d.]+)", s)
    if se and ss and float(ss[0]) < 0.01: st = float(se[0])
    if ss and float(ss[-1]) > dur - 1.5 and (len(ss) > len(se)): en = float(ss[-1])
    meta[k] = {"dur": round(dur, 3), "speech": [round(st, 3), round(en, 3)]}
json.dump(meta, open("tools/ny_vo_meta.json", "w"), ensure_ascii=False, indent=0)
print(len(got), "downloaded;", len(meta), "meta; total", round(sum(m["dur"] for m in meta.values()), 1), "s")
