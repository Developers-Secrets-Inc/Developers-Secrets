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
}

export default withPayload(nextConfig)
