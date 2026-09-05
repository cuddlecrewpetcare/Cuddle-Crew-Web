# Data and Privacy Architecture

> Status: CURRENT TECHNICAL FOUNDATION
>
> Classification: PUBLIC-REPOSITORY-SAFE TECHNICAL REFERENCE
>
> Scope: Data inventory, handling boundaries, retention states, backup/recovery, and future migration safety. This document does not create Client-facing privacy, consent, contractual, or legal policy.

## Governing rule

Collect, transmit, retain, and expose only the minimum data required for the current function.

This document is subordinate to the business-reference hierarchy. Use [`business-reference/guidance/source-of-truth-document-hierarchy.md`](business-reference/guidance/source-of-truth-document-hierarchy.md) for authority and conflicts, and [`business-reference/guidance/sms-communications-consent-compliance.md`](business-reference/guidance/sms-communications-consent-compliance.md) for SMS consent data. Precise Petcare remains the operational source of truth for current approved Client-specific profiles, care instructions, access details, schedules, bookings, and service plans. The website must not become a competing Client-record system.

## Classification model

Assign one primary confidentiality class and any useful lifecycle qualifiers. When classification is genuinely uncertain, use `PRIVATE / MANUAL REVIEW` until an authorized reviewer decides.

| Class | Meaning | Current examples |
| --- | --- | --- |
| `PUBLIC` | Intentionally publishable | Approved public website copy, public service catalog, business name, public business email/phone, public geographic planning data |
| `INTERNAL` | Non-public operational or implementation context whose disclosure is not normally harmful | Safe architecture metadata, non-sensitive implementation configuration, review status without private reasoning |
| `PRIVATE` | Identifying or Client/business-specific data requiring limited access | Client name, email, phone, pet name tied to a Client, consent record, emergency contact, provider identifiers |
| `SENSITIVE` | Private data whose exposure could materially affect safety, security, health, finances, or travel privacy | Exact home/access details, keys or alarm information, travel dates tied to a person, veterinary/medication/behavior details, incident records, payment metadata, internal acceptance notes |
| `SECRET` | Credentials that grant access or authenticate a system | API keys, tokens, private calendar URL, signing secrets, passwords, private service origin when used as protected routing configuration |

Lifecycle qualifiers are independent of confidentiality:

| Qualifier | Meaning |
| --- | --- |
| `GENERATED` | Rebuilt from authoritative source/configuration, such as build output |
| `DISPOSABLE` | Temporary output that may be removed after the task or failed-run investigation |
| `BACKUP` | Recovery copy, not the active source of truth unless deliberately restored |
| `TEST / SYNTHETIC` | Fabricated data that is not derived from a real Client or production record |

Do not label ordinary public content sensitive merely because it is data. Conversely, hashing, compression, ignored status, or removal from a page does not automatically make private data public-safe.

## Current data-surface inventory

The F3 audit found no application database, ORM, schema, SQL migration, SQLite file, D1 database, R2 bucket, Redis instance, file-upload feature, cookie, IndexedDB use, localStorage use, authentication system, direct Precise Petcare API, Dialpad/SMS sending API, payment API, or external analytics backend. `.openai/hosting.json` has `d1` and `r2` set to `null`; this is observation, not permission to change hosting.

