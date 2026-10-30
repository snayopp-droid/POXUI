import React from "react";
import { Actor, Bottle, Pile, Urn, Bench, Tree, Coin, Pie, Steam, Sky, Ground, Block, Pop, K, GY, FONT, cl, lerp, ramp, eio } from "./art";

export type SP = { t: number; bt: number; id: string; sp: string; cx: number; dur: number };
const par = (cx: number, k: number, ch: React.ReactNode) => <g transform={`translate(${(cx - 540) * k},0)`}>{ch}</g>;
const walk = (t: number, amp = 1) => ({ walk: t * 8, amp, t });
const slide = (bt: number, a: number, b: number, d = 0.6) => lerp(a, b, eio(ramp(bt, 0, d)));
const T: React.FC<React.PropsWithChildren<{ x: number; y: number; s: number; c?: string; w?: number; anchor?: "start" | "middle" | "end"; rot?: number }>> = ({ x, y, s, c = "#fff", w = 900, anchor = "middle", rot = 0, children }) => (
  <text x={x} y={y} fontSize={s} fontFamily={FONT} fontWeight={w} fill={c} textAnchor={anchor} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>{children}</text>
);
const Sign: React.FC<{ x: number; y: number; w: number; h: number; text: string; bg: string; fg?: string; size?: number; rot?: number }> = ({ x, y, w, h, text, bg, fg = "#fff", size = 60, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={bg} stroke="#00000066" strokeWidth={6} /><T x={0} y={size * 0.35} s={size} c={fg}>{text}</T></g>
);
const Lamp: React.FC<{ x: number; on?: boolean }> = ({ x, on }) => (
  <g transform={`translate(${x},${GY})`}><rect x={-8} y={-520} width={16} height={520} fill="#2e2e36" /><rect x={-8} y={-520} width={90} height={14} fill="#2e2e36" /><ellipse cx={74} cy={-500} rx={30} ry={14} fill={on ? "#ffe9a0" : "#8a8a96"} />{on && <ellipse cx={74} cy={-380} rx={90} ry={200} fill="#ffe9a0" opacity={0.14} />}</g>
);
const Cloud: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x + Math.sin(t * 0.2 + x) * 20},${y}) scale(${s})`} opacity={0.9}><ellipse rx={150} ry={42} fill="#fff" /><ellipse cx={-60} cy={-28} rx={80} ry={44} fill="#fff" /><ellipse cx={50} cy={-34} rx={70} ry={40} fill="#fff" /></g>
);

/* ═══ 0. ПОДЪЁМ, ТЕПЛОТРАССА ═══ */
export const Sc0: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const up = id === "t0" ? 0 : id === "1.01" ? ramp(bt, 0, 0.7) : 1;
  const away = id === "t0b" ? eio(ramp(bt, 0.1, 1.5)) : 0;
  const gx = lerp(430, 1300, away);
  return (
    <g>
      <Sky c1="#2a2a5e" c2="#f6a45a" id="s0" />
      <circle cx={820} cy={800} r={170} fill="#ffd98a" opacity={0.95} /><circle cx={820} cy={800} r={250} fill="#ffd98a" opacity={0.2} />
      {par(cx, 0.55, <g><Block x={-300} w={420} h={760} c="#3a3868" cols={4} rows={9} lit={0.2} /><Block x={150} w={300} h={900} c="#46427a" cols={3} rows={11} lit={0.3} /><Block x={1000} w={460} h={820} c="#3a3868" cols={4} rows={10} lit={0.25} /></g>)}
      {par(cx, 0.25, <g><Block x={-200} w={360} h={560} c="#5a4a78" cols={3} rows={7} lit={0.4} /><Block x={640} w={340} h={620} c="#5a4a78" cols={3} rows={7} lit={0.35} /></g>)}
      <Ground c="#4a4852" c2="#2a2a36" />
      {/* трубы теплотрассы */}
      <g><rect x={-900} y={GY - 250} width={2900} height={150} fill="#a8998a" /><rect x={-900} y={GY - 250} width={2900} height={26} fill="#c8baa8" /><rect x={-900} y={GY - 126} width={2900} height={26} fill="#6a5e54" />
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-860 + i * 240} y={GY - 250} width={22} height={150} fill="#7a6e62" />)}
        {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={-700 + i * 330} cy={GY - 175} rx={40} ry={11} fill="#b0602e" opacity={0.6} />)}
      </g>
      <Steam x={250} y={GY - 250} t={t} s={1.3} /><Steam x={900} y={GY - 250} t={t + 3} n={4} s={1.1} />
      {/* картон */}
      <g transform={`translate(430,${GY + 8})`}><path d="M -300 0 L -250 -26 L 300 -26 L 340 0 L 300 26 L -250 26 Z" fill="#b08a5a" stroke="#6a4a28" strokeWidth={5} /><path d="M -240 0 L 280 0" stroke="#6a4a28" strokeWidth={3} strokeDasharray="14 12" /></g>
      <Pile x={110} y={GY + 90} n={3} s={1.1} seed={4} />
      {id === "t0" && up === 0 && <g>{[0, 1, 2].map((i) => <T key={i} x={470 + i * 52} y={GY - 640 - ((t * 60 + i * 50) % 140)} s={70 - i * 12} c="#ffffffcc">z</T>)}</g>}
      <Actor who="gosha" x={gx} s={2.4} t={t} talking={sp === "gosha"} label={id === "1.01"}
        pose={{ ...(away > 0 ? walk(t) : {}), sit: 1 - up, expr: up < 0.3 ? "sleep" : undefined, armR: up > 0.8 && away === 0 ? [150, 40] : undefined, armL: up > 0.8 && away === 0 ? [20, 20] : undefined }}
        held={up > 0.8 ? <g transform="rotate(180) translate(0,-6)"><Bottle x={0} y={0} s={0.5} /></g> : undefined} />
      {id === "1.01" && bt > 3.4 && <Pop text="+5 ₽" p={(bt - 3.4) / 1.2} x={760} y={GY - 700} />}
    </g>
  );
};

/* ═══ 1. УРНА №1 ═══ */
export const Sc1: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const px = id === "2.02" ? slide(bt, 1350, 790, 0.9) : id === "2.03" ? lerp(790, 1350, eio(ramp(bt, 0.3, 2.4))) : id === "2.01" ? 1500 : 1500;
  const rummage = id === "2.01" ? 1 : 0;
  const hold = id === "2.01" && bt > 2.3;
  return (
    <g>
      <Sky c1="#78c0ee" c2="#eaf7ff" id="s1" />
      <Cloud x={200} y={300} t={t} /><Cloud x={800} y={190} s={0.8} t={t + 2} />
      {par(cx, 0.5, <g><Block x={-300} w={400} h={900} c="#b08a6a" cols={4} rows={10} /><Block x={620} w={380} h={1000} c="#9a7a5a" cols={4} rows={11} /><Block x={1100} w={340} h={820} c="#b08a6a" cols={3} rows={9} /></g>)}
      {par(cx, 0.2, <g><Block x={150} w={420} h={620} c="#c8a47a" cols={4} rows={6} lit={0.6} /><Block x={950} w={300} h={560} c="#c8a47a" cols={3} rows={6} lit={0.6} /></g>)}
      <Ground c="#7a7a84" c2="#55555f" curb="#b8b8c0" />
      <Lamp x={900} /><Sign x={880} y={GY - 640} w={340} h={92} text="КАФЕ" bg="#d84a3a" size={62} rot={-3} />
      <Urn x={320} s={1.6} lid={rummage ? 0.9 : 0} />
      <Pile x={600} y={GY + 100} n={id === "2.04" || id === "t0b" ? 5 : 2} s={1.1} seed={9} />
      <Actor who="passer" x={px} s={2.4} flip t={t} talking={sp === "passer"} label={id === "2.02"} pose={id === "2.02" ? { ...walk(t, bt < 0.9 ? 1 : 0), expr: bt > 0.8 ? "worry" : "neutral", armL: [40, 20], armR: bt > 0.8 ? [120, 70] : undefined } : walk(t)} />
      <Actor who="gosha" x={rummage ? 470 : 500} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"}
        pose={{ lean: rummage && !hold ? 24 : 0, armR: rummage && !hold ? [160, 20] : hold || id === "2.04" ? [150, 40] : id === "2.03" ? [40, 60] : undefined, expr: id === "2.03" ? "happy" : undefined, look: sp === "passer" ? 0.8 : 0 }}
        held={hold || id === "2.04" ? <g transform="rotate(180) translate(0,-6)"><Bottle x={0} y={0} s={0.5} kind="can" /></g> : undefined} />
      {id === "2.01" && bt > 3.2 && <Pop text="+8 ₽" p={(bt - 3.2) / 1.1} x={420} y={GY - 780} />}
      {id === "2.04" && (
        <g transform="translate(540,470)">
          <rect x={-470} y={-200} width={940} height={340} rx={24} fill={K.ink} opacity={0.94} stroke={K.yellow} strokeWidth={8} />
          <T x={0} y={-90} s={58} c={K.yellow}>ПРАВИЛО №1</T>
          <T x={0} y={10} s={74} c="#fff">НЕ ИГНОРИРУЙ</T><T x={0} y={92} s={74} c={K.green}>УРНЫ У КАФЕ</T>
        </g>
      )}
    </g>
  );
};

/* ═══ 2. КАФЕ / ТОЛИК ═══ */
export const Sc2: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const tolikIn = id === "3.01" ? slide(bt, 1400, 800, 0.5) : 800;
  const after = ["3.03", "3.04", "3.05", "3.06", "t2"].includes(id);
  const split = id === "3.03" ? ramp(bt, 2.2, 3.4) : ["3.04", "3.05", "3.06", "t2"].includes(id) ? 1 : 0;
  return (
    <g>
      <Sky c1="#f6b36a" c2="#fde8c0" id="s2" />
      {par(cx, 0.3, <g><Block x={-250} w={380} h={780} c="#c8785a" cols={3} rows={8} lit={0.5} /><Block x={1050} w={400} h={740} c="#c8785a" cols={4} rows={8} lit={0.5} /></g>)}
      {/* фасад кафе */}
      <g>
        <rect x={-100} y={GY - 780} width={1300} height={780} fill="#e8d4a8" /><rect x={-100} y={GY - 780} width={1300} height={30} fill="#b89a68" />
        <rect x={80} y={GY - 600} width={400} height={400} rx={10} fill="#8ad0e0" stroke="#5a3a28" strokeWidth={10} />
        <rect x={110} y={GY - 570} width={340} height={340} fill="#ffffff22" />
        <g transform={`translate(280,${GY - 360})`}><path d="M -40 0 L 40 0 L 30 -50 L -30 -50 Z" fill="#fff" /><path d="M 40 -34 q 24 0 24 18 q 0 18 -24 18" fill="none" stroke="#fff" strokeWidth={8} /><path d="M -14 -66 q 8 -16 0 -30 M 12 -66 q 8 -16 0 -30" stroke="#fff" strokeWidth={6} fill="none" /></g>
        <rect x={640} y={GY - 560} width={280} height={560} rx={10} fill="#5a3a28" /><circle cx={880} cy={GY - 280} r={14} fill="#e8b830" />
        <g>{Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${-100 + i * 130} ${GY - 640} l 130 0 l -12 70 l -106 0 Z`} fill={i % 2 ? "#fff" : "#d84a3a"} />)}</g>
        <Sign x={560} y={GY - 730} w={560} h={110} text="КАФЕ «ЗАРЯ»" bg="#3a2a22" size={64} />
      </g>
      <Ground c="#8a8a94" c2="#5e5e6a" curb="#c0c0c8" />
      <Urn x={170} s={1.5} lid={id === "3.01" ? 0 : 0} />
      <Pile x={540} y={GY + 110} n={split > 0.5 ? 4 : 8} s={1.1} seed={3} />
      {split > 0.5 && <Pile x={760} y={GY + 110} n={4} s={1.1} seed={5} />}
      <Actor who="tolik" x={tolikIn} s={2.4} flip t={t} talking={sp === "tolik"} label={sp === "tolik"} pose={{ ...(id === "3.01" && bt < 0.55 ? walk(t) : {}), armR: sp === "tolik" ? [110, 30] : [20, 90], armL: [30, 80], expr: sp === "tolik" ? "angry" : "neutral" }} />
      <Actor who="gosha" x={400} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"} pose={{ look: 0.6, expr: id === "3.04" ? "surprised" : undefined, armR: sp === "gosha" ? [60, 50] : undefined, armL: id === "3.02" ? [70, 30] : undefined }} />
      {id === "t2" && <Pop text="−4 🍾" p={bt / 1.3} x={540} y={GY - 700} c={K.red} />}
    </g>
  );
};

