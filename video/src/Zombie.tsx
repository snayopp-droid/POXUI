import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DURATION_SEC, FPS, LINES, lineAt, sceneAt, startOf, endOf } from "./timeline8";

const W = 1080;
const H = 1920;
const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const GREEN = "#5dff9a";
const RED = "#ff3b3b";
const AMBER = "#ffcf5a";

type SP = { t: number; k: number; d: number };

/* ---------- персонажи ---------- */
const Zombie: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; flip?: boolean; reach?: number; dark?: number }> = ({
  x, y, s = 1, t, seed = 0, flip = false, reach = 0, dark = 1,
}) => {
  const step = Math.sin(t * 5.5 + seed * 3.1);
  const sway = Math.sin(t * 2.3 + seed) * 4;
  const arm = -78 + Math.sin(t * 3 + seed) * 10 - reach * 20;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={1}>
      <g transform={`rotate(${sway * 0.5})`}>
        <g transform={`rotate(${step * 16} -12 -118)`}>
          <rect x="-22" y="-118" width="20" height="118" rx="8" fill="#16251f" stroke="#5a8a78" strokeWidth="3" />
        </g>
        <g transform={`rotate(${-step * 16} 12 -118)`}>
          <rect x="2" y="-118" width="20" height="118" rx="8" fill="#16251f" stroke="#5a8a78" strokeWidth="3" />
        </g>
        <path d="M-30,-118 L-24,-250 Q0,-266 30,-250 L26,-118 Z" fill="#1a2d26" stroke="#5a8a78" strokeWidth="3" />
        <g transform={`rotate(${arm} 14 -240)`}>
          <rect x="10" y="-250" width="92" height="18" rx="9" fill="#16251f" stroke="#5a8a78" strokeWidth="3" />
        </g>
        <g transform={`rotate(${arm + 10} 14 -226)`}>
          <rect x="10" y="-234" width="84" height="16" rx="8" fill="#16251f" stroke="#5a8a78" strokeWidth="3" />
        </g>
        <g transform={`rotate(${14 + Math.sin(t * 2 + seed) * 8} 0 -262)`}>
          <circle cx="8" cy="-292" r="27" fill="#1b2f28" stroke="#5a8a78" strokeWidth="3" />
          <circle cx="16" cy="-296" r="5" fill={RED} />
          <circle cx="2" cy="-296" r="5" fill={RED} opacity={0.6 + 0.4 * Math.sin(t * 9 + seed)} />
        </g>
      </g>
    </g>
  );
};

const Gena: React.FC<{ x: number; y: number; s?: number; t: number; pose?: "idle" | "run" | "back"; flip?: boolean }> = ({ x, y, s = 1, t, pose = "idle", flip = false }) => {
  const sp = pose === "run" ? 9 : pose === "back" ? 4 : 1.4;
  const step = Math.sin(t * sp) * (pose === "idle" ? 2 : 24);
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <g transform={`rotate(${step} -10 -118)`}><rect x="-20" y="-118" width="18" height="118" rx="8" fill="#7f95a6" stroke="#cfe0ec" strokeWidth="3" /></g>
      <g transform={`rotate(${-step} 10 -118)`}><rect x="2" y="-118" width="18" height="118" rx="8" fill="#7f95a6" stroke="#cfe0ec" strokeWidth="3" /></g>
      <path d="M-28,-118 L-22,-246 Q0,-262 28,-246 L24,-118 Z" fill="#8fa5b6" stroke="#cfe0ec" strokeWidth="3" />
      <g transform={`rotate(${pose === "run" ? -step * 2 : -30} 12 -236)`}><rect x="8" y="-244" width="70" height="16" rx="8" fill="#8fa5b6" stroke="#cfe0ec" strokeWidth="3" /></g>
      <rect x="62" y="-290" width="22" height="46" rx="4" fill="#1d2a24" stroke={GREEN} strokeWidth="3" />
      <circle cx="4" cy="-286" r="26" fill="#9db3c4" stroke="#cfe0ec" strokeWidth="3" />
      <circle cx="12" cy="-290" r="3.5" fill="#0a0f14" />
    </g>
  );
};

/* ---------- фон ---------- */
const Sky: React.FC<{ t: number; tint?: string }> = ({ t, tint = "#10222b" }) => (
  <g>
    <defs>
      <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#04080d" />
        <stop offset="0.6" stopColor={tint} />
        <stop offset="1" stopColor="#0a1512" />
      </linearGradient>
      <radialGradient id="moong"><stop offset="0" stopColor="#dff3e6" stopOpacity="0.5" /><stop offset="1" stopColor="#dff3e6" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#skyg)" />
    {Array.from({ length: 40 }).map((_, i) => (
      <circle key={i} cx={hash(i) * W} cy={hash(i + 50) * 800} r={1 + hash(i + 9) * 2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))} />
    ))}
    <circle cx="820" cy="360" r="190" fill="url(#moong)" />
    <circle cx="820" cy="360" r="78" fill="#e6f4ea" />
    <circle cx="796" cy="340" r="14" fill="#c4d8cb" /><circle cx="846" cy="388" r="10" fill="#c4d8cb" />
  </g>
);

