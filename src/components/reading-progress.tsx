"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setProgress(Math.min(100, Math.max(0, scrolled)));
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      id="reading-progress"
      className="fixed top-0 left-0 h-[4px] z-[2000] transition-all duration-100 ease-out pointer-events-none"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #FF4D4D 0%, #E62727 100%)",
      }}
    />
  );
}
