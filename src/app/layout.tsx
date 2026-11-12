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
    icon: "/favicon.webp",
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
        <link rel="icon" href="/favicon.webp" />
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
