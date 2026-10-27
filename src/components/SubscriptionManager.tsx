import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, TrendingDown, ArrowRight, Zap, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { Subscription } from '../types';
import { storage } from '../lib/storage';
import { haptic } from '../lib/telegram';

interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  subscriptions,
  onRefresh,
  onOpenCreateModal,
}) => {
  const [testNotification, setTestNotification] = useState<{
    text: string;
    sub: Subscription;
  } | null>(null);

  const handleToggle = (id: string) => {
    haptic.selection();
    storage.toggleSubscription(id);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    haptic.warning();
    storage.deleteSubscription(id);
    onRefresh();
  };

  const handleSimulateAlert = (sub: Subscription) => {
    haptic.success();
    const result = storage.simulatePriceDrop(sub.id);
    if (result) {
      setTestNotification({
        text: `⚡ БОТ-АЛЕРТ: Цена на ${sub.fromCity} → ${sub.toCity} упала до ${result.newPrice.toLocaleString('ru-RU')} ₽ (экономия ${result.savings.toLocaleString('ru-RU')} ₽)!`,
        sub: result.sub,
      });
      onRefresh();

      setTimeout(() => {
        setTestNotification(null);
      }, 5000);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Bot Notification Simulated Banner */}
      <AnimatePresence>
        {testNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="p-4 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 flex items-start gap-3 border border-blue-400/40"
          >
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                AIR Gate Telegram Bot
              </div>
              <div className="text-xs font-semibold leading-relaxed mt-0.5">
                {testNotification.text}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Title & Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Радар цен и подписки
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Фоновый поиск лучших цен по всему рынку через бота
          </p>
        </div>

        <button
          onClick={() => {
            haptic.medium();
            onOpenCreateModal();
          }}
          className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 pressable"
        >
          + Новый трекер
        </button>
      </div>

      {/* Subscriptions List */}
      {subscriptions.length === 0 ? (
        <div className="py-12 px-4 rounded-3xl glass-card text-center border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Нет активных подписок
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-1 mb-4">
            Создайте подписку на нужное направление, чтобы бот уведомил вас, когда авиакомпании снизят цены.
          </p>
          <button
            onClick={() => {
              haptic.medium();
              onOpenCreateModal();
            }}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs pressable"
          >
            Создать первую подписку
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const isTargetReached = sub.currentBestPrice <= sub.targetPrice;
            const savings = sub.initialPrice - sub.currentBestPrice;

            return (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 rounded-3xl glass-card border border-black/[0.06] dark:border-white/[0.08] shadow-subtle"
              >
                {/* Header row */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {sub.fromCity} ({sub.fromCode}) → {sub.toCity} ({sub.toCode})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggle(sub.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border pressable ${
                        sub.active
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                          : 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'
                      }`}
                    >
                      {sub.active ? 'Активен' : 'Пауза'}
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1 text-zinc-400 hover:text-red-500 pressable"
                      title="Удалить подписку"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pricing dynamics */}
                <div className="grid grid-cols-2 gap-3 my-3">
                  <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                      Текущая лучшая цена
                    </div>
                    <div className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                      {sub.currentBestPrice.toLocaleString('ru-RU')} ₽
                    </div>
                    {savings > 0 && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
                        <TrendingDown className="w-3 h-3" />
                        Упала на {savings.toLocaleString('ru-RU')} ₽
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60">
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                      Цель для уведомления
                    </div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      ≤ {sub.targetPrice.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sub.lastCheckedAt}
                    </div>
                  </div>
                </div>

                {/* Test Bot Notification Simulator Button */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Бот проверяет 42 источника</span>
                  </div>

                  <button
                    onClick={() => handleSimulateAlert(sub)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200/60 dark:border-blue-900/40 pressable"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Тест пуша бота</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
