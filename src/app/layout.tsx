import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getCurrentUser, toPublicUser } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KAYE | Fall/Winter 2026 Collection",
  description:
    "Discover the new KAYE Fall/Winter 2026 collection. Redefining modern elegance through minimalist design, premium materials, and bold silhouettes.",
  keywords: [
    "fashion",
    "luxury",
    "kaye",
    "collection",
    "fall winter",
    "minimalist",
  ],
  openGraph: {
    title: "KAYE | Fall/Winter 2026 Collection",
    description: "Redefining modern elegance.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const initialUser = user ? toPublicUser(user) : null;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-black text-white antialiased">
        <Providers initialUser={initialUser}>{children}</Providers>
      </body>
    </html>
  );
}
