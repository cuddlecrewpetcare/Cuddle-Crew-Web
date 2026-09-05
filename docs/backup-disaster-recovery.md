# Backup, Disaster Recovery, and Recovery Readiness

> Status: CURRENT ENGINEERING FOUNDATION
>
> Baseline: F13 audit from F12 checkpoint `b41c87582da98ca97d608c5195774037e165bcf1`
>
> Scope: state classification, backup boundaries, source and provider continuity, restore procedures, qualitative recovery objectives, verification, and owner decisions. This document does not create a backup, export provider data, grant account access, change business policy, or authorize production work.

## Governing boundaries

The business-reference hierarchy controls business meaning. The `CURRENT / APPROVED` Continuity / Backup Provider Plan controls emergency care handoff, minimum-necessary sharing, Client authorization, animal welfare, and owner unavailability. Precise Petcare remains the operational authority for current Client-specific profiles, care instructions, access details, emergency contacts, schedules, bookings, and approved Service plans.

This repository is public-source-safe. Never place Client records, provider exports, contact submissions, access information, private schedules, raw incident evidence, credentials, recovery codes, or production backups in Git. Safety and privacy both control: continuity must make essential active-care information available through an approved secure method without creating a broad shadow record system.

The permanent recovery rules are:

1. Identify authority and exact scope before copying or restoring anything.
2. Protect unique state before spending effort on reproducible state.
3. Use an exact Git SHA, provider version, export version, or dated manifest—not “latest.”
4. A copy is untrusted until its existence, integrity, compatibility, and restore path are verified.
5. Restore first into an isolated/disposable target; never overwrite canonical state in a rehearsal.
6. A backup must not have weaker privacy or access control than its source.
7. SYNC is not backup: synchronized deletion, corruption, malware, or account lockout may affect every synced copy.
8. Do not create an external backup, provider export, account, mirror, or private-data copy without explicit owner authorization.

## Audit evidence and limits

The F13 repository audit found:

- one GitHub source remote named `github` and a distinct OpenAI Sites deployment remote named `sites`;
- a complete pushed F0–F12 foundation lineage ending at the exact F12 checkpoint;
- no application database, object store, Redis instance, queue, file-upload store, or authenticated Client-record store;
- no tracked backup archive, database dump, provider export, `.env.local`, private key, or recovery-code file;
- reproducible Node/npm/toolchain configuration in Git and generated dependencies/build state outside Git;
- validation-only CI with seven-day failure-artifact retention and no production secret or deployment capability;
- one deployment-record template but no repository record establishing the active production SHA;
- external dependencies whose account ownership, MFA recovery, provider retention/export support, and dashboard configuration cannot be proven from repository evidence;
- no documented approved offline method for obtaining minimum essential active-care information during a Precise Petcare/internet/device outage.

The audit did not access `.env.local` values, provider dashboards, production data, mailboxes, Drive, Precise Petcare, registrar/DNS accounts, Sites version history, MFA settings, or recovery codes. Accordingly, external recovery claims remain `UNVERIFIED` or `UNRESOLVED` until the owner checks them privately.

Historical lineage note: the task described source main as `3b443a6dcafb0cb3f4ed38b9335cacc606ec44b22`, but that object is not present in the fetched repository. Repository history and the existing technical references identify `3b443a6dcafb0cb3f4ed4129714d357e3e059816` (`Merge Phase 12C SMS compliance`) as the source-main checkpoint from which the foundation lineage descends. No history was rewritten or “corrected.”

## State inventory and backup classification

The classifications below may be combined. `UNIQUE / AUTHORITATIVE` means losing all valid copies loses irreplaceable state. `EXTERNAL-AUTHORITY` means the provider or approved outside system controls the live record. `REPRODUCIBLE`, `DERIVED`, `TRANSIENT`, and `CACHE` mean the item normally should be regenerated. `LOCAL-PRIVATE`, `SECRET`, and `BUSINESS-CRITICAL` determine protection, not whether Git is appropriate.

