import { WORDS } from "./wordsF";

export const FPS = 30;
/** озвучка стартует с этой секунды: до неё — шоковый открывающий кадр */
export const OFF = 0.9;
export const VO_FILE = "fura/vo.mp3";

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-яa-z0-9]/g, "");
const WI: number[] = [];
const TOK: string[] = [];
WORDS.forEach((w, i) => {
  const n = norm(w[0]);
  if (n) { WI.push(i); TOK.push(n); }
});

const TOK_START = (phrase: string, occ: number) => {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i + p.length <= TOK.length; i++) {
    let ok = true;
    for (let k = 0; k < p.length; k++) if (TOK[i + k] !== p[k]) { ok = false; break; }
    if (ok) {
      if (seen === occ) return i;
      seen++;
    }
  }
  throw new Error(`phrase not found: ${phrase} #${occ}`);
};
/** индекс первого слова фразы (occ — какое по счёту вхождение) */
export const idx = (phrase: string, occ = 0) => {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i + p.length <= TOK.length; i++) {
    let ok = true;
    for (let k = 0; k < p.length; k++) if (TOK[i + k] !== p[k]) { ok = false; break; }
    if (ok) {
      if (seen === occ) return WI[i];
      seen++;
    }
  }
  throw new Error(`phrase not found: ${phrase} #${occ}`);
};
/** время начала фразы (сек. ролика) */
export const A = (phrase: string, occ = 0) => WORDS[idx(phrase, occ)][1] + OFF;
/** время конца фразы */
export const Z = (phrase: string, occ = 0) => {
  const n = phrase.split(/\s+/).map(norm).filter(Boolean).length;
  const first = TOK_START(phrase, occ);
  return WORDS[WI[first + n - 1]][2] + OFF;
};

export const VO_END = WORDS[WORDS.length - 1][2] + OFF;
export const END_CARD = 4.2;
export const DURATION_SEC = Math.ceil((VO_END + END_CARD) * FPS) / FPS;
export const DURATION_FRAMES = Math.ceil((VO_END + END_CARD) * FPS);

export type SceneId =
  | "hookSplat" | "hookMoney" | "title" | "rewind"
  | "roadWide" | "truckLogo" | "danilaCard" | "cabSleep" | "smoke" | "late" | "cargo" | "cargoTotal"
  | "call" | "wife" | "hangup" | "whisperGo" | "driving" | "distracted" | "phoneFall" | "screech" | "skid" | "crashHit"
  | "ditch" | "spill" | "climbOut" | "bloody" | "realize" | "lastWhisper"
  | "morningCard" | "pavilion" | "nurlanCard" | "apples" | "invest" | "aigul" | "aigulSays" | "nurlanSays"
  | "missed" | "frown" | "dialing" | "part2Card" | "emptyShop" | "pacingCall" | "nurlanShouts" | "operator" | "lower"
  | "maratEnters" | "maratSpeech" | "nurlanFist" | "maratOffer" | "maratOffer2" | "refusal" | "maratWait" | "maratLeaves"
  | "aigulCries" | "lookShelves" | "ruslanCall" | "storm" | "nextEp" | "endCard";

export type SceneDef = { id: SceneId; t0: number };

