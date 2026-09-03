# Pricing & Care Standards Manual

> Status: PLACEHOLDER
> Classification: INTERNAL REFERENCE
> Authority: NOT AUTHORITATIVE UNTIL POPULATED AND MARKED CURRENT / APPROVED
> Website use: Broad internal operational source of truth supporting pricing, service design, care standards, welfare requirements, booking decisions, edge cases, review triggers, and website consistency.

## Purpose

TODO: Add authoritative source content.

## Authoritative Content

TODO: Paste the approved/current version here.

## Website Implementation Notes

TODO: Record any website pages, components, estimator logic, booking logic, FAQ content, warnings, conditional UX, admin behavior, or Precise Petcare handoff behavior that should be derived from this document.

## Codex Guardrails

- Do not infer missing policies.
- Do not treat TODOs or placeholder text as business rules.
- Do not convert internal rules into public promises without explicit instruction.
- Do not expose private operational details merely because they appear in this file.
- Do not expose internal thresholds, risk logic, capacity calculations, or decline criteria publicly unless explicitly approved.
- If website behavior conflicts with this document after it is marked CURRENT / APPROVED, flag the conflict rather than changing the business rule to match existing code.
- Treat CURRENT / APPROVED authoritative content as the source of truth for topics covered by this file.
- Do not alter an authoritative business rule merely to make implementation easier.
- When internal logic requires review, prefer a client-facing result such as "Personalized review required" instead of exposing private internal reasoning.

# Pricing & Care Standards Manual

> Status: CURRENT / APPROVED
>
> Classification: INTERNAL REFERENCE
>
> Authority: CURRENT MASTER INTERNAL PRICING, CARE-PLANNING, SERVICE-DESIGN, WELFARE, SCOPE, BOOKING, EDGE-CASE, AND OPERATIONAL GUIDANCE REFERENCE
>
> Website use: Broad internal operational source of truth supporting pricing, service design, care standards, welfare requirements, booking decisions, edge cases, review triggers, and website consistency.
>
> Source version: Pricing & Care Standards Manual v15 FINAL — CONTENT FREEZE EDITION • September 2026

## Purpose

This document is the website-reference representation of Cuddle Crew Pet Care LLC’s current Pricing & Care Standards Manual.

The underlying master manual is intended to function as:

- a fast quoting tool;
- scenario book;
- care-planning guide;
- pricing reference;
- edge-case SOP;
- welfare framework;
- booking-decision aid;
- and internal operational reference.

Safety and Service scope come before price.

This file exists so website code, Codex, estimator logic, booking UX, internal admin tooling, and future automation can consistently understand the major rules contained in the master manual without treating public website copy as the business-policy source of truth.

This document does not replace:

- signed Client agreements;
- Client-facing policies;
- Emergency Veterinary Authorization;
- Medication Administration Consent;
- access/security agreements;
- or Client-specific records in Precise Petcare.

## Authority and Conflict Rule

This manual is authoritative for internal operational guidance unless a more specific CURRENT / APPROVED source controls the subject.

Use the following hierarchy.

### Client-Specific Instructions

Precise Petcare is the operational source of truth for current Client-specific:

- pet profiles;
- care instructions;
- access details;
- schedules;
- approved Service plans;
- and current booking information.

Client-specific instructions may control over generic examples in this manual only when those instructions are:

- safe;
- lawful;
- within current training;
- within insurance scope;
- within Service scope;
- and consistent with the signed Client agreement.

### Signed Client Agreement vs. Internal Manual

Where a CURRENT / APPROVED signed or Client-facing agreement conflicts with this internal manual:

**The Client-facing agreement or policy controls the contractual subject.**

Use this manual as the internal SOP and decision guide.

### Safety / Welfare Conflict

If a Client instruction conflicts with:

- safety;
- animal welfare;
- law;
- insurance;
- or approved Service scope,

do not blindly follow the instruction.

Modify, escalate, review, refer, or decline as appropriate.

### Actual Household vs. Generic Scenario

Generic examples do not override actual household facts.

If an actual booking is materially more complex than a scenario in this manual:

**Use personalized review rather than forcing the booking into the example.**

---

# Authoritative Content

## 1. Core Decision Principle

Use the following order when evaluating a booking:

