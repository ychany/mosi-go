"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NaverMap, { type MapMarker } from "@/components/NaverMap";
import { Bell, BusFront, Calendar, ChevronRight, MARKER_HOSPITAL, MARKER_VEHICLE, Stethoscope, User } from "@/components/icons";
import { NotiSheet, PushBanner } from "@/components/PushBanner";
import {
  GUARDIAN_ELDER_ID,
  HOSPITALS,
  NOTI_HISTORY,
  PHASE_NOTIFICATIONS,
  TRACK,
  elderById,
  type PushNotification,
} from "@/lib/mock-data";

/**
 * 자녀 — 홈 (실시간 위치). 돌봄 공백의 해소 (PROTOTYPE_PLAN §6.3)
 * 차량 마커가 2초마다 경로를 한 칸씩 이동한다. 서버·소켓 없음.
 */

const elder = elderById(GUARDIAN_ELDER_ID);
const PHASES = TRACK.phases;
/** 경로 주행이 끝난 뒤에도 진료 중·귀가 중 단계가 이어진다 (§1.12) */
const LAST_PATH_IDX = TRACK.path.length - 1;

export default function GuardianHome() {
  // tick: 0..LAST_PATH_IDX 는 주행, 이후 진료 중 → 진료 지연 → 귀가 중
  const [tick, setTick] = useState(0);
  const MAX_TICK = LAST_PATH_IDX + 3;

  // 푸시 알림 (§6.3-1) — 실제 FCM 없음, 상태 전이 시 배너 연출
  const [banner, setBanner] = useState<PushNotification | null>(null);
  const [inbox, setInbox] = useState<PushNotification[]>(NOTI_HISTORY);
  const [unread, setUnread] = useState(NOTI_HISTORY.length);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick((i) => Math.min(i + 1, MAX_TICK)), 2000);
    return () => clearInterval(t);
  }, [MAX_TICK]);

  const posIdx = Math.min(tick, LAST_PATH_IDX);
  const phaseIdx = Math.max(0, Math.min(tick - LAST_PATH_IDX + 1, PHASES.length - 1));
  const phase = PHASES[phaseIdx];
  const atHospital = phaseIdx >= 1;
  const delayed = phase.label === "진료 지연";
  const progress = Math.round((tick / MAX_TICK) * 100);

  // 단계가 바뀌면 해당 알림을 배너로 띄우고 3초 후 자동 해제
  useEffect(() => {
    const noti = PHASE_NOTIFICATIONS[phaseIdx];
    if (!noti) return;
    setBanner(noti);
    setInbox((prev) => (prev.some((n) => n.id === noti.id) ? prev : [noti, ...prev]));
    setUnread((n) => n + 1);
    const t = setTimeout(() => setBanner(null), 3000);
    return () => clearTimeout(t);
  }, [phaseIdx]);

  const markers: MapMarker[] = [
    { position: TRACK.path[0], color: "#9e9e9e", label: "자택" },
    { position: HOSPITALS.건국대충주병원.coord, color: "#212121", label: "건국대충주병원", major: true, glyph: MARKER_HOSPITAL },
    { position: TRACK.path[posIdx], color: "#ffa726", major: true, glyph: MARKER_VEHICLE, label: TRACK.vehicle },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {banner && <PushBanner noti={banner} onClose={() => setBanner(null)} />}
      {sheetOpen && <NotiSheet items={inbox} onClose={() => setSheetOpen(false)} />}

      {/* 그라데이션 헤더 */}
      <header className="grad text-white px-5 h-16 flex items-center justify-between sticky top-0 z-40">
        <span className="font-extrabold text-lg flex items-center gap-2">
          <BusFront size={22} />
          모시GO
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSheetOpen(true);
              setUnread(0);
            }}
            className="relative p-1 active:scale-95 transition"
            aria-label={`알림 ${unread}건`}
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red text-white text-[10px] font-extrabold grid place-items-center">
                {unread}
              </span>
            )}
          </button>
          <span className="text-sm text-white/90 flex items-center gap-1.5"><User size={16} />{elder.guardian.name} 님</span>
        </div>
      </header>

      {/* 히어로 카드 — 오늘 동행 현황 */}
      <section className="grad hero-deco text-white mx-4 mt-4 p-6 rounded-2xl shadow-[0_4px_16px_rgba(106,179,77,0.3)]">
        <p className="text-[13px] font-medium opacity-90">오늘 동행 · 어머니 {elder.name}</p>
        <p className="text-[2rem] font-extrabold tracking-tight leading-snug">{phase.label}</p>
        <div className="flex items-center gap-2 mt-3 text-[13px] opacity-90">
          <span>{phaseIdx === 0 ? TRACK.etaText : phase.note}</span>
          <div className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
            <div className="h-full bg-white rounded transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="text-[11px] opacity-80 mt-1.5">
          {elder.condition} · 건국대충주병원 09:30 진료
        </p>
      </section>

      {/* 4단계 진행 스트립 — 차량이 병원에 상주한다 (§1.12) */}
      <div className="flex items-center px-5 py-3 mx-4 mt-4 bg-card rounded-2xl shadow-card">
        {PHASES.map((p, i) => {
          const reached = phaseIdx >= i;
          return (
            <div key={p.label} className="flex items-center flex-1 last:flex-none">
              <span
                className={`text-[11.5px] whitespace-nowrap font-bold px-2 py-1 rounded-full
                  ${phaseIdx === i ? "bg-orange text-white" : reached ? "text-primary-dark" : "text-faint"}`}
              >
                {p.label}
              </span>
              {i < PHASES.length - 1 && (
                <span className={`flex-1 h-0.5 mx-1 rounded ${reached ? "bg-primary" : "bg-line"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* 담당 기사 카드 */}
      <section className="bg-card mx-4 mt-4 px-5 py-4 rounded-2xl shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-light rounded-xl grid place-items-center text-primary-dark"><Stethoscope size={22} /></div>
          <div>
            <p className="text-[15px] font-bold">{TRACK.driver}</p>
            <p className="text-xs text-sub mt-0.5">{TRACK.vehicle} · 3인 합승 · 관제 {TRACK.operator}</p>
          </div>
        </div>
        <span
          className={`text-[12px] font-bold px-3 py-1.5 rounded-full shrink-0
            ${atHospital ? "bg-primary-light text-primary-dark" : "bg-[#fff3e0] text-orange"}`}
        >
          {phase.label}
        </span>
      </section>

      {/* 차량 병원 대기 안내 — 재호출이 필요 없다는 것이 핵심 (§1.12) */}
      {(phaseIdx === 2 || delayed) && (
        <div className={`mx-4 mt-3 rounded-2xl px-4 py-3 flex items-start gap-2.5 animate-[rise_.4s_ease_both] ${delayed ? "bg-[#fff3e0]" : "bg-primary-light"}`}>
          <BusFront size={16} className="shrink-0 mt-0.5 text-primary-dark" />
          <p className="text-[12.5px] leading-snug">
            <b className="text-primary-dark">
              {delayed ? "진료가 길어지고 있습니다 — 차량은 계속 대기합니다." : "차량이 병원에서 대기 중입니다."}
            </b>
            <br />
            진료가 끝나면 5분 내 탑승합니다 — 따로 부르실 필요 없습니다.
          </p>
        </div>
      )}

      {/* 실시간 지도 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h2 className="text-base font-bold">실시간 위치</h2>
        <span className="text-[12px] text-sub tnum">{progress}% 진행</span>
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
