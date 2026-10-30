import React from "react";
import { cl, lerp, ramp, eio } from "../after/util";

export { cl, lerp, ramp, eio };
export const W = 1920, H = 1080;

/* ───── палитра ───── */
export const C = {
  wall: "#587670", wallD: "#3d544d", wallL: "#6a8a84", floor: "#26302d", ceil: "#1b2423",
  lamp: "#f6cf78", metal: "#6f7f7a", metalD: "#3e4a48", metalL: "#9aaaa4",
  wood: "#8a6a45", woodD: "#5a4430", woodL: "#a8845a",
  red: "#c64a3a", green: "#7fb08a", amber: "#e8a83a", paper: "#e9dfc4", ink: "#1d2321", chalk: "#e8efe8",
  night: "#0f1514", sky: "#8aa4b8",
};
export const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";

/* ───── камера ───── */
export type CamK = { x: number; y: number; z: number };
export const Cam: React.FC<{ a: CamK; b?: CamK; p?: number; children: React.ReactNode }> = ({ a, b, p = 0, children }) => {
  const k = b ? eio(cl(p)) : 0;
  const z = b ? lerp(a.z, b.z, k) : a.z;
  const cx = (v: number) => Math.min(W - W / (2 * z) + 150, Math.max(W / (2 * z) - 150, v)), cy = (v: number) => Math.min(H - H / (2 * z) + 120, Math.max(H / (2 * z) - 120, v));
  const x = cx(b ? lerp(a.x, b.x, k) : a.x), y = cy(b ? lerp(a.y, b.y, k) : a.y);
  return <g transform={`translate(${W / 2},${H / 2}) scale(${z}) translate(${-x},${-y})`}>{children}</g>;
};

/* ───── люди ───── */
export type Look = { skin: string; hair: string; top: string; top2?: string; pants: string; shoes?: string; hairStyle: "short" | "ponytail" | "pigtails" | "messy" | "bald" | "bun" | "long"; beard?: boolean; glasses?: boolean };
export const LOOKS: Record<string, Look> = {
  mark: { skin: "#e3b48a", hair: "#2b2320", top: "#2f4d7e", top2: "#243b61", pants: "#6b6248", shoes: "#2a2522", hairStyle: "short", beard: true },
  elena: { skin: "#f2caa4", hair: "#5a3a2a", top: "#8a4a78", top2: "#6f3a60", pants: "#34384a", shoes: "#3a2a28", hairStyle: "ponytail" },
  lily: { skin: "#f2caa4", hair: "#8a5a32", top: "#e0b13a", top2: "#c8982a", pants: "#3a4a6a", shoes: "#d8d0c0", hairStyle: "pigtails" },
  noah: { skin: "#f2caa4", hair: "#c08a3a", top: "#c4483a", top2: "#a43a2e", pants: "#3a4a6a", shoes: "#d8d0c0", hairStyle: "messy" },
  officer: { skin: "#d9a679", hair: "#1d1a18", top: "#4a5a48", top2: "#3a4a38", pants: "#3a4034", shoes: "#1d1a18", hairStyle: "short" },
  neighbor: { skin: "#c9956a", hair: "#6a6a6a", top: "#7a7f4a", top2: "#646a3a", pants: "#4a4a50", shoes: "#2a2522", hairStyle: "bald", glasses: true },
};

export type Pose = {
  armL?: [number, number]; armR?: [number, number]; // [плечо, локоть], градусы, + = наружу/вверх от тела
  legL?: [number, number]; legR?: [number, number];
  walk?: number; amp?: number; // фаза (рад) и амплитуда ходьбы 0..1
  lean?: number; tilt?: number; look?: number; // look -1..1 взгляд вбок
  expr?: "neutral" | "happy" | "sad" | "worry" | "surprised" | "talk" | "sleep" | "angry" | "cry";
  sit?: number; blink?: boolean; bob?: number; t?: number; rot?: number; lookUp?: number;
  heldL?: React.ReactNode; heldR?: React.ReactNode;
};

