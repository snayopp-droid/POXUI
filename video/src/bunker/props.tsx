import React from "react";
import { C, W, H, Txt, Glow, Lamp, Dust, cl, lerp, ramp, eio, FONT } from "./art";

/* ───── предметы (x,y — нижний левый/центр основания, оговорено у каждого) ───── */
export const Can: React.FC<{ x: number; y: number; c?: string; w?: number; h?: number }> = ({ x, y, c = "#b8553a", w = 34, h = 44 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={3} fill={c} />
    <rect x={-w / 2} y={-h * 0.62} width={w} height={h * 0.26} fill="#e8dcc0" />
    <rect x={-w / 2} y={-h} width={w} height={4} fill="#ffffff30" />
    <ellipse cx={0} cy={-h} rx={w / 2} ry={3} fill="#c9c9c0" />
  </g>
);
export const Jug: React.FC<{ x: number; y: number; s?: number; fill?: number }> = ({ x, y, s = 1, fill = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-30} y={-90} width={60} height={90} rx={10} fill="#8fc4e0" opacity={0.55} stroke="#d8eef8" strokeWidth={3} />
    <rect x={-27} y={-90 * fill} width={54} height={90 * fill - 3} rx={8} fill="#4a9ac8" opacity={0.7} />
    <rect x={-12} y={-104} width={24} height={16} rx={3} fill="#d8eef8" />
    <path d="M 26 -76 Q 46 -66 26 -50" stroke="#d8eef8" strokeWidth={5} fill="none" />
  </g>
);
export const Sack: React.FC<{ x: number; y: number; label?: string }> = ({ x, y, label = "RICE" }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M -34 0 Q -42 -50 -30 -80 L 30 -80 Q 42 -50 34 0 Z" fill="#c9b48a" />
    <path d="M -30 -80 Q 0 -96 30 -80 Z" fill="#b8a478" />
    <rect x={-22} y={-52} width={44} height={22} fill="#e8dcc0" />
    <Txt x={0} y={-36} size={15} c="#5a4a30" w={800}>{label}</Txt>
  </g>
);
export const Barrel: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = "#3a6a8a" }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-40} y={-110} width={80} height={110} rx={8} fill={c} />
    {[-80, -50, -20].map((q) => <rect key={q} x={-40} y={q} width={80} height={5} fill="#00000030" />)}
    <rect x={-40} y={-110} width={80} height={10} rx={4} fill="#ffffff22" />
    <circle cx={14} cy={-96} r={6} fill="#c9c9c0" />
  </g>
);
export const Jar: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = "#e8a83a" }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-18} y={-46} width={36} height={46} rx={6} fill={c} opacity={0.85} />
    <rect x={-20} y={-54} width={40} height={10} rx={3} fill="#8a6a45" />
    <rect x={-13} y={-34} width={26} height={16} fill="#e8dcc0" opacity={0.8} />
  </g>
);

export const Shelf: React.FC<{ x: number; y: number; w?: number; rows?: number; fill?: number; kind?: "cans" | "mixed" }> = ({ x, y, w = 420, rows = 4, fill = 1, kind = "cans" }) => (
  <g transform={`translate(${x},${y})`}>
    {[0, w].map((q) => <rect key={q} x={q - 6} y={-rows * 110} width={12} height={rows * 110 + 6} fill={C.metalD} />)}
    {Array.from({ length: rows }, (_, r) => {
      const by = -r * 110;
      const cols = Math.floor(w / 40);
      return (
        <g key={r}>
          <rect x={-6} y={by} width={w + 12} height={8} fill={C.metal} />
          {Array.from({ length: cols }, (_, c) => {
            const k = (r * 13 + c * 7) % 11;
            const show = (c + r * 3) / (cols + rows * 3) < fill;
            if (!show) return null;
            const col = ["#b8553a", "#c9a14a", "#5a8a5a", "#8a6a45", "#a8483a", "#7a8a5a"][k % 6];
            if (kind === "mixed" && k % 5 === 0) return <Jar key={c} x={30 + c * 38} y={by} c={k % 2 ? "#e8a83a" : "#c9c0a0"} />;
            return <Can key={c} x={26 + c * 38} y={by} c={col} h={36 + (k % 3) * 8} />;
          })}
        </g>
      );
    })}
  </g>
);

