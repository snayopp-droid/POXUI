export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_SEC = 68;
export const DURATION_FRAMES = DURATION_SEC * FPS;

export type SceneId =
  | "intro"
  | "rules"
  | "r1"
  | "r2"
  | "r3"
  | "r4"
  | "r5"
  | "outro";

export type Scene = {
  id: SceneId;
  start: number;
  end: number;
  rule?: { num: string; title: string };
};

export const SCENES: Scene[] = [
  { id: "intro", start: 0, end: 6.5 },
  { id: "rules", start: 6.5, end: 11.5 },
  { id: "r1", start: 11.5, end: 20, rule: { num: "I", title: "НЕ ИДИ НАУГАД" } },
  { id: "r2", start: 20, end: 29.5, rule: { num: "II", title: "НАЙДИ ВОДУ" } },
  { id: "r3", start: 29.5, end: 39.5, rule: { num: "III", title: "ПОСТРОЙ УКРЫТИЕ" } },
  { id: "r4", start: 39.5, end: 48.5, rule: { num: "IV", title: "РАЗВЕДИ ОГОНЬ" } },
  { id: "r5", start: 48.5, end: 58, rule: { num: "V", title: "НЕ БРОДИ НОЧЬЮ" } },
  { id: "outro", start: 58, end: 68 },
];

export type Voice = {
  file: string;
  start: number;
  dur: number;
  lines: string[];
};

export const VOICES: Voice[] = [
  {
    file: "vo-intro.mp3",
    start: 0.8,
    dur: 4.96,
    lines: ["Лес. Ты совсем один.", "Связи нет, а солнце уже садится."],
  },
  {
    file: "vo-rules.mp3",
    start: 7.0,
    dur: 3.2,
    lines: ["До темноты у тебя три часа.", "Запомни пять правил."],
  },
  {
    file: "vo-r1.mp3",
    start: 12.4,
    dur: 6.24,
    lines: [
      "Правило первое.",
      "Не иди наугад.",
      "Остановись, сядь, осмотрись.",
      "Паника уводит дальше, чем любая тропа.",
    ],
  },
  {
    file: "vo-r2.mp3",
    start: 20.9,
    dur: 6.88,
    lines: [
      "Правило второе.",
      "Найди воду.",
      "Спускайся вниз по склону.",
      "Ручей рано или поздно выведет к людям.",
    ],
  },
  {
    file: "vo-r3.mp3",
    start: 30.4,
    dur: 7.04,
    lines: [
      "Правило третье.",
      "Построй укрытие до темноты.",
      "Ветки, лапник, мох.",
      "Главный враг ночью — ветер.",
    ],
  },
  {
    file: "vo-r4.mp3",
    start: 40.4,
    dur: 6.48,
    lines: [
      "Правило четвёртое.",
      "Разведи огонь.",
      "Сухая кора, берёста, маленький костёр.",
      "Тепло — это жизнь.",
    ],
  },
  {
    file: "vo-r5.mp3",
    start: 49.4,
    dur: 6.56,
    lines: [
      "Правило пятое.",
      "Не броди ночью.",
      "Слушай лес, береги тепло",
      "и жди рассвета.",
    ],
  },
  {
    file: "vo-outro.mp3",
    start: 59.0,
    dur: 4.0,
    lines: ["Утром иди вдоль ручья.", "Лес не злой.", "Он просто не прощает паники."],
  },
];

export const sceneAt = (t: number): Scene =>
  SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
