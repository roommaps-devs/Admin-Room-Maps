"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { RootState } from "@/store/store";
import AdminDashboard from "@/components/AdminDashboard";
import LoginPage from "@/app/(auth)/login/page";

export default function AdminPageClient() {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.user);
  const [checkingCookie, setCheckingCookie] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getCookie("drive_access_token");
    setHasToken(!!token);
    setCheckingCookie(false);
  }, []);

  // Show a premium loading spinner while initializing if we have a token to verify
  if (checkingCookie || (!isInitialized && hasToken)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAF8] dark:bg-[#0A0A0A] gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin" />
          <Loader2 className="absolute text-orange-500 animate-pulse" size={24} />
        </div>
        <p className="text-sm font-semibold tracking-wide text-neutral-400 dark:text-neutral-500 animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return <LoginPage />;
}
