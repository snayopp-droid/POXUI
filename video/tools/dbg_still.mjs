import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const [id, frame, out, props] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const inputProps = props ? JSON.parse(props) : {};
const comp = await selectComposition({ serveUrl, id, inputProps, chromiumOptions: { gl: "swangle" } });
await renderStill({ composition: comp, serveUrl, output: out, frame: Number(frame), inputProps, scale: 0.5, chromiumOptions: { gl: "swangle" }, timeoutInMilliseconds: 120000, logLevel: "info", onBrowserLog: (l) => console.log("[browser]", l.type, l.text.slice(0, 400)) });
console.log("done");
