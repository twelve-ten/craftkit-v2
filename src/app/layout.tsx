import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://craftkit.tools"),
  title: {
    default: "CraftKit - Free Tools for Makers",
    template: "%s | CraftKit",
  },
  description: "Beautiful, free web tools. Screenshot beautifier, invoice generator, QR codes, privacy policies. No signup required.",
  keywords: ["screenshot tool", "invoice generator", "QR code maker", "privacy policy generator", "free tools", "maker tools"],
  authors: [{ name: "CraftKit" }],
  creator: "CraftKit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "CraftKit - Free Tools for Makers",
    description: "Beautiful, free web tools. No signup required.",
    type: "website",
    url: "https://craftkit.tools",
    siteName: "CraftKit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CraftKit - Free Tools for Makers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CraftKit - Free Tools for Makers",
    description: "Beautiful, free web tools. No signup required.",
    images: ["/og-image.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CraftKit",
              description: "Beautiful, free web tools for makers. Screenshot beautifier, invoice generator, QR codes, privacy policies.",
              applicationCategory: "Utility",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              url: "https://craftkit.tools",
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
