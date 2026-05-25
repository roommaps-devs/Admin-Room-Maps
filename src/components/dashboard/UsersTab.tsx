"use client";

import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Mail, Calendar, UserCheck, Copy, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface UserEntry {
  name: string | null;
  email: string;
  createdAt: string;
}

interface UsersTabProps {
  users: UserEntry[];
  loadingUsers: boolean;
  onDeleteUserClick?: (user: UserEntry) => void;
}

// Dynamic gradient color generator for user initials based on email string
const getAvatarGradient = (email: string) => {
  const charCode = email.charCodeAt(0) || 0;
  const gradients = [
    "from-orange-500 to-rose-500",
    "from-blue-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600"
  ];
  return gradients[charCode % gradients.length];
};

export default function UsersTab({
  users,
  loadingUsers,
  onDeleteUserClick
}: UsersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      return nameMatch || emailMatch;
    });
  }, [users, searchTerm]);

  // Copy Email Helper
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Toolbar & Search Drawer */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-black text-[20px] tracking-tight">User Management Database</h2>
            <span className="text-[11px] opacity-50 font-medium">Manage and audit registered user details, credentials, and access timestamps</span>
          </div>
          <div className="flex items-center gap-2 self-end text-[10px] font-black text-[#FF5211] bg-orange-500/5 px-4 py-2.5 rounded-full uppercase tracking-wider">
            Total Users: {users.length}
          </div>
        </div>

        {/* Filter and Search row */}
        <div className="w-full max-w-md pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35 text-slate-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent focus:border-[#FF5211]/30 text-xs font-bold placeholder:opacity-50 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table listing card container */}
      <div className="bg-white dark:bg-[#121214] border border-[#0A0A0A]/5 dark:border-white/10 rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#0A0A0A]/5 dark:border-white/10 bg-[#FAFAF8] dark:bg-white/[0.01]">
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">User Profile</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Email Address</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Date Joined</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">Access Role</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500">System Status</th>
                <th className="py-4.5 px-6 text-[10px] font-black tracking-wider uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/5 dark:divide-white/10">
              {loadingUsers ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col gap-2 items-center">
                      <RefreshCw className="animate-spin text-[#FF5211]" size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">Loading user database registry...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-black text-xs uppercase tracking-wide">
                    No users match the search terms.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initial = (user.name || user.email).charAt(0).toUpperCase();
                  const gradient = getAvatarGradient(user.email);
                  
                  return (
                    <tr key={user.email} className="hover:bg-[#FBFBFA] dark:hover:bg-white/[0.01] transition-colors">
                      
                      {/* User Profile Cell */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm shadow-orange-500/5`}>
                            {initial}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-[14px]">
                              {user.name || "Unnamed User"}
                            </span>
                            <span className="text-[10px] opacity-40 font-semibold tracking-wide">Registered Account</span>
                          </div>
                        </div>
                      </td>

                      {/* Email Address Cell */}
                      <td className="py-4 px-6 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="opacity-40" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Date Joined Cell */}
                      <td className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="opacity-40" />
                          <span>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            }) : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Access Role Badge */}
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-600 dark:text-slate-400">
                          User
                        </span>
                      </td>

                      {/* System Status Badge */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600">
                          <UserCheck size={10} />
                          Active
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleCopyEmail(user.email)}
                            title="Copy user email"
                            className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-[#FF5211]/20 text-[#64748b] hover:text-[#FF5211] transition-all cursor-pointer"
                          >
                            <Copy size={14} />
                          </button>
                          {onDeleteUserClick && (
                            <button
                              onClick={() => onDeleteUserClick(user)}
                              title="Revoke user access"
                              className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-white/5 border border-transparent hover:border-red-500/20 text-[#64748b] hover:text-red-500 transition-all cursor-pointer"
                            >
                              <ShieldAlert size={14} />
                            </button>
                          )}
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
