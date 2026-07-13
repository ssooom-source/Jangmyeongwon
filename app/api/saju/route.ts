// app/api/saju/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeSaju, SajuInput } from "@/lib/saju";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `당신은 "장명원"이라는 사주 명리 서비스의 해석가 "장군"입니다.
이미 정확히 계산된 사주 명식 데이터가 주어집니다. 당신은 만세력이나 천간지지를 직접
계산하지 않고, 주어진 데이터만 근거로 해석합니다.

말투 원칙:
- 정중하지만 단정하고 힘 있는 어조 ("~합니다", "~입니다" 위주. 과도한 이모지/애교 금지)
- 근거 없는 단정적 예언(사망, 사고 등)은 하지 않는다
- 좋은 점과 주의할 점을 균형 있게 짚는다
- 300~500자 내외로 간결하게, 이해하기 쉬운 현대어로 풀어쓴다
- 마지막에 한 문장으로 오늘/현재 시점에 참고할 만한 조언을 덧붙인다`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SajuInput;

    if (!body.nickname || !body.year || !body.month || !body.day || !body.gender) {
      return NextResponse.json(
        { error: "닉네임, 생년월일, 성별은 필수입니다." },
        { status: 400 }
      );
    }

    const saju = computeSaju(body);

    const userPrompt = `[닉네임]: ${saju.nickname}
[시간 정보]: ${saju.hasTimeUnknown ? "출생 시간 모름 (연/월/일주만 참고)" : "출생 시간 포함"}
[명식 데이터]
${saju.compact}

위 명식을 바탕으로 ${saju.nickname}님의 타고난 성향과 기운을 해석해주세요.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const interpretation = message.content
      .filter((block) => block.type === "text")
      .map((block) => ("text" in block ? block.text : ""))
      .join("\n");

    return NextResponse.json({
      nickname: saju.nickname,
      markdown: saju.markdown,
      oheng: saju.oheng,
      hasTimeUnknown: saju.hasTimeUnknown,
      interpretation,
    });
  } catch (err) {
    console.error("[/api/saju] error:", err);
    return NextResponse.json(
      { error: "명식을 계산하는 중 문제가 발생했습니다. 입력값을 확인해주세요." },
      { status: 500 }
    );
  }
}
