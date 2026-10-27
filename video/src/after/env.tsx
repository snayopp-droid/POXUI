import React, { useMemo } from "react";
import * as THREE from "three";
import { rnd } from "./util";
import { Tree, skyTex, type Mood } from "./world";

const cv = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
const T = (c: HTMLCanvasElement, rx = 1, ry = 1) => {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
const cache: Record<string, THREE.Texture> = {};
const once = (k: string, f: () => THREE.Texture) => (cache[k] ??= f());

export const brickTex = () =>
  once("brick", () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = "#6e3f33";
    g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 8; x++) {
        const o = y % 2 ? 32 : 0;
        const k = rnd(x * 7 + y * 13);
        g.fillStyle = `rgb(${110 + k * 50},${58 + k * 25},${46 + k * 20})`;
        g.fillRect(x * 64 + o + 2, y * 32 + 2, 60, 28);
      }
    for (let i = 0; i < 400; i++) {
      g.fillStyle = `rgba(0,0,0,${rnd(i) * 0.18})`;
      g.fillRect(rnd(i * 3) * 512, rnd(i * 5) * 512, 3 + rnd(i) * 30, 2 + rnd(i * 2) * 20);
    }
    return T(c, 3, 3);
  });

export const panelTex = () =>
  once("panel", () => {
    const c = cv(512, 1024);
    const g = c.getContext("2d")!;
    g.fillStyle = "#b5b3aa";
    g.fillRect(0, 0, 512, 1024);
    for (let y = 0; y < 1024; y += 128) {
      g.fillStyle = "#8d8b84";
      g.fillRect(0, y, 512, 6);
    }
    g.fillStyle = "#8d8b84";
    for (let x = 0; x < 512; x += 128) g.fillRect(x, 0, 5, 1024);
    for (let r = 0; r < 8; r++)
      for (let k = 0; k < 4; k++) {
        const lit = rnd(r * 11 + k * 5) > 0.82;
        g.fillStyle = "#2b3440";
        g.fillRect(k * 128 + 26, r * 128 + 30, 76, 66);
        g.fillStyle = lit ? "#ffcf7a" : rnd(r + k * 9) > 0.5 ? "#3d4a5c" : "#232c38";
        g.fillRect(k * 128 + 31, r * 128 + 35, 66, 56);
        g.fillStyle = "#c9c6bd";
        g.fillRect(k * 128 + 62, r * 128 + 35, 4, 56);
      }
    for (let i = 0; i < 300; i++) {
      g.fillStyle = `rgba(40,30,20,${rnd(i) * 0.12})`;
      g.fillRect(rnd(i * 3) * 512, rnd(i * 5) * 1024, 2 + rnd(i) * 20, 10 + rnd(i * 2) * 60);
    }
    return T(c, 1, 1);
  });

export const dirtTex = () =>
  once("dirt", () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = "#6e6347";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 1800; i++) {
      const k = rnd(i);
      g.fillStyle = `rgba(${k > 0.5 ? "130,150,70" : "60,45,30"},${0.1 + rnd(i * 3) * 0.2})`;
      g.fillRect(rnd(i * 5) * 512, rnd(i * 7) * 512, 2 + k * 12, 2 + rnd(i * 2) * 10);
    }
    return T(c, 8, 8);
  });

export const boardTex = (title: string, lines: string[]) =>
  once("board" + title, () => {
    const c = cv(1024, 640);
    const g = c.getContext("2d")!;
    g.fillStyle = "#2a2d2a";
    g.fillRect(0, 0, 1024, 640);
    g.strokeStyle = "#8a8d80";
    g.lineWidth = 10;
    g.strokeRect(12, 12, 1000, 616);
    g.fillStyle = "#f1efe3";
    g.font = "bold 74px 'Inter', sans-serif";
    g.textAlign = "center";
    g.fillText(title, 512, 100);
    g.font = "46px 'Inter', sans-serif";
    lines.forEach((l, i) => g.fillText(l, 512, 190 + i * 66));
    // записки
    for (let i = 0; i < 40; i++) {
      g.fillStyle = ["#f2e6a0", "#e9b9b0", "#b9d3e8", "#f4f4f0"][i % 4];
      g.save();
      g.translate(60 + (i % 10) * 94, 360 + Math.floor(i / 10) * 66);
      g.rotate((rnd(i) - 0.5) * 0.3);
      g.fillRect(0, 0, 64, 46);
      g.restore();
    }
    return T(c);
  });

