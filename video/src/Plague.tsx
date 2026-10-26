import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  CAPS, DURATION_SEC, FPS, OFF, SCENES, VO_FILE, sceneAt, type Cap, type SceneId,
} from "./timeline11";
import {
  Chip, Defs, FONT, H, Hallway, Hazmat, Human, Lock, Lock3, QuiltDoor, RuleTag, Spire, Sticky, Tower, W,
  cl, easeInOut, easeOut, pop, ramp, rnd,
} from "./PlagueArt";

type SP = { lt: number; dur: number; t: number };

const RED = "#d81e1e";
const YEL = "#f4c82a";
const JACKET = "#9b2c33";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);

const Backdrop: React.FC<{ a?: string; b?: string; grid?: boolean }> = ({ a = "#0e1630", b = "#1b2646", grid = true }) => (
  <g>
    <defs>
      <linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#bd)" />
    {grid && Array.from({ length: 25 }).map((_, i) => <path key={i} d={`M0,${i * 80} H${W}`} stroke="#ffffff" strokeOpacity="0.035" strokeWidth={2} />)}
  </g>
);

const Dots: React.FC<{ color?: string; op?: number }> = ({ color = "#2c4a44", op = 0.8 }) => (
  <g>
    {Array.from({ length: 11 }).map((_, i) => Array.from({ length: 20 }).map((__, j) => (
      <circle key={`${i}-${j}`} cx={50 + i * 100 + (j % 2) * 50} cy={60 + j * 100} r={4} fill={color} opacity={op} />
    )))}
  </g>
);

/* ------------------------------------------------------------------ */
/* Сцены                                                                */
/* ------------------------------------------------------------------ */
const SNight: React.FC<SP> = ({ t }) => (
  <Svg>
    <defs>
      <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070b1f" /><stop offset="1" stopColor="#1a2c52" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#nsky)" />
    {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 90) * 900} r={1 + rnd(i + 3) * 2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))} />)}
    <circle cx={800} cy={330} r={150} fill="#cfe0ff" opacity="0.12" />
    <circle cx={800} cy={330} r={52} fill="#f2f6ff" />
    {Array.from({ length: 14 }).map((_, i) => {
      const h = 260 + rnd(i * 2) * 360;
      return (
        <g key={i}>
          <rect x={i * 84 - 20} y={1560 - h} width={76} height={h} fill="#101a35" />
          {Array.from({ length: 6 }).map((__, k) => <rect key={k} x={i * 84 - 8 + (k % 2) * 30} y={1560 - h + 30 + Math.floor(k / 2) * 60 + rnd(i + k) * 80} width={14} height={18} fill="#e8c26a" opacity={rnd(i * 5 + k) > 0.55 ? 0.7 : 0} />)}
        </g>
      );
    })}
    <Spire x={160} y={1560} s={0.78} />
    <Tower x={330} y={620} w={430} h={960} cols={7} rows={22} t={t} body="#38457a" seed={4} litP={0.55} />
    <rect y={1560} width={W} height={360} fill="#080c1a" />
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={((i * 330 + t * 26 * (1 + (i % 2))) % 1500) - 200} cy={1560 + (i % 3) * 70} rx={420} ry={120} fill="#7ee04a" opacity="0.2" filter="url(#plg-blur)" />
    ))}
    <rect y={1380} width={W} height={540} fill="url(#plg-green)" opacity={0.5} />
  </Svg>
);

const CardA: React.FC<{ k: number }> = ({ k }) => (
  <Sticky x={540} y={380} w={800} h={300} rot={-2} fill="#a9c0d6" k={k}>
    <Tower x={-340} y={-110} w={110} h={210} cols={4} rows={12} t={0} body="#e4ecf5" lit="#7aa0c8" dark="#9db4c8" litP={0.4} flicker={false} />
    <text x={80} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill="#1a2330">25</text>
    <Chip x={90} y={90} text="ЭТАЖЕЙ" size={30} />
  </Sticky>
);
const CardB: React.FC<{ k: number }> = ({ k }) => (
  <Sticky x={540} y={760} w={800} h={300} rot={1.6} fill="#d9a85a" k={k}>
    <g transform="translate(-300 -110)">
      <QuiltDoor x={0} y={0} w={110} h={210} />
      <Lock3 x={86} y={60} s={0.4} />
    </g>
    <text x={90} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#1a2330">СТАЛЬ</text>
    <Chip x={90} y={92} text="3 ЗАМКА" size={30} />
  </Sticky>
);
const CardC: React.FC<{ k: number; lt: number }> = ({ k, lt }) => (
  <Sticky x={540} y={1140} w={800} h={300} rot={-1} fill="#f0ead8" k={k}>
    <rect x={-340} y={90} width={150} height={16} fill="#6a8a5a" />
    <rect x={-310} y={-110} width={50} height={200} fill="#c8d0dc" />
    <path d={`M-210,90 V${90 - 190 * easeOut(ramp(lt, 2.6, 3.6))}`} stroke={RED} strokeWidth={8} />
    <polygon points={`-224,${-90 + (1 - easeOut(ramp(lt, 2.6, 3.6))) * 180} -210,${-112 + (1 - easeOut(ramp(lt, 2.6, 3.6))) * 180} -196,${-90 + (1 - easeOut(ramp(lt, 2.6, 3.6))) * 180}`} fill={RED} />
    <text x={90} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill="#1a2330">≈60 М</text>
    <Chip x={90} y={92} text="20 ЭТАЖ" size={30} />
  </Sticky>
);

const SCards: React.FC<SP> = ({ lt }) => (
  <Svg>
    <Backdrop />
    <CardA k={pop(lt, 0.15)} />
    <CardB k={pop(lt, 1.4)} />
    <CardC k={pop(lt, 2.5)} lt={lt} />
  </Svg>
);

const SDoor: React.FC<SP> = ({ lt, dur, t }) => {
  const fade = ramp(lt, dur - 1.5, dur - 0.1);
  return (
    <Svg>
      <rect width={W} height={H} fill="#10151f" />
      <Dots color="#232c3d" op={0.9} />
      <rect y={1480} width={W} height={440} fill="#0a0c12" />
      <rect x={270} y={250} width={540} height={1240} fill="#1b110c" />
      <QuiltDoor x={290} y={270} w={500} h={1200} />
      <Lock3 x={730} y={780} s={1.15} />
      <circle cx={540} cy={330} r={14} fill="#0a0a0a" stroke="#b79a4a" strokeWidth={4} />
      <rect x={730} y={700} width={0} height={0} />
      <rect x={300} y={1040} width={120} height={20} rx={10} fill="#c9a94a" />
      <rect width={W} height={H} fill="url(#plg-vig)" />
      <circle cx={540} cy={800} r={560 + Math.sin(t * 2) * 10} fill="url(#plg-red)" opacity={ramp(lt, 1.2, 3.4) * 0.7} />
      <rect width={W} height={H} fill="#000" opacity={fade * 0.88} />
    </Svg>
  );
};

const Tram: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={420} height={110} rx={18} fill="#c92b2b" />
    <rect x={0} y={62} width={420} height={14} fill="#f1e7d2" />
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={24 + i * 64} y={16} width={46} height={40} rx={6} fill="#ffe9a8" />)}
    <rect x={0} y={96} width={420} height={22} rx={6} fill="#26222a" />
    <circle cx={64} cy={124} r={16} fill="#1a1a1a" /><circle cx={356} cy={124} r={16} fill="#1a1a1a" />
    <path d="M210,0 L250,-60 M250,-60 H170" stroke="#26222a" strokeWidth={5} />
  </g>
);

