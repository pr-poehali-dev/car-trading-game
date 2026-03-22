import { useState, useMemo, useEffect, useRef } from 'react';
import {
  ALL_CARS, BRANDS, DEALERS, JOBS, TUNING_PARTS,
  type Car, type CarTier, TIER_LABELS, TIER_COLORS,
  formatPrice, WRECKED_CAR_DESCRIPTIONS,
} from '@/data/gameData';
import CityMap, { BUSINESSES, type Business } from '@/components/CityMap';

type Screen = 'home' | 'shop' | 'market' | 'dealers' | 'junkyard' | 'tuning' | 'jobs' | 'garage' | 'profile' | 'businesses' | 'dealership';

interface PlayerState {
  money: number;
  ownedCars: Car[];
  jobShifts: number;
  carTuning: Record<string, string[]>;
  ownedBusinesses: string[];
  day: number;
}

const INIT: PlayerState = {
  money: 150_000,
  ownedCars: [],
  jobShifts: 0,
  carTuning: {},
  ownedBusinesses: [],
  day: 1,
};

const TIERS: CarTier[] = ['нищие', 'хуже_среднего', 'средние', 'хорошие', 'отличные', 'лакшери'];

// Автосалоны с привязкой к брендам
const DEALERSHIPS = [
  { id: 'bmw_center', name: 'BMW Центр', brand: 'bmw', emoji: '🔵', color: '#3b82f6', desc: 'Официальный дилер BMW. Новые и сертифицированные авто.', bg: 'linear-gradient(135deg,#0a1628 0%,#112240 100%)' },
  { id: 'mercedes_star', name: 'Mercedes-Benz Star', brand: 'mercedes', emoji: '⭐', color: '#c0c0c0', desc: 'Звёздный дилер Mercedes. Всё от A до S-класса.', bg: 'linear-gradient(135deg,#0d0d0d 0%,#1a1a2e 100%)' },
  { id: 'audi_quattro', name: 'Audi Quattro', brand: 'audi', emoji: '⭕', color: '#e63946', desc: 'Официальный центр Audi. Прогресс через технологии.', bg: 'linear-gradient(135deg,#1a0a0a 0%,#2d1515 100%)' },
  { id: 'toyota_premium', name: 'Toyota Premium', brand: 'toyota', emoji: '🔴', color: '#ef4444', desc: 'Надёжность и качество. Полный модельный ряд.', bg: 'linear-gradient(135deg,#1a0505 0%,#2d0e0e 100%)' },
  { id: 'ferrari_lounge', name: 'Ferrari Lounge', brand: 'ferrari', emoji: '🐴', color: '#ff2200', desc: 'Прорыв в скорости. Только для избранных.', bg: 'linear-gradient(135deg,#1a0000 0%,#2d0000 100%)' },
  { id: 'lamborghini_raging', name: 'Lamborghini Raging Bull', brand: 'lamborghini', emoji: '🐂', color: '#f59e0b', desc: 'Злость и ярость на асфальте.', bg: 'linear-gradient(135deg,#1a1200 0%,#2d2000 100%)' },
  { id: 'porsche_haus', name: 'Porsche Haus', brand: 'porsche', emoji: '🏎️', color: '#f97316', desc: 'Спорт и роскошь в одном кузове.', bg: 'linear-gradient(135deg,#1a0d00 0%,#2d1800 100%)' },
  { id: 'kia_motors', name: 'KIA Motors', brand: 'kia', emoji: '🔶', color: '#f97316', desc: 'Движение, которое вдохновляет.', bg: 'linear-gradient(135deg,#0f1a0a 0%,#1a2d12 100%)' },
  { id: 'lada_official', name: 'Lada Official', brand: 'lada', emoji: '🇷🇺', color: '#3b82f6', desc: 'Российский автопром. Доступно каждому.', bg: 'linear-gradient(135deg,#050a1a 0%,#0d1433 100%)' },
  { id: 'rollsroyce_palace', name: 'Rolls-Royce Palace', brand: 'rollsroyce', emoji: '👑', color: '#facc15', desc: 'Когда нет предела совершенству.', bg: 'linear-gradient(135deg,#1a1500 0%,#2d2500 100%)' },
  { id: 'volkswagen_city', name: 'Volkswagen City', brand: 'volkswagen', emoji: '🚗', color: '#60a5fa', desc: 'Автомобиль для народа.', bg: 'linear-gradient(135deg,#05101a 0%,#0d1e33 100%)' },
  { id: 'hyundai_hub', name: 'Hyundai Hub', brand: 'hyundai', emoji: '🌀', color: '#818cf8', desc: 'Новое мышление. Новые возможности.', bg: 'linear-gradient(135deg,#0a0a1a 0%,#141428 100%)' },
];

