import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReadingProgress } from "@/components/reading-progress";
import { BackToTop } from "@/components/back-to-top";

export const metadata: Metadata = {
  title: "Home | Al Irshad",
  description: "Al Irshad - Malayalam articles, literature, stories, and thought-provoking blog posts.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.webp", type: "image/webp" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link
          rel="preload"
          href="/Manjari/Manjari-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/Manjari/Manjari-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/Noto_Serif_Malayalam/NotoSerifMalayalam-VariableFont_wght.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased selection:bg-accent/20 selection:text-accent">
        <ReadingProgress />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
