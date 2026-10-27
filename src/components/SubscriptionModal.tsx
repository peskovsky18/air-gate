import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Sparkles, TrendingDown, Shield } from 'lucide-react';
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
  const [instantAlerts, setInstantAlerts] = useState<boolean>(true);
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
    }, 1200);
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

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg flex flex-col bg-white dark:bg-zinc-900 rounded-t-[32px] shadow-2xl border-t border-black/[0.08] dark:border-white/[0.1] overflow-hidden p-6"
        >
          {/* Drag Handle */}
          <div className="w-full -mt-2 pb-3 flex items-center justify-center">
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              haptic.light();
              onClose();
            }}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 pressable"
          >
            <X className="w-4 h-4" />
          </button>

          {isCreated ? (
            /* Success Feedback Animation */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Подписка активирована!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
                Бот пришлет мгновенное пуш-уведомление в Telegram, как только цена опустится до {targetPrice.toLocaleString('ru-RU')} ₽.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Следить за ценой билета
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {fromCity} ({fromCode}) → {toCity} ({toCode})
                  </p>
                </div>
              </div>

              {/* Target Price Configuration */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Желаемая целевая цена:
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Экономия {(currentBestPrice - targetPrice).toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight my-2">
                  {targetPrice.toLocaleString('ru-RU')} ₽
                </div>

                {/* Range Slider */}
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
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-[11px] text-zinc-400 mt-2 font-mono">
                  <span>Мин: {minPrice.toLocaleString('ru-RU')} ₽</span>
                  <span>Сейчас: {currentBestPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {/* Flexible Dates & Telegram Push Settings */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Мониторить гибкие даты (±3 дня / весь месяц)
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Уведомить о суперцене на соседние дни вылета
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={flexibleDates}
                    onChange={e => {
                      haptic.selection();
                      setFlexibleDates(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/[0.04] dark:border-white/[0.06] cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>Мгновенный пуш в Telegram-боте</span>
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      При снижении цены бот сразу пришлет ссылку на бронь
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={instantAlerts}
                    onChange={e => {
                      haptic.selection();
                      setInstantAlerts(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Save Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 pressable"
              >
                <Bell className="w-4 h-4" />
                <span>Создать радар-подписку</span>
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
