import React from "react";
import { Cel, H, NIGHT, W, cl, lerp, rnd } from "./cel";

/** «Фон, написанный аэрографом»: цветовая пластина + парная эмиссивная пластина (светящиеся окна и вывески). */
const BASE = 1640; // линия, где здания встают на улицу (координаты высокой пластины)

const Sky: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="a80sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0a0830" />
        <stop offset="0.45" stopColor="#2a1668" />
        <stop offset="0.72" stopColor="#8a2a8e" />
        <stop offset="0.88" stopColor="#ee5c8c" />
        <stop offset="0.97" stopColor="#ffb070" />
        <stop offset="1" stopColor="#ffd9a0" />
      </linearGradient>
    </defs>
    <rect x={-600} y={-1200} width={W + 1200} height={BASE + 1200} fill="url(#a80sky)" />
  </g>
);

/** воздушные облака с освещённым снизу брюхом */
const Clouds: React.FC = () => (
  <g>
    <g filter="url(#a80blur16)">
      {Array.from({ length: 9 }, (_, i) => {
        const x = -200 + i * 270 + rnd(i) * 80;
        const y = 880 + (i % 3) * 120 + rnd(i * 3) * 50;
        const w = 220 + rnd(i * 5) * 160;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={w} ry={46} fill="#3a2478" />
            <ellipse cx={x + w * 0.2} cy={y - 30} rx={w * 0.6} ry={40} fill="#4a2e90" />
            <ellipse cx={x} cy={y + 30} rx={w * 0.9} ry={14} fill="#ff6aa8" opacity={0.85} />
          </g>
        );
      })}
    </g>
  </g>
);

type Layer = { n: number; seed: number; wMin: number; wMax: number; hMin: number; hMax: number; col: string; x0: number; x1: number; winP: number; win: number };

const layerBuildings = (L: Layer) => {
  const out: { x: number; w: number; h: number; i: number }[] = [];
  let x = L.x0;
  let i = 0;
  while (x < L.x1) {
    const w = lerp(L.wMin, L.wMax, rnd(L.seed + i * 3));
    const h = lerp(L.hMin, L.hMax, Math.pow(rnd(L.seed + i * 7), 1.2));
    out.push({ x, w, h, i });
    x += w + lerp(0, 14, rnd(i + L.seed));
    i++;
  }
  return out;
};

const Skyline: React.FC<{ L: Layer; emis: boolean }> = ({ L, emis }) => (
  <g>
    {layerBuildings(L).map((b) => {
      const cols = Math.max(2, Math.floor(b.w / (L.win * 1.8)));
      const rows = Math.floor(b.h / (L.win * 2.2));
      const cw = b.w / cols;
      const rh = (b.h - 20) / rows;
      return (
        <g key={b.i}>
          {!emis && <rect x={b.x} y={BASE - b.h} width={b.w} height={b.h + 4} fill={L.col} />}
          {!emis && rnd(b.i + L.seed * 9) > 0.55 && <rect x={b.x + b.w * 0.3} y={BASE - b.h - 40} width={b.w * 0.4} height={42} fill={L.col} />}
          {emis &&
            Array.from({ length: rows }, (_, r) =>
              Array.from({ length: cols }, (_, c) => {
                const q = rnd(L.seed * 31 + b.i * 17 + r * 5 + c * 3);
                if (q > L.winP) return null;
                const tint = q < L.winP * 0.12 ? "#58e8ff" : q < L.winP * 0.2 ? "#ff7ad9" : "#ffd36b";
                return <rect key={`${r}-${c}`} x={b.x + c * cw + cw * 0.22} y={BASE - b.h + 14 + r * rh} width={cw * 0.5} height={rh * 0.46} fill={tint} />;
              }),
            )}
        </g>
      );
    })}
  </g>
);

const FAR: Layer = { n: 0, seed: 11, wMin: 60, wMax: 120, hMin: 220, hMax: 520, col: "#2c1e78", x0: -300, x1: 2300, winP: 0.28, win: 7 };
const MID: Layer = { n: 0, seed: 23, wMin: 120, wMax: 200, hMin: 320, hMax: 760, col: "#1e1560", x0: -300, x1: 2300, winP: 0.38, win: 11 };

