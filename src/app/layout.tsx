import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://screenshot-maker.bootpack.dev";
const title = "Screenshot Maker";
const description = "Screenshot any URL with a single API call.";

// opengraph-image.png / twitter-image.png / icon.svg / apple-icon.png sit
// alongside this file, so Next wires the tags up from the file conventions.
// metadataBase is what turns those into the absolute URLs crawlers need.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
        <script
          async
          src="https://easycustomerfeedback.com/widget/c7ed6cd8dc304e1c94c3a1abeae633c2/embed"
          data-label="Send feedback"
          data-position="right"
          data-color="#524edd"
        />
      </body>
    </html>
  );
}