export const Bunk: React.FC<{ x: number; y: number; occupied?: boolean; blanket?: string }> = ({ x, y, blanket = "#6a4a5a" }) => (
  <g transform={`translate(${x},${y})`}>
    {[0, 300].map((q) => <rect key={q} x={q - 8} y={-330} width={16} height={336} fill={C.metalD} />)}
    {[0, 1].map((r) => (
      <g key={r} transform={`translate(0,${-r * 150})`}>
        <rect x={-8} y={-96} width={316} height={14} fill={C.metal} />
        <rect x={0} y={-130} width={300} height={34} rx={8} fill={r ? blanket : "#4a5a7a"} />
        <rect x={10} y={-146} width={70} height={22} rx={10} fill="#d8d0c0" />
      </g>
    ))}
    <rect x={-8} y={-330} width={316} height={10} fill={C.metal} />
  </g>
);

export const Table: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 520 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-170} width={w} height={22} rx={4} fill={C.woodL} />
    <rect x={-w / 2} y={-148} width={w} height={8} fill={C.woodD} />
    {[-w / 2 + 30, w / 2 - 44].map((q) => <rect key={q} x={q} y={-148} width={14} height={150} fill={C.woodD} />)}
  </g>
);
export const Stool: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-34} y={-86} width={68} height={14} rx={4} fill={C.woodL} />
    {[-26, 18].map((q) => <rect key={q} x={q} y={-72} width={8} height={74} fill={C.woodD} />)}
  </g>
);

export const Radio: React.FC<{ x: number; y: number; t?: number; on?: boolean; crank?: number }> = ({ x, y, t = 0, on, crank = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-120} y={-150} width={240} height={150} rx={10} fill="#4a5a3a" />
    <rect x={-120} y={-150} width={240} height={14} rx={6} fill="#ffffff18" />
    <rect x={-100} y={-128} width={150} height={52} rx={4} fill="#d8c890" />
    {[-90, -60, -30, 0, 30, 60, 90].map((q) => <rect key={q} x={q - 30} y={-128} width={1.5} height={on ? 18 : 12} fill="#5a4a30" />)}
    <rect x={-20 + Math.sin(t * 0.9) * (on ? 30 : 0)} y={-128} width={3} height={52} fill={C.red} />
    <circle cx={86} cy={-100} r={22} fill="#2a2e26" /><circle cx={86} cy={-100} r={16} fill="#3a4034" />
    <rect x={84} y={-116} width={4} height={14} fill="#c9c9c0" transform={`rotate(${t * 20} 86 -100)`} />
    <circle cx={-90} cy={-40} r={14} fill="#2a2e26" /><circle cx={-50} cy={-40} r={14} fill="#2a2e26" />
    <circle cx={96} cy={-40} r={7} fill={on ? "#7fe08a" : "#2a3a2a"} />
    <rect x={-70} y={-60} width={110} height={30} rx={3} fill="#2a2e26" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-64 + i * 13} y={-56} width={7} height={22} fill="#3a4034" />)}
    {/* антенна и ручка */}
    <line x1={90} y1={-150} x2={130} y2={-290} stroke="#c9c9c0" strokeWidth={4} />
    <g transform={`translate(124,-70) rotate(${crank})`}><rect x={-4} y={-4} width={50} height={8} rx={4} fill="#c9a14a" /><circle cx={46} cy={0} r={9} fill="#8a6a45" /></g>
  </g>
);

export const Geiger: React.FC<{ x: number; y: number; v?: number; t?: number; s?: number }> = ({ x, y, v = 0.2, t = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-70} y={-120} width={140} height={120} rx={12} fill="#a8883a" />
    <rect x={-58} y={-108} width={116} height={64} rx={6} fill="#e8e0c0" />
    <path d="M -44 -52 A 44 44 0 0 1 44 -52" stroke="#2a2a2a" strokeWidth={3} fill="none" />
    <path d="M 20 -80 A 44 44 0 0 1 44 -52" stroke={C.red} strokeWidth={5} fill="none" />
    <g transform={`rotate(${lerp(-62, 62, cl(v))} 0 -52)`}><line x1={0} y1={-52} x2={0} y2={-96} stroke={C.red} strokeWidth={3} /></g>
    <circle cx={0} cy={-52} r={5} fill="#2a2a2a" />
    <circle cx={-34} cy={-24} r={9} fill="#2a2a2a" />
    <rect x={-6} y={-30} width={46} height={12} rx={3} fill="#3a3a3a" />
    <rect x={Math.sin(t * 9) > 0.7 ? 46 : 44} y={-36} width={8} height={8} fill={Math.sin(t * 9) > 0.7 ? "#ff6a4a" : "#6a3a2a"} />
    <rect x={-20} y={-136} width={40} height={18} rx={4} fill="#5a5a50" />
  </g>
);

