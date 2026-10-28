"""Забирает озвучку и звуки «Блэкаута» из tool-results -> public/blackout/{vo,sfx}/"""
import glob, json, os, urllib.request, subprocess
TR = "/root/.claude/projects/-home-user-POXUI/8aaa914d-622e-5659-b92f-8f4f3f8d4583/tool-results/"
KEYS = {"[calm, confident] Сначала": "vo1", "[calm, confident] Не пользуйся": "vo2", "[calm, confident] Подготовь": "vo3", "[calm, reassuring] Свяжись": "vo4",
 "Quiet city night": "city", "Soft electrical power outage": "powerdown", "Single quiet click": "click", "Small battery radio": "radio",
 "Soft thud": "tap", "Soft smartphone message": "phone", "Calm atmospheric cinematic": "music"}
best = {}
for f in sorted(glob.glob(TR + "mcp-ElevenLabs-creative_get_flow_run_status-*.txt")):
    if int(f.rsplit("-", 1)[1].split(".")[0]) < 1793171000000: continue
    try: d = json.load(open(f))
    except Exception: continue
    for g in d.get("generations", []):
        if g.get("status") != "completed" or "content_url" not in g: continue
        k = next((v for p, v in KEYS.items() if g["prompt"].startswith(p)), None)
        if k and g.get("duration_secs", 0) >= best.get(k, (0, ""))[0]: best[k] = (g.get("duration_secs", 0), g["content_url"])
os.makedirs("public/blackout/vo", exist_ok=True); os.makedirs("public/blackout/sfx", exist_ok=True)
for k, (dur, u) in best.items():
    out = f"public/blackout/{'vo' if k.startswith('vo') else 'sfx'}/{k}.mp3"
    if not (os.path.exists(out) and os.path.getsize(out) > 1000): urllib.request.urlretrieve(u, out)
    print(k, round(dur, 2))
print(sorted(set(KEYS.values()) - set(best)))
