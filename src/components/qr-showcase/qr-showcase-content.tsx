"use client";

import { ProfileIdentity } from "@/components/business-card/profile-identity";
import { QrDisplay } from "@/components/qr-display";
import SpotlightCard from "@/components/SpotlightCard";

type QrShowcaseContentProps = {
  cardUrl: string;
};

// Client-side QR showcase — glass frame, sky glow, and interactive SpotlightCard
export function QrShowcaseContent({ cardUrl }: QrShowcaseContentProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
      <ProfileIdentity />

      {/* Glass frame with sky ambient glow around scannable QR core */}
      <div className="relative w-full max-w-[320px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-sky-400/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 animate-pulse rounded-3xl bg-sky-400/5 blur-xl"
        />
        <SpotlightCard
          className="relative rounded-3xl! border-white/15! bg-black/25! p-6! shadow-xl backdrop-blur-md"
          spotlightColor="rgba(125, 190, 255, 0.22)"
        >
          <div className="flex justify-center">
            <QrDisplay url={cardUrl} size={280} variant="premium" />
          </div>
        </SpotlightCard>
      </div>

      <p className="max-w-xs text-sm leading-relaxed text-slate-300/90">
        Point your camera at the code to view my contact info
      </p>
    </div>
  );
}
