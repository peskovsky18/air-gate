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
  CheckCircle2
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
  const [showSellers, setShowSellers] = useState(false);
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

  return (
    <>
      <div className={`ios-card mb-4 mx-4 overflow-hidden border ${
        isCharter ? 'border-amber-500/50' : isSmartCombo ? 'border-purple-500/50' : isMultiHub ? 'border-blue-500/50' : 'border-black/[0.08] dark:border-white/[0.12]'
      }`}>
        {/* 1. Charter Badge */}
        {isCharter && (
          <div className="bg-amber-500/20 dark:bg-amber-500/25 px-4 py-2 hairline-b flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
              <Plane className="w-3.5 h-3.5" />
              <span>Чартерные блоки туроператоров</span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-950 dark:text-amber-100">
              Скидки до 40%
            </span>
          </div>
        )}

        {/* 2. Smart Combo / Multi-Hub Banner */}
        {flight.multiHubAlternative && (
          <div className="bg-blue-600/20 dark:bg-blue-500/25 px-4 py-2.5 hairline-b flex items-start gap-2.5">
            <Bus className="w-4 h-4 text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-blue-950 dark:text-blue-200">
                {flight.multiHubAlternative.badgeText}:
              </span>
              <span className="text-zinc-800 dark:text-zinc-200 ml-1">
                {flight.multiHubAlternative.groundTransport} + европейский лоукостер.
              </span>
            </div>
          </div>
        )}

        {/* Top Bar: Route, Date, Provider & Actions */}
        <div className="px-4 pt-3.5 pb-2.5 flex items-start justify-between hairline-b">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[17px] font-black text-black dark:text-white tracking-tight">
                {flight.fromCity}
              </span>
              <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.5] flex-shrink-0" />
              <span className="text-[17px] font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {flight.toCity}
              </span>
              <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">
                ({flight.fromCode}–{flight.toCode})
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-600 dark:text-zinc-300 flex-wrap">
              <span className="font-bold text-black dark:text-white">{flight.airlines.join(', ')}</span>
              <span>•</span>
              <span className="font-medium capitalize">{formattedFlightDate}</span>
              {flight.isCheapest && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  Рекомендовано
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

        {/* Channel Details & Live Search Status */}
        <div className="p-4 pt-3 space-y-3">
          {/* Explanation Banner */}
          <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-black/[0.04] dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white mb-1">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{flight.verdict.badgeTitle}</span>
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                {flight.durationTotal}
              </span>
            </div>
            <p className="text-[12px] text-zinc-600 dark:text-zinc-300 leading-snug">
              {flight.verdict.explanation}
            </p>
          </div>

          {/* Key Advantages Tags */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>МИР / СБП / Карты РФ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>Живые цены без наценок</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 hairline-t flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold text-zinc-500 dark:text-zinc-400">
                Продавец: <strong className="text-black dark:text-white">{flight.marketAnalysis.bestSellerName}</strong>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                Реальные билеты и места
              </div>
            </div>

            <button
              onClick={(e) => handleBookClick(e, flight.marketAnalysis.bestSellerUrl)}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-[13px] tracking-tight flex items-center gap-2 shadow-md pressable whitespace-nowrap"
            >
              <span>Искать на {flight.marketAnalysis.bestSellerName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Actions: Compare Sellers & Share */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <button
              onClick={handleShareClick}
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold pressable"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Отправить маршрут близким</span>
            </button>

            {flight.sellers.length > 1 && (
              <button
                onClick={() => {
                  haptic.selection();
                  setShowSellers(!showSellers);
                }}
                className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 font-semibold pressable"
              >
                <span>Все варианты ({flight.sellers.length})</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showSellers ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Multiple Sellers Drawer */}
          <AnimatePresence>
            {showSellers && flight.sellers.length > 1 && (
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
                      <div className="font-bold text-black dark:text-white flex items-center gap-1.5">
                        <span>{seller.sellerName}</span>
                        {seller.sellerName === flight.marketAnalysis.bestSellerName && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                            ТОП-1
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {seller.isAirlineDirect ? 'Прямой сайт перевозчика' : 'Аккредитованный агент'} • Рейтинг {seller.rating}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleBookClick(e, seller.bookingUrl)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-[11px] font-bold text-black dark:text-white flex items-center gap-1 pressable"
                    >
                      <span>К поиску</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
