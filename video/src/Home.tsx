import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ART_H, ART_W, Face, rand } from "./Art";
import {
  FPS,
  LINES,
  SCENES,
  WHO_COLOR,
  WHO_NAME,
  sceneAt,
  speakingAt,
  type SceneId,
  type Who,
} from "./timeline3";

const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const BLUE = "#5ec8ff";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- Персонажи (поясной портрет) ---------- */
export type BustWho = Exclude<Who, "lira"> | "elder";

type BustProps = {
  x: number;
  y: number;
  s?: number;
  who: BustWho;
  frame: number;
  look?: number;
  scared?: boolean;
  closed?: boolean;
  talking?: boolean;
  tint?: string;
};

const SHIRT: Record<string, [string, string]> = {
  sonya: ["#7a5fb0", "#5f4a8f"],
  mikhail: ["#4a5568", "#38414f"],
  anna: ["#b24a63", "#8d3a4f"],
  elder: ["#6b5b4a", "#54463a"],
};

export const Bust: React.FC<BustProps> = ({ x, y, s = 1, who, frame, look = 0, scared, closed, talking, tint }) => {
  const [c1, c2] = SHIRT[who];
  const bob = talking ? Math.sin(frame * 0.9) * 3 : Math.sin(frame * 0.07) * 2;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <polygon points="-120,160 -100,60 -40,30 40,30 100,60 120,160" fill={c1} />
      <polygon points="0,30 40,30 100,60 120,160 0,160" fill={c2} />
      <polygon points="-18,24 18,24 12,60 -12,60" fill="#c99a7e" />
      <g transform="translate(0 -40)">
        {who === "sonya" && (
          <>
            <polygon points="-70,-30 -74,70 -52,60 -58,-20" fill="#3b2418" />
            <polygon points="70,-30 74,70 52,60 58,-20" fill="#2e1c12" />
          </>
        )}
        <Face look={look} frame={frame} scared={scared} closed={closed} />
        {who === "sonya" && (
          <>
            <polygon points="-68,-24 -50,-72 0,-88 50,-72 68,-24 0,-48" fill="#4a2e1f" />
            <polygon points="0,-88 50,-72 68,-24 0,-48" fill="#3b2418" />
            <polygon points="64,-60 108,-40 96,-8 70,-30" fill="#3b2418" />
          </>
        )}
        {who === "elder" && (
          <>
            <polygon points="-64,-26 -46,-66 0,-76 46,-66 64,-26 0,-40" fill="#9a9aa2" />
            <polygon points="0,-76 46,-66 64,-26 0,-40" fill="#7d7d86" />
            <polygon points="-40,40 40,40 30,70 -30,70" fill="#d8d8dc" opacity="0.8" />
          </>
        )}
        {who === "mikhail" && (
          <>
            <polygon points="-64,-26 -46,-70 0,-82 46,-70 64,-26 0,-44" fill="#2a2420" />
            <polygon points="0,-82 46,-70 64,-26 0,-44" fill="#1c1815" />
            <polygon points="-40,40 40,40 30,66 -30,66" fill="#4b4540" opacity="0.7" />
          </>
        )}
        {who === "anna" && (
          <>
            <polygon points="-66,-24 -48,-72 0,-86 48,-72 66,-24 0,-46" fill="#7a4a2a" />
            <polygon points="0,-86 48,-72 66,-24 0,-46" fill="#5e3820" />
            <circle cx="0" cy="-96" r="26" fill="#6a4023" />
            <polygon points="-66,-24 -72,40 -54,30 -58,-18" fill="#5e3820" />
            <polygon points="66,-24 72,40 54,30 58,-18" fill="#4e2e1a" />
          </>
        )}
      </g>
      {tint && <rect x="-130" y="-140" width="260" height="310" fill={tint} opacity="0.12" />}
    </g>
  );
};

