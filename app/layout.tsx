import type { Metadata } from "next";
import { Syne, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { personal } from "@/lib/data";
import "./globals.css";

const duneRise = localFont({
  src: "../public/fonts/Dune_Rise.otf",
  variable: "--font-dunerise",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sujatkhan.me"),
  title: "Sujat Khan",
  description:
    "I build projects — some for clients, most just because. Creating more than I consume.",
  alternates: {
    canonical: "https://sujatkhan.me",
  },
  keywords: [
    "Sujat Khan",
    "full-stack developer",
    "web developer",
    "designer",
    "software developer",
    "portfolio",
    "React",
    "Next.js",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sujat Khan",
    description:
      "I build projects — some for clients, most just because. Creating more than I consume.",
    url: "https://sujatkhan.me",
    siteName: "Sujat Khan",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sujat Khan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sujat Khan",
    description:
      "I build projects — some for clients, most just because. Creating more than I consume.",
    images: ["/og.png"],
  },
  verification: {
    google: "psQvpSt2m9Rnbs1STJQxu7XLdqvxBg5bWZX3F5JxmNY",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  url: personal.website,
  email: `mailto:${personal.email}`,
  jobTitle: "Full-Stack Developer & Designer",
  description: personal.tagline,
  sameAs: [personal.social.github, personal.social.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${duneRise.variable} ${syne.variable} ${grotesk.variable} ${plexMono.variable} grain antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
