import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DURATION_SEC, FPS, LINES, SCENE_STARTS, WHO_COLOR, WHO_NAME, lineAt } from "./timeline9";

const W = 1080;
const H = 1920;
const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const GOLD = "#ffd36a";
const SKIN = "#e2b189";
const SKIN_D = "#c98f68";

type SP = { t: number; k: number; d: number };

/* ---------- лица и фигуры ---------- */
type HeadProps = {
  x: number; y: number; r?: number; skin?: string; hair?: string; hat?: "papakha" | "scarf" | "none" | "cap";
  beard?: string; old?: boolean; mood?: "calm" | "smile" | "open" | "angry" | "sad"; look?: number; blink?: boolean; t?: number; hatC?: string;
};
const Head: React.FC<HeadProps> = ({ x, y, r = 60, skin = SKIN, hair = "#2a1d16", hat = "none", beard, old, mood = "calm", look = 0, blink, t = 0, hatC }) => {
  const e = r * 0.34;
  const eyeY = -r * 0.05;
  const mouth =
    mood === "smile" ? `M${-r * 0.3},${r * 0.42} Q0,${r * 0.72} ${r * 0.3},${r * 0.42}`
    : mood === "open" ? `M${-r * 0.22},${r * 0.45} Q0,${r * 0.85} ${r * 0.22},${r * 0.45} Z`
    : mood === "angry" ? `M${-r * 0.25},${r * 0.55} Q0,${r * 0.38} ${r * 0.25},${r * 0.55}`
    : mood === "sad" ? `M${-r * 0.22},${r * 0.55} Q0,${r * 0.42} ${r * 0.22},${r * 0.55}`
    : `M${-r * 0.2},${r * 0.5} L${r * 0.2},${r * 0.5}`;
  const closed = blink || Math.sin(t * 2.1 + x) > 0.985;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={-r * 0.95} cy="0" r={r * 0.17} fill={skin} />
      <circle cx={r * 0.95} cy="0" r={r * 0.17} fill={skin} />
      {beard && <path d={`M${-r * 0.95},${r * 0.1} Q${-r * 0.8},${r * 1.4} 0,${r * 1.45} Q${r * 0.8},${r * 1.4} ${r * 0.95},${r * 0.1} Q0,${r * 0.45} ${-r * 0.95},${r * 0.1}Z`} fill={beard} />}
      <ellipse cx="0" cy="0" rx={r * 0.98} ry={r} fill={skin} />
      {hat === "papakha" && (
        <g>
          <path d={`M${-r * 1.05},${-r * 0.35} Q${-r * 1.2},${-r * 1.7} 0,${-r * 1.75} Q${r * 1.2},${-r * 1.7} ${r * 1.05},${-r * 0.35} Q0,${-r * 0.7} ${-r * 1.05},${-r * 0.35}Z`} fill={hatC ?? "#2b2019"} stroke="#4a382c" strokeWidth="3" />
          {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-r * 0.9 + i * r * 0.22},${-r * 1.1} q${r * 0.05},${-r * 0.3} ${r * 0.12},${-r * 0.45}`} stroke="#4a382c" strokeWidth="3" fill="none" />)}
        </g>
      )}
      {hat === "scarf" && (
        <g>
          <path d={`M${-r * 1.1},${r * 0.35} Q${-r * 1.3},${-r * 1.5} 0,${-r * 1.4} Q${r * 1.3},${-r * 1.5} ${r * 1.1},${r * 0.35} Q${r * 0.8},${-r * 0.55} 0,${-r * 0.6} Q${-r * 0.8},${-r * 0.55} ${-r * 1.1},${r * 0.35}Z`} fill={hatC ?? "#5b3a6b"} />
          <path d={`M${-r * 1.0},${r * 0.1} L${-r * 1.15},${r * 1.2} L${-r * 0.6},${r * 0.9}Z`} fill={hatC ?? "#5b3a6b"} />
        </g>
      )}
      {hat === "cap" && <path d={`M${-r},${-r * 0.2} Q0,${-r * 1.6} ${r},${-r * 0.2} Q0,${-r * 0.6} ${-r},${-r * 0.2}Z`} fill={hatC ?? "#1d2a3a"} />}
      {hat === "none" && <path d={`M${-r},${-r * 0.1} Q${-r * 1.1},${-r * 1.4} 0,${-r * 1.3} Q${r * 1.1},${-r * 1.4} ${r},${-r * 0.1} Q${r * 0.6},${-r * 0.7} 0,${-r * 0.65} Q${-r * 0.6},${-r * 0.7} ${-r},${-r * 0.1}Z`} fill={hair} />}
      {old && <g stroke={SKIN_D} strokeWidth="3" fill="none"><path d={`M${-r * 0.5},${-r * 0.4} q${r * 0.5},${-r * 0.1} ${r},0`} /><path d={`M${-r * 0.7},${r * 0.2} q${r * 0.1},${r * 0.3} ${r * 0.25},${r * 0.35}`} /><path d={`M${r * 0.7},${r * 0.2} q${-r * 0.1},${r * 0.3} ${-r * 0.25},${r * 0.35}`} /></g>}
      {!closed ? (<><circle cx={-e + look * 4} cy={eyeY} r={r * 0.09} fill="#1a120d" /><circle cx={e + look * 4} cy={eyeY} r={r * 0.09} fill="#1a120d" /></>) : (<><path d={`M${-e - 8},${eyeY} h16 M${e - 8},${eyeY} h16`} stroke="#1a120d" strokeWidth="4" /></>)}
      <path d={`M${-e - 12},${eyeY - r * 0.22} L${-e + 12},${eyeY - r * (mood === "angry" ? 0.1 : 0.26)} M${e - 12},${eyeY - r * (mood === "angry" ? 0.1 : 0.26)} L${e + 12},${eyeY - r * 0.22}`} stroke="#1a120d" strokeWidth="4" />
      <path d={mouth} fill={mood === "open" ? "#5a1f1f" : "none"} stroke="#6a2a22" strokeWidth="4" strokeLinecap="round" />
      {mood === "smile" && <><circle cx={-r * 0.55} cy={r * 0.3} r={r * 0.13} fill="#ff9a7a" opacity="0.5" /><circle cx={r * 0.55} cy={r * 0.3} r={r * 0.13} fill="#ff9a7a" opacity="0.5" /></>}
    </g>
  );
};

const Bust: React.FC<HeadProps & { shirt?: string; w?: number; s?: number }> = ({ shirt = "#3b4a63", w = 1, s = 1, ...h }) => {
  const r = h.r ?? 60;
  return (
    <g transform={`translate(${h.x},${h.y}) scale(${s}) translate(${-h.x},${-h.y})`}>
      <rect x={h.x - r * 0.3} y={h.y + r * 0.8} width={r * 0.6} height={r * 0.6} fill={SKIN_D} />
      <path d={`M${h.x - r * 1.9 * w},${h.y + r * 3.4} Q${h.x - r * 1.7 * w},${h.y + r * 1.3} ${h.x},${h.y + r * 1.2} Q${h.x + r * 1.7 * w},${h.y + r * 1.3} ${h.x + r * 1.9 * w},${h.y + r * 3.4}Z`} fill={shirt} />
      <Head {...h} />
    </g>
  );
};

type FigProps = {
  x: number; y: number; s?: number; t: number; flip?: boolean; legSw?: number; armF?: number; armB?: number; tilt?: number;
  shirt?: string; pants?: string; head?: Partial<HeadProps>; heldF?: React.ReactNode; bob?: number;
};
const Figure: React.FC<FigProps> = ({ x, y, s = 1, t, flip, legSw = 0, armF = 0, armB = 0, tilt = 0, shirt = "#3a5a7a", pants = "#23232d", head, heldF, bob = 0 }) => (
  <g transform={`translate(${x},${y - bob}) scale(${flip ? -s : s},${s}) rotate(${tilt})`}>
    <g transform={`rotate(${legSw} 0 -130)`}><rect x="-24" y="-130" width="22" height="130" rx="9" fill={pants} /><rect x="-30" y="-14" width="40" height="14" rx="7" fill="#111" /></g>
    <g transform={`rotate(${-legSw} 0 -130)`}><rect x="2" y="-130" width="22" height="130" rx="9" fill={pants} /><rect x="-4" y="-14" width="40" height="14" rx="7" fill="#111" /></g>
    <g transform={`rotate(${armB} 0 -250)`}><rect x="-10" y="-258" width="20" height="116" rx="10" fill={shirt} opacity="0.8" /><circle cx="0" cy="-142" r="12" fill={SKIN} /></g>
    <rect x="-38" y="-270" width="76" height="150" rx="26" fill={shirt} />
    <g transform={`rotate(${armF} 0 -250)`}><rect x="-10" y="-258" width="20" height="116" rx="10" fill={shirt} /><circle cx="0" cy="-142" r="12" fill={SKIN} />{heldF && <g transform="translate(0 -138)">{heldF}</g>}</g>
    <Head x={4} y={-325} r={46} t={t} {...head} />
  </g>
);

/* ---------- общие предметы ---------- */
const Fire: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx="0" cy="0" rx="200" ry="40" fill="#ff8a2a" opacity="0.18" />
    {[0, 1, 2].map((i) => {
      const f = 1 + Math.sin(t * (9 + i * 3) + i) * 0.12;
      const c = ["#d9461f", "#ff8a1f", "#ffd25a"][i];
      const sc = 1 - i * 0.28;
      return <path key={i} d={`M-70,0 Q-90,-110 ${-20 + Math.sin(t * 6 + i) * 14},-210 Q0,-120 20,-230 Q${50 + Math.sin(t * 7) * 10},-120 70,0Z`} fill={c} transform={`scale(${sc} ${sc * f})`} />;
    })}
    <rect x="-100" y="-8" width="200" height="22" rx="10" fill="#4a2c18" transform="rotate(-6)" />
    <rect x="-100" y="-8" width="200" height="22" rx="10" fill="#5a361e" transform="rotate(6)" />
  </g>
);

const Sparks: React.FC<{ x: number; y: number; t: number; n?: number; c?: string }> = ({ x, y, t, n = 16, c = "#ffb04a" }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = (t * 0.5 + hash(i) * 3) % 1;
      return <circle key={i} cx={x + Math.sin(t * 2 + i) * 40 + (hash(i + 5) - 0.5) * 120 * p} cy={y - p * 520} r={2 + hash(i + 2) * 4 * (1 - p)} fill={c} opacity={1 - p} />;
    })}
  </g>
);

const Mountains: React.FC<{ base: number; t: number; shift?: number; tone?: number }> = ({ base, t, shift = 0, tone = 0 }) => {
  const layer = (seed: number, col: string, amp: number, yoff: number, par: number, snow = false) => {
    const pts: string[] = [`M-100,${H}`];
    for (let i = -1; i <= 12; i++) {
      const x = i * 110 - ((shift * par) % 110);
      pts.push(`L${x},${base + yoff - hash(i + seed + Math.floor((shift * par) / 110)) * amp}`);
    }
    pts.push(`L${W + 200},${H}Z`);
    return <path key={seed} d={pts.join(" ")} fill={col} />;
  };
  void t; void tone;
  return (
    <g>
      {layer(1, "#3d4f78", 360, -240, 0.1)}
      {layer(7, "#2c3a5c", 300, -120, 0.25)}
      {layer(13, "#1f2a44", 240, 0, 0.5)}
    </g>
  );
};

const Dust: React.FC<{ t: number; c?: string }> = ({ t, c = "#ffd9a0" }) => (
  <g>
    {Array.from({ length: 26 }).map((_, i) => (
      <circle key={i} cx={(hash(i) * W + t * 14 * (0.5 + hash(i + 4))) % W} cy={(H - ((hash(i + 8) * H + t * 22 * (0.4 + hash(i))) % H))} r={1.5 + hash(i + 11) * 3} fill={c} opacity={0.15 + 0.25 * hash(i + 1)} />
    ))}
  </g>
);

/* ---------- сцены ---------- */
const S1: React.FC<SP> = ({ t, k, d }) => {
  const cam = 1 + 0.06 * (k / d);
  const flick = 0.85 + 0.15 * Math.sin(t * 13) + 0.05 * Math.sin(t * 31);
  const blanket = ease((k - 3.0) / 0.8);
  const hx = interpolate(k, [0, 2.6, 3.6, 5], [330, 360, 650, 700], clamp);
  const hy = interpolate(k, [0, 2.6, 3.6, 5], [1480, 1470, 1380, 1400], clamp);
  return (
    <g transform={`translate(540 960) scale(${cam}) translate(-540 -960)`}>
      <rect width={W} height={H} fill="#2a1b14" />
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={(i % 3) * 360 - 20 + (Math.floor(i / 3) % 2) * 120} y={80 + Math.floor(i / 3) * 110} width="330" height="90" rx="14" fill={i % 2 ? "#33241b" : "#3b2a1f"} stroke="#24170f" strokeWidth="4" />
      ))}
      {/* папаха и кинжал на стене */}
      <g transform="translate(820 470)">
        <ellipse cx="0" cy="0" rx="95" ry="70" fill="#2b2019" stroke="#4a382c" strokeWidth="4" />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${-70 + i * 20},-20 q5,-25 10,-40`} stroke="#4a382c" strokeWidth="4" fill="none" />)}
        <g transform="translate(0 170) rotate(-12)">
          <path d="M-12,-60 Q-6,60 0,100 Q6,60 12,-60Z" fill="#c9d2d9" stroke="#fff" strokeWidth="2" />
          <rect x="-24" y="-80" width="48" height="22" rx="8" fill="#6a4a2a" />
          <rect x="-8" y="-130" width="16" height="52" rx="8" fill="#3a2a1a" />
        </g>
      </g>
      {/* бабушка */}
      <Bust x={400} y={720} r={110} s={1} hat="scarf" hatC="#6b3a58" old mood={k < 3.2 ? "calm" : "smile"} shirt="#4a2f44" w={1.1} t={t} look={k > 3 ? 1 : 0} />
      <path d="M270,1000 Q400,1060 530,1000" stroke="#00000033" strokeWidth="8" fill="none" />
      {/* колыбель */}
      <g transform="translate(790 1430)">
        <path d="M-210,0 Q0,120 210,0 L170,-110 L-170,-110Z" fill="#6a4128" stroke="#3a2214" strokeWidth="6" />
        <path d="M-190,-20 Q0,40 190,-20" stroke="#8a5a38" strokeWidth="6" fill="none" />
        <ellipse cx="0" cy="-130" rx="150" ry="55" fill="#e9d6c0" />
        <Head x={-20} y={-165} r={46} skin="#f0c4a0" hat="none" hair="#2a1d16" mood="calm" blink={Math.sin(t * 1.6) > 0.2} t={t} />
        <path d={`M-170,-110 Q0,${-70 - blanket * 40} 170,-110 L150,-30 Q0,10 -150,-30Z`} fill={blanket > 0.5 ? "#c4465a" : "#a8384a"} />
        <path d="M-120,-80 Q0,-50 120,-80" stroke="#ffd3a0" strokeWidth="5" fill="none" strokeDasharray="12 10" />
      </g>
      {/* очаг */}
      <path d="M40,1700 L40,1330 Q250,1230 460,1330 L460,1700Z" fill="#4a3a30" stroke="#24170f" strokeWidth="8" />
      <path d="M90,1700 L90,1380 Q250,1300 410,1380 L410,1700Z" fill="#150d08" />
      <Fire x={250} y={1690} s={1.25} t={t} />
      <Sparks x={250} y={1500} t={t} n={14} />
      {/* руки бабушки */}
      <g transform={`translate(${hx} ${hy})`}>
        <path d="M-70,200 Q-60,40 -30,0 Q10,-30 50,0 Q70,40 60,200Z" fill="#c98f68" stroke="#a9704c" strokeWidth="4" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-34 + i * 22} y={-40 - (i === 1 || i === 2 ? 10 : 0)} width="16" height="50" rx="8" fill="#d9a07a" />)}
        <path d="M-90,210 L-90,150 Q0,120 90,150 L90,210Z" fill="#4a2f44" />
      </g>
      <rect width={W} height={H} fill="#ff8a2a" opacity={0.1 * flick} />
      <Dust t={t} />
    </g>
  );
};