const SCity: React.FC<SP> = ({ lt, dur, t }) => (
  <Svg>
    <defs>
      <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b2f78" /><stop offset="0.55" stopColor="#d96a5a" /><stop offset="1" stopColor="#f6b86a" /></linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#msky)" />
    <circle cx={300} cy={1150} r={260} fill="#ffd9a0" opacity="0.28" />
    {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={i * 90 - 30} y={1250 - rnd(i + 8) * 360} width={84} height={700} fill="#4a3a6e" />)}
    <Spire x={910} y={1500} s={0.7} col="#2d2352" />
    <Tower x={290} y={560} w={440} h={920} cols={7} rows={21} t={t} body="#7a6aa6" lit="#ffe39a" dark="#3a3260" seed={9} litP={0.5} />
    <g transform={`translate(0 ${(1 - easeOut(ramp(lt, 0.4, 1.4))) * -40})`} opacity={ramp(lt, 0.4, 1.0)}>
      <rect x={730} y={760} width={0} height={0} />
      <Chip x={850} y={1060} text="20 ЭТАЖ" size={30} k={pop(lt, 1.8)} />
    </g>
    <rect y={1480} width={W} height={440} fill="#2a2433" />
    <rect y={1480} width={W} height={10} fill="#55485f" />
    <path d={`M0,1300 Q540,1360 ${W},1300`} stroke="#1b1822" strokeWidth={4} fill="none" />
    <Tram x={-460 + (lt / dur) * 2200} y={1380} />
    <text x={W / 2} y={460} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={118} fill="#fff" letterSpacing={10} opacity={ramp(lt, 0, 0.6)} stroke="#00000055" strokeWidth={2}>МОСКВА</text>
    <rect x={W / 2 - 110} y={490} width={220 * easeOut(ramp(lt, 0.3, 1.0))} height={8} fill={YEL} />
  </Svg>
);

const SHall: React.FC<SP> = ({ lt, t }) => {
  const door = easeInOut(ramp(lt, 2.0, 2.7)) * (1 - easeInOut(ramp(lt, 3.9, 4.7)));
  const lx = lt < 2.2 ? 520 + Math.min(lt, 1) * 20 : 520 + 380 * easeInOut(ramp(lt, 2.2, 3.4));
  const through = ramp(lt, 3.1, 3.6);
  const wave = lt > 3.2 && lt < 4.7 ? Math.sin(lt * 9) * 14 : 0;
  return (
    <Svg>
      <Hallway door={door} t={t} />
      <Human x={300} y={1500} s={1.08} t={t} mood="smile" armR={lt > 3.2 && lt < 4.7 ? [-150 + wave, -20] : [-4, -4]} bob={Math.sin(t * 2) * 3} look={lt > 2.2 ? 1.5 : 0} />
      <g opacity={1 - through}>
        <Human x={lx} y={1500} s={0.58} t={t} hs="pig" hair="#c4521e" top="#223a66" skirt bottom="#223a66" bag="#c92b2b" legSw={lt > 2.2 ? Math.sin(t * 12) * 14 : 0} mood="smile" flip={false} seed={2} />
      </g>
      <Chip x={540} y={640} text="ЛИЗА · 8 ЛЕТ" size={26} k={pop(lt, 1.2)} />
    </Svg>
  );
};

const SClock: React.FC<SP> = ({ lt, t }) => {
  const hand = (a: number, len: number, w: number, c: string) => (
    <line x1={540} y1={760} x2={540 + Math.sin((a * Math.PI) / 180) * len} y2={760 - Math.cos((a * Math.PI) / 180) * len} stroke={c} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <Svg>
      <rect width={W} height={H} fill="#1a2336" />
      <Dots color="#27334c" />
      <rect y={1450} width={W} height={470} fill="#161412" />
      <rect x={190} y={1180} width={190} height={270} fill="#101722" />
      <circle cx={540} cy={776} r={262} fill="#000" opacity="0.4" />
      <circle cx={540} cy={760} r={250} fill="#f6f2e6" stroke="#2a2a30" strokeWidth={12} />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={540 + Math.sin((i * Math.PI) / 6) * 214} y1={760 - Math.cos((i * Math.PI) / 6) * 214} x2={540 + Math.sin((i * Math.PI) / 6) * 236} y2={760 - Math.cos((i * Math.PI) / 6) * 236} stroke="#222" strokeWidth={6} />)}
      {hand(320, 130, 14, "#222")}
      {hand(240 + ramp(lt, 0, 1) * 0, 190, 9, "#222")}
      {hand((t * 360) % 360, 205, 4, RED)}
      <circle cx={540} cy={760} r={12} fill="#222" />
      <text x={540} y={1180} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#fff" opacity={ramp(lt, 0.1, 0.5)}>10:40</text>
    </Svg>
  );
};

