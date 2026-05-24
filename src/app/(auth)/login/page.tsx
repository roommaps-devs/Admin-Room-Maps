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
import { postRequest, getRequest } from "@/lib/apiCall";
import { ResponseMessage, catchResponseMessage, ApiResponse } from "@/components/ResponseMessage";
import { clearUser, setUser } from "@/store/userSlice";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchema = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const verifyToken = async (token: string, userData?: any) => {
  if (!token) return;

  try {
    const res = await postRequest<ApiResponse<any>>(
      "/admin/verify",
      {
        accessToken: token,
      }
    );

    // If not authorized
    if (!res.success) {
      ResponseMessage(res);

      // Remove token
      setCookie("drive_access_token", "", {
        path: "/",
        maxAge: 0,
      });

      // Clear redux user
      dispatch(clearUser());

      router.push("/login");
      return;
    }

    // Save token only for admin
    setCookie("drive_access_token", token, {
      path: "/",
    });

    // Fetch full admin profile
    let adminData = res.data?.user || res.data || userData;

    try {
      const profileRes = await getRequest<any>("/admin/profile");

      if (profileRes.success && profileRes.data) {
        adminData = profileRes.data.user || profileRes.data;
      }
    } catch (profileErr) {
      console.warn(
        "Failed to fetch admin profile:",
        profileErr
      );
    }

    // Save admin in redux
    dispatch(setUser(adminData));

    // Success message only for admin
    ResponseMessage({
      success: true,
      message: "Admin logged in successfully",
    });

    const redirect = searchParams.get("redirect");

    router.push(redirect || "/");

  } catch (err: any) {
    console.warn("Token verification failed:", err);

    catchResponseMessage(err);

    // Remove token
    setCookie("drive_access_token", "", {
      path: "/",
      maxAge: 0,
    });

    dispatch(clearUser());

    router.push("/login");
  }
};

const onSubmit = async (data: LoginSchema) => {
  setLoading(true);

  try {
    const res = await postRequest<ApiResponse<any>>(
      "/auth/login",
      {
        email: data.email,
        password: data.password,
      }
    );

    // DO NOT show success here
    // because admin verification is pending

    if (res.success && res.data?.accessToken) {
      await verifyToken(
        res.data.accessToken,
        res.data.user || res.data
      );
    } else {
      ResponseMessage(res);
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">

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

              <div className="flex justify-end pr-1">
                <Link href="/forgot-password" className="text-[11px] font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white font-bold text-sm py-7 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(255,82,17,0.35)] hover:shadow-[0_12px_40px_rgba(255,82,17,0.45)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 border-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>


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
