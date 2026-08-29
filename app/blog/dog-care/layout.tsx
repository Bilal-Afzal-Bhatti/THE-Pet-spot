import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dog Care Tips & Guides | Pets Corner",
  description:
    "Discover expert tips and guides for dog care, grooming, feeding, and health on Pets Corner's Dog Care blog.",
  keywords: [
    "dog care tips",
    "dog grooming",
    "dog health",
    "dog feeding",
    "dog blog",
    "Pets Corner dog blog",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Dog Care Tips & Guides | Pets Corner",
    description:
      "Read our blogs for expert advice on taking care of your dog, including grooming, feeding, and health tips.",
    url: "https://www.mrnmrspet.com/dog-care",
    siteName: "Pets Corner",
    images: [
      {
        url: "/dogs-care-hero.webp",
        width: 1200,
        height: 630,
        alt: "Dog Care Blog - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dog Care Tips & Guides | Pets Corner",
    description:
      "Expert dog care guides on grooming, feeding, health, and more at Pets Corner.",
    images: ["/dogs-care-hero.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/dog-care",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Dog Care Blog",
};

export default function DogCareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Dog Care Tips & Guides | Pets Corner",
    url: "https://www.mrnmrspet.com/dog-care",
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
          headline: (child as any).props?.title || `Dog Blog Post ${index + 1}`,
          datePublished: (child as any).props?.date || new Date().toISOString(),
          url: `https://www.mrnmrspet.com/dog-care#${index + 1}`,
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
