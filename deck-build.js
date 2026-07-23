const P = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const p = new P();

// 프로토타입 캡처 (있으면 삽입, 없으면 플레이스홀더)
const SHOT = (n) => {
  const f = path.join(__dirname, n);
  return fs.existsSync(f) ? f : null;
};
// 이미지 + 라운드 프레임 (그림자로 카드처럼)
function shot(s, file, x, y, w, h) {
  if (!file) return false;
  s.addImage({ path: file, x, y, w, h, rounding: false, shadow: { type: "outer", color: "000000", blur: 14, offset: 3, angle: 90, opacity: 0.18 } });
  return true;
}
p.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
p.author = "모시GO";
p.title = "모시GO 사업계획서";

// ─── 프로토타입 디자인 시스템 승계 ───
const C = {
  green: "6AB34D",
  greenDk: "3BA949",
  greenLt: "DCEDC8",
  greenPale: "F1F8EC",
  orange: "FFA726",
  red: "EF5350",
  ink: "212121",
  sub: "757575",
  faint: "9E9E9E",
  line: "E0E0E0",
  bg: "F5F5F5",
  white: "FFFFFF",
  deep: "1B3A22", // 다크 슬라이드용 딥그린
};
const F = { h: "Calibri", b: "Calibri" };
const W = 13.333, H = 7.5;
const M = 0.7; // 좌우 여백

const sh = () => ({ type: "outer", color: "000000", blur: 12, offset: 2, angle: 90, opacity: 0.1 });

// 공통: 라이트 슬라이드 헤더
function head(s, kicker, title, num) {
  s.background = { color: C.bg };
  s.addText(kicker, { x: M, y: 0.42, w: 8, h: 0.28, fontSize: 12, bold: true, color: C.green, fontFace: F.b, charSpacing: 1.6, margin: 0 });
  s.addText(title, { x: M, y: 0.72, w: 11.2, h: 0.62, fontSize: 30, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  if (num) s.addText(String(num), { x: W - 1.3, y: 0.42, w: 0.7, h: 0.3, fontSize: 11, color: C.faint, align: "right", fontFace: F.b, margin: 0 });
}
// 카드
function card(s, x, y, w, h, fill) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: fill || C.white }, line: { color: C.line, width: 0.5 }, shadow: sh() });
}
// 넘버 뱃지
function badge(s, x, y, t, bg, fg) {
  s.addShape(p.ShapeType.roundRect, { x, y, w: 0.42, h: 0.42, rectRadius: 0.1, fill: { color: bg || C.greenLt } });
  s.addText(t, { x, y, w: 0.42, h: 0.42, fontSize: 14, bold: true, color: fg || C.greenDk, align: "center", valign: "middle", fontFace: F.b, margin: 0 });
}

/* ═══ 1. 표지 ═══ */
{
  const s = p.addSlide();
  s.background = { color: C.deep };
  s.addShape(p.ShapeType.roundRect, { x: 8.6, y: -1.4, w: 6.4, h: 6.4, rectRadius: 3.2, fill: { color: C.green, transparency: 82 } });
  s.addShape(p.ShapeType.roundRect, { x: 10.4, y: 3.6, w: 4.4, h: 4.4, rectRadius: 2.2, fill: { color: C.greenDk, transparency: 88 } });

  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.55, w: 2.5, h: 0.42, rectRadius: 0.21, fill: { color: C.green } });
  s.addText("2026 충주 지역정주형 특화산업", { x: M, y: 1.55, w: 2.5, h: 0.42, fontSize: 10.5, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F.b, margin: 0 });

  s.addText("모시GO", { x: M, y: 2.25, w: 8, h: 1.35, fontSize: 68, bold: true, color: C.white, fontFace: F.h, margin: 0 });
  s.addText("병원 가는 길, 끝까지 책임집니다", { x: M, y: 3.62, w: 8.6, h: 0.55, fontSize: 24, bold: true, color: C.greenLt, fontFace: F.h, margin: 0 });
  s.addText("충주 읍·면 어르신을 위한 AI 합승 통원 배차 플랫폼", { x: M, y: 4.24, w: 8.6, h: 0.4, fontSize: 15, color: "B9CDB0", fontFace: F.b, margin: 0 });

  s.addShape(p.ShapeType.line, { x: M, y: 5.25, w: 4.2, h: 0, line: { color: C.green, width: 1.5 } });
  s.addText([
    { text: "투자 단계  ", options: { color: "8FA98B", fontSize: 11 } },
    { text: "Seed", options: { color: C.white, fontSize: 11, bold: true } },
    { text: "        발행일  ", options: { color: "8FA98B", fontSize: 11 } },
    { text: "2026. 07", options: { color: C.white, fontSize: 11, bold: true } },
  ], { x: M, y: 5.5, w: 8, h: 0.32, fontFace: F.b, margin: 0 });
  s.addNotes("모시GO — 충주 읍·면 어르신의 정기 통원을 AI 합승 배차로 왕복 책임지고 자녀에게 보고하는 지역 모빌리티 플랫폼입니다.");
}

/* ═══ 2. 목차 ═══ */
{
  const s = p.addSlide();
  head(s, "CONTENTS", "목차", "02");
  const items = [
    ["01", "회사 개요", "한 줄 정의 · 핵심 투자 포인트"],
    ["02", "문제 & 시장", "문제 정의 · Why Now · TAM/SAM/SOM"],
    ["03", "솔루션 & 제품", "솔루션 · 핵심 기술 · 경쟁 우위 · 파트너십"],
    ["04", "BM & 성과", "수익 모델 · 유닛 이코노믹스 · 실증 · 로드맵"],
    ["05", "팀 & Appendix", "팀 구성 · Q&A 백업"],
  ];
  items.forEach((it, i) => {
    const y = 1.75 + i * 1.02;
    card(s, M, y, 11.9, 0.86);
    s.addText(it[0], { x: M + 0.35, y, w: 0.8, h: 0.86, fontSize: 22, bold: true, color: C.greenLt, valign: "middle", fontFace: F.h, margin: 0 });
    s.addText(it[1], { x: M + 1.2, y, w: 3.4, h: 0.86, fontSize: 16, bold: true, color: C.ink, valign: "middle", fontFace: F.h, margin: 0 });
    s.addText(it[2], { x: M + 4.6, y, w: 7, h: 0.86, fontSize: 12.5, color: C.sub, valign: "middle", fontFace: F.b, margin: 0 });
  });
}

