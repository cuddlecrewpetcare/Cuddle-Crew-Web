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
