import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { rand } from "./Art";
import { Bust } from "./Home";
import {
  BALANCE_EVENTS,
  DURATION_SEC,
  EPISODES,
  FPS,
  LINES,
  WHO_COLOR,
  WHO_NAME,
  endOf,
  episodeAt,
  lineAt,
  startOf,
} from "./timeline6";

const W = 1080;
const H = 1920;
const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const bounce = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return 1 + Math.sin(c * Math.PI * 3) * (1 - c) * 0.25;
};
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type SP = { frame: number; t: number };

/* ---------- примитивы ---------- */
const Bg: React.FC<{ a: string; b: string; id?: string }> = ({ a, b, id = "bgx" }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset="1" stopColor={b} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </g>
);

const Floor: React.FC<{ y?: number; c?: string }> = ({ y = 1300, c = "#1b1426" }) => (
  <g>
    <rect x="0" y={y} width={W} height={H - y} fill={c} />
    <rect x="0" y={y} width={W} height="10" fill="#00000055" />
  </g>
);

const Bubble: React.FC<{ x: number; y: number; w: number; text: string; color?: string; tail?: "l" | "r" | "d"; size?: number; o?: number; fg?: string }> = ({
  x,
  y,
  w,
  text,
  color = "#fff",
  tail = "d",
  size = 38,
  o = 1,
  fg = "#16161e",
}) => {
  const lines = text.split("\n");
  const h = lines.length * (size * 1.18) + 40;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="26" fill={color} />
      {tail === "d" && <polygon points={`-18,${h / 2 - 2} 18,${h / 2 - 2} 0,${h / 2 + 30}`} fill={color} />}
      {tail === "l" && <polygon points={`${-w / 2 + 2},-14 ${-w / 2 + 2},14 ${-w / 2 - 28},0`} fill={color} />}
      {tail === "r" && <polygon points={`${w / 2 - 2},-14 ${w / 2 - 2},14 ${w / 2 + 28},0`} fill={color} />}
      {lines.map((l, i) => (
        <text key={i} x="0" y={-h / 2 + 20 + size * 0.92 + i * size * 1.18} textAnchor="middle" fill={fg} fontFamily={FONT} fontSize={size} fontWeight="900">
          {l}
        </text>
      ))}
    </g>
  );
};

const Pop: React.FC<{ x: number; y: number; text: string; t: number; t0: number; color?: string; size?: number; rot?: number; stroke?: string }> = ({
  x,
  y,
  text,
  t,
  t0,
  color = "#ffd34a",
  size = 110,
  rot = -6,
  stroke = "#000",
}) => {
  const k = t - t0;
  if (k < 0) return null;
  const s = k < 0.35 ? bounce(k / 0.35) * ease(k / 0.18) : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <text textAnchor="middle" fill={color} stroke={stroke} strokeWidth="10" paintOrder="stroke" fontFamily={FONT} fontSize={size} fontWeight="900">
        {text}
      </text>
    </g>
  );
};

const Confetti: React.FC<{ t: number; t0: number; n?: number; seed?: number }> = ({ t, t0, n = 60, seed = 1 }) => {
  const k = t - t0;
  if (k < 0 || k > 3) return null;
  const cols = ["#ffd34a", "#ff6b9d", "#5ec8ff", "#7dffb0", "#ffffff"];
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = rand(i + seed) * W;
        const vy = 400 + rand(i + 9 + seed) * 500;
        const y = -60 + k * vy * 0.9;
        return <rect key={i} x={x + Math.sin(k * 5 + i) * 30} y={y} width="16" height="26" fill={cols[i % 5]} transform={`rotate(${k * 300 + i * 40} ${x} ${y})`} opacity={1 - k / 3} />;
      })}
    </g>
  );
};

const Coin: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 22 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#ffcf3a" stroke="#c8941a" strokeWidth="4" />
    <text textAnchor="middle" y={r * 0.38} fontFamily={FONT} fontWeight="900" fontSize={r * 1.1} fill="#a8741a">
      ₽
    </text>
  </g>
);

const Machine: React.FC<{ x: number; y: number; s?: number; frame: number; mode?: "ok" | "spit" | "broken" | "new" }> = ({ x, y, s = 1, frame, mode = "ok" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-130" y="-190" width="260" height="190" rx="18" fill={mode === "new" ? "#e8eef8" : "#6a6f7c"} />
    <rect x="-130" y="-190" width="130" height="190" rx="18" fill={mode === "new" ? "#fff" : "#7d8290"} />
    <rect x="-100" y="-160" width="200" height="40" rx="8" fill="#12141c" />
    <circle cx="-70" cy="-140" r="10" fill={mode === "broken" ? "#ff3b2f" : "#7dffb0"} opacity={mode === "broken" ? (frame % 20 < 10 ? 1 : 0.2) : 1} />
    <rect x="-24" y="-100" width="48" height="28" rx="6" fill="#2a2d38" />
    <rect x="-70" y="-30" width="140" height="30" fill="#3a3e4c" />
    {mode === "spit" &&
      Array.from({ length: 10 }).map((_, i) => {
        const p = ((frame * 0.08 + i / 10) % 1);
        return <circle key={i} cx={Math.sin(i * 2.1) * 60 + p * (i % 2 ? 140 : -140)} cy={-80 - p * 120 + p * p * 260} r={6 + (i % 3) * 3} fill={i % 3 ? "#5a3a22" : "#ffffff"} opacity={1 - p} />;
      })}
    {mode === "broken" &&
      Array.from({ length: 6 }).map((_, i) => {
        const p = ((frame * 0.03 + i / 6) % 1);
        return <circle key={i} cx={Math.sin(i * 3) * 40} cy={-190 - p * 240} r={30 + p * 60} fill="#2a2a2a" opacity={0.7 - p * 0.7} />;
      })}
    {mode === "new" && <circle cx="0" cy="-100" r={210 + 20 * Math.sin(frame * 0.2)} fill="#ffe08a" opacity="0.18" />}
  </g>
);

const Cup: React.FC<{ x: number; y: number; s?: number; name?: string; steam?: boolean; frame?: number }> = ({ x, y, s = 1, name, steam, frame = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <polygon points="-50,-80 50,-80 38,0 -38,0" fill="#f4efe0" />
    <polygon points="0,-80 50,-80 38,0 0,0" fill="#dcd6c4" />
    <rect x="-52" y="-92" width="104" height="16" rx="6" fill="#fff" />
    <path d="M 50 -60 q 36 4 30 36 q -4 14 -34 14" fill="none" stroke="#f4efe0" strokeWidth="9" />
    {name && (
      <text y="-30" textAnchor="middle" fill="#1b1b22" fontFamily="'Comic Sans MS', 'DejaVu Sans', cursive" fontSize="22" fontWeight="900">
        {name}
      </text>
    )}
    {steam &&
      [0, 1, 2].map((i) => {
        const p = ((frame * 0.03 + i / 3) % 1);
        return <circle key={i} cx={-20 + i * 20} cy={-100 - p * 90} r={10 + p * 14} fill="#fff" opacity={0.5 - p * 0.5} />;
      })}
  </g>
);

const Cactus: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-18" y="-130" width="36" height="130" rx="16" fill="#4a9a5a" />
    <rect x="-18" y="-130" width="18" height="130" rx="9" fill="#3a7a48" />
    <rect x="-52" y="-100" width="30" height="16" rx="8" fill="#4a9a5a" />
    <rect x="-52" y="-100" width="16" height="50" rx="8" fill="#4a9a5a" />
    <rect x="22" y="-80" width="30" height="16" rx="8" fill="#4a9a5a" />
    <rect x="38" y="-120" width="16" height="56" rx="8" fill="#4a9a5a" />
    <polygon points="-34,0 34,0 26,50 -26,50" fill="#b8643a" />
    <circle cx="0" cy="-142" r="6" fill="#ff6b9d" />
  </g>
);

const Counter: React.FC<{ y?: number }> = ({ y = 1180 }) => (
  <g>
    <rect x="0" y={y} width={W} height="40" fill="#8a5d3b" />
    <rect x="0" y={y + 40} width={W} height={H - y - 40} fill="#5a3b26" />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={i} x={20 + i * 180} y={y + 70} width="150" height="200" rx="6" fill="#6a4630" />
    ))}
  </g>
);

const RobotBot: React.FC<{ x: number; y: number; s?: number; frame: number; talking?: boolean }> = ({ x, y, s = 1, frame, talking }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1="0" y1="-130" x2="0" y2="-170" stroke="#9fb4d6" strokeWidth="6" />
    <circle cx="0" cy="-176" r="10" fill={frame % 24 < 12 ? "#ff6b9d" : "#5ec8ff"} />
    <rect x="-90" y="-130" width="180" height="130" rx="30" fill="#e8eef8" />
    <rect x="-90" y="-130" width="90" height="130" rx="30" fill="#d3dcec" />
    <rect x="-70" y="-110" width="140" height="70" rx="16" fill="#0b1a3a" />
    <rect x="-46" y="-90" width="26" height={frame % 90 < 4 ? 4 : 30} rx="8" fill="#5ec8ff" />
    <rect x="20" y="-90" width="26" height={frame % 90 < 4 ? 4 : 30} rx="8" fill="#5ec8ff" />
    <rect x="-30" y={-30} width="60" height={talking ? 8 + 8 * Math.abs(Math.sin(frame * 0.5)) : 6} rx="4" fill="#0b1a3a" />
    <rect x="-70" y="0" width="140" height="22" fill="#b8c4dc" />
  </g>
);

const Flash: React.FC<{ t: number; t0: number; color?: string }> = ({ t, t0, color = "#fff" }) => {
  const o = interpolate(t, [t0, t0 + 0.06, t0 + 0.4], [0, 0.55, 0], clamp);
  return <rect width={W} height={H} fill={color} opacity={o} />;
};

