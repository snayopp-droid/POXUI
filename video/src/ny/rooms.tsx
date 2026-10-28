import React, { useMemo } from "react";
import * as THREE from "three";
import { rnd } from "../after/util";
import { cv, mkTex, once, signTex, concreteTex, tileTex, brickTexNY } from "./tex";
import { Box, M } from "./props";

type V = [number, number, number];
export type Opening = { wall: "back" | "front" | "left" | "right"; c: number; y0: number; wd: number; ht: number; kind: "window" | "door"; view?: THREE.Texture; glow?: string; open?: number };

/** вид из окна */
export const outsideTex = (kind: "moscow-night" | "moscow-dawn" | "brick" | "ny-night" | "clouds" | "ny-dusk" | "ny-day") =>
  once(`out|${kind}`, () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    const sky = g.createLinearGradient(0, 0, 0, 512);
    if (kind === "moscow-night") { sky.addColorStop(0, "#0b1226"); sky.addColorStop(1, "#27304f"); }
    else if (kind === "moscow-dawn") { sky.addColorStop(0, "#5a6b9a"); sky.addColorStop(1, "#f0b48a"); }
    else if (kind === "ny-night") { sky.addColorStop(0, "#0a0f20"); sky.addColorStop(1, "#3a2a4a"); }
    else if (kind === "ny-dusk") { sky.addColorStop(0, "#3a4a7a"); sky.addColorStop(0.7, "#d98a70"); sky.addColorStop(1, "#ffcf8a"); }
    else if (kind === "ny-day") { sky.addColorStop(0, "#7fb0ec"); sky.addColorStop(1, "#dbe9f6"); }
    else if (kind === "clouds") { sky.addColorStop(0, "#0b1a38"); sky.addColorStop(1, "#4d6a9a"); }
    else { sky.addColorStop(0, "#222"); sky.addColorStop(1, "#222"); }
    g.fillStyle = sky;
    g.fillRect(0, 0, 512, 512);
    if (kind === "brick") {
      for (let y = 0; y < 16; y++)
        for (let x = 0; x < 9; x++) {
          const k = rnd(x * 7 + y * 13);
          g.fillStyle = `rgb(${96 + k * 40},${52 + k * 20},${42 + k * 16})`;
          g.fillRect(x * 60 + (y % 2) * 30 - 30 + 2, y * 32 + 2, 56, 28);
        }
    }
    if (kind === "clouds") {
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(200,215,240,${0.05 + rnd(i) * 0.1})`; g.beginPath(); g.ellipse(rnd(i * 3) * 512, 300 + rnd(i * 5) * 200, 60 + rnd(i) * 120, 14 + rnd(i * 2) * 20, 0, 0, 7); g.fill(); }
      for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,255,255,${rnd(i * 9)})`; g.fillRect(rnd(i * 11) * 512, rnd(i * 13) * 240, 2, 2); }
    }
    if (kind.startsWith("moscow") || kind.startsWith("ny")) {
      const night = kind.endsWith("night");
      for (let b = 0; b < 9; b++) {
        const x = b * 60 - 10, h = 160 + rnd(b * 3) * 220, w = kind.startsWith("moscow") ? 56 : 44 + rnd(b) * 20;
        g.fillStyle = night ? "#10141f" : kind === "moscow-dawn" ? "#6a6070" : "#3c3a4a";
        g.fillRect(x, 512 - h, w, h);
        for (let r = 0; r < h / 16; r++) for (let k = 0; k < w / 12; k++) {
          const lit = rnd(b * 91 + r * 7 + k) > (night ? 0.55 : 0.8);
          g.fillStyle = lit ? "#ffcf80" : night ? "#1a2233" : "#8b94b0";
          g.fillRect(x + 4 + k * 12, 512 - h + 6 + r * 16, 7, 9);
        }
      }
    }
    return mkTex(c, 1, 1);
  });

