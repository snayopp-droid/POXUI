import React from "react";
import { H, SANS, TAU, W, cl, lerp, mix, rnd } from "./core";

/** небо: вертикальный градиент */
export const Sky: React.FC<{ id: string; top: string; mid?: string; bot: string; y0?: number; y1?: number }> = ({ id, top, mid, bot, y0 = 0, y1 = H }) => (
  <g>
    <defs>
      <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={top} />
        {mid && <stop offset="55%" stopColor={mid} />}
        <stop offset="100%" stopColor={bot} />
      </linearGradient>
    </defs>
    <rect x={-2000} y={y0} width={W + 4000} height={y1 - y0} fill={`url(#sky-${id})`} />
  </g>
);

/** окно: тёплое (лампа), холодное (телевизор), тёмное */
const winCol = (r: number, lit: number, night: number) => {
  if (r < lit * 0.82) return mix("#ffcf8a", "#f0a85a", rnd(r * 91));
  if (r < lit) return "#9fb6d8";
  return mix("#3d4552", "#1a1e25", night);
};

/** московская панелька: этажи × подъезды, балконы */
export const Panelka: React.FC<{ x: number; y: number; w: number; floors: number; fh?: number; seed?: number; lit?: number; night?: number; col?: string; flick?: number }> = ({
  x,
  y,
  w,
  floors,
  fh = 34,
  seed = 1,
  lit = 0.25,
  night = 0.4,
  col = "#8d929a",
  flick = 0,
}) => {
  const h = floors * fh + 20;
  const cols = Math.max(4, Math.round(w / 46));
  const cw = w / cols;
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={col} />
      {/* швы панелей */}
      {Array.from({ length: floors }, (_, f) => (
        <line key={f} x1={x} x2={x + w} y1={y - 20 - f * fh} y2={y - 20 - f * fh} stroke={mix(col, "#000", 0.25)} strokeWidth={1.5} opacity={0.6} />
      ))}
      {Array.from({ length: floors }, (_, f) =>
        Array.from({ length: cols }, (_, c) => {
          const r = rnd(seed * 17 + f * 31 + c * 7);
          const on = rnd(seed * 3 + f * 11 + c * 13 + Math.floor(flick)) ;
          return <rect key={`${f}-${c}`} x={x + c * cw + cw * 0.22} y={y - 20 - (f + 1) * fh + fh * 0.25} width={cw * 0.56} height={fh * 0.5} fill={winCol(flick ? on : r, lit, night)} />;
        }),
      )}
      {/* балконы */}
      {Array.from({ length: floors - 1 }, (_, f) =>
        Array.from({ length: Math.floor(cols / 3) }, (_, b) => (
          <rect key={`b${f}-${b}`} x={x + (b * 3 + 1) * cw - 4} y={y - 20 - (f + 1) * fh + fh * 0.62} width={cw + 8} height={fh * 0.34} fill={mix(col, "#000", 0.32)} />
        )),
      )}
      <rect x={x - 4} y={y - h - 6} width={w + 8} height={8} fill={mix(col, "#000", 0.4)} />
    </g>
  );
};

/** нью-йоркская башня: сетка окон, уступы, водонапорный бак */
export const Tower: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; lit?: number; col?: string; night?: number; tank?: boolean; setback?: boolean; t?: number; blink?: number; detail?: number }> = ({
  x,
  y,
  w,
  h,
  seed = 1,
  lit = 0.3,
  col = "#262c38",
  night = 1,
  tank = false,
  setback = false,
  t = 0,
  blink = 0,
  detail = 1,
}) => {
  const fh = 16 * detail + 6;
  const floors = Math.floor((h - 20) / fh);
  const cols = Math.max(3, Math.floor(w / (14 * detail + 6)));
  const cw = w / cols;
  const sb = setback ? Math.min(floors - 2, 6) : 0;
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={col} />
      {setback && <rect x={x + w * 0.18} y={y - h - sb * fh} width={w * 0.64} height={sb * fh + 2} fill={col} />}
      {Array.from({ length: floors }, (_, f) =>
        Array.from({ length: cols }, (_, c) => {
          const r = rnd(seed * 13.1 + f * 7.3 + c * 3.7);
          const b = blink ? rnd(seed + f * 3 + c * 5 + Math.floor(t * 0.7 + rnd(f * c + seed) * 5)) : r;
          const on = b < lit;
          if (!on && night > 0.8 && r > 0.85) return null;
          return (
            <rect
              key={`${f}-${c}`}
              x={x + c * cw + cw * 0.2}
              y={y - h + 10 + f * fh}
              width={cw * 0.6}
              height={fh * 0.55}
              fill={on ? mix("#ffd29a", "#ffe9c6", rnd(r * 77)) : mix("#39414f", "#161a22", night)}
              opacity={on ? 0.75 + rnd(r * 9) * 0.25 : 0.8}
            />
          );
        }),
      )}
      {tank && (
        <g transform={`translate(${x + w * 0.7} ${y - h})`}>
          <path d="M-14 0 L-12 -22 L12 -22 L14 0 Z M-8 -22 L-8 -34 L8 -34 L8 -22" fill={mix(col, "#000", 0.3)} />
          <path d="M-16 -34 L0 -46 L16 -34 Z" fill={mix(col, "#000", 0.4)} />
        </g>
      )}
    </g>
  );
};

