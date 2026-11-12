import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { User, BookOpen } from "lucide-react";
import { getPosts } from "@/lib/db-service";
import { ArticleCard } from "@/components/article-card";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const authorName = decodeURIComponent(slug);
  return {
    title: `${authorName} | Al Irshad`,
    description: `Articles written by ${authorName} on Al Irshad.`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const authorName = decodeURIComponent(slug);
  const posts = await getPosts({ authorName });

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      {/* Author Profile Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-card mb-12 text-center max-w-3xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent to-brand-azure text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-royal">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-primary mb-2">
          {authorName}
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-lg mx-auto leading-relaxed mb-4">
          Contributing author at Al Irshad. Writings focused on cultural critique, literature, religion, and contemporary politics.
        </p>
        <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-secondary">
          {posts.length} {posts.length === 1 ? "article" : "articles"} published
        </span>
      </div>

      {/* Grid of author's articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
