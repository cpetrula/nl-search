/**
 * Example Vite configuration for using nl-search in a browser environment
 * 
 * While nl-search uses browser-native NLP libraries (compromise and @skyra/jaro-winkler),
 * Vite may need to optimize these dependencies explicitly to avoid "Outdated Optimize Dep" errors.
 * 
 * This configuration is recommended for Vite-based projects (Vue, React, etc.).
 */

import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    // Explicitly include nl-search and its dependencies for optimization
    // This prevents "Outdated Optimize Dep" errors in Vite
    include: [
      'nl-search',
      'compromise',
      '@skyra/jaro-winkler'
    ]
  }
})
