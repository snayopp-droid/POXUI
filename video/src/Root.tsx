import { Composition } from "remotion";
import { Survival } from "./Survival";
import { Action } from "./Action";
import { Home } from "./Home";
import { Dark } from "./Dark";
import { Cell } from "./Cell";
import { Cafe2 } from "./Cafe";
import { Zombie_ } from "./Zombie";
import { Korni } from "./Korni";
import { Forest5 } from "./Forest5";
import { Plague } from "./Plague";
import { Metro } from "./Metro";
import { Fura } from "./Fura";
import { BiletTest } from "./bilet/Test";
import { Bilet } from "./Bilet";
import { DURATION_FRAMES as BILET_FRAMES } from "./bilet/timeline";
import { Pixi3DDemo, PIXI3D_FRAMES } from "./Pixi3DDemo";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./timeline";
import { DURATION_FRAMES as ACTION_FRAMES } from "./timeline2";
import { DURATION_FRAMES as HOME_FRAMES } from "./timeline3";
import { DURATION_FRAMES as DARK_FRAMES } from "./timeline4";
import { DURATION_FRAMES as CELL_FRAMES } from "./timeline5";
import { DURATION_FRAMES as CAFE_FRAMES } from "./timeline6";
import { DURATION_FRAMES as ZOMBIE_FRAMES } from "./timeline8";
import { DURATION_FRAMES as KORNI_FRAMES } from "./timeline9";
import { DURATION_FRAMES as FOREST5_FRAMES } from "./timeline10";
import { DURATION_FRAMES as PLAGUE_FRAMES } from "./timeline11";
import { DURATION_FRAMES as METRO_FRAMES } from "./timeline12";
import { DURATION_FRAMES as FURA_FRAMES } from "./timelineF";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Survival"
        component={Survival}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Action"
        component={Action}
        durationInFrames={ACTION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Lira"
        component={Home}
        durationInFrames={HOME_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ThreeDays"
        component={Dark}
        durationInFrames={DARK_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CellNetwork"
        component={Cell}
        durationInFrames={CELL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="StepaCafe"
        component={Cafe2}
        durationInFrames={CAFE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Zombie"
        component={Zombie_}
        durationInFrames={ZOMBIE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Korni"
        component={Korni}
        durationInFrames={KORNI_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Forest5"
        component={Forest5}
        durationInFrames={FOREST5_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PlagueMoscow"
        component={Plague}
        durationInFrames={PLAGUE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MetroPlague"
        component={Metro}
        durationInFrames={METRO_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="FuraEp1"
        component={Fura}
        durationInFrames={FURA_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Pixi3D"
        component={Pixi3DDemo}
        durationInFrames={PIXI3D_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition id="BiletEp1" component={Bilet} durationInFrames={BILET_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="BiletTest" component={BiletTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    </>
  );
};
