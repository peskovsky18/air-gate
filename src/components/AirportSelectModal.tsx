import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Globe, MapPin, Plane } from 'lucide-react';
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

  if (!isOpen) return null;

  const isCustomCode = query.trim().length === 3 && filteredAirports.length === 0;

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          className="relative w-full max-w-lg max-h-[88vh] flex flex-col bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[28px] shadow-2xl overflow-hidden"
        >
          {/* Drag Handle */}
          <div className="w-full pt-3 pb-2 flex items-center justify-center">
            <div className="w-9 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          {/* Modal Header */}
          <div className="px-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-black dark:text-white tracking-tight">
                {mode === 'from' ? 'Город отправления' : 'Город прибытия'}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Поиск по любым аэропортам и кодам IATA
              </p>
            </div>
            <button
              onClick={() => {
                haptic.light();
                onClose();
              }}
              className="p-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 pressable"
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
                className="w-full pl-9 pr-8 py-2.5 bg-zinc-200/70 dark:bg-zinc-800/80 rounded-xl text-[14px] font-normal text-black dark:text-white placeholder-zinc-400 focus:outline-none transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 p-1 text-zinc-400 hover:text-zinc-600"
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
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors pressable ${
                    activeRegion === tab.id
                      ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                      : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
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
                className="w-full flex items-center gap-3 p-3 rounded-2xl ios-card text-left pressable border border-blue-500/20"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Globe className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-blue-600 dark:text-blue-400">
                    Куда угодно
                  </div>
                  <div className="text-[11px] text-zinc-400">
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
                className="w-full flex items-center gap-3 p-3 rounded-2xl ios-card text-left pressable border border-blue-500/40"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  {query.trim().toUpperCase()}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-black dark:text-white">
                    Искать по коду {query.trim().toUpperCase()}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Прямой поиск по международному коду аэропорта
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Grouped Inset List */}
          <div className="flex-1 overflow-y-auto px-5 py-2 no-scrollbar">
            <div className="ios-card overflow-hidden divide-y divide-black/[0.06] dark:divide-white/[0.06]">
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
                      isSelected ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                    }`}
                  >
                    <div>
                      <div className="text-[15px] font-semibold text-black dark:text-white tracking-tight flex items-center gap-1.5">
                        {airport.city}
                        {airport.cluster && (
                          <span className="text-[10px] text-zinc-400 font-normal">
                            • {airport.cluster.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {airport.name}, {airport.country}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
                      {airport.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