const S2: React.FC<SP> = ({ t, k }) => {
  const run = Math.sin(t * 13) * 34;
  const stumble = k > 3.3 && k < 4.2;
  const catchT = k >= 4.2;
  const thermosY = stumble ? interpolate(k, [3.3, 4.2], [0, 200], clamp) : 0;
  const tilt = stumble ? interpolate(k, [3.3, 3.9, 4.2], [0, 24, -4], clamp) : 0;
  const bob = Math.abs(Math.sin(t * 13)) * 14;
  const rise = interpolate(k, [4.2, 5.2], [0, 1], clamp);
  return (
    <g>
      <defs><linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0a868" /><stop offset="0.5" stopColor="#d77a6a" /><stop offset="1" stopColor="#4a4468" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#s2sky)" />
      <circle cx="800" cy="420" r="120" fill="#ffe0a0" opacity="0.9" />
      <Mountains base={1000} t={t} shift={t * 60} />
      {/* дедушка на холме */}
      <g transform="translate(850 660)">
        <ellipse cx="0" cy="160" rx="200" ry="40" fill="#1f2a44" />
        <Figure x={0} y={150} s={0.55} t={t} head={{ hat: "papakha", beard: "#d8d8d8", old: true, mood: k > 4.4 ? "smile" : "calm" }} shirt="#5a4a3a" armF={k > 4.5 ? -150 + Math.sin(t * 8) * 10 : -10} flip />
      </g>
      {/* тропа */}
      <path d="M-100,1400 L540,1010 L760,1010 L1300,1500 L1300,H L-100,H Z" fill="#7b5a3a" />
      <path d="M-100,1400 L540,1010 L760,1010 L1300,1500" stroke="#a07a52" strokeWidth="10" fill="none" />
      {Array.from({ length: 12 }).map((_, i) => {
        const p = ((t * 1.6 + i / 12) % 1);
        return <rect key={i} x={540 - p * 700 + 120 * p} y={1010 + p * 800} width={20 + p * 160} height={6 + p * 20} fill="#5a3f26" opacity="0.7" />;
      })}
      {/* мальчик */}
      <Figure x={460} y={1480 + thermosY * 0} s={1.9} t={t} legSw={stumble ? 40 : run} armF={stumble ? -80 : -50} armB={stumble ? 60 : 40} tilt={tilt + 8} bob={stumble ? 0 : bob} shirt="#c9573a" pants="#2a2f3f" head={{ hat: "cap", hatC: "#1d2a3a", mood: stumble ? "open" : catchT ? "smile" : "calm", r: 46 }}
        heldF={!stumble && !catchT ? (<g transform="rotate(10)"><rect x="-12" y="-6" width="26" height="80" rx="10" fill="#9aa8b8" stroke="#fff" strokeWidth="3" /><rect x="-12" y="-6" width="26" height="22" rx="6" fill="#3a6aa8" /></g>) : catchT ? (<g><rect x="-12" y="-6" width="26" height="80" rx="10" fill="#9aa8b8" stroke="#fff" strokeWidth="3" /><rect x="-12" y="-6" width="26" height="22" rx="6" fill="#3a6aa8" /></g>) : undefined} />
      {stumble && (<g transform={`translate(${620 + (k - 3.3) * 120} ${1120 + thermosY}) rotate(${(k - 3.3) * 400})`}><rect x="-12" y="-40" width="26" height="80" rx="10" fill="#9aa8b8" stroke="#fff" strokeWidth="3" /><rect x="-12" y="-40" width="26" height="22" rx="6" fill="#3a6aa8" /></g>)}
      {catchT && rise < 1 && (<g stroke="#fff" strokeWidth="6" opacity={1 - rise}>{Array.from({ length: 8 }).map((_, i) => <line key={i} x1={600} y1={1110} x2={600 + Math.cos(i) * (60 + rise * 100)} y2={1110 + Math.sin(i) * (60 + rise * 100)} />)}</g>)}
      {/* трава на переднем плане */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = ((i * 90 - t * 700) % 1500 + 1500) % 1500 - 200;
        return <path key={i} d={`M${x},${H} q10,-120 30,-190 q4,100 30,190Z`} fill="#2d4a2a" opacity="0.9" />;
      })}
    </g>
  );
};

