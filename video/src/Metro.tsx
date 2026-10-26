import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  CAP_GROUPS, DURATION_SEC, END_V, FPS, OFF, RED_WORDS, SCENES, VO_FILE, YEL_WORDS, sceneAt, type SceneId,
} from "./timeline12";
import { FONT, H, W, cl, easeInOut, easeOut, ramp } from "./MetroArt";
import { SBuzz, SFlood, SPhone, SSign, SSky, SStreet, SWide, type SP } from "./MetroScenes1";
import {
  SAnnounce, SCough, SDark, SDescent, SEnd, SPlatform, SQuiet, SR1, SR2, SR2b, SR3, SR4, SShaft, SStop,
} from "./MetroScenes2";

const COMP: Record<SceneId, React.FC<SP>> = {
  sky: SSky, msign: SSign, street: SStreet, buzz: SBuzz, wide: SWide, phone: SPhone, flood: SFlood,
  r1: SR1, r2: SR2, r2b: SR2b, r3: SR3, quiet: SQuiet, descent: SDescent, platform: SPlatform,
  r4: SR4, announce: SAnnounce, shaft: SShaft, stop: SStop, dark: SDark, cough: SCough, end: SEnd,
};

type Tr = "cut" | "fade" | "whip" | "flash" | "dip";
const TRANS: Record<SceneId, Tr> = {
  sky: "cut", msign: "flash", street: "whip", buzz: "flash", wide: "whip", phone: "whip", flood: "whip",
  r1: "flash", r2: "whip", r2b: "cut", r3: "whip", quiet: "dip", descent: "whip", platform: "fade",
  r4: "flash", announce: "dip", shaft: "whip", stop: "flash", dark: "flash", cough: "cut", end: "dip",
};
const TR_DUR: Record<Tr, number> = { cut: 0, fade: 0.4, whip: 0.28, flash: 0.14, dip: 0.3 };

/* ---------- субтитры: слова всплывают в такт голосу ---------- */
const COL = { y: "#ffd32a", r: "#ff4036" } as const;
const wordCol = (w: string) => {
  const s = w.toLowerCase().replace(/[^а-яёa-z0-9]/g, "");
  if (RED_WORDS.some((r) => s.includes(r))) return COL.r;
  if (YEL_WORDS.some((r) => s.startsWith(r))) return COL.y;
  return null;
};

