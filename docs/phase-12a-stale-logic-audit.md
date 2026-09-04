# Phase 12A Stale-Logic Audit

> Audit date: 2026-09-03
>
> Classification: INTERNAL REPOSITORY AUDIT — NOT BUSINESS-POLICY AUTHORITY
>
> Audit status: URGENT CORRECTIVE ACTION REQUIRED

## Scope and Method

This audit compares application code, public copy, metadata, API behavior, tests, fixtures, and repository documentation against the business-reference status system. It does not treat existing implementation, tests, old prompts, or deployed behavior as authority.

The governing rule is the most specific applicable `CURRENT / APPROVED` reference, subject to safety, welfare, law, insurance, training, and approved Service scope. `PLACEHOLDER`, `DRAFT`, and `SUPERSEDED` material was recorded only as an unresolved dependency.

Phase 12A intentionally does not perform the broad implementation corrections below. The bounded SMS/contact, Privacy Policy, Terms, and governance documentation corrections are recorded separately as resolved items.

## Status Inventory

### Current / Approved

- `core/01-master-service-agreement.md`
- `core/02-cancellation-booking-change-refund-policy.md`
- `core/03-pricing-fees-surcharge-policy.md`
- `logic/16-new-client-pre-service-checklist.md`
- `logic/17-meet-and-greet-checklist.md`
- `logic/18-booking-acceptance-risk-triage.md`
- `logic/19-adventure-walk-suitability.md`
- `logic/20-overnight-acceptance.md`
- `logic/21-long-stay-review.md`
- `logic/22-medication-scope-review.md`
- `logic/23-behavior-risk-review.md`
- `logic/24-shared-care-coordination.md`
- `logic/33-custom-quote-scope-review.md`
- `logic/37-service-window-capacity-planner.md`
- `operations/35-annual-business-policy-audit.md`
- `operations/38-continuity-backup-provider-plan.md`
- `guidance/client-explanation-library.md`
- `guidance/source-of-truth-document-hierarchy.md`
- `guidance/sms-communications-consent-compliance.md` (created in Phase 12A)

### Placeholder / Not Authority

- `core/04-access-key-home-security-agreement.md`
- `core/05-emergency-veterinary-authorization.md`
- `core/06-medication-administration-consent.md`
- `core/07-shared-care-third-party-care-agreement.md`
- `core/08-overnight-care-addendum.md`
- `core/09-pet-behavior-handling-safety-agreement.md`
- `core/10-media-photo-testimonial-consent.md`
- `core/15-vacation-care-plan-care-frequency-approval.md`
- `logic/36-holiday-peak-date-calendar.md`
- `operations/40-training-certification-service-scope-matrix.md`
- `guidance/pricing-care-standards-manual.md`

No `DRAFT` or `SUPERSEDED` business-reference files were present at the time of this audit.

## Conflict Register

