import React from "react";
import { Cam, Glow, H, NameCard, SANS, SERIF, Snow, Spaced, Svg, W, cl, eio, eout, lerp, mix, nz, ramp, rnd, tw, type SP } from "./core";
import { Bench, BridgeSpan, BridgeTower, Lamp, Panelka, Phone, Screen, Skyline, Sky, Taxi } from "./env";
import { Figure, Profile } from "./figures";
import { Bill, Breath, Hand, Money, Passport, Tree, Wave, talk } from "./props";
import { A, Z } from "./timeline";

/* ───────── общий фон: набережная под мостом ───────── */
export const UnderBridge: React.FC<{ t: number; dawn?: number; snow?: number; lamp?: number }> = ({ t, dawn = 0, snow = 1, lamp = 1 }) => {
  const sky1 = mix("#070c16", "#5d6578", dawn);
  const sky2 = mix("#18202e", "#c79a86", dawn);
  const lit = lerp(0.38, 0.12, dawn);
  return (
    <g>
      <Sky id={`ub${Math.round(dawn * 10)}`} top={sky1} mid={mix("#0f1624", "#9a8c92", dawn)} bot={sky2} y1={700} />
      {dawn > 0 && <Glow x={300} y={660} r={700} k="warm" o={0.45 * dawn} sy={0.4} />}
      <Skyline y={650} seed={4} n={22} hMin={90} hMax={380} col={mix("#1b2130", "#4a4c5a", dawn)} lit={lit} detail={0.55} spire />
      {/* река */}
      <rect x={-600} y={650} width={W + 1200} height={160} fill={mix("#0b111b", "#5f6474", dawn)} />
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={-200 + i * 60 + nz(t * 0.5 + i, i) * 8} y={660 + rnd(i) * 120} width={2 + rnd(i * 3) * 24} height={2} fill="#ffcf94" opacity={0.25 * (1 - dawn * 0.6)} />
      ))}
      <BridgeSpan x0={-800} x1={1430} top={170} deck={470} col={mix("#141518", "#3a3638", dawn)} cable={mix("#2e2f34", "#5a5458", dawn)} lamps={dawn < 0.6} />
      <BridgeTower x={1430} y={810} s={1.05} col={mix("#3a3532", "#8a7a6e", dawn)} lightO={0.2 * (1 - dawn) + 0.15} />
      {/* набережная */}
      <rect x={-600} y={800} width={W + 1200} height={400} fill={mix("#15171b", "#4b4744", dawn)} />
      <rect x={-600} y={800} width={W + 1200} height={6} fill={mix("#2a2c31", "#7a706a", dawn)} />
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={-600 + i * 110} y={770} width={6} height={34} fill={mix("#1e2025", "#5a524e", dawn)} />
      ))}
      <rect x={-600} y={768} width={W + 1200} height={6} fill={mix("#23252b", "#5a524e", dawn)} />
      <Lamp x={380} y={980} s={1.2} on={lamp * (1 - dawn * 0.8)} />
      {snow > 0 && <rect x={-600} y={950} width={W + 1200} height={200} fill="#cfd5de" opacity={0.08 * snow} />}
    </g>
  );
};

/* ───────── 1. крючок: телефон в темноте ───────── */
export const VoiceUI: React.FC<{ t: number; amp: number; sec: number; sent?: number }> = ({ t, amp, sec, sent = 0 }) => (
  <g>
    <rect width={380} height={800} fill="#10141c" />
    <rect width={380} height={90} fill="#171c26" />
    <circle cx={44} cy={52} r={22} fill="#6b5a62" />
    <text x={80} y={48} fontFamily={SANS} fontSize={22} fill="#e8e4dc">
      Мама
    </text>
    <text x={80} y={72} fontFamily={SANS} fontSize={15} fill="#8d95a3">
      была в сети вчера
    </text>
    <rect x={130} y={140} width={230} height={60} rx={18} fill="#232a36" />
    <text x={150} y={177} fontFamily={SANS} fontSize={17} fill="#c9ccd3">
      Ты как? Позвони
    </text>
    <rect x={150} y={220} width={210} height={60} rx={18} fill="#232a36" />
    <text x={170} y={257} fontFamily={SANS} fontSize={17} fill="#c9ccd3">
      Тимочка, ответь
    </text>
    {sent > 0 && (
      <g opacity={cl(sent * 3)} transform={`translate(0 ${(1 - eout(sent * 2)) * 30})`}>
        <rect x={40} y={560} width={300} height={70} rx={20} fill="#3a4a5e" />
        <Wave x={66} y={595} w={200} t={2} amp={0.45} n={24} />
        <text x={316} y={620} fontFamily={SANS} fontSize={13} fill="#c9d4e4" textAnchor="end">
          0:{String(Math.floor(sec)).padStart(2, "0")} ✓✓
        </text>
      </g>
    )}
    {sent === 0 && (
      <g>
        <rect x={20} y={680} width={340} height={90} rx={45} fill="#1d232e" />
        <circle cx={60} cy={725} r={10} fill="#d8453a" opacity={0.6 + 0.4 * Math.sin(t * 6)} />
        <text x={80} y={732} fontFamily={SANS} fontSize={20} fill="#e8e4dc">
          0:{String(Math.floor(sec)).padStart(2, "0")}
        </text>
        <Wave x={140} y={725} w={150} t={t} amp={amp} n={22} />
        <circle cx={326} cy={725} r={32} fill="#3d6fb0" />
        <rect x={318} y={706} width={16} height={26} rx={8} fill="#fff" />
      </g>
    )}
  </g>
);

