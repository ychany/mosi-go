import Link from "next/link";
import { RESERVATIONS, TODAY, elderById } from "@/lib/mock-data";

/**
 * 매니저 — 오늘 스케줄. 1호차(이수진 매니저) 기준.
 * 첫 어르신(김영자)이 진행 중 → /m/trip 으로 이어진다.
 */

const RUN = [
  { elderId: "e1", pickup: "08:20", status: "진행 중" as const },
  { elderId: "e2", pickup: "08:35", status: "대기" as const },
  { elderId: "e3", pickup: "08:50", status: "대기" as const },
];

export default function ManagerHome() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-green text-white px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif font-bold">
            모시<span className="text-amber">GO</span>
            <span className="ml-2 font-sans text-xs font-normal text-white/80">매니저</span>
          </span>
          <span className="text-xs text-white/80">이수진 매니저</span>
        </div>
        <h1 className="font-bold text-lg">오늘 동행 · 1호차</h1>
        <p className="text-sm text-white/85">{TODAY} · 건국대충주병원 방면 3인</p>
      </header>

      <div className="flex-1 px-4 py-4 space-y-3">
        {RUN.map(({ elderId, pickup, status }) => {
          const e = elderById(elderId);
          const r = RESERVATIONS.find((x) => x.elderId === elderId);
          const active = status === "진행 중";
          const card = (
            <div
              className={`rounded-xl border px-4 py-3.5 flex items-center gap-3 bg-card
                ${active ? "border-green shadow-sm" : "border-line"}`}
            >
              <div className="text-center shrink-0 w-12">
                <p className="tnum text-sm font-bold">{pickup}</p>
                <p className="text-[10px] text-gray">픽업</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold">
                  {e.name}
                  <span className="ml-1.5 font-normal text-xs text-gray">{e.age}세 · {e.ward}</span>
                </p>
                <p className="text-xs text-gray truncate">
                  {r?.department} {r?.time} · 케어노트 {e.careNotes.length}건
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0
                  ${active ? "bg-green text-white" : "bg-paper text-gray border border-line"}`}
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

        <p className="text-[11px] text-gray text-center pt-2">
          진행 중인 동행을 누르면 체크리스트로 이동합니다
        </p>
      </div>
    </div>
  );
}