/** ряд башен Манхэттена */
export const Skyline: React.FC<{ y: number; seed?: number; n?: number; x0?: number; x1?: number; hMin?: number; hMax?: number; col?: string; lit?: number; t?: number; blink?: number; detail?: number; spire?: boolean }> = ({
  y,
  seed = 1,
  n = 18,
  x0 = -200,
  x1 = W + 200,
  hMin = 200,
  hMax = 620,
  col = "#222834",
  lit = 0.3,
  t = 0,
  blink = 0,
  detail = 1,
  spire = false,
}) => {
  const span = (x1 - x0) / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r = rnd(seed * 5 + i * 1.7);
        const w = span * (0.7 + rnd(i * 3 + seed) * 0.6);
        const h = lerp(hMin, hMax, Math.pow(r, 1.3));
        const x = x0 + i * span + (rnd(i * 9 + seed) - 0.5) * span * 0.4;
        const tall = spire && i === Math.floor(n * 0.42);
        return (
          <g key={i}>
            <Tower x={x} y={y} w={w} h={tall ? hMax * 1.25 : h} seed={seed * 100 + i} lit={lit} col={mix(col, "#000", rnd(i * 4) * 0.25)} tank={r < 0.45} setback={r > 0.6 || tall} t={t} blink={blink} detail={detail} />
            {tall && <path d={`M${x + w / 2 - 6} ${y - hMax * 1.25 - 36} L${x + w / 2} ${y - hMax * 1.25 - 150} L${x + w / 2 + 6} ${y - hMax * 1.25 - 36} Z`} fill={col} />}
          </g>
        );
      })}
    </g>
  );
};