export const SHookPhone: React.FC<SP> = ({ t, lt }) => {
  const on = ramp(lt, 0.15, 0.4);
  const speak = t > A("Мам у меня") - 0.1 && t < Z("как в кино") + 0.1 ? 1 : 0.08;
  const z = tw(lt, 0, 5.5, 1.25, 1.05);
  return (
    <Svg bg="#030407">
      <Cam x={960} y={560} z={z} hand={6} t={t}>
        <UnderBridge t={t} />
        <rect x={-600} y={-200} width={W + 1200} height={H + 400} fill="#000" opacity={0.72} />
        <Glow x={380} y={540} r={260} k="sodium" o={0.5} />
        <Hand x={1010} y={760} s={1.3} rot={-80} sleeve="#2a313c" />
        <Phone x={1030} y={520} s={0.62} rot={-6} crack={1} glow={on} id="hook">
          <VoiceUI t={t} amp={speak} sec={lt > 2.6 ? lt - 2.6 : 0} />
        </Phone>
        <Breath x={760} y={420} t={t + 1} dir={1} o={0.35} />
      </Cam>
      <Snow t={t} n={60} size={6} speed={70} wind={30} o={0.55} blur seed={3} />
      <rect width={W} height={H} fill="#fff" opacity={0.6 * (1 - ramp(lt, 0.12, 0.5)) * ramp(lt, 0.1, 0.14)} />
    </Svg>
  );
};

/* ───────── 2. общий план: мост, скамейка ───────── */
export const SBridgeWide: React.FC<SP> = ({ t, lt, dur }) => {
  const k = eio(lt / dur);
  return (
    <Svg>
      <Cam x={lerp(780, 900, k)} y={lerp(800, 600, k)} z={lerp(1.7, 1.05, k)} t={t} hand={1.5}>
        <UnderBridge t={t} />
        <Bench x={760} y={980} s={0.9} />
        <Figure x={730} y={975} s={0.62} pose="sit" bag="backpack" hood dark={0.35} rim="#ffcf94" rimO={0.9} headTilt={28} />
        <Snow t={t} n={140} size={2.6} speed={60} wind={24} o={0.7} y0={100} y1={1100} />
      </Cam>
      <Snow t={t} n={24} size={7} speed={110} wind={40} o={0.4} blur seed={9} />
    </Svg>
  );
};

/* ───────── 3. карман: $40 и разбитый телефон ───────── */
export const SPocket: React.FC<SP> = ({ t, lt }) => (
  <Svg bg="#07090d">
    <Cam x={960} y={560} z={tw(lt, 0, 3.2, 1.15, 1.0)} t={t} hand={3}>
      <rect width={W} height={H} fill="#0b0e14" />
      <Glow x={1300} y={300} r={900} k="sodium" o={0.5} />
      <Hand x={980} y={600} s={1.6} rot={-12} sleeve="#262d37" />
      <Bill x={1040} y={520} s={1.25} rot={-18} />
      <Bill x={1090} y={560} s={1.25} rot={-8} />
      <g transform="translate(700 700) rotate(14)">
        <Phone x={0} y={0} s={0.42} crack={1} glow={0.25} id="pocket">
          <rect width={380} height={800} fill="#0c1016" />
          <text x={190} y={380} fontFamily={SANS} fontSize={64} fill="#d8dce4" textAnchor="middle" opacity={0.6}>
            02:47
          </text>
          <rect x={150} y={420} width={80} height={24} rx={6} fill="none" stroke="#d24a3a" strokeWidth={3} />
          <rect x={154} y={424} width={10} height={16} fill="#d24a3a" />
        </Phone>
      </g>
    </Cam>
    <Snow t={t} n={40} size={6} speed={70} wind={20} o={0.4} blur />
  </Svg>
);

/* ───────── 4. титр ───────── */
export const STitle: React.FC<SP> = ({ t, lt, dur }) => {
  const a = eout(ramp(lt, 0.2, 1.4));
  const b = eout(ramp(lt, 1.4, 2.4));
  const out = 1 - ramp(lt, dur - 0.6, dur);
  return (
    <Svg bg="#000">
      <Snow t={t} n={90} size={2.4} speed={40} wind={16} o={0.5} />
      <g opacity={out}>
        <Spaced x={960} y={540} text="БИЛЕТ В ОДИН КОНЕЦ" size={86} sp={lerp(0.5, 0.3, a)} o={a} />
        <rect x={960 - 220 * b} y={580} width={440 * b} height={1.5} fill="#cfc5b2" />
        <Spaced x={960} y={630} text="СЕРИЯ ПЕРВАЯ  ·  ДОБРО ПОЖАЛОВАТЬ" size={24} sp={0.42} o={b} font={SANS} fill="#bfb6a6" />
      </g>
    </Svg>
  );
};