/* ---------- карточки серий ---------- */
const Icon: React.FC<{ n: number; frame: number }> = ({ n, frame }) => {
  const wob = Math.sin(frame * 0.12) * 6;
  switch (n) {
    case 1:
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${-60 + i * 40} ${-i * 6})`}>
              <Coin x={0} y={0} r={52} />
            </g>
          ))}
          <polyline points="-160,-120 -80,-200 -20,-150 60,-250" fill="none" stroke="#ff3b2f" strokeWidth="12" transform="scale(1 -1)" />
        </g>
      );
    case 2:
      return (
        <g transform={`rotate(${wob})`}>
          <polygon points="-110,0 0,-100 110,0" fill="#c96a5a" />
          <rect x="-90" y="0" width="180" height="130" fill="#e8d7b8" />
          <rect x="-24" y="40" width="48" height="90" fill="#5a3b26" />
          <rect x="30" y="30" width="46" height="46" fill="#7fc8ff" />
        </g>
      );
    case 3:
      return (
        <g transform={`rotate(${wob})`}>
          <rect x="-90" y="-60" width="180" height="40" rx="8" fill="#e8c070" />
          <rect x="-12" y="-130" width="24" height="75" fill="#8a5d3b" />
          <Cactus x={-130} y={110} s={0.8} />
          <Cactus x={120} y={110} s={0.8} />
        </g>
      );
    case 4:
      return <Cup x={0} y={90} s={2.2} steam frame={frame} />;
    case 5:
      return (
        <g transform={`rotate(${wob})`}>
          <rect x="-110" y="-70" width="220" height="140" fill="#c89a60" />
          <polygon points="-110,-70 0,-30 110,-70 70,-120 -70,-120" fill="#b0834c" />
          <text y="12" textAnchor="middle" fill="#3a2a18" fontFamily={FONT} fontSize="34" fontWeight="900">
            КОФЕ
          </text>
        </g>
      );
    case 6:
      return (
        <g transform={`rotate(${wob})`}>
          <rect x="-150" y="-90" width="300" height="160" rx="16" fill="#8a2a2a" />
          <text y="-18" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="40" fontWeight="900">
            ДЯДЯ ГЕНА
          </text>
          <text y="34" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="44" fontWeight="900">
            −50%
          </text>
        </g>
      );
    case 7:
      return (
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx={Math.cos(i * 0.52) * (80 + (frame * 3 + i * 20) % 100)} cy={Math.sin(i * 0.52) * (60 + (frame * 3 + i * 20) % 80) - 20} r={20 + (i % 3) * 10} fill="#fff" opacity={0.9} />
          ))}
          <Cup x={0} y={110} s={1.6} />
        </g>
      );
    case 8:
      return <Machine x={0} y={110} s={1.2} frame={frame} mode="broken" />;
    case 9:
      return (
        <g>
          <circle r="120" fill="#f4efe0" stroke="#fff" strokeWidth="8" />
          <line x1="0" y1="0" x2="0" y2="-90" stroke="#1b1b22" strokeWidth="10" transform={`rotate(${frame * 4})`} />
          <line x1="0" y1="0" x2="60" y2="0" stroke="#d1261b" strokeWidth="8" transform={`rotate(${frame * 0.5})`} />
          <text y="170" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="60" fontWeight="900">
            25:00
          </text>
        </g>
      );
    default:
      return (
        <g>
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={-160 + i * 40} cy={-90 + Math.sin(i + frame * 0.2) * 8} r="9" fill={i % 2 ? "#ffd34a" : "#ff6b9d"} />
          ))}
          <rect x="-190" y="-40" width="380" height="110" rx="16" fill="#1b1b22" stroke="#ffd34a" strokeWidth="6" />
          <text y="30" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="46" fontWeight="900">
            СТЕПА И ЗЕРНО
          </text>
        </g>
      );
  }
};

const Card: React.FC<SP & { ep: number; title: string; k: number }> = ({ frame, ep, title, k }) => {
  const sl = ease(k / 0.35);
  return (
    <g>
      <Bg a="#1a1038" b="#3a1858" id="cardbg" />
      {Array.from({ length: 24 }).map((_, i) => (
        <circle key={i} cx={rand(i + 1) * W} cy={(rand(i + 30) * H + frame * (1 + rand(i) * 2)) % H} r={2 + rand(i + 3) * 4} fill="#ffd34a" opacity="0.25" />
      ))}
      <g transform={`translate(540 ${760 + (1 - sl) * 500}) rotate(${-3 + (1 - sl) * 10})`}>
        <rect x="-330" y="-330" width="660" height="640" fill="#f1e7c8" />
        <rect x="-330" y="-330" width="660" height="40" fill="#e2d4a8" />
        <text x="0" y="-235" textAnchor="middle" fill="#2a2418" opacity="0.7" fontFamily={FONT} fontSize="46" fontWeight="900" letterSpacing="10">
          СЕРИЯ
        </text>
        <text x="0" y="50" textAnchor="middle" fill="#d1261b" fontFamily={FONT} fontSize="300" fontWeight="900">
          {ep}
        </text>
        <text x="0" y="150" textAnchor="middle" fill="#2a2418" fontFamily={FONT} fontSize="54" fontWeight="900">
          {title.length > 20 ? title.slice(0, title.lastIndexOf(" ", 20)) : title}
        </text>
        {title.length > 20 && (
          <text x="0" y="212" textAnchor="middle" fill="#2a2418" fontFamily={FONT} fontSize="54" fontWeight="900">
            {title.slice(title.lastIndexOf(" ", 20) + 1)}
          </text>
        )}
      </g>
      <g transform={`translate(540 1330) scale(${1 + Math.sin(frame * 0.1) * 0.03})`} opacity={sl}>
        <Icon n={ep} frame={frame} />
      </g>
      <g transform="translate(540 1640)">
        {Array.from({ length: 10 }).map((_, i) => (
          <circle key={i} cx={-225 + i * 50} cy="0" r="12" fill={i < ep ? "#ffd34a" : "#ffffff33"} />
        ))}
      </g>
    </g>
  );
};

/* ---------- серия 1 ---------- */
const Room: React.FC<{ frame: number; day?: boolean }> = ({ frame, day }) => (
  <g>
    <Bg a={day ? "#3a2a58" : "#140a2a"} b={day ? "#6a3a78" : "#241046"} id="room1" />
    <rect x="620" y="260" width="300" height="400" fill="#0b0618" stroke="#ff4fd8" strokeWidth="8" />
    <line x1="770" y1="260" x2="770" y2="660" stroke="#ff4fd8" strokeWidth="5" />
    <circle cx="860" cy="340" r="36" fill="#e8ecf5" />
    <circle cx="874" cy="330" r="32" fill="#0b0618" />
    <rect x="0" y="1240" width={W} height="680" fill="#1d1230" />
    <rect x="0" y="1090" width={W} height="40" fill="#3a2250" />
    <rect x="60" y="1130" width="26" height="170" fill="#2a1a40" />
    <rect x="950" y="1130" width="26" height="170" fill="#2a1a40" />
    <line x1="0" y1="200" x2={W} y2="200" stroke="#ff4fd8" strokeWidth="4" opacity={0.4 + 0.3 * Math.sin(frame * 0.1)} />
  </g>
);

const Ep1: React.FC<SP> = ({ frame, t }) => {
  const s1 = startOf("s1");
  const s2 = startOf("s2");
  const b1e = endOf("b1");
  const k = t - s1;
  const jump = k > 0 && k < 1.6 ? Math.abs(Math.sin(k * 7)) * 150 * (1 - k / 1.6) : 0;
  const napkin = t > b1e + 0.15;
  const nk = t - (b1e + 0.15);
  return (
    <g>
      <Room frame={frame} />
      {/* ноутбук */}
      <g transform="translate(400 940)">
        <polygon points="-230,160 230,160 270,190 -270,190" fill="#2a2d38" />
        <rect x="-210" y="-110" width="420" height="270" rx="10" fill="#10131c" stroke="#4a4f60" strokeWidth="8" />
        <polyline points="-180,-70 -120,-30 -60,-50 0,20 60,0 120,80 170,100" fill="none" stroke="#ff3b2f" strokeWidth="9" />
        <text x="-190" y="-80" fill="#ff6b5e" fontFamily={FONT} fontSize="34" fontWeight="900">
          КРИПТА −42%
        </text>
      </g>
      <Bust x={230} y={820 - jump} s={2.2} who="stepa" frame={frame} look={0.5} scared={k < 0} talking={k > 0 && k < 5} />
      {/* карта с триста тысяч */}
      {k > 0.2 && (
        <g transform={`translate(${690 + (1 - ease((k - 0.2) / 0.6)) * 600} ${560 - Math.sin(frame * 0.1) * 10}) rotate(${-8 + (1 - ease((k - 0.2) / 0.6)) * 40})`}>
          <rect x="-240" y="-140" width="480" height="280" rx="30" fill="#2ac27a" />
          <rect x="-240" y="-60" width="480" height="50" fill="#1a8a56" />
          <text x="-200" y="-70" fill="#fff" fontFamily={FONT} fontSize="40" fontWeight="900" opacity="0.8">
            БАНК
          </text>
          <text x="0" y="90" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="92" fontWeight="900">
            300 000 ₽
          </text>
        </g>
      )}
      {k > 1.4 && <Pop x={560} y={420} text="ХВАТИТ!" t={t} t0={s1 + 1.4} size={130} />}
      <Confetti t={t} t0={s1 + 2.6} seed={3} />
      {/* Кофебот */}
      {t >= s2 - 0.1 && !napkin && (
        <g>
          <RobotBot x={840} y={1050} s={1.3} frame={frame} talking={t > startOf("b1")} />
        </g>
      )}
      {t > startOf("b1") && !napkin && <Bubble x={780} y={700} w={500} text={"МИНИМУМ\n1 000 000 ₽"} color="#5ec8ff" size={52} tail="d" />}
      {t > startOf("b1") + 3.2 && !napkin && <Bubble x={780} y={500} w={480} text={"ИЛИ НАЧНИ\nС ГАРАЖА"} color="#fff" size={42} tail="d" />}
      <Flash t={t} t0={startOf("b1") + 0.4} />
      {napkin && (
        <g>
          <rect width={W} height={H} fill="#000" opacity={Math.min(0.85, nk * 3)} />
          <g transform={`translate(540 ${900}) rotate(${-6}) scale(${ease(nk / 0.4)})`}>
            <rect x="-380" y="-380" width="760" height="760" rx="14" fill="#f6f2e6" />
            <polygon points="380,380 380,300 300,380" fill="#d8d2c0" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1="-340" y1={-320 + i * 90} x2="340" y2={-320 + i * 90} stroke="#e8e2d0" strokeWidth="2" />
            ))}
            <path d="M -150 -150 Q -170 150 20 140 Q 150 130 130 -170 Z" fill="none" stroke="#2a2a30" strokeWidth="14" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 - Math.min(1, Math.max(0, (nk - 0.3) / 1.2)) * 1400} />
            <path d="M 130 -90 Q 260 -80 220 40 Q 190 90 120 60" fill="none" stroke="#2a2a30" strokeWidth="14" strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 - Math.min(1, Math.max(0, (nk - 1.3) / 0.7)) * 600} />
            <path d="M -60 -230 Q -30 -280 0 -240 Q 30 -290 60 -230" fill="none" stroke="#2a2a30" strokeWidth="12" strokeLinecap="round" opacity={Math.min(1, Math.max(0, (nk - 1.5) / 0.4))} />
            <text x="0" y="300" textAnchor="middle" fill="#2a2a30" fontFamily="'Comic Sans MS','DejaVu Sans',cursive" fontSize="52" fontWeight="900" opacity={Math.min(1, Math.max(0, (nk - 1.7) / 0.4))}>
              ЛОГО (кривое)
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/* ---------- серия 2 ---------- */
const Ep2: React.FC<SP> = ({ frame, t }) => {
  const r1 = startOf("r1");
  const r1e = endOf("r1");
  const r2 = startOf("r2");
  const b2 = startOf("b2");
  if (t < startOf("s3") - 0.05) {
    const p = Math.min(0.999, Math.max(0, (t - r1) / (r1e - r1)));
    const idx = Math.floor(p * 3);
    const local = p * 3 - idx;
    const labels = ["1 · ПОДВАЛ С ПЛЕСЕНЬЮ", "2 · БЫВШИЙ ЛАРЁК", "3 · С ОКНОМ!"];
    const slide = (1 - ease(local / 0.2)) * 900;
    return (
      <g>
        <g transform={`translate(${slide} 0)`}>
          {idx === 0 && (
            <g>
              <Bg a="#0c1418" b="#16222a" id="bs" />
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx={rand(i) * W} cy={300 + rand(i + 5) * 900} r={30 + rand(i + 2) * 70} fill="#3a7a3a" opacity="0.5" />
              ))}
              {[0, 1, 2].map((i) => {
                const pp = ((frame * 0.03 + i / 3) % 1);
                return <circle key={i} cx={300 + i * 250} cy={400 + pp * 700} r="10" fill="#7fb8e8" opacity={1 - pp} />;
              })}
              <rect y="1250" width={W} height="670" fill="#0a1014" />
            </g>
          )}
          {idx === 1 && (
            <g>
              <Bg a="#2a3050" b="#5a4a60" id="ks" />
              <rect x="220" y="620" width="640" height="560" fill="#7a5a3a" />
              <rect x="260" y="680" width="560" height="260" fill="#1a1e2c" />
              <polygon points="180,620 900,620 860,540 220,540" fill="#d1261b" />
              <text x="540" y="860" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="90" fontWeight="900">
                ЛАРЁК
              </text>
              <rect y="1180" width={W} height="740" fill="#1b1420" />
            </g>
          )}
          {idx === 2 && (
            <g>
              <Bg a="#f6e8c8" b="#e2c898" id="ws" />
              <rect x="260" y="360" width="560" height="560" fill="#9fd8ff" stroke="#fff" strokeWidth="20" />
              <line x1="540" y1="360" x2="540" y2="920" stroke="#fff" strokeWidth="14" />
              <circle cx="660" cy="500" r="70" fill="#ffd34a" />
              <rect y="1200" width={W} height="720" fill="#c8a070" />
            </g>
          )}
          <g transform="translate(540 380)">
            <rect x="-330" y="-44" width="660" height="88" rx="14" fill="#06122bdd" />
            <text y="16" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="44" fontWeight="900">
              {labels[idx]}
            </text>
          </g>
        </g>
        <Bust x={240} y={940} s={1.8} who="stepa" frame={frame} look={1} />
        <Bust x={820} y={940} s={1.8} who="realtor" frame={frame} look={-1} talking />
      </g>
    );
  }
  if (t < b2 - 0.05) {
    const stamp = t - (r2 + 0.4);
    const priceDone = stamp > 0.1;
    return (
      <g>
        <Bg a="#2a1a2e" b="#4a2a3a" id="ofc" />
        <rect x="0" y="1260" width={W} height="660" fill="#2a1824" />
        <Bust x={230} y={900} s={2.2} who="stepa" frame={frame} look={1} talking={t < r2} />
        <Bust x={850} y={900} s={2.2} who="realtor" frame={frame} look={-1} talking={t >= r2} />
        <g transform="translate(540 520)">
          <rect x="-190" y="-80" width="380" height="160" rx="16" fill="#f4efe0" />
          <text y="-18" textAnchor="middle" fill="#6a6558" fontFamily={FONT} fontSize="30" fontWeight="800">
            АРЕНДА В МЕСЯЦ
          </text>
          <text y="48" textAnchor="middle" fill={priceDone ? "#2ac27a" : "#1b1b22"} fontFamily={FONT} fontSize="76" fontWeight="900">
            {priceDone ? "81 000 ₽" : "90 000 ₽"}
          </text>
          {priceDone && <line x1="-170" y1="40" x2="170" y2="40" stroke="#d1261b" strokeWidth="0" />}
        </g>
        {t < r2 && t > startOf("s3") + 0.4 && (
          <g>
            <Cup x={540} y={920} s={1.8} steam frame={frame} />
            <Bubble x={540} y={690} w={620} text={"КОФЕ БЕСПЛАТНО\nНА ЦЕЛЫЙ ГОД!"} color="#ffd34a" size={44} tail="d" />
          </g>
        )}
        {stamp > 0 && (
          <g transform={`translate(540 700) rotate(-12) scale(${stamp < 0.25 ? 3 - ease(stamp / 0.25) * 2 : 1})`}>
            <rect x="-210" y="-80" width="420" height="160" rx="18" fill="none" stroke="#d1261b" strokeWidth="14" />
            <text y="34" textAnchor="middle" fill="#d1261b" fontFamily={FONT} fontSize="110" fontWeight="900">
              −10%
            </text>
          </g>
        )}
        <Flash t={t} t0={r2 + 0.4} />
      </g>
    );
  }
  const k = t - b2;
  return (
    <g>
      <Bg a="#2a1a2e" b="#3a2230" id="ctr" />
      <rect x="120" y="360" width="840" height="1000" fill="#f4efe0" transform="rotate(-3 540 860)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1="200" y1={460 + i * 80} x2="880" y2={460 + i * 80} stroke="#d8d2c0" strokeWidth="4" transform="rotate(-3 540 860)" />
      ))}
      <text x="540" y="430" textAnchor="middle" fill="#2a2a30" fontFamily={FONT} fontSize="60" fontWeight="900" transform="rotate(-3 540 860)">
        ДОГОВОР АРЕНДЫ
      </text>
      <line x1="300" y1="1180" x2="780" y2="1180" stroke="#2a2a30" strokeWidth="5" transform="rotate(-3 540 860)" />
      <path d="M 330 1150 q 40 -80 70 0 t 70 0 t 70 -30 t 80 10 t 70 -20" fill="none" stroke="#c4121b" strokeWidth="14" strokeLinecap="round" strokeDasharray="800" strokeDashoffset={800 - Math.min(1, Math.max(0, (k - 0.3) / 0.9)) * 800} transform="rotate(-3 540 860)" />
      <g transform={`translate(${620 + Math.sin(frame * 0.4) * (k < 0.3 ? 20 : 0)} 1000) rotate(40)`}>
        <rect x="-10" y="-160" width="20" height="200" rx="8" fill={k < 0.3 ? "#3a6ae8" : "#c4121b"} />
        <polygon points="-10,40 10,40 0,70" fill="#2a2a30" />
      </g>
      {k < 0.3 && <Pop x={540} y={1330} text="НЕ ПИШЕТ!" t={t} t0={b2 + 0.02} size={90} color="#ff6b5e" />}
      {k > 1.3 && <Pop x={540} y={1330} text="(шутка)" t={t} t0={b2 + 1.3} size={70} color="#ffffff" rot={4} />}
      <Bust x={170} y={760} s={1.3} who="stepa" frame={frame} look={1} scared />
      <RobotBot x={900} y={600} s={1.1} frame={frame} talking />
      {k > 0.6 && <Bubble x={780} y={350} w={500} text={"ТЕПЕРЬ ТЫ ДОЛЖНИК"} color="#5ec8ff" size={40} tail="d" />}
    </g>
  );
};

/* ---------- серия 3 ---------- */
const Ep3: React.FC<SP> = ({ frame, t }) => {
  const s4 = startOf("s4");
  const b3 = startOf("b3");
  const l1 = startOf("l1");
  const s5 = startOf("s5");
  if (t < b3 - 0.05) {
    const k = t - s4;
    return (
      <g>
        <Bg a="#6a5a52" b="#8a7262" id="wl" />
        <rect y="1280" width={W} height="640" fill="#3a2a22" />
        {[0, 1, 2, 3, 4].map((i) => {
          const fall = Math.max(0, k - 0.4 - i * 0.35);
          return (
            <g key={i} transform={`translate(${60 + i * 200} ${280 + fall * fall * 600}) rotate(${fall * (i % 2 ? 40 : -40)} 90 200)`}>
              <rect width="180" height="900" fill={i % 2 ? "#e8d29a" : "#f0dfb0"} />
              {Array.from({ length: 8 }).map((_, j) => (
                <circle key={j} cx="90" cy={60 + j * 110} r="20" fill="#c8a860" opacity="0.7" />
              ))}
            </g>
          );
        })}
        <Bust x={260} y={900} s={2.0} who="stepa" frame={frame} look={1} scared talking />
        <g transform={`translate(${800 + Math.sin(frame * 1.7) * 4} 1260)`}>
          <Machine x={0} y={0} s={1.5} frame={frame} mode="spit" />
        </g>
        <Pop x={800} y={760} text="ПШШШ!" t={t} t0={s4 + 1.2} size={90} color="#ffffff" rot={8} />
        <Pop x={540} y={480} text="ШЛЁП!" t={t} t0={s4 + 0.9} size={100} color="#ffd34a" rot={-8} />
      </g>
    );
  }
  if (t < l1 - 0.05) {
    const k = t - b3;
    const prog = Math.min(1, k / 1.2);
    return (
      <g>
        <Bg a="#0b1a3a" b="#142a5a" id="ai" />
        <rect x="90" y="360" width="900" height="760" rx="30" fill="#0a1226" stroke="#5ec8ff" strokeWidth="8" />
        <text x="540" y="440" textAnchor="middle" fill="#5ec8ff" fontFamily={FONT} fontSize="40" fontWeight="900">
          НЕЙРОСЕТЬ · ДИЗАЙН
        </text>
        <rect x="160" y="480" width="760" height="30" rx="15" fill="#12306a" />
        <rect x="160" y="480" width={760 * prog} height="30" rx="15" fill="#5ec8ff" />
        {prog >= 1 && (
          <g>
            <rect x="160" y="560" width="760" height="460" fill="#8a4a3a" />
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="160" x2="920" y1={620 + i * 90} y2={620 + i * 90} stroke="#6a3a2a" strokeWidth="6" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <Cactus key={i} x={230 + (i % 5) * 150 + (i > 4 ? 70 : 0)} y={i > 4 ? 1000 : 880} s={0.55} />
            ))}
            <text x="540" y="1085" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="46" fontWeight="900">
              ЛОФТ С КАКТУСАМИ
            </text>
          </g>
        )}
        <RobotBot x={880} y={1360} s={1.1} frame={frame} talking />
        <Bust x={200} y={1320} s={1.3} who="stepa" frame={frame} look={1} />
      </g>
    );
  }
  const k = t - l1;
  return (
    <g>
      <Bg a="#4a3a3a" b="#6a5048" id="ld" />
      <rect y="1260" width={W} height="660" fill="#2a1e1a" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={560 + i * 140} y={1180 - i * 70} width="150" height={120 + i * 40} fill="#c8a060" stroke="#8a6a38" strokeWidth="5" />
      ))}
      <line x1="540" y1="0" x2="540" y2="260" stroke="#222" strokeWidth="5" />
      <circle cx="540" cy="290" r="40" fill="#ffe08a" opacity={0.7 + 0.2 * Math.sin(frame * 0.3)} />
      <Bust x={240} y={880} s={2.2} who="luda" frame={frame} look={1} talking={t < s5} />
      <Bust x={840} y={880} s={2.2} who="stepa" frame={frame} look={-1} talking={t >= s5} />
      {[0, 1, 2].map((i) => (
        <Cactus key={i} x={520 + i * 130} y={1280} s={1} />
      ))}
      {t >= s5 && <Pop x={540} y={560} text="ЭТО СТИЛЬ!" t={t} t0={s5 + 0.05} size={120} color="#ffd34a" />}
      {k > 0.1 && t < s5 && <Bubble x={300} y={470} w={560} text={"ЭТО КОФЕЙНЯ\nИЛИ СКЛАД?"} color="#e0a0ff" size={42} tail="d" />}
      <Flash t={t} t0={s5 + 0.05} />
    </g>
  );
};

/* ---------- серия 4 ---------- */
const Cafe: React.FC<{ frame: number; dim?: boolean }> = ({ frame, dim }) => (
  <g>
    <Bg a={dim ? "#3a2a2a" : "#7a5a48"} b={dim ? "#4a3430" : "#a07858"} id="cf" />
    <rect x="80" y="260" width="320" height="400" fill="#9fd8ff" stroke="#e8d7b8" strokeWidth="16" />
    <line x1="240" y1="260" x2="240" y2="660" stroke="#e8d7b8" strokeWidth="10" />
    <clipPath id="wclip">
      <rect x="88" y="268" width="304" height="384" />
    </clipPath>
    <g clipPath="url(#wclip)">
      <rect x="88" y="560" width="304" height="92" fill="#4a5a70" />
      {[0, 1, 2].map((i) => {
        const x = ((frame * (1.6 + i * 0.7) + i * 160) % 460) - 80;
        return (
          <g key={i} transform={`translate(${i % 2 ? 480 - x : x} ${600 + Math.sin(frame * 0.3 + i) * 3})`}>
            <rect x="-14" y="-90" width="28" height="64" rx="8" fill={["#2a3a5a", "#7a2a4a", "#2a5a3a"][i]} />
            <circle cx="0" cy="-106" r="16" fill="#e3b79a" />
            <rect x="-12" y="-28" width="9" height="28" fill="#222" transform={`rotate(${Math.sin(frame * 0.4 + i) * 20})`} />
            <rect x="3" y="-28" width="9" height="28" fill="#222" transform={`rotate(${-Math.sin(frame * 0.4 + i) * 20})`} />
          </g>
        );
      })}
    </g>
    <circle cx="840" cy="300" r="46" fill="#ffe08a" opacity={0.6 + 0.2 * Math.sin(frame * 0.1)} />
    <rect x="440" y="360" width="420" height="260" fill="#3a2a22" stroke="#e8d7b8" strokeWidth="10" />
    <text x="650" y="520" textAnchor="middle" fill="#ffd34a" fontFamily="'Comic Sans MS','DejaVu Sans',cursive" fontSize="64" fontWeight="900">
      КОФЕ
    </text>
    <Floor y={1360} c="#4a3226" />
  </g>
);

const Ep4: React.FC<SP> = ({ frame, t }) => {
  const g1 = startOf("g1");
  const g2 = startOf("g2");
  const d1 = startOf("d1");
  const g3 = startOf("g3");
  const s6 = startOf("s6");
  if (t < g2 - 0.05) {
    const k = t - g1;
    const gx = interpolate(k, [-0.3, 0.8], [1400, 760], clamp);
    return (
      <g>
        <Cafe frame={frame} />
        <Counter y={1280} />
        <g transform={`translate(${((frame * 6) % 1500) - 200} 1330)`} opacity={k < 1.5 ? 1 : 0}>
          <circle r="40" fill="none" stroke="#8a6a3a" strokeWidth="6" />
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#8a6a3a" strokeWidth="5" />
          <line x1="0" y1="-40" x2="0" y2="40" stroke="#8a6a3a" strokeWidth="5" />
        </g>
        <Bust x={240} y={940} s={2.0} who="stepa" frame={frame} look={1} />
        <g transform="translate(240 1250)">
          {[0, 1, 2, 3].map((i) => (
            <Cup key={i} x={-70 + i * 50} y={0} s={0.35} />
          ))}
        </g>
        <Bust x={560} y={940} s={1.5} who="dima" frame={frame} look={0} />
        <Bust x={gx} y={940} s={2.0} who="granny" frame={frame} look={-1} talking={k > 0.8} />
        {k > -0.3 && k < 0.5 && (
          <g transform="translate(980 330)">
            <circle r="40" fill="#ffd34a" />
            <text y="14" textAnchor="middle" fontFamily={FONT} fontSize="40" fontWeight="900">
              ДЗЫНЬ
            </text>
          </g>
        )}
      </g>
    );
  }
  if (t < g3 - 0.05) {
    const k = t - g2;
    return (
      <g>
        <Cafe frame={frame} />
        <Counter y={1280} />
        <Bust x={200} y={900} s={2.0} who="stepa" frame={frame} look={1} scared={k > 0.5} />
        <Bust x={860} y={900} s={2.0} who="granny" frame={frame} look={-1} talking={t < d1} />
        {Array.from({ length: 14 }).map((_, i) => {
          const p = Math.min(1, Math.max(0, (k - 0.05) / 0.9));
          return <circle key={i} cx={760 - p * (500 - (i % 5) * 20)} cy={800 + Math.sin(i * 2) * 60 + p * p * 300} r={6 + (i % 3) * 4} fill="#5a3a22" opacity={1 - p * 0.6} />;
        })}
        <Cup x={540} y={1290} s={1.3} frame={frame} steam />
        <Pop x={560} y={460} text="ФУ!!" t={t} t0={g2 + 0.05} size={170} color="#ff6b5e" />
        {t > d1 && (
          <g>
            <Bust x={560} y={1170} s={1.0} who="dima" frame={frame} look={0} talking />
            <Bubble x={540} y={760} w={640} text={"Я ЖЕ ГОВОРИЛ:\nКАПУЧИНО!"} color="#8affb0" size={42} tail="d" />
          </g>
        )}
      </g>
    );
  }
  const k = t - g3;
  const kc = t - (s6 + 0.8);
  return (
    <g>
      <Cafe frame={frame} />
      <Counter y={1280} />
      {[0, 1, 2, 3].map((i) => (
        <Bust key={i} x={160 + i * 250} y={i % 2 ? 1000 : 940} s={i === 1 ? 1.7 : 1.5} who="granny" frame={frame} look={i < 2 ? 1 : -1} talking={i === 1 && t < s6} />
      ))}
      <Bust x={900} y={1260} s={1.0} who="stepa" frame={frame} look={-1} talking={t >= s6} />
      {k > 0.1 && t < s6 && <Bubble x={420} y={420} w={640} text={"ЭТОТ ВАШ ГОРЬКИЙ,\nНО С МОЛОКОМ!"} color="#ff9ec4" size={40} tail="d" />}
      {kc > 0 && (
        <g transform={`translate(540 ${540 - ease(kc / 0.5) * 40}) scale(${ease(kc / 0.3)})`}>
          <rect x="-250" y="-100" width="500" height="200" rx="26" fill="#2ac27a" />
          <text y="30" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="110" fontWeight="900">
            +300 ₽
          </text>
          {Array.from({ length: 6 }).map((_, i) => (
            <Coin key={i} x={-220 + i * 90} y={-120 - Math.abs(Math.sin(kc * 6 + i)) * 40} r={26} />
          ))}
        </g>
      )}
      <Confetti t={t} t0={s6 + 0.8} seed={7} n={50} />
    </g>
  );
};

/* ---------- серия 5 ---------- */
const Ep5: React.FC<SP> = ({ frame, t }) => {
  const s7 = startOf("s7");
  const p1 = startOf("p1");
  const s8 = startOf("s8");
  if (t < p1 - 0.05) {
    const k = t - s7;
    return (
      <g>
        <Bg a="#2a2438" b="#403656" id="bx" />
        <Floor y={1300} c="#241c30" />
        <g transform="translate(540 980)">
          <rect x="-260" y="-160" width="520" height="320" fill="#c89a60" />
          <rect x="-260" y="-160" width="260" height="320" fill="#b88a52" />
          <polygon points={`-260,-160 -330,${-260 - Math.min(1, k / 0.7) * 60} -10,-160`} fill="#d8aa70" />
          <polygon points={`260,-160 330,${-260 - Math.min(1, k / 0.7) * 60} 10,-160`} fill="#d8aa70" />
          <rect x="-180" y="-30" width="360" height="80" fill="#f4efe0" />
          <text y="30" textAnchor="middle" fill="#3a2a18" fontFamily={FONT} fontSize="46" fontWeight="900">
            КОФЕ. НЕ ДЛЯ ПРОДАЖИ
          </text>
        </g>
        {k > 1.2 &&
          Array.from({ length: 8 }).map((_, i) => {
            const kk = k - 1.2 - i * 0.12;
            if (kk < 0) return null;
            return (
              <g key={i} transform={`translate(${540 + (i - 4) * 70 + Math.sin(kk * 4) * 20} ${760 - kk * 260 + kk * kk * 180}) rotate(${kk * 200})`}>
                <rect x="-20" y="-28" width="40" height="56" fill="#e8f0c8" stroke="#8aa84a" strokeWidth="4" />
                <line x1="0" y1="-28" x2="0" y2="-70" stroke="#8aa84a" strokeWidth="3" />
                <rect x="-6" y="-92" width="22" height="22" fill="#d8d2a0" />
              </g>
            );
          })}
        <Bust x={220} y={900} s={2.0} who="stepa" frame={frame} look={1} scared talking />
        <Pop x={720} y={420} text="ЧАЙ?!" t={t} t0={s7 + 1.3} size={150} color="#ffd34a" />
      </g>
    );
  }
  if (t < s8 - 0.05) {
    const k = t - p1;
    const review = "★ 1 ГДЕ МОЙ КОФЕ?!!";
    const typed = review.slice(0, Math.floor(Math.min(1, (t - (s7 + 2.5)) / 1.2) * review.length));
    return (
      <g>
        <Bg a="#10182c" b="#1a2850" id="rv" />
        <rect x="80" y="360" width="920" height="380" rx="26" fill="#f4efe0" />
        <text x="130" y="440" fill="#6a6558" fontFamily={FONT} fontSize="34" fontWeight="800">
          ОТЗЫВ · СТЕПА
        </text>
        <text x="130" y="560" fill="#d1261b" fontFamily={FONT} fontSize="62" fontWeight="900">
          {review}
        </text>
        <rect x="80" y="800" width="920" height="400" rx="26" fill="#12306a" stroke="#5ec8ff" strokeWidth="6" />
        <text x="130" y="870" fill="#9fe3ff" fontFamily={FONT} fontSize="34" fontWeight="800">
          ОТВЕТ ПОСТАВЩИКА · БОТ
        </text>
        <text x="130" y="960" fill="#fff" fontFamily={FONT} fontSize="46" fontWeight="900">
          Приносим извинения.
        </text>
        <text x="130" y="1030" fill="#fff" fontFamily={FONT} fontSize="46" fontWeight="900">
          Высылаем 2 мешка в подарок!
        </text>
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${1500 - ease((k - 0.8 - i * 0.4) / 0.9) * 800 + i * 120} ${1380 - i * 20})`}>
            <path d="M -90 0 Q -110 -160 -40 -190 L 40 -190 Q 110 -160 90 0 Z" fill="#c89a60" />
            <text y="-70" textAnchor="middle" fill="#3a2a18" fontFamily={FONT} fontSize="40" fontWeight="900">
              ЗЕРНО
            </text>
          </g>
        ))}
        {k > 1.8 && <Pop x={540} y={1280} text="+2 МЕШКА!" t={t} t0={p1 + 1.8} size={100} color="#7dffb0" />}
        <g opacity="0">{typed}</g>
      </g>
    );
  }
  const k = t - s8;
  return (
    <g>
      <Bg a="#2a2438" b="#403656" id="rd" />
      <rect x="120" y="340" width="840" height="1000" rx="40" fill="#0a0d16" stroke="#4a4f60" strokeWidth="10" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(190 ${440 + i * 170})`} opacity={interpolate(k, [i * 0.25, i * 0.25 + 0.3], [0, 1], clamp)}>
          <rect width="700" height="140" rx="18" fill="#1a2030" />
          <text x="24" y="52" fill={i < 3 ? "#ff6b5e" : "#7dffb0"} fontFamily={FONT} fontSize="44" fontWeight="900">
            {i < 3 ? "★☆☆☆☆" : "★★★★★"}
          </text>
          <text x="24" y="110" fill="#b8c4dc" fontFamily={FONT} fontSize="34" fontWeight="800">
            {["Прислали чай вместо кофе", "Не ответили. Деньги списали", "Коробка пустая", "Всё привезли вовремя", "Отличное зерно, рекомендую"][i]}
          </text>
        </g>
      ))}
      <g transform={`translate(${820 - Math.sin(frame * 0.1) * 20} ${760})`}>
        <circle r="110" fill="none" stroke="#ffd34a" strokeWidth="16" />
        <line x1="78" y1="78" x2="180" y2="180" stroke="#ffd34a" strokeWidth="22" strokeLinecap="round" />
      </g>
      <Bust x={220} y={1400} s={1.2} who="stepa" frame={frame} look={1} talking />
    </g>
  );
};

/* ---------- серия 6 ---------- */
const Ep6: React.FC<SP> = ({ frame, t }) => {
  const s9 = startOf("s9");
  const b4 = startOf("b4");
  const s10 = startOf("s10");
  const s10e = endOf("s10");
  if (t < b4 - 0.05) {
    const k = t - s9;
    return (
      <g>
        <Bg a="#1a1a3a" b="#3a2a50" id="st" />
        <rect y="1340" width={W} height="580" fill="#201a2c" />
        <rect x="40" y="860" width="360" height="480" fill="#7a5a3a" />
        <rect x="80" y="920" width="280" height="200" fill="#1a1e2c" />
        <polygon points="20,860 420,860 380,800 60,800" fill="#c96a5a" />
        <rect x="470" y="300" width="580" height="1040" fill="#7a2a2a" />
        <rect x="490" y="340" width="540" height="200" fill="#d1261b" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={510 + i * 38} cy="350" r="9" fill={(i + Math.floor(frame / 6)) % 2 ? "#ffd34a" : "#ffffff"} />
        ))}
        <text x="760" y="420" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="46" fontWeight="900">
          КОФЕЙНЯ
        </text>
        <text x="760" y="490" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="60" fontWeight="900">
          ДЯДИ ГЕНЫ
        </text>
        <g transform={`translate(760 700) rotate(${Math.sin(frame * 0.1) * 6})`}>
          <circle r="130" fill="#ffd34a" />
          <text y="30" textAnchor="middle" fill="#d1261b" fontFamily={FONT} fontSize="100" fontWeight="900">
            −50%
          </text>
        </g>
        <polygon points={`760,340 ${200 + Math.sin(frame * 0.05) * 300},1340 ${500 + Math.sin(frame * 0.05) * 300},1340`} fill="#fff6c8" opacity="0.12" />
        <Bust x={230} y={1180} s={1.4} who="stepa" frame={frame} look={1} scared talking />
        {[0, 1, 2].map((i) => {
          const p = ((frame * 0.05 + i / 3) % 1);
          return <ellipse key={i} cx={330 + i * 30} cy={1000 + p * 140} rx="8" ry="12" fill="#7fc8ff" opacity={1 - p} />;
        })}
        <Pop x={300} y={720} text="ПАНИКА!" t={t} t0={s9 + 1.2} size={92} color="#ff6b5e" rot={-8} />
        <Flash t={t} t0={s9 + 0.05} color="#ff3b2f" />
        {k < 0 && null}
      </g>
    );
  }
  const k = t - b4;
  const tail = t > s10e - 0.1;
  const names = ["ОЛЯ", "ДИМА", "САША", "ВАЛЯ"];
  return (
    <g>
      <Cafe frame={frame} />
      <Counter y={1280} />
      {names.map((n, i) => {
        const show = t > s10 + i * 0.35 || (i === 0 && t > b4 + 1.2);
        return show ? (
          <g key={n} transform={`scale(${bounce((t - (s10 + i * 0.35)) / 0.4)})`} style={{ transformOrigin: `${200 + i * 220}px 1270px` }}>
            <Cup x={200 + i * 220} y={1270} s={1.5} name={`для ${n}`} frame={frame} steam />
          </g>
        ) : null;
      })}
      <Bust x={250} y={880} s={2.0} who="stepa" frame={frame} look={1} talking={t >= s10} />
      <RobotBot x={860} y={900} s={1.4} frame={frame} talking={t < s10} />
      {t < s10 && <Bubble x={780} y={560} w={520} text={"НАЗОВИ КОФЕ\nИМЕНАМИ КЛИЕНТОВ"} color="#5ec8ff" size={40} tail="d" />}
      {tail && (
        <g>
          <rect width={W} height={H} fill="#000" opacity="0.35" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Bust x={180 + i * 360} y={760} s={1.1} who={i === 1 ? "granny" : "luda"} frame={frame} look={0} />
              <text x={180 + i * 360} y={560} textAnchor="middle" fontSize="70" fill="#ff6b9d">
                ❤
              </text>
            </g>
          ))}
          <g transform={`translate(860 1380)`}>
            <rect x="-200" y="-260" width="400" height="360" fill="#7a2a2a" />
            <rect x="-170" y="-230" width="340" height="190" fill="#1a1e2c" />
            <Bust x={0} y={-60} s={0.9} who="gena" frame={frame} look={-1} scared />
            <g transform={`translate(70 ${-150 + Math.sin(frame * 0.4) * 10})`}>
              <rect x="-14" y="-40" width="28" height="60" rx="10" fill="#e3b79a" />
            </g>
          </g>
          <Pop x={540} y={1300} text="ДЯДЯ ГЕНА: «ХМ?»" t={t} t0={s10e} size={70} color="#ffffff" rot={0} />
        </g>
      )}
      {k < 0 && null}
    </g>
  );
};

/* ---------- серия 7 ---------- */
const Ep7: React.FC<SP> = ({ frame, t }) => {
  const s11 = startOf("s11");
  const k1 = startOf("k1");
  const s12 = startOf("s12");
  const l2 = startOf("l2");
  if (t < k1 - 0.05) {
    const k = t - s11;
    const views = Math.min(100000, Math.max(0, (k - 1.0) / 3.2) * 100000);
    return (
      <g>
        <Bg a="#2a1038" b="#4a1858" id="ph" />
        <g transform="translate(540 900)">
          <rect x="-300" y="-560" width="600" height="1100" rx="60" fill="#0a0a12" stroke="#4a4f60" strokeWidth="10" />
          <rect x="-270" y="-520" width="540" height="1020" rx="36" fill="#1a1428" />
          <g transform="translate(0 -100)">
            <Machine x={0} y={80} s={1.7} frame={frame} mode="ok" />
            {Array.from({ length: 22 }).map((_, i) => {
              const kk = Math.max(0, k - 0.8);
              const a = (i / 22) * Math.PI * 2;
              const rr = Math.min(1, kk / 1.2) * (120 + rand(i) * 180);
              return <circle key={i} cx={Math.cos(a) * rr} cy={-100 + Math.sin(a) * rr * 0.8} r={30 + rand(i + 4) * 40} fill="#fff" opacity={Math.min(1, kk * 2) * 0.95} />;
            })}
          </g>
          <text y="330" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="70" fontWeight="900">
            ▶ {fmt(views)}
          </text>
          <text y="410" textAnchor="middle" fill="#ff6b9d" fontFamily={FONT} fontSize="46" fontWeight="900">
            просмотров
          </text>
          {Array.from({ length: 10 }).map((_, i) => {
            const kk = k - 1.2 - i * 0.2;
            if (kk < 0 || kk > 2) return null;
            return (
              <text key={i} x={140 + (i % 3) * 40} y={300 - kk * 300} fontSize="60" fill="#ff4f7a" opacity={1 - kk / 2}>
                ❤
              </text>
            );
          })}
        </g>
        <Pop x={540} y={380} text="БУМ!" t={t} t0={s11 + 0.9} size={170} color="#ffffff" />
        <Flash t={t} t0={s11 + 0.9} />
      </g>
    );
  }
  if (t < s12 - 0.05) {
    const k = t - k1;
    return (
      <g>
        <Cafe frame={frame} />
        <Counter y={1280} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Bust key={i} x={130 + i * 205 + Math.sin(frame * 0.4 + i) * 6} y={760 + (i % 2) * 160} s={1.15} who="kid" frame={frame} look={0} talking={i % 2 === 0} />
        ))}
        <Bust x={540} y={1250} s={0.9} who="stepa" frame={frame} look={0} scared />
        <Pop x={540} y={400} text="ВЗРЫВНОЙ!!" t={t} t0={k1 + 0.1} size={140} color="#ffd34a" />
        {k > 0.5 && <Bubble x={540} y={560} w={760} text={"ТОТ САМЫЙ ВЗРЫВНОЙ КОФЕ!"} color="#9ee0ff" size={44} tail="d" />}
      </g>
    );
  }
  if (t < l2 - 0.05) {
    const k = t - s12;
    return (
      <g>
        <Bg a="#2a1038" b="#5a1a58" id="sp" />
        <polygon points="540,0 140,1500 940,1500" fill="#fff6c8" opacity="0.16" />
        <Bust x={540} y={880} s={2.3} who="stepa" frame={frame} look={0} talking />
        <g transform={`translate(780 ${1000 - Math.min(1, k / 0.6) * 120})`}>
          <Cup x={0} y={0} s={2.2} />
          {Array.from({ length: 16 }).map((_, i) => {
            const kk = Math.max(0, k - 1.5);
            return <circle key={i} cx={Math.cos(i * 1.2) * kk * 160} cy={-90 - kk * 280 + kk * kk * 160 + Math.sin(i) * 30} r={24 + (i % 3) * 10} fill={i % 3 ? "#fff" : "#ff9ec4"} opacity={Math.max(0, 1 - kk / 2)} />;
          })}
        </g>
        <rect x="140" y="1360" width="800" height="150" rx="26" fill="#1b1b22" stroke="#ffd34a" strokeWidth="8" />
        <text x="540" y="1460" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="70" fontWeight="900">
          ВЗРЫВНОЙ ЛАТТЕ · 249 ₽
        </text>
        <Pop x={300} y={500} text="ТА-ДАМ!" t={t} t0={s12 + 0.3} size={110} color="#fff" rot={-8} />
        <Confetti t={t} t0={s12 + 2.2} seed={11} n={50} />
      </g>
    );
  }
  const k = t - l2;
  return (
    <g>
      <Cafe frame={frame} />
      <Counter y={1280} />
      {Array.from({ length: 9 }).map((_, i) => (
        <Bust key={i} x={80 + i * 120} y={1180 - (i % 3) * 10} s={0.62} who={i % 2 ? "kid" : "granny"} frame={frame} look={1} />
      ))}
      <Bust x={760} y={880} s={2.0} who="luda" frame={frame} look={-1} talking />
      <g transform={`translate(760 1260) rotate(-6)`}>
        <rect x="-150" y="-100" width="300" height="190" fill="#e8c070" />
        <text y="-10" textAnchor="middle" fill="#3a2a18" fontFamily={FONT} fontSize="56" fontWeight="900">
          НАЛОГИ
        </text>
      </g>
      <Bust x={260} y={880} s={2.0} who="stepa" frame={frame} look={1} scared />
      {Array.from({ length: 3 }).map((_, i) => {
        const p = ((frame * 0.04 + i / 3) % 1);
        return <ellipse key={i} cx={360 + i * 30} cy={700 + p * 140} rx="9" ry="14" fill="#7fc8ff" opacity={1 - p} />;
      })}
      {k > 0.3 && <Bubble x={760} y={560} w={520} text={"ТЫ ХОТЬ НАЛОГИ\nПЛАТИШЬ?"} color="#e0a0ff" size={42} tail="d" />}
    </g>
  );
};

/* ---------- серия 8 ---------- */
const Ep8: React.FC<SP> = ({ frame, t }) => {
  const s13 = startOf("s13");
  const b5 = startOf("b5");
  const s14 = startOf("s14");
  const k14 = t - s14;
  if (t < b5 - 0.05) {
    return (
      <g>
        <Bg a="#1a1a26" b="#2a2a3a" id="cr" />
        <Floor y={1320} c="#14141c" />
        <Machine x={700} y={1100} s={2.0} frame={frame} mode="broken" />
        <g transform="translate(300 600)">
          <rect x="-200" y="-90" width="400" height="190" rx="20" fill="#f4efe0" transform="rotate(-6)" />
          <text y="-20" textAnchor="middle" fill="#6a6558" fontFamily={FONT} fontSize="34" fontWeight="800" transform="rotate(-6)">
            РЕМОНТ
          </text>
          <text y="56" textAnchor="middle" fill="#d1261b" fontFamily={FONT} fontSize="84" fontWeight="900" transform="rotate(-6)">
            50 000 ₽
          </text>
        </g>
        <g transform="translate(250 1250)">
          <rect x="-90" y="-150" width="180" height="150" rx="16" fill="#9fd8ff" opacity="0.25" stroke="#9fd8ff" strokeWidth="6" />
          <text y="-60" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="46" fontWeight="900">
            0 ₽
          </text>
          <path d="M -80 -150 L 80 -20 M 80 -150 L -80 -20" stroke="#ffffff55" strokeWidth="3" />
        </g>
        <Bust x={260} y={880} s={1.9} who="stepa" frame={frame} look={0} scared />
        <g transform="translate(260 520)">
          <ellipse rx="120" ry="50" fill="#4a5060" />
          {Array.from({ length: 6 }).map((_, i) => {
            const p = ((frame * 0.05 + i / 6) % 1);
            return <line key={i} x1={-70 + i * 28} y1={40} x2={-70 + i * 28} y2={40 + p * 90} stroke="#7fc8ff" strokeWidth="5" opacity={1 - p} />;
          })}
        </g>
        <Pop x={700} y={480} text="КРАХ" t={t} t0={s13 + 0.4} size={140} color="#ff6b5e" />
      </g>
    );
  }
  if (t < s14 - 0.05) {
    return (
      <g>
        <Bg a="#0b1a3a" b="#142a5a" id="cf8" />
        <RobotBot x={540} y={780} s={2.0} frame={frame} talking />
        <Bubble x={540} y={380} w={820} text={"КРАУДФАНДИНГ:\nСОБЕРИ С КЛИЕНТОВ!"} color="#5ec8ff" size={54} tail="d" />
        <g transform="translate(540 1250)">
          <ellipse rx="190" ry="130" fill="#ff9ec4" />
          <circle cx="150" cy="-30" r="30" fill="#ff9ec4" />
          <rect x="-50" y="-132" width="100" height="14" rx="7" fill="#7a2a4a" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${-60 + i * 60} ${-300 + ((frame * 6 + i * 60) % 170)})`}>
              <Coin x={0} y={0} r={26} />
            </g>
          ))}
        </g>
        {[0, 1, 2].map((i) => (
          <Bust key={i} x={150 + i * 390} y={1420} s={0.7} who={i === 1 ? "granny" : "kid"} frame={frame} look={0} />
        ))}
      </g>
    );
  }
  const total = Math.min(50000, Math.max(0, (k14 - 0.4) / 2.4) * 30000 + Math.max(0, (k14 - 3.6) / 0.6) * 20000);
  const done = k14 > 4.9;
  return (
    <g>
      <Bg a="#2a2438" b="#403656" id="pf" />
      <Floor y={1330} c="#1c1626" />
      <g transform="translate(540 620)">
        <rect x="-420" y="-200" width="840" height="400" rx="20" fill="#f4efe0" transform="rotate(-2)" />
        <text y="-70" textAnchor="middle" fill="#1b1b22" fontFamily={FONT} fontSize="50" fontWeight="900" transform="rotate(-2)">
          СКИНЬТЕСЬ НА КОФЕМАШИНУ
        </text>
        <text y="20" textAnchor="middle" fill="#2ac27a" fontFamily={FONT} fontSize="48" fontWeight="900" transform="rotate(-2)">
          ГОД БЕСПЛАТНОГО СИРОПА!
        </text>
        <text y="130" textAnchor="middle" fill="#6a6558" fontFamily={FONT} fontSize="40" fontWeight="800" transform="rotate(-2)">
          сбор: {fmt(total)} / 50 000 ₽
        </text>
      </g>
      <rect x="140" y="900" width="800" height="50" rx="25" fill="#3a3450" />
      <rect x="140" y="900" width={800 * (total / 50000)} height="50" rx="25" fill="#2ac27a" />
      {!done && (
        <g transform="translate(540 1200)">
          <rect x="-140" y="-150" width="280" height="170" rx="30" fill="#9fd8ff" opacity="0.25" stroke="#9fd8ff" strokeWidth="6" />
          {Array.from({ length: Math.floor(total / 3500) }).map((_, i) => (
            <Coin key={i} x={-100 + (i % 5) * 50} y={-10 - Math.floor(i / 5) * 24} r={20} />
          ))}
          {Array.from({ length: 4 }).map((_, i) => {
            const p = ((frame * 0.06 + i / 4) % 1);
            return <Coin key={i} x={-90 + i * 60} y={-420 + p * 400} r={22} />;
          })}
        </g>
      )}
      {done && (
        <g transform={`translate(540 1100) scale(${ease((k14 - 4.9) / 0.5)})`}>
          <Machine x={0} y={120} s={2.2} frame={frame} mode="new" />
        </g>
      )}
      <Bust x={220} y={1400} s={0.9} who="stepa" frame={frame} look={1} talking={k14 < 3.6} />
      {done && <Pop x={540} y={380} text="КУПЛЕНА!" t={t} t0={s14 + 4.9} size={130} color="#7dffb0" />}
    </g>
  );
};

