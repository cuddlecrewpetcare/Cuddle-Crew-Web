# Prompt 3 responsive and accessibility checks

Automated source checks cover progressive mobile navigation, `/start` pathway labels, and the map unavailable fallback. Before release, manually verify at 320, 375, 390, 768, 1024, and desktop widths:

- No horizontal overflow; sticky controls do not cover focused content.
- Keyboard-only navigation: skip link, mobile menu, Escape return, forms, details accordions, calculator controls, map fallback, and visible focus.
- 200% zoom/text reflow: no clipped controls or CTA overlap.
- Contrast, required/error/status announcements, and approximately 44px touch targets.
- Reduced-motion preference remains stable and usable.

Do not enter or submit personal, medical, address, access, or payment information during testing.
