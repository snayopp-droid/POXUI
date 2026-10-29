import React from "react";
import { C, W, H, Txt, Dust, Glow, cl, lerp, ramp, eio } from "./art";
import {
  BunkerShell, Bunk, Table, Stool, Shelf, Radio, Geiger, Notebook, Clock, Tally, Hatch, BlastDoor, Ladder, Gauge, Fan, FilterCan, Pipe,
  Plant, FishTank, Tub, GrowLight, Jug, Barrel, Sack, Can, Jar, Mug, Cards, SkyRect, House, Tree, Skyline, Ground,
} from "./props";

export type SetP = { t?: number; lamp?: number; dim?: number; flicker?: number; tally?: number; tp?: number };

/** жилая комната: койки, стол, стеллаж, настенный календарь */
export const LivingRoom: React.FC<SetP & { fill?: number; children?: React.ReactNode; board?: string[]; noLamp?: boolean }> = ({ t = 0, lamp = 1, dim = 0, flicker = 0, tally = 0, tp = 1, fill = 1, children, board, noLamp }) => (
  <BunkerShell t={t} lampOn={lamp} dim={dim} flicker={flicker} lampX={noLamp ? null : 960}>
    <Bunk x={70} y={860} blanket="#6a4a5a" />
    <Bunk x={1540} y={860} blanket="#4a6a5a" />
    <Shelf x={430} y={760} w={340} rows={3} fill={fill} kind="mixed" />
    <Table x={1130} y={860} w={420} />
    <Stool x={1000} y={860} /><Stool x={1260} y={860} />
    <rect x={640} y={150} width={240} height={190} rx={4} fill="#2a3a36" stroke="#6a7a74" strokeWidth={6} />
    <Tally x={662} y={178} n={tally} p={tp} cols={3} />
    <Clock x={1420} y={250} r={44} t={t} speed={0.1} />
    {board && (
      <g transform="translate(1180,130)">
        <rect width={300} height={220} rx={4} fill="#1f2c28" stroke="#8a6a45" strokeWidth={8} />
        {board.map((l, i) => <Txt key={i} x={18} y={42 + i * 34} size={22} c={C.chalk} w={600} anchor="start" o={0.9}>{l}</Txt>)}
      </g>
    )}
    {children}
  </BunkerShell>
);

export const RadioRoom: React.FC<SetP & { radioOn?: boolean; crank?: number; geigerV?: number; children?: React.ReactNode }> = ({ t = 0, lamp = 1, dim = 0, flicker = 0, radioOn, crank = 0, geigerV = 0.2, children }) => (
  <BunkerShell t={t} lampOn={lamp} dim={dim} flicker={flicker} lampX={820}>
    <rect x={380} y={560} width={1080} height={24} rx={4} fill={C.woodL} />
    <rect x={400} y={584} width={20} height={280} fill={C.woodD} /><rect x={1420} y={584} width={20} height={280} fill={C.woodD} />
    <Radio x={760} y={560} t={t} on={radioOn} crank={crank} />
    <Geiger x={1130} y={560} v={geigerV} t={t} />
    <Notebook x={1300} y={548} rot={-4} s={0.6} lines={["DAY 1 - 700", "DAY 3 - 90"]} />
    <Shelf x={1540} y={760} w={300} rows={3} fill={0.8} kind="mixed" />
    <rect x={120} y={200} width={260} height={180} rx={4} fill="#2a3a36" stroke="#6a7a74" strokeWidth={6} />
    <Txt x={250} y={250} size={22} c={C.chalk} w={700}>EMERGENCY</Txt><Txt x={250} y={282} size={22} c={C.chalk} w={700}>CHANNEL 3</Txt>
    <Stool x={760} y={862} />
    {children}
  </BunkerShell>
);

