import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: true,
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

export default withPayload(nextConfig)