/* ───────── 5. снег → Москва (переход через снег) ───────── */
export const MoscowYard: React.FC<{ t: number; pan?: number; night?: number }> = ({ t, pan = 0, night = 0 }) => (
  <g>
    <Sky id={`msk${Math.round(night * 10)}`} top={mix("#8e949c", "#141821", night)} mid={mix("#a6aab0", "#1d222c", night)} bot={mix("#b9bbbd", "#262b34", night)} y1={900} />
    <g transform={`translate(${-pan * 0.2} 0)`}>
      <Panelka x={-300} y={720} w={700} floors={16} fh={26} seed={2} col={mix("#9a9ea4", "#2b2f36", night)} lit={lerp(0.12, 0.42, night)} night={night} />
      <Panelka x={520} y={720} w={900} floors={14} fh={26} seed={5} col={mix("#a3a5a8", "#30343b", night)} lit={lerp(0.1, 0.4, night)} night={night} />
      <Panelka x={1540} y={720} w={800} floors={17} fh={26} seed={8} col={mix("#979ba2", "#2a2e35", night)} lit={lerp(0.12, 0.42, night)} night={night} />
    </g>
    <g transform={`translate(${-pan * 0.6} 0)`}>
      <Panelka x={-500} y={860} w={1100} floors={9} fh={52} seed={11} col={mix("#b1aea8", "#383a3e", night)} lit={lerp(0.15, 0.5, night)} night={night} />
      <Panelka x={1500} y={860} w={1300} floors={9} fh={52} seed={13} col={mix("#aaa8a3", "#35373b", night)} lit={lerp(0.15, 0.5, night)} night={night} />
      <Tree x={900} y={880} s={1.3} seed={3} col={mix("#3b3d40", "#101114", night)} />
      <Tree x={1260} y={890} s={1.0} seed={7} col={mix("#3b3d40", "#101114", night)} />
    </g>
    <rect x={-600} y={860} width={W + 1800} height={400} fill={mix("#6d6e6e", "#1a1c20", night)} />
    <rect x={-600} y={860} width={W + 1800} height={30} fill={mix("#c9cbcd", "#3a3d43", night)} opacity={0.8} />
    {Array.from({ length: 16 }, (_, i) => (
      <ellipse key={i} cx={-200 + i * 220 - pan * 1.0} cy={930 + rnd(i) * 80} rx={60 + rnd(i * 2) * 80} ry={8} fill={mix("#4b4c4d", "#0d0e10", night)} opacity={0.6} />
    ))}
  </g>
);

export const SSnowMatch: React.FC<SP> = ({ t, lt, dur }) => {
  const white = Math.sin(ramp(lt, 0, dur * 0.7) * Math.PI);
  return (
    <Svg>
      <Cam x={960} y={lerp(300, 540, eio(lt / dur))} z={1.2} t={t}>
        <MoscowYard t={t} pan={lt * 20} />
        <Snow t={t} n={180} size={3} speed={150} wind={-30} o={0.8} c="#e8eaec" />
      </Cam>
      <rect width={W} height={H} fill="#000" opacity={1 - ramp(lt, 0, 1.2)} />
      <Snow t={t} n={240} size={5} speed={220} wind={-60} o={0.4 + white * 0.6} seed={5} />
      <rect width={W} height={H} fill="#e9ebee" opacity={white * 0.75} />
    </Svg>
  );
};

/* ───────── 6. Москва, общий ───────── */
export const SMoscowWide: React.FC<SP> = ({ t, lt, dur }) => {
  const pan = lerp(0, 300, eio(lt / dur));
  return (
    <Svg>
      <Cam x={960 + pan * 0.3} y={560} z={1.05} t={t} hand={1}>
        <MoscowYard t={t} pan={pan} />
        <Figure x={1400 - lt * 60} y={960} s={0.42} face={-1} who="crowd" pose="walk" phase={t * 5} dark={0.2} rimO={0} />
        <Figure x={300 + lt * 40} y={990} s={0.46} face={1} who="mom" pose="walk" phase={t * 4.6 + 1} dark={0.25} rimO={0} bag="handbag" />
        <Snow t={t} n={170} size={2.6} speed={170} wind={-40} o={0.75} c="#e8eaec" />
      </Cam>
      <Snow t={t} n={20} size={7} speed={260} wind={-60} o={0.4} blur seed={7} />
    </Svg>
  );
};

/* ───────── 7. Тимур, курьер ───────── */
const Scooter: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120 -20 L120 -20 L130 -10 L-130 -10 Z" fill="#1d2027" />
    <path d="M110 -20 L80 -300" stroke="#2a2e36" strokeWidth={12} />
    <path d="M60 -300 L110 -300" stroke="#2a2e36" strokeWidth={10} strokeLinecap="round" />
    {[-110, 110].map((wx) => (
      <g key={wx} transform={`translate(${wx} 0) rotate(${(t * 700) % 360})`}>
        <circle r={28} fill="#111" />
        <circle r={10} fill="#666" />
        <line x1={-10} x2={10} stroke="#444" strokeWidth={3} />
      </g>
    ))}
  </g>
);

export const STimurCard: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 1000, 1060)} y={640} z={tw(lt, 0, dur, 1.5, 1.62)} t={t} hand={2}>
      <MoscowYard t={t} pan={80} />
      <Scooter x={1180} y={960} s={0.9} />
      <Figure x={1020} y={960} s={0.9} pose="stand" bag="courier" hood face={1} rim="#e6ecf4" rimO={0.4} headTilt={-4} />
      <Breath x={1060} y={640} t={t} dir={1} o={0.45} />
      <Snow t={t} n={160} size={2.6} speed={150} wind={-30} o={0.7} c="#e8eaec" />
    </Cam>
    <NameCard x={260} y={760} name="ТИМУР" sub="21 ГОД · КУРЬЕР · МОСКВА" lt={lt} at={0.3} />
  </Svg>
);

