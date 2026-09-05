# Testing and Quality Architecture

This document is the durable testing contract for Cuddle Crew Pet Care. It describes what the current suites prove, how changes should be validated, and how failures are handled. Tests are implementation evidence; they do not outrank the most specific applicable `CURRENT / APPROVED` business reference.

## Quality principles

- Test count is a regression signal, not a quality score. An unexpected decrease requires investigation. An intentional consolidation must document why behavior coverage is preserved or improved.
- Passing tests do not replace a passing build. A passing build does not replace tests. Typechecking does not prove runtime behavior, and E2E does not prove that every business rule is complete.
- Prefer many fast deterministic logic and route tests, targeted security/privacy regressions, and a smaller browser suite for critical journeys.
- Assert observable behavior and public contracts. Avoid implementation-detail coupling, broad truthy checks, giant snapshots, and assertions weakened merely to make a failure disappear.
- Tests must use synthetic data, prevent live external writes, and keep failure artifacts private-safe.

## Current inventory

The F5 baseline contains 102 Node tests and 10 Playwright tests. The executable owning-suite counts are exact and non-overlapping:

| Owning suite | Count | Primary purpose |
| --- | ---: | --- |
| `tests/api-security.test.ts` | 21 | Request parsing, API contracts, security/privacy boundaries, provider failure, rate limits, and side-effect isolation |
| `tests/business-rules.test.ts` | 21 | Pricing, travel, short-notice, holiday-placeholder, estimator, and planner decision logic |
| `tests/care-planner.test.ts` | 24 | Care-plan suitability, duration, care-gap, and review-boundary behavior |
| `tests/feature-completion.test.ts` | 15 | Address parsing, bounded planning state, privacy-safe persistence, and feature gates |
| `tests/growth-features.test.ts` | 6 | Referral allowlisting, public analytics minimization, and manifest safety |
| `tests/production-reliability.test.ts` | 12 | Health contract plus source/build/config regression guards for critical public behavior |
| `tests/supply-chain.test.ts` | 3 | Lockfile, package-source, integrity, and lifecycle-review guard behavior |
| `e2e/public-flows.spec.ts` | 7 | Critical home, estimator, planner, contact, consent, responsive, and session-state browser journeys |
| `e2e/launch-review.spec.ts` | 3 | Route/status smoke, public progressive content, keyboard/reflow, and reduced-motion paths |

The requested semantic categories overlap by design:

| Category | Current evidence |
| --- | --- |
| Unit | Pure parsers, sanitizers, formatters, business decisions, care-gap calculations, and configuration gates |
| Integration/API | Contact, availability, estimate, address, and health route contracts using real route code and synthetic `Request` objects |
| Security | Strict JSON limits, untrusted-IP handling, SSRF-oriented calendar URL validation, rate limiting, input rejection, bounded fetches, and supply-chain guards |
| Privacy | Coarse calendar output, no-store responses, safe errors, URL/storage/analytics minimization, server-created consent metadata, and public response shaping |
| Business-rule | Pricing, pet modifiers, travel, short notice, overnight, review gates, care suitability, cancellation-copy, and authority-linkage regressions |
| E2E/smoke | 10 browser cases covering critical journeys, all public routes, redirects, progressive rendering, and failure-safe contact UX |
| Accessibility preparation | Keyboard skip link, focus recovery, landmarks/headings, reduced motion, 200% reflow equivalent, and SMS control readability; this is not a full accessibility audit |
| Build/config | Source-level public-content guards, metadata/manifest behavior, typecheck, lint, and production build |
| Supply chain | 3 unit guards plus `check:supply-chain` for the installed graph and lockfile |
| Repository safety | `check:git-safety`; this is a validation command, not counted as a Node test |

Some source-text tests in `production-reliability.test.ts` are intentionally brittle because they guard progressive enhancement, policy linkage, or centralized configuration that runtime assertions alone would not prove. Do not expand that style casually; prefer behavior/contract tests when practical.

