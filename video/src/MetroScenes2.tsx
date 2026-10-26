import React from "react";
import {
  Bokeh, Breath, Cam, CrowdRow, CYAN, EscalatorTunnel, FONT, Figure, Glow, H, MetroSign, Pill, RED, StationHall, Svg, TAU,
  Vignette, W, YEL, cl, easeInOut, easeOut, lerp, pop, ramp, rnd, shade,
} from "./MetroArt";
import { StreetBg } from "./MetroScenes1";
import type { SP } from "./MetroScenes1";

/* ------------------------------------------------------------------ */
/* Чертёж-подложка для правил                                           */
/* ------------------------------------------------------------------ */
const Blueprint: React.FC<{ n: number; label: string[]; lt: number; t: number; col?: string; children?: React.ReactNode }> = ({ n, label, lt, t, col = CYAN, children }) => {
  const k = easeOut(ramp(lt, 0, 0.5));
  return (
    <g>
      <defs>
        <linearGradient id="bp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#06122a" /><stop offset="1" stopColor="#0a1e40" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bp)" />
      {Array.from({ length: 25 }).map((_, i) => <path key={`h${i}`} d={`M0,${i * 80} H${W}`} stroke={col} strokeOpacity={i % 5 === 0 ? 0.16 : 0.06} strokeWidth={i % 5 === 0 ? 2 : 1} />)}
      {Array.from({ length: 14 }).map((_, i) => <path key={`v${i}`} d={`M${i * 80},0 V${H}`} stroke={col} strokeOpacity={i % 5 === 0 ? 0.16 : 0.06} strokeWidth={i % 5 === 0 ? 2 : 1} />)}
      <rect x={0} y={((t * 90) % 1920)} width={W} height={3} fill={col} opacity={0.12} />
      {/* заголовок */}
      <g transform={`translate(0 ${(1 - k) * -60})`} opacity={k}>
        <text x={64} y={232} fontFamily={FONT} fontWeight={800} fontSize={38} fill={col} letterSpacing={14}>ПРАВИЛО</text>
        <text x={50} y={520} fontFamily={FONT} fontWeight={900} fontSize={330} fill="none" stroke={col} strokeWidth={5}>{n}</text>
        <text x={50} y={520} fontFamily={FONT} fontWeight={900} fontSize={330} fill={col} opacity={0.18}>{n}</text>
        {label.map((l, i) => (
          <text key={i} x={330} y={360 + i * 84} fontFamily={FONT} fontWeight={900} fontSize={74} fill="#fff" stroke="#031024" strokeWidth={4} paintOrder="stroke">{l}</text>
        ))}
        <rect x={330} y={label.length * 84 + 376} width={420 * easeOut(ramp(lt, 0.2, 0.9))} height={8} fill={YEL} />
      </g>
      {children}
      <rect width={W} height={H} fill="url(#m-vig)" opacity={0.7} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Правило 1: не беги с толпой                                          */
/* ------------------------------------------------------------------ */
export const SR1: React.FC<SP> = ({ lt, dur, t }) => {
  const N = 52;
  const gapY = 1010;
  const wallX = 780;
  const hit = ramp(lt, 2.5, 3.0);
  const bar1 = easeOut(ramp(lt, 3.0, 3.9));
  const bar2 = ramp(lt, 3.0, 4.6) * 0.45;
  const outT = easeInOut(ramp(lt, 0.5, 1.8));
  // Егор: сначала в потоке, потом уходит в нишу
  const ex = lerp(210 + lt * 40, 360, outT);
  const ey = lerp(gapY, 735, outT);
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1} z1={1.05} t={t} cy={1000}>
        <Blueprint n={1} label={["НЕ БЕГИ", "С ТОЛПОЙ"]} lt={lt} t={t}>
          {/* стены улицы */}
          <path d={`M0,790 H${wallX} V${gapY - 34}`} stroke={CYAN} strokeWidth={8} fill="none" />
          <path d={`M0,1230 H${wallX} V${gapY + 34}`} stroke={CYAN} strokeWidth={8} fill="none" />
          <rect x={290} y={690} width={150} height={100} fill="#06122a" stroke={CYAN} strokeWidth={6} />
          {/* вход в метро */}
          <rect x={wallX} y={790} width={300} height={440} fill="#0a1a38" stroke={CYAN} strokeWidth={4} strokeDasharray="14 10" />
          <g transform={`translate(${wallX + 150} ${gapY})`}>
            <circle r={52} fill="#e83a2e" /><path d="M-24,18 V-22 L0,2 L24,-22 V18 H12 V-4 L0,16 L-12,-4 V18 Z" fill="#fff" />
          </g>
          <Glow x={wallX} y={gapY} r={150 + hit * 220} c="red" o={0.3 + hit * 0.6} />
          {/* поток */}
          {Array.from({ length: N }).map((_, i) => {
            const u = ((rnd(i) + t * (0.075 + rnd(i + 2) * 0.05)) % 1);
            const x = u * (wallX - 20);
            const lane = 830 + rnd(i + 8) * 360;
            const conv = easeInOut(ramp(x, 300, wallX - 30));
            const squeeze = 1 - conv * 0.92;
            const y = gapY + (lane - gapY) * squeeze;
            const crush = ramp(x, wallX - 190, wallX - 30);
            const jx = Math.sin(t * 22 + i * 3) * 6 * crush;
            const jy = Math.cos(t * 19 + i) * 6 * crush;
            const col = crush > 0.15 ? RED : "#e6f4ff";
            return <circle key={i} cx={x + jx} cy={y + jy} r={11} fill={col} opacity={0.95} />;
          })}
          {/* Егор */}
          <g transform={`translate(${ex} ${ey})`}>
            <circle r={44} fill="none" stroke={CYAN} strokeWidth={3} opacity={0.6 + 0.4 * Math.sin(t * 5)} />
            <circle r={19} fill={CYAN} />
            <circle r={19} fill="url(#m-cyan)" />
            <Pill x={0} y={-70} text="ЕГОР" bg={CYAN} fg="#041024" size={24} />
          </g>
          {outT > 0.5 && (
            <path d={`M${ex - 120},${gapY + 20} Q${ex - 40},${gapY - 20} ${ex - 12},${ey + 30}`} stroke={CYAN} strokeWidth={4} fill="none" strokeDasharray="12 9" strokeDashoffset={-t * 40} opacity={0.7} />
          )}
          {/* «ДАВКА» */}
          <g transform={`translate(${wallX - 150} ${gapY - 170}) scale(${pop(lt, 2.65, 0.3)})`}>
            <path d="M0,-46 L48,36 H-48 Z" fill={RED} />
            <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#fff">!</text>
            <Pill x={0} y={92} text="ДАВКА" bg={RED} size={30} />
          </g>
          {/* гонка: чума vs давка */}
          <g transform="translate(70 1292)" opacity={ramp(lt, 2.8, 3.2)}>
            <text x={0} y={22} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#9fe08a">ЧУМА</text>
            <rect x={170} y={0} width={780} height={30} rx={15} fill="#0a1e40" stroke="#9fe08a" strokeWidth={2} />
            <rect x={170} y={0} width={780 * bar2} height={30} rx={15} fill="#9fe08a" />
            <text x={0} y={80} fontFamily={FONT} fontWeight={800} fontSize={30} fill={RED}>ДАВКА</text>
            <rect x={170} y={58} width={780} height={30} rx={15} fill="#0a1e40" stroke={RED} strokeWidth={2} />
            <rect x={170} y={58} width={780 * bar1} height={30} rx={15} fill={RED} />
          </g>
        </Blueprint>
      </Cam>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Правило 2: два метра                                                 */
/* ------------------------------------------------------------------ */
export const SR2: React.FC<SP> = ({ lt, dur, t }) => {
  const cx = 470;
  const cy = 1020;
  const R = 190;
  const ringK = easeOut(ramp(lt, 0.7, 1.5));
  const inf = ramp(lt, 2.3, 3.0);
  const cluster = Array.from({ length: 9 }).map((_, i) => ({
    x: 790 + Math.cos(i * 2.4) * (26 + (i % 3) * 20) + Math.sin(t * 3 + i) * 5,
    y: 930 + Math.sin(i * 2.4) * (26 + (i % 3) * 22) + Math.cos(t * 2.7 + i) * 5,
  }));
  const loose = [
    { x: 160, y: 820 }, { x: 250, y: 1230 }, { x: 760, y: 1250 }, { x: 680, y: 760 }, { x: 150, y: 1060 },
  ];
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1} z1={1.06} t={t} cy={1000}>
        <Blueprint n={2} label={["ДЕРЖИ", "2 МЕТРА"]} lt={lt} t={t}>
          {/* кольцо 2 м */}
          <circle cx={cx} cy={cy} r={R * ringK} fill={CYAN} opacity={0.07} />
          <circle cx={cx} cy={cy} r={R * ringK + Math.sin(t * 4) * 3} fill="none" stroke={CYAN} strokeWidth={4} strokeDasharray="22 14" strokeDashoffset={t * 30} />
          <path d={`M${cx},${cy} L${cx + R * ringK},${cy}`} stroke={YEL} strokeWidth={5} />
          {[0, 1].map((i) => <path key={i} d={`M${cx + i * R * ringK},${cy - 18} V${cy + 18}`} stroke={YEL} strokeWidth={5} />)}
          <g transform={`translate(${cx + R * 0.5} ${cy - 50}) scale(${pop(lt, 1.0, 0.3)})`}>
            <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72} fill={YEL} stroke="#031024" strokeWidth={5} paintOrder="stroke">2 М</text>
          </g>
          {/* Егор */}
          <g transform={`translate(${cx} ${cy})`}>
            <circle r={20} fill={CYAN} />
            <circle r={90} fill="url(#m-cyan)" opacity={0.5} />
          </g>
          {/* соседи вне кольца */}
          {loose.map((p, i) => <circle key={i} cx={p.x + Math.sin(t * 1.4 + i) * 6} cy={p.y + Math.cos(t * 1.2 + i) * 6} r={13} fill="#e6f4ff" />)}
          {/* толпа справа: заражение */}
          {cluster.map((p, i) => {
            const sick = i === 0 || inf * 9 > i;
            return (
              <g key={i}>
                {sick && <circle cx={p.x} cy={p.y} r={40 + 30 * inf + Math.sin(t * 6 + i) * 6} fill="url(#m-green)" opacity={0.55} />}
                <circle cx={p.x} cy={p.y} r={13} fill={sick ? RED : "#e6f4ff"} />
              </g>
            );
          })}
          <Pill x={790} y={860} text="ТОЛПА" bg="#294a78" size={26} k={pop(lt, 2.0, 0.3)} />
          {/* щит кольца */}
          <g opacity={ramp(lt, 2.6, 3.0) * (0.6 + 0.4 * Math.sin(t * 7))}>
            <path d={`M${cx + R - 8},${cy - 90} A${R} ${R} 0 0 1 ${cx + R - 8},${cy + 90}`} stroke="#9fe08a" strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
        </Blueprint>
      </Cam>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Правило 2 (продолжение): дышат в затылок                             */
