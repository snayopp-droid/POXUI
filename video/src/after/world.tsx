import React, { useMemo } from "react";
import * as THREE from "three";
import { rnd } from "./util";

/* ───────── настроение света ───────── */
export type Mood = {
  sky: [string, string, string];
  fog: string;
  fogNear: number;
  fogFar: number;
  sun: string;
  sunI: number;
  sunPos: [number, number, number];
  hemiSky: string;
  hemiGround: string;
  hemiI: number;
  exposure?: number;
};

export const MOODS: Record<string, Mood> = {
  golden: { sky: ["#6fa7e8", "#bcd4ee", "#f4e3c6"], fog: "#dcd2bf", fogNear: 28, fogFar: 150, sun: "#ffd9a0", sunI: 3.6, sunPos: [-18, 16, -12], hemiSky: "#bfd6f4", hemiGround: "#7a6a58", hemiI: 1.5, exposure: 1.25 },
  overcast: { sky: ["#7f8c9a", "#a9b3bd", "#cfd3d6"], fog: "#b9bfc4", fogNear: 20, fogFar: 110, sun: "#e8eef5", sunI: 1.2, sunPos: [-10, 20, -6], hemiSky: "#c9d3dc", hemiGround: "#6b665f", hemiI: 1.9, exposure: 1.2 },
  dusk: { sky: ["#35406e", "#b8688a", "#ffb078"], fog: "#c98a7c", fogNear: 22, fogFar: 120, sun: "#ff9a58", sunI: 2.6, sunPos: [22, 6, -14], hemiSky: "#7a7fb8", hemiGround: "#4a3a3a", hemiI: 2.1, exposure: 1.25 },
  night: { sky: ["#05080f", "#0e1626", "#1c2438"], fog: "#0b1220", fogNear: 10, fogFar: 70, sun: "#8aa4d8", sunI: 1.4, sunPos: [8, 18, 6], hemiSky: "#27365a", hemiGround: "#10121a", hemiI: 1.9, exposure: 1.5 },
  dawn: { sky: ["#5c6f9a", "#e2a58a", "#ffd9a6"], fog: "#e0c1a8", fogNear: 24, fogFar: 140, sun: "#ffc88a", sunI: 2.2, sunPos: [24, 5, -10], hemiSky: "#a8b4d8", hemiGround: "#6a5a52", hemiI: 2.1, exposure: 1.25 },
};

const mkCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
const tex = (c: HTMLCanvasElement, rx = 1, ry = 1, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
};
const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, a: number, seed = 1, col = "0,0,0") => {
  for (let i = 0; i < n; i++) {
    g.fillStyle = `rgba(${col},${a * rnd(seed + i * 3)})`;
    g.fillRect(rnd(seed + i * 5) * w, rnd(seed + i * 7) * h, 1 + rnd(i) * 3, 1 + rnd(i * 2) * 3);
  }
};

/* ───────── текстуры (рисуются один раз) ───────── */
const cache: Record<string, THREE.Texture> = {};
const once = (k: string, f: () => THREE.Texture) => (cache[k] ??= f());

