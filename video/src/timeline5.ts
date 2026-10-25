export const FPS = 30;
export const DURATION_SEC = 60;
export const DURATION_FRAMES = DURATION_SEC * FPS;

export type SceneId = "intro" | "cells" | "freq" | "handover" | "data" | "route" | "final";

export type Scene = {
  id: SceneId;
  start: number;
  end: number;
  label: string;
  caption: string;
};

export const SCENES: Scene[] = [
  { id: "intro", start: 0, end: 5, label: "СОТОВАЯ СВЯЗЬ", caption: "Как работает сотовая связь?" },
  { id: "cells", start: 5, end: 15, label: "ШАГ 1 · СОТЫ", caption: "Город делится на ячейки" },
  { id: "freq", start: 15, end: 25, label: "ШАГ 2 · ЧАСТОТЫ", caption: "Каждая ячейка работает на своих частотах" },
  { id: "handover", start: 25, end: 35, label: "ШАГ 3 · ПЕРЕКЛЮЧЕНИЕ", caption: "Переключение между вышками — handover" },
  { id: "data", start: 35, end: 45, label: "ШАГ 4 · ДАННЫЕ", caption: "Данные идут через сеть базовых станций" },
  { id: "route", start: 45, end: 55, label: "ШАГ 5 · МАРШРУТ", caption: "Сеть сама выбирает лучшую вышку" },
  { id: "final", start: 55, end: 60, label: "ИТОГ", caption: "Сотовая связь — это сеть ячеек и частот" },
];

export type Voice = { file: string; start: number; dur: number; lines: string[] };

export const VOICES: Voice[] = [
  { file: "v1.mp3", start: 0.5, dur: 3.63, lines: ["Как работает сотовая связь?", "Всё начинается с радиоволн."] },
  { file: "v2.mp3", start: 5.6, dur: 4.28, lines: ["Город делится на ячейки.", "Их называют сотами.", "В центре каждой стоит вышка."] },
  {
    file: "v3.mp3",
    start: 15.4,
    dur: 5.07,
    lines: ["Каждая ячейка работает на своих частотах,", "поэтому соседние вышки не мешают друг другу."],
  },
  {
    file: "v4.mp3",
    start: 25.4,
    dur: 6.27,
    lines: ["Когда вы движетесь, сигнал старой вышки слабеет,", "и новая подхватывает соединение.", "Это называется handover."],
  },
  {
    file: "v5.mp3",
    start: 35.4,
    dur: 5.25,
    lines: ["Данные летят к вышке,", "затем по оптоволокну к серверу", "и обратно, за доли секунды."],
  },
  {
    file: "v6.mp3",
    start: 45.4,
    dur: 4.6,
    lines: ["Сеть сама выбирает лучшую вышку", "и строит маршрут для звонка или интернета."],
  },
  { file: "v7.mp3", start: 55.3, dur: 2.85, lines: ["Сотовая связь — это сеть ячеек и частот."] },
];

export const sceneAt = (t: number): Scene =>
  SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
