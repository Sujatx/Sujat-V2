import type { Metadata } from "next";
import { Syne, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
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
  title: "Sujat Khan — Full-Stack Developer & Designer",
  description:
    "I build projects — some for clients, most just because. Creating more than I consume.",
  openGraph: {
    title: "Sujat Khan — Full-Stack Developer & Designer",
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
        alt: "Sujat Khan — Full-Stack Developer & Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sujat Khan — Full-Stack Developer & Designer",
    description:
      "I build projects — some for clients, most just because. Creating more than I consume.",
    images: ["/og.png"],
  },
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
        {children}
      </body>
    </html>
  );
}