/* ---------- серия 9 ---------- */
const Ep9: React.FC<SP> = ({ frame, t }) => {
  const b6 = startOf("b6");
  const s15 = startOf("s15");
  const s16 = startOf("s16");
  if (t < s15 - 0.05) {
    const k = t - b6;
    return (
      <g>
        <Bg a="#10182c" b="#1a2850" id="sc" />
        <rect x="90" y="340" width="900" height="820" rx="26" fill="#f4efe0" />
        <text x="540" y="420" textAnchor="middle" fill="#2a2418" fontFamily={FONT} fontSize="50" fontWeight="900">
          РАСПИСАНИЕ СТЕПЫ
        </text>
        {Array.from({ length: 25 }).map((_, i) => (
          <rect key={i} x={120 + (i % 10) * 85} y={470 + Math.floor(i / 10) * 120} width="75" height="100" rx="12" fill={i === 24 ? "#d1261b" : "#2ac27a"} opacity={interpolate(k, [i * 0.06, i * 0.06 + 0.2], [0, 1], clamp)} />
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <text key={i} x={157 + (i % 10) * 85} y={535 + Math.floor(i / 10) * 120} textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="40" fontWeight="900" opacity={interpolate(k, [i * 0.06, i * 0.06 + 0.2], [0, 1], clamp)}>
            {i + 1}
          </text>
        ))}
        <text x="540" y="930" textAnchor="middle" fill="#d1261b" fontFamily={FONT} fontSize="62" fontWeight="900" opacity={interpolate(k, [1.8, 2.2], [0, 1], clamp)}>
          25 ЧАСОВ В СУТКИ
        </text>
        <rect x="0" y="1300" width={W} height="620" fill="#2a1e30" />
        <g transform="translate(540 1320)">
          <rect x="-260" y="-60" width="520" height="60" fill="#8a5d3b" />
          <Bust x={0} y={-10} s={1.3} who="stepa" frame={frame} look={0} closed />
          {[0, 1, 2].map((i) => (
            <text key={i} x={120 + i * 40} y={-210 - ((frame * 1.5 + i * 30) % 90)} fontFamily={FONT} fontSize={50 - i * 8} fontWeight="900" fill="#9ee0ff" opacity={0.9 - i * 0.2}>
              Z
            </text>
          ))}
        </g>
        <RobotBot x={900} y={1330} s={0.7} frame={frame} talking />
      </g>
    );
  }
  if (t < s16 - 0.05) {
    const k = t - s15;
    return (
      <g>
        <Cafe frame={frame} />
        <Counter y={1280} />
        <g transform="translate(540 380)">
          <rect x="-420" y="-90" width="840" height="190" rx="26" fill="#1b1b22" stroke="#ffd34a" strokeWidth="8" />
          <text y="-14" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="64" fontWeight="900">
            ДЕНЬ САМООБСЛУЖИВАНИЯ
          </text>
          <text y="62" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="44" fontWeight="800">
            плати по совести
          </text>
        </g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Bust x={170 + i * 370} y={900} s={1.5} who={i === 1 ? "granny" : "luda"} frame={frame} look={0} talking={i === 1} />
            <Cup x={170 + i * 370 + 130} y={1270} s={1.0} steam frame={frame} />
          </g>
        ))}
        <Bust x={900} y={1200} s={1.0} who="dima" frame={frame} look={-1} />
        <g transform="translate(900 1100)">
          <rect x="-90" y="-40" width="180" height="50" rx="10" fill="#2ac27a" />
          <text y="-4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="30" fontWeight="900">
            1/2 СТАВКИ
          </text>
        </g>
        {Array.from({ length: 4 }).map((_, i) => {
          const p = ((frame * 0.05 + i / 4) % 1);
          return <Coin key={i} x={440 + i * 70} y={1000 + p * 220} r={20} />;
        })}
        {k < 0 && null}
      </g>
    );
  }
  const k = t - s16;
  return (
    <g>
      <Cafe frame={frame} />
      <Counter y={1280} />
      <g transform="translate(540 1230)">
        <rect x="-260" y="-130" width="520" height="140" rx="16" fill="#2a2d38" />
        {Array.from({ length: 18 }).map((_, i) => {
          const kk = Math.max(0, k - 0.3 - i * 0.07);
          return <rect key={i} x={-40 + Math.sin(i * 2) * 200 * Math.min(1, kk * 2)} y={-140 - kk * 360 + kk * kk * 200} width="80" height="40" rx="4" fill="#7dffb0" transform={`rotate(${i * 40 + kk * 200})`} opacity={Math.max(0, 1 - kk / 2.5)} />;
        })}
      </g>
      <Bust x={540} y={860} s={2.4} who="stepa" frame={frame} look={0} scared talking />
      <g transform={`translate(540 ${420 - ease((k - 0.4) / 0.5) * 10}) scale(${ease((k - 0.4) / 0.35)})`}>
        <rect x="-280" y="-80" width="560" height="160" rx="26" fill="#2ac27a" />
        <text y="36" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="96" fontWeight="900">
          +18 000 ₽
        </text>
      </g>
      <Confetti t={t} t0={s16 + 0.5} seed={13} n={50} />
    </g>
  );
};

