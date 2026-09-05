# Performance and Resource-Safety Foundation

Status: CURRENT / ENGINEERING BASELINE

This document records technical limits and performance policy. It does not create pricing, availability, service-area, booking, safety, or other business rules. Business behavior remains controlled by `docs/business-reference/`.

## Policy

Optimize for predictable, bounded, responsive behavior. Priority order is correctness, safety, bounded resource use, user-perceived responsiveness, maintainability, then micro-optimization. Do not add caching, parallelism, workers, distributed state, or infrastructure without a measured or obvious need.

The primary parser, collection, timeout-adapter, and process-state budgets are in `app/config/resource-limits.ts`; route rate windows remain beside their route behavior. `npm run check:resources` validates the central limits' basic shape, reviewed ceilings, the provider-free health boundary, and static-asset hard limit. Behavioral tests remain the stronger proof for rejection, parsing, and pruning behavior.

## Performance inventory

| Surface | Classification | Current bound or finding |
| --- | --- | --- |
| Static/server-rendered public pages | CHEAP | Local configuration and JSX only; no provider calls during render or build. |
| Health endpoint | CHEAP | Constant-size local JSON and request ID; no provider access; `no-store`. |
| Estimator and care planner | CHEAP | At most 8 pets, four visit windows, and a 366-day estimate window; ordinary synchronous arithmetic only. |
| Browser/session state | CHEAP | Three fixed session keys: planning state, care-planner progress, and referral source; values are sanitized and replaced, never appended. |
| Contact submission | EXPENSIVE / EXTERNALLY BOUNDED | One Turnstile verification, one required business email, then one optional confirmation email; sequential worst-case timeout budget 21 seconds. |
| Address suggestions | MODERATE / EXTERNALLY BOUNDED | 350 ms debounce, four-character minimum, cancellation, one Google call, 5-second timeout, 64,000-byte response, 20 candidates inspected, five returned. |
| Address check | EXPENSIVE / EXTERNALLY BOUNDED | One validation call followed by at most one route call; each has a 5-second timeout; practical worst case 10 seconds. |
| Availability check | MODERATE / EXTERNALLY BOUNDED | At most one private-calendar fetch, 7-second timeout, 31-day public window, 512,000 bytes, 2,000 events, 100 ms parser deadline. |
| In-memory rate limits | MODERATE | Per-process, 2,048 entries maximum; expired entries pruned on access; fixed-size keys; fail closed at capacity. |
| Contact duplicate/idempotency state | MODERATE | Per-process, SHA-256 fingerprints only, 512 entries maximum, two-minute expiry, pruned on submissions; fail closed for a new fingerprint at capacity. |
| Structured diagnostics | CHEAP | Fixed schema, bounded tokens, one record per meaningful provider/security outcome; DEBUG suppressed outside development. |
| Build and Node tests | MODERATE | Local compilation/test work only; no live provider side effects. |
| E2E | EXPENSIVE (developer workflow) | Serial locally, two workers in CI, one owned server on port 3100, bounded startup, ten browser cases at the F8 baseline. |

No exposed recursion, file upload, database query, background job, bulk collection, or recurrence-expansion path exists. Those surfaces are currently N/A rather than implicitly unlimited.

## Input and response limits

Public JSON routes require `application/json`, allow only known top-level keys, stream through a byte counter, and reject oversized payloads with `413` before complete buffering. Limits are 8,192 bytes for contact, 8,000 for estimate, 1,024 for each address route, and 256 for availability. Raw rejected bodies are not logged.

Contact fields are bounded before Turnstile, hashing, email generation, or rendering: name 80 characters, email 254, token 2,048, honeypot 200, message 3,000, phone 7–15 normalized digits, and ZIP five digits. Address text is limited to 180 characters. Estimate collections allow 1–8 pets, allowlisted services, only configured visit-window indexes, and at most 366 days. Availability permits 31 days.

Provider bodies are streamed and capped before decoding or JSON parsing: calendar 512,000 bytes, address validation 64,000, autocomplete 64,000, route duration 16,000, and Turnstile 16,384. The fetch deadline remains active through bounded body consumption, so a slow-drip body cannot outlive the provider timeout. Declared oversized bodies are canceled early; missing or dishonest `Content-Length` does not bypass the streaming cap. Malformed or oversized provider data takes the existing conservative fallback/error path. Resend response bodies are discarded without parsing; only its response status and a sanitized 128-character request ID are retained.

Address responses are reduced to ZIP, bounded city/state/destination text, one duration, and at most five bounded suggestions. Calendar output contains only requested dates and coarse review status; private event fields are never returned. Route/API responses are small fixed schemas and dynamic/private responses use `no-store`.

## Provider-call and timeout matrix

| User workflow | Maximum calls | Order | Timeout budget |
| --- | ---: | --- | ---: |
| Contact submit | 3 | Turnstile, business email, confirmation email | 5s + 8s + 8s = 21s |
| Contact submit without configured Turnstile | 2 | Business email, confirmation email | 16s |
| Address autocomplete request | 1 | Places autocomplete | 5s |
| Address check | 2 | Address validation, then route duration | 10s |
| Availability check | 1 | Private calendar | 7s |
| Estimate, health, page render, build | 0 | Local only | N/A |

