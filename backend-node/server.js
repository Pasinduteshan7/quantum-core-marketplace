/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ⚡ QUANTUM CORE — NODE.JS / EXPRESS / MONGODB REST BACKEND
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL ROLE IN THE TRI-BACKEND SYSTEM:
 * 
 * Port: 5000 (Base URL: http://localhost:5000/api)
 * Frontend Adapter: frontend/src/services/api.ts (BACKEND_CONFIG.node)
 * 
 * Core Strengths:
 * 1. Ultra-fast non-blocking I/O event loop for high-frequency catalog queries.
 * 2. Schema-flexible MongoDB documents for complex laptop/PC specifications.
 * 3. Complete parity with Spring Boot API contracts (/api/auth, /api/products, /api/cart, /api/orders).
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const seedDatabase = require('./src/config/seeder');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Initialize Express Application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and Seed Initial Data
const initializeDatabase = async () => {
  await connectDB();
  await seedDatabase();
};
initializeDatabase();

// ════════════════════════════════════════════════════════════════════════════════
// ⛓️ THE MIDDLEWARE PIPELINE (Chain of Responsibility Pattern)
// ════════════════════════════════════════════════════════════════════════════════

// 1. CORS: Allow cross-origin requests from our Next.js frontend (Port 3000)
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body Parsers: Convert incoming byte streams into JavaScript objects (req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request Logger (Development Diagnostics)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[HTTP ${req.method}] ${req.originalUrl} — ${new Date().toLocaleTimeString()}`);
    next();
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// 🌐 API ROUTE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════════

// Health Check & System Status
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    engine: 'Quantum Core Node.js / Express',
    database: 'MongoDB',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root API Greeting
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Quantum Core Marketplace Node.js API Engine',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Mount Feature Routes (Exact parity with Spring Boot)
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));

// ════════════════════════════════════════════════════════════════════════════════
// 🛡️ ERROR HANDLING PIPELINE (The Safety Net)
// ════════════════════════════════════════════════════════════════════════════════
app.use(notFound);
app.use(errorHandler);

// ════════════════════════════════════════════════════════════════════════════════
// 🚀 SERVER LAUNCH
// ════════════════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`⚡ Quantum Core Node.js Engine running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`================================================================\n`);
});
