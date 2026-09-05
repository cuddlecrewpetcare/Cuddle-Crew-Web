# External Integrations and Side-Effect Safety

> Status: CURRENT TECHNICAL FOUNDATION
>
> Baseline: F6 audit from F5 checkpoint `d06eee684cc5a41365706bf61ae7c4c72680151f`
>
> Scope: Provider inventory, environment isolation, timeouts, retries, idempotency, failure containment, and future integration rules. This document does not create business, consent, contractual, privacy, payment, or booking policy.

## Governing boundaries

The business-reference hierarchy remains controlling. Precise Petcare remains the operational source of truth for current approved Client-specific profiles, care instructions, access details, schedules, quotes, invoices, and confirmed bookings. The public website is a preliminary planning and contact surface, not a competing Client-record system.

The canonical SMS rules are in `business-reference/guidance/sms-communications-consent-compliance.md`. No provider name, stored phone number, website inquiry, payment, booking, or software default creates SMS consent. Payment, SMS, booking, deployment, DNS, hosting, and provider-dashboard changes are separate controlled tasks.

## Provider inventory

| Provider or boundary | Purpose | Current status | Access | Data class sent or exposed | Configuration / secret boundary | Authority or unresolved setup |
| --- | --- | --- | --- | --- | --- | --- |
| Resend | Business contact notification and visitor confirmation email | `ACTIVE / OPTIONAL` | `WRITE-CAPABLE` | Validated inquiry, including `PRIVATE` contact data and potentially `SENSITIVE` message text; affirmative SMS metadata only when selected | `RESEND_API_KEY` and `RESEND_SEND_ENABLED` are server-only | Provider/mailbox retention and production configuration remain operational decisions |
| Business mailbox | Receives contact notification through Resend | `ACTIVE / DOWNSTREAM TARGET` | `WRITE TARGET` | Same business-notification email | No mailbox credential is in this repository | Mailbox retention, correction, deletion, and access remain unresolved outside this codebase |
| Cloudflare Turnstile | Contact-form bot verification | `PRESENT BUT OPTIONAL` | `READ-LIKE VERIFICATION` | Token and, when valid, request IP | Site key is browser-public; `TURNSTILE_SECRET_KEY` is server-only | Widget/hostname configuration and separate non-production widgets require provider/owner setup |
| Google Maps Platform | Address autocomplete, validation, and typical route duration | `PRESENT BUT OPTIONAL` | `READ-ONLY` | Typed address; private origin and normalized destination for route duration | `GOOGLE_MAPS_SERVER_KEY` and `PRIVATE_SERVICE_ORIGIN` are server-only; key is sent in a header, never a URL | API enablement, billing, key restrictions, retention, and environment separation remain provider/owner setup |
| Private calendar host | Privacy-preserving availability enrichment | `PRESENT BUT OPTIONAL` | `READ-ONLY` | Server requests the configured ICS feed; date range stays within the app request | `PRIVATE_CALENDAR_ICS_URL` is a server-only secret URL | Host, retention, and access policy remain external; no raw feed is returned |
| Precise Petcare | Registration, login, Client records, formal requests, booking/payment operations | `LINK-ONLY` | `REDIRECT / LINK-ONLY` | Browser navigates to public provider URLs | No API credential or write integration exists | Authoritative for approved Client-specific operational records; no API behavior may be invented |
| Dialpad / SMS provider | Possible future service-related texting | `PLANNED / UNRESOLVED` | `NO ACTIVE INTEGRATION` | None from application code | No provider secret, send route, or webhook exists | Vendor/number, consent system of record, STOP/HELP, sandbox, and retention are unresolved |
| Payment provider | Possible future provider-hosted payments | `NOT USED` | `NO ACTIVE INTEGRATION` | None; the website collects no card data | No Stripe/payment key, route, SDK, or webhook exists | Provider, sandbox, capture model, fulfillment, reconciliation, and retention are unresolved |
| Webhooks | Future provider event delivery | `NOT USED` | `NO ACTIVE INTEGRATION` | None | No signing secret or endpoint exists | Must not be added without provider-specific authenticity, replay, and idempotency design |
| Public analytics | Internal browser custom events only | `INTERNAL EVENT ONLY` | `NO EXTERNAL INTEGRATION` | Allowlisted public/coarse dimensions | No endpoint or credential | Optional and fail-open; no external analytics backend is connected |
| Social/business profiles | External profile navigation | `REFERENCE / LINK-ONLY` | `REDIRECT / LINK-ONLY` | Normal browser navigation metadata | Public URLs only | Not application APIs |
| OpenAI Sites / Cloudflare runtime | Build/runtime hosting boundary | `ACTIVE HOSTING RUNTIME` | `RUNTIME BOUNDARY` | HTTP requests and platform diagnostics as required by hosting | Production configuration is outside this repository | Deployment, Sites, DNS, `.openai`, and production environment are explicitly outside F6 |

