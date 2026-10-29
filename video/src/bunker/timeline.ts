import script from "./script.json";
import vo from "./vo.json";

export type Seg = { kind: "chunk" | "card"; id: string; t0: number; d: number; beatW?: number[] };
const GAP = 1.0;
export const wordsDur = (words: number) => words / 2.55 + 0.6;
export const chunkDur = (id: string, words: number) => (vo as Record<string, number>)[id] ?? wordsDur(words);

/** Порядок: интро-карточка, затем главы; карточки вставляются перед указанными кусками */
export const CARDS: Record<string, { title: string; sub?: string; d: number }> = {
  c02: { title: "DAY 0", sub: "THE ALERT", d: 3 },
  c05: { title: "HOUR 1", sub: "THE FALLOUT", d: 3 },
  c07: { title: "NIGHT 1", sub: "FIRST RULES", d: 3 },
  c09: { title: "WEEK 2", sub: "COUNTING DAYS", d: 3 },
  c10: { title: "MONTH 1", sub: "THE MATH OF FOOD", d: 3 },
  c13: { title: "MONTH 2", sub: "THE HARDEST ENEMY", d: 3 },
  c14: { title: "YEAR 1", sub: "NOT YET", d: 3 },
  c16: { title: "YEAR 4", sub: "RENEWABLE FOOD", d: 3 },
  c18: { title: "YEAR 8", sub: "THE HATCH", d: 3 },
  c19: { title: "YEAR 10", sub: "FIRST STEPS OUTSIDE", d: 3 },
  c20: { title: "YEAR 12", sub: "", d: 3 },
  c21: { title: "WHAT WE LEARNED", sub: "8 RULES", d: 3 },
};

export const CARDS_AFTER: Record<string, { title: string; sub?: string; d: number }> = {
  c01: { title: "12 YEARS UNDERGROUND", sub: "HOW TO SURVIVE A NUCLEAR APOCALYPSE", d: 5 },
};

export const buildTimeline = (): { segs: Seg[]; total: number } => {
  const segs: Seg[] = [];
  let t = 0;
  for (const c of script as { id: string; text: string; words: number }[]) {
    const card = CARDS[c.id];
    if (card) { segs.push({ kind: "card", id: c.id, t0: t, d: card.d }); t += card.d; }
    const d = chunkDur(c.id, c.words);
    segs.push({ kind: "chunk", id: c.id, t0: t, d });
    t += d + GAP;
    const after = CARDS_AFTER[c.id];
    if (after) { segs.push({ kind: "card", id: c.id + "_after", t0: t, d: after.d }); t += after.d; }
  }
  return { segs, total: t + 4 };
};