const Skyline: React.FC<{ t: number; base: number; seed?: number; col?: string; lit?: number; shift?: number }> = ({ t, base, seed = 0, col = "#0a1318", lit = 0.18, shift = 0 }) => {
  const els: React.ReactNode[] = [];
  let x = -40 + shift;
  let i = 0;
  while (x < W + 60) {
    const w = 90 + hash(i + seed) * 110;
    const h = 280 + hash(i + seed + 20) * 420;
    els.push(<rect key={`b${i}`} x={x} y={base - h} width={w} height={h} fill={col} stroke="#16262d" strokeWidth="2" />);
    for (let r = 0; r < Math.floor(h / 56); r++)
      for (let c = 0; c < Math.floor(w / 34); c++) {
        const id = i * 100 + r * 10 + c;
        const on = hash(id + seed) < lit;
        const flick = on && hash(id) < 0.15 ? 0.4 + 0.6 * Math.abs(Math.sin(t * 8 + id)) : 1;
        els.push(<rect key={`w${i}-${r}-${c}`} x={x + 12 + c * 34} y={base - h + 18 + r * 56} width="16" height="24" fill={on ? AMBER : "#0f1d23"} opacity={on ? 0.8 * flick : 1} />);
      }
    x += w + 8;
    i++;
  }
  return <g>{els}</g>;
};

const Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x="0" y="1480" width={W} height={H - 1480} fill="#0b1210" />
    <rect x="0" y="1480" width={W} height="8" fill="#2a3b35" />
    {Array.from({ length: 10 }).map((_, i) => (
      <rect key={i} x={((i * 260 - t * 40) % 2600) - 100} y={1900} width="120" height="10" fill="#223029" />
    ))}
  </g>
);

const Horde: React.FC<{ t: number; conv: number; n?: number }> = ({ t, conv, n = 12 }) => {
  const zs = Array.from({ length: n }).map((_, i) => {
    const row = i % 3;
    const y = 1620 + row * 120 + (i % 2) * 20;
    const sc = 0.62 + row * 0.2;
    const dir = i % 2 === 0 ? 1 : -1;
    const drift = ((((hash(i) * 1400 + dir * t * (24 + hash(i + 3) * 30)) % 1500) + 1500) % 1500) - 200;
    const target = 540 + (i - n / 2) * 78;
    const px = drift + (target - drift) * conv;
    const facing = conv > 0.4 ? px > 540 : dir < 0;
    return { i, y, sc, px, facing };
  });
  zs.sort((a, b) => a.y - b.y);
  return <g>{zs.map((z) => <Zombie key={z.i} x={z.px} y={z.y} s={z.sc} t={t} seed={z.i} flip={z.facing} reach={conv} dark={z.y > 1700 ? 1 : 0.6} />)}</g>;
};

/* ---------- предметы ---------- */
const Radio: React.FC<{ x: number; y: number; s?: number; t: number; lines?: string[]; screen?: string; label?: string }> = ({ x, y, s = 1, t, lines = [], screen = "#0b2a17", label = "КАНАЛ 7" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x="-8" y="-210" width="14" height="140" rx="6" fill="#1a1f24" transform={`rotate(${Math.sin(t * 7) * 1.5} 0 -70)`} />
    <rect x="-130" y="-80" width="260" height="400" rx="34" fill="#1d252c" stroke="#3d4b56" strokeWidth="5" />
    <rect x="-100" y="-50" width="200" height="130" rx="12" fill={screen} stroke={GREEN} strokeWidth="3" />
    <text x="0" y="-15" textAnchor="middle" fontSize="34" fontWeight="900" fill={GREEN} fontFamily={FONT} letterSpacing="3">{label}</text>
    {lines.map((l, i) => (
      <text key={i} x="0" y={22 + i * 30} textAnchor="middle" fontSize="24" fontWeight="800" fill={GREEN} fontFamily={FONT}>{l}</text>
    ))}
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-90 + i * 21} y={70 - (4 + Math.abs(Math.sin(t * 9 + i * 1.3)) * 22)} width="12" height={4 + Math.abs(Math.sin(t * 9 + i * 1.3)) * 22} fill={GREEN} opacity="0.5" />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <circle key={i} cx={-70 + (i % 4) * 46} cy={125 + Math.floor(i / 4) * 44} r="14" fill="#10161b" stroke="#3d4b56" strokeWidth="3" />
    ))}
    <rect x="-130" y="170" width="0" height="0" />
    <circle cx="96" cy="-100" r="10" fill={RED} opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 6))} />
  </g>
);

