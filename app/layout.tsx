import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "復縁サポート｜会員サイト", description: "動画講義とワークに取り組むための復縁サポート会員サイトです。" };

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
