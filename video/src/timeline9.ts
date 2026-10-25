export const FPS = 30;
export const SCENE_STARTS = [0, 8, 16, 24, 32, 40, 48];
export const DURATION_SEC = 60;
export const DURATION_FRAMES = DURATION_SEC * FPS;

export type Who = "bab" | "otec" | "syn" | "titr";
export const WHO_NAME: Record<Who, string> = { bab: "БАБУШКА", otec: "ОТЕЦ", syn: "СЫН", titr: "" };
export const WHO_COLOR: Record<Who, string> = { bab: "#ffb27a", otec: "#9fd0ff", syn: "#9affc0", titr: "#ffd36a" };

// единственный голос ElevenLabs читает все реплики; кто говорит — показано подписью
export type Line = { id: string; who: Who; start: number; dur: number; text: string; file: string };
const L = (id: string, who: Who, start: number, dur: number, text: string): Line => ({ id, who, start, dur, text, file: `${id}.mp3` });

export const LINES: Line[] = [
  L("k1", "bab", 1.4, 1.96, "Слушай горы."),
  L("k2", "titr", 4.0, 3.08, "Родиться чеченцем — услышать горы раньше слов."),
  L("k3", "otec", 17.0, 1.72, "Что главное?"),
  L("k4", "syn", 19.0, 1.65, "Уважение."),
  L("k5", "titr", 21.4, 2.59, "Традиции — не клетка. Корни."),
  L("k6", "titr", 33.4, 2.43, "Можно жить в мегаполисе — и оставаться собой."),
  L("k7", "syn", 42.6, 2.35, "А мы вернёмся?"),
  L("k8", "otec", 45.2, 1.72, "Ты всегда там, где твои корни."),
  L("k9", "titr", 55.0, 3.0, "Сделано ИИ. С любовью к культуре."),
];

export const lineAt = (t: number) => LINES.find((l) => t >= l.start && t < l.start + l.dur);
