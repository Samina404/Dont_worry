import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Don’t Worry",
  description: "Don’t Worry - A calm and caring mental wellness platform helping you track mood, improve sleep, reduce stress, and feel emotionally balanced.",};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