export const Notebook: React.FC<{ x: number; y: number; rot?: number; lines?: string[]; p?: number; s?: number }> = ({ x, y, rot = 0, lines = [], p = 1, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-80} width={240} height={160} rx={6} fill="#6a4a2a" />
    <rect x={-114} y={-74} width={228} height={148} rx={4} fill={C.paper} />
    <line x1={0} y1={-74} x2={0} y2={74} stroke="#00000030" strokeWidth={3} />
    {lines.map((l, i) => (
      <Txt key={i} x={-100} y={-44 + i * 28} size={20} c="#2a3a5a" w={600} anchor="start" o={ramp(p, i / (lines.length + 1), (i + 1) / (lines.length + 1))} italic>{l}</Txt>
    ))}
  </g>
);

export const Clock: React.FC<{ x: number; y: number; r?: number; t?: number; speed?: number }> = ({ x, y, r = 50, t = 0, speed = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#e8e0c8" stroke="#2a2a2a" strokeWidth={5} />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-r + 6} x2={0} y2={-r + (i % 3 ? 11 : 16)} stroke="#2a2a2a" strokeWidth={3} transform={`rotate(${i * 30})`} />)}
    <line x1={0} y1={0} x2={0} y2={-r * 0.6} stroke="#2a2a2a" strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 4 * speed})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.85} stroke="#8a2a2a" strokeWidth={3} strokeLinecap="round" transform={`rotate(${t * 48 * speed})`} />
    <circle r={4} fill="#2a2a2a" />
  </g>
);

export const Tally: React.FC<{ x: number; y: number; n: number; p?: number; cols?: number }> = ({ x, y, n, p = 1, cols = 6 }) => {
  const total = Math.floor(n * cl(p));
  const groups = Math.ceil(total / 5);
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: groups }, (_, g) => {
        const cnt = Math.min(5, total - g * 5), gx = (g % cols) * 64, gy = Math.floor(g / cols) * 64;
        return (
          <g key={g} transform={`translate(${gx},${gy})`} stroke={C.chalk} strokeWidth={4} strokeLinecap="round" opacity={0.85}>
            {Array.from({ length: Math.min(4, cnt) }, (_, i) => <line key={i} x1={i * 11} y1={0} x2={i * 11 + 1} y2={46} />)}
            {cnt >= 5 && <line x1={-6} y1={36} x2={50} y2={8} />}
          </g>
        );
      })}
    </g>
  );
};

