import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { H, W, cl, eio, eout, lerp, ramp, rnd } from "./cel";
import { Bokeh, Defs80, MiniHero, Plate, Rain } from "./bg";
import { BANGS, Bust, FACE, HAIR_BACK, Head, HeadSil, LOCK_L, LOCK_R, NECK, SHOULDERS } from "./head";

export const A80_FRAMES = 120;
const F = (n: number) => n;

/** кадры: 0–30 кран по пластине, 30–72 держанный план, 72–86 глаза, 86–88 кадр-удар, 88–120 титр */
const S2 = 30;
const S3 = 72;
const S4 = 86;
const S5 = 88;

const SANS = "'Inter', 'Liberation Sans', sans-serif";

/* ───── 1. кран вниз по высокой пластине → маленький герой в большом мире ───── */
const Shot1: React.FC<{ f: number; f2: number }> = ({ f, f2 }) => {
  const k = eout(f / 30);
  const camY = lerp(430, 1020, k);
  const step = Math.floor(f2 / 2) % 4;
  return (
    <g>
      <Plate camY={camY} camEnd={1020} camX={lerp(40, 0, k)} hero={<MiniHero x={1290} y={1968} s={1.25} step={[0, 0.7, 0, -0.7][step]} />} />
      <Rain f={f} n={140} o={0.5} />
    </g>
  );
};

/* ───── 2. держанный план: бюст, свет едущей машины бежит полосой по залитому цветом целлу ───── */
const Shot2: React.FC<{ f: number; f2: number; f3: number }> = ({ f, f2, f3 }) => {
  const lf = f - S2;
  const push = 1 + lf * 0.0016;
  const swing = [0, 1.6, 0, -1.6][Math.floor(f3 / 3) % 4];
  const breath = [0, 1.5, 3, 1.5][Math.floor(f2 / 4) % 4];
  // моргание: рисунки на тройках (8 кадров/с)
  const blinkAt = 34;
  const open = lf >= blinkAt && lf < blinkAt + 3 ? [0.5, 0.05, 0.5][lf - blinkAt] : 1;
  const bandX = lerp(2300, -700, ramp(lf, 8, 28));
  return (
    <g>
      <Bokeh f={f} />
      <g transform={`translate(960 540) scale(${push}) translate(-960 -540)`}>
        <g transform="translate(1000 340)">
          <Bust id="s2" s={1.5} y={0} breath={breath} />
          <Head id="s2h" s={1.5} open={open} swing={swing} look={0.55} mouth="set" brow={0.2} />
        </g>
        {/* полоса света: заливает только силуэт целла (source-atop) */}
        <clipPath id="a80sil">
          {[HAIR_BACK, FACE, NECK, BANGS, LOCK_L, LOCK_R, SHOULDERS].map((d, i) => (
            <path key={i} d={d} transform="translate(1000 340) scale(1.5)" />
          ))}
        </clipPath>
        <g clipPath="url(#a80sil)" style={{ mixBlendMode: "screen" }}>
          <g transform={`translate(${bandX} 0) skewX(-18)`}>
            <rect x={-60} y={-100} width={130} height={1400} fill="#ff4fb8" opacity={0.7} />
            <rect x={70} y={-100} width={70} height={1400} fill="#ffffff" opacity={0.75} />
            <rect x={140} y={-100} width={110} height={1400} fill="#58e8ff" opacity={0.65} />
          </g>
        </g>
      </g>
      <Rain f={f} n={150} o={0.55} />
    </g>
  );
};

