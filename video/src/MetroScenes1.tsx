import React from "react";
import {
  Birds, Bokeh, Breath, Cam, Car, CrowdRow, Facade, FONT, Figure, Glow, H, LampPost, MetroSign, Phone, RED, Svg, TAU,
  Vignette, W, YEL, cl, easeIn, easeInOut, easeOut, lerp, pop, ramp, rnd, shade,
} from "./MetroArt";

export type SP = { lt: number; dur: number; t: number };

/* ------------------------------------------------------------------ */
/* Силуэты Москвы                                                       */
/* ------------------------------------------------------------------ */
const CityTowers: React.FC<{ x: number; base: number; col: string; t: number; glint?: string }> = ({ x, base, col, t, glint = "#ffb07a" }) => {
  const T: [number, number, number, number][] = [[0, 70, 420, 0], [78, 92, 560, 1], [180, 64, 700, 2], [252, 112, 470, 0], [372, 72, 620, 1], [452, 60, 360, 0]];
  return (
    <g>
      {T.map(([dx, w, h, k], i) => {
        const x0 = x + dx;
        const y0 = base - h;
        return (
          <g key={i}>
            {k === 0 && <rect x={x0} y={y0} width={w} height={h} fill={col} />}
            {k === 1 && <polygon points={`${x0},${base} ${x0},${y0 + 50} ${x0 + w},${y0} ${x0 + w},${base}`} fill={col} />}
            {k === 2 && (
              <g>
                <rect x={x0} y={y0 + 70} width={w} height={h - 70} fill={col} />
                <polygon points={`${x0},${y0 + 70} ${x0 + w / 2},${y0 - 90} ${x0 + w},${y0 + 70}`} fill={col} />
              </g>
            )}
            {Array.from({ length: 7 }).map((_, r) => (
              <rect key={r} x={x0 + 8} y={y0 + 90 + r * (h / 9)} width={w * 0.28} height={5} fill={glint} opacity={0.18 + 0.2 * Math.abs(Math.sin(t * 0.7 + i + r))} />
            ))}
          </g>
        );
      })}
    </g>
  );
};

const Ostankino: React.FC<{ x: number; base: number; col: string; t: number }> = ({ x, base, col, t }) => {
  const blink = Math.sin(t * 4) > 0.3 ? 1 : 0.25;
  return (
    <g>
      <polygon points={`${x - 24},${base} ${x + 24},${base} ${x + 10},${base - 560} ${x - 10},${base - 560}`} fill={col} />
      <rect x={x - 38} y={base - 500} width={76} height={26} rx={9} fill={col} />
      <ellipse cx={x} cy={base - 486} rx={52} ry={15} fill={col} />
      <polygon points={`${x - 10},${base - 560} ${x + 10},${base - 560} ${x + 2},${base - 830} ${x - 2},${base - 830}`} fill={col} />
      <circle cx={x} cy={base - 832} r={14} fill="url(#m-red)" opacity={blink} />
      <circle cx={x} cy={base - 832} r={4} fill="#ff4a3a" opacity={blink} />
    </g>
  );
};

export const StarShape: React.FC<{ x: number; y: number; r: number; c?: string }> = ({ x, y, r, c = "#ff3a2a" }) => {
  const pts = Array.from({ length: 10 }).map((_, i) => {
    const a = (i / 10) * TAU - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
  });
  return <polygon points={pts.join(" ")} fill={c} />;
};

