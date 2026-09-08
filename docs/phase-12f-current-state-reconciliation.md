# Phase 12F Current-State Reconciliation

> Status: READY FOR OWNER REVIEW
>
> Historical phase name: Smart Features, SEO, Security, Privacy, and Operations Gap Pass
>
> Reconciliation date: 2026-09-07
>
> Current fetched baseline: `62aa602d7025aaf25aee42e09a6fc36848340119`
>
> Nature: current planning record; not business-policy authority and not an implementation record

## 1. Current repository state

`github/main` was fetched before this audit and still resolves to `62aa602d7025aaf25aee42e09a6fc36848340119`, the known Phase 12E implementation merge. No intervening commit required reconciliation.

The protected canonical checkout identified in the task remains at `3b443a6dcafb0cb3f4ed4129714d357e3e059816`, is 46 commits behind `github/main`, and contains its preserved modified, deleted, and untracked historical/local work. It was inspected only with read-only Git commands. Nothing in it was reset, cleaned, restored, stashed, staged, modified, deleted, or moved.

This reconciliation uses a separate clean worktree on branch `codex/phase-12f-current-state-reconciliation`, created from and tracking fetched `github/main`. The machine-specific worktree path is intentionally omitted from this durable cross-platform record.

GitHub CLI 2.100.0 is installed. `gh auth status` reports that the stored active token for `cuddlecrewpetcare` is invalid. Authentication was not changed. The Git remote fetch succeeded, and this reconciliation does not require GitHub mutations or additional API metadata.

## 2. Project phase status

| Program item | Current disposition |
| --- | --- |
| Phase 12A | COMPLETE AND MERGED |
| Phase 12B | COMPLETE AND MERGED |
| Phase 12C | COMPLETE AND MERGED |
| F0–F14 engineering foundation | COMPLETE AND MERGED; do not duplicate |
| Phase 12D | COMPLETE AND MERGED; manual pre-launch checks remain separate |
| Owner-image recovery | COMPLETE AND MERGED |
| Roadmap/archive reconciliation | COMPLETE AND MERGED |
| Pre-12E business-authority reconciliation | COMPLETE AND MERGED |
| Phase 12E current-state reconciliation | COMPLETE AND MERGED |
| Phase 12E implementation | COMPLETE AND MERGED at the audited SHA |
| Phase 12F current-state reconciliation | THIS DOCUMENT; planning only |
| Current Phase 12F implementation | NOT STARTED; requires owner approval of this document |
| Phase 12G | FUTURE final regression/release audit and GO/NO-GO |
| Phase 12H | FUTURE launch-unblock phase generated after 12G |

The hosted validation evidence supplied for the exact baseline is Node 162/162, E2E 31/31, focused accessibility 14/14, typecheck PASS, lint 0 errors/0 warnings, build PASS, hosted artifact 183 files/10.48 MiB, and secret scan 0 findings. Those counts are baseline evidence, not results rerun by this documentation task.

## 3. Historical 12F provenance and authority

The recovered artifact is `docs/planning/historical-prompts/phase-12/12F-smart-features-seo-operations-summary.md`. Its provenance is **SUMMARY ONLY**. No exact original Phase 12F prompt is present. It remains correctly labeled:

- `HISTORICAL / PLANNING`;
- `NON-AUTHORITATIVE`;
- `RECONCILE BEFORE EXECUTION`.

The audit also reviewed `docs/phase-12-roadmap-recovery.md`, `docs/planning/historical-prompts/CURRENT-RECONCILIATION.md`, and `docs/phase-12e-current-state-reconciliation.md`. Historical intent covered smart planning features, original client-preparation and safety content, truthful public continuity/accessibility/contact explanations, SEO/local discoverability, trust claims, and a broad privacy/security review. F0–F14 and Phase 12E now supersede much of that scope.

This document applies the repository hierarchy. Historical prompts and implementation evidence cannot override safety, welfare, law, insurance, approved scope, current client-facing agreements, approved client-specific Precise Petcare records, or applicable CURRENT / APPROVED core, logic, operations, and guidance references.

## 4. Business-reference preflight

The following authority and planning sources were read for this reconciliation:

- `AGENTS.md`;
- `docs/business-reference/README.md`;
- `docs/business-reference/guidance/source-of-truth-document-hierarchy.md`;
- `docs/business-reference/core/01-master-service-agreement.md` — CURRENT / APPROVED;
- `docs/business-reference/core/02-cancellation-booking-change-refund-policy.md` — CURRENT / APPROVED, used only to confirm current FAQ/policy boundaries;
- `docs/business-reference/core/03-pricing-fees-surcharge-policy.md` — CURRENT / APPROVED, used only to spot-check unchanged current pricing;
- `docs/business-reference/guidance/client-explanation-library.md` — CURRENT / APPROVED;
- `docs/business-reference/guidance/pricing-care-standards-manual.md` — CURRENT / APPROVED;
- `docs/business-reference/guidance/sms-communications-consent-compliance.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/16-new-client-pre-service-checklist.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/17-meet-and-greet-checklist.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/18-booking-acceptance-risk-triage.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/21-long-stay-review.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/22-medication-scope-review.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/33-custom-quote-scope-review.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/36-holiday-peak-date-calendar.md` — CURRENT / APPROVED, spot-check only;
- `docs/business-reference/logic/37-service-window-capacity-planner.md` — CURRENT / APPROVED;
- `docs/business-reference/logic/38-ppc-pricing-quote-implementation.md` — CURRENT / APPROVED;
- `docs/business-reference/operations/35-annual-business-policy-audit.md` — CURRENT / APPROVED;
- `docs/business-reference/operations/38-continuity-backup-provider-plan.md` — CURRENT / APPROVED;
- `docs/business-reference/operations/40-training-certification-service-scope-matrix.md` — PLACEHOLDER, inspected only to identify unresolved credential/membership authority and never used as production authority;
- `docs/accessibility-responsive.md` and `docs/phase-12d-accessibility-reconciliation.md` — current engineering/planning evidence, not business-policy authority.

The conditional access, emergency-veterinary, medication-consent, shared-care, Overnight, behavior, media/testimonial, and vacation-care documents in `core/04` through `core/10` and `core/15` remain DRAFT. They were not treated as approved authority. Current public recommendations below use approved higher-level contract, logic, operations, and guidance sources only. No unresolved business rule is invented.

Current rate and calendar spot-checks match the protected authority: Standard Overnight dog $85, cat-only $80, small-animal-only Personalized review; Continuous Care 3h $90, 4h $120, 5h $145, 6h $165, 7h $185, 8h $200; limited 24-Hour Continuous Care starting at $300; calendars 2026–2028 with the final approved crossover through January 3, 2029. Phase 12F does not reopen them.

## 5. Current route and feature inventory

| Surface | Current purpose and implementation | 12F relevance |
| --- | --- | --- |
| `/` | Clear owner-operated Sacramento-area homepage, service orientation, How It Works, trust links, approved Blu hero, Lauren portrait, cat image, PPC links | Phase 12E complete; keep |
| `/start` | Canonical six-step new-client path, optional tool links, PPC handoff, readiness cue | Keep; add one concise authority-backed preparation module |
| `/services` | Substantive service descriptions and booking boundaries | Complete; no new service route |
| `/rates` | Full public rates and `#estimate` QuoteEstimator | Keep; repair degraded/error and cross-tool handoffs only |
| `/service-area` | Travel explanation, address checker, ZIP fallback, route/capacity boundary | Keep; add privacy-safe handoff to estimator only |
| `/gallery` | Full approved pet gallery grouped by Lauren/client ownership with accessible lightboxes | Keep; scrub one file's retained metadata and resolve pet-name consent separately |
| `/plan` | Anonymous CarePlanner and route to pricing/contact | Keep; correct stale estimator destination |
| `/holidays` | Approved 2026–2028 calendars through January 3, 2029 | Complete; no policy change |
| `/choosing-care` | Neutral provider-comparison guidance | Complete |
| `/safety` | Searchable what-if guidance for pets, access, weather, emergencies, and continuity | Complete for current general safety scope |
| `/credentials` | Neutral request-current-information page; intentionally withholds unsupported claims | Keep; social metadata is incomplete; PSI text remains blocked by authority |
| `/faq` | Searchable FAQ with current policy/care explanations | Keep; add one approved technology-backup answer |
| `/contact` | Direct email/phone, inquiry form, optional SMS consent, PPC route, Turnstile when configured | Keep; fix reply-window consistency and strengthen failure/degraded fallback |
| `/privacy` | Browser state, Google address, availability, contact/SMS, PPC, and photo disclosures | Currently accurate except future handoff implementation must remain consistent |
| `/terms` | Public tool/availability/third-party/no-veterinary-advice boundaries | Complete |
| 404 | Helpful Home, Services, Plan, and Contact actions | Complete |
| Global error | Retry, Home, and Contact actions without internal details | Complete |
| `sitemap.ts` / `robots.ts` | Empty sitemap and disallow-all unless `SITE_INDEXING_ENABLED=true`; full route list only after the launch gate | Complete; keep indexing off in 12F |
| `layout.tsx` | Root metadata, canonical host, OpenGraph/Twitter image, LocalBusiness and WebSite JSON-LD | Mostly complete; social metadata composition and unsupported `priceRange` need a narrow correction |
| `proxy.ts` | Apex-to-www and legacy `/about` redirects plus security headers | Complete |
| `/api/estimate` | Bounded server-side estimate calculation; private review reasons removed from public response | Complete foundation; UI failure state needs work |
| `/api/availability` | Date-range-only conservative review states; private calendar details never returned | Complete and appropriately conservative |
| `/api/address/suggestions` | Optional server-key Google autocomplete | Complete; real configured smoke remains manual |
| `/api/address/check` | Server-side validation and traffic-unaware typical travel; returns ZIP/city/tier only | Complete privacy boundary; cross-route session handoff is missing |
| `/api/contact` | Validated/rate-limited/Turnstile-gated Resend write with safe errors, duplicate suppression, and visitor confirmation | Complete integration boundary; visible fallback copy needs refinement |
| Public analytics | Allowlisted browser-only CustomEvents plus allowlisted referral attribution | Privacy-safe but has no consumer/backend; do not add one in 12F |

