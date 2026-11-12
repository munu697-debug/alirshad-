import { notFound } from "next/navigation";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, User, Clock, Eye } from "lucide-react";
import { getPostBySlug, getPosts, getComments } from "@/lib/db-service";
import { formatDate } from "@/lib/utils";
import { LikeButton } from "@/components/like-button";
import { ShareButtons } from "@/components/share-buttons";
import { FontResizer } from "@/components/font-resizer";
import { CommentsSection } from "@/components/comments-section";
import { ArticleCard } from "@/components/article-card";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | Al Irshad" };
  }

  return {
    title: `${post.title} | Al Irshad`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author_name],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [allPosts, comments] = await Promise.all([
    getPosts({ limit: 4 }),
    getComments(post.id),
  ]);

  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in font-sans"
      data-post-id={post.id}
    >
      {/* 1. Article Header */}
      <header className="max-w-4xl mx-auto mb-10 text-center">
        {/* Category Pill */}
        <div className="mb-4">
          <Link
            href={`/category/${post.category_slug || "article"}`}
            className="inline-block px-3 py-1 bg-accent-light text-accent rounded-full text-xs font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors"
          >
            {post.category_name || "Article"}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-malayalam font-bold text-primary leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta details */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-secondary font-medium">
          <Link
            href={`/author/${encodeURIComponent(post.author_name)}`}
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <User className="w-4 h-4 text-accent" />
            <span>{post.author_name}</span>
          </Link>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{formatDate(post.published_at)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-accent" />
            <span>{post.read_time}</span>
          </span>
          {post.views_count > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-accent" />
              <span>{post.views_count} views</span>
            </span>
          )}
        </div>
      </header>

      {/* 2. Featured Image Banner */}
      {post.featured_image && (
        <div className="-mx-4 sm:mx-auto max-w-5xl mb-10 sm:mb-14 rounded-none sm:rounded-3xl overflow-hidden shadow-lg border border-gray-100">
          <div className="relative w-full h-64 sm:h-96 md:h-[480px]">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 3. Grid: Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto">
        {/* Main Editorial Content Column */}
        <div className="lg:col-span-8">
          {/* Action Toolbar above content on desktop */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-8 border-b border-gray-100 gap-4">
            <LikeButton postId={post.id} initialLikes={post.likes_count} />
            <div className="flex items-center gap-4">
              <FontResizer />
              <ShareButtons title={post.title} />
            </div>
          </div>

          {/* Rendered HTML content from Tiptap */}
          <div
            id="article-main-content"
            className="prose prose-lg max-w-none text-base sm:text-lg font-malayalam leading-relaxed text-[#2c3437] select-text"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-gray-100">
              <span className="text-xs font-semibold text-muted mr-1">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-gray-100 text-secondary text-xs rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interactive Comments Section */}
          <CommentsSection postId={post.id} initialComments={comments} />
        </div>

        {/* Sidebar Column */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Author Bio Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent to-brand-azure text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-royal">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-base text-primary mb-1">
              {post.author_name}
            </h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Writer and contributor at Al Irshad. Exploring ideas at the intersection of philosophy, culture, and social reform.
            </p>
            <Link
              href={`/author/${encodeURIComponent(post.author_name)}`}
              className="inline-block px-4 py-1.5 text-xs font-semibold text-accent border border-accent/30 rounded-full hover:bg-accent hover:text-white transition-colors"
            >
              View All Articles
            </Link>
          </div>

          {/* Sticky Container for Related Posts */}
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4 pb-2 border-b border-gray-100">
                Related Reading
              </h4>
              <div className="space-y-2">
                {relatedPosts.map((rPost) => (
                  <ArticleCard key={rPost.id} post={rPost} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Client-side view tracking script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const viewedKey = 'viewed_${post.id}';
              if (!sessionStorage.getItem(viewedKey)) {
                setTimeout(function() {
                  fetch('/api/track-view/${post.id}', { method: 'POST' })
                    .then(function() { sessionStorage.setItem(viewedKey, 'true'); })
                    .catch(function() {});
                }, 3000);
              }
            })();
          `,
        }}
      />
    </article>
  );
}