/* ───────── 8. трекинг: самокат ───────── */
export const SScooter: React.FC<SP> = ({ t, lt }) => {
  const off = lt * 900;
  return (
    <Svg>
      <Sky id="scoot" top="#8a9098" bot="#b4b6b8" y1={800} />
      <g transform={`translate(${-off * 0.15} 0)`}>
        <Panelka x={-200} y={760} w={1600} floors={16} fh={26} seed={21} col="#9a9ea4" lit={0.15} />
        <Panelka x={1500} y={760} w={1600} floors={14} fh={26} seed={22} col="#a1a3a6" lit={0.15} />
      </g>
      <g transform={`translate(${-off * 0.5} 0)`}>
        {Array.from({ length: 8 }, (_, i) => (
          <Tree key={i} x={i * 520} y={880} s={1.2} seed={i + 4} col="#3b3d40" />
        ))}
      </g>
      <rect x={0} y={860} width={W} height={300} fill="#5d5f61" />
      <g transform={`translate(${-off} 0)`}>
        {Array.from({ length: 14 }, (_, i) => (
          <g key={i}>
            <rect x={i * 360} y={900} width={120} height={6} fill="#d7d9db" opacity={0.6} />
            <Lamp x={i * 720 + 200} y={880} s={0.9} on={0} col="#2f3236" />
          </g>
        ))}
      </g>
      <Scooter x={960} y={960} s={0.85} t={t} />
      <Figure x={930} y={948} s={0.82} pose="stand" bag="courier" hood face={1} rimO={0.3} rim="#e6ecf4" headTilt={6} />
      <g filter="url(#b-blur2)" opacity={0.7}>
        {Array.from({ length: 10 }, (_, i) => {
          const k = (lt * 3 + i / 10) % 1;
          return <circle key={i} cx={840 - k * 260} cy={950 - Math.sin(k * Math.PI) * 50} r={4 + k * 6} fill="#9aa0a6" opacity={1 - k} />;
        })}
      </g>
      <g transform={`translate(${-off * 1.6} 0)`} filter="url(#b-blur6)">
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={i * 900 + 300} y={600} width={40} height={600} fill="#1a1c1f" />
        ))}
      </g>
      <Snow t={t} n={160} size={2.6} speed={150} wind={-500} o={0.7} c="#e8eaec" />
    </Svg>
  );
};

/* ───────── 9. кухня ночью ───────── */
const Kitchen: React.FC<{ t: number; screen?: number; momIn?: number }> = ({ t, screen = 1 }) => (
  <g>
    <rect width={W} height={H} fill="#1a1716" />
    {/* окно */}
    <g>
      <rect x={1180} y={180} width={560} height={520} fill="#0e131c" />
      <g transform="translate(1180 180) scale(0.3)">
        <rect width={1870} height={1740} fill="#121824" />
        <Panelka x={100} y={1500} w={900} floors={20} fh={60} seed={31} col="#242a33" lit={0.45} night={1} />
        <Panelka x={1100} y={1600} w={760} floors={22} fh={60} seed={33} col="#262b33" lit={0.4} night={1} />
      </g>
      <Snow t={t} n={40} size={2} speed={50} wind={-20} o={0.6} x0={1180} x1={1740} y0={180} y1={700} />
      <rect x={1180} y={180} width={560} height={520} fill="none" stroke="#3a332e" strokeWidth={22} />
      <rect x={1452} y={180} width={16} height={520} fill="#3a332e" />
      <rect x={1150} y={700} width={620} height={26} fill="#4a413a" />
    </g>
    {/* шкафчики, плитка */}
    <rect x={0} y={150} width={1080} height={300} fill="#2a2522" />
    {Array.from({ length: 5 }, (_, i) => (
      <rect key={i} x={20 + i * 212} y={170} width={196} height={260} fill="#332d29" stroke="#241f1c" strokeWidth={4} />
    ))}
    <rect x={0} y={450} width={1180} height={250} fill="#3b3631" />
    {Array.from({ length: 12 }, (_, i) => Array.from({ length: 5 }, (_, j) => <rect key={`${i}${j}`} x={i * 100} y={450 + j * 50} width={98} height={48} fill="#45403a" />))}
    {/* лампа над столом */}
    <path d="M760 0 L760 120" stroke="#111" strokeWidth={3} />
    <path d="M700 120 L820 120 L790 160 L730 160 Z" fill="#26211d" />
    <Glow x={760} y={170} r={420} k="warm" o={0.35} sy={0.8} />
    {/* стол */}
    <rect x={300} y={760} width={1300} height={30} fill="#4b3a2c" />
    <rect x={300} y={790} width={1300} height={300} fill="#2b221b" />
    {/* ноутбук */}
    <g transform="translate(980 760)">
      <path d="M-200 0 L200 0 L220 14 L-220 14 Z" fill="#2c2f35" />
      <path d={`M-190 0 L-180 ${-250 * screen} L180 ${-250 * screen} L190 0 Z`} fill="#22252b" />
      <path d={`M-176 -8 L-168 ${-240 * screen} L168 ${-240 * screen} L176 -8 Z`} fill="#bcd0ec" opacity={0.85 * screen} />
      <Glow x={0} y={-120} r={500} k="screen" o={0.9 * screen} />
    </g>
    <rect x={1600} y={720} width={60} height={40} rx={6} fill="#8a8580" />
  </g>
);

export const SKitchen: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 960, 900)} y={tw(lt, 0, dur, 560, 520)} z={tw(lt, 0, dur, 1.0, 1.22)} t={t} hand={1}>
      <Kitchen t={t} />
      <g>
        <Profile x={640} y={520} s={0.95} id="kit" headphones mood="neutral" lit="front" light="#cfe0ff" dark={0.15} />
      </g>
    </Cam>
  </Svg>
);

