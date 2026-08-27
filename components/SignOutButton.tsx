"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    // 1. Clear all browser-cached state
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }

    // 2. Sign out of Supabase
    await supabase.auth.signOut();

    // 3. Hard redirect to refresh state completely
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-xs text-neutral-400 hover:text-red-400 transition cursor-pointer w-full px-3 py-2 rounded-xl hover:bg-neutral-900"
    >
      <LogOut className="w-4 h-4" />
      <span>Accounts & Log Out</span>
    </button>
  );
}

export default SignOutButton;