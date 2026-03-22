import { useState } from 'react';

export interface MapLocation {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  screen: string;
  color: string;
  description: string;
  type: 'main' | 'business';
}

export interface Business {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  price: number;
  income: number;
  color: string;
  description: string;
  owned?: boolean;
}

export const BUSINESSES: Business[] = [
  { id: 'carwash', name: 'Автомойка', emoji: '🫧', x: 18, y: 18, price: 150_000, income: 8_000, color: '#38bdf8', description: '+8 000₽/день' },
  { id: 'gasstation', name: 'Бензоколонка', emoji: '⛽', x: 68, y: 12, price: 500_000, income: 25_000, color: '#f97316', description: '+25 000₽/день' },
  { id: 'parking', name: 'Парковка', emoji: '🅿️', x: 85, y: 28, price: 300_000, income: 15_000, color: '#a3e635', description: '+15 000₽/день' },
  { id: 'autoparts', name: 'Автозапчасти', emoji: '🔩', x: 8, y: 48, price: 400_000, income: 20_000, color: '#fb923c', description: '+20 000₽/день' },
  { id: 'cafe', name: 'Кафе «Движок»', emoji: '☕', x: 48, y: 38, price: 200_000, income: 10_000, color: '#c084fc', description: '+10 000₽/день' },
  { id: 'insurance', name: 'Страховая', emoji: '📋', x: 28, y: 62, price: 600_000, income: 35_000, color: '#34d399', description: '+35 000₽/день' },
  { id: 'tireservice', name: 'Шиномонтаж', emoji: '🛞', x: 72, y: 55, price: 250_000, income: 12_000, color: '#fbbf24', description: '+12 000₽/день' },
  { id: 'motel', name: 'Мотель', emoji: '🏨', x: 88, y: 65, price: 800_000, income: 45_000, color: '#60a5fa', description: '+45 000₽/день' },
  { id: 'casino', name: 'Казино', emoji: '🎰', x: 52, y: 72, price: 2_000_000, income: 120_000, color: '#f43f5e', description: '+120 000₽/день' },
  { id: 'bank', name: 'Банк «Рубль»', emoji: '🏦', x: 15, y: 82, price: 3_000_000, income: 200_000, color: '#facc15', description: '+200 000₽/день' },
  { id: 'stadium', name: 'Стадион', emoji: '🏟️', x: 75, y: 85, price: 5_000_000, income: 350_000, color: '#4ade80', description: '+350 000₽/день' },
  { id: 'airport', name: 'Аэропорт', emoji: '✈️', x: 42, y: 90, price: 10_000_000, income: 700_000, color: '#818cf8', description: '+700 000₽/день' },
];

const MAIN_LOCATIONS: MapLocation[] = [
  { id: 'shop', label: 'Магазин', emoji: '🏪', x: 55, y: 20, screen: 'shop', color: '#3b82f6', description: 'Автосалоны', type: 'main' },
  { id: 'market', label: 'Авторынок', emoji: '🤝', x: 78, y: 42, screen: 'market', color: '#f59e0b', description: 'БУ тачки', type: 'main' },
  { id: 'dealers', label: 'Район дилеров', emoji: '🏢', x: 25, y: 35, screen: 'dealers', color: '#a855f7', description: '100 дилеров', type: 'main' },
  { id: 'junkyard', label: 'Свалка', emoji: '🗑️', x: 10, y: 68, screen: 'junkyard', color: '#6b7280', description: 'Убитые авто -85%', type: 'main' },
  { id: 'tuning', label: 'Тюнинг', emoji: '🔧', x: 65, y: 62, screen: 'tuning', color: '#22c55e', description: 'Прокачай авто', type: 'main' },
  { id: 'jobs', label: 'Работа', emoji: '💼', x: 38, y: 50, screen: 'jobs', color: '#ec4899', description: 'Заработок', type: 'main' },
  { id: 'garage', label: 'Гараж', emoji: '🚘', x: 88, y: 78, screen: 'garage', color: '#f97316', description: 'Твои машины', type: 'main' },
  { id: 'businesses', label: 'Бизнесы', emoji: '💼', x: 42, y: 15, screen: 'businesses', color: '#10b981', description: 'Пассивный доход', type: 'main' },
];

