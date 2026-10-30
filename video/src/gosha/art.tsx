import React from "react";
import { Person, LOOKS, type Look, type Pose, type Hat, cl, lerp, ramp, eio } from "../bunker/art";
export { Person, cl, lerp, ramp, eio };
export type { Look, Pose, Hat };

export const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";
export const GY = 1290; // линия земли

export const K = {
  ink: "#16161d", white: "#ffffff", yellow: "#ffd23f", red: "#ff4b3e", green: "#46d36b", blue: "#4aa8ff", orange: "#ff8a1f",
  glass: "#58c27d", glassD: "#2f8a52", plastic: "#cfe8f2", can: "#c9ccd2",
};

export const LK: Record<string, Look> = {
  gosha: { skin: "#e0b08a", hair: "#3a2a20", top: "#7a6a4a", top2: "#5e5038", pants: "#4a4d58", shoes: "#2a2522", hairStyle: "short", beard: true },
  passer: { skin: "#f0c8a2", hair: "#2a2a2a", top: "#3b4a8a", top2: "#2e3a6c", pants: "#24262e", shoes: "#111", hairStyle: "short" },
  tolik: { skin: "#d9a679", hair: "#1d1a18", top: "#b8392e", top2: "#932d24", pants: "#2e3a4a", shoes: "#2a2522", hairStyle: "short" },
  petro: { skin: "#d9ac86", hair: "#c8c8c8", top: "#5a6b4a", top2: "#48573a", pants: "#4a4034", shoes: "#2a2522", hairStyle: "short", beard: true },
  recv: { skin: "#d4a07a", hair: "#2a1d14", top: "#3f6f8a", top2: "#305870", pants: "#34384a", shoes: "#222", hairStyle: "short" },
  woman: { skin: "#f2caa4", hair: "#7a4a2a", top: "#d46a8a", top2: "#b0506e", pants: "#5a4a6a", shoes: "#3a2a28", hairStyle: "bun" },
  sell: { skin: "#f2caa4", hair: "#d8a43a", top: "#f2f0e6", top2: "#d8d4c4", pants: "#4a3a3a", shoes: "#3a2a28", hairStyle: "ponytail" },
  cop: { skin: "#d9a679", hair: "#1d1a18", top: "#2e4a8a", top2: "#223a70", pants: "#222a44", shoes: "#111", hairStyle: "short" },
};
export const HATS: Record<string, Hat> = {
  gosha: { kind: "beanie", c: "#a0382e" }, tolik: { kind: "cap", c: "#222" }, petro: { kind: "ushanka", c: "#6a5a48" }, cop: { kind: "cap", c: "#1c2c5c" },
};
export const NAMES: Record<string, string> = { gosha: "ГОША", passer: "ПРОХОЖИЙ", tolik: "ТОЛИК", petro: "ПЕТРОВИЧ", recv: "ПРИЁМЩИК", woman: "ЖЕНЩИНА", sell: "ПРОДАВЩИЦА", narr: "" };

export type ActorP = { who: keyof typeof LK; x: number; y?: number; s?: number; flip?: boolean; pose?: Pose; talking?: boolean; t: number; label?: boolean; held?: React.ReactNode; heldL?: React.ReactNode };
export const Actor: React.FC<ActorP> = ({ who, x, y = GY, s = 2.4, flip, pose = {}, talking, t, label, held, heldL }) => {
  const look = LK[who];
  const p: Pose = { t, expr: talking ? "talk" : "neutral", blink: t % 3.1 > 3.0, ...pose, heldR: held ?? pose.heldR, heldL: heldL ?? pose.heldL };
  return (
    <g>
      <Person x={x} y={y} s={s} flip={flip} look={look} pose={p} hat={HATS[who]} pack={who === "gosha" ? "#8a5a30" : undefined} mustache={who === "recv"} apron={who === "sell" ? "#e8e4d8" : undefined} />
      {label && NAMES[who] && (
        <g transform={`translate(${x},${y - 150 * s})`}>
          <rect x={-NAMES[who].length * 15 - 18} y={-34} width={NAMES[who].length * 30 + 36} height={52} rx={26} fill={K.ink} />
          <text x={0} y={5} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={K.yellow} letterSpacing={2}>{NAMES[who]}</text>
        </g>
      )}
    </g>
  );
};