const Tile: React.FC<{ n: string; title: string; k: number; y?: number }> = ({ n, title, k, y = 300 }) => {
  const p = ease(k / 0.35);
  return (
    <g transform={`translate(540,${y + (1 - p) * -200}) scale(${0.7 + 0.3 * p})`} opacity={p}>
      <rect x="-420" y="0" width="840" height="300" rx="36" fill="#0e1a17" stroke={AMBER} strokeWidth="6" />
      <text x="-340" y="210" fontSize="190" fontWeight="900" fill={AMBER} fontFamily={FONT}>{n}</text>
      <text x="-90" y="140" fontSize={title.length > 10 ? 54 : 68} fontWeight="900" fill="#fff" fontFamily={FONT} letterSpacing="2">{title.split("|")[0]}</text>
      <text x="-90" y="215" fontSize={title.length > 10 ? 54 : 68} fontWeight="900" fill={RED} fontFamily={FONT} letterSpacing="2">{title.split("|")[1] ?? ""}</text>
    </g>
  );
};

const Rings: React.FC<{ x: number; y: number; k: number; color?: string; n?: number; max?: number }> = ({ x, y, k, color = RED, n = 4, max = 520 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = (((k * 0.9 - i * 0.22) % 1) + 1) % 1;
      return <circle key={i} cx={x} cy={y} r={20 + p * max} fill="none" stroke={color} strokeWidth={6 * (1 - p) + 1} opacity={(1 - p) * 0.9} />;
    })}
  </g>
);

const Label: React.FC<{ x: number; y: number; text: string; color?: string; size?: number; o?: number; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, color = "#fff", size = 56, o = 1, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight="900" fill={color} fontFamily={FONT} opacity={o} letterSpacing="3" style={{ paintOrder: "stroke" }} stroke="#000" strokeWidth="8">{text}</text>
);

/* ---------- сцены ---------- */
const S1: React.FC<SP> = ({ t, k, d }) => {
  const z = 1 + 0.07 * (k / d);
  return (
    <g transform={`translate(540 700) scale(${z}) translate(-540 -700)`}>
      <Skyline t={t} base={1000} seed={5} col="#08100f" lit={0.1} shift={-k * 8} />
      <Skyline t={t} base={1200} seed={11} col="#0a1318" lit={0.16} shift={-k * 20} />
      <Label x={540} y={460} text="ЗОМБИ-АПОКАЛИПСИС" size={64} color={AMBER} o={ease(k / 0.3)} />
      <Label x={540} y={540} text="ДЕНЬ 4" size={110} color="#fff" o={ease((k - 0.2) / 0.3)} />
    </g>
  );
};

const S2: React.FC<SP> = ({ t, k, d }) => {
  const pan = (1 - ease(k / d)) * 70;
  return (
    <g transform={`translate(0 ${pan})`}>
      <rect x="230" y="250" width="620" height="1000" fill="#0a1318" stroke="#1c3038" strokeWidth="4" />
      {Array.from({ length: 9 }).map((_, r) =>
        Array.from({ length: 4 }).map((__, c) => {
          const top = r === 0;
          const hasZ = !top && hash(r * 7 + c) < 0.35;
          return (
            <g key={`${r}${c}`}>
              <rect x={262 + c * 148} y={290 + r * 105} width="112" height="76" fill={top && c === 1 ? "#183626" : "#0f1d23"} stroke="#22383f" strokeWidth="3" />
              {hasZ && <circle cx={318 + c * 148} cy={330 + r * 105} r={14} fill="#16251f" stroke={RED} strokeWidth="2" opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 3 + r + c))} />}
            </g>
          );
        })
      )}
      <Gena x={410 + 0} y={366} s={0.28} t={t} />
      <Rings x={410} y={330} k={k} color={GREEN} n={3} max={160} />
      <text x="880" y="340" fontSize="72" fontWeight="900" fill={AMBER} fontFamily={FONT} opacity={ease((k - 0.4) / 0.3)}>← 9 ЭТАЖ</text>
      <Label x={540} y={1180} text="ВНИЗУ — ТЫСЯЧИ" size={50} color={RED} o={ease((k - 1.2) / 0.3)} />
    </g>
  );
};

const S3: React.FC<SP> = ({ t, k }) => {
  const sh = Math.sin(t * 40) * 2;
  const msg = ["НЕ ОТВЕЧАЙ", "СНАЧАЛА", "3 ПРАВИЛА"];
  const show = msg.map((m, i) => (k > 0.5 + i * 0.9 ? m : ""));
  return (
    <g transform={`translate(${sh} 0)`}>
      <circle cx="540" cy="620" r={380 + Math.sin(t * 6) * 14} fill={GREEN} opacity="0.07" />
      <Radio x={540} y={480} s={2.1} t={t} lines={show} />
      <Label x={540} y={1150} text="ГОЛОС В ЭФИРЕ" size={44} color={GREEN} o={ease(k / 0.3)} />
    </g>
  );
};

