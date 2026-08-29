import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Pets Corner",
  description:
    "Read the official Privacy Policy of Pets Corner to learn how we collect, process, store, and protect your personal data in compliance with the Digital Personal Data Protection Act, 2023.",
  keywords: [
    "Pets Corner privacy policy",
    "pet data protection",
    "pet service data usage",
    "Pets Corner data privacy",
    "Digital Personal Data Protection Act compliance",
    "pet website privacy policy",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Privacy Policy | Pets Corner",
    description:
      "Pets Corner’s Privacy Policy explains how we collect, use, and safeguard your information under India’s data protection laws.",
    url: "https://www.mrnmrspet.com/privacy-policy",
    siteName: "Pets Corner",
    images: [
      {
        url: "/Blog/blog.webp",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Pets Corner",
    description:
      "Learn how Pets Corner protects your privacy and manages your personal data responsibly and securely.",
    images: ["/Blog/blog.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/privacy-policy",
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
  category: "Privacy Policy",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Privacy Policy | Pets Corner",
    url: "https://www.mrnmrspet.com/privacy-policy",
    description:
      "Official Privacy Policy of Pets Corner detailing how we handle, store, and use customer information in compliance with Indian data protection laws.",
    publisher: {
      "@type": "Organization",
      name: "Pets Corner",
      url: "https://www.mrnmrspet.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mrnmrspet.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.mrnmrspet.com/privacy-policy",
    },
    potentialAction: {
      "@type": "ReadAction",
      target: "https://www.mrnmrspet.com/privacy-policy",
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
    