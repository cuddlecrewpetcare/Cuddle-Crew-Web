# Phase 12 Roadmap Recovery

> Status: CURRENT TECHNICAL AUDIT / NON-AUTHORITATIVE ROADMAP
>
> Audit date: 2026-09-06
>
> Current main audited: `1e77e8f69363e588bfbfa007ac38ca17e47fd85d`
>
> Phase 12D audited: `db43568aa0114cc354466c9e219f9c3b689cdc7c`
>
> Recovery branch audited: `codex/local-uncommitted-work-recovery` at `1fdfde86e7e7d85ca162b7b6942e6fee8826a379`
>
> Authority: planning and implementation evidence only. This document does not change business policy or authorize feature work, merges, provider changes, deployment, DNS, or production access.

## Executive result

- The original dirty checkout was left untouched.
- Verified owner-pet photo organization was recovered, validated, committed, and pushed on `codex/local-uncommitted-work-recovery`.
- Client-pet images, PSI materials, public handouts, an infographic, stale accessibility code, an unknown deletion, and a generated text artifact were not committed.
- The historical archive was found at `planning/historical-prompts/cuddle-crew-historical-prompts.zip`, not at the expected `docs/` path. Its Markdown contents are preserved on the roadmap branch under `docs/planning/historical-prompts/`.
- 12A, 12B, and website-side 12C are merged. 12D engineering is complete but is not in `github/main`.
- No historical 12E, 12F, 12G, or later approved phase was recovered.
- A new post-12B authority mismatch exists: the 2026 holiday calendar is now `CURRENT / APPROVED`, while website code and tests still describe it as a placeholder and keep automatic holiday classification disabled. This task did not change pricing or holiday behavior.
- Feature development is a **CONDITIONAL GO** after completed branch integration and explicit scoping of the holiday-authority reconciliation.

## A0. Worktree inventory

All status checks were read-only before recovery. The two legacy worktrees whose `.git` files still point to an older OneDrive repository location were verified as clean through the current repository's administrative worktree data; neither was repaired or pruned.

| Path | Branch | HEAD | Upstream | Status |
| --- | --- | --- | --- | --- |
| canonical primary checkout | `main` | `3b443a6` | `github/main` | DIRTY; 0 ahead / 33 behind |
| `.../2026/09/01/.../local-development-foundation` | `codex/local-development-foundation` | `d17b1a5` | `github/codex/local-development-foundation` | CLEAN; stale `.git` pointer |
| `.../2026/09/04/.../foundation-f3-data-privacy` | `codex/foundation-f3-data-privacy` | `940c83a` | matching GitHub branch | CLEAN |
| `.../2026/09/05/.../foundation-f4-supply-chain` | `codex/foundation-f4-supply-chain` | `16bc55d` | matching GitHub branch | CLEAN |
| `.../01a06f1f-...` | `codex/foundation-f5-testing-quality` | `d06eee6` | matching GitHub branch | CLEAN |
| `.../01a06f31-...` | `codex/foundation-f6-integrations-side-effects` | `8ca1b69` | matching GitHub branch | CLEAN |
| `.../foundation-f7-observability-recovery` | `codex/foundation-f7-observability-recovery` | `4c0083c` | matching GitHub branch | CLEAN |
| `.../foundation-f8-performance-resources` | `codex/foundation-f8-performance-resources` | `a301855` | matching GitHub branch | CLEAN |
| `.../01a07080-...` | `codex/foundation-f9-cross-platform-filesystem` | `87f7c54` | matching GitHub branch | CLEAN |
| `.../01a0709a-...` | `codex/foundation-f10-time-locale-determinism` | `90f3e33` | matching GitHub branch | CLEAN |
| `.../foundation-f11-accessibility-responsive` | `codex/foundation-f11-accessibility-responsive` | `65b48a0` | matching GitHub branch | CLEAN |
| `.../01a070f5-...` | `codex/foundation-f12-cicd-hosting-security` | `b41c875` | matching GitHub branch | CLEAN |
| `.../foundation-f13-backup-disaster-recovery` | `codex/foundation-f13-backup-disaster-recovery` | `df53040` | matching GitHub branch | CLEAN |
| `.../foundation-f14-final-go-no-go` | `codex/foundation-f14-final-go-no-go` | `48ce11f` | matching GitHub branch | CLEAN |
| `.../post-foundation-ci-repair` | `codex/post-foundation-ci-repair` | `6e93877` | matching GitHub branch | CLEAN |
| `.../01a071cf-...` | `codex/post-foundation-node-pin-repair` | `ba3768e` | matching GitHub branch | CLEAN |
| `.../phase-12d-accessibility-reconciliation` | `codex/phase-12d-accessibility-reconciliation` | `db43568` | matching GitHub branch | CLEAN; one commit ahead of main |
| `.../local-uncommitted-work-recovery` | `codex/local-uncommitted-work-recovery` | `1fdfde8` | matching GitHub branch | CLEAN and pushed |
| `.../phase-12-roadmap-recovery` | `codex/phase-12-roadmap-recovery` | based on `1e77e8f` | set to matching GitHub branch after push | documentation-only audit worktree |
| legacy detached Codex worktree | detached | `d3811e8` | none | CLEAN; stale `.git` pointer |
| temporary foundation merge worktree | `codex/foundation-merge-main-20260905` | `1e77e8f` | `github/main` | CLEAN |

