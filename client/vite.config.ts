import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [solidPlugin(), tsconfigPaths(), Icons({ compiler: "solid" })],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  test: {
    setupFiles: ["./src/testing/vitest.setup.ts"],
  },
});
