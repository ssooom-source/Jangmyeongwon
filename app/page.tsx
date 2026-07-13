// app/page.tsx
"use client";

import { useState } from "react";
import OhengRadar from "@/components/OhengRadar";
import { OhengCounts } from "@/lib/saju";

interface ApiResult {
  nickname: string;
  markdown: string;
  oheng: OhengCounts;
  hasTimeUnknown: boolean;
  interpretation: string;
}

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<"남" | "여">("여");
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          year: Number(year),
          month: Number(month),
          day: Number(day),
          hour: timeUnknown || hour === "" ? undefined : Number(hour),
          minute: timeUnknown || minute === "" ? undefined : Number(minute),
          gender,
          calendar,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "알 수 없는 오류가 발생했습니다.");
      } else {
        setResult(data);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      {/* 워드마크 (Option B) */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="font-display font-extrabold text-3xl tracking-[0.2em]">
          장명원
        </h1>
        <span className="w-2.5 h-2.5 rounded-full bg-jusa" />
      </div>
      <p className="font-display text-sm text-meokhoe tracking-widest mb-12">
        將命院 · 사주 명식소
      </p>

      {!result && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gosuh border border-black/10 p-8 space-y-6"
        >
          <div>
            <label className="block text-xs text-meokhoe mb-2">닉네임</label>
            <input
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-hanji border border-black/10 px-4 py-3 font-body focus:outline-none focus:border-jacheong"
              placeholder="장군이 불러드릴 이름"
            />
          </div>

          <div>
            <label className="block text-xs text-meokhoe mb-2">생년월일</label>
            <div className="flex gap-2">
              <input
                required
                type="number"
                placeholder="연도"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-hanji border border-black/10 px-3 py-3 font-body focus:outline-none focus:border-jacheong"
              />
              <input
                required
                type="number"
                placeholder="월"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-24 bg-hanji border border-black/10 px-3 py-3 font-body focus:outline-none focus:border-jacheong"
              />
              <input
                required
                type="number"
                placeholder="일"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-24 bg-hanji border border-black/10 px-3 py-3 font-body focus:outline-none focus:border-jacheong"
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-meokhoe">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={calendar === "solar"}
                  onChange={() => setCalendar("solar")}
                />
                양력
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={calendar === "lunar"}
                  onChange={() => setCalendar("lunar")}
                />
                음력
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs text-meokhoe mb-2">
              태어난 시간 (모르면 체크)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="시"
                min={0}
                max={23}
                disabled={timeUnknown}
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="w-full bg-hanji border border-black/10 px-3 py-3 font-body focus:outline-none focus:border-jacheong disabled:opacity-40"
              />
              <input
                type="number"
                placeholder="분"
                min={0}
                max={59}
                disabled={timeUnknown}
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="w-full bg-hanji border border-black/10 px-3 py-3 font-body focus:outline-none focus:border-jacheong disabled:opacity-40"
              />
            </div>
            <label className="flex items-center gap-1.5 mt-2 text-xs text-meokhoe">
              <input
                type="checkbox"
                checked={timeUnknown}
                onChange={(e) => setTimeUnknown(e.target.checked)}
              />
              시간 모름 (연/월/일주만 해석)
            </label>
          </div>

          <div>
            <label className="block text-xs text-meokhoe mb-2">성별</label>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={gender === "여"}
                  onChange={() => setGender("여")}
                />
                여
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={gender === "남"}
                  onChange={() => setGender("남")}
                />
                남
              </label>
            </div>
          </div>

          {error && <p className="text-jusa text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="seal-press w-full bg-jacheong text-hanji font-display font-bold py-4 tracking-[0.3em] disabled:opacity-50"
          >
            {loading ? "명식을 여는 중..." : "명식 열기"}
          </button>
        </form>
      )}

      {result && (
        <div className="w-full max-w-md space-y-8">
          <div className="bg-gosuh border border-black/10 p-8 flex flex-col items-center">
            <p className="font-display text-lg mb-6">
              {result.nickname}님의 오행
            </p>
            <OhengRadar oheng={result.oheng} />
            {result.hasTimeUnknown && (
              <p className="text-xs text-meokhoe mt-4">
                * 출생 시간을 몰라 연·월·일주만 반영되었습니다.
              </p>
            )}
          </div>

          <div className="bg-gosuh border border-black/10 p-8">
            <p className="font-display text-sm text-jacheong mb-3">
              장군의 해석
            </p>
            <p className="font-body text-[15px] leading-relaxed whitespace-pre-line">
              {result.interpretation}
            </p>
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full border border-jacheong text-jacheong font-display py-3 tracking-widest"
          >
            다시 보기
          </button>
        </div>
      )}
    </main>
  );
}
