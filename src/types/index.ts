export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  popular?: boolean;
  cluster?: string;
  nearbyCodes?: string[];
}

export interface FlightSegment {
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  aircraft?: string;
}

export interface LayoverInfo {
  airportCode: string;
  city: string;
  duration: string;
  isShort?: boolean;
  isNight?: boolean;
  terminalChange?: string;         // e.g. "Смена терминала: 1 → 2"
  selfTransfer?: boolean;          // true if separate tickets
  transitVisaRequired?: boolean;   // true if transit visa needed
  transitVisaNote?: string;        // e.g. "Транзитная зона открыта 24ч, виза не нужна"
  baggageRecheck?: boolean;        // true if luggage must be picked up and checked again
}

export interface MultiHubInfo {
  isAlternative: boolean;
  originCity: string;
  originCode: string;
  groundTransport: string;         // e.g. "Автобус Lux Express из Риги (4ч 15м)"
  groundPrice: number;             // e.g. 1200
  flightPrice: number;             // e.g. 9800
  netSavings: number;              // e.g. 4200
  badgeText: string;               // "Экономия 4 200 ₽ с учетом автобуса"
}

export interface PriceVerdict {
  action: 'buy_now' | 'wait' | 'fair_price';
  badgeTitle: string;              // "Брать сейчас" | "Подождать" | "Справедливая цена"
  explanation: string;             // "Цена на историческом минимуме за последние 3 месяца"
  confidencePercent: number;       // e.g. 92
  expectedChange?: string;         // "+18% в течение 48 часов"
}

export interface SellerOffer {
  id: string;
  sellerName: string;
  isAirlineDirect: boolean;
  price: number;
  baggageIncluded: boolean;
  carryOnIncluded: boolean;
  bookingUrl: string;
  rating: number;
}

export interface Flight {
  id: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  durationTotal: string;
  durationMinutes: number;
  stopsCount: number;
  layovers: LayoverInfo[];
  segments: FlightSegment[];
  airlines: string[];
  bestPrice: number;
  averageMarketPrice: number;
  priceDiscountPercent: number;
  baggageIncluded: boolean;
  carryOnIncluded: boolean;
  sellers: SellerOffer[];

  // Differentiation & Transparency Features
  verdict: PriceVerdict;
  multiHubAlternative?: MultiHubInfo;
  selfTransfer: boolean;
  baggageRecheck: boolean;
  terminalChangeWarning?: string;
  transitVisaNote: string;
  isCheapest?: boolean;
  isFastest?: boolean;
  isOptimal?: boolean;
}

export interface SearchParams {
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departureDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
  passengers: number;
  cabinClass: 'economy' | 'business';
  flexibleDates: boolean;
  includeNearbyAirports: boolean;
}

export interface Subscription {
  id: string;
  userId?: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureDate: string;
  returnDate?: string;
  flexibleDates: boolean;
  targetPrice: number;
  currentBestPrice: number;
  initialPrice: number;
  createdAt: string;
  lastCheckedAt: string;
  active: boolean;
  notificationsCount: number;
}

export interface FilterState {
  baggageOnly: boolean;
  directOnly: boolean;
  maxStops: number | null;
  maxPrice: number;
  selectedAirlines: string[];
  timeOfDay: 'all' | 'morning' | 'day' | 'evening';
}

export interface DatePriceHeatmap {
  date: string;
  dayOfWeek: string;
  dayOfMonth: number;
  price: number;
  isLowest?: boolean;
  isHighest?: boolean;
  isPast?: boolean;
}
