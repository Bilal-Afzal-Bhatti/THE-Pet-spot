import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Pets Corner",
  description:
    "Learn about Pets Corner’s Shipping Policy, including delivery timelines, coverage areas, logistics partners, and order tracking details for pet products and accessories.",
  keywords: [
    "Pets Corner shipping policy",
    "pet product delivery India",
    "pet accessories shipping",
    "Pets Corner logistics",
    "pet food delivery",
    "order tracking pets",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Shipping Policy | Pets Corner",
    description:
      "Understand Pets Corner’s shipping and delivery policy — covering order processing, fulfillment timelines, and regional availability across India.",
    url: "https://www.mrnmrspet.com/shipping-policy",
    siteName: "Pets Corner",
    images: [
      {
        url: "/terms.webp",
        width: 1200,
        height: 630,
        alt: "Shipping Policy - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Policy | Pets Corner",
    description:
      "Learn about shipping timelines, regions served, and delivery process at Pets Corner – India’s trusted online pet care and product store.",
    images: ["/terms.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/shipping-policy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
 "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "Pet Services",
};

export default function ShippingPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shipping Policy | Pets Corner",
    url: "https://www.mrnmrspet.com/shipping-policy",
    description:
      "Official Shipping Policy of Pets Corner outlining delivery timelines, order processing, and logistics coverage across India.",
    publisher: {
      "@type": "Organization",
      name: "Pets Corner",
      url: "https://www.mrnmrspet.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mrnmrspet.com/logo.png",
      },
    },
    mainEntity: {
      "@type": "Organization",
      name: "Pets Corner",
      sameAs: [
        "https://www.facebook.com/mrnmrspet",
        "https://www.instagram.com/mrnmrspet",
        "https://twitter.com/mrnmrspet",
      ],
    },
    potentialAction: {
      "@type": "ReadAction",
      target: "https://www.mrnmrspet.com/shipping-policy",
    },
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
