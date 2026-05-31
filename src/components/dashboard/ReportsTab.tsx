"use client";

import React, { useState } from "react";
import { 
  Check, 
  Info, 
  AlertTriangle, 
  Trash2, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Search,
  Activity,
  Building2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface PostInfo {
  id: string;
  name: string;
}

interface BackendReport {
  id: string;
  user_id: string;
  reportList_id: string;
  post_id: string;
  status: "PENDING" | "REVIEWED" | "REJECTED";
  score: number;
  reason: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  user: UserInfo;
  post: PostInfo;
}

interface ReportsTabProps {
  reports: BackendReport[];
  statusCounts: Record<string, number>;
  currentStatus: "PENDING" | "REVIEWED" | "REJECTED";
  onStatusChange: (status: "PENDING" | "REVIEWED" | "REJECTED") => void;
  onUpdateReportStatus: (id: string, oldStatus: string, newStatus: "PENDING" | "REVIEWED" | "REJECTED") => void;
  onRemoveReported: (postId: string, reportId: string) => void;
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onPageChange: (page: number) => void;
  };
}

export default function ReportsTab({
  reports,
  statusCounts,
  currentStatus,
  onStatusChange,
  onUpdateReportStatus,
  onRemoveReported,
  isLoading,
  pagination
}: ReportsTabProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeReportForDelete, setActiveReportForDelete] = useState<BackendReport | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Unknown Date";
    }
  };

  const triggerDelete = (report: BackendReport) => {
    setActiveReportForDelete(report);
    setDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (activeReportForDelete) {
      onRemoveReported(activeReportForDelete.post_id, activeReportForDelete.id);
      setDeleteModalOpen(false);
      setActiveReportForDelete(null);
    }
  };

  

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* ============================================================
          TOP HEADER
      ============================================================ */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black tracking-[0.2em] text-[#FF5211] uppercase flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-[#FF5211]" />
            MODERATION CENTRE
          </span>
          <h2 className="font-black text-[22px] tracking-tight leading-none text-[#0A0A0A] dark:text-white">
            Community Flagged Reports
          </h2>
          <span className="text-[11px] opacity-60 font-semibold text-slate-500 dark:text-slate-400">
            Review reported listings flagged by user community for safety and guideline verification.
          </span>
        </div>
      </div>

      {/* ============================================================
          STATISTICS OVERVIEW CARDS
      ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Flagged Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col gap-1 hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase leading-none">Total Submissions</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              {(statusCounts.PENDING || 0) + (statusCounts.REVIEWED || 0) + (statusCounts.REJECTED || 0)}
            </span>
            <span className="text-[9px] font-black px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-slate-600 dark:text-slate-400">ALL TIME</span>
          </div>
        </div>

        {/* Pending Actions Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col gap-1 hover:shadow-md transition-all duration-300 border-l-[3.5px] border-l-[#FF5211]">
          <span className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase leading-none">Pending Actions</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-[#FF5211] leading-none">
              {statusCounts.PENDING || 0}
            </span>
            <span className="text-[9px] font-black px-2.5 py-1 bg-[#FF5211]/10 rounded-full text-[#FF5211]">URGENT</span>
          </div>
        </div>

        {/* Reviewed & Resolved Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col gap-1 hover:shadow-md transition-all duration-300 border-l-[3.5px] border-l-emerald-500">
          <span className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase leading-none">Reviewed & Resolved</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-emerald-500 leading-none">
              {statusCounts.REVIEWED || 0}
            </span>
            <span className="text-[9px] font-black px-2.5 py-1 bg-emerald-500/10 rounded-full text-emerald-500">SECURE</span>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col gap-1 hover:shadow-md transition-all duration-300 border-l-[3.5px] border-l-red-500">
          <span className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase leading-none">Rejected Flags</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-red-500 leading-none">
              {statusCounts.REJECTED || 0}
            </span>
            <span className="text-[9px] font-black px-2.5 py-1 bg-red-500/10 rounded-full text-red-500">DISMISSED</span>
          </div>
        </div>

      </div>

      {/* ============================================================
          STATUS SELECTOR TABS
      ============================================================ */}
      <div className="flex flex-wrap gap-2.5 bg-neutral-100 dark:bg-white/5 p-1.5 rounded-3xl self-start">
        {(["PENDING", "REVIEWED", "REJECTED"] as const).map((status) => {
          const isActive = currentStatus === status;
          const count = statusCounts[status] || 0;
          
          let tabColor = "text-[#FF5211] bg-white dark:bg-[#121214] shadow-sm";
          let badgeColor = "bg-[#FF5211]/10 text-[#FF5211]";
          
          if (status === "REVIEWED") {
            tabColor = isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-600 dark:text-slate-300 hover:bg-white/10";
            badgeColor = isActive ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-500";
          } else if (status === "REJECTED") {
            tabColor = isActive ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-600 dark:text-slate-300 hover:bg-white/10";
            badgeColor = isActive ? "bg-white/20 text-white" : "bg-red-500/10 text-red-500";
          } else { // PENDING
            tabColor = isActive ? "bg-[#FF5211] text-white shadow-lg shadow-orange-500/20" : "text-slate-600 dark:text-slate-300 hover:bg-white/10";
            badgeColor = isActive ? "bg-white/20 text-white" : "bg-[#FF5211]/10 text-[#FF5211]";
          }

          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${tabColor}`}
            >
              {status === "PENDING" && <Activity size={13} />}
              {status === "REVIEWED" && <CheckCircle size={13} />}
              {status === "REJECTED" && <XCircle size={13} />}
              {status}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          MAIN BODY CONTENT
      ============================================================ */}
      {isLoading ? (
        // Skeleton loader
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white dark:bg-[#121214] border border-neutral-100 dark:border-white/5 rounded-3xl p-6 flex flex-col gap-6 animate-pulse">
              <div className="flex justify-between">
                <div className="w-28 h-4 bg-neutral-200 dark:bg-white/5 rounded-full" />
                <div className="w-16 h-3 bg-neutral-200 dark:bg-white/5 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-5 bg-neutral-200 dark:bg-white/5 rounded-md" />
                <div className="w-1/2 h-3.5 bg-neutral-200 dark:bg-white/5 rounded-md" />
              </div>
              <div className="h-16 bg-neutral-200 dark:bg-white/5 rounded-2xl" />
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-neutral-200 dark:bg-white/5 rounded-xl" />
                <div className="flex-1 h-10 bg-neutral-200 dark:bg-white/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        // Clean sweep empty state
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-16 text-center shadow-sm flex flex-col items-center gap-5">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-inner ${
            currentStatus === "PENDING" 
              ? "bg-emerald-500/5 text-emerald-500" 
              : currentStatus === "REVIEWED" 
              ? "bg-blue-500/5 text-blue-500" 
              : "bg-slate-500/5 text-slate-500"
          }`}>
            {currentStatus === "PENDING" && <CheckCircle size={40} />}
            {currentStatus === "REVIEWED" && <Activity size={40} />}
            {currentStatus === "REJECTED" && <Search size={40} />}
          </div>
          <div className="flex flex-col gap-1.5 max-w-sm mx-auto">
            <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">
              {currentStatus === "PENDING" 
                ? "All Clear! Zero Flagged Stays" 
                : currentStatus === "REVIEWED" 
                ? "No Reviewed Reports Yet" 
                : "No Rejected Flags Recorded"}
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {currentStatus === "PENDING"
                ? "Excellent job! All reports submitted by the community have been fully addressed and resolved."
                : currentStatus === "REVIEWED"
                ? "Once reports are vetted and updated, they will be logged under this section for system audit."
                : "Flags dismissed as inaccurate or false reports appear here."}
            </p>
          </div>
        </div>
      ) : (
        // Reports Table List
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-white/[0.01]">
                  <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Target Stay</th>
                  <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Reported By</th>
                  <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Violation Reason</th>
                  <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Flagged Date</th>
                  <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Status</th>
                  <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A0A0A]/5 dark:divide-white/10">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#FBFBFA] dark:hover:bg-white/[0.01] transition-colors">
                    {/* Target Stay details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-[#0A0A0A]/5 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                          <Building2 size={16} />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-bold text-[13px] text-slate-900 dark:text-white truncate max-w-[200px]" title={rep.post?.name}>
                            {rep.post?.name || "Stay Listing Entry"}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono font-bold leading-none truncate max-w-[150px]">
                            ID: {rep.post_id || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Reported By */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 border border-[#0A0A0A]/5 dark:border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                          <User size={13} />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[150px]">
                            {rep.user?.name || "Anonymous User"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold leading-none truncate max-w-[150px]" title={rep.user?.email}>
                            {rep.user?.email || "No Email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Violation Reason */}
                    <td className="py-4 px-6 max-w-[250px]">
                      <span className="inline-flex px-3 py-1.5 rounded-2xl bg-red-500/5 dark:bg-red-500/[0.03] border border-red-500/10 text-[11px] font-semibold text-red-600 dark:text-red-400/90 leading-snug">
                        &ldquo;{rep.reason || "No detail specified"}&rdquo;
                      </span>
                    </td>

                    {/* Flagged Date */}
                    <td className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {formatDate(rep.created_at)}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider leading-none ${
                        currentStatus === "PENDING"
                          ? "bg-red-500/10 text-red-500"
                          : currentStatus === "REVIEWED"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-neutral-500/10 text-neutral-400"
                      }`}>
                        {currentStatus === "PENDING" ? "PENDING REVIEW" : currentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Inspect Detail Link */}
                        <a
                          href={`/admin/posts/${rep.post_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-[#FF5211]/20 text-[#64748b] hover:text-[#FF5211] transition-all cursor-pointer"
                          title="Inspect Flagged Listing"
                        >
                          <ExternalLink size={14} />
                        </a>

                        {currentStatus === "PENDING" ? (
                          <>
                            {/* Mark Reviewed */}
                            <button
                              onClick={() => onUpdateReportStatus(rep.id, "PENDING", "REVIEWED")}
                              className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-emerald-500/20 text-[#64748b] hover:text-emerald-500 transition-all cursor-pointer"
                              title="Mark Reviewed"
                            >
                              <CheckCircle size={14} />
                            </button>
                            {/* Reject Flag */}
                            <button
                              onClick={() => onUpdateReportStatus(rep.id, "PENDING", "REJECTED")}
                              className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-amber-500/20 text-[#64748b] hover:text-amber-500 transition-all cursor-pointer"
                              title="Reject Flag"
                            >
                              <XCircle size={14} />
                            </button>
                            {/* Delete Target Listing */}
                            <button
                              onClick={() => triggerDelete(rep)}
                              className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-red-500/20 text-[#64748b] hover:text-red-500 transition-all cursor-pointer"
                              title="Delete Target Listing"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          /* Re-open / Restore to Pending */
                          <button
                            onClick={() => onUpdateReportStatus(rep.id, currentStatus, "PENDING")}
                            className="p-2 rounded-xl bg-[#FF5211]/10 border border-transparent hover:border-[#FF5211]/20 text-[#FF5211] hover:bg-[#FF5211]/25 transition-all cursor-pointer"
                            title="Re-open / Restore to Pending"
                          >
                            <ArrowRight size={14} className="rotate-180" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGINATION BAR
      ============================================================ */}
      {pagination.totalPages > 1 && (
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-4 shadow-sm flex items-center justify-between mt-4">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="p-3 bg-neutral-100 dark:bg-white/5 disabled:opacity-40 hover:bg-neutral-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-2xl cursor-pointer disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <span className="text-xs font-black text-slate-500 dark:text-slate-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="p-3 bg-neutral-100 dark:bg-white/5 disabled:opacity-40 hover:bg-neutral-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-2xl cursor-pointer disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ============================================================
          DELETE CONFIRMATION DIALOG MODAL
      ============================================================ */}
      {deleteModalOpen && activeReportForDelete && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[440px] bg-white dark:bg-[#121214] rounded-[36px] overflow-hidden shadow-2xl border border-transparent dark:border-white/10 p-6 flex flex-col gap-6 text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-red-500/5 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 size={26} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">Confirm Removal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed px-2">
                Are you sure you want to permanently delete listing &ldquo;<span className="text-slate-800 dark:text-white font-bold">{activeReportForDelete.post?.name || "Stay Listing"}</span>&rdquo;? This will wipe the listing database and flag this report resolved.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setActiveReportForDelete(null);
                }}
                className="flex-1 py-3.5 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-wider text-[#64748b] dark:text-slate-300 transition-all cursor-pointer"
              >
                Keep Stay
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-500/10"
              >
                Remove Post
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
