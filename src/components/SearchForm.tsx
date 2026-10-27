import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Calendar, Users, Sparkles, SlidersHorizontal, MapPin, ArrowRight } from 'lucide-react';
import { SearchParams, Airport } from '../types';
import { getAirportByCode, getNearbyAirports } from '../data/airports';
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

  const handleSwap = () => {
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
    <div className="p-4 mx-4 my-3 rounded-[28px] glass-panel shadow-subtle border border-black/[0.06] dark:border-white/[0.08]">
      {/* Route Selector (From & To) */}
      <div className="relative flex flex-col gap-2">
        {/* Origin */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenAirportModal('from');
          }}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] text-left pressable"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                Откуда
              </div>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {searchParams.fromCity}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300">
            {searchParams.fromCode}
          </span>
        </button>

        {/* Swap Button */}
        <div className="absolute right-4 top-[50%] -translate-y-[50%] z-10">
          <button
            onClick={handleSwap}
            disabled={searchParams.toCode === 'ANY'}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 shadow-md border border-black/[0.08] dark:border-white/[0.1] text-zinc-700 dark:text-zinc-200 flex items-center justify-center pressable disabled:opacity-40"
            title="Поменять местами"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenAirportModal('to');
          }}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] text-left pressable"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              {searchParams.toCode === 'ANY' ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                Куда
              </div>
              <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {searchParams.toCity}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300">
            {searchParams.toCode}
          </span>
        </button>
      </div>

      {/* Nearby Airports Smart Banner (e.g. Riga & Tallinn cluster) */}
      {nearbyAirports.length > 0 && (
        <div className="mt-2.5 px-3 py-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 flex items-center justify-between">
          <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Соседние хабы: </span>
            {nearbyAirports.map((nb, idx) => (
              <button
                key={nb.code}
                onClick={() => handleSelectNearby(nb)}
                className="inline-flex items-center underline hover:text-blue-500 font-medium ml-1 pressable"
              >
                {nb.city} ({nb.code}){idx < nearbyAirports.length - 1 ? ',' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dates & Passengers Row */}
      <div className="grid grid-cols-2 gap-2 mt-2.5">
        {/* Date Picker Button */}
        <button
          onClick={() => {
            haptic.selection();
            onOpenCalendarModal();
          }}
          className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] text-left pressable"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 uppercase tracking-wider mb-0.5">
            <Calendar className="w-3 h-3 text-blue-500" />
            <span>Дата вылета</span>
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {new Date(searchParams.departureDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
            })}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            Календарь низких цен →
          </div>
        </button>

        {/* Passengers & Class Button */}
        <button
          onClick={() => {
            haptic.selection();
            const nextPassengers = searchParams.passengers === 3 ? 1 : searchParams.passengers + 1;
            onChangeParams({
              ...searchParams,
              passengers: nextPassengers,
            });
          }}
          className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] text-left pressable"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 uppercase tracking-wider mb-0.5">
            <Users className="w-3 h-3 text-blue-500" />
            <span>Пассажиры</span>
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {searchParams.passengers} пасс., {searchParams.cabinClass === 'economy' ? 'Эконом' : 'Бизнес'}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            Нажмите для смены
          </div>
        </button>
      </div>

      {/* Flexible Dates & Nearby Checkboxes */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={searchParams.flexibleDates}
            onChange={e => {
              haptic.selection();
              onChangeParams({ ...searchParams, flexibleDates: e.target.checked });
            }}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
          />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Гибкие даты (±3 дня)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={searchParams.includeNearbyAirports}
            onChange={e => {
              haptic.selection();
              onChangeParams({ ...searchParams, includeNearbyAirports: e.target.checked });
            }}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
          />
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Искать в соседних хабах
          </span>
        </label>
      </div>

      {/* Big Spring Action Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          haptic.heavy();
          onSearch();
        }}
        disabled={isLoading}
        className="w-full mt-3.5 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-colors disabled:opacity-60 pressable"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Сканируем 42 продавца и лоукостеры...</span>
          </div>
        ) : (
          <>
            <span>Найти билеты по всему рынку</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </div>
  );
};
