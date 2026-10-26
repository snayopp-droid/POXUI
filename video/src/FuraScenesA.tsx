import React from "react";
import {
  Bar, Bubble, Cam, Cig, Crate, FONT, Flash, Grain, H, INK, PaperBG, PhoneProp, Person, PriceTag, RED, Rain, Stamp, Strawberry, Svg, TAU, Tomato,
  Truck, Vignette, W, YEL, GREEN, cl, easeIn, easeInOut, easeOut, fmt, lerp, pop, ramp, rnd, shade, CharCard,
} from "./FuraArt";
import { A, OFF, Z, talking } from "./timelineF";

export type SP = { t: number; lt: number; dur: number };

const NIGHT_SKY = "#0e1428";

/* ------------------------------------------------------------------ */
/* Ночная трасса                                                        */
/* ------------------------------------------------------------------ */
const Car: React.FC<{ x: number; y: number; s?: number; col?: string; face?: 1 | -1 }> = ({ x, y, s = 1, col = "#2a2f42", face = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${face * s},${s})`}>
    <ellipse cx={0} cy={6} rx={150} ry={12} fill="#000" opacity={0.35} />
    <path d="M-140,-18 V-62 Q-140,-80 -120,-82 L-80,-88 Q-56,-132 -14,-132 L60,-132 Q98,-130 114,-94 L134,-86 Q148,-80 148,-62 V-18Z" fill={col} stroke={INK} strokeWidth={3} />
    <path d="M-60,-92 Q-44,-122 -14,-122 L20,-122 L20,-92Z M34,-122 L60,-122 Q86,-120 100,-92 L34,-92Z" fill="#8fb4d8" opacity={0.85} stroke={INK} strokeWidth={2} />
    {[-86, 90].map((cx) => (
      <g key={cx} transform={`translate(${cx},-6)`}><circle r={28} fill="#16171d" stroke={INK} strokeWidth={3} /><circle r={13} fill="#8a8e9a" /></g>
    ))}
    <circle cx={146} cy={-62} r={11} fill="#fff7d0" stroke={INK} strokeWidth={2} />
    <circle cx={146} cy={-62} r={120} fill="url(#f-white)" opacity={0.8} />
    <path d="M150,-66 L900,-190 L900,60 Z" fill="url(#f-sunray)" opacity={0.7} />
  </g>
);

/** положение встречной машины: 0..1 пока едет, иначе null */
const carPos = (t: number, period: number, offset: number) => {
  const p = (((t + offset) % period) + period) % period;
  const run = 2.4;
  if (p > run) return null;
  return p / run;
};

export const NightBG: React.FC<{ t: number; scroll?: number; carPeriod?: number; carOffset?: number; showCars?: boolean }> = ({ t, scroll = 0, carPeriod = 4.6, carOffset = 0.8, showCars = true }) => {
  const q = carPos(t, carPeriod, carOffset);
  return (
    <g>
      <defs>
        <linearGradient id="n-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={NIGHT_SKY} /><stop offset="1" stopColor="#222f52" /></linearGradient>
      </defs>
      <rect x={-600} y={-400} width={W + 1200} height={1100} fill="url(#n-sky)" />
      {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={((i * 420 + t * 12) % 2600) - 300} cy={150 + (i % 3) * 110} rx={320} ry={50} fill="#2a3556" opacity={0.55} />)}
      {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={((i * 140 - scroll * 0.25) % 4400 + 4400) % 4400 - 600} cy={620 + (i % 3) * 8} rx={90 + rnd(i) * 60} ry={46 + rnd(i + 3) * 40} fill="#0a0f1e" />)}
      {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={((i * 310 - scroll * 0.25) % 4400 + 4400) % 4400 - 600} cy={604 + (i % 2) * 14} r={4} fill="#ffd27a" opacity={0.7} />)}
      <rect x={-600} y={640} width={W + 1200} height={460} fill="#1c2030" />
      <rect x={-600} y={880} width={W + 1200} height={400} fill="#161924" />
      <rect x={-600} y={640} width={W + 1200} height={10} fill="#2a3040" />
      <rect x={-600} y={876} width={W + 1200} height={8} fill="#d6d9e4" opacity={0.85} />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={((i * 220 - scroll) % 4840 + 4840) % 4840 - 600} y={758} width={120} height={10} fill="#d6d9e4" opacity={0.75} />)}
      {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={((i * 460 - scroll * 1.0) % 4600 + 4600) % 4600 - 500} cy={1000 + (i % 3) * 20} rx={150} ry={14} fill="#8fb4ff" opacity={0.16} />)}
      {showCars && q !== null && <Car x={lerp(-500, 2500, q)} y={730} s={0.9} />}
    </g>
  );
};

/** ослепление встречными фарами для экрана */
export const glareAt = (t: number, period = 4.6, offset = 0.8) => {
  const q = carPos(t, period, offset);
  if (q === null) return 0;
  const x = lerp(-500, 2500, q);
  return cl(1 - Math.abs(x - 1000) / 700) * 0.55;
};

const Zzz: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const p = (t * 0.5 + i / 3) % 1;
      return <text key={i} x={p * 60} y={-p * 110} fontFamily={FONT} fontWeight={900} fontSize={34 + p * 26} fill="#dfe6ff" opacity={1 - p} stroke={INK} strokeWidth={1.5}>z</text>;
    })}
  </g>
);

const dClothes = { shirt: "#b8392f", look: "plaid" as const, pants: "#2d3550", hair: "short" as const, hairCol: "#2a2a30", stubble: true };

const TRUCK_X = 1380;
const TRUCK_Y = 908;

type RoadP = {
  t: number; cx?: number; cy?: number; z?: number; shake?: number; rot?: number;
  danila?: Partial<React.ComponentProps<typeof Person>> | null; partnerSleep?: boolean; lights?: boolean; rainO?: number; zzz?: boolean; cars?: boolean;
  smoke?: boolean;
};

export const RoadWorld: React.FC<RoadP> = ({ t, cx = 960, cy = 540, z = 1, shake = 0, rot = 0, danila = {}, partnerSleep = true, lights = true, rainO = 0.45, cars = true, smoke = false }) => (
  <g>
    <Cam cx={cx} cy={cy} z={z} shake={shake} rot={rot} t={t}>
      <NightBG t={t} showCars={cars} />
      <Truck
        x={TRUCK_X} y={TRUCK_Y} lights={lights} t={t}
        cabWindow={partnerSleep ? (
          <g>
            <rect x={-320} y={-290} width={220} height={100} fill="#233048" />
            <g transform="translate(-196,-236)">
              <circle r={42} fill="#f5f0e4" stroke={INK} strokeWidth={3} />
              <path d="M-42,-6 A42 42 0 0 1 42,-6 Q0,-22 -42,-6Z" fill="#333a4a" stroke={INK} strokeWidth={2.5} />
              <path d="M-22,6 q8,6 16,0 M6,6 q8,6 16,0" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
              <path d="M-8,22 h16" stroke={INK} strokeWidth={3} strokeLinecap="round" />
            </g>
          </g>
        ) : undefined}
      />
      {danila !== null && (
        <Person
          x={900} y={934} t={t} {...dClothes} mood="tired" lookX={1} {...danila}
          handR={smoke ? <g transform="translate(-4,-2) scale(-1.1,1.1)"><Cig t={t} /></g> : undefined}
        />
      )}
      {partnerSleep && lights && <Zzz x={1150} y={620} t={t} s={1} />}
    </Cam>
    <Rain t={t} o={rainO} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Открывающий шок                                                      */
/* ------------------------------------------------------------------ */
const Splat: React.FC<{ k: number; t: number }> = ({ k, t }) => {
  const R = 1250 * easeOut(k);
  const blobs = Array.from({ length: 22 }).map((_, i) => {
    const a = (i / 22) * TAU + rnd(i) * 0.4;
    const r = R * (0.55 + rnd(i + 5) * 0.55);
    return { x: W / 2 + Math.cos(a) * r * 0.9, y: H / 2 + Math.sin(a) * r * 0.55, r: 90 + rnd(i + 9) * 150 };
  });
  return (
    <g opacity={cl(k * 6)}>
      <circle cx={W / 2} cy={H / 2} r={R * 0.62} fill="#c4281c" />
      {blobs.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r * easeOut(k)} fill={i % 3 ? "#c4281c" : "#a81e16"} />)}
      <circle cx={W / 2 - 120} cy={H / 2 - 100} r={R * 0.3} fill="#e0463a" opacity={0.55} />
      {/* потёки */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 120 + i * 112 + rnd(i) * 40;
        const len = (160 + rnd(i + 2) * 500) * ramp(k, 0.12, 1) * (0.5 + 0.5 * Math.min(1, t * 0.6));
        return <g key={i}><rect x={x} y={90 + rnd(i + 4) * 120} width={14 + rnd(i + 6) * 14} height={len} rx={9} fill="#b0221a" /><circle cx={x + 8} cy={90 + rnd(i + 4) * 120 + len} r={15} fill="#b0221a" /></g>;
      })}
      {Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={rnd(i + 30) * W} cy={rnd(i + 60) * H} r={6 + rnd(i) * 14} fill="#c4281c" />)}
    </g>
  );
};

export const SHookSplat: React.FC<SP> = ({ t, lt }) => {
  const flyP = ramp(lt, 0.18, 0.56);
  const hit = lt >= 0.56;
  const k = ramp(lt, 0.56, 0.9);
  const shake = lt > 0.56 ? 22 * Math.exp(-(lt - 0.56) * 5) : 0;
  const whisper = ramp(lt, OFF, A("Нурлан Я всё сломал") - 0 + 2.5);
  const talk = lt > OFF + 0.05 && lt < 3.4 ? 1 : 0;
  return (
    <Svg>
      <rect width={W} height={H} fill="#05070d" />
      {hit && (
        <g>
          <Cam cx={960} cy={560} z={1.9 + ramp(lt, 0.9, 3.8) * 0.18} shake={shake * 0.4} t={t}>
            <rect x={-600} y={-300} width={W + 1200} height={1700} fill="#0c1224" />
            <ellipse cx={960} cy={760} rx={900} ry={200} fill="#262b3d" />
            <Person x={960} y={1000} t={t} {...dClothes} mood="shock" talk={talk * 0.55} blood={1} tilt={Math.sin(t * 40) * 0.4} lookY={1} armL={30} armR={30} breathe />
          </Cam>
          <Rain t={t} n={170} o={0.5} />
          <rect width={W} height={H} fill="#ff1a0a" opacity={0.06 * (0.5 + 0.5 * Math.sin(t * 12))} />
        </g>
      )}
      {/* летящий помидор */}
      {lt < 0.56 && lt > 0.18 && (
        <g transform={`translate(${W / 2},${H / 2 + 40}) scale(${0.04 + easeIn(flyP) * 9})`}>
          <Tomato x={0} y={0} r={120} rot={lt * 500} />
        </g>
      )}
      {hit && <Splat k={k} t={lt - 0.56} />}
      {hit && <g opacity={0.9}><rect width={W} height={H} fill="#7a120c" opacity={0.18} /></g>}
      <Flash o={lt > 0.56 ? Math.max(0, 0.9 - (lt - 0.56) * 9) : 0} />
      {lt > OFF + 0.05 && (
        <g transform="translate(960 168)">
          <Bubble x={0} y={0} text="Нурлан... Я всё сломал..." p={whisper > 0 ? Math.min(1, (lt - OFF) / 2.2) : 0} k={pop(lt, OFF + 0.05, 0.25)} tx={960 - 960} ty={200} max={30} size={44} dark />
        </g>
      )}
      <Vignette o={0.9} />
      <Grain t={t} o={0.1} />
    </Svg>
  );
};

export const SHookMoney: React.FC<SP> = ({ t, lt }) => {
  const kashu = A("В кашу") - A("Три миллиона");
  const sek = A("За три секунды") - A("Три миллиона");
  const val = lt < kashu ? 3000000 : lerp(3000000, 0, easeIn(ramp(lt, kashu, kashu + 0.45)));
  const puddle = easeOut(ramp(lt, kashu + 0.2, kashu + 1.4));
  const shake = lt > kashu && lt < kashu + 0.35 ? 12 : 0;
  const countdown = lt > sek ? Math.max(0, 3 - Math.floor((lt - sek) / 0.45)) : 3;
  return (
    <Svg>
      <Cam cx={960} cy={540} z={1} shake={shake} t={t}>
        <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="#0a0d18" />
        <ellipse cx={960} cy={860} rx={620 * puddle + 20} ry={70 * puddle + 6} fill="#8e1a12" />
        <ellipse cx={940} cy={846} rx={420 * puddle} ry={40 * puddle} fill="#c4281c" />
        {puddle > 0.1 && Array.from({ length: 12 }).map((_, i) => <Tomato key={i} x={700 + rnd(i) * 520} y={830 + rnd(i + 3) * 40} r={10 + rnd(i + 5) * 20} rot={rnd(i) * 360} col={i % 3 ? "#b02218" : "#d63a2a"} />)}
        {puddle > 0.1 && Array.from({ length: 6 }).map((_, i) => <Strawberry key={i} x={760 + rnd(i + 20) * 420} y={846 + rnd(i + 8) * 24} r={14 + rnd(i) * 10} />)}
        <text x={960} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={val < 1 ? RED : "#fff"} stroke={INK} strokeWidth={4} paintOrder="stroke">{fmt(val)} ₸</text>
        <text x={960} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill="#8a92a8" letterSpacing={10}>ГРУЗ</text>
        {lt > sek - 0.1 && (
          <g transform="translate(960 690)">
            <circle r={78} fill="none" stroke="#2a3048" strokeWidth={14} />
            <circle r={78} fill="none" stroke={RED} strokeWidth={14} strokeDasharray={`${2 * Math.PI * 78}`} strokeDashoffset={2 * Math.PI * 78 * (1 - cl((lt - sek) / 1.4))} transform="rotate(-90)" />
            <text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={80} fill="#fff">{countdown}</text>
          </g>
        )}
      </Cam>
      <Rain t={t} n={90} o={0.25} />
      <Vignette />
      <Grain t={t} o={0.08} />
    </Svg>
  );
};

export const STitle: React.FC<SP> = ({ t, lt, dur }) => {
  const a = ramp(lt, 0, 0.35);
  const sub = ramp(lt, A("Серия первая") - A("Точка невозврата"), A("Серия первая") - A("Точка невозврата") + 0.3);
  const fura = ramp(lt, A("Фура которая не доехала") - A("Точка невозврата"), A("Фура которая не доехала") - A("Точка невозврата") + 0.3);
  void dur;
  return (
    <Svg>
      <PaperBG />
      <g opacity={a} transform={`translate(0 ${(1 - easeOut(a)) * 40})`}>
        <g transform="translate(960 300) scale(0.55)">
          <Truck x={-60} y={160} s={1} lights={false} t={t} />
        </g>
        <text x={960} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={28} fill="#8a8272" letterSpacing={14}>ОРИГИНАЛЬНЫЙ СЕРИАЛ</text>
        <text x={960} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={126} fill={INK} letterSpacing={2}>ТОЧКА НЕВОЗВРАТА</text>
        <rect x={560} y={622} width={800 * easeOut(ramp(lt, 0.2, 0.8))} height={8} fill={RED} />
      </g>
      <g opacity={sub}>
        <text x={960} y={706} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK} letterSpacing={8}>СЕРИЯ 1</text>
      </g>
      <g opacity={fura} transform={`translate(0 ${(1 - easeOut(fura)) * 20})`}>
        <text x={960} y={780} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill={RED}>«Фура, которая не доехала»</text>
      </g>
      <Bar x={560} y={900} w={800} v={fura} col={GREEN} label="ГРУЗ" value={undefined} />
      <text x={1360} y={886} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={30} fill={INK}>3 000 000 ₸</text>
      <Grain t={t} o={0.05} />
    </Svg>
  );
};

export const SRewind: React.FC<SP> = ({ t, lt, dur }) => {
  const p = cl(lt / Math.max(0.5, dur));
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0d18" />
      <Cam cx={960} cy={540} z={1} t={t} shake={4}>
        <NightBG t={t - 4} scroll={-t * 2200} showCars={false} />
        <Truck x={TRUCK_X} y={TRUCK_Y} lights t={t} />
      </Cam>
      {Array.from({ length: 22 }).map((_, i) => {
        const y = ((i * 53 + t * 900) % (H + 100)) - 50;
        const w = 600 + rnd(i + Math.floor(t * 20)) * 1400;
        return <rect key={i} x={rnd(i + 3) * (W - w)} y={y} width={w} height={6 + rnd(i) * 22} fill="#fff" opacity={0.08 + rnd(i + 5) * 0.12} />;
      })}
      <rect width={W} height={H} fill="#000" opacity={0.25} />
      <g transform="translate(960 540)">
        <text x={0} y={-10} textAnchor="middle" fontFamily={"'DejaVu Sans Mono', monospace"} fontWeight={900} fontSize={96} fill="#fff" stroke="#000" strokeWidth={5} paintOrder="stroke">◀◀ ПЕРЕМОТКА</text>
        <text x={0} y={80} textAnchor="middle" fontFamily={"'DejaVu Sans Mono', monospace"} fontWeight={700} fontSize={50} fill={YEL}>{`02:${String(Math.floor(47 + (1 - p) * 11)).padStart(2, "0")}`}</text>
      </g>
      <rect width={W} height={H} fill="#fff" opacity={Math.max(0, 0.5 - lt * 3)} />
      <Grain t={t} o={0.16} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Сцена 1: трасса                                                      */
/* ------------------------------------------------------------------ */
const ClockChip: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <g transform="translate(56 56)">
    <rect width={sub ? 330 : 190} height={64} rx={12} fill="#0b0d14" opacity={0.78} stroke="#fff" strokeOpacity={0.2} strokeWidth={2} />
    <circle cx={30} cy={32} r={9} fill={RED} />
    <text x={54} y={44} fontFamily={"'DejaVu Sans Mono', monospace"} fontWeight={800} fontSize={34} fill={YEL}>{text}</text>
    {sub && <text x={176} y={42} fontFamily={FONT} fontWeight={700} fontSize={24} fill="#fff" opacity={0.85}>{sub}</text>}
  </g>
);

export const SRoadWide: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <RoadWorld t={t} cx={960 + lt * 6} cy={540} z={1 + lt * 0.012} danila={{ lookX: 1 }} />
    <rect width={W} height={H} fill="#fff" opacity={glareAt(t)} />
    <ClockChip text="02:47" />
    <Vignette />
  </Svg>
);

export const STruckLogo: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <RoadWorld t={t} cx={1480} cy={690} z={1.7 + lt * 0.03} danila={null} partnerSleep />
    <PriceTag x={1500} y={430} text="FRESH" k={0} />
    <Vignette />
  </Svg>
);

export const SDanilaCard: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <RoadWorld t={t} cx={1000} cy={600} z={1.28} danila={{ mood: "tired" }} />
    <CharCard x={1500} y={510} name="ДАНИЛА" sub="40 ЛЕТ · ВОДИТЕЛЬ ФУРЫ" k={pop(lt, 0.25, 0.35)} accent="#d9b25a">
      <Person x={0} y={150} t={t} {...dClothes} mood="tired" />
    </CharCard>
    <Vignette />
  </Svg>
);

export const SCabSleep: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <RoadWorld t={t} cx={1090} cy={610} z={2.6 + lt * 0.05} danila={null} />
    <Vignette />
  </Svg>
);

export const SSmoke: React.FC<SP> = ({ t, lt }) => {
  const toMouth = easeInOut(ramp(lt, 0.2, 0.9));
  const tR: [number, number] = [lerp(66, 30, toMouth), lerp(-170, -336, toMouth)];
  return (
    <Svg>
      <RoadWorld t={t} cx={930} cy={640} z={2.0} danila={{ tR, mood: "tired", lookY: 0.3 }} smoke />
      <Vignette />
    </Svg>
  );
};

export const SLate: React.FC<SP> = ({ t, lt }) => {
  const hand = (a: number, len: number, w: number, c: string) => (
    <line x1={0} y1={0} x2={Math.sin(a) * len} y2={-Math.cos(a) * len} stroke={c} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0d18" />
      <Rain t={t} o={0.25} n={90} />
      <g transform={`translate(720 560) scale(${1 + Math.sin(t * 6) * 0.006})`}>
        <rect x={-30} y={-330} width={60} height={160} fill="#3a2a22" />
        <rect x={-30} y={170} width={60} height={160} fill="#3a2a22" />
        <circle r={220} fill="#d9d6cc" stroke={INK} strokeWidth={10} />
        <circle r={190} fill="#f6f3ea" stroke={INK} strokeWidth={3} />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={Math.sin((i * TAU) / 12) * 160} y1={-Math.cos((i * TAU) / 12) * 160} x2={Math.sin((i * TAU) / 12) * 182} y2={-Math.cos((i * TAU) / 12) * 182} stroke={INK} strokeWidth={6} />)}
        {hand(((2 + 47 / 60) * TAU) / 12, 90, 12, INK)}
        {hand((47 * TAU) / 60, 150, 8, INK)}
        {hand((t * TAU) / 1, 160, 3, RED)}
        <circle r={12} fill={INK} />
      </g>
      <g transform={`translate(1360 460) scale(${pop(lt, 0.3, 0.35)})`}>
        <rect x={-290} y={-120} width={580} height={240} rx={26} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
        <text x={0} y={-30} textAnchor="middle" fontFamily={"'DejaVu Sans Mono', monospace"} fontWeight={900} fontSize={110} fill={INK}>02:47</text>
        <PriceTag x={0} y={64} text="ОПАЗДЫВАЕТ" col={RED} size={44} k={1} rot={-2} />
      </g>
      <Vignette />
    </Svg>
  );
};

export const SCargo: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <PaperBG />
    <text x={960} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={30} fill="#8a8272" letterSpacing={12}>В КУЗОВЕ</text>
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
      <g key={`${r}${c}`} opacity={pop(lt, 0.2 + (r * 3 + c) * 0.12, 0.3) > 0.05 ? 1 : 0} transform={`translate(0 ${(1 - easeOut(ramp(lt, 0.2 + (r * 3 + c) * 0.12, 0.5 + (r * 3 + c) * 0.12))) * -60})`}>
        <Crate x={560 + c * 280} y={560 + r * 130} w={250} h={110} fill="#c98d4a" content={(r + c) % 2 ? "straw" : "tomato"} />
      </g>
    )))}
    <g opacity={ramp(lt, 1.4, 1.8)}>
      <text x={1520} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={INK}>Элитные</text>
      <text x={1520} y={510} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={RED}>помидоры</text>
      <text x={1520} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={INK}>и клубника</text>
      <text x={1520} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={32} fill="#8a8272">для нового магазина</text>
    </g>
    <PriceTag x={1520} y={780} text="скоропортящийся" col="#e08a2a" size={34} k={pop(lt, 2.2, 0.3)} rot={-3} />
    <Grain t={t} o={0.04} />
  </Svg>
);

export const SCargoTotal: React.FC<SP> = ({ t, lt }) => {
  const v = easeOut(ramp(lt, 0.1, 1.0));
  return (
    <Svg>
      <PaperBG />
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={30} fill="#8a8272" letterSpacing={12}>СТОИМОСТЬ ГРУЗА</text>
      <text x={960} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={INK}>{fmt(3000000 * v)} ₸</text>
      <Bar x={460} y={600} w={1000} v={v} col={GREEN} h={30} />
      <g transform={`translate(960 780) scale(${pop(lt, 0.7, 0.35)})`}>
        <Crate x={-130} y={60} w={200} h={90} content="tomato" />
        <Crate x={130} y={60} w={200} h={90} content="straw" />
      </g>
      <Grain t={t} o={0.04} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Звонок                                                               */
/* ------------------------------------------------------------------ */
export const SCall: React.FC<SP> = ({ t, lt }) => {
  const toEar = easeInOut(ramp(lt, 0.2, 0.8));
  const tR: [number, number] = [lerp(66, 76, toEar), lerp(-170, -372, toEar)];
  const a = A("Нурлан брат я на связи");
  const z = A("но я аккуратно");
  const p = cl((lt + A("Данила достаёт телефон") - a) / (z - a));
  const tl = talking("danila", t);
  return (
    <Svg>
      <RoadWorld t={t} cx={930} cy={560} z={1.34} danila={{ tR, mood: "worry", talk: tl, handR: <g transform="translate(8,-18) rotate(14) scale(1.25)"><PhoneProp glow={false} /></g> }} />
      <Bubble x={930} y={250} text="Нурлан, брат, я на связи. Да, иду по графику. Не боись, довезу твой товар в целости. Тут дождь, но я аккуратно" p={p} k={pop(lt, 1.1, 0.3)} tx={1010} ty={390} max={36} size={34} />
      <Vignette />
    </Svg>
  );
};

export const SWife: React.FC<SP> = ({ t, lt }) => {
  const a = A("Опять этот Нурлан");
  const z = A("когда будешь");
  const p = cl((lt + A("На заднем фоне голос жены") - a) / (z - a));
  return (
    <Svg>
      <RoadWorld t={t} cx={930} cy={560} z={1.34} danila={{ tR: [76, -372], mood: "worry", handR: <g transform="translate(8,-18) rotate(14) scale(1.25)"><PhoneProp glow={false} /></g> }} />
      <g transform="translate(300 330)" opacity={ramp(lt, 0.2, 0.5)}>
        <circle r={70} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={-8} r={26} fill="#f5f0e4" stroke={INK} strokeWidth={3} /><path d="M-20,-14 q20,-30 40,0" fill="#2a1d16" />
        <circle cx={-9} cy={-8} r={3} fill={INK} /><circle cx={9} cy={-8} r={3} fill={INK} /><path d="M-8,4 q8,5 16,0" stroke={INK} strokeWidth={2.5} fill="none" />
        <path d="M-34,60 q34,-50 68,0Z" fill="#c43a5a" stroke={INK} strokeWidth={3} />
        <text x={0} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#fff">ЖЕНА</text>
      </g>
      <Bubble x={620} y={250} text="Опять этот Нурлан? Ты дома когда будешь?" p={p} k={pop(lt, 0.4, 0.3)} tx={380} ty={330} max={22} size={36} />
      <Vignette />
    </Svg>
  );
};

export const SHangup: React.FC<SP> = ({ t, lt }) => {
  const down = easeInOut(ramp(lt, 0, 0.5));
  const walk = lt > 0.5 ? (lt - 0.5) * 7 : undefined;
  const x = lerp(900, 1120, ramp(lt, 0.5, dur(lt)));
  return (
    <Svg>
      <RoadWorld t={t} cx={1040} cy={600} z={1.2} danila={{ x, tR: [lerp(76, 66, down), lerp(-372, -230, down)], mood: "tired", walk, handR: <g transform="translate(8,-18) rotate(14) scale(1.25)"><PhoneProp glow={false} /></g> }} />
      <Vignette />
    </Svg>
  );
};
const dur = (lt: number) => Math.max(lt, 1.6);

export const SWhisperGo: React.FC<SP> = ({ t, lt }) => {
  const a = A("Сейчас сейчас");
  const z = A("Главное доехать");
  const p = cl((lt + A("Шепчет себе под нос") - a) / (z - a));
  return (
    <Svg>
      <RoadWorld t={t} cx={1150} cy={650} z={2.0} danila={null} partnerSleep={false} lights />
      <g transform="translate(1048 630)">
        <Person x={0} y={0} t={t} {...dClothes} s={0.5} mood="worry" talk={talking("danila", t) * 0.5} lookX={-1} />
      </g>
      <Bubble x={900} y={290} text="Сейчас, сейчас... Главное — доехать" p={p} k={pop(lt, 0.8, 0.3)} tx={1030} ty={400} max={26} size={40} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Поездка и авария                                                     */
/* ------------------------------------------------------------------ */
const Moving: React.FC<{ t: number; speed: number }> = ({ t, speed }) => (
  <g>
    <NightBG t={t} scroll={t * speed} carPeriod={3.1} carOffset={0.5} />
  </g>
);

export const SDriving: React.FC<SP> = ({ t, lt }) => {
  const g = glareAt(t, 3.1, 0.5) + (Math.sin(t * 9) > 0.7 ? 0.1 : 0);
  return (
    <Svg>
      <Cam cx={960} cy={560} z={1} t={t} shake={2.5}>
        <Moving t={t} speed={1500} />
        <Truck x={960} y={880} t={t} wheelSpin={t * 3} cabWindow={<Person x={-205} y={-52} s={0.5} t={t} {...dClothes} mood="tired" lookX={-1} />} />
      </Cam>
      <Rain t={t} o={0.45} speed={1900} slant={60} />
      <rect width={W} height={H} fill="#fff" opacity={g} />
      <Vignette />
    </Svg>
  );
};

export const SDistracted: React.FC<SP> = ({ t, lt }) => {
  const g = glareAt(t, 2.4, 0.9) * 0.9 + 0.08;
  return (
    <Svg>
      <Cam cx={745} cy={580} z={2.7} t={t} shake={2.2}>
        <Moving t={t} speed={1500} />
        <Truck x={960} y={880} t={t} wheelSpin={t * 3} cabWindow={
          <g>
            <rect x={-320} y={-290} width={220} height={100} fill="#233048" opacity={0.85} />
            <Person x={-205} y={-52 + ramp(lt, 1.0, 1.6) * 40} s={0.5} t={t} {...dClothes} mood="worry" lookY={ramp(lt, 0.9, 1.2) * 1.2} lookX={0} tR={[40, -300]} handR={<g transform="translate(0,-14) scale(1.4)"><PhoneProp /></g>} />
          </g>
        } />
      </Cam>
      <Rain t={t} o={0.35} speed={1900} slant={60} />
      <rect width={W} height={H} fill="#fff" opacity={g} />
      <Vignette />
    </Svg>
  );
};

export const SPhoneFall: React.FC<SP> = ({ t, lt }) => {
  const fall = ramp(lt, 0.1, 0.7);
  const dip = easeOut(ramp(lt, 0.5, 1.0));
  return (
    <Svg>
      <Cam cx={745} cy={580} z={2.7} t={t} shake={3}>
        <Moving t={t} speed={1500} />
        <Truck x={960} y={880} t={t} wheelSpin={t * 3} cabWindow={
          <g>
            <rect x={-320} y={-290} width={220} height={100} fill="#233048" opacity={0.85} />
            <Person x={-205} y={-52 + 40 + dip * 70} s={0.5} t={t} {...dClothes} mood="scared" lookY={1.4} />
            <g transform={`translate(${-190 + fall * 10} ${-240 + easeIn(fall) * 160}) rotate(${fall * 220})`}><PhoneProp s={0.7} /></g>
          </g>
        } />
      </Cam>
      <Rain t={t} o={0.35} speed={1900} slant={60} />
      <rect width={W} height={H} fill="#fff" opacity={0.15 + glareAt(t, 2.0, 0.3) * 0.6} />
      <Vignette />
    </Svg>
  );
};

const Comic: React.FC<{ x: number; y: number; text: string; k: number; rot?: number; size?: number; col?: string }> = ({ x, y, text, k, rot = -6, size = 150, col = YEL }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={cl(k * 2)}>
    <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={col} stroke={INK} strokeWidth={size * 0.09} paintOrder="stroke" strokeLinejoin="round">{text}</text>
  </g>
);

export const SScreech: React.FC<SP> = ({ t, lt }) => {
  const k1 = pop(lt, 0.05, 0.25);
  const k2 = pop(lt, 0.6, 0.25);
  return (
    <Svg>
      <Cam cx={960} cy={560} z={1.12} t={t} shake={9}>
        <Moving t={t} speed={800 * (1 - ramp(lt, 0, 1.4) * 0.7)} />
        <Truck x={960} y={880} t={t} rot={-2 - ramp(lt, 0, 0.8) * 3} wheelSpin={t * 0.4} cabWindow={<Person x={-205} y={-52} s={0.5} t={t} {...dClothes} mood="shock" />} />
        {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={1200 + i * 60 - ramp(lt, 0, 1.4) * 400} cy={900 + (i % 3) * 8} rx={90 + i * 6} ry={6} fill="#cfd4e0" opacity={0.32 * (1 - i / 16)} />)}
      </Cam>
      <Rain t={t} o={0.4} />
      <Comic x={760} y={330} text="ВИИИЗГ!" k={k1} rot={-8} />
      <Comic x={1380} y={250} text="ГУДОК!" k={k2} rot={6} size={130} col="#fff" />
      <rect width={W} height={H} fill="#fff" opacity={ramp(lt, 0.0, 0.05) * (1 - ramp(lt, 0.05, 0.3)) * 0.8} />
      <Vignette />
    </Svg>
  );
};

/** вид сверху: занос */
export const SSkid: React.FC<SP> = ({ t, lt, dur }) => {
  const p = cl(lt / Math.max(0.4, dur));
  const ang = lerp(0, 118, easeInOut(ramp(p, 0.1, 0.9))) * -1;
  const tx = lerp(360, 1150, easeOut(p));
  const ty = lerp(430, 640, easeIn(p));
  const spin = ang;
  return (
    <Svg>
      <rect width={W} height={H} fill="#10131c" />
      <rect x={0} y={200} width={W} height={520} fill="#20242f" />
      <rect x={0} y={700} width={W} height={380} fill="#171a24" />
      <rect x={0} y={690} width={W} height={10} fill="#d6d9e4" opacity={0.8} />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={((i * 220 - lt * 600) % 2640 + 2640) % 2640 - 300} y={452} width={120} height={10} fill="#d6d9e4" opacity={0.7} />)}
      <g transform={`translate(${tx} ${ty}) rotate(${spin})`}>
        <path d="M-60,-30 L-880,-150 L-880,150 L-60,30Z" fill="url(#f-sunray)" opacity={0.8} />
        <rect x={-60} y={-70} width={420} height={140} rx={8} fill="#f1f3f6" stroke={INK} strokeWidth={4} />
        <rect x={-190} y={-62} width={130} height={124} rx={14} fill="#2c64b0" stroke={INK} strokeWidth={4} />
        <rect x={-160} y={-50} width={40} height={100} fill="#a8d4f0" stroke={INK} strokeWidth={2} />
        {[-130, 30, 130, 250].map((x) => <g key={x}><rect x={x - 26} y={-84} width={52} height={16} rx={6} fill="#1c1d24" /><rect x={x - 26} y={68} width={52} height={16} rx={6} fill="#1c1d24" /></g>)}
        <circle cx={-190} cy={-40} r={10} fill="#fff6c8" /><circle cx={-190} cy={40} r={10} fill="#fff6c8" />
        <circle cx={-190} cy={0} r={160} fill="url(#f-white)" opacity={0.5} />
      </g>
      {Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={lerp(360, tx, i / 16)} cy={lerp(430, ty, (i / 16) * 0.9)} rx={90} ry={10} fill="#8fb4ff" opacity={0.12 * (i / 16)} />)}
      <Rain t={t} o={0.35} />
      <Comic x={1360} y={300} text="ЗАНОС!" k={pop(lt, 0.3, 0.3)} rot={7} size={150} col="#fff" />
      <rect width={W} height={H} fill="#fff" opacity={Math.sin(t * 24) > 0.6 ? 0.18 : 0} />
      <Vignette />
    </Svg>
  );
};

export const SCrashHit: React.FC<SP> = ({ t, lt, dur }) => {
  const k = pop(lt, 0.05, 0.3);
  return (
    <Svg>
      <rect width={W} height={H} fill={lt < 0.12 ? "#fff" : "#000"} />
      <Cam cx={960} cy={540} z={1} t={t} shake={lt < 0.5 ? 18 : 3}>
        <g opacity={cl(1 - lt / Math.max(0.6, dur) * 0.2)}>
          <Comic x={960} y={600} text="ГРОХОТ!" k={k} rot={-4} size={240} col={RED} />
        </g>
      </Cam>
      <Flash o={lt < 0.12 ? 1 - lt * 5 : 0} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* После аварии                                                         */
/* ------------------------------------------------------------------ */
const Ditch: React.FC<{ t: number; boxes?: boolean }> = ({ t, boxes = false }) => (
  <g>
    <rect x={-600} y={-300} width={W + 1200} height={1700} fill="#0d1226" />
    <path d="M-600,640 L2600,640 L2600,1500 L-600,1500Z" fill="#1c2030" />
    <path d="M-600,780 Q500,860 1100,960 T2600,1000 L2600,1500 L-600,1500Z" fill="#12151f" />
    <path d="M-600,780 Q500,860 1100,960 T2600,1000" fill="none" stroke="#2b3248" strokeWidth={8} />
    {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 160 - 100} y={654} width={90} height={9} fill="#d6d9e4" opacity={0.6} />)}
    <ellipse cx={1000} cy={1010} rx={650} ry={34} fill="#6aa0ff" opacity={0.12} />
    {/* перевёрнутая фура на боку, колёсами к нам */}
    <g transform="translate(1180 1000) rotate(-96)">
      <Truck x={0} y={0} s={1.02} lights t={t} />
    </g>
    {boxes && null}
    <Glow x={640} y={730} r={160} />
  </g>
);
const Glow: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => <circle cx={x} cy={y} r={r} fill="url(#f-white)" opacity={0.18 + 0.08 * Math.sin(Date.now() * 0)} />;

export const SDitch: React.FC<SP> = ({ t, lt }) => {
  const steam = Array.from({ length: 8 }).map((_, i) => {
    const p = (t * 0.5 + i / 8) % 1;
    return <circle key={i} cx={560 + Math.sin(t * 2 + i) * 30 + p * 40} cy={780 - p * 300} r={20 + p * 60} fill="#dfe6f2" opacity={0.28 * (1 - p)} />;
  });
  return (
    <Svg>
      <Cam cx={960} cy={720} z={1.05 + lt * 0.03} t={t} shake={lt < 0.4 ? 8 : 0.5}>
        <Ditch t={t} />
        {steam}
      </Cam>
      <Rain t={t} o={0.5} />
      <rect width={W} height={H} fill="#ff2a1a" opacity={0.05 * (0.5 + 0.5 * Math.sin(t * 9))} />
      <Vignette />
    </Svg>
  );
};

export const SSpill: React.FC<SP> = ({ t, lt }) => {
  const N = 26;
  return (
    <Svg>
      <Cam cx={1100} cy={800} z={1.25} t={t} shake={0.8}>
        <Ditch t={t} />
        {Array.from({ length: N }).map((_, i) => {
          const a = 0.1 + rnd(i) * 1.8;
          const q = ramp(lt, a, a + 0.9);
          if (q <= 0) return null;
          const x0 = 1500 + rnd(i + 2) * 120;
          const x = x0 - easeOut(q) * (300 + rnd(i + 4) * 680);
          const y = lerp(760, 960 + (i % 4) * 14, easeIn(Math.min(1, q * 1.6))) - Math.sin(Math.min(1, q * 1.2) * Math.PI) * 70;
          const squash = ramp(lt, a + 1.1 + rnd(i) * 0.5, a + 1.8);
          return squash > 0.5 ? (
            <ellipse key={i} cx={x} cy={y + 12} rx={34 + rnd(i) * 30} ry={9} fill={i % 2 ? "#9e1d14" : "#c4281c"} />
          ) : i % 5 === 0 ? <Strawberry key={i} x={x} y={y} r={20} /> : <Tomato key={i} x={x} y={y} r={22} rot={q * 720} />;
        })}
        {[0, 1, 2].map((i) => {
          const q = ramp(lt, 0.2 + i * 0.5, 1.2 + i * 0.5);
          return q > 0 ? <Crate key={i} x={1560 - easeOut(q) * (200 + i * 160)} y={lerp(760, 980, easeIn(q))} w={170} h={95} rot={q * (90 + i * 40) * (i % 2 ? -1 : 1)} /> : null;
        })}
        <ellipse cx={1000} cy={1010} rx={ramp(lt, 1.6, 3.2) * 480} ry={ramp(lt, 1.6, 3.2) * 26} fill="#8e1a12" opacity={0.85} />
      </Cam>
      <Rain t={t} o={0.55} />
      <Vignette />
    </Svg>
  );
};

export const SClimbOut: React.FC<SP> = ({ t, lt, dur }) => {
  const p = cl(lt / Math.max(1, dur));
  const rise = easeOut(ramp(p, 0, 0.45));
  const walkP = ramp(p, 0.5, 1);
  const x = lerp(1180, 760, walkP);
  return (
    <Svg>
      <Cam cx={1000} cy={760} z={1.12} t={t}>
        <Ditch t={t} />
        <ellipse cx={1000} cy={1010} rx={500} ry={30} fill="#8e1a12" opacity={0.85} />
        {Array.from({ length: 10 }).map((_, i) => <Tomato key={i} x={420 + rnd(i) * 900} y={1000 + rnd(i + 3) * 30} r={14 + rnd(i) * 10} col="#a82018" />)}
        <Person x={x} y={lerp(930 + 220, 960, rise)} t={t} {...dClothes} mood="scared" blood={0.8} walk={walkP > 0 ? (lt - dur * 0.5) * 4.2 : undefined} opacity={ramp(p, 0, 0.2)} tilt={walkP > 0 ? Math.sin((lt - dur * 0.5) * 4.2 * 2) * 3 - 4 : 0} />
      </Cam>
      <Rain t={t} o={0.55} />
      <Vignette />
    </Svg>
  );
};

export const SBloody: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <Cam cx={940} cy={560} z={2.5 + lt * 0.06} t={t}>
      <rect x={-600} y={-300} width={W + 1200} height={1700} fill="#0d1226" />
      <ellipse cx={960} cy={900} rx={900} ry={180} fill="#262b3d" />
      <Person x={960} y={1000} t={t} {...dClothes} mood="shock" blood={ramp(lt, 0, 1.2) + 0.2} armL={34} armR={34} lookY={1} />
    </Cam>
    <Rain t={t} n={170} o={0.55} />
    <Vignette />
  </Svg>
);

export const SRealize: React.FC<SP> = ({ t, lt }) => {
  const bar = 1 - easeIn(ramp(lt, A("это катастрофа") - A("Но страшно ему") - 0.4, A("это катастрофа") - A("Но страшно ему") + 0.6));
  return (
    <Svg>
      <Cam cx={1000} cy={780} z={1.1} t={t}>
        <Ditch t={t} />
        <ellipse cx={1000} cy={1010} rx={600} ry={34} fill="#8e1a12" opacity={0.85} />
        {Array.from({ length: 18 }).map((_, i) => <Tomato key={i} x={380 + rnd(i) * 1000} y={1000 + rnd(i + 3) * 34} r={12 + rnd(i) * 12} col="#a82018" />)}
        <Person x={780} y={960} t={t} {...dClothes} mood="shock" blood={1} armL={16} armR={16} lookY={0.8} lookX={1} />
      </Cam>
      <Rain t={t} o={0.55} />
      <g transform="translate(1360 160)" opacity={ramp(lt, 0.6, 1.0)}>
        <rect x={-250} y={-70} width={500} height={190} rx={22} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
        <text x={-210} y={-18} fontFamily={FONT} fontWeight={600} fontSize={26} fill="#8a8272" letterSpacing={6}>ГРУЗ</text>
        <text x={-210} y={42} fontFamily={FONT} fontWeight={900} fontSize={54} fill={bar < 0.05 ? RED : INK}>{fmt(3000000 * Math.max(0, bar))} ₸</text>
        <Bar x={-210} y={72} w={420} v={bar} col={bar < 0.4 ? RED : GREEN} h={20} />
      </g>
      <rect width={W} height={H} fill="#ff2a1a" opacity={ramp(lt, 1.0, 3.0) * 0.12} />
      <Vignette />
    </Svg>
  );
};

export const SLastWhisper: React.FC<SP> = ({ t, lt, dur }) => {
  const a = A("Нурлан Я всё сломал", 1);
  const z = Z("Нурлан Я всё сломал", 1);
  const p = cl((lt + (A("Нурлан Я всё сломал", 1) - a)) / Math.max(0.5, z - a));
  const talk = talking("danila", t);
  return (
    <Svg>
      <Cam cx={960} cy={570} z={2.3 + lt * 0.07} t={t}>
        <rect x={-600} y={-300} width={W + 1200} height={1700} fill="#0d1226" />
        <ellipse cx={960} cy={900} rx={900} ry={180} fill="#262b3d" />
        <Person x={960} y={1000} t={t} {...dClothes} mood="sad" talk={talk * 0.5} blood={1} armL={30} armR={30} tears={0.6} />
      </Cam>
      <Rain t={t} n={150} o={0.5} />
      <Bubble x={960} y={210} text="Нурлан... Я всё сломал..." p={p} k={pop(lt, 0.1, 0.3)} tx={960} ty={330} max={30} size={46} dark />
      <rect width={W} height={H} fill="#000" opacity={ramp(lt, dur - 1.0, dur - 0.05)} />
      <Vignette />
    </Svg>
  );
};

export { PaperBG, Stamp, Bar, easeOut, shade, YEL };
