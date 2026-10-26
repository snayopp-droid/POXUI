import React from "react";

export const W = 1080;
export const H = 1920;
export const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";

export const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const easeOut = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const easeInOut = (x: number) => {
  const v = cl(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
export const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
/** 0→1 за [a,b] */
export const ramp = (x: number, a: number, b: number) => cl((x - a) / (b - a));
/** появление: pop-in с лёгким перелётом */
export const pop = (x: number, a: number, d = 0.35) => {
  const p = cl((x - a) / d);
  return p === 0 ? 0 : 1 + Math.sin(p * Math.PI) * 0.12 * (1 - p) - (1 - easeOut(p)) * 0.5;
};

export const SKIN = "#e9b995";
export const SKIN_D = "#cf9a76";

/* ------------------------------------------------------------------ */
/* Голова                                                              */
/* ------------------------------------------------------------------ */
export type Mood = "calm" | "worry" | "scared" | "cough" | "smile";
export type HairStyle = "bun" | "long" | "pig" | "short" | "gray" | "bald" | "hood";

export type HeadP = {
  r?: number;
  skin?: string;
  hair?: string;
  hs?: HairStyle;
  mood?: Mood;
  mask?: "surg" | "resp" | null;
  t?: number;
  look?: number;
  glasses?: boolean;
  seed?: number;
};

export const Head: React.FC<HeadP> = ({
  r = 56, skin = SKIN, hair = "#4a2c1e", hs = "bun", mood = "calm", mask = null, t = 0, look = 0, glasses = false, seed = 0,
}) => {
  const ex = r * 0.36;
  const ey = -r * 0.02;
  const blink = Math.sin(t * 2.3 + seed * 3) > 0.985;
  const browL = mood === "scared" || mood === "worry" ? -r * 0.34 : -r * 0.26;
  const browSlope = mood === "worry" ? r * 0.09 : mood === "scared" ? r * 0.13 : 0;
  const mouth =
    mood === "smile" ? `M${-r * 0.28},${r * 0.42} Q0,${r * 0.7} ${r * 0.28},${r * 0.42}`
    : mood === "scared" ? `M${-r * 0.2},${r * 0.5} Q0,${r * 0.82} ${r * 0.2},${r * 0.5} Z`
    : mood === "cough" ? `M${-r * 0.2},${r * 0.46} Q0,${r * 0.78} ${r * 0.2},${r * 0.46} Z`
    : mood === "worry" ? `M${-r * 0.22},${r * 0.56} Q0,${r * 0.4} ${r * 0.22},${r * 0.56}`
    : `M${-r * 0.2},${r * 0.5} L${r * 0.2},${r * 0.5}`;
  return (
    <g>
      {/* волосы сзади */}
      {hs === "long" && <path d={`M${-r * 1.05},${-r * 0.2} Q${-r * 1.3},${r * 1.9} ${-r * 0.5},${r * 2.1} L${r * 0.5},${r * 2.1} Q${r * 1.3},${r * 1.9} ${r * 1.05},${-r * 0.2} Q0,${-r * 1.7} ${-r * 1.05},${-r * 0.2}Z`} fill={hair} />}
      {hs === "bun" && <circle cx={-r * 0.2} cy={-r * 1.25} r={r * 0.42} fill={hair} />}
      {hs === "pig" && (
        <g fill={hair}>
          <ellipse cx={-r * 1.12} cy={r * 0.5} rx={r * 0.26} ry={r * 0.7} transform={`rotate(14 ${-r * 1.12} ${r * 0.5})`} />
          <ellipse cx={r * 1.12} cy={r * 0.5} rx={r * 0.26} ry={r * 0.7} transform={`rotate(-14 ${r * 1.12} ${r * 0.5})`} />
        </g>
      )}
      <circle cx={-r * 0.93} cy={r * 0.05} r={r * 0.16} fill={skin} />
      <circle cx={r * 0.93} cy={r * 0.05} r={r * 0.16} fill={skin} />
      <ellipse cx="0" cy="0" rx={r * 0.95} ry={r} fill={skin} />
      {/* волосы спереди */}
      {hs === "bun" && <path d={`M${-r * 1.0},${-r * 0.05} Q${-r * 1.1},${-r * 1.15} 0,${-r * 1.12} Q${r * 1.1},${-r * 1.15} ${r * 1.0},${-r * 0.05} Q${r * 0.55},${-r * 0.62} ${-r * 0.1},${-r * 0.5} Q${-r * 0.7},${-r * 0.4} ${-r * 1.0},${-r * 0.05}Z`} fill={hair} />}
      {hs === "long" && <path d={`M${-r * 1.0},${r * 0.1} Q${-r * 1.15},${-r * 1.2} 0,${-r * 1.15} Q${r * 1.15},${-r * 1.2} ${r * 1.0},${r * 0.1} Q${r * 0.7},${-r * 0.5} ${-r * 0.2},${-r * 0.55} Q${-r * 0.8},${-r * 0.3} ${-r * 1.0},${r * 0.1}Z`} fill={hair} />}
      {hs === "pig" && <path d={`M${-r * 1.0},${-r * 0.05} Q${-r * 1.05},${-r * 1.18} 0,${-r * 1.14} Q${r * 1.05},${-r * 1.18} ${r * 1.0},${-r * 0.05} Q${r * 0.5},${-r * 0.55} 0,${-r * 0.5} Q${-r * 0.5},${-r * 0.55} ${-r * 1.0},${-r * 0.05}Z`} fill={hair} />}
      {hs === "short" && <path d={`M${-r * 1.0},${-r * 0.1} Q${-r * 1.05},${-r * 1.15} 0,${-r * 1.12} Q${r * 1.05},${-r * 1.15} ${r * 1.0},${-r * 0.1} Q${r * 0.5},${-r * 0.6} 0,${-r * 0.55} Q${-r * 0.5},${-r * 0.6} ${-r * 1.0},${-r * 0.1}Z`} fill={hair} />}
      {hs === "gray" && <path d={`M${-r * 1.0},${-r * 0.05} Q${-r * 1.1},${-r * 1.15} 0,${-r * 1.1} Q${r * 1.1},${-r * 1.15} ${r * 1.0},${-r * 0.05} Q${r * 0.6},${-r * 0.5} 0,${-r * 0.5} Q${-r * 0.6},${-r * 0.5} ${-r * 1.0},${-r * 0.05}Z`} fill="#b9b9c0" />}
      {hs === "hood" && <path d={`M${-r * 1.18},${r * 0.7} Q${-r * 1.35},${-r * 1.4} 0,${-r * 1.38} Q${r * 1.35},${-r * 1.4} ${r * 1.18},${r * 0.7} Q${r * 0.85},${-r * 0.55} 0,${-r * 0.55} Q${-r * 0.85},${-r * 0.55} ${-r * 1.18},${r * 0.7}Z`} fill={hair} />}
      {/* глаза */}
      {blink ? (
        <path d={`M${-ex - r * 0.1},${ey} h${r * 0.2} M${ex - r * 0.1},${ey} h${r * 0.2}`} stroke="#1a120d" strokeWidth={r * 0.06} strokeLinecap="round" />
      ) : (
        <g>
          <ellipse cx={-ex} cy={ey} rx={r * 0.13} ry={r * 0.16} fill="#fff" />
          <ellipse cx={ex} cy={ey} rx={r * 0.13} ry={r * 0.16} fill="#fff" />
          <circle cx={-ex + look * r * 0.05} cy={ey} r={r * 0.085} fill="#1a120d" />
          <circle cx={ex + look * r * 0.05} cy={ey} r={r * 0.085} fill="#1a120d" />
        </g>
      )}
      <path d={`M${-ex - r * 0.16},${ey + browL + r * 0.1 + browSlope} L${-ex + r * 0.16},${ey + browL + r * 0.1 - browSlope * 0.6} M${ex - r * 0.16},${ey + browL + r * 0.1 - browSlope * 0.6} L${ex + r * 0.16},${ey + browL + r * 0.1 + browSlope}`} stroke="#2a1a12" strokeWidth={r * 0.06} strokeLinecap="round" />
      {glasses && (
        <g fill="none" stroke="#3a3a44" strokeWidth={r * 0.05}>
          <circle cx={-ex} cy={ey} r={r * 0.24} />
          <circle cx={ex} cy={ey} r={r * 0.24} />
          <path d={`M${-ex + r * 0.24},${ey} L${ex - r * 0.24},${ey}`} />
        </g>
      )}
      {!mask && <path d={mouth} fill={mood === "scared" || mood === "cough" ? "#6a2a2a" : "none"} stroke="#8a3a30" strokeWidth={r * 0.055} strokeLinecap="round" />}
      {mood === "smile" && !mask && <><circle cx={-r * 0.55} cy={r * 0.3} r={r * 0.12} fill="#ff9a7a" opacity="0.45" /><circle cx={r * 0.55} cy={r * 0.3} r={r * 0.12} fill="#ff9a7a" opacity="0.45" /></>}
      {mask === "surg" && (
        <g>
          <path d={`M${-r * 0.95},${r * 0.05} L${-r * 0.55},${r * 0.2} M${r * 0.95},${r * 0.05} L${r * 0.55},${r * 0.2}`} stroke="#d9e8f2" strokeWidth={r * 0.04} />
          <path d={`M${-r * 0.62},${r * 0.12} L${r * 0.62},${r * 0.12} L${r * 0.55},${r * 0.78} Q0,${r * 1.05} ${-r * 0.55},${r * 0.78}Z`} fill="#8fd0e8" stroke="#5aa6c4" strokeWidth={r * 0.03} />
          <path d={`M${-r * 0.5},${r * 0.35} L${r * 0.5},${r * 0.35} M${-r * 0.5},${r * 0.55} L${r * 0.5},${r * 0.55}`} stroke="#6fb8d4" strokeWidth={r * 0.03} />
        </g>
      )}
      {mask === "resp" && (
        <g>
          <path d={`M${-r * 0.95},${-r * 0.02} L${-r * 0.5},${r * 0.18} M${r * 0.95},${-r * 0.02} L${r * 0.5},${r * 0.18}`} stroke="#2a2a30" strokeWidth={r * 0.07} />
          <path d={`M${-r * 0.6},${r * 0.12} Q0,${-r * 0.08} ${r * 0.6},${r * 0.12} L${r * 0.5},${r * 0.85} Q0,${r * 1.15} ${-r * 0.5},${r * 0.85}Z`} fill="#4b535c" stroke="#2c3238" strokeWidth={r * 0.04} />
          <circle cx={-r * 0.3} cy={r * 0.58} r={r * 0.2} fill="#cbd2d8" stroke="#2c3238" strokeWidth={r * 0.04} />
          <circle cx={r * 0.3} cy={r * 0.58} r={r * 0.2} fill="#cbd2d8" stroke="#2c3238" strokeWidth={r * 0.04} />
        </g>
      )}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Человек во весь рост (ноги на y)                                     */
/* ------------------------------------------------------------------ */
export type Arm = [number, number];
export type HumanP = HeadP & {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  top?: string;
  sleeve?: string;
  bottom?: string;
  shoe?: string;
  glove?: string | null;
  armL?: Arm;
  armR?: Arm;
  handL?: React.ReactNode;
  handR?: React.ReactNode;
  bob?: number;
  legSw?: number;
  skirt?: boolean;
  tilt?: number;
  bag?: string;
  opacity?: number;
};

const ArmG: React.FC<{ x: number; a: Arm; color: string; skin: string; glove: string | null; hand?: React.ReactNode }> = ({ x, a, color, skin, glove, hand }) => (
  <g transform={`translate(${x},-440) rotate(${a[0]})`}>
    <rect x={-15} y={-12} width={30} height={134} rx={15} fill={color} />
    <g transform={`translate(0,116) rotate(${a[1]})`}>
      <rect x={-13} y={-6} width={27} height={112} rx={13} fill={color} />
      <circle cx={0} cy={112} r={glove ? 19 : 16} fill={glove ?? skin} />
      {glove && <rect x={-15} y={84} width={30} height={14} rx={5} fill={glove} opacity="0.85" />}
      {hand && <g transform="translate(0,112)">{hand}</g>}
    </g>
  </g>
);

export const Human: React.FC<HumanP> = ({
  x, y, s = 1, flip, top = "#2f9c8f", sleeve, bottom = "#2b3a55", shoe = "#17171f", glove = null,
  armL = [4, 4], armR = [-4, -4], handL, handR, bob = 0, legSw = 0, skirt = false, tilt = 0, bag, opacity = 1, skin = SKIN, ...head
}) => {
  const sl = sleeve ?? top;
  return (
    <g transform={`translate(${x},${y - bob}) scale(${flip ? -s : s},${s}) rotate(${tilt})`} opacity={opacity}>
      {bag && <rect x={-72} y={-470} width={50} height={160} rx={16} fill={bag} transform="translate(-14 10)" />}
      <ArmG x={-62} a={armL} color={sl} skin={skin} glove={glove} hand={handL} />
      {/* ноги */}
      <g transform={`rotate(${legSw} 0 -250)`}>
        <rect x={-38} y={-260} width={34} height={246} rx={12} fill={skirt ? skin : bottom} />
        <rect x={-46} y={-26} width={56} height={26} rx={12} fill={shoe} />
      </g>
      <g transform={`rotate(${-legSw} 0 -250)`}>
        <rect x={4} y={-260} width={34} height={246} rx={12} fill={skirt ? skin : bottom} />
        <rect x={-6} y={-26} width={56} height={26} rx={12} fill={shoe} />
      </g>
      {skirt && <path d="M-74,-250 L74,-250 L96,-130 L-96,-130Z" fill={bottom} />}
      {/* торс */}
      <rect x={-72} y={-470} width={144} height={236} rx={40} fill={top} />
      <rect x={-18} y={-488} width={36} height={34} rx={10} fill={skin} />
      <ArmG x={62} a={armR} color={sl} skin={skin} glove={glove} hand={handR} />
      <g transform="translate(0,-545)">
        <Head skin={skin} {...head} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Человек в защитном костюме (вид спереди)                             */
/* ------------------------------------------------------------------ */
export const Hazmat: React.FC<{ x: number; y: number; s?: number; flip?: boolean; torch?: boolean; t?: number; arm?: number }> = ({ x, y, s = 1, flip, torch, t = 0, arm = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={16} fill="#000" opacity="0.35" />
    <rect x={-52} y={-250} width={40} height={250} rx={14} fill="#eef1f4" stroke="#c4cad2" strokeWidth={3} />
    <rect x={12} y={-250} width={40} height={250} rx={14} fill="#eef1f4" stroke="#c4cad2" strokeWidth={3} />
    <rect x={-60} y={-32} width={54} height={34} rx={12} fill="#caa13a" />
    <rect x={6} y={-32} width={54} height={34} rx={12} fill="#caa13a" />
    <rect x={-84} y={-500} width={168} height={270} rx={58} fill="#f6f8fa" stroke="#c4cad2" strokeWidth={3} />
    <path d="M-40,-420 L40,-420 M-40,-360 L40,-360" stroke="#d3d9df" strokeWidth={4} />
    <rect x={-8} y={-470} width={16} height={230} fill="#d7dde3" />
    <g transform={`rotate(${-12 + arm} -78 -450)`}>
      <rect x={-112} y={-462} width={34} height={190} rx={17} fill="#eef1f4" stroke="#c4cad2" strokeWidth={3} />
      <circle cx={-95} cy={-266} r={22} fill="#e08a2a" />
    </g>
    <g transform={`rotate(${12 - arm} 78 -450)`}>
      <rect x={78} y={-462} width={34} height={190} rx={17} fill="#eef1f4" stroke="#c4cad2" strokeWidth={3} />
      <circle cx={95} cy={-266} r={22} fill="#e08a2a" />
      {torch && (
        <g transform="translate(95 -262)">
          <rect x={-8} y={-10} width={16} height={90} rx={6} fill="#4a4f58" transform="rotate(-24)" />
          <circle cx={-34} cy={78} r={10 + Math.sin(t * 40) * 3} fill="#fff" />
          <circle cx={-34} cy={78} r={34} fill="#bfe4ff" opacity={0.35 + Math.sin(t * 30) * 0.1} />
        </g>
      )}
    </g>
    <circle cx={0} cy={-572} r={66} fill="#f6f8fa" stroke="#c4cad2" strokeWidth={3} />
    <ellipse cx={0} cy={-580} rx={46} ry={32} fill="#1d2630" />
    <ellipse cx={-14} cy={-590} rx={14} ry={8} fill="#8aa8c0" opacity="0.5" />
    <circle cx={-24} cy={-534} r={14} fill="#aab4be" />
    <circle cx={24} cy={-534} r={14} fill="#aab4be" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Декор: дверь, прихожая, здание, липкая карточка                      */
/* ------------------------------------------------------------------ */
export const QuiltDoor: React.FC<{ x: number; y: number; w: number; h: number; base?: string }> = ({ x, y, w, h, base = "#5b3a28" }) => {
  const dots: React.ReactNode[] = [];
  const stepX = w / 6;
  const stepY = h / 12;
  for (let i = 0; i <= 6; i++) for (let j = 0; j <= 12; j++) {
    dots.push(<circle key={`${i}-${j}`} cx={x + i * stepX} cy={y + j * stepY} r={3} fill="#d4b070" opacity="0.8" />);
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={base} />
      <rect x={x} y={y} width={w} height={h} fill="#000" opacity="0.12" />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${x + i * stepX},${y} L${x + i * stepX},${y + h}`} stroke="#00000022" strokeWidth={2} />)}
      {Array.from({ length: 13 }).map((_, j) => <path key={j} d={`M${x},${y + j * stepY} L${x + w},${y + j * stepY}`} stroke="#00000022" strokeWidth={2} />)}
      {dots}
    </g>
  );
};

export const Lock3: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(0 ${i * 100})`}>
        <rect x={-20} y={-34} width={40} height={68} rx={10} fill="#b79a4a" stroke="#7a6428" strokeWidth={3} />
        <circle cx={0} cy={-8} r={8} fill="#2b2418" />
        <rect x={-3} y={-8} width={6} height={22} rx={3} fill="#2b2418" />
      </g>
    ))}
  </g>
);

export const Hallway: React.FC<{ night?: boolean; door?: number; t: number; candle?: boolean; peek?: boolean }> = ({ night, door = 0, t, candle, peek }) => {
  const wall = night ? "#1b2a30" : "#3c5a60";
  const floor = night ? "#1d1410" : "#5a3d2a";
  const o = cl(door);
  const free = 1000 - 360 * Math.cos(o * 1.2);
  const shrink = 70 * Math.sin(o * 1.2);
  const flick = 0.85 + Math.sin(t * 13) * 0.08 + Math.sin(t * 7.3) * 0.05;
  return (
    <g>
      <rect width={W} height={H} fill={wall} />
      {Array.from({ length: 11 }).map((_, i) => Array.from({ length: 16 }).map((__, j) => (
        <circle key={`${i}-${j}`} cx={50 + i * 100 + (j % 2) * 50} cy={80 + j * 100} r={4} fill={night ? "#2c4a44" : "#4f7a70"} opacity="0.8" />
      )))}
      <rect y={1480} width={W} height={440} fill={floor} />
      <rect y={1470} width={W} height={16} fill="#00000044" />
      {/* вешалка */}
      <rect x={90} y={620} width={280} height={14} rx={7} fill="#2a2218" />
      {[["#b3342c", 120], ["#2c5aa0", 190], ["#d9a62a", 260]].map(([c, xx], i) => (
        <g key={i}>
          <path d={`M${xx as number},634 q-4,20 -2,40`} stroke="#222" strokeWidth={4} fill="none" />
          <rect x={(xx as number) - 26} y={660} width={56} height={190 + i * 14} rx={22} fill={c as string} />
        </g>
      ))}
      {/* зеркало */}
      <ellipse cx={460} cy={800} rx={64} ry={104} fill="#8fb0b8" stroke="#5a3d2a" strokeWidth={10} />
      <ellipse cx={440} cy={760} rx={16} ry={40} fill="#fff" opacity="0.2" />
      {/* дверь */}
      <rect x={620} y={500} width={400} height={980} fill="#2a1d16" />
      {o > 0 && (
        <g>
          <rect x={630} y={510} width={380} height={960} fill={night ? "#7aa0c8" : "#cfd8c8"} opacity={peek ? 1 : 0.9} />
          <rect x={630} y={510} width={380} height={960} fill="#fff" opacity={night ? 0.12 : 0.25} />
        </g>
      )}
      <g>
        <polygon points={`1010,510 ${free},${510 + shrink} ${free},${1470 - shrink} 1010,1470`} fill="#5b3a28" />
        {o < 0.5 && (
          <g opacity={1 - o * 2}>
            <QuiltDoor x={630} y={510} w={380} h={960} />
            <Lock3 x={680} y={900} s={0.9} />
            <circle cx={820} cy={560} r={9} fill="#111" stroke="#b79a4a" strokeWidth={3} />
            <rect x={650} y={780} width={70} height={14} rx={7} fill="#c9a94a" />
          </g>
        )}
        <polygon points={`1010,510 ${free},${510 + shrink} ${free},${1470 - shrink} 1010,1470`} fill="#000" opacity={0.2 * o} />
      </g>
      <rect x={612} y={492} width={416} height={12} fill="#1a120d" />
      {/* коврик */}
      <rect x={640} y={1500} width={300} height={44} rx={8} fill="#8a2a2a" />
      {candle && (
        <g transform="translate(180 1500)">
          <rect x={-110} y={-130} width={220} height={14} rx={4} fill="#3a2a1e" />
          <rect x={-90} y={-116} width={14} height={116} fill="#3a2a1e" />
          <rect x={76} y={-116} width={14} height={116} fill="#3a2a1e" />
          <circle cx={0} cy={-210} r={300 * flick} fill="url(#plg-candle)" />
          <rect x={-14} y={-196} width={28} height={66} rx={4} fill="#e8dcc0" />
          <g transform={`translate(0 -200) scale(${0.9 + flick * 0.15})`}>
            <polygon points="0,-56 -11,-22 0,-8 11,-22" fill="#ff9a2e" />
            <polygon points="0,-40 -5,-20 0,-10 5,-22" fill="#ffe08a" />
          </g>
        </g>
      )}
      {night && <rect width={W} height={H} fill="#050810" opacity="0.28" />}
    </g>
  );
};

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="plg-candle"><stop offset="0" stopColor="#ffb25a" stopOpacity="0.55" /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></radialGradient>
    <radialGradient id="plg-red"><stop offset="0" stopColor="#ff2a1a" stopOpacity="0.5" /><stop offset="1" stopColor="#ff2a1a" stopOpacity="0" /></radialGradient>
    <radialGradient id="plg-green"><stop offset="0" stopColor="#9be05a" stopOpacity="0.5" /><stop offset="1" stopColor="#9be05a" stopOpacity="0" /></radialGradient>
    <radialGradient id="plg-vig"><stop offset="0.4" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.75" /></radialGradient>
    <filter id="plg-blur"><feGaussianBlur stdDeviation="30" /></filter>
    <filter id="plg-blur8"><feGaussianBlur stdDeviation="8" /></filter>
  </defs>
);

export const Sticky: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; fill?: string; k?: number; children?: React.ReactNode }> = ({
  x, y, w, h, rot = 0, fill = "#e6b869", k = 1, children,
}) => (
  <g transform={`translate(${x} ${y + (1 - k) * -60}) rotate(${rot}) scale(${Math.max(0.001, k)})`} opacity={cl(k * 1.5)}>
    <rect x={-w / 2 + 10} y={-h / 2 + 16} width={w} height={h} rx={6} fill="#000" opacity="0.4" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={fill} />
    <rect x={-w / 2 - 14} y={-h / 2 - 12} width={90} height={30} fill="#e9ddc0" opacity="0.8" transform={`rotate(-35 ${-w / 2} ${-h / 2})`} />
    <rect x={w / 2 - 76} y={-h / 2 - 12} width={90} height={30} fill="#e9ddc0" opacity="0.8" transform={`rotate(35 ${w / 2} ${-h / 2})`} />
    {children}
  </g>
);

export const Chip: React.FC<{ x: number; y: number; text: string; bg?: string; fg?: string; size?: number; k?: number }> = ({ x, y, text, bg = "#f4c82a", fg = "#1a1a1a", size = 28, k = 1 }) => {
  const w = text.length * size * 0.72 + 36;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={cl(k * 2)}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.7} rx={5} fill={bg} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={fg} letterSpacing={2}>{text}</text>
    </g>
  );
};

export const Tower: React.FC<{ x: number; y: number; w: number; h: number; cols: number; rows: number; t: number; lit?: string; dark?: string; body?: string; seed?: number; litP?: number; flicker?: boolean }> = ({
  x, y, w, h, cols, rows, t, lit = "#ffd27a", dark = "#1a2140", body = "#4b5683", seed = 1, litP = 0.5, flicker = true,
}) => {
  const cw = w / cols;
  const rh = h / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={body} />
      <rect x={x} y={y} width={w * 0.14} height={h} fill="#000" opacity="0.14" />
      <rect x={x - 10} y={y - 14} width={w + 20} height={16} fill="#00000040" />
      {Array.from({ length: rows }).map((_, j) => Array.from({ length: cols }).map((__, i) => {
        const r = rnd(seed + i * 7 + j * 13);
        const on = r < litP;
        const fl = flicker && on && rnd(Math.floor(t * 2) + i * 3 + j) > 0.985 ? 0.3 : 1;
        return <rect key={`${i}-${j}`} x={x + i * cw + cw * 0.2} y={y + j * rh + rh * 0.2} width={cw * 0.6} height={rh * 0.55} fill={on ? lit : dark} opacity={on ? fl : 0.9} />;
      }))}
    </g>
  );
};

