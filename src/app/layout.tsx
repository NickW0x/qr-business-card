import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { businessCard } from "@/config/business-card";
import { getSiteUrl } from "@/lib/site-url";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
