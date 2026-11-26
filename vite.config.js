import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

export default defineConfig({
  plugins: [react()],
  resolve: {
    // a few components were first written for Framer; this tiny file stands in for its library
    alias: { framer: fileURLToPath(new URL("./src/lib/framer-shim.js", import.meta.url)) },
  },
})
