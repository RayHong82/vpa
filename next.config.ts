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
  // Ensure path aliases work in Vercel
  webpack: (config, { dir }) => {
    // Use the build directory as base, which is more reliable in Vercel
    const projectRoot = path.resolve(dir || process.cwd())
    
    // Resolve path aliases - this is critical for Vercel builds
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': projectRoot,
    }
    
    // Ensure proper module resolution
    config.resolve.modules = [
      projectRoot,
      ...(Array.isArray(config.resolve.modules) ? config.resolve.modules : []),
      'node_modules',
    ]
    
    return config
  },
}

export default nextConfig

