# Business-Rule Implementation Dependency Map

> Updated: 2026-09-03
>
> Classification: INTERNAL IMPLEMENTATION MAP — NOT BUSINESS-POLICY AUTHORITY

## How to Use This Map

Before changing an implementation area:

1. read `AGENTS.md`;
2. read `docs/business-reference/README.md`;
3. read `docs/business-reference/guidance/source-of-truth-document-hierarchy.md`;
4. read the most specific applicable `CURRENT / APPROVED` reference below;
5. treat `PLACEHOLDER`, `DRAFT`, and `SUPERSEDED` files as non-authoritative dependencies;
6. compare code, copy, APIs, tests, fixtures, metadata, and operational systems against the approved rule; and
7. use `Personalized review required` when automation must stop without exposing private reasoning.

## Authority-to-Implementation Map

| Implementation area | Governing business reference(s) | Current implementation locations | Notes / human-review boundary |
| --- | --- | --- | --- |
| Overall Service and booking framework | `core/01-master-service-agreement.md` (`CURRENT / APPROVED`) | `app/page.tsx`; `app/start/page.tsx`; `app/terms/page.tsx`; `app/safety/page.tsx`; `app/layout.tsx`; `app/SiteHeader.tsx` | Inquiry, estimate, registration, request, confirmation, invoice, payment, and Service readiness are distinct states. |
| Cancellation, refunds, booking changes, early return, extensions | `core/02-cancellation-booking-change-refund-policy.md` (`CURRENT / APPROVED`) | `app/faq/FAQSearch.tsx`; `app/safety/page.tsx`; future booking/change workflows; tests | Do not reuse one generic deadline across daytime, short vacation/Overnight, extended, and holiday bookings. |
| Rates, additional pets, travel fees, short notice, same day, payment, quotes | `core/03-pricing-fees-surcharge-policy.md` (`CURRENT / APPROVED`) | `app/config/business.ts`; `app/lib/business-rules.ts`; `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/page.tsx`; `app/faq/FAQSearch.tsx`; `app/holidays/page.tsx`; `app/AddressChecker.tsx`; pricing and E2E tests | Central configuration is an implementation mirror, not authority. “May add” fees must not silently become unconditional where discretion applies. |
| Access, keys, alarms, cameras, home security | `core/04-access-key-home-security-agreement.md` (`PLACEHOLDER`); general constraints in `core/01` and applicable current logic | `app/safety/page.tsx`; `app/faq/FAQSearch.tsx`; `app/contact/page.tsx`; `app/contact/ContactTools.tsx` | Contractual detail requires owner/legal approval. Keep private credentials in Precise Petcare; website submission never proves successful access testing. |
| Emergency veterinary authority | `core/05-emergency-veterinary-authorization.md` (`PLACEHOLDER`); `core/01` defers to it | `app/safety/page.tsx`; `app/faq/FAQSearch.tsx`; onboarding/portal handoff | Do not invent treatment, transport, or spending authority. Human/legal review required. |
| Medication consent | `core/06-medication-administration-consent.md` (`PLACEHOLDER`) | Public medication copy; future onboarding/portal handoff | Do not treat a form, demonstration, or payment as Client consent or scope approval. |
| Shared-care Client terms | `core/07-shared-care-third-party-care-agreement.md` (`PLACEHOLDER`) | `app/safety/page.tsx`; future onboarding and booking flow | Internal coordination logic may require review but cannot create unresolved contractual terms. |
| Overnight Client terms | `core/08-overnight-care-addendum.md` (`PLACEHOLDER`) | `app/page.tsx`; `app/faq/FAQSearch.tsx`; `app/QuoteEstimator.tsx`; `app/safety/page.tsx` | Current public scope must remain consistent with core agreement and current Overnight logic without inventing addendum terms. |
| Behavior/handling Client terms | `core/09-pet-behavior-handling-safety-agreement.md` (`PLACEHOLDER`) | `app/safety/page.tsx`; `app/plan/CarePlanner.tsx`; public inquiry copy | Collect only preliminary disclosures; do not publish internal risk labels or invent Client obligations. |
| Media/photo/testimonial consent | `core/10-media-photo-testimonial-consent.md` (`PLACEHOLDER`) | `app/page.tsx`; client-pet files in `public/`; future consent preference workflow | Existing assets do not prove consent. Owner/legal verification required before relying on public consent claims. |
| Vacation care / care-frequency Client approval | `core/15-vacation-care-plan-care-frequency-approval.md` (`PLACEHOLDER`) | `app/lib/care-planner.ts`; `app/plan/CarePlanner.tsx`; `app/QuoteEstimator.tsx`; `app/faq/FAQSearch.tsx` | Do not turn general welfare guidance into an unapproved Client contract or universal schedule. |
| New-client readiness | `logic/16-new-client-pre-service-checklist.md` (`CURRENT / APPROVED`) | `app/start/page.tsx`; `app/page.tsx`; portal links; future onboarding status | Website submission and payment do not equal readiness. Precise Petcare remains the Client-specific record. |
| Meet & Greet | `logic/17-meet-and-greet-checklist.md` (`CURRENT / APPROVED`) | `app/page.tsx`; `app/start/page.tsx`; `app/faq/FAQSearch.tsx`; `app/config/provider-guide.ts` | Generally expected; a rare exception requires personal approval. Completion is not booking acceptance. |
| Booking acceptance / risk triage | `logic/18-booking-acceptance-risk-triage.md` (`CURRENT / APPROVED`) | `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/lib/care-planner.ts`; `app/plan/CarePlanner.tsx`; `app/api/availability/route.ts` | Review triggers are not automatic declines. Keep thresholds and reasons private. |
| Adventure Walk suitability | `logic/19-adventure-walk-suitability.md` (`CURRENT / APPROVED`) | Future 90-minute option; current walk copy in `app/page.tsx`, `app/faq/FAQSearch.tsx`, `app/safety/page.tsx` | Individual suitability and day-of conditions control; no mileage/pace guarantee or public medical diagnosis. |
| Overnight acceptance | `logic/20-overnight-acceptance.md` (`CURRENT / APPROVED`) | `app/config/business.ts`; `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/page.tsx`; `app/faq/FAQSearch.tsx` | Approximately 6 PM–8 AM, not continuous care. Non-Standard-zone Overnights require review. |
| Long-stay review | `logic/21-long-stay-review.md` (`CURRENT / APPROVED`) | Future estimator/booking trigger; Overnight date logic in `app/lib/estimate.ts` | Seven or more consecutive Overnights triggers review, not a fee, discount, automatic acceptance, or decline. |
| Medication scope | `logic/22-medication-scope-review.md` (`CURRENT / APPROVED`) | `app/lib/care-planner.ts`; `app/plan/CarePlanner.tsx`; `app/faq/FAQSearch.tsx`; `app/safety/page.tsx`; `app/page.tsx` | More time may require a longer Service; advanced/risky/exact-time care requires review. Verified training/insurance scope is still unresolved. |
| Behavior risk | `logic/23-behavior-risk-review.md` (`CURRENT / APPROVED`) | `app/lib/care-planner.ts`; `app/plan/CarePlanner.tsx`; `app/safety/page.tsx`; `app/faq/FAQSearch.tsx` | No public risk score, severity label, acceptance probability, or internal rationale. |
| Shared-care coordination | `logic/24-shared-care-coordination.md` (`CURRENT / APPROVED`) | `app/safety/page.tsx`; future onboarding/portal handoff | Uncertain third-party care does not count as confirmed welfare coverage. Cuddle Crew does not silently absorb no-shows. |
| Custom quote / scope review | `logic/33-custom-quote-scope-review.md` (`CURRENT / APPROVED`) | `app/lib/estimate.ts`; `app/QuoteEstimator.tsx`; `app/lib/care-planner.ts`; future quote/admin workflow | Stop automatic quoting where required. Never solve safety, insurance, or scope with a surcharge. |
| Holiday/peak dates | `logic/36-holiday-peak-date-calendar.md` (`PLACEHOLDER`) | `app/lib/business-rules.ts`; `app/holidays/page.tsx`; `app/QuoteEstimator.tsx`; `app/faq/FAQSearch.tsx`; tests | No date is authoritative until exact boundaries are populated and the file is approved. Disable invention. |
| Service-window capacity | `logic/37-service-window-capacity-planner.md` (`CURRENT / APPROVED`) | `app/lib/availability.ts`; `app/api/availability/route.ts`; `app/QuoteEstimator.tsx`; calendar tests | True load includes care, drive, journal/admin, and buffer. A blank calendar or event count does not prove availability. |
| Annual audit | `operations/35-annual-business-policy-audit.md` (`CURRENT / APPROVED`) | `LAUNCH_CHECKLIST.md`; documentation review; future scheduled governance | Complete at least annually and after material changes, including SMS program changes. |
| Continuity / backup | `operations/38-continuity-backup-provider-plan.md` (`CURRENT / APPROVED`) | `app/page.tsx`; `app/safety/page.tsx`; `app/config/provider-guide.ts`; `app/choosing-care/page.tsx` | Lauren is ordinarily primary; approved continuity is possible but never guaranteed. Do not expose provider identity or access details. |
| Training, certification, insurance, Service scope | `operations/40-training-certification-service-scope-matrix.md` (`PLACEHOLDER`) | `app/credentials/page.tsx`; `app/config/provider-guide.ts`; public claims and metadata | Public specifics are neutralized pending evidence verification and approval. No credential/capability fact may be inferred until the matrix is approved. |
| Client-friendly explanations | `guidance/client-explanation-library.md` (`CURRENT / APPROVED`) | `app/faq/FAQSearch.tsx`; help text in estimator/planner/pages | Explanations do not create policy and must defer to the specific current policy. |
| Broad pricing/care manual | `guidance/pricing-care-standards-manual.md` (`PLACEHOLDER`) | Historical context across pricing/planner/copy | Not production authority despite containing detailed material. Use dedicated current references. |
| SMS consent and A2P/10DLC | `guidance/sms-communications-consent-compliance.md` (`CURRENT / APPROVED`) | `app/config/sms.ts`; `app/contact/ContactTools.tsx`; `app/lib/contact.ts`; `app/api/contact/route.ts`; `app/privacy/page.tsx`; `app/terms/page.tsx`; tests | Website checkbox is optional and unchecked. Source/timestamp exist only after affirmative consent. STOP/HELP/vendor operations still require operational verification. |
| Source hierarchy and conflicts | `guidance/source-of-truth-document-hierarchy.md` (`CURRENT / APPROVED`) | `AGENTS.md`; root `README.md`; this map; all business-rule changes | Current approved, specific sources control; old implementation and software defaults never become policy. |