/** верхние этажи сталинки: 2 пролёта × 4 этажа, 12 × 17.6 м */
export const facadeTex = (base = "#d9c39a", trim = "#f1e9d6", variant = 0) =>
  once(`facade${base}${variant}`, () => {
    const PX = 64;
    const c = mkCanvas(12 * PX, 17.6 * PX);
    const g = c.getContext("2d")!;
    g.fillStyle = base;
    g.fillRect(0, 0, c.width, c.height);
    // пятна и подтёки
    for (let i = 0; i < 160; i++) {
      const x = rnd(i + variant) * c.width;
      const w = 20 + rnd(i * 3) * 80;
      const gr = g.createLinearGradient(0, 0, 0, c.height);
      gr.addColorStop(0, "rgba(90,70,40,0)");
      gr.addColorStop(1, `rgba(90,70,40,${0.03 + rnd(i) * 0.05})`);
      g.fillStyle = gr;
      g.fillRect(x, rnd(i * 5) * c.height * 0.5, w * 0.2, c.height);
    }
    for (let f = 0; f < 4; f++) {
      const y0 = f * 4.4 * PX;
      // тяга между этажами
      g.fillStyle = trim;
      g.fillRect(0, y0, c.width, 0.28 * PX);
      g.fillStyle = "rgba(0,0,0,0.18)";
      g.fillRect(0, y0 + 0.28 * PX, c.width, 0.08 * PX);
      for (let b = 0; b < 2; b++) {
        const cx = (b * 6 + 3) * PX;
        const ww = 1.7 * PX;
        const wh = 2.5 * PX;
        const wy = y0 + 1.1 * PX;
        // наличник
        g.fillStyle = trim;
        g.fillRect(cx - ww / 2 - 0.25 * PX, wy - 0.3 * PX, ww + 0.5 * PX, wh + 0.5 * PX);
        // сегментный/треугольный фронтон
        g.beginPath();
        if ((f + b) % 2) {
          g.moveTo(cx - ww / 2 - 0.35 * PX, wy - 0.3 * PX);
          g.lineTo(cx, wy - 0.95 * PX);
          g.lineTo(cx + ww / 2 + 0.35 * PX, wy - 0.3 * PX);
        } else {
          g.arc(cx, wy - 0.3 * PX, ww / 2 + 0.35 * PX, Math.PI, 0);
        }
        g.closePath();
        g.fill();
        // стекло: небесное отражение + занавеска
        const gl = g.createLinearGradient(0, wy, 0, wy + wh);
        const dead = rnd(f * 7 + b * 3 + variant) < 0.28;
        gl.addColorStop(0, dead ? "#15181c" : "#5a7390");
        gl.addColorStop(1, dead ? "#0b0d10" : "#1f2c3a");
        g.fillStyle = gl;
        g.fillRect(cx - ww / 2, wy, ww, wh);
        if (!dead && rnd(f * 11 + b + variant) < 0.5) {
          g.fillStyle = "rgba(235,225,205,0.65)";
          g.fillRect(cx - ww / 2, wy, ww, wh * (0.25 + rnd(f + b) * 0.3));
        }
        // переплёт
        g.fillStyle = trim;
        g.fillRect(cx - 0.05 * PX, wy, 0.1 * PX, wh);
        g.fillRect(cx - ww / 2, wy + wh * 0.62, ww, 0.1 * PX);
        // подоконник
        g.fillStyle = "#b8a98b";
        g.fillRect(cx - ww / 2 - 0.3 * PX, wy + wh, ww + 0.6 * PX, 0.2 * PX);
      }
    }
    noise(g, c.width, c.height, 5000, 0.06, 3);
    return tex(c, 1, 1);
  });