## Portfolio and ownership

Use unit tests for pure decisions, parsers, formatting, normalization, validation, and boundary math. Use integration/API tests for route validation, request/response schemas, server-created metadata, environment gates, provider adapters, failure fallbacks, and public/private field boundaries. Security/privacy tests should emphasize rejection and minimization paths, not just successful input.

Use E2E only for critical user journeys and real browser/server integration: primary navigation, estimator/planner boundaries, contact and SMS consent UX, progressive public content, privacy-safe session state, status/redirect smoke, and meaningful viewport/keyboard behavior. Do not reproduce exhaustive pricing or parser matrices through the browser.

Build/config checks prove that source and configuration compile into deployable output. They do not prove runtime correctness. Supply-chain and repository-safety checks protect different boundaries and remain required alongside application tests.

## Business-rule authority

Before changing a business-rule test, read `docs/business-reference/README.md`, the source hierarchy, and the most specific applicable `CURRENT / APPROVED` reference. Tests reflect approved references; stale test expectations never make stale implementation behavior authoritative. If implementation or a test conflicts with an approved source, investigate and correct the authorized implementation. If two controlling approved sources materially conflict, stop for human review. Never edit an authoritative reference merely to make a test pass.

Holiday automation stays disabled while the holiday calendar is `PLACEHOLDER`. Client-facing failure/review output remains neutral, normally `Personalized review required`, without exposing private thresholds or review reasons.

## Critical regression matrix

| Behavior | Current layer/evidence | Meaningful gap or next trigger |
| --- | --- | --- |
| Contact validation and delivery | Node route tests plus intercepted E2E | Live provider contract is deliberately not exercised |
| SMS consent | Canonical wording, affirmative/non-consent, forged metadata rejection, server timestamp/source, scanner-readable HTML, responsive E2E | Operational provider/STOP/HELP behavior remains outside this codebase |
| Rate limiting and duplicates | Deterministic helper boundaries and contact duplicate route behavior | Multi-instance/distributed limits require a future persistence design |
| Availability privacy | POST body only, no-store, coarse output, bounded calendar parsing, safe provider fallback | Live calendar provider contract is deliberately not exercised |
| Estimator/planner | Extensive logic matrices, negative route inputs, neutral review output, critical browser flows | Re-audit whenever approved business references change |
| Pricing/travel/short notice/overnight | Unit and source-linkage regressions | Exact holiday dates remain unresolved because the calendar is not approved |
| Address integration | Parser/feature gates and fail-closed no-configuration route tests | Successful Google response contracts are deferred until adapter churn justifies fixtures |
| Client-safe errors | Contact, address, availability, health, and fallback-page checks | Maintain whenever new routes/providers are added |
| Server/client environment boundary | Feature gates, response minimization, build/supply-chain review | No automated compiled-bundle secret-name test; current secret scan/build review remains the gate |
| External side effects | Node fetch stubs, missing-config fail-closed checks, browser contact interception | Any new provider write requires an explicit adapter and regression tests before activation |
| Build and repository safety | Typecheck, lint, build, secret scan, supply-chain and Git safety commands | Hosted CI is not configured; local validation is the executable gate |

## Side effects, mocks, fixtures, and contracts

Automated tests must never send email or SMS, charge a payment, create a booking, write to a third-party account, mutate Client data, or publish content. Node route tests replace `globalThis.fetch` only within `try/finally` and restore it. Browser tests intercept `/api/contact`. Blank optional configuration must fail closed or use the documented conservative fallback. No payment, SMS, Precise Petcare, database, or publishing write integration exists.

Mock dangerous writes, unavailable providers, and nondeterministic external services. Do not mock away business logic, route validation, security boundaries, or meaningful request/response behavior. A test that proves only its mock configuration has no value.

Fixtures use fabricated people/pets, `example.com`/`.test`, documentation-only IP ranges, fake IDs, and reserved fictional 555 phone numbers. Never use real Clients, home addresses, access details, travel dates, medical/care records, payment metadata, provider exports, or production screenshots. Treat browser traces, screenshots, reports, and logs as potentially private even when inputs are synthetic.

