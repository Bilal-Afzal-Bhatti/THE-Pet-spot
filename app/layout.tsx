import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import LayoutContent from "./components/LayoutContent";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
  display: "swap", // Prevents layout shifts during font loading
});

export const metadata: Metadata = {
  title: "Pets Corner | Trusted Pet Care & Marketplace in India",
  description:
    "Pets Corner offers trusted pet care services, adoption support, and a wide range of pets and pet products across India.",
  keywords: [
    "Pets Corner",
    "pet care India",
    "pets for sale",
    "dog grooming",
    "cat care",
    "pet adoption",
    "pet products online",
    "pet services",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Pets Corner | Trusted Pet Care & Marketplace in India",
    description:
      "Discover Pets Corner — trusted pet care, adoption support, and a marketplace for pets and pet products across India.",
    url: "https://www.mrnmrspet.com",
    siteName: "Pets Corner",
    images: [{ url: "/aboutBg.webp", width: 1200, height: 630, alt: "Pets Corner" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pets Corner | Trusted Pet Care & Marketplace in India",
    description:
      "Explore trusted pet care, adoption support, and a wide range of pets and pet products at Pets Corner.",
    images: ["/aboutBg.webp"],
    creator: "@mrnmrspet",
  },
  alternates: { canonical: "https://www.mrnmrspet.com" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pets Corner",
    url: "https://www.mrnmrspet.com",
    logo: "https://www.mrnmrspet.com/logo.png",
    sameAs: [
      "https://www.facebook.com/mrnmrspet",
      "https://www.instagram.com/mrnmrspet",
      "https://twitter.com/mrnmrspet",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+919257022415",
        contactType: "Customer Service",
        email: "support@mrnmrspet.com",
        areaServed: "IN",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={`${raleway.variable} antialiased`} suppressHydrationWarning>
        {/* Single root container reduces direct body children to 2 */}
        <div id="app-root" className="min-h-screen flex flex-col">
          <Toaster position="top-center" reverseOrder={false} />
          <LayoutContent>{children}</LayoutContent>
        </div>
      </body>
    </html>
  );
}