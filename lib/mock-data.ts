/**
 * 모시GO 프로토타입 목업 데이터
 *
 * 백엔드 없음 — 모든 화면이 이 파일 하나를 읽는다. (PROTOTYPE_PLAN §0, §6)
 * 인물·예약·리포트는 전부 가상이며, 좌표는 시연 목적의 근사값(소수점 3자리)이다.
 */

// ───────────────────────────── 기준 좌표 ─────────────────────────────

export type LatLng = [lat: number, lng: number];

export type Ward = "산척면" | "소태면" | "엄정면" | "앙성면" | "노은면";
export type Hospital = "건국대충주병원" | "충주의료원";

export const WARDS: Record<Ward, { coord: LatLng }> = {
  산척면: { coord: [37.081, 127.998] },
  소태면: { coord: [37.078, 127.876] },
  엄정면: { coord: [37.086, 127.945] },
  앙성면: { coord: [37.116, 127.816] },
  노은면: { coord: [37.055, 127.795] },
};

export const HOSPITALS: Record<Hospital, { coord: LatLng; short: string }> = {
  건국대충주병원: { coord: [36.965, 127.925], short: "건대충주" },
  충주의료원: { coord: [36.985, 127.955], short: "의료원" },
};

/** 지도 초기 중심 — 충주 시내와 북부 읍·면이 한 화면에 들어오는 지점 */
export const MAP_CENTER: LatLng = [37.03, 127.9];
export const MAP_ZOOM = 11;

// ───────────────────────────── 어르신 프로필 ─────────────────────────────

export interface Elder {
  id: string;
  name: string;
  age: number;
  ward: Ward;
  condition: "혈액투석" | "재활치료" | "만성질환 진료";
  frequency: string;
  careNotes: string[];
  guardian: { name: string; relation: string; residence: string };
  coord: LatLng; // 자택 (읍·면 중심에서 약간씩 흩뿌림)
}

export const ELDERS: Elder[] = [
  {
    id: "e1",
    name: "김영자",
    age: 78,
    ward: "산척면",
    condition: "혈액투석",
    frequency: "주 3회 (월·수·금)",
    careNotes: ["계단 이용 어려움 — 승하차 부축 필요", "투석 후 어지럼 주의", "오른쪽 귀 청력 저하 — 왼쪽에서 말 걸기"],
    guardian: { name: "김성호", relation: "장남", residence: "서울 강남구" },
    coord: [37.084, 128.001],
  },
  {
    id: "e2",
    name: "박순덕",
    age: 82,
    ward: "산척면",
    condition: "재활치료",
    frequency: "주 2회 (수·금)",
    careNotes: ["휠체어 필요", "무릎 인공관절 수술 후 6주차"],
    guardian: { name: "박미영", relation: "장녀", residence: "경기 성남시" },
    coord: [37.077, 127.994],
  },
  {
    id: "e3",
    name: "이말순",
    age: 75,
    ward: "엄정면",
    condition: "혈액투석",
    frequency: "주 3회 (월·수·금)",
    careNotes: ["당뇨 — 대기 중 간식 필요", "저혈당 증상 시 즉시 보고"],
    guardian: { name: "이준석", relation: "차남", residence: "서울 마포구" },
    coord: [37.089, 127.948],
  },
  {
    id: "e4",
    name: "최복례",
    age: 80,
    ward: "소태면",
    condition: "만성질환 진료",
    frequency: "월 2회",
    careNotes: ["고혈압·고지혈 복합 처방", "약 봉투 글씨를 못 읽으심 — 복약 안내 필수"],
    guardian: { name: "최은정", relation: "장녀", residence: "인천 연수구" },
    coord: [37.075, 127.872],
  },
  {
    id: "e5",
    name: "정갑수",
    age: 84,
    ward: "소태면",
    condition: "재활치료",
    frequency: "주 2회 (화·목)",
    careNotes: ["보행 보조기 사용", "병원 내 이동 시 동행 필수", "커피 드리면 안 됨 (부정맥)"],
    guardian: { name: "정민재", relation: "손자", residence: "서울 관악구" },
    coord: [37.082, 127.881],
  },
  {
    id: "e6",
    name: "윤정희",
    age: 77,
    ward: "앙성면",
    condition: "혈액투석",
    frequency: "주 3회 (월·수·금)",
    careNotes: ["투석 전 혈압 체크 결과 매니저 앱에 기록", "멀미 — 앞자리 배정"],
    guardian: { name: "윤상혁", relation: "장남", residence: "경기 수원시" },
    coord: [37.119, 127.812],
  },
  {
    id: "e7",
    name: "한만식",
    age: 81,
    ward: "노은면",
    condition: "만성질환 진료",
    frequency: "월 2회",
    careNotes: ["파킨슨 초기 — 서두르게 하지 않기", "진료과 2곳 연속 방문 (신경과→내과)"],
    guardian: { name: "한지원", relation: "장녀", residence: "서울 송파구" },
    coord: [37.052, 127.791],
  },
  {
    id: "e8",
    name: "조순남",
    age: 79,
    ward: "앙성면",
    condition: "재활치료",
    frequency: "주 2회 (수·금)",
    careNotes: ["어깨 회전근개 재활", "귀가 시 경로당 앞 하차 희망 (수요일만)"],
    guardian: { name: "조현우", relation: "차남", residence: "서울 노원구" },
    coord: [37.111, 127.821],
  },
];

