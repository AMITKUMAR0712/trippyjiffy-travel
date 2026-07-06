import './utils/loadEnv.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import searchRoutes from './routes/searchRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { closeBrowser } from './scraper/emailScraper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5006;
const API_PREFIX = process.env.API_PREFIX || '/leads-api';

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'https://trippyjiffy.com',
  'https://www.trippyjiffy.com',
].filter(Boolean);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
});

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(API_PREFIX, limiter);

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({
    success: true,
    message: 'Travel Company Lead Extractor API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(API_PREFIX, searchRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Leads API running on http://localhost:${PORT}${API_PREFIX}`);
});

process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  server.close();
});

process.on('SIGINT', async () => {
  await closeBrowser();
  server.close();
  process.exit(0);
});

export default app;
