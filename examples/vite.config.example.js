/**
 * Example Vite configuration for using nl-search in a browser environment
 * 
 * This configuration addresses the "Dynamic require of 'webworker-threads' is not supported" error
 * that occurs when the natural library's classifier modules are included in the bundle.
 * 
 * Copy this configuration to your project's vite.config.js file.
 */

import { defineConfig } from 'vite'

export default defineConfig({
  // Exclude natural from optimization to prevent bundling issues
  optimizeDeps: {
    exclude: ['natural']
  },
  
  // Define polyfills for Node.js globals
  define: {
    'process.env': {},
    'global': 'globalThis'
  },
  
  // Configure module resolution
  resolve: {
    alias: {
      // Optional: stub out problematic modules if needed
      // 'webworker-threads': '/path/to/webworker-threads-stub.js'
    }
  }
})
