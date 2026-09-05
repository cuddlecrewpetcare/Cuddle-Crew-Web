# Holiday / Peak-Date Calendar

> Status: CURRENT / APPROVED
>
> Classification: INTERNAL REFERENCE
>
> Authority: AUTHORITATIVE FOR 2026 QUALIFYING HOLIDAY AND PEAK-DATE PERIODS
>
> Website use: Exact holiday/peak periods for pricing, cancellation classification, estimate-builder logic, booking disclosures, and PPC alignment.

## Purpose

This document is the annual source of truth for the exact holiday and designated peak-date periods used by Cuddle Crew Pet Care LLC ("Cuddle Crew Pet Care") for calendar year 2026.

The CURRENT / APPROVED Pricing, Fees & Surcharge Policy controls the surcharge amounts. The CURRENT / APPROVED Cancellation, Booking Change & Refund Policy controls holiday cancellation terms. This file controls **which dates qualify**.

## 2026 Approved Holiday / Peak Periods

All dates use the business's local Sacramento-area time zone.

| Holiday / Peak Period | First Qualifying Date | Final Qualifying Date | Daytime +$15 | Overnight +$30 |
| --- | --- | --- | --- | --- |
| Martin Luther King Jr. Day Weekend | January 16, 2026 | January 19, 2026 | Yes | Yes |
| Presidents' Day Weekend | February 13, 2026 | February 16, 2026 | Yes | Yes |
| Memorial Day Weekend | May 22, 2026 | May 25, 2026 | Yes | Yes |
| Juneteenth Weekend | June 19, 2026 | June 21, 2026 | Yes | Yes |
| Independence Day Weekend | July 3, 2026 | July 5, 2026 | Yes | Yes |
| Labor Day Weekend | September 4, 2026 | September 7, 2026 | Yes | Yes |
| Thanksgiving Peak Period | November 26, 2026 | November 29, 2026 | Yes | Yes |
| Christmas / New Year's Peak Period | December 24, 2026 | January 3, 2027 | Yes | Yes |

These periods were selected as travel-demand/peak-care periods rather than by automatically adopting every federal, cultural, religious, or calendar observance.

## Not Qualifying at Launch

The following are **not** designated holiday/peak periods for 2026 unless Cuddle Crew Pet Care later adopts a written amendment before an affected booking is confirmed:

- Easter weekend;
- Mother's Day;
- Father's Day;
- Valentine's Day;
- Halloween;
- Veterans Day;
- Indigenous Peoples' Day / Columbus Day;
- or another observance not listed in the approved table above.

## Pricing Treatment

For a qualifying date:

- a qualifying daytime Service may receive the approved **+$15 per qualifying daytime appointment/visit** surcharge;
- a qualifying Overnight Service may receive the approved **+$30 per qualifying night** surcharge.

The amounts above are references only; `core/03-pricing-fees-surcharge-policy.md` remains the pricing authority.

## Overnight Date Rule

Use the **calendar date on which the Overnight begins** to classify that Overnight unless a future approved period expressly says otherwise.

Example: an Overnight beginning September 7, 2026 qualifies for Labor Day treatment; an Overnight beginning September 8 does not qualify solely because part of the stay occurs shortly after the peak period.

## Same-Arrival Daytime Rule

Where multiple service line items are intentionally performed as one continuous daytime appointment during a single physical arrival at the same household, the holiday classification is based on that appointment date. Do not duplicate a holiday surcharge solely because internal billing or scheduling uses multiple line items to represent one continuous physical appointment.

Distinct daytime arrivals are separate qualifying visits.

An Overnight and a separate midday/daytime arrival are distinct service events and may each receive the applicable holiday surcharge when each falls within a qualifying period.

## Cancellation Classification

If an affected Service date falls within one of the approved periods above, apply the holiday/peak-date cancellation provisions in `core/02-cancellation-booking-change-refund-policy.md`.

This calendar does not create or change cancellation percentages or deadlines.

## Annual Maintenance

Before relying on holiday pricing for a new calendar year:

1. review travel-demand periods for that year;
2. approve exact start and end dates;
3. update this file or create the next annual section;
4. verify PPC configuration;
5. verify website/estimate-builder logic;
6. publish qualifying periods before affected bookings are confirmed.

Do not automatically roll 2026 dates into a future year.

## 2026 Approval

- **Calendar Year:** 2026
- **Approved By:** Owner, Cuddle Crew Pet Care LLC
- **Approval Date:** September 5, 2026
- **Effective Date:** September 5, 2026 for future/unconfirmed bookings
- **Last Reviewed:** September 5, 2026

## Implementation Notes

- Centralize holiday classification; do not hardcode independent copies of the dates throughout the website.
- PPC and website estimates should use these dates, but confirmed booking-specific pricing in PPC remains the operational source of truth.
- Future changes must not silently reprice already confirmed bookings contrary to the Pricing Policy.
- Public copy should list the exact qualifying periods rather than saying "major holidays" or "holiday season."
- Use `America/Los_Angeles` or the equivalent Sacramento local-time interpretation in date logic.

## Codex Guardrails

- Use only the exact approved periods above for 2026.
- Do not infer additional holidays from a government or third-party calendar.
- Do not dynamically expand a period because of weekend proximity, school schedules, observed federal dates, or demand.
- Do not change surcharge amounts here; use the CURRENT / APPROVED Pricing Policy.
- Do not change cancellation terms here; use the CURRENT / APPROVED Cancellation Policy.
- Do not duplicate the same holiday or travel-type surcharge merely because one continuous physical appointment is represented by multiple billing line items.
