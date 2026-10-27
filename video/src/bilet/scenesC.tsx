import React from "react";
import { Cam, Glow, H, NameCard, SANS, SERIF, Snow, Spaced, Svg, W, cl, eio, eout, lerp, mix, ramp, rnd, tw, type SP } from "./core";
import { Bench, Lamp, Phone, Sky, Skyline, Steam, Tower } from "./env";
import { Figure, Passer, Profile } from "./figures";
import { Breath, Hand, Money, talk } from "./props";
import { UnderBridge, VoiceUI } from "./scenesA";
import { A, Z } from "./timeline";

/* ───────── 46. хостел ───────── */
const Bunk: React.FC<{ x: number; y: number; s?: number; sleeper?: number }> = ({ x, y, s = 1, sleeper = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-220 0 L-220 -520 M220 0 L220 -520" stroke="#2a2c31" strokeWidth={10} />
    {[-80, -360].map((yy, i) => (
      <g key={i}>
        <rect x={-220} y={yy - 30} width={440} height={30} fill="#23252a" />
        <rect x={-210} y={yy - 60} width={420} height={30} rx={10} fill="#3a3c44" />
        {(sleeper > i || i === 0) && <path d={`M-190 ${yy - 60} C-160 ${yy - 110} 120 ${yy - 110} 190 ${yy - 60} Z`} fill="#2f3138" />}
      </g>
    ))}
  </g>
);
export const SHostel: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg bg="#07080a">
    <Cam x={tw(lt, 0, dur, 800, 1080)} y={560} z={tw(lt, 0, dur, 1.0, 1.15)} t={t} hand={1}>
      <rect width={W} height={H} fill="#0d0e12" />
      <rect x={1500} y={200} width={300} height={360} fill="#1c2232" />
      <Glow x={1650} y={380} r={400} k="sodium" o={0.4} />
      <rect x={0} y={900} width={W} height={200} fill="#15161a" />
      <Bunk x={260} y={920} s={0.9} />
      <Bunk x={760} y={920} s={0.9} />
      <Bunk x={1260} y={920} s={0.9} />
      {/* Тимур на верхней полке с телефоном */}
      <Glow x={1290} y={560} r={260} k="screen" o={0.7} />
      <Profile x={1240} y={580} s={0.45} id="host" mood="tired" light="#cfe0ff" dark={0.2} />
      <rect x={1330} y={560} width={30} height={56} rx={6} fill="#cfe0ff" opacity={0.9} />
      <g transform="translate(260 300) rotate(-3)">
        <rect x={-120} y={-60} width={240} height={120} fill="#e8e2d4" opacity={0.85} />
        <text x={0} y={-10} fontFamily={SANS} fontSize={24} fill="#2a2620" textAnchor="middle" letterSpacing={3}>
          QUEENS HOSTEL
        </text>
        <text x={0} y={36} fontFamily={SERIF} fontSize={40} fill="#2a2620" textAnchor="middle">
          $45 / night
        </text>
      </g>
    </Cam>
  </Svg>
);

/* ───────── 47. объявление ───────── */
export const SListing: React.FC<SP> = ({ t, lt, dur }) => {
  const up = ramp(t, A("Платить за месяц"), A("Платить за месяц") + 0.5);
  const msg = ramp(lt, dur - 2.2, dur - 1.8);
  return (
    <Svg bg="#08090c">
      <Cam x={960} y={tw(lt, 0, dur, 520, 560)} z={tw(lt, 0, dur, 1.0, 1.12)} t={t} hand={1.5}>
        <rect width={W} height={H} fill="#0c0d10" />
        <Hand x={1010} y={900} s={1.4} rot={-82} />
        <Phone x={960} y={540} s={0.95} id="list">
          <rect width={380} height={800} fill="#f2efe9" />
          <rect width={380} height={70} fill="#2d3a4e" />
          <text x={20} y={45} fontFamily={SANS} fontSize={22} fill="#fff">
            Rooms · Brooklyn
          </text>
          <rect x={20} y={90} width={340} height={220} fill="#b89c7e" />
          <rect x={40} y={110} width={140} height={120} fill="#e8dcc6" />
          <rect x={200} y={200} width={140} height={90} fill="#7a5a3e" />
          <text x={20} y={350} fontFamily={SANS} fontSize={26} fill="#1e1e1e" fontWeight={700}>
            Cozy room in Brooklyn
          </text>
          <text x={20} y={396} fontFamily={SERIF} fontSize={40} fill="#1e1e1e">
            $400 / week
          </text>
          <text x={20} y={440} fontFamily={SANS} fontSize={18} fill="#666">
            near subway · furnished · no lease
          </text>
          <rect x={14} y={462} width={352} height={46} rx={8} fill="#f3d36a" opacity={up} />
          <text x={24} y={494} fontFamily={SANS} fontSize={20} fill="#1e1e1e">
            Pay 1 month upfront · cash only
          </text>
          <g opacity={msg} transform={`translate(0 ${(1 - eout(msg)) * 40})`}>
            <rect x={20} y={560} width={340} height={120} rx={18} fill="#2d3a4e" />
            <text x={40} y={600} fontFamily={SANS} fontSize={18} fill="#cfd8e6">
              Danny:
            </text>
            <text x={40} y={634} fontFamily={SANS} fontSize={20} fill="#fff">
              for you bro — $1200 the month.
            </text>
            <text x={40} y={662} fontFamily={SANS} fontSize={20} fill="#fff">
              meet me at the subway 6pm
            </text>
          </g>
        </Phone>
      </Cam>
    </Svg>
  );
};

