# yuezhouingrid.com

My portfolio, hand-written in React + Vite (moved off Framer).

## Run it on your computer

```bash
npm install
npm run assets   # first time only: downloads the images into public/assets
npm run dev      # opens http://localhost:5173
```

After `npm run assets`, commit the `public/assets` folder so the site keeps working even after Framer is gone.

## Where things are

| What | File |
|---|---|
| Pages | `src/pages/` (Home, Work, About, CommonGround, TwinPaths, BookingMe) |
| Menu, top bar, footer, back button, contents sidebar | `src/components/Site.tsx` |
| Interactive pieces (cup sleeve, poster, laptop, desk, …) | `src/components/` |
| Colours, fonts, spacing, phone/tablet layout | `src/styles.css` |
| Links (email, LinkedIn, resume) | `src/lib/site.ts` |
| Page switching + fade | `src/lib/router.ts` |

Phone layout is under `@media (max-width: 809.98px)`, tablet under `@media (max-width: 1199.98px)`.

## Deploy (Vercel)

1. vercel.com → Add New → Project → import `jjingrid/portfolio`. Framework: Vite (auto-detected). Deploy.
2. Every push to `main` redeploys automatically.
3. Domain: Project → Settings → Domains → add `yuezhouingrid.com` and `www.yuezhouingrid.com`, then change the DNS records at your domain registrar to the ones Vercel shows (remove the old Framer records).
