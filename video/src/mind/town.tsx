import React, { useMemo } from "react";
import * as THREE from "three";
import { rnd } from "../after/util";
import { skyTex, type Mood } from "../after/world";
import { Room, outsideTex } from "../ny/rooms";
import { Box, M } from "../ny/props";
import { signTex, wallpaperTex, parquetTex, concreteTex, once, cv, mkTex } from "../ny/tex";

type V = [number, number, number];

export const mood = (o: Partial<Mood> & Pick<Mood, "sky">): Mood => ({ fog: "#3a3560", fogNear: 40, fogFar: 200, sun: "#c8b8ff", sunI: 1.2, sunPos: [-20, 30, 25], hemiSky: "#8a82c8", hemiGround: "#3a3048", hemiI: 1.3, exposure: 1.3, ...o });
export const DUSK = mood({ sky: ["#1d2150", "#5a3f86", "#e58a7a"] });
export const SUNSET = mood({ sky: ["#3a3a7a", "#c4607a", "#ffb878"], sun: "#ffc890", sunI: 1.8, sunPos: [30, 12, 10], hemiSky: "#c8a0c0", hemiGround: "#5a4040", fog: "#c88a90", fogNear: 50, fogFar: 260 });
export const INDOOR = mood({ sky: ["#1d2150", "#5a3f86", "#e58a7a"], sunI: 0.5, hemiI: 1.0, exposure: 1.45 });

const winTex = (seed: number, base: string, lit: number) =>
  once(`win|${seed}|${base}|${lit}`, () => {
    const c = cv(256, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = base; g.fillRect(0, 0, 256, 512);
    for (let r = 0; r < 8; r++) for (let k = 0; k < 4; k++) {
      const on = rnd(seed * 31 + r * 7 + k * 13) < lit;
      g.fillStyle = on ? "#ffd68a" : "#26284c";
      g.fillRect(14 + k * 60, 20 + r * 60, 38, 40);
      g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(14 + k * 60, 20 + r * 60 + 19, 38, 2); g.fillRect(14 + k * 60 + 18, 20 + r * 60, 2, 40);
    }
    return mkTex(c);
  });

const Shop: React.FC<{ x: number; w: number; text: string; awning: string; z?: number }> = ({ x, w, text, awning, z = -5.9 }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 1.4, 0.05]}><boxGeometry args={[w - 0.4, 2.0, 0.1]} /><meshStandardMaterial color="#ffcf80" emissive="#ffb050" emissiveIntensity={0.9} roughness={0.6} /></mesh>
    <mesh position={[0, 2.55, 0.35]} rotation={[0.35, 0, 0]}><boxGeometry args={[w, 0.08, 0.9]} /><meshStandardMaterial color={awning} roughness={0.8} /></mesh>
    {Array.from({ length: Math.floor(w / 0.5) }, (_, i) => (
      i % 2 === 0 ? <mesh key={i} position={[-w / 2 + 0.25 + i * 0.5, 2.56, 0.36]} rotation={[0.35, 0, 0]}><boxGeometry args={[0.5, 0.09, 0.9]} /><meshStandardMaterial color="#fff4e4" roughness={0.8} /></mesh> : null
    ))}
    <mesh position={[0, 3.15, 0.1]}><planeGeometry args={[Math.min(w - 0.5, 3.4), 0.7]} /><meshBasicMaterial map={signTex(text, "#2a2350", "#ffe6b0", "800 150px Inter, sans-serif", 1024, 256)} toneMapped={false} /></mesh>
  </group>
);

export const Tree: React.FC<{ p: V; s?: number; c?: string }> = ({ p, s = 1, c = "#3f7a62" }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.12, 0.17, 1.6, 8]} /><M c="#5a4040" /></mesh>
    <mesh position={[0, 2.3, 0]} castShadow><icosahedronGeometry args={[1.1, 1]} /><M c={c} r={0.9} /></mesh>
    <mesh position={[0.5, 1.9, 0.3]} castShadow><icosahedronGeometry args={[0.7, 1]} /><M c={c} r={0.9} /></mesh>
  </group>
);

export const Lamp: React.FC<{ p: V; light?: number }> = ({ p, light = 1 }) => (
  <group position={p}>
    <mesh position={[0, 1.9, 0]}><cylinderGeometry args={[0.05, 0.07, 3.8, 8]} /><M c="#26264a" /></mesh>
    <mesh position={[0.35, 3.75, 0]}><boxGeometry args={[0.8, 0.07, 0.07]} /><M c="#26264a" /></mesh>
    <mesh position={[0.7, 3.65, 0]}><sphereGeometry args={[0.16, 12, 10]} /><meshBasicMaterial color="#ffe2a0" toneMapped={false} /></mesh>
    {light > 0 && <pointLight position={[0.7, 3.5, 0]} color="#ffcf90" intensity={9 * light} distance={9} decay={1.6} />}
  </group>
);

export const Bench: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.45, 0]} s={[1.6, 0.08, 0.5]} c="#8a5a3c" />
    <Box p={[0, 0.85, -0.22]} s={[1.6, 0.4, 0.06]} c="#8a5a3c" />
    {[-0.7, 0.7].map((x) => <Box key={x} p={[x, 0.22, 0]} s={[0.07, 0.44, 0.45]} c="#2a2a44" />)}
  </group>
);

