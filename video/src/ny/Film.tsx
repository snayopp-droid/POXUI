import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { assets, useAssets } from "../after/assets";
import { Person } from "../after/people";
import { Stage3D, type Cam } from "../after/stage";
import { MOODS, Street, type Mood } from "../after/world";
import { cl, ramp, lerp } from "../after/util";
import { type Act, type V3, mv, mix3, npcOutfit, kindOf } from "../after/film";
import { NYAvenue, Brownstones, Rooftop } from "./city";
import { Terminal, Cabin, Cafe, Subway } from "./rooms";
import { MoscowRoom, Kitchen, BrooklynRoom, TaxiInterior, TrainCar } from "./scenes";
import { Cup, Phone, Passport, Box, Stool, Suitcase } from "./props";
import { Car } from "../after/world";
import cues from "./cues.json";
import lines from "../../tools/ny_lines.json";
import meta from "../../tools/ny_vo_meta.json";

export const FPS_N = 24;
export const NY_SEC = 300;
const W = 1920, BAR = 138, H = 1080 - 2 * BAR; // 2.39:1

/* ───── свет ───── */
const mood = (o: Partial<Mood> & Pick<Mood, "sky">): Mood => ({ fog: "#aab", fogNear: 40, fogFar: 300, sun: "#fff", sunI: 1, sunPos: [10, 20, 10], hemiSky: "#ccd", hemiGround: "#665", hemiI: 1, exposure: 1.1, ...o });
const MD = {
  rooftop: mood({ sky: ["#26325e", "#c9708a", "#ffc27a"], fog: "#d7907e", fogNear: 120, fogFar: 1500, sun: "#ffa860", sunI: 3.4, sunPos: [10, 9, -50], hemiSky: "#9a9ad8", hemiGround: "#7a5a58", hemiI: 2.3, exposure: 1.3 }),
  aptNight: mood({ sky: ["#05080f", "#0e1626", "#1c2438"], fog: "#0b1220", fogNear: 14, fogFar: 60, sun: "#7a90c8", sunI: 0.15, sunPos: [0, 10, -10], hemiI: 0.4, exposure: 1.4 }),
  aptDawn: mood({ sky: ["#5c6f9a", "#e2a58a", "#ffd9a6"], fog: "#e0c1a8", fogNear: 20, fogFar: 100, sun: "#ffc88a", sunI: 0.35, hemiI: 0.6, exposure: 1.3 }),
  dawn: MOODS.dawn,
  inside: mood({ sky: ["#889", "#aab", "#ccd"], sunI: 0.15, hemiI: 0.5, exposure: 1.3 }),
  cabin: mood({ sky: ["#05080f", "#0e1626", "#1c2438"], sunI: 0.05, hemiI: 0.3, exposure: 1.5 }),
  nyDusk: mood({ sky: ["#4a5a8a", "#e8967a", "#ffd08a"], fog: "#e8b89a", fogNear: 50, fogFar: 380, sun: "#ffb070", sunI: 3.6, sunPos: [-30, 14, -40], hemiSky: "#9aa4d0", hemiGround: "#6a5048", hemiI: 1.6, exposure: 1.2 }),
  nyDay: mood({ sky: ["#6fa7e8", "#bcd4ee", "#f4e3c6"], fog: "#dcd8cf", fogNear: 50, fogFar: 340, sun: "#fff0d0", sunI: 3.4, sunPos: [-25, 30, -15], hemiSky: "#bfd6f4", hemiGround: "#7a6a58", hemiI: 1.4, exposure: 1.2 }),
  nyNight: mood({ sky: ["#05080f", "#16223c", "#34305a"], fog: "#141c30", fogNear: 20, fogFar: 160, sun: "#8aa0e0", sunI: 1.0, sunPos: [10, 20, 6], hemiSky: "#3a4a80", hemiGround: "#1c1e26", hemiI: 1.9, exposure: 1.7 }),
  sub: mood({ sky: ["#111", "#111", "#111"], sunI: 0.05, hemiI: 0.5, exposure: 1.3 }),
};

/* ───── герои ───── */
const ART = { skin: "#e8c4a4", shirt: "#3b4a5e", shirt2: "#c9cdd6", stripe: 0, pants: "#2a2f3a", shoes: "#d8d4cc", hair: "#2a1f18", sleeve: 0.7 };
const ART_HOME = { ...ART, shirt: "#5a5a60", pants: "#33363e", shoes: "#2a2622" };
const MOM = { hairStyle: "bun" as const, skin: "#f0d2bc", shirt: "#4a6a8a", pants: "#3a3a44", shoes: "#2a2622", hair: "#b8b4b0", sleeve: 0.7 };
const OFFICER = { hairStyle: "crop" as const, skin: "#a8744f", shirt: "#2a3a55", pants: "#1b2230", shoes: "#111", hair: "#1a1410", sleeve: 0.7 };
const BARISTA = { hairStyle: "long" as const, skin: "#e3b898", shirt: "#e9e4d8", shirt2: "#2d4a3a", pants: "#222", shoes: "#222", hair: "#7a3a22", sleeve: 0.28 };
const OLDMAN = { hairStyle: "crop" as const, skin: "#7d5136", shirt: "#7a6a50", shirt2: "#c9b27a", stripe: 0.8, pants: "#4a4a52", shoes: "#2a2622", hair: "#c4c4c4", sleeve: 0.7 };

