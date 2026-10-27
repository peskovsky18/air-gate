import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sparkles, Heart, Plane } from 'lucide-react';
import { SearchParams, Flight, Subscription, FilterState, Airport } from './types';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { FlightList } from './components/FlightList';
import { AirportSelectModal } from './components/AirportSelectModal';
import { DateCalendarModal } from './components/DateCalendarModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SubscriptionManager } from './components/SubscriptionManager';
import { FilterModal } from './components/FilterModal';
import { AnywhereExplore } from './components/AnywhereExplore';
import { searchFlights } from './services/flightAggregator';
import { storage } from './lib/storage';
import { initTelegramApp, getTelegramWebApp, haptic } from './lib/telegram';

export const App: React.FC = () => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'search' | 'subscriptions' | 'explore' | 'favorites'>('search');

  // Search Parameters
  const [searchParams, setSearchParams] = useState<SearchParams>({
    fromCode: 'RIX',
    fromCity: 'Рига',
    toCode: 'TLL',
    toCity: 'Таллин',
    departureDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    isRoundTrip: false,
    passengers: 1,
    cabinClass: 'economy',
    flexibleDates: true,
    includeNearbyAirports: true,
  });

  // Search Results
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Persistent user data
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals state
  const [isAirportModalOpen, setIsAirportModalOpen] = useState<boolean>(false);
  const [airportModalMode, setAirportModalMode] = useState<'from' | 'to'>('from');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    baggageOnly: false,
    directOnly: false,
    maxStops: null,
    maxPrice: 100000,
    selectedAirlines: [],
    timeOfDay: 'all',
  });

  // Initialize Telegram WebApp SDK and load data
  useEffect(() => {
    initTelegramApp();
    setSubscriptions(storage.getSubscriptions());
    setFavorites(storage.getFavorites());

    // Perform initial search
    handleSearch();
  }, []);

  // Sync Telegram Native BackButton
  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg?.BackButton) return;

    if (activeTab !== 'search') {
      tg.BackButton.show();
      const onBack = () => {
        haptic.light();
        setActiveTab('search');
      };
      tg.BackButton.onClick(onBack);
      return () => {
        tg.BackButton.offClick(onBack);
      };
    } else {
      tg.BackButton.hide();
    }
  }, [activeTab]);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchFlights(searchParams);
      setFlights(results);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (flightId: string) => {
    storage.toggleFavorite(flightId);
    setFavorites(storage.getFavorites());
  };

  const handleRefreshSubscriptions = () => {
    setSubscriptions(storage.getSubscriptions());
  };

  const favoriteFlights = flights.filter(f => favorites.includes(f.id));

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#09090b] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        subscriptionsCount={subscriptions.filter(s => s.active).length}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {activeTab === 'search' && (
          <div>
            {/* Search Input Controls */}
            <SearchForm
              searchParams={searchParams}
              onChangeParams={setSearchParams}
              onSearch={handleSearch}
              onOpenAirportModal={(mode) => {
                setAirportModalMode(mode);
                setIsAirportModalOpen(true);
              }}
              onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
              isLoading={isLoading}
            />

            {/* Flights List / Market Results */}
            {hasSearched && (
              <FlightList
                flights={flights}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onOpenFilter={() => setIsFilterModalOpen(true)}
                onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
                filters={filters}
              />
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionManager
            subscriptions={subscriptions}
            onRefresh={handleRefreshSubscriptions}
            onOpenCreateModal={() => setIsSubscriptionModalOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <AnywhereExplore
            fromCity={searchParams.fromCity}
            onSelectDestination={(dest) => {
              setSearchParams({
                ...searchParams,
                toCity: dest.city,
                toCode: dest.code,
              });
              setActiveTab('search');
              // Automatically search
              setTimeout(() => {
                handleSearch();
              }, 100);
            }}
          />
        )}

        {activeTab === 'favorites' && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Избранные рейсы
            </h2>
            {favoriteFlights.length === 0 ? (
              <div className="py-12 px-4 rounded-3xl glass-card text-center border border-dashed border-zinc-200 dark:border-zinc-800">
                <Heart className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  У вас пока нет сохраненных рейсов
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Нажмите на сердечко в карточке билета, чтобы сохранить его сюда
                </p>
              </div>
            ) : (
              <FlightList
                flights={favoriteFlights}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onOpenFilter={() => setIsFilterModalOpen(true)}
                onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
                filters={filters}
              />
            )}
          </div>
        )}
      </main>

      {/* Fluid Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-black/[0.06] dark:border-white/[0.08] px-4 py-2 flex items-center justify-around">
        {[
          { id: 'search', label: 'Поиск', icon: Search },
          { id: 'subscriptions', label: 'Радар цен', icon: Bell, badge: subscriptions.filter(s => s.active).length },
          { id: 'explore', label: 'Куда угодно', icon: Sparkles },
          { id: 'favorites', label: 'Избранное', icon: Heart, badge: favorites.length },
        ].map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                haptic.selection();
                setActiveTab(item.id as any);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all pressable ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Interactive Bottom Sheet Modals */}
      <AirportSelectModal
        isOpen={isAirportModalOpen}
        onClose={() => setIsAirportModalOpen(false)}
        mode={airportModalMode}
        currentCode={airportModalMode === 'from' ? searchParams.fromCode : searchParams.toCode}
        onSelect={(airport) => {
          if (airportModalMode === 'from') {
            setSearchParams({
              ...searchParams,
              fromCode: airport.code,
              fromCity: airport.city,
            });
          } else {
            setSearchParams({
              ...searchParams,
              toCode: airport.code,
              toCity: airport.city,
            });
          }
        }}
      />

      <DateCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        selectedDate={searchParams.departureDate}
        onSelectDate={(date) => {
          setSearchParams({
            ...searchParams,
            departureDate: date,
          });
        }}
        basePrice={flights[0]?.bestPrice || 14500}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        fromCity={searchParams.fromCity}
        fromCode={searchParams.fromCode}
        toCity={searchParams.toCity}
        toCode={searchParams.toCode}
        departureDate={searchParams.departureDate}
        currentBestPrice={flights[0]?.bestPrice || 14500}
        onSubscriptionCreated={handleRefreshSubscriptions}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onChangeFilters={setFilters}
        onReset={() => {
          setFilters({
            baggageOnly: false,
            directOnly: false,
            maxStops: null,
            maxPrice: 100000,
            selectedAirlines: [],
            timeOfDay: 'all',
          });
        }}
      />
    </div>
  );
};

export default App;
