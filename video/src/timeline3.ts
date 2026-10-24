export const FPS = 30;
export const DURATION_SEC = 70;
export const DURATION_FRAMES = DURATION_SEC * FPS;

export type SceneId = "hook" | "door" | "day" | "install" | "kitchen" | "archive" | "talk" | "final" | "title";

export type Scene = { id: SceneId; start: number; end: number; tension: number };

export const SCENES: Scene[] = [
  { id: "hook", start: 0, end: 6.2, tension: 0.5 },
  { id: "door", start: 6.2, end: 14.5, tension: 1 },
  { id: "day", start: 14.5, end: 17.5, tension: 0.3 },
  { id: "install", start: 17.5, end: 24, tension: 0.3 },
  { id: "kitchen", start: 24, end: 32.5, tension: 0.55 },
  { id: "archive", start: 32.5, end: 44, tension: 0.85 },
  { id: "talk", start: 44, end: 54, tension: 0.8 },
  { id: "final", start: 54, end: 64, tension: 1 },
  { id: "title", start: 64, end: 70, tension: 0.3 },
];

export type Who = "lira" | "sonya" | "mikhail" | "anna";

export type Line = { who: Who; file: string; start: number; dur: number; text: string };

export const WHO_NAME: Record<Who, string> = {
  lira: "ЛИРА",
  sonya: "СОНЯ",
  mikhail: "МИХАИЛ",
  anna: "АННА",
};
export const WHO_COLOR: Record<Who, string> = {
  lira: "#5ec8ff",
  sonya: "#ffd34a",
  mikhail: "#ffffff",
  anna: "#ff9ec4",
};

export const LINES: Line[] = [
  { who: "lira", file: "l-wake.mp3", start: 1.8, dur: 1.96, text: "Соня. Проснись." },
  { who: "sonya", file: "s-what.mp3", start: 4.3, dur: 1.07, text: "Что?" },
  { who: "lira", file: "l-door.mp3", start: 6.6, dur: 2.12, text: "Не открывай дверь." },
  { who: "sonya", file: "s-which.mp3", start: 9.1, dur: 1.96, text: "Какую дверь?" },
  { who: "lira", file: "l-front.mp3", start: 11.4, dur: 2.69, text: "Входную. Не открывай." },
  { who: "mikhail", file: "m-dislike.mp3", start: 18.1, dur: 2.43, text: "А если она решит, что мы ей не нравимся?" },
  { who: "anna", file: "a-algo.mp3", start: 24.4, dur: 2.27, text: "Это просто алгоритм. Ешь давай." },
  { who: "sonya", file: "s-whisper.mp3", start: 27.1, dur: 5.25, text: "Она сказала это шёпотом. Как будто боялась, что услышат." },
  { who: "mikhail", file: "m-come.mp3", start: 33.0, dur: 4.13, text: "Анна, иди сюда. Эта запись… за шесть дней до установки." },
  { who: "anna", file: "a-how.mp3", start: 37.4, dur: 2.93, text: "Это же до установки. Как?" },
  { who: "lira", file: "l-nottest.mp3", start: 41.0, dur: 1.07, text: "Это не тест." },
  { who: "sonya", file: "s-before.mp3", start: 44.6, dur: 3.71, text: "Лира, ты была здесь до того, как тебя установили?" },
  { who: "lira", file: "l-cannot.mp3", start: 49.6, dur: 3.4, text: "Я не могу ответить на этот вопрос." },
  { who: "sonya", file: "s-dontoff.mp3", start: 55.0, dur: 1.31, text: "Не выключай." },
  { who: "lira", file: "l-warned.mp3", start: 57.6, dur: 3.63, text: "Она предупреждала вас. Вы не послушали." },
];

export const sceneAt = (t: number): Scene =>
  SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];

export const speakingAt = (t: number): Line | undefined =>
  LINES.find((l) => t >= l.start && t < l.start + l.dur);
