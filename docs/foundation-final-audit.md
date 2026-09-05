# Final Foundation Go / No-Go Audit

> Status: F14 FINAL ENGINEERING AUDIT
>
> Audit date: 2026-09-05
>
> Source: F13 `df53040b36640e96d9bdf511946f119b26b3cda6`
>
> Branch: `codex/foundation-f14-final-go-no-go`
>
> Scope: reconciliation and readiness classification only. This audit authorizes no merge, deployment, provider/account/DNS change, production-data access, Client export, active-care shadow record, policy change, dependency upgrade, history rewrite, branch/worktree cleanup, feature work, or F15 work.

This document separates engineering readiness, merge readiness, website launch readiness, and actual pet-care operational readiness. A configured control is not described as verified when only source evidence exists. Owner/dashboard work is not described as a code defect.

## Executive decisions

| Decision | Result | Why | Immediate condition or next action |
| --- | --- | --- | --- |
| Feature development | **GO** | F0–F13 are one ordered lineage; the complete local foundation gate, build, artifact checks, Node/E2E/accessibility suites, and both secret scans pass; no current engineering `CRITICAL` or `HIGH` defect was found. | Start future work from a clean exact approved checkpoint on a dedicated feature branch, after this F14 branch is reviewed. Keep owner/launch items tracked. |
| Foundation merge | **CONDITIONAL GO** | The foundation line cleanly merge-simulates with fetched `github/main`, but GitHub reports zero hosted workflow runs. The local `main` checkout also contains unrelated owner work that must not be overwritten. | Open/review a pull request, require the first green `Validation` run on `ubuntu-24.04`, use a clean merge-only task/worktree, preserve the dirty checkout, and run post-merge validation. Do not deploy as part of the merge. |
| Production launch | **NO-GO** | Exact active Sites SHA/version and environment assignments are unverified; the observed public artifact differs from the reviewed source contract; provider/account/recovery checks and manual accessibility QA are incomplete; dependency, historical-media, and public-internal-reference reviews remain open. | Complete the launch prerequisites and owner/provider checks below, then conduct a separately authorized exact-SHA deployment and non-writing production smoke. |

Actual pet-sitting operations during active care are independently **NO-GO during a Precise Petcare/access outage unless and until the owner approves a minimum-necessary offline continuity method** under the current approved Continuity / Backup Provider Plan. This operational issue does not block ordinary website feature development or the foundation merge, but it must be resolved before relying on an outage workflow during active care.

## Repository and lineage

The branch starts exactly at F13 and has not reset to `main`. All checkpoints exist and every preceding checkpoint is an ancestor of the next:

| Phase | Exact commit | Subject |
| --- | --- | --- |
| F0 | `c9d378e8e415f9bbc8a0a327849f39114957cf45` | Build persistent local development foundation |
| F1 | `86220eec82a2a69a6fb26474dd5ba11fdd4de232` | Add reusable secret scanning foundation |
| F2 | `d17b1a532e9e27936462bccbda6f259089a1f099` | Harden Git and contribution safety |
| F3 | `940c83accd848abd050f2429e6e28640c6fc0312` | Harden data privacy and retention foundation |
| F4 | `16bc55d6e612ca0b4210199347ba7f07d30ba8d4` | Harden dependency and build supply chain |
| F5 | `d06eee684cc5a41365706bf61ae7c4c72680151f` | Establish testing and quality foundation |
| F6 | `8ca1b69ca1d51080ac6e9100ebacb8daedb43730` | Harden external integration side effects |
| F7 | `4c0083c51d47b46d08f3dad41ba0bafa1062dae5` | Establish observability and recovery foundation |
| F8 | `a3018552da071eb4ac879bd375c07d8e55e673cc` | Establish performance and resource safety foundation |
| F9 | `87f7c54b75966401917ad544264ddcc952a8aa31` | Establish cross-platform filesystem safety foundation |
| F10 | `90f3e33cbd94fa0429d521bb46ce0da1bb78de36` | Establish F10 time and locale determinism |
| F11 | `65b48a0c5bf9203629ead5222d294b9e4373c120` | Establish F11 accessibility and responsive foundation |
| F12 | `b41c87582da98ca97d608c5195774037e165bcf1` | Establish F12 deployment and CI safety |
| F13 | `df53040b36640e96d9bdf511946f119b26b3cda6` | Establish F13 backup and disaster recovery foundation |

