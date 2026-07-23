import BottomNav from "@/components/BottomNav";

/** 자녀·보호자 채널 — 480px 앱 셸 + 하단 탭 */
export default function GuardianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="app-shell has-bottom-nav flex flex-col">{children}</div>
      <BottomNav
        items={[
          { href: "/g", label: "홈", icon: "🏠" },
          { href: "/g/schedule", label: "정기 일정", icon: "📅" },
          { href: "/g/report", label: "리포트", icon: "📋", badge: true },
        ]}
      />
    </div>
  );
}
