import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { World, ART_H, ART_W } from "./Art";
import { FPS, SCENES, VOICES, sceneAt } from "./timeline";

const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const RED = "#ff3b2f";
const AMBER = "#ffd34a";

const pad = (n: number) => String(n).padStart(2, "0");

const Hud: React.FC<{ t: number }> = ({ t }) => {
  const outro = t >= 58;
  const mins = outro ? 6 * 60 + 12 : 18 * 60 + 47 + Math.floor(t * 3);
  const clock = `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;
  const remaining = Math.max(0, 180 - (t / 52) * 180);
  const mm = pad(Math.floor(remaining / 60));
  const ss = pad(Math.floor(remaining % 60));
  const urgent = remaining < 60 && !outro;
  const label = outro ? "РАССВЕТ" : remaining > 0 ? "ДО ТЕМНОТЫ" : "НОЧЬ";
  const value = outro ? "ЖИВ" : remaining > 0 ? `${mm}:${ss}` : "00:00";
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
          {clock}
          {t > 6.5 && !outro ? " · СВЯЗИ НЕТ" : ""}
        </div>
      </div>
      {t > 6.5 && (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4, opacity: 0.7 }}>{label}</div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              letterSpacing: 2,
              color: outro ? "#7dffb0" : urgent ? RED : "#fff",
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
  const o = interpolate(local, [0, 0.35, 8, 8.6], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 0.4], [18, 0], { extrapolateRight: "clamp" });
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
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ color: "#ff7a45", fontSize: 26, fontWeight: 900, letterSpacing: 8 }}>ПРАВИЛО {num}</div>
      <div style={{ color: "#fff", fontSize: 64, fontWeight: 900, marginTop: 8, textShadow: "0 4px 24px #000" }}>
        {title}
      </div>
    </div>
  );
};

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const v = VOICES.find((x) => t >= x.start - 0.05 && t < x.start + x.dur + 0.5);
  if (!v) return null;
  const total = v.lines.reduce((a, l) => a + l.length, 0);
  let acc = 0;
  let current = v.lines[0];
  let from = v.start;
  let span = v.dur;
  for (const l of v.lines) {
    const s = v.start + (acc / total) * v.dur;
    const e = v.start + ((acc + l.length) / total) * v.dur;
    if (t >= s) {
      current = l;
      from = s;
      span = e - s;
    }
    acc += l.length;
  }
  const o = interpolate(t, [from, from + 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gone = t > v.start + v.dur + 0.15 ? 0 : 1;
  void span;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 200,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 64,
        fontWeight: 900,
        lineHeight: 1.12,
        color: AMBER,
        textTransform: "uppercase",
        textShadow: "0 4px 18px rgba(0,0,0,.9)",
        opacity: o * gone,
      }}
    >
      {current}
    </div>
  );
};

const Audios: React.FC = () => (
  <>
    <Audio src={staticFile("audio/sfx-wind.mp3")} loop volume={0.28} />
    <Sequence from={Math.round(4.6 * FPS)} durationInFrames={2 * FPS}>
      <Audio src={staticFile("audio/sfx-steps.mp3")} volume={0.7} />
    </Sequence>
    <Sequence from={Math.round(20 * FPS)} durationInFrames={Math.round(9.5 * FPS)}>
      <Audio src={staticFile("audio/sfx-stream.mp3")} loop volume={0.35} />
    </Sequence>
    <Sequence from={Math.round(41.5 * FPS)} durationInFrames={Math.round(20.5 * FPS)}>
      <Audio src={staticFile("audio/sfx-fire.mp3")} loop volume={0.5} />
    </Sequence>
    <Sequence from={Math.round(53 * FPS)} durationInFrames={FPS}>
      <Audio src={staticFile("audio/sfx-owl.mp3")} volume={0.7} />
    </Sequence>
    {SCENES.filter((s) => s.id === "rules" || s.rule).map((s) => (
      <Sequence key={s.id} from={Math.round(s.start * FPS)} durationInFrames={2 * FPS}>
        <Audio src={staticFile("audio/sfx-hit.mp3")} volume={0.55} />
      </Sequence>
    ))}
    {VOICES.map((v) => (
      <Sequence key={v.file} from={Math.round(v.start * FPS)} durationInFrames={Math.ceil((v.dur + 0.3) * FPS)}>
        <Audio src={staticFile(`audio/${v.file}`)} volume={1} />
      </Sequence>
    ))}
  </>
);

export const Survival: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scene = sceneAt(t);
  const local = t - scene.start;
  const fadeIn = interpolate(local, [0, 0.4], [0.0, 1], { extrapolateRight: "clamp" });
  const outFade = interpolate(t, [66.6, 68], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inFade = interpolate(t, [0, 0.8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          width: ART_W,
          height: ART_H,
          opacity: Math.min(inFade, outFade) * (0.6 + 0.4 * fadeIn),
          overflow: "hidden",
        }}
      >
        <World frame={frame} t={t} scene={scene.id} localT={local} />
      </div>
      <Hud t={t} />
      {scene.rule && <RuleTitle num={scene.rule.num} title={scene.rule.title} local={local} />}
      <Subtitle t={t} />
      <Audios />
    </AbsoluteFill>
  );
};