/** стена с проёмами */
const Wall: React.FC<{ wall: Opening["wall"]; w: number; d: number; h: number; mat: React.ReactNode; op?: Opening; t?: number }> = ({ wall, w, d, h, mat, op, t = 0.2 }) => {
  const horiz = wall === "back" || wall === "front";
  const len = horiz ? w : d;
  const pos = (a: number, y: number): V => {
    switch (wall) {
      case "back": return [a, y, -d / 2 - t / 2];
      case "front": return [a, y, d / 2 + t / 2];
      case "left": return [-w / 2 - t / 2, y, a];
      default: return [w / 2 + t / 2, y, a];
    }
  };
  const size = (l: number, hh: number): V => (horiz ? [l, hh, t] : [t, hh, l]);
  const seg = (a0: number, a1: number, y0: number, y1: number, k: string) => (a1 - a0 > 0.001 && y1 - y0 > 0.001 ? (
    <mesh key={k} position={pos((a0 + a1) / 2, (y0 + y1) / 2)} castShadow receiveShadow>
      <boxGeometry args={size(a1 - a0, y1 - y0)} />
      {mat}
    </mesh>
  ) : null);
  if (!op) return <>{seg(-len / 2, len / 2, 0, h, "f")}</>;
  const a0 = op.c - op.wd / 2, a1 = op.c + op.wd / 2, y0 = op.y0, y1 = op.y0 + op.ht;
  return (
    <>
      {seg(-len / 2, a0, 0, h, "l")}
      {seg(a1, len / 2, 0, h, "r")}
      {seg(a0, a1, 0, y0, "b")}
      {seg(a0, a1, y1, h, "t")}
    </>
  );
};

