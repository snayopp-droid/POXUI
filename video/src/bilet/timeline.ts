import { VO_TOTAL, WORDS } from "../wordsB";

export const FPS = 30;
export const VO_FILE = "bilet/vo.mp3";

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-яa-z0-9]/g, "");
const WI: number[] = [];
const TOK: string[] = [];
WORDS.forEach((w, i) => {
  const n = norm(w[0]);
  if (n) {
    WI.push(i);
    TOK.push(n);
  }
});
const find = (phrase: string, occ: number) => {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i + p.length <= TOK.length; i++) {
    let ok = true;
    for (let k = 0; k < p.length; k++)
      if (TOK[i + k] !== p[k]) {
        ok = false;
        break;
      }
    if (ok) {
      if (seen === occ) return { i, n: p.length };
      seen++;
    }
  }
  throw new Error(`phrase not found: ${phrase} #${occ}`);
};
/** начало фразы (сек ролика) */
export const A = (phrase: string, occ = 0) => WORDS[WI[find(phrase, occ).i]][1];
/** конец фразы */
export const Z = (phrase: string, occ = 0) => {
  const f = find(phrase, occ);
  return WORDS[WI[f.i + f.n - 1]][2];
};

export const DURATION_SEC = VO_TOTAL;
export const DURATION_FRAMES = Math.ceil(VO_TOTAL * FPS);

export type SceneDef = { id: string; t0: number };

/** сцены привязаны к словам озвучки */
export const SCENES: SceneDef[] = [
  { id: "hookPhone", t0: 0 },
  { id: "bridgeWide", t0: A("Он врёт") },
  { id: "pocket", t0: A("В кармане") },
  { id: "title", t0: A("Билет в один конец") - 0.3 },
  { id: "snowMatch", t0: A("А начиналось всё") - 0.2 },
  { id: "moscowWide", t0: A("Москва Ноябрь") },
  { id: "timurCard", t0: A("Тимуру двадцать один") },
  { id: "scooter", t0: A("Днём он развозит") },
  { id: "kitchen", t0: A("Ночью сидит на кухне") },
  { id: "laptop", t0: A("улицы Нью-Йорка") },
  { id: "dreamFace", t0: A("Жизнь которая где-то") },
  { id: "momHome", t0: A("Мама работает") },
  { id: "plate", t0: A("Она ставит перед ним") },
  { id: "silent", t0: A("Тимур молчит") },
  { id: "sell", t0: A("Он продаёт приставку") },
  { id: "cash", t0: A("Снимает всё") },
  { id: "visa", t0: A("Туристическая виза") },
  { id: "ticket", t0: A("И билет") },
  { id: "momDoor", t0: A("В последнюю ночь") },
  { id: "pirozhki", t0: A("Кладёт в рюкзак") },
  { id: "promise", t0: A("Звони каждый день") },
  { id: "dawnLeave", t0: Z("Обещаю мам") + 0.6 },
  { id: "airport", t0: A("Шереметьево") },
  { id: "takeoff", t0: A("Пересадка в Стамбуле") },
  { id: "route", t0: A("Двадцать часов") },
  { id: "porthole", t0: A("В самолёте он не спит") },
  { id: "mistake", t0: A("Он ошибается") - 0.15 },
  { id: "landing", t0: Z("Он ошибается") + 0.9 },
  { id: "queue", t0: A("Аэропорт Кеннеди") },
  { id: "officer", t0: A("Офицер долго листает") },
  { id: "officerEyes", t0: A("Потом поднимает глаза") },
  { id: "blank", t0: A("Все слова") },
  { id: "tourism", t0: A("Туризм") },
  { id: "pause", t0: A("Пауза Самая длинная") },
  { id: "stamp", t0: A("Удар штампа") - 0.25 },
  { id: "welcome", t0: A("Welcome to the") },
  { id: "exit", t0: A("Он выходит на улицу") },
  { id: "selfie", t0: A("Он достаёт телефон и записывает") },
  { id: "fifth", t0: Z("Я сделал это") + 1.2 },
  { id: "park", t0: A("Центральный парк") },
  { id: "steam", t0: A("Пар из люков") },
  { id: "prices", t0: A("Кофе") },
  { id: "laugh", t0: A("Он смеётся") },
  { id: "count", t0: A("Вечером он пересчитывает") },
  { id: "unease", t0: A("И впервые ему") },
  { id: "hostel", t0: A("Хостел в Квинсе") },
  { id: "listing", t0: A("На третий день") },
  { id: "danny", t0: A("У метро его встречает") },
  { id: "handshake", t0: A("Улыбка кепка") },
  { id: "keys", t0: A("Он пересчитывает деньги отдаёт") },
  { id: "bro", t0: A("Welcome home") },
  { id: "keyFail", t0: A("Ключ не подходит") },
  { id: "doors", t0: A("Ни к одной двери") },
  { id: "phoneOff", t0: A("Телефон Дэнни") },
  { id: "loss", t0: A("Тысяча двести") },
  { id: "nightWalk", t0: A("Ночь Снег") },
  { id: "windows", t0: A("Город который он столько") },
  { id: "phoneDrop", t0: A("Телефон выскальзывает") },
  { id: "bench", t0: A("Он садится на скамейку") },
  { id: "cold", t0: A("Достаёт из рюкзака") },
  { id: "memory", t0: A("И вспоминает") - 0.8 },
  { id: "voiceMsg", t0: A("Он записывает голосовое") },
  { id: "send", t0: A("Отправить") - 0.2 },
  { id: "dawn", t0: A("Утром его будит") - 1.2 },
  { id: "aram", t0: A("Пожилой хозяин") },
  { id: "aramTalk", t0: A("Русский") },
  { id: "cupLook", t0: A("Тимур смотрит на стакан") },
  { id: "bridgeDawn", t0: A("Потом на мост") },
  { id: "rise", t0: A("Это не мечта") },
  { id: "outro", t0: A("Нью-Йорк не ждёт") - 0.3 },
  { id: "teaser", t0: A("В следующей серии") },
  { id: "watcher", t0: A("И человек который знает") },
  { id: "endCard", t0: A("Билет в один конец", 1) - 0.2 },
];

export const sceneAt = (t: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && SCENES[i + 1].t0 <= t) i++;
  const sc = SCENES[i];
  const end = i + 1 < SCENES.length ? SCENES[i + 1].t0 : DURATION_SEC;
  return { sc, idx: i, lt: t - sc.t0, dur: end - sc.t0 };
};