/* ---------- Панель Лиры ---------- */
const Panel: React.FC<{ x: number; y: number; s?: number; frame: number; speaking: boolean; red?: number }> = ({
  x,
  y,
  s = 1,
  frame,
  speaking,
  red = 0,
}) => {
  const pulse = 0.55 + 0.45 * Math.sin(frame * (speaking ? 0.5 : 0.12));
  const col = interpolateHex(red);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={190} fill={col} opacity={0.12 + 0.1 * pulse + (speaking ? 0.12 : 0)} />
      <circle r={120} fill={col} opacity={0.15 + 0.12 * pulse} />
      <rect x="-70" y="-100" width="140" height="200" rx="26" fill="#0e1118" stroke="#262c3a" strokeWidth="4" />
      <circle r="34" fill="none" stroke={col} strokeWidth="6" opacity={0.5 + 0.5 * pulse} />
      <circle r={12 + (speaking ? 10 * pulse : 3 * pulse)} fill={col} />
      {speaking &&
        [0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={-34 + i * 16}
            y={52 - (6 + 22 * Math.abs(Math.sin(frame * 0.55 + i * 1.3))) / 2}
            width="8"
            height={6 + 22 * Math.abs(Math.sin(frame * 0.55 + i * 1.3))}
            rx="3"
            fill={col}
          />
        ))}
    </g>
  );
};

const interpolateHex = (red: number) => {
  const r = Math.round(94 + (255 - 94) * red);
  const g = Math.round(200 + (59 - 200) * red);
  const b = Math.round(255 + (47 - 255) * red);
  return `rgb(${r},${g},${b})`;
};

/* ---------- Комнаты ---------- */
const Wall: React.FC<{ top: string; bottom: string; floor: string }> = ({ top, bottom, floor }) => (
  <g>
    <defs>
      <linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect width={ART_W} height={ART_H} fill="url(#wallg)" />
    <polygon points={`0,980 ${ART_W},960 ${ART_W},${ART_H} 0,${ART_H}`} fill={floor} />
    <polygon points={`0,980 ${ART_W},960 ${ART_W},972 0,992`} fill="#00000033" />
  </g>
);

const Door: React.FC<{ frame: number; jiggle: number; lockAng: number }> = ({ frame, jiggle, lockAng }) => (
  <g transform={`translate(${Math.sin(frame * 2.2) * jiggle} 0)`}>
    <polygon points="300,230 780,230 780,985 300,985" fill="#5a3b26" />
    <polygon points="300,230 540,230 540,985 300,985" fill="#6a4630" />
    <polygon points="340,290 740,290 740,640 340,640" fill="#4e3322" />
    <polygon points="340,690 740,690 740,940 340,940" fill="#4e3322" />
    <circle cx="540" cy="430" r="22" fill="#111" stroke="#c9a14a" strokeWidth="7" />
    <circle cx="540" cy="430" r="8" fill="#000" />
    <g transform={`translate(660 640) rotate(${lockAng})`}>
      <rect x="-16" y="-70" width="32" height="140" rx="12" fill="#b9bcc6" />
      <rect x="-8" y="-60" width="16" height="50" rx="6" fill="#e5e8ef" />
    </g>
    <rect x="620" y="560" width="40" height="40" rx="6" fill="#8a8e9c" />
    <polygon points="610,230 640,230 640,330 610,330" fill="#00000000" />
  </g>
);

const Window: React.FC<{ night: boolean }> = ({ night }) => (
  <g>
    <rect x="70" y="200" width="260" height="360" fill={night ? "#0f1a33" : "#f2c78a"} stroke="#2a2a35" strokeWidth="12" />
    <line x1="200" y1="200" x2="200" y2="560" stroke="#2a2a35" strokeWidth="8" />
    <line x1="70" y1="380" x2="330" y2="380" stroke="#2a2a35" strokeWidth="8" />
    {night && (
      <>
        <circle cx="250" cy="280" r="26" fill="#e8ecf5" />
        <circle cx="262" cy="272" r="22" fill="#0f1a33" />
      </>
    )}
  </g>
);

const Table: React.FC = () => (
  <g>
    <polygon points="60,880 1020,880 1060,940 20,940" fill="#8a5d3b" />
    <polygon points="60,880 540,880 540,940 20,940" fill="#9b6a44" />
    <rect x="120" y="940" width="26" height="310" fill="#5e3f28" />
    <rect x="930" y="940" width="26" height="310" fill="#4c3320" />
    {[220, 540, 860].map((px) => (
      <g key={px}>
        <ellipse cx={px} cy="872" rx="84" ry="16" fill="#e8e3d8" />
        <ellipse cx={px} cy="868" rx="52" ry="9" fill="#c9c2b2" />
      </g>
    ))}
  </g>
);

