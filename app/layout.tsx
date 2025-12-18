import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-context";
import { SupabaseProvider } from "@/components/supabase-context";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmSans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReboLabs - Monetize Your App or Website",
  description: "Turn your users into revenue. With ReboLabs, easily add surveys to your app or website and start earning today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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