| State | Classification | Backup treatment | Restore authority and reason |
| --- | --- | --- | --- |
| Reviewed Git commits and branch history | `UNIQUE / AUTHORITATIVE`, `BUSINESS-CRITICAL` | `MUST BACK UP` through pushed GitHub history; `SHOULD BACK UP` with an owner-approved private bundle/mirror | Exact reviewed commit and history; unpushed work is not protected |
| Business-reference documents | `UNIQUE / AUTHORITATIVE`, some `INTERNAL`, `BUSINESS-CRITICAL` | `MUST BACK UP` through Git/GitHub; optional exact-SHA private archive | Status and source hierarchy determine authority; avoid drifting external “master” copies |
| Application source, tests, scripts, safe configuration, public assets | `UNIQUE / AUTHORITATIVE` in reviewed Git | `MUST BACK UP` through pushed Git history | Exact reviewed SHA; public deployment is not source authority |
| `package.json`, `package-lock.json`, `.nvmrc` | `UNIQUE / AUTHORITATIVE` reproducibility recipe | `MUST BACK UP` with Git source | Reconstructs the reviewed dependency/toolchain graph |
| `.github/workflows/validate.yml` and technical runbooks | `UNIQUE / AUTHORITATIVE` engineering configuration | `MUST BACK UP` with Git source | Recreates validation policy, not external dashboard settings |
| Deployment records and public-safe incident records | `UNIQUE`, `BUSINESS-CRITICAL` when populated | `MUST BACK UP` in Git/GitHub when safe | Exact SHA, result, rollback, and safe evidence references |
| `.env.example` | `REPRODUCIBLE CONFIGURATION SCHEMA` | `MUST BACK UP` with Git | Names/classes only; never values |
| `.env.local` values and production environment assignments | `SECRET`, `LOCAL-PRIVATE`, `BUSINESS-CRITICAL` | `MUST BACK UP` only through an approved password/secret manager or owner-approved encrypted recovery copy | Recreate values from secure authority; never Git, normal Drive, or plaintext archives |
| API keys, deploy credentials, passwords, MFA recovery material | `SECRET`, `BUSINESS-CRITICAL` | `MUST BACK UP` using a trusted password/secret manager and an independent recovery path | Provider account plus protected recovery material; never repository documentation |
| `node_modules`, npm cache, Playwright browsers | `CACHE`, `REPRODUCIBLE` | `DO NOT BACK UP / REGENERATE` | `npm ci`/setup and pinned caches/toolchain |
| `.next`, `.vinext`, `dist`, `out`, `.wrangler`, TypeScript state | `DERIVED`, `REPRODUCIBLE` | `DO NOT BACK UP / REGENERATE` | Exact source plus pinned build recipe |
| Coverage, Playwright reports/traces/screenshots, logs | `TRANSIENT`, `DERIVED`, sometimes temporary evidence | `DO NOT BACK UP / REGENERATE`; retain failure evidence only while needed | Owning test/incident procedure; never a source or business backup |
| CI failure artifacts | `TRANSIENT`, `DIAGNOSTIC` | `OPTIONAL BACKUP` only for an active failure; current seven-day provider retention is sufficient | Synthetic evidence only; not source or provider backup |
| OpenAI Sites versions/artifacts | `DERIVED`, `USEFUL RECOVERY LAYER`, `EXTERNAL-AUTHORITY` | `EXTERNAL PROVIDER RESPONSIBILITY`; preserve exact source SHA/version record | Useful rollback layer, never equivalent to full source/history |
| Sites environment assignments, domain binding, active version, platform settings | `EXTERNAL-AUTHORITY`, `BUSINESS-CRITICAL` | `SHOULD BACK UP` as secret-free inventory/provenance; secret values stay in secret manager | Host dashboard plus reviewed repo expectations; currently unverified |
| Domain registration and DNS zone | `EXTERNAL-AUTHORITY`, `BUSINESS-CRITICAL` | `MUST BACK UP` access/recovery; `SHOULD BACK UP` dated secret-free DNS inventory | Registrar/DNS provider is live authority; preserve mail and web records |
| Gmail/business mailbox and Google Drive/Workspace documents | `EXTERNAL-AUTHORITY`, `PRIVATE`, potentially `BUSINESS-CRITICAL` | `MUST BACK UP` account recovery; file/mail export or independent-copy policy is `UNRESOLVED` | Google Workspace/Drive remain authority; sync/version history alone may be insufficient |
| Precise Petcare Client and care records | `EXTERNAL-AUTHORITY`, `PRIVATE`/`SENSITIVE`, `BUSINESS-CRITICAL` | `EXTERNAL PROVIDER RESPONSIBILITY`; export/recovery verification `REQUIRED OWNER/OPS DESIGN` | Precise Petcare remains authoritative; do not copy into Git or website storage |
| Minimum information needed during active care | `SENSITIVE`, `BUSINESS-CRITICAL`, Client-specific | `UNRESOLVED`; owner must approve minimum fields, secure method, access, expiry, and reconciliation | Safety-critical during outage, but broad duplication creates material privacy/security risk |
| Resend delivery history | `EXTERNAL-AUTHORITY`, `PRIVATE`, noncanonical | `OPTIONAL BACKUP` / provider retention unresolved | Business mailbox is the likely operational inquiry record; Resend logs are not assumed permanent |
| Business mailbox inquiry/communication records | `EXTERNAL-AUTHORITY`, `PRIVATE`, potentially `LONG-TERM RECORD` | `SHOULD BACK UP` only under approved retention/access/export policy | Mailbox/provider authority; exact retention remains unresolved |
| Turnstile and Google Maps account/configuration | `EXTERNAL-AUTHORITY`, credentials `SECRET`, behavior `REPRODUCIBLE` | Account recovery `MUST`; configuration names `SHOULD`; request data `DO NOT BACK UP` | Recreate keys/config after secure account recovery; rotate based on exposure, not routinely |
| Private calendar | `EXTERNAL-AUTHORITY`, `PRIVATE`, optional read-only dependency | Account/access recovery `SHOULD`; raw calendar copy `DO NOT BACK UP` without policy | Failure degrades to review, so it is not critical to website safety; provider remains authority |
| Future SMS number/A2P/consent/STOP/HELP state | Future `EXTERNAL-AUTHORITY`, `PRIVATE`, `BUSINESS-CRITICAL` | `MUST BACK UP`/reconcile before activation; currently `UNRESOLVED` | Provider/system-of-record design is required before any send path |
| Future payment identifiers, ledger/reconciliation records | Future `EXTERNAL-AUTHORITY`, `PRIVATE`, `BUSINESS-CRITICAL` | Provider recovery/export/reconciliation required before activation; never PAN/CVV backup | Payment provider and approved accounting records; no current integration |
| Legal, tax, contracts, invoices, insurance, licensing, training records | `UNIQUE`, `PRIVATE`, `BUSINESS-CRITICAL` | `MUST BACK UP`; retention is `REQUIRES OWNER/ACCOUNTANT/LEGAL POLICY` | Approved private business record system; no retention period invented here |
| Editable logos/brand/design originals | `UNIQUE` if no other source exists; possibly licensed | `SHOULD BACK UP` independently with provenance/license | Editable originals are not recoverable from compressed web exports |
| Current web-exported brand assets | `DERIVED` or public source asset | Git for current deployed form; editable original remains separate | Git exact SHA restores site output only |
| OneDrive/local synced folders | `LOCAL DEVICE COPY`, `SYNC`, not authority | `OPTIONAL BACKUP` only when versioned/independent policy is verified | OneDrive deletion/corruption may sync; do not count it alone |
| Worktrees and dirty/uncommitted changes | `TRANSIENT`; unique until committed | Commit and push important completed work; do not back up whole worktrees as canonical | Pushed Git commit is recoverable authority; inspect uncommitted work intentionally |