/* ───────── 10. ноутбук: видео Нью-Йорка (кадр в кадре) ───────── */
export const MiniNY: React.FC<{ t: number; mode: number }> = ({ t, mode }) => (
  <g>
    {mode === 0 && (
      <g>
        <Sky id="mny0" top="#7d8aa0" bot="#e0c4a0" y1={1080} />
        <Skyline y={900} seed={7} n={14} hMin={300} hMax={820} col="#3a3e4a" lit={0.25} />
        <rect y={900} width={W} height={180} fill="#2c2e33" />
      </g>
    )}
    {mode === 1 && (
      <g>
        <rect width={W} height={H} fill="#5c5a58" />
        <Skyline y={700} seed={9} n={10} hMin={500} hMax={900} col="#4a4a50" lit={0.2} />
        <rect y={700} width={W} height={400} fill="#3a3b3f" />
        <Taxi x={((t * 700) % 2600) - 300} y={960} s={1.6} t={t} />
        <Taxi x={((t * 520 + 1300) % 2600) - 300} y={880} s={1.2} t={t} face={-1} />
      </g>
    )}
    {mode === 2 && (
      <g>
        <Sky id="mny2" top="#a8b4c4" bot="#f0d6b4" y1={1080} />
        <Skyline y={800} seed={4} n={16} hMin={200} hMax={600} col="#6a6e7c" lit={0} />
        <rect y={800} width={W} height={300} fill="#7a8494" />
        <BridgeSpan x0={-400} x1={1300} top={240} deck={620} col="#3a3634" cable="#4a4440" lamps={false} />
        <BridgeTower x={1300} y={900} s={1.0} col="#8a7a6c" />
      </g>
    )}
  </g>
);

export const SLaptop: React.FC<SP> = ({ t, lt, dur }) => {
  const mode = t < A("Жёлтые такси") ? 0 : t < A("Бруклинский мост") ? 1 : 2;
  return (
    <Svg bg="#0c0b0b">
      <Cam x={960} y={540} z={tw(lt, 0, dur, 1.0, 1.12)} t={t} hand={1.5}>
        <rect width={W} height={H} fill="#141210" />
        <Screen x={300} y={160} w={1320} h={760} id="lap">
          <g transform="translate(300 160) scale(0.6875 0.7037)">
            <MiniNY t={t} mode={mode} />
          </g>
          <rect x={300} y={860} width={1320} height={60} fill="#000" opacity={0.6} />
          <rect x={330} y={886} width={1260} height={6} fill="#555" />
          <rect x={330} y={886} width={1260 * (0.2 + lt / dur * 0.3)} height={6} fill="#d24a3a" />
        </Screen>
        <rect x={290} y={150} width={1340} height={780} fill="none" stroke="#1c1e22" strokeWidth={22} />
        {/* отражение лица и наушник на переднем плане */}
        <g opacity={0.12}>
          <Profile x={760} y={560} s={1.3} id="lapref" headphones dark={0.6} />
        </g>
        <g filter="url(#b-blur14)">
          <ellipse cx={130} cy={700} rx={230} ry={520} fill="#060606" />
        </g>
      </Cam>
    </Svg>
  );
};

/* ───────── 11. лицо, освещённое экраном ───────── */
export const SDreamFace: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg bg="#06080c">
    <Cam x={tw(lt, 0, dur, 1000, 1040)} y={520} z={tw(lt, 0, dur, 1.0, 1.08)} t={t} hand={1}>
      <rect width={W} height={H} fill="#090b10" />
      <Glow x={1700} y={560} r={900} k="screen" o={0.8} />
      <Profile x={980} y={560} s={1.9} id="dream" headphones mood={lt > 0.8 ? "smile" : "neutral"} light="#d6e4ff" blink={lt > 1.2 && lt < 1.32 ? 1 : 0} />
      <g opacity={0.35}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={1490 + i * 8} y={470 + (i % 3) * 6} width={4} height={4} fill="#ffd9a0" />
        ))}
      </g>
    </Cam>
  </Svg>
);

/* ───────── 12. мама приходит ───────── */
export const SMomHome: React.FC<SP> = ({ t, lt, dur }) => {
  const door = eout(ramp(lt, 0.1, 1.2));
  return (
    <Svg bg="#0d0c0c">
      <Cam x={tw(lt, 0, dur, 900, 980)} y={560} z={1.15} t={t} hand={2}>
        <rect width={W} height={H} fill="#1c1917" />
        <rect x={0} y={880} width={W} height={200} fill="#2a2420" />
        {/* дверь в подъезд: холодный свет */}
        <rect x={820} y={260} width={360} height={620} fill="#3a3632" />
        <rect x={830} y={270} width={340 * door} height={610} fill="#a9b6c6" opacity={0.9} />
        <Glow x={1000} y={600} r={500 * door} k="cold" o={0.5} />
        <path d={`M830 270 L${830 + 340 * door} 270 L${830 + 340 * door + 300 * door} 1080 L${830 - 80 * door} 1080 Z`} fill="#a9b6c6" opacity={0.08} />
        <rect x={830 + 340 * door - 30} y={270} width={30} height={610} fill="#4a4540" />
        <Figure x={tw(lt, 0.8, dur, 1040, 880)} y={880} s={1.25} who="mom" pose={lt > 0.8 && lt < dur - 0.5 ? "walk" : "stand"} phase={t * 4} bag="handbag" face={-1} dark={0.35} rim="#cfe0ff" rimO={0.8} headTilt={8} />
        <rect x={500} y={300} width={200} height={140} fill="#2a2420" />
        <rect x={510} y={310} width={180} height={120} fill="#3d3530" />
      </Cam>
      <NameCard x={260} y={760} name="МАМА" sub="МЕДСЕСТРА · ПОЛТОРЫ СТАВКИ" lt={lt} at={0.9} />
    </Svg>
  );
};

