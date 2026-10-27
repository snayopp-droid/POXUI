import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { assets, useAssets } from "./assets";
import { Person } from "./people";
import { Stage3D, type Cam } from "./stage";
import { MOODS, Street, Car, type Mood } from "./world";
import { Alley, Courtyard, Board, Crate, Dog, MusicBox, Candle, Cake, Table, Pizza } from "./env";
import { Hud, RuleCard, Title, Fade, type HudState } from "./hud";
import { cl, ramp, lerp, eio } from "./util";
import {
  type Act, type V3, mv, lin, mix3, faceTo, npcOutfit, kindOf, ZOMBIE, headTurn, shake, attach, bagMesh, pizzaBoxMesh,
} from "./film";
import cues from "./cues.json";
import lines from "../../tools/after_lines.json";
import meta from "../../tools/after_vo_meta.json";

export const FPS_F = 24;
export const FILM_SEC = 292;

type Out = {
  world: "street" | "alley" | "court";
  mood: Mood;
  cam: Cam;
  focus: V3;
  acts: Act[];
  extra?: React.ReactNode;
  hud?: HudState | null;
  rule?: { n: string; text: string };
  title?: { big: string; small?: string; a?: number; b?: number };
  street?: { z0?: number; z1?: number; leaves?: number; wreck?: number };
  gate?: number;
};
type Shot = { t0: number; t1: number; f: (s: number, d: number, t: number) => Out };

/* ───── персонажи ───── */
const ART = { skin: "#e8c4a4", shirt: "#35557f", shirt2: "#f08a2c", stripe: 0.35, pants: "#2b2f3a", shoes: "#1c1c1c", hair: "#3a2a1f", sleeve: 0.7 };
const HERO = { skin: "#e3b898", shirt: "#c9a640", pants: "#3a4a6a", shoes: "#2a2622", hair: "#2a1f18", sleeve: 0.28 };
const COURIER = { skin: "#c99a74", shirt: "#d8332a", shirt2: "#f4f4f0", stripe: 0.4, pants: "#1d2430", shoes: "#8d8a82", hair: "#1d1612", sleeve: 0.28 };
const FYODOR = { skin: "#d9a98a", shirt: "#5a4a38", pants: "#3a3430", shoes: "#2a2622", hair: "#7a7a78", sleeve: 0.7, stripe: 0 };
const NINA = { skin: "#f2d6c0", shirt: "#7a3a4a", pants: "#2c3140", shoes: "#2a2622", hair: "#4a2a22", sleeve: 0.7 };
export const VERA = { skin: "#f2d6c0", shirt: "#e8b6c8", pants: "#c86a8a", shoes: "#e8e4dc", hair: "#a07a44", sleeve: 0.28 };
const BRIDE = { skin: "#f2d6c0", shirt: "#f6f3ec", pants: "#f6f3ec", shoes: "#f6f3ec", hair: "#2a1f18", sleeve: 0.28 };
const GROOM = { skin: "#d9a98a", shirt: "#23232a", shirt2: "#f4f4f0", pants: "#23232a", shoes: "#111", hair: "#1d1612", sleeve: 0.7 };

const act = (id: string, kind: "male" | "female", outfit: Act["outfit"], pos: V3, rotY: number, clip: string, time: number, extra: Partial<Act> = {}): Act => ({ id, kind, outfit, pos, rotY, pose: [{ clip, time }], ...extra });
const zom = (i: number, pos: V3, rotY: number, clip: string, time: number, extra: Partial<Act> = {}): Act => act(`z${i}`, kindOf(i + 40), ZOMBIE(i), pos, rotY, clip, time + i * 0.37, extra);
const npc = (i: number, pos: V3, rotY: number, clip: string, time: number, extra: Partial<Act> = {}): Act => act(`n${i}`, kindOf(i), npcOutfit(i), pos, rotY, clip, time + i * 0.41, extra);
const WALK = "Walk_Loop";

const artyom = (pos: V3, rotY: number, clip: string, time: number, extra: Partial<Act> = {}): Act =>
  act("art", "male", ART, pos, rotY, clip, time, { ...extra, mod: (b) => { attach(b, "spine_03", "bag", bagMesh); extra.mod?.(b); } });

const queue = (n: number, x: number, z0: number, dz: number, ry: number, t: number, skip = -1): Act[] =>
  Array.from({ length: n }, (_, i) => i).filter((i) => i !== skip).map((i) => npc(i + 7, [x, 0, z0 + i * dz], ry, "Idle_Loop", t));

const SUN = MOODS.golden;
const CAP = { x: 0 };
void CAP;

/* ───── шоты ───── */
const HERO_P: V3 = [6, 0, -32.6];
const ZOMB_P: V3 = [3.4, 0, -30.2];

