"use client";

import { useState } from "react";
import Link from "next/link";
import NaverMap, { type MapMarker } from "@/components/NaverMap";
import {
  BusFront,
  Check,
  ChevronRight,
  Inbox,
  ICON_MAP,
  MARKER_HOSPITAL,
  Navigation,
  Phone,
  TriangleAlert,
  User,
} from "@/components/icons";
import {
  DISPATCH_SCENARIOS,
  HOSPITALS,
  MANAGER_ASSIGNMENT,
  MANAGER_NOTICES,
  RESERVATIONS,
  TODAY,
  elderById,
} from "@/lib/mock-data";

/**
 * 매니저 — 오늘 동행. 어르신 트랙의 현장 인터페이스 (PROTOTYPE_PLAN §1.2).
 * 경로 지도·지금 할 일·케어노트 아코디언·관제 공지 — 현장에서 실제로 쓰는 도구 화면.
 */

// 오늘 배정: 기본 시나리오의 1호차
const RUN = DISPATCH_SCENARIOS[0].vehicles[0];
const PICKUPS = [
  { elderId: "e1", pickup: "08:20", status: "진행 중" as const },
  { elderId: "e2", pickup: "08:35", status: "대기" as const },
  { elderId: "e3", pickup: "08:50", status: "대기" as const },
];

const MAP_MARKERS: MapMarker[] = [
  ...PICKUPS.map((p, i) => ({
    position: elderById(p.elderId).coord,
    color: "#3ba949",
    major: true,
    glyph: String(i + 1),
    label: elderById(p.elderId).name,
  })),
  {
    position: HOSPITALS[RUN.hospital].coord,
    color: "#212121",
    major: true,
    glyph: MARKER_HOSPITAL,
    label: RUN.hospital,
  },
];

