import React from "react";
import { Bar, Bubble, FONT, Grain, INK, PaperBG, PhoneProp, Person, PriceTag, RED, Stamp, Svg, TAU, Vignette, W, H, YEL, GREEN, cl, easeIn, easeInOut, easeOut, lerp, pop, ramp, rnd, Crate } from "./FuraArt";
import { A, Z, talking } from "./timelineF";
import type { SP } from "./FuraScenesA";
import { AIGUL, NURLAN, PavilionWorld } from "./FuraScenesB";

const phoneHand = <g transform="translate(8,-18) rotate(14) scale(1.25)"><PhoneProp glow={false} /></g>;

export const SAigulCries: React.FC<SP> = ({ t, lt }) => {
  const talk = talking("aigul", t);
  return (
    <Svg>
      <PavilionWorld t={t} cx={760} cy={650} z={1.8} mood="empty" shelves={0}>
        <Person x={760} y={960} t={t} {...AIGUL} mood="sad" talk={talk * 0.6} tears={0.4 + Math.min(1, lt * 0.3)} tR={[64, -330]} tL={[-64, -240]} />
      </PavilionWorld>
      <Bubble x={1220} y={280} text="Что теперь, Нурлан? Что мы делать будем?" p={Math.min(1, lt / 2.4)} k={pop(lt, 0.15, 0.3)} tx={820} ty={430} max={22} size={44} />
      <Vignette o={0.9} />
    </Svg>
  );
};

export const SLookShelves: React.FC<SP> = ({ t, lt }) => {
  const t2 = A("Потом на улицу") - A("Нурлан смотрит на пустые");
  const t3 = A("Потом на Марата") - A("Нурлан смотрит на пустые");
  const stage = lt < t2 ? 0 : lt < t3 ? 1 : 2;
  const cams = [{ cx: 440, cy: 560, z: 1.7 }, { cx: 1700, cy: 560, z: 1.55 }, { cx: 1300, cy: 600, z: 1.5 }][stage];
  const lt0 = lt - (stage === 0 ? 0 : stage === 1 ? t2 : t3);
  return (
    <Svg>
      <PavilionWorld t={t} cx={cams.cx + lt0 * 10} cy={cams.cy} z={cams.z} mood="empty" shelves={0} doorOpen={stage === 1 ? 1 : 0} mercedes={stage === 2 ? ramp(lt0, 0, 1.4) : 0} passersby={stage === 1}>
        {stage === 2 && <Person x={1000} y={960} t={t} {...NURLAN} mood="sad" lookX={1} />}
        {stage === 0 && Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={200 + rnd(i) * 560} cy={300 + ((rnd(i + 3) * 500 + t * 12) % 460)} r={2 + rnd(i + 8) * 3} fill="#fff" opacity={0.5} />)}
      </PavilionWorld>
      {stage === 1 && (
        <g transform={`translate(1300 280) scale(${pop(lt0, 0.2, 0.35)})`}>
          <rect x={-190} y={-60} width={380} height={120} rx={18} fill="#1b1c24" stroke={INK} strokeWidth={4} />
          <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={YEL} opacity={0.75 + 0.25 * Math.sin(t * 6)} letterSpacing={6}>ОТКРЫТО</text>
        </g>
      )}
      <Vignette o={0.8} />
    </Svg>
  );
};

export const SRuslanCall: React.FC<SP> = ({ t, lt }) => {
  const a = A("Здорово Руслан");
  const z = Z("Срочно");
  const p = cl((lt + A("Он достаёт телефон и находит") - a) / (z - a));
  const sch = A("предлагал схемы") - A("Он достаёт телефон и находит");
  return (
    <Svg>
      <PavilionWorld t={t} cx={1000} cy={640} z={1.7} mood="empty" shelves={0} storm={ramp(lt, 0, 6) * 0.3}>
        <Person x={1000} y={960} t={t} {...NURLAN} mood="angry" talk={talking("ruslan", t) * 0.8} tR={[76, -372]} handR={phoneHand} />
      </PavilionWorld>
      <rect width={W} height={H} fill="#0a0d18" opacity={0.25} />
      <Bubble x={1360} y={250} text="Здорово, Руслан? Это Нурлан. Помнишь, ты предлагал «схемы»?.. Мне нужен твой совет. И деньги. Срочно" p={p} k={pop(lt, 0.8, 0.3)} tx={1070} ty={420} max={30} size={37} />
      <g transform={`translate(560 640) scale(${pop(lt, sch, 0.3)})`}>
        <rect x={-180} y={-60} width={360} height={120} rx={16} fill="#1b1c24" stroke={RED} strokeWidth={5} />
        <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={RED} letterSpacing={4}>«СХЕМЫ»</text>
      </g>
      <Vignette o={0.9} />
    </Svg>
  );
};

