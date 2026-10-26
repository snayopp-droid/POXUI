import React from "react";
import {
  Bar, Bubble, Cam, CharCard, Crate, FONT, Grain, H, INK, PaperBG, PhoneProp, Person, PriceTag, RED, Stamp, Svg,
  Vignette, W, GREEN, cl, easeIn, easeInOut, easeOut, fmt, lerp, pop, ramp, rnd,
} from "./FuraArt";
import { A, Z, talking } from "./timelineF";
import type { SP } from "./FuraScenesA";

/* ------------------------------------------------------------------ */
/* Одежда героев                                                        */
/* ------------------------------------------------------------------ */
export const NURLAN = { shirt: "#22406a", look: "suit" as const, tie: "#d9b13a", pants: "#1c2a44", hair: "short" as const, hairCol: "#16130f", bigHands: true };
export const AIGUL = { shirt: "#d9708f", look: "dress" as const, pants: "skirt", hair: "long" as const, hairCol: "#17120f" };
export const MARAT = { shirt: "#17171d", look: "suit" as const, tie: "#8e1b1b", pants: "#17171d", hair: "slick" as const, hairCol: "#0f0f12", stubble: true, ring: true, chain: true };

const phoneBubbleHand = <g transform="translate(8,-18) rotate(14) scale(1.25)"><PhoneProp glow={false} /></g>;

/* ------------------------------------------------------------------ */
/* Павильон                                                             */
/* ------------------------------------------------------------------ */
const Passerby: React.FC<{ x: number; y: number; s: number; t: number; i: number; face?: 1 | -1 }> = ({ x, y, s, t, i, face = 1 }) => (
  <Person x={x} y={y} s={s} flip={face === -1} t={t} walk={t * 5 + i} shirt={["#7a8696", "#9a8a7a", "#6a7a6a", "#8a7a96"][i % 4]} pants="#3a3d4a" hair={i % 2 ? "short" : "long"} hairCol="#3a2a22" mood="neutral" breathe={false} />
);

export type PavP = {
  t: number; cx?: number; cy?: number; z?: number; shake?: number;
  mood?: "morning" | "empty" | "storm"; storm?: number; lightning?: number; shelves?: number; doorOpen?: number; passersby?: boolean; mercedes?: number;
  children?: React.ReactNode; rot?: number;
};