export const Hatch: React.FC<{ x: number; y: number; open?: number; wheel?: number; s?: number }> = ({ x, y, open = 0, wheel = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={120} ry={30} fill="#6a6f68" />
    <ellipse cx={0} cy={-6} rx={104} ry={24} fill="#3a3e38" />
    <g transform={`translate(0,${-6}) scale(1,${lerp(1, 0.2, open)}) translate(${open * 90},0)`}>
      <ellipse cx={0} cy={0} rx={96} ry={22} fill="#58605a" stroke="#2a2e2a" strokeWidth={4} />
      <g transform={`rotate(${wheel})`}>
        <circle r={14} fill="#2a2e2a" />
        {[0, 90, 180, 270].map((a) => <rect key={a} x={-3} y={-34} width={6} height={22} fill="#c9a14a" transform={`rotate(${a})`} />)}
      </g>
    </g>
  </g>
);

export const BlastDoor: React.FC<{ x: number; y: number; wheel?: number; open?: number; s?: number }> = ({ x, y, wheel = 0, open = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-170} y={-420} width={340} height={420} fill="#2a2e2c" />
    <rect x={-150} y={-400} width={300} height={400} fill="#0e1210" />
    <g transform={`translate(${-150 + open * 40},0) scale(${1 - open * 0.7},1)`}>
      <rect x={0} y={-400} width={300} height={400} fill="#58655f" stroke="#2a3330" strokeWidth={6} />
      {[40, 120, 200, 280].map((q) => <g key={q}><circle cx={14} cy={-370 + (q % 3) * 60 + 20} r={6} fill="#2a3330" /><circle cx={286} cy={-370 + (q % 3) * 60 + 20} r={6} fill="#2a3330" /></g>)}
      <g transform={`translate(150,-210) rotate(${wheel})`}>
        <circle r={62} fill="none" stroke="#c9a14a" strokeWidth={10} />
        <circle r={14} fill="#c9a14a" />
        {[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={0} y1={0} x2={0} y2={-62} stroke="#c9a14a" strokeWidth={8} transform={`rotate(${a})`} />)}
      </g>
      <rect x={90} y={-90} width={120} height={14} fill="#c64a3a" />
      <Txt x={150} y={-340} size={26} c="#d8d0b0" w={800} ls={4}>SHELTER</Txt>
    </g>
  </g>
);

export const Ladder: React.FC<{ x: number; y0: number; y1: number }> = ({ x, y0, y1 }) => (
  <g>
    {[-26, 26].map((q) => <rect key={q} x={x + q - 4} y={y0} width={8} height={y1 - y0} fill="#8a8f88" />)}
    {Array.from({ length: Math.floor((y1 - y0) / 44) }, (_, i) => <rect key={i} x={x - 26} y={y0 + 20 + i * 44} width={52} height={7} fill="#a8aca4" />)}
  </g>
);

export const Gauge: React.FC<{ x: number; y: number; v: number; label?: string; r?: number; warn?: number }> = ({ x, y, v, label = "CO2", r = 70, warn = 0.7 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r + 8} fill="#2a2e2c" />
    <circle r={r} fill="#e8e0c8" />
    <path d={`M ${-r * 0.8} ${r * 0.1} A ${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.8} ${r * 0.1}`} stroke="#2a2a2a" strokeWidth={3} fill="none" />
    <path d={`M ${Math.cos(Math.PI * (1 - warn)) * r * 0.8} ${-Math.sin(Math.PI * (1 - warn)) * r * 0.8 + r * 0.1} A ${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.8} ${r * 0.1}`} stroke={C.red} strokeWidth={8} fill="none" />
    <g transform={`rotate(${lerp(-70, 70, cl(v))} 0 ${r * 0.1})`}><line x1={0} y1={r * 0.1} x2={0} y2={-r * 0.7} stroke={C.red} strokeWidth={4} strokeLinecap="round" /></g>
    <circle cy={r * 0.1} r={6} fill="#2a2a2a" />
    <Txt x={0} y={r * 0.62} size={r * 0.28} c="#2a2a2a" w={800}>{label}</Txt>
  </g>
);

export const Fan: React.FC<{ x: number; y: number; r?: number; t?: number; speed?: number }> = ({ x, y, r = 80, t = 0, speed = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-r - 14} y={-r - 14} width={2 * r + 28} height={2 * r + 28} rx={10} fill="#3a4642" />
    <circle r={r} fill="#1a201e" />
    <g transform={`rotate(${t * 380 * speed})`}>
      {[0, 72, 144, 216, 288].map((a) => <path key={a} d={`M 0 0 Q ${r * 0.5} ${-r * 0.2} ${r * 0.9} ${-r * 0.1} Q ${r * 0.5} ${r * 0.3} 0 0`} fill="#6f7f7a" transform={`rotate(${a})`} />)}
      <circle r={10} fill="#2a2e2c" />
    </g>
    <circle r={r} fill="none" stroke="#9aaaa4" strokeWidth={3} />
    {[0, 45, 90, 135].map((a) => <line key={a} x1={-r} y1={0} x2={r} y2={0} stroke="#9aaaa4" strokeWidth={2} transform={`rotate(${a})`} />)}
  </g>
);

export const FilterCan: React.FC<{ x: number; y: number; c?: string; w?: number; h?: number }> = ({ x, y, c = "#4a6a8a", w = 90, h = 150 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx={14} fill={c} />
    <rect x={-w / 2} y={-h * 0.7} width={w} height={h * 0.16} fill="#e8dcc0" />
    <rect x={-w / 2 + 8} y={-h} width={10} height={h} fill="#ffffff22" />
    <rect x={-w * 0.3} y={-h - 18} width={w * 0.6} height={20} rx={4} fill="#9aaaa4" />
  </g>
);

export const Pipe: React.FC<{ pts: [number, number][]; w?: number; c?: string }> = ({ pts, w = 22, c = "#7a8a84" }) => (
  <g>
    <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#2a3330" strokeWidth={w + 6} strokeLinejoin="round" strokeLinecap="round" />
    <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />
  </g>
);

export const Plant: React.FC<{ x: number; y: number; g?: number; c?: string; mush?: boolean }> = ({ x, y, g = 1, c = "#5aa06a", mush }) => (
  <g transform={`translate(${x},${y})`}>
    {mush ? (
      <g>{[-18, 0, 20].map((q, i) => <g key={q}><rect x={q - 3} y={-24 * g - i * 2} width={6} height={24 * g} fill="#e8dcc0" /><ellipse cx={q} cy={-24 * g - i * 2} rx={14 * g} ry={8 * g} fill="#c9a888" /></g>)}</g>
    ) : (
      <g>{[-30, -14, 0, 14, 30].map((q, i) => <path key={q} d={`M ${q * 0.3} 0 Q ${q} ${-40 * g} ${q * 1.2} ${-(52 + (i % 2) * 18) * g}`} stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" />)}
        {[-30, 0, 30].map((q, i) => <ellipse key={q} cx={q * 1.2} cy={-(52 + (i % 2) * 18) * g} rx={13 * g} ry={8 * g} fill={c} />)}</g>
    )}
  </g>
);

export const FishTank: React.FC<{ x: number; y: number; t?: number }> = ({ x, y, t = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-120} y={-150} width={240} height={150} rx={8} fill="#3a7a9a" opacity={0.6} stroke="#cfe8f0" strokeWidth={4} />
    <rect x={-116} y={-110} width={232} height={106} fill="#4a9ac0" opacity={0.5} />
    {[0, 1, 2].map((i) => {
      const fx = Math.sin(t * (0.8 + i * 0.3) + i * 2) * 80, fy = -50 - i * 22 + Math.sin(t * 1.4 + i) * 6, dir = Math.cos(t * (0.8 + i * 0.3) + i * 2) > 0 ? 1 : -1;
      return <g key={i} transform={`translate(${fx},${fy}) scale(${dir},1)`}><ellipse rx={16} ry={9} fill="#e8a040" /><path d="M -14 0 L -26 -8 L -26 8 Z" fill="#e8a040" /><circle cx={7} cy={-2} r={2} fill="#222" /></g>;
    })}
    {[-70, -30, 40].map((q, i) => <circle key={q} cx={q} cy={-30 - ((t * 20 + i * 30) % 90)} r={3 + i} fill="#d8f0f8" opacity={0.6} />)}
    <rect x={-124} y={-2} width={248} height={14} fill="#2a3330" />
  </g>
);

export const Tub: React.FC<{ x: number; y: number; w?: number; plants?: number; mush?: boolean }> = ({ x, y, w = 200, plants = 4, mush }) => (
  <g transform={`translate(${x},${y})`}>
    <path d={`M ${-w / 2} -50 L ${w / 2} -50 L ${w / 2 - 14} 0 L ${-w / 2 + 14} 0 Z`} fill="#4a5a52" />
    <rect x={-w / 2} y={-56} width={w} height={10} rx={4} fill="#6a7a72" />
    {Array.from({ length: plants }, (_, i) => <Plant key={i} x={-w / 2 + 30 + i * ((w - 60) / Math.max(1, plants - 1))} y={-52} g={0.8 + (i % 3) * 0.12} mush={mush} />)}
  </g>
);

export const GrowLight: React.FC<{ x: number; y: number; w?: number; t?: number }> = ({ x, y, w = 260, t = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-8} width={w} height={14} rx={6} fill="#3a2a4a" />
    <rect x={-w / 2 + 6} y={4} width={w - 12} height={6} fill="#d86adc" />
    <path d={`M ${-w / 2} 8 L ${-w / 2 - 30} 150 L ${w / 2 + 30} 150 L ${w / 2} 8 Z`} fill="#d86adc" opacity={0.14 + Math.sin(t * 3) * 0.01} />
  </g>
);

export const Candle: React.FC<{ x: number; y: number; t?: number }> = ({ x, y, t = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-8} y={-44} width={16} height={44} rx={3} fill="#e8dcc0" />
    <path d={`M 0 ${-50 - Math.sin(t * 9) * 2} Q 9 -66 0 -82 Q -9 -66 0 ${-50 - Math.sin(t * 9) * 2}`} fill="#ffb040" />
    <Glow x={0} y={-62} r={120} o={0.6} id={`cd${Math.round(x)}`} />
  </g>
);

export const Cards: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    {[-26, -8, 10, 28].map((q, i) => <g key={q} transform={`rotate(${q * 0.7} ${q} 0)`}><rect x={q - 14} y={-46} width={28} height={42} rx={3} fill="#f0ead8" stroke="#8a2a2a" strokeWidth={1.5} /><path d={`M ${q} -34 l 6 8 l -6 8 l -6 -8 z`} fill={i % 2 ? "#8a2a2a" : "#2a2a2a"} /></g>)}
  </g>
);

export const Mug: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = "#f0ead8" }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-16} y={-34} width={32} height={34} rx={5} fill={c} />
    <path d="M 16 -26 Q 32 -26 28 -10 Q 24 -4 16 -6" stroke={c} strokeWidth={5} fill="none" />
    <ellipse cx={0} cy={-34} rx={14} ry={4} fill="#4a2a1a" />
  </g>
);