const ROADS = [
  // Горизонтальные магистрали
  { x1: 0, y1: 30, x2: 100, y2: 30 },
  { x1: 0, y1: 58, x2: 100, y2: 58 },
  { x1: 0, y1: 82, x2: 100, y2: 82 },
  // Вертикальные магистрали
  { x1: 30, y1: 0, x2: 30, y2: 100 },
  { x1: 58, y1: 0, x2: 58, y2: 100 },
  { x1: 82, y1: 0, x2: 82, y2: 100 },
  // Диагонали
  { x1: 0, y1: 0, x2: 30, y2: 30 },
  { x1: 58, y1: 30, x2: 82, y2: 58 },
  { x1: 30, y1: 58, x2: 58, y2: 82 },
  { x1: 82, y1: 58, x2: 100, y2: 82 },
];

const BLOCKS = [
  { x: 1, y: 1, w: 27, h: 27 },
  { x: 32, y: 1, w: 24, h: 27 },
  { x: 60, y: 1, w: 20, h: 27 },
  { x: 84, y: 1, w: 15, h: 27 },
  { x: 1, y: 32, w: 27, h: 24 },
  { x: 32, y: 32, w: 24, h: 24 },
  { x: 60, y: 32, w: 20, h: 24 },
  { x: 84, y: 32, w: 15, h: 24 },
  { x: 1, y: 60, w: 27, h: 20 },
  { x: 32, y: 60, w: 24, h: 20 },
  { x: 60, y: 60, w: 20, h: 20 },
  { x: 84, y: 60, w: 15, h: 20 },
  { x: 1, y: 84, w: 27, h: 15 },
  { x: 32, y: 84, w: 24, h: 15 },
  { x: 60, y: 84, w: 20, h: 15 },
  { x: 84, y: 84, w: 15, h: 15 },
];

const BUILDINGS = [
  [3,3],[6,3],[9,3],[12,3],[3,7],[9,7],[14,7],[18,3],[22,3],[18,7],[22,7],
  [33,3],[37,3],[41,3],[45,3],[33,8],[41,8],[50,3],[50,8],[54,3],
  [61,3],[65,3],[61,8],[65,8],[70,3],[70,8],[74,3],[78,3],
  [3,33],[7,33],[3,37],[7,37],[11,33],[15,33],[20,33],[25,33],[11,38],[20,38],
  [33,33],[37,33],[41,33],[45,33],[50,33],[53,33],[33,38],[45,38],[53,38],
  [61,33],[65,33],[69,33],[61,38],[65,38],[69,38],[74,33],[78,33],[74,38],
  [3,61],[7,61],[11,61],[15,61],[21,61],[25,61],[3,66],[15,66],[21,66],
  [33,61],[37,61],[41,61],[33,66],[37,66],[41,66],[50,61],[54,61],
  [61,61],[65,61],[69,61],[74,61],[78,61],[61,66],[69,66],[78,66],
  [3,85],[7,85],[11,85],[16,85],[22,85],[26,85],[3,90],[16,90],[22,90],
  [33,85],[37,85],[41,85],[45,85],[50,85],[54,85],[33,90],[45,90],[54,90],
  [61,85],[65,85],[69,85],[74,85],[78,85],[61,90],[65,90],[74,90],[78,90],
  [85,3],[88,3],[91,3],[85,8],[91,8],[94,3],[94,8],
  [85,33],[88,33],[91,33],[85,38],[91,38],[94,33],[94,38],
  [85,61],[88,61],[91,61],[85,66],[91,66],[94,61],[94,66],
  [85,85],[88,85],[91,85],[85,90],[91,90],[94,85],[94,90],
];

const PARKS = [
  { x: 3, y: 23, w: 8, h: 5 },
  { x: 62, y: 23, w: 6, h: 5 },
  { x: 35, y: 54, w: 5, h: 4 },
  { x: 85, y: 54, w: 5, h: 4 },
  { x: 3, y: 76, w: 6, h: 4 },
  { x: 62, y: 76, w: 7, h: 5 },
];

interface CityMapProps {
  onNavigate: (screen: string) => void;
  currentScreen: string;
  ownedBusinesses: string[];
  playerMoney: number;
  onBuyBusiness: (b: Business) => void;
}

