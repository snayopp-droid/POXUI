import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ART_H, ART_W, rand } from "./Art";
import { Bust, type BustWho } from "./Home";
import { FPS, LINES, RULES, WHO_COLOR, WHO_NAME, sceneAt, speakingAt, type SceneId } from "./timeline4";

const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- общие элементы ---------- */
const flick = (frame: number, seed = 0) =>
  0.82 + 0.12 * Math.sin(frame * 0.6 + seed) + 0.06 * Math.sin(frame * 1.7 + seed * 2);

const Room: React.FC<{ top?: string; bottom?: string; floor?: string }> = ({
  top = "#0b0d16",
  bottom = "#141824",
  floor = "#0a0b10",
}) => (
  <g>
    <defs>
      <linearGradient id="rm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect width={ART_W} height={ART_H} fill="url(#rm)" />
    <polygon points={`0,1000 ${ART_W},980 ${ART_W},${ART_H} 0,${ART_H}`} fill={floor} />
  </g>
);

const Candle: React.FC<{ x: number; y: number; s?: number; frame: number; lit?: boolean; glow?: number }> = ({
  x,
  y,
  s = 1,
  frame,
  lit = true,
  glow = 1,
}) => {
  const f = flick(frame, x);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {lit && <circle cx="0" cy="-90" r={620 * f * glow} fill="url(#cglow)" />}
      <rect x="-22" y="-80" width="44" height="130" rx="6" fill="#e8dcc0" />
      <rect x="-22" y="-80" width="22" height="130" fill="#cfc2a4" />
      <rect x="-3" y="-92" width="6" height="14" fill="#222" />
      {lit && (
        <g transform={`scale(${0.9 + 0.2 * f} ${0.9 + 0.25 * f})`}>
          <polygon points="0,-176 -16,-120 -6,-94 8,-96 17,-122" fill="#ff9a2e" />
          <polygon points="0,-150 -8,-118 0,-98 9,-120" fill="#ffe08a" />
        </g>
      )}
      <ellipse cx="0" cy="52" rx="56" ry="10" fill="#2a2018" />
    </g>
  );
};

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="cglow">
      <stop offset="0" stopColor="#ffb25a" stopOpacity="0.6" />
      <stop offset="0.45" stopColor="#ff8a2a" stopOpacity="0.2" />
      <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="vig4">
      <stop offset="0.35" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.92" />
    </radialGradient>
    <radialGradient id="redg">
      <stop offset="0" stopColor="#ff2a1a" stopOpacity="0.55" />
      <stop offset="1" stopColor="#ff2a1a" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Door: React.FC<{ x?: number; w?: number; shake?: number; frame: number; chain?: boolean }> = ({
  x = 260,
  w = 560,
  shake = 0,
  frame,
  chain = true,
}) => (
  <g transform={`translate(${Math.sin(frame * 2.3) * shake} 0)`}>
    <rect x={x} y="180" width={w} height="860" fill="#3d2a1c" />
    <rect x={x} y="180" width={w / 2} height="860" fill="#4a3322" />
    <rect x={x + 50} y="250" width={w - 100} height="300" fill="#35241a" />
    <rect x={x + 50} y="600" width={w - 100} height="360" fill="#35241a" />
    <circle cx={x + w / 2} cy="400" r="20" fill="#0b0b0b" stroke="#c9a14a" strokeWidth="6" />
    <rect x={x + w - 130} y="560" width="34" height="34" rx="8" fill="#8a8e9c" />
    {chain && <polyline points={`${x + w - 150},500 ${x + w - 100},500 ${x + w - 100},520`} stroke="#b9bcc6" strokeWidth="6" fill="none" />}
  </g>
);

const Phone: React.FC<{ x: number; y: number; s?: number; pct: number; frame: number; noSignal?: boolean; dim?: boolean }> = ({
  x,
  y,
  s = 1,
  pct,
  frame,
  noSignal,
  dim,
}) => {
  const low = pct <= 7;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-190" y="-390" width="380" height="780" rx="50" fill="#0a0b10" stroke="#2a2f3d" strokeWidth="8" />
      <rect x="-172" y="-370" width="344" height="740" rx="38" fill={dim ? "#0c0f18" : "#10162a"} />
      <text x="-150" y="-320" fill="#fff" fontFamily={FONT} fontSize="40" fontWeight="800">
        04:44
      </text>
      <rect x="82" y="-352" width="64" height="30" rx="6" fill="none" stroke="#fff" strokeWidth="4" />
      <rect x="86" y="-348" width={Math.max(3, 56 * (pct / 100))} height="22" rx="3" fill={low ? "#ff3b2f" : "#7dffb0"} />
      <text x="40" y="-322" fill={low ? "#ff6b5e" : "#fff"} fontFamily={FONT} fontSize="30" fontWeight="900" textAnchor="end">
        {pct}%
      </text>
      {noSignal && (
        <g>
          <g transform="translate(0 -40)">
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-60 + i * 32} y={30 - i * 22} width="20" height={20 + i * 22} fill="#666" />
            ))}
            <line x1="-80" y1="60" x2="80" y2="-70" stroke="#ff3b2f" strokeWidth="10" />
          </g>
          <text y="120" fill="#fff" fontFamily={FONT} fontSize="64" fontWeight="900" textAnchor="middle">
            НЕТ СЕТИ
          </text>
        </g>
      )}
      <circle cx="0" cy="300" r="20" fill="#ffffff" opacity={0.06 + 0.04 * Math.sin(frame * 0.2)} />
    </g>
  );
};

