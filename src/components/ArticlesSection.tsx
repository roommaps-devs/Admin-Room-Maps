"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ARTICLES } from '@/lib/articles';

const CATEGORIES = ["All", "Renting Tips", "City Guides", "Coliving"];

export default function ArticlesSection() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredArticles = useMemo(() => {
    if (activeTab === "All") return ARTICLES;
    return ARTICLES.filter(article => article.category === activeTab);
  }, [activeTab]);

  return (
    <section className="py-20 md:py-28 px-6 bg-[#FAFAF8] dark:bg-[#121214] border-t border-[#0A0A0A]/5 dark:border-white/5 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#FF5211] font-bold text-xs uppercase tracking-widest mb-3">
              <BookOpen size={14} />
              <span>Read & Learn</span>
            </div>
            <h2 className="text-3xl md:text-[44px] font-sans font-black text-[var(--text-primary)] tracking-tight leading-tight">
              Guides & Insights
            </h2>
          </div>
          <p className="text-[var(--text-primary)]/70 font-medium text-base md:text-lg max-w-md">
            Expert advice, local insights, and renting tips to make your transition seamless.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-6 md:pb-8 scrollbar-none border-b border-[#0A0A0A]/5 dark:border-white/5 -mx-6 px-6 md:mx-0 md:px-0">
          {CATEGORIES.map((category) => {
            const isActive = activeTab === category;
            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer border",
                  isActive
                    ? "bg-[#FF5211] text-white border-[#FF5211] shadow-[0_4px_12px_rgba(255,82,17,0.25)] scale-102"
                    : "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)]/70 hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border-[var(--glass-border)]"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Articles List / Grid (Horizontal scroll on mobile, grid on desktop) */}
        <div className="mt-10">
          <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none gap-6 px-6 md:px-0 -mx-6 md:mx-0 pb-6 md:pb-0">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto flex flex-col bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[var(--glass-border)] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:translate-y-[-4px]"
              >
                {/* Image Container */}
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

                {/* Content Box */}
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
                  <h3 className="text-xl font-bold text-[var(--text-primary)] leading-snug group-hover:text-[#FF5211] transition-colors duration-300 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[var(--text-primary)]/70 text-[14px] font-medium leading-relaxed mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Footer Meta */}
                  <div className="mt-auto pt-4 border-t border-[#0A0A0A]/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[var(--text-primary)]/50">
                    <span className="text-[var(--text-primary)]/70 font-semibold">{article.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Empty state */}
            {filteredArticles.length === 0 && (
              <div className="w-full col-span-3 text-center py-20 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[var(--glass-border)]">
                <p className="text-[var(--text-primary)]/60 font-semibold text-lg">No articles found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* View All Button (SEO Friendly Link) */}
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--glass-border)] text-sm font-bold text-[var(--text-primary)] hover:text-[#FF5211] transition-all duration-300 shadow-sm active:scale-98 cursor-pointer outline-none"
          >
            <span>Explore All Guides</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
