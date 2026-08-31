"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileText, Upload, Folder, Search, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchUserDocuments,
  createDatabaseDocument,
  deleteDatabaseDocument,
} from "@/lib/supabaseStore";

interface DocumentItem {
  id: string;
  name: string;
  size: string;
  file_url?: string;
  created_at?: string;
}

export function DocsCard() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents from Supabase on mount
  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await fetchUserDocuments();
      setDocs(data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in to upload files.");

      // Clean file path for Supabase Storage
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = `${user.id}/${fileName}`;

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

      // 3. Save Document Metadata into Supabase Database
      const savedDoc = await createDatabaseDocument(file.name, sizeStr, publicUrl);

      if (savedDoc) {
        setDocs((prev) => [savedDoc, ...prev]);
      }
    } catch (err: any) {
      console.error("Upload error details:", err);
      alert(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocs((prev) => prev.filter((d) => d.id !== id));
    await deleteDatabaseDocument(id);
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
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-center text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400 mb-2" />
            <p className="text-xs">Loading documents...</p>
          </div>
        ) : filteredDocs.length > 0 ? (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center justify-between p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/60 text-xs hover:border-neutral-700 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate text-neutral-200">{doc.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-neutral-500">{doc.size}</span>
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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