## Backup destination model

| Destination | Suitable for | Not suitable for |
| --- | --- | --- |
| `REMOTE SOURCE CONTROL` | Public-safe source, history, docs, tests, deployment/incident records | Secrets, Client/provider exports, recovery codes |
| `PRIVATE CLOUD STORAGE` | Approved business documents and encrypted exports with explicit access/retention | Plaintext secrets or a casually shared shadow Client database |
| `PASSWORD/SECRET MANAGER` | Environment values, account credentials, recovery instructions/codes where supported | Source history, large provider exports |
| `ENCRYPTED OFFLINE STORAGE` | Independent recovery material and selected irreplaceable private records | The only copy, or an encrypted set whose key has no independent recovery path |
| `EXTERNAL PROVIDER RETENTION` | Provider-native records/version history subject to verified capabilities | The only unverified recovery plan |
| `LOCAL DEVICE COPY` | Fast working copy and temporary isolated restore | Sole copy of important state or protection from device loss/ransomware |

Apply the 3-2-1 concept proportionally to irreplaceable state: three useful copies, two failure domains/media types, and one copy independent of the primary device/account. For Git source, a local clone plus GitHub plus an optional encrypted private bundle/mirror is a reasonable pattern. Do not mechanically duplicate caches or broad Client exports.

## Source and Git continuity

GitHub protects pushed repository objects; it is source control, not complete business disaster recovery. It does not protect provider dashboard state, domain control, mail, recovery codes, Client records, production-only environment values, or uncommitted changes.

### GitHub continuity

- Keep important completed work committed and pushed promptly.
- Verify local `HEAD` against a freshly fetched explicit `github/<branch>` before relying on the remote copy.
- Keep the local clone as a useful second copy, but recognize that laptop loss may remove it.
- Classification for a periodic private Git bundle or bare mirror: **RECOMMENDED**, because loss/lockout of the public GitHub account would otherwise leave only opportunistic local clones.
- Create no second public remote and transmit no mirror until the owner approves a private destination, access, retention, verification, and deletion process.
- A mirror/bundle contains Git-tracked history only. It should not contain `.env.local`, `node_modules`, ignored Client data, or provider exports.
- Validate a future bundle with `git bundle verify`, clone it into a disposable directory, resolve the expected exact SHA, and run repository checks before trusting it.

### Business-reference protection

