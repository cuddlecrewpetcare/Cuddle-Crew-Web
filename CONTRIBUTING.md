# Contributing Safely

This repository is the public GitHub mirror for Cuddle Crew Pet Care. Protect its history, private data, and reviewed production state as carefully as application code.

## Repository Identity

Before changing or pushing anything, run:

```powershell
npm run doctor
npm run check:git-safety
git status --short --branch
git remote -v
```

The expected GitHub remote is named `github`, points to `https://github.com/cuddlecrewpetcare/Cuddle-Crew-Web.git` for fetch and push, and has `github/main` as its default branch. The separate `sites` remote is a deployment destination, not a substitute for GitHub. Never push to it unless a separately authorized deployment task names the reviewed commit.

## Branch and Commit Policy

- Do implementation work on a purpose-named `codex/*` branch, never directly on `main` or legacy `master`.
- Start from the explicitly approved source commit or branch. Confirm it with `git status --short --branch`, `git rev-parse HEAD`, and the task record.
- Keep commits reviewable and single-purpose. Use an imperative message that describes intent, such as `Harden Git and contribution safety`.
- Do not mix features, dependency upgrades, formatting sweeps, generated output, business-policy changes, or deployments into an unrelated commit.
- Preserve source branches after review and merge unless their deletion is separately approved.
- Do not amend, rebase, force-push, filter history, or replace shared commits without explicit authorization and a coordinated recovery plan.

Stage exact paths rather than the whole worktree:

```powershell
git status --short
git diff --name-only
git add -- path/to/file another/file
git diff --cached --name-only
git diff --cached
git diff --cached --check
```

Never use broad staging until every changed and untracked path has been reviewed. A lockfile change is valid only for an intentional dependency task and must be inspected alongside `package.json`.

## Validation and Merge Policy

Run targeted checks while editing and `npm run validate:full` before completing a meaningful branch. `npm run validate` includes the read-only Git safety check and current-tree secret scan. Run `npm run scan:secrets:history` for migrations, suspected exposure, or public-release preparation.

The established merge flow is:

1. Finish and validate the implementation branch.
2. Record the reviewed branch commit and test results.
3. Use a separately authorized merge-only phase based on current `main`.
4. Confirm the reviewed commit, remote, branch, and clean/understood status.
5. Merge normally with `--no-ff`; do not squash or rewrite unless explicitly approved.
6. Resolve conflicts deliberately, rerun full validation, inspect the merge diff, then push `main` explicitly to `github`.
7. Treat deployment as a separate action. A GitHub push does not authorize a Sites push or production activation.

## Destructive Git Safety

Prefer additive and recoverable operations. Do not use `git reset --hard`, broad `git restore`, `git clean`, destructive checkout, branch deletion, forced updates, history rewriting, or repository garbage collection as routine repair. Never run a destructive command against an unresolved path, repository root, wildcard, or unrelated worktree. Inspect exact targets first and obtain explicit authorization when the requested outcome does not already require the destructive action.

Recovery starts with evidence:

| Situation | First safe response |
| --- | --- |
| Unexpected unstaged edit | Inspect `git diff -- path`; preserve a copy if needed; restore only that exact path when authorized. |
| Accidentally staged file | Inspect it, then use `git restore --staged -- path`; this keeps the working copy. |
| Bad shared commit | Prefer a new `git revert <sha>` commit after review. |
| Work committed on the wrong branch | Create/preserve a branch at the commit, then cherry-pick through an authorized workflow. Do not reset first. |
| Merge conflict or failed merge | Read `git status`, preserve intentional edits, and resolve explicitly; use `git merge --abort` only when abandoning that known merge is intended. |
| Interrupted rebase | Read `git status` and the rebase instructions; continue or abort deliberately. Never delete Git metadata manually. |
| Detached HEAD with useful commits | Create a named branch at the current commit before switching away. |
| Deleted branch or lost commit reference | Inspect `git reflog` and recreate a branch at the verified commit. Do not run cleanup or pruning. |
| Deleted untracked file | Stop writing to that location; Git may not be able to recover it. Use filesystem/backup recovery. |

For conflicts, inspect both sides and the surrounding history. Business-related conflicts must follow `AGENTS.md` and current approved business references. Never solve a conflict by taking one entire side merely to make markers disappear. Rerun relevant tests and scans, and report any unresolved policy conflict for human review.

## Line Endings and Binary Files

`.gitattributes` normalizes text blobs to LF while retaining CRLF for Windows command scripts. Do not run repository-wide `git add --renormalize`, bulk formatting, or line-ending conversion during unrelated work. When a deliberate normalization is needed, isolate it in its own reviewed commit so semantic changes remain visible.

