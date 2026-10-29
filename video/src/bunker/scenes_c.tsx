import React from "react";
import { Cam, Person, Tag, Txt, C, W, H, cl, lerp, ramp, eio, L, walk, idle, Fade, Big, SceneBG, Icon, RuleCard, AGE, type Chunk } from "./kit";
import { LivingRoom, RadioRoom, StorageRoom, WaterRoom, GardenRoom, DoorRoom, Yard, Wasteland } from "./sets";
import { Geiger, Notebook, Clock, Tally, Dust, Glow, Can, Jar, Mug, Hatch, Ladder, FishTank, Plant, Tub, Jug, Phone } from "./props";
import { Seated, noahPJ } from "./scenes_a";

const SUIT = { ...L.mark, top: "#d4c35a" };
void SUIT;
const Wave: React.FC<{ x: number; y: number; t: number; w?: number; amp?: number; c?: string }> = ({ x, y, t, w = 400, amp = 24, c = "#7fe08a" }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 70; i++) { const u = i / 70; pts.push(`${x + u * w},${y + Math.sin(u * 38 + t * 20) * amp * (0.3 + 0.7 * Math.sin(u * 9 + t * 4) ** 2)}`); }
  return <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth={4} />;
};

const Pie: React.FC<{ x: number; y: number; r: number; v: number; c1: string; c2: string }> = ({ x, y, r, v, c1, c2 }) => {
  const a = v * Math.PI * 2, ex = x + Math.sin(a) * r, ey = y - Math.cos(a) * r;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c2} />
      {v > 0.001 && <path d={`M ${x} ${y} L ${x} ${y - r} A ${r} ${r} 0 ${v > 0.5 ? 1 : 0} 1 ${ex} ${ey} Z`} fill={c1} />}
    </g>
  );
};

