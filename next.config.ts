import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.alias = {
            ...config.resolve.alias,
            'genkit-cli/init': false,
        };
    }
    // config.externals.push('mapbox-gl');
    return config
  }
};

export default nextConfig;
