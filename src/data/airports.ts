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
    code: 'EWR',
    city: 'Нью-Йорк (Ньюарк)',
    country: 'США',
    name: 'Ньюарк Либерти',
    popular: false,
    nearbyCodes: ['JFK', 'LGA']
  },
  {
    code: 'MIA',
    city: 'Майами',
    country: 'США',
    name: 'Международный аэропорт Майами',
    popular: true,
    nearbyCodes: ['FLL']
  },
  {
    code: 'LAX',
    city: 'Лос-Анджелес',
    country: 'США',
    name: 'Международный аэропорт Лос-Анджелеса',
    popular: true,
    nearbyCodes: ['BUR', 'ONT']
  },
  {
    code: 'SFO',
    city: 'Сан-Франциско',
    country: 'США',
    name: 'Международный аэропорт Сан-Франциско',
    popular: true,
    nearbyCodes: ['OAK', 'SJC']
  },
  {
    code: 'ORD',
    city: 'Чикаго',
    country: 'США',
    name: 'О’Хара',
    popular: true,
    nearbyCodes: ['MDW']
  },
  {
    code: 'BOS',
    city: 'Бостон',
    country: 'США',
    name: 'Логан',
    popular: false,
    nearbyCodes: ['JFK']
  },
  {
    code: 'LAS',
    city: 'Лас-Вегас',
    country: 'США',
    name: 'Гарри Рид',
    popular: false,
    nearbyCodes: ['LAX']
  },
  {
    code: 'YYZ',
    city: 'Торонто',
    country: 'Канада',
    name: 'Пирсон',
    popular: true,
    nearbyCodes: ['YTZ']
  },
  {
    code: 'YVR',
    city: 'Ванкувер',
    country: 'Канада',
    name: 'Международный аэропорт Ванкувер',
    popular: false,
    nearbyCodes: ['SEA']
  },
  {
    code: 'MEX',
    city: 'Мехико',
    country: 'Мексика',
    name: 'Бенито Хуарес',
    popular: true,
    nearbyCodes: ['NLU']
  },
  {
    code: 'CUN',
    city: 'Канкун',
    country: 'Мексика',
    name: 'Международный аэропорт Канкун',
    popular: true,
    nearbyCodes: ['MID']
  },

  // Расширенная Европа и курорты
  {
    code: 'ZRH',
    city: 'Цюрих',
    country: 'Швейцария',
    name: 'Аэропорт Цюрих',
    popular: true,
    nearbyCodes: ['BSL', 'GVA']
  },
  {
    code: 'GVA',
    city: 'Женева',
    country: 'Швейцария',
    name: 'Куантран',
    popular: true,
    nearbyCodes: ['LYS', 'ZRH']
  },
  {
    code: 'BRU',
    city: 'Брюссель',
    country: 'Бельгия',
    name: 'Завентем',
    popular: true,
    nearbyCodes: ['CRL', 'AMS']
  },
  {
    code: 'ARN',
    city: 'Стокгольм',
    country: 'Швеция',
    name: 'Арланда',
    popular: true,
    nearbyCodes: ['BMA', 'HEL']
  },
  {
    code: 'OSL',
    city: 'Осло',
    country: 'Норвегия',
    name: 'Гардермуэн',
    popular: true,
    nearbyCodes: ['TRF', 'CPH']
  },
  {
    code: 'CPH',
    city: 'Копенгаген',
    country: 'Дания',
    name: 'Каструп',
    popular: true,
    nearbyCodes: ['MMX', 'BER']
  },
  {
    code: 'KEF',
    city: 'Рейкьявик',
    country: 'Исландия',
    name: 'Кеблавик',
    popular: false,
    nearbyCodes: ['DUB']
  },
  {
    code: 'DUB',
    city: 'Дублин',
    country: 'Ирландия',
    name: 'Аэропорт Дублин',
    popular: true,
    nearbyCodes: ['BFS', 'LHR']
  },
  {
    code: 'LGW',
    city: 'Лондон (Гатвик)',
    country: 'Великобритания',
    name: 'Гатвик',
    popular: false,
    nearbyCodes: ['LHR', 'STN', 'LTN']
  },
  {
    code: 'STN',
    city: 'Лондон (Станстед)',
    country: 'Великобритания',
    name: 'Станстед',
    popular: false,
    nearbyCodes: ['LHR', 'LTN']
  },
  {
    code: 'NCE',
    city: 'Ницца',
    country: 'Франция',
    name: 'Лазурный Берег',
    popular: true,
    nearbyCodes: ['MRS', 'GOA']
  },
  {
    code: 'VCE',
    city: 'Венеция',
    country: 'Италия',
    name: 'Марко Поло',
    popular: true,
    nearbyCodes: ['TSF', 'BLQ']
  },
  {
    code: 'NAP',
    city: 'Неаполь',
    country: 'Италия',
    name: 'Каподикино',
    popular: true,
    nearbyCodes: ['FCO']
  },
  {
    code: 'AGP',
    city: 'Малага',
    country: 'Испания',
    name: 'Коста-дель-Соль',
    popular: true,
    nearbyCodes: ['SVQ', 'ALC']
  },
  {
    code: 'ALC',
    city: 'Аликанте',
    country: 'Испания',
    name: 'Эльче',
    popular: false,
    nearbyCodes: ['VLC', 'AGP']
  },
  {
    code: 'PMI',
    city: 'Пальма-де-Майорка',
    country: 'Испания',
    name: 'Сон-Сан-Хуан',
    popular: true,
    nearbyCodes: ['BCN', 'IBZ']
  },
  {
    code: 'TFS',
    city: 'Тенерифе',
    country: 'Испания',
    name: 'Тенерифе-Южный',
    popular: true,
    nearbyCodes: ['TFN', 'LPA']
  },
  {
    code: 'OPO',
    city: 'Порту',
    country: 'Португалия',
    name: 'Франсишку ди Са Карнейру',
    popular: false,
    nearbyCodes: ['LIS']
  },
  {
    code: 'HER',
    city: 'Ираклион (Крит)',
    country: 'Греция',
    name: 'Никос Казандзакис',
    popular: true,
    nearbyCodes: ['CHQ', 'ATH']
  },
  {
    code: 'BEG',
    city: 'Белград',
    country: 'Сербия',
    name: 'Никола Тесла',
    popular: true,
    nearbyCodes: ['BUD', 'SOF']
  },
  {
    code: 'SOF',
    city: 'София',
    country: 'Болгария',
    name: 'Аэропорт София',
    popular: false,
    nearbyCodes: ['BEG', 'OTP']
  },
  {
    code: 'OTP',
    city: 'Бухарест',
    country: 'Румыния',
    name: 'Анри Коанда',
    popular: false,
    nearbyCodes: ['SOF', 'BUD']
  },
  {
    code: 'DBV',
    city: 'Дубровник',
    country: 'Хорватия',
    name: 'Аэропорт Дубровник',
    popular: false,
    nearbyCodes: ['SPU', 'TGD']
  },
  {
    code: 'TGD',
    city: 'Подгорица',
    country: 'Черногория',
    name: 'Аэропорт Голубовцы',
    popular: true,
    nearbyCodes: ['TIV', 'DBV']
  },

  // Азия, Ближний Восток и Индийский океан
  {
    code: 'HND',
    city: 'Токио (Ханеда)',
    country: 'Япония',
    name: 'Токио-Ханеда',
    popular: true,
    nearbyCodes: ['NRT']
  },
  {
    code: 'NRT',
    city: 'Токио (Нарита)',
    country: 'Япония',
    name: 'Токио-Нарита',
    popular: true,
    nearbyCodes: ['HND']
  },
  {
    code: 'KIX',
    city: 'Осака',
    country: 'Япония',
    name: 'Кансай',
    popular: false,
    nearbyCodes: ['ITM', 'NGO']
  },
  {
    code: 'ICN',
    city: 'Сеул',
    country: 'Южная Корея',
    name: 'Инчхон',
    popular: true,
    nearbyCodes: ['GMP']
  },
  {
    code: 'HKG',
    city: 'Гонконг',
    country: 'Китай',
    name: 'Чхеклапкок',
    popular: true,
    nearbyCodes: ['SZX', 'CAN']
  },
  {
    code: 'TPE',
    city: 'Тайбэй',
    country: 'Тайвань',
    name: 'Таоюань',
    popular: false,
    nearbyCodes: ['HKG']
  },
  {
    code: 'PEK',
    city: 'Пекин',
    country: 'Китай',
    name: 'Шоуду (Столичный)',
    popular: true,
    nearbyCodes: ['PKX']
  },
  {
    code: 'PVG',
    city: 'Шанхай',
    country: 'Китай',
    name: 'Пудун',
    popular: true,
    nearbyCodes: ['SHA']
  },
  {
    code: 'KUL',
    city: 'Куала-Лумпур',
    country: 'Малайзия',
    name: 'KLIA',
    popular: true,
    nearbyCodes: ['SIN', 'BKK']
  },
  {
    code: 'SGN',
    city: 'Хошимин',
    country: 'Вьетнам',
    name: 'Таншоннят',
    popular: true,
    nearbyCodes: ['HAN', 'BKK']
  },
  {
    code: 'HAN',
    city: 'Ханой',
    country: 'Вьетнам',
    name: 'Нойбай',
    popular: false,
    nearbyCodes: ['SGN']
  },
  {
    code: 'MNL',
    city: 'Манила',
    country: 'Филиппины',
    name: 'Ниной Акино',
    popular: false,
    nearbyCodes: ['HKG']
  },
  {
    code: 'DEL',
    city: 'Дели',
    country: 'Индия',
    name: 'Им. Индиры Ганди',
    popular: true,
    nearbyCodes: ['BOM']
  },
  {
    code: 'BOM',
    city: 'Мумбаи',
    country: 'Индия',
    name: 'Чхатрапати Шиваджи',
    popular: true,
    nearbyCodes: ['DEL', 'GOI']
  },
  {
    code: 'GOI',
    city: 'Гоа',
    country: 'Индия',
    name: 'Даболим / Манохар',
    popular: true,
    nearbyCodes: ['BOM']
  },
  {
    code: 'MLE',
    city: 'Мале (Мальдивы)',
    country: 'Мальдивы',
    name: 'Велана',
    popular: true,
    nearbyCodes: ['CMB']
  },
  {
    code: 'CMB',
    city: 'Коломбо',
    country: 'Шри-Ланка',
    name: 'Бандаранаике',
    popular: true,
    nearbyCodes: ['MLE']
  },
  {
    code: 'SYD',
    city: 'Сидней',
    country: 'Австралия',
    name: 'Кингсфорд Смит',
    popular: true,
    nearbyCodes: ['MEL']
  },
  {
    code: 'MEL',
    city: 'Мельбурн',
    country: 'Австралия',
    name: 'Тулламарин',
    popular: true,
    nearbyCodes: ['SYD']
  },
  {
    code: 'AKL',
    city: 'Окленд',
    country: 'Новая Зеландия',
    name: 'Аэропорт Окленд',
    popular: false,
    nearbyCodes: ['SYD']
  },

  // Африка и Латинская Америка
  {
    code: 'CAI',
    city: 'Каир',
    country: 'Египет',
    name: 'Международный аэропорт Каир',
    popular: true,
    nearbyCodes: ['HRG', 'SSH']
  },
  {
    code: 'HRG',
    city: 'Хургада',
    country: 'Египет',
    name: 'Международный аэропорт Хургада',
    popular: true,
    nearbyCodes: ['SSH', 'CAI']
  },
  {
    code: 'SSH',
    city: 'Шарм-эль-Шейх',
    country: 'Египет',
    name: 'Офира',
    popular: true,
    nearbyCodes: ['HRG', 'CAI']
  },
  {
    code: 'RAK',
    city: 'Марракеш',
    country: 'Марокко',
    name: 'Менара',
    popular: false,
    nearbyCodes: ['CMN']
  },
  {
    code: 'ZNZ',
    city: 'Занзибар',
    country: 'Танзания',
    name: 'Абейд Амани Каруме',
    popular: true,
    nearbyCodes: ['DAR', 'NBO']
  },
  {
    code: 'JNB',
    city: 'Йоханнесбург',
    country: 'ЮАР',
    name: 'О. Р. Тамбо',
    popular: true,
    nearbyCodes: ['CPT']
  },
  {
    code: 'CPT',
    city: 'Кейптаун',
    country: 'ЮАР',
    name: 'Международный аэропорт Кейптаун',
    popular: true,
    nearbyCodes: ['JNB']
  },
  {
    code: 'GRU',
    city: 'Сан-Паулу',
    country: 'Бразилия',
    name: 'Гуарульос',
    popular: true,
    nearbyCodes: ['GIG']
  },
  {
    code: 'GIG',
    city: 'Рио-де-Жанейро',
    country: 'Бразилия',
    name: 'Галеан',
    popular: true,
    nearbyCodes: ['GRU']
  },
  {
    code: 'EZE',
    city: 'Буэнос-Айрес',
    country: 'Аргентина',
    name: 'Эсейса им. Пистарини',
    popular: true,
    nearbyCodes: ['AEP', 'SCL']
  }
];

export const getAirportByCode = (code: string): Airport | undefined => {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  const found = POPULAR_AIRPORTS.find(a => a.code.toUpperCase() === upper);
  if (found) return found;
  if (upper.length === 3 && upper !== 'ANY') {
    return {
      code: upper,
      city: `Аэропорт ${upper}`,
      country: 'Международный',
      name: `Международный аэропорт ${upper}`,
      popular: false,
    };
  }
  return undefined;
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
