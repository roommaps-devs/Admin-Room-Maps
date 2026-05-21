import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "RoomMaps Blog - Renting Advice, City Guides & Coliving Insights",
  description: "Explore zero-brokerage renting guides, student housing tips, city survival manuals, and coliving reviews across major cities in India like Bangalore and Delhi NCR.",
  keywords: ["renting advice", "bangalore rent guide", "student housing delhi", "coliving techies", "zero brokerage"],
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#121214] py-16 md:py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto mt-6">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#FF5211] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]/70">Blog</span>
        </nav>

        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-2 text-[#FF5211] font-bold text-xs uppercase tracking-widest mb-3">
            <BookOpen size={14} />
            <span>Articles & Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sans font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            The RoomMaps <span className="text-[#FF5211]">Journal.</span>
          </h1>
          <p className="text-[var(--text-primary)]/70 font-medium text-lg max-w-xl">
            Everything you need to know about finding rooms, navigating rentals, and settling down in India's top tech hubs.
          </p>
        </header>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[var(--glass-border)] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:translate-y-[-4px]"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-800">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-[#1A1A1E]/95 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-[#FF5211] shadow-sm border border-[var(--glass-border)]">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-[11px] font-bold text-[var(--text-primary)]/40">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-[var(--text-primary)] leading-snug group-hover:text-[#FF5211] transition-colors duration-300 mb-3 line-clamp-2">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-[var(--text-primary)]/70 text-[14px] font-medium leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Meta details */}
                <div className="mt-auto pt-4 border-t border-[#0A0A0A]/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[var(--text-primary)]/50">
                  <span className="text-[var(--text-primary)]/70 font-semibold">{article.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {article.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
