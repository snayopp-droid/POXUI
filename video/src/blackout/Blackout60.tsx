import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { assets, useAssets } from "../after/assets";
import { Person } from "../after/people";
import { Stage3D } from "../after/stage";
import { ramp, lerp, eio } from "../after/util";
import { headTurn, npcOutfit, type Act } from "../after/film";
import { Hallway, Fridge, PhoneScreen } from "./room";
import { reachArm, rel } from "./ik";
import { shotAt, heroAct, Spot, ROOM, Caption, type Cap, type Hero, type Shot } from "./Blackout";

export const BLACKOUT60_FRAMES = 1800;
const FPS = 30;
type V3 = [number, number, number];
const W = 1080, H = 1920;

/** таймлайн 60 c -> время исходной 25-секундной хореографии (замедление/удлинение) */
export const SEG: [number, number, number, number][] = [
  [0, 7.2, 0, 4], [7.2, 13.4, 4, 8], [13.4, 21.6, 8, 13], [21.6, 29.6, 13, 19],
  [44.6, 50.6, 19, 22], [50.6, 53.1, 22, 23.3], [53.1, 55.1, 23.3, 24.3], [55.1, 61, 24.3, 24.3],
];
export const toOrig = (t: number) => {
  for (const [a, b, o0, o1] of SEG) if (t < b) return lerp(o0, o1, Math.max(0, (t - a) / (b - a)));
  return 24.3;
};

const T_FRIDGE = 29.6, T_NEIGH = 35.6, T_PHONE = 44.6;

const fridgeShot = (te: number): Shot => {
  const base = shotAt(18.99);
  const pos: V3 = [-1.12, 0, -0.5];
  const rotY = -Math.PI / 2;
  const reach = eio(ramp(te, 0.9, 1.5)) * (1 - eio(ramp(te, 2.7, 3.2)));
  const tug = ramp(te, 1.7, 1.9) * (1 - ramp(te, 1.9, 2.2)) * 0.04;
  const handle = new THREE.Vector3(-1.58 + tug, 1.2, -0.38);
  const shake = Math.sin((te - 3.2) * 8) * 0.45 * ramp(te, 3.2, 3.4) * (1 - ramp(te, 4.4, 4.8));
  const phone = rel(pos, rotY, [-0.2, 1.15, 0.35]);
  const h: Hero = {
    pos, rotY, clip: "Idle_Loop", time: te * 0.8,
    right: { target: phone, w: 1 }, left: reach > 0.01 ? { target: handle, w: reach } : null,
    head: shake, headPitch: 0.15,
  };
  const k = eio(ramp(te, 0, 5.6));
  return {
    cam: { pos: [lerp(0.35, 0.1, k), 1.5, lerp(1.2, 0.95, k)], look: [-1.45, 1.2, -0.45], fov: 46 },
    mood: ROOM, focus: [-1.5, 0, -0.4],
    scene: (
      <>
        {base.scene}
        <Fridge />
        <pointLight position={[-0.9, 1.9, -0.2]} color="#9fb4e8" intensity={9} distance={5} decay={1.5} />
        <Spot from={[phone.x, phone.y, phone.z]} to={[-1.62, 1.15, -0.4]} intensity={12} angle={0.7} />
        <PhoneScreen p={[phone.x, phone.y, phone.z]} rx={-0.5} ry={rotY + Math.PI} glow={1} />
      </>
    ),
    acts: [heroAct(h)],
  };
};

