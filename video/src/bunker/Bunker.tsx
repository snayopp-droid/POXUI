import React from "react";
import { AbsoluteFill, useCurrentFrame, staticFile } from "remotion";
import { W, H, C, Txt, Dust, FONT, cl, ramp, eio } from "./art";
import { buildTimeline, CARDS, CARDS_AFTER, type Seg } from "./timeline";
import script from "./script.json";
import { chunksA } from "./scenes_a";
import { chunksB } from "./scenes_b";
import { chunksC } from "./scenes_c";
import type { Chunk } from "./kit";

export const FPS = 30;
const TL = buildTimeline();
export const BUNKER_FRAMES = Math.ceil(TL.total * FPS);
export { TL };

const CHUNKS: Record<string, Chunk> = {};
[...chunksA, ...chunksB, ...chunksC].forEach((c) => (CHUNKS[c.id] = c));
const TEXT: Record<string, string> = {};
(script as { id: string; text: string }[]).forEach((c) => (TEXT[c.id] = c.text.replace(/^\[[^\]]*\]\s*/, "")));
const GAP = 1.8;

/** субтитры: предложения, время пропорционально числу символов */
const subtitleAt = (id: string, t: number, d: number): string => {
  const sents = TEXT[id].split(/(?<=[.?!:])\s+/);
  const lens = sents.map((s) => s.length + 8);
  const tot = lens.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < sents.length; i++) {
    const a = (acc / tot) * d, b = ((acc + lens[i]) / tot) * d;
    if (t < b || i === sents.length - 1) return t >= a - 0.05 ? sents[i] : "";
    acc += lens[i];
  }
  return "";
};

const Card: React.FC<{ id: string; t: number; d: number }> = ({ id, t, d }) => {
  const c = CARDS[id] ?? CARDS_AFTER[id.replace("_after", "")];
  const a = eio(ramp(t, 0, 0.5)) * (1 - ramp(t, d - 0.5, d));
  const big = id.endsWith("_after");
  return (
    <g>
      <rect width={W} height={H} fill="#0b100f" />
      <Dust t={t} n={60} c="#c8c8b8" o={0.25} speed={20} seed={11} />
      <g opacity={a} transform={`translate(0,${(1 - a) * 20})`}>
        <rect x={W / 2 - 260} y={H / 2 - (big ? 130 : 80)} width={520} height={4} fill={C.amber} />
        <Txt x={W / 2} y={H / 2 + (big ? 10 : 40)} size={big ? 132 : 112} c={C.chalk} w={900} ls={6}>{c.title}</Txt>
        {c.sub && <Txt x={W / 2} y={H / 2 + (big ? 90 : 100)} size={big ? 40 : 38} c={C.amber} w={700} ls={9}>{c.sub}</Txt>}
        <rect x={W / 2 - 260} y={H / 2 + (big ? 130 : 130)} width={520} height={4} fill={C.amber} />
      </g>
    </g>
  );
};

export const frameBody = (T: number): { body: React.ReactNode; sub: string; seg: Seg } => {
  const seg: Seg = TL.segs.find((s) => T >= s.t0 && T < s.t0 + (s.kind === "chunk" ? s.d + GAP : s.d)) ?? TL.segs[TL.segs.length - 1];
  const t = T - seg.t0;
  let body: React.ReactNode = null, sub = "";
  if (seg.kind === "card") body = <Card id={seg.id} t={t} d={seg.d} />;
  else {
    const ch = CHUNKS[seg.id];
    const dd = seg.d + GAP;
    const ws = ch.beats.map((b) => b.w), tw = ws.reduce((a, b) => a + b, 0);
    let acc = 0, bi = 0, bt0 = 0, bd = dd;
    for (let i = 0; i < ch.beats.length; i++) {
      const a = (acc / tw) * dd, b = ((acc + ws[i]) / tw) * dd;
      if (t < b || i === ch.beats.length - 1) { bi = i; bt0 = a; bd = b - a; break; }
      acc += ws[i];
    }
    const lt = t - bt0;
    const pp = cl(lt / bd), dz = 1 + 0.045 * pp;
    body = <g transform={`translate(${W / 2},${H / 2}) scale(${dz}) translate(${-W / 2},${-H / 2})`}>{ch.beats[bi].r({ t: lt, d: bd, p: pp, T })}</g>;
    sub = t < seg.d ? subtitleAt(seg.id, t, seg.d) : "";
  }
  return { body, sub, seg };
};

