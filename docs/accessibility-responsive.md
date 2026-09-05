# Accessibility and Responsive UI

> Status: CURRENT ENGINEERING FOUNDATION
>
> Baseline: F11 audit from F10 checkpoint `90f3e33cbd94fa0429d521bb46ce0da1bb78de36`
>
> Scope: public UI semantics, keyboard and touch input, focus, forms, status, contrast, motion, zoom, and responsive behavior. Business-reference documents continue to control business meaning.

## Target and limits

WCAG 2.2 AA is the practical engineering target. This is not a legal opinion, conformance report, certification, or guarantee that every assistive-technology combination has been tested. Automated scans catch only a subset of accessibility problems and cannot establish logical reading order, useful alternative text, cognitive clarity, real screen-reader usability, error recovery quality, or touch ergonomics.

## Audited inventory

| Surface | Current implementation | Accessibility disposition |
| --- | --- | --- |
| Static pages | Home, start, holidays, choosing care, credentials, privacy, terms, safety, FAQ, contact | One page `h1`, descriptive metadata, English document language, and one focusable `main` landmark per route |
| Navigation | Sticky primary navigation, compact toggle, in-page links, portal and social links | Native links/button; compact menu exposes expanded state, closes at desktop, supports Escape, and restores toggle focus |
| Forms | Contact inquiry, estimator, planner, FAQ/safety search, ZIP/address tools | Native labels, inputs, selects, textareas, fieldsets, legends, required state, input purposes, and browser validation |
| Dynamic state | Contact submit, address suggestions/results, availability, estimator/planner results, search counts, reset status | Bounded status/alert announcements; long result panels are not entire live regions |
| Disclosures | FAQ/safety `<details>` | Native disclosure keyboard and semantics; no custom accordion roles |
| Images | Owner-pet gallery, hero image, social icons | Informative images have concise alt text; decorative icons are hidden from assistive technology; removed Client photos remain removed |
| Loading/error | Dynamic estimator/address fallback, contact pending/failure, global error and 404 | Text accompanies pending/error states; recovery actions are native controls; internal details are not exposed |
| Custom interaction | Address suggestions | ARIA combobox/listbox with Up/Down, Enter, Escape, pointer selection, active option, result-count status, and no focus trap |

No dialog, modal, carousel, autoplay, flashing, drag-only interaction, authentication flow, or custom tooltip is present. Print-specific redesign and dark mode are not needed. The service-area map library is not exposed as a required interactive map; text-based service-area and address alternatives remain available.

## Engineering patterns

### Semantics, landmarks, headings, and names

- Use native HTML before ARIA: links navigate, buttons act, labels name controls, fieldsets group choices, lists represent lists, and details/summary provide disclosures.
- Every public route has a single `main#main-content` target. The early skip link becomes visible on focus and moves focus to that main landmark.
- Header/navigation and the home-page footer are separate landmarks. Social profile collections are real lists rather than generically labelled containers.
- Heading levels communicate structure rather than visual size. Public routes retain a single meaningful `h1` and descriptive page titles.
- Icon-only social links use task-oriented accessible names; visible labels and accessible names remain aligned for voice input.
- Do not add `role` or ARIA attributes where native semantics already provide the behavior.

### Keyboard, focus, and touch

- All current tasks use native keyboard-operable controls. There is no positive `tabindex` and no manual tab-order scheme.
- A three-pixel, high-contrast `:focus-visible` outline covers links, buttons, inputs, selects, textareas, summaries, and intentionally focusable custom targets.
- Scroll padding/margins reduce the chance that the sticky header obscures focused content.
- Compact navigation supports Enter/Space through its native button and Escape with focus restoration. It is not a modal and does not trap focus.
- Address suggestions keep DOM focus on the input while `aria-activedescendant` tracks the active option. Activation occurs on Enter or click/up; `mousedown` only prevents premature input blur.
- Primary controls and compact/icon controls target at least 44 CSS pixels where practical. Inline prose links retain the WCAG inline-target exception.
- Hover effects are enhancements only. Required content and actions remain available to keyboard and touch users.

### Forms, errors, and status

