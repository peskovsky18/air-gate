import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingDown } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/airports';
import { haptic } from '../lib/telegram';

interface AnywhereExploreProps {
  fromCity: string;
  onSelectDestination: (dest: { city: string; code: string }) => void;
}

export const AnywhereExplore: React.FC<AnywhereExploreProps> = ({
  fromCity,
  onSelectDestination,
}) => {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Куда угодно из {fromCity}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Самые выгодные направления с минимальными тарифами
          </p>
        </div>
      </div>

      {/* Grid of Destination Cards */}
      <div className="grid grid-cols-2 gap-3">
        {POPULAR_DESTINATIONS.map((dest) => (
          <motion.div
            key={dest.code}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              haptic.medium();
              onSelectDestination({ city: dest.city, code: dest.code });
            }}
            className="group relative rounded-3xl overflow-hidden glass-card border border-black/[0.06] dark:border-white/[0.08] shadow-subtle cursor-pointer pressable"
          >
            {/* Background Image */}
            <div className="h-32 w-full overflow-hidden relative">
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/20">
                {dest.code}
              </div>
            </div>

            {/* Destination Content */}
            <div className="p-3">
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                {dest.city}
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                {dest.country}
              </div>

              <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                    от
                  </div>
                  <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    {dest.minPrice.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
