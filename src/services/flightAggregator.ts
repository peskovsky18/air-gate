import { Flight, SearchParams, SellerOffer, DatePriceHeatmap, LayoverInfo, FlightSegment, MultiHubInfo, PriceVerdict } from '../types';
import { getAirportByCode, getNearbyAirports } from '../data/airports';

const AIRLINES = [
  { name: 'Turkish Airlines', code: 'TK' },
  { name: 'Emirates', code: 'EK' },
  { name: 'Air Baltic', code: 'BT' },
  { name: 'Flydubai', code: 'FZ' },
  { name: 'Pegasus Airlines', code: 'PC' },
  { name: 'Ryanair', code: 'FR' },
  { name: 'Wizz Air', code: 'W6' },
  { name: 'Armenia Airways', code: '6A' },
  { name: 'Georgian Airways', code: 'A9' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'Lufthansa', code: 'LH' },
];

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  await new Promise(res => setTimeout(res, 400));

  const fromAirport = getAirportByCode(params.fromCode);
  const toAirport = getAirportByCode(params.toCode);

  const fromCity = fromAirport?.city || params.fromCity || 'Город отправления';
  const toCity = toAirport?.city || params.toCity || 'Город прибытия';

  let basePrice = 14500;
  if (['DXB', 'BKK', 'HKT'].includes(params.toCode)) basePrice = 32000;
  if (['EVN', 'TBS', 'IST'].includes(params.toCode)) basePrice = 12900;
  if (['RIX', 'TLL', 'VNO'].includes(params.toCode)) basePrice = 9800;

  const flights: Flight[] = [];

  // 1. Direct Flight with "Брать сейчас" verdict
  const directAirline = AIRLINES[2]; // Air Baltic or Turkish
  const directPrice = Math.round(basePrice * 1.05 / 100) * 100;

  flights.push({
    id: 'fl_direct_fastest',
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
        flightNumber: `${directAirline.code}-412`,
        airline: directAirline.name,
        aircraft: 'Airbus A220-300'
      }
    ],
    airlines: [directAirline.name],
    bestPrice: directPrice,
    averageMarketPrice: Math.round(directPrice * 1.25),
    priceDiscountPercent: 12,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Прямой рейс. Никаких транзитных виз и пересадок.',
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Брать сейчас',
      explanation: 'Цена на минимуме за последние 45 дней. Прямых рейсов мало, вероятность роста +18% в течение 24 часов.',
      confidencePercent: 91,
      expectedChange: '+2 400 ₽ завтра',
    },
    sellers: [
      {
        id: 'sel_1',
        sellerName: `Официальный сайт ${directAirline.name}`,
        isAirlineDirect: true,
        price: directPrice + 450,
        baggageIncluded: true,
        carryOnIncluded: true,
        bookingUrl: 'https://airline.com',
        rating: 4.9
      },
      {
        id: 'sel_2',
        sellerName: 'City.Travel',
        isAirlineDirect: false,
        price: directPrice,
        baggageIncluded: false,
        carryOnIncluded: true,
        bookingUrl: 'https://partner.com/deal1',
        rating: 4.8
      }
    ],
    isFastest: true,
  });

  // 2. Smart Multi-Hub Alternative Flight (KILLER FEATURE: Ground + Flight savings!)
  const isBalticSearch = ['RIX', 'TLL', 'VNO'].includes(params.fromCode);
  const altCity = params.fromCode === 'RIX' ? 'Таллин' : 'Рига';
  const altCode = params.fromCode === 'RIX' ? 'TLL' : 'RIX';
  const groundTransportDesc = params.fromCode === 'RIX' ? 'Автобус Lux Express из Риги (4ч 15м)' : 'Автобус Ecolines из Таллина (4ч 30м)';
  const groundPrice = 1200;
  const multiFlightPrice = Math.round(basePrice * 0.62 / 100) * 100;
  const netSavings = directPrice - (multiFlightPrice + groundPrice);

  if (isBalticSearch && netSavings > 1500) {
    const multiHubInfo: MultiHubInfo = {
      isAlternative: true,
      originCity: altCity,
      originCode: altCode,
      groundTransport: groundTransportDesc,
      groundPrice,
      flightPrice: multiFlightPrice,
      netSavings,
      badgeText: `Экономия ${netSavings.toLocaleString('ru-RU')} ₽ с учетом автобуса`,
    };

    flights.push({
      id: 'fl_multihub_smart',
      fromCode: altCode,
      fromCity: `${altCity} (умный хаб)`,
      toCode: params.toCode,
      toCity,
      departureDate: params.departureDate,
      departureTime: '15:20',
      arrivalTime: '19:40',
      durationTotal: '4ч 20м рейс (+4ч автобус)',
      durationMinutes: 260,
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
          departureTime: '15:20',
          arrivalTime: '19:40',
          duration: '4ч 20м',
          flightNumber: 'FR-2841',
          airline: 'Ryanair',
          aircraft: 'Boeing 737 MAX 8'
        }
      ],
      airlines: ['Ryanair'],
      bestPrice: multiFlightPrice,
      averageMarketPrice: directPrice,
      priceDiscountPercent: Math.round((netSavings / directPrice) * 100),
      baggageIncluded: false,
      carryOnIncluded: true,
      selfTransfer: false,
      baggageRecheck: false,
      transitVisaNote: 'Вылет из соседней столицы. Шенгенская зона без границ.',
      multiHubAlternative: multiHubInfo,
      verdict: {
        action: 'buy_now',
        badgeTitle: 'Умная выгода',
        explanation: `Билет из ${altCity} стоит всего ${multiFlightPrice.toLocaleString('ru-RU')} ₽. Даже с билетом на комфортный автобус ${groundTransportDesc} (${groundPrice} ₽) вы экономите чистыми ${netSavings.toLocaleString('ru-RU')} ₽!`,
        confidencePercent: 96,
      },
      sellers: [
        {
          id: 'sel_multi_1',
          sellerName: 'Официальный сайт Ryanair',
          isAirlineDirect: true,
          price: multiFlightPrice,
          baggageIncluded: false,
          carryOnIncluded: true,
          bookingUrl: 'https://ryanair.com',
          rating: 4.8
        }
      ],
      isCheapest: true,
    });
  }

  // 3. Layover Flight with Terminal Change & Night Warning
  const layoverPrice = Math.round(basePrice * 0.74 / 100) * 100;
  const layoverAirline = AIRLINES[4]; // Pegasus
  const layoverInfo: LayoverInfo = {
    airportCode: 'SAW',
    city: 'Стамбул',
    duration: '1ч 15м',
    isShort: true,
    isNight: false,
    terminalChange: 'Смена терминала 1 → 2',
    selfTransfer: true,
    transitVisaRequired: false,
    transitVisaNote: 'Транзитная зона открыта, виза не требуется. Но требуется повторная сдача багажа!',
    baggageRecheck: true,
  };

  flights.push({
    id: 'fl_layover_warning',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '06:10',
    arrivalTime: '14:50',
    durationTotal: '8ч 40м',
    durationMinutes: 520,
    stopsCount: 1,
    layovers: [layoverInfo],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'SAW',
        departureCity: fromCity,
        arrivalCity: 'Стамбул',
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: '06:10',
        arrivalTime: '10:45',
        duration: '4ч 35м',
        flightNumber: 'PC-1204',
        airline: 'Pegasus Airlines',
        aircraft: 'Airbus A320neo'
      },
      {
        departureAirport: 'SAW',
        arrivalAirport: params.toCode,
        departureCity: 'Стамбул',
        arrivalCity: toCity,
        departureTerminal: 'T2',
        arrivalTerminal: 'T1',
        departureTime: '12:00',
        arrivalTime: '14:50',
        duration: '2ч 50м',
        flightNumber: 'PC-891',
        airline: 'Pegasus Airlines',
        aircraft: 'Boeing 737-800'
      }
    ],
    airlines: ['Pegasus Airlines'],
    bestPrice: layoverPrice,
    averageMarketPrice: Math.round(layoverPrice * 1.3),
    priceDiscountPercent: 24,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: true,
    baggageRecheck: true,
    terminalChangeWarning: 'Смена терминала T1 → T2 (пешком 15 мин)',
    transitVisaNote: 'Виза не нужна, но при повторной сдаче багажа нужно пройти паспортный контроль.',
    verdict: {
      action: 'wait',
      badgeTitle: 'Подождать',
      explanation: 'Низкая цена, но сложная пересадка: раздельное бронирование (self-transfer), нужно забрать и снова сдать багаж в Стамбуле за 1ч 15м. Высокий риск опоздания.',
      confidencePercent: 78,
    },
    sellers: [
      {
        id: 'sel_pg_1',
        sellerName: 'SuperKassa',
        isAirlineDirect: false,
        price: layoverPrice,
        baggageIncluded: false,
        carryOnIncluded: true,
        bookingUrl: 'https://superkassa.ru',
        rating: 4.7
      }
    ],
  });

  // 4. Optimal Comfort Flight (Seamless luggage, no visa, fair price)
  const optPrice = Math.round(basePrice * 0.88 / 100) * 100;
  const optAirline = AIRLINES[0]; // Turkish Airlines
  flights.push({
    id: 'fl_optimal_comfort',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '13:00',
    arrivalTime: '20:15',
    durationTotal: '7ч 15м',
    durationMinutes: 435,
    stopsCount: 1,
    layovers: [
      {
        airportCode: 'IST',
        city: 'Стамбул Новый',
        duration: '2ч 10м',
        isShort: false,
        isNight: false,
        selfTransfer: false,
        transitVisaRequired: false,
        transitVisaNote: 'Единый билет. Багаж летит прямо до конечного пункта.',
        baggageRecheck: false,
      }
    ],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'IST',
        departureCity: fromCity,
        arrivalCity: 'Стамбул',
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: '13:00',
        arrivalTime: '16:20',
        duration: '3ч 20м',
        flightNumber: 'TK-1422',
        airline: 'Turkish Airlines',
        aircraft: 'Airbus A330-300'
      },
      {
        departureAirport: 'IST',
        arrivalAirport: params.toCode,
        departureCity: 'Стамбул',
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T2',
        departureTime: '18:30',
        arrivalTime: '20:15',
        duration: '1ч 45м',
        flightNumber: 'TK-701',
        airline: 'Turkish Airlines',
        aircraft: 'Airbus A321neo'
      }
    ],
    airlines: ['Turkish Airlines'],
    bestPrice: optPrice,
    averageMarketPrice: Math.round(optPrice * 1.2),
    priceDiscountPercent: 18,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Единая транзитная зона IST. Питание на борту включено, багаж 23 кг.',
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Оптимальный выбор',
      explanation: 'Идеальный баланс: единый билет Turkish Airlines (включая багаж 23 кг и горячее питание), комфортная пересадка 2ч 10м без смены терминала.',
      confidencePercent: 94,
    },
    sellers: [
      {
        id: 'sel_tk_1',
        sellerName: 'Официальный сайт Turkish Airlines',
        isAirlineDirect: true,
        price: optPrice,
        baggageIncluded: true,
        carryOnIncluded: true,
        bookingUrl: 'https://turkishairlines.com',
        rating: 4.95
      },
      {
        id: 'sel_tk_2',
        sellerName: 'КупиБилет',
        isAirlineDirect: false,
        price: optPrice - 200,
        baggageIncluded: true,
        carryOnIncluded: true,
        bookingUrl: 'https://kupibilet.ru',
        rating: 4.8
      }
    ],
    isOptimal: true,
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
