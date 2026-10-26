import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { A, DURATION_SEC, FPS, OFF, SCENES, VO_FILE, sceneAt, type SceneId } from "./timelineF";
import { cl, ramp } from "./FuraArt";
import {
  SBloody, SCabSleep, SCall, SCargo, SCargoTotal, SClimbOut, SCrashHit, SDanilaCard, SDistracted, SDitch, SDriving, SHangup, SHookMoney,
  SHookSplat, SLastWhisper, SLate, SPhoneFall, SRealize, SRewind, SRoadWide, SScreech, SSkid, SSmoke, SSpill, STitle, STruckLogo,
  SWhisperGo, SWife, type SP,
} from "./FuraScenesA";
import {
  SAigul, SAigulSays, SApples, SDialing, SEmptyShop, SFrown, SInvest, SLower, SMaratEnters, SMaratLeaves, SMaratOffer, SMaratOffer2,
  SMaratSpeech, SMaratWait, SMissed, SMorningCard, SNurlanCard, SNurlanFist, SNurlanSays, SNurlanShouts, SOperator, SPacingCall,
  SPart2Card, SPavilion, SRefusal,
} from "./FuraScenesB";
import { SAigulCries, SEndCard, SLookShelves, SNextEp, SRuslanCall, SStorm } from "./FuraScenesC";

const COMP: Record<SceneId, React.FC<SP>> = {
  hookSplat: SHookSplat, hookMoney: SHookMoney, title: STitle, rewind: SRewind,
  roadWide: SRoadWide, truckLogo: STruckLogo, danilaCard: SDanilaCard, cabSleep: SCabSleep, smoke: SSmoke, late: SLate, cargo: SCargo,
  cargoTotal: SCargoTotal, call: SCall, wife: SWife, hangup: SHangup, whisperGo: SWhisperGo, driving: SDriving, distracted: SDistracted,
  phoneFall: SPhoneFall, screech: SScreech, skid: SSkid, crashHit: SCrashHit, ditch: SDitch, spill: SSpill, climbOut: SClimbOut,
  bloody: SBloody, realize: SRealize, lastWhisper: SLastWhisper, morningCard: SMorningCard, pavilion: SPavilion, nurlanCard: SNurlanCard,
  apples: SApples, invest: SInvest, aigul: SAigul, aigulSays: SAigulSays, nurlanSays: SNurlanSays, missed: SMissed, frown: SFrown,
  dialing: SDialing, part2Card: SPart2Card, emptyShop: SEmptyShop, pacingCall: SPacingCall, nurlanShouts: SNurlanShouts, operator: SOperator,
  lower: SLower, maratEnters: SMaratEnters, maratSpeech: SMaratSpeech, nurlanFist: SNurlanFist, maratOffer: SMaratOffer,
  maratOffer2: SMaratOffer2, refusal: SRefusal, maratWait: SMaratWait, maratLeaves: SMaratLeaves, aigulCries: SAigulCries,
  lookShelves: SLookShelves, ruslanCall: SRuslanCall, storm: SStorm, nextEp: SNextEp, endCard: SEndCard,
};

const S = (s: number) => Math.round(s * FPS);

