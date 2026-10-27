import { Flight, SearchParams, SellerOffer, DatePriceHeatmap, LayoverInfo, FlightSegment } from '../types';
import { getAirportByCode, getNearbyAirports, POPULAR_DESTINATIONS } from '../data/airports';

// Realistic airline and seller mock generators
const AIRLINES = [
  { name: 'Turkish Airlines', code: 'TK', logo: '🇹🇷' },
  { name: 'Emirates', code: 'EK', logo: '🇦🇪' },
  { name: 'Air Baltic', code: 'BT', logo: '🇱🇻' },
  { name: 'Flydubai', code: 'FZ', logo: '🇦🇪' },
  { name: 'Pegasus Airlines', code: 'PC', logo: '🇹🇷' },
  { name: 'Ryanair', code: 'FR', logo: '🇮🇪' },
  { name: 'Wizz Air', code: 'W6', logo: '🇭🇺' },
  { name: 'Armenia Airways', code: '6A', logo: '🇦🇲' },
  { name: 'Georgian Airways', code: 'A9', logo: '🇬🇪' },
  { name: 'Qatar Airways', code: 'QR', logo: '🇶🇦' },
  { name: 'Lufthansa', code: 'LH', logo: '🇩🇪' },
  { name: 'Uzbekistan Airways', code: 'HY', logo: '🇺🇿' },
];

