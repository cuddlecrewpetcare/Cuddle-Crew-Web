/** Technical safety budgets. These are not client-facing business rules. */
export const resourceLimits={
  requestBodyBytes:{contact:8_192,estimate:8_000,availability:256,address:1_024},
  providerResponseBytes:{calendar:512_000,addressValidation:64_000,addressAutocomplete:64_000,route:16_000,turnstile:16_384},
  providerTimeoutMs:{resend:8_000,turnstile:5_000,calendar:7_000},
  processStateEntries:{rateLimits:2_048,recentContactAttempts:512},
  calendar:{maximumEvents:2_000,maximumProcessingMs:100,maximumDays:31},
  address:{maximumInputCharacters:180,maximumProviderCandidates:20,maximumSuggestions:5},
  estimate:{maximumPets:8,maximumDays:366},
} as const;
