import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ART_H, ART_W, Person, rand } from "./Art";
import { FPS, SCENES, VOICES, sceneAt, type SceneId } from "./timeline5";

const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const CY = "#4fd1ff";
const AMBER = "#ffd34a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FREQ = ["#4fd1ff", "#ff7ad9", "#ffd34a"];
const SQ3 = Math.sqrt(3);

/* ---------- геометрия сот (pointy-top) ---------- */
const hexPts = (cx: number, cy: number, R: number) =>
  Array.from({ length: 6 })
    .map((_, k) => {
      const a = (Math.PI / 180) * (60 * k - 30);
      return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
    })
    .join(" ");

const hexCenter = (q: number, r: number, R: number, ox: number, oy: number) => ({
  x: ox + R * SQ3 * (q + r / 2),
  y: oy + R * 1.5 * r,
});

const freqOf = (q: number, r: number) => (((q - r) % 3) + 3) % 3;

/* ---------- элементы ---------- */
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#06122b" />
      <stop offset="1" stopColor="#0a2150" />
    </linearGradient>
    <radialGradient id="vig5">
      <stop offset="0.5" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.7" />
    </radialGradient>
    <filter id="glow5" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

const Backdrop: React.FC<{ frame: number; map?: boolean }> = ({ frame, map }) => (
  <g>
    <rect width={ART_W} height={ART_H} fill="url(#bg5)" />
    {Array.from({ length: 36 }).map((_, i) => (
      <circle key={i} cx={rand(i + 1) * ART_W} cy={rand(i + 50) * ART_H} r={1 + rand(i) * 1.6} fill="#9fe3ff" opacity={0.15 + 0.2 * Math.sin(frame * 0.04 + i)} />
    ))}
    {map && (
      <g opacity="0.9">
        {[140, 330, 520, 710, 900, 1090].map((y) => (
          <line key={y} x1="0" x2={ART_W} y1={y} y2={y} stroke="#1c3d78" strokeWidth="14" opacity="0.55" />
        ))}
        {[90, 280, 470, 660, 850, 1000].map((x) => (
          <line key={x} y1="0" y2={ART_H} x1={x} x2={x} stroke="#1c3d78" strokeWidth="14" opacity="0.55" />
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <rect key={i} x={40 + (i % 7) * 150 + rand(i) * 20} y={40 + Math.floor(i / 7) * 290 + rand(i + 9) * 40} width={60 + rand(i + 3) * 50} height={50 + rand(i + 5) * 60} fill="#12356f" opacity="0.5" />
        ))}
      </g>
    )}
  </g>
);