/** высокая башня-«рамка» с вывеской */
const Tower: React.FC<{ x: number; w: number; h: number; emis: boolean; side: "l" | "r" }> = ({ x, w, h, emis, side }) => (
  <g>
    {!emis && (
      <g>
        <rect x={x} y={BASE - h} width={w} height={h + 4} fill="#120c3c" />
        <rect x={x - 10} y={BASE - h - 14} width={w + 20} height={18} fill="#0b0730" />
      </g>
    )}
    {emis &&
      Array.from({ length: 12 }, (_, r) =>
        Array.from({ length: Math.floor(w / 60) }, (_, c) => {
          const q = rnd(r * 13 + c * 7 + (side === "l" ? 3 : 90));
          if (q > 0.42) return null;
          return <rect key={`${r}-${c}`} x={x + 18 + c * 60} y={BASE - h + 40 + r * 70} width={30} height={34} fill={q < 0.1 ? "#58e8ff" : "#ffd36b"} />;
        }),
      )}
    {/* вывеска: только общие слова, без брендов */}
    {emis && side === "l" && (
      <g>
        <rect x={x + w - 56} y={BASE - h + 260} width={46} height={300} fill="#ff2fa0" />
        {"HOTEL".split("").map((ch, i) => (
          <text key={i} x={x + w - 33} y={BASE - h + 308 + i * 56} fontFamily="Inter, sans-serif" fontWeight={900} fontSize={42} fill="#fff" textAnchor="middle">
            {ch}
          </text>
        ))}
      </g>
    )}
    {emis && side === "r" && (
      <g>
        <rect x={x + 10} y={BASE - 420} width={250} height={70} rx={8} fill="#18d8ff" />
        <text x={x + 135} y={BASE - 368} fontFamily="Inter, sans-serif" fontWeight={900} fontSize={52} fill="#07203a" textAnchor="middle" letterSpacing={6}>
          BAR 24
        </text>
      </g>
    )}
  </g>
);

export const Defs80: React.FC = () => (
  <defs>
    <filter id="a80blur16" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation={16} />
    </filter>
    <filter id="a80blur6" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={6} />
    </filter>
    <filter id="a80bloom" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation={14} />
    </filter>
    <filter id="a80blur40" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation={40} />
    </filter>
    <filter id="a80blur24" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation={24} />
    </filter>
  </defs>
);

/**
 * Многоплановый кран по высокой пластине. camY — какая линия пластины в центре кадра, camX — сдвиг.
 * Слои скользят с разной скоростью (факторы), конечное положение camEnd совпадает с нарисованным.
 */
export const Plate: React.FC<{ camY: number; camEnd?: number; camX?: number; hero?: React.ReactNode; wet?: boolean }> = ({ camY, camEnd = 1020, camX = 0, hero, wet = true }) => {
  const dy = (k: number) => -camEnd - (camY - camEnd) * k;
  const dx = (k: number) => -camX * k;
  const layer = (k: number, children: React.ReactNode, extra = "") => <g transform={`translate(${dx(k)} ${dy(k)}) ${extra}`}>{children}</g>;
  const fx = (emis: boolean, k: number) => (
    <>
      {layer(k * 0.65, <Skyline L={FAR} emis={emis} />)}
      {layer(k * 0.8, <Skyline L={MID} emis={emis} />)}
      {layer(k * 0.95, <Tower x={-60} w={400} h={1020} emis={emis} side="l" />)}
      {layer(k * 0.95, <Tower x={1560} w={400} h={880} emis={emis} side="r" />)}
    </>
  );
  return (
    <g>
      {layer(0.25, <Sky />)}
      {layer(0.35, <Clouds />)}
      {/* цвет + эмиссия (+ размытая эмиссия = ореол) */}
      {fx(false, 1)}
      {fx(true, 1)}
      <g style={{ mixBlendMode: "screen" }} filter="url(#a80bloom)" opacity={0.85}>
        {fx(true, 1)}
      </g>
      {/* улица */}
      {layer(
        1,
        <g>
          <defs>
            <linearGradient id="a80st" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a1f7a" />
              <stop offset="1" stopColor="#120b34" />
            </linearGradient>
            <clipPath id="a80stc">
              <rect x={-600} y={BASE} width={W + 1200} height={700} />
            </clipPath>
          </defs>
          <rect x={-600} y={BASE} width={W + 1200} height={700} fill="url(#a80st)" />
          {wet && (
            <g clipPath="url(#a80stc)">
              <g transform={`translate(0 ${BASE * 2}) scale(1 -1)`} opacity={0.3} filter="url(#a80blur6)">
                <Skyline L={MID} emis={false} />
                <Skyline L={MID} emis />
                <Tower x={-60} w={400} h={1020} emis side="l" />
                <Tower x={1560} w={400} h={880} emis side="r" />
              </g>
              {Array.from({ length: 22 }, (_, i) => (
                <ellipse key={i} cx={rnd(i) * W} cy={BASE + 40 + rnd(i * 3) * 380} rx={90 + rnd(i * 5) * 240} ry={3 + rnd(i * 7) * 4} fill={i % 3 ? "#ff6ad0" : "#58e8ff"} opacity={0.16} />
              ))}
              <rect x={-600} y={BASE} width={W + 1200} height={8} fill="#ffb070" opacity={0.7} />
            </g>
          )}
        </g>,
      )}
      {hero && layer(1, hero)}
    </g>
  );
};