/** башня Бруклинского моста: камень, две стрельчатые арки */
export const BridgeTower: React.FC<{ x: number; y: number; s?: number; col?: string; light?: string; lightO?: number }> = ({ x, y, s = 1, col = "#5b5550", light = "#ffcf94", lightO = 0.25 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 0 L-140 -600 L140 -600 L150 0 Z" fill={col} />
    <rect x={-152} y={-612} width={304} height={18} fill={mix(col, "#000", 0.25)} />
    <rect x={-140} y={-640} width={280} height={30} fill={mix(col, "#000", 0.1)} />
    {[-70, 70].map((ax) => (
      <path key={ax} d={`M${ax - 42} -40 L${ax - 42} -420 Q${ax} -510 ${ax + 42} -420 L${ax + 42} -40 Z`} fill={mix(col, "#05070b", 0.85)} />
    ))}
    {Array.from({ length: 14 }, (_, i) => (
      <line key={i} x1={-146 + i * 0.5} x2={146 - i * 0.5} y1={-40 - i * 40} y2={-40 - i * 40} stroke={mix(col, "#000", 0.2)} strokeWidth={1.4} opacity={0.5} />
    ))}
    <path d="M-150 0 L-140 -600 L-120 -600 L-128 0 Z" fill={light} opacity={lightO} />
  </g>
);

/** пролёт моста: несущие тросы-цепные линии, ванты, полотно */
export const BridgeSpan: React.FC<{ x0: number; x1: number; top: number; deck: number; col?: string; cable?: string; lamps?: boolean; t?: number }> = ({ x0, x1, top, deck, col = "#2a2a2e", cable = "#4a4a50", lamps = true }) => {
  const pts = 40;
  const sag = (u: number) => top + (deck - 40 - top) * (1 - Math.pow(2 * u - 1, 2));
  const main = Array.from({ length: pts + 1 }, (_, i) => {
    const u = i / pts;
    return `${lerp(x0, x1, u)},${sag(u)}`;
  }).join(" ");
  return (
    <g>
      <polyline points={main} fill="none" stroke={cable} strokeWidth={6} />
      {Array.from({ length: 34 }, (_, i) => {
        const u = (i + 0.5) / 34;
        const xx = lerp(x0, x1, u);
        return <line key={i} x1={xx} x2={xx} y1={sag(u)} y2={deck} stroke={cable} strokeWidth={1.6} opacity={0.75} />;
      })}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`d${i}`} x1={x0} y1={top + 10} x2={lerp(x0, x1, 0.06 + i * 0.05)} y2={deck} stroke={cable} strokeWidth={1.2} opacity={0.5} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`e${i}`} x1={x1} y1={top + 10} x2={lerp(x1, x0, 0.06 + i * 0.05)} y2={deck} stroke={cable} strokeWidth={1.2} opacity={0.5} />
      ))}
      <rect x={x0 - 400} y={deck} width={x1 - x0 + 800} height={46} fill={col} />
      <rect x={x0 - 400} y={deck + 46} width={x1 - x0 + 800} height={10} fill={mix(col, "#000", 0.4)} />
      {lamps &&
        Array.from({ length: 14 }, (_, i) => {
          const xx = lerp(x0 - 300, x1 + 300, i / 13);
          return (
            <g key={`l${i}`}>
              <circle cx={xx} cy={deck - 6} r={3} fill="#ffd9a0" />
              <ellipse cx={xx} cy={deck - 6} rx={26} ry={14} fill="url(#b-sodium)" opacity={0.6} />
            </g>
          );
        })}
    </g>
  );
};

/** уличный фонарь с натриевым светом */
export const Lamp: React.FC<{ x: number; y: number; s?: number; on?: number; col?: string }> = ({ x, y, s = 1, on = 1, col = "#17191d" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-5} y={-420} width={10} height={420} fill={col} />
    <path d="M0 -420 Q0 -450 40 -452 L70 -452" stroke={col} strokeWidth={8} fill="none" />
    <path d="M56 -458 L92 -458 L86 -444 L62 -444 Z" fill={col} />
    {on > 0 && (
      <g opacity={on}>
        <ellipse cx={74} cy={-442} rx={14} ry={4} fill="#ffe1b0" />
        <ellipse cx={74} cy={-430} rx={160} ry={160} fill="url(#b-sodium)" opacity={0.7} />
        <path d="M62 -444 L-60 0 L210 0 L86 -444 Z" fill="#ffb760" opacity={0.06} />
        <ellipse cx={74} cy={0} rx={150} ry={22} fill="#ffb760" opacity={0.14} />
      </g>
    )}
  </g>
);

