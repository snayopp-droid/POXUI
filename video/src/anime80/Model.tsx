import React from "react";
import { Bust, Head } from "./head";
import { H, W } from "./cel";

/** модельный лист: герой в 3 выражениях */
export const A80Model: React.FC = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ background: "linear-gradient(#1a1250,#5a2380)" }}>
    {[
      { x: 380, open: 1, mouth: "set" as const, brow: 0, sq: 1 },
      { x: 960, open: 0.55, mouth: "flat" as const, brow: 0.8, sq: 0.8 },
      { x: 1540, open: 1, mouth: "open" as const, brow: -0.8, sq: 1.15 },
    ].map((p, i) => (
      <g key={i}>
        <Bust id={`m${i}b`} x={p.x} y={560} s={1.0} />
        <Head id={`m${i}`} x={p.x} y={560 + 0} s={1.0} open={p.open} mouth={p.mouth} brow={p.brow} squeeze={p.sq} />
      </g>
    ))}
  </svg>
);
