# 12G shared CarePlanner handoff repair

## Assignment

- WORK_ITEM: `12G-CARE-02 / 12G-XF-01 / 12G-XF-02 / 12G-XF-03`
- STATUS: READY_FOR_REVIEW; local completion gates passed, independent exact-SHA review pending.
- PARENT / INTEGRATION_OWNER: `/root`, release-completion session of 2026-09-10.
- EXECUTION_MECHANISM: NATIVE_SUBAGENT; canonical runtime owner `/root/handoff_implement`, parent `/root`; native routing is runtime-only.
- BASE_SHA: `43553cbeb91bd7784eaf9232561247a267e42c82`.
- BRANCH: `codex/12g-planner-handoff-20260910`.
- WORKTREE: `planner-handoff` in this session's managed workspace; isolated from the protected canonical checkout.
- AUTHORITY: owner's release-completion sprint authorizes recorded P1 fixes, validation, independent review, no-ff integration and conditional deployment only after fresh 12G GO.
- OBJECTIVE: preserve selected coverage, known composition, unknown/incomplete composition, and conservative nonsensitive review across a new Planner-to-estimator handoff; prevent old dependent services/windows from contaminating the plan.
- WRITE_SCOPE: Planner handoff producer/parser, estimator input/API/types/state/result consumers, directly relevant Node/E2E regression tests, this RUN. Parent alone maintains PROJECT_STATUS.
- FORBIDDEN: unrelated P1/P2/P3 implementation, business-policy changes, credentials/provider writes, dependency/lockfile changes, hosting/DNS/indexing, original dirty checkout and other preserved worktrees. No recursive delegation or merge/deploy by worker.
- RESOURCE_ASSESSMENT: high safety/cross-feature state risk, bounded public-state contract; Astra / ultra justified for implementation; desired speed normal, actual speed unavailable.
- REQUIRED_VALIDATION: original four direct regressions plus unknown/malformed/legacy privacy and saved-state boundaries; doctor, Git safety, foundation/resources/secrets, full validation, diff check; exact-SHA hosted Validation and independent fresh review before integration.
- ROLLBACK: reviewed additive Git revert if needed; no state migration/provider mutation.

## Initial reconciliation

All four findings are UNRESOLVED at initial fetched main `44f380b3fb9d2700611b4f24c81e4a9304828490`; only CARE-01 product code/test changed since original audit. The orchestration-only base above preserves that product tree. Read the complete original audit before implementing.

| Finding | Original reproduction | Required evidence |
| --- | --- | --- |
| CARE-02 | One dog with complex medication/aggression, two-hour care limit, windows 0/2, 30-minute fit: consultation becomes ordinary $60 handoff | Review survives API/UI/session/copy/print; only opaque nonsensitive review state crosses boundary |
| XF-01 | Overnight plus one 30-minute midday window drops coverage and returns $85 instead of $110 | Explicit separate daytime coverage preserved; unsupported multiple/overlapping selections remain reviewable without lost coverage or double charging |
| XF-02 | Two dogs + cat reconstructed as dog/cat/small; cat + other reconstructed as dog/cat | Exact known broad composition preserved; ambiguous aggregate never manufactures species/price |
| XF-03 | Saved Overnight walk90 contaminates new Planner Overnight with no daytime coverage, producing $153 | Explicit new empty selection overrides incompatible saved add-on/windows while valid unrelated ZIP/tier remains |

## Business Truth preflight

Read business README and source-of-truth hierarchy, then applicable CURRENT / APPROVED `core/03-pricing-fees-surcharge-policy.md` §§3–4; `logic/38-ppc-pricing-quote-implementation.md` §§3,5–8; `logic/20-overnight-acceptance.md` §§1–3 and Midday Care; `logic/18-booking-acceptance-risk-triage.md` Automated Acceptance vs. Review and privacy; `logic/33-custom-quote-scope-review.md` review triggers; medication/behavior references only as needed. Preserve CARE-01. No policy decision is missing for this correction.

## Completion evidence

The implementation SHA is this RUN's containing commit, reported to the parent after creation. Local focused and full gates passed with direct acceptance evidence below. Independent exact-SHA review, merged main and hosted CI remain pending with the parent; no finding is closed by broad tests alone.

## Implementation evidence — 2026-09-10

Parent CI_GO confirmed exact-base hosted Validation run `34475067731` successful before product edits. Initial doctor passed with Node 22.17.1, npm 10.9.2, Chromium 1.62.1, and Gitleaks 8.30.0; no dependency install/upgrade or provider setup was needed by this worker. All product writes stayed in this isolated worktree. Parent separately owns the current PROJECT_STATUS update and website-publication-approvals reference and requested their unchanged inclusion.

