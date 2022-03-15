import type { UserConfig } from "vite";

const config: UserConfig = {
  optimizeDeps: {
    include: [
      "semver/functions/gt",
      "semver/functions/lt",
      "semver/functions/clean",
    ],
  },
};

export default config;
