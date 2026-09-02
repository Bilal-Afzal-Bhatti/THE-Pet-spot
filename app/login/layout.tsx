import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Pets Corner",
  description:
    "Login to your Pets Corner account to explore verified pets for sale, adoption, grooming, and more. Manage your profile and enjoy personalized pet care services.",
  keywords: [
    "login",
    "Pets Corner",
    "pet store login",
    "pet adoption India",
    "buy pets online",
    "pet marketplace account",
    "pet care services",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Login | Pets Corner",
    description:
      "Access your Pets Corner account — your trusted platform for buying, adopting, and caring for pets.",
    url: "https://www.mrnmrspet.com/login",
    siteName: "Pets Corner",
    images: [
      {
        url: "/signup-bg.webp",
        width: 1200,
        height: 630,
        alt: "Login - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Pets Corner",
    description:
      "Login to your Pets Corner account and discover thousands of verified pets and services near you.",
    images: ["/signup-bg.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/login",
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Login | Pets Corner",
    url: "https://www.mrnmrspet.com/login",
    description:
      "Login securely to your Pets Corner account to manage your pets, explore services, and connect with verified breeders and pet parents.",
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
      name: "Pets Corner User Account",
      description:
        "Registered users can access pet listings, manage their profiles, and post pet ads on Pets Corner.",
      url: "https://www.mrnmrspet.com/login",
      sameAs: [
        "https://www.facebook.com/mrnmrspet",
        "https://www.instagram.com/mrnmrspet",
        "https://x.com/mrnmrspet",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {children}
    </>
  );
}