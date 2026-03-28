import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "pustack",
  description: "Interactive learning platform for computer science and distributed systems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
