import { GUARDIAN_ELDER_ID, MEMBERSHIP, UPCOMING_RIDES, elderById } from "@/lib/mock-data";

/**
 * 자녀 — 정기 일정. 자녀 트랙(B2C)의 핵심 가치: 정기 배차 자동 등록 + 멤버십.
 * 사업계획서 BM 2층(월 19,900원 구독)을 화면으로 보여준다.
 */

const elder = elderById(GUARDIAN_ELDER_ID);

export default function SchedulePage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg">정기 일정</span>
        <span className="text-sm text-white/90">어머니 {elder.name}</span>
      </header>

      {/* 멤버십 카드 */}
      <section className="grad hero-deco text-white mx-4 mt-4 p-6 rounded-2xl shadow-[0_4px_16px_rgba(106,179,77,0.3)]">
        <p className="text-[13px] font-medium opacity-90">{MEMBERSHIP.name}</p>
        <p className="text-[2rem] font-extrabold tracking-tight">{MEMBERSHIP.price}</p>
        <p className="text-[12px] opacity-90 mt-1">
          {MEMBERSHIP.since}부터 이용 중 · {MEMBERSHIP.benefits.join(" · ")}
        </p>
        <span className="inline-block mt-4 px-5 py-2.5 bg-white/20 border border-white/30 rounded-3xl text-[13px] font-semibold">
          ✓ 구독 중
        </span>
      </section>

      {/* 정기 배차 규칙 */}
      <section className="bg-card mx-4 mt-4 px-5 py-4 rounded-2xl shadow-card flex items-center gap-3">
        <div className="w-11 h-11 bg-primary-light rounded-xl grid place-items-center text-lg">🔄</div>
        <div className="flex-1">
          <p className="text-[15px] font-bold">{elder.condition} — {elder.frequency}</p>
          <p className="text-xs text-sub mt-0.5">진료 일정에 맞춰 배차가 자동 등록됩니다</p>
        </div>
      </section>

      {/* 다가오는 일정 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">다가오는 통원</h2>
      <div className="mx-4 mb-5 space-y-2.5">
        {UPCOMING_RIDES.map((r) => (
          <div key={`${r.date}${r.time}`} className="bg-card px-5 py-4 rounded-2xl shadow-card flex items-center gap-3">
            <div className="text-center shrink-0 w-16">
              <p className="text-[14px] font-extrabold leading-tight">{r.date.split(" ")[0]}</p>
              <p className="text-[11px] text-sub">{r.date.split(" ")[1]}</p>
            </div>
            <div className="w-px h-8 bg-line" />
            <div className="flex-1">
              <p className="text-[14px] font-bold tnum">
                {r.time} · {r.hospital}
              </p>
              <p className="text-xs text-sub mt-0.5">{r.department}</p>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0
                ${r.auto ? "bg-primary-light text-primary-dark" : "bg-[#fff3e0] text-orange"}`}
            >
              {r.auto ? "자동 배차" : "단건 예약"}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-faint text-center pb-5 px-6">
        일정 변경은 앱에서, 어르신은 전화(1588-0000)로도 접수하실 수 있습니다
      </p>
    </div>
  );
}
