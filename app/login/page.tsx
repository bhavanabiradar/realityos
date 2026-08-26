"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setSuccessMsg(
            "Account created! Please check your email to confirm your account."
          );
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-[#111318] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold mb-1">
          {isSignUp ? "Create RealityOS Account" : "Welcome to RealityOS"}
        </h1>

        <p className="text-xs text-neutral-400 mb-6">
          {isSignUp
            ? "Sign up to start your 30-day free trial"
            : "Sign in to continue to your RealityOS workspace."}
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Processing..."
              : isSignUp
                ? "Sign Up (Free Trial)"
                : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-neutral-400 hover:text-white transition cursor-pointer"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up for Free"}
          </button>
        </div>
      </div>
    </div>
  );
}