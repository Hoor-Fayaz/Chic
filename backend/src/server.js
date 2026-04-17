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

    // 2. Connect to the database first
    await connectDB();

    // 3. Start listening after DB is ready
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Backend API server running on port ${PORT}`);
      console.log(`🌐 Accessible at: http://localhost:${PORT}/api/v1`);
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
