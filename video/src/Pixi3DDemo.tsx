import React from "react";
import { AbsoluteFill } from "remotion";
import { Camera, Color, Light, LightType, LightingEnvironment, Mesh3D, StandardMaterial } from "pixi3d/pixi7";
import { Pixi3DLayer } from "./Pixi3DLayer";

export const PIXI3D_FRAMES = 120;

const cubeColor = (r: number, g: number, b: number) => {
  const m = new StandardMaterial();
  m.baseColor = new Color(r, g, b);
  return m;
};

export const Pixi3DDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#10131f, #2a1b3a)" }}>
    <Pixi3DLayer
      build={(app) => {
        const sun = Object.assign(new Light(), { type: LightType.directional, intensity: 3, color: new Color(1, 0.95, 0.85) });
        sun.rotationQuaternion.setEulerAngles(40, 50, 0);
        LightingEnvironment.main.lights.push(sun);
        Camera.main.position.set(0, 2.2, -15);
        Camera.main.rotationQuaternion.setEulerAngles(12, 0, 0);

        const cubes = [
          { x: -2.6, mat: cubeColor(0.9, 0.35, 0.25) },
          { x: 0, mat: cubeColor(1, 0.83, 0.4) },
          { x: 2.6, mat: cubeColor(0.35, 0.8, 0.55) },
        ].map(({ x, mat }) => {
          const c = Mesh3D.createCube(mat);
          c.position.set(x, 0, 0);
          app.stage.addChild(c);
          return c;
        });
        return (frame) => {
          cubes.forEach((c, i) => {
            c.rotationQuaternion.setEulerAngles(frame * (2 + i), frame * (3 - i), 0);
            c.position.y = Math.sin(frame / 12 + i) * 0.6;
          });
        };
      }}
    />
  </AbsoluteFill>
);