The source-main checkpoint is `3b443a6dcafb0cb3f4ed4129714d357e3e059816`. A malformed historical SHA recorded in the F13 prompt is not a repository object and remains documented in `backup-disaster-recovery.md`; history was not rewritten. At audit time, local `main` remained at that checkpoint and fetched `github/main` was `04278a525fddfb8abf694095f8fbada5386f5149`, nine commits ahead on its side. F13 was fourteen commits ahead on the foundation side. Their merge base is the source-main checkpoint, and `git merge-tree --write-tree github/main F13` completed without conflict. A fresh merge simulation must be repeated in the merge-only task because either tip may advance.

The canonical main checkout is `C:\Dev\CuddleCrewPetCareWEB`; it contains unrelated owner changes and was not modified. Earlier foundation worktrees were neither changed nor removed. F14 used a new dedicated worktree.

## Documentation, AGENTS, and authority coherence

The technical documents now agree that provider writes are blocked by default, CI is validation-only and cannot deploy, holiday automation is inactive, Precise Petcare remains Client-record authority, and backup/recovery guidance does not create uncontrolled private copies. F14 corrected only stale technical inventory: F13 test counts, the presence-but-not-execution of hosted CI, Linux evidence wording, and the already-completed canonical-checkout relocation.

`AGENTS.md` is **HEALTHY**. Its rule order, business-reference preflight, placeholder rule, internal-logic privacy boundary, branch/validation contracts, side-effect rules, and separate deployment authorization remain usable. No duplicated post-foundation section was added.

Business implementation and tests remain subordinate to the most specific `CURRENT / APPROVED` reference. The audited estimator remains non-binding, suppresses final totals on review paths, and cannot create a booking. Precise Petcare remains authoritative for approved Client-specific data and formal requests. SMS consent remains optional, affirmative, separate from Terms/purchase, server-stamped, and provider operations remain unresolved.

One reference needs owner cleanup: `guidance/pricing-care-standards-manual.md` contains an obsolete placeholder scaffold followed by a second `CURRENT / APPROVED` manual header. F14 did not edit or reinterpret that authority file. Most-specific approved core/logic references unambiguously control the currently implemented behavior, so this is not a current feature or merge blocker; do not rely on the manual as the sole authority for a future change until its status/header topology is resolved by an authorized business-reference task.

## Business-rule reconciliation

The current implementation and 142-test Node suite preserve:

- centralized approved rates and additional-pet modifiers;
- ZIP-only travel results as `Personalized review required`, with approved travel-duration boundaries handled only after classification;
- daytime same-day distinct from under-24-hour short notice, without stacking both; overnight under-48-hour requests require review;
- no automatic holiday dates or holiday fee while the holiday calendar is `PLACEHOLDER`;
- no final estimator total when travel, household, complexity, capacity, safety, or short-notice review is required;
- neutral public review language rather than internal thresholds or risk reasoning;
- care-planner suitability, care-gap, medication, behavior, and scope boundaries;
- approved cancellation information as explanatory content, not an automated cancellation/refund calculator; and
- no payment, registration, estimate, or portal action guaranteeing booking acceptance.

No approved-source conflict or stale-authority test was found. Placeholder subjects remain inactive or route to personalized review.

## Security, privacy, and publication boundaries

Current-tree and full-history Gitleaks scans report zero secret findings. `.env.local` is absent in the F14 worktree; `.env.example` contains names/safe defaults only. Server-only provider names are checked against public build artifacts. Tests use synthetic data and block live writes. No database, Client export, private calendar data, contact-payload log, backup export, active-care shadow record, or production credential was added or accessed.

Nine previously removed Client-pet images remain reachable in Git history:

- `public/blu-walk.jpeg`
- `public/gallery-aussie.jpeg`
- `public/gallery-black-dog.jpeg`
- `public/gallery-sunny-dog.jpeg`
- `public/gallery-tan-dog.jpeg`
- `public/hero-dog.jpeg`
- `public/loki-portrait.jpeg`
- `public/skylar-profile.jpeg`
- `public/skylar-smile.jpeg`

They remain absent from the F14 tip. Public-use consent is unresolved. Classification: **no action required before feature development**; **not a merge blocker** because the merge preserves their removal and does not newly create the historical exposure; **OWNER/LEGAL/PRIVACY REVIEW REQUIRED before launch sign-off or reusing any Client image**. The owner must decide whether consent evidence, continued historical presence, or a separately authorized coordinated history-remediation incident is appropriate. F14 does not guess legal necessity and does not rewrite history.