const S3: React.FC<SP> = ({ t, k, d }) => {
  const hand = ease((k - 3.0) / 0.5);
  const cam = 1 + 0.04 * (k / d);
  const mx = interpolate(k, [0, 2.2], [1000, 560], clamp);
  return (
    <g transform={`translate(540 900) scale(${cam}) translate(-540 -900)`}>
      <rect width={W} height={H} fill="#3a2418" />
      <rect x="0" y="0" width={W} height="900" fill="#4a2f20" />
      <rect x="640" y="200" width="300" height="360" rx="20" fill="#16283d" stroke="#6a4a2a" strokeWidth="10" />
      <circle cx="790" cy="380" r="70" fill="#ffe3a0" opacity="0.5" />
      <path d="M640,520 L790,330 L940,520" fill="#243a55" />
      {/* мать */}
      <g>
        <Bust x={mx > 700 ? 560 : 560} y={480} r={70} hat="scarf" hatC="#7a3d5a" mood="smile" shirt="#6a3a58" t={t} />
        <g transform={`translate(${mx - 120} ${940 - Math.sin(Math.min(1, k / 2.2) * Math.PI) * 20})`} opacity={k < 2.4 ? 1 : 1}>
          <rect x="-40" y="-26" width="80" height="26" rx="10" fill="#e9d6c0" /><path d="M-40,-26 q40,-30 80,0" fill="#e9d6c0" />
        </g>
      </g>
      {/* отец и сын */}
      <Bust x={280} y={650} r={105} hat="papakha" hatC="#2b2019" beard="#2a1d16" mood={k > 3 ? "smile" : "calm"} shirt="#34445e" w={1.1} t={t} look={1} />
      <Bust x={800} y={860} r={72} hat="none" hair="#2a1d16" mood={k > 2 ? "smile" : "calm"} shirt="#c9573a" t={t} look={-1} />
      {/* стол */}
      <rect x="0" y="1000" width={W} height="920" fill="#5a3a22" />
      <rect x="0" y="1000" width={W} height="26" fill="#7a5232" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={i * 190 - 40} y={1050 + (i % 2) * 140} width="170" height="8" fill="#3f2816" />)}
      {[160, 400, 680, 900].map((x, i) => (
        <g key={i} transform={`translate(${x} ${1240 + (i % 2) * 200})`}>
          <ellipse cx="0" cy="40" rx="76" ry="20" fill="#00000033" />
          <path d="M-50,-30 L50,-30 L38,40 L-38,40Z" fill="#e9e3d4" stroke="#b8b09c" strokeWidth="4" />
          <path d="M50,-10 q40,10 0,40" fill="none" stroke="#e9e3d4" strokeWidth="8" />
          <path d={`M-14,-50 q-8,-24 0,-48 M14,-50 q8,-24 0,-48`} stroke="#fff" strokeWidth="5" fill="none" opacity={0.5 + 0.3 * Math.sin(t * 3 + i)} strokeDasharray="8 8" />
        </g>
      ))}
      <ellipse cx="540" cy="1640" rx="230" ry="60" fill="#d9a85a" /><ellipse cx="540" cy="1630" rx="200" ry="46" fill="#eec27a" />
      {/* рука отца на плече сына */}
      <g opacity={hand} transform={`translate(${interpolate(hand, [0, 1], [400, 530])} ${interpolate(hand, [0, 1], [930, 985])})`}>
        <rect x="0" y="-30" width="230" height="60" rx="30" fill="#34445e" />
        <ellipse cx="236" cy="0" rx="46" ry="36" fill={SKIN} stroke={SKIN_D} strokeWidth="3" />
      </g>
      <Dust t={t} />
    </g>
  );
};

