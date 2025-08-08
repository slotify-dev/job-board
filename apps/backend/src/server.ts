import { env } from './config/env.js';
import { createApp } from './app.js';
import redisService from './services/redisService.js';

async function startServer() {
  try {
    // Initialize Redis connection
    await redisService.connect();
    console.log('Redis connected successfully');

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async () => {
      console.log('Shutting down gracefully...');

      server.close(async () => {
        try {
          await redisService.disconnect();
          console.log('Redis disconnected');
          console.log('Process terminated');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
