import React from "react";
import { Cel, NIGHT, cl, type CelColors } from "./cel";

/**
 * Голова 80-х в три четверти (смотрит вправо). Начало координат — центр лица; рост головы с волосами ≈ 400.
 * Конструкция: яйцевидное лицо с острым подбородком, миндалевидные глаза, высокий овальный зрачок,
 * волосы прядями с острыми концами над тёмным подслоем, «ангельское кольцо» блика.
 */
export const FACE =
  "M -108 -60 C -118 20 -92 80 -50 118 C -20 146 20 164 50 160 C 78 150 96 100 108 50 C 114 20 116 -20 112 -60 C 108 -130 60 -176 0 -176 C -60 -176 -104 -130 -108 -60 Z";
export const HAIR_BACK =
  "M -146 -20 C -166 -170 -60 -236 30 -232 C 130 -228 178 -150 152 -30 C 150 30 136 80 118 110 L 104 60 L 86 84 L 70 40 C 60 100 -60 100 -76 40 L -96 96 L -110 50 L -132 84 Z";
export const BANGS =
  "M -118 -40 C -126 -150 -40 -204 30 -200 C 100 -196 134 -140 122 -60 L 112 -100 L 100 -70 L 90 -112 L 72 -62 L 56 -110 L 34 -66 L 16 -108 L -4 -60 L -22 -106 L -44 -64 L -60 -102 L -82 -58 L -96 -96 L -110 -40 Z";
export const LOCK_L = "M -108 -70 C -126 -10 -124 50 -100 106 L -94 50 C -98 10 -96 -30 -88 -70 Z";
export const LOCK_R = "M 106 -80 C 124 -20 120 40 104 90 L 96 40 C 100 0 96 -40 92 -80 Z";
export const NECK = "M -40 90 C -38 130 -40 170 -50 232 L 58 232 C 52 170 52 130 52 96 Z";
export const SHOULDERS =
  "M -250 430 C -250 276 -150 214 -64 206 L 72 206 C 160 210 250 276 250 430 L 250 640 L -250 640 Z";
const COLLAR_L = "M -60 206 C -66 244 -100 264 -146 258 L -92 190 Z";
const COLLAR_R = "M 66 206 C 74 244 108 264 152 258 L 98 190 Z";

const eyePath = (o: number) => `M -40 6 Q 0 ${6 - 52 * o} 38 -2 Q 0 ${6 + 20 * o} -40 6 Z`;
const upperLash = (o: number) => `M -40 6 Q 0 ${6 - 52 * o} 38 -2`;

type EyeP = { x: number; y: number; sx: number; sy: number; flip?: boolean; o: number; look: number; squeeze: number; id: string; lwk: number };
const Eye: React.FC<EyeP> = ({ x, y, sx, sy, flip, o, look, squeeze, id, lwk }) => {
  const d = eyePath(Math.max(0.02, o));
  const irisX = (flip ? -8 : -4) + look * 9;
  const ry = 22 * (0.9 + squeeze * 0.1);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -sx : sx} ${sy})`}>
      <defs>
        <clipPath id={`eye${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <Cel d={d} id={`ew${id}`} c={{ lit: "#f7f1f7", shadow: "#cbb8dc", line: "none" }} light={[0, 1]} sh={9} lw={0} />
      <g clipPath={`url(#eye${id})`}>
        <ellipse cx={irisX} cy={-2} rx={16} ry={ry} fill="#1a2c68" />
        <ellipse cx={irisX} cy={7} rx={13} ry={ry * 0.55} fill="#3f9fe2" />
        <ellipse cx={irisX} cy={-2} rx={7.5 * (1 - (1 - squeeze) * 0.3)} ry={ry * 0.5 * squeeze} fill="#090d2a" />
        <circle cx={irisX - 7} cy={-12} r={5.6} fill="#fff" />
        <circle cx={irisX + 6} cy={8} r={2.6} fill="#fff" opacity={0.9} />
        {/* тень века на глазном яблоке */}
        <path d={`M -40 6 Q 0 ${6 - 52 * o} 38 -2 L 38 -24 L -40 -24 Z`} fill="#2a1a60" opacity={0.28} />
      </g>
      <path d={upperLash(Math.max(0.02, o))} fill="none" stroke="#150c38" strokeWidth={6.5 * lwk} strokeLinecap="round" />
      <path d={`M -40 6 L -52 -4`} stroke="#150c38" strokeWidth={5 * lwk} strokeLinecap="round" />
      <path d={`M -34 ${-1} Q 0 ${-8 - 56 * o} 36 -10`} fill="none" stroke="#7b3f33" strokeWidth={1.8 * lwk} opacity={o > 0.3 ? 0.7 : 0} />
      <path d={`M -36 10 Q 0 ${10 + 18 * o} 34 2`} fill="none" stroke="#7b3f33" strokeWidth={1.6 * lwk} opacity={0.6} />
    </g>
  );
};