/** вывески и витрины — рисуются под конкретный магазин */
export type ShopKind = "apteka" | "coffee" | "metro" | "prod" | "bread" | "barber" | "boarded" | "tisha" | "water";
export const shopTex = (kind: ShopKind) =>
  once(`shop${kind}`, () => {
    const PX = 100;
    const c = mkCanvas(6 * PX, 4.4 * PX);
    const g = c.getContext("2d")!;
    g.fillStyle = "#cdb88f";
    g.fillRect(0, 0, c.width, c.height);
    const sign = (txt: string, bg: string, fg: string, w = 4.6, h = 0.9, y = 0.35, size = 56) => {
      g.fillStyle = bg;
      g.fillRect((6 - w) * 0.5 * PX, y * PX, w * PX, h * PX);
      g.fillStyle = fg;
      g.font = `800 ${size}px Inter, 'Liberation Sans', sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(txt, c.width / 2, (y + h / 2) * PX + 3);
    };
    const window_ = (x: number, w: number, lit: boolean, boards = false) => {
      const gl = g.createLinearGradient(0, 1.5 * PX, 0, 4.2 * PX);
      gl.addColorStop(0, lit ? "#f6dba0" : "#41546a");
      gl.addColorStop(1, lit ? "#c79a52" : "#17212c");
      g.fillStyle = gl;
      g.fillRect(x * PX, 1.5 * PX, w * PX, 2.6 * PX);
      g.fillStyle = "#5a5148";
      g.fillRect(x * PX - 6, 1.5 * PX - 6, w * PX + 12, 8);
      if (boards) {
        g.fillStyle = "#8d7556";
        for (let i = 0; i < 6; i++) g.fillRect(x * PX, 1.6 * PX + i * 0.42 * PX, w * PX, 0.3 * PX);
        g.fillStyle = "rgba(0,0,0,0.35)";
        for (let i = 0; i < 6; i++) g.fillRect(x * PX, 1.9 * PX + i * 0.42 * PX, w * PX, 5);
      }
    };
    const door = (x: number, w: number) => {
      g.fillStyle = "#2b2f35";
      g.fillRect(x * PX, 1.5 * PX, w * PX, 2.9 * PX);
      g.fillStyle = "#86a0b8";
      g.fillRect(x * PX + 8, 1.7 * PX, w * PX - 16, 2.0 * PX);
    };
    if (kind === "apteka") {
      sign("АПТЕКА", "#1f8a4c", "#ffffff");
      g.fillStyle = "#fff";
      g.fillRect(0.5 * PX, 0.4 * PX, 0.8 * PX, 0.8 * PX);
      g.fillStyle = "#1f8a4c";
      g.fillRect(0.82 * PX, 0.5 * PX, 0.16 * PX, 0.6 * PX);
      g.fillRect(0.6 * PX, 0.72 * PX, 0.6 * PX, 0.16 * PX);
      window_(0.4, 2.2, true);
      door(3.0, 1.1);
      window_(4.3, 1.4, true);
    } else if (kind === "coffee") {
      sign("КОФЕ", "#2a211c", "#f3d9a8", 3.6, 0.8, 0.45, 52);
      window_(0.3, 2.6, true);
      door(3.1, 1.0);
      window_(4.3, 1.4, true);
      g.fillStyle = "#3f7a46"; // навес
      g.fillRect(0.2 * PX, 1.25 * PX, 5.6 * PX, 0.28 * PX);
    } else if (kind === "metro") {
      g.fillStyle = "#3a3f46";
      g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = "#d4232c";
      g.beginPath();
      g.arc(3 * PX, 1.3 * PX, 0.95 * PX, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#fff";
      g.font = `900 ${1.3 * PX}px Inter, sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("М", 3 * PX, 1.38 * PX);
      g.fillStyle = "#14161a";
      g.fillRect(1.6 * PX, 2.4 * PX, 2.8 * PX, 2.0 * PX);
      g.fillStyle = "#e8e2d2";
      g.font = `700 ${0.28 * PX}px Inter, sans-serif`;
      g.fillText("ВХОД ЗАКРЫТ · ТИХО", 3 * PX, 2.8 * PX);
    } else if (kind === "prod") {
      sign("ПРОДУКТЫ", "#b3261e", "#fff3d6");
      window_(0.4, 2.2, false, true);
      door(3.0, 1.1);
      window_(4.3, 1.4, true);
    } else if (kind === "bread") {
      sign("ХЛЕБ", "#c78a2c", "#2a1a08", 3.2, 0.9, 0.4, 56);
      window_(0.4, 2.4, true);
      door(3.2, 1.1);
      window_(4.5, 1.2, true);
    } else if (kind === "barber") {
      sign("БАРБЕРШОП", "#14161a", "#f2f2f2", 4.2, 0.8, 0.4, 46);
      window_(0.4, 2.2, true);
      door(3.0, 1.1);
      window_(4.3, 1.4, true);
      g.fillStyle = "#fff";
      g.fillRect(5.4 * PX, 1.6 * PX, 0.25 * PX, 1.0 * PX);
      g.fillStyle = "#d4232c";
      for (let i = 0; i < 4; i++) g.fillRect(5.4 * PX, 1.6 * PX + i * 0.25 * PX, 0.25 * PX, 0.12 * PX);
    } else if (kind === "boarded") {
      sign("", "#44403a", "#fff", 4.6, 0.8, 0.4);
      window_(0.4, 2.2, false, true);
      door(3.0, 1.1);
      g.fillStyle = "#7b6246";
      g.fillRect(3.0 * PX, 1.5 * PX, 1.1 * PX, 2.9 * PX);
      window_(4.3, 1.4, false, true);
      g.fillStyle = "#e8e2d2";
      g.fillRect(0.7 * PX, 2.4 * PX, 1.6 * PX, 1.1 * PX);
      g.fillStyle = "#b3261e";
      g.font = `900 ${0.34 * PX}px Inter, sans-serif`;
      g.textAlign = "center";
      g.fillText("ТИХО!", 1.5 * PX, 2.75 * PX);
      g.fillStyle = "#222";
      g.font = `700 ${0.2 * PX}px Inter, sans-serif`;
      g.fillText("не стучать · не кричать", 1.5 * PX, 3.1 * PX);
    } else if (kind === "water") {
      sign("ВОДА · ВЫДАЧА", "#1d5b8f", "#ffffff", 4.8, 0.85, 0.4, 44);
      window_(0.4, 2.2, true);
      door(3.0, 1.1);
      window_(4.3, 1.4, true);
    } else {
      sign("ТИХИЙ ПУНКТ", "#2a2a2a", "#f2d680", 4.6, 0.85, 0.4, 44);
      window_(0.4, 2.2, true);
      door(3.0, 1.1);
      window_(4.3, 1.4, true);
    }
    noise(g, c.width, c.height, 2500, 0.07, 9);
    return tex(c, 1, 1);
  });