const S4: React.FC<SP> = ({ t, k, d }) => {
  const clumsy = k < 3.6;
  const beat = Math.abs(Math.sin(t * Math.PI * 3.2));
  const legs = clumsy ? Math.sin(t * 6) * 18 + Math.sin(t * 17) * 12 : Math.sin(t * 10) * 30;
  const arms = clumsy ? -30 + Math.sin(t * 9) * 40 : -95 + Math.sin(t * 5) * 8;
  const tilt = clumsy ? Math.sin(t * 7) * 10 : 0;
  const stand = ease((k - 3.6) / 0.5);
  const clap = Math.abs(Math.sin(t * Math.PI * 3.2));
  return (
    <g>
      <rect width={W} height={H} fill="#2a2433" />
      {/* зеркало */}
      <rect x="70" y="250" width="940" height="820" rx="26" fill="#6a7a8e" stroke="#c9b27a" strokeWidth="14" />
      <rect x="92" y="272" width="896" height="776" rx="14" fill="#3d4a5f" />
      <rect x="92" y="272" width="896" height="776" rx="14" fill="#fff" opacity="0.05" />
      {/* дед в отражении */}
      <g opacity="0.85">
        <Bust x={800} y={640} r={72} hat="papakha" beard="#e6e6e6" old mood={k > 3.4 ? "smile" : "calm"} shirt="#5a4a3a" t={t} />
        <g transform={`translate(${800 - 70 + clap * 40} 840)`}><ellipse cx="0" cy="0" rx="28" ry="22" fill={SKIN} /><ellipse cx={140 - clap * 80} cy="0" rx="28" ry="22" fill={SKIN} /></g>
        {Array.from({ length: 3 }).map((_, i) => <path key={i} d={`M${800 - 130 + i * 10},${740 - i * 12} l-26,-14`} stroke="#ffd36a" strokeWidth="5" opacity={clap > 0.8 ? 1 : 0} />)}
      </g>
      {/* парень в отражении */}
      <g transform="translate(0 0)">
        <Figure x={400} y={1030} s={1.75} t={t} legSw={legs} armF={arms} armB={-arms * 0.9 + (stand > 0 ? -80 : 0)} tilt={tilt} shirt="#c9573a" pants="#1f2430" head={{ hat: "none", hair: "#1a120d", mood: clumsy ? "angry" : "smile", r: 46 }} bob={clumsy ? 0 : beat * 16} />
        {clumsy && <Label x={560} y={430} text="!?" c="#ff6a4a" size={70} />}
      </g>
      {/* пол */}
      <rect x="0" y="1090" width={W} height="830" fill="#4a3322" />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x="0" y={1110 + i * 100} width={W} height="6" fill="#33210f" />)}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={140 + i * 160} cy={1560 + (i % 2) * 90} r={34 + (Math.floor(t * 3.2) % 6 === i ? beat * 14 : 0)} fill={Math.floor(t * 3.2) % 6 === i ? GOLD : "#5e4631"} opacity="0.9" />
      ))}
      {Array.from({ length: 14 }).map((_, i) => {
        const h = 30 + Math.abs(Math.sin(t * 7 + i * 1.3)) * 120 * (0.4 + beat);
        return <rect key={i} x={50 + i * 70} y={1900 - h} width="46" height={h} rx="8" fill={i % 2 ? "#ffb04a" : "#ff7a3a"} opacity="0.85" />;
      })}
      <Dust t={t} c="#ffe6a8" />
    </g>
  );
};

