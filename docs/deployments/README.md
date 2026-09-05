# Production Deployment Records

Use this directory only for concise, public-repository-safe production release records when the Sites version history or another owner-controlled system does not already provide an equally reliable searchable record. Do not create a record for a build, validation run, branch push, preview, or undeployed version.

Never guess or backfill an unknown deployment SHA. Never include secret values, provider payloads, Client data, private URLs, account identifiers, internal review reasons, or raw logs.

Suggested filename: `YYYY-MM-DD-short-purpose.md` using the actual production activation date in `America/Los_Angeles`.

```markdown
# Production deployment — YYYY-MM-DD — short purpose

- Environment: production
- Activated at: ISO 8601 instant with offset or Z
- Owner/actor: name or approved role
- Source branch: main
- Source SHA: full 40-character Git SHA
- Remote verification: local SHA matched freshly fetched github/main
- Working tree: clean
- Validation result: commands, pass/fail, test counts, reviewed warnings
- Sites version/reference: safe non-secret identifier if appropriate
- Deployment result: succeeded / failed / rolled back
- Smoke result: health, canonical/apex, critical routes, headers, indexing, assets, provider gates
- Provider gate names/states: names and enabled/disabled status only; no values
- Rollback SHA: full last-known-good Git SHA
- Release notes: user-visible and integration/config-name changes, known limitations
- Incident/follow-up: safe reference or none
```

A rollback receives its own result entry or updates the failed record with the exact rollback SHA, activation time, verification result, and follow-up. Git history is never rewritten to represent a rollback.