const pavingTex = () =>
  once("paving", () => {
    const c = mkCanvas(512, 512);
    const g = c.getContext("2d")!;
    const S = 128;
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        const v = 128 + rnd(x * 7 + y * 13) * 26;
        g.fillStyle = `rgb(${v + 12},${v + 8},${v - 4})`;
        g.fillRect(x * S, y * S, S, S);
        g.fillStyle = "rgba(0,0,0,0.22)";
        g.fillRect(x * S, y * S, S, 3);
        g.fillRect(x * S, y * S, 3, S);
      }
    noise(g, 512, 512, 3500, 0.12, 2);
    return tex(c, 8, 30);
  });
const asphaltTex = () =>
  once("asphalt", () => {
    const c = mkCanvas(512, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = "#4a4a4c";
    g.fillRect(0, 0, 512, 512);
    noise(g, 512, 512, 9000, 0.22, 5, "255,255,255");
    noise(g, 512, 512, 6000, 0.3, 6);
    g.strokeStyle = "rgba(10,10,10,0.5)";
    g.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      let x = rnd(i) * 512;
      let y = rnd(i * 3) * 512;
      g.moveTo(x, y);
      for (let k = 0; k < 8; k++) {
        x += (rnd(i * 9 + k) - 0.5) * 90;
        y += (rnd(i * 5 + k) - 0.5) * 90;
        g.lineTo(x, y);
      }
      g.stroke();
    }
    return tex(c, 3, 22);
  });
export const skyTex = (m: Mood) => {
  const c = mkCanvas(8, 512);
  const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, m.sky[0]);
  gr.addColorStop(0.55, m.sky[1]);
  gr.addColorStop(1, m.sky[2]);
  g.fillStyle = gr;
  g.fillRect(0, 0, 8, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/* ───────── улица ───────── */
export const Car: React.FC<{ x: number; z: number; rot: number; color: string; s?: number }> = ({ x, z, rot, color, s = 1 }) => (
  <group position={[x, 0, z]} rotation={[0, rot, 0]} scale={s}>
    <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.7, 4.3]} />
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.2} />
    </mesh>
    <mesh position={[0, 1.1, -0.2]} castShadow>
      <boxGeometry args={[1.6, 0.55, 2.3]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
    </mesh>
    <mesh position={[0, 1.12, -0.2]}>
      <boxGeometry args={[1.62, 0.4, 2.25]} />
      <meshStandardMaterial color="#1a222b" roughness={0.2} metalness={0.5} />
    </mesh>
    {[[-0.9, 1.3], [0.9, 1.3], [-0.9, -1.3], [0.9, -1.3]].map(([wx, wz], i) => (
      <mesh key={i} position={[wx, 0.32, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 14]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

export const Tree: React.FC<{ x: number; z: number; s: number; seed: number; fall: number }> = ({ x, z, s, seed, fall }) => {
  const blobs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        p: [(rnd(seed + i) - 0.5) * 2.6, 4.6 + rnd(seed + i * 3) * 2.4, (rnd(seed + i * 5) - 0.5) * 2.6] as [number, number, number],
        r: 1.3 + rnd(seed + i * 7) * 0.9,
        c: ["#d9892b", "#e9a63a", "#c4672a", "#b8a02e", "#8f9a3a"][Math.floor(rnd(seed + i * 9) * 5)],
      })),
    [seed],
  );
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.34, 4.6, 8]} />
        <meshStandardMaterial color="#3d2f26" roughness={1} />
      </mesh>
      {blobs.map((b, i) => (
        <mesh key={i} position={b.p} castShadow receiveShadow>
          <icosahedronGeometry args={[b.r, 1]} />
          <meshStandardMaterial color={b.c} roughness={0.95} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.4 * fall + 0.01, 14]} />
        <meshStandardMaterial color="#c07a2c" roughness={1} transparent opacity={0.65 * fall} />
      </mesh>
    </group>
  );
};

