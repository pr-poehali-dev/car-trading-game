import { useState, useMemo } from 'react';
import {
  ALL_CARS, BRANDS, DEALERS, JOBS, TUNING_PARTS,
  type Car, type CarTier, TIER_LABELS, TIER_COLORS,
  formatPrice, WRECKED_CAR_DESCRIPTIONS,
} from '@/data/gameData';
import CityMap from '@/components/CityMap';

type Screen = 'home' | 'shop' | 'market' | 'dealers' | 'junkyard' | 'tuning' | 'jobs' | 'garage' | 'profile';

interface PlayerState {
  money: number;
  ownedCars: Car[];
  jobShifts: number;
  carTuning: Record<string, string[]>;
}

const INIT: PlayerState = { money: 150_000, ownedCars: [], jobShifts: 0, carTuning: {} };
const TIERS: CarTier[] = ['нищие', 'хуже_среднего', 'средние', 'хорошие', 'отличные', 'лакшери'];

function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home');
  const [player, setPlayer] = useState<PlayerState>(INIT);
  const [notif, setNotif] = useState<string | null>(null);
  const [selCar, setSelCar] = useState<Car | null>(null);
  const [selPhoto, setSelPhoto] = useState(0);
  const [marketCars, setMarketCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState({ tier: 'all' as CarTier | 'all', maxPrice: 100_000_000, minYear: 2000, maxYear: 2024, brand: 'all', bodyType: 'all' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  function toast(msg: string) { setNotif(msg); setTimeout(() => setNotif(null), 3000); }

  function nav(s: Screen) { setScreen(s); setSelCar(null); }

  function buyCar(car: Car) {
    if (player.money < car.price) { toast('❌ Недостаточно денег'); return; }
    setPlayer(p => ({ ...p, money: p.money - car.price, ownedCars: [...p.ownedCars, { ...car, ownedByPlayer: true }] }));
    toast(`✅ ${car.brand} ${car.model} куплен!`);
    setSelCar(null);
  }

  function listCar(car: Car, price: number) {
    setPlayer(p => ({ ...p, ownedCars: p.ownedCars.filter(c => c.id !== car.id) }));
    setMarketCars(m => [...m, { ...car, price }]);
    toast(`📋 Выставлен за ${formatPrice(price)}`);
  }

  function tryLell(car: Car) {
    if (Math.random() > 0.3) {
      setMarketCars(m => m.filter(c => c.id !== car.id));
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

  const wrecked = useMemo(() => ALL_CARS.filter((_, i) => i % 15 === 0).map(c => ({
    ...c, isWrecked: true, condition: rnd(5, 25), price: Math.floor(c.price * 0.15),
    description: WRECKED_CAR_DESCRIPTIONS[rnd(0, WRECKED_CAR_DESCRIPTIONS.length - 1)],
  })), []);

  const [selTuningCar, setSelTuningCar] = useState<Car | null>(null);

  const NAV = [
    { id: 'home' as Screen, e: '🏠', l: 'Главная' },
    { id: 'shop' as Screen, e: '🏪', l: 'Магазин' },
    { id: 'market' as Screen, e: '🤝', l: 'Рынок' },
    { id: 'dealers' as Screen, e: '🏢', l: 'Дилеры' },
    { id: 'junkyard' as Screen, e: '🗑️', l: 'Свалка' },
    { id: 'tuning' as Screen, e: '🔧', l: 'Тюнинг' },
    { id: 'jobs' as Screen, e: '💼', l: 'Работа' },
    { id: 'garage' as Screen, e: '🚘', l: 'Гараж' },
    { id: 'profile' as Screen, e: '👤', l: 'Я' },
  ];

  return (
    <div className="gw">
      {/* Toast */}
      {notif && <div className="toast">{notif}</div>}

      {/* Car Modal */}
      {selCar && (
        <div className="modal-bg" onClick={() => setSelCar(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setSelCar(null)}>✕</button>
            <div className="modal-left">
              <img src={selCar.photos[selPhoto]} alt="" className="modal-main-img" />
              <div className="modal-thumbs">
                {selCar.photos.map((p, i) => (
                  <img key={i} src={p} alt="" className={`mthumb ${selPhoto === i ? 'on' : ''}`} onClick={() => setSelPhoto(i)} />
                ))}
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
              {screen === 'shop' && (
                <button className={`m-btn ${player.money < selCar.price ? 'disabled' : ''}`} onClick={() => buyCar(selCar)}>
                  {player.money < selCar.price ? '❌ Не хватает' : `💰 Купить ${formatPrice(selCar.price)}`}
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
        </div>
      </header>

      {/* Nav */}
      <nav className="gn">
        {NAV.map(n => (
          <button key={n.id} className={`gn-b ${screen === n.id ? 'on' : ''}`} onClick={() => nav(n.id)}>
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
                  <span>🚗 2000 авто</span>
                  <span>🏢 100 салонов</span>
                  <span>🏆 150 брендов</span>
                </div>
              </div>
              <CityMap onNavigate={(s) => nav(s as Screen)} currentScreen={screen} />
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

        {/* SHOP */}
        {screen === 'shop' && (
          <div className="s-shop">
            <div className="sh-head">
              <h2>🏪 Магазин</h2>
              <span className="cnt">{filtered.length}</span>
            </div>
            <div className="flt-block">
              <input className="flt-search" placeholder="🔍 Марка или модель..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              <div className="flt-row">
                <select className="flt-s" value={filters.tier} onChange={e => { setFilters(f => ({ ...f, tier: e.target.value as CarTier | 'all' })); setPage(1); }}>
                  <option value="all">Все классы</option>
                  {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                </select>
                <select className="flt-s" value={filters.brand} onChange={e => { setFilters(f => ({ ...f, brand: e.target.value })); setPage(1); }}>
                  <option value="all">Все бренды</option>
                  {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select className="flt-s" value={filters.bodyType} onChange={e => { setFilters(f => ({ ...f, bodyType: e.target.value })); setPage(1); }}>
                  <option value="all">Кузов</option>
                  {['Седан','Хэтчбек','Кроссовер','Внедорожник','Купе','Универсал','Минивэн','Пикап'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="flt-s" onChange={e => { setFilters(f => ({ ...f, maxPrice: +e.target.value || 100_000_000 })); setPage(1); }}>
                  <option value="">Любая цена</option>
                  <option value="350000">до 350 тыс</option>
                  <option value="900000">до 900 тыс</option>
                  <option value="3000000">до 3 млн</option>
                  <option value="10000000">до 10 млн</option>
                </select>
                <div className="flt-yr">
                  <input className="flt-n" type="number" min={2000} max={2024} value={filters.minYear} onChange={e => setFilters(f => ({ ...f, minYear: +e.target.value }))} placeholder="С" />
                  <span>—</span>
                  <input className="flt-n" type="number" min={2000} max={2024} value={filters.maxYear} onChange={e => setFilters(f => ({ ...f, maxYear: +e.target.value }))} placeholder="По" />
                </div>
                <button className="flt-rst" onClick={() => { setFilters({ tier:'all', maxPrice:100_000_000, minYear:2000, maxYear:2024, brand:'all', bodyType:'all' }); setSearch(''); setPage(1); }}>↺</button>
              </div>
            </div>
            <div className="cg">
              {paged.map(car => (
                <div key={car.id} className="cc" onClick={() => { setSelCar(car); setSelPhoto(0); }}>
                  <div className="cc-img">
                    <img src={car.photos[0]} alt="" loading="lazy" />
                    <div className="cc-t" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                    <div className="cc-dot" style={{ background: car.condition > 70 ? '#22c55e' : car.condition > 40 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <div className="cc-b">
                    <div className="cc-nm">{car.brand} {car.model}</div>
                    <div className="cc-mt">{car.year} · {car.mileage.toLocaleString()} км</div>
                    <div className="cc-pr">{formatPrice(car.price)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pgr">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="pg">◀</button>
              <span>{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="pg">▶</button>
            </div>
          </div>
        )}

        {/* MARKET */}
        {screen === 'market' && (
          <div className="s-market">
            <div className="sh-head"><h2>🤝 Авторынок</h2><span className="cnt">{marketCars.length} объявлений</span></div>
            <h3 className="sec-h">Продать из гаража</h3>
            {player.ownedCars.length === 0
              ? <div className="empty">Гараж пуст — <button className="lnk" onClick={() => nav('shop')}>купи машину</button></div>
              : <div className="cg">{player.ownedCars.map(car => {
                  const tun = player.carTuning[car.id] || [];
                  const sp = Math.floor(car.price * (1.15 + tun.length * 0.08));
                  return (
                    <div key={car.id} className="cc">
                      <div className="cc-img">
                        <img src={car.photos[0]} alt="" />
                        <div className="cc-t" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div>
                        {tun.length > 0 && <div className="tun-b">🔧×{tun.length}</div>}
                      </div>
                      <div className="cc-b">
                        <div className="cc-nm">{car.brand} {car.model}</div>
                        <div className="cc-mt cc-green">{formatPrice(car.price)} → {formatPrice(sp)}</div>
                        <button className="btn-a" onClick={() => listCar(car, sp)}>Выставить {formatPrice(sp)}</button>
                      </div>
                    </div>
                  );
                })}</div>}
            {marketCars.length > 0 && <>
              <h3 className="sec-h">Мои объявления</h3>
              <div className="cg">{marketCars.map(car => (
                <div key={car.id} className="cc">
                  <div className="cc-img"><img src={car.photos[0]} alt="" /><div className="cc-t" style={{ background: TIER_COLORS[car.tier] }}>{TIER_LABELS[car.tier]}</div></div>
                  <div className="cc-b">
                    <div className="cc-nm">{car.brand} {car.model}</div>
                    <div className="cc-pr">{formatPrice(car.price)}</div>
                    <button className="btn-b" onClick={() => tryLell(car)}>🔍 Найти покупателя</button>
                  </div>
                </div>
              ))}</div>
            </>}
          </div>
        )}

        {/* DEALERS */}
        {screen === 'dealers' && (
          <div className="s-dealers">
            <div className="sh-head"><h2>🏢 Автосалоны</h2><span className="cnt">100</span></div>
            <div className="dlr-grid">
              {DEALERS.map(d => (
                <div key={d.id} className="dlr-c">
                  <img src={d.logo} alt="" className="dlr-logo" />
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
                    <img src={car.photos[0]} alt="" style={{ filter: 'grayscale(60%) brightness(0.75)' }} />
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
                          <img src={car.photos[0]} alt="" />
                          <div><div className="tc-nm">{car.brand} {car.model}</div><div className="tc-ct">🔩 {cnt}</div></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="tun-main">
                    {selTuningCar && (
                      <div className="tun-sel-car">
                        <img src={selTuningCar.photos[0]} alt="" />
                        <div><b>{selTuningCar.brand} {selTuningCar.model}</b><span>{selTuningCar.power} л.с.</span></div>
                      </div>
                    )}
                    {!selTuningCar && <div className="tun-pick">← Выбери машину</div>}
                    {(['engine','exhaust','suspension','exterior','interior','wheels','brakes'] as const).map(cat => {
                      const parts = TUNING_PARTS.filter(p => p.category === cat);
                      const names: Record<string, string> = { engine:'⚙️ Двигатель', exhaust:'💨 Выхлоп', suspension:'🔩 Подвеска', exterior:'🎨 Кузов', interior:'🪑 Салон', wheels:'🛞 Колёса', brakes:'🛑 Тормоза' };
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
                                          {!selTuningCar ? 'Выбери авто' : !ok ? '❌' : 'Установить'}
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
              {([['🫧','Помыть авто',500],['📦','Доставить груз',1200],['🔍','Техосмотр',2000],['🚕','Поездка',800],['🔨','Ремонт',3500],['🛣️','Перегон авто',5000]] as [string,string,number][]).map(([ic,lb,pay]) => (
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
                        <img src={car.photos[0]} alt="" />
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

        {/* PROFILE */}
        {screen === 'profile' && (
          <div className="s-prof">
            <div className="prof-h">
              <div className="prof-av">👤</div>
              <div className="prof-nm">Перекупщик</div>
              <div className="prof-rk" style={{ color: '#f59e0b' }}>
                {player.money > 1_000_000 ? '💰 Богач' : player.ownedCars.length > 0 ? '🚗 Перекупщик' : '🥚 Новичок'}
              </div>
            </div>
            <div className="prof-sg">
              {([['💰','Баланс',formatPrice(player.money)],['🚗','В гараже',player.ownedCars.length],['💼','Смен',player.jobShifts],['🔧','Тюнинг',Object.values(player.carTuning).flat().length],['📋','На продаже',marketCars.length]] as [string,string,string|number][]).map(([ic,lb,v])=>(
                <div key={lb} className="ps"><span>{ic}</span><b>{v}</b><span>{lb}</span></div>
              ))}
            </div>
            <div className="sec-h">Достижения</div>
            <div className="ach-l">
              {([[player.ownedCars.length>=1,'🚗','Первая машина'],[player.money>=1_000_000,'💰','Миллионер'],[player.jobShifts>=10,'💼','Трудяга'],[Object.values(player.carTuning).flat().length>=5,'🔧','Тюнер'],[player.ownedCars.length>=5,'🏎️','Коллекционер'],[marketCars.length>=3,'🤝','Торговец']] as [boolean,string,string][]).map(([ok,ic,lb])=>(
                <div key={lb} className={`ach ${ok ? 'ok' : ''}`}><span>{ic}</span><span>{lb}</span>{ok && <span>✅</span>}</div>
              ))}
            </div>
            <button className="btn-rst" onClick={() => { if(window.confirm('Начать заново?')) setPlayer(INIT); }}>🔄 Новая игра</button>
          </div>
        )}

      </main>
    </div>
  );
}
