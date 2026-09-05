# Cuddle Crew Pet Care — Business Reference Library

This directory contains authoritative and supporting business-reference documents used to keep the Cuddle Crew Pet Care website consistent with actual business policies and operating rules.

## Purpose

These documents exist primarily as reference material for developers, Codex, website audits, and future implementation work.

They are not automatically public website content.

Some files are client-facing policies. Others contain internal business rules that may influence website behavior without being shown directly to clients.

## Document Status

Each reference file should clearly indicate one of the following statuses:

- PLACEHOLDER
- DRAFT
- CURRENT / APPROVED
- SUPERSEDED

Only CURRENT / APPROVED content is authoritative.

PLACEHOLDER: The document exists but authoritative content has not yet been added.

DRAFT: The document contains working content that is still under review.

CURRENT / APPROVED: The document contains the currently approved business rule or policy and may be used as authoritative implementation reference.

SUPERSEDED: The document has been replaced and must not be used for current implementation.

## Source Hierarchy

When refining or implementing the website:

1. Current approved client-facing agreements and policies in core/ control the client-facing contractual subjects they address.
2. Current approved internal logic documents in logic/ control internal review logic, suitability, booking eligibility, and when automated website behavior must stop for personalized review.
3. Current approved operations/ documents govern relevant operational and governance matters.
4. Current approved guidance/ documents provide broader internal operating guidance.
5. Precise Petcare remains the operational source of truth for individual client records, current bookings, care instructions, schedules, access information, and client-specific approved service plans.
6. Existing website code or copy is not authoritative when it conflicts with CURRENT / APPROVED business-reference content.
7. Safety, animal welfare, applicable law, insurance limitations, and approved service scope must not be overridden merely because an automated website feature can technically accept or calculate a request.
8. If CURRENT / APPROVED materials materially conflict, stop and flag the conflict for human review.

The complete precedence and conflict-resolution rules live in `guidance/source-of-truth-document-hierarchy.md`.

## Subject Routing

Use the most specific applicable `CURRENT / APPROVED` file. In particular:

- SMS consent, A2P/10DLC website behavior, canonical disclosure, consent records, STOP/HELP handling, mobile-information privacy, and marketing-SMS boundaries → `guidance/sms-communications-consent-compliance.md`.
- Source precedence and conflict resolution → `guidance/source-of-truth-document-hierarchy.md`.
- Exact public rates, fees, and pricing modifiers → `core/03-pricing-fees-surcharge-policy.md`.
- PPC base/modifier configuration, 15-minute supplemental care, same-arrival modifier treatment, Overnight + midday pricing implementation, reservation-payment quote default, and view-only quote workflow → `logic/38-ppc-pricing-quote-implementation.md`.
- Exact 2026 holiday and peak-date qualifying periods → `logic/36-holiday-peak-date-calendar.md`.
- Cancellation, refund, and booking-change terms → `core/02-cancellation-booking-change-refund-policy.md`.
- Internal custom-quote and personalized-scope review triggers → `logic/33-custom-quote-scope-review.md`.
- Other internal booking, scope, safety, capacity, and suitability decisions → the applicable `logic/` reference.

SMS-specific implementation must read the canonical SMS reference before changing phone-number collection, communications consent, disclosure text, notification preferences, opt-out or HELP behavior, SMS Privacy Policy language, or marketing-SMS behavior. Existing website behavior, form fields, CRM data, or possession of a phone number does not override that reference or establish consent. Higher-authority signed contractual or legal requirements still control where applicable.

## Codex Rules

- Never invent a policy to fill a gap.
- Never silently reconcile conflicting authoritative sources.
- Flag conflicts for human review.
- Do not treat placeholder text or TODOs as authoritative.
- Do not expose confidential, security-sensitive, or internal-only information.
- Do not expose internal risk scoring, acceptance criteria, thresholds, capacity calculations, or decision-making rubrics unless specifically approved.
- Public website language should be clear and client-friendly while remaining faithful to the authoritative source.
- Website estimates must remain estimates unless an authoritative source explicitly says otherwise.
- A website estimate must never override a final Precise Petcare quote, invoice, or confirmed booking.
- A calculated price does not guarantee booking acceptance.
- When internal logic requires review, use a result such as "Personalized review required" rather than forcing an automated result.
- Do not create promises of exact arrival times when authoritative policies use service windows.
- Do not imply that Overnight Care is 24-hour continuous care.
- Do not imply that payment or a higher price makes an otherwise unsafe, unlawful, uninsured, or out-of-scope service acceptable.
- Do not expose private home addresses, private service-area reference points, API keys, client information, access credentials, travel dates, medical data, or other sensitive information through public frontend code.
- Do not derive geographic pricing from a private reference address in client-side code.
- Any private service-area origin/reference data used by a future routing API must remain server-side.
- Do not hardcode business rules in multiple unrelated components where a centralized configuration or data source can reduce inconsistency.
- Never make a public credential, insurance, certification, membership, service-area, or safety claim unless a CURRENT / APPROVED reference supports it.
- When business rules may change over time, design implementation so the rule can be updated without rewriting unrelated website code.
- Never infer SMS consent from a phone number, inquiry, quote, purchase, booking, account, or Terms acceptance.
- Use the canonical SMS disclosure and consent rules in `guidance/sms-communications-consent-compliance.md`; do not create divergent disclosure variants.

## Intended Future Uses

Once populated and approved, this reference library may be used to help with:

- website audits;
- service-page refinement;
- FAQ generation;
- estimate-builder logic;
- conditional booking logic;
- personalized-review triggers;
- travel/service-area logic;
- holiday pricing logic;
- onboarding UX;
- safety messaging;
- trust content;
- Precise Petcare handoff logic;
- internal admin tooling;
- policy consistency checks;
- and future Codex development tasks.

## Privacy

Never store actual client-specific information in this repository.

Do not place:

- client names;
- client addresses;
- access codes;
- alarm credentials;
- key identifiers tied to real clients;
- client travel dates;
- veterinary payment information;
- private medical information;
- identifying incident reports;
- or other confidential client data

inside this business-reference library.

Use only blank templates, approved business policies, and generalized internal operating guidance.
