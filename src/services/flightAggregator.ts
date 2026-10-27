import { Flight, SearchParams, SellerOffer, DatePriceHeatmap, LayoverInfo, FlightSegment, MultiHubInfo, PriceVerdict } from '../types';
import { getAirportByCode, getNearbyAirports } from '../data/airports';

// Extensive database of airlines across Europe, CIS, Middle East, and Asia
const GLOBAL_AIRLINES = [
  { name: 'Air Baltic', code: 'BT', country: 'Латвия', type: 'hybrid', aircraft: 'Airbus A220-300' },
  { name: 'Ryanair', code: 'FR', country: 'Ирландия', type: 'lowcost', aircraft: 'Boeing 737 MAX 8' },
  { name: 'Wizz Air', code: 'W6', country: 'Венгрия', type: 'lowcost', aircraft: 'Airbus A321neo' },
  { name: 'Turkish Airlines', code: 'TK', country: 'Турция', type: 'full', aircraft: 'Airbus A330 / A321' },
  { name: 'Pegasus Airlines', code: 'PC', country: 'Турция', type: 'lowcost', aircraft: 'Airbus A320neo' },
  { name: 'Emirates', code: 'EK', country: 'ОАЭ', type: 'full', aircraft: 'Boeing 777-300ER' },
  { name: 'Flydubai', code: 'FZ', country: 'ОАЭ', type: 'hybrid', aircraft: 'Boeing 737 MAX 8' },
  { name: 'Finnair', code: 'AY', country: 'Финляндия', type: 'full', aircraft: 'Airbus A350-900' },
  { name: 'LOT Polish Airlines', code: 'LO', country: 'Польша', type: 'full', aircraft: 'Boeing 787 Dreamliner' },
  { name: 'Lufthansa', code: 'LH', country: 'Германия', type: 'full', aircraft: 'Airbus A320neo' },
  { name: 'Qatar Airways', code: 'QR', country: 'Катар', type: 'full', aircraft: 'Boeing 787-9' },
  { name: 'EasyJet', code: 'U2', country: 'Великобритания', type: 'lowcost', aircraft: 'Airbus A320' },
  { name: 'Norwegian', code: 'DY', country: 'Норвегия', type: 'lowcost', aircraft: 'Boeing 737-800' },
  { name: 'Armenia Airways', code: '6A', country: 'Армения', type: 'regional', aircraft: 'Boeing 737-300' },
  { name: 'Georgian Airways', code: 'A9', country: 'Грузия', type: 'regional', aircraft: 'Boeing 737-700' },
  { name: 'Uzbekistan Airways', code: 'HY', country: 'Узбекистан', type: 'full', aircraft: 'Boeing 787-8' },
];

const GLOBAL_SELLERS = [
  { name: 'City.Travel', rating: 4.8, fee: 0 },
  { name: 'КупиБилет', rating: 4.7, fee: 150 },
  { name: 'OneTwoTrip', rating: 4.9, fee: 290 },
  { name: 'SuperKassa', rating: 4.6, fee: -200 },
  { name: 'Aviakassa', rating: 4.7, fee: 80 },
  { name: 'Trip.com', rating: 4.9, fee: 120 },
  { name: 'Biletik.aero', rating: 4.6, fee: -150 },
  { name: 'Ozon Travel', rating: 4.85, fee: 100 },
];

