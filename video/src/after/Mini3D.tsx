import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";

export const Mini3D: React.FC = () => (
  <AbsoluteFill style={{ background: "#123" }}>
    <ThreeCanvas width={640} height={360} camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={1} />
      <directionalLight position={[2, 3, 4]} />
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </ThreeCanvas>
  </AbsoluteFill>
);
