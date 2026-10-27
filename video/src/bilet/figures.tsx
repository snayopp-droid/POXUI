import React from "react";
import { TAU, cl, lerp, mix } from "./core";

/** палитры персонажей */
export const CAST = {
  timur: { jacket: "#2c3440", jacket2: "#3a4554", pants: "#1d2026", shoe: "#d8d4cc", skin: "#c69a7a", hair: "#17130f" },
  mom: { jacket: "#5a4a52", jacket2: "#6c5a62", pants: "#2a2730", shoe: "#2a2422", skin: "#d2a588", hair: "#4a3628" },
  officer: { jacket: "#1f2a3c", jacket2: "#2b3a52", pants: "#1a2030", shoe: "#111", skin: "#a87a5c", hair: "#1a1410" },
  danny: { jacket: "#6e2f25", jacket2: "#874034", pants: "#22252c", shoe: "#e9e6df", skin: "#8f6448", hair: "#140f0c" },
  aram: { jacket: "#e6e0d4", jacket2: "#cfc6b6", pants: "#3a3530", shoe: "#2a2420", skin: "#c99c7e", hair: "#bdb6ad" },
  crowd: { jacket: "#2a2c33", jacket2: "#33363e", pants: "#1c1d22", shoe: "#222", skin: "#9c7a64", hair: "#1a1714" },
};
export type Who = keyof typeof CAST;

export type FigPose = "walk" | "stand" | "sit" | "ride" | "slump";

const limb = (x0: number, y0: number, a1: number, l1: number, a2: number, l2: number) => {
  // a — угол от вертикали вниз (рад), положительный — вперёд
  const x1 = x0 + Math.sin(a1) * l1;
  const y1 = y0 + Math.cos(a1) * l1;
  const x2 = x1 + Math.sin(a1 + a2) * l2;
  const y2 = y1 + Math.cos(a1 + a2) * l2;
  return { x1, y1, x2, y2, d: `M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}` };
};

/**
 * Фигура в профиль (силуэтная, с контровым светом). x,y — точка между стоп, рост ≈ 370·s.
 * face: 1 смотрит вправо. phase — фаза шага (рад). rim — цвет контрового света.
 */
