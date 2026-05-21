"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight, Search, Sparkles, Filter, X } from "lucide-react";
import { Article } from "@/lib/articles";

interface BlogIndexClientProps {
  initialArticles: Article[];
}

export default function BlogIndexClient({ initialArticles }: BlogIndexClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Synchronize category or search query from URL search params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      const searchParam = params.get("search");
      if (catParam) {
        setSelectedCategory(catParam);
      }
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, []);

  // Calculate unique categories and their counts dynamically
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialArticles.length };
    initialArticles.forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [initialArticles]);

  // Filter articles based on search query and selected category
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.content.some((para) => para.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  // Separate featured article (only shown when no active category/search filter)
  const showFeaturedHero = selectedCategory === "All" && searchQuery === "" && filteredArticles.length > 0;
  const featuredArticle = showFeaturedHero ? filteredArticles[0] : null;
  const displayArticles = showFeaturedHero ? filteredArticles.slice(1) : filteredArticles;

  return (
    <div className="space-y-12">
      {/* Header and Filter Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between pb-8 border-b border-[var(--glass-border)]">
        <div>
          <div className="flex items-center gap-2 text-[#FF5211] font-bold text-xs uppercase tracking-widest mb-3">
            <BookOpen size={14} className="animate-pulse-slow" />
            <span>Articles & Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            The RoomMaps <span className="text-[#FF5211]">Journal.</span>
          </h1>
          <p className="text-[var(--text-primary)]/70 font-medium text-base md:text-lg max-w-xl">
            Everything you need to know about finding rooms, navigating rentals, and settling down in India's top tech hubs.
          </p>
        </div>

        {/* Live Search Box */}
        <div className="relative w-full lg:max-w-xs group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-primary)]/40 group-focus-within:text-[#FF5211] transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search articles, tags, hubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white dark:bg-[#1A1A1E] text-sm font-bold text-[var(--text-primary)] border border-[var(--glass-border)] focus:outline-none focus:border-[#FF5211] focus:ring-2 focus:ring-[#FF5211]/10 transition-all duration-300 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-[var(--text-primary)]/45 hover:text-[#FF5211] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-orange-500/10 hover:scrollbar-thumb-orange-500/20">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[var(--text-primary)]/50 tracking-wider mr-2 select-none">
          <Filter size={13} />
          <span>Filter:</span>
        </div>
        {categoriesWithCounts.map(({ name, count }) => {
          const isActive = selectedCategory === name;
          return (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                isActive
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#E84300] text-white shadow-md shadow-orange-500/15"
                  : "bg-white dark:bg-[#1A1A1E] text-[var(--text-primary)]/70 hover:text-[#FF5211] border border-[var(--glass-border)]"
              }`}
            >
              <span>{name}</span>
              <span
                className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-[var(--bg-surface)] text-[var(--text-primary)]/40"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Hero Article */}
      {featuredArticle && (
        <section className="relative group bg-white dark:bg-[#1A1A1E] rounded-[36px] border border-[var(--glass-border)] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
          <div className="grid lg:grid-cols-12 gap-0 lg:divide-x lg:divide-[var(--glass-border)]">
            {/* Image section */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] md:min-h-[400px] overflow-hidden bg-slate-100 dark:bg-zinc-800">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-all duration-700 ease-out"
              />
              <div className="absolute top-6 left-6 bg-gradient-to-r from-[#FF6B35] to-[#E84300] text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                <div className="flex items-center gap-1">
                  <Sparkles size={11} className="animate-spin-slow" />
                  <span>Featured Post</span>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center">
              <span className="inline-block bg-[#FF5211]/10 dark:bg-[#FF5211]/20 text-[#FF5211] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl w-fit mb-4">
                {featuredArticle.category}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-[34px] font-sans font-black text-[var(--text-primary)] leading-tight tracking-tight mb-4 group-hover:text-[#FF5211] transition-colors duration-300">
                <Link href={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>
              <p className="text-[var(--text-primary)]/70 font-medium text-sm md:text-base leading-relaxed mb-6">
                {featuredArticle.excerpt}
              </p>

              {/* Author & Meta details */}
              <div className="flex items-center gap-4 py-4 border-t border-[var(--glass-border)] text-xs font-bold text-[var(--text-primary)]/50 mb-6">
                <span className="text-[#FF5211]">{featuredArticle.author}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {featuredArticle.date}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {featuredArticle.readTime}
                </span>
              </div>

              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 text-sm font-black text-[#FF5211] hover:gap-3 transition-all duration-300 w-fit"
              >
                <span>Read Full Article</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* No Results Fallback */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[var(--glass-border)] shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF5211]/10 text-[#FF5211] mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Articles Found</h3>
          <p className="text-[var(--text-primary)]/60 text-sm max-w-sm mx-auto mb-6">
            We couldn't find any articles matching "{searchQuery}" in category "{selectedCategory}". Try searching for something else!
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 font-bold text-sm text-white bg-gradient-to-r from-[#FF6B35] to-[#E84300] rounded-xl hover:shadow-lg transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Regular/Filtered Articles Grid */}
      {displayArticles.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[var(--glass-border)] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:translate-y-[-4px]"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-800 border-b border-[var(--glass-border)]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-all duration-750 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-[#1A1A1E]/95 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full text-[#FF5211] shadow-sm border border-[var(--glass-border)]">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]/40 px-2 py-0.5 bg-[var(--bg-surface)] rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[var(--text-primary)] leading-snug group-hover:text-[#FF5211] transition-colors duration-300 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[var(--text-primary)]/70 text-[14px] font-medium leading-relaxed mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                {/* Meta details */}
                <div className="pt-4 border-t border-[#0A0A0A]/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[var(--text-primary)]/50">
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
      )}
    </div>
  );
}
