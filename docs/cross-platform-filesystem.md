# Cross-Platform and Filesystem Safety

> Status: CURRENT / ENGINEERING BASELINE
>
> Baseline: F9 audit from F8 checkpoint `a3018552da071eb4ac879bd375c07d8e55e673cc`
>
> Scope: platform support, path and filename handling, text representation, generated/local state, process execution, and safe future file features. This document changes no business rule or Client-facing policy.

## Platform support

| Platform | Classification | Evidence and limits |
| --- | --- | --- |
| Windows 10/11, native PowerShell | **PRIMARY SUPPORTED / VERIFIED** | Node 22.17.1, npm 10.9.2, doctor, tests, build, and Playwright are exercised here. |
| Linux-like build/runtime | **EXPECTED COMPATIBLE** | Application and repository automation use Node APIs and argument-array child processes; lockfile contains platform-optional binaries. No Linux CI or F9 Linux host was available. |
| macOS | **UNVERIFIED** | The dependency graph contains macOS optional packages and the existing Codex Seatbelt watcher exception, but F9 did not execute the workflow on macOS. |
| WSL | **NOT REQUIRED / UNVERIFIED** | Native Windows is the supported developer path. Do not introduce a WSL dependency. |
| Dev container | **NOT NEEDED** | No Docker or devcontainer is required or added. |

“Expected compatible” is not the same as verified support. A future Linux or macOS claim requires the same local gate on that platform or an approved CI phase.

## Filesystem inventory

| Class | Current locations or examples | Rule |
| --- | --- | --- |
| `SOURCE` | `app/`, `scripts/`, `tests/`, `e2e/`, tracked docs/config, approved `public/` assets | Reviewed Git content is authoritative for implementation, subject to business-reference authority. |
| `GENERATED` / `BUILD OUTPUT` | `.next/`, `.vinext/`, `dist/`, `out/`, `.wrangler/`, `next-env.d.ts`, `*.tsbuildinfo` | Ignored, regenerable, and never the canonical fix. |
| `TEST ARTIFACT` | `.cache/local-dev/playwright/`, `playwright-report/`, `test-results/`, `coverage/` | Ignored; preserve failed-run evidence only while useful. |
| `TEMPORARY` | unique secret-scan snapshot/report under `.cache/local-dev/` | Project-isolated, collision-resistant, removed by the owning process. Never clear a shared temp root. |
| `CACHE` | `node_modules/`, npm cache, framework caches | Reuse when healthy. Cleanup does not delete dependencies or shared caches. |
| `LOCAL-PRIVATE` | ignored `.env.local`; any future approved private diagnostic | Never commit, serve from `public/`, or copy into reports. The repo currently stores no Client export or database. |
| `MACHINE-WIDE TOOL STATE` | Git, Node manager/runtime, Gitleaks, npm cache, user-level Playwright browsers | Discover through platform/environment/tool APIs; never encode a username or copy binaries into the repo. |

There is no application file upload, archive ingestion, authoritative file persistence, database, file lock, custom watcher, or network-share feature. Explicit locking and atomic persistent-write infrastructure are therefore **NOT NEEDED**. The local dependency fingerprint is regenerable; secret-scan files are unique per process.

## Path domains and root discovery

URL paths and filesystem paths are separate domains. Keep site paths such as `/api/contact` and `/images/logo.png` as URL strings. Construct filesystem paths with `node:path`, and convert file URLs with `fileURLToPath()` or `pathToFileURL()`.

Repository scripts derive their root from `import.meta.url`, not a username, home directory, fixed clone name, or arbitrary current directory. Commands are documented to run from the repository root. `doctor` intentionally checks `process.cwd()` against the script-derived root; that use is a documented contract, not general-purpose path resolution.

All child processes use an executable plus an argument array. npm resolution selects `npm.cmd` on Windows and `npm` elsewhere when npm did not supply its own executable path. Quoted shell command construction and `shell: true` are not used. Repository npm workflows contain no Bash-only file commands or POSIX environment-assignment syntax.

## Containment, links, and destructive operations

`scripts/filesystem-safety.mjs` supplies the shared containment contract. Containment resolves root and target, uses `path.relative()`, rejects the root itself, rejects absolute relative results, and rejects `..` only at a complete separator boundary. A raw `startsWith(root)` check is insufficient because sibling names can share the same prefix.

