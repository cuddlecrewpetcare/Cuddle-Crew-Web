# Native subagent routing repair — 2026-09-09

WORK_ITEM: `CC-NATIVE-SUBAGENT-ROUTING`
STATUS: READY_FOR_REVIEW
BASE_SHA: `44f380b3fb9d2700611b4f24c81e4a9304828490` (`github/main`, fetched and matched to `git ls-remote`)
BRANCH: `codex/native-subagent-repair-20260909`
WORKTREE: `C:\Dev\CuddleCrewPetCareWEB-worktrees\native-subagent-repair-20260909`
OWNER: CC — ORCHESTRATOR, one bounded control-plane writer
PARENT_RUNTIME_IDENTITY: `01a084d6-48eb-7021-9b82-52794a24f388`
WRITE_SCOPE: `docs/codex/ORCHESTRATION.md`, `docs/codex/TEMPLATES.md`, `docs/codex/PROJECT_STATUS.md`, this RUN
FORBIDDEN_WRITE_SCOPE: all product/application/business-reference/policy files; CarePlanner; estimator; dependencies/lockfiles; workflows/settings; providers; deployment; preserved worktrees and recovery state.

## Problem and root cause

The previous default treated successful provisioning of a fresh separate top-level Codex task, followed by a returned canonical top-level task ID, as a prerequisite for a bounded Implementer. The bounded top-level task provisioning path repeatedly produced no canonical ID and therefore no recognized writer, recorded as `IMPLEMENTER_PROVISIONING_UNAVAILABLE`. The failure was transport/provisioning friction, not an implementation-capability or business-authority failure; no duplicate worker or repository mutation resulted.

The repair makes native Codex subagent execution the default bounded route. A separate top-level task remains optional when a persistent physical conversation is intentionally valuable and the platform reliably exposes it. RUN evidence remains the durable assignment/recovery mechanism, but does not claim to have provisioned a missing worker.

## Current capability evidence

