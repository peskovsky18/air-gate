import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Luggage, 
  Share2, 
  Heart, 
  ChevronDown, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Flight } from '../types';
import { haptic, shareToTelegram } from '../lib/telegram';

interface FlightCardProps {
  flight: Flight;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onTrackFlight: (flight: Flight) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  isFavorite,
  onToggleFavorite,
  onTrackFlight,
}) => {
  const [showSellers, setShowSellers] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.medium();
    const shareText = `✈️ Билет ${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode})\n💰 Лучшая цена: ${flight.bestPrice.toLocaleString('ru-RU')} ₽\n⏱ В пути: ${flight.durationTotal}\nАвиакомпания: ${flight.airlines.join(', ')}`;
    shareToTelegram(shareText);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.selection();
    onToggleFavorite(flight.id);
  };

  return (
    <div className="ios-card mb-3 mx-4 overflow-hidden">
      {/* Top Header Row */}
      <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between hairline-b">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-black dark:text-white tracking-tight">
            {flight.airlines.join(', ')}
          </span>
          {flight.isCheapest && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400">
              Лучшая цена
            </span>
          )}
          {flight.isFastest && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              Быстрый
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full text-zinc-400 hover:text-black dark:hover:text-white pressable"
            aria-label="Поделиться"
          >
            <Share2 className="w-4 h-4 stroke-[1.8]" />
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full pressable ${
              isFavorite ? 'text-red-500' : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
            aria-label="Избранное"
          >
            <Heart className={`w-4 h-4 stroke-[1.8] ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Flight Schedule Details */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div>
            <div className="text-[22px] font-bold text-black dark:text-white tracking-tight tabular">
              {flight.departureTime}
            </div>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">
              {flight.fromCode}
            </div>
            <div className="text-[11px] text-zinc-400 truncate max-w-[85px]">
              {flight.fromCity}
            </div>
          </div>

          {/* Route Line & Duration */}
          <div className="flex-1 px-4 flex flex-col items-center">
            <span className="text-[11px] font-medium text-zinc-400 mb-1 tabular">
              {flight.durationTotal}
            </span>
            <div className="w-full flex items-center relative">
              <div className="h-[1px] w-full bg-zinc-200 dark:bg-zinc-700 relative">
                {flight.stopsCount > 0 && (
                  <div className="absolute left-[50%] -top-[3px] -translate-x-[50%] w-1.5 h-1.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-zinc-900" />
                )}
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 mt-1">
              {flight.stopsCount === 0
                ? 'Прямой'
                : `${flight.stopsCount} пересадка (${flight.layovers.map(l => l.city).join(', ')})`}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-[22px] font-bold text-black dark:text-white tracking-tight tabular">
              {flight.arrivalTime}
            </div>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">
              {flight.toCode}
            </div>
            <div className="text-[11px] text-zinc-400 truncate max-w-[85px]">
              {flight.toCity}
            </div>
          </div>
        </div>

        {/* Layover Alert if short */}
        {flight.layovers.some(l => l.isShort) && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center gap-2 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Короткая пересадка 45 мин в Стамбуле. Багаж перегружается автоматически.</span>
          </div>
        )}

        {/* Baggage Info */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Luggage className="w-3.5 h-3.5" />
          <span>{flight.baggageIncluded ? 'Багаж 23 кг включен' : 'Только ручная кладь'}</span>
        </div>

        {/* Price & Checkout Row */}
        <div className="mt-3.5 pt-3 hairline-t flex items-center justify-between">
          <div>
            <div className="text-[22px] font-bold text-black dark:text-white tracking-tight tabular">
              {flight.bestPrice.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[11px] text-zinc-400">
              Лучший тариф на рынке
            </div>
          </div>

          <a
            href={flight.sellers[0]?.bookingUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic.medium()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] tracking-tight flex items-center gap-1.5 pressable"
          >
            <span>Выбрать</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Compare Sellers Disclosure */}
        <button
          onClick={() => {
            haptic.selection();
            setShowSellers(!showSellers);
          }}
          className="w-full mt-2 pt-2 flex items-center justify-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 pressable"
        >
          <span>Сравнить цены {flight.sellers.length} продавцов</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showSellers ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Sellers Breakdown */}
        <AnimatePresence>
          {showSellers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="mt-2 pt-2 hairline-t divide-y divide-black/[0.06] dark:divide-white/[0.06]"
            >
              {flight.sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      {seller.sellerName}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {seller.baggageIncluded ? 'С багажом' : 'Без багажа'} • Рейтинг {seller.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold tabular text-black dark:text-white">
                      {seller.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <a
                      href={seller.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => haptic.light()}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-black dark:text-white pressable"
                    >
                      Перейти
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
