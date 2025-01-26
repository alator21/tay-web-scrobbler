import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  // @ts-expect-error type error for some reason - although it works
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  extensionApi: "chrome",
  manifestVersion: 3,
  manifest: {
    name: "Tay Web Scrobbler",
    version: "0.0.1",
    permissions: ["identity", "storage"],
    host_permissions: [
      "https://www.last.fm/*",
      "https://ws.audioscrobbler.com/*",
    ],
  },
  modules: ["@wxt-dev/module-react"],
});
