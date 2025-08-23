import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@pudchat/core', '@pudchat/adapter-unified'],
}

export default nextConfig
