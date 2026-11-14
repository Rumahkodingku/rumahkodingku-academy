import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/contract/**/*.test.ts"],
    fileParallelism: false,
    globals: true,
    hookTimeout: 60_000,
    testTimeout: 30_000,
    env: {
      NODE_ENV: "test",
      UPLOAD_ROOT: "/tmp/opencode/phase-3-uploads",
    },
  },
});