export const Lamp: React.FC<{ x: number; z: number; flip?: boolean }> = ({ x, z, flip }) => (
  <group position={[x, 0, z]} scale={[flip ? -1 : 1, 1, 1]}>
    <mesh position={[0, 3.2, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.09, 6.4, 8]} />
      <meshStandardMaterial color="#2a2d31" roughness={0.7} metalness={0.4} />
    </mesh>
    <mesh position={[0.6, 6.35, 0]}>
      <boxGeometry args={[1.3, 0.1, 0.3]} />
      <meshStandardMaterial color="#2a2d31" roughness={0.7} metalness={0.4} />
    </mesh>
    <mesh position={[1.15, 6.25, 0]}>
      <boxGeometry args={[0.5, 0.12, 0.28]} />
      <meshStandardMaterial color="#e9e1c2" emissive="#ffeab0" emissiveIntensity={0} />
    </mesh>
  </group>
);

export type StreetP = {
  mood: Mood;
  /** показывать вывески-магазины по номеру набора */
  shops?: ShopKind[];
  z0?: number;
  z1?: number;
  leaves?: number;
  /** 0..1 — степень «заброшенности»: машины, мусор */
  wreck?: number;
  /** камера: деревья/фонари рядом с ней скрываются */
  cam?: [number, number, number];
};

const Facade: React.FC<{ side: 1 | -1; z0: number; z1: number; shops: ShopKind[]; base: string; variant: number }> = ({ side, z0, z1, shops, base, variant }) => {
  const len = z1 - z0;
  const tx = useMemo(() => {
    const t = facadeTex(base, "#f1e9d6", variant).clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(len / 12, 1);
    t.needsUpdate = true;
    return t;
  }, [len, base, variant]);
  const x = side * 9.6;
  const nShops = Math.floor(len / 6);
  return (
    <group>
      {/* верхние этажи */}
      <mesh position={[x, 4.4 + 8.8, (z0 + z1) / 2]} rotation={[0, (-side * Math.PI) / 2, 0]} receiveShadow>
        <planeGeometry args={[len, 17.6]} />
        <meshStandardMaterial map={tx} roughness={0.95} />
      </mesh>
      {/* объём здания, чтобы давать тень */}
      <mesh position={[x + side * 6, 11, (z0 + z1) / 2]} receiveShadow>
        <boxGeometry args={[12, 22, len]} />
        <meshStandardMaterial color="#cdb88f" roughness={1} />
      </mesh>
      {/* карниз */}
      <mesh position={[x - side * 0.5, 22.3, (z0 + z1) / 2]}>
        <boxGeometry args={[1.4, 0.8, len]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.9} />
      </mesh>
      {/* первый этаж: магазины по порядку */}
      {Array.from({ length: nShops }, (_, i) => {
        const kind = shops[(i + (side > 0 ? 0 : 3)) % shops.length];
        return (
          <mesh key={i} position={[x - side * 0.02, 2.2, z0 + 3 + i * 6]} rotation={[0, (-side * Math.PI) / 2, 0]} receiveShadow>
            <planeGeometry args={[6, 4.4]} />
            <meshStandardMaterial map={shopTex(kind)} roughness={0.9} emissive="#ffe0a0" emissiveMap={shopTex(kind)} emissiveIntensity={0.0} />
          </mesh>
        );
      })}
    </group>
  );
};

