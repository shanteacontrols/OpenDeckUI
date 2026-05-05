import type { UserConfig } from "vite";

const config: UserConfig = {
  base: "./",
  optimizeDeps: {
    include: [
      "semver/functions/gt",
      "semver/functions/lt",
      "semver/functions/clean",
    ],
  },
};

export default config;
