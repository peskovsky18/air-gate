import { Flight, SearchParams, SellerOffer, DatePriceHeatmap, LayoverInfo, FlightSegment, MultiHubInfo, PriceVerdict, PaymentBreakdown } from '../types';
import { getAirportByCode, getNearbyAirports } from '../data/airports';

const GLOBAL_SELLERS = [
  { name: 'City.Travel', rating: 4.8, rubFee: 0, foreignFee: -600 },
  { name: 'КупиБилет', rating: 4.7, rubFee: 150, foreignFee: -400 },
  { name: 'OneTwoTrip', rating: 4.9, rubFee: 290, foreignFee: -300 },
  { name: 'SuperKassa', rating: 4.6, rubFee: -200, foreignFee: -800 },
  { name: 'Aviakassa', rating: 4.7, rubFee: 80, foreignFee: -500 },
  { name: 'Trip.com', rating: 4.9, rubFee: 120, foreignFee: -1100 },
  { name: 'Biletik.aero', rating: 4.6, rubFee: -150, foreignFee: -700 },
];

const generatePaymentBreakdown = (baseRub: number): PaymentBreakdown => {
  const eurRate = 104;
  const foreignEur = Math.round((baseRub * 0.94) / eurRate);
  const foreignApproxRub = foreignEur * eurRate;
  const savings = baseRub - foreignApproxRub;

  return {
    rubPrice: baseRub,
    foreignPriceEur: foreignEur,
    foreignPriceUsd: Math.round(foreignEur * 1.08),
    foreignCurrencySavingsRub: Math.max(300, savings),
  };
};