No worktree had staged changes before recovery. Only the primary checkout had unstaged tracked changes, deletions, and untracked files.

## A1. Dirty work inventory

### Tracked code and configuration

| Path | Status | Classification | Intent / compatibility | Recovery disposition |
| --- | --- | --- | --- | --- |
| `app/AddressChecker.tsx` | modified | STALE AGAINST CURRENT MAIN | early ARIA refinement; newer main/F11 version differs | excluded |
| `app/QuoteEstimator.tsx` | modified | STALE AGAINST CURRENT MAIN | early result-announcement refinement; 12D contains a narrower reconciled change | excluded |
| `app/SocialLinks.tsx` | modified | STALE AGAINST CURRENT MAIN | early navigation-semantics refinement already superseded by F11 | excluded |
| `app/credentials/page.tsx` | modified | FOUNDATION REGRESSION | removes the F11 `main-content` target/landmark contract | excluded |
| `app/globals.css` | modified | STALE AGAINST CURRENT MAIN | imports an early accessibility layer; current main already has the reconciled layer | excluded |
| `app/holidays/page.tsx` | modified | STALE AGAINST CURRENT MAIN | early landmark/status changes superseded by F11 | excluded |
| `app/page.tsx` | modified | STALE AGAINST CURRENT MAIN | early landmark/status changes based on pre-foundation code | excluded; only fresh-main asset references were changed separately |
| `app/plan/CarePlanner.tsx` | modified | STALE AGAINST CURRENT MAIN | early status-region change superseded by F11 | excluded |
| `package.json` | modified | SUPPLY-CHAIN REGRESSION | adds direct `axe-core`; current main uses locked `@axe-core/playwright` and 12D adds no dependency | excluded |
| `package-lock.json` | modified | SUPPLY-CHAIN REGRESSION | stale lockfile and altered optional metadata | excluded |
| `app/accessibility.css` | untracked | STALE AGAINST CURRENT MAIN | early 12D/F11 draft; not the current main or 12D version | excluded |
| `e2e/accessibility.spec.ts` | untracked | STALE AGAINST CURRENT MAIN | early 3-test suite; current main has 9 focused tests | excluded |

### Deleted and relocated photos

| Original path | Intended/new path | Classification | Privacy / authority | Recovered? |
| --- | --- | --- | --- | --- |
| `public/bambi-closeup.jpeg` | `public/photos/bambi - lauren's cat/lauren-cat-bambi-closeup.jpeg` | INTENDED RENAME / OWNER ASSET | Lauren's pet; byte-identical | yes |
| `public/bambi-portrait.jpeg` | `public/photos/bambi - lauren's cat/lauren-cat-bambi-portrait.jpeg` | INTENDED RENAME / OWNER ASSET | Lauren's pet; byte-identical | yes |
| `public/gallery-cat-closeup.jpeg` | `public/photos/ponyo - lauren's cat/lauren-cat-ponyo-closeup.jpeg` | INTENDED RENAME / OWNER ASSET | Lauren's pet; byte-identical | yes |
| `public/gallery-gray-cat.jpeg` | `public/photos/ponyo - lauren's cat/lauren-cat-ponyo-couch.jpeg` | INTENDED RENAME / OWNER ASSET | Lauren's pet; byte-identical | yes |
| `public/lauren-kittens.jpg` | `public/photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-kittens.jpg` | INTENDED RENAME / OWNER ASSET | Lauren's pets; byte-identical | yes |
| `public/cats-window.jpeg` | `public/photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-window.jpeg` | INTENDED RENAME / OWNER ASSET | Lauren's pets; byte-identical | yes |
| `public/lauren-cat-closeup.jpg` | none established | UNKNOWN — MANUAL REVIEW | unreferenced deletion; no byte-identical replacement | no; original retained locally |
| `public/blu-walk.jpeg` | `public/photos/blu - client dog/client-dog-blu-walk.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/gallery-aussie.jpeg` | `public/photos/blu - client dog/client-dog-blu-inside-smile.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/gallery-sunny-dog.jpeg` | `public/photos/blu - client dog/client-dog-blu-first-page-photo.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/loki-portrait.jpeg` | `public/photos/loki - client dog/client-dog-loki-portrait.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/gallery-tan-dog.jpeg` | `public/photos/loki - client dog/client-dog-loki-walk.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/gallery-black-dog.jpeg` | `public/photos/skylar - client dog/client-dog-skylar-head-tilt.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/skylar-profile.jpeg` | `public/photos/skylar - client dog/client-dog-skylar-posing.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/skylar-smile.jpeg` | `public/photos/skylar - client dog/client-dog-skylar-smile.jpeg` | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| `public/hero-dog.jpeg` | none established | PRIVATE / CONSENT UNRESOLVED | historical F3-removed Client photo | no |
| none | `public/photos/loki - client dog/client-dog-loki-sun.JPEG` | PRIVATE / CONSENT UNRESOLVED | new Client photo; no approved public-use record | no |