/* ---------- серия 10 ---------- */
const Facade: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <Bg a="#0a0d24" b="#1b1642" id="fc" />
    {Array.from({ length: 50 }).map((_, i) => (
      <circle key={i} cx={rand(i + 3) * W} cy={rand(i + 60) * 700} r={1 + rand(i) * 2} fill="#fff" opacity="0.7" />
    ))}
    <rect x="120" y="700" width="840" height="700" fill="#5a3b26" />
    <rect x="160" y="900" width="320" height="400" fill="#ffe08a" opacity="0.9" />
    <rect x="560" y="900" width="320" height="400" fill="#ffe08a" opacity="0.9" />
    <rect x="460" y="1060" width="160" height="340" fill="#3a2a22" />
    <rect x="80" y="620" width="920" height="150" rx="18" fill="#1b1b22" stroke="#ffd34a" strokeWidth="10" />
    <text x="540" y="722" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="92" fontWeight="900">
      СТЕПА И ЗЕРНО
    </text>
    {Array.from({ length: 22 }).map((_, i) => (
      <circle key={i} cx={100 + i * 40} cy={590 + Math.sin(i * 0.8) * 20} r="12" fill={["#ff6b9d", "#ffd34a", "#5ec8ff", "#7dffb0"][(i + Math.floor(frame / 8)) % 4]} />
    ))}
    <rect y="1400" width={W} height="520" fill="#14101c" />
  </g>
);

