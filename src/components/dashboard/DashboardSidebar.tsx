"use client";

import React from "react";
import { LayoutDashboard, Building2, PieChart, AlertTriangle, BookOpen, Users, Bell } from "lucide-react";

type DashboardTab = "overview" | "listings" | "analytics" | "reports" | "articles" | "users" | "notifications";

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  roomsCount: number;
  reportsCount: number;
  articlesCount: number;
  usersCount: number;
  notificationsCount: number;
  user: any;
}

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
  roomsCount,
  reportsCount,
  articlesCount,
  usersCount,
  notificationsCount,
  user
}: DashboardSidebarProps) {
  return (
    <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
        
        {/* User overview info */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#0A0A0A]/5 dark:border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/10 shrink-0">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#FF5211] uppercase">ADMINISTRATOR</span>
            <span className="font-bold text-[15px] truncate max-w-[160px]">
              {user?.name || user?.displayName || user?.email?.split('@')[0] || "Staff Account"}
            </span>
          </div>
        </div>

        {/* Sidebar navigation tabs list */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "overview" 
                ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" 
                : "text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/5"
            }`}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "listings" 
                ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" 
                : "text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/5"
            }`}
          >
            <Building2 size={18} />
            Listings
            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === "listings" ? "bg-white/20 text-white" : "bg-[#F3F4F6] dark:bg-white/10 text-[#64748b]"
            }`}>
              {roomsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "analytics" 
                ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" 
                : "text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/5"
            }`}
          >
            <PieChart size={18} />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "reports" 
                ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" 
                : "text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/5"
            }`}
          >
            <AlertTriangle size={18} />
            Flagged
            {reportsCount > 0 && (
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === "reports" ? "bg-white/20 text-white" : "bg-red-500/10 text-red-500"
              }`}>
                {reportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "articles" 
                ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" 
                : "text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/5"
            }`}
          >
            <BookOpen size={18} />
            Articles
            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === "articles" ? "bg-white/20 text-white" : "bg-[#F3F4F6] dark:bg-white/10 text-[#64748b]"
            }`}>
              {articlesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "users" 
                ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" 
                : "text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/5"
            }`}
          >
            <Users size={18} />
            Users
            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === "users" ? "bg-white/20 text-white" : "bg-[#F3F4F6] dark:bg-white/10 text-[#64748b]"
            }`}>
              {usersCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              activeTab === "notifications" 
                ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" 
                : "text-[#64748b] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/5"
            }`}
          >
            <Bell size={18} />
            Notifications
            {notificationsCount > 0 && (
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === "notifications" ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-500"
              }`}>
                {notificationsCount}
              </span>
            )}
          </button>
        </nav>
        
        {/* Quick overview note */}
        <div className="mt-8 p-4 rounded-2xl bg-[#FAFAF8] dark:bg-white/5 border border-[#0A0A0A]/5 dark:border-white/5 flex flex-col gap-2">
          <span className="text-[10px] font-black tracking-wider text-[#FF5211]">SYSTEM UPDATE</span>
          <p className="text-[11px] font-medium leading-relaxed opacity-60 text-slate-500 dark:text-slate-400">
            Connected to secure Cloudinary buckets & reverse geocoding indices. Manual verification active.
          </p>
        </div>

      </div>
    </aside>
  );
}
