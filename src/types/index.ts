export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  popular?: boolean;
  cluster?: string; // e.g. "Балтия (RIX, TLL, VNO)", "Москва (SVO, VKO, DME)"
  nearbyCodes?: string[];
}

export interface FlightSegment {
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string; // e.g. "10:30"
  arrivalTime: string;   // e.g. "14:15"
  duration: string;      // e.g. "3ч 45м"
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  aircraft?: string;
}

export interface LayoverInfo {
  airportCode: string;
  city: string;
  duration: string;
  isShort?: boolean;   // < 60 min warning
  isNight?: boolean;   // night layover warning
}

export interface SellerOffer {
  id: string;
  sellerName: string;
  isAirlineDirect: boolean;
  price: number;
  baggageIncluded: boolean;
  carryOnIncluded: boolean;
  bookingUrl: string;
  rating: number; // e.g. 4.9
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
  priceDiscountPercent: number; // e.g. 18 means 18% cheaper than market avg
  priceTrend: 'dropping' | 'stable' | 'rising';
  priceConfidenceText: string;  // e.g. "Цена на 18% ниже средней, бронируйте сейчас"
  baggageIncluded: boolean;
  carryOnIncluded: boolean;
  sellers: SellerOffer[];
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
  maxStops: number | null; // null = all, 0 = direct, 1 = max 1 stop
  maxPrice: number;
  selectedAirlines: string[];
  timeOfDay: 'all' | 'morning' | 'day' | 'evening';
}

export interface DatePriceHeatmap {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // 'Пн', 'Вт', etc.
  dayOfMonth: number;
  price: number;
  isLowest?: boolean;
  isHighest?: boolean;
  isPast?: boolean;
}
