import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages 會把網站放在 https://<帳號>.github.io/<repo>/ 底下，
 * 因此打包時需要指定子路徑。本機開發（npm run dev）仍使用根路徑。
 * 若之後改用自訂網域或 <帳號>.github.io 這類根網域，把 VITE_BASE 設成 / 即可。
 */
const base = process.env.VITE_BASE ?? '/Order/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? base : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
}));