/* ---------- сцены ---------- */
type SceneProps = { frame: number; t: number; local: number };

const City: React.FC<SceneProps> = ({ frame, t }) => {
  const off = (rx: number, ry: number) => 2.2 + (ry / 700) * 1.4 + rand(rx * 7 + ry) * 0.5;
  const clock = t < 2.2 ? "04:43" : "04:44";
  return (
    <g>
      <defs>
        <linearGradient id="csky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1024" />
          <stop offset="1" stopColor="#2a2a48" />
        </linearGradient>
      </defs>
      <rect width={ART_W} height={ART_H} fill="url(#csky)" />
      {Array.from({ length: 50 }).map((_, i) => (
        <circle key={i} cx={rand(i + 3) * ART_W} cy={rand(i + 90) * 500} r={1 + rand(i) * 2} fill="#fff" opacity={t > 3.4 ? 0.8 : 0.35} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((b) => {
        const bx = b * 190 - 30;
        const bh = 520 + rand(b + 4) * 340;
        const by = ART_H - bh - 60;
        return (
          <g key={b}>
            <rect x={bx} y={by} width="180" height={bh + 60} fill="#080a14" />
            {Array.from({ length: Math.floor(bh / 52) }).map((_, r) =>
              [0, 1, 2].map((c) => {
                const wx = bx + 20 + c * 52;
                const wy = by + 24 + r * 52;
                const litAtStart = rand(b * 100 + r * 10 + c) > 0.3;
                const lit = litAtStart && t < off(b * 10 + c, wy);
                return <rect key={`${r}-${c}`} x={wx} y={wy} width="30" height="34" fill={lit ? "#ffd27a" : "#0c0f1b"} opacity={lit ? 0.9 : 1} />;
              }),
            )}
          </g>
        );
      })}
      <rect y={ART_H - 60} width={ART_W} height="60" fill="#05060b" />
      <text x="540" y="210" textAnchor="middle" fill={t < 2.2 ? "#fff" : "#ff3b2f"} fontFamily="monospace" fontSize="150" fontWeight="900" opacity={t < 4.6 ? 1 : interpolate(t, [4.6, 6], [1, 0.2], clamp)}>
        {clock}
      </text>
      <circle cx="900" cy="300" r="46" fill="#e8ecf5" opacity={t > 2.5 ? 0.9 : 0.4} />
      <circle cx="918" cy="290" r="40" fill="#0b1024" opacity={t > 2.5 ? 0.9 : 0.4} />
    </g>
  );
};

const Title: React.FC<SceneProps> = ({ frame, local }) => {
  const o = interpolate(local, [0, 0.5], [0, 1], clamp);
  const f = flick(frame);
  return (
    <g>
      <rect width={ART_W} height={ART_H} fill="#05060b" />
      <circle cx="540" cy="620" r={520 * f} fill="url(#cglow)" opacity={0.7} />
      <g opacity={o}>
        <text x="540" y="560" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="190" fontWeight="900">
          ТРИ ДНЯ
        </text>
        <text x="540" y="760" textAnchor="middle" fill="#ffb25a" fontFamily={FONT} fontSize="170" fontWeight="900">
          БЕЗ СВЕТА
        </text>
        <rect x="320" y="840" width="440" height="140" rx="16" fill="#f4efe0" />
        <text x="540" y="920" textAnchor="middle" fill="#8a8473" fontFamily={FONT} fontSize="28" fontWeight="800" letterSpacing="4">
          ДО КОНЦА ГОРОДА
        </text>
        <text x="540" y="965" textAnchor="middle" fill="#1b1b22" fontFamily={FONT} fontSize="60" fontWeight="900">
          3 ДНЯ
        </text>
      </g>
    </g>
  );
};

const Calendar: React.FC<SceneProps & { crossed: number; dayNow: number }> = ({ frame, crossed, dayNow }) => (
  <g>
    <Room />
    <rect x="140" y="140" width="800" height="980" fill="#ece6d2" />
    <rect x="140" y="140" width="800" height="120" fill="#a8362e" />
    <text x="540" y="225" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="64" fontWeight="900">
      НОЯБРЬ
    </text>
    {Array.from({ length: 30 }).map((_, i) => {
      const c = i % 7;
      const r = Math.floor(i / 7);
      const x = 190 + c * 108;
      const y = 330 + r * 150;
      const day = i + 1;
      const isNow = day === 12 + dayNow - 1;
      return (
        <g key={i}>
          <text x={x + 40} y={y + 60} textAnchor="middle" fill="#2a2a30" fontFamily={FONT} fontSize="48" fontWeight="800">
            {day}
          </text>
          {isNow && <circle cx={x + 40} cy={y + 44} r="48" fill="none" stroke="#ff3b2f" strokeWidth="6" />}
          {day >= 12 && day < 12 + crossed && (
            <g stroke="#ff3b2f" strokeWidth="9" strokeLinecap="round">
              <line x1={x + 6} y1={y + 6} x2={x + 74} y2={y + 80} />
              <line x1={x + 74} y1={y + 6} x2={x + 6} y2={y + 80} />
            </g>
          )}
        </g>
      );
    })}
    <Candle x={980} y={900} s={0.9} frame={frame} />
  </g>
);

const Monitor: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x="40" y="260" width="300" height="190" rx="10" fill="#04050a" stroke="#1d2230" strokeWidth="8" />
    <g opacity={0.14 + 0.05 * Math.sin(frame * 0.05)} transform="translate(190 380) scale(0.5)">
      <polygon points="-60,-30 0,-70 60,-30 64,60 0,90 -64,60" fill="#fff" />
    </g>
    <rect x="170" y="450" width="40" height="40" fill="#1d2230" />
  </g>
);

const Kitchen: React.FC<SceneProps> = ({ frame, local }) => (
  <g>
    <Room />
    <Monitor frame={frame} />
    <Candle x={540} y={780} frame={frame} />
    <Bust x={170} y={700} s={1.4} who="mikhail" frame={frame} look={0.6} />
    <Bust x={540} y={760} s={1.2} who="sonya" frame={frame} look={0} />
    <Bust x={910} y={700} s={1.4} who="anna" frame={frame} look={-0.6} talking={local > 0} />
    <polygon points="0,900 1080,900 1080,960 0,960" fill="#2a1c12" />
    <rect x="0" y="960" width="1080" height="290" fill="#150f0a" />
  </g>
);

const Tap: React.FC<SceneProps> = ({ frame, local }) => {
  const w = interpolate(local, [0, 2], [12, 2], clamp);
  return (
    <g>
      <Room top="#0a0d14" bottom="#10141d" />
      <polygon points="300,420 700,420 700,500 520,500 520,560 440,560 440,500 300,500" fill="#a9b0bd" />
      <rect x="470" y="560" width={w} height="400" fill="#7fb8e8" opacity="0.9" />
      {[0, 1, 2].map((i) => {
        const p = ((frame * 0.05 + i / 3) % 1);
        return <circle key={i} cx="475" cy={560 + p * 520} r="9" fill="#7fb8e8" opacity={local > 1.2 ? 1 - p : 0} />;
      })}
      <rect x="260" y="1000" width="560" height="160" rx="30" fill="#dfe3ea" />
      <Candle x={900} y={900} s={0.8} frame={frame} />
    </g>
  );
};

const Tub: React.FC<SceneProps> = ({ frame, local }) => {
  const h = 260 * Math.min(1, Math.max(0, (local - 0.4) / 5.4));
  return (
    <g>
      <Room top="#0a0d14" bottom="#0f1320" />
      <polygon points="120,760 960,760 920,1060 160,1060" fill="#dfe3ea" />
      <clipPath id="tubclip">
        <polygon points="150,770 930,770 900,1050 180,1050" />
      </clipPath>
      <g clipPath="url(#tubclip)">
        <rect x="100" y={1050 - h} width="900" height={h + 20} fill="#4a86b8" opacity="0.85" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={190 + i * 90} x2={240 + i * 90} y1={1050 - h + 14 + (i % 3) * 8} y2={1050 - h + 14 + (i % 3) * 8} stroke="#cfe8ff" strokeWidth="4" opacity="0.6" />
        ))}
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${200 + i * 160} 1160)`}>
          <ellipse cx="0" cy="0" rx="66" ry="18" fill="#2a2d38" />
          <rect x="-66" y="-80" width="132" height="80" fill="#3a3f4e" />
          <ellipse cx="0" cy="-80" rx="66" ry="18" fill="#4a5064" />
        </g>
      ))}
      <Bust x={870} y={640} s={1.5} who="mikhail" frame={frame} look={-1} scared talking />
      <Candle x={540} y={720} s={0.7} frame={frame} glow={0.8} />
      <text x="540" y="1220" textAnchor="middle" fill="#9ec9f0" fontFamily={FONT} fontSize="40" fontWeight="800" opacity="0.8">
        УРОВЕНЬ ВОДЫ {Math.round((h / 260) * 100)}%
      </text>
    </g>
  );
};

const Battery: React.FC<SceneProps> = ({ frame, local }) => {
  const pct = local > 2.2 ? 6 : 7;
  return (
    <g>
      <Room top="#060810" bottom="#0a0d16" />
      <rect x="180" y="380" width="640" height="340" rx="40" fill="none" stroke="#fff" strokeWidth="14" />
      <rect x="826" y="470" width="50" height="160" rx="14" fill="#fff" />
      <rect x="200" y="400" width={Math.max(18, 600 * (pct / 100))} height="300" rx="26" fill="#ff3b2f" opacity={0.7 + 0.3 * Math.sin(frame * 0.3)} />
      <text x="540" y="920" textAnchor="middle" fill="#ff6b5e" fontFamily={FONT} fontSize="260" fontWeight="900">
        {pct}%
      </text>
      <text x="540" y="1030" textAnchor="middle" fill="#fff" opacity="0.7" fontFamily={FONT} fontSize="40" fontWeight="800" letterSpacing="6">
        ПОСЛЕДНИЙ ТЕЛЕФОН
      </text>
      <Bust x={160} y={1050} s={1.0} who="anna" frame={frame} look={1} scared tint="#5ec8ff" />
    </g>
  );
};

const DoorScene: React.FC<SceneProps & { knock?: boolean }> = ({ frame, local, knock }) => {
  const k = knock ? (local % 1.6 < 0.25 ? 6 : 0.6) : 0.3;
  const fade = local > 3.9 ? interpolate(local, [3.9, 4.6], [0, 1], clamp) : 0;
  return (
    <g>
      <Room top="#06070c" bottom="#0c0e17" />
      <Door shake={k} frame={frame} />
      <rect x="260" y="1030" width="560" height="14" fill="#c9c2a4" opacity="0.18" />
      <ellipse cx="420" cy="1052" rx="26" ry="8" fill="#000" />
      <ellipse cx="640" cy="1052" rx="26" ry="8" fill="#000" />
      <Bust x={200} y={1040} s={1.1} who="sonya" frame={frame} look={1} scared />
      <rect width={ART_W} height={ART_H} fill="#000" opacity={fade} />
    </g>
  );
};

const Radio: React.FC<SceneProps> = ({ frame, local }) => (
  <g>
    <Room />
    <rect x="180" y="460" width="720" height="380" rx="36" fill="#2c3340" />
    <rect x="230" y="510" width="620" height="140" rx="12" fill="#10151f" />
    {Array.from({ length: 26 }).map((_, i) => (
      <rect key={i} x={250 + i * 23} y={640 - (10 + rand(i + Math.floor(frame / 3)) * 110)} width="14" height={10 + rand(i + Math.floor(frame / 3)) * 110} fill="#7dffb0" opacity="0.7" />
    ))}
    <circle cx="330" cy="740" r="52" fill="#1b2029" stroke="#8a94a6" strokeWidth="6" />
    <circle cx="750" cy="740" r="52" fill="#1b2029" stroke="#8a94a6" strokeWidth="6" />
    <line x1="780" y1="460" x2="940" y2="200" stroke="#8a94a6" strokeWidth="8" />
    <Candle x={160} y={820} s={0.9} frame={frame} />
    <text x="540" y="940" textAnchor="middle" fill="#ff6b5e" fontFamily={FONT} fontSize="54" fontWeight="900" opacity={frame % 40 < 28 ? 1 : 0.3}>
      НЕТ СИГНАЛА
    </text>
    <g transform="translate(540 1120)">
      <rect x="-300" y="-60" width="600" height="110" rx="12" fill="#ece6d2" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${-210 + i * 160} -4)`} stroke={i < 2 ? "#ff3b2f" : "none"} strokeWidth="8">
          <text y="30" textAnchor="middle" fill="#222" stroke="none" fontFamily={FONT} fontSize="56" fontWeight="900">
            {10 + i}
          </text>
          {i < 2 && <line x1="-26" y1="-24" x2="26" y2="36" />}
        </g>
      ))}
    </g>
    {local < 0.1 && null}
  </g>
);

