import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Pets Corner",
  description:
    "Read the official Terms of Use for Pets Corner. Learn about the rules, responsibilities, and conditions that govern the use of our website, services, and pet-related offerings.",
  keywords: [
    "Pets Corner Terms of Use",
    "pet service agreement",
    "Pets Corner policy",
    "pet adoption terms",
    "pet care India",
    "online pet store rules",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Terms of Use | Pets Corner",
    description:
      "Review Pets Corner’s Terms of Use to understand your rights and responsibilities when accessing our pet services and platform.",
    url: "https://www.mrnmrspet.com/terms-of-use",
    siteName: "Pets Corner",
    images: [
      {
        url: "/terms.webp",
        width: 1200,
        height: 630,
        alt: "Pets Corner Terms of Use",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | Pets Corner",
    description:
      "Official Terms of Use for Pets Corner — covering website access, service usage, and legal obligations.",
    images: ["/terms.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/terms-of-use",
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

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Use | Pets Corner",
    url: "https://www.mrnmrspet.com/terms-of-use",
    description:
      "Pets Corner Terms of Use — outlining the legal terms for using our pet services, website, and digital offerings.",
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