| ID | Severity | Subject | Authoritative reference and status | Conflicting implementation | Stale or unsupported behavior | Recommended correction |
| --- | --- | --- | --- | --- | --- | --- |
| A01 | Critical | Holiday/peak dates | `logic/36-holiday-peak-date-calendar.md` — `PLACEHOLDER`; `core/03-pricing-fees-surcharge-policy.md` — `CURRENT / APPROVED` requires qualifying dates from an approved calendar | `app/lib/business-rules.ts`; `app/holidays/page.tsx`; `app/QuoteEstimator.tsx`; `app/faq/FAQSearch.tsx`; `tests/business-rules.test.ts`; `e2e/launch-review.spec.ts` | Code invents a recurring holiday list, publishes generated calendars, and automatically charges holiday fees although no exact holiday period is approved. | Disable automatic/public holiday-date behavior until an exact calendar is approved, or populate and approve the calendar first; then drive all consumers from one dated source. |
| A02 | Critical | Insurance, bonding, membership, training, and capability claims | `operations/40-training-certification-service-scope-matrix.md` — `PLACEHOLDER`; hierarchy public-claim rules — `CURRENT / APPROVED` | `app/config/business.ts`; `app/credentials/page.tsx`; `app/config/provider-guide.ts`; `app/page.tsx`; `app/layout.tsx`; `public/manifest.webmanifest`; `tests/production-reliability.test.ts`; `LAUNCH_CHECKLIST.md` | Public pages and metadata assert insurance/bonding limits, PSI status, training-in-progress details, and professional capabilities without a populated approved matrix. | Verify evidence with owner/insurance/training review, populate and approve the matrix, then reconcile every public claim and metadata field. Until then, remove or neutralize unsupported claims. |
| A03 | High | Standard rates and species pricing | `core/03-pricing-fees-surcharge-policy.md` — `CURRENT / APPROVED` | `app/config/business.ts`; `app/page.tsx`; `app/QuoteEstimator.tsx`; `app/lib/estimate.ts`; `app/faq/FAQSearch.tsx`; `tests/business-rules.test.ts`; `tests/production-reliability.test.ts`; `e2e/launch-review.spec.ts` | Cat/small-animal drop-ins use $30/$48 instead of $28/$45; Overnights use $105 instead of $85 dog-household/$80 cat-only; the estimator and tests reinforce the stale values. | Reconcile the central pricing model to the approved species-specific rates and update all dependent rendering/calculation tests in one implementation phase. |
| A04 | High | Overnight midday pricing | `core/03-pricing-fees-surcharge-policy.md` — `CURRENT / APPROVED` | `app/config/business.ts`; `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/page.tsx`; `app/faq/FAQSearch.tsx`; `tests/business-rules.test.ts` | Every 30-minute midday add-on is $30, and a hidden `60` state is also priced as $30. Approved pricing is $25 dog / $23 cat or small animal for one 30-minute add-on; longer daytime care uses normal 60/90-minute rates and walks use walk rates. | Model midday service type, duration, and household species explicitly; remove the stale hidden 60-minute shortcut and update tests. |
| A05 | High | Travel fees | `core/03-pricing-fees-surcharge-policy.md` — `CURRENT / APPROVED` | `app/config/business.ts`; `app/page.tsx`; `app/ServiceAreaMap.tsx`; `app/AddressChecker.tsx`; `app/lib/estimate.ts`; tests and E2E fixtures | Extended and Far Extended fees are $5/$10 rather than approved $10/$20 for daytime visits. | Correct centralized fees and every dependent display/calculation/test after service-area authority is resolved. |
| A06 | High | Daytime short-notice threshold | `core/03-pricing-fees-surcharge-policy.md` — `CURRENT / APPROVED` | `app/config/business.ts`; `app/lib/business-rules.ts`; `app/lib/estimate.ts`; `app/page.tsx`; `app/faq/FAQSearch.tsx`; `tests/business-rules.test.ts` | Daytime requests are automatically assessed the $10 fee when under 48 hours. Approved rule is less than 24 hours but not same calendar day; same-day $20 replaces rather than stacks. | Change the classifier to under 24 hours for daytime Service, preserve the separate same-day tier, and keep the under-48 rule only for Overnight requests. |
| A07 | High | Cancellation/refund summary | `core/02-cancellation-booking-change-refund-policy.md` — `CURRENT / APPROVED` | `app/faq/FAQSearch.tsx` | FAQ uses one stale `48 hours / 50% / same-day full` rule. Approved terms distinguish daytime (24-hour threshold and after-departure/start), short Overnight/vacation care (72/24), extended bookings (7 days/72 hours), and holiday/peak treatment. | Replace the compressed stale answer with an accurate high-level summary linking or deferring to the accepted policy; do not omit distinct booking categories. |
| A08 | High | Overnight additional pets and household base | `core/03-pricing-fees-surcharge-policy.md` — `CURRENT / APPROVED` | `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/config/business.ts`; `tests/business-rules.test.ts` | All multi-pet Overnight estimates zero out pet modifiers and force review; cat-only households are priced using the dog value. Approved modifiers apply where the routine fits, and cat-only base differs from dog-household base. | Select the approved base by household, calculate approved modifiers when standard scope fits, and use personalized review only when an actual review condition exists. |
| A09 | High | Overnight travel handling | `core/03-pricing-fees-surcharge-policy.md`; `logic/20-overnight-acceptance.md`; `logic/33-custom-quote-scope-review.md` — all `CURRENT / APPROVED` | `app/lib/estimate.ts` | The estimator applies ZIP-zone daytime travel fees to Overnight units and their add-ons. Overnights outside Standard require individualized review; daytime Extended/Far Extended surcharges must not be automatically applied to the Overnight. | Separate Overnight travel review from daytime visit travel calculation. Do not add a zone fee to the Overnight unit; route non-Standard Overnight requests to personalized review. |
| A10 | High | Automatic quote stop/review logic | `logic/18-booking-acceptance-risk-triage.md`; `logic/33-custom-quote-scope-review.md` — `CURRENT / APPROVED` | `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/lib/care-planner.ts`; `app/plan/CarePlanner.tsx`; tests | The estimator still returns a definitive number for complex-care flags, outside zones, larger households, and other review conditions; some conditions produce only a note. The approved custom-quote workflow says automation must stop for review triggers. | Add a centralized, private review-decision layer. Return `Personalized review required` without a definitive automatic total where the authoritative trigger requires stopping. Do not expose thresholds publicly. |
| A11 | High | Capacity and public availability | `logic/37-service-window-capacity-planner.md` — `CURRENT / APPROVED` | `app/lib/availability.ts`; `app/api/availability/route.ts`; `app/QuoteEstimator.tsx`; `tests/api-security.test.ts`; E2E fixtures | Public availability is inferred only from the count of calendar events per day and can declare `Good Availability`; it does not account for Service time, drive time, journal/admin time, buffer, route position, windows, or Overnight obligations. | Replace count-only capacity assertions with conservative human-review states or a private true-load calculation. Do not promise public availability from raw event counts. |
| A12 | High | Exact service-area and ZIP authority | `core/03-pricing-fees-surcharge-policy.md` — `CURRENT / APPROVED` defines travel-time tiers; no `CURRENT / APPROVED` source defines the published ZIP allocation | `app/config/business.ts`; `public/service-areas.geojson`; `app/ServiceAreaMap.tsx`; `app/AddressChecker.tsx`; `app/page.tsx`; `app/lib/business-rules.ts`; `app/lib/address.ts`; tests/E2E | ZIP lists are described as authoritative and directly assign fees even though the approved pricing source uses typical one-way travel time and no approved reference governs the ZIP-to-zone map. | Obtain owner approval for a durable service-area/ZIP reference or switch to a server-side typical-travel review that preserves the private origin. Until resolved, do not call the ZIP map authoritative. |
| A13 | High | Media consent and public client-pet images | `core/10-media-photo-testimonial-consent.md` — `PLACEHOLDER`; hierarchy/privacy rules — `CURRENT / APPROVED` | `app/page.tsx`; public client-pet image assets and gallery copy | Public copy says client-pet photos have written permission, but the canonical media-consent reference is unresolved. Repository evidence cannot establish valid consent for each image. | Owner/legal review should verify consent records, populate/approve the media consent source, and reconcile or remove each public client-pet asset until verified. Do not infer consent from an existing image. |
| A14 | High | Emergency veterinary authority | `core/05-emergency-veterinary-authorization.md` — `PLACEHOLDER`; `core/01-master-service-agreement.md` and related logic — `CURRENT / APPROVED` defer to separate authorization | `app/safety/page.tsx`; `app/faq/FAQSearch.tsx` | Public emergency explanations describe actions while the controlling Client authorization remains unresolved. | Populate and approve the authorization with legal/owner review, then reconcile public summaries. Keep current copy strictly conditional and do not imply spending or treatment authority. |
| A15 | High | Medication/service-scope claims | `logic/22-medication-scope-review.md` — `CURRENT / APPROVED`; `core/06-medication-administration-consent.md` and `operations/40-training-certification-service-scope-matrix.md` — `PLACEHOLDER` | `app/faq/FAQSearch.tsx`; `app/page.tsx`; `app/safety/page.tsx`; `app/lib/care-planner.ts`; `app/QuoteEstimator.tsx` | Public code lists precise allowed techniques and blanket-unavailable procedures; planner automatically refers injections/procedures. Current logic requires personalized scope/training/insurance review, while Client consent and verified capabilities are unresolved. | Keep only supported general language (`routine agreed oral/topical medication may be available; personalized review required`) until consent and scope sources are approved. Do not auto-approve or fabricate capability. |
| A16 | Medium | Service-duration/catalog coverage | `core/03-pricing-fees-surcharge-policy.md`; `logic/19-adventure-walk-suitability.md`; `logic/33-custom-quote-scope-review.md` — `CURRENT / APPROVED` | `app/config/business.ts`; `app/page.tsx`; `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/lib/care-planner.ts`; tests | Public pricing/estimator supports only 30/60-minute daytime Services and omits 90-minute Extended Care and 90-minute Adventure Walk. Planner recommends only 30/60 even when the approved ladder includes 90 before custom review. | Add approved 90-minute options and suitability/review boundaries during the pricing implementation phase; do not create a standard two-hour Service. |
| A17 | Medium | Meet & Greet absolutes | `logic/16-new-client-pre-service-checklist.md`; `logic/17-meet-and-greet-checklist.md` — `CURRENT / APPROVED` | `app/faq/FAQSearch.tsx`; `app/page.tsx`; `app/config/provider-guide.ts`; `app/start/page.tsx` | Public copy says every new household is unconditionally required to complete a Meet & Greet. Approved logic says it is generally expected and permits a rare personally approved exception. | Use `generally required/expected unless a rare exception is personally approved`, without presenting the exception as an entitlement. |
| A18 | Medium | Solo-sitter/continuity absolutes | `core/01-master-service-agreement.md`; `operations/38-continuity-backup-provider-plan.md` — `CURRENT / APPROVED` | `app/page.tsx`; `app/config/provider-guide.ts`; `README.md`; `app/choosing-care/page.tsx` | Copy says every booking is personally handled by Lauren and emphasizes no unfamiliar handoff. Approved continuity rules permit a vetted, authorized backup or emergency substitute. | Describe Lauren as the ordinary primary provider while preserving approved continuity pathways and avoiding any guarantee of backup availability. |
| A19 | Medium | Fixed 85°F cutoff | `logic/19-adventure-walk-suitability.md`; `core/01-master-service-agreement.md` — `CURRENT / APPROVED` | `app/faq/FAQSearch.tsx`; `app/safety/page.tsx` | A hard `above 85°F` no-walk rule is published without a current approved source for that exact threshold; approved logic requires individualized weather, surface, air-quality, and pet safety review. | Remove the unsupported numerical threshold or approve it in the appropriate source after owner/training/insurance review. Preserve day-of safety discretion. |
| A20 | Medium | Unsupported operational/public claims | No specific `CURRENT / APPROVED` source supports these exact claims | `app/page.tsx`; `app/config/provider-guide.ts`; `app/layout.tsx`; `public/manifest.webmanifest` | Copy asserts GPS tracking when applicable, Stripe Climate contribution, no sales tax, particular experience/species scope, and broad Sacramento service-area/availability claims without a specific approved source. | Verify each claim and add it to an appropriate approved reference, or remove/neutralize it. Tax wording requires owner/tax-professional review. |
| A21 | Medium | Care-planner heuristics | `logic/18-booking-acceptance-risk-triage.md`; `logic/33-custom-quote-scope-review.md`; `logic/37-service-window-capacity-planner.md` — `CURRENT / APPROVED` | `app/lib/care-planner.ts`; `app/plan/CarePlanner.tsx`; `tests/care-planner.test.ts` | An undocumented workload score and threshold choose 30 versus 60 minutes, with no 90-minute outcome. The heuristic is implementation-created and may look authoritative despite incomplete duration/scope mapping. | Replace with traceable decision rules grounded in approved duration fit and review logic; document any remaining heuristic as non-authoritative and conservative. |
| A22 | Medium | Access/home-security promises | `core/04-access-key-home-security-agreement.md` — `PLACEHOLDER`; relevant general safety/logic references — `CURRENT / APPROVED` | `app/safety/page.tsx`; `app/faq/FAQSearch.tsx`; `app/page.tsx`; `app/contact/page.tsx` | Detailed access, key, alarm, backup-access, and camera statements exist while the controlling Client-facing agreement is unresolved. | Populate/approve the access agreement, then reconcile public summaries. Continue keeping credentials in the secure portal and never expose private procedures. |
| A23 | Medium | Behavior/shared-care/Overnight Client terms | `core/07`, `core/08`, `core/09`, and `core/15` — `PLACEHOLDER`; corresponding internal logic — `CURRENT / APPROVED` | `app/page.tsx`; `app/safety/page.tsx`; `app/faq/FAQSearch.tsx`; `app/lib/care-planner.ts` | Public explanations are driven largely by internal logic while the applicable Client-facing agreement/addendum/approval records remain unresolved. | Use only approved general explanations and avoid creating contractual promises. Complete owner/legal review of each Client-facing source before expanding public terms. |
| A24 | Low | Historical documentation and test naming | Hierarchy and status rules — `CURRENT / APPROVED` | `docs/prompt-9-smart-features.md`; `docs/prompt-10-final-launch-review.md`; test names/comments in `tests/business-rules.test.ts` and `tests/production-reliability.test.ts` | Historical notes call existing implementation “verified” or “authoritative,” and test names imply stale code values are authority. | Mark historical prompt reports as point-in-time/non-authoritative or archive them; rename tests when correcting the underlying logic so tests validate approved references rather than legacy values. |
| A25 | Low | Repository source-of-truth wording | Hierarchy — `CURRENT / APPROVED` | Root `README.md` before Phase 12A | README said published facts “live in” application configuration, which could be misread as authority. | Resolved in Phase 12A by identifying business references as authority and code/configuration as implementation mirrors. |

