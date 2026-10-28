import React, { useMemo } from "react";
import * as THREE from "three";
import { rnd } from "../after/util";
import { Car, skyTex, type Mood } from "../after/world";
import { asphaltT, concreteTex } from "../ny/tex";
import { M } from "../ny/props";
import { facadeTex, FLOORS, HERO_FLOOR } from "./tex";

export const FLOOR_H = 3.1;
export const BLD_W = 24;
export const BLD_D = 14;
export const BLD_H = FLOORS * FLOOR_H;

/** окно героя в мировых координатах (центр) */
export const heroWindow = new THREE.Vector3(-BLD_W / 2 + 4 * 2 + 2, HERO_FLOOR * FLOOR_H + 1.6, 0);

const Balconies: React.FC = () => {
  const mesh = useMemo(() => {
    const items: THREE.Matrix4[] = [];
    const rails: THREE.Matrix4[] = [];
    const m = new THREE.Matrix4();
    for (let f = 1; f < FLOORS; f++)
      for (const col of [1, 4]) {
        const x = -BLD_W / 2 + col * 4 + 2;
        const y = f * FLOOR_H + 0.35;
        items.push(m.clone().makeTranslation(x, y, 0.7));
        rails.push(m.clone().makeTranslation(x, y + 0.55, 1.33));
        rails.push(m.clone().makeTranslation(x - 1.57, y + 0.55, 0.7));
        rails.push(m.clone().makeTranslation(x + 1.57, y + 0.55, 0.7));
      }
    const slab = new THREE.InstancedMesh(new THREE.BoxGeometry(3.2, 0.16, 1.4), new THREE.MeshStandardMaterial({ color: "#b4b0a6", roughness: 0.9 }), items.length);
    items.forEach((mm, i) => slab.setMatrixAt(i, mm));
    slab.castShadow = true;
    slab.receiveShadow = true;
    const front = new THREE.InstancedMesh(new THREE.BoxGeometry(3.2, 1.0, 0.06), new THREE.MeshStandardMaterial({ color: "#4a4f58", roughness: 0.6, metalness: 0.3 }), rails.length / 3);
    const side = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 1.0, 1.4), new THREE.MeshStandardMaterial({ color: "#4a4f58", roughness: 0.6, metalness: 0.3 }), (rails.length / 3) * 2);
    let a = 0, b = 0;
    rails.forEach((mm, i) => (i % 3 === 0 ? front.setMatrixAt(a++, mm) : side.setMatrixAt(b++, mm)));
    front.castShadow = side.castShadow = true;
    const g = new THREE.Group();
    g.add(slab, front, side);
    return g;
  }, []);
  return <primitive object={mesh} />;
};

const Lamp: React.FC<{ x: number; on: number }> = ({ x, on }) => (
  <group position={[x, 0, 3.9]}>
    <mesh position={[0, 3, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.1, 6, 8]} />
      <M c="#22262c" m={0.5} r={0.6} />
    </mesh>
    <mesh position={[0, 6, 0.9]}>
      <boxGeometry args={[0.18, 0.1, 1.9]} />
      <M c="#22262c" m={0.5} />
    </mesh>
    <mesh position={[0, 5.9, 1.7]}>
      <boxGeometry args={[0.5, 0.12, 0.5]} />
      <meshStandardMaterial color="#ddd" emissive="#ffd6a0" emissiveIntensity={2.6 * on} />
    </mesh>
    {on > 0.02 && <pointLight position={[0, 5.6, 1.7]} color="#ffbd7a" intensity={38 * on} distance={16} decay={1.6} />}
  </group>
);

const BgBlock: React.FC<{ x: number; z: number; w: number; h: number; face: number }> = ({ x, z, w, h, face }) => {
  const tx = useMemo(() => {
    const t = facadeTex("bg", 99, false).clone();
    t.needsUpdate = true;
    return t;
  }, []);
  void face;
  return (
    <mesh position={[x, h / 2, z]} receiveShadow>
      <boxGeometry args={[w, h, 12]} />
      <meshStandardMaterial map={tx} color="#8a93a6" roughness={0.9} emissive="#fff" emissiveMap={tx} emissiveIntensity={0.05} />
    </mesh>
  );
};