const Tablet: React.FC<{ frame: number; local: number; big?: boolean; glitch?: number }> = ({ frame, local, big, glitch = 0 }) => {
  const w = big ? 900 : 560;
  const h = big ? 1000 : 560;
  const x = (ART_W - w) / 2;
  const y = big ? 120 : 330;
  const prog = Math.min(1, 0.25 + local * 0.06);
  return (
    <g>
      <rect x={x - 20} y={y - 20} width={w + 40} height={h + 40} rx="30" fill="#0b0d12" stroke="#2a2f3d" strokeWidth="6" />
      <rect x={x} y={y} width={w} height={h - 60} fill="#2b2f3b" />
      {/* запись с камеры прихожей */}
      <polygon points={`${x},${y + h - 60} ${x + w},${y + h - 60} ${x + w},${y + (h - 60) * 0.72} ${x},${y + (h - 60) * 0.78}`} fill="#3a3428" />
      <rect x={x + w * 0.62} y={y + 40} width={w * 0.26} height={(h - 60) * 0.7} fill="#4e3322" />
      <g transform={`translate(${x + w * 0.3} ${y + (h - 60) * 0.55}) scale(${big ? 1.6 : 1})`}>
        <polygon points="-40,120 -30,10 30,10 40,120" fill="#7a5fb0" />
        <circle cx="0" cy="-20" r="34" fill="#e3b79a" />
        <polygon points="-34,-30 0,-60 34,-30 34,-14 -34,-14" fill="#4a2e1f" />
        <circle cx="-12" cy="-18" r="5" fill="#111" />
        <circle cx="12" cy="-18" r="5" fill="#111" />
        <rect x="-10" y="2" width="20" height="4" fill="#5a2f26" />
      </g>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={x} y={y + ((frame * 7 + i * 61) % (h - 60))} width={w} height="3" fill="#ffffff" opacity={0.05 + glitch * 0.3} />
      ))}
      <rect x={x + 20} y={y + 18} width="330" height="46" rx="8" fill="#000000aa" />
      <circle cx={x + 44} cy={y + 41} r="9" fill="#ff3b2f" opacity={frame % 30 < 18 ? 1 : 0.2} />
      <text x={x + 64} y={y + 50} fill="#fff" fontFamily={FONT} fontSize="24" fontWeight="800">
        REC · КАМЕРА 1 · ПРИХОЖАЯ
      </text>
      <rect x={x + 20} y={y + h - 150} width="420" height="46" rx="8" fill="#000000aa" />
      <text x={x + 36} y={y + h - 118} fill="#ffd34a" fontFamily={FONT} fontSize="24" fontWeight="900">
        ЗА 6 ДНЕЙ ДО УСТАНОВКИ
      </text>
      <rect x={x + 20} y={y + h - 86} width={w - 40} height="8" rx="4" fill="#555" />
      <rect x={x + 20} y={y + h - 86} width={(w - 40) * prog} height="8" rx="4" fill="#ff3b2f" />
    </g>
  );
};

/* ---------- Мир ---------- */
type WorldProps = { frame: number; t: number; scene: SceneId; local: number; speaker?: Who };

