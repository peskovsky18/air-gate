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

  const getTitle = () => {
    switch (activeTab) {
      case 'search': return 'Поиск билетов';
      case 'subscriptions': return 'Подписки';
      case 'explore': return 'Куда угодно';
      case 'favorites': return 'Избранное';
    }
  };

  return (
    <header className="sticky top-0 z-40 ios-chrome hairline-b px-4 pt-3 pb-2 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tighter text-black dark:text-white leading-none">
            {getTitle()}
          </h1>
          <p className="text-[12px] font-normal text-zinc-500 dark:text-zinc-400 mt-0.5 tracking-tight">
            Сравнение всех доступных тарифов
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== 'subscriptions' && (
            <button
              onClick={() => {
                haptic.selection();
                onTabChange('subscriptions');
              }}
              className="relative p-2 rounded-full text-zinc-600 dark:text-zinc-300 pressable"
              aria-label="Подписки"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {subscriptionsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          )}

          <div className="w-8 h-8 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">
            {user.firstName[0]}
          </div>
        </div>
      </div>
    </header>
  );
};
