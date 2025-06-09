import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // Макс. 10 запросов на IP
  message: {
    message: 'Слишком много попыток с этого IP. Попробуйте позже.',
  },
  standardHeaders: true, // Отправляет info в заголовках
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 100, // Макс. 100 запросов на IP
  message: {
    message: 'Слишком много запросов. Подождите немного.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