| Surface | Data and flow | Persistence | Class / handling |
| --- | --- | --- | --- |
| React component state | Estimator inputs, dates, exact address while typed, contact fields, Turnstile token, planner answers | In-memory until navigation/reload/component reset | Mixed `PUBLIC` planning data and `PRIVATE`/`SENSITIVE` user input; never treated as a record |
| `sessionStorage`: `cuddlecrew-care-plan-v1` | Bounded pet types, selected service/windows, midday choice, ZIP, coarse zone/availability | Current browser tab session; user can clear | Low-risk planning state; excludes dates, exact address, identity, medical, behavior, medication, separation, tasks, and access data |
| `sessionStorage`: `cuddlecrew-care-planner-v1` | Bounded pet counts, life stage, routine intervals, windows, Overnight choice, visit-fit selection | Current browser tab session; user can clear | Low-risk planning state; excludes names, dates, exact address, contact, medication, behavior, separation, and task details |
| `sessionStorage`: `cuddlecrew.referral` | One allowlisted campaign source | Current browser tab session | `PUBLIC`; no full referrer URL |
| URLs | Allowlisted `ref`, bounded planning-prefill fields, service choice, windows, broad pet composition, and ZIP | Browser/server history and logs may retain URLs | No identity, exact address, contact message, service dates, medical/access data, or credentials are permitted |
| Contact API | Name, email, optional phone/ZIP/SMS choice, topic, message, honeypot, start time, optional Turnstile token | No local durable store; transient request plus provider/mailbox copies | `PRIVATE`, with message potentially `SENSITIVE`; strict size/schema validation and safe errors |
| Contact duplicate suppression | SHA-256 fingerprint of selected submission fields | Server-instance memory for about two minutes | Pseudonymous `PRIVATE`, transient; not logged or returned |
| Rate limiting | Validated Cloudflare client IP inside a purpose-prefixed key and counter | Server-instance memory for the request window; expired entries are opportunistically pruned | `PRIVATE`, transient operational security data |
| Address APIs | Typed address to website server, then Google suggestions/validation; validated destination and private origin sent for typical route duration | No application persistence; browser component state only; responses use `no-store` | Exact address `SENSITIVE`; server key/origin `SECRET`; only city, ZIP, and derived tier return from final check |
| Availability API | Service date range in a bounded JSON POST body; private ICS feed read server-side; coarse dates/status returned | No application persistence; request, upstream fetch, and response use `no-store` | Requested dates `PRIVATE`; raw calendar and URL `SENSITIVE`/`SECRET`; raw events never return |
| Estimate API | Pet types/complexity flag, service, dates, windows, ZIP, travel tier | No application persistence; `no-store` result | Planning request may be `PRIVATE`; internal review reasons stay server-side |
| Public analytics event | Allowlisted event name and bounded dimensions dispatched as a browser custom event | No connected backend; referral lookup is session-only | `PUBLIC`/low-risk observational data; prohibited keys are rejected in development and stripped |
| Environment configuration | Optional provider credentials and private endpoints in `.env.local`; safe names/defaults in `.env.example` | Local ignored file or production secret configuration | `SECRET`, except intentionally public Turnstile site key and indexing flag |
| Public/static assets | Files under `public/` are addressable whether referenced by a page or not | Git and deployed static output | Must be intentionally public, authority-reviewed, free of private metadata/content, and legally usable |
| Business references | Approved and placeholder rule documents in Git | Git history | Authority/classification comes from each document; Client-specific information is prohibited |
| Development/build state | `node_modules`, `.next`, `.vinext`, `dist`, `.wrangler`, `.cache/local-dev`, reports, traces, screenshots, logs | Local/generated and ignored | `GENERATED`/`DISPOSABLE`; must never become a private-data cache |
| Git source | Application source, safe configuration templates, documentation, tests, public assets | GitHub remote and clones | Public-repository-safe content only |

## Authority and provenance

| Information | Authority | Derived or observational copies |
| --- | --- | --- |
| Business/domain rules | Most specific applicable `CURRENT / APPROVED` business reference | Application configuration, code, tests, UI, and generated output |
| Current approved Client-specific operations | Precise Petcare, subject to safety/scope and higher authority | Preliminary contact email, old messages, browser planning state |
| Source code and migrations | Reviewed Git commit on the approved branch | Worktrees, build output, caches |
| Contact delivery | Provider delivery result and business mailbox copies, within the current implementation | Transient browser/server request and duplicate fingerprint |
| Analytics/logs | Observational only | Never a business or Client source of truth |
| Backup | Recovery copy with source, age, integrity, and schema metadata | Never canonical merely because it is newer or larger |

Derived data should record safe provenance when it materially helps recovery or interpretation: source type/identifier, schema or format version, generation time, and generator version. Never copy sensitive raw source content solely to prove provenance.

## Client, home, and pet data boundary

Client names, email addresses, phone numbers, pet names tied to a Client, emergency contacts, media/SMS consent, and provider record identifiers are `PRIVATE`. Exact service addresses, access/key/lockbox/alarm details, travel schedules, medical/veterinary/medication/behavior information, incident records, and payment metadata are `SENSITIVE`. Credentials are `SECRET`.

These fields must not enter public pages, static source, public assets, client bundles, URLs, analytics, screenshots, fixtures, logs, build output, unauthenticated responses, or Git. Preliminary website data does not become authoritative merely because it was received. Reconcile current operational records in Precise Petcare rather than maintaining an unplanned duplicate.

## Actual contact and consent flow

```text
User
  -> browser React state
  -> POST /api/contact JSON (validated, bounded, rate-limited)
  -> optional Cloudflare Turnstile verification (token and request IP)
  -> Resend email to the business mailbox
  -> Resend confirmation email to the submitted address
```

The website has no contact database. It stores only a two-minute in-memory submission fingerprint for duplicate suppression and short-lived in-memory rate-limit state. The application logs provider status/category only, not payloads. Safe errors do not reflect submitted values. The error fallback opens a static-address/subject `mailto:` link and does not put entered fields in the URI.

