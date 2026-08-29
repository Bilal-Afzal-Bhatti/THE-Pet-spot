import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Pets Corner",
  description:
    "Create your free account on Pets Corner to book grooming, training, and pet care services. Join our trusted community of pet parents and professionals today.",
  keywords: [
    "Pets Corner signup",
    "create pet account",
    "join Pets Corner",
    "pet parent registration",
    "pet grooming booking",
    "pet care login",
  ],
  authors: [{ name: "Pets Corner", url: "https://www.mrnmrspet.com" }],
  creator: "Pets Corner",
  publisher: "Pets Corner",
  openGraph: {
    title: "Sign Up | Pets Corner",
    description:
      "Join Pets Corner – India’s trusted pet platform for adoption, grooming, training, and more. Create your account today and start your pet journey.",
    url: "https://www.mrnmrspet.com/signup",
    siteName: "Pets Corner",
    images: [
      {
        url: "/signup-bg.webp",
        width: 1200,
        height: 630,
        alt: "Sign Up - Pets Corner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Pets Corner",
    description:
      "Join Pets Corner – your one-stop platform for pet adoption, grooming, and care services across India.",
    images: ["/signup-bg.webp"],
    creator: "@mrnmrspet",
  },
  alternates: {
    canonical: "https://www.mrnmrspet.com/signup",
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

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sign Up | Pets Corner",
    url: "https://www.mrnmrspet.com/signup",
    description:
      "User registration page for Pets Corner – where pet lovers and service providers can join our growing community.",
    potentialAction: {
      "@type": "RegisterAction",
      target: "https://www.mrnmrspet.com/signup",
      name: "Sign Up",
    },
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