const S5: React.FC<SP> = ({ t, k, d }) => {
  const turn = k > 4;
  const walk = Math.sin(t * 9) * 26;
  const bob = Math.abs(Math.sin(t * 9)) * 10;
  const ghostO = interpolate(k, [0.5, 1.2, 4.6, 6], [0, 0.7, 0.7, 0.0], clamp);
  const lean = turn ? 0 : 7;
  return (
    <g>
      <defs><linearGradient id="s5g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1f38" /><stop offset="1" stopColor="#3a2a44" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#s5g)" />
      {/* дальние дома */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = ((i * 190 - t * 30) % 1900 + 1900) % 1900 - 200;
        const h = 500 + hash(i) * 500;
        return (<g key={i}><rect x={x} y={1200 - h} width="170" height={h} fill="#141a2e" />{Array.from({ length: Math.floor(h / 70) }).map((_, r) => <rect key={r} x={x + 20} y={1200 - h + 24 + r * 70} width="30" height="36" fill={hash(i * 9 + r) < 0.4 ? "#ffd36a" : "#1c2440"} />)}</g>);
      })}
      {/* витрина */}
      <rect x="0" y="560" width={W} height="800" fill="#27304e" stroke="#4a5a8a" strokeWidth="12" />
      <rect x="40" y="600" width="1000" height="720" fill="#34406a" opacity="0.8" />
      <text x="540" y="700" textAnchor="middle" fontSize="70" fontWeight="900" fill="#ff5a8a" fontFamily={FONT} letterSpacing="10" opacity={0.6 + 0.4 * Math.abs(Math.sin(t * 5))}>МЕГАПОЛИС</text>
      {/* отражение деда */}
      <g opacity={ghostO} transform={`translate(${540 + 220 + Math.sin(t * 0.3) * 4} 0)`}>
        <Figure x={0} y={1300} s={1.6} t={t} legSw={walk} armF={-walk * 0.6} armB={walk * 0.6} shirt="#5a4a3a" pants="#2a2a30" head={{ hat: "papakha", beard: "#e6e6e6", old: true, mood: "smile" }} />
      </g>
      {/* парень */}
      <Figure x={540} y={1330} s={1.6} t={t} legSw={walk} armF={-walk * 0.6} armB={walk * 0.6} tilt={lean} bob={bob} shirt="#c9573a" pants="#1f2430" head={{ hat: "none", hair: "#1a120d", mood: turn ? "smile" : "calm", look: turn ? -2 : 1 }} />
      <rect x="474" y="1070" width="56" height="110" rx="14" fill="#2f4a3a" />
      <path d="M520,1020 Q540,990 560,1020" stroke="#222" strokeWidth="10" fill="none" />
      {/* тротуар и дорога */}
      <rect x="0" y="1340" width={W} height="580" fill="#22222c" />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={((i * 240 - t * 500) % 2400 + 2400) % 2400 - 200} y="1640" width="150" height="14" fill="#cfcfd8" />)}
      {Array.from({ length: 3 }).map((_, i) => {
        const x = ((t * (500 + i * 140) + i * 400) % 1700) - 300;
        return (<g key={i} transform={`translate(${i % 2 ? 1080 - x : x} ${1560 + i * 110})`}><rect x="-130" y="-34" width="260" height="68" rx="26" fill="#14141a" /><circle cx={i % 2 ? -125 : 125} cy="0" r="14" fill="#ffe9a0" /><circle cx={i % 2 ? -125 : 125} cy="0" r="60" fill="#ffe9a0" opacity="0.25" /></g>);
      })}
      <Dust t={t} c="#b8c8ff" />
    </g>
  );
};