1. **Safety** — Can Cuddle Crew safely provide the care?
2. **Scope** — Is the care within current training, Service, and insurance scope?
3. **Welfare** — Is the total care frequency adequate?
4. **Time** — How long does the complete routine actually require?
5. **Base Service** — Select the appropriate Service and duration.
6. **Pets** — Apply approved additional-pet pricing if the routine still fits.
7. **Travel** — Apply the appropriate travel rule or review.
8. **Holiday** — Apply the qualifying approved holiday modifier where applicable.
9. **Timing** — Apply approved short-notice or same-day treatment where applicable.
10. **Direct Costs** — Add only authorized/documented unusual pass-through expenses.
11. **Complexity** — If the request remains unusual, review before confirming.
12. **Confirmation** — Confirm scope, price, schedule, and applicable policies.

### Final Internal Rule

Do not invent miscellaneous fees simply because a situation is inconvenient.

Use the following structure:

- **More time → sell more appropriate Service time**
- **More pets → use approved additional-pet structure if the care still fits**
- **More travel → use approved travel structure**
- **Holiday / short notice → use approved modifiers**
- **More risk / scope uncertainty / complexity → personalized review**

Risk does not become acceptable because a higher price can be calculated.

---

# 2. Current Standard Service Menu

## Daytime Drop-In Care

| Service | Dog | Cat | Small Animal |
| --- | ---: | ---: | ---: |
| 30-Minute Drop-In | $30 | $28 | $28 |
| 60-Minute Drop-In | $48 | $45 | $45 |
| 90-Minute Extended Care | $66 | $62 | $62 |

## Dog Walking

| Service | Rate |
| --- | ---: |
| 30-Minute Dog Walk | $32 |
| 60-Minute Dog Walk | $50 |
| 90-Minute Adventure Walk | $68 |

## Overnight Care

| Household | Base Rate |
| --- | ---: |
| Dog household | $85/night |
| Cat-only household | $80/night |
| Small-animal-only household | Personalized review |

Standard Overnight Care generally covers approximately:

**6:00 PM–8:00 AM**

It is not continuous 24-hour care.

## Standard Midday Care During Overnight

The standard midday add-on is **one separate 30-minute daytime care visit**.

Current standard pricing:

| Household | Standard 30-Minute Midday |
| --- | ---: |
| Dog | +$25 |
| Cat | +$23 |
| Small animal | +$23 where appropriate / review |

Longer midday care uses the normal daytime Service rate:

- 60-minute midday → normal applicable 60-minute rate
- 90-minute midday → normal applicable 90-minute rate
- midday Dog Walk → appropriate Dog Walk rate

Do not treat the standard midday add-on as:

- unlimited daytime care;
- continuous daytime presence;
- or a bundled block of unspecified care.

---

# 3. Public Daytime Duration Ladder

Use:

**30 minutes → 60 minutes → 90 minutes → personalized/custom care**

Ninety minutes is the maximum standard public daytime duration at launch.

Do not publicly create a standard 2-hour daytime Service merely because a routine exceeds 90 minutes.

Where even 90 minutes may not fit:

**Personalized review required.**

---

# 4. Additional-Pet Pricing

Current approved additional-pet structure:

- Additional dog: **+$10**
- Additional cat: **+$5**
- Additional small animal: **+$5 where appropriate**

These charges apply:

- per qualifying daytime Service;
- and again per Overnight where applicable.

Additional-pet pricing applies only where the complete routine still fits the selected Service.

An additional-pet fee does not create unlimited care time.

If more time is genuinely required:

- recommend longer care;
- recommend additional Services;
- or use personalized review.

## Grouped-Animal Exception

Do not mechanically charge every individual animal in:

- aquariums;
- colonies;
- flocks;
- communal enclosures;
- or similar grouped-animal setups.

Review the actual husbandry workload.

---

# 5. Travel Structure

Travel classification is based on **typical or ordinary one-way travel time under normal driving conditions**, not live temporary traffic.

| Zone | Typical One-Way Travel | Daytime | Overnight |
| --- | --- | --- | --- |
| Core | 0–10 min | Included | Base rate |
| Standard | >10–20 min | Included | Base rate |
| Extended | >20–30 min | +$10/visit | Personalized review |
| Far Extended | >30–45 min | +$20/visit | Personalized review |
| Beyond | >45 min | Review / usually decline | Review / usually decline |

## Travel Principles

Temporary conditions such as:

- a crash;
- temporary construction;
- unusual congestion;
- special event traffic;
- or one bad route day

do not ordinarily change an established travel zone.

Actual route conditions may still affect scheduling capacity.

Travel fees address the economics of additional travel.

They do **not** create calendar capacity.

Do not accept a distant booking merely because a travel surcharge can mathematically be applied.

---

# 6. Holiday Pricing

Current approved modifier amounts:

- Holiday daytime: **+$15 per qualifying visit**
- Holiday Overnight: **+$30 per qualifying night**