const Face: React.FC<{ look: Look; expr: NonNullable<Pose["expr"]>; lk: number; up: number; blink: boolean; talk: number }> = ({ look, expr, lk, up, blink, talk }) => {
  const ex = [-14, 14], ey = -2 + up * -3;
  const open = blink || expr === "sleep" ? 0.12 : expr === "surprised" ? 1.25 : expr === "sad" || expr === "cry" ? 0.8 : 1;
  const brow = (s: number) => {
    const a = expr === "angry" ? 0.35 : expr === "worry" || expr === "sad" || expr === "cry" ? -0.35 : expr === "surprised" ? -0.1 : 0.0;
    const y = expr === "surprised" ? -17 : -13;
    return `M ${s * 14 - 9} ${y - a * 9 * s * -1 - 0} L ${s * 14 + 9} ${y + a * 9 * s * -1}`;
  };
  return (
    <g>
      {ex.map((x, i) => (
        <g key={i} transform={`translate(${x + lk * 4},${ey})`}>
          <ellipse rx={7.5} ry={7.5 * open} fill="#f6f1e6" stroke="#2a2420" strokeWidth={1.5} />
          {open > 0.3 && <circle cx={lk * 3} cy={up * -1.5} r={3.6} fill="#2a2018" />}
          {open > 0.3 && <circle cx={lk * 3 - 1} cy={up * -1.5 - 1.2} r={1.1} fill="#fff" />}
          {expr === "cry" && <ellipse cx={i ? 4 : -4} cy={14} rx={2.4} ry={5} fill="#7ac0e8" />}
        </g>
      ))}
      <path d={brow(-1)} transform={`translate(${lk * 3},0)`} stroke={look.hair === "#c4c4c8" ? "#888" : look.hair} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d={brow(1)} transform={`translate(${lk * 3},0)`} stroke={look.hair === "#c4c4c8" ? "#888" : look.hair} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 0 5 L -2 11 L 2 11" stroke="#00000030" strokeWidth={2} fill="none" transform={`translate(${lk * 5},0)`} />
      <g transform={`translate(${lk * 4},0)`}>
        {expr === "happy" && <path d="M -10 17 Q 0 28 10 17" stroke="#7a2a2a" strokeWidth={3} fill="#fff" strokeLinecap="round" />}
        {expr === "talk" && <ellipse cx={0} cy={20} rx={6 + talk * 2} ry={2 + talk * 6} fill="#6a2222" />}
        {(expr === "neutral" || expr === "sleep") && <path d="M -7 20 Q 0 22 7 20" stroke="#7a2a2a" strokeWidth={3} fill="none" strokeLinecap="round" />}
        {(expr === "sad" || expr === "worry" || expr === "cry") && <path d="M -8 23 Q 0 15 8 23" stroke="#7a2a2a" strokeWidth={3} fill="none" strokeLinecap="round" />}
        {expr === "surprised" && <ellipse cx={0} cy={21} rx={5} ry={7} fill="#6a2222" />}
        {expr === "angry" && <path d="M -9 22 L 9 20" stroke="#7a2a2a" strokeWidth={3.5} strokeLinecap="round" />}
      </g>
    </g>
  );
};

