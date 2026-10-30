import vo from "./vo.json";
import lines from "./lines.json";

export type Line = { id: string; who: string; text: string };
export const LINES: Record<string, Line> = Object.fromEntries((lines as Line[]).map((l) => [l.id, l]));
export const clean = (s: string) => s.replace(/\[[^\]]*\]\s*/g, "").trim();

export type Beat = {
  sc: number;          // сцена 0..9
  id: string;          // id реплики либо произвольный ключ немой вставки
  line?: string;       // id реплики (озвучка)
  dur?: number;        // для немых
  sub?: string;        // подпись для немых
  who?: string;        // кто говорит (для рта/метки)
  cx?: number; z?: number; // фокус камеры
  m?: number; b?: number;  // деньги / бутылки в HUD после начала бита
  stamp?: string;
};
export const PAD = 0.38;

const V = (sc: number, line: string, o: Partial<Beat> = {}): Beat => ({ sc, id: line, line, who: LINES[line].who, ...o });
const S = (sc: number, id: string, dur: number, sub: string, o: Partial<Beat> = {}): Beat => ({ sc, id, dur, sub, ...o });

export const BEATS: Beat[] = [
  S(0, "t0", 2.4, "*КАЗАНЬ*. 1989.", { cx: 540, z: 1.0, stamp: "СЕРИЯ 1 · ГОША", m: 0, b: 0 }),
  V(0, "1.01", { cx: 540, z: 1.08, m: 5, b: 1 }),
  S(0, "t0b", 1.5, "Первая точка — *УРНА*", { cx: 540, z: 1.0 }),

  V(1, "2.01", { cx: 380, z: 1.1 }),
  V(1, "2.02", { cx: 700, z: 1.06 }),
  V(1, "2.03", { cx: 380, z: 1.02 }),
  V(1, "2.04", { cx: 540, z: 1.0, m: 5, b: 3, stamp: "ПРАВИЛО №1" }),

  V(2, "3.01", { cx: 760, z: 1.1 }),
  V(2, "3.02", { cx: 440, z: 1.08 }),
  V(2, "3.03", { cx: 760, z: 1.02 }),
  V(2, "3.04", { cx: 440, z: 1.04 }),
  V(2, "3.05", { cx: 760, z: 1.04 }),
  V(2, "3.06", { cx: 440, z: 1.06 }),
  S(2, "t2", 1.3, "Минус *4* бутылки", { cx: 540, z: 1.0, b: 4 }),

  V(3, "4.01", { cx: 400, z: 1.1 }),
  V(3, "4.02", { cx: 700, z: 1.1 }),
  V(3, "4.03", { cx: 400, z: 1.06, m: 10, b: 6 }),
  V(3, "4.04", { cx: 540, z: 1.0, b: 18 }),

  V(4, "5.01", { cx: 760, z: 1.1 }),
  V(4, "5.02", { cx: 400, z: 1.1 }),
  V(4, "5.03", { cx: 760, z: 1.04 }),
  V(4, "5.04", { cx: 400, z: 1.04 }),
  V(4, "5.05", { cx: 760, z: 1.08 }),
  V(4, "5.06", { cx: 400, z: 1.1 }),
  V(4, "5.07", { cx: 760, z: 1.02 }),
  V(4, "5.08", { cx: 420, z: 1.04, m: 46, b: 4 }),

  V(5, "6.01", { cx: 540, z: 1.0 }),
  V(5, "6.02", { cx: 720, z: 1.08 }),
  V(5, "6.03", { cx: 360, z: 1.1 }),
  V(5, "6.04", { cx: 720, z: 1.1 }),
  V(5, "6.05", { cx: 400, z: 1.02, b: 9 }),

  V(6, "7.01", { cx: 760, z: 1.02 }),
  V(6, "7.02", { cx: 400, z: 1.1 }),
  V(6, "7.03", { cx: 760, z: 1.1, m: 71, b: 0 }),
  V(6, "7.04", { cx: 420, z: 1.06 }),

  V(7, "8.01", { cx: 760, z: 1.1 }),
  V(7, "8.02", { cx: 420, z: 1.02, m: 41 }),
  V(7, "8.03", { cx: 540, z: 1.04 }),

  V(8, "9.01", { cx: 540, z: 1.04 }),
  V(8, "9.02", { cx: 540, z: 1.02, m: 46 }),
  V(8, "9.03", { cx: 540, z: 1.06 }),
  S(8, "end", 2.6, "*КОНЕЦ* ПЕРВОЙ СЕРИИ", { cx: 540, z: 1.0, stamp: "ГОША · СЕРИЯ 1" }),

  V(9, "T.01", { cx: 540, z: 1.04, stamp: "СЛЕДУЮЩАЯ СЕРИЯ" }),
  S(9, "tend", 1.6, "*ПОДПИШИСЬ*, чтобы не пропустить", { cx: 540, z: 1.0 }),
];

export type TB = Beat & { t0: number; d: number; vd: number; i: number; sct0: number; moneyBefore: number; bottles: number; money: number };
export const buildTL = () => {
  let t = 0, m = 0, b = 0;
  const out: TB[] = [];
  const scStart: Record<number, number> = {};
  BEATS.forEach((bt, i) => {
    const vd = bt.line ? (vo as Record<string, number>)[bt.line] : bt.dur!;
    const d = bt.line ? vd + PAD : vd;
    if (scStart[bt.sc] === undefined) scStart[bt.sc] = t;
    const moneyBefore = m;
    if (bt.m !== undefined) m = bt.m;
    if (bt.b !== undefined) b = bt.b;
    out.push({ ...bt, t0: t, d, vd, i, sct0: scStart[bt.sc], moneyBefore, money: m, bottles: b });
    t += d;
  });
  return { beats: out, total: t };
};
export const TL = buildTL();
export const FPS = 30;
export const GOSHA_FRAMES = Math.ceil(TL.total * FPS) + 20;
