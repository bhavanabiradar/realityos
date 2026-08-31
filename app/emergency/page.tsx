"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Phone,
  Pencil,
  Save,
  X,
  Trash2,
  ShieldAlert,
  HeartPulse,
  Users,
  Loader2,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { fetchEmergencyContacts, addEmergencyContact } from "@/lib/supabaseStore";

type Contact = {
  name: string;
  phone: string;
};

type EmergencyData = {
  emergency: Contact;
  medical: Contact;
  family: Contact;
};

const DEFAULT_DATA: EmergencyData = {
  emergency: {
    name: "Emergency Services",
    phone: "112",
  },
  medical: {
    name: "Care Team",
    phone: "555-0142",
  },
  family: {
    name: "Emergency Contact",
    phone: "555-2020",
  },
};

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyData>(DEFAULT_DATA);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EmergencyData>(DEFAULT_DATA);
  const [savedMessage, setSavedMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------------------
  // 1. LOAD SAVED CONTACTS FROM SUPABASE
  // ----------------------------------------
  useEffect(() => {
    async function loadContacts() {
      setLoading(true);
      try {
        const savedList = await fetchEmergencyContacts();
        if (savedList && savedList.length > 0) {
          const loadedData: EmergencyData = { ...DEFAULT_DATA };
          
          savedList.forEach((item: any) => {
            if (item.relation === "emergency" || item.relation === "medical" || item.relation === "family") {
              loadedData[item.relation as keyof EmergencyData] = {
                name: item.name || "",
                phone: item.phone || "",
              };
            }
          });

          setContacts(loadedData);
          setDraft(loadedData);
        }
      } catch (error) {
        console.error("Could not load emergency contacts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  // ----------------------------------------
  // OPEN EDIT MODE
  // ----------------------------------------
  const openEditor = () => {
    setDraft(contacts);
    setEditing(true);
    setSavedMessage("");
  };

  // ----------------------------------------
  // 2. SAVE CONTACTS TO SUPABASE DATABASE
  // ----------------------------------------
  const saveContacts = async () => {
    setIsSaving(true);
    try {
      // Save all three categories into Supabase
      await Promise.all([
        addEmergencyContact(draft.emergency.name, "emergency", draft.emergency.phone),
        addEmergencyContact(draft.medical.name, "medical", draft.medical.phone),
        addEmergencyContact(draft.family.name, "family", draft.family.phone),
      ]);

      setContacts(draft);
      setEditing(false);
      setSavedMessage("Emergency contacts synced with database");

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } catch (error) {
      console.error("Could not save contacts:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------------------
  // UPDATE CONTACT DRAFT
  // ----------------------------------------
  const updateContact = (
    type: keyof EmergencyData,
    field: keyof Contact,
    value: string
  ) => {
    setDraft((previous) => ({
      ...previous,
      [type]: {
        ...previous[type],
        [field]: value,
      },
    }));
  };

  // ----------------------------------------
  // CALL CONTACT
  // ----------------------------------------
  const callContact = (phone: string) => {
    if (!phone.trim()) {
      alert("No phone number is saved for this contact.");
      return;
    }

    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  // ----------------------------------------
  // CLEAR CONTACT
  // ----------------------------------------
  const clearContact = (type: keyof EmergencyData) => {
    setDraft((previous) => ({
      ...previous,
      [type]: {
        ...previous[type],
        phone: "",
      },
    }));
  };

  // ----------------------------------------
  // CONTACT CARD SUB-COMPONENT
  // ----------------------------------------
  const ContactCard = ({
    type,
    label,
    icon: Icon,
    contact,
    description,
  }: {
    type: keyof EmergencyData;
    label: string;
    icon: React.ElementType;
    contact: Contact;
    description: string;
  }) => {
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="group"
      >
        <GlassCard className="p-6 h-full">
          <div className="flex items-start justify-between gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                type === "emergency"
                  ? "bg-red-500/10 border-red-500/20"
                  : type === "medical"
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-blue-500/10 border-blue-500/20"
              }`}
            >
              <Icon
                size={22}
                className={
                  type === "emergency"
                    ? "text-red-400"
                    : type === "medical"
                    ? "text-emerald-400"
                    : "text-blue-400"
                }
              />
            </div>

            <span
              className={`text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full border ${
                type === "emergency"
                  ? "text-red-400 border-red-500/20 bg-red-500/5"
                  : "text-zinc-500 border-white/5 bg-white/[0.02]"
              }`}
            >
              {label}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
              {label}
            </p>

            <h3 className="text-lg font-semibold text-zinc-200 mt-2">
              {contact.name || "Unnamed Contact"}
            </h3>

            <p className="text-xs text-zinc-500 mt-1">
              {description}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Phone size={14} className="text-zinc-500" />

              <span className="text-sm text-zinc-300">
                {contact.phone || "No number saved"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => callContact(contact.phone)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                type === "emergency"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
              }`}
            >
              <Phone size={14} />
              Call
            </button>

            <button
              type="button"
              onClick={openEditor}
              className="px-4 rounded-xl border border-white/5 bg-white/[0.02] text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              title="Edit contacts"
            >
              <Pencil size={14} />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-[#070914] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* -------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-red-400 font-bold mb-2">
              Emergency
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Response Center
            </h1>

            <p className="text-sm text-zinc-500 mt-2">
              Quick access to your emergency and trusted contacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-400 flex items-center gap-2"
              >
                <Save size={14} />
                {savedMessage}
              </motion.div>
            )}

            <button
              type="button"
              onClick={openEditor}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Pencil size={14} />
              Edit Contacts
            </button>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* WARNING BANNER */}
        {/* -------------------------------- */}
        <GlassCard className="p-5 mb-6 border-red-500/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <ShieldAlert
                size={20}
                className="text-red-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-200">
                Emergency assistance
              </h2>

              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                For an immediate emergency in India, call 112.
                Use the contacts below to quickly reach people
                you trust.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* -------------------------------- */}
        {/* CONTACTS DISPLAY */}
        {/* -------------------------------- */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin text-red-400 mb-2" />
            <span className="text-xs">Loading emergency contacts...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ContactCard
              type="emergency"
              label="Primary"
              icon={AlertCircle}
              contact={contacts.emergency}
              description="National emergency response number"
            />

            <ContactCard
              type="medical"
              label="Medical"
              icon={HeartPulse}
              contact={contacts.medical}
              description="Your saved medical care contact"
            />

            <ContactCard
              type="family"
              label="Family"
              icon={Users}
              contact={contacts.family}
              description="Your trusted emergency contact"
            />
          </div>
        )}

        {/* -------------------------------- */}
        {/* EDIT MODAL */}
        {/* -------------------------------- */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setEditing(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111522] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-red-400 font-bold">
                    Settings
                  </p>

                  <h2 className="text-xl font-semibold text-white mt-1">
                    Emergency Contacts
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Emergency */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle
                      size={16}
                      className="text-red-400"
                    />

                    <h3 className="text-sm font-semibold">
                      Emergency Services
                    </h3>
                  </div>

                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                    Phone Number
                  </label>

                  <input
                    value={draft.emergency.phone}
                    onChange={(e) =>
                      updateContact(
                        "emergency",
                        "phone",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-red-500/40"
                    placeholder="112"
                  />
                </div>

                {/* Medical */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <HeartPulse
                      size={16}
                      className="text-emerald-400"
                    />

                    <h3 className="text-sm font-semibold">
                      Medical Contact
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                        Name
                      </label>

                      <input
                        value={draft.medical.name}
                        onChange={(e) =>
                          updateContact(
                            "medical",
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/40"
                        placeholder="Doctor / Care Team"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                        Phone Number
                      </label>

                      <input
                        value={draft.medical.phone}
                        onChange={(e) =>
                          updateContact(
                            "medical",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/40"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => clearContact("medical")}
                    className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    Clear number
                  </button>
                </div>

                {/* Family */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users
                      size={16}
                      className="text-blue-400"
                    />

                    <h3 className="text-sm font-semibold">
                      Family Contact
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                        Name
                      </label>

                      <input
                        value={draft.family.name}
                        onChange={(e) =>
                          updateContact(
                            "family",
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/40"
                        placeholder="Family member"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">
                        Phone Number
                      </label>

                      <input
                        value={draft.family.phone}
                        onChange={(e) =>
                          updateContact(
                            "family",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/40"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => clearContact("family")}
                    className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    Clear number
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-5 border-t border-white/5 bg-black/10">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={saveContacts}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}