/* ═══ 3. ПАРК / ПЕТРОВИЧ ═══ */
export const Sc3: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const toStop = id === "4.03" || id === "4.04";
  const gx = id === "4.03" ? slide(bt, 400, 700, 1.4) : id === "4.04" ? 700 : 400;
  const rows: [string, string, string][] = [["СТЕКЛО", "5", K.green], ["ПЛАСТИК", "12", K.blue], ["АЛЮМИНИЙ", "1", K.can]];
  return (
    <g>
      <Sky c1="#9ad2f0" c2="#e4f6e8" id="s3" />
      <Cloud x={300} y={260} t={t} /><Cloud x={900} y={360} s={0.7} t={t + 1} />
      {par(cx, 0.5, <g><Tree x={-100} s={1.5} c="#3a7a46" /><Tree x={980} s={1.6} c="#3a7a46" /><Tree x={1500} s={1.4} c="#3a7a46" /></g>)}
      {par(cx, 0.25, <g><Tree x={250} s={1.2} c="#58a85c" /><Tree x={780} s={1.1} c="#58a85c" /></g>)}
      <Ground c="#6aa860" c2="#4a8844" curb="#c8c0a0" detail="#00000018" />
      <g><rect x={1000} y={GY - 560} width={14} height={560} fill="#555" /><Sign x={1008} y={GY - 580} w={230} h={230} text="🚌" bg="#2a6ad8" size={110} /><rect x={820} y={GY - 360} width={400} height={20} fill="#555" /></g>
      <Bench x={730} />
      {id !== "4.04" && <Actor who="petro" x={730} y={GY - 20} s={2.4} t={t} talking={sp === "petro"} label={sp === "petro"} pose={{ sit: 1, armR: sp === "petro" ? [80, 60] : undefined }} />}
      <Pile x={760} y={GY + 100} n={id === "4.01" || id === "4.02" ? 1 : 5} s={1.1} seed={7} />
      <Actor who="gosha" x={gx} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"} pose={{ ...(id === "4.03" && bt < 1.4 ? walk(t) : {}), expr: id === "4.03" ? "happy" : id === "4.01" ? "worry" : undefined, armR: id === "4.01" ? [60, 100] : undefined }} />
      {id === "4.03" && bt > 1.5 && <Pop text="+5 ₽" p={(bt - 1.5) / 1.1} x={700} y={GY - 780} />}
      {id === "4.04" && (
        <g>
          {rows.map(([n, v, c], i) => {
            const k = eio(ramp(bt, 0.3 + i * 0.9, 0.7 + i * 0.9));
            return <g key={n} transform={`translate(${540 + (1 - k) * 600},${250 + i * 130})`} opacity={k}><rect x={-440} y={-52} width={880} height={110} rx={20} fill={K.ink} opacity={0.93} /><T x={-400} y={22} s={52} c="#fff" anchor="start">{n}</T><T x={400} y={26} s={78} c={c} anchor="end">×{v}</T></g>;
          })}
        </g>
      )}
    </g>
  );
};