The business-reference library is protected by Git history and the GitHub remote. Any optional outside archive must record the exact commit SHA and remain a recovery copy, never an independently edited competing master. Its internal references must remain access-controlled according to the unresolved public-repository-boundary review already recorded in the privacy foundation.

### Dirty worktrees

Uncommitted changes are fragile and exist only in that worktree. Before device maintenance, relocation, or a long interruption: inspect status, finish or intentionally separate the change, commit reviewed work, and push it where appropriate. Never auto-commit unrelated user work. Do not back up Codex worktrees wholesale; preserve committed history through Git and handle unique uncommitted files individually.

## Environment, secrets, MFA, and account ownership

`.env.local` remains ignored. Recover it from `.env.example` plus an approved secure source. Do not place it in Git, a normal Drive/OneDrive folder, a repository archive, CI artifact, ticket, log, screenshot, or plaintext backup bundle.

Every business-critical account should be owner-controlled rather than contractor-owned. The repository expects the following ownership classification, but actual status is unverified:

| Account/system | Expected owner | Recovery requirement | F13 status |
| --- | --- | --- | --- |
| GitHub repository | `BUSINESS OWNER` or business-controlled account | Recovery email, MFA, independent recovery codes, repository ownership | `UNVERIFIED` |
| OpenAI/Sites hosting | `BUSINESS OWNER` or business account | MFA/recovery, project ownership, version/config access | `UNVERIFIED` |
| Domain registrar/DNS | `BUSINESS OWNER` or business account | Renewal/payment continuity, lock, MFA, recovery, DNS inventory | `UNVERIFIED` |
| Google Workspace/Drive/Gmail | `BUSINESS OWNER` or business account | Admin/owner recovery, MFA, data-retention/export policy | `UNVERIFIED` |
| Precise Petcare | `BUSINESS OWNER` or business account | Account recovery, authorized emergency access, provider export/retention verification | `UNVERIFIED` |
| Resend | `BUSINESS OWNER` or business account | Account/domain/API-key recovery and mailbox continuity | `UNVERIFIED` |
| Cloudflare Turnstile | `BUSINESS OWNER` or business account | Zone/widget ownership, MFA, configuration/key recovery | `UNVERIFIED` |
| Google Cloud/Maps | `BUSINESS OWNER` or business account | Project/billing/key restriction recovery | `UNVERIFIED` |
| Private calendar provider | `BUSINESS OWNER` | Account recovery and feed/config recreation | `UNVERIFIED` |
| Future Dialpad/SMS and payment systems | `BUSINESS OWNER` or business account | Number/registration/consent or financial reconciliation recovery before activation | `NOT CONFIGURED` |

Recovery codes must not be committed, pasted into repository documents, or stored in plaintext alongside the device they protect. Keep at least one recovery path independent of the primary laptop and phone. If encrypted offline storage is used, the encryption key must itself be recoverable and must not be stored beside an unencrypted backup. Use established encryption/password-manager products; do not design a custom cryptosystem.

Avoid circular recovery—for example, every critical account depending on one mailbox whose MFA depends on one phone. The owner must privately document independent factors and current recovery contacts without putting identifiers, phone numbers, account IDs, codes, or physical storage locations in Git.

## Domain, DNS, and email continuity

Domain control is business-critical. The owner should privately verify account ownership, current registrar, renewal/autorenew state, payment method continuity, registrar lock, MFA recovery, and transfer-code handling.

DNS inventory classification: **RECOMMENDED**. A future secret-free dated export or manual inventory should include zone/provider, record name, type, target/value where non-secret, TTL, date, provenance, and review state. Never invent current records from public examples. Keep the inventory in an approved private or public-safe location based on its contents.

Web recovery must preserve MX, SPF, DKIM, and DMARC. Do not replace an entire zone merely to repair web A/AAAA/CNAME records. A future DNS restore should compare the reviewed inventory, change only exact affected records, preserve mail records, validate TLS and canonical redirects, wait for observable propagation, and run non-writing smoke checks. DNS changes remain separately authorized from deployment.

## Hosting and deployment continuity

OpenAI Sites is the current production host. Sites version history is a **USEFUL RECOVERY LAYER**, **NOT A BACKUP OF SOURCE**, and its actual retention/rollback behavior is **UNVERIFIED**. The repository cannot establish which SHA is currently active; verify the Sites version history privately before the next deployment.

Recovery requires:

- exact reviewed source SHA and clean working tree;
- pinned Node/npm/install/build commands;
- `.openai/hosting.json` project identity and generated artifact contract;
- secret-free environment-name/assignment inventory;
- domain binding, canonical origin, indexing state, security headers, provider gate state, and Sites version/reference;
- last known-good rollback SHA/version;
- a deployment record containing validation and smoke results.

Host settings not reconstructable from Git alone include active version, domain binding, production values, environment inheritance/assignments, account access, provider credentials, platform log/retention settings, and atomicity/version behavior. Never export secret values merely to document configuration.

