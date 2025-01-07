import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL, // Use environment variable
          secure: false,
          changeOrigin: true, // Add this to handle CORS if necessary
        }
      }
    },
    plugins: [react()],
  };
});
