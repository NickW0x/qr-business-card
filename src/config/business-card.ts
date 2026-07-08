// Single source of truth for your business card — edit this file to update your info

export type ContactAction = "mailto" | "vcard" | "phone" | "website";

export type LogoLoopIcon = "linkedin" | "x" | "github" | "cal";

export type LogoLoopEntry =
  | {
      kind: "image";
      src: string;
      href: string;
      ariaLabel: string;
      width?: number;
      height?: number;
    }
  | {
      kind: "icon";
      icon: LogoLoopIcon;
      href: string;
      ariaLabel: string;
    };

export const businessCard = {
  name: "Nick White",
  title: "Founder + Chief Engineer",
  company: "HelioNova",
  bio: "Founder and Chief Engineer at HelioNova. Designing and building AI systems.",
  email: "nw@helionova.io",
  phone: "+1 339-234-0959",
  website: "https://helionova.io",
  // Default photo — used for QR center, vCard, and link previews (OG/Twitter)
  photo: "/assets/brand/logo.png",
  social: {
    linkedin: "https://www.linkedin.com/in/nicholas-white-3b32026/",
    twitter: "https://x.com/nick_white",
    github: "https://github.com/NickW0x",
  },
  // Animated logo strip — products, social, and booking links
  logoLoop: [
    {
      kind: "image",
      src: "/assets/brand/logo.png",
      href: "https://helionova.io",
      ariaLabel: "HelioNova",
    },
    {
      kind: "image",
      src: "/assets/brand/voltedge.png",
      href: "https://www.helionova.io/products/voltedge",
      ariaLabel: "VoltEdge",
    },
    {
      kind: "image",
      src: "/assets/brand/tradecraft.png",
      href: "https://www.helionova.io/products/tradecraft",
      ariaLabel: "Tradecraft",
    },
    {
      kind: "icon",
      icon: "linkedin",
      href: "https://www.linkedin.com/in/nicholas-white-3b32026/",
      ariaLabel: "LinkedIn",
    },
    {
      kind: "icon",
      icon: "x",
      href: "https://x.com/nick_white",
      ariaLabel: "X",
    },
    {
      kind: "icon",
      icon: "github",
      href: "https://github.com/NickW0x",
      ariaLabel: "GitHub",
    },
    {
      kind: "icon",
      icon: "cal",
      href: "https://cal.com/nicholas-white-8ztpjq/30min",
      ariaLabel: "Book a meeting on Cal.com",
    },
  ] satisfies LogoLoopEntry[],
  theme: {
    primary: "#0f172a",
    background: "#fafafa",
    qrBackground: "#ffffff",
  },
  // React Bits ProfileCard — every prop exposed for full customization
  profileCard: {
    avatarUrl: "/assets/profile/portrait.jpg" as string | undefined,
    miniAvatarUrl: "/assets/brand/logo.png" as string | undefined,
    iconUrl: "/assets/profile-card/iconpattern.png",
    grainUrl: "/assets/profile-card/grain.webp",

    // Holographic icon pattern overlay tuning (shine layer)
    iconOverlay: {
      iconMaskSize: "220%",
      iconOpacity: 0.22,
      iconBrightness: 0.85,
      iconContrast: 1.05,
      iconSaturate: 0.15,
      iconBlendMode: "soft-light" as const,
    },

    innerGradient: "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)",
    behindGlowEnabled: true,
    behindGlowColor: "rgba(125, 190, 255, 0.67)",
    behindGlowSize: "50%",
    className: "mx-auto",

    enableTilt: true,
    enableMobileTilt: true,
    mobileTiltSensitivity: 2,

    name: undefined as string | undefined,
    title: "Founder + Chief Engineer | HelioNova" as string | undefined,
    handle: "nick_white",
    status: "Boston, MA",
    contactText: "Connect",
    showUserInfo: true,

    contactAction: "mailto" as ContactAction,
  },
} as const;

export type BusinessCard = typeof businessCard;
export type ProfileCardConfig = BusinessCard["profileCard"];
