import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orbit - Business Management System",
  description:
    "Comprehensive business management platform for Orange Group distribution",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const googleMapsEnabled =
    process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAPS === "true";
  const shouldLoadGoogleMaps =
    googleMapsEnabled &&
    typeof googleMapsApiKey === "string" &&
    googleMapsApiKey.trim().startsWith("AIza") &&
    googleMapsApiKey.trim().length >= 35;

  return (
    <html lang="en">
      <head>
        {shouldLoadGoogleMaps && (
          <script
            async
            defer
            src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
          />
        )}
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