const Tower: React.FC<{ x: number; y: number; s?: number; color?: string; frame: number; pop?: number; seed?: number }> = ({
  x,
  y,
  s = 1,
  color = "#fff",
  frame,
  pop = 1,
  seed = 0,
}) => {
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.12 + seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`} opacity={Math.min(1, pop * 1.5)} filter="url(#glow5)">
      <polygon points="-24,0 24,0 4,-110 -4,-110" fill="#ffffff22" stroke="#fff" strokeWidth="3" />
      <line x1="-14" y1="-34" x2="14" y2="-34" stroke="#fff" strokeWidth="2" opacity="0.7" />
      <line x1="-9" y1="-68" x2="9" y2="-68" stroke="#fff" strokeWidth="2" opacity="0.7" />
      <circle cx="0" cy="-122" r="12" fill={color} opacity={0.6 + 0.4 * pulse} />
      <circle cx="0" cy="-122" r="24" fill="none" stroke={color} strokeWidth="3" opacity={0.5 * pulse} />
    </g>
  );
};

const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: string; frame: number }> = ({ x, y, s = 1, rot = 0, glow = CY, frame }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle r={70 + 6 * Math.sin(frame * 0.1)} fill={glow} opacity="0.12" />
    <rect x="-26" y="-48" width="52" height="96" rx="9" fill="#0b1a3a" stroke={glow} strokeWidth="3" filter="url(#glow5)" />
    <rect x="-20" y="-40" width="40" height="76" rx="4" fill="#12306a" />
    <rect x="-8" y="-44" width="16" height="3" rx="1.5" fill={glow} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-14 + i * 8} y={22 - i * 6} width="5" height={6 + i * 6} fill={glow} opacity="0.9" />
    ))}
  </g>
);

const Rings: React.FC<{ x: number; y: number; frame: number; color?: string; max?: number; n?: number; speed?: number; w?: number }> = ({
  x,
  y,
  frame,
  color = CY,
  max = 420,
  n = 4,
  speed = 0.012,
  w = 5,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = (frame * speed + i / n) % 1;
      return <circle key={i} cx={x} cy={y} r={20 + p * max} fill="none" stroke={color} strokeWidth={w * (1 - p) + 1} opacity={(1 - p) * 0.85} />;
    })}
  </g>
);

const Link: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; frame: number; o?: number; dash?: boolean }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  frame,
  o = 1,
  dash,
}) => (
  <g opacity={o} filter="url(#glow5)">
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={dash ? 3 : 6} strokeDasharray={dash ? "10 12" : "26 14"} strokeDashoffset={-frame * 3} strokeLinecap="round" />
  </g>
);

const Car: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="34" rx="90" ry="14" fill="#000" opacity="0.4" />
    <polygon points="-90,10 90,10 80,-26 -80,-26" fill="#e9eef7" />
    <polygon points="-60,-26 60,-26 40,-58 -40,-58" fill="#bcd3f5" />
    <polygon points="-60,-26 -40,-58 0,-58 0,-26" fill="#9fc0ee" />
    <circle cx="-52" cy="14" r="20" fill="#0b1220" />
    <circle cx="52" cy="14" r="20" fill="#0b1220" />
    <circle cx="90" cy="-6" r="8" fill="#fff3b0" />
    <Phone x={-4} y={-90} s={0.55} frame={frame} />
  </g>
);

/* ---------- сцены ---------- */
type SP = { frame: number; local: number; t: number };

const Intro: React.FC<SP> = ({ frame, local }) => (
  <g>
    <Backdrop frame={frame} />
    <Rings x={640} y={420} frame={frame} color={CY} max={520} n={5} speed={0.01} />
    <Rings x={640} y={420} frame={frame + 40} color="#fff" max={380} n={3} speed={0.014} w={2} />
    <Person x={460} y={1160} s={2.7} frame={frame} look={1} />
    <g transform="translate(640 480) rotate(14)">
      <Phone x={0} y={0} s={2.2} frame={frame} />
    </g>
    <polygon points="500,640 590,520 640,560 580,700" fill="#4c6a52" />
    {local < 1 && <rect width={ART_W} height={ART_H} fill="#06122b" opacity={1 - local} />}
  </g>
);

const GRID_R = 135;
const gridCells = () => {
  const cells: { q: number; r: number; x: number; y: number }[] = [];
  for (let r = -4; r <= 4; r++)
    for (let q = -5; q <= 5; q++) {
      const c = hexCenter(q, r, GRID_R, 540, 625);
      if (c.x > -120 && c.x < ART_W + 120 && c.y > -100 && c.y < ART_H + 100) cells.push({ q, r, ...c });
    }
  return cells;
};

const Cells: React.FC<SP> = ({ frame, local }) => (
  <g>
    <Backdrop frame={frame} map />
    {gridCells().map((c) => {
      const d = Math.hypot(c.x - 540, c.y - 625) / 900;
      const a = interpolate(local, [0.4 + d * 3.5, 1.0 + d * 3.5], [0, 1], clamp);
      const tw = interpolate(local, [1.4 + d * 3.5, 2.0 + d * 3.5], [0, 1], clamp);
      return (
        <g key={`${c.q},${c.r}`}>
          <polygon points={hexPts(c.x, c.y, GRID_R - 4)} fill={CY} fillOpacity={0.06 * a} stroke={CY} strokeWidth="3" opacity={a} filter="url(#glow5)" />
          <Tower x={c.x} y={c.y + 40} s={0.5} frame={frame} pop={tw} seed={c.q + c.r} color={CY} />
        </g>
      );
    })}
    <g opacity={interpolate(local, [6, 7], [0, 1], clamp)}>
      <polygon points={hexPts(540, 625, GRID_R - 4)} fill={CY} fillOpacity="0.3" stroke="#fff" strokeWidth="6" />
      <rect x="640" y="470" width="260" height="70" rx="14" fill="#06122bcc" stroke={CY} strokeWidth="3" />
      <text x="770" y="518" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="40" fontWeight="900">
        1 СОТА
      </text>
      <line x1="640" y1="505" x2="560" y2="590" stroke={CY} strokeWidth="4" />
    </g>
  </g>
);

const FreqScene: React.FC<SP> = ({ frame, local }) => {
  const zoom = interpolate(local, [0, 2], [1, 1.25], clamp);
  const tx = 540;
  const ty = 650;
  const ph = { x: 640, y: 740 };
  return (
    <g>
      <Backdrop frame={frame} map />
      <g transform={`translate(540 625) scale(${zoom}) translate(-540 -625)`}>
        {gridCells().map((c) => {
          const f = freqOf(c.q, c.r);
          const home = c.q === 0 && c.r === 0;
          const a = interpolate(local, [0.3 + Math.hypot(c.x - 540, c.y - 625) / 700, 1.3 + Math.hypot(c.x - 540, c.y - 625) / 700], [0, 1], clamp);
          return (
            <g key={`${c.q},${c.r}`}>
              <polygon points={hexPts(c.x, c.y, GRID_R - 4)} fill={FREQ[f]} fillOpacity={(home ? 0.35 : 0.15) * a} stroke={FREQ[f]} strokeWidth={home ? 6 : 3} opacity={a} filter="url(#glow5)" />
              <Tower x={c.x} y={c.y + 40} s={0.5} frame={frame} color={FREQ[f]} seed={c.q} />
              <text x={c.x} y={c.y + 62} textAnchor="middle" fill={FREQ[f]} fontFamily={FONT} fontSize="26" fontWeight="900" opacity={a * 0.9}>
                f{f + 1}
              </text>
            </g>
          );
        })}
        <Rings x={tx} y={ty - 40} frame={frame} color={FREQ[0]} max={150} n={3} speed={0.016} w={4} />
        <Link x1={tx} y1={ty - 120} x2={ph.x} y2={ph.y - 20} color={FREQ[0]} frame={frame} o={interpolate(local, [1.5, 2.5], [0, 1], clamp)} />
        <Phone x={ph.x} y={ph.y} s={0.55} frame={frame} glow={FREQ[0]} />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${130 + i * 300} 1170)`} opacity={interpolate(local, [3 + i * 0.7, 3.6 + i * 0.7], [0, 1], clamp)}>
          <rect x="-110" y="-34" width="260" height="68" rx="14" fill="#06122bdd" stroke={FREQ[i]} strokeWidth="3" />
          <circle cx="-74" cy="0" r="14" fill={FREQ[i]} />
          <text x="-44" y="12" fill="#fff" fontFamily={FONT} fontSize="34" fontWeight="900">
            ЧАСТОТА {i + 1}
          </text>
        </g>
      ))}
    </g>
  );
};

