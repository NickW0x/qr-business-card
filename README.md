# QR Business Card

A personal web app to share a polished QR code from your phone. When someone scans it, they land on your digital business card with contact actions and vCard download.

## Customize

Edit [`src/config/business-card.ts`](src/config/business-card.ts) with your name, title, bio, links, and theme colors.

Replace [`public/photo.svg`](public/photo.svg) with your photo (e.g. `public/photo.jpg`) and update the `photo` path in the config.

## Local Development

```bash
npm install
npm run dev
```

- `/` — QR showcase (bookmark on your phone)
- `/card` — business card page scanners open
- `/api/vcard` — downloadable contact file

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

## Deploy to Vercel

The project is hosted at [https://nickwhite.opensocket.xyz](https://nickwhite.opensocket.xyz).

```bash
npx vercel login
npx vercel --prod
```

Production QR codes encode `https://nickwhite.opensocket.xyz/card` via `siteUrl` in [`src/config/business-card.ts`](src/config/business-card.ts). For belt-and-suspenders, also set `NEXT_PUBLIC_SITE_URL=https://nickwhite.opensocket.xyz` in the Vercel **Production** environment and redeploy.

Alternatively, push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).

### Social previews (Open Graph)

Share `https://nickwhite.opensocket.xyz/card` — not the QR page at `/`. If link previews show a generic Vercel card, disable **Attack Challenge Mode** / bot challenge in the Vercel Firewall so crawlers can read OG meta tags.