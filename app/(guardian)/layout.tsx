import BottomNav from "@/components/BottomNav";
import { Home, Calendar, ClipboardList } from "@/components/icons";

/** 자녀·보호자 채널 — 480px 앱 셸 + 하단 탭 */
export default function GuardianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="app-shell has-bottom-nav flex flex-col">{children}</div>
      <BottomNav
        items={[
          { href: "/guardian", label: "홈", icon: Home },
          { href: "/guardian/schedule", label: "정기 일정", icon: Calendar },
          { href: "/guardian/report", label: "리포트", icon: ClipboardList, badge: true },
        ]}
      />
    </div>
  );
}