The exact qualifying dates/periods are controlled by the CURRENT / APPROVED Holiday / Peak-Date Calendar.

Until that calendar is populated and approved, do not invent holiday periods.

Holiday pricing does not create capacity.

---

# 7. Short-Notice Pricing

## Daytime

### Less Than 24 Hours but Not Same-Day

**+$10 per visit**

Subject to availability.

### Same-Calendar-Day

**+$20 per visit**

This replaces the +$10 short-notice fee.

Do not stack both.

## Overnight

Request made less than 48 hours before the Overnight:

**+$25 per night**

Subject to availability.

## Timing Principle

A short-notice or same-day fee compensates for scheduling disruption.

It does not guarantee availability.

---

# 8. Complimentary Meet & Greet

The initial Meet & Greet is:

- complimentary;
- generally approximately 30 minutes;
- and ordinarily includes normal initial key/access exchange where appropriate.

A Client who repeatedly misses or reschedules onboarding without reasonable notice is not entitled to unlimited complimentary rebooking.

Future onboarding appointments remain subject to availability.

---

# 9. Care-Frequency Standards

Care frequency is a welfare decision before it is a pricing decision.

Do not accept an inadequate schedule merely because the Client requests the cheapest option.

## Healthy Adult Dogs

When an owner is completely away:

**approximately three care opportunities per day is a useful starting point**

Then individualize based on:

- normal routine;
- potty tolerance;
- meals;
- water;
- exercise;
- anxiety;
- health;
- medication;
- and safe-alone tolerance.

## Puppies

Individual review.

Often require more than three daily care opportunities depending on:

- age;
- meals;
- housetraining;
- safe-alone tolerance;
- and developmental needs.

## Senior Dogs

Often require three or more care opportunities per day depending on:

- mobility;
- continence;
- medication;
- comfort;
- and health.

## Healthy Adult Cats

Generally:

**at least daily in-person care**

Often 1–2 visits per day depending on:

- feeding;
- social needs;
- litter;
- medication;
- routine;
- and health.

Every-other-day care should not be the default vacation-care plan merely because food/water can be provisioned.

## Kittens

Individual review.

Often require more than one daily check depending on:

- age;
- feeding;
- monitoring;
- and social needs.

## Rabbits

Generally:

**at least daily**

Often 1–2 visits per day depending on:

- hay/fresh food;
- water;
- stool/appetite;
- enclosure;
- medication;
- and other health needs.

## Guinea Pigs

Generally:

**at least daily**

Sometimes 1–2 visits per day depending on:

- hay/fresh food;
- water;
- enclosure;
- group needs;
- and health.

## Other Small Mammals

Generally require a daily in-person check.

## Birds / Reptiles / Fish / Exotics

Personalized review.

Consider:

- species-specific husbandry;
- current competence;
- insurance;
- Service scope;
- environmental needs;
- feeding;
- enclosure;
- and emergency considerations.

## Medical / Time-Critical Cases

Personalized review.

Consider:

- medication timing;
- health;
- training;
- Service scope;
- insurance;
- and availability.

---

# 10. Care Frequency Is Not Feeding Frequency

Do not confuse:

**meal frequency**

with:

**required in-person welfare frequency.**

Devices such as:

- automatic feeders;
- fountains;
- cameras;
- self-cleaning litter boxes

may support the care plan.

They do not automatically replace appropriate in-person welfare checks.

Consider:

- the animal;
- water;
- elimination;
- behavior;
- equipment failure;
- home conditions;
- medication;
- and total time without a responsible person.

---

# 11. Choosing the Correct Service Duration

## 30 Minutes

Usually appropriate where the complete routine comfortably includes:

- feeding/water;
- potty or litter/enclosure spot care;
- straightforward medication;
- brief enrichment;
- and journal documentation.

## 60 Minutes

Often appropriate for:

- multiple pets/enclosures;
- longer walks;
- more enrichment;
- slower senior care;
- complex food preparation;
- several care tasks;
- or routine cleanup requiring additional time.

## 90 Minutes

Appropriate for:

- extended routines;
- longer companionship/enrichment;
- multiple pets/enclosures;
- slower or more involved care;
- or a walk plus additional home-care tasks genuinely requiring the extra time.

## Overnight

Appropriate when evening-through-morning presence is beneficial or required.

Overnight includes the agreed overnight routine.

It does not include unlimited daytime care.

## Overnight + Midday

Appropriate where the pet/household benefits from:

- Overnight presence;
- plus a separate daytime welfare/potty/care appointment.

