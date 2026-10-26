import { WORDS } from "./words12";

export const FPS = 30;
/** озвучка стартует с этой секунды; всё остальное — во "времени голоса" */
export const OFF = 0.4;
export const VO_FILE = "metro/vo.mp3";
export const END_V = 76.6;
export const DURATION_SEC = Math.ceil((OFF + END_V) * FPS) / FPS;
export const DURATION_FRAMES = Math.ceil((OFF + END_V) * FPS);

export type SceneId =
  | "sky" | "msign" | "street" | "buzz" | "wide" | "phone" | "flood"
  | "r1" | "r2" | "r2b" | "r3" | "quiet" | "descent" | "platform"
  | "r4" | "announce" | "shaft" | "stop" | "dark" | "cough" | "end";

export type Scene = { id: SceneId; start: number; clock?: string; cap?: number };

export const SCENES: Scene[] = [
  { id: "sky", start: 0 },
  { id: "msign", start: 4.7 },
  { id: "street", start: 6.5, clock: "09:00" },
  { id: "buzz", start: 15.7, clock: "09:40" },
  { id: "wide", start: 17.35, clock: "09:40" },
  { id: "phone", start: 19.1, clock: "09:40" },
  { id: "flood", start: 24.0, clock: "09:41" },
  { id: "r1", start: 28.45 },
  { id: "r2", start: 33.2 },
  { id: "r2b", start: 37.1 },
  { id: "r3", start: 39.8 },
  { id: "quiet", start: 44.8, clock: "09:48" },
  { id: "descent", start: 47.9, clock: "09:50" },
  { id: "platform", start: 51.35, clock: "09:52" },
  { id: "r4", start: 55.0 },
  { id: "announce", start: 60.6, clock: "09:52" },
  { id: "shaft", start: 63.0, clock: "09:52" },
  { id: "stop", start: 65.3, clock: "09:52" },
  { id: "dark", start: 66.85, clock: "09:52" },
  { id: "cough", start: 68.3 },
  { id: "end", start: 71.5 },
];

export const sceneAt = (v: number) => {
  let i = 0;
  SCENES.forEach((s, k) => {
    if (v >= s.start) i = k;
  });
  const sc = SCENES[i];
  const end = i < SCENES.length - 1 ? SCENES[i + 1].start : END_V;
  return { sc, idx: i, local: v - sc.start, dur: end - sc.start };
};

/* ---------- субтитры по словам ---------- */
export type CapWord = { text: string; t0: number; t1: number };
export type CapGroup = { t0: number; t1: number; words: CapWord[] };

const breaks = /[.!?:;,«»]$/;

const build = (): CapGroup[] => {
  const groups: CapGroup[] = [];
  let cur: CapWord[] = [];
  const flush = () => {
    if (cur.length) groups.push({ t0: cur[0].t0, t1: cur[cur.length - 1].t1, words: cur });
    cur = [];
  };
  WORDS.forEach(([text, t0, t1], i) => {
    cur.push({ text, t0, t1 });
    const len = cur.reduce((a, w) => a + w.text.length + 1, 0);
    const next = WORDS[i + 1];
    const gap = next ? next[1] - t1 : 9;
    const hard = /[.!?:]$/.test(text);
    if (hard || (breaks.test(text) && cur.length >= 2) || cur.length >= 4 || len > 26 || gap > 0.45) flush();
  });
  flush();
  return groups;
};
export const CAP_GROUPS = build();

export const RED_WORDS = ["чум", "ошибк", "давка", "убивает", "кашляет", "решётка", "решетка", "закрыт", "заката", "гаснет"];
export const YEL_WORDS = ["правило", "первое", "второе", "третье", "четвёртое", "парк", "победы", "два", "метра", "восемьдесят", "четыре", "выход", "пустой", "идеальное", "убежище"];