/* ───────── мелкие предметы ───────── */
const M: React.FC<{ c: string; r?: number; m?: number; e?: string; ei?: number }> = ({ c, r = 0.85, m = 0, e, ei = 0 }) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} />
);

export const Crate: React.FC<{ p: [number, number, number]; s?: [number, number, number]; ry?: number; c?: string }> = ({ p, s = [0.8, 0.6, 0.8], ry = 0, c = "#8b6a3e" }) => (
  <mesh position={[p[0], p[1] + s[1] / 2, p[2]]} rotation={[0, ry, 0]} castShadow receiveShadow>
    <boxGeometry args={s} />
    <M c={c} r={0.95} />
  </mesh>
);

export const MusicBox: React.FC<{ p: [number, number, number]; open?: number; ry?: number; rz?: number; spin?: number }> = ({ p, open = 0, ry = 0, rz = 0, spin = 0 }) => (
  <group position={p} rotation={[0, ry, rz]}>
    <mesh position={[0, 0.07, 0]} castShadow>
      <boxGeometry args={[0.3, 0.14, 0.2]} />
      <M c="#7a3b22" r={0.5} />
    </mesh>
    <mesh position={[0, 0.145, 0]}>
      <boxGeometry args={[0.26, 0.012, 0.16]} />
      <M c="#d8b25a" m={0.8} r={0.3} />
    </mesh>
    <group position={[0, 0.14, -0.1]} rotation={[-open * 1.9, 0, 0]}>
      <mesh position={[0, 0.0, 0.1]} castShadow>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <M c="#8a4527" r={0.5} />
      </mesh>
    </group>
    <mesh position={[0, 0.2, 0]} rotation={[0, spin, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.09, 8]} />
      <M c="#e8d8a0" m={0.7} r={0.3} e="#ffe9a0" ei={open * 0.6} />
    </mesh>
  </group>
);

