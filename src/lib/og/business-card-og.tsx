import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { businessCard } from "@/config/business-card";

// Mini ProfileCard dimensions — matches live card aspect ratio (0.718)
const CARD_WIDTH = 400;
const CARD_HEIGHT = 557;
const CARD_RADIUS = 30;
const FOOTER_INSET = 16;
const FOOTER_RADIUS = CARD_RADIUS - FOOTER_INSET + 6;

export type BusinessCardOgLayoutProps = {
  name: string;
  title: string;
  company: string;
  handle: string;
  status: string;
  contactText: string;
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

// Strip protocol for a compact domain label (e.g. opensocket.xyz)
function getSiteLabel(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Load OG assets and resolve display copy from business-card config
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
    contactText: profileCard.contactText,
    portraitSrc,
    logoSrc,
    siteLabel: getSiteLabel(businessCard.siteUrl),
    behindGlowColor: profileCard.behindGlowColor,
  };
}

// Centered mini ProfileCard — all multi-child divs use display:flex (Satori requirement)
export function BusinessCardOgLayout({
  name,
  title,
  company,
  handle,
  status,
  contactText,
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
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#020617",
        fontFamily: "Montserrat",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Galaxy background */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "radial-gradient(1.5px 1.5px at 8% 12%, rgba(255,255,255,0.9) 50%, transparent 50%), radial-gradient(1px 1px at 22% 38%, rgba(186,230,253,0.8) 50%, transparent 50%), radial-gradient(1.5px 1.5px at 35% 8%, rgba(255,255,255,0.7) 50%, transparent 50%), radial-gradient(1px 1px at 48% 55%, rgba(255,255,255,0.6) 50%, transparent 50%), radial-gradient(1px 1px at 62% 22%, rgba(125,211,252,0.75) 50%, transparent 50%), radial-gradient(1.5px 1.5px at 75% 68%, rgba(255,255,255,0.85) 50%, transparent 50%), radial-gradient(1px 1px at 88% 15%, rgba(255,255,255,0.65) 50%, transparent 50%), radial-gradient(1px 1px at 15% 72%, rgba(255,255,255,0.55) 50%, transparent 50%), radial-gradient(1.5px 1.5px at 55% 82%, rgba(186,230,253,0.7) 50%, transparent 50%), radial-gradient(1px 1px at 92% 48%, rgba(255,255,255,0.6) 50%, transparent 50%)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 55,
            left: 340,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: behindGlowColor,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.25) 0%, transparent 35%, transparent 65%, rgba(2,6,23,0.55) 100%)",
          }}
        />
      </div>

      {/* Card + domain label */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Mini ProfileCard */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: CARD_RADIUS,
            overflow: "hidden",
            backgroundColor: "rgba(0,0,0,0.9)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.65), 0 0 48px rgba(56,189,248,0.12)",
          }}
        >
          {/* Layer stack — all card visuals */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundImage:
                  "linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.27) 100%)",
                backgroundColor: "rgba(0,0,0,0.9)",
              }}
            />
            <img
              src={portraitSrc}
              alt=""
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                objectFit: "cover",
                objectPosition: "center bottom",
              }}
            />
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0,
                width: CARD_WIDTH,
                height: 180,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
              }}
            />
          </div>

          {/* Header text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              width: CARD_WIDTH,
              padding: "40px 24px 16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.35,
                marginTop: 8,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(186,230,253,0.85)",
                lineHeight: 1.35,
                marginTop: 4,
                letterSpacing: "0.035em",
              }}
            >
              {company}
            </div>
          </div>

          {/* Glass footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              bottom: FOOTER_INSET,
              left: FOOTER_INSET,
              width: CARD_WIDTH - FOOTER_INSET * 2,
              padding: "12px 14px",
              borderRadius: FOOTER_RADIUS,
              border: "1px solid rgba(255,255,255,0.25)",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(15,23,42,0.82) 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  border: "2px solid rgba(255,255,255,0.25)",
                  backgroundColor: "#000000",
                  overflow: "hidden",
                  marginRight: 10,
                }}
              >
                <img
                  src={logoSrc}
                  alt=""
                  width={32}
                  height={32}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1,
                  }}
                >
                  @{handle}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#cbd5e1",
                    lineHeight: 1,
                    marginTop: 4,
                  }}
                >
                  {status}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid rgba(56,189,248,0.4)",
                background: "rgba(14,165,233,0.25)",
                fontSize: 11,
                fontWeight: 700,
                color: "#ffffff",
                boxShadow: "0 0 20px rgba(56,189,248,0.25)",
              }}
            >
              {contactText}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 15,
            fontWeight: 500,
            color: "#64748b",
            letterSpacing: "0.04em",
          }}
        >
          {siteLabel}
        </div>
      </div>
    </div>
  );
}