type Out = { cam: Cam; mood: Mood; focus: V3; scene: React.ReactNode; acts?: Act[]; title?: { big: string; small?: string; a: number; b: number }; fade?: number; sub?: { text: string; who?: string } };
type Shot = { t0: number; t1: number; f: (s: number, d: number, t: number) => Out };

const act = (id: string, kind: "male" | "female", outfit: Act["outfit"], pos: V3, rotY: number, clip: string, time: number, extra: Partial<Act> = {}): Act => ({ id, kind, outfit, pos, rotY, pose: [{ clip, time }], ...extra });
const npc = (i: number, pos: V3, rotY: number, clip: string, time: number, extra: Partial<Act> = {}): Act => act(`n${i}`, kindOf(i), npcOutfit(i), pos, rotY, clip, time + i * 0.41, extra);
const hh = (t: number, a = 1): V3 => [Math.sin(t * 1.9) * 0.012 * a + Math.sin(t * 5.1) * 0.004 * a, Math.sin(t * 2.3 + 1) * 0.01 * a + Math.sin(t * 4.3) * 0.003 * a, Math.sin(t * 1.5 + 2) * 0.01 * a];
const sway = (c: Cam, t: number, a = 1): Cam => { const o = hh(t, a); return { ...c, pos: [c.pos[0] + o[0], c.pos[1] + o[1], c.pos[2] + o[2]], look: [c.look[0] - o[0] * 1.5, c.look[1] - o[1] * 1.5, c.look[2] - o[2]], roll: (c.roll ?? 0) + Math.sin(t * 1.1) * 0.003 * a }; };
const WALK = "Walk_Loop";

const artWalk = (pos: V3, rotY: number, t: number, extra: Partial<Act> = {}, out: Act["outfit"] = ART, clip = WALK, bag = true): Act =>
  act("art", "male", out, pos, rotY, clip, t, { ...extra, case: bag });