/** сцены привязаны к словам озвучки, а не к секундам — переживают перегенерацию голоса */
export const SCENES: SceneDef[] = [
  { id: "hookSplat", t0: 0 },
  { id: "hookMoney", t0: A("Три миллиона") },
  { id: "title", t0: A("Точка невозврата") },
  { id: "rewind", t0: A("Но давай по порядку") },
  { id: "roadWide", t0: A("Ночь Трасса") },
  { id: "truckLogo", t0: A("На обочине стоит") },
  { id: "danilaCard", t0: A("Рядом с ним Данила") },
  { id: "cabSleep", t0: A("В кабине спит напарник") },
  { id: "smoke", t0: A("Данила нервно курит") },
  { id: "late", t0: A("Он опаздывает") },
  { id: "cargo", t0: A("В кузове скоропортящийся") },
  { id: "cargoTotal", t0: A("Три миллиона тенге") },
  { id: "call", t0: A("Данила достаёт телефон") },
  { id: "wife", t0: A("На заднем фоне голос жены") },
  { id: "hangup", t0: A("Данила сбрасывает звонок") },
  { id: "whisperGo", t0: A("Шепчет себе под нос") },
  { id: "driving", t0: A("Он трогается") },
  { id: "distracted", t0: A("На секунду Данила отвлекается") },
  { id: "phoneFall", t0: A("Телефон падает вниз") },
  { id: "screech", t0: A("Визг тормозов") },
  { id: "skid", t0: A("Резкий поворот руля") },
  { id: "crashHit", t0: A("Грохот") },
  { id: "ditch", t0: A("Фура лежит на боку") },
  { id: "spill", t0: A("Из кузова вываливаются") },
  { id: "climbOut", t0: A("Данила выбирается из кабины") },
  { id: "bloody", t0: A("Лицо в крови") },
  { id: "realize", t0: A("Но страшно ему") },
  { id: "lastWhisper", t0: A("Нурлан Я всё сломал", 1) },
  { id: "morningCard", t0: A("Утро Рынок") },
  { id: "pavilion", t0: A("Солнце бьёт") },
  { id: "nurlanCard", t0: A("Нурлан Двадцать восемь") },
  { id: "apples", t0: A("Он расставляет ящики") },
  { id: "invest", t0: A("Он вложил в него всё") },
  { id: "aigul", t0: A("Рядом суетится жена") },
  { id: "aigulSays", t0: A("Нурлан ты только посмотри") },
  { id: "nurlanSays", t0: A("Нурлан улыбается") },
  { id: "missed", t0: A("Он достаёт телефон Десять") },
  { id: "frown", t0: A("Нурлан хмурится") },
  { id: "dialing", t0: A("Он набирает номер") },
  { id: "part2Card", t0: A("Часть вторая") },
  { id: "emptyShop", t0: A("Народ уже пошёл") },
  { id: "pacingCall", t0: A("Нурлан нервно ходит") },
  { id: "nurlanShouts", t0: A("Что значит") },
  { id: "operator", t0: A("Голос в трубке") },
  { id: "lower", t0: A("Нурлан медленно опускает") },
  { id: "maratEnters", t0: A("В этот момент в павильон") },
  { id: "maratSpeech", t0: A("Нурлан брат Слышал") },
  { id: "nurlanFist", t0: A("Нурлан молчит") },
  { id: "maratOffer", t0: A("Ты брал кредит") },
  { id: "maratOffer2", t0: A("Слушай моё предложение") },
  { id: "refusal", t0: A("Нурлан поднимает на него глаза") },
  { id: "maratWait", t0: A("Марат усмехается") },
  { id: "maratLeaves", t0: A("Марат уходит") },
  { id: "aigulCries", t0: A("Что теперь Нурлан") },
  { id: "lookShelves", t0: A("Нурлан смотрит на пустые") },
  { id: "ruslanCall", t0: A("Он достаёт телефон и находит") },
  { id: "storm", t0: A("Над городом собирается гроза") },
  { id: "nextEp", t0: A("В следующей серии") },
  { id: "endCard", t0: A("Точка невозврата Конец") },
];

export const sceneAt = (t: number) => {
  let i = 0;
  SCENES.forEach((s, k) => {
    if (t >= s.t0) i = k;
  });
  const sc = SCENES[i];
  const end = i < SCENES.length - 1 ? SCENES[i + 1].t0 : DURATION_SEC;
  return { sc, idx: i, lt: t - sc.t0, dur: end - sc.t0 };
};

/** кто сейчас говорит — для движения рта. Реплики привязаны к фразам озвучки. */
export type Speaker = "danila" | "wife" | "nurlan" | "aigul" | "marat" | "operator" | "ruslan" | "machine";
export const LINES: { who: Speaker; from: string; to: string; occ?: number; occTo?: number }[] = [
  { who: "danila", from: "Нурлан брат я на связи", to: "но я аккуратно" },
  { who: "wife", from: "Опять этот Нурлан", to: "когда будешь" },
  { who: "danila", from: "Сейчас сейчас", to: "Главное доехать" },
  { who: "danila", from: "Нурлан Я всё сломал", to: "Нурлан Я всё сломал", occ: 1, occTo: 1 },
  { who: "aigul", from: "Нурлан ты только посмотри", to: "всё пойдёт" },
  { who: "nurlan", from: "Всё пойдёт родная", to: "зелень брать будут" },
  { who: "nurlan", from: "Странно Данила обычно", to: "на связи" },
  { who: "machine", from: "Абонент не отвечает", to: "Абонент не отвечает" },
  { who: "nurlan", from: "Что значит", to: "на три миллиона" },
  { who: "operator", from: "Мы узнаем обстоятельства", to: "форс-мажор" },
  { who: "marat", from: "Нурлан брат Слышал", to: "а у тебя хаос" },
  { who: "marat", from: "Ты брал кредит", to: "кредит закроешь" },
  { who: "nurlan", from: "Я не продаюсь", to: "Я не продаюсь" },
  { who: "marat", from: "Пока не продаёшь", to: "будет уже другой" },
  { who: "aigul", from: "Что теперь Нурлан", to: "делать будем" },
  { who: "ruslan", from: "Здорово Руслан", to: "Срочно" },
];
const speakTimes = LINES.map((l) => ({ who: l.who, a: A(l.from, l.occ ?? 0), z: Z(l.to, l.occTo ?? 0) }));
/** амплитуда речи (0..1) для персонажа в момент t */
export const talking = (who: Speaker, t: number) => {
  const s = speakTimes.find((x) => x.who === who && t >= x.a - 0.02 && t <= x.z + 0.1);
  return s ? 1 : 0;
};
export const speakTimesOf = (who: Speaker) => speakTimes.filter((x) => x.who === who);
