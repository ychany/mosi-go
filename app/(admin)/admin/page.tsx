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
 * 배차 관제 — 데모의 하이라이트. (PROTOTYPE_PLAN §5.1)
 *
 * idle    개별 예약 8건 + 흩어진 자택 마커
 * running "클러스터링 중…" 연출 1.5초
 * done    차량 3대로 묶인 카드 + 지도에 노선 3개
 *
 * [AI 배차 실행]을 다시 누르면 다음 시나리오로 순환한다 — 심사위원의
 * "다른 조건으로 다시" 요청에 대응하기 위한 장치.
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
  color: "#12222f",
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
    // 두 번째 실행부터 다음 시나리오로 순환
    if (runCount.current > 0) {
      setScenarioIdx((i) => (i + 1) % DISPATCH_SCENARIOS.length);
    }
    runCount.current += 1;
    setRunStep(0);
    setPhase("running");
  }

  // running 연출: 단계 메시지 500ms 간격 → 1.5초 후 완료
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
      markers.push({ position: e.coord, color: "#5c6a75", label: e.name });
    }
  }

  const activeElderCount = scenario.vehicles.reduce((n, v) => n + v.elderIds.length, 0);

  return (
    <div className="flex-1 flex min-h-0">
      {/* ── 좌측 패널 ── */}
      <aside className="w-100 shrink-0 flex flex-col border-r border-line bg-card">
        <div className="px-5 py-4 border-b border-line">
          <p className="text-xs text-gray">{TODAY}</p>
          <div className="flex items-baseline justify-between">
            <h1 className="font-serif font-bold text-xl">오늘의 통원 예약</h1>
            <span className="tnum text-sm text-gray">
              {phase === "done" ? `${activeElderCount}건 · ${scenario.vehicles.length}대` : `${RESERVATIONS.length}건 · 미배차`}
            </span>
          </div>
        </div>

        {/* 예약/배차 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {phase === "done" ? (
            <div key={scenario.id} className="space-y-5">
              <p className="text-xs text-gray -mb-1">{scenario.note}</p>
              {scenario.vehicles.map((v, vi) => (
                <section
                  key={v.vehicle}
                  className="rounded-xl border border-line overflow-hidden animate-[rise_.45s_ease_both]"
                  style={{ animationDelay: `${vi * 120}ms` }}
                >
                  <header
                    className="flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold"
                    style={{ background: ROUTE_COLORS[v.colorVar] }}
                  >
                    <span>{v.vehicle}</span>
                    <span className="font-normal opacity-85">→ {v.hospital}</span>
                    <span className="ml-auto font-normal tnum opacity-85">첫 픽업 {v.pickupStart}</span>
                  </header>
                  <ul className="divide-y divide-line">
                    {v.elderIds.map((id) => {
                      const e = elderById(id);
                      const r = RESERVATIONS.find((x) => x.elderId === id);
                      return (
                        <li key={id} className="px-4 py-2.5 flex items-center gap-3 text-sm">
                          <span className="font-bold">{e.name}</span>
                          <span className="text-gray text-xs">
                            {e.ward} · {r?.department}
                          </span>
                          <span className="ml-auto tnum text-xs text-gray">{r?.time} 진료</span>
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
                  <li key={r.id} className="rounded-xl border border-line bg-card px-4 py-3 flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold">
                        {e.name}
                        <span className="ml-2 font-normal text-xs text-gray">
                          {e.age}세 · {e.ward}
                        </span>
                      </p>
                      <p className="text-xs text-gray">
                        {HOSPITALS[r.hospital].short} {r.department} · {r.time}
                      </p>
                    </div>
                    <span className="ml-auto text-[11px] text-gray bg-paper border border-line rounded-full px-2.5 py-0.5">
                      {r.via}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 실행 버튼 + 단위경제 */}
        <div className="border-t border-line p-4 space-y-3">
          {phase === "done" && (
            <div className="rounded-xl bg-amber-soft border border-amber/40 px-4 py-3 text-sm animate-[rise_.45s_.4s_ease_both]">
              <p className="font-bold mb-1">
                1:1 배차 시 {UNIT_ECONOMICS.soloVehiclesNeeded}대 → 합승 {scenario.vehicles.length}대
              </p>
              <p className="tnum text-gray">
                운행당 수입 10.5만 − 비용 9.2만 ={" "}
                <b className="text-green">+1.3만 원</b>
                <span className="text-xs"> (3인 합승 기준)</span>
              </p>
            </div>
          )}
          <button
            onClick={dispatch}
            disabled={phase === "running"}
            className="w-full h-12 rounded-xl bg-green text-white font-bold text-[15px]
              hover:brightness-110 active:scale-[.99] transition disabled:opacity-70"
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
      <div className="flex-1 relative min-w-0">
        <NaverMap center={MAP_CENTER} zoom={MAP_ZOOM} markers={markers} polylines={polylines} className="absolute inset-0" />
        {phase === "done" && (
          <div className="absolute top-4 left-4 rounded-xl bg-card/95 border border-line shadow-lg px-4 py-3 text-xs space-y-1.5">
            {scenario.vehicles.map((v) => (
              <p key={v.vehicle} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: ROUTE_COLORS[v.colorVar] }} />
                <b>{v.vehicle}</b>
                <span className="text-gray">
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
