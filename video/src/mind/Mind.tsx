import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage3D, type Cam } from "../after/stage";
import { type Mood } from "../after/world";
import { cl, ramp, lerp, eio, eout } from "../after/util";
import { once, cv, mkTex } from "../ny/tex";
import { Box, M } from "../ny/props";
import { Stick, type Look, type Pose } from "./stick";
import { Town, Park, Bedroom, Kitchen, DUSK, SUNSET, INDOOR } from "./town";
import cues from "./cues.json";

export const MIND_FRAMES = 1860;
const FPS = 30, W = 1920, H = 1080;
type V = [number, number, number];
const GY = 0.12;

/* ───── герои ───── */
const HERO: Look = { hood: "#e8782a", pants: "#2a3a66", shoes: "#ececf0", accent: "#f6d9a8" };
const L = {
  green: { hood: "#3a9a7a", pants: "#2c3150", accent: "#d8f0e0" } as Look,
  pink: { hood: "#c8508a", pants: "#3a2c50", accent: "#f4d0e0" } as Look,
  blue: { hood: "#3a6ac8", pants: "#262a44", accent: "#cfe0ff" } as Look,
  yellow: { hood: "#e8c030", pants: "#3a3a58", accent: "#fff0b0" } as Look,
  purple: { hood: "#7a4ac8", pants: "#2a2c4a", accent: "#e0d0ff" } as Look,
  teal: { hood: "#2aa0b8", pants: "#2a3450", accent: "#c8f0f8" } as Look,
  red: { hood: "#d8483a", pants: "#2a2c44", accent: "#ffd0c8" } as Look,
  grey: { hood: "#8a8aa0", pants: "#3a3a50", accent: "#e8e8f4" } as Look,
};

type Ch = { id: string; pos: V; rotY?: number; look: Look; pose?: Pose; scale?: number; handR?: React.ReactNode; handL?: React.ReactNode; blob?: boolean };
type Anchor = V | { s: [number, number] } | { at: V; dx: number; dy: number };
type Ring = { pos: V; k: number; color: "cyan" | "warm" | "red"; s?: number };
type Scn = { cam: Cam; mood: Mood; env: React.ReactNode; chars: Ch[]; anchors: Record<string, Anchor>; ring?: Ring; extra?: React.ReactNode };

const walkPh = (d: number) => d * 3.7;
const headOf = (p: V, sit = 0, sc = 1): V => [p[0], p[1] + (0.8 - 0.35 * sit + 0.88) * sc, p[2]];
const mixCam = (a: Cam, b: Cam, k: number): Cam => ({
  pos: [lerp(a.pos[0], b.pos[0], k), lerp(a.pos[1], b.pos[1], k), lerp(a.pos[2], b.pos[2], k)],
  look: [lerp(a.look[0], b.look[0], k), lerp(a.look[1], b.look[1], k), lerp(a.look[2], b.look[2], k)],
  fov: lerp(a.fov ?? 40, b.fov ?? 40, k),
});
const blink = (t: number) => (t % 3.4 > 3.28 ? "blink" : null);

/* ───── кольцо телепатии ───── */
const ringTex = (kind: 0 | 1, col: string) =>
  once(`ring|${kind}|${col}`, () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    g.translate(256, 256);
    g.strokeStyle = col; g.lineCap = "round"; g.shadowColor = col; g.shadowBlur = 18;
    if (kind === 0) {
      g.lineWidth = 16;
      for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(0, 0, 220, i * 1.047 + 0.1, i * 1.047 + 0.78); g.stroke(); }
    } else {
      g.lineWidth = 7;
      for (let i = 0; i < 40; i++) { const a = i * 0.157; g.beginPath(); g.moveTo(Math.cos(a) * 188, Math.sin(a) * 188); g.lineTo(Math.cos(a) * (i % 5 === 0 ? 168 : 178), Math.sin(a) * (i % 5 === 0 ? 168 : 178)); g.stroke(); }
      g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 196, 0, 6.3); g.globalAlpha = 0.5; g.stroke();
    }
    return mkTex(c);
  });
