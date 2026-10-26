import React, { useEffect, useRef } from "react";
import { continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";
import * as PIXI from "pixi.js";

type Update = (frame: number, fps: number) => void;

/**
 * Слой с 3D-сценой на pixi3d. `build` один раз строит сцену на `app.stage`
 * и возвращает функцию, которая по номеру кадра выставляет состояние сцены.
 * Рендер идёт вручную на каждый кадр Remotion (autoStart выключен).
 */
export const Pixi3DLayer: React.FC<{
  build: (app: PIXI.Application) => Update;
  style?: React.CSSProperties;
}> = ({ build, style }) => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ app: PIXI.Application; update: Update } | null>(null);
  const handle = useRef(delayRender("pixi3d init"));

  useEffect(() => {
    const app = new PIXI.Application({
      view: canvas.current!,
      width,
      height,
      backgroundAlpha: 0,
      antialias: true,
      autoStart: false,
      preserveDrawingBuffer: true,
    });
    state.current = { app, update: build(app) };
    return () => {
      state.current = null;
      app.destroy(false, { children: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = delayRender(`pixi3d frame ${frame}`);
    const s = state.current;
    if (s) {
      s.update(frame, fps);
      s.app.render();
    }
    continueRender(h);
    if (s) continueRender(handle.current);
  }, [frame, fps]);

  return <canvas ref={canvas} width={width} height={height} style={{ width, height, ...style }} />;
};