/* ═══ интерьер пункта приёма (5 и 6) ═══ */
const Counter: React.FC<{ coins?: number; bottles: number; ledger?: boolean }> = ({ coins = 0, bottles }) => (
  <g>
    <rect x={560} y={GY - 330} width={720} height={330} fill="#7a5a3a" stroke="#3a2818" strokeWidth={8} /><rect x={540} y={GY - 360} width={760} height={42} rx={8} fill="#a07848" stroke="#3a2818" strokeWidth={6} />
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={590 + i * 112} y={GY - 300} width={92} height={290} fill="#00000018" />)}
    <Pile x={800} y={GY - 360} n={bottles} s={0.9} seed={2} />
    {Array.from({ length: coins }).map((_, i) => <Coin key={i} x={1040 + (i % 3) * 36} y={GY - 392 - Math.floor(i / 3) * 14} s={0.8} />)}
  </g>
);
const Interior: React.FC<{ cx: number; t: number; lamp: string }> = ({ cx, t, lamp }) => (
  <g>
    <rect x={-900} y={-300} width={2900} height={GY + 300} fill="#3d6a68" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-860 + i * 250} y={-300} width={14} height={GY + 300} fill="#00000014" />)}
    <rect x={-900} y={GY - 520} width={2900} height={30} fill="#2a4a48" />
    <Sign x={540} y={280} w={800} h={130} text="ПРИЁМ СТЕКЛОТАРЫ" bg="#1f3a38" fg={K.yellow} size={62} />
    <g transform="translate(120,600)"><rect x={-130} y={-60} width={380} height={440} rx={14} fill="#f4f0dc" stroke="#3a2818" strokeWidth={8} /><T x={60} y={0} s={46} c="#222">ЦЕНЫ</T><T x={-110} y={80} s={40} c="#222" anchor="start">стекло — 5</T><T x={-110} y={150} s={40} c="#222" anchor="start">пластик — 1,5</T><T x={-110} y={220} s={40} c="#222" anchor="start">алюминий — 8</T><T x={-110} y={300} s={34} c="#a02a1e" anchor="start">СКОЛОТОЕ НЕ БЕРЁМ</T></g>
    <g><rect x={-900} y={GY - 110} width={2900} height={110} fill="#2a3a38" /></g>
    <rect x={-900} y={GY} width={2900} height={1200} fill="#4a4a50" /><rect x={-900} y={GY} width={2900} height={20} fill="#00000040" />
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-860 + i * 260} y={GY + 40} width={200} height={1100} fill={i % 2 ? "#00000012" : "#ffffff08"} />)}
    {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-830 + i * 190} y={GY + 520 + (i % 3) * 120} width={90} height={12} rx={4} fill="#ffffff22" />)}
    <g transform="translate(420,170)"><rect x={-4} y={-170} width={8} height={170} fill="#222" /><ellipse cx={0} cy={4} rx={70} ry={26} fill={lamp} /><ellipse cx={0} cy={300} rx={320} ry={620} fill={lamp} opacity={0.08} /></g>
  </g>
);