## 6. Historical-item classification matrix

Each row has exactly one current classification. A/B/C is included only when the item is current implementation, deferred, or prohibited.

### Smart features

| Historical concept | Classification | A/B/C | Evidence | Current action |
| --- | --- | --- | --- | --- |
| Guided `/start` | ALREADY COMPLETE | — | `/start` is the canonical new-client path and is linked from home/header/footer | Preserve; do not rebuild as a wizard |
| Visual wizard/progress gamification | NO LONGER NEEDED | — | The current six-step path plus tool-level completion guidance is clear without accounts or durable state | Do not add complexity |
| Session persistence | ALREADY COMPLETE | — | Two sanitized `sessionStorage` records preserve only broad planning fields | Preserve privacy contracts |
| Clear/reset | ALREADY COMPLETE | — | Estimator and planner each expose an explicit clear/reset action | Preserve and test |
| Shareable non-identifying estimate | ALREADY COMPLETE | — | Copy summary contains service, dates, subtotal/total, and non-booking boundary but no identity/address/medical/access data | Treat copy as the share mechanism; do not add address-bearing URLs |
| Printable estimate | ALREADY COMPLETE | — | QuoteEstimator invokes browser print | Preserve |
| CarePlanner explanations | ALREADY COMPLETE | — | Result includes starting point, gaps, reasons, review items, factors, assumptions, and warnings | Preserve |
| CarePlanner → estimator handoff | IMPLEMENT IN CURRENT 12F | A | Link still targets `/?...#estimate`; estimator moved to `/rates#estimate` in 12E | Point to `/rates?...#estimate`; preserve safe prefill fields and test |
| Quote summary → service-area handoff | IMPLEMENT IN CURRENT 12F | A | `CarePlanSummary` links to `#area`, an anchor absent from `/rates` | Point to `/service-area` and test |
| Manual-review routing | ALREADY COMPLETE | — | Estimator/planner use Personalized review required and suppress private reasons | Preserve |
| Service-area explanation | ALREADY COMPLETE | — | Dedicated page separates travel classification from capacity/acceptance | Preserve |
| Address result → estimator handoff | IMPLEMENT IN CURRENT 12F | A | The cross-document event only works when tools share a page; 12E moved them apart. Privacy copy says ZIP/tier may be saved, but tier is not persisted/loaded | Save only ZIP plus derived tier in session state and offer `/rates#estimate`; never save exact address |
| QuoteEstimator calculation errors | IMPLEMENT IN CURRENT 12F | A | A failed `/api/estimate` request clears the result and leaves a calculating/incomplete-looking panel without a retry/fallback state | Retain input, show a safe error, retry, and Contact fallback |
| Availability messaging/checker | ALREADY COMPLETE | — | Only requested dates are sent; public states remain conservative; blank calendar space never confirms capacity | Preserve; no live promise |
| Precise Petcare handoff | ALREADY COMPLETE | — | Start, summary, contact, and core pages distinguish exploration/request/confirmation and route private data to PPC | Preserve; no duplicate records |
| FAQ/search | ALREADY COMPLETE | — | Search/filter, empty result, and Contact fallback exist | Preserve; add only the approved technology FAQ item |
| Browser-only privacy-safe analytics | ALREADY COMPLETE | — | Allowlisted CustomEvents, no network sender/listener/backend, safe referral allowlist | Keep optional and inert |
| External analytics backend | DEFER / POST-LAUNCH | B | No demonstrated need or approved provider/retention contract | Reconsider only with a measured question and privacy review |

### Client preparation

| Historical concept | Classification | A/B/C | Evidence | Current action |
| --- | --- | --- | --- | --- |
| General preparation for a sitter | IMPLEMENT IN CURRENT 12F | A | `/start` has a high-level readiness cue but not a concise actionable checklist | Add one original, compact module to `/start`; no new resource page |
| Supplies and food locations | IMPLEMENT IN CURRENT 12F | A | CURRENT logic 17 and logic 21 support readiness reminders; current public coverage is only general | Include sufficient food/medication/litter/enclosure supplies and secure location instructions |
| Primary and backup access readiness | IMPLEMENT IN CURRENT 12F | A | `/safety` covers failure, but `/start` does not clearly ask clients to test the primary method and prepare a backup | Add a high-level readiness reminder; credentials stay in PPC |
| Emergency contacts and veterinary information | ALREADY COMPLETE | — | `/start`, `/safety`, `/contact`, and PPC guidance route these to secure records | Preserve; may be repeated briefly in the preparation module |
| Care instructions | IMPLEMENT IN CURRENT 12F | A | Current pages say to keep them current but do not group the preparation action | Add a concise PPC-oriented reminder without collecting details publicly |
| Medication-instruction preparation | IMPLEMENT IN CURRENT 12F | A | Medication scope and secure-record boundaries exist; preparation action is dispersed | Add only a reminder for current written instructions and supplies in PPC; no medical advice |
| Smart feeders/fountains/self-cleaning litter boxes | IMPLEMENT IN CURRENT 12F | A | CURRENT client-explanation library expressly approves the concept that devices may support but not replace in-person checks | Add one FAQ answer and a backup-plan reminder, written originally |
| Smart locks/doors | ALREADY COMPLETE | — | `/safety` covers smart-lock/gate failures and approved backup access | No separate article |
| Pet-camera disclosure/boundaries | ALREADY COMPLETE | — | `/safety` and privacy language keep camera terms within approved agreements and secure onboarding | No integration; no broader policy while conditional agreements remain DRAFT |
| GPS-collar educational resource | NO LONGER NEEDED | — | No demonstrated client need and no current authority requiring public content | Do not create content merely because the historical list named it |
| Technology backup instructions | IMPLEMENT IN CURRENT 12F | A | Approved sources support equipment-failure planning; current content is fragmented | Include a concise general backup plan in `/start`/FAQ |
| New standalone preparation page | NO LONGER NEEDED | — | A new page would duplicate `/start`, `/safety`, and FAQ and risk thin content | Strengthen existing destinations only |
| Private PSI/third-party handout reuse | DO NOT IMPLEMENT | C | Rights boundary prohibits publication, linking, embedding, copying, close paraphrase, or graphical recreation | Write only original authority-grounded Cuddle Crew copy |

### Safety, emergency, continuity, accessibility, and contact

