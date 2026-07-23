import { chromium } from "playwright";

const B = "http://localhost:3000";
const b = await chromium.launch();

// 네이버 지도 컨트롤(N 로고 버튼) 숨김 — 캡처 미관용
const HIDE = `
  [class*="map_control"], .nmap_control, a[href*="naver.com"][class*="logo"],
  div[id^="nmap"] > div:last-child > a { display:none !important; }
`;

async function desktop(path, file, wait = 4500) {
  const p = await b.newPage({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 2 });
  await p.goto(B + path, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: HIDE });
  await p.waitForTimeout(wait);
  await p.screenshot({ path: file });
  await p.close();
  console.log("✓", file);
}

// 모바일 — 앱 셸 상단만(폰 화면 비율 9:19.5)
async function mobile(path, file, wait = 4500, h = 1020) {
  const p = await b.newPage({ viewport: { width: 480, height: h }, deviceScaleFactor: 3 });
  await p.goto(B + path, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: HIDE });
  await p.waitForTimeout(wait);
  await p.screenshot({ path: file }); // 뷰포트만 (fullPage 아님)
  await p.close();
  console.log("✓", file);
}

await desktop("/admin", "cap-before.png", 700);      // 배차 전
await desktop("/admin", "cap-after.png", 6500);      // 배차 후
await desktop("/admin/dashboard", "cap-dash.png", 3500);
await desktop("/manager", "cap-manager.png", 3500);
await mobile("/guardian", "cap-guardian.png", 5000);
await mobile("/guardian/report", "cap-report.png", 3000);

await b.close();
