import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const localServerlessApi = (): Plugin => ({
  name: 'toolsnest-local-serverless-api',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const pathname = new URL(request.url || '/', 'http://localhost').pathname;
      try {
        if (pathname === '/api/ai/health') {
          const { default: handler } = await import('./api/ai/health');
          await handler(request, response);
          return;
        }
        if (pathname === '/api/ai/generate') {
          const { default: handler } = await import('./api/ai/generate');
          await handler(request, response);
          return;
        }
      } catch (error) {
        server.config.logger.error(error instanceof Error ? error.stack || error.message : String(error));
        if (!response.headersSent) {
          response.statusCode = 500;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        response.end(JSON.stringify({ error: { code: 'LOCAL_API_FAILED', message: 'The local AI function failed.' } }));
        return;
      }
      next();
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const name of ['GEMINI_API_KEY', 'VITE_GEMINI_API_KEY', 'GEMINI_MODEL', 'APP_ORIGIN']) {
    if (!process.env[name] && env[name]) process.env[name] = env[name];
  }

  return {
    plugins: [react(), tailwindcss(), localServerlessApi()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