const Ep10: React.FC<SP> = ({ frame, t }) => {
  const l3 = startOf("l3");
  const s17 = startOf("s17");
  const b7e = endOf("b7");
  const n11 = startOf("n11");
  if (t < s17 - 0.05) {
    return (
      <g>
        <Bg a="#6a4a38" b="#a07858" id="bl" />
        {Array.from({ length: 24 }).map((_, i) => (
          <circle key={i} cx={30 + i * 44} cy={230 + Math.sin(i * 0.7) * 24} r="12" fill={["#ff6b9d", "#ffd34a", "#5ec8ff", "#7dffb0"][(i + Math.floor(frame / 8)) % 4]} />
        ))}
        <rect x="60" y="300" width="360" height="430" fill="#2a1e18" stroke="#e8d7b8" strokeWidth="14" />
        <Bust x={240} y={640} s={1.1} who="granny" frame={frame} look={0} />
        <text x="240" y="780" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="32" fontWeight="900">
          «ПЕРВАЯ КЛИЕНТКА»
        </text>
        <rect x="480" y="340" width="540" height="150" rx="20" fill="#1b1b22" stroke="#ffd34a" strokeWidth="8" />
        <text x="750" y="440" textAnchor="middle" fill="#ffd34a" fontFamily={FONT} fontSize="58" fontWeight="900">
          СТЕПА И ЗЕРНО
        </text>
        <Floor y={1360} c="#4a3226" />
        <Counter y={1280} />
        {[0, 1, 2, 3].map((i) => (
          <Bust key={i} x={110 + i * 270} y={1090 - (i % 2) * 10} s={0.95} who={i % 2 ? "kid" : "granny"} frame={frame} look={0} />
        ))}
        <Bust x={760} y={860} s={2.0} who="luda" frame={frame} look={-1} talking />
        <g transform="translate(760 1230) rotate(-5)">
          <rect x="-150" y="-100" width="300" height="190" fill="#e8c070" />
          <text y="-10" textAnchor="middle" fill="#3a2a18" fontFamily={FONT} fontSize="54" fontWeight="900">
            В ПЛЮСЕ ✓
          </text>
        </g>
        <Bust x={290} y={880} s={2.0} who="stepa" frame={frame} look={1} />
        <Pop x={540} y={470} text="+385 000 ₽" t={t} t0={l3 + 0.4} size={100} color="#7dffb0" />
        <Confetti t={t} t0={l3 + 0.3} seed={21} />
      </g>
    );
  }
  const pull = interpolate(t, [b7e - 0.6, b7e + 1.6], [0, 1], clamp);
  const interior = pull < 0.55;
  return (
    <g>
      {interior ? (
        <g>
          <Bg a="#140a2a" b="#241046" id="ni" />
          <rect x="0" y="1300" width={W} height="620" fill="#1d1230" />
          <rect x="560" y="260" width="380" height="460" fill="#0b0618" stroke="#ffd34a" strokeWidth="8" />
          <circle cx="820" cy="360" r="40" fill="#e8ecf5" />
          <Bust x={270} y={900} s={2.2} who="stepa" frame={frame} look={1} talking={t < b7e - 2.5} />
          <RobotBot x={820} y={1150} s={1.6} frame={frame} talking={t > startOf("b7")} />
          {t < startOf("b7") && <Bubble x={300} y={470} w={520} text={"НУ ЧТО, ОТКРЫВАЕМ\nВТОРУЮ ТОЧКУ?"} color="#ffb066" size={40} tail="d" />}
          {t >= startOf("b7") && <Bubble x={780} y={700} w={560} text={"ТОЛЬКО ЕСЛИ ТЫ\nСНАЧАЛА ВЫСПИШЬСЯ"} color="#5ec8ff" size={40} tail="d" />}
        </g>
      ) : (
        <g transform={`translate(540 960) scale(${1.9 - pull * 0.9}) translate(-540 -960)`}>
          <Facade frame={frame} />
        </g>
      )}
      {t >= n11 - 0.1 && (
        <g>
          <rect width={W} height={H} fill="#000" opacity="0.45" />
          <g transform={`translate(540 ${H - (t - n11) * 150})`}>
            {[
              "СТЕПА И ЗЕРНО",
              "",
              "Степа заработал не только деньги,",
              "но и постоянных клиентов.",
              "",
              "И даже бабушку, которая теперь",
              "пьёт только флэт уайт.",
              "",
              "КОНЕЦ",
            ].map((l, i) => (
              <text key={i} x="0" y={i * 90} textAnchor="middle" fill={i === 0 || i === 8 ? "#ffd34a" : "#fff"} fontFamily={FONT} fontSize={i === 0 ? 76 : 44} fontWeight="900">
                {l}
              </text>
            ))}
          </g>
          <g transform={`translate(860 1400)`}>
            <Bust x={0} y={0} s={1.0} who="granny" frame={frame} look={0} />
            <Cup x={110} y={170} s={1.0} steam frame={frame} />
          </g>
        </g>
      )}
    </g>
  );
};

