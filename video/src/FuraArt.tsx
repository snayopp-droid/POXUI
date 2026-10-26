import React from "react";

export const W = 1920;
export const H = 1080;
export const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
export const INK = "#262631";
export const SKIN = "#f5f0e4";
export const RED = "#e0443a";
export const GREEN = "#3f9a5a";
export const YEL = "#f2c230";
export const PAPER = "#ece6d5";

export const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const ramp = (x: number, a: number, b: number) => cl((x - a) / (b - a));
export const easeOut = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const easeIn = (x: number) => Math.pow(cl(x), 3);
export const easeInOut = (x: number) => {
  const v = cl(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
export const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
/** pop-in с перелётом */
export const pop = (x: number, a: number, d = 0.32) => {
  const p = cl((x - a) / d);
  return p === 0 ? 0 : 1 + Math.sin(p * Math.PI) * 0.1 * (1 - p) - (1 - easeOut(p)) * 0.55;
};
export const TAU = Math.PI * 2;

export const shade = (hex: string, f: number) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.round((n & 255) * f));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export const FDefs: React.FC = () => (
  <defs>
    <pattern id="f-plaid" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="30" height="30" fill="#b8392f" />
      <rect width="30" height="8" y="11" fill="#1c1d24" opacity="0.8" />
      <rect width="8" height="30" x="11" fill="#1c1d24" opacity="0.8" />
      <rect width="30" height="2" y="4" fill="#fff" opacity="0.25" />
    </pattern>
    <radialGradient id="f-glow"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.95" /><stop offset="0.35" stopColor="#ffe9a8" stopOpacity="0.4" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0" /></radialGradient>
    <radialGradient id="f-white"><stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset="0.3" stopColor="#fff" stopOpacity="0.5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
    <radialGradient id="f-red"><stop offset="0" stopColor="#ff5a4a" stopOpacity="0.8" /><stop offset="1" stopColor="#ff3a2a" stopOpacity="0" /></radialGradient>
    <radialGradient id="f-ember"><stop offset="0" stopColor="#ffb04a" stopOpacity="1" /><stop offset="1" stopColor="#ff6a1a" stopOpacity="0" /></radialGradient>
    <radialGradient id="f-vig" cx="0.5" cy="0.5" r="0.78"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></radialGradient>
    <linearGradient id="f-sunray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3b8" stopOpacity="0.5" /><stop offset="1" stopColor="#fff3b8" stopOpacity="0" /></linearGradient>
    <filter id="f-blur8"><feGaussianBlur stdDeviation="8" /></filter>
    <filter id="f-blur20"><feGaussianBlur stdDeviation="20" /></filter>
  </defs>
);

export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <FDefs />
    {children}
  </svg>
);

