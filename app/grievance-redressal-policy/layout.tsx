import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grievance Redressal Policy | Pets Corner",
  description:
    "Learn about the Grievance Redressal Policy of Pets Corner. Contact the Grievance Officer for any complaints or service-related issues and understand the resolution process.",
  keywords: [
    "grievance redressal",
    "complaint policy",
    "Pets Corner",
    "pet marketplace",
    "customer support",
    "pet services complaint",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Grievance Redressal Policy | Pets Corner",
    description:
      "Access the Grievance Redressal Policy of Pets Corner to understand complaint handling and resolution procedures for all pet-related services and products.",
    url: "https://www.mrnmrspet.com/grievance-redressal",
    siteName: "Pets Corner",
    images: [
      {
        url: "/terms.webp",
        width: 1200,
        height: 630,
        alt: "Grievance Redressal Policy - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grievance Redressal Policy | Pets Corner",
    description:
      "Review our Grievance Redressal Policy and reach out to the Grievance Officer for any complaints or service concerns at Pets Corner.",
    images: ["/terms.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/grievance-redressal",
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

export default function GrievanceRedressalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Grievance Redressal Policy | Pets Corner",
    url: "https://www.mrnmrspet.com/grievance-redressal",
    description:
      "Grievance Redressal Policy of Pets Corner: process for handling complaints related to pets, services, and products on the platform.",
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
      "@type": "ContactPoint",
      contactType: "Customer Service",
      name: "Grievance Officer",
      email: "support@mrnmrspet.com",
      telephone: "+919257022415",
      areaServed: "IN",
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