Binary files are allowed only when they are intentional, legally usable project assets. `npm run check:git-safety` warns at 1 MiB and fails at 10 MiB so a reviewer can assess source, necessity, compression, and licensing. The existing `public/og.png` is an intentional reviewed social image. Git LFS is installed on this machine but is not needed for the current repository: there are no legitimate large versioned assets that justify its operational overhead. Re-evaluate LFS in a dedicated task before adding recurring large media or data, and never use it to make private data acceptable to commit.

## Private, Generated, and Database Content

Use [`docs/data-privacy.md`](docs/data-privacy.md) for the project data inventory, classifications, retention states, provider boundaries, and migration/restore rules. New persistence work must classify the data and resolve ownership, access, retention, backup, correction, and deletion behavior before implementation.

Do not commit local environment files, credentials, private keys, client records, home/access details, real medical or travel data, logs, caches, reports, backups, database dumps, local databases, exports, or generated dependency/build/test directories. Ignore rules are a convenience, not a security boundary; run both safety and secret checks.

Reviewed source-controlled schemas, migrations, and synthetic fixtures may be appropriate when they contain no private data or credentials. Production snapshots, realistic client-derived fixtures, and sanitized-by-assumption exports are not appropriate for this public repository.

Pre-commit hooks remain **optional and not installed**. Committed hooks do not activate themselves, and a hidden machine-specific hook would be an unreliable gate. A future managed hook may call the existing repository scripts, but it must fail clearly and remain bypass-independent from the required final validation.

## Dependency and build changes

Follow [`docs/dependency-supply-chain.md`](docs/dependency-supply-chain.md). npm 10.9.2 and lockfile v3 are authoritative; do not introduce another package manager or alternate lockfile. A healthy checkout installs nothing, while a clean checkout uses `npm ci`. Any dependency addition, removal, override, or upgrade must be deliberate, single-purpose, and accompanied by manifest/lockfile, lifecycle, provenance, license, graph, build, and test review.

Run `npm run check:supply-chain` after dependency-relevant changes. Use the read-only audit commands for maintenance/release review, but never run `npm audit fix` or `npm audit fix --force` as routine remediation. Unexpected lockfile changes stop the task until their cause and exact diff are understood.

## Legacy Migration and Archive Policy

Treat every old checkout, drive, zip, exported repository, and database as untrusted input:

1. Inventory sources without copying them into this checkout.
2. Identify the canonical repository and approved source commit.
3. Preserve the original privately and read-only when practical.
4. Scan the source tree and full Git history for secrets.
5. Inspect environment files, keys, logs, backups, databases, dumps, exports, and large binaries.
6. Revoke and replace any plausibly exposed credential before code cleanup.
7. Classify data ownership, privacy, licensing, and retention requirements.
8. Compare histories and identify code that is actually needed.
9. Record a migration map from every approved old path/repository/commit to its new location; never use timestamp alone to choose the canonical source.
10. Migrate only reviewed, sanitized source through a dedicated branch.
11. Recreate configuration from safe templates and an approved secret store.
12. Preserve attribution and legally required notices.
13. Run repository safety, current/history secret scans, and full validation.
14. Review the exact staged and committed diff before any public push.
15. Archive before deletion, keep the source until validation finishes, and make deletion a separate approved retention decision with verified backups and recovery ownership.

An archive is not a dumping ground inside Git. Name the canonical successor and final state, preserve the migration map and useful history, revoke obsolete credentials, disable obsolete integrations, and store private or bulky historical material in an access-controlled system with an owner, reason, retention period, integrity check, and tested recovery path. Avoid ambiguous duplicate folders such as `final2`, `newest`, or `latest-fixed`. Never place an archive under a public repository merely because it is compressed or ignored.

## Before Commit, Push, or Public Release

Confirm all of the following:

- Repository root, current branch, HEAD, upstream, and both GitHub remote URLs are expected.
- Status and staged file lists contain only task-owned paths; no unexpected untracked files are included.
- The unstaged and staged diffs were reviewed, and `git diff --check` passes.
- No dependency or lockfile change slipped into a non-dependency task.
- `npm run check:git-safety`, required tests, and secret scans pass.
- Public files contain no credentials, private/client/school/source material, internal decision logic, databases, dumps, backups, exports, generated artifacts, unapproved claims, or unlicensed assets; ambiguous content is `PRIVATE / MANUAL REVIEW`.
- The push names the destination explicitly, for example `git push github codex/example-task`.
- After pushing, local `HEAD` and the verified remote branch resolve to the same commit.

Before making a private or legacy repository public, additionally run the history scan, inspect every branch/tag intended for publication, review repository settings and collaborators, verify native hosting secret-scanning/protection separately, and confirm that no private artifact survives in reachable history. If exposure is found, stop publication; rotate credentials first and handle history remediation as a separately authorized, coordinated task.
