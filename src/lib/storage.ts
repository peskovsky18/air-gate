import { Subscription, Flight } from '../types';

const STORAGE_KEYS = {
  SUBSCRIPTIONS: 'air_gate_subscriptions',
  FAVORITES: 'air_gate_favorites',
  SEARCH_HISTORY: 'air_gate_history',
};

// Initial realistic default subscriptions so the user sees a rich screen right away
const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_riga_tll',
    fromCity: 'Рига',
    fromCode: 'RIX',
    toCity: 'Таллин',
    toCode: 'TLL',
    departureDate: '2026-11-15',
    flexibleDates: true,
    targetPrice: 4200,
    currentBestPrice: 3890,
    initialPrice: 5400,
    createdAt: '2026-10-20',
    lastCheckedAt: '5 мин назад',
    active: true,
    notificationsCount: 2,
  },
  {
    id: 'sub_mow_ist',
    fromCity: 'Москва',
    fromCode: 'MOW',
    toCity: 'Стамбул',
    toCode: 'IST',
    departureDate: '2026-12-01',
    flexibleDates: false,
    targetPrice: 12000,
    currentBestPrice: 11450,
    initialPrice: 14200,
    createdAt: '2026-10-24',
    lastCheckedAt: '12 мин назад',
    active: true,
    notificationsCount: 3,
  }
];

export const storage = {
  getSubscriptions: (): Subscription[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
        return DEFAULT_SUBSCRIPTIONS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SUBSCRIPTIONS;
    }
  },

  saveSubscription: (subData: Partial<Subscription>): Subscription => {
    const subs = storage.getSubscriptions();
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      fromCity: subData.fromCity || 'Москва',
      fromCode: subData.fromCode || 'MOW',
      toCity: subData.toCity || 'Стамбул',
      toCode: subData.toCode || 'IST',
      departureDate: subData.departureDate || new Date().toISOString().split('T')[0],
      returnDate: subData.returnDate,
      flexibleDates: subData.flexibleDates ?? true,
      targetPrice: subData.targetPrice || 10000,
      currentBestPrice: subData.currentBestPrice || subData.targetPrice || 10000,
      initialPrice: subData.initialPrice || subData.targetPrice || 10000,
      createdAt: new Date().toISOString().split('T')[0],
      lastCheckedAt: 'Только что',
      active: true,
      notificationsCount: 0,
    };

    const updated = [newSub, ...subs];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
    return newSub;
  },

  deleteSubscription: (id: string): void => {
    const subs = storage.getSubscriptions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  },

  toggleSubscription: (id: string): boolean => {
    const subs = storage.getSubscriptions();
    const sub = subs.find(s => s.id === id);
    if (!sub) return false;
    sub.active = !sub.active;
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return sub.active;
  },

  getFavorites: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite: (flightId: string): boolean => {
    const favs = storage.getFavorites();
    const exists = favs.includes(flightId);
    let updated: string[];
    if (exists) {
      updated = favs.filter(id => id !== flightId);
    } else {
      updated = [...favs, flightId];
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return !exists;
  },

  // Simulates market price change and trigger bot alert
  simulatePriceDrop: (subId: string) => {
    const subs = storage.getSubscriptions();
    const sub = subs.find(s => s.id === subId);
    if (!sub) return null;

    const discount = Math.round((sub.currentBestPrice * (0.08 + Math.random() * 0.12)) / 100) * 100;
    const oldPrice = sub.currentBestPrice;
    sub.currentBestPrice = Math.max(2000, oldPrice - discount);
    sub.notificationsCount += 1;
    sub.lastCheckedAt = 'Только что';

    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return {
      sub,
      oldPrice,
      newPrice: sub.currentBestPrice,
      savings: discount
    };
  }
};