/* ───── 3. сверхкрупно глаза: решимость ───── */
const Shot3: React.FC<{ f: number; f3: number }> = ({ f, f3 }) => {
  const lf = f - S3;
  const decide = eio(lf / 10);
  const blinkAt = 8;
  const open = lf >= blinkAt && lf < blinkAt + 3 ? [0.5, 0.05, 0.55][lf - blinkAt] : 1;
  const s = 5 + lf * 0.03;
  return (
    <g>
      <defs>
        <linearGradient id="a80s3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#120c40" />
          <stop offset="1" stopColor="#7a2290" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#a80s3)" />
      <g style={{ mixBlendMode: "screen" }} opacity={0.6} filter="url(#a80blur40)">
        <ellipse cx={1500} cy={300} rx={420} ry={160} fill="#ff4fb8" />
      </g>
      <Head id="s3" x={960 - 14 * s} y={540 + 4 * s} s={s} open={open} squeeze={lerp(1.15, 0.75, decide)} brow={lerp(0, 1, decide)} lwk={0.5} swing={[0, 0.8, 0, -0.8][Math.floor(f3 / 3) % 4]} look={0.5} mouth="set" rim />
      {/* ползущий блик на радужке — «двигаем свет, а не рисунки» */}
      <Rain f={f} n={50} o={0.18} />
    </g>
  );
};

/* ───── 4. кадр-удар: 2 кадра — монохромный силуэт поверх радиальных линий ───── */
const Impact: React.FC<{ n: number }> = ({ n }) => {
  const inv = n === 0;
  const bg = inv ? "#fff" : "#000";
  const fg = inv ? "#000" : "#fff";
  return (
    <g>
      <rect width={W} height={H} fill={bg} />
      {Array.from({ length: 90 }, (_, i) => {
        const a = (i / 90) * Math.PI * 2 + rnd(i) * 0.05;
        const r0 = 150 + rnd(i * 3) * 220;
        const w = 0.012 + rnd(i * 7) * 0.03;
        return (
          <path key={i} d={`M ${960 + Math.cos(a - w) * 1800} ${540 + Math.sin(a - w) * 1800} L ${960 + Math.cos(a) * r0} ${540 + Math.sin(a) * r0} L ${960 + Math.cos(a + w) * 1800} ${540 + Math.sin(a + w) * 1800} Z`} fill={fg} />
        );
      })}
      <HeadSil x={960 - 14 * 3.4} y={560} s={3.4} fill={inv ? "#000" : "#000"} />
      {!inv && <g transform={`translate(${960 - 14 * 3.4} 560) scale(3.4)`}><path d={FACE} fill="none" stroke="#fff" strokeWidth={2.4} /></g>}
    </g>
  );
};

