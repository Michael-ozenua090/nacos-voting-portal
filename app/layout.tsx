import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NACOS Dinner & Award Night | Voting Portal",
    template: "%s | NACOS Awards",
  },
  description:
    "Cast your vote for the best and brightest at the NACOS Dinner & Award Night. 1 Vote = ₦100. Support your favourite nominees today.",
  keywords: ["NACOS", "Awards", "Voting", "University", "Nigeria", "Tech"],
  openGraph: {
    title: "NACOS Dinner & Award Night",
    description: "Vote for your favourite nominees. 1 Vote = ₦100.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body bg-nacos-light antialiased">{children}</body>
    </html>
  );
}
