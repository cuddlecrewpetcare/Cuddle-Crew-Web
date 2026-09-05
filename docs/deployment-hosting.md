# Deployment, Hosting, and Release Safety

> Status: CURRENT ENGINEERING FOUNDATION
>
> Scope: CI validation, OpenAI Sites/Cloudflare hosting boundaries, environment separation, release provenance, deployment authorization, smoke testing, rollback, and recovery. This document does not authorize a deployment or change a business rule, provider account, secret value, domain, or DNS record.

## Current authority and inventory

GitHub is the reviewed source remote. OpenAI Sites is the production hosting authority, using a Cloudflare Worker-compatible Vinext build. They are separate systems:

| Surface | State | Evidence and boundary |
| --- | --- | --- |
| GitHub `github` remote | **ACTIVE** | Public source mirror at `cuddlecrewpetcare/Cuddle-Crew-Web`; feature branches and `main` live here. |
| GitHub Actions | **CONFIGURED FOR VALIDATION** | `.github/workflows/validate.yml`; no deployment job, production environment, production secret, DNS step, or Sites push. |
| OpenAI Sites | **ACTIVE PRODUCTION HOST** | Existing `.openai/hosting.json` project identity and separate `sites` source remote. The manifest has no D1 or R2 binding. |
| Cloudflare Workers/runtime | **ACTIVE THROUGH SITES** | Vinext emits a Worker entrypoint and public assets; public responses identify Cloudflare. There is no separately maintained Wrangler deployment configuration. |
| Local Wrangler/Miniflare | **ACTIVE FOR LOCAL BUILD/EMULATION** | Vite config keeps ignored `.wrangler` state project-local. It is not production authority. |
| `sites` Git remote | **CONFIGURED DEPLOYMENT SOURCE** | Never use it as the GitHub contribution remote and never push to it in an implementation, merge, validation, or routine release-preparation task. |
| Manual repository deploy script | **NOT PRESENT** | Package scripts intentionally contain no production deploy command. Native Sites version/deployment operations remain a separate authorized task. |
| Deploy hook/webhook | **NOT PRESENT** | No repository URL or unauthenticated production trigger exists. A future hook URL is a secret. |
| Staging host | **NOT PRESENT** | Optional future environment; do not infer one from local emulation or a preview URL. |
| Preview host | **NOT CONFIGURED / UNKNOWN EXTERNALLY** | Feature branches may be validated in CI. Any future hosted preview must meet the preview policy below. |
| DNS/domain | **ACTIVE, OWNER-CONTROLLED EXTERNAL BOUNDARY** | Canonical `www` and apex HTTPS were observable on 2026-09-05. DNS/provider dashboard state is not pulled into or changed by this repository. |

Read-only public inspection on 2026-09-05 observed `200` for the canonical home, health, robots, and sitemap routes; an apex-to-`www` `308`; Cloudflare response handling; HTTPS; current security headers; an indexable robots/sitemap response; and `Cache-Control: no-store` on health. This observation does not identify the deployed Git SHA. The public response also showed older sitemap behavior than the F10/F11 source, so the current production source/version must be treated as **UNRESOLVED** until verified in Sites version history. Do not guess or redeploy merely to resolve the question.

## Environment inventory

| Environment | State | Data and external behavior |
| --- | --- | --- |
| Local development | **EXISTS** | Optional reads disabled when blank; Resend blocked by default; synthetic/manual input only; indexing off. |
| Automated Node test | **EXISTS** | Synthetic fixtures; provider transports mocked or configuration off; no live writes or provider health dependency. |
| E2E | **EXISTS** | Local production build on owned port 3100; Resend forced off; contact delivery intercepted; indexing off. |
| GitHub Actions validation | **EXISTS** | Linux validation with the pinned toolchain, synthetic/off provider state, no production secrets, and no deploy capability. |
| Hosted preview | **PLANNED / NOT CONFIGURED** | Public-by-assumption, no production data, no production secrets, no provider writes, no indexing. |
| Staging | **NOT USED** | If introduced, use an isolated hostname, synthetic data, and separate sandbox/read-only credentials. |
| Production | **EXISTS** | Exact write configuration is external and unresolved. Deployment never implies that any provider gate is enabled. |

