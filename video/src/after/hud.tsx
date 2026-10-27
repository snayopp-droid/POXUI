import React from "react";
import { AbsoluteFill } from "remotion";
import "@fontsource/press-start-2p/cyrillic-400.css";
import "@fontsource/press-start-2p/latin-400.css";
import { cl, ramp } from "./util";

export type HudState = { label: string; db: number; status?: string };

const status = (db: number) => (db < 20 ? "СПОКОЙНО" : db < 40 ? "НАСТОРОЖЕННО" : db < 60 ? "НЕЛОВКО" : db < 80 ? "ОПАСНО" : db < 100 ? "ТРЕВОГА" : "СМЕРТЕЛЬНО");
const segCol = (i: number, n: number) => {
  const k = i / (n - 1);
  return k < 0.45 ? "#43d36b" : k < 0.7 ? "#e8d24a" : k < 0.85 ? "#f08a2f" : "#ec3b3b";
};

const SEG = 26;
const DAY = 1826;
export const Hud: React.FC<{ hud: HudState | null; opacity?: number; captions: string[]; sub?: { who?: string; text: string; color?: string } | null; capIn?: number }> = ({ hud, opacity = 1, captions, sub, capIn = 1 }) => {
    const lit = hud ? Math.round(cl(hud.db / 110) * SEG) : 0;
  const hot = hud && hud.db >= 80;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", fontFamily: "Inter, 'DejaVu Sans', sans-serif" }}>
      <div style={{ position: "absolute", left: 40, top: 36, display: "flex", flexDirection: "column", gap: 12, width: 640 }}>
        {hud && (
          <div style={{ opacity, background: "rgba(12,14,18,0.84)", borderRadius: 26, padding: "20px 28px 22px", boxShadow: hot ? "0 0 0 3px #ec3b3b" : "0 8px 30px rgba(0,0,0,0.35)" }}>
            <div style={{ fontFamily: "'JetBrains Mono','DejaVu Sans Mono',monospace", fontSize: 22, letterSpacing: 3, color: "#aab0bb", fontWeight: 700 }}>{hud.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 8 }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 100, color: hot ? "#ff6a5a" : "#fff", lineHeight: 1.05 }}>{DAY}</span>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 34, color: hot ? "#ff6a5a" : "#fff" }}>ДЕНЬ</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono','DejaVu Sans Mono',monospace", fontSize: 24, letterSpacing: 4, color: "#c7ccd6", marginTop: 6, fontWeight: 700 }}>{hud.status ?? status(hud.db)}</div>
            <div style={{ display: "flex", gap: 5, marginTop: 16 }}>
              {Array.from({ length: SEG }, (_, i) => (
                <div key={i} style={{ flex: 1, height: 20, borderRadius: 4, background: i < lit ? segCol(i, SEG) : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>
        )}
        {captions.map((c, i) => (
          <div key={c + i} style={{ alignSelf: "flex-start", opacity: ramp(capIn, 0, 1), transform: `translateY(${(1 - ramp(capIn, 0, 1)) * 14}px)`, background: "rgba(12,14,18,0.82)", borderRadius: 18, padding: "10px 24px 12px", color: "#fff", fontSize: 38, fontWeight: 800, fontStyle: "italic", lineHeight: 1.18, maxWidth: 780 }}>
            {c}
          </div>
        ))}
      </div>
      {sub && (
        <div style={{ position: "absolute", bottom: 54, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "rgba(8,9,12,0.8)", borderRadius: 60, padding: "12px 44px 14px", color: "#fff", fontSize: 46, fontWeight: 600, display: "flex", gap: 16, alignItems: "center" }}>
            {sub.who && <span style={{ color: sub.color ?? "#ffd36a", fontSize: 30, fontWeight: 800, letterSpacing: 2 }}>{sub.who}</span>}
            <span>{sub.text}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const RuleCard: React.FC<{ n: string; text: string; k: number }> = ({ n, text, k }) => {
  const a = ramp(k, 0, 0.12) * (1 - ramp(k, 0.85, 1));
  return (
    <div style={{ position: "absolute", right: 56, top: 52, opacity: a, transform: `translateX(${(1 - ramp(k, 0, 0.12)) * 60}px)`, background: "rgba(12,14,18,0.86)", borderRadius: 24, padding: "18px 30px", borderLeft: "10px solid #ffcf3a", maxWidth: 560 }}>
      <div style={{ fontFamily: "'JetBrains Mono','DejaVu Sans Mono',monospace", fontSize: 22, letterSpacing: 4, color: "#ffcf3a", fontWeight: 800 }}>ПРАВИЛО №{n}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 46, fontWeight: 900, color: "#fff", marginTop: 6, lineHeight: 1.1 }}>{text}</div>
    </div>
  );
};

export const Title: React.FC<{ big: string; small?: string; k: number }> = ({ big, small, k }) => {
  const a = ramp(k, 0, 0.18) * (1 - ramp(k, 0.82, 1));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: a, background: `rgba(0,0,0,${0.35 * a})` }}>
      <div style={{ textAlign: "center", transform: `scale(${0.94 + 0.06 * ramp(k, 0, 0.3)})` }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 108, color: "#fff", textShadow: "0 6px 0 #c4372a, 0 0 40px rgba(0,0,0,0.6)", lineHeight: 1.25 }}>{big}</div>
        {small && <div style={{ fontFamily: "'JetBrains Mono','DejaVu Sans Mono',monospace", fontSize: 34, letterSpacing: 8, color: "#e9e5d8", marginTop: 30, fontWeight: 700 }}>{small}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const Fade: React.FC<{ a: number }> = ({ a }) => <AbsoluteFill style={{ background: "#000", opacity: a }} />;