const S4: React.FC<SP> = ({ t, k }) => (
  <g>
    <Tile n="01" title="ТИШИНА|" k={k} />
    <circle cx="540" cy="780" r="150" fill="#9db3c4" stroke="#cfe0ec" strokeWidth="5" />
    <circle cx="490" cy="740" r="12" fill="#0a0f14" /><circle cx="590" cy="740" r="12" fill="#0a0f14" />
    <rect x="525" y="780" width="30" height="170" rx="14" fill="#cfe0ec" stroke="#fff" strokeWidth="3" transform={`rotate(${Math.sin(t * 5) * 2} 540 900)`} />
    <rect x="500" y="870" width="80" height="14" rx="7" fill="#3a4753" />
    <Label x={540} y={1010} text="ШШШ…" size={80} color={AMBER} o={0.5 + 0.5 * Math.abs(Math.sin(t * 5))} />
  </g>
);

const S5: React.FC<SP> = ({ t, k }) => (
  <g>
    <Rings x={640} y={650} k={-k} color={RED} n={5} max={520} />
    <Zombie x={500} y={1020} s={2.5} t={t} seed={2} reach={1} />
    {Array.from({ length: 5 }).map((_, i) => {
      const p = (((k * 0.8 - i * 0.2) % 1) + 1) % 1;
      return <circle key={i} cx={640} cy={650} r={400 * (1 - p)} fill="none" stroke={AMBER} strokeWidth="5" opacity={p} />;
    })}
    <Label x={540} y={330} text="СЛЫШАТ" size={120} color={RED} o={ease(k / 0.25)} />
    <g opacity={ease((k - 2.6) / 0.3)}>
      <circle cx="260" cy="1000" r="85" fill="#1a2420" stroke="#fff" strokeWidth="5" />
      <rect x="160" y="980" width="12" height="80" fill="#fff" /><rect x="350" y="980" width="12" height="80" fill="#fff" />
      <Label x={540} y={1010} text="= УЖИН" size={64} color="#fff" anchor="start" />
    </g>
  </g>
);

const S6: React.FC<SP> = ({ t, k }) => {
  const g = 2600;
  const fall = Math.min(k, 0.75);
  let cy = 220 + g * 0.5 * fall * fall * 0.62;
  if (cy > 930) cy = 930;
  const bk = k - 0.75;
  if (bk > 0) cy = 930 - Math.abs(Math.sin(bk * 9)) * 120 * Math.exp(-bk * 3);
  const cnt = Math.round(interpolate(k, [0.9, 2.6], [0, 40], clamp));
  return (
    <g>
      <rect x="0" y="960" width={W} height="520" fill="#101a17" />
      <rect x="0" y="960" width={W} height="6" fill="#2a3b35" />
      <rect x="470" y={cy} width="80" height="100" rx="8" fill="#9aa5ad" stroke="#fff" strokeWidth="4" transform={`rotate(${bk > 0 ? bk * 200 : 0} 510 ${cy + 50})`} />
      <rect x="470" y={cy} width="80" height="22" fill="#c9d3da" transform={`rotate(${bk > 0 ? bk * 200 : 0} 510 ${cy + 50})`} />
      {k > 0.75 && <Rings x={510} y={1040} k={k - 0.75} color={RED} n={4} max={600} />}
      <Label x={540} y={430} text={`${cnt}`} size={230} color={cnt > 30 ? RED : AMBER} o={ease((k - 0.9) / 0.2)} />
      <Label x={540} y={510} text="ЗОМБИ ВО ДВОРЕ" size={48} color="#fff" o={ease((k - 0.9) / 0.3)} />
    </g>
  );
};

const S7: React.FC<SP> = ({ t, k }) => {
  const on = k < 1.1;
  const flick = on ? 1 : 0;
  return (
    <g>
      <Tile n="02" title="НИКАКОГО|СВЕТА" k={k} />
      <rect width={W} height={1100} fill="#000" opacity={on ? 0 : 0.55} />
      <circle cx="540" cy="860" r={on ? 280 + Math.sin(t * 20) * 8 : 0} fill={AMBER} opacity="0.2" />
      <circle cx="540" cy="860" r="90" fill={on ? AMBER : "#2a2f2c"} stroke="#fff" strokeWidth="5" />
      <rect x="505" y="940" width="70" height="60" fill="#556" />
      {!on && (<g stroke={RED} strokeWidth="14"><line x1="380" y1="700" x2="700" y2="1020" /><line x1="700" y1="700" x2="380" y2="1020" /></g>)}
      <Label x={540} y={1100} text={flick ? "ЛАМПА ВКЛ" : "ТЕМНОТА"} size={50} color={flick ? AMBER : GREEN} />
    </g>
  );
};

