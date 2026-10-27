import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, Check, X, Users, Plane } from 'lucide-react';
import { Flight } from '../types';
import { formatDateDisplayRu } from '../lib/dateUtils';
import { haptic, shareToTelegram } from '../lib/telegram';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  flight,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dateText = formatDateDisplayRu(flight.departureDate);
  const baggageText = flight.baggageIncluded ? 'Багаж 20-23 кг включен' : 'Тариф без багажа (только ручная кладь)';
  const stopsText = flight.stopsCount === 0 ? 'Прямой рейс без пересадок' : `${flight.stopsCount} пересадка (${flight.layovers.map(l => l.city).join(', ')})`;

  const shareText = `✈️ Найдена отличная цена для поездки!
📍 ${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode})
📅 Дата: ${dateText}
⏱ Время: ${flight.departureTime} → ${flight.arrivalTime} (${flight.durationTotal})
✈️ Рейс: ${flight.airlines.join(', ')} (${stopsText})
🧳 Багаж: ${baggageText}
💰 Лучшая цена: ${flight.bestPrice.toLocaleString('ru-RU')} ₽ у ${flight.marketAnalysis.bestSellerName}

🔗 Ссылка на билет: ${flight.marketAnalysis.bestSellerUrl}`;

  const handleCopy = () => {
    haptic.success();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendToTelegram = () => {
    haptic.medium();
    shareToTelegram(shareText, flight.marketAnalysis.bestSellerUrl);
    onClose();
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          className="relative w-full max-w-lg bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-t-[28px] shadow-2xl overflow-hidden p-5 max-h-[90vh] flex flex-col"
        >
          {/* Drag Handle */}
          <div className="w-full -mt-2 pb-3 flex items-center justify-center">
            <div className="w-9 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 hairline-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-black dark:text-white tracking-tight">
                  Поделиться с близкими
                </h3>
                <p className="text-xs text-zinc-400">
                  Готовая карточка для чата Telegram
                </p>
              </div>
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

          {/* Message Preview Box */}
          <div className="my-4 p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.06] shadow-sm font-sans text-xs space-y-1.5 overflow-y-auto max-h-56">
            <div className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-[13px]">
              <Plane className="w-3.5 h-3.5" />
              <span>Найдена отличная цена для поездки!</span>
            </div>
            <div className="text-black dark:text-white font-medium text-[13px]">
              {flight.fromCity} ({flight.fromCode}) → {flight.toCity} ({flight.toCode})
            </div>
            <div className="text-zinc-600 dark:text-zinc-300">
              📅 {dateText} • {flight.departureTime} → {flight.arrivalTime}
            </div>
            <div className="text-zinc-600 dark:text-zinc-300">
              ✈️ {flight.airlines.join(', ')} ({flight.durationTotal})
            </div>
            <div className="text-zinc-600 dark:text-zinc-300">
              🧳 {baggageText}
            </div>
            <div className="pt-1 font-bold text-[14px] text-emerald-600 dark:text-emerald-400">
              💰 {flight.bestPrice.toLocaleString('ru-RU')} ₽ <span className="text-xs text-zinc-400 font-normal">(у {flight.marketAnalysis.bestSellerName})</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSendToTelegram}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[15px] flex items-center justify-center gap-2 pressable shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Отправить в семейный чат Telegram</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-2xl bg-zinc-200/80 dark:bg-zinc-800 text-black dark:text-white font-medium text-[14px] flex items-center justify-center gap-2 pressable"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Скопировано в буфер!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-500" />
                  <span>Скопировать текст сообщения</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