export const BunkerVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const { body, sub } = frameBody(T);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="vg"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.5} /></radialGradient></defs>
        {body}
        <rect width={W} height={H} fill="url(#vg)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("bunker/noise.png")})`, backgroundSize: "256px 256px", backgroundPosition: `${(Math.floor(T * 12) * 97) % 256}px ${(Math.floor(T * 12) * 61) % 256}px`, opacity: 0.1, mixBlendMode: "overlay" }} />
      {sub && (
        <div style={{ position: "absolute", left: 160, right: 160, bottom: 56, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 42, lineHeight: 1.25, color: "#fff", textShadow: "0 3px 0 rgba(0,0,0,0.7), 0 0 18px rgba(0,0,0,0.9)" }}>{sub}</div>
      )}
    </AbsoluteFill>
  );
};

/** вертикальная нарезка 9:16: квадрат из центра кадра + размытый фон + крупные субтитры по фразам */
export const SHORT_T0 = 722.15, SHORT_LEN = 33.4;
export const BUNKER_SHORT_FRAMES = Math.ceil(SHORT_LEN * FPS);
const phrases = (sent: string) => {
  const w = sent.split(" "), out: string[] = [];
  for (let i = 0; i < w.length; i += 5) out.push(w.slice(i, i + 5).join(" "));
  return out;
};
export const BunkerShort: React.FC = () => {
  const frame = useCurrentFrame();
  const T = SHORT_T0 + frame / FPS;
  const { body, sub, seg } = frameBody(T);
  const t = T - seg.t0;
  const ph = sub ? phrases(sub) : [];
  const idx = ph.length ? Math.min(ph.length - 1, Math.floor(((t * 3.1) % 1000) * 0)) : 0;
  void idx;
  // фраза: внутри предложения равномерно по длине текста
  let line = "";
  if (sub) {
    const sents = TEXT[seg.id].split(/(?<=[.?!:])\s+/);
    const lens = sents.map((x) => x.length + 8), tot = lens.reduce((a, b) => a + b, 0);
    let acc = 0;
    for (let i = 0; i < sents.length; i++) {
      const a0 = (acc / tot) * seg.d, b0 = ((acc + lens[i]) / tot) * seg.d;
      if (t < b0 || i === sents.length - 1) {
        const pp = phrases(sents[i]);
        line = pp[Math.min(pp.length - 1, Math.floor(cl((t - a0) / Math.max(0.1, b0 - a0)) * pp.length))] ?? "";
        break;
      }
      acc += lens[i];
    }
  }
  const content = (blur: boolean) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
      {body}
      {!blur && <rect width={W} height={H} fill="none" />}
    </svg>
  );
  const fadeIn = cl(frame / 12), fadeOut = 1 - cl((frame - (BUNKER_SHORT_FRAMES - 15)) / 15);
  return (
    <AbsoluteFill style={{ background: "#06090a" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "hidden", filter: "blur(36px) brightness(0.6)", transform: "scale(1.05)" }}>
        <div style={{ position: "absolute", left: -(1920 * 1.78 - 1080) / 2, top: 0, width: W, height: H, transform: "scale(1.78)", transformOrigin: "0 0" }}>{content(true)}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 380, width: 1080, height: 1080, overflow: "hidden", boxShadow: "0 0 80px rgba(0,0,0,0.7)" }}>
        <div style={{ position: "absolute", left: -420, top: 0, width: W, height: H }}>{content(false)}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, backgroundImage: `url(${staticFile("bunker/noise.png")})`, backgroundSize: "256px 256px", backgroundPosition: `${(Math.floor(T * 12) * 97) % 256}px ${(Math.floor(T * 12) * 61) % 256}px`, opacity: 0.08, mixBlendMode: "overlay" }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 4, color: "#f0b840", textShadow: "0 4px 0 rgba(0,0,0,0.6)" }}>12 YEARS UNDERGROUND</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 240, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 36, letterSpacing: 8, color: "#9ab0a6" }}>YEAR 12 · THE HATCH</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 1530, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 78, lineHeight: 1.15, color: "#fff", textShadow: "0 5px 0 rgba(0,0,0,0.75), 0 0 24px rgba(0,0,0,0.9)", minHeight: 200 }}>{line}</div>
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(1 - fadeIn, 1 - fadeOut) }} />
    </AbsoluteFill>
  );
};
