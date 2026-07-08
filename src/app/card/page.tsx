import type { Metadata } from "next";

import { BusinessCardView } from "@/components/business-card-view";
import { GalaxyBackground } from "@/components/backgrounds/galaxy-background";
import { businessCard } from "@/config/business-card";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: `${businessCard.name} — Business Card`,
  description: businessCard.bio,
  openGraph: {
    title: businessCard.name,
    description: `${businessCard.title} at ${businessCard.company}`,
    type: "profile",
    url: `${getSiteUrl()}/card`,
  },
  twitter: {
    card: "summary_large_image",
    title: businessCard.name,
    description: `${businessCard.title} at ${businessCard.company}`,
  },
};

// Business card page — destination when someone scans the QR code
export default function CardPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-stretch justify-start gap-6 px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
      <GalaxyBackground />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <BusinessCardView />
      </div>
    </div>
  );
}