/** маленький плоский герой в огромном мире (вид со спины в три четверти, кромка неона) */
export const MiniHero: React.FC<{ x: number; y: number; s?: number; step?: number }> = ({ x, y, s = 1, step = 0 }) => {
  const sw = step * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={4} cy={6} rx={46} ry={8} fill="#000" opacity={0.35} />
      <Cel id="mh1" c={NIGHT.pants} d={`M -26 -110 L ${-22 - sw} -8 L ${4 - sw} -8 L 6 -110 Z`} rimW={3} sh={8} lw={2} />
      <Cel id="mh2" c={NIGHT.pants} d={`M 8 -110 L ${14 + sw} -8 L ${40 + sw} -8 L 30 -110 Z`} rimW={3} sh={8} lw={2} />
      <Cel id="mh3" c={NIGHT.shoe} d={`M ${-30 - sw} -10 L ${6 - sw} -10 L ${8 - sw} 4 L ${-34 - sw} 4 Z`} sh={5} lw={2} />
      <Cel id="mh4" c={NIGHT.shoe} d={`M ${12 + sw} -10 L ${44 + sw} -10 L ${48 + sw} 4 L ${8 + sw} 4 Z`} sh={5} lw={2} />
      <Cel id="mh5" c={NIGHT.jacket} d="M -34 -112 C -40 -170 -30 -196 0 -200 C 30 -196 42 -170 36 -112 Z" rimW={4} sh={9} hl={5} lw={2.2} />
      <Cel id="mh6" c={NIGHT.jacket2} d="M 28 -190 C 44 -150 44 -120 38 -100 L 24 -104 C 26 -130 24 -160 14 -186 Z" rimW={3} sh={6} lw={2} />
      <Cel id="mh7" c={NIGHT.skin} d="M -16 -224 C -18 -246 22 -248 24 -224 C 22 -204 -12 -204 -16 -224 Z" rimW={3} sh={6} lw={1.8} />
      <Cel id="mh8" c={NIGHT.hair} d="M -22 -226 C -26 -258 10 -266 26 -250 C 30 -240 26 -230 22 -224 C 10 -240 -10 -236 -22 -226 Z" rimW={3} sh={6} hl={4} lw={1.8} />
    </g>
  );
};

/** дождь на единицах (24 кадра/с): штрихи-капли */
export const Rain: React.FC<{ f: number; n?: number; o?: number; slant?: number }> = ({ f, n = 130, o = 0.55, slant = 0.22 }) => (
  <g opacity={o} stroke="#c6d6ff" strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => {
      const sp = 70 + rnd(i * 5) * 60;
      const y = ((rnd(i * 3) * 1400 + f * sp) % 1400) - 160;
      const x = rnd(i) * 2300 - 200 - y * slant;
      const L = 40 + rnd(i * 9) * 50;
      return <line key={i} x1={x} y1={y} x2={x - L * slant} y2={y + L} strokeWidth={1.4 + rnd(i * 11) * 1.6} opacity={0.35 + rnd(i * 13) * 0.5} />;
    })}
  </g>
);

/** размытый бокэ-фон для держанного плана */
export const Bokeh: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="a80bk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#120c40" />
        <stop offset="0.6" stopColor="#4a1c80" />
        <stop offset="1" stopColor="#b02a86" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#a80bk)" />
    <g filter="url(#a80blur24)">
      {Array.from({ length: 30 }, (_, i) => {
        const x = (rnd(i) * 2200 - 150 + f * (0.4 + rnd(i * 2) * 0.6) * 0.8) % 2200;
        const y = 320 + rnd(i * 3) * 700;
        const r = 40 + rnd(i * 5) * 90;
        const c = ["#ff4fb8", "#58e8ff", "#ffd36b", "#ff8a4a"][i % 4];
        return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={0.55} />;
      })}
    </g>
    <g filter="url(#a80blur40)" opacity={0.7}>
      <rect x={-100} y={640} width={W + 200} height={80} fill="#ffb070" opacity={0.6} />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={i * 300 - 60} y={380 + rnd(i) * 180} width={170 + rnd(i * 3) * 120} height={420} fill="#1b1060" opacity={0.7} />
      ))}
    </g>
  </g>
);

export const _u = { cl, H };