Business Truth: README and full hierarchy read; applicable CURRENT / APPROVED core/03 §§3–4 establish exact species rates and Standard Overnight plus distinct daytime services; logic/38 §§3,5–8 establish actual mixed composition, component pricing and separate service units; logic/20 §§1–3 and Website Implementation Notes / Midday Care preserve Standard Overnight scope and explicit separate coverage; logic/18 Automated Acceptance vs. Review / Review Trigger Privacy and logic/33 §2 / Website Implementation Notes require conservative review and private reasons. No material approved-source conflict or new business-policy decision was found. CARE-01 remains intact. The complete original Phase 12G audit and applicable orchestration, Git, testing, privacy, integration, resources, accessibility, time, diagnostics and filesystem contracts were reviewed.

The version 2 handoff serializes bounded dog/cat/broad-other counts, explicit selected windows (including empty), explicit Overnight choice, duration and one opaque review flag. It contains no safety answers, reasons, care limits or free text. Required review stays session-limited with existing planning state, survives API processing, and suppresses all monetary components through nullable result fields. Reset clears the scoped state and handoff query. A new handoff replaces old service/windows/add-on while preserving an unrelated valid ZIP/tier; a location-only query cannot clear an existing review. No analytics schema or logging payload was expanded.

Known broad types remain exact. Legacy unambiguous Dog/Cat/broad-other counts remain known but conservatively reviewed because old links carry no review status. Legacy mixed/unknown aggregates and malformed counts remain incomplete, without a fabricated roster, default pet or price. Counts exceeding the eight-pet estimator limit preserve the three original broad counts in the incomplete display; they do not truncate into an automatic price. Integer normalization fixes fractional producer input, while the parser rejects nonintegral counts safely (the negligible shared parser root cause of 12G-FUNC-01).

An unambiguous separate 30/60/90-minute midday selection maps to its appropriate separate service. Multiple selected windows or possible overlap stay visible in the form, result, copy and print; automatic money is suppressed until review. The Standard Overnight service remains selected. The imported duration/windows also drive the summary gap; unrelated direct/saved estimator windows retain their existing behavior. Imported selections are adjusted through CarePlanner; clearing or explicitly choosing a different service starts an adjusted selection.

| Finding | Direct regression and acceptance evidence |
| --- | --- |
| CARE-02 | Actual original one-dog complex-medication/aggression/two-hour-limit/windows 0/2 scenario assesses consultation; handoff/API/session retain opaque review, monetary fields are null, no $60, copy and print say Personalized review required without private reasons. |
| XF-01 | Standard dog Overnight + one 30-minute 12–3 PM visit totals $110 ($85 + $25), exactly one add-on; 60/90-minute alternatives total $133/$151; two dogs + cat applies separate additional-pet fees on both services, $140. Multiple/overlapping windows preserve all selected coverage with null prices. Browser/session/copy/print retain midday coverage and correct 6.5-hour summary gap. |
| XF-02 | Two dogs + cat remains dog/dog/cat, $45 per 30-minute visit ($90 for two selected windows). Cat + broad other remains cat/small, $33 per visit ($66 for two windows), with appropriate existing scope review. No dog or specific unusual species is invented. Legacy mixed links remain incomplete across restoration. |
| XF-03 | Actual UI-saved Overnight walk90 is overridden by a new Planner Overnight with empty windows; saved midpoint is none, windows empty, ZIP/Standard tier preserved and total $85 rather than $153, including restoration. API derives the explicit selection even if an incompatible walk90 is supplied. |

Owning regressions: `tests/planner-handoff.test.ts` adds seven Node tests; `e2e/planner-handoff.spec.ts` adds six browser tests. Existing two legacy parser tests and the unknown-household test were replaced in place with stronger no-invention/incomplete contracts. No test was removed and no assertion, timeout, retry or check was weakened. One existing positive-subtotal assertion gained an explicit non-null guard to match the stronger nullable result type.

## Validation iterations

- Initial direct production-module reproductions confirmed CARE-02 ordinary $60/review false; XF-01 $85 with lost selected midpoint; XF-02 manufactured dog/cat/small at $40 and dog/cat at $35. Existing saved-state merge read confirmed XF-03's injected saved midpoint.
- Initial focused Node selection: 49/50. The new composition fixture used one flexible daily window whose worst-case gap exceeds its entered limit; corrected the fixture to two windows, asserted the exact per-visit amount and complete total, and retained the review boundary. Corrected focused run: **50/50**, no skips/failures.
- Typecheck initially identified one existing test's newly nullable subtotal access; added the explicit non-null assertion. Subsequent typecheck PASS. Lint PASS, zero errors/warnings.
- First focused browser build/run: **2 passed / 4 failed**. Two numeric routes exposed an accidental lost currency symbol in a replacement-string edit; fixed money formatting. The other two failures used an exact label-text selector that included nested option text; switched to the observed native combobox role/name while retaining exact roster counts/values. These were deterministic iteration failures, not flaky tests; no retries/timeouts were added.
- Corrected build and focused browser run: **6/6 passed**, 49.4 seconds. Same-scope follow-up strengthened the Overnight summary-gap assertion and incomplete household/reset/location boundaries for final full validation.
- Initial foundation scan flagged the duplicated non-secret session-storage key constant in the new browser test. Reused the existing exported PLANNING_KEY constant; no detector suppression or scanner change.
- First full gate stopped at 179/180 Node tests: an existing source-contract test required the explicit toString() in the Planner href. Restored that equivalent string conversion without changing the test; focused Phase 12F plus handoff tests passed 14/14, then the full gate was rerun.
- Final doctor PASS; Git safety PASS with only the existing 1.75 MiB OG and 2.74 MiB Loki asset warnings. Final foundation and full validation passed as recorded below.