const S8: React.FC<SP> = ({ t, k, d }) => {
  const flame = 1 + Math.sin(t * 14) * 0.15;
  return (
    <g>
      <rect x="300" y="240" width="480" height="900" fill="#0a1318" stroke="#1c3038" strokeWidth="4" />
      {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 3 }).map((__, c) => (
        <rect key={`${r}${c}`} x={340 + c * 140} y={290 + r * 135} width="100" height="90" fill="#0f1d23" stroke="#22383f" strokeWidth="3" />
      )))}
      <rect x="480" y="560" width="100" height="90" fill="#3d2c10" stroke={AMBER} strokeWidth="4" />
      <path d="M530,640 Q510,610 530,580 Q550,610 530,640Z" fill={AMBER} transform={`scale(${flame})`} style={{ transformOrigin: "530px 640px" }} />
      <circle cx="530" cy="605" r={150 + Math.sin(t * 5) * 20} fill={AMBER} opacity="0.18" />
      <Rings x={530} y={605} k={k} color={AMBER} n={4} max={620} />
      <Label x={540} y={1210} text="СВЕЧА = МАЯК" size={72} color={AMBER} o={0.6 + 0.4 * Math.abs(Math.sin(t * 6))} />
      <g opacity={ease((k - 1.4) / 0.4)}>
        <line x1="90" y1="1120" x2="990" y2="1120" stroke="#fff" strokeWidth="4" />
        <polygon points="90,1120 130,1100 130,1140" fill="#fff" /><polygon points="990,1120 950,1100 950,1140" fill="#fff" />
        <Label x={540} y={1100} text="1 КМ" size={44} color="#fff" />
      </g>
      {Array.from({ length: 14 }).map((_, i) => {
        const dir = i % 2 ? 1 : -1;
        const p = ease(((k + i * 0.13) % d) / d);
        return <circle key={i} cx={540 + dir * (520 - p * 380 + i * 4)} cy={1100 + (i % 3) * 18} r="9" fill={RED} opacity="0.85" />;
      })}
    </g>
  );
};

const S9: React.FC<SP> = ({ t, k }) => (
  <g>
    <Tile n="03" title="ПРОВЕРКА|" k={k} />
    <Radio x={540} y={680} s={1.4} t={t} lines={["КОРДОН?"]} />
    <Rings x={540} y={760} k={k} color={GREEN} n={3} max={420} />
  </g>
);

const S10: React.FC<SP> = ({ t, k }) => {
  const live = k < 2.9;
  return (
    <g>
      <rect x="60" y="260" width="960" height="360" rx="28" fill="#0e1a17" stroke={live ? GREEN : "#2a3b35"} strokeWidth="5" opacity={live ? 1 : 0.6} />
      <Gena x={230} y={560} s={0.9} t={t} />
      <rect x="380" y="320" width="560" height="140" rx="30" fill="#14301f" stroke={GREEN} strokeWidth="4" opacity={ease((k - 0.7) / 0.2)} />
      <Label x={660} y={410} text="«ЗАСЛОН»" size={78} color={GREEN} o={ease((k - 1.3) / 0.2)} />
      <Label x={660} y={500} text="✓ СВОЙ" size={54} color={GREEN} o={ease((k - 1.9) / 0.2)} />
      <rect x="60" y="680" width="960" height="360" rx="28" fill="#1a0e0e" stroke={!live ? RED : "#3b2323"} strokeWidth="5" opacity={!live ? 1 : 0.6} />
      <Zombie x={240} y={990} s={1.05} t={t} seed={4} reach={1} />
      <rect x="380" y="740" width="560" height="140" rx="30" fill="#2a1111" stroke={RED} strokeWidth="4" opacity={ease((k - 3.0) / 0.2)} />
      <Label x={660} y={830} text="«ГРРР…»" size={78} color={RED} o={ease((k - 3.1) / 0.2)} />
      <Label x={660} y={940} text="✗ ЧУЖОЙ" size={54} color={RED} o={ease((k - 3.9) / 0.2)} />
    </g>
  );
};

const S11: React.FC<SP> = ({ t, k }) => {
  const press = k > 0.4 && k < 0.8;
  const stage = k < 0.4 ? 0 : k < 2.9 ? 1 : k < 4.3 ? 2 : 3;
  const screen = stage === 3 ? "#3a0c0c" : "#0b2a17";
  const sh = stage === 3 ? Math.sin(t * 60) * 5 : 0;
  const txt = stage <= 1 ? ["КОРДОН?"] : stage === 2 ? ["…", "ТИШИНА"] : ["ХРРР"];
  return (
    <g transform={`translate(${sh} 0)`}>
      <rect width={W} height={1100} fill={RED} opacity={stage === 3 ? 0.12 + 0.1 * Math.sin(t * 20) : 0} />
      <Radio x={470} y={470} s={1.9} t={t} lines={txt} screen={screen} label={stage === 3 ? "ЭФИР" : "КАНАЛ 7"} />
      <g transform={`translate(${press ? 740 : 790} ${press ? 700 : 690})`}>
        <rect x="0" y="0" width="190" height="52" rx="26" fill="#9db3c4" stroke="#fff" strokeWidth="4" />
      </g>
      {stage === 1 && <Rings x={470} y={560} k={k} color={GREEN} n={3} max={460} />}
      {stage === 3 && Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={120 + i * 70} y={960 - Math.abs(Math.sin(t * 22 + i)) * 100} width="40" height={Math.abs(Math.sin(t * 22 + i)) * 100 + 6} fill={RED} />
      ))}
    </g>
  );
};

