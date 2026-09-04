export const smsConsentSource = 'website_contact_form' as const;

export const approvedSmsDisclosure = {
  beforePrivacyLink: 'I agree to receive text messages from Cuddle Crew Pet Care regarding service inquiries, scheduling, appointment confirmations and reminders, pet-care updates, billing, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Review our ',
  privacyLinkLabel: 'Privacy Policy',
  afterPrivacyLink: ' to learn how your information is used.',
} as const;

export const approvedSmsDisclosureText = `${approvedSmsDisclosure.beforePrivacyLink}${approvedSmsDisclosure.privacyLinkLabel}${approvedSmsDisclosure.afterPrivacyLink}`;
