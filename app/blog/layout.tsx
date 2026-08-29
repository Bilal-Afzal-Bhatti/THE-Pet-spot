import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Pet Blogs | Pets Corner",
  description:
    "Read informative blogs about pet care, training, grooming, adoption, and tips for cats and dogs at Pets Corner.",
  keywords: [
    "pet blogs",
    "dog care tips",
    "cat care tips",
    "pet training",
    "pet grooming",
    "pet adoption",
    "Pets Corner blogs",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Pet Blogs | Pets Corner",
    description:
      "Explore our blogs covering pet care, grooming, training, adoption tips for cats and dogs.",
    url: "https://www.mrnmrspet.com/blogs",
    siteName: "Pets Corner",
    images: [
      {
        url: "/blogHero.webp",
        width: 1200,
        height: 630,
        alt: "Pet Blogs - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Blogs | Pets Corner",
    description:
      "Read expert blogs on pet care, adoption, grooming, and training for cats and dogs.",
    images: ["/blogHero.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/blogs",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Pet Blogs",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Pet Blogs | Pets Corner",
    url: "https://www.mrnmrspet.com/blogs",
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
          headline: (child as any).props?.title || `Blog Post ${index + 1}`,
          datePublished: (child as any).props?.date || new Date().toISOString(),
          url: `https://www.mrnmrspet.com/blogs#${index + 1}`,
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
