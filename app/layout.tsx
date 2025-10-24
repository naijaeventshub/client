import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script'; // ✅ Import Script
import { Providers } from '@/lib/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Konfera - Find and Connect with the Right People.',
  description:
    'Konfera is a real-world people discovery layer. Konfera lets you find, understand, and connect with the right people around you — before, during, or after any shared moment.',
  generator: 'Next.js',
  icons: {
    icon: '/favicon.svg',
  },
  keywords: [
    // Core Features
    'social networking',
    'event networking app',
    'discover people nearby',
    'connect at events',
    'local social app',
    'real-time messaging app',
    'event discovery platform',
    'community networking',
    'meet new people',
    'location-based networking',

    // For Businesses & Events
    'event engagement platform',
    'business event tracking',
    'create events online',
    'event marketing tool',
    'track event reactions',
    'live event analytics',
    'promote events locally',
    'social event platform',
    'event networking solution',
    'business networking events',

    // User Experience
    'share profiles',
    'chat at events',
    'connect with people nearby',
    'find events near me',
    'local connections app',
    'meet people in your area',
    'networking at conferences',
    'discover events around you',
    'social app for events',
    'event-based social media',

    // Target Audience & Use Cases
    'students networking app',
    'tech meetup networking',
    'university event networking',
    'conference networking tool',
    'startup event connections',
    'social media for events',
    'connect with like-minded people',
    'build professional connections',
    'local discovery social app',
    'networking made easy',
  ],
  applicationName: 'Konfera',
  openGraph: {
    title: 'Konfera - Discover People & Events Near You',
    description:
      'Konfera lets you connect with people nearby and engage at live events. Discover events, share profiles, chat, and see real-time reactions.',
    url: 'https://letskonfera.com',
    siteName: 'Konfera',
    images: [
      {
        url: 'https://res.cloudinary.com/dcb4ilgmr/image/upload/v1761150868/6037429987939388566_qqwfzl.jpg',
        secureUrl:
          'https://res.cloudinary.com/dcb4ilgmr/image/upload/v1761150868/6037429987939388566_qqwfzl.jpg',
        width: 1200,
        height: 630,
        alt: 'Konfera social networking and event platform',
      },
      {
        url: 'https://res.cloudinary.com/dcb4ilgmr/image/upload/v1759164486/searcher_1_l02gkb.png',
        secureUrl:
          'https://res.cloudinary.com/dcb4ilgmr/image/upload/v1759164486/searcher_1_l02gkb.png',
        width: 512,
        height: 512,
        type: 'image/png',
        alt: 'Konfera Logo',
      },
    ],
  },
  alternates: {
    canonical: 'https://konfera.com',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@KonferaApp',
    title: 'Konfera - Connect with People & Events Around You',
    description:
      'Discover people nearby, connect at events, share profiles, and chat in real time. Businesses can create and track events with Konfera.',
    images:
      'https://res.cloudinary.com/dcb4ilgmr/image/upload/v1761150868/6037429987939388566_qqwfzl.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Use Next.js Script for GA */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EVWZW14MKG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EVWZW14MKG');
          `}
        </Script>
        <Script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
