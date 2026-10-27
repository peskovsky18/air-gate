import React from 'react';
import { Bell } from 'lucide-react';
import { getTelegramUser, haptic } from '../lib/telegram';

interface HeaderProps {
  activeTab: 'search' | 'subscriptions' | 'explore' | 'favorites';
  onTabChange: (tab: 'search' | 'subscriptions' | 'explore' | 'favorites') => void;
  subscriptionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  subscriptionsCount,
}) => {
  const user = getTelegramUser();

  return (
    <header className="sticky top-0 z-40 ios-chrome hairline-b px-4 py-2.5 transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand identity: bold typographic logo with architectural airport terminal feel */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[13px] tracking-tighter shadow-sm">
            AG
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[19px] font-black tracking-tight text-black dark:text-white uppercase leading-none">
              AIR
            </span>
            <span className="text-[11px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 tracking-widest leading-none">
              GATE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Market Scanning Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wide uppercase font-mono">LIVE MARKET</span>
          </div>

          {activeTab !== 'subscriptions' && (
            <button
              onClick={() => {
                haptic.selection();
                onTabChange('subscriptions');
              }}
              className="relative p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white pressable"
              aria-label="Подписки"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              {subscriptionsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          )}

          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white flex items-center justify-center text-[11px] font-bold uppercase tracking-tight">
            {user.firstName[0]}
          </div>
        </div>
      </div>
    </header>
  );
};
