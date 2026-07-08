import { ContactActions } from "@/components/business-card/contact-actions";
import { ProfileCardSection } from "@/components/business-card/profile-card-section";

type BusinessCardViewProps = {
  // Absolute /card URL for share + clipboard
  cardUrl: string;
};

// Full business card view shown after scanning the QR code
export function BusinessCardView({ cardUrl }: BusinessCardViewProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-6 px-1 sm:px-0">
      <div className="w-full">
        <ProfileCardSection />
      </div>
      <ContactActions cardUrl={cardUrl} />
    </div>
  );
}
