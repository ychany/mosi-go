"use client";

import { useEffect, useRef, useState } from "react";
import {
  CALL_TRANSCRIPT,
  GUARDIAN_ELDER_ID,
  REPORT_TEXT,
  TRACK,
  elderById,
} from "@/lib/mock-data";
import {
  BusFront,
  Check,
  ClipboardList,
  MapPin,
  PhoneCall,
  Sparkles,
  Square,
  TriangleAlert,
} from "@/components/icons";

/**
 * 운행 상세 — 귀가 확인 통화 → AI 리포트. (PROTOTYPE_PLAN §1.9, §6.2)
 *
 * 현장에 동행 인력이 없다. 리포트의 원천은 **기사 앱 체크 + 관리자 확인 통화**다.
 * 관리자가 사무실에서 어르신께 전화를 걸어 진료 결과를 확인하면,
 * AI가 통화 내용과 기사 체크 기록을 합쳐 자녀용 리포트로 정리한다.
 *
 * 실제 통화·STT·AI 호출은 없다 — 전 과정이 오프라인 연출이다.
 */

type CallPhase = "idle" | "calling" | "processing" | "typing" | "done";

const elder = elderById(GUARDIAN_ELDER_ID);

/** 기사 앱에서 올라온 체크 기록 — 관리자는 이걸 수신만 한다 */
const DRIVER_CHECKS = [
  { time: "09:20", label: "자택 앞 탑승", note: `${TRACK.vehicle} · ${TRACK.driver}`, done: true },
  { time: "09:45", label: "병원 정문 하차", note: "건국대충주병원", done: true },
  { time: "12:30", label: "귀가 차량 배차", note: "진료 종료 연락 접수", done: true },
  { time: "12:40", label: "자택 앞 귀가", note: "기사 확인 완료", done: true },
];

