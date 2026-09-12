# Cancellation disclosure alignment

## Assignment and recovery

- WORK_ITEM: `12G-POL-01`; STATUS: IMPLEMENTATION AUTHORIZED.
- OWNER: fresh native `/root/pol01_implement`, one writer in this isolated worktree. Parent `/root` owns independent review, integration, status, final audit, and release.
- BASE_SHA: `d28bda1d6c9a6e4ec3fa82ea67bcfc42ddba674e`, the exact reviewed EST-03 main integration supplied by the parent.
- BRANCH/WORKTREE: `codex/12g-cancellation-disclosure-20260912`, isolated `cancellation-disclosure` under the current managed workspace.
- AUTHORIZATION: standing bounded Phase 12G P1 release-remediation sprint; disclosure alignment only.
- READ_SCOPE: mandatory repository contracts, complete original Phase 12G audit, business README/full hierarchy, `core/02-cancellation-booking-change-refund-policy.md`, `logic/36-holiday-peak-date-calendar.md`, existing FAQ and focused test architecture.
- WRITE_SCOPE: FAQ cancellation answer, focused Node/rendered regression coverage, and this RUN record.
- FORBIDDEN: policy or cancellation-behavior changes, duplicated holiday dates, dependencies/lockfile, provider/Sites/DNS/indexing/SMS/payment/PPC changes, PROJECT_STATUS, protected checkout, push, merge, or deployment.

## Business Truth and reconciliation

`core/02-cancellation-booking-change-refund-policy.md` is `CURRENT / APPROVED`, client-facing, and authoritative for cancellation disclosure. It requires a readable public summary to preserve actual deadlines, percentages, exceptions, and service distinctions. `logic/36-holiday-peak-date-calendar.md` is `CURRENT / APPROVED` for qualifying dates and directs cancellation terms back to `core/02`; no conflict or missing owner decision exists.

The original `12G-POL-01` reproduction remains present at the assigned base: the FAQ gives exact daytime outcomes but reduces short Overnight, Extended, and holiday frameworks to unnamed thresholds. The correction replaces that single answer with the approved receipt rule and complete 0/50/100 percent timing ladders for ordinary daytime (including 3–8 hour Continuous Care), short Overnight/24-Hour Continuous Care/multi-day care, Extended Bookings, holiday daytime, and holiday Overnight/24-Hour Continuous Care. It retains discretionary compassionate treatment, identifies the pre-confirmation holiday-treatment boundary, and states the narrow accepted booking-specific exception without duplicating holiday calendar dates.

## Acceptance and validation

- Direct source regression proves every service class, deadline, percentage/outcome, exception, and controlling-policy boundary is present and rejects the former vague threshold-only wording.
- Rendered browser regression searches and expands the public FAQ at 320 px, proves the same controlling content is visible, and checks document overflow.
- Preserve `may be charged`, refund-or-credit treatment, written-receipt timing, compassionate discretion, pre-confirmation disclosure, and the narrow booking-specific exception.
- Run focused Node/browser tests, typecheck/lint, then the complete prescribed source gate: doctor, foundation, resources, current secret scan, `validate:full`, and `git diff --check`, reporting actual counts and warnings.
- Return an exact clean implementation SHA for fresh independent review; no application-GO, merge, or release claim.

## Implementation validation

Focused validation passed: the production-reliability source suite passed 14/14, typecheck and lint passed, the production build passed, and the rendered `12G-POL-01` browser reproduction passed 1/1 at 320 px with no horizontal document overflow.

The complete prescribed source gate passed doctor, foundation, resources, current secret scan (zero findings), 205/205 Node tests, typecheck, lint, build, build-artifact privacy, 64/64 Playwright tests, and `git diff --check`, with zero failures or skips. Build artifact safety reported 189 files / 10.51 MiB and made no source edits. Expected warnings were the five optional/WASM package-tree entries, intentional 2.74 MiB Loki and 1.75 MiB Open Graph assets, Vinext route classification, Node experimental/color notices, and synthetic availability rate-limit/provider fallback logs. Deterministic setup also reported 12 dependency audit labels (1 low, 11 high); dependencies and lockfile were unchanged, and the repository supply-chain gate passed. No provider or other external write occurred.