The six recovered images are JPEGs between 242,689 and 342,427 bytes, dimensions 1012x1800, 1350x1800, or 1800x1350/1681. Existing alt text remains contextual and accurate. The nine Client-photo candidates were not inspected for publication suitability beyond identity/hash/technical metadata because consent is unresolved.

### Public documents and third-party assets

| Path | Technical details | Classification | Reason / disposition |
| --- | --- | --- | --- |
| `public/handouts/Client Handout - Preparing for Your Pet Sitter.pdf` | 1 page, Letter, 131,996 B | UNKNOWN — MANUAL REVIEW | PSI 2011–2021 content branded “Compliments of Cuddle Crew”; implies veterinary authorization, access, and home-security terms whose current Client-facing references are DRAFT; public-use license not established; excluded |
| `public/handouts/Pet Sitter Interview Checklist.pdf` | 2 pages, Letter, 277,527 B | UNKNOWN — MANUAL REVIEW | PSI checklist discusses licenses, insurance, background checks, training, and membership; current training/scope matrix is PLACEHOLDER and reuse rights were not established; excluded |
| `public/handouts/Summer Safety Tips for Pet Owners (Client Handout).pdf` | 2 pages, Letter, 259,133 B | UNKNOWN — MANUAL REVIEW | PSI 2011–2021 medical/safety claims, Cuddle Crew branding, and reuse rights require owner/legal/content review; excluded |
| `public/infographics/Dog Travel Safety Infographic` | PNG without extension, 2513x3263, 3,981,018 B | UNKNOWN — MANUAL REVIEW | PSI transportation content, dated statistics/sources, no proven web license, and transportation scope remains unverified; excluded |
| `public/logos/Black and White PSI Logo with Passionate, Professional, Pet Sitter Tagline (300 dpi)` | JPEG without extension, 868x849, 165,413 B | UNSUPPORTED PUBLIC CLAIM | membership/brand-use authority unresolved; excluded |
| `public/logos/Black and White PSI Member Logo (300 dpi)` | JPEG without extension, 676x751, 114,092 B | UNSUPPORTED PUBLIC CLAIM | same; excluded |
| `public/logos/Color PSI Logo with Passionate, Professional, Pet Sitter Tagline (300 dpi)` | JPEG without extension, 868x849, 207,606 B | UNSUPPORTED PUBLIC CLAIM | same; excluded |
| `public/logos/Color PSI Logo with Passionate, Professional, Pet Sitter Tagline - Sized for Website Use (140 pixels wide)` | JPEG without extension, 140x137, 22,231 B | UNSUPPORTED PUBLIC CLAIM | same; excluded |
| `public/logos/Color PSI Logo with Passionate, Professional, Pet Sitter Tagline - sized for Facebook Profile Image (180 pixels x 180 pixels)` | JPEG without extension, 180x180, 29,891 B | UNSUPPORTED PUBLIC CLAIM | same; excluded |
| `public/logos/Color PSI Member Logo - sized for Facebook Profile Image (180 pixels x 180 pixels)` | JPEG without extension, 180x180, 32,091 B | UNSUPPORTED PUBLIC CLAIM | same; excluded |
| `public/logos/Color PSI Member Logo- sized for Website use (125 pixels wide)` | JPEG without extension, 125x125, 20,270 B | UNSUPPORTED PUBLIC CLAIM | same; excluded |
| `public/logos/PSI Logo` | JPEG without extension, 676x751, 179,975 B | UNSUPPORTED PUBLIC CLAIM | same; excluded |

None of these documents/assets has a current repository link. Missing extensions would also cause weak URL/MIME/accessibility behavior if published as-is. No Client, home, access, secret, or provider credential data was found in the three PDFs.

### Planning and generated/unknown files

| Path | Classification | Disposition |
| --- | --- | --- |
| `planning/historical-prompts/cuddle-crew-historical-prompts.zip` | INTENDED PLANNING ARCHIVE / packaging artifact | ZIP itself not committed; all 24 Markdown members preserved as searchable docs on the roadmap branch |
| `iness reference documentation` | GENERATED / REGENERABLE | contains only a 21-file diff-stat; excluded and not deleted |

## A2. Public documents

No old-to-new document rename could be established. The three handouts are technically readable and render without clipping, but publication is not approved. Their content depends on unresolved DRAFT Client-facing agreements and/or unverified credentials, and all are third-party PSI works. No website reference was added or repaired.

