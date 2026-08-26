"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileText, Upload, Folder, Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DocumentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  uploadedAt: string;
}

export function DocsCard() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load documents on mount
  useEffect(() => {
    const loadDocs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const storageKey = user ? `realityos_${user.id}_docs` : "realityos_guest_docs";
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setDocs(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Failed to load documents:", err);
      }
    };

    loadDocs();
  }, [supabase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || "anonymous";
      
      // Clean file path for Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = `${userId}/${fileName}`;

      let publicUrl = "";

      // 1. Attempt Supabase Storage Upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from("documents")
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      // 2. Format size string
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      // 3. Save Document Metadata
      const newDoc: DocumentItem = {
        id: crypto.randomUUID(),
        name: file.name,
        size: sizeStr,
        type: fileExt?.toUpperCase() || "FILE",
        url: publicUrl || undefined,
        uploadedAt: new Date().toLocaleDateString(),
      };

      const storageKey = user ? `realityos_${user.id}_docs` : "realityos_guest_docs";
      const updatedDocs = [newDoc, ...docs];
      setDocs(updatedDocs);
      localStorage.setItem(storageKey, JSON.stringify(updatedDocs));
    } catch (err: any) {
      console.error("Upload error details:", err);
      alert(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredDocs = docs.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#111318]/90 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[300px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Recent Documents
            </h3>
          </div>
          <span className="text-[10px] text-neutral-500 font-medium">
            {docs.length} {docs.length === 1 ? "DOCUMENT" : "DOCUMENTS"}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* File List / Empty State */}
        {filteredDocs.length > 0 ? (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/60 text-xs hover:border-neutral-700 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate text-neutral-200">{doc.name}</span>
                </div>
                <span className="text-[10px] text-neutral-500 shrink-0 ml-2">
                  {doc.size}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center text-neutral-500">
            <FileText className="w-7 h-7 mb-2 opacity-40" />
            <p className="text-xs">No documents uploaded yet</p>
          </div>
        )}
      </div>

      {/* Upload Actions */}
      <div className="mt-4 pt-3 border-t border-neutral-800/60 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DocsCard;