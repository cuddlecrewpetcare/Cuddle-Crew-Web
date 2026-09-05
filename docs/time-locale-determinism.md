# Time, Time Zone, Locale, and Determinism

> Status: CURRENT / ENGINEERING BASELINE
>
> Baseline: F10 audit from F9 checkpoint `87f7c54b75966401917ad544264ddcc952a8aa31`
>
> Scope: representation, parsing, arithmetic, clocks, provider boundaries, tests, and build determinism. This document implements but does not create business policy.

## Authority and business timezone

`America/Los_Angeles` is the canonical business timezone. It is centralized in `app/config/business.ts`, matches the Sacramento-area operating context, is used for business-local scheduling decisions, and is verified against the runtime's IANA data. Fixed offsets and the abbreviations PST/PDT are not calculation inputs.

The business-reference hierarchy controls. The Pricing, Fees & Surcharge Policy is CURRENT / APPROVED and distinguishes same-calendar-day daytime requests, daytime requests less than 24 elapsed hours ahead, and Overnight requests less than 48 elapsed hours ahead. The Cancellation, Booking Change & Refund Policy controls its separate thresholds. The exact Holiday / Peak-Date Calendar remains PLACEHOLDER and cannot authorize a date or automatic fee.

## Semantic model

| Type | Meaning | Canonical representation | Current examples |
| --- | --- | --- | --- |
| Instant | One global moment | `Date` internally; ISO 8601 with `Z` or offset at boundaries | contact/SMS consent, diagnostics, availability update |
| Business-local date | Calendar date in business policy | validated `YYYY-MM-DD` | estimate and availability service dates |
| Wall-clock time | Local clock reading that is not an instant alone | structured date + hour/minute + IANA zone | Service-window and Overnight boundaries |
| Duration | Elapsed quantity | integer milliseconds/minutes with named units | 24/48-hour notice, provider timeouts |
| Calendar day / Service night | Business unit, not 24 elapsed hours | date-only arithmetic and approved start-date ownership | estimate days and Overnight units |

Date-only helpers use UTC only as a neutral integer calendar index. That technique prevents host-timezone drift; it does not assign UTC meaning to a business date. Caller-owned `Date` objects are not mutated.

## Parsing and serialization

- Browser `<input type="date">` values remain `YYYY-MM-DD` through POST bodies. There is no `datetime-local` input.
- Authoritative instants require `Z` or an offset. Offset-free datetime strings are not accepted as instants.
- Business-local wall clocks are resolved with `Intl.DateTimeFormat` and the IANA zone. Nonexistent spring-forward times and repeated fall-back times return review instead of being normalized or guessed.
- Private-calendar `DTSTART` values accept valid UTC values, explicit supported `TZID` values, and date-only events. Floating values, malformed values, unsupported zones, DST gaps, and repeated wall-clock times fail conservatively. Raw calendar contents never become public output.
- Server-created timestamps use `toISOString()`. Display locale does not feed business logic.

## DST, midnight, and Overnight Care

Overnight Care is the approved business-local wall-clock interval approximately 6 PM through 8 AM and is owned by its start date/night in the current estimator; checkout is exclusive. It is not 24-hour continuous presence and not a fixed 14-hour elapsed guarantee. Tests show the same local interval can span 13 hours across spring-forward and 15 hours across fall-back.

Same day means equality of the Service date and current date in `America/Los_Angeles`; it never means “less than 24 hours.” Short-notice thresholds compare resolved Service instants with an authoritative instant. Exactly 24 or 48 hours is outside a policy written as “less than.” Midnight, month/year, leap-day, spring-forward, and fall-back boundaries are covered.

## Business-rule time matrix

| Rule | Authority | Semantic type / zone | Boundary | Implementation / unresolved detail |
| --- | --- | --- | --- | --- |
| Daytime short notice | Pricing policy §6 | elapsed instant / Pacific Service wall clock | `<24h`; same day excluded | implemented as potential fee + review |
| Same-day daytime | Pricing policy §6 | Pacific calendar date | equal local dates | implemented; replaces short-notice fee |
| Overnight short notice | Pricing policy §6 | elapsed instant / Pacific 6 PM start | `<48h` | implemented as potential fee + review |
| Cancellation | Cancellation policy §§3–6 | hours/days before applicable scheduled Service | 24h, 72h, 7d, 14d language; exact “at least” boundaries are outside the shorter tier | no calculator; booking category and authoritative receipt/Service instant remain required |
| Overnight window | Pricing policy §3 | Pacific wall-clock interval spanning midnight | approximately 6 PM–8 AM | start date owns the current estimator night; DST changes elapsed hours |
| Availability window | F8 resource contract | inclusive date-only range | maximum 31 returned dates | POST/no-store; independent of host timezone |
| Holiday date | Holiday calendar | future Pacific Service-date semantics | unresolved | PLACEHOLDER; no dates and no automatic fee |
| Contact/SMS timestamp | SMS reference and server implementation | server-created instant | at accepted processing attempt | ISO `Z`; browser cannot supply provenance |

Cancellation thresholds are documented, but the website has no cancellation calculator. F10 does not guess booking-category, receipt-time, scheduled-Service-time, or future holiday-date details and does not change cancellation policy.

## Clocks, expiry, and authority

