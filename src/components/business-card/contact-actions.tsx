"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Globe,
  Mail,
  Phone,
  Share2,
  UserPlus,
} from "lucide-react";

import { BrandLogoLoop } from "@/components/business-card/brand-logo-loop";
import SpotlightCard from "@/components/SpotlightCard";
import { businessCard } from "@/config/business-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ContactAccent = "sky" | "emerald" | "violet";

// Per-channel tint — matches the card's cool sky glow while differentiating rows
const accentStyles: Record<
  ContactAccent,
  { iconShell: string; icon: string; hoverBorder: string; spotlight: string }
> = {
  sky: {
    iconShell: "border-sky-400/25 bg-sky-500/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
    icon: "text-sky-200/95",
    hoverBorder: "hover:border-sky-400/30",
    spotlight: "rgba(56, 189, 248, 0.16)",
  },
  emerald: {
    iconShell:
      "border-emerald-400/25 bg-emerald-500/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
    icon: "text-emerald-200/95",
    hoverBorder: "hover:border-emerald-400/28",
    spotlight: "rgba(52, 211, 153, 0.14)",
  },
  violet: {
    iconShell:
      "border-violet-400/25 bg-violet-500/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
    icon: "text-violet-200/95",
    hoverBorder: "hover:border-violet-400/28",
    spotlight: "rgba(167, 139, 250, 0.14)",
  },
};

// Section label for grouped contact panel areas
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
      {children}
    </p>
  );
}

// Full-width tappable contact row with icon badge, spotlight hover, and tap affordance
function ContactRow({
  href,
  icon: Icon,
  label,
  value,
  external,
  accent = "sky",
  valueClassName = "truncate",
}: {
  href: string;
  // Lucide icons accept className + strokeWidth for line weight tuning
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  external?: boolean;
  accent?: ContactAccent;
  valueClassName?: string;
}) {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const styles = accentStyles[accent];

  return (
    <a
      ref={rowRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={(event) => {
        if (!rowRef.current) return;
        const rect = rowRef.current.getBoundingClientRect();
        setSpotlight({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          opacity: 1,
        });
      }}
      onMouseLeave={() => setSpotlight((current) => ({ ...current, opacity: 0 }))}
      className={`group relative flex min-w-0 items-center gap-3.5 overflow-hidden rounded-xl border border-white/8 bg-linear-to-br from-white/7 to-white/2 px-3.5 py-3 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)] transition-[border-color,background-color,box-shadow,transform] duration-300 hover:bg-white/9 hover:shadow-[0_8px_28px_rgba(0,0,0,0.22),inset_0_1px_0_0_rgba(255,255,255,0.1)] active:scale-[0.99] ${styles.hoverBorder}`}
    >
      {/* Row-level spotlight — mirrors parent SpotlightCard */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: spotlight.opacity * 0.85,
          background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, ${styles.spotlight}, transparent 72%)`,
        }}
      />
      {/* Top edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
      />

      <div
        className={`relative flex size-10 shrink-0 items-center justify-center rounded-[10px] border ${styles.iconShell}`}
      >
        <Icon className={`size-[18px] ${styles.icon}`} strokeWidth={1.75} />
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="text-[10px] font-medium tracking-[0.18em] text-slate-400 uppercase">
          {label}
        </p>
        <p className={`text-sm font-medium leading-snug text-white/95 ${valueClassName}`}>
          {value}
        </p>
      </div>

      <ArrowUpRight
        aria-hidden
        className="relative size-4 shrink-0 text-white/20 transition-[color,transform] duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-white/55"
        strokeWidth={2}
      />
    </a>
  );
}

// Detect Web Share API without a mount effect (SSR-safe via useSyncExternalStore)
function subscribeShareCapability() {
  return () => {};
}
function getShareSnapshot() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
function getShareServerSnapshot() {
  return false;
}

// Share via Web Share API when available; otherwise copy the card URL
function ShareCardActions({ cardUrl }: { cardUrl: string }) {
  const canNativeShare = useSyncExternalStore(
    subscribeShareCapability,
    getShareSnapshot,
    getShareServerSnapshot,
  );
  const [copied, setCopied] = useState(false);

  // Reset "Copied" label after a short delay
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
    } catch {
      // Fallback for older browsers without clipboard API
      const input = document.createElement("input");
      input.value = cardUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
    }
  }, [cardUrl]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `${businessCard.name} — Business Card`,
        text: `${businessCard.title} at ${businessCard.company}`,
        url: cardUrl,
      });
    } catch (error) {
      // User cancelled the share sheet — ignore AbortError
      if (error instanceof DOMException && error.name === "AbortError") return;
      await handleCopy();
    }
  }, [cardUrl, handleCopy]);

  return (
    <div className="flex gap-2">
      {canNativeShare ? (
        <Button
          type="button"
          className="h-11 flex-1 border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10"
          size="lg"
          variant="outline"
          onClick={handleShare}
        >
          <Share2 className="size-4" />
          Share
        </Button>
      ) : null}
      <Button
        type="button"
        className={`h-11 border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10 ${canNativeShare ? "flex-1" : "w-full"}`}
        size="lg"
        variant="outline"
        onClick={handleCopy}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
}

type ContactActionsProps = {
  // Absolute /card URL for share + clipboard (resolved on the server)
  cardUrl: string;
};

// Contact actions panel below the ProfileCard — wrapped in SpotlightCard
export function ContactActions({ cardUrl }: ContactActionsProps) {
  const displayPhone = businessCard.phone.replace(/^\+1\s?/, "");

  return (
    <SpotlightCard
      className="w-full max-w-md rounded-2xl! border-white/10! bg-black/30! p-6! shadow-xl backdrop-blur-sm"
      spotlightColor="rgba(125, 190, 255, 0.18)"
    >
      <div className="space-y-6">
        <p className="text-center text-sm leading-relaxed text-slate-100/95">
          {businessCard.bio}
        </p>

        <Separator className="bg-white/10" />

        <div className="space-y-3">
          <SectionLabel>Get in touch</SectionLabel>
          <div className="space-y-2.5">
            <ContactRow
              href={`mailto:${businessCard.email}`}
              icon={Mail}
              label="Email"
              value={businessCard.email}
              accent="sky"
              valueClassName="break-all sm:truncate"
            />
            <ContactRow
              href={`tel:${businessCard.phone.replace(/\s/g, "")}`}
              icon={Phone}
              label="Call"
              value={displayPhone}
              accent="emerald"
            />
            <ContactRow
              href={businessCard.website}
              icon={Globe}
              label="Website"
              value="helionova.io"
              accent="violet"
              external
            />
          </div>
        </div>

        <div className="space-y-3">
          <SectionLabel>Products &amp; links</SectionLabel>
          <BrandLogoLoop />
        </div>

        <div className="space-y-2.5">
          {/* Primary CTA — save to phone contacts */}
          <Button
            className="h-12 w-full bg-sky-500 text-base font-semibold text-slate-950 hover:bg-sky-400"
            size="lg"
            variant="default"
            nativeButton={false}
            render={<a href="/api/vcard" download />}
          >
            <UserPlus className="size-5" />
            Save Contact
          </Button>
          <ShareCardActions cardUrl={cardUrl} />
        </div>
      </div>
    </SpotlightCard>
  );
}
