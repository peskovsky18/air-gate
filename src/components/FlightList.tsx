import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Bell, Check, TrendingDown, ArrowUpDown } from 'lucide-react';
import { Flight, FilterState } from '../types';
import { FlightCard } from './FlightCard';
import { haptic } from '../lib/telegram';

interface FlightListProps {
  flights: Flight[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenFilter: () => void;
  onOpenSubscriptionModal: (flight?: Flight) => void;
  filters: FilterState;
}

export const FlightList: React.FC<FlightListProps> = ({
  flights,
  favorites,
  onToggleFavorite,
  onOpenFilter,
  onOpenSubscriptionModal,
  filters,
}) => {
  const [sortTab, setSortTab] = useState<'cheapest' | 'fastest' | 'optimal'>('cheapest');

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    let result = [...flights];

    if (filters.baggageOnly) {
      result = result.filter(f => f.baggageIncluded);
    }
    if (filters.directOnly) {
      result = result.filter(f => f.stopsCount === 0);
    }
    if (filters.maxStops !== null) {
      result = result.filter(f => f.stopsCount <= filters.maxStops!);
    }
    if (filters.timeOfDay !== 'all') {
      result = result.filter(f => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        if (filters.timeOfDay === 'morning') return hour >= 6 && hour < 12;
        if (filters.timeOfDay === 'day') return hour >= 12 && hour < 18;
        if (filters.timeOfDay === 'evening') return hour >= 18 || hour < 6;
        return true;
      });
    }

    // Sort
    if (sortTab === 'cheapest') {
      result.sort((a, b) => a.bestPrice - b.bestPrice);
    } else if (sortTab === 'fastest') {
      result.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortTab === 'optimal') {
      result.sort((a, b) => {
        if (a.isOptimal) return -1;
        if (b.isOptimal) return 1;
        return a.bestPrice - b.bestPrice;
      });
    }

    return result;
  }, [flights, sortTab, filters]);

  const activeFiltersCount = (filters.baggageOnly ? 1 : 0) +
    (filters.directOnly ? 1 : 0) +
    (filters.timeOfDay !== 'all' ? 1 : 0);

  const bestFlight = flights[0];

  return (
    <div className="relative pb-24">
      {/* Sorting Tabs & Filters Bar */}
      <div className="px-4 py-2 flex items-center justify-between gap-2">
        {/* Segmented Control */}
        <div className="flex-1 p-1 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/80 flex items-center relative border border-black/[0.04] dark:border-white/[0.06]">
          {[
            { id: 'cheapest', label: 'Дешевый' },
            { id: 'fastest', label: 'Быстрый' },
            { id: 'optimal', label: 'Оптимальный' },
          ].map((tab) => {
            const isActive = sortTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  haptic.selection();
                  setSortTab(tab.id as any);
                }}
                className={`relative flex-1 py-1.5 text-xs font-semibold rounded-xl text-center transition-colors pressable z-10 ${
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-xl shadow-sm -z-10"
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenFilter();
          }}
          className="relative p-2.5 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-black/[0.04] dark:border-white/[0.06] pressable"
          title="Фильтры"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Flight Cards List */}
      {filteredFlights.length === 0 ? (
        <div className="mx-4 my-8 p-8 rounded-3xl glass-card text-center">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            По выбранным фильтрам рейсов не найдено
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Попробуйте сбросить фильтр багажа или пересадок
          </p>
        </div>
      ) : (
        <div className="mt-1">
          <AnimatePresence>
            {filteredFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                isFavorite={favorites.includes(flight.id)}
                onToggleFavorite={onToggleFavorite}
                onTrackFlight={() => onOpenSubscriptionModal(flight)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Price Radar Button */}
      {bestFlight && (
        <div className="fixed bottom-20 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
          <motion.button
            whileTap={{ scale: 0.96 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => {
              haptic.medium();
              onOpenSubscriptionModal(bestFlight);
            }}
            className="pointer-events-auto py-2.5 px-5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-float flex items-center gap-2 border border-blue-400/40 backdrop-blur-md pressable"
          >
            <Bell className="w-4 h-4" />
            <span>Следить за ценой (от {bestFlight.bestPrice.toLocaleString('ru-RU')} ₽)</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