const HOUSES: { x: number; w: number; h: number; c: string }[] = [
  { x: -22, w: 7, h: 9, c: "#5a4a8a" }, { x: -15, w: 7, h: 12, c: "#7a5070" }, { x: -8.5, w: 6, h: 8, c: "#4a5a92" },
  { x: -2.4, w: 6.4, h: 11, c: "#8a5e60" }, { x: 4, w: 6.5, h: 9, c: "#54489a" }, { x: 10.6, w: 6.6, h: 13, c: "#6a5a86" },
  { x: 17.4, w: 7, h: 8, c: "#7a4a6a" }, { x: 24.4, w: 7, h: 11, c: "#4a5890" },
];
const SHOPS: [number, number, string, string][] = [[-15, 5.6, "ПЕКАРНЯ", "#d8584a"], [-2.4, 5.4, "КОФЕ", "#3a8a6a"], [10.6, 5.6, "АПТЕКА", "#3a7ab8"], [24.4, 5.6, "ПРОДУКТЫ", "#c8943a"]];

/** городок: небо, дома с окнами, вывески, тротуар, деревья, фонари */
export const Town: React.FC<{ mood: Mood; lamps?: number }> = ({ mood: m, lamps = 1 }) => {
  const sky = useMemo(() => skyTex(m), [m]);
  const road = useMemo(() => { const t = concreteTex("#4a4568").clone(); t.repeat.set(24, 3); t.needsUpdate = true; return t; }, []);
  return (
    <group>
      <color attach="background" args={[m.sky[1]]} />
      <fog attach="fog" args={[m.fog, m.fogNear, m.fogFar]} />
      <mesh><sphereGeometry args={[600, 20, 14]} /><meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 4]} receiveShadow><planeGeometry args={[200, 40]} /><meshStandardMaterial map={road} color="#5a5478" roughness={0.95} /></mesh>
      <mesh position={[0, 0.06, -3.2]} receiveShadow><boxGeometry args={[200, 0.12, 5]} /><meshStandardMaterial color="#8a84a8" roughness={0.9} /></mesh>
      {HOUSES.map((h, i) => (
        <mesh key={i} position={[h.x, h.h / 2, -7.2]} castShadow>
          <boxGeometry args={[h.w, h.h, 2.6]} />
          <meshStandardMaterial color={h.c} map={winTex(i + 3, "#ffffff", 0.55)} roughness={0.9} />
        </mesh>
      ))}
      {SHOPS.map(([x, w, text, c]) => <Shop key={text} x={x} w={w} text={text} awning={c} />)}
      {[-26, -10, 6, 20].map((x, i) => <Tree key={x} p={[x, 0, -4.2]} s={0.9 + (i % 2) * 0.2} c={i % 2 ? "#3f7a62" : "#4a8a5a"} />)}
      {[-18, -6, 8, 22].map((x) => <Lamp key={x} p={[x, 0, -1.2]} light={lamps} />)}
      <mesh position={[-5, 0.55, 3.6]} castShadow><boxGeometry args={[3.6, 0.7, 1.6]} /><M c="#f0c040" r={0.5} /></mesh>
      <mesh position={[-5, 1.1, 3.6]} castShadow><boxGeometry args={[2.0, 0.5, 1.4]} /><M c="#f4ce5a" r={0.5} /></mesh>
    </group>
  );
};

/** парк: скамейка, деревья, закат */
export const Park: React.FC<{ mood: Mood }> = ({ mood: m }) => {
  const sky = useMemo(() => skyTex(m), [m]);
  return (
    <group>
      <color attach="background" args={[m.sky[1]]} />
      <fog attach="fog" args={[m.fog, m.fogNear, m.fogFar]} />
      <mesh><sphereGeometry args={[600, 20, 14]} /><meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[300, 300]} /><meshStandardMaterial color="#3e6a58" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]}><planeGeometry args={[300, 4]} /><meshStandardMaterial color="#a8a0b8" roughness={1} /></mesh>
      {[-14, -9, -4, 6, 11, 16].map((x, i) => <Tree key={x} p={[x, 0, -6 - (i % 3) * 2]} s={1.1 + (i % 2) * 0.3} c={i % 2 ? "#4a8a5a" : "#3f7a62"} />)}
      {[-18, 14].map((x) => <Lamp key={x} p={[x, 0, -2]} />)}
      <Bench p={[0, 0, -1.2]} />
      <mesh position={[70, 24, -250]}><sphereGeometry args={[26, 24, 18]} /><meshBasicMaterial color="#ffe2a8" fog={false} toneMapped={false} /></mesh>
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[i * 70, -6, -220 - (i % 2) * 20]} scale={[44, 20 + (i % 3) * 8, 16]}><sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color={i % 2 ? "#4a3a78" : "#5a4684"} fog={false} /></mesh>)}
      {Array.from({ length: 26 }, (_, i) => (
        <mesh key={i} position={[-26 + i * 2 + rnd(i) * 1.2, 40 + rnd(i + 9) * 40, -140]}><boxGeometry args={[1.4, 1.4, 1.4]} /><meshBasicMaterial color="#ffd8a0" /></mesh>
      )).slice(0, 0)}
    </group>
  );
};