export const elderById = (id: string): Elder => {
  const found = ELDERS.find((e) => e.id === id);
  if (!found) throw new Error(`unknown elder: ${id}`);
  return found;
};

// ───────────────────────────── 오늘의 예약 ─────────────────────────────

export const TODAY = "2026년 7월 23일 (목)";

export interface Reservation {
  id: string;
  elderId: string;
  hospital: Hospital;
  department: string;
  time: string; // 진료 예약 시각
  via: "자녀 앱" | "전화 접수" | "정기 배차";
}

export const RESERVATIONS: Reservation[] = [
  { id: "r1", elderId: "e1", hospital: "건국대충주병원", department: "신장내과", time: "09:30", via: "정기 배차" },
  { id: "r2", elderId: "e2", hospital: "건국대충주병원", department: "재활의학과", time: "10:00", via: "자녀 앱" },
  { id: "r3", elderId: "e3", hospital: "건국대충주병원", department: "신장내과", time: "09:30", via: "정기 배차" },
  { id: "r4", elderId: "e4", hospital: "충주의료원", department: "내과", time: "10:00", via: "전화 접수" },
  { id: "r5", elderId: "e5", hospital: "충주의료원", department: "재활의학과", time: "10:30", via: "전화 접수" },
  { id: "r6", elderId: "e6", hospital: "건국대충주병원", department: "신장내과", time: "09:30", via: "정기 배차" },
  { id: "r7", elderId: "e7", hospital: "충주의료원", department: "신경과", time: "10:00", via: "자녀 앱" },
  { id: "r8", elderId: "e8", hospital: "건국대충주병원", department: "재활의학과", time: "10:00", via: "정기 배차" },
];

// ───────────────────────────── 배차 시나리오 ─────────────────────────────
//
// [AI 배차 실행] 버튼은 아래 시나리오를 순환 출력한다. (PROTOTYPE_PLAN §5.1)
// 경로 좌표는 실제 도로를 따라가는 것처럼 보이도록 중간 경유점을 넣는다.
// TODO: 네이버 길찾기에서 꺾이는 지점 좌표를 따서 경유점 보강 (§6.1)

export interface VehicleRoute {
  vehicle: string;
  hospital: Hospital;
  elderIds: string[];
  /** CSS 변수명 route-1 | route-2 | route-3 */
  colorVar: "route-1" | "route-2" | "route-3";
  path: LatLng[];
  pickupStart: string; // 첫 픽업 시각
  manager: string;
  seats: number; // 차량 정원
  durationMin: number; // 예상 소요(분)
  distanceKm: number; // 예상 거리
}

