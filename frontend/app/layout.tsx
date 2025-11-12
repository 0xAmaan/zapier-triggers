import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "../components/layout/MainLayout";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Zapier Triggers",
  description: "Real-time event ingestion system for Zapier workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <MainLayout>{children}</MainLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
