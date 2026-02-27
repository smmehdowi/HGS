'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok) {
        onChange(json.url);
      } else {
        alert(json.error ?? 'Upload failed');
      }
    } catch {
      alert('Upload failed — check your connection.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 min-w-0"
          placeholder="https://... or upload from computer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 hover:text-white rounded text-xs font-medium transition whitespace-nowrap shrink-0"
        >
          <Upload size={13} />
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {value && (
        <div className="mt-2 relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-24 w-auto max-w-xs rounded border border-gray-700 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            onLoad={(e) => { (e.target as HTMLImageElement).style.display = ''; }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1.5 -right-1.5 bg-gray-900 border border-gray-600 rounded-full p-0.5 text-gray-400 hover:text-red-400 transition"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
