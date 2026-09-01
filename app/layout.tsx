import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './contact-form.css';
import './estimator-enhancements.css';
import {business} from './config/business';
import PublicAttribution from './PublicAttribution';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const indexing=process.env.SITE_INDEXING_ENABLED==='true';
export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  robots: { index: indexing, follow: indexing, googleBot: { index: indexing, follow: indexing } },
  metadataBase: new URL(business.website),
  title: 'Cuddle Crew Pet Care | Sacramento Pet Sitting',
  description: 'Warm, attentive pet sitting and dog walking in Sacramento and surrounding communities.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Cuddle Crew Pet Care | Sacramento Pet Sitting',
    description: 'Thoughtful pet sitting and dog walking in Sacramento and surrounding communities.',
    url: '/',
    siteName: 'Cuddle Crew Pet Care',
    images: [{ url: '/og.png', width: 1760, height: 918, alt: 'Cuddle Crew Pet Care — thoughtful pet sitting and dog walking in Sacramento' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cuddle Crew Pet Care | Sacramento Pet Sitting',
    description: 'Thoughtful pet sitting and dog walking in Sacramento and surrounding communities.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'LocalBusiness',
                '@id': `${business.website}/#business`,
                description: 'Owner-operated professional in-home pet sitting, dog walking, drop-ins, and overnight care serving Sacramento and surrounding communities.',
                name: business.name,
                url: business.website,
                email: business.email,
                telephone: business.phoneE164,
                image: `${business.website}/og.png`,
                address: { '@type': 'PostalAddress', addressLocality: business.location.city, addressRegion: business.location.region, addressCountry: 'US' },
                areaServed: business.location.territory,
                priceRange: '$$',
                makesOffer: {'@type':'OfferCatalog',name:'Pet care services',itemListElement:[{'@type':'Offer','name':'Drop-in pet visits'},{'@type':'Offer','name':'Dog walks'},{'@type':'Offer','name':'Overnight pet sitting'}]},
                sameAs: [business.social.google,business.social.facebook,business.social.yelp,business.social.instagram],
              },
              { '@type': 'WebSite', '@id': `${business.website}/#website`, name: business.name, url: business.website },
            ],
          }) }}
        />
        <PublicAttribution/><a className="skip-link" href="#main-content">Skip to main content</a>{children}
      </body>
    </html>
  );
}
