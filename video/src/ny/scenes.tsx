import React, { useMemo } from "react";
import * as THREE from "three";
import { rnd } from "../after/util";
import { Room, outsideTex } from "./rooms";
import { Box, Bed, Lamp, Laptop, Suitcase } from "./props";
import { cv, mkTex, once, signTex, wallpaperTex, parquetTex, brickTexNY } from "./tex";


/** московская квартира (комната). mode: night | dawn */
export const MoscowRoom: React.FC<{ mode?: "night" | "dawn"; lampOn?: number; doorOpen?: number; suitcase?: boolean; laptopGlow?: number }> = ({ mode = "night", lampOn = 1, doorOpen = 0, suitcase = true, laptopGlow = 0 }) => {
  const night = mode === "night";
  return (
    <group>
      <Room w={5.2} d={4.4} h={2.7} wall={night ? "#9a8a72" : "#c8b79b"} wallMap={wallpaperTex(night ? "#9a8a72" : "#c8b79b", night ? "#a59680" : "#d3c3a8")} floor={parquetTex()} floorColor="#d9c0a0"
        ambient={night ? 0.22 : 0.55} ambientColor={night ? "#6a7390" : "#c9b8a0"}
        openings={[
          { wall: "back", c: 0.5, y0: 0.9, wd: 1.8, ht: 1.5, kind: "window", view: outsideTex(night ? "moscow-night" : "moscow-dawn"), glow: night ? "#6b7fb8" : "#ffb98a" },
          { wall: "left", c: -0.6, y0: 0, wd: 0.95, ht: 2.05, kind: "door", open: doorOpen },
        ]} />
      <Bed p={[1.7, 0, -1.2]} ry={Math.PI / 2} />
      <Box p={[2.45, 1.0, 1.2]} s={[0.55, 2.0, 1.5]} c="#6b4a30" r={0.8} />
      <Box p={[-1.6, 0.74, -1.85]} s={[1.5, 0.05, 0.7]} c="#7a5a3a" r={0.6} />
      <Box p={[-2.2, 0.37, -1.85]} s={[0.05, 0.74, 0.6]} c="#3a2a1c" />
      <Box p={[-0.9, 0.37, -1.85]} s={[0.05, 0.74, 0.6]} c="#3a2a1c" />
      <Box p={[-1.6, 0.46, -1.35]} s={[0.45, 0.06, 0.45]} c="#2a2f38" />
      <Box p={[-1.6, 0.24, -1.35]} s={[0.06, 0.45, 0.06]} c="#222" />
      <Laptop p={[-1.5, 0.77, -1.9]} glow={laptopGlow} />
      <Lamp p={[-2.05, 0.77, -2.0]} on={lampOn} />
      <Box p={[-2.55, 1.2, 0.2]} s={[0.35, 2.4, 1.6]} c="#8a6a48" r={0.8} />
      {[0.9, 1.4, 1.9].map((y) => <Box key={y} p={[2.55, y, 0.2]} s={[0.25, 0.04, 1.6]} c="#5a4028" />)}
      {Array.from({ length: 14 }, (_, i) => <Box key={i} p={[2.55, 0.95 + Math.floor(i / 7) * 0.5, -0.4 + (i % 7) * 0.2]} s={[0.2, 0.28, 0.1]} c={["#a33", "#3a6", "#36a", "#aa3", "#888"][i % 5]} shadow={false} />)}
      <mesh position={[-0.6, 0.01, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial color="#6a3a3a" roughness={1} />
      </mesh>
      {suitcase && <Suitcase p={[-1.1, 0, 1.6]} ry={0.3} />}
      {suitcase && <Suitcase p={[-0.55, 0, 1.55]} ry={-0.2} c="#4a3a2a" s={0.9} />}
    </group>
  );
};

/** кухня */
export const Kitchen: React.FC = () => (
  <group>
    <Room w={3.6} d={3.2} h={2.6} wall="#d6c7a2" wallMap={wallpaperTex("#d6c7a2", "#decfae")} floor={parquetTex("#7a5a3a")} floorColor="#b89a74" ambient={0.55} ambientColor="#c8b490"
      openings={[{ wall: "back", c: 0.4, y0: 0.95, wd: 1.2, ht: 1.3, kind: "window", view: outsideTex("moscow-dawn"), glow: "#ffb98a" }, { wall: "right", c: 0.4, y0: 0, wd: 0.95, ht: 2.05, kind: "door" }]} />
    <Box p={[-1.6, 0.45, -0.2]} s={[0.6, 0.9, 2.2]} c="#e8e4da" r={0.6} />
    <Box p={[-1.6, 0.92, -0.2]} s={[0.62, 0.05, 2.25]} c="#b8b0a2" r={0.5} />
    <Box p={[1.45, 0.9, -1.2]} s={[0.7, 1.8, 0.7]} c="#e9ecee" r={0.4} m={0.2} />
    <Box p={[0.1, 0.72, 0.6]} s={[1.2, 0.05, 0.8]} c="#a98a66" r={0.6} />
    {[[-0.45, 0.1], [0.65, 0.1]].map(([x, z], i) => <Box key={i} p={[0.1 + x * 0.9, 0.22, 0.6 + (i ? 0.7 : -0.7)]} s={[0.4, 0.08, 0.4]} c="#6b3a2a" />)}
    <Lamp p={[-1.55, 0.95, -0.9]} on={1} c="#ffd9a0" />
    <mesh position={[0, 2.3, 0.2]}>
      <sphereGeometry args={[0.12, 10, 10]} />
      <meshBasicMaterial color="#ffe8b8" toneMapped={false} />
    </mesh>
    <pointLight position={[0, 2.2, 0.2]} color="#ffd9a0" intensity={9} distance={7} decay={1.6} />
    {/* бутерброды в пакете */}
    <Box p={[0.1, 0.8, 0.5]} s={[0.3, 0.12, 0.2]} c="#e8dcc0" />
    <Box p={[-0.1, 0.8, 0.8]} s={[0.25, 0.1, 0.18]} c="#c8b890" />
  </group>
);

/** комната в Бруклине: матрас на полу, кирпич за окном */
export const BrooklynRoom: React.FC<{ bulb?: number; day?: boolean }> = ({ bulb = 1, day }) => {
  const brick = brickTexNY();
  return (
    <group>
      <Room w={3.0} d={3.4} h={2.6} wall="#a79b8a" floor={parquetTex("#6a4a30")} floorColor="#c9ad88" ceil="#d0cbc0" ambient={day ? 0.5 : 0.2} ambientColor={day ? "#c8c0b0" : "#6a6f86"}
        openings={[{ wall: "back", c: 0, y0: 0.95, wd: 1.1, ht: 1.35, kind: "window", view: outsideTex("brick"), glow: day ? "#e8d8c0" : "#5a6a90" }, { wall: "front", c: 0.7, y0: 0, wd: 0.9, ht: 2.05, kind: "door" }]} />
      {/* кирпич-вид окна и крыша дома напротив */}
      <Bed p={[0.3, 0, -0.6]} floor />
      <Suitcase p={[-1.0, 0, 0.4]} ry={1.1} />
      <Box p={[-1.2, 0.12, -0.8]} s={[0.5, 0.24, 0.5]} c="#6a5a4a" />
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color="#ffe0a0" toneMapped={false} opacity={0.4 + 0.6 * bulb} transparent />
      </mesh>
      <pointLight position={[0, 2.2, 0]} color="#ffd9a0" intensity={7 * bulb} distance={6} decay={1.6} />
      <Box p={[0, 0.0, 0]} s={[0, 0, 0]} c="#000" shadow={false} />
      <Box p={[1.2, 0.75, 1.4]} s={[0.04, 0, 0]} c="#000" shadow={false} />
      <Box p={[-0.2, 1.0, -1.62]} s={[1.0, 0.45, 0.4]} c="#cfd3d6" r={0.6} />
      <mesh position={[0, 1.7, 1.69]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshBasicMaterial map={signTex("$2,200 / mo", "#e8dcb8", "#3a2a1c", "700 70px Inter, sans-serif", 512, 256)} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.001, 0.001]} />
        <meshBasicMaterial map={brick} />
      </mesh>
    </group>
  );
};

/** кабина такси (интерьер: подголовники, стойка, зеркало) — камера внутри */
export const TaxiInterior: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <group>
    <Box p={[-0.45, 0.7, 0.2]} s={[0.4, 0.9, 0.18]} c="#1a1c20" r={0.8} shadow={false} />
    <Box p={[0.45, 0.7, 0.2]} s={[0.4, 0.9, 0.18]} c="#1a1c20" r={0.8} shadow={false} />
    <Box p={[0, 0.25, 0.9]} s={[1.5, 0.45, 0.3]} c="#13151a" shadow={false} />
    <Box p={[0, 1.15, 0.1]} s={[0.25, 0.08, 0.06]} c="#111" shadow={false} />
    <Box p={[-0.85, 0.75, -0.5]} s={[0.07, 1.0, 0.07]} c="#14161a" shadow={false} />
    <Box p={[0.85, 0.75, -0.5]} s={[0.07, 1.0, 0.07]} c="#14161a" shadow={false} />
    <Box p={[0, 1.38, 0.0]} s={[2, 0.06, 1.8]} c="#26282d" shadow={false} />
    <mesh position={[0, 0.5, 0.3 + Math.sin(t * 6) * 0.002]}>
      <boxGeometry args={[0, 0, 0]} />
    </mesh>
  </group>
);

