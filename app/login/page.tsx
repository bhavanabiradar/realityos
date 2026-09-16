"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      window.location.href = "/"; // Redirect to dashboard
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password recovery email sent! Check your Gmail inbox.");
    }
    setLoading(false);
  };

  return (
    // ... your existing login card container JSX
    <form onSubmit={handleSignIn} className="...">
      {/* Email Input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        required
      />

      {/* Password Input */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      {/* Forgot Password Link */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {message && (
        <p className="text-xs text-center text-blue-400 my-2">{message}</p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Sign In"}
      </button>
    </form>
  );
}