const Hair: React.FC<{ look: Look; r: number }> = ({ look, r }) => {
  const h = look.hair;
  switch (look.hairStyle) {
    case "short": return <path d={`M ${-r} -4 Q ${-r - 2} ${-r - 8} 0 ${-r - 6} Q ${r + 2} ${-r - 8} ${r} -4 Q ${r - 4} ${-r + 4} 0 ${-r + 6} Q ${-r + 4} ${-r + 4} ${-r} -4 Z`} fill={h} />;
    case "messy": return <path d={`M ${-r - 2} 0 Q ${-r - 6} ${-r - 10} ${-r / 2} ${-r - 8} L ${-r / 3} ${-r - 16} L 0 ${-r - 8} L ${r / 3} ${-r - 16} L ${r / 2} ${-r - 8} Q ${r + 6} ${-r - 10} ${r + 2} 0 Q ${r - 6} ${-r + 6} 0 ${-r + 8} Q ${-r + 6} ${-r + 6} ${-r - 2} 0 Z`} fill={h} />;
    case "ponytail": return (<g><path d={`M ${-r - 1} 2 Q ${-r - 4} ${-r - 8} 0 ${-r - 7} Q ${r + 4} ${-r - 8} ${r + 1} 2 Q ${r - 2} ${-r + 2} 0 ${-r + 6} Q ${-r + 2} ${-r + 2} ${-r - 1} 2 Z`} fill={h} /><path d={`M ${r - 2} ${-r + 2} Q ${r + 22} ${-r + 10} ${r + 14} ${r + 18} Q ${r + 8} ${r} ${r - 2} ${-r + 12} Z`} fill={h} /></g>);
    case "pigtails": return (<g><path d={`M ${-r - 1} 2 Q ${-r - 4} ${-r - 8} 0 ${-r - 7} Q ${r + 4} ${-r - 8} ${r + 1} 2 Q ${r - 2} ${-r + 2} 0 ${-r + 6} Q ${-r + 2} ${-r + 2} ${-r - 1} 2 Z`} fill={h} />{[-1, 1].map((s) => <ellipse key={s} cx={s * (r + 8)} cy={r * 0.5} rx={8} ry={16} fill={h} />)}</g>);
    case "bun": return (<g><path d={`M ${-r - 1} 2 Q ${-r - 4} ${-r - 8} 0 ${-r - 7} Q ${r + 4} ${-r - 8} ${r + 1} 2 Q ${r - 2} ${-r + 2} 0 ${-r + 6} Q ${-r + 2} ${-r + 2} ${-r - 1} 2 Z`} fill={h} /><circle cx={0} cy={-r - 10} r={10} fill={h} /></g>);
    case "long": return <path d={`M ${-r - 3} 20 Q ${-r - 8} ${-r - 8} 0 ${-r - 8} Q ${r + 8} ${-r - 8} ${r + 3} 20 L ${r - 2} 30 Q ${r - 6} -4 0 ${-r + 8} Q ${-r + 6} -4 ${-r + 2} 30 Z`} fill={h} />;
    default: return null;
  }
};

/** человек (вид спереди), начало координат — центр между стоп, вверх — отрицательный y */
export type Hat = { kind: "beanie" | "cap" | "ushanka"; c: string };
const HatShape: React.FC<{ h: Hat; r: number }> = ({ h, r }) => (
  <g>
    {h.kind === "beanie" && <g><path d={`M ${-r - 3} -2 Q ${-r - 6} ${-r - 18} 0 ${-r - 16} Q ${r + 6} ${-r - 18} ${r + 3} -2 Z`} fill={h.c} /><rect x={-r - 4} y={-12} width={2 * r + 8} height={14} rx={6} fill={h.c} stroke="#00000033" strokeWidth={2} /><circle cx={0} cy={-r - 18} r={7} fill={h.c} /></g>}
    {h.kind === "cap" && <g><path d={`M ${-r - 2} -4 Q ${-r} ${-r - 14} 0 ${-r - 12} Q ${r} ${-r - 14} ${r + 2} -4 Z`} fill={h.c} /><path d={`M ${-r + 4} -6 L ${r + 26} -2 L ${r + 22} 6 L ${-r + 4} 2 Z`} fill={h.c} stroke="#00000033" strokeWidth={2} /></g>}
    {h.kind === "ushanka" && <g><path d={`M ${-r - 6} 6 Q ${-r - 8} ${-r - 22} 0 ${-r - 20} Q ${r + 8} ${-r - 22} ${r + 6} 6 Z`} fill={h.c} /><rect x={-r - 12} y={-4} width={16} height={46} rx={8} fill={h.c} /><rect x={r - 4} y={-4} width={16} height={46} rx={8} fill={h.c} /><rect x={-r - 6} y={-14} width={2 * r + 12} height={14} rx={7} fill="#00000022" /></g>}
  </g>
);