Do not manufacture a staging environment. A preview URL is not staging, and a local production build is not production.

## Environment and provider authority

The executable registry is `scripts/integration-registry.mjs`; `npm run check:integrations` enforces complete local/test/E2E/preview/staging/production classifications and blocks active write providers in preview.

| Boundary | Local | Test | E2E | Preview | Staging | Production |
| --- | --- | --- | --- | --- | --- | --- |
| Email / Resend | **BLOCKED** by default | **MOCKED** | **BLOCKED** | **BLOCKED** | **UNRESOLVED** | **UNRESOLVED**; write only after explicit gate approval |
| SMS | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED**; no integration exists |
| Payments | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED**; no integration exists |
| Booking/Client-record mutation | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED**; no integration exists |
| Precise Petcare | **READ-ONLY** link | Link assertion | Link assertion | **READ-ONLY** link | **READ-ONLY** link | **READ-ONLY** link |
| Public analytics | Local event only | Local event only | Local event only | Local event only | Local event only | Local event only; no external backend |
| Private calendar | Optional **READ-ONLY** | Mocked/off | Mocked/off | **BLOCKED** | Synthetic **READ-ONLY** only | Optional **READ-ONLY** |
| Google Maps Platform | Optional **READ-ONLY** | Mocked/off | Off | Separate key or **BLOCKED** | Separate key or **BLOCKED** | Optional **READ-ONLY** |
| Turnstile | Optional verification | Mocked/off | Off | Separate keys or **BLOCKED** | Separate keys or **BLOCKED** | Optional verification |
| Provider webhooks | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED**; no endpoint exists |

Production writes are never inferred from `NODE_ENV`, a production hostname, a successful build, a merge, a push, or possession of a credential. Resend needs its server-only key **and** `RESEND_SEND_ENABLED=true` in the one deliberately approved environment. SMS, payment, booking, Precise Petcare mutation, and provider webhooks remain blocked until their own authorized designs exist.

## Branch and deployment policy

- Feature/foundation branches: implement and validate; never deploy production.
- Pull requests: validation only; untrusted code receives no production secrets or write credentials.
- `main`: candidate source for an owner-approved production release after merge and fresh validation; a push to `main` does not deploy.
- Sites source/version: receives only an explicitly approved, clean, exact `main` SHA during a separate deployment task.
- Deployment, DNS, and provider configuration are three separate operations and require separate authorization.

Keep implementation, review/merge, and deployment as distinct tasks. Use a normal reviewed `--no-ff` merge unless the owner authorizes another history strategy. Never force-push or rewrite history for release convenience.

## Exact-SHA and clean-tree rule

Every production deployment must be traceable to an **exact Git SHA**. “Current files,” “latest,” and “whatever is on disk” are not release identities.

Before production deployment:

1. Name the approved source branch and exact SHA.
2. Confirm the SHA is the reviewed `main` commit and matches freshly fetched `github/main`.
3. Require `git status --short` to be empty. The working tree must be clean, with no unstaged, staged, or untracked release-critical files.
4. Run the full release gate from that exact checkout and retain the result.
5. Identify the last known-good rollback SHA and confirm that its compatible artifact/version can be selected or rebuilt.
6. Create/save a Sites version tied to the exact source SHA; never manually patch generated output.
7. Deploy only after the owner explicitly authorizes that version/environment.
8. Run non-writing smoke checks and create a deployment record.

If any identity, cleanliness, remote match, validation, environment, or rollback check is unresolved, stop. Do not “fix” production by pushing a dirty worktree or changing secrets at random.

## Build and artifact authority

| Item | Required value |
| --- | --- |
| Node | `22.17.1` from `.nvmrc` |
| npm | `10.9.2` from `packageManager` |
| Fresh install | `npm ci` |
| Build | `npm run build` → `vinext build` |
| Server artifact | `dist/server/index.js` with a default Worker object and callable `fetch` |
| Public artifact | `dist/client/` |
| Hosting metadata | `dist/.openai/hosting.json` matching the reviewed source manifest |
| Validation | `npm run validate:full` plus the explicit history scan for release preparation |

