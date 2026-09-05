# Phase 12D Accessibility / Responsive Reconciliation

> Status: COMPLETE WITH MANUAL PRE-LAUNCH ITEMS
>
> Audit date: 2026-09-05
>
> Source: merged `github/main` at `1e77e8f69363e588bfbfa007ac38ca17e47fd85d`
>
> Branch: `codex/phase-12d-accessibility-reconciliation`

## Recovered intent and evidence boundary

The original `codex/phase-12d-accessibility` branch was created from the Phase 12C merge at `3b443a6dcafb0cb3f4ed4129714d357e3e059816` and has no Phase 12D commit. The recoverable pre-foundation evidence is therefore the historical `RESPONSIVE_ACCESSIBILITY_CHECKLIST.md`, the final-launch review, repository history, and the current Phase 12D reconciliation brief. Together they support this bounded scope: keyboard access, focus, responsive/mobile reflow, form semantics and status, screen-reader compatibility, reduced motion, zoom, touch/pointer input, contrast, structural semantics/ARIA, and accessibility testing. No unsupported historical requirement was invented.

F11 at `65b48a0c5bf9203629ead5222d294b9e4373c120` completed the substantial engineering implementation and created the durable contract in `docs/accessibility-responsive.md`. F12 later added route/deployment browser coverage. F14 reconciled the final foundation audit and validation orchestration. Post-F11 history contains no application accessibility rewrite.

## Reconciliation matrix

| Original 12D area | Current implementation | Source of completion | Status | Automated evidence | Manual gap | Action |
| --- | --- | --- | --- | --- | --- | --- |
| Keyboard use | Native controls; skip link; compact menu Enter/Space/Escape; address Up/Down/Enter/Escape; native disclosures | F11 | COMPLETE VIA F11 | Focused Playwright keyboard cases and public-flow tests | Full real task sweep with Tab and Shift+Tab | Preserve; manual pre-launch sweep |
| Focus | Three-pixel focus-visible treatment; scroll padding/margins; compact-menu restoration; focused blocking contact error; input focus retained for combobox | F11 | COMPLETE VIA F11 | Skip/menu, textarea focus, and contact failure coverage plus source review | Sticky-obscuring and forced-colors review on real Windows UI | Preserve; manual pre-launch sweep |
| Responsive/mobile | Fluid shells, shrinkable grid children, wrapping actions/text, compact navigation, no global overflow concealment | F11 | COMPLETE VIA F11 | 320/375/390/768/1024/1280 route matrix plus existing 200%-equivalent case | Real devices and portrait/landscape | Preserve; manual pre-launch sweep |
| Contact form and SMS | Visible labels, stable IDs, required key, input purposes, optional unchecked consent, canonical visible disclosure, Privacy link, busy/error/success behavior | F11 | COMPLETE VIA F11 | Axe, contact E2E, scanner-readable initial HTML, responsive consent coverage, Node consent tests | Configured Turnstile and real assistive technology | No change |
| Address autocomplete | Combobox/listbox/option state, active descendant, bounded status, stale-request aborts, keys, pointer/touch selection, input focus retained | F11 | COMPLETE VIA F11 | Dynamic-widget Axe and interaction case | Real configured Google suggestions | No change |
| Estimator/planner semantics | Native labels/groups, conditional native controls, bounded announcements, responsive result panels, neutral review result | F11 + CURRENT 12D | COMPLETE | Existing functional/reflow tests; current 12D added named per-pet fieldsets and scans the completed estimator state | NVDA task completion | Added only missing per-pet group semantics |
| Dynamic result action contrast/focus | Completed estimator copy/print controls use paper text/borders and a paper focus outline against the dark panel | CURRENT 12D | COMPLETE | Dynamic completed-state Axe scan; measured paper/dark contrast is 13.93:1 | Forced-colors and real visual review | Corrected one state-specific regression |
| Contrast/color | F11 context-specific fixes remain for accent text, pink section eyebrow, dark-area copy, and pink actions | F11 | COMPLETE VIA F11 | Representative Axe scans; measured pairs remain 5.55:1, 8.81:1, 13.93:1, and 5.23:1 | Windows forced colors | Preserve |
| Motion | Reduced-motion mode removes smooth scrolling, compresses animation/transition duration, and removes gallery/social transforms | F11 | COMPLETE VIA F11 | Emulated reduced-motion Playwright case | OS-level preference smoke | Preserve |
| Zoom/reflow | Scaling is not disabled; 320px and 640px-at-200% approximation avoid document overflow | PRE-EXISTING + F11 | MANUAL PRE-LAUNCH ONLY | Narrow-width matrix and 200%-equivalent automated evidence | Actual 200%/400% browser zoom and text-only zoom | Manual pre-launch only |
| Touch/pointer | Compact nav tap path, full-label checkboxes, 44px practical targets, address options, no hover-only core task | F11 | COMPLETE VIA F11 | Touch-emulated navigation and responsive interaction tests | Real phone/tablet completion | Preserve; manual device smoke |
| Structural semantics | One `main` and one descriptive `h1` per public route; named navigation; home footer outside main; lists, details, fieldsets, labels, and image alternatives | F11 + CURRENT 12D | COMPLETE | Source inventory, Axe, route smoke, and named-group assertions | Human alt-text usefulness review | Added only missing per-pet fieldsets |
| ARIA | Restrained status/alert use; valid current relationships; hidden compact navigation is removed from layout/focus; native semantics preferred | F11 | COMPLETE VIA F11 | Axe on representative routes and open combobox; source review found no positive tabindex or clickable pseudo-control | Screen-reader smoke | No change |
| Accessibility testing | Existing `@axe-core/playwright` suite owns Axe, keyboard, focus, touch, motion, and responsive checks | F11 + F12 | COMPLETE VIA LATER FOUNDATION WORK | 9 focused accessibility tests within 21 Playwright tests | Automation is not conformance proof | Extended the existing home case; no new tool or duplicate command |

