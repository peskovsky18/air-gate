import { Airport } from '../types';

export const POPULAR_AIRPORTS: Airport[] = [
  {
    code: 'RIX',
    city: 'Рига',
    country: 'Латвия',
    name: 'Международный аэропорт Рига',
    popular: true,
    cluster: 'Балтия (RIX, TLL, VNO, HEL)',
    nearbyCodes: ['TLL', 'VNO', 'HEL']
  },
  {
    code: 'TLL',
    city: 'Таллин',
    country: 'Эстония',
    name: 'Таллинский аэропорт им. Леннарта Мери',
    popular: true,
    cluster: 'Балтия (RIX, TLL, VNO, HEL)',
    nearbyCodes: ['RIX', 'HEL', 'VNO']
  },
  {
    code: 'VNO',
    city: 'Вильнюс',
    country: 'Литва',
    name: 'Вильнюсский международный аэропорт',
    popular: true,
    cluster: 'Балтия (RIX, TLL, VNO, HEL)',
    nearbyCodes: ['RIX', 'KUN', 'WAW']
  },
  {
    code: 'HEL',
    city: 'Хельсинки',
    country: 'Финляндия',
    name: 'Хельсинки-Вантаа',
    popular: false,
    cluster: 'Балтия (RIX, TLL, VNO, HEL)',
    nearbyCodes: ['TLL', 'RIX']
  },
  {
    code: 'MOW',
    city: 'Москва',
    country: 'Россия',
    name: 'Все аэропорты (SVO, VKO, DME)',
    popular: true,
    cluster: 'Московский авиаузел',
    nearbyCodes: ['LED']
  },
  {
    code: 'SVO',
    city: 'Москва',
    country: 'Россия',
    name: 'Шереметьево',
    popular: false,
    cluster: 'Московский авиаузел',
    nearbyCodes: ['VKO', 'DME']
  },
  {
    code: 'VKO',
    city: 'Москва',
    country: 'Россия',
    name: 'Внуково',
    popular: false,
    cluster: 'Московский авиаузел',
    nearbyCodes: ['SVO', 'DME']
  },
  {
    code: 'LED',
    city: 'Санкт-Петербург',
    country: 'Россия',
    name: 'Пулково',
    popular: true,
    nearbyCodes: ['MOW']
  },
  {
    code: 'IST',
    city: 'Стамбул',
    country: 'Турция',
    name: 'Новый аэропорт Стамбула',
    popular: true,
    cluster: 'Хаб Турция (IST, SAW)',
    nearbyCodes: ['SAW', 'AYT']
  },
  {
    code: 'AYT',
    city: 'Анталья',
    country: 'Турция',
    name: 'Аэропорт Анталья',
    popular: true,
    nearbyCodes: ['IST']
  },
  {
    code: 'DXB',
    city: 'Дубай',
    country: 'ОАЭ',
    name: 'Международный аэропорт Дубай',
    popular: true,
    cluster: 'Хаб ОАЭ (DXB, SHJ, AUH)',
    nearbyCodes: ['SHJ', 'AUH']
  },
  {
    code: 'EVN',
    city: 'Ереван',
    country: 'Армения',
    name: 'Звартноц',
    popular: true,
    nearbyCodes: ['TBS']
  },
  {
    code: 'TBS',
    city: 'Тбилиси',
    country: 'Грузия',
    name: 'Аэропорт Шота Руставели',
    popular: true,
    nearbyCodes: ['BUS', 'EVN']
  },
  {
    code: 'BKK',
    city: 'Бангкок',
    country: 'Таиланд',
    name: 'Суварнабхуми',
    popular: true,
    nearbyCodes: ['HKT', 'DMK']
  },
  {
    code: 'HKT',
    city: 'Пхукет',
    country: 'Таиланд',
    name: 'Международный аэропорт Пхукет',
    popular: true,
    nearbyCodes: ['BKK']
  },
  {
    code: 'TAS',
    city: 'Ташкент',
    country: 'Узбекистан',
    name: 'Ташкент-Южный им. И. Каримова',
    popular: true,
    nearbyCodes: ['SKD', 'ALA']
  },
  {
    code: 'ALA',
    city: 'Алматы',
    country: 'Казахстан',
    name: 'Международный аэропорт Алматы',
    popular: true,
    nearbyCodes: ['NQZ', 'TAS']
  },
  {
    code: 'BCN',
    city: 'Барселона',
    country: 'Испания',
    name: 'Эль-Прат',
    popular: true,
    nearbyCodes: ['MAD']
  },
  {
    code: 'FCO',
    city: 'Рим',
    country: 'Италия',
    name: 'Фьюмичино им. Леонардо да Винчи',
    popular: true,
    nearbyCodes: ['MXP']
  },
  {
    code: 'CDG',
    city: 'Париж',
    country: 'Франция',
    name: 'Шарль де Голль',
    popular: true,
    nearbyCodes: ['ORY', 'BVA']
  },
  {
    code: 'BER',
    city: 'Берлин',
    country: 'Германия',
    name: 'Берлин-Бранденбург',
    popular: true,
    nearbyCodes: ['SXF', 'LEJ']
  },
  {
    code: 'WAW',
    city: 'Варшава',
    country: 'Польша',
    name: 'Варшавский аэропорт им. Фредерика Шопена',
    popular: true,
    nearbyCodes: ['WMI', 'VNO']
  }
];

export const getAirportByCode = (code: string): Airport | undefined => {
  return POPULAR_AIRPORTS.find(a => a.code.toUpperCase() === code.toUpperCase());
};

export const getNearbyAirports = (code: string): Airport[] => {
  const current = getAirportByCode(code);
  if (!current || !current.nearbyCodes) return [];
  return current.nearbyCodes
    .map(c => getAirportByCode(c))
    .filter((a): a is Airport => Boolean(a));
};

export const POPULAR_DESTINATIONS = [
  { city: 'Стамбул', code: 'IST', country: 'Турция', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&auto=format&fit=crop&q=80', minPrice: 12450 },
  { city: 'Дубай', code: 'DXB', country: 'ОАЭ', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80', minPrice: 18900 },
  { city: 'Ереван', code: 'EVN', country: 'Армения', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80', minPrice: 9800 },
  { city: 'Тбилиси', code: 'TBS', country: 'Грузия', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&auto=format&fit=crop&q=80', minPrice: 11200 },
  { city: 'Пхукет', code: 'HKT', country: 'Таиланд', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&auto=format&fit=crop&q=80', minPrice: 34500 },
  { city: 'Рига', code: 'RIX', country: 'Латвия', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&auto=format&fit=crop&q=80', minPrice: 14200 },
  { city: 'Таллин', code: 'TLL', country: 'Эстония', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600&auto=format&fit=crop&q=80', minPrice: 15300 },
  { city: 'Рим', code: 'FCO', country: 'Италия', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80', minPrice: 16900 },
];