const Spasskaya: React.FC<{ x: number; base: number; col: string; t: number }> = ({ x, base, col, t }) => (
  <g>
    <rect x={x - 340} y={base - 120} width={680} height={120} fill={col} />
    {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={x - 340 + i * 31} y={base - 140} width={18} height={24} fill={col} />)}
    <rect x={x - 62} y={base - 280} width={124} height={280} fill={col} />
    <rect x={x - 50} y={base - 430} width={100} height={150} fill={col} />
    <circle cx={x} cy={base - 350} r={34} fill="#ffe7a8" opacity={0.85} />
    <path d={`M${x},${base - 350} V${base - 372} M${x},${base - 350} L${x + 14},${base - 340}`} stroke="#3a2a20" strokeWidth={4} />
    <rect x={x - 36} y={base - 500} width={72} height={70} fill={col} />
    <polygon points={`${x - 48},${base - 500} ${x},${base - 650} ${x + 48},${base - 500}`} fill={col} />
    <rect x={x - 2} y={base - 720} width={4} height={80} fill={col} />
    <StarShape x={x} y={base - 742} r={34} />
    <circle cx={x} cy={base - 742} r={90 + Math.sin(t * 2) * 8} fill="url(#m-red)" opacity={0.7} />
  </g>
);

const Onion: React.FC<{ x: number; y: number; s: number; c1: string; c2: string }> = ({ x, y, s, c1, c2 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-22} y={-4} width={44} height={36} fill="#8a4a3a" />
    <path d="M-34,0 C-52,-30 -36,-70 0,-120 C36,-70 52,-30 34,0 Z" fill={c1} />
    <path d="M-12,0 C-26,-30 -12,-70 0,-120 C12,-70 26,-30 12,0 Z" fill={c2} opacity={0.8} />
    <rect x={-2} y={-148} width={4} height={30} fill="#e0b43a" />
    <circle cx={0} cy={-150} r={6} fill="#e0b43a" />
  </g>
);

const Basil: React.FC<{ x: number; base: number; t: number }> = ({ x, base, t }) => (
  <g opacity={0.95}>
    <rect x={x - 150} y={base - 150} width={300} height={150} fill="#7a4a46" />
    <Onion x={x - 110} y={base - 150} s={0.9} c1="#3aa070" c2="#1a6a48" />
    <Onion x={x + 110} y={base - 150} s={0.9} c1="#e0b43a" c2="#b07a1a" />
    <Onion x={x - 50} y={base - 150} s={1.05} c1="#c8503a" c2="#8a2a1a" />
    <Onion x={x + 50} y={base - 150} s={1.05} c1="#4a7ad9" c2="#2a4a99" />
    <rect x={x - 34} y={base - 380} width={68} height={240} fill="#8a4a46" />
    <path d={`M${x - 46},${base - 380} L${x},${base - 560} L${x + 46},${base - 380} Z`} fill="#c8503a" />
    <Onion x={x} y={base - 560} s={0.9} c1="#e0b43a" c2="#b07a1a" />
    <Glow x={x} y={base - 340} r={260 + Math.sin(t) * 10} c="warm" o={0.18} />
  </g>
);