## Resolved in Phase 12A

| ID | Prior issue | Resolution |
| --- | --- | --- |
| R01 | Root `AGENTS.md` did not explicitly require SMS/communications preflight or summarize the full current authority order. | Added a mandatory business-rule preflight and aligned authority summary. |
| R02 | No canonical SMS/A2P consent, disclosure, logging, STOP/HELP, privacy, marketing, website-scanner, or review reference existed. | Created `docs/business-reference/guidance/sms-communications-consent-compliance.md` as `CURRENT / APPROVED`. |
| R03 | Contact form collected a phone number without a separate SMS consent control or consent record. | Added an optional unchecked checkbox, exact canonical disclosure, linked Privacy Policy, and server-generated source/timestamp record only after affirmative consent. |
| R04 | Contact success copy said text messaging was unavailable and the API schema had no consent boundary. | Removed the stale statement; validation now requires a valid phone only when SMS is selected and rejects unknown fields. |
| R05 | Privacy Policy and website Terms lacked mobile/SMS sections. | Added service-purpose, frequency, rates, STOP, HELP, optionality, purchase independence, processor, and no-third-party-marketing language. |
| R06 | README, hierarchy, and annual audit did not route or periodically review SMS behavior. | Added subject routing, hierarchy mapping, and annual/material-change compliance checks. |

