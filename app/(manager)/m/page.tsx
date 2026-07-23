import Link from "next/link";
import { RESERVATIONS, TODAY, elderById } from "@/lib/mock-data";

/**
 * 매니저 — 오늘 동행. 어르신 트랙의 현장 인터페이스 (PROTOTYPE_PLAN §1.2).
 * 어르신은 앱을 쓰지 않는다 — 어르신의 화면은 매니저의 손에 들려 있다.
 */

const RUN = [
  { elderId: "e1", pickup: "08:20", status: "진행 중" as const },
  { elderId: "e2", pickup: "08:35", status: "대기" as const },
  { elderId: "e3", pickup: "08:50", status: "대기" as const },
];

export default function ManagerHome() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg flex items-center gap-2">🚐 모시GO 매니저</span>
        <span className="text-sm text-white/90">👤 이수진</span>
      </header>

      {/* 히어로 카드 — 오늘 운행 요약 */}
      <section className="grad hero-deco text-white mx-4 mt-4 p-6 rounded-2xl shadow-[0_4px_16px_rgba(106,179,77,0.3)]">
        <p className="text-[13px] font-medium opacity-90">{TODAY} · 1호차</p>
        <p className="text-[2rem] font-extrabold tracking-tight">3인 합승 동행</p>
        <div className="flex items-center gap-2 mt-3 text-[13px] opacity-90">
          <span>1/3 진행</span>
          <div className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
            <div className="h-full bg-white rounded" style={{ width: "33%" }} />
          </div>
        </div>
        <p className="text-[11px] opacity-80 mt-1.5">건국대충주병원 방면 · 첫 픽업 08:20</p>
      </section>

      {/* 픽업 순서 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">픽업 순서</h2>
      <div className="mx-4 space-y-2.5">
        {RUN.map(({ elderId, pickup, status }, i) => {
          const e = elderById(elderId);
          const r = RESERVATIONS.find((x) => x.elderId === elderId);
          const active = status === "진행 중";
          const card = (
            <div
              className={`bg-card px-5 py-4 rounded-2xl flex items-center gap-3 transition
                ${active ? "shadow-card-md ring-2 ring-primary" : "shadow-card"}`}
            >
              <div
                className={`w-11 h-11 rounded-xl grid place-items-center text-[15px] font-extrabold shrink-0
                  ${active ? "grad text-white" : "bg-primary-light text-primary-dark"}`}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold">
                  {e.name}
                  <span className="ml-1.5 font-normal text-xs text-sub">{e.age}세 · {e.ward}</span>
                </p>
                <p className="text-xs text-sub mt-0.5 truncate tnum">
                  {pickup} 픽업 · {r?.department} {r?.time} · 케어노트 {e.careNotes.length}건
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0
                  ${active ? "bg-primary-light text-primary-dark" : "bg-bg text-faint border border-line"}`}
              >
                {status}
              </span>
            </div>
          );
          return active ? (
            <Link key={elderId} href="/m/trip" className="block active:scale-[.99] transition">
              {card}
            </Link>
          ) : (
            <div key={elderId}>{card}</div>
          );
        })}
      </div>

      <p className="text-[12px] text-faint text-center pt-4 pb-5">
        진행 중인 동행을 누르면 체크리스트로 이동합니다
      </p>
    </div>
  );
}
