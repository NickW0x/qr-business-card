"use client";

import type { ReactNode } from "react";

import LogoLoop, { type LogoItem } from "@/components/LogoLoop";
import { businessCard, type LogoLoopEntry, type LogoLoopIcon } from "@/config/business-card";

import { CalIcon, GithubIcon, LinkedinIcon, XIcon } from "./social-brand-icons";

const iconClass = "size-7 text-white/80";

// Map config icon keys to rendered SVG nodes
const iconNodes: Record<LogoLoopIcon, ReactNode> = {
  linkedin: <LinkedinIcon className={iconClass} />,
  x: <XIcon className={iconClass} />,
  github: <GithubIcon className={iconClass} />,
  cal: <CalIcon className={iconClass} />,
};

// Convert a config entry into a LogoLoop item
function toLogoItem(entry: LogoLoopEntry): LogoItem | null {
  if (!entry.href) return null;

  if (entry.kind === "image") {
    return {
      src: entry.src,
      href: entry.href,
      ariaLabel: entry.ariaLabel,
      alt: entry.ariaLabel,
      width: entry.width,
      height: entry.height,
    };
  }

  return {
    node: iconNodes[entry.icon],
    href: entry.href,
    ariaLabel: entry.ariaLabel,
  };
}

// Animated strip of product, social, and booking links
export function BrandLogoLoop() {
  const logos = businessCard.logoLoop
    .map(toLogoItem)
    .filter((logo): logo is LogoItem => logo !== null);

  if (logos.length === 0) return null;

  return (
    <LogoLoop
      logos={logos}
      logoHeight={28}
      gap={36}
      pauseOnHover
      scaleOnHover
      speed={28}
      fadeOut={false}
      ariaLabel="Products and links"
      className="py-1"
    />
  );
}
