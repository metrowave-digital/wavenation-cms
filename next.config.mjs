import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // REQUIRED for `.next/standalone` output
  output: 'standalone',

  experimental: {
    // Helps Payload + Next.js work well together
    serverMinification: false,
    optimizeCss: true,
    typedRoutes: false,
  },

  webpack: (config) => {
    // Fix for .cjs / .cts / .mjs resolution issues
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },
}

// Export using Payload wrapper
export default withPayload(nextConfig, {
  // Prevent bundling server packages in dev
  devBundleServerPackages: false,

  // Ensures standalone server works in docker
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
})
