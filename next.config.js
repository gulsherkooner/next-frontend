/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Only allow known Next.js routes; all others return 404
      // (nginx will handle API routes)
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-nextjs-route',
            value: 'true',
          },
        ],
        destination: '/:path*',
      },
      {
        source: '/:path*',
        destination: '/404',
      },
    ];
  },
};

module.exports = nextConfig;