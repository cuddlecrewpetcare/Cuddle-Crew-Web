# SMS Communications, Consent & Compliance

> Status: CURRENT / APPROVED
>
> Classification: INTERNAL REFERENCE / COMPLIANCE & OPERATIONS
>
> Authority: AUTHORITATIVE FOR THE SMS CONSENT, A2P/10DLC WEBSITE BEHAVIOR, DISCLOSURE, CONSENT RECORDS, OPT-OUT, HELP, PRIVACY, AND REVIEW REQUIREMENTS COVERED BY THIS DOCUMENT
>
> Website use: Contact forms, phone-number collection, SMS consent controls and disclosures, Privacy Policy and Terms summaries, consent handoff, and scanner-readable A2P/10DLC review.

## Purpose

This document is the source of truth for Cuddle Crew Pet Care LLC's service-related SMS consent and A2P/10DLC website behavior. It governs:

- SMS consent;
- approved disclosure wording;
- consent sources and records;
- opt-outs and HELP handling;
- service-related messaging scope;
- marketing-SMS restrictions;
- mobile-information privacy;
- scanner-readable website requirements; and
- periodic compliance review.

This operational and compliance reference does not replace professional legal guidance, carrier requirements, messaging-provider requirements, or higher-authority signed contractual/legal requirements when they apply. Review those requirements when the law, messaging program, vendor, registration, use case, or approved business practice changes.

## Consent Principle

Providing a phone number alone does **not** equal SMS consent.

Do not infer SMS consent from:

- entering a phone number;
- submitting an inquiry;
- requesting a quote;
- making a purchase;
- booking a Service;
- creating an account; or
- accepting Terms.

Approved consent sources are:

1. website opt-in;
2. Client-initiated text conversation; and
3. verbal consent.

Consent must be associated with the person and contact identifier that actually provided it. Do not fabricate, backfill, or infer consent, its source, or its timestamp.

## Website Opt-In Requirements

A website SMS opt-in must be:

- optional;
- unchecked by default;
- separate from Terms acceptance;
- not required to submit an inquiry;
- not bundled with a purchase or access to Services; and
- not automatically inferred from phone-number submission.

The phone input, optional checkbox, disclosure, and linked Privacy Policy should be visible together on the same public form whenever practical. If the main intake is multi-step, preserve a simple public first-contact form that presents these elements together.

## Approved Service-Related Purposes

Service-related SMS consent may cover:

- Service inquiries;
- scheduling;
- appointment confirmations;
- reminders;
- pet-care updates;
- billing; and
- customer support.

Do not broaden service-related consent into unrelated marketing consent.

## Canonical Disclosure

### APPROVED SMS DISCLOSURE — DO NOT MODIFY WITHOUT REVIEWING CURRENT COMPLIANCE REQUIREMENTS

> I agree to receive text messages from Cuddle Crew Pet Care regarding service inquiries, scheduling, appointment confirmations and reminders, pet-care updates, billing, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Review our Privacy Policy to learn how your information is used.

The rendered disclosure must visibly include:

- Cuddle Crew Pet Care;
- message purpose/types;
- `Message frequency varies`;
- `Message and data rates may apply`;
- `STOP`;
- `HELP`; and
- a clickable Privacy Policy link.

Do not hide required wording behind a tooltip, accordion, modal, hover interaction, scanner-only hidden text, or a later form step when avoidable. Application code should render one shared canonical disclosure rather than maintaining several slightly different copies.

## Consent Records

Where technically supported, record:

- consent status;
- method/source;
- timestamp;
- the person who obtained verbal consent, when applicable; and
- the relevant contact identifier.

Preferred website field names are:

- `smsConsent`;
- `smsConsentTimestamp`; and
- `smsConsentSource`.

Approved source values are:

- `website_contact_form`;
- `client_initiated_sms`; and
- `verbal_consent`.

Use naming consistent with the system that owns the record if an established architecture requires different field names. A timestamp and source should be set only when affirmative consent exists. The current public website may include the website opt-in record in the inquiry delivered to the business; it must not claim to update Precise Petcare or another CRM automatically unless that integration actually exists.

Do not unnecessarily log full form payloads. Do not expose consent records, phone numbers, or other contact data publicly, through URLs, analytics, frontend configuration, or unauthenticated API responses.

## Client-Initiated Text Conversation

When a person initiates a text conversation with Cuddle Crew Pet Care, that conversation may support service-related replies consistent with the person's request and applicable messaging requirements.

Do not treat a Client-initiated service conversation as permission for unrelated promotional messaging. Record the source as `client_initiated_sms` where the operational system supports it.

## Verbal Consent Procedure

When obtaining verbal consent, communicate:

- that the person is consenting to SMS from Cuddle Crew Pet Care;
- the general service-related message purposes;
- that message frequency varies;
- that message and data rates may apply;
- that replying STOP opts out;
- that replying HELP requests assistance; and
- where the Privacy Policy can be reviewed.

A concise script may be:

> Do you agree to receive service-related text messages from Cuddle Crew Pet Care about inquiries, scheduling, confirmations and reminders, pet-care updates, billing, and customer support? Message frequency varies, and message and data rates may apply. Reply STOP to opt out or HELP for assistance. Our Privacy Policy is available on the Cuddle Crew Pet Care website.

After an affirmative response, record where reasonably supported:

- consent status;
- `verbal_consent` as the method/source;
- date and time;
- the person who obtained consent; and
- the relevant phone number or contact record.

