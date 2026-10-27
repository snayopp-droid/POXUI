import React from "react";
import { Cam, Glow, H, SANS, SERIF, Snow, Spaced, Svg, W, cl, eio, eout, lerp, mix, nz, ramp, rnd, tw, type SP } from "./core";
import { Avenue, Clouds, Lamp, Phone, Plane, Sky, Skyline, Steam, Taxi } from "./env";
import { Figure, Passer, Profile } from "./figures";
import { BackFigure, Bill, FrontFace, Hand, Money, Passport, Tree, talk } from "./props";
import { A } from "./timeline";

/* ───────── 23. Шереметьево: табло ───────── */
const Flap: React.FC<{ x: number; y: number; text: string; t: number; t0: number; w?: number }> = ({ x, y, text, t, t0, w = 34 }) => {
  const ABC = "АБВГДЕЖЗИКЛМНОПРСТУФЮЯ0123456789 ";
  return (
    <g>
      {text.split("").map((ch, i) => {
        const done = t > t0 + i * 0.05 + 0.35;
        const c = done ? ch : ABC[Math.floor(rnd(i + Math.floor(t * 20)) * ABC.length)];
        return (
          <g key={i}>
            <rect x={x + i * w} y={y - 40} width={w - 4} height={52} rx={3} fill="#15171b" />
            <line x1={x + i * w} x2={x + i * w + w - 4} y1={y - 14} y2={y - 14} stroke="#000" strokeWidth={2} />
            <text x={x + i * w + (w - 4) / 2} y={y} fontFamily={SANS} fontSize={36} fill="#e9dfc6" textAnchor="middle">
              {c}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export const SAirport: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg bg="#0d1014">
    <Cam x={960} y={540} z={tw(lt, 0, dur, 1.05, 1.15)} t={t} hand={1.5}>
      <rect width={W} height={H} fill="#1a1e24" />
      {/* стекло терминала, рассвет */}
      <Sky id="svo" top="#3a4252" bot="#c7a68a" y0={140} y1={760} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={i * 240} y={140} width={10} height={620} fill="#14171c" />
      ))}
      <Plane x={1300} y={640} s={0.55} col="#2a2f38" t={t} />
      <rect x={0} y={760} width={W} height={320} fill="#2b2e33" />
      {/* табло */}
      <rect x={260} y={200} width={1400} height={330} fill="#0b0c0f" />
      <Flap x={300} y={290} text="НЬЮ-ЙОРК JFK" t={t} t0={lt < 0 ? 0 : t - lt} />
      <Flap x={300} y={370} text="СТАМБУЛ" t={t} t0={t - lt + 0.3} />
      <Flap x={300} y={450} text="ПОСАДКА 06 40" t={t} t0={t - lt + 0.5} />
      {Array.from({ length: 6 }, (_, i) => (
        <Passer key={i} x={((i * 400 + lt * (i % 2 ? 120 : -120)) % 2400 + 2400) % 2400 - 200} y={1000} s={0.9} t={t} face={i % 2 ? 1 : -1} seed={i} c="#0f1115" />
      ))}
    </Cam>
  </Svg>
);

/* ───────── 24. взлёт ───────── */
export const STakeoff: React.FC<SP> = ({ t, lt, dur }) => {
  const k = eio(lt / dur);
  return (
    <Svg>
      <Cam x={lerp(900, 1100, k)} y={lerp(640, 520, k)} z={1.0} t={t} hand={2}>
        <Sky id="tko" top="#2c3446" mid="#7a6a70" bot="#d9a47a" y1={820} />
        <Glow x={1500} y={760} r={700} k="warm" o={0.5} sy={0.4} />
        <Skyline y={820} seed={30} n={30} hMin={20} hMax={70} col="#1b1d22" lit={0.3} detail={0.4} />
        <rect x={-400} y={820} width={W + 800} height={300} fill="#17191d" />
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={-200 + i * 90} cy={860} r={3} fill="#ffd28a" opacity={0.8} />
        ))}
        <Plane x={lerp(300, 1500, k)} y={lerp(820, 380, Math.pow(k, 1.4))} s={lerp(0.9, 0.55, k)} rot={lerp(-4, -13, k)} col="#14161b" t={t} />
      </Cam>
    </Svg>
  );
};