## Unresolved Review Dependencies

The following must not be inferred from filenames, TODOs, examples, existing code, or public claims:

- exact holiday and peak-date periods;
- verified insurance coverage, bonding, credential, certification, membership, transportation, medication, and species-scope facts;
- exact service-area ZIP allocations and the authority for public geographic claims;
- access/key/home-security contractual terms;
- emergency veterinary authority and spending/treatment limits;
- medication Client consent and precise public medication capability;
- shared-care Client agreement terms;
- Overnight Client addendum/home requirements;
- behavior/handling Client agreement terms;
- media/photo/testimonial consent evidence and withdrawal process;
- vacation-care/care-frequency Client approval terms;
- legal review of the new SMS disclosure, Privacy Policy, Terms summary, verbal-consent script, provider configuration, and A2P/10DLC registration;
- current messaging vendor/number, STOP/HELP automation, opt-out storage, and system-of-record integration; and
- tax treatment for the website's `No sales tax` statement.

## Recommended Correction Order

1. Remove or neutralize unapproved holiday automation and unsupported insurance/credential/media claims.
2. Reconcile central pricing, short-notice, travel, Overnight, and cancellation behavior to current approved core policy.
3. Replace count-only public availability with a conservative capacity-aware workflow.
4. Approve a durable service-area/ZIP source or replace direct ZIP authority with protected server-side review.
5. Complete the placeholder legal/insurance/training/client-consent references before expanding affected public copy.
6. Rework estimator/planner review gates and 90-minute Service coverage from centralized rules.
7. Reconcile remaining public claims, historical docs, fixtures, and tests.

## Phase 12A Boundary

This audit did not deploy, change DNS, change production environment variables, modify `.openai/hosting.json`, alter hosting configuration, merge to `main`, or broadly refactor the stale pricing/booking system.