/* ------------------------------------------------------------------ */
/* 1. Рассвет над Москвой                                               */
/* ------------------------------------------------------------------ */
export const SSky: React.FC<SP> = ({ lt, dur, t }) => {
  const p = cl(lt / dur);
  const HZ = 1300;
  const sunY = lerp(1300, 1130, easeOut(p));
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1} z1={1.3} y0={20} y1={-110} t={t} cy={1150}>
        <defs>
          <linearGradient id="sk1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#110e30" /><stop offset="0.35" stopColor="#3a2a6a" /><stop offset="0.6" stopColor="#b3506a" /><stop offset="0.82" stopColor="#ff9a5a" /><stop offset="1" stopColor="#ffd9a0" />
          </linearGradient>
          <linearGradient id="riv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8586a" /><stop offset="0.3" stopColor="#4a3050" /><stop offset="1" stopColor="#0e0c1e" /></linearGradient>
        </defs>
        <rect x={-300} y={-300} width={W + 600} height={HZ + 300} fill="url(#sk1)" />
        {Array.from({ length: 46 }).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 90) * 640} r={1 + rnd(i + 3) * 2} fill="#fff" opacity={(0.7 - p * 0.5) * Math.abs(Math.sin(t * 1.4 + i))} />)}
        <Glow x={620} y={sunY} r={860} c="warm" o={0.95} />
        <circle cx={620} cy={sunY} r={66} fill="#fff1c8" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={((i * 260 + t * (10 + i * 4)) % 1500) - 200} cy={640 + i * 70} rx={240 + (i % 3) * 60} ry={26 + (i % 2) * 12} fill={i % 2 ? "#ff9a7a" : "#d9708a"} opacity={0.32} />
        ))}
        <g transform={`translate(${-p * 24},0)`}>
          <CityTowers x={30} base={HZ + 4} col="#6a4a82" t={t} />
          <Ostankino x={760} base={HZ + 4} col="#5e4478" t={t} />
        </g>
        <g transform={`translate(${-p * 70},0)`}>
          <Spasskaya x={330} base={HZ + 6} col="#3e2a52" t={t} />
          <Basil x={820} base={HZ + 6} t={t} />
        </g>
        <rect x={-300} y={HZ} width={W + 600} height={H - HZ + 300} fill="url(#riv)" />
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={620 - (210 - i * 9) * (0.6 + 0.4 * Math.sin(t * 2 + i)) / 2} y={HZ + 24 + i * 34} width={(210 - i * 9) * (0.6 + 0.4 * Math.sin(t * 2 + i))} height={5} rx={2} fill="#ffd9a0" opacity={0.5 - i * 0.02} />
        ))}
        <rect x={-300} y={HZ + 80} width={W + 600} height={22} fill="#1a1326" />
        {Array.from({ length: 22 }).map((_, i) => {
          const dir = i % 2 ? 1 : -1;
          const x = ((i * 91 + t * 120 * dir) % 1500 + 1500) % 1500 - 200;
          return <circle key={i} cx={x} cy={HZ + 90 + (i % 2) * 6} r={4} fill={dir > 0 ? "#fff3c8" : "#ff4a3a"} opacity={0.9} />;
        })}
        <Birds t={t} y={420} />
      </Cam>
      <rect width={W} height={H} fill="url(#m-fadeb)" opacity={0.35} />
      <Vignette o={0.7} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Красный знак «М» + бегущая толпа                                   */
/* ------------------------------------------------------------------ */
export const SSign: React.FC<SP> = ({ lt, dur, t }) => {
  const hit = ramp(lt, 0.5, 0.62) * (1 - ramp(lt, 0.62, 1.4));
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1} z1={1.35} y0={0} y1={-40} t={t} shake={hit * 14} cy={900}>
        <defs><linearGradient id="ms1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1440" /><stop offset="0.6" stopColor="#7a3a5a" /><stop offset="1" stopColor="#e07a5a" /></linearGradient></defs>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#ms1)" />
        <Bokeh t={t} n={16} c="#ffb27a" y0={300} y1={1400} o={0.25} />
        <MetroSign x={540} y={1120} s={1.9} glow={1.2} pulse={hit + 0.2 * Math.sin(t * 6)} />
        <rect x={-300} y={1500} width={W + 600} height={700} fill="#0c0a18" />
        <CrowdRow t={t} y={1760} s={1.3} n={9} speed={820} tintDark={0.28} />
        <CrowdRow t={t + 1.3} y={1640} s={0.9} n={10} speed={600} tintDark={0.2} seed={30} />
      </Cam>
      <rect width={W} height={H} fill="#ff2a1a" opacity={hit * 0.3} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Улица: курьер идёт, город проплывает                              */
/* ------------------------------------------------------------------ */
type BRow = { x: number; w: number; h: number; col: string; seed: number; shop: boolean };
const bRow = (i: number, span: number, hMin: number, hMax: number, shop: boolean): BRow => {
  const cols = ["#e8d3a8", "#d9b894", "#c4cfd9", "#e5c88a", "#b8a898", "#d9a896", "#a8b8c4"];
  const w = 260 + rnd(i * 3) * 160;
  return { x: i * span, w, h: hMin + rnd(i * 7 + 2) * (hMax - hMin), col: cols[Math.floor(rnd(i * 5 + 1) * cols.length)], seed: i * 17, shop };
};

