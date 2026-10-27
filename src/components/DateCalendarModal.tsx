import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { parseYMD, formatYMD, getTodayYMD, formatMonthYearRu } from '../lib/dateUtils';
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
  const todayYMD = getTodayYMD();
  const parsedSelected = parseYMD(selectedDate || todayYMD);

  const [viewYear, setViewYear] = useState<number>(parsedSelected.year);
  const [viewMonth, setViewMonth] = useState<number>(parsedSelected.month); // 0 - 11

  // Synchronize view when modal opens or selectedDate changes
  useEffect(() => {
    if (isOpen) {
      const p = parseYMD(selectedDate || todayYMD);
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [isOpen, selectedDate]);

  const today = parseYMD(todayYMD);
  const isCurrentMonthPastOrPresent =
    viewYear < today.year || (viewYear === today.year && viewMonth <= today.month);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.selection();
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.selection();
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Quick preset dates
  const handleQuickPreset = (daysOffset: number) => {
    haptic.selection();
    const d = new Date(today.year, today.month, today.day);
    d.setDate(d.getDate() + daysOffset);
    const dateStr = formatYMD(d.getFullYear(), d.getMonth(), d.getDate());
    onSelectDate(dateStr);
    onClose();
  };

  // Days in selected view month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayWeekIndex = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDayWeekIndex + 6) % 7;
  const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Calculate upcoming weekend
  const todayDow = new Date(today.year, today.month, today.day).getDay();
  const daysUntilSaturday = (6 - todayDow + 7) % 7 || 7;

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

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="relative w-full max-w-lg bg-[#F2F2F7] dark:bg-[#1C1C1E] text-black dark:text-white rounded-t-[28px] shadow-2xl overflow-hidden p-5 max-h-[90vh] flex flex-col z-10 border-t border-black/[0.08] dark:border-white/[0.1]"
          >
            {/* Drag Handle */}
            <div className="w-full -mt-2 pb-3 flex items-center justify-center">
              <div className="w-9 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-2 hairline-b">
              <div>
                <h3 className="text-[18px] font-bold text-black dark:text-white tracking-tight">
                  Выберите дату вылета
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Календарь цен на все дни месяца
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

            {/* Quick Presets */}
            <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar hairline-b">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 pl-0.5 whitespace-nowrap">Быстро:</span>
              {[
                { label: 'Завтра', days: 1 },
                { label: 'Через 3 дня', days: 3 },
                { label: 'Через неделю', days: 7 },
                { label: 'В выходные', days: daysUntilSaturday },
                { label: 'Через 2 недели', days: 14 },
                { label: 'Через месяц', days: 30 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleQuickPreset(p.days)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-black dark:text-white whitespace-nowrap pressable"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between py-3">
              <button
                onClick={handlePrevMonth}
                disabled={isCurrentMonthPastOrPresent}
                className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white pressable disabled:opacity-20"
                aria-label="Предыдущий месяц"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[16px] font-bold text-black dark:text-white capitalize tracking-tight">
                {formatMonthYearRu(viewYear, viewMonth)}
              </span>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white pressable"
                aria-label="Следующий месяц"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {dayLabels.map((label, idx) => (
                <span
                  key={label}
                  className={`text-[11px] font-bold uppercase ${
                    idx >= 5 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 flex-1 overflow-y-auto py-1">
              {/* Blank offset cells */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`blank-${i}`} className="h-14" />
              ))}

              {/* Days of current month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = formatYMD(viewYear, viewMonth, day);

                const isPast =
                  viewYear < today.year ||
                  (viewYear === today.year && viewMonth < today.month) ||
                  (viewYear === today.year && viewMonth === today.month && day < today.day);

                const isSelected = dateStr === selectedDate;
                const isToday =
                  viewYear === today.year && viewMonth === today.month && day === today.day;

                const dayDow = new Date(viewYear, viewMonth, day).getDay();
                const isWeekend = dayDow === 0 || dayDow === 6;
                const seed = (day * 7 + viewMonth * 13) % 11;
                const multiplier = 0.82 + (seed / 10) * 0.35 + (isWeekend ? 0.18 : 0);
                const dayPrice = Math.round((basePrice * multiplier) / 100) * 100;
                const isCheapest = dayPrice < basePrice * 0.9;

                return (
                  <button
                    key={dateStr}
                    disabled={isPast}
                    onClick={() => {
                      haptic.selection();
                      onSelectDate(dateStr);
                      onClose();
                    }}
                    className={`h-14 rounded-xl flex flex-col items-center justify-center transition-all pressable ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-md ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-zinc-900'
                        : isPast
                        ? 'opacity-20 cursor-not-allowed text-zinc-400 dark:text-zinc-600'
                        : isToday
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-500/50 text-blue-600 dark:text-blue-400'
                        : 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-black dark:text-white shadow-sm'
                    }`}
                  >
                    <span className={`text-[15px] tabular leading-none ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                      {day}
                    </span>
                    {!isPast && (
                      <span
                        className={`text-[9px] mt-1 tabular leading-none ${
                          isSelected
                            ? 'text-white font-semibold'
                            : isCheapest
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {Math.round(dayPrice / 1000)}к
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