## A3. Public images/assets

Six Lauren-owned pet-photo renames were recovered with exact hash identity. Three live home-page references and six paths in `scripts/optimize-images.py` were updated. Eight historical F3-removed Client photos appeared under new names, one additional Client photo appeared, and none was recommitted. PSI logos and the transportation infographic were excluded pending membership, scope, licensing, and content review.

## A4. Code/config changes

The dirty accessibility/code/config changes were an early pre-foundation draft and were excluded. The recovery branch changes only:

- `app/page.tsx`: three image URLs now target the verified owner-photo locations; public copy and alt text are unchanged.
- `scripts/optimize-images.py`: six maintenance-source paths now target the same verified owner-photo locations.

No security boundary, timestamps, timezone logic, provider gate, rate, policy, estimator/planner decision, SMS text, booking/payment behavior, dependency, runtime pin, or CI behavior changed.

## A5. Recovery branch

- Source: fresh `github/main` at `1e77e8f69363e588bfbfa007ac38ca17e47fd85d`.
- Branch: `codex/local-uncommitted-work-recovery`.
- Commit: `1fdfde86e7e7d85ca162b7b6942e6fee8826a379` (`Recover owner pet photo organization`).
- Remote: `github/codex/local-uncommitted-work-recovery`; local and remote SHAs match.
- Committed scope: six 100%-similarity renames, `app/page.tsx`, and `scripts/optimize-images.py`.
- Validation: complete and passing; see AG.

## A6. Original dirty checkout

The original checkout remains at `3b443a6` with all original dirty/untracked paths intact. No cleanup, restore, deletion, staging, or commit was performed there. Verified owner-photo organization now exists safely on a pushed recovery branch; all other uncertain/private items remain only in the original checkout for manual review.

## B. Prompt archive

The exact supplied path is `planning/historical-prompts/cuddle-crew-historical-prompts.zip`. It contains 24 Markdown files: README, manifest, 15 foundation summaries, one Phase 11 summary, six Phase 12/planning files, and the roadmap-recovery summary. The manifest is complete.

Fidelity:

- **RECONSTRUCTED HISTORICAL INTENT:** F0–F3, Phase 11, 12A, 12B, 12C.
- **SUMMARY ONLY:** F4–F14.
- **REVISED / RECONCILIATION SUMMARY:** 12D and roadmap recovery.
- **ARCHIVE POLICY ONLY:** `FUTURE-PLANS.md`.
- **EXACT HISTORICAL PROMPT:** none.

All archive files correctly say non-authoritative/do not run directly. Old exact SHAs, test counts, and branch details are largely absent rather than stale because these are short summaries. The principal quality issue is missing exact source text and `Last reconciled against main: NOT YET`; the separate current index now records the reconciliation without rewriting history.

## C. Phase 11 historical findings

The archive offers only the generic statement that Phase 11 was the pre-Phase-12 implementation period. Git evidence recovers one concrete unmerged branch, `codex/phase-11a-pricing` at `8225f1f`, with pricing, estimator, travel/service-area, page copy, and test changes. It was explicitly incomplete (“limit ran out”), was not merged as that commit, and its business-logic intent was later superseded and completed by 12B. Its security, testing, accessibility, and environment concerns were later covered by F0–F14. No evidence supports reviving its old component/config approach.

## D. F0–F14 archive findings

| Foundation | Historical intent | Current status |
| --- | --- | --- |
| F0 | local environment | complete on main |
| F1 | secret handling/scans | complete on main |
| F2 | Git/repository safety | complete on main |
| F3 | data/privacy and Client-image removal | complete on main; historical media decision remains owner review |
| F4 | dependency/supply-chain safety | complete; advisories are separate maintenance |
| F5 | testing/quality | complete |
| F6 | integration/side-effect gates | complete; dashboard readiness remains owner work |
| F7 | observability/recovery | complete |
| F8 | resource bounds/performance | complete; image optimization remains polish |
| F9 | cross-platform/filesystem safety | complete |
| F10 | Pacific time/determinism | complete |
| F11 | accessibility/responsive | complete; manual checks remain |
| F12 | CI/deployment safety | complete; hosted/deployment verification remains owner work |
| F13 | backup/continuity foundation | complete; account/DNS/active-care continuity decisions remain |
| F14 | final audit | complete |

No foundation phase should be rescheduled. A demonstrated regression is a defect, and an external/manual follow-up remains external/manual.

## E. Historical Phase 12 chronology

