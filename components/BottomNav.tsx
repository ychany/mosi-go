"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

/** 하단 탭 네비게이션 — CityBalance 플랫폼 문법. 480px 셸에 맞춰 중앙 고정. */

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
}

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[70px] z-50
        bg-card border-t border-line flex items-center justify-around
        shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
    >
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center gap-1 px-5 py-2 text-[11px] font-medium transition
              ${active ? "text-primary font-bold" : "text-faint"}`}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 2} className="transition" />
            {item.label}
            {item.badge && <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-red" />}
          </Link>
        );
      })}
    </nav>
  );
}