const RING_COL = { cyan: "#4fe3ff", warm: "#ffc860", red: "#ff5a4a" };
const RingFx: React.FC<{ ring: Ring; cam: Cam; t: number }> = ({ ring, cam, t }) => {
  const rot = useMemo(() => {
    const o = new THREE.Object3D();
    const cp = new THREE.Vector3(...cam.pos), hp = new THREE.Vector3(...ring.pos);
    const away = hp.clone().sub(cp).normalize();
    o.position.copy(hp).addScaledVector(away, 0.3);
    o.lookAt(cp);
    return { p: o.position.toArray() as V, e: o.rotation.clone() };
  }, [cam.pos.join(), ring.pos.join()]);
  if (ring.k <= 0.01) return null;
  const col = RING_COL[ring.color], s = (ring.s ?? 1) * 1.25;
  return (
    <group position={rot.p} rotation={rot.e}>
      <mesh rotation={[0, 0, t * 0.7]}><planeGeometry args={[s, s]} /><meshBasicMaterial map={ringTex(0, col)} transparent opacity={ring.k} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      <mesh rotation={[0, 0, -t * 0.45]}><planeGeometry args={[s * 0.94, s * 0.94]} /><meshBasicMaterial map={ringTex(1, col)} transparent opacity={ring.k * 0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
    </group>
  );
};

const Blob: React.FC<{ p: V; s?: number }> = ({ p, s = 0.9 }) => {
  const tex = useMemo(() => once("blob", () => { const c = cv(64, 64); const g = c.getContext("2d")!; const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, "rgba(0,0,0,0.5)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return mkTex(c); }), []);
  return <mesh position={[p[0], p[1] + 0.004, p[2]]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[s, s]} /><meshBasicMaterial map={tex} transparent depthWrite={false} /></mesh>;
};

/* ───── кольцо: расписание ───── */
const ringState = (t: number): { k: number; color: "cyan" | "warm" | "red" } => {
  if (t < 2.3) return { k: 0, color: "cyan" };
  if (t < 31) return { k: eio(ramp(t, 2.3, 3.0)) * (t > 30.2 ? 0.85 + 0.15 * Math.sin(t * 40) : 1), color: "cyan" };
  if (t < 33) return { k: 0.8 + 0.2 * Math.sin(t * 30), color: "cyan" };
  if (t < 35.5) return { k: 0.6 + 0.4 * Math.abs(Math.sin(t * 25)), color: "red" };
  if (t < 36.4) return { k: 1 - ramp(t, 35.5, 36.1), color: "red" };
  if (t < 40) return { k: 0, color: "cyan" };
  if (t < 41.9) return { k: eio(ramp(t, 40, 41)) * 0.7, color: "cyan" };
  if (t < 44.6) return { k: 1, color: "warm" };
  if (t < 53.4) return { k: lerp(0.5, 0.25, ramp(t, 44.6, 52)), color: "warm" };
  return { k: eio(ramp(t, 53.4, 54.2)), color: "cyan" };
};

/* ───── толпа ───── */
const CROWD = [
  { x0: -9, v: 0.9, z: -3.3, look: L.green }, { x0: 7, v: -1.0, z: -1.7, look: L.pink }, { x0: 3, v: -0.8, z: -3.0, look: L.blue },
  { x0: -14, v: 1.1, z: -1.3, look: L.red }, { x0: 12, v: -0.9, z: -2.4, look: L.purple }, { x0: -6, v: 0.7, z: -2.6, look: L.teal },
];
const crowdAt = (t: number, i: number): Ch => {
  const c = CROWD[i], x = c.x0 + c.v * t;
  const dir = c.v > 0 ? 1 : -1;
  return { id: `cr${i}`, pos: [x, GY, c.z], rotY: dir * 1.15, look: c.look, pose: { walk: walkPh(x), amp: 0.85, expr: "neutral" } };
};

/* ───── сцены ───── */
const bedroom = (t: number): Scn => {
  const wake = eio(ramp(t, 1.5, 2.8));
  const sit = wake, lie = 1 - wake;
  const hipAbs = lerp(0.84, 0.7, sit), hipY = 0.8 - 0.35 * sit;
  const pos: V = [-1.35, hipAbs - hipY, lerp(0.1, -0.5, wake)];
  const ear = eio(ramp(t, 3.0, 3.6)) * (1 - eio(ramp(t, 6.8, 7.4)));
  const expr = t < 1.6 ? "blink" : t < 3.0 ? "surprised" : t < 6.7 ? (blink(t) ?? "worried") : "smirk";
  const yaw = t > 3.6 && t < 6.7 ? 0.55 * Math.sin((t - 3.6) * 1.5) : 0;
  const pose: Pose = {
    lie, sit, lean: 0.0, expr: expr as Pose["expr"], yaw, tilt: ear * 0.12, pitch: lie * 0.15,
    armL: [lerp(0, 2.55, ear), lerp(0.12, 0.45, ear)], elbL: lerp(0.1, 2.0, ear),
    armR: [0.0, 0.14], elbR: 0.15, gaze: t > 4 && t < 6.5 ? Math.sin(t * 2) : 0,
  };
  const head: V = [-1.35, lerp(0.95, 1.6, wake), lerp(-1.1, -0.5, wake)];
  const cam: Cam = mixCam({ pos: [1.1, 1.75, 1.7], look: [-1.3, 1.65, -0.5], fov: 50 }, { pos: [0.5, 1.5, 1.5], look: [-1.35, 1.55, -0.6], fov: 40 }, eio(ramp(t, 0, 7.8)));
  return {
    cam, mood: INDOOR, env: <Bedroom lamp={0.5} />, chars: [{ id: "hero", pos, rotY: 0, look: HERO, pose, blob: false }], anchors: {},
    ring: { pos: head, ...ringState(t), s: 1.1 },
  };
};

const street = (t: number, hero: Ch, cam: Cam, extra: Ch[], anchors: Record<string, Anchor> = {}, kiosk = false): Scn => ({
  cam, mood: DUSK, env: <><Town mood={DUSK} />{kiosk && <Kiosk />}</>, chars: [hero, ...extra], anchors,
  ring: { pos: headOf(hero.pos, hero.pose?.sit ?? 0), ...ringState(t) },
});

const Kiosk: React.FC = () => (
  <group>
    <Box p={[3, 0.55, -2.3]} s={[3.2, 1.1, 0.9]} c="#c8584a" />
    <Box p={[3, 1.12, -2.3]} s={[3.3, 0.06, 1.0]} c="#f4ecdc" />
    {[-1.5, 1.5].map((x) => <Box key={x} p={[3 + x, 1.35, -2.75]} s={[0.07, 2.6, 0.07]} c="#3a3a58" />)}
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[1.5 + i * 0.4 + 0.2, 2.62, -2.45]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.4, 0.06, 1.2]} /><M c={i % 2 ? "#fff4e4" : "#3a8a6a"} /></mesh>)}
    {[2.2, 2.6, 3.0].map((x, i) => <mesh key={x} position={[x, 1.2, -2.2]}><cylinderGeometry args={[0.07, 0.055, 0.12, 10]} /><M c={["#fff", "#f0c040", "#d8584a"][i]} /></mesh>)}
  </group>
);

