export type CarTier = 'нищие' | 'хуже_среднего' | 'средние' | 'хорошие' | 'отличные' | 'лакшери';

export interface Brand {
  id: string;
  name: string;
  tier: CarTier;
  country: string;
}

export interface Car {
  id: string;
  brandId: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: number; // 1-100
  tier: CarTier;
  photos: string[];
  generation: string;
  engineVolume: number;
  power: number;
  transmission: 'МКПП' | 'АКПП' | 'Вариатор' | 'Робот';
  bodyType: 'Седан' | 'Хэтчбек' | 'Кроссовер' | 'Внедорожник' | 'Купе' | 'Универсал' | 'Минивэн' | 'Пикап' | 'Кабриолет';
  color: string;
  description: string;
  dealerId?: string;
  isWrecked?: boolean;
  isSold?: boolean;
  ownedByPlayer?: boolean;
  tuningLevel?: number;
}

export interface Dealer {
  id: string;
  name: string;
  city: string;
  tier: CarTier[];
  discount: number;
  reputation: number;
  logo: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  salary: number;
  icon: string;
  type: 'courier' | 'taxi' | 'police';
  duration: number; // minutes per shift
  requirements: string;
}

export interface TuningPart {
  id: string;
  name: string;
  category: 'engine' | 'suspension' | 'exterior' | 'interior' | 'wheels' | 'brakes' | 'exhaust';
  price: number;
  effect: string;
  powerBoost?: number;
  conditionBoost?: number;
  priceBoost?: number;
}

