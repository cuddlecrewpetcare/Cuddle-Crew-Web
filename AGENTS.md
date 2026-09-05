# Cuddle Crew Pet Care — Codex Repository Instructions

## Business Reference Authority

Before modifying any website copy, service descriptions, pricing logic, estimate logic, booking logic, eligibility logic, policy language, FAQ content, service-area behavior, holiday behavior, payment behavior, safety messaging, onboarding flow, or Precise Petcare handoff behavior, review the relevant files in:

docs/business-reference/

These files are the authoritative business-reference source for Cuddle Crew Pet Care once they are populated and marked CURRENT / APPROVED.

Existing website code, copy, comments, tests, configuration, or previous Codex-generated implementation is not authoritative when it conflicts with a current approved business-reference document.

## Mandatory Business-Rule Preflight

This preflight is required before modifying code, configuration, tests, metadata, structured data, forms, or public copy involving:

- pricing, rates, durations, pet-count logic, additional-pet pricing, travel, service area, holidays, short notice, or same-day behavior;
- payment, reservation payments, cancellation, refunds, booking acceptance, estimates, quotes, scheduling, capacity, or availability;
- care-frequency recommendations, welfare, medication, behavior, safety, shared care, Overnight Care, Adventure Walks, transportation, custom quotes, or Service scope;
- credentials, certifications, insurance-dependent capabilities, or other Client-facing claims; and
- SMS/text messaging, communications consent, phone-number collection, notification preferences, opt-outs, HELP handling, mobile/SMS Privacy Policy language, or marketing communications.

Before changing any of those subjects:

1. Read `docs/business-reference/README.md`.
2. Read `docs/business-reference/guidance/source-of-truth-document-hierarchy.md`.
3. Locate and read the most specific applicable `CURRENT / APPROVED` reference.
4. Treat current website and application behavior as implementation only, not authority.
5. If implementation conflicts with authority, flag the conflict and correct the implementation when the task authorizes that correction.
6. Never preserve stale behavior solely because it already exists.
7. Never use `PLACEHOLDER`, `DRAFT`, or `SUPERSEDED` content as authority.
8. Never invent an unresolved business rule.
9. Never weaken safety, welfare, legal, insurance, training, or Service-scope rules to preserve automation.
10. When internal logic requires review, prefer the neutral Client-facing result `Personalized review required` rather than exposing private reasoning.

## Document Status

Business-reference files may use statuses including:

- PLACEHOLDER
- DRAFT
- CURRENT / APPROVED
- SUPERSEDED

Only CURRENT / APPROVED content may be treated as authoritative business policy. PLACEHOLDER and DRAFT content must not be implemented as though approved. SUPERSEDED content must not be used for current website behavior.

## Source Hierarchy

When sources differ, use this hierarchy:

1. Safety, animal welfare, applicable law, insurance, current training/competence, and approved Service scope.
2. Current signed Client-facing agreements and policies for the contractual subjects they address.
3. Current approved Client-specific Precise Petcare records, subject to the limits above.
4. `CURRENT / APPROVED` core references.
5. `CURRENT / APPROVED` logic references.
6. `CURRENT / APPROVED` operations references.
7. `CURRENT / APPROVED` guidance references.
8. Website/application implementation.
9. Software defaults and platform behavior.
10. Historical material, old messages, examples, drafts, placeholders, and superseded content.

The complete hierarchy and conflict process are defined in `docs/business-reference/guidance/source-of-truth-document-hierarchy.md`; do not duplicate or reinterpret it. If two applicable `CURRENT / APPROVED` sources materially conflict, STOP and report the conflict for human review rather than silently choosing or inventing a hybrid rule.

## Required Codex Behavior

For any task that may affect business behavior:

1. Identify and read the relevant business-reference documents before changing implementation or public copy.
2. Check their Status and use only CURRENT / APPROVED content as authoritative.
3. Compare approved references against the existing website; flag conflicts, missing rules, or ambiguity instead of inventing an answer.
4. Implement only what is supported by approved references and the user's current instruction, preserving unrelated functionality.
5. At completion, state which business-reference documents were used.

Do not rely solely on memory of previous Codex tasks when current repository references are available.

## Explicit User Changes

If the user's current instruction intentionally changes an approved business rule, follow it, identify the authoritative reference files that need updating, and do not leave the repository silently inconsistent. Do not assume a temporary implementation change permanently replaces an approved policy unless the user says so.

## Placeholder Rule

Any file marked `Status: PLACEHOLDER` is NOT authoritative. Codex must not derive business logic from a TODO, filename, placeholder description, examples, or industry-standard pet-sitting assumptions. Wait for authoritative content to be added.

## Internal Logic Privacy

Internal-reference documents may control website behavior without being shown publicly. Do not expose internal risk scores, acceptance thresholds, decline criteria, capacity calculations, private route assumptions or service-area reference points, sensitive insurance limitations, internal decision-making rubrics, or security procedures unless explicitly approved.

When an internal rule requires human review, prefer client-facing wording such as “Personalized review required” rather than revealing the threshold or reasoning.

## Pricing and Estimate Rules

Never hardcode a rate, fee, modifier, surcharge, cancellation threshold, payment deadline, holiday period, travel fee, or review threshold solely from existing website code if a CURRENT / APPROVED business-reference document governs it.

The website estimate builder provides an estimate only; does not guarantee acceptance; does not override a Precise Petcare quote, invoice, or confirmed booking; and must stop automatic calculation where approved review logic requires personalized review. A mathematically calculable price does not mean a booking must be accepted.

## Safety and Scope

No website feature or public copy may imply that payment guarantees acceptance; paying more makes an unsafe, uninsured, or out-of-scope service acceptable; Cuddle Crew provides services outside approved training, insurance, legal, or service scope; Overnight Care means 24-hour continuous presence; routine service windows are exact-time guarantees unless specifically approved; or automated tools override animal welfare or safety review.

## Data and Privacy