/* ═══ 4. ПУНКТ ПРИЁМА ═══ */
export const Sc4: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const stage = ["5.01"].includes(id) ? 0 : 1;
  const calc: [string, string][] = [["4 × 5", "20"], ["12 × 1,5", "18"], ["1 × 8", "8"]];
  const showCalc = id === "5.05";
  const total = id === "5.05" && bt > 5.4;
  return (
    <g>
      <Interior cx={cx} t={t} lamp="#ffe28a" />
      <Counter bottles={id === "5.08" ? 0 : id === "5.07" || id === "5.06" ? 4 : 9} />
      <Actor who="recv" x={880} y={GY - 20} s={2.4} flip t={t} talking={sp === "recv"} label={sp === "recv"} pose={{ armR: sp === "recv" ? [100, 50] : [30, 60], armL: id === "5.03" ? [150, 30] : undefined, expr: sp === "recv" ? "angry" : "neutral" }} />
      <rect x={560} y={GY - 330} width={720} height={330} fill="#7a5a3a" opacity={0} />
      <Actor who="gosha" x={id === "5.08" ? slide(bt, 400, 460, 1) : 400} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"} pose={{ expr: id === "5.04" ? "angry" : id === "5.06" ? "happy" : id === "5.08" ? "happy" : undefined, armR: id === "5.04" ? [100, 80] : id === "5.02" ? [75, 40] : undefined, look: 0.4 }}
        heldL={id === "5.01" ? undefined : undefined} />
      {id === "5.01" && <Pile x={430} y={GY + 90} n={7} s={1.1} seed={11} />}
      {showCalc && (
        <g>{calc.map(([a, b], i) => { const k = eio(ramp(bt, 0.4 + i * 1.5, 0.8 + i * 1.5)); return <g key={a} transform={`translate(${540 - (1 - k) * 500},${660 + i * 112})`} opacity={k}><rect x={-400} y={-50} width={800} height={96} rx={18} fill={K.ink} opacity={0.94} /><T x={-360} y={22} s={56} c="#fff" anchor="start">{a}</T><T x={360} y={24} s={64} c={K.yellow} anchor="end">{b} ₽</T></g>; })}
          {total && <g transform={`translate(540,${1000})`} opacity={eio(ramp(bt, 5.4, 5.8))}><rect x={-400} y={-56} width={800} height={110} rx={20} fill={K.yellow} /><T x={-350} y={26} s={64} c={K.ink} anchor="start">ИТОГО</T><T x={350} y={28} s={84} c={K.ink} anchor="end">46 ₽</T></g>}</g>
      )}
      {id === "5.03" && <Stampx />}
      {id === "5.08" && bt > 0.2 && <Pop text="46 ₽" p={Math.min(1, bt / 1.6)} x={420} y={GY - 780} />}
    </g>
  );
};
const Stampx: React.FC = () => <g transform={`translate(840,${GY - 600}) rotate(-12)`}><rect x={-170} y={-52} width={340} height={96} rx={10} fill="none" stroke={K.red} strokeWidth={9} /><T x={0} y={26} s={64} c={K.red}>СКОЛ ✗</T></g>;