/* ───── 5. титр: хромированные курсивные буквы, подсветка сквозь целл, развёртка света и звезда ───── */
const Title: React.FC<{ f: number }> = ({ f }) => {
  const lf = f - S5;
  const flick = lf < 2 ? 0 : [0, 0, 0, 1, 0, 1, 1, 0, 1][Math.min(8, Math.floor(lf / 2))] ?? 1;
  const on = lf >= 18 ? 1 : flick;
  const sweep = ramp(lf, 8, 24);
  const star = Math.sin(ramp(lf, 22, 31) * Math.PI);
  const push = 1 + lf * 0.0012;
  const T = (props: { y: number; size: number; sp: number; text: string; clip?: boolean }) => (
    <text x={960} y={props.y} fontFamily={SANS} fontWeight={900} fontStyle="italic" fontSize={props.size} textAnchor="middle" letterSpacing={props.sp} fill={props.clip ? "#fff" : "url(#a80chrome)"} stroke={props.clip ? "none" : "#1a0a4a"} strokeWidth={props.clip ? 0 : 12} paintOrder="stroke">
      {props.text}
    </text>
  );
  return (
    <g>
      <g transform={`translate(960 540) scale(${push}) translate(-960 -540)`}>
        <Plate camY={1020} camX={lf * 1.5} wet />
      </g>
      <rect width={W} height={H} fill="#07031c" opacity={0.55} />
      <defs>
        <linearGradient id="a80chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd6ff" />
          <stop offset="0.48" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#3a1a8a" />
          <stop offset="0.7" stopColor="#ff4fb8" />
          <stop offset="1" stopColor="#ffd36b" />
        </linearGradient>
        <clipPath id="a80tc">
          <text x={960} y={500} fontFamily={SANS} fontWeight={900} fontStyle="italic" fontSize={250} textAnchor="middle" letterSpacing={6}>
            ONE WAY
          </text>
          <text x={960} y={650} fontFamily={SANS} fontWeight={900} fontStyle="italic" fontSize={130} textAnchor="middle" letterSpacing={44}>
            TICKET
          </text>
        </clipPath>
      </defs>
      <g opacity={on}>
        {/* подсветка сквозь целл: размытая копия + неоновая обводка */}
        <g filter="url(#a80bloom)" style={{ mixBlendMode: "screen" }} opacity={0.9}>
          <text x={960} y={500} fontFamily={SANS} fontWeight={900} fontStyle="italic" fontSize={250} textAnchor="middle" letterSpacing={6} fill="none" stroke="#ff4fb8" strokeWidth={14}>
            ONE WAY
          </text>
          <text x={960} y={650} fontFamily={SANS} fontWeight={900} fontStyle="italic" fontSize={130} textAnchor="middle" letterSpacing={44} fill="none" stroke="#58e8ff" strokeWidth={10}>
            TICKET
          </text>
        </g>
        {T({ y: 500, size: 250, sp: 6, text: "ONE WAY" })}
        {T({ y: 650, size: 130, sp: 44, text: "TICKET" })}
        <text x={960} y={730} fontFamily={SANS} fontWeight={700} fontSize={34} textAnchor="middle" letterSpacing={14} fill="#ffe9a8">
          EPISODE 01
        </text>
        {/* полоса света по буквам */}
        <g clipPath="url(#a80tc)" style={{ mixBlendMode: "screen" }}>
          <g transform={`translate(${lerp(-500, 2200, sweep)} 0) skewX(-20)`}>
            <rect x={0} y={200} width={90} height={600} fill="#fff" opacity={0.9} />
            <rect x={90} y={200} width={50} height={600} fill="#58e8ff" opacity={0.6} />
          </g>
        </g>
        {/* звезда-блик */}
        <g transform={`translate(1480 360) scale(${star * 1.2})`} style={{ mixBlendMode: "screen" }}>
          <path d="M 0 -90 L 10 -10 L 90 0 L 10 10 L 0 90 L -10 10 L -90 0 L -10 -10 Z" fill="#fff" />
        </g>
      </g>
    </g>
  );
};

/* ───── пост: лента + ЭЛТ (детерминированно) ───── */
const ChromaDef: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="a80chroma" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feGaussianBlur in="r" stdDeviation="2.4 0" result="rb" />
        <feOffset in="rb" dx="3" result="ro" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feGaussianBlur in="b" stdDeviation="2.4 0" result="bb" />
        <feOffset in="bb" dx="-3" result="bo" />
        <feBlend in="ro" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="bo" mode="screen" />
      </filter>
      <filter id="a80noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={3} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
  </svg>
);

const CRT: React.FC<{ f: number }> = ({ f }) => {
  const trackF = [84, 85, 86, 89];
  const tracking = trackF.includes(f);
  const bandY = ((f * 313) % 900) + 60;
  return (
    <>
      {/* строки развёртки, привязанные к выходным пикселям */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.20) 0px, rgba(0,0,0,0.20) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)", mixBlendMode: "multiply", pointerEvents: "none" }} />
      {/* еле заметная RGB-решётка */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to right, rgba(255,0,0,0.035) 0px, rgba(255,0,0,0.035) 1px, rgba(0,255,0,0.035) 1px, rgba(0,255,0,0.035) 2px, rgba(0,0,255,0.035) 2px, rgba(0,0,255,0.035) 3px)", pointerEvents: "none" }} />
      {/* шум сигнала */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.1, pointerEvents: "none" }}>
        <rect width={W} height={H} filter="url(#a80noise)" transform={`translate(${(f * 37) % 90} ${(f * 53) % 70})`} />
      </svg>
      {/* затемнённые углы без изогнутых краёв */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      {tracking && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: bandY, height: 70, background: "linear-gradient(rgba(255,255,255,0.0), rgba(255,255,255,0.35), rgba(255,255,255,0))", mixBlendMode: "screen" }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.45, mixBlendMode: "screen" }}>
            <rect y={bandY + 10} width={W} height={46} filter="url(#a80noise)" />
          </svg>
        </>
      )}
    </>
  );
};