/* ───────── 13. тарелка и вопрос ───────── */
export const SPlate: React.FC<SP> = ({ t, lt, dur }) => {
  const q = A("Тим ну какая");
  const close = t > q - 0.2;
  const put = eio(ramp(lt, 0.2, 1.4));
  if (!close)
    return (
      <Svg>
        <Cam x={960} y={560} z={1.1} t={t} hand={1.5}>
          <Kitchen t={t} />
          <Profile x={560} y={520} s={0.9} id="plt" headphones={false} mood="neutral" lit="front" dark={0.2} />
          <Profile x={1460} y={500} s={0.95} id="pltm" who="mom" face={-1} mood="tired" lit="front" light="#ffd9a3" dark={0.15} />
          <g transform={`translate(${lerp(1300, 980, put)} ${lerp(560, 740, put)})`}>
            <ellipse cx={0} cy={0} rx={130} ry={34} fill="#e9e4da" />
            <ellipse cx={0} cy={-4} rx={86} ry={20} fill="#c58a4a" />
            <ellipse cx={-20} cy={-10} rx={30} ry={8} fill="#a86a3a" />
          </g>
        </Cam>
      </Svg>
    );
  const m = talk(t, "Тим ну какая", "там нужен");
  return (
    <Svg bg="#120f0d">
      <Cam x={tw(t - q, 0, dur, 980, 940)} y={540} z={tw(t - q, 0, dur, 1.0, 1.08)} t={t} hand={1.5}>
        <rect width={W} height={H} fill="#1a1512" />
        <Glow x={500} y={200} r={700} k="warm" o={0.45} />
        <Profile x={1000} y={560} s={1.85} id="momq" who="mom" face={-1} mood={m > 0 ? "talk" : "tired"} mouth={m} lit="front" light="#ffd9a3" />
      </Cam>
    </Svg>
  );
};

/* ───────── 14. Тимур молчит, крышка ноутбука ───────── */
export const SSilent: React.FC<SP> = ({ t, lt, dur }) => {
  const close = ramp(t, A("Он уже всё решил"), A("Он уже всё решил") + 1.2);
  return (
    <Svg bg="#06070a">
      <Cam x={1000} y={540} z={tw(lt, 0, dur, 1.0, 1.25)} t={t} hand={0.8}>
        <rect width={W} height={H} fill="#0a0b0f" />
        <Glow x={1700} y={600} r={900} k="screen" o={0.85 * (1 - close)} />
        <Glow x={300} y={200} r={900} k="cold" o={0.15 + close * 0.25} />
        <Profile x={980} y={560} s={1.9} id="sil" mood="tense" light={close > 0.5 ? "#9fb0c8" : "#d6e4ff"} dark={close * 0.3} />
      </Cam>
    </Svg>
  );
};

/* ───────── 15. продаёт вещи ───────── */
const SoldTag: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g transform={`translate(${x} ${y}) rotate(-8) scale(${1 + (1 - eout(k)) * 0.6})`} opacity={cl(k * 3)}>
    <rect x={-150} y={-44} width={300} height={88} fill="#ece6d8" />
    <text x={0} y={18} fontFamily={SERIF} fontSize={50} fill="#2a2420" textAnchor="middle" letterSpacing={8}>
      ПРОДАНО
    </text>
  </g>
);
export const SSell: React.FC<SP> = ({ t }) => {
  const i = t < A("Камеру") ? 0 : t < A("Свой самокат") ? 1 : 2;
  const t0 = [A("Он продаёт приставку"), A("Камеру"), A("Свой самокат")][i];
  const k = ramp(t, t0 + 0.4, t0 + 0.7);
  return (
    <Svg bg="#14110f">
      <Cam x={960} y={560} z={tw(t - t0, 0, 1.4, 1.12, 1.0)} t={t} hand={2}>
        <rect width={W} height={H} fill="#1c1916" />
        <Glow x={960} y={300} r={900} k="warm" o={0.4} />
        <rect x={200} y={720} width={1520} height={400} fill="#3a2e25" />
        {i === 0 && (
          <g transform="translate(960 640)">
            <path d="M-300 40 C-320 -60 -200 -90 -120 -70 L120 -70 C200 -90 320 -60 300 40 C290 110 210 120 170 80 L-170 80 C-210 120 -290 110 -300 40 Z" fill="#202227" />
            <circle cx={-180} cy={-10} r={26} fill="#16171a" />
            <circle cx={170} cy={-30} r={14} fill="#3a3d44" />
            <circle cx={200} cy={0} r={14} fill="#3a3d44" />
            <circle cx={140} cy={0} r={14} fill="#3a3d44" />
          </g>
        )}
        {i === 1 && (
          <g transform="translate(960 620)">
            <rect x={-240} y={-130} width={420} height={260} rx={24} fill="#1d1e22" />
            <rect x={-200} y={-170} width={120} height={50} rx={10} fill="#25262b" />
            <circle cx={240} cy={0} r={150} fill="#16171a" />
            <circle cx={240} cy={0} r={110} fill="#26282e" />
            <circle cx={240} cy={0} r={70} fill="#0c0e14" />
            <circle cx={210} cy={-30} r={18} fill="#5b6c8a" opacity={0.5} />
          </g>
        )}
        {i === 2 && <Scooter x={960} y={760} s={1.5} />}
        <SoldTag x={1300} y={420} k={k} />
      </Cam>
    </Svg>
  );
};

