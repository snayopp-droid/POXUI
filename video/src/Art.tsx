import React from "react";
import { interpolate, interpolateColors } from "remotion";
import type { SceneId } from "./timeline";

export const ART_W = 1080;
export const ART_H = 1250;
const GROUND_Y = 860;

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const keyed = (t: number, times: number[], colors: string[]) =>
  interpolateColors(t, times, colors);

export const skyColors = (t: number) => {
  const times = [0, 10, 25, 45, 58, 68];
  return {
    top: keyed(t, times, ["#2a2a4a", "#1c2040", "#10142c", "#070a1a", "#070a1a", "#3a5a7a"]),
    bottom: keyed(t, times, ["#d9784a", "#a8503a", "#5a3040", "#14182e", "#14182e", "#f0b070"]),
  };
};

export const nightLevel = (t: number) =>
  interpolate(t, [0, 30, 50, 58, 68], [0, 0.45, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Stars: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const level = interpolate(nightLevel(t), [0.25, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g opacity={level}>
      {Array.from({ length: 70 }).map((_, i) => {
        const tw = 0.6 + 0.4 * Math.sin(frame * 0.08 + i * 1.7);
        return (
          <circle
            key={i}
            cx={rand(i + 1) * ART_W}
            cy={rand(i + 91) * 520}
            r={1.2 + rand(i + 7) * 2.2}
            fill="#fff"
            opacity={tw}
          />
        );
      })}
    </g>
  );
};

const Pine: React.FC<{ x: number; y: number; s: number; dark: number }> = ({ x, y, s, dark }) => {
  const light = keyed(dark, [0, 1], ["#2f5a3c", "#0f2418"]);
  const shade = keyed(dark, [0, 1], ["#1f3d2a", "#08160f"]);
  const tiers = [0, 1, 2];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points="-9,0 9,0 7,-60 -7,-60" fill="#2a1b12" />
      {tiers.map((i) => {
        const w = 110 - i * 24;
        const top = -60 - i * 70 - 120;
        const base = -60 - i * 70;
        return (
          <g key={i}>
            <polygon points={`0,${top} ${-w},${base} 0,${base + 18}`} fill={light} />
            <polygon points={`0,${top} ${w},${base} 0,${base + 18}`} fill={shade} />
          </g>
        );
      })}
    </g>
  );
};

const TreeLayer: React.FC<{
  seed: number;
  count: number;
  y: number;
  scale: [number, number];
  dark: number;
  sway: number;
  frame: number;
}> = ({ seed, count, y, scale, dark, sway, frame }) => (
  <g transform={`translate(${Math.sin(frame * 0.012 + seed) * sway} 0)`}>
    {Array.from({ length: count }).map((_, i) => {
      const s = scale[0] + rand(seed + i * 3) * (scale[1] - scale[0]);
      return (
        <Pine
          key={i}
          x={(i / (count - 1)) * (ART_W + 200) - 100 + (rand(seed + i) - 0.5) * 60}
          y={y + (rand(seed + i * 5) - 0.5) * 26}
          s={s}
          dark={dark}
        />
      );
    })}
  </g>
);

const Hills: React.FC<{ dark: number }> = ({ dark }) => (
  <g>
    <polygon
      points={`0,${GROUND_Y} 0,640 180,560 360,620 520,520 720,610 900,540 1080,600 1080,${GROUND_Y}`}
      fill={keyed(dark, [0, 1], ["#4a3a4a", "#0d1224"])}
    />
    <polygon
      points={`0,${GROUND_Y} 0,720 240,660 430,720 650,650 860,716 1080,670 1080,${GROUND_Y}`}
      fill={keyed(dark, [0, 1], ["#33293a", "#0a0e1c"])}
    />
  </g>
);

const Ground: React.FC<{ dark: number }> = ({ dark }) => (
  <g>
    <polygon
      points={`0,${GROUND_Y - 20} 1080,${GROUND_Y - 30} 1080,${ART_H} 0,${ART_H}`}
      fill={keyed(dark, [0, 1], ["#2a2218", "#07090c"])}
    />
    <polygon
      points={`0,${GROUND_Y + 160} 300,${GROUND_Y + 110} 640,${GROUND_Y + 170} 1080,${GROUND_Y + 120} 1080,${ART_H} 0,${ART_H}`}
      fill={keyed(dark, [0, 1], ["#201a12", "#05070a"])}
    />
  </g>
);

/* ---------- Персонаж ---------- */
const Face: React.FC<{ look: number; frame: number; scared?: boolean }> = ({ look, frame, scared }) => {
  const blink = frame % 110 < 4 ? 0.1 : 1;
  const pr = scared ? 7 : 9;
  return (
    <g>
      <polygon points="0,0 -60,-30 -62,22" fill="#e3b79a" />
      <polygon points="0,0 -62,22 -30,62" fill="#c99a7e" />
      <polygon points="0,0 -30,62 34,62" fill="#d8aa8e" />
      <polygon points="0,0 34,62 64,20" fill="#b98468" />
      <polygon points="0,0 64,20 58,-32" fill="#cf9f84" />
      <polygon points="0,0 58,-32 0,-52 -60,-30" fill="#e8c0a4" />
      {[-26, 26].map((ex) => (
        <g key={ex} transform={`translate(${ex} -6) scale(1 ${blink})`}>
          <ellipse rx="15" ry="17" fill="#fff" />
          <circle cx={look * 5} cy="1" r={pr} fill="#1a1a22" />
          <circle cx={look * 5 - 3} cy="-3" r="2.6" fill="#fff" />
        </g>
      ))}
      <rect x="-14" y="38" width="28" height={scared ? 9 : 5} rx="2" fill="#5a2f26" />
    </g>
  );
};

const Hat: React.FC = () => (
  <g>
    <polygon points="-66,-24 -50,-70 0,-86 50,-70 66,-24 0,-46" fill="#a3322c" />
    <polygon points="0,-86 50,-70 66,-24 0,-46" fill="#7f2420" />
    <rect x="-68" y="-30" width="136" height="16" rx="5" fill="#6d1e1b" />
  </g>
);

export const Person: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  sitting?: boolean;
  look?: number;
  scared?: boolean;
  flip?: boolean;
}> = ({ x, y, s = 1, frame, sitting, look = 0, scared, flip }) => {
  const bob = Math.sin(frame * 0.07) * 2;
  const bodyH = sitting ? 90 : 170;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`}>
      {!sitting && (
        <>
          <polygon points="-34,0 -4,0 -6,-6 -36,-4" fill="#1b1b1e" />
          <polygon points="4,0 36,0 38,-4 6,-6" fill="#1b1b1e" />
          <polygon points="-34,-4 -6,-6 -8,-70 -32,-70" fill="#35384a" />
          <polygon points="6,-6 36,-4 32,-70 8,-70" fill="#2a2d3c" />
        </>
      )}
      {sitting && (
        <>
          <polygon points="-50,-4 60,-4 60,-30 -50,-30" fill="#35384a" />
          <polygon points="60,-4 100,-4 100,-22 60,-22" fill="#1b1b1e" />
        </>
      )}
      <g transform={`translate(0 ${sitting ? -30 : -70})`}>
        <polygon points={`-44,0 44,0 50,${-bodyH} -50,${-bodyH}`} fill="#4c6a52" />
        <polygon points={`0,0 44,0 50,${-bodyH} 0,${-bodyH}`} fill="#3b5441" />
        <polygon points={`-50,${-bodyH} -70,-30 -52,-24 -44,-60`} fill="#43604a" />
        <polygon points={`50,${-bodyH} 70,-30 52,-24 44,-60`} fill="#33493a" />
        <rect x="-28" y="-26" width="56" height="10" fill="#2a2018" />
        <g transform={`translate(0 ${-bodyH - 56})`}>
          <Face look={look} frame={frame} scared={scared} />
          <Hat />
        </g>
      </g>
    </g>
  );
};

/* ---------- Реквизит сцен ---------- */
const Fire: React.FC<{ x: number; y: number; frame: number; scale?: number }> = ({ x, y, frame, scale = 1 }) => {
  const f = 0.85 + 0.15 * Math.sin(frame * 0.7) + 0.08 * Math.sin(frame * 1.9);
  const sway = Math.sin(frame * 0.5) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <polygon points="-70,0 70,-14 66,2 -66,16" fill="#3a2314" />
      <polygon points="-62,-14 64,6 60,18 -66,0" fill="#4a2e1a" />
      <g transform={`scale(1 ${f})`}>
        <polygon points={`0,-150 ${-44 + sway},-40 -10,0 40,-6 ${46 + sway},-44`} fill="#e8571f" />
        <polygon points={`${sway},-112 -26,-34 4,-4 30,-30`} fill="#f59a2c" />
        <polygon points={`${sway / 2},-70 -12,-24 2,-8 14,-22`} fill="#ffe08a" />
      </g>
    </g>
  );
};

const FireGlow: React.FC<{ x: number; y: number; frame: number; r: number; o: number }> = ({ x, y, frame, r, o }) => {
  const f = 0.85 + 0.15 * Math.sin(frame * 0.7) + 0.08 * Math.sin(frame * 1.9);
  return (
    <circle cx={x} cy={y} r={r * f} fill="url(#fireGlow)" opacity={o} />
  );
};

const Stream: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <polygon points="470,720 610,720 980,1250 120,1250" fill="#2f5f86" />
    <polygon points="470,720 540,720 540,1250 120,1250" fill="#3a76a3" opacity="0.5" />
    {Array.from({ length: 14 }).map((_, i) => {
      const p = ((frame * 0.012 + i / 14) % 1);
      const y = 720 + p * 530;
      const half = 70 + p * 310;
      return (
        <line
          key={i}
          x1={540 - half * (0.2 + rand(i) * 0.6)}
          x2={540 + half * (0.2 + rand(i + 3) * 0.6)}
          y1={y}
          y2={y}
          stroke="#cfe8ff"
          strokeWidth={1 + p * 4}
          opacity={0.15 + p * 0.4}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

const Shelter: React.FC<{ progress: number }> = ({ progress }) => {
  const sticks = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <g>
      <polygon points="40,0 56,0 56,-250 40,-250" fill="#4a3220" />
      {sticks.map((i) => {
        const on = progress * sticks.length > i;
        return (
          <polygon
            key={i}
            points={`${i * 46},-10 ${i * 46 + 40},-14 ${i * 46 + 10},-250 ${i * 46 - 4},-246`}
            fill={i % 2 ? "#1f4a2c" : "#2a5c38"}
            opacity={on ? 1 : 0}
            transform="translate(60 0)"
          />
        );
      })}
      <polygon points="60,-246 450,-250 440,-240 60,-236" fill="#5a3d27" />
    </g>
  );
};

const Compass: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const ang = Math.sin(frame * 0.04) * 40 + Math.sin(frame * 0.17) * 8;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="62" fill="#1b2230" stroke="#c9a14a" strokeWidth="8" />
      <g transform={`rotate(${ang})`}>
        <polygon points="0,-48 9,0 -9,0" fill="#d4402f" />
        <polygon points="0,48 9,0 -9,0" fill="#e8e8e8" />
      </g>
      <circle r="5" fill="#c9a14a" />
    </g>
  );
};

const Owl: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const blink = frame % 150 < 6 ? 0.1 : 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[-16, 16].map((ex) => (
        <ellipse key={ex} cx={ex} cy="0" rx="9" ry={9 * blink} fill="#ffd34a" />
      ))}
    </g>
  );
};

const Fog: React.FC<{ frame: number; o: number }> = ({ frame, o }) => (
  <g opacity={o}>
    {[0, 1, 2].map((i) => (
      <ellipse
        key={i}
        cx={((frame * (0.4 + i * 0.2) + i * 400) % 1700) - 300}
        cy={760 + i * 70}
        rx={480}
        ry={36}
        fill="#aab4c8"
        opacity={0.12}
      />
    ))}
  </g>
);

export type WorldProps = { frame: number; t: number; scene: SceneId; localT: number };

export const World: React.FC<WorldProps> = ({ frame, t, scene, localT }) => {
  const dark = nightLevel(t);
  const sky = skyColors(t);
  const sunY = interpolate(t, [0, 12, 20, 66, 68], [560, 700, 820, 820, 700], {
    extrapolateRight: "clamp",
  });
  const moonO = interpolate(dark, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" });
  const fireLit = t >= 41.5 && t < 62;
  const fireBig = t >= 41.5 ? Math.min(1, (t - 41.5) / 2.5) : 0;
  const dawn = t >= 60;

  // медленная «камера»
  const zoom = 1 + (localT / 10) * 0.05;
  const rulesClose = scene === "rules";

  const personProps = (() => {
    switch (scene) {
      case "intro":
        return { x: 700 - localT * 18, y: GROUND_Y + 110, s: 0.9, look: -1 };
      case "rules":
        return { x: 540, y: GROUND_Y + 300, s: 2.4, look: Math.sin(frame * 0.05) * 1, scared: true };
      case "r1":
        return { x: 600, y: GROUND_Y + 150, s: 1.15, sitting: true, look: Math.sin(frame * 0.06) };
      case "r2":
        return { x: 300 + localT * 16, y: GROUND_Y + 120, s: 1.1, look: 1 };
      case "r3":
        return { x: 800, y: GROUND_Y + 130, s: 1.15, look: -1 };
      case "r4":
        return { x: 760, y: GROUND_Y + 150, s: 1.15, sitting: true, look: -1 };
      case "r5":
        return { x: 700, y: GROUND_Y + 150, s: 1.15, sitting: true, look: Math.sin(frame * 0.04), scared: localT > 5 };
      default:
        return { x: 240 + localT * 14, y: GROUND_Y + 130, s: 1.15, look: 1 };
    }
  })();

  return (
    <svg viewBox={`0 0 ${ART_W} ${ART_H}`} width={ART_W} height={ART_H}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <radialGradient id="fireGlow">
          <stop offset="0" stopColor="#ff9a3c" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#e8571f" stopOpacity="0.3" />
          <stop offset="1" stopColor="#e8571f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.75" />
        </radialGradient>
      </defs>
      <rect width={ART_W} height={ART_H} fill="url(#sky)" />
      <Stars t={t} frame={frame} />
      {/* солнце / луна */}
      <circle cx="760" cy={sunY} r="90" fill="#ffb066" opacity={1 - dark} />
      <g opacity={moonO}>
        <circle cx="250" cy="200" r="52" fill="#e8ecf5" />
        <circle cx="272" cy="188" r="46" fill={sky.top} />
      </g>

      <g transform={`translate(${ART_W / 2} ${GROUND_Y}) scale(${rulesClose ? 1 : zoom}) translate(${-ART_W / 2} ${-GROUND_Y})`}>
        <Hills dark={dark} />
        <TreeLayer seed={11} count={11} y={GROUND_Y - 130} scale={[0.5, 0.7]} dark={Math.min(1, dark + 0.2)} sway={6} frame={frame} />
        <TreeLayer seed={23} count={9} y={GROUND_Y - 70} scale={[0.7, 0.95]} dark={Math.min(1, dark + 0.1)} sway={10} frame={frame} />
        <Ground dark={dark} />
        <Fog frame={frame} o={0.5 + dark * 0.3} />

        {(scene === "r2" || scene === "outro") && (
          <g opacity={scene === "outro" ? 0.9 : 1}>
            <Stream frame={frame} />
          </g>
        )}

        {(scene === "r3" || scene === "r4" || scene === "r5") && (
          <g transform={`translate(40 ${GROUND_Y + 150})`}>
            <Shelter progress={scene === "r3" ? Math.min(1, localT / 7) : 1} />
          </g>
        )}

        {scene === "r1" && <Compass x={460} y={GROUND_Y + 40} frame={frame} />}

        {fireLit && (
          <g opacity={fireBig}>
            <FireGlow x={560} y={GROUND_Y + 80} frame={frame} r={520} o={0.9} />
            <Fire x={560} y={GROUND_Y + 150} frame={frame} scale={0.9 + fireBig * 0.3} />
          </g>
        )}

        {scene === "r5" && <Owl x={920} y={420} frame={frame} />}

        <Person {...personProps} frame={frame} />

        <Pine x={-10} y={GROUND_Y + 380} s={1.7} dark={Math.min(1, dark + 0.3)} />
        <Pine x={1090} y={GROUND_Y + 380} s={1.7} dark={Math.min(1, dark + 0.3)} />
      </g>

      {/* общий тон и виньетка */}
      {dawn && <rect width={ART_W} height={ART_H} fill="#ffcf8a" opacity={interpolate(t, [60, 68], [0, 0.18])} />}
      <rect width={ART_W} height={ART_H} fill="url(#vignette)" />
    </svg>
  );
};