Generated cleanup accepts only its fixed allowlist. Each target must be a descendant of the script-derived repository root, match an allowlisted repository-relative name, and have no existing symbolic-link/junction component between the target and root. The command receives no user path and does not delete `node_modules`, Git metadata, browser/npm caches, environment files, fingerprints, worktrees, or arbitrary temp content. Preview with:

```powershell
node scripts/clean-generated.mjs --dry-run
```

The current Git tree has no tracked symbolic links. Secret scanning refuses a tracked link instead of following it outside the checkout. Any future recursive delete, move, or overwrite must identify the exact target, approved root, generated/authoritative status, link/junction state, and uniqueness of the data. Operations outside a known generated allowlist require explicit authorization.

Future migrations use `ANALYZE → VALIDATE SOURCE → PREVIEW TARGET → COPY → VERIFY → SWITCH → CLEAN OLD COPY LATER`. Never move/delete first. Future backups use timestamps or versions plus provenance rather than names such as `final-final2` or `latest_REAL`.

## Filenames, case, separators, and ordering

Tracked path segments must avoid Windows device names (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, and `LPT1`–`LPT9`), Windows-invalid characters, control characters, and trailing periods/spaces. The F9 tree has no reserved/invalid names, case-conflicting paths, tracked links, or non-ASCII filenames. The longest repository-relative tracked path is 84 characters; no concrete long-path issue was found.

Imports, public-asset references, and documentation links must match tracked filename case exactly. A reference that works only because a Windows volume folds case is a deployment defect. Case-only renames on Windows require a two-step Git-aware rename. Do not rename solely for style.

Use platform APIs for filesystem separators and repository-style `/` only for Git path output and URLs. Do not depend on `readdir` or glob enumeration order; sort when order affects output. Current recursive inventory scripts either sort their reported result or use enumeration only for set/count checks where order is immaterial.

Unicode filenames are not prohibited, but require intentional review for lookalikes, combining marks, or unusual whitespace. Visual normalization is not identity. Future untrusted filenames must be replaced with server-generated safe names rather than normalized and trusted.

## Encoding, BOM, and line endings

Repository text is UTF-8 without BOM unless a future tool provides a documented exception. The F9 audit found no invalid UTF-8 or BOM in tracked text. Binary extensions remain explicitly binary in `.gitattributes` and are never mass-converted.

The Git index stores text with LF. `.gitattributes` explicitly keeps source, JSON, Markdown, CSS, configuration, shell/Python scripts, SVG/text manifests, and `.env.example` at LF; PowerShell, CMD, and BAT scripts use CRLF. Do not run repository-wide renormalization or create formatting churn. Unix shebang scripts must retain LF and portable interpreters; none is currently tracked.

## Ports, child processes, and termination

`doctor` probes ports 3000 and 3100 with Node's TCP server API on every platform. Windows-only `netstat`/`tasklist` calls are optional owner diagnostics after an occupied-port result, not the availability decision. Linux-like hosts report the port as occupied without inventing PID ownership.

E2E launches the exact Vinext CLI with the current Node executable and separately launches Playwright. On Windows it terminates the owned server process tree by exact PID; on POSIX it signals the owned child with `SIGTERM`. It never searches for or kills a broad process name. Port 3100 must be free before launch and is released after success or failure. Signal behavior is platform-dependent and no claim of identical POSIX/Windows semantics is made.

## Temp files, scans, tools, and environment paths

True future OS-temporary work uses `os.tmpdir()` plus an application-specific unique child. It must clean only that child and never recursively clear the shared temp directory. Current tests use `mkdtempSync()` for isolated synthetic fixtures and remove only their owned directory.

The current secret scan enumerates only tracked and non-ignored files in this repository, copies regular files into a unique ignored snapshot, refuses tracked links, runs Gitleaks with argument arrays, redacts output, and removes the exact snapshot/report. History scanning targets this Git repository only.

Gitleaks discovery order is explicit `GITLEAKS_PATH`, the reviewed shared Windows location, then `PATH`. The shared Windows default contains no username. Non-Windows hosts use `PATH` or the explicit variable. Playwright asks its package for the executable path and uses the user cache; no username, `LOCALAPPDATA`, browser binary, or package-cache path is committed.

`.env.example` contains names and safe defaults, uses UTF-8/LF, and has no path-valued variable today. `.env.local` is ignored and is not normalized or read aloud. A future path-valued variable must document whether it accepts absolute/relative input, its base, quoting, platform behavior, and containment rules.

## UNC paths, spaces, sync folders, and relocation

