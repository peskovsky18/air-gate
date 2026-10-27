import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
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
  const [filterTab, setFilterTab] = useState<'all' | 'cheapest' | 'direct'>('all');

  const filteredFlights = useMemo(() => {
    let result = [...flights];

    if (filterTab === 'direct' || filters.directOnly) {
      result = result.filter(f => f.stopsCount === 0);
    }
    if (filters.baggageOnly) {
      result = result.filter(f => f.baggageIncluded);
    }

    if (filterTab === 'cheapest') {
      result.sort((a, b) => a.bestPrice - b.bestPrice);
    }

    return result;
  }, [flights, filterTab, filters]);

  const activeFiltersCount = (filters.baggageOnly ? 1 : 0) + (filters.directOnly ? 1 : 0);

  return (
    <div className="relative pb-12">
      {/* Market Scan Info Banner */}
      <div className="mx-4 mb-2 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-xs">
        <div className="flex items-center gap-2 font-bold text-blue-950 dark:text-blue-200 text-[13px]">
          <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span>Сравнение цен со всех сервисов в реальном времени</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-300 mt-1 leading-snug">
          В каждой карточке собраны цены от КупиБилет, City.Travel, Trip.com, OneTwoTrip и сайтов авиакомпаний. Выбирайте лучшую цену и покупайте без наценок.
        </p>
      </div>

      {/* Filter Tabs & Modal Trigger */}
      <div className="px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex-1 p-0.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center relative">
          {[
            { id: 'all', label: 'Все рейсы' },
            { id: 'cheapest', label: 'Сначала дешевые' },
            { id: 'direct', label: 'Только прямые' },
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  haptic.selection();
                  setFilterTab(tab.id as any);
                }}
                className={`relative flex-1 py-1.5 text-[13px] font-medium rounded-lg text-center transition-colors pressable z-10 ${
                  isActive
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTab"
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
            По выбранным фильтрам рейсов не найдено
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
