import { GUARDIAN_ELDER_ID, REPORT_TEXT, TODAY, elderById } from "@/lib/mock-data";

/**
 * 자녀 — 진료 리포트 수신함. /m/trip 에서 타이핑되던 문안이 완성본으로 보인다.
 */

const elder = elderById(GUARDIAN_ELDER_ID);

const PAST_REPORTS = [
  { date: "7월 21일 (화)", summary: "혈액투석 정기 치료 · 특이사항 없음" },
  { date: "7월 18일 (토)", summary: "혈액투석 정기 치료 · 다음 회차 혈압 체크 요청" },
];

export default function ReportPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg">진료 리포트</span>
        <span className="text-sm text-white/90">어머니 {elder.name}</span>
      </header>

      <div className="flex-1 px-4 py-4 space-y-3">
        {/* 오늘 리포트 */}
        <article className="bg-card rounded-2xl shadow-card overflow-hidden animate-[rise_.45s_ease_both]">
          <header className="flex items-center justify-between px-5 py-3 bg-primary-light">
            <span className="text-[13px] font-bold text-primary-dark">🆕 오늘 · {TODAY}</span>
            <span className="text-[11px] text-sub">이수진 매니저 작성</span>
          </header>
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed px-5 py-4">{REPORT_TEXT}</pre>
        </article>

        {/* 지난 리포트 */}
        <h2 className="text-base font-bold px-1 pt-2">지난 리포트</h2>
        {PAST_REPORTS.map((r) => (
          <div key={r.date} className="bg-card px-5 py-4 rounded-2xl shadow-card flex items-center gap-3">
            <div className="w-11 h-11 bg-primary-light rounded-xl grid place-items-center text-lg">📋</div>
            <div className="flex-1">
              <p className="text-[14px] font-bold">{r.date}</p>
              <p className="text-xs text-sub mt-0.5">{r.summary}</p>
            </div>
            <span className="text-faint">›</span>
          </div>
        ))}

        <p className="text-[11px] text-faint text-center pt-2 pb-4 px-4">
          리포트는 처방전·수납증 기반의 사실 전달이며 의료적 소견을 포함하지 않습니다
        </p>
      </div>
    </div>
  );
}