const SSchool: React.FC<SP> = ({ lt, t }) => {
  const alarm = lt < 3.1 ? 0.5 + 0.5 * Math.sin(t * 12) : 0;
  const banner = ramp(lt, 0.0, 0.35) * (1 - ramp(lt, 2.7, 3.1));
  const windows: React.ReactNode[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const x = 180 + c * 180;
    const y = 640 + r * 190;
    const kid = rnd(r * 4 + c + 21) > 0.35;
    windows.push(
      <g key={`${r}-${c}`}>
        <rect x={x} y={y} width={130} height={130} fill="#1c2a48" stroke="#f1e7d2" strokeWidth={8} />
        {kid && <g transform={`translate(${x + 65} ${y + 78})`}><circle r={28} fill={["#e9b995", "#d9a886", "#f0c9a8"][(r + c) % 3]} /><path d="M-28,-8 Q0,-48 28,-8 Q0,-24 -28,-8Z" fill={["#4a2c1e", "#c4521e", "#2a2a2a", "#d9a62a"][(r * 3 + c) % 4]} /><circle cx={-9} cy={0} r={3} fill="#222" /><circle cx={9} cy={0} r={3} fill="#222" /></g>}
        <path d={`M${x + 65},${y} V${y + 130} M${x},${y + 65} H${x + 130}`} stroke="#f1e7d2" strokeWidth={5} />
      </g>,
    );
  }
  return (
    <Svg>
      <defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3250" /><stop offset="1" stopColor="#4a4e6a" /></linearGradient></defs>
      <rect width={W} height={H} fill="url(#ssky)" />
      <rect x={110} y={560} width={860} height={760} fill="#b0604a" />
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M110,${580 + i * 46} H970`} stroke="#8a4a38" strokeWidth={2} opacity="0.6" />)}
      <rect x={90} y={520} width={900} height={46} fill="#7a3d30" />
      {windows}
      <rect x={410} y={1180} width={260} height={140} fill="#2a1e1a" />
      <rect x={430} y={1120} width={220} height={50} fill="#2c64b0" />
      <text x={540} y={1158} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff" letterSpacing={3}>ШКОЛА</text>
      {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={40 + i * 42} y={1330} width={10} height={190} fill="#101218" />)}
      <rect x={20} y={1330} width={W} height={10} fill="#101218" /><rect x={20} y={1500} width={W} height={10} fill="#101218" />
      <rect y={1510} width={W} height={410} fill="#1a1a22" />
      <g opacity={ramp(lt, 3.1, 3.5)} transform={`translate(0 ${(1 - easeOut(ramp(lt, 3.1, 3.6))) * -30})`}>
        <g transform="rotate(-5 540 1400)">
          <rect x={-20} y={1360} width={W + 40} height={90} fill={YEL} />
          {Array.from({ length: 16 }).map((_, i) => <polygon key={i} points={`${-20 + i * 80},1360 ${20 + i * 80},1360 ${-20 + i * 80 + 40},1450 ${-20 + i * 80},1450`} fill="#111" />)}
          <rect x={340} y={1372} width={400} height={66} fill={YEL} />
          <text x={540} y={1420} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#111" letterSpacing={3}>ВХОД ЗАКРЫТ</text>
        </g>
        <Lock x={540} y={1500} s={1} />
      </g>
      <rect width={W} height={H} fill="#d81e1e" opacity={alarm * 0.22} />
      <g opacity={banner} transform={`translate(0 ${(1 - easeOut(ramp(lt, 0, 0.35))) * -80})`}>
        <rect x={0} y={150} width={W} height={380} fill="#12141c" opacity="0.88" />
        <rect x={0} y={150} width={W} height={8} fill={RED} /><rect x={0} y={522} width={W} height={8} fill={RED} />
        <text x={W / 2} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#ffb4a8" letterSpacing={8}>ЭКСТРЕННОЕ СООБЩЕНИЕ</text>
        <text x={W / 2} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill="#fff">В ГОРОДЕ</text>
        <text x={W / 2} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={RED} letterSpacing={6}>ЧУМА</text>
      </g>
    </Svg>
  );
};

const SPhone: React.FC<SP> = ({ lt, t }) => {
  const status2 = lt < 1.5 ? "ВЫЗОВ.." : lt < 2.4 ? "ЗАНЯТО" : lt < 3.25 ? "ВЫЗОВ.." : lt < 4.6 ? "ГУДКИ.." : "ВЫЗОВ ПРЕРВАН";
  const bars = lt < 4.6 ? 4 : 0;
  const off = ramp(lt, 4.55, 4.7);
  const flick = lt > 4.5 && lt < 5.4 ? (Math.sin(t * 40) > 0 ? 0.2 : 0) : 0;
  const bob = Math.sin(t * 2.2) * 5;
  return (
    <Svg>
      <rect width={W} height={H} fill="#46557a" />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 80} y={0} width={40} height={H} fill="#fff" opacity="0.04" />)}
      <rect x={730} y={720} width={300} height={600} fill="#a9c6e0" />
      <path d="M880,720 V1320 M730,1020 H1030" stroke="#fff" strokeWidth={10} />
      <rect x={690} y={680} width={40} height={700} fill="#7a3d30" /><rect x={1000} y={680} width={40} height={700} fill="#7a3d30" />
      <g transform={`translate(0 ${bob})`}>
        <path d="M-40,1920 Q-20,1180 450,1150 Q900,1180 940,1920Z" fill="#2f9c8f" />
        <rect x={380} y={1040} width={100} height={120} fill="#e9b995" />
      </g>
      <g transform={`translate(0 ${bob})`}>
        <g transform="translate(430 840)">
          <HeadBig t={t} scared={lt > 4.6} />
        </g>
        <g transform="translate(690 830) rotate(14)">
          <rect x={-28} y={-100} width={58} height={190} rx={14} fill="#16161c" />
          <rect x={-22} y={-90} width={46} height={150} rx={8} fill={lt > 4.6 ? "#1a1a1a" : "#2a4a7a"} />
        </g>
        <path d="M720,1010 Q780,930 710,860" stroke="#2f9c8f" strokeWidth={70} fill="none" strokeLinecap="round" />
        <circle cx={700} cy={850} r={34} fill="#e9b995" />
      </g>
      <g transform="translate(540 250)">
        <rect x={-380} y={-86} width={760} height={172} rx={34} fill="#12161f" stroke="#2a3140" strokeWidth={4} />
        <circle cx={-290} cy={0} r={52} fill="#1d2b4a" stroke={lt < 4.6 ? "#4a7fd4" : "#555"} strokeWidth={5} opacity={lt < 4.6 ? 0.7 + 0.3 * Math.sin(t * 6) : 1} />
        <text x={-290} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#fff">57</text>
        <text x={-200} y={-14} fontFamily={FONT} fontWeight={800} fontSize={32} fill="#fff">ШКОЛА №57</text>
        <text x={-200} y={34} fontFamily={FONT} fontWeight={800} fontSize={30} fill={lt >= 4.6 ? "#ff5a4a" : lt < 3.25 && lt >= 1.5 && lt < 2.4 ? "#ffb04a" : "#6aa8ff"}>{status2}</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={260 + i * 22} y={24 - i * 14} width={12} height={14 + i * 14} fill={i < bars ? "#fff" : "#444"} />)}
      </g>
      <rect width={W} height={H} fill="#05070e" opacity={off * 0.7 + flick} />
    </Svg>
  );
};

const HeadBig: React.FC<{ t: number; scared: boolean }> = ({ t, scared }) => (
  <g transform="scale(3.4)">
    <circle cx={-14} cy={-70} r={26} fill="#4a2c1e" />
    <ellipse cx={0} cy={0} rx={52} ry={56} fill="#e9b995" />
    <path d="M-56,-4 Q-62,-64 0,-62 Q62,-64 56,-4 Q30,-34 -6,-28 Q-40,-22 -56,-4Z" fill="#4a2c1e" />
    <ellipse cx={-20} cy={0} rx={7} ry={9} fill="#fff" /><ellipse cx={20} cy={0} rx={7} ry={9} fill="#fff" />
    <circle cx={-20 + Math.sin(t) * 1.5} cy={1} r={4.5} fill="#1a120d" /><circle cx={20 + Math.sin(t) * 1.5} cy={1} r={4.5} fill="#1a120d" />
    <path d={scared ? "M-30,-18 L-10,-26 M10,-26 L30,-18" : "M-30,-20 L-10,-24 M10,-24 L30,-20"} stroke="#2a1a12" strokeWidth={3.4} strokeLinecap="round" />
    <path d={scared ? "M-10,30 Q0,40 10,30 Z" : "M-10,32 Q0,24 10,32"} fill={scared ? "#6a2a2a" : "none"} stroke="#8a3a30" strokeWidth={3} strokeLinecap="round" />
  </g>
);

const SBoard: React.FC<SP> = ({ lt, t }) => (
  <Svg>
    <Backdrop />
    <RuleTag n={1} y={380} k={pop(lt, 0.1)} />
    <Sticky x={540} y={900} w={820} h={600} rot={-1.5} fill="#d9a85a" k={pop(lt, 0.3)}>
      {[0, 1, 2].map((i) => <circle key={i} cx={-250} cy={20} r={80 + ((t * 40 + i * 40) % 120)} fill="none" stroke="#7a5a2a" strokeWidth={4} opacity={1 - ((t * 40 + i * 40) % 120) / 120} />)}
      <Human x={-250} y={170} s={0.36} t={t} mood="calm" top="#2f9c8f" armR={[-30, -90]} />
      <text x={150} y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#1a1a1a">НЕ</text>
      <text x={150} y={96} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={82} fill={RED}>ПАНИКОВАТЬ</text>
    </Sticky>
  </Svg>
);

const SMap: React.FC<SP> = ({ lt }) => {
  const grow = easeOut(ramp(lt, 0.2, 2.6));
  const rays = Array.from({ length: 14 }).map((_, i) => (i / 14) * Math.PI * 2);
  return (
    <Svg>
      <Backdrop />
      <RuleTag n={1} y={330} />
      <Sticky x={540} y={860} w={920} h={780} rot={-1} fill="#f2ecda" k={1}>
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M-440,${-370 + i * 80} H440 M${-440 + i * 98},-380 V380`} stroke="#d8cfb4" strokeWidth={3} />)}
        <path d="M-460,200 Q-200,120 0,230 T460,160 V260 Q200,330 0,290 T-460,300Z" fill="#7fb0d8" opacity="0.9" />
        {rays.map((a, i) => (
          <g key={i}>
            <line x1={0} y1={-20} x2={Math.cos(a) * 400 * grow} y2={-20 + Math.sin(a) * 340 * grow} stroke={RED} strokeWidth={4} />
            <circle cx={Math.cos(a) * 400 * grow} cy={-20 + Math.sin(a) * 340 * grow} r={10 * grow} fill="#fff" stroke={RED} strokeWidth={4} />
          </g>
        ))}
        {[0, 1, 2].map((i) => <circle key={i} cx={0} cy={-20} r={30 + i * 90 * grow} fill="none" stroke={RED} strokeWidth={4} opacity={0.5 - i * 0.12} />)}
        <circle cx={0} cy={-20} r={26} fill={RED} />
        <text x={-340} y={-330} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#666">ГОРОД</text>
        <Chip x={330} y={-330} text="ПАНИКА" bg={RED} fg="#fff" size={34} k={pop(lt, 0.6)} />
      </Sticky>
    </Svg>
  );
};

