import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  ART_H,
  ART_W,
  Fire,
  FireGlow,
  Fog,
  GROUND_Y,
  Ground,
  Hills,
  Person,
  Pine,
  Stars,
  Stream,
  TreeLayer,
  rand,
} from "./Art";
import { FPS, SCENES, VOICES, sceneAt, type SceneId } from "./timeline2";

const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const RED = "#ff3b2f";
const AMBER = "#ffd34a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/* ---------- Волки ---------- */
const WolfEyes: React.FC<{ x: number; y: number; frame: number; o?: number; s?: number; seed?: number }> = ({
  x,
  y,
  frame,
  o = 1,
  s = 1,
  seed = 0,
}) => {
  const blink = (frame + seed * 37) % 140 < 5 ? 0.1 : 1;
  const flick = 0.75 + 0.25 * Math.sin(frame * 0.2 + seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * 1.9})`} opacity={Math.min(1, o * flick * 1.2)}>
      <ellipse cx="-13" cy="0" rx="20" ry="12" fill="#c8ff3a" opacity="0.18" />
      <ellipse cx="13" cy="0" rx="20" ry="12" fill="#c8ff3a" opacity="0.18" />
      <polygon points={`-20,0 -6,${-5 * blink} -4,2`} fill="#e6ff6a" />
      <polygon points={`20,0 6,${-5 * blink} 4,2`} fill="#e6ff6a" />
    </g>
  );
};

const Wolf: React.FC<{
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  frame: number;
  run?: boolean;
  lunge?: number;
  headBob?: boolean;
}> = ({ x, y, s = 1, flip, frame, run, lunge = 0, headBob }) => {
  const ph = run ? frame * 0.9 : 0;
  const leg = (off: number, base: number) => {
    const a = run ? Math.sin(ph + off) * 34 : 0;
    return (
      <g transform={`translate(${base} -30) rotate(${a})`}>
        <polygon points="-9,0 9,0 5,34 -5,34" fill="#0b0d12" />
        <polygon points="-5,34 5,34 12,44 -8,44" fill="#07080b" />
      </g>
    );
  };
  const bob = headBob ? Math.sin(frame * 0.5) * 5 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s * 1.5 : s * 1.5} ${s * 1.5}) rotate(${-lunge * 18})`}>
      {leg(0, -80)}
      {leg(2, -52)}
      <polygon points="-120,-40 -96,-92 -20,-104 50,-96 62,-60 52,-30 -50,-26 -100,-14" fill="#10131a" />
      <polygon points="-96,-92 -20,-104 50,-96 -10,-76" fill="#1a2030" />
      <polygon points="-120,-40 -160,-70 -150,-44" fill="#0b0d12" />
      <g transform={`translate(0 ${bob})`}>
        <polygon points="50,-96 90,-124 126,-106 152,-80 122,-66 96,-58 62,-60" fill="#141822" />
        <polygon points="90,-124 126,-106 122,-84 96,-90" fill="#232a3b" />
        <polygon points="84,-122 94,-152 108,-118" fill="#0b0d12" />
        <polygon points="152,-80 122,-66 112,-76 138,-84" fill="#05060a" />
        <circle cx="116" cy="-96" r="5" fill="#e6ff6a" />
        <circle cx="116" cy="-96" r="12" fill="#c8ff3a" opacity="0.25" />
        {lunge > 0.3 && <polygon points="130,-72 142,-58 146,-76" fill="#fff" />}
      </g>
      {leg(4, 20)}
      {leg(1, 44)}
    </g>
  );
};

const Stick: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <polygon points="-6,0 6,0 4,-220 -4,-220" fill="#5a3d27" />
    <polygon points="0,0 6,0 4,-220 0,-220" fill="#3f2a1a" />
  </g>
);

