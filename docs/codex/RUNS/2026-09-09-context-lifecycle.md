# Context-window and role-lifecycle addendum — 2026-09-09

WORK_ITEM: `CC-CONTEXT-LIFECYCLE`. OWNER / integration owner: task `01a0857e-dc68-7c50-8ba6-68f46e64f680`. BASE_SHA: `63b216edad4fb51d25d1c7b407b7fd54d6b23c10`, verified by `git ls-remote` and GitHub API on 2026-09-09. BRANCH: `codex/context-lifecycle-integration-20260909`; isolated worktree, discover with Git. STATUS: IN_REVIEW at commit time; final exact SHA, CI, independent review and no-ff merge receipts belong to this branch's GitHub PR. Resolve the containing commit through Git history; never commit only to embed its own SHA.

WHY_THIS_EXISTS: persistent logical roles must survive finite or degraded physical-task context. USER_INTENT: one bounded control-plane improvement without product execution or role churn. TECHNICAL_OBJECTIVE: integrate only context-lifecycle gaps in coverage 147–192. WRITE_SCOPE: ORCHESTRATION, TEMPLATES, PROJECT_STATUS and this RUN. FORBIDDEN_WRITE_SCOPE: application, business references, pilot worktree, workflows, dependencies, providers, GitHub settings and deployment.

## Verified base and preserved scope