/* ───────── 48. Дэнни у метро ───────── */
const SubwayEntrance: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-140} width={520} height={140} fill="#2a2c30" />
    <path d="M-260 -140 L-260 -10 M260 -140 L260 -10" stroke="#1d3a2a" strokeWidth={10} />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={-260 + i * 47} x2={-260 + i * 47} y1={-140} y2={-10} stroke="#1d3a2a" strokeWidth={4} />
    ))}
    <line x1={-260} x2={260} y1={-140} y2={-140} stroke="#1d3a2a" strokeWidth={8} />
    {[-260, 260].map((gx) => (
      <g key={gx}>
        <rect x={gx - 5} y={-300} width={10} height={160} fill="#1d3a2a" />
        <circle cx={gx} cy={-320} r={24} fill="#8fc49a" opacity={0.9} />
        <circle cx={gx} cy={-320} r={70} fill="url(#b-warm)" opacity={0.35} />
      </g>
    ))}
    <rect x={-200} y={-180} width={400} height={40} fill="#1a1c20" />
    <text x={0} y={-152} fontFamily={SANS} fontSize={26} fill="#e8e4d8" textAnchor="middle" letterSpacing={6}>
      SUBWAY
    </text>
  </g>
);
const StreetDusk: React.FC<{ t: number; lt: number }> = ({ t, lt }) => (
  <g>
    <Sky id="dsk" top="#1a2030" mid="#4a4652" bot="#9a7a6a" y1={800} />
    <Skyline y={780} seed={71} n={10} hMin={380} hMax={700} col="#22262f" lit={0.4} detail={0.8} />
    <rect x={-400} y={780} width={W + 800} height={400} fill="#26272b" />
    <rect x={-400} y={780} width={W + 800} height={12} fill="#3a3a3e" />
    <Lamp x={300} y={1000} s={1.1} />
    {Array.from({ length: 5 }, (_, i) => (
      <Passer key={i} x={((i * 520 + lt * 80 * (i % 2 ? 1 : -1)) % 2400 + 2400) % 2400 - 200} y={960} s={0.55} t={t} seed={i + 9} face={i % 2 ? 1 : -1} c="#121318" />
    ))}
  </g>
);
export const SDanny: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 900, 1000)} y={600} z={1.2} t={t} hand={1.5}>
      <StreetDusk t={t} lt={lt} />
      <SubwayEntrance x={1000} y={980} s={1.0} />
      <Figure x={1300} y={990} s={0.95} who="danny" cap pose="stand" face={-1} armUp={eio(ramp(lt, 0.6, 1.2)) * (1 - ramp(lt, 2.4, 3))} rim="#ffcf94" rimO={0.7} dark={0.15} />
      <Figure x={tw(lt, 0, 2.5, 500, 1080)} y={1000} s={0.95} pose={lt < 2.5 ? "walk" : "stand"} phase={t * 5} bag="backpack" rim="#ffcf94" rimO={0.5} dark={0.15} />
    </Cam>
    <NameCard x={260} y={760} name="ДЭННИ" sub="«СДАЮ КОМНАТУ»" lt={lt} at={0.6} />
  </Svg>
);

/* ───────── 49. рукопожатие ───────── */
export const SHandshake: React.FC<SP> = ({ t, lt }) => {
  const k = eout(ramp(lt, 0, 0.5));
  const shake = Math.sin(lt * 14) * 10 * ramp(lt, 0.5, 0.7);
  return (
    <Svg bg="#0e0f12">
      <Cam x={960} y={540 + shake} z={1.3} t={t} hand={1}>
        <g filter="url(#b-blur14)">
          <StreetDusk t={t} lt={lt} />
        </g>
        <Hand x={lerp(600, 900, k)} y={560} s={1.5} rot={-6} sleeve="#2c3440" />
        <Hand x={lerp(1320, 1020, k)} y={580} s={1.5} rot={186} skin="#8f6448" sleeve="#6e2f25" />
      </Cam>
    </Svg>
  );
};

