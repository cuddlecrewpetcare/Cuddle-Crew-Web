# Observability and Recovery Foundation

> Status: CURRENT TECHNICAL FOUNDATION
>
> Baseline: F7 audit from F6 checkpoint `8ca1b69ca1d51080ac6e9100ebacb8daedb43730`
>
> Scope: Safe diagnostics, error boundaries, health, troubleshooting, recovery, and incident response. This document does not create business, privacy, retention, contractual, or provider policy.

## Current observability inventory

The application uses lightweight local/runtime diagnostics rather than a monitoring platform. Server API routes can emit bounded structured events through `app/lib/observability.ts`. Each event has an explicit safe schema: timestamp, level, event, operation, provider, numeric status, random request ID, sanitized provider request ID, duration, normalized category/outcome, and result class. Arbitrary metadata, raw causes, payloads, URLs, headers, and environment values are not accepted.

Current surfaces are:

| Scope | What exists | What it proves |
| --- | --- | --- |
| Local development | `doctor`, `env:summary`, Git/supply-chain/integration/secret checks, port/PID reporting | Local prerequisites and configuration shape only; no provider health claim |
| Tests | Node assertions and Playwright line output; failure-only screenshots/traces and ignored HTML report | Synthetic application behavior and browser flow |
| Build | TypeScript, ESLint, Vinext/Vite/Cloudflare build output | Compilation/build health, not provider or production health |
| Runtime application | Safe framework logs, structured API diagnostics, client-safe error UI, minimal `/api/health` | Process response and categorized failures |
| Providers | Configuration state, normalized failure/outcome, safe duration, and bounded request IDs where returned | What the app observed; not independent provider availability |
| Future production | Hosting/platform logs and any future approved monitoring destination | **DEFERRED** pending access, retention, privacy, and operational ownership review |

There is no log file writer, external analytics backend, alerting service, distributed trace collector, durable metrics store, or incident-management platform in this repository.

## Logging levels and redaction

- `DEBUG`: local development detail such as successful read duration or an optional integration being disabled. The helper suppresses debug events outside development.
- `INFO`: meaningful accepted writes, duplicate suppression, or safe security decisions that are useful without indicating a fault.
- `WARN`: degraded behavior, rate limiting, rejected provider shape, or configuration that prevents a requested feature.
- `ERROR`: unexpected application/provider failure, invalid required configuration, or ambiguous external-write outcome.

Expected input validation is normally returned without a log. Harmless control flow is not an error. Normal successful reads are debug-only to prevent production noise.

Never log secrets, API keys, authorization/cookie headers, passwords, environment values, full contact bodies, names/emails/phones, exact addresses, access instructions, lockbox/alarm information, travel dates, pet medical/behavior/care details, payment data, private calendar content or URL, private provider origins, raw provider bodies, or private production data. Logs use only the explicit safe schema. A hashed fingerprint is still private and must not be logged. Provider IDs are retained only after strict token sanitization and length bounding.

File logging is **NOT NEEDED**. Existing `*.log`, framework logs, and `.cache/local-dev/` paths are ignored. If a future file sink is approved it must be bounded, rotated/cleaned deliberately, redacted, access-controlled as applicable, and never committed.

## Error taxonomy and boundaries

The intentionally small application taxonomy is:

- `INPUT_VALIDATION`
- `SECURITY_REJECTED`
- `CONFIGURATION`
- `PROVIDER`
- `INTERNAL`
- `NOT_FOUND`
- `RATE_LIMIT`
- `DUPLICATE`
- `UNAVAILABLE`

Provider adapters retain the F6 taxonomy: `TIMEOUT`, `AUTH_OR_CONFIG`, `RATE_LIMIT`, `PROVIDER_UNAVAILABLE`, `VALIDATION_REJECTED`, and `UNKNOWN`. External-write outcomes remain distinct: `NOT_ATTEMPTED`, `CONFIRMED_FAILURE`, provider accepted (`ok: true`), and `UNKNOWN_OUTCOME`.

The internal flow is:

```text
raw internal cause
  -> normalized safe provider/application category and outcome
  -> redacted structured diagnostic
  -> client-safe status and actionable message
```

Raw errors, stacks, local paths, internal thresholds/reasons, credentials, and provider payloads never enter client responses. Development stack traces may remain in the local terminal; safe synthetic test traces may remain in ignored failure artifacts. The global error page deliberately ignores `error.message` and `error.stack` and provides retry/home/contact actions.

HTTP behavior uses 2xx for success, 400/413/415/422 for invalid or unacceptable input, 429 plus `Retry-After` for local rate limiting, and 502/503 for confirmed upstream failure or unavailable/ambiguous delivery. Duplicate accepted contact requests are safe 2xx results. The public body remains stable; API responses add a random server-generated `X-Request-ID` where the F7 helper is used. Client-supplied correlation IDs are not trusted.