export const Dog: React.FC<{ p: [number, number, number]; ry?: number; t?: number; run?: number }> = ({ p, ry = 0, t = 0, run = 0 }) => {
  const ph = t * (6 + run * 10);
  const sw = Math.sin(ph) * (0.35 + run * 0.4);
  return (
    <group position={[p[0], p[1] + Math.abs(Math.sin(ph)) * 0.03 * (1 + run * 2), p[2]]} rotation={[0, ry, 0]}>
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.34, 0.3, 0.8]} />
        <M c="#a86a35" r={1} />
      </mesh>
      <mesh position={[0, 0.7, 0.5]} castShadow>
        <boxGeometry args={[0.26, 0.26, 0.3]} />
        <M c="#b87a40" r={1} />
      </mesh>
      <mesh position={[0, 0.66, 0.7]} castShadow>
        <boxGeometry args={[0.14, 0.12, 0.16]} />
        <M c="#2a1f18" r={1} />
      </mesh>
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 0.86, 0.44]} rotation={[0.3, 0, x * 2]} castShadow>
          <boxGeometry args={[0.07, 0.14, 0.05]} />
          <M c="#7e4a22" r={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.66, -0.5]} rotation={[0.9 + Math.sin(ph * 1.5) * 0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.34, 0.07]} />
        <M c="#a86a35" r={1} />
      </mesh>
      {([[-0.12, 0.28, 1], [0.12, 0.28, -1], [-0.12, -0.28, -1], [0.12, -0.28, 1]] as const).map(([x, z, d], i) => (
        <group key={i} position={[x, 0.4, z]} rotation={[sw * d, 0, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <boxGeometry args={[0.09, 0.4, 0.09]} />
            <M c="#a86a35" r={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Candle: React.FC<{ p: [number, number, number]; fl?: number; glow?: number }> = ({ p, fl = 0, glow = 1 }) => (
  <group position={p}>
    <mesh position={[0, 0.04, 0]} castShadow>
      <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
      <M c="#f4efe0" />
    </mesh>
    <mesh position={[0, 0.095 + fl * 0.004, 0]} scale={[1, 1.8 + fl * 0.3, 1]}>
      <sphereGeometry args={[0.012, 8, 8]} />
      <meshBasicMaterial color="#ffd27a" />
    </mesh>
    <pointLight position={[0, 0.12, 0]} color="#ffb85a" intensity={glow * (2.2 + fl * 0.4)} distance={7} decay={1.6} />
  </group>
);

export const Cake: React.FC<{ p: [number, number, number] }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.14, 0.15, 0.08, 16]} />
      <M c="#e9c9a0" />
    </mesh>
    <mesh position={[0, 0.095, 0]}>
      <cylinderGeometry args={[0.14, 0.14, 0.03, 16]} />
      <M c="#f6e8ee" />
    </mesh>
  </group>
);

export const Table: React.FC<{ p: [number, number, number]; s?: [number, number]; c?: string }> = ({ p, s = [2, 0.9], c = "#6b5a46" }) => (
  <group position={p}>
    <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
      <boxGeometry args={[s[0], 0.06, s[1]]} />
      <M c={c} r={0.9} />
    </mesh>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
      <mesh key={i} position={[(a * (s[0] - 0.12)) / 2, 0.37, (b * (s[1] - 0.12)) / 2]} castShadow>
        <boxGeometry args={[0.06, 0.74, 0.06]} />
        <M c="#3b3128" />
      </mesh>
    ))}
  </group>
);

export const Pizza: React.FC<{ p: [number, number, number]; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh castShadow>
      <boxGeometry args={[0.36, 0.05, 0.36]} />
      <M c="#d8b88a" />
    </mesh>
    <mesh position={[0, 0.03, 0]}>
      <boxGeometry args={[0.1, 0.005, 0.1]} />
      <M c="#c33" />
    </mesh>
  </group>
);

/** растяжка вывески-доски */
export const Board: React.FC<{ p: [number, number, number]; ry?: number; title: string; lines: string[] }> = ({ p, ry = 0, title, lines }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[-1.5, 1.2, 0]} castShadow>
      <boxGeometry args={[0.12, 2.4, 0.12]} />
      <M c="#3a3128" />
    </mesh>
    <mesh position={[1.5, 1.2, 0]} castShadow>
      <boxGeometry args={[0.12, 2.4, 0.12]} />
      <M c="#3a3128" />
    </mesh>
    <mesh position={[0, 1.7, 0.08]} castShadow>
      <planeGeometry args={[3, 1.9]} />
      <meshStandardMaterial map={boardTex(title, lines)} roughness={0.9} emissive="#fff" emissiveMap={boardTex(title, lines)} emissiveIntensity={0.12} />
    </mesh>
  </group>
);

/** сетка-забор с воротами */
export const Gate: React.FC<{ p: [number, number, number]; open?: number; w?: number }> = ({ p, open = 0, w = 7 }) => {
  const bars = Math.floor(w * 5);
  return (
    <group position={p}>
      {Array.from({ length: bars }, (_, i) => {
        const x = -w / 2 + (i * w) / (bars - 1);
        const inGate = Math.abs(x) < 1.1;
        if (inGate) return null;
        return (
          <mesh key={i} position={[x, 1.1, 0]} castShadow>
            <boxGeometry args={[0.04, 2.2, 0.04]} />
            <M c="#2b2d30" m={0.6} r={0.5} />
          </mesh>
        );
      })}
      {[0.3, 2.1].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[w, 0.06, 0.06]} />
          <M c="#2b2d30" m={0.6} r={0.5} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.1, 0, 0]} rotation={[0, -s * open * 1.7, 0]}>
          <mesh position={[-s * 0.55, 1.15, 0]} castShadow>
            <boxGeometry args={[1.1, 2.1, 0.05]} />
            <meshStandardMaterial color="#3a4a3a" roughness={0.7} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** лампочки гирляндой */