const neighShot = (te: number): Shot => {
  const pos: V3 = [-0.65, 0, -1.5];
  const rotY = -Math.PI / 2;
  const knock = [0.5, 1.0, 1.5].reduce((a, k) => a + Math.max(0, 1 - Math.abs(te - k) / 0.12), 0);
  const knockW = eio(ramp(te, 0, 0.35)) * (1 - eio(ramp(te, 2.0, 2.5)));
  const phone = rel(pos, rotY, [0.2, 1.15, 0.35]);
  const nod = 0.18 * Math.sin(ramp(te, 4.6, 5.6) * Math.PI);
  const h: Hero = {
    pos, rotY, clip: "Idle_Loop", time: te * 0.8,
    right: { target: new THREE.Vector3(lerp(-1.02, -1.2, Math.min(1, knock)), 1.4 + 0.02 * knock, -1.6), w: knockW },
    left: { target: phone, w: 1 }, head: 0, headPitch: 0.05 + nod,
  };
  const open = eio(ramp(te, 2.6, 3.8));
  const wk = ramp(te, 3.0, 4.2);
  const wpos: V3 = [lerp(-2.3, -1.12, wk), 0, -1.4];
  const wRot = Math.PI / 2;
  const wPhone = rel(wpos, wRot, [-0.2, 1.15, 0.3]);
  const wRaise = eio(ramp(te, 4.1, 4.7));
  const wpose = wk < 0.97 ? { clip: "Walk_Loop", time: (te - 3.0) * 1.0 } : { clip: "Idle_Loop", time: te * 0.7 };
  const woman: Act = {
    id: "neigh", kind: "female",
    outfit: { ...npcOutfit(5), hair: "#c4c4c8", hairStyle: "bun" as const, shirt: "#4a2f3a", shirt2: "#5a3a48", skin: "#e6c3a8", sleeve: 0.9 },
    pos: wpos, rotY: wRot, pose: [wpose],
    mod: (b) => {
      headTurn(b, 0, 0.1 + 0.12 * Math.sin(ramp(te, 5.0, 6.0) * Math.PI), 0);
      if (wRaise > 0) reachArm(b, "r", rel(wpos, wRot, [-0.2, 1.15, 0.3]), rel(wpos, wRot, [-0.55, 0.7, -0.3]), wRaise);
    },
  };
  const k = eio(ramp(te, 0, 8.4));
  const acts: Act[] = [heroAct(h)];
  if (te >= 2.9) acts.push(woman);
  return {
    cam: { pos: [lerp(0.75, 0.45, k), 1.45, lerp(-4.0, -3.4, k)], look: [-0.95, 1.35, -1.5], fov: 38 },
    mood: ROOM, focus: [-1, 0, -1.5],
    scene: (
      <>
        <Hallway neighbor={open} />
        <Spot from={[phone.x, phone.y, phone.z]} to={[-1.35, 1.15, -1.55]} intensity={3} angle={0.6} />
        <PhoneScreen p={[phone.x, phone.y, phone.z]} rx={-0.5} ry={rotY + Math.PI} glow={1} />
        {wRaise > 0 && te > 4.1 && <PhoneScreen p={[wPhone.x, wPhone.y, wPhone.z]} rx={-0.5} ry={wRot + Math.PI} glow={1} />}
      </>
    ),
    acts,
  };
};

