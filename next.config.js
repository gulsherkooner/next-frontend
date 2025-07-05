/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/search/:path*',
        destination: 'http://localhost:3001/search/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:3001/auth/:path*',
      },
      {
        source: '/posts/:path*',
        destination: 'http://localhost:3001/posts/:path*',
      },
      {
        source: '/comments/:path*',
        destination: 'http://localhost:3001/comments/:path*',
      },
      {
        source: '/postLikes/:path*',
        destination: 'http://localhost:3001/postLikes/:path*',
      },
      {
        source: '/stories/:path*',
        destination: 'http://localhost:3001/stories/:path*',
      },
      {
        source: '/views/:path*',
        destination: 'http://localhost:3001/views/:path*',
      },
      {
        source: '/date/:path*',
        destination: 'http://localhost:3001/date/:path*',
      },
      {
        source: '/messages/:path*',
        destination: 'http://localhost:3001/messages/:path*',
      },
      {
        source: '/followers/:path*',
        destination: 'http://localhost:3001/followers/:path*',
      },
      {
        source: '/memberships/:path*',
        destination: 'http://localhost:3001/memberships/:path*',
      },
    ];
  },
};

module.exports = nextConfig;