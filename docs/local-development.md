# Local Development

## Where the Environment Lives

The active repository folder contains source, `node_modules`, `.env.local` when needed, framework caches, and ignored project-local state. GitHub stores the reproducibility recipe; it does not store the installed environment.

- Dependencies: `node_modules/` in the local checkout
- Local secrets and optional integration values: `.env.local`
- npm download cache: the user-level location reported by `npm config get cache`
- Playwright browsers: the persistent user-level cache reported by `npx playwright install --dry-run` (normally `%LOCALAPPDATA%\ms-playwright` on Windows)
- Environment fingerprint and diagnostics: `.cache/local-dev/`
- Playwright output: `.cache/local-dev/playwright/`
- Framework state: `.next/`, `.vinext/`, `dist/`, and `.wrangler/`

`node_modules`, browser binaries, local caches, `.env.local`, the fingerprint, logs, and transient test output are intentionally not stored in GitHub.

## What GitHub Stores

GitHub stores `package.json`, `package-lock.json`, `.nvmrc`, `.env.example`, `.gitattributes`, repository scripts, test configuration, VS Code recommendations, `AGENTS.md`, `CONTRIBUTING.md`, and this guide. Those files describe how to reproduce the environment and contribute safely. The computer stores reusable installations and caches.

## Prerequisites

- Windows 10 or 11 with PowerShell and Git
- Node.js 22.17.1, pinned by `.nvmrc`; `package.json` also requires Node 22.13 or newer
- npm 10.9.2, selected by the `packageManager` field
- Gitleaks 8.30.0, installed once as a shared Windows development tool
- VS Code is recommended but not required

This repository uses npm only. Keep `package-lock.json`; do not introduce pnpm, Yarn, or another lockfile. Corepack is not required for npm.

## First-Time Setup

From the repository root:

```powershell
node --version
npm --version
npm run setup:local
```

`setup:local` verifies the pinned tools, dependency/lockfile state, and Playwright Chromium. It skips installs when the local environment is healthy. If `node_modules` is absent, it runs deterministic `npm ci` from the authoritative lockfile. If an existing tree has evidence of missing or invalid packages, it uses non-destructive `npm install` without deleting caches. If the required Chromium binary alone is missing, it installs only Chromium. It never overwrites `.env.local`.

Create `.env.local` from `.env.example` only when an optional live integration is needed:

```powershell
Copy-Item .env.example .env.local
```

Keep unused integrations blank and keep `SITE_INDEXING_ENABLED=false` for ordinary local work.

Install Gitleaks once per Windows machine at `C:\Tools\gitleaks\gitleaks.exe`, add another verified installation to `PATH`, or set `GITLEAKS_PATH` to its executable. Use version 8.30.0. The repository does not download or reinstall this shared tool automatically.

Safe shared installation procedure:

1. Download `gitleaks_8.30.0_windows_x64.zip` and `gitleaks_8.30.0_checksums.txt` from the official Gitleaks v8.30.0 GitHub release.
2. Use PowerShell `Get-FileHash -Algorithm SHA256` and require the result to equal the asset's entry in the published checksum file.
3. Only after that comparison succeeds, expand the archive and copy `gitleaks.exe` to the shared location.
4. Run `npm run doctor` from this repository and require `Gitleaks 8.30.0 available`.

Do not replace the pinned version with an unverified “latest” download. A version change is a dedicated maintenance task.

## Normal Daily Startup

```powershell
npm run doctor
npm run check:git-safety
npm run check:cross-platform
npm run dev
```

Do not reinstall dependencies during normal startup. A new Codex chat, model, or reasoning level does not require environment setup.

## Starting Codex

- VS Code: open the repository folder as the workspace, then start the Codex extension from that window.
- Codex CLI: `Set-Location` to the repository root, then start Codex there.
- Codex desktop local workflow: select or open this local repository as the project.