| Historical concept | Classification | A/B/C | Evidence | Current action |
| --- | --- | --- | --- | --- |
| Sacramento heat and pavement safety | ALREADY COMPLETE | — | `/safety`, FAQ, Services, and CURRENT authority permit modification for heat/surfaces | Preserve general non-veterinary wording; no thresholds invented |
| Wildfire smoke/air quality | ALREADY COMPLETE | — | `/safety` and approved contract/manual cover smoke, wildfire, and air quality | Preserve |
| General weather safety | ALREADY COMPLETE | — | Static guidance explains shortening/modifying/stopping unsafe outdoor activity | Preserve |
| Real-time weather/AQI integration | DO NOT IMPLEMENT | C | No approved operational need or live-data decision contract; it would add provider/error complexity | Keep general information separate from live integrations |
| Visit duration/frequency education | ALREADY COMPLETE | — | Planner, Services, FAQ, and approved care-frequency guidance cover it | Preserve |
| Choosing a professional sitter | ALREADY COMPLETE | — | `/choosing-care` is substantive and neutral | Preserve |
| Veterinary diagnosis/advice | DO NOT IMPLEMENT | C | Public content is general information only | Preserve no-veterinary-advice boundary |
| Emergency procedures | ALREADY COMPLETE | — | `/safety` covers safe contact/escalation at a public level | Do not publish internal checklists |
| Veterinary authorization explanation | ALREADY COMPLETE | — | `/safety` defers to current approved instructions/authorization and avoids limits not publicly approved | Preserve; DRAFT core 05 is not authority |
| Home-access failure | ALREADY COMPLETE | — | `/safety` covers lock/key/gate failure and safe fallback | Preserve |
| Sitter illness/emergency | ALREADY COMPLETE | — | Homepage and `/safety` match CURRENT continuity authority | Preserve |
| Guaranteed backup employees/sitters | DO NOT IMPLEMENT | C | CURRENT continuity authority expressly forbids a guarantee | Preserve owner-operated, approved-path, no-guarantee wording |
| Public continuity systems/details | DO NOT IMPLEMENT | C | F7/F13 own internal recovery; operations 38 requires private provider/access/capacity data | Keep only truthful public explanation |
| Accessibility statement/contact route | IMPLEMENT IN CURRENT 12F | A | Strong F11/12D foundation exists, but no public accessibility statement or explicit accessibility-help route exists | Add a concise truthful `/accessibility` page and footer/contact path; no certification claim |
| Manual accessibility validation | MANUAL / OWNER TASK | — | NVDA, real 200%/400%/text-only zoom, forced colors, orientations/devices, configured Turnstile, and configured Google autocomplete remain unperformed/manual | Does not block truthful statement or other 12F code; remains pre-launch evidence |
| Contact form success | PARTIALLY COMPLETE | — | Delivery acceptance and booking boundary are good, but visible success says one business day while configured/confirmation copy says 1–2 business days | Correct under the contact reliability implementation item |
| Contact failure/fallback | IMPLEMENT IN CURRENT 12F | A | Values are retained and email fallback exists; safe phone/PPC next actions and no-JS guidance are incomplete | Add consistent email/phone/PPC fallback without sending real messages |
| Phone/SMS wording | ALREADY COMPLETE | — | Phone is a call path; texting is offered only after explicit optional SMS consent with canonical disclosure | Preserve; do not imply open inbound texting availability |

### SEO, local, trust, and privacy

| Historical concept | Classification | A/B/C | Evidence | Current action |
| --- | --- | --- | --- | --- |
| Titles, descriptions, H1s, canonicals | ALREADY COMPLETE | — | Every major route has a meaningful H1; root or route metadata supplies title/description/canonical | Preserve and test |
| Internal links | ALREADY COMPLETE | — | Header, footer, Start, contextual CTAs, and trust links expose every major route | Repair only the two stale smart-tool destinations |
| Alt text | ALREADY COMPLETE | — | All rendered photos have factual alt text; icons are decorative/labelled appropriately | Preserve; name-consent question is separate |
| LocalBusiness and WebSite JSON-LD | PARTIALLY COMPLETE | — | Valid high-level graphs exist; `priceRange: '$$'` is unsupported, and locality authority needs owner confirmation before expansion | Remove unsupported `priceRange`; do not strengthen locality claims without authority |
| Services hub | ALREADY COMPLETE | — | Phase 12E created substantive `/services` | Preserve |
| Service Area hub | ALREADY COMPLETE | — | Phase 12E created substantive `/service-area` | Preserve |
| Sacramento-area relevance | ALREADY COMPLETE | — | Current approved contract uses Sacramento and the site uses restrained area wording | Preserve; no keyword expansion |
| Carmichael base/locality claim | MANUAL / OWNER TASK | — | Current implementation says based in Carmichael, while CURRENT contracts use a Sacramento notice address and no dedicated approved public-locality record resolves the distinction | Owner should approve a non-private public business/locality statement; does not block other 12F work |
| OpenGraph/social metadata | IMPLEMENT IN CURRENT 12F | A | Most routes have route-specific OG fragments but no explicit shared image/site fields; `/credentials` has no route OG; Twitter text is root-generic | Use a small shared metadata pattern so each major route gets accurate canonical OG/Twitter title, description, URL, and the existing approved social image |
| 404 | ALREADY COMPLETE | — | Useful explanation and four safe next actions | Preserve |
| Sitemap/robots/crawlability | ALREADY COMPLETE | — | Both are intentionally gated; noindex/disallow/empty sitemap are current | Preserve unchanged in 12F except add `/accessibility` to the gated route list |
| Production indexing/Search Console | MANUAL / OWNER TASK | — | Launch gate remains intentionally off | 12H/launch only; does not block 12F |
| `sameAs` | ALREADY COMPLETE | — | Four official business profile URLs are used without ratings/review claims | Preserve; launch owner re-verification remains manual |
| Thin city pages/duplicate local templates | DO NOT IMPLEMENT | C | No unique client value; risks spam and misleading location claims | Do not create |
| Keyword stuffing/fake local addresses | DO NOT IMPLEMENT | C | Conflicts with truthful local presentation and private-origin boundary | Do not create |
| Reviews/ratings/testimonials | MANUAL / OWNER TASK | — | No approved review text, rating evidence, or republication permission | Omit; optional future addition only after proof/permission |
| Years in business/client counts | DO NOT IMPLEMENT | C | No CURRENT / APPROVED evidence | Do not claim |
| Certification/training/background checks/insurance/bonding | MANUAL / OWNER TASK | — | Operations 40 remains PLACEHOLDER | Keep neutral `/credentials` wording until verified and approved |
| Employees/team claims | DO NOT IMPLEMENT | C | Owner-operated authority does not support invented personnel | Preserve current restraint |
| Live availability/24-7 claims | DO NOT IMPLEMENT | C | Capacity authority requires review and does not support live or continuous availability promises | Preserve conservative states |
| Transportation availability | CONFLICTS WITH CURRENT AUTHORITY | — | Current authority says do not offer unless coverage/scope is confirmed; operations 40 is incomplete | Keep as personalized review/not offered; no workflow |
| Medical expertise | DO NOT IMPLEMENT | C | Medication handling is individualized scope review, not medical expertise | Do not claim |
| PSI asset publication permission | ALREADY COMPLETE | — | Owner confirms legitimate portal logos/certificate may be used on website/social media; certificate remains tracked | Do not reopen rights or remove certificate |
| PSI active-status wording/display | MANUAL / OWNER TASK | — | Publication rights do not establish active status; operations 40 is PLACEHOLDER | Add visible status/logo/certificate treatment only after CURRENT / APPROVED wording exists |
| Broad security/privacy audit | NO LONGER NEEDED | — | F1/F3/F4/F6/F7/F12/F13 already completed it | Retain only current application-specific findings below |
| New 12E route private-data exposure | ALREADY COMPLETE | — | Pages contain business/public content only; no private client records or internal thresholds found | Preserve |
| Public APIs safe-response boundaries | ALREADY COMPLETE | — | Estimate strips private reasons; availability strips event data; address omits origin/exact destination; contact errors do not reflect submitted content | Preserve |
| Session/query privacy | PARTIALLY COMPLETE | — | Sanitization is strong; cross-route tier handoff is missing and two stale anchors remain | Fix the handoff without adding exact address/dates/identity to storage/URLs |
| Gallery EXIF | IMPLEMENT IN CURRENT 12F | A | `client-dog-loki-sun.JPEG` retains EXIF including GPS-tag fields and camera/time metadata; other public JPEGs are stripped/minimal | Re-encode/scrub metadata while preserving visual content, dimensions/orientation, file role, permission, and tests |
| Client pet names/folder-derived labels | MANUAL / OWNER TASK | — | Public labels/paths identify Blu, Loki, and Skylar as client dogs. Photo permission is resolved, but current instruction does not explicitly establish public pet-name attribution | Owner confirms whether written consent includes pet-name labeling; this does not block EXIF cleanup or other 12F work |
| Invasive analytics | DO NOT IMPLEMENT | C | No need; current analytics is browser-only and non-identifying | Do not add third-party tracking by default |

## 7. F0–F14 overlap disposition

The following historical work is removed from current 12F because the foundation already owns it:

| Removed historical overlap | Foundation disposition |
| --- | --- |
| Recreate local setup/environment diagnostics | F0 complete |
| Recreate secret scanning or secret-handling policy | F1 complete |
| Recreate Git/worktree safeguards | F2 complete |
| Recreate generic data classification, privacy architecture, retention, or browser-data policy | F3 complete |
| Recreate dependency/supply-chain policy or broad upgrades | F4 complete |
| Recreate generic test/quality framework | F5 complete |
| Recreate provider write gates, side-effect boundaries, or integration architecture | F6 complete |
| Recreate generic observability, error logging, or recovery architecture | F7 complete |
| Recreate generic performance/resource-limit framework | F8 complete |
| Recreate cross-platform/path framework | F9 complete |
| Recreate time/locale/determinism framework | F10 complete |
| Recreate generic accessibility/responsive engineering | F11 complete; only truthful statement/content remains |
| Recreate CI, deployment security, headers, indexing gates, or hosted validation architecture | F12 complete |
| Recreate backup/disaster-recovery/business-continuity systems | F13 complete; only truthful public continuity copy was audited |
| Repeat foundation GO/NO-GO | F14 complete; Phase 12G owns the next full release audit |