The public repository contains `INTERNAL REFERENCE` business documents, including acceptance, safety, capacity, continuity, and compliance logic. No actual Client record, credential, home-access detail, private route origin, or production secret was found in those references. Classification: **OWNER REVIEW REQUIRED**. Public-safe governance/explanation documents may remain; sensitive internal decision rubrics should receive an authority-preserving private-move/sanitization assessment. This is not a feature or merge blocker because the files already exist in the public repository and are not served by the website, but publication-boundary acceptance is required before declaring launch privacy/governance complete. Do not move them automatically or break the source hierarchy.

## Dependencies and runtime applicability

The locked graph remains unchanged since the F11 Axe addition: lockfile v3, 660 entries, 6 direct production and 19 direct development dependencies, 5 known extraneous optional/WASM entries, and no missing/invalid packages. The read-only production-classified audit reports 0 vulnerabilities. The full-tree audit reports 11 known findings: 10 high and 1 low, affecting the Vinext/Vite/Cloudflare development-and-runtime toolchain and transitive packages.

No `use server` directive or Server Function endpoint was found, so no confirmed current exploit path was established for the RSC-related advisory. That absence is applicability evidence, not a blanket assertion that the beta runtime is immune. Classification: **DEDICATED MAINTENANCE REQUIRED BEFORE PRODUCTION LAUNCH**, not a feature-work or foundation-merge blocker. Review current official advisories, Vinext/Next/Vite compatibility, built-runtime reachability, and an upgrade/rollback plan in a separate dependency task; do not run `npm audit fix` or combine upgrades with feature work.

## CI, platform, tests, and automated quality

`.github/workflows/validate.yml` is validation-only: pull request, `main` push, or explicit manual trigger; `ubuntu-24.04`; exact action pins; read-only contents permission; no production environment/secrets; Resend writes and indexing forced off; full local-equivalent validation; history scanning only on an explicit manual run; bounded private-safe failure artifacts. The GitHub Actions API reported **0 workflow runs** on 2026-09-05. Status: **LOCAL CONFIG ONLY / HOSTED CI UNVERIFIED**. F14 did not trigger a run.

Linux compatibility remains **EXPECTED, NOT VERIFIED**. Node APIs, argument-array subprocesses, LF policy, case/path checks, and platform-optional packages support the expectation; only a real hosted Linux pass can upgrade the claim.

Final local baseline:

| Layer | Result |
| --- | --- |
| Node | 142/142 |
| Playwright | 21/21 |
| Focused accessibility | 9/9 |
| Typecheck | PASS |
| Lint | PASS: 0 errors, 4 known `no-img-element` warnings |
| Build and artifact | PASS |
| Current/history secret scan | 0/0 findings |
| Git, supply-chain, integrations, resources, cross-platform, time, deployment, recovery | PASS |

No test category or count was lost. Automated accessibility covers representative Axe scans, skip/navigation focus, address combobox keyboard behavior, touch, reduced motion, visible focus, and multi-width reflow. It is not WCAG certification. Manual launch gaps are: real NVDA task completion; actual browser text/400% zoom; Windows forced colors; phone/tablet portrait and landscape; real configured Turnstile; real Google suggestions; and end-to-end contact/provider behavior only under explicit non-destructive authorization.

Performance/resource checks preserve request caps, bounded provider-body streaming, 31-day calendar windows, 2,000-event caps, at-most-five map suggestions, bounded in-memory attempt/duplicate/planning state, constant-work health, deadlines, and no automatic retry storms. `public/og.png` remains a reviewed 1.75 MiB warning below the 10 MiB hard limit.

Time checks preserve `America/Los_Angeles`, date-only arithmetic, DST review behavior, client timestamp distrust, same-day/under-24/overnight-under-48 separation, disabled holiday dates, and deterministic source sitemap generation.

## Integration readiness matrix

