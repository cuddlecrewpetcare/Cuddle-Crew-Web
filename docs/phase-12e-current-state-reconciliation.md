# Phase 12E Current-State Reconciliation

> Status: READY FOR OWNER REVIEW
>
> Phase: Homepage, Trust, Imagery, and Information Architecture
>
> Reconciliation date: 2026-09-07
>
> Current fetched baseline: `4117a73ae7469fa7ee70eba60e6cac84ddc489a4`
>
> Nature: current planning and repository-hygiene record; not business-policy authority and not an implementation record

## Owner-review implementation override — 2026-09-07

For the current Phase 12E implementation, the owner has explicitly approved and directed the following narrower reconciliation. This section supersedes conflicting gallery, image-count, Blu-selection, and PSI-publication assumptions elsewhere in this planning record; it does not reopen unrelated Phase 12E decisions.

- Preserve the intentional pet/ownership folder structure under `public/photos/` and display every approved animal photograph in that tree in a substantive `/gallery` route.
- Separate Lauren’s pets from client pets, preserve the individual pet folders, and state that client pet photographs are displayed with written client/pet-owner permission.
- Use `public/photos/blu - client dog/client-dog-blu-first-page-photo.jpeg` as the first/main homepage animal photograph and the first Blu/client gallery image. The leash and indoor Blu variants may appear only as secondary gallery images.
- Public website/social-media publication permission is confirmed for the PSI logos supplied through Lauren’s membership portal and for `public/psi-membership-certificate.jpg`. That permission does not establish current-status wording and must not be presented as certification, endorsement, insurance, or bonding.
- The three PSI client-handout PDFs and Dog Travel Safety Infographic remain prohibited public resources; the four narrow `.gitignore` rules remain controlling.

## 1. Decision summary

Historical Phase 12E remains directionally useful, but it is not executable as recovered. Its provenance is **SUMMARY ONLY**, and substantial engineering, business-rule, privacy, image-recovery, and accessibility work was completed after its original context. Current 12E should be a focused presentation and information-architecture implementation, not a foundation rebuild.

The remaining work is to make the homepage immediately state what the business does, where it serves, and that Lauren is the owner and ordinary primary caregiver; turn `/start` into the clear new-client orientation path; move detailed services, rates/estimator, and service-area tooling to the already-established legacy route names; use a small, intentional set of approved authentic photos; align public pricing with current authority; and preserve the manual review and Precise Petcare confirmation boundary.

This reconciliation does not implement that work. It changes only this planning document and the four exact `.gitignore` entries authorized for prohibited untracked reference resources.

## 2. Repository and phase state

| Item | Current finding |
| --- | --- |
| Fetched `github/main` | `4117a73ae7469fa7ee70eba60e6cac84ddc489a4`; it still equals the prompt's expected Pre-12E merge SHA |
| Local `main` | `3b443a6dcafb0cb3f4ed4129714d357e3e059816`; 0 commits ahead and 42 behind `github/main` |
| Original checkout | Existing canonical `CuddleCrewPetCareWEB` checkout; intentionally dirty with 35 status entries; inspected read-only and not modified |
| Reconciliation branch | `codex/phase-12e-current-state-reconciliation`, tracking `github/main` |
| Reconciliation worktree | Fresh dedicated worktree named `phase-12e-current-state-reconciliation` |
| GitHub CLI | `gh` 2.100.0 is installed. `gh auth status` reports that the saved default token for `cuddlecrewpetcare` is invalid. Authentication was not altered; fetched Git evidence is sufficient for this task. |
| Phase status | 12A, 12B, 12C, F0-F14, 12D, owner-image recovery, roadmap/archive reconciliation, and Pre-12E authority reconciliation are complete and merged |
| Forward sequence | 12E reconciliation -> later 12E implementation -> 12F reconciliation/implementation -> 12G go/no-go -> fresh 12H -> launch unblock |

No commit, push, merge, deployment, provider change, or production write is part of this task.

## 3. Evidence and authority

### Historical planning evidence

- `docs/planning/historical-prompts/phase-12/12E-homepage-trust-imagery-ia-summary.md` — **SUMMARY ONLY**; historical intent, not an exact original prompt.
- `docs/planning/historical-prompts/CURRENT-RECONCILIATION.md` — current provenance/status index.
- `docs/phase-12-roadmap-recovery.md` — current roadmap ordering and completed-foundation boundary.
- Historical page/image Git evidence was used only to identify earlier assets and presentation ideas. It did not override current approved authority.

Historical 12E remains **HISTORICAL / PLANNING**, **NON-AUTHORITATIVE**, and **RECONCILE BEFORE EXECUTION**.

### Current business authority used

The required preflight used `AGENTS.md`, `docs/business-reference/README.md`, and `docs/business-reference/guidance/source-of-truth-document-hierarchy.md`. The most relevant **CURRENT / APPROVED** references were:

- `core/01-master-service-agreement.md`
- `core/03-pricing-fees-surcharge-policy.md`
- `logic/16-new-client-pre-service-checklist.md`
- `logic/17-meet-and-greet-checklist.md`
- `logic/18-booking-acceptance-risk-triage.md`
- `logic/19-adventure-walk-suitability.md`
- `logic/20-overnight-acceptance.md`
- `logic/33-custom-quote-scope-review.md`
- `logic/36-holiday-peak-date-calendar.md`
- `logic/37-service-window-capacity-planner.md`
- `logic/38-ppc-pricing-quote-implementation.md`
- `operations/38-continuity-backup-provider-plan.md`
- `guidance/client-explanation-library.md`

`operations/40-training-certification-service-scope-matrix.md` is **PLACEHOLDER** and was used only as a negative boundary: it cannot authorize public credential, insurance, bonding, training, certification, membership, transportation, or medical-scope claims. `core/10-media-photo-testimonial-consent.md` is not current authority; the owner's present instruction separately resolves public website permission for the identified Lauren/animal photo set, but it does not supply testimonial permission.

No material conflict was found between two applicable CURRENT / APPROVED sources. The finalized public Standard Overnight rates are `$85` for a dog household and `$80` for a cat-only household. Small-animal-only Overnight remains subject to individualized review and quote. The PPC reference may use the finalized cat-only rate as a starting point when preparing an individualized small-animal-only quote; that quoting workflow does not make the cat-only rate private.

## 4. Current route and page inventory

| Route | Current role | 12E finding |
| --- | --- | --- |
| `/` | Hero, trust, process, complete service/rate menu, estimator, capacity explanation, service-area tools, owner-cat gallery, social links, PPC boundary, final CTA | Accurate in many details but overloaded and repetitive; main 12E target |
| `/start` | Five-way orientation hub plus process and PPC registration CTA | Useful destination but missing from primary navigation and currently leads with travel rather than the overall client journey; rework, do not duplicate |
| `/plan` | Anonymous care-frequency/duration planner | Keep; link it from `/start` and Services; do not change its business logic in 12E |
| `/holidays` | Approved 2026-2028 holiday/peak calendars through 2029-01-03 and fee explanation | Keep as detailed destination; homepage/Rate page should summarize and link |
| `/choosing-care` | Original provider-comparison guidance | Keep; use as contextual trust link, not a homepage text block |
| `/safety` | Searchable safety/trust guidance and detailed onboarding boundary | Keep; link from concise homepage trust content |
| `/credentials` | Neutral business-information page that withholds unapproved claims | Keep; current restraint is correct; PSI placement is conditional on current membership wording authority |
| `/faq` | Search/filter FAQ | Keep; later 12E should correct only stale photo-permission presentation where it concerns the now-approved image set; broad search/content expansion belongs to 12F |
| `/contact` | Preliminary inquiry with privacy boundary and PPC handoff | Keep; secondary path for questions/unusual routines, not a booking mechanism |
| `/privacy`, `/terms` | Website privacy and terms | Keep; update only if the later 12E content/asset change creates a direct accuracy dependency |
| `/services` | Permanent redirect to `/#services` | Convert to a substantive Services page; the current home section has enough non-thin material |
| `/rates` | Permanent redirect to `/#estimate` | Convert to a substantive Rates page and move the estimator here without changing rate logic |
| `/service-area` | Permanent redirect to `/#area` | Convert to the focused service-area/tool page; keep only a compact summary on home |
| `/about` | Permanent redirect to `/credentials` | Do not create a thin About page. Point it to the homepage Meet Lauren section unless later approved biography gives it enough distinct content. |
| `/api/address/*`, `/api/availability`, `/api/estimate`, `/api/contact`, `/api/health` | Existing application/tool endpoints | Preserve; no current Standard Overnight pricing correction is required in the estimate response |

The sitemap includes `/start`, but no current header/homepage link makes it the primary entry path. Header navigation currently contains Services, Plan care, Estimate, Service area, Holidays, Compare care, Safety, Credentials, FAQ, Contact, and a direct external Register button. That breadth competes with the intended single next step.