/* ───────── 25. маршрут ───────── */
export const SRoute: React.FC<SP> = ({ t, lt, dur }) => {
  const P = [
    [1420, 360],
    [1240, 520],
    [440, 470],
  ];
  const k = eio(ramp(lt, 0.1, dur - 0.2));
  const seg = (a: number[], b: number[], u: number, bend: number) => {
    const mx = (a[0] + b[0]) / 2;
    const my = Math.min(a[1], b[1]) - bend;
    const p = (s: number) => [(1 - s) * (1 - s) * a[0] + 2 * (1 - s) * s * mx + s * s * b[0], (1 - s) * (1 - s) * a[1] + 2 * (1 - s) * s * my + s * s * b[1]];
    return Array.from({ length: 40 }, (_, i) => p((i / 39) * u).join(",")).join(" ");
  };
  const u1 = cl(k * 3);
  const u2 = cl(k * 1.5 - 0.5);
  return (
    <Svg bg="#0b0e13">
      <Cam x={tw(lt, 0, dur, 1250, 800)} y={480} z={tw(lt, 0, dur, 1.5, 1.0)} t={t}>
        <rect x={-1000} width={W + 2000} height={H} fill="#0e131a" />
        {/* стилизованная бумажная карта: материки пятнами */}
        <g fill="#1c2430">
          <path d="M1100 200 C1300 150 1700 180 1900 260 L1900 600 C1700 640 1450 600 1300 560 C1200 540 1120 470 1100 400 Z" />
          <path d="M1150 560 C1250 560 1350 620 1360 760 C1300 860 1180 840 1150 720 Z" />
          <path d="M80 220 C300 170 560 220 640 320 C620 460 520 560 420 600 C300 640 180 560 120 460 Z" />
          <path d="M380 640 C480 640 560 720 540 860 C500 920 420 900 400 800 Z" />
        </g>
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={-1000} x2={3000} y1={i * 60} y2={i * 60} stroke="#1a212b" strokeWidth={1} />
        ))}
        <polyline points={seg(P[0], P[1], u1, 40)} fill="none" stroke="#e9dcc4" strokeWidth={3} strokeDasharray="10 8" />
        <polyline points={seg(P[1], P[2], u2, 160)} fill="none" stroke="#e9dcc4" strokeWidth={3} strokeDasharray="10 8" />
        {P.map((p, i) => (
          <g key={i} opacity={i === 0 ? 1 : i === 1 ? cl(u1 * 3 - 2) : cl(u2 * 3 - 2)}>
            <circle cx={p[0]} cy={p[1]} r={9} fill="#e9dcc4" />
            <Spaced x={p[0]} y={p[1] - 26} text={["МОСКВА", "СТАМБУЛ", "НЬЮ-ЙОРК"][i]} size={26} sp={0.3} font={SANS} />
          </g>
        ))}
      </Cam>
      <Spaced x={1700} y={880} text={`${String(Math.floor(k * 20)).padStart(2, "0")}:00`} size={52} sp={0.2} font={SANS} anchor="end" fill="#cfc5b2" />
    </Svg>
  );
};