const S12: React.FC<SP> = ({ t, k, d }) => {
  const gx = interpolate(k, [0.6, 2.4], [700, 500], clamp);
  const sc = 0.4 + ease(k / d) * 1.1;
  const crack = k > 2.2;
  return (
    <g>
      <rect x="140" y="250" width="800" height="840" fill="#0b1c22" stroke="#3a5560" strokeWidth="10" />
      <Zombie x={540} y={1040 - (1 - ease(k / d)) * 0} s={sc * 1.9} t={t} seed={7} reach={1} />
      <rect x="140" y="250" width="800" height="840" fill="#9fd8e8" opacity="0.07" />
      {crack && (<g stroke="#fff" strokeWidth="4" opacity="0.8"><path d="M540,670 L420,430 M540,670 L690,470 M540,670 L470,900 M540,670 L720,860 M420,430 L340,330" fill="none" /></g>)}
      <Gena x={gx} y={1080} s={0.8} t={t} pose="back" flip />
      <Label x={540} y={200} text="−2 ШАГА" size={90} color={RED} o={ease((k - 2) / 0.2)} />
    </g>
  );
};

const S13: React.FC<SP> = ({ t, k }) => {
  const amp = 2 + k * 6;
  const sx = Math.sin(t * 55) * amp;
  const steps = Math.round(interpolate(k, [0, 3], [3, 31], clamp));
  return (
    <g>
      <g transform={`translate(${sx} 0)`}>
        <rect x="300" y="240" width="480" height="860" rx="10" fill="#2a1d14" stroke="#5a4129" strokeWidth="8" />
        <circle cx="540" cy="460" r="20" fill="#0a0f14" stroke="#aaa" strokeWidth="4" />
        <rect x="360" y="640" width="360" height="14" fill="#aaa" /><circle cx="360" cy="647" r="12" fill="#aaa" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${380 + i * 55},${320 + hash(i) * 60} l${14 + hash(i + 3) * 20},${260 + hash(i + 7) * 140}`} stroke="#c9b79b" strokeWidth="4" opacity={ease((k - i * 0.35) / 0.2)} />
        ))}
        <rect x="300" y="1060" width="480" height="40" fill="#050807" />
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={350 + ((i * 100 + t * 90) % 420)} cy="1080" rx="26" ry="10" fill="#27342f" />
        ))}
      </g>
      <Label x={540} y={200} text={`ШАГИ: ${steps}`} size={86} color={RED} />
      <Gena x={120} y={1090} s={0.7} t={t} pose="back" />
    </g>
  );
};

const S14: React.FC<SP> = ({ t, k, d }) => {
  const p = ease(k / d);
  const pts = [[160, 1040], [900, 1040], [200, 800], [900, 800], [200, 560], [900, 560], [540, 330]];
  const seg = p * (pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(seg));
  const f = seg - i;
  const gx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
  const gy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
  return (
    <g>
      <rect width={W} height={1100} fill={RED} opacity={0.08 + 0.08 * Math.sin(t * 14)} />
      {pts.slice(0, -1).map((a, j) => (
        <line key={j} x1={a[0]} y1={a[1]} x2={pts[j + 1][0]} y2={pts[j + 1][1]} stroke="#3a4b44" strokeWidth="14" />
      ))}
      <rect x="440" y="230" width="200" height="100" rx="10" fill="#14301f" stroke={GREEN} strokeWidth="5" />
      <Label x={540} y={302} text="КРЫША" size={46} color={GREEN} />
      <Gena x={gx} y={gy} s={0.5} t={t} pose="run" flip={pts[i + 1][0] < pts[i][0]} />
      <Label x={540} y={1160} text="ОДИН ВЫХОД" size={60} color={AMBER} o={ease((k - 0.3) / 0.3)} />
    </g>
  );
};

const S15: React.FC<SP> = ({ t, k }) => {
  const pulse = 1 + 0.06 * Math.sin(t * 6);
  return (
    <g>
      <rect width={W} height={1500} fill="#050807" opacity="0.5" />
      <Label x={540} y={330} text="ФИНАЛ · ЧАСТЬ 1" size={54} color={AMBER} o={ease(k / 0.3)} />
      <Label x={540} y={520} text="ЧАСТЬ 2" size={150} color="#fff" o={ease((k - 0.2) / 0.3)} />
      <Label x={540} y={650} text="ЛЕСТНИЦА" size={110} color={RED} o={ease((k - 0.5) / 0.3)} />
      <g transform={`translate(540 880) scale(${pulse})`} opacity={ease((k - 2.2) / 0.4)}>
        <rect x="-300" y="-60" width="600" height="120" rx="60" fill={RED} />
        <text x="0" y="22" textAnchor="middle" fontSize="60" fontWeight="900" fill="#fff" fontFamily={FONT} letterSpacing="3">ПОДПИСАТЬСЯ</text>
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${160 + i * 190} ${1180 + Math.sin(t * 4 + i) * 20})`}>
          <rect x="-16" y="-120" width="32" height="120" rx="14" fill="#1b2f28" stroke="#5a8a78" strokeWidth="3" />
        </g>
      ))}
    </g>
  );
};

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15];
const NOISE = [14, 12, 18, 4, 28, 96, 6, 40, 10, 8, 60, 78, 92, 70, 35];

