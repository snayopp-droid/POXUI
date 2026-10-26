import React from "react";
import { FONT, H, W, cl, easeInOut, easeOut, pop, ramp, rnd } from "./PlagueArt";

export { FONT, H, W, cl, easeInOut, easeOut, pop, ramp, rnd };
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const easeIn = (x: number) => Math.pow(cl(x), 3);
export const TAU = Math.PI * 2;

export const RED = "#ff3b30";
export const YEL = "#ffd23a";
export const CYAN = "#52e0ff";

/** затемнить hex-цвет */
export const shade = (hex: string, f: number) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export const MDefs: React.FC = () => (
  <defs>
    <radialGradient id="m-warm"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.95" /><stop offset="0.35" stopColor="#ffb25a" stopOpacity="0.4" /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></radialGradient>
    <radialGradient id="m-cyan"><stop offset="0" stopColor="#bff4ff" stopOpacity="0.9" /><stop offset="0.4" stopColor="#52e0ff" stopOpacity="0.35" /><stop offset="1" stopColor="#52e0ff" stopOpacity="0" /></radialGradient>
    <radialGradient id="m-red"><stop offset="0" stopColor="#ff6a5a" stopOpacity="0.9" /><stop offset="0.4" stopColor="#ff2a1a" stopOpacity="0.35" /><stop offset="1" stopColor="#ff2a1a" stopOpacity="0" /></radialGradient>
    <radialGradient id="m-white"><stop offset="0" stopColor="#ffffff" stopOpacity="0.95" /><stop offset="0.4" stopColor="#ffffff" stopOpacity="0.3" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
    <radialGradient id="m-green"><stop offset="0" stopColor="#b6ff6a" stopOpacity="0.8" /><stop offset="1" stopColor="#7ee04a" stopOpacity="0" /></radialGradient>
    <radialGradient id="m-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.85" /></radialGradient>
    <linearGradient id="m-fadeb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.7" /></linearGradient>
    <linearGradient id="m-fadet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.7" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
    <filter id="m-blur6"><feGaussianBlur stdDeviation="6" /></filter>
    <filter id="m-blur14"><feGaussianBlur stdDeviation="14" /></filter>
    <filter id="m-blur30"><feGaussianBlur stdDeviation="30" /></filter>
  </defs>
);

export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <MDefs />
    {children}
  </svg>
);

/** камера: плавный наезд/сдвиг относительно центра кадра */
export const Cam: React.FC<{
  lt: number; dur: number; z0?: number; z1?: number; x0?: number; x1?: number; y0?: number; y1?: number; r0?: number; r1?: number;
  shake?: number; t: number; cx?: number; cy?: number; ease?: boolean; children: React.ReactNode;
}> = ({ lt, dur, z0 = 1, z1 = 1.08, x0 = 0, x1 = 0, y0 = 0, y1 = 0, r0 = 0, r1 = 0, shake = 0, t, cx = W / 2, cy = H / 2, ease = true, children }) => {
  const p = cl(lt / Math.max(0.1, dur));
  const e = ease ? easeInOut(p) : p;
  const z = lerp(z0, z1, e);
  const sx = (Math.sin(t * 31) + Math.sin(t * 17.3)) * shake;
  const sy = (Math.cos(t * 27) + Math.sin(t * 13.1)) * shake;
  const hx = Math.sin(t * 1.3) * 3;
  const hy = Math.cos(t * 1.7) * 3;
  return (
    <g transform={`translate(${cx + lerp(x0, x1, e) + sx + hx},${cy + lerp(y0, y1, e) + sy + hy}) rotate(${lerp(r0, r1, e)}) scale(${z}) translate(${-cx},${-cy})`}>
      {children}
    </g>
  );
};

export const Glow: React.FC<{ x: number; y: number; r: number; c?: "warm" | "cyan" | "red" | "white" | "green"; o?: number }> = ({ x, y, r, c = "warm", o = 1 }) => (
  <circle cx={x} cy={y} r={r} fill={`url(#m-${c})`} opacity={o} />
);

