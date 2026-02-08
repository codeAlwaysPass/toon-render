import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toon Render - AI驱动的UI生成平台",
  description: "使用TOON格式和AI快速生成UI组件",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