/* ───────── 26. иллюминатор ───────── */
const Porthole: React.FC<{ t: number; dark?: number; night?: number }> = ({ t, dark = 0, night = 0 }) => (
  <g>
    <defs>
      <clipPath id="port">
        <rect x={1060} y={250} width={420} height={560} rx={200} />
      </clipPath>
    </defs>
    <rect width={W} height={H} fill={mix("#6d6a66", "#121316", night)} />
    <rect x={0} y={0} width={W} height={H} fill={mix("#8a8680", "#18191c", night)} opacity={0.5} />
    <rect x={1030} y={220} width={480} height={620} rx={230} fill={mix("#b9b4ac", "#2a2b2f", night)} />
    <g clipPath="url(#port)">
      <Sky id={`port${Math.round(night * 5)}`} top={mix("#6f8fb8", "#0b1322", night)} mid={mix("#b6c4d4", "#152036", night)} bot={mix("#f2d8b4", "#28324a", night)} y0={250} y1={810} />
      <Clouds t={t} y={700} speed={140} col={mix("#f4f1ea", "#3a4256", night)} n={8} s={0.6} />
      <Clouds t={t + 40} y={560} speed={60} col={mix("#ffffff", "#2a3246", night)} n={6} s={0.4} o={0.6} />
      <Glow x={1420} y={330} r={300} k="warm" o={0.7 * (1 - night)} />
      <rect x={1060} y={250} width={420} height={560} fill="#000" opacity={dark} />
    </g>
    <rect x={1060} y={250} width={420} height={560} rx={200} fill="none" stroke={mix("#8d887f", "#1c1d20", night)} strokeWidth={14} />
    <rect x={1110} y={230} width={320} height={40} rx={14} fill={mix("#d9d4cb", "#2e2f33", night)} />
  </g>
);
export const SPorthole: React.FC<SP> = ({ t, lt, dur }) => {
  const warm = ramp(t, A("самое трудное"), A("самое трудное") + 2);
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 1120, 980)} y={540} z={tw(lt, 0, dur, 1.25, 1.0)} t={t} hand={1.2}>
        <Porthole t={t} />
        <Glow x={1260} y={520} r={900} k="warm" o={0.25 + warm * 0.3} />
        <Profile x={640} y={600} s={1.55} id="port" mood={t > A("и улыбается") ? "smile" : "neutral"} light="#ffe2b8" hood={false} blink={nz(t * 0.5, 3) > 0.92 ? 1 : 0} />
        <rect x={0} y={860} width={W} height={300} fill="#3a3a3e" opacity={0.6} />
      </Cam>
    </Svg>
  );
};

/* ───────── 27. «Он ошибается» ───────── */
export const SMistake: React.FC<SP> = ({ t, lt }) => {
  const d = eout(ramp(lt, 0, 0.35));
  return (
    <Svg>
      <Cam x={1270} y={530} z={tw(lt, 0, 0.4, 1.6, 2.1)} t={t} hand={10 * (1 - ramp(lt, 0.2, 1.2))}>
        <Porthole t={t} dark={d} night={d} />
      </Cam>
      <rect width={W} height={H} fill="#000" opacity={ramp(lt, 0.4, 1.0)} />
    </Svg>
  );
};

/* ───────── 28. посадка в Нью-Йорке ───────── */
export const SLanding: React.FC<SP> = ({ t, lt, dur }) => {
  const k = eio(lt / dur);
  return (
    <Svg>
      <Cam x={960} y={tw(lt, 0, dur, 470, 560)} z={1.02} t={t} hand={1.5}>
        <Sky id="lnd" top="#3a404c" mid="#7c7c84" bot="#a8a2a0" y1={760} />
        <Skyline y={720} seed={11} n={34} hMin={60} hMax={360} col="#3c414c" lit={0.12} detail={0.45} spire />
        <rect x={-400} y={720} width={W + 800} height={400} fill="#4a4d52" />
        <rect x={-400} y={860} width={W + 800} height={90} fill="#2f3135" />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={-300 + i * 120} y={902} width={60} height={6} fill="#e8e6e0" opacity={0.7} />
        ))}
        <Plane x={lerp(-300, 1300, k)} y={lerp(640, 862, Math.min(1, k * 1.25))} s={0.75} rot={lerp(6, 0, Math.min(1, k * 1.25))} col="#cfd2d6" lights={1} t={t} />
        <Snow t={t} n={60} size={2} speed={80} wind={-200} o={0.5} />
      </Cam>
    </Svg>
  );
};

/* ───────── 29. очередь на контроль ───────── */
const Hall: React.FC<{ t: number }> = () => (
  <g>
    <rect width={W} height={H} fill="#1f2328" />
    <rect x={0} y={130} width={W} height={60} fill="#2c3137" />
    {Array.from({ length: 8 }, (_, i) => (
      <g key={i}>
        <rect x={80 + i * 240} y={150} width={160} height={14} fill="#dfe6ec" />
        <ellipse cx={160 + i * 240} cy={170} rx={160} ry={40} fill="url(#b-cold)" opacity={0.6} />
      </g>
    ))}
    <rect x={0} y={820} width={W} height={260} fill="#3a3e44" />
    <rect x={240} y={260} width={620} height={70} fill="#24375a" />
    <text x={550} y={306} fontFamily={SANS} fontSize={30} fill="#e9edf2" textAnchor="middle" letterSpacing={4}>
      VISITORS · ALL PASSPORTS
    </text>
  </g>
);
export const SQueue: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 760, 1100)} y={560} z={1.1} t={t} hand={1}>
      <Hall t={t} />
      {Array.from({ length: 3 }, (_, r) => (
        <g key={r}>
          <line x1={-100} x2={2100} y1={760 + r * 70} y2={760 + r * 70} stroke="#202328" strokeWidth={4} />
          {Array.from({ length: 16 }, (_, i) => (
            <Passer key={i} x={-60 + i * 140 + rnd(i + r * 20) * 40 + (r === 1 ? lt * 6 : 0)} y={760 + r * 70} s={0.78 - r * 0.05} t={0} face={r % 2 ? 1 : -1} seed={i + r * 3} c={mix("#14161a", "#2a2e35", r * 0.3)} />
          ))}
        </g>
      ))}
      <Figure x={1180 + lt * 6} y={830} s={0.84} pose="stand" bag="backpack" hood={false} rim="#dfe9ff" rimO={0.7} dark={0.2} />
    </Cam>
  </Svg>
);

