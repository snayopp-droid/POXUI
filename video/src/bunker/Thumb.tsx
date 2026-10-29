import React from "react";
import { AbsoluteFill } from "remotion";
import { W, H, C, Txt, Person, LOOKS, FONT } from "./art";
import { DoorRoom } from "./sets";
import { Geiger, Dust } from "./props";

const Trefoil: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#f0b840" stroke="#111" strokeWidth={8} />
    {[0, 120, 240].map((a) => {
      const p = (deg: number, rad: number) => `${Math.sin(((a + deg) * Math.PI) / 180) * rad},${-Math.cos(((a + deg) * Math.PI) / 180) * rad}`;
      return <path key={a} d={`M 0 0 L ${p(-30, r * 0.82)} A ${r * 0.82} ${r * 0.82} 0 0 1 ${p(30, r * 0.82)} Z`} fill="#111" transform="rotate(30)" />;
    })}
    <circle r={r * 0.16} fill="#111" />
  </g>
);

export const BunkerThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <g transform="translate(-200,-60) scale(1.2)"><DoorRoom t={0.5} lamp={0.6} dim={0.1} light={0.95} /></g>
      <rect width={W} height={H} fill="#000" opacity={0.25} />
      <Dust t={3} n={60} c="#ffe9a0" o={0.5} speed={14} seed={4} r={3} />
      {/* семья слева у лестницы */}
      <Person x={470} y={1010} s={1.05} look={LOOKS.elena} pose={{ expr: "worry", armL: [150, 150], armR: [150, 150], t: 2 }} />
      <Person x={600} y={1030} s={0.7} look={LOOKS.lily} pose={{ expr: "surprised", armL: [60, 20], armR: [60, 20], t: 3 }} />
      {/* Марк в защитном костюме со счётчиком */}
      <g transform="translate(1380,0)"><Person x={0} y={1060} s={2.0} suit look={LOOKS.mark} pose={{ armR: [65, 70], t: 1, heldR: <Geiger x={0} y={40} v={0.92} t={0} s={0.34} /> }} /></g>
      <rect width={W} height={H} fill="url(#tv)" />
      <defs><radialGradient id="tv"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></radialGradient></defs>
      {/* заголовок */}
      <g style={{ paintOrder: "stroke" }}>
        <text x={70} y={290} fontSize={290} fontFamily={FONT} fontWeight={900} fill="#f6c443" stroke="#0a0a0a" strokeWidth={22} strokeLinejoin="round">12 YEARS</text>
        <text x={74} y={450} fontSize={150} fontFamily={FONT} fontWeight={900} fill="#ffffff" stroke="#0a0a0a" strokeWidth={16} strokeLinejoin="round">UNDERGROUND</text>
      </g>
      <g transform="translate(70,520)"><rect width={780} height={104} rx={10} fill="#c62d2d" stroke="#0a0a0a" strokeWidth={8} /><Txt x={390} y={74} size={64} c="#fff" w={900} ls={3}>NUCLEAR BUNKER</Txt></g>
      <Trefoil x={1760} y={160} r={110} />
    </svg>
  </AbsoluteFill>
);
