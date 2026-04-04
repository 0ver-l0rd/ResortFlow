import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResortFlow",
  description: "Manage All Your Social Media In One Place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={outfit.className}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] flex flex-col antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
