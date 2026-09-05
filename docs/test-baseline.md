# Test Baseline

The original application baseline was verified from `main` at `3b443a6dcafb0cb3f4ed4129714d357e3e059816`. The F14 foundation lineage is based on F13 commit `df53040b36640e96d9bdf511946f119b26b3cda6`:

- 142 Node unit, integration, security, business-rule, filesystem, time, deployment, and recovery tests
- 21 Playwright E2E/accessibility/smoke tests across `e2e/accessibility.spec.ts`, `e2e/launch-review.spec.ts`, and `e2e/public-flows.spec.ts`
- TypeScript typecheck passing
- ESLint passing with 0 errors and 4 known `@next/next/no-img-element` warnings
- Vinext production build passing
- Gitleaks 8.30.0 current-tree and Git-history scans passing with zero findings
- Read-only repository safety check passing; the intentional 1.75 MiB `public/og.png` receives a review warning and remains below the 10 MiB hard limit

F4 added 3 read-only supply-chain guard tests, bringing that checkpoint to 99 Node tests without changing the 96-test application baseline. F5 added 3 high-value API/security regressions, bringing the baseline to 102. F6 added 8 focused integration regressions for provider and side-effect safety. F7 added 4 observability regressions, bringing the baseline to 114. F8 added 6 resource-safety regressions, bringing its baseline to 120. F9 added 5 filesystem-safety tests, bringing its baseline to 125. F10 added 9 focused time/determinism tests, bringing the Node baseline to 134. F11 keeps all 134 Node tests and adds 9 Playwright accessibility tests for representative Axe scans, skip/navigation focus, address-combobox keyboard behavior, touch, reduced motion, visible focus, and six-width reflow, bringing the browser baseline to 19. Standard validation includes the time, supply-chain, integration, resource, cross-platform, Git, and secret checks; `check:resources` retains the intentional review warning for the 1.75 MiB social image. `npm run check:a11y` is the focused F11 browser command; automated scans are not accessibility certification.

Counts are a regression signal, not a permanent quota. Legitimate feature work may add, reorganize, or remove tests, but an unexpected decrease must be investigated rather than accepted automatically. Browser tests must run against the dedicated Playwright server on port 3100, not an unrelated development server on port 3000.

See [`testing-quality.md`](testing-quality.md) for suite ownership, regression coverage, fixture and side-effect policy, determinism/flakiness handling, and the standard/full quality gates. See [`accessibility-responsive.md`](accessibility-responsive.md) for the F11 automated/manual accessibility boundary and regression matrix.

F12 starts from the exact F11 checkpoint `65b48a0c5bf9203629ead5222d294b9e4373c120`. It adds 4 Node deployment/CI policy regressions (138 total), 2 Playwright deployment-header and preview-indexing regressions (21 total), validation-only Linux CI, a source/configuration deployment check, and a post-build artifact check. The checks do not deploy, contact production providers, access production data, or require production secrets. Final F12 counts and warnings must be verified by the branch validation result; this paragraph is the intended suite inventory, not permission to ignore an unexpected count change.

F13 starts from the exact F12 checkpoint `b41c87582da98ca97d608c5195774037e165bcf1`. It adds 4 Node recovery-foundation regressions (142 total), the read-only `check:recovery` command, a state/backup/restore policy, a concise business-continuity runbook, and a secret-free backup-manifest template. The check verifies repository/document boundaries only; it does not create or prove an external backup, provider export, account-recovery path, production restore, or approved active-care offline method. Browser behavior and the 21-test Playwright baseline are unchanged.

F14 starts from the exact F13 checkpoint `df53040b36640e96d9bdf511946f119b26b3cda6`. It reconciles stale technical inventory, adds the non-duplicating `check:foundation` orchestration command, and records the final foundation readiness audit. No tests, dependency versions, lockfile entries, business rules, provider states, or browser behavior change; the verified baseline remains 142 Node, 21 Playwright, and 9 focused accessibility checks.