- Visible labels are associated with all controls. Placeholders are examples only.
- Required contact fields use native `required` and a visible required-field key. Browser validation moves users to the first invalid control; server/provider errors use a focused alert that retains safe entered values.
- A separate custom error summary is not needed because the contact form relies on concise native field validation and one general provider/security error region.
- The SMS checkbox remains optional, unchecked by default, separate from Terms, and associated with the canonical visible disclosure. Its wording is sourced from `app/config/sms.ts` and was not changed in F11.
- Contact submission uses `aria-busy`, pending button text, a polite success status, and an alert for blocking errors. A missing Turnstile completion is reported after activation instead of hiding the submit control from keyboard users.
- Estimator/planner changes use short, bounded status announcements. The detailed results remain readable content without making an entire changing panel live.
- Date fields remain native `type="date"` values with approved `YYYY-MM-DD` semantics and minimum-date constraints. ZIP remains text-like numeric input so leading-zero semantics are preserved.

### Contrast, color, links, and forced colors

F11 measured and corrected these failing pairs:

| Use | Before | Measured before | F11 treatment |
| --- | --- | ---: | --- |
| Pink brand/hero accent on paper | `#e976a6` on `#fffaf5` | 2.66:1 | Dark terracotta `#9f4f37` for text and mark boundaries |
| Eyebrow on pink section | `#5a6a56` on `#ffb4db` | 3.52:1 | Dark brown `#3b241a` |
| Service-area copy on dark brown | `#68736d` on `#3b241a` | 2.93:1 | Paper white `#fffaf5` |
| Pink action background | white on `#e976a6` | 2.76:1 | Dark brown text on pink, measured 5.23:1 |

Body links in prose retain underlines in addition to color. Errors and successes include text and programmatic status, not color alone. A narrow `forced-colors` rule preserves borders and focus without creating a separate high-contrast theme.

### Responsive, zoom, orientation, and motion

- Layouts use fluid shells, `min-width: 0`, wrapping actions, responsive grids, and content wrapping rather than global overflow hiding.
- Automated checks cover 320, 375, 390, 768, 1024, and 1280 CSS-pixel widths on home, planner, and contact routes; no horizontal document overflow is accepted.
- The existing 640 CSS-pixel viewport at 200% zoom exercises the 320-pixel reflow equivalent. Actual 200%/400% browser zoom and text-only zoom still require manual testing.
- No viewport rule disables scaling and no orientation lock exists. Content-based layouts support portrait and landscape; fixed full-screen overlays are absent.
- Form controls use at least 16px text where mobile browser zoom behavior matters. Long copy, errors, links, buttons, estimator totals, and consent text may wrap.
- `prefers-reduced-motion: reduce` disables smooth scrolling and compresses transitions/animations. Gallery and social transforms are removed. There is no autoplay or continuously moving content.
- Safe-area padding is limited to the existing fixed mobile contact treatment; no general body scroll lock is used.

## Automated checks

`npm run check:a11y` builds the application and runs `e2e/accessibility.spec.ts` against the isolated local server. It uses exact dev dependency `@axe-core/playwright@4.13.0` and scans home, planner, contact, FAQ, and privacy with WCAG A/AA tags. It also exercises skip-link focus, compact navigation, address-combobox keys, visible textarea focus, reduced motion, touch navigation, and the six-width reflow matrix.

The general `npm run e2e` and `npm run validate:full` include the accessibility tests. A separate `check:responsive` command is **NOT NEEDED** because the same Playwright suite already owns responsive, zoom-approximation, touch, and overflow assertions.

Automated checks must never be described as proof of WCAG conformance or screen-reader compatibility. There are no broad Axe suppressions or route exclusions in F11.

## Regression matrix

| Area | Expected behavior | Automated coverage | Manual coverage / known gap |
| --- | --- | --- | --- |
| Navigation | Skip link; logical order; compact toggle and Escape | Playwright keyboard tests | Confirm full page-by-page Tab/Shift+Tab order |
| Contact | Labels, required state, retained values, pending/success/error | Axe, existing form tests, focus test | Test a real configured Turnstile widget |
| SMS consent | Optional, unchecked, disclosure-linked, separate | Existing DOM/E2E and Axe | Recheck scanner/carrier expectations when provider changes |
| Address input | Label, bounded announcements, arrows/Enter/Escape/touch | Mocked Playwright interaction and Axe on home | Test real Google suggestions when explicitly configured |
| Estimator/planner | Native groups, bounded result status, mobile reflow | Existing functional E2E, Axe, overflow matrix | Screen-reader task-completion smoke test |
| Errors/loading | Visible text, alert/status, recovery, busy state | Contact failure tests and Axe | Simulate slow provider with assistive technology |
| Images | Useful alt or decorative exclusion | Axe plus source review | Human review of alt usefulness |
| Responsive/zoom | No core horizontal overflow; controls wrap | Six widths plus 200% approximation | Real 200%/400% and text-only zoom |
| Focus | Visible, not trapped, restored after menu Escape/error | Keyboard/focus tests | High-contrast and sticky-obscuring sweep |
| Reduced motion | No smooth scroll or transform-heavy motion | Emulated reduced-motion test | OS-level preference smoke test |