/* ───────── 50. деньги → ключи ───────── */
export const SKeys: React.FC<SP> = ({ t, lt, dur }) => {
  const keys = t > A("отдаёт ключи");
  const kk = eout(ramp(t, A("отдаёт ключи"), A("отдаёт ключи") + 0.6));
  return (
    <Svg bg="#0e0f12">
      <Cam x={960} y={560} z={tw(lt, 0, dur, 1.1, 1.2)} t={t} hand={1.5}>
        <g filter="url(#b-blur14)">
          <StreetDusk t={t} lt={lt} />
        </g>
        {!keys &&
          Array.from({ length: 12 }, (_, i) => {
            const fl = cl(lt * 5 - i * 0.4);
            return (
              <g key={i} transform={`translate(${960 + (i % 2 ? 6 : -6)} ${520 - fl * 10}) rotate(${-8 + (i % 3) * 4 - fl * 20})`}>
                <rect x={-150} y={-64} width={300} height={128} rx={6} fill="#c9cdb6" stroke="#6f7c64" strokeWidth={2} />
              </g>
            );
          })}
        {!keys && <Hand x={1240} y={600} s={1.5} rot={186} skin="#8f6448" sleeve="#6e2f25" />}
        {keys && (
          <g>
            <Hand x={lerp(1300, 1080, kk)} y={540} s={1.5} rot={186} skin="#8f6448" sleeve="#6e2f25" />
            <g transform={`translate(${lerp(1160, 940, kk)} ${560 + Math.sin(lt * 6) * 6})`}>
              <circle cx={0} cy={0} r={40} fill="none" stroke="#c9c2b0" strokeWidth={8} />
              <path d="M20 30 L80 150 L70 160 L60 140 L50 150 L40 130 L10 40 Z" fill="#c9b27a" />
              <path d="M-20 34 L-40 160 L-28 162 L-24 140 L-14 146 L-10 40 Z" fill="#a9a49a" />
            </g>
            <Hand x={lerp(600, 760, kk)} y={640} s={1.5} rot={-20} />
          </g>
        )}
      </Cam>
    </Svg>
  );
};

/* ───────── 51. «Welcome home, bro» ───────── */
export const SBro: React.FC<SP> = ({ t, lt, dur }) => {
  const m = talk(t, "Welcome home", "bro");
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 1000, 960)} y={520} z={1.0} t={t} hand={1.5}>
        <g filter="url(#b-blur14)">
          <StreetDusk t={t} lt={lt} />
        </g>
        <Profile x={980} y={560} s={1.8} id="bro" who="danny" cap face={-1} mood={m ? "talk" : "grin"} mouth={m} light="#ffcf94" lit="back" />
      </Cam>
    </Svg>
  );
};

/* ───────── 52. ключ не подходит ───────── */
export const SKeyFail: React.FC<SP> = ({ t, lt }) => {
  const j = Math.sin(lt * 22) * 6 * ramp(lt, 0.4, 0.6);
  return (
    <Svg bg="#0b0b0d">
      <Cam x={960} y={540} z={1.2} t={t} hand={2}>
        <rect width={W} height={H} fill="#3a2a22" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={i * 330} y={0} width={10} height={H} fill="#2a1d17" />
        ))}
        <Glow x={1200} y={300} r={700} k="sodium" o={0.5} />
        <rect x={860} y={420} width={200} height={300} rx={20} fill="#b9a67a" />
        <circle cx={960} cy={540} r={50} fill="#8d7a50" />
        <rect x={952} y={520} width={16} height={60} rx={6} fill="#1a1612" />
        <g transform={`translate(${960 + lerp(300, 30, eout(ramp(lt, 0, 0.4)))} 540) rotate(${j})`}>
          <path d="M0 -12 L180 -12 L180 12 L0 12 Z" fill="#c9b27a" />
          <circle cx={230} cy={0} r={56} fill="none" stroke="#c9b27a" strokeWidth={22} />
        </g>
        <Hand x={1320} y={560} s={1.3} rot={180} />
      </Cam>
    </Svg>
  );
};

/* ───────── 53. ни одна дверь ───────── */
const Brownstone: React.FC<{ x: number; y: number; seed?: number }> = ({ x, y, seed = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-240} y={-900} width={480} height={900} fill={mix("#4a3026", "#3a2620", rnd(seed))} />
    {Array.from({ length: 3 }, (_, f) =>
      Array.from({ length: 3 }, (_, c) => <rect key={`${f}${c}`} x={-200 + c * 150} y={-860 + f * 220} width={90} height={150} fill={rnd(seed + f * 3 + c) < 0.35 ? "#ffcf8e" : "#1d1a1c"} opacity={0.9} />),
    )}
    <rect x={-70} y={-260} width={140} height={200} fill="#1f1612" />
    <rect x={-74} y={-270} width={148} height={14} fill="#6a5040" />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={-110 - i * 12} y={-60 + i * 10} width={220 + i * 24} height={10} fill="#5a4034" />
    ))}
  </g>
);
export const SDoors: React.FC<SP> = ({ t, lt, dur }) => {
  const k = eio(lt / dur);
  return (
    <Svg>
      <Cam x={lerp(700, 1500, k)} y={600} z={1.15} t={t} hand={2}>
        <Sky id="drs" top="#141a26" bot="#3a3640" y1={400} />
        {Array.from({ length: 5 }, (_, i) => (
          <Brownstone key={i} x={i * 500 + 100} y={1000} seed={i + 3} />
        ))}
        <rect x={-300} y={1000} width={3200} height={200} fill="#202125" />
        <Lamp x={1150} y={1020} s={1.1} />
        <Figure x={lerp(400, 1600, k)} y={960} s={0.8} pose="walk" phase={t * 6} bag="backpack" rim="#ffcf94" rimO={0.6} dark={0.2} />
      </Cam>
    </Svg>
  );
};

