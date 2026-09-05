# Precise Petcare Pricing & Quote Implementation

> Status: CURRENT / APPROVED
>
> Classification: INTERNAL REFERENCE
>
> Authority: AUTHORITATIVE FOR PPC PRICING IMPLEMENTATION, INTERNAL QUOTE-BUILDER LOGIC, SAME-TRIP SUPPLEMENTAL CARE, AND QUOTE WORKFLOW
>
> Website use: Estimate-builder logic, internal admin tools, quote calculators, PPC configuration guidance, and handoff from estimate to confirmed booking.

## Purpose

This document translates the approved client-facing pricing rules into a consistent operational setup for Cuddle Crew Pet Care LLC ("Cuddle Crew Pet Care") in Precise Petcare ("PPC") and related internal quote tools.

It does **not** replace the CURRENT / APPROVED Pricing, Fees & Surcharge Policy. If a public dollar amount in this implementation reference conflicts with `core/03-pricing-fees-surcharge-policy.md`, the client-facing Pricing Policy controls.

## 1. Public Daytime Service Totals

Approved public totals remain:

| Service | Dog | Cat | Small Animal |
| --- | ---: | ---: | ---: |
| 30-Minute Drop-In | $30 | $28 | $28 |
| 60-Minute Drop-In | $48 | $45 | $45 |
| 90-Minute Extended Care | $66 | $62 | $62 |

Dog Walk totals remain:

- 30-Minute Dog Walk: $32;
- 60-Minute Dog Walk: $50;
- 90-Minute Adventure Walk: $68.

## 2. PPC Base + First-Pet Modifier Structure

To avoid creating separate public Dog, Cat, and Small-Animal Drop-In services for every duration, PPC may use a common duration-based base price plus first-pet and additional-pet pricing.

### 30-Minute Drop-In

- default/base price: **$20**;
- first dog: **+$10** → $30;
- first cat: **+$8** → $28;
- first small animal: **+$8** → $28;
- each additional dog receiving care: **+$10**;
- each additional cat receiving care: **+$5**;
- each additional small animal receiving care: **+$5** where appropriate.

### 60-Minute Drop-In

- default/base price: **$38**;
- first dog: **+$10** → $48;
- first cat: **+$7** → $45;
- first small animal: **+$7** → $45;
- each additional dog receiving care: **+$10**;
- each additional cat receiving care: **+$5**;
- each additional small animal receiving care: **+$5** where appropriate.

### 90-Minute Extended Care

- default/base price: **$56**;
- first dog: **+$10** → $66;
- first cat: **+$6** → $62;
- first small animal: **+$6** → $62;
- each additional dog receiving care: **+$10**;
- each additional cat receiving care: **+$5**;
- each additional small animal receiving care: **+$5** where appropriate.

## 3. Mixed-Species Hierarchy

Pricing must not depend on which pet the Client happens to click first.

When at least one dog receives care during a Drop-In/Extended Care appointment:

- use the dog first-pet modifier for the first dog;
- additional dogs are +$10 each;
- cats are +$5 each;
- small animals are +$5 each where appropriate.

When no dog receives care:

- the first cat or ordinary small animal uses the applicable first-cat/small-animal modifier for that duration;
- each additional cat/small animal is +$5.

Examples for 90 minutes:

- 1 dog = $56 + $10 = **$66**;
- 1 cat = $56 + $6 = **$62**;
- 2 cats = $56 + $6 + $5 = **$67**;
- 1 dog + 1 cat = $56 + $10 + $5 = **$71**;
- 2 dogs + 1 cat = $56 + $10 + $10 + $5 = **$81**.

## 4. 15-Minute Supplemental Pet Care

Cuddle Crew Pet Care may maintain a staff-only PPC service named substantially similar to:

**All Animals — 15-Minute Supplemental Care**

This service is:

- Active for internal scheduling;
- hidden from Client self-request by leaving the all-Clients service name blank or otherwise using PPC's staff-only configuration;
- not a standalone public visit;
- available only when attached to another scheduled same-household service during the same physical trip/arrival;
- intended for a small, clearly defined additional care routine that genuinely fits within approximately 15 minutes.

Examples include a brief medication/feeding/litter/enclosure routine for another pet while the sitter is already at the home for a dedicated walk or other paid service.

### 15-Minute PPC Pricing

- default/base price: **$10**;
- first dog: **+$10** → **$20**;
- first cat: **+$8** → **$18**;
- first small animal: **+$8** → **$18**;
- additional dog within the supplemental block: **+$10**;
- additional cat: **+$5**;
- additional small animal: **+$5** where appropriate.

Do not offer or quote this as a $10/$18/$20 standalone trip.