const SSection: React.FC<{ lt: number; t: number }> = ({ lt, t }) => {
  const P = { x: 270, y: 480, w: 540, h: 880 };
  const rows = 16;
  const rh = P.h / rows;
  const air = ramp(lt, 1.4, 99);
  const shaftGlow = ramp(lt, 3.1, 3.6) * (1 - ramp(lt, 5.3, 5.6));
  const liftY = P.y + P.h - 40 - ((Math.max(0, lt - 5.4) * 160) % (P.h - 80));
  const showLift = lt > 5.4;
  const showStairs = lt > 6.1;
  const showChute = lt > 6.8;
  const showVent = lt > 7.7;
  const pill = (x: number, y: number, text: string, k: number) => (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={cl(k * 2)}>
      <rect x={-8} y={-22} width={text.length * 17 + 24} height={44} rx={6} fill="#6a1818" stroke={RED} strokeWidth={3} />
      <text x={4} y={9} fontFamily={FONT} fontWeight={900} fontSize={26} fill="#fff">{text}</text>
    </g>
  );
  return (
    <g>
      <rect x={P.x} y={P.y} width={P.w} height={P.h} fill="#1a2030" stroke="#46506a" strokeWidth={8} />
      {Array.from({ length: rows }).map((_, j) => (
        <g key={j}>
          <rect x={P.x + 18} y={P.y + j * rh + 8} width={150} height={rh - 16} fill="#2a3350" />
          <rect x={P.x + P.w - 168} y={P.y + j * rh + 8} width={150} height={rh - 16} fill="#2a3350" />
          {rnd(j + 3) > 0.45 && <rect x={P.x + 40} y={P.y + j * rh + 16} width={28} height={16} fill="#e8c26a" opacity="0.8" />}
          {rnd(j + 33) > 0.55 && <rect x={P.x + P.w - 70} y={P.y + j * rh + 16} width={28} height={16} fill="#e8c26a" opacity="0.8" />}
        </g>
      ))}
      <rect x={P.x + 190} y={P.y + 10} width={P.w - 380} height={P.h - 20} fill="#0a0e1a" />
      <rect x={P.x + 190} y={P.y + 10} width={P.w - 380} height={P.h - 20} fill="none" stroke={RED} strokeWidth={6} opacity={shaftGlow * (0.6 + 0.4 * Math.sin(t * 8))} />
      {/* лестница */}
      <polyline points={Array.from({ length: 17 }).map((_, i) => `${P.x + (i % 2 ? 206 : 340)},${P.y + 20 + i * 52}`).join(" ")} fill="none" stroke={showStairs ? RED : "#55607c"} strokeWidth={showStairs ? 7 : 5} />
      {/* лифт */}
      <line x1={P.x + 252} y1={P.y + 10} x2={P.x + 252} y2={P.y + P.h - 10} stroke={showLift ? RED : "#394560"} strokeWidth={4} />
      {showLift && <rect x={P.x + 236} y={liftY} width={32} height={40} fill={RED} />}
      {/* мусоропровод */}
      <line x1={P.x + P.w - 215} y1={P.y + 10} x2={P.x + P.w - 215} y2={P.y + P.h - 10} stroke={showChute ? RED : "#394560"} strokeWidth={showChute ? 8 : 4} />
      {/* вентиляция */}
      <rect x={P.x + P.w - 190} y={P.y + 10} width={14} height={P.h - 20} fill={showVent ? "#ff5a4a" : "#2a3350"} opacity={showVent ? 0.9 : 0.7} />
      {air > 0 && Array.from({ length: 34 }).map((_, i) => {
        const p = ((t * 0.12 + rnd(i) * 3) % 1);
        const dx = 200 + rnd(i + 5) * (P.w - 400);
        return <circle key={i} cx={P.x + dx + Math.sin(t * 2 + i) * 14} cy={P.y + P.h - p * P.h} r={3 + rnd(i + 2) * 3} fill="#fff" opacity={0.5 * air * (1 - p)} />;
      })}
      {pill(P.x + 10, P.y + 230, "ВЕНТИЛЯЦИЯ", pop(lt, 7.7) * (showVent ? 1 : 0))}
      {pill(P.x + P.w - 270, P.y + 480, "МУСОРОПРОВОД", pop(lt, 6.8) * (showChute ? 1 : 0))}
      {pill(P.x - 6, P.y + 630, "ЛИФТ", pop(lt, 5.4) * (showLift ? 1 : 0))}
      {pill(P.x + P.w - 260, P.y + 760, "ЛЕСТНИЦА", pop(lt, 6.1) * (showStairs ? 1 : 0))}
    </g>
  );
};

const STube: React.FC<SP> = ({ lt, t }) => {
  const sign = pop(lt, 8.8);
  return (
    <Svg>
      <Backdrop />
      <RuleTag n={2} y={330} />
      <SSection lt={lt} t={t} />
      <rect width={W} height={H} fill="#000" opacity={0.5 * ramp(lt, 8.7, 9.1)} />
      <Sticky x={540} y={880} w={800} h={540} rot={-1} fill="#f2ecda" k={sign}>
        <text x={0} y={-190} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#222" letterSpacing={3}>ТОЛЬКО В МАСКЕ</text>
        <g transform="translate(-190 20)">
          <FaceIcon mask={false} />
          <g transform="translate(0 200)"><path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke={RED} strokeWidth={16} strokeLinecap="round" /></g>
        </g>
        <g transform="translate(190 20)">
          <FaceIcon mask />
          <g transform="translate(0 200)"><path d="M-44,0 L-12,32 L46,-36" stroke="#2fa84a" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
        </g>
      </Sticky>
    </Svg>
  );
};

const FaceIcon: React.FC<{ mask: boolean }> = ({ mask }) => (
  <g transform="scale(2.1)">
    <ellipse cx={0} cy={0} rx={50} ry={54} fill="#e9b995" stroke="#b9855f" strokeWidth={2} />
    <path d="M-52,-6 Q-56,-60 0,-58 Q56,-60 52,-6 Q30,-34 0,-30 Q-30,-34 -52,-6Z" fill="#4a2c1e" />
    <circle cx={-18} cy={-4} r={5} fill="#222" /><circle cx={18} cy={-4} r={5} fill="#222" />
    {mask ? <path d="M-34,6 L34,6 L28,38 Q0,52 -28,38Z" fill="#8fd0e8" stroke="#5aa6c4" strokeWidth={2} /> : <path d="M-14,26 Q0,34 14,26" fill="none" stroke="#8a3a30" strokeWidth={3} strokeLinecap="round" />}
  </g>
);