Never expose through public frontend code private home addresses, service-area origin/reference points, API keys, client information, access credentials, alarm codes, real-client key identifiers, travel dates, private medical information, veterinary payment information, or identifying incident records. Keep future private routing data server-side; never put secrets in client-side environment variables or committed public code.

## Implementation Architecture

Prefer centralized configuration or data sources over duplicating rules across unrelated components. Keep public display logic separate from private internal review logic where appropriate, and preserve the boundary between website estimates and final Precise Petcare booking/invoice data.

## Public Claims

Never make a public claim about credentials, certifications, insurance, memberships, service area, transportation availability, medical-care capabilities, safety procedures, or other regulated/professional matters unless a CURRENT / APPROVED business-reference source supports it.

## Time, Time Zone, Locale, and Determinism Contract

Future Codex work must:

1. Distinguish instants, date-only values, local wall-clock times, durations, calendar days, and Service nights.
2. Use the approved `America/Los_Angeles` IANA zone for business-local rules; never calculate with `PST`, `PDT`, or a fixed UTC offset.
3. Preserve business date-only values as validated `YYYY-MM-DD` strings and use calendar arithmetic that is independent of the host timezone.
4. Require an offset or `Z` for authoritative input instants. Resolve intended business-local wall-clock components explicitly and conservatively reject DST gaps or repeated times when no disambiguation exists.
5. Serialize true instants as ISO 8601 with `Z` or an offset. Keep locale formatting display-only and never parse formatted dates, times, or currency back into logic.
6. Use server-created time for authoritative business, security, contact, and consent decisions. Client clocks and client timestamps are untrusted and must not control acceptance, rejection, quota, consent provenance, or fees.
7. Preserve DST-aware local semantics. Do not divide milliseconds by 24 hours to count calendar days or Service nights, and do not redefine an Overnight as a fixed elapsed duration.
8. Treat same-business-day and less-than-24-hours as different concepts. Preserve approved `<`/`<=` boundaries exactly; flag unclear cancellation/day semantics instead of guessing.
9. Never invent holiday dates or enable automatic holiday fees while the holiday calendar is `PLACEHOLDER`. Future holiday evaluation must use the approved business-local Service-date rule.
10. Treat provider timestamps as untrusted. Accept explicit UTC, supported IANA-zone, or valid date-only semantics; conservatively reject ambiguous floating, malformed, unsupported-zone, DST-gap, or repeated-time values.
11. Use monotonic clocks for latency, deadlines, short process-local TTLs, and timeout measurement where practical. Never compare monotonic values with wall-clock instants.
12. Inject or pass controlled clocks in tests where current time affects a result. Never sleep to test expiry, never use offset-free timestamps as instants, and avoid fixed dates that age into failure.
13. Cover relevant midnight, DST, month/year, leap-day, exact-threshold, invalid-input, and before/exact/after-expiry boundaries.
14. Do not mutate caller-owned `Date` objects. Keep build timestamps only when they represent an authoritative content change; do not make builds vary merely because they ran later.
15. Keep timestamp-only values out of idempotency keys, preserve server-created consent/contact timestamp provenance, and report unresolved time-related business authority explicitly.

## Local Development Environment Reuse

Future Codex sessions operating on this local repository must:

1. Use the existing repository workspace and read this file first.
2. Run `npm run doctor` before environment setup or task work.
3. If the doctor passes, install nothing and reuse `node_modules`, the npm cache, Playwright browser binaries, and valid framework/test caches.
4. Treat a new chat, model, reasoning level, or continued implementation phase as continuity of the same local environment—not a reason to bootstrap again.
5. Run `npm run setup:local` only for first-time setup or when the doctor reports missing, stale, or incompatible dependencies or browser binaries.
6. Never delete `node_modules`, clear package-manager caches, clear Playwright browser caches, or broadly clear framework caches as a routine first troubleshooting step.
7. Reinstall only when dependencies are missing, the dependency-relevant manifest or lockfile changed, the local fingerprint is stale, integrity checks fail, the Playwright version/browser requirement changed, or the task intentionally changes dependencies.
8. Use the repository-selected npm version and `package-lock.json`; do not substitute a package manager, delete the lockfile, or regenerate it casually.
9. Prefer repository-defined scripts, targeted tests while editing, `npm run validate` for standard validation, and `npm run validate:full` before completing a meaningful phase that requires browser coverage.
10. Do not repeatedly run full builds or E2E checks when nothing relevant changed.
11. Run `npm run env:summary` when a concise, non-secret environment snapshot would help troubleshooting.
12. Check port/process state before starting duplicate servers. Never kill broad Node process groups or unrelated processes.
13. Preserve unrelated tracked and untracked files. Do not run `git clean`, hard reset, destructive checkout, or broad cache deletion without explicit justified need.
14. Never expose or commit local secrets. `.env.local` stays local and ignored.
15. Do not incidentally upgrade Node, npm, the framework, Playwright, build tooling, or application dependencies during unrelated feature work.
16. Keep all business-reference authority, privacy, safety, legal, and service-scope rules above fully controlling.

The default local startup sequence is: confirm the repository, read `AGENTS.md`, run `npm run doctor`, install nothing when it passes, implement the task, run targeted tests, then run the required final validation. See `docs/local-development.md` for the complete Windows workflow.

## Secret-Handling and Scanning Contract

Future Codex sessions must:

1. Never print, summarize, quote, or include secret values from `.env.local`, credential stores, scanner findings, logs, test output, Playwright artifacts, doctor output, environment summaries, or final reports.
2. Never paste secrets into README files, documentation, tests, examples, fixtures, screenshots, reports, or application source.
3. Use server-side environment variables for secret configuration. Never convert a server-only secret into a browser-public variable such as `NEXT_PUBLIC_*`.
4. Keep `.env.local`, equivalent secret files, private keys, credential exports, and secret-bearing certificates ignored and uncommitted.
5. Run `npm run scan:secrets` before completing every meaningful task; it is also required by `npm run validate`.
6. Run `npm run scan:secrets:history` for legacy-repository cleanup, project consolidation, suspected exposure, or preparation of formerly private source for public release.
7. Treat a plausibly exposed or committed credential as compromised until the provider credential has been revoked or disabled and replaced.
8. Never claim that deleting a credential from the current file makes it safe when it remains in Git history.
9. Never weaken or bypass secret scanning merely to make validation pass.
10. Investigate every scanner match before suppressing it. Prefer changing unrealistic fake data, then a narrow rule/path suppression, and only then a documented exact suppression.
11. Never add broad scanner allowlists, disable detector categories, or suppress an unknown finding.
12. Report findings only by safe path/location, detector or provider type, confidence, commit reference when applicable, and required remediation—never by matched value.