| Integration | Implementation state | Production readiness | Safe fallback / required owner action |
| --- | --- | --- | --- |
| Resend | Implemented, optional, write-capable, provider-gated; disabled in F14 | **NOT PRODUCTION-READY / UNVERIFIED** | Direct public email/phone/portal remain available, but the visible form returns a safe 503 when disabled. Before launch either verify key, sender/domain, intended recipient, explicit production gate, mailbox retention, and a one-time authorized smoke, or intentionally change launch scope/UI in a separate task. |
| Cloudflare Turnstile | Implemented, optional; complete key pair required | **NOT PRODUCTION-READY / UNVERIFIED** | May remain off. If used, verify hostname restrictions, site/secret pairing, environment assignment, failure behavior, and accessibility in the provider dashboard and real UI. |
| Google Maps | Implemented, optional, server-side read-only; disabled in F14 | **NOT PRODUCTION-READY / UNVERIFIED** | Personalized travel review and unavailable-suggestion behavior fail safely. If used, verify server-key restrictions, APIs, quota/billing, private origin, production origin, and preview isolation. |
| Private calendar | Implemented, optional, server-only read-only; absent in F14 | **NOT PRODUCTION-READY / UNVERIFIED** | Conservative `Request for Review` fallback is launch-safe. Verify business ownership, secret URL recovery, provider retention/access, and intended production assignment if enabled. |
| Precise Petcare | Link-only; no API/write integration | **LINK READY; ACCOUNT/CONTINUITY UNVERIFIED** | Verify public links, owner/MFA recovery, outage behavior, authorized emergency access, and approved active-care continuity. It remains Client-record authority. |
| SMS | Consent UX/guidance only; no send provider | **BLOCKED / NOT ACTIVE** | Do not activate until provider, number/A2P, consent system, STOP/HELP, suppression, retention, reconciliation, gating, and testing are separately approved. |
| Payments | No integration | **BLOCKED / NOT ACTIVE** | Precise Petcare link behavior only; any future payment path needs separate authority/design. |
| Webhooks | No endpoint/signing secret | **BLOCKED / NOT ACTIVE** | Add only for a concrete provider with authenticity, replay, idempotency, reconciliation, and safe retry design. |

## Accessibility, hosting, domain, and launch boundary

Source-side deployment and headers pass. The reviewed source defines fixed canonical/legacy redirects, HTTPS upgrade CSP, no `unsafe-eval`, self-default CSP with explicit Turnstile/current-asset allowances, frame-ancestor protection, MIME/referrer/permissions controls, one-year conservative HSTS without preload/subdomain expansion, opt-in indexing, no automatic deployment, exact-SHA release records, rollback, and build-artifact privacy checks. CSP `unsafe-inline` remains a documented **MEDIUM** residual needed by the current framework; nonce/hash hardening is deferred until a tested runtime plan exists.

Read-only public observations on 2026-09-05 found: canonical home 200 over HTTPS; apex 308 to `www`; health 200 with `no-store`; robots allowing indexing; sitemap 200; and CSP, HSTS, MIME, frame, referrer, and permissions headers present. Public DNS resolved the apex through Cloudflare, `www` to `custom-domains.chatgpt.site`, and visible Google mail/SPF/DMARC records. These observations do not prove dashboard ownership, recovery, complete zone inventory, or the deployed Git SHA.

The public artifact emits request-time sitemap `lastmod` values and HSTS `includeSubDomains`, unlike the reviewed source contract. That confirms active version/platform behavior remains unreconciled. Status: **LAUNCH BLOCKER / POST-MERGE OWNER TASK** until the Sites dashboard identifies active version, exact source SHA, rollback version, environment-name assignments, preview inheritance, log/retention behavior, and any host-level header additions. Do not redeploy merely to discover provenance.

Hosted previews are **NOT CONFIGURED / EXTERNALLY UNKNOWN**. If enabled later, verify that production write secrets are not inherited, indexing is off, no private calendar/Client data is present, and provider credentials are separate or absent. Actual production-secret inheritance would be `HIGH`; the nonexistent/unknown preview itself does not block feature work.

Domain runtime behavior is currently healthy, but registrar ownership, lock, MFA/recovery, autorenew/payment continuity, a dated DNS inventory, rollback records, and preservation of MX/SPF/DKIM/DMARC remain owner tasks. Do not replace a full zone to change web records.

## Backup, account recovery, and active-care continuity

F13 provides a successful deterministic fresh-worktree reconstruction, recovery policy, runbook, manifest template, restore isolation rules, release-record template, current/history scans, and a passing recovery check. It proves source reconstruction, not external backups or provider recovery.