No provider call appears inside a data loop. Contact operations remain sequential because confirmation is meaningful only after business-notification acceptance and partial-success semantics must remain clear. Address routing depends on normalized validation output. Parallelization would be incorrect for both. There are no automatic provider retries; a user retry after an unknown email outcome reuses the same process-local attempt and provider idempotency key while it remains present.

## Concurrency and process-local state

The deployment runtime may serve concurrent requests, but it has no local queue or semaphore. Current per-IP request limits constrain ordinary bursts and provider call counts are fixed. This is suitable for the present solo-business site, but it is not a provider quota guarantee under a large distributed attack.

Rate-limit state is keyed by a bounded route prefix plus a syntactically valid Cloudflare client IP, expires by window, is pruned on access, and cannot exceed 2,048 entries. A new key fails closed when full. Contact duplicate state stores only a 64-character digest, expiry, acceptance bit, random request ID, and optional consent timestamp; it expires after two minutes and cannot exceed 512 entries. A new fingerprint receives a temporary `503` rather than causing further growth or provider calls when full.

Both controls are per process. They disappear on restart and are not shared across instances. Resend owns durable interpretation of the supplied idempotency key; the site does not claim durable local idempotency. Distributed storage is deferred until multiple instances cause demonstrated correctness problems, traffic makes local controls ineffective, provider quotas become material, or real payment/SMS/booking writes require stronger guarantees.

## CPU, memory, regex, and recursion

Request and provider allocation is bounded by streaming byte caps before parsing. Calendar work additionally limits events and wall-clock processing. Estimator date expansion is capped to 366 days and at most four visit windows. Address candidate processing inspects at most 20 elements. The process maps have explicit cardinality ceilings.

Untrusted regexes are anchored, simple, and operate on already bounded values. No catastrophic-backtracking expression was found. No exposed recursive parser or traversal exists. Normal small-array sorts and SHA-256 hashing of a contact payload capped below 8 KiB are not meaningful CPU risks.

## Browser work and state

Autocomplete waits 350 ms, requires four characters, cancels superseded requests, and cannot let an older response win. Address checks and contact submits abort on replacement or unmount. Availability and estimate requests already use abort controllers; estimate recalculation has a 100 ms debounce. Dynamically installed keyboard, click, media-query, travel-tier, Turnstile load, and widget handlers are cleaned up. There are no intervals, polling loops, automatic retries, append-only client lists, or retained provider payloads. Copy feedback uses one bounded short timeout.

Pending states disable contact and address-check submissions while in flight. Server rate limits and duplicate controls remain authoritative. Failure UX requires an explicit user retry and does not encourage rapid automated attempts.

## Cache inventory and policy

| Cache/state | Classification | Policy |
| --- | --- | --- |
| npm and Playwright caches | SAFE / REGENERABLE | Reuse; clear only for diagnosed corruption or version mismatch. |
| `.next`, `.vinext`, `dist`, Wrangler and test output | SAFE / REGENERABLE | Ignored generated output; not authoritative. |
| Local environment fingerprint | SAFE / REGENERABLE | Non-secret dependency/tool state only. |
| Browser HTTP/static asset cache | SAFE / REGENERABLE | Preserve normal framework/static caching. |
| Session storage | PRIVATE-RISK MINIMIZED | Three bounded non-sensitive records, session lifetime, replace-in-place. |
| Rate-limit and duplicate maps | TRANSIENT / PROCESS-LOCAL | Expiring, cardinality-capped, no raw submissions. |
| Provider-response/application cache | NOT PRESENT | Do not add without key, TTL, maximum size, invalidation, privacy, authority, and failure definitions. |

Private/dynamic endpoints—contact, availability, address, estimate, and health—return `no-store` either directly or at the route boundary. No private Client data may be cached for speed and no stale business-rule result may outrank approved authority.

## Assets, bundles, fonts, and frontend network

The largest public asset is `public/og.png` at about 1.75 MiB; it is intentional social metadata but remains a review candidate for a separate asset-quality task. No asset reaches the 10 MiB hard limit. The next-largest images are about 237–334 KiB. Several unreferenced photographs and the membership certificate remain untouched because deletion/claim authority is outside F8. Below-fold gallery images use lazy loading; the hero image is eager/high priority. Existing `<img>` use produces four known lint warnings. Image-pipeline migration is OPTIONAL, not an F8 safety requirement.

The estimator and address checker are dynamically loaded client-only. Leaflet CSS is globally imported, but no current component imports Leaflet JavaScript; removal is OPTIONAL and should follow a dedicated visual regression review. Social icons use named imports. Geist fonts use the framework font pipeline; Satisfy is local with `font-display: swap`. Turnstile loads asynchronously only when configured and the contact component renders. No analytics or other third-party frontend script is active. Browser requests are limited to same-origin route calls, Turnstile when enabled, static assets/fonts, and ordinary navigation; providers are called server-side.

## Build, rendering, metrics, and regression policy

