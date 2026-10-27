import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
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

  return (
    <div className="relative pb-12">
      {/* Sorting Tabs & Filters Bar */}
      <div className="px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex-1 p-0.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center relative">
          {[
            { id: 'cheapest', label: 'Дешевые' },
            { id: 'fastest', label: 'Быстрые' },
            { id: 'optimal', label: 'Оптимальные' },
          ].map((tab) => {
            const isActive = sortTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  haptic.selection();
                  setSortTab(tab.id as any);
                }}
                className={`relative flex-1 py-1.5 text-[13px] font-medium rounded-lg text-center transition-colors pressable z-10 ${
                  isActive
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSortIndicator"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-lg shadow-sm -z-10"
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenFilter();
          }}
          className="relative p-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 pressable"
          aria-label="Фильтры"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Flight Cards List */}
      {filteredFlights.length === 0 ? (
        <div className="mx-4 my-8 p-8 ios-card text-center">
          <p className="text-[15px] font-medium text-black dark:text-white">
            По выбранным фильтрам билетов не найдено
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Попробуйте сбросить фильтры
          </p>
        </div>
      ) : (
        <div className="mt-1">
          {filteredFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              isFavorite={favorites.includes(flight.id)}
              onToggleFavorite={onToggleFavorite}
              onTrackFlight={() => onOpenSubscriptionModal(flight)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
