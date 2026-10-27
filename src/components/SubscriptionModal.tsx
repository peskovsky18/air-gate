import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Subscription } from '../types';
import { storage } from '../lib/storage';
import { haptic } from '../lib/telegram';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureDate: string;
  currentBestPrice: number;
  onSubscriptionCreated: (sub: Subscription) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  fromCity,
  fromCode,
  toCity,
  toCode,
  departureDate,
  currentBestPrice,
  onSubscriptionCreated,
}) => {
  const [targetPrice, setTargetPrice] = useState<number>(
    Math.round((currentBestPrice * 0.85) / 100) * 100
  );
  const [flexibleDates, setFlexibleDates] = useState<boolean>(true);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  if (!isOpen) return null;

  const minPrice = Math.round((currentBestPrice * 0.5) / 100) * 100;
  const maxPrice = currentBestPrice;

  const handleSave = () => {
    haptic.success();
    const newSub = storage.saveSubscription({
      fromCity,
      fromCode,
      toCity,
      toCode,
      departureDate,
      flexibleDates,
      targetPrice,
      currentBestPrice,
      initialPrice: currentBestPrice,
    });

    setIsCreated(true);
    setTimeout(() => {
      onSubscriptionCreated(newSub);
      setIsCreated(false);
      onClose();
    }, 1000);
  };

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

          {/* Close button */}
          <button
            onClick={() => {
              haptic.light();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 pressable"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>

          {isCreated ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-[17px] font-bold text-black dark:text-white tracking-tight">
                Подписка сохранена
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Бот пришлет уведомление в Telegram, когда цена опустится до {targetPrice.toLocaleString('ru-RU')} ₽.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-[18px] font-bold text-black dark:text-white tracking-tight">
                  Следить за ценой
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {fromCity} ({fromCode}) → {toCity} ({toCode})
                </p>
              </div>

              {/* Target Price Card */}
              <div className="ios-card p-4 mb-3">
                <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                  Желаемая стоимость
                </div>
                <div className="text-[28px] font-bold text-black dark:text-white tracking-tight tabular my-1">
                  {targetPrice.toLocaleString('ru-RU')} ₽
                </div>

                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={200}
                  value={targetPrice}
                  onChange={e => {
                    haptic.selection();
                    setTargetPrice(Number(e.target.value));
                  }}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />

                <div className="flex justify-between text-[11px] text-zinc-400 mt-2 tabular">
                  <span>{minPrice.toLocaleString('ru-RU')} ₽</span>
                  <span>Сейчас: {currentBestPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {/* Flexible dates toggle */}
              <div className="ios-card px-4 py-3 flex items-center justify-between mb-5">
                <div>
                  <div className="text-[14px] font-medium text-black dark:text-white tracking-tight">
                    Гибкие даты (±3 дня)
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Отслеживать соседние дни вылета
                  </div>
                </div>

                <button
                  onClick={() => {
                    haptic.selection();
                    setFlexibleDates(!flexibleDates);
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative pressable ${
                    flexibleDates ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Гибкие даты"
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 ${
                      flexibleDates ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSave}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] tracking-tight transition-colors pressable"
              >
                Сохранить подписку
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
