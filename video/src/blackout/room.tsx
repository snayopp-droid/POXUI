import React, { useMemo } from "react";
import * as THREE from "three";
import { Room } from "../ny/rooms";
import { M, Box, Phone } from "../ny/props";
import { concreteTex, wallpaperTex, parquetTex, signTex } from "../ny/tex";
import { neighborTex } from "./tex";

type V = [number, number, number];

/* ───── реквизит (origin — центр основания) ───── */
export const Flashlight: React.FC<{ p: V; rx?: number; ry?: number; rz?: number; on?: number; light?: number }> = ({ p, rx = 0, ry = 0, rz = 0, on = 0, light = 0 }) => (
  <group position={p} rotation={[rx, ry, rz]}>
    <mesh position={[0, 0.085, 0]} castShadow>
      <cylinderGeometry args={[0.021, 0.024, 0.17, 12]} />
      <M c="#2b2f36" r={0.4} m={0.5} />
    </mesh>
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.0225, 0.0225, 0.025, 12]} />
      <M c="#e8a21a" r={0.5} />
    </mesh>
    <mesh position={[0, 0.19, 0]} castShadow>
      <cylinderGeometry args={[0.036, 0.022, 0.05, 14]} />
      <M c="#2b2f36" r={0.35} m={0.6} />
    </mesh>
    <mesh position={[0, 0.2155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.032, 14]} />
      <meshBasicMaterial color={on > 0 ? "#ffffff" : "#8a929c"} toneMapped={false} />
    </mesh>
    {light > 0 && <pointLight position={[0, 0.3, 0]} color="#f2f6ff" intensity={light} distance={6} decay={1.6} />}
  </group>
);

export const Bottle: React.FC<{ p: V }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.095, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.036, 0.19, 16]} />
      <meshStandardMaterial color="#8fc8f0" transparent opacity={0.72} roughness={0.15} metalness={0.1} />
    </mesh>
    <mesh position={[0, 0.07, 0]}>
      <cylinderGeometry args={[0.031, 0.031, 0.1, 14]} />
      <meshStandardMaterial color="#4a9ed8" transparent opacity={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.2, 0]} castShadow>
      <cylinderGeometry args={[0.014, 0.02, 0.04, 12]} />
      <M c="#f2f4f6" />
    </mesh>
    <mesh position={[0, 0.224, 0]}>
      <cylinderGeometry args={[0.018, 0.018, 0.012, 12]} />
      <M c="#f2f4f6" />
    </mesh>
  </group>
);

export const Meds: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.02, 0]} castShadow>
      <boxGeometry args={[0.11, 0.04, 0.075]} />
      <M c="#f4f4f2" r={0.7} />
    </mesh>
    <mesh position={[0, 0.0405, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.1, 0.03]} />
      <meshBasicMaterial color="#2f9a8a" />
    </mesh>
    <mesh position={[0.02, 0.041, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.012, 12]} />
      <meshBasicMaterial color="#d8483a" />
    </mesh>
  </group>
);

export const Folder: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.008, 0]} castShadow>
      <boxGeometry args={[0.22, 0.016, 0.3]} />
      <M c="#c98d4a" r={0.8} />
    </mesh>
    <mesh position={[0.07, 0.0085, -0.16]}>
      <boxGeometry args={[0.07, 0.014, 0.025]} />
      <M c="#b87c3c" />
    </mesh>
    <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.16, 0.2]} />
      <meshStandardMaterial color="#eadbbf" roughness={0.9} />
    </mesh>
  </group>
);

export const Keys: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.022, 0.004, 8, 18]} />
      <M c="#c4c8cc" m={0.9} r={0.25} />
    </mesh>
    {[-0.5, 0.2, 0.9].map((a, i) => (
      <mesh key={i} position={[Math.sin(a) * 0.05, 0.004, 0.04 + Math.cos(a) * 0.03]} rotation={[0, a, 0]} castShadow>
        <boxGeometry args={[0.014, 0.004, 0.06]} />
        <M c={i === 1 ? "#d7b24a" : "#cfd3d8"} m={0.9} r={0.25} />
      </mesh>
    ))}
  </group>
);