/* ───── шоты ───── */
const SHOTS: Shot[] = [
  /* 0. крыша в Бруклине — флэшфорвард */
  { t0: 0, t1: 21.5, f: (s, d, t) => ({
      mood: MD.rooftop, focus: [0, 0, -2],
      cam: sway({ pos: mv([-0.6, 1.25, 7.8], [0.3, 1.2, 4.6], s, d), look: [0.3, 1.6, -40], fov: 34 }, t, 0.8),
      scene: <Rooftop mood={MD.rooftop} dusk />,
      acts: [act("art", "male", ART, [0, 0.0, -0.4], Math.PI, "Idle_Rail_Loop", s * 0.7)],
      fade: ramp(s, 0, 1.2) * 1,
    }) },
  /* титул */
  { t0: 21.5, t1: 25.4, f: (s, d, t) => ({
      mood: MD.aptNight, focus: [0, 0, 0], cam: { pos: [0, 1, 4], look: [0, 1, 0], fov: 40 }, scene: null, acts: [],
      title: { big: "ИЗ МОСКВЫ В НЬЮ-ЙОРК", small: "ЧАСТЬ 1  ·  ПЕРВАЯ НЕДЕЛЯ", a: 0.3, b: d - 0.2 }, fade: 1,
    }) },
  /* 1. Москва, 4 утра */
  { t0: 25.4, t1: 31.5, f: (s, d, t) => ({
      mood: MD.aptNight, focus: [0, 0, 0],
      cam: sway({ pos: mv([-2.4, 1.5, 2.0], [-1.7, 1.45, 1.4], s, d), look: [0.2, 1.1, -0.6], fov: 40 }, t, 1),
      scene: <MoscowRoom mode="night" lampOn={0.9} />,
      acts: [act("art", "male", ART_HOME, [0.2, 0, 0.3], 2.9, "Idle_Loop", s * 0.8)],
    }) },
  { t0: 31.5, t1: 35.0, f: (s, d, t) => ({
      mood: MD.aptNight, focus: [-1, 0, 1],
      cam: sway({ pos: mv([-0.4, 0.9, 2.2], [-0.8, 0.8, 1.9], s, d), look: [-1.1, 0.4, 1.6], fov: 34 }, t, 1.2),
      scene: <MoscowRoom mode="night" lampOn={0.9} />,
      acts: [act("art", "male", ART_HOME, [-0.2, 0, 1.1], 3.5, "Idle_Loop", s)],
    }) },
  { t0: 35.0, t1: 42.9, f: (s, d, t) => ({
      mood: MD.aptNight, focus: [-1.5, 0, -1],
      cam: sway({ pos: mv([-0.4, 1.35, 0.9], [-0.9, 1.3, 0.5], s, d), look: [-1.55, 1.05, -1.8], fov: 36 }, t, 1),
      scene: <MoscowRoom mode="night" lampOn={0.35} laptopGlow={1} />,
      acts: [act("art", "male", ART_HOME, [-1.6, 0, -1.15], Math.PI, "Sitting_Idle_Loop", s * 0.8)],
    }) },
  { t0: 42.9, t1: 49.0, f: (s, d, t) => ({
      mood: MD.aptNight, focus: [0.5, 0, -1.5],
      cam: sway({ pos: mv([0.4, 1.4, 1.8], [0.9, 1.45, 1.2], s, d), look: [0.5, 1.5, -2.2], fov: 38 }, t, 1),
      scene: <MoscowRoom mode="dawn" lampOn={0.5} />,
      acts: [act("art", "male", ART_HOME, [0.55, 0, -1.45], Math.PI, "Idle_Loop", s * 0.7, { mod: undefined })],
    }) },
  /* мама на кухне */
  { t0: 49.0, t1: 55.2, f: (s, d, t) => ({
      mood: MD.aptDawn, focus: [0, 0, 0],
      cam: sway({ pos: mv([0.9, 1.5, 1.4], [0.5, 1.5, 1.2], s, d), look: [-0.9, 1.0, -0.2], fov: 38 }, t, 0.8),
      scene: <Kitchen />,
      acts: [act("mom", "female", MOM, [-1.0, 0, 0.0], -Math.PI / 2, "Idle_Loop", s * 0.6, { mod: undefined })],
    }) },
  { t0: 55.2, t1: 59.0, f: (s, d, t) => ({
      mood: MD.aptDawn, focus: [0, 0, 0],
      cam: sway({ pos: mv([0.6, 1.45, 1.0], [0.9, 1.45, 0.8], s, d), look: [-0.3, 1.35, 0.0], fov: 32 }, t, 0.8),
      scene: <Kitchen />,
      acts: [act("mom", "female", MOM, [-0.4, 0, 0.05], Math.PI / 2, "Idle_Talking_Loop", s), act("art", "male", ART, [0.45, 0, -0.1], -Math.PI / 2, "Idle_Loop", s * 0.7)],
    }) },
  { t0: 59.0, t1: 64.8, f: (s, d, t) => ({
      mood: MD.aptDawn, focus: [0, 0, 0],
      cam: sway({ pos: mv([-0.4, 1.4, -1.1], [0.2, 1.4, -0.8], s, d), look: [0.0, 1.3, 0.2], fov: 30 }, t, 0.9),
      scene: <Kitchen />,
      acts: [act("art", "male", ART, [0.1, 0, 0.35], Math.PI, "Idle_Loop", s * 0.5, { mod: undefined })],
    }) },
  /* такси по Москве */
  { t0: 64.8, t1: 73.5, f: (s, d, t) => {
      const z = 6 - s * 7;
      return {
        mood: MD.dawn, focus: [0, 0, z],
        cam: sway({ pos: mv([-2.4, 1.3, z + 7], [-3.2, 1.0, z + 5], s, d), look: [0.5, 1.0, z - 4], fov: 38 }, t, 1),
        scene: <><Street mood={MD.dawn} z0={-140} z1={60} leaves={0.3} wreck={0} cam={[-2.4, 1.3, z + 7]} shops={["apteka", "coffee", "prod", "bread", "barber", "metro"]} /><Car x={0.6} z={z - 3} rot={0} color="#e9b32a" /></>,
        acts: [],
      };
    } },
  /* Шереметьево */
  { t0: 73.5, t1: 80.8, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -10 - s],
      cam: sway({ pos: mv([-3, 1.4, 4], [-2.4, 1.5, 2.5], s, d), look: [0, 1.2, -14], fov: 36 }, t, 1),
      scene: <Terminal variant="svo" />,
      acts: [
        artWalk([0, 0, 1 - s * 1.25], Math.PI, s * 1.1),
        ...[0, 1, 2, 3, 4, 5, 6].map((i) => npc(40 + i, [(i % 2 ? 4.5 : -3.5) + Math.sin(i) * 1.2, 0, -6 - i * 4 + (i % 2 ? 1 : -1) * s * 0.8], i % 2 ? 0 : Math.PI, WALK, s * 0.7 + i)),
      ],
    }) },
  /* самолёт */
  { t0: 80.8, t1: 86.5, f: (s, d, t) => ({
      mood: MD.cabin, focus: [-1, 0, -3],
      cam: sway({ pos: mv([0.35, 1.75, -0.5], [0.1, 1.7, -1.1], s, d), look: [-1.2, 0.95, -3.1], fov: 40 }, t, 1.4),
      scene: <Cabin t={t} />,
      acts: [
        act("art", "male", ART, [-1.35, -0.02, -2.62], Math.PI, "Sitting_Idle_Loop", s * 0.8),
        ...[[0.25, -2.62], [0.8, -1.72], [-0.8, -1.72], [-0.25, -0.9], [-1.35, -1.72]].map(([x, z], i) => act(`p${i}`, kindOf(i + 9), npcOutfit(i + 9), [x, -0.02, z], Math.PI, "Sitting_Idle_Loop", s + i)),
      ],
    }) },
  { t0: 86.5, t1: 91.5, f: (s, d, t) => ({
      mood: MD.cabin, focus: [-1, 0, -3],
      cam: sway({ pos: mv([0.1, 1.25, -2.3], [-0.2, 1.22, -2.5], s, d), look: [-1.45, 1.1, -2.7], fov: 26 }, t, 1.6),
      scene: <Cabin t={t} />,
      acts: [act("art", "male", ART, [-1.35, -0.02, -2.62], Math.PI, "Sitting_Idle_Loop", s * 0.6)],
    }) },
  /* JFK */
  { t0: 91.5, t1: 98.8, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -8],
      cam: sway({ pos: mv([-1, 1.7, 2], [-0.4, 1.7, -1], s, d), look: [0, 1.4, -14], fov: 34 }, t, 1),
      scene: <Terminal variant="jfk" />,
      acts: [...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => npc(60 + i, [((i % 3) - 1) * 1.1, 0, -3.5 - Math.floor(i / 3) * 2 - s * 0.5], Math.PI, "Idle_Loop", s + i)), act("art", "male", ART, [-0.2, 0, -0.8 - s * 0.35], Math.PI, "Idle_Loop", s)],
    }) },
  { t0: 98.8, t1: 106.4, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -4],
      cam: sway({ pos: mv([-1.9, 1.62, -0.2], [-1.6, 1.6, -0.5], s, d), look: [0.2, 1.4, -3.6], fov: 30 }, t, 0.8),
      scene: <><Terminal variant="jfk" /><Box p={[0, 0.55, -3]} s={[2.6, 1.1, 0.7]} c="#3a4a60" r={0.6} /><Box p={[0, 1.25, -3.1]} s={[2.6, 0.7, 0.04]} c="#a8c4d8" r={0.1} shadow={false} /></>,
      acts: [act("off", "male", OFFICER, [0, 0, -3.9], 0, "Idle_Loop", s * 0.5), act("art", "male", ART, [-0.9, 0, -1.9], Math.PI, "Idle_Loop", s * 0.6)],
    }) },
  { t0: 106.4, t1: 110.2, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -3],
      cam: sway({ pos: mv([-0.1, 1.6, -1.0], [-0.2, 1.62, -1.2], s, d), look: [-0.3, 1.55, -3], fov: 22 }, t, 1),
      scene: <><Terminal variant="jfk" /><Box p={[0, 0.55, -3]} s={[2.6, 1.1, 0.7]} c="#3a4a60" r={0.6} /></>,
      acts: [act("art", "male", ART, [-0.45, 0, -2.0], 0, "Idle_Loop", s * 0.6)],
    }) },
  { t0: 110.2, t1: 112.8, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -3],
      cam: sway({ pos: [0.3, 1.55, -1.7], look: [0, 1.5, -3.9], fov: 24 }, t, 0.8),
      scene: <><Terminal variant="jfk" /><Box p={[0, 0.55, -3]} s={[2.6, 1.1, 0.7]} c="#3a4a60" r={0.6} /></>,
      acts: [act("off", "male", OFFICER, [0, 0, -3.9], 0, "Idle_Loop", s * 0.5)],
    }) },
  { t0: 112.8, t1: 118.8, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 1, -3],
      cam: sway({ pos: mv([0.1, 1.45, -2.4], [0.05, 1.2, -2.7], s, d), look: [0, 1.12, -3.1], fov: 20 }, t, 0.6),
      scene: <><Terminal variant="jfk" /><Box p={[0, 1.08, -3]} s={[1.2, 0.05, 0.5]} c="#c9c6bd" r={0.4} /><Passport p={[0, 1.13, -3.0]} ry={0.2} /></>,
      acts: [],
    }) },
  /* Нью-Йорк, такси */
  { t0: 118.8, t1: 127.0, f: (s, d, t) => {
      const z = 50 - s * 14;
      return {
        mood: MD.nyDusk, focus: [0, 0, z - 5],
        cam: sway({ pos: [0.3, 1.2, z], look: [-5.5, 1.5, z - 7 - s * 0.2], fov: 52 }, t, 2),
        scene: <><NYAvenue mood={MD.nyDusk} t={t} cabs={8} z0={-260} z1={80} cam={[0.3, 1.2, z]} /><TaxiInterior t={t} /></>,
        acts: [],
      };
    } },
  /* первый взгляд на город */
  { t0: 127.0, t1: 137.5, f: (s, d, t) => ({
      mood: MD.nyDusk, focus: [4, 0, -20],
      cam: sway({ pos: mv([-1.5, 1.2, 12], [1.0, 3.2, 4], s, d), look: [1.0, 10 + s * 0.8, -26], fov: 50 }, t, 1.5),
      scene: <NYAvenue mood={MD.nyDusk} t={t} cabs={7} z0={-260} z1={80} cam={[-1.5, 1.2, 12]} />,
      acts: [
        artWalk([10.4, 0, 8 - s * 0.9], Math.PI, s * 1.0, {}, ART, WALK, true),
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => npc(80 + i, [(i % 2 ? 10.9 : 12.4) - (i % 3) * 0.5, 0, 6 - i * 3 + (i % 2 ? 1 : -1) * s * 1.1], i % 2 ? 0 : Math.PI, WALK, s * 0.8 + i)),
      ],
    }) },
  /* комната в Бруклине */
  { t0: 137.5, t1: 142.5, f: (s, d, t) => ({
      mood: MD.nyDay, focus: [0, 0, 0],
      cam: sway({ pos: mv([-6, 3.2, 16], [-6, 2.6, 9], s, d), look: [-9, 5.5, -10], fov: 42 }, t, 1),
      scene: <Brownstones mood={MD.nyDay} z0={-80} z1={40} cam={[-6, 3.2, 16]} />,
      acts: [artWalk([-8.8, 0.9, -2 + s * 0.8], 0, s * 1.0)],
    }) },
  { t0: 142.5, t1: 148.0, f: (s, d, t) => ({
      mood: MD.aptDawn, focus: [0, 0, 0],
      cam: sway({ pos: mv([0.9, 1.5, 1.6], [0.5, 1.45, 1.55], s, d), look: [-0.2, 0.7, -0.8], fov: 62 }, t, 1),
      scene: <BrooklynRoom day />,
      acts: [act("art", "male", ART_HOME, [-0.1, 0, 0.4], 2.6, "Idle_Loop", s * 0.8)],
    }) },
  /* кофе */
  { t0: 148.0, t1: 153.8, f: (s, d, t) => ({
      mood: MD.nyDay, focus: [0, 0, 0],
      cam: sway({ pos: mv([-3, 1.5, 6], [-1, 1.5, 5], s, d), look: [0.5, 1.3, -6], fov: 36 }, t, 1.2),
      scene: <Brownstones mood={MD.nyDay} z0={-80} z1={40} cam={[-3, 1.5, 6]} />,
      acts: [act("art", "male", ART, [0.5, 0, 3 - s * 1.2], Math.PI, WALK, s * 1.0)],
    }) },
  { t0: 153.8, t1: 159.5, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -2],
      cam: sway({ pos: mv([-1.4, 1.65, 1.6], [-0.9, 1.6, 1.0], s, d), look: [0.1, 1.45, -3.3], fov: 32 }, t, 0.9),
      scene: <Cafe />,
      acts: [act("bar", "female", BARISTA, [0, 0, -3.9], 0, "Idle_Talking_Loop", s), act("art", "male", ART, [0.35, 0, -2.2], Math.PI, "Idle_Loop", s * 0.7)],
    }) },
  { t0: 159.5, t1: 165.5, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -2],
      cam: sway({ pos: mv([0.6, 1.6, 0.0], [0.4, 1.58, -0.4], s, d), look: [0.0, 1.5, -3.8], fov: 26 }, t, 0.9),
      scene: <Cafe />,
      acts: [act("bar", "female", BARISTA, [0, 0, -3.9], 0, "Idle_Talking_Loop", s * 1.5), act("art", "male", ART, [0.3, 0, -2.2], Math.PI, "Idle_Loop", s * 0.7, { mod: undefined })],
    }) },
  { t0: 165.5, t1: 172.8, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, 0],
      cam: sway({ pos: mv([-2.4, 1.55, -2.2], [-2.0, 1.55, -1.7], s, d), look: [0.5, 1.4, 1.5], fov: 34 }, t, 0.9),
      scene: <Cafe />,
      acts: [...[0, 1, 2, 3, 4, 5].map((i) => npc(100 + i, [0.3 + Math.sin(i * 2) * 0.35, 0, -1.2 + i * 0.85], Math.PI, i % 2 ? "Idle_Loop" : "Idle_TalkingPhone_Loop", s + i)), act("art", "male", ART, [0.3, 0, -2.2], Math.PI, "Idle_Loop", s * 0.7)],
    }) },
  { t0: 172.8, t1: 180.2, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 1.1, -3],
      cam: sway({ pos: mv([0.5, 1.4, -1.9], [0.15, 1.25, -2.4], s, d), look: [0, 1.1, -3.2], fov: 28 }, t, 0.7),
      scene: <><Cafe /><Cup p={[0.1, 1.17, -3.0]} s={1.5} iced /></>,
      acts: [act("bar", "female", BARISTA, [0.55, 0, -3.9], 0, "Idle_Talking_Loop", s)],
    }) },
  { t0: 180.2, t1: 186.5, f: (s, d, t) => ({
      mood: MD.inside, focus: [0, 0, -2],
      cam: sway({ pos: mv([-0.9, 1.6, -0.2], [-0.4, 1.6, -0.9], s, d), look: [0.3, 1.5, -2.6], fov: 26 }, t, 0.8),
      scene: <Cafe />,
      acts: [act("art", "male", ART, [0.3, 0, -2.2], Math.PI, "Consume", s * 0.5)],
    }) },
  /* метро */
  { t0: 186.5, t1: 191.0, f: (s, d, t) => ({
      mood: MD.sub, focus: [0, 0, 1],
      cam: sway({ pos: mv([-4, 1.5, 2.8], [-2.4, 1.5, 2.2], s, d), look: [4, 1.4, 4], fov: 38 }, t, 1),
      scene: <Subway trainX={mv([90, 0, 0], [-1, 0, 0], s, 3.8)[0]} />,
      acts: [act("art", "male", ART, [0.0, 0, 1.3], 1.57, "Idle_Loop", s)],
    }) },
  { t0: 191.0, t1: 196.2, f: (s, d, t) => ({
      mood: MD.sub, focus: [0, 0, 0],
      cam: sway({ pos: mv([-1.3, 1.1, 1.8], [-1.1, 1.1, 1.6], s, d), look: [0.9, 1.0, -0.2], fov: 38 }, t, 1.6),
      scene: <TrainCar t={t} />,
      acts: [act("art", "male", ART, [1.0, 0.0, -0.4], -1.57, "Sitting_Idle_Loop", s * 0.7), ...[0, 1, 2].map((i) => npc(120 + i, [-1.0, 0, -3.5 + i * 3.5], 1.57, "Sitting_Idle_Loop", s + i))],
    }) },
  { t0: 196.2, t1: 204.0, f: (s, d, t) => ({
      mood: MD.sub, focus: [0, 0, 0],
      cam: sway({ pos: mv([-6, 1.3, 2.6], [-4.4, 1.35, 2.2], s, d), look: [1.5, 1.2, 1.0], fov: 32 }, t, 1),
      scene: <Subway empty trainX={200} />,
      acts: [act("art", "male", ART, [2.6, 0.0, 0.5], -1.2, "Sitting_Idle_Loop", s * 0.6)],
    }) },
  { t0: 204.0, t1: 214.7, f: (s, d, t) => ({
      mood: MD.sub, focus: [0, 0, 0],
      cam: sway({ pos: mv([-2.4, 1.35, 3.2], [-2.0, 1.4, 2.8], s, d), look: [2.2, 1.2, 0.6], fov: 32 }, t, 1),
      scene: <Subway empty trainX={200} />,
      acts: [act("art", "male", ART, [2.8, 0, 0.5], -1.2, "Sitting_Idle_Loop", s * 0.6), act("old", "male", OLDMAN, [mv([-8, 0, 0], [1.6, 0, 0], s, 4.2)[0], 0, 1.9], 1.57 - ramp(s, 4.2, 5) * 0.9, s < 4.2 ? WALK : "Idle_Talking_Loop", s * 1.0)],
    }) },
  /* ночной Бруклин */
  { t0: 214.7, t1: 220.0, f: (s, d, t) => ({
      mood: MD.sub, focus: [0, 0, 0],
      cam: sway({ pos: mv([-1.4, 1.4, 3.2], [-1.2, 1.4, 2.7], s, d), look: [2.4, 1.2, 0.8], fov: 26 }, t, 0.9),
      scene: <Subway empty trainX={200} />,
      acts: [act("art", "male", ART, [2.8, 0, 0.5], -1.2, "Sitting_Idle_Loop", s * 0.6), act("old", "male", OLDMAN, [1.7, 0, 1.9], 1.2, "Idle_Talking_Loop", s * 1.0)],
    }) },
  { t0: 220.0, t1: 228.5, f: (s, d, t) => {
      const z = 12 - s * 1.2;
      return {
        mood: MD.nyNight, focus: [0, 0, z],
        cam: sway({ pos: mv([-2.6, 1.4, z + 5], [-1.8, 1.5, z + 4.4], s, d), look: [0.2, 1.3, z], fov: 36 }, t, 1),
        scene: <Brownstones mood={MD.nyNight} night z0={-80} z1={60} cam={[-2.6, 1.4, z + 5]} lampOn={1} wet={1} />,
        acts: [act("art", "male", ART, [0.2, 0, z], Math.PI, WALK, s * 0.95)],
      };
    } },
  /* звонок маме */
  { t0: 228.5, t1: 235.0, f: (s, d, t) => ({
      mood: MD.nyNight, focus: [-7, 0, 0],
      cam: sway({ pos: mv([-2.6, 1.4, 3.4], [-3.4, 1.4, 2.6], s, d), look: [-7, 1.3, 0], fov: 34 }, t, 1),
      scene: <Brownstones mood={MD.nyNight} night z0={-60} z1={40} cam={[-2.6, 1.4, 3.4]} lampOn={1} wet={1} />,
      acts: [act("art", "male", ART, [-7.0, 0, 0.0], Math.PI / 2, "Idle_TalkingPhone_Loop", s)],
    }) },
  { t0: 235.0, t1: 242.5, f: (s, d, t) => ({
      mood: MD.nyNight, focus: [-7, 0, 0],
      cam: sway({ pos: mv([-4.2, 1.55, 0.8], [-4.4, 1.6, 0.5], s, d), look: [-7, 1.5, 0], fov: 22 }, t, 0.8),
      scene: <Brownstones mood={MD.nyNight} night z0={-60} z1={40} cam={[-4.2, 1.55, 0.8]} lampOn={1} wet={1} />,
      acts: [act("art", "male", ART, [-7.0, 0, 0.0], Math.PI / 2, "Idle_TalkingPhone_Loop", s * 0.8)],
    }) },
  { t0: 242.5, t1: 251.5, f: (s, d, t) => ({
      mood: MD.aptNight, focus: [0, 0, 0],
      cam: sway({ pos: mv([1.1, 0.9, 1.6], [0.8, 0.85, 1.3], s, d), look: [-0.1, 0.3, -0.3], fov: 50 }, t, 0.8),
      scene: <BrooklynRoom bulb={0.6} />,
      acts: [act("art", "male", ART_HOME, [0.2, 0, -0.5], 2.2, "Sitting_Idle_Loop", s * 0.5)],
    }) },
  /* крыша — подъём и вид */
  { t0: 251.5, t1: 258.5, f: (s, d, t) => ({
      mood: MD.rooftop, focus: [0, 0, -2],
      cam: sway({ pos: mv([-3, 1.3, 6], [-1.5, 1.4, 4], s, d), look: [0, 1.5, -2], fov: 36 }, t, 1),
      scene: <Rooftop mood={MD.rooftop} dusk />,
      acts: [artWalk([-3.2 + s * 0.45, 0, 2 - s * 0.3], 0.5, s * 0.9, {}, ART, WALK, false)],
    }) },
  { t0: 258.5, t1: 269.5, f: (s, d, t) => ({
      mood: MD.rooftop, focus: [0, 0, -2],
      cam: sway({ pos: mv([-0.5, 1.2, 6.5], [0.6, 4.8, 2.6], s, d), look: [0, mix3([1.5, 0, 0], [22, 0, 0], eio(s / d)) [0], -60], fov: mv([36, 0, 0], [52, 0, 0], s, d)[0] }, t, 0.7),
      scene: <Rooftop mood={MD.rooftop} dusk />,
      acts: [act("art", "male", ART, [0, 0, -0.4], Math.PI, "Idle_Rail_Loop", s * 0.7)],
    }) },
  /* звонок и финал */
  { t0: 269.5, t1: 276.5, f: (s, d, t) => ({
      mood: MD.aptDawn, focus: [0, 0, 0],
      cam: sway({ pos: mv([0.6, 1.0, 1.4], [0.35, 0.9, 1.1], s, d), look: [0, 0.75, -0.4], fov: 28 }, t, 0.8),
      scene: <BrooklynRoom day />,
      acts: [act("art", "male", ART_HOME, [0.0, 0, 0.0], 3.0, "Idle_Loop", s)],
      extra: undefined,
    } as Out) },
  { t0: 276.5, t1: 300, f: (s, d, t) => ({
      mood: MD.rooftop, focus: [0, 0, -2],
      cam: sway({ pos: mv([0, 3.2, 9], [0, 12, 26], s, d), look: [0, mv([2, 0, 0], [60, 0, 0], s, d)[0], -60], fov: 44 }, t, 0.5),
      scene: <Rooftop mood={MD.rooftop} dusk />,
      acts: [act("art", "male", ART, [0, 0, -0.4], Math.PI, "Idle_Rail_Loop", s * 0.7)],
      title: { big: "ПРОДОЛЖЕНИЕ СЛЕДУЕТ", small: "ИЗ МОСКВЫ В НЬЮ-ЙОРК  ·  ЧАСТЬ 1", a: 5, b: 22 },
      fade: 1,
    }) },
];

