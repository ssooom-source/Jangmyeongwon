// components/OhengRadar.tsx
"use client";

import { OhengCounts } from "@/lib/saju";

const LABELS: { key: keyof OhengCounts; hanja: string; color: string }[] = [
  { key: "wood", hanja: "木", color: "#3B6E4C" },
  { key: "fire", hanja: "火", color: "#A63A2E" },
  { key: "earth", hanja: "土", color: "#B8923F" },
  { key: "metal", hanja: "金", color: "#8C8578" },
  { key: "water", hanja: "水", color: "#201D1B" },
];

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 96;

function pointOnCircle(index: number, total: number, radius: number) {
  // 정오각형, 12시 방향부터 시계방향
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export default function OhengRadar({ oheng }: { oheng: OhengCounts }) {
  const max = Math.max(5, ...LABELS.map((l) => oheng[l.key]));

  const dataPoints = LABELS.map((l, i) => {
    const ratio = oheng[l.key] / max;
    const p = pointOnCircle(i, LABELS.length, RADIUS * ratio);
    return `${p.x},${p.y}`;
  }).join(" ");

  const gridRings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* 배경 오각형 그리드 */}
        {gridRings.map((r, ringIdx) => {
          const pts = LABELS.map((_, i) => {
            const p = pointOnCircle(i, LABELS.length, RADIUS * r);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <polygon
              key={ringIdx}
              points={pts}
              fill="none"
              stroke="#D8CDB8"
              strokeWidth={1}
            />
          );
        })}

        {/* 중심에서 각 꼭짓점으로 뻗는 축 */}
        {LABELS.map((_, i) => {
          const p = pointOnCircle(i, LABELS.length, RADIUS);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke="#D8CDB8"
              strokeWidth={1}
            />
          );
        })}

        {/* 실제 데이터 오각형 */}
        <polygon
          points={dataPoints}
          fill="#2B3A67"
          fillOpacity={0.25}
          stroke="#2B3A67"
          strokeWidth={2}
        />

        {/* 꼭짓점 라벨 (한자 + 색상 점) */}
        {LABELS.map((l, i) => {
          const labelPoint = pointOnCircle(i, LABELS.length, RADIUS + 28);
          const dotPoint = pointOnCircle(i, LABELS.length, RADIUS * (oheng[l.key] / max));
          return (
            <g key={l.key}>
              <circle cx={dotPoint.x} cy={dotPoint.y} r={5} fill={l.color} />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="'Nanum Myeongjo', serif"
                fontWeight={700}
                fontSize={20}
                fill="#201D1B"
              >
                {l.hanja}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 숫자 확인용 범례 */}
      <div className="flex gap-4 text-xs text-meokhoe font-body">
        {LABELS.map((l) => (
          <div key={l.key} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: l.color }}
            />
            <span>
              {l.hanja} {oheng[l.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