/** 폴리라인·마커에 쓰는 실제 색값 — CityBalance 계열 (그린/블루/오렌지) */
export const ROUTE_COLORS: Record<VehicleRoute["colorVar"], string> = {
  "route-1": "#3ba949",
  "route-2": "#42a5f5",
  "route-3": "#ffa726",
};

export interface DispatchScenario {
  id: number;
  label: string;
  note: string; // 시나리오 전환 시 표시할 조건 설명
  vehicles: VehicleRoute[];
}

export const DISPATCH_SCENARIOS: DispatchScenario[] = [
  {
    id: 1,
    label: "기본 배차",
    note: "8건 · 시간대 ±40분 · 방면 클러스터링 → 3대",
    vehicles: [
      {
        vehicle: "1호차",
        hospital: "건국대충주병원",
        elderIds: ["e1", "e2", "e3"], // 산척·산척·엄정 → 건대
        colorVar: "route-1",
        pickupStart: "08:20",
        manager: "이수진 매니저",
        seats: 4,
        durationMin: 52,
        distanceKm: 28.4,
        path: [
          [37.084, 128.001], [37.077, 127.994], [37.082, 127.97],
          [37.089, 127.948], [37.05, 127.935], [37.01, 127.93],
          [36.99, 127.926], [36.965, 127.925],
        ],
      },
      {
        vehicle: "2호차",
        hospital: "충주의료원",
        elderIds: ["e4", "e5", "e7"], // 소태·소태·노은 → 의료원
        colorVar: "route-2",
        pickupStart: "08:40",
        manager: "박지훈 매니저",
        seats: 4,
        durationMin: 58,
        distanceKm: 33.1,
        path: [
          [37.075, 127.872], [37.082, 127.881], [37.052, 127.86],
          [37.052, 127.791], [37.02, 127.85], [37.0, 127.9],
          [36.99, 127.94], [36.985, 127.955],
        ],
      },
      {
        vehicle: "3호차",
        hospital: "건국대충주병원",
        elderIds: ["e6", "e8"], // 앙성·앙성 → 건대
        colorVar: "route-3",
        pickupStart: "08:10",
        manager: "김도현 매니저",
        seats: 4,
        durationMin: 47,
        distanceKm: 30.6,
        path: [
          [37.119, 127.812], [37.111, 127.821], [37.07, 127.83],
          [37.02, 127.86], [36.99, 127.9], [36.965, 127.925],
        ],
      },
    ],
  },
  {
    id: 2,
    label: "재배차 — 취소 1건 반영",
    note: "박순덕 어르신 당일 취소 가정 → 7건을 3대로 재편성, 1호차 경로 단축",
    vehicles: [
      {
        vehicle: "1호차",
        hospital: "건국대충주병원",
        elderIds: ["e1", "e3"],
        colorVar: "route-1",
        pickupStart: "08:35",
        manager: "이수진 매니저",
        seats: 4,
        durationMin: 41,
        distanceKm: 22.0,
        path: [
          [37.084, 128.001], [37.089, 127.948], [37.05, 127.935],
          [37.01, 127.93], [36.965, 127.925],
        ],
      },
      {
        vehicle: "2호차",
        hospital: "충주의료원",
        elderIds: ["e4", "e5", "e7"],
        colorVar: "route-2",
        pickupStart: "08:40",
        manager: "박지훈 매니저",
        seats: 4,
        durationMin: 58,
        distanceKm: 33.1,
        path: [
          [37.075, 127.872], [37.082, 127.881], [37.052, 127.86],
          [37.052, 127.791], [37.02, 127.85], [37.0, 127.9],
          [36.99, 127.94], [36.985, 127.955],
        ],
      },
      {
        vehicle: "3호차",
        hospital: "건국대충주병원",
        elderIds: ["e6", "e8"],
        colorVar: "route-3",
        pickupStart: "08:10",
        manager: "김도현 매니저",
        seats: 4,
        durationMin: 47,
        distanceKm: 30.6,
        path: [
          [37.119, 127.812], [37.111, 127.821], [37.07, 127.83],
          [37.02, 127.86], [36.99, 127.9], [36.965, 127.925],
        ],
      },
    ],
  },
];

