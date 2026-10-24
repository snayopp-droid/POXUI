import { Composition } from "remotion";
import { Survival } from "./Survival";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Survival"
      component={Survival}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