const HR = 245;
const HA = { x: 300, y: 560 };
const HB = { x: 300 + HR * SQ3, y: 560 };
const carFrac = (local: number) => interpolate(local, [0.5, 9.5], [0, 1], clamp);
const carX = (local: number) => 130 + carFrac(local) * 780;
const strengths = (cx: number) => ({
  a: Math.max(0.05, Math.min(1, 1 - Math.abs(cx - HA.x) / 560)),
  b: Math.max(0.05, Math.min(1, 1 - Math.abs(cx - HB.x) / 560)),
});
export const HANDOVER_T = 25 + (((HA.x + HB.x) / 2 - 130) / 780) * 9 + 0.5;

const Handover: React.FC<SP> = ({ frame, local, t }) => {
  const cx = carX(local);
  const { a, b } = strengths(cx);
  const onB = t >= HANDOVER_T;
  const flash = interpolate(t, [HANDOVER_T, HANDOVER_T + 0.15, HANDOVER_T + 1.3], [0, 1, 0], clamp);
  const bars = (v: number) => Math.round(v * 4 + 0.4);
  return (
    <g>
      <Backdrop frame={frame} map />
      <polygon points={hexPts(HA.x, HA.y, HR)} fill={FREQ[0]} fillOpacity="0.14" stroke={FREQ[0]} strokeWidth="5" filter="url(#glow5)" />
      <polygon points={hexPts(HB.x, HB.y, HR)} fill={FREQ[1]} fillOpacity="0.14" stroke={FREQ[1]} strokeWidth="5" filter="url(#glow5)" />
      <rect x="0" y="610" width={ART_W} height="60" fill="#10306a" opacity="0.85" />
      <line x1="0" x2={ART_W} y1="640" y2="640" stroke="#fff" strokeWidth="4" strokeDasharray="34 26" opacity="0.5" />
      <Tower x={HA.x} y={HA.y} s={1.15} color={FREQ[0]} frame={frame} />
      <Tower x={HB.x} y={HB.y} s={1.15} color={FREQ[1]} frame={frame} seed={2} />
      <text x={HA.x} y={HA.y + 90} textAnchor="middle" fill={FREQ[0]} fontFamily={FONT} fontSize="34" fontWeight="900">
        ВЫШКА A
      </text>
      <text x={HB.x} y={HB.y + 90} textAnchor="middle" fill={FREQ[1]} fontFamily={FONT} fontSize="34" fontWeight="900">
        ВЫШКА B
      </text>
      <Link x1={HA.x} y1={HA.y - 130} x2={cx} y2={640 - 90} color={FREQ[0]} frame={frame} o={onB ? 0.25 : 0.4 + a * 0.6} dash={onB} />
      <Link x1={HB.x} y1={HB.y - 130} x2={cx} y2={640 - 90} color={FREQ[1]} frame={frame} o={onB ? 0.4 + b * 0.6 : 0.25} dash={!onB} />
      <Car x={cx} y={660} frame={frame} />
      {flash > 0 && <circle cx={cx} cy="560" r={60 + (1 - flash) * 240} fill="none" stroke="#fff" strokeWidth="8" opacity={flash} />}
      {flash > 0.05 && (
        <g transform={`translate(${(HA.x + HB.x) / 2} 300)`} opacity={Math.min(1, flash * 2)}>
          <rect x="-190" y="-48" width="380" height="96" rx="22" fill="#06122bee" stroke="#fff" strokeWidth="4" />
          <text y="20" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="60" fontWeight="900">
            HANDOVER
          </text>
        </g>
      )}
      {[
        { n: "ВЫШКА A", v: a, c: FREQ[0], y: 960, on: !onB },
        { n: "ВЫШКА B", v: b, c: FREQ[1], y: 1070, on: onB },
      ].map((m) => (
        <g key={m.n} transform={`translate(110 ${m.y})`}>
          <text fill="#fff" fontFamily={FONT} fontSize="34" fontWeight="900" y="30">
            {m.n}
          </text>
          <rect x="250" y="0" width="480" height="40" rx="20" fill="#0d2a5c" />
          <rect x="250" y="0" width={480 * m.v} height="40" rx="20" fill={m.c} opacity={m.on ? 1 : 0.5} filter="url(#glow5)" />
          <text x="750" y="30" fill={m.on ? "#7dffb0" : "#8aa4d6"} fontFamily={FONT} fontSize="30" fontWeight="900">
            {m.on ? "● СВЯЗЬ" : `${bars(m.v)}/4`}
          </text>
        </g>
      ))}
    </g>
  );
};