const Rock: React.FC = () => (
  <g>
    <polygon points="760,1250 740,620 860,480 1000,420 1080,430 1080,1250" fill="#262a36" />
    <polygon points="860,480 1000,420 1080,430 1080,700 940,640 880,560" fill="#363c4c" />
    <polygon points="740,620 860,480 880,560 820,760" fill="#1b1e28" />
    <polygon points="820,760 880,560 940,640 920,900" fill="#2e3342" />
  </g>
);

const Sparks: React.FC<{ x: number; y: number; local: number }> = ({ x, y, local }) => (
  <g>
    {Array.from({ length: 16 }).map((_, i) => {
      const age = local * 1.4 + i * 0.07;
      const a = rand(i + 2) * Math.PI * 2;
      const r = Math.min(1, age) * (40 + rand(i) * 120);
      return (
        <circle
          key={i}
          cx={x + Math.cos(a) * r}
          cy={y - Math.abs(Math.sin(a)) * r - age * 20}
          r={4 - Math.min(1, age) * 3}
          fill="#ffd34a"
          opacity={Math.max(0, 1 - age)}
        />
      );
    })}
  </g>
);

/* ---------- Мир ---------- */
type WorldProps = { frame: number; t: number; scene: SceneId; local: number };

const World2: React.FC<WorldProps> = ({ frame, t, scene, local }) => {
  const dawn = interpolate(t, [50, 54, 58], [0, 0.6, 1], clamp);
  const sky = {
    top: interpolateColors(t, [0, 50, 56, 60], ["#0b1330", "#0b1330", "#2b3a5a", "#6a7fa0"]),
    bottom: interpolateColors(t, [0, 50, 56, 60], ["#26335c", "#26335c", "#a86a50", "#f0b27a"]),
  };
  const dark = 0.7 - dawn * 0.6;
  const fireOn = t >= 25.8 && t < 54;
  const fireAmt = scene === "r3" ? interpolate(local, [1.5, 4], [0, 1], clamp) : 1;
  const shrink = scene === "r5" ? interpolate(local, [0, 8], [1, 0.45], clamp) : scene === "outro" ? 0.35 : 1;
  const fx = scene === "r4" || scene === "r5" ? 430 : 520;
  const fy = GROUND_Y + 150;

  // персонаж по сценам
  const person = (() => {
    switch (scene) {
      case "hook":
        return { x: 540, y: GROUND_Y + 330, s: 2.5, look: Math.sin(frame * 0.2) * 1.5, scared: true };
      case "stakes":
        return { x: 900 - local * 160, y: GROUND_Y + 150, s: 1.05, look: -1, scared: true };
      case "r1": {
        if (local < 3.4) return { x: 1000 - local * 230, y: GROUND_Y + 150 + Math.abs(Math.sin(frame * 0.5)) * -14, s: 1.1, look: -1, scared: true };
        return { x: 300 + (local - 3.4) * 22, y: GROUND_Y + 150, s: 1.15, look: 1, scared: true };
      }
      case "r2":
        return { x: 280 + local * 70, y: GROUND_Y + 175, s: 1.15, look: 1, scared: true };
      case "r3":
        return { x: 760, y: GROUND_Y + 160, s: 1.15, sitting: local > 1.5, look: -1, scared: true };
      case "r4":
        return { x: 840, y: GROUND_Y + 190, s: 1.2, look: -1, scared: true };
      case "r5":
        return { x: 660, y: GROUND_Y + 160, s: 1.15, sitting: true, look: Math.sin(frame * 0.05) * 1.5, scared: true };
      default:
        return { x: 540, y: GROUND_Y + 170, s: 1.2, sitting: false, look: local > 4.4 ? -1.5 : 1, scared: local > 4.4 };
    }
  })();

  // глаза / волки
  const eyePairs: { x: number; y: number; s: number; at: number }[] = [
    { x: 150, y: 640, s: 1, at: 1.2 },
    { x: 420, y: 600, s: 0.8, at: 1.9 },
    { x: 900, y: 650, s: 1.1, at: 2.6 },
    { x: 700, y: 590, s: 0.7, at: 3.3 },
    { x: 60, y: 760, s: 1.3, at: 4.0 },
  ];

  return (
    <svg viewBox={`0 0 ${ART_W} ${ART_H}`} width={ART_W} height={ART_H}>
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <radialGradient id="fireGlow">
          <stop offset="0" stopColor="#ff9a3c" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#e8571f" stopOpacity="0.3" />
          <stop offset="1" stopColor="#e8571f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette2">
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width={ART_W} height={ART_H} fill="url(#sky2)" />
      <g opacity={1 - dawn}>
        <Stars t={52} frame={frame} />
      </g>
      {/* луна */}
      <g opacity={1 - dawn}>
        <circle cx="820" cy="190" r="70" fill="#e8ecf5" />
        <circle cx="848" cy="176" r="62" fill={sky.top} />
      </g>
      {dawn > 0 && <circle cx="300" cy={interpolate(t, [52, 60], [900, 640], clamp)} r="110" fill="#ffc27a" opacity={dawn} />}

      <Hills dark={dark} />
      <TreeLayer seed={11} count={11} y={GROUND_Y - 130} scale={[0.5, 0.7]} dark={Math.min(1, dark + 0.2)} sway={6} frame={frame} />
      <TreeLayer seed={23} count={9} y={GROUND_Y - 70} scale={[0.7, 0.95]} dark={Math.min(1, dark + 0.1)} sway={10} frame={frame} />
      <Ground dark={dark} />
      <Fog frame={frame} o={0.45 + dark * 0.3} />

      {/* сцена hook: глаза в темноте */}
      {(scene === "hook" || scene === "stakes") &&
        eyePairs.map((e, i) => (
          <WolfEyes
            key={i}
            x={e.x}
            y={e.y}
            s={e.s}
            frame={frame}
            seed={i}
            o={scene === "hook" ? interpolate(local, [e.at, e.at + 0.3], [0, 1], clamp) : 1}
          />
        ))}

      {scene === "stakes" && (
        <>
          <Wolf x={-200 + local * 90} y={GROUND_Y + 120} s={0.9} frame={frame} run />
          <WolfEyes x={980} y={560} frame={frame} seed={9} s={1.1} />
        </>
      )}

      {/* R1: погоня и стойка */}
      {scene === "r1" && (
        <>
          {local < 3.4 && <Wolf x={-100 + local * 200} y={GROUND_Y + 150} s={1.1} frame={frame} run />}
          {local >= 3.4 && (
            <>
              <Wolf x={-60 + (local - 3.4) * 14} y={GROUND_Y + 150} s={1.1} frame={frame} headBob />
              <WolfEyes x={900} y={600} frame={frame} seed={2} />
              <WolfEyes x={720} y={560} frame={frame} seed={4} s={0.8} />
            </>
          )}
        </>
      )}

      {/* R2: вода */}
      {scene === "r2" && (
        <>
          <Stream frame={frame} />
          <Wolf x={120} y={GROUND_Y + 150} s={1.0} frame={frame} headBob />
          <Wolf x={980} y={GROUND_Y + 180} s={1.0} flip frame={frame} headBob />
          {local > 4.2 && <WolfEyes x={540} y={640} frame={frame} seed={6} />}
        </>
      )}

      {/* R4: скала */}
      {scene === "r4" && <Rock />}

      {/* огонь */}
      {fireOn && (
        <g opacity={fireAmt}>
          <FireGlow x={fx} y={GROUND_Y + 80} frame={frame} r={560 * shrink} o={0.95} />
          <Fire x={fx} y={fy} frame={frame} scale={(0.9 + fireAmt * 0.3) * (0.6 + shrink * 0.4)} />
        </g>
      )}
      {scene === "r3" && local > 1.3 && local < 3 && <Sparks x={fx} y={fy - 40} local={local - 1.3} />}

      {/* R3/R5: кольцо глаз вокруг света */}
      {(scene === "r3" || scene === "r5") &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const base = scene === "r3" ? 0.9 : 0.55 + (1 - shrink) * 0.6;
          const ang = (i / 6) * Math.PI * 2 + frame * 0.004;
          const rad = (scene === "r3" ? 560 : 380 + shrink * 190) * (0.9 + 0.1 * Math.sin(frame * 0.05 + i));
          return (
            <WolfEyes
              key={i}
              x={fx + Math.cos(ang) * rad}
              y={GROUND_Y + 40 + Math.sin(ang) * rad * 0.28}
              frame={frame}
              seed={i}
              s={0.8 + (i % 3) * 0.2}
              o={scene === "r3" ? interpolate(local, [2 + i * 0.4, 2.6 + i * 0.4], [0, base], clamp) : base}
            />
          );
        })}

      {/* R4: волк прыгает/рычит, палка */}
      {scene === "r4" && (
        <>
          <Wolf
            x={170 + Math.min(local, 4) * 40 + (local > 5.2 && local < 5.8 ? (local - 5.2) * 350 : 0)}
            y={GROUND_Y + 190}
            s={1.3}
            frame={frame}
            headBob
            lunge={local > 5.2 && local < 5.8 ? 1 : 0}
          />
          <WolfEyes x={90} y={620} frame={frame} seed={3} />
        </>
      )}

      {/* ФИНАЛ */}
      {scene === "outro" && local > 4.4 && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <WolfEyes key={i} x={240 + i * 190 + (i % 2) * 20} y={760 + (i % 2) * 40} frame={frame} seed={i + 4} s={1.2} o={interpolate(local, [4.4 + i * 0.15, 4.8 + i * 0.15], [0, 1], clamp)} />
          ))}
        </g>
      )}
      {scene === "outro" && <Stream frame={frame} />}

      {scene === "r4" && <Stick x={person.x - 80} y={person.y} rot={14} />}
      <Person {...person} s={(person.s ?? 1) * (scene === "hook" ? 1 : 1.35)} frame={frame} />
      {scene === "r5" && local > 1 && (
        <g transform={`translate(${person.x - 170} ${person.y - 40})`}>
          <polygon points="0,0 70,-10 74,0 4,12" fill="#5a3d27" />
        </g>
      )}

      <Pine x={-10} y={GROUND_Y + 380} s={1.7} dark={Math.min(1, dark + 0.3)} />
      <Pine x={1090} y={GROUND_Y + 380} s={1.7} dark={Math.min(1, dark + 0.3)} />
      <rect width={ART_W} height={ART_H} fill="url(#vignette2)" />
    </svg>
  );
};

