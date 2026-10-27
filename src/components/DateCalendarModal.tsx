import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, X } from 'lucide-react';
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
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[18px] font-bold text-black dark:text-white tracking-tight">
                Календарь цен
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Стоимость билетов по дням
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

          {/* Grid */}
          <div className="grid grid-cols-4 gap-2 py-2">
            {heatmapData.map((item) => {
              const isSelected = item.date === selectedDate;
              const isCheapest = item.isLowest;

              return (
                <button
                  key={item.date}
                  disabled={item.isPast}
                  onClick={() => {
                    haptic.selection();
                    onSelectDate(item.date);
                    onClose();
                  }}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-colors pressable ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'ios-card text-black dark:text-white'
                  } ${item.isPast ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <span className={`text-[10px] font-medium uppercase ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                    {item.dayOfWeek}
                  </span>
                  <span className="text-[17px] font-bold tabular my-0.5">
                    {item.dayOfMonth}
                  </span>
                  <span className={`text-[11px] tabular ${
                    isSelected
                      ? 'text-white'
                      : isCheapest
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-zinc-500'
                  }`}>
                    {item.price.toLocaleString('ru-RU')} ₽
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
