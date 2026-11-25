const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter — 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please wait 15 minutes before trying again.',
  },
  skip: (req) => req.path === '/api/health',
});

/**
 * Auth rate limiter — 10 login/register attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
  },
});

/**
 * AI rate limiter — 60 AI requests per 10 minutes per IP
 * (Higher limit because streaming / notes generation involves multiple small requests)
 */
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait 10 minutes before sending more queries.',
  },
});

/**
 * Code execution rate limiter — 30 submissions per 5 minutes per IP
 * Prevents abuse of the Judge0 free tier quota
 */
const codeRunLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Code execution limit reached. Please wait 5 minutes before submitting again.',
  },
});

module.exports = { generalLimiter, authLimiter, aiLimiter, codeRunLimiter };