const SPlan: React.FC<SP> = ({ lt, t }) => {
  const route = easeOut(ramp(lt, 0.8, 2.6));
  const items = ["МАСКА", "ПЕРЧАТКИ", "СКОТЧ", "МАРШРУТ"];
  return (
    <Svg>
      <Backdrop />
      <RuleTag n={3} y={330} />
      <Sticky x={540} y={860} w={900} h={800} rot={-1} fill="#efe7cf" k={pop(lt, 0.1)}>
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M-450,${-400 + i * 70} H450 M${-450 + i * 82},-400 V400`} stroke="#cfe0e0" strokeWidth={2} />)}
        <g transform="translate(-340 -300)"><rect x={-26} y={-60} width={52} height={90} fill="#8aa0c0" /><text x={0} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill="#444">ДОМ</text></g>
        <g transform="translate(-240 270)"><polygon points="-50,0 0,-46 50,0" fill="#b0604a" /><rect x={-40} y={0} width={80} height={50} fill="#c97a60" /><text x={0} y={78} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill="#444">ШКОЛА</text></g>
        <path d="M-340,-240 L-340,-120 L-120,-120 L-120,40 L-240,40 L-240,200" fill="none" stroke="#2c64b0" strokeWidth={8} strokeDasharray="22 14" strokeDashoffset={-t * 40} pathLength={1} opacity={route} />
        <g transform="translate(-120 -120)"><circle r={36} fill="none" stroke={RED} strokeWidth={8} /><path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke={RED} strokeWidth={8} /></g>
        <g transform="translate(-280 40)"><circle r={36} fill="none" stroke={RED} strokeWidth={8} /><path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke={RED} strokeWidth={8} /></g>
        {items.map((it, i) => (
          <g key={it} transform={`translate(110 ${-200 + i * 110})`} opacity={ramp(lt, 0.6 + i * 0.5, 0.9 + i * 0.5)}>
            <rect x={0} y={-30} width={52} height={52} fill="none" stroke="#222" strokeWidth={6} />
            {i < 3 && <path d="M8,-4 L22,12 L48,-30" stroke="#2fa84a" strokeWidth={9} fill="none" strokeLinecap="round" />}
            <text x={80} y={12} fontFamily={FONT} fontWeight={900} fontSize={44} fill="#222">{it}</text>
          </g>
        ))}
      </Sticky>
    </Svg>
  );
};

const SCrowd: React.FC<SP> = ({ lt, t }) => {
  const sick = [0, 0.3, 1.1, 1.9, 99];
  const cols = ["#8aa06a", "#9ba27c", "#c4a05a", "#a84a4a", "#2c8aa0"];
  const tops = ["#5a8a3a", "#6a7a5a", "#d17a2a", "#9b2c33", "#2c64b0"];
  return (
    <Svg>
      <Backdrop />
      <RuleTag n={3} y={330} />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 140 + i * 200;
        const infected = lt > sick[i];
        return (
          <g key={i}>
            <Human x={x} y={1180} s={0.62} t={t} seed={i} skin={infected ? (i === 2 ? "#cdb36a" : "#a3b96a") : "#e9b995"} top={infected ? tops[i] : cols[i]} hs={i % 2 ? "short" : "long"} hair={["#4a2c1e", "#2a2a2a", "#d9a62a", "#6a3a1e", "#2a2a2a"][i]} mood={infected ? "worry" : "calm"} bob={Math.sin(t * 2 + i) * 4} />
            {infected && i < 4 && (
              <g transform={`translate(${x} ${760 + Math.sin(t * 5 + i) * 6}) scale(${0.9 + 0.12 * Math.sin(t * 6)})`}>
                <circle r={50} fill="url(#plg-red)" />
                <polygon points="0,-24 6,-8 24,-8 10,2 16,20 0,10 -16,20 -10,2 -24,-8 -6,-8" fill={RED} />
              </g>
            )}
          </g>
        );
      })}
      <Chip x={140 + 4 * 200} y={730} text="ТЫ" size={34} k={pop(lt, 1.6)} />
      <ellipse cx={140 + 4 * 200} cy={1186} rx={90} ry={16} fill="none" stroke={YEL} strokeWidth={5} opacity={ramp(lt, 1.8, 2.2)} />
    </Svg>
  );
};

const SDusk: React.FC<SP> = ({ lt, t }) => (
  <Svg>
    <rect width={W} height={H} fill="#1e3236" />
    <Dots color="#2d4a4a" />
    <rect y={1480} width={W} height={440} fill="#2a1d14" />
    <rect x={560} y={420} width={420} height={700} fill="#16203a" stroke="#6a3a2a" strokeWidth={14} />
    <defs><linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2a6a" /><stop offset="0.7" stopColor="#d9684a" /><stop offset="1" stopColor="#f0a860" /></linearGradient></defs>
    <rect x={574} y={434} width={392} height={672} fill="url(#dsky)" />
    {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={574 + i * 56} y={900 - rnd(i + 4) * 150} width={54} height={400} fill="#25204a" />)}
    <Spire x={870} y={1106} s={0.34} col="#25204a" />
    <path d="M770,434 V1106 M574,770 H966" stroke="#6a3a2a" strokeWidth={10} />
    <rect x={540} y={1110} width={460} height={26} fill="#6a3a2a" />
    <g transform="translate(150 1490)"><ellipse cx={0} cy={0} rx={50} ry={10} fill="#00000066" /><path d="M-40,-12 q-4,-30 26,-30 q22,0 22,28z" fill="#e87aa0" /><path d="M10,-12 q-4,-30 26,-30 q22,0 22,28z" fill="#e87aa0" /></g>
    <Sticky x={190} y={700} w={200} h={160} rot={-4} fill="#e6d8a0" k={1}><rect x={-70} y={-50} width={140} height={90} fill="#8aa0c0" /><circle cx={-20} cy={-10} r={18} fill="#e9b995" /><circle cx={30} cy={-4} r={14} fill="#e9b995" /></Sticky>
    <Human x={360} y={1500} s={1.1} t={t} top={JACKET} mood="worry" flip look={-2} bob={Math.sin(t * 2) * 3} />
    <rect width={W} height={H} fill="url(#plg-vig)" opacity="0.7" />
    <rect width={W} height={H} fill="#0a0a1a" opacity={0.22 + ramp(lt, 0, 2.2) * 0.12} />
  </Svg>
);

const SClass: React.FC<SP> = ({ lt, t }) => {
  const cough = 0.5 + 0.5 * Math.sin(t * 5);
  return (
    <Svg>
      <rect width={W} height={H} fill="#2d4850" />
      <rect y={1250} width={W} height={670} fill="#4a3322" />
      <rect x={90} y={380} width={580} height={330} fill="#1f4a3a" stroke="#8a6a3a" strokeWidth={16} />
      <text x={380} y={470} textAnchor="middle" fontFamily="'Georgia', serif" fontStyle="italic" fontSize={40} fill="#e8f0e0" opacity="0.85">24 октября</text>
      <text x={380} y={530} textAnchor="middle" fontFamily="'Georgia', serif" fontStyle="italic" fontSize={40} fill="#e8f0e0" opacity="0.85">Классная работа</text>
      <path d="M170,590 q80,-20 160,0" stroke="#e8f0e0" strokeWidth={4} fill="none" opacity="0.6" />
      <rect x={770} y={400} width={260} height={880} fill="#6a4a30" stroke="#3a2818" strokeWidth={10} />
      <rect x={810} y={470} width={90} height={150} fill="#a9c6d0" opacity="0.7" />
      <Lock x={900} y={900} s={1.4} />
      <circle cx={900} cy={900} r={90 + Math.sin(t * 5) * 6} fill="url(#plg-candle)" />
      <Human x={250} y={1400} s={0.95} t={t} hs="gray" glasses skin="#e4b996" top="#7a2d44" bottom="#2a2a34" mood="cough" armR={[-155, -55]} bob={Math.abs(Math.sin(t * 5)) * 8} />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={340 + i * 52 + (t * 30 + i * 20) % 90} cy={1000 - i * 30 - (t * 20 + i * 14) % 60} r={46 + i * 10} fill="#9be05a" opacity={0.3 * cough * ramp(lt, 0.2, 0.8)} filter="url(#plg-blur8)" />)}
      <rect x={440} y={1440} width={620} height={30} fill="#7a5a36" />
      <g>
        <Human x={620} y={1440} s={0.6} t={t} seed={3} hs="pig" hair="#c4521e" top="#2c64b0" mood="scared" />
        <Human x={860} y={1440} s={0.6} t={t} seed={5} hs="short" hair="#2a2a2a" top="#d9a62a" mood="scared" />
      </g>
      <rect x={470} y={1380} width={240} height={90} fill="#8a6a40" />
      <rect x={750} y={1380} width={240} height={90} fill="#8a6a40" />
      <rect width={W} height={H} fill="#000" opacity="0.18" />
    </Svg>
  );
};

const SCage: React.FC<SP> = ({ lt, t }) => {
  const shake = lt < 0.4 ? Math.sin(t * 90) * 6 * (1 - lt / 0.4) : 0;
  return (
    <Svg>
      <rect width={W} height={H} fill="#0a0e1a" />
      <rect x={120} y={600} width={840} height={700} fill="#101a30" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={140 + i * 120} y={760 - rnd(i + 4) * 120} width={90} height={540} fill="#16224a" />)}
      <rect y={1100} width={W} height={820} fill="url(#plg-green)" opacity="0.5" />
      <g transform={`translate(${shake} 0)`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <rect x={i * 94 + 10} y={0} width={34} height={H} fill="#3a3f4a" />
            <rect x={i * 94 + 14} y={0} width={10} height={H} fill="#7a808c" opacity="0.7" />
          </g>
        ))}
        <rect y={260} width={W} height={36} fill="#2a2e38" /><rect y={1500} width={W} height={36} fill="#2a2e38" />
      </g>
      <rect width={W} height={H} fill="url(#plg-vig)" />
    </Svg>
  );
};

const SDress: React.FC<SP> = ({ lt, t }) => {
  const mask = lt > 2.4;
  const hand = lt > 1.8 && lt < 3 ? [-150, -140] as [number, number] : [-4, -4] as [number, number];
  return (
    <Svg>
      <Hallway night door={0} t={t} candle />
      <Human x={380} y={1500} s={1.1} t={t} top={JACKET} mask={mask ? "surg" : null} mood="worry" bob={Math.sin(t * 2) * 3} armR={hand} />
    </Svg>
  );
};

const SSleeve: React.FC<SP> = ({ lt, t }) => {
  const wrap = easeOut(ramp(lt, 0.2, 1.4));
  return (
    <Svg>
      <rect width={W} height={H} fill="#1b2b30" />
      <Dots color="#2a4448" />
      <rect y={1480} width={W} height={440} fill="#1d1410" />
      <g transform={`translate(0 ${Math.sin(t * 1.5) * 4})`}>
        <path d="M-20,640 L540,700 L540,1000 L-20,1060Z" fill={JACKET} />
        <path d="M-20,640 L540,700 L540,740 L-20,690Z" fill="#fff" opacity="0.08" />
        <rect x={470} y={690} width={120} height={320} rx={6} fill="#7a7a82" opacity={wrap} />
        <path d="M500,700 L500,1000 M530,700 L530,1000 M560,700 L560,1000" stroke="#555a62" strokeWidth={4} opacity={wrap} />
        <path d="M590,730 L830,640 Q880,630 900,660 L930,860 Q940,930 880,960 L590,1000Z" fill="#e9b995" />
        <path d="M830,650 q10,-120 40,-160 M880,670 q40,-120 80,-150 M920,720 q60,-90 100,-100" stroke="#e9b995" strokeWidth={42} fill="none" strokeLinecap="round" />
      </g>
      <g transform={`translate(260 1230) rotate(${t * 80})`}>
        <circle r={120} fill="#c9c6bc" stroke="#8a867a" strokeWidth={8} /><circle r={52} fill="#1b2b30" />
      </g>
      <path d="M380,1230 q200,40 120,-220" stroke="#c9c6bc" strokeWidth={28} fill="none" opacity={1 - wrap} />
    </Svg>
  );
};

const SLock: React.FC<SP> = ({ lt, t }) => {
  const approach = easeInOut(ramp(lt, 0, 1.6));
  const turn = easeInOut(ramp(lt, 2.7, 4.7)) * 90;
  const beat = Math.pow(Math.max(0, Math.sin(lt * 7)), 6);
  const hx = 1000 - 460 * approach;
  const hy = 1500 - 700 * approach;
  return (
    <Svg>
      <rect width={W} height={H} fill="#4a2c22" />
      <QuiltDoor x={0} y={0} w={W} h={H} base="#6a4430" />
      <g transform={`translate(540 760) scale(${1 + beat * 0.03})`}>
        <circle r={210} fill="#000" opacity="0.3" />
        <circle r={190} fill="#d9b04a" stroke="#8a6a1e" strokeWidth={10} />
        <circle r={150} fill="#e8c262" />
        <g transform={`rotate(${turn})`}>
          <rect x={-30} y={-130} width={60} height={260} rx={30} fill="#b88f2e" stroke="#7a5a10" strokeWidth={6} />
        </g>
        <circle r={20} fill="#6a4a10" />
      </g>
      <rect y={1040} x={140} width={160} height={30} rx={14} fill="#c9a94a" />
      <g transform={`translate(${hx} ${hy}) rotate(${-40 + turn * 0.3})`}>
        <path d="M30,0 L260,200 L200,260 L-40,60Z" fill={JACKET} />
        <path d="M-40,60 L30,0 L90,70 L20,130Z" fill="#8a6a82" opacity="0" />
        <ellipse cx={0} cy={30} rx={70} ry={60} fill="#2c64b0" />
        <path d="M-60,-10 q-20,-60 0,-100 M-30,-34 q-14,-70 12,-110 M10,-48 q4,-70 36,-92" stroke="#2c64b0" strokeWidth={34} fill="none" strokeLinecap="round" />
        <rect x={130} y={110} width={150} height={44} fill="#9aa0a8" transform="rotate(40 130 110)" />
      </g>
      <rect width={W} height={H} fill={RED} opacity={0.12 * ramp(lt, 2.7, 3.2) * (0.5 + 0.5 * Math.sin(t * 8))} />
      <rect width={W} height={H} fill="url(#plg-vig)" opacity="0.5" />
    </Svg>
  );
};

const SOpen: React.FC<SP> = ({ lt, t }) => {
  const door = easeInOut(ramp(lt, 0.1, 1.1));
  return (
    <Svg>
      <Hallway night door={door} t={t} candle peek />
      <Human x={360} y={1500} s={1.1} t={t} top={JACKET} mask="surg" glove="#2c64b0" mood="worry" bob={Math.sin(t * 2) * 3} />
      <rect x={630} y={510} width={380} height={960} fill="#cfe8ff" opacity={0.18 * door} />
    </Svg>
  );
};

const SStair: React.FC<SP> = ({ lt, t }) => {
  const bubble = pop(lt, 3.5, 0.3) * (1 - ramp(lt, 5.6, 5.8));
  const run = ramp(lt, 5.5, 6.1);
  const cough = lt > 1.9 && lt < 3.3 ? Math.abs(Math.sin(t * 9)) * 8 : 0;
  return (
    <Svg>
      <rect width={W} height={H} fill="#c9c7b8" />
      <rect y={900} width={W} height={1020} fill="#2f6a52" />
      <rect y={896} width={W} height={10} fill="#1f4a38" />
      <rect y={1600} width={W} height={320} fill="#2a2a2e" />
      <rect x={330} y={420} width={260} height={400} fill="#0f1a30" stroke="#3a3a3e" strokeWidth={14} />
      <path d="M460,420 V820 M330,620 H590" stroke="#3a3a3e" strokeWidth={8} />
      <rect x={60} y={560} width={240} height={1040} fill="#8a8e96" stroke="#5a5e66" strokeWidth={8} />
      <path d="M180,560 V1600" stroke="#5a5e66" strokeWidth={6} />
      <rect x={300} y={1000} width={30} height={60} rx={6} fill="#3a3e46" />
      <line x1={540} y1={0} x2={540} y2={250} stroke="#333" strokeWidth={4} />
      <circle cx={540} cy={270} r={26} fill="#fff4c0" /><circle cx={540} cy={270} r={200} fill="url(#plg-candle)" opacity="0.5" />
      <g opacity="0.9"><path d="M700,1600 L1080,1380 M700,1500 L1080,1280" stroke="#1a1a1e" strokeWidth={12} /><path d="M700,1600 L1080,1380" stroke="#555" strokeWidth={4} /></g>
      <Human x={440} y={1600} s={1.0} t={t} top="#6a6a3a" bottom="#2a2a34" mask="resp" hs="short" hair="#2a2a2a" glove="#d9a62a" mood="cough" flip={false} bob={cough} armR={lt > 1.9 && lt < 3.3 ? [-150, -140] : [-4, -4]} seed={7} />
      <Human x={780 + run * 700} y={1600} s={1.02} t={t} top={JACKET} mask="surg" glove="#2c64b0" mood="worry" flip legSw={run > 0 ? Math.sin(t * 16) * 22 : 0} bob={run > 0 ? Math.abs(Math.sin(t * 16)) * 10 : Math.sin(t * 2) * 3} armL={run > 0 ? [-40, -30] : [4, 4]} armR={run > 0 ? [40, 30] : [-4, -4]} />
      <g transform={`translate(560 760) scale(${bubble})`} opacity={cl(bubble * 2)}>
        <path d="M-300,-110 H300 a30,30 0 0 1 30,30 V70 a30,30 0 0 1 -30,30 H-120 L-190,150 L-170,100 H-300 a30,30 0 0 1 -30,-30 V-80 a30,30 0 0 1 30,-30Z" fill="#fff" />
        <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#111">«НЕ ХОДИ ВНИЗ.</text>
        <text x={0} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill="#111">ПОДЪЕЗД ЗАКРЫЛИ»</text>
      </g>
      <rect width={W} height={H} fill="#07101a" opacity="0.25" />
    </Svg>
  );
};

const SWindow: React.FC<SP> = ({ lt, t }) => {
  const run = easeOut(ramp(lt, 0, 0.9));
  const blink = Math.sin(t * 10) > 0 ? 1 : 0.3;
  return (
    <Svg>
      <rect width={W} height={H} fill="#0e1424" />
      <Dots color="#1a2238" />
      <rect y={1480} width={W} height={440} fill="#120d0b" />
      <rect x={250} y={320} width={580} height={1020} fill="#0a1020" stroke="#4a4a52" strokeWidth={24} />
      <rect x={262} y={332} width={556} height={996} fill="#0e1a30" />
      <path d="M540,332 V1328 M262,830 H818" stroke="#4a4a52" strokeWidth={14} />
      {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={270 + i * 110} y={1100 - rnd(i) * 150} width={100} height={300} fill="#16224a" />)}
      <g opacity={ramp(lt, 0.7, 1.2)}>
        <circle cx={400} cy={1180} r={90} fill="#ff9a2e" opacity={0.25 * blink} filter="url(#plg-blur8)" />
        <circle cx={690} cy={1180} r={90} fill="#ff2a1a" opacity={0.25 * (1.3 - blink)} filter="url(#plg-blur8)" />
        <rect x={380} y={1120} width={20} height={60} fill="#ddd" /><rect x={450} y={1130} width={20} height={50} fill="#ddd" />
      </g>
      <Human x={-120 + run * 560} y={1500} s={1.0} t={t} top={JACKET} mask="surg" glove="#2c64b0" mood="scared" legSw={lt < 0.9 ? Math.sin(t * 18) * 24 : 0} armR={lt > 0.9 ? [-110, -30] : [30, 20]} armL={lt < 0.9 ? [-40, -30] : [4, 4]} bob={lt < 0.9 ? Math.abs(Math.sin(t * 18)) * 12 : 0} look={2} />
      <rect width={W} height={H} fill="url(#plg-vig)" opacity="0.6" />
    </Svg>
  );
};

const SCordon: React.FC<SP> = ({ lt, t }) => (
  <Svg>
    <defs><linearGradient id="cfl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#242a38" /><stop offset="1" stopColor="#14171f" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#cfl)" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M0,${i * 150} H${W} M${i * 100},0 V${H}`} stroke="#fff" strokeOpacity="0.04" strokeWidth={3} />)}
    <rect x={150} y={420} width={780} height={880} fill="none" stroke={YEL} strokeWidth={10} strokeDasharray="40 24" strokeDashoffset={-t * 30} />
    <rect x={380} y={380} width={320} height={80} fill="#3a2a1e" />
    {[0, 1].map((i) => {
      const k = pop(lt, 0.3 + i * 0.35);
      const x = 330 + i * 420;
      return (
        <g key={i} transform={`translate(${x} ${820}) scale(${k})`}>
          <ellipse cx={0} cy={60} rx={120} ry={84} fill="#e4e8ec" /><ellipse cx={0} cy={0} rx={74} ry={80} fill="#f6f8fa" stroke="#c4cad2" strokeWidth={4} />
          <path d="M-52,-34 Q0,-76 52,-34 Q40,12 0,14 Q-40,12 -52,-34Z" fill="#1d2630" />
          <circle cx={0} cy={-18} r={6} fill="#8aa8c0" opacity="0.6" />
        </g>
      );
    })}
    <g transform="translate(540 1130)"><rect x={-90} y={-70} width={180} height={140} rx={14} fill="#e9edf0" stroke="#aab4be" strokeWidth={4} /><rect x={-60} y={-44} width={120} height={50} rx={6} fill="#2c64b0" /><circle cx={-40} cy={36} r={10} fill="#c92b2b" /></g>
    <g transform="translate(220 1220)"><rect x={-36} y={-90} width={72} height={180} rx={30} fill="#c92b2b" /><rect x={-16} y={-110} width={32} height={22} fill="#888" /></g>
    <g transform="translate(860 1220)"><rect x={-36} y={-90} width={72} height={180} rx={30} fill="#c92b2b" /><rect x={-16} y={-110} width={32} height={22} fill="#888" /></g>
    <circle cx={900} cy={470} r={44 + Math.sin(t * 12) * 6} fill="#ff9a2e" opacity={0.5} />
  </Svg>
);

