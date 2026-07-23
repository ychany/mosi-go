"use client";

import { useEffect, useRef, useState } from "react";
import NaverMap, { type MapMarker, type MapPolyline } from "@/components/NaverMap";
import {
  DISPATCH_SCENARIOS,
  HOSPITALS,
  MAP_CENTER,
  MAP_ZOOM,
  RESERVATIONS,
  ROUTE_COLORS,
  TODAY,
  UNIT_ECONOMICS,
  elderById,
  type Hospital,
} from "@/lib/mock-data";

/**
 * 배차 관제 — 데모의 하이라이트. 교통 공백의 해소 (PROTOTYPE_PLAN §6.1)
 *
 * idle    개별 예약 8건 + 흩어진 자택 마커
 * running "클러스터링 중…" 연출 1.5초
 * done    차량 3대로 묶인 카드 + 지도에 노선 3개 + 단위경제
 *
 * 재실행 시 시나리오 순환 — 심사위원의 "다른 조건으로 다시" 요청 대응.
 */

type Phase = "idle" | "running" | "done";

const RUNNING_STEPS = [
  "예약 시간대 ±40분 그룹핑…",
  "출발지 좌표 방면 클러스터링…",
  "차량 정원 배정 및 경로 산출…",
];

const HOSPITAL_MARKERS: MapMarker[] = (
  Object.entries(HOSPITALS) as [Hospital, (typeof HOSPITALS)[Hospital]][]
).map(([name, h]) => ({
  position: h.coord,
  color: "#212121",
  label: name,
  major: true,
  glyph: "＋",
}));

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [runStep, setRunStep] = useState(0);
  const runCount = useRef(0);

  const scenario = DISPATCH_SCENARIOS[scenarioIdx];

  function dispatch() {
    if (phase === "running") return;
    if (runCount.current > 0) {
      setScenarioIdx((i) => (i + 1) % DISPATCH_SCENARIOS.length);
    }
    runCount.current += 1;
    setRunStep(0);
    setPhase("running");
  }

  // running 연출: 단계 메시지 500ms 간격 → 1.6초 후 완료
  useEffect(() => {
    if (phase !== "running") return;
    const stepTimer = setInterval(() => setRunStep((s) => Math.min(s + 1, RUNNING_STEPS.length - 1)), 500);
    const doneTimer = setTimeout(() => setPhase("done"), 1600);
    return () => {
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
  }, [phase]);

  // ── 지도 데이터 ──
  const markers: MapMarker[] = [...HOSPITAL_MARKERS];
  const polylines: MapPolyline[] = [];

  if (phase === "done") {
    for (const v of scenario.vehicles) {
      const color = ROUTE_COLORS[v.colorVar];
      polylines.push({ path: v.path, color });
      markers.push({ position: v.path[v.path.length - 1], color, major: true, glyph: "🚐", label: v.vehicle });
      for (const id of v.elderIds) {
        const e = elderById(id);
        markers.push({ position: e.coord, color, label: e.name });
      }
    }
  } else {
    for (const r of RESERVATIONS) {
      const e = elderById(r.elderId);
      markers.push({ position: e.coord, color: "#9e9e9e", label: e.name });
    }
  }

  const activeElderCount = scenario.vehicles.reduce((n, v) => n + v.elderIds.length, 0);

  return (
    <div className="flex-1 flex flex-col-reverse lg:flex-row min-h-0">
      {/* ── 좌측 패널 ── */}
      <aside className="w-full lg:w-[420px] shrink-0 flex flex-col bg-card border-r border-line flex-1 lg:flex-none min-h-0">
        <div className="px-5 py-4 border-b border-line">
          <p className="text-xs text-sub">{TODAY}</p>
          <div className="flex items-baseline justify-between">
            <h1 className="font-extrabold text-lg">오늘의 통원 예약</h1>
            <span className="tnum text-sm text-sub">
              {phase === "done"
                ? `${activeElderCount}건 · ${scenario.vehicles.length}대`
                : `${RESERVATIONS.length}건 · 미배차`}
            </span>
          </div>
        </div>

        {/* 예약/배차 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-bg">
          {phase === "done" ? (
            <div key={scenario.id} className="space-y-4">
              <p className="text-xs text-sub -mb-1">{scenario.note}</p>
              {scenario.vehicles.map((v, vi) => (
                <section
                  key={v.vehicle}
                  className="rounded-2xl bg-card shadow-card overflow-hidden animate-[rise_.45s_ease_both]"
                  style={{ animationDelay: `${vi * 120}ms` }}
                >
                  <header
                    className="flex items-center gap-2 px-4 py-3 text-white text-sm font-bold"
                    style={{ background: ROUTE_COLORS[v.colorVar] }}
                  >
                    <span>{v.vehicle}</span>
                    <span className="font-medium opacity-90">→ {v.hospital}</span>
                    <span className="ml-auto font-medium tnum opacity-90">첫 픽업 {v.pickupStart}</span>
                  </header>
                  <ul className="divide-y divide-line">
                    {v.elderIds.map((id) => {
                      const e = elderById(id);
                      const r = RESERVATIONS.find((x) => x.elderId === id);
                      return (
                        <li key={id} className="px-4 py-3 flex items-center gap-3 text-sm">
                          <span className="font-bold">{e.name}</span>
                          <span className="text-sub text-xs">
                            {e.ward} · {r?.department}
                          </span>
                          <span className="ml-auto tnum text-xs text-sub">{r?.time} 진료</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <ul className="space-y-2.5">
              {RESERVATIONS.map((r) => {
                const e = elderById(r.elderId);
                return (
                  <li key={r.id} className="rounded-2xl bg-card shadow-card px-4 py-3.5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light rounded-xl grid place-items-center text-base shrink-0">
                      🧓
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {e.name}
                        <span className="ml-2 font-normal text-xs text-sub">
                          {e.age}세 · {e.ward}
                        </span>
                      </p>
                      <p className="text-xs text-sub truncate">
                        {HOSPITALS[r.hospital].short} {r.department} · {r.time}
                      </p>
                    </div>
                    <span className="ml-auto text-[11px] text-sub bg-bg border border-line rounded-full px-2.5 py-0.5 shrink-0">
                      {r.via}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 실행 버튼 + 단위경제 */}
        <div className="border-t border-line p-4 space-y-3 bg-card">
          {phase === "done" && (
            <div className="rounded-2xl bg-[#fff3e0] border border-orange/40 px-4 py-3 text-sm animate-[rise_.45s_.4s_ease_both]">
              <p className="font-bold mb-1">
                1:1 배차 시 {UNIT_ECONOMICS.soloVehiclesNeeded}대 → 합승 {scenario.vehicles.length}대
              </p>
              <p className="tnum text-sub">
                운행당 수입 10.5만 − 비용 9.2만 = <b className="text-primary-dark">+1.3만 원</b>
                <span className="text-xs"> (3인 합승 기준)</span>
              </p>
            </div>
          )}
          <button
            onClick={dispatch}
            disabled={phase === "running"}
            className="w-full h-12 rounded-2xl grad text-white font-bold text-[15px]
              shadow-[0_4px_16px_rgba(106,179,77,0.35)] hover:brightness-105 active:scale-[.99] transition disabled:opacity-70"
          >
            {phase === "running" ? (
              <span className="inline-flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                {RUNNING_STEPS[runStep]}
              </span>
            ) : phase === "done" ? (
              "AI 배차 다시 실행"
            ) : (
              "AI 배차 실행"
            )}
          </button>
        </div>
      </aside>

      {/* ── 지도 ── */}
      <div className="relative min-w-0 h-[45dvh] lg:h-auto lg:flex-1">
        <NaverMap center={MAP_CENTER} zoom={MAP_ZOOM} markers={markers} polylines={polylines} className="absolute inset-0" />
        {phase === "done" && (
          <div className="absolute top-4 left-4 rounded-2xl bg-card/95 shadow-card-md px-4 py-3 text-xs space-y-1.5">
            {scenario.vehicles.map((v) => (
              <p key={v.vehicle} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: ROUTE_COLORS[v.colorVar] }} />
                <b>{v.vehicle}</b>
                <span className="text-sub">
                  {v.elderIds.length}인 → {HOSPITALS[v.hospital].short}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
