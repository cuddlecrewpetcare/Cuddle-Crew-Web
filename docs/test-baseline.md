# Test Baseline

Verified from `main` at `3b443a6dcafb0cb3f4ed4129714d357e3e059816` before the local-development foundation changes:

- 96 Node unit, integration, security, and business-rule tests
- 10 Playwright E2E/smoke tests across `e2e/launch-review.spec.ts` and `e2e/public-flows.spec.ts`
- TypeScript typecheck passing
- ESLint passing with 0 errors and 4 known `@next/next/no-img-element` warnings
- Vinext production build passing
- Gitleaks 8.30.0 current-tree and Git-history scans passing with zero findings
- Read-only repository safety check passing; the intentional 1.75 MiB `public/og.png` receives a review warning and remains below the 10 MiB hard limit

F4 adds 3 read-only supply-chain guard tests, bringing the current total to 99 Node tests without changing the 96-test application baseline. Standard validation now also runs `npm run check:supply-chain`, which passes with a documented warning for five optional/WASM entries that a clean Windows `npm ci` causes `npm ls` to label extraneous.

Counts are a regression signal, not a permanent quota. Legitimate feature work may add, reorganize, or remove tests, but an unexpected decrease must be investigated rather than accepted automatically. Browser tests must run against the dedicated Playwright server on port 3100, not an unrelated development server on port 3000.
