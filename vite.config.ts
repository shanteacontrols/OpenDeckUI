import type { UserConfig } from "vite";

const config: UserConfig = {
  optimizeDeps: {
    include: ["semver/functions/gt"],
  },
};

export default config;