/** 접수 라이브 피드 — 배차 전(idle) 지도 위 티커에 롤링되는 접수 이벤트 (연출) */
export const INTAKE_FEED = [
  { time: "07:12", icon: "🔄", text: "정기 배차 5건 자동 등록 (투석 주3회 스케줄)" },
  { time: "07:31", icon: "📱", text: "자녀 앱 예약 — 박순덕 어르신 (보호자 박미영)" },
  { time: "07:44", icon: "📞", text: "전화 접수 — 최복례 어르신 (콜센터 김민지 입력)" },
  { time: "07:58", icon: "📞", text: "전화 접수 — 정갑수 어르신 (콜센터 김민지 입력)" },
  { time: "08:03", icon: "📱", text: "자녀 앱 예약 — 한만식 어르신 (보호자 한지원)" },
  { time: "08:05", icon: "🧑‍⚕️", text: "매니저 3명 배정 대기 — 이수진·박지훈·김도현" },
];

/** 관제 라이브 피드 — 배차 확정 후 지도 위 티커에 롤링되는 이벤트 (연출) */
export const LIVE_FEED = [
  { time: "08:10", icon: "🚐", text: "3호차 운행 시작 — 앙성면 방면" },
  { time: "08:14", icon: "📍", text: "윤정희 어르신 픽업 완료 (앙성면)" },
  { time: "08:20", icon: "🚐", text: "1호차 운행 시작 — 산척면 방면" },
  { time: "08:23", icon: "📍", text: "김영자 어르신 픽업 완료 (산척면)" },
  { time: "08:31", icon: "📞", text: "전화 접수 1건 — 내일 예약 등록 (콜센터)" },
  { time: "08:40", icon: "🚐", text: "2호차 운행 시작 — 소태면 방면" },
  { time: "08:47", icon: "📍", text: "정갑수 어르신 픽업 완료 (소태면)" },
  { time: "09:02", icon: "🏥", text: "1호차 건국대충주병원 도착 — 접수 진행" },
];

/** 단위경제 — 어르신 3인 합승 1회 운행 기준 (사업계획서 §4) */
export const UNIT_ECONOMICS = {
  revenue: 105_000, // 바우처 3.5만 × 3인
  cost: 92_000, // 차량 4만 + 매니저 4h × 1.3만
  margin: 13_000,
  soloVehiclesNeeded: 8, // 1:1이면 8대
  pooledVehiclesNeeded: 3, // 합승이면 3대
};

// ───────────────────────────── 동행 체크리스트 ─────────────────────────────

export const TRIP_STEPS = ["픽업", "접수", "진료", "수납", "약국", "귀가"] as const;
export type TripStep = (typeof TRIP_STEPS)[number];

// ───────────────────────────── AI 리포트 (고정 문안) ─────────────────────────────
//
// 실제 생성 없음 — 타이핑 효과로 출력한다. (PROTOTYPE_PLAN §5.2)
// 의료행위·소견 없이 처방전·수납증 기반 사실 전달로 한정 (의료법 방어 논리)

export const REPORT_TEXT = `[${TODAY} · 김영자 어르신 진료 동행 리포트]

■ 진료과   건국대충주병원 신장내과
■ 담당의   신장내과 외래 담당의
■ 소요시간 09:20 픽업 → 12:40 귀가 (총 3시간 20분)

■ 진행 내용
혈액투석 정기 치료를 예정대로 받으셨습니다.
투석 중 특이 반응은 없었고, 종료 후 혈압은 정상 범위였습니다.

■ 처방 변경
기존 혈압약 용량이 조정되었습니다. (수납증·처방전 기준)
약국에서 수령 완료하여 어르신께 전달드렸습니다.

■ 다음 예약
2026년 7월 25일 (토) 오전 9시 30분 — 정기 배차 자동 등록 완료

■ 동행매니저 메모
오늘은 계단 이용이 어려워 보이셨습니다.
다음 회차부터 휠체어 동행으로 전환하겠습니다.

※ 본 리포트는 처방전·수납증에 기재된 사실을 전달하는 것이며,
의료적 소견이나 진단을 포함하지 않습니다.`;

