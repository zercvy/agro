import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import authRoutes from './routes/authRoutes';
import plotRoutes from './routes/plotRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', plotRoutes);
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: false // true — если HTTPS
  }
});

// 🔹 Специальный маршрут только для получения токена
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 🔹 Применяем защиту только к POST/PUT/DELETE (и не к GET /csrf-token!)
app.use('/api/register', csrfProtection);
app.use('/api/login', csrfProtection);
app.use('/api/logout', csrfProtection);

app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