/* ───────── 30–31. офицер ───────── */
const Booth: React.FC<{ t: number }> = () => (
  <g>
    <rect width={W} height={H} fill="#1d2126" />
    <Glow x={960} y={150} r={900} k="cold" o={0.5} />
    <rect x={0} y={720} width={W} height={400} fill="#2c3036" />
    <rect x={0} y={700} width={W} height={24} fill="#4a4f57" />
    <rect x={180} y={150} width={1560} height={560} fill="#8fa2b4" opacity={0.08} />
    <rect x={180} y={150} width={1560} height={560} fill="none" stroke="#3a4048" strokeWidth={10} />
  </g>
);
export const SOfficer: React.FC<SP> = ({ t, lt, dur }) => {
  const page = Math.floor(lt * 1.6);
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 900, 980)} y={560} z={tw(lt, 0, dur, 1.0, 1.15)} t={t} hand={1}>
        <Booth t={t} />
        <Profile x={1280} y={500} s={1.25} id="off1" who="officer" face={-1} mood="tense" lit="front" light="#e4ecf6" look={1} tilt={10} />
        <g transform={`translate(780 760)`}>
          <Passport x={0} y={0} s={0.8} rot={-80} open={1} page={page % 2 ? "visa" : "blank"} />
          <path d={`M0 0 Q${60 - (lt * 1.6 % 1) * 120} ${-180} ${-(lt * 1.6 % 1) * 260 + 130} 0`} stroke="#e3dccb" strokeWidth={3} fill="none" opacity={0.6} />
        </g>
        <Hand x={900} y={760} s={1.1} rot={190} skin="#a87a5c" sleeve="#1f2a3c" />
      </Cam>
    </Svg>
  );
};
export const SOfficerEyes: React.FC<SP> = ({ t, lt, dur }) => {
  const m = talk(t, "Purpose of your", "visit");
  return (
    <Svg>
      <Cam x={1060} y={430} z={tw(lt, 0, dur, 1.6, 1.8)} t={t} hand={0.6}>
        <Booth t={t} />
        <Profile x={1280} y={500} s={1.25} id="off2" who="officer" face={-1} mood={m ? "talk" : "tense"} mouth={m} lit="front" light="#e4ecf6" look={0} tilt={-2} />
      </Cam>
    </Svg>
  );
};

/* ───────── 32. слова вылетают из головы ───────── */
const WORDS_EN = ["I am here", "for", "visiting", "sightseeing", "two weeks", "hotel", "Manhattan", "my friend", "return ticket"];
export const SBlank: React.FC<SP> = ({ t, lt }) => (
  <Svg bg="#0e1115">
    <Cam x={900} y={540} z={tw(lt, 0, 4, 1.0, 1.12)} t={t} hand={1.5}>
      <rect width={W} height={H} fill="#161a20" />
      <Glow x={1600} y={300} r={900} k="cold" o={0.55} />
      <Profile x={760} y={600} s={1.8} id="blank" mood="tense" lit="front" light="#e4ecf6" blink={lt > 2 && lt < 2.12 ? 1 : 0} />
      {WORDS_EN.map((w, i) => {
        const a = 0.3 + i * 0.25;
        const k = ramp(lt, a, a + 2.4);
        const x = 1000 + i * 40 + k * (300 + rnd(i) * 500);
        const y = 300 + rnd(i * 3) * 360 - k * 200;
        return (
          <text key={i} x={x} y={y} fontFamily={SERIF} fontSize={46 + rnd(i) * 20} fill="#e9edf2" opacity={Math.sin(k * Math.PI) * 0.85} filter={k > 0.6 ? "url(#b-blur2)" : undefined} letterSpacing={k * 30}>
            {w}
          </text>
        );
      })}
    </Cam>
  </Svg>
);

