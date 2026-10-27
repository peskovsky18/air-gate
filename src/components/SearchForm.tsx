import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Calendar, Users, ChevronRight } from 'lucide-react';
import { SearchParams, Airport } from '../types';
import { getNearbyAirports } from '../data/airports';
import { haptic } from '../lib/telegram';

interface SearchFormProps {
  searchParams: SearchParams;
  onChangeParams: (params: SearchParams) => void;
  onSearch: () => void;
  onOpenAirportModal: (mode: 'from' | 'to') => void;
  onOpenCalendarModal: () => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  onChangeParams,
  onSearch,
  onOpenAirportModal,
  onOpenCalendarModal,
  isLoading,
}) => {
  const nearbyAirports = getNearbyAirports(searchParams.fromCode);

  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.medium();
    if (searchParams.toCode === 'ANY') return;
    onChangeParams({
      ...searchParams,
      fromCode: searchParams.toCode,
      fromCity: searchParams.toCity,
      toCode: searchParams.fromCode,
      toCity: searchParams.fromCity,
    });
  };

  const handleSelectNearby = (airport: Airport) => {
    haptic.selection();
    onChangeParams({
      ...searchParams,
      fromCode: airport.code,
      fromCity: airport.city,
    });
  };

  return (
    <div className="p-4 space-y-3">
      {/* Route Grouped Inset Card */}
      <div className="ios-card overflow-hidden">
        {/* Origin Row */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenAirportModal('from');
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left pressable hairline-b"
        >
          <div>
            <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Откуда
            </div>
            <div className="text-[17px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
              {searchParams.fromCity}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-medium text-zinc-500 dark:text-zinc-400">
              {searchParams.fromCode}
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
          </div>
        </button>

        {/* Swap Button In-Between */}
        <div className="relative h-0">
          <button
            onClick={handleSwap}
            disabled={searchParams.toCode === 'ANY'}
            className="absolute right-6 -top-4 z-10 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center text-zinc-600 dark:text-zinc-300 pressable disabled:opacity-30"
            aria-label="Поменять местами"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Row */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenAirportModal('to');
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left pressable"
        >
          <div>
            <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Куда
            </div>
            <div className="text-[17px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
              {searchParams.toCity}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-medium text-zinc-500 dark:text-zinc-400">
              {searchParams.toCode}
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
          </div>
        </button>
      </div>

      {/* Nearby Airport Clusters (e.g. Riga & Tallinn) */}
      {nearbyAirports.length > 0 && (
        <div className="px-1 flex items-center gap-1.5 flex-wrap text-xs text-zinc-500">
          <span className="text-[11px] text-zinc-400">Соседние хабы:</span>
          {nearbyAirports.map(nb => (
            <button
              key={nb.code}
              onClick={() => handleSelectNearby(nb)}
              className="px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 pressable"
            >
              {nb.city} ({nb.code})
            </button>
          ))}
        </div>
      )}

      {/* Dates and Details Grouped Inset Card */}
      <div className="ios-card overflow-hidden">
        {/* Date Row */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenCalendarModal();
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left pressable hairline-b"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-500 stroke-[1.8]" />
            <div>
              <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                Дата вылета
              </div>
              <div className="text-[15px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
                {new Date(searchParams.departureDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  weekday: 'short'
                })}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
        </button>

        {/* Passengers Row */}
        <button
          onClick={() => {
            haptic.selection();
            const next = searchParams.passengers === 3 ? 1 : searchParams.passengers + 1;
            onChangeParams({ ...searchParams, passengers: next });
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left pressable"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-500 stroke-[1.8]" />
            <div>
              <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                Пассажиры и класс
              </div>
              <div className="text-[15px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
                {searchParams.passengers} {searchParams.passengers === 1 ? 'пассажир' : 'пассажира'}, {searchParams.cabinClass === 'economy' ? 'Эконом' : 'Бизнес'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
        </button>
      </div>

      {/* Flexible Dates Switch */}
      <div className="ios-card px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[14px] font-medium text-black dark:text-white tracking-tight">
            Гибкие даты (±3 дня)
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            Показывать лучшие предложения на соседние дни
          </div>
        </div>

        <button
          onClick={() => {
            haptic.selection();
            onChangeParams({ ...searchParams, flexibleDates: !searchParams.flexibleDates });
          }}
          className={`w-12 h-7 rounded-full transition-colors relative pressable ${
            searchParams.flexibleDates
              ? 'bg-blue-600'
              : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
          aria-label="Гибкие даты"
        >
          <motion.div
            layout
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 ${
              searchParams.flexibleDates ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Main Search Action Button */}
      <button
        onClick={() => {
          haptic.medium();
          onSearch();
        }}
        disabled={isLoading}
        className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[15px] tracking-tight shadow-none transition-colors disabled:opacity-60 pressable"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Поиск предложений...</span>
          </div>
        ) : (
          'Найти билеты'
        )}
      </button>
    </div>
  );
};
