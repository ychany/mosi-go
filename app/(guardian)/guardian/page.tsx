"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NaverMap, { type MapMarker } from "@/components/NaverMap";
import { BusFront, Calendar, ChevronRight, MARKER_HOSPITAL, MARKER_VEHICLE, Stethoscope, User } from "@/components/icons";
import { GUARDIAN_ELDER_ID, HOSPITALS, TRACK, elderById } from "@/lib/mock-data";

/**
 * 자녀 — 홈 (실시간 위치). 돌봄 공백의 해소 (PROTOTYPE_PLAN §6.3)
 * 차량 마커가 2초마다 경로를 한 칸씩 이동한다. 서버·소켓 없음.
 */

const elder = elderById(GUARDIAN_ELDER_ID);
const STATUS_FLOW = ["픽업 완료", "이동 중", "병원 도착"] as const;

export default function GuardianHome() {
  const [posIdx, setPosIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPosIdx((i) => Math.min(i + 1, TRACK.path.length - 1));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const arrived = posIdx >= TRACK.path.length - 1;
  const status = arrived ? "병원 도착" : posIdx === 0 ? "픽업 완료" : "이동 중";
  const progress = Math.round((posIdx / (TRACK.path.length - 1)) * 100);

  const markers: MapMarker[] = [
    { position: TRACK.path[0], color: "#9e9e9e", label: "자택" },
    { position: HOSPITALS.건국대충주병원.coord, color: "#212121", label: "건국대충주병원", major: true, glyph: MARKER_HOSPITAL },
    { position: TRACK.path[posIdx], color: "#ffa726", major: true, glyph: MARKER_VEHICLE, label: TRACK.vehicle },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* 그라데이션 헤더 */}
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg flex items-center gap-2">
          <BusFront size={22} />
          모시GO
        </span>
        <span className="text-sm text-white/90 flex items-center gap-1.5"><User size={16} />{elder.guardian.name} 님</span>
      </header>

      {/* 히어로 카드 — 오늘 동행 현황 */}
      <section className="grad hero-deco text-white mx-4 mt-4 p-6 rounded-2xl shadow-[0_4px_16px_rgba(106,179,77,0.3)]">
        <p className="text-[13px] font-medium opacity-90">오늘 동행 · 어머니 {elder.name}</p>
        <p className="text-[2rem] font-extrabold tracking-tight leading-snug">{status}</p>
        <div className="flex items-center gap-2 mt-3 text-[13px] opacity-90">
          <span>{arrived ? "접수 진행 중" : TRACK.etaText}</span>
          <div className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
            <div className="h-full bg-white rounded transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="text-[11px] opacity-80 mt-1.5">
          {elder.condition} · 건국대충주병원 09:30 진료
        </p>
      </section>

      {/* 담당 매니저 카드 */}
      <section className="bg-card mx-4 mt-4 px-5 py-4 rounded-2xl shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-light rounded-xl grid place-items-center text-primary-dark"><Stethoscope size={22} /></div>
          <div>
            <p className="text-[15px] font-bold">{TRACK.driver}</p>
            <p className="text-xs text-sub mt-0.5">{TRACK.vehicle} · 3인 합승 · 관제 {TRACK.operator}</p>
          </div>
        </div>
        <span
          className={`text-[12px] font-bold px-3 py-1.5 rounded-full
            ${arrived ? "bg-primary-light text-primary-dark" : "bg-[#fff3e0] text-orange"}`}
        >
          {status}
        </span>
      </section>

      {/* 실시간 지도 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h2 className="text-base font-bold">실시간 위치</h2>
        <span className="text-[12px] text-sub tnum">{progress}% 이동</span>
      </div>
      <div className="mx-4 rounded-2xl overflow-hidden shadow-card">
        <NaverMap
          center={[37.025, 127.963]}
          zoom={11}
          markers={markers}
          polylines={[{ path: TRACK.path, color: "#3ba949" }]}
          className="h-75"
        />
      </div>

      {/* 지도 범례 */}
      <div className="bg-card mx-4 mt-3 px-4 py-2.5 rounded-[10px] shadow-card flex justify-center gap-5">
        {[
          { color: "#9e9e9e", label: "자택" },
          { color: "#ffa726", label: "차량" },
          { color: "#212121", label: "병원" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* 다음 일정 프리뷰 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h2 className="text-base font-bold">다음 통원</h2>
        <Link href="/guardian/schedule" className="text-[13px] text-primary font-medium">
          전체보기 →
        </Link>
      </div>
      <Link
        href="/guardian/schedule"
        className="bg-card mx-4 mb-5 px-5 py-4 rounded-2xl shadow-card flex items-center gap-3 active:scale-[.99] transition"
      >
        <div className="w-11 h-11 bg-primary-light rounded-xl grid place-items-center text-primary-dark"><Calendar size={22} /></div>
        <div className="flex-1">
          <p className="text-[15px] font-bold">7월 25일 (토) 09:30</p>
          <p className="text-xs text-sub mt-0.5">건국대충주병원 신장내과 · 정기 배차 자동 등록</p>
        </div>
        <ChevronRight size={18} className="text-faint" />
      </Link>
    </div>
  );
}