export const PavilionWorld: React.FC<PavP> = ({ t, cx = 960, cy = 540, z = 1, shake = 0, rot = 0, mood = "morning", storm = 0, lightning = 0, shelves = 1, doorOpen = 0, passersby = false, mercedes = 0, children }) => {
  const day = mood === "morning";
  const wall = day ? "#f1e4c6" : "#c5c9d0";
  const skyTop = day ? "#8fd0f2" : storm > 0.5 ? "#2a2f3e" : "#8a93a3";
  const skyBot = day ? "#e8f6ff" : storm > 0.5 ? "#4a5062" : "#c5ccd8";
  return (
    <Cam cx={cx} cy={cy} z={z} shake={shake} rot={rot} t={t}>
      <defs>
        <linearGradient id="p-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyTop} /><stop offset="1" stopColor={skyBot} /></linearGradient>
        <clipPath id="p-win"><rect x={1130} y={170} width={600} height={470} /></clipPath>
        <clipPath id="p-door"><rect x={1770} y={230} width={160} height={650} /></clipPath>
      </defs>
      <rect x={-300} y={-200} width={W + 600} height={1500} fill={wall} />
      <rect x={-300} y={600} width={W + 600} height={290} fill={day ? "#86b26e" : "#7a8a80"} />
      <rect x={-300} y={600} width={W + 600} height={12} fill="#fff" opacity={0.3} />
      <rect x={-300} y={880} width={W + 600} height={500} fill={day ? "#c79a66" : "#8c7a68"} />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${-300 + i * 220},880 L${-380 + i * 260},1300`} stroke="#000" strokeOpacity={0.12} strokeWidth={3} />)}
      <rect x={-300} y={876} width={W + 600} height={10} fill="#000" opacity={0.18} />
      {/* вывеска */}
      <g transform="translate(540 120)">
        <rect x={-330} y={-52} width={660} height={104} rx={14} fill="#2e7a46" stroke={INK} strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff" letterSpacing={4}>ОВОЩИ · ФРУКТЫ</text>
      </g>
      {/* стеллажи */}
      <g>
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x={110} y={330 + r * 170} width={680} height={16} fill="#8a5a30" stroke={INK} strokeWidth={3} />
            <rect x={130} y={346 + r * 170} width={16} height={150} fill="#8a5a30" />
            <rect x={754} y={346 + r * 170} width={16} height={150} fill="#8a5a30" />
            {shelves > 0 && [0, 1, 2].map((c) => (
              <Crate key={c} x={230 + c * 220} y={330 + r * 170} w={190} h={96} content="apple" fill="#c98d4a" fullness={shelves} />
            ))}
          </g>
        ))}
        {mood !== "morning" && <g opacity={0.9}>{[0, 1, 2].map((r) => <path key={r} d={`M150,${324 + r * 170} H760`} stroke="#fff" strokeOpacity={0.18} strokeWidth={3} />)}</g>}
      </g>
      {/* окно */}
      <rect x={1118} y={158} width={624} height={494} fill="#fff" stroke={INK} strokeWidth={5} />
      <g clipPath="url(#p-win)">
        <rect x={1130} y={170} width={600} height={470} fill="url(#p-sky)" />
        {day ? (
          <g>
            <circle cx={1580} cy={260} r={60} fill="#fff6c0" /><circle cx={1580} cy={260} r={140} fill="url(#f-white)" opacity={0.6} />
            {[0, 1, 2, 3].map((i) => <g key={i}><rect x={1160 + i * 150} y={420} width={130} height={80} fill={["#d9503a", "#3a8ad9", "#e8b53a", "#3aa86a"][i]} stroke={INK} strokeWidth={3} /><path d={`M${1150 + i * 150},420 h150 l-14,-34 h-122Z`} fill={["#f2c0b8", "#bcd8f2", "#f6e2a8", "#bce2cc"][i]} stroke={INK} strokeWidth={3} /></g>)}
          </g>
        ) : (
          <g>
            {[0, 1, 2, 3].map((i) => <g key={i}><rect x={1160 + i * 150} y={420} width={130} height={80} fill="#5a6070" stroke={INK} strokeWidth={3} /><path d={`M${1150 + i * 150},420 h150 l-14,-34 h-122Z`} fill="#7a8090" stroke={INK} strokeWidth={3} /></g>)}
            {storm > 0 && Array.from({ length: 5 }).map((_, i) => <ellipse key={i} cx={1250 + i * 120 + Math.sin(t + i) * 20} cy={230 + (i % 2) * 40} rx={170} ry={60} fill="#1a1e2a" opacity={0.55 * storm} />)}
          </g>
        )}
        <rect x={1130} y={540} width={600} height={100} fill={day ? "#b9a58a" : "#6f6a66"} />
        {passersby && [0, 1, 2, 3].map((i) => {
          const dirn = i % 2 ? -1 : 1;
          const x = ((i * 330 + t * 90 * dirn) % 900 + 900) % 900 + 1050;
          return <Passerby key={i} x={x} y={640 + (i % 2) * 10} s={0.46} t={t} i={i} face={dirn as 1 | -1} />;
        })}
        {mercedes > 0 && (
          <g transform={`translate(${lerp(1900, 1420, easeOut(mercedes))} 640)`}>
            <path d="M-170,0 V-60 Q-170,-80 -150,-84 L-100,-92 Q-70,-140 -20,-140 L60,-140 Q104,-138 124,-96 L156,-88 Q174,-82 174,-60 V0Z" fill="#14151b" stroke={INK} strokeWidth={3} />
            <path d="M-84,-98 Q-62,-130 -20,-130 L26,-130 L26,-98Z M40,-130 L64,-130 Q94,-128 110,-98 L40,-98Z" fill="#6a7a8e" opacity={0.8} />
            {[-100, 100].map((x) => <g key={x} transform={`translate(${x},-2)`}><circle r={30} fill="#0a0a0e" stroke={INK} strokeWidth={3} /><circle r={14} fill="#9aa0ae" /></g>)}
            <g transform="translate(150 -60)"><circle r={12} fill="#f5f0e4" stroke={INK} strokeWidth={2} /><path d="M0,0 V-10 M0,0 L-9,5 M0,0 L9,5" stroke={INK} strokeWidth={2} /></g>
          </g>
        )}
        {lightning > 0 && <rect x={1130} y={170} width={600} height={470} fill="#fff" opacity={lightning} />}
      </g>
      <path d="M1424,170 V640 M1130,405 H1730" stroke={INK} strokeWidth={5} />
      {storm > 0.4 && Array.from({ length: 30 }).map((_, i) => <line key={i} x1={1130 + ((rnd(i) * 640 + t * 120) % 600)} y1={170 + ((rnd(i + 3) * 500 + t * 900) % 470)} x2={1130 + ((rnd(i) * 640 + t * 120) % 600) - 14} y2={170 + ((rnd(i + 3) * 500 + t * 900) % 470) + 40} stroke="#cfe0ff" strokeWidth={2.4} opacity={0.5 * storm} />)}
      {/* дверь */}
      <rect x={1750} y={210} width={190} height={680} fill="#7a4a2a" stroke={INK} strokeWidth={5} />
      <g clipPath="url(#p-door)"><rect x={1770} y={230} width={160} height={650} fill={day ? "#e8f6ff" : "#8a93a3"} opacity={doorOpen} /></g>
      <path d={`M1770,230 L${1770 + (1 - doorOpen) * 160},230 V880 H1770Z`} fill="#9a6a3a" stroke={INK} strokeWidth={3} opacity={1} />
      {/* лучи */}
      {day && (
        <g>
          <path d="M1130,170 L760,880 L1060,880 L1500,170Z" fill="url(#f-sunray)" opacity={0.55} />
          {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={900 + rnd(i) * 500 + Math.sin(t + i) * 20} cy={300 + ((rnd(i + 3) * 500 + t * 14) % 540)} r={2 + rnd(i + 8) * 3} fill="#fff" opacity={0.55} />)}
        </g>
      )}
      {children}
    </Cam>
  );
};

const noScale = (n: number) => n;
void noScale;

/* ------------------------------------------------------------------ */
/* Карточки                                                             */
/* ------------------------------------------------------------------ */
const CardTitle: React.FC<{ lt: number; label: string; title: string; sub?: string; barLabel?: string; barVal?: number; barCol?: string; barText?: string; icon?: React.ReactNode; t: number }> = ({ lt, label, title, sub, barLabel, barVal = 1, barCol = GREEN, barText, icon, t }) => {
  const k = easeOut(ramp(lt, 0, 0.4));
  return (
    <Svg>
      <PaperBG />
      <g transform={`translate(0 ${(1 - k) * 36})`} opacity={k}>
        <g transform="translate(960 300)">{icon}</g>
        <text x={960} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={26} fill="#8a8272" letterSpacing={10}>{label}</text>
        <text x={960} y={540} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={100} fill={INK}>{title}</text>
        {sub && <text x={960} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={36} fill="#8a8272">{sub}</text>}
      </g>
      {barLabel && <Bar x={560} y={800} w={800} v={barVal * easeOut(ramp(lt, 0.3, 1.1))} col={barCol} label={barLabel} value={barText} />}
      <Grain t={t} o={0.04} />
    </Svg>
  );
};

const ShopIcon: React.FC<{ col?: string }> = ({ col = GREEN }) => (
  <g>
    <path d="M-90,-10 L-70,-70 H70 L90,-10Z" fill={col} stroke={INK} strokeWidth={5} />
    <path d="M-90,-10 Q-65,20 -45,-10 Q-22,20 0,-10 Q22,20 45,-10 Q65,20 90,-10" fill="#fff" stroke={INK} strokeWidth={5} />
    <rect x={-74} y={-10} width={148} height={90} fill="#f4efe4" stroke={INK} strokeWidth={5} />
    <rect x={-28} y={20} width={56} height={60} fill={col} stroke={INK} strokeWidth={4} />
  </g>
);

export const SMorningCard: React.FC<SP> = ({ t, lt }) => (
  <CardTitle t={t} lt={lt} label="СЕРИЯ 1 · УТРО" title="Рынок «Алтын-Орда»" sub="Первая точка" barLabel="ВЛОЖЕНО" barText="ВСЁ" barVal={1} icon={<ShopIcon />} />
);
export const SPart2Card: React.FC<SP> = ({ t, lt }) => (
  <CardTitle t={t} lt={lt} label="СЕРИЯ 1 · ДЕНЬ" title="РЕАЛЬНОСТЬ" sub="Часть вторая" barLabel="ВЫРУЧКА" barText="0 ₸" barVal={0.02} barCol={RED}
    icon={<g><circle r={86} fill="#fbf8ef" stroke={INK} strokeWidth={5} /><path d="M-44,-14 L-44,-10 M44,-14 L44,-10" stroke={INK} strokeWidth={5} /><path d="M-30,30 Q0,6 30,30" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /><circle cx={-30} cy={-16} r={8} fill={INK} /><circle cx={30} cy={-16} r={8} fill={INK} /></g>} />
);

/* ------------------------------------------------------------------ */
/* Утро в павильоне                                                     */
/* ------------------------------------------------------------------ */
const NurlanP = (t: number, p: Partial<React.ComponentProps<typeof Person>> = {}) => <Person x={1000} y={960} t={t} {...NURLAN} {...p} />;

export const SPavilion: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <PavilionWorld t={t} cx={960 + lt * 5} cy={540} z={1 + lt * 0.015}>
      <Person x={620} y={960} t={t} {...AIGUL} mood="smile" tL={[-40, -400]} tR={[40, -420]} flip />
      {NurlanP(t, { mood: "smile", armL: 40, armR: 40 })}
    </PavilionWorld>
    <Vignette o={0.5} />
  </Svg>
);

export const SNurlanCard: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <PavilionWorld t={t} cx={1000} cy={640} z={1.35}>
      {NurlanP(t, { mood: "smile" })}
    </PavilionWorld>
    <CharCard x={1500} y={470} name="НУРЛАН" sub="28 ЛЕТ · ПРЕДПРИНИМАТЕЛЬ" k={pop(lt, 0.3, 0.35)} accent="#5a8ad9">
      <Person x={0} y={150} t={t} {...NURLAN} mood="smile" />
    </CharCard>
    <Vignette o={0.5} />
  </Svg>
);

export const SApples: React.FC<SP> = ({ t, lt, dur }) => {
  const p = cl(lt / Math.max(1, dur));
  const lift = easeInOut(ramp(p, 0, 0.35));
  const place = easeInOut(ramp(p, 0.45, 0.85));
  const cx = lerp(1000, 640, ramp(p, 0.3, 0.8));
  const handY = lerp(-170, -250, lift) - place * 30;
  return (
    <Svg>
      <PavilionWorld t={t} cx={820} cy={640} z={1.45}>
        <Person x={cx} y={960} t={t} {...NURLAN} mood="smile" tL={[-60 - place * 10, handY]} tR={[60 + place * 10, handY]} walk={ramp(p, 0.3, 0.8) > 0 && ramp(p, 0.3, 0.8) < 1 ? lt * 5 : undefined}
          handL={<g />} />
        <Crate x={cx} y={960 + handY * 0.2 - 40 - place * 230} w={190} h={96} content="apple" />
      </PavilionWorld>
      <Vignette o={0.5} />
    </Svg>
  );
};

const Receipt: React.FC<{ lt: number; items: { text: string; val: string; at: number }[]; total?: string; title: string }> = ({ lt, items, total, title }) => (
  <g transform="translate(960 560)">
    <path d="M-300,-400 H300 V380 l-30,24 l-30,-24 l-30,24 l-30,-24 l-30,24 l-30,-24 l-30,24 l-30,-24 l-30,24 l-30,-24 l-30,24 l-30,-24 l-30,24 l-30,-24 Z" fill="#fbf8ef" stroke={INK} strokeWidth={4} />
    <text x={0} y={-330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={INK} letterSpacing={6}>{title}</text>
    <path d="M-250,-300 H250" stroke={INK} strokeWidth={2} strokeDasharray="10 8" />
    {items.map((it, i) => {
      const k = ramp(lt, it.at, it.at + 0.25);
      return (
        <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 16})`}>
          <text x={-250} y={-220 + i * 110} fontFamily={FONT} fontWeight={600} fontSize={38} fill={INK}>{it.text}</text>
          <text x={250} y={-220 + i * 110} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={38} fill={RED}>{it.val}</text>
        </g>
      );
    })}
    {total && (
      <g>
        <path d="M-250,150 H250" stroke={INK} strokeWidth={4} />
        <text x={-250} y={226} fontFamily={FONT} fontWeight={900} fontSize={52} fill={INK}>ИТОГО</text>
        <text x={250} y={226} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={64} fill={RED}>{total}</text>
      </g>
    )}
  </g>
);