/* ---------- Интерфейс ---------- */
const Hud: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  let label = "";
  let value = "";
  let urgent = false;
  if (t >= 5.7 && t < 25) {
    const rem = Math.max(0, 180 - ((t - 5.7) / (24.5 - 5.7)) * 180);
    label = "ВОЛКИ ЧЕРЕЗ";
    value = `${pad(rem / 60)}:${pad(rem % 60)}`;
    urgent = rem < 60;
  } else if (t >= 25 && t < 50) {
    const rem = Math.max(0, 360 - ((t - 25) / 25) * 360);
    label = "ДО РАССВЕТА";
    value = `${pad(rem / 60)}:${pad(rem % 60)}:00`;
    urgent = true;
  } else if (t >= 50) {
    label = "РАССВЕТ";
    value = "ЖИВ";
  }
  const blink = urgent && frame % 30 < 15;
  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        left: 56,
        right: 56,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: FONT,
        color: "#fff",
      }}
    >
      <div>
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 4 }}>ЧАЩА 14</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, opacity: 0.55, marginTop: 6 }}>
          ● REC · СВЯЗИ НЕТ
        </div>
      </div>
      {label && (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4, opacity: 0.75 }}>{label}</div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: 2,
              color: t >= 50 ? "#7dffb0" : urgent ? (blink ? RED : "#ff8a80") : "#fff",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </div>
        </div>
      )}
    </div>
  );
};