import { eio } from "../after/util";
void Phone; void Stool; void lerp; void cl;

/* ───── субтитры только для английских реплик ───── */
const TR: Record<string, string> = { O01: "С какой целью вы приехали?", E01: "Работа. Я... приехал работать.", O02: "Добро пожаловать в Соединённые Штаты.", B01: "Привет! Что вам предложить?", E02: "Кофе. Пожалуйста. Просто... кофе.", B02: "Конечно! Горячий или со льдом? Какой размер? Овсяное, миндальное или обычное молоко? Сироп?", S01: "Потерялся, дружище?", S02: "Садись на четвёрку до Атлантик-авеню. Потом пешком. Всё будет хорошо, парень." };
const EN: Record<string, string> = Object.fromEntries((lines.lines as [string, string, string][]).filter((l) => TR[l[0]]).map((l) => [l[0], l[2].replace(/\[[^\]]*\]\s*/g, "")]));
const activeSub = (t: number) => {
  for (const id of Object.keys(TR)) {
    const st = (cues.vo as Record<string, number>)[id];
    const m = (meta as Record<string, { dur: number; speech: number[] }>)[id];
    if (st === undefined || !m) continue;
    if (t >= st && t <= st + m.dur + 0.3) return { en: EN[id], ru: TR[id] };
  }
  return null;
};