export const Spire: React.FC<{ x: number; y: number; s?: number; col?: string; star?: string }> = ({ x, y, s = 1, col = "#0c1530", star = "#ffd94a" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-340} width={140} height={340} fill={col} />
    <rect x={-48} y={-520} width={96} height={190} fill={col} />
    <rect x={-30} y={-660} width={60} height={150} fill={col} />
    <polygon points="0,-900 -22,-660 22,-660" fill={col} />
    <rect x={-100} y={-120} width={200} height={120} fill={col} />
    <polygon points="0,-940 -9,-906 -33,-906 -14,-890 -21,-866 0,-880 21,-866 14,-890 33,-906 9,-906" fill={star} />
  </g>
);

export const Lock: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = "#f4c82a" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22,-10 V-34 a22,22 0 0 1 44,0 V-10" fill="none" stroke="#6a6a72" strokeWidth={8} />
    <rect x={-32} y={-12} width={64} height={52} rx={8} fill={col} stroke="#8a6a10" strokeWidth={3} />
    <circle cx={0} cy={10} r={7} fill="#3a2a08" />
  </g>
);

export const RuleTag: React.FC<{ n: number; y?: number; k?: number }> = ({ n, y = 380, k = 1 }) => (
  <g transform={`translate(${W / 2} ${y}) scale(${k})`} opacity={cl(k * 2)}>
    <g transform="rotate(-1.5)">
      <rect x={-190} y={-40} width={380} height={80} rx={6} fill="#d81e1e" />
      <text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#fff" letterSpacing={3}>{`ПРАВИЛО №${n}`}</text>
    </g>
  </g>
);