export default function CityMap({ onNavigate, currentScreen, ownedBusinesses, playerMoney, onBuyBusiness }: CityMapProps) {
  const [hoveredMain, setHoveredMain] = useState<string | null>(null);
  const [hoveredBiz, setHoveredBiz] = useState<string | null>(null);
  const [bizPopup, setBizPopup] = useState<Business | null>(null);

  const hoveredMainLoc = MAIN_LOCATIONS.find(l => l.id === hoveredMain);
  const hoveredBizLoc = BUSINESSES.find(b => b.id === hoveredBiz);

  return (
    <div className="city-map-wrap">
      <div className="map-header">
        <div className="map-title">🗺️ КАРТА ГОРОДА</div>
        <div className="map-legend">
          <span className="leg-dot" style={{ background: '#3b82f6' }} /> Локации
          <span className="leg-dot" style={{ background: '#10b981', marginLeft: 10 }} /> Бизнесы
          <span className="leg-dot owned" /> Куплено
        </div>
      </div>

      <div className="map-container">
        <svg viewBox="0 0 100 100" className="map-svg" preserveAspectRatio="xMidYMid meet">
          {/* Фон */}
          <rect width="100" height="100" fill="#090c12" />

          {/* Кварталы */}
          {BLOCKS.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#0f1520" rx="0.8" />
          ))}

          {/* Парки */}
          {PARKS.map((p, i) => (
            <g key={`park-${i}`}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="#0f2d1a" rx="0.5" opacity="0.9" />
            </g>
          ))}

          {/* Дороги — основа */}
          {ROADS.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#1a2238" strokeWidth="4" />
          ))}
          {/* Дороги — разметка */}
          {ROADS.map((r, i) => (
            <line key={`d-${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="#263050" strokeWidth="0.6" strokeDasharray="2 2" />
          ))}

          {/* Мелкие здания */}
          {BUILDINGS.map(([x, y], i) => (
            <rect key={`b-${i}`} x={x} y={y} width="2.5" height="3.5"
              fill={i % 5 === 0 ? '#1a2030' : i % 3 === 0 ? '#161d2b' : '#131825'}
              rx="0.3" />
          ))}

          {/* Деревья в парках */}
          {PARKS.map((p, i) => (
            <text key={`tree-${i}`} x={p.x + p.w / 2} y={p.y + p.h / 2 + 1}
              fontSize="3" textAnchor="middle" opacity="0.8">
              {i % 2 === 0 ? '🌲' : '🌳'}
            </text>
          ))}

          {/* БИЗНЕСЫ */}
          {BUSINESSES.map(biz => {
            const isOwned = ownedBusinesses.includes(biz.id);
            const isHov = hoveredBiz === biz.id;
            return (
              <g key={biz.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setBizPopup(biz)}
                onMouseEnter={() => setHoveredBiz(biz.id)}
                onMouseLeave={() => setHoveredBiz(null)}
              >
                {isOwned && (
                  <circle cx={biz.x} cy={biz.y} r="4.5" fill={biz.color} opacity="0.15">
                    <animate attributeName="r" values="4.5;6;4.5" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
                {isHov && (
                  <circle cx={biz.x} cy={biz.y} r="5" fill={biz.color} opacity="0.2" />
                )}
                <rect
                  x={biz.x - 3} y={biz.y - 3}
                  width="6" height="6"
                  rx="1"
                  fill={isOwned ? biz.color + '30' : '#131825'}
                  stroke={isOwned ? biz.color : biz.color + '80'}
                  strokeWidth={isOwned ? "0.8" : "0.5"}
                />
                <text x={biz.x} y={biz.y + 1.2} fontSize="3.2" textAnchor="middle">{biz.emoji}</text>
                {isOwned && (
                  <circle cx={biz.x + 2.8} cy={biz.y - 2.8} r="1" fill="#22c55e" />
                )}
              </g>
            );
          })}

          {/* ОСНОВНЫЕ ЛОКАЦИИ */}
          {MAIN_LOCATIONS.map(loc => {
            const isActive = currentScreen === loc.screen;
            const isHov = hoveredMain === loc.id;
            return (
              <g key={loc.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate(loc.screen)}
                onMouseEnter={() => setHoveredMain(loc.id)}
                onMouseLeave={() => setHoveredMain(null)}
              >
                {isActive && (
                  <circle cx={loc.x} cy={loc.y} r="7" fill={loc.color} opacity="0.2">
                    <animate attributeName="r" values="7;10;7" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {isHov && !isActive && (
                  <circle cx={loc.x} cy={loc.y} r="8" fill={loc.color} opacity="0.12" />
                )}
                <circle cx={loc.x} cy={loc.y} r={isActive || isHov ? "5.5" : "4.8"}
                  fill={isActive ? loc.color : '#0f1a2e'}
                  stroke={loc.color}
                  strokeWidth={isActive ? "0" : "0.9"}
                  style={{ transition: 'all 0.2s' }}
                />
                <text x={loc.x} y={loc.y + 1.8} fontSize="4.5" textAnchor="middle">{loc.emoji}</text>
                <text x={loc.x} y={loc.y + 9} fontSize="2.2" textAnchor="middle"
                  fill={isActive ? loc.color : '#8a93ad'}
                  fontWeight={isActive ? 'bold' : 'normal'}
                >{loc.label}</text>
              </g>
            );
          })}
        </svg>

        {/* Тултип локации */}
        {hoveredMainLoc && !hoveredBiz && (
          <div className="map-tooltip" style={{ borderColor: hoveredMainLoc.color }}>
            <span style={{ color: hoveredMainLoc.color }}>{hoveredMainLoc.emoji} {hoveredMainLoc.label}</span>
            <span>{hoveredMainLoc.description}</span>
          </div>
        )}

        {/* Тултип бизнеса */}
        {hoveredBizLoc && (
          <div className="map-tooltip" style={{ borderColor: hoveredBizLoc.color }}>
            <span style={{ color: hoveredBizLoc.color }}>{hoveredBizLoc.emoji} {hoveredBizLoc.name}</span>
            <span>{hoveredBizLoc.description}</span>
            {ownedBusinesses.includes(hoveredBizLoc.id)
              ? <span style={{ color: '#22c55e', fontSize: 10 }}>✅ Твой бизнес</span>
              : <span style={{ color: '#f59e0b', fontSize: 10 }}>Нажми для покупки</span>
            }
          </div>
        )}
      </div>

      {/* Попап покупки бизнеса */}
      {bizPopup && (
        <div className="biz-popup-bg" onClick={() => setBizPopup(null)}>
          <div className="biz-popup" style={{ borderColor: bizPopup.color + '60' }} onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setBizPopup(null)}>✕</button>
            <div className="biz-pop-ico" style={{ background: bizPopup.color + '20', border: `1px solid ${bizPopup.color}40` }}>
              {bizPopup.emoji}
            </div>
            <div className="biz-pop-name">{bizPopup.name}</div>
            <div className="biz-pop-desc">{bizPopup.description}</div>
            <div className="biz-pop-row">
              <div className="biz-pop-stat">
                <span>Цена покупки</span>
                <b style={{ color: '#f59e0b' }}>{bizPopup.price.toLocaleString('ru')} ₽</b>
              </div>
              <div className="biz-pop-stat">
                <span>Доход/день</span>
                <b style={{ color: '#22c55e' }}>+{bizPopup.income.toLocaleString('ru')} ₽</b>
              </div>
              <div className="biz-pop-stat">
                <span>Окупаемость</span>
                <b style={{ color: '#818cf8' }}>{Math.ceil(bizPopup.price / bizPopup.income)} дней</b>
              </div>
            </div>
            {ownedBusinesses.includes(bizPopup.id) ? (
              <div className="biz-owned-badge">✅ Бизнес куплен — работает на тебя!</div>
            ) : (
              <button
                className={`biz-buy-btn ${playerMoney < bizPopup.price ? 'dis' : ''}`}
                disabled={playerMoney < bizPopup.price}
                onClick={() => { onBuyBusiness(bizPopup); setBizPopup(null); }}
              >
                {playerMoney < bizPopup.price
                  ? `❌ Нужно ещё ${(bizPopup.price - playerMoney).toLocaleString('ru')} ₽`
                  : `💰 Купить за ${bizPopup.price.toLocaleString('ru')} ₽`
                }
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