/* ───────── 16. деньги ───────── */
export const SCash: React.FC<SP> = ({ t, lt, dur }) => {
  const v = tw(t, A("Тысяча восемьсот") - 0.2, A("Тысяча восемьсот") + 1.2, 0, 1800, eout);
  return (
    <Svg bg="#120f0c">
      <Cam x={960} y={560} z={tw(lt, 0, dur, 1.0, 1.1)} t={t} hand={1.5}>
        <rect width={W} height={H} fill="#1a1612" />
        <Glow x={960} y={500} r={800} k="warm" o={0.5} />
        <rect x={0} y={640} width={W} height={500} fill="#4b3a2c" />
        {Array.from({ length: 14 }, (_, i) => (
          <Bill key={i} x={760 + rnd(i) * 420} y={720 - i * 3} s={1.1} rot={-20 + rnd(i * 3) * 40} val={i % 3 ? "100" : "50"} o={cl(lt * 6 - i * 0.3)} />
        ))}
        <Hand x={620} y={700} s={1.5} rot={8} />
        <Hand x={1320} y={680} s={1.5} rot={172} />
      </Cam>
      <Money x={960} y={360} v={v} size={150} o={cl((t - A("Тысяча восемьсот") + 0.3) * 3)} />
    </Svg>
  );
};

/* ───────── 17. виза ───────── */
export const SVisa: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg bg="#0f0d0b">
    <Cam x={tw(lt, 0, dur, 900, 1060)} y={540} z={tw(lt, 0, dur, 1.2, 1.55)} t={t} hand={1}>
      <rect width={W} height={H} fill="#1d1915" />
      <Glow x={1100} y={400} r={800} k="warm" o={0.5} />
      <Passport x={900} y={560} s={1.6} rot={-4} page="visa" open={eout(ramp(lt, 0, 0.8))} />
    </Cam>
  </Svg>
);

/* ───────── 18. билет в одну сторону ───────── */
export const STicket: React.FC<SP> = ({ t, lt, dur }) => {
  const one = eout(ramp(t, A("В одну сторону"), A("В одну сторону") + 0.5));
  return (
    <Svg bg="#0f0d0b">
      <Cam x={tw(lt, 0, dur, 900, 1080)} y={540} z={tw(lt, 0, dur, 1.0, 1.18)} t={t} hand={1}>
        <rect width={W} height={H} fill="#1b1714" />
        <Glow x={960} y={400} r={800} k="warm" o={0.4} />
        <g transform="translate(960 560) rotate(-5)">
          <rect x={-620} y={-220} width={1240} height={440} rx={22} fill="#ece7dc" />
          <rect x={300} y={-220} width={4} height={440} fill="#b8b0a0" strokeDasharray="10 8" />
          <rect x={-620} y={-220} width={1240} height={80} rx={22} fill="#2d3a4e" />
          <text x={-580} y={-166} fontFamily={SANS} fontSize={30} fill="#e6e2d8" letterSpacing={8}>
            BOARDING PASS · ПОСАДОЧНЫЙ ТАЛОН
          </text>
          <text x={-580} y={-40} fontFamily={SANS} fontSize={28} fill="#6c6658" letterSpacing={4}>
            MOSCOW
          </text>
          <text x={-580} y={40} fontFamily={SERIF} fontSize={110} fill="#2a2620">
            SVO
          </text>
          <text x={-300} y={20} fontFamily={SANS} fontSize={70} fill="#8a8476">
            →
          </text>
          <text x={-160} y={-40} fontFamily={SANS} fontSize={28} fill="#6c6658" letterSpacing={4}>
            NEW YORK
          </text>
          <text x={-160} y={40} fontFamily={SERIF} fontSize={110} fill="#2a2620">
            JFK
          </text>
          <text x={-580} y={140} fontFamily={SANS} fontSize={26} fill="#6c6658" letterSpacing={3}>
            via IST · SEAT 41K · TIMUR S.
          </text>
          <g opacity={one} transform={`translate(470 40) rotate(-10) scale(${1 + (1 - one) * 0.5})`}>
            <rect x={-150} y={-60} width={300} height={120} fill="none" stroke="#9a2c24" strokeWidth={6} />
            <text x={0} y={16} fontFamily={SANS} fontSize={44} fill="#9a2c24" textAnchor="middle" fontWeight={700} letterSpacing={6}>
              ONE WAY
            </text>
          </g>
        </g>
      </Cam>
    </Svg>
  );
};

/* ───────── 19. мама в дверях ───────── */
export const SMomDoor: React.FC<SP> = ({ t, lt, dur }) => {
  const door = eout(ramp(lt, 0.2, 1.4));
  return (
    <Svg bg="#050506">
      <Cam x={tw(lt, 0, dur, 980, 940)} y={560} z={tw(lt, 0, dur, 1.0, 1.1)} t={t} hand={1}>
        <rect width={W} height={H} fill="#0b0b0d" />
        <rect x={1180} y={180} width={320} height={700} fill="#16161a" />
        <rect x={1180} y={180} width={320 * door} height={700} fill="#ffcf94" opacity={0.85} />
        <path d={`M1180 880 L${1180 + 320 * door} 880 L${1100 + 800 * door} 1080 L${900 - 200 * door} 1080 Z`} fill="#ffcf94" opacity={0.25 * door} />
        <Glow x={1340} y={520} r={600 * door + 1} k="warm" o={0.55} />
        <Figure x={1340} y={880} s={1.5} who="mom" pose="stand" face={-1} dark={0.92} rim="#ffcf94" rimO={0.9} o={door} headTilt={10} />
        {/* кровать и Тимур */}
        <rect x={200} y={760} width={760} height={150} fill="#1d1c20" />
        <rect x={200} y={740} width={760} height={30} fill="#2a2930" />
        <Figure x={560} y={900} s={1.25} pose="sit" face={1} dark={0.6} rim="#ffcf94" rimO={0.6 * door} />
        <rect x={760} y={700} width={150} height={190} rx={30} fill="#1e242c" />
      </Cam>
    </Svg>
  );
};

