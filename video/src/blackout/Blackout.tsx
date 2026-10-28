import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { assets, useAssets } from "../after/assets";
import { Person } from "../after/people";
import { Stage3D, type Cam } from "../after/stage";
import { type Mood } from "../after/world";
import { cl, ramp, lerp, eio, eout } from "../after/util";
import { headTurn, npcOutfit, type Act } from "../after/film";
import { StreetBlock, heroWindow } from "./city";
import { Apartment, Hallway, Flashlight, Bottle, Meds, Folder, Keys, PowerBank, Radio, PhoneScreen } from "./room";
import { reachArm, rel } from "./ik";

export const FPS_B = 30;
export const BLACKOUT_FRAMES = 750;
type V3 = [number, number, number];
const W = 1080, H = 1920;

/* ───── свет ───── */
const mood = (o: Partial<Mood> & Pick<Mood, "sky">): Mood => ({ fog: "#2a3a5c", fogNear: 40, fogFar: 260, sun: "#a8c0ff", sunI: 1, sunPos: [-25, 45, 35], hemiSky: "#6f86b8", hemiGround: "#2a2a34", hemiI: 1, exposure: 1.3, ...o });
const NIGHT = mood({ sky: ["#0b1224", "#1c2a48", "#3a4a72"], fogNear: 45, fogFar: 300, sunI: 1.15, hemiI: 1.25, exposure: 1.35 });
const ROOM = mood({ sky: ["#0b1224", "#1c2a48", "#3a4a72"], sunI: 0.0, hemiI: 1.0, hemiSky: "#8aa0d0", hemiGround: "#3a3a46", exposure: 1.55, fogNear: 100, fogFar: 400 });

/* ───── герой ───── */
const HERO = { skin: "#e8c4a4", shirt: "#1d2c4d", shirt2: "#2c3d66", stripe: 0, pants: "#6a6e76", shoes: "#4a4038", hair: "#2a1f18", sleeve: 0.7, hairStyle: "short" as const };
const SLOT_X = [-2.0, -1.7, -1.4, -1.1, -0.8, -0.5];
const TABLE_Y = 0.765;
const ITEM_T0 = 13.0;
const ITEM_DT = 0.95;
const RADIO_SLOT: V3 = [-1.25, TABLE_Y, -2.4];

const v3 = (a: V3) => new THREE.Vector3(...a);
const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const toArr = (v: THREE.Vector3): V3 => [v.x, v.y, v.z];

type Hand = { target: THREE.Vector3; w: number };
type Hero = { pos: V3; rotY: number; clip: string; time: number; right: Hand | null; left: Hand | null; head: number; headPitch: number };

const NONE = null;

