"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileImage,
  File,
  Upload,
  Search,
  Eye,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  X,
} from "lucide-react";

import { GlassCard } from "../ui/GlassCard";

type StoredDocument = {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  createdAt: number;
};

const DB_NAME = "realityos-documents";
const STORE_NAME = "documents";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllDocuments(): Promise<StoredDocument[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result as StoredDocument[]);
    };

    request.onerror = () => reject(request.error);
  });
}

async function saveDocument(document: StoredDocument) {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.put(document);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function deleteDocument(id: string) {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.delete(id);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(file: StoredDocument) {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (
    type.includes("image") ||
    /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(name)
  ) {
    return {
      icon: FileImage,
      color: "text-orange-400",
      background: "bg-orange-500/10",
    };
  }

  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    /\.(xlsx|xls|csv)$/i.test(name)
  ) {
    return {
      icon: FileSpreadsheet,
      color: "text-emerald-400",
      background: "bg-emerald-500/10",
    };
  }

  if (
    type.includes("javascript") ||
    type.includes("typescript") ||
    type.includes("json") ||
    type.includes("text") ||
    /\.(js|jsx|ts|tsx|json|css|html|py|java|cpp|c|rs)$/i.test(name)
  ) {
    return {
      icon: FileCode,
      color: "text-purple-400",
      background: "bg-purple-500/10",
    };
  }

  if (
    type.includes("pdf") ||
    type.includes("document") ||
    /\.(pdf|doc|docx|txt)$/i.test(name)
  ) {
    return {
      icon: FileText,
      color: "text-blue-400",
      background: "bg-blue-500/10",
    };
  }

  return {
    icon: File,
    color: "text-zinc-400",
    background: "bg-zinc-500/10",
  };
}

function getFileType(file: StoredDocument) {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return "PDF";
  if (name.endsWith(".xlsx")) return "XLSX";
  if (name.endsWith(".xls")) return "XLS";
  if (name.endsWith(".csv")) return "CSV";
  if (name.endsWith(".docx")) return "DOCX";
  if (name.endsWith(".doc")) return "DOC";
  if (name.endsWith(".txt")) return "TEXT";
  if (name.endsWith(".json")) return "JSON";
  if (name.endsWith(".tsx")) return "TSX";
  if (name.endsWith(".ts")) return "TS";
  if (name.endsWith(".jsx")) return "JSX";
  if (name.endsWith(".js")) return "JS";
  if (name.endsWith(".png")) return "PNG";
  if (name.endsWith(".jpg")) return "JPG";
  if (name.endsWith(".jpeg")) return "JPEG";

  return file.type || "FILE";
}

export const DocsCard = () => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const savedDocuments = await getAllDocuments();

      savedDocuments.sort((a, b) => b.createdAt - a.createdAt);

      setDocuments(savedDocuments);
    } catch (error) {
      console.error("Could not load documents:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const document: StoredDocument = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type || "unknown",
          size: file.size,
          file,
          createdAt: Date.now(),
        };

        await saveDocument(document);
      }

      await loadDocuments();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong while uploading the document.");
    } finally {
      setIsUploading(false);

      event.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    const document = documents.find((doc) => doc.id === id);

    if (!document) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${document.name}" from RealityOS?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDocument(id);

      setDocuments((current) =>
        current.filter((doc) => doc.id !== id)
      );

      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete the document.");
    }
  }

  function handleOpen(document: StoredDocument) {
    const url = URL.createObjectURL(document.file);

    window.open(url, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  }

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return documents;
    }

    return documents.filter((document) => {
      const name = document.name.toLowerCase();
      const type = getFileType(document).toLowerCase();

      return (
        name.includes(query) ||
        type.includes(query)
      );
    });
  }, [documents, search]);

  const selectedDocument = documents.find(
    (document) => document.id === selectedId
  );

  return (
    <GlassCard className="p-6" delay={0.8}>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-zinc-400" />

          <h3 className="text-zinc-300 font-medium text-sm">
            Recent Documents
          </h3>
        </div>

        <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          {documents.length}{" "}
          {documents.length === 1 ? "Document" : "Documents"}
        </span>
      </div>

      {/* SEARCH */}
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search documents..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* DOCUMENT LIST */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-xs text-zinc-600">
              Loading documents...
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
            <FileText
              size={28}
              className="mx-auto mb-3 text-zinc-700"
            />

            <p className="text-sm text-zinc-500">
              {search
                ? "No matching documents found"
                : "No documents uploaded yet"}
            </p>

            {search && (
              <p className="text-[11px] text-zinc-700 mt-1">
                Try another file name or file type
              </p>
            )}
          </div>
        ) : (
          filteredDocuments.map((document, index) => {
            const fileStyle = getFileIcon(document);
            const Icon = fileStyle.icon;
            const isSelected = selectedId === document.id;

            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.04,
                }}
                onClick={() =>
                  setSelectedId(
                    isSelected ? null : document.id
                  )
                }
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "border-transparent hover:bg-white/5 hover:border-white/5"
                }`}
              >
                {/* FILE ICON */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 shrink-0 ${fileStyle.background}`}
                >
                  <Icon
                    size={20}
                    className={fileStyle.color}
                  />
                </div>

                {/* FILE INFO */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isSelected
                        ? "text-white"
                        : "text-zinc-300"
                    }`}
                  >
                    {document.name}
                  </p>

                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                    {getFileType(document)} •{" "}
                    {formatFileSize(document.size)}
                  </p>
                </div>

                {/* ACTIONS */}
                <div
                  className={`flex items-center gap-1 ${
                    isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } transition-opacity`}
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  {/* OPEN */}
                  <button
                    onClick={() => handleOpen(document)}
                    title="Open document"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                  >
                    <ExternalLink size={15} />
                  </button>

                  {/* PREVIEW */}
                  <button
                    onClick={() => handleOpen(document)}
                    title="Preview document"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Eye size={15} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      handleDelete(document.id)
                    }
                    title="Delete document"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {!isSelected && (
                  <MoreHorizontal
                    size={15}
                    className="text-zinc-700 group-hover:hidden"
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* SELECTED DOCUMENT ACTION BAR */}
      {selectedDocument && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">
                Selected
              </p>

              <p className="text-xs text-zinc-300 truncate mt-1">
                {selectedDocument.name}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() =>
                  handleOpen(selectedDocument)
                }
                className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-2"
              >
                <Eye size={13} />
                Preview
              </button>

              <button
                onClick={() =>
                  handleDelete(selectedDocument.id)
                }
                className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* UPLOAD BUTTON */}
      <label className="block mt-5 cursor-pointer">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
          accept="
            .pdf,
            .doc,
            .docx,
            .txt,
            .xlsx,
            .xls,
            .csv,
            .png,
            .jpg,
            .jpeg,
            .webp,
            .json,
            .js,
            .jsx,
            .ts,
            .tsx,
            .css,
            .html,
            .py,
            .java,
            .cpp,
            .c,
            .rs
          "
        />

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Upload size={14} />

          {isUploading
            ? "Uploading..."
            : "Upload Document"}
        </motion.div>
      </label>

      {/* GOOGLE DRIVE */}
      <button
        type="button"
        onClick={() => {
          window.open(
            "https://drive.google.com",
            "_blank"
          );
        }}
        className="w-full mt-2 py-2.5 rounded-xl border border-white/5 text-[10px] font-bold text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all uppercase tracking-widest"
      >
        Open Google Drive
      </button>

      {/* FOOTER */}
      <div className="mt-5 pt-4 border-t border-white/5 flex justify-between">
        <p className="text-[10px] text-zinc-600">
          Documents stored in RealityOS
        </p>

        <p className="text-[10px] text-zinc-500">
          {filteredDocuments.length} shown
        </p>
      </div>
    </GlassCard>
  );
};