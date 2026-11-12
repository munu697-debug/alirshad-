"use client";

import { useState, useEffect } from "react";

export function FontResizer() {
  const [sizeLevel, setSizeLevel] = useState<"normal" | "large" | "xlarge">("normal");

  useEffect(() => {
    const contentEl = document.getElementById("article-main-content");
    if (!contentEl) return;

    contentEl.classList.remove("text-base", "text-lg", "text-xl", "text-[21px]");

    if (sizeLevel === "normal") {
      contentEl.classList.add("text-base", "sm:text-lg");
    } else if (sizeLevel === "large") {
      contentEl.classList.add("text-lg", "sm:text-xl");
    } else if (sizeLevel === "xlarge") {
      contentEl.classList.add("text-xl", "sm:text-[21px]");
    }
  }, [sizeLevel]);

  return (
    <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl text-xs font-semibold text-secondary">
      <button
        onClick={() => setSizeLevel("normal")}
        className={`px-2.5 py-1 rounded-lg transition-colors ${
          sizeLevel === "normal" ? "bg-white text-primary shadow-xs" : "hover:text-primary"
        }`}
        title="Normal font size"
      >
        A
      </button>
      <button
        onClick={() => setSizeLevel("large")}
        className={`px-2.5 py-1 rounded-lg transition-colors ${
          sizeLevel === "large" ? "bg-white text-primary shadow-xs" : "hover:text-primary"
        }`}
        title="Large font size"
      >
        A+
      </button>
      <button
        onClick={() => setSizeLevel("xlarge")}
        className={`px-2.5 py-1 rounded-lg transition-colors ${
          sizeLevel === "xlarge" ? "bg-white text-primary shadow-xs" : "hover:text-primary"
        }`}
        title="Extra large font size"
      >
        A++
      </button>
    </div>
  );
}