const DataScene: React.FC<SP> = ({ frame, local }) => {
  const P = [
    { x: 160, y: 760 }, // телефон
    { x: 420, y: 330 }, // верх вышки
    { x: 420, y: 880 }, // основание
    { x: 880, y: 880 }, // вход сервера
    { x: 880, y: 640 }, // сервер
  ];
  const seg = P.slice(1).map((p, i) => ({ a: P[i], b: p, len: Math.hypot(p.x - P[i].x, p.y - P[i].y) }));
  const total = seg.reduce((s, e) => s + e.len, 0);
  const at = (u: number) => {
    let d = u * total;
    for (const e of seg) {
      if (d <= e.len) return { x: e.a.x + ((e.b.x - e.a.x) * d) / e.len, y: e.a.y + ((e.b.y - e.a.y) * d) / e.len };
      d -= e.len;
    }
    return P[4];
  };
  const packets = Array.from({ length: 6 }).map((_, i) => {
    const p = (local * 0.18 + i / 6) % 1;
    const fwd = at(p);
    const back = at(1 - p);
    return { fwd, back, i };
  });
  return (
    <g>
      <Backdrop frame={frame} />
      <rect x="0" y="880" width={ART_W} height="370" fill="#07142e" />
      <line x1="0" x2={ART_W} y1="880" y2="880" stroke="#1c3d78" strokeWidth="4" />
      <polyline points={P.slice(1).map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#1c3d78" strokeWidth="10" opacity="0.6" />
      <polyline points={P.slice(2).map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={CY} strokeWidth="6" opacity="0.8" strokeDasharray="30 18" strokeDashoffset={-frame * 3} filter="url(#glow5)" />
      <Tower x={420} y={880} s={2.4} frame={frame} color={CY} />
      <Rings x={420} y={600} frame={frame} color={CY} max={170} n={3} speed={0.014} w={3} />
      {/* сервер */}
      <g transform="translate(880 800)">
        {[0, 1, 2, 3].map((k) => (
          <g key={k} transform={`translate(0 ${-k * 66})`}>
            <rect x="-90" y="-60" width="180" height="56" rx="8" fill="#0b1a3a" stroke={CY} strokeWidth="3" opacity="0.9" />
            <circle cx="-62" cy="-32" r="6" fill={frame % (20 + k * 7) < 10 ? "#7dffb0" : "#2a6a4a"} />
            <circle cx="-42" cy="-32" r="6" fill={frame % (13 + k * 5) < 6 ? "#ffd34a" : "#6a5a2a"} />
            <rect x="0" y="-38" width="70" height="12" rx="4" fill="#12306a" />
          </g>
        ))}
      </g>
      <Person x={150} y={1000} s={0.95} frame={frame} look={1} />
      <Phone x={228} y={770} s={0.9} rot={12} frame={frame} />
      {packets.map((pk) => (
        <g key={pk.i} filter="url(#glow5)">
          <rect x={pk.fwd.x - 12} y={pk.fwd.y - 12} width="24" height="24" rx="5" fill="#fff" transform={`rotate(${pk.i * 15} ${pk.fwd.x} ${pk.fwd.y})`} />
          <rect x={pk.back.x - 9} y={pk.back.y - 9} width="18" height="18" rx="4" fill={FREQ[2]} />
        </g>
      ))}
      {[
        { x: 160, y: 1070, t: "ТЕЛЕФОН" },
        { x: 420, y: 1010, t: "ВЫШКА" },
        { x: 650, y: 940, t: "ОПТОВОЛОКНО" },
        { x: 880, y: 1000, t: "СЕРВЕР" },
      ].map((l, i) => (
        <text key={l.t} x={l.x} y={l.y} textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="32" fontWeight="900" opacity={interpolate(local, [0.5 + i * 0.5, 1 + i * 0.5], [0, 0.95], clamp)}>
          {l.t}
        </text>
      ))}
    </g>
  );
};

const route = [
  { q: -2, r: 2 },
  { q: -1, r: 1 },
  { q: 0, r: 0 },
  { q: 1, r: -1 },
  { q: 2, r: -2 },
];

const RouteScene: React.FC<SP> = ({ frame, local }) => {
  const pts = route.map((c) => hexCenter(c.q, c.r, GRID_R, 540, 625));
  const prog = interpolate(local, [1, 8], [0, 1], clamp) * (pts.length - 1);
  const seg = Math.min(pts.length - 2, Math.floor(prog));
  const f = prog - seg;
  const me = { x: pts[seg].x + (pts[seg + 1].x - pts[seg].x) * f, y: pts[seg].y + (pts[seg + 1].y - pts[seg].y) * f };
  return (
    <g>
      <Backdrop frame={frame} map />
      {gridCells().map((c) => {
        const on = route.some((rc) => rc.q === c.q && rc.r === c.r);
        return (
          <g key={`${c.q},${c.r}`}>
            <polygon points={hexPts(c.x, c.y, GRID_R - 4)} fill={on ? CY : "none"} fillOpacity={on ? 0.22 : 0} stroke={CY} strokeWidth={on ? 5 : 2} opacity={on ? 1 : 0.35} filter={on ? "url(#glow5)" : undefined} />
            <Tower x={c.x} y={c.y + 40} s={0.5} frame={frame} color={on ? "#fff" : CY} seed={c.q} />
          </g>
        );
      })}
      <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40 22" strokeDashoffset={-frame * 3} filter="url(#glow5)" opacity={interpolate(local, [0.5, 1.5], [0, 1], clamp)} />
      <Phone x={pts[0].x} y={pts[0].y - 20} s={0.5} frame={frame} />
      <g transform={`translate(${me.x} ${me.y - 10})`}>
        <circle r="30" fill="#fff" opacity="0.2" />
        <circle r="12" fill="#fff" filter="url(#glow5)" />
      </g>
      <g transform={`translate(${pts[4].x} ${pts[4].y - 160})`}>
        <rect x="-90" y="-26" width="180" height="52" rx="12" fill="#06122bdd" stroke="#fff" strokeWidth="3" />
        <text y="12" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="30" fontWeight="900">
          СЕРВЕР
        </text>
      </g>
      {[
        { c: pts[2], dbm: "−58 дБм", best: true },
        { c: hexCenter(-1, 2, GRID_R, 540, 625), dbm: "−81 дБм", best: false },
        { c: hexCenter(1, 0, GRID_R, 540, 625), dbm: "−74 дБм", best: false },
      ].map((m, i) => (
        <g key={i} transform={`translate(${m.c.x} ${m.c.y - 130})`} opacity={interpolate(local, [3 + i * 0.7, 3.6 + i * 0.7], [0, 1], clamp)}>
          <rect x="-82" y="-24" width="164" height="48" rx="12" fill="#06122bee" stroke={m.best ? "#7dffb0" : "#8aa4d6"} strokeWidth="3" />
          <text y="9" textAnchor="middle" fill={m.best ? "#7dffb0" : "#8aa4d6"} fontFamily={FONT} fontSize="28" fontWeight="900">
            {m.best ? "✓ " : ""}
            {m.dbm}
          </text>
        </g>
      ))}
    </g>
  );
};

const Final: React.FC<SP> = ({ frame, local }) => {
  const a = interpolate(local, [0, 1], [0, 1], clamp);
  return (
    <g>
      <Backdrop frame={frame} />
      <polygon points={hexPts(540, 560, 360)} fill={CY} fillOpacity="0.1" stroke={CY} strokeWidth="7" filter="url(#glow5)" opacity={a} />
      <polygon points={hexPts(540, 560, 250)} fill="none" stroke="#fff" strokeWidth="3" opacity={0.4 * a} />
      <Tower x={400} y={680} s={2} frame={frame} color={CY} />
      <Rings x={400} y={460} frame={frame} color={CY} max={260} n={3} speed={0.012} w={4} />
      <Link x1={400} y1={420} x2={650} y2={600} color={CY} frame={frame} />
      <Phone x={680} y={620} s={1.7} rot={10} frame={frame} />
      <g transform="translate(540 1040)" opacity={interpolate(local, [1.2, 2.2], [0, 1], clamp)}>
        <rect x="-210" y="-70" width="420" height="140" rx="26" fill="none" stroke="#9fe3ff" strokeWidth="4" strokeDasharray="14 10" />
        <text y="12" textAnchor="middle" fill="#9fe3ff" fontFamily={FONT} fontSize="54" fontWeight="900" letterSpacing="8">
          ЛОГОТИП
        </text>
      </g>
    </g>
  );
};

const World5: React.FC<{ frame: number; t: number; scene: SceneId; local: number }> = ({ frame, t, scene, local }) => {
  const p = { frame, t, local };
  return (
    <svg viewBox={`0 0 ${ART_W} ${ART_H}`} width={ART_W} height={ART_H}>
      <Defs />
      {scene === "intro" && <Intro {...p} />}
      {scene === "cells" && <Cells {...p} />}
      {scene === "freq" && <FreqScene {...p} />}
      {scene === "handover" && <Handover {...p} />}
      {scene === "data" && <DataScene {...p} />}
      {scene === "route" && <RouteScene {...p} />}
      {scene === "final" && <Final {...p} />}
      <rect width={ART_W} height={ART_H} fill="url(#vig5)" />
    </svg>
  );
};

/* ---------- интерфейс ---------- */
const Hud: React.FC<{ t: number; frame: number; scene: SceneId }> = ({ t, frame, scene }) => {
  const level =
    scene === "intro" ? 3 : scene === "handover" ? (Math.abs(t - HANDOVER_T) < 0.8 ? 1 : 4) : scene === "data" ? 4 : 4;
  return (
    <div style={{ position: "absolute", top: 150, left: 56, right: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontFamily: FONT, color: "#fff" }}>
      <div>
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 4 }}>СОТОВАЯ СВЯЗЬ</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, opacity: 0.6, marginTop: 6 }}>КАК ЭТО РАБОТАЕТ · 60 С</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4, opacity: 0.75 }}>СИГНАЛ</div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", justifyContent: "flex-end", height: 44, marginTop: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 12, height: 12 + i * 10, background: i < level ? CY : "#1f3a6a", borderRadius: 3, opacity: i < level ? 0.6 + 0.4 * Math.sin(frame * 0.2 + i) : 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const sc = sceneAt(t);
  const local = t - sc.start;
  const o = interpolate(local, [0, 0.3, sc.end - sc.start - 0.3, sc.end - sc.start], [0, 1, 1, 0], clamp);
  const y = interpolate(local, [0, 0.4], [16, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 262, left: 60, right: 60, textAlign: "center", fontFamily: FONT, opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ color: CY, fontSize: 26, fontWeight: 900, letterSpacing: 8 }}>{sc.label}</div>
      <div style={{ color: "#fff", fontSize: 58, fontWeight: 900, lineHeight: 1.08, marginTop: 8, textShadow: "0 4px 24px rgba(0,0,0,.8)" }}>{sc.caption}</div>
    </div>
  );
};

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const v = VOICES.find((x) => t >= x.start - 0.05 && t < x.start + x.dur + 0.3);
  if (!v) return null;
  const total = v.lines.reduce((a, l) => a + l.length, 0);
  let acc = 0;
  let current = v.lines[0];
  let from = v.start;
  for (const l of v.lines) {
    const s = v.start + (acc / total) * v.dur;
    if (t >= s) {
      current = l;
      from = s;
    }
    acc += l.length;
  }
  const o = interpolate(t, [from, from + 0.1], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, bottom: 250, textAlign: "center", fontFamily: FONT, fontSize: 56, fontWeight: 900, lineHeight: 1.12, color: AMBER, textShadow: "0 4px 18px rgba(0,0,0,.95)", opacity: o }}>
      {current}
    </div>
  );
};

