
'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Because we are using a client component, we can't export metadata directly.
// see: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#unsupported-use-cases
//
// export const metadata: Metadata = {
//   title: 'RallyLive Net',
//   description: 'Live rally stage results publishing website',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = 'G-297JC2LEK9';
  return (
    <html lang="en">
      <head>
        <title>RallyLive Net</title>
        <meta name="description" content="Live rally stage results publishing website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,700;1,6..12,400;1,6..12,700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3358665652492622"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {gaMeasurementId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <GoogleOAuthProvider clientId="522089160660-l5o8qgi20v5mnc39le689vgci166ksn3.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
