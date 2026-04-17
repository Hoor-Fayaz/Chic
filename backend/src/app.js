const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const { loadEnv } = require('./config/env');
const { connectDB } = require('./config/db');

// Initialization moved to server.js for better async handling

const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const passport = require('passport');
require('./config/passport');

const app = express();

// Security & common middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "http://localhost:3000", "http://127.0.0.1:3000"],
    },
  },
}));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ].filter(Boolean);

      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// STRIPE WEBHOOK: Must be before express.json() for raw body access
app.post('/api/v1/orders/stripe/webhook', express.raw({ type: 'application/json' }), require('./controllers/order.controller').handleStripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Optimized rate limiter for dashboard usage
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 1000 requests per 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// API routes
app.use('/api/v1', apiRoutes);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