No hosting backup product is recommended now: there is no hosted database/object state, and exact source/version history matters more than generated artifacts. Automated hosting/source backup jobs are **NOT NEEDED CURRENTLY**. A simple owner-approved periodic Git bundle/mirror is sufficient guidance. Reevaluate automation only when real unique persistent state exists.

## Provider continuity inventory

| Provider/system | Authority and impact | Repo recreation | Continuity action |
| --- | --- | --- | --- |
| Precise Petcare | Current Client-specific operational authority; potentially `CRITICAL TO ACTIVE CARE` | No | Verify owner/MFA recovery, export/retention capability, outage access, and approved active-care method |
| Google Workspace/Gmail/Drive | Mail and business documents; `HIGH` to communications/records | Partial configuration only | Verify admin recovery, retention/versioning/export, and independent recovery paths |
| OpenAI Sites/Cloudflare runtime | Public website host; `HIGH TO NEW INQUIRIES`, not active-care authority | Build can be recreated; dashboard cannot | Record exact versions/config names and validate rollback procedure |
| Domain registrar/DNS | Website and email routing; business-critical | No live zone recreation without inventory | Verify ownership/renewal/MFA; create reviewed DNS inventory later |
| Resend | Replaceable email delivery; not inquiry authority | Adapter/config names yes, account/domain/key no | Treat mailbox as likely inquiry record; verify provider retention and domain recovery |
| Business mailbox | Important inquiries/communications | No | Approve retention/export/access/recovery policy |
| Turnstile | Optional verification; `DEGRADABLE` but fail-closed for contact when configured | Widget integration yes, account/keys no | Recover account/config; recreate/rotate keys securely if needed |
| Google Maps | Optional address/travel reads; `CONVENIENCE` | Adapter yes, project/key/config no | Recover account/config; personalized travel review is fallback |
| Private calendar | Optional read-only availability input; `DEGRADABLE` | Integration yes, feed/account no | Conservative `Request for Review` fallback; do not copy raw events by default |
| Future SMS | Absent | No | Before activation define number ownership, A2P, consent/STOP/HELP authority, export, reconciliation, and retention |
| Future payment | Absent | No | Before activation define provider/account/export/reconciliation; never back up full PAN or CVV |

Provider export capability should be verified later for Precise Petcare, Google Workspace/mail/Drive, future accounting/billing, future SMS, and future payments. Do not perform exports in this phase. Any future export must define purpose, minimum fields, schema/provider version, encrypted destination, access, retention, deletion, restore use, and compatibility testing.

## Active-care continuity: HIGH unresolved risk

The approved Continuity / Backup Provider Plan requires current instructions to be available through an approved secure process and identifies the minimum-necessary categories for a handoff. The repository does not establish an offline/provider-outage method. Therefore active-care continuity is classified **REQUIRED OWNER/OPS DESIGN** and **HIGH** until verified or approved.

If Precise Petcare, the internet, or the primary device is unavailable during an active Service period, the following may become unavailable:

- current schedule and next care deadline;
- Service address and approved access method;
- feeding, water, elimination, containment, and environmental instructions;
- exact medication name/dose/timing and duplicate-dose status;
- relevant behavior/escape/safety limitations;
- Client/emergency/veterinary contacts and authorization;
- current handoff/backup-provider authorization.

Loss of those categories can create missed care, duplicate medication, unsafe access, inadequate welfare, or an ambiguous responsibility transfer. However copying full Client accounts creates a second sensitive database, additional breach surface, deletion/retention obligations, and stale-instruction risk.

**OWNER DECISION REQUIRED:** choose and document one approved minimum-necessary outage method for current active Clients only. Options may be evaluated privately—provider-supported offline/mobile access, an approved encrypted short-lived current-care summary, or another secure procedure—but F13 does not select or implement one. The decision must define fields, authorization, access control, device-loss behavior, update cadence, expiry/deletion, handoff use, and reconciliation back to Precise Petcare. Do not create a shadow client database.

## Business-document continuity

Outside this repository, inventory and protect at least these categories in an approved private system:

- LLC formation, FBN/DBA, business license, and domain-ownership evidence;
- current insurance policy, certificates, endorsements, claims/contact details, and renewals;
- professional membership and training/certification records;
- signed contracts/templates and approved policies;
- tax, invoice, bookkeeping, banking, vendor, and accounting records;
- editable brand/logo/design sources plus license/provenance evidence;
- account ownership and non-secret provider configuration inventory.

Do not invent retention periods. Tax, invoices, insurance, contracts, incidents, mail, consent, provider logs, and private exports are `LEGAL/POLICY-DEFINED` or `UNRESOLVED` until the owner obtains applicable accountant/legal/insurer/provider guidance. The backup architecture must support the later approved policy and intentional deletion.

