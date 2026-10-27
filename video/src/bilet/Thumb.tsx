import React from "react";
import { Glow, Snow, Svg, W, H } from "./core";
import { Phone } from "./env";
import { Profile } from "./figures";
import { MoscowYard, UnderBridge } from "./scenesA";

const BLACK = "'Inter', 'Inter Display', 'Liberation Sans', sans-serif";

/** превью для YouTube: Москва (холод) | Нью-Йорк (ночь), крупный план, крупный текст */
export const BiletThumb: React.FC<{ v?: number }> = ({ v = 1 }) => (
  <Svg bg="#000">
    <defs>
      <clipPath id="th-l">
        <polygon points="0,0 880,0 700,1080 0,1080" />
      </clipPath>
      <clipPath id="th-r">
        <polygon points="880,0 1920,0 1920,1080 700,1080" />
      </clipPath>
      <linearGradient id="th-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="40%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.85} />
      </linearGradient>
    </defs>
    {/* слева — Москва */}
    <g clipPath="url(#th-l)">
      <g transform="translate(-300 -260) scale(1.3)">
        <MoscowYard t={2} pan={60} />
      </g>
      <rect width={W} height={H} fill="#4a6078" opacity={0.25} />
      <Snow t={3} n={160} size={3} speed={100} wind={-30} o={0.8} />
    </g>
    {/* справа — Нью-Йорк ночью */}
    <g clipPath="url(#th-r)">
      <g transform="translate(-420 -380) scale(1.25)">
        <UnderBridge t={4} />
      </g>
      <Glow x={1500} y={420} r={700} k="sodium" o={0.55} />
      <Snow t={5} n={140} size={3} speed={100} wind={-30} o={0.7} seed={4} />
    </g>
    {/* разлом */}
    <polygon points="872,0 888,0 708,1080 692,1080" fill="#f2e6cf" opacity={0.9} />
    {/* герой */}
    <Glow x={1150} y={560} r={600} k="warm" o={0.5} />
    <Profile x={880} y={720} s={2.15} id="th" mood="sad" light="#ffcf94" lit="front" tear={0.42} dark={0.05} look={1} />
    <rect width={W} height={H} fill="url(#th-fade)" />
    {/* телефон с остатком денег */}
    <g transform="translate(1560 620) rotate(10)">
      <Phone x={0} y={0} s={0.62} crack={1} id="thph">
        <rect width={380} height={800} fill="#10141c" />
        {v === 1 ? (
          <g>
            <text x={190} y={300} fontFamily={BLACK} fontWeight={900} fontSize={44} fill="#9aa3b2" textAnchor="middle">
              БАЛАНС
            </text>
            <text x={190} y={430} fontFamily={BLACK} fontWeight={900} fontSize={120} fill="#ff5a3c" textAnchor="middle">
              $140
            </text>
          </g>
        ) : (
          <g>
            <circle cx={190} cy={250} r={70} fill="#6e2f25" />
            <text x={190} y={276} fontFamily={BLACK} fontWeight={900} fontSize={70} fill="#fff" textAnchor="middle">
              D
            </text>
            <text x={190} y={390} fontFamily={BLACK} fontWeight={900} fontSize={46} fill="#fff" textAnchor="middle">
              Danny
            </text>
            <text x={190} y={450} fontFamily={BLACK} fontWeight={700} fontSize={30} fill="#ff5a3c" textAnchor="middle">
              недоступен
            </text>
          </g>
        )}
      </Phone>
    </g>
    {/* текст */}
    {v === 1 ? (
      <g>
        <text x={70} y={210} fontFamily={BLACK} fontWeight={900} fontSize={150} fill="#fff" stroke="#000" strokeWidth={14} paintOrder="stroke" letterSpacing={-3}>
          ИЗ МОСКВЫ
        </text>
        <text x={70} y={360} fontFamily={BLACK} fontWeight={900} fontSize={150} fill="#ffc94a" stroke="#000" strokeWidth={14} paintOrder="stroke" letterSpacing={-3}>
          В NEW YORK
        </text>
        <g transform="translate(70 900) rotate(-3)">
          <rect x={0} y={-96} width={760} height={130} fill="#d8321f" />
          <text x={380} y={6} fontFamily={BLACK} fontWeight={900} fontSize={92} fill="#fff" textAnchor="middle" letterSpacing={2}>
            ОБМАНУЛИ
          </text>
        </g>
      </g>
    ) : (
      <g>
        <text x={70} y={230} fontFamily={BLACK} fontWeight={900} fontSize={170} fill="#fff" stroke="#000" strokeWidth={16} paintOrder="stroke" letterSpacing={-4}>
          $1800
        </text>
        <text x={70} y={420} fontFamily={BLACK} fontWeight={900} fontSize={170} fill="#ff5a3c" stroke="#000" strokeWidth={16} paintOrder="stroke" letterSpacing={-4}>
          → $140
        </text>
        <text x={70} y={930} fontFamily={BLACK} fontWeight={900} fontSize={84} fill="#fff" stroke="#000" strokeWidth={10} paintOrder="stroke">
          ЗА 1 НЕДЕЛЮ В NEW YORK
        </text>
      </g>
    )}
  </Svg>
);
export const BiletThumb2: React.FC = () => <BiletThumb v={2} />;
