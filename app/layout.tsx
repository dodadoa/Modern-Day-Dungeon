import type { Metadata } from "next";
import { Share_Tech_Mono, Cinzel } from "next/font/google";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

const cinzel = Cinzel({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "MDD — Knowledge Graph",
  description: "Modern Day Dungeon · Subterranean and Labyrinth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${shareTechMono.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
