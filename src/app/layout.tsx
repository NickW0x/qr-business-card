import type { Metadata, Viewport } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";

import { businessCard } from "@/config/business-card";
import { getSiteUrl } from "@/lib/site-url";
import { Analytics } from "@vercel/analytics/next"

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${businessCard.name} — QR Business Card`,
    template: `%s | ${businessCard.name}`,
  },
  description: businessCard.bio,
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    siteName: businessCard.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: businessCard.photo,
        width: 400,
        height: 400,
        alt: businessCard.name,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">{children}</body>
      <Analytics />
    </html>
  );
}
