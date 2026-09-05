# Dependency, Supply-Chain, and Build Security

> Status: CURRENT TECHNICAL FOUNDATION
>
> Baseline: F4 audit performed from F3 checkpoint `940c83accd848abd050f2429e6e28640c6fc0312` on 2026-09-04
>
> Scope: package management, dependency provenance, developer tool boundaries, build behavior, generated artifacts, and safe maintenance. This document does not change application business rules.

## Canonical toolchain and install contract

- Node.js is pinned to `22.17.1` by `.nvmrc`. The `package.json` engine range is a compatibility floor; it does not replace the local pin.
- npm `10.9.2`, selected by `packageManager`, is the only package manager. `package-lock.json` lockfile v3 is authoritative.
- A first-time clean checkout uses `npm ci`. `npm run setup:local` now chooses `npm ci` when `node_modules` is absent, reuses a healthy tree, and uses a non-destructive `npm install` only when an existing tree has evidence of missing or invalid packages.
- A healthy environment installs nothing. Preserve `node_modules`, the user npm cache, the user Playwright browser cache, and valid build/test caches.
- Dependency additions, removals, and upgrades are intentional maintenance work. Never introduce Yarn, pnpm, Bun, an alternate lockfile, `--force`, `--legacy-peer-deps`, routine `--ignore-scripts`, or routine `--unsafe-perm`.

The ignored environment fingerprint hashes the complete lockfile, all four dependency declaration groups, and the full exact Node and npm versions. Node or npm patch drift therefore invalidates the fingerprint, while unrelated source, documentation, paths, usernames, shells, and timestamps do not. A version mismatch requires selecting the pinned runtime and rerunning the doctor; it does not justify reinstalling otherwise healthy dependencies.

## Point-in-time dependency inventory

The lockfile contains 659 non-root package entries. There are 24 direct declarations: 6 production and 18 development. The remaining entries represent transitive, nested, peer-support, and platform-optional packages; they are supply-chain input even when application code does not import them directly.

### Direct production

| Package | Locked version | Purpose | Audit note |
| --- | ---: | --- | --- |
| `next` | 16.3.4 | Next-compatible APIs, metadata, types, and runtime compatibility | Core framework dependency |
| `react`, `react-dom` | 19.2.6 | UI and rendering runtime | Core runtime pair; one version each |
| `leaflet` | 1.9.4 | Interactive service-area map | Browser utility |
| `react-icons` | 5.7.0 | UI icon components | Browser utility |
| `@types/leaflet` | 1.9.20 | Leaflet compile-time types | Currently production-classified although compile-time only; review in a future dependency-maintenance task rather than moving it incidentally |

### Direct development

| Group | Packages and locked versions | Purpose |
| --- | --- | --- |
| Framework/build | `vinext` 1.0.0-beta.3, `vite` 8.0.13, `@vitejs/plugin-react` 6.0.2, `@vitejs/plugin-rsc` 0.5.26, `react-server-dom-webpack` 19.2.6 | Next-compatible Vite/RSC build pipeline and explicit peer support |
| Sites/Cloudflare | `@openai/sites-vite-plugin` 0.2.0, `@cloudflare/vite-plugin` 1.37.1, `wrangler` 4.92.0, `@cloudflare/workers-types` 4.20260515.1 | Hosting build integration, local worker emulation, and types |
| CSS | `tailwindcss` 4.2.1, `@tailwindcss/postcss` 4.2.1 | CSS compilation |
| Quality | `typescript` 5.9.3, `eslint` 9.39.4, `eslint-config-next` 16.3.4 | Type and lint checks |
| Browser tests | `@playwright/test` 1.62.1 | E2E runner; browser binary is separate |
| Type declarations | `@types/node` 22.19.19, `@types/react` 19.2.14, `@types/react-dom` 19.2.3 | Compile-time types |

No direct package name showed a concrete typosquatting or suspicious-alias concern. No dependency was removed: apparent redundancy is not enough evidence when framework peer/config loading may be dynamic.

### Peer, optional, and graph state

- 44 locked packages declare peer dependencies. `npm ls --all` reports no missing or invalid peer/package state, and React, React DOM, Next, Vite, Vinext, TypeScript, and Playwright each resolve to one locked version.
- 172 lockfile entries are platform-optional. Native packages select the matching operating-system/architecture binary; absence of another platform's optional binary is normal.
- A clean Windows `npm ci` reproducibly leaves five root entries that npm reports as extraneous: `@emnapi/core`, `@emnapi/runtime`, `@emnapi/wasi-threads`, `@napi-rs/wasm-runtime`, and `@tybys/wasm-util`. They are lockfile-listed optional WASM fallback support for Rolldown, Tailwind Oxide, UnRS, and Sharp. The structural check warns, but does not call a healthy tree corrupt or delete them. Re-evaluate with npm/upstream tooling during a dedicated maintenance task.
- There are no `overrides`. A future override must name the affected dependency, reason, upstream status, compatibility risk, and removal condition.