/** положение рук/предметов: всё — детерминированные функции времени */
const heroState = (t: number): Hero => {
  // базовая стойка
  let pos: V3 = [0.1, 0, -0.7];
  let rotY = Math.PI;
  let clip = "Idle_Loop";
  let time = t * 0.8;
  let head = 0, pitch = 0;
  let right: Hand | null = NONE, left: Hand | null = NONE;
  const R_HIP: V3 = [-0.22, 0.95, 0.12];
  const R_TORCH: V3 = [-0.2, 1.0, 0.4];
  const L_HIP: V3 = [0.22, 0.95, 0.12];
  const L_PHONE: V3 = [0.12, 1.22, 0.3];
  const hand = (p: V3, rot: number, local: V3, w: number): Hand => ({ target: rel(p, rot, local), w });

  if (t < 8.0) {
    // сцена 2: замирает, достаёт телефон, включает фонарик, разворачивается к камере
    if (t > 4.7) left = hand(pos, rotY, lerp3(L_HIP, L_PHONE, eio(ramp(t, 4.7, 5.4))), eio(ramp(t, 4.6, 5.0)));
    if (t > 5.6) right = hand(pos, rotY, lerp3(R_HIP, R_TORCH, eio(ramp(t, 5.6, 6.1))), eio(ramp(t, 5.55, 5.9)));
    if (t > 7.1 && left) left = hand(pos, rotY, lerp3(L_PHONE, L_HIP, eio(ramp(t, 7.1, 7.6))), 1 - eio(ramp(t, 7.4, 7.9)));
    rotY = Math.PI - 0.55 * eio(ramp(t, 6.4, 7.8));
    head = -0.35 * eio(ramp(t, 6.2, 7.2));
    pitch = 0.22 * eio(ramp(t, 4.6, 5.4)) * (1 - ramp(t, 6.0, 6.6));
  } else if (t < 13.0) {
    const holdRight = hand(pos, rotY, R_TORCH, 1);
    if (t < 9.6) {
      // идёт к двери
      const k = eio(ramp(t, 8.0, 9.6));
      const a: V3 = [0.1, 0, -0.7], b: V3 = [1.6, 0, 1.2];
      pos = lerp3(a, b, k);
      rotY = Math.atan2(b[0] - a[0], b[2] - a[2]);
      clip = k < 0.98 ? "Walk_Loop" : "Idle_Loop";
      time = (t - 8.0) * 1.0;
      right = hand(pos, rotY, R_TORCH, 1);
    } else if (t < 10.8) {
      pos = [1.62, 0, 1.2];
      rotY = Math.PI / 2;
      clip = "Idle_Loop";
      time = t * 0.7;
      // правая ладонь на двери, голова к глазку
      right = hand(pos, rotY, [-0.1, 1.2, 0.55], 1);
      right = { target: new THREE.Vector3(2.22, 1.28, 1.05), w: eio(ramp(t, 9.7, 10.1)) };
      left = hand(pos, rotY, [0.2, 0.95, 0.3], 0.0);
      head = 0.0;
      pitch = 0.12 * eio(ramp(t, 9.8, 10.2));
    } else if (t < 12.1) {
      // коридор
      pos = [0.4, 0, 1.0];
      rotY = Math.PI;
      right = hand(pos, rotY, [-0.2, 1.1, 0.5], 1);
    } else {
      // комната: ставит радио левой рукой
      pos = [-1.0, 0, -1.4];
      rotY = Math.PI;
      time = t * 0.8;
      right = holdRight.w ? hand(pos, rotY, R_TORCH, 1) : null;
      const k = ramp(t, 12.15, 12.95);
      const p0 = rel(pos, rotY, L_HIP);
      const p1 = v3([RADIO_SLOT[0], 1.0, RADIO_SLOT[2] + 0.2]);
      const p2 = v3([RADIO_SLOT[0], RADIO_SLOT[1] + 0.09, RADIO_SLOT[2]]);
      const tp = k < 0.6 ? p0.clone().lerp(p1, eio(k / 0.6)) : p1.clone().lerp(p2, eio((k - 0.6) / 0.4));
      left = { target: tp, w: ramp(t, 12.1, 12.3) * (1 - ramp(t, 12.95, 13.0)) };
    }
  } else if (t < 19.0) {
    // сцена 4: раскладывает предметы
    const i = Math.min(5, Math.floor((t - ITEM_T0) / ITEM_DT));
    const s = ITEM_T0 + i * ITEM_DT;
    const next = ITEM_T0 + (i + 1) * ITEM_DT;
    const xCur = SLOT_X[i] + 0.12, xPrev = i > 0 ? SLOT_X[i - 1] + 0.12 : -1.0;
    const kx = eio(ramp(t, s - 0.05, s + 0.2));
    pos = [i === 0 ? lerp(-1.0, xCur, kx) : lerp(xPrev, xCur, kx), 0, -1.36];
    rotY = Math.PI;
    clip = "Idle_Loop";
    time = t * 0.8;
    void next;
    const ph = t - s;
    const pocket = rel(pos, rotY, [-0.22, 0.95, 0.14]);
    const hover = v3([SLOT_X[i], 1.0, -1.98]);
    const put = v3([SLOT_X[i], TABLE_Y + 0.11, -2.0]);
    const rest = rel(pos, rotY, [-0.22, 0.95, 0.12]);
    let tp = rest;
    let w = 1;
    if (ph < 0.22) { tp = rest.clone().lerp(i === 0 ? rel(pos, rotY, [-0.2, 1.0, 0.4]) : pocket, eio(ph / 0.22)); w = i === 0 ? 1 : eio(ph / 0.15); }
    else if (ph < 0.58) {
      const k = (ph - 0.22) / 0.36;
      const from = i === 0 ? rel(pos, rotY, [-0.2, 1.0, 0.4]) : pocket;
      tp = from.clone().lerp(hover, eio(k));
      tp.y += Math.sin(k * Math.PI) * 0.12;
    } else if (ph < 0.78) tp = hover.clone().lerp(put, eio((ph - 0.58) / 0.2));
    else if (ph < 0.92) { tp = put.clone().lerp(hover.clone().setY(1.02), eio((ph - 0.78) / 0.14)); w = 1; }
    else { tp = hover.clone().setY(1.02).lerp(rest, eio((ph - 0.92) / 0.2)); w = 1 - eio((ph - 0.92) / 0.2) * (i === 5 ? 0.0 : 0.0); }
    right = { target: tp, w };
    head = 0;
    pitch = 0.2;
  } else {
    // сцена 5: сообщение близким, проверка вещей, финальная композиция
    if (t < 22.0) {
      pos = [-0.2, 0, -0.2];
      rotY = 0.15;
      time = t * 0.7;
      const k = eio(ramp(t, 19.0, 19.6));
      left = hand(pos, rotY, lerp3(L_HIP, L_PHONE, k), k);
      const tap = t > 19.9 && t < 21.3 ? Math.sin((t - 19.9) * 9) * 0.015 : 0;
      right = hand(pos, rotY, [-0.02, 1.2 + tap, 0.3], eio(ramp(t, 19.5, 19.9)));
      pitch = 0.3;
      head = 0.0;
    } else if (t < 23.3) {
      const kw = eio(ramp(t, 22.0, 22.9));
      pos = lerp3([-0.2, 0, -0.2], [-0.3, 0, -1.36], kw);
      rotY = lerp(0.15, Math.PI - 0.1, kw);
      clip = kw < 0.97 ? "Walk_Loop" : "Idle_Loop";
      time = kw < 0.97 ? (t - 22.0) * 1.0 : t * 0.8;
      const k = ramp(t, 22.7, 23.3);
      const hx = lerp(-2.0, -0.5, eio(k));
      right = { target: v3([hx, 1.0, -1.9]), w: eio(ramp(t, 22.7, 22.95)) };
      left = hand(pos, rotY, lerp3(L_PHONE, L_HIP, eio(ramp(t, 22.0, 22.4))), 1 - eio(ramp(t, 22.1, 22.6)));
      head = 0.0;
      pitch = 0.3;
    } else {
      const k = eio(ramp(t, 23.3, 24.2));
      pos = lerp3([-0.3, 0, -1.36], [0.3, 0, -1.55], k);
      rotY = lerp(Math.PI - 0.1, Math.PI * 1.78, k);
      right = null;
      left = null;
      head = 0;
      pitch = 0.05;
      time = t * 0.8;
    }
  }
  return { pos, rotY, clip, time, right, left, head, headPitch: pitch };
};

