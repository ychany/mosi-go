"use client";

import Link from "next/link";
import { BusFront, ChevronRight, TriangleAlert, X } from "@/components/icons";
import type { NotiTone, PushNotification } from "@/lib/mock-data";

/**
 * 자녀 푸시 알림 UI. (PROTOTYPE_PLAN §6.3-1)
 *
 * 실제 FCM을 붙이지 않는다 — 상태 전이 시 배너를 띄우는 연출이다.
 * 열어야 보이면 조회지 보고가 아니므로, 자녀가 아무것도 하지 않아도 배너가 뜨는 것이 핵심.
 */

const TONE: Record<NotiTone, { bar: string; icon: typeof BusFront; iconClass: string }> = {
  info: { bar: "bg-faint", icon: BusFront, iconClass: "bg-bg text-sub" },
  good: { bar: "bg-primary", icon: BusFront, iconClass: "bg-primary-light text-primary-dark" },
  warn: { bar: "bg-orange", icon: TriangleAlert, iconClass: "bg-[#fff3e0] text-orange" },
};

/** 화면 상단에서 슬라이드 다운되는 푸시 배너 — 3초 후 자동 해제 */
export function PushBanner({ noti, onClose }: { noti: PushNotification; onClose: () => void }) {
  const tone = TONE[noti.tone];
  const Icon = tone.icon;
  const inner = (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${tone.iconClass}`}>
        <Icon size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-[13px] font-extrabold truncate">모시GO</p>
          <span className="tnum text-[10.5px] text-faint shrink-0">{noti.time}</span>
        </div>
        <p className="text-[13px] font-bold leading-snug mt-0.5">{noti.title}</p>
        <p className="text-[11.5px] text-sub leading-snug mt-0.5">{noti.body}</p>
      </div>
      {noti.href && <ChevronRight size={16} className="text-faint shrink-0 mt-2" />}
    </div>
  );

  return (
    <div
      className="fixed top-2 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] max-w-[464px] z-[60]"
      role="status"
    >
      <div
        className="bg-card/95 backdrop-blur rounded-2xl shadow-card-lg overflow-hidden flex
          animate-[dropin_.35s_cubic-bezier(.2,.9,.3,1.2)_both]"
      >
        <span className={`w-1 shrink-0 ${tone.bar}`} />
        {noti.href ? (
          <Link href={noti.href} className="flex-1 min-w-0" onClick={onClose}>
            {inner}
          </Link>
        ) : (
          <div className="flex-1 min-w-0">{inner}</div>
        )}
      </div>
    </div>
  );
}

/** 종 아이콘 탭 시 올라오는 알림 목록 시트 */
export function NotiSheet({
  items,
  onClose,
}: {
  items: PushNotification[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      <button
        className="absolute inset-0 bg-black/40 animate-[fadein_.2s_ease_both]"
        onClick={onClose}
        aria-label="닫기"
      />
      <div
        className="relative w-full max-w-[480px] bg-card rounded-t-3xl max-h-[70dvh] flex flex-col
          animate-[sheetup_.3s_cubic-bezier(.2,.9,.3,1)_both]"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-extrabold text-[17px]">알림</h2>
          <button onClick={onClose} className="text-faint p-1" aria-label="닫기">
            <X size={20} />
          </button>
        </header>
        <div className="overflow-y-auto px-4 py-3 space-y-2.5">
          {items.length === 0 && (
            <p className="text-center text-sm text-faint py-10">받은 알림이 없습니다</p>
          )}
          {items.map((n) => {
            const tone = TONE[n.tone];
            const Icon = tone.icon;
            const row = (
              <div className="flex items-start gap-3 px-4 py-3.5">
                <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${tone.iconClass}`}>
                  <Icon size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold leading-snug">{n.title}</p>
                  <p className="text-[11.5px] text-sub leading-snug mt-0.5">{n.body}</p>
                </div>
                <span className="tnum text-[10.5px] text-faint shrink-0">{n.time}</span>
              </div>
            );
            return n.href ? (
              <Link
                key={n.id}
                href={n.href}
                onClick={onClose}
                className="block bg-bg rounded-2xl active:scale-[.99] transition"
              >
                {row}
              </Link>
            ) : (
              <div key={n.id} className="bg-bg rounded-2xl">
                {row}
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-faint text-center py-3 border-t border-line">
          알림은 전 이용자 기본 포함입니다 · 별도 요금 없음
        </p>
      </div>
    </div>
  );
}