export const PowerBank: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.0135, 0]} castShadow>
      <boxGeometry args={[0.15, 0.027, 0.07]} />
      <M c="#2a2e36" r={0.4} m={0.4} />
    </mesh>
    {[-0.04, -0.015, 0.01, 0.035].map((x) => (
      <mesh key={x} position={[x, 0.0275, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.004, 8]} />
        <meshBasicMaterial color="#5cf08a" toneMapped={false} />
      </mesh>
    ))}
  </group>
);

export const Radio: React.FC<{ p: V; ry?: number; on?: number }> = ({ p, ry = 0, on = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.07, 0]} castShadow>
      <boxGeometry args={[0.26, 0.14, 0.08]} />
      <M c="#3a3e44" r={0.55} />
    </mesh>
    <mesh position={[-0.05, 0.07, 0.0405]}>
      <planeGeometry args={[0.12, 0.1]} />
      <meshStandardMaterial color="#14161a" roughness={0.9} />
    </mesh>
    {[-0.03, 0, 0.03].map((y) => (
      <mesh key={y} position={[-0.05, 0.07 + y, 0.0412]}>
        <planeGeometry args={[0.1, 0.004]} />
        <meshBasicMaterial color="#4a4f58" />
      </mesh>
    ))}
    <mesh position={[0.075, 0.075, 0.0405]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.022, 0.022, 0.01, 14]} />
      <M c="#c9ccd2" m={0.6} r={0.4} />
    </mesh>
    <mesh position={[0.075, 0.115, 0.0412]}>
      <circleGeometry args={[0.006, 10]} />
      <meshBasicMaterial color={on > 0 ? "#6dff8e" : "#26402e"} toneMapped={false} />
    </mesh>
    <mesh position={[0.1, 0.22, -0.03]} rotation={[0, 0, -0.25]}>
      <cylinderGeometry args={[0.003, 0.003, 0.2, 6]} />
      <M c="#c9ccd2" m={0.8} r={0.3} />
    </mesh>
    {on > 0 && <pointLight position={[0.075, 0.14, 0.15]} color="#8dffa8" intensity={0.5} distance={1.2} decay={1.8} />}
  </group>
);

/** экран телефона без читаемого интерфейса: сетка условных иконок */
const iconTex = (kind: number) => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#101826";
  g.fillRect(0, 0, 128, 256);
  const cols = ["#4fc3f7", "#81c784", "#ffb74d", "#ba68c8", "#e57373", "#90a4ae", "#fff176", "#4db6ac"];
  for (let i = 0; i < 8; i++) {
    g.fillStyle = cols[i];
    const x = 14 + (i % 4) * 28, y = 40 + Math.floor(i / 4) * 34;
    g.beginPath();
    g.roundRect(x, y, 22, 22, 6);
    g.fill();
  }
  if (kind === 1) {
    g.fillStyle = "#1f2a40";
    g.fillRect(0, 128, 128, 128);
    g.fillStyle = "#4fc3f7";
    g.beginPath();
    g.roundRect(14, 150, 70, 26, 10);
    g.fill();
    g.fillStyle = "#81c784";
    g.beginPath();
    g.roundRect(44, 190, 70, 26, 10);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
const ICONS = [typeof document !== "undefined" ? undefined : undefined];
void ICONS;
let iconCache: THREE.Texture[] = [];
export const PhoneScreen: React.FC<{ p: V; rx?: number; ry?: number; rz?: number; glow?: number; kind?: number }> = ({ p, rx = 0, ry = 0, rz = 0, glow = 1, kind = 0 }) => {
  const tex = useMemo(() => (iconCache[kind] ??= iconTex(kind)), [kind]);
  return (
    <group position={p} rotation={[rx, ry, rz]}>
      <mesh castShadow>
        <boxGeometry args={[0.075, 0.155, 0.009]} />
        <M c="#15171b" m={0.6} r={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.0052]}>
        <planeGeometry args={[0.066, 0.142]} />
        <meshBasicMaterial map={tex} toneMapped={false} opacity={0.35 + 0.65 * glow} transparent />
      </mesh>
      <pointLight position={[0, 0.02, 0.1]} color="#a8d4ff" intensity={0.9 * glow} distance={2.4} decay={1.8} />
    </group>
  );
};
void Phone;

