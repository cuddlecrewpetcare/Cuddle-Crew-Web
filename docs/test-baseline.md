# Test Baseline

The original application baseline was verified from `main` at `3b443a6dcafb0cb3f4ed4129714d357e3e059816`. The current foundation lineage is based on F7 commit `4c0083c51d47b46d08f3dad41ba0bafa1062dae5` and is updated below for F8:

- 120 Node unit, integration, security, and business-rule tests
- 10 Playwright E2E/smoke tests across `e2e/launch-review.spec.ts` and `e2e/public-flows.spec.ts`
- TypeScript typecheck passing
- ESLint passing with 0 errors and 4 known `@next/next/no-img-element` warnings
- Vinext production build passing
- Gitleaks 8.30.0 current-tree and Git-history scans passing with zero findings
- Read-only repository safety check passing; the intentional 1.75 MiB `public/og.png` receives a review warning and remains below the 10 MiB hard limit

F4 added 3 read-only supply-chain guard tests, bringing that checkpoint to 99 Node tests without changing the 96-test application baseline. F5 added 3 high-value API/security regressions, bringing the baseline to 102. F6 added 8 focused integration regressions for provider and side-effect safety. F7 added 4 observability regressions, bringing the baseline to 114. F8 adds 6 resource-safety regressions for streaming provider limits and deadlines, process-map cardinality, oversized calendars, contact-attempt capacity, and oversized address-provider responses, bringing the current baseline to 120 Node tests and 10 Playwright tests. Standard validation runs supply-chain, integration, resource, Git, and secret checks; `check:resources` retains the intentional review warning for the 1.75 MiB social image.

Counts are a regression signal, not a permanent quota. Legitimate feature work may add, reorganize, or remove tests, but an unexpected decrease must be investigated rather than accepted automatically. Browser tests must run against the dedicated Playwright server on port 3100, not an unrelated development server on port 3000.

See [`testing-quality.md`](testing-quality.md) for suite ownership, regression coverage, fixture and side-effect policy, determinism/flakiness handling, targeted validation, and the standard/full quality gates.
