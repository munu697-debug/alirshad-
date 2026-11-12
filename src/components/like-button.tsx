"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch(`/api/like/${postId}`, { method: "POST" });
      const data = await res.json();
      if (data.count !== undefined) {
        setLikes(data.count);
        setLiked(data.liked);
      }
    } catch {
      // Revert if error
      setLiked(!nextLiked);
      setLikes((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      aria-label="Like article"
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 font-medium text-xs sm:text-sm ${
        liked
          ? "bg-accent-light text-accent border-accent/40 shadow-royal"
          : "bg-white text-secondary border-gray-200 hover:border-accent/40 hover:text-accent hover:bg-accent-light/40"
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-300 ${
          liked ? "fill-accent text-accent scale-110" : ""
        }`}
      />
      <span id="likes-count">{likes}</span>
      <span className="hidden sm:inline">Likes</span>
    </button>
  );
}