`npm run check:deployment` validates source/configuration policy. `npm run check:build-artifact` runs after the build and rejects source maps, test/report output, databases/backups, client-side server secret names, client-side build paths, missing Worker output, or hosting-manifest drift.

Build output is generated from the reviewed source SHA. Never edit `dist`, `.next`, `.vinext`, or `.wrangler` to repair a release. Fix source/configuration, rebuild, revalidate, and create a new version. Generated server bundles may contain build-machine paths for framework dispatch; they are hosting-internal artifacts, must not be published as CI artifacts, and must never be returned in client errors. The client artifact check rejects local paths.

The current build emits no browser source maps. Source maps remain deferred; do not make them public or upload private maps to monitoring SaaS without a separate privacy/retention decision. Build-time provider reads/writes and private-data fetching are forbidden.

## Environment variables and secret storage

`.env.example` is the canonical name/class template; it never contains production values. Hosted values belong only in the environment-specific Sites/provider secret store. CI needs no production provider secret.

| Name | Exposure | Capability | Requirement and phase |
| --- | --- | --- | --- |
| `RESEND_SEND_ENABLED` | Server-only, non-secret, production-sensitive | Explicit write gate | `false` locally, in test/E2E/CI/preview; production remains owner-approved/unresolved |
| `RESEND_API_KEY` | Server-only secret, write-capable, production-sensitive | Email authentication | Optional and inert unless the gate is true; never in preview/CI |
| `PRIVATE_CALENDAR_ICS_URL` | Server-only secret, read-only, production-sensitive | Private calendar read | Optional runtime value; absent from preview and CI |
| `TURNSTILE_SECRET_KEY` | Server-only secret, verification-capable | Turnstile verification | Optional; pair with the public site key; use separate non-production keys or off |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Intentionally public/client bundle | Widget site identity | Optional; not a secret; pair with environment-matched server secret |
| `SITE_INDEXING_ENABLED` | Non-secret environment control | Robots/metadata/sitemap | `false` for local/test/E2E/CI/preview; production value is a deliberate release decision |
| `GOOGLE_MAPS_SERVER_KEY` | Server-only secret, read-only, production-sensitive | Maps/validation/routes reads | Optional; environment-restricted; never browser-public |
| `PRIVATE_SERVICE_ORIGIN` | Server-only secret/private configuration | Route calculation origin | Optional and paired with Maps server key; never browser-public |

Server-only provider values are consumed at runtime. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is client-bundle configuration and must be assumed public. `SITE_INDEXING_ENABLED` controls server-rendered metadata routes and should be treated as release configuration; rebuild/redeploy after a production change so all generated/runtime behavior is consistent. No private provider value is needed to compile the app.

For an environment change, record only who, variable **name**, environment, time, reason, and validation result—never the value. After a rotation: update the approved secret store, restart/redeploy only if required, verify with a safe provider-specific procedure, then revoke the old key. Rotation does not authorize a provider write test.

Host-dashboard drift is possible because secret/config names, domains, and access policy are external. Before release, compare the host's configured **names and environment assignments only** against this table without exporting or printing values. Repository checks cannot prove dashboard state.

## Preview and staging policy

Treat any hosted preview/staging URL as public. Do not use real Client records, contact submissions, private calendars, production screenshots, or production provider payloads.

Preview must have:

- `RESEND_SEND_ENABLED=false` and no production Resend key;
- no SMS, payment, booking, Precise Petcare mutation, webhook, or production-data access;
- `SITE_INDEXING_ENABLED=false` and no canonical metadata derived from the preview host;
- Turnstile/Maps off or separate restricted non-production keys;
- private calendar off;
- synthetic inputs only.

If the host copies production variables into branch previews, classify that as **HIGH** and disable previews or remove the inheritance in an owner-authorized dashboard task before using them. This repository does not assume or alter dashboard inheritance.

Staging is absent. If later created, use an isolated domain, synthetic data, sandbox/test credentials, and separate secret assignments. It must not silently share production write credentials.

## Validation-only CI