export const StreetBg: React.FC<{ scroll: number; t: number; dusk?: number; siren?: number }> = ({ scroll, t, dusk = 0, siren = 0 }) => {
  const GY = 1400;
  const farSpan = 340;
  const nearSpan = 470;
  const mix = (a: string, b: string) => (dusk > 0.5 ? b : a);
  const tone = 1 - dusk * 0.55;
  const renderRow = (span: number, n: number, factor: number, hMin: number, hMax: number, shop: boolean, light: number) => {
    const off = (((scroll * factor) % (span * 40)) + span * 40) % (span * 40);
    const base = Math.floor(off / span);
    return Array.from({ length: n + 2 }).map((_, k) => {
      const r = bRow((base + k) % 40, span, hMin, hMax, shop);
      const px = k * span - (off % span) - span;
      return <Facade key={k} x={px} y={GY - r.h} w={r.w} h={r.h} col={shade(r.col, light * tone)} seed={r.seed} lit={0.25 + dusk * 0.4} t={t} cols={Math.max(3, Math.round(r.w / 85))} shop={shop} win={dusk > 0.3 ? "#ffd27a" : "#fff0c0"} />;
    });
  };
  return (
    <g>
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix("#8fb4e0", "#1c1a3a")} /><stop offset="0.6" stopColor={mix("#f0d0b0", "#6a3a5a")} /><stop offset="1" stopColor={mix("#ffe6c0", "#c0603a")} />
        </linearGradient>
      </defs>
      <rect x={-300} y={-300} width={W + 600} height={GY + 300} fill="url(#st-sky)" />
      <Glow x={820} y={420} r={620} c="warm" o={0.5 * (1 - dusk) + 0.3} />
      <g opacity={0.55}>{renderRow(farSpan, 6, 0.12, 360, 700, false, 0.82)}</g>
      <g opacity={0.9}>{renderRow(nearSpan, 4, 0.5, 520, 880, true, 0.96)}</g>
      <rect x={-300} y={GY - 6} width={W + 600} height={H - GY + 300} fill={mix("#7a7a86", "#2a2a38")} />
      <rect x={-300} y={GY - 6} width={W + 600} height={12} fill={mix("#a8a8b4", "#4a4a5a")} />
      <rect x={-300} y={GY + 190} width={W + 600} height={16} fill={mix("#5a5a66", "#1a1a26")} />
      <rect x={-300} y={GY + 206} width={W + 600} height={500} fill={mix("#3c3c48", "#14141c")} />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={((i * 260 - scroll * 1.0) % 2600 + 2600) % 2600 - 300} y={GY + 440} width={130} height={10} fill="#e8e0c0" opacity={0.6} />)}
      {Array.from({ length: 5 }).map((_, i) => <LampPost key={i} x={((i * 560 - scroll * 1.0) % 2800 + 2800) % 2800 - 400} y={GY + 20} s={1.15} on={dusk > 0.2} />)}
      {siren > 0 && (
        <g opacity={siren}>
          <rect width={W} height={H} fill={Math.sin(t * 9) > 0 ? "#ff1a1a" : "#1a3aff"} opacity={0.12 + 0.1 * Math.abs(Math.sin(t * 9))} />
        </g>
      )}
    </g>
  );
};

const OrderCard: React.FC<{ k: number; t: number }> = ({ k, t }) => (
  <g transform={`translate(540 360) scale(${k})`} opacity={cl(k * 2)}>
    <rect x={-380} y={-96} width={760} height={192} rx={34} fill="#0e1424" opacity={0.92} />
    <rect x={-380} y={-96} width={760} height={192} rx={34} fill="none" stroke="#ffffff22" strokeWidth={3} />
    <circle cx={-290} cy={0} r={52} fill="#ffd23a" />
    <path d="M-312,-14 H-268 L-276,26 H-304 Z M-304,-14 q8,-22 28,0" fill="none" stroke="#14161c" strokeWidth={6} strokeLinejoin="round" />
    <text x={-210} y={-18} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#9aa8c4" letterSpacing={3}>ЗАКАЗ № 2847</text>
    <text x={-210} y={34} fontFamily={FONT} fontWeight={900} fontSize={52} fill="#fff">ПАРК ПОБЕДЫ</text>
    <circle cx={330} cy={0} r={22 + ((t * 30) % 22)} fill="none" stroke="#ffd23a" strokeWidth={3} opacity={1 - ((t * 30) % 22) / 22} />
    <circle cx={330} cy={0} r={11} fill="#ffd23a" />
  </g>
);

