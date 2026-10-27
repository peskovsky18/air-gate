import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Globe } from 'lucide-react';
import { Airport } from '../types';
import { POPULAR_AIRPORTS } from '../data/airports';
import { haptic } from '../lib/telegram';

interface AirportSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (airport: Airport | { code: string; city: string; country: string; name: string }) => void;
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
  const [activeRegion, setActiveRegion] = useState<'all' | 'baltic' | 'europe' | 'east' | 'cis'>('all');

  const filteredAirports = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = POPULAR_AIRPORTS;

    if (!q && activeRegion !== 'all') {
      if (activeRegion === 'baltic') {
        list = list.filter(a => ['Латвия', 'Эстония', 'Литва', 'Финляндия'].includes(a.country));
      } else if (activeRegion === 'europe') {
        list = list.filter(a => ['Италия', 'Испания', 'Франция', 'Германия', 'Нидерланды', 'Австрия', 'Чехия', 'Польша', 'Греция', 'Португалия', 'Великобритания', 'Венгрия', 'Кипр'].includes(a.country));
      } else if (activeRegion === 'east') {
        list = list.filter(a => ['Турция', 'ОАЭ', 'Катар', 'Армения', 'Грузия', 'Таиланд', 'Индонезия'].includes(a.country));
      } else if (activeRegion === 'cis') {
        list = list.filter(a => ['Россия', 'Беларусь', 'Узбекистан', 'Казахстан', 'Азербайджан'].includes(a.country));
      }
    }

    if (!q) return list;

    return POPULAR_AIRPORTS.filter(
      a =>
        a.city.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    );
  }, [query, activeRegion]);

  const isCustomCode = query.trim().length === 3 && filteredAirports.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="relative w-full max-w-lg max-h-[88vh] flex flex-col bg-[#F2F2F7] dark:bg-[#1C1C1E] text-black dark:text-white rounded-t-[28px] shadow-2xl overflow-hidden z-10 border-t border-black/[0.08] dark:border-white/[0.1]"
          >
            {/* Drag Handle */}
            <div className="w-full pt-3 pb-2 flex items-center justify-center">
              <div className="w-9 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            </div>

            {/* Modal Header */}
            <div className="px-5 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-black dark:text-white tracking-tight">
                  {mode === 'from' ? 'Город отправления' : 'Город прибытия'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Поиск по городам и кодам IATA
                </p>
              </div>
              <button
                onClick={() => {
                  haptic.light();
                  onClose();
                }}
                className="p-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 pressable"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-5 pb-2.5">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Город, страна или код (например: Рим, FCO)..."
                  className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[14px] font-medium text-black dark:text-white placeholder-zinc-400 focus:outline-none transition-all"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Region Tabs (if no query) */}
            {!query && (
              <div className="px-5 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Все' },
                  { id: 'baltic', label: 'Балтия' },
                  { id: 'europe', label: 'Европа' },
                  { id: 'east', label: 'Восток и Азия' },
                  { id: 'cis', label: 'СНГ и Россия' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      haptic.selection();
                      setActiveRegion(tab.id as any);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors pressable ${
                      activeRegion === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* "Куда угодно" Option */}
            {mode === 'to' && !query && (
              <div className="px-5 pb-2">
                <button
                  onClick={() => {
                    haptic.medium();
                    onSelect({
                      code: 'ANY',
                      city: 'Куда угодно',
                      country: 'Весь мир',
                      name: 'Лучшие предложения по миру',
                    });
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-800 text-left pressable border border-blue-500/30 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Globe className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-blue-600 dark:text-blue-400">
                      Куда угодно
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Сравнить самые дешевые билеты по всем странам
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Custom IATA Code Option */}
            {isCustomCode && (
              <div className="px-5 pb-2">
                <button
                  onClick={() => {
                    const codeUpper = query.trim().toUpperCase();
                    haptic.medium();
                    onSelect({
                      code: codeUpper,
                      city: `Аэропорт ${codeUpper}`,
                      country: 'Международный',
                      name: `Код IATA ${codeUpper}`,
                    });
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-800 text-left pressable border border-blue-500/40 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                    {query.trim().toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-black dark:text-white">
                      Искать по коду {query.trim().toUpperCase()}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Прямой поиск по международному коду аэропорта
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Grouped Inset List */}
            <div className="flex-1 overflow-y-auto px-5 py-2 no-scrollbar">
              <div className="bg-white dark:bg-zinc-800/90 rounded-2xl overflow-hidden divide-y divide-black/[0.06] dark:divide-white/[0.06] shadow-sm">
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
                      className={`w-full px-4 py-3 flex items-center justify-between text-left pressable ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-950/40' : 'hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                      }`}
                    >
                      <div>
                        <div className="text-[15px] font-bold text-black dark:text-white tracking-tight flex items-center gap-1.5">
                          {airport.city}
                          {airport.cluster && (
                            <span className="text-[10px] text-zinc-400 font-normal">
                              • {airport.cluster.split(' ')[0]}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {airport.name}, {airport.country}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700">
                        {airport.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
