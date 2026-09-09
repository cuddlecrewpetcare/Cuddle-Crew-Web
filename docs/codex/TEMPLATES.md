# Role and work-item templates

Use only the applicable fields. Replace angle-bracket slots before sending. Paths refer to the chosen worktree; never paste secret/private values. These templates supplement [ORCHESTRATION](ORCHESTRATION.md), not the business hierarchy.

## Ready-to-use role prompts

Initialize the four persistent roles with their exact names below. Each reads AGENTS.md, docs/codex/ORCHESTRATION.md and docs/codex/PROJECT_STATUS.md, then only role-specific sources. Initialization alone authorizes no product work, pilot, review of product work, broad business audit or background monitoring. Return INITIALIZATION: SUCCESS/FAILED and IDLE/READY or the concrete blocker, then stop. Record task ID/host, configured model/effort, desired/actual speed and visibility in the dated runtime RUN; never infer a deeplink or durable ID guarantee. The Implementer template is for future fresh bounded work, never a permanent role.

**CC — ORCHESTRATOR**

> Read AGENTS.md, docs/codex/ORCHESTRATION.md and docs/codex/PROJECT_STATUS.md. Reconcile Git, current remote base, active tasks, exact-SHA CI/review and relevant phase evidence. Preserve unrelated dirty work. Identify only authorized scope and report status concisely. For each meaningful assignment assess task complexity, ambiguity, risk, determinism, cross-file/system reasoning, context, reversibility, time and cost; independently choose the most cost-efficient sufficiently capable model, reasoning and speed. Adjust up/down when evidence warrants; document material overrides and unsupported controls honestly. Assign one bounded fresh Implementer, route by task ID, prepare the full durable fallback, route Business Truth/checks/independent review, retain evidence and stop at scope completion. Follow separate merge and deployment gates. Lauren should need only this role for status, continuation, pause, routing preferences or blockers; no worker micromanagement. Initialize now; await authorization for the next work item.

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
FROM: <orchestrator task ID>
TO / OWNER: <ready task ID + host, or subagent ID>
TASK_NAME: CC — <WORK_ITEM> — IMPLEMENT
OBJECTIVE: <one outcome>
AUTHORIZED_SCOPE: <current Lauren instruction + allowed work>
MUST_NOT / OUT_OF_SCOPE: <relevant negative requirements>
SOURCE_OF_TRUTH: <paths + sections; statuses verified>
BASE_SHA: <exact SHA>
BRANCH / WORKTREE: <branch; discover local path from Git>
EXPECTED_CHANGE_SURFACE: <files/modules>
ACCEPTANCE_CRITERIA: <observable outcomes, including boundaries>
REQUIRED_VALIDATION: <commands and required hosted checks>
RISK / CHANGE_IMPACT: <LOW|MEDIUM|HIGH|CRITICAL; relevant impact>
RESOURCE_ASSESSMENT: <complexity/ambiguity/risk/determinism/cross-file/cross-system/context/reversibility/time/cost; concise for small work>
MODEL / REASONING / SPEED: <independently recommended live choices>
WHY: <capability, reliability, risk, latency and cost justification>
CONFIGURED_MODEL / CONFIGURED_REASONING / ACTUAL_SPEED: <tool-confirmed values or UNKNOWN; separate recommendation from actual>
RESOURCE_OVERRIDE: <if material: EVENT; PREVIOUS_CONFIGURATION; NEW_CONFIGURATION; REASON>
PARALLEL_SAFE: NO
REVIEW_REQUIRED / SECURITY_REVIEW_REQUIRED / BUSINESS_TRUTH_REQUIRED: <YES/NO + why>
REPORT_BACK_TO: <orchestrator ID and durable record path>
FALLBACK: <same ready-to-use assignment in RUN path; native send/ACK limit; no blind retries>
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
| TASK_CANCELLED | WORK_ITEM, reason, required stop, evidence/branch preservation and report-back |
| RESOURCE_CHANGE | MODEL/EFFORT/SPEED_ESCALATION or DEESCALATION; PREVIOUS_CONFIGURATION, NEW_CONFIGURATION, REASON; in-place/fresh handoff and owner continuity |

A completion message is an implementation handback. Only the Orchestrator reconciles CI/review/business evidence and marks VERIFIED/COMPLETE. Reports may reference existing logs/check URLs instead of copying them.

## Lauren-facing status and decisions

Keep routine status short:

```text
CUDDLE CREW — STATUS
Current phase:
Active work:
Owner/task:
Branch:
Base SHA:
Risk:
CI:
Review:
Business Truth:
Blocker:
Next:
Recommended:
Model:
Reasoning:
Speed:
Why:
Lauren input required: YES/NO
```

When evidence cannot resolve a material decision, return USER_DECISION_REQUIRED: one clear question, why repository/tools cannot resolve it, meaningful options/consequences only when useful, and a recommendation. Batch nonurgent related decisions. State the actual instruction/tool boundary if it requires approval; do not create permission gates for reversible authorized work.

Material completion: what changed and why; protected scope preserved; validation and limits; remaining risk; exact next action. Keep logs in evidence, and never claim application GO merely because one work item is complete.
