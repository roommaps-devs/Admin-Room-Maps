"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postRequest } from "@/lib/apiCall";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod";
import { ResponseMessage, catchResponseMessage, ApiResponse } from "@/components/ResponseMessage";


const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterSchema = z.infer<typeof registerSchema>;


export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

 const {register,handleSubmit,formState:{errors}} = useForm<RegisterSchema>({
  resolver: zodResolver(registerSchema),
  defaultValues: {
    email: "",
    password: "",
  },
 });

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);
    try {
      const res = await postRequest<ApiResponse>("/auth/register", data);
      ResponseMessage(res);
      if (res.success) {
        router.push("/");
      }
    } catch (err) {
      catchResponseMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white relative">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center pt-4">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-blue-100">
              Join Drive and access your files from anywhere
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 space-y-5">
         

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              Email Address
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 h-12"
                {...register("email")}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-gray-400" />
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="pl-10 pr-10 h-12"
                {...register("password")}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-blue-200 transition-all font-semibold text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="px-6 py-6 bg-gray-50 border-t">
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

