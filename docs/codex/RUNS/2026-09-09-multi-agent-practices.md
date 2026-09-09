# Multi-agent practices addendum — 2026-09-09

WORK_ITEM: CC-MULTI-AGENT-PRACTICES. OWNER / integration owner: task `01a0855c-b73f-7883-a0ea-5949878b949f`. BASE_SHA: `77bf76acfaa898735a8b901a3729578dad3e96c2`, verified by GitHub remote read on 2026-09-09. BRANCH: `codex/multi-agent-practices`; discover its isolated worktree with Git. STATUS: IN_REVIEW at commit-time; final exact SHA, CI, independent review and no-ff merge receipts belong to this branch's GitHub PR. Resolve containing commit through Git history; never commit merely to embed its own SHA.

WHY_THIS_EXISTS: useful multi-agent practices should reduce coordination cost without expanding the completed control plane. USER_INTENT: one bounded additive documentation pass. SUCCESS_FROM_LAURENS_PERSPECTIVE: one understandable control point, purpose-rich workers, safe isolation, compact evidence, honest limitations and a stopped preserved pilot. TECHNICAL_OBJECTIVE: integrate only gaps in coverage 107–146.

AUTHORIZED_SCOPE / WRITE_SCOPE: AGENTS.md, docs/codex/ORCHESTRATION.md, TEMPLATES.md, PROJECT_STATUS.md and this RUN. READ_SCOPE: current project contracts, approved hierarchy, historical closure/routing evidence and relevant primary research. FORBIDDEN_WRITE_SCOPE / MUST_NOT: application/business references, pilot/canonical recovered state, historical RUNs, workflows, manifests/lockfile, provider/production/security settings; no pilot/12H/deployment, role recreation or agent infrastructure. DEPENDENCIES: completed PR #5; acceptance and existing validation/review gates before integration. EXPECTED_OUTPUT: bounded diff, coverage and SHA-bound receipts. REPORT_BACK_TO: this task, PR and Lauren; persistent Orchestrator remains the later control point.

## Preserved baseline and audit decisions

