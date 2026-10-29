import React from "react";
import { Cam, Person, Tag, Txt, C, W, H, cl, lerp, ramp, eio, L, walk, idle, blinkAt, mix, Fade, Big, SceneBG, Icon, RuleCard, AGE, type Chunk } from "./kit";
import { LivingRoom, DoorRoom, StorageRoom, KitchenHouse, Yard, Wasteland, Cutaway } from "./sets";
import { Phone, Mug, Geiger, Notebook, Clock, Tally, Skyline, Hatch, Ladder, Dust, Glow, Can, Jar, Jug, FishTank, SkyRect, House, Tree, Ground } from "./props";

export const kidLook = { ...L.lily, top: "#8ac0e0", top2: "#6aa0c0" };
export const noahPJ = { ...L.noah, top: "#d8c890", top2: "#b8a870" };
const bear = (<g><circle r={14} fill="#a8723a" /><circle cx={-10} cy={-12} r={6} fill="#a8723a" /><circle cx={10} cy={-12} r={6} fill="#a8723a" /><circle cx={-4} cy={-2} r={2} fill="#222" /><circle cx={4} cy={-2} r={2} fill="#222" /></g>);

const fam = (t: number, mode: "sit" | "stand" = "sit", base = 0) => null;
void fam;

/** семья, сидящая на кухне/в комнате — общий блок */
export const Seated: React.FC<{ t: number; xs?: number[]; y?: number; expr?: "neutral" | "sad" | "worry"; s?: number }> = ({ t, xs = [1000, 1260, 1130, 1380], y = 905, expr = "neutral", s = 1 }) => (
  <g>
    <Person x={xs[0]} y={y} s={0.95 * s} look={L.mark} pose={idle(t, { sit: 1, expr, look: Math.sin(t * 0.5) * 0.4 })} />
    <Person x={xs[1]} y={y} s={0.9 * s} look={L.elena} pose={idle(t + 1, { sit: 1, expr, look: -0.3 })} />
    <Person x={xs[2]} y={y + 8} s={0.6 * s} look={L.lily} pose={idle(t + 2, { sit: 1, expr })} />
    <Person x={xs[3]} y={y + 8} s={0.42 * s} look={L.noah} pose={idle(t + 3, { sit: 1, expr })} />
  </g>
);

