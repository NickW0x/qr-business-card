import { ImageResponse } from "next/og";

import { businessCard } from "@/config/business-card";
import {
  BusinessCardOgLayout,
  getBusinessCardOgAssets,
} from "@/lib/og/business-card-og";

export const alt = `${businessCard.name} — Business Card`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch a Montserrat weight from Google Fonts for Satori rendering
async function loadMontserrat(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Montserrat:wght@${weight}`,
    {
      headers: {
        // Google Fonts returns woff/ttf URLs only for a browser-like user agent
        "User-Agent": "Mozilla/5.0 (compatible; OG-Image-Generator/1.0)",
      },
    },
  ).then((res) => res.text());

  const resource = css.match(
    /src: url\((.+)\) format\('(?:opentype|truetype)'\)/,
  )?.[1];

  if (!resource) {
    throw new Error(`Failed to load Montserrat weight ${weight}`);
  }

  return fetch(resource).then((res) => res.arrayBuffer());
}

// Generate the /card Open Graph image at build time
export default async function Image() {
  const [assets, medium, semibold, bold] = await Promise.all([
    getBusinessCardOgAssets(),
    loadMontserrat(500),
    loadMontserrat(600),
    loadMontserrat(700),
  ]);

  return new ImageResponse(<BusinessCardOgLayout {...assets} />, {
    ...size,
    fonts: [
      { name: "Montserrat", data: medium, weight: 500, style: "normal" },
      { name: "Montserrat", data: semibold, weight: 600, style: "normal" },
      { name: "Montserrat", data: bold, weight: 700, style: "normal" },
    ],
  });
}