Current 12F retains only demonstrated application-level behavior/content gaps. It does not rerun a generic security, privacy, accessibility, SEO, performance, or operations program.

## 8. Phase 12E overlap disposition

The following historical 12F ideas are removed because Phase 12E already completed them:

- generic homepage clarity and hierarchy;
- a guided `/start` route and new-client orientation;
- substantive Services, Rates, Service Area, and Gallery routes;
- estimator placement at `/rates#estimate`;
- service-area tools at `/service-area`;
- simplified primary navigation and grouped footer;
- owner/primary-caregiver explanation and approved Blu hero;
- full approved pet gallery and written client-photo consent disclosure;
- accessible gallery lightboxes;
- generic imagery/trust expansion;
- the core PPC registration/login handoff and booking-confirmation boundary;
- generic service/rate/service-area page creation;
- PSI certificate preservation and prohibited-resource protections.

The two stale smart-tool links and the service-area-to-estimator session gap are post-move integration defects, not authorization to redo Phase 12E information architecture.

## 9. Smart-feature audit

| Feature | Route/component | Purpose and data handled | Client benefit/current state | UX/privacy finding | 12F disposition |
| --- | --- | --- | --- | --- | --- |
| New-client guide | `/start` | Static public orientation; no client data | Clear, complete, linked | No wizard/account needed | ALREADY COMPLETE |
| QuoteEstimator | `/rates`; `QuoteEstimator.tsx`; `/api/estimate` | Pet type/complexity flag, service, dates, windows, midday selection, ZIP, derived tier | Full preliminary estimate, review routing, copy, print, reset | Server error has no explicit retry/fallback; date/inputs are not persisted | IMPLEMENT error state (A) |
| CarePlanner | `/plan`; `CarePlanner.tsx` | Counts, life stage, intervals, windows, task/medication/behavior categories; sensitive categories remain memory-only | Useful explanations and manual review | Price link still points to old homepage anchor | IMPLEMENT link repair (A) |
| Planning session state | `planning-state.ts`; `care-planner-progress.ts` | Session-only allowlisted broad fields | Reduces re-entry | No exact address, identity, dates, detailed medical/behavior/access data | ALREADY COMPLETE; extend only with derived tier |
| Clear/reset | Estimator and planner | Removes their session keys and resets UI | Transparent user control | Estimator does not announce clear as explicitly as planner, but action is clear and no material blocker was found | ALREADY COMPLETE |
| Copy/print | QuoteEstimator | User-initiated non-identifying text copy and print | Sufficient share/print path | No address-bearing URL; copied dates are under user control | ALREADY COMPLETE |
| Service-area checker | `/service-area`; AddressChecker; address APIs | Exact address is sent transiently server→Google; browser receives suggestion labels, ZIP/city/tier | Useful typical-travel classification with safe fallback | Successful tier is not reusable after navigation; exact address is not saved | IMPLEMENT privacy-safe session handoff (A) |
| Availability | QuoteEstimator; `/api/availability` | Requested start/end only; returns conservative states/dates | Prevents false availability promise | Fallback safely remains Request for Review; no client/calendar details escape | ALREADY COMPLETE |
| Manual review | Estimator/planner/Start/PPC | Broad client inputs; private reasons stripped | Protects safety/scope | Correct neutral wording | ALREADY COMPLETE |
| PPC handoff | Start, summary, Contact | Links to external registration/login; private operational records remain there | Clear authoritative next step | Summary's service-area link is stale, but PPC destination is valid | ALREADY COMPLETE plus link repair |
| FAQ/safety search | `/faq`, `/safety` | Search text remains component memory; event records only that a search occurred | Fast content discovery | Search term is not stored or emitted | ALREADY COMPLETE |
| Public analytics | `public-analytics.ts`, `referral.ts`, `PublicAttribution.tsx` | Browser-only events and allowlisted referral source | Future measurement hook only | No listener/backend; no network/storage of events | ALREADY COMPLETE as a safe optional hook; no expansion |

Complexity rejected for current 12F: durable accounts, saved client profiles, booking state, actual capacity calendars, native share URLs with dates/address, dashboards, or gamification.

## 10. Client-preparation audit

| Topic | Current coverage | CURRENT authority | Recommended destination | Disposition |
| --- | --- | --- | --- | --- |
| Supplies/food locations | Only high-level readiness wording | Logic 17 §§2, 8; logic 21 Supplies | One concise `/start` preparation module | IMPLEMENT NOW (A) |
| Access/key readiness | `/safety` handles failures; `/start` says approved arrangement | Logic 16 §8; logic 17 §7 | `/start` reminder to test primary access and prepare approved backup; secrets in PPC | IMPLEMENT NOW (A) |
| Emergency contacts/vet information | `/start`, `/safety`, `/contact` | Logic 16 §4; logic 17 §9; core 01 | Brief checklist cross-reference only | ALREADY COMPLETE |
| Care instructions | General secure-record guidance | Logic 16 §§2–3; logic 17 §2 | `/start` checklist; PPC is authoritative | IMPLEMENT NOW (A) |
| Medication preparation | Scope/privacy warnings exist | Logic 16 §6; logic 17 §3; logic 22 | `/start`: current written instructions/supplies in PPC, no details on public site | IMPLEMENT NOW (A) |
| Walking/carrier/equipment | Services/Safety discuss fit/failure | Logic 17 §§5, 8 | Include only a short relevant-equipment readiness cue | IMPLEMENT NOW (A) |
| Automatic feeders/fountains/litter boxes | Not directly answered | Client Explanation §12; Pricing/Care Manual §10 | One FAQ item plus `/start` backup-plan cue | IMPLEMENT NOW (A) |
| Smart locks/doors | `/safety` explicitly covers failures | Logic 16 §8; logic 17 §7 | No new content beyond backup-access cue | ALREADY COMPLETE |
| Pet cameras | Disclosure/privacy boundary only | Logic 17 §10; core 01 confidentiality; exact conditional terms remain DRAFT | Keep high-level `/safety`; no integration | ALREADY COMPLETE |
| GPS collars/tracking | No public content/integration | No demonstrated current content need | None | NO LONGER NEEDED; tracking remains C |
| Weather/summer preparation | General heat/smoke/weather behavior exists | Core 01 §29; Pricing/Care Manual §27 | Existing `/safety`/FAQ | ALREADY COMPLETE |
| New resource page | Not present | Existing pages already own the topics | None | NO LONGER NEEDED |

All new wording must be original Cuddle Crew copy. The prohibited private PDFs/infographic are not source text, may not be opened for content extraction, and may not be published, linked, embedded, routed, downloaded, copied, closely paraphrased, or graphically recreated.

## 11. Safety education findings

`/safety`, `/choosing-care`, FAQ, Services, and the CarePlanner already cover the remaining authority-supported public concepts: heat/pavement, smoke/air quality, weather modification, flexible windows, care-frequency/duration fit, equipment, medication review, and provider selection. The content is general, non-diagnostic, and repeatedly defers individualized care to Lauren, approved records, and veterinary professionals where appropriate.

A new Sacramento summer/wildfire page is not justified now. Current approved authority supports the safety-modification principle, not invented numeric thresholds or a live decision engine. Richer static education can be reconsidered post-launch only if the owner identifies a client question and the copy is independently written from appropriate current sources. Real-time weather/AQI and veterinary-advice features are C — DO NOT IMPLEMENT.

## 12. Emergency and continuity public-content findings

Current public coverage is sufficient:

- `/safety` covers client-unreachable, veterinary concerns, access failure, sitter illness/emergency, unsafe roads, outages, wildfire/evacuation, and safe transfer concepts;
- the homepage accurately says Cuddle Crew follows approved contingency procedures, communicates promptly, and uses only an approved path;
- public copy does not promise a standing backup sitter, employee team, guaranteed substitute, or uninterrupted coverage;
- private provider identities, access, route/capacity, and handoff details are not exposed.

F7 and F13 own internal engineering/recovery. Operations 38 owns internal continuity. Current 12F has no continuity-system implementation and no additional public-content gap.

## 13. Accessibility-statement finding

Recommendation: **IMPLEMENT IN CURRENT 12F (A)** as a concise `/accessibility` statement/contact route, linked from the footer and contact context and included in the gated sitemap list.

Truthful boundaries:

- describe accessibility as an ongoing design/testing objective, not certification;
- do not claim WCAG conformance, legal compliance, exhaustive assistive-technology support, or that every combination was tested;
- invite users who encounter a barrier or need an alternate way to obtain information to email or call;
- do not publish internal defect lists or suggest medical/disability verification is required;
- preserve current F11 semantics, focus, reflow, motion, contrast, and test coverage without redoing the foundation.

The statement can ship before manual checks because it will not claim those checks occurred. The remaining real NVDA, 200%/400%/text-only zoom, forced-colors/high-contrast, mobile/tablet orientation/task completion, configured Turnstile, and configured Google autocomplete checks remain manual pre-launch tasks.

## 14. Contact reliability findings

| State | Current evidence | Finding/action |
| --- | --- | --- |
| Success | API reports accepted delivery only; visitor confirmation preserves no-booking boundary | Good, but UI says one business day while config/email says 1–2 business days; align to 1–2 |
| Validation | Native required/type/min/max plus safe server validation | Complete |
| Provider/security failure | Values retained; focused alert; email fallback | Add phone and secure PPC next actions where relevant; preserve safe error text |
| Resend disabled | API safely returns non-sensitive 503 | UI fallback should clearly explain alternate contact paths without internals |
| Turnstile disabled | No widget; writes still depend on Resend | Correct optional behavior |
| Turnstile misconfigured/failure | Safe direct-email error | Preserve; manual configured smoke remains |
| Phone | Clearly a call action | Correct; do not imply texting is generally available |
| SMS | Optional unchecked consent with canonical disclosure, STOP/HELP and privacy wording | Complete; do not change in 12F |
| No JavaScript/degraded | Direct email/phone content is server-rendered, but form/tool expectations are not explicit | Add a short `<noscript>`/degraded next-action message; no real send test |

No production messages, provider writes, dashboard changes, or live credential tests belong in implementation.

## 15. SEO/local route-by-route audit

Common current behavior: `layout.tsx` supplies the canonical host, root title/description, robots gate, OpenGraph/Twitter image, LocalBusiness, and WebSite schema. `robots.ts` disallows all crawling and `sitemap.ts` emits no URLs unless `SITE_INDEXING_ENABLED=true`. Every route below is therefore currently noindex/disallowed and absent from the live sitemap by design. If the launch gate is later enabled, all listed routes are in the gated sitemap. 12F must not enable the gate.

“OG partial” means the page has route-specific title/description/URL but relies on root-level image/site/card fields; the future fix should use one shared pattern rather than duplicate uncontrolled metadata.

| Route | Title/meta/H1/canonical | Internal links | Schema/alt/social | Sitemap/robots | Classification and recommendation |
| --- | --- | --- | --- | --- | --- |
| `/` | Root title/description; one descriptive H1; canonical `/` | Header/footer plus rich contextual links | Global LocalBusiness/WebSite; three factual photo alts; full root OG/Twitter | Gated/disallowed | PARTIALLY COMPLETE — remove unsupported schema `priceRange`; otherwise keep |
| `/start` | Route-specific all present | Header, footer, home, and tool CTAs | Global schema; no page image; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata fix; preparation content is separate A |
| `/services` | Route-specific all present | Header, footer, home, Start, Rates, Plan | Global offer catalog; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata only |
| `/rates` | Route-specific all present | Header, footer, home, Services, Holidays, Area, Start, Contact | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata; estimator UX A |
| `/service-area` | Route-specific all present | Header, footer, home, Start, Rates, Contact | Global areaServed; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata; handoff A |
| `/gallery` | Route-specific all present | Header, footer, home | Global schema; all 15 gallery images have factual alt; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata and EXIF A |
| `/plan` | Route-specific all present | Header, footer, home, Services, Start, Contact | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — repair stale `/rates#estimate` link and shared social metadata |
| `/holidays` | Route-specific all present | Footer, Rates, Contact, PPC | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata only; no calendar change |
| `/choosing-care` | Route-specific all present | Footer, home, Plan, Credentials | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata only |
| `/safety` | Route-specific all present | Footer, home, search, Contact | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata only; content otherwise complete |
| `/credentials` | Route title/description/H1/canonical present | Footer, home, Contact | Global schema; no route-specific OG; root-generic Twitter | Gated/disallowed | IMPLEMENT IN CURRENT 12F (A) — accurate route social metadata; no new claim |
| `/faq` | Route-specific all present | Header, footer, home, search, Contact | Global schema; OG partial; no FAQPage duplication required | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata; one approved FAQ answer A |
| `/contact` | Route-specific all present | Header, footer, home, privacy, PPC | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata/contact reliability A |
| `/privacy` | Route-specific all present | Footer, contact, terms | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata only; keep disclosures accurate |
| `/terms` | Route-specific all present | Footer, privacy, contact | Global schema; OG partial | Gated/disallowed | PARTIALLY COMPLETE — shared social metadata only |
| 404 | One H1; metadata handled by framework | Home/Services/Plan/Contact | No schema/image needed | Never in sitemap | ALREADY COMPLETE |
| Proposed `/accessibility` | Not present | Not present | Not present | Not present | IMPLEMENT IN CURRENT 12F (A) with title/meta/canonical/OG/Twitter/footer/gated sitemap |

No city pages, neighborhood templates, keyword stuffing, fake address, duplicate content, review schema, unsupported FAQ schema, or indexing activation is recommended.

## 16. Trust and claims findings

| Claim area | Current state | Recommendation |
| --- | --- | --- |
| Owner-operated / Lauren ordinarily primary | Supported by CURRENT contract/continuity and current implementation | Preserve the continuity caveat |
| Professional in-home pet care | Supported by CURRENT Master Service Agreement | Preserve |
| Reviews/ratings/testimonials | No public claim; profile links are explicitly not ratings | Keep omitted until evidence and permission |
| Client counts/years | No claim | Do not add |
| Certifications/training/background checks | Neutral `/credentials`; operations 40 PLACEHOLDER | Manual verification/authority first |
| Insurance/bonding | Neutral request-current-information wording | Manual verification/authority first |
| Employees/backup sitters | No invented team; no standing backup advertised | Preserve |
| Availability | Conservative Request for Review and no capacity counts | Preserve |
| Transportation | Only routed to review/out-of-scope boundary, not sold | Preserve; no workflow until approved |
| Medical expertise/24-7 service | Not claimed | Do not add |
| PSI | Certificate asset preserved; no public textual status claim | Rights resolved; status/manual authority unresolved |
| Locality | Sacramento-area wording is restrained; Carmichael “based in” lacks a dedicated approved public-locality record | Owner/authority task before strengthening or changing structured locality |
| Structured-data price range | `priceRange: '$$'` lacks an approved meaning | Remove in current 12F rather than invent a classification |

No unsupported claim requires broad copy removal on this evidence. The only current implementation correction is the schema price-range field. Credential, PSI, testimonial, and locality expansion remain owner/authority tasks.

## 17. Application-specific privacy/security findings

| Surface | Current protection | Actual gap/current action |
| --- | --- | --- |
| New 12E public routes | Static public business/content data; no private client records or internal thresholds | No gap |
| Estimator API | Bounded input/rate limits; private review reasons stripped; no-store | UI failure state only; no API redesign |
| Availability API | Date range only; raw ICS/event names/client details never returned; no-store | No gap; do not make “live” |
| Address APIs | Server keys/origin private; output limited to suggestion label or ZIP/city/tier; exact address not saved by site | Cross-route tier persistence missing; save only ZIP/derived tier |
| Contact API | Validation, rate limit, Turnstile, honeypot, hashed duplicate key, escaped email, safe diagnostics/errors | No security gap; visible fallback refinement only |
| Session storage | Allowlisted, session-only, sanitized; no identity/exact address/dates/detailed sensitive fields | Add derived tier carefully; do not add exact address |
| Query prefill | Broad planner household/service/windows only | Repair destination; keep dates/address/identity absent |
| Analytics | Allowlisted fields/referral; CustomEvent only; no sender | No gap; no third-party backend |
| Gallery | Public permission disclosure and no client human/household context in code | One public JPEG retains GPS-bearing EXIF; scrub and add regression check |
| Error states | Global/API messages avoid stack/provider internals and submitted-data reflection | Estimator needs usable error/retry, not more internal detail |
| Security headers/provider gates | F12/F6 protections remain in `proxy.ts` and server routes | Foundation complete; do not redo |

## 18. Public analytics audit

Declared event names are:

- `service_area_checked`;
- `availability_checked`;
- `estimator_started`;
- `estimator_completed`;
- `planner_started`;
- `planner_completed`;
- `faq_searched`;
- `safety_searched`;
- `provider_comparison_viewed`;
- `new_client_clicked`;
- `existing_client_clicked`;
- `contact_submitted`;
- `phone_clicked`;
- `instagram_clicked`.

