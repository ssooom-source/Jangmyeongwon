import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "장명원 將命院",
  description: "닉네임과 생년월일로 여는 나의 명식 — 장명원",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-hanji text-meok antialiased">
        {children}
      </body>
    </html>
  );
}