Local caches belong to this computer and are not available to independent cloud tasks. Cloud tasks may need their own bootstrap process.

## Environment Doctor

Run:

```powershell
npm run doctor
```

The doctor is read-only and non-destructive. It checks the repository root, branch, pinned Node/npm versions, lockfile-to-manifest compatibility, required installed package versions, fingerprint state, Playwright/Chromium availability, Gitleaks availability/version, ports 3000 and 3100, `.env.example` names, `.env.local` presence without values, and disk space. It never installs, fetches, switches branches, kills processes, cleans files, runs a secret scan, or changes the fingerprint.

`PASS` means healthy. `WARNING` is actionable context that does not necessarily block work. `FAIL` exits non-zero and should be repaired before development. Running on `main` is reported as information; the doctor never creates or switches branches.

## Environment Summary

Run:

```powershell
npm run env:summary
```

The summary reports repository identity, branch/commit, tool versions, dependency/fingerprint state, Playwright browser availability, Gitleaks readiness and scan integration, expected port status, disk space, and the test baseline. It reports only environment-variable names/counts, never values, and is safe to paste into a future Codex troubleshooting session.

## Repository Safety

Run:

```powershell
npm run check:git-safety
```

This read-only check verifies the repository root, branch context, exact GitHub fetch/push destination, `github/main` default, tracking branch, line-ending policy, forbidden tracked or staged content, tracked-file size limits, working/staging state, and unexpected lockfile changes. It does not stage, restore, switch, fetch, push, clean, or otherwise modify the repository. A warning requires review; a failure blocks commit/push until corrected.

The command warns about intentional tracked files at 1 MiB and rejects tracked files at 10 MiB. The existing 1.75 MiB `public/og.png` is expected and still requires visible review. Git LFS is not currently needed. See `CONTRIBUTING.md` for branch, commit, merge, conflict, recovery, migration, archive, line-ending, and public-release policy.

## Environment Variables

`.env.example` is the committed name-and-classification template. `.env.local` is local-only and Git ignored.

| Variable | Classification | Normal local behavior |
| --- | --- | --- |
| `RESEND_SEND_ENABLED` | Provider-specific server-side write gate | Keep `false`; a key alone cannot send. |
| `RESEND_API_KEY` | Optional local, server-only | Blank disables delivery; also requires the explicit write gate. |
| `PRIVATE_CALENDAR_ICS_URL` | Optional local, server-only | Blank uses the conservative availability fallback. |
| `TURNSTILE_SECRET_KEY` | Optional local, server-only | Configure only with the public site key. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional, intentionally browser-public | Configure only with the server secret. |
| `SITE_INDEXING_ENABLED` | Local/test control; production launch value is managed separately | Keep `false` locally. |
| `GOOGLE_MAPS_SERVER_KEY` | Optional local, server-only | Blank disables live address/routing calls. |
| `PRIVATE_SERVICE_ORIGIN` | Optional local, server-only | Required only with the Maps server key. |

Never place a server secret in a `NEXT_PUBLIC_` variable. Never print `.env.local`, commit it, or store a plaintext backup in the repository.

## Secret Handling

`.env.example` contains names and safe empty/default values only. `.env.local` may contain real development credentials, is intentionally ignored, and must be rebuilt from an approved password manager or secret-management source. Do not copy its values into source, tests, documentation, reports, screenshots, logs, or browser-public variables. Private keys and credential-export formats are also ignored, but ignore rules are not a substitute for scanning tracked content.

Treat intentionally public values and secrets as different security classes. A `NEXT_PUBLIC_*` value is included in browser code and must never contain a server credential. Resend, private calendar, Turnstile secret, Maps server key, and the private service origin remain server-only.

## Secret Scanning

Gitleaks 8.30.0 is the required baseline scanner. The executable is shared across repositories; this repository owns `.gitleaks.toml`, the redacting wrapper, commands, and policy. Scanner output is captured and reduced to finding count, detector ID, safe file/line, and commit reference. Matched values are never echoed, and temporary redacted reports/snapshots are removed after each run.

