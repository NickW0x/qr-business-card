"use client";

import type { ComponentType, ReactNode } from "react";
import { Globe, Mail, Phone, UserPlus } from "lucide-react";

import { BrandLogoLoop } from "@/components/business-card/brand-logo-loop";
import SpotlightCard from "@/components/SpotlightCard";
import { businessCard } from "@/config/business-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Section label for grouped contact panel areas
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
      {children}
    </p>
  );
}

// Full-width tappable contact row with icon, label, and value
function ContactRow({
  href,
  icon: Icon,
  label,
  value,
  external,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3.5 text-white transition-colors hover:border-white/20 hover:bg-white/10"
    >
      <Icon className="size-5 shrink-0 text-slate-300" />
      <span className="text-sm font-medium text-white/90">{label}</span>
      <span className="ml-auto truncate text-sm text-slate-200">{value}</span>
    </a>
  );
}

// Contact actions panel below the ProfileCard — wrapped in SpotlightCard
export function ContactActions() {
  const displayPhone = businessCard.phone.replace(/^\+1\s?/, "");

  return (
    <SpotlightCard
      className="w-full! max-w-md! rounded-2xl! border-white/10! bg-black/30! p-6! shadow-xl backdrop-blur-sm"
      spotlightColor="rgba(125, 190, 255, 0.18)"
    >
      <div className="space-y-6">
        <p className="text-center text-sm leading-relaxed text-slate-100/95">
          {businessCard.bio}
        </p>

        <Separator className="bg-white/10" />

        <div className="space-y-3">
          <SectionLabel>Get in touch</SectionLabel>
          <div className="space-y-2">
            <ContactRow
              href={`mailto:${businessCard.email}`}
              icon={Mail}
              label="Email"
              value={businessCard.email}
            />
            <ContactRow
              href={`tel:${businessCard.phone.replace(/\s/g, "")}`}
              icon={Phone}
              label="Call"
              value={displayPhone}
            />
            <ContactRow
              href={businessCard.website}
              icon={Globe}
              label="Website"
              value="helionova.io"
              external
            />
          </div>
        </div>

        <div className="space-y-3">
          <SectionLabel>Products &amp; links</SectionLabel>
          <BrandLogoLoop />
        </div>

        <Button
          className="h-12 w-full border border-white/10 bg-white/5 text-base text-white hover:bg-white/10"
          size="lg"
          variant="outline"
          nativeButton={false}
          render={<a href="/api/vcard" download />}
        >
          <UserPlus className="size-5" />
          Save Contact
        </Button>
      </div>
    </SpotlightCard>
  );
}
