import { Airport } from '../types';

export const POPULAR_AIRPORTS: Airport[] = [
  // Страны Балтии
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
    code: 'KUN',
    city: 'Каунас',
    country: 'Литва',
    name: 'Аэропорт Каунас',
    popular: false,
    cluster: 'Балтия (RIX, TLL, VNO, HEL)',
    nearbyCodes: ['VNO', 'RIX']
  },
  {
    code: 'HEL',
    city: 'Хельсинки',
    country: 'Финляндия',
    name: 'Хельсинки-Вантаа',
    popular: true,
    cluster: 'Балтия (RIX, TLL, VNO, HEL)',
    nearbyCodes: ['TLL', 'RIX']
  },

  // Западная и Центральная Европа
  {
    code: 'FCO',
    city: 'Рим',
    country: 'Италия',
    name: 'Фьюмичино им. Леонардо да Винчи',
    popular: true,
    nearbyCodes: ['CIA', 'MXP']
  },
  {
    code: 'MXP',
    city: 'Милан',
    country: 'Италия',
    name: 'Милан Мальпенса',
    popular: true,
    nearbyCodes: ['BGY', 'LIN']
  },
  {
    code: 'BCN',
    city: 'Барселона',
    country: 'Испания',
    name: 'Эль-Прат',
    popular: true,
    nearbyCodes: ['GRO', 'MAD']
  },
  {
    code: 'MAD',
    city: 'Мадрид',
    country: 'Испания',
    name: 'Адольфо Суарес Барахас',
    popular: true,
    nearbyCodes: ['BCN']
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
    code: 'ORY',
    city: 'Париж (Орли)',
    country: 'Франция',
    name: 'Париж-Орли',
    popular: false,
    nearbyCodes: ['CDG', 'BVA']
  },
  {
    code: 'BER',
    city: 'Берлин',
    country: 'Германия',
    name: 'Берлин-Бранденбург',
    popular: true,
    nearbyCodes: ['LEJ', 'HAM']
  },
  {
    code: 'MUC',
    city: 'Мюнхен',
    country: 'Германия',
    name: 'Аэропорт им. Франца-Йозефа Штрауса',
    popular: true,
    nearbyCodes: ['NUE', 'FRA']
  },
  {
    code: 'FRA',
    city: 'Франкфурт',
    country: 'Германия',
    name: 'Аэропорт Франкфурт-на-Майне',
    popular: true,
    nearbyCodes: ['HHN', 'MUC']
  },
  {
    code: 'AMS',
    city: 'Амстердам',
    country: 'Нидерланды',
    name: 'Схипхол',
    popular: true,
    nearbyCodes: ['EIN', 'BRU']
  },
  {
    code: 'VIE',
    city: 'Вена',
    country: 'Австрия',
    name: 'Вена-Швехат',
    popular: true,
    nearbyCodes: ['BTS', 'BUD']
  },
  {
    code: 'PRG',
    city: 'Прага',
    country: 'Чехия',
    name: 'Аэропорт им. Вацлава Гавела',
    popular: true,
    nearbyCodes: ['DRS', 'VIE']
  },
  {
    code: 'BUD',
    city: 'Будапешт',
    country: 'Венгрия',
    name: 'Аэропорт им. Ференца Листа',
    popular: true,
    nearbyCodes: ['VIE', 'BTS']
  },
  {
    code: 'WAW',
    city: 'Варшава',
    country: 'Польша',
    name: 'Аэропорт им. Фредерика Шопена',
    popular: true,
    nearbyCodes: ['WMI', 'KRK']
  },
  {
    code: 'KRK',
    city: 'Краков',
    country: 'Польша',
    name: 'Краков-Балице им. Иоанна Павла II',
    popular: false,
    nearbyCodes: ['KTW', 'WAW']
  },
  {
    code: 'ATH',
    city: 'Афины',
    country: 'Греция',
    name: 'Элефтериос Венизелос',
    popular: true,
    nearbyCodes: ['SKG', 'HER']
  },
  {
    code: 'LCA',
    city: 'Ларнака',
    country: 'Кипр',
    name: 'Международный аэропорт Ларнака',
    popular: true,
    nearbyCodes: ['PFO']
  },
  {
    code: 'LIS',
    city: 'Лиссабон',
    country: 'Португалия',
    name: 'Умберту Делгаду',
    popular: true,
    nearbyCodes: ['OPO', 'FAO']
  },
  {
    code: 'LHR',
    city: 'Лондон',
    country: 'Великобритания',
    name: 'Хитроу',
    popular: true,
    nearbyCodes: ['LGW', 'STN', 'LTN']
  },

  // Турция и Ближний Восток
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
    code: 'SAW',
    city: 'Стамбул (Сабиха)',
    country: 'Турция',
    name: 'Аэропорт им. Сабихи Гёкчен',
    popular: true,
    cluster: 'Хаб Турция (IST, SAW)',
    nearbyCodes: ['IST', 'AYT']
  },
  {
    code: 'AYT',
    city: 'Анталья',
    country: 'Турция',
    name: 'Международный аэропорт Анталья',
    popular: true,
    nearbyCodes: ['GZP', 'DLM', 'IST']
  },
  {
    code: 'DXB',
    city: 'Дубай',
    country: 'ОАЭ',
    name: 'Международный аэропорт Дубай',
    popular: true,
    cluster: 'Хаб ОАЭ (DXB, SHJ, AUH)',
    nearbyCodes: ['SHJ', 'AUH', 'DWC']
  },
  {
    code: 'SHJ',
    city: 'Шарджа',
    country: 'ОАЭ',
    name: 'Международный аэропорт Шарджа',
    popular: false,
    cluster: 'Хаб ОАЭ (DXB, SHJ, AUH)',
    nearbyCodes: ['DXB', 'AUH']
  },
  {
    code: 'AUH',
    city: 'Абу-Даби',
    country: 'ОАЭ',
    name: 'Международный аэропорт Заид',
    popular: true,
    cluster: 'Хаб ОАЭ (DXB, SHJ, AUH)',
    nearbyCodes: ['DXB', 'SHJ']
  },
  {
    code: 'DOH',
    city: 'Доха',
    country: 'Катар',
    name: 'Хамад',
    popular: true,
    nearbyCodes: ['BAH', 'DXB']
  },

  // Кавказ и Центральная Азия
  {
    code: 'EVN',
    city: 'Ереван',
    country: 'Армения',
    name: 'Звартноц',
    popular: true,
    nearbyCodes: ['LWN', 'TBS']
  },
  {
    code: 'TBS',
    city: 'Тбилиси',
    country: 'Грузия',
    name: 'Аэропорт им. Шота Руставели',
    popular: true,
    nearbyCodes: ['BUS', 'KUT', 'EVN']
  },
  {
    code: 'BUS',
    city: 'Батуми',
    country: 'Грузия',
    name: 'Международный аэропорт им. А. Беридзе',
    popular: false,
    nearbyCodes: ['KUT', 'TBS']
  },
  {
    code: 'GYD',
    city: 'Баку',
    country: 'Азербайджан',
    name: 'Аэропорт им. Гейдара Алиева',
    popular: true,
    nearbyCodes: ['TBS']
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
    code: 'SKD',
    city: 'Самарканд',
    country: 'Узбекистан',
    name: 'Международный аэропорт Самарканд',
    popular: false,
    nearbyCodes: ['BHK', 'TAS']
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
    code: 'NQZ',
    city: 'Астана',
    country: 'Казахстан',
    name: 'Международный аэропорт им. Н. Назарбаева',
    popular: true,
    nearbyCodes: ['ALA']
  },

  // Юго-Восточная Азия
  {
    code: 'BKK',
    city: 'Бангкок',
    country: 'Таиланд',
    name: 'Суварнабхуми',
    popular: true,
    nearbyCodes: ['DMK', 'HKT']
  },
  {
    code: 'HKT',
    city: 'Пхукет',
    country: 'Таиланд',
    name: 'Международный аэропорт Пхукет',
    popular: true,
    nearbyCodes: ['KBV', 'BKK']
  },
  {
    code: 'DPS',
    city: 'Бали (Денпасар)',
    country: 'Индонезия',
    name: 'Нгурах-Рай',
    popular: true,
    nearbyCodes: ['SIN', 'KUL']
  },
  {
    code: 'SIN',
    city: 'Сингапур',
    country: 'Сингапур',
    name: 'Чанги',
    popular: true,
    nearbyCodes: ['KUL']
  },

  // Россия и СНГ
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
    city: 'Москва (Шереметьево)',
    country: 'Россия',
    name: 'Шереметьево им. А.С. Пушкина',
    popular: false,
    cluster: 'Московский авиаузел',
    nearbyCodes: ['VKO', 'DME']
  },
  {
    code: 'VKO',
    city: 'Москва (Внуково)',
    country: 'Россия',
    name: 'Внуково им. А.Н. Туполева',
    popular: false,
    cluster: 'Московский авиаузел',
    nearbyCodes: ['SVO', 'DME']
  },
  {
    code: 'DME',
    city: 'Москва (Домодедово)',
    country: 'Россия',
    name: 'Домодедово им. М.В. Ломоносова',
    popular: false,
    cluster: 'Московский авиаузел',
    nearbyCodes: ['SVO', 'VKO']
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
    code: 'AER',
    city: 'Сочи',
    country: 'Россия',
    name: 'Международный аэропорт Сочи им. В.И. Севастьянова',
    popular: true,
    nearbyCodes: ['KRR']
  },
  {
    code: 'KZN',
    city: 'Казань',
    country: 'Россия',
    name: 'Международный аэропорт Казань',
    popular: false,
    nearbyCodes: ['UFA', 'SAM']
  },
  {
    code: 'MSQ',
    city: 'Минск',
    country: 'Беларусь',
    name: 'Национальный аэропорт Минск',
    popular: true,
    nearbyCodes: ['VNO', 'MOW']
  },

  // Северная Америка
  {
    code: 'JFK',
    city: 'Нью-Йорк',
    country: 'США',
    name: 'Аэропорт им. Джона Кеннеди',
    popular: true,
    nearbyCodes: ['EWR', 'LGA']
  },
  {
    code: 'MIA',
    city: 'Майами',
    country: 'США',
    name: 'Международный аэропорт Майами',
    popular: true,
    nearbyCodes: ['FLL']
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
  { city: 'Рим', code: 'FCO', country: 'Италия', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80', minPrice: 14900 },
  { city: 'Барселона', code: 'BCN', country: 'Испания', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop&q=80', minPrice: 16500 },
  { city: 'Париж', code: 'CDG', country: 'Франция', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80', minPrice: 15800 },
  { city: 'Дубай', code: 'DXB', country: 'ОАЭ', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80', minPrice: 21900 },
  { city: 'Ереван', code: 'EVN', country: 'Армения', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80', minPrice: 9800 },
  { city: 'Тбилиси', code: 'TBS', country: 'Грузия', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&auto=format&fit=crop&q=80', minPrice: 11200 },
  { city: 'Рига', code: 'RIX', country: 'Латвия', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&auto=format&fit=crop&q=80', minPrice: 5800 },
  { city: 'Таллин', code: 'TLL', country: 'Эстония', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600&auto=format&fit=crop&q=80', minPrice: 5900 },
  { city: 'Пхукет', code: 'HKT', country: 'Таиланд', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&auto=format&fit=crop&q=80', minPrice: 42500 },
];
