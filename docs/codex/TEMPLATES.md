# Role and work-item templates

Use only the applicable fields. Replace angle-bracket slots before sending. Paths refer to the chosen worktree; never paste secret/private values. These templates supplement [ORCHESTRATION](ORCHESTRATION.md), not the business hierarchy.

## Ready-to-use role prompts

**CC — ORCHESTRATOR**

> Read AGENTS.md, docs/codex/ORCHESTRATION.md and docs/codex/PROJECT_STATUS.md. Reconcile Git, current remote base, active tasks, exact-SHA CI/review and the relevant phase evidence. Preserve unrelated dirty work. Identify only authorized scope; give a short current/last verified/active/blocked/next/risk/model/effort report. For each authorized item, assign one bounded owner, choose the least expensive capable setting, route Business Truth/checks/independent review, retain evidence, and stop at scope completion. Follow the existing separate merge and deployment gates. Create worker tasks only when the current user instruction authorizes them.

**CC — <WORK_ITEM> — IMPLEMENT**

> Own only the attached assignment. Read AGENTS.md, orchestration/status and its specific sources. Confirm WORK_ITEM, owner, scope, BASE_SHA and branch before edits. Preserve negative requirements and unrelated work. Follow established patterns, implement a coherent narrow diff, run assigned validation, and report actual artifacts and acceptance evidence. Do not expand scope, alter business rules, weaken checks, delegate recursively, merge or deploy. Return COMPLETE or BLOCKED to REPORT_BACK_TO; report unexpected findings without starting new work.

**CC — <WORK_ITEM> — REVIEW**

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
MODEL_RECOMMENDATION / REASONING_RECOMMENDATION: <available choice>
ACTUAL_MODEL / MODEL_OVERRIDE_REASON: <known value or UNKNOWN; if applicable>
PARALLEL_SAFE: NO
REVIEW_REQUIRED / SECURITY_REVIEW_REQUIRED / BUSINESS_TRUTH_REQUIRED: <YES/NO + why>
REPORT_BACK_TO: <orchestrator ID and durable record path>
STATUS / LAST_PROGRESS: <state; timestamp with timezone>
```

## Messages and evidence

Include WORK_ITEM and sender/recipient IDs. For repeated or uncertain delivery reuse MESSAGE_ID; ACK the assignment's owner/base before implementation. Dates identify progress, not document authority.

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

A completion message is an implementation handback. Only the Orchestrator reconciles CI/review/business evidence and marks VERIFIED/COMPLETE. Reports may reference existing logs/check URLs instead of copying them.

## Lauren-facing status and decisions

Keep routine status short:

```text
CUDDLE CREW — STATUS
Current phase / Active work:
Branch / Base:
Risk / CI / Review / Business truth:
Blocker / Next action:
Recommended model/effort:
Lauren input required: YES/NO
```

When evidence cannot resolve a material decision, return USER_DECISION_REQUIRED: one clear question, why repository/tools cannot resolve it, meaningful options/consequences only when useful, and a recommendation. Batch nonurgent related decisions. State the actual instruction/tool boundary if it requires approval; do not create permission gates for reversible authorized work.

Material completion: what changed and why; protected scope preserved; validation and limits; remaining risk; exact next action. Keep logs in evidence, and never claim application GO merely because one work item is complete.
