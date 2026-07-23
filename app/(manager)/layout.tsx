/** 동행매니저 채널 — 폰 목업 프레임 (PROTOTYPE_PLAN §3.1) */
export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-[#e8ece8]">
      <div className="phone-frame flex flex-col">{children}</div>
    </div>
  );
}