## 5. Current homepage in rendered order

Rendered evidence used Chromium at 1440 x 900 and 390 x 844. The full page measured about 9,032 CSS pixels tall on desktop and 13,986 on mobile. The mobile layout reflows without a newly identified F11-level defect, but the information load is excessive.

| # | Section/component | Purpose and important content | CTA/destination | Duplication, trust, conversion, and mobile finding | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | Sacramento/Carmichael, emotional headline, in-home care lede, three trust bullets, Ponyo/Bambi image | New client registration -> external PPC; existing login -> PPC | Location and real image help, but the headline does not plainly lead with pet sitting/dog walking or Lauren's solo-owner role; registration is premature as the primary action; hero image repeats in gallery | **REWORK** — clear service/location/owner message; primary `/start`; secondary Services or service-area link; retain existing-client access |
| 2 | Why Cuddle Crew | Listening, routine, welfare, and registration-not-acceptance boundary | None | Sound trust content but repeats process/review language | **SHORTEN** — merge its strongest sentence into Meet Lauren/trust content |
| 3 | Solo promise | Lauren ordinarily provides care; approved exception/backup language | None | High trust value and authority-aligned, but visually abstract and separate from owner introduction | **REWORK** — make this a concise Meet Lauren section with an approved Lauren portrait and the accurate continuity caveat |
| 4 | How it works | Register, Review, Meet, Confirm | None | Useful, but skips exploration/private profile/formal request context and conflicts in ordering/detail with `/start` and `/safety`; duplicates their explanations | **REWORK** — short homepage steps linking to the single detailed `/start` flow |
| 5 | Approved service menu | Full Drop-In, Walk, Overnight, Continuous Care rate tables | Holiday link; no main Services/Rate link | Accurate distinctions and the public `$85` dog / `$80` cat-only Standard Overnight rates are valuable, but four long cards plus all prices overload home. Small-animal-only Overnight correctly remains a personalized-review category. | **MOVE** — compact orientation on home; complete descriptions at `/services`; complete approved public pricing at `/rates` |
| 6 | Potential additions | Per-pet, travel, holiday, short-notice details and safety caveat | Holidays | Important but detailed policy content; four extra cards are especially dense on mobile | **MOVE** — Rates; keep only an honest “additional factors may apply after review” summary on home |
| 7 | QuoteEstimator | Full interactive preliminary estimate, availability, result, and planning boundaries | Result links to registration, estimate, area, contact | Valuable high-intent tool but one of the largest homepage blocks and repeats rates/area/process information | **MOVE** — render at `/rates#estimate`; retain a compact homepage estimator entry CTA |
| 8 | Service planning/included | Capacity factors and six routine-inclusion cards | None | Good expectation setting, but repeats Safety/FAQ and adds another card grid | **SHORTEN** — one compact “personal review considers route, routine, welfare, and capacity” statement linked to Safety/FAQ |
| 9 | Service area | Private-origin phrasing, address checker, separate ZIP-only form | Address lookup; contact fallback | Tool is valuable, but the heading unnecessarily foregrounds a private reference point and the two checks are confusing/redundant. The block is long on mobile. | **MOVE / REWORK** — focused `/service-area` page; short home summary; never reveal private origins; one clear address/check-or-contact path |
| 10 | Ponyo & Bambi gallery | Three owner-cat images and old consent disclaimer | None | Authentic but one image duplicates the hero, the section is cat-only, and the consent disclaimer is now stale | **REMOVE as a standalone gallery** — redistribute a small approved image set into meaningful hero/owner/service contexts |
| 11 | Confirmed business pages | Google, Facebook, Yelp, Instagram links | External business profiles | Legitimate links, but profile presence is not review/testimonial evidence | **SHORTEN** — retain compactly in trust/footer; do not label as reviews or ratings |
| 12 | Client portal strip | PPC owns quotes, bookings, invoices; payment is not acceptance | Existing-client login | Essential boundary but repeats process and final CTA | **SHORTEN** — integrate once into How It Works/Start and footer/CTA context |
| 13 | Final CTA | Ask Lauren about household; sensitive-data reminder | Contact; telephone | Useful, but competes with the registration-first hero and PPC strip | **REWORK** — primary “Start here” and secondary Contact, with one privacy sentence |
| 14 | Footer | Business/location, social, FAQ, credentials, privacy, terms | Internal/external links | Compact and useful | **KEEP** — add contextual destinations moved out of the crowded header as needed |

## 6. Historical-item classification matrix

Each meaningful historical Phase 12E concept has exactly one current classification.

| Historical concept | Classification | Current evidence | Current 12E action |
| --- | --- | --- | --- |
| Audit homepage sections as KEEP/SHORTEN/MOVE/REMOVE/REWORK | **STILL RELEVANT** | `app/page.tsx`; rendered home audit above | Use the decisions in Section 5 |
| Homepage quickly explains what Cuddle Crew does | **PARTIALLY COMPLETE** | Layout metadata is clear; hero headline is emotional and does not lead with pet sitting/dog walking | Rewrite hero for immediate service clarity |
| Sacramento/Carmichael relevance | **ALREADY COMPLETE** | Hero eyebrow, metadata, structured data, footer | Preserve; make the general footprint easy to scan without adding unsupported cities |
| Clear owner-operated/solo-sitter identity | **PARTIALLY COMPLETE** | Solo-promise section and LocalBusiness description; no owner portrait or true owner introduction in rendered page | Add a concise Meet Lauren section using approved imagery and accurate continuity wording |
| Hero has one clear primary next action | **STILL RELEVANT** | Direct PPC registration plus existing-client link bypass `/start`; header has many competing paths | Make `/start` primary and keep contextual secondary actions |
| Major service orientation | **PARTIALLY COMPLETE** | All major services appear, but only in a dense full pricing block | Keep a compact overview and move detail to Services/Rates |
| Homepage start-price/pricing presentation | **PARTIALLY COMPLETE** | `app/page.tsx` correctly publishes Standard Overnight at `$85` for a dog household and `$80` for a cat-only household, while small-animal-only Overnight requires personalized review; the issue is homepage density, not public-rate authority | Keep homepage pricing concise, preserve both finalized dog/cat rates wherever detailed Standard Overnight pricing appears, and retain personalized review only for small-animal-only Overnight |
| Why professional pet care matters | **PARTIALLY COMPLETE** | Listening, review, capacity, Safety, and Compare Care content exist, but the message is scattered | Express briefly as individualized planning, professional process, and welfare/safety review; link to existing detail |
| One coherent How It Works path | **PARTIALLY COMPLETE** | Home, `/start`, `/safety`, `/contact`, estimator, and PPC each describe overlapping pieces | Make `/start` canonical; shorten home; align links and sequence without inventing a rigid booking order |
| Trust/safety presentation | **PARTIALLY COMPLETE** | Accurate Safety/Credentials pages and PPC/manual-review boundaries exist; home repeats rather than routes | Add a compact trust cluster linking to Safety, Credentials, and Compare Care |
| Clear service-area explanation and next step | **PARTIALLY COMPLETE** | Address tool and ZIP fallback exist; wording foregrounds “private reference point” and page is dense | Create `/service-area`, keep a home summary, and present one clear check/contact flow |
| Estimator entry | **ALREADY COMPLETE** | Full `QuoteEstimator` exists, is covered by foundation tests, and already distinguishes `$85` dog, `$80` cat-only, and small-animal-only personalized review | Move its placement to Rates and preserve those three outcomes |
| Authentic imagery | **PARTIALLY COMPLETE** | Real owner-cat photos are used; approved Lauren/client-animal inventory exists but is unused; one image is repeated | Select a restrained mix and integrate photos into content rather than restoring a large gallery |
| Genuine social proof | **MANUAL / OWNER TASK** | Social-profile links exist; no approved review/testimonial evidence is present; operations 40 is PLACEHOLDER | Do not fabricate cards. Add only later if evidence and republication permission are supplied. |
| Final conversion CTA | **PARTIALLY COMPLETE** | Contact CTA, PPC strip, hero registration, and header registration compete | Use Start Here as primary, Contact as secondary, and login for existing clients |
| Cross-page information architecture | **STILL RELEVANT** | `/services`, `/rates`, `/service-area`, `/about` are redirects; home contains most detail; `/start` is orphaned from primary nav | Implement the current IA in Section 14 |
| Responsive/mobile content density | **STILL RELEVANT** | 390 px full-page render is about 13,986 px tall, with long stacked pricing, estimator, service-area, and repeated CTA blocks | Reduce content volume and card count; preserve the completed F11 responsive/accessibility contracts |
| Client-pet public-use consent unresolved | **STALE** | Owner's current instruction confirms public website permission for all identified available Lauren/animal photographs | Record photos as approved; select by quality/relevance, not the old consent block |
| PSI logo website-use permission unresolved | **STALE** | Owner confirms portal permission; exact portal logo files exist locally | Permission is resolved. Placement remains conditional only on accurate current membership wording. |
| PDF/infographic rights awaiting determination | **STALE** | Owner has set a firm do-not-publish boundary and exact local files were identified | Keep private, ignore exact local files, and never publish/copy/recreate them |
| Restore every formerly removed client image | **NO LONGER NEEDED** | Permission removes the old block, but many variants are redundant and the homepage needs less, not more, visual volume | Restore only one or two selected service-relevant images during implementation |
| Broad educational resource expansion from handouts | **DEFER TO 12F** | Useful high-level topics exist, but broad resource authoring is not needed to repair 12E hierarchy | Use at most one concise readiness cue in `/start`; reconcile broader content in 12F |
| Rebuild accessibility, performance, SEO, security, and responsive foundations | **ALREADY COMPLETE** | F0-F14 and 12D records; current tests and styling contracts | Preserve, test affected paths, and do not redo foundation work |