If the care requires more than approximately 15 supplemental minutes, use the appropriate full 30-, 60-, or 90-minute service structure or personalized review.

## 5. Dedicated Dog Walk + Other-Pet Care

A Dog Walk is for a dedicated walking service. Do not treat substantive cat or small-animal care as a token additional-pet fee on a walk when there is no time reserved to perform that care.

Use one of the following structures:

1. **Dedicated Dog Walk + 15-Minute Supplemental Care** when the other pet's routine genuinely fits the supplemental block; or
2. **Dedicated Dog Walk + full Drop-In** when the other pet needs a substantive 30-minute or longer routine; or
3. a longer customizable Drop-In/Extended Care block when the dog does not require the entire purchased duration to be a guaranteed dedicated walk and the combined household routine safely fits.

Example:

- 30-minute dedicated Dog Walk: $32;
- 15-minute supplemental cat care: $18;
- combined service components: $50 before applicable trip/service modifiers.

If the cat genuinely requires a full 30-minute visit, use $32 + $28 = $60 before modifiers rather than disguising the cat routine as a +$5 add-on.

## 6. Physical Arrival vs. Billing Line Items

PPC or a quote may use multiple service line items to represent one continuous physical appointment at one household.

When multiple line items occur during **one continuous physical arrival**:

- bill each actual service/care component;
- do **not** duplicate a travel/service-area fee solely because more than one billing line item exists;
- do **not** duplicate a holiday or short-notice surcharge solely because one continuous daytime appointment is split into multiple internal line items;
- document the total planned on-site duration and care components clearly.

Distinct physical arrivals are separate visits for applicable trip-based modifiers.

## 7. Overnight + Daytime / Midday Services

Approved Overnight pricing remains:

- dog household: **$85/night**;
- cat-only household: **$80/night**;
- small-animal-only Overnight: individualized review.

Standard 30-minute midday add-on during Overnight Care:

- dog household: **$25**;
- cat/small-animal household: **$23** where appropriate.

Longer midday care uses the applicable normal 60- or 90-minute daytime rate. A midday dog walk uses the applicable normal Dog Walk rate.

### Separate Service-Unit Rule

An Overnight and a separate midday/daytime arrival are distinct services.

Therefore:

- additional-pet pricing applies to the Overnight based on pets receiving Overnight care;
- additional-pet pricing applies again to the midday service based on pets receiving care during that midday service;
- the midday service receives the applicable daytime travel fee because it creates a separate daytime arrival;
- the Overnight itself does not automatically receive the daytime Extended/Far Extended travel fee; Overnight outside the Standard Zone requires personalized review;
- a qualifying Overnight may receive the approved +$30 holiday surcharge;
- a separate qualifying midday visit may receive the approved +$15 daytime holiday surcharge;
- Overnight short notice uses the <48-hour +$25/night rule;
- a separately requested midday/daytime service uses the daytime <24-hour +$10 or same-day +$20 rule.

Do not use the Overnight's short-notice threshold to automatically create a daytime short-notice fee when the midday service itself was requested with 24 hours or more notice.

## 8. Small-Animal-Only Overnight Review

Small-animal-only Overnight Care remains **personalized review / custom quote** and is not a standard public rate.

For internal review only, the **$80 cat-only Overnight rate is the normal starting benchmark**, not an automatic promise or published small-animal Overnight price.

Use the benchmark only after confirming that Overnight Care is actually an appropriate service structure. Then review:

- species and husbandry requirements;
- number of enclosures or materially distinct routines;
- feeding preparation;
- enclosure/litter/bedding work;
- temperature/environment monitoring;
- medication or exact-time needs;
- daytime care needs outside the Overnight window;
- emergency pathway and species-appropriate veterinary access;
- and the actual time/workload required.

If the routine is straightforward and materially comparable to ordinary cat-only Overnight workload, **$80 may remain the final quoted base** before normal applicable additional-pet, holiday, short-notice, or separate daytime charges.

Do **not** automatically discount below $80 merely because the household has no dog or cat. Do **not** automatically increase the price merely because the species is unusual. More demanding scope should first be addressed through the correct service time, separate daytime service, husbandry/scope review, or personalized quote.

The website must display **Personalized review required** rather than exposing $80 as a guaranteed small-animal-only Overnight price.

## 9. Travel / Service-Area Implementation

Daytime travel pricing remains:

- Core: $0;
- Standard: $0;
- Extended: +$10 per physical daytime arrival;
- Far Extended: +$20 per physical daytime arrival;
- beyond 45 minutes: personalized review / generally unavailable unless specifically approved.

Where a dedicated walk and supplemental/drop-in care are performed back-to-back during one physical arrival, apply the daytime travel fee once for that arrival.

### Overnight Outside the Standard Zone