function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Быстрые URL фото — используем picsum.photos с seed для стабильности
function getCarPhoto(car: Car, idx: number = 0): string {
  const seedBase = car.brandId.charCodeAt(0) * 31 + car.model.charCodeAt(0) * 17 + car.year + idx * 7;
  // Picsum быстрый CDN, стабильный seed = одно фото всегда
  return `https://picsum.photos/seed/car${seedBase}/400/280`;
}

// Генерация рынка БУ — случайные машины с реальными продавцами
function generateMarketCars(): Car[] {
  const picked = ALL_CARS.filter((_, i) => i % 4 === 0).slice(0, 120);
  return picked.map(c => ({
    ...c,
    id: 'mkt_' + c.id,
    price: Math.floor(c.price * (0.6 + Math.random() * 0.3)),
    condition: rnd(35, 90),
    mileage: rnd(20_000, 300_000),
    year: rnd(2005, 2022),
  }));
}

const MARKET_CARS_INIT = generateMarketCars();

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home');
  const [player, setPlayer] = useState<PlayerState>(INIT);
  const [notif, setNotif] = useState<string | null>(null);
  const [selCar, setSelCar] = useState<Car | null>(null);
  const [selPhoto, setSelPhoto] = useState(0);
  const [myListings, setMyListings] = useState<Car[]>([]);
  const [marketCars] = useState<Car[]>(MARKET_CARS_INIT);
  const [filters, setFilters] = useState({ tier: 'all' as CarTier | 'all', maxPrice: 100_000_000, minYear: 2000, maxYear: 2025, brand: 'all', bodyType: 'all' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [mktSearch, setMktSearch] = useState('');
  const [mktPage, setMktPage] = useState(1);
  const [selTuningCar, setSelTuningCar] = useState<Car | null>(null);
  const [selDealership, setSelDealership] = useState<typeof DEALERSHIPS[0] | null>(null);
  const [dealAnim, setDealAnim] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const dailyRef = useRef(false);
  const PER_PAGE = 24;

  function toast(msg: string) { setNotif(msg); setTimeout(() => setNotif(null), 3000); }

  function nav(s: Screen) { setScreen(s); setSelCar(null); }

  // Суточный доход от бизнесов
  useEffect(() => {
    if (dailyRef.current) return;
    dailyRef.current = true;
    const t = setInterval(() => {
      setPlayer(p => {
        if (p.ownedBusinesses.length === 0) return p;
        const income = BUSINESSES.filter(b => p.ownedBusinesses.includes(b.id))
          .reduce((sum, b) => sum + b.income, 0);
        toast(`🏢 Бизнесы принесли +${formatPrice(income)}`);
        return { ...p, money: p.money + income, day: p.day + 1 };
      });
    }, 30_000);
    return () => clearInterval(t);
  }, []);

  function buyCar(car: Car) {
    if (player.money < car.price) { toast('❌ Недостаточно денег'); return; }
    setPlayer(p => ({ ...p, money: p.money - car.price, ownedCars: [...p.ownedCars, { ...car, ownedByPlayer: true }] }));
    toast(`✅ ${car.brand} ${car.model} куплен!`);
    setSelCar(null);
  }

  function listCar(car: Car, price: number) {
    setPlayer(p => ({ ...p, ownedCars: p.ownedCars.filter(c => c.id !== car.id) }));
    setMyListings(m => [...m, { ...car, price }]);
    toast(`📋 Выставлен за ${formatPrice(price)}`);
  }

  function tryLell(car: Car) {
    if (Math.random() > 0.3) {
      setMyListings(m => m.filter(c => c.id !== car.id));
      setPlayer(p => ({ ...p, money: p.money + car.price }));
      toast(`💰 Продан за ${formatPrice(car.price)}!`);
    } else toast('😔 Покупатель передумал...');
  }

  function buyJunk(car: Car) {
    const p2 = Math.floor(car.price * 0.15);
    if (player.money < p2) { toast('❌ Недостаточно денег'); return; }
    setPlayer(p => ({ ...p, money: p.money - p2, ownedCars: [...p.ownedCars, { ...car, condition: rnd(5, 30), isWrecked: false }] }));
    toast(`🔧 Куплена за ${formatPrice(p2)}!`);
    setSelCar(null);
  }

  function installTuning(car: Car, partId: string, price: number) {
    if (player.money < price) { toast('❌ Мало денег'); return; }
    const cur = player.carTuning[car.id] || [];
    if (cur.includes(partId)) { toast('Уже установлено'); return; }
    setPlayer(p => ({ ...p, money: p.money - price, carTuning: { ...p.carTuning, [car.id]: [...(p.carTuning[car.id] || []), partId] } }));
    toast('🔩 Установлено!');
  }

  function doJob(salary: number) {
    setPlayer(p => ({ ...p, money: p.money + salary, jobShifts: p.jobShifts + 1 }));
    toast(`💼 +${formatPrice(salary)}`);
  }

  function buyBusiness(b: Business) {
    if (player.money < b.price) { toast('❌ Недостаточно денег'); return; }
    if (player.ownedBusinesses.includes(b.id)) { toast('Уже твой!'); return; }
    setPlayer(p => ({ ...p, money: p.money - b.price, ownedBusinesses: [...p.ownedBusinesses, b.id] }));
    toast(`🏢 ${b.name} куплен! Доход: ${formatPrice(b.income)}/день`);
  }

  function enterDealership(d: typeof DEALERSHIPS[0]) {
    setDealAnim(true);
    setSelDealership(d);
    setTimeout(() => {
      setDealAnim(false);
      setScreen('dealership');
    }, 1800);
  }

  // Фильтрованный магазин (ВСЕ машины)
  const filtered = useMemo(() => ALL_CARS.filter(c => {
    if (filters.tier !== 'all' && c.tier !== filters.tier) return false;
    if (c.price > filters.maxPrice) return false;
    if (c.year < filters.minYear || c.year > filters.maxYear) return false;
    if (filters.brand !== 'all' && c.brandId !== filters.brand) return false;
    if (filters.bodyType !== 'all' && c.bodyType !== filters.bodyType) return false;
    if (search) { const q = search.toLowerCase(); if (!c.brand.toLowerCase().includes(q) && !c.model.toLowerCase().includes(q)) return false; }
    return true;
  }), [filters, search]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  // Машины конкретного автосалона
  const dealershipCars = useMemo(() => {
    if (!selDealership) return [];
    return ALL_CARS.filter(c => c.brandId === selDealership.brand).slice(0, 48);
  }, [selDealership]);

  // Авторынок БУ — фильтрация
  const filteredMarket = useMemo(() => marketCars.filter(c => {
    if (!mktSearch) return true;
    const q = mktSearch.toLowerCase();
    return c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q);
  }), [marketCars, mktSearch]);
  const pagedMarket = filteredMarket.slice((mktPage - 1) * PER_PAGE, mktPage * PER_PAGE);
  const totalMktPages = Math.ceil(filteredMarket.length / PER_PAGE);

  const wrecked = useMemo(() => ALL_CARS.filter((_, i) => i % 15 === 0).map(c => ({
    ...c, isWrecked: true, condition: rnd(5, 25), price: Math.floor(c.price * 0.15),
    description: WRECKED_CAR_DESCRIPTIONS[rnd(0, WRECKED_CAR_DESCRIPTIONS.length - 1)],
  })), []);

  const NAV = [
    { id: 'home' as Screen, e: '🏠', l: 'Главная' },
    { id: 'shop' as Screen, e: '🏪', l: 'Салоны' },
    { id: 'market' as Screen, e: '🤝', l: 'Рынок БУ' },
    { id: 'dealers' as Screen, e: '🏢', l: 'Дилеры' },
    { id: 'junkyard' as Screen, e: '🗑️', l: 'Свалка' },
    { id: 'tuning' as Screen, e: '🔧', l: 'Тюнинг' },
    { id: 'jobs' as Screen, e: '💼', l: 'Работа' },
    { id: 'garage' as Screen, e: '🚘', l: 'Гараж' },
    { id: 'businesses' as Screen, e: '🏢', l: 'Бизнес' },
    { id: 'profile' as Screen, e: '👤', l: 'Я' },
  ];

  function CarImg({ car, style }: { car: Car; style?: React.CSSProperties }) {
    const key = car.id;
    const hasError = imgErrors[key];
    const seed = car.brandId.charCodeAt(0) * 31 + car.model.charCodeAt(0) * 17 + car.year;
    const src = hasError
      ? `https://picsum.photos/seed/car${seed}/400/280`
      : car.photos[0];
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={style}
        onError={() => setImgErrors(e => ({ ...e, [key]: true }))}
      />
    );
  }

  // Анимация входа в автосалон
  if (dealAnim && selDealership) {
    return (
      <div className="dealer-anim-screen" style={{ background: selDealership.bg }}>
        <div className="dealer-anim-content">
          <div className="dealer-anim-icon" style={{ color: selDealership.color }}>{selDealership.emoji}</div>
          <div className="dealer-anim-name" style={{ color: selDealership.color }}>{selDealership.name}</div>
          <div className="dealer-anim-dots">
            <span style={{ animationDelay: '0s' }} /><span style={{ animationDelay: '0.2s' }} /><span style={{ animationDelay: '0.4s' }} />
          </div>
          <div className="dealer-anim-sub">Входим в автосалон...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gw">
      {notif && <div className="toast">{notif}</div>}

      {/* Car Modal */}
      {selCar && (
        <div className="modal-bg" onClick={() => setSelCar(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setSelCar(null)}>✕</button>
            <div className="modal-left">
              <CarImg car={selCar} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
              <div className="modal-thumbs">
                {selCar.photos.slice(0, 4).map((_, i) => {
                  const seed2 = selCar.brandId.charCodeAt(0) * 31 + selCar.model.charCodeAt(0) * 17 + selCar.year + i * 7;
                  return (
                    <img key={i}
                      src={`https://picsum.photos/seed/car${seed2 + i * 13}/120/80`}
                      alt="" className={`mthumb ${selPhoto === i ? 'on' : ''}`}
                      onClick={() => setSelPhoto(i)}
                      loading="lazy" decoding="async"
                    />
                  );
                })}
              </div>
            </div>
            <div className="modal-right">
              <div className="m-tier" style={{ color: TIER_COLORS[selCar.tier] }}>{TIER_LABELS[selCar.tier]}</div>
              <h2 className="m-name">{selCar.brand} {selCar.model}</h2>
              <div className="m-price">{formatPrice(selCar.price)}</div>
              <div className="m-specs">
                {([['📅', selCar.year], ['📏', `${selCar.mileage.toLocaleString()} км`], ['⚙️', `${selCar.engineVolume}L / ${selCar.power} л.с.`], ['🔁', selCar.transmission], ['🚙', selCar.bodyType], ['🎨', selCar.color]] as [string, string | number][]).map(([k, v]) => (
                  <div key={String(k)} className="m-spec-row"><span>{k}</span><b>{v}</b></div>
                ))}
                <div className="m-spec-row">
                  <span>❤️</span>
                  <div className="m-cond-bar">
                    <div style={{ width: `${selCar.condition}%`, height: '100%', background: selCar.condition > 70 ? '#22c55e' : selCar.condition > 40 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                    <span>{selCar.condition}%</span>
                  </div>
                </div>
              </div>
              {(screen === 'shop' || screen === 'dealership' || screen === 'market') && (
                <button className={`m-btn ${player.money < selCar.price ? 'disabled' : ''}`} onClick={() => buyCar(selCar)}>
                  {player.money < selCar.price ? '❌ Не хватает денег' : `💰 Купить ${formatPrice(selCar.price)}`}
                </button>
              )}
              {screen === 'junkyard' && (
                <button className="m-btn junk" onClick={() => buyJunk(selCar)}>
                  🔧 Забрать за {formatPrice(Math.floor(selCar.price * 0.15))}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="gh">
        <div className="gh-logo">🚗 <span>ПЕРЕКУП</span></div>
        <div className="gh-hud">
          <span>💰 <b>{formatPrice(player.money)}</b></span>
          <span>🚗 <b>{player.ownedCars.length}</b></span>
          {player.ownedBusinesses.length > 0 && <span>🏢 <b>{player.ownedBusinesses.length}</b></span>}
          <span style={{ color: 'var(--tx3)', fontSize: 12 }}>День {player.day}</span>
        </div>
      </header>

      {/* Nav */}
      <nav className="gn">
        {NAV.map(n => (
          <button key={n.id} className={`gn-b ${(screen === n.id || (screen === 'dealership' && n.id === 'shop')) ? 'on' : ''}`} onClick={() => nav(n.id)}>
            <span>{n.e}</span><span>{n.l}</span>
          </button>
        ))}
      </nav>

      {/* Main */}
      <main className="gm">

        {/* HOME */}
        {screen === 'home' && (
          <div className="s-home">
            <div className="home-top">
              <div className="home-hero-mini">
                <h1>ПЕРЕКУП <em>PRO</em></h1>
                <p>Покупай дёшево — продавай дорого</p>
                <div className="hero-mini-stats">
                  <span>🚗 2000+ авто</span>
                  <span>🏢 {DEALERSHIPS.length} автосалонов</span>
                  <span>💼 {BUSINESSES.length} бизнесов</span>
                  <span>🏆 150 брендов</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <button className="btn-a" onClick={() => nav('shop')}>🏪 Автосалоны</button>
                  <button className="btn-b" onClick={() => nav('market')}>🤝 Рынок БУ</button>
                </div>
              </div>
              <CityMap
                onNavigate={(s) => nav(s as Screen)}
                currentScreen={screen}
                ownedBusinesses={player.ownedBusinesses}
                playerMoney={player.money}
                onBuyBusiness={buyBusiness}
              />
            </div>
            <div className="home-tiers">
              {TIERS.map(t => (
                <button key={t} className="tier-btn" style={{ borderColor: TIER_COLORS[t] + '66', color: TIER_COLORS[t] }}
                  onClick={() => { setFilters(f => ({ ...f, tier: t })); nav('shop'); }}>
                  {TIER_LABELS[t]}
                  <span>{BRANDS.filter(b => b.tier === t).length} br</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SHOP — список автосалонов */}
        {screen === 'shop' && (
          <div className="s-shop">
            <div className="sh-head">
              <h2>🏪 Автосалоны</h2>
              <span className="cnt">{DEALERSHIPS.length}</span>
            </div>
            <p style={{ color: 'var(--tx2)', fontSize: 13, marginBottom: 16 }}>Выбери автосалон и зайди внутрь — там тебя ждёт весь модельный ряд бренда.</p>
            <div className="dealer-showrooms">
              {DEALERSHIPS.map(d => {
                const brandCars = ALL_CARS.filter(c => c.brandId === d.brand);
                const minPrice = brandCars.length ? Math.min(...brandCars.map(c => c.price)) : 0;
                const brand = BRANDS.find(b => b.id === d.brand);
                return (
                  <div key={d.id} className="showroom-card" style={{ background: d.bg, borderColor: d.color + '40' }}>
                    <div className="showroom-emblem" style={{ color: d.color }}>{d.emoji}</div>
                    <div className="showroom-info">
                      <div className="showroom-name" style={{ color: d.color }}>{d.name}</div>
                      <div className="showroom-desc">{d.desc}</div>
                      <div className="showroom-meta">
                        <span>🚗 {brandCars.length} авто</span>
                        <span>🌍 {brand?.country}</span>
                        <span>от {formatPrice(minPrice)}</span>
                      </div>
                    </div>
                    <button className="showroom-enter" style={{ borderColor: d.color, color: d.color }}
                      onClick={() => enterDealership(d)}>
                      Войти →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DEALERSHIP — внутри автосалона */}
        {screen === 'dealership' && selDealership && (
          <div className="s-dealership">
            <div className="dealership-header" style={{ background: selDealership.bg, borderColor: selDealership.color + '40' }}>
              <button className="btn-b" onClick={() => nav('shop')} style={{ marginBottom: 0 }}>← Назад к салонам</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="dh-icon" style={{ color: selDealership.color }}>{selDealership.emoji}</div>
                <div>
                  <div className="dh-name" style={{ color: selDealership.color }}>{selDealership.name}</div>
                  <div className="dh-desc">{selDealership.desc}</div>
                </div>
              </div>
              <div className="dh-count">{dealershipCars.length} автомобилей</div>
            </div>
            {dealershipCars.length === 0
              ? <div className="empty big"><span>🏎️</span><p>Автомобили этого бренда пока в пути</p></div>
              : <div className="cg" style={{ marginTop: 16 }}>
                  {dealershipCars.map(car => (
                    <div key={car.id} className="cc" onClick={() => { setSelCar(car); setSelPhoto(0); }}>
                      <div className="cc-img">
                        <CarImg car={car} />
                        <div className="cc-t" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                        <div className="cc-dot" style={{ background: car.condition > 70 ? '#22c55e' : car.condition > 40 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <div className="cc-b">
                        <div className="cc-nm">{car.brand} {car.model}</div>
                        <div className="cc-mt">{car.year} · {car.power} л.с.</div>
                        <div className="cc-pr">{formatPrice(car.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* MARKET — только БУ тачки */}
        {screen === 'market' && (
          <div className="s-market">
            <div className="sh-head"><h2>🤝 Авторынок БУ</h2><span className="cnt">{filteredMarket.length} объявлений</span></div>
            <div className="junk-tip" style={{ borderColor: 'rgba(245,158,11,0.25)' }}>
              💡 Здесь продают <b>реальные люди</b> — цены ниже салона, но состояние разное. Торгуйся!
            </div>

            {/* Мои объявления */}
            {myListings.length > 0 && (
              <>
                <h3 className="sec-h">📋 Мои объявления ({myListings.length})</h3>
                <div className="cg">
                  {myListings.map(car => (
                    <div key={car.id} className="cc">
                      <div className="cc-img">
                        <CarImg car={car} />
                        <div className="cc-t" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                      </div>
                      <div className="cc-b">
                        <div className="cc-nm">{car.brand} {car.model}</div>
                        <div className="cc-pr">{formatPrice(car.price)}</div>
                        <button className="btn-b" onClick={() => tryLell(car)}>🔍 Найти покупателя</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3 className="sec-h">🚗 Машины на рынке — {filteredMarket.length} шт.</h3>
            <div className="flt-block" style={{ marginBottom: 12 }}>
              <input className="flt-search" placeholder="🔍 Поиск по марке или модели..."
                value={mktSearch} onChange={e => { setMktSearch(e.target.value); setMktPage(1); }} />
            </div>
            <div className="cg">
              {pagedMarket.map(car => (
                <div key={car.id} className="cc" onClick={() => { setSelCar(car); setSelPhoto(0); }}>
                  <div className="cc-img">
                    <CarImg car={car} />
                    <div className="cc-t" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                    <div className="cc-dot" style={{ background: car.condition > 70 ? '#22c55e' : car.condition > 40 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <div className="cc-b">
                    <div className="cc-nm">{car.brand} {car.model}</div>
                    <div className="cc-mt">{car.year} · {car.mileage.toLocaleString()} км · ❤️{car.condition}%</div>
                    <div className="cc-pr">{formatPrice(car.price)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pgr">
              <button disabled={mktPage === 1} onClick={() => setMktPage(p => p - 1)} className="pg">◀</button>
              <span>{mktPage} / {totalMktPages}</span>
              <button disabled={mktPage === totalMktPages} onClick={() => setMktPage(p => p + 1)} className="pg">▶</button>
            </div>
          </div>
        )}

        {/* DEALERS */}
        {screen === 'dealers' && (
          <div className="s-dealers">
            <div className="sh-head"><h2>🏢 Автосалоны города</h2><span className="cnt">100</span></div>
            <div className="dlr-grid">
              {DEALERS.map(d => (
                <div key={d.id} className="dlr-c">
                  <img src={d.logo} alt="" className="dlr-logo"
                    onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/dlr${d.id}/80/80`; }} />
                  <div className="dlr-b">
                    <div className="dlr-nm">{d.name}</div>
                    <div className="dlr-ci">📍 {d.city}</div>
                    <div className="dlr-ts">{d.tier.map(t => <span key={t} className="dt" style={{ color: TIER_COLORS[t] }}>{TIER_LABELS[t]}</span>)}</div>
                    <div className="dlr-mt">🏷️ {d.discount}% · ⭐ {d.reputation}</div>
                    <button className="btn-b" onClick={() => { setFilters(f => ({ ...f, tier: d.tier[0] })); nav('shop'); }}>Посетить →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JUNKYARD */}
        {screen === 'junkyard' && (
          <div className="s-junk">
            <div className="sh-head"><h2>🗑️ Свалка</h2><span className="cnt">{wrecked.length} авто</span></div>
            <div className="junk-tip">💡 Машины за <b>15% цены</b> — восстанови и заработай!</div>
            <div className="cg">
              {wrecked.map(car => (
                <div key={car.id} className="cc" onClick={() => { setSelCar(car); setSelPhoto(0); }}>
                  <div className="cc-img">
                    <CarImg car={car} style={{ filter: 'grayscale(60%) brightness(0.75)' }} />
                    <div className="cc-t" style={{ background: '#374151' }}>💀 УБИТАЯ</div>
                    <div className="junk-hp">❤️{car.condition}%</div>
                  </div>
                  <div className="cc-b">
                    <div className="cc-nm">{car.brand} {car.model}</div>
                    <div className="cc-jd">{car.description}</div>
                    <div className="cc-jfoot">
                      <span className="cc-gp">{formatPrice(Math.floor(car.price * 0.15))}</span>
                      <span className="cc-op">{formatPrice(car.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TUNING */}
        {screen === 'tuning' && (
          <div className="s-tuning">
            <div className="sh-head"><h2>🔧 Тюнинг</h2></div>
            {player.ownedCars.length === 0
              ? <div className="empty big"><span>🔧</span><p>Нет машин для тюнинга</p><button className="btn-a" onClick={() => nav('shop')}>В магазин</button></div>
              : <div className="tun-lay">
                  <div className="tun-sb">
                    <div className="tun-sb-h">Твои машины</div>
                    {player.ownedCars.map(car => {
                      const cnt = (player.carTuning[car.id] || []).length;
                      return (
                        <div key={car.id} className={`tun-car ${selTuningCar?.id === car.id ? 'sel' : ''}`} onClick={() => setSelTuningCar(car)}>
                          <CarImg car={car} style={{ width: 52, height: 36, objectFit: 'cover', borderRadius: 5 }} />
                          <div><div className="tc-nm">{car.brand} {car.model}</div><div className="tc-ct">🔩 {cnt}</div></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="tun-main">
                    {selTuningCar && (
                      <div className="tun-sel-car">
                        <CarImg car={selTuningCar} style={{ width: 84, height: 54, objectFit: 'cover', borderRadius: 6 }} />
                        <div><b>{selTuningCar.brand} {selTuningCar.model}</b><span>{selTuningCar.power} л.с.</span></div>
                      </div>
                    )}
                    {!selTuningCar && <div className="tun-pick">← Выбери машину</div>}
                    {(['engine', 'exhaust', 'suspension', 'exterior', 'interior', 'wheels', 'brakes'] as const).map(cat => {
                      const parts = TUNING_PARTS.filter(p => p.category === cat);
                      const names: Record<string, string> = { engine: '⚙️ Двигатель', exhaust: '💨 Выхлоп', suspension: '🔩 Подвеска', exterior: '🎨 Кузов', interior: '🪑 Салон', wheels: '🛞 Колёса', brakes: '🛑 Тормоза' };
                      return (
                        <div key={cat} className="tun-cat">
                          <div className="tun-ch">{names[cat]}</div>
                          <div className="parts-row">
                            {parts.map(p => {
                              const inst = selTuningCar ? (player.carTuning[selTuningCar.id] || []).includes(p.id) : false;
                              const ok = player.money >= p.price;
                              return (
                                <div key={p.id} className={`pt ${inst ? 'inst' : ''}`}>
                                  <div className="pt-nm">{p.name}</div>
                                  <div className="pt-ef">{p.effect}</div>
                                  <div className="pt-ft">
                                    <span className="pt-pr">{formatPrice(p.price)}</span>
                                    {inst ? <span className="pt-done">✅</span>
                                      : <button className={`pt-btn ${!selTuningCar || !ok ? 'dis' : ''}`}
                                        onClick={() => selTuningCar && installTuning(selTuningCar, p.id, p.price)}
                                        disabled={!selTuningCar || !ok}>
                                        {!selTuningCar ? '—' : !ok ? '❌' : 'Поставить'}
                                      </button>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>}
          </div>
        )}

        {/* JOBS */}
        {screen === 'jobs' && (
          <div className="s-jobs">
            <div className="sh-head"><h2>💼 Работа</h2><span className="cnt">{player.jobShifts} смен</span></div>
            <div className="jobs-g">
              {JOBS.map(j => (
                <div key={j.id} className="job-c">
                  <span className="job-ic">{j.icon}</span>
                  <div className="job-nm">{j.title}</div>
                  <div className="job-ds">{j.description}</div>
                  <div className="job-sal">💰 {formatPrice(j.salary)} / смена</div>
                  <button className="btn-a" onClick={() => doJob(j.salary)}>▶ Работать</button>
                </div>
              ))}
            </div>
            <div className="sec-h">Быстрый заработок</div>
            <div className="qj-g">
              {([['🫧', 'Помыть авто', 500], ['📦', 'Доставить груз', 1200], ['🔍', 'Техосмотр', 2000], ['🚕', 'Поездка', 800], ['🔨', 'Ремонт', 3500], ['🛣️', 'Перегон авто', 5000]] as [string, string, number][]).map(([ic, lb, pay]) => (
                <div key={lb} className="qj" onClick={() => { setPlayer(p => ({ ...p, money: p.money + pay })); toast(`+${formatPrice(pay)}`); }}>
                  <span>{ic}</span><span>{lb}</span><span className="qj-p">+{formatPrice(pay)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GARAGE */}
        {screen === 'garage' && (
          <div className="s-garage">
            <div className="sh-head"><h2>🚘 Гараж</h2><span className="cnt">{player.ownedCars.length}</span></div>
            {player.ownedCars.length === 0
              ? <div className="empty big"><span>🏚️</span><p>Гараж пустой</p><button className="btn-a" onClick={() => nav('shop')}>В магазин</button></div>
              : <div className="cg">{player.ownedCars.map(car => {
                const tun = player.carTuning[car.id] || [];
                const est = Math.floor(car.price * (1.1 + tun.length * 0.08));
                return (
                  <div key={car.id} className="cc">
                    <div className="cc-img">
                      <CarImg car={car} />
                      <div className="cc-t" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                      {tun.length > 0 && <div className="tun-b">🔧×{tun.length}</div>}
                    </div>
                    <div className="cc-b">
                      <div className="cc-nm">{car.brand} {car.model}</div>
                      <div className="cc-mt">{car.year} · {car.mileage.toLocaleString()} км</div>
                      <div className="cc-pr-row">
                        <span>{formatPrice(car.price)}</span>
                        <span className="cc-green">→ {formatPrice(est)}</span>
                      </div>
                      <div className="gar-acts">
                        <button className="btn-ico" onClick={() => { setSelTuningCar(car); nav('tuning'); }} title="Тюнинг">🔧</button>
                        <button className="btn-a" onClick={() => listCar(car, est)}>Продать</button>
                      </div>
                    </div>
                  </div>
                );
              })}</div>}
          </div>
        )}

        {/* BUSINESSES */}
        {screen === 'businesses' && (
          <div className="s-biz">
            <div className="sh-head"><h2>🏢 Бизнесы</h2><span className="cnt">{player.ownedBusinesses.length}/{BUSINESSES.length}</span></div>
            {player.ownedBusinesses.length > 0 && (
              <div className="biz-income-bar">
                <span>💹 Твой пассивный доход:</span>
                <b style={{ color: '#22c55e' }}>
                  +{formatPrice(BUSINESSES.filter(b => player.ownedBusinesses.includes(b.id)).reduce((s, b) => s + b.income, 0))}/день
                </b>
                <span style={{ color: 'var(--tx3)', fontSize: 11 }}>(каждые 30 сек)</span>
              </div>
            )}
            <div className="biz-grid">
              {BUSINESSES.map(b => {
                const owned = player.ownedBusinesses.includes(b.id);
                const canBuy = player.money >= b.price;
                return (
                  <div key={b.id} className={`biz-card ${owned ? 'owned' : ''}`} style={{ borderColor: owned ? b.color + '50' : 'var(--brd)' }}>
                    <div className="biz-card-icon" style={{ background: b.color + '20', color: b.color, borderColor: b.color + '30' }}>
                      {b.emoji}
                    </div>
                    <div className="biz-card-body">
                      <div className="biz-card-name">{b.name}</div>
                      <div className="biz-card-stats">
                        <span style={{ color: '#f59e0b' }}>💰 {b.price.toLocaleString('ru')} ₽</span>
                        <span style={{ color: '#22c55e' }}>📈 +{b.income.toLocaleString('ru')} ₽/д</span>
                      </div>
                      <div className="biz-card-roi" style={{ color: 'var(--tx3)' }}>Окупится через {Math.ceil(b.price / b.income)} дней</div>
                    </div>
                    {owned
                      ? <div className="biz-badge">✅ Твой</div>
                      : <button className={`biz-buy ${!canBuy ? 'dis' : ''}`}
                          style={{ borderColor: b.color, color: canBuy ? b.color : undefined }}
                          disabled={!canBuy}
                          onClick={() => buyBusiness(b)}>
                          {canBuy ? 'Купить' : '❌ Мало'}
                        </button>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {screen === 'profile' && (
          <div className="s-prof">
            <div className="prof-h">
              <div className="prof-av">👤</div>
              <div className="prof-nm">Перекупщик</div>
              <div className="prof-rk" style={{ color: '#f59e0b' }}>
                {player.money > 10_000_000 ? '🤑 Магнат' : player.money > 1_000_000 ? '💰 Богач' : player.ownedCars.length > 0 ? '🚗 Перекупщик' : '🥚 Новичок'}
              </div>
            </div>
            <div className="prof-sg">
              {([['💰', 'Баланс', formatPrice(player.money)], ['🚗', 'В гараже', player.ownedCars.length], ['💼', 'Смен', player.jobShifts], ['🔧', 'Тюнинг', Object.values(player.carTuning).flat().length], ['📋', 'На продаже', myListings.length], ['🏢', 'Бизнесов', player.ownedBusinesses.length]] as [string, string, string | number][]).map(([ic, lb, v]) => (
                <div key={lb} className="ps"><span>{ic}</span><b>{v}</b><span>{lb}</span></div>
              ))}
            </div>
            <div className="sec-h">Достижения</div>
            <div className="ach-l">
              {([[player.ownedCars.length >= 1, '🚗', 'Первая машина'], [player.money >= 1_000_000, '💰', 'Миллионер'], [player.jobShifts >= 10, '💼', 'Трудяга'], [Object.values(player.carTuning).flat().length >= 5, '🔧', 'Тюнер'], [player.ownedCars.length >= 5, '🏎️', 'Коллекционер'], [myListings.length >= 3, '🤝', 'Торговец'], [player.ownedBusinesses.length >= 1, '🏢', 'Бизнесмен'], [player.ownedBusinesses.length >= 5, '💹', 'Магнат'], [player.money >= 10_000_000, '🤑', 'Мультимиллионер']] as [boolean, string, string][]).map(([ok, ic, lb]) => (
                <div key={lb} className={`ach ${ok ? 'ok' : ''}`}><span>{ic}</span><span>{lb}</span>{ok && <span>✅</span>}</div>
              ))}
            </div>
            <button className="btn-rst" onClick={() => { setPlayer(INIT); setMyListings([]); setScreen('home'); toast('🔄 Игра сброшена'); }}>
              🔄 Начать заново
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
