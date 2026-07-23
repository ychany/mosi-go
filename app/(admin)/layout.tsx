import Link from "next/link";

/** 관제 웹 공통 레이아웃 — 딥네이비 헤더, 데스크톱 전용 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-deep text-white">
        <div className="flex items-center gap-8 px-6 h-14">
          <Link href="/" className="font-serif font-bold text-lg">
            모시<span className="text-amber">GO</span>
            <span className="ml-2 font-sans text-xs font-normal text-[#8fb8a4]">관제</span>
          </Link>
          <nav className="flex gap-1 text-sm">
            <Link href="/admin" className="px-3 py-1.5 rounded-lg hover:bg-white/10">
              배차 관제
            </Link>
            <Link href="/admin/dashboard" className="px-3 py-1.5 rounded-lg hover:bg-white/10">
              지자체 대시보드
            </Link>
          </nav>
          <span className="ml-auto text-xs text-[#8fb8a4]">충주시 · 운영팀</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
