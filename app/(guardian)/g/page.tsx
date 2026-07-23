"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NaverMap, { type MapMarker } from "@/components/NaverMap";
import { GUARDIAN_ELDER_ID, HOSPITALS, TRACK, elderById } from "@/lib/mock-data";

/**
 * 자녀 — 실시간 위치. (PROTOTYPE_PLAN §5.3)
 * 차량 마커가 2초마다 경로를 한 칸씩 이동한다. 서버·소켓 없음.
 * 화면에 들어온 순간부터 움직이는 것이 "동작하는 제품" 인상의 핵심.
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

  const markers: MapMarker[] = [
    { position: TRACK.path[0], color: "#5c6a75", label: "자택" },
    { position: HOSPITALS.건국대충주병원.coord, color: "#12222f", label: "건국대충주병원", major: true, glyph: "＋" },
    { position: TRACK.path[posIdx], color: "#d98e2b", major: true, glyph: "🚐", label: TRACK.vehicle },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* 헤더 */}
      <header className="bg-deep text-white px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif font-bold">
            모시<span className="text-amber">GO</span>
          </span>
          <Link href="/g/report" className="text-xs text-white/80 border border-white/25 rounded-full px-3 py-1">
            진료 리포트
          </Link>
        </div>
        <h1 className="font-bold text-lg">
          어머니 {elder.name} <span className="text-sm font-normal text-white/70">{elder.ward}</span>
        </h1>
        <p className="text-sm text-white/80">
          오늘 {elder.condition} · 건국대충주병원 09:30
        </p>
      </header>

      {/* 상태 스트립 */}
      <div className="flex items-center gap-0 px-5 py-3 bg-card border-b border-line">
        {STATUS_FLOW.map((s, i) => {
          const reached = STATUS_FLOW.indexOf(status) >= i;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <span
                className={`text-[12px] whitespace-nowrap font-bold px-2.5 py-1 rounded-full
                  ${status === s ? "bg-amber text-white" : reached ? "text-green" : "text-gray"}`}
              >
                {s}
              </span>
              {i < STATUS_FLOW.length - 1 && (
                <span className={`flex-1 h-0.5 mx-1 rounded ${reached ? "bg-green" : "bg-line"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* 지도 */}
      <div className="flex-1 relative min-h-72">
        <NaverMap
          center={[37.025, 127.963]}
          zoom={11}
          markers={markers}
          polylines={[{ path: TRACK.path, color: "#2e7d5b" }]}
          className="absolute inset-0"
        />
      </div>

      {/* 운행 정보 */}
      <section className="bg-card border-t border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-green-soft grid place-items-center text-xl">🚐</span>
          <div className="flex-1">
            <p className="text-sm font-bold">
              {TRACK.vehicle} · {TRACK.manager}
            </p>
            <p className="text-xs text-gray">{arrived ? "병원에 도착했습니다 — 접수를 진행합니다" : TRACK.etaText}</p>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${arrived ? "bg-green text-white" : "bg-amber-soft text-amber"}`}>
            {status}
          </span>
        </div>
        <p className="mt-3 text-[11px] text-gray text-center">
          동행 종료 후 진료 리포트가 자동으로 도착합니다
        </p>
      </section>
    </div>
  );
}