const PowerOn: React.FC<{ f: number }> = ({ f }) => {
  if (f > 3) return null;
  if (f === 0) return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: W / 2 - 6, top: H / 2 - 6, width: 12, height: 12, borderRadius: 6, background: "#fff", boxShadow: "0 0 30px 12px #9fd8ff" }} />
    </AbsoluteFill>
  );
  if (f === 1) return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 - 3, height: 6, background: "#fff", boxShadow: "0 0 40px 10px #9fd8ff" }} />
    </AbsoluteFill>
  );
  const k = f === 2 ? 0.35 : 0.8;
  const bar = ((1 - k) / 2) * H;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bar, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: bar, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: bar, bottom: bar, background: "#fff", opacity: f === 2 ? 0.5 : 0.18 }} />
    </>
  );
};

const SUB = { a: 1.35, b: 3.45, text: "Назад я не вернусь." };

export const Anime80: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 24;
  const f2 = Math.floor(frame / 2) * 2; // персонажи на двойках (12 к/с)
  const f3 = Math.floor(frame / 3) * 3; // мелкая игра на тройках (8 к/с)
  const hop = frame === 87 ? -12 : frame === 88 ? 9 : 0;
  const shot = frame < S2 ? 1 : frame < S3 ? 2 : frame < S4 ? 3 : frame < S5 ? 4 : 5;
  const subO = t >= SUB.a && t <= SUB.b ? cl(ramp(t, SUB.a, SUB.a + 0.1)) : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ChromaDef />
      <AbsoluteFill style={{ filter: "url(#a80chroma) saturate(1.1) contrast(1.05)", transform: `translateY(${hop}px)` }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, background: "#000" }}>
          <Defs80 />
          {shot === 1 && <Shot1 f={frame} f2={f2} />}
          {shot === 2 && <Shot2 f={frame} f2={f2} f3={f3} />}
          {shot === 3 && <Shot3 f={frame} f3={f3} />}
          {shot === 4 && <Impact n={frame - S4} />}
          {shot === 5 && <Title f={frame} />}
        </svg>
        {/* субтитры живут на ленте: композитятся внутри прохода, после грейдинга */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 56, color: "#fff2b8", opacity: subO, textShadow: "0 0 0 #000, 3px 3px 0 #2a1450, -3px 3px 0 #2a1450, 3px -3px 0 #2a1450, -3px -3px 0 #2a1450, 0 6px 14px rgba(0,0,0,0.7)" }}>{SUB.text}</div>
      </AbsoluteFill>
      <CRT f={frame} />
      <PowerOn f={frame} />
      {/* звук */}
      <Sequence from={0} durationInFrames={A80_FRAMES}>
        <Audio src={staticFile("anime80/rain.mp3")} volume={0.75} loop />
        <Audio
          src={staticFile("anime80/pad.mp3")}
          volume={(fr) => {
            const s = fr / 24;
            const duck = ramp(s, 1.1, 1.35) * (1 - ramp(s, 3.0, 3.3));
            return lerp(0.34, 0.14, duck) * (1 - ramp(s, 3.55, 3.66));
          }}
        />
      </Sequence>
      <Sequence from={F(29)} durationInFrames={52}>
        <Audio src={staticFile("anime80/voice.mp3")} volume={1} />
      </Sequence>
      <Sequence from={F(36)} durationInFrames={62}>
        <Audio src={staticFile("anime80/carpass.mp3")} volume={0.55} />
      </Sequence>
      <Sequence from={F(S4 - 1)} durationInFrames={50}>
        <Audio src={staticFile("anime80/impact.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={F(S5)} durationInFrames={A80_FRAMES - S5}>
        <Audio src={staticFile("anime80/title.mp3")} volume={0.6} />
      </Sequence>
      <div style={{ display: "none" }}>{eio(0)}</div>
    </AbsoluteFill>
  );
};