/* ───────── 54. телефон Дэнни выключен ───────── */
export const SPhoneOff: React.FC<SP> = ({ t, lt }) => {
  const fail = lt > 0.9;
  return (
    <Svg bg="#07080a">
      <Cam x={960} y={540} z={tw(lt, 0, 1.8, 1.0, 1.1)} t={t} hand={2}>
        <rect width={W} height={H} fill="#0b0c0f" />
        <Phone x={960} y={540} s={0.9} id="off">
          <rect width={380} height={800} fill="#13171f" />
          <circle cx={190} cy={240} r={70} fill="#6e2f25" />
          <text x={190} y={262} fontFamily={SANS} fontSize={60} fill="#fff" textAnchor="middle">
            D
          </text>
          <text x={190} y={370} fontFamily={SANS} fontSize={34} fill="#fff" textAnchor="middle">
            Danny
          </text>
          <text x={190} y={412} fontFamily={SANS} fontSize={22} fill={fail ? "#e0574a" : "#9aa3b2"} textAnchor="middle">
            {fail ? "Абонент недоступен" : "Вызов..."}
          </text>
          <circle cx={190} cy={680} r={46} fill="#c8382c" />
          <rect x={160} y={672} width={60} height={16} rx={8} fill="#fff" />
        </Phone>
      </Cam>
    </Svg>
  );
};

/* ───────── 55. потеря ───────── */
export const SLoss: React.FC<SP> = ({ t, lt, dur }) => {
  const v = tw(t, A("Тысяча двести") + 0.2, A("Тысяча двести") + 2.2, 1340, 140, eout);
  return (
    <Svg>
      <Cam x={960} y={tw(lt, 0, dur, 640, 560)} z={tw(lt, 0, dur, 1.4, 1.05)} t={t} hand={0.8}>
        <Sky id="lss" top="#0c111b" bot="#262832" y1={400} />
        <Brownstone x={960} y={1000} seed={11} />
        <Brownstone x={460} y={1000} seed={12} />
        <Brownstone x={1460} y={1000} seed={13} />
        <rect x={-300} y={1000} width={2600} height={200} fill="#1c1d21" />
        <Glow x={960} y={780} r={300} k="sodium" o={0.5} />
        <Figure x={960} y={955} s={0.7} pose="sit" bag="backpack" hood headTilt={40} dark={0.35} rim="#ffcf94" rimO={0.7} />
      </Cam>
      <Money x={960} y={350} v={v} size={130} o={cl((t - A("Тысяча двести")) * 2)} />
    </Svg>
  );
};

/* ───────── 56. ночь, снег, Манхэттен ───────── */
export const SNightWalk: React.FC<SP> = ({ t, lt }) => {
  const off = lt * 260;
  return (
    <Svg>
      <Sky id="nw" top="#05080f" bot="#161b26" y1={700} />
      <g transform={`translate(${-off * 0.15} 0)`}>
        <Skyline y={700} seed={81} n={14} x0={-200} x1={2600} hMin={400} hMax={680} col="#121722" lit={0.4} detail={0.7} />
      </g>
      <g transform={`translate(${-off * 0.55} 0)`}>
        {Array.from({ length: 6 }, (_, i) => (
          <Tower key={i} x={i * 620 - 200} y={880} w={560} h={760} seed={i + 90} lit={0.35} col={mix("#1b1d24", "#24201f", rnd(i))} detail={1.1} />
        ))}
      </g>
      <rect x={0} y={860} width={W} height={300} fill="#14151a" />
      <rect x={0} y={860} width={W} height={20} fill="#c9ced8" opacity={0.25} />
      <g transform={`translate(${-off} 0)`}>
        {Array.from({ length: 6 }, (_, i) => (
          <Lamp key={i} x={i * 760 + 300} y={940} s={1.0} />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <Passer key={i} x={i * 900 + 600} y={950} s={0.6} t={t} seed={i} face={-1} c="#0b0c10" umbrella={i % 2 === 0} />
        ))}
      </g>
      <Figure x={900} y={950} s={0.74} pose="walk" phase={t * 4.2} bag="backpack" hood rim="#ffcf94" rimO={0.8} dark={0.3} headTilt={12} />
      <Breath x={950} y={680} t={t} dir={1} o={0.35} />
      <Snow t={t} n={200} size={2.6} speed={120} wind={-90} o={0.8} />
      <Snow t={t} n={20} size={8} speed={200} wind={-160} o={0.4} blur seed={4} />
    </Svg>
  );
};

/* ───────── 57. сигнатурный план: тысячи окон ───────── */
export const SWindows: React.FC<SP> = ({ t, lt, dur }) => {
  const k = eio(ramp(lt, 0, dur - 0.6));
  const off = ramp(t, A("И ни в одном"), A("И ни в одном") + 2.5);
  return (
    <Svg>
      <Cam x={960} y={lerp(2860, 700, k)} z={lerp(1.6, 0.42, k)} t={t} hand={0.8}>
        <Sky id="win" top="#03050b" mid="#0a0f1a" bot="#181d28" y0={-1600} y1={3200} />
        <Skyline y={3000} seed={91} n={12} x0={-2600} x1={4600} hMin={1500} hMax={3600} col="#10141d" lit={lerp(0.45, 0.12, off)} detail={2.2} />
        <Tower x={-200} y={3000} w={1100} h={3900} seed={92} lit={lerp(0.5, 0.08, off)} col="#141821" detail={1.6} t={t} blink={1} />
        <Tower x={1100} y={3000} w={1000} h={3500} seed={93} lit={lerp(0.5, 0.08, off)} col="#161a22" detail={1.6} t={t} blink={1} />
        <rect x={-2600} y={3000} width={7200} height={600} fill="#0d0e12" />
        <Lamp x={700} y={3060} s={1.2} />
        <Figure x={980} y={3040} s={0.55} pose="stand" bag="backpack" hood rim="#ffcf94" rimO={0.9} dark={0.35} lookUp={1} />
        <Snow t={t} n={260} size={4} speed={160} wind={-60} o={0.7} x0={-2600} x1={4600} y0={-600} y1={3200} />
      </Cam>
    </Svg>
  );
};