If exposure is suspected: identify the provider/type without revealing the value; revoke it; create a replacement; store the replacement only in `.env.local` or an approved secret store; remove the tracked value; determine whether history cleanup is needed; and rerun both secret scans. History rewriting requires a separate explicitly authorized task.

## Repository and History Safety Contract

Future Codex sessions must:

1. Run `npm run check:git-safety` and inspect `git status --short --branch` before staging, committing, or pushing.
2. Confirm the repository root, current branch, source commit, upstream, and exact fetch/push remote; use the `github` remote for GitHub work and never confuse it with the `sites` deployment remote.
3. Implement on a purpose-named `codex/*` branch, not directly on `main` or legacy `master`; use `main` only during an explicitly authorized merge-only phase.
4. Stage exact reviewed paths. Inspect both the staged file list and staged diff, and run `git diff --cached --check` before commit.
5. Keep commits single-purpose and intent-named. Do not mix feature, dependency, formatting, generated-output, policy, or deployment work.
6. Use the proven review and normal `--no-ff` merge workflow unless the user explicitly approves another method. Do not automatically squash, rebase, amend, or delete the source branch.
7. Never force-push, rewrite shared history, run `git reset --hard`, run `git clean`, perform broad restore/checkout, delete branches, prune, or run repository cleanup without explicit authorization and exact-target verification.
8. Preserve unrelated tracked and untracked changes. Do not treat a dirty worktree as permission to discard, stage, or relocate user work.
9. Follow `.gitattributes`; do not perform repository-wide renormalization or line-ending conversion during unrelated work.
10. Treat files at or above 1 MiB as requiring intentional review and files at or above 10 MiB as blocked by default. Re-evaluate Git LFS in a dedicated task rather than adopting it incidentally.
11. Never commit local databases, dumps, backups, private exports, credentials, real client data, logs, caches, dependency trees, build artifacts, or test reports. Ignore rules do not make private content safe.
12. Permit schemas, migrations, and synthetic fixtures only after confirming that they contain no private or credential-derived data.
13. Treat `package-lock.json` changes as valid only for intentional dependency work and inspect them with `package.json`.
14. Run `npm run scan:secrets:history` for legacy consolidation, suspected exposure, or public-release preparation; rotate exposed credentials before any history remediation.
15. Preserve evidence before recovery. Prefer exact-path unstaging, additive commits, `git revert`, branches created from recoverable commits, and `git reflog` over destructive repair.
16. Resolve conflicts deliberately using both sides, surrounding history, tests, and the business-reference hierarchy. Report material approved-policy conflicts instead of choosing silently.
17. Keep deployment separate from GitHub contribution work. A commit, branch push, or merge does not authorize Sites packaging, pushing, version creation, or production activation.
18. Verify the remote branch resolves to local `HEAD` after push and report the commit identifier.
19. Follow `CONTRIBUTING.md` for the complete merge, migration, archive, recovery, and public-release procedures.
20. Keep pre-commit hooks optional unless a separately approved managed-hook task installs one that invokes the repository checks with clear failure behavior.

## Data and Privacy Engineering Contract

Future Codex sessions must:

1. Read `docs/data-privacy.md` before changing persistence, forms, API payloads, browser storage, logging, analytics, backups, imports, exports, schemas, migrations, or third-party data flows.
2. Classify new persistent data before storing it and apply both a confidentiality class and a retention class.
3. Minimize collection and duplication; do not turn this website into a competing Client-record system when Precise Petcare is already authoritative.
4. Never commit real Client records, contact submissions, consent records, addresses, access instructions, medical details, travel schedules, payment metadata, private exports, or production backups.
5. Use only clearly synthetic test records. Never derive fixtures, snapshots, screenshots, or examples from production or Client data.
6. Distinguish versionable schemas, migrations, validation definitions, and synthetic seed structure from non-versionable real database contents.
7. Keep secrets and private service configuration server-only. Treat every `NEXT_PUBLIC_*` value as browser-public.
8. Keep private data out of URLs, path segments, fragments, analytics, browser-persistent storage, static assets, client bundles, and public API responses unless an approved design specifically requires a minimized safe representation.
9. Never log raw credentials, tokens, complete contact submissions, private addresses, access details, medical instructions, travel schedules, or other sensitive payloads. Use request IDs, categories, status, and redacted identifiers.
10. Treat browser input, query parameters, API payloads, webhooks, uploads, and imported records as untrusted. Server-side validation controls server processing.
11. Give each component, route, service, and developer only the least data needed for its responsibility; authentication alone never establishes authorization.
12. Keep local development and automated tests free of production/Client data by default. Exceptional use requires explicit authorization, minimization or anonymization, temporary handling, and reviewed cleanup outside Git.
13. Define retention before adding durable storage. Do not invent legal or business retention periods; mark unresolved decisions for owner/legal review.
14. Before destructive data or schema migration, verify the exact source/version, recoverable pre-state, disposable rehearsal, invariants, compatibility, rollback limits, and post-migration validation. Never infer success from exit code alone.
15. Inspect legacy databases, dumps, backups, and exports read-only first. Record hashes, schema/version, counts, timestamps, references, and provenance without assuming the newest or largest file is canonical.
16. Use `ANALYZE → VALIDATE → PREVIEW → APPROVE → WRITE` for imports. Define explicit export fields and never include secrets or unrelated private data.
17. Keep private exports and backups outside public Git, browser-served folders, logs, and shared temporary directories. Never create plaintext credential backups.
18. Treat ambiguous content as `PRIVATE / MANUAL REVIEW`; preserve evidence and stop before irreversible cleanup when exposure or authority is uncertain.
19. Redact reports, tool output, issue text, screenshots, and commit messages; never reproduce private values merely to document a finding.
20. Preserve the business-reference hierarchy. Data architecture documents describe handling and provenance; they do not create competing business, privacy, consent, or legal policy.

