import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: "0.0.0.0",
    allowedHosts: [process.env.ORIGIN_DOMAIN ?? "imss.dukehomelab.site"],
    port: 4173,
  },
});
