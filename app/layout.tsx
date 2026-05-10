import type { Metadata } from "next";
import { Gowun_Batang, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 제목용 — 따뜻하고 우아한 한국어 세리프체
const gowunBatang = Gowun_Batang({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// 본문용 — 가독성 좋은 한국어 산세리프체
const notoSansKR = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "두근두근 창업시그널",
  description: "창업의 설렘, 함께할 팀원을 찾다 — 대학생 창업팀 매칭 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gowunBatang.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
