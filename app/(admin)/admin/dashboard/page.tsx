import { DASHBOARD } from "@/lib/mock-data";

/**
 * 지자체 대시보드 — B2G의 클로징 (PROTOTYPE_PLAN §6.4)
 * 지자체가 사는 것은 "동행 서비스"가 아니라 예산 집행을 지표로 증명하는 운영 플랫폼이다.
 * 라이브러리 없음 — 막대는 div, 라인은 인라인 SVG.
 */

// 차트 마크 색 — 팔레트 검증 통과값 (primary-dark)
const MARK = "#3ba949";

function WardBars() {
  const max = Math.max(...DASHBOARD.wardDemand.map((d) => d.count));
  return (
    <div className="space-y-2.5">
      {DASHBOARD.wardDemand.map((d) => (
        <div key={d.ward} className="flex items-center gap-3" title={`${d.ward} ${d.count}건`}>
          <span className="w-14 shrink-0 text-[12px] text-sub text-right">{d.ward}</span>
          <div className="flex-1 h-3.5">
            <div
              className="h-full rounded-r-sm"
              style={{ width: `${(d.count / max) * 100}%`, background: MARK }}
            />
          </div>
          <span className="tnum w-8 shrink-0 text-[12px] font-bold">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

function MonthlyLine() {
  const data = DASHBOARD.monthly;
  const W = 560;
  const H = 170;
  const PAD = { top: 16, right: 40, bottom: 24, left: 34 };
  const yMax = 300;
  const x = (i: number) => PAD.left + (i * (W - PAD.left - PAD.right)) / (data.length - 1);
  const y = (v: number) => PAD.top + (1 - v / yMax) * (H - PAD.top - PAD.bottom);
  const points = data.map((d, i) => `${x(i)},${y(d.count)}`).join(" ");
  const last = data[data.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="월별 운행 추이">
      {[100, 200, 300].map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#eeeeee" strokeWidth="1" />
          <text x={PAD.left - 6} y={y(v) + 3.5} textAnchor="end" fontSize="10" fill="#757575">
            {v}
          </text>
        </g>
      ))}
      <polyline points={points} fill="none" stroke={MARK} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={d.month}>
          <circle cx={x(i)} cy={y(d.count)} r={i === data.length - 1 ? 4.5 : 3} fill={MARK} stroke="#fff" strokeWidth="2">
            <title>{`${d.month} ${d.count}건`}</title>
          </circle>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#757575">
            {d.month}
          </text>
        </g>
      ))}
      <text x={x(data.length - 1) + 8} y={y(last.count) + 4} fontSize="11" fontWeight="700" fill="#212121">
        {last.count}건
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex-1 px-6 py-6 max-w-5xl w-full mx-auto">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <div>
          <h1 className="font-extrabold text-2xl">충주시 의료 이동지원 현황</h1>
          <p className="text-sm text-sub">읍·면별 수요와 접근성 지표 — 노인복지·스마트도시 부서용</p>
        </div>
        <span className="text-[11px] text-sub bg-card border border-line rounded-full px-3 py-1 shadow-card">
          B2G 데모 · 가상 데이터
        </span>
      </div>

      {/* 숫자 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {DASHBOARD.stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card shadow-card px-5 py-4">
            <p className="text-xs text-sub mb-1">{s.label}</p>
            <p className="tnum text-[28px] font-extrabold leading-tight text-primary-dark">{s.value}</p>
            <p className="text-[11px] text-faint">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-card shadow-card px-5 py-4">
          <h2 className="text-sm font-bold mb-1">읍·면별 통원 수요</h2>
          <p className="text-[11px] text-sub mb-4">월간 이동지원 요청 건수</p>
          <WardBars />
        </section>

        <section className="rounded-2xl bg-card shadow-card px-5 py-4">
          <h2 className="text-sm font-bold mb-1">월별 운행 추이</h2>
          <p className="text-[11px] text-sub mb-4">2026년 누적 — 전월 대비 +18%</p>
          <MonthlyLine />
        </section>
      </div>

      <p className="text-[11px] text-sub mt-4">
        수요가 높은 산척면·엄정면은 정기 노선화 검토 대상입니다. 데이터는 배차 시스템에서 자동 집계됩니다.
      </p>
    </div>
  );
}