export const BRANDS: Brand[] = [
  // НИЩИЕ (20)
  { id: 'dacia', name: 'Dacia', tier: 'нищие', country: 'Румыния' },
  { id: 'lada', name: 'Lada', tier: 'нищие', country: 'Россия' },
  { id: 'daewoo', name: 'Daewoo', tier: 'нищие', country: 'Южная Корея' },
  { id: 'chery', name: 'Chery', tier: 'нищие', country: 'Китай' },
  { id: 'geely', name: 'Geely', tier: 'нищие', country: 'Китай' },
  { id: 'baojun', name: 'Baojun', tier: 'нищие', country: 'Китай' },
  { id: 'faw', name: 'FAW', tier: 'нищие', country: 'Китай' },
  { id: 'proton', name: 'Proton', tier: 'нищие', country: 'Малайзия' },
  { id: 'perodua', name: 'Perodua', tier: 'нищие', country: 'Малайзия' },
  { id: 'tata', name: 'Tata', tier: 'нищие', country: 'Индия' },
  { id: 'maruti', name: 'Maruti Suzuki', tier: 'нищие', country: 'Индия' },
  { id: 'zaz', name: 'ZAZ', tier: 'нищие', country: 'Украина' },
  { id: 'ravon', name: 'Ravon', tier: 'нищие', country: 'Узбекистан' },
  { id: 'wuling', name: 'Wuling', tier: 'нищие', country: 'Китай' },
  { id: 'lifan', name: 'Lifan', tier: 'нищие', country: 'Китай' },
  { id: 'byd', name: 'BYD', tier: 'нищие', country: 'Китай' },
  { id: 'hafei', name: 'Hafei', tier: 'нищие', country: 'Китай' },
  { id: 'brilliance', name: 'Brilliance', tier: 'нищие', country: 'Китай' },
  { id: 'changan', name: 'Changan', tier: 'нищие', country: 'Китай' },
  { id: 'uaz', name: 'UAZ', tier: 'нищие', country: 'Россия' },

  // ХУЖЕ СРЕДНЕГО (30)
  { id: 'renault', name: 'Renault', tier: 'хуже_среднего', country: 'Франция' },
  { id: 'peugeot', name: 'Peugeot', tier: 'хуже_среднего', country: 'Франция' },
  { id: 'citroen', name: 'Citroën', tier: 'хуже_среднего', country: 'Франция' },
  { id: 'fiat', name: 'Fiat', tier: 'хуже_среднего', country: 'Италия' },
  { id: 'opel', name: 'Opel', tier: 'хуже_среднего', country: 'Германия' },
  { id: 'skoda', name: 'Skoda', tier: 'хуже_среднего', country: 'Чехия' },
  { id: 'seat', name: 'Seat', tier: 'хуже_среднего', country: 'Испания' },
  { id: 'kia', name: 'Kia', tier: 'хуже_среднего', country: 'Южная Корея' },
  { id: 'hyundai', name: 'Hyundai', tier: 'хуже_среднего', country: 'Южная Корея' },
  { id: 'suzuki', name: 'Suzuki', tier: 'хуже_среднего', country: 'Япония' },
  { id: 'nissan', name: 'Nissan', tier: 'хуже_среднего', country: 'Япония' },
  { id: 'mitsubishi', name: 'Mitsubishi', tier: 'хуже_среднего', country: 'Япония' },
  { id: 'honda', name: 'Honda', tier: 'хуже_среднего', country: 'Япония' },
  { id: 'mazda', name: 'Mazda', tier: 'хуже_среднего', country: 'Япония' },
  { id: 'chevrolet', name: 'Chevrolet', tier: 'хуже_среднего', country: 'США' },
  { id: 'ford', name: 'Ford', tier: 'хуже_среднего', country: 'США' },
  { id: 'dodge', name: 'Dodge', tier: 'хуже_среднего', country: 'США' },
  { id: 'chrysler', name: 'Chrysler', tier: 'хуже_среднего', country: 'США' },
  { id: 'jeep', name: 'Jeep', tier: 'хуже_среднего', country: 'США' },
  { id: 'isuzu', name: 'Isuzu', tier: 'хуже_среднего', country: 'Япония' },
  { id: 'greatwall', name: 'Great Wall', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'haval', name: 'Haval', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'mg', name: 'MG', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'roewe', name: 'Roewe', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'vinfast', name: 'VinFast', tier: 'хуже_среднего', country: 'Вьетнам' },
  { id: 'omoda', name: 'Omoda', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'jac', name: 'JAC', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'baic', name: 'BAIC', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'dfsk', name: 'DFSK', tier: 'хуже_среднего', country: 'Китай' },
  { id: 'protonx', name: 'Proton X', tier: 'хуже_среднего', country: 'Малайзия' },

  // СРЕДНИЕ (50)
  { id: 'volkswagen', name: 'Volkswagen', tier: 'средние', country: 'Германия' },
  { id: 'toyota', name: 'Toyota', tier: 'средние', country: 'Япония' },
  { id: 'subaru', name: 'Subaru', tier: 'средние', country: 'Япония' },
  { id: 'infiniti', name: 'Infiniti', tier: 'средние', country: 'Япония' },
  { id: 'acura', name: 'Acura', tier: 'средние', country: 'Япония' },
  { id: 'lexus', name: 'Lexus', tier: 'средние', country: 'Япония' },
  { id: 'mini', name: 'Mini', tier: 'средние', country: 'Великобритания' },
  { id: 'smart', name: 'Smart', tier: 'средние', country: 'Германия' },
  { id: 'volvo', name: 'Volvo', tier: 'средние', country: 'Швеция' },
  { id: 'saab', name: 'Saab', tier: 'средние', country: 'Швеция' },
  { id: 'pontiac', name: 'Pontiac', tier: 'средние', country: 'США' },
  { id: 'oldsmobile', name: 'Oldsmobile', tier: 'средние', country: 'США' },
  { id: 'buick', name: 'Buick', tier: 'средние', country: 'США' },
  { id: 'lincoln', name: 'Lincoln', tier: 'средние', country: 'США' },
  { id: 'cadillac', name: 'Cadillac', tier: 'средние', country: 'США' },
  { id: 'gmc', name: 'GMC', tier: 'средние', country: 'США' },
  { id: 'ram', name: 'Ram', tier: 'средние', country: 'США' },
  { id: 'tesla', name: 'Tesla', tier: 'средние', country: 'США' },
  { id: 'rivian', name: 'Rivian', tier: 'средние', country: 'США' },
  { id: 'lucid', name: 'Lucid', tier: 'средние', country: 'США' },
  { id: 'polestar', name: 'Polestar', tier: 'средние', country: 'Швеция' },
  { id: 'cupra', name: 'Cupra', tier: 'средние', country: 'Испания' },
  { id: 'ds', name: 'DS', tier: 'средние', country: 'Франция' },
  { id: 'lancia', name: 'Lancia', tier: 'средние', country: 'Италия' },
  { id: 'alfaromeo', name: 'Alfa Romeo', tier: 'средние', country: 'Италия' },
  { id: 'abarth', name: 'Abarth', tier: 'средние', country: 'Италия' },
  { id: 'ssangyong', name: 'SsangYong', tier: 'средние', country: 'Южная Корея' },
  { id: 'mahindra', name: 'Mahindra', tier: 'средние', country: 'Индия' },
  { id: 'tataev', name: 'Tata EV', tier: 'средние', country: 'Индия' },
  { id: 'exeed', name: 'Exeed', tier: 'средние', country: 'Китай' },
  { id: 'luxeed', name: 'Luxeed', tier: 'средние', country: 'Китай' },
  { id: 'aito', name: 'AITO', tier: 'средние', country: 'Китай' },
  { id: 'maxus', name: 'Maxus', tier: 'средние', country: 'Китай' },
  { id: 'hongqi', name: 'Hongqi', tier: 'средние', country: 'Китай' },
  { id: 'jetta', name: 'Jetta', tier: 'средние', country: 'Китай' },
  { id: 'saturn', name: 'Saturn', tier: 'средние', country: 'США' },
  { id: 'scion', name: 'Scion', tier: 'средние', country: 'США' },
  { id: 'eagle', name: 'Eagle', tier: 'средние', country: 'США' },
  { id: 'holden', name: 'Holden', tier: 'средние', country: 'Австралия' },
  { id: 'cheryexeed', name: 'Chery Exeed', tier: 'средние', country: 'Китай' },
  { id: 'geelygeometry', name: 'Geely Geometry', tier: 'средние', country: 'Китай' },
  { id: 'fawbestune', name: 'FAW Bestune', tier: 'средние', country: 'Китай' },
  { id: 'changanuni', name: 'Changan UNI', tier: 'средние', country: 'Китай' },
  { id: 'nissanleaf', name: 'Nissan Leaf', tier: 'средние', country: 'Япония' },
  { id: 'suzukijimny', name: 'Suzuki Jimny', tier: 'средние', country: 'Япония' },
  { id: 'protonpremium', name: 'Proton Premium', tier: 'средние', country: 'Малайзия' },
  { id: 'perodyabezza', name: 'Perodua Bezza', tier: 'средние', country: 'Малайзия' },
  { id: 'wulingev', name: 'Wuling EV', tier: 'средние', country: 'Китай' },
  { id: 'roewerx', name: 'Roewe RX', tier: 'средние', country: 'Китай' },
  { id: 'jaguarbasic', name: 'Jaguar Classic', tier: 'средние', country: 'Великобритания' },

  // ХОРОШИЕ (30)
  { id: 'audi', name: 'Audi', tier: 'хорошие', country: 'Германия' },
  { id: 'bmw', name: 'BMW', tier: 'хорошие', country: 'Германия' },
  { id: 'mercedes', name: 'Mercedes-Benz', tier: 'хорошие', country: 'Германия' },
  { id: 'jaguar', name: 'Jaguar', tier: 'хорошие', country: 'Великобритания' },
  { id: 'landrover', name: 'Land Rover', tier: 'хорошие', country: 'Великобритания' },
  { id: 'porsche', name: 'Porsche', tier: 'хорошие', country: 'Германия' },
  { id: 'maserati', name: 'Maserati', tier: 'хорошие', country: 'Италия' },
  { id: 'genesis', name: 'Genesis', tier: 'хорошие', country: 'Южная Корея' },
  { id: 'acuratypes', name: 'Acura Type S', tier: 'хорошие', country: 'Япония' },
  { id: 'lexusf', name: 'Lexus F', tier: 'хорошие', country: 'Япония' },
  { id: 'infinitirs', name: 'Infiniti Red Sport', tier: 'хорошие', country: 'Япония' },
  { id: 'volvopolestar', name: 'Volvo Polestar', tier: 'хорошие', country: 'Швеция' },
  { id: 'teslaplaid', name: 'Tesla Plaid', tier: 'хорошие', country: 'США' },
  { id: 'polestarperf', name: 'Polestar Performance', tier: 'хорошие', country: 'Швеция' },
  { id: 'alpine', name: 'Alpine', tier: 'хорошие', country: 'Франция' },
  { id: 'cuprar', name: 'Cupra R', tier: 'хорошие', country: 'Испания' },
  { id: 'cadillacv', name: 'Cadillac V', tier: 'хорошие', country: 'США' },
  { id: 'lincolnbl', name: 'Lincoln Black Label', tier: 'хорошие', country: 'США' },
  { id: 'buickavenir', name: 'Buick Avenir', tier: 'хорошие', country: 'США' },
  { id: 'chryslersrt', name: 'Chrysler SRT', tier: 'хорошие', country: 'США' },
  { id: 'dodgesrt', name: 'Dodge SRT', tier: 'хорошие', country: 'США' },
  { id: 'jeeptrackh', name: 'Jeep Trackhawk', tier: 'хорошие', country: 'США' },
  { id: 'ramtrx', name: 'Ram TRX', tier: 'хорошие', country: 'США' },
  { id: 'gmcdenali', name: 'GMC Denali', tier: 'хорошие', country: 'США' },
  { id: 'fordst', name: 'Ford ST', tier: 'хорошие', country: 'США' },
  { id: 'vwr', name: 'Volkswagen R', tier: 'хорошие', country: 'Германия' },
  { id: 'subaruwrx', name: 'Subaru WRX', tier: 'хорошие', country: 'Япония' },
  { id: 'mitsubevo', name: 'Mitsubishi Evolution', tier: 'хорошие', country: 'Япония' },
  { id: 'nissannismo', name: 'Nissan Nismo', tier: 'хорошие', country: 'Япония' },
  { id: 'toyotagr', name: 'Toyota GR', tier: 'хорошие', country: 'Япония' },

  // ОТЛИЧНЫЕ (10)
  { id: 'ferrari', name: 'Ferrari', tier: 'отличные', country: 'Италия' },
  { id: 'lamborghini', name: 'Lamborghini', tier: 'отличные', country: 'Италия' },
  { id: 'mclaren', name: 'McLaren', tier: 'отличные', country: 'Великобритания' },
  { id: 'astonmartin', name: 'Aston Martin', tier: 'отличные', country: 'Великобритания' },
  { id: 'bugatti', name: 'Bugatti', tier: 'отличные', country: 'Франция' },
  { id: 'pagani', name: 'Pagani', tier: 'отличные', country: 'Италия' },
  { id: 'koenigsegg', name: 'Koenigsegg', tier: 'отличные', country: 'Швеция' },
  { id: 'rimac', name: 'Rimac', tier: 'отличные', country: 'Хорватия' },
  { id: 'lotus', name: 'Lotus', tier: 'отличные', country: 'Великобритания' },
  { id: 'noble', name: 'Noble', tier: 'отличные', country: 'Великобритания' },

  // ЛАКШЕРИ (10)
  { id: 'rollsroyce', name: 'Rolls-Royce', tier: 'лакшери', country: 'Великобритания' },
  { id: 'bentley', name: 'Bentley', tier: 'лакшери', country: 'Великобритания' },
  { id: 'maybach', name: 'Maybach', tier: 'лакшери', country: 'Германия' },
  { id: 'hongqipremium', name: 'Hongqi Premium', tier: 'лакшери', country: 'Китай' },
  { id: 'aurus', name: 'Aurus', tier: 'лакшери', country: 'Россия' },
  { id: 'cadillaccelestiq', name: 'Cadillac Celestiq', tier: 'лакшери', country: 'США' },
  { id: 'genesisg90', name: 'Genesis G90', tier: 'лакшери', country: 'Южная Корея' },
  { id: 'lexusls', name: 'Lexus LS', tier: 'лакшери', country: 'Япония' },
  { id: 'mercedesmaybach', name: 'Mercedes-Maybach', tier: 'лакшери', country: 'Германия' },
  { id: 'rangeroversv', name: 'Range Rover SV', tier: 'лакшери', country: 'Великобритания' },
];