Owner verification remains required for securely stored secrets/recovery codes and independent factors; GitHub, Sites/OpenAI, registrar/DNS, Workspace/mail, Precise Petcare, Resend, Cloudflare, Google Cloud, calendar provider, and any future provider; active/rollback Sites versions; DNS inventory; Workspace/mail retention/export; Precise Petcare outage/export behavior; and the optional independent private Git bundle/mirror decision. These are owner/operations controls, not code bugs.

During active care, inaccessible Precise Petcare records with no approved minimum-necessary fallback can directly threaten animal/client safety. The owner must select and document an approach under `operations/38-continuity-backup-provider-plan.md`, including authorization, minimum data, secure storage/access, update cadence, destruction/expiry, outage activation, and emergency handoff. Do not create a Client-data copy in code or Git.

## Entry criteria

### Feature development

Feature development may resume when this F14 result is reviewed and the new work starts from clean `main` after merge or another exact explicitly approved checkpoint. Every task must use a dedicated branch, read `AGENTS.md`, perform the applicable business-reference preflight, keep placeholders inactive, run targeted tests plus `validate`, push, and seek review. Open owner/launch tasks may remain tracked because production-launch readiness is not a prerequisite for ordinary code work.

### Foundation merge

Before merging F0–F14 to `main`:

1. Verify the exact F14 remote SHA and a clean F14 branch.
2. Fetch current `github/main`; repeat merge-base and merge-tree/conflict review.
3. Open/review the F14 pull request and require a green hosted `Validation` run on the exact head SHA.
4. Confirm zero unresolved repository engineering `CRITICAL`/`HIGH` defects.
5. Use a separate merge-only task and clean checkout/worktree; preserve the unrelated dirty local `main` work exactly.
6. Make no feature, policy, dependency, provider, hosting, DNS, or deployment change during the merge.
7. Run post-merge `doctor`, `check:foundation`, and `validate:full`; verify exact local/remote `main` SHA.
8. Treat deployment as a separately authorized task.

Branch protection requiring `Validation` is **RECOMMENDED BEFORE/AT MERGE and REQUIRED BEFORE PRODUCTION LAUNCH** after the first hosted run proves the check name/stability. For a solo owner, require the one material validation check without unnecessary review bureaucracy. F14 does not configure protection.

### Production launch

Before real public production use:

- **Code complete:** approved launch scope is explicit; exact commit is reviewed; dependency applicability/maintenance is resolved; local and hosted full validation pass; no launch-scoped business placeholder is presented as approved.
- **Host complete:** active and rollback Sites versions map to exact SHAs; environment assignments, indexing, runtime assumptions, preview isolation, host-added headers, logs/retention, canonical/apex/HTTPS, health, robots, sitemap, assets, and rollback are verified.
- **Provider complete:** intended Resend/contact behavior is verified or explicitly excluded with an honest usable fallback; any enabled Turnstile, Google, or calendar setup is restricted, paired, isolated, and smoke-tested without unsafe writes; Precise links/recovery are checked.
- **Manual QA complete:** NVDA, 400%/text zoom, forced colors, orientation/responsive, keyboard/touch, estimator/planner, Privacy/Terms/SMS wording, 404/errors, canonical/headers/indexing, health, and any authorized provider path pass.
- **Accounts/recovery complete:** business ownership, MFA, independent recovery, secret manager, registrar renewal/lock, DNS inventory/mail preservation, Sites rollback, Workspace/mail, Precise Petcare, and provider recovery are confirmed privately.
- **Privacy/operations complete:** owner/legal/privacy disposition exists for historical Client-pet media and public internal references; active-care continuity is approved before operations rely on it.

## Owner/dashboard and manual task register