When `smsConsent` is affirmatively true, the server—not the browser—adds `website_contact_form` and a current timestamp to the delivered inquiry. No source or timestamp is created for non-consent, and client-supplied consent metadata is rejected. This does not claim to update Precise Petcare, Dialpad, or another CRM. Phone possession alone is not consent. STOP/HELP storage, provider operations, authoritative consent retention, and any future system reconciliation remain governed by the canonical SMS reference and require operational verification.

## Third-party technical boundaries

| Service | Current technical interaction | Duplicate local record | Unresolved boundary |
| --- | --- | --- | --- |
| Precise Petcare | Browser links to registration/login only; no API | None | Provider retention/access is outside this codebase; remains operational Client-record authority |
| Resend and email mailboxes | Full validated inquiry and server-created affirmative consent metadata are sent; confirmation sent to visitor | No database; transient fingerprint only | Provider/mailbox retention, deletion, access, and correction process require owner/provider policy |
| Cloudflare Turnstile | Public site key loads widget; secret, token, and validated request IP are used server-side for verification | None after request | Provider retention and production configuration require provider/owner review |
| Google Maps Platform | Address text for suggestions/validation and addresses for route-duration calculation | No exact-address store | Provider retention/configuration and key restrictions require operational review |
| Private calendar host | Server fetches bounded ICS through a protected URL and emits coarse review state only | No raw feed store or cache in application | Calendar-provider retention/access remains external |
| OpenAI Sites / Cloudflare runtime | Hosts application and necessarily processes HTTP requests and platform diagnostics | No D1/R2 application store configured | Platform request/log retention and production access controls require owner/provider review |
| Dialpad / SMS provider | No implemented API or send path | None | Current vendor, number, opt-out/HELP behavior, consent system of record, and retention remain unresolved |
| Payment provider | No API; browser links to Precise Petcare portal | None | Future IDs/status metadata would be `PRIVATE`; full card numbers, CVV, and payment credentials must never be stored here |

Do not infer contractual terms, processor guarantees, or deletion behavior from this technical map.

## Server/client and validation rules

- `RESEND_API_KEY`, `PRIVATE_CALENDAR_ICS_URL`, `GOOGLE_MAPS_SERVER_KEY`, `PRIVATE_SERVICE_ORIGIN`, and `TURNSTILE_SECRET_KEY` are server-only.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is intentionally browser-public and must never hold the secret.
- Browser validation supports usability; server validation is authoritative for server processing.
- Browser input, API JSON, query parameters, third-party responses, webhooks, imports, and uploads are untrusted.
- Private APIs introduced later require server-side authorization for each object/action. Authentication alone and possession of an ID are not permission.
- Return the minimum fields required. Predictable or opaque identifiers do not establish authorization.

## Logging, errors, and debugging

Logs and reports may contain request IDs, provider/status category, safe counts, bounded timing, and redacted identifiers. They must not contain keys, tokens, credentials, full contact bodies, exact private addresses, access instructions, travel schedules, medical/behavior details, payment data, raw provider payloads, or private filesystem locations returned to clients.

Client errors should be actionable but generic. Do not reflect rejected input, stack traces, credentials, provider bodies, internal paths, or private decision reasons. Debugging output, screenshots, issue text, Codex reports, and commit messages follow the same rule.

## Retention framework

No legal retention period is created here. Every future durable field needs an approved owner, purpose, access boundary, correction/deletion behavior, backup treatment, and retention class before implementation.

| Retention class | Meaning | Current examples |
| --- | --- | --- |
| `TRANSIENT` | Used only while processing | React form/address state, API body, Turnstile token, raw fetched calendar in a request |
| `SESSION-LIMITED` | Browser-tab session only, with clear/reset behavior | Three bounded `sessionStorage` records |
| `UNTIL TASK COMPLETE` | Kept only for an active development/investigation task | Synthetic test artifacts, failure traces, redacted diagnostics |
| `OPERATIONAL RETENTION` | Needed for an approved operating purpose; period must be defined by authority | Provider/mailbox inquiry and consent evidence; currently unresolved |
| `LONG-TERM RECORD` | Authoritative record retained under approved business/legal policy | Current approved Precise Petcare record where applicable; period unresolved here |
| `BACKUP-RETENTION` | Recovery copy kept under a defined schedule and access policy | No application database backup exists today |
| `UNRESOLVED / REQUIRES POLICY` | Period or deletion behavior has no approved authority | Email inquiries, SMS evidence/opt-outs, provider/platform logs, historical media handling |

