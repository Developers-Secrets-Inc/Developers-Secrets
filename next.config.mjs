import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: true,
    ppr: 'incremental', // Enable experimental Partial Prerendering
    instrumentationHook: true, // Added for Sentry
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: false, // Disable strict mode for BlockNote compatibility
  turbopack: {
    // Add Turbopack-specific options here if needed
    // Example: enable css support if not automatically handled
    // rules: {
    //   '*.css': {
    //     loaders: ['css-loader'],
    //     as: 'css',
    //   },
    // },
  },
}

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(withPayload(nextConfig), {
  org: 'nesalia-inc',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !process.env.CI,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
})
