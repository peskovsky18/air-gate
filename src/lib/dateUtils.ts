// Safe date utilities avoiding timezone offsets with YYYY-MM-DD strings

export interface YMD {
  year: number;
  month: number; // 0-based: 0 = Jan, 11 = Dec
  day: number;
}

export const parseYMD = (str: string): YMD => {
  if (!str) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }
  const parts = str.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return { year: parts[0], month: parts[1] - 1, day: parts[2] };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
};

export const formatYMD = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

export const addDaysToYMD = (str: string, daysToAdd: number): string => {
  const ymd = parseYMD(str);
  const d = new Date(ymd.year, ymd.month, ymd.day);
  d.setDate(d.getDate() + daysToAdd);
  return formatYMD(d.getFullYear(), d.getMonth(), d.getDate());
};

export const getTodayYMD = (): string => {
  const now = new Date();
  return formatYMD(now.getFullYear(), now.getMonth(), now.getDate());
};

export const formatDateDisplayRu = (str: string): string => {
  if (!str) return '';
  const ymd = parseYMD(str);
  const d = new Date(ymd.year, ymd.month, ymd.day);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });
};

export const formatMonthYearRu = (year: number, month: number): string => {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });
};
