/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: false },
  webpack: (config, { }) => {
    config.resolve.fallback = { 
      fs: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nllb-data.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