const RuleTitle: React.FC<{ num: string; title: string; local: number }> = ({ num, title, local }) => {
  const o = interpolate(local, [0, 0.15, 7, 7.5], [0, 1, 1, 0], clamp);
  const scale = interpolate(local, [0, 0.22], [1.8, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT,
        opacity: o,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ color: "#ff7a45", fontSize: 28, fontWeight: 900, letterSpacing: 8 }}>ПРАВИЛО {num}</div>
      <div style={{ color: "#fff", fontSize: 78, fontWeight: 900, marginTop: 6, textShadow: "0 4px 28px #000" }}>
        {title}
      </div>
    </div>
  );
};

const DANGER = ["НЕ БЕГИ", "ОГОНЬ", "НЕ СПИ", "ДОБЫЧА", "ВОЛК", "ЗАГРЫЗЁТ"];

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const v = VOICES.find((x) => t >= x.start - 0.05 && t < x.start + x.dur + 0.3);
  if (!v) return null;
  const total = v.lines.reduce((a, l) => a + l.length, 0);
  let acc = 0;
  let current = v.lines[0];
  let from = v.start;
  for (const l of v.lines) {
    const s = v.start + (acc / total) * v.dur;
    if (t >= s) {
      current = l;
      from = s;
    }
    acc += l.length;
  }
  const o = interpolate(t, [from, from + 0.08], [0, 1], clamp);
  const pop = interpolate(t, [from, from + 0.12], [1.15, 1], clamp);
  const hot = DANGER.some((d) => current.toUpperCase().includes(d)) || current.endsWith("!");
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 190,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 72,
        fontWeight: 900,
        lineHeight: 1.1,
        color: hot ? RED : AMBER,
        textTransform: "uppercase",
        textShadow: "0 4px 18px rgba(0,0,0,.95)",
        opacity: o,
        transform: `scale(${pop})`,
      }}
    >
      {current}
    </div>
  );
};