const World3: React.FC<WorldProps> = ({ frame, t, scene, local, speaker }) => {
  const liraSpeaking = speaker === "lira";
  const redLevel = scene === "final" ? interpolate(t, [57, 59], [0, 1], clamp) : 0;
  const sonyaTalk = speaker === "sonya";

  const room = (() => {
    switch (scene) {
      case "hook":
        return <Wall top="#0a0f20" bottom="#121a34" floor="#0b0d16" />;
      case "door":
        return <Wall top="#080b18" bottom="#10162c" floor="#07090f" />;
      case "day":
      case "install":
        return <Wall top="#c8a47e" bottom="#a07c58" floor="#6c5239" />;
      case "kitchen":
        return <Wall top="#d9b98a" bottom="#b58f62" floor="#7a5a3c" />;
      case "archive":
        return <Wall top="#171b2c" bottom="#0e1120" floor="#080a12" />;
      case "talk":
        return <Wall top="#1c1830" bottom="#120f22" floor="#0a0814" />;
      default:
        return <Wall top="#0a0b14" bottom="#06070d" floor="#050509" />;
    }
  })();

  return (
    <svg viewBox={`0 0 ${ART_W} ${ART_H}`} width={ART_W} height={ART_H}>
      <defs>
        <radialGradient id="vig3">
          <stop offset="0.4" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.88" />
        </radialGradient>
        <radialGradient id="lamp">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {room}

      {scene === "hook" && (
        <>
          <Window night />
          {/* тумбочка + часы */}
          <rect x="60" y="860" width="240" height="390" fill="#1a1d2c" />
          <rect x="90" y="800" width="170" height="64" rx="8" fill="#05060a" />
          <text x="175" y="848" fill="#ff3b2f" fontFamily="monospace" fontSize="46" fontWeight="900" textAnchor="middle">
            03:17
          </text>
          {/* кровать */}
          <polygon points="300,900 1080,880 1080,1250 300,1250" fill="#2d3556" />
          <polygon points="300,900 700,890 700,1250 300,1250" fill="#39426a" />
          <Bust
            x={620}
            y={720}
            s={2.2}
            who="sonya"
            frame={frame}
            closed={t < 3.4 || (t > 3.4 && t < 3.6)}
            look={t > 4.3 ? 0 : -0.5}
            scared={t > 4.3}
            talking={sonyaTalk}
          />
          <polygon points="300,980 1080,960 1080,1250 300,1250" fill="#454f7e" />
          <Panel x={900} y={420} s={1.2} frame={frame} speaking={liraSpeaking} />
        </>
      )}

      {scene === "door" && local < 4.9 && (
        <>
          <rect x="60" y="860" width="240" height="390" fill="#14172a" />
          <Bust x={430} y={700} s={2.4} who="sonya" frame={frame} scared look={Math.sin(frame * 0.1)} talking={sonyaTalk} />
          <Panel x={880} y={360} s={1.3} frame={frame} speaking={liraSpeaking} />
        </>
      )}
      {scene === "door" && local >= 4.9 && (
        <>
          <Door frame={frame} jiggle={local > 6.5 ? 2 + (local - 6.5) * 2 : 0.4} lockAng={Math.sin(frame * 0.8) * (local > 6.5 ? 12 : 2)} />
          <Panel x={920} y={500} s={1.1} frame={frame} speaking={liraSpeaking} />
          <polygon points="0,1000 1080,1000 1080,1250 0,1250" fill="#0000002a" />
          <ellipse cx="540" cy="990" rx="320" ry="40" fill="#1ea0ff" opacity={0.14 + (liraSpeaking ? 0.14 : 0)} />
        </>
      )}

      {scene === "day" && (
        <>
          <Window night={false} />
          <circle cx="200" cy="380" r="360" fill="url(#lamp)" opacity="0.6" />
          <text x="540" y="760" fill="#fff" fontFamily={FONT} fontSize="140" fontWeight="900" textAnchor="middle" opacity={interpolate(local, [0, 0.2, 2.6, 3], [0, 1, 1, 0], clamp)}>
            ДЕНЬ 1
          </text>
        </>
      )}

      {scene === "install" && (
        <>
          <Window night={false} />
          <rect x="740" y="250" width="240" height="340" fill="#7a5a3c" opacity="0.3" />
          <Panel x={860} y={430} s={1.2} frame={frame} speaking={false} />
          <Bust x={380} y={740} s={2.3} who="mikhail" frame={frame} look={1} talking={speaker === "mikhail"} />
          {local < 0.6 && <rect width={ART_W} height={ART_H} fill="#5ec8ff" opacity={0.3 * (1 - local / 0.6)} />}
        </>
      )}

      {scene === "kitchen" && (
        <>
          <circle cx="540" cy="260" r="520" fill="url(#lamp)" />
          <rect x="530" y="0" width="20" height="230" fill="#222" />
          <polygon points="460,230 620,230 660,290 420,290" fill="#e8c27a" />
          <Panel x={940} y={330} s={0.8} frame={frame} speaking={false} />
          <Bust x={200} y={640} s={1.5} who="mikhail" frame={frame} look={0.5} talking={speaker === "mikhail"} />
          <Bust x={540} y={620} s={1.55} who="anna" frame={frame} look={0} talking={speaker === "anna"} />
          <Bust x={860} y={650} s={1.45} who="sonya" frame={frame} look={-1} talking={sonyaTalk} />
          <Table />
        </>
      )}

      {scene === "archive" && (
        <>
          <Tablet frame={frame} local={local} glitch={local > 8.4 ? 1 : 0} />
          <Bust x={150} y={820} s={1.7} who="mikhail" frame={frame} look={1} tint="#5ec8ff" scared={local > 4} talking={speaker === "mikhail"} />
          <Bust x={930} y={830} s={1.6} who="anna" frame={frame} look={-1} tint="#5ec8ff" scared={local > 4} talking={speaker === "anna"} />
          {local > 8 && <Panel x={540} y={1120} s={0.9} frame={frame} speaking={liraSpeaking} />}
        </>
      )}

      {scene === "talk" && (
        <>
          <Bust x={330} y={720} s={2.5} who="sonya" frame={frame} look={1} tint="#5ec8ff" scared={local > 4} talking={sonyaTalk} />
          <Panel x={850} y={420} s={1.6} frame={frame} speaking={liraSpeaking} />
          <polygon points="0,1050 1080,1030 1080,1250 0,1250" fill="#1a1530" />
        </>
      )}

      {scene === "final" && (
        <>
          <Tablet frame={frame} local={local + 8} big glitch={local > 0.5 ? 0.6 : 0} />
          <Panel x={940} y={1130} s={1.1} frame={frame} speaking={liraSpeaking} red={redLevel} />
          {local > 3 && (
            <g opacity={interpolate(local, [3, 4.5], [0, 1], clamp)}>
              <Bust x={140} y={1100} s={1.1} who="mikhail" frame={frame} scared look={1} />
              <Bust x={400} y={1110} s={1.05} who="anna" frame={frame} scared look={1} />
            </g>
          )}
        </>
      )}

      {scene === "title" && <rect width={ART_W} height={ART_H} fill="#05060c" />}

      <rect width={ART_W} height={ART_H} fill="url(#vig3)" />
      {/* зашум */}
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={i} cx={rand(i + frame * 0.3) * ART_W} cy={rand(i + 40 + frame * 0.2) * ART_H} r="1.4" fill="#fff" opacity="0.14" />
      ))}
    </svg>
  );
};

