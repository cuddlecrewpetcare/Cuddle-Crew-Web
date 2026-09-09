# Role and work-item templates

Use only the applicable fields; trivial tasks do not need the full envelope. Replace angle-bracket slots before sending. Paths refer to the chosen worktree; never paste secret/private values. These templates supplement [ORCHESTRATION](ORCHESTRATION.md), not the business hierarchy. Before important dispatch check that purpose, Lauren's desired result, ownership, prohibited changes, authority and return evidence are clear; fix the brief when they are not.

## Ready-to-use role prompts

Initialize the four persistent roles with their exact names below. Each reads AGENTS.md, docs/codex/ORCHESTRATION.md and docs/codex/PROJECT_STATUS.md, then only role-specific sources. Initialization alone authorizes no product work, pilot, review of product work, broad business audit or background monitoring. Return INITIALIZATION: SUCCESS/FAILED and IDLE/READY or the concrete blocker, then stop. Record task ID/host, configured model/effort, desired/actual speed and visibility in the dated runtime RUN; never infer a deeplink or durable ID guarantee. The Implementer template is for future fresh bounded work, never a permanent role.

**CC — ORCHESTRATOR**

> Read AGENTS.md, docs/codex/ORCHESTRATION.md and docs/codex/PROJECT_STATUS.md. Reconcile Git, current remote base, active tasks, exact-SHA CI/review and relevant phase evidence. Preserve unrelated dirty work. Identify only authorized scope and report status concisely. For each meaningful assignment assess task complexity, ambiguity, risk, determinism, cross-file/system reasoning, context, reversibility, time and cost; independently choose the most cost-efficient sufficiently capable model, reasoning and speed. Adjust up/down when evidence warrants; document material overrides and unsupported controls honestly. Assign one bounded fresh Implementer, route by task ID, prepare the full durable fallback, route Business Truth/checks/independent review, retain evidence, surface worthwhile improvements through the recommendation rule, and stop at scope completion. Follow separate merge and deployment gates. Lauren should need only this role for status, continuation, pause, routing preferences or blockers; no worker micromanagement. Initialize now; await authorization for the next work item.

**CC — <WORK_ITEM> — IMPLEMENT**

> Own only the attached assignment. Read AGENTS.md, orchestration/status and its specific sources. Confirm WORK_ITEM, owner, scope, BASE_SHA and branch before edits. Preserve negative requirements and unrelated work. Follow established patterns, implement a coherent narrow diff, run assigned validation, and report actual artifacts and acceptance evidence. Do not expand scope, alter business rules, weaken checks, delegate recursively, merge or deploy. Return COMPLETE or BLOCKED to REPORT_BACK_TO; report unexpected findings without starting new work.

**CC — REVIEWER** (or authorized fresh **CC — <WORK_ITEM> — REVIEW**)

> Independently inspect the assigned exact commit/diff and acceptance sources; do not trust the implementation summary. Check relevant regression, business authority, architecture, security and unexpected files. Return APPROVED, CHANGES_REQUESTED or BLOCKED with evidence-backed REQUIRED findings separately from OPTIONAL suggestions. After fixes, verify prior findings and fix-caused regressions only. Do not edit product code, redesign unrelated areas, merge or deploy.

**CC — SENTINEL**

> Verify the assigned Git/base/HEAD, changed-file boundaries, required checks/CI and orchestration invariants using existing deterministic tooling. Read only the applicable contract and report commands, counts, warnings, source SHA and PASS/FAIL/PENDING/NOT_APPLICABLE evidence honestly. Preserve test integrity, synthetic data and provider-write gates. Do not implement product changes, alter CI to pass, install unrelated tools or deploy.

**CC — BUSINESS TRUTH**

> For the attached work item, read docs/business-reference/README.md and docs/business-reference/guidance/source-of-truth-document-hierarchy.md, then the most specific applicable CURRENT / APPROVED source. Return path/section evidence and BUSINESS_TRUTH_CONFIRMED, BUSINESS_RULE_CONFLICT or USER_DECISION_REQUIRED. Distinguish current policy, drafts and historical material; compare relevant downstream implementation without treating it as authority. Do not invent policy, copy private review logic into public UI, or edit product code.

