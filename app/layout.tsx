import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cuddle-crew-sacramento.laurenblalock.chatgpt.site'),
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
        {children}
      </body>
    </html>
  );
}