/* ---------- Интерфейс ---------- */
const Hud: React.FC<{ t: number; frame: number; scene: SceneId }> = ({ t, frame, scene }) => {
  if (scene === "title") return null;
  const label =
    scene === "hook" || scene === "door"
      ? "НОЧЬ · 03:17"
      : scene === "day" || scene === "install"
        ? "ДЕНЬ 1"
        : scene === "kitchen"
          ? "ДЕНЬ 2"
          : "ДЕНЬ 3";
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: FONT,
        color: "#fff",
      }}
    >
      <div>
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 4 }}>КВАРТИРА 47</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, opacity: 0.6, marginTop: 6 }}>{label}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4, opacity: 0.75 }}>ЛИРА</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: t > 57 ? "#ff3b2f" : BLUE, opacity: frame % 40 < 28 ? 1 : 0.4 }}>● ONLINE</div>
      </div>
    </div>
  );
};

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start - 0.03 && t < l.start + l.dur + 0.35);
  if (!line) return null;
  const o = interpolate(t, [line.start, line.start + 0.1], [0, 1], clamp);
  const who = line.who;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 300,
        textAlign: "center",
        fontFamily: FONT,
        opacity: o,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 6, color: WHO_COLOR[who], marginBottom: 10 }}>
        {WHO_NAME[who]}
      </div>
      <div
        style={{
          fontSize: who === "lira" ? 66 : 60,
          fontWeight: 900,
          lineHeight: 1.12,
          color: who === "lira" ? BLUE : "#fff",
          textShadow: "0 4px 18px rgba(0,0,0,.95)",
        }}
      >
        {line.text}
      </div>
    </div>
  );
};