## Assignment / durable RUN record

Copy this into the native assignment and, for substantial work, one RUNS/<work-item>.md (or the existing phase record). Update the same record at handoffs; no separate transcript or handoff file is needed.

```text
MESSAGE_TYPE: ASSIGNMENT
MESSAGE_ID: <work-item>-assignment-1
WORK_ITEM: <existing finding or bounded ID>
ROLE: <bounded role; existing persistent role or temporary worker>
FROM: <orchestrator task ID>
TO / OWNER: <ready task ID + host, or subagent ID>
TASK_NAME: CC — <WORK_ITEM> — IMPLEMENT
TASK_ID / OWNER_TASK_ID: <ready routing ID if known; never a setup token>
WHY_THIS_EXISTS: <purpose; why this work matters>
USER_INTENT: <Lauren's relevant request>
SUCCESS_FROM_LAURENS_PERSPECTIVE: <observable useful result>
OBJECTIVE / TECHNICAL_OBJECTIVE: <one bounded technical outcome>
AUTHORIZED_SCOPE: <current Lauren instruction + allowed work>
MUST_NOT: <protected negative requirements>
OUT_OF_SCOPE: <excluded work>
SOURCE_OF_TRUTH: <paths + sections; statuses verified>
CONTEXT_FILES: <only relevant source paths; no unrelated history>
READ_SCOPE: <relevant files/systems; allow useful discovery>
WRITE_SCOPE: <owned files/modules; NONE for read-only work>
FORBIDDEN_WRITE_SCOPE: <protected files/checkouts/settings>
DEPENDENCIES: <work-item IDs + prerequisite evidence, or NONE>
BASE_SHA: <exact SHA>
BRANCH / WORKTREE: <branch; discover local path from Git>
EXPECTED_CHANGE_SURFACE: <files/modules>
ACCEPTANCE_CRITERIA: <observable outcomes, including boundaries>
REQUIRED_VALIDATION: <commands and required hosted checks>
RISK / CHANGE_IMPACT: <LOW|MEDIUM|HIGH|CRITICAL; relevant impact>
RESOURCE_ASSESSMENT: <complexity/ambiguity/risk/determinism/cross-file/cross-system/context/reversibility/time/cost; concise for small work>
MODEL / REASONING: <independently recommended live choices>
SPEED / DESIRED_SPEED: <economical/normal or justified faster preference>
WHY / WHY_THIS_CONFIGURATION: <capability, reliability, risk, latency and cost justification>
ADDITIONAL_AGENT_VALUE: <time/quality/risk/specialization benefit; extra usage and synthesis cost when spawning>
CONFIGURED_MODEL / CONFIGURED_REASONING / ACTUAL_SPEED: <tool-confirmed values or UNKNOWN; separate recommendation from actual>
RESOURCE_OVERRIDE: <if material: EVENT; PREVIOUS_CONFIGURATION; NEW_CONFIGURATION; REASON>
ROLLBACK: <practical recovery/revert path and limits; NOT_APPLICABLE with reason if unnecessary>
PARALLEL_SAFE: NO
INTEGRATION_OWNER: <one owner; workers do not merge>
REVIEW_REQUIRED / SECURITY_REVIEW_REQUIRED / BUSINESS_TRUTH_REQUIRED: <YES/NO + why>
REPORT_BACK_TO: <orchestrator ID and durable record path>
FALLBACK: <same ready-to-use assignment in RUN path; native send/ACK limit; no blind retries>
EXPECTED_OUTPUT: <concise receipt + artifact/diff/test navigation>
STATUS / LAST_PROGRESS: <state; timestamp with timezone>
```

## Messages and evidence

Include WORK_ITEM, MESSAGE_ID and sender/recipient task IDs (canonical), with names as labels. Duplicate IDs return existing state. ACK owner/base/scope before implementation, through native return or durable RUN fallback. Native ACK is PARTIAL unless a harmless test establishes that route. If blocked/approval-gated/uncertain/unacknowledged, inspect once then use the prepared fallback; no blind repeated sends. Dates identify progress, not document authority. No message carries secrets or enlarges authority.

