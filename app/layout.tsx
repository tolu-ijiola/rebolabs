import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-context";
import { SupabaseProvider } from "@/components/supabase-context";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rebolabs.ai'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Rebolabs - Offerwall Monetization for Apps and Websites",
    template: "%s | Rebolabs",
  },
  description: "Rebolabs helps app and web publishers integrate rewarded offerwalls, track performance, validate postbacks, and receive monthly Net 30 payouts.",
  keywords: ["offerwall monetization", "rewarded offers", "app monetization", "website monetization", "postback validation", "publisher payouts"],
  authors: [{ name: "Rebolabs" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Rebolabs",
    title: "Rebolabs - Offerwall Monetization for Apps and Websites",
    description: "Integrate rewarded offerwalls, track performance, validate postbacks, and receive monthly Net 30 payouts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebolabs - Offerwall Monetization for Apps and Websites",
    description: "Rewarded offerwall monetization with analytics, postbacks, and monthly Net 30 payouts.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          
          <ErrorBoundary>
            <SupabaseProvider>
              <AuthProvider>
                {children}
                <Toaster position="top-center"/>
              </AuthProvider>
            </SupabaseProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
