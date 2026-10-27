import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bell } from 'lucide-react';
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
    }, 900);
  };

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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-black dark:text-white tracking-tight">
                    Подписка на цену
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Уведомим в Telegram при падении стоимости
                  </p>
                </div>
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

            {/* Route summary */}
            <div className="ios-card p-4 mb-4">
              <div className="font-bold text-[16px] text-black dark:text-white tracking-tight">
                {fromCity} ({fromCode}) → {toCity} ({toCode})
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Текущая лучшая цена: <strong className="text-black dark:text-white">{currentBestPrice.toLocaleString('ru-RU')} ₽</strong>
              </div>
            </div>

            {/* Target Price Slider */}
            <div className="ios-card p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Желаемая цена:
                </span>
                <span className="text-[20px] font-black text-blue-600 dark:text-blue-400 tabular">
                  {targetPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={200}
                value={targetPrice}
                onChange={(e) => {
                  haptic.selection();
                  setTargetPrice(Number(e.target.value));
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>{minPrice.toLocaleString('ru-RU')} ₽ (-50%)</span>
                <span>{maxPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSave}
              disabled={isCreated}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 pressable disabled:opacity-75"
            >
              {isCreated ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>Подписка создана!</span>
                </>
              ) : (
                <span>Создать подписку</span>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
