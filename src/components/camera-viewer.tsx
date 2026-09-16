"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

type AlbumItem = {
  id: string;
  url: string;
  name: string;
};

function FilePickButton({
  label,
  className,
  capture,
  multiple,
  onChange,
}: {
  label: string;
  className: string;
  capture?: "environment";
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={`relative flex min-h-12 items-center justify-center overflow-hidden rounded-2xl text-base font-medium touch-manipulation ${className}`}>
      <input
        type="file"
        accept="image/*"
        aria-label={label}
        className="file-hitbox"
        multiple={multiple}
        onChange={onChange}
        {...(capture ? { capture } : {})}
      />
      <span className="pointer-events-none px-4 text-center">{label}</span>
    </label>
  );
}

function newItemId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function CameraViewer() {
  const [items, setItems] = useState<AlbumItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const itemsRef = useRef<AlbumItem[]>([]);

  itemsRef.current = items;
  const selected = items.find((item) => item.id === selectedId) ?? items.at(-1) ?? null;

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.url);
      }
    };
  }, []);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const nextItems = files.map((file) => ({
      id: newItemId(),
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setItems((current) => [...current, ...nextItems]);
    setSelectedId(nextItems.at(-1)?.id ?? null);
  }

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return current.filter((item) => item.id !== id);
    });
    setSelectedId((current) => (current === id ? null : current));
  }

  function clearAlbum() {
    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.url);
    }
    setItems([]);
    setSelectedId(null);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      <div className="relative min-h-0 flex-1 overflow-y-auto bg-neutral-950">
        <div className="flex min-h-[42vh] items-center justify-center bg-black">
          {selected ? (
            // Blob URLs from the device camera/library are not in next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.url}
              alt={selected.name}
              className="max-h-[42vh] max-w-full object-contain"
            />
          ) : (
            <p className="px-6 text-center text-base text-neutral-400">
              Take a photo or choose one from your library
            </p>
          )}
        </div>

        <section className="px-4 pt-4 pb-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-medium">Album</h2>
            <p className="text-sm text-neutral-400">
              {items.length === 0
                ? "No photos yet"
                : `${items.length} photo${items.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-neutral-500">
              Photos you take or select will show up here
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2">
              {items.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <li key={item.id} className="relative">
                    <button
                      type="button"
                      className={`block aspect-square w-full overflow-hidden rounded-xl bg-neutral-900 ring-2 touch-manipulation ${
                        isSelected ? "ring-white" : "ring-transparent"
                      }`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-lg leading-none text-white touch-manipulation"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
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
          multiple
          onChange={onFileChange}
        />
        {items.length > 0 ? (
          <button
            type="button"
            className="col-span-2 min-h-12 rounded-2xl border border-white/15 px-4 text-base font-medium text-neutral-200 touch-manipulation active:bg-white/10"
            onClick={clearAlbum}
          >
            Clear album
          </button>
        ) : null}
      </div>
    </div>
  );
}