export type HeadP = {
  id: string;
  x?: number;
  y?: number;
  s?: number;
  /** 0..1 — насколько открыт глаз */
  open?: number;
  look?: number;
  /** 0.6..1.2 — зрачок (решимость сужает) */
  squeeze?: number;
  /** угол покачивания прядей, градусы */
  swing?: number;
  brow?: number;
  mouth?: "flat" | "set" | "open";
  /** множитель толщины контура (в крупных планах < 1) */
  lwk?: number;
  rim?: boolean;
  tilt?: number;
};

export const Head: React.FC<HeadP> = ({ id, x = 0, y = 0, s = 1, open = 1, look = 0.4, squeeze = 1, swing = 0, brow = 0, mouth = "set", lwk = 1, rim = true, tilt = 0 }) => {
  const lw = 2.4 * lwk;
  const skin: CelColors = { ...NIGHT.skin };
  const hair: CelColors = { ...NIGHT.hair };
  const rimW = rim ? 4 : 0;
  const mouthD = mouth === "open" ? "M 8 106 C 22 112 38 110 48 102 C 40 122 18 124 8 106 Z" : mouth === "set" ? "M 8 108 C 22 112 38 110 48 102" : "M 8 106 C 22 108 38 108 48 102";
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt})`}>
      {/* волосы: тёмный подслой шире */}
      <g transform={`rotate(${swing * 0.4} 0 -120)`}>
        <Cel d={HAIR_BACK} id={`${id}hb`} c={{ ...hair, lit: "#2a2260" }} light={[-0.8, -0.7]} sh={18} hl={0} rimW={rimW} lw={lw} />
      </g>
      <Cel d={NECK} id={`${id}nk`} c={skin} light={[-0.5, -0.8]} sh={18} lw={lw} />
      {/* тень подбородка на шее — вручную */}
      <clipPath id={`${id}nkc`}>
        <path d={NECK} />
      </clipPath>
      <path d="M -50 96 C -10 168 40 168 60 100 L 60 70 L -50 70 Z" fill="#cf7f78" opacity={0.9} clipPath={`url(#${id}nkc)`} />
      <Cel d={FACE} id={`${id}fc`} c={skin} light={[-0.85, -0.5]} sh={16} hl={9} rimW={rimW} lw={lw} />
      {/* тень чёлки на лбу */}
      <clipPath id={`${id}fcc`}>
        <path d={FACE} />
      </clipPath>
      <g clipPath={`url(#${id}fcc)`}>
        <path d="M -112 -52 L -96 -84 L -82 -38 L -60 -80 L -44 -42 L -22 -82 L -4 -38 L 16 -84 L 34 -44 L 56 -88 L 72 -40 L 90 -90 L 100 -46 L 112 -60 L 112 -140 L -112 -140 Z" fill="#e49a86" opacity={0.95} />
        {/* румянец — одним слоем, без штриховки */}
        <ellipse cx={-66} cy={54} rx={30} ry={13} fill="#ff8a9a" opacity={0.28} />
      </g>
      {/* нос: плоскость тени + один штрих */}
      <path d="M 12 20 L 22 52 L 8 56 Z" fill="#e49a86" opacity={0.9} />
      <path d="M 14 30 C 20 46 26 54 14 58" fill="none" stroke="#7b3f33" strokeWidth={1.9 * lwk} strokeLinecap="round" />
      {/* рот */}
      <path d={mouthD} fill={mouth === "open" ? "#7a2a3a" : "none"} stroke="#7b3f33" strokeWidth={2.4 * lwk} strokeLinecap="round" />
      {/* глаза */}
      <Eye id={`${id}a`} x={-38} y={-4} sx={1} sy={1} o={open} look={look} squeeze={squeeze} lwk={lwk} />
      <Eye id={`${id}b`} x={68} y={-6} sx={0.7} sy={0.97} flip o={open} look={look} squeeze={squeeze} lwk={lwk} />
      {/* брови */}
      <path d={`M -98 ${-42 + brow * 5} C -70 ${-60 + brow * 6} -34 ${-58 + brow * 3} -8 ${-44 - brow * 2}`} fill="none" stroke="#150c38" strokeWidth={4 * lwk} strokeLinecap="round" />
      <path d={`M 40 ${-46 - brow * 2} C 60 ${-58 + brow * 3} 84 ${-56 + brow * 5} 98 ${-44 + brow * 6}`} fill="none" stroke="#150c38" strokeWidth={3.4 * lwk} strokeLinecap="round" />
      {/* пряди */}
      <g transform={`rotate(${swing} 0 -170)`}>
        <Cel d={BANGS} id={`${id}bg`} c={hair} light={[-0.8, -0.8]} sh={16} hl={12} rimW={rimW} lw={lw} />
        {/* ангельское кольцо с зигзагом по нижнему краю */}
        <clipPath id={`${id}bgc`}>
          <path d={BANGS} />
        </clipPath>
        <path d="M -96 -128 C -50 -184 60 -186 112 -126 L 100 -118 L 88 -132 L 72 -112 L 58 -136 C 22 -150 -30 -148 -66 -114 L -80 -134 Z" fill="#8a7be0" opacity={0.95} clipPath={`url(#${id}bgc)`} />
      </g>
      <g transform={`rotate(${swing * 1.6} -100 -60)`}>
        <Cel d={LOCK_L} id={`${id}ll`} c={hair} light={[-0.8, -0.6]} sh={10} lw={lw} />
      </g>
      <g transform={`rotate(${-swing * 1.2} 100 -70)`}>
        <Cel d={LOCK_R} id={`${id}lr`} c={hair} light={[-0.8, -0.6]} sh={10} rimW={rimW} lw={lw} />
      </g>
    </g>
  );
};

