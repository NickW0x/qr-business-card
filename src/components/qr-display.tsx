"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

import { businessCard } from "@/config/business-card";

type QrDisplayProps = {
  url: string;
  size?: number;
  variant?: "default" | "premium";
};

// Render a polished, styled QR code to canvas
export function QrDisplay({ url, size = 280, variant = "default" }: QrDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

    container.innerHTML = "";
    qrCode.append(container);

    return () => {
      container.innerHTML = "";
    };
  }, [url, size]);

  const frameClassName =
    variant === "premium"
      ? "rounded-2xl bg-white p-3"
      : "rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5";

  return (
    <div
      ref={containerRef}
      className={frameClassName}
      aria-label={`QR code linking to ${url}`}
    />
  );
}