Lightweight internal route contract testing is **IMPLEMENTED**. Live provider contract testing is **DEFERRED** because routine validation must not depend on or write to external services.

## Determinism, time, retries, and flakiness

Logic tests inject explicit clocks where time affects a decision. F5 removed the browser suite's wall-clock-derived date and its arbitrary sleep; browser waits now use observable assertions. Provider calls are stubbed/intercepted. Tests must not depend on locale, filesystem enumeration order, production network, user-specific paths, or shared external state.

The Node runner uses its default per-test behavior with no retries. Playwright has a 30-second test timeout and no configured retries. The E2E server has a separate 60-second bounded readiness deadline with a condition-based local health poll. Do not increase global timeouts or add retries to conceal hangs. Targeted timeouts are acceptable only for a demonstrated slow boundary.

When a test appears flaky:

1. Reproduce it and record the exact command/environment.
2. Classify timing, clock, race, state leakage, environment, network, or product behavior.
3. Remove nondeterminism and isolate shared resources.
4. Preserve the assertion strength and validate the fix repeatedly at the narrowest layer.
5. Document any unavoidable external dependency and keep it outside routine validation.

A single lucky rerun is not resolution. Permanent skips, weakened assertions, and unlimited retries are prohibited. Quarantine is **NOT NEEDED** today. If introduced later, it must be temporary, issue-linked, owner-visible, have removal criteria/deadline, and exclude the suite from a fully healthy claim.

## Isolation, parallelism, filesystem, network, and environment

Rate-limit state is reset by tests that use it. Environment and `globalThis.fetch` mutations are restored in `finally`. Browser storage is scoped to a context and explicitly tested for clear/reset behavior. No application test writes source files. Scanner and browser artifacts use ignored bounded paths; temporary scanner output is removed after use.

Node test files may run independently; do not introduce cross-file mutable state. Playwright uses one local worker for reliability and two in CI. Do not disable all parallelism without a demonstrated collision. Any future shared port, file, database, or singleton must receive explicit isolation/serialization.

Routine Node tests use no external network: provider paths are stubbed or disabled. E2E uses only the repository-owned local server and intercepted contact delivery. Builds use installed dependencies and repository assets. Git push, dependency audits, and intentional live-provider checks are separate network operations and must never be described as offline.

Tests require Node 22.17.1, npm 10.9.2, the pinned lockfile graph, and Playwright Chromium for E2E. Optional provider variables are blank for routine validation. Never copy `.env.local` into committed test configuration or require production credentials.

## E2E lifecycle and artifacts

`npm run e2e` builds, verifies that port 3100 is free, starts the exact Vinext server process, waits conditionally for `http://127.0.0.1:3100`, runs Playwright, and terminates only its owned process tree. `validate:full` reuses the standard validation build and invokes `e2e:run`. An occupied port fails explicitly and is never killed or reused. Cleanup must release port 3100 after success or failure.

Playwright keeps screenshots only on failure, traces on failure, video off, a line reporter, and an ignored HTML report under `.cache/local-dev/playwright/`. Failure diagnostics should name the test/layer and observable contract, preserve a safe artifact location, and distinguish environment/startup failures from assertion failures. They must not dump secrets, complete contact bodies, Client data, private URLs, provider bodies, stack traces to clients, or private decision reasons.

There are no snapshots. Do not add large snapshots automatically. Visual regression is **OPTIONAL / DEFERRED** until stable approved UI assets and a concrete review workflow justify it. Current responsive preparation covers 320, 390, 640-at-200%-zoom-equivalent, 768, and 1280 CSS-pixel paths in targeted flows; comprehensive responsive and accessibility work belongs to their later phases.

## Coverage strategy

