import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { clone as skClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { assets } from "./assets";
import type { Library } from "./anim";

export type Outfit = {
  skin?: string;
  shirt?: string;
  shirt2?: string;
  pants?: string;
  shoes?: string;
  hair?: string;
  /** граница рукава по X в позе привязки (м): 0.25 — футболка, 0.7 — длинный */
  sleeve?: number;
  /** высота шорт (м от пола): 0 — длинные штаны */
  shorts?: number;
  /** 0..1 — степень «зомби»: бледность, грязь, кровь */
  zombie?: number;
  /** полоски/клетка на рубашке 0..1 */
  stripe?: number;
};

export type Pose = { clip: string; time: number; weight?: number; loop?: boolean }[];
export type Bones = Record<string, THREE.Object3D>;

const GROUPS: Record<string, number> = {
  spine_01: 0, spine_02: 0, spine_03: 0, clavicle_l: 0, clavicle_r: 0,
  upperarm_l: 1, upperarm_r: 1, lowerarm_l: 1, lowerarm_r: 1,
  pelvis: 2, thigh_l: 2, thigh_r: 2, calf_l: 2, calf_r: 2,
  foot_l: 3, foot_r: 3, ball_l: 3, ball_r: 3,
};

const zoned = new WeakSet<THREE.BufferGeometry>();
const prepareZones = (mesh: THREE.SkinnedMesh) => {
  const g = mesh.geometry;
  if (zoned.has(g)) return;
  zoned.add(g);
  const si = g.getAttribute("skinIndex");
  const sw = g.getAttribute("skinWeight");
  const n = g.getAttribute("position").count;
  const zone = new Float32Array(n * 4);
  const names = mesh.skeleton.bones.map((b) => b.name);
  for (let v = 0; v < n; v++) {
    for (let k = 0; k < 4; k++) {
      const w = sw.getComponent(v, k);
      const grp = GROUPS[names[si.getComponent(v, k)]];
      if (w > 0 && grp !== undefined) zone[v * 4 + grp] += w;
    }
  }
  g.setAttribute("zoneA", new THREE.BufferAttribute(zone, 4));
};

const bodyMaterial = (base: THREE.Material, o: Required<Outfit>) => {
  const m = (base as THREE.MeshStandardMaterial).clone();
  m.roughness = 0.82;
  m.metalness = 0;
  const u = {
    uSkin: { value: new THREE.Color(o.skin) },
    uShirt: { value: new THREE.Color(o.shirt) },
    uShirt2: { value: new THREE.Color(o.shirt2) },
    uPants: { value: new THREE.Color(o.pants) },
    uShoes: { value: new THREE.Color(o.shoes) },
    uSleeve: { value: o.sleeve },
    uShorts: { value: o.shorts },
    uZombie: { value: o.zombie },
    uStripe: { value: o.stripe },
  };
  m.userData.u = u;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute vec4 zoneA; varying vec4 vZone; varying vec3 vBind;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvZone = zoneA; vBind = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec4 vZone; varying vec3 vBind;
uniform vec3 uSkin, uShirt, uShirt2, uPants, uShoes; uniform float uSleeve, uShorts, uZombie, uStripe;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
{
  vec3 skin = diffuseColor.rgb * uSkin;
  float z = uZombie;
  skin = mix(skin, vec3(dot(skin, vec3(0.33))) * vec3(0.78,0.95,0.72), z);
  float fab = 0.9 + 0.2 * vn(vBind.xy * 60.0 + vBind.z * 30.0);
  vec3 shirt = mix(uShirt, uShirt2, step(0.5, fract(vBind.y * 14.0)) * uStripe) * fab;
  vec3 pants = uPants * (0.9 + 0.2 * vn(vBind.xy * 90.0));
  float mTorso = smoothstep(0.46, 0.56, vZone.x);
  float mArm = smoothstep(0.46, 0.56, vZone.y) * (1.0 - smoothstep(uSleeve - 0.03, uSleeve + 0.01, abs(vBind.x)));
  float mShirt = max(mTorso, mArm);
  float mPants = smoothstep(0.5, 0.6, vZone.z) * (uShorts < 0.01 ? 1.0 : smoothstep(uShorts - 0.01, uShorts + 0.01, vBind.y));
  float mShoe = smoothstep(0.5, 0.6, vZone.w);
  vec3 col = skin;
  col = mix(col, shirt, mShirt);
  col = mix(col, pants, mPants * (1.0 - mTorso * 0.0));
  col = mix(col, uShoes, mShoe);
  // зомби: грязь и кровь по ткани и коже
  float dirt = vn(vBind.xy * 18.0 + 3.0);
  float blood = smoothstep(0.66, 0.72, vn(vBind.xz * 9.0 + vBind.y * 5.0));
  col *= 1.0 - z * 0.38 * dirt;
  col = mix(col, vec3(0.30, 0.03, 0.03), z * blood * 0.85);
  diffuseColor.rgb = col;
}`,
      );
  };
  m.customProgramCacheKey = () => "afterbody";
  return m;
};

const DEFAULT: Required<Outfit> = { skin: "#ffffff", shirt: "#6b7f9a", shirt2: "#cfd6e0", pants: "#2c3a56", shoes: "#2a2a2a", hair: "#3a2a1f", sleeve: 0.3, shorts: 0, zombie: 0, stripe: 0 };

export const Person: React.FC<{
  kind: "male" | "female";
  lib?: Library;
  pose: Pose;
  outfit?: Outfit;
  position?: [number, number, number];
  rotY?: number;
  scale?: number;
  mod?: (b: Bones) => void;
  hideHair?: boolean;
}> = ({ kind, lib: libIn, pose, outfit, position = [0, 0, 0], rotY = 0, scale = 1, mod, hideHair }) => {
  const gltf = assets[kind]!;
  const lib = libIn ?? assets.lib!;
  const o = { ...DEFAULT, ...outfit } as Required<Outfit>;
  const rig = useMemo(() => {
    const root = skClone(gltf.scene) as THREE.Group;
    const bones: Bones = {};
    root.traverse((c) => {
      const mesh = c as THREE.SkinnedMesh;
      if ((c as THREE.Bone).isBone) bones[c.name] = c;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (/Hair|Eyebrow/i.test(mat.name) || /Face$|Eyebrows/i.test(mesh.name)) {
          const hm = mat.clone();
          hm.alphaTest = 0.45;
          hm.transparent = false;
          hm.side = THREE.DoubleSide;
          hm.color = new THREE.Color(o.hair);
          mesh.material = hm;
          mesh.userData.hair = true;
        } else if (/Superhero/i.test(mat.name)) {
          prepareZones(mesh);
          mesh.material = bodyMaterial(mat, o);
        }
      }
    });
    const mixer = new THREE.AnimationMixer(root);
    const actions = new Map<string, THREE.AnimationAction>();
    return { root, bones, mixer, actions };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf, kind]);

  useLayoutEffect(() => {
    // цвета меняются между кадрами (одежда одного персонажа — постоянна, но компонент общий)
    rig.root.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mesh.userData.hair) {
        mat.color.set(o.hair);
        mesh.visible = !hideHair;
      }
      const u = mat.userData?.u;
      if (u) {
        u.uSkin.value.set(o.skin);
        u.uShirt.value.set(o.shirt);
        u.uShirt2.value.set(o.shirt2);
        u.uPants.value.set(o.pants);
        u.uShoes.value.set(o.shoes);
        u.uSleeve.value = o.sleeve;
        u.uShorts.value = o.shorts;
        u.uZombie.value = o.zombie;
        u.uStripe.value = o.stripe;
      }
    });
    // позы
    const total = pose.reduce((s, p) => s + (p.weight ?? 1), 0) || 1;
    const seen = new Set<string>();
    pose.forEach((p) => {
      const clip = lib[p.clip];
      if (!clip) return;
      let act = rig.actions.get(p.clip);
      if (!act) {
        act = rig.mixer.clipAction(clip);
        rig.actions.set(p.clip, act);
      }
      const loop = p.loop !== false;
      act.enabled = true;
      act.play();
      act.paused = true;
      act.time = loop ? ((p.time % clip.duration) + clip.duration) % clip.duration : Math.min(Math.max(p.time, 0), clip.duration - 1e-3);
      act.weight = (p.weight ?? 1) / total;
      seen.add(p.clip);
    });
    rig.actions.forEach((a, k) => {
      if (!seen.has(k)) a.weight = 0;
    });
    rig.mixer.update(0);
    mod?.(rig.bones);
    rig.root.updateMatrixWorld(true);
  });

  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale}>
      <primitive object={rig.root} />
    </group>
  );
};