`.github/workflows/validate.yml` runs on pull requests, pushes to `main`, and manual dispatch. It uses one Linux runner to close the prior Linux verification gap without a wasteful OS/browser matrix.

The workflow:

- grants only `contents: read`;
- persists no checkout credential;
- pins every GitHub Action to an exact reviewed SHA;
- uses Node 22.17.1, verifies npm 10.9.2, and runs `npm ci`;
- downloads Gitleaks 8.30.0 from its official release and verifies the named asset against the official checksum file;
- installs only pinned Playwright Chromium and required Linux libraries;
- forces email writes and indexing off;
- runs doctor and `npm run validate:full` without production secrets;
- runs the full history secret scan only on explicit manual dispatch;
- uploads synthetic Playwright failure evidence only after failure, for seven days, and treats artifacts as non-secret/repository-visible;
- has no production environment, deploy credential, Sites push, DNS call, provider write, or CD job.

Do not use `pull_request_target`. Fork and untrusted PR code must never receive production secrets. Do not add a secret to routine validation to make an optional provider test pass. Update an Action pin only in a dedicated review: verify the official repository/tag, exact SHA, release notes, permissions, inputs, transitive execution, then run the deployment check and full validation.

The npm download cache is enabled through the official setup action and keyed from the lockfile. `node_modules`, build output, and Playwright browsers are not blindly cached. Successful artifacts are not uploaded. macOS and Windows CI are deferred because Windows is already the primary locally verified path and macOS is not a support requirement.

Branch protection is an owner-controlled GitHub setting, not changed here. Recommended solo-owner baseline: protect `main`, block force pushes/deletion, and require the Validation status before merge without imposing unnecessary reviewer bureaucracy. Dependabot/Renovate remain optional/deferred for deliberate maintenance.

## Runtime, origin, headers, and cache policy

- Canonical public origin: `https://www.cuddlecrewpetcare.com`; absolute redirects and metadata use configured/static trusted values, never arbitrary `Host`/forwarded headers.
- HTTPS: supplied by the hosting/CDN boundary and verified publicly for apex and `www`. Do not implement custom TLS termination.
- CORS: same-origin. No wildcard or broad cross-origin API policy is present. A future split origin requires an exact allowlist and separate security review.
- CSP: **IMPLEMENTED** with self by default, explicit Turnstile and current asset allowances, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, and no `unsafe-eval`. Current Vinext/React output needs inline script/style compatibility; narrowing `unsafe-inline` requires nonce/hash support and a tested framework plan, not a speculative edit.
- HSTS: `max-age=31536000` without preload or `includeSubDomains`. Add neither until every affected hostname and rollback consequence is reviewed.
- Clickjacking/MIME/referrer/permissions: CSP frame ancestors plus `X-Frame-Options: DENY`, `nosniff`, `strict-origin-when-cross-origin`, and camera/microphone/geolocation disabled.
- Dynamic/private API routes and health: `no-store`. Do not let a CDN override it.
- Fingerprinted `/_next/static/*`: long-lived immutable caching is expected. Do not apply that policy to HTML or APIs indiscriminately.
- Redirects: only fixed internal legacy targets and fixed apex canonicalization; no user-controlled redirect target or open-redirect surface exists.
- Robots/sitemap: indexing is environment opt-in. Preview/test default is noindex and tested. Production indexing is a deliberate environment decision; temporary preview hosts never become canonical.

`/api/health` is a minimal, constant-work liveness response with safe status, server timestamp, request ID, and `no-store`. It performs no provider/database/config check and is not full readiness. Do not expose secrets, environment names/status, build paths, private data, or verbose version details through it.

The hosted server is a Cloudflare Worker through Sites. The current Sites runtime contract provides 128 MB per isolate. Process-local rate-limit and email-duplicate maps can reset on cold start and differ across instances; they are not global enforcement. No durable filesystem write, D1, R2, database, queue, or migration exists, so process restart loses no authoritative application data. Durable/distributed controls become required before high-risk writes or demonstrated multi-instance correctness problems.

Sites creates explicit versions, but repository evidence does not establish the platform's mixed-version/atomicity semantics. Treat deployment atomicity and concurrent-deploy behavior as **UNRESOLVED**; avoid concurrent production operations and verify the selected version/SHA after each deploy.