const Subtitle: React.FC<{ v: number; y: number }> = ({ v, y }) => {
  let gi = -1;
  CAP_GROUPS.forEach((g, i) => {
    if (v >= g.t0 - 0.04) gi = i;
  });
  if (gi < 0) return null;
  const g = CAP_GROUPS[gi];
  if (v > g.t1 + 0.42) return null;
  const out = 1 - ramp(v, g.t1 + 0.25, g.t1 + 0.42);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 38px", fontFamily: FONT, fontWeight: 900, fontSize: 82, lineHeight: 1.1, textTransform: "uppercase", opacity: out }}>
      {g.words.map((w, i) => {
        const a = ramp(v, w.t0 - 0.03, w.t0 + 0.12);
        if (a <= 0) return <span key={i} style={{ opacity: 0 }}>{w.text}</span>;
        const active = v >= w.t0 && v < w.t1 + 0.06;
        const c = wordCol(w.text) ?? (active ? "#fff" : "#fff");
        const sc = 0.72 + 0.28 * easeOut(a) + (active ? 0.05 : 0);
        return (
          <span
            key={i}
            style={{
              display: "inline-block", color: c, opacity: a, transform: `translateY(${(1 - easeOut(a)) * 26}px) scale(${sc})`,
              textShadow: "0 0 2px #000, 4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 0 8px 22px rgba(0,0,0,.85)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Hud: React.FC<{ clock?: string; t: number }> = ({ clock, t }) => {
  if (!clock) return null;
  return (
    <div style={{ position: "absolute", left: 44, top: 64, display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderRadius: 12, fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 800, fontSize: 32, letterSpacing: 3, color: "#ffd23a", background: "rgba(8,10,16,0.72)", border: "2px solid rgba(255,255,255,0.16)" }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: "#ff3b30", opacity: 0.6 + 0.4 * Math.sin(t * 5) }} />
      {clock}
    </div>
  );
};

/* ---------- звук ---------- */
const S = (s: number) => Math.round(s * FPS);
const Sound: React.FC = () => {
  const sfx = (v: number, dur: number, file: string, vol: number, loop = false) => (
    <Sequence from={Math.max(0, S(v + OFF))} durationInFrames={S(dur)}>
      <Audio src={staticFile(`metro/${file}.mp3`)} volume={vol} loop={loop} />
    </Sequence>
  );
  return (
    <>
      <Sequence from={S(OFF)}><Audio src={staticFile(VO_FILE)} volume={1} /></Sequence>
      {sfx(-0.4, 16, "amb", 0.54, true)}
      {sfx(15.6, 16, "amb", 0.3, true)}
      {sfx(31.6, 16, "amb", 0.3, true)}
      {sfx(4.55, 1.2, "whoosh", 0.38)}
      {sfx(5.18, 3, "hit", 0.4)}
      {sfx(6.4, 9.2, "steps", 0.3, true)}
      {sfx(15.7, 2, "vib", 0.14)}
      {sfx(15.75, 2, "vib", 0.08)}
      {sfx(16.85, 4, "alert", 0.2)}
      {sfx(19.1, 4, "alert", 0.12)}
      {sfx(17.2, 12, "siren", 0.2)}
      {sfx(24.0, 10, "crowd", 0.32, true)}
      {sfx(28.4, 3, "hit", 0.36)}
      {sfx(33.15, 3, "hit", 0.36)}
      {sfx(37.0, 1.2, "whoosh", 0.34)}
      {sfx(39.75, 3, "hit", 0.36)}
      {sfx(44.7, 1.2, "whoosh", 0.34)}
      {sfx(47.5, 1.5, "turn", 0.45)}
      {sfx(47.9, 10, "escal", 0.42, true)}
      {sfx(51.3, 3, "chime", 0.3)}
      {sfx(55.0, 3, "hit", 0.5)}
      {sfx(55.2, 8, "riser", 0.22)}
      {sfx(55.2, 40, "heart", 0.28, true)}
      {sfx(60.55, 3, "chime", 0.5)}
      {sfx(62.9, 3, "riser", 0.2)}
      {sfx(64.45, 3, "gate", 0.85)}
      {sfx(65.3, 2, "train", 0.4)}
      {sfx(66.85, 3, "lights", 1)}
      {sfx(67.2, 8, "alarm", 0.12, true)}
      {sfx(70.3, 3, "cough", 0.9)}
      {sfx(70.4, 3, "hit", 0.55)}
      {sfx(71.45, 5, "riser", 0.25)}
    </>
  );
};

export const Metro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const v = t - OFF;
  const vv = Math.max(0, Math.min(END_V - 0.001, v));
  const { sc, idx, local, dur } = sceneAt(vv);
  const Cur = COMP[sc.id];
  const prevScene = idx > 0 ? SCENES[idx - 1] : null;
  const tr = TRANS[sc.id];
  const trd = TR_DUR[tr];
  const inTr = idx > 0 && local < trd;
  const k = trd > 0 ? cl(local / trd) : 1;
  const PrevC = prevScene ? COMP[prevScene.id] : null;
  const prevLt = prevScene ? sc.start - prevScene.start + local : 0;
  const prevDur = prevScene ? sc.start - prevScene.start + 0.5 : 1;

  let curStyle: React.CSSProperties = {};
  let prevStyle: React.CSSProperties = {};
  if (inTr) {
    if (tr === "fade") curStyle = { opacity: easeInOut(k) };
    if (tr === "dip") { curStyle = { opacity: ramp(k, 0.4, 1) }; prevStyle = { opacity: 1 - ramp(k, 0, 0.6) }; }
    if (tr === "whip") {
      const e = easeInOut(k);
      curStyle = { transform: `translateX(${(1 - e) * W * 0.9}px)`, filter: `blur(${(1 - e) * 22}px)` };
      prevStyle = { transform: `translateX(${-e * W * 0.6}px)`, filter: `blur(${e * 22}px)` };
    }
  }
  const flash = tr === "flash" && inTr ? (1 - k) * 0.85 : 0;

  const fadeStart = ramp(t, 0, 0.35);
  const fadeEnd = 1 - ramp(t, DURATION_SEC - 0.5, DURATION_SEC);
  const capY = sc.cap ?? 1540;
  const hideCap = sc.id === "end";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(fadeStart, fadeEnd), overflow: "hidden", filter: "contrast(1.07) saturate(1.1)" }}>
        {inTr && PrevC && (
          <div style={{ position: "absolute", inset: 0, ...prevStyle }}>
            <PrevC lt={prevLt} dur={prevDur} t={t} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, ...curStyle }}>
          <Cur lt={local} dur={dur} t={t} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash, pointerEvents: "none" }} />
        <Hud clock={sc.clock} t={t} />
        {!hideCap && <Subtitle v={v} y={capY} />}
        <div style={{ position: "absolute", inset: 0, width: W, height: H, pointerEvents: "none", background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.45) 100%)" }} />
      </div>
      <Sound />
    </AbsoluteFill>
  );
};
