import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  Clock, 
  Luggage, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Share2, 
  Heart, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  Check
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
    const shareText = `✈️ Нашел отличный билет ${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode})\n💰 Лучшая цена: ${flight.bestPrice.toLocaleString('ru-RU')} ₽ (${flight.airlines.join(', ')})\n⏱ В пути: ${flight.durationTotal}\n\nСмотри в AIR Gate Telegram Mini App!`;
    shareToTelegram(shareText);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.medium();
    onToggleFavorite(flight.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      className="mb-3 mx-4 rounded-3xl glass-card overflow-hidden shadow-subtle border border-black/[0.06] dark:border-white/[0.08] transition-all"
    >
      {/* Top Badges Bar */}
      <div className="px-4 pt-3 flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {flight.isCheapest && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
              <TrendingDown className="w-2.5 h-2.5" />
              Самый дешевый
            </span>
          )}
          {flight.isFastest && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40">
              Самый быстрый
            </span>
          )}
          {flight.isOptimal && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
              Оптимальный выбор
            </span>
          )}
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {flight.airlines.join(', ')}
          </span>
        </div>

        {/* Favorite & Share Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 pressable"
            title="Поделиться в Telegram"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full pressable ${
              isFavorite ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
            title="В избранное"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Flight Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {flight.departureTime}
            </div>
            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {flight.fromCode}
            </div>
            <div className="text-[11px] text-zinc-400 truncate max-w-[90px]">
              {flight.fromCity}
            </div>
          </div>

          {/* Route Duration & Flight Line */}
          <div className="flex-1 px-4 flex flex-col items-center">
            <span className="text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {flight.durationTotal}
            </span>
            <div className="w-full flex items-center relative">
              <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-700 relative">
                {flight.stopsCount > 0 && (
                  <div className="absolute left-[50%] -top-[3px] -translate-x-[50%] w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-900" />
                )}
              </div>
              <Plane className="w-3.5 h-3.5 text-blue-500 absolute right-0 -top-1" />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 font-medium">
              {flight.stopsCount === 0
                ? 'Прямой рейс'
                : `${flight.stopsCount} пересадка (${flight.layovers.map(l => l.city).join(', ')})`}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {flight.arrivalTime}
            </div>
            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {flight.toCode}
            </div>
            <div className="text-[11px] text-zinc-400 truncate max-w-[90px]">
              {flight.toCity}
            </div>
          </div>
        </div>

        {/* Layover Warnings (e.g. short layover < 60 min) */}
        {flight.layovers.some(l => l.isShort) && (
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Короткая пересадка 45 мин — авиакомпания обеспечивает стыковку багажа.</span>
          </div>
        )}

        {/* Price Prediction Banner */}
        <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-black/[0.03] dark:border-white/[0.04] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
            {flight.priceTrend === 'dropping' ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="truncate">{flight.priceConfidenceText}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400 flex-shrink-0 ml-1">
            <Luggage className="w-3 h-3" />
            <span>{flight.baggageIncluded ? 'Багаж 23 кг' : 'Без багажа'}</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {flight.bestPrice.toLocaleString('ru-RU')} ₽
              </span>
              {flight.priceDiscountPercent > 0 && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  -{flight.priceDiscountPercent}%
                </span>
              )}
            </div>
            <div className="text-[11px] text-zinc-400">
              Средняя цена на рынке: {flight.averageMarketPrice.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Direct Booking Link */}
            <a
              href={flight.sellers[0]?.bookingUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic.medium()}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 pressable"
            >
              <span>Купить</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Compare All Sellers Button */}
        <button
          onClick={() => {
            haptic.selection();
            setShowSellers(!showSellers);
          }}
          className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 pressable"
        >
          <span>Сравнить цены {flight.sellers.length} продавцов</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showSellers ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expandable Sellers List */}
        <AnimatePresence>
          {showSellers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800"
            >
              {flight.sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="py-2 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                        {seller.sellerName}
                        {seller.isAirlineDirect && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                            Прямой тариф
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Рейтинг: {seller.rating} • {seller.baggageIncluded ? 'Багаж включен' : 'Ручная кладь 10 кг'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {seller.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <a
                      href={seller.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => haptic.light()}
                      className="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-semibold pressable"
                    >
                      К сайту
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