| Order | Phase | Branch / commit | Original intent | Status | Evidence |
| ---: | --- | --- | --- | --- | --- |
| 1 | 12A | `codex/phase-12a-governance` `895b077`; merged by `e353db4` | governance, source hierarchy, stale-logic/SMS audit | COMPLETE / MERGED | commit, audit docs, archive reconstruction |
| 2 | 12B | `codex/phase-12b-business-logic` `5cfde5b`; merged by `b0a038a` | central approved rates, travel, pet modifiers, Overnight, review/capacity, non-binding estimate, holiday disabled while unresolved | COMPLETE / MERGED for then-current authority | commit, tests, disposition report |
| 3 | 12C | `codex/phase-12c-sms-a2p` `3abcf6f`; merged by `3b443a6` | canonical visible disclosure, optional consent, server metadata, privacy/terms separation | WEBSITE ENGINEERING COMPLETE / MERGED | commit, tests, SMS reference |
| 4 | 12D | `codex/phase-12d-accessibility-reconciliation` `db43568` | reconcile accessibility/responsive gaps after F11 | ENGINEERING COMPLETE; MERGE PENDING; MANUAL ITEMS REMAIN | 12D report and branch diff |
| — | 12E+ | none | none recovered | NO APPROVED PHASE FOUND | archive, refs, history search |

## F. Phase 12 whole-program goal

**Explicitly planned:** bring the website under a formal source-of-truth system, implement approved business rules conservatively, establish scanner-readable SMS consent compliance, and finish accessibility/responsive engineering without duplicating foundation work.

**Strongly implied:** reconcile pre-Phase-12 website behavior against approved policy and leave provider/manual launch work distinct from code completeness.

**Not supported:** a numbered SEO, public-doc, provider, dependency, deployment, or new-page phase after 12D. Those may be descriptive candidate workstreams only after owner approval.

## G. 12A status

**COMPLETE / MERGED.** Current main has the hierarchy, business-reference routing, SMS authority, dependency map, and stale-logic audit. Genuine follow-up: clean the contradictory double status in `pricing-care-standards-manual.md` through an authorized reference task and keep DRAFT/PLACEHOLDER references from being treated as approved.

## H. 12B status

Pricing, additional pets, travel-time tiers, same-day versus under-24-hour handling, Overnight scope, capacity review, personalized-review output, and non-binding estimator boundaries remain implemented and tested. Do not reopen them generally.

The historical 12B holiday premise is now stale: `logic/36-holiday-peak-date-calendar.md` became `CURRENT / APPROVED` for 2026 on 2026-09-05, and `logic/38-ppc-pricing-quote-implementation.md` is also current. Current code/config/tests still assert that the holiday calendar is a placeholder and do not auto-apply approved dates. This is a **BUSINESS-AUTHORITY CONFLICT / CURRENT IMPLEMENTATION GAP** requiring a separately authorized pricing/holiday reconciliation. It was not modified here.

## I. 12C status

Website consent engineering is **COMPLETE / MERGED**: optional unchecked consent, canonical disclosure, Privacy/Terms linkage, server-created timestamp/source only after affirmative consent, forged metadata rejection, and safe logging/tests. Dialpad/A2P registration, number/provider configuration, STOP/HELP/suppression, retention, and live verification are separate owner/provider tasks. SMS sending is inactive.

## J. 12D status

- **12D engineering:** COMPLETE WITH MANUAL PRE-LAUNCH ITEMS at `db43568`.
- **12D branch:** clean and pushed.
- **12D merge:** PENDING; `db43568` is not an ancestor of `github/main` and is one commit ahead.
- **12D manual:** NVDA task completion, actual 200%/400% and text-only zoom, Windows forced colors, real phone/tablet portrait/landscape, configured Turnstile, and real Google suggestions.

The dirty checkout's accessibility draft is not 12D and must not be substituted for the reconciled commit.

## K. Historical future-phase prompt extraction

No future phase prompt exists. `FUTURE-PLANS.md` only states how to archive a future prompt and explicitly warns not to invent 12E/12F/12G. Therefore there are no recovered future-phase items to execute.

## L. Foundation overlap matrix

| Historical / candidate item | Completed by | Current status | Remaining gap |
| --- | --- | --- | --- |
| local environment and exact runtime | F0 + node-pin repair | complete | none |
| secrets/privacy/Git | F1–F3 | complete | owner decision on historical media/public internal docs |
| dependencies/tests | F4–F5 | complete | separate advisory maintenance |
| providers, logs, limits | F6–F8 | complete | dashboards/live verification only |
| cross-platform/time | F9–F10 | complete | none |
| accessibility/responsive | F11 + 12D | code complete on 12D branch | merge + manual QA |
| CI/hosting/recovery | F12–F14 + repairs | source complete | hosted provenance, account recovery, DNS inventory, active-care continuity |
| Phase 11 pricing concept | 12B | complete for then-current authority | post-approval holiday reconciliation |
| local owner-photo organization | recovery commit `1fdfde8` | complete on recovery branch | review/merge after 12D |

## M. Local pending-work reconciliation

- **Recovered:** six Lauren-pet photo renames and all unambiguous references.
- **Excluded as stale:** 12 tracked/untracked accessibility/dependency files.
- **Excluded as private:** nine Client-photo candidates.
- **Excluded pending public-use/authority review:** three PDFs, one infographic, eight PSI logos.
- **Excluded as unknown:** deletion of `public/lauren-cat-closeup.jpg`.
- **Excluded as generated:** the oddly named diff-stat file.
- **Preserved separately:** archive Markdown in the roadmap branch; original ZIP remains local.