/* ───────── 58. телефон падает ───────── */
export const SPhoneDrop: React.FC<SP> = ({ t, lt }) => {
  const hit = A("Экран идёт трещинами") - 0.6;
  const fall = eio(ramp(t, A("Телефон выскальзывает"), hit));
  const after = t > hit;
  const crack = ramp(t, hit, hit + 1.8);
  return (
    <Svg bg="#06070a">
      <Cam x={960} y={lerp(380, 620, fall)} z={after ? tw(t - hit, 0, 3, 1.3, 1.6) : 1.0} t={t} hand={after && t - hit < 0.3 ? 12 : 1}>
        <rect width={W} height={H} fill="#0b0d12" />
        <rect x={0} y={760} width={W} height={400} fill="#15171c" />
        {/* мокрый асфальт, отражения фонарей */}
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={200 + i * 170} y={800} width={14} height={260} fill="#ffcf94" opacity={0.08 + rnd(i) * 0.1} filter="url(#b-blur6)" />
        ))}
        <g transform={`translate(${lerp(1000, 960, fall)} ${lerp(120, 830, fall)}) rotate(${lerp(-30, after ? -78 : 260, fall)}) scale(${after ? 1 : 0.9}, ${after ? 0.55 : 0.9})`}>
          <Phone x={0} y={0} s={0.5} crack={crack} id="drop" glow={1 - crack * 0.4}>
            <VoiceUI t={t} amp={0.05} sec={0} />
          </Phone>
        </g>
        {after && t - hit < 0.4 && <Glow x={960} y={830} r={200} k="cold" o={0.4} />}
      </Cam>
      <Snow t={t} n={70} size={2.4} speed={30} wind={-10} o={0.5} />
    </Svg>
  );
};

/* ───────── 59. скамейка ───────── */
export const SBench: React.FC<SP> = ({ t, lt, dur }) => {
  const sit = eio(ramp(lt, 0.2, 1.4));
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 820, 760)} y={760} z={tw(lt, 0, dur, 1.7, 1.9)} t={t} hand={1}>
        <UnderBridge t={t} />
        <Bench x={760} y={980} s={0.9} />
        <Figure x={lerp(900, 730, sit)} y={lerp(980, 975, sit)} s={0.62} pose={sit > 0.6 ? "sit" : "walk"} phase={t * 4} bag="backpack" hood dark={0.35} rim="#ffcf94" rimO={0.9} headTilt={sit * 20} />
        <Snow t={t} n={140} size={1.8} speed={50} wind={-20} o={0.7} />
      </Cam>
    </Svg>
  );
};

/* ───────── 60. холодные пирожки ───────── */
export const SCold: React.FC<SP> = ({ t, lt, dur }) => {
  const open = eout(ramp(lt, 0.2, 1.4));
  return (
    <Svg bg="#07080b">
      <Cam x={960} y={560} z={tw(lt, 0, dur, 1.0, 1.15)} t={t} hand={1}>
        <rect width={W} height={H} fill="#0c0e13" />
        <Glow x={500} y={300} r={800} k="sodium" o={0.45} />
        <g transform="translate(960 640)">
          <path d={`M-260 -${60 + open * 40} C-280 80 -230 180 0 180 C230 180 280 80 260 -${60 + open * 40} C160 -${90 + open * 50} -160 -${90 + open * 50} -260 -${60 + open * 40} Z`} fill="#e8e2d6" opacity={0.6} />
          {[-120, -10, 100].map((px, i) => (
            <ellipse key={i} cx={px} cy={60} rx={90} ry={54} fill={mix("#c98a48", "#8a7a6a", 0.35)} />
          ))}
        </g>
        <Hand x={lerp(500, 740, open)} y={620} s={1.6} rot={-10} />
        <Hand x={lerp(1420, 1180, open)} y={620} s={1.6} rot={190} />
        <Breath x={900} y={340} t={t} dir={1} o={0.5} />
      </Cam>
      <Snow t={t} n={50} size={5} speed={40} wind={-10} o={0.4} blur />
    </Svg>
  );
};