/* ═══ 5. ДВОРЫ ═══ */
export const Sc5: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const gx = id === "6.01" ? slide(bt, 150, 900, 5.2) : id === "6.02" ? 400 : id === "6.03" ? 400 : 400;
  const wGo = id === "6.04" && bt > 1.0;
  const bag = ["6.05"].includes(id);
  return (
    <g>
      <Sky c1="#8ac4ee" c2="#fbe6c0" id="s5" />
      <Cloud x={260} y={240} t={t} /><Cloud x={880} y={350} s={0.8} t={t + 2} />
      {par(cx, 0.45, <g><Block x={-400} w={520} h={980} c="#b5b0a2" cols={5} rows={10} /><Block x={1000} w={560} h={1040} c="#a8a396" cols={5} rows={10} /></g>)}
      {/* хрущёвка с балконами */}
      <g>
        <rect x={420} y={GY - 1000} width={900} height={1000} fill="#d4cdb8" /><rect x={420} y={GY - 1000} width={900} height={24} fill="#a09a88" />
        {Array.from({ length: 12 }).map((_, i) => { const c = i % 3, r = Math.floor(i / 3); return <rect key={i} x={460 + c * 290} y={GY - 940 + r * 220} width={120} height={150} rx={5} fill={(i * 7) % 5 < 2 ? "#f6cf78" : "#6a8aa0"} stroke="#5a5448" strokeWidth={6} />; })}
        <g><rect x={520} y={GY - 500} width={560} height={30} fill="#6a6458" /><g stroke="#6a6458" strokeWidth={8}>{Array.from({ length: 9 }).map((_, i) => <line key={i} x1={540 + i * 62} y1={GY - 500} x2={540 + i * 62} y2={GY - 620} />)}<line x1={520} y1={GY - 620} x2={1080} y2={GY - 620} /></g></g>
      </g>
      <Ground c="#8e8e86" c2="#6a6a64" curb="#bcb8a8" />
      <g transform={`translate(1040,${GY})`}><rect x={-100} y={-140} width={200} height={140} rx={8} fill="#3f8a56" stroke="#1d4a2a" strokeWidth={6} /><rect x={-112} y={-160} width={224} height={26} rx={6} fill="#2e6a40" /></g>
      {id !== "6.01" && !wGo && <Actor who="woman" x={800} y={GY - 500} s={1.5} t={t} talking={sp === "woman"} label={sp === "woman"} pose={{ armR: sp === "woman" ? [150, 30] : undefined }} />}
      {wGo && <Actor who="woman" x={800} y={GY - 500} s={1.5} t={t} talking pose={{ armR: [150, 30] }} />}
      {bag && <g><rect x={640} y={GY - 120} width={150} height={120} rx={20} fill="#e8e4d4" stroke="#000" strokeWidth={5} /><Pile x={715} y={GY - 112} n={5} s={0.9} seed={21} /></g>}
      <Actor who="gosha" x={gx} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"} pose={{ ...(id === "6.01" ? walk(t) : {}), lookUp: id === "6.02" || id === "6.03" ? 0.9 : 0, expr: id === "6.05" ? "happy" : undefined, armR: id === "6.03" ? [150, 30] : undefined, tilt: id === "6.02" ? -8 : 0 }} />
      {id === "6.01" && <g>{[0, 1, 2, 3, 4].map((i) => { const k = ramp(bt, 0.8 + i * 0.85, 1.3 + i * 0.85); return k > 0 ? <Pop key={i} text={`двор ${i + 1}`} p={Math.min(1, (bt - (0.8 + i * 0.85)) / 1.2)} x={300 + i * 130} y={GY - 560} c="#fff" size={54} /> : null; })}</g>}
    </g>
  );
};

