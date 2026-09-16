"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppTabs } from "@/components/app-tabs";
import { CameraViewer } from "@/components/camera-viewer";

export function TabsFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAlbumSelect = pathname === "/album-select";

  return (
    <div className="flex h-dvh flex-col bg-black text-white">
      <AppTabs />
      <div
        className={
          isAlbumSelect ? "flex min-h-0 flex-1 flex-col" : "hidden"
        }
      >
        <CameraViewer />
      </div>
      <div className={isAlbumSelect ? "hidden" : "min-h-0 flex-1"}>
        {children}
      </div>
    </div>
  );
}