## N. Remaining feature/UX work

Evidence-backed remaining work is limited to:

- merge completed 12D engineering;
- review/merge the owner-photo recovery branch;
- reconcile approved 2026 holiday dates and PPC quote rules with website configuration/tests/public holiday copy in a separately authorized business-rule task;
- decide whether any currently excluded public documents/assets should be adapted and linked after authority/licensing review;
- verify live provider-backed contact/address/availability behavior if those providers will be enabled.

Current routes, estimator, planner, service-area review, FAQ, navigation, CTAs, portal links, contact flow, booking handoff, and account/client portal links already exist. No evidence-backed missing route or separate account system was found.

## O. Remaining content/copy work

- Holiday copy says dates await approval even though the 2026 calendar is now approved.
- The access, emergency veterinary, medication, shared-care, Overnight, behavior, media, and vacation-care Client-facing documents are DRAFT and must not be published as approved policy.
- The training/certification/service-scope matrix is PLACEHOLDER; do not publish PSI membership, insurance, certification, transport, or advanced-care claims from asset names or old content.
- The pricing/care manual has both a top-level PLACEHOLDER header and an embedded CURRENT / APPROVED header, plus stale pending-holiday language. Owner reconciliation is required before relying on it as a whole.
- Recovered handouts/assets are not yet integrated and remain blocked as described above.

## P. SEO/discoverability status

| Area | Status | Evidence / remaining owner work |
| --- | --- | --- |
| Page titles/descriptions | COMPLETE in source | route metadata and tests |
| Canonical URL/redirects | COMPLETE in source | production exact-artifact verification remains |
| Robots/sitemap | COMPLETE but opt-in | `SITE_INDEXING_ENABLED`; production setting is owner/deployment work |
| Open Graph/Twitter | COMPLETE | `/og.png` is a known 1.75 MiB optimization warning |
| LocalBusiness/WebSite schema | COMPLETE in source | re-audit after business claims change |
| Service-area/location content | PARTIAL / intentionally conservative | no ZIP-to-tier invention; private origin stays server-side |
| Internal links/navigation | COMPLETE for current routes | link and E2E coverage present |
| Image metadata/delivery | PARTIAL | descriptive alt text exists; raw `<img>` warnings and unoptimized OG remain polish |
| Search indexing/provider consoles | OWNER TASK | verify deployed flag, sitemap, canonical behavior, Search Console/GBP if used |

No SEO implementation was performed.

## Q. Security/privacy residuals

- Nine historical Client photos remain in Git history; no current reintroduction occurred. Consent/history disposition is owner/legal/privacy review.
- Client-photo renames and one new Client image remain local only with consent unresolved.
- Public repository exposure of internal-reference documents remains an owner publication-boundary review item; no Client record or secret was found in this task.
- `public/psi-membership-certificate.jpg` already exists on current main even though the training/scope matrix is PLACEHOLDER; it is unlinked but publicly addressable by known path and needs owner review.
- Provider/dashboard retention and production configuration remain unverified.
- Active-care continuity still needs an owner-approved minimum-necessary method; no private shadow record was created.

## R. Business-reference residuals

| Reference/subject | Current status | Blocks current site? | Blocks future feature? | Blocks launch? | Owner action |
| --- | --- | --- | --- | --- | --- |
| 2026 holiday calendar | CURRENT / APPROVED | yes, current copy/config/tests are stale | yes for holiday automation | yes for accurate 2026 pricing disclosure | authorize reconciliation and verify PPC |
| future-year holidays | planning baseline only | no | yes for 2027+ automation | not for 2026 | approve exact future-year dates when needed |
| media consent | DRAFT | current site avoids Client media | yes for Client gallery/testimonials | yes before Client-media use | approve form and per-asset records |
| transportation | training/scope unresolved; emergency authorization DRAFT | current site routes to review | yes | yes before advertising transport | verify insurance/training/scope and agreement |
| advanced medication | internal review current; Client consent DRAFT; training matrix PLACEHOLDER | neutral current copy can remain | yes | yes before capability claims | approve consent and verify scope |
| training/certification/scope | PLACEHOLDER | neutral credentials page can remain | yes | yes before specific claims/logos | populate and approve evidence matrix |
| access/security | DRAFT | current neutral copy can remain | yes for contractual/onboarding automation | yes before publishing as agreement | owner/legal approval |
| emergency veterinary | DRAFT | current neutral copy can remain | yes | yes before publishing/automation | owner/legal approval |
| shared care | DRAFT | internal review remains | yes | yes before publishing as agreement | owner/legal approval |
| Overnight addendum | DRAFT | current approved core/internal limits still control public scope | yes | yes before publishing addendum | owner/legal approval |
| behavior/safety agreement | DRAFT | neutral review remains | yes | yes before publishing as agreement | owner/legal/training approval |
| vacation/care-frequency approval | DRAFT | planner remains advisory | yes | yes before contractual use | owner/legal/welfare approval |
| pricing/care manual | contradictory PLACEHOLDER + embedded CURRENT header | specific current references still control | yes if used as sole source | governance cleanup before launch sign-off | reconcile status/topology |

