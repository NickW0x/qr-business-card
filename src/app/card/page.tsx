import type { Metadata } from "next";

import { BusinessCardView } from "@/components/business-card-view";
import { GalaxyBackground } from "@/components/backgrounds/galaxy-background";
import { businessCard } from "@/config/business-card";
import { getCardUrl, getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: `${businessCard.name} — Business Card`,
  description: businessCard.bio,
  openGraph: {
    title: businessCard.name,
    description: `${businessCard.title} at ${businessCard.company}`,
    type: "profile",
    url: `${getSiteUrl()}/card`,
    // Absolute URL via metadataBase — overrides root layout's 400×400 logo
    images: [
      {
        url: "/card/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${businessCard.name} — Business Card`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: businessCard.name,
    description: `${businessCard.title} at ${businessCard.company}`,
    images: ["/card/opengraph-image"],
  },
};

// schema.org Person — helps search engines understand the card identity
function getPersonJsonLd() {
  const cardUrl = getCardUrl();
  const portrait =
    businessCard.profileCard.avatarUrl ?? businessCard.photo;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: businessCard.name,
    jobTitle: businessCard.title,
    worksFor: {
      "@type": "Organization",
      name: businessCard.company,
      url: businessCard.website,
    },
    url: cardUrl,
    email: businessCard.email,
    telephone: businessCard.phone,
    image: `${getSiteUrl()}${portrait}`,
    sameAs: [
      businessCard.social.linkedin,
      businessCard.social.twitter,
      businessCard.social.github,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Boston",
      addressRegion: "MA",
      addressCountry: "US",
    },
  };
}

// Business card page — destination when someone scans the QR code
export default function CardPage() {
  const cardUrl = getCardUrl();
  const personJsonLd = getPersonJsonLd();

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-stretch justify-start gap-6 px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <GalaxyBackground />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <BusinessCardView cardUrl={cardUrl} />
      </div>
    </div>
  );
}