const COLORS = ['Белый', 'Чёрный', 'Серебристый', 'Серый', 'Синий', 'Красный', 'Зелёный', 'Бежевый', 'Коричневый', 'Золотой', 'Бордовый', 'Оранжевый'];
const TRANSMISSIONS: Car['transmission'][] = ['МКПП', 'АКПП', 'Вариатор', 'Робот'];
const BODY_TYPES: Car['bodyType'][] = ['Седан', 'Хэтчбек', 'Кроссовер', 'Внедорожник', 'Купе', 'Универсал', 'Минивэн', 'Пикап', 'Кабриолет'];

const TIER_PRICE_RANGES: Record<CarTier, [number, number]> = {
  'нищие': [50_000, 350_000],
  'хуже_среднего': [300_000, 900_000],
  'средние': [800_000, 3_000_000],
  'хорошие': [2_500_000, 10_000_000],
  'отличные': [8_000_000, 40_000_000],
  'лакшери': [15_000_000, 100_000_000],
};

const TIER_POWER_RANGES: Record<CarTier, [number, number]> = {
  'нищие': [60, 120],
  'хуже_среднего': [80, 180],
  'средние': [120, 280],
  'хорошие': [200, 500],
  'отличные': [400, 1200],
  'лакшери': [300, 700],
};