export const chunksA: Chunk[] = [
  /* ───────── c01: холодный старт ───────── */
  {
    id: "c01",
    beats: [
      { w: 4, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 1300, y: 640, z: 1.0 }} b={{ x: 1380, y: 560, z: 1.3 }} p={p}>
            <DoorRoom t={t} flicker={1} wheel={Math.sin(t * 0.8) * 4} lamp={0.8} dim={0.12} />
          </Cam>
          <Big x={110} y={330} text="TWELVE YEARS" t={t} t0={0.5} size={104} />
          <Big x={110} y={450} text="FOUR PEOPLE" t={t} t0={1.5} size={104} />
          <Big x={110} y={570} text="ONE DOOR" t={t} t0={2.5} size={104} c={C.amber} />
          <Fade o={1 - ramp(t, 0, 0.8)} />
        </g>
      ) },
      { w: 5, r: ({ t, p }) => (
        <Cam a={{ x: 960, y: 560, z: 1.0 }} b={{ x: 1060, y: 600, z: 1.25 }} p={p}>
          <LivingRoom t={t} lamp={0.8} dim={0.25} flicker={0} tally={160} tp={p}>
            <Seated t={t} expr="neutral" />
          </LivingRoom>
          <Txt x={760} y={150} size={34} c={C.chalk} w={700} o={0.9}>DAYS</Txt>
        </Cam>
      ) },
      { w: 5, r: ({ t, p }) => {
        const xs = [300, 700, 1140, 1600], lab = ["15 MINUTES", "2 DAYS", "2 WEEKS", "12 YEARS"], sub = ["THE WARNING", "THE FALLOUT", "THE WAIT", "THE SURVIVAL"];
        const prog = ramp(p, 0.05, 0.92);
        return (
          <SceneBG c="#0f1716">
            <rect x={xs[0]} y={560} width={(xs[3] - xs[0]) * prog} height={10} fill={C.amber} />
            <rect x={xs[0]} y={564} width={xs[3] - xs[0]} height={2} fill="#ffffff22" />
            {xs.map((x, i) => {
              const k = eio(ramp(prog, (x - xs[0]) / (xs[3] - xs[0]) - 0.02, (x - xs[0]) / (xs[3] - xs[0]) + 0.08));
              return (
                <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 20})`}>
                  <circle cx={x} cy={565} r={20} fill="#0f1716" stroke={C.amber} strokeWidth={8} />
                  <Txt x={x} y={i % 2 ? 700 : 450} size={i === 3 ? 66 : 58} c={C.chalk} w={900}>{lab[i]}</Txt>
                  <Txt x={x} y={i % 2 ? 750 : 500} size={28} c={C.amber} w={700} ls={4}>{sub[i]}</Txt>
                </g>
              );
            })}
            <Txt x={960} y={230} size={46} c="#9ab0a6" w={700} ls={4}>THE FIRST HOURS DECIDE EVERYTHING</Txt>
          </SceneBG>
        );
      } },
      { w: 5, r: ({ t, p }) => (
        <g>
          <Yard t={t} sky="day" />
          <rect width={W} height={H} fill="#ff3a2a" opacity={0.1 + 0.1 * Math.sin(t * 12)} />
          <Phone x={520} y={520} s={2.6} rot={Math.sin(t * 40) * 3} text={["ALERT", "MISSILE", "THREAT", "SEEK SHELTER"]} />
          {[0, 1, 2].map((i) => <circle key={i} cx={520} cy={520} r={(((t * 140 + i * 90) % 270) + 40)} fill="none" stroke={C.red} strokeWidth={6} opacity={1 - ((t * 140 + i * 90) % 270) / 270} />)}
          <Txt x={1300} y={300} size={110} c="#fff" w={900}>9:14</Txt>
          <Txt x={1300} y={360} size={36} c="#fff" w={700} ls={6}>AM · TUESDAY</Txt>
        </g>
      ) },
      { w: 5, r: ({ t, p }) => {
        const k = eio(p), x0 = 360 + k * 780;
        return (
          <g>
            <Cam a={{ x: 960, y: 540, z: 1 }} b={{ x: 1100, y: 560, z: 1.12 }} p={p}>
              <Yard t={t} sky="dusk" hatchOpen={0.7} />
              <Person x={x0} y={900} s={0.95} look={L.mark} flip pose={walk(t, 1.9, 1.3)} />
              <Person x={x0 - 90} y={905} s={0.9} look={L.elena} flip pose={walk(t + 0.5, 1.9, 1.3)} />
              <Person x={x0 - 170} y={915} s={0.6} look={L.lily} flip pose={walk(t + 1, 2.4, 1.2)} />
              <Person x={x0 - 230} y={915} s={0.42} look={L.noah} flip pose={walk(t + 1.5, 2.8, 1.2)} />
            </Cam>
            <Fade o={ramp(p, 0.8, 1)} />
          </g>
        );
      } },
    ],
  },

  /* ───────── c02: тревога ───────── */
  {
    id: "c02",
    beats: [
      { w: 5, r: ({ t, p }) => (
        <g>
          <KitchenHouse t={t} alert={ramp(t, 2.2, 2.6)} />
          <Person x={620} y={930} s={1.15} look={L.mark} pose={idle(t, { armR: [75 - Math.sin(t) * 3, 105], heldR: <Mug x={0} y={0} />, expr: t > 2.2 ? "surprised" : "neutral" })} />
          {[0, 1].map((i) => <Phone key={i} x={1400 + i * 120} y={730} s={0.5} rot={80 + Math.sin(t * 40 + i) * (t > 2.2 ? 4 : 0)} lit={t > 2.2 ? 1 : 0} text={["ALERT", "MISSILE", "THREAT", "SEEK SHELTER"]} />)}
          <Txt x={1500} y={110} size={64} c="#2a2a2a" w={800}>TUESDAY · 9:14</Txt>
          <Tag x={620} y={270} text="MARK" p={ramp(t, 0.3, 0.9)} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => {
        const k = eio(ramp(p, 0.1, 0.9));
        return (
          <g>
            <KitchenHouse t={t} alert={1} />
            <Person x={lerp(520, 1180, k)} y={930} s={1.05} look={L.elena} pose={walk(t, 1.6, k < 0.95 ? 1.2 : 0)} flip={false} />
            <Person x={1220} y={940} s={0.6} look={kidLook} pose={idle(t, { expr: "surprised" })} />
            <Person x={1340} y={940} s={0.42} look={noahPJ} pose={idle(t, { expr: "worry", armR: [40, 80], heldR: bear })} />
            <Tag x={1220} y={500} text="LILY, 7" p={ramp(t, 1.5, 2)} />
            <Tag x={1340} y={560} text="NOAH, 3" p={ramp(t, 2, 2.5)} />
            <Tag x={520} y={420} text="ELENA" p={ramp(t, 0.3, 0.9)} />
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 540, z: 1.0 }} b={{ x: 1000, y: 540, z: 1.1 }} p={p}>
            <Yard t={t} sky="dusk" hatchOpen={0.7} />
          </Cam>
          <Fade o={0.45} />
          <RuleCard n={1} title="GET INSIDE. GO DEEP." lines={["Concrete, brick, soil.", "The more mass around you, the better."]} icon="door" p={ramp(t, 0.2, 1.8)} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => {
        const items: [React.ComponentProps<typeof Icon>["kind"], string][] = [["eye", "DON'T WATCH THE SKY"], ["camera", "DON'T FILM IT"], ["phone", "DON'T CALL ANYONE"]];
        return (
          <SceneBG c="#101816">
            <Txt x={960} y={200} size={44} c={C.amber} w={800} ls={8}>IN THE FIRST MINUTES</Txt>
            {items.map(([k, txt], i) => {
              const a = eio(ramp(p, 0.1 + i * 0.22, 0.28 + i * 0.22));
              return (
                <g key={i} opacity={a} transform={`translate(${380 + i * 580},${560 + (1 - a) * 40})`}>
                  <Icon x={0} y={0} kind={k} r={130} cross={ramp(p, 0.2 + i * 0.22, 0.34 + i * 0.22) > 0.5} />
                  <Txt x={0} y={230} size={38} c={C.chalk} w={800}>{txt}</Txt>
                </g>
              );
            })}
          </SceneBG>
        );
      } },
      { w: 4, r: ({ t, p }) => {
        const k = eio(p), x0 = 300 + k * 900;
        return (
          <g>
            <Cam a={{ x: 700, y: 540, z: 1.0 }} b={{ x: 1250, y: 560, z: 1.18 }} p={p}>
              <Yard t={t} sky="day" hatchOpen={0.7} />
              <Person x={x0} y={900} s={0.95} look={L.mark} flip pose={walk(t, 2, 1.4)} />
              <Person x={x0 - 80} y={905} s={0.9} look={L.elena} flip pose={walk(t + 0.5, 2, 1.4)} />
              <Person x={x0 - 150} y={915} s={0.6} look={kidLook} flip pose={walk(t + 1, 2.6, 1.3)} />
              <Person x={x0 - 200} y={915} s={0.42} look={noahPJ} flip pose={walk(t + 1.5, 3, 1.3)} />
            </Cam>
            <Txt x={960} y={120} size={64} c="#fff" w={900}>14:00</Txt>
            <Fade o={0} />
          </g>
        );
      } },
    ],
  },

  /* ───────── c03: три волны ───────── */
  {
    id: "c03",
    beats: [
      { w: 6, r: ({ t, p }) => {
        const flashR = p * 2200;
        return (
          <g>
            <SkyRect top="#2a3a5a" mid="#5a7a9a" bot="#c0d0d8" h={760} />
            <Skyline y={760} c="#2a3a48" n={14} seed={2} lit={0.6} />
            <rect y={760} width={W} height={400} fill="#26302d" />
            <circle cx={1400} cy={640} r={flashR} fill="#fff" opacity={0.95} />
            <rect width={W} height={H} fill="#fff" opacity={ramp(p, 0.55, 0.85) * (1 - ramp(p, 0.9, 1))} />
            <Tag x={960} y={130} text="1 · THE FLASH" p={ramp(t, 0.3, 0.9)} size={46} />
            <g opacity={ramp(p, 0.4, 0.7)}><Icon x={420} y={420} kind="eye" r={90} cross /></g>
          </g>
        );
      } },
      { w: 7, r: ({ t, p }) => {
        const ringR = lerp(80, 2100, eio(p)), shake = Math.sin(t * 50) * 6 * ramp(p, 0.3, 0.8);
        return (
          <g>
            <g transform={`translate(${shake},${Math.sin(t * 43) * 5 * ramp(p, 0.3, 0.8)})`}>
              <SkyRect top="#5a4a5a" mid="#a08a8a" bot="#e0c0a0" h={760} />
              <Skyline y={760} c="#3a3a48" n={14} seed={2} />
              <rect y={760} width={W} height={400} fill="#2a2e2c" />
              <Dust t={t} n={120} c="#c8b898" o={0.6} speed={200} seed={5} r={4} />
            </g>
            <circle cx={1500} cy={760} r={ringR} fill="none" stroke="#fff" strokeWidth={14} opacity={1 - ramp(p, 0.7, 1)} />
            <circle cx={1500} cy={760} r={ringR * 0.88} fill="none" stroke="#ffd8a0" strokeWidth={6} opacity={0.6 * (1 - ramp(p, 0.7, 1))} />
            <Tag x={960} y={130} text="2 · THE SHOCKWAVE" p={ramp(t, 0.3, 0.9)} size={46} />
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Yard t={t} sky="grey" ash={1} houseLit={false} />
          <Geiger x={420} y={420} v={lerp(0.3, 0.95, p)} t={t} s={1.5} />
          <Tag x={960} y={130} text="3 · THE FALLOUT" p={ramp(t, 0.3, 0.9)} size={46} />
          <Tag x={960} y={210} text="HOURS TO DAYS" p={ramp(t, 0.9, 1.5)} size={32} bg="#3a1a14" />
        </g>
      ) },
      { w: 7, r: ({ t, p }) => {
        const walls: [number, number, string, string][] = [[480, 14, "THIN WOOD", "#a8845a"], [960, 60, "BRICK", "#a8523a"], [1440, 170, "CONCRETE", "#8a8f88"]];
        return (
          <SceneBG c="#12191a">
            <rect y={780} width={W} height={300} fill="#1e2a28" />
            {walls.map(([x, w, label, col], i) => {
              const a = ramp(p, 0.1 + i * 0.2, 0.3 + i * 0.2);
              const pass = [1, 0.35, 0.02][i];
              return (
                <g key={i} opacity={eio(a)}>
                  <rect x={x - w / 2} y={260} width={w} height={520} fill={col} stroke="#00000055" strokeWidth={4} />
                  {[0, 1, 2, 3].map((q) => {
                    const sx = x - 200 - ((t * 140 + q * 60) % 140), y = 330 + q * 110;
                    return <g key={q}><line x1={sx - 110} y1={y} x2={x - w / 2 - 4} y2={y} stroke="#ff6a4a" strokeWidth={5} strokeDasharray="14 10" />{(q / 3) < pass + 0.001 && <line x1={x + w / 2 + 4} y1={y} x2={x + w / 2 + 110} y2={y} stroke="#ff6a4a" strokeWidth={5} strokeDasharray="14 10" opacity={pass} />}</g>;
                  })}
                  <Person x={x + 210} y={860} s={0.5} look={L.mark} pose={idle(t, { expr: pass > 0.3 ? "worry" : "neutral" })} />
                  <Txt x={x} y={930} size={34} c={C.chalk} w={800}>{label}</Txt>
                  <circle cx={x + 210} cy={430} r={26} fill={pass > 0.3 ? C.red : C.green} />
                  <Txt x={x + 210} y={440} size={26} c="#fff" w={900}>{pass > 0.3 ? "!" : "OK"}</Txt>
                </g>
              );
            })}
            <Txt x={960} y={170} size={54} c={C.chalk} w={900}>THICKER + DENSER = SAFER</Txt>
          </SceneBG>
        );
      } },
    ],
  },

  /* ───────── c04: строительство и спуск ───────── */
  {
    id: "c04",
    beats: [
      { w: 5, r: ({ t, p }) => {
        const yr = 1 + Math.floor(p * 2.99);
        return (
          <g>
            <Yard t={t} sky="day" />
            <Person x={1040} y={910} s={1.0} look={L.mark} pose={idle(t, { armL: [30 + Math.sin(t * 7) * 40, 70], armR: [20 + Math.sin(t * 7) * 40, 80], lean: Math.sin(t * 7) * 6, expr: "neutral" })} />
            {[0, 1].map((i) => <Person key={i} x={300 + i * 110} y={820} s={0.7} look={i ? L.neighbor : L.officer} flip={i === 1} pose={idle(t + i, { expr: "happy", armL: [20, 40], armR: [20, 40], tilt: Math.sin(t * 8 + i) * 5 })} />)}
            <Tag x={360} y={470} text="HA HA HA" p={ramp(t, 1, 1.6)} size={30} />
            <Tag x={960} y={120} text={`YEAR ${yr} OF BUILDING`} p={ramp(t, 0.2, 0.8)} size={44} />
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cutaway t={t} p={ramp(p, 0, 0.7)} labels />
          <g opacity={ramp(p, 0.3, 0.5)}><Tag x={1500} y={640} text="STEEL DOOR" size={32} p={ramp(p, 0.3, 0.45)} /></g>
          <g opacity={ramp(p, 0.5, 0.7)}><Tag x={1000} y={520} text="SEALED VENTILATION + FILTERS" size={30} p={ramp(p, 0.5, 0.65)} /></g>
          <g opacity={ramp(p, 0.7, 0.9)}><Tag x={960} y={950} text="4 METERS UNDERGROUND" size={40} p={ramp(p, 0.7, 0.85)} /></g>
        </g>
      ) },
      { w: 5, r: ({ t, p }) => {
        const k = eio(p);
        return (
          <DoorRoom t={t} lamp={0.8} dim={0.1} light={0.4 * (1 - ramp(p, 0.6, 1))}>
            {[0, 1, 2, 3].map((i) => {
              const y = lerp(200, 780, ramp(p, i * 0.12, 0.55 + i * 0.12));
              const look = [L.mark, L.elena, L.lily, L.noah][i], s = [0.9, 0.85, 0.6, 0.42][i];
              return <Person key={i} x={560 + (i % 2 ? 40 : -40)} y={y + 130 * s} s={s} look={look} pose={idle(t + i, { armL: [150, 160], armR: [150, 160], lean: 0, expr: "worry" })} opacity={ramp(p, i * 0.1, i * 0.1 + 0.1)} />;
            })}
            <Fade o={0} />
          </DoorRoom>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 560, y: 120, z: 1.6 }} b={{ x: 560, y: 150, z: 2.2 }} p={p}>
            <DoorRoom t={t} lamp={0.7} dim={0.15} wheel={p * 720} light={0.5 * (1 - ramp(p, 0.1, 0.8))} />
            <Person x={560} y={500} s={0.9} look={L.mark} pose={idle(t, { armL: [160, 140], armR: [160, 140 + Math.sin(p * 20) * 10], expr: "neutral", lean: 0 })} />
          </Cam>
          <Tag x={960} y={130} text="CLANG." p={ramp(p, 0.7, 0.8)} size={60} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <Cam a={{ x: 1000, y: 560, z: 1.0 }} b={{ x: 1060, y: 640, z: 1.5 }} p={p}>
          <LivingRoom t={t} lamp={0.55} dim={0.3} tally={0}>
            <Seated t={t} expr="worry" />
          </LivingRoom>
        </Cam>
      ) },
    ],
  },

  /* ───────── c05: удар ───────── */
  {
    id: "c05",
    beats: [
      { w: 5, r: ({ t, p }) => {
        const sh = ramp(t, 0.8, 1.2) * (1 - ramp(t, 3.4, 4.6));
        return (
          <g transform={`translate(${Math.sin(t * 55) * 9 * sh},${Math.sin(t * 47) * 7 * sh})`}>
            <LivingRoom t={t} lamp={0.7} dim={0.25} flicker={sh > 0.2 ? 1 : 0}>
              <Seated t={t} expr="worry" />
              <Clock x={960} y={300} r={80} t={0} />
              <Txt x={960} y={420} size={46} c="#e8c070" w={800}>9:41</Txt>
              <Dust t={t} n={60} c="#b8b098" o={0.7 * sh} speed={160} seed={9} r={3} />
            </LivingRoom>
          </g>
        );
      } },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1.1 }} b={{ x: 1000, y: 480, z: 1.7 }} p={p}>
            <LivingRoom t={t} lamp={0.6} dim={0.3} />
            <Person x={1130} y={930} s={1.0} look={L.elena} pose={idle(t, { armL: [100, 20], armR: [4, 10], expr: "sad", look: 0.6 })} />
            {[0, 1, 2].map((i) => <circle key={i} cx={1235} cy={600} r={(((t * 90 + i * 50) % 150)) + 10} fill="none" stroke="#e8c070" strokeWidth={4} opacity={0.6 * (1 - ((t * 90 + i * 50) % 150) / 150) * (1 - ramp(p, 0.5, 1))} />)}
          </Cam>
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <SkyRect top="#1a1210" mid="#4a2a1a" bot="#c0602a" h={760} />
          <Skyline y={760} c="#0f0d0c" n={14} seed={6} />
          <rect y={760} width={W} height={400} fill="#14100e" />
          <Glow x={1400} y={720} r={620 * (0.6 + p * 0.5)} c="#ff7a2a" o={0.7} id="horiz" />
          <g opacity={ramp(p, 0.2, 0.8)}>{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={1400 + Math.sin(t * 0.7 + i) * (30 + i * 6)} cy={700 - i * 70 - (t * 20) % 40} rx={50 + i * 14} ry={40 + i * 7} fill="#2a2420" opacity={0.85} />)}</g>
          <Dust t={t} n={70} c="#e8b878" o={0.6} speed={80} seed={4} />
          <Tag x={960} y={130} text="A CITY NO LONGER EXISTED" p={ramp(t, 0.8, 1.6)} size={40} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <g>
          <Yard t={t} sky="grey" ash={1} houseLit={false} />
          <rect width={W} height={H} fill="#10181a" opacity={0.2} />
          <Tag x={960} y={150} text="THE DANGER HAD ONLY JUST BEGUN" p={ramp(t, 0.3, 1.0)} size={40} />
        </g>
      ) },
      { w: 6, r: ({ t, p }) => (
        <SceneBG c="#0f1514">
          <Cam a={{ x: 960, y: 560, z: 2.2 }} b={{ x: 960, y: 540, z: 2.6 }} p={p}>
            <Geiger x={960} y={620} v={lerp(0.35, 1.0, eio(p))} t={t} s={2.2} />
          </Cam>
          <Tag x={960} y={150} text="OUTSIDE THE HATCH: DEADLY" p={ramp(t, 0.5, 1.2)} size={44} bg="#3a1a14" />
          <Fade o={0} />
        </SceneBG>
      ) },
    ],
  },

  /* ───────── c06: правило семёрки ───────── */
  {
    id: "c06",
    beats: [
      { w: 5, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 540, z: 1.0 }} b={{ x: 960, y: 560, z: 1.12 }} p={p}>
            <SceneBG c="#1a1410"><rect x={300} y={100} width={1320} height={780} rx={14} fill="#5a3a22" /></SceneBG>
            <Notebook x={960} y={470} s={3.5} lines={["THE RULE OF SEVEN", "x7 time = /10 dose", "", "7 h  ->  10 %", "49 h ->  1 %"]} p={ramp(p, 0.1, 0.95)} />
          </Cam>
        </g>
      ) },
      { w: 7, r: ({ t, p }) => {
        const X = (h: number) => 300 + (Math.log10(h) / Math.log10(400)) * 1320, R = (h: number) => Math.pow(h, -1.2), Y = (h: number) => 220 + (-Math.log10(R(h)) / 3.2) * 640;
        const prog = ramp(p, 0.08, 0.8);
        const hMax = Math.pow(400, prog);
        const pts: string[] = [];
        for (let i = 0; i <= 60; i++) { const h = Math.pow(hMax, i / 60); pts.push(`${X(h)},${Y(h)}`); }
        const marks: [number, string, string][] = [[7, "7 HOURS", "10 %"], [49, "49 HOURS", "1 %"], [343, "2 WEEKS", "0.1 %"]];
        return (
          <SceneBG c="#101a19">
            <line x1={300} y1={900} x2={1620} y2={900} stroke="#9ab0a6" strokeWidth={4} /><line x1={300} y1={200} x2={300} y2={900} stroke="#9ab0a6" strokeWidth={4} />
            <Txt x={960} y={980} size={32} c="#9ab0a6" w={700}>TIME AFTER THE BLAST</Txt>
            <Txt x={150} y={560} size={32} c="#9ab0a6" w={700} anchor="middle">RADIATION</Txt>
            <polyline points={pts.join(" ")} fill="none" stroke={C.amber} strokeWidth={9} strokeLinecap="round" />
            {marks.map(([h, a, b], i) => {
              const k = eio(ramp(hMax, h * 0.98, h * 1.06));
              return (
                <g key={i} opacity={k} transform={`translate(${X(h)},${Y(h)})`}>
                  <circle r={15} fill={C.red} stroke="#fff" strokeWidth={4} />
                  <Txt x={0} y={-60} size={54} c={C.chalk} w={900}>{b}</Txt>
                  <Txt x={0} y={-24} size={30} c={C.amber} w={800}>{a}</Txt>
                </g>
              );
            })}
          </SceneBG>
        );
      } },
      { w: 7, r: ({ t, p }) => {
        const rows: [string, number, string][] = [["7 HOURS", 0.1, "10 %"], ["49 HOURS", 0.01, "1 %"], ["2 WEEKS", 0.001, "0.1 %"]];
        return (
          <SceneBG c="#0f1716">
            <Txt x={960} y={170} size={56} c={C.chalk} w={900}>EVERY ×7 IN TIME = ÷10 IN RADIATION</Txt>
            {rows.map(([lab, v, pct], i) => {
              const a = eio(ramp(p, 0.1 + i * 0.22, 0.32 + i * 0.22));
              return (
                <g key={i} opacity={a} transform={`translate(0,${i * 210})`}>
                  <Txt x={200} y={400} size={50} c={C.amber} w={900} anchor="start">{lab}</Txt>
                  <rect x={640} y={350} width={1000} height={64} rx={8} fill="#1e2a28" />
                  <rect x={640} y={350} width={Math.max(6, 1000 * Math.sqrt(v) * a)} height={64} rx={8} fill={i === 2 ? C.green : i === 1 ? C.amber : C.red} />
                  <Txt x={1700} y={402} size={52} c={C.chalk} w={900} anchor="end">{pct}</Txt>
                </g>
              );
            })}
          </SceneBG>
        );
      } },
      { w: 7, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 1100, y: 600, z: 1.3 }} b={{ x: 1130, y: 640, z: 1.5 }} p={p}>
          <LivingRoom t={t} lamp={0.8} dim={0.15} tally={14} tp={p}>
            <Clock x={960} y={300} r={90} t={t * 14} speed={1} />
            <Seated t={t} xs={[1000, 1260, 1130, 1380]} expr="neutral" />
          </LivingRoom>
          </Cam>
          <Tag x={960} y={110} text="TIME IS THE SHIELD" p={ramp(t, 0.5, 1.2)} size={46} />
        </g>
      ) },
      { w: 8, r: ({ t, p }) => (
        <g>
          <Cam a={{ x: 960, y: 560, z: 1.0 }} b={{ x: 960, y: 520, z: 1.12 }} p={p}>
            <LivingRoom t={t} lamp={0.75} dim={0.1} />
            <Person x={420} y={780} s={0.5} look={L.lily} pose={idle(t, { expr: "sleep", rot: 90 })} />
          </Cam>
          <RuleCard n={0} title="STAY INSIDE 24 HOURS +" lines={["Ideally far longer.", "The worst fades fast, if you give it time."]} icon="clock" p={ramp(t, 0.3, 2.0)} />
        </g>
      ) },
    ],
  },
];
