"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, BookOpen, Clock, ExternalLink, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { Article } from "@/lib/articles";

interface ArticlesTabProps {
  articles: Article[];
  onPublishArticleClick: () => void;
  onEditArticleClick: (article: Article) => void;
  onDeleteArticleClick: (article: Article) => void;
}

export default function ArticlesTab({
  articles,
  onPublishArticleClick,
  onEditArticleClick,
  onDeleteArticleClick
}: ArticlesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filtered Articles Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesSearch = 
        art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = 
        selectedCategory === "all" || art.category?.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Toolbar & Actions */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-black text-[20px] tracking-tight">Articles & Guides Database</h2>
            <span className="text-[11px] opacity-50 font-medium">
              Manage, publish, and update educational guides, renting tips, and local insights
            </span>
          </div>
          
          <button 
            onClick={onPublishArticleClick}
            className="h-12 px-6 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all shadow-md shadow-orange-500/10 cursor-pointer"
          >
            <Plus size={16} />
            Publish Article
          </button>
        </div>

        {/* Filter and Search grid row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35 text-slate-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search article title, tags, or author..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 text-xs font-bold placeholder:opacity-50 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 px-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 h-12">
            <BookOpen size={14} className="opacity-40 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-black outline-none cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option className="dark:bg-[#121214]" value="all">All Categories</option>
              <option className="dark:bg-[#121214]" value="renting tips">Renting Tips</option>
              <option className="dark:bg-[#121214]" value="city guides">City Guides</option>
              <option className="dark:bg-[#121214]" value="coliving">Coliving</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-white/[0.01]">
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Cover & Title</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Category</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Author</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Published</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Read Time</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/5 dark:divide-white/10">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-black text-xs uppercase tracking-wide">
                    No articles found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => {
                  const imageSrc = art.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
                  
                  return (
                    <tr key={art.id} className="hover:bg-[#FBFBFA] dark:hover:bg-white/[0.01] transition-colors">
                      
                      {/* Title + Thumbnail Cell */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-10 rounded-xl overflow-hidden border border-[#0A0A0A]/5 dark:border-white/10 shrink-0 bg-neutral-100">
                            <img src={imageSrc} alt={art.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-bold text-[13px] leading-tight line-clamp-2 max-w-[280px]">
                              {art.title}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {art.tags?.map((tag) => (
                                <span key={tag} className="text-[9px] font-bold text-slate-400">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge Cell */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          art.category?.toLowerCase().includes("tip") 
                            ? "bg-orange-500/10 text-orange-600" 
                            : art.category?.toLowerCase().includes("guide")
                              ? "bg-purple-500/10 text-purple-600"
                              : "bg-blue-500/10 text-blue-600"
                        }`}>
                          {art.category}
                        </span>
                      </td>

                      {/* Author Cell */}
                      <td className="py-4 px-6 text-xs font-bold text-slate-700 dark:text-slate-300">
                        {art.author}
                      </td>

                      {/* Date Published */}
                      <td className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {art.date}
                      </td>

                      {/* Read Time */}
                      <td className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="opacity-50" />
                          <span>{art.readTime}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Link
                            href={`/blog/${art.slug}`}
                            target="_blank"
                            title="View Article Page"
                            className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-emerald-500/20 text-[#64748b] hover:text-emerald-500 transition-all"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            onClick={() => onEditArticleClick(art)}
                            title="Edit Article Details"
                            className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-blue-500/20 text-[#64748b] hover:text-blue-500 transition-all cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteArticleClick(art)}
                            title="Delete Article"
                            className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-red-500/20 text-[#64748b] hover:text-red-500 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