Routine current-tree scan, including tracked files and non-ignored untracked files:

```powershell
npm run scan:secrets
```

Deeper scan across Git history and refs:

```powershell
npm run scan:secrets:history
```

The current scan is part of `npm run validate`. The history scan remains separate because it is intended for initial audits, legacy consolidation, suspected exposure, and public-release preparation.

For a suspected false positive, first determine why it matched and whether it could be usable. Prefer making fake data less credential-like. If suppression is still justified, use the narrowest rule/path or exact suppression and document why. Do not add broad allowlists or disable detectors.

Pre-commit hook classification: **OPTIONAL, NOT INSTALLED**. A committed hook is not activated automatically by Git, and silently bypassing commits when the shared scanner is missing would weaken protection. Required validation provides a reliable cross-session gate without changing local Git configuration. Teams may add an explicitly managed hook later that calls the same scanner and fails with a clear recovery message.

TruffleHog classification: **RECOMMENDED FOR DEEP/LEGACY AUDITS**, not installed by default. Use it as a separately approved second opinion for suspected historical exposure, old private repositories, backup archaeology, or migration investigations; Gitleaks remains the routine required scanner.

## Exposed Credential Response

If a finding plausibly represents a real credential:

1. Do not print or paste it.
2. Identify its provider/type and revoke or disable it.
3. Generate a replacement and store it only in `.env.local` or an approved secret store.
4. Remove the hardcoded value and use a server-side environment variable.
5. Determine whether Git-history cleanup is required; deleting it from HEAD is not sufficient.
6. Rerun the current-tree and history scans.

History rewriting is disruptive and requires a separately authorized remediation task, coordination with every clone, and provider rotation first.

## Legacy Project Audits

Before old code or data enters a new public canonical repository: scan the current tree and full history; inspect old environment/config files, backups, logs, and database dumps; identify hardcoded credentials; rotate exposed credentials; migrate only sanitized code/config; and keep private source material and data outside the public repository.

## Reusable Project-Foundation Standard

A future project foundation is incomplete until it has runtime and package-manager pinning, a safe `.env.example`, ignored `.env.local`, a non-destructive doctor, a standard secret scanner, routine and history scan commands, an `AGENTS.md` secret-handling contract, scan-integrated validation, and recorded test/type/lint/build baselines. This is development infrastructure guidance, not application business policy.

## Development Modes

The complete data-handling and retention contract is in [`data-privacy.md`](data-privacy.md). Local development and automated tests must use synthetic data only; do not copy production/Client exports, provider payloads, private calendars, contact submissions, or screenshots into this checkout. Safe schemas and migrations may be versioned after review, but real database contents, backups, and exports remain private and untracked.

- Local development (`npm run dev`): live reads are disabled when their variables are blank. Resend writes additionally require `RESEND_SEND_ENABLED=true`; keep it false for routine work and use only deliberate isolated credentials/recipients if a separately approved live diagnostic is ever needed.
- Automated Node tests (`npm test`): provider requests use injected transports, stubs, or disabled configuration without sending real client messages, creating bookings, or mutating production data.
- Playwright (`npm run e2e`): the E2E server forces the Resend write gate off and contact submission is intercepted before network delivery. Tests do not create a Precise Petcare booking or send real email/SMS.
- Production-like build (`npm run build`): compiles the application and does not itself call Resend, Google, Turnstile, Precise Petcare, or a messaging provider.

Resend is the only implemented email delivery integration. There is no active Dialpad or SMS-sending integration. Turnstile and Google address/routing are optional. Public analytics dispatches privacy-filtered browser events and has no external analytics backend.

## Development Server

```powershell
npm run dev
```

The normal development URL is `http://localhost:3000`. Check `npm run doctor` before starting another server.

## Port Map