/** жёлтое такси (вид сбоку), face — направление */
export const Taxi: React.FC<{ x: number; y: number; s?: number; face?: 1 | -1; t?: number; dark?: number; col?: string }> = ({ x, y, s = 1, face = 1, t = 0, dark = 0, col = "#e3a823" }) => {
  const body = mix(col, "#000", dark);
  const wheelRot = (t * 600) % 360;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s})`}>
      <ellipse cx={0} cy={4} rx={190} ry={12} fill="#000" opacity={0.35} />
      <path d="M-190 -30 L-186 -66 C-180 -78 -160 -82 -140 -84 L-90 -86 L-56 -130 C-48 -138 -36 -140 -20 -140 L60 -140 C78 -140 90 -134 100 -122 L130 -88 L170 -82 C186 -78 194 -66 194 -50 L194 -30 Z" fill={body} />
      <path d="M-82 -88 L-50 -128 L16 -128 L16 -88 Z" fill={mix("#28323e", "#000", dark)} />
      <path d="M26 -88 L26 -128 L80 -128 C90 -128 96 -122 104 -112 L120 -88 Z" fill={mix("#28323e", "#000", dark)} />
      <rect x={-30} y={-158} width={60} height={18} rx={3} fill={mix("#f4f0e4", "#000", dark)} />
      <text x={0} y={-144} fontFamily={SANS} fontSize={12} fill="#222" textAnchor="middle" fontWeight={700}>
        TAXI
      </text>
      <line x1={-180} x2={186} y1={-56} y2={-56} stroke={mix(body, "#000", 0.3)} strokeWidth={3} />
      <rect x={180} y={-70} width={14} height={10} fill="#fff4d6" />
      <rect x={-192} y={-70} width={10} height={10} fill="#b02a1c" />
      {[-112, 118].map((wx) => (
        <g key={wx} transform={`translate(${wx} -26) rotate(${wheelRot})`}>
          <circle r={34} fill="#111" />
          <circle r={17} fill="#8a8a8a" />
          <line x1={-17} x2={17} y1={0} y2={0} stroke="#555" strokeWidth={3} />
          <line y1={-17} y2={17} x1={0} x2={0} stroke="#555" strokeWidth={3} />
        </g>
      ))}
    </g>
  );
};

/** паровая труба люка: оранжево-белая + клубы пара */
export const Steam: React.FC<{ x: number; y: number; s?: number; t: number; o?: number; stack?: boolean }> = ({ x, y, s = 1, t, o = 0.7, stack = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g opacity={o} filter="url(#b-blur14)">
      {Array.from({ length: 16 }, (_, i) => {
        const k = ((t * 0.35 + i / 16) % 1 + 1) % 1;
        const r = 30 + k * 180;
        return <circle key={i} cx={Math.sin(i * 2.1 + t) * 30 + k * 120} cy={-130 - k * 560} r={r} fill="#d9dde4" opacity={(1 - k) * 0.55} />;
      })}
    </g>
    {stack && (
      <g>
        <path d="M-34 0 L-26 -140 L26 -140 L34 0 Z" fill="#e0651e" />
        {[-110, -70, -30].map((yy) => (
          <path key={yy} d={`M${-30 + (yy + 140) * 0.02} ${yy} L${30 - (yy + 140) * 0.02} ${yy} L${31 - (yy + 140) * 0.02} ${yy + 18} L${-31 + (yy + 140) * 0.02} ${yy + 18} Z`} fill="#f1ede4" />
        ))}
      </g>
    )}
  </g>
);

/** скамейка */
export const Bench: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = "#2b2622" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-100} width={320} height={12} fill={col} />
    <rect x={-160} y={-84} width={320} height={10} fill={col} />
    <rect x={-160} y={-150} width={320} height={10} fill={col} />
    <rect x={-160} y={-132} width={320} height={10} fill={col} />
    <path d="M-140 0 L-136 -100 M140 0 L136 -100 M-136 -100 L-136 -156 M136 -100 L136 -156" stroke={mix(col, "#000", 0.4)} strokeWidth={10} />
  </g>
);

/** телефон: корпус + экран (children рисуются в координатах экрана 0..w,0..h) */
export const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; w?: number; h?: number; crack?: number; glow?: number; children?: React.ReactNode; id: string }> = ({
  x,
  y,
  s = 1,
  rot = 0,
  w = 380,
  h = 800,
  crack = 0,
  glow = 1,
  children,
  id,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <clipPath id={`ph-${id}`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={44} />
      </clipPath>
    </defs>
    {glow > 0 && <ellipse cx={0} cy={0} rx={w * 1.3} ry={h * 0.9} fill="url(#b-screen)" opacity={0.5 * glow} />}
    <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={56} fill="#0c0d10" />
    <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={56} fill="none" stroke="#3a3d44" strokeWidth={3} />
    <g clipPath={`url(#ph-${id})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#0f1218" />
      <g transform={`translate(${-w / 2} ${-h / 2})`} opacity={glow}>
        {children}
      </g>
      {crack > 0 && <Cracks w={w} h={h} k={crack} />}
    </g>
  </g>
);