## S. Provider/external tasks

| Provider | Code status | External status |
| --- | --- | --- |
| Resend | gated, mocked, disabled by default | dashboard/domain/sender/recipient/delivery verification required if enabled |
| Turnstile | optional pair-gated integration | keys, hostnames, failure and accessibility smoke required if enabled |
| Google Maps | optional server-side read integration with private origin | key/API/quota/restriction and real suggestion tests required if enabled |
| Private calendar | optional read-only conservative integration | source ownership/retention/access and production assignment unverified |
| Precise Petcare | link-only; authoritative for Client-specific records | links/account/MFA/recovery/outage/export and PPC pricing setup verification |
| Dialpad/SMS | consent UX only; no sending integration | A2P/number/STOP/HELP/suppression/retention/live testing not active |
| Sites | source/CI/deploy safety complete | exact active SHA/version, rollback, environment assignments, preview isolation, logs/retention require owner verification |
| Domain/DNS | application contract complete | registrar lock/MFA/recovery, dated zone inventory, MX/SPF/DKIM/DMARC preservation, TLS/canonical verification |

No provider or dashboard was changed.

## T. Manual pre-launch items

- NVDA task completion for navigation, contact, estimator/planner, disclosures, and dynamic status.
- Actual browser 200%/400% and text-only zoom.
- Windows forced-colors/high-contrast.
- Real phone/tablet portrait and landscape task completion.
- Configured Turnstile accessibility and recovery behavior, if enabled.
- Real Google suggestions by keyboard, touch, and pointer, if enabled.
- One explicitly authorized non-destructive production contact/provider smoke, if enabled.
- Exact Sites provenance, rollback version, environment assignments, and public artifact/header/indexing verification.
- Account recovery for GitHub, Sites/OpenAI, registrar/DNS, Workspace/mail, Precise Petcare, and enabled providers.
- Dated DNS inventory preserving mail records.
- Owner-approved active-care continuity under the current continuity plan.

These are not automatically new code phases.

## U. Dependency maintenance

Known baseline remains a 0-vulnerability production-classified audit and 11 full-graph findings (10 high, 1 low) in the development/toolchain graph, with no confirmed current exploit path. Treat this as **DEDICATED MAINTENANCE**, not as the next Phase 12 phase. No upgrade was performed.

## V. 12D merge state

**12D ENGINEERING: COMPLETE. 12D MERGE: PENDING.** The branch should be reviewed and merged before new feature implementation so future work starts from the completed accessibility contract. No merge occurred here.

## W. Recovery branch merge state

`codex/local-uncommitted-work-recovery` is clean, pushed, validated, and one commit ahead of main. It does not overlap the 12D commit's changed files. It should be reviewed after or alongside 12D and merged before further image/public-asset work. The excluded files still require manual review and are not prerequisites for merging the narrow owner-photo change.

## X. Roadmap deduplication

Removed from future scheduling because already complete: local setup, secrets, Git safety, privacy boundaries, dependency guardrails, test foundation, provider gates, logging, resource caps, cross-platform checks, Pacific time, general accessibility/responsive work, CI/deployment safety, backup documentation, final foundation audit, Phase 12 governance, core business logic, website SMS consent, existing routes, estimator/planner, service-area review, FAQ, CTAs, and Precise Petcare link handoff.

## Y. Priority matrix

| Priority | Items |
| --- | --- |
| P0 — blocks next development | review/merge completed 12D so the engineering base is complete |
| P1 — should do next | review/merge owner-photo recovery; authorize and scope the approved-2026 holiday/PPC implementation reconciliation |
| P2 — before launch | resolve/publicly approve applicable DRAFT/PLACEHOLDER claims; manual accessibility/device tests; production provider/Sites/DNS verification; dependency maintenance; historical-media/public-internal-doc disposition |
| P3 — optional/polish | image optimization and measured performance; optional licensed/approved handout integration |
| OWNER | PSI rights/membership evidence; Client media consent; provider dashboards; Search Console/GBP; account recovery; active-care continuity |
| DEFERRED | SMS sending, payments, webhooks, new admin tools, future-year holiday automation, and any unapproved future feature |

## Z. Next phase recovery

**NO APPROVED NEXT PHASE FOUND**

## AB. Descriptive roadmap without invented numbering