/* ───────── 61. воспоминание ───────── */
export const SMemory: React.FC<SP> = ({ t, lt, dur }) => {
  const mem = ramp(t, A("Звони каждый день", 1) - 0.6, A("Звони каждый день", 1)) * (1 - ramp(lt, dur - 1.6, dur - 0.4));
  const m = talk(t, "Звони каждый день", "Звони каждый день", 1, 1);
  return (
    <Svg bg="#050608">
      <Cam x={980} y={540} z={tw(lt, 0, dur, 1.0, 1.12)} t={t} hand={0.6}>
        <rect width={W} height={H} fill="#0a0c11" />
        <Glow x={300} y={300} r={800} k="sodium" o={0.4} />
        <Profile x={800} y={580} s={1.8} id="memt" hood mood="tears" light="#ffcf94" dark={0.15} tear={ramp(t, A("Звони каждый день", 1), A("Звони каждый день", 1) + 3)} />
        <g opacity={mem * 0.75}>
          <rect width={W} height={H} fill="#3a2414" opacity={0.6} />
          <Glow x={1400} y={500} r={900} k="warm" o={0.9} />
          <Profile x={1420} y={540} s={1.7} id="memm" who="mom" face={-1} mood="warm" mouth={m} lit="back" light="#ffd9a3" />
        </g>
      </Cam>
    </Svg>
  );
};

/* ───────── 62–63. голосовое и «Отправить» ───────── */
export const SVoiceMsg: React.FC<SP> = ({ t, lt }) => {
  const speak = t > A("Мам у меня", 1) - 0.1 && t < Z("как в кино", 1) + 0.1 ? 1 : 0.08;
  return (
    <Svg bg="#030407">
      <Cam x={960} y={560} z={tw(lt, 0, 5, 1.05, 1.3)} t={t} hand={3}>
        <UnderBridge t={t} />
        <rect x={-600} y={-200} width={W + 1200} height={H + 400} fill="#000" opacity={0.72} />
        <Glow x={380} y={540} r={260} k="sodium" o={0.5} />
        <Hand x={1010} y={760} s={1.3} rot={-80} sleeve="#2a313c" />
        <Phone x={1030} y={520} s={0.62} rot={-6} crack={1} id="vm">
          <VoiceUI t={t} amp={speak} sec={Math.max(0, t - A("Мам у меня", 1) + 0.3)} />
        </Phone>
      </Cam>
      <Snow t={t} n={60} size={6} speed={70} wind={30} o={0.55} blur seed={3} />
    </Svg>
  );
};
export const SSend: React.FC<SP> = ({ t, lt, dur }) => {
  const sent = ramp(lt, 0.3, 0.8);
  const off = ramp(lt, 1.4, dur - 0.3);
  return (
    <Svg bg="#000">
      <Cam x={1030} y={520} z={tw(lt, 0, dur, 1.5, 1.7)} t={t} hand={1}>
        <Phone x={1030} y={520} s={0.62} rot={-6} crack={1} id="snd" glow={1 - off}>
          <VoiceUI t={t} amp={0} sec={5} sent={sent} />
        </Phone>
      </Cam>
    </Svg>
  );
};

/* ───────── 64. рассвет ───────── */
const Diner: React.FC<{ x: number; y: number; s?: number; on?: number }> = ({ x, y, s = 1, on = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-340} width={600} height={340} fill="#3a2e2a" />
    <rect x={-270} y={-230} width={540} height={170} fill="#ffcf8e" opacity={0.85 * on} />
    <rect x={-320} y={-300} width={640} height={60} fill="#7a2c22" />
    <text x={0} y={-258} fontFamily={SERIF} fontSize={40} fill="#f3e7cf" textAnchor="middle" letterSpacing={8}>
      ARAM'S DINER
    </text>
    <Glow x={0} y={-140} r={420} k="warm" o={0.6 * on} />
  </g>
);
export const SDawn: React.FC<SP> = ({ t, lt, dur }) => {
  const d = tw(lt, 0, dur + 2, 0.35, 0.8);
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 900, 860)} y={720} z={1.35} t={t}>
        <UnderBridge t={t} dawn={d} snow={0.5} />
        <Diner x={330} y={800} s={0.7} />
        <Bench x={760} y={980} s={0.9} />
        <Figure x={760} y={965} s={0.62} pose="sit" bag="backpack" hood dark={0.25} headTilt={46} rim="#ffd9b8" rimO={0.5} />
      </Cam>
    </Svg>
  );
};

