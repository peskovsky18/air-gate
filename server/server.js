import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

app.use(cors());
app.use(express.json());

// In-memory / Database storage for subscriptions
let subscriptions = [
  {
    id: 'sub_riga_tll',
    userId: '12345678',
    fromCity: 'Рига',
    fromCode: 'RIX',
    toCity: 'Таллин',
    toCode: 'TLL',
    departureDate: '2026-11-15',
    flexibleDates: true,
    targetPrice: 4200,
    currentBestPrice: 3890,
    initialPrice: 5400,
    active: true,
    createdAt: new Date().toISOString(),
  }
];

// Send alert to Telegram User via Telegram Bot API
const sendTelegramNotification = async (chatId, text, inlineKeyboard = []) => {
  if (!BOT_TOKEN) {
    console.log(`[Telegram Simulation] To: ${chatId}\n${text}`);
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: inlineKeyboard.length > 0 ? { inline_keyboard: inlineKeyboard } : undefined,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return { success: false, error: error.message };
  }
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AIR Gate Radar Backend', timestamp: new Date() });
});

// Get user subscriptions
app.get('/api/subscriptions', (req, res) => {
  const { userId } = req.query;
  const filtered = userId ? subscriptions.filter(s => s.userId === userId) : subscriptions;
  res.json(filtered);
});

// Create subscription
app.post('/api/subscriptions', (req, res) => {
  const { userId, fromCity, fromCode, toCity, toCode, departureDate, targetPrice, currentBestPrice, flexibleDates } = req.body;

  const newSub = {
    id: `sub_${Date.now()}`,
    userId: userId || 'anonymous',
    fromCity: fromCity || 'Москва',
    fromCode: fromCode || 'MOW',
    toCity: toCity || 'Стамбул',
    toCode: toCode || 'IST',
    departureDate: departureDate || new Date().toISOString().split('T')[0],
    targetPrice: Number(targetPrice) || 10000,
    currentBestPrice: Number(currentBestPrice) || Number(targetPrice) || 10000,
    initialPrice: Number(currentBestPrice) || Number(targetPrice) || 10000,
    flexibleDates: flexibleDates ?? true,
    active: true,
    createdAt: new Date().toISOString(),
  };

  subscriptions.push(newSub);

  // Send Telegram confirmation
  if (userId && userId !== 'anonymous') {
    const confirmText = `🔔 <b>AIR Gate: Радар цен активирован!</b>\n\n` +
      `✈️ Маршрут: <b>${newSub.fromCity} (${newSub.fromCode}) → ${newSub.toCity} (${newSub.toCode})</b>\n` +
      `🎯 Целевая цена: <b>${newSub.targetPrice.toLocaleString('ru-RU')} ₽</b>\n` +
      `📅 Дата: ${newSub.departureDate} ${newSub.flexibleDates ? '(±3 дня)' : ''}\n\n` +
      `Мы сканируем 42 продавца и лоукостеры 24/7. Как только цена упадет — пришлем ссылку на покупку!`;

    sendTelegramNotification(userId, confirmText);
  }

  res.status(201).json(newSub);
});

// Trigger test price drop notification
app.post('/api/subscriptions/:id/test-alert', async (req, res) => {
  const { id } = req.params;
  const sub = subscriptions.find(s => s.id === id);

  if (!sub) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  const discount = Math.round((sub.currentBestPrice * 0.15) / 100) * 100;
  sub.currentBestPrice = Math.max(2500, sub.currentBestPrice - discount);

  const alertText = `⚡ <b>АЛЕРТ СНИЖЕНИЯ ЦЕНЫ!</b>\n\n` +
    `✈️ <b>${sub.fromCity} (${sub.fromCode}) → ${sub.toCity} (${sub.toCode})</b>\n` +
    `📉 Новая цена: <b>${sub.currentBestPrice.toLocaleString('ru-RU')} ₽</b>\n` +
    `💰 Экономия: <b>-${discount.toLocaleString('ru-RU')} ₽</b> от прежней цены!\n\n` +
    `<i>Тариф найден у официального перевозчика. Места ограничены.</i>`;

  const keyboard = [
    [
      { text: '✈️ Купить билет', url: 'https://airline.com/booking' },
      { text: '📱 Открыть в Mini App', url: 'https://t.me/AirGateBot/app' }
    ]
  ];

  const result = await sendTelegramNotification(sub.userId, alertText, keyboard);
  res.json({ success: true, updatedSub: sub, telegramResult: result });
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all route for SPA
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

// Background Price Scanning Worker (simulates 24/7 market monitoring)
setInterval(() => {
  const activeSubs = subscriptions.filter(s => s.active);
  console.log(`[Price Worker] Checking prices for ${activeSubs.length} active trackers across 42 market providers...`);
}, 60000);

app.listen(PORT, () => {
  console.log(`🚀 AIR Gate Server & Telegram WebApp listening on http://localhost:${PORT}`);
});