// Helper to generate a realistic set of sellers for any flight
const generateSellers = (airlineName: string, basePrice: number, baggageIncluded: boolean): SellerOffer[] => {
  const offers: SellerOffer[] = [
    {
      id: `dir_${Math.random()}`,
      sellerName: `Официальный сайт ${airlineName}`,
      isAirlineDirect: true,
      price: basePrice + 350,
      baggageIncluded,
      carryOnIncluded: true,
      bookingUrl: 'https://airline.com/direct',
      rating: 4.95,
    }
  ];

  // Pick 3-4 random sellers from the marketplace
  const shuffled = [...GLOBAL_SELLERS].sort(() => 0.5 - Math.random()).slice(0, 4);
  shuffled.forEach((s, idx) => {
    offers.push({
      id: `ota_${idx}_${Math.random()}`,
      sellerName: s.name,
      isAirlineDirect: false,
      price: Math.max(2500, basePrice + s.fee + (idx === 0 ? -300 : idx * 120)),
      baggageIncluded: idx % 2 === 0 ? baggageIncluded : false,
      carryOnIncluded: true,
      bookingUrl: 'https://ota.com/partner',
      rating: s.rating,
    });
  });

  return offers.sort((a, b) => a.price - b.price);
};

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  // Simulate thorough market aggregation delay (scanning all sources)
  await new Promise(res => setTimeout(res, 500));

  const fromAirport = getAirportByCode(params.fromCode);
  const toAirport = getAirportByCode(params.toCode);
  const fromCity = fromAirport?.city || params.fromCity || 'Город отправления';
  const toCity = toAirport?.city || params.toCity || 'Город прибытия';

  let marketMedian = 14800;
  if (['DXB', 'BKK', 'HKT'].includes(params.toCode)) marketMedian = 34000;
  if (['EVN', 'TBS', 'IST'].includes(params.toCode)) marketMedian = 12500;
  if (['RIX', 'TLL', 'VNO'].includes(params.toCode)) marketMedian = 8900;

  const flights: Flight[] = [];

  // 1. Direct Morning Flight (Air Baltic / Turkish)
  const f1Price = Math.round((marketMedian * 0.92) / 100) * 100;
  flights.push({
    id: 'fl_morn_direct',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '07:15',
    arrivalTime: '11:35',
    durationTotal: '4ч 20м',
    durationMinutes: 260,
    stopsCount: 0,
    layovers: [],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: params.toCode,
        departureCity: fromCity,
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T2',
        departureTime: '07:15',
        arrivalTime: '11:35',
        duration: '4ч 20м',
        flightNumber: 'BT-412',
        airline: 'Air Baltic',
        aircraft: 'Airbus A220-300',
      }
    ],
    airlines: ['Air Baltic'],
    bestPrice: f1Price,
    averageMarketPrice: Math.round(f1Price * 1.25),
    priceDiscountPercent: 14,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Прямой рейс. Без пересадок и визовых требований.',
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Брать сейчас',
      explanation: 'Утренний прямой рейс по тарифу ниже среднерыночного на 14%. Осталось 4 места по базовому тарифу.',
      confidencePercent: 93,
    },
    sellers: generateSellers('Air Baltic', f1Price, false),
    isFastest: true,
  });

  // 2. Direct Midday Optimal Flight with Baggage 23kg
  const f2Price = Math.round((marketMedian * 1.05) / 100) * 100;
  flights.push({
    id: 'fl_mid_direct_baggage',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '13:40',
    arrivalTime: '18:05',
    durationTotal: '4ч 25м',
    durationMinutes: 265,
    stopsCount: 0,
    layovers: [],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: params.toCode,
        departureCity: fromCity,
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: '13:40',
        arrivalTime: '18:05',
        duration: '4ч 25м',
        flightNumber: 'TK-1418',
        airline: 'Turkish Airlines',
        aircraft: 'Airbus A321neo',
      }
    ],
    airlines: ['Turkish Airlines'],
    bestPrice: f2Price,
    averageMarketPrice: Math.round(f2Price * 1.2),
    priceDiscountPercent: 12,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Прямой рейс. Багаж 23 кг и горячее питание включены в тариф.',
    verdict: {
      action: 'fair_price',
      badgeTitle: 'Оптимальный выбор',
      explanation: 'Полный сервис без скрытых доплат: багаж 23 кг, удобное дневное время вылета, комфортный борт A321neo.',
      confidencePercent: 91,
    },
    sellers: generateSellers('Turkish Airlines', f2Price, true),
    isOptimal: true,
  });

  // 3. Ultra Low-Cost via European hub (Ryanair / Wizz Air)
  const f3Price = Math.round((marketMedian * 0.65) / 100) * 100;
  flights.push({
    id: 'fl_lowcost_transfer',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '06:10',
    arrivalTime: '13:45',
    durationTotal: '7ч 35м',
    durationMinutes: 455,
    stopsCount: 1,
    layovers: [
      {
        airportCode: 'WAW',
        city: 'Варшава',
        duration: '2ч 15м',
        isShort: false,
        isNight: false,
        terminalChange: 'Один терминал (T1)',
        selfTransfer: false,
        transitVisaRequired: false,
        transitVisaNote: 'Шенгенская зона. Багаж перегружается автоматически.',
        baggageRecheck: false,
      }
    ],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'WAW',
        departureCity: fromCity,
        arrivalCity: 'Варшава',
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: '06:10',
        arrivalTime: '07:25',
        duration: '1ч 15м',
        flightNumber: 'W6-1804',
        airline: 'Wizz Air',
        aircraft: 'Airbus A321neo',
      },
      {
        departureAirport: 'WAW',
        arrivalAirport: params.toCode,
        departureCity: 'Варшава',
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T2',
        departureTime: '09:40',
        arrivalTime: '13:45',
        duration: '4ч 05м',
        flightNumber: 'W6-2290',
        airline: 'Wizz Air',
        aircraft: 'Airbus A321neo',
      }
    ],
    airlines: ['Wizz Air'],
    bestPrice: f3Price,
    averageMarketPrice: marketMedian,
    priceDiscountPercent: 35,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Транзит через Варшаву. Виза не требуется при наличии Шенгена.',
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Брать сейчас',
      explanation: 'Супер-тариф от Wizz Air: на 35% дешевле среднего рынка. Короткая удобная стыковка 2ч 15м в Варшаве.',
      confidencePercent: 95,
    },
    sellers: generateSellers('Wizz Air', f3Price, false),
    isCheapest: true,
  });

  // 4. Smart Multi-Hub Route with Ground Transport (e.g. Riga ↔ Tallinn / Vilnius)
  const isBaltic = ['RIX', 'TLL', 'VNO', 'HEL'].includes(params.fromCode);
  const altCity = params.fromCode === 'RIX' ? 'Таллин' : 'Рига';
  const altCode = params.fromCode === 'RIX' ? 'TLL' : 'RIX';
  const groundTransportDesc = params.fromCode === 'RIX' ? 'Автобус Lux Express из Риги (4ч 15м)' : 'Автобус Lux Express из Таллина (4ч 20м)';
  const groundPrice = 1200;
  const multiFlightPrice = Math.round((marketMedian * 0.58) / 100) * 100;
  const netSavings = marketMedian - (multiFlightPrice + groundPrice);

  if (isBaltic) {
    const multiHubInfo: MultiHubInfo = {
      isAlternative: true,
      originCity: altCity,
      originCode: altCode,
      groundTransport: groundTransportDesc,
      groundPrice,
      flightPrice: multiFlightPrice,
      netSavings,
      badgeText: `Чистая экономия ${netSavings.toLocaleString('ru-RU')} ₽ с учетом автобуса`,
    };

    flights.push({
      id: 'fl_multihub_ryanair',
      fromCode: altCode,
      fromCity: `${altCity} (умный хаб)`,
      toCode: params.toCode,
      toCity,
      departureDate: params.departureDate,
      departureTime: '15:10',
      arrivalTime: '19:25',
      durationTotal: '4ч 15м рейс (+4ч автобус)',
      durationMinutes: 255,
      stopsCount: 0,
      layovers: [],
      segments: [
        {
          departureAirport: altCode,
          arrivalAirport: params.toCode,
          departureCity: altCity,
          arrivalCity: toCity,
          departureTerminal: 'T1',
          arrivalTerminal: 'T1',
          departureTime: '15:10',
          arrivalTime: '19:25',
          duration: '4ч 15м',
          flightNumber: 'FR-3301',
          airline: 'Ryanair',
          aircraft: 'Boeing 737 MAX 8-200',
        }
      ],
      airlines: ['Ryanair'],
      bestPrice: multiFlightPrice,
      averageMarketPrice: marketMedian,
      priceDiscountPercent: 42,
      baggageIncluded: false,
      carryOnIncluded: true,
      selfTransfer: false,
      baggageRecheck: false,
      transitVisaNote: 'Прямой вылет из соседней столицы. Без границ внутри Балтии.',
      multiHubAlternative: multiHubInfo,
      verdict: {
        action: 'buy_now',
        badgeTitle: 'Умный маршрут',
        explanation: `Рейс из ${altCity} стоит всего ${multiFlightPrice.toLocaleString('ru-RU')} ₽. С учетом комфортного автобуса ${groundTransportDesc} (${groundPrice} ₽) выгода составляет ${netSavings.toLocaleString('ru-RU')} ₽.`,
        confidencePercent: 97,
      },
      sellers: generateSellers('Ryanair', multiFlightPrice, false),
    });
  }

  // 5. Pegasus via Istanbul SAW (Short Transfer Warning + Self-Transfer)
  const f5Price = Math.round((marketMedian * 0.72) / 100) * 100;
  flights.push({
    id: 'fl_pegasus_warning',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '18:20',
    arrivalTime: '02:40',
    durationTotal: '8ч 20м',
    durationMinutes: 500,
    stopsCount: 1,
    layovers: [
      {
        airportCode: 'SAW',
        city: 'Стамбул Сабиха',
        duration: '1ч 15м',
        isShort: true,
        isNight: false,
        terminalChange: 'Смена терминала T1 → T2',
        selfTransfer: true,
        transitVisaRequired: false,
        transitVisaNote: 'Транзитная виза не нужна. Внимание: раздельное бронирование!',
        baggageRecheck: true,
      }
    ],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'SAW',
        departureCity: fromCity,
        arrivalCity: 'Стамбул',
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: '18:20',
        arrivalTime: '22:45',
        duration: '4ч 25м',
        flightNumber: 'PC-1192',
        airline: 'Pegasus Airlines',
        aircraft: 'Airbus A320neo',
      },
      {
        departureAirport: 'SAW',
        arrivalAirport: params.toCode,
        departureCity: 'Стамбул',
        arrivalCity: toCity,
        departureTerminal: 'T2',
        arrivalTerminal: 'T1',
        departureTime: '00:00',
        arrivalTime: '02:40',
        duration: '2ч 40м',
        flightNumber: 'PC-602',
        airline: 'Pegasus Airlines',
        aircraft: 'Boeing 737-800',
      }
    ],
    airlines: ['Pegasus Airlines'],
    bestPrice: f5Price,
    averageMarketPrice: marketMedian,
    priceDiscountPercent: 28,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: true,
    baggageRecheck: true,
    terminalChangeWarning: 'Смена терминала T1 → T2 (пешком 15 мин)',
    transitVisaNote: 'Нужно пройти паспортный контроль, забрать багаж и сдать заново.',
    verdict: {
      action: 'wait',
      badgeTitle: 'Подождать',
      explanation: 'Низкая цена, но рискованная пересадка: раздельный билет (self-transfer), нужно получить и сдать багаж в Стамбуле всего за 1ч 15м.',
      confidencePercent: 82,
    },
    sellers: generateSellers('Pegasus Airlines', f5Price, false),
  });

  // 6. Premium Flag Carrier via Frankfurt (Lufthansa)
  const f6Price = Math.round((marketMedian * 1.28) / 100) * 100;
  flights.push({
    id: 'fl_lufthansa_comfort',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '09:00',
    arrivalTime: '15:30',
    durationTotal: '6ч 30м',
    durationMinutes: 390,
    stopsCount: 1,
    layovers: [
      {
        airportCode: 'FRA',
        city: 'Франкфурт',
        duration: '1ч 45м',
        isShort: false,
        isNight: false,
        terminalChange: 'Один терминал (T1, Pier A)',
        selfTransfer: false,
        transitVisaRequired: false,
        transitVisaNote: 'Единый транзитный хаб Lufthansa. Сквозная регистрация.',
        baggageRecheck: false,
      }
    ],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'FRA',
        departureCity: fromCity,
        arrivalCity: 'Франкфурт',
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: '09:00',
        arrivalTime: '10:45',
        duration: '2ч 45м',
        flightNumber: 'LH-891',
        airline: 'Lufthansa',
        aircraft: 'Airbus A320neo',
      },
      {
        departureAirport: 'FRA',
        arrivalAirport: params.toCode,
        departureCity: 'Франкфурт',
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: '12:30',
        arrivalTime: '15:30',
        duration: '2ч 00м',
        flightNumber: 'LH-1204',
        airline: 'Lufthansa',
        aircraft: 'Airbus A321-200',
      }
    ],
    airlines: ['Lufthansa'],
    bestPrice: f6Price,
    averageMarketPrice: Math.round(f6Price * 1.15),
    priceDiscountPercent: 5,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Единый билет Star Alliance. Премиальное обслуживание, питание и багаж 23 кг.',
    verdict: {
      action: 'fair_price',
      badgeTitle: 'Премиум сервис',
      explanation: 'Надежный регулярный рейс Lufthansa через Франкфурт с гарантированной стыковкой и максимальным рейтингом пунктуальности (94%).',
      confidencePercent: 90,
    },
    sellers: generateSellers('Lufthansa', f6Price, true),
  });

  // 7. Evening Direct Flight (Flydubai / Air Baltic)
  const f7Price = Math.round((marketMedian * 0.98) / 100) * 100;
  flights.push({
    id: 'fl_evening_direct',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '19:45',
    arrivalTime: '23:55',
    durationTotal: '4ч 10м',
    durationMinutes: 250,
    stopsCount: 0,
    layovers: [],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: params.toCode,
        departureCity: fromCity,
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T2',
        departureTime: '19:45',
        arrivalTime: '23:55',
        duration: '4ч 10м',
        flightNumber: 'BT-490',
        airline: 'Air Baltic',
        aircraft: 'Airbus A220-300',
      }
    ],
    airlines: ['Air Baltic'],
    bestPrice: f7Price,
    averageMarketPrice: Math.round(f7Price * 1.18),
    priceDiscountPercent: 10,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Вечерний прямой рейс. Удобно после рабочего дня.',
    verdict: {
      action: 'fair_price',
      badgeTitle: 'Справедливая цена',
      explanation: 'Стабильный тариф на вечерний вылет. Включает ручную кладь 10 кг + личную вещь.',
      confidencePercent: 88,
    },
    sellers: generateSellers('Air Baltic', f7Price, true),
  });

  // 8. Flight via Helsinki (Finnair)
  const f8Price = Math.round((marketMedian * 0.89) / 100) * 100;
  flights.push({
    id: 'fl_finnair_hel',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '11:15',
    arrivalTime: '16:50',
    durationTotal: '5ч 35м',
    durationMinutes: 335,
    stopsCount: 1,
    layovers: [
      {
        airportCode: 'HEL',
        city: 'Хельсинки',
        duration: '1ч 20м',
        isShort: false,
        isNight: false,
        terminalChange: 'Один терминал (T2)',
        selfTransfer: false,
        transitVisaRequired: false,
        transitVisaNote: 'Один из самых быстрых и удобных аэропортов Европы.',
        baggageRecheck: false,
      }
    ],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'HEL',
        departureCity: fromCity,
        arrivalCity: 'Хельсинки',
        departureTerminal: 'T1',
        arrivalTerminal: 'T2',
        departureTime: '11:15',
        arrivalTime: '12:25',
        duration: '1ч 10м',
        flightNumber: 'AY-1072',
        airline: 'Finnair',
        aircraft: 'ATR 72-500',
      },
      {
        departureAirport: 'HEL',
        arrivalAirport: params.toCode,
        departureCity: 'Хельсинки',
        arrivalCity: toCity,
        departureTerminal: 'T2',
        arrivalTerminal: 'T1',
        departureTime: '13:45',
        arrivalTime: '16:50',
        duration: '3ч 05м',
        flightNumber: 'AY-1941',
        airline: 'Finnair',
        aircraft: 'Airbus A321',
      }
    ],
    airlines: ['Finnair'],
    bestPrice: f8Price,
    averageMarketPrice: Math.round(f8Price * 1.2),
    priceDiscountPercent: 16,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Единый билет oneworld. Быстрая пересадка без смены терминала.',
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Брать сейчас',
      explanation: 'Отличный тариф Finnair: комфортный хаб в Хельсинки с минимальным временем стыковки (1ч 20м).',
      confidencePercent: 92,
    },
    sellers: generateSellers('Finnair', f8Price, false),
  });

  return flights;
};

export const generatePriceHeatmap = (baseDateStr: string, basePrice: number): DatePriceHeatmap[] => {
  const result: DatePriceHeatmap[] = [];
  const baseDate = new Date(baseDateStr || Date.now());
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  for (let offset = -5; offset <= 8; offset++) {
    const cur = new Date(baseDate);
    cur.setDate(baseDate.getDate() + offset);

    const isWeekend = cur.getDay() === 0 || cur.getDay() === 6;
    const variation = (Math.sin(offset * 1.2) * 0.18) + (isWeekend ? 0.22 : -0.08);
    const dayPrice = Math.round((basePrice * (1 + variation)) / 100) * 100;

    result.push({
      date: cur.toISOString().split('T')[0],
      dayOfWeek: dayNames[cur.getDay()],
      dayOfMonth: cur.getDate(),
      price: Math.max(5000, dayPrice),
      isLowest: offset === -2,
      isHighest: offset === 4,
      isPast: offset < 0 && cur < new Date(),
    });
  }

  return result;
};
