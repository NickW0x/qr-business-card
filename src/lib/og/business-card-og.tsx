import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { businessCard } from "@/config/business-card";

// Standard Open Graph canvas size
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const FOOTER_INSET = 40;
const FOOTER_RADIUS = 20;
// Portrait is 864×1152; landscape OG crop trims sides — anchor below center so face stays in frame
const PORTRAIT_OBJECT_POSITION = "center 58%";
// Light dim over the photo so header and contact text pop
const PORTRAIT_DIM_OVERLAY = "rgba(0,0,0,0.28)";

export type BusinessCardOgLayoutProps = {
  name: string;
  title: string;
  company: string;
  handle: string;
  status: string;
  email: string;
  phone: string;
  websiteLabel: string;
  portraitSrc: string;
  logoSrc: string;
  innerGradient: string;
};

// Map a /public URL to an on-disk path under public/
function publicPathToFs(publicPath: string): string {
  return join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

// Embed a local public asset as a data URI for Satori <img src>
async function readPublicImageAsDataUri(publicPath: string): Promise<string> {
  const fsPath = publicPathToFs(publicPath);
  const data = await readFile(fsPath);
  const mime = detectImageMime(data, publicPath);

  return `data:${mime};base64,${data.toString("base64")}`;
}

// Detect MIME from magic bytes — some assets use mismatched extensions (e.g. logo.png is JPEG)
function detectImageMime(data: Buffer, publicPath: string): string {
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) {
    return "image/png";
  }
  if (data[0] === 0xff && data[1] === 0xd8) {
    return "image/jpeg";
  }
  if (
    data[0] === 0x52 &&
    data[1] === 0x49 &&
    data[2] === 0x46 &&
    data[3] === 0x46
  ) {
    return "image/webp";
  }

  const ext = publicPath.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

// Compact domain label for website row (e.g. helionova.io)
function getWebsiteLabel(website: string): string {
  return website
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
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
    email: businessCard.email,
    phone: businessCard.phone.replace(/^\+1\s?/, ""),
    websiteLabel: getWebsiteLabel(businessCard.website),
    portraitSrc,
    logoSrc,
    innerGradient: profileCard.innerGradient,
  };
}

type OgContactFieldProps = {
  label: string;
  value: string;
  icon: "mail" | "phone" | "globe";
  accent: string;
};

// Single contact row — label + value with icon badge (business card field)
function OgContactField({ label, value, icon, accent }: OgContactFieldProps) {
  const iconColor = accent;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 8,
            border: `1px solid ${accent}44`,
            background: `${accent}18`,
            marginRight: 10,
          }}
        >
          {icon === "mail" ? (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2}>
              <path d="M4 7l8 6 8-6M4 7v10h16V7H4z" />
            </svg>
          ) : icon === "phone" ? (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          ) : (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2}>
              <circle cx={12} cy={12} r={10} />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
          )}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "#94a3b8",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 15,
          fontWeight: 600,
          color: "#f8fafc",
          lineHeight: 1.3,
          paddingLeft: 42,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// Full-bleed portrait OG card — all multi-child divs use display:flex (Satori requirement)
export function BusinessCardOgLayout({
  name,
  title,
  company,
  handle,
  status,
  email,
  phone,
  websiteLabel,
  portraitSrc,
  logoSrc,
  innerGradient,
}: BusinessCardOgLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: "#020617",
        fontFamily: "JetBrains Mono",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Layer stack — portrait + overlays */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_WIDTH,
          height: OG_HEIGHT,
        }}
      >
        <img
          src={portraitSrc}
          alt=""
          width={OG_WIDTH}
          height={OG_HEIGHT}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_WIDTH,
            height: OG_HEIGHT,
            objectFit: "cover",
            objectPosition: PORTRAIT_OBJECT_POSITION,
          }}
        />

        {/* Subtle opacity dim on portrait — improves text contrast without hiding the photo */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_WIDTH,
            height: OG_HEIGHT,
            backgroundColor: PORTRAIT_DIM_OVERLAY,
          }}
        />

        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_WIDTH,
            height: OG_HEIGHT,
            backgroundImage: innerGradient,
            backgroundColor: "rgba(0,0,0,0.2)",
            opacity: 0.42,
          }}
        />

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: OG_WIDTH,
            height: 280,
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_WIDTH,
            height: 220,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
          }}
        />
      </div>

      {/* Header — brand logo + name / title / company */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_WIDTH,
          padding: "36px 48px 16px",
          textAlign: "center",
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={64}
          height={64}
          style={{
            objectFit: "contain",
            marginBottom: 14,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 48,
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
            fontSize: 22,
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.35,
            marginTop: 10,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            fontWeight: 500,
            color: "rgba(186,230,253,0.85)",
            lineHeight: 1.35,
            marginTop: 6,
            letterSpacing: "0.035em",
          }}
        >
          {company}
        </div>
      </div>

      {/* Business card contact panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          bottom: FOOTER_INSET,
          left: FOOTER_INSET,
          width: OG_WIDTH - FOOTER_INSET * 2,
          padding: "18px 24px 20px",
          borderRadius: FOOTER_RADIUS,
          border: "1px solid rgba(255,255,255,0.22)",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.38) 0%, rgba(30,58,95,0.48) 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
        }}
      >
        {/* Identity row — logo, handle, location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 12,
              border: "2px solid rgba(56,189,248,0.35)",
              backgroundColor: "rgba(15,23,42,0.35)",
              overflow: "hidden",
              marginRight: 14,
              boxShadow: "0 0 16px rgba(56,189,248,0.2)",
            }}
          >
            <img
              src={logoSrc}
              alt=""
              width={44}
              height={44}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 17,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.2,
              }}
            >
              @{handle}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                fontWeight: 500,
                color: "#cbd5e1",
                lineHeight: 1.2,
                marginTop: 5,
              }}
            >
              {status}
            </div>
          </div>
        </div>

        {/* Contact fields — email, phone, website */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <OgContactField
            label="Email"
            value={email}
            icon="mail"
            accent="#38bdf8"
          />
          <div
            style={{
              display: "flex",
              width: 1,
              background: "rgba(255,255,255,0.1)",
              marginLeft: 20,
              marginRight: 20,
            }}
          />
          <OgContactField
            label="Phone"
            value={phone}
            icon="phone"
            accent="#34d399"
          />
          <div
            style={{
              display: "flex",
              width: 1,
              background: "rgba(255,255,255,0.1)",
              marginLeft: 20,
              marginRight: 20,
            }}
          />
          <OgContactField
            label="Website"
            value={websiteLabel}
            icon="globe"
            accent="#a78bfa"
          />
        </div>
      </div>
    </div>
  );
}