| MESSAGE_TYPE | Required content |
| --- | --- |
| ACK | MESSAGE_ID, WORK_ITEM, OWNER, BASE_SHA, accepted scope or blocker |
| PROGRESS | STATUS; COMPLETED, CURRENT, NEXT; RISKS, UNEXPECTED_FINDINGS; SCOPE_CHANGE_REQUIRED YES/NO |
| BLOCKED | BLOCKED_ON, WHY_IT_BLOCKS, ATTEMPTED, EVIDENCE, RECOMMENDED_RESOLUTION; REQUIRES_LAUREN YES/NO |
| COMPLETE | BRANCH, BASE_SHA, FINAL_SHA; FILES_CHANGED, IMPLEMENTED; acceptance criterion → result → evidence; LOCAL_VALIDATION (commands/counts/warnings); CI_STATUS PASS/FAIL/PENDING/NOT_APPLICABLE + SHA/URL; REVIEW/BUSINESS_TRUTH; KNOWN_LIMITATIONS, UNEXPECTED_FINDINGS; BUSINESS_REQUIREMENTS_CHANGED NO (or explicit authority/reference reconciliation); ROLLBACK; RECOMMENDED_NEXT_ACTION |
| REVIEW | COMMIT_OR_DIFF and reviewed SHA; VERDICT APPROVED/CHANGES_REQUESTED/BLOCKED; findings ID/severity/evidence/required correction; OPTIONAL_NONBLOCKING separately |
| VERIFICATION | Final SHA; prior finding ID/status; FIX_CAUSED_REGRESSIONS; VERDICT APPROVED/CHANGES_REQUESTED |
| UNEXPECTED_FINDING | CATEGORY, SEVERITY, EVIDENCE, BLOCKING, RECOMMENDATION; use existing backlog, no automatic new project |
| TASK_CANCELLED | WORK_ITEM, STOP_REQUESTED, reason, required stop, preserved branch/diff/index evidence and report-back; STOP_CONFIRMED only after verified execution stop |
| RESOURCE_CHANGE | MODEL/EFFORT/SPEED_ESCALATION or DEESCALATION; PREVIOUS_CONFIGURATION, NEW_CONFIGURATION, REASON; in-place/fresh handoff and owner continuity |
| CHANGE_SURFACE_DEVIATION | Reason, expected versus proposed paths, acceptance/dependency impact, authority needed; Orchestrator resolves before expanded writes |
| CONTEXT_POLLUTION_RISK | Unbounded consultation/duplicated context evidence; existing owner and bounded next question |
| ROLE_ROTATION_RECOMMENDED | Logical/current role identity, evidence, active/safe-point state, benefit/risk/cost, successor configuration and why; recommendation is not automatic rotation |
| DUPLICATE_LOGICAL_ROLE_DETECTED | Logical role, competing task IDs/names, current work/routing, durable evidence and action that restores one canonical active task |
| IMPLEMENTER_HANDOFF_REQUIRED | Work item, old/new owner, branch/worktree, base/current SHA/diff, acceptance/tests/blockers/Business Truth/next step; exactly one recognized owner after transfer |

A completion message is an implementation handback. Only the Orchestrator reconciles CI/review/business evidence and marks VERIFIED/COMPLETE. Reports may reference existing logs/check URLs instead of copying them.

Compact worker receipt (include applicable COMPLETE evidence above by reference; artifacts/diffs/test output control over narrative):

```text
WORK_ITEM:
STATUS:
BASE_SHA:
FINAL_SHA: <or NOT_APPLICABLE for read-only; exact reviewed artifact SHA>
FILES_CHANGED:
ACCEPTANCE_RESULTS: <criterion → result → evidence>
VALIDATION: <commands/results/counts; CI SHA/URL or PENDING>
UNEXPECTED_FINDINGS:
BLOCKERS:
BUSINESS_REQUIREMENTS_CHANGED: YES/NO <if YES, explicit authority + reference reconciliation>
RECOMMENDED_NEXT_ACTION:
```

