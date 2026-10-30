import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Person, type Look, type Pose, cl, lerp, ramp, eio } from "../bunker/art";
import words from "./words.json";

const FPS = 30, END = 41.6;
export const FIGHT_FRAMES = Math.ceil(END * FPS);
const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";
const GY = 1500, S = 2.3;

const LK: Record<string, Look> = {
  box: { skin: "#8a5a3a", hair: "#15100c", top: "#2c7a4c", top2: "#6a3a9a", pants: "#5a86c0", shoes: "#f0f0f0", hairStyle: "short" },
  a1: { skin: "#f0c8a2", hair: "#2a2018", top: "#f2f2f2", top2: "#d8d8d8", pants: "#4a78b8", shoes: "#222", hairStyle: "short" },
  a2: { skin: "#e0b08a", hair: "#1a1a1a", top: "#1e1e24", top2: "#141418", pants: "#cfd2d8", shoes: "#222", hairStyle: "messy" },
  a3: { skin: "#d9a679", hair: "#3a2a1a", top: "#8a8e96", top2: "#6e727a", pants: "#3a3f58", shoes: "#222", hairStyle: "short", beard: true },
};
const ea = (a: number, b: number, g0: number, g1: number, g: number) => lerp(a, b, eio(ramp(g, g0, g1)));
const walk = (g: number, amp = 1): Pose => ({ walk: g * 9, amp, t: g });

/* камера: ключи [t, fx, fy, z] */
const CAM: [number, number, number, number][] = [
  [0, 540, 1000, 1.0], [6.4, 560, 1000, 1.05], [11.6, 540, 1000, 1.0], [12.4, 330, 900, 1.95], [15.4, 330, 900, 1.95], [16.7, 640, 1000, 1.0],
  [17.6, 640, 1000, 1.0], [23.8, 640, 1000, 1.12], [26.0, 720, 940, 1.8], [29.4, 720, 940, 1.9], [31.6, 700, 1000, 1.3], [32.8, 760, 1000, 1.25], [34.2, 700, 1050, 1.1], [35.6, 560, 1020, 1.0], [END, 540, 1000, 1.0],
];
const cam = (g: number) => {
  let i = 0; while (i < CAM.length - 2 && g > CAM[i + 1][0]) i++;
  const a = CAM[i], b = CAM[i + 1], k = eio(cl((g - a[0]) / (b[0] - a[0])));
  return { fx: lerp(a[1], b[1], k), fy: lerp(a[2], b[2], k), z: lerp(a[3], b[3], k) };
};

const Glow: React.FC<{ x: number; y: number; r: number; c: string; o?: number }> = ({ x, y, r, c, o = 1 }) => (
  <g opacity={o}><circle cx={x} cy={y} r={r * 2.4} fill={c} opacity={0.18} /><circle cx={x} cy={y} r={r * 1.5} fill={c} opacity={0.35} /><circle cx={x} cy={y} r={r} fill={c} /></g>
);
const Speed: React.FC<{ g: number; o: number; dir?: number }> = ({ g, o, dir = 1 }) => (
  <g opacity={o}>{Array.from({ length: 22 }).map((_, i) => { const y = 200 + ((i * 137) % 1300), l = 300 + ((i * 71) % 500), x = (((g * 2600 + i * 211) % 1900) - 400) * dir + (dir < 0 ? 1100 : 0); return <rect key={i} x={x} y={y} width={l} height={5} rx={3} fill="#fff" opacity={0.55} />; })}</g>
);
const T: React.FC<React.PropsWithChildren<{ x: number; y: number; s: number; c?: string; rot?: number; stroke?: string }>> = ({ x, y, s, c = "#fff", rot = 0, stroke = "#111", children }) => (
  <text x={x} y={y} fontSize={s} fontFamily={FONT} fontWeight={900} fill={c} textAnchor="middle" transform={`rotate(${rot} ${x} ${y})`} stroke={stroke} strokeWidth={s * 0.14} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>{children}</text>
);