/* ------------------------------------------------------------------ */
export const SR2b: React.FC<SP> = ({ lt, dur, t }) => {
  const N = 6;
  const gap = 168;
  const x0 = 120;
  const s = 1.0;
  const y = 1400;
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1} z1={1.1} t={t} cy={1000}>
        <Blueprint n={2} label={["ДЫШАТ В", "ЗАТЫЛОК"]} lt={lt + 3.0} t={t}>
          <g>
            <rect x={0} y={y} width={W} height={400} fill="#0a1a38" />
            <path d={`M0,${y} H${W}`} stroke={CYAN} strokeWidth={5} />
            {Array.from({ length: N }).map((_, i) => {
              const x = x0 + i * gap;
              const sick = ramp(lt, 0.2 + i * 0.35, 0.6 + i * 0.35);
              return (
                <g key={i}>
                  <Figure
                    x={x} y={y + 8} s={s} gait="stand" simple face={1} lean={2 + Math.sin(t * 3 + i) * 1}
                    jacket={["#c94a3a", "#3a6fb0", "#e0b43a", "#5a9a5a", "#8a5ab0", "#4aa8a0"][i]} pants="#262b3a"
                    skin={sick > 0.5 ? "#a8c07a" : "#e9b995"}
                  />
                  {i < N - 1 && <Breath x={x + 70 * s} y={y - 420 * s} t={t + i * 0.3} n={5} sc={0.9} o={0.55 * ramp(lt, 0.1 + i * 0.3, 0.4 + i * 0.3)} />}
                </g>
              );
            })}
            <g transform={`translate(${x0 + (N - 1) * gap - 40} ${y - 600}) scale(${pop(lt, 1.8, 0.3)})`}>
              <circle r={50} fill="none" stroke={RED} strokeWidth={6} />
              <path d="M-26,-26 L26,26 M26,-26 L-26,26" stroke={RED} strokeWidth={6} />
            </g>
          </g>
        </Blueprint>
      </Cam>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Правило 3: найди выход                                               */