/* ═══ 6. ВТОРАЯ СДАЧА ═══ */
export const Sc6: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const coins = id === "7.03" ? Math.round(5 * eio(ramp(bt, 0.5, 1.8))) : id === "7.04" ? 5 : 0;
  return (
    <g>
      <Interior cx={cx} t={t} lamp="#ffd0a0" />
      <Counter bottles={id === "7.03" || id === "7.04" ? 0 : 5} coins={coins} />
      <Actor who="recv" x={880} y={GY - 20} s={2.4} flip t={t} talking={sp === "recv"} label={sp === "recv"} pose={{ armR: sp === "recv" ? [100, 50] : [30, 60], expr: id === "7.01" ? "surprised" : undefined }} />
      <Actor who="gosha" x={400} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"} pose={{ expr: id === "7.02" || id === "7.04" ? "happy" : undefined, look: 0.4, armR: id === "7.04" ? [150, 40] : undefined }} />
      {id === "7.04" && <Pop text="71 ₽" p={Math.min(1, bt / 1.4)} x={420} y={GY - 780} />}
      {id === "7.03" && bt > 1.0 && <Pop text="+25 ₽" p={Math.min(1, (bt - 1.0) / 1.2)} x={760} y={GY - 700} />}
    </g>
  );
};

/* ═══ 7. ПЕКАРНЯ ═══ */
export const Sc7: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const eat = id === "8.03" && bt > 1.2;
  return (
    <g>
      <Sky c1="#ffcf8a" c2="#fff1d6" id="s7" />
      <rect x={-100} y={GY - 880} width={1300} height={880} fill="#e8a45a" /><rect x={-100} y={GY - 880} width={1300} height={36} fill="#b0702e" />
      <Sign x={540} y={GY - 780} w={820} h={150} text="ПЕКАРНЯ" bg="#7a3a1e" fg={K.yellow} size={104} />
      {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M ${-60 + i * 120} ${GY - 680} l 120 0 l -10 60 l -100 0 Z`} fill={i % 2 ? "#fff" : "#2e8a5a"} />)}
      <rect x={60} y={GY - 600} width={1000} height={420} rx={12} fill="#9ad8e8" stroke="#5a2a14" strokeWidth={10} opacity={0.5} />
      {[0, 1, 2, 3].map((i) => <Pie key={i} x={160 + i * 130} y={GY - 360 + (i % 2) * 6} s={1.5} />)}
      <g>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${580 + i * 150},${GY - 420}) rotate(${i * 8 - 8})`}><ellipse rx={64} ry={32} fill="#d89a4a" stroke="#7a4a18" strokeWidth={5} /></g>)}</g>
      <rect x={60} y={GY - 200} width={1000} height={20} fill="#7a3a1e" />
      <Ground c="#9a8e82" c2="#6e645a" curb="#c8bca8" />
      <rect x={520} y={GY - 250} width={640} height={250} fill="#7a3a1e" stroke="#4a2008" strokeWidth={8} /><rect x={500} y={GY - 280} width={680} height={36} rx={8} fill="#a05a2e" stroke="#4a2008" strokeWidth={6} />
      <Actor who="sell" x={860} y={GY - 20} s={2.4} flip t={t} talking={sp === "sell"} label={sp === "sell"} pose={{ armR: sp === "sell" ? [90, 60] : [30, 40] }} />
      <Actor who="gosha" x={400} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"} pose={{ expr: eat ? "happy" : undefined, armR: id === "8.02" ? [130, 50] : eat ? [150, 50] : id === "8.03" ? [100, 70] : undefined }}
        held={eat ? <g transform="rotate(180)"><Pie x={0} y={0} s={0.55} /></g> : undefined} />
      {id === "8.01" && <g><Coin x={640} y={GY - 310} s={0.9} /><Coin x={690} y={GY - 310} s={0.9} /><Coin x={740} y={GY - 310} s={0.9} /></g>}
      {(id === "8.02" || id === "8.03") && <Pop text="−30 ₽" p={Math.min(1, bt / 1.5)} x={420} y={GY - 780} c={K.red} />}
    </g>
  );
};

