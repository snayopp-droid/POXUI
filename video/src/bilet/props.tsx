import React from "react";
import { SANS, SERIF, TAU, cl, mix, nz, rnd } from "./core";
import { A, Z } from "./timeline";

/** открыт ли рот: внутри реплики — колебание */
export const talk = (t: number, from: string, to: string, occA = 0, occZ = 0) => {
  const a = A(from, occA);
  const b = Z(to, occZ);
  if (t < a || t > b) return 0;
  return cl(0.35 + 0.65 * Math.abs(Math.sin(t * 11 + Math.sin(t * 4.7) * 2)));
};

/** фигура со спины (идёт от камеры), рюкзак */
export const BackFigure: React.FC<{ x: number; y: number; s?: number; t: number; walk?: number; hood?: boolean; bag?: boolean; col?: string; rim?: string; look?: number }> = ({
  x,
  y,
  s = 1,
  t,
  walk = 1,
  hood = true,
  bag = true,
  col = "#2c3440",
  rim = "#ffcf94",
  look = 0,
}) => {
  const ph = t * 5.2;
  const sw = Math.sin(ph) * walk;
  const bob = Math.abs(Math.sin(ph)) * 6 * walk;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${s})`}>
      <ellipse cx={0} cy={bob} rx={70} ry={10} fill="#000" opacity={0.35} />
      {/* ноги */}
      <path d={`M-20 -170 L${-22 + sw * 4} ${-4 - Math.max(0, sw) * 16}`} stroke="#1c1f25" strokeWidth={34} strokeLinecap="round" />
      <path d={`M20 -170 L${22 - sw * 4} ${-4 - Math.max(0, -sw) * 16}`} stroke="#1c1f25" strokeWidth={34} strokeLinecap="round" />
      {/* руки */}
      <path d={`M-50 -300 L${-62 - sw * 6} -190`} stroke={mix(col, "#000", 0.2)} strokeWidth={26} strokeLinecap="round" />
      <path d={`M50 -300 L${62 - sw * 6} -190`} stroke={mix(col, "#000", 0.2)} strokeWidth={26} strokeLinecap="round" />
      {/* куртка */}
      <path d="M-56 -320 C-64 -260 -60 -200 -50 -160 L50 -160 C60 -200 64 -260 56 -320 C30 -336 -30 -336 -56 -320 Z" fill={col} />
      {bag && (
        <g>
          <rect x={-40} y={-318} width={80} height={120} rx={20} fill={mix(col, "#0a0a0a", 0.55)} />
          <rect x={-30} y={-250} width={60} height={34} rx={8} fill={mix(col, "#0a0a0a", 0.4)} />
        </g>
      )}
      {/* голова */}
      <g transform={`translate(0 -350) rotate(${look * 8})`}>
        <ellipse cx={0} cy={0} rx={30} ry={34} fill={hood ? mix(col, "#000", 0.1) : "#17130f"} />
        {hood && <path d="M-34 10 C-40 -30 -20 -44 0 -44 C20 -44 40 -30 34 10 Z" fill={mix(col, "#000", 0.15)} />}
      </g>
      <path d="M56 -320 C64 -260 60 -200 50 -160" stroke={rim} strokeWidth={3} fill="none" opacity={0.6} />
    </g>
  );
};

/** лицо анфас для селфи-видео */
export const FrontFace: React.FC<{ x: number; y: number; s?: number; grin?: number; mouth?: number; hood?: boolean; t?: number }> = ({ x, y, s = 1, grin = 1, mouth = 0, hood = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {hood && <path d="M-150 200 C-170 40 -140 -150 0 -160 C140 -150 170 40 150 200 Z" fill="#2f3846" />}
    <rect x={-40} y={90} width={80} height={80} fill="#a97c5e" />
    <ellipse cx={0} cy={0} rx={96} ry={122} fill="#c69a7a" />
    <path d="M-96 -20 C-100 -110 -40 -140 10 -136 C70 -132 100 -90 96 -30 C70 -70 30 -84 -10 -80 C-50 -76 -80 -50 -96 -20 Z" fill="#17130f" />
    <ellipse cx={-36} cy={-4} rx={12} ry={8} fill="#f1ebe2" />
    <ellipse cx={36} cy={-4} rx={12} ry={8} fill="#f1ebe2" />
    <circle cx={-34} cy={-3} r={6} fill="#1a1310" />
    <circle cx={38} cy={-3} r={6} fill="#1a1310" />
    <path d="M-56 -30 Q-36 -42 -16 -32 M16 -32 Q36 -42 56 -30" stroke="#17130f" strokeWidth={7} strokeLinecap="round" fill="none" />
    <path d="M0 0 L-10 40 L8 42" stroke="#8a6248" strokeWidth={4} fill="none" />
    <path d={`M-44 ${66 - grin * 6} Q0 ${86 + grin * 14 + mouth * 10} 44 ${66 - grin * 6}`} fill={mouth > 0.1 || grin > 0.5 ? "#4a1e18" : "none"} stroke="#5a2a20" strokeWidth={4} />
    {grin > 0.5 && <path d={`M-34 ${68 - grin * 4} Q0 ${76 + grin * 4} 34 ${68 - grin * 4}`} fill="#f3eee6" />}
    <ellipse cx={-70} cy={30} rx={18} ry={10} fill="#d98c7a" opacity={0.25} />
    <ellipse cx={70} cy={30} rx={18} ry={10} fill="#d98c7a" opacity={0.25} />
  </g>
);

/** кисть руки (упрощённая) */
export const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number; skin?: string; sleeve?: string; grip?: number }> = ({ x, y, s = 1, rot = 0, skin = "#c69a7a", sleeve = "#2c3440", grip = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-46} width={230} height={92} rx={30} fill={sleeve} />
    <path d="M-90 -40 C-40 -52 20 -44 40 -30 C70 -30 96 -26 98 -14 C96 -4 70 -4 50 -6 L52 10 C80 12 100 18 98 28 C94 38 70 36 48 34 C30 48 -30 50 -90 40 Z" fill={skin} />
    <path d="M40 -30 C60 -24 70 -18 72 -10" stroke={mix(skin, "#000", 0.25)} strokeWidth={2} fill="none" />
    {grip > 0 && <path d="M-20 -44 C0 -70 30 -76 40 -60" stroke={skin} strokeWidth={22} strokeLinecap="round" fill="none" />}
  </g>
);

/** купюра доллара (стилизованная, не копия) */
export const Bill: React.FC<{ x: number; y: number; s?: number; rot?: number; val?: string; o?: number }> = ({ x, y, s = 1, rot = 0, val = "20", o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-156} y={-66} width={312} height={132} rx={6} fill="#c9cdb6" />
    <rect x={-146} y={-56} width={292} height={112} rx={4} fill="none" stroke="#6f7c64" strokeWidth={3} />
    <ellipse cx={0} cy={0} rx={44} ry={50} fill="#a9b096" />
    <ellipse cx={0} cy={0} rx={44} ry={50} fill="none" stroke="#6f7c64" strokeWidth={2} />
    <text x={-118} y={-22} fontFamily={SERIF} fontSize={30} fill="#55624d">
      {val}
    </text>
    <text x={118} y={44} fontFamily={SERIF} fontSize={30} fill="#55624d" textAnchor="end">
      {val}
    </text>
  </g>
);

/** паспорт */
export const Passport: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number; page?: "visa" | "blank" | "stamp"; stamp?: number }> = ({ x, y, s = 1, rot = 0, open = 1, page = "blank", stamp = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-20} y={-200} width={300} height={400} rx={10} fill="#e9e2d2" />
    <g transform={`scale(${-0.2 - open * 0.8} 1)`}>
      <rect x={20} y={-200} width={300} height={400} rx={10} fill={open > 0.5 ? "#e3dccb" : "#6b1f22"} />
    </g>
    <line x1={0} y1={-200} x2={0} y2={200} stroke="#bdb4a0" strokeWidth={3} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={30} x2={250} y1={-150 + i * 34} y2={-150 + i * 34} stroke="#cfc6b2" strokeWidth={1.4} />
    ))}
    {page === "visa" && (
      <g>
        <rect x={30} y={-170} width={240} height={250} rx={8} fill="#dfe4ea" stroke="#9aa6b6" />
        <text x={150} y={-130} fontFamily={SERIF} fontSize={30} fill="#3d4a62" textAnchor="middle" letterSpacing={6}>
          VISA
        </text>
        <rect x={50} y={-100} width={80} height={100} fill="#b9a493" />
        <rect x={140} y={-96} width={110} height={10} fill="#8a96a8" />
        <rect x={140} y={-72} width={90} height={10} fill="#8a96a8" />
        <rect x={140} y={-48} width={100} height={10} fill="#8a96a8" />
        <text x={150} y={50} fontFamily={SANS} fontSize={20} fill="#3d4a62" textAnchor="middle" letterSpacing={3}>
          TOURIST · B2
        </text>
      </g>
    )}
    {stamp > 0 && (
      <g transform={`translate(150 90) rotate(-12) scale(${1 + (1 - cl(stamp * 4)) * 0.3})`} opacity={cl(stamp * 4)}>
        <rect x={-110} y={-56} width={220} height={112} rx={10} fill="none" stroke="#3a4f8a" strokeWidth={5} />
        <text x={0} y={-14} fontFamily={SANS} fontSize={30} fill="#3a4f8a" textAnchor="middle" fontWeight={700} letterSpacing={4}>
          ADMITTED
        </text>
        <text x={0} y={26} fontFamily={SANS} fontSize={20} fill="#3a4f8a" textAnchor="middle" letterSpacing={2}>
          NOV 27 · JFK
        </text>
      </g>
    )}
  </g>
);

/** волна голосового сообщения */
export const Wave: React.FC<{ x: number; y: number; w: number; t: number; amp: number; n?: number; col?: string }> = ({ x, y, w, t, amp, n = 38, col = "#e9edf3" }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const h = 6 + amp * (14 + 46 * Math.abs(nz(t * 9 + i * 0.7, i)));
      return <rect key={i} x={x + (i * w) / n} y={y - h / 2} width={(w / n) * 0.55} height={h} rx={2} fill={col} opacity={0.85} />;
    })}
  </g>
);

/** голые деревья (парк, двор) */
export const Tree: React.FC<{ x: number; y: number; s?: number; seed?: number; col?: string }> = ({ x, y, s = 1, seed = 1, col = "#1d1f22" }) => {
  const branch = (x0: number, y0: number, a: number, l: number, d: number, key: string): React.ReactNode[] => {
    if (d === 0 || l < 8) return [];
    const x1 = x0 + Math.sin(a) * l;
    const y1 = y0 - Math.cos(a) * l;
    const sp = 0.35 + rnd(seed + l + d) * 0.3;
    return [
      <line key={key} x1={x0} y1={y0} x2={x1} y2={y1} stroke={col} strokeWidth={d * 2.4} strokeLinecap="round" />,
      ...branch(x1, y1, a - sp, l * 0.72, d - 1, key + "l"),
      ...branch(x1, y1, a + sp * 0.9, l * 0.7, d - 1, key + "r"),
    ];
  };
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{branch(0, 0, (rnd(seed) - 0.5) * 0.2, 150, 6, "b")}</g>;
};

/** пар изо рта */
export const Breath: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; o?: number }> = ({ x, y, t, dir = 1, o = 0.5 }) => {
  const k = (t % 3.2) / 3.2;
  return (
    <g filter="url(#b-blur6)" opacity={o * Math.sin(k * Math.PI)}>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + dir * (20 + k * 120 + i * 24)} cy={y - k * 30 - i * 6} r={14 + k * 40 + i * 6} fill="#e6ebf2" opacity={0.5} />
      ))}
    </g>
  );
};

/** цифровой счётчик денег */
export const Money: React.FC<{ x: number; y: number; v: number; size?: number; col?: string; o?: number }> = ({ x, y, v, size = 140, col = "#f1ece2", o = 1 }) => (
  <text x={x} y={y} fontFamily={SERIF} fontSize={size} fill={col} textAnchor="middle" opacity={o} letterSpacing={size * 0.04}>
    ${Math.round(v).toLocaleString("en-US").replace(/,/g, " ")}
  </text>
);

export const spin = (t: number, f = 1) => (t * f * TAU) % TAU;
