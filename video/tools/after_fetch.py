"""Скачивает готовые генерации из tool-results ElevenLabs: реплики -> public/after/vo/<id>.mp3, звуки -> public/after/sfx/<label>.mp3"""
import glob, json, os, subprocess, sys
TR = "/root/.claude/projects/-home-user-POXUI/8aaa914d-622e-5659-b92f-8f4f3f8d4583/tool-results/"
lines = {l[2]: l[0] for l in json.load(open("tools/after_lines.json"))["lines"]}
SFX = {
 "Quiet empty city street in autumn": "amb_street", "Residential courtyard at dusk": "amb_courtyard", "Narrow dark alley": "amb_alley",
 "Slow heavy human heartbeat": "heartbeat", "Single low zombie groan": "zgroan1", "Zombie rasping moan": "zgroan2",
 "Many slow dragging shuffling": "zshuffle", "Slow creaking neck": "zneck", "Distant horde of zombies": "zhorde",
 "Slow soft calm exhaling": "zcalm", "Soft muffled footsteps in felt": "felt_steps", "Slow careful tiptoe": "tiptoe",
 "Muffled sneeze": "sneeze", "Sharp tense inhale": "inhale", "Muffled scream of pain": "sleeve_scream",
 "Suppressed snorting laugh": "silent_laugh", "A mother quietly humming": "hum_lullaby", "Water being filled": "water_queue",
 "Crowd of people whispering": "crowd_whisper", "Heavy metal courtyard gate": "gate_slam", "Many hands shaking": "gate_shake",
 "Small wooden music box falls": "box_fall", "Vintage music box playing": "musicbox", "Winding the key": "musicbox_key",
 "A stray dog barking": "dog_bark", "Fast running footsteps": "run_steps", "Person slipping": "slip",
 "Deep cinematic impact boom": "boom", "Slow tense cinematic riser": "riser", "Short soft digital UI tick": "ui_tick",
 "Digital warning alarm": "ui_alarm", "Soft UI panel pop-in": "ui_pop", "Dark minimal ambient score": "score_tension",
 "Quirky deadpan comedic": "score_quirky", "Tense chase score": "score_chase", "Warm emotional cinematic score": "score_hope",
 "Distant acoustic guitar": "guitar_far", "Children giggling": "kids_laugh", "A small group of adults laughing": "crowd_laugh",
 "Cinematic title sting": "title_sting", "Wind rattling paper": "paper_wind",
}
got, pending = {}, []
for f in sorted(glob.glob(TR + "mcp-ElevenLabs-creative_get_flow_run_status-*.txt")):
    if int(f.rsplit("-", 1)[1].split(".")[0]) < 1793139900000: continue
    try: d = json.load(open(f))
    except Exception: continue
    for g in d.get("generations", []):
        p = g["prompt"]
        if g["status"] != "completed" or "content_url" not in g:
            pending.append(p[:40]); continue
        key = lines.get(p)
        if key is None:
            m = [v for k, v in SFX.items() if p.startswith(k)]
            key = m[0] if m else None
            out = f"public/after/sfx/{key}.mp3" if key else None
        else:
            out = f"public/after/vo/{key}.mp3"
        if out is None: print("??", p[:50]); continue
        got[out] = (g["content_url"], g.get("duration_secs"))
for out, (u, dur) in got.items():
    if os.path.exists(out) and os.path.getsize(out) > 1000: continue
    subprocess.run(["curl", "-sS", "-o", out, u], check=True)
print(len(got), "ready;", len(pending), "pending", pending[:5])
