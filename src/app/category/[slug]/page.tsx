import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getPosts } from "@/lib/db-service";
import { ArticleCard } from "@/components/article-card";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!category) {
    return { title: "Category Not Found | Al Irshad" };
  }

  return {
    title: `${category.name} | Al Irshad`,
    description: category.description || `Articles and essays on ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!category) {
    notFound();
  }

  const posts = await getPosts({ categorySlug: category.slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      {/* Category Header */}
      <div className="bg-surface rounded-3xl p-8 sm:p-12 border border-gray-100 mb-12 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 inline-block">
          Category
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans text-primary mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-secondary max-w-xl mx-auto leading-relaxed mb-4">
            {category.description}
          </p>
        )}
        <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-secondary">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {/* Articles Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-secondary">
            No articles found under {category.name} yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
