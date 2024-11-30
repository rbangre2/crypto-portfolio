import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto Portfolio Tracker",
  description: "Track your cryptocurrency investments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text min-h-screen">{children}</body>
    </html>
  );
}