export const Person: React.FC<{ x: number; y: number; s?: number; flip?: boolean; look: Look; pose?: Pose; hood?: boolean; suit?: boolean; opacity?: number; head?: number; hat?: Hat; pack?: string; mustache?: boolean; apron?: string }> = ({ x, y, s = 1, flip, look, pose = {}, suit, opacity = 1, head = 1, hat, pack, mustache, apron }) => {
  const p = pose;
  const amp = p.amp ?? 0, ph = p.walk ?? 0, sit = p.sit ?? 0, t = p.t ?? 0;
  const sw = Math.sin(ph) * 32 * amp;
  const breathe = Math.sin(t * 2) * 1.2 * (1 - amp);
  const bob = (p.bob ?? Math.abs(Math.cos(ph)) * 5 * amp) + breathe * 0.3;
  const [aLs, aLe] = p.armL ?? [Math.sin(ph) * 28 * amp + 4, 10 + amp * 10];
  const [aRs, aRe] = p.armR ?? [-Math.sin(ph) * 28 * amp + 4, 10 + amp * 10];
  const [lLh, lLk] = p.legL ?? [sw, Math.max(0, Math.sin(ph + 1.4)) * 30 * amp];
  const [lRh, lRk] = p.legR ?? [-sw, Math.max(0, Math.sin(ph + 1.4 + Math.PI)) * 30 * amp];
  const expr = p.expr ?? "neutral";
  const lk = p.look ?? 0;
  const hr = 38 * head;
  const top = suit ? "#d4c35a" : look.top, top2 = suit ? "#b8a840" : look.top2 ?? look.top, pants = suit ? "#cdbd52" : look.pants, skin = look.skin;
  const hipY = -150 + 70 * sit;
  const torsoTop = hipY - 118;
  const talk = (Math.sin(t * 14) + 1) / 2;
  const sk = suit ? "#cdbd52" : skin;
  const Leg: React.FC<{ sx: number; h: number; k: number }> = ({ sx, h, k }) => (
    <g transform={`translate(${sx},${hipY})`}>
      {sit > 0.5 ? (
        <g>
          <line x1={0} y1={0} x2={0} y2={26} stroke={pants} strokeWidth={28} strokeLinecap="round" />
          <line x1={0} y1={26} x2={0} y2={72} stroke={pants} strokeWidth={24} strokeLinecap="round" />
          <ellipse cx={0} cy={78} rx={17} ry={8} fill={look.shoes ?? "#2a2522"} />
        </g>
      ) : (
        <g transform={`rotate(${h})`}>
          <line x1={0} y1={0} x2={0} y2={74} stroke={pants} strokeWidth={28} strokeLinecap="round" />
          <g transform={`translate(0,74) rotate(${-k})`}>
            <line x1={0} y1={0} x2={0} y2={70} stroke={pants} strokeWidth={24} strokeLinecap="round" />
            <ellipse cx={0} cy={76} rx={17} ry={8} fill={look.shoes ?? "#2a2522"} />
          </g>
        </g>
      )}
    </g>
  );
  const Arm: React.FC<{ sx: number; a: number; e: number; side: 1 | -1; held?: React.ReactNode }> = ({ sx, a, e, side, held }) => (
    <g transform={`translate(${sx},${torsoTop + 16}) rotate(${a * side})`}>
      <line x1={0} y1={0} x2={0} y2={62} stroke={top} strokeWidth={24} strokeLinecap="round" />
      <g transform={`translate(0,62) rotate(${e * side})`}>
        <line x1={0} y1={0} x2={0} y2={56} stroke={suit ? "#cdbd52" : sk} strokeWidth={suit ? 22 : 18} strokeLinecap="round" />
        <circle cx={0} cy={60} r={suit ? 12 : 10} fill={suit ? "#2a2a2a" : sk} />
        {held && <g transform="translate(0,62)">{held}</g>}
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${p.rot ?? 0})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={50} ry={9} fill="#00000040" />
      <g transform={`translate(0,${-bob + (sit ? 0 : 0)})`}>
        <Leg sx={-17} h={lLh} k={lLk} />
        <Leg sx={17} h={lRh} k={lRk} />
        <g transform={`rotate(${p.lean ?? 0} 0 ${hipY})`}>
          {pack && <rect x={-50} y={torsoTop + 8} width={100} height={(hipY + 8) - (torsoTop + 8) + 14} rx={16} fill={pack} stroke="#00000044" strokeWidth={3} />}
          <Arm sx={-44} a={aRs} e={aRe} side={1} held={p.heldR} />
          {/* корпус */}
          <path d={`M -38 ${torsoTop + 8} Q -46 ${torsoTop + 4} -44 ${torsoTop + 24} L -38 ${hipY + 8} L 38 ${hipY + 8} L 44 ${torsoTop + 24} Q 46 ${torsoTop + 4} 38 ${torsoTop + 8} Q 0 ${torsoTop - 6} -38 ${torsoTop + 8} Z`} fill={top} />
          <path d={`M -38 ${hipY - 6} L 38 ${hipY - 6} L 38 ${hipY + 8} L -38 ${hipY + 8} Z`} fill={top2} opacity={0.5} />
          <path d={`M -14 ${torsoTop + 2} Q 0 ${torsoTop + 18} 14 ${torsoTop + 2}`} stroke={top2} strokeWidth={4} fill="none" />
          {apron && <path d={`M -30 ${torsoTop + 40} L 30 ${torsoTop + 40} L 36 ${hipY + 40} L -36 ${hipY + 40} Z`} fill={apron} opacity={0.95} />}
          {pack && [-26, 26].map((q) => <line key={q} x1={q} y1={torsoTop + 6} x2={q * 0.9} y2={hipY - 10} stroke={pack} strokeWidth={9} opacity={0.9} />)}
          <Arm sx={44} a={aLs} e={aLe} side={-1} held={p.heldL} />
          {/* шея и голова */}
          <g transform={`translate(0,${torsoTop - 4}) rotate(${p.tilt ?? 0})`}>
            <rect x={-9} y={-14} width={18} height={18} fill={sk} />
            <g transform={`translate(0,${-14 - hr + 2})`}>
              <circle r={hr} fill={sk} />
              <ellipse cx={-hr + 1} cy={2} rx={6} ry={8} fill={sk} /><ellipse cx={hr - 1} cy={2} rx={6} ry={8} fill={sk} />
              {look.beard && <path d={`M ${-hr + 4} 4 Q ${-hr + 6} ${hr + 4} 0 ${hr + 2} Q ${hr - 6} ${hr + 4} ${hr - 4} 4 Q ${hr - 10} 14 0 14 Q ${-hr + 10} 14 ${-hr + 4} 4 Z`} fill={look.hair} opacity={0.85} />}
              {suit ? (
                <g>
                  <circle r={hr + 3} fill="#cdbd52" />
                  <circle cx={0} cy={0} r={hr - 8} fill="#1e2422" />
                  {[-1, 1].map((q) => <circle key={q} cx={q * 15} cy={-2} r={11} fill="#7fb8c8" stroke="#2a2a2a" strokeWidth={4} />)}
                  <rect x={-12} y={14} width={24} height={20} rx={6} fill="#4a4f46" />
                </g>
              ) : (
                <g>
                  <Face look={look} expr={expr} lk={lk} up={p.lookUp ?? 0} blink={!!p.blink} talk={talk} />
                  <Hair look={look} r={hr} />
                  {mustache && <path d="M -17 13 Q -8 6 0 11 Q 8 6 17 13 Q 9 21 0 16 Q -9 21 -17 13 Z" fill="#2a1d14" />}
                  {hat && <g transform="translate(0,-17)"><HatShape h={hat} r={hr} /></g>}
                  {look.glasses && <g stroke="#222" strokeWidth={2.5} fill="none"><circle cx={-14} cy={-2} r={10} /><circle cx={14} cy={-2} r={10} /><line x1={-4} y1={-2} x2={4} y2={-2} /></g>}
                </g>
              )}
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};