const generateSellers = (airlineName: string, basePrice: number, baggageIncluded: boolean): SellerOffer[] => {
  const payment = generatePaymentBreakdown(basePrice);

  const offers: SellerOffer[] = [
    {
      id: `dir_${Math.random()}`,
      sellerName: `Официальный сайт ${airlineName}`,
      isAirlineDirect: true,
      price: basePrice + 350,
      paymentRub: basePrice + 350,
      paymentForeign: {
        amount: Math.round((basePrice * 0.93) / 104),
        currency: 'EUR',
        approxRub: Math.round((basePrice * 0.93)),
        savingsRub: Math.round(basePrice * 0.07),
      },
      baggageIncluded,
      carryOnIncluded: true,
      bookingUrl: 'https://airline.com/direct',
      rating: 4.95,
    }
  ];

  const shuffled = [...GLOBAL_SELLERS].sort(() => 0.5 - Math.random()).slice(0, 4);
  shuffled.forEach((s, idx) => {
    const rubPrice = Math.max(2500, basePrice + s.rubFee + (idx === 0 ? -300 : idx * 140));
    const foreignEur = Math.round((rubPrice * 0.92) / 104);
    const foreignRub = foreignEur * 104;

    offers.push({
      id: `ota_${idx}_${Math.random()}`,
      sellerName: s.name,
      isAirlineDirect: false,
      price: rubPrice,
      paymentRub: rubPrice,
      paymentForeign: {
        amount: foreignEur,
        currency: 'EUR',
        approxRub: foreignRub,
        savingsRub: rubPrice - foreignRub,
      },
      baggageIncluded: idx % 2 === 0 ? baggageIncluded : false,
      carryOnIncluded: true,
      bookingUrl: 'https://ota.com/deal',
      rating: s.rating,
    });
  });

  return offers.sort((a, b) => a.price - b.price);
};

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  await new Promise(res => setTimeout(res, 450));

  const fromAirport = getAirportByCode(params.fromCode);
  const toAirport = getAirportByCode(params.toCode);
  const fromCity = fromAirport?.city || params.fromCity || 'Город отправления';
  const toCity = toAirport?.city || params.toCity || 'Город прибытия';

  let marketMedian = 14800;
  if (['DXB', 'BKK', 'HKT'].includes(params.toCode)) marketMedian = 34000;
  if (['EVN', 'TBS', 'IST'].includes(params.toCode)) marketMedian = 12500;
  if (['RIX', 'TLL', 'VNO'].includes(params.toCode)) marketMedian = 8900;

  const flights: Flight[] = [];

  // 1. CHARTER FLIGHT / Блочные места туроператора (на 45% дешевле, багаж 20 кг включен)
  const charterPrice = Math.round((marketMedian * 0.54) / 100) * 100;
  flights.push({
    id: 'fl_charter_tour',
    flightType: 'charter',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '05:30',
    arrivalTime: '09:50',
    durationTotal: '4ч 20м (прямой)',
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
        departureTime: '05:30',
        arrivalTime: '09:50',
        duration: '4ч 20м',
        flightNumber: 'FV-5881',
        airline: 'Чартер / Блок туроператора',
        aircraft: 'Boeing 777-200ER',
      }
    ],
    airlines: ['Чартер / Блок туроператора'],
    bestPrice: charterPrice,
    averageMarketPrice: marketMedian,
    priceDiscountPercent: 46,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    charterNote: 'Чартерный рейс: багаж 20 кг включен в стоимость. Выписка маршрутной квитанции за 24 часа до вылета.',
    transitVisaNote: 'Прямой чартерный перелет без пересадок.',
    paymentBreakdown: generatePaymentBreakdown(charterPrice),
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Чартерная выгода (-46%)',
      explanation: 'Горящие блочные места от туроператора на 46% дешевле регулярных авиакомпаний. Багаж 20 кг включен.',
      confidencePercent: 96,
    },
    sellers: generateSellers('Чартерный блок', charterPrice, true),
    isCheapest: true,
  });

  // 2. SMART COMBINATION: Стыковка двух нестыкуемых лоукостеров с гарантией стыковки
  const smartCombPrice = Math.round((marketMedian * 0.62) / 100) * 100;
  flights.push({
    id: 'fl_smart_combination',
    flightType: 'smart_combination',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '08:15',
    arrivalTime: '16:30',
    durationTotal: '8ч 15м (умная стыковка)',
    durationMinutes: 495,
    stopsCount: 1,
    hasConnectionGuarantee: true,
    layovers: [
      {
        airportCode: 'WAW',
        city: 'Варшава',
        duration: '2ч 45м',
        isShort: false,
        isNight: false,
        terminalChange: 'Один терминал (T1)',
        selfTransfer: true,
        transitVisaRequired: false,
        transitVisaNote: 'Шенгенская зона. Виза не требуется при наличии Шенгена.',
        baggageRecheck: true,
        hasConnectionGuarantee: true,
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
        departureTime: '08:15',
        arrivalTime: '09:30',
        duration: '1ч 15м',
        flightNumber: 'FR-4421',
        airline: 'Ryanair',
        aircraft: 'Boeing 737-800',
      },
      {
        departureAirport: 'WAW',
        arrivalAirport: params.toCode,
        departureCity: 'Варшава',
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T2',
        departureTime: '12:15',
        arrivalTime: '16:30',
        duration: '4ч 15м',
        flightNumber: 'W6-1904',
        airline: 'Wizz Air',
        aircraft: 'Airbus A321neo',
      }
    ],
    airlines: ['Ryanair', 'Wizz Air'],
    bestPrice: smartCombPrice,
    averageMarketPrice: marketMedian,
    priceDiscountPercent: 38,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: true,
    baggageRecheck: true,
    terminalChangeWarning: 'Багаж необходимо перерегистрировать в Варшаве',
    transitVisaNote: '🛡 Включена гарантия стыковки (Smart Connection Guarantee): при задержке рейса страховка оплатит альтернативный билет.',
    paymentBreakdown: generatePaymentBreakdown(smartCombPrice),
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Умная стыковка (Smart Connection)',
      explanation: 'Комбинация рейсов Ryanair + Wizz Air с гарантией стыковки. Экономия 38% по сравнению со сквозными тарифами.',
      confidencePercent: 93,
    },
    sellers: generateSellers('Smart Combo', smartCombPrice, false),
  });

  // 3. Regular Direct Flight (Air Baltic)
  const directPrice = Math.round((marketMedian * 0.94) / 100) * 100;
  flights.push({
    id: 'fl_direct_regular',
    flightType: 'regular',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '10:15',
    arrivalTime: '14:35',
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
        departureTime: '10:15',
        arrivalTime: '14:35',
        duration: '4ч 20м',
        flightNumber: 'BT-412',
        airline: 'Air Baltic',
        aircraft: 'Airbus A220-300',
      }
    ],
    airlines: ['Air Baltic'],
    bestPrice: directPrice,
    averageMarketPrice: Math.round(directPrice * 1.25),
    priceDiscountPercent: 12,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Прямой регулярный рейс.',
    paymentBreakdown: generatePaymentBreakdown(directPrice),
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Прямой и быстрый',
      explanation: 'Самый быстрый вариант без пересадок. Тариф на минимуме за последние 30 дней.',
      confidencePercent: 91,
    },
    sellers: generateSellers('Air Baltic', directPrice, false),
    isFastest: true,
  });

  // 4. Regular Optimal Flight with Baggage (Turkish Airlines)
  const optPrice = Math.round((marketMedian * 1.05) / 100) * 100;
  flights.push({
    id: 'fl_optimal_turkish',
    flightType: 'regular',
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
    bestPrice: optPrice,
    averageMarketPrice: Math.round(optPrice * 1.2),
    priceDiscountPercent: 10,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Багаж 23 кг и горячее питание включены в стоимость.',
    paymentBreakdown: generatePaymentBreakdown(optPrice),
    verdict: {
      action: 'fair_price',
      badgeTitle: 'Оптимальный выбор',
      explanation: 'Полный сервис без скрытых сборов: багаж 23 кг, удобное дневное время, горячее питание.',
      confidencePercent: 92,
    },
    sellers: generateSellers('Turkish Airlines', optPrice, true),
    isOptimal: true,
  });

  // 5. Smart Multi-Hub Route (Riga ↔ Tallinn / Vilnius)
  const isBaltic = ['RIX', 'TLL', 'VNO', 'HEL'].includes(params.fromCode);
  const altCity = params.fromCode === 'RIX' ? 'Таллин' : 'Рига';
  const altCode = params.fromCode === 'RIX' ? 'TLL' : 'RIX';
  const groundDesc = params.fromCode === 'RIX' ? 'Автобус Lux Express из Риги (4ч 15м)' : 'Автобус Lux Express из Таллина (4ч 20м)';
  const groundPrice = 1200;
  const multiPrice = Math.round((marketMedian * 0.58) / 100) * 100;
  const savings = marketMedian - (multiPrice + groundPrice);

  if (isBaltic) {
    const multiHubInfo: MultiHubInfo = {
      isAlternative: true,
      originCity: altCity,
      originCode: altCode,
      groundTransport: groundDesc,
      groundPrice,
      flightPrice: multiPrice,
      netSavings: savings,
      badgeText: `Чистая экономия ${savings.toLocaleString('ru-RU')} ₽ с учетом автобуса`,
    };

    flights.push({
      id: 'fl_multihub_ryanair',
      flightType: 'regular',
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
          aircraft: 'Boeing 737 MAX 8',
        }
      ],
      airlines: ['Ryanair'],
      bestPrice: multiPrice,
      averageMarketPrice: marketMedian,
      priceDiscountPercent: 42,
      baggageIncluded: false,
      carryOnIncluded: true,
      selfTransfer: false,
      baggageRecheck: false,
      transitVisaNote: 'Прямой вылет из соседней столицы.',
      multiHubAlternative: multiHubInfo,
      paymentBreakdown: generatePaymentBreakdown(multiPrice),
      verdict: {
        action: 'buy_now',
        badgeTitle: 'Умный мульти-хаб',
        explanation: `Рейс из ${altCity} стоит ${multiPrice.toLocaleString('ru-RU')} ₽. С учетом комфортного автобуса ${groundDesc} (${groundPrice} ₽) выгода составляет ${savings.toLocaleString('ru-RU')} ₽.`,
        confidencePercent: 97,
      },
      sellers: generateSellers('Ryanair', multiPrice, false),
    });
  }

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
