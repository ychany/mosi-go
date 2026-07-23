"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  GUARDIAN_ELDER_ID,
  REPORT_TEXT,
  TRIP_STEPS,
  VOICE_MEMO_PREVIEW,
  elderById,
} from "@/lib/mock-data";

/**
 * 동행 진행 — ★데모 2순위. (PROTOTYPE_PLAN §5.2)
 *
 * 체크리스트 6단계(픽업→…→귀가)를 노선 레일로 표시. 전부 완료하면
 * 음성 메모 → "AI 정리 중" 2초 → 리포트 타이핑 출력 → 자녀 전송.
 * 실제 녹음·STT·AI 호출은 없다 — 전 과정이 오프라인 연출이다.
 */

type MemoPhase = "hidden" | "ready" | "recording" | "processing" | "typing" | "done";

const elder = elderById(GUARDIAN_ELDER_ID);

export default function TripPage() {
  const [stepIdx, setStepIdx] = useState(0); // 완료된 단계 수
  const [memo, setMemo] = useState<MemoPhase>("hidden");
  const [elapsed, setElapsed] = useState(0); // 녹음 경과(초)
  const [displayed, setDisplayed] = useState("");
  const [sent, setSent] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const allDone = stepIdx >= TRIP_STEPS.length;

  function completeStep() {
    const next = stepIdx + 1;
    setStepIdx(next);
    if (next >= TRIP_STEPS.length) setMemo("ready");
  }

  // 녹음 경과 타이머 (연출 — 실제 녹음 없음)
  useEffect(() => {
    if (memo !== "recording") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [memo]);

  // "AI 정리 중" 2초 → 타이핑 시작
  useEffect(() => {
    if (memo !== "processing") return;
    const t = setTimeout(() => setMemo("typing"), 2000);
    return () => clearTimeout(t);
  }, [memo]);

  // 리포트 타이핑 효과 — 이 연출이 "실제 AI처럼 보이는 이유"의 대부분 (§5.2)
  useEffect(() => {
    if (memo !== "typing") return;
    let i = 0;
    const t = setInterval(() => {
      i += 2; // 2자씩 — 전체 출력 약 6초
      setDisplayed(REPORT_TEXT.slice(0, i));
      reportRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
      if (i >= REPORT_TEXT.length) {
        clearInterval(t);
        setMemo("done");
      }
    }, 25);
    return () => clearInterval(t);
  }, [memo]);

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="flex-1 flex flex-col">
      {/* 헤더 */}
      <header className="bg-green text-white px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <Link href="/m" className="text-xs text-white/80">← 오늘 스케줄</Link>
          <span className="text-xs text-white/80">1호차 · 이수진 매니저</span>
        </div>
        <h1 className="font-serif font-bold text-xl">
          {elder.name} 어르신 <span className="font-sans text-sm font-normal text-white/85">{elder.age}세 · {elder.ward}</span>
        </h1>
        <p className="text-sm text-white/85">건국대충주병원 신장내과 · 09:30 진료</p>
      </header>

      {/* 케어노트 */}
      <section className="mx-4 -mt-3 rounded-xl bg-card border border-line shadow-sm px-4 py-3">
        <p className="text-[11px] font-bold text-green tracking-wider mb-1.5">케어노트</p>
        <ul className="space-y-1">
          {elder.careNotes.map((n) => (
            <li key={n} className="text-[13px] flex gap-2">
              <span className="text-amber font-bold shrink-0">!</span>
              {n}
            </li>
          ))}
        </ul>
      </section>

      {/* 체크리스트 — 노선 레일 */}
      <section className="px-6 pt-6 pb-2">
        <div className="rail">
          {TRIP_STEPS.map((step, i) => {
            const state = i < stepIdx ? "done" : i === stepIdx ? "active" : "";
            return (
              <div key={step} className={`rail-stop ${state}`}>
                <div className="flex items-center gap-2 min-h-6">
                  <span className={`text-[15px] ${i < stepIdx ? "font-bold text-green" : i === stepIdx ? "font-bold" : "text-gray"}`}>
                    {step}
                  </span>
                  {i < stepIdx && <span className="text-[11px] text-gray">완료</span>}
                  {i === stepIdx && !allDone && (
                    <button
                      onClick={completeStep}
                      className="ml-auto h-9 px-4 rounded-lg bg-green text-white text-[13px] font-bold active:scale-[.97] transition"
                    >
                      {step} 완료
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 음성 메모 → 리포트 */}
      {memo !== "hidden" && (
        <section className="px-4 pb-8 space-y-3 animate-[rise_.45s_ease_both]">
          {(memo === "ready" || memo === "recording") && (
            <div className="rounded-xl bg-card border border-line p-4 text-center">
              <p className="text-sm font-bold mb-1">동행 마무리 — 음성 메모</p>
              <p className="text-xs text-gray mb-4">오늘 있었던 일을 말로 남기면, AI가 자녀 리포트로 정리합니다</p>
              {memo === "recording" && (
                <div className="flex items-center justify-center gap-1 mb-3 h-8" aria-hidden>
                  {[14, 22, 30, 18, 26, 12, 24, 16].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 rounded-full bg-green animate-pulse"
                      style={{ height: h, animationDelay: `${i * 90}ms`, animationDuration: ".7s" }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setMemo(memo === "ready" ? "recording" : "processing")}
                className={`w-16 h-16 rounded-full text-white text-2xl shadow-lg active:scale-95 transition
                  ${memo === "recording" ? "bg-[#c0392b]" : "bg-green"}`}
                aria-label={memo === "recording" ? "녹음 종료" : "녹음 시작"}
              >
                {memo === "recording" ? "■" : "🎙"}
              </button>
              <p className="tnum text-sm text-gray mt-2">{memo === "recording" ? mmss : "눌러서 녹음"}</p>
            </div>
          )}

          {memo === "processing" && (
            <div className="rounded-xl bg-card border border-line p-6 text-center">
              <span className="inline-block w-5 h-5 rounded-full border-2 border-green/30 border-t-green animate-spin mb-2" />
              <p className="text-sm font-bold">AI가 리포트를 정리하고 있습니다…</p>
              <p className="text-xs text-gray mt-1">음성 인식 → 사실 확인 → 자녀용 문장 정리</p>
            </div>
          )}

          {(memo === "typing" || memo === "done") && (
            <>
              <div className="rounded-xl bg-paper border border-line px-4 py-3">
                <p className="text-[11px] font-bold text-gray tracking-wider mb-1">음성 메모 원문</p>
                <p className="text-[13px] text-gray leading-relaxed">&ldquo;{VOICE_MEMO_PREVIEW}&rdquo;</p>
              </div>
              <div ref={reportRef} className="rounded-xl bg-card border border-green/40 px-4 py-4">
                <p className="text-[11px] font-bold text-green tracking-wider mb-2">AI 정리 리포트 — 자녀 전송용</p>
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
                  {displayed}
                  {memo === "typing" && <span className="animate-pulse">▍</span>}
                </pre>
              </div>
              {memo === "done" && (
                <button
                  onClick={() => setSent(true)}
                  disabled={sent}
                  className="w-full h-12 rounded-xl bg-deep text-white font-bold text-[15px] active:scale-[.99] transition disabled:bg-green"
                >
                  {sent ? `✓ ${elder.guardian.name} 님(${elder.guardian.relation})에게 전송 완료` : "자녀에게 리포트 전송"}
                </button>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
