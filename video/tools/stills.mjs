import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const out = process.argv[2];
const frames = process.argv.slice(3).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: process.env.COMP || "AfterFilm", chromiumOptions: { gl: "swangle" } });
for (const f of frames) {
  const t0 = Date.now();
  await renderStill({ composition: comp, serveUrl, output: `${out}/f${String(f).padStart(5, "0")}.png`, frame: f, scale: 0.5, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 180000, onBrowserLog: (l) => { if (l.type === "error") console.log("[browser]", l.text.slice(0, 300)); } });
  console.log(f, ((Date.now() - t0) / 1000).toFixed(1) + "s");
}
