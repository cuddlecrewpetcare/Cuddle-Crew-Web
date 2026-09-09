# Autonomous workspace and approval addendum — 2026-09-09

WORK_ITEM: `CC-AUTONOMOUS-WORKSPACE`. OWNER / integration owner: current bounded configuration task. BASE_SHA: `d4948e4c1535514e1f7e9db955dbcba092f9fbdc`, verified by `git fetch`, `git rev-parse` and `git ls-remote` on 2026-09-09. BRANCH: `codex/autonomy-control-plane-20260909`; isolated worktree. STATUS: IN_PROGRESS at commit time; final exact SHA, CI, independent review and normal integration receipts belong to this branch's PR. WRITE_SCOPE: local user Codex config plus ORCHESTRATION, TEMPLATES, PROJECT_STATUS and this RUN. FORBIDDEN_WRITE_SCOPE: product/application, business references/rules, pilot worktrees, workflows, dependencies, GitHub/provider/security settings and deployment.

## Reconciled state and preserved boundaries

GitHub `main` remained exactly the expected `d4948e4c1535514e1f7e9db955dbcba092f9fbdc`. The canonical checkout remains intentionally stale/dirty at `3b443a6dcafb0cb3f4ed4129714d357e3e059816` and was not reset, cleaned, staged or modified. Context-lifecycle [PR #7](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/pull/7) is merged; its exact-head Validation [34337027844](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/actions/runs/34337027844) and resulting-main Validation [34338656355](https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web/actions/runs/34338656355) passed.

This is local configuration/control-plane work, not business behavior, so the mandatory business-rule preflight was not triggered and no business-reference source was used to derive a rule. Existing Business Truth gates remain unchanged. No product implementation, Phase 12H, deployment, DNS/provider/GitHub-security setting, paid service, new dependency, or production/credential action occurred.

The stopped `12G-CARE-01` pilot was inspected read-only only to verify preservation: `codex/12g-care-01` remains at `79153d2e101374b136a79a2c3ac644bcd5bd91b0` with exactly two staged paths and 11 insertions (`app/lib/care-planner.ts`, 1; `tests/care-planner.test.ts`, 10), matching the durable recovery record. No pilot edit, test, stage, commit, push, merge, clean, archive, reassignment or continuation occurred. The separate reconstruct worktree remains at `75d2f6d710adf7ebf92a31f6f5c07c4ba10195a6` with its pre-existing untracked `.codex/` entry.

## Capability detection

Installed Codex CLI is `0.153.4`; the native Windows sandbox is `elevated`. The active user configuration is `%USERPROFILE%\.codex\config.toml`, shared by CLI/IDE/desktop configuration layers; trusted project `.codex/config.toml` files override it for their subtree. The installed CLI exposes `on-request` and `never`; strict probes also accept the granular approval table. The current manual documents `untrusted`, but this installed runtime rejects it, so it was not used. Sandbox modes are `read-only`, `workspace-write`, and `danger-full-access`.

Current first-party documentation supports `approvals_reviewer = "auto_review"`, legacy `sandbox_workspace_write.writable_roots`, restricted command-network control, beta permission profiles, and native Windows elevated sandboxing. Permission profiles were not mixed into the working legacy sandbox configuration. The undocumented compatibility value `guardian_subagent` was replaced with the canonical supported value `auto_review`. No local reviewer-policy override was added because it would replace, rather than merge with, the built-in policy.

Sources: [agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security), [auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review), [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference), [permissions](https://learn.chatgpt.com/docs/permissions), [Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox), [long-running work](https://learn.chatgpt.com/docs/long-running-work), [scheduled tasks](https://learn.chatgpt.com/docs/automations), and [worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees).

## Local configuration, backup and rollback

The pre-change config was preserved byte-for-byte at `%USERPROFILE%\.codex\config.toml.backup-20260909T034201-0700` (5,656 bytes; SHA-256 `2F98EDE2BD757B2EE69A46BCF9244C3FF4A4B8AFDB066C1C2B43248877065D6B`). Unrelated model, UI, plugin, MCP, Windows, project-trust and instruction settings were preserved. Exact supported changes:

- retain `approval_policy = "on-request"` and `sandbox_mode = "workspace-write"`;
- replace legacy `approvals_reviewer = "guardian_subagent"` with `"auto_review"`;
- add only `C:\Dev\CuddleCrewPetCareWEB` and `C:\Dev\CuddleCrewPetCareWEB-worktrees` as `sandbox_workspace_write.writable_roots`;
- explicitly retain command `network_access = false`; and
- set `features.prevent_idle_sleep = true` so an active turn can inhibit idle sleep where supported.

An initially considered GitHub/npm/OpenAI-docs command-network allowlist was rejected by automatic security review as an overly broad persistent user-level combination with auto-review. The proposal was removed rather than retried or bypassed. Routine network needs therefore cross the sandbox one action at a time and are eligible for automatic review; web search, apps, MCP, browser/Computer Use, GitHub and external SaaS retain separate controls. This is safer than a standing exfiltration path and does not widen local/private network access.

Rollback: copy the verified backup over `%USERPROFILE%\.codex\config.toml`, then restart the desktop app/start a fresh task. The active file passed `codex --strict-config doctor --summary --no-color --ascii`: config loaded, authentication configured, elevated sandbox healthy, and effective state was restricted filesystem + restricted network + `OnRequest`. The unrelated diagnostic notes were terminal `TERM=dumb`, two historical thread-inventory issues, and an available desktop update. A fresh CLI process loads config changes immediately; restart the desktop app for existing/future desktop-session certainty because an existing chat's permission envelope is not retroactively changed.

## Filesystem and harmless tests

Authorized persistent roots are the exact canonical Cuddle Crew checkout and the new empty Cuddle Crew-only sibling worktree parent. `C:\Dev` contains unrelated repositories and was not authorized. The user profile, drive roots, all `.codex`, all visualizations, OneDrive/Documents, Desktop, Downloads, Pictures, browser profiles, unrelated repos and personal/cloud files were not authorized. Codex-managed worktrees under `$CODEX_HOME/worktrees` remain writable when each is the active session workspace; their application-global parent was not added. New CLI/Orchestrator-created Cuddle Crew worktrees should use the dedicated parent. Protected `.git`, `.agents` and `.codex` paths can still require review under workspace-write.

- READ: project/orchestration files read successfully without user approval.
- WRITE: a sentinel was created, edited, read and removed inside a disposable worktree; final status was clean.
- GIT: status, log, exact remote SHA and worktree inventory succeeded; metadata-changing operations crossed automatic review where required.
- WORKTREE: a detached disposable checkout of `d4948e4` was created under `C:\Dev\CuddleCrewPetCareWEB-worktrees`, verified, used for the write test, verified clean, and removed. The dedicated parent remains.
- VALIDATION: `npm run check:git-safety` passed without modification; existing large-file warnings remained informational.
- OUTSIDE ROOT: an unprivileged write probe to `C:\Dev\.cuddlecrew-codex-boundary-probe-20260909.tmp` failed with `UnauthorizedAccessException`; no file existed afterward.
- HIGH RISK: no destructive/production action was attempted. Workspace-write, network-off, auto-review denial/fail-closed behavior, orchestration gates and the outside-root denial preserve the boundary.

Overall autonomy: `MOSTLY_AUTONOMOUS_WITHIN_WORKSPACE`. Routine project reads/writes/tests are direct. Git metadata, new worktree registration and network requests can still invoke automatic review; reviewer denial, timeout, protected paths, Computer Use app approval, external-provider gates, destructive actions, business/production/security gates, app shutdown, host sleep/logout or lost connectivity can still stop unattended work.

## Background and task behavior

Local work can continue while attention moves to another chat/worktree and scheduled local tasks can run in background worktrees, but the host must remain on, connected and available and the desktop app must remain running for local scheduled work. `prevent_idle_sleep` only inhibits idle sleep while a turn is active; it does not survive manual sleep, logout, restart, app exit, power/network loss, or an approval/security pause. Remote/mobile can steer a connected host; it does not move local execution to the phone or make an offline host durable. No daemon-like or restart-survival guarantee is made.

## Coverage 193–242

O = [ORCHESTRATION](../ORCHESTRATION.md#autonomous-workspace-authorization); T = [TEMPLATES](../TEMPLATES.md); S = [PROJECT_STATUS](../PROJECT_STATUS.md); R = this RUN. **46 IMPLEMENTED / 4 PARTIAL / 0 MISSING / 0 UNSUPPORTED / 0 NOT_APPLICABLE**.

| ID | Principle | Status | Concise evidence |
| --- | --- | --- | --- |
| 193 | Current Codex config location detected | IMPLEMENTED | R: active user config resolved and strict-loaded. |
| 194 | Current supported approval modes detected | IMPLEMENTED | R: installed on-request/never/granular; documented-but-rejected untrusted excluded. |
| 195 | Current sandbox modes detected | IMPLEMENTED | R: read-only/workspace-write/danger-full-access. |
| 196 | Workspace-write equivalent detected | IMPLEMENTED | R: retained supported workspace-write. |
| 197 | Auto-review equivalent detected | IMPLEMENTED | R: canonical auto_review verified and enabled. |
| 198 | Existing config preserved | IMPLEMENTED | R: unrelated settings preserved; focused diff inspected. |
| 199 | Config backup/rollback | IMPLEMENTED | R: verified backup, hash and copy-back/restart route. |
| 200 | Narrow Cuddle Crew writable roots | IMPLEMENTED | R: two exact Cuddle Crew paths only. |
| 201 | No entire-home/root-drive authorization | IMPLEMENTED | O/R: explicit exclusions and denial probe. |
| 202 | Routine project read autonomy | IMPLEMENTED | O/R: standing scope plus successful read. |
| 203 | Routine scoped write autonomy | IMPLEMENTED | O/R: direct workspace write and clean sentinel test. |
| 204 | Git command autonomy | PARTIAL | Workspace file Git reads are direct; protected `.git` metadata writes still require automatic review. |
| 205 | Worktree autonomy | IMPLEMENTED | Dedicated parent plus successful create/use/remove through automatic review. |
| 206 | Validation command autonomy | IMPLEMENTED | O/R: routine checks authorized; Git-safety smoke passed. |
| 207 | Standing reversible-work authorization | IMPLEMENTED | O: explicit bounded action list. |
| 208 | Production deployment remains gated | IMPLEMENTED | O/R: separate Lauren gate; deployment NO. |
| 209 | DNS remains gated | IMPLEMENTED | O/R: separate Lauren/provider gate. |
| 210 | Secrets/credential changes remain gated | IMPLEMENTED | O/R: no config secrets exposed or changed. |
| 211 | Business policy changes remain gated | IMPLEMENTED | O/R: Business Truth and Lauren authority retained. |
| 212 | External destructive actions remain gated | IMPLEMENTED | O/R: effect classification and reviewer boundary. |
| 213 | Untrusted code privilege remains gated | IMPLEMENTED | O: privileged/supply-chain execution excluded. |
| 214 | Workspace vs task-scope distinction | IMPLEMENTED | O: permission cannot enlarge write/change scope. |
| 215 | Network permission evaluated | PARTIAL | Restricted network retained; routine requests may require/lose automatic review. |
| 216 | GitHub remains separate trust boundary | IMPLEMENTED | O/R: no token/security setting widened. |
| 217 | External SaaS remains separate trust boundary | IMPLEMENTED | O/R: provider tools retain independent gates. |
| 218 | Background/unattended behavior capability-detected | PARTIAL | Supported while app/host/workspace/connectivity remain; not restart/sleep durable. |
| 219 | No false background guarantee | IMPLEMENTED | O/R: explicit process/host/sleep limits. |
| 220 | Platform approval-stall handling | IMPLEMENTED | O/T: categories, one inspection, remediation and no bypass. |
| 221 | Approval-friction improvement mechanism | IMPLEMENTED | O/T: named recommendation event. |
| 222 | Task-message approval interaction | IMPLEMENTED | O/T: task ID, one inspection and RUN fallback retained. |
| 223 | Worktree-root coverage | IMPLEMENTED | R: dedicated persistent root; active managed worktree remains a session root. |
| 224 | Worktree preservation retained | IMPLEMENTED | O/S/R: pilot evidence and pre-archive protections unchanged. |
| 225 | Context-budget retained despite broad read permission | IMPLEMENTED | O: read permission is not a context-loading instruction. |
| 226 | Command autonomy with destructive-command boundary | IMPLEMENTED | O/R: routine commands authorized; destructive/high-risk gates retained. |
| 227 | Existing dependency install vs new-dependency distinction | IMPLEMENTED | O: declared setup allowed; additions/supply chain separately governed. |
| 228 | Personal-file firewall | IMPLEMENTED | O/R: exact exclusions; no broad personal root. |
| 229 | Config syntax/runtime validation | IMPLEMENTED | R: staged and active strict doctor loaded successfully. |
| 230 | Safe read test | IMPLEMENTED | R: project files read. |
| 231 | Safe write test | IMPLEMENTED | R: sentinel create/edit/remove; clean result. |
| 232 | Safe Git test | IMPLEMENTED | R: status/log/remote/worktree operations. |
| 233 | Safe worktree test if applicable | IMPLEMENTED | R: disposable detached worktree removed cleanly. |
| 234 | Outside-root boundary confirmed | IMPLEMENTED | R: exact C:\Dev control denied; no artifact. |
| 235 | High-risk boundary preserved | IMPLEMENTED | O/R: configuration/policy evidence; no destructive probe. |
| 236 | Autonomy level classified | IMPLEMENTED | R: MOSTLY_AUTONOMOUS_WITHIN_WORKSPACE. |
| 237 | Remaining approval classes documented | IMPLEMENTED | R: Git/network/protected/app/provider/security/background limits. |
| 238 | Autonomy persists across fresh tasks where supported | PARTIAL | User config is durable and fresh CLI loaded it; existing desktop chats need restart/new session. |
| 239 | Full-access escalation gate | IMPLEMENTED | O/T: required event/fields; no full access enabled. |
| 240 | New autonomy capability discovery | IMPLEMENTED | O/T: named review event; no automatic widening. |
| 241 | Minimum-privilege principle | IMPLEMENTED | O/R: exact roots, network off, denial test. |
| 242 | Pilot remains stopped | IMPLEMENTED | S/R: exact read-only HEAD/staged-state recheck; no pilot action. |

PARTIAL 204 — REASON: workspace-write protects Git metadata even under writable roots. ACTION: allow routine bounded Git escalations to Auto-review; retain nondestructive Git and integration rules. REMAINING_LIMITATION: a reviewer denial/timeout or destructive/history-changing request stops work.

PARTIAL 215 — REASON: a persistent user-wide command-network allowlist was rejected as excessive; network remains off. ACTION: Auto-review each necessary scoped GitHub/npm/official-doc request and log repeated safe stalls. REMAINING_LIMITATION: network operations add review latency and can be denied; provider/browser/app traffic remains separately controlled.

PARTIAL 218 — REASON: local execution depends on an awake, connected host and running app; current app-server doctor state is ephemeral. ACTION: active-turn idle-sleep prevention enabled; use supported scheduled/goal/worktree/remote mechanisms only when explicitly requested. REMAINING_LIMITATION: no restart, manual sleep, logout, app-exit, power-loss or indefinite daemon guarantee.

PARTIAL 238 — REASON: user config is durable but existing chats do not retroactively change their established permission envelope. ACTION: restart the desktop app and use a fresh task for the new default; fresh CLI strict doctor already loaded it. REMAINING_LIMITATION: the current task cannot prove post-restart desktop behavior without terminating itself.

## Local validation

The focused config checks and harmless boundary tests above passed. Repository validation then passed: `npm run doctor`; `npm run check:git-safety`; `npm run scan:secrets` with 0 findings; and `npm run validate:full`, including all repository guards, 172 Node tests, typecheck, lint, build/artifact safety and 35 Playwright tests. Existing reviewed large-asset, optional/WASM-package, Node type-stripping, Vinext route-classification and color-environment warnings remained visible. `npm ci` reported 12 dependency advisories; no audit fix, manifest/lockfile edit or dependency addition was authorized or performed.

## Closure requirements

Inspect the full four-document diff, run doctor/Git safety/secret scan/full validation, stage exact paths, create a same-repository PR, obtain exact-head Validation and fresh independent SHA-bound review, then use the existing normal no-ff integration/push/resulting-main validation process. Deployment remains NO. Repository completion does not make the application GO, authorize the stopped pilot, or widen local/provider authority.

No further high-value improvement is recorded beyond the implemented friction/capability mechanisms and the intentional network limitation above.
