# Prompt 10 — Final senior launch review

Review date: 2026-09-01  
Reviewed base: `a589df7fb4a2fde4ca38a556bf03a8e8e3082f84`  
Task branch: `codex/final-launch-review`

## 1. Executive summary

The reviewed application code is launch-safe with no known code-level P0 or P1 blocker. One P1 content defect found during this review—obsolete Home and FAQ prices—was corrected to use the authoritative `business.ts` configuration and protected with regression tests. Unit/integration, type, lint, build, E2E, production-runtime, and production-dependency checks pass.

The public hosting state is not launch-ready. The canonical `www` host serves HTTPS, but the apex currently returns 404 instead of redirecting, and the deployed `www` host serves `Disallow: /` with an empty sitemap. Its response CSP also reflects an older build. These are external deployment/domain-state blockers, not failures in the reviewed branch. No deployment, DNS, or OpenAI Sites settings were changed.

## 2. Production architecture

- Next App Router-compatible application built with Vinext/Vite for OpenAI Sites/Cloudflare hosting.
- Server-rendered public content and navigation, with client islands for the estimator, CarePlanner, availability, service-area map, contact helper, safety search, and privacy-safe saved progress.
- Pure shared business configuration in `app/config/business.ts`; CarePlanner calculations in `app/lib/care-planner.ts`; API boundaries under `app/api`.
- Server-side integrations: Resend contact email, sanitized/bounded private ICS availability, optional Cloudflare Turnstile, and optional server-side Google address lookup.
- Precise Pet Care remains the authoritative secure registration/client portal; the site does not duplicate intake or booking.

## 3. Original 502 cause and status

P0 commit `1b77148913201d2cda1bc07f90ef15de2a774fdd` repaired the production health/canonical-routing gap by adding a safe no-store `/api/health` endpoint and moving canonical/legacy redirects into the application proxy with regression coverage. The current branch contains that commit, the production build completes, and the built health route returns 200. The original application-side reliability repair remains intact; the current apex 404 is a separate external host/domain mapping issue.

## 4. Route and feature inventory

Public routes verified: Home, `/start`, `/plan`, `/holidays`, `/choosing-care`, `/safety`, `/credentials`, `/faq`, `/contact`, `/privacy`, and `/terms`. `/services`, `/rates`, `/service-area`, and `/about` redirect permanently to their canonical destinations. `/robots.txt`, `/sitemap.xml`, health, 404, and wrong-method API behavior are covered.

Features verified: QuoteEstimator, explainable CarePlanner and conservative care-gap display, preliminary AvailabilityChecker, ZIP/address lookup and service-area map, contact form with mocked browser delivery, owner and confirmation email logic, journal demo, social links, privacy-safe referral/analytics handling, anonymous session progress with clear/reset, and Precise Pet Care handoff. Public availability remains preliminary and non-bookable.

## 5. Findings

### P0 production/safety

- None in reviewed code.

### P1 launch blockers

- External: `https://cuddlecrewpetcare.com/` returns 404 instead of redirecting to the canonical `www` host.
- External: deployed `www/robots.txt` disallows all crawling and deployed sitemap is empty, so production is not indexable.
- External: deployed CSP is from an older release, confirming that the reviewed build is not yet the public build.
- Resolved in branch: obsolete `$25` Home drop-in language and obsolete FAQ small-animal/overnight add-on prices were replaced by centrally configured current prices.

### P2 worthwhile improvements

- Replace/optimize the 18 existing raw `<img>` uses and compare LCP/layout-shift behavior after deployment.
- Expand automated accessibility/browser coverage across additional viewport, zoom, and assistive-technology combinations.
- Add controlled deployed-production status-path validation after the reviewed build is published.
- Review and update development toolchain advisories in a dedicated maintenance change; production dependencies currently audit clean.

### P3 later

- Collect privacy-safe field Core Web Vitals after real traffic exists.
- Continue periodic manual content, credential-expiry, external-link, and structured-data review.

## 6. Files changed

- `app/faq/FAQSearch.tsx` — removes obsolete modifier and small-animal literals; derives public values from `business.ts`; clarifies the overnight/midday boundary.
- `app/page.tsx` — replaces obsolete “from $25” small-animal copy with the configured 30-minute other-pet rate.
- `tests/production-reliability.test.ts` — locks public launch prices to shared configuration and verifies the 404 fallback remains safe/actionable.
- `e2e/launch-review.spec.ts` — adds final route, status, pricing, landmark, reflow, keyboard, reduced-motion, and form-semantic regressions.
- `docs/prompt-10-final-launch-review.md` — records this review and launch decision.

No `.openai` file or unrelated product area was changed.

## 7. Tests added

- Central-price source regression covering all six base rates and approved public modifiers.
- Stale-literal exclusion for `$25`, `$20`, `$35`, and `$40` in the corrected public surfaces.
- Safe/actionable 404 regression.
- Browser coverage for all public and metadata routes, canonical redirects, 404, API method rejection, key content/prices, progressive landmarks, portal link, 200%/320px-equivalent reflow, keyboard skip link, reduced motion, and contact form semantics.

## 8. Commands and results

- `git fetch --prune github` — passed; reviewed local `main` exactly matched `github/main` at the stated base and was clean before branch creation.
- `npm run check` — passed: 90 tests, typecheck, lint with 0 errors/18 known image warnings, production build.
- `npm run test:e2e` — passed: 7/7 Playwright tests.
- Built-server smoke — passed: Home 200, health 200, unknown route 404, robots 200, legacy route 308.
- `npm audit --omit=dev --json` — passed: 0 production vulnerabilities.
- Full dependency audit — 11 development/toolchain findings (10 high, 1 low, 0 critical), deferred to a dedicated upgrade review because fixes span Vinext/Vite/Cloudflare tooling.
- Git diff/check — intended Prompt 10 files only; no whitespace error or `.openai` change.