/* ───── общие примитивы ───── */
export const Glow: React.FC<{ x: number; y: number; r: number; c?: string; o?: number; id: string }> = ({ x, y, r, c = C.lamp, o = 0.55, id }) => (
  <g>
    <defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

export const Lamp: React.FC<{ x: number; y: number; on?: number; id?: string }> = ({ x, y, on = 1, id = "lamp" }) => (
  <g>
    <line x1={x} y1={0} x2={x} y2={y} stroke="#111" strokeWidth={3} />
    <path d={`M ${x - 26} ${y + 20} Q ${x} ${y - 14} ${x + 26} ${y + 20} Z`} fill="#3d4a3c" />
    <ellipse cx={x} cy={y + 20} rx={26} ry={4} fill={on > 0.2 ? C.lamp : "#555"} />
    <Glow x={x} y={y + 60} r={520} o={0.62 * on} id={id} />
  </g>
);

export const Txt: React.FC<{ x: number; y: number; size?: number; c?: string; w?: number; anchor?: "start" | "middle" | "end"; children: React.ReactNode; ls?: number; o?: number; italic?: boolean }> = ({ x, y, size = 40, c = C.chalk, w = 800, anchor = "middle", children, ls = 0, o = 1, italic }) => (
  <text x={x} y={y} fontSize={size} fontFamily={FONT} fontWeight={w} fill={c} textAnchor={anchor} letterSpacing={ls} opacity={o} fontStyle={italic ? "italic" : undefined}>{children}</text>
);

/** плашка-подпись с анимацией появления */
export const Tag: React.FC<{ x: number; y: number; text: string; p?: number; size?: number; bg?: string; fg?: string }> = ({ x, y, text, p = 1, size = 34, bg = "#10181a", fg = C.chalk }) => {
  const k = eio(cl(p)), w = text.length * size * 0.62 + 40;
  return (
    <g opacity={k} transform={`translate(${x},${y + (1 - k) * 14})`}>
      <rect x={-w / 2} y={-size} width={w} height={size * 1.5} rx={6} fill={bg} opacity={0.88} />
      <rect x={-w / 2} y={size * 0.5 - 3} width={w} height={3} fill={C.amber} opacity={0.9} />
      <Txt x={0} y={0} size={size} c={fg} w={700} ls={1.5}>{text}</Txt>
    </g>
  );
};

/** пыль/частицы: детерминированно */
export const Dust: React.FC<{ t: number; n?: number; c?: string; o?: number; speed?: number; w?: number; h?: number; seed?: number; r?: number }> = ({ t, n = 40, c = "#d8d2b8", o = 0.35, speed = 14, w = W, h = H, seed = 1, r = 2.2 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = Math.sin((i + seed) * 91.7) * 43758.5453, b = Math.sin((i + seed) * 47.3) * 12345.678;
      const rx = a - Math.floor(a), ry = b - Math.floor(b);
      const px = (rx * w + Math.sin(t * 0.6 + i) * 20) % w, py = (ry * h + t * speed * (0.5 + rx)) % h;
      return <circle key={i} cx={px} cy={py} r={r * (0.5 + ry)} fill={c} opacity={o * (0.4 + rx * 0.6)} />;
    })}
  </g>
);

/** виньетка + плёночное зерно */
export const Finish: React.FC<{ t: number; v?: number; tint?: string; grain?: number }> = ({ t, v = 0.7, tint, grain = 0.1 }) => (
  <g pointerEvents="none">
    <defs>
      <radialGradient id="vig"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={v} /></radialGradient>
    </defs>
    {tint && <rect width={W} height={H} fill={tint} opacity={0.12} />}
    <rect width={W} height={H} fill="url(#vig)" />
  </g>
);

export const Grain: React.FC<{ t: number; o?: number }> = ({ t, o = 0.09 }) => {
  const f = Math.floor(t * 12);
  const ox = (f * 97) % 256, oy = (f * 61) % 256;
  return <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/bunker/noise.png)", backgroundSize: "256px 256px", backgroundPosition: `${ox}px ${oy}px`, opacity: o, mixBlendMode: "overlay", pointerEvents: "none" }} />;
};
