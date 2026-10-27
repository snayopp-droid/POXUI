"""Подготовка 3D-ассетов (Quaternius, CC0): персонажи + анимации -> public/zombie/. Запуск: python3 -I tools/zombie_assets.py"""
import json, os, shutil, sys
from PIL import Image
S = "/tmp/claude-0/-home-user-POXUI/8aaa914d-622e-5659-b92f-8f4f3f8d4583/scratchpad/"
BC = S + "dl_ubc/x/Universal Base Characters[Standard]/Base Characters/"
OUT = "public/after/"
os.makedirs(OUT + "chars", exist_ok=True)
os.makedirs(OUT + "anim", exist_ok=True)

def tex(src, dst, size, alpha=False, q=88):
    im = Image.open(src)
    im = im.convert("RGBA" if alpha else "RGB").resize((size, size), Image.LANCZOS)
    if alpha:
        im.save(dst, optimize=True)
    else:
        im.save(dst, quality=q, optimize=True)

for who, body in (("Male", "T_Superhero_Male_Dark.png"), ("Female", "T_Superhero_Female_Dark_BaseColor.png")):
    g = json.load(open(BC + f"Godot - UE/Superhero_{who}_FullBody.gltf"))
    # перекладываем текстуры в компактные файлы
    mp = {}
    for i, im in enumerate(g["images"]):
        u = im["uri"]
        base = os.path.basename(u)
        if "Normal" in base or "Roughness" in base:
            mp[i] = None
            continue
        if base.startswith("T_Superhero"):
            dst = f"{who.lower()}_body.jpg"; tex(BC + "Textures/" + body, OUT + "chars/" + dst, 1024)
        elif base.startswith("T_Hair"):
            n = "1" if "Hair_1" in base else "2"
            dst = f"hair{n}.png"; tex(BC + "Textures/" + f"T_Hair_{n}_BaseColor.png", OUT + "chars/" + dst, 1024, alpha=True)
        elif base.startswith("T_Eye"):
            dst = "eye.png"; shutil.copy(BC + "Textures/T_Eye_Brown.png", OUT + "chars/" + dst)
        else:
            mp[i] = None; continue
        mp[i] = dst
        im["uri"] = dst
    # убираем нормали/шероховатость из материалов
    for m in g["materials"]:
        pb = m.get("pbrMetallicRoughness", {})
        pb.pop("metallicRoughnessTexture", None)
        m.pop("normalTexture", None)
    shutil.copy(BC + f"Godot - UE/Superhero_{who}_FullBody.bin", OUT + f"chars/{who.lower()}.bin")
    g["buffers"][0]["uri"] = f"{who.lower()}.bin"
    json.dump(g, open(OUT + f"chars/{who.lower()}.gltf", "w"))
    print(who, "images:", [im["uri"] for im in g["images"]])

AL1 = S + "dl_ual1/x/Animation Library[Standard]/Godot/AnimationLibrary_Godot_Standard.glb"
AL2 = S + "dl_ual2/x/Universal Animation Library 2 [Standard]/Unreal-Godot/UAL2_Standard.glb"
shutil.copy(AL1, OUT + "anim/ual1.glb")
shutil.copy(AL2, OUT + "anim/ual2.glb")
os.system("du -sh public/after/*")