## Lockfile, provenance, and registry

The manifest and lockfile root are synchronized. Every resolved lock entry uses HTTPS from `registry.npmjs.org` and has an integrity hash. No Git, local-path, arbitrary HTTP, unpublished-fork, alternate-registry, `npm-shrinkwrap`, nested duplicate `package-lock`, Yarn, pnpm, or Bun source was found.

There is no project `.npmrc`, no user `.npmrc` on this machine, and the effective registry is the public npm registry. Repository checks never print auth configuration. A future project `.npmrc` must not contain a token or credential and any registry change requires explicit review.

If `package-lock.json` changes in a task that did not intentionally change dependencies: stop, inspect the manifest and lockfile diff, identify the command that changed it, and do not stage it silently.

## Lifecycle and native execution audit

The root package has no `preinstall`, `install`, `postinstall`, `prepare`, publish, or other implicit lifecycle hook. Five transitive package names are marked as having install behavior:

| Classification | Package | Observed behavior |
| --- | --- | --- |
| `EXPECTED / REVIEWED` | `esbuild` | Validates the platform executable; can fetch the matching package tarball from the npm registry if the optional binary is unavailable |
| `EXPECTED / REVIEWED` | `workerd` | Validates the Cloudflare runtime executable; has the same npm-registry fallback download pattern |
| `EXPECTED / REVIEWED` | `sharp` | Checks for a usable prebuilt native image binary and can fall back to a local build |
| `EXPECTED / REVIEWED` | `unrs-resolver` | Selects/validates a platform resolver binding |
| `EXPECTED / PLATFORM-OPTIONAL` | `fsevents` | macOS file-watching package; two lock entries are marked even though the installed metadata exposes no lifecycle command on Windows |

No `HIGH RISK` lifecycle payload was found. These hooks remain trust-sensitive because they execute during installation, select native code, and may use network fallback. `check:supply-chain` fails when a newly locked lifecycle package is outside this reviewed name set, forcing a deliberate review rather than globally disabling scripts.

The active Windows graph includes platform binaries for Esbuild, Workerd, Sharp/libvips, Lightning CSS, Rolldown, Tailwind Oxide, and UnRS resolver. Other operating-system binaries are optional lockfile entries. Do not vendor these binaries. The npm cache supplies packages, and `%LOCALAPPDATA%\ms-playwright` supplies Playwright Chromium.

## Script ownership and side effects

| Class | Scripts | Contract |
| --- | --- | --- |
| Read-only diagnostics | `doctor`, `env:summary`, `deps:summary`, `check:supply-chain`, `check:git-safety` | Inspect local state; do not install, clean, stage, or contact application providers. The supply-chain check invokes local `npm ls` and reads the effective registry setting without contacting it. |
| Security | `scan:secrets`, `scan:secrets:history`, `audit:dependencies`, `audit:dependencies:all` | Secret scans create and remove a bounded ignored snapshot/report. Dependency audits are read-only but registry/network-dependent; unavailable metadata is not a clean result. |
| Test | `test`, `typecheck`, `lint`, `e2e`, `e2e:run`, `test:e2e` | May write ignored compiler/test output. E2E owns port 3100 and terminates its exact server tree. Browser delivery is intercepted. |
| Build | `build` | Compiles application output; no live provider writes or client-data fetches. |
| Development server | `dev`, `start`, `start:e2e` | Long-running and network-listening. Do not expose a development server to an untrusted network. |
| Validation | `validate`, `validate:full`, `check` | Compose the checks above; `validate:full` owns a local E2E server. |
| Side-effectful setup | `setup:local` | May run npm install/ci or install Chromium only when diagnostics show it is needed; writes the ignored fingerprint. |
| Destructive/cleanup | `clean:generated` | Deletes only its documented generated targets. It never deletes dependencies, package/browser caches, secrets, or unrelated paths. |
| Manual media maintenance | `scripts/optimize-images.py` | Overwrites only its explicit public image list; not a normal validation or setup command. |

## Vulnerability audits and policy

`npm run audit:dependencies` queries npm's advisory service for production-classified dependencies. `npm run audit:dependencies:all` includes development dependencies. Both wrappers parse JSON, make no file changes, never run an audit fix, and distinguish registry failure (`UNAVAILABLE`, exit 2) from a clean result. They intentionally remain outside daily offline validation.

F4 results:

- Production-classified audit: 0 vulnerabilities reported.
- Full graph: 11 vulnerabilities reported by npm (10 high, 1 low). Affected areas include Esbuild/Vite development-server behavior, `image-size`, `react-server-dom-webpack`, and Cloudflare/Wrangler transitive Sharp, Undici, and WebSocket dependencies. npm's suggested fixes cross declared ranges and therefore require a dedicated upgrade task.
- No `use server` directive or Server Function endpoint was found. The React Server DOM denial-of-service advisory targets crafted requests to Server Function endpoints, so a current production exploit path was not confirmed. Vinext does use React Server Components, so this is not dismissed; verify runtime exposure and upgrade compatibility in the dedicated task.
- Image parsing is build-time against reviewed repository assets; there is no upload feature. Vite/Esbuild editor/filesystem issues concern a local Windows development server. Do not expose it to untrusted networks.

Audit severity is evidence, not the final project risk rating. For every finding: identify direct/transitive and production/development placement; inspect the vulnerable function and actual attack path; review severity and remediation; read upstream release/migration notes; capture a baseline; make manifest/lock changes in a dependency-maintenance branch; inspect graph/lifecycle/license changes; run targeted and full validation; retain a rollback commit. Never run `npm audit fix` or `npm audit fix --force` as routine remediation.

## Adding, removing, and upgrading packages

Before adding a package, record why it is needed, the exact reputable package identity, intended range, production/development class, compatibility, built-in/existing alternatives, lifecycle behavior, license, transitive growth, bundle/runtime effect, and maintenance outlook. Review both manifest and lockfile diffs, then run targeted and complete validation. Do not leave experimental installs behind.

Before removing one, inspect static imports, dynamic loading, scripts, configuration, generated behavior, and peer requirements. After removal, inspect the lockfile and run tests, typecheck, lint, build, and E2E where relevant. Static grep alone is not proof of non-use.

Patch, minor, and major express intended compatibility, not guaranteed safety. Even patch/minor releases can change behavior or supply-chain contents. Node, npm, Next, Vinext, React, TypeScript, Playwright, ESLint, the test stack, Gitleaks, and major production packages are never upgraded incidentally. Do not broadly loosen ranges. Transitive pins and npm `overrides` need a specific compatibility rationale and an exit plan.

## Build pipeline and reproducibility

`npm run build` invokes Vinext 1.0.0-beta.3 over Vite 8.0.13. It performs five observed compilation stages: client-reference analysis, server-reference analysis, RSC environment, client environment, and SSR environment. It processes repository source/static assets and emits `.next`, `dist`, and local `.wrangler` state; `.vinext` is also an ignored possible framework output. All are regenerable and non-authoritative.

With dependencies and native binaries installed, the F4 build completed without external network access. It did not call Resend, Google Maps, Turnstile, the private calendar, Precise Petcare, SMS/payment providers, D1, or R2. Runtime route modules contain provider calls, but compilation does not execute request handlers. Experimental Vinext traffic-based prerender/deploy behavior is not configured or invoked.

Build configuration reads only non-secret development controls (`CODEX_SANDBOX`, Wrangler log/registry paths) and safe hosting binding names. Runtime server bundles retain server environment-variable names, as expected, but the browser/client output contains none of the known server-only names. No `.env.local` was present, no value scan was printed, and no known server secret value was embedded. `NEXT_PUBLIC_*` is browser-public by definition.

Classification: **REPRODUCIBLE ENOUGH FOR APPLICATION DEVELOPMENT**, but not byte-for-byte reproducible. Runtime, npm, direct versions, transitive versions, and integrity are pinned. Platform-native optional selection varies by OS/architecture, and `app/sitemap.ts` uses the current time for `lastModified`, so output can legitimately differ between builds. Locale-sensitive or random build generation was not found. Build availability does not depend on a live content/provider service.

No browser source-map files were emitted by the observed production build. Reassess source-map publication when hosting/output behavior changes; do not treat absent maps or minification as a security boundary. Browser code is public, and authorization/secret separation must remain real.

## Artifact, cache, and privacy boundary

Regenerable output includes `.next`, `.vinext`, `dist`, `out`, `.wrangler`, coverage, TypeScript state, `.cache/local-dev`, Playwright reports/results/traces, and logs. It is ignored, may be reused while healthy, must never be treated as source or a business record, and may be removed only with the targeted cleanup script when evidence supports it. `node_modules`, npm cache, and Playwright browser cache are not cleanup targets.

The F4 artifact review found no known server-only variable name in client assets, no local absolute worktree path, no Client record/database/contact submission, and no source maps. Server output contains server variable names because runtime routes read them; names are not credentials. Generated artifacts must never become a private-data cache or be committed.