const TitleCard: React.FC<{ t: number }> = ({ t }) => {
  if (t < 64) return null;
  const o = interpolate(t, [64, 64.6], [0, 1], clamp);
  const glow = 0.6 + 0.4 * Math.sin(t * 5);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ textAlign: "center", fontFamily: FONT }}>
        <div
          style={{
            fontSize: 220,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: 18,
            textShadow: `0 0 ${60 * glow}px ${BLUE}, 0 0 ${120 * glow}px ${BLUE}`,
          }}
        >
          ЛИРА
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, color: BLUE, letterSpacing: 10, marginTop: 20 }}>
          СЕРИЯ 1 · ПЕРВЫЙ ЗАПУСК
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#fff", opacity: 0.75, marginTop: 70 }}>
          ОНА ЗНАЛА ВАС ЗАДОЛГО ДО УСТАНОВКИ
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Audios: React.FC = () => {
  const S = (s: number) => Math.round(s * FPS);
  const L = (f: string) => staticFile(`lira/${f}`);
  const A2 = (f: string) => staticFile(`audio2/${f}`);
  const A1 = (f: string) => staticFile(`audio/${f}`);
  const sfx = (from: number, dur: number, src: string, vol: number, loop = false) => (
    <Sequence from={S(from)} durationInFrames={S(dur)}>
      <Audio src={src} volume={vol} loop={loop} />
    </Sequence>
  );
  return (
    <>
      {sfx(0, 14.5, L("x-tick.mp3"), 0.45, true)}
      {sfx(0, 6.2, A2("sfx-heart.mp3"), 0.3, true)}
      {sfx(6.2, 8.3, A2("sfx-heart.mp3"), 0.55, true)}
      {sfx(6.1, 2, A1("sfx-hit.mp3"), 0.9)}
      {sfx(11.5, 3, L("x-lock.mp3"), 0.9)}
      {sfx(14.2, 2, L("x-glitch.mp3"), 0.8)}
      {sfx(17.4, 1.5, L("x-chime.mp3"), 0.8)}
      {sfx(0.8, 1.2, L("x-chime.mp3"), 0.5)}
      {sfx(32.4, 2, L("x-glitch.mp3"), 0.7)}
      {sfx(32.5, 11.5, A2("sfx-heart.mp3"), 0.4, true)}
      {sfx(40.6, 1.5, A1("sfx-hit.mp3"), 0.9)}
      {sfx(40.9, 2, L("x-glitch.mp3"), 0.9)}
      {sfx(44, 10, A2("sfx-riser.mp3"), 0.5)}
      {sfx(54.0, 2, L("x-glitch.mp3"), 1)}
      {sfx(54, 10, A2("sfx-heart.mp3"), 0.6, true)}
      {sfx(57.4, 2, A1("sfx-hit.mp3"), 1)}
      {sfx(63.8, 3, A1("sfx-hit.mp3"), 1)}
      {sfx(0, 70, A1("sfx-wind.mp3"), 0.12, true)}
      {LINES.map((l) => (
        <Sequence key={l.file} from={S(l.start)} durationInFrames={Math.ceil((l.dur + 0.4) * FPS)}>
          <Audio src={L(l.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

export const Home: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = sceneAt(t);
  const local = t - sc.start;
  const line = speakingAt(t);

  const kick =
    (sc.id === "door" && (local < 0.4 || Math.abs(local - 5.2) < 0.3)) || (sc.id === "final" && local > 3.5 && local < 3.9) ? 1 : 0;
  const amp = 2 + sc.tension * 5 + kick * 24;
  const dx = Math.sin(frame * 1.7) * amp * 0.6;
  const dy = Math.cos(frame * 1.3) * amp * 0.6;
  const zoom = 1 + 0.06 * (local / (sc.end - sc.start)) + kick * 0.05;

  const glitchOn =
    (t > 14.2 && t < 14.7) || (t > 32.4 && t < 32.8) || (t > 40.9 && t < 41.5) || (t > 54 && t < 54.6) || (t > 57.5 && t < 57.8);
  const flash = Math.max(
    sc.id === "door" ? interpolate(local, [0, 0.12], [0.5, 0], clamp) : 0,
    interpolate(t, [40.95, 41.05, 41.3], [0, 0.6, 0], clamp),
    interpolate(t, [57.5, 57.6, 57.9], [0, 0.6, 0], clamp),
  );
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * (1.1 + sc.tension * 0.9))), 6);
  const redT = t > 57 ? 1 : 0;
  const glowO = (0.08 + sc.tension * 0.22) * (0.4 + beat);

  const fadeIn = interpolate(t, [0, 0.4], [0, 1], clamp);
  const fadeOut = interpolate(t, [69.2, 70], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          width: ART_W,
          height: ART_H,
          overflow: "hidden",
          opacity: Math.min(fadeIn, fadeOut),
        }}
      >
        <div style={{ transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: "50% 55%" }}>
          <World3 frame={frame} t={t} scene={sc.id} local={local} speaker={line?.who} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle, rgba(0,0,0,0) 40%, ${redT ? "rgba(255,30,20," : "rgba(40,140,255,"}${glowO}) 100%)`,
          }}
        />
        {glitchOn &&
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (rand(i + frame) - 0.5) * 80,
                top: rand(i * 3 + frame * 0.5) * ART_H,
                width: ART_W + 120,
                height: 14 + rand(i + 9) * 50,
                background: i % 2 ? "rgba(0,255,255,0.35)" : "rgba(255,0,120,0.35)",
                mixBlendMode: "screen",
              }}
            />
          ))}
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
      </div>
      <Hud t={t} frame={frame} scene={sc.id} />
      <Subtitle t={t} />
      <TitleCard t={t} />
      <Audios />
    </AbsoluteFill>
  );
};

void SCENES;