/* ───── подписи ───── */
const CAPS: Cap[] = [
  { t0: -0.3, t1: 6.9, y: "top", lines: [{ text: "ПОЛНЫЙ" }, { text: "БЛЭКАУТ", red: true }], size: 150 },
  { t0: 1.8, t1: 6.9, y: "bottom", lines: [{ text: "БЕЗ СВЕТА." }, { text: "БЕЗ ЛИФТА." }, { text: "БЕЗ ИНТЕРНЕТА." }], size: 88 },
  { t0: 7.6, t1: 12.6, y: "bottom", lines: [{ text: "НЕ ПАНИКУЙ." }, { text: "ВКЛЮЧИ ФОНАРИК" }], size: 100 },
  { t0: 13.6, t1: 17.4, y: "bottom", lines: [{ text: "ПРОВЕРЬ:" }, { text: "СВЕТ ТОЛЬКО" }, { text: "У ТЕБЯ?" }], size: 100 },
  { t0: 17.9, t1: 20.1, y: "bottom", lines: [{ text: "НЕ ПОЛЬЗУЙСЯ" }, { text: "ЛИФТОМ" }], size: 112 },
  { t0: 20.2, t1: 22.4, y: "bottom", lines: [{ text: "УЗНАЙ" }, { text: "ОБСТАНОВКУ" }], size: 112 },
  { t0: 23.6, t1: 25.0, y: "top", lines: [{ text: "ВОДА" }], size: 150 },
  { t0: 24.9, t1: 26.3, y: "top", lines: [{ text: "ЛЕКАРСТВА" }], size: 128 },
  { t0: 26.2, t1: 27.6, y: "top", lines: [{ text: "ДОКУМЕНТЫ" }], size: 118 },
  { t0: 27.5, t1: 28.8, y: "top", lines: [{ text: "КЛЮЧИ" }], size: 150 },
  { t0: 28.7, t1: 30.0, y: "top", lines: [{ text: "ЗАРЯД" }], size: 150 },
  { t0: T_FRIDGE + 0.9, t1: T_FRIDGE + 5.5, y: "bottom", lines: [{ text: "НЕ ОТКРЫВАЙ" }, { text: "ХОЛОДИЛЬНИК" }], size: 100 },
  { t0: T_NEIGH + 0.2, t1: T_NEIGH + 8.0, y: "bottom", lines: [{ text: "ЗАГЛЯНИ" }, { text: "К СОСЕДЯМ" }], size: 112 },
  { t0: T_PHONE + 0.8, t1: T_PHONE + 5.9, y: "top", lines: [{ text: "НАПИШИ" }, { text: "БЛИЗКИМ" }], size: 128 },
  { t0: 53.4, t1: 60.6, y: "center", lines: [{ text: "СОБЕРИСЬ." }, { text: "ПРОВЕРЬ" }, { text: "ИНФОРМАЦИЮ." }, { text: "БЕРЕГИ СВЯЗЬ." }], size: 100 },
];

const dipAt = (t: number, c: number, w: number) => Math.max(0, 1 - Math.abs(t - c) / w);

export const BlackoutVideo60: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ok = useAssets();
  const lib = ok ? assets.lib : null;

  let s: Shot;
  if (t >= T_FRIDGE && t < T_NEIGH) s = fridgeShot(t - T_FRIDGE);
  else if (t >= T_NEIGH && t < T_PHONE) s = neighShot(t - T_NEIGH);
  else {
    s = shotAt(toOrig(t));
    if (t > 55.1) s = { ...s, cam: { ...s.cam, pos: [s.cam.pos[0], s.cam.pos[1], s.cam.pos[2] - 0.05 * (Math.min(t, 59) - 55.1)] } };
  }
  const cam = s.cam;
  const dip = Math.max(dipAt(t, 7.2, 0.2), dipAt(t, T_FRIDGE, 0.12), dipAt(t, T_NEIGH, 0.12), dipAt(t, T_PHONE, 0.12));
  const vis = (p: V3) => Math.hypot(p[0] - cam.pos[0], p[1] + 1 - cam.pos[1], p[2] - cam.pos[2]) < 90;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {lib && (
        <Stage3D width={W} height={H} mood={s.mood} cam={cam} focus={s.focus}>
          {s.scene}
          {s.acts.filter((a) => vis(a.pos)).map((a) => (
            <Person key={a.id} kind={a.kind} lib={lib} pose={a.pose} outfit={a.outfit} position={a.pos} rotY={a.rotY} mod={a.mod} />
          ))}
        </Stage3D>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,20,50,0.18), rgba(0,0,0,0) 40%, rgba(0,0,0,0.25))" }} />
      {CAPS.map((c, i) => <Caption key={i} cap={c} t={t} />)}
      <AbsoluteFill style={{ background: "#000", opacity: dip }} />
    </AbsoluteFill>
  );
};
