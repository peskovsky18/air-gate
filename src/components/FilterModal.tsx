import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Check, Luggage, Clock, Plane } from 'lucide-react';
import { FilterState } from '../types';
import { haptic } from '../lib/telegram';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
  onReset,
}) => {
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

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 rounded-t-[32px] shadow-2xl border-t border-black/[0.08] dark:border-white/[0.1] overflow-hidden p-6"
        >
          {/* Drag Handle */}
          <div className="w-full -mt-2 pb-3 flex items-center justify-center">
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Фильтры поиска
              </h3>
            </div>
            <button
              onClick={() => {
                haptic.light();
                onClose();
              }}
              className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 pressable"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filters Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
            {/* Quick toggles */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Luggage className="w-4 h-4 text-zinc-500" />
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Только с включенным багажом
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Исключить тарифы только с ручной кладью
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.baggageOnly}
                  onChange={e => {
                    haptic.selection();
                    onChangeFilters({ ...filters, baggageOnly: e.target.checked });
                  }}
                  className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-zinc-500" />
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Только прямые рейсы
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Без пересадок и стыковок
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.directOnly}
                  onChange={e => {
                    haptic.selection();
                    onChangeFilters({ ...filters, directOnly: e.target.checked });
                  }}
                  className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Time of Day */}
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Время вылета
              </span>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[
                  { id: 'all', label: 'Любое' },
                  { id: 'morning', label: 'Утро (06-12)' },
                  { id: 'day', label: 'День (12-18)' },
                  { id: 'evening', label: 'Вечер (18-00)' },
                ].map(item => {
                  const isSelected = filters.timeOfDay === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        haptic.selection();
                        onChangeFilters({ ...filters, timeOfDay: item.id as any });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all pressable ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <button
              onClick={() => {
                haptic.light();
                onReset();
              }}
              className="py-3 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs pressable"
            >
              Сбросить
            </button>
            <button
              onClick={() => {
                haptic.medium();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 pressable"
            >
              Применить фильтры
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
