import React, { Suspense, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { type Mood } from "./world";

export type Cam = { pos: [number, number, number]; look: [number, number, number]; fov?: number; roll?: number };

/** камера: позиция/цель/FOV задаются каждый кадр */
export const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const { camera, invalidate } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.pos);
    c.up.set(Math.sin(cam.roll ?? 0), Math.cos(cam.roll ?? 0), 0);
    c.lookAt(...cam.look);
    c.fov = cam.fov ?? 40;
    c.near = 0.1;
    c.far = 600;
    c.updateProjectionMatrix();
    invalidate();
  });
  return null;
};

export const Lights: React.FC<{ mood: Mood; focus: [number, number, number] }> = ({ mood, focus }) => {
  const target = useMemo(() => new THREE.Object3D(), []);
  const dir = useMemo(() => new THREE.Vector3(...mood.sunPos).normalize(), [mood]);
  const pos: [number, number, number] = [focus[0] + dir.x * 40, focus[1] + dir.y * 40, focus[2] + dir.z * 40];
  return (
    <>
      <hemisphereLight args={[mood.hemiSky, mood.hemiGround, mood.hemiI]} />
      <primitive object={target} position={focus} />
      <directionalLight color={mood.sun} intensity={mood.sunI} position={pos} target={target} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.03}>
        <orthographicCamera attach="shadow-camera" args={[-16, 16, 16, -16, 1, 120]} />
      </directionalLight>
    </>
  );
};

export const Stage3D: React.FC<{ width: number; height: number; cam: Cam; mood: Mood; focus: [number, number, number]; children: React.ReactNode }> = ({ width, height, cam, mood, focus, children }) => (
  <ThreeCanvas
    width={width}
    height={height}
    shadows="soft"
    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: mood.exposure ?? 1.0, outputColorSpace: THREE.SRGBColorSpace }}
    camera={{ fov: 40, position: [0, 2, 10], near: 0.1, far: 600 }}
  >
    <Suspense fallback={null}>
      <Rig cam={cam} />
      <Lights mood={mood} focus={focus} />
      {children}
    </Suspense>
  </ThreeCanvas>
);