## 7. Completed-work and foundation overlap

| Completed work | Reconciliation result |
| --- | --- |
| F0-F10 | Local environment, secrets, Git safety, privacy/data, supply chain, tests, integrations, recovery/observability, resources/performance, cross-platform/filesystem, and time/locale foundations are complete. 12E must not recreate them. |
| F11 | Responsive and accessibility foundation is complete. This task found content-density/ordering issues, not a reason for another generic accessibility phase. Preserve semantics, keyboard behavior, focus, reflow, touch, and reduced-motion contracts. |
| F12-F14 | CI/deployment safety, recovery, and final foundation go/no-go are complete. 12E does not add deployment, analytics, providers, or infrastructure. |
| 12A-12C | Governance, critical/high business-rule correction, and SMS compliance are complete. Preserve the current policy and consent boundaries. |
| 12D | Accessibility reconciliation is complete with separate manual pre-launch items. 12E only validates changed content/route hierarchy. |
| Owner-image recovery | Six owner-pet relocations are complete and remain valid. Do not rename/reorganize them again. Client-animal candidates were intentionally not restored by this planning task. |
| Roadmap/archive reconciliation | Historical provenance and forward ordering are complete. This current document belongs under `docs/`, not the historical prompt archive. |
| Pre-12E authority reconciliation | Current rate, holiday, PPC, scope, and review documents are merged. 12E represents them; it does not reopen business-rule design. Standard Overnight remains `$85` for a dog household, `$80` for a cat-only household, and individualized review for a small-animal-only household. |

## 8. Trust and public-claims audit

| Claim/topic | Classification | Finding and 12E treatment |
| --- | --- | --- |
| Owner-operated business | **SUPPORTED** | Current implementation and owner/continuity authority support a small owner-operated presentation. |
| Lauren as ordinary primary caregiver | **SUPPORTED** | Operations 38 supports this with an exception/approved-backup caveat; do not say Lauren is guaranteed for every visit. |
| Professional in-home pet care | **SUPPORTED** | The service agreement describes professional in-home pet-care services. Use as service framing, not as a credential. |
| Every request receives human review | **SUPPORTED** | Current onboarding/triage/capacity authority supports this. |
| Registration, estimate, or payment does not guarantee acceptance | **SUPPORTED** | Current core/logic authority and PPC boundary support this. |
| Precise Petcare controls final quote/confirmed booking/client-specific plan | **SUPPORTED** | Preserve consistently. |
| Standard Overnight approximately 6 p.m.-8 a.m.; not 24-hour presence; daytime care separate | **SUPPORTED** | Preserve the distinction in Services/Rates and a concise home summary. |
| Continuous Care is a dedicated consecutive block, household-based, individualized review | **SUPPORTED** | Preserve; never make it an automatic upsell. |
| Limited 24-Hour Continuous Care starts at `$300` | **SUPPORTED** | May be stated only with limited availability/individualized-review context. |
| Carmichael/Sacramento-area service | **NEEDS SOFTER WORDING** | General area framing is useful, but exact geography and availability require address/route/capacity review. Avoid implying fixed blanket coverage. |
| “Check travel from the private reference point” | **NEEDS SOFTER WORDING** | The exact point is not exposed, but public copy should not foreground private internal routing. Say “check your address for typical travel” and preserve server-side privacy. |
| Active PSI membership | **MANUAL VERIFICATION REQUIRED** | A tracked, directly public certificate states membership in good standing through 2027-08-19 and portal logo files exist, but operations 40 is PLACEHOLDER. Confirm and record current public wording in CURRENT / APPROVED authority before publishing the claim/logo; remove the unused certificate from `public/` unless the owner explicitly approves publishing that document. |
| PSI endorsement/general certification/insurance | **UNSUPPORTED** | Logo permission does not establish any of these. Never imply them. |
| Insurance or bonding | **MANUAL VERIFICATION REQUIRED** | No CURRENT / APPROVED authority supports public wording. Do not publish until verified and approved. |
| Training/certification, pet CPR/first aid, or background check | **MANUAL VERIFICATION REQUIRED** | Operations 40 is PLACEHOLDER. Do not publish. |
| Years of experience, client counts, or similar quantified proof | **UNSUPPORTED** | No current authority/evidence was found. Do not revive historical claims. |
| Reviews/testimonials or star ratings | **MANUAL VERIFICATION REQUIRED** | No approved evidence/republication permission was found. Social-profile links are not reviews. |
| Guaranteed backup personnel | **UNSUPPORTED** | Public copy may mention a communicated contingency process but not guaranteed availability or identities. |
| 24/7 availability or continuous presence | **UNSUPPORTED** | Do not use. Limited 24-Hour Continuous Care is a distinct reviewed service, not a general availability promise. |
| Transportation capability | **MANUAL VERIFICATION REQUIRED** | Current authority requires review and operations 40 is incomplete. Do not present it as offered. |
| Medical expertise or veterinary monitoring | **UNSUPPORTED** | Website may state only current restrained medication/review boundaries. Continuous Care is not veterinary monitoring. |

Current genuine trust signals that can be used now are: Lauren's owner/primary-caregiver identity with the correct caveat; the personal review process; transparent approved public rates and estimate boundaries; Precise Petcare handoff; original approved photography; the existing Safety, Credentials, Compare Care, FAQ, and social business-profile destinations. Reviews, ratings, and credentials must not be simulated.

## 9. Asset rights, consent, and imagery

### Superseded assumptions

| Earlier assumption | Current authority and result |
| --- | --- |
| Client-pet public-use consent unresolved | The owner confirms all animal photos in her available website asset set have explicit public website permission. The old assumption is **STALE / SUPERSEDED**. |
| PSI logo permission unresolved | The owner confirms her PSI membership portal permits website logo use. The legal/permission uncertainty is **STALE / SUPERSEDED**. |
| Handout/infographic rights unresolved | The named PDFs and identified infographic are confirmed **DO NOT PUBLISH**. This is a firm boundary, not a pending decision. |

Photo approval does not require use. Selection remains based on relevance, quality, redundancy, responsive crops, privacy-conscious context, and page balance. No caption may invent a pet story or expose Client identity. For Client-owned animals, prefer factual generic alt text without pet or owner names unless the owner separately chooses a public attribution.

### Current and available photo inventory

All rows below are classified **APPROVED FOR PUBLIC WEBSITE USE** under the owner's current instruction. “Not selected” is an editorial recommendation, not a rights restriction.

