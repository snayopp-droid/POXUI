import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BOT, Snow, TOP, cl, eout, ramp } from "./core";
import { SRT_LINES } from "../Bilet";

/** шортс 9:16: фрагмент серии + концовка «продолжение в профиле» */
export const SHORT_FROM = 180.4;
export const SHORT_LEN = 30.2;
export const SHORT_END = 4.2;
export const SHORT_FRAMES = Math.round((SHORT_LEN + SHORT_END) * 30);

const BLACK = "'Inter', 'Inter Display', 'Liberation Sans', sans-serif";
const VW = 1080;
const VH = 1920;
/** видимая часть кадра серии: без каше, центр 1440 px по ширине */
const CROP_W = 1150;
const CROP_H = BOT - TOP;
const SC = VW / CROP_W;
const FH = CROP_H * SC;
const FY = 500;

export const BiletShort: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const src = SHORT_FROM + t;
  const inEnd = t >= SHORT_LEN;
  const line = !inEnd ? SRT_LINES.find((l) => src >= l.a && src <= l.b) : undefined;
  const words = line ? line.text.replace(/[«»]/g, "").split(" ") : [];
  const k = inEnd ? eout(ramp(t, SHORT_LEN, SHORT_LEN + 0.6)) : 0;
  const video = (blur: boolean) => (
    <OffthreadVideo
      src={staticFile("bilet/ep1.mp4")}
      startFrom={Math.round(SHORT_FROM * 30)}
      muted
      style={
        blur
          ? { position: "absolute", width: 1920 * 2.4, height: 1080 * 2.4, left: (VW - 1920 * 2.4) / 2, top: (VH - 1080 * 2.4) / 2, filter: "blur(40px) brightness(0.35)" }
          : { position: "absolute", width: 1920 * SC, height: 1080 * SC, left: -((1920 - CROP_W) / 2) * SC, top: FY - TOP * SC }
      }
    />
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={Math.round(SHORT_LEN * 30)}>
        {video(true)}
        <div style={{ position: "absolute", left: 0, top: FY, width: VW, height: FH, overflow: "hidden", boxShadow: "0 0 80px #000" }}>
          <div style={{ position: "absolute", left: 0, top: -FY, width: VW, height: VH }}>{video(false)}</div>
        </div>
        <Audio src={staticFile("bilet/ep1.mp4")} startFrom={Math.round(SHORT_FROM * 30)} />
        {/* заголовок-крючок */}
        <div style={{ position: "absolute", top: 150, left: 20, right: 20, textAlign: "center", fontFamily: BLACK, fontWeight: 900, color: "#fff", fontSize: 88, whiteSpace: "nowrap", lineHeight: 1.02, letterSpacing: -2, textShadow: "0 6px 0 #000, 0 0 30px #000" }}>
          ПРИЕХАЛ В <span style={{ color: "#ffc94a" }}>NEW YORK</span>
          <br />
          <span style={{ display: "inline-block", marginTop: 22, background: "#d8321f", padding: "4px 28px", transform: "rotate(-2deg)", fontSize: 84 }}>И ЕГО ОБМАНУЛИ</span>
        </div>
        {/* субтитры */}
        {line && (
          <div style={{ position: "absolute", top: FY + FH + 70, left: 70, right: 70, textAlign: "center", fontFamily: BLACK, fontWeight: 900, fontSize: 66, lineHeight: 1.15, color: "#fff", textShadow: "0 5px 0 #000, 0 0 24px #000" }}>
            {words.map((w, i) => {
              const on = line.a + ((line.b - line.a - 0.3) * i) / Math.max(1, words.length) <= src;
              return (
                <span key={i} style={{ color: on ? "#fff" : "rgba(255,255,255,0.45)" }}>
                  {w}{" "}
                </span>
              );
            })}
          </div>
        )}
        <div style={{ position: "absolute", bottom: 120, width: VW, textAlign: "center", fontFamily: BLACK, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "#cfc5b2" }}>
          БИЛЕТ В ОДИН КОНЕЦ · СЕРИЯ 1
        </div>
      </Sequence>
      {/* концовка */}
      <Sequence from={Math.round(SHORT_LEN * 30)}>
        <AbsoluteFill style={{ background: "#050608" }}>
          <svg width={VW} height={VH} style={{ position: "absolute" }}>
            <Snow t={t} n={160} size={4} speed={70} wind={-20} o={0.6} x0={0} x1={VW} y0={0} y1={VH} />
          </svg>
          <div style={{ position: "absolute", top: 560, width: VW, textAlign: "center", fontFamily: BLACK, fontWeight: 900, opacity: k, transform: `scale(${0.85 + k * 0.15})` }}>
            <div style={{ fontSize: 120, color: "#fff", letterSpacing: -2 }}>ЧТО ДАЛЬШЕ?</div>
            <div style={{ marginTop: 50, display: "inline-block", background: "#d8321f", color: "#fff", fontSize: 76, padding: "10px 40px" }}>ПРОДОЛЖЕНИЕ</div>
            <div style={{ marginTop: 30, fontSize: 76, color: "#ffc94a" }}>В ПРОФИЛЕ</div>
            <div style={{ marginTop: 40, fontSize: 150, color: "#fff", transform: `translateY(${-Math.abs(Math.sin(t * 4)) * 30}px)` }}>↑</div>
            <div style={{ marginTop: 60, fontSize: 38, letterSpacing: 8, color: "#cfc5b2", fontWeight: 700, opacity: cl((t - SHORT_LEN - 0.8) * 2) }}>БИЛЕТ В ОДИН КОНЕЦ</div>
          </div>
        </AbsoluteFill>
        <Audio src={staticFile("bilet/sfx/film_title_hit.mp3")} volume={0.9} />
        <Audio src={staticFile("bilet/sfx/snow_wind.mp3")} volume={0.25} />
      </Sequence>
    </AbsoluteFill>
  );
};
