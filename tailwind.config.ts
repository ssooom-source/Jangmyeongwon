import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hanji: "#F3EAD9",     // 배경
        gosuh: "#EDE3CE",     // 서브 배경 (카드)
        meok: "#201D1B",      // 본문 텍스트 (먹)
        jacheong: "#2B3A67",  // 포인트 1 (자청)
        jusa: "#A63A2E",      // 포인트 2 (주사)
        meokhoe: "#6B5F4F",   // 보조 텍스트
        meokhoeLight: "#D8CDB8", // 구분선/면
        oheng: {
          wood: "#3B6E4C",
          fire: "#A63A2E",
          earth: "#B8923F",
          metal: "#8C8578",
          water: "#201D1B",
        },
      },
      fontFamily: {
        display: ["'Nanum Myeongjo'", "serif"],
        body: ["'Noto Sans KR'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
