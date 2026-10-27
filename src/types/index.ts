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
  terminalChange?: string;
  selfTransfer?: boolean;
  transitVisaRequired?: boolean;
  transitVisaNote?: string;
  baggageRecheck?: boolean;
  hasConnectionGuarantee?: boolean;
}

export interface MultiHubInfo {
  isAlternative: boolean;
  originCity: string;
  originCode: string;
  groundTransport: string;
  groundPrice: number;
  flightPrice: number;
  netSavings: number;
  badgeText: string;
}

export interface PriceVerdict {
  action: 'buy_now' | 'wait' | 'fair_price';
  badgeTitle: string;
  explanation: string;
  confidencePercent: number;
  expectedChange?: string;
}

export interface PaymentBreakdown {
  rubPrice: number;
  foreignPriceUsd?: number;
  foreignPriceEur?: number;
  foreignCurrencySavingsRub?: number;
}

export interface SellerOffer {
  id: string;
  sellerName: string;
  isAirlineDirect: boolean;
  price: number;
  paymentRub: number;
  paymentForeign?: { amount: number; currency: 'EUR' | 'USD'; approxRub: number; savingsRub: number };
  baggageIncluded: boolean;
  carryOnIncluded: boolean;
  bookingUrl: string;
  rating: number;
}

export interface MarketAnalysis {
  sourcesScanned: number;          // e.g. 48 источников
  marketMedianPrice: number;       // медиана цен
  algorithmScore: number;          // 0 - 10
  priceAdvantageRub: number;       // выгода по отношению к медиане рынка
  bestSellerName: string;          // имя лучшего стороннего продавца
  bestSellerUrl: string;           // прямая ссылка на покупку у продавца
}

export interface Flight {
  id: string;
  flightType: 'regular' | 'charter' | 'smart_combination';
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

  // Algorithm Market Analysis
  marketAnalysis: MarketAnalysis;

  // Payment breakdown
  paymentBreakdown: PaymentBreakdown;

  // Features
  verdict: PriceVerdict;
  multiHubAlternative?: MultiHubInfo;
  selfTransfer: boolean;
  baggageRecheck: boolean;
  hasConnectionGuarantee?: boolean;
  charterNote?: string;
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