| Asset path | Subject/type | Current or possible placement | Alt-text need and responsive considerations | Trust/content value, redundancy, recommendation |
| --- | --- | --- | --- | --- |
| `public/photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-window.jpeg` | Lauren's two cats; owner-pet image | Current hero and current gallery | Current alt is factual; wide 4:3 crop works on desktop but crops tightly on mobile | Authentic but duplicated. Keep at most once, likely as a secondary home/service image rather than both hero and gallery. |
| `public/photos/ponyo - lauren's cat/lauren-cat-ponyo-closeup.jpeg` | Ponyo; owner-pet image | Current gallery | Current alt identifies Lauren's cat; portrait crop is mobile-friendly | Good cat representation, but not needed if the window image remains. Select one, not both. |
| `public/photos/bambi - lauren's cat/lauren-cat-bambi-portrait.jpeg` | Bambi; owner-pet image | Current gallery | Current alt is factual; portrait crop is mobile-friendly | Good cat representation; not essential in a smaller integrated image set. |
| `public/photos/bambi - lauren's cat/lauren-cat-bambi-closeup.jpeg` | Bambi close-up; owner-pet image | Tracked, unused | Add factual alt if selected; tall crop | Redundant with Bambi portrait and root close-up; do not add in current 12E. |
| `public/photos/ponyo - lauren's cat/lauren-cat-ponyo-couch.jpeg` | Ponyo on couch; owner-pet image | Tracked, unused | Add factual contextual alt if selected; tall crop | Warm in-home context, but lower priority than owner portrait plus service-relevant dog image. |
| `public/photos/ponyo and bambi - lauren's cats/lauren-cat-ponyo-and-bambi-kittens.jpg` | Ponyo and Bambi as kittens; owner-pet image | Tracked, unused | Add factual alt if selected; near-square/wide crop | Personal but not service-explanatory; do not add in current 12E. |
| `public/lauren-portrait.jpeg` | Lauren; self image | Tracked, unused; preferred default for Meet Lauren | Alt should identify Lauren as owner of Cuddle Crew; portrait crop; preserve face/focal point at 390 px | Highest trust value and already tracked. Use once in Meet Lauren. |
| `public/lauren-cat-closeup.jpg` | Lauren's cat close-up | Tracked, unused | Needs factual alt; tall crop | Content duplicates organized owner-cat assets and sits outside the recovered folders. Do not use in current 12E. |
| `public/photos/lauren - portraits/lauren-portrait.jpeg` in preserved checkout | Lauren; self image; same image content as tracked root portrait | Local duplicate candidate | Same alt/crop as tracked portrait | Do not copy/restore; use existing tracked root asset. |
| `public/photos/lauren - portraits/lauren-portrait with random cat.jpeg` in preserved checkout | Lauren holding a cat outdoors; self plus approved animal image | Potential Meet Lauren alternative | Use generic factual alt such as “Lauren holding a cat outdoors”; optimize before web use; original is about 4.7 MiB and landscape | Very authentic, but heavier and the animal's context should not be invented. Optional alternative only; the tracked portrait means it does not block implementation. |
| `public/photos/blu - client dog/client-dog-blu-first-page-photo.jpeg` in preserved checkout | Approved Client-owned dog portrait | Strong hero candidate | Generic factual alt; portrait crop must retain face at mobile sizes | Strong immediate dog-care signal. Preferred client-animal restoration candidate if hero composition works. |
| `public/photos/blu - client dog/client-dog-blu-inside-smile.jpeg` in preserved checkout | Approved Client-owned dog indoors | Potential service/trust image | Generic factual alt; test close crop | Similar subject to the first-page portrait. Do not restore both. |
| `public/photos/blu - client dog/client-dog-blu-walk.jpeg` in preserved checkout | Approved Client-owned dog on a walk | Services/Dog Walks candidate | Generic factual alt such as “Australian shepherd on an outdoor walk”; avoid pet/client name; test landscape crop | Best service-explanatory Blu image. Prefer this over a second portrait if one client-dog photo is restored. |
| `public/photos/loki - client dog/client-dog-loki-portrait.jpeg` in preserved checkout | Approved Client-owned dog portrait | Optional service/trust image | Generic factual alt; portrait crop | Warm but redundant with other portraits; not selected for the minimal set. |
| `public/photos/loki - client dog/client-dog-loki-sun.JPEG` in preserved checkout | Approved Client-owned dog outdoors | Optional editorial image | Generic factual alt; optimize before use; original is about 2.8 MiB | Attractive but heavy and less explanatory than the walk image; do not add in current 12E. |
| `public/photos/loki - client dog/client-dog-loki-walk.jpeg` in preserved checkout | Approved Client-owned dog walking | Services/Dog Walks alternative | Generic factual alt; test mobile focal point | Useful but redundant with Blu walk. Choose one walk image, not both. |
| `public/photos/skylar - client dog/client-dog-skylar-head-tilt.jpeg` in preserved checkout | Approved Client-owned dog portrait | Optional trust image | Generic factual alt; portrait crop | Charming but nonessential if hero/service dog photos already cover the need. |
| `public/photos/skylar - client dog/client-dog-skylar-posing.jpeg` in preserved checkout | Approved Client-owned dog posed outdoors | Optional service image | Generic factual alt; optimize/crop | Redundant with other dog portraits; not selected for minimal current 12E. |
| `public/photos/skylar - client dog/client-dog-skylar-smile.jpeg` in preserved checkout | Approved Client-owned dog close portrait | Optional trust/service image | Generic factual alt; test close crop | Strong expression, but use only if it replaces rather than adds to another dog portrait. |

Recommended initial image set for implementation: the existing tracked `public/lauren-portrait.jpeg` in Meet Lauren; one restored service-relevant client-dog image (prefer Blu walk, or Blu first-page for the hero after visual QA); and one existing owner-cat image. Remove the standalone gallery and the repeated window image. A fourth image is justified only if it explains a distinct service or materially improves balance. Do not restore every approved variant.

### PSI asset finding

- Website-logo permission is confirmed and is not an owner/legal task.
- Current main contains `public/psi-membership-certificate.jpg`. It states that Lauren/Cuddle Crew is a member in good standing and shows an expiry of 2027-08-19, but it is a certificate, not the requested compact portal logo. Because it is under `public/`, it is directly retrievable even though no page links it. That public document exposure is not justified by current approved membership authority.
- The preserved local checkout contains eight portal-provided logo files under `public/logos/`, including `Color PSI Member Logo- sized for Website use (125 pixels wide)` and `Color PSI Logo with Passionate, Professional, Pet Sitter Tagline - Sized for Website Use (140 pixels wide)`, plus high-resolution, black-and-white, and social variants. Therefore the correct website asset appears available; asset acquisition is not currently required.
- Prefer the 125-pixel color **member** logo, copied into the clean implementation worktree with a normal web extension and without altering/deleting the preserved original. Use it at most once, preferably on `/credentials` and optionally referenced by a compact home trust link. Do not use the certificate as a decorative homepage image.
- Do not publish the logo until active membership wording is confirmed and recorded in CURRENT / APPROVED authority at implementation time. Permission to display a logo is distinct from authority to claim active status. During implementation, remove the unused membership certificate from the current public tree unless the owner explicitly approves publishing the certificate after authority is updated; do not rewrite history.
- Accompanying language must be narrowly factual. It must not imply endorsement, a general certification, guaranteed service quality, insurance, bonding, medical skill, or any status beyond verified membership.

## 10. Prohibited non-public reference resources

| Exact resource | Current main | Preserved local status | Reachable Git history | Classification and action |
| --- | --- | --- | --- | --- |
| `public/handouts/Client Handout - Preparing for Your Pet Sitter.pdf` | Absent | Untracked/local-only | No matching tracked path found | **PROHIBITED NON-PHOTO RESOURCE**; exact ignore added; do not publish/link/embed/copy/recreate |
| `public/handouts/Pet Sitter Interview Checklist.pdf` | Absent | Untracked/local-only | No matching tracked path found | **PROHIBITED NON-PHOTO RESOURCE**; exact ignore added; do not publish/link/embed/copy/recreate |
| `public/handouts/Summer Safety Tips for Pet Owners (Client Handout).pdf` | Absent | Untracked/local-only | No matching tracked path found | **PROHIBITED NON-PHOTO RESOURCE**; exact ignore added; do not publish/link/embed/copy/recreate |
| `public/infographics/Dog Travel Safety Infographic` | Absent | Untracked/local-only; extensionless PNG, approximately 2513 x 3263 | No matching tracked path found | **PROHIBITED NON-PHOTO RESOURCE**; exact ignore added; do not publish/link/embed/copy/recreate |

The files were privately reviewed only to understand broad subject matter. No source wording or graphics are reproduced here. They must remain non-public. No deletion, move, restoration, history rewrite, or local-source modification occurred.

The exact `.gitignore` entries added are:

```gitignore
/public/handouts/Client Handout - Preparing for Your Pet Sitter.pdf
/public/handouts/Pet Sitter Interview Checklist.pdf
/public/handouts/Summer Safety Tips for Pet Owners (Client Handout).pdf
/public/infographics/Dog Travel Safety Infographic
```

These entries are intentionally filename-specific. They do not ignore PDFs or images generally. If a future prohibited resource is ever found tracked, `.gitignore` is insufficient: remove only the exact current-tree file in an authorized change, verify it is no longer served, retain any needed private source outside `public/`, and do not rewrite Git history.

## 11. Original-content opportunities from private references

Only high-level topics are recorded. Any future text must be written from scratch in Cuddle Crew's voice and grounded in the cited Cuddle Crew authority, not in distinctive source wording or design.

