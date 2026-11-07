
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://kimtaehyun-schedule.netlify.app"),

  title: "김태현 공연 일정 | Official Schedule",

  description:
    "스탠드업 코미디언 김태현의 공연 일정, 공연장 정보와 예매 링크를 확인하세요.",

  openGraph: {
    title: "김태현 공연 일정",
    description:
      "스탠드업 코미디언 김태현의 공식 공연 일정과 예매 정보",
    url: "https://kimtaehyun-schedule.netlify.app/",
    siteName: "KIM TAEHYUN",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "김태현 공연 일정",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "김태현 공연 일정",
    description:
      "스탠드업 코미디언 김태현의 공식 공연 일정과 예매 정보",
    images: ["/og-image.png"],
  },
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <GoogleAnalytics gaId="G-WH9QXBJ328" />
    </html>
  );
}