export const StringLights: React.FC<{ a: [number, number, number]; b: [number, number, number]; n?: number; color?: string; glow?: number }> = ({ a, b, n = 12, color = "#ffd38a", glow = 1 }) => (
  <group>
    {Array.from({ length: n }, (_, i) => {
      const k = i / (n - 1);
      const sag = Math.sin(k * Math.PI) * 0.4;
      return (
        <mesh key={i} position={[a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - sag, a[2] + (b[2] - a[2]) * k]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={color} toneMapped={false} opacity={0.6 + 0.4 * glow} transparent />
        </mesh>
      );
    })}
  </group>
);

/* ───────── подворотня (чёрный рынок) ───────── */
export const Alley: React.FC<{ mood: Mood }> = ({ mood }) => {
  const sky = useMemo(() => skyTex(mood), [mood]);
  const br = brickTex();
  return (
    <group>
      <color attach="background" args={[mood.sky[1]]} />
      <fog attach="fog" args={[mood.fog, mood.fogNear, mood.fogFar]} />
      <ambientLight intensity={1.3} color="#c79a8a" />
      <pointLight position={[0, 4.6, -4]} color="#ffb070" intensity={30} distance={14} decay={1.5} />
      <pointLight position={[0, 4.6, -14]} color="#ff9ab0" intensity={24} distance={14} decay={1.5} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[300, 12, 12]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} receiveShadow>
        <planeGeometry args={[9, 60]} />
        <meshStandardMaterial color="#3d3a36" roughness={1} map={dirtTex()} />
      </mesh>
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[s * 4.5, 7, -10]} rotation={[0, (-s * Math.PI) / 2, 0]} castShadow receiveShadow>
          <planeGeometry args={[60, 14]} />
          <meshStandardMaterial map={br} roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 6, -38]}>
        <planeGeometry args={[10, 14]} />
        <meshStandardMaterial map={br} roughness={1} />
      </mesh>
      {/* арка наверху */}
      <mesh position={[0, 11, 4]}>
        <boxGeometry args={[9.4, 6, 3]} />
        <meshStandardMaterial map={br} roughness={1} />
      </mesh>
      {[-1, 1].map((s) => (
        <StringLights key={s} a={[s * 4.3, 5, -2]} b={[-s * 4.3, 5.5, -9]} n={14} />
      ))}
      <StringLights a={[-4.3, 4.6, -12]} b={[4.3, 5, -19]} n={14} color="#ff9ab0" />
      {/* ящики, торговые столы */}
      <Crate p={[-3.6, 0, -4]} s={[1, 1, 1]} />
      <Crate p={[-3.5, 1, -4.1]} s={[0.7, 0.6, 0.7]} ry={0.4} c="#6f5330" />
      <Crate p={[3.6, 0, -6]} s={[1.1, 0.8, 1.1]} ry={0.2} />
      <Crate p={[3.5, 0, -14]} s={[1, 1.2, 1]} c="#5d4b34" />
      <Crate p={[-3.5, 0, -13]} s={[1.2, 0.7, 1]} ry={0.1} />
      <Table p={[-3.3, 0, -8.5]} s={[1.6, 2.4]} c="#5a4a38" />
      <Table p={[3.3, 0, -10]} s={[1.6, 2.4]} c="#4c4a52" />
      {/* предметы на столе: свистки, будильники, шкатулка */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-3.3 + (rnd(i) - 0.5) * 1.2, 0.82, -8.5 + (rnd(i * 3) - 0.5) * 2]} castShadow>
          <boxGeometry args={[0.12 + rnd(i * 5) * 0.12, 0.1 + rnd(i * 7) * 0.12, 0.1]} />
          <M c={["#c93", "#39c", "#c33", "#aaa"][i % 4]} m={0.4} />
        </mesh>
      ))}
      <MusicBox p={[3.3, 0.77, -10.2]} ry={0.5} />
      {/* трубы */}
      <mesh position={[4.3, 3, -16]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 12, 10]} />
        <M c="#555a5e" m={0.6} r={0.5} />
      </mesh>
    </group>
  );
};

