import React from "react";
import { useCurrentFrame } from "remotion";
import { Svg, Glow, Snow } from "./core";
import { Figure, Profile } from "./figures";

export const BiletTest: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <Svg bg="#1b2230">
      <rect width={1920} height={1080} fill="#1e2634" />
      <Glow x={300} y={300} r={600} k="sodium" o={0.6} />
      <rect y={820} width={1920} height={260} fill="#14171d" />
      <Figure x={200} y={820} s={1} pose="walk" phase={t * 5} bag="backpack" />
      <Figure x={450} y={820} s={1} pose="stand" who="mom" bag="handbag" />
      <Figure x={680} y={820} s={1} pose="sit" bag="backpack" hood />
      <Figure x={900} y={820} s={1} pose="slump" who="danny" cap face={-1} />
      <Figure x={1080} y={820} s={1} pose="ride" bag="courier" />
      <Profile x={1350} y={330} s={0.9} id="a" mood="smile" headphones lit="front" />
      <Profile x={1700} y={330} s={0.9} id="b" who="mom" face={-1} mood="sad" />
      <Profile x={1350} y={760} s={0.9} id="c" who="officer" mood="tense" cap={false} />
      <Profile x={1700} y={760} s={0.9} id="d" who="aram" face={-1} mood="warm" />
      <Snow t={t} />
    </Svg>
  );
};
