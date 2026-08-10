import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // instrumentationHook enables instrumentation.ts register() for startup migrations
  experimental: {
    instrumentationHook: true,
  },
}

export default nextConfig
