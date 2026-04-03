import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Copilot",
  description: "Manage All Your Social Media In One Place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={outfit.className}
      >
        <body className="min-h-[100dvh] flex flex-col antialiased bg-[#0a0a0f] text-white overflow-hidden">{children}</body>
      </html>
    </ClerkProvider>
  );
}
