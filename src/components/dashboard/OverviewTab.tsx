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
        
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:shadow-md hover:border-[#FF5211]/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">TOTAL INVENTORY</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-500/5 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shrink-0">
              <Home size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-3xl font-black">{loadingRooms ? "—" : stats.total}</span>
            <span className="text-[11px] font-semibold text-green-500">Live & Searchable stays</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:shadow-md hover:border-[#FF5211]/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">ZERO BROKERAGE</span>
            <div className="w-10 h-10 rounded-2xl bg-green-500/5 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform shrink-0">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-3xl font-black">{loadingRooms ? "—" : stats.zeroBrokerage}</span>
            <span className="text-[11px] font-semibold text-[#FF5211]">100% Direct Owner Contacts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:shadow-md hover:border-[#FF5211]/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">AVERAGE RENT</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/5 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shrink-0">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-3xl font-black">₹{loadingRooms ? "—" : stats.avgRent.toLocaleString("en-IN")}</span>
            <span className="text-[11px] font-semibold text-blue-500">Per Month across India</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group hover:shadow-md hover:border-[#FF5211]/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-[#64748b] dark:text-[#94a3b8] uppercase">ACTIVE CITIES</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/5 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shrink-0">
              <MapPin size={18} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-3xl font-black">{loadingRooms ? "—" : stats.citiesCount}</span>
            <span className="text-[11px] font-semibold text-purple-500">Major metropolitan hubs</span>
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
            <div className="px-3 py-1 bg-[#F3F4F6] dark:bg-white/5 rounded-xl text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400">INDEXED CITIES</div>
          </div>
          
          {/* Styled CSS Bars for City Counts */}
          <div className="flex flex-col gap-5 py-4">
            {loadingRooms ? (
              <div className="flex flex-col gap-4 py-8 items-center text-slate-400">
                <RefreshCw className="animate-spin text-[#FF5211]" size={24} />
                <span className="text-xs font-bold">Populating metrics data...</span>
              </div>
            ) : cityAnalytics.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-bold">No city records found.</div>
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
                  <div key={item.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold px-1">
                      <span className="capitalize">{item.name}</span>
                      <span className="opacity-60">{item.value} Listings ({Math.round((item.value / stats.total) * 100)}%)</span>
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

        {/* Activity log Box */}
        <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-black text-[18px] tracking-tight">Recent Administrative Logs</h2>
            <span className="text-[11px] opacity-50 font-medium">Audit records for the system sessions</span>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
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
              
              return (
                <div key={log.id} className="flex gap-3 items-start p-3 bg-[#FBFBFA] dark:bg-white/[0.02] border border-[#0A0A0A]/5 dark:border-white/5 rounded-2xl">
                  <div className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center ${bgClasses[log.type]}`}>
                    {icons[log.type]}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-xs font-semibold leading-relaxed break-words">{log.message}</p>
                    <span className="text-[10px] opacity-40 font-bold">{log.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Action shortcuts row */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#FF5211] shrink-0">
            <Building2 size={22} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-black text-lg leading-tight">Need to list a new property stay?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Add real-time rooms with geocoded mapping pins instantly.</p>
          </div>
        </div>
        <button
          onClick={onAddListingClick}
          className="w-full md:w-auto px-6 py-3.5 bg-[#FF5211] text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-orange-500/15 hover:scale-[1.02] active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          Create New Stay Listing
        </button>
      </div>

    </div>
  );
}
