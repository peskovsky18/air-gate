import React from 'react';
import { ArrowUpDown, Calendar, Users, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { SearchParams } from '../types';
import { formatDateDisplayRu, addDaysToYMD, getTodayYMD } from '../lib/dateUtils';
import { haptic } from '../lib/telegram';

interface SearchFormProps {
  searchParams: SearchParams;
  onChangeParams: (params: SearchParams) => void;
  onSearch: (params?: SearchParams) => void;
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
    const updated: SearchParams = {
      ...searchParams,
      fromCode: searchParams.toCode,
      fromCity: searchParams.toCity,
      toCode: searchParams.fromCode,
      toCity: searchParams.fromCity,
    };
    onChangeParams(updated);
    onSearch(updated);
  };

  const handleQuickDate = (daysAhead: number) => {
    haptic.selection();
    const todayStr = getTodayYMD();
    const newDate = addDaysToYMD(todayStr, daysAhead);
    const updated: SearchParams = { ...searchParams, departureDate: newDate };
    onChangeParams(updated);
    onSearch(updated);
  };

  return (
    <div className="p-4 space-y-3">
      {/* Route & Parameters Card */}
      <div className="ios-card overflow-hidden">
        {/* Row 1: Откуда */}
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
          className="w-full px-4 py-3.5 flex items-center justify-between text-left pressable hairline-b"
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

        {/* Row 3: Дата вылета */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenCalendarModal();
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left pressable hairline-b"
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <div>
              <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                Дата вылета
              </div>
              <div className="text-[15px] font-semibold text-black dark:text-white tracking-tight mt-0.5 capitalize">
                {formatDateDisplayRu(searchParams.departureDate)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Выбрать день</span>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
          </div>
        </button>

        {/* Row 4: Сколько человек */}
        <button
          onClick={() => {
            haptic.selection();
            const next = searchParams.passengers === 4 ? 1 : searchParams.passengers + 1;
            const updated = { ...searchParams, passengers: next };
            onChangeParams(updated);
            onSearch(updated);
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left pressable"
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            <div>
              <div className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                Пассажиры и класс
              </div>
              <div className="text-[15px] font-semibold text-black dark:text-white tracking-tight mt-0.5">
                {searchParams.passengers} {searchParams.passengers === 1 ? 'пассажир' : 'пассажира'} • Эконом
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-400 font-medium">Нажмите +1</span>
            <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
          </div>
        </button>
      </div>

      {/* Quick Date Presets Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] text-zinc-400 pl-1 whitespace-nowrap">Быстро:</span>
        {[
          { label: 'Завтра', days: 1 },
          { label: 'Через 3 дня', days: 3 },
          { label: 'Через неделю', days: 7 },
          { label: 'Через 2 недели', days: 14 },
          { label: 'Через месяц', days: 30 },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => handleQuickDate(item.days)}
            className="px-2.5 py-1 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-xs font-medium text-black dark:text-white whitespace-nowrap pressable"
          >
            {item.label}
          </button>
        ))}
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
            const updated = { ...searchParams, flexibleDates: !searchParams.flexibleDates };
            onChangeParams(updated);
            onSearch(updated);
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
            const updated = { ...searchParams, includeNearbyAirports: !searchParams.includeNearbyAirports };
            onChangeParams(updated);
            onSearch(updated);
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

      {/* Primary Search Button */}
      <button
        onClick={() => {
          haptic.medium();
          onSearch(searchParams);
        }}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[15px] tracking-tight transition-colors disabled:opacity-60 pressable shadow-sm"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Сканирование 48 источников...</span>
          </div>
        ) : (
          'Найти билеты'
        )}
      </button>
    </div>
  );
};