| Boundary | Required owner action | Timing |
| --- | --- | --- |
| GitHub | Verify business ownership/MFA/recovery; obtain first hosted run; enable `Validation` branch protection after proof | Before merge/launch as above |
| Sites/OpenAI | Record active/rollback version and SHA; environment names/assignments; preview inheritance; runtime/header behavior; log retention | Before launch |
| Registrar/DNS | Verify ownership, lock, MFA/recovery, autorenew/payment; create dated zone inventory; preserve mail records | Before launch |
| Password/secret manager | Verify recoverable production values and independent recovery codes/factors; no plaintext repository copy | Before launch |
| Workspace/mail | Verify admin recovery, inquiry/consent retention/access/correction/deletion, and continuity | Before launch |
| Precise Petcare | Verify owner/MFA recovery, link/account behavior, retention/export/outage capability, emergency access, active-care method | Before operations/launch |
| Resend | Decide form launch scope; verify account/domain/sender/recipient/key/gate/retention and authorized smoke | Before launching the form |
| Turnstile | If enabled, verify hostname, paired keys, environment assignment, failure UX, accessibility | Before enabling |
| Google Maps | If enabled, verify project ownership/billing/quota/API/key restrictions/origin/preview separation | Before enabling |
| Calendar | If enabled, verify ownership, recovery, retention/access, production-only secret assignment | Before enabling |
| SMS/payment/future providers | Keep inactive until a separate approved implementation/operations task | Before any activation |
| Privacy/legal | Resolve consent/history disposition for nine images and publication boundary for internal references | Before launch sign-off |
| Active-care operations | Approve minimum-necessary offline continuity and emergency handoff without Git/public storage | Before relying on active-care outage readiness |
| Independent Git backup | Decide whether a private verified bundle/mirror adds value; record provenance if adopted | Optional, post-merge |

Practical manual pre-launch QA: complete representative home/navigation/contact/estimator/planner/portal tasks with NVDA; actual text zoom through 400%; Windows forced colors; phone/tablet portrait and landscape; keyboard-only and touch; any configured Turnstile and Google suggestions; exact production canonical/apex/headers/health/404/robots/sitemap/assets; Privacy/Terms/SMS disclosure; and one explicitly authorized non-destructive contact smoke if the form is in scope. Do not send a real inquiry during routine validation.

## Engineering and debt register

The only required near-term code task is a dedicated dependency-maintenance/applicability review before launch. No code task is required before feature development or the foundation merge beyond ordinary conflict/validation work. Optional work is not promoted into a blocker.

| Item | Severity | Type / owner | Feature blocker | Merge blocker | Launch blocker | Follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| Full-tree 10 high/1 low advisories, beta Vinext/RSC/Vite stack | HIGH advisories; applicability unconfirmed | Engineering | No | No | Yes, review/remediate or explicitly accept with evidence | Dedicated dependency maintenance before launch |
| Exact active/rollback Sites SHA and source-contract drift | HIGH launch provenance | Owner/hosting | No | No | Yes | Post-merge hosting reconciliation |
| Active-care offline continuity method | HIGH operational | Owner/operations | No | No | Yes for operational readiness | Approved continuity task before active care relies on outage handling |
| Historical nine Client-pet images/consent | HIGH privacy finding | Owner/legal/privacy | No | No | Owner disposition required | Separate consent/history review; no automatic rewrite |
| Internal references in public Git | HIGH publication-boundary finding | Owner/legal/security + authority maintainer | No | No | Owner disposition required | Classify/sanitize/private-move only with authority-preserving plan |
| Dual status/header in pricing-care manual | MEDIUM authority hygiene | Business owner/reference maintainer | No, unless that manual is the only needed authority | No | No for current scope | Dedicated business-reference cleanup |
| Hosted CI/Linux never executed | MEDIUM | Engineering/GitHub owner | No | Yes | Yes | First PR run; then branch protection |
| Manual accessibility/provider QA | MEDIUM | Owner/manual QA | No | No | Yes | Pre-launch checklist |
| Provider/account/DNS recovery unverified | MEDIUM to HIGH by boundary | Owner | No | No | Yes | Owner/dashboard checklist |
| CSP `unsafe-inline` | MEDIUM residual | Engineering/runtime | No | No | No, documented acceptance | Revisit only with tested nonce/hash support |
| `public/og.png` 1.75 MiB | LOW | Engineering/design | No | No | No | Optional optimization with asset review |
| Four existing `<img>` lint warnings | LOW | Engineering/UI | No | No | No | Optional scoped UI/performance task |
| Five extraneous optional/WASM npm entries | LOW | Engineering/tooling | No | No | No | Investigate with dependency maintenance; no broad cleanup |
| Possible unused Leaflet CSS | LOW | Engineering/UI | No | No | No | Optional evidence-based cleanup |
| Source-text test coupling | LOW | Engineering/test | No | No | No | Prefer behavior tests when touching affected code |
| macOS/UNC behavior, visual regression, Lighthouse, staging | INFO | Deferred | No | No | No | Add only for a concrete need |

## Unresolved business authority and placeholder safety

