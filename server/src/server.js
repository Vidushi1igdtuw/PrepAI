const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config/config');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const seedDatabase = require('./seed/seedData');

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const aiRoutes = require('./routes/aiRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const studyRoutes = require('./routes/studyRoutes');
const noteRoutes = require('./routes/noteRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: config.nodeEnv === 'production' ? config.clientUrl : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', generalLimiter);

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'PrepAI — Your Personal AI Learning & Career Assistant',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 PrepAI Backend API running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🤖 AI Provider Target: ${config.ollamaHost} (${config.ollamaModel})`);
      console.log(`=================================================`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
