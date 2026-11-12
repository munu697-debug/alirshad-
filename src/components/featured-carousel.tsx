"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Calendar, User } from "lucide-react";
import { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface FeaturedCarouselProps {
  posts: Post[];
}

export function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (!posts || posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  return (
    <div className="relative w-full aspect-video md:aspect-auto md:h-[340px] mb-12 sm:mb-16 overflow-hidden bg-gray-900 group rounded-2xl sm:rounded-3xl shadow-xl">
      {/* Background Image */}
      <div className="relative w-full h-full">
        <img
          src={currentPost.featured_image}
          alt={currentPost.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Dark Editorial Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 pointer-events-none" />
      </div>

      {/* Slide Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          {/* Category & Date badge */}
          <div className="flex items-center gap-3 text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-2.5">
            <span className="px-2.5 py-1 bg-accent text-white rounded-md text-[10px] font-semibold tracking-wider">
              {currentPost.category_name || "Feature"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-accent" />
              {formatDate(currentPost.published_at)}
            </span>
            <span className="flex items-center gap-1 hidden sm:flex">
              <Clock className="w-3 h-3 text-accent" />
              {currentPost.read_time}
            </span>
          </div>

          {/* Title */}
          <Link href={`/post/${currentPost.slug}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-brand-yellow font-malayalam leading-snug line-clamp-2 transition-colors mb-2">
              {currentPost.title}
            </h2>
          </Link>

          {/* Author */}
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="flex items-center gap-1 font-medium">
              <User className="w-3.5 h-3.5 text-accent" />
              {currentPost.author_name}
            </span>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      {posts.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 right-4 sm:right-8 flex space-x-1.5 z-10">
            {posts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-6 bg-accent" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