export const StorageRoom: React.FC<SetP & { fill?: number; children?: React.ReactNode }> = ({ t = 0, lamp = 1, dim = 0, flicker = 0, fill = 1, children }) => (
  <BunkerShell t={t} lampOn={lamp} dim={dim} flicker={flicker} lampX={960}>
    <Shelf x={90} y={790} w={520} rows={4} fill={fill} kind="mixed" />
    <Shelf x={1300} y={790} w={520} rows={4} fill={fill} kind="mixed" />
    {[760, 860, 960, 1060, 1160].map((x, i) => <Barrel key={x} x={x} y={860 - (i % 2) * 6} c={i % 2 ? "#3a6a8a" : "#2f5a7a"} />)}
    {[700, 780, 860].map((x) => <Sack key={x} x={x} y={860} />)}
    {children}
  </BunkerShell>
);

export const AirRoom: React.FC<SetP & { co2?: number; children?: React.ReactNode; fanSpeed?: number }> = ({ t = 0, lamp = 1, dim = 0, flicker = 0, co2 = 0.3, children, fanSpeed = 1 }) => (
  <BunkerShell t={t} lampOn={lamp} dim={dim} flicker={flicker} lampX={1200}>
    <Pipe pts={[[160, 36], [160, 520], [560, 520]]} w={44} c="#6a7a84" />
    <FilterCan x={640} y={700} c="#4a6a8a" /><FilterCan x={760} y={700} c="#4a7a6a" /><FilterCan x={880} y={700} c="#6a6a8a" />
    <Pipe pts={[[640, 540], [640, 520], [1080, 520]]} w={30} c="#6a7a84" />
    <Fan x={1250} y={420} r={90} t={t} speed={fanSpeed} />
    <Gauge x={1560} y={360} v={co2} label="CO2" />
    <rect x={1480} y={470} width={170} height={36} rx={4} fill="#1a201e" />
    <Txt x={1565} y={496} size={20} c={co2 > 0.7 ? C.red : "#7fe08a"} w={800}>{Math.round(400 + co2 * 4600)} PPM</Txt>
    <rect x={1130} y={600} width={260} height={260} fill="#34413d" /><rect x={1140} y={610} width={240} height={30} fill="#2a3330" />
    {children}
  </BunkerShell>
);