| Private source at a high level | General original topic | Applicable current Cuddle Crew authority | Destination | Phase and client value |
| --- | --- | --- | --- | --- |
| Preparing for a sitter | A brief first-service readiness cue: complete secure pet/household profiles, care instructions, emergency contacts, and approved access arrangements before care | Master Service Agreement; logic 16; logic 17 | `/start` short checklist and contextual FAQ link | **12E**, narrowly. It helps clients understand the handoff without creating a new page. Do not add detailed access/security rules governed by unresolved agreements. |
| Preparing for a sitter | A fuller original preparation guide covering supplies, routine notes, access readiness, and emergency contacts | Same current onboarding authority, plus any future approved access/emergency references | Existing FAQ/Safety or a resource destination only after content reconciliation | **DEFER TO 12F**. Potentially useful, but not needed to fix current homepage IA and not enough authority exists for all details. |
| Interview checklist | Original questions clients can ask any care provider about process, written terms, safety review, current documentation, and communication | Current `/choosing-care`, Master Service Agreement, logic 16-18; operations 40 remains a limitation | Keep `/choosing-care`; link contextually from trust content | **12E link only; DEFER content expansion TO 12F**. No new page is justified now. Do not repeat source checklist structure or claims. |
| Summer safety handout | Brief note that walks/activities may be adjusted for weather, surfaces, animal condition, and welfare | logic 19; logic 37; Master Service Agreement | Services/Dog Walks summary and existing Safety page | **12E**, one original service-specific sentence if needed. It materially sets expectations. |
| Summer safety handout | Broad seasonal heat, vehicle, garden, water, party, and fireworks education | No single current source authorizes all medical/safety detail | Existing Safety/FAQ after separate research/authority review | **DEFER TO 12F**. Avoid veterinary advice and unsupported claims; no new page yet. |
| Dog travel infographic | Transport safety/statistics | Transportation capability and supporting authority are not current/approved | None | **NO CURRENT 12E CONTENT**. Reconsider only after service scope is approved; do not reuse statistics, layout, wording, or graphics. |

## 12. Service and pricing orientation

### Homepage minimum

The homepage should name all relevant service families without reproducing policy tables:

- Drop-In Visits: 30, 60, and 90-minute Extended Care options.
- Dog Walks: 30, 60, and suitability-reviewed 90-minute Adventure Walk options.
- Standard Overnight Care: approximately 6 p.m.-8 a.m.; not 24-hour presence; separate daytime care when needed.
- Continuous Care: reviewed dedicated 3-8 hour blocks at the residence.
- Limited 24-Hour Continuous Care: starts at `$300` per period and always requires individualized review.

Use a small number of truthful labeled price anchors, not a generic “from” number that hides ordinary service differences. Examples that remain understandable are “30-minute Drop-In: `$30` dog / `$28` cat or small animal,” “30-minute Dog Walk: `$32`,” “Standard Overnight: `$85` dog household / `$80` cat-only household; small-animal-only households require personalized review,” “Continuous Care: 3-hour block `$90`,” and “limited 24-Hour Continuous Care starts at `$300`.” The homepage may use a shorter Standard Overnight summary for density, but any detailed public rate presentation must preserve the dog/cat distinction. The final implementation should confirm exact phrasing against current authority immediately before use.

### Detailed destinations

- `/services`: descriptions, duration choices, suitability/scope boundaries, and clear Standard Overnight versus Continuous Care distinctions. Link to `/rates`, `/plan`, and `/start`.
- `/rates`: complete approved public rates and modifiers, link to `/holidays`, and the estimator at `/rates#estimate`. Preserve public Standard Overnight pricing at `$85` for a dog household and `$80` for a cat-only household. Small-animal-only Overnight remains “Personalized review required” unless a more-specific CURRENT / APPROVED authority establishes another approved rule.
- `/holidays`: retain the detailed calendars and calculation notes.
- `/service-area`: retain address/travel tooling and privacy/capacity explanation.

The current estimator correctly distinguishes the three Standard Overnight household categories: dog household at `$85`, cat-only household at `$80`, and small-animal-only household routed to personalized review. Future 12E implementation must preserve that distinction in public UI, announcements, copied output, and API behavior. Do not hide or reclassify the finalized `$80` cat-only rate merely because logic 38 may use the cat-only rate as a starting point when preparing an individualized small-animal-only quote.

Continuous Care must never appear as an automatic upgrade from scheduled visits. Scheduled visits are usually the more affordable fit when safe alone-time needs allow them. A mathematically calculable amount never implies acceptance.

## 13. How It Works and conversion hierarchy

### Current path

`Home -> direct PPC registration` is currently the dominant path. Separate routes and blocks offer `/plan`, estimator, address checking, `/contact`, `/start`, Meet & Greet guidance, and PPC confirmation language, but `/start` is not promoted in the header/homepage. Home, Start, Safety, Contact, estimator results, and the PPC strip repeat different slices of the same process.

### Recommended hierarchy

1. **Homepage primary:** “Start here” -> `/start`. Secondary links: explore Services and check Service Area. Existing-client login remains clearly separate.
2. **`/start` orientation:** explain the overall path first; then offer Services, Rates/estimator, Service Area, Plan Care, Contact, and secure PPC registration as supporting choices. Do not lead the page as though travel checking is always step one.
3. **Private onboarding:** register in Precise Petcare, complete the relevant private profiles/instructions, and submit/formalize the request through the approved process.
4. **Meet and review:** the complimentary Meet & Greet is generally expected before first service unless a rare exception is approved. Lauren reviews route, schedule, routine, welfare, safety, scope, and capacity. Avoid publishing private acceptance thresholds or claiming a rigid order where current authority permits case-specific sequencing.
5. **Confirmation boundary:** only the approved Precise Petcare quote and confirmed booking establish service. An estimate, availability indicator, registration, Meet & Greet, invoice, or payment does not guarantee acceptance.
6. **Contact:** remains a secondary path for questions or unusual routines and never becomes a substitute for the secure formal request/record.

The header should expose fewer equal-weight choices. Recommended top-level items are Services, Rates, Service Area, Plan Care, Safety, FAQ, Contact, and Start Here. Put Holidays, Compare Care, Credentials, Privacy, Terms, and social profiles in contextual page links and/or the footer. Verify the final compact menu remains usable with the existing F11 keyboard/touch behavior.

## 14. Current information architecture recommendation

| Content category | Homepage treatment | Detailed destination | Duplicate to shorten/remove and link relationship |
| --- | --- | --- | --- |
| Business/service overview | Clear hero with Sacramento-area in-home pet sitting/dog walking and owner-operated identity | Services and Start | Remove vague-only hero framing; primary link to Start, secondary to Services |
| Meet Lauren/About | Concise owner introduction, portrait, ordinary-primary-caregiver wording, continuity caveat | Credentials for verified documents; Contact for questions | No thin About page. Change `/about` to `/#meet-lauren`; link Safety/Credentials contextually. |
| Services | Four compact service-family cards/rows with critical distinctions | Real `/services` page | Move full descriptions and duration detail off home; Services links Rates, Plan, Start |
| Rates | A few labeled orientation prices and an estimator CTA | Real `/rates` page with `#estimate`; `/holidays` for calendars | Move complete rate/modifier tables and estimator off home; preserve public `$85` dog / `$80` cat-only Standard Overnight pricing and small-animal-only personalized review |
| Service area | One sentence on general Sacramento-area fit, route/capacity caveat, and check-address CTA | Real `/service-area` page | Move address checker and ZIP fallback off home; remove “private reference point” from public heading |
| How It Works | Three or four concise steps and a Start CTA | `/start` canonical orientation; Safety for detailed boundary | Remove repeated long explanations from home/PPC strip; align all contextual links to Start |
| Planner | One optional planning link | `/plan` | Do not duplicate planner questions/results on home |
| Trust/safety | Compact truthful trust links and personal review/process signal | `/safety`, `/credentials`, `/choosing-care`, `/faq` | Replace long repeated claims with contextual links; do not add unverified badges |
| Holidays | At most a short “holiday/peak charges may apply” link | `/holidays` | Keep detailed calendars off home |
| Authentic imagery | One hero/service image, one Lauren image, and at most one additional pet image | Integrated into relevant sections; no gallery route | Remove standalone gallery and duplicate image; selectively restore one client-dog asset |
| Social proof | Compact verified business-profile links; PSI only if current membership wording is approved | Footer/trust; `/credentials` for verified status | No review cards, star ratings, or testimonial route without evidence |
| Client preparation | One short readiness cue on Start | Existing FAQ/Safety after 12F reconciliation | Do not create a thin resource page from prohibited handouts |
| Contact and PPC | Final Start/Contact CTA and existing-client login | `/contact`, `/start`, external Precise Petcare | Merge repetitive PPC/payment copy into one clear boundary |

The only recommended substantive page additions use route names that already exist as permanent redirects: `/services`, `/rates`, and `/service-area`. This reduces homepage load without creating thin city or enterprise-style pages. No new `/how-it-works`, `/about`, gallery, testimonials, or resource page is justified for current 12E.

## 15. Manual/owner tasks

| Task | Blocks current 12E implementation? |
| --- | --- |
| Confirm the exact active PSI membership wording/status at implementation time and update/approve the applicable business-reference source before publishing the logo/claim | **No**, except it blocks the optional PSI display itself. Logo website-use permission is already resolved. |
| Choose between the equally viable Blu portrait and Blu walk if the implementer cannot make a clear visual selection after responsive QA | **No**. Default to one service-relevant dog image and proceed; general photo consent is already resolved. |
| Supply a genuine review/testimonial plus republication permission if owner wants review content | **No**. Omit social-proof cards until evidence exists. |
| Obtain a fresh portal logo only if the existing 125-pixel member-logo file proves corrupt, obsolete, or unusable | **No**. A likely suitable asset is already locally available; this is not a current asset blocker. |

