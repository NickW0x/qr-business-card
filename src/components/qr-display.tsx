"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

import { businessCard } from "@/config/business-card";

type QrDisplayProps = {
  url: string;
  size?: number;
};

// Render a polished, styled QR code to canvas
export function QrDisplay({ url, size = 280 }: QrDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "canvas",
      data: url,
      margin: 8,
      qrOptions: {
        errorCorrectionLevel: "H",
      },
      dotsOptions: {
        color: businessCard.theme.primary,
        type: "rounded",
      },
      cornersSquareOptions: {
        color: businessCard.theme.primary,
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: businessCard.theme.primary,
        type: "dot",
      },
      backgroundOptions: {
        color: businessCard.theme.qrBackground,
      },
      image: businessCard.photo,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.35,
      },
    });

    containerRef.current.innerHTML = "";
    qrCode.append(containerRef.current);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [url, size]);

  return (
    <div
      ref={containerRef}
      className="rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5"
      aria-label={`QR code linking to ${url}`}
    />
  );
}