## Retention, naming, integrity, and access

Use retention classes rather than one global duration:

- `SHORT-TERM ROLLBACK`: recent versions needed to undo a release/change;
- `OPERATIONAL`: state needed to conduct current business;
- `LONG-TERM RECORD`: approved durable business evidence;
- `LEGAL/POLICY-DEFINED`: period controlled outside this technical document;
- `UNRESOLVED`: no approved period or deletion process yet.

Avoid one constantly overwritten `backup.zip`. Future names should include system/source, UTC or business-local date/time with zone, version/schema where relevant, and a sanitized identifier. Never use `latest`, `newest`, or `final2` as authority.

For meaningful exported files, use a standard checksum such as SHA-256 and record the algorithm/digest in a secret-free manifest. A checksum detects accidental change; it does not encrypt or authenticate the source. Git object hashes provide repository integrity, but the expected commit still must come from a trusted record.

Backups containing private information require encryption at rest where practical, least-privilege access, a named owner, explicit purpose and retention, restore authorization, and intentional deletion. Do not log raw contents or keys. Future job logs may contain only safe time, source class, result, size, checksum, and backup ID.

## Backup verification

A future backup is trusted only after all applicable checks succeed:

1. confirm source system, exact SHA/version/schema, time, and owner;
2. confirm the destination is the approved private class and access is restricted;
3. verify the file/object exists and size/count are plausible;
4. calculate and compare the recorded checksum without exposing contents;
5. open/list the archive or provider export safely;
6. restore to an isolated target;
7. validate schema, application/provider compatibility, permissions, counts, and key invariants;
8. compare with the intended source and document any acceptable recovery gap;
9. preserve the last known-good copy until the new copy and restore are verified;
10. record safe result metadata and remove disposable rehearsal output later.

If verification fails, stop. Do not overwrite the last known-good backup, declare success because a copy command exited zero, or repair canonical state from the suspect copy.

## Restore-first procedure

Every recovery follows this sequence:

**ANALYZE → IDENTIFY AUTHORITY → VERIFY BACKUP → RESTORE TO ISOLATED TARGET → VALIDATE → COMPARE → SWITCH → MONITOR → CLEAN OLD COPY LATER**

Before restoring old state, verify schema/provider format, application version, exact destination, current policy, permissions, and rollback. A restored copy becomes canonical only through an explicit reviewed switch.

### Laptop or SSD loss

1. Recover or replace the device and establish a trusted OS.
2. Install Git, pinned Node/npm, Gitleaks, and required prerequisites.
3. Recover GitHub/MFA through an independent path.
4. Clone the reviewed repository from `github`.
5. Fetch and check out the exact known-good SHA/branch; do not choose by timestamp.
6. Run `npm run setup:local`, then `npm run doctor`.
7. Recreate `.env.local` from `.env.example` and the approved secret manager without printing values.
8. Run `npm run scan:secrets:history` and `npm run validate:full` as appropriate.
9. Reconnect external accounts only when needed and verify configuration names/assignments.
10. Verify no Client/private data was kept insecurely on the lost device. Revoke sessions and rotate credentials only when compromise risk justifies it.

### GitHub repository/account unavailable

1. Preserve existing local clones/worktrees read-only; inventory exact refs and unpushed changes.
2. Recover account access using independent owner/MFA paths.
3. If GitHub recovery is not timely, validate an approved private mirror/bundle or another complete clone in an isolated directory.
4. Resolve the expected exact SHA and run `git fsck` plus repository validation.
5. Establish a replacement private source remote only with owner authorization and record provenance.
6. Treat deployed/minified Sites output as last-resort evidence, not equivalent source or history.

### Repository corruption

Preserve evidence and unpushed work, then prefer a fresh clone or validated bundle over heroic in-place repair. Compare unique uncommitted files carefully. Run `git fsck`, source checks, and full validation before switching. Never reset or clean the only copy.

### Machine reconstruction drill

Use a disposable fresh clone or worktree at the exact known-good SHA, with no `.env.local`. Run setup, Doctor, current/history secret scans as required, and full validation using synthetic/off provider state. This verifies reproducibility without touching production. Delete only the explicitly disposable copy after results are recorded and no evidence is needed.

### Hosting recovery rehearsal

In a non-production local checkout: identify last known-good SHA and rollback SHA; build; run artifact validation; confirm expected non-secret environment names, domain/canonical/indexing/header settings, and provider gate states. Do not create or activate a Sites version without separate authorization.

### Account lockout or phone loss

Use independent recovery codes/factors and the private recovery contact list. Prioritize Precise Petcare during active care, then domain/DNS, Workspace/mail, GitHub, and hosting based on impact. Avoid routing all recovery through one inaccessible mailbox/phone. Revoke a lost device session and rotate exposed credentials based on evidence.

