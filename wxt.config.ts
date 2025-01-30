import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import build from "./BUILD.json";

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
    description: "Last.fm scrobbler for YT music",
    version: `${build.version}`,
    permissions: ["identity", "storage"],
    host_permissions: [
      "https://www.last.fm/*",
      "https://ws.audioscrobbler.com/*",
    ],
  },
  modules: ["@wxt-dev/module-react"],
});
