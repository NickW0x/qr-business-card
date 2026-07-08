# Image assets guide

You do **not** need a QR code image. The app generates the QR code on the home page (`/`) automatically. It links to your business card at `/card`.

Drop your files into the folders below, then update paths in `src/config/business-card.ts`.

---

## Folder structure

```
public/assets/
├── brand/
│   └── logo.png              ← YOUR LOGO (optional)
├── profile/
│   ├── portrait.jpg          ← YOUR PHOTO (required — main headshot)
│   └── avatar.jpg            ← Square crop (optional — see below)
└── profile-card/
    ├── iconpattern.png       ← Holographic shine (pre-installed, don't replace)
    └── grain.webp            ← Grain texture (pre-installed, don't replace)
```

---

## Which image does what?

| File | Used for | Recommended format |
|------|----------|-------------------|
| **`profile/portrait.jpg`** | Large hero image on the holographic ProfileCard (`/card`) | Portrait JPG/PNG/WebP, ~800×1200px, you facing camera |
| **`profile/avatar.jpg`** | QR code center image, vCard contact photo, link previews (OG/Twitter), small circle on card footer | Square JPG/PNG, ~400×400px, head & shoulders crop |
| **`brand/logo.png`** | Optional — use as QR center instead of avatar if you prefer logo over face | Square PNG/SVG with transparent background, ~512×512px |
| **`profile-card/iconpattern.png`** | Holographic pattern overlay on the card (visual effect only) | Pre-installed — leave as-is |
| **`profile-card/grain.webp`** | Film grain overlay on the card (visual effect only) | Pre-installed — leave as-is |

---

## Minimal setup (one photo only)

If you only have one picture of yourself:

1. Save it as `public/assets/profile/portrait.jpg`
2. In `business-card.ts` set:
   ```ts
   photo: "/assets/profile/portrait.jpg",
   ```
3. Leave `profileCard.avatarUrl` as `undefined` — it will use `photo` automatically.

---

## Recommended setup (photo + logo)

If you have both a portrait and a logo:

1. **Portrait** → `public/assets/profile/portrait.jpg`
2. **Logo** → `public/assets/brand/logo.png`
3. **Square avatar** (optional) → crop a headshot to `public/assets/profile/avatar.jpg`

In `business-card.ts`:

```ts
photo: "/assets/brand/logo.png",           // center of QR code on home page
profileCard: {
  avatarUrl: "/assets/profile/portrait.jpg", // large image on business card
  miniAvatarUrl: "/assets/profile/avatar.jpg", // small circle in card footer (optional)
}
```

This gives you:
- **Logo** in the middle of the QR code when you show it on your phone
- **Portrait** as the main visual on the business card page
- **Square avatar** in the card footer + vCard + social link previews (if you set `photo` to avatar instead)

---

## QR code — no image file needed

The QR code is rendered live by `QrDisplay` on the home page. It:
- Encodes the URL to `/card`
- Uses your `photo` setting as the small image in the center of the QR
- Uses colors from `theme.primary` and `theme.qrBackground` in config

To change QR appearance, edit `theme` in `business-card.ts` — not an image file.

---

## Quick checklist

- [ ] Add `portrait.jpg` to `public/assets/profile/`
- [ ] Add `logo.png` to `public/assets/brand/` (optional)
- [ ] Add `avatar.jpg` to `public/assets/profile/` (optional square crop)
- [ ] Update `photo` and `profileCard.avatarUrl` in `src/config/business-card.ts`
- [ ] Run `npm run dev` and check `/` (QR) and `/card` (business card)
