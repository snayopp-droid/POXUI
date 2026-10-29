import React from "react";
import { Cam, Person, Tag, Txt, C, W, H, cl, lerp, ramp, eio, L, walk, idle, Fade, Big, SceneBG, Icon, RuleCard, type Chunk } from "./kit";
import { LivingRoom, RadioRoom, StorageRoom, AirRoom, WaterRoom, DoorRoom } from "./sets";
import { Jug, Geiger, Notebook, Clock, Tally, Dust, Glow, Can, Jar, Sack, Cards, Mug, Pipe, Barrel, Gauge } from "./props";
import { Seated, kidLook } from "./scenes_a";

const Ticks: React.FC<{ x: number; y: number; items: string[]; p: number; size?: number }> = ({ x, y, items, p, size = 40 }) => (
  <g>
    {items.map((l, i) => {
      const a = eio(ramp(p, i * 0.22, i * 0.22 + 0.18));
      return (
        <g key={i} opacity={a} transform={`translate(${x},${y + i * (size + 26)})`}>
          <rect x={0} y={-size + 6} width={size} height={size} rx={6} fill="none" stroke={C.chalk} strokeWidth={4} />
          <path d={`M 7 ${-size / 2 + 6} l ${size * 0.25} ${size * 0.3} l ${size * 0.5} ${-size * 0.6}`} stroke={C.green} strokeWidth={7} fill="none" strokeLinecap="round" opacity={ramp(p, i * 0.22 + 0.1, i * 0.22 + 0.25)} />
          <Txt x={size + 24} y={0} size={size} c={C.chalk} w={700} anchor="start">{l}</Txt>
        </g>
      );
    })}
  </g>
);

const Wave: React.FC<{ x: number; y: number; t: number; w?: number; amp?: number; c?: string; flat?: number }> = ({ x, y, t, w = 500, amp = 30, c = "#7fe08a", flat = 0 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) { const u = i / 80; pts.push(`${x + u * w},${y + Math.sin(u * 40 + t * 18) * amp * (1 - flat) * (0.4 + 0.6 * Math.sin(u * 7 + t * 3) ** 2) + Math.sin(u * 91 + t * 31) * amp * 0.3 * (1 - flat)}`); }
  return <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth={4} strokeLinejoin="round" />;
};

