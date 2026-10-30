import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { TL, FPS, GOSHA_FRAMES, clean, LINES } from "./tl";
import { SCENES, SCENE_TITLES } from "./scenes";
import { Sub, Hud, Stamp, Pile, Bottle, chunkText, K, lerp, ramp, eio, FONT } from "./art";

export { GOSHA_FRAMES };
export const SHOW_AUDIO = false;

const subAt = (b: (typeof TL.beats)[number], bt: number): { text: string; p: number; custom: boolean } | null => {
  if (!b.line) return { text: b.sub!, p: bt / b.d, custom: true };
  const chunks = chunkText(clean(LINES[b.line].text));
  const w = chunks.map((c) => c.length + 3), tot = w.reduce((a, c) => a + c, 0);
  let acc = 0;
  for (let i = 0; i < chunks.length; i++) {
    const a = (acc / tot) * b.vd, e = ((acc + w[i]) / tot) * b.vd;
    if (bt >= a - 0.03 && (bt < e || i === chunks.length - 1)) return { text: chunks[i], p: (bt - a) / Math.max(0.2, e - a), custom: false };
    acc += w[i];
  }
  return null;
};

export const GoshaEp1: React.FC<{ audio?: boolean }> = ({ audio = false }) => {
  const frame = useCurrentFrame();
  const g = frame / FPS;
  let bi = TL.beats.length - 1;
  for (let i = 0; i < TL.beats.length; i++) if (g < TL.beats[i].t0 + TL.beats[i].d) { bi = i; break; }
  const b = TL.beats[bi], prev = bi > 0 ? TL.beats[bi - 1] : b;
  const bt = g - b.t0, t = g - b.sct0, sct = g;
  const k = eio(ramp(bt, 0, 0.55));
  const sameScene = prev.sc === b.sc;
  const cx = lerp(sameScene ? prev.cx! : b.cx!, b.cx!, k) + Math.sin(g * 0.5) * 6;
  const z = lerp(sameScene ? prev.z! : b.z!, b.z!, k) + bt * 0.004;
  const sc = SCENES[b.sc];
  const sub = subAt(b, bt);
  const popCh = b.money !== b.moneyBefore ? ramp(bt, 0, 0.9) : 1;
  const fadeIn = !sameScene || bi === 0 ? ramp(bt, 0, 0.25) : 1;
  const money = b.moneyBefore + (b.money - b.moneyBefore) * eio(ramp(bt, 0.2, 0.9));
  const sp = b.who ?? "";
  const first = TL.beats.findIndex((x) => x.sc === b.sc) === bi;
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="vig" cx="50%" cy="48%" r="75%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.5} /></radialGradient>
          <linearGradient id="subg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></linearGradient></defs>
        <g transform={`translate(540,990) scale(${z}) translate(${-cx},-990)`}>
          {React.createElement(sc, { t, bt, id: b.id, sp, cx, dur: b.d })}
        </g>
        <rect x={0} y={1150} width={1080} height={770} fill="url(#subg)" />
        <g transform={`translate(${-(cx - 540) * 0.35},0)`}>
          <Pile x={130} y={1870} n={3} s={2.0} seed={b.sc + 3} /><Bottle x={-120} y={1900} s={2.2} r={70} /><Bottle x={1010} y={1880} s={2.0} r={-25} kind="can" /><Bottle x={930} y={1900} s={2.0} r={-60} kind="plastic" /><Bottle x={1150} y={1900} s={2.2} r={25} />
        </g>
        <rect width={1080} height={1920} fill="url(#vig)" />
        <Hud money={money} bottles={b.bottles} pop={popCh} scene={SCENE_TITLES[b.sc]} />
        {sub && <Sub text={sub.text} p={sub.p} custom={sub.custom} />}
        {b.stamp && <Stamp text={b.stamp} p={bt / 0.8} y={420} c={b.sc === 9 ? K.red : K.yellow} />}
        {first && bt < 1.6 && (
          <g transform={`translate(0,${-120 * (1 - eio(ramp(bt, 0, 0.3))) - 120 * eio(ramp(bt, 1.3, 1.6))})`}>
            <rect x={0} y={170} width={620} height={74} rx={4} fill={K.red} /><text x={30} y={222} fontFamily={FONT} fontWeight={900} fontSize={42} fill="#fff" letterSpacing={2}>СЦЕНА {b.sc + 1} · {SCENE_TITLES[b.sc]}</text>
          </g>
        )}
        <rect width={1080} height={1920} fill="#000" opacity={1 - fadeIn} />
        <rect width={1080} height={1920} fill="#000" opacity={ramp(g, TL.total - 0.6, TL.total)} />
      </svg>
      {audio && <Audio src={staticFile("gosha/mix.m4a")} />}
    </AbsoluteFill>
  );
};