### Malware or ransomware

Disconnect the suspected device, preserve controlled evidence, and do not trust mounted/synced backups from the same environment. Recover on a clean device from an independent verified source. Compare exact Git refs/checksums and rotate credentials according to likely exposure. Do not let synchronization propagate encrypted/corrupt state before containment.

### Accidental deletion or corruption

Identify exact scope and authority, then prefer: application/provider undo or version history; Git history; verified provider export/backup; independent backup. Restore to an isolated target and compare. Do not perform a broad destructive restore first.

## Qualitative RTO and RPO

RTO describes how quickly a capability needs to return. RPO describes how much change can safely be lost. No unsupported numeric SLA is created here.

| System/state | Impact | RTO class | RPO class | Fallback / restore source | Owner action |
| --- | --- | --- | --- | --- | --- |
| Current active-care instructions/schedule/access | Animal welfare and safety | `IMMEDIATE / ACTIVE-CARE CRITICAL` | Current approved information cannot safely be lost during service | Approved minimum-necessary outage method; Precise Petcare reconciliation | Design/approve method |
| Precise Petcare account | Active care, bookings, Client authority | `IMMEDIATE / ACTIVE-CARE CRITICAL` during service; otherwise `SAME DAY` | Very little/current-record loss tolerable | Provider recovery and approved active-care fallback | Verify recovery/export/offline capability |
| Domain/DNS | Website and email routing | `SAME DAY` | Current reviewed zone/config | Registrar recovery and DNS inventory | Verify account/renewal; create inventory |
| Business mailbox/Workspace | Client communications and documents | `SAME DAY` during active issues; otherwise `WITHIN FEW DAYS` | Important current communications should not be lost | Provider recovery; existing approved phone/Precise Petcare channels if applicable | Approve retention/export/fallback |
| Git source/history | Development and deployment recovery | `WITHIN FEW DAYS`; `SAME DAY` during production incident | Very little completed work loss; push promptly | GitHub, local clone, approved mirror/bundle | Approve secondary private copy |
| OpenAI Sites website | New inquiries/public information | `SAME DAY` or `WITHIN FEW DAYS` based on outage | Exact last-known-good deployed SHA/config | Sites version or rebuild exact SHA | Verify active/rollback version |
| Resend | Contact delivery | `SAME DAY` to restore inquiry channel | Mailbox record is more important than provider log | Static business email/other already-approved channel; provider recovery | Verify domain/account/retention |
| Private calendar | Coarse availability aid | `LOW URGENCY` | Fully degradable to review | `Request for Review` | Verify account only |
| Maps and Turnstile | Optional lookup/verification | `LOW URGENCY` to `WITHIN FEW DAYS` | Configuration recreatable | Manual review/direct contact fallback | Verify account/config restrictions |
| Generated dependencies/build/test output | Development convenience | `LOW URGENCY` | Fully recreatable | Pinned source/toolchain | None |

## Business continuity and manual fallbacks

Website failure must not jeopardize active care. The website is primarily public information/new-inquiry infrastructure. Existing Client communication and current care records remain in the approved operational systems.

Only existing/approved channels may be used. Repository evidence supports a public business phone/email, link-only Precise Petcare portal, and conservative manual review states; it does not authorize a new messaging channel or promise a standing backup provider. Follow the concise [business continuity runbook](business-continuity.md) and the approved Continuity / Backup Provider Plan.

Provider impact priority:

- `CRITICAL TO ACTIVE CARE`: Precise Petcare and the approved minimum-current-care information path during an active booking.
- `HIGH TO NEW INQUIRIES/COMMUNICATION`: domain/DNS, business mailbox/Workspace, website hosting, Resend.
- `DEGRADABLE`: private calendar, Turnstile, Google Maps; use existing conservative review/contact behavior.
- `CONVENIENCE`: generated build/test caches and local tools that can be reinstalled.

## Single points of failure and owner incapacity

Known or unverified single points include one owner/operator, possibly one MFA phone, one recovery mailbox, one domain account, one Client-record provider, externally stored production configuration, and one person knowing the recovery procedure. The solo-owner bus factor of one is inherent; do not manufacture organizational complexity.

Owner incapacity is **OWNER ACTION REQUIRED / DEFERRED**. The owner should privately choose a trusted authorized contact and define a limited emergency handoff for current schedule, critical account recovery, Client communication, and animal welfare. Do not store credentials, access codes, backup-provider identity, private contacts, or Client records in this public repository. The approved Continuity / Backup Provider Plan controls any handoff and does not guarantee provider availability.

A private recovery contact list should include provider/support names for hosting, registrar/DNS, insurer, Precise Petcare, Workspace, mailbox, and critical integrations; the repository keeps only a category template in the business-continuity document.