export const Phone: React.FC<{ x: number; y: number; rot?: number; s?: number; lit?: number; text?: string[] }> = ({ x, y, rot = 0, s = 1, lit = 1, text }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-80} width={80} height={160} rx={12} fill="#1a1c1e" />
    <rect x={-35} y={-72} width={70} height={144} rx={8} fill={lit ? "#e8f0f4" : "#0a0c0e"} />
    {lit > 0 && <rect x={-35} y={-72} width={70} height={30} rx={8} fill={C.red} />}
    {lit > 0 && text?.map((l, i) => <Txt key={i} x={0} y={-52 + i * 18} size={9.5} c={i === 0 ? "#fff" : "#2a2a2a"} w={800}>{l}</Txt>)}
  </g>
);

/* ───── фоны: интерьер бункера ───── */
export const BunkerShell: React.FC<{ t?: number; lampOn?: number; dim?: number; children?: React.ReactNode; floorY?: number; tint?: string; lampX?: number | null; flicker?: number }> = ({ t = 0, lampOn = 1, dim = 0, children, floorY = 860, tint = C.wall, lampX = 960, flicker = 0 }) => {
  const fl = flicker > 0 ? 0.55 + 0.45 * Math.abs(Math.sin(t * 31 + Math.sin(t * 7) * 3)) * (Math.sin(t * 5) > -0.3 ? 1 : 0.2) : 1;
  const on = lampOn * fl;
  return (
    <g>
      <rect x={-200} y={-100} width={W + 400} height={H + 200} fill={C.night} />
      <rect x={0} y={0} width={W} height={floorY} fill={tint} />
      <rect x={0} y={floorY - 300} width={W} height={300} fill={C.wallD} />
      <rect x={0} y={floorY - 304} width={W} height={8} fill="#00000040" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 160 + 40} y={0} width={4} height={floorY - 300} fill="#00000026" />)}
      <rect x={0} y={0} width={W} height={70} fill={C.ceil} />
      <rect x={0} y={64} width={W} height={8} fill="#00000050" />
      <Pipe pts={[[0, 36], [W, 36]]} w={16} c="#5a6a64" />
      <Pipe pts={[[0, 58], [W, 58]]} w={10} c="#6a5a4a" />
      <rect x={0} y={floorY} width={W} height={H - floorY + 60} fill={C.floor} />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={W / 2 + (i - 4) * 80} y1={floorY} x2={W / 2 + (i - 4) * 420} y2={H + 60} stroke="#00000030" strokeWidth={3} />)}
      <line x1={0} y1={floorY + 70} x2={W} y2={floorY + 70} stroke="#00000028" strokeWidth={3} />
      {children}
      {lampX !== null && <Lamp x={lampX} y={150} on={on} id={`lp${Math.round(lampX)}`} />}
      <rect x={-200} y={-100} width={W + 400} height={H + 200} fill="#000" opacity={dim + (1 - on) * 0.35} />
    </g>
  );
};