const SWeld: React.FC<SP> = ({ lt, t }) => {
  const flash = 0.45 * Math.abs(Math.sin(t * 17)) * ramp(lt, 0.3, 0.6);
  return (
    <Svg>
      <rect width={W} height={H} fill="#1c2638" />
      <rect y={1580} width={W} height={340} fill="#12161e" />
      <rect x={130} y={420} width={820} height={1180} fill="#2a3042" stroke="#10131a" strokeWidth={14} />
      <rect x={180} y={470} width={340} height={1130} fill="#5a4a3a" stroke="#2a2018" strokeWidth={10} />
      <rect x={560} y={470} width={340} height={1130} fill="#5a4a3a" stroke="#2a2018" strokeWidth={10} />
      <rect x={190} y={800} width={700} height={0} />
      <path d="M540,470 V1600" stroke="#ffd27a" strokeWidth={8 + Math.sin(t * 40) * 3} opacity={ramp(lt, 0.5, 1.2) * 0.9} />
      <Hazmat x={300} y={1600} s={1.18} t={t} arm={Math.sin(t * 3) * 4} />
      <Hazmat x={780} y={1600} s={1.18} flip torch t={t} arm={Math.sin(t * 3) * 4} />
      {Array.from({ length: 26 }).map((_, i) => {
        const p = (t * 1.6 + rnd(i) * 2) % 1;
        return <circle key={i} cx={540 + (rnd(i + 4) - 0.5) * 340 * p} cy={1000 + p * 420 - Math.sin(p * 3) * 140 * rnd(i + 9)} r={3 + rnd(i + 8) * 4 * (1 - p)} fill="#ffcf6a" opacity={(1 - p) * ramp(lt, 0.5, 0.9)} />;
      })}
      <circle cx={540} cy={1000} r={210} fill="#cfe8ff" opacity={flash} filter="url(#plg-blur8)" />
      <rect width={W} height={H} fill="#fff" opacity={flash * 0.4} />
    </Svg>
  );
};

