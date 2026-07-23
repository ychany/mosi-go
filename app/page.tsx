import Link from "next/link";

/**
 * 데모 홈 — 3개 채널 진입 허브 (PROTOTYPE_PLAN §3)
 * 발표 시 탭을 여는 시작점이자, 직접 URL 진입 시의 안전장치.
 */

const CHANNELS = [
  {
    href: "/admin",
    tag: "관제 웹",
    title: "운영팀 · 지자체",
    desc: "오늘의 예약을 확인하고 AI 배차를 실행합니다",
    device: "데스크톱",
  },
  {
    href: "/m",
    tag: "동행매니저",
    title: "현장의 손과 눈",
    desc: "오늘 스케줄 확인, 어르신 동행, 리포트 작성",
    device: "모바일",
  },
  {
    href: "/g",
    tag: "자녀 · 보호자",
    title: "타지에서도 곁에",
    desc: "부모님의 이동을 실시간으로, 진료 결과를 리포트로",
    device: "모바일",
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-deep text-white">
      <p className="text-[13px] tracking-[0.18em] font-bold text-[#8fb8a4] mb-5">
        고령자 의료동행 모빌리티 플랫폼 · 시연 프로토타입
      </p>
      <h1 className="font-serif text-6xl font-bold mb-3">
        모시<span className="text-amber">GO</span>
      </h1>
      <p className="text-[#c3d2ca] mb-12">집에서 병원, 다시 집까지</p>

      <div className="grid gap-4 sm:grid-cols-3 w-full max-w-3xl">
        {CHANNELS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition hover:bg-white/10 hover:border-amber/60"
          >
            <span className="inline-block text-xs font-bold text-white bg-green rounded-full px-3 py-1 mb-4">
              {c.tag}
            </span>
            <h2 className="font-bold text-lg mb-1">{c.title}</h2>
            <p className="text-sm text-[#9fb3a8] mb-4">{c.desc}</p>
            <span className="text-xs text-[#8fb8a4]">{c.device} →</span>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-xs text-gray">
        본 화면의 모든 인물·예약·수치는 시연을 위한 가상 데이터입니다
      </p>
    </main>
  );
}
