"use client";

import { useEffect, useState } from "react";

import Galaxy from "@/components/Galaxy";
import { useMediaQuery } from "@/hooks/use-media-query";

// Soft static fallback when WebGL is deferred or reduced-motion is preferred
function StaticGalaxyFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(96,73,110,0.18),transparent_50%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]"
    />
  );
}

// Full-viewport interactive starfield tuned for the HelioNova brand palette
export function GalaxyBackground() {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Defer WebGL until after first paint so the card content is not blocked by ogl
  const [canMountGalaxy, setCanMountGalaxy] = useState(false);

  useEffect(() => {
    // Skip scheduling WebGL when reduced motion is preferred
    if (prefersReducedMotion) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const enable = () => {
      if (!cancelled) setCanMountGalaxy(true);
    };

    // Prefer idle callback; fall back to a short timeout for Safari
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(enable, 200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion]);

  // Derive visibility — no need to reset canMountGalaxy when motion preference changes
  const showWebGL = canMountGalaxy && !prefersReducedMotion;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-950">
      <div className="relative h-full w-full">
        {showWebGL ? (
          <Galaxy
            transparent
            mouseInteraction
            mouseRepulsion
            hueShift={220}
            saturation={0.85}
            density={1.0}
            glowIntensity={0.38}
            twinkleIntensity={0.45}
            starSpeed={0.4}
            speed={0.7}
            rotationSpeed={0.06}
          />
        ) : (
          <StaticGalaxyFallback />
        )}
      </div>
      {/* Soft vignette for depth without washing out star color */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-transparent to-slate-950/50" />
    </div>
  );
}
