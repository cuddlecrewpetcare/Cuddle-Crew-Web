# 12G-CARE-01 — CarePlanner four-or-more-dog review boundary

## Assignment and recovery receipt

- **WORK_ITEM:** `12G-CARE-01`
- **STATUS:** `IN_PROGRESS`
- **OWNER:** `CC — ORCHESTRATOR` (one-time fallback after one bounded fresh-Implementer provisioning retry produced no canonical task ID: `IMPLEMENTER_PROVISIONING_UNAVAILABLE`)
- **BASE_SHA:** `eed9ff275078d0e9a824bec984952a30028c1224`
- **BRANCH / WORKTREE:** `codex/12g-care-01-orchestrator-eed9` / `C:\Dev\CuddleCrewPetCareWEB-worktrees\12g-care-01-orchestrator-eed9`
- **MODEL / REASONING / DESIRED_SPEED:** current Orchestrator context / sufficient for this narrow demonstrated patch / economical-normal; **ACTUAL_SPEED:** `UNKNOWN`.
- **WRITE_SCOPE:** `app/lib/care-planner.ts`, `tests/care-planner.test.ts`, and this required durable receipt.
- **FORBIDDEN_WRITE_SCOPE:** unrelated pricing, eligibility, Phase 12G or 12H work, workflows/settings, dependencies, providers/production, Business Truth sources, and every preserved stopped-pilot artifact.

## Business Truth

`docs/business-reference/logic/33-custom-quote-scope-review.md` is **CURRENT / APPROVED**. Sections 2–3 require four or more dogs to stop automatic quoting and complete personalized review. This is a review trigger, not an automatic decline; normal additional-dog pricing alone cannot make the scope workable. Public output should be neutral (`Personalized review required`) and must not expose the trigger or private rationale. `BUSINESS_TRUTH_CONFIRMED`; no conflict found.

## Acceptance, validation, and handoff

Three dogs retain the ordinary path absent other triggers. Four and more dogs require the same neutral review boundary, without a price/surcharge or automatic-decline behavior. Required evidence: focused CarePlanner regression test, `npm run test`, typecheck, lint, secret scan, `npm run validate:full`, exact final SHA, and same-repository hosted Validation for that SHA. Fresh independent review remains mandatory; no merge or deployment is authorized. Native routing/ACK is PARTIAL, so this record is the complete fallback and preserves base, ownership, scope, validation, CI, review, and recovery state.
