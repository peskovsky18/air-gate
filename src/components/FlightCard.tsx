import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Plane,
  ArrowRight,
  Send,
  Bus,
  CheckCircle2,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { Flight } from '../types';
import { formatDateDisplayRu } from '../lib/dateUtils';
import { haptic, openExternalLink } from '../lib/telegram';
import { ShareModal } from './ShareModal';

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
  const [showAllSellers, setShowAllSellers] = useState(false);
  const [showTimeline, setShowTimeline] = useState(flight.stopsCount > 0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.medium();
    setIsShareModalOpen(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.selection();
    onToggleFavorite(flight.id);
  };

  const handleBookClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    openExternalLink(url || flight.marketAnalysis.bestSellerUrl);
  };

  const isMultiHub = Boolean(flight.multiHubAlternative);
  const isCharter = flight.flightType === 'charter';
  const isSmartCombo = flight.flightType === 'smart_combination';
  const formattedFlightDate = formatDateDisplayRu(flight.departureDate);

  // Sellers to display in the compact price comparison list (top 3 or all)
  const displayedSellers = showAllSellers ? flight.sellers : flight.sellers.slice(0, 3);

  return (
    <>
      <div className={`ios-card mb-4 mx-4 overflow-hidden border ${
        isCharter ? 'border-amber-500/50' : isSmartCombo ? 'border-purple-500/50' : isMultiHub ? 'border-blue-500/50' : 'border-black/[0.08] dark:border-white/[0.12]'
      }`}>
        {/* 1. Multi-Hub Ground+Flight Banner */}
        {flight.multiHubAlternative && (
          <div className="bg-blue-600/20 dark:bg-blue-500/25 px-4 py-2.5 hairline-b flex items-start gap-2.5">
            <Bus className="w-4 h-4 text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-blue-950 dark:text-blue-200">
                {flight.multiHubAlternative.badgeText}:
              </span>
              <span className="text-zinc-800 dark:text-zinc-200 ml-1">
                {flight.multiHubAlternative.groundTransport} ({flight.multiHubAlternative.groundPrice.toLocaleString('ru-RU')} ₽) + перелет ({flight.multiHubAlternative.flightPrice.toLocaleString('ru-RU')} ₽).
              </span>
            </div>
          </div>
        )}

        {/* Top Bar: Route, Flight Info & Actions */}
        <div className="px-4 pt-3.5 pb-2.5 flex items-start justify-between hairline-b">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[18px] font-black text-black dark:text-white tracking-tight">
                {flight.fromCity}
              </span>
              <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.8] flex-shrink-0" />
              <span className="text-[18px] font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {flight.toCity}
              </span>
              <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                ({flight.fromCode}–{flight.toCode})
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-600 dark:text-zinc-300 flex-wrap">
              <span className="font-bold text-black dark:text-white">{flight.airlines.join(', ')}</span>
              {flight.segments[0]?.flightNumber && (
                <>
                  <span>•</span>
                  <span className="font-mono text-zinc-600 dark:text-zinc-300 font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800">
                    {flight.segments[0].flightNumber}
                  </span>
                </>
              )}
              <span>•</span>
              <span className="font-medium capitalize">{formattedFlightDate}</span>
              {flight.isCheapest && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300">
                  Лучшая цена
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            <button
              onClick={handleShareClick}
              className="p-2 rounded-full text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 pressable"
              aria-label="Поделиться с близкими"
              title="Отправить в чат"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full pressable ${
                isFavorite ? 'text-red-500' : 'text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              aria-label="Избранное"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Flight Schedule */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[28px] font-black text-black dark:text-white tracking-tight tabular leading-none">
                {flight.departureTime}
              </div>
              <div className="text-[13px] font-mono font-black text-blue-600 dark:text-blue-400 mt-1">
                {flight.fromCode}
              </div>
              <div className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[120px]">
                {flight.fromCity}
              </div>
            </div>

            <div className="flex-1 px-4 flex flex-col items-center">
              <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 mb-1 tabular">
                {flight.durationTotal}
              </span>
              <div className="w-full flex items-center relative">
                <div className="h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 relative">
                  {flight.stopsCount > 0 && (
                    <div className="absolute left-[50%] -top-[3px] -translate-x-[50%] w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-zinc-900" />
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  haptic.selection();
                  setShowTimeline(!showTimeline);
                }}
                className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-bold pressable"
              >
                {flight.stopsCount === 0
                  ? 'Прямой рейс'
                  : `${flight.stopsCount} пересадка (${flight.layovers.map(l => l.city).join(', ')}) ↓`}
              </button>
            </div>

            <div className="text-right">
              <div className="text-[28px] font-black text-black dark:text-white tracking-tight tabular leading-none">
                {flight.arrivalTime}
              </div>
              <div className="text-[13px] font-mono font-black text-blue-600 dark:text-blue-400 mt-1">
                {flight.toCode}
              </div>
              <div className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[120px]">
                {flight.toCity}
              </div>
            </div>
          </div>

          {/* Transfer Timeline */}
          {flight.stopsCount > 0 && showTimeline && (
            <div className="mt-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-black/[0.04] dark:border-white/[0.06] space-y-2 text-xs">
              <div className="my-1 py-1.5 px-2.5 rounded-lg bg-zinc-200 dark:bg-zinc-900 border-l-2 border-orange-500 space-y-1">
                <div className="font-bold text-black dark:text-white">
                  ⏱ Стыковка {flight.layovers[0]?.duration} в {flight.layovers[0]?.airportCode} ({flight.layovers[0]?.city})
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Сквозная регистрация: багаж летит до конечного пункта.</span>
                </div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                  🛂 {flight.transitVisaNote}
                </div>
              </div>
            </div>
          )}

          {/* Perforated Boarding Pass Divider */}
          <div className="ticket-divider my-3" />

          {/* LIVE PRICES COMPARISON MATRIX FROM ALL SERVICES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pb-1">
              <span>КОТИРОВКИ СЕРВИСОВ</span>
              <span>ЖИВАЯ ЦЕНА</span>
            </div>

            <div className="space-y-1 divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {displayedSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="pt-2 first:pt-0 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-black dark:text-white flex items-center gap-1.5">
                      <span className="truncate">{seller.sellerName}</span>
                      {seller.price === flight.bestPrice && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 font-bold whitespace-nowrap">
                          ТОП-1
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      {seller.baggageIncluded ? 'С багажом 20 кг' : 'Тариф без багажа'} • Рейтинг {seller.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-black text-black dark:text-white tabular text-[13px]">
                        {seller.price.toLocaleString('ru-RU')} ₽
                      </div>
                      {seller.paymentForeign && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tabular">
                          €{seller.paymentForeign.amount}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleBookClick(e, seller.bookingUrl)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm pressable"
                    >
                      <span>Купить</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {flight.sellers.length > 3 && (
              <button
                onClick={() => {
                  haptic.selection();
                  setShowAllSellers(!showAllSellers);
                }}
                className="w-full pt-2 text-center text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1 pressable"
              >
                <span>{showAllSellers ? 'Скрыть других продавцов' : `Показать еще ${flight.sellers.length - 3} продавцов`}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllSellers ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Primary Quick Buy Button */}
          <div className="mt-3.5 pt-3 hairline-t flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
                ЛУЧШАЯ ЦЕНА
              </div>
              <div className="text-[24px] font-black text-black dark:text-white tracking-tight tabular leading-none mt-0.5">
                {flight.bestPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <button
              onClick={(e) => handleBookClick(e, flight.marketAnalysis.bestSellerUrl)}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-[13px] tracking-tight flex items-center gap-2 shadow-lg shadow-blue-600/25 pressable whitespace-nowrap"
            >
              <span>Купить за {flight.bestPrice.toLocaleString('ru-RU')} ₽</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        flight={flight}
      />
    </>
  );
};