## Dependency, Supply-Chain, and Build Contract

Future Codex sessions must:

1. Use Node 22.17.1 from `.nvmrc`, npm 10.9.2 from `packageManager`, and npm only.
2. Treat `package-lock.json` lockfile v3 as authoritative; never introduce Yarn, pnpm, Bun, an alternate lockfile, or a package-manager migration without an explicit task.
3. Reuse healthy `node_modules`, npm cache, Playwright browser cache, and valid build/test caches; a new chat is not an install trigger.
4. Use `npm ci` for an absent/clean dependency tree and only evidence-based targeted repair for an existing tree.
5. Never delete the dependency tree or clear package/browser caches as routine troubleshooting.
6. Investigate any unexpected `package-lock.json` change immediately and never stage it in a task that did not intentionally change dependencies.
7. Make dependency additions, removals, overrides, and upgrades dedicated, single-purpose maintenance work.
8. Do not incidentally upgrade Node, npm, Next, Vinext, React, TypeScript, Playwright, ESLint, tests, Gitleaks, or application dependencies.
9. Before adding a package, verify its exact identity, reputable source, purpose, classification, compatibility, alternatives, lifecycle behavior, license, graph growth, and maintenance cost.
10. Prefer the platform, standard library, or an existing dependency when it solves the problem safely and maintainably.
11. Do not leave experimental installs behind; inspect the complete manifest and lockfile diff after every intentional package operation.
12. Before removing a package, inspect imports, dynamic/config/script use, generated behavior, and peer requirements; validate fully afterward.
13. Review meaningful transitive graph changes and do not manually pin transitives or add `overrides` without a documented reason and removal condition.
14. Evaluate new install/lifecycle scripts before accepting them; do not globally disable required scripts merely to make installation appear safer.
15. Do not normalize `--force`, `--legacy-peer-deps`, `--ignore-scripts`, `--unsafe-perm`, or similar bypass flags.
16. Run `npm run check:supply-chain` after dependency/toolchain changes and use `npm run deps:summary` for a safe inventory.
17. Never run `npm audit fix` or `npm audit fix --force` automatically; assess direct/transitive placement, runtime/dev exposure, exploit applicability, remediation, and upgrade impact.
18. Report a registry/audit outage as unavailable, never as a clean vulnerability result.
19. Keep Git, the editor/Codex, runtime manager, and Gitleaks machine-wide; keep framework, compiler, lint, tests, Playwright package, and build tooling project-local.
20. Keep Playwright Chromium in its user cache and reinstall it only when missing, corrupt, or incompatible with an intentional Playwright change.
21. Preserve server/client environment boundaries during build; every `NEXT_PUBLIC_*` value is browser-public and no server secret may enter client output.
22. Ensure builds compile only and do not perform live Client-data fetches, provider writes, messages, payments, bookings, or production mutations.
23. Treat `.next`, `.vinext`, `dist`, `.wrangler`, coverage, reports, traces, logs, and other generated output as ignored, regenerable, and non-authoritative.
24. Follow the recovery ladder in `docs/dependency-supply-chain.md` before replacing the dependency tree or clearing caches.
25. Keep dependency upgrades, CI/bots, SBOM infrastructure, deployment, and hosting changes out of unrelated work; report all limitations and unresolved findings accurately.

## Testing and Quality Contract

Future Codex sessions must:

1. Read `docs/testing-quality.md` and run the narrowest relevant tests during implementation.
2. Run the required standard or full final validation before completion and report the commands, counts, warnings, and failures explicitly.
3. Treat an unexpected Node or E2E test-count decrease as a stop-and-investigate event; document every intentional removal or consolidation and how coverage is preserved.
4. Never delete tests merely to make a suite pass, weaken assertions to hide a defect, or make inaccessible/nonfunctional behavior authoritative through snapshots.
5. Keep fixtures obviously synthetic and private-safe; never use production exports, real Clients, private addresses, travel dates, care/medical data, access details, or payment metadata.
6. Prevent automated tests from sending email or SMS, charging payments, creating bookings/records, mutating third-party or Client data, or publishing content.
7. Restore mocked globals and environment variables, reset shared state, isolate browser storage, and clean only owned temporary artifacts.
8. Keep tests deterministic where practical: inject clocks, use fixed dates/stable ordering, avoid randomness and locale assumptions, and do not depend on external provider networks.
9. Never use arbitrary sleeps. Wait for observable conditions and use targeted bounded timeouts only when the boundary justifies them.
10. Use retries intentionally; never add or increase retries as a substitute for reproducing and fixing flakiness.
11. Investigate flaky tests by reproducing, classifying timing/state/environment causes, removing nondeterminism, and preserving assertion strength.
12. Do not permanently skip or quarantine a failing test without a documented temporary issue, owner, deadline/removal criteria, and an explicit non-green suite status.
13. Mock dangerous/unavailable provider behavior, but do not mock away business logic, server validation, security/privacy boundaries, or meaningful integration contracts.
14. Preserve the E2E runner's isolated port 3100, explicit occupied-port failure, exact process-tree ownership, and cleanup after success/failure.
15. Keep failure screenshots, traces, reports, and logs ignored and private-safe; never dump secrets, complete payloads, Client data, private URLs, or internal decision reasons.
16. Distinguish unchanged baseline warnings from new warnings or failures; known warnings remain visible and do not authorize new ones.
17. Treat the most specific applicable `CURRENT / APPROVED` business reference as authority over implementation and stale test expectations.
18. Add meaningful negative tests for critical input, security, privacy, and provider-failure paths without creating combinatorial noise.
19. Preserve the package lock, test toolchain, Node/npm, Playwright, browser cache, and dependency graph during quality-only work.
20. Keep standard validation reasonably fast; reserve the build/browser lifecycle and other expensive checks for the documented full/final gate where appropriate.
21. Do not claim fully green when required validation was skipped, interrupted, unavailable, or passed only after an unexplained rerun.
22. Keep each layer's proof distinct: tests, typecheck, lint, build, E2E, security scans, supply-chain checks, and repository safety do not substitute for one another.
23. Prefer observable contract assertions and small focused helpers; avoid giant setup abstractions, broad truthy assertions, and snapshots that hide meaningful change.
24. Preserve safe parallelism and serialize only demonstrated shared resources; no test may depend on execution order.
25. Follow `docs/testing-quality.md` for suite ownership, regression priorities, fixtures, determinism, artifacts, targeted validation, and failure handling.

