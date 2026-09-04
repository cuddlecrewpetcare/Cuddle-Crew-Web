# Source of Truth & Document Hierarchy

> Status: CURRENT / APPROVED
>
> Classification: INTERNAL REFERENCE
>
> Authority: AUTHORITATIVE FOR SOURCE-OF-TRUTH, DOCUMENT-HIERARCHY, CONFLICT-RESOLUTION, AND IMPLEMENTATION-PRECEDENCE RULES COVERED BY THIS DOCUMENT
>
> Website use: Defines which source controls when policies, Precise Petcare records, website content, internal guidance, safety requirements, or Client-specific instructions differ.

## Purpose

This document defines the source-of-truth hierarchy for Cuddle Crew Pet Care LLC.

Its purpose is to establish which source controls when:

- Client-specific instructions differ from generic guidance;
- signed agreements differ from internal manuals;
- website content differs from approved policy;
- Precise Petcare records differ from old notes or messages;
- safety or welfare conflicts with Client instructions;
- insurance or Service scope conflicts with a requested task;
- multiple internal references appear inconsistent;
- or implementation code differs from CURRENT / APPROVED business rules.

This hierarchy prevents website code, software defaults, old documents, stale notes, or generic examples from silently overriding approved business decisions.

The governing principle is:

**Use the most specific, current, approved, applicable source — subject always to safety, welfare, law, insurance, and Service scope.**

---

# Authoritative Content

## 1. Fundamental Hierarchy

Use the following order when sources differ.

### Tier 1 — Safety, Welfare, Law, Insurance, and Service Scope

No lower-level source may require Cuddle Crew to perform care that is:

- unsafe;
- materially inadequate for animal welfare;
- unlawful;
- outside current insurance coverage;
- outside current training/competence;
- or outside approved Service scope.

These boundaries are not overridden by:

- Client preference;
- payment;
- website logic;
- confirmed pricing;
- software defaults;
- automation;
- prior informal practice;
- or generic documentation.

Where a conflict exists:

**stop and review rather than blindly following the lower-level instruction.**

### Tier 2 — Current Signed Client-Facing Agreements and Policies

CURRENT / APPROVED signed or Client-facing agreements control the contractual obligation on the subjects they govern.

Examples include:

- Master Service Agreement;
- Cancellation, Booking Change & Refund Policy;
- Pricing, Fees & Surcharge Policy;
- Access / Key / Home Security Agreement;
- Emergency Veterinary Authorization;
- Medication Administration Consent;
- Shared Care / Third-Party Care Agreement;
- Overnight Care Addendum;
- Behavior / Handling / Safety Agreement;
- Media consent;
- or another applicable accepted Client-facing document.

If an internal manual conflicts with a CURRENT / APPROVED Client-facing agreement on a contractual issue:

**the Client-facing agreement or policy controls that contractual subject.**

The internal reference should then be flagged for reconciliation.

### Tier 3 — Current Client-Specific Precise Petcare Records

Precise Petcare is the operational source of truth for current Client-specific:

- Client profiles;
- pet profiles;
- care instructions;
- medication instructions;
- access details;
- emergency contacts;
- Service dates;
- Service windows;
- approved Service plan;
- booking details;
- and other current operational records.

Current approved Precise Petcare information takes precedence over:

- old text messages;
- old email instructions;
- handwritten notes;
- outdated intake information;
- prior booking instructions;
- memory;
- or stale website form submissions.

This precedence applies only when the Client-specific instruction is:

- safe;
- lawful;
- within insurance;
- within training;
- within Service scope;
- and consistent with applicable signed agreements.

### Tier 4 — CURRENT / APPROVED Core Business References

CURRENT / APPROVED `core/` references define approved Client-facing policy and contractual business rules represented in the repository.

These should control website implementation for the subjects they govern.

Examples:

- pricing;
- cancellation;
- access;
- emergency authorization;
- medication consent;
- shared care;
- Overnight terms;
- behavior/safety;
- media consent;
- vacation-care approval.

Do not allow:

- old website copy;
- stale code;
- or a generic manual section

to override a more specific CURRENT / APPROVED core reference.

