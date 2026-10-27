import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { assets, useAssets } from "./assets";
import { Person } from "./people";
import { Stage3D } from "./stage";
import { MOODS, Street } from "./world";

export const FPS3 = 24;

export const Test3D: React.FC<{ mode?: number }> = ({ mode = 9 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS3;
  const ok = useAssets();
  const lib = ok ? assets.lib : null;
  const mood = MOODS.golden;
  const walkZ = -8 + t * 1.25;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {(lib || mode < 2) && (
        <Stage3D width={1920} height={1080} mood={mood} cam={{ pos: [-1.6, 1.55, walkZ + 4.6], look: [0, 1.15, walkZ], fov: 42 }} focus={[0, 0, walkZ]}>
          {mode >= 1 && <Street mood={mood} />}
          {mode === 0 && (<mesh position={[0, 1, walkZ]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="orange" /></mesh>)}
          {mode >= 2 && lib && <Person kind="male" lib={lib} pose={[{ clip: "Walk_Loop", time: t * 1.0 }]} outfit={{ shirt: "#1c1c1f", pants: "#7d9cc4", shoes: "#6b4a2f", hair: "#1d1612", sleeve: 0.3 }} position={[0, 0, walkZ]} rotY={0} />}
          {mode >= 3 && lib && <Person kind="female" lib={lib} pose={[{ clip: "Idle_Loop", time: t }]} outfit={{ shirt: "#c4473a", pants: "#2c3140", shoes: "#d8d4cc", hair: "#5a3a22", sleeve: 0.8 }} position={[6.4, 0, walkZ - 7]} rotY={-1.2} />}
          {mode >= 3 && lib && <Person kind="male" lib={lib} pose={[{ clip: "Zombie_Walk_Fwd_Loop", time: t }]} outfit={{ shirt: "#4a5a3a", pants: "#3a3030", shoes: "#222", hair: "#2a2018", sleeve: 0.8, zombie: 1 }} position={[-3, 0, walkZ - 12 + t * 0.4]} rotY={0} />}
        </Stage3D>
      )}
    </AbsoluteFill>
  );
};
