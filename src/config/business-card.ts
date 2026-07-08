// Single source of truth for your business card — edit this file to update your info

export type ContactAction = "mailto" | "vcard" | "phone" | "website";

export const businessCard = {
  name: "Your Name",
  title: "Your Title",
  company: "Your Company",
  bio: "Short professional bio that tells people who you are and what you do.",
  email: "you@example.com",
  phone: "+1 555 123 4567",
  website: "https://yoursite.com",
  // Default photo — used for QR center, vCard, and link previews (OG/Twitter)
  // Use your logo for QR center, or portrait if you prefer your face in the QR
  photo: "/assets/brand/logo.png",
  social: {
    linkedin: "https://linkedin.com/in/you",
    twitter: "https://x.com/you",
    github: "https://github.com/you",
  },
  theme: {
    primary: "#0f172a",
    background: "#fafafa",
    qrBackground: "#ffffff",
  },
  // React Bits ProfileCard — every prop exposed for full customization
  profileCard: {
    // Images — see public/assets/IMAGES.md for folder guide
    avatarUrl: "/assets/profile/portrait.jpg" as string | undefined, // large hero on /card
    miniAvatarUrl: undefined as string | undefined, // optional square crop → /assets/profile/avatar.jpg
    iconUrl: "/assets/profile-card/iconpattern.png", // holographic effect (pre-installed)
    grainUrl: "/assets/profile-card/grain.webp", // grain overlay (pre-installed)

    // Visual effects
    innerGradient: "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)",
    behindGlowEnabled: true,
    behindGlowColor: "rgba(125, 190, 255, 0.67)",
    behindGlowSize: "50%",
    className: "mx-auto",

    // Tilt / interaction
    enableTilt: true,
    enableMobileTilt: true,
    mobileTiltSensitivity: 5,

    // Display text (override top-level name/title if desired)
    name: undefined as string | undefined,
    title: undefined as string | undefined,
    handle: "yourhandle",
    status: "Available",
    contactText: "Contact",
    showUserInfo: true,

    // Contact button behavior: "mailto" | "vcard" | "phone" | "website"
    contactAction: "mailto" as ContactAction,
  },
} as const;

export type BusinessCard = typeof businessCard;
export type ProfileCardConfig = BusinessCard["profileCard"];