The inventory is also represented in `scripts/integration-registry.mjs` so `npm run check:integrations` can validate classifications without contacting a provider.

## Environment matrix

| Integration | Local development | Automated Node tests | E2E | Staging / sandbox | Production |
| --- | --- | --- | --- | --- | --- |
| Resend | `BLOCKED BY DEFAULT`; requires both key and explicit `RESEND_SEND_ENABLED=true` | `MOCKED`; injected sender, no live host | `BLOCKED`; runner forces write gate false and browser intercepts contact | `UNRESOLVED`; use isolated provider credentials/domain if established | `ALLOWED ONLY WITH EXPLICIT GATE` and reviewed server secret |
| Business mailbox | Only through gated Resend | Mock target only | Blocked | Unresolved isolated recipient | Through gated Resend |
| Turnstile | `OFF` when pair blank; `ALLOWED` when both keys configured | Mocked or off | Normally off | Prefer separate test widget | Allowed when complete pair is configured |
| Google Maps | Off when configuration blank; optional read-only calls | Mocked or fail-closed | Normally off | Optional isolated configuration | Optional read-only calls |
| Private calendar | Conservative fallback when blank; optional read | Mocked or fallback | Mocked/fallback | Optional non-production feed | Optional read-only feed |
| Precise Petcare links | Allowed navigation only | Static link assertions | Link assertions; tests do not navigate into or mutate provider | Allowed link only unless separately designed | Allowed link only |
| Dialpad/SMS | Blocked | Blocked | Blocked | Unresolved; sandbox required if available | Unresolved; explicit authorization required |
| Payments | Blocked | Blocked | Blocked | Future provider test mode only | Unresolved; explicit authorization required |
| Webhooks | Blocked | Local synthetic handler tests only if introduced | Blocked unless isolated | Future signed synthetic/provider sandbox events | Unresolved; explicit authorization required |
| Public analytics | Local browser event only | Local sanitizer tests | Local browser only | Local event only | Local event only until a backend is approved |
| Hosting/deployment | Local emulator only | Local only | Local server only | Separate task | Separate task |

`.env.example` contains names and safe defaults only. `doctor` and `env:summary` report configured/unconfigured state without printing values and perform no live health call.

## Current side-effect matrix

| Operation | Read/write | Target | Reversible | Duplicate risk | Retry classification | Idempotency | Failure policy |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Send business inquiry email | Write | Resend → business mailbox | No reliable rollback after acceptance | High on repeat click, client retry, or timeout ambiguity | `RETRY WITH IDEMPOTENCY`; no automatic retry today | Required and implemented with a per-attempt UUID | No success response unless Resend accepts; generic safe error otherwise |
| Send visitor confirmation | Write | Resend → submitted address | No reliable rollback | Medium | `RETRY WITH IDEMPOTENCY`; no automatic retry today | Required and implemented with a separate key for the same attempt | Failure is a partial success: business inquiry remains accepted; safe metadata is logged |
| Verify Turnstile token | Read-like verification | Cloudflare Siteverify | Not applicable | Replay risk | `DO NOT AUTOMATICALLY RETRY` in the current request flow | Provider tokens are single-use; no local replay store | Fail closed; invalid token is 400, provider/config outage is generic 503 |
| Address autocomplete | Read | Google Places API (New) | Not applicable | Billing/request burst risk | `SAFE TO RETRY` only if a future bounded client interaction justifies it; none automatic | Not needed | Fail closed to unavailable/empty suggestions |
| Address validation | Read | Google Address Validation API | Not applicable | Billing/request burst risk | `SAFE TO RETRY` only as a new user action; none automatic | Not needed | Fail closed; malformed provider envelope is unavailable, not a false user validation error |
| Route duration | Read | Google Routes API | Not applicable | Billing/request burst risk | `SAFE TO RETRY` only as a new user action; none automatic | Not needed | Degrade gracefully to `Personalized travel review required` after valid address result |
| Private calendar fetch | Read | Configured HTTPS ICS host | Not applicable | Low | `SAFE TO RETRY` as a later user request; none automatic | Not needed | Degrade conservatively to `Request for Review` |
| Portal/profile navigation | Redirect | Precise Petcare/social provider | Not applicable | No application write | Not applicable | Not applicable | Provider navigation is separate from website confirmation |

