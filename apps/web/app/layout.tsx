import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { DM_Sans, Playfair_Display, Space_Grotesk } from "next/font/google";
import { colors, easing } from "@nutritale/shared";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["600"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: "NutriTale",
  description: "Cook from what you already have. Recipes that match your pantry.",
};

/** Shared tokens as CSS variables (--nt-forest, --nt-cream, ...). */
const tokenVars = Object.fromEntries([
  ...Object.entries(colors).map(([name, hex]) => [`--nt-${name}`, hex]),
  ["--nt-ease", easing.css],
]) as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      style={tokenVars}
      className={`${playfair.variable} ${dmSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
