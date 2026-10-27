import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, X, Check, TrendingDown } from 'lucide-react';
import { DatePriceHeatmap } from '../types';
import { generatePriceHeatmap } from '../services/flightAggregator';
import { haptic } from '../lib/telegram';

interface DateCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  basePrice?: number;
}

export const DateCalendarModal: React.FC<DateCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  basePrice = 14500,
}) => {
  const heatmapData: DatePriceHeatmap[] = generatePriceHeatmap(selectedDate, basePrice);

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

        {/* Bottom Sheet */}
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

          {/* Header */}
          <div className="px-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Календарь низких цен
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Тепловая карта минимальной стоимости по дням
                </p>
              </div>
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

          {/* Legend */}
          <div className="px-5 py-2 flex items-center gap-3 text-[11px] text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Суперцена</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Обычная цена</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Пик / выходные</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
            <div className="grid grid-cols-4 gap-2.5">
              {heatmapData.map((item) => {
                const isSelected = item.date === selectedDate;
                const isCheapest = item.isLowest;
                const isExpensive = item.isHighest;

                let badgeColor = 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700/60';
                if (isCheapest) {
                  badgeColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
                } else if (isExpensive) {
                  badgeColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800';
                }

                if (isSelected) {
                  badgeColor = 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20';
                }

                return (
                  <button
                    key={item.date}
                    disabled={item.isPast}
                    onClick={() => {
                      haptic.selection();
                      onSelectDate(item.date);
                      onClose();
                    }}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border text-center transition-all pressable ${badgeColor} ${
                      item.isPast ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                      {item.dayOfWeek}
                    </span>
                    <span className="text-base font-extrabold my-0.5">
                      {item.dayOfMonth}
                    </span>
                    <span className={`text-[11px] font-medium leading-none ${isSelected ? 'text-white' : ''}`}>
                      {item.price.toLocaleString('ru-RU')} ₽
                    </span>
                    {isCheapest && !isSelected && (
                      <span className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        <TrendingDown className="w-2.5 h-2.5" /> -22%
                      </span>
                    )}
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
