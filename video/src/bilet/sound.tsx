import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { A, DURATION_SEC, FPS, Z } from "./timeline";

const F = (s: number) => Math.max(0, Math.round(s * FPS));

/** один звук: старт, длительность, файл, громкость, петля, фейды (сек) */
const Fx: React.FC<{ at: number; dur: number; f: string; v: number; loop?: boolean; fi?: number; fo?: number }> = ({ at, dur, f, v, loop = false, fi = 0, fo = 0 }) => {
  const n = Math.max(1, F(dur));
  return (
    <Sequence from={F(at)} durationInFrames={n} layout="none">
      <Audio
        src={staticFile(`bilet/sfx/${f}.mp3`)}
        loop={loop}
        volume={(fr) => {
          const s = fr / FPS;
          const a = fi > 0 ? Math.min(1, s / fi) : 1;
          const b = fo > 0 ? Math.min(1, (dur - s) / fo) : 1;
          return v * Math.max(0, Math.min(a, b));
        }}
      />
    </Sequence>
  );
};

/** звуковая партитура «Билет в один конец»: атмосфера / фоли / музыка */
export const BiletSound: React.FC = () => {
  const moscow = A("Москва Ноябрь");
  const kit = A("Ночью сидит на кухне");
  const sell = A("Он продаёт приставку");
  const door = A("В последнюю ночь");
  const leave = Z("Обещаю мам") + 0.6;
  const svo = A("Шереметьево");
  const plane = A("В самолёте он не спит");
  const err = A("Он ошибается");
  const jfk = A("Аэропорт Кеннеди");
  const stamp = A("Удар штампа") + 0.05;
  const out = A("Он выходит на улицу");
  const hostel = A("Хостел в Квинсе");
  const danny = A("У метро его встречает");
  const night = A("Ночь Снег");
  const hit = A("Экран идёт трещинами") - 0.6;
  const bench = A("Он садится на скамейку");
  const mem = A("Звони каждый день", 1);
  const vm = A("Он записывает голосовое");
  const dawn = A("Утром его будит") - 1.2;
  const teaser = A("В следующей серии");
  const end = A("Билет в один конец", 1) - 0.2;
  return (
    <>
      {/* ── пролог: мост ── */}
      <Fx at={0} dur={15} f="bridge_night" v={0.35} loop fo={1.5} />
      <Fx at={0} dur={21} f="snow_wind" v={0.22} loop fo={2} />
      <Fx at={0.15} dur={1} f="rec_beep" v={0.6} />
      <Fx at={2.2} dur={12.6} f="pad_dark" v={0.16} loop fi={2} fo={1.5} />
      <Fx at={A("Билет в один конец") - 0.12} dur={4} f="film_title_hit" v={0.85} />
      <Fx at={A("А начиналось всё") - 0.2} dur={1.5} f="whoosh" v={0.5} />
      {/* ── Москва ── */}
      <Fx at={A("А начиналось всё") + 0.3} dur={kit - A("А начиналось всё")} f="moscow_yard" v={0.38} loop fi={1.5} fo={0.6} />
      <Fx at={moscow - 0.5} dur={A("Тимур молчит") - moscow + 0.5} f="pad_hope" v={0.17} loop fi={2} fo={1.2} />
      <Fx at={A("Днём он развозит") + 0.1} dur={4} f="scooter" v={0.6} />
      <Fx at={kit - 0.3} dur={sell - kit + 0.3} f="kitchen_night" v={0.5} loop fi={0.5} fo={0.5} />
      <Fx at={A("Мама работает") + 0.1} dur={2.5} f="door_creak" v={0.7} />
      <Fx at={A("Она ставит перед ним") + 1.1} dur={1.5} f="plate" v={0.8} />
      {/* сборы */}
      <Fx at={sell + 0.4} dur={2.5} f="sell_items" v={0.5} />
      <Fx at={A("Камеру") + 0.4} dur={2.5} f="sell_items" v={0.45} />
      <Fx at={A("Свой самокат") + 0.4} dur={2.5} f="sell_items" v={0.5} />
      <Fx at={A("Снимает всё") + 0.2} dur={3} f="cash_count" v={0.8} />
      <Fx at={A("Туристическая виза")} dur={2.5} f="pages" v={0.6} />
      <Fx at={A("В одну сторону")} dur={1.2} f="stamp" v={0.55} />
      <Fx at={sell} dur={door - sell} f="pad_city" v={0.12} fi={1} fo={1.5} />
      <Fx at={door + 0.2} dur={2.5} f="door_creak" v={0.9} />
      <Fx at={A("Кладёт в рюкзак") + 0.3} dur={2} f="plastic_bag" v={0.8} />
      <Fx at={A("и тихо говорит") - 0.4} dur={2} f="zipper" v={0.8} />
      <Fx at={door} dur={svo - door} f="pad_hope" v={0.2} loop fi={1.5} fo={1} />
      <Fx at={leave} dur={svo - leave + 0.3} f="moscow_yard" v={0.25} loop fi={1} fo={0.5} />
      {/* ── перелёт ── */}
      <Fx at={svo - 0.2} dur={A("Пересадка в Стамбуле") - svo + 0.6} f="terminal" v={0.45} fo={0.4} />
      <Fx at={A("Пересадка в Стамбуле") - 0.5} dur={8} f="takeoff" v={0.6} fo={2} />
      <Fx at={plane - 0.5} dur={err - plane + 0.6} f="cabin" v={0.35} loop fi={1} fo={0.2} />
      <Fx at={plane} dur={err - plane} f="pad_hope" v={0.2} loop fi={2} fo={0.3} />
      <Fx at={err - 0.05} dur={4} f="boom" v={0.85} />
      <Fx at={Z("Он ошибается") + 1.6} dur={6} f="landing" v={0.6} fo={1.5} />
      {/* ── JFK ── */}
      <Fx at={jfk - 0.3} dur={out - jfk + 0.3} f="hall_echo" v={0.4} loop fi={0.6} fo={0.4} />
      <Fx at={A("Офицер долго листает") + 0.3} dur={2.5} f="pages" v={0.7} />
      <Fx at={A("Офицер долго листает") + 2.0} dur={2.5} f="pages" v={0.6} />
      <Fx at={A("Все слова") - 0.2} dur={6.4} f="riser" v={0.25} fo={0.4} />
      <Fx at={A("Пауза Самая длинная")} dur={stamp - A("Пауза Самая длинная")} f="heart" v={0.55} loop fi={0.5} />
      <Fx at={stamp} dur={1.2} f="stamp" v={1} />
      <Fx at={stamp} dur={3} f="boom" v={0.3} />
      {/* ── Нью-Йорк ── */}
      <Fx at={out + 0.2} dur={hostel - out - 0.2} f="nyc_street" v={0.42} loop fi={1.2} fo={1} />
      <Fx at={out + 0.4} dur={20} f="pad_city" v={0.24} fi={1.5} fo={3} />
      <Fx at={A("Он достаёт телефон и записывает") + 0.4} dur={1} f="rec_beep" v={0.7} />
      <Fx at={A("Кофе") + 0.1} dur={1} f="cup" v={0.7} />
      <Fx at={A("Вечером он пересчитывает") + 0.2} dur={3} f="cash_count" v={0.6} />
      <Fx at={A("И впервые ему")} dur={hostel - A("И впервые ему") + 0.5} f="snow_wind" v={0.3} loop fi={1} fo={1} />
      <Fx at={A("И впервые ему")} dur={night - A("И впервые ему")} f="pad_dark" v={0.18} loop fi={2} fo={1} />
      <Fx at={hostel - 0.2} dur={A("На третий день") - hostel + 1} f="hostel" v={0.45} loop fi={0.4} fo={0.8} />
      <Fx at={danny - 0.6} dur={A("Ключ не подходит") - danny + 0.6} f="nyc_street" v={0.28} loop fi={0.6} fo={0.4} />
      <Fx at={danny} dur={7} f="subway" v={0.35} fo={1.5} />
      <Fx at={A("Улыбка кепка") + 0.4} dur={1} f="handshake" v={0.9} />
      <Fx at={A("Он пересчитывает деньги отдаёт")} dur={3} f="cash_count" v={0.6} />
      <Fx at={A("Ключ не подходит") + 0.3} dur={4} f="keys_fail" v={0.9} />
      <Fx at={A("Ни к одной двери")} dur={2} f="snow_steps" v={0.5} loop />
      <Fx at={A("Телефон Дэнни") + 0.2} dur={3} f="phone_off" v={0.5} />
      <Fx at={A("Тысяча двести")} dur={4} f="boom" v={0.45} />
      <Fx at={A("Тысяча двести") + 0.5} dur={night - A("Тысяча двести") - 0.5} f="heart" v={0.4} loop fo={1} />
      {/* ── ночь ── */}
      <Fx at={night - 0.6} dur={mem - night} f="snow_wind" v={0.42} loop fi={0.8} fo={1.5} />
      <Fx at={night} dur={A("Город который он столько") - night + 0.5} f="snow_steps" v={0.55} loop fo={0.5} />
      <Fx at={night} dur={mem - night - 1.2} f="pad_dark" v={0.22} loop fi={1.5} fo={1.2} />
      <Fx at={hit} dur={1.5} f="phone_crack" v={1} />
      <Fx at={bench - 0.5} dur={dawn - bench + 1} f="bridge_night" v={0.32} loop fi={0.8} fo={1.5} />
      <Fx at={A("Достаёт из рюкзака") + 0.2} dur={2} f="plastic_bag" v={0.8} />
      <Fx at={mem - 0.3} dur={4} f="film_title_hit" v={0.45} />
      <Fx at={vm + 0.3} dur={1} f="rec_beep" v={0.6} />
      <Fx at={A("Отправить") + 0.1} dur={1} f="msg_send" v={0.8} />
      {/* ── рассвет ── */}
      <Fx at={dawn} dur={teaser - dawn} f="diner" v={0.3} loop fi={2} fo={1} />
      <Fx at={dawn + 0.5} dur={teaser - dawn - 0.5} f="pad_hope" v={0.24} loop fi={3} fo={1} />
      <Fx at={A("Пожилой хозяин") + 3.0} dur={1} f="cup" v={0.9} />
      {/* ── анонс и титр ── */}
      <Fx at={teaser - 0.05} dur={4} f="boom" v={0.6} />
      <Fx at={teaser + 1.4} dur={1.5} f="whoosh" v={0.45} />
      <Fx at={teaser + 2.8} dur={1.5} f="whoosh" v={0.45} />
      <Fx at={teaser} dur={end - teaser} f="riser" v={0.28} fo={0.3} />
      <Fx at={A("И человек который знает")} dur={end - A("И человек который знает")} f="heart" v={0.45} loop />
      <Fx at={end} dur={4} f="film_title_hit" v={0.85} />
      <Fx at={end} dur={DURATION_SEC - end} f="snow_wind" v={0.22} loop fi={1} fo={2.5} />
    </>
  );
};
