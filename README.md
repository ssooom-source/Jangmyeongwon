# 장명원 (將命院)

닉네임 + 생년월일을 입력하면 만세력 기반으로 사주를 계산하고,
오행 분포를 레이더 차트로 보여주며, Claude API가 해석 텍스트를 생성하는
사주 사이트입니다.

## 스택
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (장명원 팔레트: 한지/먹/자청/주사)
- 만세력 계산: `ssaju` (npm)
- AI 해석: Anthropic Claude API (`@anthropic-ai/sdk`)
- 배포: Vercel

## 시작하기

```bash
npm install
```

`.env.local` 파일을 만들고 Claude API 키를 넣어주세요.

```
ANTHROPIC_API_KEY=sk-ant-...
```

```bash
npm run dev
```

http://localhost:3000 에서 확인.

## 폴더 구조

```
app/
  page.tsx                # 입력 폼 + 결과 화면
  api/saju/route.ts       # 만세력 계산 + AI 해석 API
  layout.tsx
  globals.css
components/
  OhengRadar.tsx           # 오행 레이더 차트 (순수 SVG)
lib/
  saju.ts                  # ssaju 래퍼 (계산 로직은 여기 한 곳에서만 처리)
```

## 다음에 할 일 (제안)
1. `npm install` 후 콘솔에서 `ssaju`의 `calculateSaju()` 결과를 한 번 직접 찍어보고,
   `lib/saju.ts`의 `parseOhengCounts` 정규식이 실제 출력과 맞는지 확인하기
   (라이브러리 버전에 따라 출력 포맷이 조금 다를 수 있어요).
2. 시주(태어난 시간) 입력을 안 한 경우, 프롬프트/화면에 "일부만 참고" 안내가
   잘 나오는지 실제 케이스로 테스트.
3. 장군 캐릭터 일러스트는 Midjourney 등으로 별도 제작 후 삽입 (은하수 때 쓰신
   방식과 동일하게 진행하면 톤이 맞을 거예요).
4. 결과 화면에 "결과 저장/공유" 버튼 붙이려면 이미지 캡처(html-to-image 등)
   또는 OG 이미지 생성 API 추가 검토.
5. 상표: "장명원" 실사용 전 키프리스(kipris.or.kr)에서 상표 등록 여부 확인 권장.