/** спальня героя */
export const Bedroom: React.FC<{ lamp?: number }> = ({ lamp = 1 }) => (
  <group>
    <Room w={5} d={4.4} h={2.8} wall="#8a7ab8" wallMap={wallpaperTex("#8a7ab8", "#9486c4")} floor={parquetTex("#7a5a52")} floorColor="#d8b8a8" ceil="#c8c0e0" ambient={0.75} ambientColor="#b8a8e8"
      openings={[{ wall: "back", c: 0.8, y0: 0.9, wd: 1.7, ht: 1.5, kind: "window", view: outsideTex("moscow-dawn"), glow: "#ffd8a8" }]} />
    <pointLight position={[0, 2.4, 0]} color="#ffe0b0" intensity={10 * lamp} distance={10} decay={1.5} />
    {/* кровать */}
    <Box p={[-1.35, 0.25, -0.2]} s={[1.6, 0.5, 2.2]} c="#5a4a86" r={0.9} />
    <Box p={[-1.35, 0.55, -0.35]} s={[1.5, 0.14, 1.9]} c="#e8e0f4" r={1} />
    <Box p={[-1.35, 0.68, -1.05]} s={[0.9, 0.16, 0.4]} c="#ffffff" r={1} />
    <Box p={[-1.35, 0.55, 0.3]} s={[1.55, 0.2, 0.9]} c="#e87a4a" r={1} />
    <Box p={[-1.35, 0.8, -1.32]} s={[1.7, 0.7, 0.08]} c="#4a3a76" />
    {/* тумба и лампа */}
    <Box p={[-2.35, 0.25, -1.1]} s={[0.5, 0.5, 0.5]} c="#6a4a5a" />
    <mesh position={[-2.35, 0.66, -1.1]}><cylinderGeometry args={[0.12, 0.17, 0.3, 12]} /><meshStandardMaterial color="#ffd68a" emissive="#ffb050" emissiveIntensity={0.9 * lamp} /></mesh>
    {/* ковёр, растение, часы */}
    <mesh position={[0.3, 0.012, -0.9]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.8, 28]} /><meshStandardMaterial color="#e87a4a" roughness={1} /></mesh>
    <mesh position={[2.1, 0.4, -1.6]}><cylinderGeometry args={[0.2, 0.15, 0.4, 12]} /><M c="#c86a4a" /></mesh>
    <mesh position={[2.1, 0.9, -1.6]}><icosahedronGeometry args={[0.38, 1]} /><M c="#3f8a5a" r={1} /></mesh>
    <mesh position={[-1.35, 1.9, -2.15]}><circleGeometry args={[0.22, 20]} /><meshBasicMaterial color="#f4ecd8" /></mesh>
    <Box p={[2.45, 1.5, 0.3]} s={[0.04, 0.8, 0.6]} c="#3a8ab8" />
  </group>
);

/** кухня мамы */
export const Kitchen: React.FC = () => (
  <group>
    <Room w={5} d={4.4} h={2.8} wall="#e6c8a0" wallMap={wallpaperTex("#e6c8a0", "#eed4ae")} floor={parquetTex("#8a6a4a")} floorColor="#e8d0b0" ceil="#f4ead8" ambient={0.85} ambientColor="#ffe2c0"
      openings={[{ wall: "back", c: -0.6, y0: 0.95, wd: 1.6, ht: 1.4, kind: "window", view: outsideTex("moscow-dawn"), glow: "#ffd8a8" }]} />
    <pointLight position={[0, 2.4, 0.2]} color="#ffdca8" intensity={14} distance={10} decay={1.5} />
    <Box p={[2.0, 1.0, -1.7]} s={[0.8, 2.0, 0.7]} c="#f4f0f6" r={0.4} m={0.2} />
    <Box p={[-1.9, 0.45, -1.9]} s={[2.0, 0.9, 0.6]} c="#c8584a" />
    <Box p={[-1.9, 0.92, -1.9]} s={[2.04, 0.05, 0.64]} c="#f4ecdc" />
    <Box p={[-1.9, 1.9, -2.05]} s={[2.0, 0.7, 0.35]} c="#c8584a" />
    <Box p={[0.4, 0.7, 0.4]} s={[1.4, 0.06, 0.9]} c="#a8703c" />
    {[[-0.2, 0.0], [1.0, 0.0], [-0.2, 0.8], [1.0, 0.8]].map(([x, z], i) => <Box key={i} p={[x, 0.35, z]} s={[0.06, 0.7, 0.06]} c="#7a4a2a" shadow={false} />)}
    <mesh position={[0.1, 0.78, 0.4]}><cylinderGeometry args={[0.055, 0.045, 0.1, 12]} /><M c="#ffffff" /></mesh>
    <mesh position={[0.8, 0.84, 0.3]}><sphereGeometry args={[0.12, 12, 10]} /><M c="#d8584a" /></mesh>
  </group>
);
