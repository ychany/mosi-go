import BottomNav from "@/components/BottomNav";
import { BusFront, CheckCircle2 } from "@/components/icons";

/** 동행매니저 채널 — 480px 앱 셸 + 하단 탭 */
export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="app-shell has-bottom-nav flex flex-col">{children}</div>
      <BottomNav
        items={[
          { href: "/manager", label: "오늘 동행", icon: BusFront },
          { href: "/manager/trip", label: "동행 진행", icon: CheckCircle2 },
        ]}
      />
    </div>
  );
}
