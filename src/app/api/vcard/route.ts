import { readFile } from "fs/promises";
import path from "path";

import { businessCard } from "@/config/business-card";
import { buildVCard } from "@/lib/vcard";

// Read portrait (preferred) or logo from public folder for the vCard PHOTO field
async function getPhotoData(): Promise<{
  base64?: string;
  mimeType?: string;
}> {
  // Prefer the ProfileCard portrait so Contacts apps show the face, not the logo
  const photoSrc =
    businessCard.profileCard.avatarUrl ?? businessCard.photo;
  const photoPath = photoSrc.replace(/^\//, "");
  const extension = path.extname(photoPath).toLowerCase();

  const mimeMap: Record<string, string> = {
    ".jpg": "JPEG",
    ".jpeg": "JPEG",
    ".png": "PNG",
    ".webp": "WEBP",
    ".svg": "SVG",
  };

  const mimeType = mimeMap[extension];
  if (!mimeType) return {};

  try {
    const filePath = path.join(process.cwd(), "public", photoPath);
    const buffer = await readFile(filePath);
    return { base64: buffer.toString("base64"), mimeType };
  } catch {
    return {};
  }
}

// Serve downloadable vCard for "Add to Contacts"
export async function GET() {
  const { base64, mimeType } = await getPhotoData();
  const vcard = buildVCard(businessCard, base64, mimeType);
  const filename = `${businessCard.name.replace(/\s+/g, "-").toLowerCase()}.vcf`;

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