## Provider and latency diagnostics

Provider calls distinguish configuration disabled/missing, timeout, authentication/configuration rejection, provider rate limiting, provider unavailability, validation rejection, confirmed failure, acceptance, and unknown outcome. Contact, Turnstile, calendar, address validation, address suggestions, and route-duration boundaries record safe elapsed milliseconds on completion or failure. No payload size/content, destination, client identifier, calendar event, or secret is recorded.

Resend acceptance may include its sanitized request ID. A timeout or transport exception on a write remains `UNKNOWN_OUTCOME`; it is not reported as confirmed failure and is not blindly retried. Existing contact idempotency preserves the same write key across a reviewed retry. Address/calendar read failures retain their conservative public fallbacks. Route-duration failure does not erase a successfully validated address; it produces personalized travel review.

Security events are deliberately sparse: local rate-limit rejection, Turnstile rejection, honeypot suppression, duplicate suppression, and malformed provider response. IPs, fingerprints, attempted values, and thresholds are not logged or returned. Local rate limiting, provider rate limiting, and duplicate suppression remain separate event/category concepts.

## Health model

- **Local environment health:** `npm run doctor`; read-only, fast, deterministic, local, non-destructive, secret-safe, and provider-call-free.
- **Application liveness:** `GET /api/health`; a minimal no-store process response with `status` and timestamp. It does not inspect credentials or providers.
- **Readiness:** the app can render and serve safe fallbacks with optional providers disabled. Individual integration readiness is reported separately by configuration shape and runtime results.
- **Dependency configuration health:** doctor/env summary identify missing or incomplete variable names without values.
- **External provider health:** never inferred from local configuration. A future live check must be explicit, isolated, read-only where possible, redacted, and outside startup/build/standard validation.

The existing health endpoint is **IMPLEMENTED** as liveness. Kubernetes-style probes and a separate readiness endpoint are **NOT NEEDED** for the current hosting architecture. Doctor remains unchanged in responsibility. `env:summary` adds the F7 baseline and notes that structured diagnostics are local/runtime only. A new `diagnostics` or `check:runtime` command is **NOT NEEDED** because it would duplicate doctor, env summary, existing safety checks, and the health endpoint. A separate failure-summary command is also **NOT NEEDED** because the Node/Playwright reporters and baseline document already provide the required signal.

Startup/build never contacts application providers. Optional missing configuration activates a documented fallback or unavailability response. An incomplete Turnstile pair is distinguishable from an external outage. Resend requires both its key and explicit write gate. Maps requires its key plus private origin for full address checking. Diagnostics name variables only in the existing doctor documentation/output and never print values.

## Processes, shutdown, and artifacts

Ports 3000 and 3100 remain owned by interactive development and the E2E runner respectively. There is no configured port-3001 fallback in the current foundation. Doctor reports an occupying PID/name where possible but ownership stays unknown until inspected. Never stop every Node process. Stop only the exact repository-owned terminal/process; E2E terminates only the server tree it created and must release port 3100 on success or failure.

Graceful shutdown means stop accepting work, finish or safely abort the owned operation, release the port, and clean only disposable temporary resources. The current framework owns application signal handling; additional signal machinery is **NOT NEEDED**.

Preserve failed Playwright screenshots/traces, safe line output, and relevant build/test logs until diagnosis is complete. Successful generated output is regenerable. Never preserve secrets, raw client/provider payloads, private production data, or authenticated screenshots. `clean:generated --dry-run` previews exact known targets; actual cleanup is evidence-based and never the first diagnostic step.

## Permanent troubleshooting order

1. Inspect the exact reported failure without deleting evidence.
2. Inspect Git status, branch, worktree, source SHA, and relevant diff.
3. Run `npm run doctor`.
4. Inspect the targeted component and provider configuration names/status.
5. Reproduce the narrow failure once.
6. Inspect safe logs and retained artifacts using the request/test identifier.
7. Run the narrow owning test/check.
8. Repair the affected code or configuration and verify the root cause.
9. Clean only a proven stale generated target if necessary.
10. Reinstall one affected dependency/browser only when corruption is shown.
11. Use full `npm ci` only for a missing/irrecoverable installation or clean checkout.
12. Rebuild the broader environment only as a last resort.

A retry, longer timeout, cache clear, reinstall, or process kill is a symptom treatment until evidence shows it addresses the root cause. Do not increase retries/timeouts or weaken validation to hide a fault.

## Recovery classification

