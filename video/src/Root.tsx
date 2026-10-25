import { Composition } from "remotion";
import { Survival } from "./Survival";
import { Action } from "./Action";
import { Home } from "./Home";
import { Dark } from "./Dark";
import { Cell } from "./Cell";
import { Cafe2 } from "./Cafe";
import { Zombie_ } from "./Zombie";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./timeline";
import { DURATION_FRAMES as ACTION_FRAMES } from "./timeline2";
import { DURATION_FRAMES as HOME_FRAMES } from "./timeline3";
import { DURATION_FRAMES as DARK_FRAMES } from "./timeline4";
import { DURATION_FRAMES as CELL_FRAMES } from "./timeline5";
import { DURATION_FRAMES as CAFE_FRAMES } from "./timeline6";
import { DURATION_FRAMES as ZOMBIE_FRAMES } from "./timeline8";

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
    </>
  );
};
