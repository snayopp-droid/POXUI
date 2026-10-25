export const FPS = 30;

type Raw = { id: string; dur: number; text: string };

// единственный голос — все реплики читает один диктор
const RAW: Raw[] = [
  { id: "z1", dur: 3.08, text: "Ночь четвёртая. Город мёртв, но не тих." },
  { id: "z2", dur: 2.77, text: "Гена сидит на девятом этаже и слушает рацию." },
  { id: "z3", dur: 4.05, text: "Канал семь. Голос в эфире: «Не отвечай. Сначала три правила»." },
  { id: "z4", dur: 2.19, text: "Правило первое. Тишина." },
  { id: "z5", dur: 4.52, text: "Они не видят. Они слышат. Любой звук для них — ужин." },
  { id: "z6", dur: 2.85, text: "Банка упала во дворе. Через минуту там сорок." },
  { id: "z7", dur: 2.51, text: "Правило второе. Никакого света." },
  { id: "z8", dur: 4.83, text: "Одно окно со свечой видно за километр. Свеча — это маяк." },
  { id: "z9", dur: 1.88, text: "Правило третье. Проверка." },
  { id: "z10", dur: 5.49, text: "Живой назовёт пароль. «Кордон?» — «Заслон». Мёртвый только стонет." },
  { id: "z11", dur: 6.53, text: "Гена жмёт кнопку. «Кордон?» В ответ — тишина. Потом хрип." },
  { id: "z12", dur: 3.32, text: "Голос в эфире: «Ты отошёл от стекла на два шага, Гена. Это не помогает»." },
  { id: "z13", dur: 3.32, text: "На площадке за дверью шаги. Много шагов." },
  { id: "z14", dur: 2.19, text: "Остался один выход. Крыша." },
  { id: "z15", dur: 6.03, text: "Конец первой части. Следующая — «Лестница». Подпишись, чтобы не пропустить." },
];

export type Line = Raw & { start: number; end: number; file: string };

const GAP = 0.28;
const build = () => {
  let cursor = 0.3;
  const out: Line[] = [];
  RAW.forEach((r, i) => {
    const start = i === 0 ? cursor : cursor + GAP;
    out.push({ ...r, start, end: start + r.dur, file: `${r.id}.mp3` });
    cursor = start + r.dur;
  });
  return { out, end: cursor + 1.6 };
};

const built = build();
export const LINES = built.out;
export const DURATION_SEC = Math.ceil(built.end * FPS) / FPS;
export const DURATION_FRAMES = Math.ceil(built.end * FPS);

export const lineOf = (id: string) => LINES.find((l) => l.id === id)!;
export const startOf = (id: string) => lineOf(id).start;
export const endOf = (id: string) => lineOf(id).end;

// сцена меняется чуть раньше реплики (резкий монтаж)
export const sceneAt = (t: number): { line: Line; idx: number } => {
  let idx = 0;
  LINES.forEach((l, i) => {
    if (t >= l.start - GAP + 0.02) idx = i;
  });
  return { line: LINES[idx], idx };
};
export const lineAt = (t: number): Line | undefined => LINES.find((l) => t >= l.start && t < l.end);
