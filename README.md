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

The project is already linked to `nickw0xs-projects/qr-business-card`.

```bash
npx vercel login
npx vercel --prod
```

After the first deploy, set `NEXT_PUBLIC_SITE_URL` in the Vercel dashboard to your production URL (e.g. `https://qr-business-card.vercel.app`), then redeploy so the QR encodes the correct `/card` link.

Alternatively, push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
