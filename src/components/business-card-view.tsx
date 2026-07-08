import { ContactActions } from "@/components/business-card/contact-actions";
import { ProfileCardSection } from "@/components/business-card/profile-card-section";

// Full business card view shown after scanning the QR code
export function BusinessCardView() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <ProfileCardSection />
      <ContactActions />
    </div>
  );
}
