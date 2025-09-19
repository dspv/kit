/**
 * Lighthouse CI Configuration - RepoKIT Standards
 * Performance budgets: LCP ≤ 2.5s, TBT ≤ 200ms, CLS ≤ 0.1
 */

module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      // RepoKIT Performance Requirements
      assertions: {
        // Core Web Vitals - RepoKIT Standards
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // ≤ 2.5s
        'total-blocking-time': ['error', { maxNumericValue: 200 }],        // ≤ 200ms
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],    // ≤ 0.1

        // Performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],     // ≤ 1.8s
        'speed-index': ['warn', { maxNumericValue: 3000 }],                // ≤ 3.0s
        'interactive': ['warn', { maxNumericValue: 3800 }],                // ≤ 3.8s

        // Accessibility - RepoKIT Requirements
        'categories:accessibility': ['error', { minScore: 0.9 }],          // ≥ 90%
        'color-contrast': 'error',
        'heading-order': 'error',
        'label': 'error',
        'link-name': 'error',

        // Best practices
        'categories:best-practices': ['warn', { minScore: 0.8 }],          // ≥ 80%
        'uses-https': 'error',
        'is-on-https': 'error',

        // SEO
        'categories:seo': ['warn', { minScore: 0.8 }],                     // ≥ 80%
        'meta-description': 'warn',
        'document-title': 'error',

        // Performance optimizations
        'unused-javascript': ['warn', { maxNumericValue: 100000 }],       // ≤ 100KB
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }],         // ≤ 50KB
        'modern-image-formats': 'warn',
        'efficient-animated-content': 'warn',
        'offscreen-images': 'warn',
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',

        // Network optimizations
        'uses-text-compression': 'error',
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',

        // Caching
        'uses-long-cache-ttl': 'warn',

        // Security
        'is-crawlable': 'warn',
        'robots-txt': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: './reports/lighthouse',
    },
  },
};