const CAR_MODELS: Record<string, string[]> = {
  dacia: ['Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Spring'],
  lada: ['Vesta', 'Granta', 'Niva', 'Priora', 'Kalina', 'Largus', 'XRAY'],
  daewoo: ['Matiz', 'Nexia', 'Lanos', 'Sens', 'Espero', 'Leganza'],
  chery: ['Tiggo', 'Arrizo', 'QQ', 'Exeed', 'Omoda', 'Tiggo Pro'],
  geely: ['Atlas', 'Coolray', 'Tugella', 'Monjaro', 'Emgrand', 'Okavango'],
  baojun: ['560', '730', 'RS-5', 'RM-5', '530', '630'],
  faw: ['Besturn', 'Senia', 'Hongqi', 'Bestune', 'T77', 'B50'],
  proton: ['Saga', 'Persona', 'Iriz', 'X70', 'Exora', 'Ertiga'],
  perodua: ['Myvi', 'Axia', 'Bezza', 'Ativa', 'Aruz', 'Alza'],
  tata: ['Nexon', 'Harrier', 'Safari', 'Tiago', 'Punch', 'Tigor'],
  maruti: ['Swift', 'Baleno', 'Vitara Brezza', 'Alto', 'WagonR', 'Ertiga'],
  zaz: ['Sens', 'Lanos', 'Forza', 'Vida', 'Tavria', 'Slavuta'],
  ravon: ['R4', 'R2', 'Gentra', 'Nexia R3', 'Cobalt', 'Damas'],
  wuling: ['Hongguang', 'Almaz', 'Macaron', 'Asta', 'Cortez', 'Confero'],
  lifan: ['X60', 'X70', 'X80', 'Murman', 'Smily', 'Cebrium'],
  byd: ['F3', 'S7', 'Han', 'Song', 'Atto 3', 'Seal'],
  hafei: ['Saima', 'Brio', 'Lobo', 'Princip', 'Sigra', 'HFJ'],
  brilliance: ['V5', 'H330', 'H320', 'FRV', 'BS6', 'H230'],
  changan: ['CS35', 'CS55', 'CS75', 'Alsvin', 'UNI-T', 'Raeton'],
  uaz: ['Patriot', 'Hunter', 'Pickup', 'Буханка', '469', 'Cargo'],
  renault: ['Logan', 'Sandero', 'Duster', 'Megane', 'Captur', 'Koleos', 'Arkana'],
  peugeot: ['208', '308', '508', '2008', '3008', '5008', '408'],
  citroen: ['C3', 'C4', 'C5 X', 'Berlingo', 'Jumpy', 'Picasso'],
  fiat: ['500', 'Panda', 'Tipo', 'Punto', 'Bravo', '500X'],
  opel: ['Astra', 'Corsa', 'Mokka', 'Zafira', 'Insignia', 'Crossland'],
  skoda: ['Octavia', 'Superb', 'Fabia', 'Kodiaq', 'Karoq', 'Scala'],
  seat: ['Ibiza', 'Leon', 'Ateca', 'Arona', 'Tarraco', 'Toledo'],
  kia: ['Rio', 'Ceed', 'Sportage', 'Sorento', 'Stinger', 'Carnival', 'K8'],
  hyundai: ['Solaris', 'Elantra', 'Tucson', 'Santa Fe', 'Palisade', 'Ioniq 5'],
  suzuki: ['Swift', 'Vitara', 'SX4', 'Jimny', 'Ignis', 'Baleno'],
  nissan: ['Almera', 'Teana', 'X-Trail', 'Qashqai', 'Murano', 'Pathfinder', 'Juke'],
  mitsubishi: ['Lancer', 'Outlander', 'ASX', 'Eclipse Cross', 'Pajero', 'L200'],
  honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz', 'Pilot'],
  mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5', 'CX-30'],
  chevrolet: ['Cruze', 'Camaro', 'Malibu', 'Equinox', 'Traverse', 'Suburban'],
  ford: ['Focus', 'Fusion', 'Mustang', 'Explorer', 'Ranger', 'F-150'],
  dodge: ['Charger', 'Challenger', 'Durango', 'Journey', 'Dart', 'Viper'],
  chrysler: ['300', 'Pacifica', 'Sebring', 'Aspen', '200', 'PT Cruiser'],
  jeep: ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Commander'],
  isuzu: ['D-Max', 'MU-X', 'Trooper', 'Rodeo', 'Bighorn', 'Elf'],
  greatwall: ['Wingle', 'Deer', 'Peri', 'Hover', 'M4', 'Safe'],
  haval: ['F7', 'H6', 'Jolion', 'F7x', 'H9', 'Dargo'],
  mg: ['ZS', 'HS', 'MG5', 'MG6', 'Extender', 'RX8'],
  roewe: ['350', '550', 'RX5', 'i6', '360', 'ei6'],
  vinfast: ['VF5', 'VF6', 'VF7', 'VF8', 'VF9', 'Lux A2.0'],
  omoda: ['C5', 'S5', 'E5', 'C7', 'F7', 'X5'],
  jac: ['J7', 'S3', 'S7', 'T8', 'Sei 7', 'EJ4'],
  baic: ['X55', 'X65', 'BJ40', 'EU5', 'Senova', 'EC3'],
  dfsk: ['Glory 580', 'Glory 330', 'EC31', 'K07', 'C37', 'EC35'],
  protonx: ['X50', 'X70', 'X90', 'X70 C', 'S70', 'X50 Premium'],
  volkswagen: ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'Phaeton', 'Arteon'],
  toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Highlander', 'Prius', 'Supra'],
  subaru: ['Impreza', 'Legacy', 'Forester', 'Outback', 'Crosstrek', 'BRZ'],
  infiniti: ['Q50', 'Q60', 'QX50', 'QX80', 'Q70', 'QX30'],
  acura: ['TLX', 'MDX', 'RDX', 'ILX', 'NSX', 'ZDX'],
  lexus: ['IS', 'ES', 'GS', 'LS', 'RX', 'GX', 'LX'],
  mini: ['Cooper', 'Clubman', 'Countryman', 'Paceman', 'Convertible', 'Coupe'],
  smart: ['ForTwo', 'ForFour', 'Crossblade', 'Roadster', '#1', '#3'],
  volvo: ['S60', 'S90', 'V60', 'XC40', 'XC60', 'XC90'],
  saab: ['9-3', '9-5', '9-7X', '900', '9000', '9-4X'],
  pontiac: ['Firebird', 'GTO', 'Bonneville', 'Grand Am', 'Trans Am', 'G8'],
  oldsmobile: ['Alero', 'Aurora', 'Cutlass', 'Intrigue', 'Silhouette', 'Bravada'],
  buick: ['Encore', 'Enclave', 'LaCrosse', 'Regal', 'Verano', 'Envision'],
  lincoln: ['Continental', 'Navigator', 'MKZ', 'Corsair', 'Aviator', 'Nautilus'],
  cadillac: ['CT4', 'CT5', 'CT6', 'XT4', 'XT5', 'Escalade'],
  gmc: ['Sierra', 'Yukon', 'Terrain', 'Acadia', 'Canyon', 'Envoy'],
  ram: ['1500', '2500', '3500', 'ProMaster', 'Dakota', 'Rebel'],
  tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Roadster', 'Cybertruck'],
  rivian: ['R1T', 'R1S', 'R2', 'R3', 'Commercial Van', 'R1T Max Pack'],
  lucid: ['Air', 'Air Grand Touring', 'Air Dream Edition', 'Gravity', 'Air Pure', 'Air Touring'],
  polestar: ['1', '2', '3', '4', '5', '6'],
  cupra: ['Formentor', 'Leon', 'Born', 'Ateca', 'Terramar', 'Tavascan'],
  ds: ['DS3', 'DS4', 'DS7', 'DS9', 'DS3 Crossback', 'DS4 Crossback'],
  lancia: ['Delta', 'Ypsilon', 'Stratos', 'Fulvia', 'Thesis', 'Musa'],
  alfaromeo: ['Giulia', 'Stelvio', 'Tonale', '147', '156', 'GTV'],
  abarth: ['500', '595', '695', '124 Spider', 'Punto', '124 Rally'],
  ssangyong: ['Rexton', 'Tivoli', 'Korando', 'Musso', 'Actyon', 'Rodius'],
  mahindra: ['Thar', 'Scorpio', 'XUV700', 'XUV300', 'Bolero', 'Marazzo'],
  tataev: ['Nexon EV', 'Tigor EV', 'Punch EV', 'Aria EV', 'Altroz EV', 'Curvv EV'],
  exeed: ['TX', 'TXL', 'LX', 'VX', 'RX', 'LX EV'],
  luxeed: ['S7', 'R7', 'U9', 'E1', 'Pro', 'Ultra'],
  aito: ['M5', 'M7', 'M9', 'M5 EV', 'M7 Pro', 'M9 Ultra'],
  maxus: ['G50', 'D60', 'T60', 'G10', 'eDeliver', 'MIFA'],
  hongqi: ['H5', 'H7', 'H9', 'E-QM5', 'HS5', 'HS7'],
  jetta: ['VA3', 'VS5', 'VS7', 'VS2', 'VA5', 'VS3'],
  saturn: ['Vue', 'Ion', 'Aura', 'Outlook', 'Sky', 'Relay'],
  scion: ['tC', 'xB', 'xD', 'FR-S', 'iQ', 'iM'],
  eagle: ['Talon', 'Vision', 'Summit', 'Premier', 'Medallion', '2000 GTX'],
  holden: ['Commodore', 'Astra', 'Cruze', 'Barina', 'Colorado', 'Captiva'],
  cheryexeed: ['TX', 'LX', 'VX', 'RX', 'TXL', 'EX'],
  geelygeometry: ['C', 'A', 'E', 'M6', 'G6', 'A Pro'],
  fawbestune: ['T77', 'T99', 'B70', 'T55', 'A5', 'B50'],
  changanuni: ['UNI-T', 'UNI-K', 'UNI-V', 'UNI-Z', 'UNI-T Pro', 'UNI-S'],
  nissanleaf: ['Leaf 40', 'Leaf e+', 'Leaf Zero', 'Leaf Plus', 'Leaf X', 'Leaf S'],
  suzukijimny: ['Jimny GL', 'Jimny GLX', 'Jimny JLX', 'Jimny Sierra', 'Jimny JX', 'Jimny JIS'],
  protonpremium: ['X50 Premium', 'X70 Premium', 'S70 Premium', 'Saga Premium', 'Iriz Premium', 'Ertiga Premium'],
  perodyabezza: ['Bezza 1.0', 'Bezza 1.3', 'Bezza G', 'Bezza X', 'Bezza Premium', 'Bezza Advance'],
  wulingev: ['Hongguang Mini EV', 'Nano EV', 'Macaron EV', 'Air EV', 'Bingo EV', 'Cloud EV'],
  roewerx: ['RX5', 'RX8', 'RX3', 'RX5 Max', 'RX5 Plus', 'RX5 Pro'],
  jaguarbasic: ['XF Classic', 'XJ Classic', 'S-Type', 'X-Type', 'XK8', 'XKR'],
  audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'R8', 'TT'],
  bmw: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'M3', 'M5'],
  mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'AMG GT'],
  jaguar: ['XF', 'XJ', 'F-Pace', 'E-Pace', 'I-Pace', 'F-Type'],
  landrover: ['Discovery', 'Defender', 'Range Rover', 'Freelander', 'Evoque', 'Velar'],
  porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster'],
  maserati: ['Ghibli', 'Quattroporte', 'Levante', 'Granturismo', 'Grancabrio', 'MC20'],
  genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80', 'GV60'],
  acuratypes: ['TLX Type S', 'MDX Type S', 'NSX Type S', 'RDX A-Spec', 'ILX A-Spec', 'ZDX A-Spec'],
  lexusf: ['IS F', 'GS F', 'RC F', 'LC F', 'LFA', 'IS 500 F'],
  infinitirs: ['Q50 Red Sport', 'Q60 Red Sport', 'QX55 RS', 'Q50 RS 400', 'Q60 RS', 'QX60 RS'],
  volvopolestar: ['V60 Polestar', 'S60 Polestar', 'XC60 Polestar', 'C30 Polestar', 'S40 Polestar', 'V40 Polestar'],
  teslaplaid: ['Model S Plaid', 'Model X Plaid', 'Model 3 Performance', 'Cybertruck CyberBeast', 'Roadster Sport', 'Semi Plaid'],
  polestarperf: ['Polestar 1 Performance', 'Polestar 2 Performance', 'Polestar 3 Long Range', 'Polestar 4 Performance', 'Polestar 5 GT', 'Polestar 6 Roadster'],
  alpine: ['A110', 'A110 S', 'A110 GT', 'A110 R', 'A110 Première', 'A110 Color Edition'],
  cuprar: ['Formentor VZ5', 'Leon VZ5', 'Ateca VZ5', 'Born 231', 'Formentor VZ', 'Leon R'],
  cadillacv: ['CT4-V', 'CT5-V', 'CT4-V Blackwing', 'CT5-V Blackwing', 'CTS-V', 'ATS-V'],
  lincolnbl: ['Navigator Black Label', 'Corsair BL', 'Aviator BL', 'Continental BL', 'Nautilus BL', 'MKZ BL'],
  buickavenir: ['Enclave Avenir', 'Enclave Avenir Sport', 'Encore GX Avenir', 'LaCrosse Avenir', 'Envision Avenir', 'GL8 Avenir'],
  chryslersrt: ['300 SRT8', '300C SRT', 'Voyager SRT', 'Pacifica SRT', 'Aspen SRT', '300S SRT'],
  dodgesrt: ['Charger SRT', 'Challenger SRT', 'Durango SRT', 'Viper SRT', 'Charger SRT Hellcat', 'Challenger SRT Demon'],
  jeeptrackh: ['Grand Cherokee Trackhawk', 'Wrangler Rubicon 392', 'Gladiator Mojave', 'Commander Trackhawk', 'Renegade Trailhawk', 'Grand Wagoneer'],
  ramtrx: ['1500 TRX', '2500 Power Wagon', '3500 Laramie', 'TRX Launch Edition', '1500 TRX Havoc', 'TRX Sandblast'],
  gmcdenali: ['Sierra Denali', 'Yukon Denali', 'Sierra Denali Ultimate', 'Yukon XL Denali', 'Canyon Denali', 'Envoy Denali'],
  fordst: ['Focus ST', 'Fiesta ST', 'Mustang GT', 'Puma ST', 'Explorer ST', 'Edge ST'],
  vwr: ['Golf R', 'Polo R WRC', 'Arteon R', 'Tiguan R', 'T-Roc R', 'Passat R-Line'],
  subaruwrx: ['WRX STI', 'WRX TR', 'WRX GT', 'WRX STI S207', 'WRX STI S209', 'WRX STI EJ20'],
  mitsubevo: ['Lancer Evolution X', 'Evo IX', 'Evo VIII', 'Evo VII GSR', 'Evo VI TME', 'Evo RS'],
  nissannismo: ['GT-R Nismo', '370Z Nismo', 'Juke Nismo', 'Leaf Nismo', 'Micra Nismo', '400Z Nismo'],
  toyotagr: ['GR Supra', 'GR86', 'GR Yaris', 'GR Corolla', 'Land Cruiser GR', 'Crown Sport'],
  ferrari: ['SF90', '296 GTB', 'Roma', 'Portofino', 'F8 Tributo', '812 Superfast', 'GTC4Lusso'],
  lamborghini: ['Huracán', 'Urus', 'Revuelto', 'Huracán Sterrato', 'Sián', 'Veneno'],
  mclaren: ['720S', '765LT', 'GT', 'Artura', '570S', '600LT', 'Senna'],
  astonmartin: ['Vantage', 'DB11', 'DBS', 'DBX', 'Valkyrie', 'Vanquish'],
  bugatti: ['Chiron', 'Veyron', 'Divo', 'Bolide', 'Mistral', 'Tourbillon'],
  pagani: ['Huayra', 'Zonda', 'Utopia', 'Huayra R', 'Imola', 'Tricolore'],
  koenigsegg: ['Jesko', 'Regera', 'Gemera', 'CC850', 'Agera RS', 'One:1'],
  rimac: ['Nevera', 'Nevera R', 'C_One', 'Concept_Two', 'Nevera Time Attack', 'Nevera Origin'],
  lotus: ['Emira', 'Eletre', 'Evija', 'Exige', 'Elise', 'Evora'],
  noble: ['M600', 'M400', 'M500', 'M12', 'M10', 'M14'],
  rollsroyce: ['Phantom', 'Ghost', 'Wraith', 'Dawn', 'Cullinan', 'Spectre'],
  bentley: ['Continental GT', 'Flying Spur', 'Bentayga', 'Mulsanne', 'Bacalar', 'Batur'],
  maybach: ['S580', 'S650', 'GLS600', 'S560', 'S680', 'EQS SUV'],
  hongqipremium: ['H9 Premium', 'L5', 'E-HS9', 'HS9 Grand', 'HQ9', 'L9'],
  aurus: ['Senat', 'Komendant', 'Senat Limousine', 'Arsenal', 'Merlon', 'Senat Cabriolet'],
  cadillaccelestiq: ['Celestiq Ultra', 'Celestiq Show Car', 'Celestiq Executive', 'Celestiq Preview', 'Celestiq First Edition', 'Celestiq Masterwork'],
  genesisg90: ['G90 LWB', 'G90 EV', 'G90 3.5T', 'G90 President', 'G90 Executive', 'G90 Limousine'],
  lexusls: ['LS 500', 'LS 500h', 'LS 500 F-Sport', 'LS 600hL', 'LS 460 L', 'LM 350h'],
  mercedesmaybach: ['S650', 'S680', 'GLS600', 'EQS SUV', 'S560', 'Night Series'],
  rangeroversv: ['Range Rover SV', 'Range Rover SV Autobiography', 'Range Rover SV Bespoke', 'Defender SV', 'Sport SV Edition', 'Autobiography LWB'],
};