### Tier 5 — CURRENT / APPROVED Internal Logic References

CURRENT / APPROVED `logic/` references control internal decision workflows and review logic.

Examples include:

- booking acceptance;
- Adventure Walk suitability;
- Overnight acceptance;
- long-stay review;
- medication scope;
- behavior risk;
- shared-care coordination;
- custom quote/scope review;
- holiday calendar;
- Service-window/capacity planning.

These references may control whether:

- automation stops;
- human review is required;
- a Service must be modified;
- a booking may be accepted;
- or a request should be referred or declined.

Internal logic should not be exposed publicly unless specifically approved.

### Tier 6 — CURRENT / APPROVED Operations References

CURRENT / APPROVED `operations/` references govern internal business maintenance and continuity.

Examples include:

- Annual Business & Policy Audit;
- Continuity / Backup Provider Plan;
- Training / Certification / Service-Scope Matrix.

Operational references may constrain whether a Service or public claim remains valid.

For example:

if website content says a capability is offered but the Training / Certification / Service-Scope Matrix says insurance is not confirmed:

**the conflict requires review before the capability is offered.**

### Tier 7 — CURRENT / APPROVED Guidance References

CURRENT / APPROVED `guidance/` references provide broad internal interpretation and approved explanatory material.

Examples include:

- Pricing & Care Standards Manual;
- Client Explanation Library;
- this Source of Truth & Document Hierarchy.

Guidance supports implementation.

It should not override a more specific CURRENT / APPROVED core, logic, or operations reference on the same subject.

### Tier 8 — Website Code, Website Copy, Estimator Logic, and UI Behavior

Website implementation is subordinate to the approved business-reference system.

Existing website behavior is **not** authority merely because it already works or is deployed.

If website code conflicts with a CURRENT / APPROVED reference:

1. flag the conflict;
2. identify the controlling source;
3. preserve the business rule;
4. correct implementation when instructed.

Do not alter the approved business rule merely to make implementation easier.

### Tier 9 — Software Defaults and Platform Behavior

Defaults or limitations in software such as:

- Precise Petcare;
- payment processors;
- accounting software;
- phone systems;
- website frameworks;
- scheduling systems;
- form builders;
- or APIs

do not automatically become business policy.

If a platform cannot represent an approved rule exactly:

- document the limitation;
- use human review or an operational workaround;
- and preserve the approved business rule.

Do not rewrite policy solely to match software limitations.

### Tier 10 — Old Notes, Messages, Drafts, Examples, and Superseded Material

The following are not authoritative when a newer approved source exists:

- old texts;
- old emails;
- old chats;
- prior drafts;
- superseded manuals;
- stale screenshots;
- abandoned implementation notes;
- generic scenarios;
- old website copy;
- PLACEHOLDER files;
- DRAFT files;
- SUPERSEDED files.

Use them only as historical context where useful.

Do not implement them as current business rules.

---

# 2. Repository Status Rules

Each business-reference document must be interpreted according to its status.

## CURRENT / APPROVED

Authoritative for the subject covered by that document, subject to the hierarchy in this file.

May be used for:

- implementation;
- website behavior;
- internal decision logic;
- operational process;
- approved public copy where appropriate.

## PLACEHOLDER

Not authoritative.

May contain:

- structure;
- TODOs;
- expected future content;
- or implementation notes.

Do not treat it as a business rule.

## DRAFT

Not authoritative unless explicitly approved.

May be useful for review and development.

Do not use as production policy.

## SUPERSEDED

Historical only.

Do not use for current implementation when a newer source exists.

---

# 3. Specific vs. General Rule

When two CURRENT / APPROVED references both apply:

**the more specific reference controls the specific subject.**

Example:

The Pricing & Care Standards Manual may describe general pricing philosophy.

The Pricing, Fees & Surcharge Policy controls exact current rates and modifier rules.

Therefore:

**use the Pricing Policy for the exact rate.**

Another example:

The Pricing & Care Standards Manual may summarize medication principles.

The Medication Scope Review controls the detailed internal medication-review workflow.

Therefore:

**use the Medication Scope Review for the individual medication decision.**

---

