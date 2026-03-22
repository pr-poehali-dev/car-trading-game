import { useState } from 'react';

interface MapLocation {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  screen: string;
  color: string;
  description: string;
}

const LOCATIONS: MapLocation[] = [
  { id: 'shop', label: 'Магазин', emoji: '🏪', x: 52, y: 22, screen: 'shop', color: '#3b82f6', description: '2000 авто в наличии' },
  { id: 'market', label: 'Авторынок', emoji: '🤝', x: 75, y: 45, screen: 'market', color: '#f59e0b', description: 'Продавай с прибылью' },
  { id: 'dealers', label: 'Дилеры', emoji: '🏢', x: 28, y: 38, screen: 'dealers', color: '#a855f7', description: '100 автосалонов' },
  { id: 'junkyard', label: 'Свалка', emoji: '🗑️', x: 15, y: 72, screen: 'junkyard', color: '#6b7280', description: 'Убитые авто -85%' },
  { id: 'tuning', label: 'Тюнинг', emoji: '🔧', x: 62, y: 68, screen: 'tuning', color: '#22c55e', description: 'Прокачай своё авто' },
  { id: 'jobs', label: 'Работа', emoji: '💼', x: 40, y: 55, screen: 'jobs', color: '#ec4899', description: 'Заработай денег' },
  { id: 'garage', label: 'Гараж', emoji: '🚘', x: 82, y: 72, screen: 'garage', color: '#f97316', description: 'Твои машины' },
];

const ROADS = [
  // Главные дороги (горизонтальные)
  { x1: 0, y1: 35, x2: 100, y2: 35 },
  { x1: 0, y1: 65, x2: 100, y2: 65 },
  // Главные дороги (вертикальные)
  { x1: 35, y1: 0, x2: 35, y2: 100 },
  { x1: 65, y1: 0, x2: 65, y2: 100 },
  // Диагональные
  { x1: 0, y1: 0, x2: 35, y2: 35 },
  { x1: 65, y1: 35, x2: 100, y2: 65 },
  { x1: 35, y1: 65, x2: 65, y2: 100 },
];

const BLOCKS = [
  { x: 3, y: 3, w: 30, h: 30 },
  { x: 37, y: 3, w: 26, h: 30 },
  { x: 67, y: 3, w: 30, h: 30 },
  { x: 3, y: 37, w: 30, h: 26 },
  { x: 37, y: 37, w: 26, h: 26 },
  { x: 67, y: 37, w: 30, h: 26 },
  { x: 3, y: 67, w: 30, h: 30 },
  { x: 37, y: 67, w: 26, h: 30 },
  { x: 67, y: 67, w: 30, h: 30 },
];

interface CityMapProps {
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

export default function CityMap({ onNavigate, currentScreen }: CityMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredLoc = LOCATIONS.find(l => l.id === hovered);

  return (
    <div className="city-map-wrap">
      <div className="map-title">🗺️ Карта города</div>
      <div className="map-container">
        <svg viewBox="0 0 100 100" className="map-svg" preserveAspectRatio="xMidYMid meet">
          {/* Фон */}
          <rect width="100" height="100" fill="#0f1318" />

          {/* Кварталы */}
          {BLOCKS.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#161b24" rx="1" />
          ))}

          {/* Дороги */}
          {ROADS.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#232a38" strokeWidth="3" />
          ))}

          {/* Разметка дорог */}
          {ROADS.map((r, i) => (
            <line key={`dash-${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="#2d3748" strokeWidth="0.5" strokeDasharray="3 3" />
          ))}

          {/* Парки */}
          <rect x="4" y="4" width="10" height="10" fill="#14532d" rx="1" opacity="0.6" />
          <rect x="55" y="55" width="8" height="8" fill="#14532d" rx="1" opacity="0.6" />
          <text x="9" y="11" fontSize="5" textAnchor="middle">🌲</text>
          <text x="59" y="61" fontSize="4" textAnchor="middle">🌳</text>

          {/* Мелкие здания */}
          {[
            [5,38],[10,40],[5,50],[10,52],[5,57],[70,5],[75,5],[80,5],[70,15],[80,15],
            [38,5],[45,5],[55,5],[38,15],[55,15],[70,70],[75,70],[80,70],[70,80],[80,80],
          ].map(([x,y],i)=>(
            <rect key={`bld-${i}`} x={x} y={y} width="4" height="5" fill="#1e2535" rx="0.5" />
          ))}

          {/* Локации */}
          {LOCATIONS.map(loc => {
            const isActive = currentScreen === loc.screen;
            const isHov = hovered === loc.id;
            return (
              <g key={loc.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate(loc.screen)}
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Пульсирующий круг для активной */}
                {isActive && (
                  <circle cx={loc.x} cy={loc.y} r="6" fill={loc.color} opacity="0.2">
                    <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Hover glow */}
                {isHov && (
                  <circle cx={loc.x} cy={loc.y} r="7" fill={loc.color} opacity="0.15" />
                )}
                {/* Фон иконки */}
                <circle cx={loc.x} cy={loc.y} r={isActive || isHov ? "5.5" : "4.5"}
                  fill={isActive ? loc.color : '#1e2535'}
                  stroke={loc.color}
                  strokeWidth={isActive ? "0" : "0.8"}
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Эмодзи */}
                <text x={loc.x} y={loc.y + 1.8} fontSize="4.5" textAnchor="middle">{loc.emoji}</text>
                {/* Подпись */}
                <text x={loc.x} y={loc.y + 8.5} fontSize="2.2" textAnchor="middle"
                  fill={isActive ? loc.color : '#9ba3b8'}
                  fontWeight={isActive ? 'bold' : 'normal'}
                >{loc.label}</text>
              </g>
            );
          })}
        </svg>

        {/* Тултип */}
        {hoveredLoc && (
          <div className="map-tooltip" style={{ borderColor: hoveredLoc.color }}>
            <span style={{ color: hoveredLoc.color }}>{hoveredLoc.emoji} {hoveredLoc.label}</span>
            <span>{hoveredLoc.description}</span>
          </div>
        )}
      </div>
    </div>
  );
}
