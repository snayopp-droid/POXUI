"""Скачивает SFX/музыку «Из Москвы в Нью-Йорк» из tool-results -> public/ny/sfx/<label>.mp3 (берётся самая длинная версия)"""
import glob, json, os, urllib.request
TR = "/root/.claude/projects/-home-user-POXUI/8aaa914d-622e-5659-b92f-8f4f3f8d4583/tool-results/"
KEYS = {
 "Quiet apartment room tone": "amb_apt", "Early morning empty city street": "amb_moscow", "Inside a taxi car": "car_interior",
 "Large international airport terminal": "amb_airport", "Airplane cabin cruising": "amb_plane", "Passenger jet taking off": "plane_takeoff",
 "Immigration hall": "amb_jfk", "Heavy rubber passport stamp": "stamp", "Manhattan street ambience": "amb_nyc",
 "Quiet Brooklyn residential": "amb_brooklyn", "Busy New York coffee shop": "amb_cafe", "New York subway train arriving": "subway_arrive",
 "Empty subway platform": "amb_subway", "Rooftop at sunset": "amb_rooftop", "Smartphone video call": "phone_ring",
 "Rolling suitcase wheels": "suitcase", "Heavy apartment door": "door_lock", "Single light switch": "switch",
 "New York taxi horn": "taxi_horns", "Airplane cabin seatbelt": "chime", "Cinematic film score: slow melancholic": "score_intro",
 "Cinematic ambient score for a journey": "score_journey", "Cinematic score of wonder": "score_wonder",
 "Light quirky indie": "score_comic", "Cinematic score of loneliness": "score_lonely", "Emotional cinematic finale": "score_finale",
}
best = {}
for f in sorted(glob.glob(TR + "mcp-ElevenLabs-creative_get_flow_run_status-*.txt")):
    if int(f.rsplit("-", 1)[1].split(".")[0]) < 1793158000000: continue
    try: d = json.load(open(f))
    except Exception: continue
    for g in d.get("generations", []):
        if g.get("status") != "completed" or "content_url" not in g: continue
        k = next((v for p, v in KEYS.items() if g["prompt"].startswith(p)), None)
        if k and g.get("duration_secs", 0) >= best.get(k, (0, ""))[0]: best[k] = (g.get("duration_secs", 0), g["content_url"])
os.makedirs("public/ny/sfx", exist_ok=True)
for k, (dur, u) in best.items():
    out = f"public/ny/sfx/{k}.mp3"
    if not (os.path.exists(out) and os.path.getsize(out) > 1000): urllib.request.urlretrieve(u, out)
print(len(best), sorted(set(KEYS.values()) - set(best)))
for k, (dur, u) in sorted(best.items()): print(k, dur)