/* ───────── двор панельки ───────── */
export const Courtyard: React.FC<{ mood: Mood; gateOpen?: number }> = ({ mood, gateOpen = 0 }) => {
  const sky = useMemo(() => skyTex(mood), [mood]);
  const pt = panelTex();
  const dt = dirtTex();
  return (
    <group>
      <color attach="background" args={[mood.sky[1]]} />
      <fog attach="fog" args={[mood.fog, mood.fogNear, mood.fogFar]} />
      <ambientLight intensity={mood === undefined ? 0 : 1.1} color="#8a9ac8" />
      <mesh>
        <sphereGeometry args={[320, 12, 12]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial map={dt} roughness={1} />
      </mesh>
      {/* три панельных дома по периметру двора */}
      {([[-14, -2, Math.PI / 2, 30], [0, -16, 0, 34], [14, -2, -Math.PI / 2, 30]] as const).map(([x, z, ry, w], i) => {
        const t = pt.clone();
        t.repeat.set(w / 12, 2.2);
        t.needsUpdate = true;
        return (
          <mesh key={i} position={[x, 13, z]} rotation={[0, ry, 0]} castShadow receiveShadow>
            <planeGeometry args={[w, 26]} />
            <meshStandardMaterial map={t} roughness={1} emissive="#fff" emissiveMap={t} emissiveIntensity={0.25} />
          </mesh>
        );
      })}
      {([[-20, -2, 30], [0, -22, 34], [20, -2, 30]] as const).map(([x, z, w], i) => (
        <mesh key={i} position={[x, 13, z]} castShadow>
          <boxGeometry args={i === 1 ? [w, 26, 10] : [10, 26, w]} />
          <meshStandardMaterial color="#a9a69c" roughness={1} />
        </mesh>
      ))}
      {/* дома через дорогу, за воротами */}
      {[-22, 8, 36].map((x, i) => {
        const t = pt.clone();
        t.repeat.set(1.8, 2.2);
        t.needsUpdate = true;
        return (
          <mesh key={i} position={[x, 13, 48]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[26, 26]} />
            <meshStandardMaterial map={t} roughness={1} emissive="#fff" emissiveMap={t} emissiveIntensity={0.3} />
          </mesh>
        );
      })}
      {/* забор и ворота со стороны улицы */}
      <Gate p={[0, 0, 12]} open={gateOpen} w={26} />
      {/* деревья, качели, скамейка */}
      <Tree x={-8} z={-6} s={1.1} seed={3} fall={0.2} />
      <Tree x={8} z={-9} s={1.2} seed={9} fall={0.2} />
      <Tree x={-6} z={5} s={0.9} seed={15} fall={0.2} />
      <mesh position={[5, 0.45, -3]} castShadow>
        <boxGeometry args={[2, 0.08, 0.5]} />
        <M c="#6b5a46" />
      </mesh>
      {/* стол во дворе (день рождения) */}
      <Table p={[0, 0, -5]} s={[3, 1.1]} c="#7b6a55" />
      {/* бельё */}
      <mesh position={[-4, 3.2, -9]} castShadow>
        <planeGeometry args={[0.8, 0.6]} />
        <meshStandardMaterial color="#d8d0c0" side={THREE.DoubleSide} />
      </mesh>
      <StringLights a={[-8, 3.2, -10]} b={[8, 3.4, -10]} n={16} color="#ffe2a8" />
    </group>
  );
};