## External Integration and Side-Effect Contract

Future Codex sessions must:

1. Read `docs/integrations-side-effects.md` before changing an external provider, network call, webhook, provider credential, or side-effecting flow.
2. Classify every new integration as read-only, write-capable, read/write, redirect-only, or inactive and record its current status honestly.
3. Define explicit local, automated-test, E2E, staging/sandbox, and production policies before enabling an integration.
4. Keep production provider writes out of routine local development, builds, tests, E2E, diagnostics, and unrelated tasks.
5. Never use production credentials, recipients, phone numbers, payment methods, Client records, or provider accounts in automated tests.
6. Use mocks, injected transports, local stubs, or an explicitly isolated provider sandbox appropriate to the operation.
7. Give each active write provider its own explicit server-side enablement gate; do not let credential presence alone enable a write.
8. Keep provider secrets server-only, out of `NEXT_PUBLIC_*`, URLs, logs, errors, fixtures, screenshots, reports, and browser responses.
9. Minimize outbound private data and map inbound provider responses to the smallest client-safe shape.
10. Treat every provider response, webhook, imported record, and provider-controlled identifier as untrusted input.
11. Validate important provider response shape before using it; malformed data must take the documented safe failure path.
12. Use operation-specific bounded timeouts; do not allow an external request to hang without a deadline.
13. Retry only when the operation semantics are safe; never retry validation, authentication/configuration errors, or unsafe non-idempotent writes automatically.
14. Require provider-aware idempotency for every duplicate-risk write, including email, SMS, payment, booking, record creation, webhook handling, and background work.
15. Distinguish failure before send, confirmed provider rejection, and timeout/transport failure with an unknown provider outcome.
16. Never blindly retry an unknown write outcome without reusing the same valid idempotency key and identical payload or first reconciling provider state.
17. Preserve duplicate protection across repeat clicks, browser retry, refresh, network ambiguity, provider retry, webhook redelivery, and concurrent processing as the risk requires.
18. Preserve contact-flow partial-success semantics: accepted business notification is not rolled back or resent merely because visitor confirmation fails.
19. Do not claim delivery, booking, payment, publication, or another final outcome when only the app or provider accepted a request.
20. Normalize provider errors to safe internal categories and never reflect raw exceptions, response bodies, headers, stack traces, private origins, or payloads to users.
21. Log only safe operational metadata such as provider, operation, duration, category, outcome, status, and bounded correlation ID.
22. Keep Turnstile and other security verification fail-closed; never weaken bot, webhook, signature, replay, or authorization controls for test convenience.
23. Keep local startup and standard diagnostics independent of live provider availability; live diagnostics must be separate, explicit, and non-writing by default.
24. Preserve automated-test, E2E, and build side-effect boundaries whenever scripts, environment loading, routing, or provider adapters change.
25. Document reconciliation and rollback limits for every write; never pretend unrelated provider calls form a transaction.
26. Make future background writes idempotent, bounded, shutdown-safe, observable, reconcilable, and recoverable before adding workers or queues.
27. Never modify provider accounts, dashboards, subscriptions, DNS, hosting, Sites, `.openai`, or production configuration during an unrelated application task.
28. Never enable SMS, payment, booking, Precise Petcare mutation, Client-record mutation, or publishing without explicit authorization and provider-specific safety design.
29. Preserve business-reference and Client-record authority; provider defaults, examples, docs, or API capabilities do not create business policy or consent.
30. Run `npm run check:integrations`, relevant provider-failure tests, secret scanning, and the required full validation; report unresolved configuration and live-contract gaps honestly.

## Observability, Diagnostics, and Recovery Contract

Future Codex sessions must:

