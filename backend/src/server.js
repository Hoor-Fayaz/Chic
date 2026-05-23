const http = require('http');
const { loadEnv } = require('./config/env');
const { connectDB } = require('./config/db');

// Load env first
loadEnv();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Load the app
    const app = require('./app');
    const server = http.createServer(app);

    // 2. Start listening immediately so frontend doesn't get connection refused
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Backend API server running on port ${PORT}`);
      console.log(`🌐 Accessible at: http://localhost:${PORT}/api/v1`);
      
      // 3. Connect to the database in the background
      connectDB()
        .then(() => console.log('✅ MongoDB connected successfully'))
        .catch(err => {
          console.error('❌ MongoDB connection failed:', err.message);
          console.log('⚠️ Server is running but database-dependent features will fail.');
        });
    });

    server.on('error', (error) => {
      // eslint-disable-next-line no-console
      if (error.code === 'EADDRINUSE') {
        console.error(`💥 Port ${PORT} is already in use.`);
      } else {
        console.error('💥 Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('💥 Critical failure during server startup:', error.message);
    process.exit(1);
  }
}

startServer();
