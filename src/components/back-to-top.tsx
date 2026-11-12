"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-40 p-3 bg-white text-primary border border-gray-200/80 rounded-full shadow-xl hover:bg-accent hover:text-white hover:border-accent hover:shadow-royal transition-all duration-300 transform hover:scale-105 active:scale-95"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
