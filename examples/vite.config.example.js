/**
 * Example Vite configuration for using nl-search in a browser environment
 * 
 * Starting from nl-search v1.0.0, the package uses selective imports from the natural library,
 * which should work with most bundlers without special configuration.
 * 
 * This example configuration is provided for edge cases or if you encounter issues.
 * In most cases, you won't need any special Vite configuration.
 */

import { defineConfig } from 'vite'

export default defineConfig({
  // Optional: Only needed if you encounter bundling issues
  // optimizeDeps: {
  //   exclude: ['natural']
  // },
  
  // Define polyfills for Node.js globals if needed
  define: {
    'process.env': {},
    'global': 'globalThis'
  }
})
