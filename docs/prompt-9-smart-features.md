# Prompt 9 smart-feature decisions

| Candidate | Existing status | Client value | Maintenance / implementation | Privacy / security / accessibility risk | Decision |
| --- | --- | --- | --- | --- | --- |
| Explainable CarePlanner | Already explains the starting point, reasons, assumptions, longest plausible gap, warnings, and human-review triggers. | High | Low; established pure decision logic. | Low; no diagnosis or acceptance automation. | Preserve. |
| Care-gap visualization | Text explanation existed; a visual timing model was missing. | High for understanding flexible windows and overnight coverage. | Low; deterministic presentation of existing business constants. | Low; no client schedule or inventory. Accessible text remains primary and the graphic is decorative. | Implement. |
| Anonymous saved progress | Estimator had session state, but no clear/delete control; planner did not restore progress. | High for refresh and navigation recovery. | Low; browser session storage only. | Low after strict allowlisting. Dates, free text, contact data, medication, behavior, separation, and detailed tasks are excluded. | Implement. |
| Printable/shareable summary | Copy, print, and native share already exist. URL state is strictly parsed. | High | Low. | Reduced further by excluding travel dates from stored and URL planning state. | Preserve and harden. |
| What-If Safety Center | Searchable educational content already exists with non-treatment boundaries. | High | Low. | Low when maintained as general education. | Preserve. |
| Contextual FAQ | Search and controlled categories already exist. | Moderate incremental value. | Moderate content-mapping upkeep. | Low privacy risk, but extra profiling/state is unnecessary. | Defer. |
| Service-area explanation | ZIP result, map legend, zone fees, text alternative, and manual-review language already exist. | High | Low. | Low; exact addresses are not stored. | Preserve. |
| Holiday / short-notice context | Verified rules and source-of-truth pricing already appear in estimator and FAQ. | High | Low. | Low. | Preserve. |
| Guided `/start` | Already links service area, planning, pricing, preliminary availability, consultation, and portal. | High | Low. | Low. | Preserve. |
| Privacy-safe measurement | Approved event vocabulary and prohibited-field assertions already exist. | Operational value without profiling. | Low. | Low within the existing allowlist. | Preserve; add no new events. |

## Limitations

Saved progress is device- and tab-session-local and is intentionally incomplete. It is not an account, booking, care record, or cross-device sync. The timing visualization models published flexible service windows and approximate overnight coverage; it does not show exact arrivals, live inventory, or a confirmed schedule. Public availability remains preliminary and non-bookable, and final pricing, timing, safety, fit, and acceptance require Lauren's review.