## Cross-Cutting Code Dependencies

### Central Configuration

`app/config/business.ts` currently feeds:

- home-page pricing and claims;
- estimate calculations;
- FAQ pricing;
- ordinary one-way travel tiers and fees;
- public metadata and structured data;
- neutralized business-information and comparison copy;
- portal/social links; and
- Service windows and Overnight display.

Phase 12B removed credential specifics and ZIP allocations from this configuration. It now mirrors stable identity/contact values, active approved public rates, service windows, travel-time tiers, and explicit unresolved-policy status flags. The business-reference files remain authoritative.

### Shared Business Logic

`app/lib/business-rules.ts` currently owns:

- conservative ZIP-only review routing;
- disabled holiday-date lookup pending an approved calendar;
- short-notice classification;
- Service-window/care-gap calculations; and
- availability override helpers.

Holiday generation must not remain active while the annual calendar is a placeholder. Daytime and Overnight short-notice classifiers need distinct approved thresholds. ZIP assignment needs its own approved authority.

### Estimate and Planner

`app/lib/estimate.ts`, `app/QuoteEstimator.tsx`, `app/lib/care-planner.ts`, and `app/plan/CarePlanner.tsx` must preserve these separate outcomes:

- calculable standard estimate;
- calculable estimate plus non-blocking explanation, only when approved;
- personalized review with automation stopped;
- modification recommendation;
- referral/out of scope; and
- no availability/confirmation promise.