const Paper: React.FC = () => (
  <group rotation={[-0.3, 0, 0]}>
    <mesh><boxGeometry args={[0.3, 0.22, 0.015]} /><meshStandardMaterial color="#fffaf0" /></mesh>
    <mesh position={[0, 0.0, 0.01]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.035, 0.12, 8]} /><meshBasicMaterial color="#e8782a" /></mesh>
  </group>
);
const Mug: React.FC = () => <mesh><cylinderGeometry args={[0.045, 0.04, 0.09, 12]} /><M c="#fff" /></mesh>;
const Bag: React.FC = () => <mesh><boxGeometry args={[0.2, 0.22, 0.12]} /><M c="#8a5a3c" /></mesh>;

const scene = (t: number): Scn => {
  /* 1. спальня: хук (0–7.8) */
  if (t < 7.8) return bedroom(t);

  /* 2. улица, герой идёт в толпе (7.8–11.3) */
  if (t < 11.3) {
    const hx = lerp(-6, -1.6, ramp(t, 7.8, 11.3));
    const hero: Ch = { id: "hero", pos: [hx, GY, -2.2], rotY: 1.25, look: HERO, pose: { walk: walkPh(hx), amp: 0.9, expr: "neutral", gaze: 1 } };
    const cam: Cam = { pos: [hx + 1.4, 1.3, 3.8], look: [hx + 1.4, 1.2, -2.4], fov: 38 };
    const cr = [0, 1, 2, 3, 4, 5].map((i) => crowdAt(t, i));
    const hs = (c: Ch): V => headOf(c.pos);
    return street(t, hero, cam, cr, { b1: { at: hs(cr[0]), dx: 0, dy: 0 }, b2: { at: hs(cr[1]), dx: 0, dy: 0 }, b3: { at: hs(cr[2]), dx: 0, dy: 0 } });
  }

  /* 3а. прохожий улыбается (11.3–16.4) */
  if (t < 16.4) {
    const k = ramp(t, 11.3, 16.4);
    const pz = lerp(-4.2, -1.9, k);
    const watch = eio(ramp(t, 14.4, 14.9)) * (1 - eio(ramp(t, 16.0, 16.4)));
    const pas: Ch = { id: "pas", pos: [0.3, GY, pz], rotY: 0, look: L.green, pose: { walk: walkPh(pz), amp: 0.55, expr: "smile", armL: [lerp(-Math.sin(walkPh(pz)) * 0.3, 1.35, watch), 0.1], elbL: lerp(0.2, 1.7, watch), yaw: 0.1 * Math.sin(t) } };
    const hero: Ch = { id: "hero", pos: [-1.5, GY, -1.5], rotY: 0.85, look: HERO, pose: { expr: blink(t) ?? "worried", gaze: 1, pitch: 0.05 } };
    const cam: Cam = { pos: [0.2, 1.25, 3.6], look: [-0.3, 1.2, -2.0], fov: 36 };
    return street(t, hero, cam, [pas, crowdAt(t, 3), crowdAt(t, 4)], { p1: headOf(pas.pos) });
  }

  /* 3б. продавец (16.4–22.2) */
  if (t < 22.2) {
    const wave = t > 17.3 && t < 18.5 ? 1 : 0;
    const sell: Ch = { id: "sell", pos: [3, GY, -3.05], rotY: 0, look: L.blue, pose: { expr: t > 17.3 && t < 18.5 ? "happy" : t > 19.8 ? "worried" : "smile", armR: [wave ? 2.5 : 0.1, wave ? 0.5 + 0.25 * Math.sin(t * 9) : 0.1], elbR: wave ? 0.5 : 0.2, tilt: 0.05 * Math.sin(t * 2) }, blob: false };
    const hero: Ch = { id: "hero", pos: [0.9, GY, -1.9], rotY: 0.95, look: HERO, pose: { expr: "worried", gaze: 1, pitch: 0.05 } };
    const k = eio(ramp(t, 16.4, 22.2));
    const cam = mixCam({ pos: [1.4, 1.35, 2.5], look: [2.6, 1.3, -2.8], fov: 38 }, { pos: [2.0, 1.4, 1.9], look: [3.0, 1.45, -2.8], fov: 32 }, k);
    return street(t, hero, cam, [sell], { s1: headOf(sell.pos) }, true);
  }

  /* 3в. люди редко говорят то, что думают (22.2–25.4) */
  if (t < 25.4) {
    const mk = (id: string, x: number, look: Look, ry: number, expr: Pose["expr"]): Ch => ({ id, pos: [x, GY, -2.2], rotY: ry, look, pose: { expr, yaw: 0, gaze: 0 } });
    const c1 = mk("c1", -3.4, L.pink, 0.5, "happy"), c2 = mk("c2", -1.1, L.teal, -0.5, "smile"), c3 = mk("c3", 1.1, L.red, 0.5, "happy"), c4 = mk("c4", 3.4, L.purple, -0.5, "smile");
    c1.pose!.armR = [1.0 + 0.3 * Math.sin(t * 5), 0.6]; c3.pose!.armR = [1.0 + 0.3 * Math.sin(t * 5 + 1), 0.6];
    const hero: Ch = { id: "hero", pos: [-0.05, GY, 0.2], rotY: 0.0, look: HERO, pose: { expr: "worried", pitch: 0.05 } };
    const cam: Cam = mixCam({ pos: [0, 1.3, 5.0], look: [0, 1.3, -2], fov: 38 }, { pos: [0, 1.3, 4.2], look: [0, 1.3, -2], fov: 36 }, ramp(t, 22.2, 25.4));
    return street(t, hero, cam, [c1, c2, c3, c4], { m1: headOf(c1.pos), m1d: headOf(c2.pos), m2: headOf(c3.pos), m2d: headOf(c4.pos) });
  }

  /* 4. парк: «Классная идея!» (25.4–30.8) */
  if (t < 30.8) {
    const thumbs = eio(ramp(t, 25.8, 26.3));
    const hero: Ch = { id: "hero", pos: [-1.0, 0, 0], rotY: 0.7, look: HERO, pose: { expr: t < 28.8 ? "happy" : "worried", armR: [1.3, 0.25], elbR: 1.0, gaze: 1 }, handR: <Paper /> };
    const fr: Ch = { id: "fr", pos: [1.0, 0, 0], rotY: -0.7, look: L.yellow, pose: { expr: "happy", armL: [lerp(0.1, 1.7, thumbs), 0.3], elbL: lerp(0.2, 1.3, thumbs), tilt: 0.06, gaze: -1 }, handL: <mesh position={[0, 0.0, 0.05]}><sphereGeometry args={[0.035, 8, 6]} /><M c="#101018" /></mesh> };
    const cam: Cam = mixCam({ pos: [0.2, 1.3, 3.5], look: [0, 1.2, -0.5], fov: 36 }, { pos: [0.1, 1.3, 3.0], look: [0, 1.25, -0.5], fov: 34 }, ramp(t, 25.4, 30.8));
    return { cam, mood: SUNSET, env: <Park mood={SUNSET} />, chars: [hero, fr], anchors: { f1: headOf(fr.pos), f2: headOf(fr.pos) }, ring: { pos: headOf(hero.pos), ...ringState(t) } };
  }

  /* 5. больно: перегруз (30.8–36.4) */
  if (t < 36.4) {
    const k = ramp(t, 30.8, 36.4);
    const ears = eio(ramp(t, 32.8, 33.5));
    const shake = t > 33 && t < 35.5 ? Math.sin(t * 38) * 0.012 : 0;
    const hero: Ch = { id: "hero", pos: [0, 0, 0], rotY: 0.12, look: HERO, pose: {
      expr: t < 33 ? "sad" : "worried", pitch: 0.12 + 0.1 * k, yaw: shake * 6, tilt: shake * 4,
      armL: [lerp(0.1, 2.5, ears), lerp(0.1, 0.7, ears)], elbL: lerp(0.2, 2.2, ears), armR: [lerp(0.1, 2.5, ears), lerp(0.1, 0.7, ears)], elbR: lerp(0.2, 2.2, ears),
    } };
    const cam: Cam = mixCam({ pos: [0.7, 1.5, 2.6], look: [0, 1.38, 0], fov: 34 }, { pos: [0.35, 1.5, 1.8], look: [0, 1.42, 0], fov: 32 }, eio(k));
    const A: Record<string, [number, number]> = { o1: [0.2, 0.36], o2: [0.8, 0.36], o3: [0.17, 0.64], o4: [0.84, 0.62], o5: [0.27, 0.93], o6: [0.74, 0.93] };
    const an: Record<string, Anchor> = {};
    Object.entries(A).forEach(([id, s]) => (an[id] = { s }));
    return { cam, mood: SUNSET, env: <Park mood={{ ...SUNSET, sky: ["#1a1a40", "#4a3a6a", "#7a5a7a"] }} />, chars: [hero], anchors: an, ring: { pos: headOf(hero.pos), ...ringState(t), s: 1.1 } };
  }

  /* 6. кухня: мама (36.4–44.6) */
  if (t < 44.6) {
    const hx = lerp(-2.0, -1.25, eio(ramp(t, 36.4, 38.6)));
    const walking = t < 38.6;
    const sip = t > 37.2 && t < 39 ? eio(ramp(t, 37.2, 37.7)) * (1 - eio(ramp(t, 38.3, 39))) : 0;
    const mom: Ch = { id: "mom", pos: [0.4, 0.04, -0.4], rotY: 0, look: L.pink, pose: { sit: 1, expr: t > 41.9 ? "happy" : "smile", armR: [lerp(0.3, 1.5, sip), 0.2], elbR: lerp(0.5, 2.0, sip), tilt: 0.04 }, handR: <Mug />, blob: false };
    const hero: Ch = { id: "hero", pos: [hx, 0, -0.55], rotY: 1.15, look: HERO, pose: { walk: walkPh(hx), amp: walking ? 0.8 : 0, expr: t > 41.9 ? "happy" : t > 40 ? "smile" : "neutral", gaze: 1 } };
    const cam = mixCam({ pos: [0.5, 1.45, 2.1], look: [-0.45, 1.5, -0.4], fov: 56 }, { pos: [0.3, 1.4, 1.9], look: [-0.5, 1.45, -0.4], fov: 48 }, ramp(t, 36.4, 44.6));
    return { cam, mood: INDOOR, env: <><Kitchen /><Box p={[0.4, 0.2, -0.45]} s={[0.5, 0.4, 0.5]} c="#a8703c" /></>, chars: [hero, mom], anchors: { mom: headOf(mom.pos, 1) }, ring: { pos: headOf(hero.pos), ...ringState(t) } };
  }

  /* 7а. шум стихает (44.6–48.4) */
  if (t < 48.4) {
    const hx = lerp(-4, -0.5, ramp(t, 44.6, 48.4));
    const hero: Ch = { id: "hero", pos: [hx, GY, -2.2], rotY: 1.2, look: HERO, pose: { walk: walkPh(hx), amp: 0.9, expr: "smile", gaze: 1 } };
    const cam: Cam = { pos: [hx + 1.6, 1.3, 3.9], look: [hx + 1.6, 1.2, -2.4], fov: 38 };
    return street(t, hero, cam, [0, 1, 2, 3, 4, 5].map((i) => crowdAt(t, i)));
  }

  /* 7б. поступок: помог поднять сумку (48.4–50.6) */
  if (t < 50.6) {
    const fall = ramp(t, 48.7, 49.1);
    const grab = eio(ramp(t, 49.0, 49.4)) * (1 - eio(ramp(t, 49.8, 50.2)));
    const bagY = t < 48.7 ? 0.85 : t < 49.4 ? lerp(0.85, 0.12, fall * fall) : t < 49.9 ? 0.12 + 0.75 * eio(ramp(t, 49.4, 49.9)) : 0.85;
    const bagX = t < 49.4 ? -0.55 : lerp(-0.55, 0.0, eio(ramp(t, 49.4, 49.9)));
    const A: Ch = { id: "A", pos: [-1.0, GY, -2.2], rotY: 0.55, look: L.teal, pose: { expr: t < 49.9 ? "surprised" : "happy", armR: [t < 48.7 ? 0.4 : 0.1, 0.15], elbR: 0.6 } };
    const B: Ch = { id: "B", pos: [1.0, GY, -2.2], rotY: -0.55, look: L.purple, pose: { expr: "smile", lean: lerp(0.04, 0.95, grab), armL: [lerp(0.1, 1.9, grab) , 0.2], elbL: 0.3 } };
    const hero: Ch = { id: "hero", pos: [-3.2, GY, -1.4], rotY: 0.5, look: HERO, pose: { expr: "smile", gaze: 1 } };
    const cam: Cam = { pos: [0.2, 1.25, 3.8], look: [-0.1, 1.0, -2.2], fov: 36 };
    const sc = street(t, hero, cam, [A, B], { d1: headOf(B.pos), d2: headOf(A.pos) });
    sc.extra = <group position={[bagX, GY + bagY, -2.0]}><Bag /></group>;
    return sc;
  }

  /* 7в. скамейка на закате (50.6–53.4) */
  if (t < 53.4) {
    const hero: Ch = { id: "hero", pos: [-0.42, 0.07, -1.3], rotY: 0.1, look: HERO, pose: { sit: 1, expr: "smile", gaze: 1, tilt: 0.05 }, blob: false };
    const fr: Ch = { id: "fr", pos: [0.42, 0.07, -1.3], rotY: -0.1, look: L.yellow, pose: { sit: 1, expr: "happy", gaze: -1, tilt: -0.05 }, blob: false };
    const cam = mixCam({ pos: [0.8, 1.2, 3.2], look: [0, 0.9, -1.3], fov: 36 }, { pos: [0.5, 1.15, 2.6], look: [0, 0.95, -1.3], fov: 34 }, ramp(t, 50.6, 53.4));
    return { cam, mood: SUNSET, env: <Park mood={SUNSET} />, chars: [hero, fr], anchors: {}, ring: { pos: headOf(hero.pos, 1), ...ringState(t) } };
  }

  /* 8. финал: взгляд в камеру (53.4–62) */
  const k = ramp(t, 53.4, 61);
  const hero: Ch = { id: "hero", pos: [0, 0, 0], rotY: 0.0, look: HERO, pose: { expr: t > 54.2 && t < 54.35 ? "blink" : "smirk", armL: [0.1, 0.12], armR: [0.1, 0.12], tilt: 0.06 * Math.sin(k * 3), gaze: 0 } };
  const cam = mixCam({ pos: [0.1, 1.54, 3.2], look: [0, 1.54, 0], fov: 32 }, { pos: [0.05, 1.54, 2.7], look: [0, 1.54, 0], fov: 32 }, eio(k));
  return { cam, mood: SUNSET, env: <Park mood={{ ...SUNSET, sky: ["#1a1840", "#3a3470", "#8a5a8a"] }} />, chars: [hero], anchors: {}, ring: { pos: headOf(hero.pos), ...ringState(t), s: 1.15 } };
};