/** комната: размеры, материалы и проёмы */
export const Room: React.FC<{ w: number; d: number; h: number; wall?: string; wallMap?: THREE.Texture; floor?: THREE.Texture; floorColor?: string; ceil?: string; openings?: Opening[]; ambient?: number; ambientColor?: string; noCeil?: boolean }> = ({ w, d, h, wall = "#bfae92", wallMap, floor, floorColor = "#ffffff", ceil = "#d9d4c8", openings = [], ambient = 0.35, ambientColor = "#8a7f72", noCeil }) => {
  const mat = <meshStandardMaterial color={wall} map={wallMap} roughness={0.95} />;
  return (
    <group>
      <ambientLight intensity={ambient} color={ambientColor} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w + 0.4, d + 0.4]} />
        <meshStandardMaterial color={floorColor} map={floor} roughness={0.7} />
      </mesh>
      {!noCeil && (
        <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w + 0.4, d + 0.4]} />
          <meshStandardMaterial color={ceil} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      )}
      {(["back", "front", "left", "right"] as const).map((k) => (
        <Wall key={k} wall={k} w={w} d={d} h={h} mat={mat} op={openings.find((o) => o.wall === k)} />
      ))}
      {openings.map((o, i) => {
        const horiz = o.wall === "back" || o.wall === "front";
        const sgn = o.wall === "back" || o.wall === "left" ? -1 : 1;
        const off = (horiz ? d : w) / 2;
        const outer = off + 0.12;
        const p: V = horiz ? [o.c, o.y0 + o.ht / 2, sgn * outer] : [sgn * outer, o.y0 + o.ht / 2, o.c];
        const rot: V = [0, horiz ? (sgn < 0 ? 0 : Math.PI) : sgn < 0 ? Math.PI / 2 : -Math.PI / 2, 0];
        if (o.kind === "window") {
          const vp: V = horiz ? [o.c, o.y0 + o.ht / 2 + 4, sgn * (off + 26)] : [sgn * (off + 26), o.y0 + o.ht / 2 + 4, o.c];
          return (
            <group key={i}>
              <mesh position={vp} rotation={rot}>
                <planeGeometry args={[72, 54]} />
                <meshBasicMaterial map={o.view} toneMapped={false} fog={false} />
              </mesh>
              {o.glow && <pointLight position={horiz ? [o.c, o.y0 + o.ht / 2, sgn * (off - 0.4)] : [sgn * (off - 0.4), o.y0 + o.ht / 2, o.c]} color={o.glow} intensity={7} distance={7} decay={1.6} />}
              {/* рама и импост */}
              <mesh position={p} rotation={rot}>
                <boxGeometry args={[0.05, o.ht, 0.05]} />
                <M c="#e8e4da" />
              </mesh>
              <mesh position={p} rotation={rot}>
                <boxGeometry args={[o.wd, 0.05, 0.05]} />
                <M c="#e8e4da" />
              </mesh>
            </group>
          );
        }
        return (
          <group key={i} position={p} rotation={rot}>
            <group position={[-o.wd / 2, -o.ht / 2, 0]} rotation={[0, -(o.open ?? 0) * 1.6, 0]}>
              <mesh position={[o.wd / 2, o.ht / 2, 0]} castShadow>
                <boxGeometry args={[o.wd - 0.04, o.ht - 0.02, 0.05]} />
                <M c="#6e5a46" r={0.7} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};

/* ───── аэропорт ───── */
export const Terminal: React.FC<{ variant?: "svo" | "jfk"; night?: boolean }> = ({ variant = "svo", night }) => {
  const floor = useMemo(() => { const t = concreteTex("#b9bbb8").clone(); t.repeat.set(8, 14); t.needsUpdate = true; return t; }, []);
  const out = outsideTex(night ? "ny-night" : variant === "jfk" ? "ny-dusk" : "moscow-dawn");
  const sign = variant === "svo" ? "ВЫЛЕТ · DEPARTURES" : "ARRIVALS · U.S. CUSTOMS";
  return (
    <group>
      <ambientLight intensity={1.8} color="#e4e6ee" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -20]}>
        <planeGeometry args={[40, 80]} />
        <meshStandardMaterial map={floor} color="#e3e5e8" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 9, -20]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 80]} />
        <meshStandardMaterial color="#e9ecef" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* стеклянная стена с видом */}
      <mesh position={[-19, 4.5, -20]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[80, 20]} />
        <meshBasicMaterial map={out} toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[19, 4.5, -20]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[80, 18]} />
        <meshStandardMaterial color="#d7dbe0" roughness={0.9} />
      </mesh>
      {/* колонны и световые линии */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} position={[0, 0, -i * 10 + 10]}>
          <Box p={[-8, 4.5, 0]} s={[0.8, 9, 0.8]} c="#d4d8dc" r={0.5} />
          <Box p={[8, 4.5, 0]} s={[0.8, 9, 0.8]} c="#d4d8dc" r={0.5} />
          <mesh position={[0, 8.85, 0]}>
            <boxGeometry args={[14, 0.1, 0.6]} />
            <meshBasicMaterial color="#fffbea" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* табло */}
      {[0, -30].map((z, i) => (
        <mesh key={i} position={[0, 6.2, z - 4]}>
          <planeGeometry args={[7, 1.5]} />
          <meshBasicMaterial map={signTex(sign, "#0e2a52", "#ffffff", "800 96px Inter, sans-serif", 1024, 220)} toneMapped={false} />
        </mesh>
      ))}
      {/* стойки */}
      {Array.from({ length: 6 }, (_, i) => <Box key={i} p={[12, 0.55, -4 - i * 5]} s={[1, 1.1, 3]} c="#e8eaee" r={0.5} />)}
      {variant === "jfk" && (
        <>
          {[-1.2, 1.2].map((x, i) => <mesh key={i} position={[x * 4 - 2, 6, -18]}><planeGeometry args={[2.4, 1.4]} /><meshStandardMaterial color={["#b22234", "#fff"][i]} side={THREE.DoubleSide} /></mesh>)}
        </>
      )}
    </group>
  );
};

