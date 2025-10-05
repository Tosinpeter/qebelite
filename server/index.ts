import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

async function startServer() {
  try {
    console.log('Starting Vite development server on port 5000...');
    
    const viteConfig = await import(resolve(projectRoot, 'vite.config.ts'));
    const baseConfig = viteConfig.default;
    
    const server = await createServer({
      ...baseConfig,
      configFile: false,
      server: {
        ...baseConfig.server,
        host: '0.0.0.0',
        port: 5000,
        allowedHosts: true,
        hmr: {
          clientPort: 443,
          host: process.env.REPLIT_DEV_DOMAIN || 'localhost',
        },
      },
    });

    await server.listen();
    server.printUrls();
  } catch (error) {
    console.error('Failed to start Vite:', error);
    process.exit(1);
  }
}

startServer();