/* ---------- заполнение пустых зон ---------- */
const Ledger: React.FC<{ t: number }> = ({ t }) => {
  if (t >= startOf("n11") - 0.1) return null;
  const past = BALANCE_EVENTS.filter((e) => e.at <= t);
  const rows = past.slice(-4).reverse();
  let acc = 0;
  const pts: [number, number][] = [[0, 0]];
  for (const e of BALANCE_EVENTS) {
    if (e.at > t) break;
    pts.push([e.at, acc]);
    acc += e.delta;
    pts.push([e.at + 0.9, acc]);
  }
  pts.push([t, acc]);
  const maxV = 420000;
  const cw = 330;
  const ch = 150;
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"} ${(x / DURATION_SEC) * cw} ${ch - (Math.max(0, y) / maxV) * ch}`).join(" ");
  return (
    <div style={{ position: "absolute", left: 36, right: 36, bottom: 86, height: 330, display: "flex", gap: 20, fontFamily: FONT, color: "#fff", background: "rgba(8,10,24,.74)", border: "2px solid #ffffff22", borderRadius: 26, padding: "16px 22px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 5, opacity: 0.7, marginBottom: 8 }}>ЖУРНАЛ</div>
        {rows.length === 0 && <div style={{ fontSize: 30, fontWeight: 800, opacity: 0.5, marginTop: 40 }}>операций пока нет…</div>}
        {rows.map((e, i) => {
          const k = Math.min(1, (t - e.at) / 0.3);
          const up = e.delta >= 0;
          return (
            <div key={e.at + e.label} style={{ display: "flex", alignItems: "center", gap: 14, height: 62, transform: i === 0 ? `translateX(${(1 - k) * 80}px)` : "none", opacity: i === 0 ? k : 1 - i * 0.2 }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, background: up ? "#2ac27a" : "#ff5a4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900 }}>{up ? "↑" : "↓"}</div>
              <div style={{ flex: 1, fontSize: 25, fontWeight: 800, letterSpacing: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: up ? "#7dffb0" : "#ff8a7e", fontVariantNumeric: "tabular-nums" }}>
                {up ? "+" : "−"}{fmt(Math.abs(e.delta))} ₽
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ width: cw + 10 }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 5, opacity: 0.7, marginBottom: 8 }}>ДВИЖЕНИЕ ДЕНЕГ</div>
        <svg width={cw + 10} height={ch + 40}>
          <line x1="0" y1={ch} x2={cw} y2={ch} stroke="#ffffff33" strokeWidth="2" />
          <path d={path} fill="none" stroke="#7dffb0" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={(t / DURATION_SEC) * cw} cy={ch - (Math.max(0, acc) / maxV) * ch} r="9" fill="#fff" />
        </svg>
      </div>
    </div>
  );
};

const Ticker: React.FC<{ t: number }> = ({ t }) => {
  const ep = episodeAt(t);
  const msg = `★ СТЕПА И ЗЕРНО ★ СЕРИЯ ${ep.n}: ${ep.title.toUpperCase()} ★ КАССА ДОЛЖНА ИГРАТЬ ★ `;
  return (
    <div style={{ position: "absolute", top: 250, left: 0, right: 0, height: 50, overflow: "hidden", background: "rgba(0,0,0,.45)", fontFamily: FONT }}>
      <div style={{ whiteSpace: "nowrap", fontSize: 28, fontWeight: 900, letterSpacing: 4, color: "#ffd34a", lineHeight: "50px", transform: `translateX(${-((t * 170) % 1500)}px)` }}>
        {msg.repeat(6)}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 5, width: `${((ep.n - 1 + (t - ep.start) / (ep.end - ep.start)) / 10) * 100}%`, background: "#ff6b9d" }} />
    </div>
  );
};

const Beans: React.FC<{ t: number }> = ({ t }) => (
  <g opacity="0.35">
    {Array.from({ length: 16 }).map((_, i) => {
      const x = (rand(i + 1) * W + t * (30 + rand(i) * 50)) % (W + 100) - 50;
      const y = (rand(i + 40) * H - t * (20 + rand(i + 9) * 40) + H * 3) % H;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${t * 40 + i * 30})`}>
          <ellipse rx="14" ry="9" fill="#5a3a22" />
          <path d="M -12 0 Q 0 -6 12 0" stroke="#2a1a10" strokeWidth="2" fill="none" />
        </g>
      );
    })}
  </g>
);

const SpeedLines: React.FC<{ k: number }> = ({ k }) =>
  k < 0.15 ? null : (
    <g opacity={Math.min(0.5, k * 0.5)}>
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return <line key={i} x1={W / 2 + Math.cos(a) * 520} y1={H * 0.42 + Math.sin(a) * 620} x2={W / 2 + Math.cos(a) * 1300} y2={H * 0.42 + Math.sin(a) * 1500} stroke="#fff" strokeWidth={4 + (i % 3) * 3} />;
      })}
    </g>
  );


/* ---------- интерфейс ---------- */
const Balance: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  let bal = 0;
  for (const e of BALANCE_EVENTS) bal += e.delta * ease((t - e.at) / 0.9);
  const recent = [...BALANCE_EVENTS].reverse().find((e) => t >= e.at && t < e.at + 2.4);
  const flashing = recent ? 1 - (t - recent.at) / 2.4 : 0;
  const col = recent ? (recent.delta >= 0 ? "#7dffb0" : "#ff6b5e") : "#ffffff";
  const low = bal < 15000 && t > startOf("s1") + 1;
  return (
    <div style={{ position: "absolute", top: 150, right: 44, width: 420, fontFamily: FONT, color: "#fff" }}>
      <div style={{ background: "rgba(10,12,28,.82)", border: `3px solid ${recent ? col : "#ffffff44"}`, borderRadius: 22, padding: "14px 22px", boxShadow: recent ? `0 0 ${30 * flashing}px ${col}` : "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800, letterSpacing: 4, opacity: 0.75 }}>
          <span>БАЛАНС</span>
          <span>{low ? "⚠ МАЛО" : "КОФЕЙНЯ"}</span>
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, color: recent ? col : low ? "#ff6b5e" : "#fff", fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.06 * flashing})`, transformOrigin: "right center", textAlign: "right" }}>
          {fmt(bal)} ₽
        </div>
      </div>
      {recent && (
        <div style={{ textAlign: "right", marginTop: 10, transform: `translateY(${-(t - recent.at) * 18}px)`, opacity: Math.min(1, flashing * 2) }}>
          <span style={{ background: col, color: "#0b0b12", fontWeight: 900, fontSize: 36, padding: "6px 16px", borderRadius: 12 }}>
            {recent.delta >= 0 ? "+" : "−"}
            {fmt(Math.abs(recent.delta))} ₽
          </span>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, marginTop: 8, color: col }}>{recent.label}</div>
        </div>
      )}
      <div style={{ display: "none" }}>{frame}</div>
    </div>
  );
};