/* ───── салон самолёта ───── */
export const Cabin: React.FC<{ rows?: number; t?: number }> = ({ rows = 12, t = 0 }) => {
  const out = outsideTex("clouds");
  const glow = useMemo(() => { const x = out.clone(); x.needsUpdate = true; return x; }, [out]);
  glow.offset.x = (t * 0.01) % 1;
  return (
    <group>
      <ambientLight intensity={0.5} color="#7f93bc" />
      {[0, -4, -8].map((z) => <pointLight key={z} position={[0, 2.0, z]} color="#cfe0ff" intensity={4} distance={7} decay={1.5} />)}
      <pointLight position={[-1.3, 1.5, -2.6]} color="#ffe2b0" intensity={2.4} distance={3} decay={1.6} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -rows * 0.45]}>
        <planeGeometry args={[3.6, rows * 1.2]} />
        <meshStandardMaterial color="#3a4352" roughness={1} />
      </mesh>
      <mesh position={[0, 2.2, -rows * 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, rows * 1.2]} />
        <meshStandardMaterial color="#c9ccd2" side={THREE.DoubleSide} roughness={1} />
      </mesh>
      {[-1.8, 1.8].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.1, -rows * 0.45]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]} castShadow receiveShadow>
            <planeGeometry args={[rows * 1.2, 2.2]} />
            <meshStandardMaterial color="#d8dae0" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          {Array.from({ length: rows }, (_, i) => (
            <mesh key={i} position={[x * 0.99, 1.15, -i * 0.9 + 1]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
              <planeGeometry args={[0.34, 0.46]} />
              <meshBasicMaterial map={glow} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <group key={i} position={[0, 0, -i * 0.9]}>
          {[-1.35, -0.8, -0.25, 0.25, 0.8, 1.35].filter((x) => !(i === 3 && x > -1.0 && x < 0.1)).map((x) => (
            <group key={x}>
              <mesh position={[x, 0.3, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.5, 0.14, 0.52]} />
                <M c="#27415e" r={0.9} />
              </mesh>
              <mesh position={[x, 0.66, 0.2]} castShadow>
                <boxGeometry args={[0.5, 0.72, 0.14]} />
                <M c="#27415e" r={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

/* ───── кафе ───── */
export const Cafe: React.FC<{ queue?: boolean }> = () => {
  const out = outsideTex("ny-day");
  const floor = useMemo(() => { const t = concreteTex("#5a4a3c").clone(); t.repeat.set(3, 3); t.needsUpdate = true; return t; }, []);
  return (
    <group>
      <Room w={8} d={9} h={3.2} wall="#e3d7c3" floor={floor} floorColor="#9a8a78" ceil="#e8e2d6" ambient={0.9} ambientColor="#d8c9b0"
        openings={[{ wall: "front", c: 0, y0: 0.2, wd: 5, ht: 2.4, kind: "window", view: out, glow: "#ffe9c0" }]} />
      {/* стойка */}
      <Box p={[0, 0.55, -3.2]} s={[6, 1.1, 0.9]} c="#4a3626" r={0.7} />
      <Box p={[0, 1.12, -3.2]} s={[6.1, 0.06, 1]} c="#d9d2c4" r={0.4} />
      {/* кофемашина и меню */}
      <Box p={[-1.5, 1.45, -3.3]} s={[1.1, 0.6, 0.6]} c="#b9bcc2" m={0.8} r={0.3} />
      <Box p={[1.2, 1.35, -3.3]} s={[0.7, 0.4, 0.5]} c="#222" r={0.4} />
      <mesh position={[0, 2.3, -4.45]}>
        <planeGeometry args={[5.2, 1.3]} />
        <meshBasicMaterial map={signTex("COFFEE · LATTE · OAT · MATCHA", "#1b1c1f", "#f5ecd8", "700 64px Inter, sans-serif", 1536, 384, "ICED +$1   ·   OAT +$0.75   ·   SYRUP +$0.50")} toneMapped={false} />
      </mesh>
      {[-3.2, 0, 3.2].map((x, i) => (
        <group key={i} position={[x, 2.4, -1]}>
          <mesh>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshBasicMaterial color="#ffd89a" toneMapped={false} />
          </mesh>
          <pointLight color="#ffc77a" intensity={6} distance={7} decay={1.6} />
        </group>
      ))}
      {[[-2.6, 1.8], [2.6, 2.4], [-2.8, 3.2]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Box p={[0, 0.72, 0]} s={[0.8, 0.05, 0.8]} c="#7a5a3a" />
          <Box p={[0, 0.36, 0]} s={[0.06, 0.72, 0.06]} c="#222" />
        </group>
      ))}
    </group>
  );
};

/* ───── метро ───── */
export const Subway: React.FC<{ trainX?: number; empty?: boolean }> = ({ trainX = 60, empty }) => {
  const wall = tileTex();
  const floor = useMemo(() => { const t = concreteTex("#7c7b76").clone(); t.repeat.set(10, 3); t.needsUpdate = true; return t; }, []);
  return (
    <group>
      <ambientLight intensity={0.85} color="#cfe0d8" />
      {/* платформа */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial map={floor} color="#8a8984" roughness={0.6} />
      </mesh>
      <Box p={[0, 0.01, 3.1]} s={[80, 0.02, 0.3]} c="#e8c21e" r={0.8} shadow={false} />
      {/* путь */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 7]} receiveShadow>
        <planeGeometry args={[80, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={1} />
      </mesh>
      {[-0.7, 0.7].map((z) => <Box key={z} p={[0, -1.1, 7 + z]} s={[80, 0.08, 0.1]} c="#555" m={0.6} shadow={false} />)}
      {/* стены и потолок */}
      <mesh position={[0, 2.2, -3]} receiveShadow>
        <planeGeometry args={[80, 4.4]} />
        <meshStandardMaterial map={wall} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.2, 12]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[80, 4.4]} />
        <meshStandardMaterial map={wall} roughness={0.5} />
      </mesh>
      <mesh position={[0, 4.4, 4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 16]} />
        <meshStandardMaterial color="#cfd2cc" side={THREE.DoubleSide} />
      </mesh>
      {/* колонны со светильниками */}
      {Array.from({ length: 9 }, (_, i) => (
        <group key={i} position={[-32 + i * 8, 0, 1.2]}>
          <Box p={[0, 2.2, 0]} s={[0.5, 4.4, 0.5]} c="#a9b5ae" r={0.5} />
          <mesh position={[0, 4.3, 0.5]}>
            <boxGeometry args={[1.6, 0.08, 0.3]} />
            <meshBasicMaterial color="#f3fff5" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-16 + i * 8, 4.35, 0]}>
          <pointLight color="#d8f4e2" intensity={14} distance={13} decay={1.5} />
        </mesh>
      ))}
      <mesh position={[0, 2.6, -2.9]}>
        <planeGeometry args={[3.4, 0.8]} />
        <meshBasicMaterial map={signTex("4 · ATLANTIC AV – BARCLAYS CTR", "#0f5b32", "#fff", "800 64px Inter, sans-serif", 1536, 256)} toneMapped={false} />
      </mesh>
      <Box p={[3, 0.45, -2.4]} s={[2.2, 0.08, 0.55]} c="#6a4a2a" />
      {!empty && <SubwayTrain x={trainX} />}
    </group>
  );
};

export const SubwayTrain: React.FC<{ x: number }> = ({ x }) => (
  <group position={[x, -1, 6.5]}>
    {Array.from({ length: 4 }, (_, i) => (
      <group key={i} position={[i * 18, 0, 0]}>
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[17.4, 3.1, 3]} />
          <meshStandardMaterial color="#b9bdc4" metalness={0.6} roughness={0.35} />
        </mesh>
        {Array.from({ length: 4 }, (_, k) => (
          <mesh key={k} position={[-6.3 + k * 4.2, 2.5, -1.52]}>
            <planeGeometry args={[1.6, 1.2]} />
            <meshBasicMaterial color="#f7f1d6" toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, 1.4, -1.52]}>
          <planeGeometry args={[17.4, 0.12]} />
          <meshBasicMaterial color="#2a8a4a" toneMapped={false} />
        </mesh>
      </group>
    ))}
  </group>
);

export { brickTexNY };