1. Read `docs/observability-recovery.md` before changing logging, diagnostics, error handling, health, startup behavior, failure artifacts, cleanup, recovery, or incident handling.
2. Diagnose before cleaning, resetting, reinstalling, retrying, increasing timeouts, or rebuilding the environment.
3. Preserve useful safe failure evidence until the root cause and remediation are validated.
4. Never print or log secrets, credentials, authorization/cookie headers, environment values, private URLs, or raw provider responses.
5. Never log complete contact submissions, identity/contact details, exact addresses, access instructions, travel dates, pet care/medical/behavior details, payment data, private calendar content, or private production data.
6. Keep client-safe errors separate from internal diagnostics; never return raw causes, stacks, local paths, credentials, provider bodies/headers, or internal decision reasons.
7. Preserve the small application and provider error taxonomies; do not collapse configuration, validation, security, duplicate, rate-limit, provider, and internal failures into one generic category prematurely.
8. Distinguish `NOT_ATTEMPTED`, `CONFIRMED_FAILURE`, provider acceptance, and `UNKNOWN_OUTCOME` for external writes.
9. Never report timeout/transport ambiguity as confirmed failure or blindly retry an unknown write outcome.
10. Use server-generated random correlation IDs; do not encode PII or trust client-supplied IDs as authoritative.
11. Retain provider request IDs only when safe, sanitized, bounded, and useful; do not expose them to clients without a concrete need.
12. Use only the explicit structured diagnostic schema and keep production logs minimal; never attach arbitrary context or payload objects.
13. Keep `doctor` local, read-only, deterministic, fast, secret-safe, non-destructive, and independent of live providers.
14. Keep live provider health separate from local health, startup, builds, tests, and standard validation.
15. Treat `/api/health` as minimal process liveness, not proof of provider availability, business capacity, or complete readiness.
16. Distinguish missing/incomplete configuration from provider outage and identify only variable names or safe configured/unconfigured status.
17. Preserve rate-limit, Turnstile, honeypot, and duplicate diagnostics without logging IPs, fingerprints, attempted values, payloads, or private thresholds.
18. Preserve operation latency only as bounded numeric duration with a safe operation/provider label.
19. Keep logs, traces, screenshots, reports, and generated diagnostics ignored, bounded, and private-safe.
20. Preserve failed-test artifacts when useful; remove exact generated targets only after the investigation or when proven stale.
21. Never kill unrelated processes or broad Node groups; inspect and stop only the exact repository-owned process/session.
22. Preserve port ownership rules for interactive development and E2E, including explicit occupied-port failure and release after testing.
23. Use an exact Git SHA plus passing baseline and verified remote state for a known-good checkpoint; never rely on “last working version.”
24. Prefer corrective commits or normal `git revert` over shared-history rewrite; never reset, clean, force-push, or rewrite history without explicit authorization.
25. Follow the documented dependency, build, E2E, provider, configuration, secret, and private-data recovery ladders in order.
26. Fix root cause where practical; a retry, larger timeout, cache clear, reinstall, or process kill is not a root-cause fix without evidence.
27. Do not add Sentry, Datadog, New Relic, OpenTelemetry, Prometheus, centralized logging, tracing, alerting, or another monitoring SaaS without explicit authorization and privacy/retention/ownership review.
28. Classify incidents proportionately, preserve evidence before privacy/security cleanup, and create a safe incident record only for meaningful events.
29. Never include secret/private raw values in an incident record; use an approved access-controlled evidence location and safe opaque references.
30. Report unresolved production logging, retention, access, alert ownership, metrics, and live-diagnostic decisions honestly without inventing infrastructure or policy.

## Performance and Resource-Safety Contract

Future Codex sessions must:

1. Read `docs/performance-resources.md` before changing public input processing, provider calls, caching, process-local state, client async work, assets, build behavior, or performance controls.
2. Optimize for predictable, bounded, responsive behavior in that order after correctness and safety; do not micro-optimize healthy small workloads.
3. Keep every untrusted request body and field bounded before parsing, hashing, logging, rendering, email generation, or provider use.
4. Preserve streaming request-body limits and return `413` for oversized public JSON without logging the rejected body.
5. Bound provider bodies before text or JSON parsing, even when the provider is operationally trusted or omits `Content-Length`.
6. Preserve calendar response bytes, event count, date-window, processing-deadline, timeout, malformed-feed fallback, and no-store controls; never expand recurrence without an explicit finite bound.
7. Return only the minimum validated subset of address, route, calendar, and other provider results; never proxy raw provider payloads to the browser.
8. Avoid user-action-to-loop provider patterns and document the maximum external calls for every new workflow.
9. Preserve operation-specific provider timeouts and evaluate total sequential route latency before adding another call or increasing a deadline.
10. Parallelize external calls only when independent, quota-safe, and semantically safe under partial failure; preserve business-notification-before-confirmation semantics.
11. Do not add automatic provider retries or polling loops that can create retry storms; unknown writes require the same payload and idempotency key or reconciliation.
12. Keep all process-local maps, sets, and caches cardinality-bounded, payload-minimal, expiring, and pruned; the control must not become an exhaustion vector.
13. Preserve the documented per-instance nature of rate limits, duplicate state, and transient idempotency; do not claim cross-instance guarantees.
14. Add durable or distributed state only after a concrete trigger such as multiple-instance correctness failure, high-risk writes, ineffective limits, or measured traffic pressure.
15. Keep browser storage to a fixed small key set with sanitized bounded values; never add append-only history or sensitive Client data.
16. Cancel stale rapid-input and unmounted client requests where relevant, and prevent older async responses from overwriting newer decisions.
17. Clean up dynamically registered listeners, timers, animation frames, and provider widgets; do not introduce uncontrolled intervals or polling.
18. Preserve loading and in-flight UI states that discourage duplicate expensive work while retaining server-side enforcement.
19. Keep `/api/health` local, constant-work, provider-free, database-free, private-data-free, and `no-store`.
20. Keep diagnostic records schema-limited and field-bounded; do not add per-item or loop logging that can amplify an error storm.
21. Do not introduce application caching without a defined key, value, TTL, maximum size, invalidation rule, privacy class, authority, and safe failure behavior.
22. Do not cache private Client data or stale business-rule data merely for speed; preserve `no-store` on private or dynamic endpoints.
23. Preserve static asset caching and deliberate lazy loading; investigate assets at or above 1 MiB and block new assets at or above 10 MiB unless separately approved.
24. Preserve client/server bundle boundaries, targeted icon imports, local font strategy, and deferred heavy optional UI; do not move secrets or provider logic client-side.
25. Keep builds deterministic apart from documented timestamps and free of live provider reads, writes, production data, and network side effects.
26. Investigate material, repeatable build, test, route, bundle, or interaction regressions; do not treat ordinary timing noise as failure.
27. Use pagination/windowing for future large reads and define bounded batch size, concurrency, partial failure, progress, retry, and cleanup for future bulk work.
28. Require size, parser, storage, concurrency, and cleanup budgets before adding uploads; require query bounds/index review before adding a database; require runtime, concurrency, batch, retry, idempotency, and shutdown limits before adding jobs.
29. Do not add Redis, queues, workers, service workers, CDN rules, load-test tooling, performance SaaS, analytics, or distributed controls without measured need and explicit scope.
30. Never weaken validation, Turnstile, rate limiting, privacy, authorization, idempotency, or business/safety review for speed; run `npm run check:resources` and report performance/resource changes explicitly.

## Cross-Platform and Filesystem-Safety Contract

