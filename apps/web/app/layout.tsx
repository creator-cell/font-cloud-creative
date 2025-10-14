import "./globals.css";
import { AppProviders } from "@/components/providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Front Cloud Creative",
  description: "Multi-model marketing content that respects your brand voice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="">
        <AppProviders>
          <main className="min-h-screen w-full">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