const Header: React.FC<{ t: number }> = ({ t }) => {
  const ep = episodeAt(t);
  return (
    <div style={{ position: "absolute", top: 150, left: 56, fontFamily: FONT, color: "#fff", maxWidth: 520 }}>
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 4 }}>СТЕПА И ЗЕРНО</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, opacity: 0.65, marginTop: 6 }}>
        СЕРИЯ {ep.n}/10 · {ep.title.toUpperCase()}
      </div>
    </div>
  );
};

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const line = lineAt(t);
  if (!line || line.id === "n11") return null;
  const words = line.text.split(" ");
  const prog = Math.min(1, Math.max(0, (t - line.start) / line.dur));
  const idx = Math.floor(prog * words.length * 1.04);
  const col = WHO_COLOR[line.who];
  const o = interpolate(t, [line.start, line.start + 0.08], [0, 1], clamp);
  const pop = interpolate(t, [line.start, line.start + 0.12], [1.12, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 1060, padding: "22px 30px", borderRadius: 30, background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.55) 22%, rgba(0,0,0,.55) 78%, rgba(0,0,0,0))", textAlign: "center", fontFamily: FONT, opacity: o, transform: `scale(${pop})` }}>
      {line.who !== "narr" && <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 6, color: col, marginBottom: 8 }}>{WHO_NAME[line.who]}</div>}
      <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.1, textShadow: "0 4px 18px rgba(0,0,0,.95), 0 0 6px rgba(0,0,0,.9)" }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: i === idx ? col : i < idx ? "#fff" : "rgba(255,255,255,.5)" }}>
            {w}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------- звук ---------- */