Current call sites emit `estimator_started`, `planner_started`, `planner_completed` (`duration`, `status`), `faq_searched`, `safety_searched`, `provider_comparison_viewed`, `new_client_clicked`, `existing_client_clicked`, `contact_submitted` (`status`), `phone_clicked`, and `instagram_clicked`. `service_area_checked`, `availability_checked`, and `estimator_completed` are declared but not emitted.

Allowed property keys are `serviceType`, `zoneName`, `duration`, `status`, and `referralSource`. Strings are bounded to 1–40 simple characters; finite numbers are bounded; unknown fields are discarded. Development assertions reject keys suggesting address, email, phone, name, message, medical/medication, access, token, URL, or referrer. Current call sites do not send identity, contact data, address, ZIP, dates, medical/access information, or search terms.

Referral attribution accepts only `business-card`, `instagram`, `nextdoor`, `vet-office`, `flyer`, `facebook`, `yelp`, or `google`, stored in `sessionStorage` as `cuddlecrew.referral`.

Events are dispatched only as `window` CustomEvents named `cuddlecrew:public-event`. No listener, network transport, persistence, analytics vendor, cookie, or external backend exists. Therefore events currently do not leave the browser and provide no durable business measurement. The safe hooks are low risk, but adding missing emissions would not create value without a consumer. Keep them unchanged in current 12F; consider any backend separately post-launch with a defined question, minimization/retention contract, and owner approval.

## 19. Gallery/photo privacy findings

- All 15 approved gallery records use static public paths, category, folder/folderLabel, factual alt text, focal position, dimensions, and one homepage-main flag.
- The gallery displays Lauren’s pets separately from client pets and states that client-pet photos are shown with written client/pet-owner permission. Photo rights are resolved and must not be reopened.
- No client human name, address, house number, access information, medical information, testimonial, or household story appears in gallery configuration or captions.
- Public paths/folder labels identify client pets by the names Blu, Loki, and Skylar and label them “client dog.” Whether written consent covers public pet-name labeling needs a narrow owner confirmation. Do not call photo permission unresolved.
- `public/photos/loki - client dog/client-dog-loki-sun.JPEG` retains a 57-property EXIF block, including GPS-tag fields plus camera/time metadata. Exact values were not copied into this document. The other public JPEGs inspected contain only minimal non-sensitive image properties.
- Current 12F should scrub all nonessential metadata from that one image without changing the approved visual, crop intent, public role, or permission, then add a dependency-free regression check that gallery JPEGs contain no EXIF APP1 payload/GPS metadata.
- Do not remove approved photos merely because of this audit.

## 20. PSI presentation finding

`public/psi-membership-certificate.jpg` exists on current main and is directly retrievable as a public asset, but no page links or renders it. No PSI logo file is present on current main. Owner authority confirms that legitimately obtained PSI portal logos and the certificate may be used on the website/social media. Asset-publication permission is therefore resolved; do not remove the certificate for rights uncertainty.

Current public `/credentials` wording correctly withholds membership/certification/insurance/bonding claims because `operations/40-training-certification-service-scope-matrix.md` remains PLACEHOLDER. The certificate or owner statement about permission does not, by itself, satisfy the prompt’s requirement for CURRENT / APPROVED textual membership-status authority.

Recommendation: keep the certificate asset, keep PSI visually/textually unpromoted during current 12F, and treat approval of exact current membership wording as a non-blocking owner/authority task. After authority is approved, a restrained PSI member presentation may be considered on `/credentials`; it must say membership, never certification, endorsement, insurance, or bonding unless separately supported.

## 21. Manual / owner tasks

| Exact task | Blocks current 12F implementation? |
| --- | --- |
| Confirm and record in CURRENT / APPROVED authority the exact current PSI membership wording/status before visible PSI treatment | No; blocks only PSI display/claim |
| Confirm whether written client-photo consent includes public use of client-pet names in labels, alt text, and URL paths | No; blocks only pet-name/path changes; EXIF scrub proceeds |
| Supply a genuine review/testimonial/rating plus republication permission if desired | No; omit social proof until supplied |
| Verify training, certification, background-check, insurance, bonding, medication-scope, and transportation status and populate/approve the controlling reference | No; keep neutral claims |
| Approve a public, non-private business/locality statement resolving Carmichael “based in” versus the Sacramento contractual notice address | No; do not strengthen/change locality meanwhile |
| Complete NVDA task flows | No; pre-launch manual evidence |
| Complete real 200%, 400%, and text-only zoom checks | No; pre-launch manual evidence |
| Complete Windows forced-colors/high-contrast checks | No; pre-launch manual evidence |
| Complete real mobile/tablet portrait/landscape task flows | No; pre-launch manual evidence |
| Smoke configured Turnstile in an approved environment | No; pre-launch/provider task; do not send production messages in 12F |
| Smoke configured Google autocomplete with keyboard/touch/pointer | No; pre-launch/provider task |
| Review final social-preview rendering/image | No; owner visual check after implementation |
| Decide when to enable indexing and verify Search Console | No; 12H/launch only |

All A-scope implementation can proceed independently while these tasks remain open, provided it does not publish blocked claims or change blocked pet-name/locality content.

## 22. Deferred/post-launch items

All rows are B — USEFUL LATER / POST-LAUNCH.

| Item | Reason |
| --- | --- |
| External analytics backend/dashboard | No current measurement question, provider, retention policy, or value; browser hooks are sufficient |
| Richer Sacramento heat/wildfire educational resource | Current general safety content is adequate; revisit from actual client questions and approved sources |
| Authenticated client onboarding-progress display | PPC remains the operational system; no approved integration or need for a duplicate state system |
| Authenticated internal continuity/capacity tooling | Separate private operations project, not public 12F |
| Reviews/testimonials presentation | Only after evidence and republication permission |
| Visible PSI member presentation | Only after exact status wording is CURRENT / APPROVED |
| Search Console submission and indexing | 12H launch gate |
| Third-party social-preview/platform verification | Manual launch/release work after implementation |

Deferred items are not acceptance criteria for current 12F.

## 23. Do-not-implement list

All rows are C — DO NOT IMPLEMENT unless a future explicit owner decision and applicable authority deliberately change the boundary.

| Item | Reason |
| --- | --- |
| AI chatbot | No demonstrated need; risks unsupported advice/automation |
| Automated veterinary advice/diagnosis/treatment | Outside public information scope |
| Auto-booking | Conflicts with manual safety/scope/route/capacity review |
| Duplicate CRM | PPC is the operational system |
| Duplicate client database | Privacy and source-of-truth conflict |
| Duplicate login/account system | No need; PPC owns client access |
| Exact private client-location storage | Privacy violation for a public tool |
| Public private calendar | Would expose or infer private operations/client data |
| Unsupported live availability | Calendar space is not capacity |
| Pet-camera integration | Surveillance integration prohibited |
| GPS tracking/integration | Surveillance/location integration prohibited |
| Any surveillance integration | No client benefit justifies it here |
| Transportation workflow | Scope/coverage not approved |
| Fake reviews/ratings/testimonials | Unsupported trust claim |
| Fake certifications/memberships/endorsements | Unsupported claim |
| Fake personnel/team/backup sitters | Conflicts with owner-operated truth and continuity authority |
| Pointless gamification | No care/client benefit |
| Fake urgency/scarcity/live counters | Misleading and unsupported |
| Invasive analytics | Conflicts with minimization and has no demonstrated value |
| Thin city/neighborhood pages | Spammy, duplicative, and prone to false locality claims |
| Keyword stuffing/duplicate city templates/fake local addresses | Misleading SEO |
| Real-time weather/AQI decision integration | No approved decision contract; general information is sufficient |
| Publication/link/embed/download/copy/close paraphrase/graphic recreation of the four prohibited resources | Express rights boundary |

## 24. Final current 12F implementation scope

Only the following A items survive reconciliation:

1. Repair cross-route smart-tool destinations: CarePlanner → `/rates?...#estimate`; Quote summary → `/service-area`; add focused regression tests.
2. Add a privacy-safe service-area → estimator handoff using `sessionStorage` for only ZIP and derived travel tier, with a clear `/rates#estimate` action. Never store the exact address or add it to URLs/analytics.
3. Add an explicit QuoteEstimator calculation-failure/retry/Contact state that retains entered values and avoids an indefinite calculating/incomplete display.
4. Align contact success timing to the approved/configured 1–2 business-day expectation and add safe email, phone, PPC, and no-JavaScript/degraded fallbacks. Do not send live messages.
5. Add a concise, original, CURRENT-authority-backed preparation module to `/start` covering secure care instructions, sufficient supplies, equipment where relevant, current emergency information, tested primary/backup access, and technology backup planning. Add one FAQ answer explaining that feeders/fountains/cameras/self-cleaning litter boxes may support but do not replace appropriate in-person checks.
6. Add a truthful `/accessibility` statement/contact route, link it from the footer/contact context, and include it in the indexing-gated sitemap. Do not claim conformance/certification or completed manual tests.
7. Make social metadata consistent and route-specific across major public routes with the existing approved social image, including `/credentials` and the new `/accessibility` route. Remove unsupported `priceRange: '$$'` from LocalBusiness JSON-LD. Do not add review schema, fake locality, or enable indexing.
8. Strip EXIF/GPS and other nonessential metadata from `public/photos/loki - client dog/client-dog-loki-sun.JPEG` while preserving the approved visual/dimensions/orientation and add a dependency-free metadata regression test for public gallery JPEGs.
9. Add/update focused tests for the above behavior and copy while preserving all existing business, privacy, accessibility, and provider boundaries.