export const chunksB: Chunk[] = [
  /* ───────── c07: первая ночь ───────── */
  {
    id: "c07",
    beats: [
      { w: 5, r: ({ t, p }) => (
        <Cam a={{ x: 960, y: 560, z: 1.0 }} b={{ x: 900, y: 600, z: 1.3 }} p={p}>
          <LivingRoom t={t} lamp={0.45} dim={0.4}>
            <Person x={300} y={800} s={0.55} look={L.lily} pose={idle(t, { sit: 1, expr: "cry", tilt: 6 })} />
            <Person x={420} y={800} s={0.4} look={L.noah} pose={idle(t, { sit: 1, expr: "cry", tilt: -6 })} />
            <Person x={520} y={905} s={0.95} look={L.elena} pose={idle(t, { armL: [70, 20], armR: [75, 40], expr: "sad", look: -0.5, lean: -4 })} />
            <Person x={1300} y={905} s={0.95} look={L.mark} pose={idle(t, { expr: "worry", look: -0.3 })} />
            <Tag x={960} y={120} text="THE FIRST NIGHT WAS THE HARDEST" p={ramp(t, 0.3, 1)} size={38} />
          </LivingRoom>
        </Cam>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.7} dim={0.15} board={undefined}>
            <Person x={620} y={905} s={0.95} look={L.elena} pose={idle(t, { armL: [100, 20], expr: "talk" })} />
            <Person x={1000} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [150 - Math.max(0, Math.sin(t * 2)) * 10, 150], heldR: <Mug x={0} y={0} />, expr: "neutral" })} />
            <Person x={1260} y={912} s={0.6} look={L.lily} pose={idle(t, { armR: [120, 130], expr: "neutral" })} />
          </LivingRoom>
          <g transform="translate(1180,170)"><rect x={-30} y={-40} width={580} height={420} rx={10} fill="#1f2c28" stroke="#8a6a45" strokeWidth={8} /><Txt x={260} y={20} size={36} c={C.amber} w={800}>SAME SIMPLE THINGS</Txt><Ticks x={20} y={100} items={["DRINK WATER", "EAT SOMETHING", "SLEEP IN SHIFTS"]} p={ramp(p, 0.15, 0.85)} size={36} /></g>
          <Tag x={600} y={540} text="ROUTINE = MEDICINE" p={ramp(t, 2.2, 2.8)} size={34} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.3} dim={0.45}>
            {[0, 1, 2].map((i) => <Person key={i} x={170 + i * 70} y={790 - (i === 1 ? 4 : 0)} s={[0.9, 0.5, 0.36][i] * 0.7} look={[L.elena, L.lily, L.noah][i]} pose={idle(t + i, { expr: "sleep", rot: 90 })} />)}
            <Person x={1000} y={905} s={0.95} look={L.mark} pose={idle(t, { sit: 1, expr: "neutral", look: Math.sin(t * 0.8) * 0.6, armR: [40, 70], heldR: <g><rect x={-6} y={-4} width={12} height={34} fill="#2a2e2c" /><circle cy={32} r={5} fill="#ffe9a0" /></g> })} />
            <Clock x={960} y={290} r={92} t={p * 120} speed={1} />
          </LivingRoom>
          <Tag x={960} y={120} text="SLEEP IN SHIFTS" p={ramp(t, 0.3, 1)} size={46} />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => {
        const k = ramp(p, 0.15, 0.55);
        return (
          <SceneBG c="#0f1a1c">
            <Txt x={960} y={150} size={56} c={C.chalk} w={900}>THE WATER RULE</Txt>
            <Jug x={600} y={640} s={3.4} />
            <rect x={470} y={380} width={260} height={150 * (1 - 0) * 0 + 0} fill="none" />
            <g opacity={ramp(p, 0.2, 0.5)}>
              <line x1={600} y1={330} x2={600} y2={640} stroke="#fff" strokeWidth={4} strokeDasharray="8 8" />
              <Txt x={880} y={470} size={46} c="#8fd0f0" w={900} anchor="start">½ TO DRINK</Txt>
              <Txt x={880} y={560} size={46} c="#d8c890" w={900} anchor="start">½ FOR COOKING + WASHING</Txt>
            </g>
            <Txt x={960} y={860} size={64} c={C.amber} w={900} o={eio(ramp(p, 0.05, 0.25))}>1 GALLON PER PERSON · PER DAY</Txt>
            <g opacity={ramp(p, 0.6, 0.9)}>{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1130 + i * 120},690)`}><circle r={30} fill="#1e2a28" stroke={C.amber} strokeWidth={4} /><Txt x={0} y={10} size={26} c={C.chalk} w={800}>1</Txt></g>)}</g>
            <Fade o={0} />
            <g opacity={k * 0}><Txt x={0} y={0}>.</Txt></g>
          </SceneBG>
        );
      } },
      { w: 8, r: ({ t, p }) => {
        const a = eio(ramp(p, 0.1, 0.45)), b = eio(ramp(p, 0.5, 0.85));
        return (
          <SceneBG c="#0f1718">
            <Txt x={960} y={150} size={52} c={C.chalk} w={900}>HOW LONG CAN YOU SURVIVE?</Txt>
            <Txt x={240} y={410} size={44} c="#d8c890" w={800} anchor="start">WITHOUT FOOD</Txt>
            <rect x={240} y={440} width={1440} height={80} rx={10} fill="#1d2927" />
            <rect x={240} y={440} width={1440 * 0.8 * a} height={80} rx={10} fill={C.amber} />
            <Txt x={1680} y={500} size={50} c="#0f1718" w={900} anchor="end" o={a}>WEEKS</Txt>
            <Txt x={240} y={690} size={44} c="#8fd0f0" w={800} anchor="start">WITHOUT WATER</Txt>
            <rect x={240} y={720} width={1440} height={80} rx={10} fill="#1d2927" />
            <rect x={240} y={720} width={1440 * 0.12 * b} height={80} rx={10} fill="#4a9ac8" />
            <Txt x={420 + 1440 * 0.12 * b} y={782} size={50} c={C.chalk} w={900} anchor="start" o={b}>DAYS</Txt>
            <Jug x={1700} y={940} s={1.1} />
          </SceneBG>
        );
      } },
    ],
  },

  /* ───────── c08: радио и счётчик ───────── */
  {
    id: "c08",
    beats: [
      { w: 5, r: ({ t, p }) => (
        <Cam a={{ x: 960, y: 560, z: 1 }} b={{ x: 820, y: 520, z: 1.4 }} p={p}>
          <RadioRoom t={t} lamp={0.7} dim={0.1} crank={t * 360} radioOn={t > 2.5}>
            <Person x={560} y={905} s={0.95} look={L.mark} pose={idle(t, { sit: 0, armR: [100, 60 + Math.sin(t * 6) * 25], armL: [4, 15], expr: "neutral", look: 0.5 })} />
            <Wave x={700} y={452} t={t} w={130} amp={10} c="#7a8a5a" />
          </RadioRoom>
        </Cam>
      ) },
      { w: 6, r: ({ t, p }) => {
        const msg = "STAY WHERE YOU ARE. DO NOT GO OUTSIDE. AWAIT FURTHER INSTRUCTIONS.";
        const n = Math.floor(msg.length * ramp(p, 0.15, 0.9));
        return (
          <g>
            <RadioRoom t={t} lamp={0.7} dim={0.1} radioOn crank={0}>
              {[0, 1, 2].map((i) => <circle key={i} cx={760} cy={470} r={(((t * 140 + i * 90) % 270)) + 30} fill="none" stroke="#7fe08a" strokeWidth={4} opacity={0.6 * (1 - ((t * 140 + i * 90) % 270) / 270)} />)}
            </RadioRoom>
            <rect x={160} y={780} width={1600} height={180} rx={10} fill="#0a100e" opacity={0.85} />
            <Txt x={200} y={850} size={36} c="#7fe08a" w={700} anchor="start" ls={2}>{msg.slice(0, Math.min(n, 40))}</Txt>
            <Txt x={200} y={910} size={36} c="#7fe08a" w={700} anchor="start" ls={2}>{msg.slice(40, n)}</Txt>
            <Tag x={960} y={120} text="EMERGENCY BROADCAST" p={ramp(t, 0.2, 0.8)} size={44} bg="#3a1a14" />
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1.0 }} b={{ x: 1130, y: 480, z: 1.9 }} p={p}>
            <RadioRoom t={t} lamp={0.65} dim={0.15} radioOn geigerV={0.45 + Math.sin(t * 3) * 0.04} />
            <Person x={1330} y={905} s={0.9} look={L.mark} pose={idle(t, { armR: [60, 100 + Math.sin(t * 9) * 8], expr: "neutral", look: -0.6, lean: 3 })} />
          </Cam>
          <Tag x={960} y={120} text="EVERY MORNING: ONE NUMBER" p={ramp(t, 0.5, 1.2)} size={40} />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => {
        const rows: [string, number][] = [["DAY 1", 700], ["DAY 3", 90], ["DAY 10", 18]];
        return (
          <SceneBG c="#14110e">
            <rect x={240} y={140} width={1440} height={800} rx={14} fill="#5a3a22" />
            <rect x={270} y={170} width={1380} height={740} rx={8} fill={C.paper} />
            <Txt x={960} y={260} size={52} c="#2a3a5a" w={900} italic>RADIATION AT THE HATCH</Txt>
            {rows.map(([d, v], i) => {
              const a = eio(ramp(p, 0.1 + i * 0.25, 0.32 + i * 0.25));
              return (
                <g key={i} opacity={a}>
                  <Txt x={340} y={420 + i * 150} size={58} c="#2a3a5a" w={800} anchor="start" italic>{d}</Txt>
                  <rect x={640} y={372 + i * 150} width={Math.max(10, (v / 700) * 800) * a} height={70} fill={i === 2 ? "#4a9a5a" : i === 1 ? "#c9a14a" : "#c64a3a"} rx={6} />
                  <Txt x={1560} y={424 + i * 150} size={64} c="#2a3a5a" w={900} anchor="end" italic>{v}</Txt>
                </g>
              );
            })}
            <Txt x={960} y={880} size={34} c="#6a5a3a" w={700} italic o={ramp(p, 0.8, 1)}>exactly what the rule predicted</Txt>
          </SceneBG>
        );
      } },
      { w: 7, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.75} dim={0.1} tally={10} tp={p}>
            <Person x={760} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [150 + Math.sin(t * 5) * 8, 40], expr: "neutral", look: -0.4 })} />
            <Person x={1250} y={905} s={0.9} look={L.elena} pose={idle(t, { expr: "neutral", look: -0.3 })} />
          </LivingRoom>
          <Tag x={960} y={120} text="NUMBERS BECAME THEIR CALENDAR" p={ramp(t, 0.4, 1.1)} size={40} />
          <Tag x={960} y={190} text="AND THEIR HOPE" p={ramp(t, 1.4, 2.0)} size={34} />
        </g>
      ) },
    ],
  },

  /* ───────── c09: две недели ───────── */
  {
    id: "c09",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <Cam a={{ x: 960, y: 580, z: 1 }} b={{ x: 1100, y: 620, z: 1.3 }} p={p}>
          <LivingRoom t={t} lamp={0.8} dim={0.1}>
            <Cards x={1130} y={692} />
            <Person x={1000} y={905} s={0.95} look={L.mark} pose={idle(t, { sit: 1, armR: [60 + Math.sin(t * 2) * 8, 80], expr: "happy" })} />
            <Person x={1260} y={905} s={0.9} look={L.elena} pose={idle(t, { sit: 1, armL: [55, 85], expr: "talk" })} />
            <Person x={1130} y={915} s={0.6} look={L.lily} pose={idle(t, { sit: 1, expr: "happy" })} />
            <Person x={620} y={850} s={0.4} look={L.noah} pose={idle(t, { expr: "sleep", rot: 90 })} />
          </LivingRoom>
        </Cam>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <RadioRoom t={t} lamp={0.8} dim={0.05} geigerV={0.28}>
            <Person x={1120} y={905} s={0.6} look={L.lily} pose={idle(t, { armR: [100, 25], expr: "happy", look: 0.7 })} />
            <Person x={1330} y={905} s={0.95} look={L.mark} pose={idle(t, { armL: [90, 30], expr: "talk", look: -0.6 })} />
          </RadioRoom>
          <Tag x={960} y={120} text="LEARNING TO READ THE DIALS" p={ramp(t, 0.4, 1.1)} size={40} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.8} dim={0.08}>
            <g transform="translate(300,360) rotate(-3)"><rect x={0} y={0} width={420} height={150} rx={6} fill="#c9b48a" stroke="#5a4430" strokeWidth={6} /><Txt x={210} y={62} size={32} c="#3a2a1a" w={900}>NO COMPLAINING</Txt><Txt x={210} y={108} size={32} c="#3a2a1a" w={900}>BEFORE BREAKFAST</Txt></g>
            <Person x={900} y={905} s={0.9} look={L.elena} pose={idle(t, { armL: [100, 20], expr: "talk", look: -0.3 })} />
            <Person x={1250} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [100, 140], expr: t > 2.5 ? "angry" : "neutral" })} />
            <Person x={1440} y={912} s={0.6} look={L.lily} pose={idle(t, { expr: "happy" })} />
          </LivingRoom>
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 520, z: 1 }} b={{ x: 780, y: 360, z: 1.9 }} p={p}>
            <LivingRoom t={t} lamp={0.75} dim={0.1} tally={14} tp={p}>
              <Person x={560} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [150 + Math.sin(t * 9) * 12, 40], expr: "neutral", look: 0.6 })} />
            </LivingRoom>
          </Cam>
          <Tag x={960} y={120} text="FOUR LINES, AND A SLASH" p={ramp(t, 0.4, 1.0)} size={42} />
        </g>
      ) },
      { w: 8, r: ({ t, p }) => {
        const off = ramp(p, 0.35, 0.6);
        return (
          <g>
            <RadioRoom t={t} lamp={0.7 - off * 0.3} dim={0.1 + off * 0.3} radioOn={off < 0.5} crank={0}>
              <Person x={560} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [100, 40 + Math.sin(t * 5) * 12], expr: off > 0.5 ? "sad" : "worry", look: 0.5 })} />
              <Wave x={640} y={452} t={t} w={240} amp={14} c="#7a8a5a" flat={off} />
            </RadioRoom>
            <Txt x={960} y={150} size={80} c={C.red} w={900} o={ramp(p, 0.6, 0.8)} ls={8}>SIGNAL LOST</Txt>
            <Fade o={ramp(p, 0.9, 1)} />
          </g>
        );
      } },
    ],
  },

  /* ───────── c10: еда ───────── */
  {
    id: "c10",
    beats: [
      { w: 6, r: ({ t, p }) => {
        const lines: [string, string][] = [["2,000", "KCAL / DAY"], ["× 4", "PEOPLE"], ["× 365", "DAYS"], ["× 12", "YEARS"]];
        return (
          <SceneBG c="#0f1716">
            {lines.map(([a, b], i) => {
              const k = eio(ramp(p, 0.05 + i * 0.16, 0.2 + i * 0.16));
              return <g key={i} opacity={k} transform={`translate(${340 + i * 430},${460 + (1 - k) * 30})`}><Txt x={0} y={0} size={96} c={C.chalk} w={900}>{a}</Txt><Txt x={0} y={60} size={30} c={C.amber} w={700} ls={4}>{b}</Txt></g>;
            })}
            <g opacity={eio(ramp(p, 0.75, 0.95))}>
              <rect x={460} y={620} width={1000} height={4} fill={C.amber} />
              <Txt x={960} y={780} size={140} c={C.amber} w={900}>35,000,000</Txt>
              <Txt x={960} y={850} size={40} c={C.chalk} w={800} ls={8}>CALORIES</Txt>
            </g>
          </SceneBG>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1 }} b={{ x: 960, y: 560, z: 1.12 }} p={p}>
            <StorageRoom t={t} lamp={0.85} dim={0.05}>
              <Person x={960} y={930} s={1.0} look={L.mark} pose={idle(t, { armL: [100, 20], armR: [100, 20], expr: "happy" })} />
            </StorageRoom>
          </Cam>
          <Tag x={960} y={110} text="SHELVES FOR 3 YEARS" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => {
        const items: [string, React.ReactNode][] = [
          ["BEANS", <Can key="a" x={0} y={40} c="#b8553a" w={80} h={100} />], ["RICE", <Sack key="b" x={0} y={50} />], ["OATS", <Can key="c" x={0} y={40} c="#c9a14a" w={80} h={100} />],
          ["POWDERED MILK", <Can key="d" x={0} y={40} c="#8a9ab8" w={80} h={100} />], ["HONEY", <Jar key="e" x={0} y={50} />], ["SALT", <Can key="f" x={0} y={40} c="#dcdcd0" w={70} h={90} />], ["VITAMINS", <Jar key="g" x={0} y={50} c="#c9c0a0" />],
        ];
        return (
          <SceneBG c="#101918">
            {items.map(([lab, node], i) => {
              const a = eio(ramp(p, 0.05 + i * 0.1, 0.18 + i * 0.1));
              return <g key={i} opacity={a} transform={`translate(${210 + i * 250},${440 + (1 - a) * 30}) scale(2.1)`}>{node}</g>;
            })}
            {items.map(([lab], i) => <Txt key={i} x={210 + i * 250} y={620} size={26} c={C.chalk} w={800} o={eio(ramp(p, 0.1 + i * 0.1, 0.25 + i * 0.1))}>{lab}</Txt>)}
            <Tag x={960} y={170} text="HONEY AND SALT NEVER SPOIL" p={ramp(p, 0.55, 0.7)} size={44} />
            <Tag x={960} y={800} text="RICE + DRY BEANS: DECADES, IF COOL AND DRY" p={ramp(p, 0.75, 0.9)} size={38} />
          </SceneBG>
        );
      } },
      { w: 7, r: ({ t, p }) => {
        const n = Math.floor(lerp(0, 96, ramp(p, 0.05, 0.8)));
        return (
          <g>
            <StorageRoom t={t} lamp={0.85} dim={0.08}>
              <Person x={1130} y={930} s={1.0} look={L.elena} pose={idle(t, { armR: [105 + Math.sin(t * 4) * 6, 30], expr: "neutral", look: 0.8 })} />
              <g transform="translate(700,260)"><rect width={340} height={130} rx={10} fill="#0a100e" opacity={0.85} /><Txt x={170} y={78} size={70} c={C.amber} w={900}>{n}</Txt><Txt x={170} y={112} size={22} c={C.chalk} w={700} ls={3}>CANS COUNTED</Txt></g>
            </StorageRoom>
            <Tag x={960} y={110} text="EVERY CAN COUNTED TWICE" p={ramp(t, 0.4, 1)} size={46} />
          </g>
        );
      } },
      { w: 7, r: ({ t, p }) => {
        const lvl = [1, 0.74, 0.5, 0.26][Math.min(3, Math.floor(p * 4))];
        return (
          <SceneBG c="#0f1716">
            <Txt x={960} y={150} size={50} c={C.chalk} w={900}>TWO SMALL MEALS A DAY</Txt>
            {[0, 1].map((i) => <g key={i} transform={`translate(${520 + i * 300},500)`}><ellipse rx={110} ry={30} cy={60} fill="#e8e0c8" /><ellipse rx={70} ry={16} cy={54} fill="#c9a14a" /><Clock x={0} y={-80} r={46} t={0} /><Txt x={0} y={150} size={28} c={C.amber} w={800}>{i ? "18:00" : "09:00"}</Txt></g>)}
            <g transform="translate(1200,300)">
              <rect width={560} height={380} rx={10} fill="#1d2927" />
              {[0, 1, 2, 3].map((i) => <g key={i}><rect x={30 + i * 130} y={340 - 280 * [1, 0.74, 0.5, 0.26][i]} width={100} height={280 * [1, 0.74, 0.5, 0.26][i]} fill={i === 3 ? C.red : C.amber} opacity={ramp(p, i * 0.22, i * 0.22 + 0.15)} /><Txt x={80 + i * 130} y={372} size={22} c={C.chalk} w={800}>{`Y${i}`}</Txt></g>)}
              <Txt x={280} y={-20} size={32} c={C.chalk} w={800} ls={3}>FOOD LEFT</Txt>
            </g>
            <Tag x={960} y={900} text="NOBODY EVER WASTED A CRUMB" p={ramp(p, 0.4, 0.6)} size={40} />
            <g opacity={0}>{lvl}</g>
          </SceneBG>
        );
      } },
    ],
  },

  /* ───────── c11: вода и энергия ───────── */
  {
    id: "c11",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <SceneBG c="#4a362a">
            <rect y={0} width={W} height={170} fill="#9ac0d8" /><rect y={170} width={W} height={900} fill="#5a4030" />
            <rect x={620} y={380} width={720} height={260} fill="#7a7f78" /><rect x={650} y={410} width={660} height={200} fill="#3a4a46" />
            <path d={`M -100 760 Q 500 700 960 780 T 2000 760`} stroke="#4a9ac8" strokeWidth={34} fill="none" />
            {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={((i * 260 + t * 120) % 2100) - 100} cy={760 + Math.sin(((i * 260 + t * 120) % 2100) / 150) * 20} r={6} fill="#d8f0f8" opacity={0.8} />)}
            <g opacity={ramp(p, 0.15, 0.4)}><Tag x={400} y={720} text="UNDERGROUND SPRING" size={34} p={ramp(p, 0.15, 0.4)} /></g>
            <g opacity={ramp(p, 0.4, 0.7)}><Tag x={960} y={340} text="BUNKER" size={34} p={ramp(p, 0.4, 0.6)} /></g>
            <g opacity={ramp(p, 0.55, 0.9)}><Tag x={1520} y={700} text="MICRO TURBINE" size={34} p={ramp(p, 0.55, 0.8)} /><g transform="translate(1500,770)"><g transform={`rotate(${t * 200})`}>{[0, 72, 144, 216, 288].map((a) => <rect key={a} x={-5} y={-48} width={10} height={48} fill="#c9a14a" transform={`rotate(${a})`} />)}</g></g></g>
            <Pipe pts={[[860, 640], [860, 740]]} w={20} c="#7ab4d0" />
            <g opacity={ramp(p, 0.3, 0.6)}><Tag x={860} y={830} text="WELL + HAND PUMP" size={30} p={ramp(p, 0.3, 0.5)} /></g>
          </SceneBG>
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <WaterRoom t={t} lamp={0.8} dim={0.08} flow={1}>
            <Person x={900} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [100, 70 + Math.sin(t * 3) * 25], armL: [60, 70 + Math.sin(t * 3) * 25], lean: Math.sin(t * 3) * 4, expr: "neutral" })} />
          </WaterRoom>
          <Tag x={960} y={110} text="A HAND PUMP" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1 }} b={{ x: 1380, y: 700, z: 1.7 }} p={p}>
            <WaterRoom t={t} lamp={0.8} dim={0.08} flow={1.3} />
          </Cam>
          <Tag x={960} y={110} text="JUST ENOUGH POWER" p={ramp(t, 0.4, 1)} size={46} />
          <g opacity={ramp(p, 0.5, 0.9)}>{[["LIGHTS", "bolt"], ["AIR FANS", "air"], ["RADIO", "radio"]].map(([l, k], i) => <Icon key={i} x={400 + i * 220} y={880} kind={k as "bolt"} r={56} />)}</g>
        </g>
      ) },
      { w: 8, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.85} dim={0.05}>
            <Person x={900} y={905} s={0.9} look={L.elena} pose={idle(t, { armL: [60 + Math.sin(t * 2) * 3, 70], armR: [75, 70], expr: "neutral", look: 0.5 })} />
            <rect x={1020} y={690} width={160} height={90} rx={8} fill="#6a7a74" />
            <g transform="translate(1100,690)"><rect x={-40} y={-70} width={80} height={70} rx={6} fill="#8a8f88" />{[0, 1, 2].map((i) => <path key={i} d={`M ${-20 + i * 20} -80 q 10 -20 0 -40 q -10 -20 0 -40`} stroke="#e8f0f0" strokeWidth={6} fill="none" opacity={0.5 - ((t * 0.8 + i * 0.3) % 1) * 0.4} transform={`translate(0,${-((t * 30 + i * 20) % 60)})`} />)}</g>
            <Jug x={1250} y={862} s={1.2} fill={0.9} />
          </LivingRoom>
          <Tag x={960} y={110} text="FILTER  →  BOIL" p={ramp(t, 0.4, 1)} size={50} />
          <Tag x={960} y={180} text="INVISIBLE THINGS KILL AS QUIETLY AS RADIATION" p={ramp(t, 2.2, 3)} size={30} bg="#3a1a14" />
        </g>
      ) },
      { w: 8, r: ({ t, p }) => (
        <g>
          <WaterRoom t={t} lamp={0.8} dim={0.35} flow={1} />
          <RuleCard n={0} title="WATER + POWER = SURVIVAL" lines={["No renewable source?", "Then a shelter is only a delay, not a solution."]} icon="water" p={ramp(t, 0.3, 2.4)} />
        </g>
      ) },
    ],
  },

  /* ───────── c12: воздух ───────── */
  {
    id: "c12",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <AirRoom t={t} lamp={0.8} dim={0.05} co2={0.28}>
            {Array.from({ length: 10 }, (_, i) => <path key={i} d="M 0 0 l 22 0 l -8 -8 m 8 8 l -8 8" stroke="#bfe8ff" strokeWidth={4} fill="none" opacity={0.8} transform={`translate(${160 + ((i * 70 + t * 160) % 700)},${520 + (i % 2) * 0})`} />)}
          </AirRoom>
          <Tag x={960} y={110} text="FILTERED INTAKE" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <AirRoom t={t} lamp={0.8} dim={0.05} co2={0.3} fanSpeed={Math.max(0.2, 0.5 + Math.sin(t * 4) * 0.4)}>
            <Person x={780} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [70, 70], armL: [60, 70], lean: Math.sin(t * 4) * 5, expr: "neutral" })} />
            <g transform={`translate(1050,640) rotate(${t * 230})`}><rect x={-4} y={-4} width={70} height={8} rx={4} fill="#c9a14a" /><circle cx={70} cy={0} r={10} fill="#8a6a45" /></g>
          </AirRoom>
          <Tag x={960} y={110} text="HAND-CRANK BACKUP FAN" p={ramp(t, 0.4, 1)} size={44} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => {
        const co2 = lerp(0.3, 0.92, eio(p));
        return (
          <g>
            <AirRoom t={t} lamp={0.7} dim={0.12} co2={co2} />
            <rect x={0} y={560} width={W} height={H - 560} fill="#10181a" opacity={0.0} />
            <Person x={480} y={930} s={0.9} look={L.lily} pose={idle(t, { armR: [150, 140], expr: co2 > 0.7 ? "sad" : "neutral" })} />
            <Person x={760} y={940} s={0.55} look={L.noah} pose={idle(t, { expr: co2 > 0.7 ? "angry" : "neutral" })} />
            <g opacity={ramp(p, 0.45, 0.8)}><Tag x={960} y={870} text="HEADACHES · IRRITABLE · BAD SLEEP" p={ramp(p, 0.45, 0.8)} size={38} bg="#3a1a14" /></g>
          </g>
        );
      } },
      { w: 7, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.8} dim={0.08}>
            <rect x={600} y={918} width={720} height={10} fill={C.amber} opacity={0.9} />
            <rect x={900} y={700} width={180} height={90} rx={8} fill="#6a7a74" />
            <Person x={820} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [60, 80 + Math.sin(t * 4) * 12], expr: "neutral" })} />
            <Person x={1090} y={905} s={0.9} look={L.elena} pose={idle(t, { armL: [60, 80 + Math.sin(t * 4 + 1) * 12], expr: "neutral" })} />
            <Person x={1500} y={915} s={0.6} look={L.lily} pose={idle(t, { expr: "happy", armR: [95, 20] })} />
            <g transform="translate(1400,300)"><rect width={300} height={120} rx={8} fill="#c9b48a" stroke="#5a4430" strokeWidth={5} /><Txt x={150} y={52} size={30} c="#3a2a1a" w={900}>MAX 2 AT THE</Txt><Txt x={150} y={92} size={30} c="#3a2a1a" w={900}>STOVE</Txt></g>
          </LivingRoom>
          <Tag x={960} y={110} text="A LINE ON THE FLOOR" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <AirRoom t={t} lamp={0.85} dim={0.05} co2={lerp(0.85, 0.25, eio(p))} fanSpeed={1.3}>
            <Person x={620} y={930} s={0.9} look={L.elena} pose={idle(t, { expr: "happy", armL: [10, 10], armR: [10, 10], look: 0.4 })} />
          </AirRoom>
          <Tag x={960} y={110} text="SMALL RULES. BIG DIFFERENCE." p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
    ],
  },

  /* ───────── c13: стены ───────── */
  {
    id: "c13",
    beats: [
      { w: 5, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.55} dim={0.3}>
            <Person x={760} y={905} s={0.95} look={L.mark} pose={idle(t, { armL: [100 + Math.sin(t * 6) * 15, 60], expr: "angry", look: 0.6 })} />
            <Person x={1160} y={905} s={0.9} look={L.elena} pose={idle(t, { armR: [100 + Math.sin(t * 6 + 1) * 15, 60], expr: "angry", look: -0.6 })} />
            <Can x={960} y={900} c="#b8553a" w={50} h={64} />
            <Tag x={760} y={400} text="!?" p={ramp(t, 1, 1.4)} size={60} bg="#3a1a14" />
            <Tag x={1160} y={420} text="?!" p={ramp(t, 1.6, 2)} size={60} bg="#3a1a14" />
          </LivingRoom>
          <Tag x={960} y={110} text="AFTER THE FIRST MONTH" p={ramp(t, 0.3, 1)} size={44} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <DoorRoom t={t} lamp={0.5} dim={0.3}>
            <Person x={560} y={905} s={0.55} look={L.noah} pose={idle(t, { armL: [150, 150], armR: [150, 150], expr: "sad", lookUp: 1 })} />
            <Person x={1200} y={920} s={0.6} look={L.lily} flip pose={idle(t, { expr: "sad", look: -1, lean: 3 })} />
            <Tag x={1200} y={500} text="3 DAYS OF SILENCE" p={ramp(t, 0.6, 1.2)} size={34} />
            <Tag x={560} y={600} text="'CAN WE SEE THE BIRDS?'" p={ramp(t, 1.4, 2)} size={30} />
          </DoorRoom>
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.8} dim={0.08} board={["NEW RULES", "-----------", "1 SCHEDULE", "2 EVERYONE WORKS", "3 TALK DAILY"]}>
            <Seated t={t} xs={[1000, 1260, 1130, 1380]} expr="neutral" />
            <Person x={760} y={905} s={0.95} look={L.elena} pose={idle(t, { armR: [105, 20], expr: "talk" })} />
          </LivingRoom>
          <Tag x={960} y={110} text="A FAMILY MEETING" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => {
        const rows: [string, string][] = [["07:00", "WAKE UP"], ["08:00", "EXERCISE"], ["10:00", "LESSONS"], ["13:00", "CHORES"], ["18:00", "DINNER"], ["20:00", "STORIES"]];
        return (
          <SceneBG c="#14201d">
            <rect x={300} y={120} width={1320} height={820} rx={16} fill="#1f2c28" stroke="#8a6a45" strokeWidth={12} />
            <Txt x={960} y={220} size={60} c={C.amber} w={900} ls={6}>THE SCHEDULE</Txt>
            {rows.map(([a, b], i) => {
              const k = eio(ramp(p, 0.1 + i * 0.13, 0.24 + i * 0.13));
              return <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 18})`}><Txt x={420} y={340 + i * 90} size={54} c="#9ab0a6" w={700} anchor="start">{a}</Txt><Txt x={760} y={340 + i * 90} size={54} c={C.chalk} w={800} anchor="start">{b}</Txt></g>;
            })}
          </SceneBG>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.85} dim={0.05}>
            <Person x={560} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [70 + Math.sin(t * 5) * 12, 60], armL: [60, 60], lean: Math.sin(t * 5) * 3, expr: "neutral" })} />
            <Person x={1000} y={905} s={0.9} look={L.elena} pose={idle(t, { armL: [60, 90 + Math.sin(t * 4) * 8], expr: "happy" })} />
            <Person x={1360} y={915} s={0.6} look={L.lily} pose={idle(t, { armR: [100, 40 + Math.sin(t * 3) * 15], expr: "neutral" })} />
            <Person x={1560} y={920} s={0.42} look={L.noah} pose={idle(t, { armR: [90, 60 + Math.sin(t * 6) * 20], expr: "happy" })} />
            <Can x={1260} y={862} /><Can x={1300} y={862} c="#5a8a5a" />
          </LivingRoom>
          <Tag x={960} y={110} text="EVERYONE HAD A JOB" p={ramp(t, 0.4, 1)} size={46} />
          <Tag x={960} y={190} text="PEOPLE WHO FEEL USEFUL RARELY BREAK" p={ramp(t, 2.4, 3)} size={32} />
        </g>
      ) },
      { w: 5, r: ({ t, p }) => {
        const on = eio(ramp(p, 0.25, 0.5));
        return (
          <g>
            <LivingRoom t={t} lamp={0.15 + on * 0.95} dim={0.5 * (1 - on)}>
              <Person x={1000} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [150, 150], expr: on > 0.5 ? "happy" : "neutral" })} />
              <Person x={1260} y={905} s={0.9} look={L.elena} pose={idle(t, { expr: on > 0.5 ? "happy" : "neutral" })} />
            </LivingRoom>
            <Tag x={960} y={110} text="ONE BRIGHT LAMP EVERY MORNING" p={ramp(t, 0.5, 1.2)} size={44} />
          </g>
        );
      } },
    ],
  },
];
void Geiger; void Notebook; void Clock; void Tally; void Dust; void Glow; void Barrel; void Gauge; void Mug; void Cards; void W; void H; void cl; void walk; void Big; void kidLook; void Pipe; void Jar; void lerp;
