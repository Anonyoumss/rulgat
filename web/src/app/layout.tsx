import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProgressProvider } from "@/components/ProgressProvider";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "رولقات | RulGAT — أكبر عمل في تاريخ القدرات",
  description:
    "RulGAT — the biggest Qudrat (GAT) prep platform: Al-Moasser 11 curriculum, 6000+ questions, gamified learning, Qiyas-style mock tests.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen pb-24">
        <ThemeProvider>
          <I18nProvider>
            <ProgressProvider>{children}</ProgressProvider>
            <BottomNav />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
