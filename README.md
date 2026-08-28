# Cuddle Crew Pet Care website

Public marketing and planning website for Cuddle Crew Pet Care, a solo Sacramento-area pet-sitting business. The site is built with Next-compatible React through OpenAI Sites/Vinext and is intentionally **unlisted** until the owner enables indexing.

## Local development

1. Use Node.js 22.13 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add local secrets. Never commit `.env.local`.
4. Run `npm run dev`.

Quality commands:

- `npm test` — business-rule regression tests.
- `npm run lint` — ESLint.
- `npm run build` — production build.
- `npm run typecheck` — explicit TypeScript validation.
- `npm run check` — tests, typecheck, lint, and build.

## Configuration

Published rates, visit windows, service zones, and credential facts live in `app/config/business.ts`. Reusable date, holiday, ZIP-zone, short-notice, and schedule-gap logic lives in `app/lib/business-rules.ts`.

Server-only environment variables:

- `RESEND_API_KEY` sends contact-form messages.
- `PRIVATE_CALENDAR_ICS_URL` powers the privacy-preserving availability summary. Never expose this calendar URL to the browser.
- `TURNSTILE_SECRET_KEY` enables server-side bot verification only when paired with the public site key.

Public configuration:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` displays Cloudflare Turnstile only when the server secret is also configured. Configure both Turnstile values or leave both blank; partial configuration returns a clear administrative error rather than silently rejecting visitors.
- `SITE_INDEXING_ENABLED=true` opts the site into search indexing and the sitemap. It defaults to unlisted/noindex.

## Deployment

The production site is hosted through OpenAI Sites. Push the exact reviewed commit to the Sites source remote, package the build, save a new Sites version, then deploy that version. The GitHub mirror is at `cuddlecrewpetcare/Cuddle-Crew-Web`.

## Privacy and security

The public estimate and care-planning tools do not require contact information. Private medical, behavioral, access, and household details belong in the secure client portal. Security headers are configured in `next.config.ts`; contact and availability APIs must retain input validation, rate limiting, safe error messages, and secret-only server integrations.
