import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const INITIAL_PORT = Number(process.env.PORT) || 5001;

// Connect to MongoDB Atlas
await connectDB();

const app = createApp();
let server = null;

const startServer = (port) => {
  server = app.listen(port, () => {
    console.log(`
=====================================================
  🎡 MY SPECZ - SPECTACLE SPIN WHEEL BACKEND API
=====================================================
  🚀 Server running on: http://localhost:${port}
  📡 Environment:       ${process.env.NODE_ENV || 'development'}
  🏥 Healthcheck:       http://localhost:${port}/api/health
  👥 Leads Endpoint:    http://localhost:${port}/api/leads
  🎯 Spin Wheel API:    http://localhost:${port}/api/spin
  🏆 Prizes Config:     http://localhost:${port}/api/prizes
  📊 Admin Stats:       http://localhost:${port}/api/admin/stats
=====================================================
    `);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`\n⚠️  Port ${port} is in use (on macOS, port 5000 is reserved by AirPlay Receiver).`);
      console.warn(`🔄 Automatically trying port ${nextPort}...\n`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(INITIAL_PORT);

// Handle graceful shutdown
const shutdown = () => {
  console.log('\nGracefully shutting down backend server...');
  if (server) {
    server.close(() => {
      console.log('Backend server stopped.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