function rnd(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CAR_PHOTO_THEMES = [
  'front view on showroom floor',
  'side profile on city street',
  'rear view at sunset',
  'interior dashboard cockpit',
  'engine bay close-up',
];

function generatePhotos(brand: string, model: string): string[] {
  return CAR_PHOTO_THEMES.map((_, i) => 
    `https://picsum.photos/seed/${brand.replace(/\s/g,'')}-${model.replace(/\s/g,'')}-${i}/800/500`
  );
}

function generateCars(): Car[] {
  const cars: Car[] = [];
  let id = 1;

  for (const brand of BRANDS) {
    const models = CAR_MODELS[brand.id] || ['Model A', 'Model B', 'Model C'];
    const [minPrice, maxPrice] = TIER_PRICE_RANGES[brand.tier];
    const [minPow, maxPow] = TIER_POWER_RANGES[brand.tier];
    
    // ~13 cars per brand on average to reach ~2000
    const carsPerBrand = Math.ceil(2000 / BRANDS.length);
    
    for (let i = 0; i < carsPerBrand; i++) {
      const model = models[i % models.length];
      const year = rnd(2000, 2024);
      const generation = `${Math.floor((year - 2000) / 4) + 1} поколение`;
      const price = rnd(minPrice, maxPrice);
      const mileage = rnd(0, 300000);
      const condition = Math.max(10, 100 - Math.floor(mileage / 5000));

      cars.push({
        id: `car-${id++}`,
        brandId: brand.id,
        brand: brand.name,
        model,
        year,
        price,
        mileage,
        condition,
        tier: brand.tier,
        photos: generatePhotos(brand.name, `${model}-${year}`),
        generation,
        engineVolume: parseFloat((rnd(10, 60) / 10).toFixed(1)),
        power: rnd(minPow, maxPow),
        transmission: pick(TRANSMISSIONS),
        bodyType: pick(BODY_TYPES),
        color: pick(COLORS),
        description: `${brand.name} ${model} ${year} года — надёжный автомобиль в хорошем состоянии.`,
      });
    }
  }

  return cars.slice(0, 2000);
}

export const ALL_CARS: Car[] = generateCars();

export const DEALERS: Dealer[] = Array.from({ length: 100 }, (_, i) => {
  const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань', 'Краснодар', 'Нижний Новгород', 'Воронеж', 'Самара', 'Уфа'];
  const names = ['АвтоПремиум', 'МегаАвто', 'АвтоМир', 'КарХаус', 'АвтоЦентр', 'АвтоДрайв', 'МоторМаркет', 'АвтоЭлит', 'КарПлаза', 'АвтоСити'];
  const tiers: CarTier[][] = [
    ['нищие', 'хуже_среднего'],
    ['средние'],
    ['хорошие', 'отличные'],
    ['лакшери'],
    ['нищие', 'хуже_среднего', 'средние'],
  ];
  return {
    id: `dealer-${i + 1}`,
    name: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    city: cities[i % cities.length],
    tier: tiers[i % tiers.length],
    discount: rnd(0, 15),
    reputation: rnd(60, 100),
    logo: `https://picsum.photos/seed/dealer${i}/100/100`,
  };
});

export const JOBS: Job[] = [
  {
    id: 'courier',
    title: 'Курьер',
    description: 'Доставляй посылки по городу на своём авто. Доход зависит от количества доставок.',
    salary: 2500,
    icon: '📦',
    type: 'courier',
    duration: 480,
    requirements: 'Любой автомобиль',
  },
  {
    id: 'taxi',
    title: 'Таксист',
    description: 'Подвози пассажиров и зарабатывай на каждой поездке. Чем лучше машина — тем выше рейтинг.',
    salary: 4000,
    icon: '🚕',
    type: 'taxi',
    duration: 480,
    requirements: 'Состояние авто > 50%',
  },
  {
    id: 'police',
    title: 'Полицейский',
    description: 'Патрулируй улицы и получай стабильную зарплату от государства. Нужен служебный транспорт.',
    salary: 6000,
    icon: '🚔',
    type: 'police',
    duration: 720,
    requirements: 'Состояние авто > 70%',
  },
];

export const TUNING_PARTS: TuningPart[] = [
  // Engine
  { id: 'turbo', name: 'Турбокит', category: 'engine', price: 120000, effect: '+25% мощности', powerBoost: 25, priceBoost: 15 },
  { id: 'sport-exhaust', name: 'Спортивный выхлоп', category: 'exhaust', price: 45000, effect: '+10% мощности, спортивный звук', powerBoost: 10, priceBoost: 8 },
  { id: 'chip-tuning', name: 'Чип-тюнинг', category: 'engine', price: 25000, effect: '+15% мощности', powerBoost: 15, priceBoost: 10 },
  { id: 'air-filter', name: 'Спортивный воздушный фильтр', category: 'engine', price: 8000, effect: '+5% мощности', powerBoost: 5, priceBoost: 3 },
  { id: 'intercooler', name: 'Интеркулер', category: 'engine', price: 65000, effect: '+20% мощности при наличии турбо', powerBoost: 20, priceBoost: 12 },
  // Suspension
  { id: 'sport-suspension', name: 'Спортивная подвеска', category: 'suspension', price: 85000, effect: 'Улучшение управляемости', priceBoost: 10 },
  { id: 'coilovers', name: 'Койловеры', category: 'suspension', price: 130000, effect: 'Регулируемая подвеска', priceBoost: 15 },
  { id: 'strut-bar', name: 'Распорка стоек', category: 'suspension', price: 15000, effect: 'Жёсткость кузова +10%', priceBoost: 5 },
  // Exterior
  { id: 'body-kit', name: 'Обвес', category: 'exterior', price: 95000, effect: 'Спортивный вид', priceBoost: 20 },
  { id: 'spoiler', name: 'Спойлер', category: 'exterior', price: 35000, effect: 'Аэродинамика +15%', priceBoost: 8 },
  { id: 'hood-vents', name: 'Капот с вентиляцией', category: 'exterior', price: 42000, effect: 'Охлаждение двигателя', priceBoost: 6 },
  { id: 'vinyl-wrap', name: 'Виниловая плёнка', category: 'exterior', price: 55000, effect: 'Кастомный цвет', priceBoost: 12 },
  { id: 'tinted-windows', name: 'Тонировка стёкол', category: 'exterior', price: 18000, effect: 'Защита от UV, стиль', priceBoost: 4 },
  // Interior
  { id: 'sport-seats', name: 'Спортивные сиденья Recaro', category: 'interior', price: 180000, effect: 'Стиль + комфорт', priceBoost: 18 },
  { id: 'steering-wheel', name: 'Спортивный руль', category: 'interior', price: 25000, effect: 'Управляемость', priceBoost: 5 },
  { id: 'carbon-trim', name: 'Карбоновый декор', category: 'interior', price: 48000, effect: 'Премиальный вид', priceBoost: 10 },
  { id: 'led-interior', name: 'Ambient подсветка', category: 'interior', price: 22000, effect: 'Атмосфера', priceBoost: 6 },
  // Wheels
  { id: 'sport-wheels-18', name: 'Диски R18 кованые', category: 'wheels', price: 95000, effect: 'Внешний вид + управляемость', priceBoost: 12 },
  { id: 'sport-wheels-20', name: 'Диски R20 кованые', category: 'wheels', price: 155000, effect: 'Премиальный вид', priceBoost: 18 },
  { id: 'sport-tires', name: 'Спортивные шины', category: 'wheels', price: 72000, effect: 'Сцепление +20%', priceBoost: 8 },
  // Brakes
  { id: 'brembo-brakes', name: 'Тормоза Brembo', category: 'brakes', price: 220000, effect: 'Торможение -30%', priceBoost: 22 },
  { id: 'sport-brakes', name: 'Спортивные тормоза', category: 'brakes', price: 85000, effect: 'Торможение -15%', priceBoost: 10 },
];

export const WRECKED_CAR_DESCRIPTIONS = [
  'Сильное ДТП, кузов деформирован',
  'Битая после аварии, не на ходу',
  'Утопленник, требует полного восстановления',
  'Сгоревшая, только на запчасти',
  'Ржавая развалина, стоит в гараже 15 лет',
  'Разбита вдребезги, но мотор живой',
];

export const TIER_LABELS: Record<CarTier, string> = {
  'нищие': '💀 Нищие',
  'хуже_среднего': '🔧 Хуже среднего',
  'средние': '🚗 Средние',
  'хорошие': '⭐ Хорошие',
  'отличные': '🏎️ Отличные',
  'лакшери': '💎 Лакшери',
};

export const TIER_COLORS: Record<CarTier, string> = {
  'нищие': '#9ca3af',
  'хуже_среднего': '#6b7280',
  'средние': '#3b82f6',
  'хорошие': '#a855f7',
  'отличные': '#f59e0b',
  'лакшери': '#ec4899',
};

export function formatPrice(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)} млн ₽`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)} тыс ₽`;
  return `${price} ₽`;
}