export const chunksC: Chunk[] = [
  /* ───────── c14: первый год ───────── */
  {
    id: "c14",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.85} dim={0.05}>
            <g transform="translate(560,200)"><rect width={560} height={440} rx={8} fill="#1f2c28" stroke="#8a6a45" strokeWidth={8} />{"ABCDE".split("").map((ch, i) => <Txt key={i} x={70 + i * 100} y={190 + (i % 2) * 40} size={110} c={C.chalk} w={800} o={eio(ramp(p, 0.1 + i * 0.14, 0.22 + i * 0.14))}>{ch}</Txt>)}</g>
            <Person x={420} y={910} s={AGE.lily(8)} look={L.lily} pose={idle(t, { armR: [105, 25], expr: "talk", look: 0.7 })} />
            <Person x={1250} y={915} s={AGE.noah(4)} look={L.noah} pose={idle(t, { expr: "happy", look: -0.6 })} />
          </LivingRoom>
          <Tag x={960} y={110} text="LILY, 8, TEACHES NOAH THE ALPHABET" p={ramp(t, 0.4, 1)} size={38} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1.0 }} b={{ x: 1130, y: 640, z: 1.5 }} p={p}>
            <LivingRoom t={t} lamp={0.3} dim={0.4}>
              <Seated t={t} xs={[1000, 1260, 1130, 1380]} expr="neutral" />
              <Jar x={1070} y={692} c="#c9c0a0" />
              <Glow x={1130} y={640} r={260} o={0.5} id="bd" />
            </LivingRoom>
          </Cam>
          <Tag x={960} y={110} text="A BIRTHDAY · ONE CANDLE" p={ramp(t, 0.4, 1)} size={44} />
          <Tag x={960} y={180} text="MADE FROM WAX SAVED IN A JAR" p={ramp(t, 1.4, 2.0)} size={30} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <SceneBG c="#0f1716">
          <Txt x={960} y={420} size={200} c={C.chalk} w={900} o={eio(ramp(p, 0.1, 0.3))}>YEAR 1</Txt>
          <Tally x={460} y={560} n={365} p={ramp(p, 0.15, 0.9)} cols={12} />
          <Txt x={960} y={900} size={46} c={C.amber} w={800} ls={6} o={ramp(p, 0.6, 0.9)}>365 LINES ON THE WALL</Txt>
        </SceneBG>
      ) },
      { w: 7, r: ({ t, p }) => (
        <g>
          <DoorRoom t={t} lamp={0.8} dim={0.1}>
            <Person x={560} y={lerp(860, 300, eio(ramp(p, 0.1, 0.9)))} s={0.9} suit look={L.mark} pose={idle(t, { armL: [150, 160], armR: [150, 160 + Math.sin(t * 6) * 10], expr: "neutral" })} />
            <Person x={1000} y={925} s={0.9} look={L.elena} pose={idle(t, { armL: [10, 10], expr: "worry", look: -0.5 })} />
          </DoorRoom>
          <Tag x={960} y={110} text="TWICE A YEAR: A PROTECTIVE SUIT" p={ramp(t, 0.4, 1)} size={40} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Yard t={t} sky="grey" ash={0.7} hatchOpen={1} houseLit={false} />
          <Person x={1130} y={880} s={0.8} suit look={L.mark} pose={idle(t, { armR: [60, 70], heldR: <Geiger x={0} y={30} v={0.9 - ramp(p, 0.2, 0.9) * 0.5} t={t} s={0.3} />, expr: "neutral" })} />
          <Tag x={960} y={110} text="EACH TIME: LOWER" p={ramp(t, 1, 1.8)} size={50} />
        </g>
      ) },
      { w: 4, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.85} dim={0.05}>
            <Person x={1000} y={905} s={0.95} look={L.mark} pose={idle(t, { armL: [10, 10], expr: "neutral", look: 0 })} />
            <Person x={1260} y={905} s={0.9} look={L.elena} pose={idle(t, { expr: "sad", look: -0.5 })} />
          </LivingRoom>
          <Big x={960} y={400} text="NOT YET." t={t} t0={0.2} size={190} anchor="middle" c={C.amber} />
          <Tag x={960} y={950} text="LEAVING TOO EARLY IS THE MOST COMMON MISTAKE" p={ramp(t, 1, 1.6)} size={34} bg="#3a1a14" />
        </g>
      ) },
    ],
  },

  /* ───────── c15: радио и турбина ───────── */
  {
    id: "c15",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <RadioRoom t={t} lamp={0.6} dim={0.2} radioOn crank={0}>
            <Person x={560} y={905} s={0.95} look={L.mark} pose={idle(t, { armL: [60, 20], expr: "neutral", look: 0.5 })} />
            <Person x={1400} y={920} s={0.9} look={L.elena} pose={idle(t, { expr: "neutral", look: -0.5 })} />
            <rect x={0} y={0} width={W} height={H} fill="#7ab0d8" opacity={0.08} />
          </RadioRoom>
          <Tag x={960} y={110} text="THE SECOND WINTER" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 5, r: ({ t, p }) => {
        const digits = "7419362850".split("");
        return (
          <g>
            <RadioRoom t={t} lamp={0.6} dim={0.35} radioOn crank={0} />
            <rect x={300} y={300} width={1320} height={440} rx={14} fill="#0a100e" opacity={0.9} />
            <Wave x={380} y={420} t={t} w={1160} amp={50} />
            <g>{digits.map((d, i) => <Txt key={i} x={420 + i * 120} y={620} size={96} c="#7fe08a" w={800} o={ramp(p, i * 0.08, i * 0.08 + 0.1)}>{d}</Txt>)}</g>
            <Txt x={960} y={350} size={30} c="#9ab0a6" w={700} ls={6}>UNKNOWN LANGUAGE · NUMBERS ONLY</Txt>
            <Txt x={1500} y={700} size={40} c={C.amber} w={900} anchor="end">{`0:${String(Math.min(11, Math.floor(p * 11.9))).padStart(2, "0")}`}</Txt>
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.9} dim={0.0}>
            <Seated t={t} xs={[1000, 1260, 1130, 1380]} expr="neutral" />
            <Person x={1000} y={905} s={0.95} look={L.mark} pose={idle(t, { sit: 1, expr: "happy", armL: [140, 120], armR: [140, 120] })} />
            <Person x={1260} y={905} s={0.9} look={L.elena} pose={idle(t, { sit: 1, expr: "happy", armL: [60, 100] })} />
          </LivingRoom>
          <Tag x={960} y={110} text="SOMEONE ELSE WAS ALIVE" p={ramp(t, 0.4, 1)} size={50} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.8} dim={0.1} flicker={1}>
            <Seated t={t} expr="worry" />
          </LivingRoom>
          <Tag x={960} y={110} text="YEAR 3 · THE LIGHTS FLICKER" p={ramp(t, 0.3, 1)} size={46} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <WaterRoom t={t} lamp={0.4} dim={0.3} flow={0.3}>
            <rect x={0} y={0} width={W} height={H} fill="#4a7ab0" opacity={0.12} />
            <Person x={1180} y={905} s={0.85} look={L.mark} pose={idle(t, { armR: [70 + Math.sin(t * 5) * 20, 60], armL: [60, 70], lean: 12, expr: "worry" })} />
          </WaterRoom>
          <Tag x={960} y={110} text="TWO WEEKS IN A COLD, WET TUNNEL" p={ramp(t, 0.4, 1)} size={40} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1 }} b={{ x: 1250, y: 680, z: 1.5 }} p={p}>
            <WaterRoom t={t} lamp={0.4 + ramp(p, 0.2, 0.5) * 0.6} dim={0.2 * (1 - ramp(p, 0.2, 0.5))} flow={0.3 + ramp(p, 0.1, 0.5) * 1.3} />
          </Cam>
          <Tag x={960} y={110} text="THE LIGHTS HOLD STEADY" p={ramp(t, 1.0, 1.8)} size={46} />
        </g>
      ) },
    ],
  },

  /* ───────── c16: огород ───────── */
  {
    id: "c16",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <StorageRoom t={t} lamp={0.8} dim={0.1} fill={0.35}>
            <rect x={780} y={700} width={400} height={160} rx={8} fill="#6a4a30" />
            <rect x={760} y={680} width={440} height={30} rx={6} fill="#8a6a45" transform={`rotate(${-lerp(0, 40, eio(ramp(p, 0.2, 0.5)))} 760 710)`} />
            {["BEANS", "LETTUCE", "RADISH"].map((l, i) => <g key={i} transform={`translate(${860 + i * 120},${lerp(740, 590, eio(ramp(p, 0.4 + i * 0.1, 0.7 + i * 0.1)))})`} opacity={ramp(p, 0.4 + i * 0.1, 0.6 + i * 0.1)}><rect x={-34} y={-44} width={68} height={88} rx={4} fill="#e8dcc0" /><circle cy={-12} r={14} fill={["#6aa06a", "#8ac070", "#c8584a"][i]} /><Txt x={0} y={26} size={12} c="#3a2a1a" w={900}>{l}</Txt></g>)}
            <Person x={620} y={930} s={1.0} look={L.mark} pose={idle(t, { armR: [100, 40], expr: "happy", look: 0.8 })} />
            <Person x={1300} y={930} s={AGE.lily(11)} look={L.lily} pose={idle(t, { armL: [30, 20], expr: "surprised", look: -0.6 })} />
          </StorageRoom>
          <Tag x={960} y={110} text="A HIDDEN BOX: SEEDS · GROW LIGHTS · TUBS" p={ramp(t, 0.4, 1)} size={36} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <GardenRoom t={t} lamp={0.4} dim={0.05} grow={ramp(p, 0, 1)}>
            <Person x={1000} y={930} s={0.95} look={L.mark} pose={idle(t, { armR: [90, 30 + Math.sin(t * 3) * 20], expr: "happy", look: -0.7 })} />
          </GardenRoom>
          <Tag x={960} y={110} text="GROWN IN THE DARK" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => {
        const crops: [string, string][] = [["BEANS", "#6aa06a"], ["LETTUCE", "#8ac070"], ["RADISHES", "#c8584a"], ["MUSHROOMS", "#c9a888"]];
        return (
          <SceneBG c="#16121c">
            {crops.map(([l, c], i) => {
              const g = eio(ramp(p, 0.05 + i * 0.15, 0.5 + i * 0.15));
              return (
                <g key={i} transform={`translate(${340 + i * 410},700)`}>
                  <Tub x={0} y={120} w={300} plants={0} />
                  <g transform="scale(2.4)"><Plant x={0} y={30} g={0.2 + g * 0.9} c={c} mush={i === 3} /></g>
                  <Txt x={0} y={230} size={38} c={C.chalk} w={800}>{l}</Txt>
                </g>
              );
            })}
            <Txt x={960} y={180} size={54} c={C.amber} w={900} ls={4}>SLOW · MESSY · NEVER QUITE ENOUGH</Txt>
            <Txt x={960} y={270} size={38} c={C.chalk} w={700} o={ramp(p, 0.7, 0.95)}>BUT IT RENEWED ITSELF</Txt>
          </SceneBG>
        );
      } },
      { w: 7, r: ({ t, p }) => (
        <g>
          <GardenRoom t={t} lamp={0.45} dim={0.05}>
            <Person x={1000} y={940} s={AGE.noah(8)} look={L.noah} pose={idle(t, { armR: [80, 30], expr: "happy", look: 0.7 })} />
          </GardenRoom>
          <Cam a={{ x: 1300, y: 540, z: 1.0 }} b={{ x: 1300, y: 560, z: 1.0 }} p={0}><g /></Cam>
          <Tag x={960} y={110} text="EVEN A SMALL TANK OF FISH" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => {
        const v = lerp(0, 0.25, eio(ramp(p, 0.1, 0.7)));
        return (
          <SceneBG c="#0f1716">
            <Txt x={960} y={170} size={52} c={C.chalk} w={900}>BY YEAR 5: EVERY MEAL</Txt>
            <Pie x={760} y={560} r={260} v={v} c1="#7fb08a" c2="#8a6a45" />
            <Txt x={760} y={560} size={110} c="#fff" w={900} o={ramp(p, 0.3, 0.6)}>25%</Txt>
            <g transform="translate(1160,440)"><rect width={50} height={50} fill="#7fb08a" /><Txt x={80} y={40} size={44} c={C.chalk} w={800} anchor="start">THEIR OWN GARDEN</Txt><rect y={110} width={50} height={50} fill="#8a6a45" /><Txt x={80} y={150} size={44} c={C.chalk} w={800} anchor="start">STORED FOOD</Txt></g>
          </SceneBG>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <GardenRoom t={t} lamp={0.4} dim={0.45} />
          <RuleCard n={0} title="SELF-SUFFICIENCY" lines={["In a long shelter, it is not a luxury.", "It is the whole game."]} icon="food" p={ramp(t, 0.3, 2.2)} />
        </g>
      ) },
    ],
  },

  /* ───────── c17: медицина ───────── */
  {
    id: "c17",
    beats: [
      { w: 6, r: ({ t, p }) => {
        const fall = eio(ramp(p, 0.15, 0.4));
        return (
          <g>
            <DoorRoom t={t} lamp={0.8} dim={0.05}>
              <Person x={560 + fall * 40} y={lerp(300, 905, fall * fall)} s={AGE.noah(8)} look={L.noah} pose={idle(t, { armL: [150, 90], armR: [150, 90], expr: fall > 0.8 ? "cry" : "surprised", rot: fall * 60 })} />
              <Person x={lerp(1100, 700, ramp(p, 0.4, 0.8))} y={925} s={0.9} look={L.elena} pose={ramp(p, 0.4, 0.8) < 1 ? walk(t, 1.6, 1.3) : idle(t, { expr: "worry" })} />
            </DoorRoom>
            <Tag x={960} y={110} text="YEAR 6 · A FALL FROM THE LADDER" p={ramp(t, 0.3, 1)} size={42} />
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1.0 }} b={{ x: 1020, y: 640, z: 1.7 }} p={p}>
            <LivingRoom t={t} lamp={0.85} dim={0.05}>
              <Person x={1000} y={905} s={AGE.noah(9) * 1.0} look={L.noah} pose={idle(t, { sit: 1, expr: "cry", armR: [90, 60] })} />
              <Person x={800} y={905} s={0.95} look={L.elena} pose={idle(t, { armR: [90, 50 + Math.sin(t * 4) * 8], expr: "talk", look: 0.8 })} />
              <rect x={1030} y={640} width={150} height={14} rx={3} fill="#c9a14a" transform="rotate(25 1030 640)" />
            </LivingRoom>
          </Cam>
          <Tag x={960} y={110} text="A SPLINT MADE FROM A RULER" p={ramp(t, 0.4, 1)} size={44} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.7} dim={0.15}>
            <Person x={1100} y={905} s={0.95} look={L.mark} pose={idle(t, { sit: 1, armL: [150, 150], expr: "sad", tilt: 8 })} />
            <circle cx={1136} cy={620} r={26} fill="#c64a3a" opacity={0.5} />
            <ellipse cx={1130} cy={700} rx={80} ry={14} fill="#e8e0c8" /><ellipse cx={1130} cy={694} rx={52} ry={9} fill="#c9a14a" />
          </LivingRoom>
          <Tag x={960} y={110} text="A TOOTH INFECTION · DAYS WITHOUT EATING" p={ramp(t, 0.4, 1)} size={38} bg="#3a1a14" />
          <Tag x={960} y={190} text="NO DENTIST · NO HOSPITAL" p={ramp(t, 1.6, 2.3)} size={36} />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => {
        const rows: [string, string][] = [["ANTIBIOTICS", "12"], ["PAINKILLERS", "40"], ["BANDAGES", "60"], ["IODINE", "3"]];
        return (
          <SceneBG c="#101a18">
            <rect x={260} y={140} width={1400} height={800} rx={14} fill="#1f2c28" stroke="#c9a14a" strokeWidth={6} />
            <Txt x={960} y={230} size={54} c={C.amber} w={900} ls={6}>MEDICINE LOG</Txt>
            {rows.map(([a, b], i) => {
              const k = eio(ramp(p, 0.1 + i * 0.18, 0.28 + i * 0.18));
              return <g key={i} opacity={k}><rect x={340} y={300 + i * 120} width={1240} height={90} rx={8} fill="#14201d" /><Icon x={400} y={345 + i * 120} kind="heart" r={34} /><Txt x={470} y={360 + i * 120} size={46} c={C.chalk} w={800} anchor="start">{a}</Txt><Txt x={1540} y={360 + i * 120} size={58} c={C.amber} w={900} anchor="end">{b}</Txt></g>;
            })}
            <Txt x={960} y={900} size={32} c="#9ab0a6" w={700} o={ramp(p, 0.8, 1)}>COUNTED · LABELED · DATED</Txt>
          </SceneBG>
        );
      } },
      { w: 7, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.8} dim={0.4} />
          <RuleCard n={0} title="A FIRST-AID KIT IS A SKILL" lines={["Not a bag.", "Knowledge is the part that doesn't run out."]} icon="heart" p={ramp(t, 0.3, 2.2)} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <SceneBG c="#0f1a1a">
          <Txt x={960} y={190} size={56} c={C.chalk} w={900}>THE CHEAPEST MEDICINE: PREVENTION</Txt>
          {[["people", "CLEAN HANDS"], ["water", "CLEAN WATER"], ["air", "CLEAN AIR"]].map(([k, l], i) => {
            const a = eio(ramp(p, 0.1 + i * 0.25, 0.3 + i * 0.25));
            return <g key={i} opacity={a} transform={`translate(${400 + i * 560},${560 + (1 - a) * 30})`}><Icon x={0} y={0} kind={k as "water"} r={130} /><Txt x={0} y={230} size={44} c={C.chalk} w={800}>{l}</Txt></g>;
          })}
        </SceneBG>
      ) },
    ],
  },

  /* ───────── c18: Лили ───────── */
  {
    id: "c18",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.8} dim={0.08} tally={160} tp={1}>
            <Person x={300} y={905} s={0.98} look={L.lily} pose={idle(t, { expr: "neutral", look: 0.5 })} />
            <Person x={450} y={905} s={0.95} look={L.noah} pose={idle(t, { expr: "neutral", look: 0.3 })} />
          </LivingRoom>
          <Tag x={960} y={110} text="THE CHILDREN GREW TALLER THAN THE BUNKS" p={ramp(t, 0.4, 1)} size={38} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.8} dim={0.1}>
            <Person x={900} y={905} s={0.98} look={L.lily} pose={idle(t, { armR: [100 + Math.sin(t * 5) * 14, 40], expr: "angry", look: 0.7 })} />
            <Person x={1250} y={905} s={0.95} look={L.mark} pose={idle(t, { sit: 1, expr: "sad", look: -0.5 })} />
            <Tag x={900} y={420} text="WHY DO WE STAY?" p={ramp(t, 0.8, 1.4)} size={34} />
            <Tag x={900} y={500} text="WHAT IF THE WORLD IS FINE?" p={ramp(t, 2.0, 2.6)} size={34} />
          </LivingRoom>
          <Tag x={960} y={110} text="LILY, 15, QUESTIONS EVERYTHING" p={ramp(t, 0.3, 1)} size={42} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.7} dim={0.2}>
            <Clock x={960} y={290} r={92} t={t * 30} speed={1} />
            <Person x={900} y={905} s={0.98} look={L.lily} pose={idle(t, { armR: [100 + Math.sin(t * 7) * 18, 40], expr: "talk" })} />
            <Person x={1250} y={905} s={0.95} look={L.mark} pose={idle(t, { sit: 1, expr: "sad", look: -0.4 })} />
          </LivingRoom>
          <Tag x={960} y={110} text="HOURS OF ARGUING" p={ramp(t, 0.3, 1)} size={46} />
          <Tag x={960} y={190} text="FOR THE FIRST TIME, HE HAD NO ANSWER" p={ramp(t, 2.0, 2.8)} size={34} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <DoorRoom t={t} lamp={0.15} dim={0.55}>
            <Person x={560} y={lerp(860, 300, eio(ramp(p, 0.1, 0.9)))} s={0.95} look={L.lily} pose={idle(t, { armL: [150, 160], armR: [150, 160], expr: "worry", look: 0.4 })} />
          </DoorRoom>
          <Tag x={960} y={110} text="ONE NIGHT" p={ramp(t, 0.3, 1)} size={50} />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 560, y: 160, z: 1.8 }} b={{ x: 560, y: 190, z: 2.3 }} p={p}>
            <DoorRoom t={t} lamp={0.15} dim={0.55} wheel={Math.sin(t * 3) * 3} />
            <Person x={560} y={500} s={0.95} look={L.lily} pose={idle(t, { armL: [160, 140], armR: [160, 140], expr: "worry", look: 0.2, bob: Math.sin(t * 30) * 1.2 })} />
            <Person x={900} y={920} s={0.95} look={L.mark} pose={idle(t, { armR: [100, 10], expr: "sad", look: -0.5 })} opacity={ramp(p, 0.6, 0.9)} />
          </Cam>
        </g>
      ) },
      { w: 7, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.7} dim={0.2}>
            <Person x={1000} y={905} s={0.95} look={L.mark} pose={idle(t, { armR: [70, 60], heldR: <Geiger x={0} y={30} v={0.72} t={t} s={0.36} />, expr: "sad", look: 0.5 })} />
            <Person x={1220} y={905} s={0.98} look={L.lily} pose={idle(t, { expr: p > 0.5 ? "cry" : "worry", look: -0.5, armL: [10, 10] })} />
          </LivingRoom>
          <Tag x={960} y={110} text="'STILL HIGH ENOUGH TO MATTER'" p={ramp(t, 0.4, 1)} size={40} />
        </g>
      ) },
    ],
  },

  /* ───────── c19: первый выход ───────── */
  {
    id: "c19",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <DoorRoom t={t} lamp={0.8} dim={0.1} light={0.35 * ramp(p, 0.5, 1)}>
            <Person x={470} y={lerp(860, 330, eio(ramp(p, 0.05, 0.9)))} s={0.9} suit look={L.mark} pose={idle(t, { armL: [150, 160], armR: [150, 160], expr: "neutral" })} />
            <Person x={650} y={lerp(860, 340, eio(ramp(p, 0.1, 0.95)))} s={0.9} suit look={L.lily} pose={idle(t, { armL: [150, 160], armR: [150, 160] })} />
          </DoorRoom>
          <Tag x={960} y={110} text="YEAR 10 · ONE HOUR OUTSIDE" p={ramp(t, 0.3, 1)} size={44} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Wasteland t={t} ash={0.8} />
          <Person x={760} y={880} s={0.75} suit look={L.mark} pose={idle(t, { look: 0.5, expr: "neutral" })} />
          <Person x={900} y={890} s={0.72} suit look={L.lily} pose={idle(t, { look: 0.5 })} />
          <Tag x={960} y={110} text="A DULL GREY SKY · BARE TREES · ASH" p={ramp(t, 0.4, 1)} size={40} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => {
        const n = Math.min(10, Math.floor(p * 11));
        const k = ramp(p, 0.05, 0.9);
        return (
          <g>
            <Wasteland t={t} ash={0.8} />
            <Person x={lerp(600, 1000, k)} y={880 + k * 20} s={0.75 + k * 0.1} suit look={L.mark} pose={walk(t, 0.6, k < 0.95 ? 0.8 : 0)} />
            <Person x={lerp(480, 900, k)} y={890 + k * 20} s={0.72 + k * 0.1} suit look={L.lily} pose={walk(t + 1, 0.6, k < 0.95 ? 0.8 : 0)} />
            <Txt x={960} y={170} size={130} c={C.chalk} w={900}>{n} STEPS</Txt>
            <Geiger x={1650} y={300} v={0.4} t={t} s={1.0} />
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 540, z: 1.0 }} b={{ x: 1000, y: 880, z: 3.2 }} p={p}>
            <Wasteland t={t} green={ramp(p, 0.4, 0.9)} ash={0.5} />
          </Cam>
          <Tag x={960} y={110} text="SOMETHING SMALL AND IMPOSSIBLE" p={ramp(t, 0.6, 1.4)} size={44} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 1000, y: 800, z: 2.8 }} b={{ x: 1000, y: 800, z: 3.2 }} p={p}>
            <Wasteland t={t} green={1} ash={0.3} />
            <Person x={820} y={900} s={0.8} suit look={L.lily} pose={idle(t, { armR: [lerp(10, 80, eio(ramp(p, 0.1, 0.5))), 40], lean: lerp(0, 38, eio(ramp(p, 0.1, 0.5))), expr: "surprised" })} />
          </Cam>
          <Tag x={960} y={110} text="LILY KNELT AND TOUCHED IT" p={ramp(t, 0.4, 1)} size={46} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <DoorRoom t={t} lamp={0.85} dim={0.05} light={0.25 * (1 - ramp(p, 0.3, 0.8))}>
            <Person x={560} y={lerp(300, 860, eio(ramp(p, 0.05, 0.7)))} s={0.9} look={L.lily} pose={idle(t, { expr: "happy", armL: [150, 150], armR: [150, 150] })} />
            <Person x={640} y={lerp(300, 860, eio(ramp(p, 0.15, 0.8)))} s={0.9} look={L.mark} pose={idle(t, { expr: "happy", armL: [150, 150], armR: [150, 150] })} />
            <Person x={980} y={925} s={0.9} look={L.elena} pose={idle(t, { expr: "surprised", armL: [30, 10], armR: [30, 10] })} />
          </DoorRoom>
          <Tag x={960} y={110} text="NATURE STARTS AGAIN THE MOMENT IT'S ALLOWED" p={ramp(t, 0.8, 1.6)} size={36} />
        </g>
      ) },
    ],
  },

  /* ───────── c20: двенадцатый год ───────── */
  {
    id: "c20",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <SceneBG c="#0f1514">
            <Geiger x={960} y={720} v={lerp(0.1, 0.02, eio(p))} t={t} s={3.2} />
          </SceneBG>
          <Txt x={960} y={150} size={60} c={C.chalk} w={900} o={ramp(p, 0.1, 0.4)}>"THAT CAN'T BE RIGHT."</Txt>
          <Txt x={960} y={1000} size={74} c={C.amber} w={900} ls={8}>{`CHECK ${Math.min(3, 1 + Math.floor(p * 3))} / 3`}</Txt>
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.85} dim={0.05}>
            <Person x={1130} y={905} s={0.98} look={L.mark} pose={idle(t, { armL: [100, 20], armR: [100, 20], expr: "talk" })} />
            <Person x={900} y={905} s={0.9} look={L.elena} pose={idle(t, { sit: 1, expr: "surprised" })} />
            <Person x={1380} y={905} s={0.98} look={L.lily} pose={idle(t, { expr: "surprised" })} />
            <Person x={620} y={905} s={0.95} look={L.noah} pose={idle(t, { expr: "worry" })} />
          </LivingRoom>
          <Big x={960} y={420} text="IT'S TIME." t={t} t0={1.2} size={170} anchor="middle" c={C.amber} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <LivingRoom t={t} lamp={0.85} dim={0.05}>
            <Person x={560} y={905} s={0.9} look={L.elena} pose={idle(t, { armR: [60, 80], armL: [60, 80], expr: "neutral" })} />
            <Person x={1000} y={905} s={0.95} look={L.noah} pose={idle(t, { armL: [70, 100], heldL: <rect x={-18} y={-10} width={36} height={26} rx={4} fill="#4a5a3a" />, expr: "happy" })} />
            <Person x={1380} y={905} s={0.98} look={L.lily} pose={idle(t, { armR: [70, 100], heldR: <rect x={-14} y={-14} width={28} height={34} rx={3} fill="#6a4a2a" />, expr: "neutral" })} />
            <Tag x={560} y={480} text="THE BAG" p={ramp(t, 0.5, 1)} size={30} /><Tag x={1000} y={500} text="THE RADIO" p={ramp(t, 1.5, 2)} size={30} /><Tag x={1380} y={470} text="THE NOTEBOOK" p={ramp(t, 2.5, 3)} size={30} />
          </LivingRoom>
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 560, y: 160, z: 1.8 }} b={{ x: 560, y: 160, z: 2.3 }} p={p}>
            <DoorRoom t={t} lamp={0.8} dim={0.1} wheel={p * 900} light={ramp(p, 0.6, 1) * 0.5} />
            <Person x={560} y={500} s={0.95} look={L.mark} pose={idle(t, { armL: [160, 140], armR: [160, 140 + Math.sin(p * 20) * 10], expr: "neutral" })} />
          </Cam>
          <Tag x={960} y={110} text="ONE LAST TIME" p={ramp(t, 0.3, 1)} size={50} />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => (
        <g>
          <DoorRoom t={t} lamp={0.8} dim={0.0} light={eio(ramp(p, 0.05, 0.6))}>
            {[0, 1, 2, 3].map((i) => <Person key={i} x={560 + (i % 2) * 30 - 15} y={lerp(860, 340 + i * 80, eio(ramp(p, 0.3 + i * 0.1, 0.9)))} s={[0.95, 0.9, 0.95, 0.9][i]} look={[L.mark, L.elena, L.lily, L.noah][i]} pose={idle(t + i, { armL: [150, 160], armR: [150, 160], expr: "surprised" })} />)}
          </DoorRoom>
          <rect width={W} height={H} fill="#fff6c8" opacity={0.2 * ramp(p, 0.3, 1)} />
        </g>
      ) },
      { w: 8, r: ({ t, p }) => (
        <g>
          <Wasteland t={t} ash={0.2} gold={eio(ramp(p, 0, 0.5))} green={1} />
          <Glow x={1500} y={430} r={900} c="#ffe9a0" o={0.5} id="gl" />
          {[0, 1, 2, 3].map((i) => <Person key={i} x={620 + i * 150} y={900 + (i % 2) * 10} s={[0.8, 0.76, 0.78, 0.74][i]} look={[L.mark, L.elena, L.lily, L.noah][i]} pose={idle(t + i, { expr: "surprised", look: 0.5, lookUp: 1 })} />)}
          <rect width={W} height={H} fill="#fff6c8" opacity={0.4 * (1 - ramp(p, 0, 0.6))} />
        </g>
      ) },
    ],
  },

  /* ───────── c21: правила 1–4 ───────── */
  {
    id: "c21",
    beats: [
      { w: 6, r: ({ t, p }) => (<g><LivingRoom t={t} lamp={0.8} dim={0.5} noLamp /><RuleCard n={1} title="GET INSIDE. GET DEEP." lines={["Stay there."]} icon="door" p={ramp(t, 0, 1)} /></g>) },
      { w: 6, r: ({ t, p }) => (<g><LivingRoom t={t} lamp={0.8} dim={0.5} noLamp /><RuleCard n={2} title="THE RULE OF SEVEN" lines={["Time is your strongest shield", "against fallout."]} icon="clock" p={ramp(t, 0, 1)} /></g>) },
      { w: 6, r: ({ t, p }) => (<g><StorageRoom t={t} lamp={0.8} dim={0.5} /><RuleCard n={3} title="WATER FIRST" lines={["Then food.", "Then everything else."]} icon="water" p={ramp(t, 0, 1)} /></g>) },
      { w: 6, r: ({ t, p }) => (<g><RadioRoom t={t} lamp={0.8} dim={0.5} /><RuleCard n={4} title="CLEAN AIR. HONEST NUMBERS." lines={["Keep your notebook up to date."]} icon="book" p={ramp(t, 0, 1)} /></g>) },
    ],
  },
  /* ───────── c22: правила 5–8 ───────── */
  {
    id: "c22",
    beats: [
      { w: 6, r: ({ t, p }) => (<g><WaterRoom t={t} lamp={0.8} dim={0.5} /><RuleCard n={5} title="PLAN FOR POWER + REPAIRS" lines={["Things will break."]} icon="wrench" p={ramp(t, 0, 1)} /></g>) },
      { w: 6, r: ({ t, p }) => (<g><LivingRoom t={t} lamp={0.8} dim={0.5} noLamp /><RuleCard n={6} title="PROTECT YOUR MIND" lines={["Routine · work · light · conversation."]} icon="heart" p={ramp(t, 0, 1)} /></g>) },
      { w: 6, r: ({ t, p }) => (<g><Yard t={t} sky="grey" ash={0.7} /><Fade o={0.5} /><RuleCard n={7} title="DON'T LEAVE EARLY" lines={["Don't leave alone.", "Never leave without measuring."]} icon="geiger" p={ramp(t, 0, 1)} /></g>) },
      { w: 7, r: ({ t, p }) => (<g><LivingRoom t={t} lamp={0.9} dim={0.35} noLamp><Seated t={t} expr="neutral" /></LivingRoom><RuleCard n={8} title="YOU CANNOT SURVIVE ALONE" lines={["Not in a bunker.", "Not in a neighborhood. Not in a world."]} icon="people" p={ramp(t, 0, 1)} /></g>) },
    ],
  },
  /* ───────── c23: финал ───────── */
  {
    id: "c23",
    beats: [
      { w: 6, r: ({ t, p }) => (
        <g>
          <Yard t={t} sky="dusk" houseLit />
          <Tag x={960} y={120} text="THE ALERT WILL GIVE YOU MINUTES" p={ramp(t, 0.4, 1)} size={46} />
          <Phone x={1500} y={600} s={2.2} rot={Math.sin(t * 30) * 2} text={["ALERT", "MISSILE", "THREAT", "SEEK SHELTER"]} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <SceneBG c="#0f1716">
          {[["door", "GET INSIDE"], ["clock", "STAY INSIDE"], ["radio", "STAY TUNED"]].map(([k, l], i) => {
            const a = eio(ramp(p, 0.1 + i * 0.25, 0.3 + i * 0.25));
            return <g key={i} opacity={a} transform={`translate(${400 + i * 560},${520 + (1 - a) * 30})`}><Icon x={0} y={0} kind={k as "door"} r={140} /><Txt x={0} y={250} size={52} c={C.chalk} w={900}>{l}</Txt></g>;
          })}
        </SceneBG>
      ) },
      { w: 7, r: ({ t, p }) => (
        <g>
          <Wasteland t={t} ash={0.1} gold={1} green={1} />
          {[0, 1, 2, 3].map((i) => <Person key={i} x={lerp(300, 760, eio(p)) + i * 130} y={900} s={[0.85, 0.8, 0.82, 0.78][i]} look={[L.mark, L.elena, L.lily, L.noah][i]} pose={walk(t + i, 0.9, 0.7)} />)}
          <Txt x={960} y={160} size={64} c="#2a2a20" w={900} o={ramp(p, 0.3, 0.7)}>THE MOST PATIENT</Txt>
          <Fade o={ramp(p, 0.88, 1)} />
        </g>
      ) },
    ],
  },
  /* ───────── c24: эпилог — 12 лет за 30 секунд ───────── */
  {
    id: "c24",
    beats: [
      ...([
        ["YEAR 0", "THE ALERT"], ["YEAR 1", "ONE CANDLE"], ["YEAR 3", "THE TURBINE"], ["YEAR 5", "THE GARDEN"], ["YEAR 8", "THE QUESTION"], ["YEAR 12", "THE LIGHT"],
      ] as [string, string][]).map(([yr, lab], i) => ({
        w: 5,
        r: ({ t, p }: { t: number; p: number }) => {
          const k = ramp(t, 0, 0.4) * (1 - ramp(p, 0.9, 1));
          const bg = [
            <LivingRoom key="a" t={t} lamp={0.8} dim={0.25}><Seated t={t} expr="worry" /></LivingRoom>,
            <LivingRoom key="b" t={t} lamp={0.35} dim={0.4}><Seated t={t} expr="neutral" /><Jar x={1130} y={692} c="#c9c0a0" /><Glow x={1130} y={640} r={260} o={0.5} id="ep1" /></LivingRoom>,
            <WaterRoom key="c" t={t} lamp={0.8} dim={0.1} flow={1.2} />,
            <GardenRoom key="d" t={t} lamp={0.45} dim={0.05} />,
            <DoorRoom key="e" t={t} lamp={0.4} dim={0.3}><Person x={560} y={420} s={0.98} look={L.lily} pose={idle(t, { armL: [160, 140], armR: [160, 140], expr: "worry" })} /></DoorRoom>,
            <g key="f"><Wasteland t={t} ash={0.1} gold={1} green={1} />{[0, 1, 2, 3].map((q) => <Person key={q} x={620 + q * 150} y={900} s={[0.8, 0.76, 0.78, 0.74][q]} look={[L.mark, L.elena, L.lily, L.noah][q]} pose={idle(t + q, { expr: "happy" })} />)}</g>,
          ][i];
          return (
            <g>
              <Cam a={{ x: 960, y: 540, z: 1.0 }} b={{ x: 1000, y: 560, z: 1.12 }} p={p}>{bg}</Cam>
              <g opacity={k}><rect x={80} y={760} width={620} height={190} rx={10} fill="#0b100f" opacity={0.78} /><Txt x={110} y={860} size={96} c={C.amber} w={900} anchor="start" ls={4}>{yr}</Txt><Txt x={112} y={918} size={36} c={C.chalk} w={700} anchor="start" ls={6}>{lab}</Txt></g>
            </g>
          );
        },
      })),
      { w: 6, r: ({ t, p }) => (
        <SceneBG c="#0b100f">
          <Txt x={960} y={480} size={110} c={C.chalk} w={900} ls={4} o={eio(ramp(t, 0.4, 1.2))}>THANK YOU FOR WATCHING</Txt>
          <rect x={700} y={540} width={520} height={4} fill={C.amber} opacity={ramp(t, 0.8, 1.4)} />
          <Txt x={960} y={620} size={36} c={C.amber} w={700} ls={8} o={ramp(t, 1.2, 1.9)}>12 YEARS UNDERGROUND</Txt>
        </SceneBG>
      ) },
    ],
  },
];
void Notebook; void Tally; void Dust; void Can; void Mug; void Hatch; void Ladder; void FishTank; void Jug; void noahPJ; void cl; void H;
