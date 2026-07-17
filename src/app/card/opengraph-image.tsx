import { ImageResponse } from "next/og";

import { businessCard } from "@/config/business-card";
import {
  BusinessCardOgLayout,
  getBusinessCardOgAssets,
} from "@/lib/og/business-card-og";

export const alt = `${businessCard.name} — Business Card`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch a JetBrains Mono weight from Google Fonts for Satori (matches site mono look)
async function loadJetBrainsMono(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}`,
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
    throw new Error(`Failed to load JetBrains Mono weight ${weight}`);
  }

  return fetch(resource).then((res) => res.arrayBuffer());
}

// Generate the /card Open Graph image at build time
export default async function Image() {
  const [assets, medium, semibold, bold] = await Promise.all([
    getBusinessCardOgAssets(),
    loadJetBrainsMono(500),
    loadJetBrainsMono(600),
    loadJetBrainsMono(700),
  ]);

  return new ImageResponse(<BusinessCardOgLayout {...assets} />, {
    ...size,
    fonts: [
      { name: "JetBrains Mono", data: medium, weight: 500, style: "normal" },
      { name: "JetBrains Mono", data: semibold, weight: 600, style: "normal" },
      { name: "JetBrains Mono", data: bold, weight: 700, style: "normal" },
    ],
  });
}
