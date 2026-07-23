"use client";

import { useEffect, useRef, useState } from "react";
import NaverMap, { type MapMarker, type MapPolyline } from "@/components/NaverMap";
import {
  DISPATCH_SCENARIOS,
  HOSPITALS,
  INTAKE_FEED,
  LIVE_FEED,
  MAP_CENTER,
  MAP_ZOOM,
  RESERVATIONS,
  ROUTE_COLORS,
  TODAY,
  UNIT_ECONOMICS,
  elderById,
  type Hospital,
  type Ward,
} from "@/lib/mock-data";

/**
 * 배차 관제 — 데모의 하이라이트. 교통 공백의 해소 (PROTOTYPE_PLAN §6.1)
 *
 * idle    개별 예약 8건 + 흩어진 자택 마커
 * running "클러스터링 중…" 연출 1.5초
 * done    차량 3대 카드(픽업 순번·매니저·소요·좌석) + 노선 3개 + 단위경제 비교
 *         + 지도 위 라이브 관제 피드 티커
 *
 * 재실행 시 시나리오 순환 — 심사위원의 "다른 조건으로 다시" 요청 대응.
 */

type Phase = "idle" | "running" | "done";
type HospitalFilter = "전체" | Hospital;

const RUNNING_STEPS = [
  "예약 시간대 ±40분 그룹핑…",
  "출발지 좌표 방면 클러스터링…",
  "차량 정원 배정 및 경로 산출…",
];

const FILTERS: HospitalFilter[] = ["전체", "건국대충주병원", "충주의료원"];

const HOSPITAL_MARKERS: MapMarker[] = (
  Object.entries(HOSPITALS) as [Hospital, (typeof HOSPITALS)[Hospital]][]
).map(([name, h]) => ({
  position: h.coord,
  color: "#212121",
  label: name,
  major: true,
  glyph: "＋",
}));