/* ═══ 8. ФИНАЛ ДНЯ ═══ */
export const Sc8: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({ x: (Math.sin(i * 12.9) * 0.5 + 0.5) * 1700 - 300, y: (Math.sin(i * 78.2) * 0.5 + 0.5) * 900, r: 2 + (i % 3) }));
  const items: [string, string][] = [["41 ₽", K.yellow], ["🥧 ПИРОЖОК", "#fff"], ["2 БУТЫЛКИ", K.green]];
  const show9_01 = id === "9.01";
  return (
    <g>
      <Sky c1="#0a0e2a" c2="#2a3068" id="s8" />
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} />)}
      <circle cx={850} cy={330} r={110} fill="#f4f0d0" /><circle cx={810} cy={300} r={100} fill="#0a0e2a" opacity={0.0} />
      {par(cx, 0.5, <g><Block x={-300} w={420} h={760} c="#161a3a" cols={4} rows={9} lit={0.5} /><Block x={640} w={380} h={640} c="#161a3a" cols={4} rows={8} lit={0.55} /><Block x={1100} w={420} h={800} c="#161a3a" cols={4} rows={9} lit={0.4} /></g>)}
      <Ground c="#2a2a3c" c2="#1a1a28" curb="#44445a" />
      <g><rect x={-900} y={GY - 250} width={2900} height={150} fill="#7a6e66" /><rect x={-900} y={GY - 250} width={2900} height={24} fill="#9a8e84" /><rect x={-900} y={GY - 126} width={2900} height={26} fill="#4a4240" /></g>
      <Steam x={200} y={GY - 250} t={t} s={1.3} /><Steam x={900} y={GY - 250} t={t + 2} n={4} />
      <g transform={`translate(520,${GY + 8})`}><path d="M -330 0 L -280 -26 L 330 -26 L 370 0 L 330 26 L -280 26 Z" fill="#9a7a4a" stroke="#5a3a18" strokeWidth={5} /></g>
      <Actor who="gosha" x={520} s={2.4} t={t} talking={sp === "gosha"} label={sp === "gosha"}
        pose={{ sit: 1, expr: id === "9.02" ? "happy" : undefined, lookUp: id === "9.03" ? 1 : 0, tilt: id === "9.03" ? -6 : 0, armR: id === "9.02" ? [80, 60] : undefined }} />
      <Pile x={820} y={GY + 40} n={2} s={1.1} seed={31} />
      {show9_01 && (
        <g>{items.map(([n, c], i) => { const k = eio(ramp(bt, 0.5 + i * 1.8, 0.9 + i * 1.8)); return <g key={n} transform={`translate(${540 + (1 - k) * 700},${240 + i * 130})`} opacity={k}><rect x={-420} y={-54} width={840} height={110} rx={20} fill={K.ink} opacity={0.93} stroke={c} strokeWidth={5} /><T x={0} y={24} s={66} c={c}>{n}</T></g>; })}</g>
      )}
      {id === "9.02" && <Pop text="+5 ₽" p={Math.min(1, bt / 1.2)} x={620} y={GY - 700} />}
    </g>
  );
};

