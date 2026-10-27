import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, Clock, Check } from 'lucide-react';
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
  const [testNotification, setTestNotification] = useState<string | null>(null);

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
      setTestNotification(
        `Цена на ${sub.fromCity} → ${sub.toCity} снизилась до ${result.newPrice.toLocaleString('ru-RU')} ₽`
      );
      onRefresh();

      setTimeout(() => {
        setTestNotification(null);
      }, 4000);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {testNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="p-3.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-medium flex items-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
            <span>{testNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-black dark:text-white tracking-tight">
          Активные трекеры
        </h2>
        <button
          onClick={() => {
            haptic.medium();
            onOpenCreateModal();
          }}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 pressable"
        >
          + Добавить
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="py-12 px-4 ios-card text-center">
          <Bell className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2 stroke-[1.5]" />
          <h3 className="text-[15px] font-semibold text-black dark:text-white">
            Нет активных подписок
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1 mb-4">
            Подпишитесь на нужный маршрут, чтобы бот уведомил вас при снижении цены.
          </p>
          <button
            onClick={() => {
              haptic.medium();
              onOpenCreateModal();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-xs pressable"
          >
            Создать подписку
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="ios-card p-4 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between hairline-b pb-2.5">
                <div>
                  <div className="text-[15px] font-semibold text-black dark:text-white tracking-tight">
                    {sub.fromCity} ({sub.fromCode}) → {sub.toCity} ({sub.toCode})
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {sub.departureDate} {sub.flexibleDates ? '(±3 дня)' : ''}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(sub.id)}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md pressable ${
                      sub.active
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {sub.active ? 'Активен' : 'Пауза'}
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 pressable"
                    aria-label="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Price comparison */}
              <div className="grid grid-cols-2 gap-3 py-3">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-medium">
                    Текущая цена
                  </div>
                  <div className="text-[18px] font-bold text-black dark:text-white tabular tracking-tight">
                    {sub.currentBestPrice.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-medium">
                    Цель уведомления
                  </div>
                  <div className="text-[18px] font-bold text-blue-600 dark:text-blue-400 tabular tracking-tight">
                    ≤ {sub.targetPrice.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="hairline-t pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Обновлено {sub.lastCheckedAt}
                </span>

                <button
                  onClick={() => handleSimulateAlert(sub)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 pressable"
                >
                  Тест уведомления
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