# 4. Current vs. Older Rule

When two sources cover the same subject:

**the newer CURRENT / APPROVED rule controls over the older superseded or stale rule.**

Do not resurrect older business logic simply because:

- it appears in a long manual;
- it is still present in code;
- it appears in an old form;
- or it is easier to implement.

Example:

If older v15 cancellation recommendations conflict with the newer CURRENT / APPROVED Cancellation, Booking Change & Refund Policy:

**use the current Cancellation Policy.**

---

# 5. Client-Specific vs. Generic Rule

A current Client-specific instruction normally takes precedence over generic examples only when the instruction remains:

- safe;
- welfare-appropriate;
- lawful;
- insured;
- within competence;
- within Service scope;
- and consistent with signed agreements.

Example:

A generic care scenario might suggest one routine.

A particular Client’s approved Precise Petcare record may require another routine.

Use the Client-specific approved routine if it satisfies all applicable safety/scope requirements.

Do not force a Client into a generic scenario merely because the scenario appears in the manual.

---

# 6. Safety and Welfare Override

Safety and welfare may override:

- Client preference;
- generic instructions;
- website selection;
- price;
- previously expected activity;
- or Service description

when necessary.

Examples:

- unsafe heat may require a shortened walk;
- a dog that cannot safely be leashed should not be forced into a walk;
- medication should not be forced through escalating unsafe restraint;
- inadequate vacation-care frequency should not be accepted merely because the Client requests the cheapest option;
- an unsafe household situation may justify declining entry.

Where safety requires modification:

- protect the pet;
- protect the sitter;
- communicate appropriately;
- document;
- and review future care where necessary.

---

# 7. Insurance and Service-Scope Override

Do not perform a requested Service outside current:

- insurance coverage;
- competence;
- training;
- authorization;
- or approved business scope.

A Client cannot override this limitation through:

- written instruction;
- verbal instruction;
- waiver;
- payment;
- or willingness to accept risk.

Example:

If pet transportation is not currently confirmed as insured/approved:

**do not offer it simply because the Client requests it.**

---

# 8. Contract vs. Internal SOP

The internal manual and logic references help determine:

- how Cuddle Crew evaluates a case;
- whether review is required;
- what Service makes sense;
- and what internal safety process applies.

The signed Client-facing documents define the actual contractual obligations.

Do not use an internal SOP to silently change a Client-facing contractual rule.

If the internal SOP indicates the Client-facing document is outdated:

**flag the discrepancy and update the appropriate source through an approved process.**

---

# 9. Website vs. Business Rule

The website is an implementation layer.

It is not the ultimate source of truth.

If the website says:

- a wrong rate;
- wrong cancellation deadline;
- wrong travel rule;
- unsupported capability;
- stale credential;
- wrong Service duration;
- or incorrect holiday date,

the business rule is not changed merely because the website is public.

Correct the website to match the authoritative source.

---

# 10. Estimator vs. Final Booking

A website estimate is preliminary.

It must not override:

- human review;
- approved Service scope;
- a Precise Petcare quote;
- invoice;
- confirmed booking;
- or CURRENT / APPROVED policy.

A calculable estimate does not mean:

- capacity exists;
- the booking is accepted;
- the care plan is adequate;
- or final pricing is confirmed.

Where review logic applies:

**Personalized review required.**

---

# 11. Precise Petcare vs. Website Form

A public website form may collect preliminary information.

That information is not automatically authoritative after onboarding.

Final current Client-specific information should be reconciled into Precise Petcare.

If a website submission conflicts with the current approved Precise Petcare record:

- determine which information is actually current;
- clarify with the Client where material;
- update the approved operational record;
- do not silently maintain two conflicting systems.

The website should not become a competing permanent Client-care record.

---

# 12. Precise Petcare vs. Old Message

If a current Precise Petcare instruction differs from an older:

- email;
- SMS;
- voicemail;
- handwritten note;
- or chat message,

use the current approved Precise Petcare record unless there is reason to believe it is outdated or incorrect.

If the difference could materially affect:

- safety;
- medication;
- access;
- care frequency;
- or another important task,

clarify before proceeding.

