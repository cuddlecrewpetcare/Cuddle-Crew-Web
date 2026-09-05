# Cuddle Crew Pet Care website

Public marketing and planning website for Cuddle Crew Pet Care, a solo Sacramento-area pet-sitting business. The site is built with Next-compatible React through OpenAI Sites/Vinext and is intentionally **unlisted** until the owner enables indexing.

## Local development

Use the persistent Windows-first workflow in [`docs/local-development.md`](docs/local-development.md), the backup/disaster-recovery contract in [`docs/backup-disaster-recovery.md`](docs/backup-disaster-recovery.md), the concise continuity runbook in [`docs/business-continuity.md`](docs/business-continuity.md), the accessibility/responsive contract in [`docs/accessibility-responsive.md`](docs/accessibility-responsive.md), the time/locale contract in [`docs/time-locale-determinism.md`](docs/time-locale-determinism.md), the cross-platform/filesystem contract in [`docs/cross-platform-filesystem.md`](docs/cross-platform-filesystem.md), the observability/recovery contract in [`docs/observability-recovery.md`](docs/observability-recovery.md), the external-integration contract in [`docs/integrations-side-effects.md`](docs/integrations-side-effects.md), the testing/quality contract in [`docs/testing-quality.md`](docs/testing-quality.md), the dependency/build security contract in [`docs/dependency-supply-chain.md`](docs/dependency-supply-chain.md), and the repository/history safeguards in [`CONTRIBUTING.md`](CONTRIBUTING.md). For normal daily work, read `AGENTS.md`, run `npm run doctor`, `npm run check:git-safety`, and `npm run check:recovery`, and install nothing when the doctor passes. First-time or evidence-based repair uses `npm run setup:local`.

## Configuration

The authoritative business rules live in `docs/business-reference/` according to its status and source hierarchy. `app/config/business.ts` and `app/lib/business-rules.ts` are implementation mirrors only; they must be reconciled to the most specific applicable `CURRENT / APPROVED` reference before rates, visit windows, service zones, credentials, holidays, short-notice behavior, or related public behavior changes.

SMS consent, disclosure, opt-out, HELP, privacy, and marketing boundaries are governed by `docs/business-reference/guidance/sms-communications-consent-compliance.md`.

Server-only environment variables:

- `RESEND_SEND_ENABLED=true` explicitly enables Resend writes in an intended environment. It defaults to `false`; a credential alone cannot enable delivery.
- `RESEND_API_KEY` authenticates contact-form delivery and remains inert while the write gate is off.
- `PRIVATE_CALENDAR_ICS_URL` powers the privacy-preserving availability summary. Never expose this calendar URL to the browser.
- `GOOGLE_MAPS_SERVER_KEY` powers the optional server-proxied Places Autocomplete (New), Address Validation, and Routes requests.
- `PRIVATE_SERVICE_ORIGIN` is the private route origin used only by the server. Never expose or commit it.
- `TURNSTILE_SECRET_KEY` enables server-side bot verification only when paired with the public site key.

Public configuration:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` displays Cloudflare Turnstile only when the server secret is also configured. Configure both Turnstile values or leave both blank; partial configuration returns a clear administrative error rather than silently rejecting visitors.
- `SITE_INDEXING_ENABLED=true` opts the site into search indexing and the sitemap. It defaults to unlisted/noindex.

The address integration does not use a browser key. In Google Cloud, enable Places API (New), Address Validation API, and Routes API. Restrict the server key to those APIs and, where the hosting platform permits, to the deployment’s server-side network or service identity. Suggestions use a public Sacramento-region location bias; this is distinct from the private route origin. Places suggestions displayed outside a Google map retain visible Google Maps attribution. The public privacy page references Google’s privacy policy and Maps terms.

## Deployment

The production site is hosted through OpenAI Sites. Push the exact reviewed commit to the Sites source remote, package the build, save a new Sites version, then deploy that version. The GitHub mirror is at `cuddlecrewpetcare/Cuddle-Crew-Web`.

CI validates pull requests and `main` without production secrets or deployment capability. The exact-SHA release gate, environment/write boundaries, hosting inventory, smoke checks, rollback procedure, and deployment-record template are in [`docs/deployment-hosting.md`](docs/deployment-hosting.md).

## Social profiles and Instagram

All official social URLs live in `app/config/business.ts` under `business.social`; components must consume that central configuration rather than duplicating URLs. `SocialLinks` renders Google, Facebook, Yelp, and the official Instagram profile in its normal and compact layouts. The same centralized values feed LocalBusiness `sameAs` structured data.

## Referral attribution and public analytics

Campaign links may use the allowlisted `ref` values `business-card`, `instagram`, `nextdoor`, `vet-office`, `flyer`, `facebook`, `yelp`, and `google`. For example:

- `/start?ref=instagram`
- `/start?ref=business-card`
- `/start?ref=flyer`

The site rejects unknown values and keeps only the accepted source in `sessionStorage` for the current browser session. It never keeps the full referring URL or attaches identity, address, medical, behavioral, medication, or household-access data. `app/lib/public-analytics.ts` dispatches sanitized internal browser events; no external analytics backend is connected, and site functionality never depends on event delivery or browser storage.

`/start` is the lightweight campaign and new-client orientation page. Keep it fast and direct visitors to the full planner, estimator, service-area checker, contact route, or Precise Pet Care registration as appropriate. Registration starts a manually reviewed process and does not reserve care automatically.

## Manifest and install support

`public/manifest.webmanifest` supplies basic site metadata and internal shortcuts. There is intentionally no service worker because stale offline pricing or availability could mislead visitors. The only current icon is the existing SVG favicon; **APP ICON ASSET REQUIRED FOR FULL PWA INSTALLABILITY**. Add approved 192×192, 512×512, and maskable-safe brand artwork only after the final logo is supplied—do not fabricate or reinterpret the brand.

## Deferred integrations

The following are not live and should not be described as current features: live weather/AQI, verified-review ingestion, Resend delivery webhooks, and a real monitoring/status system. Add them only with explicit owner approval, an appropriate privacy review, and reliable failure behavior.

## Privacy and security

The public estimate and care-planning tools do not require contact information. Private medical, behavioral, access, and household details belong in the secure client portal. Runtime security headers are configured in `proxy.ts`; contact, availability, and address APIs must retain input validation, rate limiting, safe error messages, and secret-only server integrations. Exact lookup addresses are used only for the immediate Google request and are not saved in care-plan session state or planning URLs.

The technical data inventory, classifications, browser/server boundaries, retention states, provider flows, backup rules, and future migration process are maintained in [`docs/data-privacy.md`](docs/data-privacy.md). The current application has no database, object store, file-upload feature, authentication system, external analytics backend, or direct Precise Petcare, Dialpad, or payment API integration.
