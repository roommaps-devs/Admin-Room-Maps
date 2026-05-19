"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon, Mail, Lock, ArrowLeft, Eye, EyeOff,
  Shield, Zap, Check, CheckCircle2, Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postRequest } from "@/lib/apiCall";
import { ResponseMessage, catchResponseMessage, ApiResponse } from "@/components/ResponseMessage";
import { setUser } from "@/store/userSlice";
import GoogleLogin from "@/components/GoogleLogin";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AuthSchema = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

type Tab = "login" | "signup";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) || "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(tab === "login" ? loginSchema : signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const tabParam = searchParams.get("tab") as Tab;
    if (tabParam && (tabParam === "login" || tabParam === "signup")) {
      setTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    reset();
    // Update URL without refresh
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.pushState({}, "", url);
  };

  const verifyToken = async (token: string, userData?: any) => {
    if (token) {
      try {
        const res = await postRequest<ApiResponse<any>>("/auth/verify", { accessToken: token });
        setCookie("drive_access_token", token);
        if (res.success) {
          dispatch(setUser(res.data?.user || res.data || userData));
          router.push("/");
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Token verification failed:", err);
      }
    }
  };

  const onSubmit = async (data: AuthSchema) => {
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await postRequest<ApiResponse<any>>("/auth/login", {
          email: data.email,
          password: data.password,
        });
        ResponseMessage(res);
        if (res.success && res.data?.accessToken) {
          await verifyToken(res.data.accessToken, res.data.user || res.data);
        }
      } else {
        const res = await postRequest<ApiResponse<any>>("/auth/register", {
          name: data.name,
          email: data.email,
          password: data.password,
        });
        ResponseMessage(res);
        if (res.success) {
          handleTabChange("login");
        }
      }
    } catch (err) {
      catchResponseMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background flex items-center justify-center p-6 overflow-hidden">

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-brand-text-primary/50 text-sm font-semibold px-4 py-2.5 bg-brand-surface backdrop-blur-md rounded-full border border-brand-glass-border transition-all hover:text-brand-text-primary hover:bg-brand-surface-elevated hover:-translate-x-1 z-10"
      >
        <ArrowLeft size={15} /> Home
      </Link>

      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-brand-surface-elevated/60 backdrop-blur-[50px] border border-brand-glass-border rounded-[28px] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.1)] flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-[26px] font-extrabold text-brand-text-primary tracking-tight leading-none">
              Room<span className="text-brand-primary">Maps</span>
            </h1>
            <p className="text-brand-text-primary/35 text-[13px] font-medium">Find your perfect stay</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-brand-surface rounded-2xl p-1 gap-1 border border-black/5 dark:border-white/10">
            {(["login", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${tab === t
                  ? 'bg-brand-primary text-white shadow-[0_4px_20px_rgba(255,82,17,0.35)]'
                  : 'text-brand-text-primary/40 hover:text-brand-text-primary/70'
                  }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">

            {/* Name - Signup Only */}
            {tab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <div className="relative group">
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-primary/30 group-focus-within:text-brand-primary transition-colors pointer-events-none" />
                  <Input
                    {...register("name")}
                    placeholder="Full name"
                    className={`w-full bg-brand-surface border ${errors.name ? 'border-red-500/50' : 'border-black/10 dark:border-white/20'} rounded-2xl pl-11 pr-4 py-6 text-brand-text-primary text-sm placeholder:text-brand-text-primary/25 focus:outline-none focus:ring-0 focus:border-brand-primary/60 focus:bg-brand-surface-elevated transition-all`}
                  />
                </div>
                {errors.name && <span className="text-[11px] text-red-500/80 ml-4">{errors.name.message}</span>}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-primary/30 group-focus-within:text-brand-primary transition-colors pointer-events-none" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email address"
                  className={`w-full bg-brand-surface border ${errors.email ? 'border-red-500/50' : 'border-black/10 dark:border-white/20'} rounded-2xl pl-11 pr-4 py-6 text-brand-text-primary text-sm placeholder:text-brand-text-primary/25 focus:outline-none focus:ring-0 focus:border-brand-primary/60 focus:bg-brand-surface-elevated transition-all`}
                />
              </div>
              {errors.email && <span className="text-[11px] text-red-500/80 ml-4">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-primary/30 group-focus-within:text-brand-primary transition-colors pointer-events-none" />
                <Input
                  {...register("password")}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`w-full bg-brand-surface border ${errors.password ? 'border-red-500/50' : 'border-black/10 dark:border-white/20'} rounded-2xl pl-11 pr-12 py-6 text-brand-text-primary text-sm placeholder:text-brand-text-primary/25 focus:outline-none focus:ring-0 focus:border-brand-primary/60 focus:bg-brand-surface-elevated transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-primary/30 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-red-500/80 ml-4">{errors.password.message}</span>}

              {tab === 'login' && (
                <div className="flex justify-end pr-1">
                  <Link href="/forgot-password" className="text-[11px] font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            {/* Confirm Password - Signup Only */}
            {tab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-primary/30 group-focus-within:text-brand-primary transition-colors pointer-events-none" />
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    className={`w-full bg-brand-surface border ${errors.confirmPassword ? 'border-red-500/50' : 'border-black/10 dark:border-white/20'} rounded-2xl pl-11 pr-12 py-6 text-brand-text-primary text-sm placeholder:text-brand-text-primary/25 focus:outline-none focus:ring-0 focus:border-brand-primary/60 focus:bg-brand-surface-elevated transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-primary/30 hover:text-brand-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-[11px] text-red-500/80 ml-4">{errors.confirmPassword.message}</span>}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white font-bold text-sm py-7 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(255,82,17,0.35)] hover:shadow-[0_12px_40px_rgba(255,82,17,0.45)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 border-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>{tab === 'signup' ? 'Creating account...' : 'Signing in...'}</span>
                </div>
              ) : (
                tab === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-brand-glass-border" />
            <span className="text-brand-text-primary/25 text-xs font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-brand-glass-border" />
          </div>

          {/* Google Sign-in */}
          <div className="w-full">
            <GoogleLogin />
          </div>

          {/* Trust Pills */}
          <div className="flex justify-center gap-3 pt-1">
            {[
              { icon: <Shield size={12} />, label: 'Secure Auth' },
              { icon: <Zap size={12} />, label: 'Instant Access' },
              { icon: <Check size={12} />, label: 'Free Forever' }
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-text-primary/30">
                <span className="text-brand-primary">{icon}</span>{label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
