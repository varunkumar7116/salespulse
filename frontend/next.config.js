/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000/v1/:path*' 
          : 'http://backend:8000/v1/:path*',
      },
    ]
  },
}

module.exports = nextConfig