export const SStreet: React.FC<SP> = ({ lt, dur, t }) => {
  const scroll = (lt + 2) * 520;
  const ph = t * 7.4;
  const title = ramp(lt, 0.1, 0.9);
  const letters = "МОСКВА".split("");
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.04} z1={1.0} x0={-20} x1={30} t={t} cy={1200}>
        <StreetBg scroll={scroll} t={t} />
        {/* машины на дороге */}
        <Car x={((t * 260) % 1700) - 300} y={1700} s={1.15} col="#2a3a5a" t={t} face={1} />
        <Car x={1500 - ((t * 180 + 400) % 1900)} y={1640} s={0.9} col="#e8e8ee" t={t} face={-1} seed={3} />
        {/* прохожие навстречу */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 1500 - ((scroll * 0.9 + i * 430 + t * 90) % 2200);
          return <Figure key={i} x={x} y={1480 + (i % 2) * 22} s={0.62 + (i % 3) * 0.05} face={-1} gait="walk" simple ph={t * 7 + i * 2} jacket={["#c94a3a", "#3a6fb0", "#5a9a5a", "#8a5ab0", "#e0b43a"][i]} pants="#2a2f3a" />;
        })}
        {/* курьер */}
        <Figure x={420} y={1560} s={1.2} gait="walk" ph={ph} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" hair="#2a1d16" />
        <Glow x={420} y={1250} r={380} c="warm" o={0.18} />
      </Cam>
      {/* кинетический заголовок */}
      <g opacity={1 - ramp(lt, 2.6, 3.2)}>
        {letters.map((ch, i) => {
          const k = easeOut(ramp(title * 1.4 - i * 0.12, 0, 0.5));
          return (
            <text key={i} x={92 + i * 112} y={520 + (1 - k) * 90} fontFamily={FONT} fontWeight={900} fontSize={150} fill="#fff" opacity={k} stroke="#0a0a14" strokeWidth={6} paintOrder="stroke">
              {ch}
            </text>
          );
        })}
        <rect x={96} y={556} width={640 * easeOut(ramp(lt, 0.5, 1.4))} height={10} fill={YEL} />
      </g>
      <OrderCard k={pop(lt, 7.3, 0.4) * (1 - ramp(lt, 9.0, 9.2))} t={t} />
      <Vignette o={0.55} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Телефон: крупный план + вибрация                                  */