/** трещины стекла, k 0..1 — насколько разошлись */
export const Cracks: React.FC<{ w: number; h: number; k: number; cx?: number; cy?: number }> = ({ w, h, k, cx = 0.62, cy = 0.28 }) => {
  const ox = -w / 2 + w * cx;
  const oy = -h / 2 + h * cy;
  return (
    <g stroke="#e9eef6" strokeWidth={1.6} fill="none" opacity={0.85}>
      {Array.from({ length: 13 }, (_, i) => {
        const a = (i / 13) * TAU + rnd(i) * 0.4;
        const L = (180 + rnd(i * 3) * 520) * cl(k * 1.4 - rnd(i * 5) * 0.4);
        const mx = ox + Math.cos(a) * L * 0.45 + (rnd(i * 7) - 0.5) * 40;
        const my = oy + Math.sin(a) * L * 0.45 + (rnd(i * 8) - 0.5) * 40;
        return <path key={i} d={`M${ox} ${oy} L${mx} ${my} L${ox + Math.cos(a + 0.1) * L} ${oy + Math.sin(a + 0.1) * L}`} />;
      })}
      {[40, 90].map((r, i) => (
        <circle key={i} cx={ox} cy={oy} r={r * cl(k * 2 - i * 0.4)} strokeDasharray="22 14" opacity={0.6} />
      ))}
      <circle cx={ox} cy={oy} r={10 * cl(k * 3)} fill="#e9eef6" opacity={0.4} />
    </g>
  );
};

