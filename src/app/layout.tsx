import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "starboard - 고객 후기를 수집하고 전시하세요",
  description:
    "3분 만에 후기 수집 페이지 생성, 1줄 코드로 웹사이트에 임베드. 고객의 사랑을 Wall of Love로 보여주세요.",
  keywords: ["testimonial", "review", "widget", "후기", "리뷰", "위젯"],
  authors: [{ name: "starboard" }],
  openGraph: {
    title: "starboard - 고객 후기 수집 & 전시 위젯",
    description: "고객의 사랑을 수집하고 예쁘게 전시하세요",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