/* ───────── 65. Арам ───────── */
export const SAram: React.FC<SP> = ({ t, lt, dur }) => {
  const walk = eio(ramp(lt, 0, 2.4));
  const put = eio(ramp(lt, 2.4, 3.4));
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 700, 760)} y={740} z={1.7} t={t} hand={1}>
        <UnderBridge t={t} dawn={0.85} snow={0.4} lamp={0} />
        <Diner x={330} y={800} s={0.7} on={0.7} />
        <Bench x={760} y={980} s={0.9} />
        <Figure x={760} y={965} s={0.62} pose="sit" bag="backpack" hood dark={0.2} headTilt={lerp(46, 10, ramp(lt, 3, 4))} rim="#ffd9b8" rimO={0.5} />
        <Figure x={lerp(300, 900, walk)} y={980} s={0.64} who="aram" pose={walk < 1 ? "walk" : "stand"} phase={t * 4} face={walk < 1 ? 1 : -1} rim="#ffd9b8" rimO={0.5} armUp={put * 0.35} />
        <g opacity={put}>
          <rect x={800} y={880} width={26} height={34} fill="#efe8da" />
          <rect x={798} y={876} width={30} height={6} fill="#2a2a2a" />
          <g filter="url(#b-blur6)" opacity={0.5}>
            <circle cx={812 + Math.sin(t * 2) * 4} cy={850 - (t * 20) % 30} r={8} fill="#fff" />
          </g>
        </g>
      </Cam>
      <NameCard x={260} y={760} name="АРАМ" sub="ХОЗЯИН ЗАКУСОЧНОЙ НА УГЛУ" lt={lt} at={0.6} />
    </Svg>
  );
};
export const SAramTalk: React.FC<SP> = ({ t, lt, dur }) => {
  const m = talk(t, "Русский", "Наличными");
  const listen = t > A("Посуду мыть") && t < A("Двенадцать долларов");
  return (
    <Svg>
      <Cam x={listen ? 760 : 1160} y={540} z={tw(lt, 0, dur, 1.0, 1.08)} t={t} hand={1}>
        <rect x={-600} width={W + 1200} height={H} fill="#6a5a58" />
        <Glow x={200} y={600} r={1100} k="warm" o={0.7} />
        <g filter="url(#b-blur14)">
          <rect x={-600} y={700} width={W + 1200} height={400} fill="#4a4040" />
        </g>
        <Profile x={600} y={600} s={1.7} id="at-t" hood mood={listen ? "neutral" : "tired"} light="#ffd9b8" lit="front" look={1} />
        <Profile x={1380} y={560} s={1.7} id="at-a" who="aram" face={-1} mood={m ? "talk" : "warm"} mouth={m} lit="back" light="#ffd9b8" />
      </Cam>
    </Svg>
  );
};

/* ───────── 67. стакан ───────── */
export const SCupLook: React.FC<SP> = ({ t, lt }) => (
  <Svg bg="#2a2220">
    <Cam x={960} y={560} z={tw(lt, 0, 1.8, 1.0, 1.1)} t={t}>
      <rect width={W} height={H} fill="#5e5250" />
      <Glow x={400} y={400} r={1000} k="warm" o={0.6} />
      <rect x={0} y={700} width={W} height={400} fill="#3a2e2a" />
      <rect x={200} y={690} width={1520} height={30} fill="#2a2220" />
      <g transform="translate(960 700)">
        <path d="M-110 0 L-130 -360 L130 -360 L110 0 Z" fill="#efe8da" />
        <rect x={-142} y={-390} width={284} height={40} rx={8} fill="#2a2a2a" />
        <rect x={-122} y={-250} width={244} height={90} fill="#7a2c22" />
        <g filter="url(#b-blur14)" opacity={0.6}>
          {Array.from({ length: 6 }, (_, i) => {
            const k = ((t * 0.4 + i / 6) % 1);
            return <circle key={i} cx={Math.sin(i * 2 + t) * 30} cy={-420 - k * 300} r={30 + k * 40} fill="#fff" opacity={1 - k} />;
          })}
        </g>
      </g>
    </Cam>
  </Svg>
);

/* ───────── 68. мост на рассвете ───────── */
export const SBridgeDawn: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 1300, 1200)} y={tw(lt, 0, dur, 460, 420)} z={1.15} t={t}>
      <UnderBridge t={t} dawn={1} snow={0} lamp={0} />
    </Cam>
  </Svg>
);

/* ───────── 69. встаёт и идёт ───────── */
export const SRise: React.FC<SP> = ({ t, lt, dur }) => {
  const up = eio(ramp(t, A("Но это начало"), A("Но это начало") + 1.2));
  const go = ramp(lt, 3.2, dur);
  return (
    <Svg>
      <Cam x={tw(lt, 0, dur, 760, 600)} y={tw(lt, 0, dur, 760, 640)} z={tw(lt, 0, dur, 1.6, 1.15)} t={t}>
        <UnderBridge t={t} dawn={1} snow={0.2} lamp={0} />
        <Diner x={330} y={800} s={0.7} on={0.6} />
        <Bench x={760} y={980} s={0.9} />
        <Figure x={lerp(760, 300, go)} y={lerp(965, 980, up)} s={0.62} pose={go > 0 ? "walk" : up > 0.5 ? "stand" : "sit"} phase={t * 4.6} face={go > 0 || up > 0.5 ? -1 : 1} bag="backpack" hood={false} dark={0.15} rim="#ffd9b8" rimO={0.7} lookUp={up * (1 - go) * 0.6} />
      </Cam>
    </Svg>
  );
};

/* ───────── 70. финальный общий ───────── */
export const SOutro: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={960} y={tw(lt, 0, dur, 640, 520)} z={tw(lt, 0, dur, 1.0, 1.12)} t={t}>
      <Sky id="out" top="#5d6578" mid="#a9969a" bot="#e1b294" y1={760} />
      <Glow x={1500} y={700} r={700} k="warm" o={0.6} sy={0.5} />
      <Skyline y={760} seed={101} n={22} hMin={160} hMax={620} col="#4a4a58" lit={0.05} detail={0.6} spire />
      <rect x={-400} y={760} width={W + 800} height={400} fill="#6a6470" />
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={i * 70} y={780 + rnd(i) * 200} width={40 + rnd(i * 2) * 80} height={2} fill="#ffd9b8" opacity={0.3} />
      ))}
    </Cam>
  </Svg>
);

