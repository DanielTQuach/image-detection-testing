"use client";

import { useEffect, useState, type ChangeEvent } from "react";

function FilePickButton({
  label,
  className,
  capture,
  onChange,
}: {
  label: string;
  className: string;
  capture?: "environment";
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={`relative flex min-h-12 items-center justify-center overflow-hidden rounded-2xl text-base font-medium touch-manipulation ${className}`}>
      <input
        type="file"
        accept="image/*"
        aria-label={label}
        className="file-hitbox"
        onChange={onChange}
        {...(capture ? { capture } : {})}
      />
      <span className="pointer-events-none px-4 text-center">{label}</span>
    </label>
  );
}

export function CameraViewer() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
    setFileName(file.name);
  }

  function clearPreview() {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
    setFileName(null);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-neutral-950">
        <div className="flex h-full items-center justify-center">
          {previewUrl ? (
            // Blob URLs from the device camera/library are not in next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={fileName ?? "Selected photo"}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="px-6 text-center text-base text-neutral-400">
              Take a photo or choose one from your library
            </p>
          )}
        </div>
      </div>

      <div className="relative z-20 grid grid-cols-2 gap-3 border-t border-white/10 bg-neutral-950 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <FilePickButton
          label="Take photo"
          className="bg-white text-black active:bg-neutral-200"
          capture="environment"
          onChange={onFileChange}
        />
        <FilePickButton
          label="Photo library"
          className="bg-neutral-800 text-white active:bg-neutral-700"
          onChange={onFileChange}
        />
        {previewUrl ? (
          <button
            type="button"
            className="col-span-2 min-h-12 rounded-2xl border border-white/15 px-4 text-base font-medium text-neutral-200 touch-manipulation active:bg-white/10"
            onClick={clearPreview}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
