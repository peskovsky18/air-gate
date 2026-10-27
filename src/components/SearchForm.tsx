import React from 'react';
import { ArrowUpDown, Calendar, Users, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { SearchParams } from '../types';
import { haptic } from '../lib/telegram';

interface SearchFormProps {
  searchParams: SearchParams;
  onChangeParams: (params: SearchParams) => void;
  onSearch: () => void;
  onOpenAirportModal: (mode: 'from' | 'to') => void;
  onOpenCalendarModal: () => void;
  onOpenFilterModal: () => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  onChangeParams,
  onSearch,
  onOpenAirportModal,
  onOpenCalendarModal,
  onOpenFilterModal,
  isLoading,
}) => {
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

  return (
    <div className="p-4 space-y-3">
      {/* Grouped Inset Card: Route & Parameters */}
      <div className="ios-card overflow-hidden">
        {/* Row 1: Откуда */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenAirportModal('from');
          }}
          className="w-full px-4 py-3 flex items-center justify-between text-left pressable hairline-b"
        >
          <div>
            <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Откуда
            </div>
            <div className="text-[17px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
              {searchParams.fromCity}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-mono font-medium text-zinc-500">
              {searchParams.fromCode}
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
          </div>
        </button>

        {/* Swap Button */}
        <div className="relative h-0">
          <button
            onClick={handleSwap}
            disabled={searchParams.toCode === 'ANY'}
            className="absolute right-5 -top-3.5 z-10 w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center text-zinc-600 dark:text-zinc-300 pressable disabled:opacity-30"
            aria-label="Поменять местами"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 2: Куда */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenAirportModal('to');
          }}
          className="w-full px-4 py-3 flex items-center justify-between text-left pressable hairline-b"
        >
          <div>
            <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Куда
            </div>
            <div className="text-[17px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
              {searchParams.toCity}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-mono font-medium text-zinc-500">
              {searchParams.toCode}
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
          </div>
        </button>

        {/* Row 3: Дата */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenCalendarModal();
          }}
          className="w-full px-4 py-3 flex items-center justify-between text-left pressable hairline-b"
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <div>
              <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                Когда
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

        {/* Row 4: Сколько человек */}
        <button
          onClick={() => {
            haptic.selection();
            const next = searchParams.passengers === 3 ? 1 : searchParams.passengers + 1;
            onChangeParams({ ...searchParams, passengers: next });
          }}
          className="w-full px-4 py-3 flex items-center justify-between text-left pressable"
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <div>
              <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                Сколько человек
              </div>
              <div className="text-[15px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
                {searchParams.passengers} {searchParams.passengers === 1 ? 'пассажир' : 'пассажира'} • Эконом
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
        </button>
      </div>

      {/* Quick Filters Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => {
            haptic.selection();
            onOpenFilterModal();
          }}
          className="px-3 py-1.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 text-xs font-medium text-black dark:text-white flex items-center gap-1.5 pressable"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Все фильтры</span>
        </button>

        <button
          onClick={() => {
            haptic.selection();
            onChangeParams({ ...searchParams, flexibleDates: !searchParams.flexibleDates });
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors pressable ${
            searchParams.flexibleDates
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          ±3 дня
        </button>

        <button
          onClick={() => {
            haptic.selection();
            onChangeParams({ ...searchParams, includeNearbyAirports: !searchParams.includeNearbyAirports });
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors pressable ${
            searchParams.includeNearbyAirports
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          Соседние хабы
        </button>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => {
          haptic.medium();
          onSearch();
        }}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[15px] tracking-tight transition-colors disabled:opacity-60 pressable"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Анализ тарифов...</span>
          </div>
        ) : (
          'Найти билеты'
        )}
      </button>
    </div>
  );
};