/* ═══ 9. ТИЗЕР ═══ */
export const Sc9: React.FC<SP> = ({ t, bt, id, sp, cx }) => {
  const f = Math.sin(t * 9) > 0;
  return (
    <g>
      <Sky c1="#12162a" c2="#2a2e4e" id="s9" />
      <rect x={-900} y={-300} width={2900} height={GY + 300} fill={f ? "#ff2a3a" : "#2a6aff"} opacity={0.16} />
      {par(cx, 0.4, <g><Block x={-300} w={460} h={820} c="#1a1e3a" cols={4} rows={9} lit={0.4} /><Block x={780} w={500} h={900} c="#1a1e3a" cols={5} rows={10} lit={0.3} /></g>)}
      <Ground c="#262636" c2="#161620" curb="#44445a" />
      <g transform={`translate(${f ? 160 : 920},${GY - 700})`}><circle r={150} fill={f ? "#ff2a3a" : "#2a6aff"} opacity={0.35} /></g>
      <Actor who="cop" x={700} s={3.3} flip t={t} talking={sp === "narr" ? false : false} label={false} pose={{ armR: [100, 70], expr: "neutral" }} />
      <Actor who="gosha" x={230} s={2.1} t={t} pose={{ expr: "worry", look: 0.8 }} />
      <T x={700} y={GY - 1180} s={200} c={K.red}>?</T>
    </g>
  );
};

export const SCENES = [Sc0, Sc1, Sc2, Sc3, Sc4, Sc5, Sc6, Sc7, Sc8, Sc9];
export const SCENE_TITLES = ["ПОДЪЁМ", "УРНА №1", "КАФЕ", "ПАРК", "ПУНКТ ПРИЁМА", "ДВОРЫ", "ВТОРАЯ СДАЧА", "ПЕКАРНЯ", "ФИНАЛ ДНЯ", "СКОРО"];
