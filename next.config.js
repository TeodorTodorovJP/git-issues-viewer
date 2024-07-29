/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },

    images: {
      remotePatterns: [
        // https://avatars.githubusercontent.com/u/73050048?v=4
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/u/**',
        },
      ],
    },
  };

module.exports = nextConfig