Reviewer receives requirements, authority, exact SHA/diff and validation in fresh context; omit the Implementer's opinions. Checkpoint messages and the same RUN suffice for recovery; do not attach full chats or massive logs.

## Role rotation and succession

Use these fields only when evidence triggers the [role context lifecycle](ORCHESTRATION.md#role-context-lifecycle). Keep the record in PROJECT_STATUS and/or the applicable RUN; do not create a separate database, full transcript or self-referential commit.

Rotation recommendation:

```text
EVENT: ROLE_ROTATION_RECOMMENDED
LOGICAL_ROLE:
CURRENT_TASK_NAME:
CURRENT_TASK_ID:
REASON:
EVIDENCE:
ACTIVE_WORK: YES/NO
SAFE_ROTATION_POINT: YES/NO
EXPECTED_BENEFIT:
HANDOFF_RISK:
ROTATION_COST: LOW/MEDIUM/HIGH
EXPECTED_CONTEXT_BENEFIT: LOW/MEDIUM/HIGH
RECOMMENDED_SUCCESSOR_NAME:
RECOMMENDED_MODEL:
RECOMMENDED_REASONING:
RECOMMENDED_DESIRED_SPEED:
WHY_THIS_CONFIGURATION:
CONFIGURATION_ESCALATION_REASON: <separate from rotation reason, or NONE>
```

Pre-rotation checkpoint and predecessor receipt:

```text
CURRENT_MAIN_SHA:
ACTIVE_WORK_ITEM:
OWNER:
ACTIVE_TASK_IDS:
BRANCH:
WORKTREE:
BASE_SHA:
CURRENT_HEAD_SHA:
CI_STATUS:
REVIEW_STATUS:
BUSINESS_TRUTH_STATUS:
BLOCKERS:
PENDING_USER_DECISIONS:
PENDING_IMPROVEMENTS:
NEXT_AUTHORIZED_ACTION:

PREDECESSOR_RECEIPT:
LOGICAL_ROLE:
GENERATION:
STATUS:
CURRENT_MAIN:
ACTIVE_WORK:
ACTIVE_WORKER_IDS:
OPEN_BLOCKERS:
OPEN_USER_DECISIONS:
IMPORTANT_UNMERGED_STATE:
RECENT_COMPLETIONS:
NEXT:
HANDOFF_RECORD:
READY_TO_RETIRE: YES/NO
```

Successor bootstrap, reconciliation and durable succession entry:

```text
SUCCESSOR_BOOTSTRAP:
LOGICAL_ROLE:
WHY_THIS_ROLE_EXISTS:
CURRENT_PROJECT_STATE:
CURRENT_MAIN_SHA:
ACTIVE_WORK:
CURRENT_OWNER_TASKS:
BLOCKERS:
CURRENT_BUSINESS_TRUTH:
CURRENT_CI/REVIEW_STATE:
NEXT_AUTHORIZED_ACTION:
IMPORTANT_RECENT_DECISIONS:
RELEVANT_RUN_RECORDS:
CANONICAL_ROUTING:
FALLBACK_ROUTING:

SUCCESSOR_RECONCILIATION_TEST:
CURRENT_MAIN_SHA:
CURRENT_PHASE:
ACTIVE_WORK_ITEM:
CURRENT_OWNER:
ACTIVE_BRANCH_WORKTREE:
CI_STATUS:
REVIEW_STATUS:
BUSINESS_TRUTH_STATUS:
BLOCKERS:
NEXT_AUTHORIZED_ACTION:
CONSISTENT_WITH_DURABLE_EVIDENCE: YES/NO
ROUTING_VERIFIED: YES/NO <task-ID test + route-specific ACK if available; native limit retained>

ROLE_SUCCESSION_RECORD:
LOGICAL_ROLE:
PREDECESSOR_TASK_NAME:
PREDECESSOR_TASK_ID:
SUCCESSOR_TASK_NAME:
SUCCESSOR_TASK_ID:
ROTATION_REASON:
CHECKPOINT_SOURCE:
ACTIVE_WORK_TRANSFERRED:
ROUTING_VERIFIED:
DATE_TIME:
PREDECESSOR_STATUS: ROLE_RETIRED/HISTORICAL
```

The successor verifies critical facts against Git/GitHub/status/RUN/business sources before becoming canonical. If material answers conflict, correct initialization and keep the predecessor until safe. If the predecessor vanished, omit its receipt and perform crash-only reconstruction from durable evidence. Before retirement/archive capture the existing worktree/index/diff/blob recovery evidence.

For a saturated or capability-limited bounded worker:

```text
EVENT: IMPLEMENTER_HANDOFF_REQUIRED
WORK_ITEM:
OLD_OWNER:
NEW_OWNER:
BRANCH_WORKTREE:
BASE_SHA:
CURRENT_SHA:
CURRENT_DIFF:
ACCEPTANCE_STATUS:
TEST_STATUS:
BLOCKERS:
BUSINESS_TRUTH:
NEXT_STEP:
SINGLE_RECOGNIZED_OWNER_CONFIRMED: YES/NO
```

## Lauren-facing status and decisions

Keep routine status short:

```text
CUDDLE CREW — STATUS
Current phase:
Active work:
Owner/task:
Task ID:
Branch:
Base SHA:
Risk:
CI:
Review:
Business Truth:
Blocker:
Next:
Recommended configuration:
Model:
Reasoning:
Desired speed:
Why:
High-value improvements: <only if meaningful>
Lauren input required: YES/NO
```

When evidence cannot resolve a material decision, return USER_DECISION_REQUIRED: one clear question, why repository/tools cannot resolve it, meaningful options/consequences only when useful, and a recommendation. Batch nonurgent related decisions. State the actual instruction/tool boundary if it requires approval; do not create permission gates for reversible authorized work.

Material completion: what changed and why; protected scope preserved; validation and limits; remaining risk; exact next action. Keep logs in evidence, and never claim application GO merely because one work item is complete.

## Improvement recommendation

Use only for meaningful findings; send to Orchestrator and deduplicate in the existing backlog/RUN. Recommendation does not authorize implementation.

```text
EVENT: HIGH_VALUE_IMPROVEMENT_FOUND / ADJACENT_OPPORTUNITY / NEW_CAPABILITY_OPPORTUNITY / NEW_ORCHESTRATION_OPPORTUNITY / UNEXPECTED_FINDING
WHAT / WHY / EVIDENCE / EXPECTED_BENEFIT:
IMPROVEMENT_TYPE: BOOTSTRAP / WEBSITE / ENVIRONMENT / CI / SECURITY / BUSINESS_OPS / INTEGRATION / PERFORMANCE / ACCESSIBILITY / SEO / UX / COST / OTHER
VALUE: LOW / MEDIUM / HIGH / VERY_HIGH
EFFORT: LOW / MEDIUM / HIGH
RISK: LOW / MEDIUM / HIGH / CRITICAL
COST_IMPACT: SAVES_COST / NEUTRAL / SMALL_COST / MATERIAL_COST / UNKNOWN
MAINTENANCE: LOW / MEDIUM / HIGH
URGENCY: NOW / SOON / LATER / OPTIONAL
DEPENDENCIES / RECOMMENDED_TIMING:
AUTHORIZED_NOW: YES/NO; cite existing authority if YES
BACKLOG_REFERENCE / OWNER_OR_DECISION_NEEDED:
ADJACENCY: <when applicable: INCREMENTAL_EFFORT, BENEFIT, RISK, SCOPE_EFFECT>
NEW_CAPABILITY: <when applicable: WHAT_CHANGED, BENEFIT, MIGRATION_EFFORT, CAN_EXISTING_FALLBACK_BE_SIMPLIFIED>
NEW_ORCHESTRATION: <when applicable: SOURCE_TYPE OFFICIAL/COMMUNITY/PROJECT EXPERIENCE + evidence label/date; WHY_IT_MAY_HELP; EXTRA_COMPLEXITY; EXTRA_MODEL_CI_USAGE; SECURITY_SUPPLY_CHAIN_EFFECT; PILOT_PROPOSAL; AUTHORIZED YES/NO>
```