---

# 13. Generic Scenario vs. Actual Complexity

Scenario tables and examples are decision aids.

They do not force a particular outcome.

If an actual household involves:

- unusual pet count;
- different care types;
- complex medication;
- behavior concerns;
- separation;
- unusual species;
- travel;
- or another material factor,

use the actual household facts.

Do not distort the real case to fit a standard example.

---

# 14. Cross-Document Conflict Process

If two CURRENT / APPROVED references appear to conflict:

1. identify the exact conflicting statements;
2. identify each document’s classification;
3. determine whether one is more specific;
4. determine whether one is newer;
5. determine whether one is Client-facing contractual language;
6. apply safety/welfare/insurance/scope constraints;
7. determine the controlling source;
8. flag the inconsistency;
9. update the non-controlling source through an approved change.

Do not silently reconcile the wording by inventing a hybrid rule.

---

# 15. Unclear Authority

If the controlling source cannot be determined confidently:

**stop and require human review.**

Do not guess.

Use an internal status such as:

- `CONFLICT — REVIEW REQUIRED`
- `AUTHORITY UNCLEAR`
- `POLICY DECISION REQUIRED`

Client-facing output should normally remain neutral.

Example:

**Personalized review required**

rather than exposing an internal document conflict.

---

# 16. PLACEHOLDER Dependencies

If implementation depends on a file that remains `PLACEHOLDER`:

do not treat its incomplete fields as current policy.

Examples currently include areas such as:

- exact holiday dates until approved;
- unresolved credential/insurance rows until populated.

Where needed:

**flag the missing decision rather than inventing it.**

---

# 17. Training / Certification / Service-Scope Conflict

If another source or website claim says Cuddle Crew offers a Service but the Training / Certification / Service-Scope Matrix says:

- `OUT OF SCOPE`;
- `PENDING INSURANCE VERIFICATION`;
- `PENDING TRAINING / COMPETENCY VERIFICATION`;
- or otherwise not approved,

the Service must not be offered until the conflict is resolved.

Safety and verified scope control.

---

# 18. Holiday Calendar Conflict

Exact holiday dates come from the CURRENT / APPROVED Holiday / Peak-Date Calendar.

Do not derive qualifying holiday dates from:

- a general Pricing Policy;
- federal holiday calendars;
- website hardcoding;
- third-party libraries;
- or assumptions.

The Pricing Policy controls the amount.

The Holiday Calendar controls the qualifying period.

---

# 19. Pricing Conflict

For current exact pricing:

use the CURRENT / APPROVED Pricing, Fees & Surcharge Policy.

The Pricing & Care Standards Manual may provide:

- context;
- scenarios;
- philosophy;
- and operational guidance.

It should not override a newer exact rate or modifier rule in the Pricing Policy.

---

# 20. Cancellation Conflict

For current cancellation/refund rules:

use the CURRENT / APPROVED Cancellation, Booking Change & Refund Policy.

Do not restore an older recommended cancellation table from a prior internal manual where it conflicts.

---

# 21. Payment Conflict

For current Client payment requirements:

use the applicable CURRENT / APPROVED:

- Master Service Agreement;
- Pricing, Fees & Surcharge Policy;
- booking-specific quote/invoice;
- and confirmed Precise Petcare booking record.

Do not allow old payment timing from an internal manual or software default to override current approved Client-facing policy.

---

# 22. Medication Conflict

For Client-specific medication instructions:

use current approved Precise Petcare instructions, subject to:

- Medication Administration Consent;
- Medication Scope Review;
- safety;
- training;
- insurance;
- and Service scope.

A Client instruction cannot require unsafe or out-of-scope administration.

---

# 23. Behavior Conflict

For behavior/safety:

use:

- current Client disclosures/instructions;
- Behavior Risk Review;
- applicable Client-facing safety agreement;
- and actual observed behavior.

Current observed safety conditions may require modification even if older records described the pet as easy to handle.

---

# 24. Shared-Care Conflict

For shared care:

use the CURRENT / APPROVED Shared-Care Coordination logic and applicable Client-facing agreement.

Do not count vague or uncertain third-party care merely because an older Client note implied someone might help.