const S6: React.FC<SP> = ({ t, k, d }) => {
  const hug = ease((k - 5.3) / 1.0);
  const fixing = k < 3.6;
  const wing = fixing ? 38 : 0;
  const glow = 0.8 + 0.2 * Math.sin(t * 12);
  return (
    <g>
      <rect width={W} height={H} fill="#10131f" />
      {/* аул вдалеке */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = i * 130 - 30;
        const h = 150 + hash(i + 3) * 260;
        return (<g key={i}><rect x={x} y={760 - h} width="110" height={h} fill="#1a1d2e" /><path d={`M${x},${760 - h} L${x + 55},${760 - h - 70} L${x + 110},${760 - h}Z`} fill="#161827" /><rect x={x + 40} y={760 - h + 40} width="24" height="36" fill={hash(i) < 0.4 ? "#ffcf6a" : "#202540"} /></g>);
      })}
      <rect x="0" y="760" width={W} height={H - 760} fill="#171b27" />
      <circle cx="540" cy="1340" r={560 * glow} fill="#ff8a2a" opacity="0.18" />
      {/* отец */}
      <g transform={`translate(${-hug * 40} 0)`}>
        <Bust x={300} y={790} r={100} hat="papakha" hatC="#2b2019" beard="#2a1d16" mood={k > 4 ? "smile" : "calm"} shirt="#34445e" w={1.1} t={t} look={1} />
      </g>
      {/* сын */}
      <g transform={`translate(${-hug * 150} ${-hug * 20})`}>
        <Bust x={800} y={950} r={68} hat="none" hair="#2a1d16" mood={k > 2 && k < 4 ? "sad" : "smile"} shirt="#c9573a" t={t} look={-1} />
      </g>
      {/* объятие */}
      <g opacity={hug}>
        <rect x="240" y="1020" width="480" height="100" rx="50" fill="#34445e" transform="rotate(-6 480 1070)" />
        <ellipse cx="710" cy="1120" rx="52" ry="42" fill={SKIN} />
      </g>
      {/* руки с орлом */}
      <g transform={`translate(0 ${hug * 40})`}>
        <ellipse cx="420" cy="1180" rx="200" ry="70" fill="#c98f68" />
        <path d="M200,1260 Q430,1150 650,1260 L650,1340 L200,1340Z" fill="#34445e" opacity="0.0" />
        <g transform="translate(420 1130)">
          <path d="M-80,0 Q0,-40 80,0 Q0,30 -80,0Z" fill="#7a5232" />
          <g transform="rotate(-8)"><path d={`M-10,-4 L-170,${-60 + wing} L-110,10Z`} fill="#8a6038" stroke="#4a3018" strokeWidth="4" /><path d={`M10,-4 L170,-60 L110,10Z`} fill="#8a6038" stroke="#4a3018" strokeWidth="4" /></g>
          <circle cx="70" cy="-8" r="22" fill="#7a5232" /><path d="M88,-8 l26,6 l-26,6Z" fill="#ffd36a" />
          {fixing && <g transform={`translate(${-140 + Math.sin(t * 14) * 8} ${-50 + wing * 0.2})`}><rect x="-6" y="-30" width="12" height="46" rx="4" fill="#9aa8b8" transform="rotate(30)" /></g>}
        </g>
        <ellipse cx="430" cy="1225" rx="210" ry="40" fill="#e2b189" opacity="0.0" />
        <ellipse cx="560" cy="1130" rx="60" ry="46" fill={SKIN} /><ellipse cx="300" cy="1140" rx="60" ry="46" fill={SKIN} />
      </g>
      {/* костёр */}
      <Fire x={540} y={1790} s={2.0} t={t} />
      <Sparks x={540} y={1560} t={t} n={24} />
      <Dust t={t} c="#ffb04a" />
    </g>
  );
};

