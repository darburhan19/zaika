import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  // When using cookies/credentials, CORS must not use '*'.
  const allowedOrigins = [
    process.env.CORS_ORIGIN,
    process.env.CLIENT_URL
  ]
    .flatMap((value) => (value ? value.split(',') : []))
    .map((value) => value.trim())
    .filter(Boolean);

  const isOriginAllowed = (requestOrigin) => {
    if (!requestOrigin) {
      return true;
    }

    if (allowedOrigins.length === 0) {
      return requestOrigin === 'http://localhost:5173';
    }

    return allowedOrigins.includes(requestOrigin);
  };


  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  // Important: don't use wildcard '*' when credentials are included
  app.options('*', cors({ credentials: true, origin: true }));

  app.use(
    cors({
      origin(requestOrigin, callback) {
        if (isOriginAllowed(requestOrigin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      // Increase dev limit to avoid blocking during local testing
      limit: process.env.NODE_ENV === 'production' ? 200 : 10000,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/api/health', (_, res) => {
    res.json({ ok: true, service: 'zaika-api' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
