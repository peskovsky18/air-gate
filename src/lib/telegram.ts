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

export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) return null;

  try {
    tg.ready();
    tg.expand();
    // Enable closing confirmation to prevent accidental loss
    if (tg.enableClosingConfirmation) {
      tg.enableClosingConfirmation();
    }
  } catch (e) {
    console.warn('Telegram WebApp init warning:', e);
  }
  return tg;
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
      firstName: user.first_name || 'Путешественник',
      lastName: user.last_name || '',
      username: user.username || 'user',
      languageCode: user.language_code || 'ru',
      photoUrl: user.photo_url || null,
    };
  }
  // Default mock user for browser preview
  return {
    id: 'tg_guest_7721',
    firstName: 'Алексей',
    lastName: '',
    username: 'alex_travel',
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