const DEFAULT_SHOPS: ShopKind[] = ["apteka", "coffee", "prod", "water", "bread", "boarded", "barber", "tisha"];
export const Street: React.FC<StreetP> = React.memo(({ mood, shops = DEFAULT_SHOPS, z0 = -120, z1 = 40, leaves = 1, wreck = 1, cam }) => {
  const sky = useMemo(() => skyTex(mood), [mood]);
  const len = z1 - z0;
  const mid = (z0 + z1) / 2;
  const paving = useMemo(() => pavingTex().clone(), []);
  const asphalt = useMemo(() => asphaltTex().clone(), []);
  const near = (x: number, z: number, r: number) => !cam || Math.hypot(x - cam[0], z - cam[2]) > r;
  const trees = useMemo(
    () =>
      Array.from({ length: Math.floor(len / 11) }, (_, i) => ({ z: z0 + 5 + i * 11 + rnd(i) * 3, seed: i * 17 })),
    [len, z0],
  );
  const cars = useMemo(
    () => [
      { x: -2.6, z: -18, rot: 0.08, color: "#8c3a2f" },
      { x: 2.2, z: -34, rot: Math.PI - 0.1, color: "#3c4f6a" },
      { x: -1.2, z: -52, rot: 0.3, color: "#c9c4b4" },
      { x: 2.8, z: -70, rot: Math.PI + 0.05, color: "#4a5a42" },
      { x: -3, z: -88, rot: 0.12, color: "#7a7a80" },
    ],
    [],
  );
  return (
    <group>
      <color attach="background" args={[mood.sky[1]]} />
      <fog attach="fog" args={[mood.fog, mood.fogNear, mood.fogFar]} />
      {/* небо — большая инвертированная сфера */}
      <mesh position={[0, 0, mid]} scale={[1, 1, 1]}>
        <sphereGeometry args={[400, 16, 16]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>
      {/* земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, mid]} receiveShadow>
        <planeGeometry args={[40, len]} />
        <meshStandardMaterial map={asphalt} roughness={1} />
      </mesh>
      {([-1, 1] as const).map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 7, 0.05, mid]} receiveShadow>
          <planeGeometry args={[5, len]} />
          <meshStandardMaterial map={paving} roughness={0.95} />
        </mesh>
      ))}
      {([-1, 1] as const).map((s) => (
        <mesh key={`c${s}`} position={[s * 4.45, 0.09, mid]} receiveShadow castShadow>
          <boxGeometry args={[0.22, 0.2, len]} />
          <meshStandardMaterial color="#a8a39a" roughness={0.9} />
        </mesh>
      ))}
      {/* осевая разметка */}
      {Array.from({ length: Math.floor(len / 8) }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, z0 + 2 + i * 8]}>
          <planeGeometry args={[0.15, 3.5]} />
          <meshStandardMaterial color="#c8c3b2" roughness={1} />
        </mesh>
      ))}
      <Facade side={1} z0={z0} z1={z1} shops={shops} base="#d8c298" variant={1} />
      <Facade side={-1} z0={z0} z1={z1} shops={shops} base="#cdb589" variant={2} />
      {trees.map((t, i) => (
        <React.Fragment key={i}>
          {near(-4.9, t.z, 3.2) && <Tree x={-4.9} z={t.z} s={0.95 + rnd(t.seed) * 0.3} seed={t.seed} fall={leaves} />}
          {near(4.9, t.z + 5, 3.2) && <Tree x={4.9} z={t.z + 5} s={0.9 + rnd(t.seed + 1) * 0.3} seed={t.seed + 5} fall={leaves} />}
        </React.Fragment>
      ))}
      {trees.map((t, i) => (
        <React.Fragment key={`l${i}`}>
          {near(-4.5, t.z + 5.5, 1.4) && <Lamp x={-4.5} z={t.z + 5.5} />}
          {near(4.5, t.z + 11, 1.4) && <Lamp x={4.5} z={t.z + 11} flip />}
        </React.Fragment>
      ))}
      {wreck > 0.1 && cars.map((c, i) => <Car key={i} {...c} />)}
    </group>
  );
});