const Audios: React.FC = () => {
  const S = (s: number) => Math.round(s * FPS);
  const C = (f: string) => staticFile(`cell/${f}`);
  const sfx = (from: number, dur: number, src: string, vol: number, loop = false) => (
    <Sequence from={S(from)} durationInFrames={S(dur)}>
      <Audio src={src} volume={vol} loop={loop} />
    </Sequence>
  );
  return (
    <>
      {sfx(0, 60, C("x-pad.mp3"), 0.12, true)}
      {[0.4, 1.6, 2.8, 4.0].map((s) => sfx(s, 1.2, C("x-ping.mp3"), 0.5))}
      {[5.2, 6.6, 8.0, 9.4, 10.8].map((s) => sfx(s, 1.2, C("x-grid.mp3"), 0.35))}
      {[15.5, 17.0, 18.5].map((s) => sfx(s, 1.2, C("x-ping.mp3"), 0.4))}
      {sfx(HANDOVER_T - 0.1, 2.4, C("x-handover.mp3"), 0.9)}
      {sfx(35, 10, C("x-data.mp3"), 0.4, true)}
      {[45.5, 47.5, 49.5].map((s) => sfx(s, 1.2, C("x-ping.mp3"), 0.35))}
      {sfx(55.1, 4.8, C("x-final.mp3"), 0.8)}
      {VOICES.map((v) => (
        <Sequence key={v.file} from={S(v.start)} durationInFrames={Math.ceil((v.dur + 0.4) * FPS)}>
          <Audio src={C(v.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

export const Cell: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = sceneAt(t);
  const local = t - sc.start;
  const drift = Math.sin(frame * 0.02) * 6;
  const fadeIn = interpolate(t, [0, 0.5], [0, 1], clamp);
  const fadeOut = interpolate(t, [59.3, 60], [1, 0], clamp);
  const sceneFade = interpolate(local, [0, 0.25], [0.2, 1], clamp);
  void SCENES;
  return (
    <AbsoluteFill style={{ backgroundColor: "#02060f" }}>
      <div style={{ position: "absolute", top: 300, left: 0, width: ART_W, height: ART_H, overflow: "hidden", opacity: Math.min(fadeIn, fadeOut) * sceneFade }}>
        <div style={{ transform: `translate(${drift}px, ${drift * 0.5}px) scale(${1.02 + 0.03 * (local / (sc.end - sc.start))})`, transformOrigin: "50% 50%" }}>
          <World5 frame={frame} t={t} scene={sc.id} local={local} />
        </div>
      </div>
      <Hud t={t} frame={frame} scene={sc.id} />
      <Caption t={t} />
      <Subtitle t={t} />
      <Audios />
    </AbsoluteFill>
  );
};
