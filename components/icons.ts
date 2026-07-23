"use client";

/**
 * 앱 전역 아이콘 — lucide-react 단일 세트. (PROTOTYPE_PLAN §5)
 *
 * 이모지 대신 선 아이콘을 쓰는 이유: 색이 currentColor로 상속돼 그린 팔레트와
 * 통일되고, 플랫폼(OS)마다 모양이 달라지지 않는다. CDN이 아니라 번들에 포함되므로
 * 오프라인 원칙도 유지된다.
 */
export {
  // 브랜드·이동
  BusFront,
  MapPin,
  Navigation,
  Route,
  // 사람·역할
  User,
  UserRound,
  Users,
  HeartHandshake,
  // 의료
  Hospital,
  Stethoscope,
  Pill,
  Tablets,
  Activity,
  // 커뮤니케이션·기록
  Headset,
  Phone,
  PhoneCall,
  Smartphone,
  ClipboardList,
  FileText,
  Mic,
  Bell,
  Inbox,
  Share2,
  Send,
  // 일정·상태
  Calendar,
  CalendarCheck,
  Clock,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Check,
  Hourglass,
  TriangleAlert,
  Cone,
  Sparkles,
  Square,
  ChevronRight,
  // 지표
  LayoutDashboard,
  Home,
  MapPinned,
  Ticket,
  Wallet,
  Briefcase,
  MessageSquareHeart,
} from "lucide-react";

import {
  BusFront as _Bus,
  Check as _Check,
  Clock as _Clock,
  Cone as _Cone,
  Hospital as _Hospital,
  MapPin as _Pin,
  MessageSquareHeart as _Msg,
  Phone as _Phone,
  Tablets as _Pill,
  RefreshCw as _Refresh,
  Smartphone as _App,
  Stethoscope as _Steth,
  type LucideIcon,
} from "lucide-react";

/**
 * mock-data의 icon 키 → 컴포넌트 매핑.
 * 데이터에는 아이콘 컴포넌트 대신 문자열 키를 두어 서버 컴포넌트에서도 안전하게 다룬다.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  refresh: _Refresh,
  app: _App,
  phone: _Phone,
  manager: _Steth,
  vehicle: _Bus,
  pin: _Pin,
  hospital: _Hospital,
  cone: _Cone,
  check: _Check,
  pill: _Pill,
  clock: _Clock,
  message: _Msg,
};

/**
 * 네이버 지도 마커용 SVG 문자열 (lucide 원본 path 기반).
 * 마커는 HTML 문자열로 주입되므로 React 컴포넌트를 쓸 수 없다.
 */
const svg = (paths: string, size = 16) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/** 병원 십자 (lucide: plus) */
export const MARKER_HOSPITAL = svg('<path d="M5 12h14"/><path d="M12 5v14"/>');

/** 차량 (lucide: bus-front 단순화) */
export const MARKER_VEHICLE = svg(
  '<path d="M4 6 2 7"/><path d="M10 6h4"/><path d="m22 7-2-1"/><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 21v-2"/>',
);
