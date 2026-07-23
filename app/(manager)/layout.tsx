import BottomNav from "@/components/BottomNav";
import { Headset, ClipboardList } from "@/components/icons";

/** 운영 관리자 채널 — 480px 앱 셸 + 하단 탭 (§1.9) */
export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="app-shell has-bottom-nav flex flex-col">{children}</div>
      <BottomNav
        items={[
          { href: "/manager", label: "오늘 업무", icon: Headset },
          { href: "/manager/trip", label: "운행 상세", icon: ClipboardList },
        ]}
      />
    </div>
  );
}