| Class | Examples | Rule |
| --- | --- | --- |
| `SAFE / REVERSIBLE` | Inspect status/logs, rerun a targeted test, restart an owned server, regenerate build output, make a corrective commit | May proceed when in task scope |
| `TARGETED / REVIEWED` | Remove one proven stale cache, reinstall one corrupt dependency/browser, revert a reviewed bad commit, provider rollback/reconciliation | Resolve exact target, preserve evidence, validate pre/post state |
| `DESTRUCTIVE / EXPLICIT AUTHORIZATION REQUIRED` | Hard reset, broad clean, delete data/database, wipe dependency/cache trees without evidence, rewrite history, force push, delete/prune a worktree | Never use as routine recovery |

A known-good checkpoint is an exact Git SHA with a recorded passing validation baseline, understood/clean working tree, and verified remote SHA. “Last working version” is not sufficient. For a bad commit, inspect the diff and prefer a corrective commit or normal `git revert`; do not rewrite shared history.

Dependency recovery: doctor -> exact `npm ls`/integrity evidence -> targeted repair -> specific generated cleanup -> affected reinstall -> `npm ci` only if necessary. Build recovery: compiler error -> known-good comparison -> toolchain -> variable names/config shape -> build-output cleanup if stale -> rebuild -> dependency investigation only with evidence. E2E recovery: confirm 3100 free -> inspect owned lifecycle -> inspect failure artifact -> reproduce one test -> inspect safe browser/server output -> confirm synthetic provider modes -> rerun target -> full E2E after repair.

Provider outage recovery: identify the provider/category/outcome; preserve fallback; do not edit unrelated code, rotate credentials without exposure evidence, blindly retry writes, or weaken validation; communicate a generic useful client message. Missing configuration recovery identifies the variable name and required/optional status, corrects documentation if wrong, and never fabricates a value.

## Security and privacy incidents

For exposed credentials: stop output, identify provider/type without the value, revoke, rotate, update secure local storage, remove tracked exposure, evaluate history remediation separately, then rerun current/history scans. Deleting the visible line is not remediation.

For private-data exposure: stop further exposure, preserve access-controlled evidence, remove the current public surface when authorized, identify reachable history/backups/provider copies, record scope, and escalate owner/legal/security review as appropriate. Do not erase evidence before scope is understood.

Severity is proportional:

| Severity | Examples |
| --- | --- |
| `SEV-1 / CRITICAL` | Active credential compromise, destructive production write, public private-client data, payment/security compromise |
| `SEV-2 / HIGH` | Significant privacy/security failure, production-write ambiguity, unavailable core functionality |
| `SEV-3 / MEDIUM` | Degraded provider integration or repeated non-destructive failure |
| `SEV-4 / LOW` | Local-only tooling, cosmetic, or logging issue |

For a meaningful incident: identify the affected system and exact time window; determine current/historical exposure and whether writes occurred; identify provider/account without secret values; preserve safe evidence; stop further harm; avoid destructive cleanup; define remediation; validate; and document outcome/follow-up. `docs/incidents/README.md` provides a lightweight record template. Trivial local test failures do not need incident records.

## Deferred production decisions and risk register

Formal SLO/error-budget infrastructure is **NOT NEEDED**. Durable metrics are **DEFERRED** until an approved destination, privacy basis, access/retention policy, and operational owner exist. Distributed tracing is **NOT NEEDED**. Sentry, Datadog, New Relic, OpenTelemetry, Prometheus, Honeycomb, centralized log SaaS, and equivalents are **DEFERRED / NOT AUTHORIZED**. No source-map publication or error-symbolization service is added; any future production use requires a separate privacy/security review.

| Severity | Current finding |
| --- | --- |
| Critical | None found: no public secret/private payload logging or destructive diagnostic path |
| High | None found: client errors do not expose stacks/paths/provider payloads; unknown writes remain distinct |
| Medium | Production platform log access, retention, alert ownership, and live-provider diagnostic policy remain unresolved |
| Low | In-memory rate limits, duplicate state, and logs are instance-local; no durable cross-instance view exists |
| Info | Lightweight structured logging and server-generated correlation IDs are implemented; file logs and monitoring SaaS are not |

Future decisions: who owns production incident response; what hosting logs exist and how long they persist; whether an approved privacy-safe alert destination is needed; whether fixture-backed provider success contracts merit maintenance; and whether scale ever justifies durable metrics or cross-instance rate limiting. None authorizes live diagnostics, new storage, or telemetry today.

## Reference sources used for F7

- `docs/business-reference/README.md`
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md` (`CURRENT / APPROVED`)
- `docs/data-privacy.md`
- `docs/integrations-side-effects.md`
- `docs/local-development.md`
- `docs/dependency-supply-chain.md`
- `docs/testing-quality.md`
- `CONTRIBUTING.md`

F7 changes no business rule, pricing, estimator/planner decision, SMS/legal policy, booking/payment behavior, approved service claim, or hosting configuration.
