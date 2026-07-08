import { businessCard } from "@/config/business-card";

// Returns every ProfileCard prop — single place to tweak mapping logic
export function getProfileCardProps() {
  const { profileCard } = businessCard;

  return {
    avatarUrl: profileCard.avatarUrl ?? businessCard.photo,
    iconUrl: profileCard.iconUrl || undefined,
    grainUrl: profileCard.grainUrl || undefined,
    innerGradient: profileCard.innerGradient,
    behindGlowEnabled: profileCard.behindGlowEnabled,
    behindGlowColor: profileCard.behindGlowColor,
    behindGlowSize: profileCard.behindGlowSize,
    className: profileCard.className,
    enableTilt: profileCard.enableTilt,
    enableMobileTilt: profileCard.enableMobileTilt,
    mobileTiltSensitivity: profileCard.mobileTiltSensitivity,
    miniAvatarUrl: profileCard.miniAvatarUrl,
    name: profileCard.name ?? businessCard.name,
    title:
      profileCard.title ?? `${businessCard.title} · ${businessCard.company}`,
    handle: profileCard.handle,
    status: profileCard.status,
    contactText: profileCard.contactText,
    showUserInfo: profileCard.showUserInfo,
  };
}

// Separate handler — must be called client-side
export function getContactClickHandler(): () => void {
  const { contactAction } = businessCard.profileCard;

  switch (contactAction) {
    case "vcard":
      return () => {
        window.location.href = "/api/vcard";
      };
    case "phone":
      return () => {
        window.location.href = `tel:${businessCard.phone.replace(/\s/g, "")}`;
      };
    case "website":
      return () => {
        window.open(businessCard.website, "_blank", "noopener,noreferrer");
      };
    default:
      return () => {
        window.location.href = `mailto:${businessCard.email}`;
      };
  }
}