- Installed CLI: `codex-cli 0.153.4`.
- Effective CLI feature list: `multi_agent` is `stable` and `true`.
- Official current Codex documentation reports that local Codex enables subagent workflows by default, includes `default`, `worker`, and `explorer` built-ins, supports project custom agents under `.codex/agents/`, and exposes `[agents]` defaults/concurrency controls. The native interface can inherit the parent sandbox; custom roles can declare read-only sandboxes. Source: [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
- Current project configuration has no `.codex/agents/` directory. No custom role was added: the built-ins plus explicit bounded assignment are sufficient, and the exposed native spawn interface does not expose an enforceable named-role selector. Creating inert duplicate configuration would add maintenance without a control benefit.
- Current parent configuration surfaced `gpt-5.6-sol` / high and `workspace-write`; this repair used the lower-cost `gpt-5.6-luna` / low configuration for the deterministic read-only probes. `ACTUAL_SPEED: UNKNOWN` because the exposed interface provides no speed readback/control.
- The active collaborative runtime exposes four total concurrent agent slots (parent included); no repository-specific concurrency override was found. Treat that as a ceiling, not a target: one write-heavy owner remains mandatory.
- The native test contexts inherited the parent workspace boundary. For future writers, the Orchestrator must create and verify the isolated worktree before dispatch and bind the subagent to that path; native spawning alone does not provide Git isolation. Reviewers use read-only context where the interface supports it.

## Harmless capability tests

Canonical dirty checkout baseline before and after both tests was unchanged: its existing tracked/untracked state remained untouched; `github/main` remained `44f380b3fb9d2700611b4f24c81e4a9304828490`.

| Test | Parent | Returned native runtime identity | Configuration | Assignment | Result | Mutation check |
| --- | --- | --- | --- | --- | --- | --- |
| Implementer-style capability probe | `01a084d6-48eb-7021-9b82-52794a24f388` | `/root/native_subagent_probe` | Luna / low; read-only assignment | Read `github/main` SHA and AGENTS.md only | `STATUS: COMPLETE`; SHA matched `44f380b3…`; `MUTATIONS: NONE` | PASS |
| Independent Reviewer-style probe | `01a084d6-48eb-7021-9b82-52794a24f388` | `/root/native_reviewer_probe` | Luna / low; fresh context; read-only assignment | Inspect only committed `github/main:docs/codex/RUNS/12G-CARE-01.md` for its work-item/status records | `RUNTIME_REVIEW: PASS`; `MUTATIONS: NONE` | PASS |

The returned identities are native runtime identifiers for these bounded subagents, not top-level task IDs. The probes prove creation and result return for this route only; they do not upgrade the historical top-level task-message ACK result, which remains PARTIAL.

## Corrected execution and fallback order

1. Verify current `github/main`, create a clean isolated branch/worktree, then spawn one fresh native implementation subagent (the built-in `worker` when role selection is exposed; otherwise an explicitly bounded implementation subagent).
2. Record the returned runtime identity, owner, base, branch/worktree, scope, approved authority, validation, and compact receipt in the work item's RUN.
3. For meaningful/high-risk work, spawn a fresh independent read-only Reviewer subagent on the exact SHA/diff. It receives intent, Business Truth and validation evidence, not the Implementer's conclusion.
4. Use deterministic checks first; use low-cost bounded read-only subagents for Business Truth or Sentinel only where interpretation adds value.
5. Use a top-level Codex task only when intentionally requested/valuable. Make at most one bounded provisioning attempt. If it fails and native subagents are available, use the native route immediately.
6. If native subagents are genuinely unavailable, use the standing eligible isolated parent-writer fallback. If neither route is safe, return `IMPLEMENTER_PROVISIONING_UNAVAILABLE` or `PLATFORM_APPROVAL_STALL`; do not blind-retry or create duplicate ownership.

No Agent Talk, third-party broker, queue, database, daemon, scheduler, Redis, RabbitMQ, Postgres, or custom agent server was added. `agent-talk: EVALUATE LATER` remains a future evidence-based evaluation only.

## Preservation and product state

The canonical local checkout remains stale/dirty at `3b443a6dcafb0cb3f4ed4129714d357e3e059816` and was not reset, cleaned, staged, restored, stashed, absorbed, or otherwise changed. The historical stopped `12G-CARE-01` task/worktree and recovery evidence were not touched. `12G-CARE-01` remains COMPLETE. `12G-CARE-02`, `12G-XF-01`, `12G-XF-02`, and `12G-XF-03` were not started, modified, tested as continuation, or reassigned. No product behavior, Business Truth, pricing, policy, CI workflow/settings, dependency, provider, deployment, or production data changed.

## Remaining limits and next gate

- Top-level Codex task creation/routing and recipient-visible ACK remain PARTIAL/unreliable; native subagent result return is the preferred route for bounded work.
- The exposed native spawn interface returns a runtime identity but does not expose a named built-in-role selector or authoritative desired-speed setter/readback. Record `ACTUAL_SPEED: UNKNOWN`; use the assignment brief and returned identity rather than inventing fields.
- Native subagents share the parent filesystem boundary. The Orchestrator must enforce the isolated worktree path and one-writer rule; a spawn is not automatic worktree isolation.
- Current project has no custom-agent files; revisit only if a future runtime interface makes a project role enforceable and it materially reduces coordination risk.
- This repair requires normal independent review, exact-SHA Validation, and separately authorized no-ff integration. It does not authorize product work.

## Local validation

All commands ran in the isolated repair worktree after the repository's declared `npm run setup:local` restored locked dependencies and the existing Playwright Chromium. No manifest or lockfile changed.

- `npm run doctor` — PASS; local environment READY.
- `npm run check:git-safety` — PASS; expected four documentation/RUN paths only, lockfile unchanged. Existing reviewed large-asset warnings remained.
- `npm run check:foundation` — PASS; secret scan 0 findings. Existing optional/WASM-package and reviewed large-asset warnings remained.
- `git diff --check` — PASS.
- `npm run validate:full` — PASS: 173 Node tests, typecheck, lint, build/artifact checks, and 35 Playwright tests. Existing optional/WASM-package, Node experimental type-stripping, runtime route-classification, color-environment, and reviewed large-asset warnings remained; no failure was suppressed or reclassified.
- Harmless native subagent capability and independent Reviewer-style probes — PASS; no repository mutation.

After normal review and integration of this control-plane repair, the first production development task through the repaired pathway is `12G-CARE-02 + 12G-XF-01 + 12G-XF-02 + 12G-XF-03`.
