export const FPS = 30;
export const DURATION_SEC = 60;
export const DURATION_FRAMES = DURATION_SEC * FPS;

export type SceneId = "hook" | "stakes" | "r1" | "r2" | "r3" | "r4" | "r5" | "outro";

export type Scene = {
  id: SceneId;
  start: number;
  end: number;
  rule?: { num: string; title: string };
  tension: number;
};

export const SCENES: Scene[] = [
  { id: "hook", start: 0, end: 5.4, tension: 0.5 },
  { id: "stakes", start: 5.4, end: 10, tension: 0.6 },
  { id: "r1", start: 10, end: 18, rule: { num: "I", title: "НЕ БЕГИ" }, tension: 0.9 },
  { id: "r2", start: 18, end: 24.5, rule: { num: "II", title: "ИДИ В ВОДУ" }, tension: 0.8 },
  { id: "r3", start: 24.5, end: 33, rule: { num: "III", title: "ОГОНЬ" }, tension: 0.7 },
  { id: "r4", start: 33, end: 41, rule: { num: "IV", title: "СПИНОЙ К СКАЛЕ" }, tension: 1 },
  { id: "r5", start: 41, end: 50, rule: { num: "V", title: "НЕ СПИ" }, tension: 0.85 },
  { id: "outro", start: 50, end: 60, tension: 0.4 },
];

export type Voice = { file: string; start: number; dur: number; lines: string[] };

export const VOICES: Voice[] = [
  { file: "vo-hook.mp3", start: 0.4, dur: 4.9, lines: ["Ты один в лесу.", "Ночь.", "И за тобой идёт стая."] },
  {
    file: "vo-stakes.mp3",
    start: 5.7,
    dur: 4.28,
    lines: ["Волки будут здесь через три минуты.", "Запомни пять правил,", "или не доживёшь до рассвета."],
  },
  {
    file: "vo-r1.mp3",
    start: 10.5,
    dur: 7.08,
    lines: ["Правило первое.", "Не беги!", "Волк быстрее тебя.", "Бегущий — это добыча.", "Отступай шагом,", "не отводя глаз."],
  },
  {
    file: "vo-r2.mp3",
    start: 18.5,
    dur: 4.6,
    lines: ["Правило второе.", "Иди в воду.", "Ручей смывает запах.", "Они потеряют след."],
  },
  {
    file: "vo-r3.mp3",
    start: 25.0,
    dur: 7.31,
    lines: ["Правило третье.", "Огонь.", "Сухая кора, берёста,", "одна искра.", "Пока горит костёр,", "они не подойдут."],
  },
  {
    file: "vo-r4.mp3",
    start: 33.5,
    dur: 6.27,
    lines: ["Правило четвёртое.", "Встань спиной к скале.", "Атаковать смогут", "только спереди.", "Возьми палку — и стой."],
  },
  {
    file: "vo-r5.mp3",
    start: 41.5,
    dur: 7.89,
    lines: ["Правило пятое.", "Не спи.", "Они ждут,", "пока погаснет огонь.", "Подбрасывай ветки", "до рассвета."],
  },
  {
    file: "vo-outro.mp3",
    start: 50.6,
    dur: 6.19,
    lines: ["Рассвет.", "Ты выжил.", "Но вой раздался снова.", "Со стороны ручья."],
  },
];

export const sceneAt = (t: number): Scene =>
  SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
