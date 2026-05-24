"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, BookOpen, Clock, ExternalLink, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/articles";
import AddArticleModal from "./articles/AddArticleModal";
import EditArticleModal from "./articles/EditArticleModal";
import DeleteArticleModal from "./articles/DeleteArticleModal";
import { getRequest, postRequest, deleteRequest } from "@/lib/apiCall";
import { toast } from "sonner";
import { ApiResponse, catchResponseMessage, ResponseMessage } from "../ResponseMessage";

const getImageUrl = (image: string) => {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) return image;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  return `${baseUrl}${image}`;
};

interface ArticlesTabProps {
  adminName?: string;
}

export default function ArticlesTab({
  adminName
}: ArticlesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState("");

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);

  // Articles categories state
  const [categories, setCategories] = useState<string[]>([]);
  // Keep track of backend category IDs mapped by lowercase name
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  // Modal local states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Load article categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let res;
        try {
          res = await getRequest<{ success: boolean; data: any[] }>("/admin/article/category");
        } catch {
          // Fallback to /admin/article/categories in case the GET route is pluralised
          res = await getRequest<{ success: boolean; data: any[] }>("/admin/article/categories");
        }

        if (res && res.success && Array.isArray(res.data)) {
          const newMap: Record<string, string> = {};
          const fetchedNames = res.data
            .map((cat: any) => {
              if (typeof cat === "string") {
                return cat;
              } else if (cat && cat.name) {
                const id = cat._id || cat.id;
                if (id) {
                  newMap[cat.name.toLowerCase()] = id;
                }
                return cat.name;
              }
              return null;
            })
            .filter(Boolean) as string[];

          if (fetchedNames.length > 0) {
            setCategories(prev => {
              const merged = [...prev];
              fetchedNames.forEach((name: string) => {
                if (!merged.some(c => c.toLowerCase() === name.toLowerCase())) {
                  merged.push(name);
                }
              });
              return merged;
            });
            setCategoryMap(prev => ({ ...prev, ...newMap }));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch article categories from backend, using defaults:", err);
      }
    };

    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      let res;
      try {
        res = await getRequest<{ success: boolean; data: any[] }>("/admin/article/all");
      } catch {
        try {
          res = await getRequest<{ success: boolean; data: any[] }>("/admin/articles/all");
        } catch {
          res = await getRequest<{ success: boolean; data: any[] }>("/admin/artticle/all");
        }
      }

      if (res && res.success && Array.isArray(res.data)) {
        const fetchedArticles: Article[] = res.data.map((art: any) => ({
          id: art.id || art._id || Math.random().toString(),
          title: art.title || "",
          category: art.category?.name || art.categoryName || art.category || "General",
          image: art.image || "",
          date: art.date || (art.createdAt ? new Date(art.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })),
          readTime: art.readTime || "5 min read",
          content: Array.isArray(art.content) ? art.content : typeof art.content === "string" ? [art.content] : []
        }));
        setArticles(fetchedArticles);
      }
    } catch (err) {
      console.warn("Failed to fetch articles from backend:", err);
    }
  };

  // Load articles from backend on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddCategory = async (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Category already exists!");
      return;
    }

    try {
      const res = await postRequest<{ success: boolean; message?: string; data?: any }>("/admin/article/category", {
        id: 0,
        name: trimmed
      });

      if (res && res.success) {
        setCategories(prev => [...prev, trimmed]);

        // Extract category ID if returned in response data
        const categoryData = res.data || (res as any).category || (res as any).newCategory;
        if (categoryData) {
          const id = categoryData._id || categoryData.id;
          if (id) {
            setCategoryMap(prev => ({
              ...prev,
              [trimmed.toLowerCase()]: id
            }));
          }
        }

        toast.success(res.message || `Category "${trimmed}" added successfully!`);
      } else {
        toast.error(res?.message || "Failed to add category");
      }
    } catch (err: any) {
      console.error("Error adding category:", err);
      toast.error(err.message || "Failed to add category");
    }
  };

  const handleSaveCategoryEdit = async (oldName: string) => {
    const trimmed = editCategoryValue.trim();
    if (!trimmed || trimmed.toLowerCase() === oldName.toLowerCase()) {
      setEditingCategory(null);
      return;
    }

    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
      toast.error("Category already exists!");
      setEditingCategory(null);
      return;
    }

    const id = categoryMap[oldName.toLowerCase()];
    if (!id) {
      toast.error("Cannot edit: category ID not found.");
      setEditingCategory(null);
      return;
    }

    try {
      const res = await postRequest<{ success: boolean; message?: string; data?: any }>("/admin/article/category", {
        id: id,
        name: trimmed
      });

      if (res && res.success) {
        setCategories(prev => prev.map(c => c.toLowerCase() === oldName.toLowerCase() ? trimmed : c));
        setCategoryMap(prev => {
          const next = { ...prev };
          delete next[oldName.toLowerCase()];
          next[trimmed.toLowerCase()] = id;
          return next;
        });

        // Re-fetch articles to ensure the category name updates in the listings
        fetchArticles();

        toast.success(res.message || "Category updated successfully!");
      } else {
        toast.error(res?.message || "Failed to update category");
      }
    } catch (err: any) {
      console.error("Error editing category:", err);
      toast.error(err.message || "Failed to update category");
    } finally {
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    const count = articles.filter(a => a.category?.toLowerCase() === catToDelete.toLowerCase()).length;
    if (count > 0) {
      toast.error(`Cannot delete category "${catToDelete}" because it has active articles.`);
      return;
    }

    const categoryId = categoryMap[catToDelete.toLowerCase()];

    try {
      // Optimistically remove locally
      setCategories(prev => prev.filter(c => c.toLowerCase() !== catToDelete.toLowerCase()));
      if (categoryId) {
        setCategoryMap(prev => {
          const copy = { ...prev };
          delete copy[catToDelete.toLowerCase()];
          return copy;
        });
      }
      // Use the actual backend ID if found, otherwise fall back to name encoding
      const deleteId = categoryId || encodeURIComponent(catToDelete);
      const res = await deleteRequest<ApiResponse>(`/admin/article/category/${deleteId}`);


      ResponseMessage(res)



    } catch (err: any) {
      catchResponseMessage(err)
    }
  };



  const handleDeleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
    toast.success("Article successfully deleted!");
  };

  // Filtered Articles Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesSearch =
        art.title?.toLowerCase().includes(searchTerm.toLowerCase()) 
        
     
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
            onClick={() => setShowAddModal(true)}
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
              {categories.map((cat) => (
                <option key={cat} className="dark:bg-[#121214]" value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Manager Form & Badges */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-5 animate-in fade-in duration-300">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5211] animate-pulse" />
            <h3 className="font-black text-xs tracking-[0.2em] uppercase text-[#FF5211]">Category Manager</h3>
          </div>
          <span className="text-[11px] opacity-60 dark:opacity-50 font-bold leading-normal">
            Manage educational categories and organize article taxonomy. Default categories are locked.
          </span>
        </div>

        {/* Dynamic Category pill badges */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const count = articles.filter(a => a.category?.toLowerCase() === cat.toLowerCase()).length;
            const isEditing = editingCategory === cat;

            return (
              <div
                key={cat}
                className="group/badge flex items-center gap-2.5 pl-4 pr-3 py-2 bg-[#F3F4F6] dark:bg-white/5 border border-transparent dark:border-white/[0.03] rounded-2xl text-[12px] font-black tracking-tight text-slate-800 dark:text-slate-200 transition-all hover:bg-neutral-200/50 dark:hover:bg-white/10 hover:scale-[1.01]"
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={editCategoryValue}
                    onChange={(e) => setEditCategoryValue(e.target.value)}
                    onBlur={() => handleSaveCategoryEdit(cat)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveCategoryEdit(cat);
                      if (e.key === "Escape") setEditingCategory(null);
                    }}
                    className="bg-transparent border-b border-[#FF5211] outline-none text-[12px] font-black text-slate-800 dark:text-slate-200 w-24"
                    autoFocus
                  />
                ) : (
                  <span>{cat}</span>
                )}
                <span className="bg-[#FF5211]/10 dark:bg-[#FF5211]/20 text-[#FF5211] text-[10px] px-2 py-0.5 rounded-lg font-black min-w-6 text-center">
                  {count}
                </span>

                {!isEditing && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setEditCategoryValue(cat);
                      }}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-0.5 rounded-md cursor-pointer opacity-0 group-hover/badge:opacity-60 hover:!opacity-100"
                      title={`Rename "${cat}" category`}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded-md cursor-pointer opacity-60 hover:opacity-100"
                      title={`Delete "${cat}" category`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inline Category Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmed = newCategoryName.trim();
            if (!trimmed || isAddingCategory) return;
            setIsAddingCategory(true);
            try {
              await handleAddCategory(trimmed);
              setNewCategoryName("");
            } catch (err) {
              console.error(err);
            } finally {
              setIsAddingCategory(false);
            }
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
        >
          <div className="relative flex-1">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35 text-slate-500" size={15} />
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={isAddingCategory}
              placeholder={isAddingCategory ? "Creating..." : "Enter new category name (e.g. Relocation, Finance)..."}
              maxLength={30}
              required
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 text-xs font-bold placeholder:opacity-50 focus:outline-none transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isAddingCategory}
            className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black hover:bg-[#FF5211] dark:hover:bg-[#FF5211] hover:text-white dark:hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-neutral-500/5 hover:scale-[1.01] active:scale-95 text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
          >
            {isAddingCategory ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-white/[0.01]">
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Cover & Title</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Category</th>
                                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Date</th>

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
                          <div className="w-14 h-10 rounded-xl overflow-hidden border border-[#0A0A0A]/5 dark:border-white/10 shrink-0 bg-neutral-100 relative">
                            <Image src={getImageUrl(imageSrc)} alt={art.title} fill className="object-cover" sizes="56px" />
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-bold text-[13px] leading-tight line-clamp-2 max-w-[280px]">
                              {art.title}
                            </span>
                           
                          </div>
                        </div>
                      </td>

                      {/* Category Badge Cell */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${art.category?.toLowerCase().includes("tip")
                            ? "bg-orange-500/10 text-orange-600"
                            : art.category?.toLowerCase().includes("guide")
                              ? "bg-purple-500/10 text-purple-600"
                              : "bg-blue-500/10 text-blue-600"
                          }`}>
                          {art.category}
                        </span>
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
                      
                          <button
                            onClick={() => {
                              setActiveArticle(art);
                              setShowEditModal(true);
                            }}
                            title="Edit Article Details"
                            className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-blue-500/20 text-[#64748b] hover:text-blue-500 transition-all cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setActiveArticle(art);
                              setShowDeleteDialog(true);
                            }}
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

      {/* Article Modals */}
      <AddArticleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        categoryMap={categoryMap}
        onSuccess={fetchArticles}
        adminName={adminName}
      />

      <EditArticleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setActiveArticle(null);
        }}
        categories={categories}
        categoryMap={categoryMap}
        article={activeArticle}
        onSuccess={fetchArticles}
      />

      <DeleteArticleModal
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setActiveArticle(null);
        }}
        article={activeArticle}
        onConfirm={() => {
          if (activeArticle) {
            handleDeleteArticle(activeArticle.id);
          }
        }}
      />

    </div>
  );
}