export const Figure: React.FC<{
  x: number;
  y: number;
  s?: number;
  face?: 1 | -1;
  who?: Who;
  pose?: FigPose;
  phase?: number;
  bag?: "backpack" | "courier" | "none" | "handbag";
  hood?: boolean;
  cap?: boolean;
  rim?: string;
  rimO?: number;
  dark?: number;
  headTilt?: number;
  armUp?: number;
  lookUp?: number;
  o?: number;
}> = ({ x, y, s = 1, face = 1, who = "timur", pose = "stand", phase = 0, bag = "none", hood = false, cap = false, rim = "#ffcf94", rimO = 0.8, dark = 0, headTilt = 0, armUp = 0, lookUp = 0, o = 1 }) => {
  const c0 = CAST[who];
  const dk = (c: string) => mix(c, "#07080b", dark);
  const jacket = dk(c0.jacket);
  const jacket2 = dk(c0.jacket2);
  const pants = dk(c0.pants);
  const skin = dk(c0.skin);
  const hair = dk(c0.hair);
  const shoe = dk(c0.shoe);
  const walk = pose === "walk";
  const sit = pose === "sit" || pose === "ride";
  const slump = pose === "slump";
  const bob = walk ? Math.abs(Math.sin(phase)) * 6 : 0;
  const hipY = sit ? -150 : -178 + bob;
  const hipX = 0;
  const shY = hipY - 128 + (slump ? 14 : 0);
  const shX = walk ? 6 : slump ? 14 : 2;
  const headX = shX + 8 + (slump ? 18 : 0);
  const headY = shY - 52 + (slump ? 12 : 0);
  // ноги
  let lA: [number, number], rA: [number, number];
  if (walk) {
    const sw = Math.sin(phase);
    lA = [sw * 0.45, Math.max(0, -Math.cos(phase)) * -0.7 - 0.05];
    rA = [-sw * 0.45, Math.max(0, Math.cos(phase)) * -0.7 - 0.05];
  } else if (sit) {
    lA = [1.45, -1.5];
    rA = [1.35, -1.45];
  } else {
    lA = [0.05, -0.02];
    rA = [-0.06, 0.0];
  }
  const L1 = 92;
  const L2 = 90;
  const legL = limb(hipX + 4, hipY, lA[0], L1, lA[1], L2);
  const legR = limb(hipX - 4, hipY, rA[0], L1, rA[1], L2);
  // руки
  let aL: [number, number], aR: [number, number];
  if (walk) {
    const sw = Math.sin(phase);
    aL = [-sw * 0.4, -0.25];
    aR = [sw * 0.4, -0.25];
  } else if (sit) {
    aL = [0.7, -0.9];
    aR = [0.55, -0.8];
  } else if (slump) {
    aL = [0.35, -0.2];
    aR = [0.25, -0.15];
  } else {
    aL = [0.08, -0.12];
    aR = [-0.05, -0.1];
  }
  if (armUp) aL = [lerp(aL[0], 2.2, armUp), lerp(aL[1], -0.6, armUp)];
  const A1 = 74;
  const A2 = 70;
  const armL = limb(shX + 2, shY + 10, aL[0], A1, aL[1], A2);
  const armR = limb(shX - 2, shY + 10, aR[0], A1, aR[1], A2);
  const tilt = headTilt - lookUp * 18;
  const rimStroke = (w: number) => ({ stroke: rim, strokeWidth: w, strokeOpacity: rimO, fill: "none" as const });
  const torso = `M${hipX - 26} ${hipY + 6} C${hipX - 34} ${hipY - 60} ${shX - 44} ${shY + 30} ${shX - 30} ${shY - 2} Q${shX} ${shY - 16} ${shX + 30} ${shY - 2} C${shX + 40} ${shY + 34} ${hipX + 34} ${hipY - 50} ${hipX + 26} ${hipY + 8} Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s})`} opacity={o}>
      {/* дальняя нога и рука */}
      <path d={legR.d} stroke={mix(pants, "#000", 0.35)} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={legR.x2 + 12} cy={legR.y2 + 2} rx={24} ry={10} fill={mix(shoe, "#000", 0.35)} transform={`rotate(${(lA[0] + lA[1]) * 0} ${legR.x2} ${legR.y2})`} />
      <path d={armR.d} stroke={mix(jacket, "#000", 0.35)} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* рюкзак */}
      {bag === "backpack" && <rect x={shX - 72} y={shY + 4} width={46} height={110} rx={16} fill={mix(jacket, "#101010", 0.5)} />}
      {bag === "courier" && (
        <g>
          <rect x={shX - 112} y={shY - 18} width={86} height={96} rx={6} fill={dk("#2f5c4a")} />
          <rect x={shX - 112} y={shY - 18} width={86} height={14} rx={4} fill={dk("#3b7259")} />
        </g>
      )}
      {/* ближняя нога */}
      <path d={legL.d} stroke={pants} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={legL.x2 + 12} cy={legL.y2 + 2} rx={25} ry={11} fill={shoe} />
      {/* торс */}
      <path d={torso} fill={jacket} />
      <path d={`M${shX - 30} ${shY + 40} Q${shX} ${shY + 50} ${shX + 34} ${shY + 40}`} stroke={jacket2} strokeWidth={4} fill="none" opacity={0.7} />
      <path d={`M${shX - 34} ${shY + 80} Q${shX} ${shY + 92} ${hipX + 34} ${shY + 80}`} stroke={jacket2} strokeWidth={4} fill="none" opacity={0.6} />
      <path d={`M${shX + 30} ${shY - 2} C${shX + 40} ${shY + 34} ${hipX + 34} ${hipY - 50} ${hipX + 26} ${hipY + 8}`} {...rimStroke(3)} />
      {/* голова */}
      <g transform={`translate(${headX} ${headY}) rotate(${tilt})`}>
        <rect x={-10} y={14} width={20} height={26} fill={skin} />
        {hood && <path d="M-40 34 C-52 -10 -36 -52 0 -54 C30 -54 44 -30 40 6 L30 30 Z" fill={mix(jacket, "#000", 0.15)} />}
        <path d="M-26 -8 C-28 -34 -10 -44 6 -42 C24 -40 32 -26 31 -10 L36 2 L31 6 C32 14 28 22 20 24 L-4 26 C-18 24 -26 12 -26 -8 Z" fill={skin} />
        <path d="M31 -10 L36 2 L31 6 C32 14 28 22 20 24" {...rimStroke(2.5)} />
        {!hood && !cap && <path d="M-28 -4 C-34 -30 -14 -50 8 -46 C26 -44 34 -32 30 -20 C18 -26 4 -24 -8 -20 L-14 -2 Z" fill={hair} />}
        {cap && (
          <g>
            <path d="M-28 -12 C-28 -40 -6 -50 10 -48 C28 -46 34 -32 32 -18 Z" fill={dk("#24282f")} />
            <path d="M24 -20 L54 -16 L50 -12 L22 -14 Z" fill={dk("#1a1d22")} />
          </g>
        )}
        {hood && <path d="M-34 30 C-44 -10 -38 -56 2 -58 C32 -58 44 -38 40 -14 L28 -16 C22 -38 -4 -44 -16 -30 C-22 -14 -18 10 -14 30 Z" fill={mix(jacket, "#000", 0.1)} />}
        {who === "mom" && <circle cx={-26} cy={-30} r={12} fill={hair} />}
        <circle cx={18} cy={-8} r={2.6} fill="#1a1210" opacity={0.9} />
      </g>
      {/* ближняя рука */}
      <path d={armL.d} stroke={jacket} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={armL.x2} cy={armL.y2} r={10} fill={skin} />
      {bag === "handbag" && <rect x={armL.x2 - 18} y={armL.y2} width={36} height={30} rx={6} fill={dk("#3a2b22")} />}
    </g>
  );
};