Formal coverage tooling is **DEFERRED**. A percentage threshold would add maintenance cost without identifying the most important gaps. Prefer review of branch coverage in high-risk business decisions, negative validators, security/privacy boundaries, and provider failure paths. Add tooling only when a concrete recurring gap or release gate needs measurement; do not set an arbitrary 100% target.

Property/fuzz testing is **OPTIONAL / NOT NEEDED** for the current bounded parsers and validators. Mutation testing is **NOT NEEDED** at current project size/cost. Re-evaluate either only when a critical parser or decision matrix demonstrates defects ordinary boundary tests do not catch.

## Performance and validation order

The Node suite is **FAST** (about 2 seconds on the F5 Windows workstation). Typecheck, lint, and build are **MODERATE**. The build plus local-browser lifecycle is **EXPENSIVE** relative to the Node suite and belongs in full validation. Investigate material timing regressions rather than optimizing prematurely.

Use this targeted mapping while implementing:

| Change | Targeted validation |
| --- | --- |
| Business decision/config | Most specific business-rule/care-planner test file plus typecheck |
| API route or validator | Relevant route tests, security/privacy negative paths, and typecheck |
| UI component | Relevant Node/source contract; browser test when the journey is critical |
| Contact/SMS/privacy | API security tests plus targeted contact E2E and current secret scan |
| E2E runner/config | Build, targeted E2E, port cleanup check, then full E2E |
| Dependency/toolchain | Supply-chain tests/check, manifest/lock review, then full validation |
| Repository/security script | Its targeted tests/check plus Git safety and secret scan |
| Documentation only | Relevant structural checks and diff review; full validation when it changes the quality contract |

For meaningful completion, standard validation is `npm run validate`: Git safety, supply-chain check, current secret scan, Node tests, typecheck, lint, and build. Full validation is `npm run validate:full`: standard validation followed by E2E. Run `doctor` and `env:summary` for the recorded environment; run the history secret scan when explicitly required by a foundation/release/incident task.

The efficient failure order is structural/repository/security checks, targeted tests, full Node tests, typecheck, lint, build, then E2E. The existing commands already implement a sensible composition, so F5 adds no redundant `check:quality` or `test:summary` command. The test runner and this baseline document already provide the necessary count signal.

## Failure, warning, and baseline governance

On failure, identify whether it is new, environmental, or an unchanged recorded baseline. Do not hide it, delete the test, weaken assertions, or claim completion. If the test count decreases, inspect the exact diff and explain every removal/consolidation before proceeding. Report executed commands and actual counts explicitly; never say fully green when the required full validation was not run.

The lint baseline is 0 errors and 4 visible `@next/next/no-img-element` warnings in `app/page.tsx`. They are known, not suppressed, and not a license for new warnings. Fix them only in a scoped UI/performance change with behavior and asset review.

The baseline and point-in-time results live in `docs/test-baseline.md`. Update it intentionally after a reviewed suite change. Never accept “all remaining tests passed” without accounting for removed tests.

## Current risk and unresolved decisions

| Severity | Finding | Disposition |
| --- | --- | --- |
| Critical | No live destructive test write, production/Client fixture, committed test secret, or production-leaking test bypass found | Preserve the side-effect and fixture contract |
| High | No unexplained test loss, order-dependent critical state, unsafe E2E process killing, or validation bypass found | Investigate immediately if introduced |
| Medium | No hosted CI currently enforces the local gate | Keep local commands authoritative; add CI only in a dedicated task |
| Medium | Successful live Google/Resend/calendar schemas are not checked against providers | Deferred intentionally; add fixture-backed adapter contracts when provider churn justifies them |
| Low | Several source-text tests couple to implementation shape | Retain where they protect progressive/policy linkage; prefer behavioral tests for new coverage |
| Info | Accessibility and responsive coverage is preparatory, not comprehensive | Complete in the dedicated later phases |

Unresolved choices are explicit: whether/when to add hosted CI; whether adapter-level success fixtures merit maintenance; whether a future concrete gap justifies formal branch coverage; and when approved visual assets justify visual regression. None blocks the current local quality gate.