/* ------------------------------------------------------------------ */
export const SBuzz: React.FC<SP> = ({ lt, dur, t }) => {
  const vib = lt > 0.5 ? Math.sin(t * 90) * 5 * ramp(lt, 0.5, 0.7) : 0;
  const flash = (Math.sin(t * 20) > 0 ? 1 : 0.3) * ramp(lt, 0.9, 1.0);
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1} z1={1.22} t={t} cy={1000}>
        <StreetBg scroll={400} t={t} />
        <rect width={W} height={H} fill="#0a0a14" opacity={0.4} />
        <Bokeh t={t} n={12} c="#ffd9a0" y0={500} y1={1500} o={0.2} />
        <g transform={`translate(${vib},0)`}>
          <Figure x={470} y={1800} s={1.95} gait="stand" face={1} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" armF={[40, 100]} phone ph={0} scared={lt > 1.0} />
        </g>
        <Glow x={800} y={1030} r={400} c="cyan" o={0.5 * ramp(lt, 0.1, 0.4)} />
      </Cam>
      <g opacity={flash * 0.9}>
        <rect width={W} height={H} fill={RED} opacity={0.12} />
      </g>
      <g transform="translate(540 330)" opacity={ramp(lt, 0, 0.3)}>
        <text x={0} y={0} textAnchor="middle" fontFamily={"'DejaVu Sans Mono', monospace"} fontWeight={900} fontSize={190} fill="#fff" stroke="#000" strokeWidth={6} paintOrder="stroke">09:40</text>
        <rect x={-200} y={30} width={400 * easeOut(ramp(lt, 0.2, 0.7))} height={8} fill={RED} />
      </g>
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Все достают телефоны                                              */
/* ------------------------------------------------------------------ */
export const SWide: React.FC<SP> = ({ lt, dur, t }) => {
  const sweep = (Math.sin(t * 6) + 1) / 2;
  const N = 15;
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.0} z1={1.12} t={t} cy={1200} shake={0.5}>
        <StreetBg scroll={800} t={t} dusk={0.35} siren={0.8} />
        {Array.from({ length: N }).map((_, i) => {
          const x = 60 + (i / (N - 1)) * 960 + (rnd(i) - 0.5) * 60;
          const row = i % 3;
          const y = 1430 + row * 80;
          const s = 0.62 + row * 0.2;
          const stopT = 0.05 + rnd(i + 3) * 0.8;
          const stopped = lt > stopT;
          const k = pop(lt, stopT + 0.1, 0.3);
          return (
            <g key={i}>
              <Figure
                x={x} y={y} s={s} face={i % 2 ? 1 : -1} gait={stopped ? "stand" : "walk"} simple
                ph={t * 7 + i} phone={stopped} armF={stopped ? [40, 100] : undefined}
                jacket={["#c94a3a", "#3a6fb0", "#5a9a5a", "#8a5ab0", "#e8e8ee", "#2a2f3a", "#d9783a", "#4aa8a0"][i % 8]} pants="#262b3a"
                hair={["#2a1d16", "#4a2c1e", "#8a6a3a"][i % 3]}
              />
              {stopped && <Glow x={x + (i % 2 ? 1 : -1) * 60 * s} y={y - 480 * s} r={110 * s} c="cyan" o={0.6} />}
              {stopped && (
                <g transform={`translate(${x} ${y - 640 * s}) scale(${k})`}>
                  <circle r={24} fill={RED} />
                  <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">!</text>
                </g>
              )}
            </g>
          );
        })}
        <Figure x={540} y={1530} s={1.1} face={1} gait="stand" jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" armF={[40, 100]} phone scared={lt > 0.8} />
        <Glow x={620} y={1100} r={200} c="cyan" o={0.5} />
      </Cam>
      <rect width={W} height={H} fill={sweep > 0.5 ? "#ff1a1a" : "#1a3aff"} opacity={0.08 + sweep * 0.08} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Экран с экстренным сообщением                                     */
