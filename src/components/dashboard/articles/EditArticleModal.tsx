"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Camera } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { uploadRequest, getRequest, putRequest } from "@/lib/apiCall";
import { Article } from "@/lib/articles";
import TextEditor from "./TextEditor";
import { ResponseMessage, catchResponseMessage, ApiResponse } from "../../ResponseMessage";

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  categoryMap: Record<string, string>;
  article: Article | null;
  onSuccess: () => void;
}

const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  categoryId: z.string().min(1, "Please select a category"),
  readTime: z.string().min(1, "Read time is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  image: z.string().min(1, "Cover image is required"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const getImageUrl = (image: string) => {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) return image;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  return `${baseUrl}${image}`;
};

export default function EditArticleModal({
  isOpen,
  onClose,
  categories,
  categoryMap,
  article,
  onSuccess
}: EditArticleModalProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      readTime: "5 min read",
      content: "",
      image: ""
    }
  });

  const selectedCategoryId = watch("categoryId");
  const currentContent = watch("content");
  const currentImage = watch("image");

  // Load article details from API on modal load with optimistic fallback to prop
  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (!isOpen || !article) return;
      
      try {
        const res = await getRequest<ApiResponse<Article>>(`/admin/article/get/${article.id}`);
        if (res && res.success && res.data) {
          const art = res.data;
          setValue("title", art.title || "");
          setValue("categoryId", (art as any).categoryId || "");
          setValue("readTime", art.readTime || "5 min read");
          setValue("content", Array.isArray(art.content) ? art.content.join("\n\n") : art.content || "");
          setValue("image", art.image || "");
        } else {
          throw new Error("No data returned");
        }
      } catch (err) {
        console.warn("Failed to fetch fresh article details, using optimistic local prop data:", err);
        
        // Find categoryId from categories/categoryMap
        const propCategoryId = categoryMap[article.category?.toLowerCase()] || article.category || "";
        
        // Fallback to local prop values
        setValue("title", article.title || "");
        setValue("categoryId", propCategoryId);
        setValue("readTime", article.readTime || "5 min read");
        setValue("content", Array.isArray(article.content) ? article.content.join("\n\n") : article.content || "");
        setValue("image", article.image || "");
      }
    };

    fetchArticleDetails();
  }, [article, isOpen, setValue, categories, categoryMap]);

  if (!isOpen || !article) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("media", file, file.name);
    
    try {
      const res = await uploadRequest<{
        success: boolean;
        data: Array<{ uploadUrl: string; fileKey: string; mediaType: string }>;
      }>("/files/upload", formData);
      
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setValue("image", res.data[0].fileKey, { shouldValidate: true });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Cloudinary /files/upload failed, using development placeholder:", err);
      const localPreviewUrl = URL.createObjectURL(file);
      setValue("image", localPreviewUrl, { shouldValidate: true });
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (dt: ArticleFormValues) => {
    // Format content as a JSON array of paragraph strings
    const contentParagraphs = dt.content.split("\n\n").map(p => p.trim()).filter(Boolean);

    try {
      const data = {
        title: dt.title,
        image: dt.image,
        readTime: dt.readTime,
        content: contentParagraphs, // JSON field
        categoryId: dt.categoryId // String field directly!
      };

      // 3. Make PUT request to /admin/article/edit/:id
      const res = await putRequest<ApiResponse>(`/admin/article/edit/${article.id}`, { data });

      ResponseMessage(res);

      if (res && res.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      catchResponseMessage(err);
      console.error("Error editing article:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[550px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-[#0A0A0A]/5 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#121214]">
            <div className="flex flex-col">
              <span className="text-[9px] font-black tracking-widest text-[#FF5211] uppercase">MODIFY ENTRY</span>
              <span className="font-bold text-sm truncate max-w-[280px]">Edit: {article.title}</span>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scroll Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Article Title</label>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. 5 Secrets to Finding Budget Rooms"
                className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
              />
              {errors.title && (
                <span className="text-[10px] font-black text-red-500 uppercase tracking-wider px-1">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Category Type</label>
                <select
                  {...register("categoryId")}
                  className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  {categories.map((cat) => {
                    const id = categoryMap[cat.toLowerCase()] || cat;
                    return (
                      <option key={cat} value={id}>
                        {cat}
                      </option>
                    );
                  })}
                </select>
                {errors.categoryId && (
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-wider px-1">
                    {errors.categoryId.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Read Time Estimate</label>
                <input
                  type="text"
                  {...register("readTime")}
                  placeholder="e.g. 6 min read"
                  className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                />
                {errors.readTime && (
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-wider px-1">
                    {errors.readTime.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Cover Image</label>
              
              {currentImage ? (
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#0A0A0A]/5 dark:border-white/10 group bg-neutral-100 dark:bg-neutral-900 shadow-inner">
                  <Image src={getImageUrl(currentImage)} alt="Cover Preview" fill className="object-cover" sizes="(max-width: 550px) 100vw, 550px" priority />
                  <button
                    type="button"
                    onClick={() => setValue("image", "", { shouldValidate: true })}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#0A0A0A]/10 dark:border-white/10 hover:border-[#FF5211]/40 rounded-2xl p-6 bg-[#FBFBFA] dark:bg-white/[0.01] hover:bg-[#FF5211]/5 transition-all text-center relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="w-8 h-8 rounded-full border-4 border-t-[#FF5211] border-neutral-300 animate-spin" />
                      <span className="text-[10px] font-black text-[#FF5211] uppercase tracking-wider animate-pulse">Uploading Image...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5211] flex items-center justify-center group-hover:scale-115 transition-transform shrink-0">
                        <Camera size={18} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Click or drag image file here</span>
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PNG, JPG or WEBP up to 5MB</span>
                    </div>
                  )}
                </div>
              )}
              {errors.image && (
                <span className="text-[10px] font-black text-red-500 uppercase tracking-wider px-1">
                  {errors.image.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Article Body Content</label>
              <TextEditor
                value={currentContent || ""}
                onChange={(val) => setValue("content", val, { shouldValidate: true })}
                required={true}
                placeholder="Write the full body content paragraphs..."
              />
              {errors.content && (
                <span className="text-[10px] font-black text-red-500 uppercase tracking-wider px-1">
                  {errors.content.message}
                </span>
              )}
            </div>

          </div>

          {/* Modal Buttons Footer */}
          <div className="px-6 py-5 border-t border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-[#121214] flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Entry"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