export const FightVid: React.FC<{ audio?: boolean }> = ({ audio = false }) => {
  const frame = useCurrentFrame(); const g = frame / FPS;
  const c = cam(g);
  const sh = (a: number, b: number) => (g > a && g < b ? 1 - ramp(g, a, b) : 0);
  const shake = sh(32.88, 33.6) * 26 + sh(9.3, 9.8) * 10 + sh(16.6, 16.9) * 12;
  const sx = Math.sin(frame * 2.7) * shake, sy = Math.cos(frame * 3.3) * shake;

  /* ───── положения ───── */
  const bx = g < 16.2 ? 330 : ea(330, 640, 16.2, 16.75, g);
  const bPunch = g > 32.7 && g < 33.5 ? ramp(g, 32.7, 32.9) * (1 - ramp(g, 33.2, 33.5)) : 0;
  const bounce = Math.sin(g * 7) * 6;
  const a1x = g < 3.4 ? ea(1500, 780, 0.4, 3.2, g) : g < 16.4 ? 780 : g < 17.6 ? ea(780, 930, 16.4, 17.0, g) : g < 18.6 ? 930 : g < 32.8 ? ea(930, 880, 18.6, 19.2, g) : g < 33.8 ? ea(880, 1500, 32.9, 33.6, g) : 1500;
  const a3x = g < 3.6 ? ea(1650, 920, 0.6, 3.4, g) : g < 16.4 ? 920 : g < 17.6 ? ea(920, 1060, 16.4, 17.0, g) : g < 33.1 ? 1060 : g < 36 ? ea(1060, 1700, 33.1, 35.8, g) : 1700;
  const a2x = g < 3.8 ? ea(1800, 1020, 0.8, 3.6, g) : g < 6.4 ? 1020 : g < 8.4 ? ea(1020, 140, 6.4, 8.4, g) : g < 10 ? 140 : g < 14 ? ea(140, -300, 10, 11.5, g) : g < 17.6 ? -300 : g < 18.8 ? ea(-300, 330, 17.6, 18.8, g) : g < 33.2 ? 330 : g < 36 ? ea(330, -400, 33.2, 35.8, g) : -400;
  const a2behind = g > 6.4 && g < 10.4;
  const a1lying = g > 33.8;
  const a1x2 = a1lying ? 860 : a1x;
  const a1fly = g > 32.9 && g < 33.8 ? ramp(g, 32.9, 33.8) : 0;

  const lunge2 = g > 9.1 && g < 9.8;
  const wlk = (a: number, b: number) => (g > a && g < b ? walk(g, 1) : {});
  const rush = (g > 17.6 && g < 19) || (g > 0.4 && g < 3.8);
  const hit = (a: number, b: number) => g > a && g < b && Math.sin(g * 9) > 0;

  /* ───── слова ───── */
  let wi = -1; for (let i = 0; i < words.length; i++) if (g >= words[i].a - 0.02) wi = i;
  const cw = wi >= 0 ? words[wi] : null;
  const wk = cw ? eio(ramp(g, cw.a - 0.02, cw.a + 0.08)) : 0;
  const clean = cw ? cw.w.replace(/[.,?:]/g, "") : "";
  const red = /Тайсон|Майком/.test(clean);
  const showWord = cw && g < words[words.length - 1].b + 0.5;

  const faceGlow = ramp(g, 12.3, 12.8) * (1 - ramp(g, 16.2, 16.7));
  const hx = bx, hy = GY - 322 * S;

  const Shad: React.FC = () => <ellipse cx={0} cy={0} rx={0} ry={0} />;
  void Shad;
  return (
    <AbsoluteFill style={{ background: "#c9cbd0" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e4e6ea" /><stop offset="1" stopColor="#b9bcc3" /></linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a6a9b0" /><stop offset="1" stopColor="#7e8189" /></linearGradient>
          <radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.4} /></radialGradient>
        </defs>
        <g transform={`translate(${540 + sx},${960 + sy}) scale(${c.z}) translate(${-c.fx},${-c.fy})`}>
          {/* фон: стена, граффити, пол */}
          <rect x={-600} y={-600} width={2400} height={GY + 600} fill="url(#wall)" />
          <g opacity={0.5}><T x={420} y={520} s={420} c="#e87a8a" stroke="none" rot={-4}>БОКС</T><T x={300} y={1000} s={300} c="#e87a8a" stroke="none" rot={3}>БОЙ</T></g>
          {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-500 + i * 260} y={-600} width={10} height={GY + 600} fill="#00000010" />)}
          <rect x={-600} y={GY - 40} width={2400} height={600} fill="url(#floor)" />
          <rect x={-600} y={GY - 40} width={2400} height={14} fill="#00000030" />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-560 + i * 200} y={GY + 140 + (i % 3) * 120} width={110} height={10} rx={5} fill="#ffffff28" />)}
          <g>
            <ellipse cx={bx} cy={GY + 8} rx={150} ry={22} fill="#00000040" />
            <ellipse cx={a1x2} cy={GY + 8} rx={a1lying ? 220 : 140} ry={20} fill="#00000040" />
          </g>

          {/* A2 сзади */}
          {a2behind && <Person x={a2x} y={GY} s={S * 0.9} look={LK.a2} pose={{ ...wlk(6.4, 8.4), armR: lunge2 ? [160, 10] : undefined, armL: lunge2 ? [150, 10] : undefined, expr: "angry", t: g }} opacity={0.95} />}

          {/* A3 */}
          {a3x < 1600 && <Person x={a3x} y={GY} s={S} flip look={LK.a3} pose={{ ...(g > 0.6 && g < 3.6 ? walk(g) : g > 16.4 && g < 17.2 ? walk(g, 0.6) : {}), expr: g > 16.4 && g < 17.8 ? "surprised" : g > 18.6 && g < 33 ? "angry" : g > 33.1 ? "surprised" : "neutral", armR: hit(19.3, 24) ? [90, 5] : g > 33.1 ? [150, 30] : undefined, armL: g > 33.1 ? [150, 30] : undefined, ...(g > 33.1 && g < 36 ? walk(g, 1) : {}), t: g }} />}

          {/* A2 перед */}
          {!a2behind && a2x > -250 && a2x < 1500 && <Person x={a2x} y={GY} s={S} look={LK.a2} pose={{ ...(g > 0.8 && g < 3.8 ? { ...walk(g), expr: "neutral" as const } : g > 17.6 && g < 18.8 ? walk(g) : g > 33.2 && g < 36 ? walk(g, 1) : {}), expr: g > 33.2 ? "surprised" : g > 18.8 ? "angry" : g < 6.4 ? "neutral" : "angry", armL: hit(19.3, 24) ? [90, 5] : g > 33.2 ? [150, 30] : undefined, armR: g > 33.2 ? [150, 30] : undefined, t: g }} />}

          {/* A1 */}
          {!a1lying && <Person x={a1x2} y={GY - a1fly * 140 * Math.sin(a1fly * Math.PI)} s={S} flip look={LK.a1} pose={{ ...(g > 0.4 && g < 3.2 ? walk(g) : g > 16.4 && g < 17 ? walk(g, 0.6) : {}), rot: a1fly * 40, expr: g > 16.4 && g < 17.8 ? "surprised" : a1fly > 0 ? "surprised" : g > 17.6 ? "angry" : "neutral", armR: g > 24.8 && g < 32.9 ? [95, 5] : hit(19.3, 24) ? [90, 5] : undefined, lean: g > 24.8 && g < 32.9 ? -8 : 0, t: g }} />}
          {a1lying && <Person x={a1x2 - 120} y={GY - 40} s={S} flip look={LK.a1} pose={{ rot: -86, expr: "sleep", t: g }} />}

          {/* боксёр */}
          <Person x={bx} y={GY - (g < 16.2 ? bounce * 0.4 : 0)} s={S} look={LK.box}
            pose={{
              expr: g > 11.9 && g < 16.5 ? "angry" : g > 32.5 && g < 34 ? "angry" : g > 35.6 ? "neutral" : "angry",
              armL: bPunch > 0 ? [90 + 4, 4 + (1 - bPunch) * 80] : g > 36 ? [28, 130] : [35, 125],
              armR: g > 36 ? [28, 130] : g > 9.5 && g < 10.6 ? [95, 5] : [35, 125],
              lean: bPunch * 10 - Math.sin(g * 7) * 1.5, look: g < 6 ? 0.4 : 0, tilt: g > 9.2 && g < 10 ? 10 : 0, bob: g < 17 || (g > 36) ? 4 + Math.abs(Math.sin(g * 5)) * 6 : 6, t: g,
            }}
          />
          {faceGlow > 0 && <g><Glow x={hx - 14 * S} y={hy - 2 * S} r={9} c="#ff2a1a" o={faceGlow} /><Glow x={hx + 14 * S} y={hy - 2 * S} r={9} c="#ff2a1a" o={faceGlow} /></g>}

          {/* «лицо открыто» — мишень на лице A1 */}
          {g > 26.0 && g < 32.8 && (
            <g transform={`translate(${a1x2 + 30},${GY - 322 * S})`} opacity={ramp(g, 26.0, 26.5) * (1 - ramp(g, 32.4, 32.8))}>
              <circle r={120} fill="none" stroke="#ff3a2a" strokeWidth={9} strokeDasharray="26 18" transform={`rotate(${g * 90})`} />
              <line x1={-160} y1={0} x2={-60} y2={0} stroke="#ff3a2a" strokeWidth={9} /><line x1={160} y1={0} x2={60} y2={0} stroke="#ff3a2a" strokeWidth={9} />
              <line x1={0} y1={-160} x2={0} y2={-60} stroke="#ff3a2a" strokeWidth={9} /><line x1={0} y1={160} x2={0} y2={60} stroke="#ff3a2a" strokeWidth={9} />
              <T x={0} y={-190} s={70} c="#ff3a2a" stroke="#fff">ОТКРЫТ!</T>
            </g>
          )}
          {/* ошибка при «не сработало» */}
          {g > 10.4 && g < 12.0 && <g transform={`translate(${a2x + 40},${GY - 420}) scale(${0.6 + 0.4 * eio(ramp(g, 10.4, 10.7))})`}><line x1={-90} y1={-90} x2={90} y2={90} stroke="#e02a2a" strokeWidth={30} strokeLinecap="round" /><line x1={90} y1={-90} x2={-90} y2={90} stroke="#e02a2a" strokeWidth={30} strokeLinecap="round" /></g>}
          {/* удар */}
          {g > 32.85 && g < 33.7 && (
            <g transform={`translate(${a1x2 - 50},${GY - 420})`} opacity={1 - ramp(g, 33.0, 33.7)}>
              {Array.from({ length: 12 }).map((_, i) => <polygon key={i} points="0,-40 14,-150 -14,-150" fill={i % 2 ? "#fff36a" : "#ff8a1f"} transform={`rotate(${i * 30}) scale(${0.6 + ramp(g, 32.85, 33.2)})`} />)}
              <circle r={50 + 120 * ramp(g, 32.85, 33.4)} fill="none" stroke="#fff" strokeWidth={14} />
              <T x={0} y={30} s={130} c="#ffd23f" rot={-8}>БАХ!</T>
            </g>
          )}
        </g>

        {/* эффекты поверх кадра */}
        <Speed g={g} o={(ramp(g, 16.3, 16.55) * (1 - ramp(g, 16.7, 17.0))) * 0.9 + (g > 18.6 && g < 19.4 ? 0.5 : 0)} />
        {g > 24.0 && g < 26.2 && <rect width={1080} height={1920} fill="#000" opacity={0.0} />}
        {g > 26 && g < 32.6 && <rect width={1080} height={1920} fill="#10205a" opacity={0.12} />}
        <rect width={1080} height={1920} fill="#fff" opacity={g > 32.86 ? Math.max(0, 0.9 - (g - 32.86) * 9) * (g < 33.2 ? 1 : 0) : 0} />
        <rect width={1080} height={1920} fill="url(#vg)" />

        {/* шапка */}
        <g transform="translate(0,90)"><rect x={0} y={0} width={1080} height={110} fill="#14141a" opacity={0.9} />
          <text x={540} y={74} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff" letterSpacing={2}>ТРОЕ <tspan fill="#ffd23f">vs</tspan> ТАЙСОН</text></g>
        {g > 35.6 && <g transform={`translate(540,520) rotate(-5) scale(${2.2 - 1.2 * eio(ramp(g, 35.6, 36.0))})`} opacity={eio(ramp(g, 35.6, 36.0))}><rect x={-330} y={-70} width={660} height={130} rx={12} fill="none" stroke="#e02a2a" strokeWidth={12} /><T x={0} y={30} s={90} c="#e02a2a" stroke="#fff">ШАНСОВ НЕТ</T></g>}

        {/* субтитр: по слову */}
        {showWord && cw && (
          <g transform={`translate(540,1700) scale(${0.85 + 0.15 * wk})`} opacity={wk}>
            <T x={0} y={0} s={Math.min(150, 940 / Math.max(3.2, clean.length * 0.64))} c={red ? "#ffd23f" : "#fff"}>{clean.toLowerCase().replace(/^./, (m) => m)}</T>
          </g>
        )}
        <rect width={1080} height={1920} fill="#000" opacity={Math.max(1 - ramp(g, 0, 0.3), ramp(g, END - 0.6, END))} />
      </svg>
      {audio && <Audio src={staticFile("fight/mix.m4a")} />}
    </AbsoluteFill>
  );
};
