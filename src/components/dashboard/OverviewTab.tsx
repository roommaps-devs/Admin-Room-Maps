"use client";

import React, { useMemo } from "react";
import { Home, ShieldCheck, IndianRupee, MapPin, RefreshCw, Plus, Building2, Star, Edit3, Trash2, AlertTriangle } from "lucide-react";
import { Room } from "@/lib/types";

interface ActivityLog {
  id: string;
  type: "add" | "edit" | "delete" | "trending" | "report";
  message: string;
  time: string;
}

interface OverviewTabProps {
  rooms: Room[];
  loadingRooms: boolean;
  activityLogs: ActivityLog[];
  onAddListingClick: () => void;
}

export default function OverviewTab({
  rooms,
  loadingRooms,
  activityLogs,
  onAddListingClick
}: OverviewTabProps) {
  // Calculated Stats
  const stats = useMemo(() => {
    const total = rooms.length;
    const zeroBrokerage = total; 
    
    const rents = rooms.map(r => r.rent).filter(r => !isNaN(r) && r > 0);
    const avgRent = rents.length > 0 
      ? Math.round(rents.reduce((acc, r) => acc + r, 0) / rents.length) 
      : 12500;
      
    const trending = rooms.filter(r => r.isTrending).length;
    const uniqueCities = Array.from(new Set(rooms.map(r => r.city).filter(Boolean)));
    
    return {
      total,
      zeroBrokerage,
      avgRent,
      trending,
      citiesCount: uniqueCities.length
    };
  }, [rooms]);

  // Analytics Math (City Distribution)
  const cityAnalytics = useMemo(() => {
    const counts: Record<string, number> = {};
    rooms.forEach(r => {
      const city = r.city || "Other";
      counts[city] = (counts[city] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5 cities
  }, [rooms]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Stat Cards Grid Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Inventory Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/20 transition-all duration-500">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-orange-500/5 blur-2xl group-hover:bg-orange-500/10 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">TOTAL INVENTORY</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-500/5 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all shrink-0 shadow-sm">
              <Home size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 relative z-10">
            <span className="text-3xl font-black tracking-tight">{loadingRooms ? "—" : stats.total}</span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Live & Searchable stays</span>
          </div>
        </div>

        {/* Zero Brokerage Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all duration-500">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">ZERO BROKERAGE</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all shrink-0 shadow-sm">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 relative z-10">
            <span className="text-3xl font-black tracking-tight">{loadingRooms ? "—" : stats.zeroBrokerage}</span>
            <span className="text-[10px] font-bold text-[#FF5211] uppercase tracking-wider">100% Direct Owner Contacts</span>
          </div>
        </div>

        {/* Average Rent Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/20 transition-all duration-500">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">AVERAGE RENT</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/5 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all shrink-0 shadow-sm">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 relative z-10">
            <span className="text-3xl font-black tracking-tight">₹{loadingRooms ? "—" : stats.avgRent.toLocaleString("en-IN")}</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Per Month across India</span>
          </div>
        </div>

        {/* Active Cities Card */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-500/20 transition-all duration-500">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">ACTIVE CITIES</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/5 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all shrink-0 shadow-sm">
              <MapPin size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 relative z-10">
            <span className="text-3xl font-black tracking-tight">{loadingRooms ? "—" : stats.citiesCount}</span>
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Major metropolitan hubs</span>
          </div>
        </div>

      </div>

      {/* Main dashboard stats & logs panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Visual Overview Graph Box */}
        <div className="xl:col-span-2 bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="font-black text-[18px] tracking-tight">Geographical Distribution</h2>
              <span className="text-[11px] opacity-50 font-medium">Top active cities by room listing counts</span>
            </div>
            <div className="px-3 py-1.5 bg-[#F3F4F6] dark:bg-white/5 rounded-xl text-[9px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">INDEXED CITIES</div>
          </div>
          
          {/* Styled CSS Bars for City Counts */}
          <div className="flex flex-col gap-3 py-2">
            {loadingRooms ? (
              <div className="flex flex-col gap-4 py-16 items-center text-slate-400">
                <RefreshCw className="animate-spin text-[#FF5211]" size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Populating metrics data...</span>
              </div>
            ) : cityAnalytics.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400 font-black uppercase tracking-wider">No city records found.</div>
            ) : (
              cityAnalytics.map((item, idx) => {
                const maxVal = cityAnalytics[0]?.value || 1;
                const pct = Math.round((item.value / maxVal) * 100);
                const colors = [
                  "from-orange-500 to-amber-500",
                  "from-rose-500 to-orange-500",
                  "from-purple-500 to-indigo-500",
                  "from-blue-500 to-sky-500",
                  "from-emerald-500 to-teal-500"
                ];
                const barColor = colors[idx % colors.length];
                
                return (
                  <div key={item.name} className="flex flex-col gap-2 p-3 rounded-2xl hover:bg-[#F3F4F6]/50 dark:hover:bg-white/[0.02] transition-colors group/item">
                    <div className="flex justify-between items-center text-xs font-bold px-1">
                      <span className="capitalize text-slate-700 dark:text-slate-300 group-hover/item:text-[#FF5211] transition-colors">{item.name}</span>
                      <span className="opacity-60 text-[11px] text-slate-500">{item.value} Listings ({Math.round((item.value / stats.total) * 100)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#F3F4F6] dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity log Box with chronological vertical connecting timeline */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-1">
            <h2 className="font-black text-[18px] tracking-tight">Recent Administrative Logs</h2>
            <span className="text-[11px] opacity-50 font-medium">Audit records for the system sessions</span>
          </div>

          <div className="relative flex flex-col gap-4 overflow-y-auto max-h-[310px] pr-2 mt-2">
            
            {/* Visual dashed connecting vertical timeline bar */}
            {activityLogs.length > 0 && (
              <div className="absolute left-[19px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-slate-200 dark:border-white/10 z-0" />
            )}

            {activityLogs.map((log) => {
              const icons = {
                add: <Plus className="text-green-500" size={14} />,
                edit: <Edit3 className="text-blue-500" size={14} />,
                delete: <Trash2 className="text-red-500" size={14} />,
                trending: <Star className="text-orange-500" size={14} />,
                report: <AlertTriangle className="text-amber-500" size={14} />
              };
              
              const bgClasses = {
                add: "bg-green-500/5",
                edit: "bg-blue-500/5",
                delete: "bg-red-500/5",
                trending: "bg-orange-500/5",
                report: "bg-amber-500/5"
              };

              const borderColors = {
                add: "group-hover/log:border-green-500",
                edit: "group-hover/log:border-blue-500",
                delete: "group-hover/log:border-red-500",
                trending: "group-hover/log:border-orange-500",
                report: "group-hover/log:border-amber-500"
              };

              const dotColors = {
                add: "bg-green-500",
                edit: "bg-blue-500",
                delete: "bg-red-500",
                trending: "bg-orange-500",
                report: "bg-amber-500"
              };
              
              return (
                <div key={log.id} className="relative flex gap-6 items-start pl-8 group/log z-10">
                  
                  {/* Dotted/glowing timeline pin node */}
                  <div className={`absolute left-[19px] top-4 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-[#121214] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center ${borderColors[log.type]} group-hover/log:scale-110 transition-all duration-300 z-20`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${dotColors[log.type]}`} />
                  </div>

                  {/* Content body */}
                  <div className="flex-1 flex gap-3 items-start p-4 bg-[#FBFBFA] dark:bg-white/[0.01] hover:bg-[#FBFBFA] dark:hover:bg-white/[0.03] border border-[#0A0A0A]/5 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl transition-all duration-300 shadow-sm">
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${bgClasses[log.type]} shadow-sm`}>
                      {icons[log.type]}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-200">{log.message}</p>
                      <span className="text-[9px] opacity-50 font-black uppercase tracking-wider">{log.time}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Action shortcuts row with mesh background gradients */}
      <div className="bg-gradient-to-tr from-[#FF5211]/5 via-white to-purple-500/5 dark:via-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group transition-all duration-500">
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#FF5211]/5 blur-3xl group-hover:bg-[#FF5211]/10 transition-all duration-700" />
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-all duration-700" />
        
        <div className="flex gap-4 items-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#FF5211] shrink-0 shadow-sm">
            <Building2 size={22} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-black text-lg leading-tight">Need to list a new property stay?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Add real-time rooms with geocoded mapping pins instantly.</p>
          </div>
        </div>
        <button
          onClick={onAddListingClick}
          className="w-full md:w-auto px-6 py-3.5 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-95 transition-all shrink-0 cursor-pointer relative z-10"
        >
          Create New Stay Listing
        </button>
      </div>

    </div>
  );
}