## Final completion gates

- Final source commit: use this RUN's containing Git commit, reported to parent after creation.
- `npm run doctor`: PASS with Node 22.17.1, npm 10.9.2, Chromium 1.62.1, Gitleaks 8.30.0 and both development/test ports available before the gate.
- `npm run check:git-safety`: PASS; protected checkout untouched, no destructive Git operations.
- `npm run check:foundation`: PASS, including resource footprint and current secret scan with zero findings.
- `npm run validate:full`: PASS, exit 0. **180/180 Node tests**, **41/41 Playwright tests** (including all 15 accessibility cases), zero failures/skips. Typecheck, lint, production build, current secret scan and build-artifact checks passed; artifact **178 files / 10.36 MiB**, no generated private/test artifacts. Playwright completed in 2.1 minutes. Port 3100 was released after completion.
- Expected warnings only: five existing optional/WASM extraneous packages, existing 1.75 MiB OG and 2.74 MiB Loki assets, Node experimental type stripping, informational Vinext route classification, and NO_COLOR/FORCE_COLOR. No dependency changes or new production warnings.
- `git diff --check`: PASS during iteration and final scope review; exact owned paths plus the two parent-owned documents are staged and reviewed before commit.
- Independent review, exact-head hosted Validation, integration and final 12G reconciliation remain parent-owned; no worker push, merge or deployment.

Final changed paths: `app/QuoteEstimator.tsx`, `app/api/estimate/route.ts`, `app/lib/estimate-types.ts`, `app/lib/estimate.ts`, `app/lib/planner-prefill.ts`, `app/lib/planning-state.ts`, `app/plan/CarePlanner.tsx`, `tests/business-rules.test.ts`, `tests/feature-completion.test.ts`, `tests/planner-handoff.test.ts`, `e2e/planner-handoff.spec.ts`, and this RUN. Parent-owned `docs/codex/PROJECT_STATUS.md` and `docs/business-reference/guidance/website-publication-approvals.md` are included unchanged by the worker.

Remaining limits: unsupported multiple/possibly overlapping imported Overnight daytime selections and incomplete/ambiguous households intentionally require personalized review without an automatic price. Legacy links cannot recover safety review provenance or missing composition and therefore stay conservative. This correction does not resolve other Phase 12G findings or declare release GO.

## Parent integration receipt

Source `9afdcad2e0353e0aba8965bb1c061ea7db26aace` was independently APPROVED by fresh read-only native `/root/handoff_review`, with no REQUIRED findings. Independent doctor/Git/diff checks, 75 targeted Node cases (including CARE-01), and 102 additional boundary checks passed. [PR #11](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/pull/11) exact-source hosted [Validation 34478563351](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/actions/runs/34478563351) passed with 180 Node and 41 Playwright tests, no test skips/failures.

Normal no-ff merge `303be467db21040881449c6a799b1d61935b7c25` has parents `43553cbeb91bd7784eaf9232561247a267e42c82` and the reviewed source. Tree `46bd09a52ebc7a31a0e1f8c147c49789e3ff1f1d` exactly matches the reviewed source and conflict-free merge simulation. Merged local doctor/full gate passed 180 Node / 41 Playwright (15 accessibility), typecheck/lint/build/secrets/artifact, exit 0; clean checkout verified. Pushed normally to `github/main`; PR #11 is MERGED. Hosted exact-main [Validation 34479764616](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/actions/runs/34479764616) SUCCESS. CARE-02 / XF-01 / XF-02 / XF-03 are COMPLETE with their separate direct evidence above; overall application remains NO-GO for the other P1s and fresh integrated audit.

Optional reviewer note: malformed string/null window arrays can be filtered to a subset/empty before API or restored-state coverage validation. Current producers emit numeric arrays and no ordinary-user P1 path was demonstrated; DEFENSE_IN_DEPTH only. Retain in backlog or address only if negligible within the same restoration validation surface. This does not expand unrelated remediation or declare application GO.