/* ───── поверхность ───── */
export const SkyRect: React.FC<{ top: string; mid: string; bot: string; h?: number }> = ({ top, mid, bot, h = 800 }) => (
  <g>
    <defs><linearGradient id={`sky${top}${bot}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="0.6" stopColor={mid} /><stop offset="1" stopColor={bot} /></linearGradient></defs>
    <rect x={-400} y={-300} width={W + 800} height={h + 300} fill={`url(#sky${top}${bot})`} />
  </g>
);

export const House: React.FC<{ x: number; y: number; s?: number; c?: string; roof?: string; lit?: boolean; w?: number }> = ({ x, y, s = 1, c = "#c9b48a", roof = "#6a4a40", lit = true, w = 360 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-w / 2} y={-220} width={w} height={220} fill={c} />
    <path d={`M ${-w / 2 - 20} -220 L 0 -330 L ${w / 2 + 20} -220 Z`} fill={roof} />
    <rect x={w * 0.22} y={-340} width={34} height={70} fill="#5a4a40" />
    {[-w * 0.28, w * 0.2].map((q) => <g key={q}><rect x={q - 36} y={-170} width={72} height={80} fill={lit ? "#f6d58a" : "#4a5a70"} stroke="#f0ead8" strokeWidth={6} /><line x1={q} y1={-170} x2={q} y2={-90} stroke="#f0ead8" strokeWidth={4} /><line x1={q - 36} y1={-130} x2={q + 36} y2={-130} stroke="#f0ead8" strokeWidth={4} /></g>)}
    <rect x={-26} y={-120} width={52} height={120} fill="#7a4a3a" /><circle cx={14} cy={-60} r={4} fill="#d8c070" />
  </g>
);

export const Tree: React.FC<{ x: number; y: number; s?: number; c?: string; dead?: boolean }> = ({ x, y, s = 1, c = "#4a8a5a", dead }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-12} y={-150} width={24} height={150} fill={dead ? "#3a3532" : "#5a4030"} />
    {dead ? (
      <g stroke="#3a3532" strokeWidth={8} strokeLinecap="round" fill="none"><path d="M 0 -120 L -50 -190" /><path d="M 0 -140 L 40 -210" /><path d="M -50 -190 L -80 -200" /><path d="M 40 -210 L 70 -214" /><path d="M 0 -150 L 4 -240" /></g>
    ) : (
      <g><circle cx={0} cy={-190} r={80} fill={c} /><circle cx={-50} cy={-150} r={50} fill={c} /><circle cx={54} cy={-150} r={52} fill={c} /></g>
    )}
  </g>
);

export const Skyline: React.FC<{ y: number; c?: string; n?: number; seed?: number; lit?: number; h?: number }> = ({ y, c = "#2a3a48", n = 14, seed = 1, lit = 0, h = 360 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = Math.sin((i + seed) * 12.9898) * 43758.5453, r = a - Math.floor(a);
      const w = 90 + r * 90, hh = 120 + r * h, x = (i / n) * (W + 200) - 100;
      return (
        <g key={i}>
          <rect x={x} y={y - hh} width={w} height={hh} fill={c} />
          {lit > 0 && Array.from({ length: Math.floor(hh / 40) }, (_, j) => (j * 7 + i) % 3 === 0 ? <rect key={j} x={x + 12 + ((j * 13 + i) % 3) * 26} y={y - hh + 14 + j * 36} width={14} height={18} fill="#f6d58a" opacity={lit} /> : null)}
        </g>
      );
    })}
  </g>
);

export const Ground: React.FC<{ y: number; c?: string; c2?: string }> = ({ y, c = "#4a6a48", c2 = "#3a5a3a" }) => (
  <g>
    <rect x={-400} y={y} width={W + 800} height={H - y + 400} fill={c} />
    <rect x={-400} y={y} width={W + 800} height={10} fill={c2} />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${i * 70 - 100} ${y + 40 + (i % 5) * 36} q 12 -22 24 0`} stroke={c2} strokeWidth={4} fill="none" />)}
  </g>
);

export { Lamp, Dust, Glow, cl, lerp, ramp, eio, FONT };
