import * as THREE from "three";
import type { Outfit, Bones } from "./people";
import { rnd, cl, lerp, eio } from "./util";

export type V3 = [number, number, number];
export const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const mv = (a: V3, b: V3, s: number, d: number): V3 => mix3(a, b, eio(cl(s / d)));
export const lin = (a: V3, b: V3, s: number, d: number): V3 => mix3(a, b, cl(s / d));
export const faceTo = (from: V3, to: V3) => Math.atan2(to[0] - from[0], to[2] - from[2]);

export const SKIN = ["#f2d6c0", "#e3b898", "#c99a74", "#a8744f", "#7d5136"];
const SH = ["#6b7f9a", "#9a4a3c", "#4a6a4a", "#c9b27a", "#5a5a66", "#7a4a7a", "#3a5a7a", "#b86a3a", "#8a8a7a"];
const PA = ["#2c3a56", "#3a3430", "#4a4a52", "#5a4a38", "#222a33", "#6a6a5a"];
const HA = ["#1d1612", "#3a2a1f", "#6a4a2a", "#a07a44", "#2a2a2e", "#7a3a22"];

export type Act = {
  id: string;
  kind: "male" | "female";
  outfit: Outfit;
  pos: V3;
  rotY: number;
  pose: { clip: string; time: number; weight?: number; loop?: boolean }[];
  scale?: number;
  mod?: (b: Bones) => void;
  hideHair?: boolean;
};

export const npcOutfit = (i: number, z = 0): Outfit => ({
  skin: SKIN[Math.floor(rnd(i * 3 + 1) * SKIN.length)],
  shirt: SH[Math.floor(rnd(i * 5 + 2) * SH.length)],
  shirt2: "#e6e2d6",
  stripe: rnd(i * 7) > 0.8 ? 0.8 : 0,
  pants: PA[Math.floor(rnd(i * 11 + 3) * PA.length)],
  shoes: "#2a2622",
  hair: HA[Math.floor(rnd(i * 13 + 4) * HA.length)],
  sleeve: rnd(i * 17) > 0.5 ? 0.7 : 0.28,
  zombie: z,
});
export const kindOf = (i: number): "male" | "female" => (rnd(i * 19 + 5) > 0.5 ? "male" : "female");

export const ZOMBIE = (i: number): Outfit => ({ ...npcOutfit(i + 100, 0.9), shirt: ["#4a5a3a", "#5a4a40", "#3a4452", "#6a5a44"][i % 4], pants: ["#3a3030", "#2c3038", "#4a443a"][i % 3], shoes: "#1b1a18", sleeve: 0.7 });

/* ───── мод костей ───── */
const q = new THREE.Quaternion();
const e = new THREE.Euler();
const addRot = (b: THREE.Object3D | undefined, x: number, y: number, z: number) => {
  if (!b) return;
  e.set(x, y, z);
  q.setFromEuler(e);
  b.quaternion.premultiply(q);
};
export const headTurn = (b: Bones, yaw: number, pitch = 0, roll = 0) => {
  addRot(b.neck_01, pitch * 0.4, yaw * 0.4, roll * 0.4);
  addRot(b.Head ?? b.head, pitch * 0.6, yaw * 0.6, roll * 0.6);
};
export const shake = (b: Bones, t: number, amp: number) => {
  addRot(b.spine_02, Math.sin(t * 38) * amp, 0, Math.sin(t * 31) * amp * 0.5);
  addRot(b.spine_03, Math.sin(t * 41) * amp * 0.5, 0, 0);
};

/** прикрепить меш к кости один раз */
export const attach = (b: Bones, bone: string, key: string, make: () => THREE.Object3D) => {
  const host = b[bone];
  if (!host) return;
  if (host.getObjectByName(key)) return;
  const o = make();
  o.name = key;
  host.add(o);
};

const std = (color: string, r = 0.85) => new THREE.MeshStandardMaterial({ color, roughness: r });
export const bagMesh = () => {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.14), std("#d8791f"));
  m.castShadow = true;
  g.add(m);
  return g;
};
export const pizzaBoxMesh = () => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.36), std("#d8b88a"));
  m.castShadow = true;
  return m;
};