## Personalized Review

Use when even 90 minutes may not fit because of:

- behavior;
- medical care;
- separation;
- unusual species;
- continuous-care expectations;
- or materially complex household scope.

---

# 12. Booking Acceptance Checklist

Before confirming a booking, verify:

- [ ] Can Cuddle Crew safely provide the care?
- [ ] Is the care within current training, Service, and insurance scope?
- [ ] Is the requested care frequency adequate?
- [ ] Does the requested duration realistically fit?
- [ ] Are all pets/species disclosed and profiled?
- [ ] Are behavior needs workable?
- [ ] Are medication needs workable?
- [ ] Are separation requirements workable?
- [ ] Is access workable?
- [ ] Is the travel zone economically and operationally workable?
- [ ] Is route/time-block capacity available?
- [ ] Are holiday or short-notice rules triggered?
- [ ] Has final scope and price been confirmed?
- [ ] Has Meet & Greet/onboarding been completed unless a rare exception was personally approved?
- [ ] Are Client intake and pet profiles complete?
- [ ] Is veterinary/emergency information complete?
- [ ] Are required authorizations complete?
- [ ] Has access been tested?
- [ ] Are required agreements accepted?
- [ ] Are payment requirements satisfied?
- [ ] Has backup-provider authorization or decline been recorded where applicable?

A calculable price does not equal booking acceptance.

---

# 13. Stop & Review Triggers

Do not automatically quote or accept when any of the following apply:

- 4+ dogs
- 5+ total pets
- 3+ materially distinct care types/routines
- advanced/high-risk medication
- exact-time care
- significant behavior/safety concern
- complex predator/prey separation
- unusual species
- continuous care
- pet transportation
- >45-minute typical one-way travel
- complex/extended-area Overnight
- routine that may not fit within 90 minutes

These are **review triggers**, not automatic decline rules.

Preferred public-facing result:

**Personalized review required**

---

# 14. Definition of a Care Type

A care type is a materially different care routine requiring distinct:

- handling;
- enclosure;
- medical;
- or safety planning.

Species count and care-type count are not necessarily the same.

Examples:

- two species may share one simple care routine;
- two pets of the same species may have materially different routines and create separate care types.

Do not infer care-type count solely from species count.

---

# 15. Personalized Quote / Review

A personalized quote or review is required when a booking should not be priced automatically because:

- time;
- risk;
- scope;
- welfare;
- travel;
- or complexity

may alter the correct Service plan.

The correct question is not:

**“Can the website calculate a number?”**

The correct question is:

**“Is the Service scope sufficiently clear and appropriate to quote automatically?”**

---

# 16. Service Windows

Routine daytime arrival windows are generally:

- 9 AM–12 PM
- 12 PM–3 PM
- 3 PM–6 PM
- 6 PM–9 PM

These are arrival ranges.

They are not exact-minute guarantees.

Arrival may vary due to:

- traffic;
- route order;
- prior pet needs;
- emergencies;
- or safety conditions.

Exact-time care requires prior review.

Do not overpromise an exact arrival merely to win a booking.

---

# 17. Booked Duration

Booked duration means reserved hands-on Service time for the Client.

It includes any booked walk.

Ordinary travel between appointments is not deducted from the Client’s booked care time.

Documentation should not materially shorten the promised care duration.

---

# 18. Capacity

Use:

**CARE TIME + DRIVE TIME + JOURNAL / ADMIN + REALISTIC BUFFER = TRUE APPOINTMENT LOAD**

Do not determine capacity based only on the number of visible appointments.

Protect enough time for:

- travel;
- Client access;
- documentation;
- traffic;
- pet needs;
- emergencies;
- and realistic transition buffer.

When a Service window is operationally full:

**mark it unavailable**

rather than:

- compressing care;
- eliminating realistic buffer;
- or promising unrealistic arrival timing.

---

# 19. Common 3-Hour Window Patterns

## One 90-Minute Appointment

Often workable.

Approximately half the window remains for travel/admin/buffer.

## Two 90-Minute Appointments

Generally not workable in one 3-hour window.

## One 60-Minute + One 30-Minute Appointment

Often workable if geographically compatible.

## Two 60-Minute Appointments

Possible only with efficient routing and adequate buffer.

## Three 30-Minute Appointments

May fit with dense routing.

Calculate the actual route.

## Extended / Far Extended Client

Travel consumes true capacity even when a surcharge addresses the economics.

---

# 20. Standard Service Scope

## Usually Included When Agreed and Time Allows

Examples include:

- feeding and fresh water;
- booked potty break / Dog Walk;
- litter box or normal enclosure spot-care;
- routine agreed oral/topical medication where within scope;
- reasonable pet-related mess cleanup;
- normal enrichment/companionship;
- security check;
- agreed lights/blinds/mail tasks;
- visit journal and agreed updates;
- a small number of simple plant-care tasks where arranged;
- bringing in ordinary mail/packages where reasonable.

## Usually Not Included / Requires Review

Examples include:

- general house cleaning;
- extensive gardening/yardwork;
- pool care;
- maintenance;
- deep enclosure cleaning beyond routine scope;
- advanced medical procedures;
- forceful restraint;
- high-risk treatment;
- large-scale cleanup unrelated to routine pet accidents;
- continuous supervision / 24-hour presence;
- meeting contractors;
- errands;
- shopping;
- household management unless specifically quoted;
- pet transportation unless insurance/authorization explicitly permits;
- extensive plant-collection care;
- moving heavy/large deliveries;
- handling unsafe packages.

---

# 21. Medication Principles

Routine oral/topical medication may be included when:

- agreed;
- within current training/scope;
- safely administrable;
- and it fits within the booked Service.

Personalized review is required for cases such as:

- injections;
- exact-time medication;
- high-risk consequences;
- forceful restraint;
- advanced procedures;
- complex medication routines;
- or significant handling difficulty.

Do not create an arbitrary medication-risk fee.

Use:

**more time → more Service time**

and:

**more risk/scope → review whether the care should be provided at all**

Do not repeatedly escalate unsafe restraint.

Use the CURRENT / APPROVED Medication Scope Review for individual decisions.

---

# 22. Behavior Principles

Behavior/safety concerns require individualized evaluation.

Relevant considerations include:

- bite/snap history;
- resource guarding;
- leash control/reactivity;
- escape risk;
- handling sensitivity;
- pet-to-pet separation;
- predator/prey management;
- and unsafe person/property conditions.

A dog that cannot safely be leashed should not be forced into a walk.

Medication should not be forced through escalating unsafe restraint.

If safety cannot reasonably be assured:

- modify;
- refer;
- or decline.

Do not solve behavior risk through an arbitrary surcharge.

Use the CURRENT / APPROVED Behavior Risk Review.

---

# 23. Shared Care

Shared care means another identified responsible person/provider is also supplying part of the pet-care schedule.

Potentially acceptable arrangements require:

- clear caregiver identity;
- clear duties;
- clear timing;
- adequate total care coverage;
- workable access;
- communication;
- and emergency planning.

A person who “might stop by” is not a defined care plan.

Do not count unreliable or vague third-party care toward required welfare coverage.

If another caregiver fails to show:

- contact the Client/emergency contact;
- do not silently assume unlimited extra duties.

Use the CURRENT / APPROVED Shared-Care Coordination reference.

---

# 24. Overnight Principles

Standard Overnight Care generally means:

**approximately 6 PM–8 AM**

It is not:

- continuous 24-hour presence;
- unlimited daytime care;
- or automatic midday coverage.

Daytime needs must be identified separately.

Review:

- sleeping arrangements;
- bathroom/water/electricity/HVAC;
- occupants/visitors;
- cameras/privacy;
- parking;
- after-dark access;
- communication;
- home emergency contact;
- behavior;
- medication;
- escape risk;
- travel;
- route;
- and schedule.

Overnight outside the Standard travel zone requires personalized review.

Do not automatically apply daytime Extended/Far Extended travel surcharges to Overnight Care.

---

# 25. Long Stays

Seven or more consecutive Overnights trigger internal capacity/sustainability review.

Long stay does **not** automatically mean:

- a discount;
- or a surcharge.

Review:

- dates;
- personal/work/school calendar;
- midday/daytime care;
- supplies;
- medication;
- home-task scope;
- route;
- other Clients;
- emergency contacts;
- backup;
- Client availability/time zone;
- and medical/behavior sustainability.

Use the CURRENT / APPROVED Long-Stay Review.

---

# 26. Adventure Walks

A 90-Minute Adventure Walk requires suitability review.

Consider:

- normal conditioning;
- age/life stage;
- mobility/injury/recovery;
- respiratory or heat considerations;
- behavior/leash control;
- paw condition;
- weather;
- surfaces;
- shade/rest/water;
- and the dog’s established normal activity.

It is time-based.

It is not a mileage guarantee.

Cuddle Crew does not prescribe exercise.

Outdoor time may be modified for safety.

---

# 27. Weather / Heat / Air Quality

Safety overrides the originally requested outdoor activity.

