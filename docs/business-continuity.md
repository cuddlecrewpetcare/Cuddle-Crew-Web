# Business Continuity Runbook

> Status: CURRENT ENGINEERING RUNBOOK
>
> Audience: business owner/operator
>
> Scope: concise first actions during outages or loss. The `CURRENT / APPROVED` Continuity / Backup Provider Plan controls Client authorization, emergency handoff, access/privacy, welfare, and provider assignment. This runbook does not authorize a new channel, backup provider, data copy, account change, DNS change, or deployment.

## First five actions

1. Protect immediate animal welfare and personal safety.
2. Identify the affected system, current active Services, next essential care deadline, and whether an external write has an unknown outcome.
3. Use the most specific current authority: Precise Petcare for Client-specific operational records, reviewed Git SHA for source, provider/registrar dashboard for external configuration, and the approved continuity plan for handoff.
4. Preserve evidence and the last known-good copy. Do not reset, overwrite, delete, blindly retry, or rotate unrelated credentials.
5. Use only existing approved communication and care paths. Record facts and reconcile when the authoritative system returns.

For any restore, follow: **ANALYZE → IDENTIFY AUTHORITY → VERIFY BACKUP → RESTORE TO ISOLATED TARGET → VALIDATE → COMPARE → SWITCH → MONITOR → CLEAN OLD COPY LATER**.

## Incident cards

### Laptop or SSD loss

1. If compromise is plausible, revoke the lost device's sessions from a trusted device; rotate only exposed credentials.
2. Recover GitHub and critical accounts through independent MFA/recovery paths.
3. Clone the repository, fetch `github`, and check out the exact known-good branch/SHA.
4. Install the pinned prerequisites and run `npm run setup:local` then `npm run doctor`.
5. Recreate `.env.local` from `.env.example` plus the approved password/secret manager. Never copy it through Git or ordinary sync.
6. Run required scans and `npm run validate:full` before treating the environment as ready.
7. Confirm the lost device did not contain uncontrolled Client exports or active-care material.

### GitHub unavailable or repository lost

1. Preserve local clones/worktrees and inventory exact refs plus uncommitted work.
2. Attempt owner account recovery.
3. Validate an approved private mirror/bundle or another complete clone in an isolated location.
4. Resolve the expected exact Git SHA and run `git fsck` and validation.
5. Create or change a source remote only with explicit owner authorization.
6. Treat a deployed/minified website artifact as last-resort evidence, not canonical source.

### Website host outage

1. Check the provider status and identify the selected Sites version/SHA if available.
2. Confirm the intended last-known-good and rollback SHAs.
3. Reproduce the build and artifact checks locally from the exact SHA.
4. Use other existing approved Client communication channels while the public site is unavailable.
5. Restore or redeploy only in a separately authorized production task; then run non-writing smoke checks and record the result.

### Precise Petcare outage during active care

This is `IMMEDIATE / ACTIVE-CARE CRITICAL` and currently a **HIGH unresolved risk** because an approved practical offline method is not documented.

1. Identify the next essential care deadline and immediate welfare/safety need.
2. Use only the owner-approved minimum-necessary outage method, if one has been established, to obtain current schedule, address/access, essential care/medication, safety, and emergency-contact information.
3. Share only the minimum necessary with an authorized person through an approved secure method.
4. Follow the Continuity / Backup Provider Plan for Client contact, authorization, backup-provider scope, accepted responsibility, access transfer, and welfare priority.
5. If no approved method exists, contact the Client/authorized emergency contact through an existing approved path and arrange explicit responsibility transfer. Do not use an unapproved caregiver.
6. Record care and communications safely, prevent duplicate medication, and reconcile the authoritative record in Precise Petcare when service returns.

Do not create a shadow client database, export entire Client accounts, place active-care data in Git, or treat stale notes as current authority.

### Internet outage

1. Protect current active care using the same approved minimum-necessary method described above.
2. Use an existing approved phone/device/network fallback if already available; do not invent a new communication promise.
3. Record time-sensitive facts without exposing them in public or broadly synced storage.
4. Reconcile to Precise Petcare and normal communication systems after connectivity returns.

### Google Workspace, Drive, or email outage

1. Check provider status and preserve evidence of undelivered/unknown messages.
2. Use an existing approved business phone or Precise Petcare communication path when appropriate and already authorized.
3. Avoid blind resends when delivery outcome is unknown.
4. Restore account access through independent recovery; do not create duplicate email infrastructure during the incident.
5. Reconcile important communications and documents when service returns.

### Domain outage, expiry, or account lockout

1. Prioritize registrar account recovery and renewal/control.
2. Compare against the reviewed DNS inventory when one exists.
3. Change only exact affected records; preserve MX, SPF, DKIM, and DMARC.
4. Verify TLS, canonical redirect, web routes, and mail after observable propagation.
5. Use an existing approved fallback contact channel while domain services recover.

### Phone loss or MFA lockout

1. Use an independently stored recovery code or secondary approved factor.
2. Revoke the lost device/session where appropriate.
3. Prioritize accounts required for active care, then domain/mail, source, and hosting.
4. Rotate credentials only when exposure is plausible.
5. Review circular dependencies before the next incident.

