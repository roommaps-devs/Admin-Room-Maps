"use client";

import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { deleteCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const { isAuthenticated, user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide header on auth pages
  const isAuthPage = pathname === "/" || pathname === "/register";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    deleteCookie("drive_access_token");
    dispatch(clearUser());
    setDropdownOpen(false);
    router.push("/");
  };

  if (isAuthPage) return null;

  // Get user initials for avatar fallback
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) return email[0].toUpperCase();
    return "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline text-inherit">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-[10px] flex items-center justify-center text-white shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1a1a2e]">RoomMaps</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 bg-gray-50 border border-black/[0.08] rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-[34px] h-[34px] rounded-full object-cover border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center text-[13px] font-bold tracking-wider">
                    {getInitials(user.name, user.email)}
                  </div>
                )}
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[13px] font-semibold text-[#1a1a2e]">{user.name || "User"}</span>
                  <span className="text-[11px] text-gray-500">{user.email}</span>
                </div>
                <svg
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 min-w-[220px] bg-white border border-black/[0.08] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] p-1.5 animate-[dropdownIn_0.15s_ease-out]">
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-[#1a1a2e] m-0">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 mt-0.5 m-0">{user.email}</p>
                  </div>
                  <div className="h-px bg-black/[0.06] my-1" />
                  <button
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-gray-700 bg-transparent border-none rounded-lg cursor-pointer transition-colors duration-150 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/dashboard");
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                  </button>
                  <div className="h-px bg-black/[0.06] my-1" />
                  <button
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-red-500 bg-transparent border-none rounded-lg cursor-pointer transition-colors duration-150 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg no-underline transition-all duration-200 shadow-[0_2px_8px_rgba(26,26,46,0.25)] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(26,26,46,0.35)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
