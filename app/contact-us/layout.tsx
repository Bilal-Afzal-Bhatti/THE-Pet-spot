import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Pets Corner",
  description:
    "Get in touch with Pets Corner for inquiries, feedback, or support. Reach out via email, phone, or visit our office in Jaipur, Rajasthan.",
  keywords: [
    "contact Pets Corner",
    "pet support",
    "pet service contact",
    "feedback",
    "customer support",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Contact Us | Pets Corner",
    description:
      "Reach out to Pets Corner for inquiries, support, or feedback regarding our pet services and products.",
    url: "https://www.mrnmrspet.com/contact",
    siteName: "Pets Corner",
    images: [
      {
        url: "/contact.webp",
        width: 1200,
        height: 630,
        alt: "Contact Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Pets Corner",
    description:
      "Contact Pets Corner via email, phone, or visit our office in Jaipur, Rajasthan for pet-related inquiries.",
    images: ["/contact.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/contact",
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
  category: "Contact Page",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pets Corner",
    url: "https://www.mrnmrspet.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.mrnmrspet.com/logo.png",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919257022415",
      contactType: "customer support",
      email: "support@mrnmrspet.com",
      areaServed: "IN",
    },
    sameAs: [
      "https://www.facebook.com/mrnmrspet",
      "https://www.instagram.com/mrnmrspet",
      "https://twitter.com/mrnmrspet",
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