## Manual pre-launch checklist

- Complete home, estimator, planner, contact, FAQ, and navigation tasks using only Tab, Shift+Tab, Enter, Space, arrows, and Escape.
- Confirm the skip link is first, visible, and moves focus to the main landmark on every route.
- Confirm every focus indicator is visible and is not covered by the sticky header or another fixed element.
- Submit the contact form with empty, invalid, successful, Turnstile-incomplete, and provider-failure states; verify labels, first-invalid focus, retained values, announcements, and retry path.
- Verify the SMS checkbox starts unchecked, is optional, and the complete disclosure and Privacy link remain visible and understandable.
- With real Google configuration in an approved test environment, operate suggestions by keyboard, touch, and pointer; verify result counts, stale-result dismissal, and provider attribution.
- Use a real screen reader (NVDA is a reasonable Windows option) for navigation, contact, estimator/planner, details disclosures, and dynamic status. F11 did not install or claim real screen-reader testing.
- Test browser zoom at 200% and 400%, plus enlarged/text-only zoom where available, at desktop and narrow windows.
- Test 320, 375, 390, 768, 1024, and 1280+ widths in portrait and landscape; check wrapping, horizontal overflow, sticky controls, long labels, errors, and estimator totals.
- Enable OS reduced motion and Windows forced colors; verify focus, control boundaries, content, and state remain understandable.
- Confirm informative alt text is useful in context and decorative icons are silent.
- Measure new foreground/background pairs and interactive boundaries; do not approve contrast by eye.
- Check touch targets on the compact menu, checkboxes, address options, social icons, and primary actions.

## Severity register

| Severity | F11 finding | Disposition |
| --- | --- | --- |
| CRITICAL | None found: no core mouse-only flow, keyboard trap, zoom restriction, inaccessible required contact control, or hidden SMS disclosure | Preserve with tests and manual launch review |
| HIGH | Serious automated contrast failures affected brand accents, a dark service-area section, and pink actions | Corrected with measured context-specific colors; representative Axe scans pass |
| MEDIUM | Skip targets were duplicated/indirect on some routes; address suggestions lacked arrow/active-option semantics; dynamic result regions were overly broad; textarea focus styling was incomplete | Corrected and covered by focused Playwright tests |
| LOW | Home footer sat inside `main`; social profiles used a generic labelled container; compact target sizes and long-content wrapping needed strengthening | Corrected in semantic markup and the F11 CSS layer |
| INFO | No modal, carousel, autoplay, flash, drag, authentication, or required map interaction exists | Re-audit if these surfaces are introduced |

## Unresolved decisions and provider boundaries

- Real screen-reader testing remains manual and was not performed in F11.
- Actual browser 400% zoom, text-only zoom, Windows forced colors, and a full orientation sweep remain pre-launch manual checks.
- Cloudflare controls the internals of the Turnstile widget. The surrounding explanation, focusable submit path, and failure alert are owned here; the configured third-party widget still needs a manual smoke test.
- Google controls suggestion/provider content. The site owns combobox semantics, bounded announcements, keyboard/touch selection, privacy messaging, and attribution around that content.
- `aria-current="page"` is deferred because the current navigation mixes route and same-page destinations; applying it from pathname alone would mark multiple home-section links current or provide misleading context.
- Touch emulation is implemented for compact navigation; a broad device matrix is not needed.
- Continue to review target size for new dense inline controls and do not turn prose links into oversized buttons without a task need.

## Business, privacy, and security preservation

F11 changes presentation, semantics, focus, announcements, responsive CSS, and tests only. Pricing, service scope, availability, capacity, cancellation, short-notice, Overnight, holiday, estimator/planner decisions, provider write gates, privacy boundaries, and booking/payment behavior are unchanged. The canonical SMS disclosure remains unchanged, optional, and unchecked by default. Accessible names and statuses do not expose addresses, internal route/capacity logic, Client data, or provider secrets.

References used: `docs/business-reference/README.md`; `guidance/source-of-truth-document-hierarchy.md`; `guidance/sms-communications-consent-compliance.md`; `core/03-pricing-fees-surcharge-policy.md`; `logic/18-booking-acceptance-risk-triage.md`; `logic/20-overnight-acceptance.md`; `logic/33-custom-quote-scope-review.md`; `logic/37-service-window-capacity-planner.md`; and the F0–F10 technical foundation documents listed in the repository preflight.