/* ───────── 71. анонс: ночная смена ───────── */
export const STeaser: React.FC<SP> = ({ t, lt }) => {
  const shot = Math.floor(lt / 1.4) % 3;
  return (
    <Svg bg="#000">
      <Cam x={960} y={540} z={1.1 + (lt % 1.4) * 0.05} t={t} hand={3}>
        {shot === 0 && (
          <g>
            <rect width={W} height={H} fill="#1a1c20" />
            <Glow x={960} y={300} r={700} k="cold" o={0.5} />
            <rect x={400} y={600} width={1100} height={400} fill="#8a9098" />
            <rect x={440} y={620} width={1020} height={340} fill="#3a4048" />
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} cx={560 + i * 110} cy={700 + (i % 2) * 40} rx={70} ry={20} fill="#e9e4da" />
            ))}
            <Steam x={960} y={700} s={0.6} t={t} stack={false} o={0.6} />
          </g>
        )}
        {shot === 1 && (
          <g>
            <rect width={W} height={H} fill="#121417" />
            <circle cx={960} cy={540} r={260} fill="#e9e4da" />
            <circle cx={960} cy={540} r={250} fill="none" stroke="#2a2a2a" strokeWidth={8} />
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={956} y={300} width={8} height={30} fill="#2a2a2a" transform={`rotate(${i * 30} 960 540)`} />
            ))}
            <line x1={960} y1={540} x2={960} y2={380} stroke="#1a1a1a" strokeWidth={10} transform={`rotate(90 960 540)`} />
            <line x1={960} y1={540} x2={960} y2={330} stroke="#1a1a1a" strokeWidth={6} transform={`rotate(${lt * 120} 960 540)`} />
          </g>
        )}
        {shot === 2 && (
          <g>
            <rect width={W} height={H} fill="#16120f" />
            <Glow x={960} y={400} r={800} k="warm" o={0.5} />
            <rect x={200} y={300} width={1520} height={30} fill="#9aa0a6" />
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} x={300 + i * 280} y={330} width={200} height={260} fill="#efe8da" transform={`rotate(${-3 + i * 1.5} ${400 + i * 280} 330)`} />
            ))}
          </g>
        )}
      </Cam>
    </Svg>
  );
};

/* ───────── 72. человек, который знает слишком много ───────── */
export const SWatcher: React.FC<SP> = ({ t, lt, dur }) => {
  const photo = eout(ramp(lt, 1.2, 2.2));
  return (
    <Svg bg="#000">
      <Cam x={tw(lt, 0, dur, 900, 1060)} y={560} z={tw(lt, 0, dur, 1.0, 1.25)} t={t} hand={0.6}>
        <rect width={W} height={H} fill="#06070a" />
        {/* лобовое стекло, дождь */}
        <Glow x={1500} y={300} r={600} k="sodium" o={0.35} />
        <rect x={200} y={180} width={1520} height={520} fill="#0f131b" />
        <Skyline y={700} seed={111} n={10} x0={200} x1={1720} hMin={200} hMax={480} col="#0a0d12" lit={0.25} detail={0.6} />
        <rect x={200} y={180} width={1520} height={520} fill="none" stroke="#050505" strokeWidth={40} />
        <rect x={0} y={700} width={W} height={400} fill="#0a0a0c" />
        {/* силуэт */}
        <ellipse cx={560} cy={540} rx={150} ry={180} fill="#020203" />
        <rect x={360} y={640} width={420} height={300} rx={60} fill="#020203" />
        <circle cx={620} cy={500} r={4} fill="#ffd9a0" opacity={0.7} />
        {/* фото на приборной панели */}
        <g transform={`translate(1200 ${lerp(820, 760, photo)}) rotate(-6)`} opacity={photo}>
          <rect x={-130} y={-90} width={260} height={180} fill="#d9d3c6" />
          <rect x={-114} y={-76} width={228} height={130} fill="#3a3e48" />
          <g transform="translate(0 -6) scale(0.32)">
            <Profile x={0} y={0} s={1} id="wphoto" hood mood="neutral" lit="front" light="#cfd8e6" />
          </g>
          <text x={0} y={78} fontFamily={SANS} fontSize={14} fill="#3a3630" textAnchor="middle" letterSpacing={2}>
            JFK · NOV 27
          </text>
        </g>
      </Cam>
    </Svg>
  );
};

/* ───────── 73. финальный титр ───────── */
export const SEndCard: React.FC<SP> = ({ t, lt }) => {
  const a = eout(ramp(lt, 0.3, 1.5));
  const b = eout(ramp(lt, 2.0, 3.0));
  return (
    <Svg bg="#000">
      <Snow t={t} n={70} size={2.2} speed={30} wind={12} o={0.45} />
      <Spaced x={960} y={520} text="БИЛЕТ В ОДИН КОНЕЦ" size={80} sp={lerp(0.45, 0.3, a)} o={a} />
      <rect x={960 - 200 * b} y={560} width={400 * b} height={1.5} fill="#cfc5b2" />
      <Spaced x={960} y={612} text="КОНЕЦ ПЕРВОЙ СЕРИИ" size={26} sp={0.45} o={b} font={SANS} fill="#bfb6a6" />
    </Svg>
  );
};