const Sound: React.FC = () => {
  const sfx = (at: number, dur: number, file: string, vol: number, loop = false) => (
    <Sequence from={Math.max(0, S(at))} durationInFrames={Math.max(1, S(dur))}>
      <Audio src={staticFile(`fura/sfx/${file}.mp3`)} volume={vol} loop={loop} />
    </Sequence>
  );
  const nightEnd = A("Утро Рынок");
  const road0 = A("Ночь Трасса");
  const mkt0 = A("Утро Рынок");
  const p2 = A("Часть вторая");
  return (
    <>
      <Sequence from={S(OFF)}><Audio src={staticFile(VO_FILE)} volume={1} /></Sequence>
      {/* открывающий удар */}
      {sfx(0.4, 1.6, "splat", 0.9)}
      {sfx(0.05, 1.2, "whoosh", 0.3)}
      {sfx(0.58, 3, "hit", 0.45)}
      {sfx(A("В кашу") - 0.1, 1.6, "splat", 0.55)}
      {sfx(A("Точка невозврата") - 0.05, 3, "hit", 0.3)}
      {sfx(A("Но давай по порядку") - 0.1, 2.2, "rewind", 0.5)}
      {/* ночь */}
      {sfx(0, nightEnd + 0.5, "rain", 0.5, true)}
      {sfx(road0, A("Данила сбрасывает звонок") - road0, "traffic", 0.09, true)}
      {sfx(road0, A("Данила сбрасывает звонок") - road0, "truck_idle", 0.07, true)}
      {sfx(A("Рядом с ним Данила") + 0.3, 1, "pop", 1)}
      {sfx(A("Данила нервно курит") + 0.15, 2.5, "lighter", 0.8)}
      {sfx(A("Он опаздывает"), 4, "tick", 1, true)}
      {sfx(A("Данила достаёт телефон") + 0.2, 3, "dial", 0.13)}
      {sfx(A("Данила сбрасывает звонок") + 0.1, 1.5, "hangup", 0.1)}
      {sfx(A("Он трогается") - 0.2, A("Телефон падает вниз") - A("Он трогается") + 1.5, "wipers", 0.16, true)}
      {sfx(A("Он трогается") - 0.1, 3, "truck_idle", 0.14)}
      {sfx(A("На секунду Данила отвлекается"), 8, "riser", 0.22)}
      {sfx(A("Телефон падает вниз"), 1.5, "vibrate", 0.1)}
      {sfx(A("Визг тормозов"), 3, "screech", 0.42)}
      {sfx(A("Гудок"), 2.5, "horn", 0.28)}
      {sfx(A("Резкий поворот руля"), 5, "crash", 0.35)}
      {sfx(A("Грохот") - 0.1, 5, "crash", 0.65)}
      {sfx(A("Грохот"), 3, "hit", 0.5)}
      {sfx(A("Из кузова вываливаются"), 4, "spill", 1)}
      {sfx(A("Данила выбирается из кабины"), 14, "limp", 0.7, true)}
      {sfx(A("это катастрофа") + 0.2, 2.5, "loss", 0.22)}
      {sfx(A("Лицо в крови"), 12, "heart", 0.22, true)}
      {/* утро */}
      {sfx(mkt0 - 0.2, p2 - mkt0 + 0.3, "market", 1, true)}
      {sfx(A("Нурлан Двадцать восемь") + 0.3, 1, "pop", 1)}
      {sfx(A("Рядом суетится жена") + 0.4, 1, "pop", 1)}
      {sfx(A("Он достаёт телефон Десять"), 2.5, "vibrate", 0.12)}
      {sfx(A("Он набирает номер"), 6, "dial", 0.13)}
      {/* реальность */}
      {sfx(p2 - 0.1, 3, "hit", 0.3)}
      {sfx(p2, A("Над городом собирается гроза") - p2, "market", 0.4, true)}
      {sfx(A("Нурлан нервно ходит"), A("Что значит") - A("Нурлан нервно ходит"), "pacing", 1, true)}
      {sfx(A("Нурлан медленно опускает") + 0.2, 1.5, "hangup", 0.1)}
      {sfx(A("В этот момент в павильон") + 0.2, 1.2, "whoosh", 0.3)}
      {sfx(A("В этот момент в павильон") + 1.4, 1, "pop", 1)}
      {sfx(A("Нурлан молчит"), 14, "heart", 0.22, true)}
      {sfx(A("Марат уходит"), 3, "whoosh", 0.25)}
      {sfx(A("Потом на Марата") + 0.8, 4, "car", 0.8)}
      {sfx(A("Над городом собирается гроза") - 0.2, 6, "thunder", 0.35)}
      {sfx(A("Над городом собирается гроза"), 12, "rain", 0.4, true)}
      {sfx(A("Один деревянный ящик падает") + 0.4, 3, "crate", 0.6)}
      {sfx(A("Один деревянный ящик падает") + 0.5, 3, "hit", 0.45)}
      {sfx(A("В следующей серии") - 0.05, 3, "hit", 0.35)}
      {sfx(A("Точка невозврата Конец"), 3, "hit", 0.3)}
    </>
  );
};

export const Fura: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { sc, lt, dur, idx } = sceneAt(t);
  const Cur = COMP[sc.id];
  const fadeEnd = 1 - ramp(t, DURATION_SEC - 0.7, DURATION_SEC);
  const prev = idx > 0 ? SCENES[idx - 1] : null;
  void prev;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", inset: 0, opacity: cl(fadeEnd), filter: "contrast(1.04) saturate(1.05)" }}>
        <Cur t={t} lt={lt} dur={dur} />
      </div>
      <Sound />
    </AbsoluteFill>
  );
};
