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
  webpack: (config) => {
    // Use process.cwd() which is more reliable in Vercel build environment
    const projectRoot = path.resolve(process.cwd())
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': projectRoot,
    }
    
    return config
  },
}

export default nextConfig

