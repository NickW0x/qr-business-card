"use client";

import Galaxy from "@/components/Galaxy";

// Full-viewport interactive starfield tuned for the HelioNova brand palette
export function GalaxyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-950">
      <div className="h-full w-full">
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
      </div>
      {/* Soft vignette for depth without washing out star color */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/20 via-transparent to-slate-950/50" />
    </div>
  );
}
