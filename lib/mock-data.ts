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
    careNotes: ["보행 보조기 사용 — 트렁크 적재 필요", "승하차에 시간이 걸림", "커피 드리면 안 됨 (부정맥)"],
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
    careNotes: ["멀미 — 앞자리 배정", "승하차 시 팔 부축 필요"],
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
    careNotes: ["파킨슨 초기 — 서두르게 하지 않기", "진료과 2곳 연속 방문 — 귀가 배차 여유 필요"],
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

/**
 * 배차 수립 시각 — AI 엔진이 새벽에 자동으로 짜둔 시점. (PROTOTYPE_PLAN §1.8)
 * 관제 화면은 이 결과를 "만드는" 게 아니라 "조회"한다 — 모니터링 전용.
 */
export const AUTO_DISPATCH_AT = "오늘 05:00";

// ───────────────────────────── 배차 시나리오 ─────────────────────────────
//
// 관제의 배차 리플레이가 아래 시나리오를 순환 재생한다. (PROTOTYPE_PLAN §6.1)
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
  driver: string; // 운수사 소속 기사 (§1.9 — 동행 인력 없음)
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
        driver: "이수진 기사 (충주교통)",
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
        driver: "박지훈 기사 (충주교통)",
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
        driver: "김도현 기사 (한성운수)",
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
        driver: "이수진 기사 (충주교통)",
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
        driver: "박지훈 기사 (충주교통)",
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
        driver: "김도현 기사 (한성운수)",
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
  { time: "07:12", icon: "refresh", text: "정기 배차 5건 자동 등록 (투석 주3회 스케줄)" },
  { time: "07:31", icon: "app", text: "자녀 앱 예약 — 박순덕 어르신 (보호자 박미영)" },
  { time: "07:44", icon: "phone", text: "전화 접수 — 최복례 어르신 (콜센터 김민지 입력)" },
  { time: "07:58", icon: "phone", text: "전화 접수 — 정갑수 어르신 (콜센터 김민지 입력)" },
  { time: "08:03", icon: "app", text: "자녀 앱 예약 — 한만식 어르신 (보호자 한지원)" },
  { time: "08:05", icon: "vehicle", text: "운수사 차량 3대 배차 확정 — 충주교통 2 · 한성운수 1" },
];

/** 운영 관리자에게 배정된 오늘 업무 (PROTOTYPE_PLAN §1.9) */
export const OPERATOR_ASSIGNMENT = {
  assignedAt: "오늘 05:00",
  from: "AI 배차 엔진",
  note: "차량 3대 · 어르신 8명 · 정상 건은 무개입",
};

/** 관제 라이브 피드 — 배차 확정 후 지도 위 티커에 롤링되는 이벤트 (연출) */
export const LIVE_FEED = [
  { time: "08:10", icon: "vehicle", text: "3호차 운행 시작 — 앙성면 방면" },
  { time: "08:14", icon: "pin", text: "윤정희 어르신 픽업 완료 (앙성면)" },
  { time: "08:20", icon: "vehicle", text: "1호차 운행 시작 — 산척면 방면" },
  { time: "08:23", icon: "pin", text: "김영자 어르신 픽업 완료 (산척면)" },
  { time: "08:31", icon: "phone", text: "전화 접수 1건 — 내일 예약 등록 (콜센터)" },
  { time: "08:40", icon: "vehicle", text: "2호차 운행 시작 — 소태면 방면" },
  { time: "08:47", icon: "pin", text: "정갑수 어르신 픽업 완료 (소태면)" },
  { time: "09:02", icon: "hospital", text: "1호차 건국대충주병원 도착 — 접수 진행" },
];