const Cta: React.FC<{ t: number }> = ({ t }) => {
  if (t < 57) return null;
  const o = interpolate(t, [57, 57.4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: `rgba(0,0,0,${0.78 * o})` }}>
      <div style={{ fontFamily: FONT, textAlign: "center", opacity: o, padding: 80 }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: "#fff", lineHeight: 1.05 }}>ТЫ БЫ ВЫЖИЛ?</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: AMBER, marginTop: 36 }}>ПИШИ В КОММЕНТАРИЯХ</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#fff", opacity: 0.7, marginTop: 24 }}>
          ЧАСТЬ 2: ЧТО ВЫШЛО ИЗ ВОДЫ →
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Audios: React.FC = () => {
  const S = (s: number) => Math.round(s * FPS);
  const a = (f: string) => staticFile(`audio2/${f}`);
  const old = (f: string) => staticFile(`audio/${f}`);
  return (
    <>
      <Audio src={old("sfx-wind.mp3")} loop volume={0.3} />
      <Sequence from={S(5.4)} durationInFrames={S(54)}>
        <Audio src={a("sfx-heart.mp3")} loop volume={0.35} />
      </Sequence>
      <Sequence from={S(0.1)} durationInFrames={S(2.5)}><Audio src={a("sfx-howl.mp3")} volume={0.9} /></Sequence>
      <Sequence from={S(5.4)} durationInFrames={S(1.5)}><Audio src={a("sfx-riser.mp3")} volume={0.8} /></Sequence>
      <Sequence from={S(10.0)} durationInFrames={S(3)}><Audio src={a("sfx-run.mp3")} volume={0.9} /></Sequence>
      <Sequence from={S(13.4)} durationInFrames={S(3)}><Audio src={a("sfx-growl.mp3")} volume={0.8} /></Sequence>
      <Sequence from={S(18.0)} durationInFrames={S(5)}><Audio src={a("sfx-splash.mp3")} loop volume={0.7} /></Sequence>
      <Sequence from={S(26.0)} durationInFrames={S(2)}><Audio src={a("sfx-ignite.mp3")} volume={0.95} /></Sequence>
      <Sequence from={S(27.5)} durationInFrames={S(26)}><Audio src={old("sfx-fire.mp3")} loop volume={0.5} /></Sequence>
      <Sequence from={S(38.2)} durationInFrames={S(3)}><Audio src={a("sfx-growl.mp3")} volume={1} /></Sequence>
      <Sequence from={S(44)} durationInFrames={S(2.5)}><Audio src={a("sfx-howl.mp3")} volume={0.7} /></Sequence>
      <Sequence from={S(54.6)} durationInFrames={S(3)}><Audio src={a("sfx-howl.mp3")} volume={1} /></Sequence>
      {SCENES.filter((s) => s.rule).map((s) => (
        <React.Fragment key={s.id}>
          <Sequence from={S(s.start)} durationInFrames={S(2)}><Audio src={old("sfx-hit.mp3")} volume={0.85} /></Sequence>
          <Sequence from={S(s.start - 0.1)} durationInFrames={S(2)}><Audio src={a("sfx-whoosh.mp3")} volume={0.6} /></Sequence>
        </React.Fragment>
      ))}
      {VOICES.map((v) => (
        <Sequence key={v.file} from={S(v.start)} durationInFrames={Math.ceil((v.dur + 0.4) * FPS)}>
          <Audio src={a(v.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};

export const Action: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = sceneAt(t);
  const local = t - sc.start;

  // тряска камеры
  const stakes = sc.tension;
  const hitKick = sc.rule ? interpolate(local, [0, 0.4], [1, 0], clamp) : 0;
  const lungeKick =
    (sc.id === "r1" && Math.abs(local - 3.3) < 0.35) || (sc.id === "r4" && local > 5.1 && local < 5.9) ? 1 : 0;
  const amp = 3 + stakes * 5 + hitKick * 22 + lungeKick * 26;
  const dx = Math.sin(frame * 1.7) * amp * 0.6 + Math.sin(frame * 0.9 + 2) * amp * 0.4;
  const dy = Math.cos(frame * 1.3) * amp * 0.6;
  const zoom = 1 + Math.sin(local * 0.6) * 0.01 + 0.05 * (local / (sc.end - sc.start)) + hitKick * 0.05;

  // пульс сердца -> красная виньетка
  const beat = Math.pow(Math.max(0, Math.sin((frame / FPS) * Math.PI * 2 * (1.1 + stakes * 0.9))), 6);
  const redO = (0.08 + stakes * 0.25) * (0.4 + beat) * (t < 50 ? 1 : 0.2);

  // вспышки: вой, удар правил, прыжок
  const flash = Math.max(
    sc.rule ? interpolate(local, [0, 0.12], [0.55, 0], clamp) : 0,
    interpolate(t, [0.1, 0.3, 0.6], [0, 0.5, 0], clamp),
    interpolate(t, [54.6, 54.75, 55.1], [0, 0.55, 0], clamp),
    lungeKick ? 0.35 : 0,
  );
  const flashColor = t > 54 ? "#ff2a1a" : "#ffffff";
  const fadeIn = interpolate(t, [0, 0.35], [0, 1], clamp);
  const fadeOut = interpolate(t, [59.2, 60], [1, 0], clamp);

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
        <div style={{ transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: "50% 60%" }}>
          <World2 frame={frame} t={t} scene={sc.id} local={local} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, rgba(255,0,0,0) 40%, rgba(255,20,10,${redO}) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: flashColor, opacity: flash }} />
      </div>
      <Hud t={t} frame={frame} />
      {sc.rule && <RuleTitle num={sc.rule.num} title={sc.rule.title} local={local} />}
      <Subtitle t={t} />
      <Cta t={t} />
      <Audios />
    </AbsoluteFill>
  );
};