| Port | Owner | Purpose |
| --- | --- | --- |
| 3000 | `npm run dev` | Interactive local development |
| 3100 | Playwright web server | Isolated E2E server started and stopped by Playwright |

No repository test or mock service uses another fixed local port.

## Process Conflicts

The doctor reports the port, PID, and process name when possible. Windows may not permit reading another process's full command line, so ownership can be `unknown`.

- An expected repository dev server on 3000 may be reused manually after confirming its terminal and working directory.
- Playwright never reuses port 3100; an occupant must be inspected before E2E starts.
- Never use broad commands such as stopping every `node.exe` process.
- Inspect a specific PID with `Get-Process -Id <PID>` and the terminal that launched it. Stop only the known repository-owned session, preferably with `Ctrl+C` in that terminal.

## Targeted Testing

After application source changes, run `npm run build` once before a targeted Playwright command; `npm run e2e` performs that build automatically for the full browser suite.

```powershell
npm test
node --experimental-strip-types --test tests/api-security.test.ts
npx playwright test e2e/public-flows.spec.ts
npx playwright test -g "contact form"
```

Use the narrowest relevant check while editing. Do not repeatedly run a full build and E2E suite after tiny changes.

Select the targeted check by risk: business decisions use the relevant business-rule/care-planner file; API changes use route, negative security/privacy, and type checks; critical UI changes use the relevant Node contract and focused browser flow; dependency/tooling changes use supply-chain checks before full validation. The complete mapping and failure policy are in [`testing-quality.md`](testing-quality.md).

## Standard Validation

```powershell
npm run validate
```

This runs the read-only repository, supply-chain, integration, resource, cross-platform, time, deployment-configuration, and recovery-foundation checks; the redacted current-tree secret scan; Node tests; typecheck; lint; the production build; and the generated build-artifact privacy/shape check.

## Full Validation

```powershell
npm run validate:full
```

This runs standard validation followed by all Playwright E2E/smoke tests.

## Playwright

Playwright 1.62.1 uses persistent Chromium binaries in the user-level Playwright cache. `npm run setup:local` checks the executable before considering installation. Reinstall a browser only when it is missing, corrupt, or incompatible with a changed Playwright version. The public `npm run e2e` command builds first so it is safe to run independently; `validate:full` reuses the build it already produced through the internal `e2e:run` script.

The Playwright server uses the production-like Vinext output on dedicated port 3100, one local worker for reliability, and a bounded startup timeout. The repository-owned runner starts it without a visible Windows console and terminates that exact process tree after the run, including failures. It refuses to proceed if startup fails rather than reusing an unrelated server. CI may use two workers. Successful runs do not retain screenshots or video; screenshots and traces are kept on failure, under `.cache/local-dev/playwright/`, and the HTML report never opens automatically.

Do not clear `%LOCALAPPDATA%\ms-playwright` during routine troubleshooting.

## Dependency Changes

Use npm intentionally:

```powershell
npm install <package>
npm uninstall <package>
```

Review both `package.json` and `package-lock.json`, run `npm run setup:local` to refresh the ignored fingerprint, then validate. Do not regenerate the lockfile or upgrade unrelated packages casually.

Run `npm run check:supply-chain` for the local structural/provenance guard and `npm run deps:summary` for a credential-safe inventory. The complete dependency, lifecycle, audit, build, artifact, license, and recovery contract is in [`dependency-supply-chain.md`](dependency-supply-chain.md).

## Environment Fingerprint

`.cache/local-dev/fingerprint.json` records a non-secret hash of the lockfile, dependency-relevant manifest fields, Node major/minor, and npm version. `setup:local` creates or refreshes it only after integrity checks pass. The doctor reads it but never updates it. A stale fingerprint is evidence to inspect the tree; it is not permission to delete caches automatically.

## Cache Policy

Preserve when valid:

- `node_modules`
- the user-level npm cache
- the user-level Playwright browser cache
- `.next`, `.vinext`, Wrangler/Miniflare state, TypeScript incremental state, and safe test caches

Regenerate only when needed:

- production build output
- coverage
- transient E2E output and reports
- generated diagnostics and logs

Never commit installed dependencies, browser binaries, `.env.local`, fingerprints, framework caches, build output, logs, or transient test artifacts.

## Local Artifact Directory

Use `.cache/local-dev/` for non-secret fingerprints, environment diagnostics, Playwright artifacts, and temporary local logs. Do not place client data, provider payloads, keys, or secret values there.

## Log Hygiene

Generated `*.log` files, Wrangler logs, and `.cache/local-dev/` are ignored. Keep logs bounded by cleaning old successful diagnostics periodically. Preserve evidence from an active failure until the investigation is complete. Application code must not log full contact payloads or secrets.

## Safe Cleaning

Preview the exact targets:

```powershell
node scripts/clean-generated.mjs --dry-run
```

Then, only when needed:

```powershell
npm run clean:generated
```

The command removes only known regenerable build, coverage, Playwright, report, and local-log locations. It explicitly preserves `node_modules`, npm/Playwright caches, `.env.local`, the environment fingerprint, source, Git metadata, and unrelated untracked files. It is not a normal startup command.

## Troubleshooting Ladder

1. Run `npm run doctor`.
2. Re-run the failing targeted command.
3. Inspect dependency integrity, the fingerprint, environment-variable names, and the reported port/PID.
4. Repair only the affected component.
5. Use `clean:generated` only for clearly stale generated output.
6. Reinstall the affected dependency or Playwright browser only when evidence indicates it.
7. Replace the dependency installation only after stronger evidence of corruption and after preserving local secrets.

Do not begin by deleting all caches.

## Crash / Interrupted Run Recovery

After a build, test, VS Code, Codex, or PC interruption:

1. Check the terminal and `npm run doctor` for port/process state.
2. Stop only a confirmed repository-owned process, preferably with `Ctrl+C` in its terminal.
3. Retry the targeted command.
4. Clean only the affected generated output if it is demonstrably stale.
5. Run `npm run setup:local` only if dependency, fingerprint, or browser checks require repair.

## Disk Space

The doctor warns below 10 GiB free. First remove old regenerable reports, traces, videos, logs, coverage, and build output. Do not automatically delete dependencies or user-level package/browser caches; those prevent repeat downloads.

## Windows Notes

All primary commands are PowerShell-compatible and repository scripts use Node rather than Bash. Avoid Unix-only environment assignment, `/tmp`, `chmod`, `rm`, or broad process-kill recipes. Use `Set-Location`, `Copy-Item`, `Get-Process`, and explicit paths when manual diagnosis is necessary.

## Repository Location

Assessment: **CANONICAL LOCAL CHECKOUT RELOCATED / NOT A BLOCKER**. The main checkout is now at `C:\Dev\CuddleCrewPetCareWEB`, outside synchronized OneDrive storage. Dedicated Codex worktrees remain under Codex-managed local paths. F14 did not relocate, delete, or prune any checkout.

If another future relocation becomes necessary:

1. Finish, commit, and push all intended Git work; inventory untracked files separately.
2. Clone the repository to a shallow ordinary local path outside synchronized storage.
3. Confirm the Git remote and history in the clone.
4. Recreate `.env.local` from the secure secret source; do not copy it through Git or cloud sync.
5. Do not copy `node_modules`, build output, framework caches, test artifacts, or logs. The user-level npm and Playwright caches can still be reused.
6. Run `npm run setup:local`, `npm run doctor`, and the required validation.
7. Keep the old checkout until the new one is verified, then archive it manually and deliberately.

## Secret Recovery

Store actual `.env.local` values in an approved password manager or secret-management system. Rebuild `.env.local` from `.env.example` plus that secure source after a PC replacement, Windows reinstall, relocation, or drive failure. Never create a plaintext secret backup in Git, documentation, `.cache/local-dev`, or OneDrive.