/** предметы стола: положение/видимость по времени */
const itemPhase = (i: number, t: number) => {
  const s = ITEM_T0 + i * ITEM_DT;
  return { placed: t > s + 0.7, carried: t > s + 0.04 && t <= s + 0.7, s };
};

const Beam: React.FC<{ from: V3; to: V3; r: number; o: number }> = ({ from, to, r, o }) => {
  const m = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const g = new THREE.ConeGeometry(r, len, 24, 1, true);
    g.translate(0, -len / 2, 0);
    const mat = new THREE.MeshBasicMaterial({ color: "#dfe9ff", transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(g, mat);
    mesh.position.copy(a);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.normalize());
    return mesh;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.join(), to.join(), r, o]);
  return <primitive object={m} />;
};

const Spot: React.FC<{ from: V3; to: V3; intensity: number; angle?: number }> = ({ from, to, intensity, angle = 0.5 }) => {
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <primitive object={target} position={to} />
      <spotLight position={from} target={target} color="#eef3ff" intensity={intensity} angle={angle} penumbra={0.7} distance={14} decay={1.4} />
    </>
  );
};

const Shadow: React.FC<{ p: V3; s: number }> = ({ p, s }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    gr.addColorStop(0, "rgba(0,0,0,0.55)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[p[0], p[1] + 0.002, p[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[s, s]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
};

/* ───── сцены ───── */
type Shot = { cam: Cam; mood: Mood; focus: V3; scene: React.ReactNode; acts: Act[] };

const heroAct = (h: Hero, extra?: (b: Record<string, THREE.Object3D>) => void): Act => ({
  id: "hero", kind: "male", outfit: HERO, pos: h.pos, rotY: h.rotY,
  pose: [{ clip: h.clip, time: h.time }],
  mod: (b) => {
    headTurn(b, h.head, h.headPitch, 0);
    const pr = rel(h.pos, h.rotY, [-0.55, 0.7, -0.35]);
    const pl = rel(h.pos, h.rotY, [0.55, 0.7, -0.35]);
    if (h.right) reachArm(b, "r", h.right.target, pr, h.right.w);
    if (h.left) reachArm(b, "l", h.left.target, pl, h.left.w);
    extra?.(b);
  },
});

const shotAt = (t: number): Shot => {
  /* ─── сцена 1: город теряет свет (0–4 c) ─── */
  if (t < 4.0) {
    const d1 = eio(ramp(t, 0, 1.5));
    const d2 = ramp(t, 1.5, 3.2);
    const pos: V3 = [lerp(24, 15, d1) - 1.0 * d2, lerp(1.5, 1.9, d1), lerp(46, 28, d1) - 3.0 * d2];
    const pan = eio(ramp(t, 3.15, 4.0));
    const look: V3 = lerp3([3.5, lerp(9, 19, d1), 0], [heroWindow.x, heroWindow.y, 0], pan);
    const fov = lerp(62, 40, pan);
    const pedA: V3 = [6.2, 0, 2.0];
    const walkK = t * 1.25;
    const pedB: V3 = [-3 + walkK, 0, 1.2];
    const acts: Act[] = [
      { id: "pa", kind: "female", outfit: npcOutfit(3), pos: pedA, rotY: Math.PI * 0.8, pose: [{ clip: "Idle_Loop", time: t * 0.8 }],
        mod: (b) => { headTurn(b, 0, 0.35, 0); reachArm(b, "l", rel(pedA, Math.PI * 0.8, [0.12, 1.2, 0.3]), rel(pedA, Math.PI * 0.8, [0.5, 0.7, -0.3]), 1); } },
      { id: "pb", kind: "male", outfit: { ...npcOutfit(11), shirt: "#7a4a3a", hairStyle: "crop" as const }, pos: pedB, rotY: Math.PI / 2, pose: [{ clip: "Walk_Loop", time: t * 1.0 }] },
    ];
    return { cam: { pos, look, fov }, mood: NIGHT, focus: [4, 4, 4], scene: <StreetBlock mood={NIGHT} t={t} cam={pos} />, acts };
  }
  /* ─── интерьеры ─── */
  const h = heroState(t);
  const lamp = t < 4.2 ? 1 : Math.max(0, 1 - (t - 4.2) / 0.25);
  const torchOn = t >= 6.15;
  const tTorch = t < 13.0 + ITEM_DT * 0 + 0.85; // фонарик в руке до ставки на стол
  const inHall = t >= 10.8 && t < 12.1;
  const radioOn = t >= 12.95;
  const radioPlaced = t >= 12.9;
  const phoneIn = (t > 4.8 && t < 7.7) || (t >= 19.0 && t < 22.5);
  const torchP: V3 = h.right && tTorch ? toArr(h.right.target) : [0, 0, 0];
  const dirF = (v: number): V3 => [Math.sin(h.rotY) * v, 0, Math.cos(h.rotY) * v];
  const torchTo: V3 = [torchP[0] + dirF(1.3)[0], 0.0, torchP[2] + dirF(1.3)[2]];

  // предметы
  const items: React.ReactNode[] = [];
  const iconsPos = (i: number): V3 => [SLOT_X[i], TABLE_Y, -2.0];
  for (let i = 0; i < 6; i++) {
    const ph = itemPhase(i, t);
    const base = iconsPos(i);
    const p: V3 = ph.placed ? base : h.right ? [h.right.target.x, h.right.target.y - 0.09, h.right.target.z] : base;
    if (!ph.placed && !ph.carried && !(i === 0)) continue;
    if (i === 0) continue; // фонарик рисуется отдельно
    const pp = ph.placed ? base : p;
    if (i === 1) items.push(<Bottle key={i} p={pp} />);
    if (i === 2) items.push(<Meds key={i} p={pp} ry={ph.placed ? 0.2 : 0} />);
    if (i === 3) items.push(<Folder key={i} p={pp} ry={ph.placed ? -0.12 : 0} />);
    if (i === 4) items.push(<Keys key={i} p={pp} ry={ph.placed ? 0.5 : 0} />);
    if (i === 5) items.push(<PowerBank key={i} p={pp} ry={ph.placed ? -0.15 : 0} />);
    if (ph.placed) items.push(<Shadow key={`s${i}`} p={base} s={0.28} />);
  }
  const f0 = itemPhase(0, t);
  const flashOnTable = f0.placed;
  const torchAtHand: V3 = h.right ? [h.right.target.x, h.right.target.y - 0.02, h.right.target.z] : [0, 0, 0];
  const flash = torchOn ? (
    flashOnTable ? (
      <Flashlight p={iconsPos(0)} on={1} light={5} />
    ) : (
      <Flashlight p={torchAtHand} rx={-1.45} ry={h.rotY} on={1} />
    )
  ) : null;
  const torchLights = torchOn && !flashOnTable && !inHall ? (
    <>
      <Spot from={[torchAtHand[0], torchAtHand[1] + 0.05, torchAtHand[2]]} to={t < 10 ? torchTo : [torchP[0] + dirF(1.6)[0], 0.4, torchP[2] + dirF(1.6)[2]]} intensity={26} angle={0.55} />
      <Beam from={[torchAtHand[0], torchAtHand[1] + 0.03, torchAtHand[2]]} to={[torchTo[0], 0.05, torchTo[2]]} r={0.55} o={0.07} />
    </>
  ) : null;
  const room = (
    <>
      <Apartment lamp={lamp} doorOpen={t > 10.3 && t < 10.8 ? 0.03 : 0} view={lamp > 0.5 ? 1 : 0} />
      {t < 4.5 && <Spot from={[0.3, 2.3, -3.6]} to={[0.3, 0, -1]} intensity={0} />}
      {t >= 4.3 && <Spot from={[0.3, 2.2, -3.5]} to={[0.1, 0.2, -0.6]} intensity={90} angle={0.62} />}
      {items}
      {flash}
      {torchLights}
      {(t >= 12.9 || t < 0) && <Radio p={RADIO_SLOT} ry={0.1} on={radioOn ? 1 : 0} />}
      {radioPlaced && <Shadow p={[RADIO_SLOT[0], RADIO_SLOT[1], RADIO_SLOT[2]]} s={0.34} />}
      {phoneIn && h.left && <PhoneScreen p={[h.left.target.x, h.left.target.y + 0.0, h.left.target.z - 0.02]} rx={-0.5} ry={h.rotY + Math.PI} rz={0} glow={1} kind={t > 20.7 && t < 22 ? 1 : 0} />}
    </>
  );
  const hero = heroAct(h);

  /* ─── сцена 2: за плечом, обход на четверть круга (4–8 c) ─── */
  if (t < 8.0) {
    const k = eio(ramp(t, 4.0, 8.0));
    const c: V3 = [0.1, 1.2, -0.75];
    const ang = k * 1.35;
    const R = lerp(1.9, 1.65, k);
    const pos: V3 = [c[0] + Math.sin(ang) * R * 0.95, lerp(1.72, 1.45, k), c[2] + Math.cos(ang) * R];
    const look: V3 = [lerp(0.1, 0.05, k), lerp(1.35, 1.38, k), lerp(-1.3, -0.75, k)];
    return { cam: { pos, look, fov: lerp(58, 50, k) }, mood: ROOM, focus: [0, 0, -1], scene: room, acts: [hero] };
  }
  /* ─── сцена 3 ─── */
  if (t < 13.0) {
    if (t < 9.6) {
      const k = ramp(t, 8.0, 9.6);
      const pos: V3 = [h.pos[0] - 1.7, 1.5, h.pos[2] - 0.2 + 0.4 * k];
      return { cam: { pos, look: [h.pos[0] + 0.2, 1.25, h.pos[2] + 0.2], fov: 52 }, mood: ROOM, focus: [1, 0, 0], scene: room, acts: [hero] };
    }
    if (t < 10.8) {
      const k = eio(ramp(t, 9.6, 10.8));
      return { cam: { pos: [lerp(0.3, 0.75, k), 1.58, lerp(2.4, 2.15, k)], look: [2.15, 1.4, 1.1], fov: lerp(48, 40, k) }, mood: ROOM, focus: [1.5, 0, 1], scene: room, acts: [hero] };
    }
    if (inHall) {
      const k = ramp(t, 10.8, 12.1);
      const hallTorch: V3 = [0.2, 1.1, 0.55];
      return {
        cam: { pos: [lerp(-0.2, 0.0, k), 1.5, lerp(3.4, 2.7, k)], look: [0, 1.35, -5.9], fov: 52 }, mood: ROOM, focus: [0, 0, -1],
        scene: (<><Hallway /><Flashlight p={[hallTorch[0], hallTorch[1] - 0.02, hallTorch[2]]} rx={-1.5} ry={Math.PI} on={1} /><Spot from={hallTorch} to={[0, 1.3, -5.8]} intensity={95} angle={0.34} /><Beam from={hallTorch} to={[0, 1.3, -5.8]} r={0.9} o={0.05} /></>),
        acts: [{ ...hero, pos: [0.4, 0, 1.0], rotY: Math.PI }],
      };
    }
    const k = eio(ramp(t, 12.1, 13.0));
    return { cam: { pos: [lerp(0.35, 0.5, k), 1.62, lerp(-0.2, -0.5, k)], look: [-1.2, 0.9, -2.2], fov: 46 }, mood: ROOM, focus: [-1, 0, -1.5], scene: room, acts: [hero] };
  }
  /* ─── сцена 4: стол ─── */
  if (t < 19.0) {
    const slide = eio(ramp(t, 13.0, 17.6));
    const rise = eio(ramp(t, 17.4, 19.0));
    const cx = lerp(-2.0, -0.5, slide);
    const pos: V3 = [lerp(cx + 0.95, -0.3, rise), lerp(1.68, 1.55, rise), lerp(-0.75, 0.5, rise)];
    const look: V3 = [lerp(cx - 0.15, -0.7, rise), lerp(0.82, 1.3, rise), lerp(-2.0, -1.5, rise)];
    return { cam: { pos, look, fov: lerp(44, 52, rise) }, mood: ROOM, focus: [-1, 0, -1.8], scene: room, acts: [hero] };
  }
  /* ─── сцена 5 ─── */
  if (t < 22.0) {
    const k = ramp(t, 19.0, 22.0);
    return { cam: { pos: [lerp(0.25, 0.05, k), 1.5, lerp(1.95, 1.55, k)], look: [-0.2, 1.3, -0.2], fov: 38 }, mood: ROOM, focus: [-0.2, 0, -0.5], scene: room, acts: [hero] };
  }
  if (t < 23.3) {
    const k = ramp(t, 22.0, 23.3);
    return { cam: { pos: [lerp(-1.95, -1.75, k), 1.42, lerp(-0.45, -0.55, k)], look: [lerp(-0.85, -0.55, k), 1.2, -1.55], fov: 42 }, mood: ROOM, focus: [-0.8, 0, -1.4], scene: room, acts: [hero] };
  }
  const pull = eio(ramp(t, 23.3, 24.3));
  const pos: V3 = lerp3([-1.75, 1.42, -0.55], [-0.65, 1.72, 1.6], pull);
  const look: V3 = lerp3([-0.55, 1.2, -1.55], [-0.65, 0.84, -1.9], pull);
  return { cam: { pos, look, fov: lerp(42, 72, pull) }, mood: ROOM, focus: [-0.6, 0, -1.6], scene: room, acts: [hero] };
};

/* ───── подписи (HTML-слой) ───── */
type Cap = { t0: number; t1: number; y: "top" | "bottom" | "center"; lines: { text: string; red?: boolean }[]; size?: number };
const CAPS: Cap[] = [
  { t0: 0.35, t1: 3.9, y: "top", lines: [{ text: "ЕСЛИ ИСЧЕЗ" }, { text: "СВЕТ", red: true }], size: 132 },
  { t0: 4.5, t1: 7.8, y: "bottom", lines: [{ text: "СОХРАНЯЙ" }, { text: "СПОКОЙСТВИЕ" }], size: 108 },
  { t0: 8.4, t1: 10.7, y: "bottom", lines: [{ text: "НЕ ПОЛЬЗУЙСЯ" }, { text: "ЛИФТОМ" }], size: 112 },
  { t0: 10.9, t1: 12.95, y: "bottom", lines: [{ text: "УЗНАЙ" }, { text: "ОБСТАНОВКУ" }], size: 112 },
  { t0: 13.85, t1: 14.85, y: "top", lines: [{ text: "ВОДА" }], size: 150 },
  { t0: 14.8, t1: 15.8, y: "top", lines: [{ text: "ЛЕКАРСТВА" }], size: 128 },
  { t0: 15.75, t1: 16.75, y: "top", lines: [{ text: "ДОКУМЕНТЫ" }], size: 118 },
  { t0: 17.55, t1: 18.85, y: "top", lines: [{ text: "ЗАРЯД" }], size: 150 },
  { t0: 23.4, t1: 25.5, y: "center", lines: [{ text: "СОБЕРИСЬ." }, { text: "ПРОВЕРЬ" }, { text: "ИНФОРМАЦИЮ." }, { text: "БЕРЕГИ СВЯЗЬ." }], size: 100 },
];

const Caption: React.FC<{ cap: Cap; t: number }> = ({ cap, t }) => {
  const a = ramp(t, cap.t0, cap.t0 + 0.25) * (1 - ramp(t, cap.t1 - 0.2, cap.t1));
  if (a <= 0) return null;
  const top = cap.y === "top" ? 250 : cap.y === "bottom" ? 1290 : 620;
  return (
    <>
    <div style={{ position: "absolute", left: 20, right: 20, top: top - 40, height: (cap.lines.length * (cap.size ?? 120) * 1.04) + 80, opacity: a * 0.55, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 70%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top, opacity: a, transform: `translateY(${(1 - eout(ramp(t, cap.t0, cap.t0 + 0.3))) * 26}px)`, textAlign: "center" }}>
      {cap.lines.map((l, i) => (
        <div key={i} style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: cap.size ?? 120, lineHeight: 1.04, letterSpacing: 2, color: l.red ? "#d6453a" : "#fff", textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 0 36px rgba(0,0,0,0.85)", textTransform: "uppercase" }}>{l.text}</div>
      ))}
    </div>
    </>
  );
};

export const BlackoutVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS_B;
  const ok = useAssets();
  const lib = ok ? assets.lib : null;
  const s = shotAt(t);
  const cam = s.cam;
  // короткий «моргающий» переход через окно: чёрный провал между сценой 1 и 2
  const dip = Math.max(ramp(t, 3.82, 4.0) * (1 - ramp(t, 4.0, 4.12)), 0);
  const fadeIn = 1 - ramp(t, 0, 0.5);
  const vis = (p: V3) => {
    const dx = p[0] - cam.pos[0], dy = p[1] + 1 - cam.pos[1], dz = p[2] - cam.pos[2];
    return Math.hypot(dx, dy, dz) < 90;
  };
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
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(dip, fadeIn) }} />
    </AbsoluteFill>
  );
};
void cl;