Where conditions make the planned activity unsafe:

- shorten;
- modify;
- substitute safer enrichment/potty care;
- or discontinue the outdoor portion as appropriate.

Do not promise a specific outdoor duration regardless of:

- temperature;
- air quality;
- storms;
- smoke;
- surface conditions;
- or other safety concerns.

Weather modification should prioritize animal and sitter safety.

---

# 28. Pet Transportation

Pet transportation is **not automatically offered**.

Do not offer transportation until:

- applicable insurance coverage is confirmed;
- authorization is appropriate;
- business scope is approved;
- and relevant safety/policy requirements are established.

Current default:

**Personalized review / do not offer unless coverage explicitly supports it.**

---

# 29. Continuous / 24-Hour Care

Continuous or 24-hour presence is not a standard launch Service.

Do not automatically quote it.

Review / likely unavailable.

Do not misrepresent standard Overnight Care as continuous care.

---

# 30. Pricing Integrity

Do not create unnecessary surprise fees.

Ordinary:

- card processing;
- standard business overhead;
- software;
- insurance;
- licensing;
- routine administrative costs

should be reflected in normal pricing rather than added as surprise routine checkout charges unless policy is intentionally changed later.

Use clean, understandable pricing.

Custom quotes should generally use whole-dollar amounts where practical.

Do not add retroactive surprise fees after Service unless:

- additional work/cost was authorized;
- or the charge was clearly governed by an accepted agreement/policy.

Document meaningful:

- waivers;
- custom pricing;
- courtesy exceptions;
- and material exceptions.

Use discretion based on legitimate factors such as:

- time;
- travel;
- scope;
- schedule;
- welfare;
- access;
- insurance;
- and complexity.

Do not base discretion on protected characteristics.

---

# 31. Discounts

No automatic launch discount for:

- multi-day bookings;
- weekly bookings;
- repeat Clients;
- seniors;
- students;
- packages;
- long stays;
- friends/family.

Intentional courtesy exceptions may be approved and documented.

No automatic route/neighborhood discount at launch.

A future incentive should be supported by real operating data.

Do not promise lifetime grandfathered rates.

---

# 32. Rate Review

Review rates approximately six months after launch and then at least annually.

Consider:

- actual door-to-door time;
- drive time;
- route density;
- journal/admin;
- payment processing;
- overhead;
- vehicle/fuel burden;
- cancellations;
- unbooked gaps;
- demand;
- repeat bookings;
- work declined for capacity;
- Services routinely exceeding duration;
- effective labor compensation;
- profit;
- professional local-market pricing;
- travel zones;
- capacity rules.

Normal rate increases for existing Clients should receive reasonable notice.

---

# 33. Client Explanation Principle

Client-facing explanations should explain the reason behind policies without exposing unnecessary internal logic.

Use the CURRENT / APPROVED Client Explanation Library for approved explanations around:

- professional pricing;
- care frequency;
- additional pets;
- travel;
- holiday pricing;
- short notice;
- Overnight midday care;
- Service duration;
- small-animal pricing;
- and personalized review.

---

# 34. Referral Principle

Refer out when Client needs exceed:

- current training;
- insurance;
- Service scope;
- behavior capability;
- medical capability;
- species/husbandry competence;
- or operational capacity.

Potential referral categories include:

- veterinary technician sitter;
- veterinarian;
- trainer / behavior professional;
- exotic specialist;
- boarding/veterinary facility;
- groomer;
- or other appropriate professional.

Referral is preferable to providing care outside scope.

---

# 35. Decline Principle

Decline when the care plan remains:

- unsafe;
- outside scope;
- uninsurable;
- illegal;
- incompatible with welfare;
- or operationally unrealistic.

Examples may include:

- Client refuses a necessary safe care plan;
- severe handling risk cannot be mitigated;
- transportation is not covered;
- route/capacity is impossible;
- or required care remains outside competence.

Do not create a price for care that should not be provided.

---

# 36. Final Pre-Booking Stop Check

Before saying “yes,” confirm:

- **Safety?**
- **Scope?**
- **Adequate welfare frequency?**
- **Enough time?**
- **All pets disclosed?**
- **Behavior/medical needs workable?**
- **Access reliable?**
- **Travel/route workable?**
- **Capacity available?**
- **Correct modifiers?**
- **Written scope/price confirmed?**

If any answer is uncertain:

**review before confirming.**

---

# 37. Known Pending / Separate Decisions

The underlying v15 master identified certain subjects requiring separate verification or future decision.

Some have since been superseded by more current dedicated references.

## Exact Holiday Dates