/**
 * 오늘 리포트의 구조화 데이터 — /g/report 에서 카드·타임라인으로 렌더링.
 * REPORT_TEXT(원문 문자열)는 /m/trip 타이핑 연출용으로 유지한다.
 */
export const REPORT_DETAIL = {
  manager: "이수진 매니저",
  hospital: "건국대충주병원 신장내과",
  chips: [
    { icon: "✅", label: "투석 정상 완료" },
    { icon: "💊", label: "처방 변경 있음" },
    { icon: "⏱", label: "총 3시간 20분" },
  ],
  timeline: [
    { time: "09:20", label: "자택 픽업", note: "1호차 · 합승 2인과 함께" },
    { time: "09:41", label: "병원 접수", note: "신장내과 외래" },
    { time: "10:05", label: "혈액투석", note: "특이 반응 없음 · 종료 후 혈압 정상" },
    { time: "12:10", label: "수납 · 약국", note: "처방약 수령 완료" },
    { time: "12:40", label: "자택 귀가", note: "다음 회차 안내드림" },
  ],
  prescription: "기존 혈압약 용량이 조정되었습니다 (수납증·처방전 기준). 약국에서 수령해 어르신께 전달드렸습니다.",
  managerNote: "오늘은 계단 이용이 어려워 보이셨습니다. 다음 회차부터 휠체어 동행으로 전환하겠습니다.",
  next: { date: "7월 25일 (토)", time: "09:30", where: "건국대충주병원 신장내과" },
};

/** 이번 달 동행 요약 — /g/report 하단 통계 */
export const MONTHLY_CARE = [
  { value: "12회", label: "이번 달 동행" },
  { value: "12/12", label: "정기 일정 완료" },
  { value: "3시간 5분", label: "평균 소요" },
];

/** 매니저 음성 메모 원문 — 녹음 연출 후 "이 말을 AI가 아래처럼 정리했다"는 대비를 보여주는 용도 */
export const VOICE_MEMO_PREVIEW =
  "어… 김영자 어르신 투석 잘 받으셨고요, 끝나고 혈압도 괜찮았어요. 혈압약이 좀 바뀌었다고 하셔서 약국에서 받아서 드렸습니다. 아 그리고 오늘 계단 오르실 때 많이 힘들어하셔서, 다음부터는 휠체어 챙기는 게 좋을 것 같아요.";

// ───────────────────────────── 자녀 채널 — 실시간 추적 ─────────────────────────────
//
// /g 화면의 차량 마커가 이 경로를 2초 간격으로 이동한다. (PROTOTYPE_PLAN §5.3)

export const GUARDIAN_ELDER_ID = "e1"; // 자녀 화면의 주인공: 김영자 어르신 (보호자 김성호)

export interface TrackPhase {
  label: "픽업 완료" | "이동 중" | "병원 도착" | "진료 중" | "귀가 중";
  /** 이 단계가 시작되는 경로 인덱스 */
  fromIndex: number;
}

export const TRACK = {
  /** 1호차 경로 재사용 — 자택 → 건대충주병원 */
  path: DISPATCH_SCENARIOS[0].vehicles[0].path,
  phases: [
    { label: "픽업 완료", fromIndex: 0 },
    { label: "이동 중", fromIndex: 1 },
    { label: "병원 도착", fromIndex: 7 },
  ] satisfies TrackPhase[],
  vehicle: "1호차",
  manager: "이수진 매니저",
  etaText: "09:12 병원 도착 예정",
};