/* ───────── 33. «Туризм… Tourism» ───────── */
export const STourism: React.FC<SP> = ({ t, lt, dur }) => {
  const m = talk(t, "Туризм", "Tourism");
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 700, 760)} y={520} z={1.35} t={t} hand={1.2}>
        <Booth t={t} />
        <Profile x={640} y={560} s={1.3} id="tour" mood={m ? "talk" : "tense"} mouth={m} lit="front" light="#e4ecf6" />
        <Profile x={1320} y={520} s={1.25} id="tour-o" who="officer" face={-1} mood="neutral" lit="back" light="#e4ecf6" dark={0.4} />
      </Cam>
    </Svg>
  );
};

/* ───────── 34. самая длинная пауза ───────── */
export const SPause: React.FC<SP> = ({ t, lt, dur }) => {
  const k = eio(lt / dur);
  return (
    <Svg>
      <Cam x={lerp(960, 1000, k)} y={lerp(560, 600, k)} z={lerp(1.0, 1.6, k)} t={t} hand={0.4}>
        <Booth t={t} />
        <Passport x={980} y={780} s={1.0} rot={-88} open={1} page="blank" />
        <g transform={`translate(1000 ${520 - Math.sin(lt * 1.2) * 6})`}>
          <rect x={-40} y={-120} width={80} height={150} rx={12} fill="#3a2a22" />
          <rect x={-70} y={30} width={140} height={50} rx={8} fill="#1b1d22" />
        </g>
        <Hand x={1060} y={430} s={1.2} rot={200} skin="#a87a5c" sleeve="#1f2a3c" grip={1} />
      </Cam>
      <rect width={W} height={H} fill="#000" opacity={0.15 + k * 0.25} />
    </Svg>
  );
};

/* ───────── 35. удар штампа ───────── */
export const SStamp: React.FC<SP> = ({ t, lt }) => {
  const hit = A("Удар штампа") + 0.05;
  const down = t < hit ? 1 - ein2(ramp(t, hit - 0.2, hit)) : eout(ramp(t, hit + 0.1, hit + 0.6));
  const shake = t > hit && t < hit + 0.35 ? 14 : 0;
  return (
    <Svg>
      <Cam x={980} y={700} z={1.9} t={t * 30} hand={shake}>
        <Booth t={t} />
        <Passport x={980} y={780} s={1.0} rot={-88} open={1} page="blank" stamp={t > hit ? (t - hit) * 2 : 0} />
        <g transform={`translate(1000 ${lerp(720, 380, down)})`}>
          <rect x={-40} y={-120} width={80} height={150} rx={12} fill="#3a2a22" />
          <rect x={-70} y={30} width={140} height={50} rx={8} fill="#1b1d22" />
        </g>
      </Cam>
      <rect width={W} height={H} fill="#fff" opacity={t > hit && t < hit + 0.08 ? 0.25 : 0} />
    </Svg>
  );
};
const ein2 = (x: number) => x * x * x;

/* ───────── 36. Welcome ───────── */
export const SWelcome: React.FC<SP> = ({ t, lt, dur }) => {
  const m = talk(t, "Welcome to the", "United States");
  const slide = eio(ramp(lt, 0.4, 1.6));
  return (
    <Svg>
      <Cam x={1000} y={560} z={tw(lt, 0, dur, 1.15, 1.05)} t={t} hand={1}>
        <Booth t={t} />
        <Profile x={1300} y={500} s={1.25} id="wel" who="officer" face={-1} mood={m ? "talk" : "smile"} mouth={m} lit="front" light="#e4ecf6" />
        <Passport x={lerp(1000, 520, slide)} y={780} s={0.7} rot={-88} open={0.1} />
      </Cam>
    </Svg>
  );
};

