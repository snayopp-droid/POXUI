import React from "react";
import * as THREE from "three";

export const M: React.FC<{ c: string; r?: number; m?: number; e?: string; ei?: number; map?: THREE.Texture; side?: THREE.Side; t?: number }> = ({ c, r = 0.85, m = 0, e, ei = 0, map, side, t }) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} map={map} side={side} transparent={t !== undefined} opacity={t ?? 1} />
);

type V = [number, number, number];
export const Box: React.FC<{ p: V; s: V; c: string; r?: number; m?: number; ry?: number; shadow?: boolean; e?: string; ei?: number; map?: THREE.Texture }> = ({ p, s, c, r, m, ry = 0, shadow = true, e, ei, map }) => (
  <mesh position={p} rotation={[0, ry, 0]} castShadow={shadow} receiveShadow>
    <boxGeometry args={s} />
    <M c={c} r={r} m={m} e={e} ei={ei} map={map} />
  </mesh>
);

export const Suitcase: React.FC<{ p: V; ry?: number; c?: string; s?: number }> = ({ p, ry = 0, c = "#2e3b4e", s = 1 }) => (
  <group position={p} rotation={[0, ry, 0]} scale={s}>
    <mesh position={[0, 0.34, 0]} castShadow>
      <boxGeometry args={[0.46, 0.68, 0.28]} />
      <M c={c} r={0.45} m={0.1} />
    </mesh>
    <mesh position={[0, 0.7, -0.05]} castShadow>
      <boxGeometry args={[0.04, 0.5, 0.04]} />
      <M c="#bbb" m={0.8} r={0.3} />
    </mesh>
    <mesh position={[0, 0.96, -0.05]}>
      <boxGeometry args={[0.28, 0.04, 0.05]} />
      <M c="#222" />
    </mesh>
    {[-0.18, 0.18].map((x) => (
      <mesh key={x} position={[x, 0.04, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 10]} />
        <M c="#111" />
      </mesh>
    ))}
  </group>
);

export const Laptop: React.FC<{ p: V; ry?: number; glow?: number }> = ({ p, ry = 0, glow = 1 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.01, 0]}>
      <boxGeometry args={[0.34, 0.02, 0.23]} />
      <M c="#b8bcc4" m={0.7} r={0.35} />
    </mesh>
    <group position={[0, 0.02, -0.11]} rotation={[-0.25, 0, 0]}>
      <mesh position={[0, 0.115, 0]}>
        <boxGeometry args={[0.34, 0.23, 0.012]} />
        <M c="#b8bcc4" m={0.7} r={0.35} />
      </mesh>
      <mesh position={[0, 0.115, 0.008]}>
        <planeGeometry args={[0.31, 0.2]} />
        <meshBasicMaterial color="#cfe4ff" toneMapped={false} opacity={0.5 + 0.5 * glow} transparent />
      </mesh>
    </group>
    <pointLight position={[0, 0.2, 0.2]} color="#9cc4ff" intensity={1.1 * glow} distance={3.5} decay={1.8} />
  </group>
);

export const Lamp: React.FC<{ p: V; on?: number; c?: string }> = ({ p, on = 1, c = "#ffb869" }) => (
  <group position={p}>
    <mesh position={[0, 0.2, 0]} castShadow>
      <cylinderGeometry args={[0.02, 0.05, 0.4, 8]} />
      <M c="#2a2a2a" />
    </mesh>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.1, 0.17, 0.22, 12, 1, true]} />
      <M c="#f1e3c8" e={c} ei={0.8 * on} side={THREE.DoubleSide} />
    </mesh>
    <pointLight position={[0, 0.5, 0]} color={c} intensity={9 * on} distance={9} decay={1.6} castShadow={false} />
  </group>
);

export const Bed: React.FC<{ p: V; ry?: number; floor?: boolean; sheet?: string }> = ({ p, ry = 0, floor, sheet = "#d8d2c6" }) => (
  <group position={p} rotation={[0, ry, 0]}>
    {!floor && (
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.3, 2.0]} />
        <M c="#4a3526" />
      </mesh>
    )}
    <mesh position={[0, floor ? 0.12 : 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.5, floor ? 0.2 : 0.22, 1.9]} />
      <M c={sheet} r={1} />
    </mesh>
    <mesh position={[0, floor ? 0.26 : 0.66, -0.7]} castShadow>
      <boxGeometry args={[0.7, 0.12, 0.35]} />
      <M c="#efece4" r={1} />
    </mesh>
  </group>
);

export const Cup: React.FC<{ p: V; s?: number; iced?: boolean }> = ({ p, s = 1, iced }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.06, 0]} castShadow>
      <cylinderGeometry args={[0.04, 0.03, 0.12, 14]} />
      <M c={iced ? "#e9e1d0" : "#f4f1e8"} t={iced ? 0.8 : undefined} />
    </mesh>
    <mesh position={[0, 0.125, 0]}>
      <cylinderGeometry args={[0.044, 0.044, 0.012, 14]} />
      <M c="#222" />
    </mesh>
    {iced && (
      <mesh position={[0, 0.17, 0.0]} rotation={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
        <M c="#2a8a4a" />
      </mesh>
    )}
  </group>
);

export const Phone: React.FC<{ p: V; ry?: number; rx?: number; glow?: number; color?: string }> = ({ p, ry = 0, rx = 0, glow = 1, color = "#9ed0ff" }) => (
  <group position={p} rotation={[rx, ry, 0]}>
    <mesh castShadow>
      <boxGeometry args={[0.07, 0.15, 0.008]} />
      <M c="#14161a" m={0.6} r={0.3} />
    </mesh>
    <mesh position={[0, 0, 0.005]}>
      <planeGeometry args={[0.062, 0.138]} />
      <meshBasicMaterial color={color} toneMapped={false} opacity={0.4 + 0.6 * glow} transparent />
    </mesh>
    <pointLight position={[0, 0, 0.12]} color={color} intensity={0.5 * glow} distance={2.5} decay={1.8} />
  </group>
);

export const Passport: React.FC<{ p: V; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh>
      <boxGeometry args={[0.125, 0.01, 0.176]} />
      <M c="#7a1f24" r={0.6} />
    </mesh>
    <mesh position={[0, 0.006, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.002, 16]} />
      <M c="#d8b25a" m={0.8} r={0.3} />
    </mesh>
  </group>
);

export const Seat: React.FC<{ p: V; ry?: number; c?: string }> = ({ p, ry = 0, c = "#2f3f5a" }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.12, 0.5]} />
      <M c={c} r={0.9} />
    </mesh>
    <mesh position={[0, 0.58, -0.22]} castShadow>
      <boxGeometry args={[0.5, 0.6, 0.1]} />
      <M c={c} r={0.9} />
    </mesh>
  </group>
);

export const Stool: React.FC<{ p: V; c?: string }> = ({ p, c = "#2a2a2a" }) => (
  <group position={p}>
    <mesh position={[0, 0.6, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.16, 0.05, 14]} />
      <M c="#6a4a2a" />
    </mesh>
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
      <M c={c} m={0.7} />
    </mesh>
  </group>
);
