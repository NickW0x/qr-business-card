import type { BusinessCard } from "@/config/business-card";

// Escape special characters per vCard 3.0 spec
function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// Build a vCard 3.0 string from business card config
export function buildVCard(
  config: BusinessCard,
  photoBase64?: string,
  photoMimeType?: string
): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(config.name)}`,
    `N:${escapeVCard(config.name)};;;;`,
    `TITLE:${escapeVCard(config.title)}`,
    `ORG:${escapeVCard(config.company)}`,
    `EMAIL;TYPE=INTERNET:${config.email}`,
    `TEL;TYPE=CELL:${config.phone.replace(/\s/g, "")}`,
    `URL:${config.website}`,
  ];

  // Add social profiles as additional URLs
  if (config.social.linkedin) {
    lines.push(`URL;TYPE=LinkedIn:${config.social.linkedin}`);
  }
  if (config.social.github) {
    lines.push(`URL;TYPE=GitHub:${config.social.github}`);
  }
  if (config.social.twitter) {
    lines.push(`URL;TYPE=Twitter:${config.social.twitter}`);
  }

  if (config.bio) {
    lines.push(`NOTE:${escapeVCard(config.bio)}`);
  }

  // Embed photo if provided as base64
  if (photoBase64 && photoMimeType) {
    lines.push(`PHOTO;ENCODING=b;TYPE=${photoMimeType}:${photoBase64}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}
