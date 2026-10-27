import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { loadLibrary, type Library } from "./anim";

export const assets: { lib: Library | null; male: GLTF | null; female: GLTF | null } = { lib: null, male: null, female: null };

let p: Promise<void> | null = null;
export const loadAssets = (): Promise<void> => {
  if (p) return p;
  const loader = new GLTFLoader();
  const ch = (k: "male" | "female") => new Promise<GLTF>((res, rej) => loader.load(staticFile(`after/chars/${k}.gltf`), res, undefined, rej));
  p = Promise.all([loadLibrary(), ch("male"), ch("female")]).then(([lib, male, female]) => {
    assets.lib = lib;
    assets.male = male;
    assets.female = female;
  });
  return p;
};

/** true, когда модели и анимации загружены; держит рендер до этого момента */
export const useAssets = (): boolean => {
  const [ok, setOk] = useState(!!assets.lib);
  const [h] = useState(() => (assets.lib ? null : delayRender("3d assets", { timeoutInMilliseconds: 120000 })));
  useEffect(() => {
    if (!assets.lib) loadAssets().then(() => setOk(true));
  }, []);
  useEffect(() => {
    if (ok && h !== null) continueRender(h);
  }, [ok, h]);
  return ok;
};
