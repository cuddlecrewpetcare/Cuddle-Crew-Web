import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './contact-form.css';
import './estimator-enhancements.css';
import './availability.css';

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
  robots: { index: indexing, follow: indexing, googleBot: { index: indexing, follow: indexing } },
  metadataBase: new URL('https://www.cuddlecrewpetcare.com'),
  title: 'Cuddle Crew Pet Care | Sacramento Pet Sitting',
  description: 'Warm, attentive pet sitting and dog walking in Sacramento and surrounding communities.',
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
            '@type': 'LocalBusiness',
            name: 'Cuddle Crew Pet Care',
            url: 'https://www.cuddlecrewpetcare.com',
            email: 'lauren@cuddlecrewpetcare.com',
            telephone: '+1-916-252-3550',
            image: 'https://www.cuddlecrewpetcare.com/og.png',
            areaServed: 'Sacramento and surrounding communities, California',
            priceRange: '$$',
            makesOffer: {'@type':'OfferCatalog',name:'Pet care services',itemListElement:[{'@type':'Offer','name':'Drop-in pet visits'},{'@type':'Offer','name':'Dog walks'},{'@type':'Offer','name':'Overnight pet sitting'}]},
            sameAs: [
              'https://share.google/O3aya8JQkApZ4prHu',
              'https://www.facebook.com/profile.php?id=61593543881861',
              'https://www.yelp.com/biz/cuddle-crew-pet-care-carmichael-2',
            ],
          }) }}
        />
        <a className="skip-link" href="#main-content">Skip to main content</a>{children}
      </body>
    </html>
  );
}