Recovery order is: doctor; reproduce the exact failure; inspect runtime, manifest, lockfile, fingerprint, and dependency tree; repair the affected package/tool; clean only demonstrated stale generated output; reinstall only the affected dependency/browser if necessary; use `npm ci` or replace the whole tree only with evidence that the tree is absent or corrupt.

## Machine-wide and project-local boundary

Machine-wide tools are Git, the editor/VS Code, Codex, a Node version manager/runtime installer, and Gitleaks 8.30.0. Gitleaks upgrades require an official release source, published checksum/signature verification where available, compatibility review, and before/after scan comparison.

Project-local packages are Next/Vinext/React, Vite and plugins, TypeScript, ESLint, Tailwind/PostCSS, Wrangler/Cloudflare integration, Playwright's npm package, tests, and all transitive build/runtime utilities. Playwright's version is lockfile-owned while Chromium lives in the shared user cache. Do not reinstall Chromium unless its executable is missing, corrupt, or incompatible with an intentional Playwright change.

## Telemetry, licenses, and SBOM

No repository telemetry endpoint or explicit opt-in/out setting was found, and the observed build emitted no telemetry notice. Tool-level behavior is therefore **UNKNOWN / USER-CONTROLLED** and should be reviewed with a future tool/hosting policy change. Experimental Vinext traffic-based prerendering can query Cloudflare analytics during a deploy, but it is not configured and deployment is outside this phase.

All 659 lock entries provide license metadata. Direct dependencies use MIT, BSD-2-Clause, Apache-2.0, or dual MIT/Apache terms. Transitive metadata also includes MPL-2.0, LGPL-3.0-or-later (principally Sharp/libvips binaries), CC-BY-4.0, Python-2.0, ISC, BSD, BlueOak, 0BSD, and CC0. No unknown or explicit noncommercial license was found. This is a metadata inventory, not legal advice; re-review notices and distribution obligations during a licensing/release phase.

SBOM classification: **OPTIONAL**. npm 10 can generate SPDX or CycloneDX from the lock/tree when a release, customer, insurer, or incident workflow needs a point-in-time artifact. Do not commit a generated SBOM by default or add SaaS/infrastructure without a concrete consumer and retention/update plan.

## Automated checks

- `npm run check:supply-chain`: implemented, local/read-only, and included in standard validation. It verifies exact Node/npm selection, package-manager authority, lockfile v3/root synchronization, no alternate lockfiles, npm registry provenance/integrity, effective public registry, reviewed lifecycle package names, and missing/invalid graph state. Extraneous optional WASM entries are visible warnings.
- `npm run deps:summary`: implemented, local/read-only, credential-safe summary of runtime, npm, lockfile/counts, graph state, lifecycle set, Playwright package/cache boundary, and Gitleaks version.
- `npm run audit:dependencies` and `npm run audit:dependencies:all`: implemented read-only registry checks with clean/finding/unavailable distinctions.

## F4 risk register and unresolved work

| Project risk | Finding | Disposition |
| --- | --- | --- |
| `CRITICAL` | No confirmed malicious package, committed registry credential, public secret embedding, or active package compromise was found | None |
| `HIGH` | No currently confirmed high-impact exploitable production path was established | Continue to enforce stop conditions if future evidence confirms one |
| `MEDIUM` | Full npm audit reports 11 development-graph vulnerabilities, including a React Server DOM issue potentially relevant to an RSC framework | Dedicated dependency-maintenance task before release; verify Server Function exposure and review Vinext/React/Cloudflare compatibility; do not force-fix |
| `LOW` | Clean npm ci reports five optional WASM support entries as extraneous | Track npm/upstream behavior; warning is visible; do not delete or reinstall reflexively |
| `LOW` | `@types/leaflet` is production-classified although compile-time only | Consider moving it only in a dedicated dependency task with lockfile review and full validation |
| `LOW` | npm reports the pinned ESLint 9.39.4 release as deprecated/unsupported during a clean install | Review the supported target and compatibility in a dedicated tooling-upgrade task; no vulnerability was reported for ESLint itself |
| `INFO` | Lockfile/provenance/integrity, direct peer compatibility, client secret boundary, and offline build behavior are healthy | Preserve with the automated checks |

Unresolved decisions are limited and explicit: schedule the vulnerability/upgrade task; determine whether deployed Vinext exposes any Server Function protocol despite no application directive; re-evaluate the optional-WASM `npm ls` behavior after npm/tool upgrades; complete deeper license/notice review before a formal release if required; and decide any organization-wide development-tool telemetry policy. None authorizes an incidental upgrade in ordinary feature work.
