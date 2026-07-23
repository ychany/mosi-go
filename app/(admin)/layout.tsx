import Link from "next/link";

/** 지자체 트랙 — 관제 웹 공통 레이아웃. 그린 그라데이션 헤더, 데스크톱 풀폭. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white sticky top-0 z-50 shadow-card-md">
        <div className="flex items-center gap-8 px-6 h-16">
          <Link href="/" className="font-extrabold text-lg flex items-center gap-2">
            🚐 모시GO
            <span className="text-xs font-medium text-white/85 bg-white/15 rounded-full px-2.5 py-0.5">관제</span>
          </Link>
          <nav className="flex gap-1 text-sm font-medium">
            <Link href="/admin" className="px-3.5 py-1.5 rounded-[10px] hover:bg-white/15 transition">
              배차 관제
            </Link>
            <Link href="/admin/dashboard" className="px-3.5 py-1.5 rounded-[10px] hover:bg-white/15 transition">
              지자체 대시보드
            </Link>
          </nav>
          <span className="ml-auto text-sm text-white/90">👤 충주시 · 운영팀</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
