import type { UserConfig } from "vite";

const config: UserConfig = {
  base: "./",
  optimizeDeps: {
    include: [
      "semver/functions/gt",
      "semver/functions/gte",
      "semver/functions/lt",
      "semver/functions/clean",
    ],
  },
};

export default config;