Tests must validate these distinctions against current approved references instead of merely freezing historical implementation.

### Client-Specific Records

The public website collects preliminary inquiry and planning data only. Precise Petcare remains the operational source of truth for current Client-specific profiles, pets, care instructions, access, emergency contacts, medications, schedules, approved Service plans, quotes, invoices, and confirmed bookings.

The website must not silently overwrite or compete with those records.

## Placeholder Dependency Queue

| Placeholder | Required decision/review before implementation may rely on it |
| --- | --- |
| Access / Key / Home Security Agreement | Owner/legal approval of access, cameras, alarms, failure, key handling, and Client obligations. |
| Emergency Veterinary Authorization | Owner/legal approval of authority, limits, transport, contact hierarchy, and reimbursement. |
| Medication Administration Consent | Owner/legal/training/insurance approval of Client authorization and supported techniques. |
| Shared Care / Third-Party Care Agreement | Owner/legal approval of responsibility, liability, access, medication, and no-show terms. |
| Overnight Care Addendum | Owner/legal approval of home requirements, privacy, cameras, access, and daytime-care boundaries. |
| Behavior / Handling / Safety Agreement | Owner/legal/training/insurance approval of disclosures, Client duties, and handling limits. |
| Media / Photo / Testimonial Consent | Owner/legal approval plus auditable consent records for each public use. |
| Vacation Care Plan / Care-Frequency Approval | Owner/legal/welfare approval of Client-facing acknowledgement and exceptions. |
| Holiday / Peak-Date Calendar | Owner approval of exact start/end times, rate applicability, cancellation treatment, and annual validity. |
| Training / Certification / Service-Scope Matrix | Evidence verification with owner, insurer, trainer/certifier, and membership sources as applicable. |
| Pricing & Care Standards Manual | Owner review of the compiled manual; dedicated current references continue to control their subjects. |

## Human-Review States

Use client-friendly states without exposing internal thresholds or reasoning:

- `Information needed`
- `Action needed`
- `Request received`
- `Under review`
- `Personalized review required`
- `Alternate Service/window recommended`
- `Booking confirmed`
- `Unable to accommodate`

Do not present `high risk`, internal scores, exact capacity, route burden, insurance analysis, or private decline reasons.

## Future Business-Rule Change Workflow

1. Update and approve the authoritative reference.
2. Identify every dependent code, copy, API, schema, metadata, fixture, and test location.
3. Update central configuration and shared logic.
4. Update Precise Petcare where applicable.
5. Update forms, Privacy Policy, Terms, and other Client-facing policies where applicable.
6. Update tests so they cite and enforce the approved rule.
7. Run unit/API tests, typecheck, lint, production build, and relevant E2E/link checks.
8. Deploy only through a separately authorized release task.
9. Verify production behavior, public copy, structured data, and operational handoff.

If a required source is unresolved, stop at human review. Do not promote a placeholder, software default, old test, or current website value into policy.
