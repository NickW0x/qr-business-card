import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { businessCard } from "@/config/business-card";

export type BusinessCardOgLayoutProps = {
  name: string;
  title: string;
  company: string;
  handle: string;
  status: string;
  portraitSrc: string;
  logoSrc: string;
  siteLabel: string;
  behindGlowColor: string;
};

// Map a /public URL to an on-disk path under public/
function publicPathToFs(publicPath: string): string {
  return join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

// Embed a local public asset as a data URI for Satori <img src>
async function readPublicImageAsDataUri(publicPath: string): Promise<string> {
  const fsPath = publicPathToFs(publicPath);
  const data = await readFile(fsPath, "base64");
  const ext = publicPath.split(".").pop()?.toLowerCase();
  const mime =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

  return `data:${mime};base64,${data}`;
}

// Strip protocol for a compact footer label (e.g. opensocket.xyz)
function getSiteLabel(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Load portrait + logo and resolve display copy from business-card config
export async function getBusinessCardOgAssets(): Promise<BusinessCardOgLayoutProps> {
  const { profileCard } = businessCard;
  const portraitPath = profileCard.avatarUrl ?? businessCard.photo;
  const logoPath = profileCard.miniAvatarUrl ?? businessCard.photo;

  const [portraitSrc, logoSrc] = await Promise.all([
    readPublicImageAsDataUri(portraitPath),
    readPublicImageAsDataUri(logoPath),
  ]);

  return {
    name: profileCard.name ?? businessCard.name,
    title: profileCard.title ?? businessCard.title,
    company: profileCard.company ?? businessCard.company,
    handle: profileCard.handle,
    status: profileCard.status,
    portraitSrc,
    logoSrc,
    siteLabel: getSiteLabel(businessCard.siteUrl),
    behindGlowColor: profileCard.behindGlowColor,
  };
}

// ProfileCard-echo layout — inline styles only (Satori-compatible)
export function BusinessCardOgLayout({
  name,
  title,
  company,
  handle,
  status,
  portraitSrc,
  logoSrc,
  siteLabel,
  behindGlowColor,
}: BusinessCardOgLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#020617",
        fontFamily: "Montserrat",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Holographic radial glow — echoes profileCard.behindGlowColor */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "70%",
          height: "90%",
          borderRadius: "50%",
          background: behindGlowColor,
          filter: "blur(80px)",
          opacity: 0.55,
        }}
      />

      {/* Purple-to-blue gradient accent — echoes profileCard.innerGradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(145deg, rgba(96, 73, 110, 0.35) 0%, rgba(113, 196, 255, 0.2) 100%)",
        }}
      />

      {/* Main content row */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: "56px 72px 24px",
          position: "relative",
        }}
      >
        {/* Circular portrait — same asset as ProfileCard hero */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 240,
            height: 240,
            borderRadius: "50%",
            border: "4px solid rgba(113, 196, 255, 0.45)",
            boxShadow: "0 0 40px rgba(125, 190, 255, 0.35)",
            overflow: "hidden",
            flexShrink: 0,
            marginRight: 56,
          }}
        >
          <img
            src={portraitSrc}
            alt=""
            width={240}
            height={240}
            style={{
              objectFit: "cover",
              objectPosition: "center top",
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Name and role */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#e2e8f0",
              lineHeight: 1.3,
              marginBottom: 10,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "#7dd3fc",
              lineHeight: 1.3,
              marginBottom: 20,
            }}
          >
            {company}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 500,
              color: "#94a3b8",
              gap: 12,
            }}
          >
            <span>@{handle}</span>
            <span style={{ color: "#475569" }}>·</span>
            <span>{status}</span>
          </div>
        </div>
      </div>

      {/* Footer — logo badge + site domain */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 72px 48px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <img src={logoSrc} alt="" width={48} height={48} />
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#cbd5e1",
            }}
          >
            {company}
          </span>
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#64748b",
          }}
        >
          {siteLabel}
        </span>
      </div>
    </div>
  );
}