const SSealed: React.FC<SP> = ({ lt, t }) => {
  const k = pop(lt, 0.4, 0.3);
  return (
    <Svg>
      <rect width={W} height={H} fill="#080c18" />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 84 - 20} y={1500 - 280 - rnd(i * 2) * 300} width={76} height={700} fill="#0e1630" />)}
      <Tower x={290} y={420} w={500} h={1100} cols={8} rows={24} t={t} body="#2a3358" lit="#e8c26a" dark="#121a36" seed={11} litP={0.35} />
      <rect y={1520} width={W} height={400} fill="#05070e" />
      <rect x={470} y={1380} width={140} height={140} fill="#1c2638" /><path d="M540,1380 V1520" stroke="#ffcf6a" strokeWidth={6} opacity={0.5 + 0.4 * Math.sin(t * 20)} />
      <g transform={`translate(540 1450)`}><path d="M-60,-60 L60,60 M60,-60 L-60,60" stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={ramp(lt, 0.6, 0.9)} /></g>
      <g transform={`translate(540 920) rotate(-12) scale(${k})`} opacity={cl(k * 2)}>
        <rect x={-420} y={-110} width={840} height={220} rx={14} fill="none" stroke={RED} strokeWidth={14} />
        <rect x={-396} y={-86} width={792} height={172} rx={8} fill="none" stroke={RED} strokeWidth={4} />
        <text x={0} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={130} fill={RED} letterSpacing={6}>ЗАПЕЧАТАНО</text>
      </g>
    </Svg>
  );
};