All current pages use fixed route lists and local data. Server rendering and static generation perform no live provider work. The sitemap has 11 fixed candidate routes and a documented current-time `lastModified`, which prevents byte-for-byte reproducibility but is not an unbounded work issue. Framework link prefetch does not trigger provider calls.

Hard bundle or timing budgets are DEFERRED: current evidence does not justify fragile thresholds. Investigate a repeatable material regression in route latency, user interaction, asset/bundle size, test time, build time, or memory; compare multiple like-for-like runs and distinguish noise from a trend. Web Vitals and Lighthouse are OPTIONAL pre-launch/manual measurements using a production-like local build with integrations disabled. Do not add production analytics, telemetry, performance SaaS, or a load-test framework in this phase.

The F8 local production build transformed 274 client-reference modules and emitted about 575 KiB of uncompressed files under the client `_next/static` directory. The largest JavaScript chunks were the framework at about 186 KiB and the shared index chunk at about 172 KiB; the estimator and address-checker split chunks were about 14 KiB and 4 KiB. The first measured F8 build completed in roughly 18 seconds end to end on the local Windows workstation (individual Vinext stages totaled about 5.4 seconds). These observations are baselines, not hard budgets.

Formal load testing is DEFERRED until pre-launch traffic assumptions or hosting architecture justify it. Never load-test production or live providers. Microbenchmarks are NOT NEEDED for current small helpers; benchmark only a measured computational hot path or bounded parser concern.

## Future resource policy and scaling triggers

Use pagination/windowing for future large collections. Bulk work must define maximum batch size, concurrency, partial failure, progress, retry, and cleanup. Uploads must define byte/parser/archive/storage quotas and cleanup before implementation. A future database must bound and paginate reads, avoid N+1, add indexes from measured query needs, and inspect plans when warranted. Background jobs must define concurrency, runtime, batch, retry, idempotency, shutdown, and memory limits.

Consider architecture changes only when one or more of these occurs:

- multiple production instances cause correctness failures in rate limiting or duplicate handling;
- payment, SMS, booking, webhook, or other durable high-risk writes are introduced;
- measured traffic or abuse makes per-instance controls ineffective;
- provider quotas or per-request monetary cost become material;
- persistent jobs or large data collections appear;
- measured latency, bundle size, CPU, memory, or build/test time becomes problematic.

Redis, databases, queues, workers, service workers, CDN policy, distributed rate limiting, durable local idempotency, and performance SaaS are not present and are not justified by the current architecture.

## Baseline and unresolved decisions

F7 baseline: 114 Node tests, 10 E2E tests, typecheck pass, build pass, lint with 0 errors/4 known image warnings, doctor ready in its prepared environment, current/history secret scans clean, repository/supply-chain/integration checks pass, production dependency audit clean, and full dependency audit at the unchanged 10 high/1 low maintenance finding set.

F8 adds streaming request/provider caps and deadlines, process-state cardinality limits, stale request cancellation, six resource-safety tests, this contract, and the read-only resource check. Record final local build, E2E, and validation timings in the F8 completion report; timings are machine-specific and not pass/fail budgets.

Unresolved decisions are deliberately limited to: whether to optimize the 1.75 MiB social image; whether to remove unreferenced/ambiguous assets after authority review; whether a future host needs distributed controls; whether pre-launch Lighthouse/Web Vitals measurements justify a numeric budget; and whether Leaflet CSS can be removed without planned map work or visual regressions.

## Risk register

| Severity | Finding and disposition |
| --- | --- |
| CRITICAL | None found after hardening: no public path retains arbitrarily large request/provider parsing or an uncontrolled provider loop. |
| HIGH | Pre-F8 body parsing could fully buffer a chunked request, provider bodies could be parsed without a streaming byte cap, and process maps had no cardinality ceiling. Corrected with streaming caps, total response deadlines, fixed map capacities, pruning, and fail-closed behavior. |
| MEDIUM | Rate limits and duplicate/idempotency state remain per-instance and transient; acceptable now, with explicit distributed-state triggers above. Provider quotas are not repository-controlled global limits. |
| LOW | `public/og.png` is 1.75 MiB; several public images/certificate files appear unreferenced; Leaflet CSS is globally loaded without current Leaflet JavaScript. Preserve pending separate visual/authority review. |
| INFO | Numeric bundle/timing budgets, production metrics, Lighthouse automation, formal load tests, caching infrastructure, database, uploads, jobs, queues, and distributed controls are not needed today. |

## References used for F8

- `docs/business-reference/README.md`
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md` (`CURRENT / APPROVED`)
- `docs/business-reference/logic/37-service-window-capacity-planner.md` (`CURRENT / APPROVED`)
- `docs/data-privacy.md`
- `docs/dependency-supply-chain.md`
- `docs/testing-quality.md`
- `docs/integrations-side-effects.md`
- `docs/observability-recovery.md`
- `docs/local-development.md`, `docs/test-baseline.md`, `README.md`, `CONTRIBUTING.md`, and current code/tests/build output

F8 changes no pricing, estimate/planner decision rule, service area, availability promise, SMS/legal policy, booking/payment behavior, credential claim, or approved service scope.
