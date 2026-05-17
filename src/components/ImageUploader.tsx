"use client";

import React, { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import imageCompression from "browser-image-compression";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ImageUploaderProps {
  /** Current list of selected File objects */
  files: File[];
  /** Current list of preview data URLs */
  previews: string[];
  /** Per-file upload progress (0–100). Pass [] if not tracking. */
  uploadProgress?: number[];
  /** Max number of images allowed (default: 5) */
  maxImages?: number;
  /** Called when files/previews change */
  onChange: (files: File[], previews: string[]) => void;
  /** Optional error message to display */
  error?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const readAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ImageUploader({
  files,
  previews,
  uploadProgress = [],
  maxImages = 5,
  onChange,
  error,
}: ImageUploaderProps) {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ── Image selection & compression ──────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);

    if (files.length + incoming.length > maxImages) {
      setLocalError(`You can only upload up to ${maxImages} images.`);
      e.target.value = "";
      return;
    }

    setLocalError(null);

    const newFiles = [...files];
    const newPreviews = [...previews];

    for (const file of incoming) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        const dataUrl = await readAsDataURL(compressed);
        newFiles.push(compressed);
        newPreviews.push(dataUrl);
      } catch (err) {
        console.error("Compression/read error:", err);
      }
    }

    onChange(newFiles, newPreviews);
    e.target.value = "";
  };

  // ── Remove a single image ──────────────────────────────────────────────────
  const removeImage = (index: number) => {
    const f = [...files];
    const p = [...previews];
    f.splice(index, 1);
    p.splice(index, 1);
    onChange(f, p);
  };

  const displayError = error || localError;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      <label className="text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)]/40 uppercase px-1">
        PHOTOS (MAX {maxImages})
      </label>

      {/* ── Thumbnail grid ── */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {previews.map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--bg-surface)] group"
          >
            <img
              src={src}
              alt={`Preview ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />

            {/* Remove button */}
            <button
              type="button"
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-[var(--text-primary)]/70 hover:bg-red-500 hover:text-[var(--text-primary)] transition-all md:opacity-0 md:group-hover:opacity-100"
              onClick={() => removeImage(idx)}
            >
              <X size={14} />
            </button>

            {/* Upload progress bar */}
            {uploadProgress[idx] !== undefined && uploadProgress[idx] < 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--bg-surface-elevated)]">
                <div
                  className="h-full bg-[var(--primary)] transition-all"
                  style={{ width: `${uploadProgress[idx]}%` }}
                />
              </div>
            )}
          </div>
        ))}

        {/* ── Add button ── */}
        {previews.length < maxImages && (
          <button
            type="button"
            className="aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--glass-border)] bg-[var(--bg-surface)] text-[var(--text-primary)]/25 hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
            onClick={() => setShowImagePicker(true)}
          >
            <Camera size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
          </button>
        )}

        {/* Hidden file inputs */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          ref={galleryInputRef}
          hidden
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          ref={cameraInputRef}
          hidden
        />
      </div>

      {/* ── Error message ── */}
      {displayError && (
        <p className="text-red-500 text-[11px] font-bold px-1">{displayError}</p>
      )}

      {/* ── Source picker modal ── */}
      {showImagePicker && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center md:items-center px-0 md:px-6"
          onClick={() => setShowImagePicker(false)}
        >
          <div
            className="w-full max-w-[440px] bg-[var(--bg-surface-elevated)] border-t md:border border-[var(--glass-border)] rounded-t-[32px] md:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              {/* drag handle (mobile) */}
              <div className="w-12 h-1 bg-[var(--bg-surface-elevated)] rounded-full mx-auto mb-4 md:hidden" />
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Upload Photos</h3>
              <p className="text-[12px] text-[var(--text-primary)]/40 mt-1">
                Select a source for your room photos
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Camera */}
              <button
                type="button"
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--glass-border)] hover:border-blue-500/50 hover:bg-white/[0.07] group transition-all"
                onClick={() => {
                  cameraInputRef.current?.click();
                  setShowImagePicker(false);
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)]">Take Photo</div>
                <div className="text-[10px] text-[var(--text-primary)]/30 uppercase font-black tracking-widest">
                  Camera
                </div>
              </button>

              {/* Gallery */}
              <button
                type="button"
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--glass-border)] hover:border-[var(--primary)]/50 hover:bg-white/[0.07] group transition-all"
                onClick={() => {
                  galleryInputRef.current?.click();
                  setShowImagePicker(false);
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)]">From Gallery</div>
                <div className="text-[10px] text-[var(--text-primary)]/30 uppercase font-black tracking-widest">
                  Storage
                </div>
              </button>
            </div>

            <button
              type="button"
              className="w-full py-4 text-[var(--text-primary)]/40 font-bold hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setShowImagePicker(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