/* ---------- интерфейс ---------- */
const Header: React.FC<{ t: number; noise: number }> = ({ t, noise }) => {
  const mins = 3 * 60 + 7 + Math.floor(t / 3);
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 150, fontFamily: FONT, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: RED, opacity: Math.sin(t * 6) > 0 ? 1 : 0.25 }} />
        <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", textShadow: "0 3px 10px #000" }}>{hh}:{mm}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: AMBER, letterSpacing: 4 }}>НОЧЬ 4</div>
      </div>
      <div style={{ position: "absolute", right: 40, top: 142, width: 260, fontFamily: FONT }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: noise > 60 ? RED : "#fff", letterSpacing: 4, textAlign: "right", textShadow: "0 2px 8px #000" }}>ШУМ</div>
        <div style={{ height: 22, borderRadius: 11, background: "#00000088", border: "3px solid #ffffff55", marginTop: 6, overflow: "hidden" }}>
          <div style={{ width: `${noise}%`, height: "100%", background: noise > 60 ? RED : noise > 30 ? AMBER : GREEN }} />
        </div>
      </div>
    </>
  );
};

const KW = /тишин|слышат|звук|сорок|свет|свеч|маяк|кордон|заслон|хрип|мёртвый|шаги|крыша|стекл|ужин|никакого/i;

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const line = lineAt(t);
  if (!line) return null;
  const words = line.text.split(" ");
  const prog = Math.min(1, Math.max(0, (t - line.start) / line.dur));
  const idx = Math.floor(prog * words.length * 1.04);
  const o = interpolate(t, [line.start, line.start + 0.08], [0, 1], clamp);
  const pop = interpolate(t, [line.start, line.start + 0.12], [1.12, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 1130, padding: "22px 30px", borderRadius: 30, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.6) 22%, rgba(0,0,0,.6) 78%, rgba(0,0,0,0))", textAlign: "center", fontFamily: FONT, opacity: o, transform: `scale(${pop})` }}>
      <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.1, textShadow: "0 4px 18px rgba(0,0,0,.95), 0 0 6px rgba(0,0,0,.9)" }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: KW.test(w) ? RED : i === idx ? AMBER : i < idx ? "#fff" : "rgba(255,255,255,.5)" }}>{w}{" "}</span>
        ))}
      </div>
    </div>
  );
};