const Stair: React.FC<SceneProps> = ({ frame, local }) => {
  const floor = Math.max(10, 17 - Math.floor(local * 0.95));
  return (
    <g>
      <Room top="#120708" bottom="#1a0b0c" floor="#0b0405" />
      {Array.from({ length: 9 }).map((_, i) => {
        const p = (i + ((frame * 0.03) % 1)) / 9;
        const s = 0.15 + p * 1.1;
        const w = 1000 * s;
        const h = 1100 * s;
        return (
          <rect key={i} x={540 - w / 2} y={620 - h / 2} width={w} height={h} fill="none" stroke="#3a1a1c" strokeWidth={4 + p * 18} opacity={0.2 + p * 0.6} />
        );
      })}
      <circle cx="540" cy="520" r="420" fill="url(#redg)" opacity={0.5 + 0.5 * Math.max(0, Math.sin(frame * 0.18))} />
      <g transform="translate(540 190)">
        <rect x="-110" y="-60" width="220" height="120" rx="12" fill="#1a1a1a" stroke="#4a2a2a" strokeWidth="6" />
        <text y="38" textAnchor="middle" fill="#ff6b5e" fontFamily="monospace" fontSize="100" fontWeight="900">
          {floor}
        </text>
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${340 + i * 170 + Math.sin(frame * 0.12 + i) * 6} ${900 + i * 18}) scale(${1 - i * 0.12})`}>
          <ellipse cx="0" cy="260" rx="70" ry="14" fill="#000" opacity="0.5" />
          <polygon points="-50,260 -40,60 40,60 50,260" fill="#101018" />
          <circle cx="0" cy="20" r="44" fill="#16161f" />
        </g>
      ))}
    </g>
  );
};

const IgorScene: React.FC<SceneProps> = ({ frame, local }) => {
  const beamO = interpolate(local, [4, 5], [0.1, 0.8], clamp);
  return (
    <g>
      <Room top="#120708" bottom="#1a0b0c" floor="#0b0405" />
      <circle cx="300" cy="500" r="520" fill="url(#redg)" opacity={0.4 + 0.4 * Math.max(0, Math.sin(frame * 0.18))} />
      <polygon points="540,880 780,640 1080,520 1080,1000" fill="#fff6c8" opacity={beamO * 0.35} />
      <Bust x={260} y={720} s={2.1} who="elder" frame={frame} look={1} talking tint="#ffcc88" />
      <Bust x={820} y={880} s={1.3} who="mikhail" frame={frame} look={-1} scared />
      <Bust x={1000} y={1060} s={0.9} who="sonya" frame={frame} look={-1} scared />
      <g transform="translate(540 900) rotate(-20)">
        <rect x="-18" y="-60" width="36" height="120" rx="8" fill="#2a2d38" />
        <rect x="-26" y="-80" width="52" height="30" rx="6" fill="#fff6c8" opacity={0.5 + beamO * 0.5} />
      </g>
    </g>
  );
};

const Dead: React.FC<SceneProps> = ({ frame, local }) => {
  const alive = local < 1.1;
  return (
    <g>
      <rect width={ART_W} height={ART_H} fill="#000" />
      {alive && <Phone x={540} y={640} s={1.1} pct={1} frame={frame} />}
      {alive && <rect width={ART_W} height={ART_H} fill="#000" opacity={local > 0.8 ? interpolate(local, [0.8, 1.1], [0, 1], clamp) : 0} />}
    </g>
  );
};

const Yard: React.FC<SceneProps> = ({ frame, local }) => (
  <g>
    <defs>
      <linearGradient id="ysky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#050818" />
        <stop offset="1" stopColor="#1a1c38" />
      </linearGradient>
    </defs>
    <rect width={ART_W} height={ART_H} fill="url(#ysky)" />
    {Array.from({ length: 80 }).map((_, i) => (
      <circle key={i} cx={rand(i + 5) * ART_W} cy={rand(i + 77) * 640} r={1 + rand(i) * 2.4} fill="#fff" opacity={0.5 + 0.4 * Math.sin(frame * 0.05 + i)} />
    ))}
    {[0, 1, 2].map((b) => (
      <rect key={b} x={b * 380 - 40} y={560 - rand(b + 3) * 160} width="340" height="700" fill="#07080f" />
    ))}
    <rect x="760" y="640" width="46" height="60" fill="#ffc46a" opacity={flick(frame, 2)} />
    <circle cx="783" cy="670" r="120" fill="url(#cglow)" opacity={0.7 * flick(frame, 2)} />
    {Array.from({ length: 6 }).map((_, i) => (
      <circle key={i} cx={560 + i * 60 + Math.sin(frame * 0.05 + i) * 4} cy={1030 - (i % 2) * 14} r="10" fill="#ffd27a" opacity={interpolate(local, [1 + i * 0.4, 1.6 + i * 0.4], [0, 0.9], clamp)} />
    ))}
    <rect y="1000" width={ART_W} height="250" fill="#07080d" />
    <g transform="translate(220 1110)">
      <polygon points="-50,140 -40,-30 40,-30 50,140" fill="#0c0d16" />
      <circle cx="0" cy="-74" r="46" fill="#111320" />
      <polygon points="120,160 126,0 190,0 196,160" fill="#0a0b13" />
      <circle cx="158" cy="-36" r="34" fill="#10121d" />
    </g>
  </g>
);

const End: React.FC<SceneProps> = ({ frame, local }) => {
  const blink = frame % 50 < 34;
  return (
    <g>
      <rect width={ART_W} height={ART_H} fill="#04050a" />
      {Array.from({ length: 70 }).map((_, i) => {
        const dies = i % 7 === 0 ? 2 + (i % 5) * 0.6 : 99;
        return <circle key={i} cx={rand(i + 11) * ART_W} cy={rand(i + 33) * 700} r={1 + rand(i) * 2} fill="#fff" opacity={local < dies ? 0.75 : 0} />;
      })}
      <text x="540" y="700" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="150" fontWeight="900">
        ТРИ ДНЯ
      </text>
      <text x="540" y="860" textAnchor="middle" fill="#ffb25a" fontFamily={FONT} fontSize="130" fontWeight="900">
        БЕЗ СВЕТА
      </text>
      <text x="540" y="1010" textAnchor="middle" fill="#fff" opacity={interpolate(local, [2, 3], [0, 0.8], clamp)} fontFamily={FONT} fontSize="46" fontWeight="800" letterSpacing="8">
        ЭТО ТОЛЬКО НАЧАЛО
      </text>
      <text x="540" y="1150" textAnchor="middle" fill="#ff3b2f" fontFamily="monospace" fontSize="80" fontWeight="900" opacity={local > 3.2 && blink ? 1 : 0}>
        04:44
      </text>
    </g>
  );
};

const World4: React.FC<{ frame: number; t: number; scene: SceneId; local: number }> = ({ frame, t, scene, local }) => {
  const p = { frame, t, local };
  const body = (() => {
    switch (scene) {
      case "city":
        return <City {...p} />;
      case "title":
        return <Title {...p} />;
      case "d1cal":
        return <Calendar {...p} crossed={0} dayNow={1} />;
      case "d1kitchen":
        return <Kitchen {...p} />;
      case "d1phone":
        return (
          <g>
            <Room top="#06070c" bottom="#0b0d16" />
            <Phone x={540} y={640} s={1.15} pct={7} frame={frame} noSignal />
          </g>
        );
      case "d1tap":
        return <Tap {...p} />;
      case "d1tub":
        return <Tub {...p} />;
      case "d1battery":
        return <Battery {...p} />;
      case "d1door":
        return <DoorScene {...p} knock />;
      case "d2radio":
        return (
          <g>
            <Calendar {...p} crossed={0} dayNow={2} />
            <g opacity={interpolate(local, [0.6, 1.2], [0, 1], clamp)}>
              <rect width={ART_W} height={ART_H} fill="#06070c" />
              <Radio {...p} />
            </g>
          </g>
        );
      case "d2door":
        return (
          <g>
            <Room top="#120708" bottom="#1a0b0c" floor="#0b0405" />
            <rect x="260" y="180" width="560" height="860" fill="#2a1a14" />
            <rect x="500" y="180" width="80" height="860" fill="#070303" />
            <circle cx="540" cy="520" r="620" fill="url(#redg)" opacity={0.4 + 0.5 * Math.max(0, Math.sin(frame * 0.18))} />
            <Bust x={540} y={760} s={1.5} who="elder" frame={frame} look={0} talking tint="#ffcc88" />
            <Candle x={150} y={980} s={0.7} frame={frame} />
          </g>
        );
      case "d2give":
        return (
          <g>
            <Room />
            <Candle x={540} y={900} s={0.9} frame={frame} />
            <Bust x={170} y={720} s={1.6} who="mikhail" frame={frame} look={1} />
            <Bust x={910} y={740} s={1.5} who="elder" frame={frame} look={-1} />
            {[0, 1].map((i) => (
              <g key={i} transform={`translate(${380 + local * 90 + i * 60} ${860 - i * 30})`}>
                <rect x="-24" y="-110" width="48" height="140" rx="12" fill="#7fb8e8" opacity="0.9" />
                <rect x="-12" y="-136" width="24" height="30" fill="#c9d2de" />
              </g>
            ))}
          </g>
        );
      case "d2threat": {
        const lit = local < 0.4;
        return (
          <g>
            <Room top="#05060a" bottom="#08090e" />
            <Door shake={local > 1 ? 1.6 : 0.3} frame={frame} />
            <rect x="260" y="1030" width="560" height="12" fill="#ff3b2f" opacity={0.18 + 0.15 * Math.sin(frame * 0.2)} />
            {lit && <Candle x={900} y={940} s={0.8} frame={frame} />}
            <g opacity="0.55">
              <Bust x={200} y={1080} s={0.8} who="mikhail" frame={frame} look={1} scared />
              <Bust x={520} y={1100} s={0.7} who="sonya" frame={frame} look={1} scared />
              <Bust x={840} y={1080} s={0.8} who="anna" frame={frame} look={1} scared />
            </g>
          </g>
        );
      }
      case "d2rule": {
        const gone = (i: number) => (i < 2 ? interpolate(local, [1.5 + i * 0.6, 2.2 + i * 0.6], [1, 0], clamp) : 1);
        return (
          <g>
            <Room />
            <Candle x={540} y={650} frame={frame} />
            <polygon points="60,900 1020,900 1060,960 20,960" fill="#6b4a30" />
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i} transform={`translate(${190 + i * 140} ${900})`} opacity={gone(i)}>
                <rect x="-26" y="-130" width="52" height="130" rx="12" fill="#7fb8e8" opacity="0.9" />
                <rect x="-13" y="-158" width="26" height="30" fill="#c9d2de" />
              </g>
            ))}
            <text x="540" y="1100" textAnchor="middle" fill="#fff" opacity="0.8" fontFamily={FONT} fontSize="46" fontWeight="800">
              ВОДЫ: {local > 3 ? 4 : local > 2.2 ? 5 : 6} БУТЫЛОК
            </text>
          </g>
        );
      }
      case "d2cliff":
        return (
          <g>
            <Room top="#120708" bottom="#1a0b0c" floor="#0b0405" />
            <circle cx="540" cy="520" r="620" fill="url(#redg)" opacity={0.35 + 0.35 * Math.max(0, Math.sin(frame * 0.18))} />
            <Bust x={540} y={760} s={2.2} who="elder" frame={frame} look={0} talking tint="#ffcc88" />
            <text x="540" y="1180" textAnchor="middle" fill="#ff6b5e" fontFamily={FONT} fontSize="40" fontWeight="900" letterSpacing="6">
              ПОДВАЛ · КОЛОДЕЦ
            </text>
          </g>
        );
      case "d3stairs":
        return <Stair {...p} />;
      case "d3igor":
        return <IgorScene {...p} />;
      case "d3dead":
        return <Dead {...p} />;
      case "d3light":
        return <Yard {...p} />;
      default:
        return <End {...p} />;
    }
  })();
  return (
    <svg viewBox={`0 0 ${ART_W} ${ART_H}`} width={ART_W} height={ART_H}>
      <Defs />
      {body}
      <rect width={ART_W} height={ART_H} fill="url(#vig4)" />
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={rand(i + frame * 0.3) * ART_W} cy={rand(i + 40 + frame * 0.2) * ART_H} r="1.3" fill="#fff" opacity="0.12" />
      ))}
    </svg>
  );
};

/* ---------- Интерфейс ---------- */
const Hud: React.FC<{ day: number; t: number }> = ({ day, t }) => {
  if (day === 0) return null;
  const counter = day === 1 ? ["ОСТАЛОСЬ", "3 ДНЯ"] : day === 2 ? ["ОСТАЛОСЬ", "2 ДНЯ"] : ["ОСТАЛОСЬ", "4 ЧАСА"];
  const urgent = day === 3;
  const pop = interpolate(t % 100, [0, 1], [1, 1]);
  void pop;
  return (
    <div style={{ position: "absolute", top: 140, left: 56, right: 56, display: "flex", justifyContent: "space-between", fontFamily: FONT }}>
      <div
        style={{
          background: "#f1e7c8",
          color: "#2a2418",
          padding: "12px 28px",
          transform: "rotate(-3deg)",
          boxShadow: "0 6px 20px rgba(0,0,0,.6)",
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 900 }}>День {day}</div>
        <div style={{ fontSize: 20, fontWeight: 800, opacity: 0.6 }}>04:44 + {day === 1 ? "0" : day === 2 ? "24" : "48"} ч</div>
      </div>
      <div style={{ background: "#f4efe0", padding: "10px 26px", textAlign: "center", boxShadow: "0 6px 20px rgba(0,0,0,.6)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#8a8473", letterSpacing: 3 }}>{counter[0]}</div>
        <div style={{ fontSize: 52, fontWeight: 900, color: urgent ? "#d1261b" : "#1b1b22" }}>{counter[1]}</div>
      </div>
    </div>
  );
};

const RuleNote: React.FC<{ t: number }> = ({ t }) => {
  const r = RULES.find((x) => t >= x.start && t < x.end);
  if (!r) return null;
  const o = interpolate(t, [r.start, r.start + 0.2, r.end - 0.3, r.end], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 90,
        right: 90,
        background: "#f1e7c8",
        color: "#2a2418",
        padding: "16px 28px",
        fontFamily: FONT,
        fontSize: 46,
        fontWeight: 900,
        textAlign: "center",
        transform: "rotate(-1.5deg)",
        boxShadow: "0 8px 24px rgba(0,0,0,.7)",
        opacity: o,
      }}
    >
      <span style={{ color: "#d1261b" }}>{r.num}.</span> {r.text}
    </div>
  );
};

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.03 && t < l.start + l.dur + 0.35);
  if (!line) return null;
  const words = line.text.split(" ");
  const prog = Math.min(1, Math.max(0, (t - line.start) / line.dur));
  const idx = Math.floor(prog * words.length * 1.04);
  const col = WHO_COLOR[line.who];
  const o = interpolate(t, [line.start, line.start + 0.1], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, bottom: 300, textAlign: "center", fontFamily: FONT, opacity: o }}>
      {line.who !== "narr" && (
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 6, color: col, marginBottom: 8 }}>{WHO_NAME[line.who]}</div>
      )}
      <div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.12, textShadow: "0 4px 18px rgba(0,0,0,.95)", textTransform: line.who === "narr" ? "uppercase" : "none" }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: i === idx ? col : i < idx ? "#fff" : "rgba(255,255,255,.45)" }}>
            {w}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------- Звук ---------- */
const Audios: React.FC = () => {
  const S = (s: number) => Math.round(s * FPS);
  const D = (f: string) => staticFile(`dark/${f}`);
  const A2 = (f: string) => staticFile(`audio2/${f}`);
  const A1 = (f: string) => staticFile(`audio/${f}`);
  const L = (f: string) => staticFile(`lira/${f}`);
  const sfx = (from: number, dur: number, src: string, vol: number, loop = false) => (
    <Sequence from={S(from)} durationInFrames={S(dur)}>
      <Audio src={src} volume={vol} loop={loop} />
    </Sequence>
  );
  return (
    <>
      {sfx(0, 100, A1("sfx-wind.mp3"), 0.14, true)}
      {sfx(0, 2.4, L("x-tick.mp3"), 0.5, true)}
      {sfx(0.2, 8, L("x-tick.mp3"), 0.25, true)}
      {sfx(2.1, 3, D("x-blackout.mp3"), 1)}
      {sfx(7.9, 3, A2("sfx-riser.mp3"), 0.7)}
      {sfx(8.0, 2, A1("sfx-hit.mp3"), 0.9)}
      {sfx(12.5, 2, A1("sfx-hit.mp3"), 0.8)}
      {sfx(22.5, 1, D("x-tap.mp3"), 0.9)}
      {sfx(23.1, 1, D("x-tap.mp3"), 0.7)}
      {sfx(31.4, 6, A2("sfx-heart.mp3"), 0.4, true)}
      {sfx(33.8, 2, D("x-battery.mp3"), 0.7)}
      {sfx(35.2, 4, D("x-knock.mp3"), 1)}
      {sfx(35.2, 4.8, A2("sfx-heart.mp3"), 0.6, true)}
      {sfx(40, 3.9, D("x-radio.mp3"), 0.35, true)}
      {sfx(40, 2, A1("sfx-hit.mp3"), 0.8)}
      {sfx(51.5, 2, D("x-candle.mp3"), 0.9)}
      {sfx(51.7, 6, A2("sfx-heart.mp3"), 0.55, true)}
      {sfx(51.9, 4, D("x-knock.mp3"), 0.8)}
      {sfx(62.9, 3, A2("sfx-riser.mp3"), 0.6)}
      {sfx(68, 2, A1("sfx-hit.mp3"), 0.9)}
      {sfx(68, 16.4, D("x-steps.mp3"), 0.5, true)}
      {sfx(68, 16.4, A2("sfx-heart.mp3"), 0.5, true)}
      {sfx(85.1, 2, D("x-battery.mp3"), 0.8)}
      {sfx(84.4, 2, D("x-blackout.mp3"), 0.8)}
      {sfx(86.4, 7, A1("sfx-wind.mp3"), 0.2, true)}
      {sfx(92.9, 3, A1("sfx-hit.mp3"), 1)}
      {sfx(92.9, 4, A2("sfx-riser.mp3"), 0.8)}
      {LINES.map((l) => (
        <Sequence key={l.file} from={S(l.start)} durationInFrames={Math.ceil((l.dur + 0.4) * FPS)}>
          <Audio src={D(l.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

export const Dark: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = sceneAt(t);
  const local = t - sc.start;
  const line = speakingAt(t);
  void line;
  const knockKick = (sc.id === "d1door" && local % 1.6 < 0.3) || (sc.id === "d2threat" && local < 0.4) ? 1 : 0;
  const amp = 1.5 + sc.tension * 4 + knockKick * 20;
  const dx = Math.sin(frame * 1.7) * amp * 0.6;
  const dy = Math.cos(frame * 1.3) * amp * 0.6;
  const zoom = 1 + 0.05 * (local / (sc.end - sc.start)) + knockKick * 0.04;
  const flashA = Math.max(
    interpolate(t, [2.15, 2.2, 2.6], [0, 0.7, 0], clamp),
    sc.id === "d1door" ? interpolate(local % 1.6, [0, 0.12], [0.35, 0], clamp) : 0,
    interpolate(t, [84.4, 84.5, 84.9], [0, 0.4, 0], clamp),
  );
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * (1 + sc.tension * 0.9))), 6);
  const warm = (0.04 + sc.tension * 0.14) * (0.4 + beat);
  const emergency = ["d2door", "d2cliff", "d3stairs", "d3igor"].includes(sc.id);
  const fadeIn = interpolate(t, [0, 0.5], [0, 1], clamp);
  const fadeOut = interpolate(t, [99.2, 100], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", top: 300, left: 0, width: ART_W, height: ART_H, overflow: "hidden", opacity: Math.min(fadeIn, fadeOut) }}>
        <div style={{ transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: "50% 55%" }}>
          <World4 frame={frame} t={t} scene={sc.id} local={local} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, rgba(0,0,0,0) 45%, rgba(${emergency ? "255,30,20" : "255,150,60"},${warm}) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flashA }} />
      </div>
      <Hud day={sc.day} t={t} />
      <RuleNote t={t} />
      <Subtitle t={t} />
      <Audios />
    </AbsoluteFill>
  );
};

export type { BustWho };
