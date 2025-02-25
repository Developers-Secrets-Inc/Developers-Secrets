import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: true,
  },
}

export default withPayload(nextConfig)