Wall clock is used for human/audit instants and calendar semantics. Monotonic `performance.now()` is used for process-local rate-limit/duplicate expiry, provider response deadlines, parser budgets, and repaired provider timing where implemented. Provider timeouts remain: Turnstile/Google 5 seconds, private calendar 7 seconds, and Resend 8 seconds. Provider token validity is decided by provider verification, not browser time.

Rate-limit state and the two-minute duplicate window are bounded and process-local; they make no distributed-ordering or cross-instance guarantee. Rate-limit tests cover before, exact, and after expiry without sleeping. Provider idempotency retention remains provider behavior and is distinct from local duplicate suppression. UUID-based idempotency keys are not timestamps.

The contact form's former client `startedAt` heuristic was removed. It was forgeable and supplied no trustworthy security value. Turnstile when configured, honeypot behavior, strict schema/field/body limits, server-side rate limiting, duplicate suppression, provider write gating/idempotency, safe errors, no-store responses, and redacted observability remain authoritative.

## Locale and machine independence

`Intl` locale formatting is limited to presentation or extraction of numeric IANA-zone parts. Business comparison uses canonical strings/numbers and never parses formatted currency/date text. Currency display currently uses explicit US-dollar presentation; pricing logic uses numeric configuration. No locale polyfill or date library is needed.

Node tests do not depend on the host `TZ`: instants include `Z`, date-only arithmetic is pure, and business-local resolution specifies the IANA zone. Targeted Playwright timezone emulation is NOT NEEDED because browser values remain date-only and pure helper tests cover the business zone/DST boundaries. Linux/macOS runtime behavior remains subject to the broader F9 support classifications.

## Deterministic testing and builds

Tests pass explicit instants and injectable numeric times; expiry tests do not sleep. E2E uses the non-aging date `2099-01-02`, while unit fixtures are historical/future constants whose validity does not depend on today's date. Production code supplies the server clock only at the request boundary.

The sitemap's former `new Date()` `lastModified` value was removed because build time was not content-modification authority and made otherwise equivalent output vary. Health, diagnostics, availability-update, consent, and environment-fingerprint timestamps remain justified runtime/generated instants. The build does not call live providers.

## Automated guard

`npm run check:time` is IMPLEMENTED and part of `npm run validate`. It functionally checks Pacific timezone support, date-only/DST behavior, same-day separation, removal of client timing authority, deterministic sitemap metadata, and the unresolved-holiday safeguard. It complements focused tests rather than replacing them with broad pattern matching.

## Inventory and disposition

- **Instants:** health, diagnostics, availability updates, consent records — server-created ISO values; KEEP.
- **Business dates:** estimate/availability input, overrides, holiday lookup — canonical date-only helpers; HARDENED.
- **Wall clocks:** four daytime windows and 6 PM–8 AM Overnight — Pacific resolution; HARDENED.
- **Durations/TTL:** provider timeouts, rate limits, duplicate window, parser/E2E deadlines, UI debounce/status — elapsed controls; monotonic where server/process correctness benefits.
- **Display formatting:** money, public labels, relative prose — display-only; KEEP.
- **Build timestamps:** sitemap runtime timestamp — REMOVED; environment fingerprint creation time remains local generated provenance.
- **Test clocks:** explicit instants and numeric injected times — HARDENED; no sleeps.

## Risk register and unresolved decisions

| Severity | Finding and disposition |
| --- | --- |
| CRITICAL | Client `startedAt` controlled an anti-bot rejection. Removed from browser, schema, server logic, and tests; stronger server controls remain. |
| HIGH | Short-notice and date range logic depended on host timezone. Repaired with Pacific wall-clock resolution and date-only calendar indexes. |
| MEDIUM | Rate limits and duplicate state are process-local; acceptable for current architecture and explicitly not distributed. |
| MEDIUM | Exact holiday dates remain unresolved; automatic holiday classification stays disabled. |
| LOW | Some diagnostic duration call sites still use wall-clock subtraction; they do not control business/security outcomes and can migrate when those routes are next maintained. |
| INFO | Temporal/date library, locale polyfills, universal browser timezone emulation, and distributed clocks are not needed. |

Unresolved business decisions: populate and approve the holiday calendar; retain booking-specific cancellation receipt/Service instants in the authoritative workflow if a future calculator is built; define any future ambiguous provider-time disambiguation contract rather than guessing; and revisit distributed TTL/idempotency only if multiple instances create correctness failures.

## References used

- `docs/business-reference/README.md`
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md` (CURRENT / APPROVED)
- `docs/business-reference/core/03-pricing-fees-surcharge-policy.md` (CURRENT / APPROVED)
- `docs/business-reference/core/02-cancellation-booking-change-refund-policy.md` (CURRENT / APPROVED)
- `docs/business-reference/logic/20-overnight-acceptance.md` (CURRENT / APPROVED)
- `docs/business-reference/logic/36-holiday-peak-date-calendar.md` (PLACEHOLDER; non-authoritative for dates)
- `docs/business-reference/logic/37-service-window-capacity-planner.md` (CURRENT / APPROVED)
- `docs/business-reference/guidance/sms-communications-consent-compliance.md` (CURRENT / APPROVED)
- existing F3–F9 engineering references, application code, tests, and runtime validation