// ───────────────────────────── 매니저 채널 — 오늘 운행 ─────────────────────────────

/** 관제 → 매니저 공지 (연출) */
export const MANAGER_NOTICES = [
  { time: "07:55", icon: "🚧", text: "산척면 19번 국도 부분 공사 — 엄정면 방면 우회 권장" },
  { time: "08:02", icon: "📞", text: "김영자 어르신 보호자 요청: 픽업 시 현관 벨 대신 전화 주세요" },
];

// ───────────────────────────── 자녀 채널 — 정기 일정·멤버십 ─────────────────────────────

/** 정기 배차 자동 등록 — 다가오는 통원 일정 (자녀 앱 /g/schedule) */
export const UPCOMING_RIDES = [
  { date: "7월 25일 (토)", time: "09:30", hospital: "건국대충주병원", department: "신장내과", auto: true },
  { date: "7월 28일 (화)", time: "09:30", hospital: "건국대충주병원", department: "신장내과", auto: true },
  { date: "7월 30일 (목)", time: "09:30", hospital: "건국대충주병원", department: "신장내과", auto: true },
  { date: "8월 4일 (화)", time: "14:00", hospital: "충주의료원", department: "정형외과", auto: false },
];

/** 부모님 케어 멤버십 — 사업계획서 B2C 상품 (월 19,900원) */
export const MEMBERSHIP = {
  name: "부모님 케어 멤버십",
  price: "월 19,900원",
  benefits: ["정기 배차 우선권", "진료 리포트 무제한", "복약 알림"],
  active: true,
  since: "2026년 3월",
};

// ───────────────────────────── 지자체 대시보드 ─────────────────────────────

export const DASHBOARD = {
  /** 읍·면별 월간 통원 수요 (건) */
  wardDemand: [
    { ward: "산척면", count: 86 },
    { ward: "엄정면", count: 74 },
    { ward: "소태면", count: 61 },
    { ward: "앙성면", count: 57 },
    { ward: "노은면", count: 43 },
    { ward: "주덕읍", count: 38 },
  ],
  stats: [
    { label: "누적 운행", value: "1,284건", sub: "파일럿 개시 후 7개월" },
    { label: "이동 취약지 커버율", value: "72%", sub: "북부 5개 읍·면 기준" },
    { label: "평균 대기시간 단축", value: "-38분", sub: "버스 환승 대비" },
    { label: "병원 노쇼 감소", value: "-63%", sub: "정기 통원 환자 기준" },
  ],
  /** 질환별 이용 구성 (%) — 스택 바 */
  conditionMix: [
    { label: "혈액투석", pct: 42, color: "#3ba949" },
    { label: "재활치료", pct: 31, color: "#42a5f5" },
    { label: "만성질환 진료", pct: 27, color: "#ffa726" },
  ],
  /** 바우처 예산 집행 현황 — 지자체 이동지원 예산 */
  budget: {
    total: "1.2억 원",
    spent: "7,420만 원",
    pct: 61,
    perTrip: "3.5만 원",
    note: "2026년 교통약자 이동지원 바우처 · 건당 정산",
  },
  /** 사회적 성과 — B2G 심사 포인트 */
  social: [
    { icon: "🏥", value: "12명", label: "치료 중단 위기 어르신의 통원 재개", sub: "투석 7 · 재활 5" },
    { icon: "🧑‍⚕️", value: "10명", label: "지역 일자리 창출 (동행매니저)", sub: "청년 6 · 경력단절여성 4" },
    { icon: "💬", value: "4.8점", label: "보호자 만족도 (5점 만점)", sub: "리포트 수신 자녀 설문" },
  ],
  /** 월별 운행 추이 */
  monthly: [
    { month: "1월", count: 96 },
    { month: "2월", count: 118 },
    { month: "3월", count: 152 },
    { month: "4월", count: 171 },
    { month: "5월", count: 204 },
    { month: "6월", count: 249 },
    { month: "7월", count: 294 },
  ],
};
