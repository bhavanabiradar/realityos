"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Users, Check, X, ShieldAlert, ArrowRight } from "lucide-react";

interface StoredAccount {
  id: string;
  email: string;
  displayName: string;
  lastActive: string;
}

const SAVED_ACCOUNTS_KEY = "realityos_saved_accounts";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<StoredAccount | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<StoredAccount[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch current user and load remembered accounts
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const metadataName = user.user_metadata?.full_name || user.user_metadata?.name;
        const fallbackName = user.email.split("@")[0];
        const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);

        const currentAcc: StoredAccount = {
          id: user.id,
          email: user.email,
          displayName: metadataName || formattedName,
          lastActive: new Date().toISOString(),
        };

        setCurrentUser(currentAcc);

        // Sync to saved accounts in localStorage
        try {
          const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
          let accounts: StoredAccount[] = raw ? JSON.parse(raw) : [];
          if (!accounts.some((a) => a.id === currentAcc.id)) {
            accounts.push(currentAcc);
            localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
          }
          setSavedAccounts(accounts);
        } catch {
          // ignore parsing error
        }
      }
    };

    fetchUser();
  }, [supabase]);

  // Full clean log out
  const handleFullLogOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setIsModalOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Switch to an account or add another account
  const handleSwitchAccount = async (targetAccount?: StoredAccount) => {
    setLoading(true);
    try {
      // Sign out current session to allow choosing or re-authenticating
      await supabase.auth.signOut();
      setIsModalOpen(false);
      
      // If user selected an existing account, pass their email as a query param so login is prefilled
      if (targetAccount?.email) {
        router.push(`/login?email=${encodeURIComponent(targetAccount.email)}`);
      } else {
        router.push("/login");
      }
      router.refresh();
    } catch (err) {
      console.error("Switch account error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button inside Sidebar */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900/60 rounded-xl transition cursor-pointer w-full text-left"
      >
        <Users className="w-4 h-4 shrink-0 text-neutral-400" />
        <span>Accounts & Log Out</span>
      </button>

      {/* Confirmation & Account Switch Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111318] border border-neutral-800 rounded-2xl p-6 shadow-2xl relative space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Manage Account & Sessions
                </h3>
                <p className="text-xs text-neutral-400">
                  Switch between remembered profiles or sign out completely.
                </p>
              </div>

              {/* Current Active Account Card */}
              {currentUser && (
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-xs">
                      {currentUser.displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {currentUser.displayName} <span className="text-[10px] text-cyan-400 font-normal">(Active)</span>
                      </p>
                      <p className="text-[11px] text-neutral-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              {/* Saved Accounts List */}
              {savedAccounts.filter((a) => a.id !== currentUser?.id).length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    Switch to Another Account
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {savedAccounts
                      .filter((a) => a.id !== currentUser?.id)
                      .map((account) => (
                        <button
                          key={account.id}
                          onClick={() => handleSwitchAccount(account)}
                          disabled={loading}
                          className="w-full p-2.5 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 rounded-xl flex items-center justify-between text-left transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-xs">
                              {account.displayName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">{account.displayName}</p>
                              <p className="text-[10px] text-neutral-400">{account.email}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-neutral-800/80 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleSwitchAccount()}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-neutral-900 border border-neutral-700/60 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Users className="w-3.5 h-3.5" />
                  + Add / Switch
                </button>

                <button
                  type="button"
                  onClick={handleFullLogOut}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {loading ? "Signing Out..." : "Log Out"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}