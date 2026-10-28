import * as THREE from "three";
import { rnd } from "../after/util";

export const cv = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
export const mkTex = (c: HTMLCanvasElement, rx = 1, ry = 1, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
const cache: Record<string, THREE.Texture> = {};
export const once = (k: string, f: () => THREE.Texture) => (cache[k] ??= f());

/** вывеска/табличка с текстом */
export const signTex = (text: string, bg = "#14181c", fg = "#fff", font = "800 120px Inter, sans-serif", w = 1024, h = 256, sub?: string) =>
  once(`sign|${text}|${bg}|${fg}|${sub ?? ""}`, () => {
    const c = cv(w, h);
    const g = c.getContext("2d")!;
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.fillStyle = fg;
    g.font = font;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, w / 2, sub ? h * 0.38 : h / 2);
    if (sub) {
      g.font = "600 52px Inter, sans-serif";
      g.fillText(sub, w / 2, h * 0.78);
    }
    return mkTex(c);
  });

/** обои */
export const wallpaperTex = (base = "#b7a58a", stripe = "#c4b399") =>
  once(`wall|${base}`, () => {
    const c = cv(256, 256);
    const g = c.getContext("2d")!;
    g.fillStyle = base;
    g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 32) {
      g.fillStyle = stripe;
      g.fillRect(x, 0, 14, 256);
    }
    for (let i = 0; i < 600; i++) {
      g.fillStyle = `rgba(60,40,20,${rnd(i) * 0.06})`;
      g.fillRect(rnd(i * 3) * 256, rnd(i * 5) * 256, 2 + rnd(i) * 10, 2 + rnd(i * 2) * 10);
    }
    return mkTex(c, 3, 2);
  });

export const parquetTex = (base = "#8a5a35") =>
  once(`parquet|${base}`, () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) {
        const k = rnd(x * 9 + y * 17);
        g.fillStyle = `hsl(${24 + k * 8},${42 + k * 10}%,${28 + k * 14}%)`;
        g.fillRect(x * 64 + 1, y * 64 + 1, 62, 62);
        g.strokeStyle = "rgba(0,0,0,0.25)";
        for (let l = 0; l < 4; l++) {
          g.beginPath();
          g.moveTo(x * 64, y * 64 + l * 16 + 8);
          g.lineTo(x * 64 + 64, y * 64 + l * 16 + 8);
          g.stroke();
        }
      }
    return mkTex(c, 3, 3);
  });

export const concreteTex = (base = "#8c8b86") =>
  once(`conc|${base}`, () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2400; i++) {
      g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,255,255" : "0,0,0"},${rnd(i * 3) * 0.08})`;
      g.fillRect(rnd(i * 5) * 512, rnd(i * 7) * 512, 1 + rnd(i * 2) * 6, 1 + rnd(i * 4) * 6);
    }
    return mkTex(c, 4, 4);
  });

export const tileTex = (a = "#d9dcd2", b = "#2f6b52") =>
  once(`tile|${a}`, () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = "#9aa095";
    g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        g.fillStyle = y === 0 || y === 15 ? b : a;
        g.fillRect(x * 32 + 1, y * 32 + 1, 30, 30);
        g.fillStyle = "rgba(0,0,0,0.05)";
        g.fillRect(x * 32 + 1, y * 32 + 18, 30, 12);
      }
    return mkTex(c, 4, 2);
  });

