import type { Metadata } from "next";
import type { ReactNode } from "react";

type SegmentsLayoutProps = {
  children: ReactNode;
};

// Helper to format slug into readable text
const formatSlug = (s: string) => {
  if (!s) return "";
  return s
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Generate metadata dynamically based on URL segments
export async function generateMetadata({
  params,
}: {
  params: { segments: string[] };
}): Promise<Metadata> {
  const segments = params.segments || [];

  // Extract breed and city from segments
  let breed = "";
  let city = "";

  if (segments.length > 0 && segments[0] !== "for-sale") {
    breed = formatSlug(segments[0]);
  }

  const inIndex = segments.indexOf("in");
  if (inIndex !== -1 && segments[inIndex + 1]) {
    city = formatSlug(segments[inIndex + 1]);
  }

  // Title & description
  const title = `${breed || "Dogs"} Puppies & Dogs for Sale${
    city ? ` in ${city}` : ""
  } | Pets Corner`;

  const description = `Browse verified ${
    breed || "dogs"
  } puppies and dogs for sale${
    city ? ` in ${city}` : ""
  } on Pets Corner. Trusted breeders and pet parents across Pakistan.`;

  // Build canonical URL
  const baseUrl = "https://www.mrnmrspet.com";
  const canonical =
    segments.length > 0
      ? `${baseUrl}/dogs/${segments.join("/")}`
      : `${baseUrl}/dogs/for-sale`;

  // Keywords
  const keywords = [
    breed ? `${breed} for sale` : "dogs for sale",
    city ? `dogs in ${city}` : "dogs in Pakistan",
    breed ? `${breed} puppies` : "puppies",
    "pet adoption Pakistan",
    "buy dogs online",
    breed || "dogs",
  ].join(", ");

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Pets Corner",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${breed || "Dogs"} for sale`,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Layout component
export default function DogsSegmentsLayout({ children }: SegmentsLayoutProps) {
  return <>{children}</>;
}