/* ═══ 3. 회사 소개 ═══ */
{
  const s = p.addSlide();
  head(s, "01 · COMPANY", "회사 소개 — 우리는 무엇을 하는가", "03");

  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.6, w: 11.9, h: 1.55, rectRadius: 0.14, fill: { color: C.deep } });
  s.addText("ONE-LINE PITCH", { x: M + 0.4, y: 1.78, w: 4, h: 0.26, fontSize: 10, bold: true, color: C.green, charSpacing: 1.4, fontFace: F.b, margin: 0 });
  s.addText([
    { text: "모시GO는 충주 읍·면 어르신의 정기 통원을 " , options: { color: C.white } },
    { text: "진료 시간에 맞춘 AI 합승 배차", options: { color: C.greenLt, bold: true } },
    { text: "로 왕복 책임지고,", options: { color: C.white } },
    { text: "\n그 과정을 ", options: { color: C.white } },
    { text: "자녀에게 보고", options: { color: C.greenLt, bold: true } },
    { text: "하는 지역 모빌리티 플랫폼입니다.", options: { color: C.white } },
  ], { x: M + 0.4, y: 2.14, w: 11.1, h: 0.86, fontSize: 16.5, bold: true, fontFace: F.h, lineSpacing: 27, margin: 0 });

  const cols = [
    ["해결하는 문제", "읍·면 어르신이 이동 수단이 없어\n투석·재활 등 정기 치료를 중단·포기한다", C.red],
    ["제공하는 가치", "진료 예약 기준 왕복 배차 + 자녀 보고\n어르신은 부르지 않고, 자녀는 연차를 안 낸다", C.green],
    ["지금의 단계", "3개 채널 프로토타입 완성\n북부 3면 파일럿 준비 (차량 2~3대·월 200건)", C.orange],
  ];
  cols.forEach((c, i) => {
    const x = M + i * 4.02;
    card(s, x, 3.4, 3.82, 1.75);
    s.addShape(p.ShapeType.roundRect, { x: x + 0.28, y: 3.66, w: 0.16, h: 0.16, rectRadius: 0.08, fill: { color: c[2] } });
    s.addText(c[0], { x: x + 0.56, y: 3.58, w: 3, h: 0.32, fontSize: 13, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
    s.addText(c[1], { x: x + 0.28, y: 3.98, w: 3.3, h: 1.05, fontSize: 11.5, color: C.sub, fontFace: F.b, lineSpacing: 17, margin: 0 });
  });

  const info = [["설립", "2026"], ["소재지", "충북 충주시"], ["업종", "지역 모빌리티 · 헬스케어"], ["투자 단계", "Seed"]];
  info.forEach((v, i) => {
    const x = M + i * 3.0;
    s.addText(v[0], { x, y: 5.42, w: 2.8, h: 0.24, fontSize: 10, color: C.faint, fontFace: F.b, margin: 0 });
    s.addText(v[1], { x, y: 5.66, w: 2.8, h: 0.3, fontSize: 13.5, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  });
}

/* ═══ 4. 핵심 투자 포인트 ═══ */
{
  const s = p.addSlide();
  head(s, "01 · COMPANY", "핵심 투자 포인트", "04");
  const pts = [
    ["01", "이동이 무료인데도 치료를 포기하는 시장", "충주는 65세 이상에게 버스·콜버스가 월 15회 무료(2025.5~). 그럼에도 읍·면 어르신은 투석을 포기한다. 문제는 가격이 아니라 구조 — 진료 시간을 보장하고 왕복을 책임지는 주체가 없다."],
    ["02", "합승이 만드는 유일한 지방 원가 구조", "1:1 이동은 지방에서 원가가 붕괴한다(8명 태우면 −13.6만). 3인 합승으로 운행당 +4.3만 원 마진. AI 배차는 기술 과시가 아니라 수익모델 그 자체다."],
    ["03", "예산이 이미 열려 있는 B2G", "100원택시(건당 보조), 화천 병원셔틀(조례 운송), 춘천 병원동행(시간당 지원) — 행정 선례가 전국에 있다. 새 예산이 아니라 기존 형식에 얹는다."],
    ["04", "자산도 인력도 무겁지 않다", "차량은 운수사 임차(면허·자산 부담 없음), 동행 인력 없음(관리자 1명이 하루 수십 건) — 확산 시 인건비가 선형으로 늘지 않는다."],
  ];
  pts.forEach((v, i) => {
    const x = M + (i % 2) * 6.05, y = 1.62 + Math.floor(i / 2) * 2.42;
    card(s, x, y, 5.85, 2.18);
    badge(s, x + 0.32, y + 0.3, v[0]);
    s.addText(v[1], { x: x + 0.9, y: y + 0.3, w: 4.75, h: 0.5, fontSize: 14.5, bold: true, color: C.ink, fontFace: F.h, lineSpacing: 19, margin: 0 });
    s.addText(v[2], { x: x + 0.32, y: y + 0.92, w: 5.2, h: 1.1, fontSize: 11.5, color: C.sub, fontFace: F.b, lineSpacing: 17, margin: 0 });
  });
}

/* ═══ 5. 문제 정의 ═══ */
{
  const s = p.addSlide();
  head(s, "02 · PROBLEM", "충주에서 세 가지 공백이 겹친다", "05");
  const gaps = [
    ["교통 공백", "버스로는 진료 시간을 못 맞춘다", ["읍·면 → 거점병원 환승 포함 1시간+", "배차 간격 1~2시간", "콜버스는 호출형 — 시간 보장 없음", "장애인콜택시 법정 25대 중 19대"], C.red],
    ["의료 공백", "이동이 안 되면 치료를 포기한다", ["투석 주 3회 · 재활 주 2~3회", "정기 통원이 생존과 직결", "매 회차 이동 문제 반복", "→ 치료 중단·포기 발생"], C.orange],
    ["돌봄 공백", "자녀는 수도권에 있다", ["통원일마다 연차 또는 어르신 혼자", "진료 내용·처방 변경을", "가족 누구도 모른다", "→ 죄책감만 남는다"], C.green],
  ];
  gaps.forEach((g, i) => {
    const x = M + i * 4.02;
    card(s, x, 1.62, 3.82, 2.95);
    s.addShape(p.ShapeType.roundRect, { x: x + 0.28, y: 1.9, w: 1.5, h: 0.34, rectRadius: 0.17, fill: { color: g[3] } });
    s.addText(g[0], { x: x + 0.28, y: 1.9, w: 1.5, h: 0.34, fontSize: 11.5, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F.b, margin: 0 });
    s.addText(g[1], { x: x + 0.28, y: 2.36, w: 3.3, h: 0.5, fontSize: 14, bold: true, color: C.ink, fontFace: F.h, lineSpacing: 19, margin: 0 });
    s.addText(g[2].map((t, j) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: j < g[2].length - 1 } })),
      { x: x + 0.28, y: 2.92, w: 3.3, h: 1.5, fontSize: 11, color: C.sub, fontFace: F.b, paraSpaceAfter: 5, margin: 0 });
  });

  s.addShape(p.ShapeType.roundRect, { x: M, y: 4.82, w: 11.9, h: 0.85, rectRadius: 0.12, fill: { color: C.greenPale }, line: { color: C.greenLt, width: 1 } });
  s.addText([
    { text: "결국, 충주 읍·면 어르신 약 1.8만 명이 ", options: { color: C.ink } },
    { text: "\"병원에 갈 수는 있지만 제때 갈 수는 없는\"", options: { color: C.greenDk, bold: true } },
    { text: " 상태에 놓여 있습니다.", options: { color: C.ink } },
  ], { x: M + 0.4, y: 4.82, w: 11.1, h: 0.85, fontSize: 15, bold: true, valign: "middle", fontFace: F.h, margin: 0 });

  s.addText("수도권 동행 서비스는 대중교통을 전제로 설계되어 지방에 내려올 수 없다. 충주의 문제는 '동행'이 아니라 이동 × 시간 × 보고의 결합 문제다.",
    { x: M, y: 5.82, w: 11.9, h: 0.36, fontSize: 11.5, italic: true, color: C.faint, fontFace: F.b, margin: 0 });
}

