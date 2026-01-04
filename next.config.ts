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
  // Configure webpack to resolve path aliases - critical for Vercel
  webpack: (config, { dir, isServer }) => {
    // Use the build directory which is more reliable in Vercel
    const projectRoot = path.resolve(dir || process.cwd())
    
    // Force override the alias
    if (!config.resolve) {
      config.resolve = {}
    }
    
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': projectRoot,
    }
    
    // Ensure extensions include .ts and .tsx
    if (!config.resolve.extensions) {
      config.resolve.extensions = []
    }
    const extensions = new Set([
      ...config.resolve.extensions,
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
    ])
    config.resolve.extensions = Array.from(extensions)
    
    return config
  },
}

export default nextConfig