## Disaster severity and response

| Severity | Examples | Response |
| --- | --- | --- |
| `CRITICAL` | Active-care information inaccessible with no safe fallback; domain/account takeover; public Client data; all source copies lost; critical lockout during care | Protect welfare/security, contain, contact authorized parties, preserve evidence, use approved recovery path immediately |
| `HIGH` | Prolonged Precise Petcare/website/email outage; hosting/account loss; only sync protects unique private files; unverifiable backups | Owner action same day; do not invent private copies or overwrite known-good state |
| `MEDIUM` | Laptop loss with verified remote; noncritical provider outage; replaceable configuration loss | Reconstruct from approved source and validate |
| `LOW` | Cache, dependency tree, build artifact, or test-report loss | Regenerate when convenient |

If a backup job/copy fails, preserve the last known-good copy, record safe failure metadata, investigate source/destination/access/integrity, repair, produce a new candidate, and perform an isolated restore verification. Automated backup jobs are **NOT NEEDED CURRENTLY** for this no-database application and **DEFERRED FOR FUTURE PERSISTENT STATE**.

## Recovery drills and cadence

Qualitative cadence:

- After each important phase/release: verify pushed exact SHA and deployment/rollback records.
- Periodically and after account/device changes: verify account recovery/MFA paths without revealing codes.
- After material provider/schema/config changes: review export and restore compatibility.
- Before destructive migration or new persistent-state activation: create and rehearse a verified recovery plan.
- Periodically after the owner approves a source mirror/bundle: verify, clone to disposable location, resolve exact refs, and validate.
- During active-care procedure review: rehearse access to only the approved minimum information with synthetic data; never use real Client data in repository tests.

F13's dedicated worktree and deterministic setup demonstrate reconstruction of the repository environment from the exact F12 SHA. The final F13 report records whether an independent fresh-clone verification was also performed. No provider, DNS, hosting, or active-care data restore was performed.

## Automated recovery check

`npm run check:recovery` is **IMPLEMENTED** and part of standard validation. It is local, read-only, secret-safe, and provider-call-free. It verifies required recovery/authority documents, a named branch and exact SHA, the GitHub source remote, `.env.local` ignore coverage, absence of tracked secret/backup/archive/database/export paths, required restore language, and validation integration.

It may warn before the first branch push or when local/remote refs diverge. It does not prove that an offsite copy exists, an account is recoverable, a provider export works, a backup is current, production is restorable, or the active-care outage decision has been completed.

## Unresolved owner decisions

1. **HIGH:** approve and test a privacy-safe minimum-necessary current-active-care outage method; define fields, access, update, expiry, deletion, device-loss, and Precise Petcare reconciliation.
2. Verify Precise Petcare owner/MFA recovery, provider backup/retention/export capability, and emergency/offline access.
3. Verify business ownership, recovery email, MFA factors, and independent recovery material for GitHub, Sites, registrar/DNS, Workspace, Precise Petcare, Resend, Turnstile, Maps, and calendar.
4. Verify domain autorenew/payment/lock and create a current reviewed DNS inventory that preserves mail records.
5. Verify and record the exact production Sites SHA/version, rollback version, environment-name assignments/inheritance, domain binding, and platform retention/version behavior.
6. Select an approved password/secret manager and independent recovery-code path if none is already established.
7. Approve or decline a periodic encrypted private Git bundle/mirror location, owner, cadence, retention, and restore drill.
8. Inventory critical Workspace/Drive/mail and business/legal/tax/insurance/design records; approve access, retention, export, independent-copy, and deletion policy with appropriate professional guidance.
9. Decide whether internal business-reference documents remain appropriate in a public source repository, consistent with the existing F3 finding.
10. Establish a private recovery contact list and, if desired, a trusted owner-incapacity handoff without placing private details in Git.
11. Verify provider export capabilities and formats later; record schema/version and test compatibility before relying on any export.

## References used

- `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `.gitignore`, `.gitattributes`, `.env.example`, `package.json`, and `package-lock.json`
- `docs/business-reference/README.md`
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md` (`CURRENT / APPROVED`)
- `docs/business-reference/operations/38-continuity-backup-provider-plan.md` (`CURRENT / APPROVED`)
- `docs/business-reference/operations/35-annual-business-policy-audit.md` (`CURRENT / APPROVED`)
- F0–F12 technical foundation documents, deployment/incident templates, CI workflow, Sites manifest, integration registry, repository scripts, tracked-file inventory, branch/worktree history, and preflight validation evidence

No business rule, pricing, cancellation, Overnight, holiday, estimator/planner, SMS legal wording, booking/payment behavior, Client photo, provider account, DNS record, hosting version, or production environment was changed by F13.