export const NYFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS_N;
  const ok = useAssets();
  const lib = ok ? assets.lib : null;
  const shot = SHOTS.find((x) => t >= x.t0 && t < x.t1) ?? SHOTS[SHOTS.length - 1];
  const s = t - shot.t0;
  const d = shot.t1 - shot.t0;
  const o = shot.f(s, d, t);
  const cam = o.cam;
  const vis = (p: V3) => {
    const dx = p[0] - cam.pos[0], dy = p[1] + 1 - cam.pos[1], dz = p[2] - cam.pos[2];
    const lx = cam.look[0] - cam.pos[0], ly = cam.look[1] - cam.pos[1], lz = cam.look[2] - cam.pos[2];
    const dl = Math.hypot(dx, dy, dz) || 1, ll = Math.hypot(lx, ly, lz) || 1;
    const cos = (dx * lx + dy * ly + dz * lz) / (dl * ll);
    return dl < 2.5 || (cos > Math.cos(((cam.fov ?? 40) * 0.5 + 40) * (Math.PI / 180)) && dl < 140);
  };
  const sub = activeSub(t);
  const blackIn = ramp(t, 0, 1.0);
  const blackOut = ramp(t, NY_SEC - 3, NY_SEC - 0.4);
  const titleOnly = o.fade === 1 && o.title;
  const tk = o.title ? cl((s - o.title.a) / (o.title.b - o.title.a)) : 0;
  const ta = o.title ? ramp(tk, 0, 0.18) * (1 - ramp(tk, 0.8, 1)) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: BAR, width: W, height: H, overflow: "hidden", filter: "contrast(1.1) saturate(1.1) brightness(1.02)" }}>
        {(lib && !titleOnly) && (
          <Stage3D width={W} height={H} mood={o.mood} cam={cam} focus={o.focus}>
            {o.scene}
            {(o.acts ?? []).filter((a) => a.case).map((a) => {
              const c = Math.cos(a.rotY), sn = Math.sin(a.rotY);
              return <Suitcase key={`c${a.id}`} p={[a.pos[0] - 0.42 * c - 0.1 * sn, a.pos[1], a.pos[2] + 0.42 * sn - 0.1 * c]} ry={a.rotY} />;
            })}
            {(o.acts ?? []).filter((a) => vis(a.pos)).map((a) => (
              <Person key={a.id} kind={a.kind} lib={lib} pose={a.pose} outfit={a.outfit} position={a.pos} rotY={a.rotY} scale={a.scale} mod={a.mod} hideHair={a.hideHair} />
            ))}
          </Stage3D>
        )}
        {/* виньетка + тёплые света / холодные тени + зерно */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,40,70,0.16), rgba(255,150,60,0.10))", mixBlendMode: "soft-light" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${frame % 7}'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")` }} />
      </div>
      {o.title && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: ta }}>
          <div style={{ textAlign: "center", transform: `translateY(${(1 - ramp(tk, 0, 0.25)) * 14}px)` }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 200, fontSize: 92, letterSpacing: 18, color: "#f3efe6", textTransform: "uppercase" }}>{o.title.big}</div>
            {o.title.small && <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 26, letterSpacing: 12, color: "#b9b4a6", marginTop: 34 }}>{o.title.small}</div>}
          </div>
        </AbsoluteFill>
      )}
      {sub && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: BAR + 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 40, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{sub.en}</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontStyle: "italic", fontSize: 30, color: "#f0d9a6", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{sub.ru}</div>
        </div>
      )}
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(1 - blackIn, blackOut) }} />
    </AbsoluteFill>
  );
};
