import { Calendar, Check, RefreshCw, Ticket, Wallet } from "@/components/icons";
import {
  GUARDIAN_ELDER_ID,
  PASS,
  PASS_PLANS,
  UPCOMING_RIDES,
  elderById,
} from "@/lib/mock-data";

/**
 * 자녀 — 정기 일정 · 통원권. (PROTOTYPE_PLAN §1.10)
 *
 * 파는 것은 언제나 '회차'다. 리포트·실시간 위치는 별도 상품이 아니라 기본 포함.
 * 이용 빈도에 따라 정기 구독형 / 회수권형 두 갈래를 두고, 접수 단계에서 우리가 추천한다.
 */

const elder = elderById(GUARDIAN_ELDER_ID);
const remaining = PASS.included + PASS.carriedOver - PASS.used;
const total = PASS.included + PASS.carriedOver;

export default function SchedulePage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg">정기 일정</span>
        <span className="text-sm text-white/90">어머니 {elder.name}</span>
      </header>

      {/* 통원권 잔여 회차 */}
      <section className="grad hero-deco text-white mx-4 mt-4 p-6 rounded-2xl shadow-[0_4px_16px_rgba(106,179,77,0.3)]">
        <p className="text-[13px] font-medium opacity-90">{PASS.type}</p>
        <p className="text-[2rem] font-extrabold tracking-tight tnum">
          잔여 {remaining}회
        </p>
        <div className="flex items-center gap-2 mt-3 text-[13px] opacity-90">
          <span className="tnum">
            {PASS.used}/{total} 이용
          </span>
          <div className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
            <div className="h-full bg-white rounded" style={{ width: `${(PASS.used / total) * 100}%` }} />
          </div>
        </div>
        <p className="text-[11px] opacity-80 mt-1.5">
          이번 달 {PASS.included}회 + 지난달 이월 {PASS.carriedOver}회 · {PASS.since}부터 이용 중
        </p>
        <span className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-white/20 border border-white/30 rounded-3xl text-[13px] font-semibold">
          <Check size={15} strokeWidth={3} />
          실시간 위치 · 통원 리포트 기본 포함
        </span>
      </section>

      {/* 결제 내역 — 바우처 우선 차감 */}
      <section className="bg-card mx-4 mt-4 px-5 py-4 rounded-2xl shadow-card">
        <p className="text-[12px] font-bold text-sub mb-3 flex items-center gap-1.5">
          <Wallet size={14} />
          이번 달 결제
        </p>
        <div className="flex gap-1 h-3.5 mb-2.5">
          <div
            className="rounded-sm bg-primary"
            style={{ width: `${(PASS.voucherCovered / PASS.used) * 100}%` }}
          />
          <div
            className="rounded-sm bg-orange"
            style={{ width: `${(PASS.selfPaid / PASS.used) * 100}%` }}
          />
        </div>
        <div className="flex gap-4 text-[12px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            지자체 바우처 <b className="tnum">{PASS.voucherCovered}회</b>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange" />
            자녀 결제 <b className="tnum">{PASS.selfPaid}회</b>
          </span>
        </div>
        <p className="text-[11px] text-faint mt-2.5 pt-2.5 border-t border-line leading-snug">
          지자체 이동지원 바우처가 먼저 차감되고, 초과분만 결제됩니다
        </p>
      </section>

      {/* 정기 배차 규칙 */}
      <section className="bg-card mx-4 mt-3 px-5 py-4 rounded-2xl shadow-card flex items-center gap-3">
        <div className="w-11 h-11 bg-primary-light rounded-xl grid place-items-center text-primary-dark">
          <RefreshCw size={22} />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-bold">{PASS.cycle}</p>
          <p className="text-xs text-sub mt-0.5">진료 일정에 맞춰 배차가 자동 등록됩니다</p>
        </div>
      </section>

      {/* 다가오는 일정 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">다가오는 통원</h2>
      <div className="mx-4 space-y-2.5">
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

      {/* 상품 비교 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">통원권 안내</h2>
      <div className="mx-4 space-y-2.5">
        {PASS_PLANS.map((p) => {
          const current = p.name === PASS.type;
          return (
            <div
              key={p.id}
              className={`bg-card rounded-2xl px-5 py-4 flex items-start gap-3
                ${current ? "shadow-card-md ring-2 ring-primary" : "shadow-card"}`}
            >
              <div className="w-10 h-10 bg-primary-light rounded-xl grid place-items-center text-primary-dark shrink-0">
                {p.id === "subscription" ? <Calendar size={20} /> : <Ticket size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold flex items-center gap-2">
                  {p.name}
                  {current && (
                    <span className="text-[10.5px] font-bold text-white bg-primary rounded-full px-2 py-0.5">
                      이용 중
                    </span>
                  )}
                </p>
                <p className="text-[11.5px] text-primary-dark font-medium mt-0.5">{p.target}</p>
                <p className="text-[11.5px] text-sub mt-1 leading-snug">{p.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-faint text-center pt-3 pb-5 px-6 leading-relaxed">
        진료 주기에 맞는 상품을 접수 시 안내해 드립니다 · 어르신은 전화(1588-0000)로도 접수하실 수 있습니다
      </p>
    </div>
  );
}