const Eagle: React.FC<{ x: number; y: number; s: number; t: number; rot?: number; real?: boolean }> = ({ x, y, s, t, rot = 0, real }) => {
  const flap = Math.sin(t * (real ? 4.5 : 9)) * 28;
  const c = real ? "#3a2a1c" : "#8a6038";
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <g transform={`rotate(${-flap} -10 0)`}><path d="M-10,0 Q-120,-80 -300,-50 Q-200,-20 -170,10 Q-120,0 -10,20Z" fill={c} stroke={real ? "#1d140c" : "#4a3018"} strokeWidth="4" /></g>
      <g transform={`rotate(${flap} 10 0)`}><path d="M10,0 Q120,-80 300,-50 Q200,-20 170,10 Q120,0 10,20Z" fill={c} stroke={real ? "#1d140c" : "#4a3018"} strokeWidth="4" /></g>
      <ellipse cx="0" cy="14" rx="46" ry="30" fill={c} />
      <circle cx="46" cy="0" r="20" fill={real ? "#e8e0d0" : c} />
      <path d="M62,-2 l28,8 l-28,8Z" fill={GOLD} />
      <path d="M-40,22 l-70,34 l30,-34Z" fill={c} />
    </g>
  );
};

const S7: React.FC<SP> = ({ t, k, d }) => {
  const toy = k < 4.0;
  const launch = ease((k - 1.6) / 1.8);
  const reveal = ease((k - 3.9) / 0.5);
  const logo = ease((k - 6.0) / 0.8);
  return (
    <g>
      <defs>
        <linearGradient id="s7a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6b878" /><stop offset="0.5" stopColor="#e07a6a" /><stop offset="1" stopColor="#4a4468" /></linearGradient>
        <linearGradient id="s7b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7ac0f0" /><stop offset="0.6" stopColor="#f0e0b0" /><stop offset="1" stopColor="#e08a5a" /></linearGradient>
      </defs>
      {toy ? (
        <g>
          <rect width={W} height={H} fill="url(#s7a)" />
          <Mountains base={1100} t={t} shift={t * 20} />
          <rect x="0" y="1180" width={W} height={H - 1180} fill="#3a4a2a" />
          <Figure x={400} y={1700} s={2.4} t={t} armF={interpolate(k, [0, 1.6, 2.2], [-60, -80, -130], clamp)} armB={10} shirt="#c9573a" head={{ hat: "none", hair: "#2a1d16", mood: "smile", look: 2 }}
            heldF={k < 2.4 ? (<g transform="translate(0 -20)"><path d="M-40,0 Q0,-24 40,0 Q0,16 -40,0Z" fill="#8a6038" /><path d="M-10,-2 L-90,-30 L-60,6Z" fill="#8a6038" /><path d="M10,-2 L90,-30 L60,6Z" fill="#8a6038" /></g>) : undefined} />
          <Eagle x={interpolate(launch, [0, 1], [640, 860])} y={interpolate(launch, [0, 1], [1100, 420])} s={interpolate(launch, [0, 1], [0.35, 0.8])} t={t} rot={-14} />
          {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={600 + i * 50} y1={1100} x2={500 + i * 50} y2={1100 + 260 * launch} stroke="#fff" strokeWidth="4" opacity={0.35 * launch} />)}
        </g>
      ) : (
        <g>
          <rect width={W} height={H} fill="url(#s7b)" />
          <circle cx="780" cy="500" r="170" fill="#fff3c8" opacity="0.8" />
          <Mountains base={1180} t={t} shift={t * 40} />
          {/* аул с башнями */}
          {Array.from({ length: 7 }).map((_, i) => {
            const x = 40 + i * 150;
            const h = 160 + hash(i + 20) * 230;
            return (<g key={i}><rect x={x} y={1300 - h} width="110" height={h} fill="#6a5a50" stroke="#3a2e28" strokeWidth="4" /><path d={`M${x - 6},${1300 - h} l12,-18 l12,18 l12,-18 l12,18 l12,-18 l12,18 l12,-18 l12,18Z`} fill="#6a5a50" /><rect x={x + 40} y={1300 - h + 50} width="26" height="42" fill="#2a1f1a" /></g>);
          })}
          <rect x="0" y="1300" width={W} height={H - 1300} fill="#3d4a2a" />
          <g opacity={reveal}>
            <Eagle x={interpolate(k, [3.9, 12], [300, 760])} y={interpolate(k, [3.9, 12], [1000, 360])} s={interpolate(k, [3.9, 12], [0.9, 1.5])} t={t} rot={-10} real />
          </g>
          <rect width={W} height={H} fill="#fff" opacity={Math.max(0, 1 - (k - 3.9) / 0.25) * 0.8} />
          {/* логотип */}
          <g opacity={logo} transform={`translate(540 1500) scale(${0.85 + 0.15 * logo})`}>
            <rect x="-330" y="-120" width="660" height="240" rx="40" fill="#14100c" opacity="0.7" stroke={GOLD} strokeWidth="6" />
            <path d="M-250,60 q40,-90 0,-150 M-250,60 q-50,-40 -90,-30 M-250,60 q40,-30 90,-40" stroke={GOLD} strokeWidth="8" fill="none" strokeLinecap="round" />
            <text x="40" y="35" textAnchor="middle" fontSize="130" fontWeight="900" fill="#fff" fontFamily={FONT} letterSpacing="8">КОРНИ</text>
          </g>
        </g>
      )}
    </g>
  );
};

const Label: React.FC<{ x: number; y: number; text: string; c?: string; size?: number }> = ({ x, y, text, c = "#fff", size = 56 }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="900" fill={c} fontFamily={FONT} stroke="#000" strokeWidth="8" style={{ paintOrder: "stroke" }}>{text}</text>
);

const SCENES = [S1, S2, S3, S4, S5, S6, S7];

