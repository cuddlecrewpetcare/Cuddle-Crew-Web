# Backup Manifest and Restore Checklist Template

> TEMPLATE ONLY — this directory must not contain an actual backup, provider export, Client data, secret, recovery code, encryption key, or populated private manifest.

Use this template outside the repository in an approved private backup location when a real owner-authorized backup is created. Keep only this blank public-safe template in Git. A populated manifest may itself reveal sensitive system, location, timing, or record information and belongs with the protected backup unless a reviewed redacted record is appropriate.

## Backup manifest

```yaml
backup_id: "sanitized-system-date-version"
created_at: "ISO 8601 instant with offset or Z"
created_by_role: "approved owner/role; avoid private identifiers in public records"
source_system: "system/category, not a secret endpoint"
source_sha_or_version: "exact Git SHA, provider version, or export/schema version"
source_authority: "canonical system at time of copy"
contents_categories:
  - "approved category only; never list raw Client details"
confidentiality_class: "PUBLIC | INTERNAL | PRIVATE | SENSITIVE | SECRET"
retention_class: "SHORT-TERM ROLLBACK | OPERATIONAL | LONG-TERM RECORD | LEGAL/POLICY-DEFINED | UNRESOLVED"
approved_destination_class: "REMOTE SOURCE CONTROL | PRIVATE CLOUD STORAGE | PASSWORD/SECRET MANAGER | ENCRYPTED OFFLINE STORAGE | EXTERNAL PROVIDER RETENTION | LOCAL DEVICE COPY"
encryption_status: "NOT REQUIRED FOR PUBLIC DATA | ENCRYPTED WITH APPROVED TOOL | REVIEW REQUIRED"
integrity_algorithm: "for example SHA-256; do not invent a custom algorithm"
integrity_digest: "record with the protected manifest; never substitute for encryption/authentication"
size_or_safe_count: "optional plausibility metadata only"
provider_or_schema_version: "exact version when known; otherwise UNRESOLVED"
retention_review_due: "approved policy date/state; do not invent a period"
restore_destination_class: "isolated/disposable target first"
restore_authority_after_switch: "system that becomes canonical only after approval"
last_restore_verification: "date/result or NOT YET VERIFIED"
known_limitations: "recovery gap, compatibility, provider, or access limitation"
owner_approval_reference: "safe opaque reference; no credentials or private path"
```

Do not record secret values, recovery codes, encryption keys, Client names, addresses, access instructions, medical/behavior details, travel dates, private provider URLs, private physical/cloud storage locations, raw export fields, or identifying incident evidence.

## Creation checklist

- [ ] Exact source authority and scope identified.
- [ ] Backup is actually needed; reproducible/cache/build state excluded.
- [ ] Owner explicitly authorized any external copy or provider export.
- [ ] Minimum fields/categories selected.
- [ ] Destination class, access owner, and retention class approved.
- [ ] Private/sensitive data encrypted at rest where practical.
- [ ] Encryption key has an independent recovery path and is not stored with an unencrypted copy.
- [ ] Name includes source, date/time, version/schema, and a sanitized identifier; does not use `latest`, `final2`, or `newest` as authority.
- [ ] Copy completed without printing or logging private contents.
- [ ] Size/count is plausible and integrity digest recorded.
- [ ] Previous known-good copy has not been overwritten.

## Restore verification checklist

Follow: **ANALYZE → IDENTIFY AUTHORITY → VERIFY BACKUP → RESTORE TO ISOLATED TARGET → VALIDATE → COMPARE → SWITCH → MONITOR → CLEAN OLD COPY LATER**.

- [ ] Incident scope and intended recovery point identified.
- [ ] Manifest source/version/schema and expected checksum are trusted.
- [ ] File/object exists, size/count is plausible, and checksum matches.
- [ ] Archive/export opens without altering canonical state.
- [ ] Destination is isolated/disposable and access-controlled.
- [ ] Application/provider/schema compatibility reviewed.
- [ ] Restore completed without exposing secrets/private data.
- [ ] Counts, structure, permissions, required records, and key invariants validated.
- [ ] Restored state compared with the intended authority and recovery gap documented.
- [ ] Rollback remains available if the restored copy is wrong.
- [ ] Owner approved the switch to canonical state.
- [ ] Service monitored after the switch.
- [ ] Temporary copies/access are removed later under the approved retention process.

## Git bundle/mirror verification

For a future owner-approved private Git bundle or mirror:

1. Record the source remote and expected exact SHA.
2. Run `git bundle verify` for a bundle or `git fsck` for a mirror/clone.
3. Clone into a new disposable directory.
4. Resolve the expected branch/tag/SHA explicitly.
5. Confirm no `.env.local`, backup archive, provider export, Client data, or ignored generated state is present.
6. Run `npm run setup:local`, `npm run doctor`, required scans, and validation as appropriate.
7. Record the safe result; retain the prior known-good copy until verified.

Do not create, upload, or rotate an actual mirror/bundle merely because this template exists.

## Failure record

If creation or verification fails, record only safe metadata:

```yaml
backup_id: "sanitized identifier"
job_time: "ISO 8601 instant"
source_class: "safe category"
result: "FAILED | INTEGRITY_MISMATCH | RESTORE_FAILED"
size: "safe optional value"
checksum_status: "MATCH | MISMATCH | NOT_AVAILABLE"
follow_up_owner_role: "approved role"
```

Never overwrite the last known-good backup with the failed candidate. Investigate source, destination, access, integrity, compatibility, and restore behavior before producing and testing a new candidate.