Reconciliation is complete: [PR #5](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/pull/5), final source `69e54d92e8ed7e53404841d13bc1e4aab08dc1d1`, resulting main `77bf76acfaa898735a8b901a3729578dad3e96c2`. Its exact-head CI, fresh fallback approval with zero findings, post-merge CI and 172 Node / 35 Playwright baseline remain completed evidence. Historical coverage 1–106 stays **98 IMPLEMENTED / 8 PARTIAL / 0 MISSING**; [original RUN](2026-09-09-reconciliation.md) is unchanged.

Existing ownership, adaptive model/effort/speed, worktree caution, CI/review, durable recovery and improvement policies already satisfy substantial portions of this addendum. Changes extend their existing sections, not a second system. AGENTS previously repeated detailed engineering contracts (over 60,000 characters); it now maps mandatory existing contracts and retains universal preflight/authority/privacy/safety/execution rules. No business rule was changed. Business sources used: [README](../../business-reference/README.md) and [CURRENT / APPROVED hierarchy](../../business-reference/guidance/source-of-truth-document-hierarchy.md); no service-specific implementation decision was made.

Canonical local main remains stale/dirty at `3b443a6dcafb0cb3f4ed4129714d357e3e059816`. Pilot `codex/12g-care-01` remains STOPPED, unarchived, at `79153d2e101374b136a79a2c3ac644bcd5bd91b0`; no pilot tests or writes. Read-only before/after fingerprints cover HEAD, index bytes, tracked-file bytes, staged/unstaged diff and status. Before-state SHA-256: pilot index `43c02dd53a3cba340c23f71a634c4776067cce6d3774d3b48952238c4ed774e3`; tracked manifest `2f417ed85d938a935cbaf9d3d2bb41624461269c6bff3a5bdcc33aac1c2abda0`; staged diff `a65300b9782ed23cd27ba65e2a17e0ec8f24a84ef1e02abec8ec04e731b9c6e9`. Final equality belongs to the closure receipt. Generated .codex state/full platform snapshot remain unverified; no broader preservation claim.

The four persistent role IDs remain those in the [existing routing record](2026-09-09-reconciliation.md#runtime-role-routing). No recreation/reconfiguration/assignment or ACK experiment was needed. Native task delivery remains PARTIAL; subagent success cannot upgrade it.

## Research evidence and application

Sources opened 2026-09-09. These are evidence/inspiration; Lauren's instruction authorizes the project rules. No community code, daemon, hook or infrastructure was installed. Platform docs describe capabilities, not proof every exposed tool/account supports them.

| Evidence type | Source | Narrow lesson / limit |
| --- | --- | --- |
| OFFICIAL_CURRENT_PLATFORM_BEHAVIOR | [OpenAI subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | Separate noisy exploration from planner context; summaries and custom roles can help; extra workers consume extra tokens. Detect actual tool support before dispatch. |
| OFFICIAL_CURRENT_PLATFORM_BEHAVIOR | [OpenAI worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees) | Separate working copies support parallel work but share Git metadata; isolation does not transfer integration ownership. |
| OFFICIAL_CURRENT_PLATFORM_BEHAVIOR | [OpenAI AGENTS guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | Instruction discovery/size limits make concise mapped guidance useful; documentation's default cap is not a measurement of this desktop session. |
| COMMUNITY_PRACTICE | [Codex Workers for Claude architecture](https://github.com/todorkolev/codex-workers-for-claude/blob/main/docs/architecture.md) | Isolated writer worktrees and compact artifacts are useful patterns. Do not adopt its bridge, raw-event retention or claims of unlimited workers. |
| ANECDOTAL_REPORT | [Codex discussion #3898](https://github.com/openai/codex/discussions/3898) | Planner/worker proposal includes context files, write roots and dependencies. Unanswered design discussion does not prove a queue, API or approval mode is supported/safe. |
| ANECDOTAL_REPORT | [Codex issue #12047](https://github.com/openai/codex/issues/12047) | Named-agent/inbox/mention proposals illustrate demand; a feature request does not establish runtime behavior. |
| PROJECT_EMPIRICAL_EVIDENCE | [Completed reconciliation runtime/recovery evidence](2026-09-09-reconciliation.md) | Partial ACK and archival cleanup justify existing durable fallback and preservation caution; no new global delivery guarantee. |

The promotion ladder and experimental adoption gate are project rules explicitly requested here, not attributed to a platform feature. New practices are available controls; the pass does not claim Best-of-N, spikes or future workflow trials have demonstrated project benefit.

## Coverage 107–146

O = [ORCHESTRATION](../ORCHESTRATION.md); T = [TEMPLATES](../TEMPLATES.md). IMPLEMENTED means the operational rule is present, not that every optional mode has been exercised. **39 IMPLEMENTED / 1 PARTIAL / 0 MISSING / 0 UNSUPPORTED / 0 NOT_APPLICABLE**.

| ID | Principle | Status | Evidence / action |
| --- | --- | --- | --- |
| 107 | AGENTS map | IMPLEMENTED | Compressed repeated contracts into mandatory subject links; universal authority/safety retained. |
| 108 | Workflow promotion ladder | IMPLEMENTED | O: Workflow promotion and experiments; bounded → reusable role → serial passes → proven parallel. |
| 109 | Skill/subagent promotion test | IMPLEMENTED | O: recurrence, stable boundary, predictable I/O, less explanation, narrow reliable scope. |
| 110 | Context firewall | IMPLEMENTED | O: Planner and worker context; retain planner decisions, return compact evidence. |
| 111 | Intent-preserving briefs | IMPLEMENTED | O/T: WHY_THIS_EXISTS, USER_INTENT, SUCCESS_FROM_LAURENS_PERSPECTIVE, TECHNICAL_OBJECTIVE. |
| 112 | Prompt quality check | IMPLEMENTED | O/T: purpose, desired result, owner, exclusions, authority and return checked before dispatch. |
| 113 | Standard task envelope | IMPLEMENTED | T: existing assignment extended; applicable fields only, no database. |
| 114 | Read scope | IMPLEMENTED | O/T: separate READ_SCOPE; relevant discovery permitted. |
| 115 | Write scope | IMPLEMENTED | O/T: WRITE_SCOPE and FORBIDDEN_WRITE_SCOPE. |
| 116 | Change surface deviation | IMPLEMENTED | O/T: reason, paths, acceptance/dependency impact resolved before expanded writes. |
| 117 | Writer isolation | IMPLEMENTED | O: existing isolation strengthened to all independent writers; branch name alone insufficient. |
| 118 | Read-heavy parallelism | IMPLEMENTED | O: useful independent reconnaissance/analysis; two bounded read-only audits used here. |
| 119 | Write-heavy gate | IMPLEMENTED | O: independent surfaces, prerequisites, isolation and worthwhile integration economics. |
| 120 | Dependency scheduling | IMPLEMENTED | O/T: prerequisite IDs/evidence; no utilization-driven dependent dispatch. |
| 121 | Single integration owner | IMPLEMENTED | O/T: one owner controls target integration under unchanged gates. |
| 122 | Fresh Reviewer | IMPLEMENTED | O/T: requirements, authority, exact diff and validation; omit implementation opinions. |
| 123 | Optional plan critic | IMPLEMENTED | O: one fresh critique only when difficult/high-risk work justifies it; unused here. |
| 124 | Optional Best-of-N | IMPLEMENTED | O: premium exception with isolated candidates and comparison criteria; forbidden for docs/routine work. |
| 125 | Worker receipts | IMPLEMENTED | T: concise status/SHA/files/acceptance/validation/findings/blockers/business/next receipt. |
| 126 | Durable RUN recovery | IMPLEMENTED | O/T: existing RUN and preservation procedure retained; interruption scenarios explicit. |
| 127 | Checkpoint communication | IMPLEMENTED | O: assignment/ACK, clarification, blocker/deviation, completion, review, verification. |
| 128 | Context pollution guard | IMPLEMENTED | O/T: CONTEXT_POLLUTION_RISK restores ownership; no new supervisor by default. |
| 129 | Planner understanding | IMPLEMENTED | O: planner retains intent, architecture, business/dependency knowledge and inspects evidence. |
| 130 | Bounded worker context | IMPLEMENTED | O: purpose + authority + relevant files + bounded contract. |
| 131 | Multi-agent usage budget | IMPLEMENTED | O/T: value, added usage and synthesis cost assessed per additional agent. |
| 132 | Concurrency budget | IMPLEMENTED | O: one active write-heavy Implementer; useful readers may overlap; limit is not a target. |
| 133 | Review budget | IMPLEMENTED | O: one meaningful independent review plus targeted correction verification. |
| 134 | Post-work reconciliation | IMPLEMENTED | O: intent/business/assumptions/scope/status/lessons/usage check, not another whole-code audit. |
| 135 | Repeated-lesson promotion | IMPLEMENTED | O: repeated evidence earns a rule/template/test/helper/role/skill; no one-off permanence. |
| 136 | Spike isolation | IMPLEMENTED | O: read-only or isolated SPIKE; recommendations do not authorize implementation. |
| 137 | Testing calibration | IMPLEMENTED | O: proportional checks, mandatory CONTRIBUTING branch/merge gates preserved. |
| 138 | Parallel read-only specialists | IMPLEMENTED | O: distinct dimensions when useful; Orchestrator deduplicates. |
| 139 | No task queue | IMPLEMENTED | O: existing records/tools suffice; no queue/server/scheduler added. |
| 140 | MCP boundary | IMPLEMENTED | O: integration capability does not inherently supply scheduling, locking or recovery. |
| 141 | Native task-ID routing | PARTIAL | O: IDs canonical, names labels, RUN fallback retained; tested transport limitations remain. |
| 142 | agent-talk gate | IMPLEMENTED | O: evaluate later only for material messaging cost and bounded compatibility/security review. |
| 143 | tmux optional | IMPLEMENTED | O: later only for a justified CLI workflow; desktop remains primary. |
| 144 | Experiment gate | IMPLEMENTED | O: hypothesis, authorized bounded trial, measured comparison, meaningful improvement. |
| 145 | Evidence distinction | IMPLEMENTED | O and source table below: official/community/anecdotal/project labels; capability detection required. |
| 146 | Orchestration opportunities | IMPLEMENTED | O/T: NEW_ORCHESTRATION_OPPORTUNITY in existing improvement mechanism; no auto-adoption. |

**141 — REASON:** task-ID routing exists, but native send acceptance/route-specific ACK cannot guarantee delivery or cross-lifecycle persistence. **ACTION TAKEN:** retained canonical ID routing, duplicate detection, capability checks and complete RUN fallback. **REMAINING LIMITATION:** existing approval-gated/uncertain native transport and ID persistence; no fresh routing trial or infrastructure installation. Adaptive desired speed also remains separate from unavailable actual-speed readback/control; historical limitations are not reopened.

## Validation, review and closure

Required: inspect full diff and exact five-path allowlist; doctor/Git safety; documentation link/coverage checks; secret scan and full branch validation under CONTRIBUTING; same-repository PR Validation at final exact SHA; independent fresh review; separately staged normal no-ff integration, full merge validation, integration evidence approval, explicit GitHub main push and post-merge CI. No Sites push/deploy. The user explicitly authorizes this gated integration in this task.

Local branch validation passed: doctor, complete diff/scope check, 72 local documentation link targets, all 40 coverage IDs, secret scan and `npm run validate:full` (172 Node / 35 Playwright, typecheck, lint, build, artifact and foundation guards). Initial cross-platform validation mistook slash-separated privacy wording for a local path; rephrasing fixed it without changing the guard. This receipt-only update receives final documentation/secret checks and exact-commit CI.

Initial clean-worktree setup used the pinned lockfile because dependencies were absent, reused cached Chromium, and made no manifest/lockfile change. Sandbox EPERM left an invalid optional package; the existing setup repair as repository owner corrected it and doctor passed. Existing large-asset, Node type-stripping, color-environment and build/toolchain warnings remain visible. npm reported 12 dependency vulnerabilities during setup; no audit-fix or dependency change was authorized or performed.

Resource choices: one control-plane writer; bounded read-only AGENTS/contract audit Terra/medium and source collection Luna/medium alongside local work. Fresh exact-SHA review uses a capable balanced configuration, targeted verification after corrections/integration; deterministic tooling handles validation. Desired speed normal, actual UNKNOWN. No plan critic, duplicate implementation, permanent role, or utilization-driven spawn. ROLLBACK: preserve branch/PR and use a separately authorized focused revert if needed.

Closure receipts on the branch PR must state final source SHA, CI run URL, reviewer identity/verdict/SHA, merged SHA/parents and validation, unchanged protected-state fingerprints and deployment NO. This immutable checkpoint predates those results; GitHub/Git evidence supersedes IN_REVIEW without self-SHA documentation loops.

## Pilot recommendation and improvement connection

12G-CARE-01 stays stopped. These rules refine a future authorized workflow: first resolve preservation/disposition without modifying the stopped original; then one isolated fresh writer from verified current main, intent-preserving brief, explicit read/write scopes/dependencies, Business Truth before edits, adaptive resources, concise receipt and existing CI/fresh review. Read-only source work may overlap only if independently useful. Best-of-N and plan critic are not warranted by the currently bounded pilot recommendation.

No new infrastructure is justified. agent-talk and tmux are EVALUATE LATER only at their documented triggers; external queue and MCP scheduling layer are NOT NEEDED. Existing GitHub security recommendations remain unimplemented and separately authorized.

One useful NEW_ORCHESTRATION_OPPORTUNITY: on the next separately authorized low/medium-risk work item, compare the compact brief/receipt process with prior practice. TYPE: ORCHESTRATION; VALUE: MEDIUM; EFFORT: LOW; RISK: LOW; USAGE/COST: low, no extra agents/CI solely for measurement; MAINTENANCE: LOW; WHY: establishes whether context and handoff changes reduce intervention; TIMING: next suitable authorized item; AUTHORIZED: NO for executing a new trial now. SOURCE_TYPE: PROJECT EXPERIENCE; EXTRA_COMPLEXITY: a brief RUN observation; SECURITY_SUPPLY_CHAIN_EFFECT: no new tool; PILOT_PROPOSAL: record quality, usage, human intervention, coordination and failures, retaining only useful lessons. This does not authorize the stopped safety-sensitive pilot or create a second backlog.

Completion target: PROJECT_COMPLETE_FOR_CURRENT_SCOPE for this addendum; application remains NO-GO and pilot STOPPED.