/* ───────── 20. пирожки в рюкзак ───────── */
export const SPirozhki: React.FC<SP> = ({ t, lt, dur }) => {
  const put = eio(ramp(lt, 0.2, 1.6));
  const zip = ramp(t, A("и тихо говорит") - 0.4, A("и тихо говорит") + 0.6);
  return (
    <Svg bg="#0d0b09">
      <Cam x={960} y={560} z={tw(lt, 0, dur, 1.05, 1.15)} t={t} hand={1}>
        <rect width={W} height={H} fill="#16120f" />
        <Glow x={1400} y={300} r={900} k="warm" o={0.6} />
        {/* рюкзак */}
        <path d="M560 1080 L600 520 C620 440 700 400 960 400 C1220 400 1300 440 1320 520 L1360 1080 Z" fill="#232a33" />
        <path d="M620 560 Q960 500 1300 560" stroke="#3a434f" strokeWidth={10} fill="none" />
        <path d={`M620 560 Q${lerp(620, 1300, zip) / 2 + 480} ${lerp(560, 500, 0.5)} ${lerp(620, 1300, zip)} 560`} stroke="#14181d" strokeWidth={14} fill="none" opacity={zip > 0 ? 1 : 0} />
        <ellipse cx={960} cy={570} rx={300} ry={60} fill="#0c0e11" opacity={1 - zip} />
        {/* пакет с пирожками */}
        <g transform={`translate(${lerp(1300, 960, put)} ${lerp(260, 560, put)}) rotate(${lerp(-20, 0, put)})`} opacity={1 - zip * 0.9}>
          <path d="M-160 -60 C-170 60 -140 120 0 120 C140 120 170 60 160 -60 C100 -80 -100 -80 -160 -60 Z" fill="#e8e2d6" opacity={0.75} />
          {[-90, -20, 50].map((px, i) => (
            <ellipse key={i} cx={px + 20} cy={30} rx={60} ry={36} fill="#c98a48" />
          ))}
          <path d="M-160 -60 C-120 -110 120 -110 160 -60" stroke="#f3efe6" strokeWidth={6} fill="none" opacity={0.7} />
        </g>
        <Hand x={lerp(1500, 1160, put)} y={lerp(240, 560, put)} s={1.6} rot={160} skin="#d2a588" sleeve="#6c5a62" />
      </Cam>
    </Svg>
  );
};

/* ───────── 21. «Звони каждый день. Обещай» ───────── */
export const SPromise: React.FC<SP> = ({ t, lt, dur }) => {
  const m1 = talk(t, "Звони каждый день", "Обещай");
  const m2 = talk(t, "Обещаю мам", "Обещаю мам");
  const two = t > A("Обещаю мам") - 0.3;
  return (
    <Svg bg="#0d0907">
      <Cam x={two ? 760 : 1160} y={540} z={tw(lt, 0, dur, 1.0, 1.08)} t={t} hand={1}>
        <rect width={W} height={H} fill="#140f0c" />
        <Glow x={1700} y={400} r={900} k="warm" o={0.7} />
        <Profile x={560} y={600} s={1.7} id="pr-t" mood={two ? "sad" : "neutral"} mouth={m2} lit="front" light="#ffd9a3" dark={0.25} />
        <Profile x={1380} y={560} s={1.7} id="pr-m" who="mom" face={-1} mood={m1 > 0 ? "talk" : "sad"} mouth={m1} lit="back" light="#ffd9a3" tear={ramp(t, A("Обещай") + 0.2, A("Обещай") + 2.4)} />
      </Cam>
    </Svg>
  );
};

/* ───────── 22. рассвет, уходит из дома ───────── */
export const SDawnLeave: React.FC<SP> = ({ t, lt, dur }) => (
  <Svg>
    <Cam x={tw(lt, 0, dur, 900, 1060)} y={tw(lt, 0, dur, 700, 560)} z={tw(lt, 0, dur, 1.3, 1.0)} t={t} hand={1}>
      <MoscowYard t={t} pan={40} night={0.75} />
      {/* окно мамы горит */}
      <rect x={1640} y={604} width={26} height={26} fill="#ffcf8a" />
      <Glow x={1653} y={617} r={60} k="warm" o={0.8} />
      <Taxi x={560} y={990} s={0.8} col="#c9c3b2" dark={0.4} face={1} />
      <Glow x={720} y={950} r={140} k="warm" o={0.6} sy={0.4} />
      <Figure x={tw(lt, 0.3, dur, 1500, 820)} y={990} s={0.62} face={-1} pose="walk" phase={t * 5} bag="backpack" hood dark={0.35} rim="#ffcf94" rimO={0.6} />
      <Snow t={t} n={120} size={2.4} speed={60} wind={-14} o={0.55} />
    </Cam>
  </Svg>
);
