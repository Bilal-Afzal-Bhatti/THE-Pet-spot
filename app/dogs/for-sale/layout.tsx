import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dogs for Sale | Pets Corner",
  description:
    "Browse verified listings of dogs for sale from responsible breeders and pet parents across India. Find your perfect furry companion with Pets Corner.",
  keywords: [
    "dogs for sale",
    "puppies for sale",
    "dog breeders India",
    "pet marketplace",
    "Pets Corner",
    "buy dogs online",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Dogs for Sale | Pets Corner",
    description:
      "Find and adopt your next furry friend from verified listings of dogs for sale across India at Pets Corner.",
    url: "https://www.mrnmrspet.com/dogs-for-sale",
    siteName: "Pets Corner",
    images: [
      {
        url: "/dogs-for-sale/hero.webp",
        width: 1200,
        height: 630,
        alt: "Dogs for Sale - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dogs for Sale | Pets Corner",
    description:
      "Explore verified listings of dogs for sale from trusted breeders and pet parents on Pets Corner.",
    images: ["/dogs-for-sale/hero.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/dogs/for-sale",
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
  category: "Pet Marketplace",
};

export default function DogsForSaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Dogs for Sale | Pets Corner",
    url: "https://www.mrnmrspet.com/dogs-for-sale",
    description:
      "Verified listings of dogs for sale across India. Find puppies and adult dogs from trusted breeders and pet parents with Pets Corner.",
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
      "@type": "ItemList",
      name: "Dogs for Sale Listings",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "Puppies for Sale",
            category: "Dog",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: "Adult Dogs for Sale",
            category: "Dog",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Product",
            name: "Breed-Specific Dogs",
            category: "Dog",
          },
        },
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
