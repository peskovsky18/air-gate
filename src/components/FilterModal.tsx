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

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          className="relative w-full max-w-lg bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[24px] shadow-ios-modal overflow-hidden p-5"
        >
          {/* Drag Handle */}
          <div className="w-full -mt-2 pb-3 flex items-center justify-center">
            <div className="w-9 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
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
              className="p-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 pressable"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Grouped Inset Switches */}
            <div className="ios-card overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between hairline-b">
                <span className="text-[15px] font-medium text-black dark:text-white tracking-tight">
                  Только с багажом
                </span>
                <button
                  onClick={() => {
                    haptic.selection();
                    onChangeFilters({ ...filters, baggageOnly: !filters.baggageOnly });
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative pressable ${
                    filters.baggageOnly ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Только с багажом"
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 ${
                      filters.baggageOnly ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-[15px] font-medium text-black dark:text-white tracking-tight">
                  Только прямые рейсы
                </span>
                <button
                  onClick={() => {
                    haptic.selection();
                    onChangeFilters({ ...filters, directOnly: !filters.directOnly });
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative pressable ${
                    filters.directOnly ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Только прямые рейсы"
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 ${
                      filters.directOnly ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Time of Day Segmented Control */}
            <div>
              <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-2 px-1">
                Время вылета
              </div>
              <div className="p-0.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80 flex items-center">
                {[
                  { id: 'all', label: 'Любое' },
                  { id: 'morning', label: 'Утро' },
                  { id: 'day', label: 'День' },
                  { id: 'evening', label: 'Вечер' },
                ].map(item => {
                  const isSelected = filters.timeOfDay === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        haptic.selection();
                        onChangeFilters({ ...filters, timeOfDay: item.id as any });
                      }}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-colors pressable ${
                        isSelected
                          ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                          : 'text-zinc-500'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  haptic.light();
                  onReset();
                }}
                className="py-3 px-4 rounded-xl ios-card text-black dark:text-white text-xs font-semibold pressable"
              >
                Сбросить
              </button>
              <button
                onClick={() => {
                  haptic.medium();
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold pressable"
              >
                Применить
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
