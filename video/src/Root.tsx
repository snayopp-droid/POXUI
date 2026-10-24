import { Composition } from "remotion";
import { Survival } from "./Survival";
import { Action } from "./Action";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./timeline";
import { DURATION_FRAMES as ACTION_FRAMES } from "./timeline2";

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
    </>
  );
};
