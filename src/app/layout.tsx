import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Focus Flow | Your Flow State Companion",
  description: "A productivity dashboard designed to help you achieve flow state through immersive interaction modes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
