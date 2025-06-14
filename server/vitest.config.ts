import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
  test: {
    environment: 'node',
    env: loadEnv('test', process.cwd(), ''),
    setupFiles: ['./testing/vitest.setup.ts'],
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
  },
});
