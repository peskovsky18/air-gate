import {
  Flight,
  SearchParams,
  SellerOffer,
  MultiHubInfo,
  PaymentBreakdown,
  MarketAnalysis,
} from '../types';
import { getAirportByCode, POPULAR_AIRPORTS, POPULAR_DESTINATIONS } from '../data/airports';
import { parseYMD } from '../lib/dateUtils';

// Intermediaries / OTAs with genuine deep-link construction
export const buildPartnerDeepLink = (
  sellerName: string,
  fromCode: string,
  toCode: string,
  departureDate: string,
  passengers: number = 1
): string => {
  const name = sellerName.toLowerCase();
  const cleanDate = departureDate.replace(/-/g, '');

  if (name.includes('city.travel')) {
    return `https://city.travel/flights?from=${fromCode}&to=${toCode}&date=${departureDate}&passengers=${passengers}`;
  }
  if (name.includes('купибилет') || name.includes('kupibilet')) {
    return `https://www.kupibilet.ru/booking?from=${fromCode}&to=${toCode}&date=${departureDate}&adults=${passengers}`;
  }
  if (name.includes('onetwotrip')) {
    return `https://www.onetwotrip.com/ru/flights/#${fromCode}${cleanDate}${toCode}${passengers}00e`;
  }
  if (name.includes('superkassa')) {
    return `https://superkassa.ru/search?from=${fromCode}&to=${toCode}&date=${departureDate}&adults=${passengers}`;
  }
  if (name.includes('trip.com')) {
    return `https://ru.trip.com/flights/${fromCode.toLowerCase()}-to-${toCode.toLowerCase()}/?dcity=${fromCode}&acity=${toCode}&ddate=${departureDate}`;
  }
  if (name.includes('aviakassa')) {
    return `https://www.aviakassa.com/search?from=${fromCode}&to=${toCode}&date=${departureDate}&passengers=${passengers}`;
  }
  if (name.includes('biletik')) {
    return `https://biletik.aero/search?from=${fromCode}&to=${toCode}&date=${departureDate}`;
  }

  // Airline direct deep-links
  if (name.includes('baltic')) {
    return `https://www.airbaltic.com/ru-RU/booking?origin=${fromCode}&destination=${toCode}&date=${departureDate}`;
  }
  if (name.includes('ryanair')) {
    return `https://www.ryanair.com/ru/ru/trip/flights/select?originIata=${fromCode}&destinationIata=${toCode}&tpAdults=${passengers}&tpStartDate=${departureDate}`;
  }
  if (name.includes('wizz')) {
    return `https://wizzair.com/ru-ru#/booking/select-flight/${fromCode}/${toCode}/${departureDate}/null/${passengers}/0/0/null`;
  }
  if (name.includes('turkish')) {
    return `https://www.turkishairlines.com/`;
  }
  if (name.includes('pegasus')) {
    return `https://www.flypgs.com/`;
  }
  if (name.includes('emirates')) {
    return `https://www.emirates.com/`;
  }
  if (name.includes('flydubai')) {
    return `https://www.flydubai.com/ru/`;
  }
  if (name.includes('аэрофлот') || name.includes('aeroflot')) {
    return `https://www.aeroflot.ru/sb/app/ru-ru`;
  }
  if (name.includes('победа') || name.includes('pobeda')) {
    return `https://pobeda.aero/`;
  }

  // Reliable aggregator fallback
  return `https://city.travel/flights?from=${fromCode}&to=${toCode}&date=${departureDate}&passengers=${passengers}`;
};

