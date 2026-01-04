import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure API routes work correctly on Vercel
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Critical: Configure webpack to resolve @ alias for Vercel
  webpack: (config, { dir }) => {
    // Use dir parameter which is the project root in Vercel builds
    const projectRoot = dir || path.resolve(process.cwd())
    
    // Override alias - must be absolute path
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': projectRoot,
    }
    
    return config
  },
}

export default nextConfig
