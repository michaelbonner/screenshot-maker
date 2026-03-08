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

export const metadata: Metadata = {
  title: "Screenshot Maker",
  description: "Make screenshots of your website",
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
          data-color="#111827"
        />
      </body>
    </html>
  );
}