Do not fabricate consent when the response is absent, ambiguous, or negative.

## Operations Procedure

Do not text someone merely because their number exists in:

- a CRM;
- Precise Petcare;
- lead records;
- old contacts;
- inquiry submissions; or
- account data.

Before initiating service-related SMS, confirm an approved consent source or another valid messaging basis consistent with the current program and applicable requirements.

### STOP

- Respect STOP and equivalent clear opt-out requests promptly.
- Do not silently re-enable an opted-out number.
- Preserve the opt-out state in the system used for messaging.
- Send only any acknowledgement required or permitted by the messaging platform or applicable requirements.
- Require a new valid opt-in before resuming messages when re-consent is permitted.

### HELP

- HELP should lead to appropriate assistance or contact information.
- Provide a useful way to reach Cuddle Crew Pet Care.
- Do not use HELP as an opportunity to send unrelated marketing.

### Data Handling

- Limit access to consent and contact records to legitimate business needs.
- Share mobile information only with service providers/processors as reasonably necessary to operate communications, or as otherwise described in the Privacy Policy and permitted by law.
- Do not sell, rent, or share mobile information or SMS consent with third parties for their marketing or promotional purposes.
- Retain only what is reasonably necessary for operations, evidence of consent, opt-out compliance, security, and legal obligations.

## Marketing Communications

A phone number supplied for inquiries, booking, billing, scheduling, Service, or support does not automatically authorize promotional SMS marketing.

Marketing SMS requires an appropriate consent basis and approved use case. Do not expand service-related consent into unrelated marketing, reuse historical numbers without a valid basis, or imply that marketing consent is required to purchase Services.

## Social Content

If social content says “Text us,” a person may initiate a text when that is consistent with current business practice. Possessing that person's number does not create unrelated marketing permission. All SMS use must follow this canonical reference.

## Website, SEO, Accessibility & Scanner Requirements

Public SMS opt-in implementation must provide:

- a semantic `type="tel"` phone input with an appropriate label;
- an optional checkbox that is unchecked by default;
- the canonical disclosure;
- a clickable Privacy Policy link;
- phone input, checkbox, and disclosure together on the same page where practical;
- visible, crawlable, scanner-readable text without authentication;
- disclosure in the initial DOM/render where practical;
- keyboard and screen-reader accessibility;
- usable responsive layout; and
- clear validation that does not imply phone submission equals consent.

Do not rely on image-only disclosure, inaccessible custom controls, or client-only hidden text that automated compliance review cannot reasonably read.

## Privacy Policy Requirements

The public Privacy Policy should state substantially that:

- SMS may be used for service-related purposes when the person consents;
- messages may involve scheduling, reminders, updates, billing, and support;
- frequency may vary;
- message and data rates may apply;
- STOP may be used to opt out; and
- HELP may be used for assistance.

It must include substantially:

> Mobile information and SMS consent will not be sold, rented, or shared with third parties for their marketing or promotional purposes.

Do not falsely claim that mobile information is never shared at all. Necessary messaging, hosting, security, and other service providers/processors may be described honestly.

## Website Terms Requirements

Where the website Terms summarize SMS behavior, state that:

- SMS is optional;
- message frequency varies;
- message and data rates may apply;
- STOP opts out;
- HELP requests assistance; and
- SMS consent is not required to purchase Services.

Do not use website Terms acceptance as SMS consent. Do not rewrite unresolved Client contract language or create a redundant legal page solely for SMS.

## Periodic Compliance Review

Review SMS implementation at least annually and whenever a material change occurs, including a new messaging vendor, number, campaign, registration, consent source, message type, marketing use case, form, Privacy Policy, Terms language, or applicable legal/carrier requirement.

Verify:

- the website checkbox remains optional and unchecked by default;
- the canonical disclosure is complete, visible, linked, accessible, and scanner-readable;
- consent source and timestamp behavior remain accurate;
- no phone-number-only consent inference exists;
- STOP and HELP workflows function as intended;
- opt-outs are not silently re-enabled;
- messaging stays within the consented purpose;
- marketing use has a separate appropriate basis;
- Privacy Policy and Terms language remain aligned;
- vendors/processors and data-sharing descriptions remain accurate; and
- public and internal documentation use this reference.

## Conflict Handling

If website code, form behavior, old documentation, provider defaults, CRM fields, or prior practice conflicts with this reference:

1. stop relying on the stale behavior;
2. identify the conflict;
3. preserve valid consent and opt-out evidence;
4. correct the implementation or procedure through an approved change; and
5. obtain legal, carrier, or provider review where the correct requirement remains unclear.

Higher-authority signed contractual or legal requirements control where applicable. Software defaults do not create consent.

## Codex Guardrails

- Do not infer consent from possession of a phone number.
- Do not precheck SMS consent.
- Do not make SMS consent a condition of inquiry submission or Service purchase.
- Do not bundle SMS consent with Terms acceptance.
- Do not fabricate consent, source, timestamp, or person obtaining consent.
- Do not broaden service-related consent into marketing consent.
- Do not create alternate disclosure wording without reviewing current compliance requirements.
- Do not hide the required disclosure or Privacy Policy link.
- Do not expose phone numbers, consent records, opt-out status, or contact data publicly.
- Do not unnecessarily log full form payloads.
- Do not silently re-enable an opt-out.
- Do not claim a CRM, Precise Petcare, or website integration exists unless it does.
- If legal or provider requirements conflict or remain unresolved, require appropriate review rather than guessing.
