import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { ToastProvider } from "../components/Toast";
import CookieConsent from "../components/CookieConsent";
import "./globals.css";
import "./app-layout.css";
import "./auth-layout.css";
import "./dashboard-pages.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: false });

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", preload: false });

export const metadata: Metadata = {
  title: "PremiumID - Real SIM SMS Verification",
  description: "Receive SMS verification codes instantly using real non-VoIP numbers for WhatsApp, Telegram, Google, and 2500+ other services.",
  openGraph: {
    title: "PremiumID - Real SIM SMS Verification",
    description: "Receive SMS verification codes instantly using real non-VoIP numbers for WhatsApp, Telegram, Google, and 2500+ other services.",
    type: "website",
    locale: "en_US",
    siteName: "PremiumID",
  },
  twitter: {
    card: "summary_large_image",
    title: "PremiumID - Real SIM SMS Verification",
    description: "Receive SMS verification codes instantly using real non-VoIP numbers for WhatsApp, Telegram, Google, and 2500+ other services.",
  },
  alternates: {
    canonical: "https://premiumid.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ToastProvider>
            {children}
            <CookieConsent />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