## 25. Explicit exclusions

Current 12F implementation must not:

- redo F0–F14 or Phase 12A–12E;
- change pricing, modifiers, dates, holiday calendars, service-area business rules, PPC rules, estimate math, CarePlanner recommendation logic, booking acceptance, service scope, or current manual-review thresholds;
- enable indexing, Search Console, deployment, production providers, production writes, or production dashboards;
- add broad dependencies/upgrades or an analytics provider;
- publish PSI status, credentials, insurance/bonding, reviews/ratings, pet-name consent decisions, or strengthened Carmichael/locality claims without approved authority;
- remove approved photos or the PSI certificate;
- add auto-booking, accounts, CRM/client databases, live availability, private calendars, surveillance, tracking, transportation workflow, veterinary advice, fake trust claims, or gamification;
- publish or derive content from the four prohibited resources;
- broaden the four narrow `.gitignore` protections;
- modify the original dirty checkout.

## 26. Acceptance criteria for future implementation

- [ ] CarePlanner's “Price this starting point” reaches `/rates` with the safe prefill and focuses/resolves `#estimate`; it never targets the removed homepage estimator.
- [ ] CarePlanSummary's service-area action reaches `/service-area`, not a missing local anchor.
- [ ] A successful address check can carry only ZIP and derived travel tier to `/rates#estimate`; the exact address never enters URL/query, browser storage, analytics, logs, or the summary.
- [ ] Estimator network/server failure retains input and shows a clear safe error, retry, and Contact next action; success/manual-review behavior and math remain unchanged.
- [ ] Availability failure remains Request for Review and never becomes a live capacity promise.
- [ ] Contact success consistently states 1–2 business days; failure/degraded states offer usable email, phone, and PPC paths, retain appropriate user data, and expose no internals.
- [ ] `/start` contains one concise original preparation module based only on CURRENT / APPROVED sources; private details are directed to PPC.
- [ ] FAQ explains that care technology may support a plan but does not automatically replace appropriate in-person welfare checks; it provides no surveillance integration.
- [ ] `/accessibility` has accurate title/meta/canonical/social metadata, an accessibility-feedback route, and no WCAG/legal/certification or manual-test-completion claim.
- [ ] Every major public route has an accurate route-specific social title, description, canonical URL, and existing approved preview image without unsupported claims.
- [ ] LocalBusiness/WebSite schema remains valid, contains no AggregateRating/Review or fake address, and no longer asserts unsupported `priceRange: '$$'`.
- [ ] Robots remain disallow-all, metadata remains noindex/nofollow, and sitemap remains empty while `SITE_INDEXING_ENABLED` is not true; 12F does not enable indexing.
- [ ] The approved Loki image remains visually present with the intended dimensions/orientation and no EXIF APP1/GPS metadata; every public gallery JPEG passes the metadata regression check.
- [ ] Photo and PSI publication rights remain recorded as resolved; the PSI certificate remains; no active PSI/credential claim is added.
- [ ] Client-pet human identity, household/location context, access/medical data, and private route/calendar data remain absent.
- [ ] The four exact prohibited resources remain absent/untracked and the four narrow `.gitignore` lines remain exact with no broadening.
- [ ] No auto-booking, duplicate CRM/database/login, private location storage, public calendar, live availability, surveillance, tracking, transportation workflow, veterinary advice, fake trust content, or invasive analytics is added.
- [ ] F11 accessibility behavior remains intact; focused automated checks pass. Manual pre-launch checks are reported separately and are not falsely claimed complete.
- [ ] Current approved pricing and calendar spot checks remain exactly unchanged: Overnight $85/$80/review; Continuous $90/$120/$145/$165/$185/$200; 24-Hour starts $300; 2026–2028 through January 3, 2029.
- [ ] Node tests remain 162/162 or higher only when intentionally added, E2E remains 31/31 or higher only when intentionally added, focused accessibility remains 14/14 or higher only when intentionally added, typecheck passes, lint has 0 errors/0 warnings, build passes, artifact/secret checks pass.
- [ ] Original dirty checkout is unchanged; implementation ends with a reviewable diff and no commit, push, merge, deployment, provider write, or production change.

## 27. Validation expectations for future implementation

Run, at minimum, after installing/using the exact locked local toolchain without changing dependency versions:

```text
npm run doctor
npm run check:git-safety
npm run check:foundation
npm test
npm run typecheck
npm run lint
npm run build
npm run check:build-artifact
npm run e2e:run
npm run check:a11y
git diff --check
```

Add focused automated coverage for cross-route destinations, session handoff minimization, estimator error/retry, contact fallback/timing, accessibility metadata/contact, social metadata/schema, noindex/sitemap gate, EXIF absence, gallery preservation, and prohibited resources. Do not send production contact messages, call live write providers, mutate provider dashboards, enable indexing, deploy, or substitute baseline counts for actual results.

Manual browser review during implementation should cover the changed `/start`, `/rates`, `/service-area`, `/faq`, `/contact`, `/accessibility`, `/credentials`, and `/gallery` surfaces at representative desktop/mobile widths. This is not a substitute for the separately listed owner pre-launch assistive-technology/provider checks.

### Reconciliation validation record

Final documentation-only validation on this branch:

- `npm run doctor`: PASS with the expected non-blocking missing local environment fingerprint warning; Node 22.17.1, npm 10.9.2, locked dependency tree, Playwright Chromium, Gitleaks, ports, and safe integration fallbacks were available.
- `npm run check:git-safety`: PASS; exactly one untracked planning document, no staged files, and no lockfile change.
- `npm run check:foundation`: PASS; secret scan reported 0 findings. Existing reviewed warnings were five extraneous optional/WASM entries and the two already-known large public images.
- Focused reference/filesystem/gallery tests: 36 passed, 0 failed.
- `git diff --check`: PASS for tracked changes; the untracked document was also checked separately and produced no whitespace diagnostics.

The full 162 Node / 31 E2E / 14 focused-accessibility application suites, lint, typecheck, and build were not rerun because this reconciliation changes documentation only and the repository policy does not require the expensive merge-ready suite for this planning branch.

## 28. Fresh copy/paste-ready CURRENT 12F IMPLEMENTATION PROMPT