export const SInvest: React.FC<SP> = ({ t, lt }) => {
  const a0 = A("Он вложил в него всё");
  const r = (ph: string) => A(ph) - a0;
  return (
    <Svg>
      <PaperBG />
      <Receipt
        lt={lt} title="ЧЕК · СТАРТ"
        items={[
          { text: "Кредит в банке", val: "−", at: r("Кредит в банке") },
          { text: "Деньги матери", val: "−", at: r("Деньги матери") },
          { text: "Продал машину", val: "−", at: r("И продал свою машину") },
        ]}
        total={lt > r("И продал свою машину") + 0.8 ? "ВСЁ" : undefined}
      />
      <Stamp x={1480} y={380} text="ВСЁ ВЛОЖЕНО" k={pop(lt, r("И продал свою машину") + 0.9, 0.3)} rot={-9} size={48} />
      <Grain t={t} o={0.04} />
    </Svg>
  );
};

export const SAigul: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <PavilionWorld t={t} cx={760} cy={650} z={1.45}>
      <Person x={660} y={960} t={t} {...AIGUL} mood="smile" tL={[-50, -420 + Math.sin(t * 3) * 8]} tR={[40, -300]} />
      {[0, 1, 2].map((i) => <PriceTag key={i} x={300 + i * 220} y={470 + (i % 2) * 6} text={["120 ₸", "180 ₸", "95 ₸"][i]} col="#e08a2a" size={26} k={pop(lt, 0.3 + i * 0.25, 0.25)} rot={-6 + i * 4} />)}
    </PavilionWorld>
    <CharCard x={1500} y={470} name="АЙГУЛЬ" sub="25 ЛЕТ · ЖЕНА НУРЛАНА" k={pop(lt, 0.4, 0.35)} accent="#d9708f">
      <Person x={0} y={150} t={t} {...AIGUL} mood="smile" />
    </CharCard>
    <Vignette o={0.5} />
  </Svg>
);

