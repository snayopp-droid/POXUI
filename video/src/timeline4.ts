export const FPS = 30;
export const DURATION_SEC = 100;
export const DURATION_FRAMES = DURATION_SEC * FPS;

export type SceneId =
  | "city"
  | "title"
  | "d1cal"
  | "d1kitchen"
  | "d1phone"
  | "d1tap"
  | "d1tub"
  | "d1battery"
  | "d1door"
  | "d2radio"
  | "d2door"
  | "d2give"
  | "d2threat"
  | "d2rule"
  | "d2cliff"
  | "d3stairs"
  | "d3igor"
  | "d3dead"
  | "d3light"
  | "d3end";

export type Scene = { id: SceneId; start: number; end: number; day: 0 | 1 | 2 | 3; tension: number };

export const SCENES: Scene[] = [
  { id: "city", start: 0, end: 8, day: 0, tension: 0.6 },
  { id: "title", start: 8, end: 12.5, day: 0, tension: 0.6 },
  { id: "d1cal", start: 12.5, end: 16.2, day: 1, tension: 0.3 },
  { id: "d1kitchen", start: 16.2, end: 19.1, day: 1, tension: 0.3 },
  { id: "d1phone", start: 19.1, end: 22.5, day: 1, tension: 0.4 },
  { id: "d1tap", start: 22.5, end: 24.5, day: 1, tension: 0.5 },
  { id: "d1tub", start: 24.5, end: 31.4, day: 1, tension: 0.6 },
  { id: "d1battery", start: 31.4, end: 35.2, day: 1, tension: 0.7 },
  { id: "d1door", start: 35.2, end: 40, day: 1, tension: 1 },
  { id: "d2radio", start: 40, end: 43.9, day: 2, tension: 0.5 },
  { id: "d2door", start: 43.9, end: 49.4, day: 2, tension: 0.6 },
  { id: "d2give", start: 49.4, end: 51.7, day: 2, tension: 0.5 },
  { id: "d2threat", start: 51.7, end: 57.7, day: 2, tension: 1 },
  { id: "d2rule", start: 57.7, end: 62.9, day: 2, tension: 0.6 },
  { id: "d2cliff", start: 62.9, end: 68, day: 2, tension: 0.9 },
  { id: "d3stairs", start: 68, end: 75.4, day: 3, tension: 0.8 },
  { id: "d3igor", start: 75.4, end: 84.4, day: 3, tension: 0.9 },
  { id: "d3dead", start: 84.4, end: 86.4, day: 3, tension: 1 },
  { id: "d3light", start: 86.4, end: 93, day: 3, tension: 0.4 },
  { id: "d3end", start: 93, end: 100, day: 0, tension: 0.7 },
];

export type Who = "narr" | "artem" | "marina" | "alisa" | "igor" | "voice";

export const WHO_NAME: Record<Who, string> = {
  narr: "",
  artem: "АРТЁМ",
  marina: "МАРИНА",
  alisa: "АЛИСА",
  igor: "ИГОРЬ ПЕТРОВИЧ",
  voice: "ГОЛОС ЗА ДВЕРЬЮ",
};
export const WHO_COLOR: Record<Who, string> = {
  narr: "#ffd34a",
  artem: "#ffffff",
  marina: "#ff9ec4",
  alisa: "#9ee0ff",
  igor: "#c8b8a0",
  voice: "#ff6b5e",
};

export type Line = { who: Who; file: string; start: number; dur: number; text: string };

export const LINES: Line[] = [
  { who: "narr", file: "n1.mp3", start: 1.0, dur: 4.2, text: "Четыре сорок четыре. По всему миру гаснет свет." },
  { who: "narr", file: "n2.mp3", start: 5.6, dur: 5.56, text: "Не авария. Не сбой. Энергия просто исчезла. У людей есть три дня." },
  { who: "narr", file: "n3.mp3", start: 13.1, dur: 3.0, text: "День первый. Все уверены, что скоро включат." },
  { who: "artem", file: "a1.mp3", start: 16.3, dur: 2.43, text: "Подстанция, наверное. К обеду дадут." },
  { who: "marina", file: "m1.mp3", start: 19.2, dur: 3.08, text: "Телефон не ловит. Вообще. Ни одной палки." },
  { who: "alisa", file: "k1.mp3", start: 22.6, dur: 1.65, text: "Пап, вода еле идёт." },
  { who: "narr", file: "n4.mp3", start: 24.6, dur: 3.7, text: "Правило первое. Воду набирай в первый час. Потом насосы встанут." },
  { who: "artem", file: "a2.mp3", start: 28.6, dur: 2.59, text: "Ванну, все кастрюли, все бутылки. Быстро!" },
  { who: "marina", file: "m2.mp3", start: 31.5, dur: 3.47, text: "Семь процентов. Это наш последний телефон." },
  { who: "alisa", file: "k2.mp3", start: 36.6, dur: 2.43, text: "Пап... кто-то стучит в дверь." },
  { who: "narr", file: "n6.mp3", start: 40.5, dur: 2.93, text: "День второй. Помощи не будет." },
  { who: "igor", file: "i1.mp3", start: 44.0, dur: 5.07, text: "Артём, у вас есть вода? Хоть пару литров. У жены давление." },
  { who: "marina", file: "m3.mp3", start: 49.5, dur: 2.19, text: "Дай ему. Дай, Артём." },
  { who: "voice", file: "x1.mp3", start: 52.1, dur: 3.4, text: "Откройте. Я знаю, что у вас полная ванна." },
  { who: "artem", file: "a3.mp3", start: 55.7, dur: 1.88, text: "Тихо. Не двигайтесь." },
  { who: "narr", file: "n7.mp3", start: 57.9, dur: 4.52, text: "Правило второе. Делись тем, что можешь отдать. Не тем, что держит тебя в живых." },
  { who: "igor", file: "i2.mp3", start: 63.1, dur: 4.13, text: "Внизу, в подвале, колодец. Идти надо сейчас, пока темно." },
  { who: "narr", file: "n8.mp3", start: 68.4, dur: 3.0, text: "День третий. Последний." },
  { who: "alisa", file: "k3.mp3", start: 72.0, dur: 3.16, text: "Пап, там только вниз. Семнадцать этажей." },
  { who: "igor", file: "i3.mp3", start: 75.6, dur: 4.2, text: "Идите. Я догоню. Вот, возьмите мой фонарь." },
  { who: "artem", file: "a4.mp3", start: 80.0, dur: 1.8, text: "Мы вас не бросим." },
  { who: "igor", file: "i4.mp3", start: 82.2, dur: 1.41, text: "Береги девочку." },
  { who: "alisa", file: "k4.mp3", start: 86.6, dur: 2.12, text: "Пап, смотри. Там свет." },
  { who: "narr", file: "n9.mp3", start: 89.6, dur: 2.93, text: "Причину никто так и не узнал. Пока." },
  { who: "narr", file: "n10.mp3", start: 93.2, dur: 1.72, text: "Это только начало." },
];

export const RULES: { start: number; end: number; num: string; text: string }[] = [
  { start: 24.6, end: 31.4, num: "1", text: "ВОДА — В ПЕРВЫЙ ЧАС" },
  { start: 57.7, end: 62.9, num: "2", text: "ДЕЛИСЬ ИЗЛИШКОМ, А НЕ ВЫЖИВАНИЕМ" },
];

export const sceneAt = (t: number): Scene =>
  SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];

export const speakingAt = (t: number): Line | undefined =>
  LINES.find((l) => t >= l.start && t < l.start + l.dur);
