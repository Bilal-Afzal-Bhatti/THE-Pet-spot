import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Pets Corner",
  description:
    "Read Pets Corner’s Refund and Cancellation Policy covering eligibility for returns, partial refunds, service cancellations, and non-refundable conditions for pet products and services.",
  keywords: [
    "Pets Corner refund policy",
    "pet services cancellation",
    "return policy Pets Corner",
    "pet product refunds India",
    "pet food return policy",
    "online pet shop refund",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Refund & Cancellation Policy | Pets Corner",
    description:
      "Understand Pets Corner’s refund, return, and cancellation policy for pet-related services and products — ensuring transparency and trust for every order.",
    url: "https://www.mrnmrspet.com/refund-policy",
    siteName: "Pets Corner",
    images: [
      {
        url: "/terms.webp",
        width: 1200,
        height: 630,
        alt: "Refund and Cancellation Policy - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund & Cancellation Policy | Pets Corner",
    description:
      "Review Pets Corner’s refund and cancellation terms for pet products, grooming, training, and boarding services across India.",
    images: ["/terms.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/refund-policy",
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

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RefundPolicy",
    name: "Refund & Cancellation Policy | Pets Corner",
    url: "https://www.mrnmrspet.com/refund-policy",
    description:
      "Official Refund and Cancellation Policy of Pets Corner covering refunds, returns, and service cancellations for pet care products and services.",
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
      target: "https://www.mrnmrspet.com/refund-policy",
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