Correction starts in the authoritative system. Invalidate or regenerate downstream caches and derived views after a correction. A deletion in one system does not prove deletion from providers, mailboxes, logs, synced exports, caches, or backups; verify each applicable copy and never promise a guarantee the architecture cannot provide.

## Schema versus real data

There is no application database today; F3 does not add one. When appropriate, reviewed schemas, migrations, types, validation definitions, and synthetic seed structure may be versioned. Real databases, Client rows, actual contact/consent records, provider exports, production snapshots, credential-bearing exports, private dumps, access instructions, and payment records are not versionable by default.

JSON, YAML, TOML, CSV, and SQL are formats, not classifications. Review their contents and provenance. Safe migration SQL may belong in Git; a SQL data dump does not. Synthetic fixtures must be obviously fabricated and independent of production.

## Development, test, and artifact safety

Local development and automated tests must not use production/Client data by default. Tests use fabricated names, reserved/example email domains, non-routable or clearly fictional network data, fake addresses, and non-real credentials. Browser tests intercept contact delivery and do not make bookings or send real messages.

Exceptional production-like debugging requires explicit authorization, the least data possible, preferably anonymized/sanitized input, temporary access, no Git/screenshot/log leakage, and reviewed cleanup. F3 creates no production-export workflow.

Playwright screenshots and traces are failure-only, videos are off, and all reports live under ignored `.cache/local-dev/playwright/`. Treat any failure artifact as potentially private even when tests should be synthetic. Preserve only while needed for diagnosis, then clean the exact generated target.

## Files, temporary state, and caches

- Safe caches: dependency cache, `node_modules`, compiler/framework cache, generated build output, and synthetic test cache.
- Potentially private caches: request bodies, provider responses, rendered Client records, raw calendars, contact payloads, or authenticated pages. None is authorized today.
- Temporary files must use a project/OS temp location, unique names, bounded inputs, safe path resolution, and cleanup on success/failure where evidence is no longer needed.
- Never put temporary or private files in `public/`, the repository root, a shared folder, or a source directory.
- The secret scanner's temporary snapshot/report is local, redacted on output, and removed after the scan.
- There is no upload feature. Any future upload requires MIME and extension checks, size and parsing limits, safe generated filenames, traversal prevention, archive/bomb assessment, non-executable storage, retention, cleanup, and malware-scanning evaluation.

## Backups and recovery

| State | Treatment |
| --- | --- |
| Git-tracked public-safe source | GitHub is a remote source repository; verify remote commit before relying on it |
| `node_modules`, build output, reports, caches | Regenerate; do not back up as project records |
| `.env.local` and credentials | Recreate from an approved secret manager; never plaintext-backup in the repository |
| Precise Petcare/provider records | Remote authoritative where established; review provider export/recovery separately |
| Future unique database/private state | Must have encrypted/access-controlled backup, named owner, schedule, integrity check, and tested restore before destructive change |

Git is not a backup for uncommitted private data. Backups containing credentials, Client data, or private configuration must not live in public Git, `public/`, repository root, logs, or casual shared/temp storage.

A restore plan must verify the expected source, backup age, integrity/hash, schema/migration version, application compatibility, exact destination, access controls, rollback path, and post-restore invariants. Restore first to an isolated target where practical. A recovered copy becomes canonical only through an explicit restore decision.

## Migration and drift policy

Before any destructive or schema migration:

1. Identify the exact source system, schema, migration state, and version.
2. Review the migration and label each operation destructive, non-destructive, or uncertain.
3. Verify a recoverable pre-state when important data exists.
4. Rehearse on a disposable representative copy where practical.
5. Validate counts, unique constraints, foreign keys, required values, IDs, timestamps, permissions, enums/status mappings, semantic mappings, duplicates, and orphans as applicable.
6. Verify application compatibility before and after the change.
7. Preserve a feasible rollback path and document irreversible behavior.
8. Confirm the destination and authorization immediately before write.
9. Validate post-migration invariants; never infer success from an exit code alone.
10. Record migration/provenance results without copying sensitive row contents.

The application must detect or fail safely on an unexpected schema version, missing migration, unknown enum/status, missing required field, incompatible import/export version, or partially applied change. Add a migration framework only when real persistence requires it.

## Legacy data archaeology, imports, and exports

Legacy investigation is read-only first. Inventory candidate databases, schemas, migrations, dumps, backups, exports, hashes, sizes, row counts, modified times, application references, credentials, private content, and provenance. Classify each as `canonical candidate`, `backup`, `export`, `test`, `private`, `stale`, `duplicate`, or `unknown/manual review`. Do not infer canonical status from newest timestamp, largest size, or a filename. Do not delete during archaeology.

