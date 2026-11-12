import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, BookOpen } from "lucide-react";
import { getPosts, getCategories } from "@/lib/db-service";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { ArticleCard } from "@/components/article-card";

export const revalidate = 60;

export default async function HomePage() {
  const allPosts = await getPosts();
  const categories = await getCategories();

  const featuredPosts = allPosts.filter((p) => p.is_featured);
  const latestPosts = allPosts.slice(0, 6);

  // Group some posts by prominent categories
  const politicsPosts = allPosts.filter((p) => p.category_slug === "politics");
  const religionPosts = allPosts.filter((p) => p.category_slug === "religion");
  const culturePosts = allPosts.filter((p) => p.category_slug === "culture");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-fade-in">
      {/* 1. Hero Featured Carousel */}
      <FeaturedCarousel posts={featuredPosts.length > 0 ? featuredPosts : latestPosts.slice(0, 3)} />

      {/* 2. Latest Stories Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-primary tracking-tight">
              Latest Stories
            </h2>
          </div>
          <Link
            href="/archive"
            className="text-xs sm:text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1 group"
          >
            <span>View Archive</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {latestPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* 3. Featured Editorial Category Block (Religion & Philosophy) */}
      {religionPosts.length > 0 && (
        <section className="mb-16 bg-surface p-6 sm:p-10 rounded-3xl border border-gray-100">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-1">
                Theology & Discourses
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-primary">
                Religion & Ethics
              </h2>
            </div>
            <Link
              href="/category/religion"
              className="text-xs sm:text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <ArticleCard post={religionPosts[0]} variant="standard" />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {allPosts
                .filter((p) => p.category_slug === "philosophy" || p.id !== religionPosts[0].id)
                .slice(0, 3)
                .map((post) => (
                  <ArticleCard key={post.id} post={post} variant="compact" />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Culture & Heritage Section */}
      {culturePosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-200/80">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-primary">
                Culture & Heritage
              </h2>
            </div>
            <Link
              href="/category/culture"
              className="text-xs sm:text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {culturePosts.map((post) => (
              <ArticleCard key={post.id} post={post} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* 5. Editorial Newsletter Callout Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#05112E] via-[#0A2266] to-[#0056FF] rounded-3xl p-8 sm:p-12 text-white shadow-royal-lg mb-12 border border-blue-900/40">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <span className="px-3.5 py-1 bg-white/15 backdrop-blur-md text-white border border-white/25 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
            Digital Publication
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans mb-3 text-white tracking-tight">
            Stay Connected with Thoughtful Perspectives
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-6">
            Get insightful essays, cultural dialogues, and literary critiques delivered directly to your inbox every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Link
              href="/signup"
              className="w-full py-3.5 px-6 bg-white hover:bg-brand-lavender text-accent font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-xl text-center"
            >
              Subscribe to Al Irshad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
