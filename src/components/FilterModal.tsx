import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
            className="relative w-full max-w-lg bg-[#F2F2F7] dark:bg-[#1C1C1E] text-black dark:text-white rounded-t-[28px] shadow-2xl overflow-hidden p-5 z-10 border-t border-black/[0.08] dark:border-white/[0.1]"
          >
            {/* Drag Handle */}
            <div className="w-full -mt-2 pb-3 flex items-center justify-center">
              <div className="w-9 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-black dark:text-white tracking-tight">
                Фильтры
              </h3>
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

            {/* Filter Items */}
            <div className="space-y-4">
              <div className="ios-card overflow-hidden divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                {/* Direct Flights Only */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold text-black dark:text-white">
                      Только прямые рейсы
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Исключить все рейсы с пересадками
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.directOnly}
                    onChange={(e) => {
                      haptic.selection();
                      onChangeFilters({ ...filters, directOnly: e.target.checked });
                    }}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Baggage Included Only */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold text-black dark:text-white">
                      Только с багажом
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Включен чемодан от 20 кг
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.baggageOnly}
                    onChange={(e) => {
                      haptic.selection();
                      onChangeFilters({ ...filters, baggageOnly: e.target.checked });
                    }}
                    className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Time of Day */}
              <div>
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide px-1 mb-2">
                  Время вылета
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'Любое' },
                    { id: 'morning', label: 'Утро' },
                    { id: 'day', label: 'День' },
                    { id: 'evening', label: 'Вечер' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        haptic.selection();
                        onChangeFilters({ ...filters, timeOfDay: t.id as any });
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold transition-colors pressable ${
                        filters.timeOfDay === t.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-2.5">
                <button
                  onClick={() => {
                    haptic.selection();
                    onReset();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white font-semibold text-[14px] pressable"
                >
                  Сбросить
                </button>
                <button
                  onClick={() => {
                    haptic.medium();
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-[14px] shadow-sm pressable"
                >
                  Применить
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
