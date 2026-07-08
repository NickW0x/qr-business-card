import type { Metadata } from "next";

import { GalaxyBackground } from "@/components/backgrounds/galaxy-background";
import { QrShowcaseView } from "@/components/qr-showcase/qr-showcase-view";
import { businessCard } from "@/config/business-card";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Scan to Connect",
  description: `Scan the QR code to view ${businessCard.name}'s contact card.`,
  openGraph: {
    title: "Scan to Connect",
    description: `Scan the QR code to view ${businessCard.name}'s contact card.`,
    url: getSiteUrl(),
    images: [
      {
        url: businessCard.photo,
        width: 400,
        height: 400,
        alt: businessCard.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Scan to Connect",
    description: `Scan the QR code to view ${businessCard.name}'s contact card.`,
    images: [businessCard.photo],
  },
};

// QR showcase page — bookmark this on your phone to show others
export default function HomePage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
      <GalaxyBackground />
      <div className="relative z-10">
        <QrShowcaseView />
      </div>
    </div>
  );
}
