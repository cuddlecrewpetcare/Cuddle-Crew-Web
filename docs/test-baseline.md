# Test Baseline

The original application baseline was verified from `main` at `3b443a6dcafb0cb3f4ed4129714d357e3e059816`. The current foundation lineage is based on F9 commit `87f7c54b75966401917ad544264ddcc952a8aa31` and is updated below for F10:

- 134 Node unit, integration, security, business-rule, filesystem-safety, and time-determinism tests
- 10 Playwright E2E/smoke tests across `e2e/launch-review.spec.ts` and `e2e/public-flows.spec.ts`
- TypeScript typecheck passing
- ESLint passing with 0 errors and 4 known `@next/next/no-img-element` warnings
- Vinext production build passing
- Gitleaks 8.30.0 current-tree and Git-history scans passing with zero findings
- Read-only repository safety check passing; the intentional 1.75 MiB `public/og.png` receives a review warning and remains below the 10 MiB hard limit

F4 added 3 read-only supply-chain guard tests, bringing that checkpoint to 99 Node tests without changing the 96-test application baseline. F5 added 3 high-value API/security regressions, bringing the baseline to 102. F6 added 8 focused integration regressions for provider and side-effect safety. F7 added 4 observability regressions, bringing the baseline to 114. F8 added 6 resource-safety regressions, bringing its baseline to 120. F9 added 5 filesystem-safety tests, bringing its baseline to 125. F10 adds 9 focused tests for client/server clock authority, provider timestamp parsing, Pacific same-day and elapsed thresholds, date-only arithmetic, midnight, DST, leap/month/year boundaries, controlled duplicate expiry, and variable Overnight elapsed duration, bringing the current baseline to 134 Node tests and 10 Playwright tests. Standard validation includes the time, supply-chain, integration, resource, cross-platform, Git, and secret checks; `check:resources` retains the intentional review warning for the 1.75 MiB social image.

Counts are a regression signal, not a permanent quota. Legitimate feature work may add, reorganize, or remove tests, but an unexpected decrease must be investigated rather than accepted automatically. Browser tests must run against the dedicated Playwright server on port 3100, not an unrelated development server on port 3000.

See [`testing-quality.md`](testing-quality.md) for suite ownership, regression coverage, fixture and side-effect policy, determinism/flakiness handling, targeted validation, and the standard/full quality gates.