const SHOTS: Shot[] = [
  /* 1. очередь за водой */
  { t0: 0, t1: 4.2, f: (s, d) => ({
      world: "street", mood: SUN, focus: [5, 0, -32],
      cam: { pos: mv([1.2, 1.35, -22], [2.6, 1.5, -25], s, d), look: [6, 1.35, -33], fov: 40 },
      acts: [...queue(7, 6, -36, 1.15, Math.PI, s, 3), act("hero", "male", HERO, HERO_P, Math.PI, "Idle_Loop", s), zom(1, ZOMB_P, Math.PI / 2, "Zombie_Idle_Loop", s)],
      extra: <Board p={[6, 0, -39.5]} title="ВОДА" lines={["по талонам", "в одни руки"]} />,
      hud: { label: "ЗАМЕТКА №1 · «ЧИХ»", db: 14 + Math.sin(s * 3) * 1.5 },
    }) },
  /* 2. подступает чих */
  { t0: 4.2, t1: 9.6, f: (s, d) => {
      const k = cl(s / d);
      const sneeze = Math.pow(k, 1.6);
      return {
        world: "street", mood: SUN, focus: [5, 0, -32],
        cam: { pos: mv([3.4, 1.65, -35.6], [4.2, 1.62, -35.0], s, d), look: [6, 1.55, -32.6], fov: 30 - 8 * k },
        acts: [
          act("hero", "male", HERO, HERO_P, Math.PI, "Idle_Loop", s * 1.3, { mod: (b) => { headTurn(b, 0, -0.5 * sneeze, 0.25 * sneeze); if (sneeze > 0.9) shake(b, s, 0.05); } }),
          zom(1, ZOMB_P, Math.PI / 2, "Zombie_Idle_Loop", s, { mod: (b) => headTurn(b, 0, 0, 0) }),
          ...queue(7, 6, -36, 1.15, Math.PI, s, 3),
        ],
        hud: { label: "ЗАМЕТКА №1 · «ЧИХ»", db: lerp(14, 47, eio(k)) },
      };
    } },
  /* 3. он не чихнул */
  { t0: 9.6, t1: 13.8, f: (s, d) => {
      const k = cl(s / d);
      const turn = Math.sin(clamp01(k * 1.2) * Math.PI);
      return {
        world: "street", mood: SUN, focus: [4.5, 0, -32],
        cam: { pos: mv([0.6, 1.6, -29.0], [1.4, 1.6, -29.4], s, d), look: [5.0, 1.4, -31.8], fov: 38 },
        acts: [
          act("hero", "male", HERO, HERO_P, Math.PI, "Idle_Loop", s * 0.8, { mod: (b) => headTurn(b, 0, 0.15 * (1 - k), 0) }),
          zom(1, ZOMB_P, Math.PI / 2 + turn * 0.9, "Zombie_Idle_Loop", s),
          ...queue(7, 6, -36, 1.15, Math.PI, s, 3),
        ],
        hud: { label: "ЗАМЕТКА №1 · «ЧИХ»", db: lerp(47, 16, eio(ramp(k, 0.15, 0.7))) },
      };
    } },
  /* 4. титул */
  { t0: 13.8, t1: 16.9, f: (s, d) => ({
      world: "street", mood: MOODS.overcast, focus: [0, 0, -40],
      cam: { pos: mv([0, 9, 10], [0, 4.5, -4], s, d), look: [0, 1.5, -60], fov: 46 },
      acts: [], hud: null,
      title: { big: "ЖИЗНЬ ПОСЛЕ", small: "МОСКВА · ПЯТЬ ЛЕТ СПУСТЯ" },
      street: { wreck: 1, leaves: 0.4 },
    }) },
  /* 5. мёртвые охотятся на звук */
  { t0: 16.9, t1: 21.6, f: (s, d) => ({
      world: "street", mood: MOODS.overcast, focus: [0, 0, -40],
      cam: { pos: mv([-3, 1.7, -8], [-1, 1.9, -14], s, d), look: [0, 1.5, -40], fov: 34 },
      acts: [
        ...[0, 1, 2, 3, 4, 5, 6].map((i) => zom(i, [(i % 3 - 1) * 2.4 + Math.sin(i) * 0.6, 0, -20 - i * 3.6 + s * 0.35], Math.PI + Math.sin(i) * 0.3, "Zombie_Walk_Fwd_Loop", s * 0.45)),
      ],
      hud: { label: "ЖИЗНЬ ПОСЛЕ · ЖУРНАЛ №2 · ГОРОД", db: 21 + Math.sin(s * 2) * 2 },
    }) },
  { t0: 21.6, t1: 26.3, f: (s, d) => ({
      world: "street", mood: MOODS.overcast, focus: [5, 0, -22],
      cam: { pos: mv([8.2, 1.3, -14], [8.0, 1.3, -19], s, d), look: [4.5, 1.4, -26], fov: 38 },
      acts: [
        zom(2, [4.3, 0, -24], 0.4, "Zombie_Idle_Loop", s),
        ...[0, 1, 2].map((i) => npc(20 + i, [6.8 - i * 0.2, 0, -12 - i * 2.2 - s * 0.9], Math.PI, "Walk_Loop", s * 0.7 + i, {})),
      ],
      hud: { label: "ЖИЗНЬ ПОСЛЕ · ЖУРНАЛ №2 · ГОРОД", db: 18 },
    }) },
  /* 6. правило 1: подошва */
  { t0: 26.3, t1: 33.3, f: (s, d, t) => {
      const z = -12 - s * 1.35;
      return {
        world: "street", mood: SUN, focus: [2, 0, z],
        cam: s < 3.6 ? { pos: [3.2, 0.35, z + 3.2], look: [0.6, 0.25, z], fov: 44 } : { pos: mv([-1.5, 1.4, z + 4.5], [-2.2, 1.7, z + 5], s - 3.6, d - 3.6), look: [0.4, 1.1, z], fov: 38 },
        acts: [
          act("cour", "male", COURIER, [0.6, 0, z], Math.PI, WALK, s * 1.05, { mod: (b) => { attach(b, "hand_r", "pz", pizzaBoxMesh); } }),
          zom(3, [-3.2, 0, z - 9], 1.0, "Zombie_Idle_Loop", s),
        ],
        hud: { label: "ЗАМЕТКА №2 · «ВАЛЕНКИ»", db: 9 },
        rule: { n: "1", text: "Подошва не стучит" },
      };
    } },
  /* 7. правило 2: не кричать */
  { t0: 33.3, t1: 40.3, f: (s, d) => {
      const hit = s > 2.4;
      const k = ramp(s, 2.4, 4.8);
      const db = !hit ? 15 : s < 3.4 ? lerp(15, 74, ramp(s, 2.4, 2.7)) : 31;
      return {
        world: "street", mood: SUN, focus: [5, 0, -20],
        cam: { pos: mv([2.0, 1.4, -14], [3.2, 1.5, -16.5], s, d), look: [5.8, 1.1, -20], fov: 38 },
        acts: [
          act("hero", "male", HERO, [5.8, 0, -20], Math.PI * 0.9, hit ? "Consume" : WALK, hit ? s - 2.4 : s * 0.9, { mod: (b) => { if (hit && s < 4.6) shake(b, s, 0.06); } }),
          zom(4, [3.4, 0, -25.5], 0.2, "Zombie_Idle_Loop", s),
          npc(31, [7.4, 0, -22.5], Math.PI * 1.3, "Idle_Talking_Loop", s),
        ],
        hud: { label: "ЗАМЕТКА №3 · «МИЗИНЕЦ»", db, status: hit && s >= 3.4 ? "В РУКАВ" : undefined },
        rule: { n: "2", text: "Не кричать" },
      };
      void k;
    } },
  /* 8. правило 3: не смеяться */
  { t0: 40.3, t1: 47.8, f: (s, d) => ({
      world: "street", mood: SUN, focus: [6, 0, -18],
      cam: { pos: mv([2.2, 1.5, -12], [3.2, 1.45, -13], s, d), look: [6.4, 1.1, -18], fov: 36 },
      acts: [
        act("b1", "male", { ...HERO, shirt: "#4a6a4a" }, [6.2, 0.45, -18.6], Math.PI / 2 + 0.3, "Sitting_Talking_Loop", s),
        act("b2", "male", { ...npcOutfit(5) }, [6.2, 0.45, -17.2], -Math.PI / 2 - 0.3, "Sitting_Idle_Loop", s, { mod: (b) => { if (s > 3) shake(b, s, 0.07); } }),
        zom(5, [4.0, 0, -22], 0.3, "Zombie_Idle_Loop", s),
      ],
      extra: <Crate p={[6.2, 0, -18]} s={[1.2, 0.45, 2.6]} c="#6b5a46" />,
      hud: { label: "ЗАМЕТКА №4 · «АНЕКДОТ»", db: s < 3 ? 12 : 31 + Math.sin(s * 30) * 3, status: s < 3 ? undefined : "ВНУТРЕННИЙ ХОХОТ" },
      rule: { n: "3", text: "Не смеяться" },
    }) },
  /* 9. свадьба */
  { t0: 47.8, t1: 53.8, f: (s, d) => ({
      world: "street", mood: MOODS.dawn, focus: [2, 0, -18],
      cam: { pos: mv([-1.5, 1.4, -8], [0.5, 1.7, -10], s, d), look: [0, 1.4, -18], fov: 40 },
      acts: [
        act("bride", "female", BRIDE, [-0.5, 0, -17], 0.3, "Dance_Loop", s),
        act("groom", "male", GROOM, [0.6, 0, -17.3], -0.4, "Dance_Loop", s),
        ...[0, 1, 2, 3, 4].map((i) => npc(40 + i, [-3 + i * 1.6, 0, -20.5 + (i % 2) * 0.6], Math.PI + 0.2 - i * 0.12, i % 2 ? "Yes" : "Idle_Talking_Loop", s + i * 0.5)),
      ],
      extra: <Board p={[3.4, 0, -21]} ry={Math.PI} title="ГОРЬКО" lines={["(тихо)"]} />,
      hud: { label: "ЗАМЕТКА №5 · «СВАДЬБА»", db: 17 + Math.abs(Math.sin(s * 5)) * 6 },
    }) },
  /* 10. мемориальная доска */
  { t0: 53.8, t1: 58.8, f: (s, d) => ({
      world: "street", mood: MOODS.overcast, focus: [0, 0, -20],
      cam: { pos: mv([-1.5, 1.6, -9], [0, 1.7, -13.5], s, d), look: [0, 1.7, -18], fov: 36 },
      acts: [npc(50, [-1.6, 0, -16.6], 0.3, "Idle_Loop", s)],
      extra: <Board p={[0, 0, -18]} ry={Math.PI} title="ПАМЯТИ ТЕХ" lines={["КТО ЧИХНУЛ", "2031 — 2033"]} />,
      hud: { label: "ПЛОЩАДЬ · МЕМОРИАЛ", db: 11 },
    }) },
  /* 11. мама с малышом */
  { t0: 58.8, t1: 65.8, f: (s, d) => ({
      world: "street", mood: MOODS.golden, focus: [5, 0, -20],
      cam: { pos: mv([2.5, 1.4, -14], [3.3, 1.5, -15.5], s, d), look: [6.0, 1.2, -20], fov: 34 },
      acts: [
        act("mom", "female", { ...NINA, shirt: "#6a8a9a" }, [6.4, 0, -20], Math.PI * 0.95, "Idle_Loop", s * 0.7, { mod: (b) => headTurn(b, 0, 0.2 + Math.sin(s) * 0.05, Math.sin(s * 1.3) * 0.1) }),
        zom(6, [4.7, 0, -21.4], 0.6, "Zombie_Idle_Loop", s, { mod: (b) => headTurn(b, 0.2, 0, Math.sin(s * 1.1) * 0.15) }),
      ],
      hud: { label: "ЗАМЕТКА №6 · «КОЛЫБЕЛЬНАЯ»", db: 33 + Math.sin(s * 4.3) * 2 },
    }) },
  /* 12. весь город, кроме почтальона */
  { t0: 65.8, t1: 70.3, f: (s, d) => ({
      world: "street", mood: MOODS.golden, focus: [0, 0, -30],
      cam: { pos: mv([0, 7.5, 6], [0, 5.5, -4], s, d), look: [0, 1.5, -40], fov: 42 },
      acts: [
        ...[0, 1, 2, 3, 4, 5].map((i) => npc(60 + i, [(i % 2 ? 6 : -6) + Math.sin(i) * 0.5, 0, -12 - i * 5 + (i % 2 ? 1 : -1) * s * 0.9], i % 2 ? Math.PI : 0, WALK, s * 0.7 + i)),
        artyom([0.4, 0, -4 - s * 1.5], Math.PI, WALK, s * 1.1),
      ],
      hud: { label: "ЖИЗНЬ ПОСЛЕ · ЖУРНАЛ №3 · ЛЮДИ", db: 22 },
    }) },
  /* 13. Артём */
  { t0: 70.3, t1: 77.3, f: (s, d) => {
      const z = -6 - s * 1.5;
      return {
        world: "street", mood: MOODS.dusk, focus: [0, 0, z],
        cam: { pos: mv([-2.4, 1.2, z + 4.2], [-2.0, 1.5, z + 4.6], s, d), look: [0.2, 1.15, z], fov: 36 },
        acts: [artyom([0.2, 0, z], Math.PI, WALK, s * 1.1)],
        title: undefined,
        hud: { label: "АРТЁМ · 34 · ПОЧТАЛЬОН", db: 13, status: "ДЫШИТ ТИХО" },
      };
    } },
  /* 14. подворотня */
  { t0: 77.3, t1: 83.2, f: (s, d) => ({
      world: "alley", mood: MOODS.dusk, focus: [0, 0, -6],
      cam: { pos: mv([0, 1.5, 3], [0.6, 1.5, -2.5], s, d), look: [0, 1.5, -16], fov: 46 },
      acts: [artyom([0, 0, 0 - s * 1.0], Math.PI, WALK, s * 0.8)],
      hud: { label: "ЧЁРНЫЙ РЫНОК · ПОДВОРОТНЯ", db: 24 },
    }) },
  /* 15-18: диалог на рынке */
  { t0: 83.2, t1: 88.9, f: (s, d) => ({
      world: "alley", mood: MOODS.dusk, focus: [0, 0, -9],
      cam: { pos: mv([-1.0, 1.7, -4.8], [0.5, 1.6, -5.8], s, d), look: [2.8, 1.2, -9.5], fov: 32 },
      acts: [
        act("fy", "male", FYODOR, [3.0, 0, -11.2], Math.PI, "Idle_Talking_Loop", s),
        artyom([1.5, 0, -7.8], -2.0, "Idle_Loop", s),
      ],
      hud: { label: "ЗАМЕТКА №7 · «ТОРГ»", db: 22 + (s % 2) * 3 },
    }) },
  { t0: 88.9, t1: 92.9, f: (s, d) => ({
      world: "alley", mood: MOODS.dusk, focus: [2.6, 0, -9],
      cam: s < 2.0 ? { pos: mv([0.2, 1.65, -6.2], [0.6, 1.65, -6.6], s, 2), look: [1.4, 1.62, -8], fov: 24 } : { pos: [3.0, 1.3, -9.3], look: [3.3, 0.85, -10.2], fov: 26 },
      acts: [artyom([1.5, 0, -7.8], -2.0, "Idle_Loop", s)],
      hud: { label: "ЗАМЕТКА №7 · «ТОРГ»", db: s < 2.0 ? 21 : 52 * ramp(s, 2.0, 2.3) + 10, status: s >= 2.0 ? "ШКАТУЛКА" : undefined },
    }) },
  { t0: 92.9, t1: 98.5, f: (s, d) => ({
      world: "alley", mood: MOODS.dusk, focus: [2.2, 0, -9],
      cam: { pos: mv([0.8, 1.7, -6.5], [1.0, 1.7, -7.0], s, d), look: [2.2, 1.5, -9.5], fov: 28 },
      acts: [act("fy", "male", FYODOR, [3.0, 0, -11.2], Math.PI, "Idle_Loop", s), artyom([1.5, 0, -7.8], -2.2, "Idle_Talking_Loop", s)],
      hud: { label: "ЗАМЕТКА №7 · «ТОРГ»", db: 24 },
    }) },
  { t0: 98.5, t1: 103.5, f: (s, d) => ({
      world: "alley", mood: MOODS.dusk, focus: [2.2, 0, -9],
      cam: { pos: mv([-0.4, 1.5, -5.5], [0.6, 1.5, -6.2], s, d), look: [2.4, 1.3, -9.2], fov: 30 },
      acts: [act("fy", "male", FYODOR, [3.0, 0, -11.2], Math.PI, "Interact", s * 0.6), artyom([1.5, 0, -7.8], -2.1, "Interact", s * 0.5)],
      hud: { label: "ЗАМЕТКА №7 · «ТОРГ»", db: 22 },
    }) },
  /* 19. уходит с шкатулкой */
  { t0: 103.5, t1: 108.5, f: (s, d) => ({
      world: "alley", mood: MOODS.dusk, focus: [0, 0, -2],
      cam: { pos: [-1.8, 1.0, -14], look: [0.5, 1.2, mv([0, 0, -8], [0, 0, 6], s, d)[2]], fov: 40 },
      acts: [artyom([0.5, 0, -8 + s * 2.6], 0, WALK, s * 1.3)],
      hud: { label: "ШКАТУЛКА · ПЛАТА: 3 МЕСЯЦА ПАЙКА", db: 12 },
    }) },

  /* 20. до двора три километра */
  { t0: 108.5, t1: 113.2, f: (s, d) => ({
      world: "street", mood: MOODS.dusk, focus: [0, 0, -30],
      cam: { pos: mv([-1, 1.7, 4], [0, 1.9, 1], s, d), look: [0, 1.5, -40], fov: 40 },
      acts: [artyom([0.6, 0, -2 - s * 1.1], Math.PI, WALK, s * 0.9), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => zom(i, [(i % 4 - 1.5) * 2.2, 0, -22 - i * 6.5], Math.PI * (i % 2) + i, "Zombie_Idle_Loop", s))],
      hud: { label: "ДО ДВОРА: 3 КМ", db: 12, status: "СЛУШАТЕЛЕЙ НА ПУТИ: 12" },
    }) },
  /* 21. дышит профессионально */
  { t0: 113.2, t1: 118.4, f: (s, d) => {
      const z = -10 - s * 0.7;
      return {
        world: "street", mood: MOODS.dusk, focus: [0, 0, z],
        cam: { pos: mv([-2.2, 0.8, z + 5], [-1.4, 1.2, z + 4], s, d), look: [0.2, 1.0, z - 1], fov: 36 },
        acts: [
          artyom([0.2, 0, z], Math.PI, "Crouch_Fwd_Loop", s * 0.8),
          zom(0, [-1.4, 0, z - 4], 0.9, "Zombie_Idle_Loop", s),
          zom(1, [2.4, 0, z - 7], -0.8, "Zombie_Idle_Loop", s),
          zom(2, [1.4, 0, z + 2], 3.0, "Zombie_Idle_Loop", s),
        ],
        hud: { label: "ЗАМЕТКА №8 · «ДЫХАНИЕ»", db: 6 + Math.abs(Math.sin(s * 2.3)) * 5 },
      };
    } },
  /* 22. собака */
  { t0: 118.4, t1: 123.6, f: (s, d) => {
      const dx = -7 + s * 2.4;
      const bark = s > 2.6 && s < 3.4;
      return {
        world: "street", mood: MOODS.dusk, focus: [0, 0, -16],
        cam: { pos: mv([-3.4, 1.3, -8], [-2.6, 1.3, -9], s, d), look: [0, 0.8, -16], fov: 40 },
        acts: [
          artyom([2.8, 0, -22], 0, "Idle_Loop", s),
          ...[0, 1, 2, 3].map((i) => zom(i, [-2 + i * 1.8, 0, -24 - i * 2.6], Math.PI + 0.3 * Math.sin(i), "Zombie_Idle_Loop", s, { mod: (b) => headTurn(b, ramp(s, 2.5, 3.2) * (i % 2 ? 0.8 : -0.8), 0, 0) })),
        ],
        extra: <Dog p={[dx, 0, -16]} ry={Math.PI / 2} t={s} run={0.2} />,
        hud: { label: "ЗАМЕТКА №9 · «СОБАКА»", db: bark ? 82 : 11, status: bark ? "СОБАКА!" : undefined },
      };
    } },
  { t0: 123.6, t1: 129.6, f: (s, d) => ({
      world: "street", mood: MOODS.dusk, focus: [0, 0, -30],
      cam: { pos: mv([1.8, 1.7, -14], [1.2, 1.7, -15], s, d), look: [-1, 1.2, -34], fov: 38 },
      acts: [
        act("art", "male", ART, [1.6, 0, -16], Math.PI, "Idle_Loop", s),
        ...[0, 1, 2, 3, 4, 5].map((i) => zom(i, [-2 + (i % 3) * 1.6, 0, -22 - i * 1.8 - s * 3.2], Math.PI, "Zombie_Walk_Fwd_Loop", s * 0.9)),
      ],
      extra: <Dog p={[-1.5, 0, -22 - s * 3.6 - 6]} ry={Math.PI} t={s} run={1} />,
      hud: { label: "СЧЁТ ДО СТА", db: 5, status: `ВЫДОХ ЧЕРЕЗ ${Math.max(0, 100 - Math.floor(s * 17))}` },
    }) },
  /* 24. шкатулка падает */
  { t0: 129.6, t1: 132.3, f: (s, d) => {
      const fall = ramp(s, 0.9, 1.25);
      return {
        world: "street", mood: MOODS.dusk, focus: [0, 0, -16],
        cam: { pos: [0.6, 1.2, -13.2], look: [0.9, 0.5, -16], fov: 30 },
        acts: [artyom([1.0, 0, -16.8], 0.2, "Idle_Loop", s)],
        extra: <MusicBox p={[0.9, lerp(1.0, 0.02, fall * fall), -16]} ry={s * 3} rz={fall * 1.3} open={ramp(s, 1.2, 1.6)} />,
        hud: { label: "ЗАМЕТКА №10 · «ШКАТУЛКА»", db: s < 1.15 ? 8 : 68 * ramp(s, 1.15, 1.3), status: s < 1.15 ? undefined : "ОПАСНО" },
      };
    } },
  /* 25. звук */
  { t0: 132.3, t1: 137, f: (s, d) => ({
      world: "street", mood: MOODS.dusk, focus: [0, 0, -16],
      cam: s < 2.3 ? { pos: mv([0.2, 0.5, -14.2], [0.6, 0.35, -14.8], s, 2.3), look: [0.9, 0.1, -16], fov: 30 } : { pos: [0, 1.7, -8], look: [0, 1.3, -40], fov: 36 },
      acts: [
        ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => zom(i, [(i % 4 - 1.5) * 2.0, 0, -26 - i * 5], Math.PI * 0 + Math.PI + (i % 2 ? 0.7 : -0.7) * (1 - ramp(s, 2.3, 4)), "Zombie_Idle_Loop", s)),
        ...(s < 2.3 ? [artyom([1.6, 0, -17.4], 0.4, "Idle_Loop", s)] : []),
      ],
      extra: <MusicBox p={[0.9, 0.02, -16]} ry={0.6} rz={1.3} open={1} spin={s * 4} />,
      hud: { label: "ЗАМЕТКА №10 · «ШКАТУЛКА»", db: 68 - ramp(s, 3, 4.5) * 12, status: "ОПАСНО" },
    }) },
  /* 26. орда */
  { t0: 137, t1: 141.6, f: (s, d) => ({
      world: "street", mood: MOODS.dusk, focus: [0, 0, -20],
      cam: { pos: mv([1.8, 1.6, -9], [1.2, 1.7, -11], s, d), look: [0, 1.2, -32], fov: 36 },
      acts: [
        artyom([1.2, 0, -14], 0, "Idle_Loop", s),
        ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => zom(i, [(i % 4 - 1.5) * 1.8, 0, -24 - Math.floor(i / 4) * 5 + s * 3.2], 0, "Zombie_Walk_Fwd_Loop", s * 1.3)),
      ],
      hud: { label: "ЗАМЕТКА №11 · «БЕГ»", db: 54 + 10 * Math.sin(s * 9), status: "ОПАСНО" },
    }) },
  { t0: 141.6, t1: 146.6, f: (s, d) => {
      const z = -14 + s * 4.4;
      return {
        world: "street", mood: MOODS.dusk, focus: [0, 0, z],
        cam: { pos: mv([-2.2, 1.0, z + 7.5], [-1.0, 1.2, z + 7.5], s, d), look: [0, 1.0, z], fov: 42 },
        acts: [
          artyom([0.4, 0, z], 0, "Sprint_Loop", s * 0.95),
          ...[0, 1, 2, 3, 4, 5].map((i) => zom(i, [-1.5 + (i % 3) * 1.4, 0, z - 6 - i * 1.2 + s * -0.2], 0, "Zombie_Walk_Fwd_Loop", s * 1.5)),
        ],
        hud: { label: "ЗАМЕТКА №11 · «БЕГ»", db: 71 + 7 * Math.sin(s * 8), status: "ОПАСНО" },
      };
    } },
  { t0: 146.6, t1: 150.6, f: (s, d) => {
      const z = 6 + s * 4.6;
      return {
        world: "street", mood: MOODS.dusk, focus: [0, 0, z],
        cam: { pos: [5.6, 1.5, z - 1], look: [0.2, 1.0, z + 2], fov: 50 },
        acts: [
          artyom([0.2, 0, z], 0, "Sprint_Loop", s * 0.95 + 0.4),
          ...[0, 1, 2, 3].map((i) => zom(i, [-1.2 + i * 0.9, 0, z - 5 - i * 1.6], 0, "Zombie_Walk_Fwd_Loop", s * 1.5)),
        ],
        hud: { label: "ЗАМЕТКА №11 · «БЕГ»", db: 78 + 8 * Math.sin(s * 7), status: "ТРЕВОГА" },
      };
    } },
  /* двор: ворота */
  { t0: 150.6, t1: 156.6, f: (s, d) => {
      const z = lerp(34, 7, ramp(s, 0, 3.2));
      const gate = 1 - ramp(s, 3.4, 4.4);
      return {
        world: "court", mood: MOODS.dusk, focus: [0, 0, 8], gate,
        cam: { pos: mv([0, 1.6, -2], [-1.4, 1.5, -1], s, d), look: [0, 1.3, 14], fov: 50 },
        acts: [
          act("nina", "female", NINA, [-2.2, 0, 11], 0.6, "Idle_Rail_Call", s),
          artyom([0.2, 0, z], Math.PI, "Sprint_Loop", s * 0.95),
          ...[0, 1, 2, 3, 4, 5, 6].map((i) => zom(i, [-3 + i * 1.0 + Math.sin(i) * 0.4, 0, Math.max(14 + (i % 2) * 0.8 + (i > 3 ? 1.2 : 0), z + 5 + i * 1.5 - ramp(s, 3, 4.5) * 0)], Math.PI, "Zombie_Walk_Fwd_Loop", s * 1.5)),
        ],
        hud: { label: "ЗАМЕТКА №11 · «БЕГ»", db: s < 3.4 ? 84 : 96 * (1 - ramp(s, 4.4, 6)) + 30, status: s < 3.4 ? "ТРЕВОГА" : undefined },
      };
    } },
  /* 30. двор, свеча */
  { t0: 156.6, t1: 163.5, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, -4], gate: 0,
      cam: { pos: mv([-4.6, 1.5, 6], [-3.0, 1.4, 3], s, d), look: [0, 1.0, -5], fov: 44 },
      acts: [
        ...[0, 1, 2, 3, 4, 5].map((i) => npc(70 + i, [-2.6 + i * 1.05, 0, i % 2 ? -3.9 : -6.1], i % 2 ? 0 : Math.PI, "Idle_Loop", s + i)),
        act("nina", "female", NINA, [3.4, 0, -5], -1.6, "Idle_Loop", s),
        act("vera", "female", VERA, [0, 0, -4.1], 0, "Idle_Loop", s, { scale: 0.62 }),
      ],
      extra: <><Cake p={[0, 0.78, -5]} /><Candle p={[0, 0.88, -5]} fl={Math.sin(s * 11)} /></>,
      hud: { label: "ДВОР · ДЕНЬ РОЖДЕНИЯ ВЕРЫ", db: 10, status: "ТИШИНА" },
    }) },
  { t0: 163.5, t1: 168.2, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, -4], gate: 0,
      cam: mv([-2.2, 1.2, -1.4], [-1.6, 1.15, -2.2], s, d) && { pos: mv([-2.2, 1.2, -1.4], [-1.6, 1.15, -2.0], s, d), look: [0.2, 0.95, -4.8], fov: 34 },
      acts: [
        artyom([-0.8, 0, -2.6], 0.5, "Interact", s * 0.6, {}),
        act("vera", "female", VERA, [0.2, 0, -4.1], 0, "Idle_Loop", s, { scale: 0.62 }),
        act("nina", "female", NINA, [1.6, 0, -4.5], -1.5, "Idle_Loop", s),
      ],
      extra: <><Table p={[0, 0, -5]} s={[3, 1.1]} /><Cake p={[0, 0.78, -5]} /><Candle p={[0, 0.88, -5]} fl={Math.sin(s * 11)} /><MusicBox p={[-0.3, 0.8, -4.8]} /></>,
      hud: { label: "ДВОР · ДЕНЬ РОЖДЕНИЯ ВЕРЫ", db: 12 },
    }) },
  /* 32. музыка */
  { t0: 168.2, t1: 173.3, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, -4], gate: 0,
      cam: { pos: mv([-0.3, 1.1, -3.6], [-0.15, 1.0, -4.1], s, d), look: [-0.3, 0.85, -4.8], fov: 26 },
      acts: [act("vera", "female", VERA, [0.2, 0, -3.8], Math.PI, "Idle_Loop", s, { scale: 0.62 })],
      extra: <><Cake p={[0.4, 0.78, -5]} /><Candle p={[0.4, 0.88, -5]} fl={Math.sin(s * 11)} /><MusicBox p={[-0.3, 0.8, -4.8]} open={ramp(s, 0.6, 1.2)} spin={s * 3} /></>,
      hud: { label: "ЗАМЕТКА №12 · «ШКАТУЛКА»", db: s < 0.8 ? 12 : 41 + Math.sin(s * 9) * 2, status: s < 0.8 ? undefined : "МУЗЫКА" },
    }) },
  { t0: 173.3, t1: 177.8, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, 2], gate: 0,
      cam: { pos: mv([-2.4, 1.5, -2], [-1.4, 1.5, -0.5], s, d), look: [0, 1.4, 12], fov: 44 },
      acts: [
        act("nina", "female", NINA, [-0.6, 0, 1.5 + ramp(s, 0, 2.2) * 6], 0, WALK, s * 1.2),
        ...[0, 1, 2, 3, 4, 5].map((i) => zom(i, [-3 + i * 1.2, 0, 14.6 + (i % 2) * 0.7 + (1 - ramp(s, 0, 2.5)) * 6], Math.PI, "Zombie_Walk_Fwd_Loop", s)),
      ],
      hud: { label: "ЗАМЕТКА №12 · «ШКАТУЛКА»", db: 41, status: "МУЗЫКА" },
    }) },
  /* 34. слушатели у ворот */
  { t0: 177.8, t1: 184, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, 6], gate: 0,
      cam: { pos: mv([1.0, 1.5, -3.6], [0.4, 1.7, -2.4], s, d), look: [0, 1.2, 14], fov: 42 },
      acts: [
        ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => zom(i, [-3.5 + i * 1.0, 0, 14.5 + (i % 3) * 0.6], Math.PI, "Zombie_Idle_Loop", s, { mod: (b) => headTurn(b, 0, 0.1, Math.sin(s * 1.5 + i) * 0.2) })),
        act("nina", "female", NINA, [-0.4, 0, 8], 0, "Idle_Loop", s),
        ...[0, 1, 2].map((i) => npc(80 + i, [-2 + i * 1.8, 0, 3], Math.PI * 0, "Idle_Loop", s)),
      ],
      extra: <><Table p={[0, 0, -5]} s={[3, 1.1]} /><Candle p={[0, 0.88, -5]} fl={Math.sin(s * 11)} /></>,
      hud: { label: "СЛУШАТЕЛЕЙ У ВОРОТ: 8", db: 38, status: "МУЗЫКА" },
    }) },
  { t0: 184, t1: 190, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, -4], gate: 0,
      cam: { pos: mv([-0.5, 1.0, -3.4], [0.1, 1.05, -3.0], s, d), look: [-0.1, 1.0, -4.6], fov: 24 },
      acts: [act("vera", "female", VERA, [-0.1, 0, -3.9], Math.PI, "Idle_Loop", s * 0.5, { scale: 0.62, mod: (b) => headTurn(b, 0, -0.05, Math.sin(s * 1.2) * 0.08) })],
      extra: <><Candle p={[0.5, 0.88, -5]} fl={Math.sin(s * 11)} /><Table p={[0, 0, -5]} s={[3, 1.1]} /><MusicBox p={[-0.3, 0.8, -4.8]} open={1} spin={s * 3} /></>,
      hud: { label: "ВЕРА · 8 ЛЕТ", db: 40, status: "ПЕРВАЯ МУЗЫКА В ЖИЗНИ" },
    }) },
  { t0: 190, t1: 195.6, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, 10], gate: 0,
      cam: { pos: mv([-2.2, 1.55, 6.6], [-1.6, 1.55, 8.0], s, d), look: [0.4, 1.4, 14.4], fov: 34 },
      acts: [
        act("nina", "female", NINA, [-0.2, 0, 7.6 + ramp(s, 0, 3) * 2.6], 0, WALK, s * 0.8),
        ...[0, 1, 2, 3, 4, 5].map((i) => zom(i, [-1.6 + i * 0.9, 0, 14.6 + (i % 2) * 0.5], Math.PI, "Zombie_Idle_Loop", s, { mod: (b) => headTurn(b, 0, 0.2, Math.sin(s * 1.3 + i) * 0.25) })),
      ],
      hud: { label: "СЛУШАТЕЛЕЙ У ВОРОТ: 20", db: 39, status: "МУЗЫКА" },
    }) },
  { t0: 195.6, t1: 201.6, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, 11], gate: 0,
      cam: { pos: mv([1.8, 1.6, 12.8], [1.2, 1.6, 12.0], s, d), look: [-0.2, 1.5, 14.4], fov: 26 },
      acts: [
        act("nina", "female", NINA, [-0.3, 0, 12.2], 0.9, "Idle_Loop", s),
        zom(0, [0.3, 0, 14.5], Math.PI + 0.3, "Zombie_Idle_Loop", s, { mod: (b) => headTurn(b, 0.1, 0.15, 0.2) }),
        zom(1, [-1.0, 0, 14.6], Math.PI - 0.3, "Zombie_Idle_Loop", s),
      ],
      hud: { label: "УКУСОВ: 0", db: 37, status: "МУЗЫКА" },
    }) },
  /* вальс */
  { t0: 201.6, t1: 207, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, 0], gate: 0,
      cam: { pos: mv([4.4, 1.6, 7], [3.2, 3.2, 8.5], s, d), look: [0, 1.0, -2], fov: 44 },
      acts: [
        artyom([-0.4, 0, -1.2], 0.2, "Dance_Loop", s),
        act("vera", "female", VERA, [0.4, 0, -0.8], 3.4, "Dance_Loop", s, { scale: 0.62 }),
        ...[0, 1, 2, 3].map((i) => npc(90 + i, [-3.4 + i * 2.2, 0, 2.2 + (i % 2)], Math.PI, "Idle_Talking_Loop", s)),
        zom(0, [2.6, 0, 14.6], Math.PI, "Zombie_Idle_Loop", s),
        zom(1, [-2.0, 0, 14.5], Math.PI, "Zombie_Idle_Loop", s),
      ],
      hud: { label: "ВАЛЬС", db: 36, status: "20 СЛУШАТЕЛЕЙ · 0 УКУСОВ" },
    }) },
  { t0: 207, t1: 212.1, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, 4], gate: 0,
      cam: { pos: mv([0, 3, 2], [0, 14, -8], s, d), look: [0, 0.5, 12], fov: 50 },
      acts: [...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => zom(i, [-3.5 + i * 1.0, 0, 14.5 + (i % 3) * 0.6], Math.PI, "Zombie_Idle_Loop", s))],
      hud: { label: "ГОРОД", db: 5, status: "ТИШИНА" },
    }) },
  { t0: 212.1, t1: 217, f: (s, d) => ({
      world: "court", mood: MOODS.night, focus: [0, 0, -4], gate: 0,
      cam: { pos: mv([-0.4, 1.0, -2.6], [0.1, 1.05, -2.8], s, d), look: [0, 0.95, -4.2], fov: 24 },
      acts: [act("vera", "female", VERA, [0.0, 0, -3.5], Math.PI, "Idle_Loop", s * 2, { scale: 0.62, mod: (b) => { if (s > 2) shake(b, s, 0.05); } })],
      extra: <><Candle p={[0.5, 0.88, -5]} fl={Math.sin(s * 11)} /><MusicBox p={[-0.3, 0.8, -4.8]} open={1} spin={s * 3} /></>,
      hud: { label: "ЗАМЕТКА №13 · «ЕЩЁ!»", db: s < 2.2 ? 41 : 82 + Math.sin(s * 12) * 4, status: s < 2.2 ? "МУЗЫКА" : "ВЕРА СМЕЁТСЯ ВСЛУХ" },
    }) },
  /* эпилог */
  { t0: 217, t1: 232, f: (s, d) => ({
      world: "court", mood: MOODS.dawn, focus: [0, 0, 6], gate: ramp(s, 6, 12),
      cam: { pos: mv([-4, 2.4, -6], [3, 3.4, 3], s, d), look: [0, 1.2, 12], fov: 42 },
      acts: [
        ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => zom(i, [-3.5 + i * 1.0, 0, 14.5 + (i % 3) * 0.6 + ramp(s, 10, 14) * 2.5], Math.PI, "Zombie_Idle_Loop", s)),
        ...[0, 1, 2, 3, 4].map((i) => npc(100 + i, [-3 + i * 1.5, 0, 6 + (i % 2)], Math.PI, "Yes", s * 0.5)),
        artyom([0.3, 0, 3], Math.PI, "Idle_Loop", s),
        act("vera", "female", VERA, [1.1, 0, 3], Math.PI, "Idle_Loop", s, { scale: 0.62 }),
      ],
      hud: { label: "РАССВЕТ", db: 18 + 20 * ramp(s, 4, 15), status: "ГОРОД ПРОСЫПАЕТСЯ" },
    }) },
  { t0: 232, t1: 262, f: (s, d) => {
      const z = 20 - s * 1.0;
      return {
        world: "street", mood: MOODS.golden, focus: [0, 0, z],
        cam: { pos: mv([-3.8, 1.4, z + 6], [3.4, 1.7, z + 7], s, d), look: [0, 1.2, z - 2], fov: 40 },
        acts: [
          artyom([0, 0, z], Math.PI, WALK, s * 1.0),
          act("vera", "female", VERA, [0.7, 0, z + 0.1], Math.PI, WALK, s * 1.0 + 0.3, { scale: 0.62 }),
          ...[0, 1, 2, 3, 4, 5].map((i) => zom(i, [(i % 3 - 1) * 1.2, 0, z + 4 + i * 1.6], Math.PI, "Zombie_Walk_Fwd_Loop", s * 0.8)),
          ...[0, 1, 2, 3].map((i) => npc(110 + i, [i % 2 ? 6.6 : -6.6, 0, z - 6 - i * 3.5], i % 2 ? -Math.PI / 2 : Math.PI / 2, i % 2 ? "Dance_Loop" : "Yes", s)),
        ],
        hud: { label: "ГОРОД · ГОЛОС", db: 22 + 30 * ramp(s, 0, d), status: "ГОРОД ВОЗВРАЩАЕТ ГОЛОС" },
      };
    } },
  { t0: 262, t1: 292, f: (s, d) => ({
      world: "street", mood: MOODS.dawn, focus: [0, 0, -10],
      cam: { pos: mv([0, 3, 14], [0, 26, 36], s, d), look: [0, 0, -40], fov: 46 },
      acts: [...[0, 1, 2, 3, 4, 5].map((i) => npc(120 + i, [(i % 2 ? 6 : -6), 0, -4 - i * 3 + s * (i % 2 ? 0.6 : -0.6)], i % 2 ? Math.PI : 0, WALK, s * 0.7 + i))],
      hud: null,
      title: { big: "ЖИЗНЬ ПОСЛЕ", small: "ЭПИЗОД 1 · «ГРОМЧЕ»", a: 3, b: 20 },
    }) },
];