const SELLERS = [
  'Официальный сайт авиакомпании',
  'City.Travel',
  'КупиБилет',
  'OneTwoTrip',
  'SuperKassa',
  'Билетик.Аэро',
  'МегаТрэвел'
];

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  // Simulate network & multi-market scan latency
  await new Promise(res => setTimeout(res, 600));

  const fromAirport = getAirportByCode(params.fromCode);
  const toAirport = getAirportByCode(params.toCode);

  const fromCity = fromAirport?.city || params.fromCity || 'Город отправления';
  const toCity = toAirport?.city || params.toCity || 'Город прибытия';

  // Base pricing logic influenced by destination distance
  let basePrice = 14500;
  if (['DXB', 'BKK', 'HKT'].includes(params.toCode)) basePrice = 32000;
  if (['EVN', 'TBS', 'IST'].includes(params.toCode)) basePrice = 12900;
  if (['RIX', 'TLL', 'VNO'].includes(params.toCode)) basePrice = 15800;

  // Generate 6 to 9 unique flight options from different airlines and routes
  const flights: Flight[] = [];

  // 1. Direct or fastest flight option
  const directAirline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
  const directPrice = Math.round(basePrice * 1.15 / 100) * 100;

  const directSellers: SellerOffer[] = [
    {
      id: 'sel_1',
      sellerName: `Официальный сайт ${directAirline.name}`,
      isAirlineDirect: true,
      price: directPrice + 450,
      baggageIncluded: true,
      carryOnIncluded: true,
      bookingUrl: 'https://airline.com/booking',
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
    },
    {
      id: 'sel_3',
      sellerName: 'КупиБилет',
      isAirlineDirect: false,
      price: directPrice + 200,
      baggageIncluded: true,
      carryOnIncluded: true,
      bookingUrl: 'https://partner.com/deal2',
      rating: 4.7
    }
  ];

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
        departureTime: '10:15',
        arrivalTime: '14:35',
        duration: '4ч 20м',
        flightNumber: `${directAirline.code}-412`,
        airline: directAirline.name,
        airlineLogo: directAirline.logo,
        aircraft: 'Airbus A321neo'
      }
    ],
    airlines: [directAirline.name],
    bestPrice: directPrice,
    averageMarketPrice: Math.round(directPrice * 1.25),
    priceDiscountPercent: 12,
    priceTrend: 'rising',
    priceConfidenceText: 'Высокий спрос на прямой рейс. Вероятность роста цены 86% в течение 24ч.',
    baggageIncluded: false,
    carryOnIncluded: true,
    sellers: directSellers,
    isFastest: true,
  });

  // 2. Super cheap option (low-cost carrier with 1 layover)
  const lowCostAirline = AIRLINES[2]; // Air Baltic / Pegasus
  const cheapPrice = Math.round(basePrice * 0.78 / 100) * 100;
  const cheapLayover: LayoverInfo = {
    airportCode: 'IST',
    city: 'Стамбул',
    duration: '2ч 40м',
    isShort: false,
    isNight: false,
  };

  const cheapSellers: SellerOffer[] = [
    {
      id: 'sel_ch_1',
      sellerName: 'SuperKassa',
      isAirlineDirect: false,
      price: cheapPrice,
      baggageIncluded: false,
      carryOnIncluded: true,
      bookingUrl: 'https://partner.com/superkassa',
      rating: 4.8
    },
    {
      id: 'sel_ch_2',
      sellerName: `Официальный сайт ${lowCostAirline.name}`,
      isAirlineDirect: true,
      price: cheapPrice + 800,
      baggageIncluded: true,
      carryOnIncluded: true,
      bookingUrl: 'https://airline.com/booking',
      rating: 4.9
    }
  ];

  flights.push({
    id: 'fl_cheapest',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '06:40',
    arrivalTime: '15:20',
    durationTotal: '8ч 40м',
    durationMinutes: 520,
    stopsCount: 1,
    layovers: [cheapLayover],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'IST',
        departureCity: fromCity,
        arrivalCity: 'Стамбул',
        departureTime: '06:40',
        arrivalTime: '10:00',
        duration: '3ч 20м',
        flightNumber: `${lowCostAirline.code}-819`,
        airline: lowCostAirline.name,
        airlineLogo: lowCostAirline.logo,
        aircraft: 'Boeing 737-800'
      },
      {
        departureAirport: 'IST',
        arrivalAirport: params.toCode,
        departureCity: 'Стамбул',
        arrivalCity: toCity,
        departureTime: '12:40',
        arrivalTime: '15:20',
        duration: '2ч 40м',
        flightNumber: `${lowCostAirline.code}-992`,
        airline: lowCostAirline.name,
        airlineLogo: lowCostAirline.logo,
        aircraft: 'Boeing 737-800'
      }
    ],
    airlines: [lowCostAirline.name],
    bestPrice: cheapPrice,
    averageMarketPrice: Math.round(cheapPrice * 1.35),
    priceDiscountPercent: 26,
    priceTrend: 'dropping',
    priceConfidenceText: 'Суперцена! На 26% дешевле среднего предложения по рынку.',
    baggageIncluded: false,
    carryOnIncluded: true,
    sellers: cheapSellers,
    isCheapest: true,
  });

  // 3. Optimal Flight (best balance of short layover + full baggage + great price)
  const optAirline = AIRLINES[0]; // Turkish or Emirates
  const optPrice = Math.round(basePrice * 0.94 / 100) * 100;
  const optLayover: LayoverInfo = {
    airportCode: 'EVN',
    city: 'Ереван',
    duration: '1ч 45м',
    isShort: false,
    isNight: false,
  };

  const optSellers: SellerOffer[] = [
    {
      id: 'sel_opt_1',
      sellerName: 'Билетик.Аэро',
      isAirlineDirect: false,
      price: optPrice,
      baggageIncluded: true,
      carryOnIncluded: true,
      bookingUrl: 'https://partner.com/biletik',
      rating: 4.9
    },
    {
      id: 'sel_opt_2',
      sellerName: `Официальный сайт ${optAirline.name}`,
      isAirlineDirect: true,
      price: optPrice + 350,
      baggageIncluded: true,
      carryOnIncluded: true,
      bookingUrl: 'https://airline.com/booking',
      rating: 4.95
    }
  ];

  flights.push({
    id: 'fl_optimal',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '12:20',
    arrivalTime: '19:35',
    durationTotal: '7ч 15м',
    durationMinutes: 435,
    stopsCount: 1,
    layovers: [optLayover],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'EVN',
        departureCity: fromCity,
        arrivalCity: 'Ереван',
        departureTime: '12:20',
        arrivalTime: '15:30',
        duration: '3ч 10м',
        flightNumber: `${optAirline.code}-221`,
        airline: optAirline.name,
        airlineLogo: optAirline.logo,
        aircraft: 'Airbus A320'
      },
      {
        departureAirport: 'EVN',
        arrivalAirport: params.toCode,
        departureCity: 'Ереван',
        arrivalCity: toCity,
        departureTime: '17:15',
        arrivalTime: '19:35',
        duration: '2ч 20м',
        flightNumber: `${optAirline.code}-778`,
        airline: optAirline.name,
        airlineLogo: optAirline.logo,
        aircraft: 'Airbus A320'
      }
    ],
    airlines: [optAirline.name],
    bestPrice: optPrice,
    averageMarketPrice: Math.round(optPrice * 1.2),
    priceDiscountPercent: 18,
    priceTrend: 'stable',
    priceConfidenceText: 'Оптимальный тариф: включает багаж 23 кг и удобную дневную пересадку 1ч 45м.',
    baggageIncluded: true,
    carryOnIncluded: true,
    sellers: optSellers,
    isOptimal: true,
  });

  // 4. Flight with nearby airport alternative (e.g. Riga / Tallinn or alternative hub)
  const nearbyHubs = getNearbyAirports(params.fromCode);
  if (nearbyHubs.length > 0 || params.includeNearbyAirports) {
    const nearby = nearbyHubs[0] || { code: 'TLL', city: 'Таллин', name: 'Таллин' };
    const altPrice = Math.round(cheapPrice * 0.88 / 100) * 100;
    const altAirline = AIRLINES[2]; // Air Baltic

    flights.push({
      id: `fl_nearby_${nearby.code}`,
      fromCode: nearby.code,
      fromCity: `${nearby.city} (соседний хаб)`,
      toCode: params.toCode,
      toCity,
      departureDate: params.departureDate,
      departureTime: '14:00',
      arrivalTime: '18:15',
      durationTotal: '4ч 15м',
      durationMinutes: 255,
      stopsCount: 0,
      layovers: [],
      segments: [
        {
          departureAirport: nearby.code,
          arrivalAirport: params.toCode,
          departureCity: nearby.city,
          arrivalCity: toCity,
          departureTime: '14:00',
          arrivalTime: '18:15',
          duration: '4ч 15м',
          flightNumber: `${altAirline.code}-504`,
          airline: altAirline.name,
          airlineLogo: altAirline.logo,
          aircraft: 'Airbus A220-300'
        }
      ],
      airlines: [altAirline.name],
      bestPrice: altPrice,
      averageMarketPrice: Math.round(altPrice * 1.3),
      priceDiscountPercent: 24,
      priceTrend: 'dropping',
      priceConfidenceText: `Вылет из ${nearby.city} экономит вам ${cheapPrice - altPrice} ₽! Прямой рейс.`,
      baggageIncluded: true,
      carryOnIncluded: true,
      sellers: [
        {
          id: 'sel_alt_1',
          sellerName: `Официальный сайт ${altAirline.name}`,
          isAirlineDirect: true,
          price: altPrice,
          baggageIncluded: true,
          carryOnIncluded: true,
          bookingUrl: 'https://airline.com',
          rating: 4.9
        }
      ]
    });
  }

  // 5. Short layover warning flight (e.g. 45 min connection)
  const shortLayoverFlightPrice = Math.round(basePrice * 0.82 / 100) * 100;
  flights.push({
    id: 'fl_warning_short',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: '18:30',
    arrivalTime: '02:10',
    durationTotal: '7ч 40м',
    durationMinutes: 460,
    stopsCount: 1,
    layovers: [
      {
        airportCode: 'SAW',
        city: 'Стамбул Сабиха',
        duration: '45м',
        isShort: true,
        isNight: false,
      }
    ],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: 'SAW',
        departureCity: fromCity,
        arrivalCity: 'Стамбул',
        departureTime: '18:30',
        arrivalTime: '22:15',
        duration: '3ч 45м',
        flightNumber: 'PC-1102',
        airline: 'Pegasus Airlines',
        airlineLogo: '🇹🇷',
      },
      {
        departureAirport: 'SAW',
        arrivalAirport: params.toCode,
        departureCity: 'Стамбул',
        arrivalCity: toCity,
        departureTime: '23:00',
        arrivalTime: '02:10',
        duration: '3ч 10м',
        flightNumber: 'PC-402',
        airline: 'Pegasus Airlines',
        airlineLogo: '🇹🇷',
      }
    ],
    airlines: ['Pegasus Airlines'],
    bestPrice: shortLayoverFlightPrice,
    averageMarketPrice: Math.round(shortLayoverFlightPrice * 1.2),
    priceDiscountPercent: 15,
    priceTrend: 'stable',
    priceConfidenceText: 'Внимание: очень короткая пересадка 45 мин в Стамбуле (SAW).',
    baggageIncluded: false,
    carryOnIncluded: true,
    sellers: [
      {
        id: 'sel_pc_1',
        sellerName: 'Pegasus Direct',
        isAirlineDirect: true,
        price: shortLayoverFlightPrice,
        baggageIncluded: false,
        carryOnIncluded: true,
        bookingUrl: 'https://flypgs.com',
        rating: 4.6
      }
    ]
  });

  return flights;
};

// Generates 14-day heatmap around selected departure date
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
      isLowest: offset === -2, // highlight best day
      isHighest: offset === 4,
      isPast: offset < 0 && cur < new Date(),
    });
  }

  return result;
};
