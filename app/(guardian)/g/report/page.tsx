import Link from "next/link";
import { GUARDIAN_ELDER_ID, REPORT_TEXT, TODAY, elderById } from "@/lib/mock-data";

/**
 * 자녀 — 진료 리포트. 매니저가 전송한 리포트를 받은 화면.
 * /m/trip 에서 타이핑되던 그 문안이 여기서는 완성본으로 보인다.
 */

const elder = elderById(GUARDIAN_ELDER_ID);

const PAST_REPORTS = [
  { date: "7월 21일 (화)", summary: "혈액투석 정기 치료 · 특이사항 없음" },
  { date: "7월 18일 (토)", summary: "혈액투석 정기 치료 · 다음 회차 혈압 체크 요청" },
];

export default function ReportPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-deep text-white px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <Link href="/g" className="text-xs text-white/80">← 실시간 위치</Link>
          <span className="font-serif font-bold text-sm">
            모시<span className="text-amber">GO</span>
          </span>
        </div>
        <h1 className="font-bold text-lg">진료 리포트</h1>
        <p className="text-sm text-white/80">어머니 {elder.name} · {elder.condition}</p>
      </header>

      <div className="flex-1 px-4 py-4 space-y-3">
        {/* 오늘 리포트 */}
        <article className="rounded-xl bg-card border border-green/40 overflow-hidden animate-[rise_.45s_ease_both]">
          <header className="flex items-center justify-between px-4 py-2.5 bg-green-soft">
            <span className="text-[12px] font-bold text-green">오늘 · {TODAY}</span>
            <span className="text-[11px] text-gray">이수진 매니저 작성</span>
          </header>
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed px-4 py-4">{REPORT_TEXT}</pre>
        </article>

        {/* 지난 리포트 */}
        <p className="text-[11px] font-bold text-gray tracking-wider pt-2">지난 리포트</p>
        {PAST_REPORTS.map((r) => (
          <div key={r.date} className="rounded-xl bg-card border border-line px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[13px] font-bold">{r.date}</p>
              <p className="text-xs text-gray">{r.summary}</p>
            </div>
            <span className="text-gray text-xs">›</span>
          </div>
        ))}

        <p className="text-[11px] text-gray text-center pt-2 pb-4">
          리포트는 처방전·수납증 기반의 사실 전달이며 의료적 소견을 포함하지 않습니다
        </p>
      </div>
    </div>
  );
}
