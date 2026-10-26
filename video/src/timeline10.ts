export const FPS = 30;

export type Line = { id: string; start: number; dur: number; end: number; text: string; file: string };

// диктор — Nikolay (ElevenLabs), все реплики одним голосом
const RAW = [
  { id: "h1", dur: 2.35, text: "Я остался один в лесу." },
  { id: "h2", dur: 2.51, text: "Пять правил, которые спасут тебе жизнь." },
  { id: "r1", dur: 7.0, text: "Правило первое. Остановись. Паника убивает быстрее, чем лес. Сядь, продышись и не броди кругами." },
  { id: "r2", dur: 6.84, text: "Правило второе. Тепло. Без огня холод убивает за три часа. Собери сухие ветки и сделай шалаш." },
  { id: "r3", dur: 7.47, text: "Правило третье. Вода. Найди ручей и иди вниз по течению — оно выведет к людям. Пей только кипячёную." },
  { id: "r4", dur: 6.53, text: "Правило четвёртое. Сигнал. Три огня, три свистка, яркая одежда. Днём дым, ночью свет." },
  { id: "r5", dur: 7.16, text: "Правило пятое. Не ешь незнакомое. Без еды живут три недели, а одна ягода может убить за час." },
  { id: "e1", dur: 3.0, text: "Запомни их. И сохрани, пока не пригодилось." },
];

const GAP = 0.3;
const build = () => {
  let cursor = 0.3;
  const out: Line[] = [];
  RAW.forEach((r, i) => {
    const start = i === 0 ? cursor : cursor + GAP;
    out.push({ ...r, start, end: start + r.dur, file: `${r.id}.mp3` });
    cursor = start + r.dur;
  });
  return { out, end: cursor + 1.8 };
};
const built = build();
export const LINES = built.out;
export const DURATION_SEC = Math.ceil(built.end * FPS) / FPS;
export const DURATION_FRAMES = Math.ceil(built.end * FPS);
export const startOf = (id: string) => LINES.find((l) => l.id === id)!.start;
export const lineAt = (t: number) => LINES.find((l) => t >= l.start && t < l.end);
export const sceneAt = (t: number) => {
  let idx = 0;
  LINES.forEach((l, i) => { if (t >= l.start - GAP + 0.02) idx = i; });
  const sceneStart = idx === 0 ? 0 : LINES[idx].start - GAP + 0.02;
  const sceneEnd = idx < LINES.length - 1 ? LINES[idx + 1].start - GAP + 0.02 : DURATION_SEC;
  return { idx, sceneStart, sceneEnd };
};
