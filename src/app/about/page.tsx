import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Al Irshad",
  description: "About Al Irshad - A premier Malayalam digital publication and journal of thought, culture, and literature.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-14 shadow-card">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block text-center">
          Editorial Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center text-primary mb-8">
          About Al Irshad
        </h1>

        <div className="prose prose-lg max-w-none text-secondary leading-loose text-justify font-sans text-sm sm:text-base space-y-6">
          <p>
            <strong>Al Irshad</strong> is a premier Malayalam digital publication dedicated to exploring reflections on culture, arts, religion, philosophy, and society. Through collective intellectual engagement, we seek to uncover and share original ideas, perspectives, and creative expressions. Beyond conventional articles, we welcome diverse literary forms that bring fresh thought and novelty to the public domain.
          </p>

          <p>
            <strong>Al Irshad</strong> serves as a space for original thought, critical reflection, and creative expression. Rooted in intellectual inquiry, we value ideas shaped by depth, authenticity, and nuanced understanding.
          </p>

          <div className="my-10 p-6 bg-surface rounded-2xl border border-gray-100">
            <h3 className="text-base font-bold text-primary mb-2">Our Core Values</h3>
            <ul className="text-xs sm:text-sm text-secondary space-y-2 list-disc list-inside">
              <li>Commitment to intellectual rigor and authentic inquiry</li>
              <li>Exploration of Malabar heritage and global Islamic thought</li>
              <li>A welcoming platform for emerging young scholars and writers</li>
              <li>Critical dialogues bridging tradition and modernity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