/* ───── предметы ───── */
export const Bottle: React.FC<{ x: number; y: number; s?: number; r?: number; kind?: "glass" | "plastic" | "can" }> = ({ x, y, s = 1, r = 0, kind = "glass" }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    {kind === "can" ? (
      <g><rect x={-14} y={-48} width={28} height={48} rx={5} fill={K.can} stroke="#00000055" strokeWidth={2.5} /><rect x={-14} y={-34} width={28} height={14} fill="#d8453a" /><ellipse cx={0} cy={-48} rx={14} ry={4} fill="#e8eaee" /></g>
    ) : (
      <g>
        <path d="M -14 0 L -14 -52 Q -14 -66 -6 -74 L -6 -96 L 6 -96 L 6 -74 Q 14 -66 14 -52 L 14 0 Z" fill={kind === "glass" ? K.glass : K.plastic} stroke="#00000066" strokeWidth={2.5} opacity={kind === "plastic" ? 0.85 : 1} />
        <rect x={-6} y={-102} width={12} height={8} rx={2} fill={kind === "glass" ? "#d4a43a" : "#3a8ad8"} />
        <rect x={-9} y={-50} width={6} height={44} rx={3} fill="#ffffff55" />
      </g>
    )}
  </g>
);
export const Pile: React.FC<{ x: number; y: number; n: number; s?: number; seed?: number }> = ({ x, y, n, s = 1, seed = 1 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const a = Math.sin((i + seed) * 12.9898) * 43758.5453; const f = a - Math.floor(a);
    return <Bottle key={i} x={x + (i - n / 2) * 24 * s} y={y + (i % 2) * 8} s={s} r={(f - 0.5) * 70} kind={i % 4 === 3 ? "can" : i % 3 === 1 ? "plastic" : "glass"} />;
  })}</g>
);
export const Urn: React.FC<{ x: number; y?: number; s?: number; lid?: number }> = ({ x, y = GY, s = 1, lid = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={80} ry={12} fill="#00000040" />
    <path d="M -64 -250 L 64 -250 L 54 0 L -54 0 Z" fill="#4a5560" stroke="#242c33" strokeWidth={5} />
    {[-30, 0, 30].map((q) => <line key={q} x1={q} y1={-232} x2={q * 0.9} y2={-14} stroke="#33404a" strokeWidth={6} />)}
    <g transform={`rotate(${-lid * 40} -64 -250)`}><rect x={-72} y={-272} width={144} height={26} rx={8} fill="#6a7886" stroke="#242c33" strokeWidth={5} /></g>
    <rect x={-64} y={-190} width={128} height={12} fill="#e8a83a" opacity={0.9} />
  </g>
);
export const Bench: React.FC<{ x: number; y?: number; w?: number }> = ({ x, y = GY, w = 360 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-130} width={w} height={20} rx={6} fill="#a8743a" stroke="#4a3018" strokeWidth={4} />
    <rect x={-w / 2} y={-92} width={w} height={20} rx={6} fill="#a8743a" stroke="#4a3018" strokeWidth={4} />
    <rect x={-w / 2} y={-190} width={w} height={22} rx={6} fill="#b8844a" stroke="#4a3018" strokeWidth={4} /><rect x={-w / 2} y={-158} width={w} height={22} rx={6} fill="#b8844a" stroke="#4a3018" strokeWidth={4} />
    {[-w / 2 + 24, w / 2 - 24].map((q) => <rect key={q} x={q - 8} y={-200} width={16} height={200} fill="#2e2e36" />)}
  </g>
);
export const Tree: React.FC<{ x: number; y?: number; s?: number; c?: string }> = ({ x, y = GY, s = 1, c = "#3f8a4a" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-16} y={-300} width={32} height={300} fill="#5a3e28" />
    <circle cx={0} cy={-380} r={150} fill={c} /><circle cx={-100} cy={-320} r={100} fill={c} /><circle cx={100} cy={-330} r={110} fill={c} />
    <circle cx={-30} cy={-420} r={80} fill="#ffffff18" />
  </g>
);
export const Coin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><circle r={26} fill="#e8b830" stroke="#8a6a10" strokeWidth={4} /><circle r={17} fill="none" stroke="#fff3a0" strokeWidth={3} /><text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#8a6a10">₽</text></g>
);
export const Pie: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M -50 0 Q -62 -40 -20 -50 Q 20 -62 52 -34 Q 66 -8 46 0 Z" fill="#d89a4a" stroke="#7a4a18" strokeWidth={4} /><path d="M -30 -34 Q 0 -44 28 -30" fill="none" stroke="#f0c070" strokeWidth={5} strokeLinecap="round" /></g>
);
export const Steam: React.FC<{ x: number; y: number; t: number; n?: number; s?: number }> = ({ x, y, t, n = 5, s = 1 }) => (
  <g>{Array.from({ length: n }).map((_, i) => {
    const ph = ((t * 0.35 + i / n) % 1);
    return <circle key={i} cx={x + Math.sin(ph * 6 + i) * 30 * s} cy={y - ph * 260 * s} r={(30 + ph * 60) * s} fill="#fff" opacity={0.5 * (1 - ph)} />;
  })}</g>
);

