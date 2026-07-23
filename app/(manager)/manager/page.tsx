"use client";

import { useState } from "react";
import Link from "next/link";
import NaverMap, { type MapMarker } from "@/components/NaverMap";
import {
  Check,
  ClipboardList,
  Headset,
  ICON_MAP,
  MARKER_HOSPITAL,
  Phone,
  TriangleAlert,
  User,
} from "@/components/icons";
import {
  DISPATCH_SCENARIOS,
  HOSPITALS,
  OPERATOR_ASSIGNMENT,
  OPERATOR_NOTICES,
  OPERATOR_STATS,
  OPERATOR_TASKS,
  TODAY,
  elderById,
  type TaskKind,
} from "@/lib/mock-data";

/**
 * 운영 관리자 — 오늘 업무. (PROTOTYPE_PLAN §1.9)
 *
 * 관리자는 **사무실에서 일한다.** 차에 타지 않고 병원에도 가지 않는다.
 * 하루 업무는 통화와 확인이다: 출발 안내 콜 → 기사 체크 수신 → 귀가 확인 콜 → 리포트 발송.
 * 한 사람이 어르신 8명·차량 3대를 동시에 관제하는 것이 지방에서 원가가 성립하는 이유다.
 */

const RUN = DISPATCH_SCENARIOS[0];
const ROUTE_HEX = ["#3ba949", "#42a5f5", "#ffa726"];

const TASK_STYLE: Record<TaskKind, { label: string; icon: typeof Phone }> = {
  call: { label: "통화", icon: Phone },
  check: { label: "확인", icon: Check },
  report: { label: "리포트", icon: ClipboardList },
  cs: { label: "문의", icon: Headset },
};

/** 관제 중인 차량 3대의 현재 위치 (연출) */
const MAP_MARKERS: MapMarker[] = [
  ...RUN.vehicles.map((v, i) => ({
    position: v.path[Math.min(i + 3, v.path.length - 1)],
    color: ROUTE_HEX[i],
    major: true,
    glyph: String(i + 1),
    label: v.vehicle,
  })),
  ...Object.entries(HOSPITALS).map(([name, h]) => ({
    position: h.coord,
    color: "#212121",
    major: true,
    glyph: MARKER_HOSPITAL,
    label: name,
  })),
];