## Tool Upgrade Policy

Node, npm, Next/Vinext, Vite, Playwright, TypeScript, test tooling, and major dependencies are upgraded only in a dedicated maintenance task. Record the reason, review compatibility and migrations, capture a pre-change baseline, review manifest/lockfile changes, run full post-change validation, and retain a rollback path. Do not combine upgrades with feature or policy work.

## Dependency Security Audit

Run periodically, before major releases, and after material dependency changes:

```powershell
npm run audit:dependencies
```

This is intentionally separate from daily doctor/validation commands. Investigate findings; do not auto-upgrade packages solely because an audit reports them.

The default audit covers production-classified dependencies. Use `npm run audit:dependencies:all` during a dedicated maintenance/release review to include development dependencies. Both commands are read-only, never invoke an audit fix, and report registry unavailability distinctly from a clean result.

## CI Parity

`.github/workflows/validate.yml` provides validation-only GitHub Actions on `ubuntu-24.04` for pull requests, pushes to `main`, and explicit manual runs. It calls the same repository commands, forces provider writes and indexing off, requests read-only repository permission, and has no deployment capability. Local commands remain the executable quality contract:

| Local command | Intended CI-equivalent check |
| --- | --- |
| `npm run check:git-safety` | Repository identity, remote, branch, line-ending, private/generated-file, size, and staging guard |
| `npm run check:cross-platform` | Filename, case, encoding, path, link, shell, and generated-directory portability guard |
| `npm test` | Unit/integration/security/business-rule tests |
| `npm run typecheck` | TypeScript validation |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm run scan:secrets` | Required current-tree secret scan |
| `npm run scan:secrets:history` | Periodic or incident-driven history audit |
| `npm run e2e` | Browser E2E/smoke |
| `npm run validate:full` | Complete pre-merge gate |

As of the F14 audit on 2026-09-05, the GitHub Actions API reported zero workflow runs. The workflow is therefore **LOCAL CONFIG ONLY / HOSTED EXECUTION UNVERIFIED** until a pull request or `main` push produces a green run. Do not trigger or describe a manual run without authorization. Native GitHub secret-scanning availability, branch protection, and repository settings remain owner-side checks rather than assumed controls.

## Periodic Maintenance

Occasionally clean regenerable build output, old successful Playwright artifacts, coverage, generated diagnostics, and logs—especially after tooling changes or a disk warning. Normally preserve `node_modules`, the npm cache, Playwright browsers, `.env.local`, and healthy caches. Do not schedule destructive cleanup.

## WSL2

Classification: **NOT NECESSARY**. Native Windows Node, npm, Vinext, TypeScript, and Playwright are currently working. WSL2 would add a second filesystem/runtime boundary and duplicated caches without a demonstrated benefit. Re-evaluate only if a future dependency is genuinely Linux-specific.

## Dev Containers

Classification: **NOT RECOMMENDED**. A container would increase startup time, downloads, disk use, browser plumbing, and Windows complexity for a project that already validates natively. Reconsider only for a concrete cross-platform or CI-parity problem.

## Fresh-Clone Verification

Do not destroy the persistent checkout to prove reproducibility. When desired, validate in CI or clone to a disposable directory during a dedicated maintenance task, run the documented first-time setup and full validation, then remove only that explicitly disposable clone. Never use the active checkout as the destructive test target.

## Future Codex Sessions

The shortest normal sequence is:

1. Open the local repository workspace.
2. Read `AGENTS.md`.
3. Run `npm run doctor`.
4. If the doctor passes, install nothing.
5. Optionally run `npm run env:summary` when troubleshooting context is useful.
6. Implement the task.
7. Run targeted tests while editing.
8. Run the required final validation before completion.

Reuse first. Diagnose second. Reinstall only when evidence shows it is necessary.
