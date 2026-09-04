# Test Baseline

Verified from `main` at `3b443a6dcafb0cb3f4ed4129714d357e3e059816` before the local-development foundation changes:

- 96 Node unit, integration, security, and business-rule tests
- 10 Playwright E2E/smoke tests across `e2e/launch-review.spec.ts` and `e2e/public-flows.spec.ts`
- TypeScript typecheck passing
- ESLint passing with 0 errors and 4 known `@next/next/no-img-element` warnings
- Vinext production build passing
- Gitleaks 8.30.0 current-tree and Git-history scans passing with zero findings

Counts are a regression signal, not a permanent quota. Legitimate feature work may add, reorganize, or remove tests, but an unexpected decrease must be investigated rather than accepted automatically. Browser tests must run against the dedicated Playwright server on port 3100, not an unrelated development server on port 3000.