export const WaterRoom: React.FC<SetP & { flow?: number; children?: React.ReactNode }> = ({ t = 0, lamp = 1, dim = 0, flicker = 0, flow = 1, children }) => (
  <BunkerShell t={t} lampOn={lamp} dim={dim} flicker={flicker} lampX={1000}>
    <rect x={120} y={380} width={300} height={480} rx={14} fill="#4a7a96" /><rect x={120} y={380} width={300} height={20} rx={10} fill="#ffffff22" />
    <Txt x={270} y={500} size={36} c="#d8eef8" w={800}>WATER</Txt>
    <Pipe pts={[[420, 700], [560, 700], [560, 860]]} w={26} c="#7ab4d0" />
    <g transform="translate(700,860)"><rect x={-30} y={-260} width={60} height={260} fill="#58655f" /><rect x={-50} y={-280} width={100} height={30} rx={8} fill="#6a7a74" />
      <g transform={`rotate(${Math.sin(t * 3) * 18 * flow} 0 -270)`}><rect x={-6} y={-330} width={12} height={70} fill="#c9a14a" /><rect x={-6} y={-330} width={90} height={12} fill="#c9a14a" /></g></g>
    {/* ручей с турбиной в нише пола */}
    <rect x={900} y={820} width={900} height={110} fill="#12201e" />
    <rect x={900} y={850} width={900} height={60} fill="#3a7a9a" opacity={0.85} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${940 + i * 90 + ((t * 80 * flow) % 90)} ${862 + (i % 3) * 14} q 14 -8 28 0`} stroke="#d8eef8" strokeWidth={3} fill="none" opacity={0.7} />)}
    <g transform="translate(1320,860)"><g transform={`rotate(${t * 220 * flow})`}>{[0, 60, 120, 180, 240, 300].map((a) => <rect key={a} x={-5} y={-62} width={10} height={62} fill="#c9a14a" transform={`rotate(${a})`} />)}<circle r={12} fill="#2a2e2c" /></g></g>
    <rect x={1380} y={500} width={150} height={150} rx={8} fill="#3a4642" /><rect x={1394} y={516} width={122} height={50} fill="#1a201e" />
    <Txt x={1455} y={550} size={26} c="#7fe08a" w={800}>{Math.round(48 + Math.sin(t * 2) * 2)} W</Txt>
    <Pipe pts={[[1450, 500], [1450, 80]]} w={8} c="#8a4a3a" />
    {children}
  </BunkerShell>
);

export const GardenRoom: React.FC<SetP & { grow?: number; children?: React.ReactNode }> = ({ t = 0, lamp = 0.5, dim = 0, flicker = 0, grow = 1, children }) => (
  <BunkerShell t={t} lampOn={lamp} dim={dim} flicker={flicker} lampX={null} tint="#3c4a50">
    {[0, 1].map((r) => (
      <g key={r}>
        <rect x={110} y={420 + r * 220} width={700} height={14} fill={C.metal} />
        <GrowLight x={460} y={300 + r * 220} w={620} t={t} />
        <Tub x={230} y={420 + r * 220} w={200} plants={3} />
        <Tub x={470} y={420 + r * 220} w={200} plants={3} mush={r === 1} />
        <Tub x={710} y={420 + r * 220} w={200} plants={3} />
      </g>
    ))}
    <rect x={110} y={400} width={14} height={460} fill={C.metal} /><rect x={806} y={400} width={14} height={460} fill={C.metal} />
    <FishTank x={1300} y={640} t={t} />
    <rect x={1180} y={640} width={240} height={220} fill="#34413d" />
    <rect x={1500} y={430} width={280} height={430} rx={14} fill="#4a7a96" /><Txt x={1640} y={640} size={34} c="#d8eef8" w={800}>WATER</Txt>
    <rect x={0} y={0} width={W} height={H} fill="#d86adc" opacity={0.05 + Math.sin(t * 2) * 0.004} />
    {children}
  </BunkerShell>
);

/** вход: люк сверху, лестница и стальная дверь */
export const DoorRoom: React.FC<SetP & { wheel?: number; open?: number; children?: React.ReactNode; hatchOpen?: number; light?: number }> = ({ t = 0, lamp = 1, dim = 0, flicker = 0, wheel = 0, open = 0, children, hatchOpen = 0, light = 0 }) => (
  <BunkerShell t={t} lampOn={lamp} dim={dim} flicker={flicker} lampX={1250}>
    <BlastDoor x={1480} y={860} wheel={wheel} open={open} s={1.0} />
    <Ladder x={560} y0={110} y1={860} />
    <g transform="translate(560,92)"><rect x={-90} y={-30} width={180} height={34} fill="#2a2e2c" /><ellipse cx={0} cy={0} rx={70} ry={14} fill="#58605a" /></g>
    {light > 0 && <g opacity={light}><defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9a0" stopOpacity={0.95} /><stop offset="1" stopColor="#ffe9a0" stopOpacity={0} /></linearGradient></defs>
      <polygon points="470,0 650,0 940,860 220,860" fill="url(#sun)" /><rect x={470} y={0} width={180} height={70} fill="#fff6c8" /></g>}
    {children}
  </BunkerShell>
);

/* ───── поверхность ───── */
export const KitchenHouse: React.FC<{ t?: number; alert?: number }> = ({ t = 0, alert = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#e6d5b0" />
    <rect y={760} width={W} height={320} fill="#b89a6a" />
    <rect y={756} width={W} height={10} fill="#8a6a45" />
    <rect x={1100} y={160} width={520} height={380} fill="#9ad0e8" stroke="#fff" strokeWidth={14} />
    <line x1={1360} y1={160} x2={1360} y2={540} stroke="#fff" strokeWidth={10} /><line x1={1100} y1={350} x2={1620} y2={350} stroke="#fff" strokeWidth={10} />
    <rect x={1100} y={420} width={520} height={120} fill="#8ac070" opacity={0.7} />
    <rect x={120} y={420} width={760} height={30} fill="#f4ecd8" /><rect x={120} y={450} width={760} height={310} fill="#7a9a8a" />
    {[0, 1, 2].map((i) => <rect key={i} x={140 + i * 250} y={470} width={230} height={280} rx={4} fill="#6a8a7a" stroke="#58786a" strokeWidth={4} />)}
    <rect x={120} y={160} width={760} height={210} fill="#e8dcc0" /><rect x={120} y={160} width={760} height={210} fill="none" stroke="#b8a888" strokeWidth={6} />
    <Mug x={300} y={420} /><Mug x={420} y={420} c="#c9d8e0" />
    <rect x={640} y={330} width={90} height={90} rx={8} fill="#2a2e2c" /><rect x={654} y={344} width={62} height={34} fill="#6a8a6a" />
    <rect x={1250} y={770} width={420} height={26} rx={4} fill={C.woodL} /><rect x={1270} y={796} width={20} height={200} fill={C.woodD} /><rect x={1630} y={796} width={20} height={200} fill={C.woodD} />
    <rect x={0} y={0} width={W} height={H} fill="#ff3a2a" opacity={alert * (0.12 + 0.12 * Math.sin(t * 14))} />
  </g>
);

export const Yard: React.FC<{ t?: number; sky?: "day" | "dusk" | "grey" | "gold"; hatchOpen?: number; wheel?: number; ash?: number; houseLit?: boolean; flash?: number }> = ({ t = 0, sky = "day", hatchOpen = 0, wheel = 0, ash = 0, houseLit = true, flash = 0 }) => {
  const S = { day: ["#7fb8e0", "#bfe0f0", "#f4f0d8"], dusk: ["#3a3a6a", "#a8587a", "#f0a070"], grey: ["#5a625f", "#8a928c", "#a8aca2"], gold: ["#f0b060", "#f8d88a", "#fff2c0"] }[sky];
  return (
    <g>
      <SkyRect top={S[0]} mid={S[1]} bot={S[2]} h={700} />
      {sky === "gold" && <circle cx={1450} cy={480} r={130} fill="#fff6c8" opacity={0.8} />}
      <Skyline y={700} c={sky === "grey" ? "#5a625f" : sky === "day" ? "#9ab4c4" : "#4a4a6a"} n={12} seed={4} h={200} lit={sky === "dusk" ? 0.7 : 0} />
      <Ground y={700} c={sky === "grey" ? "#6a6a60" : sky === "gold" ? "#8aa860" : "#5a8a50"} c2={sky === "grey" ? "#5a5a52" : "#4a7a42"} />
      <rect x={0} y={690} width={W} height={14} fill="#00000015" />
      <House x={400} y={760} s={1.25} lit={houseLit} c={sky === "grey" ? "#a8a090" : "#c9b48a"} />
      <Tree x={1000} y={780} s={1.1} dead={sky === "grey"} />
      <Tree x={1760} y={760} s={1.3} dead={sky === "grey"} />
      <g>
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={760 + i * 34} y={650} width={22} height={80} fill={sky === "grey" ? "#6a6a60" : "#e8dcc0"} />)}
      </g>
      <Hatch x={1280} y={930} open={hatchOpen} wheel={wheel} s={1.3} />
      {ash > 0 && <Dust t={t} n={90} c="#c8c8c0" o={0.5 * ash} speed={90} seed={7} r={3.4} />}
      {flash > 0 && <rect width={W} height={H} fill="#fff" opacity={flash} />}
    </g>
  );
};

export const Wasteland: React.FC<{ t?: number; green?: number; ash?: number; gold?: number }> = ({ t = 0, green = 0, ash = 1, gold = 0 }) => (
  <g>
    <SkyRect top={gold ? "#e8b060" : "#4a504e"} mid={gold ? "#f4d088" : "#7a807a"} bot={gold ? "#fff0bc" : "#a0a498"} h={760} />
    {gold > 0 && <circle cx={1500} cy={420} r={140} fill="#fff6c8" opacity={0.85 * gold} />}
    <Skyline y={720} c={gold ? "#8a9a88" : "#3a403c"} n={14} seed={9} h={260} />
    <rect x={0} y={720} width={W} height={H} fill={gold ? "#8a9a5a" : "#58584e"} />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${i * 140 - 50} ${780 + (i % 4) * 50} q 30 -20 60 0`} stroke={gold ? "#6a8a4a" : "#46463e"} strokeWidth={5} fill="none" />)}
    <Tree x={240} y={820} s={1.2} dead={!gold} /><Tree x={1560} y={830} s={1.4} dead={!gold} />
    <rect x={820} y={900} width={380} height={6} fill="#3a3a34" />
    {green > 0 && <g transform="translate(1000,900) scale(1.8)"><path d={`M 0 0 Q ${-6 * green} ${-30 * green} ${-14 * green} ${-44 * green}`} stroke="#6ac070" strokeWidth={6} fill="none" strokeLinecap="round" /><ellipse cx={-18 * green} cy={-46 * green} rx={14 * green} ry={7 * green} fill="#6ac070" transform={`rotate(-30 ${-18 * green} ${-46 * green})`} /><path d={`M 0 0 Q ${8 * green} ${-20 * green} ${18 * green} ${-30 * green}`} stroke="#6ac070" strokeWidth={5} fill="none" strokeLinecap="round" /><ellipse cx={22 * green} cy={-32 * green} rx={11 * green} ry={6 * green} fill="#80d080" /></g>}
    {ash > 0 && <Dust t={t} n={120} c="#d0d0c8" o={0.5 * ash} speed={70} seed={3} r={3.2} />}
  </g>
);