Implementation can proceed without PSI, testimonials, a new brand logo, additional biography, or a final owner photo choice. It must not treat general Lauren/animal photo permission or PSI website-logo permission as unresolved.

## 16. Deferred to Phase 12F or later

- Broad original educational-resource authoring, resource hub, seasonal safety series, or client-preparation guide.
- Broad FAQ search/content enhancement beyond updating links and directly stale 12E media wording.
- Advanced availability, smart-feature, or planner/estimator feature expansion.
- Broad SEO audit, keyword/city-page work, structured-data expansion unrelated to the new route presentation, analytics, or conversion tracking.
- Security, privacy architecture, provider reliability, contact-delivery engineering, observability, recovery, and operational continuity systems.
- Automatic review/testimonial ingestion or third-party review widgets.
- Transportation content until CURRENT / APPROVED scope, insurance, and training authority exists; it is not promised as a 12F deliverable merely because the prohibited infographic discusses it.
- Any broad accessibility or responsive-foundation rewrite. Manual pre-launch device/assistive-technology work remains in its existing launch track.
- Deployment, production/provider configuration, domain/indexing work, and launch execution.

## 17. Explicit exclusions and scope protection

Current 12E implementation must not:

- redo completed 12A-12D or F0-F14 work;
- redesign or change approved rates, holidays, travel tiers, service-area rules, service windows, review triggers, eligibility, PPC authority, cancellation/payment policy, estimator math, or CarePlanner business logic;
- create instant booking, instant availability, reservation holds, fake urgency/scarcity, or a suggestion that payment guarantees acceptance;
- weaken welfare, safety, law, insurance, training, or service-scope review;
- expose private route origins, capacity thresholds, risk reasoning, provider secrets, Client data, access details, or medical records;
- publish unsupported insurance, bonding, certification, training, CPR/first-aid, background-check, experience, client-count, membership, transportation, medical, backup-personnel, endorsement, or 24/7 claims;
- fabricate reviews, testimonials, ratings, people, team members, or pet stories;
- create thin About, city, testimonial, gallery, How It Works, or resource pages;
- restore every approved photo, rename/reorganize the six recovered owner-pet assets, or rewrite Git history;
- publish, route, link, embed, copy, closely paraphrase, recreate, or place under public delivery the three prohibited PDFs or infographic;
- turn the private reference topics into broad educational content before 12F reconciliation;
- add dependencies, providers, analytics, deployment configuration, production environment values, or hosting work; or
- merge or deploy without separate owner authorization.

The finalized public Standard Overnight model must remain intact: `$85` for a dog household, `$80` for a cat-only household, and personalized review for a small-animal-only household. Homepage brevity may determine where both public rates appear, but it must not reclassify or hide the cat-only rate.

## 18. Final CURRENT Phase 12E implementation scope

1. Rewrite the homepage hero so a first-time visitor immediately understands Sacramento-area professional in-home pet sitting and dog walking, Lauren's owner-operated/ordinary-primary-caregiver role, and the primary `/start` action.
2. Add a concise Meet Lauren section using `public/lauren-portrait.jpeg` by default, with accurate continuity wording and contextual Safety/Credentials links. Do not invent biography or credentials.
3. Make `/start` the canonical new-client orientation page; lead with the whole process, not travel alone; route supporting choices to Services, Rates/estimator, Service Area, Plan, Contact, PPC registration, and existing-client login.
4. Convert existing redirected slugs `/services`, `/rates`, and `/service-area` into substantive, non-thin pages. Move full service descriptions, full approved public pricing plus estimator, and address/service-area tools to their appropriate pages.
5. Keep the homepage to a compact service overview with critical Standard Overnight/Continuous Care distinctions and a small set of clearly labeled price anchors. Link to Services and Rates for detail.
6. Preserve the finalized public Standard Overnight presentation: `$85` for a dog household, `$80` for a cat-only household, and “Personalized review required” for a small-animal-only household unless a more-specific CURRENT / APPROVED authority establishes otherwise. Keep homepage pricing concise where appropriate, but do not hide or reclassify the `$80` cat-only rate. Preserve this three-way distinction in Rates/Services copy, estimator UI, announcements/copy text, and public API behavior.
7. Shorten/align How It Works on home and use `/start` for detail. Preserve the generally expected Meet & Greet, manual review, PPC quote/confirmed-booking boundary, and no-guarantee language.
8. Shorten service-planning, social, PPC, and final CTA content; remove the standalone gallery; integrate a maximum of three or four distinct approved images where they explain content.
9. Use the existing Lauren portrait, one existing owner-cat image, and selectively restore at most one or two reliably identified approved Client-animal images from the preserved asset set. Prefer a service-relevant dog image. Optimize heavy selected images, write factual privacy-conscious alt text, and do not identify Client/pet names or invent context.
10. Update only directly stale media presentation in FAQ/Privacy so it no longer says the approved current image set is categorically unresolved. Do not convert the DRAFT general media-consent form into site-wide policy.
11. Reduce primary navigation choices and promote Start Here. Keep Holidays, Compare Care, Credentials, legal pages, and social profiles available through contextual links/footer.
12. Use the PSI member logo only if active membership language is confirmed in CURRENT / APPROVED authority at implementation time. If used, copy the existing portal-provided website asset into the clean worktree, use restrained placement, and avoid endorsement/certification/insurance implications. Remove the unused `public/psi-membership-certificate.jpg` from the current public tree unless the owner explicitly approves public certificate publication after authority is updated; do not rewrite history. PSI is optional and must not block the rest of 12E.
13. Preserve the four exact prohibited-resource ignore entries. Confirm the resources remain absent from current Git tracking, routes, and build output. If evidence changes and an exact file is tracked, remove only that current-tree file without history rewrite.
14. If adding a first-service readiness cue, write it from scratch from Cuddle Crew's approved onboarding authority and keep it short on `/start`. Do not reproduce source handout wording, structure, graphics, or medical advice.
15. Preserve all existing foundation, accessibility, privacy, security, integration, and business-rule contracts; update route/link tests and add targeted regressions for the new IA and three-way Standard Overnight presentation.

## 19. Acceptance criteria for future implementation

- [ ] At 1440 px and 390 px, the first viewport clearly communicates in-home pet sitting/dog walking, general Sacramento-area relevance, Lauren's owner-operated role, and one primary Start Here action.
- [ ] Lauren is described truthfully as the ordinary primary caregiver, with no “always Lauren,” guaranteed-backup, team, or corporate implication.
- [ ] `/start` is reachable from the homepage and primary navigation and is the canonical new-client orientation path.
- [ ] `/services`, `/rates`, and `/service-area` render substantive pages rather than redirecting to homepage anchors; no unnecessary new content routes are added.
- [ ] Homepage service orientation covers Drop-In Visits, Dog Walks/90-minute Adventure Walk, Standard Overnight, 3-8 hour Continuous Care, and limited 24-Hour Continuous Care without a full policy-table overload.
- [ ] Standard Overnight remains approximately 6 p.m.-8 a.m., may involve compatible reasonable departures, is not 24-hour presence, and keeps daytime care separate.
- [ ] Continuous Care remains a reviewed household-based dedicated consecutive block, not an automatic upsell; limited 24-Hour care starts at `$300` and is not guaranteed.
- [ ] All public rates and modifiers match current approved authority: Standard Overnight is `$85` for a dog household and `$80` for a cat-only household, while small-animal-only Overnight returns “Personalized review required” unless a more-specific CURRENT / APPROVED authority establishes otherwise.
- [ ] The estimator works at `/rates#estimate`, retains its estimate-only/manual-review boundary, preserves public `$85` dog and `$80` cat-only results, routes small-animal-only Overnight to personalized review, and does not confuse the three categories.
- [ ] The homepage links clearly to detailed Services, Rates/estimator, Service Area, Plan Care, Safety/Credentials, FAQ, Contact, and Start content without duplicate long blocks.
- [ ] The service-area summary explains general Sacramento-area fit, an exact-address next step, and route/capacity review without exposing or foregrounding a private origin.
- [ ] The new-client path distinguishes exploration, secure PPC profile/request, the generally expected Meet & Greet, Lauren's review, and final PPC confirmation; no online action is presented as auto-booking.
- [ ] At least one approved Lauren image and a restrained, contextually useful animal-photo mix are used; no photo is rejected solely because of the stale consent assumption.
- [ ] No more than one or two approved Client-animal files are restored unless owner review expressly expands the set; restored files are optimized, nonduplicative, and have factual privacy-conscious alt text.
- [ ] PSI website-logo permission is treated as resolved. Any actual logo display is backed by current approved membership wording and does not imply endorsement, general certification, insurance, or bonding; the current unused membership certificate is no longer publicly retrievable unless its publication is explicitly approved.
- [ ] No unsupported review, testimonial, rating, client-count, credential, insurance, bonding, training, medical, transportation, background-check, experience, 24/7, or backup-personnel claim appears.
- [ ] The three prohibited PDFs and infographic remain untracked/non-public, are not linked/embedded/copied/recreated, and do not appear in build artifacts. The exact ignore rules remain narrow; unrelated PDFs/images are not ignored.
- [ ] Any readiness or safety text inspired at a high level by private references is original Cuddle Crew wording grounded in current approved authority and does not provide veterinary advice.
- [ ] The standalone gallery and repeated window image are removed; mobile content no longer stacks the current complete rates, modifiers, estimator, service-area tools, and repeated process blocks on one page.
- [ ] Existing F11 semantics, keyboard/focus/touch/reflow/reduced-motion behavior and 12D fixes remain intact; affected routes pass responsive and accessibility tests.
- [ ] Existing tools, providers, privacy boundaries, PPC authority, service logic, pricing configuration, holidays, and service-area logic remain intact.
- [ ] Targeted tests, `npm run validate:full`, and the documented manual desktop/mobile visual review pass at the exact implementation tip.
- [ ] No commit, push, merge, deployment, or production/provider write occurs without separate authorization.

