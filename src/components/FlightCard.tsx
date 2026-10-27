import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Luggage, 
  Share2, 
  Heart, 
  ChevronDown, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Bus,
  ArrowRight,
  ShieldAlert,
  Sparkles
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
}) => {
  const [showSellers, setShowSellers] = useState(false);
  const [showTimeline, setShowTimeline] = useState(flight.stopsCount > 0);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.medium();
    const shareText = `✈️ Рейс ${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode})\n💰 Лучшая цена: ${flight.bestPrice.toLocaleString('ru-RU')} ₽\n⏱ В пути: ${flight.durationTotal}\n💡 Вердикт: ${flight.verdict.badgeTitle} — ${flight.verdict.explanation}`;
    shareToTelegram(shareText);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.selection();
    onToggleFavorite(flight.id);
  };

  const isMultiHub = Boolean(flight.multiHubAlternative);

  return (
    <div className={`ios-card mb-3.5 mx-4 overflow-hidden border ${
      isMultiHub ? 'border-blue-500/30' : 'border-transparent'
    }`}>
      {/* 1. Multi-Hub Smart Ground+Flight Banner */}
      {flight.multiHubAlternative && (
        <div className="bg-blue-600/10 dark:bg-blue-500/15 px-4 py-2.5 hairline-b flex items-start gap-2.5">
          <Bus className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {flight.multiHubAlternative.badgeText}:
            </span>
            <span className="text-zinc-600 dark:text-zinc-300 ml-1">
              {flight.multiHubAlternative.groundTransport} ({flight.multiHubAlternative.groundPrice} ₽) + рейс за {flight.multiHubAlternative.flightPrice.toLocaleString('ru-RU')} ₽.
            </span>
          </div>
        </div>
      )}

      {/* Top Bar: Airlines & Actions */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between hairline-b">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-black dark:text-white tracking-tight">
            {flight.airlines.join(', ')}
          </span>
          {flight.isCheapest && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400">
              Лучшая цена
            </span>
          )}
          {flight.isFastest && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
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
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full pressable ${
              isFavorite ? 'text-red-500' : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
            aria-label="Избранное"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Expert Verdict Box */}
      <div className="mx-4 mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hairline-b">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            {flight.verdict.action === 'buy_now' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
            <span className={`text-xs font-bold ${
              flight.verdict.action === 'buy_now' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
            }`}>
              {flight.verdict.badgeTitle}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">
            Точность {flight.verdict.confidencePercent}%
          </span>
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">
          {flight.verdict.explanation}
        </p>
      </div>

      {/* Flight Schedule Details */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[22px] font-bold text-black dark:text-white tracking-tight tabular">
              {flight.departureTime}
            </div>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">
              {flight.fromCode}
            </div>
            <div className="text-[11px] text-zinc-400 truncate max-w-[90px]">
              {flight.fromCity}
            </div>
          </div>

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
            <button
              onClick={() => {
                haptic.selection();
                setShowTimeline(!showTimeline);
              }}
              className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-medium pressable"
            >
              {flight.stopsCount === 0
                ? 'Прямой рейс'
                : `${flight.stopsCount} пересадка (${flight.layovers.map(l => l.city).join(', ')}) ↓`}
            </button>
          </div>

          <div className="text-right">
            <div className="text-[22px] font-bold text-black dark:text-white tracking-tight tabular">
              {flight.arrivalTime}
            </div>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">
              {flight.toCode}
            </div>
            <div className="text-[11px] text-zinc-400 truncate max-w-[90px]">
              {flight.toCity}
            </div>
          </div>
        </div>

        {/* 3. Visual Transfer Timeline (Наглядный таймлайн пересадки) */}
        {flight.stopsCount > 0 && showTimeline && (
          <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-black/[0.04] dark:border-white/[0.06] space-y-2 text-xs">
            {/* Segment 1 */}
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{flight.segments[0]?.departureTime}</span>
                <span>{flight.segments[0]?.departureCity} ({flight.segments[0]?.departureAirport})</span>
                {flight.segments[0]?.departureTerminal && (
                  <span className="text-[10px] text-zinc-400">Терминал {flight.segments[0]?.departureTerminal}</span>
                )}
              </div>
              <span className="text-[11px] text-zinc-400">{flight.segments[0]?.duration}</span>
            </div>

            {/* Layover Middle Node */}
            <div className="my-1.5 py-2 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-l-2 border-orange-500 space-y-1">
              <div className="flex items-center justify-between font-medium text-black dark:text-white">
                <span>⏱ Стыковка {flight.layovers[0]?.duration} в аэропорту {flight.layovers[0]?.airportCode} ({flight.layovers[0]?.city})</span>
              </div>

              {/* Terminal change warning */}
              {flight.layovers[0]?.terminalChange && (
                <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>{flight.layovers[0].terminalChange}</span>
                </div>
              )}

              {/* Baggage recheck warning */}
              {flight.baggageRecheck ? (
                <div className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                  <span>Повторная сдача багажа (самостоятельная стыковка). Нужно забрать багаж и снова сдать.</span>
                </div>
              ) : (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  <span>Сквозная регистрация: багаж летит до конечного пункта.</span>
                </div>
              )}

              {/* Transit visa note */}
              <div className="text-[10px] text-zinc-500">
                🛂 {flight.transitVisaNote}
              </div>
            </div>

            {/* Segment 2 */}
            {flight.segments[1] && (
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{flight.segments[1]?.departureTime}</span>
                  <span>{flight.segments[1]?.departureCity} → {flight.segments[1]?.arrivalCity} ({flight.segments[1]?.arrivalAirport})</span>
                </div>
                <span className="text-[11px] text-zinc-400">{flight.segments[1]?.duration}</span>
              </div>
            )}
          </div>
        )}

        {/* Baggage status pill */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Luggage className="w-3.5 h-3.5" />
          <span>{flight.baggageIncluded ? 'Багаж 23 кг включен' : 'Тариф без багажа (только ручная кладь 10 кг)'}</span>
        </div>

        {/* Price & Checkout Row */}
        <div className="mt-3.5 pt-3 hairline-t flex items-center justify-between">
          <div>
            <div className="text-[22px] font-bold text-black dark:text-white tracking-tight tabular">
              {flight.bestPrice.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[11px] text-zinc-400">
              Средняя цена: {flight.averageMarketPrice.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <a
            href={flight.sellers[0]?.bookingUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic.medium()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-[13px] tracking-tight flex items-center gap-1.5 pressable"
          >
            <span>Купить</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Compare All Sellers */}
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
