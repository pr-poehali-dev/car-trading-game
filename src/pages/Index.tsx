import { useState, useMemo } from 'react';
import {
  ALL_CARS, BRANDS, DEALERS, JOBS, TUNING_PARTS,
  type Car, type CarTier, TIER_LABELS, TIER_COLORS,
  formatPrice, WRECKED_CAR_DESCRIPTIONS,
} from '@/data/gameData';

type Screen =
  | 'home'
  | 'shop'
  | 'market'
  | 'dealers'
  | 'junkyard'
  | 'tuning'
  | 'jobs'
  | 'garage'
  | 'profile';

interface PlayerState {
  money: number;
  reputation: number;
  ownedCars: Car[];
  jobShifts: number;
  activeJob: string | null;
  carTuning: Record<string, string[]>;
}

const INITIAL_PLAYER: PlayerState = {
  money: 150_000,
  reputation: 10,
  ownedCars: [],
  jobShifts: 0,
  activeJob: null,
  carTuning: {},
};

const TIERS: CarTier[] = ['нищие', 'хуже_среднего', 'средние', 'хорошие', 'отличные', 'лакшери'];

function rndLocal(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home');
  const [player, setPlayer] = useState<PlayerState>(INITIAL_PLAYER);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [marketCars, setMarketCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState({
    tier: 'all' as CarTier | 'all',
    minPrice: 0,
    maxPrice: 100_000_000,
    minYear: 2000,
    maxYear: 2024,
    brand: 'all',
    bodyType: 'all',
    transmission: 'all',
  });
  const [shopSearch, setShopSearch] = useState('');
  const [shopPage, setShopPage] = useState(1);
  const CARS_PER_PAGE = 24;

  function notify(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  function buyCar(car: Car) {
    if (player.money < car.price) { notify('❌ Недостаточно денег!'); return; }
    setPlayer(p => ({ ...p, money: p.money - car.price, ownedCars: [...p.ownedCars, { ...car, ownedByPlayer: true }] }));
    notify(`✅ Куплен ${car.brand} ${car.model}!`);
    setSelectedCar(null);
  }

  function listCarOnMarket(car: Car, askPrice: number) {
    setPlayer(p => ({ ...p, ownedCars: p.ownedCars.filter(c => c.id !== car.id) }));
    setMarketCars(prev => [...prev, { ...car, price: askPrice }]);
    notify(`📋 ${car.brand} ${car.model} выставлен за ${formatPrice(askPrice)}!`);
  }

  function sellFromMarket(car: Car) {
    if (Math.random() > 0.3) {
      setMarketCars(prev => prev.filter(c => c.id !== car.id));
      setPlayer(p => ({ ...p, money: p.money + car.price }));
      notify(`💰 Продан ${car.brand} ${car.model} за ${formatPrice(car.price)}!`);
    } else {
      notify('😔 Покупатель передумал...');
    }
  }

  function buyFromJunkyard(car: Car) {
    const discountPrice = Math.floor(car.price * 0.15);
    if (player.money < discountPrice) { notify('❌ Недостаточно денег!'); return; }
    setPlayer(p => ({ ...p, money: p.money - discountPrice, ownedCars: [...p.ownedCars, { ...car, ownedByPlayer: true, condition: rndLocal(5, 30), isWrecked: false }] }));
    notify(`🔧 Куплена ${car.brand} ${car.model} за ${formatPrice(discountPrice)}!`);
  }

  function applyTuning(car: Car, partId: string, partPrice: number) {
    if (player.money < partPrice) { notify('❌ Недостаточно денег!'); return; }
    const cur = player.carTuning[car.id] || [];
    if (cur.includes(partId)) { notify('⚠️ Уже установлено!'); return; }
    setPlayer(p => ({ ...p, money: p.money - partPrice, carTuning: { ...p.carTuning, [car.id]: [...(p.carTuning[car.id] || []), partId] } }));
    notify('🔩 Тюнинг установлен!');
  }

  function doJobShift(salary: number, jobId: string) {
    setPlayer(p => ({ ...p, money: p.money + salary, jobShifts: p.jobShifts + 1, activeJob: jobId }));
    notify(`💼 Смена отработана! +${formatPrice(salary)}`);
  }

  const filteredShopCars = useMemo(() => {
    return ALL_CARS.filter(car => {
      if (filters.tier !== 'all' && car.tier !== filters.tier) return false;
      if (car.price < filters.minPrice || car.price > filters.maxPrice) return false;
      if (car.year < filters.minYear || car.year > filters.maxYear) return false;
      if (filters.brand !== 'all' && car.brandId !== filters.brand) return false;
      if (filters.bodyType !== 'all' && car.bodyType !== filters.bodyType) return false;
      if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
      if (shopSearch) {
        const q = shopSearch.toLowerCase();
        if (!car.brand.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters, shopSearch]);

  const paginatedCars = filteredShopCars.slice((shopPage - 1) * CARS_PER_PAGE, shopPage * CARS_PER_PAGE);
  const totalPages = Math.ceil(filteredShopCars.length / CARS_PER_PAGE);

  const wreckedCars = useMemo(() =>
    ALL_CARS.filter((_, i) => i % 15 === 0).map(car => ({
      ...car, isWrecked: true, condition: rndLocal(5, 25), price: Math.floor(car.price * 0.15),
      description: WRECKED_CAR_DESCRIPTIONS[Math.floor(Math.random() * WRECKED_CAR_DESCRIPTIONS.length)],
    })), []);

  const navItems = [
    { id: 'home' as Screen, label: 'Главная', emoji: '🏠' },
    { id: 'shop' as Screen, label: 'Магазин', emoji: '🏪' },
    { id: 'market' as Screen, label: 'Авторынок', emoji: '🤝' },
    { id: 'dealers' as Screen, label: 'Дилеры', emoji: '🏢' },
    { id: 'junkyard' as Screen, label: 'Свалка', emoji: '🗑️' },
    { id: 'tuning' as Screen, label: 'Тюнинг', emoji: '🔧' },
    { id: 'jobs' as Screen, label: 'Работа', emoji: '💼' },
    { id: 'garage' as Screen, label: 'Гараж', emoji: '🚘' },
    { id: 'profile' as Screen, label: 'Профиль', emoji: '👤' },
  ];

  return (
    <div className="game-wrap">
      {notification && <div className="notif">{notification}</div>}

      {selectedCar && (
        <div className="modal-bg" onClick={() => setSelectedCar(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setSelectedCar(null)}>✕</button>
            <div className="modal-photos">
              <img src={selectedCar.photos[selectedPhoto]} alt="" className="modal-main-img" />
              <div className="modal-thumbs">
                {selectedCar.photos.map((p, i) => (
                  <img key={i} src={p} alt="" className={`modal-thumb ${selectedPhoto === i ? 'active' : ''}`} onClick={() => setSelectedPhoto(i)} />
                ))}
              </div>
            </div>
            <div className="modal-info">
              <div className="modal-tier-badge" style={{ color: TIER_COLORS[selectedCar.tier] }}>{TIER_LABELS[selectedCar.tier]}</div>
              <h2 className="modal-car-name">{selectedCar.brand} {selectedCar.model}</h2>
              <div className="modal-car-price">{formatPrice(selectedCar.price)}</div>
              <div className="modal-specs">
                {[
                  ['📅 Год', selectedCar.year],
                  ['🔄 Поколение', selectedCar.generation],
                  ['📏 Пробег', `${selectedCar.mileage.toLocaleString()} км`],
                  ['⚙️ Мотор', `${selectedCar.engineVolume}L / ${selectedCar.power} л.с.`],
                  ['🔁 КПП', selectedCar.transmission],
                  ['🚙 Кузов', selectedCar.bodyType],
                  ['🎨 Цвет', selectedCar.color],
                ].map(([label, val]) => (
                  <div key={String(label)} className="spec-row">
                    <span className="spec-label">{label}</span>
                    <span className="spec-val">{val}</span>
                  </div>
                ))}
                <div className="spec-row">
                  <span className="spec-label">❤️ Состояние</span>
                  <div className="cond-bar">
                    <div className="cond-fill" style={{ width: `${selectedCar.condition}%`, background: selectedCar.condition > 70 ? '#22c55e' : selectedCar.condition > 40 ? '#f59e0b' : '#ef4444' }} />
                    <span className="cond-text">{selectedCar.condition}%</span>
                  </div>
                </div>
              </div>
              <p className="modal-desc-text">{selectedCar.description}</p>
              {screen === 'shop' && (
                <button className={`btn-modal-buy ${player.money < selectedCar.price ? 'cant' : ''}`} onClick={() => buyCar(selectedCar)}>
                  {player.money < selectedCar.price ? '❌ Не хватает денег' : `💰 Купить за ${formatPrice(selectedCar.price)}`}
                </button>
              )}
              {screen === 'junkyard' && (
                <button className="btn-modal-buy junk" onClick={() => buyFromJunkyard(selectedCar)}>
                  🔧 Забрать за {formatPrice(Math.floor(selectedCar.price * 0.15))}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="g-header">
        <div className="g-logo">🚗 <span>ПЕРЕКУП</span> <small>PRO</small></div>
        <div className="g-hud">
          <div className="hud-item">💰 <b>{formatPrice(player.money)}</b></div>
          <div className="hud-item">⭐ <b>{player.reputation}</b></div>
          <div className="hud-item">🚗 <b>{player.ownedCars.length}</b></div>
        </div>
      </header>

      <nav className="g-nav">
        {navItems.map(n => (
          <button key={n.id} className={`g-nav-btn ${screen === n.id ? 'active' : ''}`} onClick={() => setScreen(n.id)}>
            <span>{n.emoji}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      <main className="g-main">

        {screen === 'home' && (
          <div className="s-home">
            <div className="home-hero">
              <div className="hero-glow" />
              <h1>ПЕРЕКУП <em>PRO</em></h1>
              <p>Покупай дёшево. Продавай дорого. Стань королём авторынка.</p>
              <div className="hero-btns">
                <button className="h-btn prim" onClick={() => setScreen('shop')}>🏪 Начать торговлю</button>
                <button className="h-btn sec" onClick={() => setScreen('jobs')}>💼 Заработать денег</button>
              </div>
            </div>
            <div className="home-grid4">
              {[['🚗','2 000+','Автомобилей'],['🏢','100','Автосалонов'],['🏆','150','Брендов'],['🔧','20+','Тюнинг деталей']].map(([ic,v,l])=>(
                <div key={l} className="hg4-card"><span className="hg4-ic">{ic}</span><span className="hg4-v">{v}</span><span className="hg4-l">{l}</span></div>
              ))}
            </div>
            <div className="home-nav-grid">
              {navItems.slice(1).map(n => (
                <button key={n.id} className="hng-card" onClick={() => setScreen(n.id)}>
                  <span className="hng-em">{n.emoji}</span>
                  <span className="hng-lb">{n.label}</span>
                </button>
              ))}
            </div>
            <div className="home-tiers">
              <h3>Классы машин</h3>
              <div className="tiers-row">
                {TIERS.map(t => (
                  <div key={t} className="tier-pill" style={{ borderColor: TIER_COLORS[t], color: TIER_COLORS[t] }}>
                    {TIER_LABELS[t]}
                    <span className="tier-cnt">{BRANDS.filter(b => b.tier === t).length} br</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen === 'shop' && (
          <div className="s-shop">
            <div className="s-head">
              <h2>🏪 Онлайн-Магазин</h2>
              <span className="res-cnt">{filteredShopCars.length} машин</span>
            </div>
            <div className="filters-block">
              <input className="f-search" type="text" placeholder="🔍 Марка или модель..." value={shopSearch} onChange={e => { setShopSearch(e.target.value); setShopPage(1); }} />
              <div className="f-row">
                <select className="f-sel" value={filters.tier} onChange={e => { setFilters(f => ({ ...f, tier: e.target.value as CarTier | 'all' })); setShopPage(1); }}>
                  <option value="all">Все классы</option>
                  {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                </select>
                <select className="f-sel" value={filters.brand} onChange={e => { setFilters(f => ({ ...f, brand: e.target.value })); setShopPage(1); }}>
                  <option value="all">Все бренды</option>
                  {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select className="f-sel" value={filters.bodyType} onChange={e => { setFilters(f => ({ ...f, bodyType: e.target.value })); setShopPage(1); }}>
                  <option value="all">Тип кузова</option>
                  {['Седан','Хэтчбек','Кроссовер','Внедорожник','Купе','Универсал','Минивэн','Пикап','Кабриолет'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="f-sel" value={filters.transmission} onChange={e => { setFilters(f => ({ ...f, transmission: e.target.value })); setShopPage(1); }}>
                  <option value="all">Все КПП</option>
                  {['МКПП','АКПП','Вариатор','Робот'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="f-sel" onChange={e => { const v = +e.target.value; setFilters(f => ({ ...f, maxPrice: v || 100_000_000 })); setShopPage(1); }}>
                  <option value="">Любая цена</option>
                  <option value="350000">до 350 тыс</option>
                  <option value="900000">до 900 тыс</option>
                  <option value="3000000">до 3 млн</option>
                  <option value="10000000">до 10 млн</option>
                  <option value="40000000">до 40 млн</option>
                </select>
                <div className="f-year-row">
                  <input className="f-num" type="number" min={2000} max={2024} value={filters.minYear} onChange={e => setFilters(f => ({ ...f, minYear: +e.target.value }))} placeholder="С" />
                  <span>—</span>
                  <input className="f-num" type="number" min={2000} max={2024} value={filters.maxYear} onChange={e => setFilters(f => ({ ...f, maxYear: +e.target.value }))} placeholder="По" />
                </div>
                <button className="f-reset" onClick={() => { setFilters({ tier:'all',minPrice:0,maxPrice:100_000_000,minYear:2000,maxYear:2024,brand:'all',bodyType:'all',transmission:'all' }); setShopSearch(''); setShopPage(1); }}>↺</button>
              </div>
            </div>
            <div className="car-grid">
              {paginatedCars.map(car => (
                <div key={car.id} className="car-card" onClick={() => { setSelectedCar(car); setSelectedPhoto(0); }}>
                  <div className="cc-img">
                    <img src={car.photos[0]} alt="" loading="lazy" />
                    <div className="cc-tier" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                  </div>
                  <div className="cc-body">
                    <div className="cc-name">{car.brand} {car.model}</div>
                    <div className="cc-meta">{car.year} · {car.mileage.toLocaleString()} км · {car.power} л.с.</div>
                    <div className="cc-foot">
                      <span className="cc-price">{formatPrice(car.price)}</span>
                      <span className="cc-cond" style={{ background: car.condition > 70 ? '#22c55e' : car.condition > 40 ? '#f59e0b' : '#ef4444' }} title={`${car.condition}%`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pager">
              <button disabled={shopPage === 1} onClick={() => setShopPage(p => p - 1)} className="pg-btn">◀</button>
              <span>{shopPage} / {totalPages}</span>
              <button disabled={shopPage === totalPages} onClick={() => setShopPage(p => p + 1)} className="pg-btn">▶</button>
            </div>
          </div>
        )}

        {screen === 'market' && (
          <div className="s-market">
            <div className="s-head"><h2>🤝 Авторынок</h2><span className="res-cnt">{marketCars.length} объявлений</span></div>
            <div className="market-sec">
              <h3>Продать из гаража</h3>
              {player.ownedCars.length === 0 ? (
                <div className="empty-s">Гараж пуст. <button className="link-b" onClick={() => setScreen('shop')}>Купи машину</button></div>
              ) : (
                <div className="car-grid">
                  {player.ownedCars.map(car => {
                    const tuning = player.carTuning[car.id] || [];
                    const sp = Math.floor(car.price * (1.15 + tuning.length * 0.08));
                    return (
                      <div key={car.id} className="car-card">
                        <div className="cc-img">
                          <img src={car.photos[0]} alt="" />
                          <div className="cc-tier" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                          {tuning.length > 0 && <div className="tuning-badge">🔧×{tuning.length}</div>}
                        </div>
                        <div className="cc-body">
                          <div className="cc-name">{car.brand} {car.model}</div>
                          <div className="cc-meta">{car.year} · {car.mileage.toLocaleString()} км</div>
                          <div className="cc-profit">куплено {formatPrice(car.price)} → {formatPrice(sp)}</div>
                          <button className="btn-sell" onClick={() => listCarOnMarket(car, sp)}>📋 Выставить за {formatPrice(sp)}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {marketCars.length > 0 && (
              <div className="market-sec">
                <h3>Мои объявления</h3>
                <div className="car-grid">
                  {marketCars.map(car => (
                    <div key={car.id} className="car-card">
                      <div className="cc-img"><img src={car.photos[0]} alt="" /><div className="cc-tier" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div></div>
                      <div className="cc-body">
                        <div className="cc-name">{car.brand} {car.model}</div>
                        <div className="cc-price-lg">{formatPrice(car.price)}</div>
                        <button className="btn-find" onClick={() => sellFromMarket(car)}>🔍 Найти покупателя</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {screen === 'dealers' && (
          <div className="s-dealers">
            <div className="s-head"><h2>🏢 Автосалоны</h2><span className="res-cnt">100 салонов</span></div>
            <div className="dealers-grid">
              {DEALERS.map(d => (
                <div key={d.id} className="dealer-card">
                  <img src={d.logo} alt="" className="dealer-logo" />
                  <div className="dealer-body">
                    <div className="dealer-name">{d.name}</div>
                    <div className="dealer-city">📍 {d.city}</div>
                    <div className="dealer-tiers">
                      {d.tier.map(t => <span key={t} className="dt-tag" style={{ color: TIER_COLORS[t], borderColor: TIER_COLORS[t] }}>{TIER_LABELS[t]}</span>)}
                    </div>
                    <div className="dealer-meta">
                      <span>🏷️ Скидка {d.discount}%</span>
                      <span>⭐ {d.reputation}/100</span>
                    </div>
                    <button className="btn-visit" onClick={() => { setFilters(f => ({ ...f, tier: d.tier[0] })); setScreen('shop'); }}>🚪 Посетить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'junkyard' && (
          <div className="s-junk">
            <div className="s-head junk-head"><h2>🗑️ Свалка</h2><span className="res-cnt">{wreckedCars.length} убитых авто</span></div>
            <div className="junk-banner">💡 Машины на свалке стоят <b>15% от рыночной цены</b>. Отремонтируй и продай с огромной прибылью!</div>
            <div className="car-grid">
              {wreckedCars.map(car => (
                <div key={car.id} className="car-card junk-car" onClick={() => { setSelectedCar(car); setSelectedPhoto(0); }}>
                  <div className="cc-img">
                    <img src={car.photos[0]} alt="" style={{ filter: 'grayscale(70%) brightness(0.8)' }} />
                    <div className="cc-tier" style={{ background: '#374151' }}>💀 УБИТАЯ</div>
                    <div className="junk-cond">❤️ {car.condition}%</div>
                  </div>
                  <div className="cc-body">
                    <div className="cc-name">{car.brand} {car.model}</div>
                    <div className="cc-junk-desc">{car.description}</div>
                    <div className="cc-foot">
                      <span className="cc-price junk-p">{formatPrice(Math.floor(car.price * 0.15))}</span>
                      <span className="cc-old-p">{formatPrice(car.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'tuning' && (
          <div className="s-tuning">
            <div className="s-head"><h2>🔧 Тюнинг</h2></div>
            {player.ownedCars.length === 0 ? (
              <div className="empty-s big">
                <span>🔧</span>
                <p>Нет машин для тюнинга.</p>
                <button className="btn-go" onClick={() => setScreen('shop')}>Купить машину</button>
              </div>
            ) : (
              <div className="tuning-layout">
                <div className="tuning-sidebar">
                  <h3>Твои машины</h3>
                  {player.ownedCars.map(car => {
                    const tuning = player.carTuning[car.id] || [];
                    return (
                      <div key={car.id} className={`tuning-car ${selectedCar?.id === car.id ? 'sel' : ''}`} onClick={() => { setSelectedCar(car); setSelectedPhoto(0); }}>
                        <img src={car.photos[0]} alt="" className="tc-img" />
                        <div>
                          <div className="tc-name">{car.brand} {car.model}</div>
                          <div className="tc-cnt">🔩 {tuning.length} деталей</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="tuning-main">
                  {selectedCar ? (
                    <div className="tuning-selected-car">
                      <img src={selectedCar.photos[0]} alt="" className="tsc-img" />
                      <div className="tsc-info">
                        <b>{selectedCar.brand} {selectedCar.model}</b>
                        <span>{selectedCar.power} л.с. · {selectedCar.engineVolume}L</span>
                      </div>
                    </div>
                  ) : <div className="tuning-pick">← Выбери машину</div>}
                  {(['engine','exhaust','suspension','exterior','interior','wheels','brakes'] as const).map(cat => {
                    const parts = TUNING_PARTS.filter(p => p.category === cat);
                    const catNames: Record<string, string> = { engine:'⚙️ Двигатель',exhaust:'💨 Выхлоп',suspension:'🔩 Подвеска',exterior:'🎨 Кузов',interior:'🪑 Салон',wheels:'🛞 Колёса',brakes:'🛑 Тормоза' };
                    return (
                      <div key={cat} className="tuning-cat">
                        <div className="tuning-cat-hd">{catNames[cat]}</div>
                        <div className="parts-row">
                          {parts.map(part => {
                            const inst = selectedCar ? (player.carTuning[selectedCar.id] || []).includes(part.id) : false;
                            const ok = player.money >= part.price;
                            return (
                              <div key={part.id} className={`part-card ${inst ? 'inst' : ''}`}>
                                <div className="part-nm">{part.name}</div>
                                <div className="part-ef">{part.effect}</div>
                                <div className="part-foot">
                                  <span className="part-pr">{formatPrice(part.price)}</span>
                                  {inst ? <span className="part-inst">✅ Установлено</span> :
                                    <button className={`btn-inst ${!selectedCar || !ok ? 'dis' : ''}`} onClick={() => selectedCar && applyTuning(selectedCar, part.id, part.price)} disabled={!selectedCar || !ok}>
                                      {!selectedCar ? '← Авто' : !ok ? '❌ Мало' : '🔧 Установить'}
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
              </div>
            )}
          </div>
        )}

        {screen === 'jobs' && (
          <div className="s-jobs">
            <div className="s-head"><h2>💼 Работа</h2><span className="res-cnt">Смен: {player.jobShifts}</span></div>
            <div className="jobs-tip">💡 Работай, чтобы накопить на первую машину для перепродажи!</div>
            <div className="jobs-grid">
              {JOBS.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-ic">{job.icon}</div>
                  <div className="job-nm">{job.title}</div>
                  <div className="job-ds">{job.description}</div>
                  <div className="job-meta">
                    <div>💰 {formatPrice(job.salary)} / смена</div>
                    <div>⏱️ {job.duration / 60}ч смена</div>
                    <div>📋 {job.requirements}</div>
                  </div>
                  <button className="btn-work" onClick={() => doJobShift(job.salary, job.id)}>▶ Отработать смену</button>
                </div>
              ))}
            </div>
            <h3 className="quick-title">Быстрый заработок</h3>
            <div className="quick-jobs">
              {[
                ['🫧','Помыть авто',500],
                ['📦','Доставить груз',1200],
                ['🔍','Техосмотр',2000],
                ['🚕','Разовая поездка',800],
                ['🔨','Мелкий ремонт',3500],
                ['🛣️','Перегон авто',5000],
              ].map(([ic, lb, pay]) => (
                <div key={String(lb)} className="quick-job" onClick={() => { setPlayer(p => ({ ...p, money: p.money + Number(pay) })); notify(`+${formatPrice(Number(pay))} — ${lb}`); }}>
                  <span>{ic}</span><span>{lb}</span><span className="qj-pay">+{formatPrice(Number(pay))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'garage' && (
          <div className="s-garage">
            <div className="s-head"><h2>🚘 Мой Гараж</h2><span className="res-cnt">{player.ownedCars.length} машин</span></div>
            {player.ownedCars.length === 0 ? (
              <div className="empty-s big">
                <span>🏚️</span>
                <p>Гараж пустой. Купи свою первую машину!</p>
                <button className="btn-go" onClick={() => setScreen('shop')}>🏪 В магазин</button>
              </div>
            ) : (
              <div className="car-grid">
                {player.ownedCars.map(car => {
                  const tuning = player.carTuning[car.id] || [];
                  const est = Math.floor(car.price * (1.1 + tuning.length * 0.08));
                  return (
                    <div key={car.id} className="car-card">
                      <div className="cc-img">
                        <img src={car.photos[0]} alt="" />
                        <div className="cc-tier" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                        {tuning.length > 0 && <div className="tuning-badge">🔧×{tuning.length}</div>}
                      </div>
                      <div className="cc-body">
                        <div className="cc-name">{car.brand} {car.model}</div>
                        <div className="cc-meta">{car.year} · {car.mileage.toLocaleString()} км · {car.power} л.с.</div>
                        <div className="cc-profit-row">
                          <span>Куплено: <b>{formatPrice(car.price)}</b></span>
                          <span>Оценка: <b className="profit-g">{formatPrice(est)}</b></span>
                        </div>
                        <div className="garage-acts">
                          <button className="btn-sm-tuning" onClick={() => { setSelectedCar(car); setScreen('tuning'); }}>🔧</button>
                          <button className="btn-sm-sell" onClick={() => listCarOnMarket(car, est)}>💰 Продать</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {screen === 'profile' && (
          <div className="s-profile">
            <div className="prof-hero">
              <div className="prof-avatar">👤</div>
              <div className="prof-name">Перекупщик</div>
              <div className="prof-rank">
                {player.ownedCars.length === 0 ? '🥚 Новичок' :
                  player.money > 1_000_000 ? '💰 Богатый перекупщик' :
                  player.money > 500_000 ? '📈 Опытный перекуп' : '🚗 Начинающий'}
              </div>
            </div>
            <div className="prof-stats">
              {[
                ['💰','Баланс', formatPrice(player.money)],
                ['🚗','Машин в гараже', player.ownedCars.length],
                ['💼','Смен отработано', player.jobShifts],
                ['⭐','Репутация', player.reputation],
                ['🔧','Тюнинг деталей', Object.values(player.carTuning).flat().length],
                ['📋','На продаже', marketCars.length],
              ].map(([ic,lb,v]) => (
                <div key={String(lb)} className="prof-stat">
                  <span className="ps-ic">{ic}</span>
                  <span className="ps-v">{v}</span>
                  <span className="ps-lb">{lb}</span>
                </div>
              ))}
            </div>
            <div className="achievements">
              <h3>Достижения</h3>
              <div className="ach-list">
                {[
                  [player.ownedCars.length >= 1,'🚗','Первая машина'],
                  [player.money >= 1_000_000,'💰','Миллионер'],
                  [player.jobShifts >= 10,'💼','Трудяга (10 смен)'],
                  [Object.values(player.carTuning).flat().length >= 5,'🔧','Тюнер (5 деталей)'],
                  [player.ownedCars.length >= 5,'🏎️','Коллекционер (5 машин)'],
                  [marketCars.length >= 3,'🤝','Торговец (3 объявления)'],
                ].map(([done,ic,lb]) => (
                  <div key={String(lb)} className={`ach-item ${done ? 'done' : ''}`}>
                    <span>{ic}</span><span>{lb}</span>
                    {done && <span className="ach-check">✅</span>}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-reset" onClick={() => { if(window.confirm('Начать заново?')) setPlayer(INITIAL_PLAYER); }}>🔄 Новая игра</button>
          </div>
        )}

      </main>
    </div>
  );
}
