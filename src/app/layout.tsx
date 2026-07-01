import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Contractly — Your AI Contract Wallet",
    template: "%s · Contractly",
  },
  description:
    "AI-powered contract wallet for freelancers. Store, analyze, sign, track and manage contracts — built for emerging markets.",
  applicationName: "Contractly",
  keywords: ["freelance contract", "e-signature", "AI contract review", "contract management", "Pakistan"],
  authors: [{ name: "Contractly" }],
  openGraph: {
    type: "website",
    siteName: "Contractly",
    title: "Contractly — Your AI Contract Wallet",
    description: "Store, analyze, sign, and track every contract in one place.",
    url: APP_URL,
  },
  twitter: { card: "summary_large_image", title: "Contractly", description: "Your AI contract wallet." },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Contractly" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#534AB7" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