/* ═══ 6. Why Now ═══ */
{
  const s = p.addSlide();
  head(s, "02 · PROBLEM", "Why Now — 지금이 적기인 이유", "06");
  const rows = [
    ["수요", "초고령사회 진입 완료", "충주시 65세 이상 25.2% (2025.8) · 충북 22.7%로 전국 평균(20.8%) 상회 · 인접 괴산군 43.0%"],
    ["정책", "지자체 예산이 열리고 있다", "서울 병원안심동행 3년 누적 4.5만 건·만족도 92.9% → 전국 벤치마킹 · 춘천 등 지방 도시도 집행 시작 · 국토부 DRT 가이드라인(2025.12)이 운수사 상생모델 권장"],
    ["공백", "아무도 지방에 없다", "위드메이트·케어네이션·케어닥에 수백억 투자 — 전원 대도시·매칭 모델·차량 미포함. 충주 읍·면에는 매칭할 동행인 풀조차 없다"],
  ];
  rows.forEach((r, i) => {
    const y = 1.62 + i * 1.28;
    card(s, M, y, 11.9, 1.12);
    s.addShape(p.ShapeType.roundRect, { x: M + 0.3, y: y + 0.3, w: 0.95, h: 0.52, rectRadius: 0.1, fill: { color: C.greenLt } });
    s.addText(r[0], { x: M + 0.3, y: y + 0.3, w: 0.95, h: 0.52, fontSize: 13, bold: true, color: C.greenDk, align: "center", valign: "middle", fontFace: F.h, margin: 0 });
    s.addText(r[1], { x: M + 1.45, y: y + 0.2, w: 4, h: 0.36, fontSize: 15, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
    s.addText(r[2], { x: M + 1.45, y: y + 0.56, w: 10, h: 0.5, fontSize: 11.5, color: C.sub, fontFace: F.b, lineSpacing: 16, margin: 0 });
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.62, w: 11.9, h: 0.92, rectRadius: 0.12, fill: { color: C.deep } });
  s.addText("서울에서 시장성이 검증됐고, 지방에는 아무도 없으며, 지자체 예산은 이미 열려 있습니다.", { x: M + 0.4, y: 5.74, w: 11.1, h: 0.34, fontSize: 14.5, bold: true, color: C.white, fontFace: F.h, margin: 0 });
  s.addText("저희는 그 셋이 만나는 지점에 있습니다.", { x: M + 0.4, y: 6.08, w: 11.1, h: 0.34, fontSize: 14.5, bold: true, color: C.greenLt, fontFace: F.h, margin: 0 });
}

/* ═══ 7. 시장 규모 ═══ */
{
  const s = p.addSlide();
  head(s, "02 · MARKET", "시장 규모 — TAM · SAM · SOM", "07");
  const tam = [
    ["TAM", "연 3,000억+", "전국 비수도권 시·군", C.deep, C.white],
    ["SAM", "연 250억", "충북 북부권 5개 시·군", C.greenDk, C.white],
    ["SOM", "연 5~6억", "충주시 1읍 12면 (3년)", C.green, C.white],
  ];
  tam.forEach((t, i) => {
    const y = 1.65 + i * 1.15, w = 4.4 - i * 0.75;
    s.addShape(p.ShapeType.roundRect, { x: M, y, w, h: 1.0, rectRadius: 0.12, fill: { color: t[3] } });
    s.addText(t[0], { x: M + 0.3, y: y + 0.12, w: 1.2, h: 0.3, fontSize: 12, bold: true, color: C.greenLt, fontFace: F.b, margin: 0 });
    s.addText(t[1], { x: M + 0.3, y: y + 0.42, w: w - 0.6, h: 0.44, fontSize: 20, bold: true, color: t[4], fontFace: F.h, margin: 0 });
    s.addText(t[2], { x: M + w + 0.25, y: y + 0.3, w: 6.15 - w, h: 0.4, fontSize: 11, color: C.sub, valign: "middle", fontFace: F.b, margin: 0 });
  });

  card(s, 7.6, 1.65, 5.0, 3.65);
  s.addText("Bottom-up 검증 · 북부 3면", { x: 7.9, y: 1.88, w: 4.4, h: 0.32, fontSize: 13, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const flow = [
    ["인구 6,900명", "산척 2,157 · 엄정 2,954 · 소태 1,820"],
    ["고령 2,090명", "65세 이상 30% 적용"],
    ["대상 230명", "투석 11 · 재활 31 · 외래 188"],
    ["월 673건", "질환별 통원 빈도 적용"],
    ["월 130~200건", "1년차 침투율 20~30%"],
  ];
  flow.forEach((f, i) => {
    const y = 2.32 + i * 0.58;
    s.addShape(p.ShapeType.roundRect, { x: 7.9, y, w: 0.28, h: 0.28, rectRadius: 0.14, fill: { color: i === 4 ? C.orange : C.greenLt } });
    s.addText(f[0], { x: 8.32, y: y - 0.03, w: 2.1, h: 0.3, fontSize: 12, bold: true, color: i === 4 ? C.orange : C.ink, fontFace: F.h, margin: 0 });
    s.addText(f[1], { x: 10.35, y: y - 0.01, w: 2.1, h: 0.28, fontSize: 9, color: C.faint, fontFace: F.b, margin: 0 });
  });

  s.addText("SOM이 작아 보일 수 있으나 \"지자체 1곳 실증 매출\"로는 정직한 숫자입니다. 성장 논리는 \"충주에서 검증해 전국 시군으로 복제\"입니다.",
    { x: M, y: 5.55, w: 11.9, h: 0.36, fontSize: 11.5, italic: true, color: C.faint, fontFace: F.b, margin: 0 });
  s.addText("출처: 행안부 주민등록(2025.8) · 충주시 인구통계(2025.7) · 대한신장학회 등록사업(2024, 인구 10만 명당 157명)",
    { x: M, y: 5.95, w: 11.9, h: 0.3, fontSize: 9, color: C.faint, fontFace: F.b, margin: 0 });
}

/* ═══ 8. 솔루션 ═══ */
{
  const s = p.addSlide();
  head(s, "03 · SOLUTION", "이렇게 해결합니다", "08");
  const st = [
    ["01", "부르지 않는다, 등록한다", "진료 일정을 등록해두면 매 회차 자동 배차.\n투석 주 3회 = 캘린더"],
    ["02", "진료 시간에서 역산해 묶는다", "AI가 새벽 5시에 시간대(±40분)·방면 클러스터링.\n10시 진료 → 09:20 픽업, 문 앞에서 병원 정문까지"],
    ["03", "왕복이 닫히고 자녀에게 전달된다", "차량이 병원에 상주 → 진료 종료 후 5분 내 탑승.\n탑승·도착·지연·귀가 매 순간 푸시 알림"],
  ];
  st.forEach((v, i) => {
    const y = 1.62 + i * 1.12;
    card(s, M, y, 7.0, 1.0);
    badge(s, M + 0.28, y + 0.29, v[0]);
    s.addText(v[1], { x: M + 0.86, y: y + 0.16, w: 5.9, h: 0.3, fontSize: 13.5, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
    s.addText(v[2], { x: M + 0.86, y: y + 0.46, w: 5.9, h: 0.48, fontSize: 10.5, color: C.sub, fontFace: F.b, lineSpacing: 14, margin: 0 });
  });

  // Before → After 표
  card(s, 8.0, 1.62, 2.98, 3.46);
  s.addText("Before → After", { x: 8.24, y: 1.8, w: 2.6, h: 0.3, fontSize: 12, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const ba = [["예약", "매번 호출", "일정 등록"], ["픽업", "승강장", "문 앞"], ["시간", "도착 유동", "역산 보장"], ["귀가", "재호출", "병원 상주"], ["가족", "정보 없음", "푸시+리포트"]];
  ba.forEach((b, i) => {
    const y = 2.22 + i * 0.56;
    s.addText(b[0], { x: 8.24, y, w: 0.62, h: 0.26, fontSize: 9.5, bold: true, color: C.faint, fontFace: F.b, margin: 0 });
    s.addText(b[1], { x: 8.24, y: y + 0.24, w: 1.2, h: 0.26, fontSize: 9.5, color: C.faint, strike: true, fontFace: F.b, margin: 0 });
    s.addText("→ " + b[2], { x: 9.44, y: y + 0.24, w: 1.5, h: 0.26, fontSize: 9.5, bold: true, color: C.greenDk, fontFace: F.b, margin: 0 });
  });

  // 자녀 앱 실제 화면
  const okG = shot(s, SHOT("cap-guardian-c.png"), 11.18, 1.62, 1.45, 2.97);
  if (!okG) card(s, 11.18, 1.62, 1.45, 2.97);
  s.addText("자녀 앱", { x: 11.18, y: 4.68, w: 1.45, h: 0.26, fontSize: 9.5, bold: true, color: C.sub, align: "center", fontFace: F.b, margin: 0 });

  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.3, w: 11.93, h: 0.98, rectRadius: 0.12, fill: { color: C.greenPale }, line: { color: C.greenLt, width: 1 } });
  s.addText("자녀에게 가는 알림 (통원 1회 4~5건)", { x: M + 0.35, y: 5.42, w: 5, h: 0.28, fontSize: 10.5, bold: true, color: C.greenDk, fontFace: F.b, margin: 0 });
  s.addText([
    { text: "내일 09:20 통원 예정  →  탑승 09:22  →  병원 도착 09:43  →  ", options: { color: C.sub } },
    { text: "진료가 길어지고 있습니다 · 차량 대기 중", options: { color: C.orange, bold: true } },
    { text: "  →  자택 도착 12:40", options: { color: C.sub } },
  ], { x: M + 0.35, y: 5.74, w: 11.2, h: 0.36, fontSize: 11, fontFace: F.b, margin: 0 });
  s.addNotes("네 번째 알림이 핵심 — 어르신이 병원에서 지체되는 순간이 자녀에게 가장 불안한 시간인데, 기존 수단은 이때 아무 정보도 주지 않는다.");
}

/* ═══ 9. 제품 — AI 배차 Before/After (실제 화면) ═══ */
{
  const s = p.addSlide();
  head(s, "03 · PRODUCT", "AI 합승 배차 — 실제 동작 화면", "09");

  const bw = 5.6, bh = 3.14; // 1440x808 비율
  const yImg = 1.72;
  const okB = shot(s, SHOT("cap-before-c.png"), M, yImg, bw, bh);
  const okA = shot(s, SHOT("cap-after-c.png"), M + 6.3, yImg, bw, bh);
  if (!okB) card(s, M, yImg, bw, bh);
  if (!okA) card(s, M + 6.3, yImg, bw, bh);

  // 라벨
  s.addShape(p.ShapeType.roundRect, { x: M, y: yImg - 0.42, w: 2.5, h: 0.34, rectRadius: 0.17, fill: { color: C.faint } });
  s.addText("BEFORE · 예약 8건 흩어짐", { x: M, y: yImg - 0.42, w: 2.5, h: 0.34, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F.b, margin: 0 });
  s.addShape(p.ShapeType.roundRect, { x: M + 6.3, y: yImg - 0.42, w: 2.5, h: 0.34, rectRadius: 0.17, fill: { color: C.greenDk } });
  s.addText("AFTER · 3개 노선으로 묶임", { x: M + 6.3, y: yImg - 0.42, w: 2.5, h: 0.34, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F.b, margin: 0 });

  // 중앙 화살표
  s.addShape(p.ShapeType.roundRect, { x: 6.42, y: yImg + 1.3, w: 0.5, h: 0.5, rectRadius: 0.25, fill: { color: C.orange } });
  s.addText("→", { x: 6.42, y: yImg + 1.3, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F.b, margin: 0 });

  // 하단 성과 스트립
  const st = [["차량 8대 → 3대", "−62.5%"], ["운행당 마진", "+4.3만 원"], ["사람이 누른 버튼", "0회"], ["배차 수립", "새벽 05:00 자동"]];
  st.forEach((v, i) => {
    const x = M + i * 3.0;
    s.addShape(p.ShapeType.roundRect, { x, y: 5.28, w: 2.82, h: 0.86, rectRadius: 0.1, fill: { color: C.greenPale } });
    s.addText(v[1], { x: x + 0.2, y: 5.38, w: 2.5, h: 0.4, fontSize: 17, bold: true, color: C.greenDk, fontFace: F.h, margin: 0 });
    s.addText(v[0], { x: x + 0.2, y: 5.78, w: 2.5, h: 0.28, fontSize: 9.5, color: C.sub, fontFace: F.b, margin: 0 });
  });
  s.addText("규칙 기반 최적화(시간대 ±40분 그룹핑 → 좌표 클러스터링 → 목적지·정원 분할). 운행 데이터가 축적되면 소요시간 예측 모델로 고도화합니다.",
    { x: M, y: 6.3, w: 11.9, h: 0.3, fontSize: 10, italic: true, color: C.faint, fontFace: F.b, margin: 0 });
  s.addNotes("실제 프로토타입 화면. 관제에는 실행 버튼이 없다 — AI가 새벽에 자동 수립한 결과를 재생만 한다.");
}

/* ═══ 9-2. 핵심 기능 4가지 ═══ */
{
  const s = p.addSlide();
  head(s, "03 · PRODUCT", "핵심 기능 — 모방 난이도", "10");
  const fx = [
    ["A", "AI 합승 배차 엔진 — 수익모델 그 자체", "진료 시각 역산 → 시간대(±40분) 클러스터링 → 방면 분할 → 정원 분할.\n1:1이면 8대, 합승하면 3대. 초기 규칙 기반 → 데이터 축적 후 예측 모델 고도화", C.green],
    ["B", "왕복 폐루프 — 병원 상주 배차", "충주 거점병원은 2곳뿐. 오전 등원을 마친 차량이 병원에 상주한다.\n목적지가 적다는 지방의 약점을 운영 강점으로 전환", C.greenDk],
    ["C", "푸시 알림 + AI 통원 리포트", "상태 전이마다 자녀 폰으로 자동 푸시. 귀가 후 AI가 리포트 발송.\n\"앱을 열어야 보이면 조회이고, 폰이 울려야 보고다\"", C.orange],
    ["D", "케어노트 데이터 자산", "휠체어·청력·주의사항이 기사에게 사전 전달되고 회차마다 누적된다.\n익명의 호출 기사와 우리를 가르는 것이 이 데이터", C.deep],
  ];
  fx.forEach((f, i) => {
    const y = 1.7 + i * 1.2;
    card(s, M, y, 7.35, 1.06);
    s.addShape(p.ShapeType.roundRect, { x: M + 0.28, y: y + 0.29, w: 0.48, h: 0.48, rectRadius: 0.24, fill: { color: f[3] } });
    s.addText(f[0], { x: M + 0.28, y: y + 0.29, w: 0.48, h: 0.48, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F.h, margin: 0 });
    s.addText(f[1], { x: M + 0.94, y: y + 0.16, w: 6.2, h: 0.32, fontSize: 13, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
    s.addText(f[2], { x: M + 0.94, y: y + 0.5, w: 6.2, h: 0.48, fontSize: 9.5, color: C.sub, fontFace: F.b, lineSpacing: 13, margin: 0 });
  });

  // 관리자 콘솔 (모바일 세로) + 지자체 대시보드 (데스크톱 가로)
  const ok = shot(s, SHOT("cap-manager-c.png"), 8.55, 1.7, 1.72, 3.53);
  if (!ok) card(s, 8.55, 1.7, 1.72, 3.53);
  s.addText("관리자 콘솔\n사무실에서 운행을 지킨다", { x: 8.35, y: 5.3, w: 2.12, h: 0.5, fontSize: 9.5, bold: true, color: C.sub, align: "center", fontFace: F.b, lineSpacing: 13, margin: 0 });

  const ok2 = shot(s, SHOT("cap-dash-c.png"), 10.62, 1.7, 2.01, 1.13);
  if (!ok2) card(s, 10.62, 1.7, 2.01, 1.13);
  s.addText("지자체 대시보드\nB2G 영업 무기", { x: 10.62, y: 2.9, w: 2.01, h: 0.5, fontSize: 9.5, bold: true, color: C.sub, align: "center", fontFace: F.b, lineSpacing: 13, margin: 0 });

  s.addShape(p.ShapeType.roundRect, { x: 10.62, y: 3.65, w: 2.01, h: 1.58, rectRadius: 0.1, fill: { color: C.greenPale } });
  s.addText("모두\n실제 구동\n화면입니다", { x: 10.62, y: 3.65, w: 2.01, h: 1.58, fontSize: 11, bold: true, color: C.greenDk, align: "center", valign: "middle", fontFace: F.h, lineSpacing: 17, margin: 0 });
}

/* ═══ 10. 경쟁 우위 ═══ */
{
  const s = p.addSlide();
  head(s, "03 · COMPETITION", "경쟁 구도 & 차별점", "11");
  const rows = [
    ["", "모시GO", "충주콜버스", "장애인콜택시", "민간 동행"],
    ["이동 제공", "O", "O", "△ 자격제한", "X 교통비별도"],
    ["진료 시간 보장", "O", "X", "△ 예약제", "—"],
    ["왕복 폐루프", "O", "X 편도호출", "△", "—"],
    ["보호자 보고(푸시)", "O", "X", "X", "△ 예약대행"],
    ["정기 통원 설계", "O", "X", "X", "X 단발"],
    ["지방 성립", "O", "O", "△ 공급부족", "X 공급·가격"],
  ];
  const tbl = rows.map((r, ri) => r.map((c, ci) => ({
    text: c,
    options: {
      fontSize: ri === 0 ? 11.5 : 11,
      bold: ri === 0 || ci === 1,
      color: ri === 0 ? (ci === 1 ? C.greenDk : C.ink) : ci === 1 ? C.greenDk : ci === 0 ? C.ink : C.sub,
      align: ci === 0 ? "left" : "center",
      fill: { color: ci === 1 ? C.greenPale : C.white },
      valign: "middle",
      fontFace: F.b,
    },
  })));
  s.addTable(tbl, { x: M, y: 1.62, w: 6.9, colW: [1.9, 1.35, 1.25, 1.2, 1.2], rowH: 0.36, border: { type: "solid", color: C.line, pt: 0.5 } });
  s.addText("O 제공   △ 제한적   X 제공 안 함   — 해당 없음", { x: M, y: 4.35, w: 6.9, h: 0.26, fontSize: 9, color: C.faint, fontFace: F.b, margin: 0 });

  card(s, 7.9, 1.62, 4.73, 2.7);
  s.addText("결정적 2축", { x: 8.2, y: 1.82, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  s.addText([
    { text: "① 의료 특화\n", options: { bold: true, color: C.greenDk, fontSize: 12.5 } },
    { text: "호출이 아니라 진료 예약이 배차 기준이다\n\n", options: { color: C.sub, fontSize: 10.5 } },
    { text: "② 보호자 채널\n", options: { bold: true, color: C.greenDk, fontSize: 12.5 } },
    { text: "기존 수단 중 가족에게 무언가를 '보내는' 것은 하나도 없다. 푸시 알림이 그 차이를 만든다", options: { color: C.sub, fontSize: 10.5 } },
  ], { x: 8.2, y: 2.2, w: 4.2, h: 1.95, fontFace: F.b, lineSpacing: 16, margin: 0 });

  const lim = [
    ["충주콜버스", "호출형 — 시간 미보장·편도·가족 정보 없음"],
    ["장애인콜택시", "등록 중증장애인 한정 · 대수 부족(19/25)"],
    ["공공 병원동행", "차량 없음(교통비 별도) · 1:1 인건비로 지방 확산 정체"],
    ["민간 동행 플랫폼", "매칭 모델 — 읍·면에 공급자 풀 없음 · 건당 5~10만"],
  ];
  lim.forEach((l, i) => {
    const y = 4.62 + i * 0.48;
    s.addText(l[0], { x: M, y, w: 2.3, h: 0.32, fontSize: 11, bold: true, color: C.ink, fontFace: F.b, margin: 0 });
    s.addText(l[1], { x: M + 2.4, y, w: 9.4, h: 0.32, fontSize: 11, color: C.sub, fontFace: F.b, margin: 0 });
  });
}

/* ═══ 11. 핵심 자원 & 파트너십 ═══ */
{
  const s = p.addSlide();
  head(s, "03 · RESOURCES", "소유하지 않고 결합한다", "12");
  const ps = [
    ["충주시", "주 고객", "예산 효율화 + 읍·면별 접근성 지표", "운영 위탁비 / 건당 정산", C.greenDk],
    ["지역 운수사", "이동 공급", "오전 유휴 차량에 고정 수요 계약 공급", "차량 임차 (면허·자산 부담 회피)", C.green],
    ["거점병원", "의료 공급", "노쇼 감소 · 재진율 유지", "모객 채널 + 일정 연동 + 주차 협조", C.orange],
    ["읍·면 네트워크", "수요 발굴", "지역 어르신 이동 편의", "오프라인 접수 채널 (이장·복지관)", C.deep],
  ];
  ps.forEach((v, i) => {
    const x = M + (i % 2) * 6.05, y = 1.62 + Math.floor(i / 2) * 1.55;
    card(s, x, y, 5.85, 1.35);
    s.addShape(p.ShapeType.roundRect, { x: x + 0.3, y: y + 0.28, w: 0.14, h: 0.72, rectRadius: 0.07, fill: { color: v[4] } });
    s.addText(v[0], { x: x + 0.62, y: y + 0.22, w: 2.6, h: 0.32, fontSize: 14, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
    s.addShape(p.ShapeType.roundRect, { x: x + 3.3, y: y + 0.25, w: 1.15, h: 0.28, rectRadius: 0.14, fill: { color: C.greenLt } });
    s.addText(v[1], { x: x + 3.3, y: y + 0.25, w: 1.15, h: 0.28, fontSize: 9.5, bold: true, color: C.greenDk, align: "center", valign: "middle", fontFace: F.b, margin: 0 });
    s.addText("주는 것 · " + v[2], { x: x + 0.62, y: y + 0.6, w: 5, h: 0.26, fontSize: 10, color: C.sub, fontFace: F.b, margin: 0 });
    s.addText("받는 것 · " + v[3], { x: x + 0.62, y: y + 0.86, w: 5, h: 0.26, fontSize: 10, color: C.sub, fontFace: F.b, margin: 0 });
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 4.82, w: 11.9, h: 1.35, rectRadius: 0.12, fill: { color: C.deep } });
  s.addText("우리가 직접 소유하는 것", { x: M + 0.4, y: 4.98, w: 5, h: 0.3, fontSize: 11, bold: true, color: C.green, fontFace: F.b, margin: 0 });
  const own = ["AI 배차 엔진 + 운행 데이터", "운영 관리자 1~2명", "케어노트 DB"];
  own.forEach((o, i) => {
    s.addText("· " + o, { x: M + 0.4 + i * 3.9, y: 5.34, w: 3.7, h: 0.32, fontSize: 12.5, bold: true, color: C.white, fontFace: F.b, margin: 0 });
  });
  s.addText("국토부 DRT 가이드라인(2025.12)이 기존 운수사업자와의 상생협력모델을 권장 — 운수사와 경쟁하지 않는 구조가 정부 방침과 일치",
    { x: M + 0.4, y: 5.74, w: 11.1, h: 0.3, fontSize: 10, color: "8FA98B", fontFace: F.b, margin: 0 });
}

/* ═══ 12. 비즈니스 모델 ═══ */
{
  const s = p.addSlide();
  head(s, "04 · BUSINESS MODEL", "3층 수익 구조 — 판매 단위는 '회차'", "13");
  const bm = [
    ["1층 · B2G", "1년차", "충주시", "이동지원 예산의 운영 플랫폼", "건당 3.5만 원", C.greenDk],
    ["2층 · B2C", "2년차~", "타지 자녀", "통원권 (구독 / 회수권)", "회차 단위", C.green],
    ["3층 · B2B", "2~3년차", "거점병원", "노쇼 감소 제휴", "월 정액", C.orange],
  ];
  bm.forEach((b, i) => {
    const y = 1.62 + i * 1.0;
    card(s, M, y, 7.0, 0.88);
    s.addShape(p.ShapeType.roundRect, { x: M + 0.28, y: y + 0.24, w: 1.15, h: 0.4, rectRadius: 0.1, fill: { color: b[5] } });
    s.addText(b[0], { x: M + 0.28, y: y + 0.24, w: 1.15, h: 0.4, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F.b, margin: 0 });
    s.addText(b[1], { x: M + 1.55, y: y + 0.3, w: 0.8, h: 0.28, fontSize: 10, color: C.faint, fontFace: F.b, margin: 0 });
    s.addText(b[2], { x: M + 2.35, y: y + 0.26, w: 1.3, h: 0.32, fontSize: 12, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
    s.addText(b[3], { x: M + 3.6, y: y + 0.28, w: 2.3, h: 0.32, fontSize: 10, color: C.sub, fontFace: F.b, margin: 0 });
    s.addText(b[4], { x: M + 5.5, y: y + 0.26, w: 1.4, h: 0.32, fontSize: 11, bold: true, color: b[5], align: "right", fontFace: F.b, margin: 0 });
  });

  card(s, 8.0, 1.62, 4.63, 2.88);
  s.addText("통원권 — 두 갈래", { x: 8.3, y: 1.82, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const tk = [
    ["정기 통원 구독", "투석·재활 등 고정 스케줄", "월 정액 12~13회 · 좌석 우선 · 휴진 이월", C.green],
    ["통원 회수권", "비정기 외래", "10회권 · 유효기간 6개월", C.orange],
  ];
  tk.forEach((t, i) => {
    const y = 2.3 + i * 1.05;
    s.addShape(p.ShapeType.roundRect, { x: 8.3, y, w: 4.05, h: 0.9, rectRadius: 0.1, fill: { color: C.greenPale } });
    s.addText(t[0], { x: 8.5, y: y + 0.08, w: 3.6, h: 0.28, fontSize: 12, bold: true, color: t[3], fontFace: F.h, margin: 0 });
    s.addText(t[1], { x: 8.5, y: y + 0.34, w: 3.6, h: 0.24, fontSize: 9.5, color: C.faint, fontFace: F.b, margin: 0 });
    s.addText(t[2], { x: 8.5, y: y + 0.56, w: 3.6, h: 0.28, fontSize: 9.5, color: C.sub, fontFace: F.b, margin: 0 });
  });

  s.addShape(p.ShapeType.roundRect, { x: M, y: 4.72, w: 11.93, h: 0.98, rectRadius: 0.12, fill: { color: C.greenPale }, line: { color: C.greenLt, width: 1 } });
  s.addText("푸시 알림 · 실시간 위치 · AI 리포트 · 정기 자동배차는 전 이용자 기본 포함", { x: M + 0.35, y: 4.84, w: 11.2, h: 0.32, fontSize: 13, bold: true, color: C.greenDk, fontFace: F.h, margin: 0 });
  s.addText("유료 옵션으로 분리하면 \"옵션 안 사면 그냥 콜택시\"가 되어 차별화 자체가 사라진다  ·  지불 흐름: 지자체 바우처 우선 차감 → 초과분만 자녀 결제",
    { x: M + 0.35, y: 5.18, w: 11.2, h: 0.34, fontSize: 10.5, color: C.sub, fontFace: F.b, margin: 0 });
}

/* ═══ 13. 유닛 이코노믹스 ═══ */
{
  const s = p.addSlide();
  head(s, "04 · UNIT ECONOMICS", "1:1이면 적자, 합승이면 흑자", "14");

  card(s, M, 1.62, 5.7, 2.2);
  s.addText("1회 운행 단위 경제 · 3인 합승", { x: M + 0.3, y: 1.8, w: 5, h: 0.28, fontSize: 12, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const ue = [["수입", "바우처 3.5만 × 3인", "+105,000", C.ink], ["비용", "차량 왕복 5.2만 + 운영 1.0만", "−62,000", C.sub]];
  ue.forEach((u, i) => {
    const y = 2.2 + i * 0.4;
    s.addText(u[0], { x: M + 0.3, y, w: 0.7, h: 0.3, fontSize: 11, bold: true, color: C.faint, fontFace: F.b, margin: 0 });
    s.addText(u[1], { x: M + 1.0, y, w: 3, h: 0.3, fontSize: 11, color: C.sub, fontFace: F.b, margin: 0 });
    s.addText(u[2], { x: M + 3.9, y, w: 1.5, h: 0.3, fontSize: 11.5, bold: true, color: u[3], align: "right", fontFace: F.b, margin: 0 });
  });
  s.addShape(p.ShapeType.line, { x: M + 0.3, y: 3.05, w: 5.1, h: 0, line: { color: C.line, width: 1 } });
  s.addText("운행당 마진", { x: M + 0.3, y: 3.18, w: 2.5, h: 0.4, fontSize: 13, bold: true, color: C.ink, valign: "middle", fontFace: F.h, margin: 0 });
  s.addText("+43,000원", { x: M + 3.0, y: 3.15, w: 2.4, h: 0.45, fontSize: 22, bold: true, color: C.greenDk, align: "right", fontFace: F.h, margin: 0 });

  // 1:1 vs 합승
  card(s, 6.75, 1.62, 5.88, 2.2);
  s.addText("같은 8명을 태울 때", { x: 7.05, y: 1.8, w: 5, h: 0.28, fontSize: 12, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const cmp = [["1:1 배차", "차량 8대", "−13.6만", C.red], ["AI 합승", "차량 3대 (−62.5%)", "+9.4만", C.greenDk]];
  cmp.forEach((c, i) => {
    const x = 7.05 + i * 2.85;
    s.addShape(p.ShapeType.roundRect, { x, y: 2.18, w: 2.6, h: 1.42, rectRadius: 0.1, fill: { color: i === 0 ? "FDEDEC" : C.greenPale } });
    s.addText(c[0], { x: x + 0.15, y: 2.3, w: 2.3, h: 0.28, fontSize: 11, bold: true, color: c[3], fontFace: F.b, margin: 0 });
    s.addText(c[1], { x: x + 0.15, y: 2.58, w: 2.3, h: 0.26, fontSize: 10, color: C.sub, fontFace: F.b, margin: 0 });
    s.addText(c[2], { x: x + 0.15, y: 2.92, w: 2.3, h: 0.5, fontSize: 20, bold: true, color: c[3], fontFace: F.h, margin: 0 });
  });

  // LTV/CAC
  card(s, M, 4.0, 11.93, 1.55);
  s.addText("LTV · 정기 통원 환자 기준", { x: M + 0.3, y: 4.18, w: 4, h: 0.28, fontSize: 12, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const lt = [["연 150회", "주 3회 × 52주"], ["215만 원", "연간 기여 마진"], ["3년+", "투석 지속 기간"], ["645만 원", "LTV"]];
  lt.forEach((l, i) => {
    const x = M + 0.3 + i * 2.35;
    s.addText(l[0], { x, y: 4.54, w: 2.2, h: 0.4, fontSize: 17, bold: true, color: i === 3 ? C.greenDk : C.ink, fontFace: F.h, margin: 0 });
    s.addText(l[1], { x, y: 4.94, w: 2.2, h: 0.26, fontSize: 9.5, color: C.faint, fontFace: F.b, margin: 0 });
  });
  s.addShape(p.ShapeType.roundRect, { x: M + 9.6, y: 4.2, w: 2.55, h: 1.15, rectRadius: 0.1, fill: { color: C.greenPale } });
  s.addText("CAC 매우 낮음", { x: M + 9.75, y: 4.34, w: 2.3, h: 0.28, fontSize: 11, bold: true, color: C.greenDk, fontFace: F.b, margin: 0 });
  s.addText("병원 투석실에 명단이\n이미 모여 있다", { x: M + 9.75, y: 4.62, w: 2.3, h: 0.6, fontSize: 9.5, color: C.sub, fontFace: F.b, lineSpacing: 13, margin: 0 });

  s.addText("위 금액은 공개 통계가 아니라 설계 가정입니다 — 파일럿에서 실제 계약으로 확정합니다", { x: M, y: 5.72, w: 11.9, h: 0.3, fontSize: 10, italic: true, color: C.faint, fontFace: F.b, margin: 0 });
}

/* ═══ 14. 실제 성과 ═══ */
{
  const s = p.addSlide();
  head(s, "04 · TRACTION", "지금까지 한 일 — 숫자로", "15");
  const kpi = [["6개", "개발 완료 화면"], ["8→3대", "AI 배차 검증 (−62.5%)"], ["6종", "분석한 기존 대안"], ["1읍 12면", "조사한 행정구역"], ["673건", "산출한 월 잠재 수요"], ["12건", "확보한 통계 출처"]];
  kpi.forEach((k, i) => {
    const x = M + (i % 3) * 4.02, y = 1.62 + Math.floor(i / 3) * 1.15;
    card(s, x, y, 3.82, 1.0);
    s.addText(k[0], { x: x + 0.3, y: y + 0.14, w: 3.2, h: 0.45, fontSize: 21, bold: true, color: C.greenDk, fontFace: F.h, margin: 0 });
    s.addText(k[1], { x: x + 0.3, y: y + 0.6, w: 3.2, h: 0.28, fontSize: 10.5, color: C.sub, fontFace: F.b, margin: 0 });
  });

  s.addText("프로토타입으로 증명한 3가지", { x: M, y: 4.05, w: 6, h: 0.32, fontSize: 14, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const pr = [["합승이 원가를 만든다", "8대 → 3대, 운행당 +4.3만 전환"], ["무인 배차가 가능하다", "관제 화면에 실행 버튼이 없다"], ["리포트가 자동 생성된다", "진료실에 안 들어가도 정보 전달"]];
  pr.forEach((v, i) => {
    const y2 = 4.48 + i * 0.62;
    s.addShape(p.ShapeType.roundRect, { x: M, y: y2, w: 7.35, h: 0.54, rectRadius: 0.1, fill: { color: C.greenPale } });
    s.addText(v[0], { x: M + 0.22, y: y2 + 0.05, w: 2.8, h: 0.44, fontSize: 11, bold: true, color: C.greenDk, valign: "middle", fontFace: F.b, margin: 0 });
    s.addText(v[1], { x: M + 3.1, y: y2 + 0.05, w: 4.1, h: 0.44, fontSize: 9.5, color: C.sub, valign: "middle", fontFace: F.b, margin: 0 });
  });
  // 자녀 리포트 실제 화면
  const okR = shot(s, SHOT("cap-report-c.png"), 8.5, 4.05, 1.6, 3.28);
  if (okR) s.addText("AI 통원 리포트 (실제 화면)", { x: 10.3, y: 4.3, w: 2.4, h: 0.6, fontSize: 10.5, bold: true, color: C.sub, fontFace: F.b, lineSpacing: 15, margin: 0 });

  s.addShape(p.ShapeType.roundRect, { x: M, y: 6.4, w: 7.35, h: 0.82, rectRadius: 0.12, fill: { color: C.deep } });
  s.addText([
    { text: "아직 매출은 없습니다. ", options: { color: "8FA98B" } },
    { text: "대신 \"왜 아무도 못 했는지\"를 6종 대안 분석으로 규명했고,\n\"우리는 왜 되는지\"를 배차 시뮬레이션으로 증명했습니다.", options: { color: C.white } },
  ], { x: M + 0.3, y: 6.4, w: 6.8, h: 0.82, fontSize: 10.5, bold: true, valign: "middle", fontFace: F.h, lineSpacing: 15, margin: 0 });
}

/* ═══ 15. 실증 계획 ═══ */
{
  const s = p.addSlide();
  head(s, "04 · PILOT", "실증 계획 — 앞으로 6개월", "16");

  card(s, M, 1.62, 5.7, 2.5);
  s.addText("파일럿 사양", { x: M + 0.3, y: 1.8, w: 4, h: 0.28, fontSize: 12.5, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const spec = [["대상", "북부 3면 (산척·엄정·소태)"], ["참여자", "1단계 20명 → 6개월 후 50~60명"], ["차량", "2~3대 (휠체어 대응 1대 포함)"], ["운행", "월 60건 → 월 170~200건"], ["인력", "운영 관리자 1명"]];
  spec.forEach((v, i) => {
    const y = 2.2 + i * 0.37;
    s.addText(v[0], { x: M + 0.3, y, w: 0.9, h: 0.28, fontSize: 10.5, bold: true, color: C.faint, fontFace: F.b, margin: 0 });
    s.addText(v[1], { x: M + 1.2, y, w: 4.2, h: 0.28, fontSize: 10.5, color: C.ink, fontFace: F.b, margin: 0 });
  });

  card(s, 6.75, 1.62, 5.88, 2.5);
  s.addText("참여자 구성 · 침투율 25%", { x: 7.05, y: 1.8, w: 4, h: 0.28, fontSize: 12.5, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const mix = [["", "잠재", "참여", "월 이용", "월 건수"], ["투석", "11명", "3명", "주 3회", "36건"], ["재활", "31명", "8명", "주 2회", "62건"], ["외래", "188명", "47명", "월 1.5회", "70건"], ["합계", "230명", "58명", "평균 2.9회", "약 170건"]];
  const mt = mix.map((r, ri) => r.map((c, ci) => ({
    text: c, options: { fontSize: 10, bold: ri === 0 || ri === 4, color: ri === 4 ? C.greenDk : ri === 0 ? C.faint : C.sub, align: ci === 0 ? "left" : "center", valign: "middle", fontFace: F.b },
  })));
  s.addTable(mt, { x: 7.05, y: 2.18, w: 5.3, colW: [0.9, 1.05, 1.05, 1.2, 1.1], rowH: 0.3, border: { type: "solid", color: C.line, pt: 0.5 } });

  s.addText("검증 KPI — 무엇을 증명할 것인가", { x: M, y: 4.35, w: 6, h: 0.32, fontSize: 13.5, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const kp = [["정시 도착률", "90%+"], ["귀가 대기", "15분 이하"], ["치료 중단율", "0%"], ["재이용률", "90%+"], ["리포트 만족도", "85%+"], ["운행당 마진", "+4.3만 실현"]];
  kp.forEach((k, i) => {
    const x = M + i * 1.99;
    s.addShape(p.ShapeType.roundRect, { x, y: 4.78, w: 1.82, h: 0.85, rectRadius: 0.1, fill: { color: C.white }, line: { color: C.greenLt, width: 1 } });
    s.addText(k[1], { x: x + 0.12, y: 4.88, w: 1.6, h: 0.36, fontSize: 14, bold: true, color: C.greenDk, align: "center", fontFace: F.h, margin: 0 });
    s.addText(k[0], { x: x + 0.12, y: 5.26, w: 1.6, h: 0.28, fontSize: 9, color: C.sub, align: "center", fontFace: F.b, margin: 0 });
  });
  s.addText("\"기술보다 수요 검증 먼저\" — 초기에는 앱 없이 전화·스프레드시트로 시작해 실제 수요를 확인한 뒤 제품화한다",
    { x: M, y: 5.85, w: 11.9, h: 0.3, fontSize: 10.5, italic: true, color: C.faint, fontFace: F.b, margin: 0 });
}

/* ═══ 16. 단기 Action Item ═══ */
{
  const s = p.addSlide();
  head(s, "04 · STRATEGY", "단기 실행 계획 — 무엇을 언제까지", "17");
  const acts = [
    ["2026.09", "충주시 협약", "스마트도시과·노인복지과 제안", "실증 협약 체결"],
    ["2026.09", "운수사 계약", "대일운수·엔씨비 오전 차량 임차", "차량 2~3대 확보"],
    ["2026.10", "병원 협조", "건국대충주병원 투석실·원무과", "환자 안내 + 주차 확보"],
    ["2026.10", "참여자 모집", "이장·복지관 + 병원 채널", "산척면 중심 20명 등록"],
    ["2026.11", "파일럿 개시", "전화·스프레드시트 운영", "첫 운행 실시"],
    ["2027.04", "성과 리포트", "6개 KPI 측정·정리", "충주시 확대 계약 제안"],
  ];
  acts.forEach((a, i) => {
    const y = 1.62 + i * 0.62;
    s.addShape(p.ShapeType.roundRect, { x: M, y, w: 1.25, h: 0.5, rectRadius: 0.1, fill: { color: i === 5 ? C.orange : C.greenLt } });
    s.addText(a[0], { x: M, y, w: 1.25, h: 0.5, fontSize: 10, bold: true, color: i === 5 ? C.white : C.greenDk, align: "center", valign: "middle", fontFace: F.b, margin: 0 });
    s.addText(a[1], { x: M + 1.45, y: y + 0.08, w: 2.2, h: 0.34, fontSize: 12.5, bold: true, color: C.ink, valign: "middle", fontFace: F.h, margin: 0 });
    s.addText(a[2], { x: M + 3.7, y: y + 0.1, w: 4.2, h: 0.3, fontSize: 10.5, color: C.sub, valign: "middle", fontFace: F.b, margin: 0 });
    s.addText("→ " + a[3], { x: M + 8.0, y: y + 0.1, w: 4.0, h: 0.3, fontSize: 10.5, bold: true, color: C.greenDk, valign: "middle", fontFace: F.b, margin: 0 });
  });

  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.5, w: 11.93, h: 0.92, rectRadius: 0.12, fill: { color: C.deep } });
  s.addText("6개월 후 (2027.04)", { x: M + 0.4, y: 5.62, w: 2.6, h: 0.3, fontSize: 11, bold: true, color: C.green, fontFace: F.b, margin: 0 });
  const g6 = [["누적 700건+", ""], ["월 200건", ""], ["이용자 50~60명", ""], ["월 매출 700만", ""]];
  g6.forEach((g, i) => {
    s.addText(g[0], { x: M + 3.1 + i * 2.25, y: 5.62, w: 2.2, h: 0.32, fontSize: 12.5, bold: true, color: C.white, fontFace: F.h, margin: 0 });
  });
  s.addText("이 8개 액션으로 \"지방에서 통원 배차가 원가와 함께 작동한다\"를 증명한다 — 그 데이터가 확대 계약과 병원 제휴를 여는 열쇠다",
    { x: M + 0.4, y: 5.98, w: 11.1, h: 0.32, fontSize: 10, color: "8FA98B", fontFace: F.b, margin: 0 });
}

/* ═══ 17. 확장 로드맵 ═══ */
{
  const s = p.addSlide();
  head(s, "04 · ROADMAP", "시장 확장 로드맵", "18");
  const rd = [
    ["NOW", "실증 준비", "북부 3면", "차량 2~3대", C.greenLt, C.greenDk],
    ["+6M", "B2G 검증", "북부 3면", "월 200건 · 매출 700만/월", C.greenLt, C.greenDk],
    ["+1Y", "권역 확산", "북부권 6개 면", "차량 5~6대 · 월 400~500건", C.green, C.white],
    ["+2Y", "충주 전역", "1읍 12면 전체", "차량 12~15대 · 연 매출 5억+", C.greenDk, C.white],
    ["+3Y", "전국 복제", "제천·괴산 → 타 도", "프랜차이즈형 플랫폼 공급", C.deep, C.white],
  ];
  rd.forEach((r, i) => {
    const x = M + i * 2.42;
    s.addShape(p.ShapeType.roundRect, { x, y: 1.7, w: 2.22, h: 0.5, rectRadius: 0.1, fill: { color: r[4] } });
    s.addText(r[0], { x, y: 1.7, w: 2.22, h: 0.5, fontSize: 12, bold: true, color: r[5], align: "center", valign: "middle", fontFace: F.h, margin: 0 });
    card(s, x, 2.32, 2.22, 1.9);
    s.addText(r[1], { x: x + 0.18, y: 2.48, w: 1.9, h: 0.3, fontSize: 12.5, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
    s.addText(r[2], { x: x + 0.18, y: 2.8, w: 1.9, h: 0.3, fontSize: 10, color: C.faint, fontFace: F.b, margin: 0 });
    s.addText(r[3], { x: x + 0.18, y: 3.14, w: 1.9, h: 0.9, fontSize: 10, color: C.sub, fontFace: F.b, lineSpacing: 14, margin: 0 });
    if (i < 4) s.addText("→", { x: x + 2.15, y: 2.9, w: 0.3, h: 0.3, fontSize: 14, color: C.greenLt, align: "center", fontFace: F.b, margin: 0 });
  });

  card(s, M, 4.45, 11.93, 1.65);
  s.addText("확장 논리 — 왜 순차적으로 열리는가", { x: M + 0.35, y: 4.62, w: 6, h: 0.3, fontSize: 12.5, bold: true, color: C.ink, fontFace: F.h, margin: 0 });
  const lg = [
    ["거점 · Now", "충주 북부 3면 — 가장 접근성 나쁜 권역\n= 여기서 되면 어디든 된다"],
    ["인접 · +12~18M", "충북 북부권 — 괴산 43.0% · 제천 28.5%\nSAM 연 250억"],
    ["신규 · +24M~", "전국 비수도권 군 82개 — 동일한 공백\nTAM 연 3,000억+"],
  ];
  lg.forEach((l, i) => {
    const x = M + 0.35 + i * 3.85;
    s.addText(l[0], { x, y: 5.0, w: 3.6, h: 0.28, fontSize: 11, bold: true, color: C.greenDk, fontFace: F.b, margin: 0 });
    s.addText(l[1], { x, y: 5.3, w: 3.6, h: 0.6, fontSize: 10, color: C.sub, fontFace: F.b, lineSpacing: 14, margin: 0 });
  });
  s.addText("복제 단위가 가볍다 — 신규 지역 진입에 필요한 것은 운수사 계약 + 관리자 1명 + 지자체 협약뿐이다",
    { x: M, y: 6.25, w: 11.9, h: 0.3, fontSize: 10.5, italic: true, color: C.faint, fontFace: F.b, margin: 0 });
}

/* ═══ 18. 팀 ═══ */
{
  const s = p.addSlide();
  head(s, "05 · TEAM", "팀 — 우리가 해낼 수 있는 이유", "19");
  const team = [["대표 / CEO", "〈이름〉", "도메인 전문성 · 지역 네트워크"], ["기술 / CTO", "〈이름〉", "AI 배차 · 플랫폼 개발"], ["운영 / COO", "〈이름〉", "지역 오퍼레이션 · 복지 행정"]];
  team.forEach((t, i) => {
    const x = M + i * 4.02;
    card(s, x, 1.7, 3.82, 2.3);
    s.addShape(p.ShapeType.roundRect, { x: x + 1.46, y: 1.95, w: 0.9, h: 0.9, rectRadius: 0.45, fill: { color: C.greenLt } });
    s.addText(t[1], { x: x + 0.2, y: 3.0, w: 3.4, h: 0.34, fontSize: 15, bold: true, color: C.ink, align: "center", fontFace: F.h, margin: 0 });
    s.addText(t[0], { x: x + 0.2, y: 3.32, w: 3.4, h: 0.28, fontSize: 10.5, bold: true, color: C.greenDk, align: "center", fontFace: F.b, margin: 0 });
    s.addText(t[2], { x: x + 0.2, y: 3.6, w: 3.4, h: 0.3, fontSize: 10, color: C.sub, align: "center", fontFace: F.b, margin: 0 });
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 4.3, w: 11.93, h: 1.5, rectRadius: 0.12, fill: { color: C.greenPale }, line: { color: C.greenLt, width: 1 } });
  s.addText("가장 강한 카드 — 충주 로컬 네트워크", { x: M + 0.4, y: 4.48, w: 6, h: 0.32, fontSize: 13, bold: true, color: C.greenDk, fontFace: F.h, margin: 0 });
  s.addText("이장·복지관·거점병원·지역 운수사와의 관계는 자본으로 단기간에 살 수 없는 자산입니다.\n대형 플랫폼이 지방에 진입하지 못하는 이유이자, 우리가 이 문제를 풀 적임자인 이유입니다.",
    { x: M + 0.4, y: 4.84, w: 11.1, h: 0.75, fontSize: 12, color: C.sub, fontFace: F.b, lineSpacing: 19, margin: 0 });
  s.addText("자문 · 파트너   |   지역 운수사 · 거점병원 · 충주시 관련 부서 · 사회적경제 조직", { x: M, y: 6.0, w: 11.9, h: 0.3, fontSize: 10.5, color: C.faint, fontFace: F.b, margin: 0 });
}

/* ═══ 19. 클로징 ═══ */
{
  const s = p.addSlide();
  s.background = { color: C.deep };
  s.addShape(p.ShapeType.roundRect, { x: -1.6, y: 4.2, w: 6.6, h: 6.6, rectRadius: 3.3, fill: { color: C.green, transparency: 88 } });
  s.addShape(p.ShapeType.roundRect, { x: 9.8, y: -1.8, w: 5.4, h: 5.4, rectRadius: 2.7, fill: { color: C.greenDk, transparency: 85 } });

  s.addText("충주는 어르신에게 이동이 이미 무료인 도시입니다.", { x: M, y: 2.0, w: 11.4, h: 0.6, fontSize: 26, bold: true, color: C.white, fontFace: F.h, margin: 0 });
  s.addText("그런데도 투석을 포기합니다.", { x: M, y: 2.68, w: 11.4, h: 0.6, fontSize: 26, bold: true, color: C.white, fontFace: F.h, margin: 0 });
  s.addText("저희가 파는 것은 이동이 아니라, 약속을 지키는 운영 체계입니다.", { x: M, y: 3.5, w: 11.4, h: 0.62, fontSize: 26, bold: true, color: C.greenLt, fontFace: F.h, margin: 0 });

  s.addShape(p.ShapeType.line, { x: M, y: 4.6, w: 3.4, h: 0, line: { color: C.green, width: 1.5 } });
  s.addText("모시GO", { x: M, y: 4.85, w: 4, h: 0.5, fontSize: 24, bold: true, color: C.white, fontFace: F.h, margin: 0 });
  s.addText("병원 가는 길, 끝까지 책임집니다", { x: M, y: 5.38, w: 6, h: 0.34, fontSize: 13, color: "8FA98B", fontFace: F.b, margin: 0 });
  s.addNotes("클로징 — 이동이 무료인데도 치료를 포기한다는 사실이 이 사업의 존재 이유다.");
}

p.writeFile({ fileName: "모시GO_사업계획서_1.pptx" }).then((f) => console.log("생성 완료:", f));
