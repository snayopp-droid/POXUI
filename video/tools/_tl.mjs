import { build } from "esbuild";
import fs from "fs";
await build({ entryPoints: ["src/gosha/tl.ts"], bundle: true, format: "esm", outfile: "/tmp/gs/tl.out.mjs", loader: { ".json": "json" } });
const m = await import("/tmp/gs/tl.out.mjs");
fs.writeFileSync("/tmp/gs/beats.json", JSON.stringify({ total: m.TL.total, frames: m.GOSHA_FRAMES, beats: m.TL.beats }));
console.log(m.TL.total, m.GOSHA_FRAMES);
