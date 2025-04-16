import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    solidPlugin(),
    tsconfigPaths(),
    Icons({ compiler: "solid" }),
    TanStackRouterVite({ target: "solid", autoCodeSplitting: true }),
  ],
  server: {
    open: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
  test: {
    setupFiles: ["./src/testing/vitest.setup.ts"],
  },
});
