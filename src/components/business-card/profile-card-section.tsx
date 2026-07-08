"use client";

import ProfileCard from "@/components/ProfileCard";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  getContactClickHandler,
  getProfileCardProps,
} from "@/lib/profile-card-props";

// React Bits ProfileCard — all props driven from business-card.ts config
export function ProfileCardSection() {
  const props = getProfileCardProps();
  // Desktop-only tilt — touch devices need scroll, not pointer capture
  const isFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  // Skip tilt entirely when the user prefers reduced motion
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const tiltAllowed = isFinePointer && !prefersReducedMotion;

  return (
    <ProfileCard
      {...props}
      enableTilt={props.enableTilt && tiltAllowed}
      enableMobileTilt={props.enableMobileTilt && tiltAllowed}
      onContactClick={getContactClickHandler()}
    />
  );
}