Still pending until the Holiday / Peak-Date Calendar is populated and approved.

Do not infer dates.

## Client-Facing Cancellation Rules

Use the CURRENT / APPROVED Cancellation, Booking Change & Refund Policy.

Do not use older cancellation recommendations inside v15 when they conflict.

## Client-Facing Payment Rules

Use the CURRENT / APPROVED Pricing, Fees & Surcharge Policy and Master Service Agreement.

Do not use stale payment timing language from older manual sections when it conflicts.

## Pet Transportation

Pending coverage/scope verification.

Do not offer automatically.

## Advanced Medication Procedures

Pending by procedure.

Only offer what current training, insurance, and Service scope support.

## Overnight Outside Standard Zone

Personalized review.

Do not auto-price.

## Continuous / 24-Hour Care

Not a standard launch Service.

## Referral Reward

Not currently active unless a future approved policy activates one.

---

# 38. Policy Status

Where terminology from the source master is encountered:

- **FINAL** = intentionally adopted internal rule
- **RECOMMENDED LAUNCH** = working rule that may be superseded by newer approved Client-facing policy
- **PENDING** = requires future legal, insurance, platform, training, or owner decision

Within the GitHub business-reference framework:

- `CURRENT / APPROVED` dedicated references supersede stale recommendations on their specific subject;
- unresolved/PENDING subjects must not be inferred;
- signed Client-facing agreements control contractual obligations.

---

# 39. Version Control

Source master:

**v15 — September 2026 — CURRENT MASTER**

Major v15 changes included:

- standardized the review trigger at **3+ materially distinct care types/routines**;
- explicitly defined the standard Overnight midday add-on as **one 30-minute daytime care visit**;
- clarified that longer midday care uses normal longer daytime rates;
- added representative 90-minute vacation total examples.

Older versions are superseded.

Do not use old manual versions where v15 or a newer CURRENT / APPROVED dedicated reference exists.

---

## Website Implementation Notes

This document is a broad internal reference.

The website should derive specific behavior from the **most specific CURRENT / APPROVED authoritative document available**, rather than using this manual indiscriminately.

### Recommended Website Source Mapping

Use this manual for broad concepts such as:

- Service design;
- care standards;
- welfare philosophy;
- duration logic;
- general modifier framework;
- scope philosophy;
- review philosophy;
- and high-level operational consistency.

Use dedicated references for implementation details.

Examples:

**Pricing**
→ `core/03-pricing-fees-surcharge-policy.md`

**Cancellation**
→ `core/02-cancellation-booking-change-refund-policy.md`

**Booking acceptance**
→ `logic/18-booking-acceptance-risk-triage.md`

**Adventure Walk**
→ `logic/19-adventure-walk-suitability.md`

**Overnight**
→ `logic/20-overnight-acceptance.md`

**Long stays**
→ `logic/21-long-stay-review.md`

**Medication**
→ `logic/22-medication-scope-review.md`

**Behavior**
→ `logic/23-behavior-risk-review.md`

**Shared care**
→ `logic/24-shared-care-coordination.md`

**Custom quotes**
→ `logic/33-custom-quote-scope-review.md`

**Holiday dates**
→ `logic/36-holiday-peak-date-calendar.md`

**Capacity**
→ `logic/37-service-window-capacity-planner.md`

**Continuity**
→ `operations/38-continuity-backup-provider-plan.md`

**Training / scope**
→ `operations/40-training-certification-service-scope-matrix.md`

**Client-facing explanations**
→ `guidance/client-explanation-library.md`

### Central Pricing Configuration

Prefer one centralized pricing configuration for:

- base rates;
- additional-pet charges;
- travel tiers;
- holiday modifiers;
- short-notice modifiers;
- and standard durations.

Do not duplicate rate constants across:

- pricing page;
- estimator;
- FAQ;
- checkout;
- Service cards;
- API routes;
- and admin logic.

### Estimator

The estimator may calculate standard pricing only where scope is sufficiently clear.

It must preserve:

- review triggers;
- care-frequency standards;
- duration fit;
- travel rules;
- holiday rules;
- short-notice rules;
- and additional-pet conditions.

A numerical estimate does not equal booking acceptance.

### Welfare Logic

Never optimize the estimator for the cheapest possible care at the expense of approved welfare standards.

The system should not encourage:

- every-other-day cat vacation care;
- inadequate dog potty/care frequency;
- inadequate small-animal checks;
- or unrealistic Service duration

merely because the result is cheaper.

### Duration Suggestions

Website logic may recommend:

- 30 minutes;
- 60 minutes;
- 90 minutes;
- or personalized review.

Do not automatically create a 120-minute standard Service.

### Review UX

Where private review logic is triggered, prefer:

**Personalized review required**

Do not expose:

- exact internal thresholds;
- risk scores;
- decline rubrics;
- capacity calculations;
- insurance analysis;
- or private routing reasoning.

### Public vs. Private Rules

Separate:

**Public Service information**
from
**internal acceptance logic.**

It is acceptable for the website to publicly show a Service while still requiring internal booking review for a particular Client.

### Precise Petcare

Precise Petcare remains the operational source of truth for Client-specific:

- pets;
- care instructions;
- access;
- schedule;
- and approved Service plan.

Do not build a competing authoritative Client-record system unless the architecture is intentionally changed and approved.

### Routing / Travel

Any routing implementation should protect:

- private service-area origin;
- Client addresses;
- other Client routes;
- API keys;
- and internal capacity information.

Keep routing secrets server-side.

### Policy Conflicts

If website logic conflicts with this manual:

1. determine whether a more specific CURRENT / APPROVED dedicated reference exists;
2. use the more specific authoritative reference;
3. flag the conflict;
4. do not silently change the business rule to fit existing code.

### Old Manual Content

The source v15 contains some historical or `RECOMMENDED LAUNCH` contractual recommendations that have since been superseded by newer CURRENT / APPROVED policy decisions.

Do not reintroduce stale:

- cancellation timing;
- payment timing;
- holiday cancellation language;
- or other superseded Client-facing terms

merely because they appear elsewhere in the source manual.

### Content Freeze Meaning

“FINAL — CONTENT FREEZE” means v15 is the current consolidated internal master from that revision cycle.

It does not prevent:

- correction of conflicts;
- legal updates;
- insurance-driven changes;
- real-world operational changes;
- new approved Services;
- or replacement by newer CURRENT / APPROVED policy.

---

## Codex Guardrails

- Treat this document as the current broad internal Pricing & Care Standards Manual reference.
- Do not treat it as a substitute for the signed Client agreement.
- Do not let this document override a more specific CURRENT / APPROVED Client-facing policy on its subject.
- Do not use stale cancellation recommendations from the underlying manual when the CURRENT / APPROVED Cancellation Policy differs.
- Do not use stale payment timing from the underlying manual when CURRENT / APPROVED Client-facing policy differs.
- Do not infer exact holiday dates.
- Do not offer pet transportation without verified coverage and approved scope.
- Do not infer advanced medication capability.
- Do not infer training or insurance status.
- Do not auto-price continuous / 24-hour care.
- Do not auto-price Overnight Care outside approved standard scope.
- Do not auto-quote when a stop/review trigger applies.
- Do not turn review triggers into automatic declines.
- Do not solve safety or scope problems with surcharges.
- Do not invent miscellaneous inconvenience fees.
- Do not create a generic behavior fee.
- Do not create a generic medical-risk fee.
- Do not create an unusual-species fee merely because a species is unfamiliar.
- Do not create a >45-minute automatic travel surcharge.
- Do not create a standard 2-hour daytime Service.
- Do not deduct ordinary travel from booked Client care time.
- Do not let documentation materially shorten promised care.
- Do not assume an additional-pet fee means the routine fits.
- Do not assume a travel fee means capacity exists.
- Do not assume a holiday or short-notice fee means availability exists.
- Do not recommend inadequate care simply because it is cheaper.
- Do not count an automatic feeder/camera/fountain as a full replacement for appropriate in-person welfare care.
- Do not treat approximately three daily dog care opportunities as a universal requirement for every dog.
- Do not treat daily adult-cat care as the exact same schedule for every cat.
- Do not expose internal route calculations.
- Do not expose private capacity calculations.
- Do not expose Client information.
- Do not expose the private service-area reference point.
- Do not expose API keys or server-side routing credentials.
- Do not expose internal risk ratings or decline reasoning publicly.
- Do not treat website copy as authoritative merely because it is public.
- Do not treat existing code as authority over CURRENT / APPROVED references.
- Do not treat software limitations as justification for changing policy.
- Do not duplicate Precise Petcare as a competing Client-specific source of truth.
- When internal review is required, prefer the Client-facing result "Personalized review required."
- If an actual household differs materially from a generic scenario, use the actual facts and personalized review.
- If Client instructions conflict with safety, welfare, law, insurance, or Service scope, do not blindly follow them.
- If another CURRENT / APPROVED reference materially conflicts with this document, flag the conflict and apply the document hierarchy rather than silently reconciling it.