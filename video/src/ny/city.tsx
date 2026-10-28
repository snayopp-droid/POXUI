import React, { useMemo } from "react";
import * as THREE from "three";
import { rnd } from "../after/util";
import { Car, Tree, skyTex, type Mood } from "../after/world";
import { cv, mkTex, once, signTex, towerTex, duskTowerTex, asphaltT, concreteTex, brownstoneTex } from "./tex";
import { Box, M } from "./props";

type V = [number, number, number];

const Sky: React.FC<{ mood: Mood; at?: V; r?: number }> = ({ mood, at = [0, 0, 0], r = 520 }) => {
  const sky = useMemo(() => skyTex(mood), [mood]);
  return (
    <>
      <color attach="background" args={[mood.sky[1]]} />
      <fog attach="fog" args={[mood.fog, mood.fogNear, mood.fogFar]} />
      <mesh position={at}>
        <sphereGeometry args={[r, 24, 16]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>
    </>
  );
};

const steamTex = () =>
  once("steam", () => {
    const c = cv(128, 128);
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, "rgba(255,255,255,0.9)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return mkTex(c);
  });

export const Steam: React.FC<{ p: V; t: number; s?: number }> = ({ p, t, s = 1 }) => (
  <group position={p}>
    <mesh position={[0, 0.9, 0]} castShadow>
      <cylinderGeometry args={[0.28, 0.4, 1.8, 12]} />
      <M c="#e4672a" r={0.7} />
    </mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const k = (t * 0.22 + i / 6) % 1;
      return (
        <sprite key={i} position={[Math.sin(i * 2 + t) * 0.3 * k, 2 + k * 7 * s, Math.cos(i * 3) * 0.3]} scale={[1.6 + k * 4, 1.6 + k * 4, 1]}>
          <spriteMaterial map={steamTex()} transparent opacity={0.5 * (1 - k)} depthWrite={false} color="#f4f2ee" />
        </sprite>
      );
    })}
  </group>
);

const SHOPS = [["DELI", "#1d5a2a", "#fff"], ["PIZZA", "#a3191f", "#ffe9a0"], ["PHARMACY", "#0c4a8a", "#fff"], ["BANK", "#222a35", "#d8c28a"], ["NAIL SPA", "#6b2f6a", "#ffd9ee"], ["BAR & GRILL", "#2a1c14", "#ffcf80"], ["COFFEE", "#3a2a1c", "#f2e6cd"], ["LAUNDRY", "#1a6a7a", "#fff"], ["SUSHI", "#14181c", "#ff6a5a"]];