UNC/network shares are **UNSUPPORTED / UNVERIFIED**. The project makes no network-share locking or latency guarantee. Paths with spaces, parentheses, ampersands, and Unicode are expected to work because Node path APIs and argument arrays are used; exhaustive exotic-path execution is not claimed.

OneDrive or another synchronized folder is not canonical storage architecture and is not recommended for active Node/Playwright development because of watcher churn, locks, sync contention, `node_modules` overhead, and generated-artifact conflicts. The preferred active clone is a shallow ordinary local directory. F9 does not relocate any repository or worktree.

For a future relocation: finish and push; verify a clean exact checkpoint; create a fresh clone in the intended local directory; recreate `.env.local` from the approved secret source; run setup, doctor, and full validation; then retire the old copy only through a separate deliberate action. Do not drag/drop an active checkout or copy its dependencies/caches.

## Build and public-output boundary

Public asset references use leading URL slashes and exact tracked case. The F9 audit found no local absolute path in application source. Production build review must continue to check client output for usernames, home/worktree paths, tool paths, server-only values, and `file://` URLs. Development stack traces may contain internal local paths in the terminal; client responses must not.

Generated build output is not authoritative and must be fixed through source/configuration. Framework build state may contain harmless internal machine metadata, but public client artifacts may not expose it. Do not vendor native Esbuild, Workerd, Sharp, Rolldown, Tailwind, UnRS, or Playwright binaries; npm/platform resolution owns those optional differences.

## Future uploads, archives, and file writes

Uploads and archive ingestion are currently **N/A**. Before either is added, require server-generated filenames, size/type/parser bounds, storage/retention ownership, path containment, non-executable storage, cleanup, malware evaluation, and zip-slip/archive-bomb defense. Never use a client filename as a path.

Future authoritative file writes should use a same-filesystem temporary file plus verified rename/replace where practical, with collision-resistant names, permissions, failure recovery, and concurrency defined. Do not add a lock library until real concurrent authoritative writes require one. Unix modes are not a cross-platform secret boundary; Windows ACL semantics differ.

## Automated check and current findings

`npm run check:cross-platform` is **IMPLEMENTED** and included in standard validation. It is read-only and checks repository filenames/case, UTF-8/BOM, index line endings, tracked links, relative imports, public assets, Markdown file links, concrete user-home paths, client local-path leakage, known shell-specific npm syntax, generated-directory ignore coverage, and core line-ending rules. Focused tests exercise POSIX/Windows containment, sibling-prefix rejection, cleanup allowlisting, symbolic-link/junction refusal, filename rules, and import candidate construction.

F9 found and corrected the Windows-only port-availability decision and centralized cleanup/scanner containment. No case mismatch, traversal surface controlled by public/provider input, tracked private path, UNC dependency, invalid filename, encoding defect, executable-bit dependency, upload/archive surface, file-lock need, or client bundle path leak was found.

Risk register:

| Severity | Finding and disposition |
| --- | --- |
| `CRITICAL` | None. No cleanup target can be supplied by a user, and current cleanup/scanning refuses escape or linked traversal. |
| `HIGH` | Pre-F9 doctor port availability depended on Windows `netstat`, giving a false-free result on Linux-like hosts. Replaced with Node TCP probing. |
| `MEDIUM` | Linux-like execution is expected but not actually exercised by CI/a host in F9. Validate before claiming support. |
| `LOW` | macOS and UNC/network-share behavior remain unverified; OneDrive/sync-folder development remains discouraged. |
| `INFO` | Uploads, archives, persistent file state, atomic authoritative writes, locking, custom watchers, CI, WSL, and containers remain intentionally absent. |

Unresolved decisions are limited to: when to add Linux-like validation in the dedicated CI phase; whether macOS ever becomes supported; whether a future host changes process-tree shutdown requirements; and whether a real upload/archive/persistent-state feature justifies its currently deferred controls.

## References used for F9

- `docs/business-reference/README.md`
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md` (`CURRENT / APPROVED`)
- `docs/local-development.md`
- `docs/test-baseline.md`
- `docs/data-privacy.md`
- `docs/dependency-supply-chain.md`
- `docs/testing-quality.md`
- `docs/integrations-side-effects.md`
- `docs/observability-recovery.md`
- `docs/performance-resources.md`
- `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, repository scripts/configuration, tests, tracked files, and generated validation output

No pricing, estimate/planner rule, service area, availability promise, SMS/legal behavior, booking/payment behavior, public credential claim, or approved service scope changes in F9.