## Solo-owner production release checklist

1. Confirm this is a separately authorized production deployment task; freeze unrelated deploys during an incident.
2. Confirm approved `main` branch and exact SHA; fetch `github` and require remote/local match.
3. Confirm a clean tree and no untracked release-critical files.
4. Review user-visible, business-rule, provider, privacy, security, accessibility, resource, and time changes. Any business-rule change must cite its approved business reference.
5. Run `npm run doctor`, `npm run env:summary`, `npm run scan:secrets:history`, and `npm run validate:full` from the exact SHA. Required checks must be green; review known warnings.
6. Confirm Node/npm/install/build/output settings and successful build-artifact check.
7. Compare host environment **names/assignments**, not values. Confirm preview separation and every production provider state. Do not enable unresolved writes.
8. Confirm hosted secrets live only in the host secret store; CI/preview has no production secret.
9. Identify the rollback SHA/version and verify no incompatible persistent-state change exists.
10. Create/save the exact Sites version for the approved SHA. Deployment remains a separate explicit action.
11. After owner approval, deploy that exact version once. Stop blind repeats if it fails.
12. Run the non-writing smoke checklist below.
13. Record environment, SHA, source, validation result, deployed version/result, rollback SHA, and notes in the approved record system.

No release may proceed with a red required check. The four known `no-img-element` lint warnings and the reviewed 1.75 MiB social image warning are visible accepted baseline warnings; they do not authorize new warnings.

## Post-deploy smoke test

Use safe `GET`/navigation checks only unless the owner separately authorizes a real write-path test:

- canonical home returns success over HTTPS;
- apex redirects once to canonical `www` without losing path/query;
- `/api/health` returns the minimal schema with `no-store`;
- contact page renders, but do not submit a routine production inquiry;
- estimator and care planner critical paths render and calculate/review locally without provider writes;
- Privacy and Terms render;
- legacy redirects, 404, robots, sitemap, canonical metadata, security headers, and critical assets match the intended environment;
- no obvious client JavaScript failure or broken asset is visible;
- provider gates remain in their approved states.

A real email, SMS, payment, booking, webhook, calendar mutation, or Precise Petcare mutation is never a routine smoke test. It requires explicit authorization, clearly synthetic data/recipient, provider-safe idempotency/reconciliation, and a cleanup/record plan.

## Rollback and failed-deploy recovery

### Rollback

Rollback means selecting/redeploying the last known-good exact Sites version/SHA or rebuilding that exact SHA when the retained artifact is unavailable. It never means rewriting Git history.

1. Stop unrelated or repeated deployments.
2. Confirm incident scope, currently selected version, deployed SHA if available, and intended rollback SHA.
3. Confirm provider gates/environment assignments expected by the rollback.
4. Select/redeploy the last known-good exact version through the authorized Sites workflow.
5. Re-run health, critical routes, headers, indexing, redirects, assets, and provider-gate checks.
6. Record result and follow-up corrective work.

The current app has no database migration or durable application state. Future migrations must be separately reviewed for backward compatibility, expand/contract sequencing, backup, rehearsal, and rollback limits; a code rollback cannot be assumed to undo data.

### Failed deployment

Identify the failed stage: source identity, install, build, artifact packaging, version creation, activation, DNS/TLS, runtime, environment configuration, or smoke. Inspect redacted logs, compare the intended SHA, verify configuration **names**, reproduce build/validation at that SHA, fix the root cause, create a new reviewed version, and deploy only once reauthorized. Do not rotate/change secrets randomly, weaken checks, or loop blind retries.

Production platform log access, retention, alert ownership, and live-provider diagnostic policy remain unresolved. Logs must never expose secret values, raw contact/address/calendar/provider payloads, private data, or build paths to clients. Hosting-generated logs/artifacts are not a secret store.

## Deployment records and release notes

Use Git SHA as the release version. Semver/package-version churn is not needed for this site today. Sites version history plus a concise record under `docs/deployments/` or an equally reliable owner-controlled system is sufficient only when it records the exact SHA and result. Do not backfill a guessed production SHA.

