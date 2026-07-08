import Link from "next/link";

import { GalaxyBackground } from "@/components/backgrounds/galaxy-background";
import { QrDisplay } from "@/components/qr-display";
import { Button } from "@/components/ui/button";
import { businessCard } from "@/config/business-card";
import { getCardUrl } from "@/lib/site-url";

// QR showcase page — bookmark this on your phone to show others
export default function HomePage() {
  const cardUrl = getCardUrl();

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center px-6 py-10">
      <GalaxyBackground />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-widest text-slate-300 uppercase">
            Scan to connect
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {businessCard.name}
          </h1>
          <p className="text-slate-300">
            {businessCard.title} · {businessCard.company}
          </p>
        </div>

        {/* Subtle glow around QR for visibility when showing on phone */}
        <div className="relative">
          <div className="absolute -inset-4 animate-pulse rounded-3xl bg-white/10 blur-xl" />
          <QrDisplay url={cardUrl} size={260} />
        </div>

        <p className="max-w-xs text-sm text-slate-400">
          Point your camera at the code to view my contact info
        </p>

        <Button
          render={<Link href="/card" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50"
        >
          Preview card locally
        </Button>
      </div>
    </div>
  );
}