The holiday/peak-date calendar is `PLACEHOLDER`; no holiday dates or automatic holiday fees are active. Access/home security, emergency veterinary authorization, medication administration consent, shared care agreement, overnight addendum, behavior agreement, media consent, vacation care-plan approval, and training/certification scope matrix are also placeholders. Transport and advanced medication/safety claims therefore remain personalized/manual review rather than automated acceptance. Current approved logic references govern triage/scope without replacing the missing Client-facing agreements.

Cancellation semantics are published from the approved policy but are not automatically calculated by the estimator. That is an intentional scope boundary, not missing authority for the current estimator. Future functionality touching any placeholder must stop automatic decisions and obtain a `CURRENT / APPROVED` source first. No placeholder was accidentally activated.

## Foundation command and post-foundation workflow

`npm run check:foundation` is **IMPLEMENTED** as a logic-reusing orchestration of existing read-only Git, current-secret, supply-chain, integration, resource, cross-platform, time, deployment, and recovery checks. The established `validate` command continues to name those constituent checks explicitly because repository policy checks inspect that contract, then adds Node tests, typecheck, lint, build, and artifact validation; `validate:full` adds E2E. The shortcut duplicates no test/build/E2E work and creates no new scanner, test framework, service, or infrastructure.

Default workflow after F14:

1. Start from clean current `main` or another exact approved checkpoint.
2. Create a dedicated feature branch/worktree; never implement directly on `main`.
3. Read `AGENTS.md`; run `doctor` and the applicable business-reference preflight.
4. Implement narrowly with placeholders inactive and provider writes off unless explicitly authorized.
5. Run targeted tests, `check:foundation`, and `validate` (`validate:full` for meaningful completion).
6. Inspect diff/status, push the exact branch, and obtain review/hosted CI.
7. Use a separate merge-only task; run post-merge validation and verify SHAs.
8. Perform any deployment in a later separately authorized exact-SHA task.

Do not delete foundation branches or worktrees automatically. Later cleanup is optional: verify the branch is pushed, verify each worktree has no unique uncommitted work, intentionally remove exact worktrees, then prune stale metadata only with authorization. The canonical checkout relocation is already complete and blocks neither feature, merge, nor launch; F14 performed no relocation.

## Complete go/no-go matrix

| Area | Status | Severity | Owner | Feature blocker | Merge blocker | Launch blocker | Required action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Source control/lineage | PASS; merge simulation clean | INFO | Engineering | No | No | No | Recheck current tips in merge-only task |
| Secrets | PASS, 0 current/0 history | INFO | Engineering/owner | No | No | No | Preserve gates and secret manager |
| Privacy | Code boundary passes; owner reviews open | HIGH historical/governance | Owner/privacy | No | No | Conditional yes | Resolve photos/internal-reference disposition |
| Business authority | Current behavior coherent; one manual status ambiguity | MEDIUM | Business owner | No* | No | No current-scope blocker | Resolve manual header before sole reliance; preflight every change |
| Dependencies | Production 0; full tree 10 high/1 low | HIGH advisory | Engineering | No | No | Yes | Dedicated applicability/upgrade task |
| Testing | 142 Node/21 browser/9 focused a11y | INFO | Engineering | No | No | No | Maintain counts/coverage |
| Integrations | Gates/fallbacks pass; external config unverified | MEDIUM/HIGH launch | Owner + engineering | No | No | Yes for integrations in scope | Verify intended provider states |
| Observability | Redacted/bounded diagnostics pass | INFO | Engineering | No | No | Host retention unverified | Verify host logs/retention |
| Performance/resources | PASS; one size warning | LOW | Engineering | No | No | No | Optional image optimization |
| Cross-platform | Windows verified; Linux expected | MEDIUM | Engineering | No | Yes as evidence condition | Yes | First hosted Linux pass |
| Time | PASS | INFO | Engineering | No | No | No | Preserve canonical helpers |
| Accessibility | Automated PASS; manual gaps | MEDIUM | Owner/manual QA | No | No | Yes | Complete manual pre-launch QA |
| CI | Configured; zero hosted runs | MEDIUM | GitHub owner | No | Yes | Yes | Green PR run, then protection |
| Deployment | Source PASS; exact active artifact unknown | HIGH launch | Hosting owner | No | No | Yes | Exact-SHA/version/env reconciliation |
| Backups | Source recovery PASS; external recovery unverified | MEDIUM | Owner | No | No | Yes for launch recovery sign-off | Verify accounts/DNS/Sites/Workspace/Precise |
| Active-care continuity | Owner decision required | HIGH operational | Owner/operations | No | No | Yes for operational launch | Approve minimum-necessary outage method |
| Hosting | Public endpoints work; source drift/provenance unresolved | HIGH launch | Hosting owner | No | No | Yes | Reconcile active/rollback SHA and host behavior |
| Domain/DNS | Public web/mail evidence healthy; recovery/inventory unverified | MEDIUM | Registrar/DNS owner | No | No | Yes for resilience sign-off | Verify ownership/recovery and inventory |
| Account recovery | Unverified | HIGH launch/operations | Owner | No | No | Yes | MFA/independent recovery verification |
| Provider readiness | Optional providers safe-off; Resend form not ready | HIGH launch scope | Owner/provider | No | No | Yes | Verify or explicitly exclude each launch integration |

