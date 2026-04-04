import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "JobWrite - AI 자기소개서 작성 서비스",
  description: "AI가 당신의 이야기를 가장 빛나는 자기소개서로 만들어 드립니다. 합격률을 높이는 맞춤형 자소서를 지금 바로 작성해보세요.",
  keywords: "자기소개서, 자소서, AI 자소서, 취업, 이직, 합격",
  openGraph: {
    title: "JobWrite - AI 자기소개서 작성 서비스",
    description: "AI가 당신의 이야기를 가장 빛나는 자기소개서로 만들어 드립니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
