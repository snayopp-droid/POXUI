import React from "react";
import { C, W, H, Txt, Tag, Person, LOOKS, Cam, cl, lerp, ramp, eio, type Pose, type Look } from "./art";

export type BC = { t: number; d: number; p: number; T: number };
export type Beat = { w: number; r: (c: BC) => React.ReactNode };
export type Chunk = { id: string; beats: Beat[] };

export const L = LOOKS;
export const walk = (t: number, speed = 1, amp = 1): Pose => ({ walk: t * 7 * speed, amp, t });
export const idle = (t: number, o: Pose = {}): Pose => ({ t, ...o });
export const blinkAt = (t: number) => t % 3.1 > 3.0;
export const mix = (a: number, b: number, p: number) => lerp(a, b, eio(cl(p)));

/** семья: рост/пропорции по возрасту */
export const AGE = { lily: (y: number) => lerp(0.6, 0.95, cl((y - 7) / 8)), noah: (y: number) => lerp(0.42, 0.95, cl((y - 3) / 12)) };

/** простое полноэкранное затемнение/просветление */
export const Fade: React.FC<{ o: number; c?: string }> = ({ o, c = "#000" }) => <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={c} opacity={o} />;

/** текст-«титр» слева/по центру с появлением */
export const Big: React.FC<{ x: number; y: number; text: string; t: number; t0: number; size?: number; c?: string; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, t, t0, size = 110, c = C.chalk, anchor = "start" }) => {
  const k = eio(ramp(t, t0, t0 + 0.4));
  return <g opacity={k} transform={`translate(0,${(1 - k) * 24})`}><Txt x={x} y={y} size={size} c={c} w={900} anchor={anchor} ls={3}>{text}</Txt></g>;
};

export const SceneBG: React.FC<{ c?: string; children?: React.ReactNode }> = ({ c = "#0f1514", children }) => (
  <g><rect x={-200} y={-200} width={W + 400} height={H + 400} fill={c} />{children}</g>
);

/** значок-иконка в круге */
export const Icon: React.FC<{ x: number; y: number; kind: "eye" | "phone" | "camera" | "door" | "water" | "food" | "air" | "radio" | "book" | "bolt" | "heart" | "clock" | "wrench" | "people" | "geiger"; r?: number; c?: string; bg?: string; cross?: boolean }> = ({ x, y, kind, r = 70, c = C.chalk, bg = "#1c2826", cross }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill={bg} stroke={cross ? C.red : C.amber} strokeWidth={6} />
    <g transform={`scale(${r / 70})`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {kind === "eye" && <g><path d="M -34 0 Q 0 -30 34 0 Q 0 30 -34 0 Z" /><circle r={9} fill={c} /></g>}
      {kind === "phone" && <g><rect x={-16} y={-32} width={32} height={64} rx={6} /><line x1={-6} y1={22} x2={6} y2={22} /></g>}
      {kind === "camera" && <g><rect x={-32} y={-16} width={64} height={42} rx={6} /><circle cy={5} r={13} /><path d="M -14 -16 l 6 -10 h 16 l 6 10" /></g>}
      {kind === "door" && <g><rect x={-22} y={-34} width={44} height={68} /><circle cx={12} cy={2} r={3} fill={c} /></g>}
      {kind === "water" && <path d="M 0 -34 Q 26 0 22 14 Q 18 32 0 32 Q -18 32 -22 14 Q -26 0 0 -34 Z" />}
      {kind === "food" && <g><rect x={-22} y={-24} width={44} height={50} rx={4} /><line x1={-22} y1={-8} x2={22} y2={-8} /><line x1={-22} y1={10} x2={22} y2={10} /></g>}
      {kind === "air" && <g><path d="M -34 -12 H 14 a 10 10 0 1 0 -10 -10" /><path d="M -34 6 H 30 a 10 10 0 1 1 -10 10" /></g>}
      {kind === "radio" && <g><rect x={-34} y={-18} width={68} height={42} rx={5} /><line x1={14} y1={-18} x2={30} y2={-38} /><circle cx={-14} cy={4} r={8} /></g>}
      {kind === "book" && <g><path d="M -34 -26 H 0 V 28 H -34 Z M 0 -26 H 34 V 28 H 0" /></g>}
      {kind === "bolt" && <path d="M 8 -36 L -22 6 H -2 L -8 36 L 22 -8 H 2 Z" />}
      {kind === "heart" && <path d="M 0 30 Q -40 4 -30 -18 Q -18 -34 0 -14 Q 18 -34 30 -18 Q 40 4 0 30 Z" />}
      {kind === "clock" && <g><circle r={32} /><line x1={0} y1={0} x2={0} y2={-20} /><line x1={0} y1={0} x2={14} y2={8} /></g>}
      {kind === "wrench" && <path d="M -26 26 L 10 -10 a 16 16 0 1 1 8 8 L -18 34 Z" />}
      {kind === "people" && <g><circle cx={-14} cy={-14} r={11} /><circle cx={14} cy={-14} r={11} /><path d="M -34 30 Q -34 8 -14 8 Q 0 8 0 18 Q 0 8 14 8 Q 34 8 34 30" /></g>}
      {kind === "geiger" && <g><rect x={-30} y={-30} width={60} height={60} rx={8} /><path d="M -16 8 A 16 16 0 0 1 16 8" /><line x1={0} y1={8} x2={10} y2={-8} /></g>}
      {cross && <line x1={-40} y1={40} x2={40} y2={-40} stroke={C.red} strokeWidth={8} />}
    </g>
  </g>
);

export const RuleCard: React.FC<{ n: number; title: string; lines?: string[]; icon: React.ComponentProps<typeof Icon>["kind"]; p: number; x?: number; y?: number; w?: number }> = ({ n, title, lines = [], icon, p, x = 960, y = 540, w = 1100 }) => {
  const k = eio(ramp(p, 0, 0.25));
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40}) scale(${0.94 + 0.06 * k})`} opacity={k}>
      <rect x={-w / 2} y={-200} width={w} height={400} rx={18} fill="#14201d" stroke={C.amber} strokeWidth={4} />
      <rect x={-w / 2} y={-200} width={14} height={400} rx={7} fill={C.amber} />
      <Txt x={-w / 2 + 70} y={-100} size={46} c={C.amber} w={900} anchor="start" ls={6}>{n > 0 ? `RULE ${n}` : "KEY LESSON"}</Txt>
      <Txt x={-w / 2 + 70} y={-26} size={Math.max(40, Math.min(72, 790 / (title.length * 0.76)))} c={C.chalk} w={900} anchor="start">{title}</Txt>
      {lines.map((l, i) => <Txt key={i} x={-w / 2 + 70} y={50 + i * 46} size={34} c="#b8c8c0" w={600} anchor="start" o={ramp(p, 0.25 + i * 0.12, 0.45 + i * 0.12)}>{l}</Txt>)}
      <Icon x={w / 2 - 130} y={0} kind={icon} r={90} />
    </g>
  );
};

export { Cam, Person, Tag, Txt, C, W, H, cl, lerp, ramp, eio };
export type { Pose, Look };
