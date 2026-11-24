import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadRoutes from './routes/leadRoutes.js';
import spinRoutes from './routes/spinRoutes.js';
import prizeRoutes from './routes/prizeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

export const createApp = () => {
  const app = express();

  // CORS Configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, postman)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true); // Dev-friendly permissive CORS
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'spin-wheel-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Mount API modules
  app.use('/api/leads', leadRoutes);
  app.use('/api/spin', spinRoutes);
  app.use('/api/prizes', prizeRoutes);
  app.use('/api/admin', adminRoutes);

  // Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

