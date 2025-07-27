import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add Webpack resolution fixes
  webpack: (config) => {
    config.resolve.symlinks = true; // Fix module resolution
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/pdfjs-dist/,
      type: 'javascript/auto',
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xypbinamxunmwkhlvefd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add these new configurations
  experimental: {
    webpackBuildWorker: true, // Enable parallel builds
    optimizePackageImports: ["pdfjs-dist"], // Optimize heavy package
  },
  // Remove swcMinify if not needed or set it to true
  // swcMinify: false, // Disable problematic minifier
};

export default nextConfig;
