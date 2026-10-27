import React from "react";

/** «Билет в один конец»: базовые утилиты, камера, плёнка, каше */
export const W = 1920;
export const H = 1080;
/** высота чёрной полосы каше 2.39:1 */
export const BAR = Math.round((H - W / 2.39) / 2);
export const TOP = BAR;
export const BOT = H - BAR;
export const SERIF = "'Liberation Serif', 'DejaVu Serif', Georgia, serif";
export const SANS = "'Liberation Sans', 'DejaVu Sans', Arial, sans-serif";

export const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const ramp = (x: number, a: number, b: number) => cl((x - a) / (b - a));
export const eio = (x: number) => {
  const v = cl(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
export const eout = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const ein = (x: number) => Math.pow(cl(x), 3);
/** плавный переход a→b за отрезок [t0,t1] */
export const tw = (t: number, t0: number, t1: number, a: number, b: number, e: (x: number) => number = eio) => lerp(a, b, e(ramp(t, t0, t1)));
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** гладкий шум 1D */
export const nz = (t: number, seed = 0) => {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  return lerp(rnd(i + seed * 101) * 2 - 1, rnd(i + 1 + seed * 101) * 2 - 1, u);
};
export const TAU = Math.PI * 2;

export const mix = (c1: string, c2: string, k: number) => {
  const p = (c: string) => {
    const h = c.length === 4 ? "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3] : c;
    return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  const a = p(c1);
  const b = p(c2);
  const r = a.map((v, i) => Math.round(lerp(v, b[i], cl(k))));
  return "#" + r.map((v) => v.toString(16).padStart(2, "0")).join("");
};

export type SP = { t: number; lt: number; dur: number };

/** холст сцены */
export const Svg: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = "#000" }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, background: bg }}>
    <Defs />
    {children}
  </svg>
);

/**
 * Камера: x,y — точка мира в центре кадра, z — зум, r — крен (град).
 * hand — амплитуда «ручной» камеры в px.
 */
export const Cam: React.FC<{ x?: number; y?: number; z?: number; r?: number; hand?: number; t?: number; children: React.ReactNode }> = ({
  x = W / 2,
  y = H / 2,
  z = 1,
  r = 0,
  hand = 0,
  t = 0,
  children,
}) => {
  const hx = hand * nz(t * 0.9, 3) + hand * 0.4 * nz(t * 2.3, 7);
  const hy = hand * nz(t * 0.8, 5) + hand * 0.4 * nz(t * 2.1, 9);
  const hr = hand * 0.012 * nz(t * 0.6, 11);
  return <g transform={`translate(${W / 2 + hx} ${H / 2 + hy}) rotate(${r + hr}) scale(${z}) translate(${-x} ${-y})`}>{children}</g>;
};

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="b-vig" cx="50%" cy="50%" r="72%">
      <stop offset="55%" stopColor="#000" stopOpacity={0} />
      <stop offset="100%" stopColor="#000" stopOpacity={0.78} />
    </radialGradient>
    <radialGradient id="b-warm" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffd9a3" stopOpacity={0.9} />
      <stop offset="35%" stopColor="#ffb766" stopOpacity={0.35} />
      <stop offset="100%" stopColor="#ff9a3c" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="b-sodium" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffc47a" stopOpacity={0.75} />
      <stop offset="40%" stopColor="#e88f3a" stopOpacity={0.22} />
      <stop offset="100%" stopColor="#c46a20" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="b-cold" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#dfe9ff" stopOpacity={0.8} />
      <stop offset="40%" stopColor="#a9bfe6" stopOpacity={0.22} />
      <stop offset="100%" stopColor="#7d93c0" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="b-screen" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#cfe0ff" stopOpacity={0.55} />
      <stop offset="100%" stopColor="#8fb0ff" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="b-skin" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#6b4a3a" />
      <stop offset="55%" stopColor="#b98a6c" />
      <stop offset="100%" stopColor="#e0b391" />
    </linearGradient>
    <filter id="b-blur2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={2} />
    </filter>
    <filter id="b-blur6" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={6} />
    </filter>
    <filter id="b-blur14" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation={14} />
    </filter>
    <filter id="b-blur30" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={30} />
    </filter>
  </defs>
);