## 20. Validation expectations for implementation

Before implementation, run `npm run doctor`. After implementation:

1. Run targeted Node tests for pricing/public estimate response, route redirects/destinations, business-reference checks, resources, and any updated navigation helpers.
2. Run targeted Playwright tests for home, `/start`, `/services`, `/rates#estimate`, `/service-area`, navigation, the three Standard Overnight household outcomes, image alternatives, and 390/1440 hierarchy.
3. Run `npm run check:git-safety`, `npm run check:foundation`, `npm run check:resources`, and `npm run scan:secrets`.
4. Run `npm run validate:full`; report exact Node, Playwright, focused accessibility, lint-warning, build, and artifact results actually observed.
5. Run `git diff --check` and exact `.gitignore` positive/negative checks.
6. Inspect the generated artifact for the prohibited filenames and selected image size/format. Do not access or copy private PDFs into build/test fixtures.
7. Render and visually inspect the homepage plus the moved detail pages at representative 1440 px desktop and 390 px mobile viewports. Confirm content order, heading hierarchy, crops, no duplicate content, manageable length, and no horizontal overflow.

The current verified main baseline supplied for comparison is 157 Node tests, 22 Playwright tests, 9 focused accessibility tests, lint with 0 errors and 4 known `<img>` warnings, build pass, hosted artifact gate pass, 161 files / 5.92 MiB, and 0 secret findings. Do not repeat these as implementation results unless the commands actually produce them.

## 21. Changed files in this reconciliation

| Path | Purpose | Classification |
| --- | --- | --- |
| `docs/phase-12e-current-state-reconciliation.md` | Durable current reconciliation, scope, acceptance criteria, and implementation prompt | Current planning documentation; non-authoritative for business policy |
| `.gitignore` | Four exact prohibited local-source paths | Narrow authorized repository hygiene; no broad PDF/image ignore |

No application code, component, CSS, image, business reference, pricing, holiday, service-area, PPC rule, estimator, CarePlanner, dependency, provider, deployment, or production configuration was changed.

## 22. Copy/paste-ready CURRENT Phase 12E implementation prompt

