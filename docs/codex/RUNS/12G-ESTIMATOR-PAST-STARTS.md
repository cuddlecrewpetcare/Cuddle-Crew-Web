# Passed service-start handling

## Assignment and recovery

- WORK_ITEM: `12G-EST-03`; STATUS: IMPLEMENTATION AUTHORIZED. Exact final base hosted Validation [34687817506](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/actions/runs/34687817506) SUCCESS.
- OWNER: fresh native `/root/est03_implement` completed the read-only preflight, then became unavailable at the account-wide native-agent usage limit. Parent `/root` assumed the documented isolated parent-writer fallback on 2026-09-12 after the prior EST-02 merge and exact-main CI completed. Parent remains integration owner and will not self-approve; fresh independent review remains required.
- PREPARATION_BASE: `7a1f8affbbcf8b60b34a7c1e2a217789edc03c86`; final BASE_SHA is `683e19dc0109aa7430095d8903a1500077c14f2f` after normal EST-02 integration.
- BRANCH/WORKTREE: `codex/12g-estimator-past-starts-20260910`, isolated `estimator-past-starts` in current managed workspace.
- AUTHORIZATION: standing bounded P1 release sprint, preserving all earlier fixes. Astra/high appropriate for Pacific time and conservative estimate behavior; runtime identity assignment-scoped, speed unknown.
- READ_SCOPE: mandatory contracts and complete original audit; business README/full hierarchy, most-specific CURRENT / APPROVED core/03 pricing sections 3/6 and Website Notes, logic/38 timing/modifier review, time-locale-determinism and relevant domain/API/UI/tests.
- WRITE_SCOPE after CI_GO: minimal estimator handling and related public types/UI only if needed; focused Node/browser tests and this RUN. Parent owns status/prior completion receipt.
- FORBIDDEN: new availability feature, new clock endpoint or production-only test override, new policy/fee, dependencies/lockfile/provider/Sites/DNS/indexing/SMS/payment/PPC changes, other worktree/original writes, child agents, worker push/merge.

## Reconciliation and acceptance

Original audit fixed clock `2026-09-08T20:00:00-07:00`: morning and partly elapsed 6-9 PM windows, or the Standard Overnight 6 PM start, receive ordinary $30/$85 despite having passed. Existing helper already returns `past`; estimator does not consume that outcome conservatively. Independently reproduce on the actual final assigned base.

Exact-base reproduction confirmed morning and partly elapsed 6–9 PM visits returned ordinary `$30`, and an already-started Standard Overnight returned `$85`; all three had `reviewRequired:false`. The correction consumes the existing Pacific `past` classification before calculation and returns the established opaque all-money-null review result. A Planner-owned explicit daytime window is checked only when that coverage is active; stale hidden window state is not allowed to create a timing decision. Continuous Care remains excluded because its actual start time is not represented by date-only inputs.

The first focused run passed all three new domain cases and exposed only an incorrect function-call expression in the new API test request serialization; typecheck reported the same test-only error. The request fixture was rewritten as an explicit rest object before serialization. No application code changed in that correction; rerun evidence follows below.

Fresh independent review of source `94e9bfe1030b32c5d1ba5651bc79b5b6a72c8b97` found no application, privacy or UI defect, but returned one REQUIRED test-quality finding: the mixed-window and Planner-coverage fixtures could reach review through a second already-past start. The correction isolates a true 1 PM mixed case with the 9 AM window passed and 3 PM window upcoming, and isolates active Planner coverage before the future 6 PM Overnight start. It also proves a stale raw Overnight block remains ignored. This is a test-only follow-up commit; the application implementation is unchanged. Fresh exact-source validation and independent re-review are required.

- Passed or partly elapsed selected service starts cannot yield ordinary automatic pricing; use neutral personalized review with noncalculable monetary output or clear rejection under existing architecture.
- Prefer all-money-null review so copy/print does not retain an ordinary-looking subtotal for a passed request.
- Preserve prior-date rejection, upcoming same-day potential $20 daytime charge, less-than-24h and Overnight less-than-48h behavior, fixed rates and holiday/household review.
- Use Pacific business-date semantics at UTC crossing, exact start threshold and DST; do not infer exact Continuous Care starts from date-only inputs.
- Keep unknown timing conservative and do not claim live availability, booking acceptance or new service promises.
- Test direct fixed-clock domain and real route with synthetic/mock Date as appropriate, selected mixtures of passed/upcoming windows, Overnight, positive future anchors and public review output/copy/print.
- Preserve all already merged restoration, explicit handoff, species and service-compatibility behavior. Existing API test clock mocks must reset safely; no new production clock interface.

## Validation and return

Doctor before work; declared locked setup is parent-owned preparation only. No server until parent releases port3100. Focused original reproduction and meaningful boundary tests, then prescribed full gate/foundation/secrets/diff checks with actual counts and warnings. No weakened tests/retries. Parent obtains fresh independent review, source CI, no-ff merge, merged local full gate and exact-main hosted Validation. Return exact source SHA, paths/authority/repro evidence/counts, clean status and port release. No application GO/deployment claim.

## Parent fallback validation

Focused domain/API and cross-feature validation passed 84/84 after the recorded fixture-only correction; typecheck and lint passed separately. The complete prescribed source gate passed doctor, foundation, resources, current secret scan (zero findings), 205/205 Node tests, typecheck, lint, build, build-artifact privacy, 63/63 Playwright tests, and `git diff --check`, with zero failures or skips. Build artifact safety reported 178 files / 10.37 MiB and made no source edits. Expected warnings were the documented optional/WASM supply-chain entries, intentional large-image notices, Vinext route classification, Node experimental/color notices, synthetic provider failures and safe availability rate-limit fallbacks. No production provider or external write occurred. Exact-source independent review and hosted Validation remain required before integration.