/** мягкий источник света */
export const Glow: React.FC<{ x: number; y: number; r: number; k?: "warm" | "sodium" | "cold" | "screen"; o?: number; sy?: number }> = ({ x, y, r, k = "warm", o = 1, sy = 1 }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * sy} fill={`url(#b-${k})`} opacity={o} />
);

/** падающий снег: deterministic, слои с разной глубиной */
export const Snow: React.FC<{ t: number; n?: number; wind?: number; speed?: number; size?: number; o?: number; seed?: number; x0?: number; x1?: number; y0?: number; y1?: number; c?: string; blur?: boolean }> = ({
  t,
  n = 120,
  wind = 40,
  speed = 90,
  size = 3,
  o = 0.8,
  seed = 1,
  x0 = -100,
  x1 = W + 100,
  y0 = -40,
  y1 = H + 40,
  c = "#eef2f8",
  blur = false,
}) => {
  const span = y1 - y0;
  return (
    <g opacity={o} filter={blur ? "url(#b-blur2)" : undefined}>
      {Array.from({ length: n }, (_, i) => {
        const r1 = rnd(i * 3.1 + seed);
        const r2 = rnd(i * 7.7 + seed * 2);
        const r3 = rnd(i * 1.3 + seed * 5);
        const depth = 0.4 + r3 * 0.9;
        const y = y0 + ((r2 * span + t * speed * depth) % span);
        const x = x0 + ((r1 * (x1 - x0) + t * wind * depth + Math.sin(t * 1.3 + i) * 14) % (x1 - x0) + (x1 - x0)) % (x1 - x0);
        return <circle key={i} cx={x} cy={y} r={size * depth} fill={c} opacity={0.35 + depth * 0.5} />;
      })}
    </g>
  );
};

/** зерно плёнки + неровность экспозиции */
export const Grain: React.FC<{ frame: number; o?: number }> = ({ frame, o = 0.11 }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }}>
    <filter id="b-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 97} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={W} height={H} filter="url(#b-grain)" />
  </svg>
);

export const Vignette: React.FC<{ o?: number }> = ({ o = 1 }) => <rect width={W} height={H} fill="url(#b-vig)" opacity={o} />;

/** текст с разрядкой для титров */
export const Spaced: React.FC<{ x: number; y: number; text: string; size: number; sp?: number; fill?: string; o?: number; font?: string; weight?: number; anchor?: "middle" | "start" | "end" }> = ({
  x,
  y,
  text,
  size,
  sp = 0.3,
  fill = "#f2efe8",
  o = 1,
  font = SERIF,
  weight = 400,
  anchor = "middle",
}) => (
  <text x={x} y={y} fontFamily={font} fontSize={size} fill={fill} opacity={o} textAnchor={anchor} letterSpacing={size * sp} fontWeight={weight}>
    {text}
  </text>
);

/** подпись-представление персонажа (как в кино: тонкая линия + имя) */
export const NameCard: React.FC<{ x: number; y: number; name: string; sub: string; lt: number; at?: number }> = ({ x, y, name, sub, lt, at = 0.4 }) => {
  const k = eout(ramp(lt, at, at + 0.8));
  const o = k * (1 - ramp(lt, at + 3.6, at + 4.3));
  return (
    <g opacity={o}>
      <rect x={x} y={y - 46} width={3} height={78} fill="#e9dcc4" />
      <Spaced x={x + 22 + (1 - k) * 20} y={y} text={name} size={44} sp={0.28} anchor="start" />
      <Spaced x={x + 24 + (1 - k) * 30} y={y + 30} text={sub} size={18} sp={0.35} anchor="start" font={SANS} fill="#c9c1b2" />
    </g>
  );
};
