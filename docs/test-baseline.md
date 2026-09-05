# Test Baseline

The original application baseline was verified from `main` at `3b443a6dcafb0cb3f4ed4129714d357e3e059816`. The current foundation lineage is based on F4 commit `16bc55d6e612ca0b4210199347ba7f07d30ba8d4` and is updated below for F5:

- 96 Node unit, integration, security, and business-rule tests
- 10 Playwright E2E/smoke tests across `e2e/launch-review.spec.ts` and `e2e/public-flows.spec.ts`
- TypeScript typecheck passing
- ESLint passing with 0 errors and 4 known `@next/next/no-img-element` warnings
- Vinext production build passing
- Gitleaks 8.30.0 current-tree and Git-history scans passing with zero findings
- Read-only repository safety check passing; the intentional 1.75 MiB `public/og.png` receives a review warning and remains below the 10 MiB hard limit

F4 added 3 read-only supply-chain guard tests, bringing that checkpoint to 99 Node tests without changing the 96-test application baseline. F5 added 3 high-value API/security regressions, bringing the baseline to 102. F6 added 8 focused integration regressions for the Resend write gate/request contract/timeout normalization, Turnstile response validation, malformed calendar fallback, contact unknown-outcome idempotency and partial failure, and Maps key/response safety. F7 adds 4 observability regressions for the safe structured schema, raw-context exclusion, correlation headers, and bounded application taxonomy, bringing the current baseline to 114 Node tests and 10 Playwright tests. Standard validation runs both `npm run check:supply-chain` and `npm run check:integrations`; the supply-chain check retains its documented warning for five optional/WASM entries that a clean Windows `npm ci` causes `npm ls` to label extraneous.

Counts are a regression signal, not a permanent quota. Legitimate feature work may add, reorganize, or remove tests, but an unexpected decrease must be investigated rather than accepted automatically. Browser tests must run against the dedicated Playwright server on port 3100, not an unrelated development server on port 3000.

See [`testing-quality.md`](testing-quality.md) for suite ownership, regression coverage, fixture and side-effect policy, determinism/flakiness handling, targeted validation, and the standard/full quality gates.
