"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload-client";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = "Featured Image" }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      alert("Error uploading image.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyUrl = () => {
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      setTempUrl("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-primary">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? "Hide URL Input" : "Paste URL"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/... or image link"
            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover"
          >
            Apply
          </button>
        </div>
      )}

      {value ? (
        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent-light/10 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={loading}
          />
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-accent">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-2 text-secondary">
              <div className="p-3 bg-gray-100 rounded-full text-primary group-hover:text-accent">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-accent hover:underline">
                  Click to upload
                </span>{" "}
                <span className="text-xs">or drag and drop</span>
              </div>
              <p className="text-[11px] text-muted">WebP, PNG, JPG up to 10MB</p>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
