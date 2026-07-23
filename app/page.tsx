import Link from "next/link";

/**
 * 데모 홈 — 3트랙 진입 허브 (PROTOTYPE_PLAN §1.2, §4)
 * 발표 시 탭을 여는 시작점이자, 직접 URL 진입 시의 안전장치.
 */

const CHANNELS = [
  {
    href: "/admin",
    icon: "🗺️",
    tag: "지자체 트랙",
    title: "관제 · B2G 대시보드",
    desc: "AI 배차 실행과 읍·면별 접근성 지표 — 주 고객은 지자체입니다",
    device: "데스크톱",
  },
  {
    href: "/m",
    icon: "🧑‍⚕️",
    tag: "어르신 트랙",
    title: "동행매니저",
    desc: "어르신은 앱을 쓰지 않습니다 — 어르신의 화면은 매니저의 손에",
    device: "모바일",
  },
  {
    href: "/g",
    icon: "👨‍👩‍👧",
    tag: "자녀 트랙",
    title: "자녀 · 보호자",
    desc: "실시간 위치, 진료 리포트, 정기 배차 — 타지에서도 곁에",
    device: "모바일",
  },
];

export default function Home() {
  return (
    <main className="flex-1 grad flex flex-col items-center justify-center px-6 py-16 text-white">
      <p className="text-[13px] tracking-[0.15em] font-bold text-white/80 mb-4 text-center">
        고령자 의료동행 모빌리티 플랫폼 · 시연 프로토타입
      </p>
      <h1 className="text-6xl font-extrabold mb-2 tracking-tight">🚐 모시GO</h1>
      <p className="text-white/90 mb-12 font-medium">집에서 병원, 다시 집까지</p>

      <div className="grid gap-4 sm:grid-cols-3 w-full max-w-3xl">
        {CHANNELS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-card text-ink rounded-2xl shadow-card-lg p-6 transition hover:-translate-y-1 active:scale-[.98]"
          >
            <div className="w-12 h-12 bg-primary-light rounded-xl grid place-items-center text-2xl mb-4">
              {c.icon}
            </div>
            <span className="inline-block text-[11px] font-bold text-primary-dark bg-primary-light rounded-full px-2.5 py-0.5 mb-2">
              {c.tag}
            </span>
            <h2 className="font-extrabold text-lg mb-1">{c.title}</h2>
            <p className="text-[13px] text-sub mb-3 leading-relaxed">{c.desc}</p>
            <span className="text-xs text-primary font-bold">{c.device} 열기 →</span>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-xs text-white/70 text-center">
        본 화면의 모든 인물·예약·수치는 시연을 위한 가상 데이터입니다
      </p>
    </main>
  );
}