## 9. Accessibility findings

Public pages retain one primary heading, semantic main content, navigation/landmarks, skip link, labeled forms, actionable error/status regions, visible focus styling, descriptive image alternatives, reduced-motion support, and mobile target/reflow rules. Automated 200% zoom at the WCAG 320 CSS-pixel equivalent showed no horizontal page overflow on `/plan`; contact form semantics also passed. No automated finding is a launch blocker. Manual screen-reader, real-device, high-contrast, and a broader 200% route sweep remain prudent because automation cannot fully establish accessibility conformance.

## 10. Performance comparison

The review adds no runtime dependency or client feature. Public pricing changes are text/config substitutions; the new code is test/report-only. The production build remains successful, map and planner code retain deferred/on-demand behavior, and no new hydration, long-task, calendar, layout-shift, or BFCache risk was introduced. The known 18 image optimization warnings remain. Field LCP/INP/CLS comparison is unavailable until the reviewed build is deployed and receives measurable traffic.

## 11. Security controls

The branch preserves CSP, HSTS, no-sniff, referrer, permissions, frame-ancestor, and HTTPS-upgrade headers; canonical allowlisted redirects; server-only provider credentials; bounded/time-limited upstream requests; SSRF-resistant calendar configuration; sanitized/bounded ICS parsing; form validation, honeypot, optional Turnstile, instance-local rate limits and duplicate suppression; minimal operational health output; redacted/minimal logs; analytics/referral allowlists and failure isolation; and non-sensitive session storage. Browser tests do not send real inquiries.

## 12. Residual security and privacy risks

- Rate limiting and duplicate suppression are instance-local and do not coordinate across replicas.
- Resend, calendar, map, Turnstile, hosting, and portal availability are external.
- Anonymous planner progress is device/session-local; strict exclusions prevent names, contact/address data, travel dates, access data, and detailed health/behavior data from saved or URL state.
- Public availability is preliminary, sanitized, and never bookable.
- Development tooling has known advisories; production audit is 0, and a coordinated toolchain update is deferred to avoid an unreviewed launch-time migration.
- Provider-side retention and delivery behavior remains subject to provider configuration and policies.

## 13. SEO and indexability checklist

- Repository canonical host/HTTPS/canonical URLs: pass.
- Repository production-indexing switch, robots, sitemap, metadata, OpenGraph, structured data, truthful schema, internal links, redirects, and status codes: pass in tests/build.
- Preview noindex behavior: pass by configuration.
- Public canonical `www` HTTPS: pass.
- Public apex redirect: fail (404).
- Public production indexing: fail (`Disallow: /`; empty sitemap).
- Search Console readiness: blocked until deployment, apex routing, and indexing output are corrected and revalidated.

## 14. Required environment-variable names only

- `RESEND_API_KEY`
- `PRIVATE_CALENDAR_ICS_URL`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `SITE_INDEXING_ENABLED`
- `GOOGLE_MAPS_SERVER_KEY`
- `PRIVATE_SERVICE_ORIGIN`

Optional integrations require their documented pairs; production indexing requires the indexing flag to be intentionally enabled in the production environment.

## 15. Manual steps still required

- Hosting: publish the reviewed commit through the approved release process; set required environment values; verify health, headers, 404/500 behavior, forms, availability, robots, sitemap, and canonical redirects on the deployed artifact. No deployment was performed here.
- DNS/domain: correct or complete apex custom-domain routing so it redirects to canonical `www`; allow DNS/SSL validation to settle; recheck both hosts. No DNS or Sites configuration was changed here.
- Search Console: after public indexing is enabled, verify both canonical behavior and sitemap, submit the canonical sitemap, and monitor coverage/enhancements.
- Google Business Profile: ensure website/phone/service-area details match the site and use the canonical HTTPS URL; do not imply unsupported territory or availability.
- Resend: verify domain authentication, sender/recipient configuration, delivery/bounce handling, and a controlled production contact/confirmation test.
- PSI Locator: keep membership, URL, and public business details aligned; revisit at credential renewal.
- Precise Pet Care: verify registration/login links, client-facing service/pricing settings, intake boundaries, and request workflow; it remains the secure source for private profiles and booking.

## 16. Deferred work and reasons

- 18 `<img>` optimization warnings: deferred for a measured performance pass to avoid altering image delivery/layout during launch closeout.
- Field Core Web Vitals: requires deployed traffic.
- Broader viewport/accessibility E2E and assistive-technology review: worthwhile depth beyond current launch regressions.
- Deployed-production status/error-path validation: must run after the reviewed artifact is actually released.
- Development-toolchain vulnerabilities: require a coordinated Vinext/Vite/Cloudflare dependency upgrade and regression cycle; production dependencies are currently clean.

## 17. Short rollback plan

If the Prompt 10 code change causes a regression, revert the Prompt 10 commit with a normal `git revert`, run the full check/E2E/build smoke suite, and release the resulting reviewed commit through the normal hosting process. Do not rewrite history. Hosting/domain changes should use the provider's documented rollback to the last known-good reviewed artifact while retaining the canonical DNS records; verify health, redirects, robots, and sitemap immediately afterward.

### NO — BLOCKED BY THESE ITEMS

The reviewed application code has no known P0/P1 blocker, but launch remains blocked until the reviewed build is deployed, the apex 404 is corrected, and production robots/sitemap become indexable and are revalidated.
