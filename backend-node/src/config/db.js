const mongoose = require('mongoose');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🗄️ DATABASE CONNECTION MANAGER (Mongoose / MongoDB)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PRINCIPLE: Connection Pooling & The Singleton Pattern
 * 
 * In relational databases (like PostgreSQL in our Spring Boot app), a connection
 * pool manager (HikariCP) maintains a fixed set of open TCP sockets.
 * 
 * In MongoDB, Mongoose maintains its own internal connection pool (default: 10 sockets).
 * We export a single async function that establishes the connection once at application
 * startup. All subsequent models (User, Product, Cart, Order) share this pool.
 */

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quantumcore_db');

    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host} (Port: ${conn.connection.port})\x1b[0m`);
    console.log(`\x1b[36m✔ Active Database: ${conn.connection.name}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✖ MongoDB Connection Error: ${error.message}\x1b[0m`);
    console.error(`\x1b[33m💡 Hint: Ensure MongoDB is installed and running, or provide a valid Atlas MONGO_URI in .env\x1b[0m`);
    // Exit process with failure code if database cannot connect
    process.exit(1);
  }
};

module.exports = connectDB;
