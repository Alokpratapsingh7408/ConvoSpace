import type { Metadata } from "next";
import "../styles/globals.css";
import StoreInitializer from "@/components/providers/StoreInitializer";

export const metadata: Metadata = {
  title: "ConvoSpace - Modern Chat Application",
  description: "A real-time chat application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}