/* ───────── 37. выход в город ───────── */
const CityStreet: React.FC<{ t: number; lt: number; night?: number; snow?: number }> = ({ t, lt, night = 0, snow = 0 }) => (
  <g>
    <Sky id={`cs${Math.round(night * 5)}`} top={mix("#6b7484", "#0a0f19", night)} mid={mix("#9aa0a8", "#141b28", night)} bot={mix("#c7c0b4", "#2a2a33", night)} y1={760} />
    <Skyline y={760} seed={21} n={12} hMin={360} hMax={760} col={mix("#4a4e58", "#161b25", night)} lit={lerp(0.15, 0.45, night)} detail={0.8} spire />
    <Skyline y={800} seed={23} n={9} hMin={200} hMax={420} col={mix("#3c3f47", "#11151d", night)} lit={lerp(0.2, 0.5, night)} />
    <rect x={-500} y={800} width={W + 1000} height={300} fill={mix("#3a3c40", "#14161a", night)} />
    <rect x={-500} y={800} width={W + 1000} height={14} fill={mix("#6a6a6a", "#2a2c30", night)} />
    {snow > 0 && <rect x={-500} y={810} width={W + 1000} height={40} fill="#d5dae2" opacity={0.25 * snow} />}
    <Steam x={1500} y={900} s={0.8} t={t} o={0.6} />
    <Taxi x={((lt * 600) % 2800) - 400} y={960} s={1.05} t={t} />
    <Taxi x={2400 - ((lt * 480 + 900) % 2800)} y={900} s={0.85} t={t} face={-1} dark={0.15} />
    <Taxi x={((lt * 700 + 1500) % 2800) - 400} y={1000} s={1.15} t={t} />
  </g>
);
export const SExit: React.FC<SP> = ({ t, lt, dur }) => {
  const doors = eout(ramp(lt, 0.2, 1.4));
  const crane = eio(ramp(t, A("Нью-Йорк Он достаёт") - 1.2, A("Нью-Йорк Он достаёт") + 0.4));
  return (
    <Svg>
      <Cam x={960} y={lerp(700, 430, crane)} z={lerp(1.25, 1.0, crane)} t={t} hand={1.5}>
        <CityStreet t={t} lt={lt} />
        <BackFigure x={960} y={1060} s={1.0 - crane * 0.2} t={t} walk={lt > 1 ? 0.6 : 0} />
        {/* раздвижные двери терминала */}
        <g opacity={1 - crane}>
          <rect x={-100} y={-100} width={1060 - doors * 900} height={1400} fill="#c9d1da" opacity={0.25} />
          <rect x={860 + doors * 900} y={-100} width={1200} height={1400} fill="#c9d1da" opacity={0.25} />
          <rect x={950 - doors * 900} y={-100} width={20} height={1400} fill="#3a4048" />
          <rect x={950 + doors * 900} y={-100} width={20} height={1400} fill="#3a4048" />
        </g>
      </Cam>
      <Snow t={t} n={50} size={2} speed={40} wind={-120} o={0.35} />
    </Svg>
  );
};

/* ───────── 38. селфи-видео ───────── */
export const SSelfie: React.FC<SP> = ({ t, lt }) => {
  const m = talk(t, "Я сделал это", "Я сделал это");
  return (
    <Svg bg="#101317">
      <Cam x={960} y={540} z={1.0} t={t} hand={4}>
        <g filter="url(#b-blur6)">
          <CityStreet t={t} lt={lt + 8} />
        </g>
        <Hand x={1030} y={930} s={1.3} rot={-80} />
        <Phone x={1000} y={540} s={0.85} rot={-4} id="selfie">
          <g>
            <Sky id="sfs" top="#7a8394" bot="#b6b0a6" y1={800} />
            <g transform="translate(-40 80) scale(0.3)">
              <Skyline y={1200} seed={5} n={8} hMin={500} hMax={1100} col="#4a4e58" lit={0.2} />
            </g>
            <FrontFace x={190} y={480} s={0.95} grin={1 + m * 0.4} mouth={m} />
            <circle cx={40} cy={50} r={10} fill="#e0453a" opacity={0.6 + 0.4 * Math.sin(t * 7)} />
            <text x={60} y={58} fontFamily={SANS} fontSize={24} fill="#fff">
              REC 00:{String(Math.floor(lt + 1)).padStart(2, "0")}
            </text>
          </g>
        </Phone>
      </Cam>
    </Svg>
  );
};