Overnight outside the Standard Zone remains personalized review rather than automatic application of the daytime travel ladder.

Do **not** create or expose a standing formula such as Extended +$10/night or Far Extended +$20/night.

For an Extended/Far Extended Overnight, review the actual travel burden, including:

- evening arrival travel;
- morning departure travel;
- location relative to school/personal obligations and other confirmed Clients;
- repeated travel burden across multi-night stays;
- any separate midday/daytime trips;
- route backtracking and schedule sustainability;
- and whether the booking remains economically and operationally reasonable.

Possible outcomes are:

- accept at the normal Overnight rate;
- accept with a clearly disclosed **custom Overnight travel adjustment** based on the actual booking burden;
- modify the service plan;
- or decline/refer if the route is not sustainable.

A custom Overnight travel adjustment is booking-specific and does not establish a permanent zone-based Overnight fee.

Any separate midday/daytime arrival still uses the normal daytime travel fee independently.

## 10. Large / Complex Household Pricing Order

The existing review triggers remain:

- **4 or more dogs**;
- **5 or more total pets**;
- **3 or more materially distinct care types/routines**;
- or another workload/safety condition that makes automatic pricing unreliable.

These are **review triggers, not automatic complexity surcharges**.

When a large or complex household is reviewed, use this order:

1. determine whether the complete routine safely fits a standard 30-, 60-, or 90-minute Service;
2. if more time is needed, move to the appropriate longer standard Service;
3. if one visit is still insufficient, use an additional normal Service or different care frequency where appropriate;
4. apply normal additional-pet pricing only where the additional pets' routines genuinely fit the booked time;
5. use custom pricing only when the actual service structure materially differs from the standard menu;
6. modify, refer, or decline when safety, welfare, insurance, or scope makes the booking unsuitable.

Do **not** add a generic "complexity fee," "large household fee," "medical risk fee," or similar surcharge merely because a review trigger exists.

## 11. Care Beyond the Standard 90-Minute Structure

Ninety minutes remains the maximum **standard public daytime Service** at launch.

Do not add a public 2-hour or 120-minute service solely to make the estimator handle uncommon requests.

If care may exceed 90 minutes:

1. first confirm the actual task list and realistic required time;
2. use standard service blocks where they accurately represent the care;
3. a staff-only 15-minute Supplemental Care block may be paired with a standard service only when it represents a genuinely defined supplemental routine and the same-arrival rules are satisfied;
4. use multiple separate Services where separate care periods/arrivals are appropriate;
5. if the Client truly needs more than the standard structure as one extended continuous daytime presence, route to **Personalized review required** rather than publishing an automatic 2-hour rate.

Continuous/extended daytime presence is not automatically the same product as a Drop-In and should be reviewed for capacity, scope, other Client commitments, and sustainability.

## 12. Holiday / Peak-Date Implementation

Use `logic/36-holiday-peak-date-calendar.md` to determine whether a service date qualifies.

- daytime qualifying appointment: +$15;
- qualifying Overnight: +$30/night.

For an Overnight, use the date the Overnight begins unless the approved calendar states otherwise.

An Overnight and a separate midday arrival are separate service events and can each qualify.

Multiple internal line items representing one continuous daytime appointment do not create multiple holiday surcharges solely because of the line-item count.

## 13. Reservation Payment Working Rule

When a reservation payment is required for an Overnight, vacation-care, Extended, holiday/peak, or other capacity-intensive booking, the standard internal quote-builder assumption is:

**25% of the quoted booking total due to reserve/hold the dates.**

This amount is applied toward the total booking balance and is **not automatically non-refundable**. Cancellation treatment is governed by `core/02-cancellation-booking-change-refund-policy.md`.

The remaining balance is ordinarily due 72 hours before the first scheduled Service under the Pricing Policy. If the booking is confirmed inside that payment window, the amount then due may be payable upon confirmation.

Cuddle Crew Pet Care may use a different booking-specific reservation payment when appropriate if it is clearly disclosed before confirmation. The quote builder should therefore keep the reservation-payment percentage editable, with **25% as the default working value**, not a hard-coded legal minimum that cannot be changed.

## 14. View-Only Quote Workflow

QuickBooks Online Estimates may be used as the preferred client-facing **view-only estimate/PDF** because Cuddle Crew Pet Care already uses QuickBooks for bookkeeping.

Preferred workflow:

1. calculate the proposed service structure using the approved pricing rules;
2. create a QuickBooks Online Estimate with understandable final client-facing line items;
3. print/download the Estimate as a PDF or otherwise deliver it without using the Estimate as the payment channel;
4. do not expose PPC internal base/modifier mechanics;
5. the Estimate may state that a 25% reservation payment is normally required to secure booking dates, while the actual payment request is handled through PPC;
6. the Estimate itself does not reserve dates or become the operational invoice;
7. after Client acceptance, create/confirm the actual schedule and invoice in PPC;
8. collect payment through PPC/Stripe under the normal workflow;
9. allow PPC invoice/payment data to sync to QuickBooks for accounting;
10. if useful, upload the accepted/final Estimate PDF to the Client's PPC file for documentation.

Only the accepted/final Estimate should normally be retained in the Client file; calculation drafts do not need to be stored there.

## 15. Quote Is Not a Booking

A quote/Estimate:

- is not the operational invoice;
- does not itself reserve calendar space;
- does not guarantee booking acceptance;
- does not replace onboarding, agreement, welfare, safety, route, or availability review;
- and does not override the final confirmed PPC booking/invoice.

## 16. PPC and QuickBooks Roles

For Cuddle Crew Pet Care's operational workflow:

- **PPC:** Client/pet records, service schedule, confirmed booking, operational invoice, payment status, and service history;
- **Stripe through PPC:** intended Client payment channel for PPC invoices;
- **QuickBooks:** accounting/bookkeeping mirror and optional view-only Estimate/PDF generator, not the operational scheduling or payment source of truth.

Do not intentionally create a second payment workflow through a QuickBooks Estimate when the purpose is only to present the proposed booking price.

Do not assume an edit made only in QuickBooks will become an operational PPC booking change.

## 17. Client-Facing Presentation

Client-facing Estimates should show understandable final service lines, for example:

- 3 Overnight Stays — Dog + 2 Cats;
- 3 Dedicated 30-Minute Dog Walks;
- 3 Cat Care Visits;
- Extended Service Area — 3 daytime arrivals;
- Holiday / Peak-Date Fee where applicable;
- Estimated Total;
- reservation-payment disclosure where applicable.

Do not display confusing internal construction such as "Base $56 + First Dog Modifier $10 + Cat Modifier $5" unless there is a specific operational reason. The Client should see the final service price.

Suggested Estimate disclosure:

**Please review the services and pricing above. If you have any questions or would like to make changes, I’m happy to help. This estimate does not reserve service dates until your booking is confirmed.**

A reservation-payment disclosure may state:

**Please note: a 25% reservation payment is generally required to secure your booking dates.**

Use "generally required" rather than representing 25% as an inflexible legal minimum if the owner intends to retain booking-specific discretion.

## 18. Future Holiday-Year Planning

For future calendar years, begin annual planning with the same core travel-demand categories used for 2026 unless actual Cuddle Crew Pet Care demand data or an owner policy decision supports a change:

- Martin Luther King Jr. Day weekend;
- Presidents' Day weekend;
- Memorial Day weekend;
- Juneteenth weekend;
- Independence Day weekend;
- Labor Day weekend;
- Thanksgiving peak period;
- Christmas / New Year's peak period.

This is a **planning baseline only**. Exact dates must be deliberately approved for each year in `logic/36-holiday-peak-date-calendar.md` before the website, estimator, PPC configuration, or cancellation classification treats them as qualifying dates.

Do not automatically add Easter, Mother's Day, Father's Day, or other observances unless actual demand data or a new owner decision supports doing so.

## 19. Codex Guardrails

- Exact public rates come from `core/03-pricing-fees-surcharge-policy.md`.
- Cancellation/refund consequences come from `core/02-cancellation-booking-change-refund-policy.md`.
- Exact approved holiday dates come from `logic/36-holiday-peak-date-calendar.md`.
- Small-animal-only Overnight Care must return personalized review; $80 is an internal benchmark, not a public guaranteed rate.
- Extended/Far Extended Overnights must return personalized review; do not invent an automatic zone-based per-night travel fee.
- Large/complex-household triggers do not create automatic complexity surcharges; solve legitimate workload first through appropriate time/service structure.
- Ninety minutes is the maximum standard public daytime duration at launch; do not invent a public 2-hour rate.
- The 15-minute service is internal supplemental care only; do not publish it as a standalone client-requestable visit without a new owner decision.
- Do not make pricing depend on the order in which mixed-species pets are selected.
- Do not duplicate trip-based fees merely because a single continuous appointment is represented by multiple service line items.
- QuickBooks Estimates may be used for view-only presentation, but confirmed PPC booking/invoice/payment remains operationally controlling.
- Do not imply that a mathematical quote guarantees availability or acceptance.
- Do not expose private PPC or Client information on the public website.
- Use "Cuddle Crew Pet Care LLC" on first formal reference and "Cuddle Crew Pet Care" thereafter; do not shorten the legal/business-facing name to "Cuddle Crew" in client-facing or contractual material.
