/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.sspbruneck1.it',
      },
    ],
  },
};

export default nextConfig;