/* ------------------------------------------------------------------ */
export const SPhone: React.FC<SP> = ({ lt, dur, t }) => {
  const sway = Math.sin(t * 1.6) * 4;
  const slide = easeOut(ramp(lt, 0, 0.45));
  const line1 = ramp(lt, 0.0, 0.4); // 19.1
  const line2 = ramp(lt, 1.3, 1.7); // 20.4
  const line3 = ramp(lt, 2.6, 3.0); // 21.7
  const rem = Math.max(0, 600 - Math.max(0, lt - 2.6) * 62);
  const mm = Math.floor(rem / 60);
  const ss = Math.floor(rem % 60);
  const flash = Math.sin(t * 8) > 0 ? "#ff1a1a" : "#1a2aff";
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.02} z1={1.12} t={t} shake={ramp(lt, 1.3, 1.5) * (1 - ramp(lt, 1.5, 2.0)) * 8}>
        <StreetBg scroll={1200} t={t} dusk={0.5} siren={1} />
        <rect width={W} height={H} fill="#06070d" opacity={0.72} />
        <rect width={W} height={H} fill={flash} opacity={0.1} />
        <g transform={`translate(${sway},0)`}>
          <Phone x={540} y={820} s={1.12} rot={-2 + Math.sin(t * 1.1) * 0.8}>
            <g transform="translate(0 -440)">
              <text x={-190} y={34} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#aab4cc">09:40</text>
              <g transform="translate(160 24)">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 12} y={10 - i * 7} width={7} height={8 + i * 7} fill="#aab4cc" />)}</g>
            </g>
            <g transform={`translate(0 ${-340 - (1 - slide) * 200})`} opacity={slide}>
              <rect x={-208} y={0} width={416} height={620} rx={30} fill="#1a0f12" stroke={RED} strokeWidth={4} />
              <rect x={-208} y={0} width={416} height={74} rx={30} fill={RED} />
              <rect x={-208} y={40} width={416} height={34} fill={RED} />
              <path d="M-176,40 L-160,10 L-144,40 Z" fill="#fff" />
              <text x={-128} y={46} fontFamily={FONT} fontWeight={900} fontSize={25} fill="#fff" letterSpacing={2}>ЭКСТРЕННО · МЧС</text>
              <g opacity={line1}><text x={-182} y={140} fontFamily={FONT} fontWeight={800} fontSize={33} fill="#ffd0c8">ЭКСТРЕННОЕ СООБЩЕНИЕ</text></g>
              <g opacity={line2}>
                <text x={-182} y={214} fontFamily={FONT} fontWeight={900} fontSize={46} fill="#fff">В городе зафиксирована</text>
                <text x={-182} y={280} fontFamily={FONT} fontWeight={900} fontSize={80} fill={RED} letterSpacing={4}>ЧУМА</text>
              </g>
              <g opacity={line3}>
                <text x={-182} y={352} fontFamily={FONT} fontWeight={700} fontSize={31} fill="#e8d8d4">Метро будет закрыто через</text>
                <text x={-182} y={470} fontFamily={"'DejaVu Sans Mono', monospace"} fontWeight={900} fontSize={110} fill={rem < 60 ? RED : "#fff"}>
                  {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
                </text>
                <rect x={-182} y={500} width={364} height={14} rx={7} fill="#3a2024" />
                <rect x={-182} y={500} width={364 * (rem / 600)} height={14} rx={7} fill={RED} />
                <text x={-182} y={566} fontFamily={FONT} fontWeight={700} fontSize={26} fill="#b89a96">Оставайтесь на местах</text>
              </g>
            </g>
          </Phone>
        </g>
        <Breath x={540} y={1500} t={t} n={0} />
      </Cam>
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* 7. Поток людей к станции                                             */
/* ------------------------------------------------------------------ */
export const SFlood: React.FC<SP> = ({ lt, dur, t }) => {
  const shake = 3 + ramp(lt, 0, 0.5) * 3;
  const tt = t + 40;
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.02} z1={1.16} t={t} shake={shake} cy={1250}>
        <StreetBg scroll={tt * 900} t={t} dusk={0.6} siren={1} />
        <MetroSign x={960} y={1380} s={0.55} glow={1} pulse={Math.abs(Math.sin(t * 6))} />
        <CrowdRow t={tt} y={1470} s={0.62} n={14} speed={620} tintDark={0.55} seed={5} />
        <CrowdRow t={tt} y={1620} s={0.95} n={11} speed={860} tintDark={0.75} seed={20} />
        {/* Егор стоит против потока */}
        <Figure x={230} y={1700} s={1.15} gait="stand" jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" scared lean={-3} />
        <CrowdRow t={tt} y={1860} s={1.35} n={8} speed={1150} tintDark={0.9} seed={44} />
        {Array.from({ length: 12 }).map((_, i) => {
          const x = ((i * 240 + t * 900) % 1600) - 300;
          return <ellipse key={i} cx={x} cy={1500 + (i % 4) * 100} rx={140} ry={30} fill="#d9c8b0" opacity={0.18} filter="url(#m-blur14)" />;
        })}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = ((i * 190 + t * 1800) % 1700) - 300;
          return <rect key={i} x={x} y={1000 + rnd(i) * 800} width={160 + rnd(i + 2) * 140} height={3} fill="#fff" opacity={0.12} />;
        })}
      </Cam>
      <Vignette />
    </Svg>
  );
};

export { cl, easeIn, easeInOut, shade };
