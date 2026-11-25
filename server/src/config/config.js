const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

// In production, require JWT_SECRET; in development, generate an ephemeral secret if missing rather than hardcoding
const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production.');
  }
  console.warn('[Security] JWT_SECRET not set in .env — using ephemeral dev secret.');
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/prepai',
  jwtSecret: getJwtSecret(),
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  judge0Host: process.env.JUDGE0_HOST || 'https://ce.judge0.com',
  judge0ApiKey: process.env.JUDGE0_API_KEY || '',
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: process.env.EMAIL_PORT || '587',
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  emailFrom: process.env.EMAIL_FROM || ''
};