/* ───── мебель ───── */
const Table: React.FC = () => (
  <group>
    <Box p={[-1.15, 0.74, -2.15]} s={[2.3, 0.05, 0.8]} c="#7a5a3a" r={0.55} />
    {[[-2.2, -1.82], [-0.1, -1.82], [-2.2, -2.48], [-0.1, -2.48]].map(([x, z], i) => <Box key={i} p={[x, 0.36, z]} s={[0.06, 0.72, 0.06]} c="#3a2a1c" />)}
  </group>
);

const Chair: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box p={[0, 0.45, 0]} s={[0.46, 0.05, 0.46]} c="#6a4a2e" />
    <Box p={[0, 0.8, -0.21]} s={[0.46, 0.6, 0.05]} c="#6a4a2e" />
    {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => <Box key={i} p={[x, 0.22, z]} s={[0.04, 0.44, 0.04]} c="#2a1c10" />)}
  </group>
);

/** квартира героя. lamp — электрический свет (1 → 0 при блэкауте), doorOpen — угол двери 0..1 */
export const Apartment: React.FC<{ lamp?: number; doorOpen?: number; view?: number }> = ({ lamp = 1, doorOpen = 0, view = 0 }) => {
  const outside = neighborTex(view > 0 ? 0.35 : 0);
  const night = 1 - lamp;
  return (
    <group>
      <Room w={4.6} d={5.2} h={2.7} wall="#b9ad98" wallMap={wallpaperTex("#b9ad98", "#c3b8a3")} floor={parquetTex("#7a5a3a")} floorColor="#cdb28e" ceil="#dcd8cc"
        ambient={0.55 + 0.1 * lamp} ambientColor={lamp > 0.5 ? "#c9b598" : "#8fa5d0"}
        openings={[
          { wall: "back", c: 0.3, y0: 0.9, wd: 1.7, ht: 1.5, kind: "window", view: outside, glow: night > 0.5 ? "#6f86c4" : "#d8c9a8" },
          { wall: "right", c: 1.2, y0: 0, wd: 0.95, ht: 2.05, kind: "door", open: doorOpen },
        ]} />
      {/* свет: потолочный и настольный */}
      {lamp > 0.02 && (
        <>
          <mesh position={[0, 2.62, 0]}><sphereGeometry args={[0.14, 12, 12]} /><meshBasicMaterial color="#fff1d0" toneMapped={false} /></mesh>
          <pointLight position={[0, 2.4, 0.2]} color="#ffd9a0" intensity={22 * lamp} distance={9} decay={1.5} />
          <pointLight position={[-0.9, 1.3, -2.0]} color="#ffc78a" intensity={7 * lamp} distance={4} decay={1.6} />
        </>
      )}
      {night > 0.02 && <pointLight position={[0.3, 2.0, -3.0]} color="#7d92d0" intensity={14 * night} distance={9} decay={1.5} />}
      {/* дверь: глазок и ручка */}
      <group position={[2.3, 0, 1.2]}>
        <mesh position={[-0.02, 1.55, -0.5 * 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.012, 12]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>
      <Table />
      <Chair p={[1.45, 0, -0.95]} ry={-1.25} />
      {/* полка с книгами и растением над столом */}
      <Box p={[-1.15, 1.55, -2.5]} s={[1.6, 0.04, 0.24]} c="#5a4028" />
      {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[-1.8 + i * 0.075, 1.67, -2.5]} s={[0.055, 0.2 + (i % 3) * 0.03, 0.17]} c={["#a33", "#3a6a8a", "#c9a14a", "#5a7a4a", "#6a4a7a"][i % 5]} shadow={false} />)}
      <group position={[-0.65, 1.575, -2.5]}>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.07, 0.055, 0.14, 12]} /><M c="#b86a3a" /></mesh>
        <mesh position={[0, 0.22, 0]}><icosahedronGeometry args={[0.12, 1]} /><M c="#3a7a4a" r={1} /></mesh>
      </group>
      {/* диван, ковёр, шкаф */}
      <Box p={[-1.75, 0.3, 1.5]} s={[0.9, 0.6, 1.9]} c="#4a5a6e" r={0.9} />
      <Box p={[-2.0, 0.75, 1.5]} s={[0.3, 0.5, 1.9]} c="#43536a" r={0.9} />
      <mesh position={[-0.2, 0.012, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 1.8]} />
        <meshStandardMaterial color="#6a4a52" roughness={1} />
      </mesh>
      <Box p={[1.85, 1.1, -2.0]} s={[0.8, 2.2, 0.6]} c="#8a6a48" r={0.8} />
      <mesh position={[0.3, 2.0, -2.58]}>
        <boxGeometry args={[0, 0, 0]} />
      </mesh>
      {/* постер без текста */}
      <mesh position={[-2.28, 1.6, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshStandardMaterial map={signTex("", "#3c5a74", "#fff", "800 10px Inter", 128, 160)} roughness={0.9} />
      </mesh>
    </group>
  );
};