/** 상단 KPI 스트립 — 배차 전후로 값이 바뀐다 */
function KpiStrip({ phase, vehicleCount }: { phase: Phase; vehicleCount: number }) {
  const done = phase === "done";
  const kpis = [
    { label: "오늘 예약", value: `${RESERVATIONS.length}건`, sub: "정기 5 · 앱 2 · 전화 1" },
    {
      label: "운행 차량",
      value: done ? `${vehicleCount}대` : "—",
      sub: done ? `1:1 대비 −${UNIT_ECONOMICS.soloVehiclesNeeded - vehicleCount}대` : "배차 대기",
      highlight: done,
    },
    {
      label: "운행당 마진",
      value: done ? "+1.3만" : "—",
      sub: done ? "3인 합승 기준" : "배차 후 산출",
      highlight: done,
    },
    { label: "매니저 가동", value: done ? "3명" : "0명", sub: "충주 북부권 대기 5명" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 py-4 bg-bg border-b border-line">
      {kpis.map((k) => (
        <div key={k.label} className="bg-card rounded-2xl shadow-card px-4 py-3">
          <p className="text-[11px] text-sub">{k.label}</p>
          <p className={`tnum text-xl font-extrabold leading-tight ${k.highlight ? "text-primary-dark" : ""}`}>
            {k.value}
          </p>
          <p className="text-[10px] text-faint">{k.sub}</p>
        </div>
      ))}
    </div>
  );
}

/** 지도 위 라이브 피드 — 3초 간격 롤링 (연출). idle=접수 피드 / done=운행 피드 */
function LiveFeed({ feed, title }: { feed: typeof LIVE_FEED; title: string }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
    const t = setInterval(() => setIdx((i) => (i + 1) % feed.length), 3000);
    return () => clearInterval(t);
  }, [feed]);
  const visible = [feed[idx], feed[(idx + 1) % feed.length], feed[(idx + 2) % feed.length]];
  return (
    <div className="absolute bottom-4 right-4 w-72 rounded-2xl bg-card/95 shadow-card-md overflow-hidden">
      <header className="flex items-center gap-2 px-4 py-2 bg-primary-light">
        <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
        <span className="text-[12px] font-bold text-primary-dark">{title}</span>
      </header>
      <ul className="px-4 py-2.5 space-y-2">
        {visible.map((f) => (
          <li key={`${f.time}${f.text}`} className="flex items-start gap-2 text-[12px] animate-[rise_.4s_ease_both]">
            <span className="tnum text-faint shrink-0">{f.time}</span>
            <span className="shrink-0">{f.icon}</span>
            <span className="leading-snug">{f.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 배차 전 지도 위 미배차 수요 현황 — 읍·면별 분포 + 힌트 (idle 전용) */
function DemandOverlay() {
  const byWard = new Map<Ward, number>();
  for (const r of RESERVATIONS) {
    const w = elderById(r.elderId).ward;
    byWard.set(w, (byWard.get(w) ?? 0) + 1);
  }
  const rows = [...byWard.entries()].sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map(([, n]) => n));
  return (
    <div className="absolute top-4 left-4 w-64 rounded-2xl bg-card/95 shadow-card-md overflow-hidden">
      <header className="px-4 py-2 bg-[#fff3e0]">
        <span className="text-[12px] font-bold text-orange">⏳ 미배차 수요 {RESERVATIONS.length}건</span>
      </header>
      <div className="px-4 py-3 space-y-1.5">
        {rows.map(([ward, n]) => (
          <div key={ward} className="flex items-center gap-2 text-[11px]">
            <span className="w-11 text-sub shrink-0">{ward}</span>
            <div className="flex-1 h-2">
              <div className="h-full rounded-r-sm bg-primary/70" style={{ width: `${(n / max) * 100}%` }} />
            </div>
            <span className="tnum font-bold w-6 text-right shrink-0">{n}건</span>
          </div>
        ))}
        <p className="text-[10.5px] text-faint pt-1.5 border-t border-line leading-snug">
          같은 시간대·같은 방면 수요를 묶으면 차량 수가 줄어듭니다 — [AI 배차 실행]
        </p>
      </div>
    </div>
  );
}

/** 단위경제 비교 바 — 1:1 vs 합승 */
function EconomicsCard({ vehicleCount }: { vehicleCount: number }) {
  const solo = UNIT_ECONOMICS.soloVehiclesNeeded;
  return (
    <div className="rounded-2xl bg-card border border-line px-4 py-3.5 animate-[rise_.45s_.4s_ease_both]">
      <p className="text-[13px] font-bold mb-2.5">배차 효율 — 1:1 vs 합승</p>
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-8 text-sub shrink-0">1:1</span>
          <div className="flex-1 h-3.5 rounded-r-sm bg-[#ffebee] relative">
            <div className="h-full rounded-r-sm bg-red/80" style={{ width: "100%" }} />
          </div>
          <span className="tnum w-8 font-bold text-red shrink-0">{solo}대</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-8 text-sub shrink-0">합승</span>
          <div className="flex-1 h-3.5">
            <div
              className="h-full rounded-r-sm bg-primary transition-all duration-700"
              style={{ width: `${(vehicleCount / solo) * 100}%` }}
            />
          </div>
          <span className="tnum w-8 font-bold text-primary-dark shrink-0">{vehicleCount}대</span>
        </div>
      </div>
      <p className="tnum text-[13px] text-sub border-t border-line pt-2.5">
        운행당 수입 10.5만 − 비용 9.2만 = <b className="text-primary-dark">+1.3만 원</b>
        <span className="text-[11px]"> · 자녀 구독 매출은 순증</span>
      </p>
    </div>
  );
}

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [runStep, setRunStep] = useState(0);
  const [filter, setFilter] = useState<HospitalFilter>("전체");
  const runCount = useRef(0);

  const scenario = DISPATCH_SCENARIOS[scenarioIdx];

  function dispatch() {
    if (phase === "running") return;
    if (runCount.current > 0) {
      setScenarioIdx((i) => (i + 1) % DISPATCH_SCENARIOS.length);
    }
    runCount.current += 1;
    setRunStep(0);
    setFilter("전체");
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

  // ── 필터 적용 데이터 ──
  const filteredReservations = RESERVATIONS.filter((r) => filter === "전체" || r.hospital === filter);
  const filteredVehicles = scenario.vehicles.filter((v) => filter === "전체" || v.hospital === filter);

  // ── 지도 데이터 ──
  const markers: MapMarker[] = [...HOSPITAL_MARKERS];
  const polylines: MapPolyline[] = [];

  if (phase === "done") {
    for (const v of filteredVehicles) {
      const color = ROUTE_COLORS[v.colorVar];
      polylines.push({ path: v.path, color });
      markers.push({ position: v.path[v.path.length - 1], color, major: true, glyph: "🚐", label: v.vehicle });
      for (const id of v.elderIds) {
        const e = elderById(id);
        markers.push({ position: e.coord, color, label: e.name });
      }
    }
  } else {
    // 미배차 — 목적지 병원별 색상으로 "아직 묶이지 않은 수요"를 보여준다
    for (const r of filteredReservations) {
      const e = elderById(r.elderId);
      markers.push({
        position: e.coord,
        color: r.hospital === "건국대충주병원" ? "#3ba949" : "#42a5f5",
        label: e.name,
      });
    }
  }

  const activeElderCount = scenario.vehicles.reduce((n, v) => n + v.elderIds.length, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <KpiStrip phase={phase} vehicleCount={scenario.vehicles.length} />

      <div className="flex-1 flex flex-col-reverse lg:flex-row min-h-0">
        {/* ── 좌측 패널 ── */}
        <aside className="w-full lg:w-110 shrink-0 flex flex-col bg-card border-r border-line flex-1 lg:flex-none min-h-0">
          <div className="px-5 pt-4 pb-3 border-b border-line">
            <p className="text-xs text-sub">{TODAY}</p>
            <div className="flex items-baseline justify-between mb-2.5">
              <h1 className="font-extrabold text-lg">오늘의 통원 예약</h1>
              <span className="tnum text-sm text-sub">
                {phase === "done"
                  ? `${activeElderCount}건 · ${scenario.vehicles.length}대`
                  : `${RESERVATIONS.length}건 · 미배차`}
              </span>
            </div>
            {/* 병원 필터 칩 */}
            <div className="flex gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-full border transition
                    ${filter === f
                      ? "bg-primary text-white border-primary"
                      : "bg-card text-sub border-line hover:border-primary/50"}`}
                >
                  {f === "전체" ? "전체" : HOSPITALS[f].short}
                </button>
              ))}
            </div>
          </div>

          {/* 예약/배차 리스트 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-bg">
            {phase === "done" ? (
              <div key={`${scenario.id}-${filter}`} className="space-y-4">
                <p className="text-xs text-sub -mb-1">{scenario.note}</p>
                {filteredVehicles.map((v, vi) => (
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
                      {v.elderIds.map((id, pi) => {
                        const e = elderById(id);
                        const r = RESERVATIONS.find((x) => x.elderId === id);
                        return (
                          <li key={id} className="px-4 py-2.5 flex items-center gap-3 text-sm">
                            <span
                              className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-extrabold text-white shrink-0"
                              style={{ background: ROUTE_COLORS[v.colorVar] }}
                            >
                              {pi + 1}
                            </span>
                            <span className="font-bold">{e.name}</span>
                            <span className="text-sub text-xs">
                              {e.ward} · {r?.department}
                            </span>
                            <span className="ml-auto tnum text-xs text-sub">{r?.time} 진료</span>
                          </li>
                        );
                      })}
                    </ul>
                    <footer className="flex items-center gap-3 px-4 py-2.5 bg-bg text-[11px] text-sub">
                      <span>🧑‍⚕️ {v.manager}</span>
                      <span className="tnum">⏱ {v.durationMin}분 · {v.distanceKm}km</span>
                      <span className="ml-auto tnum font-semibold text-primary-dark">
                        좌석 {v.elderIds.length}/{v.seats}
                      </span>
                    </footer>
                  </section>
                ))}
                {filteredVehicles.length === 0 && (
                  <p className="text-center text-sm text-faint py-8">해당 병원 방면 배차가 없습니다</p>
                )}
              </div>
            ) : (
              <ul className="space-y-2.5">
                {filteredReservations.map((r) => {
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
            {phase === "done" && <EconomicsCard vehicleCount={scenario.vehicles.length} />}
            <button
              onClick={dispatch}
              disabled={phase === "running"}
              className={`w-full h-12 rounded-2xl grad text-white font-bold text-[15px]
                shadow-[0_4px_16px_rgba(106,179,77,0.35)] hover:brightness-105 active:scale-[.99] transition disabled:opacity-70
                ${phase === "idle" ? "animate-[btnpulse_2.2s_ease-in-out_infinite]" : ""}`}
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
          <NaverMap
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            markers={markers}
            polylines={polylines}
            className="absolute inset-0"
          />
          {phase === "done" ? (
            <>
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
              <LiveFeed feed={LIVE_FEED} title="라이브 관제 피드" />
            </>
          ) : (
            <>
              <DemandOverlay />
              <div className="absolute top-4 right-4 rounded-2xl bg-card/95 shadow-card-md px-4 py-2.5 text-xs space-y-1">
                <p className="text-[11px] font-bold text-sub mb-0.5">목적지</p>
                <p className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-dark" />
                  건국대충주병원
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#42a5f5]" />
                  충주의료원
                </p>
              </div>
              <LiveFeed feed={INTAKE_FEED} title="접수 현황" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
