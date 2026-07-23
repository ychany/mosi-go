import { chromium } from "playwright";
const B = "http://localhost:3000";
const b = await chromium.launch();

const HIDE = `
  [class*="map_control"], .nmap_control,
  div[id^="nmap"] > div:last-child > a { display:none !important; }
`;

// 데스크톱 (관제/대시보드) — 하단 여백 없이 꽉 차게
async function desk(path, file, wait, h = 830) {
  const p = await b.newPage({ viewport: { width: 1440, height: h }, deviceScaleFactor: 2 });
  await p.goto(B + path, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: HIDE });
  await p.waitForTimeout(wait);
  await p.screenshot({ path: file });
  await p.close();
  console.log("✓", file);
}

// 모바일 앱 셸
async function mob(path, file, wait, h = 1000) {
  const p = await b.newPage({ viewport: { width: 470, height: h }, deviceScaleFactor: 3 });
  await p.goto(B + path, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: HIDE });
  await p.waitForTimeout(wait);
  await p.screenshot({ path: file });
  await p.close();
  console.log("✓", file);
}

// 신규 추가분
await desk("/admin/dashboard", "d-dash.png", 3800);        // 지자체 대시보드 (크게)
await mob("/manager", "d-manager.png", 4200);              // 관리자 콘솔
await mob("/guardian", "d-guardian.png", 5200);            // 자녀 실시간 위치
await mob("/guardian/report", "d-report.png", 3200);       // 자녀 리포트
await mob("/guardian/schedule", "d-schedule.png", 3200);   // 정기 일정·통원권
await desk("/", "d-home.png", 2500);                       // 데모 홈 (3채널)

await b.close();
