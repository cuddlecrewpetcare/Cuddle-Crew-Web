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