/** силуэт прохожего (дальний план) */
export const Passer: React.FC<{ x: number; y: number; s: number; t: number; speed?: number; face?: 1 | -1; seed?: number; c?: string; o?: number; umbrella?: boolean }> = ({
  x,
  y,
  s,
  t,
  speed = 1.6,
  face = 1,
  seed = 0,
  c = "#15171c",
  o = 1,
  umbrella = false,
}) => {
  const ph = t * speed * TAU * 0.5 + seed * 3;
  const sw = Math.sin(ph) * 0.4;
  const h = 1 + (seed % 3) * 0.06;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s * h})`} opacity={o}>
      <path d={`M0 -180 L${Math.sin(sw) * 90} ${-180 + Math.cos(sw) * 90} L${Math.sin(sw) * 170} 0`} stroke={c} strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d={`M0 -180 L${Math.sin(-sw) * 90} ${-180 + Math.cos(sw) * 90} L${Math.sin(-sw) * 170} 0`} stroke={c} strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d="M-30 -170 C-36 -260 -26 -300 0 -306 C26 -300 38 -260 30 -170 Z" fill={c} />
      <ellipse cx={4} cy={-336} rx={26} ry={30} fill={c} />
      {umbrella && <path d="M-80 -360 Q0 -440 80 -360 Z M0 -360 L0 -300" fill={c} stroke={c} strokeWidth={4} />}
    </g>
  );
};

export type Mood = "neutral" | "smile" | "grin" | "sad" | "tense" | "tears" | "talk" | "tired" | "warm";

/**
 * Крупный план в профиль (смотрит вправо). Голова ≈ 300px при s=1, начало — центр черепа.
 * lit — с какой стороны свет: "front" (лицом к источнику) или "back" (контровой).
 */
export const Profile: React.FC<{
  x: number;
  y: number;
  s?: number;
  face?: 1 | -1;
  who?: Who;
  mood?: Mood;
  blink?: number;
  mouth?: number;
  lit?: "front" | "back";
  light?: string;
  hood?: boolean;
  cap?: boolean;
  headphones?: boolean;
  tear?: number;
  dark?: number;
  tilt?: number;
  look?: number;
  id: string;
}> = ({ x, y, s = 1, face = 1, who = "timur", mood = "neutral", blink = 0, mouth = 0, lit = "front", light = "#cfe0ff", hood = false, cap = false, headphones = false, tear = 0, dark = 0, tilt = 0, look = 0, id }) => {
  const c0 = CAST[who];
  const skin = mix(c0.skin, "#000", dark);
  const skinD = mix(c0.skin, "#000", 0.55 + dark * 0.3);
  const hair = mix(c0.hair, "#000", dark);
  const old = who === "aram" || who === "mom";
  const male = who !== "mom";
  // форма профиля
  const nose = who === "aram" ? 30 : who === "officer" ? 22 : 18;
  const chin = male ? 104 : 96;
  const prof = `M-58 170 C-64 120 -96 80 -100 10 C-104 -70 -58 -128 10 -130 C62 -130 92 -100 98 -52 L102 -30 C104 -22 100 -18 98 -14 C${110 + nose * 0.3} 6 ${114 + nose} 22 ${116 + nose * 0.6} 28 C112 34 104 34 100 36 L104 46 C${100 + mouth * 2} 52 ${100} 56 104 62 C104 70 98 76 96 80 C100 90 ${chin} 98 ${chin - 6} 108 C88 120 70 124 56 128 L60 170 Z`;
  const brow = mood === "sad" || mood === "tears" || mood === "tired" ? "M44 -50 Q62 -58 80 -50" : mood === "tense" ? "M44 -54 Q62 -50 82 -44" : "M44 -54 Q62 -60 82 -52";
  const lid = cl(blink + (mood === "tired" ? 0.35 : 0) + (mood === "sad" ? 0.2 : 0) + (mood === "tears" ? 0.25 : 0));
  const smile = mood === "smile" || mood === "warm" ? 1 : mood === "grin" ? 1.6 : mood === "sad" || mood === "tears" ? -0.8 : 0;
  const gid = `prof-${id}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s}) rotate(${tilt})`}>
      <defs>
        <linearGradient id={gid} x1={lit === "front" ? "0" : "1"} y1="0" x2={lit === "front" ? "1" : "0"} y2="0">
          <stop offset="0%" stopColor={skinD} />
          <stop offset="62%" stopColor={skin} />
          <stop offset="100%" stopColor={mix(skin, light, 0.35)} />
        </linearGradient>
        <clipPath id={`${gid}-c`}>
          <path d={prof} />
        </clipPath>
      </defs>
      {hood && <path d="M-150 220 C-170 80 -150 -120 -40 -170 C40 -196 110 -160 128 -96 C118 -100 104 -104 96 -100 C80 -150 30 -160 -20 -150 C-90 -130 -120 -40 -100 60 L-60 220 Z" fill={mix(CAST[who].jacket, "#000", 0.25 + dark * 0.5)} />}
      <path d={prof} fill={`url(#${gid})`} />
      {/* тени и объём */}
      <g clipPath={`url(#${gid}-c)`}>
        <ellipse cx={-40} cy={30} rx={70} ry={110} fill="#000" opacity={0.22} filter="url(#b-blur30)" />
        {old && <path d="M70 -20 Q84 0 96 4 M60 50 Q74 70 90 74 M40 -70 Q60 -76 84 -72" stroke={skinD} strokeWidth={2.5} fill="none" opacity={0.6} />}
        {who === "aram" && <path d="M96 38 C106 40 112 46 110 52 C100 54 92 52 88 46 Z" fill={hair} />}
        {who === "danny" && <path d="M70 90 Q90 110 96 108 L96 120 Q70 128 56 120 Z" fill={hair} opacity={0.7} />}
      </g>
      {/* волосы */}
      {!hood && !cap && who !== "aram" && who !== "mom" && (
        <path d="M84 -78 C72 -122 20 -146 -40 -132 C-96 -116 -116 -50 -104 20 C-98 60 -80 92 -62 104 C-56 70 -44 40 -40 10 C-34 -14 -20 -34 0 -50 C28 -66 60 -70 84 -78 Z" fill={hair} />
      )}
      {!hood && !cap && who !== "aram" && who !== "mom" && (
        <path d="M84 -78 L96 -60 L82 -66 L88 -50 L72 -62 L70 -70 Z M-6 -48 C-2 -36 4 -24 6 -12 L-2 -12 C-8 -24 -14 -36 -16 -46 Z M-62 104 L-70 118 L-56 108 Z" fill={hair} />
      )}
      {!hood && who !== "mom" && <path d="M-14 -20 C-30 -24 -36 0 -30 18 C-24 30 -10 26 -8 18" fill={skinD} />}
      {who === "aram" && <path d="M-104 30 C-114 -50 -80 -110 -30 -126 C0 -134 30 -132 50 -122 C10 -110 -30 -90 -44 -40 C-48 0 -46 40 -60 90 C-84 80 -100 60 -104 30 Z" fill={hair} />}
      {who === "mom" && (
        <g>
          <path d="M90 -70 C80 -118 30 -144 -30 -136 C-96 -126 -120 -60 -110 20 C-104 70 -86 110 -60 130 C-58 90 -50 50 -44 10 C-36 -24 -16 -48 10 -60 C40 -72 66 -72 90 -70 Z" fill={hair} />
          <circle cx={-112} cy={-60} r={34} fill={hair} />
        </g>
      )}
      {cap && (
        <g>
          <path d="M-104 -20 C-108 -100 -50 -146 20 -142 C70 -140 96 -110 100 -70 L-104 -40 Z" fill={mix("#2a2e36", "#000", dark)} />
          <path d="M88 -76 L168 -64 C170 -58 160 -54 150 -54 L90 -58 Z" fill={mix("#1c1f25", "#000", dark)} />
        </g>
      )}
      {headphones && (
        <g>
          <path d="M-40 -40 C-60 -150 60 -170 80 -100" stroke="#111" strokeWidth={14} fill="none" />
          <ellipse cx={-18} cy={0} rx={30} ry={40} fill="#16171a" />
          <ellipse cx={-14} cy={0} rx={18} ry={28} fill="#26282d" />
        </g>
      )}
      {/* бровь, глаз */}
      <path d={brow} stroke={hair === "#bdb6ad" ? "#8d877f" : mix(hair, "#000", 0.2)} strokeWidth={7} strokeLinecap="round" fill="none" />
      <g>
        <path d={`M56 -26 Q70 -34 86 -26 Q72 -18 56 -26 Z`} fill="#efe8df" opacity={1 - lid} />
        <circle cx={76 + look * 4} cy={-26} r={5.5} fill="#1a1310" opacity={1 - lid} />
        <circle cx={78 + look * 4} cy={-28} r={1.6} fill="#fff" opacity={(1 - lid) * 0.8} />
        <path d={`M54 -28 Q70 ${-36 + lid * 10} 88 -28`} stroke={skinD} strokeWidth={4} fill="none" />
        {lid > 0.05 && <path d={`M54 -28 Q70 ${-36 + lid * 14} 88 -28 L88 -26 Q70 ${-30 + lid * 8} 54 -26 Z`} fill={skin} />}
      </g>
      {/* рот */}
      <path d={`M88 ${50 + mouth * 3} Q96 ${50 - Math.max(0, smile) * 4 + mouth * 2} 102 ${48 - smile * (smile < 0 ? 8 : 3)}`} stroke={mix(skinD, "#3a1a14", 0.4)} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      {mouth > 0.2 && <ellipse cx={98} cy={52} rx={4} ry={mouth * 5} fill="#2a1410" opacity={0.85} />}
      {/* слеза */}
      {tear > 0 && <ellipse cx={70} cy={-10 + tear * 70} rx={3.5} ry={6} fill={light} opacity={0.75 * cl(tear * 3) * (1 - cl((tear - 0.9) * 10))} />}
      {/* контровой */}
      {lit === "back" && <path d={prof} stroke={light} strokeWidth={4} fill="none" opacity={0.7} clipPath={`url(#${gid}-c)`} />}
      {/* шея и плечо */}
      <path d={`M-70 160 C-120 170 -200 200 -230 260 L230 260 C200 210 120 180 70 160 Z`} fill={mix(CAST[who].jacket, "#000", 0.15 + dark * 0.5)} />
      {who === "officer" && <path d="M40 168 L60 230 L80 168 Z" fill="#d8dce4" opacity={0.8} />}
      {who === "aram" && <path d="M-60 170 L-40 260 M60 170 L40 260" stroke="#b9b0a0" strokeWidth={10} />}
    </g>
  );
};