/** многоквартирный дом: 14 этажей, фасад + боковая стена + вход + балконы; t — секунды сюжета */
export const Building: React.FC<{ t: number; heroLit: boolean }> = ({ t, heroLit }) => {
  const tq = t < 3.5 ? Math.round(t * 12) / 12 : 99;
  const front = facadeTex("front", tq, heroLit);
  const side = facadeTex("side", tq, false);
  const lobby = t < 2.7 ? 1 : Math.max(0.12, 1 - (t - 2.7) * 3);
  const conc = useMemo(() => { const x = concreteTex("#7e7b75").clone(); x.repeat.set(3, 6); x.needsUpdate = true; return x; }, []);
  return (
    <group>
      {/* объём */}
      <mesh position={[0, BLD_H / 2, -BLD_D / 2]} castShadow receiveShadow>
        <boxGeometry args={[BLD_W, BLD_H, BLD_D]} />
        <meshStandardMaterial map={conc} roughness={0.95} />
      </mesh>
      {/* фасад */}
      <mesh position={[0, BLD_H / 2, 0.02]}>
        <planeGeometry args={[BLD_W, BLD_H]} />
        <meshStandardMaterial map={front} roughness={0.7} emissive="#fff" emissiveMap={front} emissiveIntensity={0.9} />
      </mesh>
      {/* боковая стена */}
      <mesh position={[BLD_W / 2 + 0.02, BLD_H / 2, -BLD_D / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[BLD_D, BLD_H]} />
        <meshStandardMaterial map={side} roughness={0.7} emissive="#fff" emissiveMap={side} emissiveIntensity={0.9} />
      </mesh>
      {/* карниз и крыша */}
      <mesh position={[0, BLD_H + 0.3, -BLD_D / 2 + 0.3]} castShadow>
        <boxGeometry args={[BLD_W + 1, 0.6, BLD_D + 1]} />
        <meshStandardMaterial color="#6a6862" roughness={0.9} />
      </mesh>
      {[[-6, 1.2], [3, 1.6], [8, 1]].map(([x, h], i) => (
        <mesh key={i} position={[x, BLD_H + 0.6 + h / 2, -5 - i * 2]} castShadow>
          <boxGeometry args={[3, h, 2.5]} />
          <meshStandardMaterial color="#8c9096" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      <Balconies />
      {/* входная группа: козырёк, стеклянная дверь с тёплым светом холла */}
      <mesh position={[2, 2.95, 1.1]} castShadow>
        <boxGeometry args={[4.6, 0.18, 2.4]} />
        <meshStandardMaterial color="#4a4f58" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[2, 1.35, 0.06]}>
        <planeGeometry args={[3.2, 2.5]} />
        <meshStandardMaterial color="#20262e" emissive="#ffcf8a" emissiveIntensity={1.6 * lobby} roughness={0.2} metalness={0.2} />
      </mesh>
      {[0.45, 3.55].map((x) => (
        <mesh key={x} position={[x, 1.4, 0.7]} castShadow>
          <boxGeometry args={[0.18, 2.8, 0.18]} />
          <meshStandardMaterial color="#4a4f58" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {lobby > 0.2 && <pointLight position={[2, 1.8, 1.6]} color="#ffc98a" intensity={14 * lobby} distance={9} decay={1.7} />}
      {/* ступени */}
      <mesh position={[2, 0.08, 1.5]} receiveShadow>
        <boxGeometry args={[4.2, 0.16, 1.6]} />
        <meshStandardMaterial color="#9a978f" roughness={0.9} />
      </mesh>
    </group>
  );
};

/** улица: небо, асфальт, тротуары, фонари, машины, соседние дома */
export const StreetBlock: React.FC<{ mood: Mood; t: number; cam: [number, number, number] }> = ({ mood, t, cam }) => {
  const sky = useMemo(() => skyTex(mood), [mood]);
  const asphalt = useMemo(() => { const x = asphaltT().clone(); x.repeat.set(10, 2); x.needsUpdate = true; return x; }, []);
  const walk = useMemo(() => { const x = concreteTex("#9a9790").clone(); x.repeat.set(20, 1); x.needsUpdate = true; return x; }, []);
  const lampOn = t < 2.9 ? 1 : Math.max(0, 1 - (t - 2.9) / 0.5);
  const cars: [number, number, number, string][] = [[-14, 5.4, Math.PI / 2, "#2b3a4d"], [-6.5, 5.4, Math.PI / 2, "#5a2f2a"], [8, 5.4, Math.PI / 2, "#3a3f46"], [20, 5.4, Math.PI / 2, "#b9bcc2"], [30, 5.4, Math.PI / 2, "#2f4a3a"]];
  return (
    <group>
      <color attach="background" args={[mood.sky[1]]} />
      <fog attach="fog" args={[mood.fog, mood.fogNear, mood.fogFar]} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[600, 20, 14]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>
      {/* земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0, 12]} receiveShadow>
        <planeGeometry args={[200, 22]} />
        <meshStandardMaterial map={asphalt} roughness={0.55} metalness={0.12} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.07, 1.6]} receiveShadow>
        <planeGeometry args={[200, 3.2]} />
        <meshStandardMaterial map={walk} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.07, 18]} receiveShadow>
        <planeGeometry args={[200, 5]} />
        <meshStandardMaterial map={walk} roughness={0.9} />
      </mesh>
      <mesh position={[10, 0.09, 3.3]} receiveShadow>
        <boxGeometry args={[200, 0.18, 0.25]} />
        <meshStandardMaterial color="#8d8a84" roughness={0.9} />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-40 + i * 8, 0.02, 9.2]}>
          <planeGeometry args={[3.2, 0.18]} />
          <meshStandardMaterial color="#c9c5b4" roughness={1} />
        </mesh>
      ))}
      <Building t={t} heroLit={t < 4.35} />
      {/* соседние дома и дальние кварталы */}
      <BgBlock x={-30} z={-8} w={26} h={38} face={3} />
      <BgBlock x={30} z={-10} w={24} h={30} face={3} />
      <BgBlock x={-62} z={-12} w={30} h={46} face={3} />
      <BgBlock x={64} z={-14} w={30} h={42} face={3} />
      <BgBlock x={-20} z={-70} w={34} h={60} face={3} />
      <BgBlock x={25} z={-85} w={36} h={70} face={3} />
      <BgBlock x={85} z={-60} w={30} h={55} face={3} />
      {/* фонари и машины */}
      {[-8, 5, 18, 31].map((x) => <Lamp key={x} x={x} on={lampOn} />)}
      {cars.filter((c) => Math.hypot(c[0] - cam[0], c[1] - cam[2]) > 3).map((c, i) => <Car key={i} x={c[0]} z={c[1]} rot={c[2]} color={c[3]} />)}
      {/* живая изгородь на дальнем тротуаре */}
      <mesh position={[10, 0.5, 20]} castShadow>
        <boxGeometry args={[120, 1, 0.8]} />
        <meshStandardMaterial color="#1f3a2a" roughness={1} />
      </mesh>
      {rnd(1) > 2 && null}
    </group>
  );
};