const Audios: React.FC = () => {
  const S = (s: number) => Math.max(0, Math.round(s * FPS));
  const C = (f: string) => staticFile(`cafe/${f}`);
  const sfx = (key: string, from: number, dur: number, f: string, vol: number, loop = false) => (
    <Sequence key={key} from={S(from)} durationInFrames={S(dur)}>
      <Audio src={C(f)} volume={vol} loop={loop} />
    </Sequence>
  );
  const items: React.ReactNode[] = [
    sfx("c1", EPISODES[0].start, 1.3, "x-whoosh.mp3", 0.5),
    sfx("sp1", startOf("s1") + 2.6, 1.2, "x-spark.mp3", 0.7),
    sfx("pen", startOf("b2"), 1.0, "x-pen.mp3", 0.8),
    sfx("sc1", startOf("b1") + 0.2, 1.0, "x-scratch.mp3", 0.6),
    sfx("m4", startOf("s4"), 2.0, "x-machine.mp3", 0.8),
    sfx("w4", startOf("s4") + 0.6, 2.0, "x-wall.mp3", 0.8),
    sfx("sc5", startOf("s5"), 1.0, "x-scratch.mp3", 0.6),
    sfx("bell4", startOf("g1") - 0.3, 2.0, "x-bell.mp3", 0.8),
    sfx("bell4b", startOf("g3"), 2.0, "x-bell.mp3", 0.7),
    sfx("crowd4", startOf("g3"), 7, "x-crowd.mp3", 0.35, true),
    sfx("cash4", startOf("s6") + 0.8, 1.6, "x-cash.mp3", 0.9),
    sfx("foam7", startOf("s11") + 0.9, 2.0, "x-foam.mp3", 0.9),
    sfx("notif7", startOf("s11") + 1.2, 3.0, "x-notif.mp3", 0.6),
    sfx("crowd7", startOf("k1"), 9, "x-crowd.mp3", 0.4, true),
    sfx("foam7b", startOf("s12") + 2.2, 2.0, "x-foam.mp3", 0.8),
    sfx("m8", startOf("s13"), 2.0, "x-machine.mp3", 0.7),
    sfx("coins8", startOf("s14") + 0.6, 2.0, "x-coins.mp3", 0.8),
    sfx("coins8b", startOf("s14") + 2.2, 2.0, "x-coins.mp3", 0.8),
    sfx("sp8", startOf("s14") + 4.9, 1.2, "x-spark.mp3", 0.8),
    sfx("cash9", startOf("s16") + 0.4, 1.6, "x-cash.mp3", 0.9),
    sfx("sp9", startOf("s16") + 0.5, 1.2, "x-spark.mp3", 0.6),
    sfx("sp10", startOf("l3") + 0.4, 1.2, "x-spark.mp3", 0.8),
    sfx("crowd10", startOf("l3"), 6, "x-crowd.mp3", 0.3, true),
  ];
  EPISODES.slice(1).forEach((e) => items.push(sfx(`w${e.n}`, e.start, 1.3, "x-whoosh.mp3", 0.5)));
  return (
    <>
      {items}
      {LINES.map((l) => (
        <Sequence key={l.id} from={S(l.start)} durationInFrames={Math.ceil((l.dur + 0.4) * FPS)}>
          <Audio src={C(l.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

const KICKS = [
  startOf("s1") + 1.4, startOf("b1") + 0.4, startOf("r2") + 0.4, startOf("b2") + 0.1, startOf("s4") + 0.9, startOf("s5") + 0.05,
  startOf("g2") + 0.1, startOf("s6") + 0.8, startOf("s7") + 1.3, startOf("s9") + 1.2, startOf("s11") + 0.9, startOf("k1") + 0.1,
  startOf("s12") + 2.2, startOf("s13") + 0.4, startOf("s14") + 4.9, startOf("s16") + 0.4, startOf("l3") + 0.4,
];

export const Cafe2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ep = episodeAt(t);
  const narrNow = LINES.find((l) => l.who === "narr" && l.id !== "n11" && t >= l.start - 0.25 && t < l.end + 0.2);

  const kick = Math.max(0, ...KICKS.map((k) => (t >= k && t < k + 0.5 ? 1 - (t - k) / 0.5 : 0)));
  const amp = 1.5 + kick * 24;
  const dx = Math.sin(frame * 1.7) * amp * 0.7;
  const dy = Math.cos(frame * 1.3) * amp * 0.7;
  const zoom = 1.02 + kick * 0.05 + 0.012 * Math.sin(t * 1.3);

  const body = (() => {
    if (narrNow) {
      const e = EPISODES[Number(narrNow.id.slice(1)) - 1];
      return <Card frame={frame} t={t} ep={e.n} title={e.title} k={t - (narrNow.start - 0.25)} />;
    }
    switch (ep.n) {
      case 1:
        return <Ep1 frame={frame} t={t} />;
      case 2:
        return <Ep2 frame={frame} t={t} />;
      case 3:
        return <Ep3 frame={frame} t={t} />;
      case 4:
        return <Ep4 frame={frame} t={t} />;
      case 5:
        return <Ep5 frame={frame} t={t} />;
      case 6:
        return <Ep6 frame={frame} t={t} />;
      case 7:
        return <Ep7 frame={frame} t={t} />;
      case 8:
        return <Ep8 frame={frame} t={t} />;
      case 9:
        return <Ep9 frame={frame} t={t} />;
      default:
        return <Ep10 frame={frame} t={t} />;
    }
  })();

  const fadeIn = interpolate(t, [0, 0.3], [0, 1], clamp);
  const fadeOut = interpolate(t, [DURATION_SEC - 0.7, DURATION_SEC], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0710" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: Math.min(fadeIn, fadeOut) }}>
        <div style={{ transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: "50% 45%" }}>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            {body}
            <Beans t={t} />
            <SpeedLines k={kick} />
            <defs>
              <radialGradient id="vigc">
                <stop offset="0.55" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.55" />
              </radialGradient>
            </defs>
            <rect width={W} height={H} fill="url(#vigc)" />
          </svg>
        </div>
      </div>
      <Ticker t={t} />
      <Header t={t} />
      <Balance t={t} frame={frame} />
      <Ledger t={t} />
      <Subtitle t={t} />
      <Audios />
    </AbsoluteFill>
  );
};