## Gaps and changes

Two minor code gaps were found and repaired:

1. Repeated estimator pet controls were visually numbered but were not programmatically grouped by that pet number. Each pet is now a native named fieldset within the existing `Your pets` fieldset.
2. Copy and Print controls exist only after an estimate resolves. In that completed dark-panel state, their inherited dark text, border, and blue focus outline did not provide sufficient contrast against the panel. The state now uses paper-colored text, borders, and focus outline; hover retains dark text on a light background.

The existing home Axe case now creates two pet groups, asserts both accessible group names, resolves an estimator result, and scans that completed dynamic state. The focused test count remains 9.

No other code defect was found in navigation, contact/SMS, autocomplete, planner announcements, 320px reflow, motion, touch, semantics, or ARIA. Axe being green is recorded only as automated evidence, not as WCAG conformance or screen-reader certification.

## Manual pre-launch and provider items

- **MANUAL PRE-LAUNCH:** real NVDA task completion for navigation, contact, estimator/planner, disclosures, and dynamic status.
- **MANUAL PRE-LAUNCH:** actual 200%/400% browser zoom and text-only zoom.
- **MANUAL PRE-LAUNCH:** Windows forced-colors/high-contrast review.
- **MANUAL PRE-LAUNCH:** real portrait/landscape and phone/tablet task completion.
- **OWNER/PROVIDER TASK:** configured Cloudflare Turnstile widget accessibility and recovery smoke test, if enabled.
- **OWNER/PROVIDER TASK:** real Google autocomplete suggestions with keyboard, touch, pointer, attribution, and stale-result review, if enabled.

These are not current code defects and are not represented as automated verification.

## Business, privacy, and dependency preservation

This reconciliation changes estimator semantics, state-specific presentation, and an existing test only. It does not change rates, dates, service scope, cancellation, holidays, short notice, travel, capacity, review thresholds, planner/estimator decisions, availability, booking/payment behavior, provider gates, canonical SMS wording, SMS consent semantics, Privacy/Terms content, or Precise Petcare authority. No private data or provider response was accessed. No dependency, manifest, or lockfile change was made.

Applicable authority reviewed: `docs/business-reference/README.md`; `guidance/source-of-truth-document-hierarchy.md`; `guidance/sms-communications-consent-compliance.md`; `core/03-pricing-fees-surcharge-policy.md`; `logic/18-booking-acceptance-risk-triage.md`; `logic/20-overnight-acceptance.md`; `logic/33-custom-quote-scope-review.md`; and `logic/37-service-window-capacity-planner.md`.

## Formal status and next phase

**PHASE 12D: COMPLETE WITH MANUAL PRE-LAUNCH ITEMS**

Repository history and the available Phase 12 documentation do not identify an approved next Phase 12 letter/number after 12D. No next phase was invented or started.
