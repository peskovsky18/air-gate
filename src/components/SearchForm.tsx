import React from 'react';
import { ArrowUpDown, Calendar, Users, ChevronRight, Search } from 'lucide-react';
import { SearchParams } from '../types';
import { formatDateDisplayRu } from '../lib/dateUtils';
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

  return (
    <div className="p-4 space-y-3">
      {/* Flight Dispatch Console */}
      <div className="ios-card overflow-hidden border border-black/[0.08] dark:border-white/[0.12]">
        {/* Terminal Route Board: From ── Swap ── To */}
        <div className="relative p-4 hairline-b grid grid-cols-2 gap-3 items-center">
          {/* Departure Airport Block */}
          <button
            onClick={() => {
              haptic.selection();
              onOpenAirportModal('from');
            }}
            className="text-left pressable pr-4"
          >
            <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
              ОТКУДА / FROM
            </div>
            <div className="text-[28px] font-black font-mono tracking-tight text-blue-600 dark:text-blue-400 leading-none mt-1">
              {searchParams.fromCode}
            </div>
            <div className="text-[14px] font-bold text-black dark:text-white truncate mt-0.5">
              {searchParams.fromCity}
            </div>
          </button>

          {/* Bidirectional Route Swap Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleSwap}
              disabled={searchParams.toCode === 'ANY'}
              className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-black/[0.1] dark:border-white/[0.15] shadow-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 pressable disabled:opacity-30 active:rotate-180 transition-transform duration-200"
              aria-label="Поменять местами"
            >
              <ArrowUpDown className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Destination Airport Block */}
          <button
            onClick={() => {
              haptic.selection();
              onOpenAirportModal('to');
            }}
            className="text-right pressable pl-4"
          >
            <div className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
              КУДА / TO
            </div>
            <div className="text-[28px] font-black font-mono tracking-tight text-blue-600 dark:text-blue-400 leading-none mt-1">
              {searchParams.toCode}
            </div>
            <div className="text-[14px] font-bold text-black dark:text-white truncate mt-0.5">
              {searchParams.toCity}
            </div>
          </button>
        </div>

        {/* Date and Passengers Grid */}
        <div className="grid grid-cols-2 divide-x divide-black/[0.08] dark:divide-white/[0.1]">
          {/* Departure Date */}
          <button
            onClick={() => {
              haptic.selection();
              onOpenCalendarModal();
            }}
            className="p-3.5 text-left pressable hover:bg-black/[0.02] dark:hover:bg-white/[0.02] flex items-center justify-between"
          >
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>ДАТА ВЫЛЕТА</span>
              </div>
              <div className="text-[14px] font-bold text-black dark:text-white capitalize truncate mt-0.5">
                {formatDateDisplayRu(searchParams.departureDate)}
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          </button>

          {/* Passengers Count */}
          <button
            onClick={() => {
              haptic.selection();
              const next = searchParams.passengers === 4 ? 1 : searchParams.passengers + 1;
              const updated = { ...searchParams, passengers: next };
              onChangeParams(updated);
              onSearch(updated);
            }}
            className="p-3.5 text-left pressable hover:bg-black/[0.02] dark:hover:bg-white/[0.02] flex items-center justify-between"
          >
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>ПАССАЖИРЫ</span>
              </div>
              <div className="text-[14px] font-bold text-black dark:text-white truncate mt-0.5">
                {searchParams.passengers} {searchParams.passengers === 1 ? 'пассажир' : 'пассажира'} • Эконом
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              +1
            </span>
          </button>
        </div>
      </div>

      {/* Hero Primary Action Button */}
      <button
        onClick={() => {
          haptic.heavy();
          onSearch(searchParams);
        }}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-[15px] tracking-tight transition-all disabled:opacity-60 pressable shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Сканируем котировки рынка...</span>
          </div>
        ) : (
          <>
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>СКАНИРОВАТЬ РЫНОК</span>
          </>
        )}
      </button>
    </div>
  );
};
