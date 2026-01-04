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
  // Ensure path aliases work in Vercel - use absolute path resolution
  webpack: (config, { defaultLoaders }) => {
    const projectRoot = __dirname
    
    // Override alias to ensure it works in Vercel
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': projectRoot,
    }
    
    // Add project root to module resolution
    if (Array.isArray(config.resolve.modules)) {
      config.resolve.modules = [projectRoot, ...config.resolve.modules]
    } else {
      config.resolve.modules = [projectRoot, 'node_modules']
    }
    
    return config
  },
}

export default nextConfig