Future imports follow:

```text
ANALYZE -> VALIDATE -> PREVIEW -> APPROVE -> WRITE
```

Validate schema/version, encoding, size, paths, fields, malformed rows, duplicates, private fields, partial-failure semantics, and rollback. Future exports use an explicit allowlist, version the schema when useful, exclude secrets/unrelated private fields, label sensitive output, write outside tracked/public paths, and define cleanup/retention. No import or export feature exists today.

## Automated safeguards

`npm run check:git-safety` already rejects tracked/staged database files, dumps, backups, archives, keys, logs, private/export directories, generated directories, and oversized files. `.gitignore` covers local database/journal files, private/export/backup directories, environment files, caches, logs, reports, and build output. `npm run scan:secrets` covers current non-ignored content; the separate history scan covers reachable history.

Decision for a separate `check:data-safety`: **NOT NEEDED** in F3. Another filename scanner would duplicate the existing Git guard, while broad content inspection could read private material and produce brittle false confidence. Existing targeted tests cover trusted SMS metadata, safe API errors, non-sensitive planning storage, analytics filtering, private calendar output, no-store/body-only availability dates, and synthetic browser flows.

## F3 point-in-time findings and risk register

| Severity | Finding | F3 disposition |
| --- | --- | --- |
| `CRITICAL` | No active credential, full-card data, private home/access record, or public private-record API was found in the current tree | None |
| `HIGH` | Nine files historically identified as Client-pet photographs were still directly addressable under `public/`, while public-use consent could not be confirmed | Removed only those nine files from the F3 branch tip with owner authorization; no replacement media; consent remains `UNRESOLVED` |
| `HIGH` | Those Client-pet files remain in existing public Git history | Separate privacy/history review required; F3 does not rewrite history or force-push |
| `HIGH` | The public repository tracks documents classified as internal references, including internal logic. Their appropriate publication boundary has not been formally resolved | Owner/legal/security review required before any relocation or sanitization; F3 preserves source-of-truth files and does not expose their contents through the website |
| `MEDIUM` | Unreferenced owner/personal and membership-certificate assets remain under `public/`, so direct URL access is possible even when pages do not link them | Review necessity, publication authority, and removal separately; no additional deletion was authorized in F3 |
| `MEDIUM` | Provider/mailbox/platform retention, deletion, and access settings are not established in this repository | `UNRESOLVED / REQUIRES POLICY`; verify with owner and providers |
| `MEDIUM` | SMS opt-out/HELP storage, current messaging vendor, authoritative consent system, and reconciliation are not implemented/verified here | Preserve canonical SMS rules; operational/provider review required |
| `LOW` | Availability dates and contact fallback fields could enter URLs, private calendar fetch/output could be cached, and expired rate-limit identifiers lacked opportunistic pruning | Corrected in F3 without changing public legal/SMS copy or business behavior |
| `INFO` | No database, object store, uploads, authentication, payment API, direct portal API, or external analytics backend exists | Do not add one without a concrete need and a new data-design review |

The nine removed tip files are:

- `public/gallery-black-dog.jpeg`
- `public/skylar-smile.jpeg`
- `public/skylar-profile.jpeg`
- `public/gallery-tan-dog.jpeg`
- `public/loki-portrait.jpeg`
- `public/gallery-sunny-dog.jpeg`
- `public/hero-dog.jpeg`
- `public/gallery-aussie.jpeg`
- `public/blu-walk.jpeg`

## Unresolved decisions

- Locate and validate asset-specific public-use consent documentation, including withdrawal handling, before any Client image returns.
- Decide whether historical media exposure requires coordinated repository-history remediation; this must be a separate authorized task.
- Decide whether internal business-reference material is appropriate for a public Git repository or requires a private authority store plus a public-safe implementation mirror.
- Review direct-publication need and authority for remaining unreferenced personal/certificate/static assets.
- Approve operational/legal retention, correction, deletion, and access rules for email inquiries, SMS consent evidence, opt-outs, provider logs, and backups.
- Verify the current SMS provider/number, STOP/HELP behavior, consent system of record, and reconciliation process.
- Verify Resend, mailbox, Google, Turnstile, hosting/runtime, calendar-provider, and Precise Petcare retention/access/deletion settings without inventing contractual guarantees.
- Define backup ownership and recovery objectives before introducing unique persistent application state.

Any future persistent store, authenticated data surface, provider write integration, upload, import/export, analytics backend, or payment integration requires a new data-flow and retention review before implementation.
