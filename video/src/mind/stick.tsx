import React, { useMemo } from "react";
import * as THREE from "three";

/** «человечек»: чёрная шарообразная голова с нарисованным лицом, худи, тонкие ноги */
export type Expr = "neutral" | "smirk" | "happy" | "smile" | "surprised" | "sad" | "worried" | "blink" | "talk";
export type Look = { hood: string; pants?: string; shoes?: string; accent?: string };
export type Pose = {
  walk?: number; amp?: number;
  armL?: [number, number]; armR?: [number, number]; // [вперёд, наружу]
  elbL?: number; elbR?: number;
  yaw?: number; pitch?: number; tilt?: number;
  lean?: number; sit?: number; expr?: Expr; gaze?: number;
  lie?: number; // 0..1: лёжа на спине (корпус горизонтально)
};

const R = 0.27;
const cache: Record<string, THREE.Texture> = {};

const faceTex = (expr: Expr, gaze: number) => {
  const key = `${expr}_${gaze}`;
  if (cache[key]) return cache[key];
  const W = 800, H = 564;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  const cream = "#f6ecd6", ink = "#0a0a0e";
  const ex = [252, 548], ey = 262;
  const shape: Record<Expr, { open: number; browA: number; browY: number; pupil: number }> = {
    neutral: { open: 0.82, browA: 0.22, browY: -78, pupil: 1 },
    smirk: { open: 0.74, browA: 0.28, browY: -76, pupil: 1 },
    happy: { open: 0.5, browA: -0.1, browY: -88, pupil: 1 },
    smile: { open: 0.78, browA: 0.0, browY: -84, pupil: 1 },
    surprised: { open: 1.25, browA: -0.28, browY: -104, pupil: 0.72 },
    sad: { open: 0.7, browA: -0.38, browY: -72, pupil: 1 },
    worried: { open: 0.95, browA: -0.3, browY: -90, pupil: 0.85 },
    blink: { open: 0.08, browA: 0.1, browY: -70, pupil: 1 },
    talk: { open: 0.85, browA: 0.1, browY: -82, pupil: 1 },
  };
  const s = shape[expr];
  ex.forEach((x, i) => {
    const side = i === 0 ? -1 : 1;
    const w = 128, h = 100 * s.open;
    // глаз: миндалевидный
    g.fillStyle = cream;
    g.beginPath();
    g.moveTo(x - w, ey + 6 * side * (expr === "smirk" ? 1 : 0));
    g.quadraticCurveTo(x, ey - h * 1.5, x + w, ey);
    g.quadraticCurveTo(x, ey + h * 1.3, x - w, ey + 6 * side * (expr === "smirk" ? 1 : 0));
    g.fill();
    if (s.open > 0.2) {
      const px = x + gaze * 30 + side * -4, pr = 50 * s.pupil;
      g.fillStyle = ink;
      g.beginPath(); g.ellipse(px, ey + 4, pr, pr * 1.12 * Math.min(1, s.open + 0.2), 0, 0, 7); g.fill();
      g.fillStyle = "#fff";
      g.beginPath(); g.arc(px - 11, ey - 14, 9, 0, 7); g.fill();
    }
    if (expr === "happy") { // нижнее веко поднято
      g.fillStyle = "#0a0a0e";
      g.beginPath(); g.ellipse(x, ey + 62, w + 12, 34, 0, 0, 7); g.fill();
    }
    // верхнее веко-линия и бровь
    g.strokeStyle = ink; g.lineWidth = 15; g.lineCap = "round";
    g.beginPath();
    const by = ey + s.browY, yo = by - s.browA * 70, yi = by + s.browA * 70;
    g.moveTo(x - 84, side === -1 ? yo : yi);
    g.lineTo(x + 84, side === -1 ? yi : yo);
    g.stroke();
  });
  // рот
  g.strokeStyle = cream; g.fillStyle = cream; g.lineWidth = 12; g.lineCap = "round";
  const mx = W / 2, my = 440;
  g.beginPath();
  if (expr === "smirk") { g.moveTo(mx - 100, my + 6); g.quadraticCurveTo(mx + 10, my + 46, mx + 130, my - 28); g.stroke(); }
  else if (expr === "happy") { g.moveTo(mx - 110, my - 14); g.quadraticCurveTo(mx, my + 92, mx + 110, my - 14); g.closePath(); g.fill(); }
  else if (expr === "smile") { g.moveTo(mx - 80, my); g.quadraticCurveTo(mx, my + 52, mx + 80, my); g.stroke(); }
  else if (expr === "surprised") { g.ellipse(mx, my + 10, 30, 42, 0, 0, 7); g.fill(); }
  else if (expr === "talk") { g.ellipse(mx, my + 8, 44, 24, 0, 0, 7); g.fill(); }
  else if (expr === "sad") { g.moveTo(mx - 76, my + 28); g.quadraticCurveTo(mx, my - 22, mx + 76, my + 28); g.stroke(); }
  else if (expr === "worried") { g.moveTo(mx - 60, my + 14); g.quadraticCurveTo(mx - 20, my - 6, mx, my + 10); g.quadraticCurveTo(mx + 20, my + 26, mx + 60, my + 6); g.stroke(); }
  else { g.moveTo(mx - 70, my); g.quadraticCurveTo(mx, my + 20, mx + 70, my); g.stroke(); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  cache[key] = t;
  return t;
};

const Limb: React.FC<{ r: number; len: number; c: string; roundTip?: boolean }> = ({ r, len, c }) => (
  <mesh position={[0, -len / 2, 0]} castShadow>
    <capsuleGeometry args={[r, len - r * 2, 4, 10]} />
    <meshStandardMaterial color={c} roughness={0.7} />
  </mesh>
);

const INK = "#101018";

export const Stick: React.FC<{ pos: [number, number, number]; rotY?: number; look: Look; pose?: Pose; scale?: number; handR?: React.ReactNode; handL?: React.ReactNode; outline?: boolean }> = ({ pos, rotY = 0, look, pose = {}, scale = 1, handR, handL, outline = true }) => {
  const p = pose;
  const amp = p.amp ?? 0, ph = p.walk ?? 0, sit = p.sit ?? 0;
  const sw = Math.sin(ph) * 0.6 * amp;
  const kneeL = Math.max(0, Math.sin(ph + 1.3)) * 0.8 * amp, kneeR = Math.max(0, Math.sin(ph + 1.3 + Math.PI)) * 0.8 * amp;
  const hipY = 0.8 - 0.35 * sit + Math.abs(Math.sin(ph)) * 0.03 * amp;
  const [aLf, aLo] = p.armL ?? [-Math.sin(ph) * 0.55 * amp, 0.08];
  const [aRf, aRo] = p.armR ?? [Math.sin(ph) * 0.55 * amp, 0.08];
  const elbL = p.elbL ?? 0.2 * amp + 0.1, elbR = p.elbR ?? 0.2 * amp + 0.1;
  const face = useMemo(() => faceTex(p.expr ?? "neutral", Math.round(p.gaze ?? 0)), [p.expr, p.gaze]);
  const cap = useMemo(() => new THREE.SphereGeometry(R * 1.004, 40, 28, Math.PI / 2 - 0.85, 1.7, Math.PI / 2 - 0.62, 1.24), []);
  const pants = look.pants ?? "#2a3a66", shoes = look.shoes ?? "#ececf0", acc = look.accent ?? "#f4e4c8";
  const lie = p.lie ?? 0;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={scale}>
      <group position={[0, hipY, 0]} rotation={[-lie * 1.5, 0, 0]}>
        {/* ноги */}
        {([-1, 1] as const).map((s) => {
          const th = (s === 1 ? sw : -sw) * (1 - sit) - 1.45 * sit, kn = (s === 1 ? kneeL : kneeR) * (1 - sit) + 1.45 * sit;
          return (
            <group key={s} position={[s * 0.09, 0, 0]} rotation={[th, 0, s * 0.02]}>
              <Limb r={0.048} len={0.4} c={pants} />
              <group position={[0, -0.4, 0]} rotation={[kn, 0, 0]}>
                <Limb r={0.042} len={0.4} c={pants} />
                <mesh position={[0, -0.41, 0.045]} castShadow><boxGeometry args={[0.1, 0.07, 0.19]} /><meshStandardMaterial color={shoes} roughness={0.6} /></mesh>
              </group>
            </group>
          );
        })}
        {/* корпус */}
        <group rotation={[p.lean ?? 0.04 * amp, 0, 0]}>
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.165, 0.2, 0.52, 18]} />
            <meshStandardMaterial color={look.hood} roughness={0.75} />
          </mesh>
          {outline && <mesh position={[0, 0.26, 0]} scale={[1.07, 1.02, 1.07]}><cylinderGeometry args={[0.165, 0.2, 0.52, 18]} /><meshBasicMaterial color={acc} side={THREE.BackSide} /></mesh>}
          <mesh position={[0, 0.1, 0.19]}><boxGeometry args={[0.2, 0.1, 0.03]} /><meshStandardMaterial color={look.hood} roughness={0.8} /></mesh>
          <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.16, 0.065, 10, 22]} /><meshStandardMaterial color={look.hood} roughness={0.8} /></mesh>
          {[-0.05, 0.05].map((x) => <mesh key={x} position={[x, 0.36, 0.175]}><cylinderGeometry args={[0.008, 0.008, 0.22, 6]} /><meshStandardMaterial color="#f2ead8" /></mesh>)}
          {/* руки */}
          {([-1, 1] as const).map((s) => {
            const f = s === 1 ? aLf : aRf, o = s === 1 ? aLo : aRo, el = s === 1 ? elbL : elbR;
            return (
              <group key={s} position={[s * 0.215, 0.46, 0]} rotation={[-f, 0, s * o]}>
                <Limb r={0.058} len={0.27} c={look.hood} />
                <group position={[0, -0.27, 0]} rotation={[-el, 0, 0]}>
                  <Limb r={0.036} len={0.3} c={INK} />
                  <mesh position={[0, -0.32, 0]}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color={INK} roughness={0.6} /></mesh>
                  <group position={[0, -0.33, 0.03]}>{s === 1 ? handL : handR}</group>
                </group>
              </group>
            );
          })}
          {/* голова */}
          <group position={[0, 0.6, 0]} rotation={[p.pitch ?? 0, p.yaw ?? 0, p.tilt ?? 0]}>
            <mesh position={[0, R + 0.01, 0]} castShadow>
              <sphereGeometry args={[R, 40, 28]} />
              <meshStandardMaterial color="#0d0d13" roughness={0.32} metalness={0.15} />
            </mesh>
            {outline && <mesh position={[0, R + 0.01, 0]} scale={1.045}><sphereGeometry args={[R, 32, 22]} /><meshBasicMaterial color={acc} side={THREE.BackSide} /></mesh>}
            <mesh position={[0, R + 0.01, 0]} geometry={cap}>
              <meshBasicMaterial map={face} transparent toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