const SSplit: React.FC<SP> = ({ lt, t }) => {
  const kTop = pop(lt, 0.0, 0.3);
  const kBot = pop(lt, 1.2, 0.3);
  return (
    <Svg>
      <rect width={W} height={H} fill="#10141e" />
      {/* верх: Анна внутри */}
      <g transform={`translate(0 ${(1 - kTop) * -40})`} opacity={cl(kTop * 2)}>
        <rect x={110} y={130} width={860} height={780} fill="#0f1830" stroke="#d5d9e0" strokeWidth={14} />
        <text x={540} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#aab" letterSpacing={6}>20 ЭТАЖ</text>
        <rect x={124} y={144} width={832} height={752} fill="#16203a" />
        <Human x={540} y={900} s={0.9} t={t} top={JACKET} mask="surg" glove="#2c64b0" mood="worry" look={2} armR={[-120, -30]} />
        <rect x={560} y={740} width={14} height={80} fill="#e8dcc0" /><polygon points="567,700 560,740 574,740" fill="#ff9a2e" />
        <circle cx={567} cy={740} r={120} fill="url(#plg-candle)" />
      </g>
      <rect x={0} y={920} width={W} height={10} fill={RED} />
      {/* низ: Лиза снаружи */}
      <g transform={`translate(0 ${(1 - kBot) * 40})`} opacity={cl(kBot * 2)}>
        <rect x={110} y={980} width={860} height={780} fill="#0f1830" stroke="#d5d9e0" strokeWidth={14} />
        <rect x={124} y={994} width={832} height={752} fill="#2a3452" />
        <Human x={540} y={1750} s={0.9} t={t} hs="pig" hair="#c4521e" top="#223a66" skirt bottom="#223a66" mood="scared" bag="#c92b2b" armR={[-140, -20]} />
        <text x={540} y={1790} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill="#aab" letterSpacing={6}>ШКОЛА №57</text>
      </g>
    </Svg>
  );
};

const SEnd: React.FC<SP> = ({ lt, t }) => (
  <Svg>
    <rect width={W} height={H} fill="#04050a" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 400 + t * 20) % 1400) - 150} cy={1750} rx={420} ry={150} fill="#7ee04a" opacity="0.1" filter="url(#plg-blur)" />)}
    <g opacity={ramp(lt, 0.2, 0.9)}>
      <text x={W / 2} y={940} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#fff" letterSpacing={4}>ЭПИЗОД 01</text>
      <rect x={W / 2 - 180} y={972} width={360 * easeOut(ramp(lt, 0.5, 1.3))} height={8} fill={RED} />
      <text x={W / 2} y={1060} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#fff" opacity={ramp(lt, 1.3, 1.9) * 0.8} letterSpacing={6}>ПРОДОЛЖЕНИЕ СЛЕДУЕТ…</text>
    </g>
  </Svg>
);

const SCENE_COMP: Record<SceneId, React.FC<SP>> = {
  night: SNight, cards: SCards, door: SDoor, city: SCity, hall: SHall, clock: SClock, school: SSchool, phone: SPhone,
  board: SBoard, map: SMap, tube: STube, plan: SPlan, crowd: SCrowd, dusk: SDusk, class: SClass, cage: SCage,
  dress: SDress, sleeve: SSleeve, lock: SLock, open: SOpen, stair: SStair, window: SWindow, cordon: SCordon,
  weld: SWeld, sealed: SSealed, split: SSplit, end: SEnd,
};

/* ------------------------------------------------------------------ */
/* Оверлеи: часы, субтитры, звук                                        */
/* ------------------------------------------------------------------ */
const Hud: React.FC<{ clock?: string; ep: boolean; t: number }> = ({ clock, ep, t }) => {
  if (!clock && !ep) return null;
  const txt = ep ? "ЭПИЗОД 01" : clock!;
  return (
    <div style={{ position: "absolute", left: 46, top: 70, display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 10, fontFamily: "'DejaVu Sans Mono', monospace", fontWeight: 800, fontSize: 28, letterSpacing: 2, color: ep ? "#fff" : "#f4c82a", background: ep ? RED : "rgba(8,10,16,0.72)", border: ep ? "none" : "2px solid rgba(255,255,255,0.14)" }}>
      {!ep && <span style={{ width: 14, height: 14, borderRadius: 7, background: RED, opacity: 0.6 + 0.4 * Math.sin(t * 5) }} />}
      {txt}
    </div>
  );
};

const COLS = { y: "#ffd32a", r: "#ff3b2e", b: "#6ec6ff" } as const;

const Subtitle: React.FC<{ v: number; y: number }> = ({ v, y }) => {
  const nextStart = (c: Cap) => {
    const i = CAPS.indexOf(c);
    return i < CAPS.length - 1 ? CAPS[i + 1].t0 : 999;
  };
  const cap = CAPS.find((c) => v >= c.t0 - 0.04 && v < Math.min(c.t1 + 0.4, nextStart(c) - 0.02));
  if (!cap) return null;
  const k = easeOut(ramp(v, cap.t0 - 0.04, cap.t0 + 0.14));
  const parts = cap.hl && cap.text.includes(cap.hl)
    ? [cap.text.slice(0, cap.text.indexOf(cap.hl)), cap.hl, cap.text.slice(cap.text.indexOf(cap.hl) + cap.hl.length)]
    : [cap.text, "", ""];
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: 1.08, color: "#fff", opacity: k, transform: `scale(${0.94 + 0.06 * k})`, textShadow: "0 0 3px #000, 0 0 3px #000, 0 4px 14px rgba(0,0,0,.9), 3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000" }}>
      {parts[0]}
      <span style={{ color: cap.col ? COLS[cap.col] : "#fff" }}>{parts[1]}</span>
      {parts[2]}
    </div>
  );
};

const S = (s: number) => Math.round(s * FPS);

const Sound: React.FC = () => {
  const sfx = (v: number, dur: number, src: string, vol: number, loop = false) => (
    <Sequence from={S(v + OFF)} durationInFrames={S(dur)}>
      <Audio src={staticFile(src)} volume={vol} loop={loop} />
    </Sequence>
  );
  return (
    <>
      <Sequence from={S(OFF)}><Audio src={staticFile(VO_FILE)} volume={1} /></Sequence>
      {sfx(-0.5, 98, "audio/sfx-wind.mp3", 0.16, true)}
      {sfx(8.6, 3.4, "audio2/sfx-riser.mp3", 0.6)}
      {sfx(12.8, 2, "audio/sfx-hit.mp3", 0.8)}
      {sfx(19.2, 1.5, "dark/x-knock.mp3", 0.7)}
      {sfx(21.7, 2.4, "audio/sfx-hit.mp3", 0.9)}
      {sfx(31.4, 3, "dark/x-blackout.mp3", 0.9)}
      {sfx(33.6, 2, "audio/sfx-hit.mp3", 0.5)}
      {sfx(38.8, 12, "audio2/sfx-heart.mp3", 0.35, true)}
      {sfx(56.3, 8, "audio2/sfx-heart.mp3", 0.4, true)}
      {sfx(62.3, 2, "audio/sfx-hit.mp3", 0.9)}
      {sfx(69.2, 5.2, "audio2/sfx-heart.mp3", 0.7, true)}
      {sfx(74.4, 1.8, "dark/x-knock.mp3", 0.8)}
      {sfx(75.7, 6, "dark/x-steps.mp3", 0.5, true)}
      {sfx(83.2, 4.2, "audio2/sfx-riser.mp3", 0.6)}
      {sfx(85.3, 2, "dark/x-battery.mp3", 0.7)}
      {sfx(87.4, 2, "audio/sfx-hit.mp3", 1)}
      {sfx(91.6, 5, "audio2/sfx-riser.mp3", 0.5)}
    </>
  );
};

export const Plague: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const v = t - OFF;
  const vv = Math.max(0, v);
  const { sc, idx, local, dur } = sceneAt(vv);
  const prev = idx > 0 ? SCENES[idx - 1] : null;
  const Cur = SCENE_COMP[sc.id];
  const Prev = prev ? SCENE_COMP[prev.id] : null;
  const fadeIn = ramp(local, 0, 0.18);
  const zoom = 1 + 0.045 * (local / Math.max(0.5, dur));
  const capY = sc.id === "split" ? (local < 1.2 ? 700 : 1440) : sc.cap;
  const fadeEnd = 1 - ramp(t, DURATION_SEC - 0.8, DURATION_SEC);
  const fadeStart = ramp(t, 0, 0.5);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(fadeStart, fadeEnd), overflow: "hidden" }}>
        {Prev && prev && local < 0.2 && (
          <div style={{ position: "absolute", inset: 0 }}>
            <Prev lt={sceneAt(vv - local - 0.01).local} dur={4} t={t} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, opacity: prev ? fadeIn : 1, transform: `scale(${zoom})`, transformOrigin: "50% 55%" }}>
          <Cur lt={local} dur={dur} t={t} />
        </div>
        <Hud clock={sc.clock} ep={sc.id === "night"} t={t} />
        <Subtitle v={v} y={capY} />
      </div>
      <Sound />
    </AbsoluteFill>
  );
};
