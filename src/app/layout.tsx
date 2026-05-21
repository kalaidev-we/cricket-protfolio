import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Legend's Arena | Interactive Storytelling Cricket Portfolio",
  description: "An immersive, cinematic sports documentary experience tracing the journey, career statistics, achievements, and real-time AI stance analysis of a elite professional cricketer.",
  keywords: ["Cricket Portfolio", "Sports Documentary", "Interactive Storytelling", "Cricket AI Stance Analyzer", "Web3D Cricket"],
  authors: [{ name: "Professional Athlete" }],
  openGraph: {
    title: "The Legend's Arena | Interactive Storytelling Cricket Portfolio",
    description: "An immersive, cinematic sports documentary experience tracing the journey of an elite professional cricketer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="bg-primary text-white min-h-full flex flex-col font-sans selection:bg-accent selection:text-primary">
        {children}
      </body>
    </html>
  );
}