/** подъезд: коридор с лифтом (двери закрыты, индикатор не горит) */
export const Fridge: React.FC = () => (
  <group>
    <Box p={[-1.97, 0.9, -0.6]} s={[0.66, 1.8, 0.66]} c="#cfd4da" r={0.35} m={0.3} />
    <Box p={[-1.635, 0.85, -0.6]} s={[0.02, 0.02, 0.66]} c="#3a3e44" r={0.6} shadow={false} />
    <Box p={[-1.615, 1.3, -0.38]} s={[0.03, 0.45, 0.03]} c="#8a9098" r={0.25} m={0.8} shadow={false} />
    <Box p={[-1.615, 0.55, -0.38]} s={[0.03, 0.3, 0.03]} c="#8a9098" r={0.25} m={0.8} shadow={false} />
    <Box p={[-1.63, 1.55, -0.75]} s={[0.012, 0.07, 0.07]} c="#c45a3a" shadow={false} />
    <Box p={[-1.63, 1.45, -0.62]} s={[0.012, 0.06, 0.09]} c="#3a7aa8" shadow={false} />
  </group>
);

/** подъезд: коридор с лифтом; neighbor (0..1) — дверь соседей слева открывается внутрь квартиры */
export const Hallway: React.FC<{ neighbor?: number }> = ({ neighbor }) => {
  const floor = useMemo(() => { const t = concreteTex("#8a8a86").clone(); t.repeat.set(1, 4); t.needsUpdate = true; return t; }, []);
  return (
    <group>
      <ambientLight intensity={0.28} color="#7d8fb4" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.5]} receiveShadow>
        <planeGeometry args={[2.6, 9]} />
        <meshStandardMaterial map={floor} color="#a8a8a2" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.7, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 9]} />
        <meshStandardMaterial color="#cfcac0" side={THREE.DoubleSide} />
      </mesh>
      {([-1.3, 1.3] as const).filter((x) => neighbor === undefined || x > 0).map((x) => (
        <mesh key={x} position={[x, 1.35, -1.5]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[9, 2.7]} />
          <meshStandardMaterial color="#b4aea0" roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {neighbor === undefined ? (
        <Box p={[-1.27, 0.5, -1.5]} s={[0.06, 1.0, 9]} c="#6f7a72" r={0.8} shadow={false} />
      ) : (
        <>
          {[-3.9875, 0.9875].map((z) => (
            <React.Fragment key={z}>
              <mesh position={[-1.3, 1.35, z]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[4.025, 2.7]} /><meshStandardMaterial color="#b4aea0" roughness={0.95} side={THREE.DoubleSide} /></mesh>
              <Box p={[-1.27, 0.5, z]} s={[0.06, 1.0, 4.025]} c="#6f7a72" r={0.8} shadow={false} />
            </React.Fragment>
          ))}
          <mesh position={[-1.3, 2.38, -1.5]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.95, 0.64]} /><meshStandardMaterial color="#b4aea0" roughness={0.95} side={THREE.DoubleSide} /></mesh>
          {/* квартира соседей */}
          <mesh position={[-2.65, 0.002, -1.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.7, 4]} /><meshStandardMaterial color="#5a4632" roughness={0.8} /></mesh>
          <mesh position={[-2.65, 2.7, -1.5]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[2.7, 4]} /><meshStandardMaterial color="#cfc6b4" side={THREE.DoubleSide} /></mesh>
          <mesh position={[-3.9, 1.35, -1.5]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[4, 2.7]} /><meshStandardMaterial color="#8a7a62" roughness={0.95} side={THREE.DoubleSide} /></mesh>
          {[-3.5, 0.5].map((z) => <mesh key={z} position={[-2.65, 1.35, z]}><planeGeometry args={[2.7, 2.7]} /><meshStandardMaterial color="#7f705a" roughness={0.95} side={THREE.DoubleSide} /></mesh>)}
          <Box p={[-3.6, 0.45, -1.5]} s={[0.5, 0.9, 1.4]} c="#4a3a2c" r={0.8} />
          <Box p={[-3.6, 1.2, -1.5]} s={[0.12, 0.5, 0.6]} c="#c9a14a" r={0.7} shadow={false} />
          {neighbor > 0.02 && <pointLight position={[-2.4, 1.8, -1.6]} color="#ffb766" intensity={12 * neighbor} distance={7} decay={1.6} />}
          <group position={[-1.27, 0, -1.975]} rotation={[0, -neighbor * 1.2, 0]}>
            <Box p={[0, 1.03, 0.475]} s={[0.05, 2.06, 0.95]} c="#5a4a3c" r={0.7} />
          </group>
        </>
      )}
      {/* лифт */}
      <Box p={[0, 1.15, -5.95]} s={[2.0, 2.3, 0.1]} c="#2a2d33" r={0.5} m={0.5} />
      {[-0.45, 0.45].map((x) => <Box key={x} p={[x, 1.05, -5.88]} s={[0.84, 2.05, 0.04]} c="#9aa0a8" r={0.3} m={0.8} />)}
      <Box p={[0, 2.5, -5.88]} s={[0.7, 0.18, 0.05]} c="#0b0d10" r={0.2} />
      <Box p={[1.15, 1.15, -5.88]} s={[0.14, 0.34, 0.03]} c="#7d838c" m={0.7} r={0.35} />
      {[1.07, 1.23].map((y) => (
        <mesh key={y} position={[1.15, y, -5.86]}>
          <circleGeometry args={[0.025, 12]} />
          <meshStandardMaterial color="#2a2c30" roughness={0.4} />
        </mesh>
      ))}
      {/* дверь квартиры в коридоре */}
      <Box p={[1.27, 1.03, 1.2]} s={[0.05, 2.06, 0.95]} c="#6e5a46" r={0.7} />
      {neighbor === undefined && <Box p={[-1.27, 1.03, -1.5]} s={[0.05, 2.06, 0.95]} c="#5a4a3c" r={0.7} />}
    </group>
  );
};