/** 단위경제 — 어르신 3인 합승 1회 운행 기준 (사업계획서 §4) */
export const UNIT_ECONOMICS = {
  revenue: 105_000, // 바우처 3.5만 × 3인
  // §1.9 — 동행 인력 없음. 차량(운수사 위탁) + 관리자 인건비 분산분만 계상
  cost: 62_000, // 차량 왕복 5.2만 + 관리자 운영비 1.0만 (1인이 하루 수십 건 처리)
  margin: 43_000,
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

export const REPORT_TEXT = `[${TODAY} · 김영자 어르신 통원 리포트]

■ 병원      건국대충주병원 신장내과
■ 차량      1호차 · 이수진 기사 (충주교통)
■ 소요시간  09:20 자택 출발 → 12:40 자택 귀가 (총 3시간 20분)

■ 운행 확인 (기사 앱 체크)
09:20 자택 앞 탑승 · 09:45 병원 정문 하차
12:30 귀가 탑승 (병원 대기 차량) · 12:40 자택 앞 귀가 — 안전 귀가 확인 완료

■ 귀가 확인 통화 (12:45)
어르신께 직접 통화로 확인했습니다.
"오늘 잘 받았고, 약도 받아왔어요."

■ 처방 관련 (어르신 전달 내용)
혈압약 용량이 조정되었다고 하셨습니다.
약국 수령도 완료하신 것으로 확인했습니다.
정확한 내용은 처방전을 확인해 주세요.

■ 다음 예약
2026년 7월 25일 (토) 오전 9시 30분 — 정기 배차 자동 등록 완료

■ 관리자 메모
계단 오르내리기가 힘드셨다고 하셔서,
다음 회차는 문 앞 승하차를 기사에게 재안내했습니다.

※ 본 리포트는 기사의 승하차 확인 기록과 어르신과의 통화 내용을
정리한 것이며, 의료적 소견이나 진단을 포함하지 않습니다.`;

/**
 * 오늘 리포트의 구조화 데이터 — /g/report 에서 카드·타임라인으로 렌더링.
 * REPORT_TEXT(원문 문자열)는 /m/trip 타이핑 연출용으로 유지한다.
 */
export const REPORT_DETAIL = {
  operator: "김민지 관리자",
  driver: "이수진 기사",
  hospital: "건국대충주병원 신장내과",
  chips: [
    { icon: "check", label: "안전 귀가 완료" },
    { icon: "pill", label: "처방 변경 있음" },
    { icon: "clock", label: "총 3시간 20분" },
  ],
  /** 기사 앱 체크(pin) + 관리자 확인 통화(phone) — §1.9 리포트 원천 */
  timeline: [
    { time: "09:20", label: "자택 앞 탑승", note: "1호차 · 기사 확인", source: "기사 체크" },
    { time: "09:45", label: "병원 정문 하차", note: "건국대충주병원", source: "기사 체크" },
    { time: "12:30", label: "귀가 탑승", note: "병원 대기 차량 5분 내 탑승", source: "기사 체크" },
    { time: "12:40", label: "자택 앞 귀가", note: "기사 확인", source: "기사 체크" },
    { time: "12:45", label: "귀가 확인 통화", note: "어르신과 직접 통화", source: "관리자" },
  ],
  prescription: "기존 혈압약 용량이 조정되었습니다. 어르신이 받아오신 처방전·수납증 기준이며, 약국 수령도 확인했습니다.",
  operatorNote:
    "귀가 확인 통화에서 계단 오르내리기가 힘드셨다고 하셨습니다. 다음 회차는 문 앞 승하차를 기사에게 재안내했습니다.",
  next: { date: "7월 25일 (토)", time: "09:30", where: "건국대충주병원 신장내과" },
};

/** 이번 달 통원 요약 — /guardian/report 하단 통계 */
export const MONTHLY_CARE = [
  { value: "12회", label: "이번 달 통원" },
  { value: "12/12", label: "정기 일정 완료" },
  { value: "3시간 5분", label: "평균 소요" },
];

/**
 * 귀가 확인 통화 녹취 — 관리자가 어르신과 나눈 대화. (§1.9 리포트 원천)
 * "이 통화를 AI가 아래처럼 정리했다"는 대비를 보여주는 용도.
 */
export const CALL_TRANSCRIPT = [
  { who: "관리자" as const, text: "어머님, 오늘 진료 잘 받으셨어요?" },
  { who: "어르신" as const, text: "응 잘 받았어요. 약도 받아왔고." },
  { who: "관리자" as const, text: "혈압약이 바뀌었다고 들었는데 맞으세요?" },
  { who: "어르신" as const, text: "그렇대. 용량을 좀 줄인다고 하더라고." },
  { who: "관리자" as const, text: "불편하신 데는 없으셨어요?" },
  { who: "어르신" as const, text: "계단 오르내리는 게 좀 힘들었어. 다리가 후들거려서." },
];

// ───────────────────────────── 자녀 채널 — 실시간 추적 ─────────────────────────────
//
// /g 화면의 차량 마커가 이 경로를 2초 간격으로 이동한다. (PROTOTYPE_PLAN §5.3)

export const GUARDIAN_ELDER_ID = "e1"; // 자녀 화면의 주인공: 김영자 어르신 (보호자 김성호)

export interface TrackPhase {
  label: "이동 중" | "병원 도착" | "진료 중" | "귀가 중";
  /** 이 단계가 시작되는 경로 인덱스 */
  fromIndex: number;
  /** 자녀 화면에 노출할 부가 설명 */
  note: string;
}

export const TRACK = {
  /** 1호차 경로 재사용 — 자택 → 건대충주병원 */
  path: DISPATCH_SCENARIOS[0].vehicles[0].path,
  /**
   * 4단계 — 차량이 병원에 상주하므로 '진료 중'에도 차가 대기한다 (§1.12).
   * 어르신이 재호출할 필요가 없다는 것이 콜버스와의 결정적 차이다.
   */
  phases: [
    { label: "이동 중", fromIndex: 0, note: "1호차 · 3인 합승 운행" },
    { label: "병원 도착", fromIndex: 7, note: "정문 하차 · 접수 진행" },
    { label: "진료 중", fromIndex: 8, note: "차량이 병원 주차장에서 대기 중" },
    { label: "귀가 중", fromIndex: 9, note: "진료 종료 5분 내 탑승 완료" },
  ] satisfies TrackPhase[],
  vehicle: "1호차",
  driver: "이수진 기사",
  operator: "김민지 관리자",
  etaText: "09:12 병원 도착 예정",
};

// ───────────────────────────── 운영 관리자 채널 (§1.9) ─────────────────────────────
//
// 관리자는 사무실에서 일한다. 차에 타지 않고 병원에도 가지 않는다.
// 하루 업무: 예약 확인 콜 → 출발 알림 → 기사 체크 수신 → 귀가 확인 콜 → 리포트 발송.

/** 관리자 오늘 업무 큐 — 통화·확인 중심 */
export type TaskKind = "alert" | "check" | "report" | "cs";
export interface OperatorTask {
  id: string;
  time: string;
  kind: TaskKind;
  title: string;
  detail: string;
  elderId?: string;
  done: boolean;
}

export const OPERATOR_TASKS: OperatorTask[] = [
  { id: "t1", time: "08:20", kind: "check", title: "1호차 전원 탑승", detail: "기사 앱 체크 수신 · 자동 확인", done: true },
  { id: "t2", time: "08:47", kind: "check", title: "2호차 전원 탑승", detail: "기사 앱 체크 수신 · 자동 확인", done: true },
  { id: "t3", time: "08:52", kind: "alert", title: "미탑승 — 조순남 어르신", detail: "3호차 5분 대기 중 · 확인 전화 필요", elderId: "e8", done: false },
  { id: "t4", time: "09:47", kind: "check", title: "1호차 병원 도착", detail: "건국대충주병원 정문 하차", done: true },
  { id: "t5", time: "12:40", kind: "report", title: "리포트 검토·발송 — 김성호 님", detail: "AI 자동 생성 완료 · 검토 후 전송", elderId: "e1", done: false },
  { id: "t6", time: "13:10", kind: "cs", title: "보호자 문의 — 박미영 님", detail: "다음 주 수요일 일정 변경 요청", elderId: "e2", done: false },
];

/** 관리자 오늘 처리량 — 1인이 감당하는 규모를 보여주는 지표 (§1.9) */
export const OPERATOR_STATS = [
  { value: "8명", label: "담당 어르신" },
  { value: "3대", label: "관제 차량" },
  { value: "1건", label: "이상 대응" },
];

/** 관제·현장 알림 (연출) */
export const OPERATOR_NOTICES = [
  { time: "07:55", icon: "cone", text: "산척면 19번 국도 부분 공사 — 기사 3인에게 우회 안내 완료" },
  { time: "08:02", icon: "phone", text: "김영자 어르신 보호자 요청: 픽업 시 현관 벨 대신 전화" },
];

// ───────────────────────────── 자녀 채널 — 정기 일정·멤버십 ─────────────────────────────

/** 정기 배차 자동 등록 — 다가오는 통원 일정 (자녀 앱 /g/schedule) */
export const UPCOMING_RIDES = [
  { date: "7월 25일 (토)", time: "09:30", hospital: "건국대충주병원", department: "신장내과", auto: true },
  { date: "7월 28일 (화)", time: "09:30", hospital: "건국대충주병원", department: "신장내과", auto: true },
  { date: "7월 30일 (목)", time: "09:30", hospital: "건국대충주병원", department: "신장내과", auto: true },
  { date: "8월 4일 (화)", time: "14:00", hospital: "충주의료원", department: "정형외과", auto: false },
];

/**
 * 통원권 — 이동을 '회차'로 판다. (PROTOTYPE_PLAN §1.10)
 * 리포트·실시간 위치는 별도 상품이 아니라 전 이용자 기본 포함이다.
 */
export const PASS = {
  /** 현재 이용 중인 상품 — 김영자 어르신은 주 3회 투석이라 구독형 */
  type: "정기 통원 구독" as const,
  cycle: "투석 주 3회 (월·수·금)",
  included: 13, // 월 포함 회차
  used: 8,
  carriedOver: 2, // 지난달 휴진 이월분
  since: "2026년 3월",
  /** 바우처 차감 후 자녀가 실제 결제하는 금액 */
  voucherCovered: 10,
  selfPaid: 3,
};

/** 상품 비교 — 구독 vs 회수권 (§1.10 투트랙) */
export const PASS_PLANS = [
  {
    id: "subscription",
    name: "정기 통원 구독",
    target: "투석·재활 등 고정 스케줄",
    detail: "월 12~13회 포함 · 좌석 우선 확보 · 미사용분 자동 이월",
    recommended: true,
  },
  {
    id: "coupon",
    name: "통원 회수권",
    target: "만성질환 외래 등 비정기",
    detail: "10회권 선구매 · 유효기간 6개월 · 낱개보다 저렴",
    recommended: false,
  },
];

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
    { icon: "hospital", value: "12명", label: "치료 중단 위기 어르신의 통원 재개", sub: "투석 7 · 재활 5" },
    { icon: "manager", value: "8명", label: "지역 일자리 (관리자·기사)", sub: "운영 관리자 2 · 협력 운수사 기사 6" },
    { icon: "message", value: "4.8점", label: "보호자 만족도 (5점 만점)", sub: "리포트 수신 자녀 설문" },
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
