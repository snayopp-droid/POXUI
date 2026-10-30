import { Composition, Still } from "remotion";
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
import { A80Model } from "./anime80/Model";
import { Anime80, A80_FRAMES } from "./anime80/Anime80";
import { Test3D } from "./after/Test3D";
import { Mini3D } from "./after/Mini3D";
import { Film, FILM_SEC } from "./after/Film";
import { NYFilm, NY_SEC } from "./ny/Film";
import { BlackoutVideo, BLACKOUT_FRAMES } from "./blackout/Blackout";
import { BlackoutVideo60, BLACKOUT60_FRAMES } from "./blackout/Blackout60";
import { MindVideo, MIND_FRAMES } from "./mind/Mind";
import { BunkerVideo, BUNKER_FRAMES, BunkerShort, BUNKER_SHORT_FRAMES } from "./bunker/Bunker";
import { BunkerThumb } from "./bunker/Thumb";
import { GoshaEp1, GOSHA_FRAMES } from "./gosha/Gosha";
import { FightVid, FIGHT_FRAMES } from "./fight/Fight";
import { BiletThumb, BiletThumb2 } from "./bilet/Thumb";
import { BiletShort, SHORT_FRAMES } from "./bilet/Short";
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
      <Composition id="BiletShort" component={BiletShort} durationInFrames={SHORT_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="Anime80Test" component={Anime80} durationInFrames={A80_FRAMES} fps={24} width={1920} height={1080} />
      <Composition id="After3DTest" component={Test3D} durationInFrames={72} fps={24} width={1920} height={1080} />
      <Composition id="AfterFilm" component={Film} durationInFrames={FILM_SEC * 24} fps={24} width={1920} height={1080} />
      <Composition id="NYFilm" component={NYFilm} durationInFrames={NY_SEC * 24} fps={24} width={1920} height={1080} />
      <Composition id="BlackoutVideo" component={BlackoutVideo} durationInFrames={BLACKOUT_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="BlackoutVideo60" component={BlackoutVideo60} durationInFrames={BLACKOUT60_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="MindVideo" component={MindVideo} durationInFrames={MIND_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="BunkerVideo" component={BunkerVideo} durationInFrames={BUNKER_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="BunkerShort" component={BunkerShort} durationInFrames={BUNKER_SHORT_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="GoshaEp1" component={GoshaEp1} durationInFrames={GOSHA_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="FightVid" component={FightVid} durationInFrames={FIGHT_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="BunkerThumb" component={BunkerThumb} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="Mini3D" component={Mini3D} durationInFrames={10} fps={24} width={640} height={360} />
      <Still id="A80Model" component={A80Model} width={1920} height={1080} />
      <Still id="BiletThumb" component={BiletThumb} width={1920} height={1080} />
      <Still id="BiletThumb2" component={BiletThumb2} width={1920} height={1080} />
      <Composition id="BiletTest" component={BiletTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    </>
  );
};