/** силуэт самолёта (вид сбоку) */
export const Plane: React.FC<{ x: number; y: number; s?: number; rot?: number; col?: string; lights?: number; t?: number }> = ({ x, y, s = 1, rot = 0, col = "#1d2129", lights = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-420 -10 C-430 -40 -400 -52 -360 -52 L300 -52 C360 -52 410 -36 430 -10 C410 10 360 16 300 16 L-360 16 C-400 16 -420 6 -420 -10 Z" fill={col} />
    <path d="M-330 -52 L-420 -210 L-370 -210 L-250 -52 Z" fill={col} />
    <path d="M-60 0 L-200 150 L-150 150 L60 6 Z" fill={mix(col, "#000", 0.3)} />
    <path d="M-60 -20 L-160 -120 L-120 -120 L40 -24 Z" fill={mix(col, "#fff", 0.06)} />
    <ellipse cx={-80} cy={40} rx={70} ry={22} fill={mix(col, "#000", 0.2)} />
    {Array.from({ length: 26 }, (_, i) => (
      <rect key={i} x={-300 + i * 22} y={-34} width={9} height={11} rx={3} fill="#ffd9a3" opacity={0.75} />
    ))}
    <rect x={330} y={-38} width={40} height={14} rx={6} fill="#30363f" />
    {lights > 0 && (
      <g>
        <circle cx={-410} cy={-206} r={5} fill="#ff4b3a" opacity={0.5 + 0.5 * Math.sin(t * 6)} />
        <circle cx={-195} cy={150} r={5} fill="#3adb6c" opacity={lights} />
        <ellipse cx={-80} cy={-60} rx={8} ry={8} fill="#fff" opacity={Math.max(0, Math.sin(t * 4)) * lights} />
      </g>
    )}
  </g>
);

/** облака (мягкие слои) */
export const Clouds: React.FC<{ t: number; y: number; speed?: number; col?: string; n?: number; seed?: number; s?: number; o?: number }> = ({ t, y, speed = 60, col = "#eef0f4", n = 9, seed = 1, s = 1, o = 0.9 }) => (
  <g opacity={o} filter="url(#b-blur14)">
    {Array.from({ length: n }, (_, i) => {
      const span = W + 1400;
      const x = ((rnd(i * 3 + seed) * span - t * speed * (0.6 + rnd(i) * 0.8)) % span + span) % span - 700;
      const yy = y + (rnd(i * 5 + seed) - 0.5) * 160 * s;
      const r = (90 + rnd(i * 7) * 160) * s;
      return (
        <g key={i}>
          <ellipse cx={x} cy={yy} rx={r * 1.8} ry={r * 0.55} fill={col} />
          <ellipse cx={x + r * 0.6} cy={yy - r * 0.3} rx={r} ry={r * 0.6} fill={col} />
          <ellipse cx={x - r * 0.7} cy={yy - r * 0.15} rx={r * 0.8} ry={r * 0.45} fill={col} />
        </g>
      );
    })}
  </g>
);

/** перспективная авеню (точка схода vx,vy); offset — продвижение камеры вглубь */
export const Avenue: React.FC<{ vx?: number; vy?: number; t: number; offset?: number; night?: number; lit?: number; col?: string; snow?: number }> = ({ vx = W / 2, vy = 470, t, offset = 0, night = 0.8, lit = 0.35, col = "#1f242d", snow = 0 }) => {
  const rows = 14;
  const items: React.ReactNode[] = [];
  for (let side = -1; side <= 1; side += 2) {
    for (let i = rows - 1; i >= 0; i--) {
      const z0 = ((i + (offset % 1)) / rows);
      const d0 = Math.pow(1 - z0, 2.2) + 0.02;
      const d1 = Math.pow(1 - Math.min(1, z0 + 1 / rows), 2.2) + 0.02;
      const xA = vx + side * 2600 * d0;
      const xB = vx + side * 2600 * d1;
      const hA = 3200 * d0;
      const hB = 3200 * d1;
      const gA = vy + 900 * d0;
      const gB = vy + 900 * d1;
      const seed = i + Math.floor(offset) * 7 + (side > 0 ? 100 : 0);
      const c = mix(col, "#000", rnd(seed) * 0.35);
      const pts = `${xA},${gA} ${xA},${gA - hA} ${xB},${gB - hB} ${xB},${gB}`;
      items.push(
        <g key={`${side}-${i}`}>
          <polygon points={pts} fill={c} />
          {Array.from({ length: 9 }, (_, f) =>
            Array.from({ length: 3 }, (_, k) => {
              const u0 = (k + 0.25) / 3;
              const u1 = (k + 0.75) / 3;
              const v0 = 0.08 + f * 0.1;
              const v1 = v0 + 0.05;
              const P = (u: number, v: number) => {
                const xx = lerp(xA, xB, u);
                const g = lerp(gA, gB, u);
                const hh = lerp(hA, hB, u);
                return `${xx},${g - hh * (1 - v)}`;
              };
              const r = rnd(seed * 13 + f * 3 + k);
              const on = r < lit;
              return <polygon key={`${f}-${k}`} points={`${P(u0, v0)} ${P(u1, v0)} ${P(u1, v1)} ${P(u0, v1)}`} fill={on ? "#ffcf8e" : mix("#39414f", "#12151b", night)} opacity={on ? 0.85 : 0.7} />;
            }),
          )}
          {/* витрина первого этажа */}
          <polygon points={`${xA},${gA} ${xA},${gA - hA * 0.08} ${xB},${gB - hB * 0.08} ${xB},${gB}`} fill={rnd(seed * 5) < 0.6 ? "#d99a55" : "#2c3038"} opacity={0.55} />
        </g>,
      );
    }
  }
  return (
    <g>
      <polygon points={`${vx - 2600},${vy + 900} ${vx + 2600},${vy + 900} ${vx},${vy}`} fill={mix("#2a2d33", "#dfe3ea", snow)} />
      <polygon points={`${vx - 800},${vy + 900} ${vx + 800},${vy + 900} ${vx},${vy}`} fill={mix("#1d2026", "#bfc6d0", snow * 0.7)} />
      {Array.from({ length: 10 }, (_, i) => {
        const z = ((i + (offset * 2) % 1) / 10);
        const d = Math.pow(1 - z, 2.2);
        return <rect key={i} x={vx - 6 * d * 3} y={vy + 900 * d} width={12 * d * 3} height={60 * d} fill="#c9b27a" opacity={0.5} />;
      })}
      {items}
    </g>
  );
};

/** кадр-в-кадре: прямоугольный экран со свечением */
export const Screen: React.FC<{ x: number; y: number; w: number; h: number; id: string; glow?: number; children: React.ReactNode }> = ({ x, y, w, h, id, glow = 1, children }) => (
  <g>
    <defs>
      <clipPath id={`scr-${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
    </defs>
    <ellipse cx={x + w / 2} cy={y + h / 2} rx={w} ry={h} fill="url(#b-screen)" opacity={0.35 * glow} />
    <rect x={x} y={y} width={w} height={h} fill="#05070b" />
    <g clipPath={`url(#scr-${id})`}>{children}</g>
  </g>
);