export default function TripDetailPage() {
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [sent, setSent] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // 통화 중: 경과 타이머 + 대화 한 줄씩 등장
  useEffect(() => {
    if (phase !== "calling") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    const l = setInterval(() => setVisibleLines((n) => Math.min(n + 1, CALL_TRANSCRIPT.length)), 900);
    return () => {
      clearInterval(t);
      clearInterval(l);
    };
  }, [phase]);

  // "AI 정리 중" 2초 → 타이핑 시작
  useEffect(() => {
    if (phase !== "processing") return;
    const t = setTimeout(() => setPhase("typing"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  // 리포트 타이핑 효과
  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setDisplayed(REPORT_TEXT.slice(0, i));
      reportRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
      if (i >= REPORT_TEXT.length) {
        clearInterval(t);
        setPhase("done");
      }
    }, 25);
    return () => clearInterval(t);
  }, [phase]);

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 pt-4 pb-5 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-extrabold">운행 상세</span>
          <span className="text-xs text-white/85">{TRACK.vehicle} · {TRACK.driver}</span>
        </div>
        <p className="text-[15px] font-bold">
          {elder.name} 어르신
          <span className="ml-1.5 text-[12px] font-normal text-white/85">
            {elder.age}세 · {elder.ward} · 건국대충주병원 신장내과
          </span>
        </p>
      </header>

      {/* 승하차 유의사항 — 기사에게 전달할 내용 */}
      <section className="bg-card mx-4 -mt-2.5 rounded-2xl shadow-card-md px-5 py-4 relative z-40">
        <p className="text-[12px] font-bold text-primary-dark mb-2 flex items-center gap-1.5">
          <span className="w-6 h-6 bg-primary-light rounded-lg grid place-items-center text-primary-dark">
            <TriangleAlert size={13} />
          </span>
          승하차 유의사항 — 기사 전달 완료
        </p>
        <ul className="space-y-1.5">
          {elder.careNotes.map((n) => (
            <li key={n} className="text-[13px] flex gap-2">
              <span className="text-orange font-extrabold shrink-0">!</span>
              {n}
            </li>
          ))}
        </ul>
      </section>

      {/* 기사 앱 체크 기록 */}
      <section className="bg-card mx-4 mt-4 rounded-2xl shadow-card px-6 py-5">
        <p className="text-[12px] font-bold text-sub mb-4 flex items-center gap-1.5">
          <BusFront size={14} />
          기사 앱 체크 기록
        </p>
        <div className="rail">
          {DRIVER_CHECKS.map((c) => (
            <div key={c.time} className="rail-stop done">
              <div className="flex items-baseline gap-2.5 min-h-6">
                <span className="tnum text-[12px] font-bold text-primary-dark w-10 shrink-0">{c.time}</span>
                <div>
                  <p className="text-[14px] font-bold leading-snug">{c.label}</p>
                  <p className="text-[12px] text-sub">{c.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-faint mt-1 pt-3 border-t border-line leading-snug">
          기사는 승하차만 확인합니다. 병원 안에는 들어가지 않습니다.
        </p>
      </section>

      {/* 귀가 확인 통화 → 리포트 */}
      <section className="px-4 pt-4 pb-6 space-y-3">
        {phase === "idle" && (
          <div className="bg-card rounded-2xl shadow-card p-5 text-center">
            <p className="text-[15px] font-bold mb-1">귀가 확인 통화</p>
            <p className="text-xs text-sub mb-4">
              어르신께 전화해 진료 결과를 확인하면, AI가 자녀 리포트로 정리합니다
            </p>
            <button
              onClick={() => setPhase("calling")}
              className="w-16 h-16 rounded-full grad text-white shadow-card-lg active:scale-95 transition
                animate-[btnpulse_2.2s_ease-in-out_infinite] grid place-items-center mx-auto"
              aria-label="통화 시작"
            >
              <PhoneCall size={26} />
            </button>
            <p className="text-sm text-sub mt-2">눌러서 통화 시작</p>
          </div>
        )}

        {phase === "calling" && (
          <div className="bg-card rounded-2xl shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
                통화 중 — {elder.name} 어르신
              </p>
              <span className="tnum text-sm text-sub">{mmss}</span>
            </div>
            <div className="space-y-2 mb-4 min-h-32">
              {CALL_TRANSCRIPT.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className={`flex animate-[rise_.3s_ease_both] ${line.who === "관리자" ? "justify-end" : ""}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug
                      ${line.who === "관리자" ? "bg-primary-light text-ink" : "bg-bg border border-line"}`}
                  >
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPhase("processing")}
              className="w-full h-12 rounded-xl bg-red text-white font-bold text-[15px] active:scale-[.99] transition"
            >
              <span className="inline-flex items-center gap-2">
                <Square size={16} fill="currentColor" />
                통화 종료 · 리포트 생성
              </span>
            </button>
          </div>
        )}

        {phase === "processing" && (
          <div className="bg-card rounded-2xl shadow-card p-6 text-center">
            <span className="inline-block w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-2" />
            <p className="text-[15px] font-bold">AI가 리포트를 정리하고 있습니다…</p>
            <p className="text-xs text-sub mt-1">통화 내용 + 기사 체크 기록 → 자녀용 문장 정리</p>
          </div>
        )}

        {(phase === "typing" || phase === "done") && (
          <>
            <div className="bg-bg border border-line rounded-2xl px-4 py-3.5">
              <p className="text-[11px] font-bold text-faint mb-2 flex items-center gap-1.5">
                <PhoneCall size={12} />
                귀가 확인 통화 (12:45)
              </p>
              <div className="space-y-1">
                {CALL_TRANSCRIPT.map((line, i) => (
                  <p key={i} className="text-[12.5px] text-sub leading-relaxed">
                    <b className="text-ink">{line.who}</b> {line.text}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-faint">
              <MapPin size={12} />
              기사 체크 4건 + 통화 1건
            </div>
            <div ref={reportRef} className="bg-card rounded-2xl shadow-card overflow-hidden">
              <header className="px-5 py-3 bg-primary-light">
                <p className="text-[12px] font-bold text-primary-dark flex items-center gap-1.5">
                  <Sparkles size={14} />
                  AI 정리 리포트 — 자녀 전송용
                </p>
              </header>
              <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed px-5 py-4">
                {displayed}
                {phase === "typing" && <span className="animate-pulse">▍</span>}
              </pre>
            </div>
            {phase === "done" && (
              <button
                onClick={() => setSent(true)}
                disabled={sent}
                className={`w-full h-13 rounded-2xl text-white font-bold text-[15px] active:scale-[.99] transition
                  ${sent ? "bg-primary-dark" : "grad shadow-[0_4px_16px_rgba(106,179,77,0.4)]"}`}
              >
                {sent ? (
                  <span className="inline-flex items-center gap-2">
                    <Check size={17} strokeWidth={3} />
                    {elder.guardian.name} 님({elder.guardian.relation})에게 전송 완료
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <ClipboardList size={17} />
                    자녀에게 리포트 전송
                  </span>
                )}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
