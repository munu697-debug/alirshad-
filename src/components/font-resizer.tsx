"use client";

import { useState, useEffect } from "react";

type SizeLevel = "normal" | "large" | "xlarge";

const SIZE_CONFIG: Record<SizeLevel, { size: string; line: string }> = {
  normal: { size: "1.125rem", line: "1.9" },    // 18px - Regular reading
  large: { size: "1.375rem", line: "2.05" },    // 22px - Large
  xlarge: { size: "1.6875rem", line: "2.2" },   // 27px - Extra large
};

export function FontResizer() {
  const [sizeLevel, setSizeLevel] = useState<SizeLevel>("normal");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alirshad-article-font-size") as SizeLevel | null;
      if (saved && SIZE_CONFIG[saved]) {
        setSizeLevel(saved);
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  useEffect(() => {
    const contentEl = document.getElementById("article-main-content");
    if (!contentEl) return;

    const { size, line } = SIZE_CONFIG[sizeLevel];
    contentEl.style.setProperty("--article-font-size", size);
    contentEl.style.setProperty("--article-line-height", line);

    try {
      localStorage.setItem("alirshad-article-font-size", sizeLevel);
    } catch {
      // Ignore storage errors
    }
  }, [sizeLevel]);

  return (
    <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl text-xs font-semibold text-secondary">
      <button
        type="button"
        onClick={() => setSizeLevel("normal")}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          sizeLevel === "normal"
            ? "bg-white text-primary shadow-xs font-bold"
            : "text-secondary hover:text-primary"
        }`}
        title="Normal font size (18px)"
        aria-label="Normal font size"
      >
        A
      </button>
      <button
        type="button"
        onClick={() => setSizeLevel("large")}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          sizeLevel === "large"
            ? "bg-white text-primary shadow-xs font-bold"
            : "text-secondary hover:text-primary"
        }`}
        title="Large font size (22px)"
        aria-label="Large font size"
      >
        A+
      </button>
      <button
        type="button"
        onClick={() => setSizeLevel("xlarge")}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          sizeLevel === "xlarge"
            ? "bg-white text-primary shadow-xs font-bold"
            : "text-secondary hover:text-primary"
        }`}
        title="Extra large font size (27px)"
        aria-label="Extra large font size"
      >
        A++
      </button>
    </div>
  );
}
