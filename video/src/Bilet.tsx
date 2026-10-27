import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BOT, Grain, H, SANS, Svg, TOP, W, cl, ramp, type SP } from "./bilet/core";
import { SCENES, DURATION_SEC, FPS, VO_FILE, sceneAt } from "./bilet/timeline";
import { WORDS } from "./wordsB";
import * as SA from "./bilet/scenesA";
import * as SB from "./bilet/scenesB";
import * as SC from "./bilet/scenesC";
import { BiletSound } from "./bilet/sound";

const ALL: Record<string, React.FC<SP>> = { ...SA, ...SB, ...SC } as unknown as Record<string, React.FC<SP>>;
const comp = (id: string): React.FC<SP> => ALL["S" + id[0].toUpperCase() + id.slice(1)] ?? Missing(id);
const Missing = (id: string): React.FC<SP> => {
  const M: React.FC<SP> = () => (
    <Svg>
      <text x={960} y={540} fill="#888" fontSize={60} textAnchor="middle" fontFamily={SANS}>
        {id}
      </text>
    </Svg>
  );
  return M;
};

/** сцены, в которые входим растворением (остальные — монтажный стык) */
const DISSOLVE = new Set(["bridgeWide", "snowMatch", "kitchen", "dreamFace", "momDoor", "dawnLeave", "porthole", "landing", "exit", "fifth", "unease", "hostel", "nightWalk", "windows", "bench", "memory", "voiceMsg", "dawn", "aramTalk", "outro", "endCard", "route", "park", "loss"]);
const XF = 0.6;

/** субтитры: фразы по предложениям, не короче 1.8 c */
type Line = { text: string; a: number; b: number };
const LINES: Line[] = (() => {
  const out: Line[] = [];
  let cur: string[] = [];
  let a = 0;
  let b = 0;
  WORDS.forEach((w, i) => {
    if (!cur.length) a = w[1];
    cur.push(w[0]);
    b = w[2];
    const txt = cur.join(" ");
    const next = WORDS[i + 1];
    const gap = next ? next[1] - w[2] : 9;
    const endSent = /[.!?…»]$/.test(w[0]);
    if ((endSent && txt.length > 14) || txt.length > 52 || gap > 0.6 || !next || (/[,:—]$/.test(w[0]) && txt.length > 34)) {
      out.push({ text: txt, a, b });
      cur = [];
    }
  });
  for (let i = 0; i < out.length; i++) {
    const nextA = i + 1 < out.length ? out[i + 1].a : out[i].b + 3;
    out[i].b = Math.min(Math.max(out[i].b + 0.35, out[i].a + 1.8), nextA - 0.05);
  }
  return out;
})();

const Subs: React.FC<{ t: number }> = ({ t }) => {
  const l = LINES.find((x) => t >= x.a && t <= x.b);
  if (!l) return null;
  const o = cl(ramp(t, l.a, l.a + 0.15)) * (1 - ramp(t, l.b - 0.15, l.b));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: BOT + 18,
        height: H - BOT - 18,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        opacity: o,
      }}
    >
      <div style={{ color: "#efe9dd", fontFamily: SANS, fontSize: 40, letterSpacing: 0.5, textAlign: "center", maxWidth: 1500, lineHeight: 1.25, textShadow: "0 2px 6px #000" }}>
        {l.text.replace(/[«»]/g, (c) => (c === "«" ? "«" : "»"))}
      </div>
    </div>
  );
};

export const SRT_LINES = LINES;

export const Bilet: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { sc, lt, dur, idx } = sceneAt(t);
  const Cur = comp(sc.id);
  const prev = idx > 0 ? SCENES[idx - 1] : null;
  const xf = prev && DISSOLVE.has(sc.id) && lt < XF ? 1 - lt / XF : 0;
  const Prev = prev ? comp(prev.id) : null;
  const pdur = prev ? sc.t0 - prev.t0 : 0;
  const fadeIn = ramp(t, 0, 0.05);
  const fadeOut = 1 - ramp(t, DURATION_SEC - 1.2, DURATION_SEC - 0.1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut, filter: "contrast(1.06) saturate(0.88) sepia(0.06)" }}>
        <Cur t={t} lt={lt} dur={dur} />
        {xf > 0 && Prev && (
          <div style={{ position: "absolute", inset: 0, opacity: xf }}>
            <Prev t={t} lt={pdur + lt} dur={pdur} />
          </div>
        )}
        {/* лёгкая халация и виньетка */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
        <Grain frame={frame} o={0.12} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,180,120,0.025)", mixBlendMode: "soft-light" }} />
      </div>
      {/* каше 2.39:1 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: TOP, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: BOT, height: H - BOT, background: "#000" }} />
      <Subs t={t} />
      <Sequence from={0}>
        <Audio src={staticFile(VO_FILE)} volume={1} />
      </Sequence>
      <BiletSound />
      <div style={{ width: W, display: "none" }} />
    </AbsoluteFill>
  );
};
