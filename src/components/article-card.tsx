import Link from "next/link";
import { Clock, Calendar, Eye, Heart } from "lucide-react";
import { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  post: Post;
  variant?: "standard" | "compact" | "horizontal";
}

export function ArticleCard({ post, variant = "standard" }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <article className="group flex gap-4 items-center py-3 border-b border-gray-100 last:border-none">
        <Link href={`/post/${post.slug}`} className="flex-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
            {post.category_name || "Article"}
          </span>
          <h4 className="text-sm font-semibold font-malayalam text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h4>
          <span className="text-[11px] text-muted mt-1 block">
            {formatDate(post.published_at)}
          </span>
        </Link>
        {post.featured_image && (
          <Link
            href={`/post/${post.slug}`}
            className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 block"
          >
            <img
              src={post.featured_image}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:border-accent/25 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
        <Link
          href={`/post/${post.slug}`}
          className="relative w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden bg-gray-100 flex-shrink-0 block"
        >
          <img
            src={post.featured_image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-0.5 rounded-full">
                {post.category_name || "Article"}
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.published_at)}
              </span>
            </div>
            <Link href={`/post/${post.slug}`}>
              <h3 className="text-lg sm:text-xl font-bold font-malayalam text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-secondary font-malayalam line-clamp-2 leading-relaxed mb-4">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-gray-100">
            <span className="font-medium text-primary">{post.author_name}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-accent" />
                {post.read_time}
              </span>
              {post.views_count > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:border-accent/25 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Featured Image */}
      <Link href={`/post/${post.slug}`} className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 block">
        <img
          src={post.featured_image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-accent rounded-lg shadow-sm">
            {post.category_name || "Article"}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-accent" />
              {formatDate(post.published_at)}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent" />
              {post.read_time}
            </span>
          </div>

          <Link href={`/post/${post.slug}`}>
            <h3 className="text-base sm:text-lg font-bold font-malayalam text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-secondary font-malayalam line-clamp-3 leading-relaxed mb-4">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-muted">
          <Link
            href={`/author/${encodeURIComponent(post.author_name)}`}
            className="font-medium text-primary hover:text-accent transition-colors"
          >
            {post.author_name}
          </Link>

          <div className="flex items-center gap-2 text-[11px]">
            {post.views_count > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views_count}
              </span>
            )}
            {post.likes_count > 0 && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                {post.likes_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