Meaningful releases should note user-visible changes, business-rule changes and their authority, integration/config-name changes, known limitations, and rollback SHA. Environment changes receive the same discipline as code changes. Never include secret values.

## DNS, domain, account, and provider boundaries

- DNS is separate from application deployment. Never change records merely because a version is ready.
- Future cutover: validate the version first, verify TLS/canonical host/redirects, change only exact reviewed web records, observe propagation, smoke, and retain a DNS rollback plan.
- MX, SPF, DKIM, and DMARC protect email and are separate owner-controlled work. Do not change them casually during web release.
- Hosting, GitHub, DNS/registrar, Google Workspace, and provider accounts should be business-owner controlled with MFA and securely stored recovery codes outside the repository.
- Deploy tokens must be short-lived or narrowly scoped to the one Site/source operation where the platform supports it. Do not use owner/admin credentials in CI or persist source credentials in Git remotes, command logs, files, artifacts, or docs.
- Turnstile production hostname restrictions, environment-separated keys/action binding, Google key/API/network restrictions and quotas, private-calendar ownership, Resend sender/domain/recipient/retention, and production write-gate state require owner/provider verification outside this repository.

## Current risk register

| Severity | Finding and disposition |
| --- | --- |
| **CRITICAL** | None found in repository/CI: no production secret in the client build, untrusted-PR secret path, feature-branch production deploy, unauthenticated deploy hook, or production-data build fetch. |
| **HIGH** | Production provider environment values/inheritance and exact currently deployed SHA cannot be verified from repository/public responses. Owner must verify Sites version history and environment assignments before the next deployment; do not test writes or export values. |
| **HIGH** | Any future preview inheriting production write-capable secrets would be unsafe. Hosted previews remain unconfigured until separation is verified. |
| **MEDIUM** | Production host log access/retention, deployment atomicity/concurrency semantics, and external configuration-change audit remain unresolved. |
| **MEDIUM** | Process-local limits/idempotency are not cross-instance; acceptable for the current low-volume email-only flow, not for future high-risk writes. |
| **MEDIUM** | CSP retains `unsafe-inline` for current framework compatibility. No `unsafe-eval` exists; nonce/hash hardening is deferred until the runtime supports a tested design. |
| **LOW** | CI retains synthetic Playwright failure artifacts for seven days; repository collaborators may access them. Keep inputs synthetic and remove artifacts early if an unexpected private capture occurs. |
| **LOW** | Generated server bundles include build-machine paths used by the framework. They are not client artifacts and must remain private to hosting; client outputs and errors are checked. |
| **INFO** | Validation-only Linux CI, exact action pins, build-artifact privacy checks, conservative HSTS, preview noindex tests, release checklist, rollback, and record template are implemented. |

## Unresolved owner decisions

1. Verify and record the exact SHA/version currently serving production; do not infer it from public content.
2. Verify Sites production vs preview environment-variable inheritance by **name/assignment only**.
3. Decide whether hosted previews are needed. If yes, establish separate/off provider configuration before enabling them.
4. Decide whether a real staging environment is worth operating; it is currently absent.
5. Decide production Resend readiness/write-gate state and provider retention/reconciliation separately.
6. Verify Turnstile hostnames/keys, Google restrictions/quotas, private-calendar ownership, host log access/retention, and deployment atomicity/version behavior.
7. Configure recommended `main` branch protection after the new Validation workflow is observed green.
8. Store account recovery codes and confirm MFA/ownership outside the repository.

None of these decisions authorizes a dashboard change, provider write, deployment, or DNS action.

## References

- `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, and `.env.example`
- `.openai/hosting.json`, `vite.config.ts`, `proxy.ts`, `app/robots.ts`, `app/sitemap.ts`, and `/api/health`
- `docs/business-reference/README.md`
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md` (`CURRENT / APPROVED`)
- `docs/business-reference/operations/35-annual-business-policy-audit.md` (`CURRENT / APPROVED`)
- F0–F11 technical foundation documents and executable checks

No business, pricing, cancellation, Overnight, holiday, estimator/planner, SMS/legal, booking, payment, service-area, credential, safety, or Client-facing policy is changed by this foundation.