/** вагон метро — интерьер, тоннельные огни проносятся за окнами */
export const tunnelTex = () =>
  once("tunnel", () => {
    const c = cv(1024, 128);
    const g = c.getContext("2d")!;
    g.fillStyle = "#06070a";
    g.fillRect(0, 0, 1024, 128);
    for (let i = 0; i < 40; i++) {
      const x = rnd(i * 3) * 1024;
      const gr = g.createRadialGradient(x, 60 + rnd(i) * 30, 1, x, 60 + rnd(i) * 30, 30);
      gr.addColorStop(0, i % 4 === 0 ? "rgba(255,150,90,1)" : "rgba(255,255,230,1)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(x - 30, 0, 60, 128);
    }
    return mkTex(c, 1, 1);
  });

export const TrainCar: React.FC<{ t?: number; moving?: number }> = ({ t = 0, moving = 1 }) => {
  const tun = useMemo(() => { const x = tunnelTex().clone(); x.needsUpdate = true; return x; }, []);
  tun.offset.x = (t * 0.35 * moving) % 1;
  return (
    <group>
      <ambientLight intensity={0.95} color="#dfe8df" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 16]} />
        <meshStandardMaterial color="#b9b2a2" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 16]} />
        <meshStandardMaterial color="#e6e2d6" side={THREE.DoubleSide} />
      </mesh>
      {([-1.5, 1.5] as const).map((x) => (
        <group key={x}>
          <mesh position={[x, 1.2, 0]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
            <planeGeometry args={[16, 2.4]} />
            <meshStandardMaterial color="#cfd2cc" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          {Array.from({ length: 4 }, (_, i) => (
            <mesh key={i} position={[x * 0.98, 1.45, -5.5 + i * 3.6]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
              <planeGeometry args={[1.5, 1.0]} />
              <meshBasicMaterial map={tun} toneMapped={false} />
            </mesh>
          ))}
          <Box p={[x * 0.84, 0.28, 0]} s={[0.55, 0.12, 14]} c="#e0762a" r={0.6} />
          <Box p={[x * 0.9, 0.55, 0]} s={[0.12, 0.7, 14]} c="#e0762a" r={0.6} />
        </group>
      ))}
      {[-4, 0, 4].map((z) => <Box key={z} p={[0, 1.2, z]} s={[0.05, 2.4, 0.05]} c="#b8bcc2" m={0.8} r={0.3} />)}
      {[-5, 0, 5].map((z) => (
        <mesh key={z} position={[0, 2.35, z]}>
          <boxGeometry args={[0.35, 0.05, 2]} />
          <meshBasicMaterial color="#f4fff4" toneMapped={false} />
        </mesh>
      ))}
      <pointLight position={[0, 2.2, 0]} color="#e8f2e8" intensity={10} distance={10} decay={1.4} />
    </group>
  );
};
