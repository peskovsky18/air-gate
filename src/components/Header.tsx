import React from 'react';
import { Plane, Radio, Bell } from 'lucide-react';
import { getTelegramUser, haptic } from '../lib/telegram';

interface HeaderProps {
  activeTab: 'search' | 'subscriptions' | 'explore' | 'favorites';
  onTabChange: (tab: 'search' | 'subscriptions' | 'explore' | 'favorites') => void;
  subscriptionsCount: number;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  subscriptionsCount,
  favoritesCount,
}) => {
  const user = getTelegramUser();

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 pb-2 glass-panel border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand & Market Scan Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">AIR Gate</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                Радар цен
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>Рынок: 42 продавца онлайн</span>
            </div>
          </div>
        </div>

        {/* Telegram User Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              haptic.selection();
              onTabChange('subscriptions');
            }}
            className="relative p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 pressable"
            title="Мои подписки"
          >
            <Bell className="w-4 h-4" />
            {subscriptionsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {subscriptionsCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-black/[0.04] dark:border-white/[0.06]">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white uppercase">
              {user.firstName[0]}
            </div>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[80px] truncate">
              {user.firstName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
