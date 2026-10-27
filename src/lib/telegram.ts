// Telegram WebApp SDK Helper

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const syncTheme = () => {
  const tg = getTelegramWebApp();
  const isDark = (tg && tg.colorScheme === 'dark') || (!tg && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const initTelegramApp = () => {
  syncTheme();

  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      if (typeof tg.onEvent === 'function') {
        tg.onEvent('themeChanged', syncTheme);
      }
      if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }

  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', syncTheme);
    }
  } catch (e) {}

  return tg;
};

// Open external link properly in Telegram WebApp
export const openExternalLink = (url: string) => {
  if (!url) return;
  haptic.medium();

  const tg = getTelegramWebApp();
  if (tg && typeof tg.openLink === 'function') {
    try {
      tg.openLink(url, { try_instant_view: false });
      return;
    } catch (e) {
      console.warn('Telegram openLink error:', e);
    }
  }

  // Fallback for regular browser
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Haptic feedback with safe fallback
export const haptic = {
  light: () => {
    try {
      getTelegramWebApp()?.HapticFeedback?.impactOccurred('light');
    } catch {}
  },
  medium: () => {
    try {
      getTelegramWebApp()?.HapticFeedback?.impactOccurred('medium');
    } catch {}
  },
  heavy: () => {
    try {
      getTelegramWebApp()?.HapticFeedback?.impactOccurred('heavy');
    } catch {}
  },
  success: () => {
    try {
      getTelegramWebApp()?.HapticFeedback?.notificationOccurred('success');
    } catch {}
  },
  warning: () => {
    try {
      getTelegramWebApp()?.HapticFeedback?.notificationOccurred('warning');
    } catch {}
  },
  selection: () => {
    try {
      getTelegramWebApp()?.HapticFeedback?.selectionChanged();
    } catch {}
  }
};

export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    return {
      id: String(user.id),
      firstName: user.first_name || 'Вы',
      lastName: user.last_name || '',
      username: user.username || 'user',
      languageCode: user.language_code || 'ru',
      photoUrl: user.photo_url || null,
    };
  }
  return {
    id: 'tg_guest_7721',
    firstName: 'Вы',
    lastName: '',
    username: 'traveler',
    languageCode: 'ru',
    photoUrl: null,
  };
};

export const shareToTelegram = (text: string, url: string = '') => {
  haptic.medium();
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url || window.location.href)}&text=${encodeURIComponent(text)}`;
  const tg = getTelegramWebApp();
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank');
  }
};