export const Bokeh: React.FC<{ t: number; n?: number; c?: string; y0?: number; y1?: number; seed?: number; o?: number }> = ({ t, n = 14, c = "#ffd9a0", y0 = 200, y1 = 1700, seed = 1, o = 0.3 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const r = 14 + rnd(i + seed) * 40;
      const x = ((rnd(i * 3 + seed) * W + t * (8 + rnd(i) * 14)) % (W + 160)) - 80;
      const y = y0 + rnd(i * 5 + seed) * (y1 - y0) + Math.sin(t * 0.6 + i) * 20;
      return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={o * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.8 + i)))} />;
    })}
  </g>
);

export const Birds: React.FC<{ t: number; y?: number; n?: number }> = ({ t, y = 380, n = 7 }) => (
  <g stroke="#1a1a2a" strokeWidth={3} fill="none" strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => {
      const x = ((t * (40 + rnd(i) * 30) + rnd(i + 4) * 1300) % 1500) - 200;
      const yy = y + rnd(i + 9) * 260 + Math.sin(t * 0.9 + i) * 14;
      const f = Math.sin(t * 9 + i * 2) * 9;
      const s = 0.7 + rnd(i + 2) * 0.8;
      return <path key={i} d={`M${x - 16 * s},${yy - f * s} Q${x - 6 * s},${yy - 8 * s} ${x},${yy} Q${x + 6 * s},${yy - 8 * s} ${x + 16 * s},${yy - f * s}`} />;
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Персонаж сбоку с циклом шага                                         */
/* ------------------------------------------------------------------ */
export type FigP = {
  x: number; y: number; s?: number; face?: 1 | -1; ph?: number; gait?: "walk" | "run" | "stand";
  jacket?: string; pants?: string; shoe?: string; skin?: string; hair?: string; hat?: string | null; bag?: string | null;
  mask?: boolean; opacity?: number; simple?: boolean; scared?: boolean; armF?: [number, number]; armB?: [number, number];
  phone?: boolean; lean?: number; cough?: number; hood?: boolean;
};

const GAIT = {
  walk: { A: 24, K: 38, arm: 24, fore: 20, lean: 3 },
  run: { A: 48, K: 80, arm: 55, fore: 70, lean: 13 },
  stand: { A: 0, K: 0, arm: 0, fore: 8, lean: 0 },
};
const L1 = 130;
const L2 = 126;
const HIP = 272;

const Leg: React.FC<{ th: number; k: number; pants: string; shoe: string }> = ({ th, k, pants, shoe }) => (
  <g transform={`translate(0,${-HIP}) rotate(${-th})`}>
    <rect x={-19} y={-8} width={38} height={L1 + 14} rx={18} fill={pants} />
    <g transform={`translate(0,${L1}) rotate(${k})`}>
      <rect x={-16} y={-8} width={32} height={L2 + 12} rx={16} fill={pants} />
      <g transform={`translate(0,${L2}) rotate(${th - k})`}>
        <path d="M-15,-10 H12 Q40,-4 44,14 V22 H-17 Z" fill={shoe} />
        <rect x={-17} y={16} width={61} height={6} fill="#e9e9ee" />
      </g>
    </g>
  </g>
);

const ArmSeg: React.FC<{ a: number; f: number; color: string; skin: string; hand?: React.ReactNode }> = ({ a, f, color, skin, hand }) => (
  <g transform={`translate(0,-436) rotate(${-a})`}>
    <rect x={-15} y={-10} width={30} height={102} rx={15} fill={color} />
    <g transform={`translate(0,90) rotate(${-f})`}>
      <rect x={-13} y={-8} width={26} height={92} rx={13} fill={color} />
      <circle cx={0} cy={88} r={14} fill={skin} />
      {hand}
    </g>
  </g>
);

export const Figure: React.FC<FigP> = ({
  x, y, s = 1, face = 1, ph = 0, gait = "walk", jacket = "#e8742a", pants = "#2a3142", shoe = "#14161c", skin = "#e9b995",
  hair = "#2a1d16", hat = null, bag = null, mask = false, opacity = 1, simple = false, scared = false, armF, armB,
  phone = false, lean, cough = 0, hood = false,
}) => {
  const g = GAIT[gait];
  const thF = g.A * Math.sin(ph);
  const thB = g.A * Math.sin(ph + Math.PI);
  const kF = g.K * (0.5 + 0.5 * Math.sin(ph - 1.1));
  const kB = g.K * (0.5 + 0.5 * Math.sin(ph + Math.PI - 1.1));
  const hip = HIP * (1 - Math.cos((Math.max(Math.abs(thF), Math.abs(thB)) * Math.PI) / 180));
  const aF = g.arm * Math.sin(ph + Math.PI);
  const aB = g.arm * Math.sin(ph);
  const fF = 8 + g.fore * (0.5 + 0.5 * Math.sin(ph + Math.PI - 0.6));
  const fB = 8 + g.fore * (0.5 + 0.5 * Math.sin(ph - 0.6));
  const ln = lean ?? g.lean;
  const cough1 = cough ? Math.sin(cough * 18) * 6 * cl(cough) : 0;
  const jDark = shade(jacket, 0.78);
  const pDark = shade(pants, 0.78);
  const af: [number, number] = armF ?? [aF, fF];
  const ab: [number, number] = armB ?? [aB, fB];
  const eyeR = scared ? 6.5 : 4.5;
  return (
    <g transform={`translate(${x},${y}) scale(${face * s},${s})`} opacity={opacity}>
      <ellipse cx={4} cy={4} rx={82} ry={13} fill="#000" opacity={0.3} />
      <g transform={`translate(0,${hip})`}>
        <Leg th={thB} k={kB} pants={pDark} shoe={shade(shoe, 0.8)} />
        <Leg th={thF} k={kF} pants={pants} shoe={shoe} />
        <g transform={`rotate(${-ln - cough1} 0 ${-HIP})`}>
          <ArmSeg a={ab[0]} f={ab[1]} color={jDark} skin={shade(skin, 0.85)} />
          {bag && (
            <g>
              <rect x={-96} y={-448} width={62} height={158} rx={16} fill={bag} />
              <rect x={-96} y={-448} width={62} height={20} rx={10} fill={shade(bag, 1.25)} opacity={0.7} />
              <rect x={-86} y={-396} width={42} height={5} fill="#fff" opacity={0.65} />
            </g>
          )}
          <rect x={-40} y={-456} width={80} height={192} rx={34} fill={jacket} />
          <rect x={-40} y={-456} width={22} height={192} rx={11} fill={shade(jacket, 0.88)} />
          <path d="M6,-452 V-268" stroke={shade(jacket, 0.7)} strokeWidth={3} />
          <rect x={-12} y={-474} width={30} height={30} rx={10} fill={skin} />
          {bag && <path d="M-12,-452 Q10,-380 32,-292" stroke={shade(bag, 0.7)} strokeWidth={9} fill="none" strokeLinecap="round" />}
          <g transform={`translate(6,-514)`}>
            <circle r={46} fill={skin} />
            <circle cx={-12} cy={6} r={9} fill={shade(skin, 0.88)} />
            {hat ? (
              <g>
                <path d="M-49,-20 Q-52,-62 0,-64 Q52,-62 49,-20 Q0,-30 -49,-20 Z" fill={hat} />
                <rect x={-49} y={-32} width={98} height={13} rx={6} fill={shade(hat, 0.8)} />
              </g>
            ) : hood ? (
              <path d="M-52,18 Q-58,-58 0,-58 Q54,-56 52,-6 Q30,-26 6,-24 Q-22,-22 -34,18 Z" fill={jacket} />
            ) : (
              <path d="M-47,12 Q-53,-48 0,-51 Q42,-51 47,-12 Q26,-26 4,-21 Q-24,-18 -33,12 Z" fill={hair} />
            )}
            {!simple && (
              <g>
                <path d="M44,-4 q16,10 0,18" fill={skin} stroke={shade(skin, 0.8)} strokeWidth={2} />
                <circle cx={24} cy={-6} r={eyeR} fill="#fff" />
                <circle cx={26} cy={-6} r={eyeR * 0.55} fill="#1a1210" />
                <path d={scared ? "M14,-18 L36,-12" : "M14,-14 L36,-14"} stroke="#2a1a12" strokeWidth={3.4} strokeLinecap="round" />
                {mask ? (
                  <g>
                    <path d="M47,4 L-6,8 L-8,30 Q22,52 44,34 Z" fill="#9fdcf0" stroke="#68b4d0" strokeWidth={2} />
                    <path d="M-4,12 L-34,2" stroke="#d9e8f2" strokeWidth={2} />
                  </g>
                ) : scared ? (
                  <ellipse cx={30} cy={28} rx={7} ry={9} fill="#5a1f1f" />
                ) : (
                  <path d="M22,28 q10,4 18,-2" stroke="#8a3a30" strokeWidth={3} fill="none" strokeLinecap="round" />
                )}
              </g>
            )}
          </g>
          <ArmSeg
            a={af[0]}
            f={af[1]}
            color={jacket}
            skin={skin}
            hand={phone ? <g transform="translate(6,-8) rotate(-12)"><rect x={-8} y={-34} width={20} height={40} rx={5} fill="#15161c" /><rect x={-5} y={-30} width={14} height={32} rx={3} fill="#bfe8ff" /></g> : undefined}
          />
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Толпа бегущих                                                         */
/* ------------------------------------------------------------------ */
const CROWD_JACKETS = ["#c94a3a", "#3a6fb0", "#e0b43a", "#5a9a5a", "#8a5ab0", "#e8e8ee", "#2a2f3a", "#d9783a", "#4aa8a0", "#a83a6a"];
const CROWD_PANTS = ["#232733", "#2f3a52", "#3a2f2a", "#1b1b22", "#4a4e5a"];
const CROWD_SKIN = ["#e9b995", "#d9a27c", "#f0c9a8", "#b9815a", "#8a5a3a"];
const CROWD_HAIR = ["#2a1d16", "#4a2c1e", "#8a6a3a", "#1a1a1a", "#c4a06a", "#6a3a1e"];

export const Runner: React.FC<{ x: number; y: number; s: number; t: number; i: number; face?: 1 | -1; speed?: number; gait?: "walk" | "run"; opacity?: number; tintDark?: number }> = ({
  x, y, s, t, i, face = 1, speed = 1, gait = "run", opacity = 1, tintDark = 1,
}) => (
  <Figure
    x={x} y={y} s={s} face={face} gait={gait} simple
    ph={t * (gait === "run" ? 11 : 7) * speed + i * 1.7}
    jacket={shade(CROWD_JACKETS[i % CROWD_JACKETS.length], tintDark)}
    pants={shade(CROWD_PANTS[(i * 3) % CROWD_PANTS.length], tintDark)}
    skin={shade(CROWD_SKIN[(i * 7) % CROWD_SKIN.length], tintDark)}
    hair={CROWD_HAIR[(i * 5) % CROWD_HAIR.length]}
    bag={i % 3 === 0 ? shade(CROWD_JACKETS[(i + 4) % CROWD_JACKETS.length], tintDark * 0.9) : null}
    hat={i % 5 === 1 ? shade(CROWD_JACKETS[(i + 2) % CROWD_JACKETS.length], tintDark) : null}
    opacity={opacity}
  />
);

/** лента толпы, бегущей слева направо (или наоборот) */
export const CrowdRow: React.FC<{ t: number; y: number; s: number; n: number; speed: number; face?: 1 | -1; seed?: number; gait?: "walk" | "run"; tintDark?: number; opacity?: number; span?: number }> = ({
  t, y, s, n, speed, face = 1, seed = 0, gait = "run", tintDark = 1, opacity = 1, span = W + 700,
}) => (
  <g opacity={opacity}>
    {Array.from({ length: n }).map((_, k) => {
      const base = (k / n) * span + rnd(k + seed) * 90;
      const px = ((base + t * speed * face) % span + span) % span - 350;
      const jitter = Math.sin(t * 5 + k) * 4;
      return <Runner key={k} x={px} y={y + jitter + (rnd(k + seed + 7) - 0.5) * 30 * s} s={s * (0.9 + rnd(k + seed + 3) * 0.25)} t={t} i={k + seed} face={face} gait={gait} tintDark={tintDark} speed={0.9 + rnd(k + seed) * 0.3} />;
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Город                                                                 */
/* ------------------------------------------------------------------ */
export const Facade: React.FC<{ x: number; y: number; w: number; h: number; col: string; seed: number; lit?: number; t?: number; cols?: number; shop?: boolean; win?: string; unlit?: string }> = ({
  x, y, w, h, col, seed, lit = 0.35, t = 0, cols = 4, shop = false, win = "#ffe39a", unlit = "#26324a",
}) => {
  const rows = Math.max(2, Math.floor(h / 120));
  const cw = w / cols;
  const rh = (h - (shop ? 150 : 40)) / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={col} />
      <rect x={x} y={y} width={w} height={14} fill="#000" opacity={0.15} />
      <rect x={x + w - 16} y={y} width={16} height={h} fill="#000" opacity={0.12} />
      {Array.from({ length: rows }).map((_, j) =>
        Array.from({ length: cols }).map((__, i) => {
          const on = rnd(seed + i * 3 + j * 11) < lit;
          const fl = on && rnd(Math.floor(t * 1.5) + i + j * 5 + seed) > 0.985 ? 0.4 : 1;
          return <rect key={`${i}-${j}`} x={x + i * cw + cw * 0.2} y={y + 30 + j * rh + rh * 0.12} width={cw * 0.6} height={rh * 0.62} fill={on ? win : unlit} opacity={on ? fl : 1} rx={3} />;
        }),
      )}
      {shop && (
        <g>
          <rect x={x} y={y + h - 130} width={w} height={130} fill="#1a1f2c" />
          <rect x={x + 10} y={y + h - 118} width={w - 20} height={20} fill={rnd(seed) > 0.5 ? "#d94a3a" : "#3a8ad9"} opacity={0.9} />
          <rect x={x + 14} y={y + h - 90} width={w - 28} height={70} fill="#ffd9a0" opacity={0.55 + 0.2 * Math.sin(t * 2 + seed)} />
        </g>
      )}
    </g>
  );
};

/** автомобиль сбоку */
export const Car: React.FC<{ x: number; y: number; s?: number; col: string; face?: 1 | -1; t: number; seed?: number }> = ({ x, y, s = 1, col, face = 1, t, seed = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${face * s},${s})`}>
    <ellipse cx={0} cy={4} rx={130} ry={12} fill="#000" opacity={0.35} />
    <path d="M-130,-10 V-48 Q-130,-64 -112,-66 L-70,-72 Q-48,-112 -10,-112 L52,-112 Q86,-110 100,-78 L120,-72 Q134,-68 134,-50 V-10 Z" fill={col} />
    <path d="M-52,-76 Q-38,-102 -10,-102 L18,-102 L18,-76 Z M30,-102 L52,-102 Q76,-100 88,-76 L30,-76 Z" fill="#1a2438" opacity={0.92} />
    <rect x={-130} y={-30} width={264} height={10} fill="#000" opacity={0.18} />
    <circle cx={128} cy={-50} r={8} fill="#fff6d0" />
    <circle cx={-128} cy={-50} r={7} fill="#ff4a3a" />
    <Glow x={150} y={-48} r={60} c="warm" o={0.5} />
    {[-80, 84].map((cx, i) => (
      <g key={i} transform={`translate(${cx},-4)`}>
        <circle r={27} fill="#121218" />
        <circle r={14} fill="#6a6e7a" />
        <g transform={`rotate(${t * 520 * (i ? 1 : 1) + seed * 40})`}>
          <path d="M0,-12 V12 M-12,0 H12" stroke="#2a2d36" strokeWidth={3} />
        </g>
      </g>
    ))}
  </g>
);

export const LampPost: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-6} y={-480} width={12} height={480} fill="#1b1e28" />
    <path d="M0,-480 q40,-12 70,0" stroke="#1b1e28" strokeWidth={10} fill="none" />
    <ellipse cx={70} cy={-470} rx={30} ry={8} fill="#2a2e3a" />
    {on && <Glow x={70} y={-440} r={150} c="warm" o={0.6} />}
  </g>
);

/** вертикальный столб со знаком метро «М» */
export const MetroSign: React.FC<{ x: number; y: number; s?: number; glow?: number; pulse?: number }> = ({ x, y, s = 1, glow = 1, pulse = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <Glow x={0} y={-340} r={420 * glow} c="red" o={0.55 + pulse * 0.4} />
    <rect x={-14} y={-300} width={28} height={300} fill="#23262f" />
    <rect x={-140} y={-620} width={280} height={320} rx={26} fill="#2a2d38" />
    <rect x={-122} y={-602} width={244} height={284} rx={18} fill="#e83a2e" />
    <path d="M-86,-350 V-540 L0,-420 L86,-540 V-350 H58 V-470 L0,-390 L-58,-470 V-350 Z" fill="#fff" />
    <rect x={-122} y={-602} width={244} height={284} rx={18} fill="url(#m-white)" opacity={0.18 + pulse * 0.2} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Телефон и интерфейс                                                   */
/* ------------------------------------------------------------------ */
export const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; children?: React.ReactNode; w?: number; h?: number }> = ({ x, y, s = 1, rot = 0, children, w = 460, h = 940 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={64} fill="#0b0c10" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={50} fill="#0c1220" />
    <rect x={-60} y={-h / 2 + 12} width={120} height={26} rx={13} fill="#05060a" />
    {children}
  </g>
);

export const Pill: React.FC<{ x: number; y: number; text: string; bg?: string; fg?: string; size?: number; k?: number; align?: "middle" | "start" }> = ({ x, y, text, bg = RED, fg = "#fff", size = 30, k = 1, align = "middle" }) => {
  const w = text.length * size * 0.66 + 40;
  const ox = align === "middle" ? -w / 2 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={cl(k * 2)}>
      <rect x={ox} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.5} fill={bg} />
      <text x={ox + w / 2} y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={fg} letterSpacing={1.5}>{text}</text>
    </g>
  );
};

/** облако дыхания / кашля */
export const Breath: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; n?: number; c?: string; sc?: number; o?: number }> = ({ x, y, t, dir = 1, n = 6, c = "#b6ff6a", sc = 1, o = 0.5 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = (t * 0.9 + i / n) % 1;
      return <circle key={i} cx={x + dir * p * 150 * sc} cy={y - p * 30 * sc + Math.sin(i * 3 + t * 4) * 6} r={(8 + p * 34) * sc} fill={c} opacity={o * (1 - p)} />;
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Перспектива: эскалатор и станция                                      */
/* ------------------------------------------------------------------ */
export const VP = { x: 540, y: 700 };

/** спуск по эскалатору (вид вперёд-вниз, одна точка схода) */
export const EscalatorTunnel: React.FC<{ t: number; speed?: number; moving?: number; vpx?: number; vpy?: number; tint?: string }> = ({ t, speed = 0.5, moving = 1, vpx = VP.x, vpy = VP.y, tint = "#ffc986" }) => {
  const phase = (t * speed * moving) % 1;
  const rails = [-1, 1];
  const near = { l: -560, r: 1640, top: -200, bot: 2240 };
  const lerpP = (a: number, b: number, k: number) => a + (b - a) * k;
  // коридор: стены сходятся к vp
  const pt = (side: number, k: number, yy: number) => {
    // k 0=ближний край, 1=точка схода
    const xE = side < 0 ? near.l : near.r;
    return { x: lerpP(xE, vpx, k), y: lerpP(yy, vpy, k) };
  };
  void pt;
  return (
    <g>
      <rect width={W} height={H} fill="#16120e" />
      {/* потолок */}
      <polygon points={`${near.l},${near.top} ${near.r},${near.top} ${vpx + 40},${vpy - 40} ${vpx - 40},${vpy - 40}`} fill="#241c14" />
      {/* стены */}
      <polygon points={`${near.l},${near.top} ${vpx - 40},${vpy - 40} ${vpx - 40},${vpy + 40} ${near.l},${near.bot}`} fill="#2a2018" />
      <polygon points={`${near.r},${near.top} ${vpx + 40},${vpy - 40} ${vpx + 40},${vpy + 40} ${near.r},${near.bot}`} fill="#2a2018" />
      {/* пол — ступени эскалатора */}
      <polygon points={`${near.l},${near.bot} ${near.r},${near.bot} ${vpx + 40},${vpy + 40} ${vpx - 40},${vpy + 40}`} fill="#3a3a44" />
      {/* ступени: полосы, движущиеся к зрителю */}
      {Array.from({ length: 26 }).map((_, i) => {
        const z = ((i + phase) / 26);
        const k = 1 - Math.pow(z, 1.7); // 0 близко, 1 далеко... инвертируем
        const kk = Math.pow(1 - z, 2.2);
        const yy = lerpP(near.bot, vpy + 40, 1 - kk);
        const half = lerpP(1100, 40, 1 - kk);
        void k;
        return <path key={i} d={`M${vpx - half},${yy} L${vpx + half},${yy}`} stroke="#15151c" strokeWidth={2 + kk * 10} opacity={0.9} />;
      })}
      {/* поручни */}
      {rails.map((sd) => (
        <polygon key={sd} points={`${vpx + sd * 520},${near.bot - 420} ${vpx + sd * 620},${near.bot - 420} ${vpx + sd * 46},${vpy + 18} ${vpx + sd * 40},${vpy + 18}`} fill="#0b0b10" />
      ))}
      {/* светильники на потолке и стенах, бегут к зрителю */}
      {Array.from({ length: 14 }).map((_, i) => {
        const z = (i + phase) / 14;
        const kk = Math.pow(1 - z, 2.4);
        const yy = lerpP(vpy - 40, near.top + 120, kk);
        const w = lerpP(30, 520, kk);
        const hh = lerpP(6, 36, kk);
        return (
          <g key={i}>
            <rect x={vpx - w / 2} y={yy} width={w} height={hh} rx={hh / 2} fill={tint} opacity={0.95} />
            <ellipse cx={vpx} cy={yy + hh} rx={w * 0.9} ry={hh * 4} fill={tint} opacity={0.1} />
            <circle cx={lerpP(vpx - 40, near.l + 80, kk)} cy={lerpP(vpy, 620, kk)} r={lerpP(3, 46, kk)} fill={tint} opacity={0.75} />
            <circle cx={lerpP(vpx + 40, near.r - 80, kk)} cy={lerpP(vpy, 620, kk)} r={lerpP(3, 46, kk)} fill={tint} opacity={0.75} />
          </g>
        );
      })}
      <Glow x={vpx} y={vpy} r={360} c="warm" o={0.9} />
    </g>
  );
};

/** арочный зал станции (вид вдоль платформы) */
export const StationHall: React.FC<{ t: number; vpx?: number; vpy?: number; lights?: number; red?: number; train?: boolean; shift?: number; empty?: boolean }> = ({ t, vpx = 540, vpy = 760, lights = 1, red = 0, train = true, shift = 0, empty = false }) => {
  void empty;
  const N = 9;
  const phase = (shift * 0.3) % 1;
  const col = lights > 0.05 ? "#ffd9a0" : "#5a4a3a";
  return (
    <g>
      <rect width={W} height={H} fill="#0c0b0e" />
      {/* пол */}
      <polygon points={`-300,${H} ${W + 300},${H} ${vpx + 120},${vpy + 90} ${vpx - 120},${vpy + 90}`} fill="#3b3836" />
      <polygon points={`-300,${H} ${W + 300},${H} ${vpx + 120},${vpy + 90} ${vpx - 120},${vpy + 90}`} fill="url(#m-fadeb)" opacity={0.5} />
      {/* путь */}
      <polygon points={`${vpx - 90},${vpy + 90} ${vpx + 90},${vpy + 90} ${vpx + 560},${H} ${vpx - 560},${H}`} fill="#15151a" />
      {[-1, 1].map((sd) => <path key={sd} d={`M${vpx + sd * 40},${vpy + 90} L${vpx + sd * 420},${H}`} stroke="#8a8a96" strokeWidth={4} />)}
      {/* свод */}
      <polygon points={`-300,-300 ${W + 300},-300 ${vpx + 120},${vpy - 130} ${vpx - 120},${vpy - 130}`} fill="#241c16" />
      {/* арки (пилоны) по бокам */}
      {Array.from({ length: N }).map((_, i) => {
        const z = (i + phase) / N;
        const k = Math.pow(1 - z, 2.1);
        const xL = lerp(vpx - 90, -420, k);
        const xR = lerp(vpx + 90, W + 420, k);
        const top = lerp(vpy - 120, -200, k);
        const bot = lerp(vpy + 90, H + 160, k);
        const pw = lerp(10, 280, k);
        return (
          <g key={i} opacity={cl(1.2 - z * 0.6)}>
            <rect x={xL} y={top} width={pw} height={bot - top} fill="#6d5a47" />
            <rect x={xR - pw} y={top} width={pw} height={bot - top} fill="#6d5a47" />
            <rect x={xL + pw * 0.15} y={top} width={pw * 0.3} height={bot - top} fill="#b59a76" opacity={0.6} />
            <rect x={xR - pw * 0.45} y={top} width={pw * 0.3} height={bot - top} fill="#b59a76" opacity={0.6} />
            {/* ребро арки */}
            <path d={`M${xL + pw},${top + (bot - top) * 0.25} Q${(xL + xR) / 2},${top - (bot - top) * 0.12} ${xR - pw},${top + (bot - top) * 0.25}`} stroke="#8a7050" strokeWidth={lerp(2, 26, k)} fill="none" />
            {/* светильники */}
            <circle cx={xL + pw + 4} cy={lerp(vpy - 20, 560, k)} r={lerp(3, 40, k)} fill={col} opacity={lights} />
            <circle cx={xR - pw - 4} cy={lerp(vpy - 20, 560, k)} r={lerp(3, 40, k)} fill={col} opacity={lights} />
            <ellipse cx={(xL + xR) / 2} cy={top + (bot - top) * 0.1} rx={lerp(8, 130, k)} ry={lerp(3, 40, k)} fill={col} opacity={lights * 0.95} />
            <Glow x={(xL + xR) / 2} y={top + (bot - top) * 0.1} r={lerp(30, 340, k)} c="warm" o={0.4 * lights} />
          </g>
        );
      })}
      {train && (
        <g>
          <rect x={vpx - 100} y={vpy - 70} width={200} height={150} rx={14} fill="#2a2d38" />
          <rect x={vpx - 74} y={vpy - 50} width={148} height={70} rx={8} fill="#1a2030" />
          <Glow x={vpx - 62} y={vpy + 40} r={90} c="white" o={0.8 * Math.min(1, lights + 0.3)} />
          <Glow x={vpx + 62} y={vpy + 40} r={90} c="white" o={0.8 * Math.min(1, lights + 0.3)} />
        </g>
      )}
      <Glow x={vpx} y={vpy} r={420} c="warm" o={0.6 * lights} />
      {red > 0 && <rect width={W} height={H} fill="#ff1a0a" opacity={red * (0.18 + 0.14 * Math.sin(t * 7))} />}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Мелочи интерфейса                                                    */
/* ------------------------------------------------------------------ */
export const Scan: React.FC<{ t: number; o?: number }> = ({ t, o = 0.05 }) => (
  <g opacity={o}>
    {Array.from({ length: 48 }).map((_, i) => <rect key={i} x={0} y={i * 40 + ((t * 30) % 40)} width={W} height={2} fill="#fff" />)}
  </g>
);

export const Vignette: React.FC<{ o?: number }> = ({ o = 1 }) => <rect width={W} height={H} fill="url(#m-vig)" opacity={o} />;