/** силуэт головы + плеч одним цветом (для кадра-удара) */
export const HeadSil: React.FC<{ x?: number; y?: number; s?: number; fill: string; tilt?: number }> = ({ x = 0, y = 0, s = 1, fill, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt})`} fill={fill}>
    <path d={HAIR_BACK} />
    <path d={FACE} />
    <path d={NECK} />
    <path d={BANGS} />
    <path d={LOCK_L} />
    <path d={LOCK_R} />
    <path d={SHOULDERS} />
  </g>
);

export const Bust: React.FC<{ id: string; s?: number; x?: number; y?: number; rim?: boolean; breath?: number }> = ({ id, s = 1, x = 0, y = 0, rim = true, breath = 0 }) => {
  const rimW = rim ? 5 : 0;
  return (
    <g transform={`translate(${x} ${y + breath}) scale(${s})`}>
      <Cel d={SHOULDERS} id={`${id}sh`} c={NIGHT.jacket} light={[-0.8, -0.6]} sh={26} hl={10} rimW={rimW} lw={2.6} />
      <Cel d={COLLAR_L} id={`${id}cl`} c={NIGHT.jacket2} light={[-0.8, -0.6]} sh={9} lw={2.4} />
      <Cel d={COLLAR_R} id={`${id}cr`} c={NIGHT.jacket2} light={[-0.8, -0.6]} sh={9} rimW={rimW} lw={2.4} />
      <path d="M 4 232 L 4 640" stroke="#4a0f2a" strokeWidth={3} />
      <path d="M 4 232 L 22 244" stroke="#4a0f2a" strokeWidth={3} />
    </g>
  );
};

export const clamp = cl;
