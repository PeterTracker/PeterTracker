import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import type { Coords } from '../services/api';
import {
  AREA_LABELS,
  MAP_BOUNDS,
  PARKS_D,
  projectCoords,
  ROADS_D,
  STREET_LABELS,
  WATER_D,
} from '../data/forestHillsMap';
import { Avatar } from './ui';

type OfflineMapProps = {
  coords: Coords;
  tagLabel?: string;
  interactive?: boolean;
  recenterSignal?: number;
  zoom?: number;
  onZoomChange?: (z: number) => void;
};

export function OfflineMap({
  coords,
  tagLabel,
  interactive = true,
  recenterSignal = 0,
  zoom: controlledZoom,
  onZoomChange,
}: OfflineMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 390, h: 760 });
  const [internalZoom, setInternalZoom] = useState(interactive ? 0.85 : 0.72);
  const zoom = controlledZoom ?? internalZoom;

  const peter = projectCoords(coords.latitude, coords.longitude);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [smooth, setSmooth] = useState(true);

  const dragRef = useRef<{ active: boolean; sx: number; sy: number; px: number; py: number }>({
    active: false,
    sx: 0,
    sy: 0,
    px: 0,
    py: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth || 390, h: el.clientHeight || 760 });
    update();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setSmooth(true);
    setPan({ x: 0, y: 0 });
  }, [coords.latitude, coords.longitude, recenterSignal]);

  const setZoomSafe = (next: number) => {
    const clamped = Math.max(0.48, Math.min(2.0, Number(next.toFixed(2))));
    if (onZoomChange) onZoomChange(clamped);
    else setInternalZoom(clamped);
  };

  const clampPan = (px: number, py: number, z: number) => {
    const maxX = Math.max(120, (MAP_BOUNDS.width * z - size.w) / 2);
    const maxY = Math.max(120, (MAP_BOUNDS.height * z - size.h) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, px)),
      y: Math.max(-maxY, Math.min(maxY, py)),
    };
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setSmooth(false);
    dragRef.current = { active: true, sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;
    setPan(clampPan(dragRef.current.px + dx, dragRef.current.py + dy, zoom));
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (dragRef.current.active) {
      dragRef.current.active = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (!interactive) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setSmooth(true);
    setZoomSafe(zoom + delta);
  };

  const onDoubleClick = () => {
    if (!interactive) return;
    setSmooth(true);
    setZoomSafe(zoom >= 1.5 ? 0.85 : zoom + 0.35);
  };

  const tx = size.w / 2 - peter.x * zoom + pan.x;
  const ty = size.h / 2 - peter.y * zoom + pan.y;

  return (
    <div
      ref={containerRef}
      className={`offline-map ${interactive ? 'is-interactive' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
      role="img"
      aria-label="Mapa de Forest Hills, Queens com localização de Peter"
    >
      <div
        className={`offline-map-world ${smooth ? 'is-smooth' : ''}`}
        style={{
          width: MAP_BOUNDS.width,
          height: MAP_BOUNDS.height,
          transform: `translate3d(${tx}px, ${ty}px, 0) scale(${zoom})`,
        }}
      >
        <svg
          width={MAP_BOUNDS.width}
          height={MAP_BOUNDS.height}
          viewBox={`0 0 ${MAP_BOUNDS.width} ${MAP_BOUNDS.height}`}
          className="offline-map-svg"
        >
          {/* Base darkMapStyle (#0f1a2e) */}
          <rect x="0" y="0" width={MAP_BOUNDS.width} height={MAP_BOUNDS.height} fill="#0f1a2e" />

          {/* Parques reais (Forest Park, praças de Forest Hills) */}
          {PARKS_D && <path d={PARKS_D} fill="#0c1e2e" stroke="#11273b" strokeWidth="1" />}

          {/* Corpos d'água reais (#081022) */}
          {WATER_D && <path d={WATER_D} fill="#081022" />}

          {/* Vias reais de Forest Hills (casing escuro + traçado #14325a do darkMapStyle) */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {ROADS_D.service && <path d={ROADS_D.service} stroke="#112545" strokeWidth="2.2" />}

            {/* Ruas residenciais */}
            <path d={ROADS_D.local} stroke="#0a1324" strokeWidth="6.4" />
            <path d={ROADS_D.local} stroke="#14325a" strokeWidth="4.6" />

            {/* Ruas terciárias */}
            <path d={ROADS_D.tertiary} stroke="#0a1324" strokeWidth="8.5" />
            <path d={ROADS_D.tertiary} stroke="#163865" strokeWidth="6.4" />

            {/* Avenidas secundárias */}
            <path d={ROADS_D.secondary} stroke="#0a1324" strokeWidth="10.8" />
            <path d={ROADS_D.secondary} stroke="#183e70" strokeWidth="8.4" />

            {/* Avenidas principais (Queens Blvd, Union Tpke) */}
            <path d={ROADS_D.primary} stroke="#091222" strokeWidth="13.5" />
            <path d={ROADS_D.primary} stroke="#1b467e" strokeWidth="10.8" />

            {/* Vias expressas (Grand Central Pkwy, Jackie Robinson Pkwy) */}
            <path d={ROADS_D.motorway} stroke="#08101f" strokeWidth="16" />
            <path d={ROADS_D.motorway} stroke="#1e4f8f" strokeWidth="13" />
          </g>

          {/* Rótulos reais de ruas (#6b7a96 com stroke #0b1120 — darkMapStyle) */}
          <g className="offline-map-labels">
            {STREET_LABELS.map(([x, y, text, angle, tier], idx) => (
              <text
                key={idx}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${angle} ${x} ${y})`}
                fontSize={tier === 'motorway' || tier === 'primary' ? 13 : tier === 'secondary' ? 12 : 11}
                fontWeight={tier === 'motorway' || tier === 'primary' ? 600 : 500}
              >
                {text}
              </text>
            ))}
          </g>

          {/* Rótulos de bairros e parques */}
          <g className="offline-map-areas">
            {AREA_LABELS.map(([x, y, text], idx) => (
              <text key={idx} x={x} y={y} textAnchor="middle" fontSize={idx === 0 ? 18 : 14}>
                {text}
              </text>
            ))}
          </g>
        </svg>

        {/* Marcador fiel ao original (src/app/(tabs)/index.tsx e dashboard.tsx) */}
        <div
          className={`map-marker ${interactive ? 'is-full' : 'is-mini'}`}
          style={{
            left: peter.x,
            top: peter.y,
            transform: `translate(-50%, -50%) scale(${1 / zoom})`,
          }}
        >
          {interactive ? (
            <>
              <div className="map-halo" />
              <Avatar size={44} />
              {tagLabel && (
                <div className="map-tag">
                  <span>{tagLabel}</span>
                </div>
              )}
            </>
          ) : (
            <svg width="28" height="36" viewBox="0 0 28 36" className="mini-pin-svg" aria-hidden="true">
              <path
                d="M14 1C7.37 1 2 6.37 2 13c0 8.5 12 21.5 12 21.5S26 21.5 26 13C26 6.37 20.63 1 14 1z"
                fill="#e3263a"
                stroke="#0b1120"
                strokeWidth="2"
              />
              <circle cx="14" cy="13" r="4.5" fill="#ffffff" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
