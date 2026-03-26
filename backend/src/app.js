const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const { loadEnv } = require('./config/env');
const { connectDB } = require('./config/db');

loadEnv();
connectDB();

const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const passport = require('passport');
require('./config/passport');

const app = express();

// Security & common middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
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