### Secret exposure

1. Stop further output and identify provider/type without recording the value.
2. Revoke/disable, replace, and store the replacement only in an approved secure source.
3. Remove tracked exposure, determine whether Git history is affected, and preserve safe evidence.
4. Run both current and history secret scans.
5. Treat history rewriting as a separate explicitly authorized incident task.

### Malware or ransomware

1. Disconnect the suspected device and do not trust attached/synced copies.
2. Preserve controlled evidence.
3. Recover on a clean device from an independent verified source.
4. Verify checksums/exact Git refs and rotate credentials based on exposure.
5. Do not overwrite the last known-good backup with a newly produced unverified copy.

### Accidental deletion or corruption

1. Determine exact affected scope and authority.
2. Try provider/application undo or version history.
3. Use Git history for tracked source.
4. Use a verified provider export or independent backup for outside state.
5. Restore into an isolated location, validate, compare, and switch deliberately.

## Priority matrix

| System | Authority | Impact | RTO | RPO | Current fallback | Owner action |
| --- | --- | --- | --- | --- | --- | --- |
| Current active-care records | Precise Petcare | Welfare/safety | `IMMEDIATE / ACTIVE-CARE CRITICAL` | Current information required | Client/emergency-contact and approved continuity process; offline method unresolved | Approve/test minimum method |
| Precise Petcare account | Provider | Active care/bookings | `IMMEDIATE` during care | Very little loss tolerable | Approved Client/emergency-contact path | Verify recovery/export/offline access |
| Domain/DNS | Registrar/DNS provider | Website and mail | `SAME DAY` | Current reviewed config | Existing approved contact path | Verify recovery and inventory |
| Workspace/mail | Google/provider | Communications/records | `SAME DAY` during active issue | Important current records | Existing approved phone/Precise Petcare path where applicable | Approve retention/export/recovery |
| Git source | Exact reviewed SHA/history | Development/release | `WITHIN FEW DAYS`; faster during incident | Important work pushed promptly | Local clone; future approved mirror/bundle | Approve independent copy |
| OpenAI Sites | Sites version plus exact source SHA | Public site/inquiries | `SAME DAY` or `WITHIN FEW DAYS` | Last-known-good version/config | Existing approved communication paths | Verify active/rollback version |
| Resend | Delivery provider; mailbox holds communication | New inquiries | `SAME DAY` | Avoid losing accepted inquiries | Static business email/contact alternatives already present | Verify account/domain/retention |
| Calendar, Maps, Turnstile | Providers; optional | Degraded planning/contact | `LOW URGENCY` to `WITHIN FEW DAYS` | Recreatable configuration | Request for Review/manual review/direct contact | Verify ownership/configuration |

## Manual fallback rules

- Use only current, already approved phone, email, Precise Petcare, Client emergency-contact, or continuity paths.
- Do not promise a standing backup sitter. A substitute must be approved, within scope, Client-authorized where required, and must actually accept responsibility.
- Prioritize water, feeding, required medication, elimination, containment/environment, and authorized emergency veterinary care as applicable.
- Do not omit material medication/behavior/access safety information, but share only what the authorized care task requires.
- Website, Maps, calendar, or Turnstile outages may degrade to direct contact or personalized review; they do not justify unsafe automation.

## Private recovery contact-list template

Keep the populated list outside this public repository in an approved private location. Do not record account IDs, recovery codes, private phone numbers, credentials, or physical storage locations here.

| Category | Provider/support | Owner account confirmed | Independent recovery confirmed | Last reviewed | Notes/reference |
| --- | --- | --- | --- | --- | --- |
| Precise Petcare |  |  |  |  |  |
| Registrar/DNS |  |  |  |  |  |
| Google Workspace/mail |  |  |  |  |  |
| GitHub |  |  |  |  |  |
| OpenAI Sites/hosting |  |  |  |  |  |
| Insurer |  |  |  |  |  |
| Resend |  |  |  |  |  |
| Turnstile/Cloudflare |  |  |  |  |  |
| Google Cloud/Maps |  |  |  |  |  |
| Private calendar |  |  |  |  |  |

## Owner-incapacity decision

Classification: **OWNER ACTION REQUIRED / DEFERRED**.

If the owner chooses, establish a private trusted-contact plan that covers current Service schedule, how responsibility is accepted, the approved backup-provider/client-emergency-contact workflow, minimum necessary access to critical systems, and how access is revoked after the event. Do not put emergency credentials or Client information in this repository.

## After recovery

1. Confirm welfare and responsibility transfer.
2. Confirm Client/authorized contacts understand the outcome.
3. Reconcile Precise Petcare, mail, provider, access, and billing/refund records under their controlling policies.
4. Deactivate temporary access and account for keys/codes.
5. Record a public-safe deployment or incident entry when warranted; store sensitive evidence privately.
6. Update the runbook and owner checklist if a real gap was found.

See [Backup, Disaster Recovery, and Recovery Readiness](backup-disaster-recovery.md) for the complete inventory, classifications, verification, restore, and owner-decision model.
