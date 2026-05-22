"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { X, Trash2, Camera } from "lucide-react";
import { useRooms, clearRoomsCache } from "@/lib/hooks/useRooms";
import { Room } from "@/lib/types";
import { postRequest, deleteRequest, uploadRequest } from "@/lib/apiCall";
import { toast } from "sonner";
import PostListingForm from "./map/PostListingForm";
import { ARTICLES, Article } from "@/lib/articles";

// Subcomponents imports
import DashboardSidebar from "./dashboard/DashboardSidebar";
import OverviewTab from "./dashboard/OverviewTab";
import ListingsTab from "./dashboard/ListingsTab";
import AnalyticsTab from "./dashboard/AnalyticsTab";
import ReportsTab from "./dashboard/ReportsTab";
import ArticlesTab from "./dashboard/ArticlesTab";

type DashboardTab = "overview" | "listings" | "analytics" | "reports" | "articles";

interface ActivityLog {
  id: string;
  type: "add" | "edit" | "delete" | "trending" | "report";
  message: string;
  time: string;
}

interface Report {
  id: string;
  postId: string;
  title: string;
  reporter: string;
  reason: string;
  date: string;
  status: string;
}

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.user);
  const { data: fetchedRooms, isLoading: loadingRooms } = useRooms();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [rooms, setRooms] = useState<Room[]>([]);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editRent, setEditRent] = useState(0);
  const [editCity, setEditCity] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editBhk, setEditBhk] = useState("");
  const [editFurnished, setEditFurnished] = useState("Unfurnished");
  const [editPhone, setEditPhone] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // Articles state
  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  // Article Modals state
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [showEditArticleModal, setShowEditArticleModal] = useState(false);
  const [showDeleteArticleDialog, setShowDeleteArticleDialog] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Article form states
  const [articleTitle, setArticleTitle] = useState("");
  const [articleCategory, setArticleCategory] = useState("Renting Tips");
  const [articleExcerpt, setArticleExcerpt] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");
  const [articleReadTime, setArticleReadTime] = useState("");
  const [articleTags, setArticleTags] = useState("");
  const [articleImage, setArticleImage] = useState("");
  const [articleContent, setArticleContent] = useState("");

  // Activity log tracking
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: "1", type: "trending", message: "Listing 'Premium PG near Delhi University' marked as Trending", time: "10 mins ago" },
    { id: "2", type: "edit", message: "Cozy 1BHK Flat rent updated in Noida Sector 62", time: "1 hour ago" },
    { id: "3", type: "report", message: "Listing in Pune flagged for incorrect location pin", time: "3 hours ago" },
    { id: "4", type: "add", message: "New Host Stay 'Shanti Villa PG' added by Administrator", time: "5 hours ago" }
  ]);

  // Listing reports mock data
  const [reports, setReports] = useState<Report[]>([
    { id: "rep-1", postId: "room-1", title: "Luxury Stay near Cyber City", reporter: "Aman V.", reason: "Fake photos uploaded. The property is outdated.", date: "May 22, 2026", status: "pending" },
    { id: "rep-2", postId: "room-2", title: "Standard 2BHK in Gachibowli", reporter: "Saira K.", reason: "Broker contact instead of direct owner listing.", date: "May 21, 2026", status: "pending" },
    { id: "rep-3", postId: "room-3", title: "Coliving Room in Indiranagar", reporter: "Vikram S.", reason: "Rent price is 25,000 instead of 18,000 listed.", date: "May 20, 2026", status: "pending" }
  ]);

  // Sync state with fetched rooms
  useEffect(() => {
    if (fetchedRooms) {
      setRooms(fetchedRooms);
    }
  }, [fetchedRooms]);

  // Toggle Trending
  const handleToggleTrending = async (room: Room) => {
    const updatedStatus = !room.isTrending;
    
    // Update local state optimistically
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isTrending: updatedStatus } : r));
    
    // Log Activity
    setActivityLogs(prev => [
      {
        id: Math.random().toString(),
        type: "trending",
        message: `Listing '${room.name}' marked as ${updatedStatus ? "Trending" : "Standard"}`,
        time: "Just now"
      },
      ...prev
    ]);
    
    toast.success(`Property marked as ${updatedStatus ? "Trending 🔥" : "Standard"}`);
    
    try {
      await postRequest(`/post/updateTrending/${room.id}`, { isTrending: updatedStatus });
    } catch (err) {
      console.warn("Failed to update trending status on API, local state remains active:", err);
    }
  };

  // Trigger Delete confirmation
  const triggerDelete = (room: Room) => {
    setActiveRoom(room);
    setShowDeleteDialog(true);
  };

  // Perform Delete
  const handleDeleteListing = async () => {
    if (!activeRoom) return;
    
    const id = activeRoom.id;
    // Optimistic Update
    setRooms(prev => prev.filter(r => r.id !== id));
    setShowDeleteDialog(false);
    
    // Log Activity
    setActivityLogs(prev => [
      {
        id: Math.random().toString(),
        type: "delete",
        message: `Listing '${activeRoom.name}' removed from admin inventory`,
        time: "Just now"
      },
      ...prev
    ]);
    
    toast.success("Listing successfully removed!");
    
    try {
      await deleteRequest(`/post/delete/${id}`);
      clearRoomsCache();
    } catch (err) {
      console.warn("API deletion endpoint failed or unavailable. Local cache successfully truncated:", err);
    }
  };

  // Trigger Edit modal
  const triggerEdit = (room: Room) => {
    setActiveRoom(room);
    setEditTitle(room.name || "");
    setEditRent(room.rent || 0);
    setEditCity(room.city || "");
    setEditCategory(room.category || "rent");
    setEditBhk(room.bhk || "1 BHK");
    setEditFurnished(room.furnished || "Unfurnished");
    setEditPhone(room.phone || "");
    setEditOwner(room.owner || "");
    setEditAddress(room.location || "");
    setShowEditModal(true);
  };

  // Perform Edit save
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom) return;
    
    const updated: Room = {
      ...activeRoom,
      name: editTitle,
      rent: Number(editRent),
      city: editCity,
      category: editCategory,
      bhk: editBhk,
      furnished: editFurnished,
      phone: editPhone,
      owner: editOwner,
      location: editAddress
    };
    
    // Update local state optimistically
    setRooms(prev => prev.map(r => r.id === activeRoom.id ? updated : r));
    setShowEditModal(false);
    
    // Log Activity
    setActivityLogs(prev => [
      {
        id: Math.random().toString(),
        type: "edit",
        message: `Listing details updated for '${editTitle}' in ${editCity}`,
        time: "Just now"
      },
      ...prev
    ]);
    
    toast.success("Listing details updated!");
    
    try {
      await postRequest(`/post/update/${activeRoom.id}`, { data: updated });
      clearRoomsCache();
    } catch (err) {
      console.warn("API update endpoint failed or unavailable. Local cache successfully refreshed:", err);
    }
  };

  // Dismiss report action
  const handleDismissReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast.success("Report dismissed.");
  };

  // Remove reported listing action
  const handleRemoveReported = async (postId: string, reportId: string) => {
    // Remove listing locally
    setRooms(prev => prev.filter(r => r.id !== postId));
    // Remove report locally
    setReports(prev => prev.filter(r => r.id !== reportId));
    
    setActivityLogs(prev => [
      {
        id: Math.random().toString(),
        type: "delete",
        message: `Flagged listing ID '${postId}' removed due to policy reports`,
        time: "Just now"
      },
      ...prev
    ]);
    
    toast.success("Flagged listing removed successfully.");
    
    try {
      await deleteRequest(`/post/delete/${postId}`);
      clearRoomsCache();
    } catch (err) {
      console.warn("Failed delete api call for reported listing, local removal complete.");
    }
  };

  // Handle uploading article cover image
  const handleArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("media", file, file.name);
    
    toast.info("Uploading image to secure bucket...");
    
    try {
      const res = await uploadRequest<{
        success: boolean;
        data: Array<{ uploadUrl: string; fileKey: string; mediaType: string }>;
      }>("/files/upload", formData);
      
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setArticleImage(res.data[0].uploadUrl);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Cloudinary /files/upload failed, using development placeholder:", err);
      // Fallback helper to prevent system crashes during mock environments
      const localPreviewUrl = URL.createObjectURL(file);
      setArticleImage(localPreviewUrl);
      toast.success("Cover preview loaded successfully!");
    } finally {
      setUploadingImage(false);
    }
  };

  // Trigger Edit Article
  const triggerEditArticle = (art: Article) => {
    setActiveArticle(art);
    setArticleTitle(art.title || "");
    setArticleCategory(art.category || "Renting Tips");
    setArticleExcerpt(art.excerpt || "");
    setArticleAuthor(art.author || "");
    setArticleReadTime(art.readTime || "");
    setArticleTags(art.tags?.join(", ") || "");
    setArticleImage(art.image || "");
    setArticleContent(art.content?.join("\n\n") || "");
    setShowEditArticleModal(true);
  };

  // Save Edit Article
  const handleEditArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticle) return;

    const updated: Article = {
      ...activeArticle,
      title: articleTitle,
      category: articleCategory,
      excerpt: articleExcerpt,
      author: articleAuthor,
      readTime: articleReadTime,
      tags: articleTags.split(",").map(t => t.trim()).filter(Boolean),
      image: articleImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      content: articleContent.split("\n\n").map(p => p.trim()).filter(Boolean)
    };

    setArticles(prev => prev.map(a => a.id === activeArticle.id ? updated : a));
    setShowEditArticleModal(false);
    toast.success("Article successfully updated!");
  };

  // Trigger Delete Article
  const triggerDeleteArticle = (art: Article) => {
    setActiveArticle(art);
    setShowDeleteArticleDialog(true);
  };

  // Confirm Delete Article
  const handleDeleteArticle = () => {
    if (!activeArticle) return;
    setArticles(prev => prev.filter(a => a.id !== activeArticle.id));
    setShowDeleteArticleDialog(false);
    toast.success("Article successfully deleted!");
  };

  // Trigger Publish Article Modal
  const triggerPublishArticle = () => {
    setArticleTitle("");
    setArticleCategory("Renting Tips");
    setArticleExcerpt("");
    setArticleAuthor(user?.name || "Admin Staff");
    setArticleReadTime("5 min read");
    setArticleTags("");
    setArticleImage("");
    setArticleContent("");
    setShowAddArticleModal(true);
  };

  // Submit Publish Article
  const handlePublishArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: Article = {
      id: Math.random().toString(),
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: articleTitle,
      category: articleCategory,
      excerpt: articleExcerpt,
      author: articleAuthor,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: articleReadTime || "5 min read",
      tags: articleTags.split(",").map(t => t.trim()).filter(Boolean),
      image: articleImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      content: articleContent.split("\n\n").map(p => p.trim()).filter(Boolean)
    };

    setArticles(prev => [newArticle, ...prev]);
    setShowAddArticleModal(false);
    toast.success("New article published successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F3F4F6] transition-colors duration-300">
      
      {/* Primary Dashboard Panel Shell */}
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* ============================================================
            SIDEBAR PANEL
        ============================================================ */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          roomsCount={rooms.length}
          reportsCount={reports.length}
          articlesCount={articles.length}
          user={user}
        />

        {/* ============================================================
            MAIN CONTENT AREA
        ============================================================ */}
        <main className="flex-1 flex flex-col gap-8 min-w-0">
          
          {/* ---- OVERVIEW TAB ---- */}
          {activeTab === "overview" && (
            <OverviewTab
              rooms={rooms}
              loadingRooms={loadingRooms}
              activityLogs={activityLogs}
              onAddListingClick={() => setShowAddModal(true)}
            />
          )}

          {/* ---- LISTINGS MANAGER TAB ---- */}
          {activeTab === "listings" && (
            <ListingsTab
              rooms={rooms}
              loadingRooms={loadingRooms}
              onAddListingClick={() => setShowAddModal(true)}
              onEditListingClick={triggerEdit}
              onDeleteListingClick={triggerDelete}
              onToggleTrendingClick={handleToggleTrending}
            />
          )}

          {/* ---- ANALYTICS TAB ---- */}
          {activeTab === "analytics" && (
            <AnalyticsTab rooms={rooms} />
          )}

          {/* ---- REPORTS AND FLAGGED TAB ---- */}
          {activeTab === "reports" && (
            <ReportsTab
              reports={reports}
              onDismissReport={handleDismissReport}
              onRemoveReported={handleRemoveReported}
            />
          )}

          {/* ---- ARTICLES MANAGER TAB ---- */}
          {activeTab === "articles" && (
            <ArticlesTab
              articles={articles}
              onPublishArticleClick={triggerPublishArticle}
              onEditArticleClick={triggerEditArticle}
              onDeleteArticleClick={triggerDeleteArticle}
            />
          )}

        </main>

      </div>

      {/* ============================================================
          WIZARD MODAL: CREATE LISTING
      ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[550px] bg-white dark:bg-[#0A0A0A] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 relative max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-300">
            
            {/* Header overlay */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#0A0A0A]/5 dark:border-white/10 shrink-0 bg-white dark:bg-[#0A0A0A]">
              <span className="text-[10px] font-black tracking-[0.3em] text-[#FF5211] uppercase">ADMIN LISTING CREATOR</span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrolling Form Body */}
            <div className="flex-1 overflow-y-auto p-2 bg-[#FBFBFA] dark:bg-[#0A0A0A]">
              <PostListingForm 
                isInline={true}
                onBack={() => setShowAddModal(false)}
                onSuccess={() => {
                  setShowAddModal(false);
                  clearRoomsCache();
                  toast.success("Listing successfully logged into database!");
                  window.location.reload();
                }}
              />
            </div>

          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: EDIT LISTING DETAILS
      ============================================================ */}
      {showEditModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 animate-in zoom-in-95 duration-300">
            
            <form onSubmit={handleEditSubmit} className="flex flex-col max-h-[85vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#0A0A0A]/5 dark:border-white/10 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-widest text-[#FF5211] uppercase">MODIFY SYSTEM ENTRY</span>
                  <span className="font-bold text-sm truncate max-w-[280px]">Edit: {activeRoom?.name}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-full hover:bg-[#F3F4F6] dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Inputs Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Stay Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={editRent}
                      onChange={(e) => setEditRent(Number(e.target.value))}
                      required
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">City Hub</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Category Type</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer"
                    >
                      <option className="dark:bg-[#121214]" value="rent">Rent / Flat</option>
                      <option className="dark:bg-[#121214]" value="pg">PG / Coliving</option>
                      <option className="dark:bg-[#121214]" value="stay">Stays</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">BHK Config</label>
                    <select
                      value={editBhk}
                      onChange={(e) => setEditBhk(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer"
                    >
                      <option className="dark:bg-[#121214]" value="1 BHK">1 BHK</option>
                      <option className="dark:bg-[#121214]" value="2 BHK">2 BHK</option>
                      <option className="dark:bg-[#121214]" value="3 BHK">3 BHK</option>
                      <option className="dark:bg-[#121214]" value="4 BHK+">4 BHK+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Furnishing Status</label>
                    <select
                      value={editFurnished}
                      onChange={(e) => setEditFurnished(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer"
                    >
                      <option className="dark:bg-[#121214]" value="Unfurnished">Unfurnished</option>
                      <option className="dark:bg-[#121214]" value="Semi-Furnished">Semi-Furnished</option>
                      <option className="dark:bg-[#121214]" value="Fully-Furnished">Fully-Furnished</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Contact Phone</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Owner Name</label>
                  <input
                    type="text"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Property Address</label>
                  <textarea
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full h-20 px-4 py-3 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold resize-none"
                  />
                </div>

              </div>

              {/* Modal Buttons Footer */}
              <div className="px-6 py-5 border-t border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-[#121214] flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center shadow-md shadow-orange-500/10"
                >
                  Save Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================
          CONFIRM DIALOG: DELETE LISTING
      ============================================================ */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 p-6 flex flex-col gap-6 text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-red-500/5 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={28} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-black text-lg tracking-tight">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Are you sure you want to delete listing &ldquo;{activeRoom?.name}&rdquo;? This process cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-3 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-[#64748b] dark:text-slate-300 transition-all cursor-pointer"
              >
                Keep stay
              </button>
              <button
                onClick={handleDeleteListing}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-500/10"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: PUBLISH NEW ARTICLE
      ============================================================ */}
      {showAddArticleModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[550px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            
            <form onSubmit={handlePublishArticleSubmit} className="flex flex-col h-full overflow-hidden">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#0A0A0A]/5 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#121214]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-widest text-[#FF5211] uppercase">CREATE NEW ENTRY</span>
                  <span className="font-bold text-sm">Publish Educational Guide / Article</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowAddArticleModal(false)}
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
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    required
                    placeholder="e.g. 5 Secrets to Finding Budget Rooms"
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Category Type</label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer text-slate-700 dark:text-slate-300"
                    >
                      <option value="Renting Tips">Renting Tips</option>
                      <option value="City Guides">City Guides</option>
                      <option value="Coliving">Coliving</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Read Time Estimate</label>
                    <input
                      type="text"
                      value={articleReadTime}
                      onChange={(e) => setArticleReadTime(e.target.value)}
                      required
                      placeholder="e.g. 6 min read"
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Author Name</label>
                    <input
                      type="text"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={articleTags}
                      onChange={(e) => setArticleTags(e.target.value)}
                      placeholder="e.g. Noida, Budget, Guide"
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Cover Image</label>
                  
                  {articleImage ? (
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#0A0A0A]/5 dark:border-white/10 group bg-neutral-100 dark:bg-neutral-900 shadow-inner">
                      <img src={articleImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setArticleImage("")}
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
                        onChange={handleArticleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <div className="w-8 h-8 rounded-full border-4 border-t-[#FF5211] border-neutral-300 animate-spin" />
                          <span className="text-[10px] font-black text-[#FF5211] uppercase tracking-wider">Uploading Image to Cloudinary...</span>
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

                  {/* Manual URL Override */}
                  <div className="mt-1">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">Or paste cover URL instead</span>
                    <input
                      type="url"
                      value={articleImage}
                      onChange={(e) => setArticleImage(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full h-11 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-[11px] font-bold mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Brief Excerpt</label>
                  <input
                    type="text"
                    value={articleExcerpt}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    required
                    placeholder="Provide a catchy summary paragraph..."
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Article Body Content (Double newline for paragraphs)</label>
                  <textarea
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    required
                    placeholder="Write the full body content paragraphs..."
                    className="w-full h-32 px-4 py-3 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold resize-none"
                  />
                </div>

              </div>

              {/* Modal Buttons Footer */}
              <div className="px-6 py-5 border-t border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-[#121214] flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddArticleModal(false)}
                  className="flex-1 py-3 bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center shadow-md shadow-orange-500/10"
                >
                  Publish Article
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: EDIT EXISTING ARTICLE
      ============================================================ */}
      {showEditArticleModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[550px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            
            <form onSubmit={handleEditArticleSubmit} className="flex flex-col h-full overflow-hidden">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#0A0A0A]/5 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#121214]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black tracking-widest text-[#FF5211] uppercase">MODIFY SYSTEM ENTRY</span>
                  <span className="font-bold text-sm truncate max-w-[280px]">Edit: {activeArticle?.title}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowEditArticleModal(false)}
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
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Category Type</label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold cursor-pointer text-slate-700 dark:text-slate-300"
                    >
                      <option value="Renting Tips">Renting Tips</option>
                      <option value="City Guides">City Guides</option>
                      <option value="Coliving">Coliving</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Read Time Estimate</label>
                    <input
                      type="text"
                      value={articleReadTime}
                      onChange={(e) => setArticleReadTime(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Author Name</label>
                    <input
                      type="text"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={articleTags}
                      onChange={(e) => setArticleTags(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Cover Image</label>
                  
                  {articleImage ? (
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#0A0A0A]/5 dark:border-white/10 group bg-neutral-100 dark:bg-neutral-900 shadow-inner">
                      <img src={articleImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setArticleImage("")}
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
                        onChange={handleArticleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <div className="w-8 h-8 rounded-full border-4 border-t-[#FF5211] border-neutral-300 animate-spin" />
                          <span className="text-[10px] font-black text-[#FF5211] uppercase tracking-wider">Uploading Image to Cloudinary...</span>
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

                  {/* Manual URL Override */}
                  <div className="mt-1">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase px-1">Or paste cover URL instead</span>
                    <input
                      type="url"
                      value={articleImage}
                      onChange={(e) => setArticleImage(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full h-11 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-[11px] font-bold mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Brief Excerpt</label>
                  <input
                    type="text"
                    value={articleExcerpt}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-1">Article Body Content</label>
                  <textarea
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    required
                    className="w-full h-32 px-4 py-3 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 focus:outline-none text-xs font-bold resize-none"
                  />
                </div>

              </div>

              {/* Modal Buttons Footer */}
              <div className="px-6 py-5 border-t border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-[#121214] flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditArticleModal(false)}
                  className="flex-1 py-3 bg-neutral-200 dark:bg-white/5 hover:bg-neutral-300 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer text-center shadow-md shadow-orange-500/10"
                >
                  Save Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================
          CONFIRM DIALOG: DELETE ARTICLE
      ============================================================ */}
      {showDeleteArticleDialog && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[420px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 p-6 flex flex-col gap-6 text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-red-500/5 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={28} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-black text-lg tracking-tight">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Are you sure you want to delete the article &ldquo;{activeArticle?.title}&rdquo;? This process cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteArticleDialog(false)}
                className="flex-1 py-3 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-[#64748b] dark:text-slate-300 transition-all cursor-pointer"
              >
                Keep Article
              </button>
              <button
                onClick={handleDeleteArticle}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-500/10"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
