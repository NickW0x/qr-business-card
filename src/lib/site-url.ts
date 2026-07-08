import { businessCard } from "@/config/business-card";

// Resolve the public site URL for QR encoding and metadata
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  // Vercel production — use custom domain from config
  if (process.env.VERCEL_ENV === "production") {
    return businessCard.siteUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

// Build the full URL scanners should open
export function getCardUrl(): string {
  return `${getSiteUrl()}/card`;
}
