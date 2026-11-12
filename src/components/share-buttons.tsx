"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${getShareUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(title);
    const link = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${link}`, "_blank");
  };

  const shareFacebook = () => {
    const link = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-secondary mr-1 hidden sm:inline">
        Share:
      </span>

      <button
        onClick={shareWhatsApp}
        aria-label="Share on WhatsApp"
        className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
      >
        <span className="text-xs font-bold font-mono">WA</span>
      </button>

      <button
        onClick={shareTwitter}
        aria-label="Share on X"
        className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <span className="text-xs font-bold font-mono">X</span>
      </button>

      <button
        onClick={shareFacebook}
        aria-label="Share on Facebook"
        className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
      >
        <span className="text-xs font-bold font-mono">FB</span>
      </button>

      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="p-2 rounded-full bg-gray-100 text-secondary hover:bg-gray-200 transition-colors relative"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <LinkIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
