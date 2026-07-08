"use client";

import ProfileCard from "@/components/ProfileCard";
import {
  getContactClickHandler,
  getProfileCardProps,
} from "@/lib/profile-card-props";

// React Bits ProfileCard — all props driven from business-card.ts config
export function ProfileCardSection() {
  const props = getProfileCardProps();

  return (
    <ProfileCard {...props} onContactClick={getContactClickHandler()} />
  );
}