There is no current SMS send, payment intent, charge, booking creation, Client-record update, provider subscription, calendar mutation, content publication, or provider webhook side effect.

## Contact and Resend boundary

The flow is:

```text
configuration safety checks
  -> rate limit
  -> strict request parsing and validation
  -> optional Turnstile verification
  -> in-memory duplicate/attempt record
  -> Resend adapter: business notification
  -> Resend adapter: visitor confirmation
```

The adapter in `app/lib/providers/resend.ts` owns the endpoint, authentication header, 8-second deadline, write gate, idempotency header, safe request-ID mapping, and normalized failures. Application logic never receives or reflects a provider error body.

The provider receives only the fields required for the two emails. The business notification contains the validated name, reply email, optional phone, optional ZIP, topic, message, and affirmative SMS source/timestamp when applicable. The visitor confirmation receives the visitor address and minimum confirmation content. The API key remains server-only.

Live delivery requires both `RESEND_API_KEY` and `RESEND_SEND_ENABLED=true`. A key alone cannot send. Routine local development keeps the gate false. E2E forces it false. Node route tests inject a sender and static synthetic payloads. No test transport points at the live host.

Each accepted form attempt gets a random request UUID held with the submission fingerprint for about two minutes. Business and confirmation messages use distinct `contact/<uuid>` and `confirmation/<uuid>` keys. Resend documents a 24-hour idempotency retention window and rejects reuse of the same key with a different payload; the current attempt record therefore preserves both the key and consent timestamp for an in-process retry ([Resend idempotency documentation](https://resend.com/docs/dashboard/emails/idempotency-keys)).

The fingerprint includes name, email, phone, affirmative consent state, ZIP, topic, and message. A materially changed ZIP is not suppressed. Browser timing and Turnstile tokens are intentionally excluded. An accepted exact duplicate inside the window returns success without another provider call.

No automatic email retry exists. A timeout or transport exception is `UNKNOWN_OUTCOME`, because the provider may have accepted the write. A later user resubmission within the same live server process may repeat only the identical payload with the same idempotency key. A server restart loses this small in-memory attempt record; durable cross-instance deduplication/reconciliation is deferred until the architecture has durable state. This limitation is acceptable for the current low-volume contact-only flow but must be revisited before background delivery or higher-risk writes.

If the business notification succeeds and the visitor confirmation fails, the flow is not transactional and cannot roll back the first email. The route returns success because the inquiry was accepted, suppresses duplicate business delivery, and logs only provider, operation, category, outcome, and optional status. The client now says “accepted for delivery” rather than claiming final mailbox delivery. Delivery/bounce confirmation is not implemented.

## Turnstile boundary

The public site key is intentionally browser-visible. The secret is server-only. Both or neither must be configured. The browser obtains a token; the server sends only the secret, token, and validated Cloudflare client IP when available to Siteverify through the dedicated adapter.

The adapter enforces a 5-second deadline, checks HTTP status, validates that the JSON response has a boolean `success`, and never exposes provider error details. Invalid/expired/replayed challenges fail closed. Provider timeout, malformed response, and outage also fail closed but return a generic availability message rather than mislabeling the visitor as invalid.

Cloudflare documents that Turnstile tokens expire after five minutes and are single-use, so client reset behavior after a failed submission remains required ([Cloudflare Siteverify documentation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)). Expected hostname/action binding is not currently implemented because no approved per-environment values exist; production widget hostname restrictions and separate development/staging widgets remain operational setup items. Do not weaken verification to simplify tests.

## Google Maps and address boundary

The browser calls only same-origin address routes. Provider calls and secrets remain server-side. Autocomplete sends the bounded typed address and a public Sacramento-region bias. Validation sends the address. Route calculation sends the private configured origin and normalized destination. Exact addresses are not stored, logged, placed in a URL, returned wholesale, or added to planning state; the final client response is limited to city, ZIP, derived travel tier/context, and availability state.

All current Google calls have 5-second deadlines and no automatic retries. Provider errors fail closed. A failed route-duration enrichment after successful validation degrades to personalized travel review. Important response shapes are mapped through bounded parsers; malformed Address Validation envelopes now produce provider-unavailable behavior. Google recommends the `x-goog-api-key` header for REST calls and warns that a query parameter exposes a key in URLs, so Address Validation now uses the header ([Google Cloud API-key guidance](https://docs.cloud.google.com/docs/authentication/api-keys-use)).

Autocomplete is debounced by 350 milliseconds and cancels the prior browser request. Public API routes also apply in-memory rate limits. No additional concurrency layer is justified at current traffic. A future high-volume design should consider per-user session tokens, provider quota handling, and explicit `Retry-After` behavior without creating retry storms.

## Private calendar and availability boundary

The calendar integration is server-only, read-only, optional, and no-store. It validates the configured URL as public HTTPS, limits requests to 31 days, uses a 7-second network deadline, rejects declared or actual feeds over 512 KB, caps events at 2,000, bounds processing time, and now requires a recognizable VCALENDAR envelope. It returns only coarse dates/status, source category, timestamp, and the approved capacity disclaimer. Raw event names, locations, descriptions, attendees, provider origin, and feed URL never reach the client.

Missing configuration, unsafe URL, HTTP failure, timeout, oversized/malformed data, or processing failure all degrade to the conservative `Request for Review` state. Calendar space never proves operational capacity. There is no cache or durable provider copy, no automatic retry, and no calendar write.

## Precise Petcare, SMS, payments, and webhooks

Precise Petcare is browser-link-only. The site does not create accounts, records, requests, bookings, invoices, or payments through an API. Tests assert links but do not navigate into or mutate the provider. Do not duplicate authoritative Client records or infer API behavior from portal links.

Dialpad/SMS is `PLANNED / UNRESOLVED`. Before any send path is authorized it needs: an approved consent source and system of record; opt-out suppression; STOP/HELP behavior; purpose separation; rate limits; provider-specific write gate; server-only credentials; test/sandbox isolation; idempotency; timeout/unknown-outcome policy; reconciliation; safe audit metadata; and no real-number automated tests. The canonical SMS reference remains controlling. F6 adds no SMS code.

Payments are `NOT USED`. A future design must use provider-hosted/tokenized entry; never store full card number or CVV; separate intent creation from authorization/capture; require provider-safe idempotency for every duplicate-risk operation; use test mode outside production; avoid blind charge retry after an unknown outcome; verify webhook authenticity; reconcile provider/local state; and prevent duplicate fulfillment. F6 adds no payment code.

No webhook endpoint exists. A future webhook requires signature verification over the raw request as specified by that provider, bounded parsing, event allowlisting, replay protection where applicable, idempotent deduplication, authorization independent of client-supplied metadata, retry-safe handlers, safe logs, and reconciliation. Do not create generic webhook infrastructure before a real provider contract exists.

## Timeout, retry, and backoff policy

| Class | Current policy |
| --- | --- |
| Resend writes | 8 seconds. No automatic retry. Manual/user retry only with the same in-process idempotency key and payload after unknown outcome. |
| Turnstile verification | 5 seconds. No current retry because tokens are single-use and the original request must fail closed. |
| Google read calls | 5 seconds each. No automatic retry; user may initiate a later request. |
| Private calendar read | 7 seconds. No automatic retry; return conservative fallback. |

Never retry validation, authorization/configuration, or unsafe non-idempotent writes. Bounded exponential backoff with jitter is `NOT NEEDED` today. Add it only for a demonstrated transient operation whose duplicate and timeout semantics are safe, and honor provider rate-limit guidance. Circuit-breaker infrastructure is `NOT NEEDED`; queues, dead-letter queues, and background workers do not exist and are `NOT NEEDED` at current scale.

## Error normalization, observability, and redaction

Current provider adapters use stable categories: `TIMEOUT`, `AUTH_OR_CONFIG`, `RATE_LIMIT`, `PROVIDER_UNAVAILABLE`, `VALIDATION_REJECTED`, and `UNKNOWN`. Write outcomes separately distinguish `NOT_ATTEMPTED`, `CONFIRMED_FAILURE`, and `UNKNOWN_OUTCOME`.

Client responses remain generic and actionable. Logs may include provider, operation, category, outcome, HTTP status, duration if later added, correlation/request ID, and timestamp. They must never include authorization headers, keys, tokens, raw provider bodies, complete email/message bodies, exact addresses, private origins/URLs, phone numbers, Client data, payment details, or stack traces returned to the browser.

The current contact flow captures a bounded provider request ID on success but does not persist it. A durable audit trail is `NOT NEEDED` for the current contact-only, no-database architecture. It becomes `REQUIRED` before payments, booking mutation, SMS sends/consent changes, or other high-risk writes and should record only safe metadata.

## Fail-open, fail-closed, and outage UX

| Boundary | Classification | User-visible result |
| --- | --- | --- |
| Resend business notification | `FAIL CLOSED` | No success unless provider accepts; generic unable-to-send response and static safe email fallback |
| Resend confirmation | `DEGRADE GRACEFULLY` after business acceptance | Inquiry remains accepted; confirmation failure is not presented as inquiry failure |
| Turnstile | `FAIL CLOSED` | Invalid challenge asks retry; outage/configuration uses generic direct-email fallback |
| Address suggestions/validation | `FAIL CLOSED` | Address provider unavailable; manual travel review remains available |
| Route duration after valid address | `DEGRADE GRACEFULLY` | `Personalized travel review required` |
| Private calendar | `DEGRADE CONSERVATIVELY` | `Request for Review`; never false availability |
| Public analytics | `FAIL OPEN` | Core website behavior continues; event is discarded |
| Precise Petcare/social navigation | Provider/browser controlled | Website makes no provider-side success claim |

An app request being accepted, a provider accepting a request, mailbox delivery, and a final booking/payment outcome are distinct states. Current contact success means Resend accepted the business notification. It does not prove mailbox delivery, a reply, registration, availability, booking acceptance, or care confirmation.

## Rate limits, concurrency, and duplicate prevention

Public contact, availability, estimate, and address routes use bounded in-memory per-instance limits keyed only by a syntactically valid Cloudflare client IP or `unknown`. Address suggestions are debounced and prior browser requests are aborted. Expired buckets/attempts are opportunistically pruned. This protects a single runtime instance but is not a distributed quota or durable deduplication system.

Provider `429` is normalized as `RATE_LIMIT`; the current application does not automatically retry it. Inbound `Retry-After` is returned on app rate-limit responses. Provider-specific `Retry-After` propagation is deferred until an actual UX and trust model require it.

Duplicate sources include repeat clicks, browser refresh/back, user resubmit, network ambiguity, provider retry, webhook redelivery, process restart, and concurrent instances. Current email prevention combines UI sending state, inbound rate limits, a two-minute server fingerprint window, per-attempt keys, and Resend idempotency. Future payment, booking, SMS, record-creation, background-job, and webhook operations require durable provider-aware keys and reconciliation; in-memory suppression is insufficient.

## Reconciliation and rollback

Email rollback after provider acceptance is `NOT AVAILABLE`. Current recovery is safe error handling, idempotent in-process retry, mailbox/provider review when needed, and honest success semantics. Delivery-status reconciliation is `OPTIONAL / DEFERRED`; no delivery webhook exists.

Read-only Maps, Turnstile, and calendar operations need no rollback. Precise Petcare, SMS, payment, booking, and webhook reconciliation are `REQUIRED BEFORE WRITE ENABLEMENT`: never silently assume local and provider state agree after timeout, retry, webhook redelivery, or partial failure.

Any future background external write must have an idempotency key, bounded retry policy, shutdown-safe ownership, failure visibility, reconciliation, and a documented terminal state. Dead-letter or failed-work queues remain `NOT NEEDED` until background work actually exists.

## Provider versioning and health

Current explicit endpoint versions are Google Places `v1`, Address Validation `v1`, Routes `v2`, and Cloudflare Turnstile `v0`; Resend uses the current `/emails` endpoint without a URL version. Provider version/deprecation changes require a dedicated integration-maintenance task: review official migration guidance, update the adapter, use synthetic contract fixtures, validate fallbacks, and remove the old path only after replacement is proven.

`doctor` checks local runtime, dependency, browser, scanner, port, and provider configuration shape only. `env:summary` reports provider state without values. Neither contacts a provider. Live-provider diagnostics, if ever needed, must be a separate explicit command with no write by default. Standard startup/build never depends on provider availability.

## Automated safety check

`npm run check:integrations` is `IMPLEMENTED`, local, read-only, and part of `npm run validate`. It validates the structured registry, explicit environment policies, write-gate default, secret/public classification, template coverage, E2E write blocking, Resend guard presence, absence of known live write hosts in tests, and absence of a Maps key in the Address Validation URL. It performs no network call and prints no value.

Synthetic success contract fixtures are `IMPLEMENTED` for the current Resend request shape, Turnstile boolean response, Google response parsers, and calendar envelope/parser. Live provider contract tests remain `DEFERRED` because routine validation must be isolated from external accounts and production availability.

## Risk register

| Severity | Finding | Disposition |
| --- | --- | --- |
| `CRITICAL` | No test/build SMS, payment, booking, Client mutation, provider-account mutation, public provider secret, committed credential, or unauthenticated webhook was found | Preserve automated checks and stop conditions |
| `HIGH` | Pre-F6, a Resend key alone allowed ordinary local contact submission to perform live writes | Corrected with provider-specific `RESEND_SEND_ENABLED`, default false, adapter guard, doctor visibility, injected tests, and E2E blocking |
| `HIGH` | No blind automatic retry of a non-idempotent write or false booking/payment confirmation was found | Preserve |
| `MEDIUM` | Contact duplicate/idempotency state is per-process and lost on restart or across instances | Accept for current low-volume contact flow; require durable design before higher-risk/background/multi-instance writes |
| `MEDIUM` | Resend acceptance does not prove mailbox delivery; no delivery webhook/reconciliation exists | Client says accepted for delivery; delivery webhook remains deferred |
| `MEDIUM` | Turnstile hostname/action validation and environment-separated widgets are not represented in repository configuration | Owner/provider setup decision; do not invent values |
| `MEDIUM` | Provider sandbox/test accounts and staging credentials are not established | Use mocks now; require isolated provider setup before live staging writes |
| `LOW` | Maps and calendar read calls remain route-local rather than separate adapter files | Current same-origin API routes are narrow provider boundaries; refactor only if provider logic grows |
| `LOW` | App rate limits and duplicate maps are in-memory/per-instance | Appropriate for current architecture; revisit with durable/multi-instance state |
| `INFO` | Circuit breakers, queues, dead-letter handling, and background jobs are absent | `NOT NEEDED` today |
| `INFO` | Precise Petcare remains link-only; SMS, payments, and webhooks remain inactive | Preserve until explicitly authorized and designed |

## Unresolved integration decisions

- Confirm production and any non-production Resend credentials/domains/recipients, then explicitly set the write gate only in the intended environment.
- Decide mailbox/Resend retention, access, deletion, correction, bounce, and delivery-status reconciliation policy.
- Confirm Turnstile production hostname restrictions, optional action binding, and whether separate development/staging widgets will exist.
- Confirm Google project/API restrictions, billing/quota alerts, environment separation, retention, and whether Autocomplete session tokens are warranted.
- Confirm private-calendar provider ownership, access, retention, and production monitoring.
- Keep Dialpad/SMS provider, number, consent system, STOP/HELP, sandbox, retention, and webhook details unresolved until an authorized integration phase.
- Keep payment provider, sandbox, intent/capture/fulfillment, webhook, refund, reconciliation, and audit design unresolved until an authorized payment phase.
- Add durable cross-instance idempotency/reconciliation only when real architecture and risk justify persistence.
- Verify hosting/platform request and diagnostic retention separately; do not modify Sites, Cloudflare, DNS, `.openai`, or production environment as part of application integration work.

## Reference sources used for F6

- `docs/business-reference/README.md`
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md` (`CURRENT / APPROVED`)
- `docs/business-reference/guidance/sms-communications-consent-compliance.md` (`CURRENT / APPROVED`)
- `docs/data-privacy.md`, `docs/dependency-supply-chain.md`, `docs/testing-quality.md`, and `docs/test-baseline.md`
- Current route, provider, test, build, local-environment, and E2E implementation
- Official provider references linked above for Resend idempotency, Turnstile token validation, and Google REST API-key placement
