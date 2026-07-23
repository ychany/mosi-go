import type { Metadata } from "next";
import { Noto_Sans_KR, Gowun_Batang } from "next/font/google";
import "./globals.css";

// next/font — 빌드 시 셀프호스팅. 발표장 인터넷 없이도 서체 유지 (PROTOTYPE_PLAN §4)
const noto = Noto_Sans_KR({
  variable: "--font-noto",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

const batang = Gowun_Batang({
  variable: "--font-batang",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "모시GO — 고령자 의료동행 모빌리티 플랫폼",
  description: "집에서 병원, 다시 집까지. 읍·면 어르신의 정기 통원을 함께합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${noto.variable} ${batang.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