1. Integrate completed accessibility and owner-photo recovery branches.
2. Reconcile the newly approved 2026 holiday/PPC authority with public copy, configuration, tests, and operational setup under a separately approved task.
3. Review public documents/assets for business authority, licensing, accessibility, and Client-media consent before any integration.
4. Complete provider and launch readiness checks without conflating them with feature phases.
5. Approve any later feature roadmap descriptively before assigning a Phase 12 number.

## AC. Current-state matrix

| Item | Current main | 12D branch | Recovery branch | Historical archive | Merged? | Ready? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 12A | complete | inherited | inherited | reconstructed summary | yes | yes | governance current |
| 12B | complete for prior authority | inherited | inherited | reconstructed summary | yes | conditional | holiday authority changed afterward |
| 12C website | complete | inherited | inherited | reconstructed summary | yes | yes | provider setup separate |
| 12D | absent | `db43568` complete | absent | summary only | no | engineering yes | manual items remain |
| F0–F14 | complete | inherited | inherited | summaries only | yes | yes | do not reschedule |
| owner-photo organization | absent | absent | `1fdfde8` complete | absent | no | yes | clean/pushed/validated |
| Client/PSI/public documents | absent or excluded | unchanged | excluded | absent | no | no | manual authority/licensing review |
| archive | absent | absent | absent | preserved on roadmap branch | no | yes as non-authoritative history | no exact prompts |
| future Phase 12 | none | none | none | none | no | no | owner approval required |

## AD. Feature-development readiness

**CONDITIONAL GO.** Conditions: review/merge 12D before new feature work; review/merge the narrow recovery branch before image/public-asset work; and explicitly authorize/scope the current holiday/PPC authority reconciliation before touching pricing or holiday behavior. Launch readiness is separate and is not required for ordinary development.

## AE. Archive quality

The archive is safe to retain as non-authoritative planning history. Its structure is adequate after extraction to `docs/planning/historical-prompts/`, but it contains summaries rather than exact prompts. F0–F3, Phase 11, and 12A–12C explicitly say reconstructed; F4–F14, 12D, and roadmap recovery should eventually be replaced or supplemented by exact transcript text if recovered. No duplicate executable plans or misleading future phase files were found. `FUTURE-PLANS.md` is correctly a policy, not a plan. Keep exact recovered text separate from refreshed scopes.

## AF. Documentation

- Created `docs/phase-12-roadmap-recovery.md`.
- Extracted the 24 supplied archive Markdown files to `docs/planning/historical-prompts/` without rewriting historical intent.
- Created `docs/planning/historical-prompts/CURRENT-RECONCILIATION.md`.

## AG. Validation

Recovery branch results:

- `npm run doctor` — PASS after branch-local deterministic setup.
- `npm run env:summary` — PASS; Node 22.17.1, npm 10.9.2, healthy dependencies.
- `npm run check:foundation` — PASS, including zero current secret findings and all Git/supply-chain/integration/resource/cross-platform/time/deployment/recovery gates.
- `npm run check:a11y` — PASS, 9/9.
- `npm run test` — PASS, 148/148.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS with 0 errors and four known `<img>` warnings.
- `npm run build` — PASS.
- `npm run check:build-artifact` — PASS; 150 files, 5.76 MiB, privacy checks passed.
- `npm run e2e` — PASS, 21/21.
- targeted Python AST parse of `scripts/optimize-images.py` — PASS.
- `git diff --check` — PASS.
- final recovery status after push — CLEAN; local/remote SHAs match.

Roadmap/archive branch results:

- `npm run doctor` — PASS.
- `npm run check:cross-platform` — PASS; no path mismatch or local-path leak.
- `npm run test` — PASS, 148/148.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS with 0 errors and four known `<img>` warnings.
- `npm run build` — PASS.
- `git diff --check` — PASS.

## AH. Recommended immediate next action

**A. Merge completed 12D branch.** It is the completed engineering prerequisite and has no overlap with the narrow recovery commit. Perform review/merge in a separately authorized merge task; do not deploy as part of that action.

## AI. Confirmation

- Original dirty checkout untouched: yes.
- Unknown files deleted: no.
- Client/private data committed: no.
- Removed Client photos restored: no.
- Business policy changed: no.
- Provider/dashboard changes: no.
- Dependency upgrades: no.
- Deployment, DNS, or hosting changes: no.
- Production Client data accessed: no.
- Force push, rebase, history rewrite, or merge: no.

## Business-reference authority used

This audit used the current-main versions of `docs/business-reference/README.md`, `guidance/source-of-truth-document-hierarchy.md`, `core/01-master-service-agreement.md`, `core/02-cancellation-booking-change-refund-policy.md`, `core/03-pricing-fees-surcharge-policy.md`, `guidance/sms-communications-consent-compliance.md`, `logic/16` through `logic/24`, `logic/33`, `logic/36`, `logic/37`, `logic/38`, `operations/35`, `operations/38`, and the status/constraints of the DRAFT Client-facing documents, the PLACEHOLDER training/scope matrix, and the contradictory pricing/care manual header. Historical copies in the dirty checkout were not used as authority.
