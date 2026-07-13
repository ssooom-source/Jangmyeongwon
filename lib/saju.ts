// lib/saju.ts
// ssaju(npm) 라이브러리를 감싸서, 우리 서비스에서 필요한 형태로만 노출합니다.
// - AI 프롬프트용 텍스트 (toCompact)
// - 화면 표시용 명식 텍스트 (toMarkdown)
// - 오행 레이더 차트용 숫자 배열 (오행 카운트 파싱)
//
// 참고: ssaju는 계산된 원국/십성/대운/세운 등을 모두 문자열로도 제공합니다.
// 실제 배포 전에 `npm install`, `npm run dev` 로 콘솔에 result 객체를 한 번
// 찍어보고, 아래 parseOhengCounts의 정규식이 실제 출력과 맞는지 꼭 확인하세요.

import { calculateSaju } from "ssaju";

export type Gender = "남" | "여";

export interface SajuInput {
  nickname: string;
  year: number;
  month: number;
  day: number;
  hour?: number; // 모르면 생략 (연/월/일주까지만 정확)
  minute?: number;
  gender: Gender;
  calendar?: "solar" | "lunar";
  isLeapMonth?: boolean;
}

export interface OhengCounts {
  wood: number; // 목
  fire: number; // 화
  earth: number; // 토
  metal: number; // 금
  water: number; // 수
}

export interface SajuResult {
  nickname: string;
  markdown: string; // 명식표 등 사람이 읽기 좋은 형태
  compact: string; // AI 프롬프트에 넣을 압축 형태
  oheng: OhengCounts;
  hasTimeUnknown: boolean;
}

function parseOhengCounts(markdown: string): OhengCounts {
  // ssaju의 toMarkdown() 출력에는
  // "## 오행 ... 계: 목0 화2 토3 금2 수1" 형태의 줄이 포함됩니다.
  const line = markdown.split("\n").find((l) => l.includes("계:") && l.includes("목"));

  const fallback: OhengCounts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  if (!line) return fallback;

  const grab = (label: string) => {
    const m = line.match(new RegExp(`${label}(\\d+)`));
    return m ? parseInt(m[1], 10) : 0;
  };

  return {
    wood: grab("목"),
    fire: grab("화"),
    earth: grab("토"),
    metal: grab("금"),
    water: grab("수"),
  };
}

export function computeSaju(input: SajuInput): SajuResult {
  const hasTimeUnknown = input.hour === undefined;

  const result = calculateSaju({
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour ?? 12, // 시간을 모르면 정오로 대체 (시주 제외하고 해석하도록 안내 문구 추가)
    minute: input.minute ?? 0,
    gender: input.gender === "남" ? "남" : "여",
    calendar: input.calendar ?? "solar",
    leap: input.isLeapMonth ?? false,
    timezone: "Asia/Seoul",
  });

  const markdown = result.toMarkdown();
  const compact = result.toCompact();
  const oheng = parseOhengCounts(markdown);

  return {
    nickname: input.nickname,
    markdown,
    compact,
    oheng,
    hasTimeUnknown,
  };
}
