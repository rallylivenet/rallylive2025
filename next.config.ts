
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rallylive.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.rallylive.net',
        pathname: '/**',
      }
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
      '*.cluster-6frnii43o5blcu522sivebzpii.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
