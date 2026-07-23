"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GUARDIAN_ELDER_ID,
  MONTHLY_CARE,
  REPORT_DETAIL,
  TODAY,
  elderById,
} from "@/lib/mock-data";

/**
 * 자녀 — 진료 리포트. /m/trip 에서 생성된 리포트를 구조화된 카드로 받아보는 화면.
 * 요약 칩 → 동행 타임라인(노선 레일) → 처방 변경(복약 알림 토글) → 매니저 메모 → 다음 예약.
 * 공유·알림 토글은 상태만 바뀌는 연출 (PROTOTYPE_PLAN §0).
 */

const elder = elderById(GUARDIAN_ELDER_ID);

const PAST_REPORTS = [
  { date: "7월 21일 (화)", summary: "혈액투석 정기 치료 · 특이사항 없음", chips: ["✅"] },
  { date: "7월 18일 (토)", summary: "혈액투석 정기 치료 · 다음 회차 혈압 체크 요청", chips: ["✅", "🩺"] },
  { date: "7월 16일 (목)", summary: "혈액투석 정기 치료 · 대기 중 간식 제공", chips: ["✅"] },
];

export default function ReportPage() {
  const [alarmOn, setAlarmOn] = useState(true);
  const [shared, setShared] = useState(false);
  const r = REPORT_DETAIL;

  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg">진료 리포트</span>
        <span className="text-sm text-white/90">어머니 {elder.name}</span>
      </header>

      <div className="flex-1 px-4 py-4 space-y-3">
        {/* ── 오늘 리포트 ── */}
        <article className="bg-card rounded-2xl shadow-card overflow-hidden animate-[rise_.45s_ease_both]">
          <header className="flex items-center justify-between px-5 py-3 bg-primary-light">
            <div>
              <p className="text-[13px] font-bold text-primary-dark">🆕 오늘 · {TODAY}</p>
              <p className="text-[11px] text-sub">{r.hospital} · {r.manager} 작성</p>
            </div>
            <button
              onClick={() => setShared(true)}
              className={`text-[12px] font-bold px-3 py-1.5 rounded-full transition active:scale-95
                ${shared ? "bg-primary text-white" : "bg-card text-primary-dark border border-primary/50"}`}
            >
              {shared ? "✓ 가족 공유됨" : "가족 공유"}
            </button>
          </header>

          {/* 요약 칩 */}
          <div className="flex flex-wrap gap-1.5 px-5 pt-3.5">
            {r.chips.map((c) => (
              <span key={c.label} className="text-[12px] font-semibold bg-bg border border-line rounded-full px-2.5 py-1">
                {c.icon} {c.label}
              </span>
            ))}
          </div>

          {/* 동행 타임라인 — 노선 레일 */}
          <div className="px-6 pt-4">
            <p className="text-[11px] font-bold text-faint tracking-wider mb-3">동행 타임라인</p>
            <div className="rail">
              {r.timeline.map((t) => (
                <div key={t.time} className="rail-stop done">
                  <div className="flex items-baseline gap-2.5">
                    <span className="tnum text-[12px] font-bold text-primary-dark w-10 shrink-0">{t.time}</span>
                    <div>
                      <p className="text-[14px] font-bold leading-snug">{t.label}</p>
                      <p className="text-[12px] text-sub">{t.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 처방 변경 — 강조 + 복약 알림 토글 */}
          <div className="mx-5 mb-3 rounded-xl bg-[#fff3e0] border border-orange/40 px-4 py-3">
            <p className="text-[12px] font-bold text-orange mb-1">💊 처방 변경</p>
            <p className="text-[13px] leading-relaxed mb-2.5">{r.prescription}</p>
            <button
              onClick={() => setAlarmOn((v) => !v)}
              className="w-full flex items-center justify-between bg-card rounded-lg px-3.5 py-2.5 active:scale-[.99] transition"
            >
              <span className="text-[13px] font-bold">변경된 용량으로 복약 알림</span>
              <span
                className={`relative w-11 h-6 rounded-full transition ${alarmOn ? "bg-primary" : "bg-line"}`}
                aria-hidden
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${alarmOn ? "left-5.5" : "left-0.5"}`}
                />
              </span>
            </button>
            <p className="text-[11px] text-sub mt-1.5">
              {alarmOn ? "매일 아침 8시 · 어르신 자택 AI 스피커 + 보호자 앱으로 안내됩니다" : "알림이 꺼져 있습니다"}
            </p>
          </div>

          {/* 매니저 메모 */}
          <div className="mx-5 mb-4 rounded-xl bg-bg px-4 py-3 border-l-4 border-primary">
            <p className="text-[11px] font-bold text-faint mb-1">{r.manager}의 메모</p>
            <p className="text-[13px] leading-relaxed">&ldquo;{r.managerNote}&rdquo;</p>
          </div>

          {/* 다음 예약 */}
          <Link
            href="/g/schedule"
            className="mx-5 mb-4 flex items-center gap-3 rounded-xl border border-line px-4 py-3 active:scale-[.99] transition"
          >
            <div className="w-10 h-10 bg-primary-light rounded-xl grid place-items-center text-lg shrink-0">📅</div>
            <div className="flex-1">
              <p className="text-[13px] font-bold tnum">다음 예약 — {r.next.date} {r.next.time}</p>
              <p className="text-[11px] text-sub">{r.next.where} · 정기 배차 자동 등록 완료</p>
            </div>
            <span className="text-faint">›</span>
          </Link>

          <p className="text-[10.5px] text-faint px-5 pb-4 leading-relaxed">
            본 리포트는 처방전·수납증에 기재된 사실을 전달하는 것이며 의료적 소견이나 진단을 포함하지 않습니다.
          </p>
        </article>

        {/* ── 이번 달 요약 ── */}
        <div className="grid grid-cols-3 gap-2.5">
          {MONTHLY_CARE.map((s) => (
            <div key={s.label} className="bg-card rounded-2xl shadow-card px-3 py-3 text-center">
              <p className="tnum text-[17px] font-extrabold text-primary-dark leading-tight">{s.value}</p>
              <p className="text-[11px] text-sub">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── 지난 리포트 ── */}
        <h2 className="text-base font-bold px-1 pt-2">지난 리포트</h2>
        {PAST_REPORTS.map((p) => (
          <div key={p.date} className="bg-card px-5 py-4 rounded-2xl shadow-card flex items-center gap-3">
            <div className="w-11 h-11 bg-primary-light rounded-xl grid place-items-center text-lg shrink-0">📋</div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold">{p.date}</p>
              <p className="text-xs text-sub truncate">{p.summary}</p>
            </div>
            <span className="text-faint shrink-0">›</span>
          </div>
        ))}

        <p className="text-[11px] text-faint text-center pt-1 pb-4">
          리포트는 동행 종료 후 자동으로 도착합니다 · 케어 멤버십으로 무제한 보관
        </p>
      </div>
    </div>
  );
}
