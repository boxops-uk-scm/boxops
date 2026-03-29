import { defineConfig } from 'vite'
import { reactRouter } from "@react-router/dev/vite";
import stylex from "@stylexjs/unplugin";
import relay from "vite-plugin-relay";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
    }),
    relay,
    reactRouter(),
  ],
  resolve: {
    // 1. Force Vite to aggressively resolve these to the exact same path
    dedupe: ["react", "react-dom"],
  },
  ssr: {
    // 2. You keep this: Vite processes Relay and its CJS generated code
    noExternal: ["react-relay", "relay-runtime", "@stylexjs/stylex"],
    
    optimizeDeps: {
      include: ["react-relay", "relay-runtime", "@stylexjs/stylex"],
      exclude: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },

    // 3. You add this: Force Vite to LEAVE REACT ALONE in the SSR bundle. 
    // This ensures both your app and the bundled Relay ask Node for React at runtime,
    // resulting in exactly ONE shared instance of React.
    external: [
      "react", 
      "react-dom", 
      "react/jsx-runtime", 
      "react/jsx-dev-runtime"
    ],
  },
  optimizeDeps: {
    // 4. Pre-bundle Relay for the client dev server to prevent waterfalls
    include: ["react-relay", "relay-runtime", "@stylexjs/stylex"],
  }
})
