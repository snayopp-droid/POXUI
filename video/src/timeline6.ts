export const FPS = 30;

export type Who = "narr" | "stepa" | "bot" | "realtor" | "luda" | "granny" | "dima" | "kid" | "supplier";

export const WHO_NAME: Record<Who, string> = {
  narr: "",
  stepa: "СТЕПА",
  bot: "КОФЕБОТ",
  realtor: "РИЕЛТОР",
  luda: "ТЁТЯ ЛЮДА",
  granny: "БАБУШКА",
  dima: "ДИМА",
  kid: "ШКОЛЬНИКИ",
  supplier: "ПОСТАВЩИК",
};

export const WHO_COLOR: Record<Who, string> = {
  narr: "#ffd34a",
  stepa: "#ffb066",
  bot: "#5ec8ff",
  realtor: "#c8d6ff",
  luda: "#e0a0ff",
  granny: "#ff9ec4",
  dima: "#8affb0",
  kid: "#9ee0ff",
  supplier: "#9fe3ff",
};

type Raw = { id: string; who: Who; dur: number; text: string; ep: number };

const RAW: Raw[] = [
  { id: "n1", who: "narr", dur: 2.04, ep: 1, text: "Серия первая. Капитал." },
  { id: "s1", who: "stepa", dur: 5.25, ep: 1, text: "Триста тысяч! Всё, хватит! Открываю кофейню!" },
  { id: "s2", who: "stepa", dur: 3.0, ep: 1, text: "Кофебот, сколько нужно на кофейню?" },
  { id: "b1", who: "bot", dur: 5.49, ep: 1, text: "Ты серьёзно? Ладно. Минимум миллион. Но можно начать с гаража." },
  { id: "n2", who: "narr", dur: 2.59, ep: 2, text: "Серия вторая. Поиск помещения." },
  { id: "r1", who: "realtor", dur: 5.15, ep: 2, text: "Подвал с плесенью. Бывший ларёк. И вот это: маленькое, зато с окном." },
  { id: "s3", who: "stepa", dur: 4.36, ep: 2, text: "Я вам кофе бесплатно сделаю! На целый год!" },
  { id: "r2", who: "realtor", dur: 3.87, ep: 2, text: "Ха-ха. Ладно уж. Скидка десять процентов." },
  { id: "b2", who: "bot", dur: 2.04, ep: 2, text: "Поздравляю. Теперь ты должник." },
  { id: "n3", who: "narr", dur: 2.93, ep: 3, text: "Серия третья. Ремонт и первая покупка." },
  { id: "s4", who: "stepa", dur: 3.79, ep: 3, text: "Обои падают! А кофемашина плюётся!" },
  { id: "b3", who: "bot", dur: 2.93, ep: 3, text: "Дизайн от нейросети: лофт с кактусами." },
  { id: "l1", who: "luda", dur: 2.43, ep: 3, text: "Ты уверен, что это кофейня, а не склад?" },
  { id: "s5", who: "stepa", dur: 1.96, ep: 3, text: "Это стиль!" },
  { id: "n4", who: "narr", dur: 2.59, ep: 4, text: "Серия четвёртая. Первый клиент." },
  { id: "g1", who: "granny", dur: 2.04, ep: 4, text: "Мне просто водички, сынок." },
  { id: "g2", who: "granny", dur: 1.96, ep: 4, text: "Фу! Горько!" },
  { id: "d1", who: "dima", dur: 3.08, ep: 4, text: "Я же говорил, надо было капучино." },
  { id: "g3", who: "granny", dur: 2.85, ep: 4, text: "Дайте этот ваш горький, но с молоком." },
  { id: "s6", who: "stepa", dur: 3.0, ep: 4, text: "Первая касса! Триста рублей!" },
  { id: "n5", who: "narr", dur: 2.04, ep: 5, text: "Серия пятая. Поставщики." },
  { id: "s7", who: "stepa", dur: 4.28, ep: 5, text: "«Кофе, не для продажи»! А внутри чай!" },
  { id: "p1", who: "supplier", dur: 3.97, ep: 5, text: "Приносим извинения. Высылаем два мешка зерна в подарок." },
  { id: "s8", who: "stepa", dur: 3.55, ep: 5, text: "Теперь я читаю отзывы перед покупкой." },
  { id: "n6", who: "narr", dur: 1.96, ep: 6, text: "Серия шестая. Конкурент." },
  { id: "s9", who: "stepa", dur: 4.44, ep: 6, text: "Напротив кофейня дяди Гены! Скидки! Вывеска огромная!" },
  { id: "b4", who: "bot", dur: 1.96, ep: 6, text: "Назови кофе именами клиентов." },
  { id: "s10", who: "stepa", dur: 3.16, ep: 6, text: "Капучино для Оли! Латте для Димы!" },
  { id: "n7", who: "narr", dur: 2.59, ep: 7, text: "Серия седьмая. Вирусный маркетинг." },
  { id: "s11", who: "stepa", dur: 5.25, ep: 7, text: "Моя машина взорвалась пеной, а видео собрало сто тысяч просмотров!" },
  { id: "k1", who: "kid", dur: 2.69, ep: 7, text: "Дайте тот самый взрывной кофе!" },
  { id: "s12", who: "stepa", dur: 4.05, ep: 7, text: "Встречайте: взрывной латте с маршмеллоу!" },
  { id: "l2", who: "luda", dur: 3.47, ep: 7, text: "Ты хоть налоги платишь?" },
  { id: "n8", who: "narr", dur: 2.04, ep: 8, text: "Серия восьмая. Кризис." },
  { id: "s13", who: "stepa", dur: 4.83, ep: 8, text: "Ремонт машины пятьдесят тысяч. А касса пуста." },
  { id: "b5", who: "bot", dur: 3.24, ep: 8, text: "Краудфандинг. Попроси клиентов скинуться." },
  { id: "s14", who: "stepa", dur: 3.63, ep: 8, text: "Скиньтесь на кофемашину, и год бесплатного сиропа!" },
  { id: "n9", who: "narr", dur: 3.08, ep: 9, text: "Серия девятая. Оптимизация." },
  { id: "b6", who: "bot", dur: 3.71, ep: 9, text: "Расписание готово: Степа работает двадцать пять часов в сутки." },
  { id: "s15", who: "stepa", dur: 3.87, ep: 9, text: "Сегодня день самообслуживания! Платите по совести!" },
  { id: "s16", who: "stepa", dur: 3.08, ep: 9, text: "Выручка больше, чем обычно?!" },
  { id: "n10", who: "narr", dur: 2.19, ep: 10, text: "Серия десятая. Год спустя." },
  { id: "l3", who: "luda", dur: 2.35, ep: 10, text: "Поздравляю. Ты вышел в плюс." },
  { id: "s17", who: "stepa", dur: 2.51, ep: 10, text: "Ну что, открываем вторую точку?" },
  { id: "b7", who: "bot", dur: 2.51, ep: 10, text: "Только если ты сначала выспишься." },
  { id: "n11", who: "narr", dur: 6.84, ep: 10, text: "Степа заработал не только деньги, но и постоянных клиентов. И даже бабушку, которая теперь пьёт только флэт уайт." },
];