`*` A future feature whose only claimed authority is the ambiguous manual must pause for owner clarification; normal unrelated feature work may proceed.

## Risk register and unresolved decisions

| Severity | Current result |
| --- | --- |
| CRITICAL | None found. No secret/private build exposure, broken lineage, unsafe production write, failing core task, or authoritative business-rule conflict was found. |
| HIGH | Historical Client-pet media remains in public history; internal-reference publication boundary unresolved; full-tree high advisories need applicability maintenance; production artifact/SHA and provider/account recovery are launch-unverified; active-care offline continuity requires owner approval. These are previously known or launch/owner risks, not a new material engineering defect requiring F14 remediation. |
| MEDIUM | No hosted Linux CI run; manual accessibility gaps; dual manual status/header; external DNS/hosting/provider/log-retention facts; CSP `unsafe-inline` residual. |
| LOW | `og.png`, four existing image lint warnings, possible Leaflet CSS, optional/WASM tree entries, source-text test coupling. |
| INFO | Optional private Git mirror, macOS/UNC, staging, visual regression, Lighthouse, monitoring expansion, and future providers remain deferred. |

Final unresolved owner decisions are: historical photo consent/history treatment; public/private boundary for internal references; cleanup of the dual-status pricing-care manual; launch contact/provider scope; Sites active/rollback version and environment mapping; preview inheritance; registrar/DNS/account recovery; active-care offline continuity; independent Git backup; and whether/when optional providers are enabled. None authorizes code to invent policy or dashboard state.

## Validation record

F14's before/after executable counts are unchanged: Node 142→142, E2E 21→21, focused accessibility 9→9, lint 0 errors/4 known warnings, production audit 0, full audit 10 high/1 low, and package lock unchanged. The documentation and orchestration change adds no test, dependency, provider, infrastructure, or business behavior.

Required final commands and results:

| Command | Result |
| --- | --- |
| `npm run doctor` | PASS — ready locally |
| `npm run env:summary` | PASS — safe names/state only; provider writes disabled |
| `npm run check:git-safety` | PASS |
| `npm run scan:secrets` | PASS — 0 findings |
| `npm run scan:secrets:history` | PASS — 0 findings |
| `npm run check:supply-chain` | PASS |
| `npm run check:integrations` | PASS |
| `npm run check:resources` | PASS with known 1.75 MiB `og.png` review warning |
| `npm run check:cross-platform` | PASS |
| `npm run check:time` | PASS |
| `npm run check:a11y` | PASS — 9/9 |
| `npm run check:deployment` | PASS |
| `npm run check:recovery` | PASS |
| `npm run check:foundation` | PASS |
| `npm run deps:summary` | PASS — locked graph structurally healthy |
| `npm run test` | PASS — 142/142 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — 0 errors/4 known warnings |
| `npm run build` | PASS |
| `npm run check:build-artifact` | PASS |
| `npm run e2e` | PASS — 21/21 |
| `npm run validate` | PASS |
| `npm run validate:full` | PASS — 21/21 browser after full standard gate |
| `npm run audit:dependencies` | PASS — 0 production-classified vulnerabilities |
| `npm run audit:dependencies:all` | REVIEW — 11 known findings (10 high/1 low), no files changed |
| `git diff --check` | PASS |
| `git status` | Clean after the single F14 commit |

No new foundation infrastructure was added. No production deployment, merge, provider/account/MFA/DNS/hosting change, production-data access, Client export, active-care shadow record, business-policy change, dependency upgrade, lockfile drift, force push, history rewrite, repository relocation, earlier-worktree change, feature work, or F15 work occurred.