/** подземный разрез: слои земли, бункер, лестница */
export const Cutaway: React.FC<{ t?: number; p?: number; labels?: boolean }> = ({ t = 0, p = 1, labels = true }) => (
  <g>
    <rect width={W} height={H} fill="#2a2018" />
    <SkyRect top="#5a88b0" mid="#9ac0d8" bot="#dfeaf0" h={330} />
    <rect y={330} width={W} height={H} fill="#6a4a30" />
    <rect y={330} width={W} height={120} fill="#7a5a38" />
    <rect y={450} width={W} height={120} fill="#5e4430" />
    <rect y={570} width={W} height={520} fill="#4a362a" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 211) % W} cy={360 + ((i * 97) % 700)} r={5 + (i % 4) * 3} fill="#00000022" />)}
    <House x={420} y={330} s={1.1} />
    <Tree x={1700} y={330} s={1.0} />
    <rect x={560} y={330} width={20} height={150 * eio(cl(p * 2))} fill="#8a8f88" opacity={0.0} />
    {/* бункер */}
    <g opacity={eio(cl(p * 2.2))}>
      <rect x={640} y={540} width={760} height={300} fill="#8a8f88" />
      <rect x={668} y={568} width={704} height={244} fill="#3a4a46" />
      <Ladder x={730} y0={338} y1={812} />
      <Hatch x={730} y={338} s={0.5} />
      <rect x={760} y={780} width={560} height={14} fill="#26302d" />
      <rect x={800} y={690} width={120} height={90} fill="#6a4a5a" /><rect x={960} y={720} width={150} height={60} fill="#a8845a" /><rect x={1170} y={650} width={130} height={130} fill="#4a7a96" />
      <Lamp2 x={1000} y={568} />
    </g>
    {labels && <g opacity={ramp(p, 0.5, 0.8)}>
      <line x1={1480} y1={330} x2={1480} y2={540} stroke="#fff" strokeWidth={4} strokeDasharray="10 8" />
      <Txt x={1560} y={440} size={46} c="#ffe9a0" w={800} anchor="start">4 m</Txt>
      <Txt x={1020} y={880} size={34} c="#e8dcc0" w={800}>REINFORCED CONCRETE</Txt>
      <path d="M 1200 540 l 0 -60" stroke="#fff" strokeWidth={3} />
    </g>}
  </g>
);
const Lamp2: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g><line x1={x} y1={y} x2={x} y2={y + 36} stroke="#111" strokeWidth={3} /><circle cx={x} cy={y + 44} r={9} fill="#f6cf78" /><Glow x={x} y={y + 60} r={200} o={0.5} id="cutlamp" /></g>
);

export { Jug, Barrel, Sack, Can, Jar, Mug, Cards, Gauge, Fan, Plant, FishTank, Tub, Stool, Table, Shelf, Hatch, Ladder, Notebook, Geiger, Radio, Clock, Tally, Dust, ramp, lerp, eio, cl };
