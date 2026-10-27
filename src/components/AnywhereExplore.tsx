import React from 'react';
import { Compass, ChevronRight } from 'lucide-react';
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
    <div className="p-4 space-y-3">
      <div>
        <h2 className="text-[20px] font-bold text-black dark:text-white tracking-tight">
          Куда угодно из {fromCity}
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Самые низкие тарифы по открытым направлениям
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {POPULAR_DESTINATIONS.map((dest) => (
          <button
            key={dest.code}
            onClick={() => {
              haptic.medium();
              onSelectDestination({ city: dest.city, code: dest.code });
            }}
            className="ios-card overflow-hidden text-left pressable"
          >
            <div className="h-28 w-full overflow-hidden relative">
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono font-medium text-white">
                {dest.code}
              </div>
            </div>

            <div className="p-3">
              <div className="font-semibold text-[14px] text-black dark:text-white tracking-tight truncate">
                {dest.city}
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                {dest.country}
              </div>

              <div className="mt-2 pt-2 hairline-t flex items-center justify-between">
                <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400 tabular">
                  от {dest.minPrice.toLocaleString('ru-RU')} ₽
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