---

# 25. Capacity Conflict

A website calendar showing an open slot does not override the Service Window / Capacity Planner.

True capacity includes:

- care time;
- travel;
- journal/admin;
- realistic buffer;
- route position;
- and existing commitments.

If automation says “available” but actual route capacity is not safe or reliable:

**capacity review controls.**

---

# 26. Public Claim Conflict

A public claim must be supported by an authoritative current source.

Examples:

- certification;
- insurance;
- membership;
- Service capability;
- transportation;
- medical care;
- species expertise;
- service area;
- price.

If proof or current status is missing:

do not publish or continue the claim.

---

# 27. Most-Specific Reference Map

Use the following general routing.

## Contract / Client Policy

Use `core/`.

## Booking Decision

Use `logic/18-booking-acceptance-risk-triage.md`.

## Adventure Walk

Use `logic/19-adventure-walk-suitability.md`.

## Overnight

Use `logic/20-overnight-acceptance.md`.

## Long Stay

Use `logic/21-long-stay-review.md`.

## Medication Scope

Use `logic/22-medication-scope-review.md`.

## Behavior

Use `logic/23-behavior-risk-review.md`.

## Shared Care

Use `logic/24-shared-care-coordination.md`.

## Custom Quote

Use `logic/33-custom-quote-scope-review.md`.

## Holiday Dates

Use `logic/36-holiday-peak-date-calendar.md`.

## Capacity

Use `logic/37-service-window-capacity-planner.md`.

## Continuity

Use `operations/38-continuity-backup-provider-plan.md`.

## Training / Certification / Scope

Use `operations/40-training-certification-service-scope-matrix.md`.

## General Internal Pricing/Care Guidance

Use `guidance/pricing-care-standards-manual.md`.

## Approved Client-Friendly Explanation

Use `guidance/client-explanation-library.md`.

## SMS Communications / Consent / A2P Compliance

Use `guidance/sms-communications-consent-compliance.md` for SMS consent, approved website disclosure, consent records, STOP and HELP handling, service-related messaging scope, marketing-SMS restrictions, mobile-information privacy, and scanner-readable website requirements.

This SMS reference is the most specific `CURRENT / APPROVED` internal implementation reference for those subjects. It does not override higher-authority signed contractual or legal requirements where applicable.

## Hierarchy / Conflict

Use this document.

---

# 28. Final Hierarchy Principle

When sources differ, ask:

1. **Is the requested action safe and welfare-appropriate?**
2. **Is it lawful and within current insurance/training/Service scope?**
3. **Is there a current signed Client-facing document controlling the issue?**
4. **Is there a current approved Client-specific Precise Petcare record?**
5. **Is there a more specific CURRENT / APPROVED business-reference file?**
6. **Is another source older, generic, draft, placeholder, superseded, or merely implementation?**

Then use the most specific current applicable source.

When uncertainty remains:

**review rather than guess.**

---

## Website Implementation Notes

This document should govern how Codex resolves conflicting business information across the repository and website.

### Conflict Detection

Codex should flag cases such as:

- website rate differs from Pricing Policy;
- cancellation FAQ differs from Cancellation Policy;
- Precise Petcare Service differs from approved Service scope;
- website advertises transportation while coverage is unresolved;
- FAQ claims a credential not verified in the Training Matrix;
- holiday dates are hardcoded despite Holiday Calendar remaining unresolved;
- estimator auto-quotes a Custom Quote review case;
- calendar displays availability that conflicts with capacity rules.
- phone-number collection or website submission is treated as SMS consent;
- SMS disclosure differs from the canonical SMS reference;
- opt-out, HELP, privacy, or marketing-SMS behavior conflicts with the canonical SMS reference.

### Preferred Conflict Output

For internal reports, identify:

- affected file/component;
- conflicting source;
- controlling source;
- recommended correction.

Do not silently edit authoritative policy simply because the implementation is inconsistent.

### Authority Metadata

Where useful, internal code/configuration may maintain metadata such as:

- source document;
- status;
- effective date;
- last verified;
- category;
- public/private classification.

Do not expose internal governance metadata publicly unless useful and approved.