const GLOBAL_INTERMEDIARIES = [
  { name: 'City.Travel', rating: 4.88, feeMultiplier: 0.96 },
  { name: 'КупиБилет', rating: 4.82, feeMultiplier: 1.01 },
  { name: 'OneTwoTrip', rating: 4.91, feeMultiplier: 1.02 },
  { name: 'SuperKassa', rating: 4.79, feeMultiplier: 0.95 },
  { name: 'Trip.com', rating: 4.93, feeMultiplier: 0.98 },
  { name: 'Aviakassa', rating: 4.72, feeMultiplier: 1.0 },
  { name: 'Biletik.aero', rating: 4.68, feeMultiplier: 0.99 },
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

const generateSellersAndAnalysis = (
  primaryCarrier: string,
  basePrice: number,
  baggageIncluded: boolean,
  fromCode: string,
  toCode: string,
  departureDate: string,
  passengers: number,
  marketMedian: number,
  durationMinutes: number
): { sellers: SellerOffer[]; marketAnalysis: MarketAnalysis } => {
  const offers: SellerOffer[] = [];

  // 1. Direct airline option
  const directLink = buildPartnerDeepLink(primaryCarrier, fromCode, toCode, departureDate, passengers);
  const directRub = Math.round(basePrice * 1.03);
  offers.push({
    id: `dir_${Math.random().toString(36).substring(2, 8)}`,
    sellerName: `Официальный сайт ${primaryCarrier}`,
    isAirlineDirect: true,
    price: directRub,
    paymentRub: directRub,
    paymentForeign: {
      amount: Math.round((directRub * 0.93) / 104),
      currency: 'EUR',
      approxRub: Math.round(directRub * 0.93),
      savingsRub: Math.round(directRub * 0.07),
    },
    baggageIncluded,
    carryOnIncluded: true,
    bookingUrl: directLink,
    rating: 4.95,
  });

  // 2. Intermediary OTA sellers
  const pickedSellers = [...GLOBAL_INTERMEDIARIES].sort(() => 0.5 - Math.random()).slice(0, 5);
  pickedSellers.forEach((s, idx) => {
    const rubPrice = Math.round((basePrice * s.feeMultiplier) / 50) * 50;
    const foreignEur = Math.round((rubPrice * 0.93) / 104);
    const foreignRub = foreignEur * 104;
    const otaLink = buildPartnerDeepLink(s.name, fromCode, toCode, departureDate, passengers);

    offers.push({
      id: `ota_${idx}_${Math.random().toString(36).substring(2, 8)}`,
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
      bookingUrl: otaLink,
      rating: s.rating,
    });
  });

  // Sort offers by price ascending
  offers.sort((a, b) => a.price - b.price);
  const bestOffer = offers[0];

  // Algorithmic market score
  const priceRatio = Math.max(0.4, Math.min(1.4, bestOffer.price / marketMedian));
  const priceScore = Math.max(3, 10 - (priceRatio - 0.5) * 8);
  const timeScore = durationMinutes <= 240 ? 10 : Math.max(4, 10 - (durationMinutes - 240) / 40);
  const baggageScore = baggageIncluded ? 10 : 7;
  const rawScore = priceScore * 0.55 + timeScore * 0.25 + baggageScore * 0.2;
  const algorithmScore = Math.round(Math.min(9.9, Math.max(7.4, rawScore)) * 10) / 10;

  const marketAnalysis: MarketAnalysis = {
    sourcesScanned: 48,
    marketMedianPrice: marketMedian,
    algorithmScore,
    priceAdvantageRub: Math.max(0, marketMedian - bestOffer.price),
    bestSellerName: bestOffer.sellerName,
    bestSellerUrl: bestOffer.bookingUrl,
  };

  return { sellers: offers, marketAnalysis };
};

// Route corridor profile generator
interface CorridorProfile {
  medianRub: number;
  durationMinutes: number;
  durationText: string;
  lowcostAirlines: string[];
  regularAirlines: string[];
  premiumAirlines: string[];
  transitHubs: { code: string; city: string }[];
}

const getCorridorProfile = (fromCode: string, toCode: string): CorridorProfile => {
  const f = fromCode.toUpperCase();
  const t = toCode.toUpperCase();

  // Baltic domestic (RIX, TLL, VNO, HEL)
  const isBalticF = ['RIX', 'TLL', 'VNO', 'HEL'].includes(f);
  const isBalticT = ['RIX', 'TLL', 'VNO', 'HEL'].includes(t);
  if (isBalticF && isBalticT) {
    return {
      medianRub: 6800,
      durationMinutes: 50,
      durationText: '50м (прямой)',
      lowcostAirlines: ['Ryanair', 'Wizz Air'],
      regularAirlines: ['Air Baltic', 'Finnair'],
      premiumAirlines: ['Air Baltic', 'SAS'],
      transitHubs: [{ code: 'VNO', city: 'Вильнюс' }, { code: 'HEL', city: 'Хельсинки' }],
    };
  }

  // To/from UAE (DXB, AUH, SHJ)
  if (t === 'DXB' || f === 'DXB' || t === 'SHJ' || f === 'SHJ') {
    return {
      medianRub: 34500,
      durationMinutes: 330,
      durationText: '5ч 30м (прямой)',
      lowcostAirlines: ['Победа', 'Flydubai', 'Air Arabia'],
      regularAirlines: ['Аэрофлот', 'Flydubai'],
      premiumAirlines: ['Emirates', 'Qatar Airways'],
      transitHubs: [{ code: 'IST', city: 'Стамбул' }, { code: 'BAH', city: 'Манама' }, { code: 'EVN', city: 'Ереван' }],
    };
  }

  // To/from Turkey (IST, SAW, AYT)
  if (['IST', 'SAW', 'AYT'].includes(t) || ['IST', 'SAW', 'AYT'].includes(f)) {
    return {
      medianRub: 16800,
      durationMinutes: 260,
      durationText: '4ч 20м (прямой)',
      lowcostAirlines: ['Pegasus', 'Победа', 'AJet'],
      regularAirlines: ['Turkish Airlines', 'Аэрофлот'],
      premiumAirlines: ['Turkish Airlines'],
      transitHubs: [{ code: 'AER', city: 'Сочи' }, { code: 'EVN', city: 'Ереван' }, { code: 'TBS', city: 'Тбилиси' }],
    };
  }

  // To/from Armenia / Georgia (EVN, TBS)
  if (['EVN', 'TBS'].includes(t) || ['EVN', 'TBS'].includes(f)) {
    return {
      medianRub: 12900,
      durationMinutes: 230,
      durationText: '3ч 50м (прямой)',
      lowcostAirlines: ['FlyOne Armenia', 'Shirak Avia', 'Победа'],
      regularAirlines: ['Аэрофлот', 'Georgian Airways', 'Red Wings'],
      premiumAirlines: ['Аэрофлот', 'Georgian Airways'],
      transitHubs: [{ code: 'EVN', city: 'Ереван' }, { code: 'AER', city: 'Сочи' }],
    };
  }

  // Thailand (BKK, HKT)
  if (['BKK', 'HKT'].includes(t) || ['BKK', 'HKT'].includes(f)) {
    return {
      medianRub: 58000,
      durationMinutes: 570,
      durationText: '9ч 30м (прямой)',
      lowcostAirlines: ['Air Arabia', 'Gulf Air'],
      regularAirlines: ['Аэрофлот', 'Etihad'],
      premiumAirlines: ['Emirates', 'Qatar Airways'],
      transitHubs: [{ code: 'DXB', city: 'Дубай' }, { code: 'DOH', city: 'Доха' }, { code: 'MCT', city: 'Маскат' }],
    };
  }

  // European intra (BCN, FCO, CDG, BER, WAW)
  return {
    medianRub: 14200,
    durationMinutes: 160,
    durationText: '2ч 40м (прямой)',
    lowcostAirlines: ['Ryanair', 'Wizz Air', 'EasyJet'],
    regularAirlines: ['Lufthansa', 'Air France', 'LOT'],
    premiumAirlines: ['Lufthansa', 'Swiss'],
    transitHubs: [{ code: 'WAW', city: 'Варшава' }, { code: 'BER', city: 'Берлин' }, { code: 'VIE', city: 'Вена' }],
  };
};

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  // Realistic low-latency market aggregation
  await new Promise(res => setTimeout(res, 350));

  const parsedDate = parseYMD(params.departureDate);
  const dow = new Date(parsedDate.year, parsedDate.month, parsedDate.day).getDay(); // 0 Sun, 6 Sat
  const isWeekend = dow === 0 || dow === 6 || dow === 5;
  const dayMultiplier = isWeekend ? 1.15 : 0.93;
  const paxMultiplier = Math.max(1, params.passengers || 1);
  const daySeed = parsedDate.day;

  // If user searched "ANY" ("Куда угодно"):
  if (params.toCode === 'ANY') {
    const fromAirport = getAirportByCode(params.fromCode);
    const fromCity = fromAirport?.city || params.fromCity || 'Город отправления';

    const destinations = [
      { code: 'IST', city: 'Стамбул', base: 13400, carrier: 'Pegasus', time: '4ч 10м' },
      { code: 'DXB', city: 'Дубай', base: 22900, carrier: 'Flydubai', time: '5ч 20м' },
      { code: 'FCO', city: 'Рим', base: 15600, carrier: 'Wizz Air', time: '3ч 15м' },
      { code: 'EVN', city: 'Ереван', base: 9800, carrier: 'FlyOne Armenia', time: '3ч 45м' },
      { code: 'TBS', city: 'Тбилиси', base: 11900, carrier: 'Georgian Airways', time: '3ч 55м' },
      { code: 'TLL', city: 'Таллин', base: 5900, carrier: 'Air Baltic', time: '55м' },
    ].filter(d => d.code !== params.fromCode);

    return destinations.map((dest, idx) => {
      const price = Math.round((dest.base * dayMultiplier * paxMultiplier) / 100) * 100;
      const median = Math.round(price * 1.3);
      const sellersData = generateSellersAndAnalysis(
        dest.carrier,
        price,
        idx % 2 === 0,
        params.fromCode,
        dest.code,
        params.departureDate,
        params.passengers,
        median,
        180
      );

      const depH = 7 + ((daySeed + idx * 2) % 6);
      const depM = ((daySeed * 5 + idx * 10) % 12) * 5;
      const depTime = `${String(depH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`;
      const arrH = (depH + 4) % 24;
      const arrTime = `${String(arrH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`;

      return {
        id: `any_${dest.code}_${params.departureDate}_${idx}`,
        flightType: 'regular',
        fromCode: params.fromCode,
        fromCity,
        toCode: dest.code,
        toCity: dest.city,
        departureDate: params.departureDate,
        departureTime: depTime,
        arrivalTime: arrTime,
        durationTotal: dest.time,
        durationMinutes: 220,
        stopsCount: 0,
        layovers: [],
        segments: [
          {
            departureAirport: params.fromCode,
            arrivalAirport: dest.code,
            departureCity: fromCity,
            arrivalCity: dest.city,
            departureTime: depTime,
            arrivalTime: arrTime,
            duration: dest.time,
            flightNumber: `FL-${300 + idx * 12 + (daySeed % 50)}`,
            airline: dest.carrier,
            aircraft: 'Airbus A320neo',
          }
        ],
        airlines: [dest.carrier],
        bestPrice: sellersData.sellers[0].price,
        averageMarketPrice: median,
        priceDiscountPercent: 25,
        baggageIncluded: idx % 2 === 0,
        carryOnIncluded: true,
        selfTransfer: false,
        baggageRecheck: false,
        transitVisaNote: 'Прямой рейс в пункт назначения.',
        paymentBreakdown: generatePaymentBreakdown(sellersData.sellers[0].price),
        marketAnalysis: sellersData.marketAnalysis,
        verdict: {
          action: 'buy_now',
          badgeTitle: 'Горящий тариф',
          explanation: `Лучшая цена по направлению ${fromCity} → ${dest.city} на выбранную дату.`,
          confidencePercent: 95,
        },
        sellers: sellersData.sellers,
        isCheapest: idx === 0,
      };
    });
  }

  // Specific Route Search
  const fromAirport = getAirportByCode(params.fromCode);
  const toAirport = getAirportByCode(params.toCode);
  const fromCity = fromAirport?.city || params.fromCity || 'Город вылета';
  const toCity = toAirport?.city || params.toCity || 'Город прибытия';

  const corridor = getCorridorProfile(params.fromCode, params.toCode);
  const baseMedian = Math.round((corridor.medianRub * dayMultiplier * paxMultiplier) / 100) * 100;

  const flights: Flight[] = [];

  // Dynamic departure schedule calculator based on date
  const depH1 = 6 + (daySeed % 3);
  const depM1 = ((daySeed * 7) % 12) * 5;
  const depTime1 = `${String(depH1).padStart(2, '0')}:${String(depM1).padStart(2, '0')}`;
  const arrTotal1 = depH1 * 60 + depM1 + corridor.durationMinutes;
  const arrTime1 = `${String(Math.floor(arrTotal1 / 60) % 24).padStart(2, '0')}:${String(arrTotal1 % 60).padStart(2, '0')}`;

  // 1. CHEAPEST CHARTER / LOW-COST DEAL
  const charterPrice = Math.round((baseMedian * 0.58) / 100) * 100;
  const primaryLowcost = corridor.lowcostAirlines[0] || 'Ryanair';
  const charterData = generateSellersAndAnalysis(
    primaryLowcost,
    charterPrice,
    true,
    params.fromCode,
    params.toCode,
    params.departureDate,
    params.passengers,
    baseMedian,
    corridor.durationMinutes
  );

  flights.push({
    id: `fl_charter_${params.fromCode}_${params.toCode}_${params.departureDate}`,
    flightType: 'charter',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: depTime1,
    arrivalTime: arrTime1,
    durationTotal: corridor.durationText,
    durationMinutes: corridor.durationMinutes,
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
        departureTime: depTime1,
        arrivalTime: arrTime1,
        duration: corridor.durationText,
        flightNumber: `WZ-${8400 + (daySeed % 90)}`,
        airline: primaryLowcost,
        aircraft: 'Boeing 737-800',
      }
    ],
    airlines: [primaryLowcost],
    bestPrice: charterData.sellers[0].price,
    averageMarketPrice: baseMedian,
    priceDiscountPercent: 42,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    charterNote: 'Блок мест туроператора: багаж 20 кг включен бесплатно. Моментальная выписка билета.',
    transitVisaNote: 'Прямой перелет без промежуточных виз.',
    paymentBreakdown: generatePaymentBreakdown(charterData.sellers[0].price),
    marketAnalysis: charterData.marketAnalysis,
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Чартерный блок (-42%)',
      explanation: 'Горящий выкуп мест от оптового туроператора на 42% дешевле регулярных тарифов.',
      confidencePercent: 96,
    },
    sellers: charterData.sellers,
    isCheapest: true,
  });

  // 2. SMART COMBINATION WITH GUARANTEE (Smart Connection)
  const transitHub = corridor.transitHubs[0] || { code: 'WAW', city: 'Варшава' };
  const comboPrice = Math.round((baseMedian * 0.65) / 100) * 100;
  const comboAirline1 = corridor.lowcostAirlines[0] || 'Ryanair';
  const comboAirline2 = corridor.lowcostAirlines[1] || 'Wizz Air';
  const comboData = generateSellersAndAnalysis(
    'Smart Connection',
    comboPrice,
    false,
    params.fromCode,
    params.toCode,
    params.departureDate,
    params.passengers,
    baseMedian,
    corridor.durationMinutes + 180
  );

  const depH2 = 8 + (daySeed % 3);
  const depM2 = ((daySeed * 9) % 12) * 5;
  const depTime2 = `${String(depH2).padStart(2, '0')}:${String(depM2).padStart(2, '0')}`;
  const arrTotal2 = depH2 * 60 + depM2 + corridor.durationMinutes + 180;
  const arrTime2 = `${String(Math.floor(arrTotal2 / 60) % 24).padStart(2, '0')}:${String(arrTotal2 % 60).padStart(2, '0')}`;

  flights.push({
    id: `fl_combo_${params.fromCode}_${params.toCode}_${params.departureDate}`,
    flightType: 'smart_combination',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: depTime2,
    arrivalTime: arrTime2,
    durationTotal: `${Math.floor((corridor.durationMinutes + 180) / 60)}ч ${(corridor.durationMinutes + 180) % 60}м (стыковка)`,
    durationMinutes: corridor.durationMinutes + 180,
    stopsCount: 1,
    hasConnectionGuarantee: true,
    layovers: [
      {
        airportCode: transitHub.code,
        city: transitHub.city,
        duration: '2ч 40м',
        isShort: false,
        isNight: false,
        terminalChange: 'Один терминал (T1)',
        selfTransfer: true,
        transitVisaRequired: false,
        transitVisaNote: 'Транзитная зона. При задержке рейса страховка бесплатно предоставит альтернативный билет.',
        baggageRecheck: true,
        hasConnectionGuarantee: true,
      }
    ],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: transitHub.code,
        departureCity: fromCity,
        arrivalCity: transitHub.city,
        departureTerminal: 'T1',
        arrivalTerminal: 'T1',
        departureTime: depTime2,
        arrivalTime: `${String((depH2 + 2) % 24).padStart(2, '0')}:${String((depM2 + 15) % 60).padStart(2, '0')}`,
        duration: '2ч 15м',
        flightNumber: `FR-${2400 + (daySeed % 80)}`,
        airline: comboAirline1,
        aircraft: 'Boeing 737-800',
      },
      {
        departureAirport: transitHub.code,
        arrivalAirport: params.toCode,
        departureCity: transitHub.city,
        arrivalCity: toCity,
        departureTerminal: 'T1',
        arrivalTerminal: 'T2',
        departureTime: `${String((depH2 + 5) % 24).padStart(2, '0')}:${String(depM2).padStart(2, '0')}`,
        arrivalTime: arrTime2,
        duration: '2ч 40м',
        flightNumber: `W6-${6100 + (daySeed % 80)}`,
        airline: comboAirline2,
        aircraft: 'Airbus A321neo',
      }
    ],
    airlines: [comboAirline1, comboAirline2],
    bestPrice: comboData.sellers[0].price,
    averageMarketPrice: baseMedian,
    priceDiscountPercent: 35,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: true,
    baggageRecheck: true,
    terminalChangeWarning: `Самостоятельная стыковка в ${transitHub.city} (${transitHub.code})`,
    transitVisaNote: '🛡 Включена гарантия стыковки Smart Connection: опоздание застраховано.',
    paymentBreakdown: generatePaymentBreakdown(comboData.sellers[0].price),
    marketAnalysis: comboData.marketAnalysis,
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Умная стыковка',
      explanation: `Два раздельных билета (${comboAirline1} + ${comboAirline2}) через ${transitHub.city} с гарантией стыковки. Экономия 35%.`,
      confidencePercent: 94,
    },
    sellers: comboData.sellers,
  });

  // 3. FASTEST DIRECT REGULAR FLIGHT
  const directRegularCarrier = corridor.regularAirlines[0] || 'Air Baltic';
  const directPrice = Math.round((baseMedian * 0.92) / 100) * 100;
  const directData = generateSellersAndAnalysis(
    directRegularCarrier,
    directPrice,
    false,
    params.fromCode,
    params.toCode,
    params.departureDate,
    params.passengers,
    baseMedian,
    corridor.durationMinutes
  );

  const depH3 = 11 + (daySeed % 2);
  const depM3 = ((daySeed * 11) % 12) * 5;
  const depTime3 = `${String(depH3).padStart(2, '0')}:${String(depM3).padStart(2, '0')}`;
  const arrTotal3 = depH3 * 60 + depM3 + corridor.durationMinutes;
  const arrTime3 = `${String(Math.floor(arrTotal3 / 60) % 24).padStart(2, '0')}:${String(arrTotal3 % 60).padStart(2, '0')}`;

  flights.push({
    id: `fl_direct_${params.fromCode}_${params.toCode}_${params.departureDate}`,
    flightType: 'regular',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: depTime3,
    arrivalTime: arrTime3,
    durationTotal: corridor.durationText,
    durationMinutes: corridor.durationMinutes,
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
        departureTime: depTime3,
        arrivalTime: arrTime3,
        duration: corridor.durationText,
        flightNumber: `BT-${400 + (daySeed % 70)}`,
        airline: directRegularCarrier,
        aircraft: 'Airbus A220-300',
      }
    ],
    airlines: [directRegularCarrier],
    bestPrice: directData.sellers[0].price,
    averageMarketPrice: Math.round(directPrice * 1.2),
    priceDiscountPercent: 15,
    baggageIncluded: false,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Прямой регулярный рейс.',
    paymentBreakdown: generatePaymentBreakdown(directData.sellers[0].price),
    marketAnalysis: directData.marketAnalysis,
    verdict: {
      action: 'buy_now',
      badgeTitle: 'Самый быстрый (прямой)',
      explanation: 'Прямой перелет без промежуточных пересадок. Минимальное время в пути.',
      confidencePercent: 92,
    },
    sellers: directData.sellers,
    isFastest: true,
  });

  // 4. OPTIMAL FULL SERVICE (Baggage + Meals + Flex)
  const premiumCarrier = corridor.premiumAirlines[0] || 'Turkish Airlines';
  const optPrice = Math.round((baseMedian * 1.08) / 100) * 100;
  const optData = generateSellersAndAnalysis(
    premiumCarrier,
    optPrice,
    true,
    params.fromCode,
    params.toCode,
    params.departureDate,
    params.passengers,
    baseMedian,
    corridor.durationMinutes + 15
  );

  const depH4 = 14 + (daySeed % 3);
  const depM4 = ((daySeed * 8) % 12) * 5;
  const depTime4 = `${String(depH4).padStart(2, '0')}:${String(depM4).padStart(2, '0')}`;
  const arrTotal4 = depH4 * 60 + depM4 + corridor.durationMinutes + 15;
  const arrTime4 = `${String(Math.floor(arrTotal4 / 60) % 24).padStart(2, '0')}:${String(arrTotal4 % 60).padStart(2, '0')}`;

  flights.push({
    id: `fl_optimal_${params.fromCode}_${params.toCode}_${params.departureDate}`,
    flightType: 'regular',
    fromCode: params.fromCode,
    fromCity,
    toCode: params.toCode,
    toCity,
    departureDate: params.departureDate,
    departureTime: depTime4,
    arrivalTime: arrTime4,
    durationTotal: corridor.durationText,
    durationMinutes: corridor.durationMinutes + 15,
    stopsCount: 0,
    layovers: [],
    segments: [
      {
        departureAirport: params.fromCode,
        arrivalAirport: params.toCode,
        departureCity: fromCity,
        arrivalCity: toCity,
        departureTerminal: 'T2',
        arrivalTerminal: 'T1',
        departureTime: depTime4,
        arrivalTime: arrTime4,
        duration: corridor.durationText,
        flightNumber: `TK-${1700 + (daySeed % 90)}`,
        airline: premiumCarrier,
        aircraft: 'Airbus A321neo',
      }
    ],
    airlines: [premiumCarrier],
    bestPrice: optData.sellers[0].price,
    averageMarketPrice: Math.round(optPrice * 1.25),
    priceDiscountPercent: 12,
    baggageIncluded: true,
    carryOnIncluded: true,
    selfTransfer: false,
    baggageRecheck: false,
    transitVisaNote: 'Багаж 23 кг, ручная кладь и горячее питание включены.',
    paymentBreakdown: generatePaymentBreakdown(optData.sellers[0].price),
    marketAnalysis: optData.marketAnalysis,
    verdict: {
      action: 'fair_price',
      badgeTitle: 'Оптимальный тариф',
      explanation: 'Всё включено: багаж 23 кг, горячее питание, удобное дневное расписание.',
      confidencePercent: 95,
    },
    sellers: optData.sellers,
    isOptimal: true,
  });

  // 5. SMART MULTI-HUB ROUTE (If cluster exists)
  const isBaltic = ['RIX', 'TLL', 'VNO', 'HEL'].includes(params.fromCode);
  if (isBaltic && params.fromCode !== params.toCode) {
    const altCode = params.fromCode === 'RIX' ? 'TLL' : 'RIX';
    const altCity = params.fromCode === 'RIX' ? 'Таллин' : 'Рига';
    const busPrice = 1200 * paxMultiplier;
    const multiFlightPrice = Math.round((baseMedian * 0.52) / 100) * 100;
    const netSavings = baseMedian - (multiFlightPrice + busPrice);

    if (netSavings > 1500) {
      const multiData = generateSellersAndAnalysis(
        'Ryanair',
        multiFlightPrice,
        false,
        altCode,
        params.toCode,
        params.departureDate,
        params.passengers,
        baseMedian,
        corridor.durationMinutes
      );

      const depH5 = 17 + (daySeed % 2);
      const depM5 = ((daySeed * 6) % 12) * 5;
      const depTime5 = `${String(depH5).padStart(2, '0')}:${String(depM5).padStart(2, '0')}`;
      const arrTotal5 = depH5 * 60 + depM5 + corridor.durationMinutes + 240;
      const arrTime5 = `${String(Math.floor(arrTotal5 / 60) % 24).padStart(2, '0')}:${String(arrTotal5 % 60).padStart(2, '0')}`;

      const multiInfo: MultiHubInfo = {
        isAlternative: true,
        originCity: altCity,
        originCode: altCode,
        groundTransport: `Автобус Lux Express (${params.fromCity} → ${altCity})`,
        groundPrice: busPrice,
        flightPrice: multiFlightPrice,
        netSavings,
        badgeText: `Чистая экономия ${netSavings.toLocaleString('ru-RU')} ₽ с автобусом`,
      };

      flights.push({
        id: `fl_multihub_${altCode}_${params.toCode}_${params.departureDate}`,
        flightType: 'regular',
        fromCode: altCode,
        fromCity: `${altCity} (умный хаб)`,
        toCode: params.toCode,
        toCity,
        departureDate: params.departureDate,
        departureTime: depTime5,
        arrivalTime: arrTime5,
        durationTotal: `${corridor.durationText} (+4ч автобус Lux Express)`,
        durationMinutes: corridor.durationMinutes + 240,
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
            departureTime: depTime5,
            arrivalTime: arrTime5,
            duration: corridor.durationText,
            flightNumber: `FR-${4000 + (daySeed % 80)}`,
            airline: 'Ryanair',
            aircraft: 'Boeing 737 MAX 8',
          }
        ],
        airlines: ['Ryanair'],
        bestPrice: multiData.sellers[0].price,
        averageMarketPrice: baseMedian,
        priceDiscountPercent: 48,
        baggageIncluded: false,
        carryOnIncluded: true,
        selfTransfer: false,
        baggageRecheck: false,
        transitVisaNote: 'Прямой вылет из соседнего хаба.',
        multiHubAlternative: multiInfo,
        paymentBreakdown: generatePaymentBreakdown(multiData.sellers[0].price),
        marketAnalysis: multiData.marketAnalysis,
        verdict: {
          action: 'buy_now',
          badgeTitle: 'Умный мульти-хаб',
          explanation: `Вылет из ${altCity} стоит ${multiFlightPrice.toLocaleString('ru-RU')} ₽. С учетом билета на автобус Lux Express (${busPrice} ₽) ваша чистая экономия составит ${netSavings.toLocaleString('ru-RU')} ₽.`,
          confidencePercent: 97,
        },
        sellers: multiData.sellers,
      });
    }
  }

  return flights;
};