/* ------------------------------------------------------------------ */
export const SR3: React.FC<SP> = ({ lt, dur, t }) => {
  const sign = ramp(lt, 0.8, 1.3);
  const route = easeInOut(ramp(lt, 1.2, 2.6));
  const flick = lt > 3.0 ? (Math.sin(t * 25) > 0.4 ? 0.4 : 1) : 1;
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1} z1={1.08} t={t} cy={1000}>
        <Blueprint n={3} label={["НАЙДИ", "ВЫХОД"]} lt={lt} t={t}>
          {/* стена станции */}
          <rect x={0} y={860} width={W} height={720} fill="#0a1a38" opacity={0.6} />
          <path d="M0,1500 H1080" stroke={CYAN} strokeWidth={5} />
          {/* указатель */}
          <g transform={`translate(600 960) scale(${pop(lt, 0.8, 0.4)})`} opacity={sign * flick}>
            <rect x={-330} y={-130} width={660} height={260} rx={26} fill="#0f6a3a" stroke="#fff" strokeWidth={6} />
            <path d="M-270,60 V-30 H-300 L-250,-90 L-200,-30 H-230 V60 Z" fill="#fff" transform="translate(40 0)" />
            <text x={20} y={-22} fontFamily={FONT} fontWeight={900} fontSize={66} fill="#fff" letterSpacing={2}>ВЫХОД</text>
            <text x={20} y={64} fontFamily={FONT} fontWeight={900} fontSize={66} fill="#fff" letterSpacing={2}>В ГОРОД</text>
            <Glow x={0} y={0} r={460} c="green" o={0.22} />
          </g>
          {/* маршрут */}
          <path d={`M230,1500 C330,1380 380,1260 470,1180`} stroke={CYAN} strokeWidth={7} fill="none" strokeDasharray="20 14" strokeDashoffset={-t * 60} opacity={route} pathLength={1} />
          <g transform={`translate(520 1170) scale(${pop(lt, 2.6, 0.35)})`}>
            <circle r={36} fill="#2fa84a" /><path d="M-18,0 L-5,14 L20,-14" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <Figure x={220} y={1510} s={1.15} gait="stand" face={1} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" lean={0} />
          <g opacity={0.9}><CrowdRow t={t * 1.2 + 10} y={1880} s={1.3} n={6} speed={1100} tintDark={0.3} seed={60} /></g>
        </Blueprint>
      </Cam>
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Тихий вход                                                           */
/* ------------------------------------------------------------------ */
export const SQuiet: React.FC<SP> = ({ lt, dur, t }) => {
  const arrive = easeOut(ramp(lt, 1.2, 3.0));
  const scroll = (lt + 3) * 800 * (1 - arrive * 0.9);
  const doorX = lerp(1500, 700, arrive);
  const gait = arrive > 0.7 ? "walk" : "run";
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.04} z1={1.0} t={t} cy={1200} shake={1.2}>
        <StreetBg scroll={scroll} t={t} dusk={1} siren={0.6} />
        {/* далёкая толпа в тумане */}
        <g opacity={0.45}><CrowdRow t={t + 9} y={1400} s={0.34} n={16} speed={340} tintDark={0.3} seed={11} span={W + 400} /></g>
        {/* вход в метро */}
        <g transform={`translate(${doorX} 1500)`}>
          <rect x={-170} y={-420} width={340} height={420} fill="#171a24" />
          <rect x={-130} y={-340} width={260} height={340} fill="#06070c" />
          <path d="M-130,0 L-70,-100 L70,-100 L130,0Z" fill="#0c0e16" />
          {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={-110 + i * 0} y={-90 + i * 18} width={220 - i * 6} height={8} fill="#2a2e3c" />)}
          <rect x={-120} y={-470} width={240} height={86} rx={12} fill="#e83a2e" />
          <path d="M-52,-398 V-452 L0,-414 L52,-452 V-398 H36 V-432 L0,-402 L-36,-432 V-398 Z" fill="#fff" />
          <Glow x={0} y={-430} r={320} c="red" o={0.5} />
          <Glow x={0} y={-160} r={260} c="warm" o={0.35} />
        </g>
        <Figure x={lerp(380, 560, arrive)} y={1560} s={1.25} gait={gait} ph={t * (gait === "run" ? 12 : 7)} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" />
      </Cam>
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Вид со спины на эскалаторе                                           */
/* ------------------------------------------------------------------ */
export const BackFigure: React.FC<{ x: number; y: number; s?: number; tilt?: number; look?: number; opacity?: number; t?: number }> = ({ x, y, s = 1, tilt = 0, look = 0, opacity = 1, t = 0 }) => {
  const sway = Math.sin(t * 1.6) * 1.2;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt + sway})`} opacity={opacity}>
      <ellipse cx={0} cy={6} rx={96} ry={14} fill="#000" opacity={0.35} />
      <rect x={-42} y={-262} width={36} height={262} rx={16} fill="#262b3a" />
      <rect x={6} y={-262} width={36} height={262} rx={16} fill="#262b3a" />
      <rect x={-48} y={-22} width={44} height={22} rx={10} fill="#14161c" />
      <rect x={4} y={-22} width={44} height={22} rx={10} fill="#14161c" />
      <rect x={-78} y={-462} width={34} height={206} rx={17} fill="#cf6a24" />
      <rect x={44} y={-462} width={34} height={206} rx={17} fill="#cf6a24" />
      <circle cx={-61} cy={-252} r={16} fill="#e9b995" /><circle cx={61} cy={-252} r={16} fill="#e9b995" />
      <rect x={-58} y={-476} width={116} height={240} rx={40} fill="#ee7a2a" />
      <rect x={-52} y={-452} width={104} height={190} rx={22} fill="#2a6fe0" />
      <rect x={-52} y={-452} width={104} height={24} rx={12} fill="#4a8fff" opacity={0.8} />
      <rect x={-40} y={-380} width={80} height={6} fill="#fff" opacity={0.65} />
      <g transform={`translate(0,-530) rotate(${look})`}>
        <rect x={-16} y={20} width={32} height={30} rx={10} fill="#e9b995" />
        <circle r={46} fill="#e9b995" />
        <path d="M-50,6 Q-54,-56 0,-58 Q54,-56 50,6 Q0,-8 -50,6 Z" fill="#1c2230" />
        <rect x={-50} y={-4} width={100} height={14} rx={7} fill="#12161f" />
        <path d="M-40,30 Q0,48 40,30" fill="#2a1d16" opacity={0.0} />
      </g>
    </g>
  );
};

const DepthGauge: React.FC<{ d: number; k: number }> = ({ d, k }) => (
  <g opacity={k}>
    <rect x={68} y={420} width={16} height={900} rx={8} fill="#ffffff" opacity={0.12} />
    {Array.from({ length: 9 }).map((_, i) => (
      <g key={i}>
        <rect x={50} y={420 + (i / 8) * 900 - 2} width={52} height={4} fill="#fff" opacity={0.55} />
        <text x={116} y={420 + (i / 8) * 900 + 9} fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={22} fill="#fff" opacity={0.6}>{i * 10 + (i === 8 ? 4 : 0)}</text>
      </g>
    ))}
    <g transform={`translate(0 ${420 + (d / 84) * 900})`}>
      <polygon points="40,-18 40,18 70,0" fill={YEL} />
      <rect x={68} y={-3} width={16} height={6} fill={YEL} />
    </g>
    <text x={66} y={376} fontFamily={FONT} fontWeight={800} fontSize={26} fill="#fff" letterSpacing={4} opacity={0.8}>ГЛУБИНА</text>
    <text x={66} y={1400} fontFamily="'DejaVu Sans Mono', monospace" fontWeight={900} fontSize={92} fill={YEL} stroke="#000" strokeWidth={5} paintOrder="stroke">{`−${Math.round(d)} М`}</text>
  </g>
);

export const SDescent: React.FC<SP> = ({ lt, dur, t }) => {
  const d = easeInOut(ramp(lt, 0.2, dur - 0.1)) * 84;
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.0} z1={1.14} r0={-1.5} r1={1.5} t={t} cy={900} shake={0.8}>
        <EscalatorTunnel t={t + 5} speed={0.9} />
        <BackFigure x={700} y={1620} s={1.55} t={t} look={Math.sin(t * 0.8) * 3} />
        <Bokeh t={t} n={10} c="#ffd9a0" y0={300} y1={1300} o={0.18} seed={9} />
      </Cam>
      <DepthGauge d={d} k={ramp(lt, 0.1, 0.5)} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Платформа: «идеальное убежище»                                       */
/* ------------------------------------------------------------------ */
export const SPlatform: React.FC<SP> = ({ lt, dur, t }) => {
  const p = cl(lt / dur);
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.0} z1={1.12} t={t} cy={1000}>
        <StationHall t={t} lights={1} shift={t * 0.3} />
        <Bokeh t={t} n={14} c="#ffe3b0" y0={200} y1={1300} o={0.22} seed={4} />
        {/* табличка станции */}
        <g transform="translate(540 330)">
          <rect x={-290} y={-70} width={580} height={140} rx={16} fill="#1b2a4a" stroke="#d9c9a0" strokeWidth={5} />
          <text x={0} y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#fff" letterSpacing={3}>ПАРК ПОБЕДЫ</text>
          <text x={0} y={44} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#9fb4d8" letterSpacing={8}>ПЛАТФОРМА 1</text>
        </g>
        <Figure x={lerp(90, 620, easeOut(p))} y={1790} s={1.75} gait="walk" ph={t * 5.4} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" />
        <Glow x={620} y={1100} r={600} c="warm" o={0.22} />
      </Cam>
      <g transform="translate(540 560)">
        <Pill x={0} y={0} text="ГЛУБИНА −84 М" bg="#ffd23a" fg="#14161c" size={42} k={pop(lt, 0.4, 0.4) * (1 - ramp(lt, 2.4, 2.9))} />
      </g>
      <rect width={W} height={H} fill="#06070d" opacity={ramp(lt, 3.1, 3.6) * 0.45} />
      <Vignette o={0.8} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Правило 4: вид вверх по шахте                                        */
/* ------------------------------------------------------------------ */
const ShaftUp: React.FC<{ t: number; speed: number; shut?: number; dim?: number; red?: number }> = ({ t, speed, shut = 0, dim = 0.4, red = 0 }) => (
  <g>
    <EscalatorTunnel t={t} speed={-speed} vpx={540} vpy={620} tint="#ffc986" />
    {/* дневной свет вдали */}
    <circle cx={540} cy={620} r={64} fill="#fffbe8" opacity={1 - shut} />
    <Glow x={540} y={620} r={330} c="white" o={0.75 * (1 - shut)} />
    {shut > 0 && (
      <g>
        <rect x={380} y={620 - 150 + (1 - shut) * -260} width={320} height={300} fill="#2a2d36" />
        {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={380} y={620 - 150 + (1 - shut) * -260 + i * 30} width={320} height={5} fill="#0c0d12" />)}
        <rect x={380} y={620 - 150 + (1 - shut) * -260 + 300} width={320} height={10} fill="#6a6e7a" />
      </g>
    )}
    <rect width={W} height={H} fill="#06070d" opacity={dim} />
    {red > 0 && <rect width={W} height={H} fill="#ff1a0a" opacity={red * (0.15 + 0.12 * Math.sin(t * 9))} />}
  </g>
);

export const SR4: React.FC<SP> = ({ lt, dur, t }) => {
  const g = ramp(lt, 0.9, 1.0) * (1 - ramp(lt, 1.0, 1.9));
  const jit = Math.sin(t * 80) * 6 * g;
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.0} z1={1.4} t={t} cy={640} cx={540} shake={g * 6} ease={false}>
        <ShaftUp t={t} speed={0.5} dim={0.35 + ramp(lt, 0, 1.0) * 0.25} />
        <BackFigure x={540} y={1700} s={1.2} look={-12} t={t} />
      </Cam>
      {/* заголовок правила 4 */}
      <g opacity={ramp(lt, 0.8, 1.1)} transform={`translate(${jit} 0)`}>
        <text x={64} y={252} fontFamily={FONT} fontWeight={800} fontSize={38} fill={RED} letterSpacing={14}>ПРАВИЛО</text>
        <text x={50} y={540} fontFamily={FONT} fontWeight={900} fontSize={330} fill={RED} stroke="#000" strokeWidth={6} paintOrder="stroke">4</text>
        <text x={46 + Math.sin(t * 50) * 6 * g} y={540} fontFamily={FONT} fontWeight={900} fontSize={330} fill="#52e0ff" opacity={0.5 * g}>4</text>
        <text x={330} y={420} fontFamily={FONT} fontWeight={900} fontSize={66} fill="#fff" stroke="#000" strokeWidth={5} paintOrder="stroke">НЕ СПУСКАЙСЯ</text>
        <text x={330} y={500} fontFamily={FONT} fontWeight={900} fontSize={66} fill="#fff" stroke="#000" strokeWidth={5} paintOrder="stroke">ВНИЗ</text>
      </g>
      <rect width={W} height={H} fill="#fff" opacity={ramp(lt, 0.8, 0.85) * (1 - ramp(lt, 0.85, 1.1)) * 0.5} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Объявление: станция закрыта                                          */
/* ------------------------------------------------------------------ */
export const SAnnounce: React.FC<SP> = ({ lt, dur, t }) => {
  const blink = Math.sin(t * 6) > -0.2 ? 1 : 0.25;
  const chime = ramp(lt, 0, 0.06) * (1 - ramp(lt, 0.06, 0.5));
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.0} z1={1.1} t={t} cy={1000}>
        <StationHall t={t} lights={0.8 - ramp(lt, 1.2, 2.4) * 0.25} red={ramp(lt, 1.4, 2.0) * 0.5} />
        {/* светодиодное табло */}
        <g transform="translate(540 420)">
          <rect x={-380} y={-84} width={760} height={168} rx={14} fill="#07080c" stroke="#3a3d48" strokeWidth={6} />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-370} y={-76 + i * 13} width={740} height={2} fill="#000" opacity={0.5} />)}
          <text x={0} y={22} textAnchor="middle" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={900} fontSize={76} fill="#ffb02a" opacity={blink} letterSpacing={4}>СТАНЦИЯ ЗАКРЫТА</text>
          <Glow x={0} y={0} r={460} c="warm" o={0.3 * blink} />
        </g>
        {/* динамик */}
        <g transform="translate(200 250)">
          <rect x={-40} y={-26} width={80} height={52} rx={10} fill="#2a2d36" />
          <path d="M-18,-12 L2,-26 V26 L-18,12 Z" fill="#9aa0b0" />
          {[0, 1, 2].map((i) => {
            const p = ((t * 1.2 + i / 3) % 1);
            return <path key={i} d={`M${20 + p * 120},${-40 - p * 40} Q${60 + p * 160},0 ${20 + p * 120},${40 + p * 40}`} stroke="#fff" strokeWidth={4} fill="none" opacity={(1 - p) * 0.8} />;
          })}
        </g>
        {[0, 1, 2, 3].map((i) => (
          <Figure key={i} x={170 + i * 230} y={1560 + (i % 2) * 40} s={0.9} gait="stand" simple face={i % 2 ? -1 : 1} lean={-3} jacket={["#c94a3a", "#3a6fb0", "#5a9a5a", "#8a5ab0"][i]} pants="#262b3a" />
        ))}
        <Figure x={900} y={1730} s={1.4} gait="stand" face={-1} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" lean={-4} scared={lt > 1.5} />
      </Cam>
      <rect width={W} height={H} fill="#fff" opacity={chime * 0.35} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Решётка падает                                                       */
/* ------------------------------------------------------------------ */
export const SShaft: React.FC<SP> = ({ lt, dur, t }) => {
  const fall = easeInOut(ramp(lt, 1.35, 1.6));
  const hitT = ramp(lt, 1.6, 1.65) * (1 - ramp(lt, 1.65, 2.4));
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.0} z1={1.25} t={t} cy={640} shake={hitT * 22 + 0.6}>
        <ShaftUp t={t} speed={0.45 * (1 - fall)} shut={fall} dim={0.3 + fall * 0.3} red={ramp(lt, 1.8, 2.3)} />
        {Array.from({ length: 22 }).map((_, i) => {
          const p = ((t * 0.9 + rnd(i)) % 1);
          return <circle key={i} cx={540 + (rnd(i + 3) - 0.5) * 420 * p} cy={640 + p * 900} r={4 + p * 22} fill="#d9d0c0" opacity={hitT * (1 - p) * 0.6} />;
        })}
        <BackFigure x={540} y={1720} s={1.2} look={-14} tilt={hitT * -3} t={t} />
      </Cam>
      <rect width={W} height={H} fill="#fff" opacity={hitT * 0.55 * (1 - ramp(lt, 1.65, 1.8))} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Эскалатор встаёт                                                     */
/* ------------------------------------------------------------------ */
export const SStop: React.FC<SP> = ({ lt, dur, t }) => {
  const move = 1 - easeOut(ramp(lt, 0.05, 0.7));
  const jolt = ramp(lt, 0.05, 0.12) * (1 - ramp(lt, 0.12, 0.8));
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.1} z1={1.0} r0={3} r1={0} t={t} cy={900} shake={jolt * 16}>
        <EscalatorTunnel t={t + 5} speed={0.9} moving={move} tint={lt > 0.8 ? (Math.sin(t * 22) > 0 ? "#ffc986" : "#6a5a46") : "#ffc986"} />
        <BackFigure x={700} y={1620} s={1.55} tilt={jolt * 9} t={t} look={jolt * 8} />
        <rect width={W} height={H} fill="#ff1a0a" opacity={ramp(lt, 0.9, 1.4) * 0.16} />
      </Cam>
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Гаснет свет                                                          */
/* ------------------------------------------------------------------ */
export const SDark: React.FC<SP> = ({ lt, dur, t }) => {
  const pat = [1, 0.15, 0.9, 0.05, 0.5, 0.0];
  const idx = Math.min(pat.length - 1, Math.floor(lt / 0.22));
  const lights = lt < 0.2 ? 1 : pat[idx];
  const off = ramp(lt, 1.0, 1.3);
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.05} z1={1.12} t={t} cy={1000} shake={lt < 1.2 ? 2 : 0.4}>
        <StationHall t={t} lights={lights * (1 - off)} red={ramp(lt, 0.4, 1.2) * 0.9} />
        <Figure x={540} y={1790} s={1.6} gait="stand" face={1} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" scared lean={-2} />
        <rect width={W} height={H} fill="#000" opacity={(1 - lights) * 0.5 + off * 0.35} />
      </Cam>
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Кашель в темноте                                                     */
/* ------------------------------------------------------------------ */
export const SCough: React.FC<SP> = ({ lt, dur, t }) => {
  const swing = lt < 1.8 ? Math.sin(lt * 1.7) * 8 - 2 : lerp(6, 11, easeOut(ramp(lt, 1.8, 2.1)));
  const reveal = easeOut(ramp(lt, 1.8, 2.05));
  const cough = ramp(lt, 2.2, 2.3);
  const jerk = cough * Math.sin(t * 60) * (1 - ramp(lt, 2.3, 2.9)) * 14;
  const ox = 345;
  const oy = 1405;
  const len = 1100;
  const a = (swing * Math.PI) / 180;
  const half = 0.2;
  const pts = `${ox},${oy} ${ox + Math.cos(a - half) * len},${oy + Math.sin(a - half) * len} ${ox + Math.cos(a + half) * len},${oy + Math.sin(a + half) * len}`;
  return (
    <Svg>
      <Cam lt={lt} dur={dur} z0={1.0} z1={1.14} t={t} cy={1000} shake={cough * 6 + 0.5}>
        <rect width={W} height={H} fill="#020307" />
        <StationHall t={t} lights={0} red={0.25} train={false} />
        <rect width={W} height={H} fill="#000" opacity={0.82} />
        {/* заражённый силуэт */}
        <g opacity={reveal}>
          <Figure x={820} y={1560} s={1.0} gait="stand" simple face={-1} lean={cough * 12 + 8} skin="#9fb08a" jacket="#3a3f4a" pants="#2a2a30" hair="#222" />
          <Breath x={760} y={1090} t={t} dir={-1} n={8} sc={1.6} o={0.6 * cough} />
          <Glow x={760} y={1090} r={200 * cough} c="green" o={0.5} />
        </g>
        {/* Егор с фонариком */}
        <g transform={`translate(${jerk * 0.3},0)`}>
          <Figure x={260} y={1590} s={1.25} gait="stand" face={1} jacket="#ee7a2a" pants="#262b3a" bag="#2a6fe0" hat="#1c2230" armF={[75, 60]} phone scared lean={-1} />
        </g>
        {/* луч */}
        <g style={{ mixBlendMode: "screen" }}>
          <defs>
            <linearGradient id="beam" gradientUnits="userSpaceOnUse" x1={ox} y1={oy} x2={ox + Math.cos(a) * len} y2={oy + Math.sin(a) * len}>
              <stop offset="0" stopColor="#e8f6ff" stopOpacity="0.9" /><stop offset="0.6" stopColor="#bfe8ff" stopOpacity="0.22" /><stop offset="1" stopColor="#bfe8ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={pts} fill="url(#beam)" />
          <circle cx={ox} cy={oy} r={46} fill="#fff" opacity={0.85} />
        </g>
      </Cam>
      <rect width={W} height={H} fill={RED} opacity={cough * 0.12 * (0.5 + 0.5 * Math.sin(t * 14))} />
      <rect width={W} height={H} fill="#fff" opacity={ramp(lt, 2.2, 2.26) * (1 - ramp(lt, 2.26, 2.5)) * 0.5} />
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Финал                                                                */
/* ------------------------------------------------------------------ */
export const SEnd: React.FC<SP> = ({ lt, t }) => (
  <Svg>
    <rect width={W} height={H} fill="#03040a" />
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 380 + t * 24) % 1500) - 200} cy={1760 + (i % 2) * 40} rx={430} ry={150} fill="#7ee04a" opacity={0.1} filter="url(#m-blur30)" />)}
    <g opacity={ramp(lt, 0.2, 0.9)}>
      <text x={W / 2} y={900} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={RED} letterSpacing={16}>ЧУМА · МОСКВА</text>
      <text x={W / 2} y={1030} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#fff" letterSpacing={4}>ЭПИЗОД 01</text>
      <rect x={W / 2 - 220} y={1062} width={440 * easeOut(ramp(lt, 0.5, 1.3))} height={8} fill={RED} />
      <text x={W / 2} y={1150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill="#fff" opacity={ramp(lt, 1.0, 1.6)} letterSpacing={10}>ГЛУБИНА</text>
      <text x={W / 2} y={1260} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#fff" opacity={ramp(lt, 1.8, 2.4) * 0.7} letterSpacing={8}>ПРОДОЛЖЕНИЕ СЛЕДУЕТ…</text>
    </g>
  </Svg>
);

export { MetroSign, cl, shade, TAU, H };