Future Codex sessions must:

1. Read `docs/cross-platform-filesystem.md` before changing filesystem access, repository scripts, generated state, paths, filenames, process execution, cleanup, encoding, or line-ending behavior.
2. Keep URL paths and filesystem paths as separate domains; never apply filesystem normalization to site URLs or URL concatenation to filesystem paths.
3. Use Node path/file-URL APIs for filesystem paths and derive repository roots from the executing module rather than a username, home directory, current shell accident, or fixed clone name.
4. Preserve native Windows 10/11 as the primary verified developer environment and report Linux-like/macOS support only to the level actually validated.
5. Do not require WSL, Bash, Docker, or a devcontainer for normal repository workflows.
6. Keep npm commands PowerShell-compatible and avoid Bash-only file commands, POSIX-only environment assignment, or shell command-string construction when a Node script or argument array is practical.
7. Preserve `.gitattributes`: LF for repository text and Unix/Python scripts, CRLF for PowerShell/CMD/BAT, and explicit binary treatment for media/fonts/archives.
8. Keep repository text UTF-8 without BOM unless a documented tool requirement creates a narrow exception; never mass-convert binary or unrelated files.
9. Treat filename/import/public-asset case mismatches as Linux-like deployment defects even when Windows resolves them.
10. Use a two-step Git-aware operation for a necessary case-only rename on Windows; never rename only for style during unrelated work.
11. Avoid Windows reserved device names, invalid characters, control characters, trailing dots/spaces, and needlessly deep generated paths.
12. Review non-ASCII filenames for lookalikes, combining marks, normalization ambiguity, and unusual whitespace rather than normalizing indiscriminately.
13. Keep generated output, build state, reports, traces, screenshots, logs, and caches ignored, regenerable, and non-authoritative; fix source/configuration instead.
14. Allow recursive cleanup only for fixed reviewed generated targets that are inside the script-derived repository root and on an explicit allowlist.
15. Never recursively delete or move an unknown, user-supplied, shared-temp, home, repository-root, worktree, dependency, package-cache, browser-cache, or private-data path.
16. Refuse linked cleanup/scanner traversal; account for symbolic links and Windows junctions/reparse points before destructive recursion or copying.
17. Verify containment with resolved paths plus separator-aware `path.relative()` logic; a raw string-prefix check is not containment.
18. Keep temporary files in an application/project-specific unique directory, clean only owned targets, and preserve safe failure evidence while it remains useful.
19. Never clear an OS-wide temp directory or assume unrelated temp content belongs to this project.
20. Use child-process executable/argument arrays with an explicit working directory, exit handling, bounded waits where needed, and no untrusted shell interpolation.
21. Never kill broad Node/process-name groups; preserve exact E2E process ownership, explicit occupied-port failure, and release of port 3100 after tests.
22. Use platform-neutral Node probing for port availability; Windows commands may enrich owner diagnostics but must not decide portability-critical state.
23. Keep Gitleaks and Playwright paths environment/tool-discovered, user-independent, and outside tracked source; do not vendor machine binaries or caches.
24. Keep Git/security/resource scans repository-scoped and bounded; never traverse unrelated home folders, other repositories, browser caches, or dependency trees without an explicit reason.
25. Do not relocate a repository or active worktree during implementation; after a clean pushed checkpoint, prefer a fresh clone, recreated ignored config, and full validation.
26. Treat OneDrive/sync-folder and UNC/network-share operation as non-canonical and unverified; do not promise their locking, watcher, latency, or consistency behavior.
27. Use repository-relative links in tracked documentation; completion-report links may be local, but client responses and public artifacts must not expose local paths.
28. Sort filesystem/glob results whenever ordering affects output and do not use timestamps, file size, or enumeration order as sole authority.
29. Before future upload/archive/persistent-file work, define generated names, size/type/parser bounds, containment, link/archive traversal defenses, atomicity, collisions, permissions, retention, and cleanup.
30. Run `npm run check:cross-platform` after relevant changes and in final validation; report unresolved platform limitations honestly and do not weaken the guard to hide a finding.

## Accessibility and Responsive-UI Contract

Future Codex sessions must:

1. Read `docs/accessibility-responsive.md` before changing public UI markup, styles, forms, navigation, dynamic status, images, motion, or responsive behavior.
2. Treat WCAG 2.2 AA as the practical engineering target while never claiming legal compliance, conformance, or certification from automated checks alone.
3. Prefer native semantic HTML and use buttons for actions, links for navigation, labels for controls, fieldsets/legends for related choices, lists for lists, and native details/summary where appropriate.
4. Preserve one meaningful `main` landmark and a logical heading hierarchy with one descriptive page `h1`; keep page titles distinguishable.
5. Preserve full keyboard access and logical DOM/focus order across viewport changes; never introduce positive `tabindex` or manual tab-order hacks.
6. Preserve a clearly visible focus indicator on every interactive control; never remove an outline without an equally or more visible replacement.
7. Keep focused content from being obscured by sticky headers, fixed controls, menus, or overlays; use scroll spacing or layout corrections where needed.
8. Avoid keyboard traps. If a real modal or overlay is introduced, implement appropriate focus containment, Escape handling, initial focus, background behavior, and focus restoration.
9. Keep compact navigation and future menus usable with keyboard, pointer, and touch; expose expanded state and prevent hidden responsive descendants from remaining focusable.
10. Avoid hover-only functionality and device-width assumptions about input modality; hover enhancements must have keyboard and touch equivalents.
11. Label every form control programmatically and visibly. Placeholder text remains supplementary and must never replace a label.
12. Convey required fields visually and programmatically, preserve useful autocomplete/input types/input modes, and keep mobile form text comfortably readable.
13. Associate custom field errors and instructions with their controls, use `aria-invalid` where appropriate, and move focus after failed submission only when it improves recovery.
14. Announce important asynchronous success, failure, loading, availability, autocomplete, and planning results with restrained status/alert patterns; never make an entire busy form a live region.
15. Preserve user-entered non-sensitive values after recoverable errors and do not clear a form until successful completion intentionally requires it.
16. Use ARIA only when necessary and correct. Native semantics take precedence; invalid, redundant, contradictory, or speculative ARIA must not be added.
17. Give icon-only controls meaningful accessible names, align accessible names with visible labels for speech input, and hide decorative icons/images from assistive technology.
18. Write concise contextual alt text for informative images, use empty alt for decorative images, keep critical text as real text, and never restore or expose Client media without approved authority.
19. Never rely on color alone for state or meaning. Preserve WCAG AA text and non-text contrast and measure actual foreground/background pairs rather than approving them by eye.
20. Keep body links distinguishable in context and preserve control boundaries, focus, and meaning in Windows forced-colors/high-contrast mode.
21. Preserve usable touch targets, especially for compact navigation, icon controls, checkboxes, autocomplete options, and primary actions; apply the inline-text exception thoughtfully.
22. Preserve zoom and reflow: never disable user scaling, lock orientation, globally hide horizontal overflow to conceal defects, or use fixed text-bearing dimensions that clip enlarged content.
23. Test core layouts around 320, 375, 390, 768, 1024, and 1280+ CSS pixels based on content needs; keep grids/flex children shrinkable and long content wrappable.
24. Respect `prefers-reduced-motion`, including smooth scrolling and transform-heavy animation, and do not add autoplay, flashing, parallax, or auto-advancing content without accessible controls and a demonstrated need.
25. Preserve the contact form's security, privacy, required-state, error, pending, and consent semantics. SMS consent remains optional, unchecked, separate from Terms, and linked to the canonical visible disclosure.
26. Keep accessible names, descriptions, statuses, errors, test data, and screenshots privacy-safe; never expose private addresses, internal route/capacity reasoning, Client data, credentials, or provider payloads for accessibility.
27. Treat Cloudflare Turnstile and other provider widgets as third-party accessibility boundaries: preserve surrounding context and recoverable failure behavior, but do not claim control of provider internals.
28. Run `npm run check:a11y` and relevant focused browser tests after meaningful UI changes, and run `npm run validate:full` before completing a substantial phase. Do not broadly suppress Axe findings.
29. Test task completion and focus behavior rather than brittle tab counts or pixel-perfect snapshots; preserve critical keyboard, responsive, reduced-motion, touch, form, autocomplete, and status coverage.
30. Document manual gaps honestly. Real screen-reader, 200%/400% browser zoom, text-only zoom, forced-colors, orientation, and configured third-party-widget checks remain manual unless actually performed.

## CI, Hosting, Deployment, and Release-Safety Contract

Future Codex sessions must:

1. Never deploy from a dirty working tree or include untracked release-critical files.
2. Deploy only an exact known Git SHA and record that SHA with the result.
3. Verify the branch, source SHA, freshly fetched GitHub remote match, and intended Sites version before deployment.
4. Keep implementation, review/merge, Sites version creation, production activation, provider configuration, and DNS changes as separate authorized operations.
5. Never expose production secrets or private production data to local development, tests, E2E, CI, forks, untrusted pull requests, previews, or build artifacts.
6. Keep every provider write gate explicit, server-only, environment-specific, and independent of `NODE_ENV`, hostname, build, merge, or deployment success.
7. Keep preview writes off by default and treat any hosted preview as publicly visible.
8. Never enable unresolved SMS, payment, booking, webhook, Client-record, or Precise Petcare mutation paths.
9. Never print, export, diff, log, archive, or record deployment credentials or production secret values.
10. Store production secrets only in the approved host/provider secret store; `.env.production` and credential exports never belong in Git.
11. Distinguish build-time, server-runtime, and browser-public environment variables; every `NEXT_PUBLIC_*` value is public.
12. Preserve deterministic fresh installs with Node 22.17.1, npm 10.9.2, `npm ci`, and the reviewed lockfile.
13. Run `npm run check:deployment` and the full required validation before a production deployment.
14. Never deploy while a required check is red or an unexpected test-count decrease, warning, secret finding, artifact finding, or source mismatch is unresolved.
15. Preserve business-reference authority plus privacy, integration, accessibility, time, cross-platform, and resource guarantees in every environment.
16. Keep `/api/health` minimal, local, provider-free, private-data-free, environment-detail-free, and `no-store`.
17. Do not perform a real production provider-write smoke test without explicit provider-specific authorization, synthetic data, safe idempotency/reconciliation, and a cleanup/record plan.
18. Identify the last known-good rollback SHA/version before a risky deployment.
19. Roll back by selecting/redeploying or rebuilding the last known-good exact version/SHA, never by rewriting Git history.
20. Verify health, critical routes, redirects, headers, indexing, assets, and provider-gate state after deployment or rollback.
21. Keep a secret-free deployment record containing environment, exact SHA/source, validation, result, smoke result, and rollback SHA.
22. Keep DNS and domain cutover separate from application deployment; never modify records merely because a build is ready.
23. Never modify MX, SPF, DKIM, or DMARC casually during web deployment.
24. Document production configuration names/classes without values and record environment changes by name, actor, time, reason, and result.
25. Give CI and deploy credentials the minimum permissions; routine validation has read-only repository access and no deploy token.
26. Never expose secrets to `pull_request_target`, forked code, arbitrary feature branches, or untrusted CI artifacts.
27. Keep CI provider-write safe with mocks/off configuration, synthetic data, explicit false write gates, and no production network dependency.
28. Audit every third-party GitHub Action, build plugin, hook, or deployment integration and pin Actions to reviewed exact SHAs.
29. Keep CI artifacts failure-only, short-lived, synthetic/private-safe, and never treat artifact storage as a secret store.
30. Report host-dashboard state, production SHA, logs/retention, deployment atomicity, runtime limits, and other external configuration as unresolved unless actually verified.

Use `docs/deployment-hosting.md` for the complete environment matrix, CI design, release checklist, smoke test, rollback, incident, DNS, and owner-action boundaries. A GitHub push does not authorize a Sites push or production activation.