export const SStorm: React.FC<SP> = ({ t, lt }) => {
  const crateT = A("Один деревянный ящик падает") - A("Над городом собирается гроза");
  const q = ramp(lt, crateT, crateT + 0.45);
  const broke = lt > crateT + 0.45;
  const flash = (Math.sin(t * 1.9) > 0.93 || (lt > 1.2 && lt < 1.3)) ? 0.8 : 0;
  const end = ramp(lt, crateT + 1.2, crateT + 1.9);
  return (
    <Svg>
      <PavilionWorld t={t} cx={960 - lt * 3} cy={560} z={1.1 + lt * 0.01} mood="storm" storm={ramp(lt, 0, 1.2)} lightning={flash} shelves={0}>
        <Person x={1300} y={960} t={t} {...NURLAN} mood="sad" lookX={1} />
        {!broke && <Crate x={440} y={lerp(330, 960, q * q)} w={190} h={96} rot={q * 80} />}
        {broke && (
          <g>
            {Array.from({ length: 9 }).map((_, i) => {
              const k = ramp(lt, crateT + 0.45, crateT + 1.1);
              const a = (i / 9) * Math.PI + 0.1;
              return <rect key={i} x={440 + Math.cos(a) * (60 + rnd(i) * 160) * k - 40} y={960 - Math.sin(a) * (60 + rnd(i + 2) * 100) * k + 6 * k} width={80 + rnd(i) * 40} height={14} fill="#c98d4a" stroke={INK} strokeWidth={3} transform={`rotate(${rnd(i) * 160 - 80} ${440 + Math.cos(a) * 80 * k} ${960 - Math.sin(a) * 60 * k})`} />;
            })}
          </g>
        )}
      </PavilionWorld>
      <rect width={W} height={H} fill="#fff" opacity={flash * 0.4} />
      <rect width={W} height={H} fill="#000" opacity={end} />
      <Vignette o={0.9} />
    </Svg>
  );
};

export const SNextEp: React.FC<SP> = ({ t, lt }) => {
  const items = [
    { text: "Долг", from: A("вернуть долг") - A("В следующей серии"), col: RED },
    { text: "Криминал", from: A("игра с криминалом") - A("В следующей серии"), col: "#8a92a8" },
    { text: "Цена ошибки — жизнь", from: A("не деньги а жизнь") - A("В следующей серии"), col: "#8e1b1b" },
  ];
  return (
    <Svg>
      <rect width={W} height={H} fill="#10131c" />
      <text x={960} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={30} fill="#8a92a8" letterSpacing={14}>В СЛЕДУЮЩЕЙ СЕРИИ</text>
      <text x={960} y={400} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#fff">Нурлан идёт на всё</text>
      {items.map((it, i) => {
        const k = pop(lt, it.from - 0.4, 0.3);
        return (
          <g key={i} transform={`translate(960 ${590 + i * 130}) scale(${k})`} opacity={cl(k * 2)}>
            <rect x={-360} y={-52} width={720} height={104} rx={22} fill="#1b1f2c" stroke={it.col} strokeWidth={5} />
            <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={56} fill={it.col}>{it.text}</text>
          </g>
        );
      })}
      <Bar x={560} y={990} w={800} v={ramp(lt, 0.5, 6) * 0.35} col={RED} h={18} />
      <Grain t={t} o={0.06} />
    </Svg>
  );
};

export const SEndCard: React.FC<SP> = ({ t, lt }) => (
  <Svg>
    <rect width={W} height={H} fill="#06080f" />
    <g opacity={ramp(lt, 0.2, 0.9)}>
      <text x={960} y={470} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={30} fill="#8a92a8" letterSpacing={14}>КОНЕЦ ПЕРВОЙ СЕРИИ</text>
      <text x={960} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#fff" letterSpacing={3}>ТОЧКА НЕВОЗВРАТА</text>
      <rect x={560} y={632} width={800 * easeOut(ramp(lt, 0.5, 1.4))} height={8} fill={RED} />
      <text x={960} y={730} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={YEL} opacity={ramp(lt, 1.4, 2.0)}>Серия 2 — скоро</text>
      <text x={960} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={32} fill="#6a7288" opacity={ramp(lt, 2.0, 2.6)}>Что бы ты сделал на месте Нурлана?</text>
    </g>
    <Grain t={t} o={0.06} />
  </Svg>
);

export { PaperBG, PriceTag, Stamp, TAU, GREEN, easeIn, easeInOut };