```text
CUDDLE CREW PET CARE — CURRENT PHASE 12E IMPLEMENTATION
Homepage, Trust, Imagery, and Information Architecture

This is an IMPLEMENTATION task based on the owner-reviewed current reconciliation at:

docs/phase-12e-current-state-reconciliation.md

Do not execute the historical Phase 12E summary as an original prompt. Its provenance is SUMMARY ONLY and it is non-authoritative planning evidence.

BASELINE AND GIT SAFETY

Repository: cuddlecrewpetcare/Cuddle-Crew-Web
Remote: github
Expected reviewed github/main baseline:
4117a73ae7469fa7ee70eba60e6cac84ddc489a4

First fetch github/main and report the fetched SHA. If it has advanced, inspect the intervening changes and reconcile them with the approved Phase 12E scope before editing; do not blindly use the old SHA.

The existing canonical `CuddleCrewPetCareWEB` checkout is intentionally dirty and contains preserved work. Locate it with `git worktree list --porcelain` and inspect it read-only only when necessary to identify owner-approved assets. Do not reset, clean, restore, stash, stage, modify, delete, or rewrite it. Do not prune/delete worktrees. Create a fresh clean worktree from fetched github/main and a branch such as codex/phase-12e-implementation.

Before changing copy or behavior, read AGENTS.md, docs/business-reference/README.md, docs/business-reference/guidance/source-of-truth-document-hierarchy.md, the reconciliation document, and the most specific applicable CURRENT / APPROVED core/logic/operations/guidance references. PLACEHOLDER, DRAFT, SUPERSEDED, website code, and historical prompts are not business authority. Stop and report any material conflict between applicable CURRENT / APPROVED sources. Never invent an unresolved rule or expose private internal decision logic.

COMPLETED WORK TO PRESERVE

Treat Phase 12A, 12B, 12C, F0-F14, Phase 12D, owner-image recovery, roadmap/archive reconciliation, and Pre-12E business-authority reconciliation as complete and merged. Do not redo accessibility/responsive, security, privacy, dependency, CI/deployment, integration, recovery, testing, pricing-policy, holiday, PPC, estimator-math, or service-area-rule foundations. Preserve unrelated functionality.

IMPLEMENT ONLY THESE CURRENT 12E GAPS

1. Homepage hero and primary path
- Make the first viewport plainly say that Cuddle Crew provides professional in-home pet sitting and dog walking in the Sacramento area.
- Present Lauren truthfully as the owner and ordinary primary caregiver, without implying she is guaranteed for every visit or that a large team exists.
- Use Start Here -> /start as the primary new-client action. Keep Services or Service Area as a secondary exploration action and keep existing-client login clearly separate.

2. Meet Lauren/trust
- Add a concise Meet Lauren section, using tracked public/lauren-portrait.jpeg by default.
- Preserve the approved continuity caveat: Lauren ordinarily provides care; an exception/approved backup arrangement is communicated through the confirmed plan.
- Do not invent biography, years, client counts, credentials, employees, backup availability, insurance, bonding, training, certification, CPR/first aid, background checks, medical expertise, or transportation capability.
- Link contextually to Safety, Credentials, Compare Care, and FAQ rather than copying those pages onto home.

3. Conversion flow and /start
- Make /start the canonical new-client orientation page and link it from home and primary navigation.
- Do not lead /start as though checking travel is always step one. Explain the overall path, then offer Services, Rates/estimator, Service Area, Plan Care, Contact, secure PPC registration, and existing-client login.
- Distinguish exploration, secure PPC profile/request, the generally expected complimentary Meet & Greet unless a rare exception is approved, Lauren's personalized route/schedule/routine/welfare/safety/scope/capacity review, and final confirmation.
- Only an approved Precise Petcare quote and confirmed booking establish service. Estimate, availability, registration, Meet & Greet, invoice, or payment do not guarantee acceptance. Do not implement auto-booking, instant availability, holds, or fake urgency/scarcity.

4. Services, Rates, Service Area, and homepage density
- Convert the existing /services, /rates, and /service-area redirect slugs into substantive pages. Do not add a thin /about, /how-it-works, gallery, testimonial, city, or resource page.
- Move detailed service descriptions to /services.
- Move the complete approved public rate/modifier presentation and QuoteEstimator to /rates#estimate without changing rate math or general estimator business behavior.
- Move AddressChecker and detailed service-area explanation to /service-area without changing travel/service-area logic or exposing private origins.
- Keep only compact service, rate, estimator-entry, and service-area summaries on home.
- Preserve Drop-In 30/60/90-minute orientation, Dog Walk 30/60 and suitability-reviewed 90-minute Adventure Walk, Standard Overnight, 3-8 hour Continuous Care, and limited 24-Hour Continuous Care.
- Preserve that Standard Overnight is approximately 6 p.m.-8 a.m., is not 24-hour continuous presence, may include compatible reasonable departures, and has separate daytime care.
- Preserve that Continuous Care is a dedicated reviewed household-based block, not an automatic upsell; limited 24-Hour Continuous Care starts at $300 and is not guaranteed.
- Use only clearly labeled, non-misleading homepage price anchors. Keep full detail on Rates and Holidays.

5. Preserve finalized public Standard Overnight pricing
- Dog household: $85 per Standard Overnight Service.
- Cat-only household: $80 per Standard Overnight Service.
- Small-animal-only Overnight: Personalized review required unless a more-specific CURRENT / APPROVED authority establishes otherwise.
- Public Rates/Services presentation must not hide or reclassify the finalized $80 cat-only rate. Homepage pricing may remain concise for hierarchy and density, but brevity must not imply that cat-only Overnight is review-only.
- Preserve the three-way distinction in page copy, API output, estimator UI, screen-reader announcements, and copied summaries. Do not remove the public cat-only rate or change any approved rate.
- Add focused Node and E2E regression coverage confirming $85 dog, $80 cat-only, small-animal-only personalized review, and no category confusion.

6. Approved photography and image placement
- Lauren confirms all identified photographs in her available Cuddle Crew website asset set depicting Lauren and/or animals have explicit permission for public website use. Lauren approves photos of herself. This supersedes the old unresolved client-pet consent assumption.
- Do not reject an identified photo solely because of the old consent status. Also do not restore every photo automatically.
- Use the tracked Lauren portrait, one existing owner-cat image, and selectively restore at most one or two reliably identified approved Client-animal images only if they improve service explanation/authenticity. Prefer one service-relevant dog image such as the preserved Blu walk or, if it works better in the responsive hero, the Blu first-page portrait.
- The preserved dirty checkout is a read-only source. Copy selected files into the clean worktree; do not move, rename, delete, or alter originals. Do not reorganize the six already recovered owner-pet assets.
- Optimize any heavy selected file; use responsive dimensions/crops; use factual privacy-conscious alt text; do not expose Client identity or pet names; do not invent pet stories/context; avoid duplicate variants.
- Remove the standalone Ponyo/Bambi gallery and redistribute a maximum of three or four distinct images across meaningful hero/owner/service contexts. Do not repeat the current window image.
- Update only directly stale FAQ/Privacy media wording so it accurately describes the currently selected approved image set without treating the DRAFT general media-consent form as approved policy.

7. PSI
- Lauren confirms that her PSI membership portal permits website use of the PSI logo. The website-use permission issue is resolved and must not be listed as a legal/owner blocker.
- A portal-provided 125-pixel color PSI member-logo file appears available under public/logos/ in the preserved checkout; current main also contains a membership certificate showing an expiry of 2027-08-19.
- The certificate is currently directly retrievable because it is tracked under public/. It is not the website logo and current approved authority does not justify public certificate publication. Remove it from the current public tree unless the owner explicitly approves publishing that document after authority is updated. Do not rewrite history.
- Before publishing the logo or an active-membership claim, verify the current status at implementation time and record/approve the exact public wording in the applicable CURRENT / APPROVED business-reference source; operations/40 is currently PLACEHOLDER.
- If verified, copy the proper member-logo asset into the clean worktree with a normal web extension and use it once, preferably on /credentials, with restrained factual context. Do not use it as an endorsement, general certification, service guarantee, insurance/bonding proof, or medical/training claim. Do not publish the certificate as decorative homepage content.
- PSI is optional; if wording authority is not approved, omit/defer the logo and complete the rest of 12E.

8. Prohibited PDFs and infographic
- The following are prohibited from public website publication:
  public/handouts/Client Handout - Preparing for Your Pet Sitter.pdf
  public/handouts/Pet Sitter Interview Checklist.pdf
  public/handouts/Summer Safety Tips for Pet Owners (Client Handout).pdf
  public/infographics/Dog Travel Safety Infographic
- Do not publish, route, link, embed, download, copy, closely paraphrase, recreate, or place them in public build output. Do not reproduce their graphics/layout or imply Cuddle Crew authored them.
- Preserve and verify the four exact .gitignore entries from the reconciliation. Do not ignore PDFs/images broadly and do not delete the owner's private originals.
- If an updated Git inspection ever finds an exact prohibited file tracked, remove only that current-tree file and its public reference in an authorized change. .gitignore cannot untrack a file. Do not rewrite Git history.
- At most add a short first-service readiness cue on /start if useful. Write it completely from scratch in Cuddle Crew's voice and ground it in CURRENT / APPROVED onboarding authority. Broad preparation/summer/interview educational content defers to 12F. Do not add veterinary advice or transport content.

9. Navigation and cleanup
- Reduce equal-weight primary navigation choices and promote Start Here. A suitable target set is Services, Rates, Service Area, Plan Care, Safety, FAQ, Contact, and Start Here, with Holidays, Compare Care, Credentials, legal pages, and social profiles available contextually/footer.
- Keep social business-profile links as links only. Do not create review cards, star ratings, client counts, or testimonials without genuine evidence and permission.
- Shorten/merge repeated Why, service-planning, PPC, and final CTA copy. Keep the PPC confirmation boundary once in the right context.
- Change /about to the homepage Meet Lauren anchor rather than creating a thin page, unless new approved biography is separately supplied.

EXPLICIT EXCLUSIONS

Do not implement 12F smart features, broad SEO/structured-data work, analytics, security/privacy architecture, contact/provider reliability, broad FAQ/resource expansion, emergency/continuity systems, production setup, domain/indexing work, or launch/deployment. Do not change approved pricing, holidays, service-area rules, PPC rules, CarePlanner logic, estimator math, providers, dependencies, or deployment configuration beyond a narrowly necessary and tested route/presentation refactor. Do not expose private thresholds/reasons. Do not rewrite Git history.

ACCEPTANCE AND VALIDATION

Use the measurable acceptance criteria in docs/phase-12e-current-state-reconciliation.md. Preserve F11/12D accessibility and responsive contracts. Add/update focused tests for real /services, /rates, /service-area routes; home/start navigation; estimator relocation; public $85 dog and $80 cat-only Standard Overnight pricing; small-animal-only personalized review; prohibited-resource absence; selected image alternatives; and representative 390/1440 layouts.

Run and report:
- npm run doctor
- targeted Node and Playwright tests
- npm run check:git-safety
- npm run check:foundation
- npm run check:resources
- npm run scan:secrets
- npm run validate:full
- git diff --check
- exact positive/negative .gitignore checks
- generated-artifact scan for the prohibited filenames
- manual rendered visual review at 1440 px desktop and 390 px mobile

Report exact counts/results actually observed. The current-main reference baseline is 157 Node, 22 Playwright, 9 focused accessibility, lint 0 errors/4 known <img> warnings, build pass, artifact gate pass, and 0 secret findings; do not assume those counts after changes.

CHANGE CONTROL

Do not commit, push, merge, deploy, modify provider/dashboard state, or write to production unless separately authorized. End with a reviewable diff, exact changed-file list, business-reference documents used, validation results, deferred/manual items, and explicit confirmation that the original dirty checkout and private source files were preserved.
```

## 23. Reconciliation-task validation record

| Command/check | Result |
| --- | --- |
| `git fetch github main` plus SHA/divergence checks | PASS — fetched `github/main` and `FETCH_HEAD` both resolved to `4117a73ae7469fa7ee70eba60e6cac84ddc489a4`; local main is 0 ahead / 42 behind |
| `gh --version` | PASS — 2.100.0 |
| `gh auth status` | INFORMATIONAL FAILURE — installed CLI found an invalid saved token for the active default account. Authentication was not altered and no GitHub API metadata was required. |
| `npm run setup:local` | PASS — dependencies/Chromium prepared; npm emitted Windows cleanup warnings for optional Sharp WASM directories |
| Rendered Chromium audit | PASS — home rendered at 1440 x 900 and 390 x 844; full-page lengths were approximately 9,032 and 13,986 pixels respectively |
| First `npm run doctor` | FAIL — two invalid optional Sharp WASM directories remained after setup; both exact generated directories were verified inside this disposable worktree and removed |
| Final `npm run doctor` | PASS — exact Node 22.17.1/npm 10.9.2, dependency tree, fingerprint, Chromium, Gitleaks, ports, environment template, and disk checks ready |
| `npm run check:git-safety` | PASS — expected existing review warning for `public/og.png` at 1.75 MiB; two intended worktree entries; lockfile unchanged |
| First `npm run check:foundation` | FAIL at cross-platform check — this new document recorded machine-specific absolute paths. The paths were removed; no application issue was found. |
| Final `npm run check:foundation` | PASS — Git safety, current secret scan (0 findings), supply chain, integrations, resources, cross-platform, time, deployment, and recovery checks passed. Existing warnings: five extraneous optional/WASM npm entries and `public/og.png` 1.75 MiB review. |
| Exact `git check-ignore -v --no-index` positives | PASS — all four prohibited local-source paths resolve to the four new exact rules |
| Negative ignore checks | PASS — an arbitrary `docs/example-reference.pdf` and `public/photos/example-photo.png` are not ignored |
| `git diff --check` | PASS — no whitespace errors |

Full Node/E2E/build validation was not rerun because this reconciliation changes only Markdown and `.gitignore`; the repository's requested minimum planning/documentation gate passed. The implementation prompt requires full validation after application changes.

## 24. Reconciliation verdict

**PHASE 12E CURRENT-STATE RECONCILIATION: READY FOR OWNER REVIEW**
