import React from "react";

export const W = 1920;
export const H = 1080;
export const FPS = 24;

export const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ramp = (x: number, a: number, b: number) => cl((x - a) / (b - a));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const eio = (x: number) => {
  const v = cl(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
export const eout = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** один «слой краски» ячейки: цвета заливки, тени, блика, контура */
export type CelColors = { lit: string; shadow: string; hi?: string; line: string; rim?: string };

type V2 = [number, number];

/**
 * Cel: плоская заливка + ЖЁСТКИЙ полумесяц тени + ЖЁСТКИЙ полумесяц блика + цветной контур
 * + неоновая кромка (rim). Всё из одной формы, сдвинутой к свету / от света.
 * light — направление К источнику света, rimDir — направление К кромочному свету.
 */
export const Cel: React.FC<{
  d: string;
  c: CelColors;
  id: string;
  light?: V2;
  sh?: number;
  hl?: number;
  rimW?: number;
  rimDir?: V2;
  lw?: number;
  opacity?: number;
}> = ({ d, c, id, light = [-0.8, -0.6], sh = 14, hl = 0, rimW = 0, rimDir = [1, 0.2], lw = 2.4, opacity = 1 }) => {
  const k = `c${id}`;
  const L = light;
  const R = rimDir;
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={`${k}c`}>
          <path d={d} />
        </clipPath>
        {hl > 0 && c.hi && (
          <mask id={`${k}h`} maskUnits="userSpaceOnUse" x={-3000} y={-3000} width={6000} height={6000}>
            <path d={d} fill="#fff" />
            <path d={d} fill="#000" transform={`translate(${-L[0] * hl} ${-L[1] * hl})`} />
          </mask>
        )}
        {rimW > 0 && c.rim && (
          <mask id={`${k}r`} maskUnits="userSpaceOnUse" x={-3000} y={-3000} width={6000} height={6000}>
            <path d={d} fill="#fff" />
            <path d={d} fill="#000" transform={`translate(${-R[0] * rimW} ${-R[1] * rimW})`} />
          </mask>
        )}
      </defs>
      <path d={d} fill={c.shadow} />
      <g clipPath={`url(#${k}c)`}>
        <path d={d} fill={c.lit} transform={`translate(${L[0] * sh} ${L[1] * sh})`} />
      </g>
      {hl > 0 && c.hi && <rect x={-3000} y={-3000} width={6000} height={6000} fill={c.hi} mask={`url(#${k}h)`} />}
      {rimW > 0 && c.rim && <rect x={-3000} y={-3000} width={6000} height={6000} fill={c.rim} mask={`url(#${k}r)`} />}
      <path d={d} fill="none" stroke={c.line} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
};

/** палитра «ночной город» (цветовая модель — не фильтр) */
export const NIGHT = {
  skin: { lit: "#fbd3b4", shadow: "#e49a86", hi: "#fff0dc", line: "#7b3f33", rim: "#ff7ad9" } as CelColors,
  hair: { lit: "#3a2f78", shadow: "#1c1547", hi: "#8a7be0", line: "#0f0a2c", rim: "#ff4fd8" } as CelColors,
  jacket: { lit: "#f0583c", shadow: "#a6284f", hi: "#ff9a72", line: "#4a0f2a", rim: "#ff4fd8" } as CelColors,
  jacket2: { lit: "#ff7a52", shadow: "#b8305a", hi: "#ffb08a", line: "#4a0f2a", rim: "#ff4fd8" } as CelColors,
  pants: { lit: "#2a2468", shadow: "#16123e", hi: "#4a42a0", line: "#0b0828", rim: "#ff4fd8" } as CelColors,
  shoe: { lit: "#e9e6f4", shadow: "#9a8fc0", hi: "#ffffff", line: "#2a2050", rim: "#ff4fd8" } as CelColors,
};