/* ---------- звук ---------- */
const Audios: React.FC = () => {
  const S = (s: number) => Math.max(0, Math.round(s * FPS));
  const Z = (f: string) => staticFile(`zombie/${f}`);
  const sfx = (key: string, from: number, dur: number, f: string, vol: number, loop = false) => (
    <Sequence key={key} from={S(from)} durationInFrames={S(dur)}>
      <Audio src={Z(f)} volume={vol} loop={loop} />
    </Sequence>
  );
  const items: React.ReactNode[] = [
    sfx("wind", 0, 80, "sfx-wind.mp3", 0.35, true),
    sfx("crowd", 0, 12, "x-crowd.mp3", 0.25, true),
    sfx("radio3", startOf("z3") - 0.2, 2.0, "x-radio.mp3", 0.7),
    sfx("wh4", startOf("z4") - 0.25, 1.2, "sfx-whoosh.mp3", 0.5),
    sfx("wh7", startOf("z7") - 0.25, 1.2, "sfx-whoosh.mp3", 0.5),
    sfx("wh9", startOf("z9") - 0.25, 1.2, "sfx-whoosh.mp3", 0.5),
    sfx("hit6", startOf("z6") + 0.55, 1.5, "sfx-hit.mp3", 1.0),
    sfx("crowd6", startOf("z6"), 9, "x-crowd.mp3", 0.5, true),
    sfx("growl6", startOf("z6") + 1.5, 1.5, "sfx-growl.mp3", 0.6),
    sfx("black7", startOf("z7") + 1.1, 2.0, "x-blackout.mp3", 0.8),
    sfx("howl8", startOf("z8") + 1.0, 3.0, "sfx-howl.mp3", 0.5),
    sfx("radio11", startOf("z11") + 0.3, 2.0, "x-radio.mp3", 0.8),
    sfx("heart11", startOf("z11"), 14, "sfx-heart.mp3", 0.7, true),
    sfx("growl10", startOf("z10") + 3.2, 2.0, "sfx-growl.mp3", 0.7),
    sfx("growl11", startOf("z11") + 4.3, 2.0, "sfx-growl.mp3", 0.9),
    sfx("hit12", startOf("z12") + 2.2, 1.5, "sfx-hit.mp3", 1.0),
    sfx("growl12", startOf("z12") + 1.2, 2.0, "sfx-growl.mp3", 0.8),
    sfx("scr13", startOf("z13"), 3.4, "x-scratch.mp3", 0.9),
    sfx("knock13", startOf("z13") + 0.4, 3.0, "x-knock.mp3", 0.9),
    sfx("steps13", startOf("z13"), 3.4, "x-steps.mp3", 0.8),
    sfx("riser14", startOf("z13") + 1.0, 4.0, "sfx-riser.mp3", 0.7),
    sfx("steps14", startOf("z14"), 2.4, "x-steps.mp3", 0.9),
    sfx("hit15", startOf("z15") - 0.1, 1.5, "sfx-hit.mp3", 0.7),
  ];
  return (
    <>
      {items}
      {LINES.map((l) => (
        <Sequence key={l.id} from={S(l.start)} durationInFrames={Math.ceil((l.dur + 0.4) * FPS)}>
          <Audio src={Z(l.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

const KICKS = [
  startOf("z1") + 0.2, startOf("z3") + 0.2, startOf("z4"), startOf("z6") + 0.55, startOf("z7") + 1.1, startOf("z9"),
  startOf("z10") + 3.2, startOf("z11") + 4.3, startOf("z12") + 2.2, startOf("z13") + 0.4, startOf("z13") + 1.2, startOf("z13") + 2.0,
  startOf("z14"), startOf("z15") - 0.1,
];

export const Zombie_: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { line, idx } = sceneAt(t);
  const prevEnd = idx > 0 ? LINES[idx - 1].end : 0;
  const sceneStart = idx === 0 ? 0 : line.start - 0.26;
  const sceneEnd = idx < LINES.length - 1 ? LINES[idx + 1].start - 0.26 : DURATION_SEC;
  const k = t - sceneStart;
  const d = sceneEnd - sceneStart;
  const Scene = SCENES[idx];
  void prevEnd;

  const kick = Math.max(0, ...KICKS.map((q) => (t >= q && t < q + 0.45 ? 1 - (t - q) / 0.45 : 0)));
  const flash = k < 0.12 ? 1 - k / 0.12 : 0;
  const amp = 1.2 + kick * 22;
  const dx = Math.sin(frame * 1.7) * amp * 0.7;
  const dy = Math.cos(frame * 1.3) * amp * 0.7;
  const zoom = 1.02 + kick * 0.05 + 0.012 * Math.sin(t * 1.3);

  const noise = interpolate(t, LINES.map((l) => l.start), NOISE, clamp);
  const conv = interpolate(
    t,
    [startOf("z6"), endOf("z6"), startOf("z8"), endOf("z8"), startOf("z11"), startOf("z13"), endOf("z14")],
    [0, 0.7, 0.55, 0.8, 0.6, 0.95, 0.5],
    clamp
  );
  const heart = idx >= 10 ? 0.25 + 0.2 * Math.abs(Math.sin(t * 6)) : 0.1;
  const fadeIn = interpolate(t, [0, 0.3], [0, 1], clamp);
  const fadeOut = interpolate(t, [DURATION_SEC - 0.7, DURATION_SEC], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#04080d" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: Math.min(fadeIn, fadeOut) }}>
        <div style={{ transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: "50% 45%" }}>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            <Sky t={t} />
            <Skyline t={t} base={1480} seed={3} col="#070e10" lit={0.08} shift={-t * 6} />
            <Scene t={t} k={k} d={d} />
            <Street t={t} />
            <Horde t={t} conv={conv} />
            <rect width={W} height={H} fill="#fff" opacity={flash * 0.28} />
            <defs>
              <radialGradient id="vigz">
                <stop offset="0.5" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor={RED} stopOpacity={Math.min(0.4, heart * 0.6 + noise / 500)} />
              </radialGradient>
            </defs>
            <rect width={W} height={H} fill="url(#vigz)" />
            {Array.from({ length: 24 }).map((_, i) => (
              <circle key={i} cx={(hash(i) * W + t * 20 * (1 + hash(i + 4))) % W} cy={(hash(i + 8) * H + t * 30) % H} r="2.5" fill="#cfe0ec" opacity="0.25" />
            ))}
          </svg>
        </div>
      </div>
      <Header t={t} noise={noise} />
      <Subtitle t={t} />
      <Audios />
    </AbsoluteFill>
  );
};