export const SAigulSays: React.FC<SP> = ({ t, lt }) => {
  const a = A("Нурлан ты только посмотри");
  const z = Z("всё пойдёт");
  const p = cl((lt + A("Нурлан ты только посмотри") - a) / (z - a));
  return (
    <Svg>
      <PavilionWorld t={t} cx={860} cy={620} z={1.3}>
        <Person x={760} y={960} t={t} {...AIGUL} mood="smile" talk={talking("aigul", t)} tL={[-60, -330]} tR={[70, -250]} />
        {NurlanP(t, { x: 1180, mood: "smile", flip: true })}
      </PavilionWorld>
      <Bubble x={720} y={230} text="Нурлан, ты только посмотри! Красота какая. Наша точка. Первая в этом ряду. Дай Бог, всё пойдёт" p={p} k={pop(lt, 0.15, 0.3)} tx={780} ty={400} max={34} size={36} />
      <Vignette o={0.5} />
    </Svg>
  );
};

export const SNurlanSays: React.FC<SP> = ({ t, lt }) => {
  const a = A("Всё пойдёт родная");
  const z = Z("зелень брать будут");
  const p = cl((lt + A("Нурлан улыбается") - a) / (z - a));
  const ash = ramp(lt, A("рестораном У Ашота") - A("Нурлан улыбается"), A("рестораном У Ашота") - A("Нурлан улыбается") + 0.3);
  return (
    <Svg>
      <PavilionWorld t={t} cx={960} cy={620} z={1.3}>
        {NurlanP(t, { x: 960, mood: "smile", talk: talking("nurlan", t), tR: [90, -300] })}
        <Person x={560} y={960} t={t} {...AIGUL} mood="smile" flip />
      </PavilionWorld>
      <Bubble x={1020} y={210} text="Всё пойдёт, родная. Главное — старт. Сейчас фура придёт, товар разложим, и начнём. Я уже договорился с рестораном «У Ашота» — они у нас всю зелень брать будут" p={p} k={pop(lt, 0.15, 0.3)} tx={980} ty={380} max={38} size={34} />
      <g transform={`translate(1560 700) scale(${ash})`} opacity={ash}>
        <rect x={-190} y={-70} width={380} height={140} rx={16} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
        <text x={0} y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={INK}>«У Ашота»</text>
        <text x={0} y={44} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={28} fill={GREEN}>возьмут всю зелень</text>
      </g>
      <Vignette o={0.5} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Телефон Нурлана                                                      */
/* ------------------------------------------------------------------ */
const PhoneScreen: React.FC<{ x?: number; y?: number; s?: number; rot?: number; children: React.ReactNode; dark?: boolean }> = ({ x = 960, y = 540, s = 1, rot = 0, children, dark = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-230} y={-480} width={460} height={960} rx={60} fill="#0b0c10" stroke="#2a2c36" strokeWidth={4} />
    <rect x={-212} y={-462} width={424} height={924} rx={46} fill={dark ? "#12151f" : "#f2f2f5"} />
    <rect x={-56} y={-448} width={112} height={24} rx={12} fill="#05060a" />
    {children}
  </g>
);

export const SMissed: React.FC<SP> = ({ t, lt }) => {
  const n = Math.min(10, Math.floor(lt * 5));
  return (
    <Svg>
      <PavilionWorld t={t} cx={960} cy={540} z={1.0}>{null}</PavilionWorld>
      <rect width={W} height={H} fill="#000" opacity={0.6} />
      <PhoneScreen s={0.95} rot={-2 + Math.sin(t * 1.4)}>
        <text x={0} y={-370} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#9aa3b8">Пропущенные</text>
        <g transform="translate(0 -300)">
          <circle cx={-150} cy={0} r={40} fill="#d9b25a" /><text x={-150} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={INK}>Д</text>
          <text x={-90} y={-4} fontFamily={FONT} fontWeight={800} fontSize={40} fill="#fff">Данила</text>
          <text x={-90} y={34} fontFamily={FONT} fontWeight={600} fontSize={26} fill="#9aa3b8">Пропущенный вызов</text>
        </g>
        <g transform="translate(0 -170)">
          {Array.from({ length: 10 }).map((_, i) => {
            const k = ramp(lt, i * 0.2, i * 0.2 + 0.18);
            return (
              <g key={i} opacity={k} transform={`translate(0 ${i * 56})`}>
                <path d="M-150,-14 l14,-12 l22,22 l-12,10z" fill={RED} transform="scale(0.9)" />
                <text x={-100} y={4} fontFamily={FONT} fontWeight={600} fontSize={28} fill="#e8ecf6">Данила · {String(3 + Math.floor(i / 4)).padStart(2, "0")}:{String(12 + i * 4).padStart(2, "0")}</text>
              </g>
            );
          })}
        </g>
      </PhoneScreen>
      <g transform={`translate(1480 300) scale(${pop(lt, 0.1, 0.3)})`}>
        <circle r={110} fill={RED} stroke={INK} strokeWidth={6} />
        <text y={36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#fff">{n}</text>
        <text y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff">ПРОПУЩЕННЫХ</text>
      </g>
      <Vignette />
    </Svg>
  );
};

export const SFrown: React.FC<SP> = ({ t, lt }) => {
  const a = A("Странно Данила обычно");
  const z = Z("на связи");
  const p = cl((lt + A("Нурлан хмурится") - a) / (z - a));
  return (
    <Svg>
      <PavilionWorld t={t} cx={1000} cy={640} z={1.75}>
        {NurlanP(t, { mood: "worry", talk: talking("nurlan", t), tR: [30, -300], handR: <g transform="translate(0,-14) scale(1.3)"><PhoneProp /></g> })}
      </PavilionWorld>
      <Bubble x={1360} y={270} text="Странно. Данила обычно в это время уже на связи" p={p} k={pop(lt, 0.8, 0.3)} tx={1100} ty={430} max={26} size={40} />
      <Vignette o={0.5} />
    </Svg>
  );
};

export const SDialing: React.FC<SP> = ({ t, lt }) => {
  const ab = ramp(lt, A("Абонент не отвечает") - A("Он набирает номер") - 0.2, A("Абонент не отвечает") - A("Он набирает номер") + 0.2);
  const dots = ".".repeat(1 + Math.floor(t * 2.5) % 3);
  return (
    <Svg>
      <rect width={W} height={H} fill="#10131c" />
      <PhoneScreen s={1.0} rot={Math.sin(t * 1.2) * 0.8}>
        <g transform="translate(0 -120)">
          <circle r={90} fill="#d9b25a" /><text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={84} fill={INK}>Д</text>
          <text y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill="#fff">Данила</text>
          <text y={220} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill={ab > 0.5 ? RED : "#9aa3b8"}>{ab > 0.5 ? "Абонент не отвечает" : `Вызов${dots}`}</text>
        </g>
        <g transform="translate(0 330)">
          <circle r={56} fill={RED} /><path d="M-24,10 q24,-30 48,0 l-10,10 q-14,-14 -28,0z" fill="#fff" transform="rotate(135)" />
        </g>
        {ab < 0.5 && [0, 1, 2].map((i) => <circle key={i} cx={0} cy={-120} r={110 + ((t * 70 + i * 30) % 90)} fill="none" stroke="#4a7fd4" strokeWidth={3} opacity={1 - ((t * 70 + i * 30) % 90) / 90} />)}
      </PhoneScreen>
      <g transform={`translate(1500 400) scale(${pop(lt, 0.2, 0.3)})`}>
        <rect x={-210} y={-70} width={420} height={140} rx={22} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
        <text y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={INK}>Долгие гудки…</text>
        <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={28} fill="#7a7466">тишина</text>
      </g>
      <Vignette />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Реальность                                                           */
/* ------------------------------------------------------------------ */
export const SEmptyShop: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <PavilionWorld t={t} cx={960} cy={560} z={1.05 + lt * 0.01} mood="empty" shelves={0} passersby>
      {NurlanP(t, { x: 760, mood: "sad" })}
      {[0, 1].map((i) => <PriceTag key={i} x={300 + i * 330} y={500} text="ПУСТО" col="#7a8090" size={26} k={pop(lt, 0.5 + i * 0.6, 0.3)} rot={-5} />)}
    </PavilionWorld>
    <rect width={W} height={H} fill="#1a2030" opacity={0.2} />
    <Vignette o={0.7} />
  </Svg>
);

export const SPacingCall: React.FC<SP> = ({ t, lt }) => {
  const x = 700 + Math.sin(lt * 1.3) * 380;
  const dirn = Math.cos(lt * 1.3) > 0 ? 1 : -1;
  return (
    <Svg>
      <PavilionWorld t={t} cx={960} cy={560} z={1.05} mood="empty" shelves={0}>
        <Person x={x} y={960} t={t} {...NURLAN} flip={dirn === -1} mood="angry" walk={lt * 6} tR={[76, -372]} handR={phoneBubbleHand} breathe={false} />
      </PavilionWorld>
      <Vignette o={0.7} />
    </Svg>
  );
};

export const SNurlanShouts: React.FC<SP> = ({ t, lt }) => {
  const a = A("Что значит");
  const z = Z("на три миллиона");
  const p = cl((lt + A("Что значит") - a) / (z - a));
  return (
    <Svg>
      <PavilionWorld t={t} cx={1000} cy={640} z={1.75} mood="empty" shelves={0} shake={Math.sin(t * 30) * 0}>
        {NurlanP(t, { x: 1000, mood: "angry", talk: talking("nurlan", t) * 1.2, tR: [76, -372], handR: phoneBubbleHand, tilt: Math.sin(t * 25) * 0.8 })}
      </PavilionWorld>
      <Bubble x={1300} y={270} text="Что значит «он не доехал»? Как не доехал?! Это был мой единственный груз! Вы понимаете, что там товар на три миллиона?!" p={p} k={pop(lt, 0.15, 0.3)} tx={1070} ty={420} max={30} size={38} />
      <PriceTag x={1560} y={850} text="3 000 000 ₸" col={RED} size={48} k={pop(lt, A("на три миллиона") - A("Что значит") - 0.3, 0.3)} rot={-4} />
      <Vignette o={0.7} />
    </Svg>
  );
};

export const SOperator: React.FC<SP> = ({ t, lt }) => {
  const a = A("Мы узнаем обстоятельства");
  const z = Z("форс-мажор");
  const p = cl((lt + A("Голос в трубке") - a) / (z - a));
  const s1 = ramp(lt, A("Груз уничтожен") - A("Голос в трубке"), A("Груз уничтожен") - A("Голос в трубке") + 0.3);
  const s2 = ramp(lt, A("Страховка покроет") - A("Голос в трубке"), A("Страховка покроет") - A("Голос в трубке") + 0.3);
  const s3 = ramp(lt, A("Мы не несём ответственности") - A("Голос в трубке"), A("Мы не несём ответственности") - A("Голос в трубке") + 0.3);
  return (
    <Svg>
      <rect width={W} height={H} fill="#10131c" />
      <PhoneScreen x={560} s={0.9} rot={-2}>
        <g transform="translate(0 -200)">
          <circle r={70} fill="#4a6a9a" /><path d="M-30,16 q30,-40 60,0z M0,-14 m-16,0 a16,16 0 1,0 32,0 a16,16 0 1,0 -32,0" fill="#fff" />
          <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">Логистика</text>
          <text y={178} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={28} fill="#7ad98a">идёт вызов · 00:{String(12 + Math.floor(lt)).padStart(2, "0")}</text>
        </g>
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-130 + i * 30} y={100 - Math.abs(Math.sin(t * 9 + i)) * 60} width={14} height={20 + Math.abs(Math.sin(t * 9 + i)) * 120} rx={7} fill="#7ad98a" opacity={0.8} />)}
      </PhoneScreen>
      <Bubble x={1270} y={250} text="Мы узнаем обстоятельства. Но машина перевернулась. Водитель в больнице. Груз уничтожен. Страховка покроет только часть. Мы не несём ответственности за форс-мажор" p={p} k={pop(lt, 0.2, 0.3)} tx={800} ty={330} max={30} size={34} dark />
      <Stamp x={1400} y={620} text="ГРУЗ УНИЧТОЖЕН" k={pop(lt, A("Груз уничтожен") - A("Голос в трубке"), 0.3)} rot={-6} size={44} />
      <Stamp x={1480} y={760} text="СТРАХОВКА: ЧАСТЬ" k={s2} rot={4} size={40} col="#e08a2a" />
      <Stamp x={1400} y={900} text="ФОРС-МАЖОР" k={s3} rot={-3} size={44} col="#8a92a8" />
      {s1 < 0 && null}
      <Vignette />
    </Svg>
  );
};

export const SLower: React.FC<SP> = ({ t, lt }) => {
  const down = easeInOut(ramp(lt, 0.2, 1.3));
  return (
    <Svg>
      <PavilionWorld t={t} cx={1000} cy={640} z={lerp(1.7, 1.2, down)} mood="empty" shelves={0}>
        {NurlanP(t, { x: 1000, mood: "sad", tR: [lerp(76, 76, down), lerp(-372, -190, down)], handR: phoneBubbleHand, lookY: 1 })}
      </PavilionWorld>
      <Vignette o={0.8} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Марат                                                                */
/* ------------------------------------------------------------------ */
const MaratP = (t: number, p: Partial<React.ComponentProps<typeof Person>> = {}) => <Person x={1450} y={960} t={t} {...MARAT} flip mood="smirk" {...p} />;

export const SMaratEnters: React.FC<SP> = ({ t, lt }) => {
  const open = easeOut(ramp(lt, 0.1, 0.6));
  const x = lerp(2020, 1450, easeOut(ramp(lt, 0.3, 2.0)));
  const walking = lt > 0.3 && lt < 2.0 ? lt * 6 : undefined;
  return (
    <Svg>
      <PavilionWorld t={t} cx={1300} cy={600} z={1.15} mood="empty" shelves={0} doorOpen={open}>
        {NurlanP(t, { x: 820, mood: "worry", lookX: 1 })}
        <Person x={x} y={960} t={t} {...MARAT} flip mood="smirk" walk={walking} />
      </PavilionWorld>
      <CharCard x={640} y={500} name="МАРАТ" sub="35 ЛЕТ · ВЛАДЕЛЕЦ СОСЕДНИХ ТОЧЕК" k={pop(lt, 1.3, 0.35)} accent="#8e1b1b">
        <Person x={0} y={150} t={t} {...MARAT} mood="smirk" />
      </CharCard>
      <Vignette o={0.8} />
    </Svg>
  );
};

export const SMaratSpeech: React.FC<SP> = ({ t, lt }) => {
  const a = A("Нурлан брат Слышал");
  const z = Z("а у тебя хаос");
  const p = cl((lt + A("Нурлан брат Слышал") - a) / (z - a));
  const ring = ramp(lt, 0.3, 0.8);
  return (
    <Svg>
      <PavilionWorld t={t} cx={1230} cy={640} z={1.4} mood="empty" shelves={0} doorOpen={1}>
        {NurlanP(t, { x: 900, mood: "worry", lookX: 1 })}
        {MaratP(t, { x: 1450, talk: talking("marat", t), tR: [90, -300] })}
      </PavilionWorld>
      <Bubble x={1330} y={230} text="Нурлан, брат. Слышал про фуру. Сочувствую. Начало — это всегда риск. Знаешь, что я тебе скажу? Деньги в этом бизнесе любят тишину и порядок. А у тебя — хаос" p={p} k={pop(lt, 0.2, 0.3)} tx={1420} ty={390} max={34} size={35} />
      <g transform={`translate(1760 840) scale(${ring})`} opacity={ring * 0.0} />
      <Vignette o={0.8} />
    </Svg>
  );
};

export const SNurlanFist: React.FC<SP> = ({ t, lt }) => {
  const sq = ramp(lt, 0.2, 0.8);
  return (
    <Svg>
      <PavilionWorld t={t} cx={900} cy={700} z={2.4} mood="empty" shelves={0}>
        {NurlanP(t, { x: 900, mood: "angry", armL: lerp(8, 30, sq), armR: lerp(8, 30, sq), tilt: Math.sin(t * 28) * 0.4 * sq })}
        {[-1, 1].map((sd) => <g key={sd} transform={`translate(${900 + sd * 78} 790) scale(${1 + sq * 0.4})`}><circle r={24} fill="#f5f0e4" stroke={INK} strokeWidth={3} /><path d="M-12,-6 H12 M-12,6 H12" stroke={INK} strokeWidth={2.5} /></g>)}
      </PavilionWorld>
      <Vignette o={0.9} />
    </Svg>
  );
};

const Counter: React.FC<{ x: number; y: number; w: number; lines: [string, string][]; k: number; col?: string; head?: string }> = ({ x, y, w, lines, k, col = RED, head }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={cl(k * 2)}>
    <rect x={-w / 2} y={-40} width={w} height={lines.length * 70 + 70} rx={20} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
    {head && <text x={0} y={4} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#8a8272" letterSpacing={6}>{head}</text>}
    {lines.map((l, i) => (
      <g key={i}>
        <text x={-w / 2 + 30} y={58 + i * 70} fontFamily={FONT} fontWeight={600} fontSize={34} fill={INK}>{l[0]}</text>
        <text x={w / 2 - 30} y={58 + i * 70} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={40} fill={col}>{l[1]}</text>
      </g>
    ))}
  </g>
);

export const SMaratOffer: React.FC<SP> = ({ t, lt }) => {
  const a = A("Ты брал кредит");
  const z = A("Слушай моё предложение") - 0.2;
  const p = cl(lt / (z - a));
  const rent = 120000 + Math.floor(lt * 4000);
  const days = Math.max(0, 7 - Math.floor(ramp(lt, 0.8, 2.6) * 7));
  return (
    <Svg>
      <PavilionWorld t={t} cx={1230} cy={640} z={1.35} mood="empty" shelves={0} doorOpen={1}>
        {NurlanP(t, { x: 900, mood: "worry", lookX: 1 })}
        {MaratP(t, { x: 1450, talk: talking("marat", t), tR: [90, -310] })}
      </PavilionWorld>
      <Bubble x={1360} y={230} text="Ты брал кредит, да? У тебя же через неделю платёж. А товара нет. Что делать будешь? Полки пустые. Аренда капает" p={p} k={pop(lt, 0.15, 0.3)} tx={1430} ty={390} max={34} size={35} />
      <Counter x={420} y={190} w={470} k={pop(lt, 0.6, 0.3)} head="КРЕДИТ" lines={[["Платёж через", `${days} дн.`]]} />
      <Counter x={420} y={410} w={470} k={pop(lt, A("Аренда капает") - a - 1.2, 0.3)} head="АРЕНДА КАПАЕТ" lines={[["Минус", `${fmt(rent)} ₸`]]} />
      <Vignette o={0.8} />
    </Svg>
  );
};

export const SMaratOffer2: React.FC<SP> = ({ t, lt }) => {
  const a = A("Слушай моё предложение");
  const z = Z("кредит закроешь");
  const p = cl(lt / (z - a));
  return (
    <Svg>
      <PavilionWorld t={t} cx={1230} cy={640} z={1.35} mood="empty" shelves={0} doorOpen={1}>
        {NurlanP(t, { x: 900, mood: "worry", lookX: 1 })}
        {MaratP(t, { x: 1450, talk: talking("marat", t), tR: [100, -300], mood: "smile" })}
      </PavilionWorld>
      <Bubble x={1350} y={230} text="Слушай моё предложение: продай мне свою точку. Я дам тебе чуть больше, чем ты вложил. Забудешь как страшный сон. И кредит закроешь" p={p} k={pop(lt, 0.15, 0.3)} tx={1420} ty={390} max={34} size={35} />
      <g transform={`translate(430 330) scale(${pop(lt, 1.2, 0.35)})`}>
        <rect x={-260} y={-80} width={520} height={330} rx={22} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
        <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#8a8272" letterSpacing={6}>ПРЕДЛОЖЕНИЕ</text>
        <Bar x={-220} y={30} w={440} v={0.75} col="#8a92a8" label="ТЫ ВЛОЖИЛ" />
        <Bar x={-220} y={150} w={440} v={0.82 * easeOut(ramp(lt, 1.8, 2.6))} col={RED} label="Я ДАМ ЧУТЬ БОЛЬШЕ" />
      </g>
      <Vignette o={0.8} />
    </Svg>
  );
};

export const SRefusal: React.FC<SP> = ({ t, lt }) => {
  const p = cl(lt / Math.max(0.5, Z("Я не продаюсь") - A("Нурлан поднимает на него глаза")));
  return (
    <Svg>
      <PavilionWorld t={t} cx={1000} cy={660} z={1.9} mood="empty" shelves={0}>
        {NurlanP(t, { mood: "angry", talk: talking("nurlan", t) * 0.6, lookX: 1 })}
      </PavilionWorld>
      <Bubble x={1100} y={250} text="Я не продаюсь" p={Math.min(1, p * 2 + 0.0)} k={pop(lt, A("Я не продаюсь") - A("Нурлан поднимает на него глаза") - 0.1, 0.3)} tx={1030} ty={420} max={26} size={56} />
      <Vignette o={0.9} />
    </Svg>
  );
};

export const SMaratWait: React.FC<SP> = ({ t, lt }) => {
  const a = A("Пока не продаёшь");
  const z = Z("будет уже другой");
  const p = cl((lt + A("Марат усмехается") - a) / (z - a));
  const days = Math.max(0, 7 - Math.floor(ramp(lt, A("Неделю") - A("Марат усмехается"), A("Неделю") - A("Марат усмехается") + 1.2) * 7));
  return (
    <Svg>
      <PavilionWorld t={t} cx={1300} cy={660} z={1.7} mood="empty" shelves={0} doorOpen={1}>
        {MaratP(t, { x: 1400, talk: talking("marat", t), mood: "smirk", tR: [90, -240] })}
      </PavilionWorld>
      <Bubble x={1060} y={250} text="Пока не продаёшь. Я подожду. Неделю. А потом ты сам приползёшь. Только цена будет уже другой" p={p} k={pop(lt, 0.15, 0.3)} tx={1340} ty={400} max={30} size={37} />
      <g transform={`translate(440 560) scale(${pop(lt, A("Неделю") - A("Марат усмехается") - 0.2, 0.3)})`}>
        <rect x={-190} y={-170} width={380} height={340} rx={20} fill="#fbf8ef" stroke={INK} strokeWidth={4} />
        <rect x={-190} y={-170} width={380} height={64} rx={20} fill={RED} stroke={INK} strokeWidth={4} />
        <text x={0} y={-124} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff" letterSpacing={6}>СРОК</text>
        <text x={0} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={190} fill={INK}>{days}</text>
        <text x={0} y={128} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={34} fill="#8a8272">дней</text>
      </g>
      <PriceTag x={440} y={830} text="ЦЕНА ↓" col="#8a92a8" size={34} k={pop(lt, A("цена будет уже другой") - A("Марат усмехается") - 0.4, 0.3)} rot={-5} />
      <Vignette o={0.8} />
    </Svg>
  );
};

export const SMaratLeaves: React.FC<SP> = ({ t, lt }) => {
  const x = lerp(1450, 2100, easeIn(ramp(lt, 0.1, 1.6)));
  const hold = ramp(lt, 1.6, 2.4);
  return (
    <Svg>
      <PavilionWorld t={t} cx={1200} cy={640} z={1.2} mood="empty" shelves={0} doorOpen={1}>
        <Person x={760} y={960} t={t} {...AIGUL} mood="sad" tears={0.3 * hold} tR={[lerp(60, 70, hold), lerp(-170, -176, hold)]} />
        {NurlanP(t, { x: 920, mood: "sad", tL: [lerp(-60, -70, hold), lerp(-170, -176, hold)] })}
        <Person x={x} y={960} t={t} {...MARAT} mood="smirk" walk={lt * 6} />
      </PavilionWorld>
      <Vignette o={0.8} />
    </Svg>
  );
};
