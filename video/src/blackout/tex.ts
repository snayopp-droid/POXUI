import * as THREE from "three";
import { rnd } from "../after/util";
import { cv, mkTex, once } from "../ny/tex";

export const FLOORS = 14;
export const COLS_FRONT = 6;
export const COLS_SIDE = 3;
/** окно квартиры героя: этаж и колонка на фасаде */
export const HERO_FLOOR = 7;
export const HERO_COL = 2;

/** во сколько секунд гаснет окно (сверху вниз по этажам, с детерминированным разбросом) */
export const offTime = (face: number, f: number, c: number) => 1.5 + ((FLOORS - 1 - f) / FLOORS) * 1.35 + rnd(face * 977 + f * 31 + c * 7) * 0.3;
export const isLitBase = (face: number, f: number, c: number) => rnd(face * 131 + f * 17 + c * 5 + 3) < 0.8;

/** текстура фасада; tq — квантованное время, чтобы переиспользовать текстуры */
export const facadeTex = (face: "front" | "side" | "bg", tq: number, heroLit: boolean) =>
  once(`fac|${face}|${tq.toFixed(2)}|${heroLit}`, () => {
    const cols = face === "front" ? COLS_FRONT : face === "side" ? COLS_SIDE : 5;
    const fi = face === "front" ? 1 : face === "side" ? 2 : 3;
    const c = cv(cols * 100, FLOORS * 100);
    const g = c.getContext("2d")!;
    g.fillStyle = face === "front" ? "#8e8a82" : face === "side" ? "#7d7a74" : "#6d6a72";
    g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,255,255" : "0,0,0"},${rnd(i * 3) * 0.05})`;
      g.fillRect(rnd(i * 5) * c.width, rnd(i * 7) * c.height, 2 + rnd(i * 2) * 16, 2 + rnd(i * 4) * 10);
    }
    for (let f = 0; f < FLOORS; f++) {
      const y = (FLOORS - 1 - f) * 100;
      g.fillStyle = "rgba(0,0,0,0.22)";
      g.fillRect(0, y + 96, c.width, 4);
      for (let k = 0; k < cols; k++) {
        const x = k * 100;
        const hero = face === "front" && f === HERO_FLOOR && k === HERO_COL;
        let lit = isLitBase(fi, f, k) && tq < offTime(fi, f, k);
        if (hero) lit = heroLit;
        // проём (углубление)
        g.fillStyle = "#23262c";
        g.fillRect(x + 12, y + 14, 76, 74);
        // стекло
        const gr = g.createLinearGradient(0, y + 18, 0, y + 84);
        if (lit) {
          const warm = rnd(fi * 53 + f * 7 + k) > 0.22;
          gr.addColorStop(0, warm ? "#ffe3a8" : "#cfe0ff");
          gr.addColorStop(1, warm ? "#ffb35a" : "#9fbbe8");
        } else {
          gr.addColorStop(0, "#2a3750");
          gr.addColorStop(1, "#141b29");
        }
        g.fillStyle = gr;
        g.fillRect(x + 17, y + 19, 66, 64);
        // импост
        g.fillStyle = lit ? "rgba(90,60,30,0.55)" : "#0d121c";
        g.fillRect(x + 48, y + 19, 4, 64);
        g.fillRect(x + 17, y + 48, 66, 3);
        // светлый подоконник
        g.fillStyle = "#b9b5ac";
        g.fillRect(x + 10, y + 86, 80, 5);
      }
    }
    // вертикальные пилястры
    g.fillStyle = "rgba(255,255,255,0.08)";
    for (let k = 0; k <= cols; k++) g.fillRect(k * 100 - 3, 0, 6, c.height);
    const t = mkTex(c, 1, 1);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  });

/** далёкий дом за окном квартиры: тёмный фасад с редкими окнами */
export const neighborTex = (lit: number) =>
  once(`nb|${lit}`, () => {
    const c = cv(512, 384);
    const g = c.getContext("2d")!;
    const sky = g.createLinearGradient(0, 0, 0, 384);
    sky.addColorStop(0, "#162038");
    sky.addColorStop(1, "#33405e");
    g.fillStyle = sky;
    g.fillRect(0, 0, 512, 384);
    g.fillStyle = "#1b2231";
    g.fillRect(0, 50, 512, 334);
    for (let r = 0; r < 12; r++)
      for (let k = 0; k < 14; k++) {
        const on = rnd(r * 19 + k * 7) < lit;
        g.fillStyle = on ? "#ffcf86" : "#202a3c";
        g.fillRect(14 + k * 35, 66 + r * 26, 22, 16);
      }
    g.fillStyle = "rgba(160,190,255,0.08)";
    g.fillRect(0, 50, 512, 6);
    return mkTex(c, 1, 1);
  });
