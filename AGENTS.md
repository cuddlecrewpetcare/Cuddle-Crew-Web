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