/** фасад небоскрёба: сетка окон, glow = ночная подсветка */
export const towerTex = (seed: number, tone = "#4b5563", night = false) =>
  once(`tower|${seed}|${tone}|${night}`, () => {
    const c = cv(256, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = tone;
    g.fillRect(0, 0, 256, 512);
    for (let r = 0; r < 32; r++)
      for (let k = 0; k < 8; k++) {
        const lit = rnd(seed * 31 + r * 7 + k * 3) > (night ? 0.45 : 0.9);
        g.fillStyle = lit ? (rnd(r + k) > 0.5 ? "#ffd89a" : "#fff2cf") : night ? "#10151f" : rnd(r * 3 + k) > 0.5 ? "#6d8197" : "#52687d";
        g.fillRect(k * 32 + 4, r * 16 + 3, 24, 11);
      }
    for (let x = 0; x < 256; x += 32) {
      g.fillStyle = "rgba(0,0,0,0.25)";
      g.fillRect(x, 0, 2, 512);
    }
    return mkTex(c, 1, 1);
  });

export const asphaltT = () =>
  once("asph2", () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = "#2c2e32";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = `rgba(${rnd(i) > 0.5 ? "200,200,200" : "0,0,0"},${rnd(i * 3) * 0.1})`;
      g.fillRect(rnd(i * 5) * 512, rnd(i * 7) * 512, 1 + rnd(i * 2) * 3, 1 + rnd(i * 4) * 3);
    }
    for (let i = 0; i < 14; i++) {
      g.strokeStyle = "rgba(0,0,0,0.5)";
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(rnd(i) * 512, rnd(i * 3) * 512);
      g.lineTo(rnd(i * 5) * 512, rnd(i * 7) * 512);
      g.stroke();
    }
    return mkTex(c, 8, 20);
  });

export const brownstoneTex = (seed: number, base = "#6b4535") =>
  once(`brs|${seed}|${base}`, () => {
    const c = cv(256, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = base;
    g.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 700; i++) {
      g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,220,180" : "0,0,0"},${rnd(i * 3) * 0.07})`;
      g.fillRect(rnd(i * 5) * 256, rnd(i * 7) * 512, 3 + rnd(i * 2) * 14, 2 + rnd(i * 4) * 6);
    }
    for (let r = 0; r < 4; r++)
      for (let k = 0; k < 3; k++) {
        const x = 24 + k * 78, y = 30 + r * 118;
        g.fillStyle = "#e8dcc8";
        g.fillRect(x - 5, y - 5, 54, 84);
        g.fillStyle = rnd(seed + r * 5 + k * 3) > 0.55 ? "#f2c77a" : "#1c2530";
        g.fillRect(x, y, 44, 74);
        g.fillStyle = "rgba(255,255,255,0.2)";
        g.fillRect(x + 21, y, 3, 74);
        g.fillRect(x, y + 36, 44, 3);
      }
    return mkTex(c, 1, 1);
  });

export const brickTexNY = (tone = "#7b3f2e") =>
  once(`brickny|${tone}`, () => {
    const c = cv(512, 512);
    const g = c.getContext("2d")!;
    g.fillStyle = "#3a2a24";
    g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 8; x++) {
        const k = rnd(x * 7 + y * 13);
        const o = y % 2 ? 32 : 0;
        g.fillStyle = `rgb(${110 + k * 50},${54 + k * 22},${42 + k * 16})`;
        g.fillRect(x * 64 + o + 2, y * 32 + 2, 60, 28);
      }
    return mkTex(c, 2, 2);
  });

/** закатный фасад: тёмный сине-фиолетовый с редкими тёплыми окнами и градиентом дымки */
export const duskTowerTex = (seed: number, lit = 0.16) =>
  once(`dusk|${seed}|${lit}`, () => {
    const c = cv(128, 512);
    const g = c.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, "#2c2a46");
    gr.addColorStop(1, "#6a4f66");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 512);
    for (let r = 0; r < 64; r++)
      for (let k = 0; k < 6; k++) {
        const on = rnd(seed * 17 + r * 5 + k * 3) < lit;
        g.fillStyle = on ? (rnd(r + k) > 0.5 ? "#ffd28a" : "#ffe6b8") : `rgba(120,110,150,${0.18 + rnd(r * 3 + k) * 0.12})`;
        g.fillRect(k * 21 + 4, r * 8 + 2, 12, 4);
      }
    return mkTex(c, 1, 1);
  });