/** камера по миру: центр (cx,cy) и зум */
export const Cam: React.FC<{ cx: number; cy: number; z?: number; rot?: number; shake?: number; t: number; children: React.ReactNode }> = ({ cx, cy, z = 1, rot = 0, shake = 0, t, children }) => {
  const sx = (Math.sin(t * 33) + Math.sin(t * 19.7)) * shake;
  const sy = (Math.cos(t * 29) + Math.sin(t * 14.3)) * shake;
  return (
    <g transform={`translate(${W / 2 + sx},${H / 2 + sy}) rotate(${rot}) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>
  );
};

/* ------------------------------------------------------------------ */
/* Человечек                                                            */
/* ------------------------------------------------------------------ */
export type Mood = "neutral" | "worry" | "scared" | "smile" | "sad" | "angry" | "smirk" | "shock" | "sleep" | "tired";
export type Hair = "none" | "short" | "slick" | "long" | "cap" | "gray" | "curly";

export type PersonP = {
  x: number; y: number; s?: number; flip?: boolean; t: number;
  shirt?: string; pants?: string; skin?: string; hair?: Hair; hairCol?: string; cap?: string;
  look?: "plaid" | "suit" | "dress" | "plain"; tie?: string; shoe?: string;
  mood?: Mood; talk?: number; lookX?: number; lookY?: number;
  armL?: number; armR?: number; tL?: [number, number]; tR?: [number, number]; handL?: React.ReactNode; handR?: React.ReactNode;
  blood?: number; stubble?: boolean; glasses?: boolean; ring?: boolean; bigHands?: boolean; chain?: boolean;
  walk?: number; breathe?: boolean; opacity?: number; tilt?: number; sit?: boolean; hide?: boolean; tears?: number;
};

export const Person: React.FC<PersonP> = ({
  x, y, s = 1, flip, t, shirt = "#e8b53a", pants = "#2d2f3b", skin = SKIN, hair = "short", hairCol = "#2a1d16", cap = "#2a3a5a",
  look = "plain", tie = "#c43a3a", shoe = "#1c1d24", mood = "neutral", talk = 0, lookX = 0, lookY = 0,
  armL = 8, armR = 8, tL, tR, handL, handR, blood = 0, stubble = false, glasses = false, ring = false, bigHands = false, chain = false,
  walk, breathe = true, opacity = 1, tilt = 0, sit = false, hide = false, tears = 0,
}) => {
  if (hide) return null;
  const sw = walk !== undefined ? Math.sin(walk) : 0;
  const bob = breathe ? Math.sin(t * 2.3) * 2.2 : 0;
  const walkBob = walk !== undefined ? Math.abs(Math.cos(walk)) * -8 : 0;
  const hy = -372 + bob * 0.5 + walkBob;
  const legL = { x: -24 + sw * 34, y: -8 - Math.max(0, -sw) * 16 };
  const legR = { x: 24 - sw * 34, y: -8 - Math.max(0, sw) * 16 };
  const aL = armL + (walk !== undefined ? sw * 22 : 0);
  const aR = armR - (walk !== undefined ? sw * 22 : 0);
  const sL = { x: -54, y: -290 + walkBob + bob };
  const sR = { x: 54, y: -290 + walkBob + bob };
  const L1 = 70;
  const L2 = 70;
  const mkArm = (sh: { x: number; y: number }, sd: number, ang: number, tg?: [number, number]) => {
    if (!tg) {
      const a = (ang * Math.PI) / 180;
      const hx = sh.x + sd * Math.sin(a) * 140;
      const hy2 = sh.y + Math.cos(a) * 138;
      return { e: { x: (sh.x + hx) / 2 + sd * 4, y: (sh.y + hy2) / 2 }, h: { x: hx, y: hy2 } };
    }
    const dx = tg[0] - sh.x;
    const dy = tg[1] - sh.y;
    const d = Math.min(L1 + L2 - 2, Math.max(24, Math.hypot(dx, dy)));
    const phi = Math.atan2(dy, dx);
    const A = Math.acos(cl((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const e1 = { x: sh.x + L1 * Math.cos(phi + A), y: sh.y + L1 * Math.sin(phi + A) };
    const e2 = { x: sh.x + L1 * Math.cos(phi - A), y: sh.y + L1 * Math.sin(phi - A) };
    const e = e1.y > e2.y ? e1 : e2;
    return { e, h: { x: sh.x + Math.cos(phi) * d, y: sh.y + Math.sin(phi) * d } };
  };
  const armLd = mkArm(sL, -1, aL, tL);
  const armRd = mkArm(sR, 1, aR, tR);
  const hL = armLd.h;
  const hR = armRd.h;
  const hr = bigHands ? 18 : 13;
  const blink = Math.sin(t * 1.7 + x * 0.01) > 0.992 || mood === "sleep";
  const mouthOpen = talk > 0 ? (0.35 + 0.65 * Math.abs(Math.sin(t * 15 + x))) * talk : 0;
  const eyeX = 23;
  const eyeY = -6;
  const lookDX = lookX * 6;
  const lookDY = lookY * 4;
  const sleeve = look === "suit" ? "#1f2a44" : shirt;
  const torsoCol = look === "plaid" ? "url(#f-plaid)" : look === "suit" ? "#1f2a44" : look === "dress" ? shirt : shirt;
  const legsDraw = (
    <g stroke={INK} strokeWidth={10} strokeLinecap="round">
      <line x1={-24} y1={-158} x2={legL.x} y2={legL.y} stroke={pants === "skirt" ? skin : pants} />
      <line x1={24} y1={-158} x2={legR.x} y2={legR.y} stroke={pants === "skirt" ? skin : pants} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${tilt})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={86} ry={11} fill="#000" opacity={0.18} />
      {!sit && legsDraw}
      {!sit && (
        <g fill={shoe}>
          <ellipse cx={legL.x - 4} cy={legL.y + 2} rx={22} ry={10} />
          <ellipse cx={legR.x + 4} cy={legR.y + 2} rx={22} ry={10} />
        </g>
      )}
      {look === "dress" && <path d="M-62,-168 L62,-168 L88,-48 L-88,-48 Z" fill={shirt} stroke={INK} strokeWidth={3} />}
      {/* длинные волосы — позади */}
      {hair === "long" && <path d={`M-70,${hy + 6} Q-86,${hy + 150} -50,${hy + 190} L50,${hy + 190} Q86,${hy + 150} 70,${hy + 6} Q0,${hy - 70} -70,${hy + 6}Z`} fill={hairCol} stroke={INK} strokeWidth={3} />}
      {/* руки (за торсом) */}
      <polyline points={`${sL.x},${sL.y} ${armLd.e.x},${armLd.e.y} ${hL.x},${hL.y}`} fill="none" stroke={sleeve} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
      {/* торс */}
      <g transform={`translate(0,${bob * 0.4})`}>
        <rect x={-56} y={-304} width={112} height={152} rx={22} fill={torsoCol} stroke={INK} strokeWidth={3.2} />
        {look === "suit" && (
          <g>
            <path d="M-20,-304 L0,-250 L20,-304 Z" fill="#f4f0e8" stroke={INK} strokeWidth={2} />
            <path d="M-8,-296 L8,-296 L12,-252 L0,-236 L-12,-252 Z" fill={tie} stroke={INK} strokeWidth={1.5} />
            <path d="M-56,-304 L-20,-304 L0,-250 L-20,-190 L-56,-190Z M56,-304 L20,-304 L0,-250 L20,-190 L56,-190Z" fill="none" stroke={INK} strokeWidth={2} opacity={0.6} />
          </g>
        )}
        {look === "plaid" && <path d="M-14,-304 L0,-262 L14,-304" fill="#f4f0e8" stroke={INK} strokeWidth={2} />}
        {chain && <path d="M-22,-298 Q0,-262 22,-298" stroke="#e6b422" strokeWidth={5} fill="none" />}
      </g>
      {/* шея и голова */}
      <rect x={-12} y={-318} width={24} height={22} fill={skin} stroke={INK} strokeWidth={2.5} />
      <g transform={`translate(0,${hy})`}>
        {hair === "curly" && <circle r={72} cy={-6} fill={hairCol} stroke={INK} strokeWidth={3} />}
        <circle r={64} fill={skin} stroke={INK} strokeWidth={3.4} />
        {hair === "short" && <path d="M-63,-14 A64 64 0 0 1 63,-14 Q30,-44 0,-36 Q-30,-44 -63,-14Z" fill={hairCol} stroke={INK} strokeWidth={2.5} />}
        {hair === "slick" && (
          <g>
            <path d="M-63,-10 A64 64 0 0 1 63,-10 Q40,-48 6,-40 Q-30,-44 -63,-10Z" fill={hairCol} stroke={INK} strokeWidth={2.5} />
            <path d="M-34,-44 Q0,-58 36,-42" stroke="#fff" strokeWidth={3} opacity={0.3} fill="none" />
          </g>
        )}
        {hair === "gray" && <path d="M-63,-6 A64 64 0 0 1 63,-6 Q50,-30 30,-26 L-30,-26 Q-50,-30 -63,-6Z" fill="#b6b6bf" stroke={INK} strokeWidth={2.5} />}
        {hair === "long" && <path d="M-64,0 A64 64 0 0 1 64,0 Q40,-38 0,-32 Q-40,-38 -64,0Z" fill={hairCol} stroke={INK} strokeWidth={2.5} />}
        {hair === "cap" && (
          <g>
            <path d="M-66,-8 A66 66 0 0 1 66,-8 Z" fill={cap} stroke={INK} strokeWidth={3} />
            <path d="M-8,-12 L88,-10 Q96,0 84,4 L-8,0Z" fill={shade(cap, 0.8)} stroke={INK} strokeWidth={2.5} />
          </g>
        )}
        {/* лицо */}
        {mood === "tired" && <g stroke="#9a8f8a" strokeWidth={2.5} fill="none"><path d="M-34,12 Q-24,20 -14,12" /><path d="M14,12 Q24,20 34,12" /></g>}
        {blink ? (
          <g stroke={INK} strokeWidth={3.5} strokeLinecap="round"><path d={`M${-eyeX - 8},${eyeY} h16 M${eyeX - 8},${eyeY} h16`} /></g>
        ) : mood === "scared" || mood === "shock" ? (
          <g>
            <circle cx={-eyeX} cy={eyeY} r={11} fill="#fff" stroke={INK} strokeWidth={2.5} /><circle cx={eyeX} cy={eyeY} r={11} fill="#fff" stroke={INK} strokeWidth={2.5} />
            <circle cx={-eyeX + lookDX} cy={eyeY + lookDY} r={4} fill={INK} /><circle cx={eyeX + lookDX} cy={eyeY + lookDY} r={4} fill={INK} />
          </g>
        ) : (
          <g fill={INK}>
            <circle cx={-eyeX + lookDX} cy={eyeY + lookDY} r={5.5} /><circle cx={eyeX + lookDX} cy={eyeY + lookDY} r={5.5} />
          </g>
        )}
        {glasses && (
          <g fill="none" stroke={INK} strokeWidth={3}>
            <circle cx={-eyeX} cy={eyeY} r={16} /><circle cx={eyeX} cy={eyeY} r={16} /><path d={`M${-eyeX + 16},${eyeY} h${eyeX * 2 - 32}`} />
          </g>
        )}
        {/* брови */}
        <g stroke={INK} strokeWidth={3.6} strokeLinecap="round" fill="none">
          {(mood === "worry" || mood === "sad") && <path d={`M${-eyeX - 12},${eyeY - 19} L${-eyeX + 10},${eyeY - 27} M${eyeX - 10},${eyeY - 27} L${eyeX + 12},${eyeY - 19}`} />}
          {mood === "angry" && <path d={`M${-eyeX - 12},${eyeY - 28} L${-eyeX + 12},${eyeY - 18} M${eyeX - 12},${eyeY - 18} L${eyeX + 12},${eyeY - 28}`} />}
          {(mood === "scared" || mood === "shock") && <path d={`M${-eyeX - 10},${eyeY - 28} Q${-eyeX},${eyeY - 34} ${-eyeX + 10},${eyeY - 28} M${eyeX - 10},${eyeY - 28} Q${eyeX},${eyeY - 34} ${eyeX + 10},${eyeY - 28}`} />}
          {(mood === "neutral" || mood === "tired" || mood === "smile" || mood === "smirk") && <path d={`M${-eyeX - 10},${eyeY - 20} L${-eyeX + 10},${eyeY - 20} M${eyeX - 10},${eyeY - 20 - (mood === "smirk" ? 5 : 0)} L${eyeX + 10},${eyeY - 20 - (mood === "smirk" ? 5 : 0)}`} />}
        </g>
        {/* рот */}
        {mouthOpen > 0 ? (
          <ellipse cx={0} cy={30} rx={11 + mouthOpen * 6} ry={3 + mouthOpen * 12} fill="#5a2224" stroke={INK} strokeWidth={2.5} />
        ) : mood === "smile" ? (
          <path d="M-18,24 Q0,42 18,24" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : mood === "smirk" ? (
          <path d="M-14,30 Q4,32 18,20" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : mood === "worry" || mood === "sad" || mood === "scared" ? (
          mood === "scared" ? <ellipse cx={0} cy={32} rx={10} ry={13} fill="#5a2224" stroke={INK} strokeWidth={2.5} /> : <path d="M-14,36 Q0,24 14,36" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : mood === "shock" ? (
          <ellipse cx={0} cy={34} rx={13} ry={17} fill="#5a2224" stroke={INK} strokeWidth={2.5} />
        ) : mood === "angry" ? (
          <path d="M-14,32 L14,32" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        ) : (
          <path d="M-11,30 L11,30" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        )}
        {stubble && <g fill={INK} opacity={0.45}>{Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={-28 + (i % 6) * 11 + rnd(i) * 4} cy={38 + Math.floor(i / 6) * 8 + rnd(i + 9) * 3} r={1.6} />)}</g>}
        {tears > 0 && <g fill="#8ec9ff" opacity={0.9}><ellipse cx={-eyeX - 4} cy={eyeY + 20 + tears * 30} rx={4} ry={7} /><ellipse cx={eyeX + 4} cy={eyeY + 24 + tears * 22} rx={4} ry={7} /></g>}
        {blood > 0 && (
          <g fill={RED} opacity={0.95}>
            <path d={`M-30,-34 Q-10,-46 12,-36 L10,-28 Q-8,-36 -28,-26Z`} />
            <path d={`M-4,-30 q-2,${22 * blood} 3,${44 * blood} q6,-${20 * blood} 2,-${44 * blood}Z`} />
            <path d={`M30,8 q-4,${16 * blood} 4,${30 * blood} q5,-${14 * blood} -1,-${30 * blood}Z`} opacity={0.85} />
          </g>
        )}
      </g>
      {/* передняя рука */}
      <polyline points={`${sR.x},${sR.y} ${armRd.e.x},${armRd.e.y} ${hR.x},${hR.y}`} fill="none" stroke={sleeve} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
      <g fill={skin} stroke={INK} strokeWidth={2.5}>
        <circle cx={hL.x} cy={hL.y} r={hr} />
        <circle cx={hR.x} cy={hR.y} r={hr} />
      </g>
      {ring && <circle cx={hR.x + 2} cy={hR.y + 4} r={6} fill="#e8b81e" stroke={INK} strokeWidth={2} />}
      {handL && <g transform={`translate(${hL.x},${hL.y})`}>{handL}</g>}
      {handR && <g transform={`translate(${hR.x},${hR.y})`}>{handR}</g>}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Реплики                                                              */
/* ------------------------------------------------------------------ */
const wrap = (text: string, max: number) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  words.forEach((w) => {
    if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  });
  if (cur) lines.push(cur);
  return lines;
};

export const Bubble: React.FC<{ x: number; y: number; text: string; k?: number; p?: number; tx?: number; ty?: number; max?: number; size?: number; dark?: boolean; col?: string }> = ({
  x, y, text, k = 1, p = 1, tx, ty, max = 26, size = 38, dark = false, col,
}) => {
  const full = wrap(text, max);
  const shown = Math.floor(text.length * cl(p));
  const reveal = text.slice(0, shown);
  const rl = wrap(reveal, max);
  const w = Math.max(...full.map((l) => l.length)) * size * 0.52 + 56;
  const h = full.length * size * 1.25 + 34;
  const bx = x - w / 2;
  const by = y - h / 2;
  const tipX = tx ?? x;
  const tipY = ty ?? y + h / 2 + 50;
  const baseX = cl(tipX, bx + 40, bx + w - 40);
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} opacity={cl(k * 2)}>
      <path d={`M${baseX - 16},${by + h - 2} L${tipX},${tipY} L${baseX + 18},${by + h - 2}Z`} fill={dark ? "#1b1c24" : "#fff"} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <rect x={bx} y={by} width={w} height={h} rx={26} fill={dark ? "#1b1c24" : "#fff"} stroke={INK} strokeWidth={3} />
      <rect x={baseX - 14} y={by + h - 6} width={30} height={8} fill={dark ? "#1b1c24" : "#fff"} />
      {rl.map((l, i) => (
        <text key={i} x={bx + 28} y={by + 17 + size + i * size * 1.25 - 6} fontFamily={FONT} fontWeight={600} fontSize={size} fill={col ?? (dark ? "#fff" : INK)}>{l}</text>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Предметы                                                             */
/* ------------------------------------------------------------------ */
export const PhoneProp: React.FC<{ glow?: boolean; s?: number; rot?: number }> = ({ glow = true, s = 1, rot = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    {glow && <circle cx={0} cy={-18} r={70} fill="url(#f-white)" opacity={0.45} />}
    <rect x={-16} y={-46} width={32} height={56} rx={6} fill="#14151b" stroke={INK} strokeWidth={2.5} />
    <rect x={-12} y={-42} width={24} height={44} rx={3} fill={glow ? "#9bd2ff" : "#2a2c38"} />
  </g>
);

export const Cig: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-4} y={-4} width={46} height={8} rx={3} fill="#f4efe4" stroke={INK} strokeWidth={2} />
    <rect x={32} y={-4} width={10} height={8} fill="#c9873a" />
    <circle cx={-6} cy={0} r={8} fill="url(#f-ember)" opacity={0.7 + 0.3 * Math.sin(t * 6)} />
    {Array.from({ length: 6 }).map((_, i) => {
      const p = (t * 0.55 + i / 6) % 1;
      return <circle key={i} cx={-6 - p * 20 + Math.sin(t * 2 + i) * 8} cy={-10 - p * 90} r={5 + p * 16} fill="#cfd4e0" opacity={0.4 * (1 - p)} />;
    })}
  </g>
);

export const Tomato: React.FC<{ x: number; y: number; r?: number; rot?: number; col?: string }> = ({ x, y, r = 26, rot = 0, col = "#d63a2a" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill={col} stroke={INK} strokeWidth={2.5} />
    <path d={`M-${r * 0.35},-${r * 0.85} L0,-${r * 0.55} L${r * 0.35},-${r * 0.85} L${r * 0.1},-${r * 1.1}Z`} fill="#3f9a4a" stroke={INK} strokeWidth={1.5} />
    <ellipse cx={-r * 0.35} cy={-r * 0.3} rx={r * 0.2} ry={r * 0.12} fill="#fff" opacity={0.45} />
  </g>
);

export const Strawberry: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 22 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M0,${r} C-${r * 1.3},${r * 0.2} -${r * 0.9},-${r * 0.9} 0,-${r * 0.7} C${r * 0.9},-${r * 0.9} ${r * 1.3},${r * 0.2} 0,${r}Z`} fill="#e23a4a" stroke={INK} strokeWidth={2.5} />
    <path d={`M-${r * 0.5},-${r * 0.7} L0,-${r} L${r * 0.5},-${r * 0.7} L0,-${r * 0.4}Z`} fill="#3f9a4a" stroke={INK} strokeWidth={1.5} />
    {[[-6, -2], [6, 0], [0, 8], [-8, 10], [8, 10]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={1.5} fill="#fbe39a" />)}
  </g>
);

export const Crate: React.FC<{ x: number; y: number; w?: number; h?: number; fill?: string; content?: "tomato" | "apple" | "straw" | "none"; rot?: number; fullness?: number }> = ({ x, y, w = 150, h = 90, fill = "#c98d4a", content = "none", rot = 0, fullness = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {content !== "none" && fullness > 0 && (
      <g>
        {Array.from({ length: Math.round(5 * fullness) }).map((_, i) => {
          const cx = -w * 0.38 + i * (w * 0.19);
          if (content === "tomato") return <Tomato key={i} x={cx} y={-h * 0.62 - (i % 2) * 6} r={22} />;
          if (content === "apple") return <Tomato key={i} x={cx} y={-h * 0.62 - (i % 2) * 6} r={22} col="#7fbf3a" />;
          return <Strawberry key={i} x={cx} y={-h * 0.62 - (i % 2) * 6} />;
        })}
      </g>
    )}
    <rect x={-w / 2} y={-h} width={w} height={h} rx={6} fill={fill} stroke={INK} strokeWidth={3} />
    {[0.33, 0.66].map((f) => <path key={f} d={`M${-w / 2},${-h * f} H${w / 2}`} stroke={shade(fill, 0.7)} strokeWidth={4} />)}
    <rect x={-w / 2 + 8} y={-h * 0.5 - 8} width={32} height={16} rx={3} fill={shade(fill, 0.7)} opacity={0.7} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Фура (вид сбоку, смотрит влево)                                       */
/* ------------------------------------------------------------------ */
export const Truck: React.FC<{ x: number; y: number; s?: number; rot?: number; lights?: boolean; t?: number; wheelSpin?: number; cabWindow?: React.ReactNode; opacity?: number }> = ({
  x, y, s = 1, rot = 0, lights = true, t = 0, wheelSpin = 0, cabWindow, opacity = 1,
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    <ellipse cx={80} cy={4} rx={400} ry={16} fill="#000" opacity={0.3} />
    {/* кузов-рефрижератор */}
    <rect x={-60} y={-348} width={520} height={250} rx={8} fill="#f1f3f6" stroke={INK} strokeWidth={4} />
    <rect x={-60} y={-348} width={520} height={30} rx={8} fill="#dfe3ea" stroke={INK} strokeWidth={4} />
    <rect x={-60} y={-140} width={520} height={42} fill="#3f9a5a" stroke={INK} strokeWidth={4} />
    {[40, 140, 240, 340].map((px) => <path key={px} d={`M${px},-318 V-140`} stroke="#c3c9d4" strokeWidth={3} />)}
    {/* логотип */}
    <g transform="translate(140 -230)">
      <path d="M-120,10 C-120,-30 -80,-50 -40,-44 C-44,-4 -84,20 -120,10Z" fill="#3f9a5a" stroke={INK} strokeWidth={3} />
      <path d="M-116,8 C-90,-8 -66,-26 -44,-42" stroke="#fff" strokeWidth={3} fill="none" />
      <text x={-24} y={14} fontFamily={FONT} fontWeight={900} fontSize={50} fill="#1f6a3a" stroke={INK} strokeWidth={1.2}>FreshLogistic</text>
    </g>
    {/* кабина */}
    <path d="M-62,-98 L-62,-250 Q-62,-292 -100,-292 L-250,-292 Q-296,-290 -318,-240 L-340,-168 Q-346,-98 -330,-98 Z" fill="#2c64b0" stroke={INK} strokeWidth={4} />
    <path d="M-110,-276 L-250,-276 Q-284,-272 -300,-236 L-312,-200 L-110,-200 Z" fill="#a8d4f0" stroke={INK} strokeWidth={3} />
    <clipPath id="f-cab-win"><path d="M-110,-276 L-250,-276 Q-284,-272 -300,-236 L-312,-200 L-110,-200 Z" /></clipPath>
    <g clipPath="url(#f-cab-win)">{cabWindow}</g>
    <path d="M-110,-276 L-250,-276 Q-284,-272 -300,-236 L-312,-200 L-110,-200 Z" fill="none" stroke={INK} strokeWidth={3} />
    <rect x={-346} y={-128} width={24} height={30} rx={4} fill="#1c1d24" />
    <circle cx={-328} cy={-170} r={16} fill={lights ? "#fff6c8" : "#7a7a80"} stroke={INK} strokeWidth={3} />
    {lights && (
      <g>
        <circle cx={-328} cy={-170} r={90} fill="url(#f-white)" opacity={0.8} />
        <path d="M-340,-176 L-900,-300 L-900,-30 Z" fill="url(#f-sunray)" opacity={0.5} />
      </g>
    )}
    <rect x={-20} y={-98} width={90} height={30} rx={6} fill="#1c1d24" />
    {/* колёса */}
    {[-230, 150, 310].map((cx, i) => (
      <g key={i} transform={`translate(${cx},-48)`}>
        <circle r={56} fill="#1c1d24" stroke={INK} strokeWidth={4} />
        <circle r={30} fill="#9aa0ae" stroke={INK} strokeWidth={3} />
        <g transform={`rotate(${wheelSpin * 360 + i * 20})`}><path d="M0,-26 V26 M-26,0 H26" stroke={INK} strokeWidth={4} /></g>
      </g>
    ))}
    <g opacity={0.9}><ellipse cx={-100} cy={-120} rx={20} ry={8} fill="#1c1d24" opacity={0.2} /></g>
    <rect x={-352} y={-176} width={0} height={0} />
    <text x={470} y={-60} fontFamily={FONT} fontSize={0}>.</text>
  </g>
);

/* ------------------------------------------------------------------ */
/* Погода и свет                                                        */
/* ------------------------------------------------------------------ */
export const Rain: React.FC<{ t: number; n?: number; o?: number; speed?: number; slant?: number; col?: string }> = ({ t, n = 150, o = 0.4, speed = 1500, slant = 26, col = "#cfe0ff" }) => (
  <g stroke={col} strokeWidth={2.4} strokeLinecap="round" opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const x = (((rnd(i) * (W + 300) + t * 220 * (0.6 + rnd(i + 3))) % (W + 300)) - 150);
      const y = ((rnd(i + 7) * (H + 300) + t * speed * (0.7 + rnd(i + 5) * 0.6)) % (H + 300)) - 150;
      const L = 60 + rnd(i + 11) * 60;
      return <line key={i} x1={x} y1={y} x2={x - slant * (L / 90)} y2={y + L} opacity={0.4 + rnd(i + 13) * 0.6} />;
    })}
  </g>
);

export const Vignette: React.FC<{ o?: number }> = ({ o = 1 }) => <rect width={W} height={H} fill="url(#f-vig)" opacity={o} />;

/** лёгкая «плёнка»: мелкие точки и вздрагивание яркости */
export const Grain: React.FC<{ t: number; o?: number }> = ({ t, o = 0.06 }) => {
  const f = Math.floor(t * 12);
  return (
    <g opacity={o}>
      {Array.from({ length: 90 }).map((_, i) => <circle key={i} cx={rnd(i + f * 3) * W} cy={rnd(i + 40 + f * 5) * H} r={1 + rnd(i + f) * 2} fill={i % 2 ? "#fff" : "#000"} />)}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Карточки в стиле примера                                             */
/* ------------------------------------------------------------------ */
export const PaperBG: React.FC<{ col?: string }> = ({ col = PAPER }) => (
  <g>
    <rect width={W} height={H} fill={col} />
    <rect width={W} height={H} fill="url(#f-vig)" opacity={0.18} />
  </g>
);

export const Bar: React.FC<{ x: number; y: number; w: number; v: number; col?: string; label?: string; value?: string; h?: number }> = ({ x, y, w, v, col = GREEN, label, value, h = 22 }) => (
  <g>
    {label && <text x={x} y={y - 22} fontFamily={FONT} fontWeight={600} fontSize={26} fill="#7a7466" letterSpacing={2}>{label}</text>}
    {value && <text x={x} y={y - 54} fontFamily={FONT} fontWeight={800} fontSize={40} fill={INK}>{value}</text>}
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#d9d2be" />
    <rect x={x} y={y} width={Math.max(0, w * cl(v))} height={h} rx={h / 2} fill={col} />
  </g>
);

export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const PriceTag: React.FC<{ x: number; y: number; text: string; k?: number; col?: string; rot?: number; size?: number }> = ({ x, y, text, k = 1, col = RED, rot = -4, size = 40 }) => {
  const w = text.length * size * 0.62 + 40;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={cl(k * 2)}>
      <path d={`M${-w / 2 - 18},0 L${-w / 2},${-size * 0.8} H${w / 2} V${size * 0.8} H${-w / 2}Z`} fill={col} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={-w / 2 + 4} cy={0} r={5} fill="#fff" stroke={INK} strokeWidth={2} />
      <text x={6} y={size * 0.34} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill="#fff">{text}</text>
    </g>
  );
};

export const Stamp: React.FC<{ x: number; y: number; text: string; k?: number; col?: string; rot?: number; size?: number }> = ({ x, y, text, k = 1, col = RED, rot = -10, size = 60 }) => {
  const w = text.length * size * 0.62 + 50;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={cl(k * 2) * 0.92}>
      <rect x={-w / 2} y={-size * 0.8} width={w} height={size * 1.6} rx={10} fill="none" stroke={col} strokeWidth={7} />
      <text x={0} y={size * 0.34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={col} letterSpacing={3}>{text}</text>
    </g>
  );
};

/** карточка персонажа, как «постоянные гости» в примере */
export const CharCard: React.FC<{ x: number; y: number; name: string; sub: string; k?: number; accent?: string; children?: React.ReactNode }> = ({ x, y, name, sub, k = 1, accent = YEL, children }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={cl(k * 2)}>
    <rect x={-190} y={-250} width={380} height={470} rx={22} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
    <rect x={-190} y={-250} width={380} height={30} rx={22} fill={accent} stroke={INK} strokeWidth={4} />
    <rect x={-190} y={-232} width={380} height={12} fill={accent} />
    <g transform="translate(0 70) scale(0.62)">{children}</g>
    <text x={0} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={INK}>{name}</text>
    <text x={0} y={206} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={26} fill="#7a7466" letterSpacing={2}>{sub}</text>
  </g>
);

export const Flash: React.FC<{ o: number; col?: string }> = ({ o, col = "#fff" }) => <rect width={W} height={H} fill={col} opacity={o} />;