/* ───── фоны ───── */
export const Sky: React.FC<{ c1: string; c2: string; id: string }> = ({ c1, c2, id }) => (
  <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
    <rect x={-900} y={-300} width={2900} height={GY + 300} fill={`url(#${id})`} /></g>
);
export const Ground: React.FC<{ c: string; c2: string; curb?: string; detail?: string }> = ({ c, c2, curb = "#8a8a94", detail = "#00000028" }) => (
  <g>
    <rect x={-900} y={GY} width={2900} height={1200} fill={c} />
    <rect x={-900} y={GY} width={2900} height={46} fill={curb} /><rect x={-900} y={GY + 46} width={2900} height={8} fill="#00000040" />
    <rect x={-900} y={GY + 54} width={2900} height={380} fill={c2} opacity={0.55} />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-860 + i * 190} y={GY + 520} width={110} height={14} rx={4} fill="#ffffff30" />)}
    {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M ${-800 + i * 130} ${GY + 120 + (i % 5) * 110} l 40 18 l -10 30 l 30 24`} stroke={detail} strokeWidth={5} fill="none" strokeLinecap="round" />)}
    <ellipse cx={180} cy={GY + 330} rx={140} ry={20} fill="#00000025" /><ellipse cx={900} cy={GY + 620} rx={100} ry={16} fill="#ffffff18" />
  </g>
);
export const Block: React.FC<{ x: number; w: number; h: number; c: string; win?: string; cols?: number; rows?: number; lit?: number; y?: number }> = ({ x, w, h, c, win = "#f6cf78", cols = 4, rows = 8, lit = 0.4, y = GY }) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill={c} />
    <rect x={x} y={y - h} width={w} height={14} fill="#00000030" />
    {Array.from({ length: cols * rows }).map((_, i) => {
      const cx = i % cols, ry = Math.floor(i / cols); const r = Math.sin(i * 91.7 + x) * 0.5 + 0.5;
      return <rect key={i} x={x + 18 + cx * ((w - 36) / cols)} y={y - h + 40 + ry * ((h - 90) / rows)} width={(w - 36) / cols - 14} height={(h - 90) / rows - 18} rx={3} fill={r < lit ? win : "#00000040"} />;
    })}
  </g>
);

/* ───── HUD / подписи ───── */
const KEYS: [RegExp, string][] = [
  [/^(рубл|рубле|рублей|₽)/i, K.yellow], [/^(пять|восемь|двадцать|восемнадцать|сорок|шесть|семьдесят|десять|пол|одн|две|двенадцать|четыре|\d)/i, K.yellow],
  [/^(стекл|пластик|алюмин|бутыл|банк)/i, K.green], [/^(правил|урн|минус|плюс|нет|конец|завтра|пирожок|ночлег)/i, K.red],
];
export const colorFor = (w: string) => { const n = w.replace(/[^\p{L}\d₽*]/gu, ""); for (const [r, c] of KEYS) if (r.test(n)) return c; return K.white; };

/** разбить на фразы по 2-4 слова */
export const chunkText = (text: string): string[] => {
  const words = text.split(/\s+/).filter(Boolean); const out: string[] = []; let cur: string[] = [];
  for (const w of words) {
    cur.push(w);
    const end = /[.!?…:—]$/.test(w) || /[,;]$/.test(w);
    const sent = /[.!?…]$/.test(w);
    if (sent && cur.length === 1 && out.length && !/[.!?…]$/.test(out[out.length - 1])) { out[out.length - 1] += " " + w; cur = []; continue; }
    if (cur.length >= 4 || (end && cur.length >= 2) || sent) { out.push(cur.join(" ")); cur = []; }
  }
  if (cur.length) { if (cur.length === 1 && out.length) out[out.length - 1] += " " + cur[0]; else out.push(cur.join(" ")); }
  return out;
};

export const Sub: React.FC<{ text: string; p: number; custom?: boolean }> = ({ text, p, custom }) => {
  const k = eio(ramp(p, 0, 0.12));
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  const words: { w: string; c: string }[] = [];
  parts.forEach((pt) => { if (pt.startsWith("*")) pt.slice(1, -1).split(" ").forEach((w) => words.push({ w, c: K.red })); else pt.split(" ").filter(Boolean).forEach((w) => words.push({ w, c: custom ? K.white : colorFor(w) })); });
  // перенос на 2 строки при длине
  const total = words.reduce((a, b) => a + b.w.length + 1, 0);
  const lines: typeof words[] = total > 17 && words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)), words.slice(Math.ceil(words.length / 2))] : [words];
  const size = Math.min(128, 1000 / (Math.max(...lines.map((l) => l.reduce((a, b) => a + b.w.length + 1, 0))) * 0.62));
  return (
    <g transform={`translate(540,${1500 - (lines.length - 1) * size * 0.55}) scale(${0.9 + 0.1 * k})`} opacity={k}>
      {lines.map((ln, li) => (
        <text key={li} x={0} y={li * size * 1.12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} style={{ paintOrder: "stroke" }} stroke={K.ink} strokeWidth={size * 0.2} strokeLinejoin="round" letterSpacing={1}>
          {ln.map((w, i) => <tspan key={i} fill={w.c}>{w.w}{i < ln.length - 1 ? " " : ""}</tspan>)}
        </text>
      ))}
    </g>
  );
};

export const Hud: React.FC<{ money: number; bottles: number; pop: number; scene: string }> = ({ money, bottles, pop, scene }) => {
  const k = 1 + 0.18 * Math.sin(cl(pop) * Math.PI);
  return (
    <g>
      <g transform="translate(50,60)"><rect width={300} height={84} rx={42} fill={K.ink} opacity={0.92} />
        <Coin x={46} y={42} s={1.05} />
        <g transform={`translate(0,0) scale(${k})`} style={{ transformOrigin: "200px 42px" }}><text x={170} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={K.yellow}>{Math.round(money)} ₽</text></g></g>
      <g transform="translate(390,60)"><rect width={190} height={84} rx={42} fill={K.ink} opacity={0.92} /><Bottle x={44} y={72} s={0.62} /><text x={125} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={K.green}>{bottles}</text></g>
      <g transform="translate(1030,60)"><rect x={-(scene.length * 22 + 60)} width={scene.length * 22 + 60} height={84} rx={42} fill={K.red} /><text x={-(scene.length * 22 + 60) / 2} y={55} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff" letterSpacing={1}>{scene}</text></g>
    </g>
  );
};

export const Stamp: React.FC<{ text: string; p: number; y?: number; c?: string }> = ({ text, p, y = 380, c = K.red }) => {
  const k = eio(ramp(p, 0, 0.18)), s = 2.2 - 1.2 * k;
  return <g transform={`translate(540,${y}) rotate(-6) scale(${s})`} opacity={k}><rect x={-text.length * 22 - 30} y={-52} width={text.length * 44 + 60} height={96} rx={10} fill="none" stroke={c} strokeWidth={9} /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill={c} letterSpacing={3}>{text}</text></g>;
};

export const Pop: React.FC<{ text: string; p: number; x: number; y: number; c?: string; size?: number }> = ({ text, p, x, y, c = K.yellow, size = 90 }) => {
  const k = eio(ramp(p, 0, 0.2)), o = 1 - ramp(p, 0.7, 1);
  return <text x={x} y={y - p * 80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size * (0.7 + 0.3 * k)} fill={c} stroke={K.ink} strokeWidth={size * 0.18} strokeLinejoin="round" style={{ paintOrder: "stroke" }} opacity={o * k}>{text}</text>;
};