const clamp01 = (x: number) => cl(x);

void Alley; void Courtyard; void Car; void Candle; void Cake; void Table; void Pizza; void MusicBox; void Dog; void mix3; void lin; void faceTo;

/* ───── подписи и озвучка ───── */
type LineRow = [string, string, string];
const LINES = lines.lines as LineRow[];
const SPK: Record<string, { name: string; color: string } | null> = { N: null, A: { name: "АРТЁМ", color: "#ffd36a" }, F: { name: "ФЁДОР", color: "#9ad0ff" }, M: { name: "НИНА", color: "#ff9ab0" }, V: { name: "ВЕРА", color: "#b8f0a0" } };
const strip = (s: string) => s.replace(/\[[^\]]*\]\s*/g, "");

const activeLine = (t: number) => {
  for (const [id, who, text] of LINES) {
    const st = (cues.vo as Record<string, number>)[id];
    const m = (meta as Record<string, { dur: number; speech: number[] }>)[id];
    if (st === undefined || !m) continue;
    const a = st + m.speech[0];
    const b = st + m.speech[1] + 0.35;
    if (t >= a && t <= b) return { id, who, text: strip(text), a, b };
  }
  return null;
};

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS_F;
  const ok = useAssets();
  const lib = ok ? assets.lib : null;
  const shot = SHOTS.find((x) => t >= x.t0 && t < x.t1) ?? SHOTS[SHOTS.length - 1];
  const s = t - shot.t0;
  const d = shot.t1 - shot.t0;
  const o = shot.f(s, d, t);
  const line = activeLine(t);
  let captions: string[] = [];
  let sub: { who?: string; text: string; color?: string } | null = null;
  if (line) {
    const spk = SPK[line.who];
    if (!spk) {
      const parts = line.text.split(/(?<=[.!?…»])\s+/);
      const k = (t - line.a) / (line.b - line.a);
      captions = parts.filter((_, i) => k >= (i / parts.length) * 0.92);
    } else sub = { who: spk.name, text: line.text, color: spk.color };
  }
  const capIn = line ? cl((t - line.a) / 0.25) : 1;
  const cam = o.cam;
  const vis = (p: V3) => {
    const dx = p[0] - cam.pos[0], dy = p[1] + 1 - cam.pos[1], dz = p[2] - cam.pos[2];
    const lx = cam.look[0] - cam.pos[0], ly = cam.look[1] - cam.pos[1], lz = cam.look[2] - cam.pos[2];
    const dl = Math.hypot(dx, dy, dz) || 1, ll = Math.hypot(lx, ly, lz) || 1;
    const cos = (dx * lx + dy * ly + dz * lz) / (dl * ll);
    return dl < 3 || (cos > Math.cos(((cam.fov ?? 40) * 0.5 + 38) * (Math.PI / 180)) && dl < 90);
  };
  const fadeIn = ramp(t, 0, 0.6);
  const fadeOut = ramp(t, FILM_SEC - 2.2, FILM_SEC - 0.4);
  const k = cl(s / d);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {(lib || false) && (
        <Stage3D width={1920} height={1080} mood={o.mood} cam={cam} focus={o.focus}>
          {o.world === "street" && <Street mood={o.mood} cam={cam.pos} {...(o.street ?? { leaves: 0.4, wreck: 1 })} />}
          {o.world === "alley" && <Alley mood={o.mood} />}
          {o.world === "court" && <Courtyard mood={o.mood} gateOpen={o.gate ?? 0} />}
          {o.extra}
          {o.acts.filter((a) => vis(a.pos)).map((a) => (
            <Person key={a.id} kind={a.kind} lib={lib!} pose={a.pose} outfit={a.outfit} position={a.pos} rotY={a.rotY} scale={a.scale} mod={a.mod} hideHair={a.hideHair} />
          ))}
        </Stage3D>
      )}
      <Hud hud={o.hud ?? null} captions={captions} sub={sub} capIn={capIn} />
      {o.rule && <RuleCard n={o.rule.n} text={o.rule.text} k={k} />}
      {o.title && <Title big={o.title.big} small={o.title.small} k={o.title.a !== undefined ? cl((s - o.title.a) / ((o.title.b ?? d) - o.title.a)) : k} />}
      <Fade a={Math.max(1 - fadeIn, fadeOut)} />
    </AbsoluteFill>
  );
  void Sequence;
};