export default function OperatorHome() {
  const [tasks, setTasks] = useState(OPERATOR_TASKS);
  const doneCount = tasks.filter((t) => t.done).length;
  const nextTask = tasks.find((t) => !t.done);

  function toggle(id: string) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg flex items-center gap-2">
          <Headset size={22} />
          모시GO 관리자
        </span>
        <span className="text-sm text-white/90 flex items-center gap-1.5">
          <User size={16} />
          김민지
        </span>
      </header>

      {/* 히어로 — 오늘 관제 요약 */}
      <section className="grad hero-deco text-white mx-4 mt-4 p-6 rounded-2xl shadow-[0_4px_16px_rgba(106,179,77,0.3)]">
        <p className="text-[13px] font-medium opacity-90">{TODAY} · 충주 북부권</p>
        <p className="text-[2rem] font-extrabold tracking-tight">어르신 8명 관제</p>
        <div className="flex items-center gap-2 mt-3 text-[13px] opacity-90">
          <span className="tnum">
            업무 {doneCount}/{tasks.length}
          </span>
          <div className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
            <div
              className="h-full bg-white rounded transition-all duration-500"
              style={{ width: `${(doneCount / tasks.length) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-[11px] opacity-80 mt-1.5">
          {OPERATOR_ASSIGNMENT.from} · {OPERATOR_ASSIGNMENT.assignedAt} 배차 · {OPERATOR_ASSIGNMENT.note}
        </p>
      </section>

      {/* 처리량 지표 — 1인이 감당하는 규모 */}
      <div className="grid grid-cols-3 gap-2.5 mx-4 mt-4">
        {OPERATOR_STATS.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl shadow-card px-3 py-3 text-center">
            <p className="tnum text-[17px] font-extrabold text-primary-dark leading-tight">{s.value}</p>
            <p className="text-[11px] text-sub">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 다음 업무 */}
      {nextTask && (
        <section className="bg-card mx-4 mt-4 rounded-2xl shadow-card-md ring-2 ring-primary px-5 py-4">
          <p className="text-[11px] font-bold text-primary-dark tracking-wider mb-1.5">다음 업무</p>
          <div className="flex items-center gap-3">
            <div className="grad w-11 h-11 rounded-xl grid place-items-center text-white shrink-0">
              {(() => {
                const Icon = TASK_STYLE[nextTask.kind].icon;
                return <Icon size={20} />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold tnum">
                {nextTask.time} · {nextTask.title}
              </p>
              <p className="text-xs text-sub">{nextTask.detail}</p>
            </div>
          </div>
          <Link
            href="/manager/trip"
            className="mt-3 grad flex items-center justify-center h-12 rounded-xl text-white font-bold text-[15px]
              shadow-[0_4px_16px_rgba(106,179,77,0.35)] active:scale-[.99] transition"
          >
            운행 상세 열기 →
          </Link>
        </section>
      )}

      {/* 관제 중인 차량 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h2 className="text-base font-bold">관제 중인 차량</h2>
        <span className="tnum text-[12px] text-sub">3대 운행 중</span>
      </div>
      <div className="mx-4 rounded-2xl overflow-hidden shadow-card">
        <NaverMap
          center={[37.03, 127.92]}
          zoom={10}
          markers={MAP_MARKERS}
          polylines={RUN.vehicles.map((v, i) => ({ path: v.path, color: ROUTE_HEX[i] }))}
          className="h-56"
        />
      </div>
      <div className="mx-4 mt-2.5 space-y-2">
        {RUN.vehicles.map((v, i) => (
          <div
            key={v.vehicle}
            className="bg-card rounded-xl shadow-card px-4 py-2.5 flex items-center gap-2.5 text-[13px]"
          >
            <span
              className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-extrabold text-white shrink-0"
              style={{ background: ROUTE_HEX[i] }}
            >
              {i + 1}
            </span>
            <b>{v.vehicle}</b>
            <span className="text-sub truncate">{v.driver}</span>
            <span className="ml-auto tnum text-[11px] text-faint shrink-0">
              {v.elderIds.length}인 · {HOSPITALS[v.hospital].short}
            </span>
          </div>
        ))}
      </div>

      {/* 오늘 업무 큐 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">오늘 업무</h2>
      <div className="mx-4 space-y-2.5">
        {tasks.map((t) => {
          const Icon = TASK_STYLE[t.kind].icon;
          const elder = t.elderId ? elderById(t.elderId) : null;
          return (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`w-full bg-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left transition
                ${t.done ? "shadow-card opacity-60" : "shadow-card-md"}`}
            >
              <span
                className={`w-9 h-9 rounded-xl grid place-items-center shrink-0
                  ${t.done ? "bg-primary text-white" : "bg-primary-light text-primary-dark"}`}
              >
                {t.done ? <Check size={17} strokeWidth={3} /> : <Icon size={17} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-bold ${t.done ? "line-through text-sub" : ""}`}>{t.title}</p>
                <p className="text-[11.5px] text-sub truncate">
                  {t.detail}
                  {elder && ` · ${elder.ward}`}
                </p>
              </div>
              <span className="tnum text-[11px] text-faint shrink-0">{t.time}</span>
            </button>
          );
        })}
      </div>

      {/* 알림 */}
      <h2 className="text-base font-bold px-5 pt-5 pb-2">현장 알림</h2>
      <div className="mx-4 mb-6 space-y-2">
        {OPERATOR_NOTICES.map((n) => {
          const Icon = ICON_MAP[n.icon] ?? TriangleAlert;
          return (
            <div key={n.time} className="bg-card rounded-2xl shadow-card px-4 py-3 flex items-start gap-2.5">
              <Icon size={16} className="shrink-0 mt-0.5 text-primary-dark" />
              <p className="text-[13px] leading-snug flex-1">{n.text}</p>
              <span className="tnum text-[11px] text-faint shrink-0">{n.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