/* ───────── 39. Пятая авеню ───────── */
export const SFifth: React.FC<SP> = ({ t, lt, dur }) => {
  const look = eio(ramp(t, A("Пятая авеню"), A("Пятая авеню") + 1.6));
  return (
    <Svg>
      <Cam x={960} y={lerp(560, 300, look)} z={lerp(1.0, 1.1, look)} t={t} hand={1.5}>
        <Sky id="fth" top="#7c8492" bot="#c9c2b6" y0={-600} y1={700} />
        <Avenue t={t} offset={lt * 0.35} night={0.2} lit={0.18} col="#585c64" />
        <Passer x={700} y={900} s={0.5} t={t} seed={1} c="#2a2c31" />
        <Passer x={1240} y={880} s={0.45} t={t} seed={2} face={-1} c="#2a2c31" />
        <BackFigure x={960} y={1060} s={1.0} t={t} walk={1} look={look} />
      </Cam>
    </Svg>
  );
};

/* ───────── 40. Центральный парк ───────── */
export const SPark: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 900, 1060)} y={540} z={1.05} t={t} hand={1}>
      <Sky id="prk" top="#8a909a" bot="#d2cabd" y1={800} />
      <Skyline y={640} seed={41} n={16} hMin={260} hMax={520} col="#7a7c84" lit={0} detail={0.6} />
      <rect x={-300} y={620} width={W + 600} height={500} fill="#5e5a50" />
      <path d="M-300 900 C400 820 1200 1000 2300 860 L2300 960 C1200 1100 400 920 -300 1000 Z" fill="#9a958a" />
      {Array.from({ length: 12 }, (_, i) => (
        <Tree key={i} x={-200 + i * 220} y={640 + (i % 3) * 30} s={1.6 + rnd(i) * 0.6} seed={i + 30} col="#2e2c28" />
      ))}
      <Figure x={tw(lt, 0, dur, 600, 900)} y={930} s={0.5} pose="walk" phase={t * 5} bag="backpack" rimO={0} dark={0.2} />
    </Cam>
  </Svg>
);

/* ───────── 41. пар из люков ───────── */
export const SSteam: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 1060, 900)} y={560} z={1.1} t={t} hand={1.5}>
      <Sky id="stm" top="#606878" bot="#b3aca2" y1={760} />
      <Skyline y={760} seed={51} n={8} hMin={500} hMax={900} col="#3a3e48" lit={0.1} />
      <rect x={-400} y={760} width={W + 800} height={400} fill="#38393d" />
      <Steam x={1000} y={900} s={1.4} t={t} o={0.85} />
      <Taxi x={((lt * 650) % 3000) - 600} y={990} s={1.25} t={t} />
      <Figure x={tw(lt, 0, dur, 500, 760)} y={930} s={0.7} pose="walk" phase={t * 5} bag="backpack" rim="#ffe2b8" rimO={0.5} lookUp={0.5} />
    </Cam>
  </Svg>
);

/* ───────── 42. ценники ───────── */
export const SPrices: React.FC<SP> = ({ t }) => {
  const i = t < A("Метро") ? 0 : t < A("Кусок пиццы") ? 1 : 2;
  const t0 = [A("Кофе"), A("Метро"), A("Кусок пиццы")][i];
  const k = eout(ramp(t, t0 + 0.1, t0 + 0.6));
  const price = ["$6", "$3", "$5"][i];
  return (
    <Svg bg="#14110e">
      <Cam x={960} y={540} z={tw(t - t0, 0, 1.4, 1.15, 1.0)} t={t} hand={2}>
        <rect width={W} height={H} fill={["#2a221c", "#1d2228", "#2a1f18"][i]} />
        <Glow x={960} y={300} r={900} k="warm" o={0.45} />
        {i === 0 && (
          <g transform="translate(860 660)">
            <path d="M-120 -240 L120 -240 L96 200 L-96 200 Z" fill="#e9e2d4" />
            <rect x={-132} y={-276} width={264} height={44} rx={8} fill="#2b2b2b" />
            <rect x={-110} y={-80} width={220} height={110} fill="#7a4a2e" />
            <path d="M-20 -300 C-40 -360 30 -380 10 -440" stroke="#e6e6e6" strokeWidth={10} fill="none" opacity={0.3} filter="url(#b-blur6)" />
          </g>
        )}
        {i === 1 && (
          <g transform="translate(860 600)">
            <rect x={-260} y={-160} width={520} height={320} rx={20} fill="#c8a33a" />
            <rect x={-260} y={-160} width={520} height={70} rx={20} fill="#2a2e36" />
            <text x={0} y={-112} fontFamily={SANS} fontSize={34} fill="#fff" textAnchor="middle" letterSpacing={8}>
              SUBWAY
            </text>
            <rect x={-200} y={40} width={400} height={30} fill="#1b1b1b" />
          </g>
        )}
        {i === 2 && (
          <g transform="translate(860 620)">
            <path d="M-260 -120 L260 -120 L0 280 Z" fill="#e3b25a" />
            <path d="M-260 -120 L260 -120 L250 -160 L-250 -160 Z" fill="#b97a34" />
            {[[-80, -60], [60, -40], [0, 60], [-20, -90]].map(([x, y], j) => (
              <circle key={j} cx={x} cy={y} r={30} fill="#a8392a" />
            ))}
          </g>
        )}
        <g transform={`translate(1300 480) rotate(6) scale(${0.6 + k * 0.4})`} opacity={k}>
          <rect x={-150} y={-90} width={300} height={180} fill="#f1ece0" />
          <text x={0} y={46} fontFamily={SERIF} fontSize={130} fill="#2a2420" textAnchor="middle">
            {price}
          </text>
        </g>
      </Cam>
    </Svg>
  );
};

