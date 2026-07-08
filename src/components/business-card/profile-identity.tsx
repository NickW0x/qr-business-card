import { businessCard } from "@/config/business-card";

type ProfileIdentityProps = {
  name?: string;
  title?: string;
  company?: string;
  eyebrow?: string;
};

// Premium identity header — mirrors ProfileCard typography for galaxy backgrounds
export function ProfileIdentity({
  name = businessCard.name,
  title = businessCard.title,
  company = businessCard.company,
  eyebrow = "Scan to connect",
}: ProfileIdentityProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400 uppercase">
        {eyebrow}
      </p>
      <h1
        className="m-0 font-semibold leading-none tracking-[-0.02em] text-white"
        style={{
          fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
          textShadow:
            "0 2px 18px rgba(0,0,0,0.75), 0 0 32px rgba(56,189,248,0.14)",
        }}
      >
        {name}
      </h1>
      <div className="flex flex-col gap-1">
        <p
          className="m-0 text-sm font-medium leading-snug tracking-[0.01em] text-white/90 sm:text-[0.9375rem]"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.75)" }}
        >
          {title}
        </p>
        {company ? (
          <p
            className="m-0 text-xs font-normal leading-snug tracking-[0.035em] text-sky-100/80 sm:text-[0.8125rem]"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}
          >
            {company}
          </p>
        ) : null}
      </div>
    </div>
  );
}
