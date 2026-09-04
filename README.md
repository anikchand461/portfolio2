# Anik — Portfolio (Next.js)

This is the Next.js (App Router) version of the portfolio, converted from the
original static HTML / vanilla JS / Tailwind-CDN build. It is a pure frontend
project — no backend/API routes are used.

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** (proper PostCSS build, replacing the old `cdn.tailwindcss.com` script)
- Remix Icon (via CDN link, same as before)
- Google Fonts: Space Grotesk + JetBrains Mono

## What changed vs. the original

- The single 3,500-line `index.html` is now `app/page.js`, a React component.
- Head metadata (title, OG/Twitter tags, JSON-LD, favicon) moved to Next's
  Metadata API in `app/layout.js`.
- Tailwind's custom theme (neo-colors, fonts, `shadow-hard*` utilities) now
  lives in `tailwind.config.js` instead of an inline `tailwind.config` script.
- All the old vanilla JS (custom cursor, scroll-reveal, progress bar,
  GitHub/LeetCode/Codeforces stat widgets, contact form submit, blog marquee
  cloning, obfuscated email link, mobile menu, "show more" toggles) now runs
  inside a `useEffect` in `app/page.js`.
- The three self-contained widgets (site search, portfolio assistant chatbot,
  onboarding hints) are unchanged in behavior and now load from
  `public/js/*.js` via `next/script`.
- Images and the resume PDF moved to `public/Assets/...` (same relative
  structure as before, just served from Next's public folder).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build for production

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.js       # <html>/<head> metadata, fonts, GTM
  page.js         # the whole page (client component)
  globals.css     # Tailwind directives + custom animations/marquee CSS
public/
  Assets/         # images + resume PDF
  js/             # search-widget.js, assistant-widget.js, onboarding-hints.js
tailwind.config.js
postcss.config.js
next.config.js
```

## Notes

- The contact form still posts to the same Google Apps Script endpoint as
  before (`no-cors` fetch), so no backend was added.
- The GitHub/LeetCode/Codeforces stat cards still call the same public
  third-party APIs/image endpoints directly from the browser.