```text
CUDDLE CREW PET CARE — CURRENT PHASE 12F IMPLEMENTATION

This is an IMPLEMENTATION task based on the owner-reviewed current reconciliation at:

docs/phase-12f-current-state-reconciliation.md

Read that document completely before changing anything. Implement only its final A-scope items. Historical prompts are planning evidence only and are not business-policy authority.

REPOSITORY AND BASELINE

Repository: cuddlecrewpetcare/Cuddle-Crew-Web
Remote: github
Expected starting github/main SHA:
62aa602d7025aaf25aee42e09a6fc36848340119

First fetch github/main and report the fetched SHA. If it differs, inspect and reconcile every intervening change before implementation. Stop and report if a material change invalidates or conflicts with the reconciliation.

WORKTREE SAFETY

The original canonical checkout identified by the owner is intentionally dirty/stale at 3b443a6dcafb0cb3f4ed4129714d357e3e059816 and contains preserved work. Do not reset, clean, restore, stash, stage, modify, delete, move, force-checkout, or otherwise disturb it. Do not prune/delete/purge worktrees or rewrite history.

Create a fresh clean worktree from fetched github/main and a new branch such as:
codex/phase-12f-implementation

Use the original checkout read-only only if genuinely necessary. The current implementation should not need its local assets.

AUTHORITY PREFLIGHT

Before changing public copy, metadata, forms, planning handoffs, safety/preparation wording, SMS/contact behavior, or claims, read:

- AGENTS.md
- docs/business-reference/README.md
- docs/business-reference/guidance/source-of-truth-document-hierarchy.md
- docs/phase-12f-current-state-reconciliation.md
- every most-specific applicable CURRENT / APPROVED source identified in section 4 of the reconciliation

Use only CURRENT / APPROVED references as business authority. PLACEHOLDER, DRAFT, SUPERSEDED, implementation code, and historical prompts are not authority. Never invent an unresolved rule. If two applicable CURRENT / APPROVED sources materially conflict, stop and report the conflict.

Treat Phase 12A, 12B, 12C, F0–F14, Phase 12D, owner-image recovery, roadmap/archive reconciliation, Pre-12E authority reconciliation, Phase 12E reconciliation, and Phase 12E implementation as complete and merged. Do not redo them.

IMPLEMENT ONLY THIS SCOPE

1. Repair cross-route smart-tool destinations.
- Change CarePlanner's pricing link from the removed homepage estimator to /rates with its existing safe planner query and #estimate.
- Change CarePlanSummary's service-area link from missing #area to /service-area.
- Add focused tests for both exact destinations and safe query fields.

2. Add a privacy-safe service-area → estimator handoff.
- After a successful address check, persist only the five-digit ZIP and derived travel-tier key in sanitized sessionStorage state.
- Never persist the exact address, normalized address, city, route duration, private origin, client identity, dates, access, medical, or household details.
- Never put the exact address in a URL, analytics event, log, or care-plan summary.
- Add a clear action to continue at /rates#estimate.
- Make QuoteEstimator load the saved ZIP/tier and keep reset behavior accurate.
- Reconcile Privacy wording only if needed for exact implementation truth; do not broaden data collection.

3. Make estimator failure recoverable.
- Preserve entered values.
- Distinguish loading from calculation failure.
- Provide a safe retry and Contact fallback.
- Do not expose server/provider internals.
- Do not change pricing, holiday, travel, capacity, review, or estimator math.

4. Improve contact reliability content only.
- Align visible success/reply copy to the current 1–2 business-day expectation.
- Preserve “accepted for delivery,” no-booking, optional unchecked SMS consent, canonical SMS disclosure, and safe error behavior.
- Provide usable email, phone, and Precise Petcare alternatives in failure/degraded/no-JavaScript states where appropriate.
- Do not send real production messages, enable providers, or change dashboards/credentials.

5. Add concise original client-preparation content to existing pages.
- Strengthen /start with one compact preparation module based on CURRENT / APPROVED logic 16, logic 17, logic 21, logic 22, core 01, and the Client Explanation Library.
- Cover: current secure care instructions; sufficient food, medication, litter/enclosure and relevant equipment; current emergency/veterinary contacts; tested primary access plus an approved backup method; and a plan for feeder/fountain/self-cleaning-litter/smart-access equipment failure.
- Keep all private instructions, access credentials, medical details, and client-specific records in Precise Petcare.
- Add one FAQ answer explaining that feeders, fountains, cameras, and self-cleaning litter boxes may support but do not automatically replace appropriate in-person welfare checks.
- Do not create a new resource page. Do not give veterinary advice or create surveillance integrations.
- Write from scratch. Do not open, publish, link, embed, route, download, copy, closely paraphrase, or graphically recreate the four prohibited private resources.

6. Add a truthful accessibility statement/contact route.
- Add /accessibility with concise route-specific metadata and a clear email/phone feedback or alternate-access path.
- Link it from the footer and an appropriate Contact context; add it to the indexing-gated sitemap list.
- Describe accessibility as an ongoing objective. Do not claim WCAG certification/conformance, legal compliance, exhaustive assistive-technology coverage, or completion of remaining manual checks.
- Preserve F11/12D engineering. Do not redo the accessibility foundation.

7. Complete application-specific social metadata/schema cleanup.
- Use a small shared metadata pattern so each major public route has accurate route-specific canonical OpenGraph and Twitter title, description, URL, and the existing approved /og.png preview.
- Ensure /credentials and /accessibility are covered without adding credential claims.
- Remove unsupported priceRange: '$$' from LocalBusiness JSON-LD.
- Preserve LocalBusiness/WebSite, current services, sameAs, canonical host, and no-review-schema boundaries.
- Do not add city pages, keyword stuffing, duplicate local templates, fake addresses, AggregateRating/Review, or unsupported claims.
- Keep SITE_INDEXING_ENABLED off. Do not activate Search Console or indexing.

8. Remove the demonstrated public-image metadata leak.
- Re-encode or otherwise strip all EXIF/GPS and other nonessential metadata from:
  public/photos/loki - client dog/client-dog-loki-sun.JPEG
- Preserve the approved photo's visual appearance, orientation, dimensions, role, URL unless a tested code update requires otherwise, and publication permission.
- Add a dependency-free automated regression check that every public gallery JPEG lacks EXIF APP1/GPS metadata.
- Do not remove approved photos and do not treat photo permission as unresolved.
- Do not change public client-pet names/paths unless the owner has separately confirmed name-level consent.

9. Add focused tests for every change and preserve current behavior.

RIGHTS AND CLAIMS

- All reliably identified Lauren/animal photos intended for the site have public website permission.
- All displayed client-pet photos are presented with written owner/client permission.
- Legitimately obtained PSI portal logos and public/psi-membership-certificate.jpg have website/social publication permission.
- Keep public/psi-membership-certificate.jpg. Do not remove it for rights uncertainty.
- Do not publish active PSI membership wording or visibly promote PSI until exact status wording is supported by CURRENT / APPROVED authority.
- Never conflate membership, certification, endorsement, insurance, or bonding.
- Do not add reviews/ratings, years/client counts, credentials, training, background-check, insurance/bonding, employees, backup sitters, live availability, transportation, medical expertise, 24/7 service, or locality claims without current authority.

PROHIBITED RESOURCES

The following may not be published, linked, embedded, routed, offered for download, copied verbatim, closely paraphrased, or graphically recreated:

- Client Handout - Preparing for Your Pet Sitter.pdf
- Pet Sitter Interview Checklist.pdf
- Summer Safety Tips for Pet Owners (Client Handout).pdf
- Dog Travel Safety Infographic

Preserve exactly the four narrow .gitignore protections. Do not broaden them.

DO NOT IMPLEMENT

- AI chatbot or automated veterinary advice
- auto-booking
- duplicate CRM, client database, or login/account system
- exact private client-location storage or public private calendar
- unsupported live availability, fake urgency/scarcity/counters
- pet-camera, GPS, or other surveillance/tracking integration
- transportation workflow without independently approved scope/coverage
- fake reviews, ratings, certifications, memberships, personnel, or trust claims
- pointless gamification
- invasive or third-party analytics backend
- thin city pages, keyword stuffing, duplicate city templates, or fake addresses
- real-time weather/AQI decision integration

PRESERVE BUSINESS RULES

Do not change pricing, holidays, service-area business rules, PPC rules, estimator math, CarePlanner decision logic, booking acceptance, capacity rules, service scope, provider configuration, deployment configuration, or production state.

Spot-check unchanged values:
- Standard Overnight: dog $85; cat-only $80; small-animal-only Personalized review
- Continuous Care: 3h $90; 4h $120; 5h $145; 6h $165; 7h $185; 8h $200
- 24-Hour Continuous Care: starting at $300
- approved calendars: 2026, 2027, 2028, final crossover through January 3, 2029

VALIDATION

Use the exact locked toolchain without changing dependency versions. Run:

npm run doctor
npm run check:git-safety
npm run check:foundation
npm test
npm run typecheck
npm run lint
npm run build
npm run check:build-artifact
npm run e2e:run
npm run check:a11y
git diff --check

Run focused tests for cross-route handoffs, session minimization, estimator failure/retry, contact fallback/timing, accessibility route/metadata, social metadata/schema, indexing gate, EXIF absence, gallery preservation, and prohibited resources. Report actual counts; do not substitute prior baselines.

Manually inspect changed routes at representative desktop/mobile sizes. Do not claim the separate real NVDA, 200%/400%/text-only zoom, Windows forced-colors, real mobile/tablet orientation, configured Turnstile, or configured Google autocomplete tasks complete unless they were actually performed.

CHANGE CONTROL

Do not commit, push, merge, deploy, enable indexing, alter provider dashboards/credentials, or write to production. Stop with a reviewable implementation diff for owner review.

Final report must include fetched SHA, branch/worktree, original-checkout protection, files changed, exact behavior implemented, business references used, deferred/manual items, validation commands/results/counts, and explicit confirmation of no commit/push/merge/deployment/provider/production change.
```

## 29. Reconciliation changed files and scope protection

Only this planning file is intentionally changed:

| Path | Purpose | Classification |
| --- | --- | --- |
| `docs/phase-12f-current-state-reconciliation.md` | Durable current-state audit, classifications, future A-scope, acceptance criteria, and copy/paste implementation prompt | CURRENT PLANNING / NON-AUTHORITATIVE |

No application code, components, CSS, tests, pricing, holidays, service-area rules, PPC rules, estimator math, CarePlanner logic, assets, dependencies, providers, deployment configuration, production state, or historical prompt was changed. No documentation index change is required because current phase reconciliation documents already live discoverably at the `docs/phase-*.md` root.

## 30. Verdict

**PHASE 12F CURRENT-STATE RECONCILIATION: READY FOR OWNER REVIEW**
