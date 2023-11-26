import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NLLB-CLIP data viewer",
  openGraph: {
    title: "NLLB-CLIP data viewer",
    url: "https://www.nllb-viewer.com/",
    images: [
      {
        url: "https://www.nllb-viewer.com/og.webp",
        width: 1200,
        height: 670,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary",
    creator: "@visheratin",
    images: "https://www.nllb-viewer.com/og.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
