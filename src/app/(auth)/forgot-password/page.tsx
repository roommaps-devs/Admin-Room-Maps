"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postRequest } from "@/lib/apiCall";
import { ResponseMessage, catchResponseMessage, ApiResponse } from "@/components/ResponseMessage";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotSchema = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotSchema) => {
    setLoading(true);
    try {
      const res = await postRequest<ApiResponse>("/auth/forgot-password", data);
      ResponseMessage(res);
      if (res.success) {
        setIsSubmitted(true);
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
        href="/login" 
        className="absolute top-6 left-6 flex items-center gap-2 text-brand-text-primary/50 text-sm font-semibold px-4 py-2.5 bg-brand-surface backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 transition-all hover:text-brand-text-primary hover:bg-brand-surface-elevated hover:-translate-x-1 z-10"
      >
        <ArrowLeft size={15} /> Back to Login
      </Link>

      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-brand-surface-elevated/60 backdrop-blur-[50px] border border-black/5 dark:border-white/10 rounded-[28px] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.1)] flex flex-col gap-6">

          {/* Icon & Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-14 h-14 mb-1 relative overflow-hidden rounded-[12px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
               <KeyRound className="text-brand-primary w-8 h-8" />
            </div>
            <h1 className="text-[26px] font-extrabold text-brand-text-primary tracking-tight leading-none">
              Reset <span className="text-brand-primary">Password</span>
            </h1>
            <p className="text-brand-text-primary/35 text-[13px] font-medium max-w-[280px] mx-auto mt-2">
              {isSubmitted 
                ? "Check your email for a link to reset your password."
                : "Enter the email address associated with your account."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold text-sm py-7 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(255,82,17,0.35)] hover:shadow-[0_12px_40px_rgba(255,82,17,0.45)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 border-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Sending link...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-brand-text-primary mb-1">Check your inbox</h3>
                <p className="text-brand-text-primary/40 text-sm">We've sent password reset instructions to your email.</p>
              </div>
              <Button 
                onClick={() => router.push('/login')}
                className="w-full bg-brand-surface text-brand-text-primary border border-black/10 dark:border-white/20 rounded-2xl py-6 text-sm font-bold hover:bg-brand-surface-elevated transition-all"
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {/* Footer Link */}
          {!isSubmitted && (
            <div className="text-center pt-2">
              <p className="text-brand-text-primary/30 text-xs font-medium">
                Remember your password?{" "}
                <Link href="/login" className="text-brand-primary font-bold hover:underline underline-offset-4 transition-all">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