GitHub `main` was exactly `63b216edad4fb51d25d1c7b407b7fd54d6b23c10`, the normal merge commit for [PR #6](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/pull/6). PR exact-head Validation [34332752796](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/actions/runs/34332752796) passed for `63682499281ee3a2390ed35c26bb1bb75541b3d9`; resulting-main Validation [34333527142](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/actions/runs/34333527142) passed. Existing completed independent review/merge/local evidence was accepted without reopening coverage 1–146.

The shared checkout remains intentionally stale/dirty at `3b443a6dcafb0cb3f4ed4129714d357e3e059816` and was not modified. Pilot `codex/12g-care-01` remains STOPPED and unarchived at `79153d2e101374b136a79a2c3ac644bcd5bd91b0`, with only staged `app/lib/care-planner.ts` (1 insertion) and `tests/care-planner.test.ts` (10 insertions). Pre-change staged-diff Git object fingerprint: `fa2f9936161f85fa9fba1b7a78fdbbd77b289790`. No pilot test, edit, stage, commit, push, reassignment, archive or execution occurred.

This is not business-behavior work, so the mandatory business-rule preflight was not triggered and no business source was used to derive policy. Existing hierarchy and approved-source requirements remain unchanged. No new framework, agent-talk, tmux, queue, database or provider/security setting was introduced. Deployment: NO.

## Gap audit and integration

The existing system already preserved Git/RUN evidence, task-ID routing, archive/worktree precautions, fresh bounded Implementers/reviewers and adaptive model/effort/speed. The material gap was its statement that the four roles were persistent chats, plus no compact end-to-end physical-role succession procedure. The integration now defines project versus working memory, evidence-driven rotation, cost/benefit and context-versus-capability decisions, safe checkpoint/succession/routing/retirement/crash recovery, role-specific lifecycle behavior and bounded templates. AGENTS already maps these controls and needed no edit.

Official OpenAI [model guidance](https://developers.openai.com/api/docs/guides/latest-model) confirms that compaction and configuration changes are available context-management techniques. Project policy is intentionally stricter: summaries and task state remain convenient working context, while critical project facts are revalidated from durable project evidence. New platform primitives may simplify this workaround only after capability detection and separate evidence.

## Current logical-role pointer and rotation decision

Native discovery revalidated these IDs on 2026-09-09. IDs are runtime evidence, not eternal identity. Unsuffixed tasks are conceptual generation 01.

| Logical role / physical task | Task ID | Generation | Canonical state | Rotation recommended | Evidence |
| --- | --- | --- | --- | --- | --- |
| CC — ORCHESTRATOR | `01a084d6-48eb-7021-9b82-52794a24f388` | 01 | ACTIVE / IDLE | NO | Pinned, exact name/ID present; no saturation, contradiction or reliability evidence |
| CC — REVIEWER | `01a084fa-7060-7de0-bf50-bec69bac0979` | 01 | ACTIVE / IDLE | NO | Healthy reusable entry; fresh bounded review remains the independence path |
| CC — SENTINEL | `01a084fa-fcd3-7503-917f-695c16f922d2` | 01 | ACTIVE / NOT LOADED | NO | Present and deterministic; little historical-context dependence |
| CC — BUSINESS TRUTH | `01a084fb-0c68-7d71-927a-3398de0b0854` | 01 | ACTIVE / NOT LOADED | NO | Present; approved repository sources, not conversation, remain authority |

No successor was created, no role was renamed/reconfigured and no ACK experiment was needed. Native messaging remains PARTIAL. The stopped pilot task is not a persistent logical role and remains outside this pointer.

## Coverage 147–192

O = [ORCHESTRATION](../ORCHESTRATION.md#role-context-lifecycle); T = [TEMPLATES](../TEMPLATES.md#role-rotation-and-succession); S = [PROJECT_STATUS](../PROJECT_STATUS.md#current-logical-role-pointer). IMPLEMENTED means the operational rule and recovery path exist; it does not claim an unnecessary rotation was performed. **45 IMPLEMENTED / 1 PARTIAL / 0 MISSING / 0 UNSUPPORTED / 0 NOT_APPLICABLE**.

| ID | Principle | Status | Concise evidence |
| --- | --- | --- | --- |
| 147 | Logical role vs physical task | IMPLEMENTED | O opening/lifecycle: project-long role, replaceable task. |
| 148 | Durable project memory | IMPLEMENTED | O: Git/docs/PR/CI/RUN/business/project sources. |
| 149 | Working-memory distinction | IMPLEMENTED | O: task reasoning/context is temporary. |
| 150 | Context-rotation triggers | IMPLEMENTED | O: saturation, compaction, staleness, noise, contradiction, friction, cost, degradation, transition. |
| 151 | Evidence-based threshold | IMPLEMENTED | O: no age/count/cadence; benefit must exceed handoff cost. |
| 152 | Rotation recommendation event | IMPLEMENTED | T: full `ROLE_ROTATION_RECOMMENDED` fields. |
| 153 | Safe rotation point | IMPLEMENTED | O: idle/between items after state and Git/CI reconcile; checkpoint sensitive work. |
| 154 | Pre-rotation checkpoint | IMPLEMENTED | O/T: required SHA/owner/task/CI/review/truth/blocker/decision/next fields. |
| 155 | Active worker preservation | IMPLEMENTED | O: worker ownership, worktree, receipts and validation survive Orchestrator succession. |
| 156 | Successor generation naming | IMPLEMENTED | O: unsuffixed = 01; first real successor `— 02`; no retrofit. |
| 157 | One active physical task | IMPLEMENTED | O/T: brief overlap only; `DUPLICATE_LOGICAL_ROLE_DETECTED`. |
| 158 | Role succession record | IMPLEMENTED | T: concise predecessor/successor/reason/checkpoint/routing/date record. |
| 159 | Successor minimal initialization | IMPLEMENTED | O/T: role-specific durable sources; only relevant current RUNs/sources. |
| 160 | No full-transcript migration | IMPLEMENTED | O/T: facts/references only; transcripts prohibited. |
| 161 | Predecessor receipt | IMPLEMENTED | T: concise receipt; evidence/navigation only. |
| 162 | Successor reconciliation test | IMPLEMENTED | O/T: independently answer ten current-state questions. |
| 163 | Task-ID routing handoff | PARTIAL | O/T/S: record/test ID, route-specific ACK, pointer and RUN fallback; platform delivery/durability remains unguaranteed. |
| 164 | Predecessor retirement | IMPLEMENTED | O/T: retire only after state/routing verification; preserve history. |
| 165 | Archive/worktree preservation | IMPLEMENTED | O/T: status/diff/index/blob/recovery capture before archive. |
| 166 | Reviewer lifecycle | IMPLEMENTED | O: persistent entry plus fresh bounded important reviews. |
| 167 | Sentinel lifecycle | IMPLEMENTED | O: deterministic reconstruction; cheap replacement when stale. |
| 168 | Business Truth lifecycle | IMPLEMENTED | O: re-read hierarchy/CURRENT sources; no remembered policy authority. |
| 169 | Implementer disposability | IMPLEMENTED | O: one bounded item, receipt, review, retirement. |
| 170 | Implementer succession | IMPLEMENTED | O/T: `IMPLEMENTER_HANDOFF_REQUIRED`, checkpoint and one owner. |
| 171 | Context vs model problem | IMPLEMENTED | O: separate diagnosis paths. |
| 172 | Rotate before escalation | IMPLEMENTED | O: fresh same-capability context first for noisy/buried constraints. |
| 173 | Combined rotate/escalate | IMPLEMENTED | O/T: separate rotation and configuration-escalation reasons. |
| 174 | Periodic context-quality check | IMPLEMENTED | O: infrequent milestone/degradation checks across five qualities. |
| 175 | Rotation cost/benefit gate | IMPLEMENTED | O/T: qualitative LOW/MEDIUM/HIGH balance. |
| 176 | Role continuity without conversation | IMPLEMENTED | O: continuity rests on project evidence, not transcript. |
| 177 | Minimum durable-state test | IMPLEMENTED | O: disappearance test and required recoverable fields. |
| 178 | Crash-only recovery | IMPLEMENTED | O/T: receipt optional; Git/GitHub/status/RUN/task/source reconstruction. |
| 179 | Compaction caution | IMPLEMENTED | O: summaries cannot solely prove critical state. |
| 180 | Chat-only decision guard | IMPLEMENTED | O: promote future-governing authorized decisions to existing durable mechanisms. |
| 181 | Context opportunity | IMPLEMENTED | O: `CONTEXT_ROTATION_OPPORTUNITY`; discovery does not authorize churn. |
| 182 | New context capability | IMPLEMENTED | O: `NEW_CONTEXT_MANAGEMENT_CAPABILITY` and simplification review. |
| 183 | No chat-count cadence | IMPLEMENTED | O: age/turn/count/generation cadence forbidden as trigger alone. |
| 184 | Historical-role lookup | IMPLEMENTED | O: searchable audit fallback; durable sources first. |
| 185 | Current role pointer | IMPLEMENTED | S/RUN: one lightweight generation/status/ID table with runtime caveat. |
| 186 | Milestone consideration | IMPLEMENTED | O: major transitions invite assessment, not automatic rotation. |
| 187 | Pre-launch freshness check | IMPLEMENTED | O: assess before high-stakes comprehensiveness audit. |
| 188 | Post-launch mode transition | IMPLEMENTED | O: BUILD to OPERATIONS/IMPROVEMENT future consideration. |
| 189 | Knowledge promotion | IMPLEMENTED | O: persist only genuinely reusable lessons in existing source/test/template/RUN. |
| 190 | Semantic handoff quality | IMPLEMENTED | O/T: bootstrap retains purpose, authority, blockers, decisions and next action. |
| 191 | Handoff fact validation | IMPLEMENTED | O/T: successor checks critical facts against durable evidence. |
| 192 | No product authority | IMPLEMENTED | O/RUN: rotation/handoff cannot start pilot, product, deploy or provider work. |

**163 — REASON:** current tools support task IDs and route-specific sends/ACKs but do not guarantee cross-lifecycle ID durability or end-to-end delivery. **ACTION:** require ID revalidation, safe routing test, route-specific ACK where available, current-role pointer, idempotent identity and complete RUN fallback. **REMAINING_LIMITATION:** native messaging/ACK remains PARTIAL until platform evidence establishes stronger behavior; no external messaging infrastructure was authorized.

## Resource policy, recovery and pilot effect

Context degradation and model insufficiency are now separate diagnoses. Rules support fresh same-model context before unnecessary escalation, and fresh stronger-model context when both context and reasoning capability warrant it, with two separate reasons. Rotation cost and context benefit are qualitative to avoid a new quota database.

Minimum durable-state test result for this checkpoint: YES. A fresh Orchestrator can recover main, application NO-GO/current authorization, this control-plane item, owner/branch, PR/CI/review gate, preserved pilot, business blockers and next action from PROJECT_STATUS, this RUN, Git/GitHub and existing phase sources. Crash-only recovery does not require this task's transcript.

12G-CARE-01 remains stopped and unchanged. Lifecycle rules do not materially change its recommended process: if later authorized, existing one-item/one-fresh-Implementer, Business Truth, isolated worktree, exact-SHA CI and independent review remain controlling. No execution is authorized here.

No new high-value recommendation was found beyond the now-implemented bounded lifecycle gap. Existing GitHub-security and external-infrastructure recommendations remain out of scope and unchanged.

## Validation and closure

Required: inspect the full four-path allowlist/diff; doctor, Git safety, link/coverage checks, secret scan and full branch validation; same-repository PR exact-head Validation; fresh independent SHA-bound review; normal no-ff integration with merge validation; explicit GitHub main push; resulting-main CI and post-merge local validation. Deployment remains NO. Final report must recheck the pilot fingerprint and GitHub main rather than trusting this commit-time record.

Local branch validation passed after pinned setup: doctor; full four-path staged diff/check; Git, supply-chain, integration, resource, cross-platform, time, deployment and recovery guards; secret scan with 0 findings; 172 Node tests; typecheck; lint; build/artifact safety; and 35 Playwright tests. Existing reviewed-asset, optional/WASM package, Node type-stripping, Vinext classification and color-environment warnings remain visible. Setup reported 12 dependency advisories; no manifest/lockfile change or audit-fix was authorized or performed.

Rollback: preserve the branch/PR and use a separately authorized focused revert if needed. This addendum itself authorizes no future role rotation or product work. Completion target: PROJECT_COMPLETE_FOR_CURRENT_SCOPE; application remains NO-GO.
