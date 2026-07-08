import { QrShowcaseContent } from "@/components/qr-showcase/qr-showcase-content";
import { getCardUrl } from "@/lib/site-url";

// Server wrapper — resolves card URL on the server for correct production QR encoding
export function QrShowcaseView() {
  return <QrShowcaseContent cardUrl={getCardUrl()} />;
}
