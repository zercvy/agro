


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

import authRoutes from './routes/user/authRoutes';
import plotRoutes from './routes/plot/plotRoutes';
import windowsillRoutes from './routes/windowsillRoutes';
import potPlantRoutes from './routes/potPlantRoutes';
import weatherRouter from './routes/weather';
import adminRoutes from './routes/admin/adminRoutes';
import userCultureRoutes from './routes/culture/userCultureRoutes';
import cultureRoutes from './routes/culture/cultureRoutes';
import userObjectRoutes from './routes/userObjectRoutes';


import { authLimiter, generalLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// === CORS ===
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// === Основные middleware ===
app.use(express.json());
app.use(cookieParser());

// === CSRF ===
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: false // ставь true на проде (https)
  }
});

 // === Все API: ===
app.use('/api/cultures',       cultureRoutes);       // GET /api/cultures
app.use('/api/user/cultures',  userCultureRoutes);  // GET|POST /api/user/cultures
app.use('/api/user/objects', userObjectRoutes);

// === Rate Limiting ===
app.use('/api/register', authLimiter);
app.use('/api/login', authLimiter);
app.use('/api/logout', authLimiter);
app.use('/api', generalLimiter); // общий лимит на API

// === CSRF-маршруты ===
app.use('/api/register', csrfProtection);
app.use('/api/login', csrfProtection);
app.use('/api/logout', csrfProtection);
app.use('/api/plots', csrfProtection);
app.use('/api/admin/login', csrfProtection);

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/api/admin/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// === Маршруты ===
app.use('/api', authRoutes);
app.use('/api', plotRoutes);
app.use('/api/windowsills', windowsillRoutes);
app.use('/api/pots', potPlantRoutes);
app.use('/api/weather', weatherRouter);
app.use('/api/admin', adminRoutes);



app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
