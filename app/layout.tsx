import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Lily Support｜ミドルエンド会員サイト", description: "動画講義とワークを通じて、一人ひとりの変化を支える専用会員サイトです。" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
