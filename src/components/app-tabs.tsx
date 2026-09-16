"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/album-select", label: "Album select" },
  { href: "/image-detection", label: "Image detection" },
] as const;

export function AppTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="grid grid-cols-2 border-b border-white/10 bg-neutral-950 pt-[max(0.5rem,env(safe-area-inset-top))]"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            scroll={false}
            className={`flex min-h-12 items-center justify-center px-3 text-center text-sm font-medium touch-manipulation ${
              isActive
                ? "border-b-2 border-white text-white"
                : "border-b-2 border-transparent text-neutral-400"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
