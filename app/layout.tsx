import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "E-Library System",
    template: "%s | E-Library",
  },
  description:
    "E-Library Management System for browsing, borrowing, and managing books",
  applicationName: "E-Library",
  generator: "Next.js",
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: [
      {
        url: "/book-light-32x32.png",
        media: "(prefers-color-scheme: light)",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/book-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/book.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geist.variable}
          ${geistMono.variable}
          min-h-screen
          bg-background
          font-sans
          antialiased
        `}
      >
        {children}

        {/* Global UI */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
