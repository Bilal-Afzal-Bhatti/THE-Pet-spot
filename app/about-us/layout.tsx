import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Pets Corner",
  description:
    "Learn about Pets Corner — our mission, services, and commitment to pet care. We provide trusted grooming, training, boarding, and pet products across India.",
  keywords: [
    "about us",
    "Pets Corner",
    "pet care services",
    "pet grooming",
    "pet boarding",
    "dog care",
    "cat care",
    "pet products",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "About Us | Pets Corner",
    description:
      "Discover Pets Corner's mission, services, and commitment to quality pet care across India.",
    url: "https://www.mrnmrspet.com/about-us",
    siteName: "Pets Corner",
    images: [
      {
        url: "/aboutBg.webp",
        width: 1200,
        height: 630,
        alt: "About Us - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Pets Corner",
    description:
      "Learn about Pets Corner, our mission, services, and trusted pet care solutions across India.",
    images: ["/aboutBg.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/about-us",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "About Us",
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    description:
      "Pets Corner provides trusted pet care services including grooming, training, boarding, and a variety of pet products across India.",
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
      <body>{children}</body>
    </html>
  );
}
