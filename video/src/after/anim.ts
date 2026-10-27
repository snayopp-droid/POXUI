import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { staticFile } from "remotion";

/**
 * Библиотека анимаций Quaternius (CC0): UAL1 (кости DEF-*) и UAL2 (кости UE) → одна скелетная схема UE.
 * Позы одинаковые в покое, поэтому достаточно переименовать треки.
 */
const san = (n: string) => THREE.PropertyBinding.sanitizeNodeName(n);

const ue1 = (raw: string): string | null => {
  const m = raw.match(/^DEF-(.+?)(?:\.(L|R))?$/);
  if (raw === "root") return "root";
  if (!m) return null;
  const side = m[2] ? "_" + m[2].toLowerCase() : "";
  const n = m[1];
  const fixed: Record<string, string> = { hips: "pelvis", "spine.001": "spine_01", "spine.002": "spine_02", "spine.003": "spine_03", neck: "neck_01", head: "Head", shoulder: "clavicle", upper_arm: "upperarm", forearm: "lowerarm", hand: "hand", thigh: "thigh", shin: "calf", foot: "foot", toe: "ball" };
  if (fixed[n]) return fixed[n] + side;
  const f = n.match(/^(?:f_)?(index|middle|pinky|ring|thumb)\.0(\d)$/);
  if (f) return `${f[1]}_0${f[2]}${side}`;
  return null;
};

export type Library = Record<string, THREE.AnimationClip>;

const retarget = (clip: THREE.AnimationClip, rename: (raw: string) => string | null, scalePelvis: number, rawNames: string[]): THREE.AnimationClip => {
  const map = new Map<string, string>();
  rawNames.forEach((r) => {
    const u = rename(r);
    if (u) map.set(san(r), san(u));
  });
  const tracks: THREE.KeyframeTrack[] = [];
  clip.tracks.forEach((tr) => {
    const dot = tr.name.lastIndexOf(".");
    const node = tr.name.slice(0, dot);
    const prop = tr.name.slice(dot + 1);
    const target = map.get(node);
    if (!target) return;
    if (prop === "scale") return;
    if (prop === "position" && target !== san("pelvis") && target !== "root") return;
    const t = tr.clone();
    t.name = `${target}.${prop}`;
    if (prop === "position" && target === san("pelvis")) {
      const v = t.values as unknown as Float32Array;
      for (let i = 0; i < v.length; i++) v[i] *= scalePelvis;
    }
    tracks.push(t);
  });
  const out = new THREE.AnimationClip(clip.name, clip.duration, tracks);
  return out;
};

let promise: Promise<Library> | null = null;
export const loadLibrary = (): Promise<Library> => {
  if (promise) return promise;
  const loader = new GLTFLoader();
  const load = (u: string) => new Promise<{ animations: THREE.AnimationClip[]; scene: THREE.Group }>((res, rej) => loader.load(staticFile(u), (g) => res(g), undefined, rej));
  promise = Promise.all([load("after/anim/ual1.glb"), load("after/anim/ual2.glb")]).then(([a, b]) => {
    const lib: Library = {};
    const names = (g: { scene: THREE.Group }) => {
      const out: string[] = [];
      g.scene.traverse((o) => out.push(o.name));
      return out;
    };
    // имена костей: у UAL1 они "DEF-..." с точками — берём исходные из gltf-узлов
    const raw1: string[] = [];
    a.scene.traverse((o) => raw1.push(o.name));
    void names;
    const ual1Raw = rawBoneNames;
    a.animations.forEach((c) => {
      lib[c.name] = retarget(c, ue1, 1.035, ual1Raw);
    });
    b.animations.forEach((c) => {
      if (!lib[c.name]) lib[c.name] = c;
    });
    return lib;
  });
  return promise;
};

/** исходные имена костей UAL1 (с точками); GLTFLoader их санирует, поэтому храним список здесь */
export const rawBoneNames: string[] = (() => {
  const out = ["root", "DEF-hips", "DEF-spine.001", "DEF-spine.002", "DEF-spine.003", "DEF-neck", "DEF-head"];
  for (const s of ["L", "R"]) {
    out.push(`DEF-shoulder.${s}`, `DEF-upper_arm.${s}`, `DEF-forearm.${s}`, `DEF-hand.${s}`, `DEF-thigh.${s}`, `DEF-shin.${s}`, `DEF-foot.${s}`, `DEF-toe.${s}`);
    for (const f of ["index", "middle", "pinky", "ring"]) for (const k of [1, 2, 3]) out.push(`DEF-f_${f}.0${k}.${s}`);
    for (const k of [1, 2, 3]) out.push(`DEF-thumb.0${k}.${s}`);
  }
  return out;
})();
