// Ordinary price categories do not establish automatic species/scope eligibility.
// CURRENT / APPROVED: care standards §9; booking triage §20; custom scope §§2/10.
export const requiresSpeciesReview=(types:readonly string[])=>types.some(type=>!['dog','cat','rabbit'].includes(type));