/* ---------- интерфейс ---------- */
const Header: React.FC<{ t: number; idx: number }> = ({ t, idx }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: 150, fontFamily: FONT, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: GOLD, opacity: Math.sin(t * 5) > 0 ? 1 : 0.3 }} />
      <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", textShadow: "0 3px 10px #000", letterSpacing: 3 }}>КОРНИ</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, letterSpacing: 4 }}>0:{String(Math.floor(t)).padStart(2, "0")}</div>
    </div>
    <div style={{ position: "absolute", right: 40, top: 160, display: "flex", gap: 8 }}>
      {SCENE_STARTS.map((_, i) => <div key={i} style={{ width: 28, height: 8, borderRadius: 4, background: i <= idx ? GOLD : "#ffffff44" }} />)}
    </div>
  </>
);

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const line = lineAt(t);
  if (!line) return null;
  const words = line.text.split(" ");
  const prog = Math.min(1, Math.max(0, (t - line.start) / line.dur));
  const idx = Math.floor(prog * words.length * 1.04);
  const col = WHO_COLOR[line.who];
  const o = interpolate(t, [line.start, line.start + 0.08], [0, 1], clamp);
  const pop = interpolate(t, [line.start, line.start + 0.12], [1.12, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 1130, padding: "22px 30px", borderRadius: 30, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.6) 22%, rgba(0,0,0,.6) 78%, rgba(0,0,0,0))", textAlign: "center", fontFamily: FONT, opacity: o, transform: `scale(${pop})` }}>
      {line.who !== "titr" && <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 6, color: col, marginBottom: 8 }}>{WHO_NAME[line.who]}</div>}
      <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.1, textShadow: "0 4px 18px rgba(0,0,0,.95), 0 0 6px rgba(0,0,0,.9)" }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: i === idx ? col : i < idx ? "#fff" : "rgba(255,255,255,.5)" }}>{w}{" "}</span>
        ))}
      </div>
    </div>
  );
};

/* ---------- звук ---------- */
const Audios: React.FC = () => {
  const S = (s: number) => Math.max(0, Math.round(s * FPS));
  const A = (f: string) => staticFile(`korni/${f}`);
  const sfx = (key: string, from: number, dur: number, f: string, vol: number, loop = false) => (
    <Sequence key={key} from={S(from)} durationInFrames={S(dur)}>
      <Audio src={A(f)} volume={vol} loop={loop} />
    </Sequence>
  );
  const items: React.ReactNode[] = [
    sfx("wind", 0, 62, "sfx-wind.mp3", 0.3, true),
    sfx("fire1", 0, 8, "sfx-fire.mp3", 0.6, true),
    sfx("cand1", 3.0, 2.0, "x-candle.mp3", 0.4),
    sfx("run2", 8.2, 4.2, "sfx-run.mp3", 0.7, true),
    sfx("thermos", 11.4, 1.5, "x-thermos.mp3", 1.0),
    sfx("crowd3", 16.0, 8, "x-crowd.mp3", 0.2, true),
    sfx("drum4", 24.2, 7.6, "x-drum.mp3", 1.0, true),
    sfx("laugh4", 29.9, 1.6, "x-laugh.mp3", 0.9),
    sfx("crowd5", 32.0, 8, "x-crowd.mp3", 0.45, true),
    sfx("steps5", 32.2, 7.8, "x-steps.mp3", 0.5, true),
    sfx("fire6", 40.0, 8, "sfx-fire.mp3", 0.7, true),
    sfx("heart6", 49.0, 0.1, "sfx-heart.mp3", 0.0),
    sfx("eagle7", 52.0, 3.0, "x-eagle.mp3", 1.0),
    sfx("eagle7b", 56.2, 3.0, "x-eagle.mp3", 0.6),
    sfx("whoosh7", 51.7, 1.3, "x-whoosh.mp3", 0.8),
  ];
  SCENE_STARTS.slice(1).forEach((s, i) => items.push(sfx(`w${i}`, s - 0.25, 1.3, "x-whoosh.mp3", 0.45)));
  return (
    <>
      {items}
      {LINES.map((l) => (
        <Sequence key={l.id} from={S(l.start)} durationInFrames={Math.ceil((l.dur + 0.4) * FPS)}>
          <Audio src={A(l.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

const KICKS = [12.6, 3.0, 19.0, 19.5, 27.3, 36.5, 52.0, 51.7, 45.2, 8, 16, 24, 32, 40, 48];

export const Korni: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = 0;
  SCENE_STARTS.forEach((s, i) => { if (t >= s) idx = i; });
  const sceneStart = SCENE_STARTS[idx];
  const sceneEnd = idx < SCENE_STARTS.length - 1 ? SCENE_STARTS[idx + 1] : DURATION_SEC;
  const k = t - sceneStart;
  const d = sceneEnd - sceneStart;
  const Scene = SCENES[idx];

  const kick = Math.max(0, ...KICKS.map((q) => (t >= q && t < q + 0.4 ? 1 - (t - q) / 0.4 : 0)));
  const flash = k < 0.12 ? 1 - k / 0.12 : 0;
  const amp = 1 + kick * 14 + (idx === 3 ? Math.abs(Math.sin(t * Math.PI * 3.2)) * 3 : 0);
  const dx = Math.sin(frame * 1.7) * amp * 0.7;
  const dy = Math.cos(frame * 1.3) * amp * 0.7;
  const zoom = 1.02 + kick * 0.04 + 0.01 * Math.sin(t * 1.3);
  const fadeIn = interpolate(t, [0, 0.3], [0, 1], clamp);
  const fadeOut = interpolate(t, [DURATION_SEC - 0.8, DURATION_SEC], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0a0f" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: Math.min(fadeIn, fadeOut) }}>
        <div style={{ transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: "50% 45%" }}>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            <Scene t={t} k={k} d={d} />
            <rect width={W} height={H} fill="#fff" opacity={flash * 0.22} />
            <defs>
              <radialGradient id="vigk"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.5" /></radialGradient>
            </defs>
            <rect width={W} height={H} fill="url(#vigk)" />
          </svg>
        </div>
      </div>
      <Header t={t} idx={idx} />
      <Subtitle t={t} />
      <Audios />
    </AbsoluteFill>
  );
};