### Centralized Rule Sources

Prefer centralized implementation for frequently reused facts.

Examples:

- pricing;
- modifiers;
- holiday dates;
- Service windows;
- review triggers.

Avoid multiple independent copies that can drift.

### Client-Specific Data

Do not copy sensitive Precise Petcare data into public frontend code merely to make website logic easier.

Keep Client-specific operational data protected.

### Public Website

The public site should present the approved business result.

It does not need to expose:

- why one internal document outranked another;
- internal risk logic;
- conflict-resolution steps;
- document status;
- or implementation hierarchy.

### Review UX

If authority is unresolved during a Client request:

use neutral Client-facing messaging such as:

**Personalized review required**

or:

**We need to confirm a few details before finalizing this request.**

Do not expose internal policy conflicts.

### Codex Repository Behavior

When modifying website code:

1. identify the governing business-reference document;
2. confirm it is `CURRENT / APPROVED`;
3. prefer the most specific reference;
4. preserve more restrictive safety/scope constraints;
5. flag conflicts;
6. avoid silently reconciling contradictory rules.

For SMS-specific implementation, include `guidance/sms-communications-consent-compliance.md` in this preflight. Old form behavior, CRM data, contact records, or software defaults do not establish SMS consent.

### PLACEHOLDER Handling

If a relevant reference remains `PLACEHOLDER`:

- do not infer the missing business decision;
- do not fill TODOs automatically;
- do not treat the file as authoritative;
- use another CURRENT / APPROVED source if one legitimately controls;
- otherwise stop and request human decision.

### SUPERSEDED Handling

Codex should ignore `SUPERSEDED` references for current implementation unless explicitly asked to inspect history.

### Precise Petcare

Precise Petcare remains the current operational source of truth for Client-specific records.

The website may hand off information to Precise Petcare but should not independently become the permanent authoritative care-record system without explicit architectural approval.

### Conflict Handling

If website behavior conflicts with this CURRENT / APPROVED hierarchy:

1. flag the conflict;
2. identify the implementation;
3. identify the applicable controlling source;
4. preserve the hierarchy;
5. do not change this hierarchy merely to fit existing website behavior.

---

## Codex Guardrails

- Treat this document as the authoritative source-of-truth and conflict-resolution hierarchy.
- Do not infer missing policy from implementation.
- Do not treat website code as business authority.
- Do not treat public website copy as authority over CURRENT / APPROVED references.
- Do not treat software defaults as policy.
- Do not treat an old message as authority over current approved Precise Petcare records.
- Do not treat a generic scenario as authority over actual Client-specific facts.
- Do not let Client instructions override safety.
- Do not let Client instructions override animal welfare.
- Do not let Client instructions override law.
- Do not let Client instructions override insurance limitations.
- Do not let Client instructions override Service scope.
- Do not let payment override safety or scope.
- Do not let a website estimate override final booking scope or pricing.
- Do not let an open calendar slot override true capacity.
- Do not let an old manual section override a newer CURRENT / APPROVED dedicated reference.
- Do not use PLACEHOLDER content as authority.
- Do not use DRAFT content as authority.
- Do not use SUPERSEDED content as current authority.
- Do not invent a hybrid rule when two authoritative sources conflict.
- Do not silently resolve material conflicts.
- Do not change an authoritative business rule merely to make implementation easier.
- Use the more specific CURRENT / APPROVED reference where applicable.
- Use the newer CURRENT / APPROVED reference where the same subject was intentionally updated.
- Use CURRENT / APPROVED Client-facing policy for contractual subjects.
- Use current Precise Petcare records for Client-specific operational facts when safe and within scope.
- Preserve safety, welfare, law, insurance, and Service-scope limits above all lower-level implementation sources.
- When authority remains unclear, stop and require human review.
- When Client-facing review is required, prefer "Personalized review required" rather than exposing internal conflict reasoning.
- Do not infer SMS consent from possession of a phone number, an inquiry, a purchase, a booking, an account, or Terms acceptance.
- Use the canonical SMS reference for consent and messaging behavior unless a higher-authority signed contractual or legal requirement controls.