/* ───── пузыри мыслей (HTML) ───── */
type Cue = { id: string; t0: number; t1: number; text: string; kind: "thought" | "dark" | "speech" | "warm" };
const STY: Record<Cue["kind"], { bg: string; fg: string; bd: string }> = {
  thought: { bg: "#ffffff", fg: "#1c1c3a", bd: "#c8d4ff" },
  speech: { bg: "#fffbe8", fg: "#1c1c3a", bd: "#ffd870" },
  dark: { bg: "#23113a", fg: "#ff8a9a", bd: "#8a3a8a" },
  warm: { bg: "#fff0d8", fg: "#9a3a1a", bd: "#ffb060" },
};
const Bubbles: React.FC<{ t: number; cam: Cam; anchors: Record<string, Anchor> }> = ({ t, cam, anchors }) => {
  const pc = useMemo(() => {
    const c = new THREE.PerspectiveCamera(cam.fov ?? 40, W / H, 0.1, 2000);
    c.position.set(...cam.pos); c.up.set(0, 1, 0); c.lookAt(...cam.look); c.updateMatrixWorld(); c.updateProjectionMatrix();
    return c;
  }, [cam.pos.join(), cam.look.join(), cam.fov]);
  return (
    <>
      {(cues as Cue[]).map((c) => {
        const a = anchors[c.id];
        if (!a || t < c.t0 || t > c.t1) return null;
        let x: number, y: number, sc = 1, dx = 0, dy = 0;
        if ("s" in (a as object) && !Array.isArray(a)) { const s = (a as { s: [number, number] }).s; x = s[0] * W; y = s[1] * H; sc = 1.05; }
        else {
          const at = Array.isArray(a) ? (a as V) : (a as { at: V }).at;
          if (!Array.isArray(a)) { dx = (a as { dx: number }).dx; dy = (a as { dy: number }).dy; }
          const v = new THREE.Vector3(at[0], at[1] + 0.42, at[2]).project(pc);
          x = (v.x * 0.5 + 0.5) * W + dx; y = (1 - (v.y * 0.5 + 0.5)) * H - 40 + dy;
          sc = cl(6.5 / pc.position.distanceTo(new THREE.Vector3(...at)), 0.55, 1.5);
        }
        const pop = eout(ramp(t, c.t0, c.t0 + 0.3)) * (1 + 0.12 * Math.sin(ramp(t, c.t0, c.t0 + 0.3) * Math.PI));
        const out = 1 - ramp(t, c.t1 - 0.25, c.t1);
        const st = STY[c.kind];
        const bob = Math.sin((t - c.t0) * 2.2) * 5;
        const tail = c.kind === "speech";
        return (
          <div key={c.id} style={{ position: "absolute", left: x, top: y + bob, transform: `translate(-50%,-100%) scale(${sc * pop})`, transformOrigin: "50% 100%", opacity: out }}>
            <div style={{ background: st.bg, color: st.fg, border: `5px solid ${st.bd}`, borderRadius: tail ? 34 : 60, padding: "20px 34px", fontFamily: "Inter, Arial, sans-serif", fontWeight: 800, fontSize: 52, lineHeight: 1.12, textAlign: "center", maxWidth: 520, boxShadow: "0 8px 28px rgba(0,0,0,0.45)", whiteSpace: "normal" }}>{c.text}</div>
            {tail ? (
              <div style={{ width: 30, height: 30, background: st.bg, border: `5px solid ${st.bd}`, borderTop: "none", borderLeft: "none", transform: "rotate(45deg)", margin: "-17px auto 0" }} />
            ) : (
              <div style={{ position: "relative", height: 64 }}>
                <div style={{ position: "absolute", left: "50%", top: 6, marginLeft: -8, width: 26, height: 26, borderRadius: 20, background: st.bg, border: `4px solid ${st.bd}` }} />
                <div style={{ position: "absolute", left: "50%", top: 38, marginLeft: -2, width: 14, height: 14, borderRadius: 10, background: st.bg, border: `3px solid ${st.bd}` }} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

/* ───── подписи ───── */
type Cap = { t0: number; t1: number; y: number; lines: { text: string; c?: string }[]; size: number };
const CAPS: Cap[] = [
  { t0: -0.3, t1: 4.3, y: 34, size: 96, lines: [{ text: "ЧТО, ЕСЛИ ТЫ СЛЫШИШЬ" }, { text: "МЫСЛИ ЛЮДЕЙ?", c: "#4fe3ff" }] },
  { t0: 22.4, t1: 25.3, y: 900, size: 58, lines: [{ text: "ЛЮДИ РЕДКО ГОВОРЯТ, ЧТО ДУМАЮТ" }] },
  { t0: 30.9, t1: 35.4, y: 900, size: 64, lines: [{ text: "ПРАВДА ГРОМЧЕ СЛОВ", c: "#ff8a9a" }] },
  { t0: 36.6, t1: 40.8, y: 900, size: 58, lines: [{ text: "НО ЕСТЬ И ДРУГИЕ МЫСЛИ" }] },
  { t0: 45.2, t1: 48.0, y: 900, size: 58, lines: [{ text: "ЧУЖИЕ МЫСЛИ — ПРОСТО ШУМ" }] },
  { t0: 48.4, t1: 52.9, y: 900, size: 64, lines: [{ text: "ВАЖНЕЕ — ПОСТУПКИ", c: "#ffc860" }] },
  { t0: 54.0, t1: 62.5, y: 70, size: 74, lines: [{ text: "А ТЫ БЫ ХОТЕЛ СЛЫШАТЬ" }, { text: "МЫСЛИ ДРУГИХ?", c: "#4fe3ff" }] },
  { t0: 57.3, t1: 62.5, y: 900, size: 64, lines: [{ text: "ПИШИ В КОММЕНТАРИЯХ" }] },
];
const Caption: React.FC<{ cap: Cap; t: number }> = ({ cap, t }) => {
  const a = ramp(t, cap.t0, cap.t0 + 0.3) * (1 - ramp(t, cap.t1 - 0.25, cap.t1));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: cap.y, textAlign: "center", opacity: a, transform: `translateY(${(1 - eout(ramp(t, cap.t0, cap.t0 + 0.35))) * 24}px)` }}>
      {cap.lines.map((l, i) => (
        <div key={i} style={{ fontFamily: "Inter, Arial, sans-serif", fontWeight: 900, fontSize: cap.size, lineHeight: 1.08, letterSpacing: 2, color: l.c ?? "#fff", textShadow: "0 5px 0 rgba(0,0,0,0.5), 0 0 38px rgba(0,0,0,0.85)" }}>{l.text}</div>
      ))}
    </div>
  );
};

const CUTS = [7.8, 11.3, 16.4, 22.2, 25.4, 30.8, 36.4, 44.6, 48.4, 50.6, 53.4];
const dipAt = (t: number, c: number, w: number) => Math.max(0, 1 - Math.abs(t - c) / w);

export const MindVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = scene(t);
  const dip = CUTS.reduce((m, c) => Math.max(m, dipAt(t, c, 0.1)), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Stage3D width={W} height={H} mood={s.mood} cam={s.cam} focus={[s.cam.look[0], 0, s.cam.look[2]]}>
        {s.env}
        {s.chars.map((c) => (
          <React.Fragment key={c.id}>
            <Stick pos={c.pos} rotY={c.rotY} look={c.look} pose={c.pose} scale={c.scale} handR={c.handR} handL={c.handL} />
            {c.blob !== false && <Blob p={[c.pos[0], c.pos[1], c.pos[2]]} />}
          </React.Fragment>
        ))}
        {s.extra}
        {s.ring && <RingFx ring={s.ring} cam={s.cam} t={t} />}
      </Stage3D>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)" }} />
      <Bubbles t={t} cam={s.cam} anchors={s.anchors} />
      {CAPS.map((c, i) => <Caption key={i} cap={c} t={t} />)}
      <AbsoluteFill style={{ background: "#000", opacity: dip }} />
    </AbsoluteFill>
  );
};