/** авеню Манхэттена */
export const NYAvenue: React.FC<{ mood: Mood; night?: boolean; t?: number; z0?: number; z1?: number; cabs?: number; cam?: V }> = ({ mood, night, t = 0, z0 = -260, z1 = 60, cabs = 9, cam }) => {
  const mid = (z0 + z1) / 2, len = z1 - z0;
  const asphalt = useMemo(() => { const x = asphaltT().clone(); x.repeat.set(4, len / 12); x.needsUpdate = true; return x; }, [len]);
  const walk = useMemo(() => { const x = concreteTex("#a7a49c").clone(); x.repeat.set(2, len / 5); x.needsUpdate = true; return x; }, [len]);
  const blds = useMemo(() => {
    const out: { side: 1 | -1; z: number; w: number; h: number; seed: number; tone: string }[] = [];
    for (const side of [-1, 1] as const) {
      let z = z0;
      let i = 0;
      while (z < z1) {
        const w = 16 + rnd(i * 7 + side * 3) * 16;
        if (Math.abs(((z - z0) % 90) - 45) < 12) { z += 22; continue; }
        out.push({ side, z: z + w / 2, w, h: 38 + rnd(i * 13 + side) * 80, seed: i * 3 + (side > 0 ? 100 : 0), tone: ["#5b6270", "#6e6458", "#4e5a68", "#7a6a5a", "#59606a"][Math.floor(rnd(i * 5 + side) * 5)] });
        z += w + 0.4;
        i++;
      }
    }
    return out;
  }, [z0, z1]);
  const taxis = useMemo(() => Array.from({ length: cabs }, (_, i) => ({ x: (i % 4) * 3.2 - 5.6, z: z1 - 18 - i * 22 - rnd(i) * 8, rot: i % 2 ? Math.PI : 0, c: i % 3 === 2 ? "#2b2f38" : "#f2b705" })), [cabs, z1]);
  const nearC = (x: number, z: number, r: number) => !cam || Math.hypot(x - cam[0], z - cam[2]) > r;
  return (
    <group>
      <Sky mood={mood} at={[0, 0, mid]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, mid]} receiveShadow>
        <planeGeometry args={[18, len]} />
        <meshStandardMaterial map={asphalt} roughness={0.95} />
      </mesh>
      {([-1, 1] as const).map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 11.5, 0.06, mid]} receiveShadow>
          <planeGeometry args={[5, len]} />
          <meshStandardMaterial map={walk} roughness={0.9} />
        </mesh>
      ))}
      {/* разметка */}
      {Array.from({ length: Math.floor(len / 12) }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z0 + 3 + i * 12]}>
          <planeGeometry args={[0.2, 5]} />
          <meshStandardMaterial color="#d8b12a" roughness={1} />
        </mesh>
      ))}
      {/* зебры на перекрёстках */}
      {Array.from({ length: Math.floor(len / 90) + 1 }, (_, k) => z0 + 45 + k * 90).map((zc, k) =>
        Array.from({ length: 12 }, (_, i) => (
          <mesh key={`${k}-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-7.5 + i * 1.4, 0.025, zc - 12]}>
            <planeGeometry args={[0.7, 4]} />
            <meshStandardMaterial color="#e8e6e0" roughness={1} />
          </mesh>
        )),
      )}
      {/* здания */}
      {blds.map((b, i) => {
        const t2 = towerTex(b.seed % 7, b.tone, night);
        const tx = t2.clone();
        tx.repeat.set(b.w / 9, b.h / 18);
        tx.needsUpdate = true;
        const x = b.side * (14 + 9);
        return (
          <group key={i}>
            <mesh position={[x, b.h / 2, b.z]} receiveShadow>
              <boxGeometry args={[18, b.h, b.w]} />
              <meshStandardMaterial map={tx} roughness={0.8} emissive="#fff" emissiveMap={tx} emissiveIntensity={night ? 0.9 : 0.12} />
            </mesh>
            {/* витрины */}
            {Array.from({ length: Math.max(1, Math.floor(b.w / 6)) }, (_, k) => {
              const sh = SHOPS[(i * 3 + k) % SHOPS.length];
              return (
                <mesh key={k} position={[b.side * 13.85, 3.6, b.z - b.w / 2 + 3 + k * 6]} rotation={[0, (-b.side * Math.PI) / 2, 0]}>
                  <planeGeometry args={[5.4, 1.3]} />
                  <meshBasicMaterial map={signTex(sh[0], sh[1], sh[2], "800 110px Inter, sans-serif", 1024, 230)} toneMapped={false} />
                </mesh>
              );
            })}
            <mesh position={[b.side * 13.9, 1.6, b.z]} rotation={[0, (-b.side * Math.PI) / 2, 0]}>
              <planeGeometry args={[b.w - 0.4, 3.2]} />
              <meshStandardMaterial color="#141a22" emissive="#ffcf8a" emissiveIntensity={night ? 0.6 : 0.07} roughness={0.35} metalness={0.3} />
            </mesh>
          </group>
        );
      })}
      {/* такси */}
      {taxis.filter((c) => nearC(c.x, c.z, 3.2)).map((c, i) => (
        <group key={i}>
          <Car x={c.x} z={c.z} rot={c.rot} color={c.c} />
          {c.c === "#f2b705" && <mesh position={[c.x, 1.55, c.z]}><boxGeometry args={[0.5, 0.18, 0.2]} /><meshBasicMaterial color="#fff4c4" toneMapped={false} /></mesh>}
        </group>
      ))}
      {/* светофоры, пар, гидрант */}
      {Array.from({ length: Math.floor(len / 90) + 1 }, (_, k) => z0 + 45 + k * 90).map((zc, k) => (
        <group key={k}>
          {([-1, 1] as const).map((s) => (
            <group key={s} position={[s * 9.4, 0, zc - 13]}>
              <mesh position={[0, 2.5, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 5, 8]} /><M c="#1f2a24" m={0.5} /></mesh>
              <mesh position={[-s * 1.1, 4.6, 0]}><boxGeometry args={[0.35, 1, 0.3]} /><M c="#16191d" /></mesh>
              <mesh position={[-s * 1.1, 4.95, 0.17]}><circleGeometry args={[0.12, 12]} /><meshBasicMaterial color="#e83a2a" toneMapped={false} /></mesh>
            </group>
          ))}
          <Steam p={[-5.5, 0, zc + 14]} t={t} />
        </group>
      ))}
      {Array.from({ length: 6 }, (_, i) => nearC(-9.6, z1 - 10 - i * 40, 1.5) && (
        <group key={i} position={[-9.6, 0, z1 - 10 - i * 40]}>
          <mesh position={[0, 0.35, 0]} castShadow><cylinderGeometry args={[0.1, 0.12, 0.7, 10]} /><M c="#c43a2a" /></mesh>
        </group>
      ))}
    </group>
  );
};

/** улица с браунстоунами, Бруклин */
export const Brownstones: React.FC<{ mood: Mood; night?: boolean; z0?: number; z1?: number; cam?: V; lampOn?: number; wet?: number }> = ({ mood, night, z0 = -120, z1 = 30, cam, lampOn = 0, wet = 0 }) => {
  const mid = (z0 + z1) / 2, len = z1 - z0;
  const asphalt = useMemo(() => { const x = asphaltT().clone(); x.repeat.set(2, len / 10); x.needsUpdate = true; return x; }, [len]);
  const walk = useMemo(() => { const x = concreteTex("#aaa59a").clone(); x.repeat.set(1, len / 5); x.needsUpdate = true; return x; }, [len]);
  const houses = useMemo(() => {
    const out: { side: 1 | -1; z: number; w: number; tone: string; seed: number; tall: number }[] = [];
    for (const side of [-1, 1] as const) {
      let z = z0, i = 0;
      while (z < z1) {
        const w = 6 + rnd(i * 5 + side) * 2.5;
        out.push({ side, z: z + w / 2, w, tone: ["#6b4535", "#7a4a3a", "#5a3d33", "#8a5a42", "#63483c", "#7d5a4a"][Math.floor(rnd(i * 9 + side * 7) * 6)], seed: i + (side > 0 ? 50 : 0), tall: 13 + rnd(i * 3) * 3 });
        z += w;
        i++;
      }
    }
    return out;
  }, [z0, z1]);
  const near = (x: number, z: number, r: number) => !cam || Math.hypot(x - cam[0], z - cam[2]) > r;
  return (
    <group>
      <Sky mood={mood} at={[0, 0, mid]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, mid]} receiveShadow>
        <planeGeometry args={[11, len]} />
        <meshStandardMaterial map={asphalt} roughness={1 - wet * 0.6} metalness={wet * 0.25} />
      </mesh>
      {([-1, 1] as const).map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 8, 0.05, mid]} receiveShadow>
          <planeGeometry args={[5, len]} />
          <meshStandardMaterial map={walk} roughness={0.9 - wet * 0.4} />
        </mesh>
      ))}
      {houses.map((h, i) => {
        const tx = brownstoneTex(h.seed % 9, h.tone).clone();
        tx.repeat.set(h.w / 6.5, 1);
        tx.needsUpdate = true;
        const x = h.side * 15.5;
        return (
          <group key={i}>
            <mesh position={[x, h.tall / 2, h.z]} receiveShadow castShadow>
              <boxGeometry args={[14, h.tall, h.w]} />
              <meshStandardMaterial map={tx} roughness={0.95} emissive="#fff" emissiveMap={tx} emissiveIntensity={night ? 0.5 : 0.04} />
            </mesh>
            {/* крыльцо */}
            {[0, 1, 2, 3, 4].map((k) => (
              <Box key={k} p={[h.side * (8.2 + (4 - k) * 0.28 + 0.5), 0.18 * (k + 1) * 0.9, h.z]} s={[0.4, 0.2 * (k + 1), 1.6]} c="#8d8a83" r={0.9} shadow={false} />
            ))}
            <mesh position={[h.side * 8.45, 2.4, h.z]} rotation={[0, (-h.side * Math.PI) / 2, 0]}>
              <planeGeometry args={[1.2, 2.2]} />
              <meshStandardMaterial color={["#2a3a4a", "#5a2a2a", "#1f4a3a", "#2a2a2a"][i % 4]} roughness={0.5} emissive="#ffcf8a" emissiveIntensity={night ? 0.25 : 0} />
            </mesh>
          </group>
        );
      })}
      {Array.from({ length: Math.floor(len / 14) }, (_, i) => z0 + 5 + i * 14).map((z, i) => (
        <React.Fragment key={i}>
          {near(-5.9, z + (i % 3), 2.6) && <Tree x={-5.9} z={z + (i % 3)} s={1.0 + rnd(i) * 0.3} seed={i * 11} fall={0} />}
          {near(5.9, z + 5, 2.6) && <Tree x={5.9} z={z + 5} s={0.9 + rnd(i + 3) * 0.3} seed={i * 11 + 4} fall={0} />}
          {near(-5.4, z + 7, 1.5) && (
            <group position={[-5.4, 0, z + 7]}>
              <mesh position={[0, 3, 0]} castShadow><cylinderGeometry args={[0.06, 0.08, 6, 8]} /><M c="#24272b" m={0.5} /></mesh>
              <mesh position={[0, 6.1, 0]}><sphereGeometry args={[0.28, 10, 10]} /><meshBasicMaterial color="#ffd9a0" toneMapped={false} /></mesh>
              {lampOn > 0 && <pointLight position={[0, 5.8, 0]} color="#ffbf70" intensity={26 * lampOn} distance={15} decay={1.5} />}
            </group>
          )}
        </React.Fragment>
      ))}
      {[[-3, -30, 0.1, "#3c4f6a"], [3.2, -52, Math.PI - 0.05, "#7a7a80"], [-3, -78, 0, "#8c3a2f"], [3, -14, Math.PI, "#c9c4b4"]].map(([x, z, r, c], i) => near(x as number, z as number, 3.4) && <Car key={i} x={x as number} z={z as number} rot={r as number} color={c as string} />)}
    </group>
  );
};

/** далёкий Манхэттен: три слоя с дымкой */
export const Skyline: React.FC<{ z?: number; night?: boolean; dusk?: boolean }> = ({ z = -330, night, dusk }) => {
  const b = useMemo(() => Array.from({ length: 78 }, (_, i) => {
    const layer = i % 3;
    return { x: -420 + Math.floor(i / 3) * 33 + rnd(i) * 14 + layer * 11, w: 16 + rnd(i * 3) * 24, h: 70 + rnd(i * 5) * 150 + (i % 13 === 0 ? 120 : 0) + (layer === 2 ? 40 : 0), seed: i, d: 18 + rnd(i * 7) * 26, layer };
  }), []);
  return (
    <group position={[0, 0, z]}>
      {b.map((q, i) => {
        const tx = (dusk ? duskTowerTex(q.seed % 6) : towerTex(q.seed % 7, "#5a6273", night)).clone();
        tx.repeat.set(1, Math.max(1, q.h / 220));
        tx.needsUpdate = true;
        const haze = ["#ffffff", "#f0c8c8", "#e0a8b8"][q.layer];
        return (
          <mesh key={i} position={[q.x, q.h / 2, -q.layer * 70]}>
            <boxGeometry args={[q.w, q.h, q.d]} />
            <meshStandardMaterial map={tx} color={haze} roughness={0.9} emissive="#fff" emissiveMap={tx} emissiveIntensity={night ? 1.0 : dusk ? 0.7 : 0.1} />
          </mesh>
        );
      })}
      <mesh position={[-30, 330, -10]}>
        <coneGeometry args={[4, 90, 8]} />
        <meshStandardMaterial color="#c9cfdc" emissive="#ffe2b0" emissiveIntensity={dusk || night ? 0.9 : 0} />
      </mesh>
      <mesh position={[-30, 250, -10]}>
        <boxGeometry args={[26, 160, 26]} />
        <meshStandardMaterial color="#6a5a74" emissive="#ffd89a" emissiveIntensity={dusk || night ? 0.45 : 0.04} />
      </mesh>
    </group>
  );
};

/** крыша в Бруклине с видом на Манхэттен */
export const Rooftop: React.FC<{ mood: Mood; dusk?: boolean; night?: boolean }> = ({ mood, dusk, night }) => {
  const roof = useMemo(() => { const x = concreteTex("#4a4846").clone(); x.repeat.set(3, 3); x.needsUpdate = true; return x; }, []);
  return (
    <group>
      <Sky mood={mood} r={1700} />
      {/* река */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -22, -420]}>
        <planeGeometry args={[3000, 900]} />
        <meshStandardMaterial color={dusk ? "#7a5a62" : "#202a3a"} roughness={0.2} metalness={0.6} />
      </mesh>
      <group scale={[2.4, 2.4, 2.4]} position={[0, -30, 0]}><Skyline z={-330} dusk={dusk} night={night} /></group>
      {/* крыша */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial map={roof} roughness={1} />
      </mesh>
      {[[0, -8.6, 16.6, 0.3], [-8.3, -2, 0.3, 14], [8.3, -2, 0.3, 14]].map(([x, z, w, d], i) => <Box key={i} p={[x, 0.55, z]} s={[w, 1.1, d]} c="#8a5a46" r={0.95} />)}
      {/* водонапорная башня */}
      <group position={[-5.5, 0, -5]}>
        {[[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]].map(([x, z], i) => <mesh key={i} position={[x, 1.6, z]}><boxGeometry args={[0.1, 3.2, 0.1]} /><M c="#2a241f" /></mesh>)}
        <mesh position={[0, 4, 0]} castShadow><cylinderGeometry args={[1.3, 1.3, 2, 14]} /><M c="#6a4a30" r={1} /></mesh>
        <mesh position={[0, 5.3, 0]} castShadow><coneGeometry args={[1.45, 0.8, 14]} /><M c="#4a3524" r={1} /></mesh>
      </group>
      <Box p={[5.8, 0.5, -4]} s={[1.6, 1, 1.2]} c="#8a8f94" m={0.4} r={0.6} />
      <Box p={[4.4, 0.25, -6]} s={[0.9, 0.5, 0.9]} c="#7a7f84" m={0.4} r={0.6} />
    </group>
  );
};
