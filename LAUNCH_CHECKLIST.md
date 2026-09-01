# Cuddle Crew Pet Care launch checklist

## Deployment

- [ ] Production domain resolves to the reviewed deployment.
- [ ] HTTPS is active and renews automatically.
- [ ] Production environment variables are configured without exposing server secrets.
- [ ] The reviewed `main` commit is saved as a private Sites version before production deployment.

## Search

- [ ] Set `SITE_INDEXING_ENABLED=true` only when the owner is ready to be listed.
- [ ] Verify the production `robots.txt`, sitemap, and canonical URLs.
- [ ] Confirm no private street address appears in metadata, schema, HTML, or source-visible config.
- [ ] Add and verify the `https://www.cuddlecrewpetcare.com/` property in Google Search Console using an owner-approved verification method.
- [ ] Submit `https://www.cuddlecrewpetcare.com/sitemap.xml` after the production site is stable and indexing is enabled.
- [ ] Inspect the home page, `/start`, `/plan`, `/contact`, `/credentials`, and `/faq`; request indexing only after each resolves on canonical HTTPS URLs.
- [ ] Search the exact business name and domain after indexing begins to confirm the visible result uses the canonical hostname; record any follow-up rather than assuming indexing is complete.

## Google Maps Platform

- [ ] Enable the required production APIs and verify server-key restrictions.
- [ ] Confirm `PRIVATE_SERVICE_ORIGIN` is server-only and accurate.
- [ ] Review billing alerts and test address-service failure fallback to ZIP lookup.

## Contact

- [ ] Test Resend production delivery and the visitor confirmation email.
- [ ] Test Cloudflare Turnstile with both public and secret keys configured.
- [ ] Confirm failed submissions show the direct email alternative.

## Precise Pet Care

- [ ] Verify new-client registration and existing-client login URLs.
- [ ] Confirm registration language still says requests require Lauren's approval.

## Social and credentials

- [ ] Verify Google, Facebook, Yelp, and Instagram links from the homepage and footer.
- [ ] Confirm PSI membership status/expiration and insurance limits remain current.
- [ ] Replace the temporary `CC` mark only when final approved logo and app-icon assets are available.

## Final QA

- [ ] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run check`.
- [ ] Check keyboard navigation, mobile menu focus/Escape behavior, forms, hashes, and no horizontal overflow.
- [ ] Test 320, 390, 430, 768, 820, 1024, 1280, and 1440 px widths.
- [ ] Test availability, address, contact, analytics, and session-storage failure paths.
- [ ] Confirm the site remains unlisted/private until the owner approves launch.