export default function ManagerHome() {
  const [openNote, setOpenNote] = useState<string | null>("e1");
  // 운영팀이 발송한 배차를 매니저가 수락하기 전/후 (PROTOTYPE_PLAN §1.3 3단계)
  const [accepted, setAccepted] = useState(false);
  const current = elderById("e1");

  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg flex items-center gap-2"><BusFront size={22} />모시GO 매니저</span>
        <span className="text-sm text-white/90 flex items-center gap-1.5"><User size={16} />이수진</span>
      </header>

      {/* 히어로 — 오늘 운행 요약 */}
      <section className="grad hero-deco text-white mx-4 mt-4 p-6 rounded-2xl shadow-[0_4px_16px_rgba(106,179,77,0.3)]">
        <p className="text-[13px] font-medium opacity-90">{TODAY} · {RUN.vehicle}</p>
        <p className="text-[2rem] font-extrabold tracking-tight">3인 합승 동행</p>
        <div className="flex items-center gap-2 mt-3 text-[13px] opacity-90">
          <span>{accepted ? "1/3 진행" : "수락 대기"}</span>
          <div className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
            <div
              className="h-full bg-white rounded transition-all duration-500"
              style={{ width: accepted ? "33%" : "0%" }}
            />
          </div>
        </div>
        <p className="tnum text-[11px] opacity-80 mt-1.5">
          {RUN.hospital} 방면 · {RUN.durationMin}분 · {RUN.distanceKm}km · 좌석 {RUN.elderIds.length}/{RUN.seats}
        </p>
      </section>

      {/* 배차 수락 — 운영팀이 발송한 오늘 배차 */}
      {!accepted && (
        <section className="bg-card mx-4 mt-4 rounded-2xl shadow-card-md ring-2 ring-orange px-5 py-4 animate-[rise_.45s_ease_both]">
          <p className="text-[11px] font-bold text-orange tracking-wider mb-1.5 flex items-center gap-1.5">
            <Inbox size={13} />
            새 배차 도착
          </p>
          <p className="text-[15px] font-bold">오늘 동행 3건이 배정되었습니다</p>
          <p className="text-xs text-sub mt-0.5">
            {MANAGER_ASSIGNMENT.from} · {MANAGER_ASSIGNMENT.assignedAt} 발송
          </p>
          <p className="text-[11px] text-faint mt-1">{MANAGER_ASSIGNMENT.note}</p>
          <button
            onClick={() => setAccepted(true)}
            className="mt-3 w-full h-12 rounded-xl grad text-white font-bold text-[15px]
              shadow-[0_4px_16px_rgba(106,179,77,0.35)] active:scale-[.99] transition
              animate-[btnpulse_2.2s_ease-in-out_infinite]"
          >
            <span className="inline-flex items-center gap-2">
              <Check size={17} strokeWidth={3} />
              배차 수락하고 동행 시작
            </span>
          </button>
        </section>
      )}

      {/* 지금 할 일 */}
      {accepted && (
      <section className="bg-card mx-4 mt-4 rounded-2xl shadow-card-md ring-2 ring-primary px-5 py-4 animate-[rise_.45s_ease_both]">
        <p className="text-[11px] font-bold text-primary-dark tracking-wider mb-1.5">지금 할 일</p>
        <div className="flex items-center gap-3">
          <div className="grad w-11 h-11 rounded-xl grid place-items-center text-white text-[15px] font-extrabold shrink-0">
            1
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold tnum">08:20 · {current.name} 어르신 픽업</p>
            <p className="text-xs text-sub">{current.ward} 자택 · 09:30 신장내과 진료</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button className="h-11 rounded-xl bg-bg border border-line text-[13px] font-bold active:scale-[.98] transition">
            <span className="inline-flex items-center gap-1.5"><Phone size={15} />어르신 전화</span>
          </button>
          <button className="h-11 rounded-xl bg-bg border border-line text-[13px] font-bold active:scale-[.98] transition">
            <span className="inline-flex items-center gap-1.5"><Navigation size={15} />내비 연결</span>
          </button>
        </div>
        <Link
          href="/manager/trip"
          className="mt-2 grad flex items-center justify-center h-12 rounded-xl text-white font-bold text-[15px]
            shadow-[0_4px_16px_rgba(106,179,77,0.35)] active:scale-[.99] transition"
        >
          동행 체크리스트 시작 →
        </Link>
      </section>
      )}

      {/* 오늘 경로 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h2 className="text-base font-bold">오늘 경로</h2>
        <span className="tnum text-[12px] text-sub">픽업 3곳 → {HOSPITALS[RUN.hospital].short}</span>
      </div>
      <div className="mx-4 rounded-2xl overflow-hidden shadow-card">
        <NaverMap
          center={[37.03, 127.95]}
          zoom={10}
          markers={MAP_MARKERS}
          polylines={[{ path: RUN.path, color: "#3ba949" }]}
          className="h-56"
        />
      </div>

      {/* 픽업 순서 + 케어노트 아코디언 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">픽업 순서</h2>
      <div className="mx-4 space-y-2.5">
        {PICKUPS.map(({ elderId, pickup, status }, i) => {
          const e = elderById(elderId);
          const r = RESERVATIONS.find((x) => x.elderId === elderId);
          const active = status === "진행 중";
          const open = openNote === elderId;
          return (
            <div
              key={elderId}
              className={`bg-card rounded-2xl overflow-hidden transition
                ${active ? "shadow-card-md ring-2 ring-primary" : "shadow-card"}`}
            >
              <button
                onClick={() => setOpenNote(open ? null : elderId)}
                className="w-full px-5 py-4 flex items-center gap-3 text-left"
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
                  <p className="text-xs text-sub truncate tnum">
                    {pickup} 픽업 · {r?.department} {r?.time} · {e.condition}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0
                    ${active ? "bg-primary-light text-primary-dark" : "bg-bg text-faint border border-line"}`}
                >
                  {status}
                </span>
                <ChevronRight size={16} className={`text-faint transition-transform ${open ? "rotate-90" : ""}`} />
              </button>
              {open && (
                <div className="px-5 pb-4 -mt-1 animate-[rise_.3s_ease_both]">
                  <div className="rounded-xl bg-bg px-4 py-3">
                    <p className="text-[11px] font-bold text-primary-dark mb-1.5 flex items-center gap-1"><TriangleAlert size={13} />케어노트</p>
                    <ul className="space-y-1">
                      {e.careNotes.map((n) => (
                        <li key={n} className="text-[13px] flex gap-2">
                          <span className="text-orange font-extrabold shrink-0">!</span>
                          {n}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-faint mt-2">
                      보호자: {e.guardian.name} ({e.guardian.relation} · {e.guardian.residence})
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 관제 공지 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">관제 공지</h2>
      <div className="mx-4 mb-6 space-y-2">
        {MANAGER_NOTICES.map((n) => (
          <div key={n.time} className="bg-card rounded-2xl shadow-card px-4 py-3 flex items-start gap-2.5">
            {(() => { const Icon = ICON_MAP[n.icon] ?? TriangleAlert; return <Icon size={16} className="shrink-0 mt-0.5 text-primary-dark" />; })()}
            <p className="text-[13px] leading-snug flex-1">{n.text}</p>
            <span className="tnum text-[11px] text-faint shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
