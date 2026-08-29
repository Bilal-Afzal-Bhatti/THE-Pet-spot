import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cat Care Tips & Guides | Pets Corner",
  description:
    "Discover expert tips and guides for cat care, grooming, feeding, and health on Pets Corner's Cat Care blog.",
  keywords: [
    "cat care tips",
    "cat grooming",
    "cat health",
    "cat feeding",
    "cat blog",
    "Pets Corner cat blog",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Cat Care Tips & Guides | Pets Corner",
    description:
      "Read our blogs for expert advice on taking care of your cat, including grooming, feeding, and health tips.",
    url: "https://www.mrnmrspet.com/cat-care",
    siteName: "Pets Corner",
    images: [
      {
        url: "/cats-care-hero.webp",
        width: 1200,
        height: 630,
        alt: "Cat Care Blog - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cat Care Tips & Guides | Pets Corner",
    description:
      "Expert cat care guides on grooming, feeding, health, and more at Pets Corner.",
    images: ["/cats-care-hero.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/cat-care",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Cat Care Blog",
};

export default function CatCareLayout({ children }: { children: React.ReactNode }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Cat Care Tips & Guides | Pets Corner",
    url: "https://www.mrnmrspet.com/cat-care",
    publisher: {
      "@type": "Organization",
      name: "Pets Corner",
      url: "https://www.mrnmrspet.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mrnmrspet.com/logo.png",
      },
    },
    mainEntityOfPage: children
      ? React.Children.map(children, (child, index) => ({
          "@type": "BlogPosting",
          headline: (child as any).props?.title || `Cat Blog Post ${index + 1}`,
          datePublished: (child as any).props?.date || new Date().toISOString(),
          url: `https://www.mrnmrspet.com/cat-care#${index + 1}`,
        }))
      : [],
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
