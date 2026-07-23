"use client";

import { useEffect, useRef, useState } from "react";
import type { LatLng } from "@/lib/mock-data";

/**
 * Naver Maps JS API v3 래퍼 — 프로토타입의 유일한 외부 의존성. (PROTOTYPE_PLAN §2)
 *
 * - 키(NEXT_PUBLIC_NCP_KEY_ID)가 없거나 스크립트 로드에 실패하면
 *   회색 플레이스홀더로 대체된다. 나머지 화면은 전부 정상 동작한다.
 * - markers / polylines가 바뀌면 오버레이를 전부 지우고 다시 그린다.
 *   (2초 간격 마커 이동 수준에서는 이 방식으로 충분하다)
 */

declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: HTMLElement, opts: object) => NaverMapObj;
        LatLng: new (lat: number, lng: number) => object;
        Marker: new (opts: object) => NaverOverlay;
        Polyline: new (opts: object) => NaverOverlay;
        Position: Record<string, unknown>;
      };
    };
  }
}
type NaverMapObj = object;
type NaverOverlay = { setMap: (m: NaverMapObj | null) => void };

export interface MapMarker {
  position: LatLng;
  /** 마커 원 색 (css color) */
  color?: string;
  label?: string;
  /** true면 큰 강조 마커 (병원·차량) */
  major?: boolean;
  /** 이모지 등 마커 안에 표시할 글자 */
  glyph?: string;
}

export interface MapPolyline {
  path: LatLng[];
  color: string;
}

interface Props {
  center?: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  className?: string;
}

const KEY = process.env.NEXT_PUBLIC_NCP_KEY_ID;

/**
 * 스크립트는 앱 전체에서 한 번만 로드한다.
 *
 * 네이버 클라우드 애플리케이션 세대에 따라 인증 파라미터가 다르다:
 * - 구형 (AI·NAVER API, Client ID 라벨이 X-NCP-APIGW-API-KEY-ID): ncpClientId
 * - 신형 (Maps 신규 콘솔): ncpKeyId
 * 구형을 먼저 시도하고, 인증 실패 콜백(navermap_authFailure)이 오면 신형으로 재시도한다.
 */
let scriptPromise: Promise<boolean> | null = null;

function tryLoad(param: "ncpClientId" | "ncpKeyId"): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const done = (ok: boolean) => {
      if (!settled) {
        settled = true;
        resolve(ok);
      }
    };
    // 인증 실패 시 네이버가 호출하는 전역 훅
    (window as unknown as { navermap_authFailure?: () => void }).navermap_authFailure = () => {
      console.warn(`[NaverMap] ${param} 인증 실패`);
      done(false);
    };
    const s = document.createElement("script");
    s.dataset.naverParam = param;
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${param}=${KEY}`;
    // 인증 실패 콜백은 로드 후 인증 요청이 끝나야 오므로 충분히 기다린 뒤 판정
    s.onload = () => setTimeout(() => done(!!window.naver?.maps), 1500);
    s.onerror = () => done(false); // 오프라인 등 — 플레이스홀더로 degradation
    document.head.appendChild(s);
  });
}

function loadScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.naver?.maps) return Promise.resolve(true);
  if (!KEY) return Promise.resolve(false);
  if (!scriptPromise) {
    scriptPromise = (async () => {
      // 신형(VPC Maps) 파라미터 우선 — 실패 시 구형으로 재시도
      if (await tryLoad("ncpKeyId")) return true;
      document.querySelectorAll("script[data-naver-param]").forEach((el) => el.remove());
      delete (window as { naver?: unknown }).naver;
      return tryLoad("ncpClientId");
    })();
  }
  return scriptPromise;
}

function markerHtml(m: MapMarker): string {
  const size = m.major ? 34 : 18;
  const color = m.color ?? "#6ab34d";
  const glyph = m.glyph
    ? `<span style="font-size:${m.major ? 16 : 10}px;line-height:1">${m.glyph}</span>`
    : "";
  const label = m.label
    ? `<div style="position:absolute;top:${size + 2}px;left:50%;transform:translateX(-50%);
        white-space:nowrap;font-size:11px;font-weight:700;color:#1c2b3a;
        background:rgba(255,255,255,.92);padding:1px 7px;border-radius:99px;
        box-shadow:0 1px 3px rgba(18,34,47,.25)">${m.label}</div>`
    : "";
  return `<div style="position:relative;width:${size}px;height:${size}px">
    <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};
      border:3px solid #fff;box-shadow:0 2px 6px rgba(18,34,47,.35);
      display:flex;align-items:center;justify-content:center">${glyph}</div>${label}</div>`;
}

export default function NaverMap({ center, zoom, markers = [], polylines = [], className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMapObj | null>(null);
  const overlaysRef = useRef<NaverOverlay[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    KEY ? "loading" : "unavailable",
  );

  // 지도 생성 (1회)
  useEffect(() => {
    let cancelled = false;
    loadScript().then((ok) => {
      if (cancelled || !containerRef.current) return;
      if (!ok || !window.naver) {
        setStatus("unavailable");
        return;
      }
      const { maps } = window.naver;
      mapRef.current = new maps.Map(containerRef.current, {
        center: new maps.LatLng(...(center ?? [37.03, 127.9])),
        zoom: zoom ?? 11,
        scaleControl: false,
        logoControlOptions: { position: maps.Position.BOTTOM_LEFT },
      });
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
    // 생성 후 center/zoom 변경은 지원하지 않는다 (프로토타입 범위)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 오버레이 갱신
  useEffect(() => {
    if (status !== "ready" || !window.naver || !mapRef.current) return;
    const { maps } = window.naver;
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [
      ...polylines.map(
        (p) =>
          new maps.Polyline({
            map: mapRef.current,
            path: p.path.map(([lat, lng]) => new maps.LatLng(lat, lng)),
            strokeColor: p.color,
            strokeWeight: 5,
            strokeOpacity: 0.85,
            strokeLineCap: "round",
            strokeLineJoin: "round",
          }),
      ),
      ...markers.map(
        (m) =>
          new maps.Marker({
            map: mapRef.current,
            position: new maps.LatLng(...m.position),
            icon: {
              content: markerHtml(m),
              anchor: { x: (m.major ? 34 : 18) / 2, y: (m.major ? 34 : 18) / 2 },
            },
          }),
      ),
    ];
  }, [status, markers, polylines]);

  return (
    <div ref={containerRef} className={`relative bg-[#e8ede5] ${className ?? ""}`}>
      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center text-sub text-sm px-6">
            <p className="font-bold mb-1">지도 영역</p>
            {status === "loading" ? (
              <p>지도를 불러오는 중…</p>
            ) : (
              <p>
                NEXT_PUBLIC_NCP_KEY_ID 설정 시<br />
                네이버 지도가 표시됩니다
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