// пауза после последней реплики серии (для визуальной развязки)
const TAIL: Record<number, number> = { 1: 2.4, 2: 0.7, 3: 1.2, 4: 1.2, 5: 0.7, 6: 2.0, 7: 1.0, 8: 2.0, 9: 1.4, 10: 0.2 };

export type Line = Raw & { start: number; end: number; file: string };

const build = () => {
  let cursor = 0.4;
  const out: Line[] = [];
  RAW.forEach((r, i) => {
    const prev = RAW[i - 1];
    const epChange = prev && prev.ep !== r.ep;
    if (epChange) cursor += TAIL[prev.ep];
    const gap = r.who === "narr" && r.id !== "n11" ? 0.25 : epChange ? 0.25 : 0.22;
    const start = i === 0 ? cursor : cursor + gap;
    out.push({ ...r, start, end: start + r.dur, file: `${r.id}.mp3` });
    cursor = start + r.dur;
  });
  return { out, end: cursor + 1.8 };
};

const built = build();
export const LINES = built.out;
export const DURATION_SEC = Math.ceil(built.end * FPS) / FPS;
export const DURATION_FRAMES = Math.ceil(built.end * FPS);

export const lineOf = (id: string) => LINES.find((l) => l.id === id)!;
export const startOf = (id: string) => lineOf(id).start;
export const endOf = (id: string) => lineOf(id).end;

export type Episode = { n: number; title: string; start: number; end: number };

const EP_TITLES = ["Капитал", "Поиск помещения", "Ремонт и первая покупка", "Первый клиент", "Поставщики", "Конкурент", "Вирусный маркетинг", "Кризис", "Оптимизация", "Год спустя"];

export const EPISODES: Episode[] = EP_TITLES.map((title, i) => {
  const first = LINES.find((l) => l.ep === i + 1)!;
  const nextFirst = LINES.find((l) => l.ep === i + 2);
  return { n: i + 1, title, start: i === 0 ? 0 : first.start - 0.25, end: nextFirst ? nextFirst.start - 0.25 : DURATION_SEC };
});

export const episodeAt = (t: number): Episode => EPISODES.find((e) => t >= e.start && t < e.end) ?? EPISODES[EPISODES.length - 1];
export const lineAt = (t: number): Line | undefined => LINES.find((l) => t >= l.start && t < l.end);

export type BalanceEvent = { at: number; delta: number; label: string };

const ev = (id: string, off: number, delta: number, label: string): BalanceEvent => ({ at: startOf(id) + off, delta, label });

export const BALANCE_EVENTS: BalanceEvent[] = [
  ev("s1", 0.3, 300000, "ФРИЛАНС + СТАВКА"),
  ev("r2", 0.4, -90000, "АРЕНДА И ЗАЛОГ"),
  ev("s4", 1.4, -130000, "РЕМОНТ + МАШИНА"),
  ev("g2", 0.2, -50000, "ЗАПАСЫ"),
  ev("s6", 1.0, 300, "ПЕРВАЯ КАССА"),
  ev("s7", 0.3, -25000, "ЗЕРНО НЕ ПРИШЛО"),
  ev("s10", 2.6, 9000, "КЛИЕНТЫ ВЕРНУЛИСЬ"),
  ev("s12", 2.6, 36000, "ВЗРЫВНОЙ ЛАТТЕ"),
  ev("s13", 0.3, -41000, "АРЕНДА И ЗАРПЛАТА"),
  ev("s14", 1.8, 30000, "КЛИЕНТЫ СКИНУЛИСЬ"),
  ev("s14", 3.8, 20000, "СТЕПА ДОБАВИЛ"),
  ev("s14", 5.2, -50000, "НОВАЯ МАШИНА"),
  ev("s16", 0.5, 18000, "САМООБСЛУЖИВАНИЕ"),
  ev("l3", 0.4, 385000, "ЗА ГОД"),
];
