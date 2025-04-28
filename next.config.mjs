/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.lorem.space'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'a0.muscache.com'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc'
      },
      {
        protocol: 'https',
        hostname: 'placebear.com'
      },
      {
        protocol: 'https',
        hostname: 'd2624e1ctn5kcl.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'qbank.csprep.in'
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me'
      }
    ]
  },
  reactStrictMode: false
};

export default nextConfig;
