import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Sparkles, Navigation } from 'lucide-react';
import { Airport } from '../types';
import { POPULAR_AIRPORTS } from '../data/airports';
import { haptic } from '../lib/telegram';

interface AirportSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (airport: Airport | { code: 'ANY'; city: 'Куда угодно'; country: 'Весь мир'; name: 'Любое направление' }) => void;
  mode: 'from' | 'to';
  currentCode?: string;
}

export const AirportSelectModal: React.FC<AirportSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  mode,
  currentCode,
}) => {
  const [query, setQuery] = useState('');

  const filteredAirports = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_AIRPORTS;
    return POPULAR_AIRPORTS.filter(
      a =>
        a.city.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            haptic.light();
            onClose();
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Bottom Sheet Modal */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 rounded-t-[32px] shadow-2xl border-t border-black/[0.08] dark:border-white/[0.1] overflow-hidden"
        >
          {/* Drag Handle */}
          <div className="w-full pt-3 pb-2 flex items-center justify-center">
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          {/* Modal Header */}
          <div className="px-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {mode === 'from' ? 'Откуда летите?' : 'Куда направляетесь?'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {mode === 'from' ? 'Выберите город или ближайший аэропорт' : 'Выберите пункт назначения или поиск везде'}
              </p>
            </div>
            <button
              onClick={() => {
                haptic.light();
                onClose();
              }}
              className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 pressable"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="px-5 pb-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Город, страна или код (например: Рига, Таллин, RIX)..."
                className="w-full pl-10 pr-9 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all border border-black/[0.04] dark:border-white/[0.06]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick "Куда угодно" option for Destination */}
          {mode === 'to' && !query && (
            <div className="px-5 pb-2">
              <button
                onClick={() => {
                  haptic.medium();
                  onSelect({
                    code: 'ANY',
                    city: 'Куда угодно',
                    country: 'Весь мир',
                    name: 'Любое выгодное направление',
                  });
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/60 dark:border-blue-800/40 text-left pressable"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    Куда угодно
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Найти самые дешевые билеты по всем странам и направлениям
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Popular Hubs / Clusters */}
          {!query && (
            <div className="px-5 py-1">
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Популярные хабы (включая соседние)
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { city: 'Рига', code: 'RIX' },
                  { city: 'Таллин', code: 'TLL' },
                  { city: 'Вильнюс', code: 'VNO' },
                  { city: 'Москва', code: 'MOW' },
                  { city: 'Стамбул', code: 'IST' },
                  { city: 'Дубай', code: 'DXB' },
                  { city: 'Ереван', code: 'EVN' },
                  { city: 'Тбилиси', code: 'TBS' },
                ].map(item => (
                  <button
                    key={item.code}
                    onClick={() => {
                      const found = POPULAR_AIRPORTS.find(a => a.code === item.code);
                      if (found) {
                        haptic.selection();
                        onSelect(found);
                        onClose();
                      }
                    }}
                    className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-black/[0.04] dark:border-white/[0.06] pressable"
                  >
                    {item.city} <span className="text-zinc-400 ml-0.5">{item.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List of Airports */}
          <div className="flex-1 overflow-y-auto px-5 py-2 divide-y divide-zinc-100 dark:divide-zinc-800/60 no-scrollbar">
            {filteredAirports.map(airport => {
              const isSelected = currentCode === airport.code;
              return (
                <button
                  key={airport.code}
                  onClick={() => {
                    haptic.selection();
                    onSelect(airport);
                    onClose();
                  }}
                  className={`w-full py-3 flex items-center justify-between text-left transition-colors pressable ${
                    isSelected ? 'opacity-100' : 'opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {airport.city}
                        {airport.cluster && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-normal">
                            {airport.cluster.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {airport.name}, {airport.country}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-black/[0.04] dark:border-white/[0.06]">
                    {airport.code}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
