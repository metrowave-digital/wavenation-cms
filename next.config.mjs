/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: 'standalone',

  webpack: (config) => {
    config.externals.push({
      '@ffprobe-installer/ffprobe': 'commonjs @ffprobe-installer/ffprobe',
    })
    return config
  },
}

export default nextConfig