/* ───────── 43. смеётся ───────── */
export const SLaugh: React.FC<SP> = ({ t, lt, dur }) => {
  const m = talk(t, "Ничего Привыкну", "Ничего Привыкну");
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 980, 1020)} y={540} z={1.0} t={t} hand={1.5}>
        <g filter="url(#b-blur14)">
          <CityStreet t={t} lt={lt + 20} />
        </g>
        <Profile x={900} y={560} s={1.8} id="laugh" mood="grin" mouth={m} light="#ffe2b8" />
      </Cam>
    </Svg>
  );
};

/* ───────── 44. пересчитывает деньги ───────── */
export const SCount: React.FC<SP> = ({ t, lt, dur }) => {
  const v = tw(lt, 0.2, dur - 0.2, 1800, 1340, eout);
  return (
    <Svg bg="#0d0c0b">
      <Cam x={960} y={560} z={tw(lt, 0, dur, 1.0, 1.1)} t={t} hand={1}>
        <rect width={W} height={H} fill="#141210" />
        <Glow x={1300} y={340} r={800} k="sodium" o={0.5} />
        <rect x={0} y={640} width={W} height={500} fill="#2a2a30" />
        {Array.from({ length: 8 }, (_, i) => (
          <Bill key={i} x={820 + i * 40} y={720 - i * 4} s={1.0} rot={-12 + i * 3} val={i % 2 ? "100" : "20"} o={cl(1.3 - lt * 0.25 - i * 0.05)} />
        ))}
        <Hand x={640} y={720} s={1.4} rot={10} />
      </Cam>
      <Money x={960} y={380} v={v} size={130} />
    </Svg>
  );
};

/* ───────── 45. город берёт плату ───────── */
export const SUnease: React.FC<SP> = ({ t, lt, dur }) => {
  const k = eio(lt / dur);
  return (
    <Svg>
      <Cam x={960} y={lerp(820, 520, k)} z={lerp(2.0, 1.0, k)} t={t} hand={1}>
        <Sky id="une" top="#060a12" mid="#0e1420" bot="#1e2430" y1={800} />
        <Skyline y={820} seed={61} n={9} hMin={600} hMax={1000} col="#151a24" lit={0.42} detail={0.7} spire />
        <rect x={-400} y={820} width={W + 800} height={400} fill="#111317" />
        <Lamp x={560} y={1000} s={1.1} />
        <Lamp x={1500} y={1000} s={1.1} />
        <Figure x={980} y={960} s={0.34} pose="stand" bag="backpack" hood rim="#ffcf94" rimO={0.9} dark={0.4} lookUp={0.8} />
        <Passer x={((lt * 90) % 2400) - 200} y={980} s={0.36} t={t} seed={3} c="#0b0c0f" />
        <Passer x={2000 - ((lt * 120) % 2400)} y={990} s={0.38} t={t} face={-1} seed={5} c="#0b0c0f" />
        <Snow t={t} n={80} size={2} speed={50} wind={-30} o={0.45} />
      </Cam>
    </Svg>
  );
};
