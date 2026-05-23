"use client";

import React from "react";
import { Check, Info } from "lucide-react";

interface Report {
  id: string;
  postId: string;
  title: string;
  reporter: string;
  reason: string;
  date: string;
  status: string;
}

interface ReportsTabProps {
  reports: Report[];
  onDismissReport: (id: string) => void;
  onRemoveReported: (postId: string, reportId: string) => void;
}

export default function ReportsTab({
  reports,
  onDismissReport,
  onRemoveReported
}: ReportsTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-2">
        <h2 className="font-black text-[20px] tracking-tight">Listing Policy Reports</h2>
        <span className="text-[11px] opacity-50 font-medium">Review reports flagged by user community for listings accuracy</span>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-12 text-center shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-500/5 flex items-center justify-center text-green-500">
            <Check size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-black text-lg">Clean Sweep! No Flagged Items</h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              All reported listings have been reviewed and resolved. Database stays are compliant with guidelines.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((rep) => (
            <div 
              key={rep.id} 
              className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full tracking-wider">
                    GUIDELINE VIOLATION
                  </span>
                  <span className="text-[10px] opacity-40 font-bold">{rep.date}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-sm leading-tight text-slate-800 dark:text-white flex items-center gap-2">
                    {rep.title}
                    <span className="text-[10px] opacity-30 font-medium">({rep.postId})</span>
                  </h3>
                  <span className="text-[10px] opacity-50 font-semibold">Flagged by: {rep.reporter}</span>
                </div>

                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-xs font-semibold text-red-600/90 leading-relaxed flex gap-2.5 items-start">
                  <Info className="shrink-0 mt-0.5" size={14} />
                  <span>&ldquo;{rep.reason}&rdquo;</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onDismissReport(rep.id)}
                  className="py-3 bg-[#F3F4F6] dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-wider text-[#64748b] dark:text-slate-300 transition-all cursor-pointer text-center"
                >
                  Dismiss Flag
                </button>
                <button
                  onClick={() => onRemoveReported(rep.postId, rep.id)}
                  className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center shadow-md shadow-red-500/10"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
